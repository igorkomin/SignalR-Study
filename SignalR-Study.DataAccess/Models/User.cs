using Microsoft.AspNetCore.Identity;

namespace SignalR_Study.DataAccess.Models
{
    public class User : IdentityUser
    {
        public string DisplayName { get; set; }
    }
}
