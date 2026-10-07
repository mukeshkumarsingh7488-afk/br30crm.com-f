import api from "./api";

export const createImportJob = async (businessId, data) => (await api.post(`/import-export/business/${businessId}/import`, data)).data;
export const createExportJob = async (businessId, data) => (await api.post(`/import-export/business/${businessId}/export`, data)).data;
export const getImportExportJobs = async (businessId, params = {}) => (await api.get(`/import-export/business/${businessId}/jobs`, { params })).data;
export const getImportExportJob = async (businessId, jobId) => (await api.get(`/import-export/business/${businessId}/jobs/${jobId}`)).data;
export const downloadExportJob = async (businessId, jobId) => api.get(`/import-export/business/${businessId}/jobs/${jobId}/download`, { responseType: "blob" });
