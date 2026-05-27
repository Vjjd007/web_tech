import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const signup = (data) => api.post('/auth/signup', data);
export const login = (data) => api.post('/auth/login', data);
export const getMe = () => api.get('/auth/me');
export const updateProfile = (data) => api.put('/auth/profile', data);

// Tools
export const logToolUsage = (data) => api.post('/tools/use', data);
export const getToolStats = () => api.get('/tools/stats');

// AI
export const sendAIChat = (data) => api.post('/ai/chat', data);
export const getAIChats = () => api.get('/ai/chats');
export const getAIChat = (id) => api.get(`/ai/chats/${id}`);
export const deleteAIChat = (id) => api.delete(`/ai/chats/${id}`);
export const generateAI = (data) => api.post('/ai/generate', data);

// PDF
export const uploadPDF = (formData) => api.post('/pdf/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const askPDF = (data) => api.post('/pdf/ask', data);

// Image
export const ocrImage = (formData) => api.post('/image/ocr', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const askImage = (data) => api.post('/image/ask', data);

// History
export const getHistory = () => api.get('/history');
export const clearHistory = () => api.delete('/history/clear');

// Favorites
export const getFavorites = () => api.get('/favorites');
export const addFavorite = (data) => api.post('/favorites', data);
export const removeFavorite = (toolId) => api.delete(`/favorites/${toolId}`);

export default api;
