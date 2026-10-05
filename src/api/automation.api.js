import api from "./api";

const unwrap = (response) => response?.data?.data ?? response?.data ?? response ?? {};

export const getAutomationMetadata = async (businessId) => unwrap(await api.get(`/automations/business/${businessId}/meta`));
export const getAutomations = async (businessId, params = {}) => unwrap(await api.get(`/automations/business/${businessId}`, { params }));
export const getAutomationById = async (businessId, automationId) => unwrap(await api.get(`/automations/business/${businessId}/${automationId}`));
export const createAutomation = async (businessId, data) => unwrap(await api.post(`/automations/business/${businessId}`, data));
export const updateAutomation = async (businessId, automationId, data) => unwrap(await api.patch(`/automations/business/${businessId}/${automationId}`, data));
export const updateAutomationStatus = async (businessId, automationId, status) => unwrap(await api.patch(`/automations/business/${businessId}/${automationId}/status`, { status }));
export const deleteAutomation = async (businessId, automationId) => unwrap(await api.delete(`/automations/business/${businessId}/${automationId}`));
export const cloneAutomation = async (businessId, automationId, name) => unwrap(await api.post(`/automations/business/${businessId}/${automationId}/clone`, name ? { name } : {}));
export const executeAutomation = async (businessId, automationId, data = {}) => unwrap(await api.post(`/automations/business/${businessId}/${automationId}/execute`, data));
export const getAutomationExecutions = async (businessId, automationId, params = {}) => unwrap(await api.get(`/automations/business/${businessId}/${automationId}/executions`, { params }));
export const getAutomationExecution = async (businessId, executionId) => unwrap(await api.get(`/automations/business/${businessId}/executions/${executionId}`));

export default { getAutomationMetadata, getAutomations, getAutomationById, createAutomation, updateAutomation, updateAutomationStatus, deleteAutomation, cloneAutomation, executeAutomation, getAutomationExecutions, getAutomationExecution };
