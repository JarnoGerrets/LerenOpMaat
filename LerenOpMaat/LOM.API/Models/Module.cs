using System.ComponentModel.DataAnnotations;

namespace LOM.API.Models;

public class Module
{
    [Key]
    public int Id { get; set; }
    [Required]
    public string Name { get; set; }
	[Required]
    public string Code { get; set; }
    [Required]
    public string Description { get; set; }
	[Required]
	public int Ec { get; set; }
	[Required]
	public int Niveau { get; set; }
    public string? Category { get; set; }
    public ICollection<Semester>? Semesters { get; set; }
}
