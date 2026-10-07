import api from "./api";

export const getApiKeys = async (businessId, params = {}) => (await api.get(`/api-keys/business/${businessId}`, { params })).data;
export const createApiKey = async (businessId, data) => (await api.post(`/api-keys/business/${businessId}`, data)).data;
export const updateApiKey = async (businessId, apiKeyId, data) => (await api.patch(`/api-keys/business/${businessId}/${apiKeyId}`, data)).data;
export const deleteApiKey = async (businessId, apiKeyId) => (await api.delete(`/api-keys/business/${businessId}/${apiKeyId}`)).data;
