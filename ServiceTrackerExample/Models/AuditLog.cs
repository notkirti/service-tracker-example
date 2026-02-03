using System.ComponentModel.DataAnnotations;

namespace ServiceTrackerExample.Models
{
    public class AuditLog
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string EntityName { get; set; } = string.Empty;
        
        [Required]
        public int EntityId { get; set; }
        
        [Required]
        [MaxLength(20)]
        public string Action { get; set; } = string.Empty; // "Created", "Updated", "Deleted"
        
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
        
        [MaxLength(200)]
        public string? UserId { get; set; }
        
        // Store the old and new values as JSON
        public string? OldValues { get; set; }
        public string? NewValues { get; set; }
        
        [MaxLength(500)]
        public string? Changes { get; set; } // Summary of what changed
    }
}
