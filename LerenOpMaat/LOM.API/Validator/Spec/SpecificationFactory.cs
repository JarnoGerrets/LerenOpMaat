using System.Reflection;
using LOM.API.DAL;
using LOM.API.Enums;
using LOM.API.Models;
using LOM.API.Validator.Spec.Specifications;

namespace LOM.API.Validator.Specifications
{
public class SpecificationFactory
{
    private readonly ValidationContext _validationContext;
    private readonly int _userId;

    public SpecificationFactory(ValidationContext ValidationContext)
    {
        _validationContext = ValidationContext ;
        _userId = ValidationContext.UserId;
    }

    public ISpecification<IEnumerable<Semester>> CreateSpecification(ModulePreconditionType type, string value, int index)
    {
        string className = $"{type}Specification";
        var assembly = typeof(SpecificationFactory).Assembly;

        var specType = assembly.GetTypes()
            .FirstOrDefault(t => t.Name == className && typeof(ISpecification<IEnumerable<Semester>>).IsAssignableFrom(t));

        if (specType == null)
            throw new InvalidOperationException($"Specification class '{className}' not found.");

        var ctor = specType.GetConstructors().FirstOrDefault();
        if (ctor == null)
            throw new InvalidOperationException($"No constructor found for {className}.");

        var ctorParams = ctor.GetParameters();
        var args = ctorParams.Select(p => GetParameterValue(p, value, index)).ToArray();

        return (ISpecification<IEnumerable<Semester>>)Activator.CreateInstance(specType, args);
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