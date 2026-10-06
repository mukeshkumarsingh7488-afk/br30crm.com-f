import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, BriefcaseBusiness, Building2, Check, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, CircleDollarSign, Eye, Filter, Mail, MoreHorizontal, Pencil, Phone, Plus, RefreshCw, Search, Target, Trash2, UserCheck, UsersRound, X, CalendarDays } from "lucide-react";
import { useNavigate } from "react-router-dom";

import useBusiness from "../../hooks/useBusiness";
import AssigneeDetailsPopup from "../../components/crm/AssigneeDetailsPopup";
import { isManagementRole } from "../../utils/permissions";

import { createDeal, deleteDeal, getDealById, getDeals, updateDeal, assignDeal, moveDeal } from "../../api/deal.api";

import { getBusinessMembers } from "../../api/crm.api";
import api from "../../api/api";

import { showAuthAlert } from "../../components/auth/authAlert";

const STATUS_OPTIONS = [
  { value: "OPEN", label: "Open" },
  { value: "WON", label: "Won" },
  { value: "LOST", label: "Lost" },
];

const EMPTY_FORM = {
  name: "",
  description: "",
  value: "",
  currency: "INR",
  expectedCloseDate: "",
  pipelineId: "",
  stageId: "",
  contactId: "",
  companyId: "",
  assignedTo: "",
  status: "OPEN",
  probability: 0,
  source: "",
  lostReason: "",
};

function getErrorMessage(error, fallback = "Something went wrong.") {
  const data = error?.response?.data;

  if (Array.isArray(data?.details) && data.details.length) {
    return data.details
      .map((item) => item?.message)
      .filter(Boolean)
      .join(", ");
  }

  return data?.message || data?.error?.message || data?.error || error?.message || fallback;
}

const showErrorAlert = (title, text) =>
  showAuthAlert({
    icon: "error",
    title,
    text,
    confirmButtonText: "OK",
  });

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

  const allKeys = [...keys, "items", "results", "deals", "pipelines", "contacts", "companies", "members", "stages"];

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

function extractPagination(response, fallbackRows, page, limit) {
  const data = unwrap(response);

  return (
    data?.pagination || {
      page,
      limit,
      total: fallbackRows.length,
      totalPages: 1,
    }
  );
}

function getId(value) {
  return value?._id || value?.id || "";
}

function memberSource(member) {
  return member?.userId && typeof member.userId === "object" ? member.userId : member;
}

function memberId(member) {
  return member?.userId?._id || member?.userId?.id || member?.userId || member?._userId || "";
}

function memberName(member) {
  const user = memberSource(member);

  return [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() || user?.name || user?.fullName || user?.email || "Unnamed user";
}

function memberEmail(member) {
  const user = memberSource(member);

  return user?.email || member?.email || "";
}

function pipelineName(pipeline) {
  return pipeline?.name || pipeline?.title || pipeline?.pipelineName || pipeline?.slug || "Unnamed pipeline";
}

function stageId(stage) {
  return stage?._id || stage?.id || "";
}

function stageName(stage) {
  return stage?.name || stage?.title || stage?.stageName || stage?.slug || "Unnamed stage";
}

function contactId(contact) {
  return contact?._id || contact?.id || "";
}

function contactName(contact) {
  return [contact?.firstName, contact?.lastName].filter(Boolean).join(" ").trim() || contact?.name || contact?.email || "Unnamed contact";
}

function companyId(company) {
  return company?._id || company?.id || "";
}

function companyName(company) {
  return company?.name || company?.legalName || company?.email || "Unnamed company";
}

function formatMoney(value, currency = "INR") {
  const number = Number(value || 0);

  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency || "INR",
      maximumFractionDigits: 0,
    }).format(number);
  } catch {
    return `${currency || "INR"} ${number.toLocaleString("en-IN")}`;
  }
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateInput(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toISOString().slice(0, 10);
}

function formatSource(value) {
  if (!value) return "—";

  return String(value)
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getDealName(deal) {
  return String(deal?.name || "").trim() || "Unnamed deal";
}

function getDealInitials(deal) {
  const name = getDealName(deal);

  const parts = name.split(/\s+/).filter(Boolean).slice(0, 2);

  if (!parts.length) return "DL";

  return parts
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function StatusBadge({ status }) {
  const safe = String(status || "OPEN").toUpperCase();

  return (
    <span className={`deals-status-badge ${safe.toLowerCase()}`}>
      <span className="deals-status-dot" />
      {STATUS_OPTIONS.find((item) => item.value === safe)?.label || safe}
    </span>
  );
}

function SearchableSelect({ value, items, loading, disabled, placeholder, getItemId, getItemName, getItemSecondary, onChange, icon: Icon, emptyText = "No results found." }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    const close = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", close);

    return () => document.removeEventListener("mousedown", close);
  }, []);

  const filtered = items.filter((item) => {
    const text = `${getItemName(item)} ${getItemSecondary?.(item) || ""}`;

    return text.toLowerCase().includes(query.trim().toLowerCase());
  });

  const selected = items.find((item) => String(getItemId(item)) === String(value || ""));

  return (
    <div className="deals-search-select" ref={ref}>
      <button
        type="button"
        className="deals-search-select-trigger"
        disabled={disabled}
        onClick={() => {
          setOpen((current) => !current);
          setQuery("");
        }}>
        {Icon && <Icon size={14} />}

        <span>{selected ? getItemName(selected) : loading ? "Loading..." : placeholder}</span>

        <ChevronDown size={14} />
      </button>

      {open && (
        <div className="deals-search-select-menu">
          <div className="deals-search-select-search">
            <Search size={13} />

            <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search..." />

            {query && (
              <button type="button" onClick={() => setQuery("")} aria-label="Clear search">
                <X size={12} />
              </button>
            )}
          </div>

          <button
            type="button"
            className={`deals-search-select-option ${!value ? "selected" : ""}`}
            onClick={() => {
              onChange("");
              setOpen(false);
              setQuery("");
            }}>
            {Icon && <Icon size={13} />}

            <span>
              <strong>{placeholder}</strong>
              <small>Clear selection</small>
            </span>
          </button>

          {filtered.map((item) => {
            const id = getItemId(item);

            if (!id) return null;

            const selectedItem = String(value || "") === String(id);

            return (
              <button
                type="button"
                key={id}
                className={`deals-search-select-option ${selectedItem ? "selected" : ""}`}
                onClick={() => {
                  onChange(id);
                  setOpen(false);
                  setQuery("");
                }}>
                {Icon && <Icon size={13} />}

                <span>
                  <strong>{getItemName(item)}</strong>

                  {getItemSecondary?.(item) && <small>{getItemSecondary(item)}</small>}
                </span>
              </button>
            );
          })}

          {!loading && filtered.length === 0 && <div className="deals-search-select-empty">{emptyText}</div>}
        </div>
      )}
    </div>
  );
}

function DealForm({ form, setForm, pipelines, stages, contacts, companies, members, loadingPipelines, loadingStages, loadingContacts, loadingCompanies, loadingMembers, saving, onPipelineChange }) {
  const update = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  return (
    <div className="deals-form">
      <div className="deals-form-section full">
        <div className="deals-form-section-title">
          <CircleDollarSign size={15} />
          Deal information
        </div>

        <div className="deals-form-section-subtitle">Add the primary opportunity details.</div>
      </div>

      <div className="deals-field full">
        <label>Deal name *</label>

        <input value={form.name} onChange={(event) => update("name", event.target.value)} placeholder="Enterprise software deal" autoComplete="off" />
      </div>

      <div className="deals-field">
        <label>Deal value</label>

        <input type="number" min="0" value={form.value} onChange={(event) => update("value", event.target.value)} placeholder="50000" />
      </div>

      <div className="deals-field">
        <label>Currency</label>

        <input value={form.currency} maxLength={10} onChange={(event) => update("currency", event.target.value.toUpperCase())} placeholder="INR" />
      </div>

      <div className="deals-field">
        <label>Probability (%)</label>

        <input type="number" min="0" max="100" value={form.probability} onChange={(event) => update("probability", event.target.value)} placeholder="50" />
      </div>

      <div className="deals-field">
        <label>Status</label>

        <div className="deals-select-wrap">
          <select value={form.status} onChange={(event) => update("status", event.target.value)}>
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <ChevronDown size={14} />
        </div>
      </div>

      <div className="deals-form-section full deals-form-section-spaced">
        <div className="deals-form-section-title">
          <Target size={15} />
          Pipeline
        </div>

        <div className="deals-form-section-subtitle">Select a pipeline and then choose one of its active stages.</div>
      </div>

      <div className="deals-field">
        <label>Pipeline *</label>

        <SearchableSelect
          value={form.pipelineId}
          items={pipelines}
          loading={loadingPipelines}
          disabled={saving}
          placeholder="Select pipeline"
          getItemId={getId}
          getItemName={pipelineName}
          getItemSecondary={(pipeline) => pipeline?.type || pipeline?.slug || ""}
          onChange={onPipelineChange}
          icon={Target}
          emptyText="No pipelines found."
        />
      </div>

      <div className="deals-field">
        <label>Stage *</label>

        <SearchableSelect
          value={form.stageId}
          items={stages}
          loading={loadingStages}
          disabled={saving || !form.pipelineId}
          placeholder={form.pipelineId ? "Select stage" : "Select pipeline first"}
          getItemId={stageId}
          getItemName={stageName}
          getItemSecondary={(stage) => (stage?.probability !== undefined ? `${stage.probability}% probability` : "")}
          onChange={(value) => update("stageId", value)}
          icon={Target}
          emptyText="No active stages found."
        />
      </div>

      <div className="deals-field">
        <label>Contact</label>

        <SearchableSelect
          value={form.contactId}
          items={contacts}
          loading={loadingContacts}
          disabled={saving}
          placeholder="No contact"
          getItemId={contactId}
          getItemName={contactName}
          getItemSecondary={(contact) => contact?.email || contact?.phone || ""}
          onChange={(value) => update("contactId", value)}
          icon={UsersRound}
          emptyText="No contacts found."
        />
      </div>

      <div className="deals-field">
        <label>Company</label>

        <SearchableSelect
          value={form.companyId}
          items={companies}
          loading={loadingCompanies}
          disabled={saving}
          placeholder="No company"
          getItemId={companyId}
          getItemName={companyName}
          getItemSecondary={(company) => company?.email || company?.phone || ""}
          onChange={(value) => update("companyId", value)}
          icon={Building2}
          emptyText="No companies found."
        />
      </div>

      <div className="deals-form-section full deals-form-section-spaced">
        <div className="deals-form-section-title">
          <UserCheck size={15} />
          Assignment & closing
        </div>
      </div>

      <div className="deals-field">
        <label>Assigned user</label>

        <SearchableSelect
          value={form.assignedTo}
          items={members}
          loading={loadingMembers}
          disabled={saving}
          placeholder="Unassigned"
          getItemId={memberId}
          getItemName={memberName}
          getItemSecondary={memberEmail}
          onChange={(value) => update("assignedTo", value)}
          icon={UserCheck}
          emptyText="No business members found."
        />
      </div>

      <div className="deals-field">
        <label>Expected close date</label>

        <div className="deals-input-icon-wrap">
          <CalendarDays size={14} />

          <input type="date" value={form.expectedCloseDate} onChange={(event) => update("expectedCloseDate", event.target.value)} />
        </div>
      </div>

      <div className="deals-field">
        <label>Source</label>

        <input value={form.source} onChange={(event) => update("source", event.target.value)} placeholder="Website / Referral / Manual" />
      </div>

      <div className="deals-field">
        <label>Lost reason</label>

        <input value={form.lostReason} onChange={(event) => update("lostReason", event.target.value)} placeholder="Required when applicable" />
      </div>

      <div className="deals-form-section full deals-form-section-spaced">
        <div className="deals-form-section-title">
          <BriefcaseBusiness size={15} />
          Notes
        </div>
      </div>

      <div className="deals-field full">
        <label>Description</label>

        <textarea rows={5} value={form.description} onChange={(event) => update("description", event.target.value)} placeholder="Add deal notes, requirements, context..." />
      </div>
    </div>
  );
}

function AssignDealContent({ deal, assignForm, setAssignForm, members, loadingMembers, actionLoading, onCancel, onSubmit }) {
  return (
    <>
      <div className="deals-action-content">
        <p className="deals-action-message">
          Assign <strong>{getDealName(deal)}</strong> to a business member.
        </p>

        <div className="deals-action-field">
          <label>Assigned user</label>

          <SearchableSelect
            value={assignForm.assignedTo}
            items={members}
            loading={loadingMembers}
            disabled={actionLoading}
            placeholder="Unassigned"
            getItemId={memberId}
            getItemName={memberName}
            getItemSecondary={memberEmail}
            onChange={(value) =>
              setAssignForm((current) => ({
                ...current,
                assignedTo: value,
              }))
            }
            icon={UserCheck}
            emptyText="No users found."
          />
        </div>

        <div className="deals-action-note">The Deals backend supports user assignment only. Team assignment is not part of the current Deal API.</div>
      </div>

      <div className="deals-modal-footer">
        <button type="button" className="deals-btn" disabled={actionLoading} onClick={onCancel}>
          Cancel
        </button>

        <button type="button" className="deals-btn primary" disabled={actionLoading} onClick={onSubmit}>
          {actionLoading ? (
            <>
              <span className="deals-spinner small" />
              Updating...
            </>
          ) : (
            <>
              <UserCheck size={14} />
              Update assignment
            </>
          )}
        </button>
      </div>
    </>
  );
}

export default function Deals() {
  const navigate = useNavigate();

  const { businessId, loading: businessLoading, error: businessError, role, isBusinessOwner } = useBusiness();
  const canManage = isManagementRole({ role, isBusinessOwner });
  const [assigneeDetail, setAssigneeDetail] = useState(null);

  const [deals, setDeals] = useState([]);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [pipelineId, setPipelineId] = useState("");
  const [stageId, setStageId] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [pageError, setPageError] = useState("");

  const [modal, setModal] = useState(null);

  const [form, setForm] = useState({
    ...EMPTY_FORM,
  });

  const [assignForm, setAssignForm] = useState({
    assignedTo: "",
  });

  const [pipelines, setPipelines] = useState([]);
  const [stages, setStages] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [members, setMembers] = useState([]);

  const [loadingPipelines, setLoadingPipelines] = useState(false);
  const [loadingStages, setLoadingStages] = useState(false);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [loadingMembers, setLoadingMembers] = useState(false);

  const [mobileFilters, setMobileFilters] = useState(false);

  const loadDeals = useCallback(
    async (nextPage = 1, overrides = {}) => {
      if (!businessId) return;

      setLoading(true);
      setPageError("");

      const nextSearch = overrides.search !== undefined ? overrides.search : search;

      const nextStatus = overrides.status !== undefined ? overrides.status : status;

      const nextPipelineId = overrides.pipelineId !== undefined ? overrides.pipelineId : pipelineId;

      const nextStageId = overrides.stageId !== undefined ? overrides.stageId : stageId;

      const nextAssignedTo = overrides.assignedTo !== undefined ? overrides.assignedTo : assignedTo;

      try {
        const response = await getDeals(businessId, {
          page: nextPage,
          limit: pagination.limit,

          ...(nextSearch.trim() ? { search: nextSearch.trim() } : {}),

          ...(nextStatus ? { status: nextStatus } : {}),

          ...(nextPipelineId ? { pipelineId: nextPipelineId } : {}),

          ...(nextStageId ? { stageId: nextStageId } : {}),

          ...(nextAssignedTo ? { assignedTo: nextAssignedTo } : {}),
        });

        const data = unwrap(response);

        const rows = data?.items || data?.deals || data?.results || [];

        setDeals(Array.isArray(rows) ? rows : []);

        setPagination(extractPagination(response, Array.isArray(rows) ? rows : [], nextPage, pagination.limit));
      } catch (error) {
        const message = getErrorMessage(error, "Unable to load deals.");

        setDeals([]);
        setPageError(message);
      } finally {
        setLoading(false);
      }
    },
    [businessId, pagination.limit, search, status, pipelineId, stageId, assignedTo]
  );

  useEffect(() => {
    if (businessId) {
      loadDeals(1);
    }
  }, [businessId]);

  const loadPipelines = useCallback(async () => {
    if (!businessId) return;

    setLoadingPipelines(true);

    try {
      const response = await api.get(`/pipelines/business/${businessId}`, {
        params: {
          page: 1,
          limit: 100,
          status: "ACTIVE",
        },
      });

      const rows = extractRows(response, ["pipelines"]);

      setPipelines(Array.isArray(rows) ? rows : []);
    } catch (error) {
      setPipelines([]);

      await showErrorAlert("Pipelines unavailable", getErrorMessage(error, "Unable to load pipelines."));
    } finally {
      setLoadingPipelines(false);
    }
  }, [businessId]);

  const loadStages = useCallback(
    async (selectedPipelineId) => {
      if (!businessId || !selectedPipelineId) {
        setStages([]);
        return;
      }

      setLoadingStages(true);

      try {
        const pipelineResponse = await api.get(`/pipelines/business/${businessId}/${selectedPipelineId}`);

        const pipeline = unwrap(pipelineResponse)?.pipeline || unwrap(pipelineResponse);

        let rows = pipeline?.stages || pipelineResponse?.data?.stages || [];

        if (!Array.isArray(rows)) {
          rows = [];
        }

        setStages(rows.filter((stage) => stage?.isActive !== false && stage?.active !== false));
      } catch (error) {
        setStages([]);

        await showErrorAlert("Stages unavailable", getErrorMessage(error, "Unable to load pipeline stages."));
      } finally {
        setLoadingStages(false);
      }
    },
    [businessId]
  );

  const loadContacts = useCallback(async () => {
    if (!businessId) return;

    setLoadingContacts(true);

    try {
      const response = await api.get(`/contacts/business/${businessId}`, {
        params: {
          page: 1,
          limit: 100,
        },
      });

      const rows = extractRows(response, ["contacts"]);

      setContacts(Array.isArray(rows) ? rows : []);
    } catch {
      setContacts([]);
    } finally {
      setLoadingContacts(false);
    }
  }, [businessId]);

  const loadCompanies = useCallback(async () => {
    if (!businessId) return;

    setLoadingCompanies(true);

    try {
      const response = await api.get(`/companies/business/${businessId}`, {
        params: {
          page: 1,
          limit: 100,
        },
      });

      const rows = extractRows(response, ["companies"]);

      setCompanies(Array.isArray(rows) ? rows : []);
    } catch {
      setCompanies([]);
    } finally {
      setLoadingCompanies(false);
    }
  }, [businessId]);

  const loadMembers = useCallback(async () => {
    if (!businessId) return;

    setLoadingMembers(true);

    try {
      const response = await getBusinessMembers(businessId, {
        page: 1,
        limit: 100,
      });

      const rows = extractRows(response, ["members"]);

      setMembers(Array.isArray(rows) ? rows : []);
    } catch {
      setMembers([]);

      await showErrorAlert("Users unavailable", "Unable to load business members.");
    } finally {
      setLoadingMembers(false);
    }
  }, [businessId]);

  const loadFormOptions = useCallback(async () => {
    await Promise.all([loadPipelines(), loadContacts(), loadCompanies(), loadMembers()]);
  }, [loadPipelines, loadContacts, loadCompanies, loadMembers]);

  const handlePipelineChange = async (value) => {
    setForm((current) => ({
      ...current,
      pipelineId: value,
      stageId: "",
    }));

    await loadStages(value);
  };

  const openCreate = async () => {
    setPageError("");

    setForm({
      ...EMPTY_FORM,
    });

    setModal({
      mode: "create",
    });

    await loadFormOptions();
  };

  const openEdit = async (deal) => {
    setPageError("");

    const currentPipelineId = deal?.pipelineId?._id || deal?.pipelineId?.id || deal?.pipelineId || "";

    const currentStageId = deal?.stageId?._id || deal?.stageId?.id || deal?.stageId || "";

    setForm({
      name: deal?.name || "",
      description: deal?.description || "",
      value: deal?.value !== undefined && deal?.value !== null ? String(deal.value) : "",
      currency: deal?.currency || "INR",
      expectedCloseDate: formatDateInput(deal?.expectedCloseDate),
      pipelineId: currentPipelineId,
      stageId: currentStageId,
      contactId: deal?.contactId?._id || deal?.contactId?.id || deal?.contactId || "",
      companyId: deal?.companyId?._id || deal?.companyId?.id || deal?.companyId || "",
      assignedTo: deal?.assignedTo?._id || deal?.assignedTo?.id || deal?.assignedTo || "",
      status: deal?.status || "OPEN",
      probability: deal?.probability !== undefined && deal?.probability !== null ? deal.probability : 0,
      source: deal?.source || "",
      lostReason: deal?.lostReason || "",
    });

    setModal({
      mode: "edit",
      deal,
    });

    await loadFormOptions();

    if (currentPipelineId) {
      await loadStages(currentPipelineId);
    }
  };

  const openView = async (deal) => {
    setPageError("");

    setModal({
      mode: "view",
      deal,
      loading: true,
    });

    try {
      const response = await getDealById(businessId, deal._id);

      const freshDeal = response?.data?.deal || response?.deal || response?.data || deal;

      setModal({
        mode: "view",
        deal: freshDeal,
        loading: false,
      });
    } catch (error) {
      setModal({
        mode: "view",
        deal,
        loading: false,
      });

      setPageError(getErrorMessage(error, "Unable to load the latest deal details."));
    }
  };

  const openAssign = async (deal) => {
    setAssignForm({
      assignedTo: deal?.assignedTo?._id || deal?.assignedTo?.id || deal?.assignedTo || "",
    });

    setModal({
      mode: "assign",
      deal,
    });

    await loadMembers();
  };

  const saveDeal = async () => {
    if (!businessId) return;

    if (!form.name.trim()) {
      await showErrorAlert("Deal name required", "Please enter the deal name.");
      return;
    }

    if (!form.pipelineId) {
      await showErrorAlert("Pipeline required", "Please select a pipeline.");
      return;
    }

    if (!form.stageId) {
      await showErrorAlert("Stage required", "Please select a pipeline stage.");
      return;
    }

    if (form.status === "LOST" && !String(form.lostReason || "").trim()) {
      await showErrorAlert("Lost reason required", "Please provide a lost reason for a lost deal.");
      return;
    }

    setSaving(true);
    setPageError("");

    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || null,

      value: form.value === "" ? 0 : Number(form.value),

      currency: form.currency.trim().toUpperCase() || "INR",

      expectedCloseDate: form.expectedCloseDate || null,

      pipelineId: form.pipelineId,
      stageId: form.stageId,

      contactId: form.contactId || null,
      companyId: form.companyId || null,

      assignedTo: form.assignedTo || null,

      status: form.status || "OPEN",

      probability: form.probability === "" ? 0 : Number(form.probability),

      source: form.source.trim() || null,

      lostReason: form.status === "LOST" ? form.lostReason.trim() || null : null,
    };

    try {
      if (modal?.mode === "create") {
        await createDeal(businessId, payload);

        setModal(null);

        await loadDeals(1);

        await showAuthAlert({
          icon: "success",
          title: "Deal created",
          text: "The deal has been added successfully.",
          confirmButtonText: "Done",
        });
      } else {
        await updateDeal(businessId, modal.deal._id, payload);

        setModal(null);

        await loadDeals(Number(pagination.page || 1));

        await showAuthAlert({
          icon: "success",
          title: "Deal updated",
          text: "The deal has been updated successfully.",
          confirmButtonText: "Done",
        });
      }
    } catch (error) {
      const message = getErrorMessage(error, `Unable to ${modal?.mode === "create" ? "create" : "update"} the deal.`);

      setPageError(message);

      await showErrorAlert(modal?.mode === "create" ? "Unable to create deal" : "Unable to update deal", message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (deal) => {
    const result = await showAuthAlert({
      icon: "warning",
      title: "Delete this deal?",
      text: `${getDealName(deal)} will be removed from this business.`,
      showCancelButton: true,
      confirmButtonText: "Delete deal",
      cancelButtonText: "Cancel",
    });

    if (!result?.isConfirmed) return;

    setActionLoading(true);
    setPageError("");

    try {
      await deleteDeal(businessId, deal._id);

      const currentPage = Number(pagination.page || 1);

      const shouldMoveBack = deals.length === 1 && currentPage > 1;

      await loadDeals(shouldMoveBack ? currentPage - 1 : currentPage);

      await showAuthAlert({
        icon: "success",
        title: "Deal deleted",
        text: "The deal has been removed successfully.",
        confirmButtonText: "Done",
      });
    } catch (error) {
      const message = getErrorMessage(error, "Unable to delete the deal.");

      setPageError(message);

      await showErrorAlert("Unable to delete deal", message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!businessId || !modal?.deal?._id) return;

    setActionLoading(true);
    setPageError("");

    try {
      await assignDeal(businessId, modal.deal._id, assignForm.assignedTo || null);

      setModal(null);

      await loadDeals(Number(pagination.page || 1));

      await showAuthAlert({
        icon: "success",
        title: "Assignment updated",
        text: "The deal assignment has been updated successfully.",
        confirmButtonText: "Done",
      });
    } catch (error) {
      const message = getErrorMessage(error, "Unable to update the deal assignment.");

      setPageError(message);

      await showErrorAlert("Unable to assign deal", message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleMove = async (deal, nextStageId) => {
    if (!businessId || !deal?._id || !nextStageId) return;

    setActionLoading(true);

    try {
      await moveDeal(businessId, deal._id, nextStageId);

      await loadDeals(Number(pagination.page || 1));

      await showAuthAlert({
        icon: "success",
        title: "Stage updated",
        text: "The deal has been moved successfully.",
        confirmButtonText: "Done",
      });
    } catch (error) {
      await showErrorAlert("Unable to move deal", getErrorMessage(error, "Unable to move the deal to the selected stage."));
    } finally {
      setActionLoading(false);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setPipelineId("");
    setStageId("");
    setAssignedTo("");

    setStages([]);

    loadDeals(1, {
      search: "",
      status: "",
      pipelineId: "",
      stageId: "",
      assignedTo: "",
    });
  };

  const stats = useMemo(() => {
    const total = Number(pagination.total || 0);

    const open = deals.filter((deal) => deal.status === "OPEN").length;

    const won = deals.filter((deal) => deal.status === "WON").length;

    const lost = deals.filter((deal) => deal.status === "LOST").length;

    const value = deals.reduce((sum, deal) => sum + Number(deal?.value || 0), 0);

    return [
      {
        title: "Total deals",
        value: total.toLocaleString("en-IN"),
        detail: "All matching deals",
        icon: CircleDollarSign,
        tone: "primary",
      },
      {
        title: "Open",
        value: open.toLocaleString("en-IN"),
        detail: "On current page",
        icon: Target,
        tone: "blue",
      },
      {
        title: "Won",
        value: won.toLocaleString("en-IN"),
        detail: "On current page",
        icon: CheckCircle2,
        tone: "green",
      },
      {
        title: "Lost",
        value: lost.toLocaleString("en-IN"),
        detail: "On current page",
        icon: AlertCircle,
        tone: "orange",
      },
      {
        title: "Pipeline value",
        value: formatMoney(value, "INR"),
        detail: "Current page value",
        icon: BriefcaseBusiness,
        tone: "success",
      },
    ];
  }, [deals, pagination.total]);

  const hasFilters = Boolean(search.trim()) || Boolean(status) || Boolean(pipelineId) || Boolean(stageId) || Boolean(assignedTo);

  const currentPage = Number(pagination.page || 1);

  const totalPages = Math.max(Number(pagination.totalPages || 1), 1);

  return (
    <>
      <style>{`.deals-assignee-cell,.deal-assignment-cell{min-width:230px;white-space:nowrap}.deals-assignee-cell .crm-assignee-name,.deal-assignment-cell .crm-assignee-name{white-space:nowrap;display:inline-block}.crm-assignee-name{white-space:nowrap;display:inline-flex;align-items:center;cursor:pointer;text-decoration:none;background:transparent;border:0;padding:0;margin:0;color:var(--crm-text);font:inherit;font-weight:400;line-height:1.3;text-align:left;box-shadow:none;appearance:none;-webkit-appearance:none}.crm-assignee-name:hover{background:transparent;border:0;box-shadow:none;color:var(--crm-primary);text-decoration:none}.crm-assignee-name:focus,.crm-assignee-name:focus-visible{outline:none;box-shadow:none;background:transparent}
        .deals-page{padding:28px 30px 42px;max-width:1800px;margin:0 auto;color:var(--crm-text)}
        .deals-head{display:flex;align-items:flex-end;justify-content:space-between;gap:22px;margin-bottom:22px}
        .deals-head-left{min-width:0}
        .deals-title{font-size:29px;line-height:1.15;letter-spacing:-.8px;margin:0;color:var(--crm-text);font-weight:400}
        .deals-subtitle{margin:8px 0 0;color:var(--crm-muted);font-size:13px}
        .deals-head-actions{display:flex;align-items:center;gap:9px;flex-shrink:0}
        .deals-btn{height:40px;padding:0 14px;border-radius:10px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);font-size:13px;font-weight:400;display:inline-flex;align-items:center;justify-content:center;gap:8px;transition:.18s;cursor:pointer;white-space:nowrap}
        .deals-btn:hover:not(:disabled){background:var(--crm-surface);border-color:var(--crm-border);color:var(--crm-text)}
        .deals-btn.primary{border-color:var(--crm-primary);background:var(--crm-primary);color:#fff}
        .deals-btn.primary:hover:not(:disabled){filter:none;background:var(--crm-primary);border-color:var(--crm-primary);color:#fff}
        .deals-btn.danger{color:var(--crm-danger)}
        .deals-btn:disabled{opacity:.55;cursor:not-allowed}
        .deals-btn.small{height:34px;padding:0 11px;border-radius:8px;font-size:13px}
        .deals-stats{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:14px}
        .deals-stat{position:relative;background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:15px;padding:9px 14px 8px;box-shadow:var(--crm-shadow);min-width:0}
        .deals-stat-top{display:flex;align-items:flex-start;justify-content:flex-start;margin-bottom:1px;min-height:0}
        .deals-stat-icon{position:absolute;right:14px;bottom:23px;width:34px;height:34px;border-radius:10px;background:var(--crm-primary-soft);color:var(--crm-primary);display:grid;place-items:center}
        .deals-stat-icon.green{background:color-mix(in srgb,var(--crm-success) 11%,transparent);color:var(--crm-success)}
        .deals-stat-icon.orange{background:color-mix(in srgb,var(--crm-warning) 12%,transparent);color:var(--crm-warning)}
        .deals-stat-icon.success{background:color-mix(in srgb,var(--crm-success) 11%,transparent);color:var(--crm-success)}
        .deals-stat-title{font-size:13px;color:var(--crm-muted);font-weight:400}
        .deals-stat-value{font-size:24px;letter-spacing:-.5px;font-weight:400;color:var(--crm-text);margin:1px 0 2px}
        .deals-stat-detail{font-size:13px;color:var(--crm-muted);padding-right:46px}
        .deals-main-panel{margin-top:14px;background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:15px;box-shadow:var(--crm-shadow);min-width:0;overflow:hidden}
        .deals-panel-head{display:flex;align-items:center;justify-content:space-between;gap:15px;padding:18px 20px;border-bottom:1px solid var(--crm-border)}
        .deals-panel-title{font-size:14px;font-weight:400;color:var(--crm-text)}
        .deals-panel-subtitle{font-size:13px;color:var(--crm-muted);margin-top:3px}
        .deals-panel-head-right{display:flex;align-items:center;gap:8px}
        .deals-filter-toggle{display:none}
        .deals-toolbar{padding:15px 20px;border-bottom:1px solid var(--crm-border);display:flex;align-items:center;gap:9px;flex-wrap:wrap}
        .deals-search-wrap{position:relative;flex:1;min-width:230px}
        .deals-search{width:100%;height:40px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:10px;padding:0 38px;outline:0;font-size:13px}
        .deals-search:focus{border-color:var(--crm-primary)}
        .deals-search-icon{position:absolute;left:12px;top:12px;color:var(--crm-muted);width:16px;height:16px;pointer-events:none}
        .deals-search-clear{position:absolute;right:8px;top:8px;width:24px;height:24px;border:0;border-radius:7px;background:transparent;color:var(--crm-muted);display:grid;place-items:center;cursor:pointer}
        .deals-search-clear:hover{background:var(--crm-surface-2);color:var(--crm-text)}
        .deals-filter-select{height:40px;min-width:130px;padding:0 32px 0 11px;border:1px solid var(--crm-border);border-radius:10px;background:var(--crm-surface);color:var(--crm-text);font-size:13px;font-weight:400;outline:0;cursor:pointer}
        .deals-filter-select:focus{border-color:var(--crm-primary)}
        .deals-select-box{position:relative}
        .deals-select-box svg{position:absolute;right:10px;top:13px;color:var(--crm-muted);pointer-events:none}
        .deals-filter-clear{height:40px;border:0;background:transparent;color:var(--crm-muted);font-size:13px;font-weight:400;padding:0 7px;cursor:pointer}
        .deals-filter-clear:hover{color:var(--crm-text);text-decoration:underline}
        .deals-error{margin:14px 20px 0;padding:10px 12px;border-radius:9px;background:color-mix(in srgb,var(--crm-danger) 10%,transparent);border:1px solid color-mix(in srgb,var(--crm-danger) 20%,transparent);color:var(--crm-danger);font-size:13px;display:flex;align-items:flex-start;gap:8px}
        .deals-table-wrap{width:100%;max-height:340px;overflow:auto;overscroll-behavior:contain;scrollbar-gutter:stable both-edges}
        .deals-table{width:100%;min-width:1520px;border-collapse:collapse;table-layout:auto}.deals-table th:nth-child(1),.deals-table td:nth-child(1){min-width:220px;width:220px}.deals-table th:nth-child(2),.deals-table td:nth-child(2){min-width:220px;width:220px}.deals-table th:nth-child(3),.deals-table td:nth-child(3){min-width:125px;width:125px}.deals-table th:nth-child(4),.deals-table td:nth-child(4){min-width:205px;width:205px}.deals-table th:nth-child(5),.deals-table td:nth-child(5){min-width:125px;width:125px}.deals-table th:nth-child(6),.deals-table td:nth-child(6){min-width:120px;width:120px}.deals-table th:nth-child(7),.deals-table td:nth-child(7){min-width:245px;width:245px}.deals-table th:nth-child(8),.deals-table td:nth-child(8){min-width:135px;width:135px}.deals-table th:nth-child(9),.deals-table td:nth-child(9){min-width:125px;width:125px}.deals-table th{position:sticky;top:0;z-index:3;text-align:left!important;min-width:100px;padding:13px 18px;white-space:nowrap}.deals-table th:last-child,.deals-table td:last-child{text-align:center}.deals-table tbody tr{height:56px}.deals-table td{white-space:nowrap}.deals-table th,.deals-table td{padding-left:18px;padding-right:18px}.deals-table .crm-assignee-name{white-space:nowrap;display:inline-flex;align-items:center;cursor:pointer}.deals-table th{min-width:100px}.deals-table td{white-space:nowrap}.deals-table th:last-child,.deals-table td:last-child{min-width:120px;width:120px}
        
        .deals-table td{padding:13px 18px;border-bottom:1px solid var(--crm-border);font-size:13px;color:var(--crm-text);vertical-align:middle}
        .deals-table tbody tr{transition:.15s}
        .deals-table tbody tr:hover{background:var(--crm-surface-2)}
        .deal-person{display:flex;align-items:center;gap:10px;min-width:200px}
        .deal-avatar{width:34px;height:34px;border-radius:10px;background:var(--crm-primary-soft);color:var(--crm-primary);display:grid;place-items:center;font-size:13px;font-weight:400;flex-shrink:0}
        .deal-person-main{min-width:0}
        .deal-person-name{font-size:13px;font-weight:400;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:210px}
        .deal-person-sub{font-size:13px;color:var(--crm-muted);margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:210px}
        .deal-related{display:grid;gap:5px;min-width:150px}
        .deal-related-line{display:flex;align-items:center;gap:6px;white-space:nowrap}
        .deal-related-line svg{color:var(--crm-muted);flex-shrink:0}
        .deal-value{font-weight:400;white-space:nowrap}
        .deal-stage{font-size:13px;font-weight:400;white-space:nowrap}
        .deal-probability{font-size:13px;color:var(--crm-muted)}
        .deals-status-badge{display:inline-flex;align-items:center;gap:6px;padding:5px 8px;border-radius:7px;font-size:13px;font-weight:400;white-space:nowrap}
        .deals-status-dot{width:5px;height:5px;border-radius:50%;background:currentColor}
        .deals-status-badge.open{color:var(--crm-primary);background:var(--crm-primary-soft)}
        .deals-status-badge.won{color:var(--crm-success);background:color-mix(in srgb,var(--crm-success) 12%,transparent)}
        .deals-status-badge.lost{color:var(--crm-danger);background:color-mix(in srgb,var(--crm-danger) 10%,transparent)}
        .deal-assignee{display:flex;align-items:center;gap:7px;font-size:13px;white-space:nowrap}
        .deal-assignee-avatar{width:25px;height:25px;border-radius:8px;background:var(--crm-primary-soft);color:var(--crm-primary);display:grid;place-items:center;font-size:13px;font-weight:400}
        .deal-unassigned{color:var(--crm-muted);font-size:13px}
        .deal-date{font-size:13px;color:var(--crm-muted);white-space:nowrap}
        .deal-actions{display:flex;align-items:center;gap:5px}
        .deal-action-btn{width:30px;height:30px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-muted);border-radius:8px;display:grid;place-items:center;cursor:pointer;transition:.16s}
        .deal-action-btn:hover{color:var(--crm-primary);border-color:var(--crm-primary);background:var(--crm-primary-soft)}
        .deal-action-btn.danger:hover{color:var(--crm-danger);border-color:var(--crm-danger);background:color-mix(in srgb,var(--crm-danger) 8%,transparent)}
        .deals-empty{padding:58px 20px;text-align:center;color:var(--crm-muted);display:flex;align-items:center;flex-direction:column}
        .deals-empty-icon{width:52px;height:52px;border-radius:15px;background:var(--crm-primary-soft);color:var(--crm-primary);display:grid;place-items:center;margin-bottom:13px}
        .deals-empty-title{font-size:14px;font-weight:400;color:var(--crm-text)}
        .deals-empty-text{max-width:390px;font-size:13px;line-height:1.6;margin:5px 0 16px}
        .deals-pagination{display:flex;align-items:center;justify-content:space-between;gap:15px;padding:13px 18px;border-top:1px solid var(--crm-border)}
        .deals-pagination-info{font-size:13px;color:var(--crm-muted)}
        .deals-pagination-actions{display:flex;align-items:center;gap:6px}
        .deals-page-number{font-size:13px;color:var(--crm-muted);padding:0 7px}
        .deals-pagination-btn{height:32px;padding:0 10px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:8px;font-size:13px;font-weight:400;display:flex;align-items:center;gap:5px;cursor:pointer}
        .deals-pagination-btn:hover:not(:disabled){border-color:var(--crm-primary);color:var(--crm-primary)}
        .deals-pagination-btn:disabled{opacity:.45;cursor:not-allowed}
        .deals-loading{display:flex;align-items:center;justify-content:center;gap:9px;padding:60px 20px;color:var(--crm-muted);font-size:13px}
        .deals-spinner{width:17px;height:17px;border:2px solid var(--crm-border);border-top-color:var(--crm-primary);border-radius:50%;animation:deals-spin .75s linear infinite;display:inline-block}
        .deals-spinner.small{width:13px;height:13px;border-width:2px}
        .deals-refresh-spin{animation:deals-spin .75s linear infinite}
        @keyframes deals-spin{to{transform:rotate(360deg)}}
        .deals-modal-backdrop{position:fixed;inset:0;background:rgba(15,23,42,.52);display:grid;place-items:center;padding:20px;z-index:1000;backdrop-filter:blur(3px)}
        .deals-modal{width:min(700px,100%);max-height:92vh;overflow:hidden;background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:16px;box-shadow:0 30px 90px rgba(0,0,0,.28);display:flex;flex-direction:column}
        .deals-modal.large{width:min(820px,100%)}
        .deals-modal.compact{width:min(520px,100%)}
        .deals-modal-head{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:18px 20px;border-bottom:1px solid var(--crm-border);flex-shrink:0}
        .deals-modal-title-wrap{min-width:0}
        .deals-modal-eyebrow{font-size:13px;color:var(--crm-primary);font-weight:400;text-transform:uppercase;letter-spacing:.1em;margin-bottom:4px}
        .deals-modal-title{margin:0;font-size:16px;font-weight:400;color:var(--crm-text)}
        .deals-modal-subtitle{margin:4px 0 0;font-size:13px;color:var(--crm-muted)}
        .deals-modal-close{width:32px;height:32px;border:0;background:transparent;color:var(--crm-muted);border-radius:8px;display:grid;place-items:center;cursor:pointer}
        .deals-modal-close:hover{background:var(--crm-surface-2);color:var(--crm-text)}
        .deals-modal-body{overflow:auto}
        .deals-form{padding:20px;display:grid;grid-template-columns:1fr 1fr;gap:15px}
        .deals-form-section{min-width:0}
        .deals-form-section.full{grid-column:1/-1}
        .deals-form-section-spaced{margin-top:4px}
        .deals-form-section-title{display:flex;align-items:center;gap:7px;color:var(--crm-text);font-size:13px;font-weight:400}
        .deals-form-section-title svg{color:var(--crm-primary)}
        .deals-form-section-subtitle{font-size:13px;color:var(--crm-muted);margin-top:4px}
        .deals-field{display:grid;gap:6px;min-width:0}
        .deals-field.full{grid-column:1/-1}
        .deals-field label{font-size:13px;font-weight:400;color:var(--crm-text)}
        .deals-field input,.deals-field select,.deals-field textarea{width:100%;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:9px;padding:10px 11px;outline:0;font-size:13px;box-sizing:border-box}
        .deals-field input:focus,.deals-field select:focus,.deals-field textarea:focus{border-color:var(--crm-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--crm-primary) 9%,transparent)}
        .deals-field textarea{resize:vertical;min-height:110px;line-height:1.55}
        .deals-select-wrap{position:relative}
        .deals-select-wrap select{appearance:none;padding-right:34px}
        .deals-select-wrap svg{position:absolute;right:11px;top:12px;color:var(--crm-muted);pointer-events:none}
        .deals-input-icon-wrap{position:relative}
        .deals-input-icon-wrap svg{position:absolute;left:11px;top:11px;color:var(--crm-muted);pointer-events:none}
        .deals-input-icon-wrap input{padding-left:33px}
        .deals-search-select{position:relative;width:100%}
        .deals-search-select-trigger{width:100%;min-height:40px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:9px;padding:0 11px;display:flex;align-items:center;gap:8px;text-align:left;cursor:pointer;font-size:13px}
        .deals-search-select-trigger:hover:not(:disabled){border-color:var(--crm-primary);background:var(--crm-surface-2)}
        .deals-search-select-trigger span{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .deals-search-select-trigger svg:last-child{margin-left:auto;color:var(--crm-muted)}
        .deals-search-select-trigger:disabled{opacity:.6;cursor:not-allowed}
        .deals-search-select-menu{position:absolute;left:0;right:0;top:calc(100% + 5px);z-index:100;max-height:280px;overflow:auto;background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:10px;box-shadow:0 16px 40px rgba(0,0,0,.2);padding:6px}
        .deals-search-select-search{position:sticky;top:0;z-index:2;display:flex;align-items:center;gap:7px;padding:7px;border:1px solid var(--crm-border);background:var(--crm-surface-2);border-radius:8px;margin-bottom:5px}
        .deals-search-select-search svg{color:var(--crm-muted);flex-shrink:0}
        .deals-search-select-search input{flex:1!important;width:100%!important;min-width:0!important;border:0!important;background:transparent!important;box-shadow:none!important;padding:4px!important;color:var(--crm-text)}
        .deals-search-select-search button{width:22px;height:22px;border:0;background:transparent;color:var(--crm-muted);display:grid;place-items:center;cursor:pointer}
        .deals-search-select-option{width:100%;border:0;background:transparent;color:var(--crm-text);display:flex;align-items:center;gap:9px;padding:9px;border-radius:8px;text-align:left;cursor:pointer}
        .deals-search-select-option:hover,.deals-search-select-option.selected{background:color-mix(in srgb,var(--crm-primary) 9%,transparent);color:var(--crm-primary)}
        .deals-search-select-option span{min-width:0;display:grid;gap:2px}
        .deals-search-select-option strong{font-size:13px;font-weight:400;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .deals-search-select-option small{font-size:13px;color:var(--crm-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .deals-search-select-empty{padding:18px 10px;text-align:center;color:var(--crm-muted);font-size:13px}
        .deals-modal-footer{display:flex;align-items:center;justify-content:flex-end;gap:8px;padding:14px 20px;border-top:1px solid var(--crm-border);flex-shrink:0}
        .deals-view{padding:20px}
        .deals-profile-card{display:flex;align-items:center;gap:13px;padding:15px;border:1px solid var(--crm-border);background:var(--crm-surface-2);border-radius:12px}
        .deals-profile-avatar{width:46px;height:46px;border-radius:13px;background:var(--crm-primary-soft);color:var(--crm-primary);display:grid;place-items:center;font-size:13px;font-weight:400;flex-shrink:0}
        .deals-profile-name{font-size:15px;font-weight:400;color:var(--crm-text)}
        .deals-profile-company{font-size:13px;color:var(--crm-muted);margin-top:4px}
        .deals-profile-badges{display:flex;align-items:center;gap:6px;margin-left:auto;flex-wrap:wrap;justify-content:flex-end}
        .deals-view-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:14px}
        .deals-view-item{padding:12px;border:1px solid var(--crm-border);border-radius:10px;background:var(--crm-surface)}
        .deals-view-item.full{grid-column:1/-1}
        .deals-view-label{font-size:13px;text-transform:uppercase;letter-spacing:.07em;color:var(--crm-muted);font-weight:400}
        .deals-view-value{font-size:13px;color:var(--crm-text);font-weight:400;margin-top:5px;word-break:break-word}
        .deals-description{line-height:1.6;white-space:pre-wrap;font-weight:400}
        .deals-action-content{padding:20px}
        .deals-action-message{font-size:13px;color:var(--crm-text);line-height:1.6;margin:0 0 15px}
        .deals-action-message strong{font-weight:400}
        .deals-action-note{font-size:13px;color:var(--crm-muted);line-height:1.55;margin-top:8px}
        .deals-action-field{display:grid;gap:6px;margin-top:12px}
        .deals-action-field label{font-size:13px;font-weight:400;color:var(--crm-text)}
        .deals-table .crm-assignee-name{white-space:nowrap;display:inline-flex;align-items:center;cursor:pointer}@media(max-width:1250px){.deals-stats{grid-template-columns:repeat(3,minmax(0,1fr))}}
        @media(max-width:900px){.deals-stats{grid-template-columns:repeat(2,minmax(0,1fr))}.deals-head{align-items:flex-start;flex-direction:column}.deals-head-actions{width:100%}}
        @media(max-width:700px){.deals-page{padding:20px 15px 30px}.deals-title{font-size:23px}.deals-head-actions{flex-wrap:wrap}.deals-head-actions .deals-btn{flex:1}.deals-stats{grid-template-columns:1fr}.deals-panel-head{align-items:flex-start}.deals-panel-head-right{width:100%}.deals-filter-toggle{display:inline-flex}.deals-toolbar{display:none}.deals-toolbar.open{display:flex;flex-direction:column;align-items:stretch}.deals-search-wrap{min-width:0}.deals-filter-select{width:100%}.deals-select-box{width:100%}.deals-filter-clear{text-align:left}.deals-pagination{align-items:flex-start;flex-direction:column}.deals-pagination-actions{width:100%;justify-content:space-between}.deals-form{grid-template-columns:1fr;padding:17px}.deals-field.full{grid-column:auto}.deals-profile-card{align-items:flex-start;flex-wrap:wrap}.deals-profile-badges{margin-left:0;justify-content:flex-start;width:100%}.deals-view-grid{grid-template-columns:1fr}.deals-view-item.full{grid-column:auto}.deals-modal-backdrop{padding:10px}.deals-modal{max-height:95vh}.deals-modal-footer{padding:12px 17px}.deals-modal-footer .deals-btn{flex:1}}
      .deals-table thead th{text-align:left!important;padding-left:20px;padding-right:20px;white-space:nowrap}.deals-table tbody td{padding-left:20px;padding-right:20px}.deals-table td:last-child{text-align:center}`}</style>

      <section className="deals-page">
        <div className="deals-head">
          <div className="deals-head-left">
            <h1 className="deals-title">Deals</h1>

            <p className="deals-subtitle">Manage opportunities, pipeline stages and revenue from one place.</p>
          </div>

          <div className="deals-head-actions">
            <button type="button" className="deals-btn" onClick={() => loadDeals(1)} disabled={loading}>
              <RefreshCw size={14} className={loading ? "deals-refresh-spin" : ""} />
              {loading ? "Refreshing..." : "Refresh"}
            </button>

            <button type="button" className="deals-btn primary" onClick={openCreate}>
              <Plus size={15} />
              Add deal
            </button>
          </div>
        </div>

        <div className="deals-stats">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <article className="deals-stat" key={stat.title}>
                <div className="deals-stat-top">
                  <div className={`deals-stat-icon ${stat.tone}`}>
                    <Icon size={19} />
                  </div>
                </div>

                <div className="deals-stat-title">{stat.title}</div>

                <div className="deals-stat-value">{stat.value}</div>

                <div className="deals-stat-detail">{stat.detail}</div>
              </article>
            );
          })}
        </div>

        <section className="deals-main-panel">
          <div className={`deals-toolbar ${mobileFilters ? "open" : ""}`}>
            <div className="deals-search-wrap">
              <Search className="deals-search-icon" />

              <input
                className="deals-search"
                value={search}
                onChange={(event) => {
                  const value = event.target.value;

                  setSearch(value);

                  loadDeals(1, {
                    search: value,
                  });
                }}
                placeholder="Search deals..."
              />

              {search && (
                <button
                  type="button"
                  className="deals-search-clear"
                  onClick={() => {
                    setSearch("");

                    loadDeals(1, {
                      search: "",
                    });
                  }}>
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="deals-select-box">
              <select
                className="deals-filter-select"
                value={status}
                onChange={(event) => {
                  const value = event.target.value;

                  setStatus(value);

                  loadDeals(1, {
                    status: value,
                  });
                }}>
                <option value="">All statuses</option>

                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <ChevronDown size={13} />
            </div>

            <div className="deals-select-box">
              <select
                className="deals-filter-select"
                value={pipelineId}
                onChange={async (event) => {
                  const value = event.target.value;

                  setPipelineId(value);
                  setStageId("");

                  await loadStages(value);

                  loadDeals(1, {
                    pipelineId: value,
                    stageId: "",
                  });
                }}>
                <option value="">All pipelines</option>

                {pipelines.map((pipeline) => {
                  const id = getId(pipeline);

                  return id ? (
                    <option key={id} value={id}>
                      {pipelineName(pipeline)}
                    </option>
                  ) : null;
                })}
              </select>

              <ChevronDown size={13} />
            </div>

            {pipelineId && (
              <div className="deals-select-box">
                <select
                  className="deals-filter-select"
                  value={stageId}
                  onChange={(event) => {
                    const value = event.target.value;

                    setStageId(value);

                    loadDeals(1, {
                      stageId: value,
                    });
                  }}>
                  <option value="">All stages</option>

                  {stages.map((stage) => {
                    const id = stageId(stage);

                    return id ? (
                      <option key={id} value={id}>
                        {stageName(stage)}
                      </option>
                    ) : null;
                  })}
                </select>

                <ChevronDown size={13} />
              </div>
            )}

            {hasFilters && (
              <button type="button" className="deals-filter-clear" onClick={clearFilters}>
                Reset
              </button>
            )}
          </div>

          {(pageError || businessError) && (
            <div className="deals-error">
              <AlertCircle size={15} />

              <span>{pageError || businessError || "Unable to load deals."}</span>
            </div>
          )}

          <div className="deals-table-wrap">
            <table className="deals-table">
              <thead>
                <tr>
                  <th>Deal</th>
                  <th>Contact / Company</th>
                  <th>Value</th>
                  <th>Pipeline / Stage</th>
                  <th>Status</th>
                  <th>Probability</th>
                  <th>Assigned to</th>
                  <th>Close date</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading || businessLoading ? (
                  <tr>
                    <td colSpan={9}>
                      <div className="deals-loading">
                        <span className="deals-spinner" />
                        Loading deals...
                      </div>
                    </td>
                  </tr>
                ) : deals.length === 0 ? (
                  <tr>
                    <td colSpan={9}>
                      <div className="deals-empty">
                        <div className="deals-empty-icon">
                          <CircleDollarSign size={23} />
                        </div>

                        <div className="deals-empty-title">{hasFilters ? "No deals found" : "No deals yet"}</div>

                        <div className="deals-empty-text">{hasFilters ? "Try changing your search or filters to find matching deals." : "Start building your sales pipeline by adding your first deal."}</div>

                        {!hasFilters && (
                          <button type="button" className="deals-btn primary" onClick={openCreate}>
                            <Plus size={15} />
                            Add first deal
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  deals.map((deal) => {
                    const assigned = deal?.assignedTo;

                    const assignedName = assigned?.name || assigned?.fullName || assigned?.email || (typeof assigned === "string" ? assigned : "");

                    const pipeline = deal?.pipelineId;

                    const stage = deal?.stageId;

                    const contact = deal?.contactId;

                    const company = deal?.companyId;

                    return (
                      <tr key={deal._id}>
                        <td>
                          <div className="deal-person">
                            <div className="deal-avatar">{getDealInitials(deal)}</div>

                            <div className="deal-person-main">
                              <div className="deal-person-name">{getDealName(deal)}</div>

                              <div className="deal-person-sub">{formatSource(deal?.source)}</div>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div className="deal-related">
                            <div className="deal-related-line">
                              <UsersRound size={11} />
                              {contact ? contactName(contact) : "No contact"}
                            </div>

                            <div className="deal-related-line">
                              <Building2 size={11} />
                              {company ? companyName(company) : "No company"}
                            </div>
                          </div>
                        </td>

                        <td>
                          <div className="deal-value">{formatMoney(deal?.value, deal?.currency || "INR")}</div>
                        </td>

                        <td>
                          <div className="deal-related">
                            <div className="deal-stage">{pipeline ? pipelineName(pipeline) : "No pipeline"}</div>

                            <div className="deal-related-line">
                              <Target size={11} />
                              {stage ? stageName(stage) : "No stage"}
                            </div>
                          </div>
                        </td>

                        <td>
                          <StatusBadge status={deal?.status} />
                        </td>

                        <td>
                          <span className="deal-probability">{Number(deal?.probability || 0)}%</span>
                        </td>

                        <td>
                          {assignedName ? (
                            <div className="deal-assignee">
                              <span className="deal-assignee-avatar">{String(assignedName).slice(0, 2).toUpperCase()}</span>

                              <button type="button" className="crm-assignee-name" onClick={() => assigned && typeof assigned === "object" && setAssigneeDetail({ type: "user", name: assignedName, email: assigned?.email || "" })}>
                                {assignedName}
                              </button>
                            </div>
                          ) : (
                            <span className="deal-unassigned">Unassigned</span>
                          )}
                        </td>

                        <td>
                          <span className="deal-date">{formatDate(deal?.expectedCloseDate)}</span>
                        </td>

                        <td>
                          <div className="deal-actions">
                            <button type="button" className="deal-action-btn" title="View deal" onClick={() => navigate(`/deals/${deal._id}`)}>
                              <Eye size={14} />
                            </button>

                            <button type="button" className="deal-action-btn" title="Edit deal" onClick={() => openEdit(deal)}>
                              <Pencil size={14} />
                            </button>

                            <button type="button" className="deal-action-btn" title="Assign deal" onClick={() => openAssign(deal)}>
                              <UserCheck size={14} />
                            </button>

                            {canManage && (
                              <button type="button" className="deal-action-btn danger" title="Delete deal" disabled={actionLoading} onClick={() => handleDelete(deal)}>
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="deals-pagination">
            <div className="deals-pagination-info">
              Showing {deals.length ? (currentPage - 1) * Number(pagination.limit || 10) + 1 : 0} - {(currentPage - 1) * Number(pagination.limit || 10) + deals.length} of {Number(pagination.total || deals.length).toLocaleString("en-IN")} deals
            </div>

            <div className="deals-pagination-actions">
              <button type="button" className="deals-pagination-btn" disabled={loading || currentPage <= 1} onClick={() => loadDeals(currentPage - 1)}>
                <ChevronLeft size={13} />
                Previous
              </button>

              <span className="deals-page-number">
                Page {currentPage} of {totalPages}
              </span>

              <button type="button" className="deals-pagination-btn" disabled={loading || currentPage >= totalPages} onClick={() => loadDeals(currentPage + 1)}>
                Next
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        </section>
      </section>

      {modal && (
        <div
          className="deals-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !saving && !actionLoading) {
              setModal(null);
            }
          }}>
          <div className={`deals-modal ${modal.mode === "view" ? "large" : ""} ${modal.mode === "assign" ? "compact" : ""}`}>
            <div className="deals-modal-head">
              <div className="deals-modal-title-wrap">
                <div className="deals-modal-eyebrow">{modal.mode === "create" ? "New opportunity" : modal.mode === "edit" ? "Deal management" : modal.mode === "assign" ? "Deal assignment" : "Deal details"}</div>

                <h2 className="deals-modal-title">{modal.mode === "create" ? "Add deal" : modal.mode === "edit" ? "Edit deal" : modal.mode === "assign" ? "Assign deal" : getDealName(modal.deal)}</h2>

                {modal.mode === "view" && modal.deal?.description && <p className="deals-modal-subtitle">{modal.deal.description}</p>}
              </div>

              <button type="button" className="deals-modal-close" disabled={saving || actionLoading} onClick={() => setModal(null)}>
                <X size={17} />
              </button>
            </div>

            <div className="deals-modal-body">
              {modal.mode === "create" || modal.mode === "edit" ? (
                <DealForm
                  form={form}
                  setForm={setForm}
                  pipelines={pipelines}
                  stages={stages}
                  contacts={contacts}
                  companies={companies}
                  members={members}
                  loadingPipelines={loadingPipelines}
                  loadingStages={loadingStages}
                  loadingContacts={loadingContacts}
                  loadingCompanies={loadingCompanies}
                  loadingMembers={loadingMembers}
                  saving={saving}
                  onPipelineChange={handlePipelineChange}
                />
              ) : modal.mode === "view" ? (
                modal.loading ? (
                  <div className="deals-loading">
                    <span className="deals-spinner" />
                    Loading latest deal details...
                  </div>
                ) : (
                  <div className="deals-view">
                    <div className="deals-profile-card">
                      <div className="deals-profile-avatar">{getDealInitials(modal.deal)}</div>

                      <div>
                        <div className="deals-profile-name">{getDealName(modal.deal)}</div>

                        <div className="deals-profile-company">{modal.deal?.companyId ? companyName(modal.deal.companyId) : "Sales opportunity"}</div>
                      </div>

                      <div className="deals-profile-badges">
                        <StatusBadge status={modal.deal?.status} />
                      </div>
                    </div>

                    <div className="deals-view-grid">
                      <div className="deals-view-item">
                        <div className="deals-view-label">Deal value</div>

                        <div className="deals-view-value">{formatMoney(modal.deal?.value, modal.deal?.currency || "INR")}</div>
                      </div>

                      <div className="deals-view-item">
                        <div className="deals-view-label">Probability</div>

                        <div className="deals-view-value">{Number(modal.deal?.probability || 0)}%</div>
                      </div>

                      <div className="deals-view-item">
                        <div className="deals-view-label">Pipeline</div>

                        <div className="deals-view-value">{modal.deal?.pipelineId ? pipelineName(modal.deal.pipelineId) : "—"}</div>
                      </div>

                      <div className="deals-view-item">
                        <div className="deals-view-label">Stage</div>

                        <div className="deals-view-value">{modal.deal?.stageId ? stageName(modal.deal.stageId) : "—"}</div>
                      </div>

                      <div className="deals-view-item">
                        <div className="deals-view-label">Contact</div>

                        <div className="deals-view-value">{modal.deal?.contactId ? contactName(modal.deal.contactId) : "—"}</div>
                      </div>

                      <div className="deals-view-item">
                        <div className="deals-view-label">Company</div>

                        <div className="deals-view-value">{modal.deal?.companyId ? companyName(modal.deal.companyId) : "—"}</div>
                      </div>

                      <div className="deals-view-item">
                        <div className="deals-view-label">Assigned user</div>

                        <div className="deals-view-value">{modal.deal?.assignedTo ? memberName(modal.deal.assignedTo) : "Unassigned"}</div>
                      </div>

                      <div className="deals-view-item">
                        <div className="deals-view-label">Expected close</div>

                        <div className="deals-view-value">{formatDate(modal.deal?.expectedCloseDate)}</div>
                      </div>

                      <div className="deals-view-item">
                        <div className="deals-view-label">Source</div>

                        <div className="deals-view-value">{formatSource(modal.deal?.source)}</div>
                      </div>

                      <div className="deals-view-item">
                        <div className="deals-view-label">Created</div>

                        <div className="deals-view-value">{formatDate(modal.deal?.createdAt)}</div>
                      </div>

                      <div className="deals-view-item">
                        <div className="deals-view-label">Updated</div>

                        <div className="deals-view-value">{formatDate(modal.deal?.updatedAt)}</div>
                      </div>

                      <div className="deals-view-item full">
                        <div className="deals-view-label">Description</div>

                        <div className="deals-view-value deals-description">{modal.deal?.description || "No description added."}</div>
                      </div>

                      {modal.deal?.lostReason && (
                        <div className="deals-view-item full">
                          <div className="deals-view-label">Lost reason</div>

                          <div className="deals-view-value deals-description">{modal.deal.lostReason}</div>
                        </div>
                      )}
                    </div>

                    <div className="deals-modal-footer">
                      <button type="button" className="deals-btn" onClick={() => setModal(null)}>
                        Close
                      </button>

                      <button type="button" className="deals-btn" onClick={() => openEdit(modal.deal)}>
                        <Pencil size={14} />
                        Edit
                      </button>

                      <button type="button" className="deals-btn primary" onClick={() => openAssign(modal.deal)}>
                        <UserCheck size={14} />
                        Assign
                      </button>
                    </div>
                  </div>
                )
              ) : (
                <AssignDealContent deal={modal.deal} assignForm={assignForm} setAssignForm={setAssignForm} members={members} loadingMembers={loadingMembers} actionLoading={actionLoading} onCancel={() => setModal(null)} onSubmit={handleAssign} />
              )}
            </div>

            {(modal.mode === "create" || modal.mode === "edit") && (
              <div className="deals-modal-footer">
                <button type="button" className="deals-btn" disabled={saving} onClick={() => setModal(null)}>
                  Cancel
                </button>

                <button type="button" className="deals-btn primary" disabled={saving} onClick={saveDeal}>
                  {saving ? (
                    <>
                      <span className="deals-spinner small" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check size={15} />
                      {modal.mode === "create" ? "Create deal" : "Save changes"}
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {assigneeDetail ? <AssigneeDetailsPopup detail={assigneeDetail} onClose={() => setAssigneeDetail(null)} /> : null}
    </>
  );
}
