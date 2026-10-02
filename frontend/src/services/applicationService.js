import api from './api';
import { fetchAllPages } from '../utils/pagination';

const BASE = '/api/v1/applications';

// The backend applies either the status filter or the company filter, not both.
function list({ status, companyId, skip = 0, limit = 10 } = {}) {
  const params = { skip, limit };
  if (status) params.status = status;
  if (companyId) params.company_id = companyId;
  return api.get(`${BASE}/`, { params }).then((r) => r.data);
}

export const applicationService = {
  list,
  listAll: () => fetchAllPages(({ skip, limit }) => list({ skip, limit })),
  get: (id) => api.get(`${BASE}/${id}`).then((r) => r.data),
  create: (payload) => api.post(`${BASE}/`, payload).then((r) => r.data),
  update: (id, payload) => api.patch(`${BASE}/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`${BASE}/${id}`),
};
