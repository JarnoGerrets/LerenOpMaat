using System.ComponentModel;
using LOM.API.DAL;
using LOM.API.Enums;
using LOM.API.Models;
using LOM.API.Validator;
using Microsoft.EntityFrameworkCore;

namespace LerenOpMaat.LOM.API.Tests.Validators
{
    public class ValidatorTests
    {
        private LOMContext CreateInMemoryContext()
        {
            var options = new DbContextOptionsBuilder<LOMContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            var context = new LOMContext(options);

            context.Modules.AddRange(
                new Module { Id = 1, Name = "Introduction to Programming", Code = "IP.01", Period = 1 },
                new Module { Id = 2, Name = "Web Development Basics", Code = "WDB.01", Period = 2 },
                new Module { Id = 3, Name = "Introduction to Programming V2", Code = "IP.02", Period = 1 },
                new Module { Id = 4, Name = "Web Development Basics V2", Code = "WDB.02", Period = 2 }
            );

            context.Requirements.Add(new Requirement
            {
                Id = 1,
                ModuleId = 2,
                Type = ModulePreconditionType.RequiredModule,
                Value = "1"
            });
            context.SaveChanges();

            return context;
        }

        [Fact]
        [Description("Should detect duplicate modules in the learning route")]
        public void ValidateLearningRoute_DuplicateModule()
        {
            // Arrange
            var context = CreateInMemoryContext();
            var module = context.Modules.First();

            var semesters = new List<Semester>
        {
            new Semester { Period = 1, Module = module, ModuleId = module.Id },
            new Semester { Period = 2, Module = module, ModuleId = module.Id }
        };

            var validator = new LearningRouteValidator(context);

            // Act
            var results = validator.ValidateLearningRoute(semesters);

            // Assert
            var duplicateError = results.FirstOrDefault(r => !r.IsValid && r.Message.Contains("komt al voor"));
            Assert.NotNull(duplicateError);
            Assert.False(duplicateError.IsValid);
        }
        [Fact]
        [Description("Should detect modules in the wrong period")]
        public void ValidateLearningRoute_SemesterInWrongPeriod()
        {
            // Arrange
            var context = CreateInMemoryContext();
            var module = context.Modules.First();

            var semesters = new List<Semester>
        {
            new Semester { Period = 2, Module = module, ModuleId = module.Id }
        };

            var validator = new LearningRouteValidator(context);

            // Act
            var results = validator.ValidateLearningRoute(semesters);

            // Assert
            var duplicateError = results.FirstOrDefault(r => !r.IsValid && r.Message.Contains($"Module {module.Name} moet in periode {module.Period} gevolgd worden."));
            Assert.NotNull(duplicateError);
            Assert.False(duplicateError.IsValid);
        }

        [Fact]
        [Description("Should succeed with required module before current module")]
        public void ValidateLearningRoute_RequiredModuleBeforeCurrentModule()
        {
            // Arrange
            var context = CreateInMemoryContext();

            var module1 = context.Modules.Find(1);
            var module2 = context.Modules.Find(2);

            var semesters = new List<Semester>
        {
            new Semester { Period = 1, Module = module1, ModuleId = module1.Id },
            new Semester { Period = 2, Module = module2, ModuleId = module2.Id }
        };

            var validator = new LearningRouteValidator(context);

            // Act
            var results = validator.ValidateLearningRoute(semesters);

            // Assert
            var succes = results.FirstOrDefault(r => r.IsValid && r.Message.Contains("Required module is satisfied."));
            Assert.NotNull(succes);
            Assert.True(succes.IsValid);
        }


        [Fact]
        [Description("Should fail without required module before current module")]
        public void ValidateLearningRoute_RequiredModuleNotBeforeCurrentModule()
        {
            // Arrange
            var context = CreateInMemoryContext();

            var module1 = context.Modules.Find(1);
            var module2 = context.Modules.Find(2);

            var semesters = new List<Semester>
        {
            new Semester { Period = 1, Module = module2, ModuleId = module2.Id }
        };

            var validator = new LearningRouteValidator(context);

            // Act
            var results = validator.ValidateLearningRoute(semesters);

            // Assert
            var error = results.FirstOrDefault(r => !r.IsValid && r.Message.Contains($"{module1.Name} ({module1.Code}) moet eerst worden gevolgd."));
            Assert.NotNull(error);
            Assert.False(error.IsValid);
        }

        [Fact]
        [Description("Should fail with required module after current module")]
        public void ValidateLearningRoute_RequiredModuleAfterCurrentModule()
        {
            // Arrange
            var context = CreateInMemoryContext();

            var module1 = context.Modules.Find(1);
            var module2 = context.Modules.Find(2);
            var module3 = context.Modules.Find(3);

            var semesters = new List<Semester>
        {
            new Semester { Period = 1, Module = module2, ModuleId = module2.Id },
            new Semester { Period = 2, Module = module3, ModuleId = module3.Id },
            new Semester { Period = 1, Module = module1, ModuleId = module1.Id }
        };

            var validator = new LearningRouteValidator(context);

            // Act
            var results = validator.ValidateLearningRoute(semesters);

            // Assert
            var error = results.FirstOrDefault(r => !r.IsValid && r.Message.Contains($"{module1.Name} ({module1.Code}) moet eerst worden gevolgd."));
            Assert.NotNull(error);
            Assert.False(error.IsValid);
        }

    }
}
