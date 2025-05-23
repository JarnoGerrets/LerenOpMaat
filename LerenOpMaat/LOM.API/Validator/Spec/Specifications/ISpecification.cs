using LOM.API.Validator.ValidationResults;

namespace LOM.API.Validator.Spec.Specifications
{
    public interface ISpecification<T>
    {
        IValidationResult IsSatisfiedBy(T entity);
    }
}