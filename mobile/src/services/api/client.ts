import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
console.log('[API] Base URL:', API_URL);

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'User-Agent': 'RightJobs-Mobile/1.0',
  },
});

// Add a request interceptor to add the auth token
apiClient.interceptors.request.use(
  async (config) => {
    const fullUrl = `${config.baseURL}${config.url}`;
    console.log(`[API] Request: ${config.method?.toUpperCase()} ${fullUrl}`);
    const token = await SecureStore.getItemAsync('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors like 401 Unauthorized
    if (error.response?.status === 401) {
      // Logic for logout or token refresh could go here
    }
    return Promise.reject(error);
  }
);
