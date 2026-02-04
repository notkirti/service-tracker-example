import { useEffect, useState } from 'react';
import type { Job } from './types';
import { fetchJobs, createJob, updateJob, deleteJob } from './services/jobService';

function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [newJob, setNewJob] = useState({ title: '', clientName: '', status: 'Pending' });

  // Load Data on Startup
  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    const data = await fetchJobs();
    setJobs(data);
  };

  // Handle Create (The "Add Job" Button)
  const handleAddJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJob.title || !newJob.clientName) return;
    
    await createJob(newJob);
    setNewJob({ title: '', clientName: '', status: 'Pending' }); // Clear form
    loadJobs(); // Refresh list
  };

  // Handle Status Toggle
  const toggleStatus = async (job: Job) => {
    const newStatus = job.status === 'Pending' ? 'Completed' : 'Pending';
    await updateJob(job.id, { ...job, status: newStatus });
    loadJobs();
  };

  // Handle Delete
  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to archive this job?')) {
      await deleteJob(id);
      loadJobs();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8">
          Service Tracker <span className="text-blue-600">Pro</span>
        </h1>

        {/* --- THIS IS THE FORM YOU WERE MISSING --- */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-10 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-700 mb-4">➕ New Job Entry</h2>
          <form onSubmit={handleAddJob} className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Job Title (e.g. Brake Replacement)"
              className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none"
              value={newJob.title}
              onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
            />
            <input
              type="text"
              placeholder="Client Name"
              className="border border-gray-300 p-3 rounded-lg w-full md:w-1/3 focus:ring-2 focus:ring-blue-500 outline-none"
              value={newJob.clientName}
              onChange={(e) => setNewJob({ ...newJob, clientName: e.target.value })}
            />
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-lg transition">
              Add Job
            </button>
          </form>
        </div>

        {/* JOB LIST */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Job Title</th>
                <th className="p-4 font-semibold text-gray-600">Client</th>
                <th className="p-4 font-semibold text-gray-600">Status</th>
                <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-blue-50 transition">
                  <td className="p-4 font-medium text-gray-900">{job.title}</td>
                  <td className="p-4 text-gray-600">{job.clientName}</td>
                  <td className="p-4">
                    <button 
                      onClick={() => toggleStatus(job)}
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide transition ${
                        job.status === 'Completed' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {job.status}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => handleDelete(job.id)}
                      className="text-red-400 hover:text-red-600 font-medium"
                    >
                      Archive
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {jobs.length === 0 && (
            <div className="p-12 text-center text-gray-400">
              No active jobs. Use the form above to add one!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;