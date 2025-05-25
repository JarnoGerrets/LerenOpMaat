using LOM.API.Models;
using LOM.API.Validator.Spec.Specifications;
using LOM.API.Validator.ValidationResults;

namespace LOM.API.Validator.Spec.Specifications
{
	public class RequiredLevel3ModulesCountSpecification(int currentModuleId) : ISpecification<IEnumerable<Semester>>
	{
		public IValidationResult IsSatisfiedBy(IEnumerable<Semester> semesters)
		{
			var previousModules = semesters
				.Select(s => s.Module)
				.ToList();

			int level3Count = previousModules.Count(m => m.Level == 3);

			bool ismet = level3Count >= 1;

			if (!ismet)
			{
				return new ValidationResult(false, "Minimaal één module van niveau 3 is vereist", currentModuleId);
			}
			return new ValidationResult(true, "Module van niveau 3 gevonden in leerroute", currentModuleId);
		}
	}
}
