import api from "./api";

export const getAnalyticsOverview = async (businessId, params = {}) => (await api.get(`/analytics/business/${businessId}/overview`, { params })).data;
export const getAnalyticsMetric = async (businessId, metric, params = {}) => (await api.get(`/analytics/business/${businessId}/metric/${metric}`, { params })).data;
export const getAnalyticsSnapshots = async (businessId, params = {}) => (await api.get(`/analytics/business/${businessId}/snapshots`, { params })).data;
export const createAnalyticsSnapshot = async (businessId, data) => (await api.post(`/analytics/business/${businessId}/snapshots`, data)).data;
export const deleteAnalyticsSnapshot = async (businessId, snapshotId) => (await api.delete(`/analytics/business/${businessId}/snapshots/${snapshotId}`)).data;
