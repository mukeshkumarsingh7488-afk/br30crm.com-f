import api from "./api";

export const getLeads = async (businessId, params = {}) => {
  const response = await api.get(`/leads/business/${businessId}`, {
    params,
  });

  return response.data;
};

export const getLeadById = async (businessId, leadId) => {
  const response = await api.get(`/leads/business/${businessId}/${leadId}`);

  return response.data;
};

export const createLead = async (businessId, data) => {
  const response = await api.post(`/leads/business/${businessId}`, data);

  return response.data;
};

export const updateLead = async (businessId, leadId, data) => {
  const response = await api.patch(`/leads/business/${businessId}/${leadId}`, data);

  return response.data;
};

export const deleteLead = async (businessId, leadId) => {
  const response = await api.delete(`/leads/business/${businessId}/${leadId}`);

  return response.data;
};

export const assignLead = async (businessId, leadId, assignedTo = null, assignedTeamId = null) => {
  const response = await api.patch(`/leads/business/${businessId}/${leadId}/assign`, {
    assignedTo,
    assignedTeamId,
  });

  return response.data;
};

export const convertLead = async (businessId, leadId, data = {}) => {
  const response = await api.post(`/leads/business/${businessId}/${leadId}/convert`, data);

  return response.data;
};
