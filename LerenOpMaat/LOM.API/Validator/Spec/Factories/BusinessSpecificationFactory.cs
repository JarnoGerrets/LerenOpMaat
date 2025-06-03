using System.Reflection;
using LOM.API.Enums;
using LOM.API.Models;
using LOM.API.Validator.Spec.BusinessSpecifications;

namespace LOM.API.Validator.Specifications.Factories
{
public class BusinessSpecificationFactory
{
    private readonly ValidationContext _validationContext;

    public BusinessSpecificationFactory(ValidationContext ValidationContext)
    {
        _validationContext = ValidationContext;
    }

    public IBusinessSpecification<IEnumerable<Semester>> CreateSpecification(ModulePreconditionType type, string value, int index)
    {
        string className = $"{type}Specification";
        var assembly = typeof(BusinessSpecificationFactory).Assembly;

        var specType = assembly.GetTypes()
            .FirstOrDefault(t => t.Name == className && typeof(IBusinessSpecification<IEnumerable<Semester>>).IsAssignableFrom(t));

        if (specType == null)
            throw new InvalidOperationException($"Specification class '{className}' not found.");

        var ctor = specType.GetConstructors().FirstOrDefault();
        if (ctor == null)
            throw new InvalidOperationException($"No constructor found for {className}.");

        var ctorParams = ctor.GetParameters();
        var args = ctorParams.Select(p => GetParameterValue(p, value, index)).ToArray();

        return (IBusinessSpecification<IEnumerable<Semester>>)Activator.CreateInstance(specType, args);
    }

    private object GetParameterValue(ParameterInfo p, string value, int index)
    {
        return p.Name switch
        {
            "value" => value,
            "index" => index,
            "validationContext" => _validationContext,
            _ => throw new InvalidOperationException($"Unknown parameter '{p.Name}' in specification constructor.")
        };
    }
}

}