using Microsoft.AspNetCore.Antiforgery;

namespace LOM.API.Middleware;

public class InjectCsrfCookie
{
    private readonly RequestDelegate _next;
    private readonly IAntiforgery _antiforgery;

    public InjectCsrfCookie(RequestDelegate next, IAntiforgery antiforgery)
    {
        _next = next;
        _antiforgery = antiforgery;
    }

    public async Task Invoke(HttpContext context)
    {
        if (context.Request.Path.StartsWithSegments("/api/csrf-token"))
        {
            var tokens = _antiforgery.GetAndStoreTokens(context);
            context.Response.Cookies.Append("XSRF-TOKEN", tokens.RequestToken, new CookieOptions
            {
                HttpOnly = false,
                Secure = true,
                SameSite = SameSiteMode.Strict
            });
        }

        await _next(context);
    }
}