using Microsoft.AspNetCore.SignalR;
using SignalR_Study.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SignalR_Study.Hubs
{
    public class MessageHub : Hub
    {
        public static List<ChatUser> _users = new List<ChatUser>();

        public string GetConnectionId()
        {
            return Context.ConnectionId;
        }

        public async Task SendMessage(Message message)
        {
            await Clients.All.SendAsync("MessageReceived", message);
        }

        public async Task SendSystemMessage(Message message)
        {
            await Clients.Others.SendAsync("MessageReceived", message);
        }

        public async Task AddUser(string name)
        {
            var connectionId = GetConnectionId();
            var user = new ChatUser
            {
                ConnectionId = connectionId,
                Name = name
            };

            if (_users.Any(x => x.ConnectionId == connectionId))
            {
                return;
            }
            
            _users.Add(user);

            await SendUserListChanged();

            return;
        }

        public async Task RemoveUser()
        {
            var connectionId = GetConnectionId();
            var user = _users.FirstOrDefault(x => x.ConnectionId == connectionId);
            if (user == null)
            {
                return;
            }

            _users.Remove(user);

            await SendUserListChanged();
        }

        private async Task SendUserListChanged()
        {
            await Clients.All.SendAsync("UserListChanged", _users);
        }
    }
}
