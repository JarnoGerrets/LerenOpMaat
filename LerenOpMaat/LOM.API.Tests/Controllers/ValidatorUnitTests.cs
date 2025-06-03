using LOM.API.Enums;
using LOM.API.Models;
using LOM.API.Validator;
using LOM.API.Validator.Specifications.Factories;


namespace LerenOpMaat.LOM.API.Tests.Validators
{
    public class ValidatorUnitTests
    {
        private ValidationContext GenerateDummyValidationContext()
        {
            return new ValidationContext(
                userId: 1,
                progresses: new List<ModuleProgress>(),
                modules: new Dictionary<int, Module>()
            );
        }

        private string GetDummyValueForType(ModulePreconditionType type)
        {
            return type switch
            {
                ModulePreconditionType.RequiredModule => "1",
                ModulePreconditionType.RequiredEc => "30",
                ModulePreconditionType.RequiredEcFromPropedeuse => "30",
                ModulePreconditionType.RequiredLevel2ModulesCount => "2",
                ModulePreconditionType.RequiredLevel3ModulesCount => "1",
                _ => "10"
            };
        }

        [Fact]
        public void AllModulePreconditionTypes_ShouldBeCoveredBySpecifications()
        {
            // Arrange
            var validationContext = GenerateDummyValidationContext();
            var factory = new BusinessSpecificationFactory(validationContext);
            var enumValues = Enum.GetValues(typeof(ModulePreconditionType)).Cast<ModulePreconditionType>();

            foreach (var type in enumValues)
            {
                // Act & Assert
                try
                {
                    var value = GetDummyValueForType(type);
                    var specification = factory.CreateSpecification(type, value, 0);
                    Assert.NotNull(specification);
                }
                catch (Exception ex)
                {
                    Assert.False(true, $"Specification for '{type}' could not be created: {ex.Message}");
                }
            }
        }

        private ValidationContext GenerateValidationContext(
            int userId = 0,
            List<ModuleProgress>? progresses = null,
            Dictionary<int, Module>? modules = null)
        {
            return new ValidationContext(
                userId,
                progresses ?? new List<ModuleProgress>(),
                modules ?? new Dictionary<int, Module>());
        }

        [Fact(DisplayName = "Duplicate module should fail")]
        public void DuplicateModule_ShouldFail()
        {
            // Arrange
            var module = new Module { Id = 1, Name = "Test Module", Period = 1 };

            var semesters = new List<Semester>
            {
                new Semester { Period = 1, Module = module, ModuleId = module.Id },
                new Semester { Period = 2, Module = module, ModuleId = module.Id }
            };
            // Act
            var context = GenerateValidationContext();
            var validator = new LearningRouteValidator(context);

            // Assert
            var results = validator.ValidateLearningRoute(semesters);
            Assert.Contains(results, r => !r.IsValid && r.Message.Contains("komt al voor"));
        }

        [Fact(DisplayName = "Incorrect period should fail")]
        public void IncorrectPeriod_ShouldFail()
        {

            // Arrange            
            var module = new Module { Id = 1, Name = "Test Module", Period = 1 };

            var semesters = new List<Semester>
            {
                new Semester { Period = 2, Module = module, ModuleId = module.Id }
            };

            // Act
            var context = GenerateValidationContext();
            var validator = new LearningRouteValidator(context);

            // Assert        
            var results = validator.ValidateLearningRoute(semesters);
            Assert.Contains(results, r => !r.IsValid && r.Message.Contains("moet in periode"));
        }

        [Fact(DisplayName = "Required module present should pass")]
        public void RequiredModulePresent_ShouldPass()
        {

            // Arrange
            var requiredModule = new Module { Id = 1, Name = "Intro", Period = 1 };
            var dependentModule = new Module
            {
                Id = 2,
                Name = "Advanced",
                Period = 2,
                Requirements = new List<Requirement> { new Requirement { Type = ModulePreconditionType.RequiredModule, Value = "1" } }
            };

            var modules = new Dictionary<int, Module>
            {
                [1] = requiredModule,
                [2] = dependentModule
            };

            var semesters = new List<Semester>
            {
                new Semester { Period = 1, Module = requiredModule, ModuleId = 1 },
                new Semester { Period = 2, Module = dependentModule, ModuleId = 2 }
            };

            // Act
            var context = GenerateValidationContext(modules: modules);
            var validator = new LearningRouteValidator(context);

            // Assert
            var results = validator.ValidateLearningRoute(semesters);
            Assert.DoesNotContain(results, r => !r.IsValid);
        }

        [Fact(DisplayName = "Required module missing should fail")]
        public void RequiredModuleMissing_ShouldFail()
        {
            // Arrange
            var requiredModule = new Module { Id = 1, Name = "Intro", Code = "IP.01" };
            var dependentModule = new Module
            {
                Id = 2,
                Name = "Advanced",
                Code = "ADV.01",
                Period = 1,
                Requirements = new List<Requirement> { new Requirement { Type = ModulePreconditionType.RequiredModule, Value = "1" } }
            };

            var modules = new Dictionary<int, Module>
            {
                [1] = requiredModule,
                [2] = dependentModule
            };

            var semesters = new List<Semester>
            {
                new Semester { Period = 1, Module = dependentModule, ModuleId = 2 }
            };

            // Act
            var context = GenerateValidationContext(modules: modules);
            var validator = new LearningRouteValidator(context);

            // Assert
            var results = validator.ValidateLearningRoute(semesters);
            Assert.Contains(results, r => !r.IsValid && r.Message.Contains($"{requiredModule.Name} ({requiredModule.Code}) moet eerst worden gevolgd"));
        }

        [Fact(DisplayName = "Required EC not met should fail")]
        public void RequiredEcNotMet_ShouldFail()
        {
            // Arrange
            var module = new Module
            {
                Id = 10,
                Name = "EC Module",
                Period = 1,
                Requirements = new List<Requirement> { new Requirement { Type = ModulePreconditionType.RequiredEc, Value = "30" } }
            };


            var previousModule = new Module
            {
                Id = 1,
                Name = "previous module",
                Period = 0
            };


            var modules = new Dictionary<int, Module>
            {
                [10] = module
            };

            var progresses = new List<ModuleProgress>
            {
                new ModuleProgress
                {
                    ModuleId = 1,
                    UserId = 1,
                    CompletedEVLs = new List<CompletedEvl>
                    {
                        new CompletedEvl { ModuleEvl = new ModuleEVL { Ec = 10 } },
                        new CompletedEvl { ModuleEvl = new ModuleEVL { Ec = 10 } }
                    }
                }
            };

            var semesters = new List<Semester>
            {
                new Semester { Period = 0, Module = previousModule, ModuleId = 1 },
                new Semester { Period = 1, Module = module, ModuleId = 10 }
            };

            // Act
            var context = GenerateValidationContext(userId: 1, progresses: progresses, modules: modules);
            var validator = new LearningRouteValidator(context);

            // Assert
            var results = validator.ValidateLearningRoute(semesters);
            Assert.Contains(results, r => !r.IsValid && r.Message.Contains("Niet genoeg Ec's"));
        }

        [Fact(DisplayName = "Required EC met should pass")]
        public void RequiredEcMet_ShouldPass()
        {
            // Arrange
            var module = new Module
            {
                Id = 10,
                Name = "EC Module",
                Period = 1,
                Requirements = new List<Requirement> { new Requirement { Type = ModulePreconditionType.RequiredEc, Value = "20" } }
            };

            var previousModule = new Module
            {
                Id = 1,
                Name = "previous module",
                Period = 0
            };

            var modules = new Dictionary<int, Module>
            {
                [1] = previousModule,
                [10] = module
            };

            var progresses = new List<ModuleProgress>
            {
                new ModuleProgress
                {
                    ModuleId = 1,
                    UserId = 1,
                    CompletedEVLs = new List<CompletedEvl>
                    {
                        new CompletedEvl { ModuleEvl = new ModuleEVL { Ec = 10 } },
                        new CompletedEvl { ModuleEvl = new ModuleEVL { Ec = 10 } }
                    }
                }
            };

            var semesters = new List<Semester>
            {
                new Semester { Period = 0, Module = previousModule, ModuleId = 1 },
                new Semester { Period = 1, Module = module, ModuleId = 10 }
            };

            // Act
            var context = GenerateValidationContext(userId: 1, progresses: progresses, modules: modules);
            var validator = new LearningRouteValidator(context);

            // Assert
            var results = validator.ValidateLearningRoute(semesters);
            Assert.DoesNotContain(results, r => !r.IsValid);
        }

        [Fact(DisplayName = "RequiredEcFromPropedeuse with enough EC's should pass")]
        public void RequiredEcFromPropedeuseWithEnoughEc_ShouldPass()
        {
            // Arrange
            var module = new Module
            {
                Id = 10,
                Name = "PropedeuseModule",
                Period = 1,
                Requirements = new List<Requirement> { new Requirement { Type = ModulePreconditionType.RequiredEcFromPropedeuse, Value = "20" } }
            };

            var previousModule = new Module
            {
                Id = 1,
                Name = "previous module",
                Period = 0
            };

            var modules = new Dictionary<int, Module>
            {
                [10] = module
            };

            var progresses = new List<ModuleProgress>
            {
                new ModuleProgress
                {
                    ModuleId = 1,
                    UserId = 1,
                    CompletedEVLs = new List<CompletedEvl>
                    {
                        new CompletedEvl { ModuleEvl = new ModuleEVL { Ec = 10 } },
                        new CompletedEvl { ModuleEvl = new ModuleEVL { Ec = 10 } }
                    }
                },
                new ModuleProgress
                {
                    ModuleId = 2,
                    UserId = 1,
                    CompletedEVLs = new List<CompletedEvl>
                    {
                        new CompletedEvl { ModuleEvl = new ModuleEVL { Ec = 10 } }
                    }
                }
            };

            var semesters = new List<Semester>
            {
                new Semester { Period = 0, Module = previousModule, ModuleId = 1 },
                new Semester { Period = 1, Module = module, ModuleId = 10 }
            };

            // Act
            var context = GenerateValidationContext(userId: 1, progresses: progresses, modules: modules);
            var validator = new LearningRouteValidator(context);

            // Assert
            var results = validator.ValidateLearningRoute(semesters);
            Assert.DoesNotContain(results, r => !r.IsValid);
        }



        [Fact(DisplayName = "RequiredEcFromPropedeuse without enough EC should fail")]
        public void RequiredEcFromPropedeuseWithout_ShouldFail()
        {
            // Arrange
            var module = new Module
            {
                Id = 10,
                Name = "PropedeuseModule",
                Period = 3,
                Requirements = new List<Requirement> { new Requirement { Type = ModulePreconditionType.RequiredEcFromPropedeuse, Value = "30" } }
            };

            var modules = new Dictionary<int, Module>
            {
                [10] = module
            };

            var progresses = new List<ModuleProgress>
            {
                new ModuleProgress
                {
                    ModuleId = 1,
                    UserId = 1,
                    CompletedEVLs = new List<CompletedEvl>
                    {
                        new CompletedEvl { ModuleEvl = new ModuleEVL { Ec = 10 } },
                        new CompletedEvl { ModuleEvl = new ModuleEVL { Ec = 10 } }
                    }
                }
            };

            var semesters = new List<Semester>
            {
                new Semester { Period = 1, Module = module, ModuleId = 10 }
            };

            // Act
            var context = GenerateValidationContext(userId: 1, progresses: progresses, modules: modules);
            var validator = new LearningRouteValidator(context);

            // Assert
            var results = validator.ValidateLearningRoute(semesters);
            Assert.Contains(results, r => !r.IsValid && r.Message.Contains("Niet genoeg Ec's uit propedeuse"));
        }



        [Fact(DisplayName = "RequiredLevel2ModulesCount with enough modules should pass")]
        public void RequiredLevel2ModulesCountEnough_ShouldPass()
        {
            // Arrange
            var module = new Module
            {
                Id = 10,
                Name = "Level2Checker",
                Level = 3,
                Period = 1,
                Requirements = new List<Requirement> { new Requirement { Type = ModulePreconditionType.RequiredLevel2ModulesCount, Value = "2" } }
            };

            var modules = new Dictionary<int, Module>
            {
                [10] = module
            };

            var semesters = new List<Semester>
            {
                new Semester { Period = 1, Module = new Module { Id = 1, Level = 2, Period = 3 }, ModuleId = 1 },
                new Semester { Period = 2, Module = new Module { Id = 2, Level = 2, Period = 3 }, ModuleId = 2 },
                new Semester { Period = 1, Module = module, ModuleId = 10 }
            };

            // Act
            var context = GenerateValidationContext(modules: modules);
            var validator = new LearningRouteValidator(context);

            // Assert
            var results = validator.ValidateLearningRoute(semesters);
            Assert.DoesNotContain(results, r => !r.IsValid);
        }


        [Fact(DisplayName = "RequiredLevel2ModulesCount without enough modules should fail")]
        public void RequiredLevel2ModulesCountWithoutEnough_ShouldFail()
        {
            // Arrange
            var module = new Module
            {
                Id = 10,
                Name = "Level2Checker",
                Level = 3,
                Period = 2,
                Requirements = new List<Requirement> { new Requirement { Type = ModulePreconditionType.RequiredLevel2ModulesCount, Value = "2" } }
            };

            var modules = new Dictionary<int, Module>
            {
                [10] = module
            };

            var semesters = new List<Semester>
            {
                new Semester { Period = 1, Module = new Module { Id = 1, Level = 2, Period = 3 }, ModuleId = 1 },
                new Semester { Period = 2, Module = module, ModuleId = 10 }
            };

            // Act
            var context = GenerateValidationContext(modules: modules);
            var validator = new LearningRouteValidator(context);

            // Assert
            var results = validator.ValidateLearningRoute(semesters);
            Assert.Contains(results, r => !r.IsValid && r.Message.Contains("Minimaal twee modules van niveau 2"));
        }

        [Fact(DisplayName = "RequiredLevel3ModulesCount with enough modules should pass")]
        public void RequiredLevel3ModulesCountEnough_ShouldPass()
        {
            // Arrange
            var module = new Module
            {
                Id = 10,
                Name = "Level3Checker",
                Period = 2,
                Requirements = new List<Requirement> { new Requirement { Type = ModulePreconditionType.RequiredLevel3ModulesCount, Value = "1" } }
            };

            var modules = new Dictionary<int, Module>
            {
                [10] = module
            };

            var semesters = new List<Semester>
            {
                new Semester { Period = 1, Module = new Module { Id = 1, Level = 3, Period = 3 }, ModuleId = 1 },
                new Semester { Period = 2, Module = module, ModuleId = 10 }
            };

            // Act
            var context = GenerateValidationContext(modules: modules);
            var validator = new LearningRouteValidator(context);

            // Assert
            var results = validator.ValidateLearningRoute(semesters);
            Assert.DoesNotContain(results, r => !r.IsValid);
        }


        [Fact(DisplayName = "RequiredLevel3ModulesCount without enough modules should fail")]
        public void RequiredLevel3ModulesCountWithoutEnough_ShouldFail()
        {
            // Arrange
            var module = new Module
            {
                Id = 10,
                Name = "Level3Checker",
                Period = 2,
                Requirements = new List<Requirement> { new Requirement { Type = ModulePreconditionType.RequiredLevel3ModulesCount, Value = "1" } }
            };

            var modules = new Dictionary<int, Module>
            {
                [10] = module
            };

            var semesters = new List<Semester>
            {
                new Semester { Period = 1, Module = new Module { Id = 1, Level = 2, Period = 3 }, ModuleId = 1 },
                new Semester { Period = 2, Module = module, ModuleId = 10 }
            };

            // Act
            var context = GenerateValidationContext(modules: modules);
            var validator = new LearningRouteValidator(context);

            // Assert
            var results = validator.ValidateLearningRoute(semesters);
            Assert.Contains(results, r => !r.IsValid && r.Message.Contains("Minimaal één module van niveau 3"));
        }


    }

}