using LOM.API.Middleware;
using Microsoft.AspNetCore.Http;

namespace LOM.API.Tests.Middleware;

public class ExceptionHandlingMiddlewareTests
{
	[Fact]
	public async Task Middleware_Returns500_WhenExceptionIsThrown()
	{
		// Arrange
		var context = new DefaultHttpContext();
		var middleware = new ExceptionHandlingMiddleware(next: (ctx) => throw new Exception("Something went wrong"));
		var responseBody = new MemoryStream();
		context.Response.Body = responseBody;

		// Act
		await middleware.Invoke(context);

		// Assert
		Assert.Equal(500, context.Response.StatusCode);
		Assert.Equal("application/json; charset=utf-8", context.Response.ContentType);

		responseBody.Seek(0, SeekOrigin.Begin);
		var reader = new StreamReader(responseBody);
		var responseText = await reader.ReadToEndAsync();

		Assert.Contains("Er is een fout opgetreden", responseText);
	}

	[Fact]
	public async Task Middleware_CallsNext_WhenNoException()
	{
		// Arrange
		var context = new DefaultHttpContext();
		var nextCalled = false;
		var middleware = new ExceptionHandlingMiddleware(next: (ctx) =>
		{
			nextCalled = true;
			return Task.CompletedTask;
		});

		// Act
		await middleware.Invoke(context);

		// Assert
		Assert.True(nextCalled);
		Assert.Equal(200, context.Response.StatusCode);
	}
}
