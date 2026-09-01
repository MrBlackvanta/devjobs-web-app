public record PagedResult<T>(IReadOnlyList<T> Items, int Page, int PageSize, int Total)
{
    public int TotalPages => (int)Math.Ceiling((double)Total / PageSize);
    public bool HasMore => Page < TotalPages;
}
