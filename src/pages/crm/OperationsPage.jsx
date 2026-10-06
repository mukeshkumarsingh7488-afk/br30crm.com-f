import { useEffect, useState } from "react";
import { Check, Eye, Plus, RefreshCw, Search, Trash2, X } from "lucide-react";
import useBusiness from "../../hooks/useBusiness";
import { showAuthAlert } from "../../components/auth/authAlert";

export default function OperationsPage({ config }) {
  const { businessId, loading: businessLoading, error: businessError } = useBusiness();
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({});
  const load = async () => {
    if (!businessId) return;
    setLoading(true);
    try {
      const r = await config.list(businessId, { page: 1, limit: 50, search: search || undefined });
      const root = r?.data ?? r ?? {};
      const d = root?.data && typeof root.data === "object" && !Array.isArray(root.data) ? root.data : root;
      setItems(d.items || d.teams || d.reports || d.notifications || d.logs || d.auditLogs || []);
      setError("");
    } catch (e) {
      setError(e?.message || `Unable to load ${config.title}.`);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, [businessId]);
  const save = async () => {
    try {
      await config.create(businessId, form);
      setModal(false);
      setForm({});
      await load();
      await showAuthAlert({ icon: "success", title: "Created", text: `${config.singular} created successfully.`, confirmButtonText: "Done" });
    } catch (e) {
      setError(e?.message || "Unable to create record.");
    }
  };
  const remove = async (item) => {
    const r = await showAuthAlert({ icon: "warning", title: "Delete record?", text: "This action cannot be undone.", showCancelButton: true, confirmButtonText: "Delete", cancelButtonText: "Cancel" });
    if (!r.isConfirmed) return;
    try {
      await config.remove(businessId, item._id);
      await load();
    } catch (e) {
      setError(e?.message || "Unable to delete record.");
    }
  };
  return (
    <div className="crm-ops-page">
      <style>{`.crm-ops-page{padding:24px 26px}.crm-ops-head{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:18px}.crm-ops-title{font-size:23px;font-weight:400;margin:0}.crm-ops-sub{font-size:13px;color:var(--crm-muted);margin:5px 0 0}.crm-ops-btn{height:38px;border:1px solid var(--crm-border);border-radius:9px;background:var(--crm-surface);color:var(--crm-text);padding:0 12px;display:inline-flex;align-items:center;gap:7px}.crm-ops-primary{background:var(--crm-primary);border-color:var(--crm-primary);color:#fff}.crm-ops-actions{display:flex;gap:8px}.crm-ops-search{position:relative;max-width:460px;margin-bottom:14px}.crm-ops-search input{width:100%;height:40px;border:1px solid var(--crm-border);border-radius:10px;background:var(--crm-surface);color:var(--crm-text);padding:0 38px}.crm-ops-search>svg{position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--crm-muted);pointer-events:none}.crm-ops-clear{position:absolute;right:8px;top:50%;transform:translateY(-50%);width:28px;height:28px;border:0;background:transparent;color:var(--crm-muted);display:grid;place-items:center}.crm-ops-card{background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:14px;overflow:auto}.crm-ops-table{width:100%;border-collapse:collapse;min-width:700px}.crm-ops-table th,.crm-ops-table td{padding:13px 16px;border-bottom:1px solid var(--crm-border);text-align:left;font-size:13px}.crm-ops-table th{background:var(--crm-surface-2);font-size:13px;text-transform:uppercase;color:var(--crm-muted);font-weight:400;text-align:left}.crm-ops-empty{text-align:center;padding:40px;color:var(--crm-muted)}.crm-ops-modal{position:fixed;inset:0;background:rgba(15,23,42,.45);display:grid;place-items:center;padding:20px;z-index:600}.crm-ops-dialog{width:min(560px,100%);background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:14px;padding:20px}.crm-ops-dialog h2{font-size:16px;margin:0 0 16px}.crm-ops-field{display:grid;gap:6px;margin-bottom:12px}.crm-ops-field label{font-size:13px;font-weight:400}.crm-ops-field input,.crm-ops-field textarea{border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:8px;padding:10px}.crm-ops-foot{display:flex;justify-content:flex-end;gap:8px}`}</style>

      <div className="crm-ops-head">
        <div>
          <h1 className="crm-ops-title">{config.title}</h1>
          <p className="crm-ops-sub">Connected to the BR30 CRM backend.</p>
        </div>
        <div className="crm-ops-actions">
          <button className="crm-ops-btn" onClick={load}>
            <RefreshCw size={15} />
            Refresh
          </button>
          {config.create && (
            <button className="crm-ops-btn crm-ops-primary" onClick={() => setModal(true)}>
              <Plus size={15} />
              Add {config.singular}
            </button>
          )}
        </div>
      </div>
      {(error || businessError) && <div style={{ color: "var(--crm-danger)", marginBottom: 12, fontSize: 12 }}>{error || businessError}</div>}
      <div className="crm-ops-search">
        <Search size={16} />
        <input value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && load()} placeholder={`Search ${config.title.toLowerCase()}...`} />
        {search && (
          <button
            className="crm-ops-clear"
            onClick={() => {
              setSearch("");
              setTimeout(load, 0);
            }}>
            <X size={15} />
          </button>
        )}
      </div>
      <div className="crm-ops-card">
        <table className="crm-ops-table">
          <thead>
            <tr>
              {config.columns.map((c) => (
                <th key={c.key}>{c.label}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading || businessLoading ? (
              <tr>
                <td colSpan={config.columns.length + 1} className="crm-ops-empty">
                  Loading...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={config.columns.length + 1} className="crm-ops-empty">
                  No records found.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item._id}>
                  {config.columns.map((c) => (
                    <td key={c.key}>{c.render ? c.render(item) : String(item?.[c.key] ?? "—")}</td>
                  ))}
                  <td>
                    <div className="crm-ops-actions">
                      <button className="crm-ops-btn" title="View">
                        <Eye size={14} />
                      </button>
                      {config.remove && (
                        <button className="crm-ops-btn" title="Delete" onClick={() => remove(item)}>
                          <Trash2 size={14} />
                        </button>
                      )}
                      {config.markRead && (
                        <button className="crm-ops-btn" title="Mark read" onClick={() => config.markRead(businessId, item._id).then(load)}>
                          <Check size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {modal && (
        <div className="crm-ops-modal">
          <div className="crm-ops-dialog">
            <h2>Add {config.singular}</h2>
            {(config.fields || []).map((f) => (
              <div className="crm-ops-field" key={f.name}>
                <label>{f.label}</label>
                {f.type === "textarea" ? <textarea value={form[f.name] || ""} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} /> : <input type={f.type || "text"} value={form[f.name] || ""} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} />}
              </div>
            ))}
            <div className="crm-ops-foot">
              <button className="crm-ops-btn" onClick={() => setModal(false)}>
                Cancel
              </button>
              <button className="crm-ops-btn crm-ops-primary" onClick={save}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
