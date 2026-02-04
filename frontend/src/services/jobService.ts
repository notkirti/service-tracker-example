import axios from 'axios';
import type { Job } from '../types';

const API_URL = 'http://localhost:5160/api/job';

// 1. GET ALL
export const fetchJobs = async (): Promise<Job[]> => {
    const response = await axios.get(API_URL);
    return response.data;
};

// 2. CREATE (POST)
export const createJob = async (job: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>): Promise<Job> => {
    const response = await axios.post(API_URL, job);
    return response.data;
};

// 3. UPDATE (PUT) - For changing status
export const updateJob = async (id: number, job: Job): Promise<void> => {
    await axios.put(`${API_URL}/${id}`, job);
};

// 4. DELETE (The Soft Delete)
export const deleteJob = async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
};