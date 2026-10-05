import { getCommunications, sendEmailCommunication } from "./communication.api";

export const getEmails = async (businessId, params = {}) => {
  return getCommunications(businessId, {
    ...params,
    channel: "EMAIL",
  });
};

export const sendEmail = async (businessId, data = {}) => {
  return sendEmailCommunication(businessId, data);
};

export default {
  getEmails,
  sendEmail,
};
