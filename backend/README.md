# devjobs API

Self-hosted .NET 9 backend for the devjobs board. Serves a paginated, searchable, filterable set of job postings from a SQLite database, with OpenAPI documentation and production-grade middleware.

## Tech stack

- **.NET 9 / ASP.NET Core** — minimal APIs, top-level statements
- **Entity Framework Core 9** with **SQLite** — file-based database, zero external dependencies
- **Microsoft.AspNetCore.OpenApi** + **Scalar** — interactive API documentation
- **Output caching** — server-side response cache (60s TTL)
- **Health checks** — `/health` endpoint with database connectivity probe
- **CORS** — configurable allow-list, sourced from environment variables in production
- **ProblemDetails** (RFC 7807) — uniform error response shape across all failure paths
- **Forwarded headers** — proxy-aware request handling for cloud deployments
- **Docker** — multi-stage build, runs as non-root `app` user

## Quick start

```powershell
cd backend
dotnet run
```

The service listens on `http://localhost:5175`. Migrations apply on startup; the database seeds itself from `Data/jobs.json` on first run (idempotent).

Interactive docs: open `http://localhost:5175/scalar/v1` in a browser.

## Run with Docker locally

```powershell
docker build -t devjobs-api .
docker run --rm -p 8080:8080 devjobs-api
```

Then `http://localhost:8080/jobs`.

## API reference

### `GET /jobs`

Paginated, optionally filtered list of postings, newest first. Each item is a lightweight **summary** — just the fields a job card renders. Detail-only fields (description, requirements, role, website, apply link) are served by `GET /jobs/{id}`.

| Query param | Type   | Default | Notes                                                             |
| ----------- | ------ | ------- | ----------------------------------------------------------------- |
| `search`    | string | —       | Substring match (case-insensitive) on position title _or_ company |
| `location`  | string | —       | Substring match (case-insensitive) on country                     |
| `fullTime`  | bool   | `false` | When true, restricts to `Full Time` contracts                     |
| `page`      | int    | `1`     | Clamped to >= 1                                                   |
| `pageSize`  | int    | `12`    | Clamped to [1, 50]                                                |

**Example:** `GET /jobs?search=engineer&location=united&fullTime=true&page=1&pageSize=12`

```json
{
  "items": [
    {
      "id": 1,
      "company": "Scoot",
      "logo": "/logos/scoot.svg",
      "logoBackground": "hsl(36, 87%, 49%)",
      "position": "Senior Software Engineer",
      "postedAt": "2026-09-01T06:48:26.831+00:00",
      "contract": "Full Time",
      "location": "United Kingdom"
    }
  ],
  "page": 1,
  "pageSize": 12,
  "total": 3,
  "totalPages": 1,
  "hasMore": false
}
```

`hasMore` is what the Load More button binds to, so the client never has to compare `page` against `totalPages` itself.

### `GET /jobs/{id}`

Fetch a single posting by id. Returns `200 OK` with the summary fields plus `description`, `requirements`, `role`, `website` and `apply`. Both `requirements` and `role` are `{ content, items[] }`.

On a miss, `404 Not Found` with ProblemDetails JSON:

```json
{
  "type": "https://tools.ietf.org/html/rfc9110#section-15.5.5",
  "title": "Job not found",
  "status": 404,
  "detail": "No job posting with id 999."
}
```

### `GET /health`

Liveness + readiness probe. `200 Healthy` when the database is reachable, `503 Unhealthy` otherwise. Used by deploy platforms to gate traffic routing, and by the keep-warm ping.

## Project structure

```
backend/
├── Data/
│   ├── jobs.json               # Seed data, 15 postings
│   ├── JobsDbContext.cs        # EF Core DbContext + entity config
│   ├── JobSeed.cs              # JSON-shaped seed record → Job mapping
│   └── DbInitializer.cs        # Idempotent migration + seeding at startup
├── Migrations/                 # EF Core schema history (committed)
├── Models/
│   ├── Job.cs                  # Job + JobSection entity records (init-only)
│   ├── JobSummary.cs           # Lightweight shape for the list endpoint
│   ├── JobDetail.cs            # Full shape for the detail endpoint
│   └── PagedResult.cs          # Generic paginated wrapper
├── Services/
│   ├── IJobService.cs          # Read-only contract
│   └── JobService.cs           # EF Core query implementation
├── Properties/
│   └── launchSettings.json     # Dev-only launch profiles
├── Dockerfile                  # Multi-stage build for deployment
├── Program.cs                  # Composition root: DI, middleware, routes
├── DevjobsApi.csproj
├── appsettings.json            # Default configuration
└── appsettings.Development.json
```

## Configuration

Settings flow through .NET's configuration hierarchy: `appsettings.json` < `appsettings.{Environment}.json` < environment variables < command-line args.

| Setting                     | Env var override             | Default                          | Notes                                   |
| --------------------------- | ---------------------------- | -------------------------------- | --------------------------------------- |
| `ConnectionStrings:Default` | `ConnectionStrings__Default` | `Data Source=jobs.db`            | SQLite file path                        |
| `Cors:AllowedOrigins[0]`    | `Cors__AllowedOrigins__0`    | `http://localhost:3000`          | Add `__1`, `__2` for additional origins |
| `ASPNETCORE_ENVIRONMENT`    | (env only)                   | `Development`                    | Set to `Production` on deploy           |
| `ASPNETCORE_URLS`           | (env only)                   | from `launchSettings.json` (dev) | The Dockerfile sets `http://+:8080`     |

Secrets belong in environment variables or .NET User Secrets — never `appsettings.json`. `appsettings.local.json` and `appsettings.*.local.json` are gitignored for local-only overrides.

## Database

EF Core with SQLite. Schema lives in `Migrations/` as code — the source of truth.

### Adding a migration after model changes

```powershell
dotnet ef migrations add <DescriptiveName>
```

The next `dotnet run` applies pending migrations automatically (via `DbInitializer.SeedAsync`).

## Deployment

The included Dockerfile builds and runs on any container platform.

**Required environment variables on the platform:**

| Variable                  | Value                       |
| ------------------------- | --------------------------- |
| `ASPNETCORE_ENVIRONMENT`  | `Production`                |
| `Cors__AllowedOrigins__0` | `https://<frontend-domain>` |

**Health check path** to configure on the platform: `/health`.

**Storage:** the SQLite database lives in the container's writable layer and re-seeds from `Data/jobs.json` on every cold start. No persistent volume is needed because all data is read-only.

## Architectural decisions

**Posting age is stored, not a timestamp.** `data.json` ships `postedAt` as display copy — `"5h ago"`, `"1mo ago"`. Storing that string would put presentation in the data layer; converting it to an absolute timestamp at seed time would make every posting read as months old within a quarter, because this is a fixture that never gets new rows. So the entity stores `PostedMinutesAgo`, and the API projects `postedAt = now - age`. The board always looks live, the client gets a real instant, and formatting stays a frontend concern.

**SQLite over Postgres.** The dataset is 15 read-only rows and is never mutated through the API. SQLite eliminates a separate database service and makes deployment a single container. EF Core abstracts the provider — swapping to Postgres later is a one-line change in `Program.cs`.

**Re-seed on startup vs. persistent volume.** Seeding 15 rows is instant and the data is static. Persisting the database on a mounted volume adds operational overhead for no behavioral benefit.

**`requirements` and `role` map to JSON columns.** Both are `{ content, items[] }` value objects with no identity, never queried against and always read whole. `OwnsOne(...).ToJson()` keeps them in the `Jobs` row as two TEXT columns instead of two join tables. The list endpoint's projection then leaves those columns unread entirely, which is most of the row's bytes.

**Separate summary and detail shapes.** The list endpoint projects to `JobSummary` (eight fields), the detail endpoint returns `JobDetail`. `JobDetail` inherits `JobSummary` so the two can never drift on the fields they share.

**`TimeProvider` rather than `DateTimeOffset.UtcNow`.** The service computes every `postedAt` from a clock it is handed, so age projection is testable without freezing wall-clock time.

**Silent clamping of `pageSize`.** Out-of-range values are clamped to `[1, 50]` rather than rejected with `400`. Friendlier for a public read-only resource where misuse is harmless.

**`AsNoTracking()` everywhere.** All queries are read-only, so EF Core's change tracking is pure overhead.

**HTTPS redirect dev-only.** Production lives behind a reverse proxy that terminates TLS upstream and forwards plain HTTP. `ForwardedHeaders` preserves the original scheme and IP. Running `UseHttpsRedirection` in production would cause a redirect loop with the proxy.

## What's not here (and why)

- **Authentication.** The data is public — no auth required.
- **Rate limiting.** The dataset is static and served from an in-process cache, so there is no metered upstream to drain. Add `AddRateLimiter` if this is ever exposed to untrusted scale.
- **Structured logging stack** (Serilog, OpenTelemetry). Default `ILogger` is sufficient for a single service.
- **Tests.** The service is small enough that integration tests against an in-memory SQLite would be the right starting point — `WebApplicationFactory<Program>` + `dotnet test`.
