using LOM.API.Controllers;
using LOM.API.DAL;
using LOM.API.DTO;
using LOM.API.Enums;
using LOM.API.Models;
using LOM.API.Tests.TestHelpers;
using Microsoft.AspNetCore.Mvc;

namespace LOM.API.Tests.Controllers;

public class RequirementControllerTests : IDisposable
{
	private readonly LOMContext _memoryContext;
	private readonly RequirementController _requirementController;

	public RequirementControllerTests()
	{
		_memoryContext = DbContextHelper.GetInMemoryContext();
		_requirementController = new RequirementController(_memoryContext);
	}

	[Fact]
	public async Task GetRequirement_ReturnsRequirement_WhenExists()
	{
		// Arrange
		var requirement = new Requirement
		{
			Id = 1,
			Value = "1",
			Type = ModulePreconditionType.RequiredModule
		};

		_memoryContext.Requirements.Add(requirement);
		await _memoryContext.SaveChangesAsync();

		// Act
		var result = await _requirementController.GetRequirement(1);

		// Assert
		Assert.NotNull(result);
		Assert.IsType<ActionResult<Requirement>>(result);
	}

	[Fact]
	public async Task GetRequirement_ReturnsNotFound_WhenNotExists()
	{
		// Arrange
		var nonExistentId = 999;
		var requirement = new Requirement
		{
			Id = 1,
			Value = "1",
			Type = ModulePreconditionType.RequiredModule
		};

		_memoryContext.Requirements.Add(requirement);
		await _memoryContext.SaveChangesAsync();

		// Act
		var result = await _requirementController.GetRequirement(nonExistentId);

		// Assert
		Assert.IsType<NotFoundResult>(result.Result);
	}

	[Fact]
	public void GetRequirementTypes_ReturnsAllTypes()
	{
		// Act  
		var result = _requirementController.GetRequirementTypes();

		// Assert  
		Assert.NotNull(result);
		Assert.IsType<ActionResult<IEnumerable<ModuleRequirementTypeDto>>>(result);

		// Check if all enum values are returned  
		var types = (result.Result as OkObjectResult)?.Value as IEnumerable<ModuleRequirementTypeDto>;
		Assert.NotNull(types);
		var expectedTypes = Enum.GetValues(typeof(ModulePreconditionType))
			.Cast<ModulePreconditionType>()
			.Select(ModuleRequirementTypeDto.FromEnum)
			.ToList();

		Assert.Equal(expectedTypes.Count, types.Count());
	}

	[Fact]
	public async Task PostRequirement_ReturnsBadRequest_WhenRequirementIsNull()
	{
		// Arrange
		Requirement? requirement = null;

		// Act
		var result = await _requirementController.PostRequirement(requirement);

		// Assert
		Assert.IsType<BadRequestResult>(result);
	}

	[Fact]
	public async Task PostRequirement_ReturnsCreatedAtAction_WhenRequirementIsValid()
	{
		// Arrange
		var requirement = new Requirement
		{
			Value = "1",
			Type = ModulePreconditionType.RequiredModule
		};

		// Act
		var result = await _requirementController.PostRequirement(requirement);
		
		// Assert
		var createdResult = Assert.IsType<CreatedAtActionResult>(result);
		Assert.Equal("GetRequirement", createdResult.ActionName);
		Assert.Equal(requirement, createdResult.Value);
	}

	[Fact]
	public async Task PutRequirement_ReturnsBadRequest_WhenIdsDoNotMatch()
	{
		// Arrange
		var requirement = new Requirement
		{
			Id = 1,
			Value = "1",
			Type = ModulePreconditionType.RequiredModule
		};

		// Act
		var result = await _requirementController.PutRequirement(2, requirement);

		// Assert
		Assert.IsType<BadRequestResult>(result);
	}

	[Fact]
	public async Task PutRequirement_ReturnsNoContent_WhenRequirementUpdated()
	{
		// Arrange
		var requirement = new Requirement
		{
			Id = 1,
			Value = "1",
			Type = ModulePreconditionType.RequiredModule
		};
		_memoryContext.Requirements.Add(requirement);
		await _memoryContext.SaveChangesAsync();
		
		requirement.Value = "Updated Value";

		// Act
		var result = await _requirementController.PutRequirement(1, requirement);

		// Assert
		Assert.IsType<NoContentResult>(result);
	}

	[Fact]
	public async Task DeleteRequirement_ReturnsNotFound_WhenRequirementDoesNotExist()
	{
		// Arrange
		var nonExistentId = 999;
		var requirement = new Requirement
		{
			Id = 1,
			Value = "1",
			Type = ModulePreconditionType.RequiredModule
		};
		_memoryContext.Requirements.Add(requirement);
		await _memoryContext.SaveChangesAsync();
		
		// Act
		var result = await _requirementController.DeleteRequirement(nonExistentId);

		// Assert
		Assert.IsType<NotFoundResult>(result);
	}

	[Fact]
	public async Task DeleteRequirement_ReturnsNoContent_WhenRequirementDeleted()
	{
		// Arrange
		var requirement = new Requirement
		{
			Id = 1,
			Value = "1",
			Type = ModulePreconditionType.RequiredModule
		};
		_memoryContext.Requirements.Add(requirement);
		await _memoryContext.SaveChangesAsync();

		// Act
		var result = await _requirementController.DeleteRequirement(1);

		// Assert
		Assert.IsType<NoContentResult>(result);
	}

	public void Dispose()
	{
		_memoryContext.Database.EnsureDeleted();
		_memoryContext.Dispose();
	}
}
