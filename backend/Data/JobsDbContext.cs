using Microsoft.EntityFrameworkCore;

public class JobsDbContext(DbContextOptions<JobsDbContext> options) : DbContext(options)
{
    public DbSet<Job> Jobs => Set<Job>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Job>(b =>
        {
            b.HasKey(j => j.Id);
            b.Property(j => j.Id).ValueGeneratedNever();
            b.OwnsOne(j => j.Requirements, s => s.ToJson());
            b.OwnsOne(j => j.Role, s => s.ToJson());
            b.HasIndex(j => j.PostedMinutesAgo);
        });
    }
}
