using Microsoft.AspNetCore.Mvc;

namespace LOM.MVC.Controllers
{
	public class LearningRouteController : Controller
	{
		public IActionResult Index()
		{
			return View();
		}
	}
}
