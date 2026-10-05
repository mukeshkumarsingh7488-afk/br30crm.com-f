import api from "./api";
const unwrap=(r)=>r?.data?.data??r?.data??r??{};
export const getBusinessSettings=async(businessId)=>unwrap(await api.get(`/settings/business/${businessId}`));
export const updateBusinessSettings=async(businessId,data)=>unwrap(await api.patch(`/settings/business/${businessId}`,data));
export const resetBusinessSettings=async(businessId)=>unwrap(await api.post(`/settings/business/${businessId}/reset`));
