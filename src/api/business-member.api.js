import api from "./api";

/*
 * ============================================================
 * BUSINESS MEMBERS
 * ============================================================
 */

/**
 * Get members of a business.
 *
 * Supports backend pagination:
 * - page
 * - limit
 *
 * Also supports search if the backend member controller
 * accepts a search query.
 */
export const getBusinessMembers = async (businessId, params = {}) => {
  const response = await api.get(`/business-members/${businessId}/members`, {
    params,
  });

  return response.data;
};

/**
 * Get a specific business member.
 */
export const getBusinessMemberById = async (memberId) => {
  const response = await api.get(`/business-members/member/${memberId}`);

  return response.data;
};

/**
 * Get current user's business memberships.
 */
export const getMyBusinessMemberships = async (params = {}) => {
  const response = await api.get("/business-members/me", {
    params,
  });

  return response.data;
};
