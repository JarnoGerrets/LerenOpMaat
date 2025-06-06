namespace LOM.API.Middleware;

public class SecurityHeadersMiddleware
{
	private readonly RequestDelegate _next;

	public SecurityHeadersMiddleware(RequestDelegate next)
	{
		_next = next;
	}

	public async Task InvokeAsync(HttpContext context)
	{
		context.Response.Headers["X-Frame-Options"] = "DENY";
		context.Response.Headers["Referrer-Policy"] = "strict-origin-when-cross-origin";
		context.Response.Headers["Content-Security-Policy"] =
			"default-src 'self'; script-src 'self'; style-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'self'";

		await _next(context);
	}
}
