import api from "./api";

/**
 * Get all members of a business
 */
export const getMembers = async (businessId, params = {}) => {
  return (
    await api.get(`/business-members/${businessId}/members`, {
      params,
    })
  ).data;
};

/**
 * Get a single business member
 */
export const getMemberById = async (memberId) => {
  return (await api.get(`/business-members/member/${memberId}`)).data;
};

/**
 * Add a user as a business member
 */
export const addMember = async (businessId, data) => {
  return (await api.post(`/business-members/${businessId}/members`, data)).data;
};

/**
 * Update business member role/status
 */
export const updateMember = async (memberId, data) => {
  return (await api.patch(`/business-members/member/${memberId}`, data)).data;
};

/**
 * Remove/deactivate business member
 */
export const removeMember = async (memberId) => {
  return (await api.delete(`/business-members/member/${memberId}`)).data;
};

/**
 * Get businesses where current user is a member
 */
export const getMyBusinessMemberships = async (params = {}) => {
  return (
    await api.get("/business-members/me", {
      params,
    })
  ).data;
};
