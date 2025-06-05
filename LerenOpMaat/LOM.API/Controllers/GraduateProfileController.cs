using LOM.API.Controllers.Base;
using LOM.API.DAL;
using LOM.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;

namespace LOM.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GraduateProfileController : LOMBaseController
    {
        
        public GraduateProfileController(LOMContext context) : base(context) {}

        /// <summary>
        /// Uitstroom profielen ophalen
        /// </summary>
        /// <returns>Lijst met uitstroom profielen</returns>
        [HttpGet]
        [EnableRateLimiting("GetLimiter")]
        public async Task<ActionResult<IEnumerable<GraduateProfile>>> GetProfiles()
        {
            var profiles = await _context.GraduateProfiles
                .ToListAsync();

            return profiles;
        }

        /// <summary>
        /// Specifiek uitstroom profiel ophalen
        /// </summary>
        /// <param name="id">ID van uitstroom profiel</param>
        /// <returns>NotFound als er geen uitstroom profiel gevonden is</returns>
        /// <returns>Uitstroom profiel model</returns>
        [HttpGet("{id}")]
        [EnableRateLimiting("GetLimiter")]
        public async Task<ActionResult<GraduateProfile>> GetProfile(int id)
        {
            var profile = await _context.GraduateProfiles.Where(g => g.Id == id).FirstOrDefaultAsync();

            if (profile == null)
            {
                return NotFound("Geen uitstroom profiel gevonden.");
            }

            return profile;
        }
    }
}
