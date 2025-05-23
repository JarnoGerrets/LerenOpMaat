using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace LOM.API.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string ExternalID { get; set; }

        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
        public int StartYear { get; set; }

        [ForeignKey(nameof(LearningRoute))]
        public int? LearningRouteId { get; set; }
        public LearningRoute? LearningRoute { get; set; }

        [ForeignKey(nameof(Role))]
        public int RoleId { get; set; }
        public Role? Role { get; set; }
    }
}
