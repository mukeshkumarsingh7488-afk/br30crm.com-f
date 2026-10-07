import api from "./api";

export const getContacts = async (businessId, params = {}) => {
  const response = await api.get(`/contacts/business/${businessId}`, {
    params,
  });

  return response.data;
};

export const getContactById = async (businessId, contactId) => {
  const response = await api.get(`/contacts/business/${businessId}/${contactId}`);

  return response.data;
};

export const createContact = async (businessId, data) => {
  const response = await api.post(`/contacts/business/${businessId}`, data);

  return response.data;
};

export const updateContact = async (businessId, contactId, data) => {
  const response = await api.patch(`/contacts/business/${businessId}/${contactId}`, data);

  return response.data;
};

export const assignContact = async (businessId, contactId, data) => {
  const response = await api.patch(`/contacts/business/${businessId}/${contactId}/assign`, data);

  return response.data;
};

export const deleteContact = async (businessId, contactId) => {
  const response = await api.delete(`/contacts/business/${businessId}/${contactId}`);

  return response.data;
};
