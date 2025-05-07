using LOM.API.DAL;
using LOM.API.Models;
using System.Diagnostics;

namespace LOM.API.DTO
{
	public class RequiredModuleDto : ModuleDto
	{
		public static RequiredModuleDto FromModel(Module module)
		{
			return new RequiredModuleDto
			{
				Id = module.Id,
				Name = module.Name,
				Code = module.Code,
				Description = module.Description,
				GraduateProfile = module.GraduateProfile,
				Ec = module.Ec,
				Niveau = module.Niveau,
				Period = module.Period,
				IsActive = module.IsActive,
			};
		}
	}
}