import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Copy, Eye, History, PauseCircle, Play, Plus, RefreshCw, Search, Trash2, X, Zap } from "lucide-react";
import useBusiness from "../../hooks/useBusiness";
import { getBusinessMembers } from "../../api/crm.api";
import { getTeams } from "../../api/operations.api";
import { getTags, getTagRows } from "../../api/tag.api";
import { createAutomation, deleteAutomation, executeAutomation, getAutomationExecutions, getAutomationMetadata, getAutomations, cloneAutomation, updateAutomation, updateAutomationStatus } from "../../api/automation.api";
import { showAuthAlert } from "../../components/auth/authAlert";
import AutomationBuilder from "./AutomationBuilder";

const blank = {
  name: "",
  description: "",
  trigger: { mode: "EVENT", entity: "lead", event: "created", field: "", fromValue: null, toValue: null, schedule: { enabled: false, runAt: null, intervalSeconds: null, endAt: null, timezone: "UTC" } },
  conditions: [],
  conditionLogic: "AND",
  actions: [{ type: "send_notification", config: {} }],
  status: "INACTIVE",
  execution: { maxRunsPerRecord: 1, cooldownSeconds: 0, stopOnError: false },
};

const msg = (e, f = "Something went wrong.") => e?.response?.data?.message || e?.response?.data?.error?.message || e?.message || f;
const unwrapList = (r, key) => (Array.isArray(r?.[key]) ? r[key] : Array.isArray(r?.data?.[key]) ? r.data[key] : []);
const clone = (v) => JSON.parse(JSON.stringify(v));

export default function Automations() {
  const { businessId, loading: businessLoading } = useBusiness();

  const [items, setItems] = useState([]),
    [meta, setMeta] = useState({}),
    [members, setMembers] = useState([]),
    [teams, setTeams] = useState([]),
    [tags, setTags] = useState([]);

  const [page, setPage] = useState(1),
    [pagination, setPagination] = useState({}),
    [search, setSearch] = useState(""),
    [status, setStatus] = useState(""),
    [entity, setEntity] = useState("");

  const [loading, setLoading] = useState(true),
    [saving, setSaving] = useState(false),
    [modal, setModal] = useState(false),
    [editing, setEditing] = useState(null),
    [form, setForm] = useState(blank),
    [error, setError] = useState("");

  const [history, setHistory] = useState(null),
    [historyRows, setHistoryRows] = useState([]),
    [historyLoading, setHistoryLoading] = useState(false);

  const load = useCallback(async () => {
    if (!businessId) return;
    setLoading(true);
    setError("");
    try {
      const r = await getAutomations(businessId, { page, limit: 20, search: search.trim() || undefined, status: status || undefined, entity: entity || undefined });
      setItems(unwrapList(r, "automations"));
      setPagination(r.pagination || {});
    } catch (e) {
      setError(msg(e, "Unable to load automations."));
    } finally {
      setLoading(false);
    }
  }, [businessId, page, search, status, entity]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!businessId) return;
    (async () => {
      try {
        const [m, u, tg, ts] = await Promise.all([getAutomationMetadata(businessId), getBusinessMembers(businessId, { page: 1, limit: 100 }), getTags(businessId, { page: 1, limit: 100 }), getTeams(businessId, { page: 1, limit: 100 })]);
        setMeta(m?.data || m || {});
        const ud = u?.data || u || {};
        setMembers(ud?.members || ud?.items || ud?.businessMembers || []);
        setTags(getTagRows(tg));
        const td = ts?.data || ts || {};
        setTeams(td?.teams || td?.items || []);
      } catch {}
    })();
  }, [businessId]);

  const openNew = () => {
    setEditing(null);
    setForm(clone(blank));
    setError("");
    setModal(true);
  };

  const openEdit = async (item) => {
    setSaving(true);
    try {
      const r = await import("../../api/automation.api").then((x) => x.getAutomationById(businessId, item._id));
      setEditing(item);
      setForm(clone(r?.automation || r));
      setModal(true);
    } catch (e) {
      setError(msg(e));
    } finally {
      setSaving(false);
    }
  };

  const save = async () => {
    if (!form.name.trim()) {
      setError("Automation name is required.");
      return;
    }

    if (!form.actions?.length) {
      setError("Add at least one action.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      if (editing) await updateAutomation(businessId, editing._id, { ...form, name: form.name.trim() });
      else await createAutomation(businessId, { ...form, name: form.name.trim() });

      setModal(false);
      setEditing(null);
      await load();

      await showAuthAlert({
        icon: "success",
        title: editing ? "Automation updated" : "Automation created",
        text: "Automation configuration saved successfully.",
        confirmButtonText: "Done",
      });
    } catch (e) {
      setError(msg(e, "Unable to save automation."));
    } finally {
      setSaving(false);
    }
  };

  const toggle = async (item) => {
    try {
      await updateAutomationStatus(businessId, item._id, item.status === "ACTIVE" ? "INACTIVE" : "ACTIVE");
      await load();
    } catch (e) {
      setError(msg(e, "Unable to update status."));
    }
  };

  const remove = async (item) => {
    const r = await showAuthAlert({
      icon: "warning",
      title: "Delete automation?",
      text: `${item.name} will be permanently removed.`,
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (!r.isConfirmed) return;

    try {
      await deleteAutomation(businessId, item._id);
      await load();
    } catch (e) {
      setError(msg(e, "Unable to delete automation."));
    }
  };

  const cloneItem = async (item) => {
    try {
      await cloneAutomation(businessId, item._id);
      await load();
      await showAuthAlert({
        icon: "success",
        title: "Automation cloned",
        text: "A draft copy was created.",
        confirmButtonText: "Done",
      });
    } catch (e) {
      setError(msg(e, "Unable to clone automation."));
    }
  };

  const run = async (item) => {
    try {
      await executeAutomation(businessId, item._id, {});
      await load();
      await showAuthAlert({
        icon: "success",
        title: "Automation executed",
        text: "Manual execution completed.",
        confirmButtonText: "Done",
      });
    } catch (e) {
      setError(msg(e, "Unable to execute automation."));
    }
  };

  const openHistory = async (item) => {
    setHistory(item);
    setHistoryLoading(true);
    try {
      const r = await getAutomationExecutions(businessId, item._id, { page: 1, limit: 30 });
      setHistoryRows(unwrapList(r, "executions"));
    } catch (e) {
      setError(msg(e, "Unable to load execution history."));
    } finally {
      setHistoryLoading(false);
    }
  };

  const totalPages = Math.max(1, Number(pagination.totalPages || 1));

  return (
    <div className="auto-page">
      <style>{`.auto-page{padding:24px 26px 38px;max-width:1550px;margin:auto;color:var(--crm-text)}.auto-head{display:flex;justify-content:space-between;gap:16px;align-items:flex-start;margin-bottom:16px}.auto-title{font-size:24px;font-weight:400;margin:0}.auto-sub{margin:5px 0 0;color:var(--crm-muted);font-size:13px}.auto-actions{display:flex;gap:8px}.auto-btn{height:38px;border:1px solid var(--crm-border);border-radius:9px;background:var(--crm-surface);color:var(--crm-text);display:inline-flex;align-items:center;gap:7px;padding:0 12px;font-size:13px;cursor:pointer}.auto-btn.primary{background:var(--crm-primary);border-color:var(--crm-primary);color:#fff}.auto-toolbar{display:flex;gap:9px;align-items:center;flex-wrap:wrap;margin-bottom:13px}.auto-search{position:relative;width:min(390px,100%)}.auto-search input{width:100%;height:38px;border:1px solid var(--crm-border);border-radius:9px;background:var(--crm-surface);color:var(--crm-text);padding:0 34px;font-size:13px;outline:0}.auto-search svg{position:absolute;left:11px;top:50%;transform:translateY(-50%);color:var(--crm-muted)}.auto-search-clear{position:absolute;right:6px;top:6px;width:26px;height:26px;border:0;border-radius:7px;background:transparent;color:var(--crm-muted);display:grid;place-items:center;align-items:center;justify-content:center;line-height:1;padding:0;cursor:pointer;}.auto-select{height:38px;border:1px solid var(--crm-border);border-radius:9px;background:var(--crm-surface);color:var(--crm-text);padding:0 10px;font-size:13px}.auto-table{border:1px solid var(--crm-border);border-radius:14px;overflow:auto;background:var(--crm-surface);box-shadow:var(--crm-shadow)}.auto-table table{width:100%;border-collapse:collapse;min-width:1000px}.auto-table th,.auto-table td{padding:12px 14px;border-bottom:1px solid var(--crm-border);text-align:left;font-size:13px}.auto-table th{background:var(--crm-surface-2);color:var(--crm-muted);font-weight:400;text-transform:uppercase;letter-spacing:.06em}.auto-table tr:last-child td{border-bottom:0}.auto-name{font-weight:500}.auto-muted{color:var(--crm-muted);font-size:12px;margin-top:3px}.auto-badge{display:inline-flex;align-items:center;gap:5px;padding:5px 8px;border-radius:999px;font-size:12px}.auto-badge.active{color:var(--crm-success);background:color-mix(in srgb,var(--crm-success) 10%,var(--crm-surface))}.auto-badge.inactive{color:var(--crm-muted);background:var(--crm-surface-2)}.auto-result{color:var(--crm-success)}.auto-row-actions{display:flex;gap:5px}.auto-icon{width:31px;height:31px;border:1px solid var(--crm-border);border-radius:8px;background:var(--crm-surface);color:var(--crm-muted);display:grid;place-items:center;cursor:pointer}.auto-icon:hover{color:var(--crm-text)}.auto-empty{text-align:center;padding:55px;color:var(--crm-muted)}.auto-error{margin-bottom:12px;padding:10px 12px;border-radius:9px;background:color-mix(in srgb,var(--crm-danger) 7%,var(--crm-surface));color:var(--crm-danger);font-size:13px}.auto-pager{display:flex;justify-content:space-between;align-items:center;padding:12px 2px;color:var(--crm-muted);font-size:12px}.auto-pager button{height:32px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:8px;padding:0 10px}.auto-modal{position:fixed;inset:0;background:rgba(15,23,42,.48);z-index:900;display:grid;place-items:center;padding:18px}.auto-dialog{width:min(980px,100%);max-height:94vh;overflow:auto;background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:15px;box-shadow:var(--crm-shadow);padding:18px}.auto-dialog-head{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:13px}.auto-dialog-title{font-size:17px;font-weight:500}.auto-close{border:0;background:transparent;color:var(--crm-muted);width:32px;height:32px;display:grid;place-items:center}.auto-basic{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px}.auto-basic label{display:grid;gap:6px;font-size:12px;color:var(--crm-muted)}.auto-basic input,.auto-basic textarea{width:100%;border:1px solid var(--crm-border);border-radius:9px;background:var(--crm-surface);color:var(--crm-text);padding:9px 10px;font-size:13px;outline:0}.auto-basic textarea{min-height:65px;resize:vertical}.auto-span{grid-column:1/-1}.auto-dialog-foot{display:flex;justify-content:flex-end;gap:8px;margin-top:14px}.auto-history-list{display:grid;gap:8px}.auto-history-item{border:1px solid var(--crm-border);border-radius:10px;padding:11px;background:var(--crm-surface-2)}@media(max-width:750px){.auto-page{padding:18px 14px}.auto-head{flex-direction:column}.auto-actions{width:100%}.auto-actions .auto-btn{flex:1;justify-content:center}.auto-basic{grid-template-columns:1fr}.auto-span{grid-column:auto}.auto-toolbar>*{width:100%}.auto-search{width:100%}}`}</style>

      <div className="auto-head">
        <div>
          <h1 className="auto-title">Automations</h1>
          <p className="auto-sub">Event-driven rules that execute actions across your CRM records.</p>
        </div>

        <div className="auto-actions">
          <button className="auto-btn" onClick={load} disabled={loading}>
            <RefreshCw size={14} /> Refresh
          </button>
          <button className="auto-btn primary" onClick={openNew}>
            <Plus size={14} /> New automation
          </button>
        </div>
      </div>

      {error && <div className="auto-error">{error}</div>}

      <div className="auto-toolbar">
        <div className="auto-search">
          <Search size={14} />

          <input
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            placeholder="Search automations..."
          />

          {search && (
            <button type="button" className="auto-search-clear" onClick={() => setSearch("")} aria-label="Clear search">
              <X size={13} />
            </button>
          )}
        </div>

        <select
          className="auto-select"
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}>
          <option value="">All status</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>

        <select
          className="auto-select"
          value={entity}
          onChange={(e) => {
            setPage(1);
            setEntity(e.target.value);
          }}>
          <option value="">All entities</option>
          {(meta.entities || ["lead", "contact", "company", "deal", "task", "activity", "note"]).map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
      </div>

      <div className="auto-table">
        <table>
          <thead>
            <tr>
              <th>Automation</th>
              <th>Trigger</th>
              <th>Actions</th>
              <th>Status</th>
              <th>Last run</th>
              <th>Result</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading || businessLoading ? (
              <tr>
                <td colSpan="7" className="auto-empty">
                  Loading automations…
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan="7" className="auto-empty">
                  <Zap size={22} />
                  <div style={{ marginTop: 8 }}>No automations found.</div>
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item._id}>
                  <td>
                    <div className="auto-name">{item.name}</div>
                    <div className="auto-muted">{item.description || "No description"}</div>
                  </td>

                  <td>
                    {item.trigger?.entity} · {item.trigger?.event}
                  </td>

                  <td>{item.actions?.length || 0} action(s)</td>

                  <td>
                    <span className={`auto-badge ${item.status === "ACTIVE" ? "active" : "inactive"}`}>
                      {item.status === "ACTIVE" ? <CheckCircle2 size={12} /> : <PauseCircle size={12} />} {item.status}
                    </span>
                  </td>

                  <td>{item.lastExecutedAt ? new Date(item.lastExecutedAt).toLocaleString("en-IN") : "Never"}</td>

                  <td className={item.lastExecutionStatus === "SUCCESS" ? "auto-result" : ""}>{item.lastExecutionStatus || "—"}</td>

                  <td>
                    <div className="auto-row-actions">
                      <button className="auto-icon" title="Edit" onClick={() => openEdit(item)}>
                        <Eye size={14} />
                      </button>

                      <button className="auto-icon" title={item.status === "ACTIVE" ? "Disable" : "Enable"} onClick={() => toggle(item)}>
                        {item.status === "ACTIVE" ? <PauseCircle size={14} /> : <Play size={14} />}
                      </button>

                      <button className="auto-icon" title="Clone" onClick={() => cloneItem(item)}>
                        <Copy size={14} />
                      </button>

                      <button className="auto-icon" title="Run now" onClick={() => run(item)}>
                        <Zap size={14} />
                      </button>

                      <button className="auto-icon" title="History" onClick={() => openHistory(item)}>
                        <History size={14} />
                      </button>

                      <button className="auto-icon" title="Delete" onClick={() => remove(item)}>
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

      <div className="auto-pager">
        <span>{pagination.total || 0} automation(s)</span>

        <span>
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </button>{" "}
          <span style={{ margin: "0 8px" }}>
            Page {page} / {totalPages}
          </span>
          <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
            Next
          </button>
        </span>
      </div>

      {modal && (
        <div className="auto-modal">
          <div className="auto-dialog">
            <div className="auto-dialog-head">
              <div className="auto-dialog-title">{editing ? "Edit automation" : "New automation"}</div>

              <button className="auto-close" onClick={() => setModal(false)}>
                <X size={17} />
              </button>
            </div>

            <div className="auto-basic">
              <label>
                Name
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Notify owner when a lead is qualified" />
              </label>

              <label>
                Status
                <select style={{ height: 38, border: "1px solid var(--crm-border)", borderRadius: 9, background: "var(--crm-surface)", color: "var(--crm-text)", padding: "0 10px" }} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option>ACTIVE</option>
                  <option>INACTIVE</option>
                </select>
              </label>

              <label className="auto-span">
                Description
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What should this automation do?" />
              </label>
            </div>

            <AutomationBuilder value={form} onChange={setForm} metadata={meta} members={members} teams={teams} tags={tags} />

            <div className="auto-dialog-foot">
              <button className="auto-btn" onClick={() => setModal(false)}>
                Cancel
              </button>

              <button className="auto-btn primary" disabled={saving} onClick={save}>
                {saving ? "Saving…" : editing ? "Save changes" : "Create automation"}
              </button>
            </div>
          </div>
        </div>
      )}

      {history && (
        <div className="auto-modal" onMouseDown={(e) => e.target === e.currentTarget && setHistory(null)}>
          <div className="auto-dialog" style={{ maxWidth: 760 }}>
            <div className="auto-dialog-head">
              <div>
                <div className="auto-dialog-title">Execution history</div>
                <div className="auto-muted">{history.name}</div>
              </div>

              <button className="auto-close" onClick={() => setHistory(null)}>
                <X size={17} />
              </button>
            </div>

            {historyLoading ? (
              <div className="auto-empty">Loading history…</div>
            ) : historyRows.length === 0 ? (
              <div className="auto-empty">No execution history yet.</div>
            ) : (
              <div className="auto-history-list">
                {historyRows.map((x) => (
                  <div className="auto-history-item" key={x._id}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                      <strong>{x.status || x.executionStatus || "UNKNOWN"}</strong>
                      <span className="auto-muted">{x.createdAt ? new Date(x.createdAt).toLocaleString("en-IN") : "—"}</span>
                    </div>

                    <div className="auto-muted">{x.error || x.message || x.event || "Execution recorded."}</div>
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
