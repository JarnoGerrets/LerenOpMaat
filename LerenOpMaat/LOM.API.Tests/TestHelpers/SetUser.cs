using LOM.API.Controllers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LOM.API.TestHelpers
{
    public static class TestUserHelper
    {
        public static void SetUser(UserController controller, string? externalId)
        {
            var httpContext = new DefaultHttpContext();

            if (externalId != null)
            {
                httpContext.User = new ClaimsPrincipal(new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, externalId)
                }, "Test"));
            }
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = httpContext
            };
        }
    }
}
