import api from "./api";

export const getActivities = async (businessId, params = {}) => {
  const response = await api.get(`/activities/business/${businessId}`, {
    params,
  });

  return response.data;
};

export const getActivityById = async (businessId, activityId) => {
  const response = await api.get(`/activities/business/${businessId}/${activityId}`);

  return response.data;
};

export const createActivity = async (businessId, data) => {
  const response = await api.post(`/activities/business/${businessId}`, data);

  return response.data;
};

export const updateActivity = async (businessId, activityId, data) => {
  const response = await api.patch(`/activities/business/${businessId}/${activityId}`, data);

  return response.data;
};

export const completeActivity = async (businessId, activityId, outcome = null) => {
  const response = await api.patch(`/activities/business/${businessId}/${activityId}/complete`, {
    outcome,
  });

  return response.data;
};

export const deleteActivity = async (businessId, activityId) => {
  const response = await api.delete(`/activities/business/${businessId}/${activityId}`);

  return response.data;
};
