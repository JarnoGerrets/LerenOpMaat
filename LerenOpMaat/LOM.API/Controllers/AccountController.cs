using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LOM.API.DAL;
using LOM.API.Models;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Authorization;
using System.Diagnostics;
using Microsoft.AspNetCore.RateLimiting;

namespace LOM.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/account")]
    public class AccountController : Controller
    {
        private readonly LOMContext _context;

        public AccountController(LOMContext context)
        {
            _context = context;
        }

        [HttpGet]
        [EnableRateLimiting("GetLimiter")]

        public IActionResult GetUser()
        {
            // Haal user claims op
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); // sub
            var email = User.FindFirstValue("preferred_username");       // meestal email
            var roles = User.FindAll(ClaimTypes.Role).Select(r => r.Value).ToList();

            if (string.IsNullOrEmpty(userId))
                return Unauthorized("No user ID found in claims.");

            // Bepaal RoleId op basis van de claims
            int roleId = (roles.Contains("Administrator")) ? 1 : 2;

            var user = _context.User.FirstOrDefault(u => u.ExternalID == userId);

            if (user == null)
            {
                // Maak nieuwe user aan met juiste RoleId
                user = new User
                {
                    ExternalID = userId,
                    FirstName = "",
                    LastName = "",
                    StartYear = null,
                    RoleId = 2
                };

                _context.User.Add(user);
                _context.SaveChanges();

                // Haal de user opnieuw op zodat user.Id correct is
                user = _context.User.FirstOrDefault(u => u.ExternalID == userId);
            }

            return Ok(new
            {
                Roles = roles,
                Username = email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                InternalId = user.Id,
                ExternalID = userId
            });
        }

        [Authorize(Roles = "Lecturer, Administrator")]
        [HttpGet("getstudent/{id}")]
        [EnableRateLimiting("GetLimiter")]

        public async Task<ActionResult<User>> GetStudent(int id)
        {
            var student = await _context.User.FirstOrDefaultAsync(u => u.Id == id);

            if (student == null)
            {
                return NotFound();
            }

            return Ok(student);
        }

        [Authorize(Roles = "Administrator")]
        [HttpGet("roles")]
        public async Task<ActionResult<IEnumerable<Role>>> GetAllRoles()
        {
            var roles = await _context.Roles.ToListAsync();
            return Ok(roles);
        }
    }
}
