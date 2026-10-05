import api from "./api";

const unwrap = (r) => r?.data?.data ?? r?.data ?? r ?? {};

export const getLeadSources = async (businessId, params = {}) => unwrap(await api.get(`/lead-sources/business/${businessId}`, { params }));

export const createLeadSource = async (businessId, data) => unwrap(await api.post(`/lead-sources/business/${businessId}`, data));

export const updateLeadSource = async (businessId, id, data) => unwrap(await api.patch(`/lead-sources/business/${businessId}/${id}`, data));

export const deleteLeadSource = async (businessId, id) => unwrap(await api.delete(`/lead-sources/business/${businessId}/${id}`));

export const toggleLeadSource = async (businessId, id) => unwrap(await api.patch(`/lead-sources/business/${businessId}/${id}/toggle`));

export const getLeadSourceLink = async (businessId, id, params = {}) => unwrap(await api.get(`/lead-sources/business/${businessId}/${id}/link`, { params }));

export default {
  getLeadSources,
  createLeadSource,
  updateLeadSource,
  deleteLeadSource,
  toggleLeadSource,
  getLeadSourceLink,
};
