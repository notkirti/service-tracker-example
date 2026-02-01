using Microsoft.EntityFrameworkCore;
using ServiceTrackerExample.Models;

namespace ServiceTrackerExample.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<Job> Jobs { get; set; }
    }
}