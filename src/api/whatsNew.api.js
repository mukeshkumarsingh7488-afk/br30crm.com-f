import api from "./api";

export const getPublicWhatsNew = async (params = {}) => {
  const response = await api.get("/whatsnew", {
    params,
  });

  return response.data;
};

export const getPublicWhatsNewBySlug = async (slug) => {
  if (!slug) {
    throw new Error("What's New slug is required.");
  }

  const response = await api.get(`/whatsnew/slug/${encodeURIComponent(slug)}`);

  return response.data;
};

export const getAllWhatsNew = async (params = {}) => {
  const response = await api.get("/whatsnew/admin", {
    params,
  });

  return response.data;
};

export const getWhatsNewById = async (whatsNewId) => {
  if (!whatsNewId) {
    throw new Error("What's New ID is required.");
  }

  const response = await api.get(`/whatsnew/admin/${encodeURIComponent(whatsNewId)}`);

  return response.data;
};

const buildPayload = (data = {}) => {
  const mediaType = data.mediaType || "NONE";

  const features = Array.isArray(data.features)
    ? data.features.map((item) => String(item).trim()).filter(Boolean)
    : typeof data.features === "string"
      ? data.features
          .split(/\r?\n|,/)
          .map((item) => item.trim())
          .filter(Boolean)
      : [];

  const payload = {
    title: String(data.title || "").trim(),
    slug: String(data.slug || "").trim(),
    version: String(data.version || "").trim(),
    type: data.type || "NEW_FEATURE",
    status: data.status || "DRAFT",
    releaseDate: data.releaseDate || null,
    sortOrder: Number(data.sortOrder) || 0,
    shortDescription: String(data.shortDescription || "").trim(),
    description: String(data.description || "").trim(),
    features,
    howToUse: String(data.howToUse || "").trim(),

    mediaType,

    imageUrl: mediaType === "IMAGE" ? String(data.imageUrl || "").trim() : null,

    videoUrl: mediaType === "VIDEO" ? String(data.videoUrl || "").trim() : null,

    videoMuted: mediaType === "VIDEO" ? data.videoMuted !== false : true,

    videoAutoplay: mediaType === "VIDEO" ? data.videoAutoplay !== false : true,

    videoLoop: mediaType === "VIDEO" ? data.videoLoop !== false : true,

    actionText: String(data.actionText || "").trim(),
    actionUrl: String(data.actionUrl || "").trim(),
  };

  return payload;
};

export const createWhatsNew = async (data = {}) => {
  const payload = buildPayload(data);

  const response = await api.post("/whatsnew/admin", payload);

  return response.data;
};

export const updateWhatsNew = async (whatsNewId, data = {}) => {
  if (!whatsNewId) {
    throw new Error("What's New ID is required.");
  }

  const payload = buildPayload(data);

  const response = await api.patch(`/whatsnew/admin/${encodeURIComponent(whatsNewId)}`, payload);

  return response.data;
};

export const updateWhatsNewStatus = async (whatsNewId, status) => {
  if (!whatsNewId) {
    throw new Error("What's New ID is required.");
  }

  if (!["DRAFT", "PUBLISHED", "ARCHIVED"].includes(status)) {
    throw new Error("Invalid What's New status.");
  }

  const response = await api.patch(`/whatsnew/admin/${encodeURIComponent(whatsNewId)}/status`, {
    status,
  });

  return response.data;
};

export const deleteWhatsNew = async (whatsNewId) => {
  if (!whatsNewId) {
    throw new Error("What's New ID is required.");
  }

  const response = await api.delete(`/whatsnew/admin/${encodeURIComponent(whatsNewId)}`);

  return response.data;
};
