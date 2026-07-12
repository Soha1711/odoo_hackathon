import axios from 'axios';
import { API_BASE_URL } from '../constants/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auto token injector interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ecosphere_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle expired or unauthorized sessions
      if (error.response.status === 401) {
        localStorage.removeItem('ecosphere_token');
        // We can redirect to login if we are in a browser window environment
        if (typeof window !== 'undefined') {
          const currentPath = window.location.pathname;
          if (currentPath !== '/login' && currentPath !== '/register') {
            window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
          }
        }
      }
      return Promise.reject(error.response.data?.error || { message: error.message });
    }
    return Promise.reject({ message: error.message || 'Network error occurred' });
  }
);

export default apiClient;
