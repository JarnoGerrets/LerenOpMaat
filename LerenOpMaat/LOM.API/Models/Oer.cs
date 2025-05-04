using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LOM.API.Models
{
    public class Oer
    {
        public int Id { get; set; }

        [Required]
        public string Base64PDF { get; set; }

        [Required]
        public DateTime UploadDate { get; set; }

        [Required]
        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public User UploadedBy { get; set; }
    }
}
