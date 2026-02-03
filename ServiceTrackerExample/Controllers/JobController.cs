using Microsoft.AspNetCore.Mvc;
using ServiceTrackerExample.Interfaces;
using ServiceTrackerExample.Models;

namespace ServiceTrackerExample.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class JobController : ControllerBase
    {
        private readonly IJobRepository _jobRepository;

        public JobController(IJobRepository jobRepository)
        {
            _jobRepository = jobRepository;
        }

        // GET: api/job
        [HttpGet]
        public async Task<IActionResult> GetJobs()
        {
            var jobs = await _jobRepository.GetAllAsync();
            return Ok(jobs);
        }

        // GET: api/job/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetJob(int id)
        {
            var job = await _jobRepository.GetByIdAsync(id);
            if (job == null) return NotFound();
            return Ok(job);
        }

        // POST: api/job
        [HttpPost]
        public async Task<IActionResult> CreateJob([FromBody] Job job)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            
            var createdJob = await _jobRepository.AddAsync(job);
            return CreatedAtAction(nameof(GetJob), new { id = createdJob.Id }, createdJob);
        }

        // PUT: api/job/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateJob(int id, [FromBody] Job job)
        {
            if (id != job.Id) return BadRequest();

            var existingJob = await _jobRepository.GetByIdAsync(id);
            if (existingJob == null) return NotFound();

            try
            {
                await _jobRepository.UpdateAsync(job);
            }
            catch
            {
                return NotFound();
            }

            return NoContent();
        }

        // DELETE: api/job/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteJob(int id)
        {
            var job = await _jobRepository.GetByIdAsync(id);
            if (job == null) return NotFound();

            await _jobRepository.DeleteAsync(id);
            return NoContent();
        }
    }
}