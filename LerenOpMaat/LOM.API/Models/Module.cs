using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LOM.API.Models;

public class Module
{
	[Key]
	public int Id { get; set; }
	[Required]
	public string Name { get; set; }
	public string Code { get; set; }

	public string? Description { get; set; }

	public int Ec { get; set; }
	public int Level { get; set; }
	public int Period { get; set; }
	public Boolean IsActive { get; set; } = false;
	[ForeignKey(nameof(GraduateProfile))]
	public int GraduateProfileId { get; set; }

	public GraduateProfile? GraduateProfile { get; set; }
	public ICollection<ModuleEVL> Evls { get; set; } = new List<ModuleEVL>();
	public ICollection<Requirement> Requirements { get; set; } = new List<Requirement>();

}
