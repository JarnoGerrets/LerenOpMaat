using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LOM.API.DAL;
using LOM.API.Models;

namespace LOM.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class learningRoutesController : ControllerBase
    {
        private readonly LOMContext _context;

        public learningRoutesController(LOMContext context)
        {
            _context = context;
        }

        // GET: api/learningRoutes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<learningRoute>>> GetlearningRoute()
        {
            return await _context.learningRoute.Include(s => s.Semesters).ThenInclude(m => m.Module).ToListAsync();
        }

        // GET: api/learningRoutes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<learningRoute>> GetlearningRoute(int id)
        {
            var learningRoute = await _context.learningRoute.Include(s => s.Semesters).ThenInclude(m => m.Module).FirstOrDefaultAsync(lr => lr.Id == id);

            if (learningRoute == null)
            {
                return NotFound();
            }

            return learningRoute;
        }

        // PUT: api/learningRoutes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutlearningRoute(int id, learningRoute learningRoute)
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
        public async Task<ActionResult<learningRoute>> PostlearningRoute(learningRoute learningRoute)
        {
            if (learningRoute == null)
            {
                return BadRequest("Learning route cannot be null.");
            }

            if (learningRoute.Users != null && learningRoute.Users.Any())
            {
                var userIds = learningRoute.Users.Select(u => u.Id).ToList();
                var existingUsers = await _context.Users.Where(u => userIds.Contains(u.Id)).ToListAsync();

                if (existingUsers.Count != userIds.Count)
                {
                    return BadRequest("One or more users do not exist.");
                }

                learningRoute.Users = existingUsers;
            }

            _context.learningRoute.Add(learningRoute);

            await _context.SaveChangesAsync();

            return Ok();
        }

        // DELETE: api/learningRoutes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletelearningRoute(int id)
        {
            var learningRoute = await _context.learningRoute
                .Include(lr => lr.Semesters)
                .Include(lr => lr.Users)
                .FirstOrDefaultAsync(lr => lr.Id == id);

            if (learningRoute == null)
            {
                return NotFound();
            }

            // Verwijder gekoppeld Semesters
            if (learningRoute.Semesters != null && learningRoute.Semesters.Any())
            {
                _context.Semesters.RemoveRange(learningRoute.Semesters);
            }

            //Ontkoppel de user van de leerroute
            if (learningRoute.Users != null && learningRoute.Users.Any())
            {
                foreach (var user in learningRoute.Users)
                {
                    user.learningRouteId = null;
                }
            }

            _context.learningRoute.Remove(learningRoute);
            await _context.SaveChangesAsync();

            return Ok();
        }

        //Seciaal get leeroute call
        [HttpGet("/api/learningRoutes/User/{userId}")]
        public async Task<ActionResult<learningRoute>> GetLearningRouteByUserId(int userId)
        {
            var learningRoute = await _context.learningRoute
                .Include(u => u.Users)
                .Include(s => s.Semesters)
                .ThenInclude(m => m.Module)
                .FirstOrDefaultAsync(lr => lr.Users.Any(u => u.Id == userId && lr.Id == u.learningRouteId));

            if (learningRoute == null)
            {
                return NotFound();
            }

            return learningRoute;
        }

        private bool learningRouteExists(int id)
        {
            return _context.learningRoute.Any(e => e.Id == id);
        }
    }
}
