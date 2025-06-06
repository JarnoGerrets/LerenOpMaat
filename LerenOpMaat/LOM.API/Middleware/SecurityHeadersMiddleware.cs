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
		// This header prevents the page from being displayed in a frame, which helps to prevent clickjacking attacks.
		context.Response.Headers.XFrameOptions = "DENY";

		// This header controls the referrer information sent with requests.
		context.Response.Headers["Referrer-Policy"] = "strict-origin-when-cross-origin";

		// This header defines a Content Security Policy (CSP) to prevent XSS attacks and other code injection attacks.
		context.Response.Headers.ContentSecurityPolicy =
			"default-src 'self'; script-src 'self'; style-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'self'";

		await _next(context);
	}
}
