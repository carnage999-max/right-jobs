import { apiClient } from './client';

export const profileService = {
  getProfile: async () => {
    const response = await apiClient.get('/profile');
    return response.data;
  },
  updateProfile: async (data: any) => {
    const response = await apiClient.patch('/profile', data);
    return response.data;
  },
  updateAvatar: async (avatarUrl: string) => {
    const response = await apiClient.patch('/profile/avatar', { avatarUrl });
    return response.data;
  },
  getResumeDownloadUrl: async () => {
    const response = await apiClient.get('/profile/resume-download');
    return response.data;
  }
};
