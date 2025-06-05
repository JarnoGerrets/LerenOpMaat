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
        public RolesController(LOMContext context) : base(context) {}

        /// <summary>
        /// Controleren of een gebruiker bepaalde rechten heeft
        /// </summary>
        /// <param name="feature">Rechten om te controleren</param>
        /// <returns>Ok met True of False</returns>
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

        /// <summary>
        /// Zet een nieuwe actieve rol van een gebruiker binnen de huidige sessie
        /// Vereiste rol: Administrator
        /// </summary>
        /// <param name="role">De rol om toe te voegen, (Administrator, Lecturer, Student)</param>
        /// <returns>BadRequest als er een niet toegestane rol wordt toegevoegd.</returns>
        /// <returns>Ok als de rol is toegevoegd.</returns>
        [Authorize(Roles = "Administrator")]
        [HttpPost("effective-role")]
        [ValidateAntiForgeryToken]
        public IActionResult SetEffectiveRole([FromBody] string role)
        {
            var allowedRoles = new[] { "Administrator", "Lecturer", "Student" };

            if (!allowedRoles.Contains(role))
            {
                return BadRequest("Opgegeven rol is niet valide.");
            }

            HttpContext.Session.SetString("EffectiveRole", role);
            return Ok(role);
        }

        /// <summary>
        /// Haal je huidige actieve rol op
        /// </summary>
        /// <returns>Ok met je actieve rol</returns>
        [Authorize]
        [HttpGet("effective-role")]
        public IActionResult GetEffectiveRole()
        {
            var effectiveRole = HttpContext.Session.GetString("EffectiveRole");
            
            if (string.IsNullOrEmpty(effectiveRole))
            {
                var roles = User.FindAll(ClaimTypes.Role)
                    .Select(r => r.Value)
                    .ToList();
                
                effectiveRole = roles.Contains("Administrator") ? "Administrator"
                              : roles.Contains("Lecturer") ? "Lecturer"
                              : "Student";
            }

            return Ok(effectiveRole);
        }
    }
}