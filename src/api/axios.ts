import axios from 'axios';
import i18n from '../i18n';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers['x-lang'] = i18n.language || 'en';
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only treat 401 as a session expiry if the request actually carried a
    // token. Otherwise it's a failed login/credential check — let the caller
    // surface the error message instead of force-navigating.
    const hadAuthHeader = Boolean(error.config?.headers?.Authorization);
    if (error.response?.status === 401 && hadAuthHeader) {
      localStorage.removeItem('auth-token');
      localStorage.removeItem('auth-user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default api;
