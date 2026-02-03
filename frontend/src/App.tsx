import { useEffect, useState } from 'react';
import axios from 'axios';
import type { Job } from './types';

function App() {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    // This calls your C# API
    axios.get<Job[]>('http://localhost:5160/api/job')
      .then(res => setJobs(res.data))
      .catch(err => console.error("API Connection Error:", err));
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Service Tracker Dashboard</h1>
      <table border={1} style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#eee' }}>
            <th>ID</th>
            <th>Job Title</th>
            <th>Client</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {jobs.length > 0 ? jobs.map(j => (
            <tr key={j.id}>
              <td>{j.id}</td>
              <td>{j.title}</td>
              <td>{j.clientName}</td>
              <td>{j.status}</td>
            </tr>
          )) : (
            <tr><td colSpan={4}>No jobs found. API is connected but database is empty!</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;