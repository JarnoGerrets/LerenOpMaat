using System.ComponentModel.DataAnnotations.Schema;

namespace LOM.API.Models
{
    public class Conversation
    {
        public int Id { get; set; }

        [ForeignKey(nameof(LearningRoute))]
        public int LearningRouteId { get; set; }
        public LearningRoute? LearningRoute { get; set; }

        [ForeignKey(nameof(Teacher))]
        public int TeacherId { get; set; }
        public User? Teacher { get; set; }

        [ForeignKey(nameof(Student))]
        public int StudentId { get; set; }
        public User? Student { get; set; }
    }
}
