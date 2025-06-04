using Microsoft.AspNetCore.Mvc;

namespace LOM.API.Controllers;

[ApiController]
[Route("api/csrf-token")] 
public class CsrfController: ControllerBase
{
    [HttpGet]
    public IActionResult Get() => Ok(new { token = "sent via cookie" });
}