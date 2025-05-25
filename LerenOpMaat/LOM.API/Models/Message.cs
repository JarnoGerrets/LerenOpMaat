using System.ComponentModel.DataAnnotations.Schema;

namespace LOM.API.Models
{
    public class Message
    {
        public int Id { get; set; }

        public DateTime DateTime { get; set; }
        public string Commentary { get; set; }


        [ForeignKey(nameof(Conversation))]
        public int ConversationId { get; set; }
        public Conversation? Conversation { get; set; }

        [ForeignKey(nameof(User))]
        public int UserId { get; set; }
        public User? User { get; set; }

    }
}
