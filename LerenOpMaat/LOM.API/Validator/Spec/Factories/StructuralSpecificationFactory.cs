using System.Reflection;
using LOM.API.Models;
using LOM.API.Validator.Spec.StructuralSpecifications;

namespace LOM.API.Validator.Specifications.Factories
{
    public class StructuralSpecificationFactory
    {
        private readonly ValidationContext _validationContext;
        private readonly List<Type> _specificationTypes;

        public StructuralSpecificationFactory(ValidationContext validationContext)
        {
            _validationContext = validationContext;
            _specificationTypes = typeof(StructuralSpecificationFactory).Assembly.GetTypes()
                .Where(t => typeof(IStructuralSpecification<IEnumerable<Semester>>).IsAssignableFrom(t)
                         && !t.IsInterface && !t.IsAbstract)
                .ToList();
        }

        public IEnumerable<IStructuralSpecification<IEnumerable<Semester>>> CreateAllSpecifications()
        {
            foreach (var specType in _specificationTypes)
            {
                var ctor = specType.GetConstructors().FirstOrDefault();
                if (ctor == null)
                    throw new InvalidOperationException($"No constructor found for {specType.Name}");

                var ctorParams = ctor.GetParameters();
                var args = ctorParams.Select(p => GetParameterValue(p)).ToArray();

                yield return (IStructuralSpecification<IEnumerable<Semester>>)Activator.CreateInstance(specType, args);
            }
        }

        private object GetParameterValue(ParameterInfo p)
        {
            return p.Name switch
            {
                "validationContext" => _validationContext,
                _ => throw new InvalidOperationException($"Unknown parameter '{p.Name}' in specification constructor.")
            };
        }
    }
}
