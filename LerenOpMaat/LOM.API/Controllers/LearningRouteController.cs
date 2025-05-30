﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LOM.API.DAL;
using LOM.API.Models;
using LOM.API.Validator.ValidationResults;
using LOM.API.Validator;
using Microsoft.Extensions.Configuration.UserSecrets;
using Microsoft.AspNetCore.Authorization;

namespace LOM.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LearningRouteController : ControllerBase
    {
        private readonly LOMContext _context;

        public LearningRouteController(LOMContext context)
        {
            _context = context;
        }

        // GET: api/learningRoutes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<LearningRoute>>> GetlearningRoute()
        {
            return await _context.LearningRoutes.Include(s => s.Semesters).ThenInclude(m => m.Module).ToListAsync();
        }

        // GET: api/learningRoutes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<LearningRoute>> GetlearningRoute(int id)
        {
            var learningRoute = await _context.LearningRoutes.Include(s => s.Semesters).ThenInclude(m => m.Module).FirstOrDefaultAsync(lr => lr.Id == id);

            if (learningRoute == null)
            {
                return NotFound();
            }

            return learningRoute;
        }

        // PUT: api/learningRoutes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
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
        public async Task<ActionResult<LearningRoute>> PostlearningRoute([FromBody] LearningRoute learningRoute)
        {

            if (learningRoute == null)
            {
                return BadRequest("Learning route cannot be null.");

            }

            // Validate the user exists
            var existingUser = await _context.User.FirstOrDefaultAsync(u => u.Id == learningRoute.UserId);

            if (existingUser == null)
            {
                return BadRequest("User does not exist.");
            }

            learningRoute.User = existingUser;

            _context.LearningRoutes.Add(learningRoute);
            await _context.SaveChangesAsync();

            // Update the user's LearningRouteId after the LearningRoute is saved (so the Id is generated)
            existingUser.LearningRouteId = learningRoute.Id;
            await _context.SaveChangesAsync();

            return Ok();
        }

        // DELETE: api/learningRoutes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLearningRoute(int id)
        {
            var learningRoute = await _context.LearningRoutes
                .Include(lr => lr.Semesters)
                .Include(lr => lr.User)
                .FirstOrDefaultAsync(lr => lr.Id == id);

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
        [HttpGet("/api/LearningRoute/User/{userId}")]
        public async Task<ActionResult<LearningRoute>> GetLearningRouteByUserId(int userId)
        {
            var learningRoute = await _context.LearningRoutes
                .Include(u => u.User)
                .Include(s => s.Semesters)
                .ThenInclude(m => m.Module)
                .FirstOrDefaultAsync(lr => lr.UserId == userId);

            var getUser = await _context.User.FirstOrDefaultAsync(ui => ui.Id == userId);

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


        [HttpPost("ValidateRoute")]
        public async Task<ActionResult<ICollection<IValidationResult>>> ValidateRoute(List<Semester> semesters)
        {
            int userId = HttpContext.Session.GetInt32("UserId") ?? 0;

            foreach (var semester in semesters)
            {
                if (semester.ModuleId.HasValue)
                {
                    var module = await _context.Modules
                        .Include(m => m.Requirements)
                        .FirstOrDefaultAsync(m => m.Id == semester.ModuleId);
                    if (module != null)
                    {
                        semester.Module = module;
                    }
                }
            }

            var validator = new LearningRouteValidator(_context, userId);
            var results = validator.ValidateLearningRoute(semesters);

            return Ok(results);
        }

        private bool learningRouteExists(int id)
        {
            return _context.LearningRoutes.Any(e => e.Id == id);
        }
    }
}
