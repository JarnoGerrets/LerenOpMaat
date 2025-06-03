using LOM.API.DAL;
using LOM.API.Enums;
using LOM.API.Models;
using LOM.API.Validator.Spec.Specifications;
using LOM.API.Validator.Specifications;
using LOM.API.Validator.ValidationResults;

namespace LOM.API.Validator
{
	public class LearningRouteValidator
	{
		private const int FlexiblePeriod = 3;
        private readonly SpecificationFactory _specificationFactory;
		private readonly Dictionary<ModulePreconditionType, Func<string, int, ISpecification<IEnumerable<Semester>>>> _specifications;

		public LearningRouteValidator(ValidationContext validationContext)
		{
            _specificationFactory = new SpecificationFactory(validationContext);
		}

		public ICollection<IValidationResult> ValidateLearningRoute(List<Semester> semesters)
		{
			var resultCollection = new List<IValidationResult>();

			for (int i = 0; i < semesters.Count; i++)
			{
				var currentSemester = semesters[i];
				var currentModule = currentSemester.Module;

				if (currentModule != null)
				{

					if (IsModuleInRoute(semesters, currentModule, i))
					{
						var validation = new ValidationResult(false,
							$"Module {currentModule.Name} komt al voor in de leerroute.",
							currentModule.Id);
						resultCollection.Add(validation);
						continue;
					}

					if (!IsModuleInCorrectPeriod(currentSemester, currentModule))
					{
						var validation = new ValidationResult(false,
							$"Module {currentModule.Name} moet in periode {currentModule.Period} gevolgd worden.",
							currentModule.Id);
						resultCollection.Add(validation);
					}

					ValidateModuleRequirements(currentModule, semesters, i, resultCollection);
				}
			}

			if (resultCollection.Count == 0)
			{
				resultCollection.Add(new ValidationResult(true, "Leerroute is correct."));
			}

			return resultCollection;
		}

		private bool IsModuleInCorrectPeriod(Semester semester, Module currentModule)
		{
			return currentModule.Period == semester.Period || currentModule.Period == FlexiblePeriod;
		}

		private bool IsModuleInRoute(List<Semester> semesters, Module module, int currentIndex)
		{
			return semesters.Where((s, idx) => idx != currentIndex)
				.Any(s => s.Module != null && s.Module.Id == module.Id);
		}

		private void ValidateModuleRequirements(Module currentModule, List<Semester> semesters, int index, ICollection<IValidationResult> resultCollection)
		{
			foreach (var requirement in currentModule.Requirements)
			{
                try
                {
                    var specification = _specificationFactory.CreateSpecification(requirement.Type, requirement.Value, index);
                    var result = specification.IsSatisfiedBy(semesters);
                    resultCollection.Add(result);
                }
                catch (Exception ex)
                {
                    resultCollection.Add(new ValidationResult(false, $"Validatiefout bij {requirement.Type}: {ex.Message}", currentModule.Id));
                }
			}
		}
	}

}
