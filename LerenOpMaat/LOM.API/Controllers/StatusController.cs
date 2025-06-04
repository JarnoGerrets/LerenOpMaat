using System.Security.Claims;
using LOM.API.Controllers.Base;
using LOM.API.DAL;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace LOM.API.Controllers
{
    [AllowAnonymous]
    [Route("api/[controller]")]
    [ApiController]
    public class StatusController : LOMBaseController
    {
        public StatusController(LOMContext context) : base(context) { }

        [HttpGet]
        public IActionResult GetLoginStatus()
        {
            return Ok(new { IsAuthenticated = User?.Identity?.IsAuthenticated == true });
        }

    }
}