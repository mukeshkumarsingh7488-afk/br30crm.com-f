import api from "./api";

const unwrap = (response) => {
  const root = response?.data || response || {};

  if (root?.data && typeof root.data === "object") {
    return root.data;
  }

  return root;
};

const extractRows = (response, keys = []) => {
  const data = unwrap(response);

  for (const key of keys) {
    if (Array.isArray(data?.[key])) {
      return data[key];
    }
  }

  if (Array.isArray(data)) {
    return data;
  }

  return [];
};

const normalizeListParams = (params = {}) => {
  const rawPage = Number(params?.page);
  const rawLimit = Number(params?.limit);

  return {
    ...params,
    page: Number.isFinite(rawPage) && rawPage >= 1 ? Math.floor(rawPage) : 1,
    limit: Number.isFinite(rawLimit) && rawLimit >= 1 ? Math.min(Math.floor(rawLimit), 100) : 10,
  };
};

export const getCalendarMeetings = async (businessId, params = {}) => {
  const safeParams = normalizeListParams(params);

  const response = await api.get(`/meetings/business/${businessId}`, {
    params: safeParams,
  });

  return response.data;
};

export const getCalendarMeeting = async (businessId, meetingId) => {
  const response = await api.get(`/meetings/business/${businessId}/${meetingId}`);

  return response.data;
};

export const createCalendarMeeting = async (businessId, data) => {
  const response = await api.post(`/meetings/business/${businessId}`, data);

  return response.data;
};

export const updateCalendarMeeting = async (businessId, meetingId, data) => {
  const response = await api.patch(`/meetings/business/${businessId}/${meetingId}`, data);

  return response.data;
};

export const deleteCalendarMeeting = async (businessId, meetingId) => {
  const response = await api.delete(`/meetings/business/${businessId}/${meetingId}`);

  return response.data;
};

export const getCalendarActivities = async (businessId, params = {}) => {
  const safeParams = normalizeListParams(params);

  const response = await api.get(`/activities/business/${businessId}`, {
    params: safeParams,
  });

  return response.data;
};

export const getCalendarActivity = async (businessId, activityId) => {
  const response = await api.get(`/activities/business/${businessId}/${activityId}`);

  return response.data;
};

export const createCalendarActivity = async (businessId, data) => {
  const response = await api.post(`/activities/business/${businessId}`, data);

  return response.data;
};

export const updateCalendarActivity = async (businessId, activityId, data) => {
  const response = await api.patch(`/activities/business/${businessId}/${activityId}`, data);

  return response.data;
};

export const deleteCalendarActivity = async (businessId, activityId) => {
  const response = await api.delete(`/activities/business/${businessId}/${activityId}`);

  return response.data;
};

export const extractMeetingRows = (response) => extractRows(response, ["meetings", "items", "results"]);

export const extractActivityRows = (response) => extractRows(response, ["activities", "items", "results"]);

export default {
  getCalendarMeetings,
  getCalendarMeeting,
  createCalendarMeeting,
  updateCalendarMeeting,
  deleteCalendarMeeting,

  getCalendarActivities,
  getCalendarActivity,
  createCalendarActivity,
  updateCalendarActivity,
  deleteCalendarActivity,

  extractMeetingRows,
  extractActivityRows,
};
