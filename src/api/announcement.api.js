import api from "./api";

export const getPublicAnnouncements = async (params = {}) => {
  const response = await api.get("/announcements/public", {
    params,
  });

  return response.data;
};

export const getAnnouncements = async (params = {}) => {
  const response = await api.get("/announcements", {
    params,
  });

  return response.data;
};

export const createAnnouncement = async (data) => {
  const response = await api.post("/announcements", data);

  return response.data;
};

export const getAnnouncementBySlug = async (slug) => {
  if (!slug) {
    throw new Error("Announcement slug is required.");
  }

  const response = await api.get(`/announcements/slug/${encodeURIComponent(slug)}`);

  return response.data;
};

export const publishAnnouncement = async (announcementId) => {
  if (!announcementId) {
    throw new Error("Announcement ID is required.");
  }

  const response = await api.patch(`/announcements/${announcementId}/publish`);

  return response.data;
};

export const archiveAnnouncement = async (announcementId) => {
  if (!announcementId) {
    throw new Error("Announcement ID is required.");
  }

  const response = await api.patch(`/announcements/${announcementId}/archive`);

  return response.data;
};

export const updateAnnouncement = async (announcementId, data) => {
  if (!announcementId) {
    throw new Error("Announcement ID is required.");
  }

  const response = await api.patch(`/announcements/${announcementId}`, data);

  return response.data;
};

export const deleteAnnouncement = async (announcementId) => {
  if (!announcementId) {
    throw new Error("Announcement ID is required.");
  }

  const response = await api.delete(`/announcements/${announcementId}`);

  return response.data;
};

export const getAnnouncementById = async (announcementId) => {
  if (!announcementId) {
    throw new Error("Announcement ID is required.");
  }

  const response = await api.get(`/announcements/${announcementId}`);

  return response.data;
};
