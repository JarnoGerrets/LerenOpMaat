﻿using LOM.API.DAL;
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
		public GraduateProfile GraduateProfile { get; set; }
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
				Ec = module.Ec,
				Level = module.Level,
				Period = module.Period,
				IsActive = module.IsActive,
				GraduateProfile = module.GraduateProfile,
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
				Ec = this.Ec,
				Level = this.Level,
				Period = this.Period,
				IsActive = this.IsActive,
				GraduateProfileId = this.GraduateProfile.Id,
				Requirements = requirements
			};
		}
	}
}