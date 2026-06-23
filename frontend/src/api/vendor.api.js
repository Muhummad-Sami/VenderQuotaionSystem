import api from './axios';

export const vendorApi = {
  getAll: (search = '') => api.get(`/vendors?search=${search}`),
  getOne: (id) => api.get(`/vendors/${id}`),
  create: (data) => api.post('/vendors', data),
  update: (id, data) => api.put(`/vendors/${id}`, data),
  delete: (id) => api.delete(`/vendors/${id}`),
};