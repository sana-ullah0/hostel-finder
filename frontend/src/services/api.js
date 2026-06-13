import axios from 'axios';

const API_BASE = '/api';

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
