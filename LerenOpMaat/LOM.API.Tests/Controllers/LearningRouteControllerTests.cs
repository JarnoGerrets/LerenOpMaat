using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Xunit;
using LOM.API.Controllers;
using LOM.API.DAL;
using LOM.API.Models;
using Microsoft.AspNetCore.Http;

namespace LOM.API.Tests.Controllers
{
    public class LearningRouteControllerTests
    {
        private LOMContext GetInMemoryContext()
        {
            var options = new DbContextOptionsBuilder<LOMContext>()
                .UseInMemoryDatabase(databaseName: "LearningRouteTestDb")
                .Options;
            return new LOMContext(options);
        }

        [Fact]
        public async Task GetLearningRouteByUserId_ReturnsLearningRoute_WhenExists()
        {
            // Arrange
            var context = GetInMemoryContext();
            var user = new User { Id = 1, FirstName = "Jan", LastName = "Jansen", ExternalID = "ext1" };
            var route = new LearningRoute { Id = 10, UserId = 1, User = user };
            context.User.Add(user);
            context.LearningRoutes.Add(route);
            await context.SaveChangesAsync();

            var controller = new LearningRouteController(context, null);

            // Mock Claims
            var claims = new List<Claim> { new Claim(ClaimTypes.NameIdentifier, user.ExternalID) };
            var identity = new ClaimsIdentity(claims, "TestAuthType");
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext
                {
                    User = new ClaimsPrincipal(identity)
                }
            };

            // Act
            var result = await controller.GetLearningRouteByUserId();

            // Assert
            var okResult = Assert.IsType<ActionResult<LearningRoute>>(result);
            var learningRoute = Assert.IsType<LearningRoute>(okResult.Value);
            Assert.Equal(1, learningRoute.UserId);
            Assert.NotNull(learningRoute.User);
            Assert.Equal("Jan", learningRoute.User.FirstName);
        }
        [Fact]
        public async Task GetLearningRouteByUserId_ReturnsNewLearningRoute_WhenNotExists()
        {
            // Arrange
            var context = GetInMemoryContext();
            var user = new User { Id = 2, FirstName = "Piet", LastName = "Pietersen", ExternalID = "ext2" };
            context.User.Add(user);
            await context.SaveChangesAsync();

            var controller = new LearningRouteController(context, null);

            // Mock Claims
            var claims = new List<Claim> { new Claim(ClaimTypes.NameIdentifier, user.ExternalID) };
            var identity = new ClaimsIdentity(claims, "TestAuthType");
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext
                {
                    User = new ClaimsPrincipal(identity)
                }
            };

            // Act
            var result = await controller.GetLearningRouteByUserId();

            // Assert
            var okResult = Assert.IsType<ActionResult<LearningRoute>>(result);
            var learningRoute = Assert.IsType<LearningRoute>(okResult.Value);
            Assert.Equal(2, learningRoute.UserId);
            Assert.NotNull(learningRoute.User);
            Assert.Equal("Piet", learningRoute.User.FirstName);
        }
    }
}