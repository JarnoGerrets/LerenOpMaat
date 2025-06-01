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
        [HttpPut("upload")]
        public async Task<IActionResult> UploadOer(IFormFile file)
        {
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



        [HttpGet("current")]
        public async Task<IActionResult> GetCurrentOer()
        {
            var oer = await _context.Oers.FindAsync(1);

            if (oer == null)
                return NotFound("Geen OER gevonden.");

            var fileBytes = Convert.FromBase64String(oer.Base64PDF);
            var stream = new MemoryStream(fileBytes);

            return File(stream, "application/pdf", enableRangeProcessing: true);
        }

    }
}
