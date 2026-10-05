import api from "./api";

export const getAttributionSummary = async (businessId, params = {}) => {
  const response = await api.get(`/lead-attribution/business/${businessId}/summary`, { params });
  return response.data;
};

export const getLeadAttributions = async (businessId, leadId, params = {}) => {
  const response = await api.get(`/lead-attribution/business/${businessId}/lead/${leadId}`, { params });
  return response.data;
};

export const getLeadAttributionSummary = async (businessId, leadId) => {
  const response = await api.get(`/lead-attribution/business/${businessId}/lead/${leadId}/summary`);
  return response.data;
};

export const createLeadAttribution = async (businessId, leadId, data) => {
  const response = await api.post(`/lead-attribution/business/${businessId}/lead/${leadId}`, data);
  return response.data;
};

export const setFirstTouchAttribution = async (businessId, leadId, data) => {
  const response = await api.post(`/lead-attribution/business/${businessId}/lead/${leadId}/first-touch`, data);
  return response.data;
};

export const setLastTouchAttribution = async (businessId, leadId, data) => {
  const response = await api.post(`/lead-attribution/business/${businessId}/lead/${leadId}/last-touch`, data);
  return response.data;
};

export const updateLeadAttribution = async (businessId, attributionId, data) => {
  const response = await api.patch(`/lead-attribution/business/${businessId}/${attributionId}`, data);
  return response.data;
};

export const deleteLeadAttribution = async (businessId, attributionId) => {
  const response = await api.delete(`/lead-attribution/business/${businessId}/${attributionId}`);
  return response.data;
};
