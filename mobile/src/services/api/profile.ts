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
  },
  // Get presigned URL for file uploads to S3
  getPresignedUrl: async (filename: string, contentType: string, folder: 'avatars' | 'resumes') => {
    const response = await apiClient.post('/upload/presign', {
      filename,
      contentType,
      folder
    });
    return response.data;
  },
  // Update resume filename
  updateResumeFilename: async (resumeFilename: string) => {
    const response = await apiClient.patch('/profile', { resumeFilename });
    return response.data;
  },
  // Request password reset
  requestPasswordReset: async () => {
    const response = await apiClient.post('/auth/forgot-password', {});
    return response.data;
  }
};
