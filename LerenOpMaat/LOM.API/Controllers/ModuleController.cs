using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LOM.API.DAL;
using LOM.API.Models;
using LOM.API.DTO;
using Microsoft.AspNetCore.Authorization;

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
			var query = _context.Modules
				.Where(m => m.IsActive);

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
			var modules = await _context.Modules
				.Where(m => m.IsActive)
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
			else if (!module.IsActive)
			{
				return Forbid();
			}

			var result = await ModuleDto.FromModelAsync(module, _context);
			return result;
		}

		// PUT: api/Module/5
		// To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
		[Authorize(Roles = "Lecturer,Administrator")]
		[HttpPut("{id}")]
		public async Task<IActionResult> PutModule(int id, ModuleDto moduleDto)
		{
			if (id != moduleDto.Id)
			{
				return BadRequest();
			}

			// Convert the DTO back to a model using the mapping method
			var module = moduleDto.ToModel();

			var existingModule = await _context.Modules.FindAsync(id);
			if (existingModule == null)
			{
				return NotFound();
			}

			if (existingModule.Code != module.Code)
			{
				if (ModuleCodeExists(module.Code))
				{
					return Conflict(new { message = "Module code bestaat al." });
				}
			}

			_context.Entry(module).State = EntityState.Modified;
			await _context.SaveChangesAsync();

			return NoContent();
		}

		// POST: api/Module
		// To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
		[Authorize(Roles = "Lecturer,Administrator")]
		[HttpPost]
		public async Task<ActionResult<Module>> PostModule(ModuleCreateDto @dto)
		{
			if (ModuleCodeExists(dto.Code))
			{
				return Conflict(new { message = "Module code bestaat al." });
			}

			var module = new Module
			{
				Name = dto.Name,
				Code = dto.Code,
				Description = dto.Description,
				Ec = dto.Ec,
				Level = dto.Level,
				Period = dto.Period,
				IsActive = dto.IsActive,
				GraduateProfileId = dto.GraduateProfileId
			};

			_context.Modules.Add(module);
			await _context.SaveChangesAsync();

			return CreatedAtAction("GetModule", new { id = @module.Id }, @module);
		}

		private bool ModuleCodeExists(string code)
		{
			return _context.Modules.Any(e => e.Code == code);
		}

		// DELETE: api/Module/5
		[Authorize(Roles = "Lecturer,Administrator")]
		[HttpDelete("{id}")]
		public async Task<IActionResult> SoftDeleteModule(int id)
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

		// GET: api/Module/5/progress
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
	}
}
