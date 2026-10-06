import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, CalendarDays, Check, ChevronLeft, ChevronRight, Edit3, Eye, FileText, Filter, Image as ImageIcon, LoaderCircle, Pencil, Plus, RefreshCw, Search, Sparkles, Trash2, Upload, Video, X } from "lucide-react";
import Swal from "sweetalert2";

import { getAllWhatsNew, createWhatsNew, updateWhatsNew, deleteWhatsNew } from "../../api/whatsNew.api";

const showThemedAlert = (options = {}) => {
  return Swal.fire({
    ...options,
    buttonsStyling: false,
    customClass: {
      popup: "admin-theme-swal-popup",
      title: "admin-theme-swal-title",
      htmlContainer: "admin-theme-swal-html",
      confirmButton: "admin-theme-swal-confirm",
      cancelButton: "admin-theme-swal-cancel",
    },
  });
};

const TYPE_OPTIONS = [
  { value: "", label: "All Types" },
  { value: "NEW_FEATURE", label: "New Feature" },
  { value: "IMPROVEMENT", label: "Improvement" },
  { value: "FIX", label: "Fix" },
  { value: "UPCOMING", label: "Upcoming" },
];

const STATUS_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "PUBLISHED", label: "Published" },
  { value: "DRAFT", label: "Draft" },
  { value: "ARCHIVED", label: "Archived" },
];

const AUDIENCE_OPTIONS = [
  { value: "", label: "All Audience" },
  { value: "ALL", label: "Everyone" },
  { value: "ADMIN", label: "Admin" },
  { value: "STAFF", label: "Staff" },
  { value: "CUSTOMER", label: "Customer" },
];

const EMPTY_FORM = {
  title: "",
  slug: "",
  type: "NEW_FEATURE",
  status: "DRAFT",
  targetAudience: "ALL",
  version: "",
  releaseDate: "",
  shortDescription: "",
  description: "",
  featuresText: "",
  howToUse: "",
  actionText: "",
  actionUrl: "",
  mediaType: "NONE",
  imageUrl: "",
  videoUrl: "",
  videoMuted: true,
  videoAutoplay: true,
  videoLoop: true,
  displayMode: "ONCE_PER_VERSION",
};

function getItemsFromResponse(response) {
  const data = response?.data || response?.result || response || {};

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data.items)) {
    return data.items;
  }

  if (Array.isArray(data.features)) {
    return data.features;
  }

  if (Array.isArray(data.rows)) {
    return data.rows;
  }

  if (Array.isArray(data.docs)) {
    return data.docs;
  }

  return [];
}

function getPaginationFromResponse(response, fallbackPage = 1, fallbackLimit = 12) {
  const data = response?.data || response?.result || response || {};
  const pagination = data.pagination || {};

  return {
    page: Number(pagination.page || data.page) || fallbackPage,
    limit: Number(pagination.limit || data.limit) || fallbackLimit,
    total: Number(pagination.total || data.total) || 0,
    totalPages: Number(pagination.totalPages || data.totalPages) || (Number(pagination.total) > 0 ? Math.ceil(Number(pagination.total) / fallbackLimit) : 0),
  };
}

function normalizeDateForInput(date) {
  if (!date) return "";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getFormFromItem(item) {
  return {
    title: item?.title || "",
    slug: item?.slug || "",
    type: item?.type || "NEW_FEATURE",
    status: item?.status || "DRAFT",
    targetAudience: item?.targetAudience || item?.audience || "ALL",
    version: item?.version || "",
    releaseDate: normalizeDateForInput(item?.releaseDate),
    shortDescription: item?.shortDescription || "",
    description: item?.description || "",
    featuresText: Array.isArray(item?.features) ? item.features.join("\n") : item?.features || "",
    howToUse: item?.howToUse || "",
    actionText: item?.actionText || "",
    actionUrl: item?.actionUrl || "",
    mediaType: item?.mediaType || "NONE",
    imageUrl: item?.imageUrl || "",
    videoUrl: item?.videoUrl || "",
    videoMuted: item?.videoMuted !== false,
    videoAutoplay: item?.videoAutoplay !== false,
    videoLoop: item?.videoLoop !== false,
    displayMode: item?.displayMode === "ALWAYS" ? "ALWAYS" : "ONCE_PER_VERSION",
  };
}

function buildPayload(form) {
  const payload = {
    title: form.title.trim(),
    slug: form.slug.trim(),
    type: form.type,
    status: form.status,
    targetAudience: form.targetAudience,
    version: form.version.trim(),
    releaseDate: form.releaseDate || null,
    shortDescription: form.shortDescription.trim(),
    description: form.description.trim(),
    features: form.featuresText
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean),
    howToUse: form.howToUse.trim(),
    actionText: form.actionText.trim(),
    actionUrl: form.actionUrl.trim(),
    mediaType: form.mediaType,
    imageUrl: form.mediaType === "IMAGE" ? form.imageUrl.trim() : "",
    videoUrl: form.mediaType === "VIDEO" ? form.videoUrl.trim() : "",
    videoMuted: form.videoMuted,
    videoAutoplay: form.videoAutoplay,
    videoLoop: form.videoLoop,
    displayMode: form.displayMode,
  };

  return payload;
}

function getStatusClass(status) {
  const value = String(status || "").toUpperCase();

  if (value === "PUBLISHED") return "status-published";
  if (value === "SCHEDULED") return "status-scheduled";
  if (value === "ARCHIVED") return "status-archived";

  return "status-draft";
}

function getTypeLabel(type) {
  const labels = {
    NEW_FEATURE: "New Feature",
    IMPROVEMENT: "Improvement",
    FIX: "Fix",
    UPCOMING: "Upcoming",
  };

  return labels[type] || type || "Update";
}

function getAudienceLabel(audience) {
  const labels = {
    ALL: "Everyone",
    ADMIN: "Admin",
    STAFF: "Staff",
    CUSTOMER: "Customer",
  };

  return labels[audience] || audience || "Everyone";
}

function formatDate(date) {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "—";
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getYouTubeEmbedUrl(url) {
  const value = String(url || "").trim();
  if (!value) return "";

  try {
    const parsed = new URL(value);
    let videoId = "";

    if (parsed.hostname.includes("youtu.be")) {
      videoId = parsed.pathname.replace("/", "").split("/")[0];
    } else if (parsed.hostname.includes("youtube.com")) {
      videoId = parsed.searchParams.get("v") || "";
      if (!videoId && parsed.pathname.startsWith("/shorts/")) videoId = parsed.pathname.split("/")[2] || "";
      if (!videoId && parsed.pathname.startsWith("/embed/")) videoId = parsed.pathname.split("/")[2] || "";
    }

    return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
  } catch {
    return "";
  }
}

function AdminWhatsNew() {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [audienceFilter, setAudienceFilter] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");

  const [selectedItem, setSelectedItem] = useState(null);
  const [deletingId, setDeletingId] = useState("");

  const fetchItems = useCallback(
    async (page = 1, isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const response = await getAllWhatsNew({
          page,
          limit: 12,
          ...(typeFilter ? { type: typeFilter } : {}),
          ...(statusFilter ? { status: statusFilter } : {}),
          ...(audienceFilter ? { targetAudience: audienceFilter } : {}),
          ...(search.trim() ? { search: search.trim() } : {}),
        });

        if (response?.success === false) {
          throw new Error(response?.message || "Unable to load What's New.");
        }

        const nextItems = getItemsFromResponse(response);
        const nextPagination = getPaginationFromResponse(response, page, 12);

        setItems(nextItems);
        setPagination(nextPagination);
      } catch (err) {
        console.error("Admin What's New error:", err);

        setError(err?.response?.data?.message || err?.message || "Unable to load What's New.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [typeFilter, statusFilter, audienceFilter, search]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchItems(1);
    }, 250);

    return () => clearTimeout(timer);
  }, [fetchItems]);

  const stats = useMemo(() => {
    const total = items.length;

    const published = items.filter((item) => String(item.status).toUpperCase() === "PUBLISHED").length;

    const drafts = items.filter((item) => String(item.status).toUpperCase() === "DRAFT").length;

    const upcoming = items.filter((item) => String(item.status).toUpperCase() === "SCHEDULED" || String(item.type).toUpperCase() === "UPCOMING").length;

    return {
      total,
      published,
      drafts,
      upcoming,
    };
  }, [items]);

  const updateForm = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const openCreate = () => {
    setEditingItem(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setForm(getFormFromItem(item));
    setFormError("");
    setShowForm(true);
  };

  const closeForm = () => {
    if (saving) return;

    setShowForm(false);
    setEditingItem(null);
    setForm(EMPTY_FORM);
    setFormError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      setFormError("Title is required.");
      return;
    }

    if (!form.shortDescription.trim()) {
      setFormError("Short description is required.");
      return;
    }

    if (form.mediaType === "IMAGE" && !form.imageUrl.trim()) {
      setFormError("Image path is required when media type is Image.");
      return;
    }

    if (form.mediaType === "VIDEO" && !form.videoUrl.trim()) {
      setFormError("YouTube video URL is required when media type is Video.");
      return;
    }

    try {
      setSaving(true);
      setFormError("");

      const payload = buildPayload(form);

      if (editingItem?._id) {
        const response = await updateWhatsNew(editingItem._id, payload);

        if (response?.success === false) {
          throw new Error(response?.message || "Unable to update What's New.");
        }
      } else {
        const response = await createWhatsNew(payload);

        if (response?.success === false) {
          throw new Error(response?.message || "Unable to create What's New.");
        }
      }

      await showThemedAlert({
        icon: "success",
        title: editingItem?._id ? "Update saved" : "What's New created",
        text: editingItem?._id ? "The update was saved successfully." : "The new update was created successfully.",
        timer: 1400,
        showConfirmButton: false,
      });

      closeForm();
      await fetchItems(pagination.page || 1, true);
    } catch (err) {
      console.error("Save What's New error:", err);

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.errors
          ?.map?.((item) => item.msg)
          .filter(Boolean)
          .join("\n") ||
        err?.message ||
        "Unable to save What's New.";
      setFormError(message);

      await showThemedAlert({
        icon: "error",
        title: "Unable to save",
        text: message,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    if (!item?._id || deletingId) return;

    const result = await showThemedAlert({
      icon: "warning",
      title: "Archive this update?",
      text: item.title || "This update will be archived.",
      showCancelButton: true,
      confirmButtonText: "Yes, archive",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      setDeletingId(item._id);
      setError("");

      const response = await deleteWhatsNew(item._id);

      if (response?.success === false) {
        throw new Error(response?.message || "Unable to archive What's New.");
      }

      if (selectedItem?._id === item._id) {
        setSelectedItem(null);
      }

      await fetchItems(pagination.page || 1, true);

      await showThemedAlert({
        icon: "success",
        title: "Archived",
        text: "The update has been archived successfully.",
        timer: 1300,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Delete What's New error:", err);

      const message = err?.response?.data?.message || err?.message || "Unable to archive What's New.";
      setError(message);

      await showThemedAlert({
        icon: "error",
        title: "Unable to archive",
        text: message,
      });
    } finally {
      setDeletingId("");
    }
  };

  const handlePageChange = (page) => {
    if (page < 1) return;

    if (pagination.totalPages > 0 && page > pagination.totalPages) {
      return;
    }

    fetchItems(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleClearFilters = () => {
    setSearch("");
    setTypeFilter("");
    setStatusFilter("");
    setAudienceFilter("");
  };

  return (
    <div className="admin-whats-new-page">
      <div className="admin-whats-new-inner">
        <section className="admin-whats-new-header">
          <div className="admin-whats-new-heading">
            <div>
              <h1>What's New</h1>

              <p>Create, manage and publish product updates, improvements and feature announcements.</p>
            </div>
          </div>

          <div className="admin-whats-new-header-actions">
            <button type="button" className="admin-whats-new-refresh" onClick={() => fetchItems(pagination.page || 1, true)} disabled={loading || refreshing}>
              <RefreshCw size={16} className={refreshing ? "admin-whats-new-spin" : ""} />
              Refresh
            </button>

            <button type="button" className="admin-whats-new-create" onClick={openCreate}>
              <Plus size={17} />
              New Update
            </button>
          </div>
        </section>

        <section className="admin-whats-new-stats">
          <div className="admin-whats-new-stat-card">
            <div className="admin-whats-new-stat-icon total">
              <Sparkles size={19} />
            </div>

            <div>
              <span>Total Loaded</span>
              <strong>{stats.total}</strong>
            </div>
          </div>

          <div className="admin-whats-new-stat-card">
            <div className="admin-whats-new-stat-icon published">
              <Check size={19} />
            </div>

            <div>
              <span>Published</span>
              <strong>{stats.published}</strong>
            </div>
          </div>

          <div className="admin-whats-new-stat-card">
            <div className="admin-whats-new-stat-icon drafts">
              <Pencil size={19} />
            </div>

            <div>
              <span>Drafts</span>
              <strong>{stats.drafts}</strong>
            </div>
          </div>

          <div className="admin-whats-new-stat-card">
            <div className="admin-whats-new-stat-icon upcoming">
              <CalendarDays size={19} />
            </div>

            <div>
              <span>Upcoming</span>
              <strong>{stats.upcoming}</strong>
            </div>
          </div>
        </section>

        <section className="admin-whats-new-filters">
          <div className="admin-whats-new-search">
            <Search size={18} />

            <input type="text" placeholder="Search updates..." value={search} onChange={(event) => setSearch(event.target.value)} />

            {search ? (
              <button type="button" onClick={() => setSearch("")} aria-label="Clear search">
                <X size={15} />
              </button>
            ) : null}
          </div>

          <label className="admin-whats-new-select">
            <Filter size={15} />

            <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
              {TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="admin-whats-new-select">
            <FileText size={15} />

            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="admin-whats-new-select">
            <Eye size={15} />

            <select value={audienceFilter} onChange={(event) => setAudienceFilter(event.target.value)}>
              {AUDIENCE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          {search || typeFilter || statusFilter || audienceFilter ? (
            <button type="button" className="admin-whats-new-clear" onClick={handleClearFilters}>
              Clear
            </button>
          ) : null}
        </section>

        {error ? (
          <section className="admin-whats-new-error">
            <div className="admin-whats-new-error-content">
              <AlertCircle size={20} />

              <div>
                <strong>Unable to load What's New</strong>
                <span>{error}</span>
              </div>
            </div>

            <button type="button" onClick={() => fetchItems(pagination.page || 1, true)}>
              Try Again
            </button>
          </section>
        ) : null}

        {loading ? (
          <section className="admin-whats-new-loading">
            <LoaderCircle size={34} className="admin-whats-new-spin" />

            <h3>Loading What's New</h3>

            <p>Fetching updates from the server...</p>
          </section>
        ) : items.length === 0 ? (
          <section className="admin-whats-new-empty">
            <div className="admin-whats-new-empty-icon">
              <Sparkles size={28} />
            </div>

            <h2>No updates found</h2>

            <p>Create your first What's New announcement or adjust your filters.</p>

            <button type="button" onClick={openCreate}>
              <Plus size={17} />
              Create Update
            </button>
          </section>
        ) : (
          <section className="admin-whats-new-table-wrap">
            <div className="admin-whats-new-table-scroll">
              <table className="admin-whats-new-table">
                <thead>
                  <tr>
                    <th>Update</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Audience</th>
                    <th>Release Date</th>
                    <th>Version</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {items.map((item) => (
                    <tr key={item._id || item.slug}>
                      <td>
                        <div className="admin-whats-new-update-cell">
                          <div className="admin-whats-new-thumb">{item.mediaType === "IMAGE" && item.imageUrl ? <img src={item.imageUrl} alt="" /> : item.mediaType === "VIDEO" && item.videoUrl ? <Video size={19} /> : <Sparkles size={19} />}</div>

                          <div className="admin-whats-new-update-info">
                            <strong>{item.title || "Untitled update"}</strong>

                            <span>{item.shortDescription || "No short description"}</span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="admin-whats-new-type">{getTypeLabel(item.type)}</span>
                      </td>

                      <td>
                        <span className={`admin-whats-new-status ${getStatusClass(item.status)}`}>
                          <i />
                          {item.status || "DRAFT"}
                        </span>
                      </td>

                      <td>
                        <span className="admin-whats-new-audience">{getAudienceLabel(item.targetAudience || item.audience)}</span>
                      </td>

                      <td>
                        <span className="admin-whats-new-date">
                          <CalendarDays size={14} />
                          {formatDate(item.releaseDate)}
                        </span>
                      </td>

                      <td>
                        <span className="admin-whats-new-version">{item.version ? `v${item.version}` : "—"}</span>
                      </td>

                      <td>
                        <div className="admin-whats-new-actions">
                          <button type="button" className="admin-whats-new-action view" onClick={() => setSelectedItem(item)} title="View">
                            <Eye size={15} />
                          </button>

                          <button type="button" className="admin-whats-new-action edit" onClick={() => openEdit(item)} title="Edit">
                            <Edit3 size={15} />
                          </button>

                          <button type="button" className="admin-whats-new-action delete" onClick={() => handleDelete(item)} disabled={deletingId === item._id} title="Archive">
                            {deletingId === item._id ? <LoaderCircle size={15} className="admin-whats-new-spin" /> : <Trash2 size={15} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {!loading && items.length > 0 && pagination.totalPages > 1 ? (
          <nav className="admin-whats-new-pagination">
            <button type="button" disabled={pagination.page <= 1} onClick={() => handlePageChange(pagination.page - 1)}>
              <ChevronLeft size={17} />
            </button>

            <span>
              Page <strong>{pagination.page}</strong> of <strong>{pagination.totalPages}</strong>
            </span>

            <button type="button" disabled={pagination.page >= pagination.totalPages} onClick={() => handlePageChange(pagination.page + 1)}>
              <ChevronRight size={17} />
            </button>
          </nav>
        ) : null}
      </div>

      {selectedItem ? (
        <div
          className="admin-whats-new-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedItem(null);
            }
          }}>
          <div className="admin-whats-new-view-modal">
            <button type="button" className="admin-whats-new-modal-close" onClick={() => setSelectedItem(null)}>
              <X size={19} />
            </button>

            {selectedItem.mediaType === "IMAGE" && selectedItem.imageUrl ? (
              <div className="admin-whats-new-modal-media">
                <img src={selectedItem.imageUrl} alt={selectedItem.title || "What's New"} />
              </div>
            ) : selectedItem.mediaType === "VIDEO" && selectedItem.videoUrl ? (
              <div className="admin-whats-new-modal-media">
                <iframe src={getYouTubeEmbedUrl(selectedItem.videoUrl) || selectedItem.videoUrl} title={selectedItem.title || "YouTube video"} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen style={{ border: 0 }} />
              </div>
            ) : null}

            <div className="admin-whats-new-modal-body">
              <div className="admin-whats-new-modal-tags">
                <span>{getTypeLabel(selectedItem.type)}</span>

                <span className={`admin-whats-new-status ${getStatusClass(selectedItem.status)}`}>
                  <i />
                  {selectedItem.status || "DRAFT"}
                </span>

                {selectedItem.version ? <span>v{selectedItem.version}</span> : null}
              </div>

              <h2>{selectedItem.title}</h2>

              {selectedItem.shortDescription ? <p className="admin-whats-new-modal-short">{selectedItem.shortDescription}</p> : null}

              {selectedItem.description ? (
                <div className="admin-whats-new-modal-section">
                  <h3>Description</h3>
                  <p>{selectedItem.description}</p>
                </div>
              ) : null}

              {Array.isArray(selectedItem.features) && selectedItem.features.length > 0 ? (
                <div className="admin-whats-new-modal-section">
                  <h3>What's included</h3>

                  <ul>
                    {selectedItem.features.map((feature, index) => (
                      <li key={`${feature}-${index}`}>{feature}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {selectedItem.howToUse ? (
                <div className="admin-whats-new-modal-section">
                  <h3>How to use</h3>
                  <p>{selectedItem.howToUse}</p>
                </div>
              ) : null}

              <div className="admin-whats-new-modal-footer">
                <span>
                  Audience: <strong>{getAudienceLabel(selectedItem.targetAudience || selectedItem.audience)}</strong>
                </span>

                <span>
                  Released: <strong>{formatDate(selectedItem.releaseDate)}</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {showForm ? (
        <div className="admin-whats-new-modal-overlay">
          <div className="admin-whats-new-form-modal">
            <div className="admin-whats-new-form-header">
              <div>
                <span>{editingItem ? "EDIT UPDATE" : "CREATE UPDATE"}</span>

                <h2>{editingItem ? "Edit What's New" : "Create New Update"}</h2>
              </div>

              <button type="button" onClick={closeForm} disabled={saving}>
                <X size={19} />
              </button>
            </div>

            {formError ? (
              <div className="admin-whats-new-form-error">
                <AlertCircle size={17} />
                <span>{formError}</span>
              </div>
            ) : null}

            <form className="admin-whats-new-form" onSubmit={handleSubmit}>
              <div className="admin-whats-new-form-grid">
                <label className="admin-whats-new-field full">
                  <span>Title *</span>

                  <input type="text" value={form.title} onChange={(event) => updateForm("title", event.target.value)} placeholder="e.g. Your Order Journey" />
                </label>

                <label className="admin-whats-new-field">
                  <span>Slug</span>

                  <input type="text" value={form.slug} onChange={(event) => updateForm("slug", event.target.value)} placeholder="your-order-journey" />
                </label>

                <label className="admin-whats-new-field">
                  <span>Version</span>

                  <input type="text" value={form.version} onChange={(event) => updateForm("version", event.target.value)} placeholder="1.0" />
                </label>

                <label className="admin-whats-new-field">
                  <span>Type</span>

                  <select value={form.type} onChange={(event) => updateForm("type", event.target.value)}>
                    {TYPE_OPTIONS.filter((option) => option.value).map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="admin-whats-new-field">
                  <span>Status</span>

                  <select value={form.status} onChange={(event) => updateForm("status", event.target.value)}>
                    {STATUS_OPTIONS.filter((option) => option.value).map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="admin-whats-new-field">
                  <span>Target Audience</span>

                  <select value={form.targetAudience} onChange={(event) => updateForm("targetAudience", event.target.value)}>
                    {AUDIENCE_OPTIONS.filter((option) => option.value).map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="admin-whats-new-field">
                  <span>Display Mode</span>

                  <select value={form.displayMode} onChange={(event) => updateForm("displayMode", event.target.value)}>
                    <option value="ONCE_PER_VERSION">Once per version</option>
                    <option value="ALWAYS">Always</option>
                  </select>
                </label>

                <label className="admin-whats-new-field">
                  <span>Release Date</span>

                  <div className="admin-whats-new-date-input-wrap">
                    <input type="date" value={form.releaseDate} onChange={(event) => updateForm("releaseDate", event.target.value)} />
                    <CalendarDays className="admin-whats-new-date-icon" size={17} strokeWidth={2} />
                  </div>
                </label>

                <label className="admin-whats-new-field full">
                  <span>Short Description *</span>

                  <textarea rows="3" value={form.shortDescription} onChange={(event) => updateForm("shortDescription", event.target.value)} placeholder="Short summary shown on the update card..." />
                </label>

                <label className="admin-whats-new-field full">
                  <span>Description</span>

                  <textarea rows="5" value={form.description} onChange={(event) => updateForm("description", event.target.value)} placeholder="Detailed description..." />
                </label>

                <label className="admin-whats-new-field full">
                  <span>
                    Features <small>One feature per line</small>
                  </span>

                  <textarea rows="5" value={form.featuresText} onChange={(event) => updateForm("featuresText", event.target.value)} placeholder={"Feature one\nFeature two\nFeature three"} />
                </label>

                <label className="admin-whats-new-field full">
                  <span>How to use</span>

                  <textarea rows="4" value={form.howToUse} onChange={(event) => updateForm("howToUse", event.target.value)} placeholder="Explain how users can use this feature..." />
                </label>

                <div className="admin-whats-new-media-box">
                  <div className="admin-whats-new-media-heading">
                    <Upload size={17} />

                    <div>
                      <strong>Media</strong>
                      <span>Optional image or video</span>
                    </div>
                  </div>

                  <div className="admin-whats-new-media-options">
                    <button type="button" className={form.mediaType === "NONE" ? "active" : ""} onClick={() => updateForm("mediaType", "NONE")}>
                      None
                    </button>

                    <button type="button" className={form.mediaType === "IMAGE" ? "active" : ""} onClick={() => updateForm("mediaType", "IMAGE")}>
                      <ImageIcon size={15} />
                      Image
                    </button>

                    <button type="button" className={form.mediaType === "VIDEO" ? "active" : ""} onClick={() => updateForm("mediaType", "VIDEO")}>
                      <Video size={15} />
                      Video
                    </button>
                  </div>

                  {form.mediaType === "IMAGE" ? (
                    <label className="admin-whats-new-field">
                      <span>Image URL *</span>

                      <input type="url" value={form.imageUrl} onChange={(event) => updateForm("imageUrl", event.target.value)} placeholder="https://..." />
                    </label>
                  ) : null}

                  {form.mediaType === "VIDEO" ? (
                    <>
                      <label className="admin-whats-new-field">
                        <span>Video URL *</span>

                        <input type="url" value={form.videoUrl} onChange={(event) => updateForm("videoUrl", event.target.value)} placeholder="https://..." />
                      </label>

                      <div className="admin-whats-new-checkboxes">
                        <label>
                          <input type="checkbox" checked={form.videoMuted} onChange={(event) => updateForm("videoMuted", event.target.checked)} />
                          Muted
                        </label>

                        <label>
                          <input type="checkbox" checked={form.videoAutoplay} onChange={(event) => updateForm("videoAutoplay", event.target.checked)} />
                          Autoplay
                        </label>

                        <label>
                          <input type="checkbox" checked={form.videoLoop} onChange={(event) => updateForm("videoLoop", event.target.checked)} />
                          Loop
                        </label>
                      </div>
                    </>
                  ) : null}
                </div>

                <label className="admin-whats-new-field">
                  <span>Action Text</span>

                  <input type="text" value={form.actionText} onChange={(event) => updateForm("actionText", event.target.value)} placeholder="Explore Feature" />
                </label>

                <label className="admin-whats-new-field">
                  <span>Action URL</span>

                  <input type="text" value={form.actionUrl} onChange={(event) => updateForm("actionUrl", event.target.value)} placeholder="/dashboard" />
                </label>
              </div>

              <div className="admin-whats-new-form-footer">
                <button type="button" className="admin-whats-new-form-cancel" onClick={closeForm} disabled={saving}>
                  Cancel
                </button>

                <button type="submit" className="admin-whats-new-form-save" disabled={saving}>
                  {saving ? (
                    <>
                      <LoaderCircle size={16} className="admin-whats-new-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      {editingItem ? "Save Changes" : "Create Update"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      <style>{`
        .admin-whats-new-page{width:100%;min-height:100%;box-sizing:border-box;background:var(--admin-bg);color:var(--admin-text);padding:32px 30px 50px}.admin-whats-new-inner{width:100%;max-width:1400px;margin:0 auto}.admin-whats-new-header{display:flex;align-items:center;justify-content:space-between;gap:25px;margin-bottom:28px}.admin-whats-new-heading{display:flex;align-items:center;gap:16px;min-width:0}.admin-whats-new-heading-icon{width:58px;height:58px;flex:0 0 58px;border-radius:17px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#2563eb,#4f46e5);color:#fff;box-shadow:0 10px 28px rgba(37,99,235,.25)}.admin-whats-new-heading h1{margin:0;font-size:30px;line-height:1.15;font-weight:400;letter-spacing:-.025em}.admin-whats-new-heading p{margin:7px 0 0;color:var(--admin-muted);font-size:13px;line-height:1.5}.admin-whats-new-header-actions{display:flex;align-items:center;gap:9px;flex-shrink:0}.admin-whats-new-refresh,.admin-whats-new-create{height:42px;border-radius:11px;padding:0 15px;display:inline-flex;align-items:center;justify-content:center;gap:8px;font-size:13px;font-weight:400;cursor:pointer;transition:.18s ease}.admin-whats-new-refresh{border:1px solid var(--admin-border);background:var(--admin-surface);color:var(--admin-text)}.admin-whats-new-refresh:hover{border-color:var(--admin-primary);color:var(--admin-primary);background:var(--admin-surface-2)}.admin-whats-new-create{border:1px solid var(--admin-primary);background:var(--admin-primary);color:#fff;box-shadow:0 7px 18px rgba(37,99,235,.2)}.admin-whats-new-create:hover{background:var(--admin-primary-hover);transform:translateY(-1px)}.admin-whats-new-refresh:disabled{opacity:.6;cursor:not-allowed}.admin-whats-new-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:13px;margin-bottom:18px}.admin-whats-new-stat-card{min-height:80px;box-sizing:border-box;padding:15px 17px;border:1px solid var(--admin-border);border-radius:15px;background:var(--admin-surface);display:flex;align-items:center;gap:13px;box-shadow:var(--admin-shadow-sm)}.admin-whats-new-stat-icon{width:42px;height:42px;flex:0 0 42px;border-radius:12px;display:flex;align-items:center;justify-content:center}.admin-whats-new-stat-icon.total{background:rgba(37,99,235,.14);color:#3b82f6}.admin-whats-new-stat-icon.published{background:rgba(22,163,74,.14);color:#22c55e}.admin-whats-new-stat-icon.drafts{background:rgba(217,119,6,.15);color:#f59e0b}.admin-whats-new-stat-icon.upcoming{background:rgba(2,132,199,.14);color:#0ea5e9}.admin-whats-new-stat-card span{display:block;color:var(--admin-muted);font-size:13px;margin-bottom:3px}.admin-whats-new-stat-card strong{display:block;color:var(--admin-text);font-size:21px;font-weight:400;line-height:1}.admin-whats-new-filters{display:flex;align-items:center;gap:9px;margin-bottom:14px}.admin-whats-new-search{height:43px;min-width:260px;flex:1;box-sizing:border-box;border:1px solid var(--admin-border);border-radius:11px;background:var(--admin-surface);display:flex;align-items:center;gap:9px;padding:0 12px;color:var(--admin-muted)}.admin-whats-new-search:focus-within{border-color:var(--admin-primary);box-shadow:0 0 0 3px rgba(37,99,235,.1)}.admin-whats-new-search input{width:100%;min-width:0;border:0;outline:0;background:transparent;color:var(--admin-text);font-size:13px}.admin-whats-new-search input::placeholder{color:var(--admin-placeholder)}.admin-whats-new-search button{border:0;background:transparent;color:var(--admin-muted);display:flex;cursor:pointer}.admin-whats-new-select{height:43px;min-width:145px;box-sizing:border-box;border:1px solid var(--admin-border);border-radius:11px;background:var(--admin-surface);display:flex;align-items:center;gap:7px;padding:0 10px;color:var(--admin-muted)}.admin-whats-new-select select{width:100%;border:0;outline:0;background:transparent;color:var(--admin-text);font-size:13px;cursor:pointer}.admin-whats-new-clear{height:43px;padding:0 13px;border:1px solid var(--admin-border);border-radius:11px;background:var(--admin-surface);color:var(--admin-muted);font-size:13px;font-weight:400;cursor:pointer}.admin-whats-new-clear:hover{color:var(--admin-danger);border-color:var(--admin-danger)}.admin-whats-new-error{display:flex;align-items:center;justify-content:space-between;gap:15px;margin-bottom:15px;padding:12px 14px;border:1px solid rgba(220,38,38,.65);border-radius:13px;background:var(--admin-danger-bg);color:var(--admin-text)}.admin-whats-new-error-content{display:flex;align-items:center;gap:11px;color:var(--admin-danger);min-width:0}.admin-whats-new-error-content strong{display:block;font-size:13px;margin-bottom:2px}.admin-whats-new-error-content span{display:block;color:var(--admin-muted);font-size:13px}.admin-whats-new-error>button{height:34px;padding:0 14px;border:0;border-radius:8px;background:var(--admin-danger);color:#fff;font-size:13px;font-weight:400;cursor:pointer}.admin-whats-new-loading{min-height:360px;border:1px solid var(--admin-border);border-radius:17px;background:var(--admin-surface);display:flex;align-items:center;justify-content:center;flex-direction:column;text-align:center}.admin-whats-new-loading svg{color:var(--admin-primary)}.admin-whats-new-loading h3{margin:15px 0 5px;font-size:16px}.admin-whats-new-loading p{margin:0;color:var(--admin-muted);font-size:13px}.admin-whats-new-empty{min-height:330px;border:1px dashed var(--admin-border-strong);border-radius:17px;background:var(--admin-surface);display:flex;align-items:center;justify-content:center;flex-direction:column;text-align:center;padding:30px}.admin-whats-new-empty-icon{width:56px;height:56px;border-radius:16px;background:var(--admin-primary-soft);color:var(--admin-primary);display:flex;align-items:center;justify-content:center;margin-bottom:15px}.admin-whats-new-empty h2{margin:0 0 7px;font-size:19px}.admin-whats-new-empty p{max-width:400px;margin:0 0 20px;color:var(--admin-muted);font-size:13px;line-height:1.6}.admin-whats-new-empty button{height:40px;padding:0 16px;border:0;border-radius:10px;background:var(--admin-primary);color:#fff;display:flex;align-items:center;gap:7px;font-size:13px;font-weight:400;cursor:pointer}.admin-whats-new-table-wrap{border:1px solid var(--admin-border);border-radius:16px;background:var(--admin-surface);box-shadow:var(--admin-shadow-sm);overflow:hidden}.admin-whats-new-table-scroll{width:100%;overflow-x:auto}.admin-whats-new-table{width:100%;min-width:950px;border-collapse:collapse}.admin-whats-new-table th{height:45px;padding:0 15px;text-align:left;border-bottom:1px solid var(--admin-border);background:var(--admin-surface-2);color:var(--admin-muted);font-size:13px;font-weight:400;letter-spacing:.05em;text-transform:uppercase;white-space:nowrap}.admin-whats-new-table td{padding:13px 15px;border-bottom:1px solid var(--admin-border);vertical-align:middle}.admin-whats-new-table tbody tr:last-child td{border-bottom:0}.admin-whats-new-table tbody tr:hover{background:var(--admin-surface-2)}.admin-whats-new-update-cell{display:flex;align-items:center;gap:11px;min-width:270px}.admin-whats-new-thumb{width:43px;height:43px;flex:0 0 43px;border-radius:11px;overflow:hidden;background:var(--admin-primary-soft);color:var(--admin-primary);display:flex;align-items:center;justify-content:center}.admin-whats-new-thumb img{width:100%;height:100%;object-fit:cover;display:block}.admin-whats-new-update-info{min-width:0}.admin-whats-new-update-info strong{display:block;max-width:320px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px;color:var(--admin-text)}.admin-whats-new-update-info span{display:block;max-width:320px;margin-top:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--admin-muted);font-size:13px}.admin-whats-new-type{display:inline-flex;padding:5px 8px;border-radius:7px;background:var(--admin-surface-3);color:var(--admin-text-secondary);font-size:13px;font-weight:400;white-space:nowrap}.admin-whats-new-status{display:inline-flex;align-items:center;gap:6px;padding:5px 8px;border-radius:7px;font-size:13px;font-weight:400;white-space:nowrap}.admin-whats-new-status i{width:6px;height:6px;border-radius:50%;background:currentColor}.admin-whats-new-status.status-published{background:var(--admin-success-bg);color:var(--admin-success)}.admin-whats-new-status.status-draft{background:var(--admin-warning-bg);color:var(--admin-warning)}.admin-whats-new-status.status-scheduled{background:var(--admin-info-bg);color:var(--admin-info)}.admin-whats-new-status.status-archived{background:var(--admin-surface-3);color:var(--admin-muted)}.admin-whats-new-audience,.admin-whats-new-version{font-size:13px;color:var(--admin-text-secondary);white-space:nowrap}.admin-whats-new-date{display:inline-flex;align-items:center;gap:6px;color:var(--admin-muted);font-size:13px;white-space:nowrap}.admin-whats-new-actions{display:flex;align-items:center;gap:5px}.admin-whats-new-action{width:32px;height:32px;border:1px solid var(--admin-border);border-radius:8px;background:var(--admin-surface);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:.16s ease}.admin-whats-new-action.view{color:var(--admin-info)}.admin-whats-new-action.edit{color:var(--admin-primary)}.admin-whats-new-action.delete{color:var(--admin-danger)}.admin-whats-new-action:hover{transform:translateY(-1px);background:var(--admin-surface-2)}.admin-whats-new-action.delete:hover{border-color:var(--admin-danger);background:var(--admin-danger-bg)}.admin-whats-new-action:disabled{opacity:.5;cursor:not-allowed;transform:none}.admin-whats-new-pagination{display:flex;align-items:center;justify-content:center;gap:14px;margin-top:20px}.admin-whats-new-pagination button{width:36px;height:36px;border:1px solid var(--admin-border);border-radius:9px;background:var(--admin-surface);color:var(--admin-text);display:flex;align-items:center;justify-content:center;cursor:pointer}.admin-whats-new-pagination button:hover:not(:disabled){border-color:var(--admin-primary);color:var(--admin-primary)}.admin-whats-new-pagination button:disabled{opacity:.4;cursor:not-allowed}.admin-whats-new-pagination span{font-size:13px;color:var(--admin-muted)}.admin-whats-new-pagination strong{color:var(--admin-text)}.admin-whats-new-modal-overlay{position:fixed;inset:0;z-index:2000;padding:25px;box-sizing:border-box;background:rgba(2,6,23,.68);backdrop-filter:blur(7px);-webkit-backdrop-filter:blur(7px);display:flex;align-items:center;justify-content:center;overflow-y:auto}.admin-whats-new-view-modal{position:relative;width:min(700px,100%);max-height:calc(100dvh - 50px);overflow-y:auto;border:1px solid var(--admin-border);border-radius:20px;background:var(--admin-surface);box-shadow:0 30px 90px rgba(0,0,0,.35)}.admin-whats-new-modal-close{position:absolute;top:13px;right:13px;z-index:3;width:35px;height:35px;border:1px solid var(--admin-border-strong);border-radius:9px;background:var(--admin-surface);color:var(--admin-text);display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 5px 16px rgba(15,23,42,.16);transition:.16s ease}.admin-whats-new-modal-close:hover{border-color:var(--admin-primary);color:var(--admin-primary);background:var(--admin-surface-2);transform:translateY(-1px)}.admin-whats-new-modal-media{width:100%;height:430px;background:var(--admin-surface-2);overflow:hidden}.admin-whats-new-modal-media img,.admin-whats-new-modal-media video,.admin-whats-new-modal-media iframe{width:100%;height:100%;display:block;object-fit:cover;border:0}.admin-whats-new-modal-body{padding:25px}.admin-whats-new-modal-tags{display:flex;align-items:center;gap:7px;flex-wrap:wrap;margin-bottom:12px}.admin-whats-new-modal-tags>span:not(.admin-whats-new-status){padding:5px 8px;border-radius:7px;background:var(--admin-surface-3);color:var(--admin-muted);font-size:13px;font-weight:400}.admin-whats-new-modal-body h2{margin:0 0 8px;font-size:25px;line-height:1.25}.admin-whats-new-modal-short{margin:0;color:var(--admin-muted);font-size:13px;line-height:1.6}.admin-whats-new-modal-section{margin-top:22px;padding-top:18px;border-top:1px solid var(--admin-border)}.admin-whats-new-modal-section h3{margin:0 0 9px;font-size:13px;font-weight:400}.admin-whats-new-modal-section p{margin:0;color:var(--admin-text-secondary);font-size:13px;line-height:1.7;white-space:pre-wrap}.admin-whats-new-modal-section ul{margin:0;padding-left:19px;color:var(--admin-text-secondary);font-size:13px;line-height:1.8}.admin-whats-new-modal-footer{display:flex;justify-content:space-between;gap:15px;margin-top:23px;padding-top:17px;border-top:1px solid var(--admin-border);color:var(--admin-muted);font-size:13px}.admin-whats-new-modal-footer strong{color:var(--admin-text)}.admin-whats-new-form-modal{width:min(900px,100%);max-height:calc(100dvh - 40px);overflow-y:auto;border:1px solid var(--admin-border);border-radius:20px;background:var(--admin-surface);box-shadow:0 30px 90px rgba(0,0,0,.4)}.admin-whats-new-form-header{position:sticky;top:0;z-index:4;display:flex;align-items:center;justify-content:space-between;padding:19px 22px;border-bottom:1px solid var(--admin-border);background:var(--admin-surface)}.admin-whats-new-form-header>div span{display:block;color:var(--admin-primary);font-size:13px;font-weight:400;letter-spacing:.12em;margin-bottom:4px}.admin-whats-new-form-header h2{margin:0;font-size:19px}.admin-whats-new-form-header button{width:35px;height:35px;border:1px solid var(--admin-border);border-radius:9px;background:var(--admin-surface);color:var(--admin-text);display:flex;align-items:center;justify-content:center;cursor:pointer}.admin-whats-new-form-error{margin:15px 22px 0;padding:10px 12px;border:1px solid rgba(220,38,38,.5);border-radius:9px;background:var(--admin-danger-bg);color:var(--admin-danger);display:flex;align-items:center;gap:8px;font-size:13px}.admin-whats-new-form{padding:20px 22px}.admin-whats-new-form-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:15px}.admin-whats-new-field{display:flex;flex-direction:column;gap:7px}.admin-whats-new-field.full{grid-column:1/-1}.admin-whats-new-field>span{font-size:13px;font-weight:400;color:var(--admin-text-secondary)}.admin-whats-new-field small{font-size:13px;color:var(--admin-muted);font-weight:400}.admin-whats-new-field input,.admin-whats-new-field select,.admin-whats-new-field textarea{width:100%;box-sizing:border-box;border:1px solid var(--admin-border);border-radius:9px;background:var(--admin-surface-2);color:var(--admin-text);outline:0;padding:10px 11px;font:inherit;font-size:13px}.admin-whats-new-field input,.admin-whats-new-field select{height:39px}.admin-whats-new-date-input-wrap{position:relative;width:100%}.admin-whats-new-date-input-wrap input[type=date]{padding-right:40px;cursor:pointer;accent-color:var(--admin-primary)}.admin-whats-new-date-input-wrap input[type=date]::-webkit-calendar-picker-indicator{opacity:0;cursor:pointer;width:18px;height:18px}.admin-whats-new-date-input-wrap input[type=date]::-webkit-datetime-edit{color:var(--admin-text)}.admin-whats-new-date-icon{position:absolute;right:11px;top:50%;transform:translateY(-50%);color:var(--admin-text);pointer-events:none;opacity:.9}.admin-whats-new-date-input-wrap:focus-within .admin-whats-new-date-icon{color:var(--admin-primary);opacity:1}.admin-whats-new-field textarea{resize:vertical;min-height:80px;line-height:1.5}.admin-whats-new-field input:focus,.admin-whats-new-field select:focus,.admin-whats-new-field textarea:focus{border-color:var(--admin-primary);box-shadow:0 0 0 3px rgba(37,99,235,.1)}.admin-whats-new-media-box{grid-column:1/-1;padding:15px;border:1px solid var(--admin-border);border-radius:13px;background:var(--admin-surface-2)}.admin-whats-new-media-heading{display:flex;align-items:center;gap:9px;color:var(--admin-primary);margin-bottom:13px}.admin-whats-new-media-heading strong{display:block;color:var(--admin-text);font-size:13px}.admin-whats-new-media-heading span{display:block;color:var(--admin-muted);font-size:13px;margin-top:2px}.admin-whats-new-media-options{display:flex;gap:7px;margin-bottom:13px}.admin-whats-new-media-options button{height:34px;padding:0 11px;border:1px solid var(--admin-border);border-radius:8px;background:var(--admin-surface);color:var(--admin-muted);display:flex;align-items:center;gap:6px;font-size:13px;font-weight:400;cursor:pointer}.admin-whats-new-media-options button.active{border-color:var(--admin-primary);background:var(--admin-primary-soft);color:var(--admin-primary)}.admin-whats-new-checkboxes{display:flex;align-items:center;gap:15px;margin-top:11px;flex-wrap:wrap}.admin-whats-new-checkboxes label{display:flex;align-items:center;gap:6px;color:var(--admin-text-secondary);font-size:13px}.admin-whats-new-checkboxes input{accent-color:var(--admin-primary)}.admin-whats-new-form-footer{position:sticky;bottom:0;display:flex;align-items:center;justify-content:flex-end;gap:8px;margin:20px -22px -20px;padding:14px 22px;border-top:1px solid var(--admin-border);background:var(--admin-surface)}.admin-whats-new-form-cancel,.admin-whats-new-form-save{height:39px;padding:0 15px;border-radius:9px;font-size:13px;font-weight:400;display:flex;align-items:center;justify-content:center;gap:7px;cursor:pointer}.admin-whats-new-form-cancel{border:1px solid var(--admin-border);background:var(--admin-surface);color:var(--admin-text)}.admin-whats-new-form-save{border:1px solid var(--admin-primary);background:var(--admin-primary);color:#fff}.admin-whats-new-form-cancel:disabled,.admin-whats-new-form-save:disabled{opacity:.6;cursor:not-allowed}.admin-whats-new-spin{animation:adminWhatsNewSpin .8s linear infinite}@keyframes adminWhatsNewSpin{to{transform:rotate(360deg)}}.admin-theme-swal-popup{width:min(520px,calc(100vw - 32px))!important;border:1px solid var(--admin-border)!important;border-radius:16px!important;background:var(--admin-surface)!important;color:var(--admin-text)!important;box-shadow:0 28px 80px rgba(15,23,42,.24)!important;padding:1.35rem!important}.admin-theme-swal-title{color:var(--admin-text)!important;font-size:19px!important;font-weight:400!important}.admin-theme-swal-html{color:var(--admin-muted)!important;font-size:13px!important;line-height:1.55!important}.admin-theme-swal-confirm,.admin-theme-swal-cancel{min-height:38px;padding:0 15px;border-radius:9px;font-size:13px;font-weight:400;cursor:pointer;margin:0 4px}.admin-theme-swal-confirm{border:1px solid var(--admin-primary);background:var(--admin-primary);color:#fff}.admin-theme-swal-confirm:hover{background:var(--admin-primary-hover)}.admin-theme-swal-cancel{border:1px solid var(--admin-border);background:var(--admin-surface-2);color:var(--admin-text)}.admin-theme-swal-cancel:hover{border-color:var(--admin-primary);color:var(--admin-primary)}.admin-theme-swal-popup .swal2-icon{margin:0 auto 1rem}.admin-theme-swal-popup .swal2-timer-progress-bar{background:var(--admin-primary)!important}@media(max-width:1000px){.admin-whats-new-stats{grid-template-columns:repeat(2,minmax(0,1fr))}.admin-whats-new-filters{flex-wrap:wrap}.admin-whats-new-search{min-width:100%}.admin-whats-new-select{flex:1}}@media(max-width:700px){.admin-whats-new-page{padding:22px 15px 40px}.admin-whats-new-header{align-items:flex-start;flex-direction:column}.admin-whats-new-header-actions{width:100%}.admin-whats-new-refresh,.admin-whats-new-create{flex:1}.admin-whats-new-heading h1{font-size:25px}.admin-whats-new-heading-icon{width:50px;height:50px;flex-basis:50px}.admin-whats-new-stats{grid-template-columns:1fr 1fr}.admin-whats-new-select{min-width:calc(50% - 5px)}.admin-whats-new-form-grid{grid-template-columns:1fr}.admin-whats-new-field.full,.admin-whats-new-media-box{grid-column:auto}.admin-whats-new-modal-overlay{padding:12px}.admin-whats-new-form-modal{max-height:calc(100dvh - 24px);border-radius:16px}.admin-whats-new-form{padding:16px}.admin-whats-new-form-header{padding:15px 16px}.admin-whats-new-form-footer{margin:20px -16px -16px;padding:12px 16px}.admin-whats-new-view-modal{max-height:calc(100dvh - 24px)}.admin-whats-new-modal-body{padding:19px}.admin-whats-new-modal-media{height:300px}.admin-whats-new-modal-footer{flex-direction:column}}@media(max-width:480px){.admin-whats-new-stats{grid-template-columns:1fr}.admin-whats-new-select{min-width:100%}.admin-whats-new-header-actions{flex-direction:column}.admin-whats-new-refresh,.admin-whats-new-create{width:100%}.admin-whats-new-error{align-items:flex-start;flex-direction:column}.admin-whats-new-error>button{width:100%}}
      `}</style>
    </div>
  );
}

export default AdminWhatsNew;
