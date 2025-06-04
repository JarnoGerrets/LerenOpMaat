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
    [Route("authenticate")]
    public class AuthController : Controller
    {
        [HttpGet]
        [EnableRateLimiting("LoginLimiter")]

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
            HttpContext.Session.Clear();
            await HttpContext.SignOutAsync("Cookies");

            //Important, this method should never return anything.
        }

    }
}
