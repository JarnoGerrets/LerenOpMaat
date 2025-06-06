using LOM.API.Middleware;
using Microsoft.AspNetCore.Http;

namespace LOM.API.Tests.Middleware
{
	public class SecurityHeadersMiddlewareTests
	{
		[Fact]
		public async Task SecurityHeadersMiddleware_AddsExpectedHeaders()
		{
			// Arrange
			var context = new DefaultHttpContext();
			var middleware = new SecurityHeadersMiddleware((innerHttpContext) => Task.CompletedTask);

			// Act
			await middleware.InvokeAsync(context);

			// Assert
			var headers = context.Response.Headers;
			Assert.Equal("DENY", headers.XFrameOptions);
			Assert.Equal("strict-origin-when-cross-origin", headers["Referrer-Policy"]);
			Assert.Equal("default-src 'self'; script-src 'self'; style-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'self'", headers.ContentSecurityPolicy);
		}
	}
}
