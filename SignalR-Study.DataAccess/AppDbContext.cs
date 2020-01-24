using Microsoft.EntityFrameworkCore;
using SignalR_Study.DataAccess.Models;

namespace SignalR_Study.DataAccess
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base (options)
        {
            Database.EnsureCreated();
        }

        public DbSet<User> Users { get; set; }
    }
}
