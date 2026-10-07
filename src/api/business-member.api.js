import api from "./api";

export const getBusinessMembers = async (businessId, params = {}) => {
  const response = await api.get(`/business-members/${businessId}/members`, {
    params,
  });

  return response.data;
};

export const getBusinessMemberById = async (memberId) => {
  const response = await api.get(`/business-members/member/${memberId}`);

  return response.data;
};

export const getMyBusinessMemberships = async (params = {}) => {
  const response = await api.get("/business-members/me", {
    params,
  });

  return response.data;
};
