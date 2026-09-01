using System.Text.Json;
using Microsoft.EntityFrameworkCore;

public static class DbInitializer
{
    public static async Task SeedAsync(JobsDbContext context, IWebHostEnvironment env)
    {
        await context.Database.MigrateAsync();

        if (await context.Jobs.AnyAsync())
            return;

        var dataPath = Path.Combine(env.ContentRootPath, "Data", "jobs.json");
        var json = await File.ReadAllTextAsync(dataPath);
        var seed =
            JsonSerializer.Deserialize<List<JobSeed>>(
                json,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
            ) ?? [];

        context.Jobs.AddRange(seed.Select(s => s.ToEntity()));
        await context.SaveChangesAsync();
    }
}
