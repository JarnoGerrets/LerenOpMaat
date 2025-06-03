using LOM.API.DAL;
using LOM.API.Models;
using LOM.API.Validator.Spec.Specifications;
using LOM.API.Validator.ValidationResults;
using Microsoft.EntityFrameworkCore;

namespace LOM.API.Validator.Specifications
{
    public class RequiredEcFromPropedeuseSpecification : ISpecification<IEnumerable<Semester>>
    {
        private readonly int RequiredEc;
        private readonly int CurrentSemesterIndex;
        private readonly ValidationContext ValidationContext;


        public RequiredEcFromPropedeuseSpecification(string value, int index, ValidationContext validationContext)
        {
            if (!int.TryParse(value, out var parsedEc))
                throw new ArgumentException($"Invalid EC value '{value}' for RequiredEcFromPropedeuse.");

            RequiredEc = parsedEc;
            CurrentSemesterIndex = index;
            ValidationContext = validationContext;
        }

        public IValidationResult IsSatisfiedBy(IEnumerable<Semester> semesters)
        {
            if (ValidationContext.UserId > 0)
            {
                var semestersList = semesters.ToList();
                var previousModules = semestersList
                    .Take(2)
                    .Where(s => s.Module != null)
                    .Select(s => s.Module)
                    .ToList();

                var currentModuleId = semestersList
                    .ElementAtOrDefault(CurrentSemesterIndex)?
                    .Module?.Id;
                int totalAchievedEcs = 0;

                foreach (Module module in previousModules)
                {
                    var progress = ValidationContext.ModuleProgresses
                                    .FirstOrDefault(p => p.ModuleId == module.Id && p.UserId == ValidationContext.UserId);

                    if (progress != null)
                    {
                        totalAchievedEcs += progress.CompletedEVLs
                            .Where(completed => completed.ModuleEvl != null)
                            .Sum(completed => completed.ModuleEvl.Ec);
                    }
                }

                if (totalAchievedEcs >= RequiredEc)
                {
                    return new ValidationResult(true, "Genoeg EC's uit propedeuse.", semestersList[CurrentSemesterIndex].ModuleId);
                }
                else
                {
                    return new ValidationResult(false, $"Niet genoeg Ec's uit propedeuse behaald, minimaal {RequiredEc} vereist, u heeft op dit moment {totalAchievedEcs} ec's uit propedeuse behaald.", semestersList[CurrentSemesterIndex].ModuleId);
                }


            }
            return new ValidationResult(true, "Validatie niet vereist");
        }
    }
}
