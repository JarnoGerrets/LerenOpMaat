using LOM.Shared.Models;

namespace LOM.MVC.ViewModels;

public class CohortSelectionViewModel
{
	public IEnumerable<CohortViewModel> Cohorts { get; set; } = new List<CohortViewModel>();
}

public class CohortViewModel : Cohort
{
	public CohortViewModel() { }
	public CohortViewModel(Cohort cohort) 
	{
		Id = cohort.Id;
		StartDate = cohort.StartDate;
		IsActive = cohort.IsActive;
	}

	public string YearString => StartDate.Year.ToString();
}
