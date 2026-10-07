import api from "./api";

export const getMeetings = async (businessId, params = {}) => {
  const response = await api.get(`/meetings/business/${businessId}`, {
    params,
  });

  return response.data;
};

export const getMeetingById = async (businessId, meetingId) => {
  const response = await api.get(`/meetings/business/${businessId}/${meetingId}`);

  return response.data;
};

export const createMeeting = async (businessId, data) => {
  const response = await api.post(`/meetings/business/${businessId}`, data);

  return response.data;
};

export const updateMeeting = async (businessId, meetingId, data) => {
  const response = await api.patch(`/meetings/business/${businessId}/${meetingId}`, data);

  return response.data;
};

export const deleteMeeting = async (businessId, meetingId) => {
  const response = await api.delete(`/meetings/business/${businessId}/${meetingId}`);

  return response.data;
};
