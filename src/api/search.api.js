import api from "./api";

const unwrap = (response) => {
  const root = response?.data || response || {};
  return root?.data && typeof root.data === "object" ? root.data : root;
};

export const searchBusiness = async (businessId, q, params = {}) => {
  if (!businessId || !String(q || "").trim()) return { results: [], total: 0 };
  const response = await api.get(`/search/business/${businessId}`, { params: { q: String(q).trim(), ...params } });
  return unwrap(response);
};

export default { searchBusiness };
