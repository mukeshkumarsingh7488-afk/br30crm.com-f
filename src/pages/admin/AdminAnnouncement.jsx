import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, Archive, CalendarDays, Check, ChevronLeft, ChevronRight, Edit3, Eye, FileImage, Filter, Image as ImageIcon, LoaderCircle, Megaphone, Plus, RefreshCw, Search, ShieldCheck, Sparkles, Trash2, Video, X } from "lucide-react";
import Swal from "sweetalert2";

import { createAnnouncement, deleteAnnouncement, getAnnouncements, getAnnouncementById, publishAnnouncement, updateAnnouncement } from "../../api/announcement.api";

const TYPE_OPTIONS = [
  { value: "", label: "All Types" },
  { value: "NEW_FEATURE", label: "New Feature" },
  { value: "IMPROVEMENT", label: "Improvement" },
  { value: "UPDATE", label: "Update" },
  { value: "FIX", label: "Fix" },
  { value: "SECURITY", label: "Security" },
  { value: "MAINTENANCE", label: "Maintenance" },
  { value: "RELEASE", label: "Release" },
];

const FORM_TYPE_OPTIONS = [
  { value: "NEW_FEATURE", label: "New Feature" },
  { value: "IMPROVEMENT", label: "Improvement" },
  { value: "UPDATE", label: "Update" },
  { value: "FIX", label: "Fix" },
  { value: "SECURITY", label: "Security" },
  { value: "MAINTENANCE", label: "Maintenance" },
  { value: "RELEASE", label: "Release" },
];

const STATUS_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "PUBLISHED", label: "Published" },
  { value: "DRAFT", label: "Draft" },
  { value: "ARCHIVED", label: "Archived" },
];

const FORM_STATUS_OPTIONS = [
  { value: "DRAFT", label: "Draft" },
  { value: "PUBLISHED", label: "Published" },
  { value: "ARCHIVED", label: "Archived" },
];

const RELEASE_OPTIONS = [
  { value: "", label: "All Releases" },
  { value: "CURRENT", label: "Current" },
  { value: "UPCOMING", label: "Upcoming" },
];

const VISIBILITY_OPTIONS = [
  { value: "PUBLIC", label: "Public" },
  { value: "AUTHENTICATED", label: "Authenticated" },
  { value: "BUSINESS", label: "Business" },
];

const MEDIA_OPTIONS = [
  { value: "NONE", label: "None", icon: FileImage },
  { value: "IMAGE", label: "Image", icon: ImageIcon },
  { value: "VIDEO", label: "Video", icon: Video },
];

const AUDIENCE_OPTIONS = [
  { value: "ALL", label: "All" },
  { value: "ADMIN", label: "Admin" },
  { value: "MANAGER", label: "Manager" },
  { value: "SALES", label: "Sales" },
  { value: "STAFF", label: "Staff" },
];

const EMPTY_FORM = {
  title: "",
  slug: "",
  shortDescription: "",
  description: "",
  type: "NEW_FEATURE",
  releaseType: "CURRENT",
  status: "DRAFT",
  visibility: "PUBLIC",
  scope: "SYSTEM",
  businessId: "",
  version: "",
  tagsText: "",
  imageUrl: "",
  videoUrl: "",
  videoThumbnailUrl: "",
  mediaType: "NONE",
  ctaText: "",
  ctaUrl: "",
  targetAudience: "ALL",
  isFeatured: false,
  displayOrder: 0,
  releaseDate: "",
};

const slugify = (value) => {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 220);
};

const getDateInputValue = (date) => {
  if (!date) {
    return "";
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatDate = (date) => {
  if (!date) {
    return "—";
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "—";
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (date) => {
  if (!date) {
    return "—";
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "—";
  }

  return parsed.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getTypeLabel = (type) => {
  return TYPE_OPTIONS.find((option) => option.value === type)?.label || type || "—";
};

const getReleaseLabel = (releaseType) => {
  return releaseType === "UPCOMING" ? "Upcoming" : "Current";
};

const getStatusClass = (status) => {
  return `admin-announcement-status-${String(status || "DRAFT").toLowerCase()}`;
};

const getYouTubeEmbed = (url) => {
  if (!url) {
    return "";
  }

  const value = String(url).trim();

  if (value.includes("youtube.com/embed/")) {
    return value;
  }

  try {
    const parsed = new URL(value);

    let id = "";

    if (parsed.hostname === "youtu.be" || parsed.hostname.endsWith(".youtu.be")) {
      id = parsed.pathname.split("/").filter(Boolean)[0] || "";
    }

    if (parsed.hostname.includes("youtube.com") && parsed.pathname === "/watch") {
      id = parsed.searchParams.get("v") || "";
    }

    if (parsed.hostname.includes("youtube.com") && parsed.pathname.startsWith("/shorts/")) {
      id = parsed.pathname.split("/")[2] || "";
    }

    if (parsed.hostname.includes("youtube.com") && parsed.pathname.startsWith("/embed/")) {
      id = parsed.pathname.split("/")[2] || "";
    }

    if (parsed.hostname.includes("youtube.com") && parsed.pathname.startsWith("/live/")) {
      id = parsed.pathname.split("/")[2] || "";
    }

    if (!id) {
      return "";
    }

    return `https://www.youtube.com/embed/${id.split(/[?&/]/)[0]}`;
  } catch {
    return "";
  }
};

const getInitialForm = (item = null) => {
  if (!item) {
    return {
      ...EMPTY_FORM,
    };
  }

  return {
    title: item.title || "",
    slug: item.slug || "",
    shortDescription: item.shortDescription || "",
    description: item.description || "",
    type: item.type || "NEW_FEATURE",
    releaseType: item.releaseType || "CURRENT",
    status: item.status || "DRAFT",
    visibility: item.visibility || "PUBLIC",
    scope: item.scope || "SYSTEM",
    businessId: item.businessId?._id || item.businessId || "",
    version: item.version || "",
    tagsText: Array.isArray(item.tags) ? item.tags.join(", ") : "",
    imageUrl: item.imageUrl || "",
    videoUrl: item.videoUrl || "",
    videoThumbnailUrl: item.videoThumbnailUrl || "",
    mediaType: item.mediaType || "NONE",
    ctaText: item.ctaText || "",
    ctaUrl: item.ctaUrl || "",
    targetAudience: item.targetAudience || "ALL",
    isFeatured: Boolean(item.isFeatured),
    displayOrder: Number(item.displayOrder) || 0,
    releaseDate: getDateInputValue(item.releaseDate),
  };
};

const getApiErrorMessage = (error, fallback = "Something went wrong.") => {
  return error?.response?.data?.message || error?.response?.data?.error || error?.message || fallback;
};

function AdminAnnouncement() {
  const [items, setItems] = useState([]);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [releaseFilter, setReleaseFilter] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [showPreview, setShowPreview] = useState(false);
  const [previewItem, setPreviewItem] = useState(null);

  const [form, setForm] = useState(EMPTY_FORM);

  const [saving, setSaving] = useState(false);
  const [loadingViewId, setLoadingViewId] = useState(null);
  const [actionId, setActionId] = useState(null);

  const [error, setError] = useState("");

  const isEditing = Boolean(editingItem);

  const getSweetAlertTheme = useCallback(() => {
    const theme = document.documentElement.getAttribute("data-admin-theme");
    const isDark = theme === "dark";

    return {
      background: isDark ? "#0f172a" : "#ffffff",
      color: isDark ? "#f8fafc" : "#0f172a",
      confirmButtonColor: isDark ? "#6366f1" : "#2563eb",
      cancelButtonColor: isDark ? "#334155" : "#e2e8f0",
    };
  }, []);

  const loadItems = useCallback(
    async (page = 1, silent = false) => {
      try {
        setError("");

        if (silent) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const response = await getAnnouncements({
          page,
          limit: pagination.limit,
          ...(typeFilter ? { type: typeFilter } : {}),
          ...(releaseFilter ? { releaseType: releaseFilter } : {}),
          ...(statusFilter ? { status: statusFilter } : {}),
        });

        const data = response?.data || response || {};

        const announcements = Array.isArray(data.announcements) ? data.announcements : [];

        const responsePagination = data.pagination || {};

        setItems(announcements);

        setPagination({
          page: Number(responsePagination.page) || page,
          limit: Number(responsePagination.limit) || pagination.limit,
          total: Number(responsePagination.total) || announcements.length,
          totalPages: Number(responsePagination.totalPages) || 0,
        });
      } catch (err) {
        console.error("Admin Announcements load error:", err);

        const message = getApiErrorMessage(err, "Unable to load announcements.");

        setError(message);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [pagination.limit, typeFilter, statusFilter, releaseFilter]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      loadItems(1);
    }, 250);

    return () => clearTimeout(timer);
  }, [typeFilter, statusFilter, releaseFilter]);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return items;
    }

    return items.filter((item) => {
      const values = [item.title, item.slug, item.shortDescription, item.description, item.version, item.type, item.status, item.releaseType, item.visibility, ...(Array.isArray(item.tags) ? item.tags : [])];

      return values.some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(query)
      );
    });
  }, [items, search]);

  const stats = useMemo(() => {
    const total = pagination.total;

    const published = items.filter((item) => item.status === "PUBLISHED").length;

    const drafts = items.filter((item) => item.status === "DRAFT").length;

    const archived = items.filter((item) => item.status === "ARCHIVED").length;

    const featured = items.filter((item) => item.isFeatured).length;

    return {
      total,
      published,
      drafts,
      archived,
      featured,
    };
  }, [items, pagination.total]);

  const openCreate = () => {
    setEditingItem(null);
    setForm({
      ...EMPTY_FORM,
    });
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setForm(getInitialForm(item));
    setShowForm(true);
  };

  const closeForm = () => {
    if (saving) {
      return;
    }

    setShowForm(false);
    setEditingItem(null);
    setForm({
      ...EMPTY_FORM,
    });
  };

  const openPreview = async (item) => {
    if (!item?._id) {
      return;
    }

    setLoadingViewId(item._id);

    try {
      const response = await getAnnouncementById(item._id);

      const data = response?.data || response || {};
      const announcement = data.announcement || data;

      setPreviewItem(announcement || item);
      setShowPreview(true);
    } catch (err) {
      console.error("Announcement view error:", err);

      const message = getApiErrorMessage(err, "Unable to load announcement details.");

      await Swal.fire({
        ...getSweetAlertTheme(),
        icon: "error",
        title: "Unable to open announcement",
        text: message,
        confirmButtonColor: getSweetAlertTheme().confirmButtonColor,
      });
    } finally {
      setLoadingViewId(null);
    }
  };

  const closePreview = () => {
    setShowPreview(false);
    setPreviewItem(null);
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleTitleChange = (event) => {
    const value = event.target.value;

    setForm((current) => ({
      ...current,
      title: value,
      ...(editingItem
        ? {}
        : {
            slug: slugify(value),
          }),
    }));
  };

  const handleMediaTypeChange = (mediaType) => {
    setForm((current) => {
      if (mediaType === "IMAGE") {
        return {
          ...current,
          mediaType,
          videoUrl: "",
          videoThumbnailUrl: "",
        };
      }

      if (mediaType === "VIDEO") {
        return {
          ...current,
          mediaType,
          imageUrl: "",
        };
      }

      return {
        ...current,
        mediaType: "NONE",
        imageUrl: "",
        videoUrl: "",
        videoThumbnailUrl: "",
      };
    });
  };

  const validateForm = () => {
    if (!form.title.trim()) {
      return "Title is required.";
    }

    if (form.title.trim().length < 2) {
      return "Title must be at least 2 characters.";
    }

    if (!form.slug.trim()) {
      return "Slug is required.";
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug.trim())) {
      return "Slug can contain lowercase letters, numbers and hyphens only.";
    }

    if (!form.shortDescription.trim()) {
      return "Short description is required.";
    }

    if (form.shortDescription.trim().length > 500) {
      return "Short description cannot exceed 500 characters.";
    }

    if (!form.description.trim()) {
      return "Description is required.";
    }

    if (form.description.trim().length > 10000) {
      return "Description cannot exceed 10000 characters.";
    }

    if (form.scope === "BUSINESS" && !form.businessId.trim()) {
      return "Business ID is required for BUSINESS scoped announcements.";
    }

    if (form.scope === "SYSTEM" && form.businessId.trim()) {
      return "Business ID must be empty for SYSTEM scoped announcements.";
    }

    if (form.mediaType === "IMAGE") {
      if (!form.imageUrl.trim()) {
        return "Image URL is required for image media.";
      }

      try {
        const parsed = new URL(form.imageUrl.trim());

        if (!["http:", "https:"].includes(parsed.protocol)) {
          return "Please enter a valid image URL.";
        }
      } catch {
        return "Please enter a valid image URL.";
      }
    }

    if (form.mediaType === "VIDEO") {
      if (!form.videoUrl.trim()) {
        return "Video URL is required for video media.";
      }

      try {
        const parsed = new URL(form.videoUrl.trim());

        if (!["http:", "https:"].includes(parsed.protocol)) {
          return "Please enter a valid video URL.";
        }
      } catch {
        return "Please enter a valid video URL.";
      }

      if (form.videoThumbnailUrl.trim()) {
        try {
          const parsedThumbnail = new URL(form.videoThumbnailUrl.trim());

          if (!["http:", "https:"].includes(parsedThumbnail.protocol)) {
            return "Please enter a valid video thumbnail URL.";
          }
        } catch {
          return "Please enter a valid video thumbnail URL.";
        }
      }
    }

    if (form.ctaText.trim() && form.ctaText.trim().length > 100) {
      return "CTA text cannot exceed 100 characters.";
    }

    if (form.ctaUrl.trim()) {
      const ctaUrl = form.ctaUrl.trim();

      if (!ctaUrl.startsWith("/") || ctaUrl.startsWith("//")) {
        return "CTA URL must be an internal path like /login.";
      }

      if (/^https?:\/\//i.test(ctaUrl)) {
        return "Full URLs are not allowed. Use an internal path like /login.";
      }
    }

    if (form.version.trim().length > 50) {
      return "Version cannot exceed 50 characters.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      const colors = getSweetAlertTheme();

      await Swal.fire({
        icon: "warning",
        title: "Check the form",
        text: validationError,
        background: colors.background,
        color: colors.color,
        confirmButtonColor: colors.confirmButtonColor,
      });

      return;
    }

    try {
      setSaving(true);
      setError("");

      const tags = form.tagsText
        .split(",")
        .map((tag) => tag.trim().toLowerCase())
        .filter(Boolean);

      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        shortDescription: form.shortDescription.trim(),
        description: form.description.trim(),
        type: form.type,
        releaseType: form.releaseType,
        status: form.status,
        visibility: form.visibility,
        scope: form.scope,
        businessId: form.scope === "BUSINESS" ? form.businessId.trim() : null,
        version: form.version.trim() || null,
        tags,
        imageUrl: form.mediaType === "IMAGE" ? form.imageUrl.trim() : null,
        videoUrl: form.mediaType === "VIDEO" ? form.videoUrl.trim() : null,
        videoThumbnailUrl: form.mediaType === "VIDEO" && form.videoThumbnailUrl.trim() ? form.videoThumbnailUrl.trim() : null,
        mediaType: form.mediaType,
        ctaText: form.ctaText.trim() || null,
        ctaUrl: form.ctaUrl.trim() || null,
        targetAudience: form.targetAudience,
        isFeatured: Boolean(form.isFeatured),
        displayOrder: Number(form.displayOrder) || 0,
        releaseDate: form.releaseDate || null,
      };

      if (isEditing) {
        await updateAnnouncement(editingItem._id, payload);
      } else {
        await createAnnouncement(payload);
      }

      const colors = getSweetAlertTheme();

      await Swal.fire({
        icon: "success",
        title: isEditing ? "Updated successfully" : "Created successfully",
        text: isEditing ? "Announcement has been updated." : "Announcement has been created.",
        timer: 1600,
        showConfirmButton: false,
        background: colors.background,
        color: colors.color,
      });

      setShowForm(false);
      setEditingItem(null);
      setForm({
        ...EMPTY_FORM,
      });

      loadItems(isEditing ? pagination.page : 1, true).catch((refreshError) => {
        console.error("Announcement refresh after save error:", refreshError);
      });
    } catch (err) {
      console.error("Announcement save error:", err);

      const message = getApiErrorMessage(err, "Unable to save announcement.");

      setError(message);

      const colors = getSweetAlertTheme();

      await Swal.fire({
        icon: "error",
        title: "Save failed",
        text: message,
        background: colors.background,
        color: colors.color,
        confirmButtonColor: colors.confirmButtonColor,
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async (item) => {
    if (!item?._id) {
      return;
    }

    const colors = getSweetAlertTheme();

    const result = await Swal.fire({
      icon: "question",
      title: "Publish this announcement?",
      text: `"${item.title || "This announcement"}" will become visible on the public announcements page.`,
      showCancelButton: true,
      confirmButtonText: "Publish",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      background: colors.background,
      color: colors.color,
      confirmButtonColor: colors.confirmButtonColor,
      cancelButtonColor: colors.cancelButtonColor,
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setActionId(item._id);

      await publishAnnouncement(item._id);

      await Swal.fire({
        icon: "success",
        title: "Published",
        text: "Announcement is now published.",
        timer: 1300,
        showConfirmButton: false,
        background: colors.background,
        color: colors.color,
      });

      await loadItems(pagination.page, true);
    } catch (err) {
      const message = getApiErrorMessage(err, "Unable to publish announcement.");

      await Swal.fire({
        icon: "error",
        title: "Publish failed",
        text: message,
        background: colors.background,
        color: colors.color,
        confirmButtonColor: colors.confirmButtonColor,
      });
    } finally {
      setActionId(null);
    }
  };

  const handleArchive = async (item) => {
    if (!item?._id) {
      return;
    }

    const colors = getSweetAlertTheme();

    const result = await Swal.fire({
      icon: "warning",
      title: item.status === "ARCHIVED" ? "Archive announcement?" : "Hide this announcement?",
      text: item.status === "ARCHIVED" ? `"${item.title || "This announcement"}" is already archived.` : `"${item.title || "This announcement"}" will be archived and hidden from the public feed.`,
      showCancelButton: true,
      confirmButtonText: item.status === "ARCHIVED" ? "Archive" : "Yes, hide it",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      background: colors.background,
      color: colors.color,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: colors.cancelButtonColor,
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setActionId(item._id);

      await deleteAnnouncement(item._id);

      await Swal.fire({
        icon: "success",
        title: "Announcement archived",
        text: "The announcement has been hidden from the public feed.",
        timer: 1500,
        showConfirmButton: false,
        background: colors.background,
        color: colors.color,
      });

      const targetPage = items.length === 1 && pagination.page > 1 ? pagination.page - 1 : pagination.page;

      await loadItems(targetPage, true);
    } catch (err) {
      const message = getApiErrorMessage(err, "Unable to archive announcement.");

      await Swal.fire({
        icon: "error",
        title: "Archive failed",
        text: message,
        background: colors.background,
        color: colors.color,
        confirmButtonColor: colors.confirmButtonColor,
      });
    } finally {
      setActionId(null);
    }
  };

  const handlePageChange = (nextPage) => {
    if (nextPage < 1 || (pagination.totalPages > 0 && nextPage > pagination.totalPages)) {
      return;
    }

    loadItems(nextPage);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleRefresh = () => {
    loadItems(pagination.page || 1, true);
  };

  const clearFilters = () => {
    setSearch("");
    setTypeFilter("");
    setStatusFilter("");
    setReleaseFilter("");
  };

  return (
    <main className="admin-announcement-page">
      <section className="admin-announcement-header">
        <div className="admin-announcement-heading">
          <h1>Announcements</h1>

          <p>Manage public announcements, releases, updates and important platform messages.</p>
        </div>

        <div className="admin-announcement-header-actions">
          <button type="button" className="admin-announcement-refresh" onClick={handleRefresh} disabled={loading || refreshing}>
            <RefreshCw size={17} className={refreshing ? "admin-announcement-spin" : ""} />
            Refresh
          </button>

          <button type="button" className="admin-announcement-create-btn" onClick={openCreate}>
            <Plus size={17} />
            Create Announcement
          </button>
        </div>
      </section>

      <section className="admin-announcement-stats">
        <div className="admin-announcement-stat-card">
          <span>Total</span>
          <strong>{stats.total}</strong>
        </div>

        <div className="admin-announcement-stat-card">
          <span>Published</span>
          <strong>{stats.published}</strong>
        </div>

        <div className="admin-announcement-stat-card">
          <span>Drafts</span>
          <strong>{stats.drafts}</strong>
        </div>

        <div className="admin-announcement-stat-card">
          <span>Archived</span>
          <strong>{stats.archived}</strong>
        </div>

        <div className="admin-announcement-stat-card">
          <span>Featured</span>
          <strong>{stats.featured}</strong>
        </div>
      </section>

      <section className="admin-announcement-toolbar">
        <div className="admin-announcement-search">
          <Search size={17} />

          <input type="text" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search title, slug, description..." />

          {search ? (
            <button type="button" onClick={() => setSearch("")} aria-label="Clear search">
              <X size={15} />
            </button>
          ) : null}
        </div>

        <div className="admin-announcement-filter">
          <Filter size={16} />

          <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
            {TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="admin-announcement-filter">
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="admin-announcement-filter">
          <select value={releaseFilter} onChange={(event) => setReleaseFilter(event.target.value)}>
            {RELEASE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {search || typeFilter || statusFilter || releaseFilter ? (
          <button type="button" className="admin-announcement-clear-filter" onClick={clearFilters}>
            Clear
          </button>
        ) : null}
      </section>

      {error ? (
        <section className="admin-announcement-error">
          <div>
            <AlertCircle size={20} />

            <div>
              <strong>Unable to load announcements</strong>

              <span>{error}</span>
            </div>
          </div>

          <button type="button" onClick={() => loadItems(pagination.page || 1, true)}>
            Try Again
          </button>
        </section>
      ) : null}

      {loading ? (
        <section className="admin-announcement-loading">
          <LoaderCircle size={34} className="admin-announcement-spin" />

          <h3>Loading Announcements</h3>

          <p>Fetching announcements from the server...</p>
        </section>
      ) : filteredItems.length === 0 ? (
        <section className="admin-announcement-empty">
          <div className="admin-announcement-empty-icon">
            <Megaphone size={28} />
          </div>

          <h2>{search || typeFilter || statusFilter || releaseFilter ? "No announcements found" : "No announcements yet"}</h2>

          <p>{search || typeFilter || statusFilter || releaseFilter ? "Try changing your search or filters." : "Create your first announcement to get started."}</p>

          {search || typeFilter || statusFilter || releaseFilter ? (
            <button type="button" onClick={clearFilters}>
              Clear Filters
            </button>
          ) : (
            <button type="button" onClick={openCreate}>
              <Plus size={17} />
              Create Announcement
            </button>
          )}
        </section>
      ) : (
        <>
          <section className="admin-announcement-table-card">
            <div className="admin-announcement-table-scroll">
              <table className="admin-announcement-table">
                <thead>
                  <tr>
                    <th>Announcement</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Release</th>
                    <th>Visibility</th>
                    <th>Version</th>
                    <th>Published</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredItems.map((item) => (
                    <tr key={item._id || item.slug}>
                      <td>
                        <div className="admin-announcement-update-cell">
                          <div className="admin-announcement-thumb">
                            {item.mediaType === "IMAGE" && item.imageUrl ? (
                              <img
                                src={item.imageUrl}
                                alt=""
                                onError={(event) => {
                                  event.currentTarget.style.display = "none";
                                }}
                              />
                            ) : item.mediaType === "VIDEO" ? (
                              <Video size={19} />
                            ) : (
                              <Megaphone size={19} />
                            )}
                          </div>

                          <div className="admin-announcement-update-info">
                            <strong>{item.title || "Untitled announcement"}</strong>

                            <span>{item.shortDescription || item.slug || "No description"}</span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="admin-announcement-type">{getTypeLabel(item.type)}</span>
                      </td>

                      <td>
                        <span className={`admin-announcement-status ${getStatusClass(item.status)}`}>
                          <i />
                          {item.status || "DRAFT"}
                        </span>
                      </td>

                      <td>
                        <span className="admin-announcement-release">{item.releaseType === "UPCOMING" ? "Upcoming" : "Current"}</span>
                      </td>

                      <td>
                        <span className="admin-announcement-visibility">{item.visibility || "PUBLIC"}</span>
                      </td>

                      <td>
                        <span className="admin-announcement-version">{item.version ? `v${item.version}` : "—"}</span>
                      </td>
                      <td>
                        <span className="admin-announcement-date">
                          <CalendarDays size={14} />
                          {formatDate(item.publishedAt || (item.status === "PUBLISHED" ? item.updatedAt : null))}
                        </span>
                      </td>

                      <td>
                        <div className="admin-announcement-actions">
                          <button type="button" className="admin-announcement-action view" onClick={() => openPreview(item)} disabled={loadingViewId === item._id} title="View">
                            {loadingViewId === item._id ? <LoaderCircle size={15} className="admin-announcement-spin" /> : <Eye size={15} />}
                          </button>

                          <button type="button" className="admin-announcement-action edit" onClick={() => openEdit(item)} disabled={actionId === item._id} title="Edit">
                            <Edit3 size={15} />
                          </button>

                          {item.status === "DRAFT" ? (
                            <button type="button" className="admin-announcement-action publish" onClick={() => handlePublish(item)} disabled={actionId === item._id} title="Publish">
                              {actionId === item._id ? <LoaderCircle size={15} className="admin-announcement-spin" /> : <Check size={15} />}
                            </button>
                          ) : null}

                          <button type="button" className="admin-announcement-action delete" onClick={() => handleArchive(item)} disabled={actionId === item._id} title="Delete / Archive">
                            {actionId === item._id ? <LoaderCircle size={15} className="admin-announcement-spin" /> : <Trash2 size={15} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {pagination.totalPages > 1 ? (
            <nav className="admin-announcement-pagination">
              <button type="button" disabled={pagination.page <= 1} onClick={() => handlePageChange(pagination.page - 1)}>
                <ChevronLeft size={18} />
              </button>

              <span>
                Page {pagination.page} of {pagination.totalPages}
              </span>

              <button type="button" disabled={pagination.page >= pagination.totalPages} onClick={() => handlePageChange(pagination.page + 1)}>
                <ChevronRight size={18} />
              </button>
            </nav>
          ) : null}
        </>
      )}

      {showForm ? (
        <div
          className="admin-announcement-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeForm();
            }
          }}>
          <div className="admin-announcement-form-modal">
            <div className="admin-announcement-modal-header">
              <div>
                <h2>{isEditing ? "Edit Announcement" : "Create Announcement"}</h2>

                <p>Manage announcement identity, visibility, content and media.</p>
              </div>

              <button type="button" onClick={closeForm} disabled={saving}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="admin-announcement-form">
              <div className="admin-announcement-form-section">
                <div className="admin-announcement-section-heading">
                  <h3>Basic information</h3>
                  <span>Define the announcement identity.</span>
                </div>

                <div className="admin-announcement-form-grid">
                  <label className="admin-announcement-field admin-announcement-field-full">
                    <span>
                      Title <b>*</b>
                    </span>

                    <input name="title" value={form.title} onChange={handleTitleChange} maxLength={200} placeholder="Example: New Farm Dashboard" required />
                  </label>

                  <label className="admin-announcement-field">
                    <span>
                      Slug <b>*</b>
                    </span>

                    <input name="slug" value={form.slug} onChange={handleChange} maxLength={220} placeholder="new-farm-dashboard" required />
                  </label>

                  <label className="admin-announcement-field">
                    <span>Version</span>

                    <input name="version" value={form.version} onChange={handleChange} maxLength={50} placeholder="1.0" />
                  </label>

                  <label className="admin-announcement-field">
                    <span>Type</span>

                    <select name="type" value={form.type} onChange={handleChange}>
                      {FORM_TYPE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="admin-announcement-field">
                    <span>Status</span>

                    <select name="status" value={form.status} onChange={handleChange}>
                      {FORM_STATUS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="admin-announcement-field">
                    <span>Release Type</span>

                    <select name="releaseType" value={form.releaseType} onChange={handleChange}>
                      <option value="CURRENT">Current</option>
                      <option value="UPCOMING">Upcoming</option>
                    </select>
                  </label>

                  <label className="admin-announcement-field">
                    <span>Visibility</span>

                    <select name="visibility" value={form.visibility} onChange={handleChange}>
                      {VISIBILITY_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="admin-announcement-field">
                    <span>Release Date</span>
                    <div className="admin-announcement-date-input-wrap">
                      <input type="date" name="releaseDate" value={form.releaseDate} onChange={handleChange} />
                      <CalendarDays size={17} className="admin-announcement-date-icon" />
                    </div>
                  </label>

                  <label className="admin-announcement-field">
                    <span>Display Order</span>

                    <input type="number" name="displayOrder" value={form.displayOrder} onChange={handleChange} step="1" />
                  </label>

                  <label className="admin-announcement-field">
                    <span>Target Audience</span>

                    <select name="targetAudience" value={form.targetAudience} onChange={handleChange}>
                      {AUDIENCE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="admin-announcement-field">
                    <span>Scope</span>

                    <select name="scope" value={form.scope} onChange={handleChange}>
                      <option value="SYSTEM">System</option>
                      <option value="BUSINESS">Business</option>
                    </select>
                  </label>

                  {form.scope === "BUSINESS" ? (
                    <label className="admin-announcement-field">
                      <span>
                        Business ID <b>*</b>
                      </span>

                      <input name="businessId" value={form.businessId} onChange={handleChange} placeholder="MongoDB Business ObjectId" />
                    </label>
                  ) : null}

                  <label className="admin-announcement-checkbox-field">
                    <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} />

                    <span>
                      <strong>Featured announcement</strong>
                      <small>Highlight this announcement in sorted results.</small>
                    </span>
                  </label>
                </div>
              </div>

              <div className="admin-announcement-form-section">
                <div className="admin-announcement-section-heading">
                  <h3>Content</h3>
                  <span>Add the announcement message.</span>
                </div>

                <div className="admin-announcement-form-grid">
                  <label className="admin-announcement-field admin-announcement-field-full">
                    <span>
                      Short Description <b>*</b>
                    </span>

                    <textarea name="shortDescription" value={form.shortDescription} onChange={handleChange} maxLength={500} rows={3} placeholder="Briefly explain the announcement..." required />

                    <small>
                      {form.shortDescription.length}
                      /500
                    </small>
                  </label>

                  <label className="admin-announcement-field admin-announcement-field-full">
                    <span>
                      Description <b>*</b>
                    </span>

                    <textarea name="description" value={form.description} onChange={handleChange} maxLength={10000} rows={8} placeholder="Explain the announcement in detail..." required />

                    <small>
                      {form.description.length}
                      /10000
                    </small>
                  </label>

                  <label className="admin-announcement-field admin-announcement-field-full">
                    <span>Tags</span>

                    <input name="tagsText" value={form.tagsText} onChange={handleChange} placeholder="farm, dashboard, update" />

                    <small>Separate tags with commas.</small>
                  </label>
                </div>
              </div>

              <div className="admin-announcement-form-section">
                <div className="admin-announcement-section-heading">
                  <h3>Media</h3>
                  <span>Add an image or video using the backend-supported URL fields.</span>
                </div>

                <div className="admin-announcement-media-tabs">
                  {MEDIA_OPTIONS.map((option) => {
                    const Icon = option.icon;

                    return (
                      <button type="button" key={option.value} className={form.mediaType === option.value ? "active" : ""} onClick={() => handleMediaTypeChange(option.value)}>
                        <Icon size={17} />
                        {option.label}
                      </button>
                    );
                  })}
                </div>

                {form.mediaType === "IMAGE" ? (
                  <div className="admin-announcement-media-area">
                    <label className="admin-announcement-field admin-announcement-field-full">
                      <span>
                        Image URL <b>*</b>
                      </span>

                      <input type="url" name="imageUrl" value={form.imageUrl} onChange={handleChange} maxLength={2000} placeholder="https://..." />
                    </label>

                    {form.imageUrl.trim() ? (
                      <div className="admin-announcement-image-preview">
                        <img
                          src={form.imageUrl.trim()}
                          alt="Announcement preview"
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                          }}
                        />
                      </div>
                    ) : null}
                  </div>
                ) : null}

                {form.mediaType === "VIDEO" ? (
                  <div className="admin-announcement-video-fields">
                    <label className="admin-announcement-field admin-announcement-field-full">
                      <span>
                        Video URL <b>*</b>
                      </span>

                      <input type="url" name="videoUrl" value={form.videoUrl} onChange={handleChange} maxLength={2000} placeholder="https://www.youtube.com/watch?v=..." />
                    </label>

                    <label className="admin-announcement-field admin-announcement-field-full">
                      <span>Video Thumbnail URL</span>

                      <input type="url" name="videoThumbnailUrl" value={form.videoThumbnailUrl} onChange={handleChange} maxLength={2000} placeholder="https://..." />
                    </label>

                    {form.videoUrl && getYouTubeEmbed(form.videoUrl) ? (
                      <div className="admin-announcement-video-preview">
                        <iframe src={getYouTubeEmbed(form.videoUrl)} title="Video preview" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>

              <div className="admin-announcement-form-section">
                <div className="admin-announcement-section-heading">
                  <h3>Call to action</h3>
                  <span>Optional CTA shown with the announcement details.</span>
                </div>

                <div className="admin-announcement-form-grid">
                  <label className="admin-announcement-field">
                    <span>CTA Text</span>

                    <input name="ctaText" value={form.ctaText} onChange={handleChange} maxLength={100} placeholder="Learn More" />
                  </label>

                  <label className="admin-announcement-field">
                    <span>CTA URL</span>

                    <input type="text" name="ctaUrl" value={form.ctaUrl} onChange={handleChange} maxLength={2000} placeholder="/login" inputMode="url" />
                  </label>
                </div>
              </div>

              <div className="admin-announcement-form-footer">
                <button type="button" className="admin-announcement-cancel-btn" onClick={closeForm} disabled={saving}>
                  Cancel
                </button>

                <button type="submit" className="admin-announcement-save-btn" disabled={saving}>
                  {saving ? (
                    <>
                      <LoaderCircle size={17} className="admin-announcement-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check size={17} />
                      {isEditing ? "Save Changes" : "Create Announcement"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {showPreview && previewItem ? (
        <div
          className="admin-announcement-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closePreview();
            }
          }}>
          <div className="admin-announcement-preview-modal">
            <div className="admin-announcement-modal-header">
              <div>
                <h2>{previewItem.title}</h2>

                <p>{previewItem.slug}</p>
              </div>

              <button type="button" onClick={closePreview}>
                <X size={20} />
              </button>
            </div>

            {previewItem.mediaType === "IMAGE" && previewItem.imageUrl ? (
              <div className="admin-announcement-preview-media">
                <img src={previewItem.imageUrl} alt={previewItem.title} />
              </div>
            ) : null}

            {previewItem.mediaType === "VIDEO" && previewItem.videoUrl ? (
              <div className="admin-announcement-preview-media">
                {getYouTubeEmbed(previewItem.videoUrl) ? (
                  <iframe src={getYouTubeEmbed(previewItem.videoUrl)} title={previewItem.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
                ) : (
                  <a href={previewItem.videoUrl} target="_blank" rel="noopener noreferrer" className="admin-announcement-video-link">
                    Open Video
                  </a>
                )}
              </div>
            ) : null}

            <div className="admin-announcement-preview-content">
              <div className="admin-announcement-preview-meta">
                <span>{getTypeLabel(previewItem.type)}</span>

                <span className={`admin-announcement-status ${getStatusClass(previewItem.status)}`}>
                  <i />
                  {previewItem.status}
                </span>

                <span>{getReleaseLabel(previewItem.releaseType)}</span>

                <span>{previewItem.visibility || "PUBLIC"}</span>

                {previewItem.version ? <span>v{previewItem.version}</span> : null}

                {previewItem.isFeatured ? (
                  <span className="admin-announcement-featured-badge">
                    <Sparkles size={13} />
                    Featured
                  </span>
                ) : null}
              </div>

              <p className="admin-announcement-preview-short">{previewItem.shortDescription}</p>

              <div className="admin-announcement-preview-info-grid">
                <div>
                  <span>Release Date</span>
                  <strong>{formatDate(previewItem.releaseDate)}</strong>
                </div>

                <div>
                  <span>Published At</span>
                  <strong>{formatDateTime(previewItem.publishedAt)}</strong>
                </div>

                <div>
                  <span>Display Order</span>
                  <strong>{Number(previewItem.displayOrder) || 0}</strong>
                </div>

                <div>
                  <span>Target Audience</span>
                  <strong>{previewItem.targetAudience || "ALL"}</strong>
                </div>
              </div>

              {previewItem.description ? (
                <div>
                  <h3>Description</h3>
                  <p>{previewItem.description}</p>
                </div>
              ) : null}

              {Array.isArray(previewItem.tags) && previewItem.tags.length > 0 ? (
                <div>
                  <h3>Tags</h3>

                  <div className="admin-announcement-tags">
                    {previewItem.tags.map((tag, index) => (
                      <span key={`${tag}-${index}`}>{tag}</span>
                    ))}
                  </div>
                </div>
              ) : null}

              {previewItem.ctaText && previewItem.ctaUrl ? (
                <a href={previewItem.ctaUrl} target={previewItem.ctaUrl.startsWith("http") ? "_blank" : undefined} rel={previewItem.ctaUrl.startsWith("http") ? "noopener noreferrer" : undefined} className="admin-announcement-preview-action">
                  {previewItem.ctaText}
                </a>
              ) : null}

              {previewItem.createdBy ? (
                <div className="admin-announcement-created-info">
                  <ShieldCheck size={16} />

                  <span>Created by {previewItem.createdBy?.name || previewItem.createdBy?.email || "Admin"}</span>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      <style>{`
.admin-announcement-page{width:100%;max-width:1480px;margin:0 auto;padding:28px 30px 60px;box-sizing:border-box;color:var(--admin-text,#111827)}
.admin-announcement-header{display:flex;align-items:flex-end;justify-content:space-between;gap:20px;margin-bottom:25px}
.admin-announcement-heading{min-width:0}
.admin-announcement-heading h1{margin:0;font-size:29px;line-height:1.2;color:var(--admin-text)}
.admin-announcement-heading p{margin:7px 0 0;color:var(--admin-muted);font-size:14px;line-height:1.55}
.admin-announcement-header-actions{display:flex;align-items:center;gap:10px}
.admin-announcement-refresh,.admin-announcement-create-btn,.admin-announcement-clear-filter{height:40px;border-radius:9px;padding:0 14px;display:flex;align-items:center;justify-content:center;gap:8px;font-weight:400;cursor:pointer}
.admin-announcement-refresh{border:1px solid var(--admin-border,#e5e7eb);background:var(--admin-surface,#fff);color:var(--admin-text,#111827)}
.admin-announcement-create-btn{border:1px solid var(--admin-primary,#2563eb);background:var(--admin-primary,#2563eb);color:#fff}
.admin-announcement-refresh:hover{border-color:var(--admin-primary);color:var(--admin-primary);background:var(--admin-surface-2)}
.admin-announcement-create-btn:hover{filter:brightness(.95);transform:translateY(-1px)}
.admin-announcement-refresh:disabled,.admin-announcement-create-btn:disabled{opacity:.55;cursor:not-allowed;transform:none}
.admin-announcement-stats{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:14px;margin-bottom:20px}
.admin-announcement-stat-card{padding:18px 20px;border:1px solid var(--admin-border,#e5e7eb);border-radius:14px;background:var(--admin-surface,#fff);box-shadow:var(--admin-shadow-sm,0 2px 8px rgba(15,23,42,.05))}
.admin-announcement-stat-card span{display:block;font-size:13px;color:var(--admin-muted,#64748b);margin-bottom:8px}
.admin-announcement-stat-card strong{font-size:25px;color:var(--admin-text,#111827)}
.admin-announcement-toolbar{display:flex;align-items:center;gap:10px;margin-bottom:18px;padding:14px;border:1px solid var(--admin-border,#e5e7eb);border-radius:14px;background:var(--admin-surface,#fff)}
.admin-announcement-search{height:40px;min-width:280px;flex:1;display:flex;align-items:center;gap:8px;padding:0 11px;border:1px solid var(--admin-border,#e5e7eb);border-radius:9px;color:var(--admin-muted,#64748b);background:var(--admin-surface,#fff)}
.admin-announcement-search:focus-within{border-color:var(--admin-primary);box-shadow:0 0 0 3px rgba(37,99,235,.08)}
.admin-announcement-search input{width:100%;min-width:0;border:0;outline:0;background:transparent;color:var(--admin-text,#111827)}
.admin-announcement-search input::placeholder{color:var(--admin-placeholder,#94a3b8)}
.admin-announcement-search input[type=search]::-webkit-search-cancel-button{-webkit-appearance:none;appearance:none;display:none}
.admin-announcement-search input[type=search]::-webkit-search-decoration{-webkit-appearance:none;appearance:none;display:none}
.admin-announcement-search button{border:0;background:transparent;padding:3px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--admin-muted,#64748b)}
.admin-announcement-search button:hover{color:var(--admin-text,#111827)}
.admin-announcement-filter{height:40px;display:flex;align-items:center;gap:7px;padding:0 10px;border:1px solid var(--admin-border,#e5e7eb);border-radius:9px;background:var(--admin-surface,#fff);color:var(--admin-muted,#64748b)}
.admin-announcement-filter select{border:0;outline:0;background:var(--admin-surface,#fff);color:var(--admin-text,#111827);height:100%;cursor:pointer}
.admin-announcement-filter select option{background:var(--admin-surface,#fff);color:var(--admin-text,#111827)}
.admin-announcement-clear-filter{border:1px solid var(--admin-border,#e5e7eb);background:var(--admin-surface-2,#f3f4f6);color:var(--admin-text,#111827)}
.admin-announcement-error{display:flex;align-items:center;justify-content:space-between;gap:15px;margin-bottom:18px;padding:14px 16px;border:1px solid var(--admin-danger,#dc2626);border-radius:12px;background:var(--admin-danger-bg,#fee2e2);color:var(--admin-danger,#dc2626)}
.admin-announcement-error>div{display:flex;align-items:flex-start;gap:10px}
.admin-announcement-error strong,.admin-announcement-error span{display:block}
.admin-announcement-error span{margin-top:3px;font-size:13px}
.admin-announcement-error button{height:36px;padding:0 12px;border:1px solid var(--admin-danger,#dc2626);border-radius:8px;background:var(--admin-surface,#fff);color:var(--admin-danger,#dc2626);cursor:pointer;font-weight:400}
.admin-announcement-loading,.admin-announcement-empty{min-height:320px;border:1px dashed var(--admin-border-strong,#cbd5e1);border-radius:15px;background:var(--admin-surface,#fff);display:flex;align-items:center;justify-content:center;flex-direction:column;text-align:center;padding:30px}
.admin-announcement-loading h3,.admin-announcement-empty h2{margin:13px 0 6px;color:var(--admin-text,#111827)}
.admin-announcement-loading p,.admin-announcement-empty p{margin:0 0 18px;color:var(--admin-muted,#64748b)}
.admin-announcement-empty-icon{width:52px;height:52px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:var(--admin-surface-2,#f3f4f6);color:var(--admin-primary,#2563eb)}
.admin-announcement-empty button{height:40px;padding:0 15px;border:0;border-radius:9px;background:var(--admin-primary,#2563eb);color:#fff;display:flex;align-items:center;gap:7px;cursor:pointer;font-weight:400}
.admin-announcement-table-card{border:1px solid var(--admin-border,#e5e7eb);border-radius:15px;background:var(--admin-surface,#fff);overflow:hidden}
.admin-announcement-table-scroll{width:100%;overflow-x:hidden;overflow-y:visible}
.admin-announcement-table{width:100%;min-width:0;table-layout:fixed;border-collapse:collapse}
.admin-announcement-table th{padding:9px 7px;text-align:left;font-size:13px;text-transform:uppercase;letter-spacing:.04em;color:var(--admin-muted,#64748b);background:var(--admin-surface-2,#f8fafc);border-bottom:1px solid var(--admin-border,#e5e7eb);white-space:nowrap}
.admin-announcement-table td{padding:9px 7px;border-bottom:1px solid var(--admin-border,#e5e7eb);vertical-align:middle;overflow:hidden}
.admin-announcement-table tbody tr:last-child td{border-bottom:0}
.admin-announcement-table th:nth-child(1),.admin-announcement-table td:nth-child(1){width:27%}
.admin-announcement-table th:nth-child(2),.admin-announcement-table td:nth-child(2){width:10%}
.admin-announcement-table th:nth-child(3),.admin-announcement-table td:nth-child(3){width:11%}
.admin-announcement-table th:nth-child(4),.admin-announcement-table td:nth-child(4){width:10%}
.admin-announcement-table th:nth-child(5),.admin-announcement-table td:nth-child(5){width:11%}
.admin-announcement-table th:nth-child(6),.admin-announcement-table td:nth-child(6){width:7%}
.admin-announcement-table th:nth-child(7),.admin-announcement-table td:nth-child(7){width:11%}
.admin-announcement-table th:nth-child(8),.admin-announcement-table td:nth-child(8){width:13%}
.admin-announcement-table tbody tr:hover{background:rgba(37,99,235,.025)}
.admin-announcement-update-cell{display:flex;align-items:center;gap:9px;min-width:0}
.admin-announcement-thumb{width:50px;height:50px;flex:0 0 50px;border-radius:10px;background:var(--admin-surface-2,#f3f4f6);display:flex;align-items:center;justify-content:center;overflow:hidden;color:var(--admin-primary,#2563eb)}
.admin-announcement-thumb img{width:100%;height:100%;object-fit:cover}
.admin-announcement-update-info{min-width:0}
.admin-announcement-update-info strong{display:block;max-width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:13px;color:var(--admin-text,#111827)}
.admin-announcement-update-info span{display:block;max-width:100%;margin-top:3px;color:var(--admin-muted,#64748b);font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.admin-announcement-type,.admin-announcement-release,.admin-announcement-visibility{display:inline-flex;padding:5px 9px;border-radius:999px;background:var(--admin-surface-2,#f3f4f6);color:var(--admin-text-secondary,#334155);font-size:13px;font-weight:400;white-space:nowrap}
.admin-announcement-status{display:inline-flex;align-items:center;gap:6px;padding:5px 9px;border-radius:999px;font-size:13px;font-weight:400;white-space:nowrap}
.admin-announcement-status i{width:7px;height:7px;border-radius:50%;display:block;background:currentColor}
.admin-announcement-status-published{color:var(--admin-success,#16a34a);background:var(--admin-success-bg,#dcfce7)}
.admin-announcement-status-draft{color:var(--admin-warning,#d97706);background:var(--admin-warning-bg,#fef3c7)}
.admin-announcement-status-archived{color:var(--admin-muted,#64748b);background:var(--admin-surface-3,#f1f5f9)}
.admin-announcement-date{display:flex;align-items:center;gap:4px;color:var(--admin-muted,#64748b);font-size:13px;white-space:nowrap}
.admin-announcement-version{font-size:13px;color:var(--admin-muted,#64748b);white-space:nowrap}
.admin-announcement-actions{display:flex;align-items:center;gap:4px;white-space:nowrap}
.admin-announcement-action{width:30px;height:30px;flex:0 0 30px;border-radius:8px;border:1px solid var(--admin-border,#e5e7eb);display:flex;align-items:center;justify-content:center;cursor:pointer;background:var(--admin-surface,#fff);transition:all .18s ease}
.admin-announcement-action:hover{transform:translateY(-1px);border-color:currentColor;background:var(--admin-surface-2)}
.admin-announcement-action.view{color:var(--admin-info,#0284c7)}
.admin-announcement-action.edit{color:#7c3aed}
.admin-announcement-action.publish{color:var(--admin-success,#16a34a)}
.admin-announcement-action.hide{color:var(--admin-warning,#d97706)}
.admin-announcement-action.delete{color:var(--admin-danger,#dc2626)!important;background:var(--admin-surface,#fff)}
.admin-announcement-action.delete:hover{color:var(--admin-danger-hover,#b91c1c)!important;border-color:var(--admin-danger,#dc2626)!important;background:var(--admin-danger-bg,#fee2e2)!important}
.admin-announcement-action:disabled{opacity:.5;cursor:not-allowed;transform:none}
.admin-announcement-pagination{display:flex;align-items:center;justify-content:center;gap:14px;margin-top:20px}
.admin-announcement-pagination button{width:38px;height:38px;border:1px solid var(--admin-border,#e5e7eb);border-radius:9px;background:var(--admin-surface,#fff);color:var(--admin-text,#111827);display:flex;align-items:center;justify-content:center;cursor:pointer}
.admin-announcement-pagination button:hover:not(:disabled){border-color:var(--admin-primary);color:var(--admin-primary)}
.admin-announcement-pagination button:disabled{opacity:.45;cursor:not-allowed}
.admin-announcement-pagination span{font-size:13px;color:var(--admin-muted,#64748b)}
.admin-announcement-modal-backdrop{position:fixed;inset:0;z-index:9999;padding:25px;display:flex;align-items:center;justify-content:center;background:rgba(15,23,42,.58);backdrop-filter:blur(5px);-webkit-backdrop-filter:blur(5px)}
.admin-announcement-form-modal,.admin-announcement-preview-modal{width:min(1000px,100%);max-height:calc(100vh - 50px);overflow:hidden;border-radius:18px;background:var(--admin-surface,#fff);box-shadow:0 25px 80px rgba(0,0,0,.25);display:flex;flex-direction:column}
.admin-announcement-modal-header{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:20px 22px;border-bottom:1px solid var(--admin-border,#e5e7eb)}
.admin-announcement-modal-header h2{margin:0;font-size:21px;color:var(--admin-text,#111827)}
.admin-announcement-modal-header p{margin:5px 0 0;color:var(--admin-muted,#64748b);font-size:13px}
.admin-announcement-modal-header>button{width:36px;height:36px;border:1px solid var(--admin-border,#e5e7eb);border-radius:9px;background:var(--admin-surface,#fff);color:var(--admin-text,#111827);display:flex;align-items:center;justify-content:center;cursor:pointer}
.admin-announcement-form{overflow:auto}
.admin-announcement-form-section{padding:22px;border-bottom:1px solid var(--admin-border,#e5e7eb)}
.admin-announcement-section-heading{margin-bottom:17px}
.admin-announcement-section-heading h3{margin:0;font-size:16px;color:var(--admin-text,#111827)}
.admin-announcement-section-heading span{display:block;margin-top:4px;color:var(--admin-muted,#64748b);font-size:13px}
.admin-announcement-form-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
.admin-announcement-field{display:flex;flex-direction:column;gap:7px;min-width:0}
.admin-announcement-field-full{grid-column:1/-1}
.admin-announcement-field>span{font-size:13px;font-weight:400;color:var(--admin-text,#111827)}
.admin-announcement-field>span b{color:var(--admin-danger,#dc2626)}
.admin-announcement-field input,.admin-announcement-field textarea,.admin-announcement-field select{width:100%;box-sizing:border-box;border:1px solid var(--admin-border,#dfe3e8);border-radius:9px;background:var(--admin-surface,#fff);color:var(--admin-text,#111827);outline:0;padding:10px 12px;font:inherit}
.admin-announcement-field input::placeholder,.admin-announcement-field textarea::placeholder{color:var(--admin-placeholder,#94a3b8)}
.admin-announcement-field input:focus,.admin-announcement-field textarea:focus,.admin-announcement-field select:focus{border-color:var(--admin-primary,#2563eb);box-shadow:0 0 0 3px rgba(37,99,235,.1)}
.admin-announcement-field textarea{resize:vertical;line-height:1.55}
.admin-announcement-field select option{background:var(--admin-surface,#fff);color:var(--admin-text,#111827)}
.admin-announcement-date-input-wrap{position:relative;width:100%}
.admin-announcement-date-input-wrap input[type=date]{padding-right:40px;cursor:pointer;accent-color:var(--admin-primary,#2563eb)}
.admin-announcement-date-input-wrap input[type=date]::-webkit-calendar-picker-indicator{opacity:0;cursor:pointer;width:18px;height:18px}
.admin-announcement-date-input-wrap input[type=date]::-webkit-datetime-edit{color:var(--admin-text,#111827)}
.admin-announcement-date-icon{position:absolute;right:11px;top:50%;transform:translateY(-50%);color:var(--admin-text,#111827);pointer-events:none;opacity:.9}
.admin-announcement-date-input-wrap:focus-within .admin-announcement-date-icon{color:var(--admin-primary,#2563eb);opacity:1}
.admin-announcement-field small{color:var(--admin-muted,#64748b);font-size:13px}
.admin-announcement-checkbox-field{display:flex;align-items:center;gap:10px;min-height:44px;padding:10px 12px;border:1px solid var(--admin-border,#e5e7eb);border-radius:9px;background:var(--admin-surface-2,#f8fafc);cursor:pointer}
.admin-announcement-checkbox-field input{width:17px;height:17px;accent-color:var(--admin-primary,#2563eb);cursor:pointer}
.admin-announcement-checkbox-field span{display:flex;flex-direction:column;gap:3px}
.admin-announcement-checkbox-field strong{font-size:13px;color:var(--admin-text,#111827)}
.admin-announcement-checkbox-field small{font-size:13px;color:var(--admin-muted,#64748b)}
.admin-announcement-media-tabs{display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap}
.admin-announcement-media-tabs button{height:38px;padding:0 13px;border:1px solid var(--admin-border,#e5e7eb);border-radius:9px;background:var(--admin-surface,#fff);display:flex;align-items:center;gap:7px;cursor:pointer;color:var(--admin-text,#111827);font-weight:400}
.admin-announcement-media-tabs button.active{background:var(--admin-primary,#2563eb);border-color:var(--admin-primary,#2563eb);color:#fff}
.admin-announcement-media-area,.admin-announcement-video-fields{display:flex;flex-direction:column;gap:15px}
.admin-announcement-image-preview{position:relative;width:100%;height:260px;border-radius:13px;overflow:hidden;background:var(--admin-surface-3,#f1f5f9);display:flex;align-items:center;justify-content:center}
.admin-announcement-image-preview img{width:100%;height:100%;object-fit:contain}
.admin-announcement-video-preview{width:100%;aspect-ratio:16/9;border-radius:13px;overflow:hidden;background:#0f172a}
.admin-announcement-video-preview iframe{width:100%;height:100%;border:0}
.admin-announcement-form-footer{position:sticky;bottom:0;display:flex;justify-content:flex-end;gap:10px;padding:15px 22px;border-top:1px solid var(--admin-border,#e5e7eb);background:var(--admin-surface,#fff)}
.admin-announcement-cancel-btn,.admin-announcement-save-btn{height:40px;padding:0 16px;border-radius:9px;display:flex;align-items:center;justify-content:center;gap:7px;cursor:pointer;font-weight:400}
.admin-announcement-cancel-btn{border:1px solid var(--admin-border,#e5e7eb);background:var(--admin-surface,#fff);color:var(--admin-text,#111827)}
.admin-announcement-save-btn{border:1px solid var(--admin-primary,#2563eb);background:var(--admin-primary,#2563eb);color:#fff}
.admin-announcement-save-btn:disabled,.admin-announcement-cancel-btn:disabled{opacity:.55;cursor:not-allowed}
.admin-announcement-preview-modal{max-width:1000px;width:min(1000px,100%)}
.admin-announcement-preview-media{width:100%;aspect-ratio:16/9;background:#0f172a;display:flex;align-items:center;justify-content:center;overflow:hidden}
.admin-announcement-preview-media img{width:100%;height:100%;object-fit:contain}
.admin-announcement-preview-media iframe{display:block;width:100%;height:100%;border:0}
.admin-announcement-video-link{color:#fff;text-decoration:none;padding:12px 18px;border-radius:9px;background:var(--admin-primary,#2563eb);font-weight:400}
.admin-announcement-preview-content{padding:24px;overflow:auto}
.admin-announcement-preview-meta{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:16px}
.admin-announcement-preview-meta>span{padding:5px 9px;border-radius:999px;background:var(--admin-surface-2,#f3f4f6);color:var(--admin-text-secondary,#334155);font-size:13px;font-weight:400}
.admin-announcement-preview-short{font-size:16px;line-height:1.65;margin:0 0 22px;color:var(--admin-text,#111827)}
.admin-announcement-preview-content h3{margin:20px 0 8px;font-size:15px;color:var(--admin-text,#111827)}
.admin-announcement-preview-content p{white-space:pre-wrap;line-height:1.65;color:var(--admin-text-secondary,#334155)}
.admin-announcement-preview-info-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin:18px 0}
.admin-announcement-preview-info-grid>div{padding:12px;border:1px solid var(--admin-border,#e5e7eb);border-radius:10px;background:var(--admin-surface-2,#f8fafc)}
.admin-announcement-preview-info-grid span{display:block;font-size:13px;color:var(--admin-muted,#64748b);margin-bottom:5px}
.admin-announcement-preview-info-grid strong{font-size:13px;color:var(--admin-text,#111827)}
.admin-announcement-tags{display:flex;align-items:center;gap:7px;flex-wrap:wrap}
.admin-announcement-tags span{padding:5px 9px;border-radius:999px;background:var(--admin-primary-soft,#eff6ff);color:var(--admin-primary,#2563eb);font-size:13px;font-weight:400}
.admin-announcement-featured-badge{display:inline-flex!important;align-items:center;gap:5px;background:var(--admin-warning-bg,#fef3c7)!important;color:var(--admin-warning,#d97706)!important}
.admin-announcement-preview-action{display:inline-flex;margin-top:12px;height:40px;padding:0 15px;align-items:center;border-radius:9px;background:var(--admin-primary,#2563eb);color:#fff;text-decoration:none;font-weight:400}
.admin-announcement-created-info{display:flex;align-items:center;gap:7px;margin-top:22px;padding-top:16px;border-top:1px solid var(--admin-border,#e5e7eb);color:var(--admin-muted,#64748b);font-size:13px}
.admin-announcement-spin{animation:adminAnnouncementSpin .8s linear infinite}
@keyframes adminAnnouncementSpin{to{transform:rotate(360deg)}}
@media(max-width:1150px){.admin-announcement-stats{grid-template-columns:repeat(3,minmax(0,1fr))}.admin-announcement-toolbar{flex-wrap:wrap}.admin-announcement-search{min-width:100%;flex-basis:100%}}
@media(max-width:900px){.admin-announcement-header{align-items:flex-start;flex-direction:column}.admin-announcement-header-actions{width:100%}.admin-announcement-header-actions button{flex:1}}
@media(max-width:650px){.admin-announcement-page{padding:20px 14px 45px}.admin-announcement-heading h1{font-size:24px}.admin-announcement-stats{grid-template-columns:1fr 1fr}.admin-announcement-stat-card{padding:15px}.admin-announcement-toolbar{padding:10px}.admin-announcement-filter{flex:1}.admin-announcement-filter select{width:100%}.admin-announcement-clear-filter{width:100%}.admin-announcement-modal-backdrop{padding:10px}.admin-announcement-form-modal,.admin-announcement-preview-modal{max-height:calc(100vh - 20px);border-radius:14px}.admin-announcement-form-grid{grid-template-columns:1fr}.admin-announcement-field-full{grid-column:auto}.admin-announcement-form-section{padding:17px}.admin-announcement-modal-header{padding:16px}.admin-announcement-form-footer{padding:12px 16px}.admin-announcement-form-footer button{flex:1}.admin-announcement-header-actions{flex-direction:column}.admin-announcement-header-actions button{width:100%}.admin-announcement-preview-info-grid{grid-template-columns:1fr 1fr}}
@media(prefers-reduced-motion:reduce){.admin-announcement-action,.admin-announcement-create-btn,.admin-announcement-refresh{transition:none!important}.admin-announcement-spin{animation:none!important}}
`}</style>
    </main>
  );
}

export default AdminAnnouncement;
