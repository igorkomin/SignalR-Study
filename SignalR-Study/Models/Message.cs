using System;
using System.Collections.Generic;

namespace SignalR_Study.Models
{
    public class Message
    {
        public string ClientUniqueId { get; set; }
        public string UserName { get; set; }
        public string Type { get; set; }
        public string Text { get; set; }
        public DateTime Date { get; set; }

        public List<ChatUser> Mentions { get; set; } = new List<ChatUser>();
    }
}
