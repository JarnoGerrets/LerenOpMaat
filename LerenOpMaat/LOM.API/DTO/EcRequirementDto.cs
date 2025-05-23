using LOM.API.Models;
using LOM.API.Enums;

namespace LOM.API.DTO
{
	public class EcRequirementDto : RequirementDto
	{
		public int RequiredCredits { get; set; }

		public override Requirement ToModel()
		{
			return new Requirement
			{
				Id = Id,
				ModuleId = ModuleId,
				Type = Type,
				Value = RequiredCredits.ToString()
			};
		}

		public static EcRequirementDto FromModel(Requirement r)
		{
			var description = r.Type switch
			{
				ModulePreconditionType.RequiredEc => $"Minimaal {int.Parse(r.Value)} EC vereist.",
				ModulePreconditionType.RequiredEcFromPropedeuse => $"Minimaal {int.Parse(r.Value)} EC uit de propedeuse vereist.",
				_ => "Onbekende EC-vereiste"
			};
			return new EcRequirementDto
			{
				Id = r.Id,
				ModuleId = r.ModuleId,
				Type = r.Type,
				RequiredCredits = int.Parse(r.Value), 
				Description = description
			};
		}
	}

}
