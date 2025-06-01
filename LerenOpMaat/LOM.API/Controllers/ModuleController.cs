using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LOM.API.DAL;
using LOM.API.Models;
using LOM.API.DTO;
using Microsoft.AspNetCore.Authorization;
using System.Diagnostics;

namespace LOM.API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class ModuleController : ControllerBase
	{
		private readonly LOMContext _context;

		public ModuleController(LOMContext context)
		{
			_context = context;
		}

		// GET: api/Module
		[HttpGet]
		public async Task<ActionResult<IEnumerable<ModuleDto>>> GetModules([FromQuery] string? q)
		{
			IQueryable<Module> query;
			int userId = HttpContext.Session.GetInt32("UserId") ?? 0;

			if (userId != 0)
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
					m.Name.ToLower().Contains(lowerQ) ||
					m.Code.ToLower().Contains(lowerQ) ||
					m.Description.ToLower().Contains(lowerQ));
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


		// GET: api/Module/Active
		[HttpGet("Active")]
		public async Task<ActionResult<IEnumerable<ModuleDto>>> GetActiveModules([FromQuery] string? q)
		{

			var query = _context.Modules.Where(m => m.IsActive);

			if (!string.IsNullOrWhiteSpace(q))
			{
				string lowerQ = q.ToLower();
				query = query.Where(m =>
					m.Name.ToLower().Contains(lowerQ) ||
					m.Code.ToLower().Contains(lowerQ) ||
					m.Description.ToLower().Contains(lowerQ));
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

		// GET: api/Module/5
		[HttpGet("{id}")]
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
				return NotFound();
			}

			var result = await ModuleDto.FromModelAsync(module, _context);
			return result;
		}

		// PUT: api/Module/5
		// To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
		[Authorize(Roles = "Lecturer, Administrator")]
		[HttpPut("{id}")]
		public async Task<IActionResult> PutModule(int id, ModuleDto moduleDto)
		{

			var existingModule = await _context.Modules
				.Include(m => m.Evls)
				.FirstOrDefaultAsync(m => m.Id == id);

			if (existingModule == null)
				return NotFound();

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

		[Authorize(Roles = "Lecturer, Administrator")]
		[HttpGet("existence/{id}")]
		public async Task<IActionResult> CheckModuleExistence(int id)
		{
			var exists = await _context.Semesters.AnyAsync(s => s.ModuleId == id);
			return Ok(exists);
		}


		// POST: api/Module
		// To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
		[Authorize(Roles = "Lecturer, Administrator")]
		[HttpPost]
		public async Task<ActionResult<Module>> PostModule(ModuleCreateDto @dto)
		{
			if (dto == null)
			{
				return BadRequest("Module data is required.");
			}

			if (ModuleCodeExists(dto.Code))
			{
				return Conflict(new { message = "Module code bestaat al." });
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
		private bool ModuleCodeExists(string code)
		{
			return _context.Modules.Any(m => m.Code == code);
		}
		// deactivate: api/Module/deactivate/5
		[Authorize(Roles = "Lecturer, Administrator")]
		[HttpPatch("deactivate/{id}")]
		public async Task<IActionResult> DeactivateModule(int id)
		{
			var @module = await _context.Modules.FindAsync(id);
			if (@module == null)
			{
				return NotFound();
			}

			module.IsActive = false;
			_context.Modules.Update(module);
			await _context.SaveChangesAsync();

			return NoContent();
		}

		// activate: api/Module/activate/5
		[Authorize(Roles = "Lecturer, Administrator")]
		[HttpPatch("activate/{id}")]
		public async Task<IActionResult> ActivateModule(int id)
		{
			var @module = await _context.Modules.FindAsync(id);
			if (@module == null)
			{
				return NotFound();
			}

			module.IsActive = true;
			_context.Modules.Update(module);
			await _context.SaveChangesAsync();

			return NoContent();
		}
		// DELETE: api/Module/5
		[Authorize(Roles = "Lecturer, Administrator")]
		[HttpDelete("{id}")]
		public async Task<IActionResult> DeleteModule(int id)
		{
			var module = await _context.Modules.FindAsync(id);
			if (module == null) return NotFound();

			var isInUse = await _context.Semesters.AnyAsync(s => s.ModuleId == id);
			if (isInUse) return BadRequest("Module is in use and cannot be deleted.");

			_context.Modules.Remove(module);
			await _context.SaveChangesAsync();

			return NoContent();
		}
		// GET: api/Module/5/progress
		[Authorize]
		[HttpGet("{id}/progress")]
		public async Task<ActionResult<ModuleProgressDto>> GetModuleProgress(int id)
		{
			int userId = HttpContext.Session.GetInt32("UserId") ?? 0;

			var progress = await _context.ModuleProgresses
				.Where(m => m.ModuleId == id && m.UserId == userId)
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

		// POST: api/Module/5/completedevl
		[Authorize]
		[HttpPost("{id}/addcompletedevl")]
		public async Task<ActionResult<ModuleProgressDto>> AddCompletedEvl(int id, [FromBody] int evlId)
		{
			int userId = HttpContext.Session.GetInt32("UserId") ?? 0;

			var progress = await _context.ModuleProgresses
				.Include(m => m.CompletedEVLs)
					.ThenInclude(c => c.ModuleEvl)
				.FirstOrDefaultAsync(m => m.ModuleId == id && m.UserId == userId);

			if (progress == null)
			{
				progress = new ModuleProgress
				{
					ModuleId = id,
					UserId = userId,
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
				.Where(m => m.ModuleId == id && m.UserId == userId)
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

		// DELETE: api/Module/5/completedevl/10
		[Authorize]
		[HttpDelete("{moduleId}/removecompletedevl/{evlId}")]
		public async Task<ActionResult<ModuleProgressDto>> RemoveCompletedEvl(int moduleId, int evlId)
		{
			int userId = HttpContext.Session.GetInt32("UserId") ?? 0;

			var progress = await _context.ModuleProgresses
				.Where(m => m.ModuleId == moduleId && m.UserId == userId)
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
				.Where(m => m.ModuleId == moduleId && m.UserId == userId)
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

		[Authorize(Roles = "Administrator")]
		[HttpGet("reporting/modules-engagement")]
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
					AssignedCount = _context.Semesters
						.Where(s => s.ModuleId == m.Id && (year == null || s.Year == year))
						.Count()
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



		[Authorize(Roles = "Administrator")]
		[HttpGet("reporting/available-years")]
		public async Task<IActionResult> GetAvailableYears()
		{
			var years = await _context.Semesters
				.Select(s => s.Year)
				.Distinct()
				.OrderByDescending(y => y)
				.ToListAsync();

			return Ok(years);
		}



	}
}
