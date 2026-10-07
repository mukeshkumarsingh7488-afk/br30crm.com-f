import api from "./api";

export const getSessions = async () => (await api.get("/sessions/me")).data;
export const revokeSession = async (sessionId) => (await api.delete(`/sessions/me/${sessionId}`)).data;
export const revokeAllSessions = async () => (await api.post("/sessions/me/revoke-all")).data;
