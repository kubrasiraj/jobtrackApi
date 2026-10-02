import api from './api';

const BASE = '/api/v1';

export const interviewService = {
  listForApplication: (applicationId) =>
    api.get(`${BASE}/applications/${applicationId}/interviews`).then((r) => r.data),
  create: (applicationId, payload) =>
    api.post(`${BASE}/applications/${applicationId}/interviews`, payload).then((r) => r.data),
  update: (id, payload) => api.patch(`${BASE}/interviews/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`${BASE}/interviews/${id}`),
};
