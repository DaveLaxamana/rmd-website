import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const register = (userData) => api.post('/auth/register', userData);
export const login = (credentials) => api.post('/auth/login', credentials);
export const getMe = () => api.get('/auth/me');
export const updateDetails = (userData) => api.put('/auth/updatedetails', userData);
export const updatePassword = (passwords) => api.put('/auth/updatepassword', passwords);

// Projects API
export const getProjects = (params = {}) => api.get('/projects', { params });
export const getProject = (id) => api.get(`/projects/${id}`);
export const createProject = (projectData) => api.post('/projects', projectData);
export const updateProject = (id, projectData) => api.put(`/projects/${id}`, projectData);
export const deleteProject = (id) => api.delete(`/projects/${id}`);
export const uploadProjectImage = (id, image) => {
  const formData = new FormData();
  formData.append('file', image);
  return api.put(`/projects/${id}/photo`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Pledges API
export const getPledges = (projectId) => api.get(`/projects/${projectId}/pledges`);
export const createPledge = (projectId, pledgeData) =>
  api.post(`/projects/${projectId}/pledges`, pledgeData);
export const updatePledge = (projectId, pledgeId, pledgeData) =>
  api.put(`/projects/${projectId}/pledges/${pledgeId}`, pledgeData);
export const deletePledge = (projectId, pledgeId) =>
  api.delete(`/projects/${projectId}/pledges/${pledgeId}`);

export default api;
