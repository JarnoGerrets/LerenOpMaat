using LOM.API.Models;
using LOM.API.Validator.Spec.StructuralSpecifications;
using LOM.API.Validator.Specifications.Factories;
using System.Reflection;
using Models = LOM.API.Models;

namespace LerenOpMaat.LOM.API.Tests.Controllers
{
    public class StructuralSpecificationFactoryIntegrationTest
    {
        private ValidationContext GenerateDummyValidationContext()
        {
            return new ValidationContext(
                userId: 1,
                progresses: new List<ModuleProgress>(),
                modules: new Dictionary<int, Models.Module>()
            );
        }


        private object GetParameterValue(ParameterInfo p, ValidationContext validationContext)
        {
            return p.Name switch
            {
                "validationContext" => validationContext,
                _ => throw new InvalidOperationException($"Unknown parameter '{p.Name}' in constructor.")
            };
        }

        [Fact]
        public void AllStructuralSpecifications_ShouldBeDiscoverableAndCreatable()
        {
            // Arrange
            var validationContext = GenerateDummyValidationContext();

            var specificationTypes = typeof(StructuralSpecificationFactory).Assembly.GetTypes()
                .Where(t => typeof(IStructuralSpecification<IEnumerable<Semester>>).IsAssignableFrom(t)
                            && !t.IsInterface && !t.IsAbstract)
                .ToList();

            // Act & Assert
            foreach (var specType in specificationTypes)
            {
                try
                {
                    var ctor = specType.GetConstructors().FirstOrDefault();
                    Assert.NotNull(ctor);

                    var ctorParams = ctor.GetParameters();
                    var args = ctorParams.Select(p => GetParameterValue(p, validationContext)).ToArray();

                    var instance = Activator.CreateInstance(specType, args);
                    Assert.NotNull(instance);
                }
                catch (Exception ex)
                {
                    Assert.False(true, $"Failed to create structural specification '{specType.Name}': {ex.Message}");
                }
            }
        }
    }
}
