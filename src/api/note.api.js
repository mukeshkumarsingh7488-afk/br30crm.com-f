import api from "./api";

const unwrap = (response) => response?.data?.data ?? response?.data ?? response ?? {};

export const getNotes = async (businessId, params = {}) => unwrap(await api.get(`/notes/business/${businessId}`, { params }));
export const getNoteById = async (businessId, noteId) => unwrap(await api.get(`/notes/business/${businessId}/${noteId}`));
export const createNote = async (businessId, data) => unwrap(await api.post(`/notes/business/${businessId}`, data));
export const updateNote = async (businessId, noteId, data) => unwrap(await api.patch(`/notes/business/${businessId}/${noteId}`, data));
export const togglePinNote = async (businessId, noteId) => unwrap(await api.patch(`/notes/business/${businessId}/${noteId}/pin`));
export const archiveNote = async (businessId, noteId) => unwrap(await api.patch(`/notes/business/${businessId}/${noteId}/archive`));
export const deleteNote = async (businessId, noteId) => unwrap(await api.delete(`/notes/business/${businessId}/${noteId}`));
