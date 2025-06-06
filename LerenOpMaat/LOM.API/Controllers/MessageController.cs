﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LOM.API.DAL;
using LOM.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.RateLimiting;
using LOM.API.Controllers.Base;
using System.Text.RegularExpressions;

namespace LOM.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class MessageController : LOMBaseController
    {

        public MessageController(LOMContext context) : base(context) { }

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
                return NotFound();
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
        [EnableRateLimiting("MessageLimiter")]
        public async Task<IActionResult> PutMessage(int id, Message message)
        {
            if (id != message.Id)
            {
                return BadRequest();
            }

            if (!MessageExists(id))
            {
                return NotFound();
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
        [EnableRateLimiting("MessageLimiter")]
        public async Task<ActionResult<Message>> PostMessage(Message message)
        {
            // Alleen standaard tekens toestaan (geen emoji's)
            if (!string.IsNullOrWhiteSpace(message.Commentary))
            {
                // Alleen ASCII-tekens toestaan (verwijdert emoji's en andere niet-standaard tekens)
                message.Commentary = Regex.Replace(
                    message.Commentary,
                    @"[^\u0000-\u007F]+",
                    string.Empty
                ).Trim();
            }

            if (string.IsNullOrWhiteSpace(message.Commentary))
            {
                return BadRequest("Commentaar mag niet leeg zijn of alleen uit emoji's bestaan.");
            }

            if (message.Commentary.Length > 250)
            {
                return BadRequest("Commentaar mag maximaal 250 tekens bevatten.");
            }

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
        [EnableRateLimiting("MessageLimiter")]
        public async Task<IActionResult> DeleteMessage(int id)
        {
            var message = await _context.Messages.FindAsync(id);
            if (message == null)
            {
                return NotFound();
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
                return Unauthorized();
            }

            var messages = await _context.Messages
                .Include(u => u.User)
                .Include(u => u.Conversation.Teacher)
                .Where(s => s.ConversationId == id && (s.User == user || s.Conversation.Teacher == user))
                .ToListAsync();

            if (messages == null)
            {
                return NotFound();
            }

            return messages;
        }

        private bool MessageExists(int id)
        {
            return _context.Messages.Any(e => e.Id == id);
        }
    }
}
