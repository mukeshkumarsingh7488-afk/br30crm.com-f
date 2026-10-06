import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, ChevronDown, ChevronLeft, ChevronRight, Edit3, Eye, Plus, RefreshCw, RotateCcw, Search, Tag as TagIcon, Trash2, X } from "lucide-react";
import useBusiness from "../../hooks/useBusiness";
import { createTag, deleteTag, getTags, getTagRows, getTagPagination, restoreTag, updateTag } from "../../api/tag.api";
import { showAuthAlert } from "../../components/auth/authAlert";
import { isManagementRole } from "../../utils/permissions";

const EMPTY_FORM = { name: "", description: "", color: "", type: "CUSTOM" };

const errorMessage = (error, fallback = "Something went wrong.") => {
  const d = error?.response?.data;
  if (Array.isArray(d?.details) && d.details.length) {
    return d.details
      .map((x) => x?.message)
      .filter(Boolean)
      .join(", ");
  }
  return d?.message || d?.error?.message || d?.error || error?.message || fallback;
};

const idOf = (tag) => tag?._id || tag?.id || "";
const nameOf = (tag) => tag?.name || tag?.title || tag?.label || tag?.slug || "Unnamed tag";
const typeOf = (tag) => tag?.type || "CUSTOM";

const formatDate = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

export default function Tags() {
  const { businessId, loading: businessLoading, error: businessError, role, isBusinessOwner } = useBusiness();
  const canManage = isManagementRole({ role, isBusinessOwner });

  const [tags, setTags] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 50, total: 0, pages: 1 });
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [includeInactive, setIncludeInactive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const loadTags = useCallback(
    async (page = 1, override = {}) => {
      if (!businessId) return;
      const q = override.search !== undefined ? override.search : search;
      const t = override.type !== undefined ? override.type : type;
      const inactive = override.includeInactive !== undefined ? override.includeInactive : includeInactive;

      setLoading(true);
      setError("");
      try {
        const response = await getTags(businessId, {
          page,
          limit: pagination.limit,
          ...(q.trim() ? { search: q.trim() } : {}),
          ...(t ? { type: t } : {}),
          ...(inactive ? { includeInactive: true } : {}),
        });
        const fetchedTags = getTagRows(response);

        const filteredTags = inactive ? fetchedTags.filter((tag) => tag?.isActive === false) : fetchedTags.filter((tag) => tag?.isActive !== false);

        setTags(filteredTags);

        setPagination(
          getTagPagination(response, {
            page,
            limit: pagination.limit,
          })
        );
      } catch (e) {
        setTags([]);
        setPagination((p) => ({ ...p, page, total: 0, pages: 1 }));
        setError(errorMessage(e, "Unable to load tags."));
      } finally {
        setLoading(false);
      }
    },
    [businessId, search, type, includeInactive, pagination.limit]
  );

  useEffect(() => {
    if (businessId) loadTags(1);
  }, [businessId]);

  const openCreate = () => {
    setError("");
    setForm({ ...EMPTY_FORM });
    setModal({ mode: "create" });
  };

  const openEdit = (tag) => {
    if (typeOf(tag) === "SYSTEM") return;
    setError("");
    setForm({
      name: tag?.name || "",
      description: tag?.description || "",
      color: tag?.color || "",
      type: tag?.type || "CUSTOM",
    });
    setModal({ mode: "edit", tag });
  };

  const closeModal = () => {
    if (saving) return;
    setModal(null);
    setForm({ ...EMPTY_FORM });
    setError("");
  };

  const saveTag = async (event) => {
    event.preventDefault();
    const name = form.name.trim();

    if (!name) {
      await showAuthAlert({ icon: "warning", title: "Tag name required", text: "Please enter a tag name.", confirmButtonText: "OK" });
      return;
    }

    setSaving(true);
    setError("");
    const payload = {
      name,
      description: form.description.trim() || null,
      color: form.color.trim() || null,
      type: form.type || "CUSTOM",
    };

    try {
      if (modal.mode === "create") {
        await createTag(businessId, payload);
      } else {
        await updateTag(businessId, idOf(modal.tag), payload);
      }

      setModal(null);
      setForm({ ...EMPTY_FORM });
      await showAuthAlert({
        icon: "success",
        title: modal.mode === "create" ? "Tag created" : "Tag updated",
        text: "Tag saved successfully.",
        confirmButtonText: "Done",
      });
      await loadTags(1);
    } catch (e) {
      const msg = errorMessage(e, "Unable to save tag.");
      setError(msg);
      await showAuthAlert({
        icon: "error",
        title: modal.mode === "create" ? "Unable to create tag" : "Unable to update tag",
        text: msg,
        confirmButtonText: "OK",
      });
    } finally {
      setSaving(false);
    }
  };

  const deactivateTag = async (tag) => {
    if (typeOf(tag) === "SYSTEM") return;
    const result = await showAuthAlert({
      icon: "warning",
      title: "Deactivate tag?",
      text: `"${nameOf(tag)}" will no longer appear in active tag lists.`,
      showCancelButton: true,
      confirmButtonText: "Deactivate",
      cancelButtonText: "Cancel",
    });
    if (!result?.isConfirmed) return;

    try {
      await deleteTag(businessId, idOf(tag));
      await showAuthAlert({ icon: "success", title: "Tag deactivated", text: "Tag deactivated successfully.", confirmButtonText: "Done" });
      await loadTags(pagination.page);
    } catch (e) {
      await showAuthAlert({ icon: "error", title: "Deactivate failed", text: errorMessage(e, "Unable to deactivate tag."), confirmButtonText: "OK" });
    }
  };

  const restoreTagRecord = async (tag) => {
    try {
      await restoreTag(businessId, idOf(tag));
      await showAuthAlert({ icon: "success", title: "Tag restored", text: "Tag restored successfully.", confirmButtonText: "Done" });
      await loadTags(pagination.page);
    } catch (e) {
      await showAuthAlert({ icon: "error", title: "Restore failed", text: errorMessage(e, "Unable to restore tag."), confirmButtonText: "OK" });
    }
  };

  const clearFilters = () => {
    setSearch("");
    setType("");
    setIncludeInactive(false);
    loadTags(1, { search: "", type: "", includeInactive: false });
  };

  const total = Number(pagination.total || 0);
  const active = useMemo(() => tags.filter((x) => x?.isActive !== false).length, [tags]);
  const custom = useMemo(() => tags.filter((x) => typeOf(x) === "CUSTOM").length, [tags]);

  return (
    <div className="tags-page">
      <style>{`
        .tags-page{padding:24px 26px 40px;color:var(--crm-text);min-width:0}
        .tags-head{display:flex;align-items:flex-end;justify-content:space-between;gap:22px;margin-bottom:22px}
        .tags-eyebrow{font-size:13px;color:var(--crm-primary);font-weight:400;text-transform:uppercase;letter-spacing:.12em;margin-bottom:7px}
        .tags-title{font-family:inherit!important;font-size:29px!important;line-height:1.15;letter-spacing:-.8px;margin:0;color:var(--crm-text);font-weight:400}
        .tags-subtitle{margin:8px 0 0;color:var(--crm-muted);font-size:13px;line-height:1.55}
        .tags-actions{display:flex;gap:9px;flex-shrink:0}
        .tags-btn{height:40px;padding:0 14px;border-radius:10px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);font-size:13px;font-weight:400;display:inline-flex;align-items:center;justify-content:center;gap:8px;cursor:pointer}
        .tags-search>svg{position:absolute;left:11px;top:50%;transform:translateY(-50%);color:var(--crm-muted);pointer-events:none}
        .tags-btn.primary{border-color:var(--crm-primary);background:var(--crm-primary);color:#fff}
        .tags-btn:disabled{opacity:.55;cursor:not-allowed}
        .tags-btn.small{height:34px;padding:0 11px;border-radius:8px;font-size:13px}
        .tags-stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin-bottom:18px}
        .tags-stat{background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:15px;padding:13px 15px;min-height:70px;display:flex;align-items:center;justify-content:space-between;gap:12px;box-shadow:var(--crm-shadow)}
        .tags-stat-title{font-size:13px;color:var(--crm-muted);text-transform:uppercase;font-weight:400}
        .tags-stat-value{font-size:21px;line-height:1.1;font-weight:400;margin-top:3px}
        .tags-stat-detail{font-size:13px;color:var(--crm-muted);margin-top:3px}
        .tags-stat-icon{width:34px;height:34px;border-radius:10px;background:var(--crm-primary-soft);color:var(--crm-primary);display:grid;place-items:center}
        .tags-stat-icon.green{background:color-mix(in srgb,var(--crm-success) 11%,transparent);color:var(--crm-success)}
        .tags-stat-icon.orange{background:color-mix(in srgb,var(--crm-warning) 12%,transparent);color:var(--crm-warning)}
        .tags-panel{background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:15px;box-shadow:var(--crm-shadow);overflow:visible}
        .tags-panel-head{display:flex;align-items:center;justify-content:space-between;gap:15px;padding:15px 17px;border-bottom:1px solid var(--crm-border)}
        .tags-panel-title{font-size:13px;font-weight:400}.tags-panel-subtitle{margin-top:3px;color:var(--crm-muted);font-size:13px}
        .tags-panel-actions{display:flex;align-items:center;gap:8px}
        .tags-clear{height:34px;border:1px solid var(--crm-border);background:var(--crm-surface-2);color:var(--crm-muted);border-radius:8px;padding:0 10px;font-size:13px;font-weight:400;cursor:pointer}
        .tags-toolbar{display:grid;grid-template-columns:minmax(260px,1fr) 150px 180px;gap:8px;padding:12px 17px;border-bottom:1px solid var(--crm-border)}
        .tags-search{position:relative}.tags-search>svg{position:absolute;left:11px;top:50%;transform:translateY(-50%);display:block;color:var(--crm-muted);pointer-events:none}
        .tags-search input,.tags-filter,.tags-toggle{height:38px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:9px;font-size:13px}
        .tags-search input{width:100%;padding:0 34px 0 32px;outline:0}.tags-search input:focus,.tags-filter:focus{border-color:var(--crm-primary)}
        .tags-search-clear{position:absolute;right:7px;top:7px;width:24px;height:24px;border:0;background:transparent;color:var(--crm-muted);display:grid;place-items:center;cursor:pointer}
        .tags-filter{width:100%;appearance:none;padding:0 30px 0 11px;outline:0}.tags-select{position:relative}.tags-select>svg{position:absolute;right:10px;top:12px;color:var(--crm-muted);pointer-events:none}
        .tags-toggle{display:flex;align-items:center;gap:7px;padding:0 10px;font-weight:400}.tags-toggle input{accent-color:var(--crm-primary)}
        .tags-table-wrap{overflow:auto}.tags-table{width:100%;border-collapse:collapse;min-width:760px}
        .tags-table th{padding:10px 13px;text-align:left;background:var(--crm-surface-2);border-bottom:1px solid var(--crm-border);color:var(--crm-muted);font-size:13px;font-weight:400;text-transform:uppercase}
        .tags-table td{padding:11px 13px;border-bottom:1px solid var(--crm-border);font-size:13px;vertical-align:middle}
        .tags-table tbody tr:hover{background:color-mix(in srgb,var(--crm-primary) 3%,transparent)}
        .tags-name{display:flex;align-items:center;gap:9px;min-width:180px}.tags-dot{width:9px;height:9px;border-radius:50%;border:1px solid color-mix(in srgb,var(--crm-text) 15%,transparent)}
        .tags-name-main{font-weight:400}.tags-slug{margin-top:2px;color:var(--crm-muted);font-size:13px}
        .tags-badge{display:inline-flex;align-items:center;gap:5px;border-radius:999px;padding:5px 8px;font-size:13px;font-weight:400}
        .tags-badge.custom{background:color-mix(in srgb,var(--crm-primary) 10%,transparent);color:var(--crm-primary)}
        .tags-badge.system{background:color-mix(in srgb,var(--crm-warning) 11%,transparent);color:var(--crm-warning)}
        .tags-badge.active{background:color-mix(in srgb,var(--crm-success) 10%,transparent);color:var(--crm-success)}
        .tags-badge.inactive{background:color-mix(in srgb,var(--crm-danger) 9%,transparent);color:var(--crm-danger)}
        .tags-actions-cell{display:flex;justify-content:flex-end;gap:5px}.tags-icon{width:30px;height:30px;border:1px solid var(--crm-border);background:var(--crm-surface-2);color:var(--crm-muted);border-radius:8px;display:grid;place-items:center;cursor:pointer}
        .tags-icon:hover:not(:disabled){color:var(--crm-primary);border-color:var(--crm-primary)}.tags-icon.danger:hover:not(:disabled){color:var(--crm-danger);border-color:var(--crm-danger)}.tags-icon:disabled{opacity:.35;cursor:not-allowed}
        .tags-empty,.tags-loading{padding:35px;text-align:center;color:var(--crm-muted);font-size:13px}.tags-loading{display:flex;align-items:center;justify-content:center;gap:8px}
        .tags-spinner{width:14px;height:14px;border:2px solid currentColor;border-right-color:transparent;border-radius:50%;display:inline-block;animation:tags-spin .7s linear infinite}@keyframes tags-spin{to{transform:rotate(360deg)}}
        .tags-pagination{display:flex;align-items:center;justify-content:space-between;padding:11px 14px}.tags-page-info{font-size:13px;color:var(--crm-muted)}.tags-page-actions{display:flex;gap:5px}
        .tags-page-btn{width:31px;height:31px;border:1px solid var(--crm-border);background:var(--crm-surface-2);color:var(--crm-text);border-radius:8px;display:grid;place-items:center;cursor:pointer}.tags-page-btn:disabled{opacity:.4;cursor:not-allowed}
        .tags-error{margin:0 17px 12px;padding:9px 10px;border:1px solid color-mix(in srgb,var(--crm-danger) 35%,transparent);background:color-mix(in srgb,var(--crm-danger) 7%,transparent);border-radius:8px;color:var(--crm-danger);font-size:13px}
        .tags-backdrop{position:fixed;inset:0;background:rgba(3,8,20,.58);backdrop-filter:blur(3px);display:flex;align-items:center;justify-content:center;padding:18px;z-index:5000}
        .tags-modal{width:min(520px,100%);max-height:92vh;overflow:auto;background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:15px;box-shadow:0 24px 70px rgba(0,0,0,.35)}
        .tags-modal-head{display:flex;align-items:center;justify-content:space-between;padding:16px 18px;border-bottom:1px solid var(--crm-border)}.tags-modal-title{font-size:15px;font-weight:400}.tags-modal-sub{font-size:13px;color:var(--crm-muted);margin-top:3px}
        .tags-close{width:30px;height:30px;border:1px solid var(--crm-border);background:var(--crm-surface-2);color:var(--crm-muted);border-radius:8px;display:grid;place-items:center;cursor:pointer}
        .tags-form{padding:17px}.tags-field{display:grid;gap:6px;margin-bottom:13px}.tags-field label{font-size:13px;font-weight:400}
        .tags-field input,.tags-field textarea,.tags-field select{width:100%;border:1px solid var(--crm-border);background:var(--crm-surface-2);color:var(--crm-text);border-radius:9px;outline:0;font-size:13px;padding:10px}.tags-field input:focus,.tags-field textarea:focus,.tags-field select:focus{border-color:var(--crm-primary)}
        .tags-field textarea{min-height:85px;resize:vertical}.tags-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.tags-color{display:flex;gap:8px}.tags-color input[type=color]{width:42px;padding:3px;cursor:pointer}.tags-color input[type=text]{flex:1}
        .tags-modal-foot{display:flex;justify-content:flex-end;gap:8px;padding:12px 17px;border-top:1px solid var(--crm-border)}
        @media(max-width:900px){.tags-toolbar{grid-template-columns:1fr 1fr}.tags-toggle{grid-column:1/-1}.tags-stats{grid-template-columns:1fr 1fr}}
        @media(max-width:700px){.tags-page{padding:20px 14px 30px}.tags-head{align-items:flex-start;flex-direction:column}.tags-actions{width:100%}.tags-actions .tags-btn{flex:1}.tags-stats{grid-template-columns:1fr}.tags-toolbar{grid-template-columns:1fr}.tags-toggle{grid-column:auto}.tags-panel-head{align-items:flex-start;flex-direction:column}.tags-panel-actions{width:100%;justify-content:flex-end}.tags-grid{grid-template-columns:1fr}.tags-backdrop{padding:10px}}
      `}</style>

      <div className="tags-head">
        <div>
          <h1 className="tags-title">Tags</h1>
          <p className="tags-subtitle">Create and manage reusable tags across your BR30 CRM workspace.</p>
        </div>
        <div className="tags-actions">
          <button type="button" className="tags-btn" onClick={() => loadTags(pagination.page)} disabled={loading || businessLoading || !businessId}>
            <RefreshCw size={14} />
            {loading ? "Refreshing..." : "Refresh"}
          </button>
          {canManage && (
            <button type="button" className="tags-btn primary" onClick={openCreate} disabled={!businessId}>
              <Plus size={15} />
              New tag
            </button>
          )}
        </div>
      </div>

      {(error || businessError) && <div className="tags-error">{error || businessError}</div>}

      <div className="tags-stats">
        <article className="tags-stat">
          <div>
            <div className="tags-stat-title">Total tags</div>
            <div className="tags-stat-value">{total}</div>
            <div className="tags-stat-detail">Tags in current result</div>
          </div>
          <div className="tags-stat-icon">
            <TagIcon size={17} />
          </div>
        </article>
        <article className="tags-stat">
          <div>
            <div className="tags-stat-title">Active</div>
            <div className="tags-stat-value">{active}</div>
            <div className="tags-stat-detail">Currently available</div>
          </div>
          <div className="tags-stat-icon green">
            <Check size={17} />
          </div>
        </article>
        <article className="tags-stat">
          <div>
            <div className="tags-stat-title">Custom</div>
            <div className="tags-stat-value">{custom}</div>
            <div className="tags-stat-detail">Business-created tags</div>
          </div>
          <div className="tags-stat-icon orange">
            <TagIcon size={17} />
          </div>
        </article>
      </div>

      <section className="tags-panel">
        <div className="tags-toolbar">
          <div className="tags-search">
            <Search size={15} />
            <input
              value={search}
              onChange={(e) => {
                const value = e.target.value;
                setSearch(value);
                loadTags(1, { search: value });
              }}
              placeholder="Search tags..."
            />
            {search && (
              <button
                type="button"
                className="tags-search-clear"
                onClick={() => {
                  setSearch("");
                  loadTags(1, { search: "" });
                }}>
                <X size={13} />
              </button>
            )}
          </div>
          <div className="tags-select">
            <select
              className="tags-filter"
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                loadTags(1, { type: e.target.value });
              }}>
              <option value="">All types</option>
              <option value="CUSTOM">Custom</option>
              <option value="SYSTEM">System</option>
            </select>
            <ChevronDown size={13} />
          </div>
          <label className="tags-toggle">
            <input
              type="checkbox"
              checked={includeInactive}
              onChange={(e) => {
                setIncludeInactive(e.target.checked);
                loadTags(1, { includeInactive: e.target.checked });
              }}
            />
            Show inactive tags
          </label>
        </div>

        <div className="tags-table-wrap">
          {loading ? (
            <div className="tags-loading">
              <span className="tags-spinner" />
              Loading tags...
            </div>
          ) : tags.length ? (
            <table className="tags-table">
              <thead>
                <tr>
                  <th>Tag</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Description</th>
                  <th>Created</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tags.map((tag) => {
                  const system = typeOf(tag) === "SYSTEM";
                  const activeState = tag?.isActive !== false;
                  return (
                    <tr key={idOf(tag)}>
                      <td>
                        <div className="tags-name">
                          <span className="tags-dot" style={{ background: tag?.color || "var(--crm-primary)" }} />
                          <div>
                            <div className="tags-name-main">{nameOf(tag)}</div>
                            <div className="tags-slug">{tag?.slug || "—"}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`tags-badge ${system ? "system" : "custom"}`}>{system ? "System" : "Custom"}</span>
                      </td>
                      <td>
                        <span className={`tags-badge ${activeState ? "active" : "inactive"}`}>
                          <span>●</span>
                          {activeState ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>{tag?.description || "—"}</td>
                      <td>{formatDate(tag?.createdAt)}</td>
                      <td>
                        <div className="tags-actions-cell">
                          <button
                            type="button"
                            className="tags-icon"
                            title="View"
                            onClick={() =>
                              showAuthAlert({ icon: "info", title: "Tag details", text: [`Name: ${nameOf(tag)}`, `Type: ${typeOf(tag)}`, `Status: ${activeState ? "Active" : "Inactive"}`, `Slug: ${tag?.slug || "—"}`, `Description: ${tag?.description || "—"}`].join("\n"), confirmButtonText: "Close" })
                            }>
                            <Eye size={14} />
                          </button>
                          {canManage && (
                            <button type="button" className="tags-icon" title={system ? "System tags cannot be edited" : "Edit"} disabled={system} onClick={() => openEdit(tag)}>
                              <Edit3 size={14} />
                            </button>
                          )}
                          {canManage &&
                            (activeState ? (
                              <button type="button" className="tags-icon danger" title={system ? "System tags cannot be deactivated" : "Deactivate"} disabled={system} onClick={() => deactivateTag(tag)}>
                                <Trash2 size={14} />
                              </button>
                            ) : canManage ? (
                              <button type="button" className="tags-icon" title="Restore" onClick={() => restoreTagRecord(tag)}>
                                <RotateCcw size={14} />
                              </button>
                            ) : null)}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="tags-empty">No tags found for the selected filters.</div>
          )}
        </div>

        <div className="tags-pagination">
          <div className="tags-page-info">
            Page {pagination.page || 1} of {pagination.pages || 1} · {pagination.total || 0} tags
          </div>
          <div className="tags-page-actions">
            <button type="button" className="tags-page-btn" disabled={(pagination.page || 1) <= 1 || loading} onClick={() => loadTags((pagination.page || 1) - 1)}>
              <ChevronLeft size={14} />
            </button>
            <button type="button" className="tags-page-btn" disabled={(pagination.page || 1) >= (pagination.pages || 1) || loading} onClick={() => loadTags((pagination.page || 1) + 1)}>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {modal && (
        <div className="tags-backdrop" onMouseDown={closeModal}>
          <div className="tags-modal" onMouseDown={(e) => e.stopPropagation()}>
            <div className="tags-modal-head">
              <div>
                <div className="tags-modal-title">{modal.mode === "create" ? "Create tag" : "Edit tag"}</div>
                <div className="tags-modal-sub">Manage a reusable CRM tag for this business.</div>
              </div>
              <button type="button" className="tags-close" onClick={closeModal} disabled={saving}>
                <X size={14} />
              </button>
            </div>
            <form className="tags-form" onSubmit={saveTag}>
              <div className="tags-field">
                <label>Tag name *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. VIP Customer" maxLength={100} autoFocus />
              </div>
              <div className="tags-grid">
                <div className="tags-field">
                  <label>Type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} disabled={modal.mode === "edit"}>
                    <option value="CUSTOM">Custom</option>
                    <option value="SYSTEM">System</option>
                  </select>
                </div>
                <div className="tags-field">
                  <label>Color</label>
                  <div className="tags-color">
                    <input type="color" value={form.color || "#7C83F6"} onChange={(e) => setForm({ ...form, color: e.target.value })} />
                    <input type="text" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} placeholder="#7C83F6" maxLength={30} />
                  </div>
                </div>
              </div>
              <div className="tags-field">
                <label>Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Short description for this tag..." maxLength={500} />
              </div>
              {error && (
                <div className="tags-error" style={{ margin: "0 0 12px" }}>
                  {error}
                </div>
              )}
              <div className="tags-modal-foot" style={{ margin: "0 -17px -17px" }}>
                <button type="button" className="tags-btn" onClick={closeModal} disabled={saving}>
                  Cancel
                </button>
                <button type="submit" className="tags-btn primary" disabled={saving}>
                  {saving && <span className="tags-spinner" />}
                  {saving ? "Saving..." : modal.mode === "create" ? "Create tag" : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
