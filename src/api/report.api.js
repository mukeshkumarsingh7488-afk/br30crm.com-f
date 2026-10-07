import api from "./api";

export const createReport = async (businessId, data) => {
  const response = await api.post(`/reports/business/${businessId}`, data);
  return response.data;
};

export const getReports = async (businessId, params = {}) => {
  const response = await api.get(`/reports/business/${businessId}`, {
    params,
  });

  return response.data;
};

export const getReportById = async (businessId, reportId) => {
  const response = await api.get(`/reports/business/${businessId}/${reportId}`);

  return response.data;
};

export const runReport = async (businessId, reportId, overrideFilters = {}) => {
  const response = await api.post(`/reports/business/${businessId}/${reportId}/run`, {
    overrideFilters,
  });

  return response.data;
};

export const updateReport = async (businessId, reportId, data) => {
  const response = await api.patch(`/reports/business/${businessId}/${reportId}`, data);

  return response.data;
};

export const deleteReport = async (businessId, reportId) => {
  const response = await api.delete(`/reports/business/${businessId}/${reportId}`);

  return response.data;
};

export const getSalesReport = async (businessId, params = {}) => {
  const response = await api.get(`/reports/business/${businessId}/sales`, {
    params,
  });

  return response.data;
};

export const getLeadsReport = async (businessId, params = {}) => {
  const response = await api.get(`/reports/business/${businessId}/leads`, {
    params,
  });

  return response.data;
};

export const getDealsReport = async (businessId, params = {}) => {
  const response = await api.get(`/reports/business/${businessId}/deals`, {
    params,
  });

  return response.data;
};

export const getActivitiesReport = async (businessId, params = {}) => {
  const response = await api.get(`/reports/business/${businessId}/activities`, {
    params,
  });

  return response.data;
};
