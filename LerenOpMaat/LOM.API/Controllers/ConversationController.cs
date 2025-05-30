using LOM.API.DAL;
using LOM.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace LOM.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ConversationController : ControllerBase
    {
        private readonly LOMContext _context;

        public ConversationController(LOMContext context)
        {
            _context = context;
        }

        // GET: api/Conversation
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Conversation>>> GetConversations()
        {
            return await _context.Conversations.ToListAsync();
        }

        // GET: api/Conversation/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Conversation>> GetConversation(int id)
        {
            var conversation = await _context.Conversations.FindAsync(id);

            if (conversation == null)
            {
                return NotFound();
            }

            return conversation;
        }

        // PUT: api/Conversation/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutConversation(int id, Conversation conversation)
        {
            if (id != conversation.Id)
            {
                return BadRequest();
            }

            // Get the current user from the session (claims)
            var externalId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(externalId))
            {
                return Unauthorized(new { message = "User is authenticated but not found in the database." });
            }

            var user = await _context.User
                .Include(u => u.LearningRoute)
                .FirstOrDefaultAsync(u => u.ExternalID == externalId);

            if (user == null)
            {
                return Unauthorized();
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
            existingConversation.LearningRouteId = user.LearningRouteId ?? 0;

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

        // POST: api/Conversation
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Conversation>> PostConversation(Conversation conversation)
        {
            var externalId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(externalId))
            {
                return Unauthorized();
            }

            var user = await _context.User
                .Include(u => u.LearningRoute)
                .FirstOrDefaultAsync(u => u.ExternalID == externalId);

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

        // DELETE: api/Conversation/5
        [HttpDelete("{id}")]
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

        [HttpGet("conversationByStudentId/{userId}")]
        public async Task<ActionResult<Conversation>> getConversationByStudentId(int userId)
        {
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

        [HttpGet("conversationByAdministratorId/{administratorId}")]
        public async Task<ActionResult<IEnumerable<Conversation>>> getConversationsByAdministratorId(int administratorId)
        {
            // Haal alle conversations op waar de admin als Teacher gekoppeld is
            var conversations = await _context.Conversations
                .Include(c => c.Student)
                .Include(c => c.Teacher)
                .Include(c => c.LearningRoute)
                .ThenInclude(s => s.Semesters)
                .ThenInclude(m => m.Module)
                .Where(c => c.TeacherId == administratorId)
                .ToListAsync();

            return conversations;
        }
        private bool ConversationExists(int id)
        {
            return _context.Conversations.Any(e => e.Id == id);
        }

        [HttpGet("notifications/{id}")]
        public async Task<ActionResult> GetNotificationsByUserId(int id)
        {
            var unreadMessages = await _context.Messages
                .Include(m => m.Conversation)
                    .ThenInclude(c => c.LearningRoute)
                .Include(m => m.Conversation.Student)
                .Include(m => m.Conversation.Teacher)
                .Where(m => m.IsRead == false
                    && m.UserId != id
                    && m.Conversation != null
                    && (
                        m.Conversation.StudentId == id ||
                        m.Conversation.TeacherId == id
                    ))
                .ToListAsync();


            return Ok(unreadMessages);
        }

        [HttpPatch("notifications/markasread")]
        public async Task<IActionResult> MarkMessagesAsRead([FromBody] MarkAsReadRequestDto request)
        {
            var messages = await _context.Messages
                .Where(m => m.ConversationId == request.ConversationId
                            && m.UserId != request.UserId
                            && !m.IsRead)
                .ToListAsync();

            foreach (var msg in messages)
            {
                msg.IsRead = true;
            }

            await _context.SaveChangesAsync();

            return NoContent();
        }

    }
}
