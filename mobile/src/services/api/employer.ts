import { apiClient } from './client';

export const employerService = {
  postJob: async (jobData: any) => {
    const response = await apiClient.post('/jobs', jobData);
    return response.data;
  },
  
  getMyJobs: async () => {
    const response = await apiClient.get('/employer/jobs');
    return response.data;
  },

  getJobApplications: async (jobId: string) => {
    const response = await apiClient.get(`/employer/jobs/${jobId}/applications`);
    return response.data;
  },
};
