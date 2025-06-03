using LOM.API.Models;
using LOM.API.Validator.ValidationResults;

namespace LOM.API.Validator.Spec.StructuralSpecifications
{
    public class DuplicateModuleSpecification : IStructuralSpecification<IEnumerable<Semester>>
    {
        private readonly ValidationContext _validationContext;

        public DuplicateModuleSpecification(ValidationContext validationContext)
        {
            _validationContext = validationContext; //for future expansion
        }

        public IValidationResult IsSatisfiedBy(IEnumerable<Semester> semesters, Module currentModule, int currentIndex)
        {
            bool isDuplicate = semesters
                .Where((s, idx) => idx != currentIndex)
                .Any(s => s.Module != null && s.Module.Id == currentModule.Id);

            if (isDuplicate)
            {
                return new ValidationResult(false,
                    $"Module {currentModule.Name} komt al voor in de leerroute.",
                    currentModule.Id);
            }

            return new ValidationResult(true, "Geen duplicaat gevonden.", currentModule.Id);
        }
    }
}
