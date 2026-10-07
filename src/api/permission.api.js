import api from "./api";

export const initializeSystemPermissions = async () => {
  const response = await api.post("/permissions/system");

  return response.data;
};

export const getSystemPermissions = async (params = {}) => {
  const response = await api.get("/permissions/system", {
    params,
  });

  return response.data;
};

export const getAvailablePermissions = async (businessId, params = {}) => {
  const response = await api.get(`/permissions/business/${businessId}/available`, {
    params,
  });

  return response.data;
};

export const getBusinessPermissions = async (businessId, params = {}) => {
  const response = await api.get(`/permissions/business/${businessId}`, {
    params,
  });

  return response.data;
};

export const createPermission = async (businessId, payload) => {
  const response = await api.post(`/permissions/business/${businessId}`, payload);

  return response.data;
};

export const getPermissionById = async (permissionId) => {
  const response = await api.get(`/permissions/${permissionId}`);

  return response.data;
};

export const getPermissionBySlug = async (slug) => {
  const response = await api.get(`/permissions/slug/${encodeURIComponent(slug)}`);

  return response.data;
};

export const updatePermission = async (permissionId, payload) => {
  const response = await api.patch(`/permissions/${permissionId}`, payload);

  return response.data;
};

export const deletePermission = async (permissionId) => {
  const response = await api.delete(`/permissions/${permissionId}`);

  return response.data;
};

export const getAllAvailablePermissions = async (businessId, params = {}) => {
  const response = await api.get(`/permissions/business/${businessId}/available`, {
    params,
  });

  return response.data;
};
