import axios from 'axios';

// For local dev, the Vite proxy can forward /api to your PHP backend.
// For production on Vercel, set VITE_API_BASE to the Render backend API URL.
// Set VITE_BACKEND_URL to the backend root for static images and uploads.
export const API_BASE = import.meta.env.VITE_API_BASE || '/api';
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost/hostel-finder/backend/';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

// Hostel APIs
export const hostelApi = {
  getAll: (filters = {}) => api.get('/hostels', { params: filters }),
  getFeatured: (limit = 6) => api.get('/featured-hostels', { params: { limit } }),
  getById: (id) => api.get(`/hostels/${id}`),
  create: (formData) => api.post('/add-hostel', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

// Admin APIs
export const adminApi = {
  login: (credentials) => api.post('/admin/login', credentials),
  getAll: () => api.get('/admin/hostels'),
  getStats: () => api.get('/admin/stats'),
  updateStatus: (id, status) => api.put(`/admin/status/${id}`, { status }),
  delete: (id) => api.delete(`/delete-hostel/${id}`),
};

export default api;
