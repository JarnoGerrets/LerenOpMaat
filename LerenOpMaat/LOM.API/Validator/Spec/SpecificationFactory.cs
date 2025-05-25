using LOM.API.DAL;
using LOM.API.Enums;
using LOM.API.Models;
using LOM.API.Validator.Spec.Specifications;

namespace LOM.API.Validator.Specifications
{
	public class SpecificationFactory
	{
		private readonly LOMContext _context;
		private readonly int _userId;

		public SpecificationFactory(LOMContext context, int userId)
		{
			_context = context;
			_userId = userId;
		}

		public Dictionary<ModulePreconditionType, Func<string, int, ISpecification<IEnumerable<Semester>>>> CreateSpecifications()
		{
			return new Dictionary<ModulePreconditionType, Func<string, int, ISpecification<IEnumerable<Semester>>>>
			{
				{
					ModulePreconditionType.RequiredModule,
					(value, index) =>
					{
						if (int.TryParse(value, out var requiredModuleId))
						{
							return new RequiredModuleSpecification(requiredModuleId, index, _context);
						}
						else
						{
							throw new ArgumentException($"Invalid module ID '{value}' for RequiredModule.");
						}
					}
				},
								{
					ModulePreconditionType.RequiredLevel2ModulesCount,
					(_, index) => new RequiredLevel2ModulesCountSpecification(index)
				},
				{
					ModulePreconditionType.RequiredLevel3ModulesCount,
					(_, index) => new RequiredLevel3ModulesCountSpecification(index)
				},
				{
					ModulePreconditionType.RequiredEc,
					(value, index) =>
					{
						if (int.TryParse(value, out var requiredEc))
						{
								return new RequiredEcSpecification(requiredEc,  index, _userId, _context);
						}
						else
						{
							throw new ArgumentException($"Invalid ec value '{value}' for this requirement.");
						}
					}
				},
				{
					ModulePreconditionType.RequiredEcFromPropedeuse,
					(value, index) =>
					{
						if (int.TryParse(value, out var requiredEc))
						{
								return new RequiredEcFromPropedeuseSpecification(requiredEc,  index, _userId, _context);
						}
						else
						{
							throw new ArgumentException($"Invalid ec value '{value}' for this requirement.");
						}
					}
				}
				// Add new requirements here after adding their respective files in the /Validator/Specifications folder
			};
		}
	}
}