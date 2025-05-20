using LOM.API.DAL;
using LOM.API.DTO.Mappers;
using LOM.API.Models;

namespace LOM.API.DTO
{
    public class ModuleDto
	{
		public int Id { get; set; }
		public string Name { get; set; }
		public string Code { get; set; }
		public string Description { get; set; }
		public int Ec { get; set; }
		public int Level { get; set; }
		public int Period { get; set; }
		public bool IsActive { get; set; }
		public GraduateProfile GraduateProfile { get; set; } = new GraduateProfile();
		public List<RequirementDto> Requirements { get; set; }
		public List<ModuleEvlDto> Evls { get; set; }

		public static async Task<ModuleDto> FromModelAsync(Module module, LOMContext context)
		{
			var requirementDtos = await Task.WhenAll(
				module.Requirements.Select(r => RequirementDtoMapper.CreateAsync(r, context))
			);

			return new ModuleDto
			{
				Id = module.Id,
				Name = module.Name,
				Code = module.Code,
				Description = module.Description,
				Ec = module.Ec,
				Level = module.Level,
				Period = module.Period,
				IsActive = module.IsActive,
				GraduateProfile = module.GraduateProfile,
				Requirements = requirementDtos.ToList(),
				Evls = module.Evls.Select(ModuleEvlDto.FromModel).ToList()
			};
		}

		public Module ToModel()
		{
			List<Requirement> requirements = RequirementDtoMapper.ToModelList(this.Requirements);
			return new Module
			{
				Id = this.Id,
				Name = this.Name,
				Code = this.Code,
				Description = this.Description,
				Ec = this.Ec,
				Level = this.Level,
				Period = this.Period,
				IsActive = this.IsActive,
				GraduateProfileId = this.GraduateProfile.Id,
				Requirements = requirements,
				Evls = this.Evls.Select(evlDto => evlDto.ToModel(this.Id)).ToList()
			};
		}
	}
}