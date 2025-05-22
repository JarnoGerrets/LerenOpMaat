using System.Diagnostics;
using LOM.API.DAL;
using LOM.API.Enums;
using LOM.API.Models;
using Newtonsoft.Json;

namespace LOM.API.DTO.Mappers
{
    public static class RequirementDtoMapper
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

        public static RequirementDto RehydrateFromBase(RequirementDto dto)
        {
#pragma warning disable CS8603 // Possible null reference return.
            return dto.Type switch
                {
                    ModulePreconditionType.RequiredModule => JsonConvert.DeserializeObject<ModuleRequirementDto>(
                        JsonConvert.SerializeObject(dto)),
                    ModulePreconditionType.RequiredEc => JsonConvert.DeserializeObject<EcRequirementDto>(
                        JsonConvert.SerializeObject(dto)),
                    ModulePreconditionType.RequiredEcFromPropedeuse => JsonConvert.DeserializeObject<EcRequirementDto>(
                        JsonConvert.SerializeObject(dto)),
                    _ => throw new NotImplementedException()
                };
#pragma warning restore CS8603 // Possible null reference return.
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
