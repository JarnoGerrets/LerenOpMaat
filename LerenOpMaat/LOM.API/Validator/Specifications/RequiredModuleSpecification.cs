using LOM.API.Models;

namespace LOM.API.Validator.Specifications
{
    public class RequiredModuleSpecification(int requiredModuleId, int currentSemesterIndex) : ISpecification<LearningRoute>
    {
        public bool IsSatisfiedBy(LearningRoute route)
        {
            return route.Semesters
                .Take(currentSemesterIndex)
                .Any(s => s.Module.Id == requiredModuleId);
        }
    }
}
