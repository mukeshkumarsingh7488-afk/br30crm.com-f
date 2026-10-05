import api from "./api";

export const getAdminOverview = async (params = {}) => {
  const response = await api.get("/admin/overview", {
    params,
  });

  return response.data;
};

export const getAdminUser = async (userId) => {
  const response = await api.get(`/admin/users/${userId}`);

  return response.data;
};

export const updateAdminUser = async (userId, data) => {
  const response = await api.patch(`/admin/users/${userId}`, data);

  return response.data;
};

export const updateAdminUserStatus = async (userId, status) => {
  const response = await api.patch(`/admin/users/${userId}/status`, {
    status,
  });

  return response.data;
};

export const deleteAdminUser = async (userId) => {
  const response = await api.delete(`/admin/users/${userId}`);

  return response.data;
};
