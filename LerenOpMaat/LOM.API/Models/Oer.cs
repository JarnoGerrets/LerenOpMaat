using System.ComponentModel.DataAnnotations;

namespace LOM.API.Models
{
    public class Oer
    {
        public int Id { get; set; }

        [Required]
        public string Base64PDF { get; set; }

        [Required]
        public DateTime UploadDate { get; set; }
    }
}
