using LOM.API.Controllers;
using LOM.API.DAL;
using LOM.API.Enums;
using LOM.API.Models;
using LOM.API.Tests.TestHelpers;
using LOM.API.Validator;
using LOM.API.Validator.ValidationResults;
using LOM.API.Validator.ValidationService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.TestPlatform.Utilities;
using Moq;
using System.ComponentModel;
using System.Diagnostics;

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

        [Fact]
        public async Task ValidateRoute_WithValidAndInvalidModules_ReturnsExpectedValidationResults()
        {
			// Fake Session
			var httpContext = new DefaultHttpContext();
			httpContext.Session = new MockHttpSession();
			httpContext.Session.SetInt32("UserId", 1);
            // Arrange
			var options = new DbContextOptionsBuilder<LOMContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            using var context = new LOMContext(options);

            var user = new User { Id = 1, FirstName = "Jarno", LastName = "Gerrets", ExternalID = "1" };
            context.User.Add(user);

            var requiredModule = new Module { Id = 10, Name = "Intro to Programming", Code = "IP101", Level = 1 };
            context.Modules.Add(requiredModule);

            var dependentModule = new Module
            {
                Id = 20,
                Name = "Advanced Programming",
                Code = "AP201",
                Level = 2,
                Requirements = new List<Requirement>
            {
                new Requirement { Type = ModulePreconditionType.RequiredModule, Value = requiredModule.Id.ToString() }
            }
            };
            context.Modules.Add(dependentModule);
            await context.SaveChangesAsync();

            // Semesters to validate
            var semesters = new List<Semester>
            {
                new Semester { Period = 1, ModuleId = dependentModule.Id, Module = dependentModule }
            };
			var mockValidationService = new Mock<ISemesterValidationService>();


			// Bouw een fake validatieresultaat die lijkt op wat de echte validator zou teruggeven
			var validationResults = new List<IValidationResult>
                {
                    new ValidationResult(false, $"Module '{dependentModule.Name}' moet eerst worden gevolgd.")
                };

			mockValidationService
				.Setup(s => s.ValidateSemestersAsync(It.IsAny<List<Semester>>(), It.IsAny<int>()))
				.ReturnsAsync(validationResults);

			// Bouw Controller met de mock service
			var controller = new LearningRouteController(context, mockValidationService.Object);
			controller.ControllerContext = new ControllerContext()
			{
				HttpContext = httpContext
			};
			// Act
			var result = await controller.ValidateRoute(semesters);
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedResults = Assert.IsAssignableFrom<ICollection<IValidationResult>>(okResult.Value);

            // Assert
            Assert.Contains(returnedResults, r => !r.IsValid && r.Message.Contains("moet eerst worden gevolgd"));
        }

		[Fact]
		public async Task UpdateSemesters_WithValidData_UpdatesSemestersSuccessfully()
		{
			// Arrange
			var options = new DbContextOptionsBuilder<LOMContext>()
				.UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
				.Options;

			using var context = new LOMContext(options);

			// Setup User
			var user = new User { Id = 1, FirstName = "Jarno", LastName = "Gerrets", ExternalID = "1" };
			context.User.Add(user);
			await context.SaveChangesAsync();

			// Setup Modules
			var module1 = new Module { Id = 10, Name = "Intro to Programming", Code = "IP101", Level = 1, Period = 1 };
			var module2 = new Module { Id = 20, Name = "Advanced Programming", Code = "AP201", Level = 2, Period = 2 };
			module2.Requirements = new List<Requirement>
                {
	                new Requirement { Type = ModulePreconditionType.RequiredModule, Value = module1.Id.ToString() }
                };
			context.Modules.AddRange(module1, module2);
			await context.SaveChangesAsync();

			// Setup LearningRoute & Semesters
			var learningRoute = new LearningRoute
			{
				Id = 100,
				UserId = user.Id,
	Semesters = new List<Semester>
	{
		new Semester { Id = 1, Year = 2025, Period = 1, ModuleId = module1.Id, LearningRouteId = 100 },
		new Semester { Id = 2, Year = 2025, Period = 2, ModuleId = null, LearningRouteId = 100 }
	}
			};
			context.LearningRoutes.Add(learningRoute);
			await context.SaveChangesAsync();

			// Prepare DTO for update
			var dto = new UpdateSemestersDto
			{
				UserId = user.Id,
				Semesters = new List<Semester>
	{
		new Semester { Year = 2025, Period = 1, ModuleId = module1.Id },
		new Semester { Year = 2025, Period = 2, ModuleId = module2.Id }
	}
			};

			// Use real validation service for full integration test
			var validationService = new SemesterValidationService(context);

			var controller = new SemesterController(context, validationService);

			// Act
			var result = await controller.UpdateSemesters(learningRoute.Id, dto);
			if (result is OkObjectResult objectResult)
			{
				var returnedValidationResults = objectResult.Value as ICollection<IValidationResult>;
				var firstMessage = returnedValidationResults?.FirstOrDefault()?.Message ?? "No validation message";
				Debug.WriteLine("First validation message: " + firstMessage);
			}
			else
			{
				Debug.WriteLine("Result was not an OkObjectResult, probably OkResult.");
			}
			// Assert
			var okResult = Assert.IsType<OkResult>(result);

			// Reload updated data from DB to verify update
			var updatedSemester = await context.Semesters.FirstOrDefaultAsync(s => s.Id == 2);
			Assert.NotNull(updatedSemester);
			Assert.Equal(module2.Id, updatedSemester.ModuleId);
		}





	}
}
