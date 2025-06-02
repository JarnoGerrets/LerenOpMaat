using LOM.API.DAL;
using LOM.API.Models;
using LOM.API.Validator.ValidationResults;
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
            foreach (var semester in semesters)
            {
                if (semester.ModuleId.HasValue)
                {
                    var module = await _context.Modules
                        .Include(m => m.Requirements)
                        .FirstOrDefaultAsync(m => m.Id == semester.ModuleId);
                    if (module != null)
                    {
                        semester.Module = module;
                    }
                }
            }

            var validator = new LearningRouteValidator(_context, userId);
            return validator.ValidateLearningRoute(semesters);
        }
    }
}
