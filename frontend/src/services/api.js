import axios from 'axios';
import { normalizeError } from '../utils/errors';

const TOKEN_KEY = 'jobtrack_token';
export const AUTH_EXPIRED_EVENT = 'jobtrack:auth-expired';

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    error.normalized = normalizeError(error);

    // An invalid or expired JWT on a protected request ends the session.
    // Failed sign-in attempts also return 401 and are handled by the form.
    const isLogin = error.config?.url === '/auth/login';
    if (error.normalized.status === 401 && !isLogin && tokenStorage.get()) {
      tokenStorage.clear();
      window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
    }
    return Promise.reject(error);
  },
);

export default api;
