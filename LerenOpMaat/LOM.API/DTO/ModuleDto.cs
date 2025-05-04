using LOM.API.DAL;
using LOM.API.Models;

namespace LOM.API.DTO
{
	public class ModuleDto
	{
		public int Id { get; set; }
		public string Name { get; set; }
		public string Code { get; set; }
		public string Description { get; set; }
		public string Category { get; set; }
		public int Ec { get; set; }
		public int Niveau { get; set; }
		public int Periode { get; set; }
		public bool IsActive { get; set; }
		public List<RequirementDto> Requirements { get; set; }

		public static async Task<ModuleDto> FromModelAsync(Module module, LOMContext context)
		{
			var requirementDtos = await Task.WhenAll(
				module.Requirements.Select(r => RequirementDtoFactory.CreateAsync(r, context))
			);

			return new ModuleDto
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
				Requirements = requirementDtos.ToList()
			};
		}
		public Module ToModel()
		{
			List<Requirement> requirements = RequirementDtoFactory.ToModelList(this.Requirements);
			return new Module
			{
				Id = this.Id,
				Name = this.Name,
				Code = this.Code,
				Description = this.Description,
				Category = this.Category,
				Ec = this.Ec,
				Niveau = this.Niveau,
				Periode = this.Periode,
				IsActive = this.IsActive,
				Requirements = requirements
			};
		}
	}
}