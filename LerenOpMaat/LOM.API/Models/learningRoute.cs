using System.ComponentModel.DataAnnotations;

namespace LOM.API.Models
{
    public class LearningRoute
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }

        public ICollection<User>? Users { get; set; }
        public ICollection<Semester>? Semesters { get; set; }
    }
}
