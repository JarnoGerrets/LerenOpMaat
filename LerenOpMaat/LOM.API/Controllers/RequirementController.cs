using LOM.API.DAL;
using LOM.API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LOM.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RequirementController : Controller
    {
        private readonly LOMContext _context;

        public RequirementController(LOMContext context)
        {
            _context = context;
        }

        // GET: api/Requirement/5
        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<Requirement>>> GetRequirementsbyModule(int moduleId)
        {
            var requirements = await _context.Requirements
                .Where(r => r.ModuleId == moduleId)
                .ToListAsync();

            if (requirements == null || !requirements.Any())
            {
                return NotFound();
            }

            return Ok(requirements);
        }
    }
}
