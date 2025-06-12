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

            if (!string.IsNullOrEmpty(returnUrl) && returnUrl.StartsWith("http://"))
            {
                returnUrl = "https://" + returnUrl.Substring("http://".Length);
            }

#if DEBUG
            // 1. Gebruik de opgegeven returnUrl of de Referer-header als fallback
            if (string.IsNullOrEmpty(returnUrl))
            {
                returnUrl = Request.Headers["Referer"].ToString();
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
        public IActionResult Logout()
        {
            HttpContext.Session.Clear();

            return SignOut(new AuthenticationProperties
            {
                RedirectUri = "/signout-callback-oidc"
            },
            OpenIdConnectDefaults.AuthenticationScheme,
            "Cookies");
        }


    }
}