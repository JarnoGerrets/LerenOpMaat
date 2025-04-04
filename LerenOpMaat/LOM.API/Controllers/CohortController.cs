using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LOM.API.DAL;
using LOM.API.Models;

namespace LOM.API.Controllers
{
	[Route("api/[controller]")]
    [ApiController]
    public class CohortController : ControllerBase
    {
        private readonly LOMContext _context;

        public CohortController(LOMContext context)
        {
            _context = context;
        }

        // GET: api/Cohort
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Cohort>>> GetCohorts()
        {
            return await _context.Cohorts.ToListAsync();
        }

        // GET: api/Cohort/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Cohort>> GetCohort(int id)
        {
            var cohort = await _context.Cohorts.FindAsync(id);

            if (cohort == null)
            {
                return NotFound();
            }

            return cohort;
        }

        // PUT: api/Cohort/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCohort(int id, Cohort cohort)
        {
            if (id != cohort.Id)
            {
                return BadRequest();
            }

            _context.Entry(cohort).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CohortExists(id))
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

        // POST: api/Cohort
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Cohort>> PostCohort(Cohort cohort)
        {
            _context.Cohorts.Add(cohort);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCohort", new { id = cohort.Id }, cohort);
        }

        // DELETE: api/Cohort/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCohort(int id)
        {
            var cohort = await _context.Cohorts.FindAsync(id);
            if (cohort == null)
            {
                return NotFound();
            }

            _context.Cohorts.Remove(cohort);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CohortExists(int id)
        {
            return _context.Cohorts.Any(e => e.Id == id);
        }
    }
}
