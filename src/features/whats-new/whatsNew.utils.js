export const WHATS_NEW_TYPES = {
  NEW_FEATURE: "NEW_FEATURE",
  IMPROVEMENT: "IMPROVEMENT",
  FIX: "FIX",
  UPCOMING: "UPCOMING",
};

export const WHATS_NEW_STATUS = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  ARCHIVED: "ARCHIVED",
};

export const whatsNewTypeLabel = (type) => {
  const labels = {
    NEW_FEATURE: "New Feature",
    IMPROVEMENT: "Improvement",
    FIX: "Fix",
    UPCOMING: "Upcoming",
  };

  return labels[type] || "Update";
};

export const whatsNewTypeClass = (type) => {
  const classes = {
    NEW_FEATURE: "whats-new-type-new",
    IMPROVEMENT: "whats-new-type-improvement",
    FIX: "whats-new-type-fix",
    UPCOMING: "whats-new-type-upcoming",
  };

  return classes[type] || "whats-new-type-default";
};

export const whatsNewStatusLabel = (status) => {
  const labels = {
    DRAFT: "Draft",
    PUBLISHED: "Published",
    ARCHIVED: "Archived",
  };

  return labels[status] || status || "Draft";
};

export const whatsNewStatusClass = (status) => {
  return `whats-new-status-${String(status || "DRAFT").toLowerCase()}`;
};

/* ============================================================
 * DATE HELPERS
 * ============================================================
 */

export const formatWhatsNewDate = (date) => {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const formatWhatsNewDateTime = (date) => {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/* ============================================================
 * YOUTUBE HELPERS
 * ============================================================
 */

export const getYouTubeVideoId = (url) => {
  if (!url) return "";

  const value = String(url).trim();

  try {
    const parsed = new URL(value);
    const hostname = parsed.hostname.toLowerCase();

    let videoId = "";

    /*
     * youtu.be/VIDEO_ID
     */
    if (hostname === "youtu.be" || hostname.endsWith(".youtu.be")) {
      videoId = parsed.pathname.split("/").filter(Boolean)[0] || "";
    }

    /*
     * youtube.com/watch?v=VIDEO_ID
     */
    if ((hostname === "youtube.com" || hostname === "www.youtube.com" || hostname.endsWith(".youtube.com")) && parsed.pathname === "/watch") {
      videoId = parsed.searchParams.get("v") || "";
    }

    /*
     * youtube.com/shorts/VIDEO_ID
     */
    if ((hostname === "youtube.com" || hostname === "www.youtube.com" || hostname.endsWith(".youtube.com")) && parsed.pathname.startsWith("/shorts/")) {
      videoId = parsed.pathname.split("/")[2] || "";
    }

    /*
     * youtube.com/embed/VIDEO_ID
     */
    if ((hostname === "youtube.com" || hostname === "www.youtube.com" || hostname.endsWith(".youtube.com")) && parsed.pathname.startsWith("/embed/")) {
      videoId = parsed.pathname.split("/")[2] || "";
    }

    /*
     * youtube.com/live/VIDEO_ID
     */
    if ((hostname === "youtube.com" || hostname === "www.youtube.com" || hostname.endsWith(".youtube.com")) && parsed.pathname.startsWith("/live/")) {
      videoId = parsed.pathname.split("/")[2] || "";
    }

    return String(videoId).split(/[?&/]/)[0].trim();
  } catch {
    return "";
  }
};

export const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;

  const value = String(url).trim();

  if (!value) {
    return null;
  }

  const videoId = getYouTubeVideoId(value);

  if (!videoId) {
    return null;
  }

  return `https://www.youtube.com/embed/${videoId}`;
};

/* ============================================================
 * IMAGE URL
 * ============================================================
 *
 * WhatsNew IMAGE flow:
 *
 * Admin -> Cloudinary URL
 *       -> imageUrl
 *       -> MongoDB
 *       -> Public/Admin API
 *       -> <img src={imageUrl} />
 *
 * Cloudinary absolute URLs are returned directly.
 *
 * Relative URLs are still supported for backward compatibility.
 */

export const getWhatsNewImageUrl = (imageUrl) => {
  if (!imageUrl) return null;

  const value = String(imageUrl).trim();

  if (!value) {
    return null;
  }

  /*
   * Absolute URL
   *
   * Cloudinary:
   * https://res.cloudinary.com/...
   *
   * Any other valid HTTP/HTTPS image URL is also supported.
   */
  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  /*
   * Backward compatibility for old relative image paths.
   */
  const apiBaseUrl = String(import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

  if (!apiBaseUrl) {
    return value;
  }

  const backendOrigin = apiBaseUrl.replace(/\/api(?:\/v\d+)?$/i, "");

  return `${backendOrigin}${value.startsWith("/") ? value : `/${value}`}`;
};

/* ============================================================
 * MEDIA
 * ============================================================
 */

export const getWhatsNewMedia = (item) => {
  if (!item) {
    return {
      type: "NONE",
      url: null,
    };
  }

  /*
   * IMAGE
   */
  if (item.mediaType === "IMAGE" && item.imageUrl) {
    const imageUrl = getWhatsNewImageUrl(item.imageUrl);

    if (imageUrl) {
      return {
        type: "IMAGE",
        url: imageUrl,
      };
    }
  }

  /*
   * VIDEO
   */
  if (item.mediaType === "VIDEO" && item.videoUrl) {
    const embedUrl = getYouTubeEmbedUrl(item.videoUrl);

    if (embedUrl) {
      return {
        type: "VIDEO",
        url: embedUrl,
      };
    }
  }

  /*
   * NONE / INVALID MEDIA
   */
  return {
    type: "NONE",
    url: null,
  };
};

/* ============================================================
 * RESPONSE NORMALIZATION
 * ============================================================
 *
 * Supports:
 *
 * {
 *   success: true,
 *   data: {
 *     items: [],
 *     pagination: {}
 *   },
 *   message: "..."
 * }
 *
 * Axios API functions return response.data.
 */

export const normalizeWhatsNewResponse = (response) => {
  const envelope = response?.data || response?.result || response || {};

  const payload = envelope?.items || envelope?.pagination ? envelope : envelope?.data || envelope?.result || envelope;

  const items = Array.isArray(payload?.items) ? payload.items : Array.isArray(payload?.results) ? payload.results : Array.isArray(payload) ? payload : [];

  const rawPagination = payload?.pagination || {};

  const page = Number(rawPagination.page) || 1;

  const limit = Number(rawPagination.limit) || 12;

  const total = Number(rawPagination.total) || 0;

  const calculatedTotalPages = total > 0 ? Math.ceil(total / limit) : 0;

  return {
    items,

    pagination: {
      page,
      limit,
      total,
      totalPages: Number(rawPagination.totalPages) || calculatedTotalPages,
    },
  };
};

/* ============================================================
 * API ERROR
 * ============================================================
 */

export const getApiErrorMessage = (error, fallback = "Something went wrong.") => {
  const responseData = error?.response?.data;

  if (Array.isArray(responseData?.errors) && responseData.errors.length) {
    return responseData.errors
      .map((item) => item?.msg || item?.message)
      .filter(Boolean)
      .join("\n");
  }

  if (Array.isArray(responseData?.data?.errors) && responseData.data.errors.length) {
    return responseData.data.errors
      .map((item) => item?.msg || item?.message)
      .filter(Boolean)
      .join("\n");
  }

  return responseData?.message || responseData?.data?.message || error?.message || fallback;
};

/* ============================================================
 * FEATURES
 * ============================================================
 */

export const normalizeWhatsNewFeatures = (features) => {
  if (Array.isArray(features)) {
    return features.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof features === "string") {
    return features
      .split(/\r?\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};
