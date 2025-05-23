using System.ComponentModel.DataAnnotations.Schema;

namespace LOM.API.Models;

public class CompletedEvl
{
	public int Id { get; set; }
	[ForeignKey(nameof(ModuleProgress))]
	public int ModuleProgressId { get; set; }
	public ModuleProgress ModuleProgress { get; set; }
	[ForeignKey(nameof(ModuleEvl))]
	public int ModuleEvlId { get; set; }
	public ModuleEVL ModuleEvl { get; set; }
}