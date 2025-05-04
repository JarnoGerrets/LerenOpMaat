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
				Category = module.Category,
				Ec = module.Ec,
				Niveau = module.Niveau,
				Periode = module.Periode,
				IsActive = module.IsActive,
			};
		}
	}
}