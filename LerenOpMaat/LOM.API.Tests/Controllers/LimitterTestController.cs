using System.Net;
using System.Net.Http.Json;
using Xunit;
using Microsoft.AspNetCore.Mvc.Testing;

namespace LOM.API.Tests.Controllers
{
    public class RateLimiterIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly HttpClient _client;

        public RateLimiterIntegrationTests(WebApplicationFactory<Program> factory)
        {
            _client = factory.CreateClient();
        }

        [Fact]
        public async Task PostRequests_Should_Be_Limited_After_50Requests()
        {
            var requestBody = new[]
{
            new {
                Id = 0,
                Year = 2025,
                Period = 1,
                LearningRouteId = 1,
                ModuleId = 1,
                Locked = false
            }
            };
            for (int i = 0; i < 75; i++)
            {
                var response = await _client.PostAsJsonAsync("/api/learningroute/ValidateRoute", requestBody);
                Assert.True(response.IsSuccessStatusCode, $"Request {i + 1} failed unexpectedly.");
            }

            var blockedResponse = await _client.PostAsJsonAsync("/api/learningroute/ValidateRoute", new { semesters = new List<object>() });
            Assert.Equal(HttpStatusCode.ServiceUnavailable , blockedResponse.StatusCode);
        }
    }
}
