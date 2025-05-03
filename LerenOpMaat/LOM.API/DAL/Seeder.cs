using LOM.API.Enums;
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

        _modelBuilder.Entity<LearningRoute>().HasData(
           new LearningRoute { Id = 1 });

        _modelBuilder.Entity<Module>().HasData(
            new Module { Id = 1, Name = "Introduction to Programming", Code = "IP.01", Description = "Introduction to Programming", Category = "SE", Ec = 30, Niveau = 1, Periode = 1, IsActive = true },
            new Module { Id = 2, Name = "Web Development Basics", Code = "WDB.02", Description = "Web Development Basics", Category = "BIM", Ec = 30, Niveau = 2, Periode = 2, IsActive = true },
            new Module { Id = 3, Name = "Data Structures and Algorithms", Code = "DSA.03", Description = "Data Structures and Algorithms", Category = "IDNS", Ec = 30, Niveau = 3, Periode = 1, IsActive = true },
            new Module { Id = 4, Name = "Database Management Systems", Code = "DBMS.04", Description = "Database Management Systems", Category = "SE", Ec = 30, Niveau = 1, Periode = 2, IsActive = true },
            new Module { Id = 5, Name = "Introduction to Programming", Code = "IP.05", Description = "Introduction to Programming", Category = "BIM", Ec = 30, Niveau = 2, Periode = 2, IsActive = true },
            new Module { Id = 6, Name = "Web Development Basics", Code = "WDB.06", Description = "Web Development Basics", Category = "IDNS", Ec = 30, Niveau = 3, Periode = 1, IsActive = true },
            new Module { Id = 7, Name = "Data Structures and Algorithms", Code = "DSA.07", Description = "Data Structures and Algorithms", Category = "SE", Ec = 30, Niveau = 1, Periode = 1, IsActive = true },
            new Module { Id = 8, Name = "Database Management Systems", Code = "DBMS.08", Description = "Database Management Systems", Category = "BIM", Ec = 30, Niveau = 2, Periode = 2, IsActive = true },
            new Module { Id = 9, Name = "Introduction to Programming", Code = "IP.09", Description = "Introduction to Programming", Category = "IDNS", Ec = 30, Niveau = 3, Periode = 2, IsActive = true },
            new Module { Id = 10, Name = "Web Development Basics", Code = "WDB.10", Description = "Web Development Basics", Category = "SE", Ec = 30, Niveau = 1, Periode = 1, IsActive = true },
            new Module { Id = 11, Name = "Data Structures and Algorithms", Code = "DSA.11", Description = "Data Structures and Algorithms", Category = "BIM", Ec = 30, Niveau = 2, Periode = 1, IsActive = true },
            new Module { Id = 12, Name = "Database Management Systems", Code = "DBMS.12", Description = "Database Management Systems", Category = "IDNS", Ec = 30, Niveau = 3, Periode = 1, IsActive = true },
            new Module { Id = 13, Name = "Data Structures and Algorithms", Code = "DSA.13", Description = "Data Structures and Algorithms", Category = "SE", Ec = 30, Niveau = 1, Periode = 1, IsActive = true },
            new Module { Id = 14, Name = "Database Management Systems", Code = "DBMS.14", Description = "Database Management Systems", Category = "BIM", Ec = 30, Niveau = 2, Periode = 2, IsActive = true },
            new Module { Id = 15, Name = "Database Management Systems", Code = "DBMS.15", Description = "Database Management Systems", Category = "IDNS", Ec = 30, Niveau = 3, Periode = 1, IsActive = true }
        );

        _modelBuilder.Entity<User>().HasData(
            new User { Id = 1, FirstName = "Jhon", LastName = "Doe", LearningRouteId = 1, StartYear = 2023 },
            new User { Id = 2, FirstName = "Robin", LastName = "Hood" }
            );
        _modelBuilder.Entity<Semester>()
            .HasOne(s => s.Module)
            .WithMany()
            .HasForeignKey(s => s.ModuleId)
            .OnDelete(DeleteBehavior.SetNull);

        _modelBuilder.Entity<Requirement>()
            .HasOne(r => r.Module)
            .WithMany(m => m.Requirements)
            .HasForeignKey(r => r.ModuleId)
            .OnDelete(DeleteBehavior.Restrict);

        _modelBuilder.Entity<Semester>().HasData(
            new Semester { Id = 1, Year = 1, Periode = 1, ModuleId = 1, LearningRouteId = 1 },
            new Semester { Id = 2, Year = 1, Periode = 2, ModuleId = 2, LearningRouteId = 1 },
            new Semester { Id = 3, Year = 2, Periode = 1, ModuleId = 3, LearningRouteId = 1 },
            new Semester { Id = 4, Year = 2, Periode = 2, ModuleId = 4, LearningRouteId = 1 },
            new Semester { Id = 5, Year = 3, Periode = 1, ModuleId = 5, LearningRouteId = 1 },
            new Semester { Id = 6, Year = 3, Periode = 2, ModuleId = 6, LearningRouteId = 1 },
            new Semester { Id = 7, Year = 4, Periode = 1, ModuleId = 7, LearningRouteId = 1 },
            new Semester { Id = 8, Year = 4, Periode = 2, ModuleId = 8, LearningRouteId = 1 }
            );

        _modelBuilder.Entity<Requirement>().HasData(
            new Requirement { Id = 1, ModuleId = 1, Type = ModulePreconditionType.RequiredEcFromPropedeuse, Value = "50" },
            new Requirement { Id = 2, ModuleId = 2, Type = ModulePreconditionType.RequiredModule, Value = "9" },
            new Requirement { Id = 3, ModuleId = 3, Type = ModulePreconditionType.RequiredEc, Value = "120" },
            new Requirement { Id = 4, ModuleId = 4, Type = ModulePreconditionType.RequiredModule, Value = "2" },
            new Requirement { Id = 5, ModuleId = 5, Type = ModulePreconditionType.RequiredEcFromPropedeuse, Value = "50" },
            new Requirement { Id = 6, ModuleId = 5, Type = ModulePreconditionType.RequiredModule, Value = "3" }
        );

    }
}
