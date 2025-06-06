using LOM.API.Models;
using Microsoft.EntityFrameworkCore;

namespace LOM.API.DAL;

public class LOMContext : DbContext
{
	public LOMContext(DbContextOptions<LOMContext> options) : base(options) { }
	public LOMContext() : base() { }

	public virtual DbSet<Module> Modules { get; set; }
	public virtual DbSet<ModuleEVL> ModuleEVLs { get; set; }
	public virtual DbSet<ModuleProgress> ModuleProgresses { get; set; }
	public virtual DbSet<CompletedEvl> CompletedEvls { get; set; }
	// public virtual DbSet<Cohort> Cohorts { get; set; }
	public virtual DbSet<User> User { get; set; }
	public virtual DbSet<Semester> Semesters { get; set; }
	public virtual DbSet<Requirement> Requirements { get; set; }
	public virtual DbSet<LearningRoute> LearningRoutes { get; set; }
	public virtual DbSet<GraduateProfile> GraduateProfiles { get; set; }
	public virtual DbSet<Oer> Oers { get; set; }
	public virtual DbSet<Role> Roles { get; set; }
	public virtual DbSet<Conversation> Conversations { get; set; }
	public virtual DbSet<Message> Messages { get; set; }

	protected override void OnModelCreating(ModelBuilder modelBuilder)
	{
		base.OnModelCreating(modelBuilder);

		SetConstraints(modelBuilder);

		var seeder = new Seeder(modelBuilder);
		seeder.Seed();
	}

	private void SetConstraints(ModelBuilder modelBuilder)
	{
		modelBuilder.Entity<Module>()
		.HasIndex(x => x.Code)
		.IsUnique();
	}
}
