using System.Diagnostics;
using LOM.API.DAL;
using LOM.API.Enums;
using LOM.API.Models;

namespace LOM.API.DTO
{
	public class ModuleRequirementDto : RequirementDto
	{
		public RequiredModuleDto RequiredModule { get; set; }

		public override Requirement ToModel()
		{
			return new Requirement
			{
				Id = Id,
				ModuleId = ModuleId,
				Type = ModulePreconditionType.RequiredModule,
				Value = RequiredModule.Id.ToString()
			};
		}

		public static async Task<ModuleRequirementDto> FromModelAsync(Requirement r, LOMContext context)
		{
			var module = await context.Modules.FindAsync(int.Parse(r.Value));
			Debug.WriteLine(RequiredModuleDto.FromModel(module).Id);
			return new ModuleRequirementDto
			{
				Id = r.Id,
				ModuleId = r.ModuleId,
				Type = r.Type,
				RequiredModule = RequiredModuleDto.FromModel(module),
				Description = $"{module?.Name ?? "Onbekende module"} moet afgerond zijn."
			};
		}
	}

}