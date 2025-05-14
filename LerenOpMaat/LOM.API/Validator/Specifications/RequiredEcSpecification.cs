using LOM.API.Models;
using LOM.API.Validator.ValidationResults;

namespace LOM.API.Validator.Specifications
{
    public class RequiredEcSpecification : ISpecification<IEnumerable<Semester>>
    {
        public IValidationResult IsSatisfiedBy(IEnumerable<Semester> semesters)
        {
            return new ValidationResult(true, "Genoeg EC's.");
        }
    }
}
