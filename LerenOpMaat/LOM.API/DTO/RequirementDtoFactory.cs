using LOM.API.DAL;
using LOM.API.Enums;
using LOM.API.Models;

namespace LOM.API.DTO
{
	public static class RequirementDtoFactory
	{
		public static async Task<RequirementDto> CreateAsync(Requirement r, LOMContext context)
		{
			return r.Type switch
			{
				ModulePreconditionType.RequiredModule => await ModuleRequirementDto.FromModelAsync(r, context),
				ModulePreconditionType.RequiredEc => EcRequirementDto.FromModel(r),
				ModulePreconditionType.RequiredEcFromPropedeuse => EcRequirementDto.FromModel(r),
				_ => throw new NotImplementedException($"Requirement type {r.Type} not supported.")
			};
		}


		public static List<Requirement> ToModelList(IEnumerable<RequirementDto> dtos)
		{
			var result = new List<Requirement>();

			foreach (var dto in dtos)
			{
				result.Add(dto.ToModel());
			}

			return result;
		}
	}

}
