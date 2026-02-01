using System.ComponentModel.DataAnnotations;

namespace ServiceTrackerExample.Models
{
    public class Job
    {
        // primary key
        public int Id { get; set; }
        
        [Required]
        public string Title { get; set; } = string.Empty;
        
        public string ClientName { get; set; } = string.Empty;
        
        public string Status { get; set; } = "Pending"; 
        
        public DateTime? CreatedDate { get; set; } = DateTime.Now;
    }
}