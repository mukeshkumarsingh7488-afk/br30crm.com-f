import api from "./api";

/*
 * ============================================================
 * CONTACTS
 * ============================================================
 */

/**
 * Get contacts for a business
 *
 * Supports:
 * - page
 * - limit
 * - search
 * - status
 * - lifecycleStage
 * - source
 * - companyId
 * - assignedTo
 * - assignedTeamId
 */
export const getContacts = async (businessId, params = {}) => {
  const response = await api.get(`/contacts/business/${businessId}`, {
    params,
  });

  return response.data;
};

/**
 * Get single contact by ID
 */
export const getContactById = async (businessId, contactId) => {
  const response = await api.get(`/contacts/business/${businessId}/${contactId}`);

  return response.data;
};

/**
 * Create contact
 *
 * Can also be used for Lead → Contact conversion
 * when backend accepts sourceLeadId.
 */
export const createContact = async (businessId, data) => {
  const response = await api.post(`/contacts/business/${businessId}`, data);

  return response.data;
};

/**
 * Update contact
 */
export const updateContact = async (businessId, contactId, data) => {
  const response = await api.patch(`/contacts/business/${businessId}/${contactId}`, data);

  return response.data;
};

/**
 * Assign / reassign contact
 *
 * Supports:
 * - assignedTo
 * - assignedTeamId
 */
export const assignContact = async (businessId, contactId, data) => {
  const response = await api.patch(`/contacts/business/${businessId}/${contactId}/assign`, data);

  return response.data;
};

/**
 * Delete contact
 */
export const deleteContact = async (businessId, contactId) => {
  const response = await api.delete(`/contacts/business/${businessId}/${contactId}`);

  return response.data;
};
