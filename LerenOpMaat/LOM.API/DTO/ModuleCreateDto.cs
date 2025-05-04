namespace LOM.API.DTO
{
	public class ModuleCreateDto
	{
		public string Name { get; set; }
		public string Code { get; set; }
		public string Description { get; set; } = string.Empty;
		public int Ec { get; set; }
		public int Niveau { get; set; }
		public int Periode { get; set; }
		public bool IsActive { get; set; }
		public int GraduateProfileId { get; set; }
		public List<int> RequirementIds { get; set; } = new();
	}

}
