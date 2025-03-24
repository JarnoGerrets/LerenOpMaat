using LOM.Shared.Models;
using Microsoft.EntityFrameworkCore;

namespace LOM.API.DAL;

public class Seeder
{
	private readonly ModelBuilder _modelBuilder;

	public Seeder(ModelBuilder modelBuilder)
	{
		_modelBuilder = modelBuilder;
	}

	public void Seed()
	{
		_modelBuilder.Entity<Cohort>().HasData(
			new Cohort { Id = 1, StartDate = DateTime.Now, IsActive = true },
			new Cohort { Id = 2, StartDate = DateTime.Now.AddYears(1), IsActive = true },
			new Cohort { Id = 3, StartDate = DateTime.Now.AddYears(2), IsActive = false },
			new Cohort { Id = 4, StartDate = DateTime.Now.AddYears(-1), IsActive = true },
			new Cohort { Id = 5, StartDate = DateTime.Now.AddYears(-2), IsActive = true },
			new Cohort { Id = 6, StartDate = DateTime.Now.AddYears(-3), IsActive = true },
			new Cohort { Id = 7, StartDate = DateTime.Now.AddYears(-4), IsActive = true }
		);
	}
}
