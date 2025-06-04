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

        // GET: api/learningRoutes/5
        [HttpGet("{id}")]
        [EnableRateLimiting("GetLimiter")]
        public async Task<ActionResult<LearningRoute>> GetlearningRoute(int id)
        {
            User? user = GetActiveUser();
            var learningRoute = await _context.LearningRoutes.Where(l => l.UserId == user.Id)
            .Include(s => s.Semesters).ThenInclude(m => m.Module).FirstOrDefaultAsync(lr => lr.Id == id);

            if (learningRoute == null)
            {
                return NotFound();
            }

            return learningRoute;
        }

        // PUT: api/learningRoutes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        [EnableRateLimiting("PostLimiter")]
        public async Task<IActionResult> PutlearningRoute(int id, LearningRoute learningRoute)
        {
            if (id != learningRoute.Id)
            {
                return BadRequest();
            }

            _context.Entry(learningRoute).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!learningRouteExists(id))
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

        // POST: api/learningRoutes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [EnableRateLimiting("PostLimiter")]
        public async Task<ActionResult<LearningRoute>> PostlearningRoute([FromBody] LearningRoute learningRoute)
        {
            if (learningRoute == null)
                return BadRequest("Learning route cannot be null.");

            User? user = GetActiveUser();

            if (user == null)
                return BadRequest("User does not exist.");

            var validationResults = await _validationService.ValidateSemestersAsync(learningRoute.Semesters.ToList(), user.Id);

            if (validationResults.Any(r => !r.IsValid))
                return Ok(validationResults);

            learningRoute.User = user;
            _context.LearningRoutes.Add(learningRoute);
            await _context.SaveChangesAsync();

            user.LearningRouteId = learningRoute.Id;
            await _context.SaveChangesAsync();

            return Ok();
        }


        // DELETE: api/learningRoutes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLearningRoute(int id)
        {
            User? user = GetActiveUser();

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

        //Speciaal get leerroute call
        [HttpGet("/api/LearningRoute/User")]
        [EnableRateLimiting("GetLimiter")]
        public async Task<ActionResult<LearningRoute>> GetLearningRouteByUserId()
        {
            User? user = GetActiveUser();

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
        //LearningRoute/ValidateRoute
        [HttpPost("ValidateRoute")]
        [EnableRateLimiting("ValidateLimiter")]
        public async Task<ActionResult<ICollection<IValidationResult>>> ValidateRoute(List<Semester> semesters)
        {
            User? user = GetActiveUser();

            if (user == null)
            {
                return BadRequest("Teveel semesters voor validatie");
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

        private bool learningRouteExists(int id)
        {
            return _context.LearningRoutes.Any(e => e.Id == id);
        }


    }
}
