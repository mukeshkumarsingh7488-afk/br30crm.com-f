import api from "./api";

const unwrap = (response) => response?.data?.data ?? response?.data ?? response ?? {};

export const getFiles = async (businessId, params = {}) => unwrap(await api.get(`/files/business/${businessId}`, { params }));
export const getFileById = async (businessId, fileId) => unwrap(await api.get(`/files/business/${businessId}/${fileId}`));
export const createFile = async (businessId, data) => unwrap(await api.post(`/files/business/${businessId}`, data));
export const updateFile = async (businessId, fileId, data) => unwrap(await api.patch(`/files/business/${businessId}/${fileId}`, data));
export const deleteFile = async (businessId, fileId) => unwrap(await api.delete(`/files/business/${businessId}/${fileId}`));
export const restoreFile = async (businessId, fileId) => unwrap(await api.patch(`/files/business/${businessId}/${fileId}/restore`));
