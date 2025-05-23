using LOM.API.Validator.ValidationResults;

namespace LOM.API.Validator.Spec.Specificiations
{
    public interface ISpecification<T>
    {
        IValidationResult IsSatisfiedBy(T entity);
    }
}