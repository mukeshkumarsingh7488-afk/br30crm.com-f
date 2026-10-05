import api from "./api";
const unwrap = (r) => r?.data?.data ?? r?.data ?? r ?? {};
export const getAuditLogs = async (businessId, params = {}) => unwrap(await api.get(`/audit/business/${businessId}`, { params }));
export const getAuditLog = async (businessId, id) => unwrap(await api.get(`/audit/business/${businessId}/${id}`));
export const getEntityAuditLogs = async (businessId, entityType, entityId, params = {}) => unwrap(await api.get(`/audit/business/${businessId}/${entityType}/${entityId}`, { params }));
export default { getAuditLogs, getAuditLog, getEntityAuditLogs };
