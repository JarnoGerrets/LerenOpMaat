using System.Diagnostics;
using LOM.API.DAL;
using LOM.API.Models;
using LOM.API.Validator.ValidationResults;

namespace LOM.API.Validator.Specifications
{
    public class RequiredModuleSpecification(int requiredModuleId, int currentSemesterIndex, LOMContext context) : ISpecification<IEnumerable<Semester>>
    {
        public IValidationResult IsSatisfiedBy(IEnumerable<Semester> semesters)
        {
            var semestersList = semesters.ToList();
            bool exists = semesters
                .Take(currentSemesterIndex)
                .Any(s => s.Module != null && s.Module.Id == requiredModuleId);

            if (!exists)
            {
                var requiredModule = context.Modules.FirstOrDefault(m => m.Id == requiredModuleId);
                if (requiredModule != null)
                {
                    return new ValidationResult(false,
                        $"{requiredModule.Name} ({requiredModule.Code}) moet eerst worden gevolgd.", semestersList[currentSemesterIndex].ModuleId);
                }
            }
            return new ValidationResult(true, "Required module is satisfied.", semestersList[currentSemesterIndex].ModuleId);
        }
    }

}
