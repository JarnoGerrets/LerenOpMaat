namespace LOM.API.Middleware;

public class HttpMethodRestrictionMiddleware
{
	private readonly RequestDelegate _next;
	private static readonly HashSet<string> AllowedMethods = new() { "GET", "POST", "PUT", "DELETE", "OPTIONS" };

	public HttpMethodRestrictionMiddleware(RequestDelegate next)
	{
		_next = next;
	}

	public async Task InvokeAsync(HttpContext context)
	{
		var method = context.Request.Method.ToUpperInvariant();

		if (!AllowedMethods.Contains(method))
		{
			SentrySdk.CaptureMessage(
				$"Blocked HTTP method: {method} on {context.Request.Path}",
				SentryLevel.Warning
			);

			context.Response.StatusCode = StatusCodes.Status405MethodNotAllowed;
			await context.Response.WriteAsync("HTTP-methode niet toegestaan.");
			return;
		}

		await _next(context);
	}
}
