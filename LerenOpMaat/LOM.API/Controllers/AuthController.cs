using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.RateLimiting;

namespace LOM.API.Controllers
{
    [Route("authenticate")]
    public class AuthController : Controller
    {
        /// <summary>
        /// Authenticate endpoint
        /// </summary>
        /// <param name="returnUrl"></param>
        /// <returns></returns>
        [HttpGet]
        [EnableRateLimiting("LoginLimiter")]
        public IActionResult Authenticate(string? returnUrl = null)
        {
            // 1. Gebruik de opgegeven returnUrl of de Referer-header als fallback
            if (string.IsNullOrEmpty(returnUrl))
            {
                returnUrl = Request.Headers["Referer"].ToString();
            }

#if DEBUG
#else
    if (!string.IsNullOrEmpty(returnUrl) && returnUrl.StartsWith("http://"))
    {
        returnUrl = "https://" + returnUrl.Substring("http://".Length);
    }
#endif
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

        /// <summary>
        /// Logout endpoint, destroy sessie
        /// </summary>
        [HttpGet("logout")]
        public async Task Logout()
        {
            HttpContext.Session.Clear();
            await HttpContext.SignOutAsync("Cookies");

            //Important, this method should never return anything.
        }
    }
}