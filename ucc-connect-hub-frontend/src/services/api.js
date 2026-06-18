// src/services/api.js
import axios from 'axios';

// Use relative URL with proxy for development
const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor - Add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('📤 API Request:', config.method.toUpperCase(), config.url);
    if (config.data) {
      console.log('📤 Request data:', config.data);
    }
    return config;
  },
  (error) => {
    console.error('📤 Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - ✅ FIX: Added JSON parse check
api.interceptors.response.use(
  (response) => {
    console.log('📥 API Response:', response.status, response.config.url);
    console.log('📥 Response data:', response.data);
    console.log('📥 Response data type:', typeof response.data);
    
    // ✅ FIX: If response.data is a string, try to parse it as JSON
    if (typeof response.data === 'string') {
      try {
        response.data = JSON.parse(response.data);
        console.log('📥 Parsed response data from string:', response.data);
      } catch (e) {
        console.error('📥 Failed to parse response string:', e);
        console.error('📥 Raw string:', response.data.substring(0, 200));
      }
    }
    
    return response;
  },
  (error) => {
    console.error('📥 API Error:', error.response?.status, error.response?.data);
    
    if (error.response?.status === 401) {
      // Only clear token and redirect if not on login page
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;