using Microsoft.AspNetCore.Mvc;
using LOM.API.DAL;
using LOM.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.RateLimiting;
using LOM.API.Controllers.Base;
using LOM.API.Services;

namespace LOM.API.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class OerController : LOMBaseController
    {
        private readonly IVirusScanner _virusScanner;

        public OerController(LOMContext context, IVirusScanner virusScanner) : base(context)
        {
            _virusScanner = virusScanner;
        }

        [Authorize(Roles = "Administrator, Lecturer")]
        [HttpPut("upload")]
        [ValidateAntiForgeryToken]
        [EnableRateLimiting("PostLimiter")]
        public async Task<IActionResult> UploadOer(IFormFile? file)
        {
            const long MaxFileSizeBytes = 10 * 1024 * 1024;
            if (file == null || file.Length == 0)
            {
                return BadRequest("Geen bestand geüpload.");
            }

            if (file.Length > MaxFileSizeBytes)
            {
                return BadRequest("Bestand is te groot. Maximaal toegestaan is 10 MB.");
            }

            if (file.ContentType != "application/pdf" || Path.GetExtension(file.FileName).ToLower() != ".pdf")
            {
                return BadRequest("Alleen PDF-bestanden zijn toegestaan.");
            }

            byte[] fileBytes;
            using (var ms = new MemoryStream())
            {
                await file.CopyToAsync(ms);
                fileBytes = ms.ToArray();
            }

            // Virus scan via interface
            var (isSafe, virusName) = await _virusScanner.ScanFileAsync(fileBytes, file.FileName);
            if (!isSafe)
            {
                return BadRequest($"Virus gevonden: {virusName ?? "onbekend"}");
            }

            var oer = await _context.Oers.FindAsync(1);
            if (oer == null)
            {
                oer = new Oer { Id = 1 };
                _context.Oers.Add(oer);
            }

            oer.Base64PDF = Convert.ToBase64String(fileBytes);
            oer.UploadDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { id = oer.Id });
        }

        [AllowAnonymous]
        [HttpGet("current")]
        [EnableRateLimiting("GetLimiter")]
        public async Task<IActionResult> GetCurrentOer()
        {
            var oer = await _context.Oers.FindAsync(1);
            if (oer == null)
            {
                return NotFound("Geen OER gevonden.");
            }

            var fileBytes = Convert.FromBase64String(oer.Base64PDF);
            return File(new MemoryStream(fileBytes), "application/pdf", enableRangeProcessing: true);
        }
    }
}
