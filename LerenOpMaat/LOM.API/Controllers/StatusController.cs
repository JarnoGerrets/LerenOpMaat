using LOM.API.Controllers.Base;
using LOM.API.DAL;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LOM.API.Controllers
{
    [AllowAnonymous]
    [Route("api/[controller]")]
    [ApiController]
    public class StatusController : LOMBaseController
    {
        public StatusController(LOMContext context) : base(context) { }

        /// <summary>
        /// Haal de login status op van de huidige gebruiker
        /// </summary>
        /// <returns>Ok met True of False</returns>
        [HttpGet]
        public IActionResult GetLoginStatus()
        {
            return Ok(new { IsAuthenticated = User.Identity?.IsAuthenticated == true });
        }

    }
}