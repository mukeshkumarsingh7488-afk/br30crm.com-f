import api from "./api";

export const getRoles = async (businessId, params = {}) => {
  const response = await api.get(`/roles/business/${businessId}`, {
    params,
  });

  return response.data;
};

export const getAvailableRoles = async (businessId, params = {}) => {
  const response = await api.get(`/roles/business/${businessId}/available`, {
    params,
  });

  return response.data;
};

export const getRoleById = async (roleId) => {
  const response = await api.get(`/roles/${roleId}`);

  return response.data;
};

export const createRole = async (businessId, payload) => {
  const response = await api.post(`/roles/business/${businessId}`, payload);

  return response.data;
};

export const updateRole = async (businessId, roleId, payload) => {
  const response = await api.patch(`/roles/business/${businessId}/${roleId}`, payload);

  return response.data;
};

export const deleteRole = async (businessId, roleId) => {
  const response = await api.delete(`/roles/business/${businessId}/${roleId}`);

  return response.data;
};
