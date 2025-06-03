using LOM.API.Enums;
using LOM.API.Models;
using LOM.API.Validator.Specifications.Factories;


namespace LerenOpMaat.LOM.API.Tests.Controllers
{
    public class BusinessSpecificationFactoryIntegrationTest
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
            return "10";
        }

        [Fact]
        public void AllModulePreconditionTypes_ShouldHaveMatchingSpecification()
        {
            // Arrange
            var validationContext = GenerateDummyValidationContext();
            var factory = new BusinessSpecificationFactory(validationContext);
            var enumValues = Enum.GetValues(typeof(ModulePreconditionType)).Cast<ModulePreconditionType>();

            // Act & Assert
            foreach (var type in enumValues)
            {
                try
                {
                    var specification = factory.CreateSpecification(type, GetDummyValueForType(type), 0);
                    Assert.NotNull(specification);
                }
                catch (Exception ex)
                {
                    Assert.False(true, $"Failed to create specification for type '{type}': {ex.Message}");
                }
            }
        }
    }
}
