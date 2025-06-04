using System.Security.Claims;
using LOM.API.Controllers.Base;
using LOM.API.DAL;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace LOM.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class RolesController : LOMBaseController
    {
        public RolesController(LOMContext context) : base(context) { }

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
            Console.WriteLine("role = " + role);

            var allowedRoles = new[] { "Administrator", "Lecturer", "Student" };

            if (!allowedRoles.Contains(role))
            {
                return BadRequest("Invalid role");
            }

            HttpContext.Session.SetString("EffectiveRole", role);
            return Ok(role);
        }

        [Authorize]
        [HttpGet("effective-role")]
        public IActionResult GetEffectiveRole()
        {
            var effectiveRole = HttpContext.Session.GetString("EffectiveRole");
            Console.WriteLine("role = " + effectiveRole);

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
}