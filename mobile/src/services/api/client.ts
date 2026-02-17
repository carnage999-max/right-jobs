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
  (response) => {
    console.log(`[API] Response: ${response.config.method?.toUpperCase()} ${response.config.url} - Status: ${response.status}`);
    
    // Safety Guard: If we get HTML but expected JSON, it means a middleware redirect happened
    if (typeof response.data === 'string' && response.data.trim().startsWith('<!DOCTYPE html>')) {
      console.error('[API] RECEIVED HTML INSTEAD OF JSON (Check Middleware/URL)');
      return Promise.reject(new Error('The server returned an HTML page instead of JSON data. This usually happens when the API request is redirected to a login page by the server middleware.'));
    }
    
    return response;
  },
  (error) => {
    console.error('[API] Error:', error.response?.status, error.response?.data || error.message);
    // Handle global errors like 401 Unauthorized
    if (error.response?.status === 401) {
      console.error('[API] Unauthorized - token may be invalid or expired');
      // Logic for logout or token refresh could go here
    }
    return Promise.reject(error);
  }
);
