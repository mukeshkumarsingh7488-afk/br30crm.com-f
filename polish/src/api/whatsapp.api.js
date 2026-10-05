import { getCommunications, sendWhatsAppCommunication } from "./communication.api";

export const getWhatsAppMessages = async (businessId, params = {}) => {
  return getCommunications(businessId, {
    ...params,
    channel: "WHATSAPP",
  });
};

export const sendWhatsAppMessage = async (businessId, data = {}) => {
  return sendWhatsAppCommunication(businessId, data);
};

export default {
  getWhatsAppMessages,
  sendWhatsAppMessage,
};
