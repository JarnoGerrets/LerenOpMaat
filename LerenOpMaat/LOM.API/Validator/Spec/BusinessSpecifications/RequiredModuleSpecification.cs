using LOM.API.Models;
using LOM.API.Validator.ValidationResults;

namespace LOM.API.Validator.Spec.BusinessSpecifications
{
    public class RequiredModuleSpecification : IBusinessSpecification<IEnumerable<Semester>>
    {
        private readonly int RequiredModuleId;
        private readonly int CurrentSemesterIndex;
        private readonly ValidationContext ValidationContext;

        public RequiredModuleSpecification(string value, int index, ValidationContext validationContext)
        {
            if (!int.TryParse(value, out var parsedId))
                throw new ArgumentException($"Invalid module ID '{value}' for RequiredModule.");

            RequiredModuleId = parsedId;
            CurrentSemesterIndex = index;
            ValidationContext = validationContext;
        }
        public IValidationResult IsSatisfiedBy(IEnumerable<Semester> semesters)
        {
            var semestersList = semesters.ToList();
            bool exists = semesters
                .Take(CurrentSemesterIndex)
                .Any(s => s.Module != null && s.Module.Id == RequiredModuleId);

            //checking if the required module appears before current in route
            if (!exists && ValidationContext.Modules.TryGetValue(RequiredModuleId, out var requiredModule))
            {
                return new ValidationResult(false,
                    $"{requiredModule.Name} ({requiredModule.Code}) moet eerst worden gevolgd.", semestersList[CurrentSemesterIndex].ModuleId);
            }
            return new ValidationResult(true, "Required module is satisfied.", semestersList[CurrentSemesterIndex].ModuleId);

        }

    }
}
