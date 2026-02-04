using System.ComponentModel.DataAnnotations;
using ServiceTracker.Api.Models.Enums;
namespace ServiceTrackerExample.Models
{
    public class Job
    {
        // primary key
        public int Id { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100)]
        public string ClientName { get; set; } = string.Empty;
        
        public string Status { get; set; } = "Pending"; 
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime? UpdatedAt { get; set; }
        
        public bool IsDeleted { get; set; } = false;

        public JobPriority Priority { get; set; } = JobPriority.Medium;
        
        public JobCategory Category { get; set; } = JobCategory.Maintenance;
    }
}