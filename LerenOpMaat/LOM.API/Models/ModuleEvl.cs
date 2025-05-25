using System.ComponentModel.DataAnnotations.Schema;

namespace LOM.API.Models;

public class ModuleEVL
{
	public int Id { get; set; }
	[ForeignKey(nameof(Module))]
	public int ModuleId { get; set; }
	public Module? Module { get; set; }
	public string Name { get; set; }
	public int Ec { get; set; }
}
