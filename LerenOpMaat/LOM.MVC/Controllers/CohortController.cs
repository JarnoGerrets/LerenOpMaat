using LOM.MVC.Services;
using LOM.MVC.ViewModels;
using LOM.Shared.Models;
using Microsoft.AspNetCore.Mvc;

namespace LOM.MVC.Controllers
{
	public class CohortController : Controller
	{
		private readonly IApiService<Cohort> _cohortService;

		public CohortController(IApiService<Cohort> cohortService)
		{
			_cohortService = cohortService;
		}

		public async Task<IActionResult> Index()
		{
			var viewModel = new CohortSelectionViewModel();
			var cohorts = await _cohortService.GetAsync("cohort");
			if (cohorts == null)
				return NotFound("Er kunnen geen cohorten gevonden worden, probeer het later nog eens.");

			viewModel.Cohorts = cohorts
				.Where(x => x.IsActive)
				.Select(x => new CohortViewModel(x));

			return View(viewModel);
		}
	}
}
