using System.ComponentModel.DataAnnotations.Schema;

namespace LOM.API.Models;

public class ModuleProgress
{
    public int Id { get; set; }
    [ForeignKey(nameof(User))]
    public int UserId { get; set; }
    public User User { get; set; }
    [ForeignKey(nameof(Module))]
    public int ModuleId { get; set; }
    public Module Module { get; set; }
    public ICollection<CompletedEvl> CompletedEVLs { get; set; }
}