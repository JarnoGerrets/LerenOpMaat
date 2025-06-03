using LOM.API.DAL;
using LOM.API.DTO;
using LOM.API.Models;
using LOM.API.Validator;
using LOM.API.Validator.ValidationResults;
using LOM.API.Validator.ValidationService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LOM.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class SemesterController : ControllerBase
    {
        private readonly LOMContext _context;
        private readonly ISemesterValidationService _validationService;

        public SemesterController(LOMContext context, ISemesterValidationService validationService)
        {
            _context = context;
            _validationService = validationService;
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
        public async Task<IActionResult> UpdateSemesters(int learningRouteId, [FromBody] UpdateSemestersDto dto)
        {
            var learningRoute = await _context.LearningRoutes
                .Include(lr => lr.Semesters)
                .FirstOrDefaultAsync(lr => lr.Id == learningRouteId);

            if (learningRoute == null)
                return NotFound($"No learningRoute found for Id: {learningRouteId}");

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
            var validationResults = await _validationService.ValidateSemestersAsync(dto.Semesters, dto.UserId);

            if (validationResults.Any(r => !r.IsValid))
                return Ok(validationResults);

            await _context.SaveChangesAsync();
            return Ok();
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

    }
}
