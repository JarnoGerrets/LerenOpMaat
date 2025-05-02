using System.ComponentModel.DataAnnotations;

namespace LOM.API.Models;

public class Module
{
    [Key]
    public int Id { get; set; }
    [Required]
    public string Name { get; set; }
    public string Code { get; set; }

    public string? Description { get; set; }

    public string? Category { get; set; }

    public int Ec { get; set; }
    public int Niveau {get; set; }
    public int Periode {get; set; }
    public Boolean IsActive { get; set; } = false;

    public ICollection<Requirement> Requirements { get; set; } = new List<Requirement>();

}
