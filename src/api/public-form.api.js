import api from "./api";

const unwrap = (r) => r?.data?.data ?? r?.data ?? r ?? {};

export const getPublicForms = async (businessId, params = {}) => unwrap(await api.get(`/public-forms/business/${businessId}`, { params }));

export const createPublicForm = async (businessId, data) => unwrap(await api.post(`/public-forms/business/${businessId}`, data));

export const updatePublicForm = async (businessId, formId, data) => unwrap(await api.patch(`/public-forms/business/${businessId}/${formId}`, data));

export const deletePublicForm = async (businessId, formId) => unwrap(await api.delete(`/public-forms/business/${businessId}/${formId}`));

export const getPublicForm = async (businessId, slug, params = {}) =>
  unwrap(
    await api.get(`/public-forms/public/${businessId}/${slug}`, {
      params,
    })
  );

export const submitPublicForm = async (businessId, slug, data) => unwrap(await api.post(`/public-forms/public/${businessId}/${slug}/submit`, data));

export const getPublicFormQr = async (businessId, slug) => unwrap(await api.get(`/public-forms/public/${businessId}/${slug}/qr`));

export default {
  getPublicForms,
  createPublicForm,
  updatePublicForm,
  deletePublicForm,
  getPublicForm,
  submitPublicForm,
  getPublicFormQr,
};
