using LOM.API.Controllers;
using LOM.API.DAL;
using LOM.API.DTO;
using LOM.API.Models;
using LOM.API.Tests.TestHelpers;
using Microsoft.AspNetCore.Mvc;

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
	}
}