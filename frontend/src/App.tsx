import { useEffect, useState } from 'react';
import { type Job, JobPriority, JobCategory } from './types'; 
import { fetchJobs, createJob, updateJob, deleteJob } from './services/jobService';

function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  
  const [newJob, setNewJob] = useState({ 
    title: '', 
    clientName: '', 
    status: 'Pending',
    priority: JobPriority.Medium as JobPriority,
    category: JobCategory.Maintenance as JobCategory
  });

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    const data = await fetchJobs();
    setJobs(data);
  };

  const handleAddJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJob.title || !newJob.clientName) return;
    
    await createJob(newJob);
    setNewJob({ 
        title: '', 
        clientName: '', 
        status: 'Pending', 
        priority: JobPriority.Medium, 
        category: JobCategory.Maintenance 
    }); 
    loadJobs();
  };

  const toggleStatus = async (job: Job) => {
    const newStatus = job.status === 'Pending' ? 'Completed' : 'Pending';
    await updateJob(job.id, { ...job, status: newStatus });
    loadJobs();
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to archive this job?')) {
      await deleteJob(id);
      loadJobs();
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-700 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8">
          Service Tracker <span className="text-blue-600">Pro</span>
        </h1>

        {/* --- ENHANCED FORM --- */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-10 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-700 mb-4">➕ New Job Entry</h2>
          <form onSubmit={handleAddJob} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <input
              type="text"
              placeholder="Job Title"
              className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={newJob.title}
              onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
            />
            <input
              type="text"
              placeholder="Client Name"
              className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={newJob.clientName}
              onChange={(e) => setNewJob({ ...newJob, clientName: e.target.value })}
            />
            
            {/* Category Dropdown */}
            <select 
              className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={newJob.category}
              onChange={(e) => setNewJob({ ...newJob, category: e.target.value as JobCategory })}
            >
              {Object.values(JobCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>

            {/* Priority Dropdown */}
            <select 
              className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={newJob.priority}
              onChange={(e) => setNewJob({ ...newJob, priority: e.target.value as JobPriority })}
            >
              {Object.values(JobPriority).map(prio => <option key={prio} value={prio}>{prio}</option>)}
            </select>

            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition">
              Add Job
            </button>
          </form>
        </div>

        {/* --- ENHANCED JOB LIST --- */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Job Title</th>
                <th className="p-4 font-semibold text-gray-600">Category</th>
                <th className="p-4 font-semibold text-gray-600">Priority</th>
                <th className="p-4 font-semibold text-gray-600">Status</th>
                <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-blue-50 transition">
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{job.title}</div>
                    <div className="text-xs text-gray-400">{job.clientName}</div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">{job.category}</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold border ${getPriorityStyle(job.priority)}`}>
                      {job.priority}
                    </span>
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => toggleStatus(job)}
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase transition ${
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
                      className="text-red-400 hover:text-red-600 font-medium text-sm"
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
              No active jobs. Build something great!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;