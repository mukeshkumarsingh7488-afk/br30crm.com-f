import api from "./api";

const unwrap = (response) => response?.data?.data ?? response?.data ?? response ?? {};

export const getQrCodes = async (businessId, params = {}) => {
  const response = await api.get(`/qr/business/${businessId}`, { params });
  return unwrap(response);
};

export const getQrCodeById = async (businessId, qrId) => {
  const response = await api.get(`/qr/business/${businessId}/${qrId}`);
  return unwrap(response);
};

export const createQrCode = async (businessId, data) => {
  const response = await api.post(`/qr/business/${businessId}`, data);
  return unwrap(response);
};

export const updateQrCode = async (businessId, qrId, data) => {
  const response = await api.patch(`/qr/business/${businessId}/${qrId}`, data);
  return unwrap(response);
};

export const deleteQrCode = async (businessId, qrId) => {
  const response = await api.delete(`/qr/business/${businessId}/${qrId}`);
  return unwrap(response);
};

export const regenerateQrCode = async (businessId, qrId, data = {}) => {
  const response = await api.post(`/qr/business/${businessId}/${qrId}/regenerate`, data);
  return unwrap(response);
};

export const getQrImage = async (businessId, qrId) => {
  const response = await api.get(`/qr/business/${businessId}/${qrId}/image`, {
    responseType: "blob",
  });

  return response.data;
};

export default {
  getQrCodes,
  getQrCodeById,
  createQrCode,
  updateQrCode,
  deleteQrCode,
  regenerateQrCode,
  getQrImage,
};
