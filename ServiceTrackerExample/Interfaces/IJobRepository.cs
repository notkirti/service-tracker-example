using ServiceTrackerExample.Models;

namespace ServiceTrackerExample.Interfaces
{
    public interface IJobRepository
    {
        Task<IEnumerable<Job>> GetAllAsync();
        Task<Job?> GetByIdAsync(int id);
        Task<Job> AddAsync(Job job);
        Task UpdateAsync(Job job);
        Task DeleteAsync(int id);
    }
}
