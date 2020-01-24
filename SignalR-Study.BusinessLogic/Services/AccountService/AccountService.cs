using Microsoft.AspNetCore.Identity;
using SignalR_Study.DataAccess.Models;
using SignalR_Study.ViewModels.Login;
using System.Threading.Tasks;

namespace SignalR_Study.BusinessLogic.Services.AccountService
{
    public class AccountService
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;

        public AccountService(UserManager<User> userManager, SignInManager<User> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        public async Task<LoginRequestViewModel>
    }
}
