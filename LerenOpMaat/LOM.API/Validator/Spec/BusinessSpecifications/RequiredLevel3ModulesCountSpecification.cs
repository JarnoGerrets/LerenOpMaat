using LOM.API.Models;
using LOM.API.Validator.ValidationResults;

namespace LOM.API.Validator.Spec.BusinessSpecifications
{
	public class RequiredLevel3ModulesCountSpecification : IBusinessSpecification<IEnumerable<Semester>>
	{
		private readonly int CurrentModuleId;

		public RequiredLevel3ModulesCountSpecification(string value, int index, ValidationContext validationContext)
		{
			if (!int.TryParse(value, out var parsedValue))
				throw new ArgumentException($"Invalid value '{value}' for value."); // not needed but will throw errors in constructor if not catched

			CurrentModuleId = index;
		}
		public IValidationResult IsSatisfiedBy(IEnumerable<Semester> semesters)
		{
			var previousModules = semesters
				.Select(s => s.Module)
				.ToList();
			//counting the amount of level 3 modules before current
			int level3Count = previousModules.Count(m => m.Level == 3);

			bool ismet = level3Count >= 1;

			if (!ismet)
			{
				return new ValidationResult(false, "Minimaal één module van niveau 3 is vereist", CurrentModuleId);
			}
			return new ValidationResult(true, "Module van niveau 3 gevonden in leerroute", CurrentModuleId);
		}
	}
}
