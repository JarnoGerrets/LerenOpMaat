using LOM.API.Models;

namespace LOM.API.Validator.Specifications
{
	public class GraduatingSpecification : ISpecification<LearningRoute>
	{
		public bool IsSatisfiedBy(LearningRoute route)
		{
			var previousModules = route.Semesters
				.Select(s => s.Module)
				.ToList();

			int level2Count = previousModules.Count(m => m.Niveau == 2);
			int level3Count = previousModules.Count(m => m.Niveau == 3);

			return level2Count >= 2 && level3Count >= 1;
		}
	}
}
