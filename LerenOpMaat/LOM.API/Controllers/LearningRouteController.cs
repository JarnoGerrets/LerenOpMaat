using LOM.API.Controllers.Base;
using LOM.API.DAL;
using LOM.API.Models;
using LOM.API.Validator.ValidationResults;
using LOM.API.Validator.ValidationService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;

namespace LOM.API.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class LearningRouteController : LOMBaseController
    {
        private readonly ISemesterValidationService _validationService;

        public LearningRouteController(LOMContext context, ISemesterValidationService validationService) : base(context)
        {
            _validationService = validationService;
        }

        /// <summary>
        /// Specifieke leerroute ophalen + user + semesters + module
        /// </summary>
        /// <param name="id">ID van de leerroute om op te halen</param>
        /// <returns>Unauthorized als de gebruiker niet gevonden is</returns>
        /// <returns>NotFound als de leerroute niet gevonden is</returns>
        /// <returns>Leerroute model</returns>
        [HttpGet("{id}")]
        [EnableRateLimiting("GetLimiter")]
        public async Task<ActionResult<LearningRoute>> GetlearningRoute(int id)
        {
            User? user = GetActiveUser();

            if (user == null)
            {
                return Unauthorized();
            }

            var learningRoute = await _context.LearningRoutes
                .Where(l => l.UserId == user.Id)
                .Include(s => s.Semesters)
                .ThenInclude(m => m.Module)
                .FirstOrDefaultAsync(lr => lr.Id == id);

            if (learningRoute == null)
            {
                return NotFound();
            }

            return learningRoute;
        }

        /// <summary>
        /// Leerroute opdaten
        /// </summary>
        /// <param name="id">ID van de leerroute</param>
        /// <param name="learningRoute">Leerroute model met geupdate properties</param>
        /// <see cref="go.microsoft.com/fwlink/?linkid=2123754"/>
        /// <returns>BadRequest als het id niet overeen komt met leerroute model</returns>
        /// <returns>NotFound als de leerroute niet gevonden is</returns>
        /// <returns>NoContent als de leerroute successvol opgeslagen is</returns>
        [HttpPut("{id}")]
        [EnableRateLimiting("PostLimiter")]
        public async Task<IActionResult> PutLearningRoute(int id, LearningRoute learningRoute)
        {
            if (id != learningRoute.Id)
            {
                return BadRequest();
            }

            if (!LearningRouteExists(id))
            {
                return NotFound();
            }

            _context.Entry(learningRoute).State = EntityState.Modified;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        /// <summary>
        /// Leerroute opslaan
        /// </summary>
        /// <param name="learningRoute">Leerroute model met properties fromBody</param>
        /// <see cref="go.microsoft.com/fwlink/?linkid=2123754"/>
        /// <returns>BadRequest als er geen leerroute aanwezig is in de body</returns>
        /// <returns>Unauthorized als de gebruiker niet gevonden is</returns>
        /// <returns>Ok als de leerroute successvol is opgeslagen</returns>
        [HttpPost]
        [EnableRateLimiting("PostLimiter")]
        public async Task<ActionResult<LearningRoute>> PostLearningRoute([FromBody] LearningRoute? learningRoute)
        {
            if (learningRoute == null)
            {
                return BadRequest("Learning route cannot be null.");
            }

            User? user = GetActiveUser();

            if (user == null)
            {
                return Unauthorized();
            }

            var validationResults = await _validationService.ValidateSemestersAsync(learningRoute.Semesters.ToList(), user.Id);

            if (validationResults.Any(r => !r.IsValid))
            {
                return Ok(validationResults);
            }

            learningRoute.User = user;
            _context.LearningRoutes.Add(learningRoute);
            await _context.SaveChangesAsync();

            user.LearningRouteId = learningRoute.Id;
            await _context.SaveChangesAsync();

            return Ok();
        }

        /// <summary>
        /// Een leerroute verwijderen
        /// </summary>
        /// <param name="id">ID van de leerroute om te verwijderen</param>
        /// <returns>Unauthorized als de gebruiker niet gevonden is</returns>
        /// <returns>NotFound als de leerroute niet gevonden is</returns>
        /// <returns>Ok als de leerroute met success is verwijderd</returns>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLearningRoute(int id)
        {
            User? user = GetActiveUser();

            if (user == null)
            {
                return Unauthorized();
            }

            var learningRoute = await _context.LearningRoutes
                .Include(lr => lr.Semesters)
                .Include(lr => lr.User)
                .FirstOrDefaultAsync(lr => lr.Id == id && lr.User == user);

            if (learningRoute == null)
            {
                return NotFound();
            }

            // Remove related Semesters
            if (learningRoute.Semesters != null && learningRoute.Semesters.Any())
            {
                _context.Semesters.RemoveRange(learningRoute.Semesters);
            }

            // Unlink the user from the learning route
            if (learningRoute.User != null)
            {
                learningRoute.User.LearningRouteId = null;
            }

            _context.LearningRoutes.Remove(learningRoute);
            await _context.SaveChangesAsync();

            return Ok();
        }

        /// <summary>
        /// Alle leerroutes ophalen van een user
        /// </summary>
        /// <param name="id">ID van de user</param>
        /// <returns>Unauthorized als de gebruiker niet gevonden is</returns>
        /// <returns>NotFound als er geen gebruiker niet gevonden is</returns>
        /// <returns>Leerroute model als deze gevonden is</returns>
        [HttpGet("/api/LearningRoute/User")]
        [EnableRateLimiting("GetLimiter")]
        public async Task<ActionResult<LearningRoute>> GetLearningRouteByUserId()
        {
            User? user = GetActiveUser();

            if (user == null)
            {
                return Unauthorized();
            }

            var learningRoute = await _context.LearningRoutes
                .Include(u => u.User)
                .Include(s => s.Semesters)
                .ThenInclude(m => m.Module)
                .FirstOrDefaultAsync(lr => lr.UserId == user.Id);

            var getUser = await _context.User.FirstOrDefaultAsync(ui => ui.Id == user.Id);

            if (learningRoute == null)
            {
                // Always return the user data.
                return new LearningRoute
                {
                    UserId = getUser.Id,
                    User = new User
                    {
                        Id = getUser.Id,
                        ExternalID = getUser.ExternalID,
                        FirstName = getUser.FirstName,
                        LastName = getUser.LastName
                    }
                };
            }

            if (learningRoute.User == null)
            {
                learningRoute.User = getUser;
            }

            return learningRoute;
        }

        /// <summary>
        /// Valideer een leerroute aan de hand van semesters
        /// </summary>
        /// <param name="semesters">Lijst met semesters</param>
        /// <returns>Unauthorized als de gebruiker niet gevonden is</returns>
        /// <returns>BadRequest als de leerroute fouten heeft tijdens valideren</returns>
        /// <returns>Ok als de leerroute gevalideerd is</returns>
        [AllowAnonymous]
        [HttpPost("ValidateRoute")]
        [EnableRateLimiting("ValidateLimiter")]
        public async Task<ActionResult<ICollection<IValidationResult>>> ValidateRoute(List<Semester> semesters)
        {
            User? user = GetActiveUser();

            if (user == null)
            {
                return Unauthorized();
            }

            ICollection<IValidationResult> results;
            try
            {
                results = await _validationService.ValidateSemestersAsync(semesters, user.Id);
            }
            catch (InvalidDataException)
            {
                return BadRequest("Teveel semesters voor validatie");
            }
            return Ok(results);
        }

        private bool LearningRouteExists(int id)
        {
            return _context.LearningRoutes.Any(e => e.Id == id);
        }


    }
}
