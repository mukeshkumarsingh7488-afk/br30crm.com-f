import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarDays, CheckSquare2, Clock3, Mail, MessageSquare, Phone, RefreshCw, StickyNote, UsersRound } from "lucide-react";
import { getActivities } from "../../api/activity.api";

const TYPE_META = {
  CALL: { label: "Call", icon: Phone },
  EMAIL: { label: "Email", icon: Mail },
  MEETING: { label: "Meeting", icon: CalendarDays },
  TASK: { label: "Task", icon: CheckSquare2 },
  NOTE: { label: "Note", icon: StickyNote },
  SMS: { label: "SMS", icon: MessageSquare },
  WHATSAPP: { label: "WhatsApp", icon: MessageSquare },
  FOLLOW_UP: { label: "Follow up", icon: Clock3 },
  OTHER: { label: "Other", icon: UsersRound },
};

const formatDateTime = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
};

const getMemberName = (value) => {
  if (!value) return "—";
  if (typeof value === "string") return value;
  return [value.firstName, value.lastName].filter(Boolean).join(" ").trim() || value.name || value.fullName || value.email || "—";
};

const getOutcomeLabel = (value) =>
  String(value || "")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

export default function ActivityTimeline({ businessId, contactId, companyId, title = "Activity timeline", subtitle = "Calls, emails, meetings, tasks and other customer activity." }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!businessId || (!contactId && !companyId)) {
      setActivities([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const rows = [];
      let page = 1;
      let totalPages = 1;

      do {
        const params = { page, limit: 100 };
        if (contactId) params.contactId = contactId;
        if (companyId) params.companyId = companyId;

        const response = await getActivities(businessId, params);
        const root = response?.data || response || {};
        const data = root?.data && typeof root.data === "object" && !Array.isArray(root.data) ? root.data : root;
        const pageRows = Array.isArray(data?.activities) ? data.activities : [];
        rows.push(...pageRows);
        totalPages = Number(data?.pagination?.totalPages) || 1;
        page += 1;
      } while (page <= totalPages);

      setActivities(rows);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Unable to load activity timeline.");
      setActivities([]);
    } finally {
      setLoading(false);
    }
  }, [businessId, contactId, companyId]);

  useEffect(() => {
    load();
  }, [load]);

  const sortedActivities = useMemo(() => activities.slice().sort((a, b) => new Date(b?.createdAt || b?.dueAt || 0) - new Date(a?.createdAt || a?.dueAt || 0)), [activities]);

  return (
    <section className="br30-activity-timeline">
      <style>{`.br30-activity-timeline{margin-top:14px;background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:14px;box-shadow:var(--crm-shadow);overflow:hidden}.br30-activity-timeline-head{padding:14px 16px;border-bottom:1px solid var(--crm-border);display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.br30-activity-timeline-title{font-size:14px;font-weight:400;color:var(--crm-text)}.br30-activity-timeline-subtitle{font-size:12px;color:var(--crm-muted);margin-top:3px}.br30-activity-timeline-refresh{width:32px;height:32px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-muted);border-radius:8px;display:grid;place-items:center;cursor:pointer}.br30-activity-timeline-refresh:hover{color:var(--crm-primary);border-color:var(--crm-primary)}.br30-activity-timeline-body{padding:16px}.br30-activity-timeline-list{display:grid;gap:10px}.br30-activity-timeline-item{display:grid;grid-template-columns:34px minmax(0,1fr);gap:10px;padding:12px;border:1px solid var(--crm-border);border-radius:10px;background:var(--crm-surface-2)}.br30-activity-timeline-icon{width:34px;height:34px;border-radius:9px;background:color-mix(in srgb,var(--crm-primary) 10%,transparent);color:var(--crm-primary);display:grid;place-items:center}.br30-activity-timeline-main{min-width:0}.br30-activity-timeline-top{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}.br30-activity-timeline-subject{font-size:13px;font-weight:400;color:var(--crm-text);word-break:break-word}.br30-activity-timeline-status{font-size:11px;color:var(--crm-muted);border:1px solid var(--crm-border);border-radius:999px;padding:4px 7px;white-space:nowrap}.br30-activity-timeline-meta{display:flex;flex-wrap:wrap;gap:6px 10px;margin-top:5px;color:var(--crm-muted);font-size:11px}.br30-activity-timeline-description{margin-top:8px;font-size:12px;line-height:1.55;color:var(--crm-text);white-space:pre-wrap;word-break:break-word}.br30-activity-timeline-outcome{margin-top:7px;font-size:12px;color:var(--crm-text)}.br30-activity-timeline-empty{padding:34px 16px;text-align:center;color:var(--crm-muted);font-size:13px}.br30-activity-timeline-error{padding:12px;border:1px solid color-mix(in srgb,var(--crm-danger) 30%,var(--crm-border));border-radius:9px;color:var(--crm-danger);font-size:12px}.br30-activity-timeline-loading{padding:34px 16px;text-align:center;color:var(--crm-muted);font-size:13px}@media(max-width:620px){.br30-activity-timeline-top{display:grid;gap:6px}.br30-activity-timeline-status{width:max-content}}`}</style>

      <div className="br30-activity-timeline-head">
        <div>
          <div className="br30-activity-timeline-title">{title}</div>
          <div className="br30-activity-timeline-subtitle">{subtitle}</div>
        </div>
        <button type="button" className="br30-activity-timeline-refresh" onClick={load} disabled={loading} title="Refresh activity timeline" aria-label="Refresh activity timeline">
          <RefreshCw size={14} />
        </button>
      </div>

      <div className="br30-activity-timeline-body">
        {loading ? (
          <div className="br30-activity-timeline-loading">Loading activity timeline...</div>
        ) : error ? (
          <div className="br30-activity-timeline-error">{error}</div>
        ) : !sortedActivities.length ? (
          <div className="br30-activity-timeline-empty">No activities have been added to this record yet.</div>
        ) : (
          <div className="br30-activity-timeline-list">
            {sortedActivities.map((activity) => {
              const meta = TYPE_META[String(activity?.type || "OTHER").toUpperCase()] || TYPE_META.OTHER;
              const Icon = meta.icon;
              return (
                <div className="br30-activity-timeline-item" key={activity?._id || activity?.id}>
                  <div className="br30-activity-timeline-icon">
                    <Icon size={15} />
                  </div>
                  <div className="br30-activity-timeline-main">
                    <div className="br30-activity-timeline-top">
                      <div className="br30-activity-timeline-subject">{activity?.subject || "Untitled activity"}</div>
                      <span className="br30-activity-timeline-status">{String(activity?.status || "PLANNED").replaceAll("_", " ")}</span>
                    </div>
                    <div className="br30-activity-timeline-meta">
                      <span>{meta.label}</span>
                      <span>{formatDateTime(activity?.dueAt || activity?.createdAt)}</span>
                      <span>Assigned: {getMemberName(activity?.assignedTo)}</span>
                    </div>
                    {activity?.description && <div className="br30-activity-timeline-description">{activity.description}</div>}
                    {activity?.outcome && (
                      <div className="br30-activity-timeline-outcome">
                        <strong>Outcome:</strong> {getOutcomeLabel(activity.outcome)}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
