using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LOM.API.DAL;
using LOM.API.Models;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Authorization;

namespace LOM.API.Controllers
{
    [Route("authenticate")]
    public class AuthController : Controller
    {
        [HttpGet]
        public IActionResult Authenticate(string? returnUrl = null)
        {
            // 1. Gebruik de opgegeven returnUrl of de Referer-header als fallback
            if (string.IsNullOrEmpty(returnUrl))
            {
                returnUrl = Request.Headers["Referer"].ToString();
            }

            // 2. Fallback naar root als er geen geldige returnUrl is
            if (string.IsNullOrEmpty(returnUrl))
            {
                returnUrl = "/";
            }

            return Challenge(new AuthenticationProperties
            {
                RedirectUri = returnUrl
            }, OpenIdConnectDefaults.AuthenticationScheme);
        }

        [HttpGet("logout")]
        public async Task Logout()
        {
            await HttpContext.SignOutAsync("Cookies");

            //Important, this method should never return anything.
        }

    }



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
                    StartYear = DateTime.Now.Year,
                    RoleId = roleId
                };

                _context.User.Add(user);
                _context.SaveChanges();
            }

            // Store user ID in session
            HttpContext.Session.SetInt32("UserId", user.Id);

            return Ok(new
            {
                Roles = roles,
                Username = email,
                InternalId = user.Id,
                ExternalID = userId,
            });
        }
        // check if user is logged in
        [Authorize]
        [HttpGet("check")]
        public IActionResult CheckLogin()
        {
            if (User.Identity?.IsAuthenticated == true)
                return Ok();
            else
                return Unauthorized();
        }
    }


    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly LOMContext _context;

        public UserController(LOMContext context)
        {
            _context = context;
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUser()
        {
            return await _context.User.ToListAsync();
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.User.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        // PUT: api/Users/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, User user)
        {
            if (id != user.Id)
            {
                return BadRequest();
            }

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
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

        // POST: api/Users
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<User>> PostUser(User user)
        {
            _context.User.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUser", new { id = user.Id }, user);
        }

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.User.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.User.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserExists(int id)
        {
            return _context.User.Any(e => e.Id == id);
        }

        [HttpGet("startyear/{id}")]
        public async Task<ActionResult<int?>> GetStartYear(int id)
        {
            var user = await _context.User.FindAsync(id);

            if (user == null)
                return NotFound();

            return Ok(user.StartYear);
        }


        [HttpPost("startyear/{id}")]
        public async Task<IActionResult> SetStartYear(int id, [FromBody] int startYear)
        {
            var currentYear = DateTime.Now.Year + 1;
            var validYears = Enumerable.Range(currentYear - 3, 4);

            if (!validYears.Contains(startYear))
            {
                return BadRequest("Ongeldig startjaar.");
            }

            var user = await _context.User.FindAsync(id);

            if (user == null)
                return NotFound();

            user.StartYear = startYear;
            await _context.SaveChangesAsync();

            return Ok();
        }

    }
}
