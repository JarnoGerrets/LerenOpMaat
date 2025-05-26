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
            new Module { Id = 1, Name = "Introduction to Programming", Code = "IP.01", Description = "Introduction to Programming", Ec = 30, Level = 1, Period = 1, IsActive = true, GraduateProfileId = 3 },
            new Module { Id = 2, Name = "Web Development Basics", Code = "WDB.02", Description = "Web Development Basics", Ec = 30, Level = 2, Period = 2, IsActive = true, GraduateProfileId = 1 },
            new Module { Id = 3, Name = "Data Structures and Algorithms", Code = "DSA.03", Description = "Data Structures and Algorithms", Ec = 30, Level = 3, Period = 1, IsActive = true, GraduateProfileId = 2 },
            new Module { Id = 4, Name = "Database Management Systems", Code = "DBMS.04", Description = "Database Management Systems", Ec = 30, Level = 1, Period = 2, IsActive = true, GraduateProfileId = 3 },
            new Module { Id = 5, Name = "Introduction to Programming", Code = "IP.05", Description = "Introduction to Programming", Ec = 30, Level = 2, Period = 2, IsActive = true, GraduateProfileId = 1 },
            new Module { Id = 6, Name = "Web Development Basics", Code = "WDB.06", Description = "Web Development Basics", Ec = 30, Level = 3, Period = 1, IsActive = true, GraduateProfileId = 2 },
            new Module { Id = 7, Name = "Data Structures and Algorithms", Code = "DSA.07", Description = "Data Structures and Algorithms", Ec = 30, Level = 1, Period = 1, IsActive = true, GraduateProfileId = 3 },
            new Module { Id = 8, Name = "Database Management Systems", Code = "DBMS.08", Description = "Database Management Systems", Ec = 30, Level = 2, Period = 2, IsActive = true, GraduateProfileId = 1 },
            new Module { Id = 9, Name = "Introduction to Programming", Code = "IP.09", Description = "Introduction to Programming", Ec = 30, Level = 3, Period = 2, IsActive = true, GraduateProfileId = 2 },
            new Module { Id = 10, Name = "Web Development Basics", Code = "WDB.10", Description = "Web Development Basics", Ec = 30, Level = 1, Period = 1, IsActive = true, GraduateProfileId = 3 },
            new Module { Id = 11, Name = "Data Structures and Algorithms", Code = "DSA.11", Description = "Data Structures and Algorithms", Ec = 30, Level = 2, Period = 1, IsActive = true, GraduateProfileId = 1 },
            new Module { Id = 12, Name = "Database Management Systems", Code = "DBMS.12", Description = "Database Management Systems", Ec = 30, Level = 3, Period = 1, IsActive = true, GraduateProfileId = 2 },
            new Module { Id = 13, Name = "Data Structures and Algorithms", Code = "DSA.13", Description = "Data Structures and Algorithms", Ec = 30, Level = 1, Period = 1, IsActive = true, GraduateProfileId = 3 },
            new Module { Id = 14, Name = "Database Management Systems", Code = "DBMS.14", Description = "Database Management Systems", Ec = 30, Level = 2, Period = 2, IsActive = true, GraduateProfileId = 1 },
            new Module { Id = 15, Name = "Database Management Systems", Code = "DBMS.15", Description = "Database Management Systems", Ec = 30, Level = 3, Period = 1, IsActive = true, GraduateProfileId = 2 },
            new Module { Id = 16, Name = "Afstuderen", Code = "A.01", Description = "Afstuderen", Ec = 30, Level = 3, Period = 2, IsActive = true, GraduateProfileId = 2 },
            new Module { Id = 17, Name = "Multidisciplinaire Opdracht", Code = "MDO.01", Description = "Multidisciplinaire Opdracht", Ec = 30, Level = 3, Period = 2, IsActive = true, GraduateProfileId = 2 }
            );

        _modelBuilder.Entity<Role>().HasData(
           new Role { Id = 1, RoleName = "Teacher" },
           new Role { Id = 2, RoleName = "Student" }
           );

        _modelBuilder.Entity<User>().HasData(
            new User { Id = 1, FirstName = "Jhon", LastName = "Doe", LearningRouteId = 1, StartYear = 2023, ExternalID = "TEST123", RoleId = 2 },
            new User { Id = 2, FirstName = "Robin", LastName = "Hood", ExternalID = "TEST345", RoleId = 2 },
            new User { Id = 3, FirstName = "Begeleider", LastName = "Begeleider", ExternalID = "Test54321", RoleId = 1 }
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

        _modelBuilder.Entity<Module>()
            .HasOne(m => m.GraduateProfile)
            .WithMany()
            .HasForeignKey(m => m.GraduateProfileId);

        _modelBuilder.Entity<Semester>().HasData(
            new Semester { Id = 1, Year = 1, Period = 1, ModuleId = 1, LearningRouteId = 1 },
            new Semester { Id = 2, Year = 1, Period = 2, ModuleId = 2, LearningRouteId = 1 },
            new Semester { Id = 3, Year = 2, Period = 1, ModuleId = 3, LearningRouteId = 1 },
            new Semester { Id = 4, Year = 2, Period = 2, ModuleId = 4, LearningRouteId = 1 },
            new Semester { Id = 5, Year = 3, Period = 1, ModuleId = 5, LearningRouteId = 1 },
            new Semester { Id = 6, Year = 3, Period = 2, ModuleId = 6, LearningRouteId = 1 },
            new Semester { Id = 7, Year = 4, Period = 1, ModuleId = 7, LearningRouteId = 1 },
            new Semester { Id = 8, Year = 4, Period = 2, ModuleId = 8, LearningRouteId = 1 }
            );

        _modelBuilder.Entity<Requirement>().HasData(
            new Requirement { Id = 1, ModuleId = 1, Type = ModulePreconditionType.RequiredEcFromPropedeuse, Value = "50" },
            new Requirement { Id = 2, ModuleId = 2, Type = ModulePreconditionType.RequiredModule, Value = "9" },
            new Requirement { Id = 3, ModuleId = 3, Type = ModulePreconditionType.RequiredEc, Value = "120" },
            new Requirement { Id = 4, ModuleId = 4, Type = ModulePreconditionType.RequiredModule, Value = "2" },
            new Requirement { Id = 5, ModuleId = 5, Type = ModulePreconditionType.RequiredEcFromPropedeuse, Value = "50" },
            new Requirement { Id = 6, ModuleId = 5, Type = ModulePreconditionType.RequiredModule, Value = "3" },
            new Requirement { Id = 7, ModuleId = 16, Type = ModulePreconditionType.RequiredModule, Value = "17" },
            new Requirement { Id = 8, ModuleId = 16, Type = ModulePreconditionType.RequiredEcFromPropedeuse, Value = "60" },
            new Requirement { Id = 9, ModuleId = 16, Type = ModulePreconditionType.RequiredLevel2ModulesCount, Value = "2" }
        );
        
        _modelBuilder.Entity<Conversation>().HasData(
            new Conversation { Id = 1, LearningRouteId = 1, StudentId = 1, TeacherId = 3 }
            );

        _modelBuilder.Entity<Message>().HasData(
            new Message { Id = 1, ConversationId = 1, DateTime = DateTime.Now, Commentary = "Hoi, mag ik een feedback krijgen op mijn leerroute?", UserId = 1 },
            new Message { Id = 2, ConversationId = 1, DateTime = DateTime.Now, Commentary = "Ik zou semester 2 van het jaar 2 aanpassen naar iets anders.", UserId = 3 },
            new Message { Id = 3, ConversationId = 1, DateTime = DateTime.Now, Commentary = "Hoi, Ik heb het aangepast", UserId = 1 },
            new Message { Id = 4, ConversationId = 1, DateTime = DateTime.Now, Commentary = "Leerroute ziet er goed uit!", UserId = 3 }
            );

        _modelBuilder.Entity<GraduateProfile>().HasData(
            new GraduateProfile { Id = 1, Name = "BIM", ColorCode = "#F16682A0" },
            new GraduateProfile { Id = 2, Name = "SE", ColorCode = "#F5A61AA0" },
            new GraduateProfile { Id = 3, Name = "IDNS", ColorCode = "#4594D3A0" },
            new GraduateProfile { Id = 4, Name = "Geen", ColorCode = "#4594D3A3" }
        );

        _modelBuilder.Entity<ModuleProgress>().HasData(
            new ModuleProgress { Id = 1, UserId = 1, ModuleId = 1 },
            new ModuleProgress { Id = 2, UserId = 2, ModuleId = 1 }
        );

        int evlId = 1;
        var moduleEVLs = new List<ModuleEVL>();

        for (int moduleId = 1; moduleId <= 15; moduleId++)
        {
            for (int i = 1; i <= 3; i++)
            {
                moduleEVLs.Add(new ModuleEVL
                {
                    Id = evlId++,
                    ModuleId = moduleId,
                    Name = $"EVL {i}",
                    Ec = 10
                });
            }
        }

        _modelBuilder.Entity<ModuleEVL>().HasData(moduleEVLs);

        _modelBuilder.Entity<CompletedEvl>().HasData(
            new CompletedEvl { Id = 1, ModuleProgressId = 1, ModuleEvlId = 1 },
            new CompletedEvl { Id = 2, ModuleProgressId = 1, ModuleEvlId = 2 },
            new CompletedEvl { Id = 3, ModuleProgressId = 2, ModuleEvlId = 3 }
        );

    }

    
}
