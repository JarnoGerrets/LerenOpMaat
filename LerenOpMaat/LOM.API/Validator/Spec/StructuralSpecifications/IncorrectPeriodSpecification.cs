using LOM.API.Models;
using LOM.API.Validator.ValidationResults;

namespace LOM.API.Validator.Spec.StructuralSpecifications
{
    public class IncorrectPeriodSpecification : IStructuralSpecification<IEnumerable<Semester>>
    {
        private readonly ValidationContext _validationContext;
        private const int FlexiblePeriod = 3;

        public IncorrectPeriodSpecification(ValidationContext validationContext)
        {
            _validationContext = validationContext; //for future expansion
        }

        public IValidationResult IsSatisfiedBy(IEnumerable<Semester> semesters, Module currentModule, int currentIndex)
        {
            var semester = semesters.ElementAt(currentIndex);

            bool validPeriod = currentModule.Period == semester.Period || currentModule.Period == FlexiblePeriod;

            if (!validPeriod)
            {
                return new ValidationResult(false,
                    $"Module {currentModule.Name} moet in periode {currentModule.Period} gevolgd worden.",
                    currentModule.Id);
            }

            return new ValidationResult(true, "Module in correct periode.", currentModule.Id);
        }
    }
}
