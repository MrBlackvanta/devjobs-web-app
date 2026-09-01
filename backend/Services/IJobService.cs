public interface IJobService
{
    Task<PagedResult<JobSummary>> SearchAsync(
        string? search,
        string? location,
        bool fullTimeOnly,
        int page,
        int pageSize
    );

    Task<JobDetail?> GetByIdAsync(int id);
}
