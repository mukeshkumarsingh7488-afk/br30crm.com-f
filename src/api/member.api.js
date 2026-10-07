import api from "./api";

export const getMembers = async (businessId, params = {}) => {
  return (
    await api.get(`/business-members/${businessId}/members`, {
      params,
    })
  ).data;
};

export const getMemberById = async (memberId) => {
  return (await api.get(`/business-members/member/${memberId}`)).data;
};

export const addMember = async (businessId, data) => {
  return (await api.post(`/business-members/${businessId}/members`, data)).data;
};

export const updateMember = async (memberId, data) => {
  return (await api.patch(`/business-members/member/${memberId}`, data)).data;
};

export const removeMember = async (memberId) => {
  return (await api.delete(`/business-members/member/${memberId}`)).data;
};

export const getMyBusinessMemberships = async (params = {}) => {
  return (
    await api.get("/business-members/me", {
      params,
    })
  ).data;
};
