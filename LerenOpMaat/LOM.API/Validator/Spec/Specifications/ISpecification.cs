using LOM.API.Validator.ValidationResults;

namespace LOM.API.Validator.Specifications
{
    public interface ISpecification<T>
    {
        IValidationResult IsSatisfiedBy(T entity);
    }
}