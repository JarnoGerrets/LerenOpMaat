using LOM.API.Models;
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

        _modelBuilder.Entity<learningRoute>().HasData(
           new learningRoute { Id = 1, Name = "Test Route" });

        _modelBuilder.Entity<Module>().HasData(
            new Module { Id = 1, Name = "Introduction to Programming", Description = "Introduction to Programming", Category = "SE" },
            new Module { Id = 2, Name = "Web Development Basics", Description = "Web Development Basics", Category = "BIM" },
            new Module { Id = 3, Name = "Data Structures and Algorithms", Description = "Data Structures and Algorithms", Category = "IDNS" },
            new Module { Id = 4, Name = "Database Management Systems", Description = "Database Management Systems", Category = "SE" },
            new Module { Id = 5, Name = "Introduction to Programming", Description = "Introduction to Programming", Category = "BIM" },
            new Module { Id = 6, Name = "Web Development Basics", Description = "Web Development Basics", Category = "IDNS" },
            new Module { Id = 7, Name = "Data Structures and Algorithms", Description = "Data Structures and Algorithms", Category = "SE" },
            new Module { Id = 8, Name = "Database Management Systems", Description = "Database Management Systems", Category = "BIM" },
            new Module { Id = 9, Name = "Introduction to Programming", Description = "Introduction to Programming", Category = "IDNS" },
            new Module { Id = 10, Name = "Web Development Basics", Description = "Web Development Basics", Category = "SE" },
            new Module { Id = 11, Name = "Data Structures and Algorithms", Description = "Data Structures and Algorithms", Category = "BIM" },
            new Module { Id = 12, Name = "Database Management Systems", Description = "Database Management Systems", Category = "IDNS" },
            new Module { Id = 13, Name = "Data Structures and Algorithms", Description = "Data Structures and Algorithms", Category = "SE" },
            new Module { Id = 14, Name = "Database Management Systems", Description = "Database Management Systems", Category = "BIM" },
            new Module { Id = 15, Name = "Database Management Systems", Description = "Database Management Systems", Category = "IDNS" }
        );

        _modelBuilder.Entity<User>().HasData(
            new User { Id = 1, FirstName = "Jhon", LastName = "Doe", learningRouteId = 1 },
            new User { Id = 2, FirstName = "Robin", LastName = "Hood" }
            );

        _modelBuilder.Entity<Semester>().HasData(
            new Semester { Id = 1, Year = 1, semester = 1, moduleId = 1, learningRouteId = 1 },
            new Semester { Id = 2, Year = 1, semester = 2, moduleId = 2, learningRouteId = 1 },
            new Semester { Id = 3, Year = 2, semester = 1, moduleId = 3, learningRouteId = 1 },
            new Semester { Id = 4, Year = 2, semester = 2, moduleId = 4, learningRouteId = 1 },
            new Semester { Id = 5, Year = 3, semester = 1, moduleId = 5, learningRouteId = 1 },
            new Semester { Id = 6, Year = 3, semester = 2, moduleId = 6, learningRouteId = 1 },
            new Semester { Id = 7, Year = 4, semester = 1, moduleId = 7, learningRouteId = 1 },
            new Semester { Id = 8, Year = 4, semester = 2, moduleId = 8, learningRouteId = 1 }
            );
    }
}
