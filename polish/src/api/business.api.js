import api from "./api";

export const getBusinesses = async (params = {}) => {
  const response = await api.get("/businesses", { params });
  return response.data;
};

export const getBusinessById = async (businessId) => {
  const response = await api.get(`/businesses/${businessId}`);
  return response.data;
};

export const createBusiness = async (data) => {
  const response = await api.post("/businesses", data);
  return response.data;
};

export const updateBusiness = async (businessId, data) => {
  const response = await api.patch(`/businesses/${businessId}`, data);
  return response.data;
};

export const deleteBusiness = async (businessId) => {
  const response = await api.delete(`/businesses/${businessId}`);
  return response.data;
};
