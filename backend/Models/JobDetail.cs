public record JobDetail : JobSummary
{
    public string Website { get; init; } = "";
    public string Apply { get; init; } = "";
    public string Description { get; init; } = "";
    public JobSection Requirements { get; init; } = new();
    public JobSection Role { get; init; } = new();
}
