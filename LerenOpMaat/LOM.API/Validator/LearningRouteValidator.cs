using LOM.API.Enums;
using LOM.API.Models;
using LOM.API.Validator.Specifications;

namespace LOM.API.Validator
{
    public class LearningRouteValidator
    {
            private readonly Dictionary<ModulePreconditionType, Func<string, int, ISpecification<LearningRoute>>>
                _specifications;

            public LearningRouteValidator()
            {
                _specifications =
                    new Dictionary<ModulePreconditionType, Func<string, int, ISpecification<LearningRoute>>>
                    {
                        {
                            ModulePreconditionType.RequiredModule,
                            (value, index) => new RequiredModuleSpecification(int.Parse(value), index)
                        },
                        { ModulePreconditionType.Graduating, (_, _) => new GraduatingSpecification() }
                        // Add new requirements here after adding their respective files in the /Validator/Specifications folder
                    };
            }

            public bool ValidateLearningRoute(LearningRoute learningRoute)
            {
                var semesters = learningRoute.Semesters.ToList();

                for (int i = 0; i < learningRoute.Semesters.Count; i++)
                {
                    var currentModule = semesters[i].Module;

                    foreach (var requirement in currentModule.Requirements)
                    {
                        if (_specifications.TryGetValue(requirement.Type, out var specFactory))
                        {
                            var specification = specFactory(requirement.Value, i);
                            if (!specification.IsSatisfiedBy(learningRoute))
                            {
                                return false;
                            }
                        }
                        else
                        {
                            throw new InvalidOperationException(
                                $"No specification found for requirement type {requirement.Type}");
                        }
                    }
                }

                return true;
            }
        }

}
