public record JobSummary
{
    public int Id { get; init; }
    public string Company { get; init; } = "";
    public string Logo { get; init; } = "";
    public string LogoBackground { get; init; } = "";
    public string Position { get; init; } = "";
    public DateTimeOffset PostedAt { get; init; }
    public string Contract { get; init; } = "";
    public string Location { get; init; } = "";
}
