import api from "./api";

export const getTasks = async (businessId, params = {}) => {
  const response = await api.get(`/tasks/business/${businessId}`, {
    params,
  });
  return response.data;
};

export const getTaskById = async (businessId, taskId) => {
  const response = await api.get(`/tasks/business/${businessId}/${taskId}`);
  return response.data;
};

export const createTask = async (businessId, data) => {
  const response = await api.post(`/tasks/business/${businessId}`, data);
  return response.data;
};

export const updateTask = async (businessId, taskId, data) => {
  const response = await api.patch(`/tasks/business/${businessId}/${taskId}`, data);
  return response.data;
};

export const deleteTask = async (businessId, taskId) => {
  const response = await api.delete(`/tasks/business/${businessId}/${taskId}`);
  return response.data;
};

export const assignTask = async (businessId, taskId, assignedTo) => {
  const response = await api.post(`/tasks/business/${businessId}/${taskId}/assign`, {
    assignedTo,
  });
  return response.data;
};

export const completeTask = async (businessId, taskId) => {
  const response = await api.post(`/tasks/business/${businessId}/${taskId}/complete`);
  return response.data;
};
