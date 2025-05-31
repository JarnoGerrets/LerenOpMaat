using System.Net;

namespace LOM.API.Middleware;

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
			// TODO Log to sentry from here.

			context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
			context.Response.ContentType = "application/json";

			var response = new { error = "Er is een fout opgetreden. Probeer het later opnieuw." };
			await context.Response.WriteAsJsonAsync(response);
		}
	}
}
