using LOM.API.Models;
using Microsoft.EntityFrameworkCore;

namespace LOM.API.DAL;

public class LOMContext : DbContext
{
    public LOMContext(DbContextOptions<LOMContext> options) : base(options) { }
    public DbSet<Module> Modules { get; set; }
	public DbSet<ModuleEVL> ModuleEVLs { get; set; }
	public DbSet<ModuleProgress> ModuleProgresses { get; set; }
	public DbSet<CompletedEvl> CompletedEvls { get; set; }
    public DbSet<Cohort> Cohorts { get; set; }
    public DbSet<User> User { get; set; }
    public DbSet<Semester> Semesters { get; set; }
    public DbSet<Requirement> Requirements { get; set; }
    public DbSet<LearningRoute> LearningRoutes { get; set; }
    public DbSet<GraduateProfile> GraduateProfiles { get; set; }
    public DbSet<Oer> Oers { get; set; }
    public DbSet<Role> Roles { get; set; }
    public DbSet<Conversation> Conversations { get; set; }
    public DbSet<Message> Messages { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        var seeder = new Seeder(modelBuilder);
        seeder.Seed();
    }
}
