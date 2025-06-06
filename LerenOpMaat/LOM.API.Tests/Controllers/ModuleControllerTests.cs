using LOM.API.Controllers;
using LOM.API.DAL;
using LOM.API.DTO;
using LOM.API.Models;
using LOM.API.TestHelpers;
using LOM.API.Tests.TestHelpers;
using Microsoft.AspNetCore.Mvc;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using System.Diagnostics;
using Microsoft.EntityFrameworkCore;

namespace LOM.API.Tests.Controllers
{
	public class ModuleControllerTests
	{
		private readonly LOMContext _memoryContext;
		private readonly ModuleController _controller;

		public ModuleControllerTests()
		{
			_memoryContext = DbContextHelper.GetInMemoryContext();
			_controller = new ModuleController(_memoryContext);
		}

		[Fact]
		public async Task PutModule_ReturnsConflict_WhenModuleCodeExists()
		{
			// Arrange  
			_memoryContext.Modules.AddRange(
				new Module { Id = 1, Code = "AA.01", Name = "Name1", Evls = [] },
				new Module { Id = 2, Code = "AA.02", Name = "Name2", Evls = [] }
			);
			await _memoryContext.SaveChangesAsync();

			var dto = new ModuleDto
			{
				Id = 1,
				Code = "AA.02" // This code already exists  
			};

			// Act  
			var result = await _controller.PutModule(dto);

			// Assert  
			Assert.IsType<ConflictObjectResult>(result);
		}

		[Fact]
		public async Task PostModule_ReturnsConflict_WhenModuleCodeExists()
		{
			// Arrange  
			_memoryContext.Modules.AddRange(
				new Module { Id = 1, Code = "AA.01", Name = "Name1", Evls = [] },
				new Module { Id = 2, Code = "AA.02", Name = "Name2", Evls = [] }
			);
			await _memoryContext.SaveChangesAsync();

			var dto = new ModuleCreateDto
			{
				Code = "AA.01", // Code already exists
				Name = "Test Module",
				Description = "Description",
				Ec = 30,
				Level = 2,
				Period = 1,
				IsActive = true,
				GraduateProfileId = 1
			};

			// Act
			var result = await _controller.PostModule(dto);

			// Assert
			Assert.IsType<ConflictObjectResult>(result.Result);
		}

        [Fact]
        public async Task GetModules_ReturnsAllModules_WhenUserIsAuthenticated()
        {
            // Arrange
            await ArrangeGraduateProfileAsync();
            await ArrangeAuthenticatedUserAsync();

            _memoryContext.Modules.AddRange(
                new Module
                {
                    Id = 1,
                    Code = "AA.01",
                    Name = "Name1",
                    Evls = [],
                    Requirements = [],
                    GraduateProfileId = 1,
                    IsActive = true
                },
                new Module
                {
                    Id = 2,
                    Code = "AA.02",
                    Name = "Name2",
                    Evls = [],
                    Requirements = [],
                    GraduateProfileId = 1,
                    IsActive = false
                }
            );
            await _memoryContext.SaveChangesAsync();

            // Act
            var result = await _controller.GetModules(null);

            // Assert
            var okResult = Assert.IsType<ActionResult<IEnumerable<ModuleDto>>>(result);
            var modules = Assert.IsAssignableFrom<IEnumerable<ModuleDto>>(okResult.Value);
            Assert.Equal(2, modules.Count());
        }


        [Fact]
        public async Task GetModules_ReturnsOnlyActiveModules_WhenUserIsNotAuthenticated()
        {
                // Arrange
                await ArrangeGraduateProfileAsync();
                ArrangeUnauthenticatedUser();

                _memoryContext.Modules.AddRange(
                    new Module
                    {
                        Id = 1,
                        Code = "AA.01",
                        Name = "Name1",
                        Evls = [],
                        Requirements = [],
                        GraduateProfileId = 1,
                        IsActive = true
                    },
                    new Module
                    {
                        Id = 2,
                        Code = "AA.02",
                        Name = "Name2",
                        Evls = [],
                        Requirements = [],
                        GraduateProfileId = 1,
                        IsActive = false
                    }
                );
                await _memoryContext.SaveChangesAsync();

            // Act
            var result = await _controller.GetModules(null);

            // Assert
            var okResult = Assert.IsType<ActionResult<IEnumerable<ModuleDto>>>(result);
            var modules = Assert.IsAssignableFrom<IEnumerable<ModuleDto>>(okResult.Value);
            Assert.Equal(1, modules.Count());
        }

        [Fact]
        public async Task GetModules_ReturnsFilteredModules_WhenSearchQueryProvided()
        {
            // Arrange
            await ArrangeGraduateProfileAsync();
            await ArrangeAuthenticatedUserAsync();

            _memoryContext.Modules.AddRange(
                new Module
                {
                    Id = 1,
                    Code = "AA.01",
                    Name = "Name1",
                    Evls = [],
                    Requirements = [],
                    GraduateProfileId = 1,
                    IsActive = true
                },
                new Module
                {
                    Id = 2,
                    Code = "AA.02",
                    Name = "Name2",
                    Evls = [],
                    Requirements = [],
                    GraduateProfileId = 1,
                    IsActive = false
                }
            );
            await _memoryContext.SaveChangesAsync();

            // Act
            var result = await _controller.GetModules("AA.02");

            // Assert
            var okResult = Assert.IsType<ActionResult<IEnumerable<ModuleDto>>>(result);
            var modules = Assert.IsAssignableFrom<IEnumerable<ModuleDto>>(okResult.Value);
            Assert.Single(modules);
            Assert.Equal("Name2", modules.First().Name);
        }


        private async Task ArrangeGraduateProfileAsync()
        {
            _memoryContext.GraduateProfiles.Add(
                new GraduateProfile { Id = 1, Name = "test", ColorCode = "#fff" }
            );

        }

        private async Task ArrangeAuthenticatedUserAsync()
        {
            var user = new User
            {
                ExternalID = "ext1",
                FirstName = "Test",
                LastName = "User",
                RoleId = 2
            };

            _memoryContext.User.Add(user);
            await _memoryContext.SaveChangesAsync();

            TestUserHelper.SetUser(_controller, user.ExternalID);
        }

        private void ArrangeUnauthenticatedUser()
        {
            TestUserHelper.SetUser(_controller, null); // Clear any authenticated user
        }


    }
}