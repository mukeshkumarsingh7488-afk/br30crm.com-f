import api from "./api";

export const getTeams = async (businessId, params = {}) => (await api.get(`/teams/business/${businessId}`, { params })).data;

export const createTeam = async (businessId, data) => (await api.post(`/teams/business/${businessId}`, data)).data;

export const getTeam = async (businessId, teamId) => (await api.get(`/teams/business/${businessId}/${teamId}`)).data;

export const updateTeam = async (businessId, teamId, data) => (await api.patch(`/teams/business/${businessId}/${teamId}`, data)).data;

export const deleteTeam = async (businessId, teamId) => (await api.delete(`/teams/business/${businessId}/${teamId}`)).data;

export const addTeamMember = async (businessId, teamId, userId) => (await api.post(`/teams/business/${businessId}/${teamId}/members/${userId}`)).data;

export const removeTeamMember = async (businessId, teamId, userId) => (await api.delete(`/teams/business/${businessId}/${teamId}/members/${userId}`)).data;

const BUSINESS_MEMBER_BASE = "/business-members";

export const getBusinessMembers = async (businessId, params = {}) => (await api.get(`${BUSINESS_MEMBER_BASE}/${businessId}/members`, { params })).data;

export const getBusinessMember = async (memberId) => (await api.get(`${BUSINESS_MEMBER_BASE}/member/${memberId}`)).data;

export const addBusinessMember = async (businessId, data) => (await api.post(`${BUSINESS_MEMBER_BASE}/${businessId}/members`, data)).data;

export const updateBusinessMember = async (memberId, data) => (await api.patch(`${BUSINESS_MEMBER_BASE}/member/${memberId}`, data)).data;

export const removeBusinessMember = async (memberId) => (await api.delete(`${BUSINESS_MEMBER_BASE}/member/${memberId}`)).data;

export const getReports = async (businessId, params = {}) => (await api.get(`/reports/business/${businessId}`, { params })).data;

export const createReport = async (businessId, data) => (await api.post(`/reports/business/${businessId}`, data)).data;

export const updateReport = async (businessId, reportId, data) => (await api.patch(`/reports/business/${businessId}/${reportId}`, data)).data;

export const deleteReport = async (businessId, reportId) => (await api.delete(`/reports/business/${businessId}/${reportId}`)).data;

export const runReport = async (businessId, reportId) => (await api.post(`/reports/business/${businessId}/${reportId}/run`)).data;

export const getNotifications = async (businessId, params = {}) => (await api.get(`/notifications/business/${businessId}`, { params })).data;

export const markNotificationRead = async (businessId, id) => (await api.patch(`/notifications/business/${businessId}/${id}/read`)).data;

export const markAllNotificationsRead = async (businessId) => (await api.patch(`/notifications/business/${businessId}/read-all`)).data;

export const deleteNotification = async (businessId, id) => (await api.delete(`/notifications/business/${businessId}/${id}`)).data;

export const getAuditLogs = async (businessId, params = {}) => (await api.get(`/audit/business/${businessId}`, { params })).data;
