using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LOM.API.DAL;
using LOM.API.Models;
using Microsoft.AspNetCore.Authorization;
using LOM.API.DTO;
using LOM.API.Validator;
using LOM.API.Validator.ValidationResults;

namespace LOM.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class SemesterController : ControllerBase
    {
        private readonly LOMContext _context;

        public SemesterController(LOMContext context)
        {
            _context = context;
        }

        // GET: api/Semesters
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Semester>>> GetSemesters()
        {
            return await _context.Semesters.ToListAsync();
        }

        // GET: api/Semesters/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Semester>> GetSemester(int id)
        {
            var semester = await _context.Semesters.FindAsync(id);

            if (semester == null)
            {
                return NotFound();
            }

            return semester;
        }

        // PUT: api/Semesters/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSemester(int id, Semester semester)
        {
            if (id != semester.Id)
            {
                return BadRequest();
            }

            _context.Entry(semester).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SemesterExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Semesters
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Semester>> PostSemester(Semester semester)
        {
            _context.Semesters.Add(semester);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSemester", new { id = semester.Id }, semester);
        }

        // DELETE: api/Semesters/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSemester(int id)
        {
            var semester = await _context.Semesters.FindAsync(id);
            if (semester == null)
            {
                return NotFound();
            }

            _context.Semesters.Remove(semester);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        //Speciaal update semester call
        [HttpPut("/api/[controller]/updateSemesters/{learningRouteId}")]
        public async Task<IActionResult> UpdateSemesters(int learningRouteId, [FromBody] List<Semester> semesters)
        {
            var learningRoute = await _context.LearningRoutes
                .Include(lr => lr.Semesters)
                .FirstOrDefaultAsync(lr => lr.Id == learningRouteId);

            if (learningRoute == null)
            {
                return NotFound($"No learningRoute found for Id: {learningRouteId}");
            }

            foreach (var semester in semesters)
            {
                // Zoek het semester obv de Year, senester en learningRouteId
                var semesterToUpdate = await _context.Semesters
                    .FirstOrDefaultAsync(s => s.Year == semester.Year && s.Period == semester.Period && s.LearningRouteId == learningRouteId);

                if (semesterToUpdate == null)
                {
                    return NotFound($"No semester found with Id: {semester.Id} for learningRouteId: {learningRouteId}");
                }

                semesterToUpdate.Year = semester.Year;
                semesterToUpdate.Period = semester.Period;
                semesterToUpdate.ModuleId = semester.ModuleId;
            }
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while updating the semesters.");
            }

            return Ok(learningRoute);
        }

        [Authorize(Roles = "Teacher, Administrator")]
        [HttpPatch("updatedlockedsemester")]
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

        private bool SemesterExists(int id)
        {
            return _context.Semesters.Any(e => e.Id == id);
        }

        private async Task<ICollection<IValidationResult>> ValidateSemesters(List<Semester> semesters, int userId)
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
            var results = validator.ValidateLearningRoute(semesters);
            return results;
        }

    }
}
