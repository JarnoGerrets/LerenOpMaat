using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LOM.API.DAL;
using LOM.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.RateLimiting;
using LOM.API.Controllers.Base;

namespace LOM.API.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class UserController : LOMBaseController
    {

        public UserController(LOMContext context) : base(context) {}

        /// <summary>
        /// Haal het start jaar van de huidige gebruiker op
        /// </summary>
        /// <returns>Unauthorized als de gebruiker niet gevonden is</returns>
        /// <returns>Ok met het start jaar</returns>
        [HttpGet("startyear")]
        [EnableRateLimiting("GetLimiter")]
        public async Task<ActionResult<int?>> GetStartYear()
        {
            User? user = GetActiveUser();

            if (user == null)
            {
                return Unauthorized();
            }

            return Ok(user.StartYear);
        }

        /// <summary>
        /// Update het start jaar van de huidige gebruiker
        /// </summary>
        /// <param name="startYear"></param>
        /// <returns>Unauthorized als de gebruiker niet gevonden is</returns>
        /// <returns>Forbid als het user.Id niet overeen komt met id</returns>
        /// <returns>BadRequest als het startjaar niet voldoet aan de eis</returns>
        /// <returns>Ok als het opslaan van de gebruiker successvol is gelukt</returns>
        [HttpPost("startyear")]
        [ValidateAntiForgeryToken]
        [EnableRateLimiting("PostLimiter")]
        public async Task<IActionResult> SetStartYear([FromBody] int startYear)
        {
            User? user = GetActiveUser();

            if (user == null)
            {
                return Unauthorized();
            }

            var currentYear = DateTime.Now.Year + 1;
            var validYears = Enumerable.Range(currentYear - 3, 4);
            if (validYears.Contains(startYear) == false)
            {
                return BadRequest();
            }

            user.StartYear = startYear;
            await _context.SaveChangesAsync();

            return Ok();
        }

        /// <summary>
        /// Haal alle leraren op
        /// </summary>
        /// <returns>Lijst met leraar models</returns>
        [HttpGet("teachers")]
        [EnableRateLimiting("GetLimiter")]
        public async Task<ActionResult<IEnumerable<User>>> GetUsersWithIdOne()
        {
            var teachers = await _context.User.Where(u => u.RoleId == 1).ToListAsync();

            return Ok(teachers);
        }
    }
}
