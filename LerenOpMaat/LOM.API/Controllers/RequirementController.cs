using LOM.API.DAL;
using LOM.API.DTO;
using LOM.API.Enums;
using LOM.API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LOM.API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class RequirementController : Controller
	{
		private readonly LOMContext _context;

		public RequirementController(LOMContext context)
		{
			_context = context;
		}

		[HttpGet("{id}")]
		public async Task<ActionResult<Requirement>> GetRequirement(int id)
		{
			var requirement = await _context.Requirements.FindAsync(id);
			if (requirement == null)
			{
				return NotFound();
			}
			return requirement;
		}

		[HttpGet("types")]
		public ActionResult<IEnumerable<ModuleRequirementTypeDto>> GetRequirementTypes()
		{
			var types = Enum.GetValues(typeof(ModulePreconditionType))
				.Cast<ModulePreconditionType>()
				.Select(ModuleRequirementTypeDto.FromEnum)
				.ToList();

			return Ok(types);
		}

		[HttpPost]
        public async Task<ActionResult> PostRequirement(Requirement requirement)
        {
			if (requirement == null)
			{
				return BadRequest();
			}

			_context.Requirements.Add(requirement);
			await _context.SaveChangesAsync();

			return CreatedAtAction("GetRequirement", new { id = requirement.Id }, requirement);
		}

		[HttpPut("{id}")]
		public async Task<IActionResult> PutRequirement(int id, Requirement requirement)
		{
			if (id != requirement.Id)
			{
				return BadRequest();
			}

			_context.Entry(requirement).State = EntityState.Modified;

			await _context.SaveChangesAsync();

			return NoContent();
		}

		[HttpDelete("{id}")]
		public async Task<IActionResult> DeleteRequirement(int id)
		{
			var requirement = await _context.Requirements.FindAsync(id);
			if (requirement == null)
			{
				return NotFound();
			}
			_context.Requirements.Remove(requirement);
			await _context.SaveChangesAsync();
			return NoContent();
		}
	}
}
