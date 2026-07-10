using Microsoft.EntityFrameworkCore;
using WebApplication1.Model;

namespace WebApplication1.Data
{
    public class Appcontext :DbContext
    {
        public Appcontext(DbContextOptions options ) : base(options) { }

        public DbSet<login> logins { get; set; }
        public DbSet<Student> Students { get; set; }
    }
}
