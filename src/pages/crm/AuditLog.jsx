import { useEffect, useMemo, useState } from "react";
import { Eye, RefreshCw, Search, X, ChevronLeft, ChevronRight, User, Calendar, Activity, Shield, Database, FileText } from "lucide-react";
import useBusiness from "../../hooks/useBusiness";
import { getAuditLog, getAuditLogs } from "../../api/audit.api";

export default function AuditLog() {
  const { businessId, loading: businessLoading, error: businessError } = useBusiness();

  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [action, setAction] = useState("");
  const [module, setModule] = useState("");
  const [entityType, setEntityType] = useState("");
  const [severity, setSeverity] = useState("");
  const [status, setStatus] = useState("");

  const [page, setPage] = useState(1);
  const [limit] = useState(50);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedLog, setSelectedLog] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const load = async (targetPage = page) => {
    if (!businessId) return;

    setLoading(true);

    try {
      const params = {
        page: targetPage,
        limit,
        action: action || undefined,
        module: module || undefined,
        entityType: entityType || undefined,
        severity: severity || undefined,
        status: status || undefined,
      };

      const result = await getAuditLogs(businessId, params);

      const logs = Array.isArray(result?.logs) ? result.logs : Array.isArray(result?.items) ? result.items : Array.isArray(result?.auditLogs) ? result.auditLogs : [];

      setItems(logs);

      setPagination(
        result?.pagination || {
          page: targetPage,
          limit,
          total: logs.length,
          totalPages: 1,
        }
      );

      setError("");
    } catch (e) {
      setItems([]);
      setError(e?.message || "Unable to load audit logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (businessId) {
      load(1);
    }
  }, [businessId, action, module, entityType, severity, status]);

  const filteredItems = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) return items;

    return items.filter((item) => {
      const actorName = item?.actorId?.name || "";
      const actorEmail = item?.actorId?.email || "";
      const actorRole = item?.actorId?.role?.name || item?.actorId?.role?.slug || item?.actorId?.role || "";

      const values = [item?.action, item?.module, item?.entityType, item?.entityId, item?.severity, item?.status, item?.description, item?.requestId, actorName, actorEmail, actorRole];

      return values.some((v) =>
        String(v || "")
          .toLowerCase()
          .includes(value)
      );
    });
  }, [items, search]);

  const openDetails = async (item) => {
    if (!businessId || !item?._id) return;

    setSelectedLog(item);
    setDetailLoading(true);

    try {
      const result = await getAuditLog(businessId, item._id);

      const detail = result?.auditLog || result?.log || result?.data || result;

      setSelectedLog(detail || item);
    } catch (e) {
      setSelectedLog(item);
      setError(e?.message || "Unable to load audit log details.");
    } finally {
      setDetailLoading(false);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setAction("");
    setModule("");
    setEntityType("");
    setSeverity("");
    setStatus("");
    setPage(1);
  };

  const changePage = (nextPage) => {
    if (nextPage < 1) return;

    if (pagination?.totalPages && nextPage > pagination.totalPages) {
      return;
    }

    setPage(nextPage);
    load(nextPage);
  };

  const formatDate = (value) => {
    if (!value) return "—";

    try {
      return new Date(value).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return "—";
    }
  };

  const formatJson = (value) => {
    if (value === undefined || value === null) return "—";

    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  };

  const actorName = (actor) => actor?.name || actor?.email || "System";

  const actorEmail = (actor) => actor?.email || "—";

  const actorRole = (actor) => actor?.role?.name || actor?.role?.slug || actor?.role || "—";

  return (
    <div className="crm-audit-page">
      <style>{`
        .crm-audit-page{padding:24px 26px;color:var(--crm-text)}
        .crm-audit-head{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:18px}
        .crm-audit-title{font-size:23px;font-weight:400;margin:0}
        .crm-audit-sub{font-size:13px;color:var(--crm-muted);margin:5px 0 0}
        .crm-audit-actions{display:flex;gap:8px;align-items:center}
        .crm-audit-btn{height:38px;border:1px solid var(--crm-border);border-radius:9px;background:var(--crm-surface);color:var(--crm-text);padding:0 12px;display:inline-flex;align-items:center;justify-content:center;gap:7px;cursor:pointer}
        .crm-audit-btn:hover{background:var(--crm-surface-2)}
        .crm-audit-toolbar{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:14px}
        .crm-audit-search{position:relative;width:min(420px,100%)}
        .crm-audit-search input{width:100%;height:40px;border:1px solid var(--crm-border);border-radius:10px;background:var(--crm-surface);color:var(--crm-text);padding:0 40px}
        .crm-audit-search>svg{position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--crm-muted);pointer-events:none}
        .crm-audit-clear{position:absolute;right:7px;top:50%;transform:translateY(-50%);width:28px;height:28px;border:0;background:transparent;color:var(--crm-muted);display:grid;place-items:center;cursor:pointer;padding:0}
        .crm-audit-filter{height:40px;border:1px solid var(--crm-border);border-radius:9px;background:var(--crm-surface);color:var(--crm-text);padding:0 10px;outline:none}
        .crm-audit-card{background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:14px;overflow:auto}
        .crm-audit-table{width:100%;border-collapse:collapse;min-width:850px}
        .crm-audit-table th,.crm-audit-table td{padding:13px 16px;border-bottom:1px solid var(--crm-border);text-align:left;font-size:13px;white-space:nowrap}
        .crm-audit-table th{background:var(--crm-surface-2);font-size:12px;text-transform:uppercase;color:var(--crm-muted);font-weight:400}
        .crm-audit-table tbody tr:last-child td{border-bottom:0}
        .crm-audit-action{font-weight:500}
        .crm-audit-muted{color:var(--crm-muted)}
        .crm-audit-badge{display:inline-flex;align-items:center;padding:4px 8px;border-radius:7px;border:1px solid var(--crm-border);font-size:11px}
        .crm-audit-empty{text-align:center;padding:42px;color:var(--crm-muted)}
        .crm-audit-pagination{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:12px 0}
        .crm-audit-pageinfo{font-size:12px;color:var(--crm-muted)}
        .crm-audit-pagebuttons{display:flex;gap:6px}
        .crm-audit-pagebutton{width:34px;height:34px;border:1px solid var(--crm-border);border-radius:8px;background:var(--crm-surface);color:var(--crm-text);display:grid;place-items:center;cursor:pointer}
        .crm-audit-pagebutton:disabled{opacity:.45;cursor:not-allowed}
        .crm-audit-error{color:var(--crm-danger);font-size:12px;margin-bottom:12px}
        .crm-audit-modal{position:fixed;inset:0;background:rgba(15,23,42,.45);display:grid;place-items:center;padding:20px;z-index:700}
        .crm-audit-dialog{width:min(900px,100%);max-height:90vh;overflow:auto;background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:14px}
        .crm-audit-dialog-head{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;padding:18px 20px;border-bottom:1px solid var(--crm-border)}
        .crm-audit-dialog-title{font-size:17px;font-weight:400;margin:0}
        .crm-audit-dialog-sub{font-size:12px;color:var(--crm-muted);margin:4px 0 0}
        .crm-audit-close{width:34px;height:34px;border:1px solid var(--crm-border);border-radius:8px;background:var(--crm-surface);color:var(--crm-text);display:grid;place-items:center;cursor:pointer}
        .crm-audit-detail{padding:20px}
        .crm-audit-user{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-bottom:18px}
        .crm-audit-info{border:1px solid var(--crm-border);border-radius:10px;padding:12px;background:var(--crm-surface-2)}
        .crm-audit-info-label{font-size:11px;color:var(--crm-muted);margin-bottom:5px}
        .crm-audit-info-value{font-size:13px;color:var(--crm-text);word-break:break-word}
        .crm-audit-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-bottom:18px}
        .crm-audit-section{margin-top:18px}
        .crm-audit-section-title{font-size:13px;font-weight:500;margin:0 0 8px}
        .crm-audit-code{margin:0;border:1px solid var(--crm-border);border-radius:10px;background:var(--crm-surface-2);padding:14px;overflow:auto;font-size:12px;line-height:1.55;color:var(--crm-text);white-space:pre-wrap;word-break:break-word}
        @media(max-width:800px){
          .crm-audit-page{padding:18px}
          .crm-audit-head{align-items:flex-start;flex-direction:column}
          .crm-audit-toolbar{align-items:stretch}
          .crm-audit-search{width:100%}
          .crm-audit-filter{flex:1;min-width:140px}
          .crm-audit-user,.crm-audit-grid{grid-template-columns:1fr}
        }
      `}</style>

      <div className="crm-audit-head">
        <div>
          <h1 className="crm-audit-title">Audit Log</h1>
          <p className="crm-audit-sub">Track important activities and changes in your CRM.</p>
        </div>

        <div className="crm-audit-actions">
          <button className="crm-audit-btn" onClick={() => load(page)} disabled={loading}>
            <RefreshCw size={15} />
            Refresh
          </button>
        </div>
      </div>

      {(error || businessError) && <div className="crm-audit-error">{error || businessError}</div>}

      <div className="crm-audit-toolbar">
        <div className="crm-audit-search">
          <Search size={16} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search audit logs..." />

          {search && (
            <button className="crm-audit-clear" onClick={() => setSearch("")} type="button">
              <X size={15} />
            </button>
          )}
        </div>

        <select
          className="crm-audit-filter"
          value={action}
          onChange={(e) => {
            setAction(e.target.value);
            setPage(1);
          }}>
          <option value="">All Actions</option>
          <option value="CREATE">Create</option>
          <option value="UPDATE">Update</option>
          <option value="DELETE">Delete</option>
          <option value="LOGIN">Login</option>
          <option value="LOGOUT">Logout</option>
          <option value="ASSIGN">Assign</option>
          <option value="STATUS_CHANGE">Status Change</option>
          <option value="PASSWORD_CHANGE">Password Change</option>
          <option value="INVITE">Invite</option>
          <option value="ACCEPT_INVITATION">Accept Invitation</option>
          <option value="EXPORT">Export</option>
          <option value="IMPORT">Import</option>
        </select>

        <select
          className="crm-audit-filter"
          value={module}
          onChange={(e) => {
            setModule(e.target.value);
            setPage(1);
          }}>
          <option value="">All Modules</option>
          <option value="lead">Lead</option>
          <option value="contact">Contact</option>
          <option value="company">Company</option>
          <option value="deal">Deal</option>
          <option value="task">Task</option>
          <option value="activity">Activity</option>
          <option value="note">Note</option>
          <option value="user">User</option>
          <option value="automation">Automation</option>
          <option value="webhook">Webhook</option>
        </select>

        <select
          className="crm-audit-filter"
          value={severity}
          onChange={(e) => {
            setSeverity(e.target.value);
            setPage(1);
          }}>
          <option value="">All Severity</option>
          <option value="INFO">Info</option>
          <option value="WARNING">Warning</option>
          <option value="ERROR">Error</option>
          <option value="CRITICAL">Critical</option>
        </select>

        <select
          className="crm-audit-filter"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}>
          <option value="">All Status</option>
          <option value="SUCCESS">Success</option>
          <option value="FAILED">Failed</option>
        </select>

        {(search || action || module || entityType || severity || status) && (
          <button className="crm-audit-btn" onClick={clearFilters} type="button">
            <X size={15} />
            Clear
          </button>
        )}
      </div>

      <div className="crm-audit-card">
        <table className="crm-audit-table">
          <thead>
            <tr>
              <th>Action</th>
              <th>Module</th>
              <th>Entity</th>
              <th>User</th>
              <th>Severity</th>
              <th>Status</th>
              <th>Date</th>
              <th>View</th>
            </tr>
          </thead>

          <tbody>
            {loading || businessLoading ? (
              <tr>
                <td colSpan={8} className="crm-audit-empty">
                  Loading audit logs...
                </td>
              </tr>
            ) : filteredItems.length === 0 ? (
              <tr>
                <td colSpan={8} className="crm-audit-empty">
                  No audit logs found.
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <tr key={item._id}>
                  <td className="crm-audit-action">{item.action || "—"}</td>

                  <td>{item.module || "—"}</td>

                  <td>{item.entityType || "—"}</td>

                  <td>
                    <div>{actorName(item.actorId)}</div>
                    {item.actorId?.email && <div className="crm-audit-muted">{item.actorId.email}</div>}
                  </td>

                  <td>
                    <span className="crm-audit-badge">{item.severity || "—"}</span>
                  </td>

                  <td>
                    <span className="crm-audit-badge">{item.status || "—"}</span>
                  </td>

                  <td>{formatDate(item.createdAt)}</td>

                  <td>
                    <button className="crm-audit-btn" title="View audit log" onClick={() => openDetails(item)} type="button">
                      <Eye size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="crm-audit-pagination">
        <div className="crm-audit-pageinfo">{pagination.total ? `Showing page ${pagination.page} of ${pagination.totalPages} • ${pagination.total} records` : "No records"}</div>

        <div className="crm-audit-pagebuttons">
          <button className="crm-audit-pagebutton" onClick={() => changePage(page - 1)} disabled={loading || page <= 1} type="button">
            <ChevronLeft size={16} />
          </button>

          <button className="crm-audit-pagebutton" onClick={() => changePage(page + 1)} disabled={loading || !pagination.totalPages || page >= pagination.totalPages} type="button">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {selectedLog && (
        <div
          className="crm-audit-modal"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedLog(null);
            }
          }}>
          <div className="crm-audit-dialog">
            <div className="crm-audit-dialog-head">
              <div>
                <h2 className="crm-audit-dialog-title">Audit Log Details</h2>
                <p className="crm-audit-dialog-sub">Complete information about this activity.</p>
              </div>

              <button className="crm-audit-close" onClick={() => setSelectedLog(null)} type="button">
                <X size={16} />
              </button>
            </div>

            <div className="crm-audit-detail">
              {detailLoading ? (
                <div className="crm-audit-empty">Loading details...</div>
              ) : (
                <>
                  <div className="crm-audit-user">
                    <div className="crm-audit-info">
                      <div className="crm-audit-info-label">
                        <User size={12} /> User
                      </div>
                      <div className="crm-audit-info-value">{actorName(selectedLog.actorId)}</div>
                    </div>

                    <div className="crm-audit-info">
                      <div className="crm-audit-info-label">Email</div>
                      <div className="crm-audit-info-value">{actorEmail(selectedLog.actorId)}</div>
                    </div>

                    <div className="crm-audit-info">
                      <div className="crm-audit-info-label">Role</div>
                      <div className="crm-audit-info-value">{actorRole(selectedLog.actorId)}</div>
                    </div>
                  </div>

                  <div className="crm-audit-grid">
                    <div className="crm-audit-info">
                      <div className="crm-audit-info-label">
                        <Activity size={12} /> Action
                      </div>
                      <div className="crm-audit-info-value">{selectedLog.action || "—"}</div>
                    </div>

                    <div className="crm-audit-info">
                      <div className="crm-audit-info-label">Module</div>
                      <div className="crm-audit-info-value">{selectedLog.module || "—"}</div>
                    </div>

                    <div className="crm-audit-info">
                      <div className="crm-audit-info-label">Entity Type</div>
                      <div className="crm-audit-info-value">{selectedLog.entityType || "—"}</div>
                    </div>

                    <div className="crm-audit-info">
                      <div className="crm-audit-info-label">Entity ID</div>
                      <div className="crm-audit-info-value">{selectedLog.entityId || "—"}</div>
                    </div>

                    <div className="crm-audit-info">
                      <div className="crm-audit-info-label">Severity</div>
                      <div className="crm-audit-info-value">{selectedLog.severity || "—"}</div>
                    </div>

                    <div className="crm-audit-info">
                      <div className="crm-audit-info-label">Status</div>
                      <div className="crm-audit-info-value">{selectedLog.status || "—"}</div>
                    </div>

                    <div className="crm-audit-info">
                      <div className="crm-audit-info-label">
                        <Calendar size={12} /> Date
                      </div>
                      <div className="crm-audit-info-value">{formatDate(selectedLog.createdAt)}</div>
                    </div>

                    <div className="crm-audit-info">
                      <div className="crm-audit-info-label">Request ID</div>
                      <div className="crm-audit-info-value">{selectedLog.requestId || "—"}</div>
                    </div>
                  </div>

                  <div className="crm-audit-section">
                    <h3 className="crm-audit-section-title">
                      <FileText size={13} /> Description
                    </h3>
                    <pre className="crm-audit-code">{selectedLog.description || "—"}</pre>
                  </div>

                  <div className="crm-audit-section">
                    <h3 className="crm-audit-section-title">
                      <Database size={13} /> Before
                    </h3>
                    <pre className="crm-audit-code">{formatJson(selectedLog.before)}</pre>
                  </div>

                  <div className="crm-audit-section">
                    <h3 className="crm-audit-section-title">
                      <Database size={13} /> After
                    </h3>
                    <pre className="crm-audit-code">{formatJson(selectedLog.after)}</pre>
                  </div>

                  <div className="crm-audit-section">
                    <h3 className="crm-audit-section-title">
                      <Shield size={13} /> Metadata
                    </h3>
                    <pre className="crm-audit-code">{formatJson(selectedLog.metadata)}</pre>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
