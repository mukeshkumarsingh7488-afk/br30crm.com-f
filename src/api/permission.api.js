import api from "./api";

/*
 * ============================================================
 * PERMISSIONS
 * ============================================================
 */

/**
 * Initialize system permissions.
 */
export const initializeSystemPermissions = async () => {
  const response = await api.post("/permissions/system");

  return response.data;
};

/**
 * Get all system permissions.
 *
 * Supports:
 * - includeInactive=true/false
 */
export const getSystemPermissions = async (params = {}) => {
  const response = await api.get("/permissions/system", {
    params,
  });

  return response.data;
};

/**
 * Get all permissions available for a business.
 *
 * Includes system permissions + business custom permissions.
 *
 * Supports:
 * - includeInactive=true/false
 */
export const getAvailablePermissions = async (businessId, params = {}) => {
  const response = await api.get(`/permissions/business/${businessId}/available`, {
    params,
  });

  return response.data;
};

/**
 * Get custom permissions of a business.
 *
 * Supports:
 * - includeInactive=true/false
 */
export const getBusinessPermissions = async (businessId, params = {}) => {
  const response = await api.get(`/permissions/business/${businessId}`, {
    params,
  });

  return response.data;
};

/**
 * Create a custom permission for a business.
 *
 * Required:
 * - name
 * - module
 * - action
 *
 * Optional:
 * - description
 */
export const createPermission = async (businessId, payload) => {
  const response = await api.post(`/permissions/business/${businessId}`, payload);

  return response.data;
};

/**
 * Get permission by ID.
 */
export const getPermissionById = async (permissionId) => {
  const response = await api.get(`/permissions/${permissionId}`);

  return response.data;
};

/**
 * Get permission by slug.
 */
export const getPermissionBySlug = async (slug) => {
  const response = await api.get(`/permissions/slug/${encodeURIComponent(slug)}`);

  return response.data;
};

/**
 * Update a permission.
 *
 * Supported fields:
 * - name
 * - description
 * - isActive
 */
export const updatePermission = async (permissionId, payload) => {
  const response = await api.patch(`/permissions/${permissionId}`, payload);

  return response.data;
};

/**
 * Deactivate/delete a permission.
 */
export const deletePermission = async (permissionId) => {
  const response = await api.delete(`/permissions/${permissionId}`);

  return response.data;
};

/** Permissions  */

export const getAllAvailablePermissions = async (businessId, params = {}) => {
  const response = await api.get(`/permissions/business/${businessId}/available`, {
    params,
  });

  return response.data;
};
