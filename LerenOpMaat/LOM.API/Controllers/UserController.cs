using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LOM.API.DAL;
using LOM.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.RateLimiting;
using LOM.API.Controllers.Base;
using System.Security.Claims;

namespace LOM.API.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class UserController : LOMBaseController
    {

        public UserController(LOMContext context) : base(context) {}

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


        [HttpPost("startyear")]
        [EnableRateLimiting("PostLimiter")]

        public async Task<IActionResult> SetStartYear(int id, [FromBody] int startYear)
        {
            var currentYear = DateTime.Now.Year + 1;
            var validYears = Enumerable.Range(currentYear - 3, 4);
            User? user = GetActiveUser();

            if (user == null)
            {
                return Unauthorized();
            }

            user.StartYear = startYear;
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpGet("teachers")]
        [EnableRateLimiting("GetLimiter")]
        public async Task<ActionResult<IEnumerable<User>>> GetUsersWithIdOne()
        {
            var teachers = await _context.User.Where(u => u.RoleId == 1).ToListAsync();

            return Ok(teachers);
        }

    }

}
