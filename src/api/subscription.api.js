import api from "./api";
const unwrap = (r) => r?.data?.data ?? r?.data ?? r ?? {};
export const getSubscriptionPlans = async () => unwrap(await api.get("/subscriptions/plans"));
export const getCurrentSubscription = async (businessId) => unwrap(await api.get(`/subscriptions/business/${businessId}/current`));
export const startSubscriptionCheckout = async (businessId, data) => unwrap(await api.post(`/subscriptions/business/${businessId}/checkout`, data));
export const getPaymentStatus = async (businessId, orderId) => unwrap(await api.get(`/subscriptions/business/${businessId}/payment/${orderId}`));
