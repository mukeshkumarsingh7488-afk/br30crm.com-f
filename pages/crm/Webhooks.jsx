import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Copy, Eye, History, Link2, PauseCircle, Play, Plus, RefreshCw, Search, Send, Trash2, X } from "lucide-react";
import useBusiness from "../../hooks/useBusiness";
import { createWebhook, deleteWebhook, getWebhook, getWebhookDeliveries, getWebhooks, regenerateWebhookSecret, retryWebhookDelivery, testWebhook, updateWebhook } from "../../api/webhook.api";
import { showAuthAlert } from "../../components/auth/authAlert";

const blank = { name: "", url: "", events: ["lead.created"], status: "INACTIVE", headers: {}, retryEnabled: true, maxRetries: 3, timeoutMs: 10000 };
const msg = (e, f = "Something went wrong.") => e?.response?.data?.message || e?.response?.data?.error?.message || e?.message || f;
const EVENT_OPTIONS = [
  "lead.created",
  "lead.updated",
  "lead.deleted",
  "lead.assigned",
  "contact.created",
  "contact.updated",
  "contact.deleted",
  "company.created",
  "company.updated",
  "company.deleted",
  "deal.created",
  "deal.updated",
  "deal.deleted",
  "task.created",
  "task.updated",
  "note.created",
  "note.updated",
  "activity.created",
  "activity.updated",
  "*",
];

export default function Webhooks() {
  const { businessId, loading: businessLoading } = useBusiness();
  const [items, setItems] = useState([]),
    [page, setPage] = useState(1),
    [pagination, setPagination] = useState({}),
    [search, setSearch] = useState(""),
    [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true),
    [modal, setModal] = useState(false),
    [editing, setEditing] = useState(null),
    [form, setForm] = useState(blank),
    [saving, setSaving] = useState(false),
    [error, setError] = useState(""),
    [secret, setSecret] = useState("");
  const [deliveries, setDeliveries] = useState(null),
    [deliveryRows, setDeliveryRows] = useState([]),
    [deliveryLoading, setDeliveryLoading] = useState(false);
  const load = useCallback(async () => {
    if (!businessId) return;
    setLoading(true);
    try {
      const r = await getWebhooks(businessId, { page, limit: 20, search: search || undefined, status: status || undefined });
      const d = r?.webhooks ? r : r?.data || {};
      setItems(d.webhooks || []);
      setPagination(d.pagination || {});
    } catch (e) {
      setError(msg(e, "Unable to load webhooks."));
    } finally {
      setLoading(false);
    }
  }, [businessId, page, search, status]);
  useEffect(() => {
    load();
  }, [load]);
  const openNew = () => {
    setEditing(null);
    setForm({ ...blank });
    setSecret("");
    setModal(true);
  };
  const edit = async (item) => {
    try {
      const r = await getWebhook(businessId, item._id);
      setEditing(item);
      setForm({ ...blank, ...(r?.webhook || r), events: (r?.webhook || r)?.events || [] });
      setSecret("");
      setModal(true);
    } catch (e) {
      setError(msg(e));
    }
  };
  const save = async () => {
    if (!form.name.trim() || !form.url.trim()) {
      setError("Webhook name and URL are required.");
      return;
    }
    if (!form.events?.length) {
      setError("Select at least one event.");
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, name: form.name.trim(), headers: typeof form.headers === "string" ? JSON.parse(form.headers || "{}") : form.headers };
      let r;
      if (editing) r = await updateWebhook(businessId, editing._id, payload);
      else r = await createWebhook(businessId, payload);
      const s = r?.secret || r?.webhookSecret || r?.data?.secret;
      if (s) setSecret(s);
      else {
        setModal(false);
      }
      await load();
      if (s) await showAuthAlert({ icon: "success", title: "Webhook created", text: "Copy the secret now. It is not shown again.", confirmButtonText: "Done" });
      else await showAuthAlert({ icon: "success", title: "Webhook saved", text: "Webhook configuration updated successfully.", confirmButtonText: "Done" });
    } catch (e) {
      setError(msg(e, "Unable to save webhook. Check Headers JSON."));
    } finally {
      setSaving(false);
    }
  };
  const toggle = async (item) => {
    try {
      await updateWebhook(businessId, item._id, { status: item.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" });
      await load();
    } catch (e) {
      setError(msg(e));
    }
  };
  const remove = async (item) => {
    const r = await showAuthAlert({ icon: "warning", title: "Delete webhook?", text: "Delivery history for this webhook will no longer be accessible from it.", showCancelButton: true, confirmButtonText: "Delete", cancelButtonText: "Cancel" });
    if (!r.isConfirmed) return;
    try {
      await deleteWebhook(businessId, item._id);
      await load();
    } catch (e) {
      setError(msg(e));
    }
  };
  const test = async (item) => {
    try {
      await testWebhook(businessId, item._id);
      await showAuthAlert({ icon: "success", title: "Test queued", text: "The webhook test has been queued for delivery.", confirmButtonText: "Done" });
    } catch (e) {
      setError(msg(e, "Unable to test webhook."));
    }
  };
  const regen = async (item) => {
    const r = await showAuthAlert({ icon: "warning", title: "Regenerate secret?", text: "The current signing secret will stop working.", showCancelButton: true, confirmButtonText: "Regenerate", cancelButtonText: "Cancel" });
    if (!r.isConfirmed) return;
    try {
      const x = await regenerateWebhookSecret(businessId, item._id);
      const s = x?.secret || x?.webhookSecret || x?.data?.secret;
      setSecret(s || "");
      setEditing(item);
      setForm({ ...blank, ...item });
      setModal(true);
      await load();
    } catch (e) {
      setError(msg(e));
    }
  };
  const openDeliveries = async (item) => {
    setDeliveries(item);
    setDeliveryLoading(true);
    try {
      const r = await getWebhookDeliveries(businessId, item._id, { page: 1, limit: 30 });
      const d = r?.deliveries ? r : r?.data || {};
      setDeliveryRows(d.deliveries || []);
    } catch (e) {
      setError(msg(e));
    } finally {
      setDeliveryLoading(false);
    }
  };
  const totalPages = Math.max(1, Number(pagination.totalPages || 1));
  return (
    <div className="hook-page">
      <style>{`.hook-page{padding:24px 26px 38px;max-width:1500px;margin:auto;color:var(--crm-text)}.hook-head{display:flex;justify-content:space-between;gap:16px;align-items:flex-start;margin-bottom:16px}.hook-title{font-size:24px;font-weight:400;margin:0}.hook-sub{margin:5px 0 0;color:var(--crm-muted);font-size:13px}.hook-actions{display:flex;gap:8px}.hook-btn{height:38px;border:1px solid var(--crm-border);border-radius:9px;background:var(--crm-surface);color:var(--crm-text);display:inline-flex;align-items:center;gap:7px;padding:0 12px;font-size:13px;cursor:pointer}.hook-btn.primary{background:var(--crm-primary);border-color:var(--crm-primary);color:#fff}.hook-toolbar{display:flex;gap:9px;align-items:center;flex-wrap:wrap;margin-bottom:13px}             .hook-search{position:relative;width:min(390px,100%)}.hook-search input{width:100%;height:38px;border:1px solid var(--crm-border);border-radius:9px;background:var(--crm-surface);color:var(--crm-text);padding:0 38px;font-size:13px}.hook-search>svg{position:absolute;left:11px;top:50%;transform:translateY(-50%);color:var(--crm-muted)}.hook-search-clear{position:absolute;right:6px;top:6px;width:26px;height:26px;border:0;border-radius:7px;background:transparent;color:var(--crm-muted);display:grid;place-items:center;padding:0;cursor:pointer;line-height:1}.hook-select{height:38px;border:1px solid var(--crm-border);border-radius:9px;background:var(--crm-surface);color:var(--crm-text);padding:0 10px}.hook-table{border:1px solid var(--crm-border);border-radius:14px;overflow:auto;background:var(--crm-surface);box-shadow:var(--crm-shadow)}.hook-table table{width:100%;min-width:1050px;border-collapse:collapse}.hook-table th,.hook-table td{padding:12px 14px;border-bottom:1px solid var(--crm-border);font-size:13px;text-align:left}.hook-table th{background:var(--crm-surface-2);color:var(--crm-muted);font-weight:400;text-transform:uppercase;letter-spacing:.06em}.hook-table tr:last-child td{border-bottom:0}.hook-name{font-weight:500}.hook-url{font-size:12px;color:var(--crm-muted);max-width:300px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.hook-badge{display:inline-flex;align-items:center;gap:5px;padding:5px 8px;border-radius:999px;font-size:12px}.hook-badge.active{color:var(--crm-success);background:color-mix(in srgb,var(--crm-success) 10%,var(--crm-surface))}.hook-badge.inactive{color:var(--crm-muted);background:var(--crm-surface-2)}.hook-badge.failed{color:var(--crm-danger);background:color-mix(in srgb,var(--crm-danger) 9%,var(--crm-surface))}.hook-row-actions{display:flex;gap:5px}.hook-icon{width:31px;height:31px;border:1px solid var(--crm-border);border-radius:8px;background:var(--crm-surface);color:var(--crm-muted);display:grid;place-items:center;cursor:pointer}.hook-empty{text-align:center;padding:55px;color:var(--crm-muted)}.hook-pager{display:flex;justify-content:space-between;align-items:center;padding:12px 2px;color:var(--crm-muted);font-size:12px}.hook-pager button{height:32px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:8px;padding:0 10px}.hook-modal{position:fixed;inset:0;background:rgba(15,23,42,.48);z-index:900;display:grid;place-items:center;padding:18px}.hook-dialog{width:min(760px,100%);max-height:92vh;overflow:auto;background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:15px;box-shadow:var(--crm-shadow);padding:18px}.hook-dialog-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px}.hook-dialog-title{font-size:17px;font-weight:500}.hook-close{border:0;background:transparent;color:var(--crm-muted);width:32px;height:32px}.hook-form{display:grid;grid-template-columns:1fr 1fr;gap:11px}.hook-form label{display:grid;gap:6px;font-size:12px;color:var(--crm-muted)}.hook-form .span{grid-column:1/-1}.hook-form input,.hook-form textarea,.hook-form select{width:100%;border:1px solid var(--crm-border);border-radius:9px;background:var(--crm-surface);color:var(--crm-text);padding:9px 10px;font-size:13px;outline:0}.hook-form textarea{min-height:100px;resize:vertical}.hook-events{display:flex;gap:6px;flex-wrap:wrap;padding:8px;border:1px solid var(--crm-border);border-radius:9px}.hook-event{border:1px solid var(--crm-border);border-radius:999px;background:var(--crm-surface-2);color:var(--crm-muted);padding:6px 9px;font-size:12px;cursor:pointer}.hook-event.selected{background:var(--crm-primary-soft);border-color:var(--crm-primary);color:var(--crm-primary)}.hook-check{display:flex!important;align-items:center;gap:7px}.hook-foot{display:flex;justify-content:flex-end;gap:8px;margin-top:15px}.hook-secret{padding:11px;border:1px solid color-mix(in srgb,var(--crm-warning) 35%,var(--crm-border));background:color-mix(in srgb,var(--crm-warning) 7%,var(--crm-surface));border-radius:10px;font-size:12px;color:var(--crm-text);word-break:break-all;margin-bottom:12px}.hook-secret strong{display:block;margin-bottom:5px}.hook-deliveries{display:grid;gap:8px}.hook-delivery{border:1px solid var(--crm-border);border-radius:9px;padding:10px;background:var(--crm-surface-2);display:flex;justify-content:space-between;gap:10px;align-items:center}.hook-delivery button{height:30px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:7px;padding:0 8px}@media(max-width:700px){.hook-page{padding:18px 14px}.hook-head{flex-direction:column}.hook-actions{width:100%}.hook-actions .hook-btn{flex:1;justify-content:center}.hook-form{grid-template-columns:1fr}.hook-form .span{grid-column:auto}.hook-toolbar>*{width:100%}.hook-search{width:100%}}`}</style>
      <div className="hook-head">
        <div>
          <h1 className="hook-title">Webhooks</h1>
          <p className="hook-sub">Send signed CRM events to external systems with retries, timeouts and delivery history.</p>
        </div>
        <div className="hook-actions">
          <button className="hook-btn" onClick={load}>
            <RefreshCw size={14} /> Refresh
          </button>
          <button className="hook-btn primary" onClick={openNew}>
            <Plus size={14} /> New webhook
          </button>
        </div>
      </div>
      {error && <div className="auto-error">{error}</div>}
      <div className="hook-toolbar">
        <div className="hook-search">
          <Search size={14} />
          <input
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            placeholder="Search name or URL..."
          />
          {search && (
            <button
              type="button"
              className="hook-search-clear"
              onClick={() => {
                setPage(1);
                setSearch("");
              }}
              aria-label="Clear search">
              <X size={13} />
            </button>
          )}
        </div>
        <select
          className="hook-select"
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}>
          <option value="">All status</option>
          <option>ACTIVE</option>
          <option>INACTIVE</option>
          <option>FAILED</option>
        </select>
      </div>
      <div className="hook-table">
        <table>
          <thead>
            <tr>
              <th>Webhook</th>
              <th>Events</th>
              <th>Status</th>
              <th>Retry</th>
              <th>Last delivery</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading || businessLoading ? (
              <tr>
                <td colSpan="6" className="hook-empty">
                  Loading webhooks…
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan="6" className="hook-empty">
                  <Link2 size={22} />
                  <div style={{ marginTop: 8 }}>No webhooks found.</div>
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item._id}>
                  <td>
                    <div className="hook-name">{item.name}</div>
                    <div className="hook-url">{item.url}</div>
                  </td>
                  <td>{item.events?.length || 0} event(s)</td>
                  <td>
                    <span className={`hook-badge ${String(item.status || "").toLowerCase()}`}>
                      {item.status === "ACTIVE" ? <CheckCircle2 size={12} /> : item.status === "FAILED" ? <X size={12} /> : <PauseCircle size={12} />} {item.status}
                    </span>
                  </td>
                  <td>{item.retryEnabled ? `${item.maxRetries} retries` : "Disabled"}</td>
                  <td>{item.lastDeliveredAt ? new Date(item.lastDeliveredAt).toLocaleString("en-IN") : "Never"}</td>
                  <td>
                    <div className="hook-row-actions">
                      <button className="hook-icon" title="Edit" onClick={() => edit(item)}>
                        <Eye size={14} />
                      </button>
                      <button className="hook-icon" title="Enable/disable" onClick={() => toggle(item)}>
                        {item.status === "ACTIVE" ? <PauseCircle size={14} /> : <Play size={14} />}
                      </button>
                      <button className="hook-icon" title="Test" onClick={() => test(item)}>
                        <Send size={14} />
                      </button>
                      <button className="hook-icon" title="Deliveries" onClick={() => openDeliveries(item)}>
                        <History size={14} />
                      </button>
                      <button className="hook-icon" title="Regenerate secret" onClick={() => regen(item)}>
                        <RefreshCw size={14} />
                      </button>
                      <button className="hook-icon" title="Delete" onClick={() => remove(item)}>
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
      <div className="hook-pager">
        <span>{pagination.total || 0} webhook(s)</span>
        <span>
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </button>
          <span style={{ margin: "0 8px" }}>
            Page {page} / {totalPages}
          </span>
          <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
            Next
          </button>
        </span>
      </div>
      {modal && (
        <div className="hook-modal">
          <div className="hook-dialog">
            <div className="hook-dialog-head">
              <div className="hook-dialog-title">{editing ? "Edit webhook" : "New webhook"}</div>
              <button className="hook-close" onClick={() => setModal(false)}>
                <X size={17} />
              </button>
            </div>
            {secret && (
              <div className="hook-secret">
                <strong>Copy this secret now</strong>
                {secret}
              </div>
            )}
            <div className="hook-form">
              <label>
                Name
                <input value={form.name || ""} placeholder="e.g. CRM → ERP lead events" onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </label>
              <label>
                URL
                <input value={form.url || ""} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://example.com/webhook" />
              </label>
              <label className="span">
                Events
                <div className="hook-events">
                  {EVENT_OPTIONS.map((x) => (
                    <button type="button" key={x} className={`hook-event ${(form.events || []).includes(x) ? "selected" : ""}`} onClick={() => setForm({ ...form, events: (form.events || []).includes(x) ? form.events.filter((v) => v !== x) : [...(form.events || []), x] })}>
                      {x}
                    </button>
                  ))}
                </div>
              </label>
              <label>
                Status
                <select value={form.status || "INACTIVE"} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option>ACTIVE</option>
                  <option>INACTIVE</option>
                  <option>FAILED</option>
                </select>
              </label>
              <label>
                Timeout (ms)
                <input type="number" min="1000" max="120000" value={form.timeoutMs || 10000} placeholder="e.g. 10000" onChange={(e) => setForm({ ...form, timeoutMs: Number(e.target.value) || 10000 })} />
              </label>
              <label>
                Max retries
                <input type="number" min="0" max="10" value={form.maxRetries ?? 3} placeholder="e.g. 3" onChange={(e) => setForm({ ...form, maxRetries: Number(e.target.value) || 0 })} />
              </label>
              <label className="hook-check">
                <input type="checkbox" checked={form.retryEnabled !== false} onChange={(e) => setForm({ ...form, retryEnabled: e.target.checked })} /> Retry failed deliveries
              </label>
              <label className="span">
                Headers JSON
                <textarea value={typeof form.headers === "string" ? form.headers : JSON.stringify(form.headers || {}, null, 2)} onChange={(e) => setForm({ ...form, headers: e.target.value })} />
              </label>
            </div>
            <div className="hook-foot">
              <button className="hook-btn" onClick={() => setModal(false)}>
                Cancel
              </button>
              <button className="hook-btn primary" disabled={saving} onClick={save}>
                {saving ? "Saving…" : editing ? "Save changes" : "Create webhook"}
              </button>
            </div>
          </div>
        </div>
      )}
      {deliveries && (
        <div className="hook-modal">
          <div className="hook-dialog">
            <div className="hook-dialog-head">
              <div>
                <div className="hook-dialog-title">Delivery history</div>
                <div className="auto-muted">{deliveries.name}</div>
              </div>
              <button className="hook-close" onClick={() => setDeliveries(null)}>
                <X size={17} />
              </button>
            </div>
            {deliveryLoading ? (
              <div className="hook-empty">Loading deliveries…</div>
            ) : deliveryRows.length === 0 ? (
              <div className="hook-empty">No deliveries yet.</div>
            ) : (
              <div className="hook-deliveries">
                {deliveryRows.map((d) => (
                  <div className="hook-delivery" key={d._id}>
                    <div>
                      <strong>{d.status}</strong>
                      <div className="auto-muted">
                        {d.event || "event"} · attempts {d.attempts ?? (d.attempt || 0)} · {d.createdAt ? new Date(d.createdAt).toLocaleString("en-IN") : "—"}
                      </div>
                      <div className="auto-muted">{d.error || ""}</div>
                    </div>
                    {d.status === "FAILED" && (
                      <button
                        onClick={async () => {
                          try {
                            await retryWebhookDelivery(businessId, d._id);
                            await openDeliveries(deliveries);
                          } catch (e) {
                            setError(msg(e));
                          }
                        }}>
                        Retry
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
