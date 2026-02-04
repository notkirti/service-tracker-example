import axios from 'axios';
import type { Job } from '../types';

const API_URL = 'http://localhost:5160/api/job';

export const fetchJobs = async (): Promise<Job[]> => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const createJob = async (job: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>): Promise<Job> => {
    const response = await axios.post(API_URL, job);
    return response.data;
};

export const updateJob = async (id: number, job: Job): Promise<void> => {
    await axios.put(`${API_URL}/${id}`, job);
};

export const deleteJob = async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
};