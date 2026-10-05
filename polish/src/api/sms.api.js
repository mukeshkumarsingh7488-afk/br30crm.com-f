import { getCommunications, sendSmsCommunication } from "./communication.api";

export const getSmsMessages = async (businessId, params = {}) => {
  return getCommunications(businessId, {
    ...params,
    channel: "SMS",
  });
};

export const sendSms = async (businessId, data = {}) => {
  return sendSmsCommunication(businessId, data);
};

export default {
  getSmsMessages,
  sendSms,
};
