import api from './api';

export const dashboardService = {
  getStats: () => api.get('/api/v1/dashboard/stats').then((r) => r.data),
};
