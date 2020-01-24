using System;
using System.Collections.Generic;
using System.Text;

namespace SignalR_Study.DataAccess.Models
{
    public class Message
    {
        public string ClientUniqueId { get; set; }
        public string Type { get; set; }
        public string Text { get; set; }
        public DateTime Date { get; set; }
    }
}
