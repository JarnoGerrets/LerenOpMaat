using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LOM.API.DAL;
using LOM.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.RateLimiting;
using LOM.API.Controllers.Base;

namespace LOM.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class MessageController : LOMBaseController
    {

        public MessageController(LOMContext context) : base(context) {}

        /// <summary>
        /// Alle messages ophalen
        /// </summary>
        /// <returns>Lijst met message models</returns>
        [HttpGet]
        [EnableRateLimiting("GetLimiter")]
        public async Task<ActionResult<IEnumerable<Message>>> GetMessages()
        {
            return await _context.Messages.ToListAsync();
        }

        /// <summary>
        /// Specifieke message ophalen
        /// </summary>
        /// <param name="id">ID van de message</param>
        /// <returns>NotFound als er geen message gevonden is</returns>
        /// <returns>Message model</returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<Message>> GetMessage(int id)
        {
            var message = await _context.Messages.FindAsync(id);

            if (message == null)
            {
                return NotFound("Geen bericht niet gevonden.");
            }

            return message;
        }

        /// <summary>
        /// Message updaten
        /// </summary>
        /// <param name="id">ID van de message</param>
        /// <param name="message">Message model met geupdate properties</param>
        /// <see cref="go.microsoft.com/fwlink/?linkid=2123754"/>
        /// <returns>BadRequest als het id niet overeen komt met message model</returns>
        /// <returns>NotFound als er geen message gevonden is</returns>
        /// <returns>NoContent als de message successvol opgeslagen is</returns>
        [HttpPut("{id}")]
        [ValidateAntiForgeryToken]
        [EnableRateLimiting("MessageLimiter")]
        public async Task<IActionResult> PutMessage(int id, Message message)
        {
            if (id != message.Id)
            {
                return BadRequest("Id en message.Id komen niet overeen.");
            }
            
            if (!MessageExists(id))
            {
                return NotFound("Geen bericht niet gevonden.");
            }

            _context.Entry(message).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            
            return NoContent();
        }

        /// <summary>
        /// Message opslaan
        /// </summary>
        /// <param name="message">Message model met properties fromBody</param>
        /// <see cref="go.microsoft.com/fwlink/?linkid=2123754"/>
        /// <returns>Created als de message successvol is opgeslagen</returns>
        [HttpPost]
        [ValidateAntiForgeryToken]
        [EnableRateLimiting("MessageLimiter")]
        public async Task<ActionResult<Message>> PostMessage(Message message)
        {
            _context.Messages.Add(message);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetMessage", new { id = message.Id }, message);
        }

        /// <summary>
        /// Een message verwijderen
        /// </summary>
        /// <param name="id">ID van de message om te verwijderen</param>
        /// <see cref="go.microsoft.com/fwlink/?linkid=2123754"/>
        /// <returns>NotFound als de message niet gevonden is</returns>
        /// <returns>NoContent als de message met success is verwijderd</returns>
        [HttpDelete("{id}")]
        [ValidateAntiForgeryToken]
        [EnableRateLimiting("MessageLimiter")]
        public async Task<IActionResult> DeleteMessage(int id)
        {
            var message = await _context.Messages.FindAsync(id);
            if (message == null)
            {
                return NotFound("Geen bericht niet gevonden.");
            }

            _context.Messages.Remove(message);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        /// <summary>
        /// Messages ophalen aan de hand van conversatie
        /// </summary>
        /// <param name="id">ID van conversatie</param>
        /// <see cref="go.microsoft.com/fwlink/?linkid=2123754"/>
        /// <returns>Unauthorized als de gebruiker niet gevonden is</returns>
        /// <returns>NotFound als er geen messages gevonden zijn</returns>
        /// <returns>Lijst met message models</returns>
        [HttpGet("messagesByConversationId/{id}")]
        [EnableRateLimiting("GetLimiter")]
        public async Task<ActionResult<IEnumerable<Message>>> GetMessagesByConversationId(int id)
        {
            User? user = GetActiveUser();

            if (user == null)
            {
                return Unauthorized("Gebruiker niet ingelogd.");
            }

            var messages = await _context.Messages
                .Include(u => u.User)
                .Include(u => u.Conversation.Teacher)
                .Where(s => s.ConversationId == id && (s.User == user || s.Conversation.Teacher == user))
                .ToListAsync();

            if (messages == null)
            {
                return NotFound("Geen bericht niet gevonden.");
            }

            return messages;
        }

        private bool MessageExists(int id)
        {
            return _context.Messages.Any(e => e.Id == id);
        }
    }
}
