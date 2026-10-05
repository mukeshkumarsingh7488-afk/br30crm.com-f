import { useCallback, useEffect, useState } from "react";
import { ExternalLink, Globe, Link2, Plus, RefreshCw, Search, Trash2, X } from "lucide-react";
import useBusiness from "../../hooks/useBusiness";
import { createLeadSource, deleteLeadSource, getLeadSourceLink, getLeadSources, toggleLeadSource, updateLeadSource } from "../../api/lead-source.api";
import { getPublicForms } from "../../api/public-form.api";
import { showAuthAlert } from "../../components/auth/authAlert";

const blank = {
  name: "",
  type: "SOURCE",
  code: "",
  medium: "",
  description: "",
  active: true,
};

const err = (e) => e?.response?.data?.message || e?.response?.data?.error || e?.message || "Something went wrong.";

const unwrapItems = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.items)) return response.items;
  if (Array.isArray(response?.sources)) return response.sources;
  if (Array.isArray(response?.forms)) return response.forms;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.items)) return response.data.items;
  if (Array.isArray(response?.data?.forms)) return response.data.forms;
  return [];
};

const unwrapObject = (response) => {
  if (!response) return {};
  if (response?.data?.data && typeof response.data.data === "object") {
    return response.data.data;
  }
  if (response?.data && typeof response.data === "object") {
    return response.data;
  }
  return response;
};

const getLinkValue = (data) => data?.trackingUrl || data?.publicUrl || data?.url || data?.link || data?.attributionUrl || "";

export default function SourcesCampaigns() {
  const { businessId, loading: businessLoading } = useBusiness();

  const [items, setItems] = useState([]);
  const [publicForms, setPublicForms] = useState([]);

  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [active, setActive] = useState("");

  const [loading, setLoading] = useState(true);
  const [formsLoading, setFormsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toggling, setToggling] = useState(null);
  const [linkLoading, setLinkLoading] = useState(false);

  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ ...blank });

  const [linkModal, setLinkModal] = useState(false);
  const [linkData, setLinkData] = useState(null);
  const [selectedFormId, setSelectedFormId] = useState("");
  const [selectedSourceId, setSelectedSourceId] = useState("");

  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!businessId) return;

    setLoading(true);
    setError("");

    try {
      const params = {
        search: search || undefined,
        type: type || undefined,
        active: active === "" ? undefined : active,
      };

      const response = await getLeadSources(businessId, params);
      setItems(unwrapItems(response));
    } catch (e) {
      setError(err(e));
    } finally {
      setLoading(false);
    }
  }, [businessId, search, type, active]);

  const loadPublicForms = useCallback(async () => {
    if (!businessId) return;

    setFormsLoading(true);

    try {
      const response = await getPublicForms(businessId);
      const forms = unwrapItems(response);

      setPublicForms(forms.filter((item) => item && item.slug && String(item.status || "ACTIVE").toUpperCase() === "ACTIVE"));
    } catch {
      setPublicForms([]);
    } finally {
      setFormsLoading(false);
    }
  }, [businessId]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    loadPublicForms();
  }, [loadPublicForms]);

  const closeModal = () => {
    if (saving) return;

    setModal(false);
    setEditing(null);
    setForm({ ...blank });
  };

  const openCreate = () => {
    setEditing(null);
    setError("");
    setForm({ ...blank });
    setModal(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setError("");

    setForm({
      ...blank,
      name: item.name || "",
      type: item.type || "SOURCE",
      code: item.code || "",
      medium: item.medium || "",
      description: item.description || "",
      active: item.active !== false,
    });

    setModal(true);
  };

  const save = async () => {
    setError("");

    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        name: form.name.trim(),
        type: form.type,
        code: form.code.trim(),
        medium: form.medium.trim(),
        description: form.description.trim(),
        active: Boolean(form.active),
      };

      if (editing) {
        await updateLeadSource(businessId, editing._id, payload);
      } else {
        await createLeadSource(businessId, payload);
      }

      closeModal();
      await load();

      showAuthAlert({
        icon: "success",
        title: editing ? "Updated" : "Created",
        text: editing ? "Lead source settings updated successfully." : "Lead source created successfully.",
        confirmButtonText: "Done",
      });
    } catch (e) {
      setError(err(e));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (item) => {
    if (!businessId || !item?._id) return;

    const result = await showAuthAlert({
      icon: "warning",
      title: "Delete source/campaign?",
      text: `"${item.name}" will be permanently deleted. This action cannot be undone.`,
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    });

    if (!result?.isConfirmed) return;

    try {
      await deleteLeadSource(businessId, item._id);
      await load();

      showAuthAlert({
        icon: "success",
        title: "Deleted",
        text: "Source/campaign deleted successfully.",
        confirmButtonText: "Done",
      });
    } catch (e) {
      const message = err(e);

      showAuthAlert({
        icon: "error",
        title: "Delete failed",
        text: message || "Unable to delete source/campaign.",
        confirmButtonText: "OK",
      });

      setError(message);
    }
  };

  const toggle = async (item) => {
    if (!item?._id || toggling) return;

    setToggling(item._id);
    setError("");

    try {
      const response = await toggleLeadSource(businessId, item._id);
      const updated = unwrapObject(response);

      if (updated?._id) {
        setItems((prev) => prev.map((x) => (x._id === updated._id ? { ...x, ...updated } : x)));
      } else {
        await load();
      }

      showAuthAlert({
        icon: "success",
        title: item.active ? "Deactivated" : "Activated",
        text: `"${item.name}" is now ${item.active ? "inactive" : "active"}.`,
        confirmButtonText: "Done",
      });
    } catch (e) {
      setError(err(e));
    } finally {
      setToggling(null);
    }
  };

  const openLink = async (item) => {
    if (!item?._id) return;

    setSelectedSourceId(item._id);
    setLinkData(null);
    setSelectedFormId("");
    setLinkModal(true);
    setError("");

    await loadPublicForms();
  };

  const generateLink = async (item) => {
    if (!item?._id || !selectedFormId) {
      setError("Please select a public form first.");
      return;
    }

    const selectedForm = publicForms.find((formItem) => String(formItem._id) === String(selectedFormId));

    if (!selectedForm?.slug) {
      setError("Selected public form does not have a valid slug.");
      return;
    }

    setLinkLoading(true);
    setError("");
    setLinkData(null);

    try {
      const response = await getLeadSourceLink(businessId, item._id, {
        formId: selectedForm._id,
        formSlug: selectedForm.slug,
      });

      const data = unwrapObject(response);

      setLinkData({
        ...data,
        selectedFormName: selectedForm.name,
        selectedFormSlug: selectedForm.slug,
      });
    } catch (e) {
      setError(err(e));
    } finally {
      setLinkLoading(false);
    }
  };

  const copyText = async (value) => {
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);

      showAuthAlert({
        icon: "success",
        title: "Copied",
        text: "Tracking link copied to clipboard.",
        confirmButtonText: "Done",
      });
    } catch {
      setError("Unable to copy the link.");
    }
  };

  const closeLinkModal = () => {
    if (linkLoading) return;

    setLinkModal(false);
    setLinkData(null);
    setSelectedFormId("");
    setSelectedSourceId("");
  };

  return (
    <div className="src-page">
      <style>{`
.src-page{padding:24px 26px 38px;max-width:1500px;margin:auto;color:var(--crm-text)}
.src-head{display:flex;justify-content:space-between;gap:16px;align-items:flex-start;margin-bottom:16px}
.src-title{font-size:24px;font-weight:400;margin:0}
.src-sub{font-size:13px;color:var(--crm-muted);margin:5px 0}
.src-actions,.src-toolbar{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.src-btn,.src-select{height:38px;border:1px solid var(--crm-border);border-radius:9px;background:var(--crm-surface);color:var(--crm-text);padding:0 11px;display:inline-flex;align-items:center;justify-content:center;gap:7px;font-size:13px;cursor:pointer;transition:border-color .15s ease,background .15s ease,color .15s ease}
.src-btn:hover,.src-select:hover{border-color:var(--crm-primary)}
.src-btn:disabled{opacity:.55;cursor:not-allowed}
.src-btn.primary{background:var(--crm-primary);border-color:var(--crm-primary);color:#fff}
.src-search{position:relative;width:min(390px,100%)}
.src-search input{width:100%;height:38px;border:1px solid var(--crm-border);border-radius:9px;background:var(--crm-surface);color:var(--crm-text);padding:0 36px;font-size:13px;box-sizing:border-box;outline:0}
.src-search input:focus{border-color:var(--crm-primary)}
.src-search>svg{position:absolute;left:10px;top:50%;transform:translateY(-50%);color:var(--crm-muted);pointer-events:none}
.src-search-clear{position:absolute;right:7px;top:50%;transform:translateY(-50%);width:24px;height:24px;border:0;border-radius:7px;background:transparent!important;color:var(--crm-muted);display:grid;place-items:center;padding:0;cursor:pointer;box-shadow:none!important}
.src-search-clear:hover,.src-search-clear:focus{background:transparent!important;color:var(--crm-text);box-shadow:none!important}
.src-table{margin-top:13px;border:1px solid var(--crm-border);border-radius:14px;overflow:auto;background:var(--crm-surface);box-shadow:var(--crm-shadow)}
.src-table table{width:100%;border-collapse:collapse;min-width:900px}
.src-table th,.src-table td{padding:12px 14px;border-bottom:1px solid var(--crm-border);text-align:left;font-size:13px}
.src-table tr:last-child td{border-bottom:0}
.src-table th{background:var(--crm-surface-2);color:var(--crm-muted);font-weight:400;text-transform:uppercase;font-size:11px;letter-spacing:.05em}
.src-table td strong{font-weight:500}
.badge{display:inline-flex;padding:5px 8px;border-radius:999px;background:var(--crm-surface-2);font-size:11px}
.badge.active{color:var(--crm-success,#16a34a)}
.badge.inactive{color:var(--crm-muted)}
.src-error{margin:10px 0;padding:10px 12px;border-radius:9px;background:var(--crm-surface-2);color:var(--crm-danger);font-size:13px}
.src-modal{position:fixed;inset:0;background:rgba(15,23,42,.48);display:grid;place-items:center;padding:18px;z-index:900}
.src-dialog{width:min(650px,100%);max-height:calc(100vh - 36px);overflow:auto;background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:14px;padding:18px}
.src-dialog-head{display:flex;justify-content:space-between;align-items:center;gap:10px}
.src-dialog-title{font-size:15px;font-weight:500}
.src-form{display:grid;grid-template-columns:1fr 1fr;gap:11px;margin-top:15px}
.src-form label{display:grid;gap:6px;font-size:12px;color:var(--crm-muted)}
.src-form input,.src-form select,.src-form textarea{border:1px solid var(--crm-border);border-radius:9px;background:var(--crm-surface);color:var(--crm-text);padding:9px 10px;font-size:13px;outline:0}
.src-form input:focus,.src-form select:focus,.src-form textarea:focus{border-color:var(--crm-primary)}
.src-form textarea{min-height:90px;resize:vertical}
.span{grid-column:1/-1}
.src-check{display:flex!important;align-items:center;gap:8px!important;cursor:pointer}
.src-check input{width:15px;height:15px;margin:0}
.src-foot{display:flex;justify-content:flex-end;gap:8px;margin-top:14px}
.src-link-value{display:flex;align-items:center;gap:8px;margin-top:12px}
.src-link-input{flex:1;min-width:0;height:38px;border:1px solid var(--crm-border);border-radius:9px;background:var(--crm-surface-2);color:var(--crm-text);padding:0 10px;font-size:12px;outline:0}
.src-link-actions{display:flex;gap:7px;margin-top:12px;justify-content:flex-end}
.src-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:40px;color:var(--crm-muted);text-align:center}
.src-type{font-size:11px;color:var(--crm-muted);margin-top:3px}
.src-action-row{display:flex;gap:6px;align-items:center;flex-wrap:wrap}
.src-icon-btn{width:34px;height:34px;padding:0}
.src-toggle{min-width:82px}
.src-link-meta{font-size:12px;color:var(--crm-muted);margin-top:5px}
.src-form-select{width:100%;height:40px;border:1px solid var(--crm-border);border-radius:9px;background:var(--crm-surface);color:var(--crm-text);padding:0 10px;font-size:13px;outline:0}
.src-form-select:focus{border-color:var(--crm-primary)}
.src-link-info{margin-top:12px;padding:10px 12px;border:1px solid var(--crm-border);border-radius:9px;background:var(--crm-surface-2);font-size:12px;color:var(--crm-muted)}
.src-link-info strong{color:var(--crm-text);font-weight:500}
@media(max-width:700px){
.src-page{padding:18px 14px}
.src-head{flex-direction:column}
.src-actions{width:100%}
.src-actions .src-btn{flex:1}
.src-toolbar{align-items:stretch}
.src-search{width:100%}
.src-select{width:100%}
.src-form{grid-template-columns:1fr}
.span{grid-column:auto}
.src-dialog{padding:15px}
.src-link-value{flex-direction:column;align-items:stretch}
.src-link-actions{justify-content:stretch}
.src-link-actions .src-btn{flex:1}
}
`}</style>

      <div className="src-head">
        <div>
          <h1 className="src-title">Sources & Campaigns</h1>
          <p className="src-sub">Manage lead attribution values used by forms, campaigns and CRM reporting.</p>
        </div>

        <div className="src-actions">
          <button type="button" className="src-btn" onClick={load} disabled={loading}>
            <RefreshCw size={14} />
            {loading ? "Refreshing…" : "Refresh"}
          </button>

          <button type="button" className="src-btn primary" onClick={openCreate}>
            <Plus size={14} />
            New source
          </button>
        </div>
      </div>

      <div className="src-toolbar">
        <div className="src-search">
          <Search size={14} />

          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search sources or campaigns..." />

          {search && (
            <button type="button" className="src-search-clear" onClick={() => setSearch("")} aria-label="Clear search">
              <X size={14} />
            </button>
          )}
        </div>

        <select className="src-select" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All types</option>
          <option value="SOURCE">Source</option>
          <option value="CAMPAIGN">Campaign</option>
        </select>

        <select className="src-select" value={active} onChange={(e) => setActive(e.target.value)}>
          <option value="">All status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>

        {(search || type || active) && (
          <button
            type="button"
            className="src-btn"
            onClick={() => {
              setSearch("");
              setType("");
              setActive("");
            }}>
            <X size={14} />
            Clear
          </button>
        )}
      </div>

      {error && <div className="src-error">{error}</div>}

      <div className="src-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Code</th>
              <th>Medium</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading || businessLoading ? (
              <tr>
                <td colSpan="6">
                  <div className="src-empty">Loading…</div>
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan="6">
                  <div className="src-empty">
                    <Globe size={22} />
                    <div>No sources or campaigns yet.</div>
                  </div>
                </td>
              </tr>
            ) : (
              items.map((x) => (
                <tr key={x._id}>
                  <td>
                    <strong>{x.name}</strong>
                    <div className="src-type">{x.description || "No description"}</div>
                  </td>

                  <td>{x.type}</td>

                  <td>{x.code || "—"}</td>

                  <td>{x.medium || "—"}</td>

                  <td>
                    <span className={`badge ${x.active ? "active" : "inactive"}`}>{x.active ? "ACTIVE" : "INACTIVE"}</span>
                  </td>

                  <td>
                    <div className="src-action-row">
                      <button type="button" className="src-btn src-toggle" onClick={() => toggle(x)} disabled={toggling === x._id}>
                        {toggling === x._id ? "Saving…" : x.active ? "Deactivate" : "Activate"}
                      </button>

                      <button type="button" className="src-btn src-icon-btn" title="Get tracking link" onClick={() => openLink(x)}>
                        <Link2 size={14} />
                      </button>

                      <button type="button" className="src-btn" onClick={() => openEdit(x)}>
                        Edit
                      </button>

                      <button type="button" className="src-btn src-icon-btn" title="Delete" onClick={() => remove(x)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="src-modal" onClick={closeModal}>
          <div className="src-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="src-dialog-head">
              <strong className="src-dialog-title">{editing ? "Edit source/campaign" : "New source/campaign"}</strong>

              <button type="button" className="src-btn src-icon-btn" onClick={closeModal} disabled={saving} aria-label="Close">
                <X size={15} />
              </button>
            </div>

            <div className="src-form">
              <label>
                Name
                <input
                  value={form.name}
                  placeholder="e.g. Website, Google Ads, Diwali Campaign"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                />
              </label>

              <label>
                Type
                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      type: e.target.value,
                    })
                  }>
                  <option value="SOURCE">SOURCE</option>
                  <option value="CAMPAIGN">CAMPAIGN</option>
                </select>
              </label>

              <label>
                Code
                <input
                  value={form.code}
                  placeholder="e.g. google-ads"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      code: e.target.value,
                    })
                  }
                />
              </label>

              <label>
                Medium
                <input
                  value={form.medium}
                  placeholder="e.g. cpc, social, referral"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      medium: e.target.value,
                    })
                  }
                />
              </label>

              <label className="span">
                Description
                <textarea
                  value={form.description}
                  placeholder="e.g. Paid acquisition campaign for Q4 leads."
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value,
                    })
                  }
                />
              </label>

              <label className="src-check span">
                <input
                  type="checkbox"
                  checked={Boolean(form.active)}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      active: e.target.checked,
                    })
                  }
                />
                Active
              </label>
            </div>

            <div className="src-foot">
              <button type="button" className="src-btn" onClick={closeModal} disabled={saving}>
                Cancel
              </button>

              <button type="button" className="src-btn primary" disabled={saving} onClick={save}>
                {saving ? "Saving…" : editing ? "Save changes" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {linkModal && (
        <div className="src-modal" onClick={closeLinkModal}>
          <div className="src-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="src-dialog-head">
              <strong className="src-dialog-title">Source / Campaign Link</strong>

              <button type="button" className="src-btn src-icon-btn" onClick={closeLinkModal} disabled={linkLoading} aria-label="Close">
                <X size={15} />
              </button>
            </div>

            {!linkData && (
              <>
                <div className="src-link-meta">Select the public form where this source or campaign should generate its tracking link.</div>

                <div style={{ marginTop: 14 }}>
                  <label
                    style={{
                      display: "grid",
                      gap: 6,
                      fontSize: 12,
                      color: "var(--crm-muted)",
                    }}>
                    Public form
                    <select className="src-form-select" value={selectedFormId} onChange={(e) => setSelectedFormId(e.target.value)} disabled={formsLoading || linkLoading}>
                      <option value="">{formsLoading ? "Loading public forms…" : publicForms.length ? "Select a public form" : "No active public forms available"}</option>

                      {publicForms.map((formItem) => (
                        <option key={formItem._id} value={formItem._id}>
                          {formItem.name} — /{formItem.slug}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                {publicForms.length === 0 && !formsLoading && (
                  <div className="src-link-info">
                    Create an <strong>active Public Form</strong> first. The tracking URL needs a public form destination.
                  </div>
                )}

                <div className="src-link-actions">
                  <button type="button" className="src-btn" onClick={closeLinkModal} disabled={linkLoading}>
                    Cancel
                  </button>

                  <button
                    type="button"
                    className="src-btn primary"
                    onClick={() => {
                      const source = items.find((item) => String(item._id) === String(selectedSourceId));

                      if (!source) {
                        setError("Unable to identify the selected source.");
                        return;
                      }

                      generateLink(source);
                    }}
                    disabled={linkLoading || formsLoading || !selectedFormId || publicForms.length === 0}>
                    {linkLoading ? "Generating…" : "Generate link"}
                  </button>
                </div>
              </>
            )}

            {linkData && (
              <>
                <div className="src-link-meta">Use this link for lead attribution and campaign tracking.</div>

                {linkData.selectedFormName && (
                  <div className="src-link-info">
                    Form: <strong>{linkData.selectedFormName}</strong>
                    {linkData.selectedFormSlug && <> · /{linkData.selectedFormSlug}</>}
                  </div>
                )}

                <div className="src-link-value">
                  <input className="src-link-input" value={getLinkValue(linkData)} readOnly />

                  <button type="button" className="src-btn" onClick={() => copyText(getLinkValue(linkData))} disabled={!getLinkValue(linkData)}>
                    <Link2 size={14} />
                    Copy
                  </button>
                </div>

                {linkData.parameters && Object.keys(linkData.parameters).length > 0 && (
                  <div className="src-link-info">
                    {Object.entries(linkData.parameters).map(([key, value]) => (
                      <div key={key}>
                        <strong>{key}:</strong> {String(value)}
                      </div>
                    ))}
                  </div>
                )}

                <div className="src-link-actions">
                  {getLinkValue(linkData) && (
                    <button type="button" className="src-btn" onClick={() => window.open(getLinkValue(linkData), "_blank", "noopener,noreferrer")}>
                      <ExternalLink size={14} />
                      Open link
                    </button>
                  )}

                  <button
                    type="button"
                    className="src-btn"
                    onClick={() => {
                      setLinkData(null);
                      setSelectedFormId("");
                    }}>
                    Change form
                  </button>

                  <button type="button" className="src-btn primary" onClick={closeLinkModal}>
                    Done
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
