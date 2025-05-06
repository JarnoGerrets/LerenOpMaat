using System.ComponentModel.DataAnnotations;

namespace LOM.API.Models
{
	public class GraduateProfile
	{
		[Key]
		public int Id { get; set; }

		public string Name { get; set; }
		public string ColorCode { get; set; }

	}
}
