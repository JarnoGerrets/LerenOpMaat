using LOM.API.Models;
using Microsoft.EntityFrameworkCore;

namespace LOM.API.DAL;

public class LOMContext : DbContext
{
    public LOMContext(DbContextOptions<LOMContext> options) : base(options) { }
    public DbSet<Module> Modules { get; set; }
    public DbSet<Cohort> Cohorts { get; set; }
    public DbSet<User> User { get; set; }
    public DbSet<Semester> Semesters { get; set; }
    public DbSet<Requirement> Requirements { get; set; }
    public DbSet<LearningRoute> LearningRoutes { get; set; }
    public DbSet<GraduateProfile> GraduateProfiles { get; set; }
    public DbSet<Oer> Oer { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        var seeder = new Seeder(modelBuilder);
        seeder.Seed();
    }
}
