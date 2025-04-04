using System.ComponentModel.DataAnnotations;

namespace LOM.API.Models
{
	public class Cohort
	{
		[Key]
		public int Id { get; set; }
		[Required]
		public DateTime StartDate { get; set; }
		public bool IsActive { get; set; }
	}
}
