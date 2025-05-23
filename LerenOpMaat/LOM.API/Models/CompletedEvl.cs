using System.ComponentModel.DataAnnotations.Schema;

namespace LOM.API.Models;

public class CompletedEVL
{
    public int Id { get; set; }
    [ForeignKey(nameof(ModuleProgress))]
    public int ModuleProgressId { get; set; }
    public ModuleProgress ModuleProgress { get; set; }
    [ForeignKey(nameof(ModuleEVL))]
    public int ModuleEVLId { get; set; } 
    public ModuleEVL ModuleEVL { get; set; } 
}