using LOM.API.Models;
using LOM.API.Enums;

namespace LOM.API.DTO
{
	public class NumericRequirementDto : RequirementDto
	{
		public int Number { get; set; }

		public override Requirement ToModel()
		{
			return new Requirement
			{
				Id = Id,
				ModuleId = ModuleId,
				Type = Type,
				Value = Number.ToString()
			};
		}

		public static NumericRequirementDto FromModel(Requirement r)
		{
			var description = r.Type switch
			{
				ModulePreconditionType.RequiredEc => $"Minimaal {r.Value} EC vereist.",
				ModulePreconditionType.RequiredEcFromPropedeuse => $"Minimaal {r.Value} EC uit de propedeuse vereist.",
				ModulePreconditionType.RequiredLevel3ModulesCount => $"Minimaal {r.Value} modules van niveau 3 vereist",
				ModulePreconditionType.RequiredLevel2ModulesCount => $"Minimaal {r.Value} modules van niveau 3 vereist",
				_ => "Onbekende EC-vereiste"
			};

			return new NumericRequirementDto
			{
				Id = r.Id,
				ModuleId = r.ModuleId,
				Type = r.Type,
				Number = int.Parse(r.Value), 
				Description = description
			};
		}
	}

}
