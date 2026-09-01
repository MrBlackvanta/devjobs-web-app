using Microsoft.EntityFrameworkCore;

public class JobService(JobsDbContext context, TimeProvider clock) : IJobService
{
    private const int MaxPageSize = 50;
    private const string FullTimeContract = "Full Time";

    public async Task<PagedResult<JobSummary>> SearchAsync(
        string? search,
        string? location,
        bool fullTimeOnly,
        int page,
        int pageSize
    )
    {
        page = Math.Max(page, 1);
        pageSize = Math.Clamp(pageSize, 1, MaxPageSize);

        var query = context.Jobs.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var pattern = $"%{search.Trim()}%";
            query = query.Where(j =>
                EF.Functions.Like(j.Position, pattern) || EF.Functions.Like(j.Company, pattern)
            );
        }

        if (!string.IsNullOrWhiteSpace(location))
            query = query.Where(j => EF.Functions.Like(j.Location, $"%{location.Trim()}%"));

        if (fullTimeOnly)
            query = query.Where(j => j.Contract == FullTimeContract);

        var total = await query.CountAsync();

        var rows = await query
            .OrderBy(j => j.PostedMinutesAgo)
            .ThenBy(j => j.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(j => new
            {
                j.Id,
                j.Company,
                j.Logo,
                j.LogoBackground,
                j.Position,
                j.PostedMinutesAgo,
                j.Contract,
                j.Location,
            })
            .ToListAsync();

        var now = clock.GetUtcNow();
        var items = rows.Select(r => new JobSummary
            {
                Id = r.Id,
                Company = r.Company,
                Logo = r.Logo,
                LogoBackground = r.LogoBackground,
                Position = r.Position,
                PostedAt = now.AddMinutes(-r.PostedMinutesAgo),
                Contract = r.Contract,
                Location = r.Location,
            })
            .ToList();

        return new PagedResult<JobSummary>(items, page, pageSize, total);
    }

    public async Task<JobDetail?> GetByIdAsync(int id)
    {
        var job = await context.Jobs.AsNoTracking().FirstOrDefaultAsync(j => j.Id == id);

        if (job is null)
            return null;

        return new JobDetail
        {
            Id = job.Id,
            Company = job.Company,
            Logo = job.Logo,
            LogoBackground = job.LogoBackground,
            Position = job.Position,
            PostedAt = clock.GetUtcNow().AddMinutes(-job.PostedMinutesAgo),
            Contract = job.Contract,
            Location = job.Location,
            Website = job.Website,
            Apply = job.Apply,
            Description = job.Description,
            Requirements = job.Requirements,
            Role = job.Role,
        };
    }
}
