using LOM.API.Middleware;
using Microsoft.AspNetCore.Http;

namespace LOM.API.Test.Middleware
{
	public class HttpMethodRestrictionMiddlewareTests
	{
		[Theory]
		[InlineData("PATCH")]
		[InlineData("TRACE")]
		public async Task Middleware_Blocks_Disallowed_Methods(string method)
		{
			// Arrange
			var context = new DefaultHttpContext();
			context.Request.Method = method;
			context.Request.Path = "/api/test";

			var middleware = new HttpMethodRestrictionMiddleware((ctx) =>
			{
				Assert.Fail("Next middleware should not be called.");
				return Task.CompletedTask;
			});

			// Act
			await middleware.InvokeAsync(context);

			// Assert
			Assert.Equal(StatusCodes.Status405MethodNotAllowed, context.Response.StatusCode);
		}

		[Theory]
		[InlineData("GET")]
		[InlineData("POST")]
		[InlineData("PUT")]
		[InlineData("DELETE")]
		public async Task Middleware_Allows_Allowed_Methods(string method)
		{
			// Arrange
			var context = new DefaultHttpContext();
			context.Request.Method = method;

			var wasNextCalled = false;
			var middleware = new HttpMethodRestrictionMiddleware((ctx) =>
			{
				wasNextCalled = true;
				return Task.CompletedTask;
			});

			// Act
			await middleware.InvokeAsync(context);

			// Assert
			Assert.True(wasNextCalled);
		}
	}
}
