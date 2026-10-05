import api from "./api";

const unwrap = (response) => {
  const root = response?.data || response || {};
  return root?.data && typeof root.data === "object" ? root.data : root;
};

export const getIntegrations = async (businessId, params = {}) => {
  const response = await api.get(`/integrations/business/${businessId}`, { params });
  const data = unwrap(response);
  return {
    items: Array.isArray(data?.integrations) ? data.integrations : Array.isArray(data?.items) ? data.items : [],
    pagination: data?.pagination || {},
  };
};

export const getIntegration = async (businessId, integrationId) => {
  const response = await api.get(`/integrations/business/${businessId}/${integrationId}`);
  return unwrap(response);
};

export const createIntegration = async (businessId, data) => {
  const response = await api.post(`/integrations/business/${businessId}`, data);
  return unwrap(response);
};

export const updateIntegration = async (businessId, integrationId, data) => {
  const response = await api.patch(`/integrations/business/${businessId}/${integrationId}`, data);
  return unwrap(response);
};

export const updateIntegrationStatus = async (businessId, integrationId, status, errorMessage = "") => {
  const response = await api.patch(`/integrations/business/${businessId}/${integrationId}/status`, { status, errorMessage });
  return unwrap(response);
};

export const deleteIntegration = async (businessId, integrationId) => {
  const response = await api.delete(`/integrations/business/${businessId}/${integrationId}`);
  return unwrap(response);
};

export default {
  getIntegrations,
  getIntegration,
  createIntegration,
  updateIntegration,
  updateIntegrationStatus,
  deleteIntegration,
};
