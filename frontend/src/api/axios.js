import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import { authStorage } from '../utils/authStorage';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = authStorage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401) {
      authStorage.clear();
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/logout')) {
        window.location.href = '/login';
      }
    }
    if (status === 403) {
      const user = authStorage.getUser();
      const redirect = user?.role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard';
      if (!window.location.pathname.startsWith(redirect.replace('/dashboard', ''))) {
        window.location.href = redirect;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
