using LOM.API.DAL;
using LOM.API.Models;
using LOM.API.Validator.Spec.Specifications;
using LOM.API.Validator.ValidationResults;
using Microsoft.EntityFrameworkCore;

namespace LOM.API.Validator.Specifications
{
    public class RequiredEcFromPropedeuseSpecification(int value, int currentSemesterIndex, int userId, LOMContext context) : ISpecification<IEnumerable<Semester>>
    {
        public IValidationResult IsSatisfiedBy(IEnumerable<Semester> semesters)
        {
            if (userId > 0)
            {
                var semestersList = semesters.ToList();
                var previousModules = semestersList
                    .Take(2)
                    .Where(s => s.Module != null)
                    .Select(s => s.Module)
                    .ToList();

                var currentModuleId = semestersList
                    .ElementAtOrDefault(currentSemesterIndex)?
                    .Module?.Id;
                int totalAchievedEcs = 0;

                foreach (Module module in previousModules)
                {
                    var progress = context.ModuleProgresses
                        .Include(p => p.CompletedEVLs)
                            .ThenInclude(evl => evl.ModuleEvl)
                        .FirstOrDefault(p => p.ModuleId == module.Id && p.UserId == userId);
                    if (progress != null)
                    {
                        totalAchievedEcs += progress.CompletedEVLs
                            .Where(completed => completed.ModuleEvl != null)
                            .Sum(completed => completed.ModuleEvl.Ec);
                    }
                }

                if (totalAchievedEcs >= value)
                {
                    return new ValidationResult(true, "Genoeg EC's uit propedeuse.", semestersList[currentSemesterIndex].ModuleId);
                }
                else
                {
                    return new ValidationResult(false, $"Niet genoeg Ec's uit propedeuse behaald, minimaal {value} vereist, u heeft op dit moment {totalAchievedEcs} ec's uit propedeuse behaald.", semestersList[currentSemesterIndex].ModuleId);
                }


            }
            return new ValidationResult(true, "Validatie niet vereist");
        }
    }
}
