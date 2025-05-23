using LOM.API.Models;

namespace LOM.API.DTO
{
	public class CompletedEvlDto
	{
		public int Id { get; set; }
		public ModuleEvlDto ModuleEvl { get; set; }


		public static CompletedEvlDto FromModel(CompletedEvl completedEvl)
		{
			return new CompletedEvlDto
			{
				Id = completedEvl.Id,
				ModuleEvl = ModuleEvlDto.FromModel(completedEvl.ModuleEvl)
			};
		}


		public CompletedEvl ToModel(ModuleProgress moduleProgress)
		{
			return new CompletedEvl
			{
				Id = this.Id,
				ModuleProgressId = moduleProgress.Id,
				ModuleEvlId = this.ModuleEvl.Id,
			};
		}
	}
}
