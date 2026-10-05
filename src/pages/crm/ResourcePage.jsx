import { useEffect, useMemo, useState } from "react";
import { Eye, Pencil, Plus, RefreshCw, Search, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { showAuthAlert } from "../../components/auth/authAlert";
import useBusiness from "../../hooks/useBusiness";

const FIELD = ({ field, value, onChange }) => {
  const common = {
    value: value ?? "",
    onChange: (e) => onChange(field.name, e.target.value),
    placeholder: field.placeholder || field.label,
  };

  if (field.type === "select") {
    return (
      <select {...common}>
        {(field.options || []).map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === "textarea") {
    return <textarea {...common} rows={4} />;
  }

  return <input {...common} type={field.type || "text"} />;
};

const getErrorMessage = (err, fallback = "Something went wrong.") => {
  const data = err?.response?.data;

  if (Array.isArray(data?.errors) && data.errors.length) {
    return data.errors
      .map((item) => item?.msg || item?.message || String(item))
      .filter(Boolean)
      .join("\n");
  }

  if (Array.isArray(data?.message)) {
    return data.message.filter(Boolean).join("\n");
  }

  if (typeof data?.message === "string" && data.message.trim()) {
    return data.message;
  }

  if (typeof err?.message === "string" && err.message.trim()) {
    return err.message;
  }

  return fallback;
};

function ResourcePage({ config }) {
  const navigate = useNavigate();
  const { businessId, loading: businessLoading, error: businessError } = useBusiness();

  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [fields, setFields] = useState(config.fields || []);

  useEffect(() => {
    let active = true;

    const loadFields = async () => {
      try {
        const next = config.getFields ? await config.getFields(businessId) : config.fields || [];

        if (active) {
          setFields(next || []);
        }
      } catch {
        if (active) {
          setFields(config.fields || []);
        }
      }
    };

    if (businessId) {
      loadFields();
    } else {
      setFields(config.fields || []);
    }

    return () => {
      active = false;
    };
  }, [businessId, config]);

  const emptyForm = useMemo(() => Object.fromEntries(fields.map((field) => [field.name, field.defaultValue ?? ""])), [fields]);

  const load = async (page = pagination.page || 1, nextSearch = search) => {
    if (!businessId) return;

    setLoading(true);
    setError("");

    try {
      const response = await config.api.list(businessId, {
        page,
        limit: pagination.limit || 10,
        ...(nextSearch ? { search: nextSearch } : {}),
      });

      const data = response?.data || response || {};

      const rows = data?.items || data?.leads || data?.contacts || data?.companies || data?.deals || data?.tasks || data?.activities || data?.pipelines || [];

      const nextRows = Array.isArray(rows) ? rows : [];

      setItems(nextRows);

      setPagination(
        data?.pagination || {
          page,
          limit: pagination.limit || 10,
          total: nextRows.length,
          totalPages: 1,
        }
      );
    } catch (err) {
      setError(getErrorMessage(err, `Unable to load ${config.title.toLowerCase()}.`));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (businessId) {
      load(1, search);
    }
  }, [businessId]);

  const openCreate = () => {
    setError("");
    setForm(emptyForm);
    setModal({ mode: "create" });
  };

  const openEdit = (item) => {
    setError("");

    const nextForm = config.mapToForm ? config.mapToForm(item) : Object.fromEntries(fields.map((field) => [field.name, item?.[field.name] ?? field.defaultValue ?? ""]));

    setForm(nextForm);

    setModal({
      mode: "edit",
      item,
    });
  };

  const openView = (item) => {
    setError("");

    if (config.detailsPath) {
      navigate(`${config.detailsPath}/${item._id}`);
      return;
    }

    setModal({
      mode: "view",
      item,
    });
  };

  const validateRequiredFields = () => {
    for (const field of fields) {
      if (!field.required) continue;

      const value = form[field.name];

      if (value === undefined || value === null || String(value).trim() === "") {
        return `${field.label} is required.`;
      }
    }

    return "";
  };

  const save = async () => {
    if (!businessId || !modal) return;

    const requiredError = validateRequiredFields();

    if (requiredError) {
      setError(requiredError);

      await showAuthAlert({
        icon: "warning",
        title: "Validation required",
        text: requiredError,
        confirmButtonText: "OK",
      });

      return;
    }

    setSaving(true);
    setError("");

    try {
      const payload = config.prepare ? config.prepare(form) : form;

      if (modal.mode === "create") {
        await config.api.create(businessId, payload);
      } else {
        await config.api.update(businessId, modal.item._id, payload);
      }

      setModal(null);

      await load(1, search);

      await showAuthAlert({
        icon: "success",
        title: modal.mode === "create" ? `${config.singular} Created` : `${config.singular} Updated`,
        text: modal.mode === "create" ? `${config.singular} created successfully.` : `${config.singular} updated successfully.`,
        confirmButtonText: "Done",
      });
    } catch (err) {
      const message = getErrorMessage(err, `Unable to ${modal.mode === "create" ? "create" : "update"} the ${config.singular.toLowerCase()}.`);

      setError(message);

      await showAuthAlert({
        icon: "error",
        title: modal.mode === "create" ? `Unable to create ${config.singular}` : `Unable to update ${config.singular}`,
        text: message,
        confirmButtonText: "OK",
      });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (item) => {
    if (!businessId) return;

    const result = await showAuthAlert({
      icon: "warning",
      title: `Delete ${config.singular}?`,
      text: `Are you sure you want to delete this ${config.singular.toLowerCase()}? This action cannot be undone.`,
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (!result?.isConfirmed) return;

    setError("");

    try {
      await config.api.remove(businessId, item._id);

      await load(pagination.page || 1, search);

      await showAuthAlert({
        icon: "success",
        title: "Deleted",
        text: `${config.singular} deleted successfully.`,
        confirmButtonText: "Done",
      });
    } catch (err) {
      const message = getErrorMessage(err, `Unable to delete the ${config.singular.toLowerCase()}.`);

      setError(message);

      await showAuthAlert({
        icon: "error",
        title: `Unable to delete ${config.singular}`,
        text: message,
        confirmButtonText: "OK",
      });
    }
  };

  const clearSearch = () => {
    setSearch("");
    load(1, "");
  };

  return (
    <div className="crm-resource-page">
      <style>{`
        .crm-resource-page{padding:24px 26px 40px}
        .crm-resource-head{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:18px}
        .crm-resource-title{font-size:23px;font-weight:400;margin:0;color:var(--crm-text)}
        .crm-resource-sub{font-size:13px;color:var(--crm-muted);margin:5px 0 0}
        .crm-resource-actions{display:flex;gap:9px;align-items:center}
        .crm-btn{height:38px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:9px;padding:0 13px;display:inline-flex;align-items:center;gap:7px;font-size:13px;font-weight:400;cursor:pointer}
        .crm-btn.primary{background:var(--crm-primary);border-color:var(--crm-primary);color:#fff}
        .crm-btn:hover:not(:disabled){filter:brightness(.98)}
        .crm-btn:disabled{opacity:.55;cursor:not-allowed}
        .crm-search-wrap{position:relative;width:100%;max-width:460px;margin-bottom:14px}
        .crm-search{width:100%;height:40px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:10px;padding:0 40px}
        .crm-search::placeholder{color:var(--crm-muted)}
        .crm-search-icon{position:absolute;left:12px;top:12px;color:var(--crm-muted);width:16px;height:16px;pointer-events:none}
        .crm-search-clear{position:absolute;right:9px;top:8px;width:24px;height:24px;border:0;border-radius:7px;background:transparent;color:var(--crm-muted);display:grid;place-items:center;cursor:pointer;padding:0}
        .crm-search-clear:hover{background:var(--crm-surface-2);color:var(--crm-text)}
        .crm-resource-card{border:1px solid var(--crm-border);background:var(--crm-surface);border-radius:14px;overflow:auto;box-shadow:var(--crm-shadow)}
        .crm-table{width:100%;border-collapse:collapse;min-width:760px}
        .crm-table th{background:var(--crm-surface-2);font-size:13px;text-transform:uppercase;letter-spacing:.06em;color:var(--crm-muted);text-align:left;padding:13px 16px;white-space:nowrap}
        .crm-table td{border-top:1px solid var(--crm-border);padding:13px 16px;font-size:13px;color:var(--crm-text);vertical-align:middle}
        .crm-table tbody tr:hover{background:color-mix(in srgb,var(--crm-primary) 3%,transparent)}
        .crm-actions-cell{display:flex;gap:5px;align-items:center}
        .crm-icon-btn{width:30px;height:30px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-muted);border-radius:8px;display:grid;place-items:center;cursor:pointer;padding:0}
        .crm-icon-btn:hover{color:var(--crm-primary);border-color:var(--crm-primary);background:var(--crm-surface-2)}
        .crm-error{white-space:pre-line;margin-bottom:12px;padding:10px 12px;border-radius:9px;background:color-mix(in srgb,var(--crm-danger) 10%,transparent);color:var(--crm-danger);font-size:13px}
        .crm-empty{padding:48px 20px;text-align:center;color:var(--crm-muted);font-size:13px}
        .crm-pagination{display:flex;justify-content:space-between;align-items:center;padding:13px 16px;border-top:1px solid var(--crm-border);font-size:13px;color:var(--crm-muted);gap:12px}
        .crm-modal-backdrop{position:fixed;inset:0;background:rgba(15,23,42,.45);display:grid;place-items:center;padding:20px;z-index:500}
        .crm-modal{width:min(680px,100%);max-height:90vh;overflow:auto;background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:15px;box-shadow:0 25px 70px rgba(0,0,0,.2)}
        .crm-modal-head{display:flex;justify-content:space-between;align-items:center;padding:17px 20px;border-bottom:1px solid var(--crm-border);position:sticky;top:0;background:var(--crm-surface);z-index:2}
        .crm-modal-title{margin:0;font-size:16px;font-weight:400;color:var(--crm-text)}
        .crm-modal-close{border:0;background:transparent;color:var(--crm-muted);width:32px;height:32px;display:grid;place-items:center;border-radius:8px;cursor:pointer}
        .crm-modal-close:hover{background:var(--crm-surface-2);color:var(--crm-text)}
        .crm-form{padding:20px;display:grid;grid-template-columns:1fr 1fr;gap:14px}
        .crm-field{display:grid;gap:6px;min-width:0}
        .crm-field.full{grid-column:1/-1}
        .crm-field label{font-size:13px;font-weight:400;color:var(--crm-text)}
        .crm-field input,.crm-field select,.crm-field textarea{width:100%;box-sizing:border-box;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:9px;padding:10px 11px;outline:0;font:inherit}
        .crm-field input::placeholder,.crm-field textarea::placeholder{color:var(--crm-muted)}
        .crm-field input:focus,.crm-field select:focus,.crm-field textarea:focus{border-color:var(--crm-primary)}
        .crm-modal-foot{display:flex;justify-content:flex-end;gap:8px;padding:14px 20px;border-top:1px solid var(--crm-border);position:sticky;bottom:0;background:var(--crm-surface)}
        .crm-view-value{color:var(--crm-text);font-size:13px;word-break:break-word;white-space:pre-wrap}
        @media(max-width:700px){
          .crm-resource-page{padding:18px 14px 30px}
          .crm-resource-head{align-items:flex-start;flex-direction:column}
          .crm-resource-actions{width:100%}
          .crm-resource-actions .crm-btn{flex:1;justify-content:center}
          .crm-search-wrap{max-width:none}
          .crm-form{grid-template-columns:1fr}
          .crm-field.full{grid-column:auto}
          .crm-pagination{align-items:flex-start;flex-direction:column}
        }
      `}</style>

      <div className="crm-resource-head">
        <div>
          <h1 className="crm-resource-title">{config.title}</h1>
          <p className="crm-resource-sub">Manage your {config.title.toLowerCase()} directly from the BR30 CRM workspace.</p>
        </div>

        <div className="crm-resource-actions">
          <button type="button" className="crm-btn" onClick={() => load(1, search)} disabled={loading}>
            <RefreshCw size={15} />
            Refresh
          </button>

          <button type="button" className="crm-btn primary" onClick={openCreate}>
            <Plus size={15} />
            Add {config.singular}
          </button>
        </div>
      </div>

      {(error || businessError) && <div className="crm-error">{error || businessError}</div>}

      <div className="crm-search-wrap">
        <Search className="crm-search-icon" />

        <input
          className="crm-search"
          value={search}
          onChange={(e) => {
            const value = e.target.value;
            setSearch(value);
            load(1, value);
          }}
          placeholder={`Search ${config.title.toLowerCase()}...`}
        />

        {search && (
          <button type="button" className="crm-search-clear" onClick={clearSearch} aria-label="Clear search" title="Clear search">
            <X size={15} />
          </button>
        )}
      </div>

      <div className="crm-resource-card">
        <table className="crm-table">
          <thead>
            <tr>
              {config.columns.map((column) => (
                <th key={column.key}>{column.label}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading || businessLoading ? (
              <tr>
                <td colSpan={config.columns.length + 1}>
                  <div className="crm-empty">Loading {config.title.toLowerCase()}...</div>
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={config.columns.length + 1}>
                  <div className="crm-empty">No {config.title.toLowerCase()} found.</div>
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item._id}>
                  {config.columns.map((column) => (
                    <td key={column.key}>{column.render ? column.render(item) : String(item?.[column.key] ?? "—")}</td>
                  ))}

                  <td>
                    <div className="crm-actions-cell">
                      <button type="button" className="crm-icon-btn" onClick={() => openView(item)} title="View" aria-label={`View ${config.singular}`}>
                        <Eye size={14} />
                      </button>

                      <button type="button" className="crm-icon-btn" onClick={() => openEdit(item)} title="Edit" aria-label={`Edit ${config.singular}`}>
                        <Pencil size={14} />
                      </button>

                      <button type="button" className="crm-icon-btn" onClick={() => remove(item)} title="Delete" aria-label={`Delete ${config.singular}`}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="crm-pagination">
          <span>{pagination.total ?? items.length} total</span>

          <div className="crm-resource-actions">
            <button type="button" className="crm-btn" disabled={loading || (pagination.page || 1) <= 1} onClick={() => load((pagination.page || 1) - 1, search)}>
              Previous
            </button>

            <span>
              Page {pagination.page || 1} / {pagination.totalPages || 1}
            </span>

            <button type="button" className="crm-btn" disabled={loading || (pagination.page || 1) >= (pagination.totalPages || 1)} onClick={() => load((pagination.page || 1) + 1, search)}>
              Next
            </button>
          </div>
        </div>
      </div>

      {modal && (
        <div
          className="crm-modal-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !saving) {
              setModal(null);
            }
          }}>
          <div className="crm-modal">
            <div className="crm-modal-head">
              <h2 className="crm-modal-title">{modal.mode === "create" ? `Add ${config.singular}` : modal.mode === "edit" ? `Edit ${config.singular}` : `${config.singular} details`}</h2>

              <button type="button" className="crm-modal-close" onClick={() => !saving && setModal(null)} disabled={saving} aria-label="Close">
                <X size={17} />
              </button>
            </div>

            {modal.mode === "view" ? (
              <>
                <div className="crm-form">
                  {config.columns.map((column) => (
                    <div className="crm-field" key={column.key}>
                      <label>{column.label}</label>

                      <div className="crm-view-value">{column.render ? column.render(modal.item) : String(modal.item?.[column.key] ?? "—")}</div>
                    </div>
                  ))}
                </div>

                <div className="crm-modal-foot">
                  <button type="button" className="crm-btn" onClick={() => setModal(null)}>
                    Close
                  </button>

                  <button type="button" className="crm-btn primary" onClick={() => openEdit(modal.item)}>
                    <Pencil size={14} />
                    Edit
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="crm-form">
                  {fields.map((field) => (
                    <div className={`crm-field ${field.full ? "full" : ""}`} key={field.name}>
                      <label>
                        {field.label}
                        {field.required ? " *" : ""}
                      </label>

                      <FIELD
                        field={field}
                        value={form[field.name]}
                        onChange={(name, value) =>
                          setForm((current) => ({
                            ...current,
                            [name]: value,
                          }))
                        }
                      />
                    </div>
                  ))}
                </div>

                <div className="crm-modal-foot">
                  <button type="button" className="crm-btn" onClick={() => !saving && setModal(null)} disabled={saving}>
                    Cancel
                  </button>

                  <button type="button" className="crm-btn primary" disabled={saving} onClick={save}>
                    {saving ? "Saving..." : modal.mode === "create" ? `Create ${config.singular}` : "Save changes"}
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

export default ResourcePage;
