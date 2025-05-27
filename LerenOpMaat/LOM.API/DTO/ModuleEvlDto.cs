using LOM.API.Models;

namespace LOM.API.DTO
{
	public class ModuleEvlDto
	{
		public int Id { get; set; }
		public string Name { get; set; }
		public int Ec { get; set; }


		public static ModuleEvlDto FromModel(ModuleEVL moduleEvl)
		{
			return new ModuleEvlDto
			{
				Id = moduleEvl.Id,
				Name = moduleEvl.Name,
				Ec = moduleEvl.Ec
			};
		}


		public ModuleEVL ToModel()
		{
			return new ModuleEVL
			{
				Id = this.Id,
				Name = this.Name,
				Ec = this.Ec
			};
		}
	}
}
