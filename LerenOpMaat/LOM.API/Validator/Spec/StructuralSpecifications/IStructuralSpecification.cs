using LOM.API.Models;
using LOM.API.Validator.ValidationResults;

namespace LOM.API.Validator.Spec.StructuralSpecifications
{
    public interface IStructuralSpecification<T>
    {
        IValidationResult IsSatisfiedBy(IEnumerable<Semester> semesters, Module currentModule, int currentIndex);
    }
}