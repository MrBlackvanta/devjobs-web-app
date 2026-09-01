using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    options.KnownNetworks.Clear();
    options.KnownProxies.Clear();
});
builder.Services.AddOpenApi();
builder.Services.AddSingleton(TimeProvider.System);
builder.Services.AddScoped<IJobService, JobService>();
builder.Services.AddDbContext<JobsDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("Default"))
);
builder.Services.AddProblemDetails();
builder.Services.AddOutputCache(options =>
{
    options.AddBasePolicy(b => b.Expire(TimeSpan.FromSeconds(60)));
});
builder.Services.AddHealthChecks().AddDbContextCheck<JobsDbContext>();

var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins(allowedOrigins).AllowAnyHeader().AllowAnyMethod()
    );
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
    app.UseHttpsRedirection();
}

app.UseForwardedHeaders();
app.UseExceptionHandler();
app.UseStatusCodePages();
app.UseCors();
app.UseOutputCache();
app.MapHealthChecks("/health");

app.MapGet(
        "/jobs",
        async (
            IJobService jobs,
            string? search,
            string? location,
            bool fullTime = false,
            int page = 1,
            int pageSize = 12
        ) => await jobs.SearchAsync(search, location, fullTime, page, pageSize)
    )
    .CacheOutput()
    .WithName("SearchJobs")
    .WithSummary("Search job postings with pagination and filters.")
    .WithDescription(
        "Returns a paginated list of job postings, newest first. `search` matches the position "
            + "title or the company name, `location` matches the country, and `fullTime=true` "
            + "restricts results to full-time contracts. `page` defaults to 1, `pageSize` to 12 "
            + "(max 50)."
    )
    .WithTags("Jobs")
    .Produces<PagedResult<JobSummary>>(StatusCodes.Status200OK);

app.MapGet(
        "/jobs/{id:int}",
        async (int id, IJobService jobs) =>
        {
            var job = await jobs.GetByIdAsync(id);
            return job is null
                ? Results.Problem(
                    statusCode: 404,
                    title: "Job not found",
                    detail: $"No job posting with id {id}."
                )
                : Results.Ok(job);
        }
    )
    .CacheOutput()
    .WithName("GetJobById")
    .WithSummary("Get a single job posting by id.")
    .WithDescription(
        "Returns the full posting: description, requirements, role breakdown, company website "
            + "and apply link. Returns 404 ProblemDetails if no match."
    )
    .WithTags("Jobs")
    .Produces<JobDetail>(StatusCodes.Status200OK)
    .ProducesProblem(StatusCodes.Status404NotFound);

using (var scope = app.Services.CreateScope())
{
    var ctx = scope.ServiceProvider.GetRequiredService<JobsDbContext>();
    var env = scope.ServiceProvider.GetRequiredService<IWebHostEnvironment>();
    await DbInitializer.SeedAsync(ctx, env);
}

app.Run();
