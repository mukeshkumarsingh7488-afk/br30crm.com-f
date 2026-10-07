import api from "./api";

export const scanDuplicates = async (businessId, entityType) => (await api.post(`/duplicates/business/${businessId}/scan`, { entityType })).data;
export const getDuplicates = async (businessId, params = {}) => (await api.get(`/duplicates/business/${businessId}`, { params })).data;
export const resolveDuplicate = async (businessId, duplicateId, action) => (await api.post(`/duplicates/business/${businessId}/${duplicateId}/resolve`, { action })).data;
