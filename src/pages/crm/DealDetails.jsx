import { useCallback, useEffect, useState } from "react";

import { ArrowLeft, BriefcaseBusiness, Building2, CalendarDays, Check, ChevronDown, CircleDollarSign, Edit3, Mail, MapPin, Pencil, Phone, RefreshCw, Target, Trash2, UserCheck, UsersRound, X } from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";

import useBusiness from "../../hooks/useBusiness";

import { deleteDeal, getDealById, updateDeal } from "../../api/deal.api";
import { getActivities } from "../../api/activity.api";

import { getBusinessMembers } from "../../api/crm.api";

import api from "../../api/api";

import { showAuthAlert } from "../../components/auth/authAlert";

const STATUS_OPTIONS = [
  {
    value: "OPEN",
    label: "Open",
  },
  {
    value: "WON",
    label: "Won",
  },
  {
    value: "LOST",
    label: "Lost",
  },
];

function message(error, fallback = "Something went wrong.") {
  const data = error?.response?.data;

  if (Array.isArray(data?.details) && data.details.length) {
    return data.details
      .map((item) => item?.message)
      .filter(Boolean)
      .join(", ");
  }

  return data?.message || data?.error?.message || data?.error || error?.message || fallback;
}

function unwrap(response) {
  const root = response?.data || response || {};

  if (root?.data && typeof root.data === "object") {
    return root.data;
  }

  return root;
}

function extractRows(response, keys = []) {
  const root = response?.data || response || {};
  const nested = root?.data || root?.result || root?.payload || {};

  const allKeys = [...keys, "items", "results", "pipelines", "contacts", "companies", "members", "stages"];

  for (const source of [root, nested]) {
    for (const key of allKeys) {
      if (Array.isArray(source?.[key])) {
        return source[key];
      }
    }
  }

  if (Array.isArray(root)) return root;

  if (Array.isArray(nested)) return nested;

  return [];
}

function memberSource(member) {
  return member?.userId && typeof member.userId === "object" ? member.userId : member;
}

function memberName(member) {
  const user = memberSource(member);

  return [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() || user?.name || user?.fullName || user?.email || "Unnamed user";
}

function pipelineName(pipeline) {
  return pipeline?.name || pipeline?.title || pipeline?.pipelineName || pipeline?.slug || "Unnamed pipeline";
}

function stageName(stage) {
  return stage?.name || stage?.title || stage?.stageName || stage?.slug || "Unnamed stage";
}

function contactName(contact) {
  return [contact?.firstName, contact?.lastName].filter(Boolean).join(" ").trim() || contact?.name || contact?.email || "Unnamed contact";
}

function companyName(company) {
  return company?.name || company?.legalName || company?.email || "Unnamed company";
}

function formatMoney(value, currency = "INR") {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency || "INR",
      maximumFractionDigits: 0,
    }).format(Number(value || 0));
  } catch {
    return `${currency || "INR"} ${Number(value || 0).toLocaleString("en-IN")}`;
  }
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getDealName(deal) {
  return String(deal?.name || "").trim() || "Unnamed deal";
}

function StatusBadge({ status }) {
  const safe = String(status || "OPEN").toUpperCase();

  return (
    <span className={`deal-detail-status ${safe.toLowerCase()}`}>
      <span className="deal-detail-status-dot" />

      {STATUS_OPTIONS.find((item) => item.value === safe)?.label || safe}
    </span>
  );
}

function Item({ label, value, icon: Icon, full = false }) {
  return (
    <div className={`deal-detail-item ${full ? "full" : ""}`}>
      <div className="deal-detail-label">
        {Icon && <Icon size={11} />}
        {label}
      </div>

      <div className="deal-detail-value">{value || "—"}</div>
    </div>
  );
}

function EditForm({ form, setForm, pipelines, stages, members, loadingStages, loadingOptions, saving, onPipelineChange, onSave, onCancel }) {
  const update = (key, value) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  return (
    <>
      <div className="deal-detail-edit-form">
        <div className="deal-detail-field full">
          <label>Deal name *</label>

          <input value={form.name} onChange={(e) => update("name", e.target.value)} />
        </div>

        <div className="deal-detail-field">
          <label>Value</label>

          <input type="number" min="0" value={form.value} onChange={(e) => update("value", e.target.value)} />
        </div>

        <div className="deal-detail-field">
          <label>Currency</label>

          <input value={form.currency} onChange={(e) => update("currency", e.target.value.toUpperCase())} />
        </div>

        <div className="deal-detail-field">
          <label>Status</label>

          <div className="deal-detail-select-wrap">
            <select value={form.status} onChange={(e) => update("status", e.target.value)}>
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <ChevronDown size={14} />
          </div>
        </div>

        <div className="deal-detail-field">
          <label>Probability (%)</label>

          <input type="number" min="0" max="100" value={form.probability} onChange={(e) => update("probability", e.target.value)} />
        </div>

        <div className="deal-detail-field">
          <label>Pipeline *</label>

          <div className="deal-detail-select-wrap">
            <select value={form.pipelineId} disabled={loadingOptions} onChange={(e) => onPipelineChange(e.target.value)}>
              <option value="">Select pipeline</option>

              {pipelines.map((pipeline) => {
                const id = pipeline?._id || pipeline?.id;

                if (!id) return null;

                return (
                  <option key={id} value={id}>
                    {pipelineName(pipeline)}
                  </option>
                );
              })}
            </select>

            <ChevronDown size={14} />
          </div>
        </div>

        <div className="deal-detail-field">
          <label>Stage *</label>

          <div className="deal-detail-select-wrap">
            <select value={form.stageId} disabled={loadingStages || !form.pipelineId} onChange={(e) => update("stageId", e.target.value)}>
              <option value="">{form.pipelineId ? "Select stage" : "Select pipeline first"}</option>

              {stages.map((stage) => {
                const id = stage?._id || stage?.id;

                if (!id) return null;

                return (
                  <option key={id} value={id}>
                    {stageName(stage)}
                  </option>
                );
              })}
            </select>

            <ChevronDown size={14} />
          </div>
        </div>

        <div className="deal-detail-field">
          <label>Assigned user</label>

          <div className="deal-detail-select-wrap">
            <select value={form.assignedTo} disabled={loadingOptions} onChange={(e) => update("assignedTo", e.target.value)}>
              <option value="">Unassigned</option>

              {members.map((member) => {
                const id = member?._id || member?.id || member?.userId?._id || member?.userId;

                if (!id) return null;

                return (
                  <option key={id} value={id}>
                    {memberName(member)}
                  </option>
                );
              })}
            </select>

            <ChevronDown size={14} />
          </div>
        </div>

        <div className="deal-detail-field">
          <label>Expected close date</label>

          <input type="date" value={form.expectedCloseDate} onChange={(e) => update("expectedCloseDate", e.target.value)} />
        </div>

        <div className="deal-detail-field">
          <label>Source</label>

          <input value={form.source} onChange={(e) => update("source", e.target.value)} />
        </div>

        <div className="deal-detail-field">
          <label>Lost reason</label>

          <input value={form.lostReason} onChange={(e) => update("lostReason", e.target.value)} />
        </div>

        <div className="deal-detail-field full">
          <label>Description</label>

          <textarea rows={5} value={form.description} onChange={(e) => update("description", e.target.value)} />
        </div>
      </div>

      <div className="deal-detail-footer">
        <button type="button" className="deal-detail-btn" disabled={saving} onClick={onCancel}>
          Cancel
        </button>

        <button type="button" className="deal-detail-btn primary" disabled={saving} onClick={onSave}>
          {saving ? (
            <>
              <span className="deal-detail-spinner small" />
              Saving...
            </>
          ) : (
            <>
              <Check size={14} />
              Save changes
            </>
          )}
        </button>
      </div>
    </>
  );
}

export default function DealDetails() {
  const { id } = useParams();

  const navigate = useNavigate();

  const { businessId, loading: businessLoading, error: businessError } = useBusiness();

  const [deal, setDeal] = useState(null);

  const [pipelines, setPipelines] = useState([]);

  const [stages, setStages] = useState([]);

  const [members, setMembers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [loadingOptions, setLoadingOptions] = useState(false);

  const [loadingStages, setLoadingStages] = useState(false);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [editOpen, setEditOpen] = useState(false);

  const [form, setForm] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(false);

  const loadActivities = useCallback(async () => {
    if (!businessId || !id) return;
    setLoadingActivities(true);
    try {
      const response = await getActivities(businessId, { page: 1, limit: 100, dealId: id });
      setActivities(extractRows(response, ["activities"]));
    } catch {
      setActivities([]);
    } finally {
      setLoadingActivities(false);
    }
  }, [businessId, id]);

  const loadDeal = useCallback(async () => {
    if (!businessId || !id) return;

    setLoading(true);

    try {
      const response = await getDealById(businessId, id);

      const current = response?.data?.deal || response?.deal || response?.data || response;

      setDeal(current);
      setError("");
    } catch (e) {
      setDeal(null);

      setError(message(e, "Unable to load deal details."));
    } finally {
      setLoading(false);
    }
  }, [businessId, id]);

  const loadOptions = useCallback(async () => {
    if (!businessId) return;

    setLoadingOptions(true);

    try {
      const [pipelinesResponse, membersResponse] = await Promise.all([
        api.get(`/pipelines/business/${businessId}`, {
          params: {
            page: 1,
            limit: 100,
            status: "ACTIVE",
          },
        }),

        getBusinessMembers(businessId, {
          page: 1,
          limit: 100,
        }),
      ]);

      setPipelines(extractRows(pipelinesResponse, ["pipelines"]));

      setMembers(extractRows(membersResponse, ["members"]));
    } catch (e) {
      setPipelines([]);
      setMembers([]);

      await showAuthAlert({
        icon: "error",
        title: "Options unavailable",
        text: message(e, "Unable to load pipelines and users."),
        confirmButtonText: "OK",
      });
    } finally {
      setLoadingOptions(false);
    }
  }, [businessId]);

  const loadStages = useCallback(
    async (pipelineId) => {
      if (!businessId || !pipelineId) {
        setStages([]);
        return;
      }

      setLoadingStages(true);

      try {
        const response = await api.get(`/pipelines/business/${businessId}/${pipelineId}`);

        const pipeline = unwrap(response)?.pipeline || unwrap(response);

        const rows = Array.isArray(pipeline?.stages) ? pipeline.stages : [];

        setStages(rows.filter((stage) => stage?.isActive !== false && stage?.active !== false));
      } catch {
        setStages([]);
      } finally {
        setLoadingStages(false);
      }
    },
    [businessId]
  );

  useEffect(() => {
    if (businessId && id) {
      loadDeal();
      loadActivities();
    }
  }, [businessId, id, loadDeal, loadActivities]);

  const openEdit = async () => {
    if (!deal) return;

    const currentPipelineId = deal?.pipelineId?._id || deal?.pipelineId?.id || deal?.pipelineId || "";

    setForm({
      name: deal?.name || "",
      description: deal?.description || "",
      value: deal?.value !== undefined && deal?.value !== null ? String(deal.value) : "",
      currency: deal?.currency || "INR",
      expectedCloseDate: deal?.expectedCloseDate ? new Date(deal.expectedCloseDate).toISOString().slice(0, 10) : "",
      pipelineId: currentPipelineId,
      stageId: deal?.stageId?._id || deal?.stageId?.id || deal?.stageId || "",
      assignedTo: deal?.assignedTo?._id || deal?.assignedTo?.id || deal?.assignedTo || "",
      status: deal?.status || "OPEN",
      probability: deal?.probability ?? 0,
      source: deal?.source || "",
      lostReason: deal?.lostReason || "",
    });

    setEditOpen(true);

    await loadOptions();

    if (currentPipelineId) {
      await loadStages(currentPipelineId);
    }
  };

  const handlePipelineChange = async (pipelineId) => {
    setForm((current) => ({
      ...current,
      pipelineId,
      stageId: "",
    }));

    await loadStages(pipelineId);
  };

  const saveEdit = async () => {
    if (!businessId || !id || !form) return;

    if (!form.name.trim()) {
      await showAuthAlert({
        icon: "warning",
        title: "Deal name required",
        text: "Please enter the deal name.",
        confirmButtonText: "OK",
      });
      return;
    }

    if (!form.pipelineId) {
      await showAuthAlert({
        icon: "warning",
        title: "Pipeline required",
        text: "Please select a pipeline.",
        confirmButtonText: "OK",
      });
      return;
    }

    if (!form.stageId) {
      await showAuthAlert({
        icon: "warning",
        title: "Stage required",
        text: "Please select a stage.",
        confirmButtonText: "OK",
      });
      return;
    }

    setSaving(true);

    try {
      await updateDeal(businessId, id, {
        name: form.name.trim(),
        description: form.description.trim() || null,
        value: form.value === "" ? 0 : Number(form.value),
        currency: form.currency.trim().toUpperCase() || "INR",
        expectedCloseDate: form.expectedCloseDate || null,
        pipelineId: form.pipelineId,
        stageId: form.stageId,
        assignedTo: form.assignedTo || null,
        status: form.status || "OPEN",
        probability: form.probability === "" ? 0 : Number(form.probability),
        source: form.source.trim() || null,
        lostReason: form.status === "LOST" ? form.lostReason.trim() || null : null,
      });

      setEditOpen(false);

      await loadDeal();

      await showAuthAlert({
        icon: "success",
        title: "Deal updated",
        text: "The deal has been updated successfully.",
        confirmButtonText: "Done",
      });
    } catch (e) {
      await showAuthAlert({
        icon: "error",
        title: "Unable to update deal",
        text: message(e, "Unable to update the deal."),
        confirmButtonText: "OK",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!businessId || !id) return;

    const result = await showAuthAlert({
      icon: "warning",
      title: "Delete this deal?",
      text: `${getDealName(deal)} will be removed from this business.`,
      showCancelButton: true,
      confirmButtonText: "Delete deal",
      cancelButtonText: "Cancel",
    });

    if (!result?.isConfirmed) return;

    try {
      await deleteDeal(businessId, id);

      await showAuthAlert({
        icon: "success",
        title: "Deal deleted",
        text: "The deal has been removed successfully.",
        confirmButtonText: "Done",
      });

      navigate("/crm/deals");
    } catch (e) {
      await showAuthAlert({
        icon: "error",
        title: "Delete failed",
        text: message(e, "Unable to delete the deal."),
        confirmButtonText: "OK",
      });
    }
  };

  if (loading || businessLoading) {
    return (
      <>
        <style>{`
          .deal-detail-loading-page{padding:40px;color:var(--crm-muted);display:flex;align-items:center;justify-content:center;gap:9px;font-size:13px}
          .deal-detail-spinner{width:17px;height:17px;border:2px solid var(--crm-border);border-top-color:var(--crm-primary);border-radius:50%;animation:deal-detail-spin .75s linear infinite;display:inline-block}
          @keyframes deal-detail-spin{to{transform:rotate(360deg)}}
        `}</style>

        <div className="deal-detail-loading-page">
          <span className="deal-detail-spinner" />
          Loading deal details...
        </div>
      </>
    );
  }

  if (!deal) {
    return (
      <>
        <style>{`
          .deal-detail-error-page{padding:35px;color:var(--crm-text)}
          .deal-detail-error-box{padding:14px;border:1px solid var(--crm-border);border-radius:12px;background:var(--crm-surface);color:var(--crm-danger);font-size:13px}
          .deal-detail-btn{height:38px;padding:0 13px;border-radius:9px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);display:inline-flex;align-items:center;gap:7px;cursor:pointer;font-size:13px;font-weight:400}
        `}</style>

        <div className="deal-detail-error-page">
          <button type="button" className="deal-detail-btn" onClick={() => navigate("/crm/deals")}>
            <ArrowLeft size={14} />
            Back to deals
          </button>

          <div
            className="deal-detail-error-box"
            style={{
              marginTop: 14,
            }}>
            {error || businessError || "Deal not found."}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        .deal-detail-page{padding:28px 30px 42px;max-width:1400px;margin:0 auto;color:var(--crm-text)}
        .deal-detail-head{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;margin-bottom:18px}
        .deal-detail-head-left{display:flex;align-items:flex-start;gap:11px}
        .deal-detail-back{width:34px;height:34px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-muted);border-radius:9px;display:grid;place-items:center;cursor:pointer}
        .deal-detail-back:hover{color:var(--crm-primary);border-color:var(--crm-primary)}
        .deal-detail-eyebrow{font-size:13px;color:var(--crm-primary);font-weight:400;text-transform:uppercase;letter-spacing:.1em;margin-bottom:5px}
        .deal-detail-title{font-size:25px;line-height:1.2;margin:0;font-weight:400;color:var(--crm-text)}
        .deal-detail-subtitle{font-size:13px;color:var(--crm-muted);margin-top:5px}
        .deal-detail-actions{display:flex;gap:8px}
        .deal-detail-btn{height:38px;padding:0 13px;border-radius:9px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);display:inline-flex;align-items:center;justify-content:center;gap:7px;cursor:pointer;font-size:13px;font-weight:400}
        .deal-detail-btn:hover:not(:disabled){border-color:var(--crm-primary);color:var(--crm-primary)}
        .deal-detail-btn.primary{background:var(--crm-primary);border-color:var(--crm-primary);color:#fff}
        .deal-detail-btn.danger{color:var(--crm-danger)}
        .deal-detail-btn:disabled{opacity:.55;cursor:not-allowed}
        .deal-detail-hero{display:flex;align-items:center;gap:14px;padding:18px;border:1px solid var(--crm-border);border-radius:14px;background:var(--crm-surface);box-shadow:var(--crm-shadow);margin-bottom:14px}
        .deal-detail-avatar{width:52px;height:52px;border-radius:14px;background:var(--crm-primary-soft);color:var(--crm-primary);display:grid;place-items:center;font-size:14px;font-weight:400}
        .deal-detail-hero-main{min-width:0}
        .deal-detail-hero-name{font-size:16px;font-weight:400}
        .deal-detail-hero-meta{font-size:13px;color:var(--crm-muted);margin-top:4px}
        .deal-detail-hero-side{margin-left:auto;display:flex;align-items:center;gap:9px}
        .deal-detail-status{display:inline-flex;align-items:center;gap:6px;padding:6px 9px;border-radius:7px;font-size:13px;font-weight:400}
        .deal-detail-status-dot{width:5px;height:5px;border-radius:50%;background:currentColor}
        .deal-detail-status.open{color:var(--crm-primary);background:var(--crm-primary-soft)}
        .deal-detail-status.won{color:var(--crm-success);background:color-mix(in srgb,var(--crm-success) 12%,transparent)}
        .deal-detail-status.lost{color:var(--crm-danger);background:color-mix(in srgb,var(--crm-danger) 10%,transparent)}
        .deal-detail-value-big{font-size:18px;font-weight:400}
        .deal-detail-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
        .deal-detail-item{padding:13px;border:1px solid var(--crm-border);border-radius:10px;background:var(--crm-surface)}
        .deal-detail-item.full{grid-column:1/-1}
        .deal-detail-label{display:flex;align-items:center;gap:5px;font-size:13px;text-transform:uppercase;letter-spacing:.07em;color:var(--crm-muted);font-weight:400}
        .deal-detail-value{font-size:13px;color:var(--crm-text);font-weight:400;margin-top:6px;word-break:break-word}
        .deal-detail-description{line-height:1.65;white-space:pre-wrap;font-weight:400}
        .deal-detail-section{margin-top:14px;background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:14px;box-shadow:var(--crm-shadow);overflow:hidden}
        .deal-detail-section-head{padding:14px 16px;border-bottom:1px solid var(--crm-border)}
        .deal-detail-section-title{font-size:13px;font-weight:400}
        .deal-detail-section-subtitle{font-size:13px;color:var(--crm-muted);margin-top:3px}
        .deal-detail-section-body{padding:16px}
        .deal-detail-edit-form{padding:20px;display:grid;grid-template-columns:1fr 1fr;gap:14px}
        .deal-detail-field{display:grid;gap:6px}
        .deal-detail-field.full{grid-column:1/-1}
        .deal-detail-field label{font-size:13px;font-weight:400}
        .deal-detail-field input,.deal-detail-field select,.deal-detail-field textarea{width:100%;box-sizing:border-box;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:9px;padding:10px 11px;outline:0;font-size:13px}
        .deal-detail-field input:focus,.deal-detail-field select:focus,.deal-detail-field textarea:focus{border-color:var(--crm-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--crm-primary) 9%,transparent)}
        .deal-detail-field textarea{resize:vertical;line-height:1.55}
        .deal-detail-select-wrap{position:relative}
        .deal-detail-select-wrap select{appearance:none;padding-right:32px}
        .deal-detail-select-wrap svg{position:absolute;right:10px;top:12px;color:var(--crm-muted);pointer-events:none}
        .deal-detail-footer{display:flex;justify-content:flex-end;gap:8px;padding:13px 20px;border-top:1px solid var(--crm-border)}

        .deal-detail-activity-wrap{margin-top:16px;padding-top:15px;border-top:1px solid var(--crm-border)}
        .deal-detail-activity-title{font-size:13px;font-weight:400;margin-bottom:11px;color:var(--crm-text)}
        .deal-detail-activity-empty{min-height:54px;border:1px dashed var(--crm-border);border-radius:10px;display:flex;align-items:center;justify-content:center;gap:8px;color:var(--crm-muted);font-size:13px}
        .deal-detail-activity-list{display:grid;gap:10px}
        .deal-detail-activity-item{display:flex;gap:10px;padding:11px 12px;border:1px solid var(--crm-border);border-radius:10px;background:var(--crm-surface)}
        .deal-detail-activity-dot{width:8px;height:8px;min-width:8px;margin-top:4px;border-radius:50%;background:var(--crm-primary)}
        .deal-detail-activity-content{min-width:0;flex:1}
        .deal-detail-activity-top{display:flex;align-items:center;justify-content:space-between;gap:10px}
        .deal-detail-activity-subject{font-size:13px;font-weight:400;color:var(--crm-text)}
        .deal-detail-activity-status{font-size:13px;font-weight:400;padding:4px 6px;border-radius:6px;background:var(--crm-primary-soft);color:var(--crm-primary);white-space:nowrap}
        .deal-detail-activity-status.completed{color:var(--crm-success);background:color-mix(in srgb,var(--crm-success) 12%,transparent)}
        .deal-detail-activity-status.cancelled{color:var(--crm-danger);background:color-mix(in srgb,var(--crm-danger) 10%,transparent)}
        .deal-detail-activity-meta{font-size:13px;color:var(--crm-muted);margin-top:4px;text-transform:uppercase}
        .deal-detail-activity-description{font-size:13px;color:var(--crm-text);line-height:1.55;margin-top:7px;white-space:pre-wrap}
        .deal-detail-activity-outcome{font-size:13px;color:var(--crm-muted);margin-top:6px}
        .deal-detail-spinner{width:16px;height:16px;border:2px solid var(--crm-border);border-top-color:var(--crm-primary);border-radius:50%;animation:deal-detail-spin .75s linear infinite;display:inline-block}
        .deal-detail-spinner.small{width:13px;height:13px}
        @keyframes deal-detail-spin{to{transform:rotate(360deg)}}
        @media(max-width:900px){.deal-detail-head{flex-direction:column}.deal-detail-actions{width:100%}.deal-detail-actions .deal-detail-btn{flex:1}.deal-detail-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
        @media(max-width:650px){.deal-detail-page{padding:20px 15px 30px}.deal-detail-title{font-size:22px}.deal-detail-hero{align-items:flex-start;flex-wrap:wrap}.deal-detail-hero-side{width:100%;margin-left:0;justify-content:space-between}.deal-detail-grid{grid-template-columns:1fr}.deal-detail-item.full{grid-column:auto}.deal-detail-edit-form{grid-template-columns:1fr;padding:17px}.deal-detail-field.full{grid-column:auto}.deal-detail-footer .deal-detail-btn{flex:1}}
      `}</style>

      <section className="deal-detail-page">
        <div className="deal-detail-head">
          <div className="deal-detail-head-left">
            <button type="button" className="deal-detail-back" onClick={() => navigate("/deals")}>
              <ArrowLeft size={15} />
            </button>

            <div>
              <div className="deal-detail-eyebrow">Sales workspace</div>

              <h1 className="deal-detail-title">{getDealName(deal)}</h1>

              <div className="deal-detail-subtitle">Deal details and opportunity information</div>
            </div>
          </div>

          <div className="deal-detail-actions">
            <button type="button" className="deal-detail-btn" onClick={loadDeal}>
              <RefreshCw size={13} />
              Refresh
            </button>

            <button type="button" className="deal-detail-btn" onClick={openEdit}>
              <Edit3 size={13} />
              Edit
            </button>

            <button type="button" className="deal-detail-btn danger" onClick={handleDelete}>
              <Trash2 size={13} />
              Delete
            </button>
          </div>
        </div>

        {error && (
          <div
            style={{
              marginBottom: 12,
              padding: "10px 12px",
              borderRadius: 9,
              border: "1px solid color-mix(in srgb,var(--crm-danger) 20%,var(--crm-border))",
              color: "var(--crm-danger)",
              background: "color-mix(in srgb,var(--crm-danger) 8%,transparent)",
              fontSize: 11,
            }}>
            {error}
          </div>
        )}

        <div className="deal-detail-hero">
          <div className="deal-detail-avatar">
            {getDealName(deal)
              .split(/\s+/)
              .filter(Boolean)
              .slice(0, 2)
              .map((part) => part[0])
              .join("")
              .toUpperCase()}
          </div>

          <div className="deal-detail-hero-main">
            <div className="deal-detail-hero-name">{getDealName(deal)}</div>

            <div className="deal-detail-hero-meta">
              {deal?.companyId ? companyName(deal.companyId) : "No company"} • {deal?.pipelineId ? pipelineName(deal.pipelineId) : "No pipeline"}
            </div>
          </div>

          <div className="deal-detail-hero-side">
            <div className="deal-detail-value-big">{formatMoney(deal?.value, deal?.currency || "INR")}</div>

            <StatusBadge status={deal?.status} />
          </div>
        </div>

        <div className="deal-detail-grid">
          <Item label="Pipeline" value={deal?.pipelineId ? pipelineName(deal.pipelineId) : "—"} icon={Target} />

          <Item label="Stage" value={deal?.stageId ? stageName(deal.stageId) : "—"} icon={Target} />

          <Item label="Probability" value={`${Number(deal?.probability || 0)}%`} icon={CircleDollarSign} />

          <Item label="Contact" value={deal?.contactId ? contactName(deal.contactId) : "—"} icon={UsersRound} />

          <Item label="Company" value={deal?.companyId ? companyName(deal.companyId) : "—"} icon={Building2} />

          <Item label="Assigned user" value={deal?.assignedTo ? memberName(deal.assignedTo) : "Unassigned"} icon={UserCheck} />

          <Item label="Expected close" value={formatDate(deal?.expectedCloseDate)} icon={CalendarDays} />

          <Item label="Source" value={deal?.source || "—"} icon={BriefcaseBusiness} />

          <Item label="Currency" value={deal?.currency || "INR"} icon={CircleDollarSign} />

          <Item label="Created" value={formatDateTime(deal?.createdAt)} icon={CalendarDays} />

          <Item label="Updated" value={formatDateTime(deal?.updatedAt)} icon={RefreshCw} />

          {deal?.lostReason && <Item label="Lost reason" value={deal.lostReason} icon={Target} full />}

          <Item label="Description" value={deal?.description || "No description added."} icon={BriefcaseBusiness} full />
        </div>

        {editOpen && form && (
          <div
            className="deal-detail-section"
            style={{
              marginTop: 14,
            }}>
            <div className="deal-detail-section-head">
              <div className="deal-detail-section-title">Edit deal</div>

              <div className="deal-detail-section-subtitle">Update the opportunity information below.</div>
            </div>

            <EditForm form={form} setForm={setForm} pipelines={pipelines} stages={stages} members={members} loadingStages={loadingStages} loadingOptions={loadingOptions} saving={saving} onPipelineChange={handlePipelineChange} onSave={saveEdit} onCancel={() => setEditOpen(false)} />
          </div>
        )}

        <div className="deal-detail-section">
          <div className="deal-detail-section-head">
            <div className="deal-detail-section-title">Deal timeline</div>
            <div className="deal-detail-section-subtitle">Activities and current lifecycle information</div>
          </div>
          <div className="deal-detail-section-body">
            <div className="deal-detail-grid">
              <Item label="Created at" value={formatDateTime(deal?.createdAt)} icon={CalendarDays} />
              <Item label="Won at" value={formatDateTime(deal?.wonAt)} icon={Check} />
              <Item label="Lost at" value={formatDateTime(deal?.lostAt)} icon={X} />
            </div>
            <div className="deal-detail-activity-wrap">
              <div className="deal-detail-activity-title">Activity timeline</div>
              {loadingActivities ? (
                <div className="deal-detail-activity-empty">
                  <span className="deal-detail-spinner small" />
                  Loading activities...
                </div>
              ) : activities.length === 0 ? (
                <div className="deal-detail-activity-empty">No activities have been added to this deal yet.</div>
              ) : (
                <div className="deal-detail-activity-list">
                  {activities
                    .slice()
                    .sort((a, b) => new Date(b?.createdAt || b?.dueAt || 0) - new Date(a?.createdAt || a?.dueAt || 0))
                    .map((activity) => (
                      <div className="deal-detail-activity-item" key={activity?._id || activity?.id}>
                        <div className="deal-detail-activity-dot" />
                        <div className="deal-detail-activity-content">
                          <div className="deal-detail-activity-top">
                            <div className="deal-detail-activity-subject">{activity?.subject || "Untitled activity"}</div>
                            <span className={`deal-detail-activity-status ${String(activity?.status || "PLANNED").toLowerCase()}`}>{String(activity?.status || "PLANNED").replaceAll("_", " ")}</span>
                          </div>
                          <div className="deal-detail-activity-meta">
                            {activity?.type || "OTHER"} • {formatDateTime(activity?.dueAt || activity?.createdAt)}
                          </div>
                          {activity?.description && <div className="deal-detail-activity-description">{activity.description}</div>}
                          {activity?.outcome && (
                            <div className="deal-detail-activity-outcome">
                              <strong>Outcome:</strong> {activity.outcome}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
