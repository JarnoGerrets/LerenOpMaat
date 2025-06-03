using LOM.API.Validator.ValidationResults;

namespace LOM.API.Validator.Spec.BusinessSpecifications
{
    public interface IBusinessSpecification<T>
    {
        IValidationResult IsSatisfiedBy(T entity);
    }
}