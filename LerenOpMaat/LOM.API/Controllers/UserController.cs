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

    [Authorize]
    [Route("api/[controller]")]
    public class RolesController : Controller
    {
        [HttpGet("{feature}")]
        [EnableRateLimiting("GetLimiter")]
        public IActionResult HasPermission(string feature)
        {
            var roles = User.FindAll(ClaimTypes.Role).Select(r => r.Value).ToList();

            bool hasPermission = feature.ToLower() switch
            {
                "teacher" => roles.Contains("Administrator") || roles.Contains("Lecturer"),
                "student" => roles.Contains("Student") || roles.Contains("Administrator"),
                "admin" => roles.Contains("Administrator"),
                _ => false
            };

            return Ok(hasPermission);
        }

        [Authorize(Roles = "Administrator")]
        [HttpPost("effective-role")]
        public IActionResult SetEffectiveRole([FromBody] string role)
        {
            var allowedRoles = new[] { "Administrator", "Lecturer", "Student" };

            if (!allowedRoles.Contains(role))
            {
                return BadRequest("Invalid role");
            }

            HttpContext.Session.SetString("EffectiveRole", role);
            return Ok();
        }

        [Authorize]
        [HttpGet("effective-role")]
        public IActionResult GetEffectiveRole()
        {
            var effectiveRole = HttpContext.Session.GetString("EffectiveRole");

            if (string.IsNullOrEmpty(effectiveRole))
            {
                var roles = User.FindAll(ClaimTypes.Role).Select(r => r.Value).ToList();
                effectiveRole = roles.Contains("Administrator") ? "Administrator"
                              : roles.Contains("Lecturer") ? "Lecturer"
                              : "Student";
            }

            return Ok(effectiveRole);
        }
    }

    [AllowAnonymous]
    [Route("api/[controller]")]
    public class StatusController : Controller
    {
        [HttpGet]
        public IActionResult GetLoginStatus()
        {
            return Ok(new { IsAuthenticated = User?.Identity?.IsAuthenticated == true });
        }
    }

}
