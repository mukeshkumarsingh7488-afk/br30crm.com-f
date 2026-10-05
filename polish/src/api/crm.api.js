import api from "./api";

export const getMyBusinessMemberships = async (params = {}) => {
  const response = await api.get("/business-members/me", { params });
  return response.data;
};

export const getBusinessMembers = async (businessId, params = {}) => {
  const response = await api.get(`/business-members/${businessId}/members`, { params });
  return response.data;
};

export const getAnalyticsOverview = async (businessId, params = {}) => {
  const response = await api.get(`/analytics/business/${businessId}/overview`, { params });
  return response.data;
};

export const getAssignmentMembers = async (businessId, params = {}) => {
  const response = await api.get(`/business-members/${businessId}/assignment-members`, { params });
  return response.data;
};
