using LOM.API.Controllers;
using LOM.API.DAL;
using LOM.API.Models;
using LOM.API.Tests.TestHelpers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Session;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace LOM.API.Tests.Controllers
{
    public class UserControllerTests
    {
        private readonly LOMContext _context;
        private readonly int _currentYear;

        public UserControllerTests()
        {
            var options = new DbContextOptionsBuilder<LOMContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            _context = new LOMContext(options);
            _currentYear = DateTime.Now.Year + 1;
        }

        private void SetSession(UserController controller, int? userId)
        {
            var httpContext = new DefaultHttpContext();
            var session = new MockHttpSession();

            if (userId.HasValue)
            {
                session.SetInt32("UserId", userId.Value);
            }

            httpContext.Features.Set<ISessionFeature>(new SessionFeature { Session = session });
            httpContext.Session = session;

            controller.ControllerContext = new ControllerContext
            {
                HttpContext = httpContext
            };
        }

        [Fact]
        public async Task GetStartYear_ReturnsStartYear_When_SessionUserMatches()
        {
            // Arrange
            var user = new User
            {
                ExternalID = "ext1",
                FirstName = "Test",
                LastName = "User",
                StartYear = 2022,
                RoleId = 2
            };
            _context.User.Add(user);
            await _context.SaveChangesAsync();

            var controller = new UserController(_context);
            SetSession(controller, user.Id);

            // Act
            var result = await controller.GetStartYear(user.Id);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Equal(2022, okResult.Value);
        }

        [Fact]
        public async Task SetStartYear_ReturnsOk_When_ValidStartYear()
        {
            // Arrange
            var currentYear = DateTime.Now.Year + 1;
            var validYears = Enumerable.Range(currentYear - 3, 4);
            var validYear = validYears.First();

            var user = new User
            {
                ExternalID = "ext1",
                FirstName = "Test",
                LastName = "User",
                RoleId = 2
            };
            _context.User.Add(user);
            await _context.SaveChangesAsync();

            var controller = new UserController(_context);
            SetSession(controller, user.Id);

            // Act
            var result = await controller.SetStartYear(user.Id, validYear);

            // Assert
            Assert.IsType<OkResult>(result);
            var savedUser = await _context.User.FindAsync(user.Id);
            Assert.Equal(validYear, savedUser?.StartYear);
        }


        [Fact]
        public async Task SetStartYear_ReturnsBadRequest_When_YearInvalid()
        {
            // Arrange
            var user = new User
            {
                ExternalID = "ext1",
                FirstName = "Test",
                LastName = "User",
                RoleId = 2
            };
            _context.User.Add(user);
            await _context.SaveChangesAsync();

            var controller = new UserController(_context);
            SetSession(controller, user.Id);

            // Act
            var result = await controller.SetStartYear(user.Id, 2020);

            // Assert
            Assert.IsType<BadRequestResult>(result);
        }

        [Fact]
        public async Task SetStartYear_ReturnsUnauthorized_When_SessionIsNull()
        {
            // Arrange
            var user = new User
            {
                ExternalID = "ext1",
                FirstName = "Test",
                LastName = "User",
                RoleId = 2
            };
            _context.User.Add(user);
            await _context.SaveChangesAsync();

            var controller = new UserController(_context);
            SetSession(controller, null);

            // Act
            var result = await controller.SetStartYear(user.Id, _currentYear - 1);

            // Assert
            Assert.IsType<UnauthorizedResult>(result);
        }

        [Fact]
        public async Task SetStartYear_ReturnsForbid_When_SessionUserDoesNotMatch()
        {
            // Arrange
            var user = new User
            {
                ExternalID = "ext1",
                FirstName = "Test",
                LastName = "User",
                RoleId = 2
            };
            _context.User.Add(user);
            await _context.SaveChangesAsync();

            var controller = new UserController(_context);
            SetSession(controller, user.Id + 1);

            // Act
            var result = await controller.SetStartYear(user.Id, _currentYear - 1);

            // Assert
            Assert.IsType<ForbidResult>(result);
        }
    }
}
