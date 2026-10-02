import api from './api';
import { fetchAllPages } from '../utils/pagination';

const BASE = '/api/v1/companies';

function list({ skip = 0, limit = 10 } = {}) {
  return api.get(`${BASE}/`, { params: { skip, limit } }).then((r) => r.data);
}

export const companyService = {
  list,
  listAll: () => fetchAllPages(list),
  get: (id) => api.get(`${BASE}/${id}`).then((r) => r.data),
  create: (payload) => api.post(`${BASE}/`, payload).then((r) => r.data),
  update: (id, payload) => api.patch(`${BASE}/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`${BASE}/${id}`),
};
