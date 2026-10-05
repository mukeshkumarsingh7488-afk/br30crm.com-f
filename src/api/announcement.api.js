import api from "./api";

/*
 * ============================================================
 * PUBLIC ANNOUNCEMENT APIs
 * ============================================================
 */

/*
 * Get public announcements
 *
 * GET /api/v1/announcements/public
 *
 * No authentication required.
 *
 * Params:
 * type
 * releaseType
 * page
 * limit
 */
export const getPublicAnnouncements = async (params = {}) => {
  const response = await api.get("/announcements/public", {
    params,
  });

  return response.data;
};

/*
 * ============================================================
 * AUTHENTICATED / ADMIN ANNOUNCEMENT APIs
 * ============================================================
 *
 * These APIs are kept ready for the upcoming Admin Panel.
 */

/*
 * Get announcements
 *
 * GET /api/v1/announcements
 */
export const getAnnouncements = async (params = {}) => {
  const response = await api.get("/announcements", {
    params,
  });

  return response.data;
};

/*
 * Create announcement
 *
 * POST /api/v1/announcements
 */
export const createAnnouncement = async (data) => {
  const response = await api.post("/announcements", data);

  return response.data;
};

/*
 * Get announcement by slug
 *
 * GET /api/v1/announcements/slug/:slug
 *
 * NOTE:
 * This endpoint is currently authenticated on the backend.
 */
export const getAnnouncementBySlug = async (slug) => {
  if (!slug) {
    throw new Error("Announcement slug is required.");
  }

  const response = await api.get(`/announcements/slug/${encodeURIComponent(slug)}`);

  return response.data;
};

/*
 * Publish announcement
 *
 * PATCH /api/v1/announcements/:announcementId/publish
 */
export const publishAnnouncement = async (announcementId) => {
  if (!announcementId) {
    throw new Error("Announcement ID is required.");
  }

  const response = await api.patch(`/announcements/${announcementId}/publish`);

  return response.data;
};

/*
 * Archive announcement
 *
 * PATCH /api/v1/announcements/:announcementId/archive
 */
export const archiveAnnouncement = async (announcementId) => {
  if (!announcementId) {
    throw new Error("Announcement ID is required.");
  }

  const response = await api.patch(`/announcements/${announcementId}/archive`);

  return response.data;
};

/*
 * Update announcement
 *
 * PATCH /api/v1/announcements/:announcementId
 */
export const updateAnnouncement = async (announcementId, data) => {
  if (!announcementId) {
    throw new Error("Announcement ID is required.");
  }

  const response = await api.patch(`/announcements/${announcementId}`, data);

  return response.data;
};

/*
 * Delete / archive announcement
 *
 * DELETE /api/v1/announcements/:announcementId
 */
export const deleteAnnouncement = async (announcementId) => {
  if (!announcementId) {
    throw new Error("Announcement ID is required.");
  }

  const response = await api.delete(`/announcements/${announcementId}`);

  return response.data;
};

/*
 * Get announcement by ID
 *
 * GET /api/v1/announcements/:announcementId
 */
export const getAnnouncementById = async (announcementId) => {
  if (!announcementId) {
    throw new Error("Announcement ID is required.");
  }

  const response = await api.get(`/announcements/${announcementId}`);

  return response.data;
};
