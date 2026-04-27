import apiClient from './client';

export async function getLeads(params = {}) {
  const { data } = await apiClient.get('/leads', { params });
  return data;
}

export async function createLead(payload) {
  const { data } = await apiClient.post('/leads', payload);
  return data;
}

export async function updateLead(id, payload) {
  const { data } = await apiClient.put(`/leads/${id}`, payload);
  return data;
}

export async function deleteLead(id) {
  const { data } = await apiClient.delete(`/leads/${id}`);
  return data;
}
