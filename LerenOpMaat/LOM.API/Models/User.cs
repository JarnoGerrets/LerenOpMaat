using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace LOM.API.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        public string Name { get; set; }

        [ForeignKey(nameof(learningRoute))]
        public int? learningRouteId { get; set; }
        public learningRoute? learningRoute { get; set; }
    }
}
