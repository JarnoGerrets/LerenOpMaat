using Microsoft.AspNetCore.Mvc;
using LOM.API.DAL;
using LOM.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.RateLimiting;
using LOM.API.Controllers.Base;
using VirusTotalNet;
using VirusTotalNet.Enums;
using System.Security.Cryptography;
using VirusTotalNet.ResponseCodes;

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

        [Authorize(Roles = "Administrator, Lecturer")]
        [HttpPut("upload")]
        [EnableRateLimiting("PostLimiter")]
        public async Task<IActionResult> UploadOer(IFormFile file)
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


        [AllowAnonymous]
        [HttpGet("current")]
        [EnableRateLimiting("GetLimiter")]
        public async Task<IActionResult> GetCurrentOer()
        {
            var oer = await _context.Oers.FindAsync(1);

            if (oer == null)
                return NotFound("Geen OER gevonden.");

            var fileBytes = Convert.FromBase64String(oer.Base64PDF);
            var stream = new MemoryStream(fileBytes);

            return File(stream, "application/pdf", enableRangeProcessing: true);
        }


        private string CalculateSHA256(byte[] file)
        {
            using (var sha256 = SHA256.Create())
            {
                return BitConverter.ToString(sha256.ComputeHash(file)).Replace("-", "").ToLowerInvariant();
            }
        }
    }
}
