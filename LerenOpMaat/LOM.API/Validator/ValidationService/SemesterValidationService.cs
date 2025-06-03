using LOM.API.DAL;
using LOM.API.Models;
using LOM.API.Validator.ValidationResults;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace LOM.API.Validator.ValidationService
{
    public class SemesterValidationService : ISemesterValidationService
    {
        private readonly LOMContext _context;

        public SemesterValidationService(LOMContext context)
        {
            _context = context;
        }

        public async Task<ICollection<IValidationResult>> ValidateSemestersAsync(List<Semester> semesters, int userId)
        {

            if (semesters.Count > 30)
            {
                throw new InvalidDataException("Too many semester, cannot process this request");
            }
            var modules = await _context.Modules
                .Include(m => m.Requirements)
                .ToDictionaryAsync(m => m.Id);

            var progresses = await _context.ModuleProgresses
                .Include(p => p.CompletedEVLs).ThenInclude(e => e.ModuleEvl)
                .Where(p => p.UserId == userId)
                .ToListAsync();

            foreach (var semester in semesters)
            {
                if (semester.ModuleId.HasValue && modules.TryGetValue(semester.ModuleId.Value, out var module))
                {
                    semester.Module = module;
                }
            }

            var validationContext = new ValidationContext(userId, progresses, modules);

            var validator = new LearningRouteValidator(validationContext);
            return validator.ValidateLearningRoute(semesters);
        }
    }
}
