using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LOM.API.DAL;
using LOM.API.Models;
using Microsoft.AspNetCore.Authorization;

namespace LOM.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OerController : ControllerBase
    {
        private readonly LOMContext _context;

        public OerController(LOMContext context)
        {
            _context = context;
        }

        [Authorize(Roles = "Administrator")]
        [HttpPost("upload")]
        public async Task<IActionResult> UploadOer(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("Geen bestand geüpload.");
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

            var base64String = Convert.ToBase64String(fileBytes);

            var oer = new Oer
            {
                Base64PDF = base64String,
                UploadDate = DateTime.UtcNow
            };

            _context.Oers.Add(oer);
            await _context.SaveChangesAsync();

            return Ok(new { id = oer.Id });
        }


        [HttpGet("current")]
        public async Task<IActionResult> GetCurrentOer()
        {
            var latest = await _context.Oers
                .OrderByDescending(o => o.UploadDate)
                .FirstOrDefaultAsync();

            if (latest == null)
            {
                return NotFound("Geen OER gevonden.");
            }
            var fileBytes = Convert.FromBase64String(latest.Base64PDF);
            var stream = new MemoryStream(fileBytes);

            return File(stream, "application/pdf", enableRangeProcessing: true);
        }
    }
}
