import axios from 'axios';

const DEFAULT_API_BASE = 'http://localhost:5000/api';

const normalizeApiBase = (value) => {
  const trimmed = typeof value === 'string' ? value.trim() : '';
  const withoutTrailingSlash = trimmed ? trimmed.replace(/\/+$/, '') : DEFAULT_API_BASE;
  if (withoutTrailingSlash.endsWith('/api')) {
    return withoutTrailingSlash;
  }
  return `${withoutTrailingSlash}/api`;
};

export const API_BASE = normalizeApiBase(import.meta.env.VITE_API_URL);

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const setAuthHeader = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authSession');
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
    }
    return Promise.reject(error);
  }
);

export default api;
