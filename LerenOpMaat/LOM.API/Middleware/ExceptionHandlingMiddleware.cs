using System.Net;

namespace LOM.API.Middleware;

// This middleware handles exceptions globally so that we can log them and return a consistent error response.
public class ExceptionHandlingMiddleware
{
	private readonly RequestDelegate _next;

	public ExceptionHandlingMiddleware(RequestDelegate next)
	{
		_next = next;
	}

	public async Task Invoke(HttpContext context)
	{
		try
		{
			await _next(context);
		}
		catch (Exception ex)
		{
			SentrySdk.CaptureException(ex, scope =>
			{
				scope.SetTag("endpoint", context.Request.Path);
				scope.SetTag("method", context.Request.Method);
				scope.SetExtra("query_string", context.Request.QueryString.ToString());
				scope.SetExtra("headers", context.Request.Headers.ToDictionary(h => h.Key, h => h.Value.ToString()));
			});

			context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
			context.Response.ContentType = "application/json";

			var response = new { error = "Er is een fout opgetreden. Probeer het later opnieuw." };
			await context.Response.WriteAsJsonAsync(response);
		}
	}
}
