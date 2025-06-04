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

        private readonly string _virusTotalApiKey;
        public OerController(LOMContext context, IConfiguration config) : base(context)
        {
            _virusTotalApiKey = config["VirusTotal:ApiKey"];
        }

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
            if (file.Length > MaxFileSizeBytes)
                return BadRequest("Bestand is te groot. Maximaal toegestaan is 10 MB.");

            if (file == null || file.Length == 0)
                return BadRequest("Geen bestand geüpload.");

            if (file.ContentType != "application/pdf" || Path.GetExtension(file.FileName).ToLower() != ".pdf")
                return BadRequest("Alleen PDF-bestanden zijn toegestaan.");

            byte[] fileBytes;
            using (var ms = new MemoryStream())
            {
                await file.CopyToAsync(ms);
                fileBytes = ms.ToArray();
            }

            // -- VIRUS SCAN --
            var virusTotal = new VirusTotal(_virusTotalApiKey);

            // Optioneel: snellere API call zonder opnieuw scannen als bestand al bekend is
            var fileHash = CalculateSHA256(fileBytes);
            var existingScan = await virusTotal.GetFileReportAsync(fileHash);
            if (existingScan.ResponseCode == FileReportResponseCode.Present)
            {
                if (existingScan.Positives > 0)
                    return BadRequest("Virus gevonden in bestaand bestand.");
            }
            else
            {
                // Nieuw bestand uploaden
                var scanResult = await virusTotal.ScanFileAsync(new MemoryStream(fileBytes), file.FileName);

                int maxAttempts = 5;
                int delayMs = 2000;
                for (int attempt = 0; attempt < maxAttempts; attempt++)
                {
                    var finalReport = await virusTotal.GetFileReportAsync(scanResult.SHA256);
                    if (finalReport.ResponseCode == FileReportResponseCode.Present)
                    {
                        if (finalReport.Positives > 0)
                            return BadRequest("Virus gevonden in nieuw bestand.");
                        break;
                    }
                    await Task.Delay(delayMs);
                }
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
