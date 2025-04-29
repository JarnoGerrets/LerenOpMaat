using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace LOM.API.Models
{
    public class Semester
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public int Year { get; set; }
        public byte semester { get; set; }

        [ForeignKey(nameof(learningRoute))]
        public int learningRouteId { get; set; }
        public learningRoute? learningRoute { get; set; }

        [ForeignKey(nameof(Module))]
        public int? moduleId { get; set; }
        public Module? Module { get; set; }
    }
}
