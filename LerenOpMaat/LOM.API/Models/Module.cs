using System.ComponentModel.DataAnnotations;

namespace LOM.API.Models;

public class Module
{
	[Key]
	public int Id { get; set; }
	[Required]
	public string Name { get; set; }
	[Required]
	public string Description { get; set; }
	public string Code { get; set; }
	public int ECs {get; set;}
	public IEnumerable<IngangsEis>? IngangsEisen {get; set;}

    public Module()
    {
        IngangsEisen = new List<IngangsEis>();
    }
}
