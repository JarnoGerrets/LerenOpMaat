using LOM.API.Models;
using LOM.API.Validator.ValidationResults;

namespace LOM.API.Validator.Specifications
{
	public class RequiredLevel2ModulesCountSpecification(int currentModuleId) : ISpecification<IEnumerable<Semester>>
	{
		public IValidationResult IsSatisfiedBy(IEnumerable<Semester> semesters)
		{
			var previousModules = semesters
				.Select(s => s.Module)
				.ToList();

			int level2Count = previousModules.Count(m => m.Level == 2);

			bool ismet = level2Count >= 2;

			if (!ismet)
			{
				return new ValidationResult(false, "Minimaal één module van niveau 3 is vereist", currentModuleId);
			}
			return new ValidationResult(true, "Module van niveau 3 gevonden in leerroute", currentModuleId);
		}
	}
}
