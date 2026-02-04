using Microsoft.EntityFrameworkCore;
using ServiceTrackerExample.Models;

namespace ServiceTrackerExample.DataServices
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
                entity.Property(e => e.CreatedAt)
                    .HasDefaultValueSql("GETUTCDATE()");

                entity.Property(e => e.IsDeleted)
                    .HasDefaultValue(false);

                entity.Property(e => e.Priority)
                    .HasConversion<string>();

                entity.Property(e => e.Category)
                    .HasConversion<string>();
            });
        }
    }
}
