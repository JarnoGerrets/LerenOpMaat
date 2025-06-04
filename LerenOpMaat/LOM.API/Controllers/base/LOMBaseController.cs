using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LOM.API.DAL;
using LOM.API.Models;
using System.Security.Claims;

namespace LOM.API.Controllers.Base
{
    [ApiController]
    public abstract class LOMBaseController : ControllerBase
    {
        protected readonly LOMContext _context;

        public LOMBaseController(LOMContext context)
        {
            _context = context;
        }

        protected User? GetActiveUser()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userIdClaim == null)
                return null;

            return _context.User
                .Include(u => u.LearningRoute)
                .FirstOrDefault(u => u.ExternalID == userIdClaim);
        }
    }
}
