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
                new Module { Id = 4, Name = "Web Development Basics V2", Code = "WDB.02", Period = 2 },
                new Module { Id = 5, Name = "Introduction to Programming V2", Code = "IP.02", Period = 1 },
                new Module { Id = 6, Name = "Web Development Basics V2", Code = "WDB.02", Period = 2 }
            );

            context.Requirements.AddRange(new Requirement
            {
                Id = 1,
                ModuleId = 2,
                Type = ModulePreconditionType.RequiredModule,
                Value = "1"
            },
            new Requirement
            {
                Id = 2,
                ModuleId = 5,
                Type = ModulePreconditionType.RequiredEc,
                Value = "30"
            },
            new Requirement
            {
                Id = 3,
                ModuleId = 6,
                Type = ModulePreconditionType.RequiredEc,
                Value = "20"
            },
            new Requirement
            {
                Id = 4,
                ModuleId = 5,
                Type = ModulePreconditionType.RequiredEcFromPropedeuse,
                Value = "30"
            },
            new Requirement
            {
                Id = 5,
                ModuleId = 6,
                Type = ModulePreconditionType.RequiredEcFromPropedeuse,
                Value = "20"
            });
            


            context.ModuleProgresses.AddRange(
                new ModuleProgress { Id = 1, ModuleId = 1, UserId = 1 },
                new ModuleProgress { Id = 2, ModuleId = 2, UserId = 2 },
                new ModuleProgress { Id = 3, ModuleId = 3, UserId = 1 },
                new ModuleProgress { Id = 4, ModuleId = 4, UserId = 1 }
            );

            context.User.AddRange(
                new User { Id = 1, FirstName = "John", LastName = "Doe", ExternalID = "12345" },
                new User { Id = 2, FirstName = "Bob", LastName = "Smith", ExternalID = "67890" }
            );

            int evlId = 1;
            var moduleEVLs = new List<ModuleEVL>();

            for (int moduleId = 1; moduleId <= 4; moduleId++)
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

            context.ModuleEVLs.AddRange(moduleEVLs);

            context.CompletedEvls.AddRange(
                new CompletedEvl { Id = 1, ModuleProgressId = 1, ModuleEvlId = 1 },
                new CompletedEvl { Id = 2, ModuleProgressId = 1, ModuleEvlId = 2 },
                new CompletedEvl { Id = 3, ModuleProgressId = 2, ModuleEvlId = 3 },
                new CompletedEvl { Id = 4, ModuleProgressId = 3, ModuleEvlId = 1 },
                new CompletedEvl { Id = 5, ModuleProgressId = 3, ModuleEvlId = 2 },
                new CompletedEvl { Id = 6, ModuleProgressId = 4, ModuleEvlId = 1 }
            );
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

        [Fact]
        [Description("Should fail when there are not enough ECs in the learning route")]
        public void ValidateLearningRoute_NotEoughEcs()
        {
            // Arrange
            var context = CreateInMemoryContext();

            var module1 = context.Modules.Find(1);
            var module2 = context.Modules.Find(2);
            var requirementmodule = context.Modules.Find(5);

            var user = context.User.Find(1);


            var semesters = new List<Semester>
        {
            new Semester { Period = 1, Module = module1, ModuleId = module1.Id },
            new Semester { Period = 2, Module = module2, ModuleId = module2.Id },
            new Semester { Period = 1, Module = requirementmodule, ModuleId = requirementmodule.Id }
        };

            var requirement = context.Requirements.Find(2);

            var validator = new LearningRouteValidator(context, user.Id);

            // Act
            var results = validator.ValidateLearningRoute(semesters);

            // Assert
            var error = results.FirstOrDefault(r => !r.IsValid && r.Message.Contains($"Niet genoeg Ec's behaald, minimaal {requirement.Value} vereist, u heeft op dit moment 20 behaald."));
            Assert.NotNull(error);
            Assert.False(error.IsValid);
        }

        [Fact]
        [Description("Should succeed when there are enough ECs in the learning route")]
        public void ValidateLearningRoute_EnoughEcs()
        {
            // Arrange
            var context = CreateInMemoryContext();

            var module1 = context.Modules.Find(1);
            var module2 = context.Modules.Find(2);
            var requirementmodule = context.Modules.Find(6);

            var user = context.User.Find(1);


            var semesters = new List<Semester>
        {
            new Semester { Period = 1, Module = module1, ModuleId = module1.Id },
            new Semester { Period = 2, Module = module2, ModuleId = module2.Id },
            new Semester { Period = 1, Module = requirementmodule, ModuleId = requirementmodule.Id }
        };

            var validator = new LearningRouteValidator(context, user.Id);

            // Act
            var results = validator.ValidateLearningRoute(semesters);

            // Assert
            var success = results.FirstOrDefault(r => r.IsValid && r.Message.Contains("Genoeg EC's."));
            Assert.NotNull(success);
            Assert.True(success.IsValid);
        }

        [Fact]
        [Description("Should skip validation when no user ID is provided and return a success message")]
        public void ValidateLearningRoute_NoUserId()
        {
            // Arrange
            var context = CreateInMemoryContext();

            var module1 = context.Modules.Find(1);
            var module2 = context.Modules.Find(2);
            var requirementmodule = context.Modules.Find(5); // choosing a module that otherwise would fail validation

            var semesters = new List<Semester>
        {
            new Semester { Period = 1, Module = module1, ModuleId = module1.Id },
            new Semester { Period = 2, Module = module2, ModuleId = module2.Id },
            new Semester { Period = 1, Module = requirementmodule, ModuleId = requirementmodule.Id }
        };

            var validator = new LearningRouteValidator(context);

            // Act
            var results = validator.ValidateLearningRoute(semesters);

            // Assert
            var success = results.FirstOrDefault(r => r.IsValid && r.Message.Contains("Validatie niet vereist"));

            Assert.NotNull(success);
            Assert.True(success.IsValid);
        }

        [Fact]
        [Description("Should succeed when there are enough ECs from propedeuse in the learning route")]
        public void ValidateLearningRoute_EnoughEcsPropedeuse()
        {
            // Arrange
            var context = CreateInMemoryContext();

            var module1 = context.Modules.Find(1);
            var module2 = context.Modules.Find(2);
            var requirementmodule = context.Modules.Find(6);

            var user = context.User.Find(1);


            var semesters = new List<Semester>
        {
            new Semester { Period = 1, Module = module1, ModuleId = module1.Id },
            new Semester { Period = 2, Module = module2, ModuleId = module2.Id },
            new Semester { Period = 1, Module = requirementmodule, ModuleId = requirementmodule.Id }
        };

            var validator = new LearningRouteValidator(context, user.Id);

            // Act
            var results = validator.ValidateLearningRoute(semesters);

            // Assert
            var success = results.FirstOrDefault(r => r.IsValid && r.Message.Contains("Genoeg EC's uit propedeuse."));
            Assert.NotNull(success);
            Assert.True(success.IsValid);
        }
        
                [Fact]
        [Description("Should fail when there are not enough ECs in the learning route")]
        public void ValidateLearningRoute_NotEoughEcsFromPropedeuse()
        {
            // Arrange
            var context = CreateInMemoryContext();

            var module1 = context.Modules.Find(1);
            var module2 = context.Modules.Find(2);
            var module3 = context.Modules.Find(3);
            var requirementmodule = context.Modules.Find(5);

            var user = context.User.Find(1);


            var semesters = new List<Semester>
        {
            new Semester { Period = 1, Module = module1, ModuleId = module1.Id },
            new Semester { Period = 2, Module = module2, ModuleId = module2.Id },
            new Semester { Period = 1, Module = requirementmodule, ModuleId = requirementmodule.Id },
            new Semester { Period = 1, Module = module3, ModuleId = module3.Id } // making sure that the overall ECs are enough, but propedeuse ECs are not.
        };

            var requirement = context.Requirements.Find(4);

            var validator = new LearningRouteValidator(context, user.Id);

            // Act
            var results = validator.ValidateLearningRoute(semesters);

            // Assert
            var error = results.FirstOrDefault(r => !r.IsValid && r.Message.Contains($"Niet genoeg Ec's uit propedeuse behaald, minimaal {requirement.Value} vereist, u heeft op dit moment 20 ec's uit propedeuse behaald."));
            Assert.NotNull(error);
            Assert.False(error.IsValid);
        }




    }
}
