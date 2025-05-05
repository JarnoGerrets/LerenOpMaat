using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LOM.API.DAL;
using LOM.API.Models;

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

        // GET: api/Oer
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Oer>>> GetOer()
        {
            return await _context.Oer.ToListAsync();
        }

        // GET: api/Oer/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Oer>> GetOer(int id)
        {
            var oer = await _context.Oer.FindAsync(id);

            if (oer == null)
            {
                return NotFound();
            }

            return oer;
        }

        // Beveiliging voor POST en PUT moet nog gemaakt worden
       
        // PUT: api/Oer/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOer(int id, Oer oer)
        {
            if (id != oer.Id)
            {
                return BadRequest();
            }

            _context.Entry(oer).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OerExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Oer
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Oer>> PostOer(Oer oer)
        {
            _context.Oer.Add(oer);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetOer", new { id = oer.Id }, oer);
        }

        // DELETE: api/Oer/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOer(int id)
        {
            var oer = await _context.Oer.FindAsync(id);
            if (oer == null)
            {
                return NotFound();
            }

            _context.Oer.Remove(oer);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool OerExists(int id)
        {
            return _context.Oer.Any(e => e.Id == id);
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadOer(IFormFile file)
        {
            var userIdString = Request.Form["userId"];
            if (!int.TryParse(userIdString, out int userId))
                return BadRequest("Ongeldig gebruikers-ID.");

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

            var base64String = Convert.ToBase64String(fileBytes);

            var oer = new Oer
            {
                Base64PDF = base64String,
                UploadDate = DateTime.UtcNow,
                UserId = userId
            };

            _context.Oer.Add(oer);
            await _context.SaveChangesAsync();

            return Ok(new { id = oer.Id });
        }


        [HttpGet("current")]
        public async Task<IActionResult> GetCurrentOer()
        {
            var latest = await _context.Oer
                .OrderByDescending(o => o.UploadDate)
                .FirstOrDefaultAsync();

            if (latest == null)
                return NotFound("Geen OER gevonden.");

            var fileBytes = Convert.FromBase64String(latest.Base64PDF);
            var stream = new MemoryStream(fileBytes);

            return File(stream, "application/pdf", enableRangeProcessing: true);
        }
    }
}
