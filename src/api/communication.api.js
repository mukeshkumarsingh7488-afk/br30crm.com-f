import api from "./api";

const unwrap = (response) => {
  const root = response?.data || response || {};

  if (root?.data && typeof root.data === "object") {
    return root.data;
  }

  return root;
};

const normalizePagination = (pagination = {}) => ({
  page: Number(pagination?.page) || 1,
  limit: Number(pagination?.limit) || 50,
  total: Number(pagination?.total) || 0,
  totalPages: Number(pagination?.totalPages) || 0,
});

/*
 * ============================================================
 * GET COMMUNICATIONS
 * ============================================================
 */

export const getCommunications = async (businessId, params = {}) => {
  if (!businessId) {
    throw new Error("Business ID is required.");
  }

  const page = Math.max(1, Number(params?.page) || 1);

  const limit = Math.min(100, Math.max(1, Number(params?.limit) || 50));

  const requestParams = {
    page,
    limit,
  };

  if (params?.channel) {
    requestParams.channel = String(params.channel).toUpperCase();
  }

  const response = await api.get(`/communications/business/${businessId}`, {
    params: requestParams,
  });

  const data = unwrap(response);

  return {
    items: Array.isArray(data?.items) ? data.items : Array.isArray(data?.communications) ? data.communications : [],
    pagination: normalizePagination(data?.pagination),
  };
};

/*
 * ============================================================
 * COMMUNICATION HISTORY
 * ============================================================
 */

export const getCommunicationHistory = async (businessId, params = {}) => {
  return getCommunications(businessId, params);
};

/*
 * ============================================================
 * SEND COMMUNICATION
 * ============================================================
 */

export const sendCommunication = async (businessId, data = {}) => {
  if (!businessId) {
    throw new Error("Business ID is required.");
  }

  const payload = {
    ...data,
    channel: String(data?.channel || "").toUpperCase(),
  };

  if (!payload.channel) {
    throw new Error("Communication channel is required.");
  }

  if (!["CALL", "CONVERSATION"].includes(payload.channel) && !payload.to) {
    throw new Error("Recipient is required.");
  }

  if (!["CALL"].includes(payload.channel) && !payload.body) {
    throw new Error("Message body is required.");
  }

  const response = await api.post(`/communications/business/${businessId}/send`, payload);

  return unwrap(response);
};

/*
 * ============================================================
 * EMAIL
 * ============================================================
 */

export const sendEmailCommunication = async (businessId, data = {}) => {
  return sendCommunication(businessId, {
    ...data,
    channel: "EMAIL",
  });
};

/*
 * ============================================================
 * WHATSAPP
 * ============================================================
 */

export const sendWhatsAppCommunication = async (businessId, data = {}) => {
  return sendCommunication(businessId, {
    ...data,
    channel: "WHATSAPP",
  });
};

/*
 * ============================================================
 * SMS
 * ============================================================
 */

export const sendSmsCommunication = async (businessId, data = {}) => {
  return sendCommunication(businessId, {
    ...data,
    channel: "SMS",
  });
};

/*
 * ============================================================
 * NORMALIZER
 * ============================================================
 */

export const getCommunicationSenders = async (businessId) => {
  if (!businessId) throw new Error("Business ID is required.");
  const response = await api.get(`/communications/business/${businessId}/senders`);
  return unwrap(response);
};

export const sendConversationCommunication = async (businessId, data = {}) =>
  sendCommunication(businessId, { ...data, channel: "CONVERSATION" });

export const sendCallCommunication = async (businessId, data = {}) =>
  sendCommunication(businessId, { ...data, channel: "CALL" });

export const extractCommunicationRows = (response) => {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.items)) {
    return response.items;
  }

  if (Array.isArray(response?.data?.items)) {
    return response.data.items;
  }

  return [];
};

/*
 * ============================================================
 * DEFAULT EXPORT
 * ============================================================
 */

export default {
  getCommunications,
  getCommunicationHistory,
  sendCommunication,
  sendEmailCommunication,
  sendWhatsAppCommunication,
  sendSmsCommunication,
  getCommunicationSenders,
  sendConversationCommunication,
  sendCallCommunication,
  extractCommunicationRows,
};
