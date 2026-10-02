import api from './api';

const BASE = '/api/v1';

export const noteService = {
  listForApplication: (applicationId) =>
    api.get(`${BASE}/applications/${applicationId}/notes`).then((r) => r.data),
  create: (applicationId, payload) =>
    api.post(`${BASE}/applications/${applicationId}/notes`, payload).then((r) => r.data),
  update: (id, payload) => api.patch(`${BASE}/notes/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`${BASE}/notes/${id}`),
};
