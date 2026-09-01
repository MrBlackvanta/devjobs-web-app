public record JobSeed
{
    public int Id { get; init; }
    public string Company { get; init; } = "";
    public string Logo { get; init; } = "";
    public string LogoBackground { get; init; } = "";
    public string Position { get; init; } = "";
    public int PostedMinutesAgo { get; init; }
    public string Contract { get; init; } = "";
    public string Location { get; init; } = "";
    public string Website { get; init; } = "";
    public string Apply { get; init; } = "";
    public string Description { get; init; } = "";
    public JobSection Requirements { get; init; } = new();
    public JobSection Role { get; init; } = new();

    public Job ToEntity() =>
        new()
        {
            Id = Id,
            Company = Company,
            Logo = Logo,
            LogoBackground = LogoBackground,
            Position = Position,
            PostedMinutesAgo = PostedMinutesAgo,
            Contract = Contract,
            Location = Location,
            Website = Website,
            Apply = Apply,
            Description = Description,
            Requirements = Requirements,
            Role = Role,
        };
}
