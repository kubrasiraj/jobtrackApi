import api from './api';

export const authService = {
  register: (payload) => api.post('/auth/register', payload).then((r) => r.data),
  login: ({ email, password }) =>
    api.post('/auth/login', { email, password }).then((r) => r.data.access_token),
  me: () => api.get('/auth/me').then((r) => r.data),
};
