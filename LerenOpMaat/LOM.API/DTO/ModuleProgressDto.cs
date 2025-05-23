using LOM.API.Models;

namespace LOM.API.DTO
{
	public class ModuleProgressDto
	{
		public int Id { get; set; }
		public int UserId { get; set; }
		public int ModuleId { get; set; }
		public List<CompletedEvlDto> CompletedEvls { get; set; }


		public static ModuleProgressDto FromModel(ModuleProgress moduleProgress)
		{
			return new ModuleProgressDto
			{
				Id = moduleProgress.Id,
				UserId = moduleProgress.UserId,
				ModuleId = moduleProgress.ModuleId,
				CompletedEvls = moduleProgress.CompletedEVLs.Select(CompletedEvlDto.FromModel).ToList()
			};
		}

		public ModuleProgress ToModel()
		{
			return new ModuleProgress
			{
				Id = this.Id,
				UserId = this.UserId,
				ModuleId = this.ModuleId,
				CompletedEVLs = this.CompletedEvls.Select(evl => evl.ToModel(new ModuleProgress { Id = this.Id })).ToList()
			};
		}

	}
}
