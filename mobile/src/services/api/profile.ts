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

  // Multiple resumes management
  getResumes: async () => {
    try {
      const response = await apiClient.get('/resumes');
      console.log('[Resumes] Get response:', response.data);
      const resumes = response.data?.data || [];
      
      // If no resumes found via new endpoint, try to get from profile (for backward compatibility)
      if (!resumes || resumes.length === 0) {
        const profileResponse = await apiClient.get('/profile');
        const profile = profileResponse.data?.data;
        if (profile?.resumeUrl) {
          // Create a temporary resume object from legacy profile data
          const legacyResume = {
            id: 'legacy-resume',
            url: profile.resumeUrl,
            filename: profile.resumeFilename || 'Resume.pdf',
            isDefault: true,
            createdAt: new Date().toISOString(),
          };
          return [legacyResume];
        }
      }
      return resumes;
    } catch (error) {
      console.error('Failed to fetch resumes:', error);
      return [];
    }
  },

  createResume: async (url: string, filename: string) => {
    const response = await apiClient.post('/resumes', { url, filename });
    return response.data?.data;
  },

  deleteResume: async (id: string) => {
    const response = await apiClient.delete(`/resumes/${id}`);
    return response.data;
  },

  setDefaultResume: async (id: string) => {
    const response = await apiClient.patch(`/resumes/${id}`, { isDefault: true });
    return response.data?.data;
  },

  // Request password reset
  requestPasswordReset: async () => {
    const response = await apiClient.post('/auth/forgot-password', {});
    return response.data;
  }
};
