using LOM.API.Controllers.Base;
using LOM.API.DAL;
using LOM.API.DTO;
using LOM.API.Enums;
using LOM.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;

namespace LOM.API.Controllers
{
	[Route("api/[controller]")]
	[Authorize]
	[ApiController]
	public class RequirementController : LOMBaseController
	{

		public RequirementController(LOMContext context) : base(context) {}

		/// <summary>
		/// Haal een requirement op aan de hand van een id
		/// </summary>
		/// <param name="id">requirement id om op te halen</param>
		/// <returns>NotFound als er geen requirement gevonden is</returns>
		/// <returns>Ok met requirement model</returns>
		[AllowAnonymous]
		[HttpGet("{id}")]
		[EnableRateLimiting("GetLimiter")]
		public async Task<ActionResult<Requirement>> GetRequirement(int id)
		{
			var requirement = await _context.Requirements.FindAsync(id);
			if (requirement == null)
			{
				return NotFound();
			}
			return Ok(requirement);
		}

		/// <summary>
		/// Haal requirement types op
		/// Vereiste rol: Lecturer of Administrator
		/// </summary>
		/// <returns>Ok met ModuleRequirementTypeDto model</returns>
		[Authorize(Roles = "Lecturer, Administrator")]
		[HttpGet("types")]
		[EnableRateLimiting("GetLimiter")]
		public ActionResult<IEnumerable<ModuleRequirementTypeDto>> GetRequirementTypes()
		{
			var types = Enum.GetValues(typeof(ModulePreconditionType))
				.Cast<ModulePreconditionType>()
				.Select(ModuleRequirementTypeDto.FromEnum)
				.ToList();

			return Ok(types);
		}

		/// <summary>
		/// Haal requirement types op
		/// Vereiste rol: Lecturer of Administrator
		/// </summary>
		/// <see cref="go.microsoft.com/fwlink/?linkid=2123754"/>
		/// <returns>Ok met ModuleRequirementTypeDto model</returns>
		[Authorize(Roles = "Lecturer, Administrator")]
		[HttpPost]
		[ValidateAntiForgeryToken]
		[EnableRateLimiting("PostLimiter")]
		public async Task<ActionResult> PostRequirement(Requirement? requirement)
		{
			if (requirement == null)
			{
				return BadRequest();
			}

			_context.Requirements.Add(requirement);
			await _context.SaveChangesAsync();

			return CreatedAtAction("GetRequirement", new { id = requirement.Id }, requirement);
		}

		/// <summary>
		/// Update een bestaande requirement
		/// Vereiste rol: Lecturer of Administrator
		/// </summary>
		/// <param name="id">ID van de requirement</param>
		/// <param name="requirement">Requirement model met geupdate properties</param>
		/// <returns>BadRequest als het id niet overeen komt met requirement model</returns>
		/// <returns>NoContent als de requirment successvol is opgeslagen</returns>
		[Authorize(Roles = "Lecturer, Administrator")]
		[HttpPut("{id}")]
		[ValidateAntiForgeryToken]
		[EnableRateLimiting("PostLimiter")]
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

		/// <summary>
		/// Verwijder een requirement
		/// Vereiste rol: Lecturer of Administrator
		/// </summary>
		/// <param name="id">ID van de requirement</param>
		/// <returns>NotFound als er geen requirement gevonden is</returns>
		/// <returns>NoContent als de requirment successvol is verwijderd</returns>
		[Authorize(Roles = "Lecturer, Administrator")]
		[HttpDelete("{id}")]
		[ValidateAntiForgeryToken]
		[EnableRateLimiting("DeleteLimiter")]
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
