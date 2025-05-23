using LOM.API.Enums;

namespace LOM.API.DTO;

public class ModuleRequirementTypeDto
{
	public string Key { get; set; }
	public string Description { get; set; } = string.Empty;

	public static ModuleRequirementTypeDto FromEnum(ModulePreconditionType type)
	{
		return type switch
		{
			ModulePreconditionType.RequiredEcFromPropedeuse => new ModuleRequirementTypeDto
			{
				Key = type.ToString(),
				Description = "Minimaal aantal EC uit de propedeuse"
			},
			ModulePreconditionType.RequiredEc => new ModuleRequirementTypeDto
			{
				Key = type.ToString(),
				Description = "Minimaal aantal EC"
			},
			ModulePreconditionType.RequiredModule => new ModuleRequirementTypeDto
			{
				Key = type.ToString(),
				Description = "Vereiste module"
			},
			ModulePreconditionType.RequiredLevel3ModulesCount => new ModuleRequirementTypeDto
			{
				Key = type.ToString(),
				Description = "Aantal vereiste modules op niveau 3"
			},
			ModulePreconditionType.RequiredLevel2ModulesCount => new ModuleRequirementTypeDto
			{
				Key = type.ToString(),
				Description = "Aantal vereiste modules op niveau 2"
			},
			_ => throw new ArgumentOutOfRangeException(nameof(type), type, null),
		};
	}
}
