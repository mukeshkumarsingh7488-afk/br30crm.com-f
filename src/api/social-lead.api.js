import api from "./api";

export const getSocialLeadConfig = async (businessId) => (await api.get(`/social-leads/${businessId}/config`)).data;
export const rotateSocialLeadSecret = async (businessId) => (await api.post(`/social-leads/${businessId}/rotate-secret`)).data;
