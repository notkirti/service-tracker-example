using Microsoft.EntityFrameworkCore;
using ServiceTrackerExample.Models;

namespace ServiceTrackerExample.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<Job> Jobs { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Job>(entity =>
            {
                // Configure CreatedAt to have a default value in the database
                entity.Property(e => e.CreatedAt)
                    .HasDefaultValueSql("GETUTCDATE()");

                // Configure IsDeleted to have a default value of false
                entity.Property(e => e.IsDeleted)
                    .HasDefaultValue(false);
            });
        }
    }
}