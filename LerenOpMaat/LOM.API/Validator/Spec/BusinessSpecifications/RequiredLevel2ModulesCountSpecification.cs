using LOM.API.Models;
using LOM.API.Validator.ValidationResults;

namespace LOM.API.Validator.Spec.BusinessSpecifications
{
	public class RequiredLevel2ModulesCountSpecification : IBusinessSpecification<IEnumerable<Semester>>
	{
		private readonly int CurrentModuleId;

		public RequiredLevel2ModulesCountSpecification(string value, int index, ValidationContext validationContext)
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
			//counting the amount of level 2 modules before current
			int level2Count = previousModules.Count(m => m.Level == 2);

			bool ismet = level2Count >= 2;

			if (!ismet)
			{
				return new ValidationResult(false, "Minimaal twee modules van niveau 2 zijn vereist", CurrentModuleId);
			}
			return new ValidationResult(true, "Module van niveau 3 gevonden in leerroute", CurrentModuleId);
		}
	}
}
