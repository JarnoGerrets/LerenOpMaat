using Microsoft.AspNetCore.Mvc;
using LOM.API.DAL;
using LOM.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.RateLimiting;
using LOM.API.Controllers.Base;

namespace LOM.API.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class OerController : LOMBaseController
    {

        public OerController(LOMContext context) : base(context) { }

        /// <summary>
        /// Upload een nieuw oer pdf bestand
        /// Vereiste rol: Administrator of Lecturer 
        /// </summary>
        /// <param name="file">PDF Bestand om te uploaden, maximaal 10MB</param>
        /// <returns>BadRequest Als er geen bestand geupload is</returns>
        /// <returns>BadRequest Als bestand groter is dan 10MB</returns>
        /// <returns>BadRequest Als het bestand geen PDF bestand is</returns>
        /// <returns>Ok als het bestand successvol is geupload</returns>
        [Authorize(Roles = "Administrator, Lecturer")]
        [HttpPut("upload")]
        [EnableRateLimiting("PostLimiter")]
        public async Task<IActionResult> UploadOer(IFormFile? file)
        {
            const long MaxFileSizeBytes = 10 * 1024 * 1024; // 10 MB

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

        /// <summary>
        /// Oer van het huidige jaar ophalen
        /// </summary>
        /// <returns>NotFound als er nog geen oer bestand geupload is voor het huidige jaar</returns>
        /// <returns>Het oer bestand van het huidige jaar</returns>
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
            var stream = new MemoryStream(fileBytes);

            return File(stream, "application/pdf", enableRangeProcessing: true);
        }
    }
}
