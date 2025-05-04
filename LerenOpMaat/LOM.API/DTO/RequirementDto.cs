using LOM.API.DAL;
using LOM.API.Enums;
using LOM.API.Models;
using System.Reflection;

namespace LOM.API.DTO
{
	public abstract class RequirementDto
	{
		public int Id { get; set; }
		public int ModuleId { get; set; }
		public ModulePreconditionType Type { get; set; }
		public string Description { get; set; }

		public abstract Requirement ToModel();
	}
}