import api from "./api";

const unwrap = (response) => {
  const root = response?.data || response || {};

  return root?.data && typeof root.data === "object" ? root.data : root;
};

export const getTags = async (businessId, params = {}) => {
  return api.get(`/tags/business/${businessId}`, {
    params,
  });
};

export const getTagById = async (businessId, tagId) => {
  return api.get(`/tags/business/${businessId}/${tagId}`);
};

export const createTag = async (businessId, payload) => {
  return api.post(`/tags/business/${businessId}`, payload);
};

export const updateTag = async (businessId, tagId, payload) => {
  return api.patch(`/tags/business/${businessId}/${tagId}`, payload);
};

export const deleteTag = async (businessId, tagId) => {
  return api.delete(`/tags/business/${businessId}/${tagId}`);
};

export const restoreTag = async (businessId, tagId) => {
  return api.patch(`/tags/business/${businessId}/${tagId}/restore`);
};

export const getTagRows = (response) => {
  const data = unwrap(response);

  return data?.tags || data?.items || data?.results || (Array.isArray(data) ? data : []);
};

export const getTagPagination = (response, fallback = {}) => {
  const data = unwrap(response);

  return (
    data?.pagination || {
      page: fallback.page || 1,
      limit: fallback.limit || 50,
      total: getTagRows(response).length,
      pages: 1,
    }
  );
};

export default {
  getTags,
  getTagById,
  createTag,
  updateTag,
  deleteTag,
  restoreTag,
  getTagRows,
  getTagPagination,
};
