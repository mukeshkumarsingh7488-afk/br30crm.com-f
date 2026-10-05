import api from "./api";

export const getCompanies = async (businessId, params = {}) => {
  const response = await api.get(`/companies/business/${businessId}`, { params });
  return response.data;
};

export const getCompanyById = async (businessId, companyId) => {
  const response = await api.get(`/companies/business/${businessId}/${companyId}`);
  return response.data;
};

export const createCompany = async (businessId, data) => {
  const response = await api.post(`/companies/business/${businessId}`, data);
  return response.data;
};

export const updateCompany = async (businessId, companyId, data) => {
  const response = await api.patch(`/companies/business/${businessId}/${companyId}`, data);
  return response.data;
};

export const assignCompany = async (businessId, companyId, data) => {
  const response = await api.patch(`/companies/business/${businessId}/${companyId}/assign`, data);
  return response.data;
};

export const deleteCompany = async (businessId, companyId) => {
  const response = await api.delete(`/companies/business/${businessId}/${companyId}`);
  return response.data;
};

export const getCompanyContacts = async (businessId, companyId, params = {}) => {
  const response = await api.get(`/companies/business/${businessId}/${companyId}/contacts`, { params });
  return response.data;
};
