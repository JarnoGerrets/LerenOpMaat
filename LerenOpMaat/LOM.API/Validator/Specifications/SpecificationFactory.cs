using System;
using System.Collections.Generic;
using LOM.API.DAL;
using LOM.API.Models;
using LOM.API.Enums;

namespace LOM.API.Validator.Specifications
{
	public class SpecificationFactory
	{
		private readonly LOMContext _context;

		public SpecificationFactory(LOMContext context)
		{
			_context = context;
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
					ModulePreconditionType.Graduating,
					(_, index) => new GraduatingSpecification(index)
				},
				{
					ModulePreconditionType.RequiredEc,
					(_, _) => new RequiredEcSpecification()
				},
				{
					ModulePreconditionType.RequiredEcFromPropedeuse,
					(_, _) => new RequiredEcFromPropedeuseSpecification()
				}
				// Add new requirements here after adding their respective files in the /Validator/Specifications folder
			};
		}
	}
}