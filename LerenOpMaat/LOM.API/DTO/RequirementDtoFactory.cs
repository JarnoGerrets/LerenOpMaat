﻿using System.Diagnostics;
using LOM.API.DAL;
using LOM.API.Enums;
using LOM.API.Models;
using Newtonsoft.Json;

namespace LOM.API.DTO
{
	public static class RequirementDtoFactory
	{
		public static async Task<RequirementDto> CreateAsync(Requirement r, LOMContext context)
		{
			return r.Type switch
			{
				ModulePreconditionType.RequiredModule => await ModuleRequirementDto.FromModelAsync(r, context),
				ModulePreconditionType.RequiredEc => NumericRequirementDto.FromModel(r),
				ModulePreconditionType.RequiredEcFromPropedeuse => NumericRequirementDto.FromModel(r),
				ModulePreconditionType.RequiredLevel3ModulesCount => NumericRequirementDto.FromModel(r),
				ModulePreconditionType.RequiredLevel2ModulesCount => NumericRequirementDto.FromModel(r),
				_ => throw new NotImplementedException($"Requirement type {r.Type} not supported.")
			};
		}

		public static RequirementDto RehydrateFromBase(RequirementDto dto)
		{
			return dto.Type switch
			{
				ModulePreconditionType.RequiredModule => JsonConvert.DeserializeObject<ModuleRequirementDto>(
					JsonConvert.SerializeObject(dto)),
				ModulePreconditionType.RequiredEc => JsonConvert.DeserializeObject<NumericRequirementDto>(
					JsonConvert.SerializeObject(dto)),
				ModulePreconditionType.RequiredEcFromPropedeuse => JsonConvert.DeserializeObject<NumericRequirementDto>(
					JsonConvert.SerializeObject(dto)),
				_ => throw new NotImplementedException()
			};
		}


		public static List<Requirement> ToModelList(IEnumerable<RequirementDto> dtos)
		{
			var result = new List<Requirement>();

			foreach (var dto in dtos)
			{
				var rehydrated = RehydrateFromBase(dto);
				result.Add(rehydrated.ToModel());
			}

			return result;
		}
	}

}
