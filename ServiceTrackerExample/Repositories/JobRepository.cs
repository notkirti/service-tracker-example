using Microsoft.EntityFrameworkCore;
using ServiceTrackerExample.DataServices;
using ServiceTrackerExample.Interfaces;
using ServiceTrackerExample.Models;

namespace ServiceTrackerExample.Repositories
{
    public class JobRepository : IJobRepository
    {
        private readonly ApplicationDbContext _context;

        public JobRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Job>> GetAllAsync()
        {
            return await _context.Jobs
                .Where(j => j.IsDeleted == false)
                .OrderByDescending(j => j.Status == "Pending")
                .ThenByDescending(j => j.CreatedAt)
                .ToListAsync();
        }

        public async Task<Job?> GetByIdAsync(int id)
        {
            return await _context.Jobs
                .Where(j => j.Id == id && j.IsDeleted == false)
                .FirstOrDefaultAsync();
        }

        public async Task<Job> AddAsync(Job job)
        {
            // Ensure CreatedAt is set to UTC
            job.CreatedAt = DateTime.UtcNow;
            job.IsDeleted = false;
            
            _context.Jobs.Add(job);
            await _context.SaveChangesAsync();
            return job;
        }

        public async Task UpdateAsync(Job job)
        {
            // Find the existing entity to ensure proper tracking
            var existingJob = await _context.Jobs.FindAsync(job.Id);
            if (existingJob == null)
            {
                throw new InvalidOperationException($"Job with id {job.Id} not found.");
            }

            // Update properties
            existingJob.Title = job.Title;
            existingJob.ClientName = job.ClientName;
            existingJob.Status = job.Status;
            existingJob.UpdatedAt = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var job = await _context.Jobs.FindAsync(id);
            if (job != null)
            {
                // Soft delete: set IsDeleted flag instead of removing
                job.IsDeleted = true;
                job.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }
        }
    }
}
