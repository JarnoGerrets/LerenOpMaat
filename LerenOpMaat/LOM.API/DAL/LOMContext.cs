using LOM.API.Models;
using Microsoft.EntityFrameworkCore;

namespace LOM.API.DAL;

public class LOMContext : DbContext
{
	public LOMContext(DbContextOptions<LOMContext> options) : base(options) { }
	public DbSet<Module> Modules { get; set; }
	public DbSet<Cohort> Cohorts { get; set; }

	protected override void OnModelCreating(ModelBuilder modelBuilder)
	{
		base.OnModelCreating(modelBuilder);
		var seeder = new Seeder(modelBuilder);
		seeder.Seed();
	}

public DbSet<LOM.API.Models.User> User { get; set; } = default!;
}
