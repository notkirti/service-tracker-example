import { useEffect, useState } from 'react';
import { type Job, JobPriority, JobCategory } from './types'; 
import { fetchJobs, createJob, updateJob, deleteJob } from './services/jobService';

function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Form State
  const [newJob, setNewJob] = useState({ 
    title: '', 
    clientName: '', 
    status: 'Pending',
    priority: JobPriority.Medium as JobPriority,
    category: JobCategory.Maintenance as JobCategory
  });

  // --- 1. DATA LOADING ---
  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    const data = await fetchJobs();
    setJobs(data);
  };

  // --- 2. STATS CALCULATION ---
  const totalJobs = jobs.length;
  const pendingJobs = jobs.filter(j => j.status === 'Pending').length;
  const highPriorityJobs = jobs.filter(j => j.priority === JobPriority.High).length;

  // --- 3. FORM HANDLERS (CREATE & UPDATE) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJob.title || !newJob.clientName) return;

    try {
      if (editingId) {
        // UPDATE MODE
        const jobToUpdate = jobs.find(j => j.id === editingId);
        if (jobToUpdate) {
          // We merge existing job data with the form data
          await updateJob(editingId, { ...jobToUpdate, ...newJob });
        }
      } else {
        // CREATE MODE
        await createJob(newJob);
      }
      
      resetForm();
      loadJobs();
    } catch (error) {
      console.error("Operation failed:", error);
      alert("Failed to save job. Check console.");
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setNewJob({ 
        title: '', 
        clientName: '', 
        status: 'Pending', 
        priority: JobPriority.Medium as JobPriority, 
        category: JobCategory.Maintenance as JobCategory 
    });
  };

  const startEditing = (job: Job) => {
    setEditingId(job.id);
    setNewJob({
      title: job.title,
      clientName: job.clientName,
      status: job.status,
      priority: job.priority,
      category: job.category
    });
    // Scroll to top for better UX
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- 4. ACTION HANDLERS ---
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

  // --- 5. STYLE HELPERS ---
  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'Medium': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Low': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default: return 'bg-slate-700 text-slate-300';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-slate-200 font-sans">
      
      {/* --- HEADER --- */}
      <header className="sticky top-0 z-10 bg-slate-800 border-b border-slate-700 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/30">
              S
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              Service Tracker <span className="text-indigo-400 font-light">Pro</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400">Admin View ᓚᘏᗢ</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        
        {/* --- STATS ROW --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-sm">
            <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Total Jobs</p>
            <p className="text-3xl font-bold text-white mt-1">{totalJobs}</p>
          </div>
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-sm">
            <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Pending Actions</p>
            <p className="text-3xl font-bold text-amber-400 mt-1">{pendingJobs}</p>
          </div>
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-sm">
            <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">High Priority</p>
            <p className="text-3xl font-bold text-red-400 mt-1">{highPriorityJobs}</p>
          </div>
        </div>

        {/* --- INPUT FORM --- */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              {editingId ? '✏️ Edit Job Details' : '➕ New Job Entry'}
            </h2>
            {editingId && (
              <span className="text-xs text-amber-400 bg-amber-400/10 px-2 py-1 rounded border border-amber-400/20">
                Editing Mode Active
              </span>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <input
              type="text"
              placeholder="Job Title"
              className="border border-slate-600 bg-slate-900 text-white p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition placeholder-slate-500"
              value={newJob.title}
              onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
            />
            <input
              type="text"
              placeholder="Client Name"
              className="border border-slate-600 bg-slate-900 text-white p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition placeholder-slate-500"
              value={newJob.clientName}
              onChange={(e) => setNewJob({ ...newJob, clientName: e.target.value })}
            />
            
            <select 
              className="border border-slate-600 bg-slate-900 text-white p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition appearance-none"
              value={newJob.category}
              onChange={(e) => setNewJob({ ...newJob, category: e.target.value as JobCategory })}
            >
              {Object.values(JobCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>

            <select 
              className="border border-slate-600 bg-slate-900 text-white p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition appearance-none"
              value={newJob.priority}
              onChange={(e) => setNewJob({ ...newJob, priority: e.target.value as JobPriority })}
            >
              {Object.values(JobPriority).map(prio => <option key={prio} value={prio}>{prio}</option>)}
            </select>

            <div className="flex gap-2">
              <button 
                type="submit" 
                className={`flex-1 font-bold rounded-lg transition text-white shadow-lg ${
                  editingId 
                    ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-900/20' 
                    : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-900/20'
                }`}
              >
                {editingId ? 'Update' : 'Add Job'}
              </button>
              
              {editingId && (
                <button 
                  type="button"
                  onClick={resetForm}
                  className="px-3 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg border border-slate-600 transition"
                  title="Cancel Edit"
                >
                  ✕
                </button>
              )}
            </div>
          </form>
        </div>

        {/* --- JOB LIST TABLE --- */}
        <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/50 border-b border-slate-700">
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Job Details</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Category</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Priority</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-slate-700/30 transition group">
                  <td className="p-4">
                    <div className="font-medium text-slate-200">{job.title}</div>
                    <div className="text-xs text-slate-500 mt-1 group-hover:text-slate-400 transition">{job.clientName}</div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-slate-400 bg-slate-900/50 px-2 py-1 rounded border border-slate-700">
                      {job.category}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold border ${getPriorityStyle(job.priority)}`}>
                      {job.priority}
                    </span>
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => toggleStatus(job)}
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase transition border ${
                        job.status === 'Completed' 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20' 
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20'
                      }`}
                    >
                      {job.status}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-3 items-center">
                      <button 
                        onClick={() => startEditing(job)}
                        className="text-indigo-400 hover:text-indigo-300 font-medium text-sm transition"
                      >
                        Edit
                      </button>
                      <div className="w-px h-4 bg-slate-700"></div>
                      <button 
                        onClick={() => handleDelete(job.id)}
                        className="text-slate-500 hover:text-red-400 font-medium text-sm transition"
                      >
                        Archive
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {jobs.length === 0 && (
            <div className="p-12 text-center">
              <div className="text-slate-600 text-lg mb-2">No active jobs found</div>
              <p className="text-slate-500 text-sm">Get started by adding a new service request above.</p>
            </div>
          )}
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="border-t border-slate-800 mt-auto py-6 bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Service Tracker Pro</p>
          <p className="mt-2 text-xs text-slate-600">Authorized Personnel Only ₍^. .^₎⟆</p>
        </div>
      </footer>

    </div>
  );
}

export default App;