using LOM.API.Controllers.Base;
using LOM.API.DAL;
using LOM.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;

namespace LOM.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ConversationController : LOMBaseController
    {

        public ConversationController(LOMContext context) : base(context) { }

        /// <summary>
        /// Haal alle conversatie tussen docent en student op
        /// </summary>
        /// <returns>Lijst met conversatie models</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Conversation>>> GetConversations()
        {
            return await _context.Conversations.ToListAsync();
        }

        /// <summary>
        /// Haal alle conversatie tussen docent en student op
        /// </summary>
        /// <param name="id">ID van conversatie</param>
        /// <returns>Notfound of Conversatie model</returns>
        [HttpGet("{id}")]
        [EnableRateLimiting("GetLimiter")]
        public async Task<ActionResult<Conversation>> GetConversation(int id)
        {
            var conversation = await _context.Conversations.FindAsync(id);

            if (conversation == null)
            {
                return NotFound();
            }

            return conversation;
        }

        /// <summary>
        /// Een conversatie updaten
        /// </summary>
        /// <param name="id">ID Van de conversatie</param>
        /// <param name="conversation">Geupdate velden</param>
        /// <see cref="go.microsoft.com/fwlink/?linkid=2123754"/>
        /// <returns>BadRequest als geupdate veld id niet overeenkomt</returns>
        /// <returns>Unauthorized als de gebruiker niet gevonden is</returns>
        /// <returns>NotFound als de conversatie niet gevonden is a.d.h id parameter</returns>
        /// <returns>NoContent als de conversatie met success is opgeslagen</returns>
        [HttpPut("{id}")]
        [EnableRateLimiting("MessageLimiter")]
        public async Task<IActionResult> PutConversation(int id, Conversation conversation)
        {
            if (id != conversation.Id)
            {
                return BadRequest();
            }

            User? user = GetActiveUser();

            // Get the current user from the session
            if (user == null)
            {
                return Unauthorized(new { message = "User not found in the database." });
            }

            // Fetch the existing conversation from the database
            var existingConversation = await _context.Conversations.FindAsync(id);
            if (existingConversation == null)
            {
                return NotFound();
            }

            // Update only TeacherId
            existingConversation.TeacherId = conversation.TeacherId;

            // Always set the LearningRouteId from the user, not from the client
            user.LearningRouteId = existingConversation.LearningRouteId;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ConversationExists(id))
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

        /// <summary>
        /// Een nieuwe conversatie aanmaken
        /// </summary>
        /// <param name="conversation">Conversatie model wat aangemaakt moet worden</param>
        /// <see cref="go.microsoft.com/fwlink/?linkid=2123754"/>
        /// <returns>Unautorized als de gebruiker niet gevonden is</returns>
        /// <returns>Conversatie model als de conversatie met success is opgeslagen in de database</returns>
        [HttpPost]
        [EnableRateLimiting("PostLimiter")]
        public async Task<ActionResult<Conversation>> PostConversation(Conversation conversation)
        {
            User? user = GetActiveUser();

            if (user == null)
            {
                return Unauthorized();
            }

            conversation.StudentId = user.Id;
            conversation.LearningRouteId = user.LearningRouteId ?? 0;

            _context.Conversations.Add(conversation);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetConversation", new { id = conversation.Id }, conversation);
        }

        /// <summary>
        /// Een conversatie verwijderen
        /// </summary>
        /// <param name="id">ID van de conversatie om te verwijderen</param>
        /// <returns>NotFound als de conversatie niet gevonden is</returns>
        /// <returns>NotContent als de conversatie met success is verwijderd</returns>
        [HttpDelete("{id}")]
        [EnableRateLimiting("DeleteLimiter")]
        public async Task<IActionResult> DeleteConversation(int id)
        {
            var conversation = await _context.Conversations.FindAsync(id);
            if (conversation == null)
            {
                return NotFound();
            }

            _context.Conversations.Remove(conversation);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        /// <summary>
        /// Krijg alle conversaties + leraar + leerroute + student
        /// </summary>
        /// <returns>Unauthorized als er geen gebruiker ingelogd is.</returns>
        /// <returns>NotFound als er geen conversatie</returns>
        /// <returns>Conversatie model</returns>
        [HttpGet("conversationByStudentId/{userId}")]
        [EnableRateLimiting("GetLimiter")]
        public async Task<ActionResult<Conversation>> GetConversationByStudentId(int userId)
        {
            User? user = GetActiveUser();

            if (user == null)
            {
                return Unauthorized();
            }

            var conversation = await _context.Conversations
                .Include(t => t.Teacher)
                .Include(lr => lr.LearningRoute)
                .Include(s => s.Student)
                .FirstOrDefaultAsync(s => s.StudentId == userId);
            if (conversation == null)
            {
                return NotFound();
            }

            return conversation;
        }

        /// <summary>
        /// Krijg alle conversaties + leraar + leerroute + student + semester + module
        /// </summary>
        /// <returns>Unauthorized als er geen gebruiker ingelogd is.</returns>
        /// <returns>NotFound als er geen conversatie</returns>
        /// <returns>Conversatie model</returns>
        [HttpGet("conversationByAdministratorId")]
        [EnableRateLimiting("GetLimiter")]
        public async Task<ActionResult<IEnumerable<Conversation>>> GetConversationsByAdministratorId()
        {
            User? user = GetActiveUser();

            if (user == null)
            {
                return Unauthorized();
            }

            // Haal alle conversations op waar de admin als Teacher gekoppeld is
            var conversations = await _context.Conversations
                .Include(c => c.Student)
                .Include(c => c.Teacher)
                .Include(c => c.LearningRoute)
                .ThenInclude(s => s.Semesters)
                .ThenInclude(m => m.Module)
                .Where(c => c.TeacherId == user.Id)
                .ToListAsync();

            return conversations;
        }

        /// <summary>
        /// Haal alle ongelezen notificaties op van een gebruiker
        /// </summary>
        /// <returns>Unauthorized als er geen gebruiker ingelogd is.</returns>
        /// <returns>OK Met alle ongelezen notificaties</returns>
        [HttpGet("notifications")]
        [EnableRateLimiting("GetLimiter")]
        public async Task<ActionResult> GetNotificationsByUserId()
        {
            User? user = GetActiveUser();

            if (user == null)
            {
                return Unauthorized();
            }

            var unreadMessages = await _context.Messages
                .Include(m => m.Conversation)
                    .ThenInclude(c => c.LearningRoute)
                .Include(m => m.Conversation.Student)
                .Include(m => m.Conversation.Teacher)
                .Where(m => m.IsRead == false
                    && m.UserId != user.Id
                    && m.Conversation != null
                    && (
                        m.Conversation.StudentId == user.Id ||
                        m.Conversation.TeacherId == user.Id
                    ))
                .ToListAsync();


            return Ok(unreadMessages);
        }

        /// <summary>
        /// Markeer een notificatie als gelezen
        /// </summary>
        /// <param name="request">MarkAsReadRequest from body</param>
        /// <returns>Unauthorized als er geen gebruiker ingelogd is.</returns>
        /// <returns>NoContext als de notificatie successvol is opgeslagen</returns>
        [HttpPatch("notifications/markasread")]
        [EnableRateLimiting("MessageLimiter")]
        public async Task<IActionResult> MarkMessagesAsRead([FromBody] MarkAsReadRequestDto request)
        {
            User? user = GetActiveUser();

            if (user == null)
            {
                return Unauthorized();
            }

            var messages = await _context.Messages
                .Where(m => m.ConversationId == request.ConversationId
                            && m.UserId != user.Id
                            && !m.IsRead)
                .ToListAsync();

            foreach (var msg in messages)
            {
                msg.IsRead = true;
            }

            await _context.SaveChangesAsync();

            return NoContent();
        }

        /// <summary>
        /// Helper method om te checken of een conversatie met id bestaat.
        /// </summary>
        /// <param name="id">ID van conversatie</param>
        /// <returns>True / False</returns>
        private bool ConversationExists(int id)
        {
            return _context.Conversations.Any(e => e.Id == id);
        }
    }
}
