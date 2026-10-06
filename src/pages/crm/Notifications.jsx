import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, Eye, RefreshCw, Trash2, X } from "lucide-react";
import useBusiness from "../../hooks/useBusiness";
import { showAuthAlert } from "../../components/auth/authAlert";
import { deleteNotification, getNotification, getNotifications, markNotificationRead } from "../../api/notification.api";

const unwrap = (response) => {
  const root = response?.data || response || {};
  return root?.data && typeof root.data === "object" && !Array.isArray(root.data) ? root.data : root;
};

const getSourceLabel = (notification) => {
  const source = notification?.source || {};
  const type = String(source.type || "").toUpperCase();
  if (type === "AUTOMATION") return source.name || "Automation";
  if (type === "TEAM") return source.name || "Team";
  return source.name || notification?.createdBy?.name || notification?.createdBy?.email || "Business member";
};

const getSourceMeta = (notification) => {
  const source = notification?.source || {};
  const type = String(source.type || "").toUpperCase();
  if (type === "AUTOMATION") return "Automation";
  if (source.role) return source.role;
  if (type === "TEAM") return "Team";
  return "Business member";
};

const formatDateTime = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function Notifications() {
  const { businessId, loading: businessLoading, error: businessError } = useBusiness();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(null);

  const load = useCallback(async () => {
    if (!businessId) return;
    setLoading(true);
    setError("");
    try {
      const response = await getNotifications(businessId, { page: 1, limit: 100 });
      const data = unwrap(response);
      const rows = Array.isArray(data?.notifications) ? data.notifications : Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
      setItems(rows);
      window.dispatchEvent(new CustomEvent("br30:notifications-changed"));
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Unable to load notifications.");
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  useEffect(() => {
    load();
  }, [load]);

  const unreadCount = useMemo(() => items.filter((item) => item?.status === "UNREAD").length, [items]);

  const handleView = async (notification) => {
    if (!businessId || !notification?._id) return;
    try {
      const response = await getNotification(businessId, notification._id);
      const data = unwrap(response);
      const current = data?.notification || data || notification;
      if (current?.status === "UNREAD") {
        try {
          await markNotificationRead(businessId, notification._id);
          current.status = "READ";
        } catch {}
      }
      setModal(current);
      setItems((currentItems) => currentItems.map((item) => (item._id === notification._id ? { ...item, status: "READ" } : item)));
      window.dispatchEvent(new CustomEvent("br30:notifications-changed"));
    } catch (err) {
      await showAuthAlert({ icon: "error", title: "Unable to open notification", text: err?.response?.data?.message || err?.message || "Unable to load notification details.", confirmButtonText: "OK" });
    }
  };

  const handleDelete = async (notification) => {
    if (!businessId || !notification?._id) return;
    const result = await showAuthAlert({ icon: "warning", title: "Delete notification?", text: "This notification will be permanently deleted.", showCancelButton: true, confirmButtonText: "Delete", cancelButtonText: "Cancel" });
    if (!result?.isConfirmed) return;
    try {
      await deleteNotification(businessId, notification._id);
      setItems((current) => current.filter((item) => item._id !== notification._id));
      if (modal?._id === notification._id) setModal(null);
      window.dispatchEvent(new CustomEvent("br30:notifications-changed"));
    } catch (err) {
      await showAuthAlert({ icon: "error", title: "Unable to delete notification", text: err?.response?.data?.message || err?.message || "Unable to delete notification.", confirmButtonText: "OK" });
    }
  };

  return (
    <div className="crm-notifications-page">
      <style>{`.crm-notifications-page{padding:24px 26px 40px;color:var(--crm-text)}.crm-notifications-head{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;margin-bottom:18px}.crm-notifications-title{margin:0;font-size:26px;line-height:1.15;font-weight:400;letter-spacing:-.35px}.crm-notifications-sub{margin:6px 0 0;color:var(--crm-muted);font-size:13px}.crm-notifications-head-actions{display:flex;align-items:center;gap:8px}.crm-notifications-btn{height:38px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:9px;padding:0 12px;display:inline-flex;align-items:center;justify-content:center;gap:7px;font-size:13px;font-weight:400;cursor:pointer}.crm-notifications-btn:hover{background:var(--crm-surface-2);border-color:var(--crm-primary)}.crm-notifications-error{margin-bottom:12px;padding:10px 12px;border-radius:9px;background:color-mix(in srgb,var(--crm-danger) 9%,transparent);color:var(--crm-danger);font-size:13px}.crm-notifications-card{background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:14px;overflow:auto;box-shadow:var(--crm-shadow)}.crm-notifications-table{width:100%;min-width:1050px;border-collapse:collapse}.crm-notifications-table th,.crm-notifications-table td{padding:13px 16px;border-bottom:1px solid var(--crm-border);text-align:left;font-size:13px;vertical-align:middle}.crm-notifications-table th{background:var(--crm-surface-2);color:var(--crm-muted);font-size:13px;text-transform:uppercase;letter-spacing:.06em;font-weight:400;white-space:nowrap}.crm-notifications-table td{color:var(--crm-text)}.crm-notifications-table tbody tr:last-child td{border-bottom:0}.crm-notification-title{font-weight:400}.crm-notification-message{margin-top:3px;color:var(--crm-muted);font-size:12px;max-width:420px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.crm-notification-source{display:grid;gap:2px}.crm-notification-source-name{color:var(--crm-text)}.crm-notification-source-meta{font-size:12px;color:var(--crm-muted)}.crm-notification-status{display:inline-flex;align-items:center;padding:4px 8px;border-radius:7px;font-size:12px;font-weight:400}.crm-notification-status.unread{background:color-mix(in srgb,var(--crm-primary) 10%,transparent);color:var(--crm-primary)}.crm-notification-status.read{background:color-mix(in srgb,var(--crm-muted) 10%,transparent);color:var(--crm-muted)}.crm-notification-priority{color:var(--crm-muted)}.crm-notification-actions{display:flex;align-items:center;gap:5px}.crm-notification-icon{width:30px;height:30px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-muted);border-radius:8px;display:grid;place-items:center;cursor:pointer;padding:0}.crm-notification-icon:hover{color:var(--crm-primary);border-color:var(--crm-primary);background:var(--crm-surface-2)}.crm-notification-icon.danger:hover{color:var(--crm-danger);border-color:var(--crm-danger)}.crm-notifications-empty{padding:50px 20px;text-align:center;color:var(--crm-muted);font-size:13px}.crm-notifications-modal-backdrop{position:fixed;inset:0;background:rgba(15,23,42,.48);display:grid;place-items:center;padding:20px;z-index:700}.crm-notifications-modal{width:min(680px,100%);max-height:88vh;overflow:auto;background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:15px;box-shadow:0 25px 70px rgba(0,0,0,.24)}.crm-notifications-modal-head{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;padding:18px 20px;border-bottom:1px solid var(--crm-border)}.crm-notifications-modal-head h2{margin:0;font-size:18px;font-weight:400;color:var(--crm-text)}.crm-notifications-modal-close{width:32px;height:32px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-muted);border-radius:8px;display:grid;place-items:center;cursor:pointer}.crm-notifications-modal-body{padding:20px}.crm-notification-detail-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.crm-notification-detail{border:1px solid var(--crm-border);border-radius:10px;padding:12px;background:var(--crm-surface-2)}.crm-notification-detail.full{grid-column:1/-1}.crm-notification-detail-label{font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:var(--crm-muted);margin-bottom:5px}.crm-notification-detail-value{font-size:13px;color:var(--crm-text);line-height:1.5;word-break:break-word}.crm-notification-detail-value.message{white-space:pre-wrap}.crm-notifications-modal-foot{display:flex;justify-content:flex-end;gap:8px;padding:14px 20px;border-top:1px solid var(--crm-border)}@media(max-width:700px){.crm-notification-detail-grid{grid-template-columns:1fr}.crm-notification-detail.full{grid-column:auto}.crm-notifications-page{padding:18px 14px 30px}}`}</style>

      <div className="crm-notifications-head">
        <div>
          <h1 className="crm-notifications-title">Notifications</h1>
          <p className="crm-notifications-sub">{unreadCount ? `${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}` : "All notifications are read."}</p>
        </div>
        <div className="crm-notifications-head-actions">
          <button type="button" className="crm-notifications-btn" onClick={load} disabled={loading}>
            <RefreshCw size={15} /> Refresh
          </button>
        </div>
      </div>

      {(error || businessError) && <div className="crm-notifications-error">{error || businessError}</div>}

      <div className="crm-notifications-card">
        <table className="crm-notifications-table">
          <thead>
            <tr>
              <th>Notification</th>
              <th>Source</th>
              <th>Type</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Date &amp; time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading || businessLoading ? (
              <tr><td colSpan={7} className="crm-notifications-empty">Loading...</td></tr>
            ) : !items.length ? (
              <tr><td colSpan={7} className="crm-notifications-empty">No notifications found.</td></tr>
            ) : (
              items.map((item) => (
                <tr key={item._id}>
                  <td>
                    <div className="crm-notification-title">{item.title || "—"}</div>
                    <div className="crm-notification-message">{item.message || "—"}</div>
                  </td>
                  <td>
                    <div className="crm-notification-source">
                      <span className="crm-notification-source-name">{getSourceLabel(item)}</span>
                      <span className="crm-notification-source-meta">{getSourceMeta(item)}</span>
                    </div>
                  </td>
                  <td>{item.type || "—"}</td>
                  <td className="crm-notification-priority">{item.priority || "—"}</td>
                  <td><span className={`crm-notification-status ${item.status === "UNREAD" ? "unread" : "read"}`}>{item.status || "—"}</span></td>
                  <td>{formatDateTime(item.createdAt)}</td>
                  <td>
                    <div className="crm-notification-actions">
                      <button type="button" className="crm-notification-icon" title="View" onClick={() => handleView(item)}><Eye size={14} /></button>
                      {item.status === "UNREAD" && <button type="button" className="crm-notification-icon" title="Mark read" onClick={async () => { try { await markNotificationRead(businessId, item._id); setItems((current) => current.map((x) => x._id === item._id ? { ...x, status: "READ", readAt: new Date().toISOString() } : x)); window.dispatchEvent(new CustomEvent("br30:notifications-changed")); } catch {} }}><Check size={14} /></button>}
                      <button type="button" className="crm-notification-icon danger" title="Delete" onClick={() => handleDelete(item)}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="crm-notifications-modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setModal(null)}>
          <div className="crm-notifications-modal">
            <div className="crm-notifications-modal-head">
              <div>
                <div style={{ color: "var(--crm-muted)", fontSize: 11, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 5 }}>Notification details</div>
                <h2>{modal.title || "Notification"}</h2>
              </div>
              <button type="button" className="crm-notifications-modal-close" onClick={() => setModal(null)}><X size={15} /></button>
            </div>
            <div className="crm-notifications-modal-body">
              <div className="crm-notification-detail-grid">
                <div className="crm-notification-detail"><div className="crm-notification-detail-label">Source</div><div className="crm-notification-detail-value">{getSourceLabel(modal)}</div></div>
                <div className="crm-notification-detail"><div className="crm-notification-detail-label">Source type / role</div><div className="crm-notification-detail-value">{getSourceMeta(modal)}</div></div>
                <div className="crm-notification-detail"><div className="crm-notification-detail-label">Type</div><div className="crm-notification-detail-value">{modal.type || "—"}</div></div>
                <div className="crm-notification-detail"><div className="crm-notification-detail-label">Priority</div><div className="crm-notification-detail-value">{modal.priority || "—"}</div></div>
                <div className="crm-notification-detail"><div className="crm-notification-detail-label">Status</div><div className="crm-notification-detail-value">{modal.status || "—"}</div></div>
                <div className="crm-notification-detail"><div className="crm-notification-detail-label">Notification date &amp; time</div><div className="crm-notification-detail-value">{formatDateTime(modal.createdAt)}</div></div>
                <div className="crm-notification-detail"><div className="crm-notification-detail-label">Read at</div><div className="crm-notification-detail-value">{formatDateTime(modal.readAt)}</div></div>
                <div className="crm-notification-detail"><div className="crm-notification-detail-label">Updated / archived</div><div className="crm-notification-detail-value">{formatDateTime(modal.archivedAt)}</div></div>
                <div className="crm-notification-detail full"><div className="crm-notification-detail-label">Message</div><div className="crm-notification-detail-value message">{modal.message || "—"}</div></div>
                <div className="crm-notification-detail"><div className="crm-notification-detail-label">Entity</div><div className="crm-notification-detail-value">{modal.entityType || "—"}</div></div>
                <div className="crm-notification-detail"><div className="crm-notification-detail-label">Entity ID</div><div className="crm-notification-detail-value">{modal.entityId || "—"}</div></div>
                {modal.actionUrl && <div className="crm-notification-detail full"><div className="crm-notification-detail-label">Action</div><div className="crm-notification-detail-value">{modal.actionUrl}</div></div>}
              </div>
            </div>
            <div className="crm-notifications-modal-foot">
              <button type="button" className="crm-notifications-btn" onClick={() => setModal(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
