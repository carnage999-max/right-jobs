import { apiClient } from './client';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  description: string;
  createdAt: string;
  type: string;
}

export const jobsService = {
  getJobs: async (params?: { search?: string; location?: string; category?: string; page?: number }) => {
    const response = await apiClient.get<Job[]>('/jobs', { params });
    return response.data;
  },
  
  getJobDetails: async (id: string) => {
    const response = await apiClient.get<Job>(`/jobs/${id}`);
    return response.data;
  },
  
  applyForJob: async (jobId: string, applicationData: any) => {
    const response = await apiClient.post(`/applications`, { jobId, ...applicationData });
    return response.data;
  },
  
  saveJob: async (jobId: string) => {
    const response = await apiClient.post(`/jobs/${jobId}/save`);
    return response.data;
  },
  
  unsaveJob: async (jobId: string) => {
    const response = await apiClient.delete(`/jobs/${jobId}/save`);
    return response.data;
  },
};
