using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LOM.API.DAL;
using LOM.API.Models;
using LOM.API.DTO;

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
		[HttpPut("{id}")]
		public async Task<IActionResult> PutModule(int id, ModuleDto moduleDto)
		{
			var roleClaim = HttpContext.User.FindFirst("role")?.Value;

			if (roleClaim == "Student")
				return Forbid();

			if (id != moduleDto.Id)
			{
				return BadRequest();
			}

			// Convert the DTO back to a model using the mapping method
			var module = moduleDto.ToModel();

			_context.Entry(module).State = EntityState.Modified;
			await _context.SaveChangesAsync();

			return NoContent();
		}


		// POST: api/Module
		// To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
		[HttpPost]
		public async Task<ActionResult<Module>> PostModule(ModuleCreateDto @dto)
		{
			var roleClaim = HttpContext.User.FindFirst("role")?.Value;

			if (roleClaim == "Student")
				return Forbid();

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

		//// DELETE: api/Module/5
		//[HttpDelete("{id}")]
		//public async Task<IActionResult> DeleteModule(int id)
		//{
		//	var @module = await _context.Modules.FindAsync(id);
		//	if (@module == null)
		//	{
		//		return NotFound();
		//	}

		//	_context.Modules.Remove(@module);
		//	await _context.SaveChangesAsync();

		//	return NoContent();
		//}

		// DELETE: api/Module/5
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

		private bool ModuleExists(int id)
		{
			return _context.Modules.Any(e => e.Id == id);
		}
	}
}
