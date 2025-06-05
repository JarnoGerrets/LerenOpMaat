using LOM.API.Models;
using LOM.API.Validator.Specifications.Factories;
using LOM.API.Validator.ValidationResults;

namespace LOM.API.Validator
{
	public class LearningRouteValidator
	{
		private const int FlexiblePeriod = 3;
		private readonly BusinessSpecificationFactory _businessSpecificationFactory;
		private readonly StructuralSpecificationFactory _structuralSpecificationFactory;

		public LearningRouteValidator(ValidationContext validationContext)
		{
			_businessSpecificationFactory = new BusinessSpecificationFactory(validationContext);
			_structuralSpecificationFactory = new StructuralSpecificationFactory(validationContext);
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

					var hasFailed = ValidateModuleStructuralRequirements(currentModule, semesters, i, resultCollection);
					if (hasFailed)
					{
						continue;
					}
					
					ValidateModuleBusinessRequirements(currentModule, semesters, i, resultCollection);
				}
			}

			if (resultCollection.Count == 0)
			{
				resultCollection.Add(new ValidationResult(true, "Leerroute is correct."));
			}

			return resultCollection;
		}
		//index is the place in the array of the current to be validated module
		private void ValidateModuleBusinessRequirements(Module currentModule, List<Semester> semesters, int index, ICollection<IValidationResult> resultCollection)
		{
			foreach (var requirement in currentModule.Requirements)
			{
				try
				{
					var specification = _businessSpecificationFactory.CreateSpecification(requirement.Type, requirement.Value, index);
					var result = specification.IsSatisfiedBy(semesters);
					resultCollection.Add(result);
				}
				catch (Exception ex)
				{
					resultCollection.Add(new ValidationResult(false, $"Validatiefout bij {requirement.Type}: {ex.Message}", currentModule.Id));
				}
			}
		}

		private bool ValidateModuleStructuralRequirements(Module currentModule, List<Semester> semesters, int index, ICollection<IValidationResult> resultCollection)
		{
			foreach (var structuralSpec in _structuralSpecificationFactory.CreateAllSpecifications())
			{
				try
				{
					var structuralResult = structuralSpec.IsSatisfiedBy(semesters, currentModule, index);

					if (!structuralResult.IsValid)
					{
						resultCollection.Add(structuralResult);
						return true;
					}
				}
				catch (Exception ex)
				{
					resultCollection.Add(new ValidationResult(false, $"Fout in structurele validatie {structuralSpec.GetType().Name}: {ex.Message}", currentModule.Id));
				}
			}
			return false;
		}
	}

}

