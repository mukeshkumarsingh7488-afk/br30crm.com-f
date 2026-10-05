import api from "./api";

export const getDeals = async (businessId, params = {}) => {
  const response = await api.get(`/deals/business/${businessId}`, {
    params,
  });
  return response.data;
};

export const getDealById = async (businessId, dealId) => {
  const response = await api.get(`/deals/business/${businessId}/${dealId}`);
  return response.data;
};

export const createDeal = async (businessId, data) => {
  const response = await api.post(`/deals/business/${businessId}`, data);
  return response.data;
};

export const updateDeal = async (businessId, dealId, data) => {
  const response = await api.patch(`/deals/business/${businessId}/${dealId}`, data);
  return response.data;
};

export const deleteDeal = async (businessId, dealId) => {
  const response = await api.delete(`/deals/business/${businessId}/${dealId}`);
  return response.data;
};

export const assignDeal = async (businessId, dealId, userId) => {
  const response = await api.post(`/deals/business/${businessId}/${dealId}/assign`, { userId });
  return response.data;
};

export const moveDeal = async (businessId, dealId, stageId) => {
  const response = await api.post(`/deals/business/${businessId}/${dealId}/move`, { stageId });
  return response.data;
};
