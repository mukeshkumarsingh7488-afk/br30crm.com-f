import api from "./api";

export const getInvitations = async (businessId, params = {}) => (await api.get(`/invitations/business/${businessId}`, { params })).data;
export const createInvitation = async (businessId, data) => (await api.post(`/invitations/business/${businessId}`, data)).data;
export const resendInvitation = async (businessId, invitationId) => (await api.post(`/invitations/business/${businessId}/${invitationId}/resend`)).data;
export const cancelInvitation = async (businessId, invitationId) => (await api.delete(`/invitations/business/${businessId}/${invitationId}`)).data;
