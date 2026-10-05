import api from "./api";

/**
 * Get meetings for a business.
 *
 * Supported params:
 * - page
 * - limit
 * - search
 * - from
 * - to
 * - status
 * - organizerId
 * - relatedType
 * - relatedId
 */
export const getMeetings = async (businessId, params = {}) => {
  const response = await api.get(`/meetings/business/${businessId}`, {
    params,
  });

  return response.data;
};

/**
 * Get a single meeting by ID.
 */
export const getMeetingById = async (businessId, meetingId) => {
  const response = await api.get(`/meetings/business/${businessId}/${meetingId}`);

  return response.data;
};

/**
 * Create a new meeting.
 */
export const createMeeting = async (businessId, data) => {
  const response = await api.post(`/meetings/business/${businessId}`, data);

  return response.data;
};

/**
 * Update an existing meeting.
 */
export const updateMeeting = async (businessId, meetingId, data) => {
  const response = await api.patch(`/meetings/business/${businessId}/${meetingId}`, data);

  return response.data;
};

/**
 * Delete a meeting.
 */
export const deleteMeeting = async (businessId, meetingId) => {
  const response = await api.delete(`/meetings/business/${businessId}/${meetingId}`);

  return response.data;
};
