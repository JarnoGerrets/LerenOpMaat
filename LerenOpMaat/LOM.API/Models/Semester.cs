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
        public byte Periode { get; set; }

        [ForeignKey(nameof(LearningRoute))]
        public int LearningRouteId { get; set; }
        public LearningRoute? LearningRoute { get; set; }

        [ForeignKey(nameof(Module))]
        public int? ModuleId { get; set; }
        public Module? Module { get; set; }
    }
}
