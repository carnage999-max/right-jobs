import { apiClient } from './client';

export interface Job {
  id: string;
  title: string;
  companyName: string;
  companyLogoUrl?: string;
  location: string;
  salaryRange?: string;
  salaryType?: string;
  description: string;
  createdAt: string;
  type: string;
  workMode: string;
  category: string;
  officeImageUrl?: string;
  contractDuration?: string;
  phoneNumber?: string;
  benefits?: string;
  requirements?: string;
  createdBy?: {
    name?: string;
    email?: string;
    avatarUrl?: string;
    idVerification?: {
      status?: string;
    };
  };
}

export const jobsService = {
  getJobs: async (params?: { search?: string; location?: string; category?: string; page?: number }) => {
    try {
      const response = await apiClient.get<{ ok: boolean; jobs: Job[] }>('/jobs', { params });
      // Handle both direct array return and object with jobs property
      if (Array.isArray(response.data)) {
        return response.data;
      }
      return response.data?.jobs || [];
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      return [];
    }
  },
  
  getJobDetails: async (id: string) => {
    try {
      const response = await apiClient.get<{ ok: boolean; job: Job }>(`/jobs/${id}`);
      return response.data?.job || response.data;
    } catch (error) {
      console.error('Failed to fetch job details:', error);
      throw error;
    }
  },

  getSavedJobs: async () => {
    try {
      const response = await apiClient.get<{ ok: boolean; jobs: Job[] }>('/saved-jobs');
      return response.data?.jobs || [];
    } catch (error) {
      console.error('Failed to fetch saved jobs:', error);
      return [];
    }
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
