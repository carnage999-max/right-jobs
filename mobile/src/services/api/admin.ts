import { apiClient } from './client';

export const adminService = {
  getStats: async () => {
    const response = await apiClient.get('/admin/dashboard');
    return response.data;
  },
  
  getUsers: async (params?: { search?: string; role?: string }) => {
    const response = await apiClient.get('/admin/users', { params });
    return response.data;
  },

  actionUser: async (userId: string, action: string) => {
    const response = await apiClient.post(`/admin/users/${userId}/action`, { action });
    return response.data;
  },
  
  getVerifications: async () => {
    const response = await apiClient.get('/admin/verifications');
    return response.data;
  },
  
  decideVerification: async (id: string, decision: 'approve' | 'reject', reason?: string) => {
    const response = await apiClient.post(`/admin/verifications/${id}`, { decision, reason });
    return response.data;
  },

  getReviews: async (params?: { page?: number; limit?: number }) => {
    const response = await apiClient.get('/admin/reviews', { params });
    return response.data;
  },

  actionReview: async (id: string, action: 'delete' | 'flag') => {
    const response = await apiClient.post(`/admin/reviews/${id}/action`, { action });
    return response.data;
  },

  sendBroadcast: async (data: { subject: string, content: string, target: 'ALL' | 'JOB_SEEKERS' | 'ADMINS' }) => {
    const response = await apiClient.post('/admin/notifications/broadcast', data);
    return response.data;
  },

  getAuditLogs: async () => {
    const response = await apiClient.get('/admin/audit-logs');
    return response.data;
  },

  getCharts: async () => {
    const response = await apiClient.get('/admin/charts');
    return response.data;
  },

  getPayments: async () => {
    const response = await apiClient.get('/admin/payments');
    return response.data;
  },
};
