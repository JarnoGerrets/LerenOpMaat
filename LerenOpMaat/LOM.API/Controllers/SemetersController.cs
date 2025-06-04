using LOM.API.Controllers.Base;
using LOM.API.DAL;
using LOM.API.Models;
using LOM.API.Validator.ValidationResults;
using LOM.API.Validator.ValidationService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;

namespace LOM.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class SemesterController : LOMBaseController
    {
        private readonly ISemesterValidationService _validationService;

        public SemesterController(LOMContext context, ISemesterValidationService validationService) : base(context)
        {
            _validationService = validationService;
        }

        /// <summary>
        /// Update semesters
        /// </summary>
        /// <param name="learningRouteId">SemesterUpdateLockDto model from body</param>
        /// <param name="dto">SemesterUpdateLockDto model from body</param>
        /// <returns>NotFound als er geen leerroute gevonden is</returns>
        /// <returns>BadRequest als het aantal semesters meer dan de max van 30 is</returns>
        /// <returns>Ok</returns>
        [HttpPut("/api/[controller]/updateSemesters/{learningRouteId}")]
        [EnableRateLimiting("ValidateLimiter")]
        public async Task<IActionResult> UpdateSemesters(int learningRouteId, [FromBody] UpdateSemestersDto dto)
        {
            var learningRoute = await _context.LearningRoutes
                .Include(lr => lr.Semesters)
                .FirstOrDefaultAsync(lr => lr.Id == learningRouteId);

            if (learningRoute == null)
                return NotFound($"No learningRoute found for Id: {learningRouteId}");

            if (learningRoute.Semesters?.Count > 30)
                return BadRequest("The number of semesters exceeds the allowed limit (30).");

            foreach (var semester in dto.Semesters)
            {
                var semesterToUpdate = await _context.Semesters
                    .FirstOrDefaultAsync(s => s.Year == semester.Year && s.Period == semester.Period && s.LearningRouteId == learningRouteId);

                if (semesterToUpdate == null)
                {
                    // Create a new semester if it doesn't exist
                    semesterToUpdate = new Semester
                    {
                        Year = semester.Year,
                        Period = semester.Period,
                        LearningRouteId = learningRouteId,
                        ModuleId = semester.ModuleId,
                        Locked = false
                    };
                    _context.Semesters.Add(semesterToUpdate);
                }
                else
                {
                    semesterToUpdate.Year = semester.Year;
                    semesterToUpdate.Period = semester.Period;
                    semesterToUpdate.ModuleId = semester.ModuleId;
                }
            }

            ICollection<IValidationResult> results;
            try
            {
                results = await _validationService.ValidateSemestersAsync(dto.Semesters, dto.UserId);
            }
            catch (InvalidDataException)
            {
                return BadRequest("Teveel semesters voor validatie");
            }
            if (results.Any(r => !r.IsValid))
                return Ok(results);

            await _context.SaveChangesAsync();
            return Ok();
        }
        
        /// <summary>
        /// Sluit een semester
        /// Vereiste rol: Lecturer of Administrator
        /// </summary>
        /// <param name="request">SemesterUpdateLockDto model from body</param>
        /// <returns>NotFound als er geen semester gevonden is</returns>
        /// <returns>Ok</returns>
        [Authorize(Roles = "Lecturer, Administrator")]
        [HttpPatch("updatedlockedsemester")]
        [EnableRateLimiting("GetLimiter")]
        public async Task<IActionResult> UpdateLockSemester([FromBody] SemesterUpdateLockDto request)
        {
            var semesterUpdate = _context.Semesters.FirstOrDefault(s => s.Id == request.SemesterId);

            if (semesterUpdate == null)
            {
                return NotFound();
            }

            semesterUpdate.Locked = request.Locked;
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}
