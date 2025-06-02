using LOM.API.Controllers;
using LOM.API.DAL;
using LOM.API.DTO;
using LOM.API.Models;
using LOM.API.Tests.TestHelpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using System.Net.Sockets;

namespace LOM.API.Tests.Controllers
{
	public class ModuleControllerTests
	{

		private readonly Mock<LOMContext> _mockContext;
		private readonly ModuleController _controller;

		public ModuleControllerTests()
		{
			_mockContext = new Mock<LOMContext>();
			_controller = new ModuleController(_mockContext.Object);
		}

		//[Fact]
		//public async Task PutModule_ReturnsBadRequest_WhenIdMismatch()
		//{
		//	// Arrange
		//	var dto = new ModuleDto { Id = 2 };

		//	// Act
		//	var result = await _controller.PutModule(1, dto);

		//	// Assert
		//	Assert.IsType<BadRequestResult>(result);
		//}

		//[Fact]
		//public async Task PutModule_ReturnsConflict_WhenModuleCodeExists()
		//{
		//	// Arrange
		//	var existingModuleData = new List<Module>
		//	{
		//		new() { Id = 1, Code = "AA.01" },
		//		new() { Id = 2, Code = "AA.02" }
		//	}.AsQueryable();

		//	var mockSet = DbContextHelper.CreateMockDbSet(existingModuleData);
		//	_mockContext.Setup(c => c.Modules).Returns(mockSet.Object);
		//	_mockContext.Setup(c => c.Modules.FindAsync(1))
		//		.ReturnsAsync(existingModuleData.First());

		//	var dto = new ModuleDto
		//	{
		//		Id = 1,
		//		Code = "AA.02" // This code already exists
		//	};

		//	// Act
		//	var result = await _controller.PutModule(1, dto);

		//	// Assert
		//	var conflictResult = Assert.IsType<ConflictObjectResult>(result);
		//}

		[Fact]
		public async Task PostModule_ReturnsConflict_WhenModuleCodeExists()
		{
			// Arrange
			var existingModuleData = new List<Module>
			{
				new() { Id = 1, Code = "AA.01" },
				new() { Id = 2, Code = "AA.02" }
			}.AsQueryable();

			var mockSet = DbContextHelper.CreateMockDbSet(existingModuleData);
			_mockContext.Setup(c => c.Modules).Returns(mockSet.Object);

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
			var conflictResult = Assert.IsType<ConflictObjectResult>(result.Result);
		}
	}
}