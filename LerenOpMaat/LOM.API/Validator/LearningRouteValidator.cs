﻿using LOM.API.DAL;
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

		private readonly Dictionary<ModulePreconditionType, Func<string, int, ISpecification<IEnumerable<Semester>>>> _specifications;

		public LearningRouteValidator(LOMContext context, int userId = 0)
		{
			var specificationsFactory = new SpecificationFactory(context, userId);
			_specifications = specificationsFactory.CreateSpecifications();
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
				if (_specifications.TryGetValue(requirement.Type, out var specBuilder))
				{
					var specification = specBuilder(requirement.Value, index);
					var result = specification.IsSatisfiedBy(semesters);
					resultCollection.Add(result);
				}
				else
				{
					throw new InvalidOperationException($"No specification found for requirement type {requirement.Type}");
				}
			}
		}
	}

}
