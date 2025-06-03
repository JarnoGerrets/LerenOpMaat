using LOM.API.DAL;
using LOM.API.DTO;
using LOM.API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;

namespace LOM.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GraduateProfileController : Controller
    {
        private readonly LOMContext _context;

        public GraduateProfileController(LOMContext context)
        {
            _context = context;
        }
        // GET: api/GraduateProfile
        [HttpGet]
        [EnableRateLimiting("GetLimiter")]

        public async Task<ActionResult<IEnumerable<GraduateProfile>>> GetProfiles()
        {
            var profiles = await _context.GraduateProfiles
                .ToListAsync();

            return profiles;
        }

        // GET: api/GraduateProfile/id
        [HttpGet("{id}")]
        [EnableRateLimiting("GetLimiter")]

        public async Task<ActionResult<GraduateProfile>> GetProfile(int id)
        {
            var profile = await _context.GraduateProfiles.Where(g => g.Id == id).FirstOrDefaultAsync();

            if (profile == null)
            {
                return NotFound();
            }

            return profile;
        }
    }
}
