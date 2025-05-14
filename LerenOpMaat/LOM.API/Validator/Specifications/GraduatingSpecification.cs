using LOM.API.Models;
using LOM.API.Validator.ValidationResults;

namespace LOM.API.Validator.Specifications
{
	public class GraduatingSpecification(int currentModuleId) : ISpecification<IEnumerable<Semester>>
	{
		public IValidationResult IsSatisfiedBy(IEnumerable<Semester> semesters)
		{
			var previousModules = semesters
				.Select(s => s.Module)
				.ToList();

			int level2Count = previousModules.Count(m => m.Level == 2);
			int level3Count = previousModules.Count(m => m.Level == 3);

			bool ismet = level2Count >= 2 && level3Count >= 1;

			if (!ismet)
			{
				return new ValidationResult(false, "Afstuderen is niet mogelijk", currentModuleId);
			}
			return new ValidationResult(true, "Afstuderen is mogelijk.", currentModuleId);
		}
	}
}
