using LOM.API.Models;
using LOM.API.Validator.ValidationResults;

namespace LOM.API.Validator.ValidationService
{
	public interface ISemesterValidationService
	{
		Task<ICollection<IValidationResult>> ValidateSemestersAsync(List<Semester> semesters, int userId);
	}
}
