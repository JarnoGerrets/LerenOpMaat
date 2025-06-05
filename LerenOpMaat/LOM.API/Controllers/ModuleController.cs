using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LOM.API.DAL;
using LOM.API.Models;
using LOM.API.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.RateLimiting;
using LOM.API.Controllers.Base;

namespace LOM.API.Controllers
{
	[Route("api/[controller]")]
	[Authorize]
	[ApiController]
	public class ModuleController : LOMBaseController
	{

		public ModuleController(LOMContext context) : base(context) {}

		/// <summary>
		/// Haal alle modules op, eventueel met een zoekterm
		/// </summary>
		/// <param name="q">Zoekterm om te filteren</param>
		/// <returns>Lijst met ModuleDTO models</returns>
		[HttpGet]
		[AllowAnonymous]
		[EnableRateLimiting("GetLimiter")]
		public async Task<ActionResult<IEnumerable<ModuleDto>>> GetModules([FromQuery] string? q)
		{
			IQueryable<Module> query;
			User? user = GetActiveUser();

			if (user != null)
			{
				query = _context.Modules.AsQueryable();
			}
			else
			{
				query = _context.Modules.Where(m => m.IsActive);
			}

			if (!string.IsNullOrWhiteSpace(q))
			{
				string lowerQ = q.ToLower();
				query = query.Where(m =>
					string.IsNullOrWhiteSpace(m.Description)
						? m.Name.ToLower().Contains(lowerQ) || m.Code.ToLower().Contains(lowerQ)
						: m.Name.ToLower().Contains(lowerQ) || m.Code.ToLower().Contains(lowerQ) || m.Description.ToLower().Contains(lowerQ)
				);
			}

			var modules = await query
				.Include(m => m.Requirements)
				.Include(m => m.GraduateProfile)
				.Include(m => m.Evls)
				.ToListAsync();

			var result = new List<ModuleDto>();
			foreach (var module in modules)
			{
				result.Add(await ModuleDto.FromModelAsync(module, _context));
			}

			return result;
		}

		/// <summary>
		/// Haal alle modules actieve op, eventueel met een zoekterm
		/// </summary>
		/// <param name="q">Zoekterm om te filteren</param>
		/// <returns>Lijst met ModuleDTO models</returns>
		[HttpGet("Active")]
		[EnableRateLimiting("GetLimiter")]
		[AllowAnonymous]
		public async Task<ActionResult<IEnumerable<ModuleDto>>> GetActiveModules([FromQuery] string? q)
		{

			var query = _context.Modules.Where(m => m.IsActive);

			if (!string.IsNullOrWhiteSpace(q))
			{
				string lowerQ = q.ToLower();
				query = query.Where(m =>
					string.IsNullOrWhiteSpace(m.Description)
						? m.Name.ToLower().Contains(lowerQ) || m.Code.ToLower().Contains(lowerQ)
						: m.Name.ToLower().Contains(lowerQ) || m.Code.ToLower().Contains(lowerQ) || m.Description.ToLower().Contains(lowerQ)
				);
			}

			var modules = await query
				.Include(m => m.Requirements)
				.Include(m => m.GraduateProfile)
				.Include(m => m.Evls)
				.ToListAsync();

			var result = new List<ModuleDto>();
			foreach (var module in modules)
			{
				result.Add(await ModuleDto.FromModelAsync(module, _context));
			}

			return result;
		}

		/// <summary>
		/// Haal een specifieke module
		/// </summary>
		/// <param name="id">ID van de module om op te halen</param>
		/// <returns>NotFound als er geen module gevonden is</returns>
		/// <returns>ModelDTO model</returns>
		[HttpGet("{id}")]
		[EnableRateLimiting("GetLimiter")]
		[AllowAnonymous]
		public async Task<ActionResult<ModuleDto>> GetModule(int id)
		{
			var module = await _context.Modules
				.Where(m => m.Id == id)
				.Include(m => m.Requirements)
				.Include(m => m.GraduateProfile)
				.Include(m => m.Evls)
				.FirstOrDefaultAsync();

			if (module == null)
			{
				return NotFound("Geen module gevonden.");
			}

			var result = await ModuleDto.FromModelAsync(module, _context);
			return result;
		}

		/// <summary>
		/// Update een bestaande module
		/// Vereiste rol: Lecturer of Administrator
		/// </summary>
		/// <param name="moduleDto">Module model met geupdate properties</param>
		/// <see cref="go.microsoft.com/fwlink/?linkid=2123754"/>
		/// <returns>NotFound als er geen bestaande module gevonden is</returns>
		/// <returns>Conflict als de module code al bestaat</returns>
		/// <returns>NoContent als de module successvol opgeslagen is</returns>
		[Authorize(Roles = "Lecturer, Administrator")]
		[HttpPut("{id}")]
		[ValidateAntiForgeryToken]
		[EnableRateLimiting("PostLimiter")]
		public async Task<IActionResult> PutModule(ModuleDto moduleDto)
		{
			var existingModule = await _context.Modules
				.Include(m => m.Evls)
				.FirstOrDefaultAsync(m => m.Id == moduleDto.Id);

			if (existingModule == null)
			{
				return NotFound("Geen module gevonden.");
			}

			if (ModuleCodeExists(moduleDto.Id, moduleDto.Code))
			{
				return Conflict(new { message = "Module met deze code bestaat al." });
			}

			existingModule.Name = moduleDto.Name;
			existingModule.Code = moduleDto.Code;
			existingModule.Description = moduleDto.Description;
			existingModule.Level = moduleDto.Level;
			existingModule.Period = moduleDto.Period;
			existingModule.IsActive = moduleDto.IsActive;
			existingModule.GraduateProfileId = moduleDto.GraduateProfile.Id;

			var updatedEcs = 0;
			foreach (var evlDto in moduleDto.Evls)
			{
				var existingEvl = existingModule.Evls.FirstOrDefault(e => e.Id == evlDto.Id);

				if (existingEvl != null)
				{
					existingEvl.Name = evlDto.Name;
					existingEvl.Ec = evlDto.Ec;
					updatedEcs += evlDto.Ec;
				}
				else
				{
					var newEvl = evlDto.ToModel();
					newEvl.ModuleId = existingModule.Id;
					existingModule.Evls.Add(newEvl);
					updatedEcs += evlDto.Ec;
				}
			}
			existingModule.Ec = updatedEcs;
			await _context.SaveChangesAsync();
			return NoContent();
		}

		/// <summary>
		/// Controleren of een module bestaat
		/// Vereiste rol: Lecturer of Administrator
		/// </summary>
		/// <param name="id">Module model id om te controleren</param>
		/// <returns>Ok met True of False</returns>
		[Authorize(Roles = "Lecturer, Administrator")]
		[HttpGet("existence/{id}")]
		[EnableRateLimiting("GetLimiter")]
		public async Task<IActionResult> CheckModuleExistence(int id)
		{
			var exists = await _context.Semesters.AnyAsync(s => s.ModuleId == id);
			return Ok(exists);
		}

		/// <summary>
		/// Nieuwe module opslaan
		/// Vereiste rol: Lecturer of Administrator
		/// </summary>
		/// <param name="dto">ModuleCreateDTO model met properties</param>
		/// <see cref="go.microsoft.com/fwlink/?linkid=2123754"/>
		/// <returns>BadRequest als er geen module data gepost is</returns>
		/// <returns>Conflict als de module code al bestaat</returns>
		/// <returns>BadRequest als de module niet successvol opgeslagen kon worden</returns>
		/// <returns>Created als de module successvol opgeslagen is</returns>
		[Authorize(Roles = "Lecturer, Administrator")]
		[HttpPost]
		[ValidateAntiForgeryToken]
		[EnableRateLimiting("PostLimiter")]
		public async Task<ActionResult<Module>> PostModule(ModuleCreateDto? dto)
		{
			if (dto == null)
			{
				return BadRequest("Dto mag niet leeg zijn");
			}

			if (ModuleCodeExists(dto.Id, dto.Code))
			{
				return Conflict(new { message = "Module met deze code bestaat al." });
			}

			try
			{
				var module = new Module
				{
					Name = dto.Name,
					Code = dto.Code,
					Description = dto.Description,
					Ec = dto.Ec,
					Level = dto.Level,
					Period = dto.Period,
					IsActive = dto.IsActive,
					GraduateProfileId = dto.GraduateProfileId,
					Evls = dto.Evls?.Select(evl => evl.ToModel()).ToList() ?? new List<ModuleEVL>(),
				};

				_context.Modules.Add(module);
				await _context.SaveChangesAsync();

				return CreatedAtAction("GetModule", new { id = @module.Id }, @module);
			}
			catch (DbUpdateException)
			{
				return BadRequest("An error occurred while saving the module. Please try again.");
			}
		}
		
		/// <summary>
		/// Een module inactief maken
		/// Vereiste rol: Lecturer of Administrator
		/// </summary>
		/// <param name="id">ID van de module om inactief te maken</param>
		/// <see cref="go.microsoft.com/fwlink/?linkid=2123754"/>
		/// <returns>NotFound als er geen module gevonden is</returns>
		/// <returns>NoContent als de module successvol op inactief is gezet</returns>
		[Authorize(Roles = "Lecturer, Administrator")]
		[HttpPatch("deactivate/{id}")]
		[ValidateAntiForgeryToken]
		[EnableRateLimiting("PostLimiter")]
		public async Task<IActionResult> DeactivateModule(int id)
		{
			var module = await _context.Modules.FindAsync(id);
			if (module == null)
			{
				return NotFound("Geen module gevonden.");
			}

			module.IsActive = false;
			_context.Modules.Update(module);
			await _context.SaveChangesAsync();

			return NoContent();
		}

		/// <summary>
		/// Een module actief maken
		/// Vereiste rol: Lecturer of Administrator
		/// </summary>
		/// <param name="id">ID van de module om actief te maken</param>
		/// <see cref="go.microsoft.com/fwlink/?linkid=2123754"/>
		/// <returns>NotFound als er geen module gevonden is</returns>
		/// <returns>NoContent als de module successvol op actief is gezet</returns>
		[Authorize(Roles = "Lecturer, Administrator")]
		[HttpPatch("activate/{id}")]
		[ValidateAntiForgeryToken]
		[EnableRateLimiting("PostLimiter")]
		public async Task<IActionResult> ActivateModule(int id)
		{
			var module = await _context.Modules.FindAsync(id);
			if (module == null)
			{
				return NotFound("Geen module gevonden.");
			}

			module.IsActive = true;
			_context.Modules.Update(module);
			await _context.SaveChangesAsync();

			return NoContent();
		}

		/// <summary>
		/// Een module verwijderen
		/// Vereiste rol: Lecturer of Administrator
		/// </summary>
		/// <param name="id">ID van de module om te verwijderen</param>
		/// <see cref="go.microsoft.com/fwlink/?linkid=2123754"/>
		/// <returns>NotFound als er geen module gevonden is</returns>
		/// <returns>BadRequest als de module in gebruik is</returns>
		/// <returns>NoContent als de module successvol verwijderd is</returns>
		[Authorize(Roles = "Lecturer, Administrator")]
		[HttpDelete("{id}")]
		[ValidateAntiForgeryToken]
		[EnableRateLimiting("DeleteLimiter")]
		public async Task<IActionResult> DeleteModule(int id)
		{
			var module = await _context.Modules.FindAsync(id);
			if (module == null)
			{
				return NotFound("Geen module gevonden.");
			}

			var isInUse = await _context.Semesters.AnyAsync(s => s.ModuleId == id);
			if (isInUse)
			{
				return BadRequest("Module wordt gebruikt en kan dus niet worden verwijderd.");
			}

			_context.Modules.Remove(module);
			await _context.SaveChangesAsync();

			return NoContent();
		}

		/// <summary>
		/// Progressie van een module ophalen
		/// </summary>
		/// <param name="id">ID van de module om te verwijderen</param>
		/// <returns>Unauthorized als de gebruiker niet gevonden is</returns>
		/// <returns>NoContent als er geen module progressie gevonden is</returns>
		/// <returns>Ok met module progressie model</returns>
		[HttpGet("{id}/progress")]
		[EnableRateLimiting("GetLimiter")]
		public async Task<ActionResult<ModuleProgressDto>> GetModuleProgress(int id)
		{
			User? user = GetActiveUser();

			if (user == null)
			{
				return Unauthorized("Gebruiker niet ingelogd.");
			}

			var progress = await _context.ModuleProgresses
				.Where(m => m.ModuleId == id && m.UserId == user.Id)
				.Include(m => m.CompletedEVLs)
					.ThenInclude(evl => evl.ModuleEvl)
				.FirstOrDefaultAsync();

			if (progress == null)
			{
				return NoContent();
			}

			var result = ModuleProgressDto.FromModel(progress);
			return Ok(result);
		}

		/// <summary>
		/// Voeg een evl toe aan module van huidige gebruiker
		/// </summary>
		/// <param name="id">ID van de module</param>
		/// <param name="evlId">ID van de evl model om toe te voegen</param>
		/// <returns>Unauthorized als de gebruiker niet gevonden is</returns>
		/// <returns>NoContent als er niks geupdated is</returns>
		/// <returns>Ok met ModuleProgressDto model</returns>
		[HttpPost("{id}/addcompletedevl")]
		[ValidateAntiForgeryToken]
		public async Task<ActionResult<ModuleProgressDto>> AddCompletedEvl(int id, [FromBody] int evlId)
		{
			User? user = GetActiveUser();

			if (user == null)
			{
				return Unauthorized("Gebruiker niet ingelogd.");
			}

			var progress = await _context.ModuleProgresses
				.Include(m => m.CompletedEVLs)
					.ThenInclude(c => c.ModuleEvl)
				.FirstOrDefaultAsync(m => m.ModuleId == id && m.UserId == user.Id);

			if (progress == null)
			{
				progress = new ModuleProgress
				{
					ModuleId = id,
					UserId = user.Id,
					CompletedEVLs = new List<CompletedEvl>()
				};
				_context.ModuleProgresses.Add(progress);
				await _context.SaveChangesAsync();
			}

			bool alreadyCompleted = progress.CompletedEVLs.Any(c => c.ModuleEvlId == evlId);

			if (!alreadyCompleted)
			{
				var completedEvl = new CompletedEvl
				{
					ModuleProgressId = progress.Id,
					ModuleEvlId = evlId
				};

				_context.Set<CompletedEvl>().Add(completedEvl);
				await _context.SaveChangesAsync();
			}

			var updatedProgress = await _context.ModuleProgresses
				.Where(m => m.ModuleId == id && m.UserId == user.Id)
				.Include(m => m.CompletedEVLs)
					.ThenInclude(c => c.ModuleEvl)
				.FirstOrDefaultAsync();

			if (updatedProgress == null)
			{
				return NoContent();
			}

			var result = ModuleProgressDto.FromModel(updatedProgress);
			return Ok(result);
		}

		/// <summary>
		/// Verwijder een evl van een module van huidige gebruiker
		/// </summary>
		/// <param name="moduleId">ID van de module om te verwijderen</param>
		/// <param name="evlId">ID van de completedEVLs model to add</param>
		/// <returns>Unauthorized als de gebruiker niet gevonden is</returns>
		/// <returns>NoContent als er niks geupdated is</returns>
		/// <returns>Ok met ModuleProgressDto model</returns>
		[HttpDelete("{moduleId}/removecompletedevl/{evlId}")]
		[ValidateAntiForgeryToken]
		[EnableRateLimiting("DeleteLimiter")]
		public async Task<ActionResult<ModuleProgressDto>> RemoveCompletedEvl(int moduleId, int evlId)
		{
			User? user = GetActiveUser();

			if (user == null)
			{
				return Unauthorized("Gebruiker niet ingelogd.");
			}

			var progress = await _context.ModuleProgresses
				.Where(m => m.ModuleId == moduleId && m.UserId == user.Id)
				.Include(m => m.CompletedEVLs)
					.ThenInclude(evl => evl.ModuleEvl)
				.FirstOrDefaultAsync();

			if (progress == null)
			{
				return NoContent();
			}

			var completedEvl = progress.CompletedEVLs.FirstOrDefault(c => c.ModuleEvlId == evlId);

			if (completedEvl != null)
			{
				_context.CompletedEvls.Remove(completedEvl);
				await _context.SaveChangesAsync();
			}

			var updatedProgress = await _context.ModuleProgresses
				.Where(m => m.ModuleId == moduleId && m.UserId == user.Id)
				.Include(m => m.CompletedEVLs)
					.ThenInclude(c => c.ModuleEvl)
				.FirstOrDefaultAsync();

			if (updatedProgress == null)
			{
				return NoContent();
			}

			var result = ModuleProgressDto.FromModel(updatedProgress);
			return Ok(result);
		}

		/// <summary>                                                           
		/// Haal module statestieken op                                          
		/// Vereiste rol: Administrator                             
		/// </summary>                                                          
		/// <param name="year">Specifiek jaar om gegevens van op te halen</param>         
		/// <param name="profileId">ID van de module profiel om gegevens van op te halen</param>         
		/// <returns>Ok met de statestieken</returns> 
		[Authorize(Roles = "Administrator")]
		[HttpGet("reporting/modules-engagement")]
		[EnableRateLimiting("GetLimiter")]
		public async Task<IActionResult> GetModulesEngagement(int? year = null, int? profileId = null)
		{
			var modules = _context.Modules.AsQueryable();

			if (profileId != null)
				modules = modules.Where(m => m.GraduateProfileId == profileId);

			var assignedCounts = await modules
				.Select(m => new
				{
					ModuleCode = m.Code,
					ModuleName = m.Name,
					AssignedCount = _context.Semesters.Count(s => s.ModuleId == m.Id && (year == null || s.Year == year))
				})
				.ToListAsync();

			int totalAssigned = assignedCounts.Sum(m => m.AssignedCount);

			var result = assignedCounts
				.OrderByDescending(m => m.AssignedCount)
				.Select(m => new
				{
					m.ModuleCode,
					m.ModuleName,
					m.AssignedCount,
					Percentage = totalAssigned == 0 ? 0 : (double)m.AssignedCount / totalAssigned * 100
				});

			return Ok(result);
		}

		/// <summary>
		/// Haal alle beschikbare jaren op
		/// </summary>
		/// <returns>Lijst met beschikbare jaren</returns>
		[Authorize(Roles = "Administrator")]
		[HttpGet("reporting/available-years")]
		[EnableRateLimiting("GetLimiter")]
		public async Task<IActionResult> GetAvailableYears()
		{
			var years = await _context.Semesters
				.Select(s => s.Year)
				.Distinct()
				.OrderByDescending(y => y)
				.ToListAsync();

			return Ok(years);
		}
		
		private bool ModuleCodeExists(int id, string code)
		{
			return _context.Modules.Where(m => m.Id != id).Any(m => m.Code == code);
		}
	}
}
