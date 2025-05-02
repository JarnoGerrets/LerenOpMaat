using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using LOM.API.Enums;

namespace LOM.API.Models
{
    public class Requirement
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [ForeignKey(nameof(Module))]
        public int ModuleId { get; set; }
        
        public Module Module { get; set; }

        public ModulePreconditionType Type { get; set; }
        public string Value {get; set; }
    }
}