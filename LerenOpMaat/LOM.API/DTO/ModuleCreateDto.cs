using System.Runtime.InteropServices;

namespace LOM.API.DTO
{
	public class ModuleCreateDto
	{
		public int Id { get; set; }
		public string Name { get; set; }
		public string Code { get; set; }
		public string Description { get; set; } = string.Empty;
		public int Ec { get; set; }
		public int Level { get; set; }
		public int Period { get; set; }
		public bool IsActive { get; set; }
		public int GraduateProfileId { get; set; }
		public List<ModuleEvlDto> Evls { get; set; }
	}

}
