import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Eye,
  Filter,
  Flame,
  Mail,
  MoreHorizontal,
  Pencil,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Target,
  Trash2,
  UserCheck,
  UserPlus,
  UsersRound,
  X,
  XCircle,
} from "lucide-react";

import useBusiness from "../../hooks/useBusiness";
import AssigneeDetailsPopup from "../../components/crm/AssigneeDetailsPopup";

import { assignLead, convertLead, createLead, deleteLead, getLeadById, getLeads, updateLead } from "../../api/lead.api";
import { getBusinessMembers } from "../../api/crm.api";
import { getTeams } from "../../api/operations.api";
import api from "../../api/api";

import { showAuthAlert } from "../../components/auth/authAlert";
import { hasPermission, PERMISSIONS, isManagementRole } from "../../utils/permissions";

const STATUS_OPTIONS = [
  { value: "NEW", label: "New" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "QUALIFIED", label: "Qualified" },
  { value: "UNQUALIFIED", label: "Unqualified" },
  { value: "CONVERTED", label: "Converted" },
  { value: "LOST", label: "Lost" },
];

const RATING_OPTIONS = [
  { value: "HOT", label: "Hot" },
  { value: "WARM", label: "Warm" },
  { value: "COLD", label: "Cold" },
];

const SOURCE_OPTIONS = [
  { value: "", label: "All sources" },
  { value: "website", label: "Website" },
  { value: "referral", label: "Referral" },
  { value: "social media", label: "Social Media" },
  { value: "campaign", label: "Campaign" },
  { value: "import", label: "Import" },
  { value: "manual", label: "Manual" },
];

const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  name: "",
  email: "",
  phone: "",
  companyName: "",
  jobTitle: "",
  source: "website",
  status: "NEW",
  rating: "WARM",
  description: "",
  tags: [],
  customFields: "",
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

function normaliseTags(value) {
  if (Array.isArray(value))
    return value
      .map((item) => (typeof item === "string" ? item : item?._id || item?.id || ""))
      .filter(Boolean)
      .join(", ");
  return String(value || "");
}

function normaliseCustomFields(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return "";
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return "";
  }
}

function parseTags(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseCustomFields(value) {
  const raw = String(value || "").trim();
  if (!raw) return {};

  // Keep the form simple for CRM users: plain text is stored safely
  // inside the backend's object-based customFields structure.
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed;
    }
  } catch {
    // Plain text is intentionally supported.
  }

  return { notes: raw };
}

function getLeadName(lead) {
  const displayName = String(lead?.name || "").trim();

  if (displayName) return displayName;

  const fullName = [lead?.firstName, lead?.lastName].filter(Boolean).join(" ").trim();

  return fullName || "Unnamed lead";
}

function getInitials(lead) {
  const name = getLeadName(lead);

  const parts = name.split(/\s+/).filter(Boolean).slice(0, 2);

  if (!parts.length) return "LD";

  return parts
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function getAssignedUserName(value) {
  const user = value && typeof value === "object" ? value : null;
  if (!user) return typeof value === "string" ? value : "";
  return [user.firstName, user.lastName].filter(Boolean).join(" ").trim() || user.name || user.fullName || user.email || "";
}

function getAssignedTeamName(value) {
  const team = value && typeof value === "object" ? value : null;
  if (!team) return typeof value === "string" ? value : "";
  return team.name || team.title || team.teamName || team.slug || "";
}

function getLeadTagNames(value, options = []) {
  if (!Array.isArray(value)) return [];

  return value
    .map((tag) => {
      if (typeof tag === "object") {
        return getTagName(tag);
      }

      const matchedTag = options.find((item) => String(getTagId(item)) === String(tag));

      return matchedTag ? getTagName(matchedTag) : "";
    })
    .filter(Boolean);
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

function formatSource(value) {
  if (!value) return "—";

  return String(value)
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function statusLabel(status) {
  return STATUS_OPTIONS.find((option) => option.value === status)?.label || status || "—";
}

function ratingLabel(rating) {
  return RATING_OPTIONS.find((option) => option.value === rating)?.label || rating || "—";
}

function StatusBadge({ status }) {
  const safeStatus = String(status || "NEW").toUpperCase();

  return (
    <span className={`lead-status-badge ${safeStatus.toLowerCase()}`}>
      <span className="lead-status-dot" />
      {statusLabel(safeStatus)}
    </span>
  );
}

function RatingBadge({ rating }) {
  const safeRating = String(rating || "WARM").toUpperCase();

  return (
    <span className={`lead-rating-badge ${safeRating.toLowerCase()}`}>
      {safeRating === "HOT" && <Flame size={11} />}
      {safeRating}
    </span>
  );
}

function EmptyState({ search, onAdd }) {
  return (
    <div className="leads-empty">
      <div className="leads-empty-icon">
        <UsersRound size={23} />
      </div>

      <div className="leads-empty-title">{search ? "No leads found" : "No leads yet"}</div>

      <div className="leads-empty-text">{search ? "Try changing your search or filters to find matching leads." : "Start building your pipeline by adding your first lead."}</div>

      {!search && (
        <button type="button" className="leads-btn primary" onClick={onAdd}>
          <Plus size={15} />
          Add first lead
        </button>
      )}
    </div>
  );
}

function getTagId(tag) {
  if (typeof tag === "string") return tag;
  return tag?._id || tag?.id || tag?.tagId || "";
}
function getTagName(tag) {
  return tag?.name || tag?.title || tag?.label || tag?.slug || "Unnamed tag";
}
function normalizeTagIds(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((tag) => (typeof tag === "string" ? tag : getTagId(tag)))
    .filter(Boolean)
    .map(String);
}
function TagDropdown({ value = [], options = [], loading, disabled, onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const close = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);
  const selected = normalizeTagIds(value);
  const filtered = options.filter((tag) => `${getTagName(tag)} ${tag?.slug || ""}`.toLowerCase().includes(query.trim().toLowerCase()));
  const selectedOptions = selected.map((id) => options.find((tag) => String(getTagId(tag)) === id)).filter(Boolean);
  const toggle = (tag) => {
    const id = String(getTagId(tag));
    if (!id) return;
    onChange(selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id]);
  };
  return (
    <div className="leads-tag-select" ref={ref}>
      <button type="button" className="leads-tag-trigger" disabled={disabled} onClick={() => setOpen((v) => !v)}>
        <span className="leads-tag-trigger-text">{selectedOptions.length ? selectedOptions.map(getTagName).join(", ") : loading ? "Loading tags..." : "Select tags"}</span>
        <ChevronDown size={14} />
      </button>
      {selectedOptions.length > 0 && (
        <div className="leads-selected-tags">
          {selectedOptions.map((tag) => (
            <span className="leads-tag-chip" key={String(getTagId(tag))}>
              {getTagName(tag)}
              <button type="button" onClick={() => toggle(tag)}>
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
      )}
      {open && (
        <div className="leads-dropdown-menu">
          <div className="leads-dropdown-search">
            <Search size={13} />
            <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tags..." />
            {query && (
              <button type="button" onClick={() => setQuery("")}>
                <X size={12} />
              </button>
            )}
          </div>
          {loading ? (
            <div className="leads-dropdown-empty">
              <span className="leads-spinner small" /> Loading tags...
            </div>
          ) : filtered.length ? (
            filtered.map((tag) => {
              const id = String(getTagId(tag));
              const checked = selected.includes(id);
              return (
                <button type="button" className={`leads-dropdown-option ${checked ? "selected" : ""}`} key={id} onClick={() => toggle(tag)}>
                  <span className={`leads-check ${checked ? "checked" : ""}`}>{checked && <Check size={11} />}</span>
                  <span>
                    <strong>{getTagName(tag)}</strong>
                    {tag?.slug && tag.slug !== getTagName(tag) && <small>{tag.slug}</small>}
                  </span>
                </button>
              );
            })
          ) : (
            <div className="leads-dropdown-empty">No tags found.</div>
          )}
        </div>
      )}
    </div>
  );
}

function LeadForm({ form, setForm, onSubmit, onCancel, saving, mode, tags, tagsLoading }) {
  const update = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  return (
    <>
      <div className="leads-form">
        <div className="leads-form-section full">
          <div className="leads-form-section-title">
            <UserPlus size={15} />
            Basic information
          </div>

          <div className="leads-form-section-subtitle">Add the primary details of this prospect.</div>
        </div>

        <div className="leads-field">
          <label>First name</label>

          <input value={form.firstName} onChange={(event) => update("firstName", event.target.value)} placeholder="Rahul" autoComplete="off" />
        </div>

        <div className="leads-field">
          <label>Last name</label>

          <input value={form.lastName} onChange={(event) => update("lastName", event.target.value)} placeholder="Sharma" autoComplete="off" />
        </div>

        <div className="leads-field full">
          <label>Display name</label>

          <input value={form.name} onChange={(event) => update("name", event.target.value)} placeholder="Optional display name" autoComplete="off" />

          <span className="leads-field-help">Leave blank to use first name + last name.</span>
        </div>

        <div className="leads-field">
          <label>Email</label>

          <div className="leads-input-icon-wrap">
            <Mail size={14} />

            <input type="email" value={form.email} onChange={(event) => update("email", event.target.value)} placeholder="rahul@example.com" autoComplete="off" />
          </div>
        </div>

        <div className="leads-field">
          <label>Phone</label>

          <div className="leads-input-icon-wrap">
            <Phone size={14} />

            <input value={form.phone} onChange={(event) => update("phone", event.target.value)} placeholder="+91 99999 99999" autoComplete="off" />
          </div>
        </div>

        <div className="leads-form-section full leads-form-section-spaced">
          <div className="leads-form-section-title">
            <BriefcaseBusiness size={15} />
            Business details
          </div>

          <div className="leads-form-section-subtitle">Add company and professional information.</div>
        </div>

        <div className="leads-field">
          <label>Company</label>

          <input value={form.companyName} onChange={(event) => update("companyName", event.target.value)} placeholder="Company name" autoComplete="off" />
        </div>

        <div className="leads-field">
          <label>Job title</label>

          <input value={form.jobTitle} onChange={(event) => update("jobTitle", event.target.value)} placeholder="Sales Manager" autoComplete="off" />
        </div>

        <div className="leads-field">
          <label>Lead source</label>

          <div className="leads-select-wrap">
            <select value={form.source} onChange={(event) => update("source", event.target.value)}>
              {SOURCE_OPTIONS.filter((option) => option.value).map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <ChevronDown size={14} />
          </div>
        </div>

        <div className="leads-field">
          <label>Status</label>

          <div className="leads-select-wrap">
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

        <div className="leads-field">
          <label>Rating</label>

          <div className="leads-select-wrap">
            <select value={form.rating} onChange={(event) => update("rating", event.target.value)}>
              {RATING_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <ChevronDown size={14} />
          </div>
        </div>

        <div className="leads-form-section full leads-form-section-spaced">
          <div className="leads-form-section-title">
            <Target size={15} />
            Notes
          </div>

          <div className="leads-form-section-subtitle">Add useful context for your sales team.</div>
        </div>

        <div className="leads-field full">
          <label>Description</label>

          <textarea rows={5} value={form.description} onChange={(event) => update("description", event.target.value)} placeholder="Add notes, requirements, conversation context..." />
        </div>

        <div className="leads-field full">
          <label>Tags</label>
          <TagDropdown value={form.tags} options={tags} loading={tagsLoading} disabled={saving} onChange={(value) => update("tags", value)} />
          <span className="leads-field-help">Select one or more existing business tags.</span>
        </div>

        <div className="leads-field">
          <label>Custom fields</label>

          <textarea rows={5} value={form.customFields} onChange={(event) => update("customFields", event.target.value)} placeholder="e.g. Budget: ₹5,00,000, Requirement: CRM software, Preferred contact: WhatsApp" />

          <span className="leads-field-help">Optional. Plain text, key:value pairs, or JSON are accepted.</span>
        </div>
      </div>

      <div className="leads-modal-footer">
        <button type="button" className="leads-btn" onClick={onCancel} disabled={saving}>
          Cancel
        </button>

        <button type="button" className="leads-btn primary" onClick={onSubmit} disabled={saving}>
          {saving ? (
            <>
              <span className="leads-spinner small" />
              Saving...
            </>
          ) : (
            <>
              <Check size={15} />
              {mode === "create" ? "Create lead" : "Save changes"}
            </>
          )}
        </button>
      </div>
    </>
  );
}

function AssignLeadContent({ lead, assignForm, setAssignForm, members, teams, loadingOptions, actionLoading, onCancel, onSubmit }) {
  const [userSearch, setUserSearch] = useState("");
  const [teamSearch, setTeamSearch] = useState("");
  const [userOpen, setUserOpen] = useState(false);
  const [teamOpen, setTeamOpen] = useState(false);
  const userRef = useRef(null);
  const teamRef = useRef(null);
  useEffect(() => {
    const close = (event) => {
      if (userRef.current && !userRef.current.contains(event.target)) setUserOpen(false);
      if (teamRef.current && !teamRef.current.contains(event.target)) setTeamOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const getMemberId = (member) => {
    if (!member) return "";

    if (member?.userId && typeof member.userId === "object") {
      return member.userId?._id || member.userId?.id || "";
    }

    return member?.userId || "";
  };
  const getMemberName = (member) => {
    const user = member?.userId && typeof member.userId === "object" ? member.userId : member;
    return [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() || user?.name || user?.fullName || user?.email || "Unnamed user";
  };
  const getMemberEmail = (member) => {
    const user = member?.userId && typeof member.userId === "object" ? member.userId : member;
    return user?.email || member?.email || "";
  };
  const getTeamId = (team) => team?._id || team?.id || "";
  const getTeamName = (team) => team?.name || team?.title || team?.teamName || "Unnamed team";

  const selectedUser = members.find((member) => String(getMemberId(member)) === String(assignForm.assignedTo || ""));
  const selectedTeam = teams.find((team) => String(getTeamId(team)) === String(assignForm.assignedTeamId || ""));

  const filteredMembers = members.filter((member) => {
    const query = userSearch.trim().toLowerCase();
    if (!query) return true;
    return `${getMemberName(member)} ${getMemberEmail(member)}`.toLowerCase().includes(query);
  });

  const filteredTeams = teams.filter((team) => {
    const query = teamSearch.trim().toLowerCase();
    if (!query) return true;
    return getTeamName(team).toLowerCase().includes(query);
  });

  return (
    <>
      <div className="leads-action-content">
        <p className="leads-action-message">
          Assign <strong>{getLeadName(lead)}</strong> to a business member and/or team.
        </p>

        <div className="leads-action-field">
          <label>Assigned user</label>

          <div ref={userRef} className="leads-assignment-select">
            <button
              type="button"
              className="leads-assignment-trigger"
              disabled={loadingOptions || actionLoading}
              onClick={() => {
                setUserOpen((value) => !value);
                setTeamOpen(false);
              }}>
              <UserCheck size={14} />
              <span>{selectedUser ? getMemberName(selectedUser) : "Select user"}</span>
              <ChevronDown size={14} />
            </button>

            {userOpen && (
              <div className="leads-assignment-menu">
                <div className="leads-assignment-search">
                  <Search size={13} />
                  <input autoFocus value={userSearch} onChange={(event) => setUserSearch(event.target.value)} placeholder="Search user by name or email..." />
                  {userSearch && (
                    <button type="button" onClick={() => setUserSearch("")} aria-label="Clear user search">
                      <X size={13} />
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  className={`leads-assignment-option ${!assignForm.assignedTo ? "selected" : ""}`}
                  onClick={() => {
                    setAssignForm((current) => ({ ...current, assignedTo: "" }));
                    setUserOpen(false);
                    setUserSearch("");
                  }}>
                  <UserCheck size={14} />
                  <span>
                    <strong>Unassigned</strong>
                    <small>Remove user assignment</small>
                  </span>
                </button>

                {filteredMembers.map((member) => {
                  const id = getMemberId(member);
                  if (!id) return null;

                  return (
                    <button
                      type="button"
                      key={id}
                      className={`leads-assignment-option ${String(assignForm.assignedTo) === String(id) ? "selected" : ""}`}
                      onClick={() => {
                        setAssignForm((current) => ({ ...current, assignedTo: id }));
                        setUserOpen(false);
                        setUserSearch("");
                      }}>
                      <UserCheck size={14} />
                      <span>
                        <strong>{getMemberName(member)}</strong>
                        {getMemberEmail(member) && <small>{getMemberEmail(member)}</small>}
                      </span>
                    </button>
                  );
                })}

                {!loadingOptions && filteredMembers.length === 0 && <div className="leads-assignment-empty">No users found.</div>}
              </div>
            )}
          </div>
        </div>

        <div className="leads-action-field">
          <label>Assigned team</label>

          <div ref={teamRef} className="leads-assignment-select">
            <button
              type="button"
              className="leads-assignment-trigger"
              disabled={loadingOptions || actionLoading}
              onClick={() => {
                setTeamOpen((value) => !value);
                setUserOpen(false);
              }}>
              <UsersRound size={14} />
              <span>{selectedTeam ? getTeamName(selectedTeam) : "Select team"}</span>
              <ChevronDown size={14} />
            </button>

            {teamOpen && (
              <div className="leads-assignment-menu">
                <div className="leads-assignment-search">
                  <Search size={13} />
                  <input autoFocus value={teamSearch} onChange={(event) => setTeamSearch(event.target.value)} placeholder="Search team..." />
                  {teamSearch && (
                    <button type="button" onClick={() => setTeamSearch("")} aria-label="Clear team search">
                      <X size={13} />
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  className={`leads-assignment-option ${!assignForm.assignedTeamId ? "selected" : ""}`}
                  onClick={() => {
                    setAssignForm((current) => ({ ...current, assignedTeamId: "" }));
                    setTeamOpen(false);
                    setTeamSearch("");
                  }}>
                  <UsersRound size={14} />
                  <span>
                    <strong>Unassigned</strong>
                    <small>Remove team assignment</small>
                  </span>
                </button>

                {filteredTeams.map((team) => {
                  const id = getTeamId(team);
                  if (!id) return null;

                  return (
                    <button
                      type="button"
                      key={id}
                      className={`leads-assignment-option ${String(assignForm.assignedTeamId) === String(id) ? "selected" : ""}`}
                      onClick={() => {
                        setAssignForm((current) => ({ ...current, assignedTeamId: id }));
                        setTeamOpen(false);
                        setTeamSearch("");
                      }}>
                      <UsersRound size={14} />
                      <span>
                        <strong>{getTeamName(team)}</strong>
                        {team?.slug && <small>{team.slug}</small>}
                      </span>
                    </button>
                  );
                })}

                {!loadingOptions && filteredTeams.length === 0 && <div className="leads-assignment-empty">No teams found.</div>}
              </div>
            )}
          </div>
        </div>

        <div className="leads-action-note">Select by name instead of entering a MongoDB ID. The current backend requires at least one of user or team to remain assigned.</div>
      </div>

      <div className="leads-modal-footer">
        <button type="button" className="leads-btn" disabled={actionLoading} onClick={onCancel}>
          Cancel
        </button>

        <button type="button" className="leads-btn primary" disabled={actionLoading || loadingOptions} onClick={onSubmit}>
          {actionLoading ? (
            <>
              <span className="leads-spinner small" />
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

export default function Leads() {
  const { businessId, loading: businessLoading, error: businessError, permissions, isBusinessOwner, role } = useBusiness();
  const access = { permissions, isBusinessOwner, role };
    const [assigneeDetail, setAssigneeDetail] = useState(null);
  const canCreate = hasPermission(access, PERMISSIONS.LEADS_CREATE);
  const canUpdate = hasPermission(access, PERMISSIONS.LEADS_UPDATE);
  const canDelete = isManagementRole(access) && hasPermission(access, PERMISSIONS.LEADS_DELETE);
  const canAssign = hasPermission(access, PERMISSIONS.LEADS_ASSIGN);
  const canConvert = hasPermission(access, PERMISSIONS.LEADS_CONVERT);

  const [leads, setLeads] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [rating, setRating] = useState("");
  const [source, setSource] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pageError, setPageError] = useState("");

  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const [assignForm, setAssignForm] = useState({
    assignedTo: "",
    assignedTeamId: "",
  });

  const [convertCompanyId, setConvertCompanyId] = useState("");

  const [actionLoading, setActionLoading] = useState(false);
  const [members, setMembers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [assignmentOptionsLoading, setAssignmentOptionsLoading] = useState(false);
  const [tags, setTags] = useState([]);
  const [tagsLoading, setTagsLoading] = useState(false);
  const [mobileFilters, setMobileFilters] = useState(false);

  const loadLeads = useCallback(
    async (nextPage = 1, overrides = {}) => {
      if (!businessId) return;

      setLoading(true);
      setPageError("");

      const nextSearch = overrides.search !== undefined ? overrides.search : search;

      const nextStatus = overrides.status !== undefined ? overrides.status : status;

      const nextRating = overrides.rating !== undefined ? overrides.rating : rating;

      const nextSource = overrides.source !== undefined ? overrides.source : source;

      try {
        const response = await getLeads(businessId, {
          page: nextPage,
          limit: pagination.limit,
          ...(nextSearch.trim() ? { search: nextSearch.trim() } : {}),
          ...(nextStatus ? { status: nextStatus } : {}),
          ...(nextRating ? { rating: nextRating } : {}),
          ...(nextSource ? { source: nextSource } : {}),
        });

        const data = response?.data || response || {};

        const rows = data?.items || data?.leads || [];

        setLeads(Array.isArray(rows) ? rows : []);

        setPagination(
          data?.pagination || {
            page: nextPage,
            limit: pagination.limit,
            total: Array.isArray(rows) ? rows.length : 0,
            totalPages: 1,
          }
        );
      } catch (error) {
        const message = getErrorMessage(error, "Unable to load leads.");
        setPageError(message);
      } finally {
        setLoading(false);
      }
    },
    [businessId, pagination.limit, rating, search, source, status]
  );

  useEffect(() => {
    if (businessId) {
      loadLeads(1);
    }
  }, [businessId]);

  useEffect(() => {
    if (businessError && !businessId && !businessLoading) {
      showErrorAlert("Business unavailable", businessError || "Unable to load your business workspace.");
    }
  }, [businessError, businessId, businessLoading]);

  const stats = useMemo(() => {
    const total = Number(pagination.total || 0);

    const newCount = leads.filter((lead) => lead.status === "NEW").length;

    const qualifiedCount = leads.filter((lead) => lead.status === "QUALIFIED").length;

    const convertedCount = leads.filter((lead) => lead.status === "CONVERTED").length;

    const hotCount = leads.filter((lead) => lead.rating === "HOT").length;

    return [
      {
        title: "Total leads",
        value: total.toLocaleString("en-IN"),
        detail: "All matching leads",
        icon: UsersRound,
        tone: "primary",
      },
      {
        title: "New",
        value: newCount.toLocaleString("en-IN"),
        detail: "On current page",
        icon: UserPlus,
        tone: "blue",
      },
      {
        title: "Qualified",
        value: qualifiedCount.toLocaleString("en-IN"),
        detail: "On current page",
        icon: Target,
        tone: "green",
      },
      {
        title: "Hot leads",
        value: hotCount.toLocaleString("en-IN"),
        detail: "On current page",
        icon: Flame,
        tone: "orange",
      },
      {
        title: "Converted",
        value: convertedCount.toLocaleString("en-IN"),
        detail: "On current page",
        icon: CheckCircle2,
        tone: "success",
      },
    ];
  }, [leads, pagination.total]);

  const loadAssignmentOptions = useCallback(async () => {
    if (!businessId) return;

    setAssignmentOptionsLoading(true);

    try {
      const [membersResponse, teamsResponse] = await Promise.all([getBusinessMembers(businessId, { page: 1, limit: 100 }), getTeams(businessId, { page: 1, limit: 100 })]);

      const memberData = membersResponse?.data || membersResponse || {};
      const teamData = teamsResponse?.data || teamsResponse || {};

      const memberRows = memberData?.items || memberData?.members || memberData?.results || (Array.isArray(memberData) ? memberData : []);

      const teamRows = teamData?.items || teamData?.teams || teamData?.results || (Array.isArray(teamData) ? teamData : []);

      setMembers(Array.isArray(memberRows) ? memberRows : []);
      setTeams(Array.isArray(teamRows) ? teamRows : []);
    } catch (error) {
      setMembers([]);
      setTeams([]);
      await showErrorAlert("Assignment options unavailable", getErrorMessage(error, "Unable to load business members and teams."));
    } finally {
      setAssignmentOptionsLoading(false);
    }
  }, [businessId]);

  const loadTagOptions = useCallback(async () => {
    if (!businessId) return;
    setTagsLoading(true);
    try {
      const response = await api.get(`/tags/business/${businessId}`, { params: { page: 1, limit: 100 } });
      const data = response?.data?.data || response?.data || response || {};
      const rows = data?.items || data?.tags || data?.results || (Array.isArray(data) ? data : []);
      setTags(Array.isArray(rows) ? rows : []);
    } catch (error) {
      setTags([]);
      await showErrorAlert("Tags unavailable", getErrorMessage(error, "Unable to load business tags."));
    } finally {
      setTagsLoading(false);
    }
  }, [businessId]);

  useEffect(() => {
    if (businessId) {
      loadTagOptions();
    }
  }, [businessId, loadTagOptions]);

  const openCreate = async () => {
    if (!canCreate) return;
    setPageError("");
    await loadTagOptions();
    setForm({
      ...EMPTY_FORM,
    });
    setModal({
      mode: "create",
    });
  };

  const openEdit = async (lead) => {
    if (!canUpdate) return;
    setPageError("");
    await loadTagOptions();

    setForm({
      firstName: lead?.firstName || "",
      lastName: lead?.lastName || "",
      name: lead?.name || "",
      email: lead?.email || "",
      phone: lead?.phone || "",
      companyName: lead?.companyName || "",
      jobTitle: lead?.jobTitle || "",
      source: lead?.source || "website",
      status: lead?.status || "NEW",
      rating: lead?.rating || "WARM",
      description: lead?.description || "",
      tags: normalizeTagIds(lead?.tags),
      customFields: normaliseCustomFields(lead?.customFields),
    });

    setModal({
      mode: "edit",
      lead,
    });
  };

  const openView = async (lead) => {
    setPageError("");

    setModal({
      mode: "view",
      lead,
      loading: true,
    });

    try {
      const response = await getLeadById(businessId, lead._id);

      const freshLead = response?.data?.lead || response?.lead || response?.data || lead;

      setModal({
        mode: "view",
        lead: freshLead,
        loading: false,
      });
    } catch (error) {
      setModal({
        mode: "view",
        lead,
        loading: false,
      });

      setPageError(getErrorMessage(error, "Unable to load the latest lead details."));
    }
  };

  const openAssign = async (lead) => {
    if (!canAssign) return;
    setPageError("");

    setAssignForm({
      assignedTo: lead?.assignedTo?._id || lead?.assignedTo || "",
      assignedTeamId: lead?.assignedTeamId?._id || lead?.assignedTeamId || "",
    });

    setModal({
      mode: "assign",
      lead,
    });

    await loadAssignmentOptions();
  };

  const openConvert = (lead) => {
    if (!canConvert) return;
    setConvertCompanyId(lead?.convertedCompanyId?._id || lead?.convertedCompanyId || "");

    setModal({
      mode: "convert",
      lead,
    });
  };

  const saveLead = async () => {
    if ((modal?.mode === "create" && !canCreate) || (modal?.mode === "edit" && !canUpdate)) return;
    if (!businessId) return;

    if (!form.firstName.trim() && !form.lastName.trim() && !form.name.trim()) {
      await showErrorAlert("Lead validation", "Please provide a first name, last name, or display name.");
      return;
    }

    let parsedCustomFields;

    try {
      parsedCustomFields = parseCustomFields(form.customFields);
    } catch (error) {
      await showErrorAlert("Invalid custom fields", error?.message || "Enter a value for custom fields.");
      return;
    }

    setSaving(true);
    setPageError("");

    const payload = {
      firstName: form.firstName.trim() || null,
      lastName: form.lastName.trim() || null,
      name: form.name.trim() || null,
      email: form.email.trim() || null,
      phone: form.phone.trim() || null,
      companyName: form.companyName.trim() || null,
      jobTitle: form.jobTitle.trim() || null,
      source: form.source.trim() || "manual",
      status: form.status || "NEW",
      rating: form.rating || "WARM",
      description: form.description.trim() || null,
      tags: normalizeTagIds(form.tags),
      customFields: parsedCustomFields,
    };

    try {
      if (modal.mode === "create") {
        await createLead(businessId, payload);

        setModal(null);

        await loadLeads(1);

        await showAuthAlert({
          icon: "success",
          title: "Lead created",
          text: "The lead has been added successfully.",
          confirmButtonText: "Done",
        });
      } else {
        await updateLead(businessId, modal.lead._id, payload);

        setModal(null);

        await loadLeads(pagination.page);

        await showAuthAlert({
          icon: "success",
          title: "Lead updated",
          text: "The lead has been updated successfully.",
          confirmButtonText: "Done",
        });
      }
    } catch (error) {
      const message = getErrorMessage(error, `Unable to ${modal.mode === "create" ? "create" : "update"} the lead.`);
      setPageError(message);
      await showErrorAlert(modal.mode === "create" ? "Unable to create lead" : "Unable to update lead", message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (lead) => {
    if (!canDelete) return;
    const result = await showAuthAlert({
      icon: "warning",
      title: "Delete this lead?",
      text: `${getLeadName(lead)} will be permanently removed from this business.`,
      showCancelButton: true,
      confirmButtonText: "Delete lead",
      cancelButtonText: "Cancel",
    });

    if (!result?.isConfirmed) return;

    setActionLoading(true);
    setPageError("");

    try {
      await deleteLead(businessId, lead._id);

      const currentPage = Number(pagination.page || 1);

      const shouldMoveBack = leads.length === 1 && currentPage > 1;

      await loadLeads(shouldMoveBack ? currentPage - 1 : currentPage);

      await showAuthAlert({
        icon: "success",
        title: "Lead deleted",
        text: "The lead has been removed successfully.",
        confirmButtonText: "Done",
      });
    } catch (error) {
      const message = getErrorMessage(error, "Unable to delete the lead.");
      setPageError(message);
      await showErrorAlert("Unable to delete lead", message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!businessId || !modal?.lead?._id) return;

    if (!assignForm.assignedTo && !assignForm.assignedTeamId) {
      await showErrorAlert("Assignment required", "Select a business member or team. The current Lead API does not allow both assignments to be empty.");
      return;
    }

    setActionLoading(true);
    setPageError("");

    try {
      await assignLead(businessId, modal.lead._id, assignForm.assignedTo || null, assignForm.assignedTeamId || null);

      setModal(null);
      await loadLeads(pagination.page);

      await showAuthAlert({
        icon: "success",
        title: "Lead assignment updated",
        text: "The lead assignment has been updated successfully.",
        confirmButtonText: "Done",
      });
    } catch (error) {
      const message = getErrorMessage(error, "Unable to update the lead assignment.");
      setPageError(message);
      await showErrorAlert("Unable to assign lead", message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleConvert = async () => {
    if (!businessId || !modal?.lead?._id) return;

    const result = await showAuthAlert({
      icon: "warning",
      title: "Convert this lead?",
      text: `${getLeadName(modal.lead)} will be converted into a contact. This action cannot be reversed from the Lead module.`,
      showCancelButton: true,
      confirmButtonText: "Convert lead",
      cancelButtonText: "Cancel",
    });

    if (!result?.isConfirmed) return;

    if (!modal.lead?.firstName && !modal.lead?.name) {
      await showErrorAlert("First name required", "This lead cannot be converted until it has a first name or display name that can be used for the contact.");
      return;
    }

    setActionLoading(true);
    setPageError("");

    try {
      await convertLead(
        businessId,
        modal.lead._id,
        convertCompanyId.trim()
          ? {
              companyId: convertCompanyId.trim(),
            }
          : {}
      );

      setModal(null);

      await loadLeads(pagination.page);

      await showAuthAlert({
        icon: "success",
        title: "Lead converted",
        text: "The lead has been converted to a contact successfully.",
        confirmButtonText: "Done",
      });
    } catch (error) {
      const message = getErrorMessage(error, "Unable to convert the lead.");
      setPageError(message);
      await showErrorAlert("Unable to convert lead", message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;

    setSearch(value);

    loadLeads(1, {
      search: value,
    });
  };

  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setRating("");
    setSource("");

    loadLeads(1, {
      search: "",
      status: "",
      rating: "",
      source: "",
    });
  };

  const hasFilters = Boolean(search.trim()) || Boolean(status) || Boolean(rating) || Boolean(source);

  const currentPage = Number(pagination.page || 1);

  const totalPages = Math.max(Number(pagination.totalPages || 1), 1);

  return (
    <>
      <style>{`.lead-assignment-stack{min-width:230px;white-space:nowrap}.lead-assignment-stack .crm-assignee-name{white-space:nowrap;display:inline-block}.lead-team-line{white-space:nowrap;max-width:none}.crm-assignee-name{white-space:nowrap;display:inline-flex;align-items:center;cursor:pointer;text-decoration:none;background:transparent;border:0;padding:0;margin:0;color:var(--crm-text);font:inherit;font-weight:400;line-height:1.3;text-align:left;box-shadow:none;appearance:none;-webkit-appearance:none}.crm-assignee-name:hover{background:transparent;border:0;box-shadow:none;color:var(--crm-primary);text-decoration:none}.crm-assignee-name:focus,.crm-assignee-name:focus-visible{outline:none;box-shadow:none;background:transparent}
        .leads-page{padding:28px 30px 42px;max-width:1800px;margin:0 auto;color:var(--crm-text)}
        .leads-head{display:flex;align-items:flex-end;justify-content:space-between;gap:22px;margin-bottom:22px}
        .leads-head-left{min-width:0}
        .leads-title{font-size:29px;line-height:1.15;letter-spacing:-.8px;margin:0;color:var(--crm-text);font-weight:400}
        .leads-subtitle{margin:8px 0 0;color:var(--crm-muted);font-size:13px}
        .leads-head-actions{display:flex;align-items:center;gap:9px;flex-shrink:0}
        .leads-btn{height:40px;padding:0 14px;border-radius:10px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);font-size:13px;font-weight:400;display:inline-flex;align-items:center;justify-content:center;gap:8px;transition:.18s;cursor:pointer;white-space:nowrap}
        .leads-btn:hover:not(:disabled){background:var(--crm-surface-2);border-color:var(--crm-primary)}
.leads-btn.primary{border-color:var(--crm-primary);background:var(--crm-primary);color:#fff}
.leads-btn.primary:hover:not(:disabled){filter:none;background:var(--crm-primary);border-color:var(--crm-primary);color:#fff}
        .leads-btn.danger{color:var(--crm-danger)}
        .lead-assignment-line{display:flex;align-items:center;gap:5px;min-width:0;line-height:1.2}.lead-assignment-line>svg{width:12px;height:12px;min-width:12px;flex:0 0 12px;color:var(--crm-muted);display:block;stroke:currentColor;stroke-width:2}.lead-assignment-line span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .leads-btn:disabled{opacity:.55;cursor:not-allowed}
        .leads-btn.small{height:34px;padding:0 11px;border-radius:8px;font-size:13px}
        .leads-stats{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:14px}
        .leads-stat{position:relative;background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:15px;padding:11px 14px 10px;box-shadow:var(--crm-shadow);min-width:0}
        .leads-stat-top{display:flex;align-items:flex-start;justify-content:flex-start;margin-bottom:3px;min-height:0}
        .leads-stat-icon{position:absolute;right:14px;bottom:28px;width:35px;height:35px;border-radius:10px;background:var(--crm-primary-soft);color:var(--crm-primary);display:grid;place-items:center}
        .leads-stat-icon.green{background:color-mix(in srgb,var(--crm-success) 11%,transparent);color:var(--crm-success)}
        .leads-stat-icon.orange{background:color-mix(in srgb,var(--crm-warning) 12%,transparent);color:var(--crm-warning)}
        .leads-stat-icon.success{background:color-mix(in srgb,var(--crm-success) 11%,transparent);color:var(--crm-success)}
        .leads-stat-menu{color:var(--crm-muted)}
        .leads-stat-title{font-size:13px;color:var(--crm-muted);font-weight:400}
        .leads-stat-value{font-size:24px;letter-spacing:-.5px;font-weight:400;color:var(--crm-text);margin:2px 0 4px}
        .leads-stat-detail{font-size:13px;color:var(--crm-muted);padding-right:46px}
        .leads-main-panel{margin-top:14px;background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:15px;box-shadow:var(--crm-shadow);min-width:0;overflow:hidden}
   
        .leads-filter-toggle{display:none}
        .leads-toolbar{padding:15px 20px;border-bottom:1px solid var(--crm-border);display:flex;align-items:center;gap:9px;flex-wrap:wrap}
        .leads-search-wrap{position:relative;flex:1;min-width:230px}
        .leads-search{width:100%;height:40px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:10px;padding:0 38px 0 38px;outline:0;font-size:13px}
        .leads-search::placeholder{color:var(--crm-muted)}
        .leads-search:focus{border-color:var(--crm-primary)}
        .leads-search-icon{position:absolute;left:12px;top:12px;color:var(--crm-muted);width:16px;height:16px;pointer-events:none}
        .leads-search-clear{position:absolute;right:8px;top:8px;width:24px;height:24px;border:0;border-radius:7px;background:transparent;color:var(--crm-muted);display:grid;place-items:center;cursor:pointer}
        .leads-search-clear:hover{background:var(--crm-surface-2);color:var(--crm-text)}
        .leads-filter-select{height:40px;min-width:130px;padding:0 32px 0 11px;border:1px solid var(--crm-border);border-radius:10px;background:var(--crm-surface);color:var(--crm-text);font-size:13px;font-weight:400;outline:0;cursor:pointer}
        .leads-filter-select:focus{border-color:var(--crm-primary)}
        .leads-select-box{position:relative}
        .leads-select-box svg{position:absolute;right:10px;top:13px;color:var(--crm-muted);pointer-events:none}
        .leads-filter-clear{height:40px;border:0;background:transparent;color:var(--crm-muted);font-size:13px;font-weight:400;padding:0 7px;cursor:pointer}
        .leads-filter-clear:hover{color:var(--crm-text);text-decoration:underline}
        .leads-error{margin:14px 20px 0;padding:10px 12px;border-radius:9px;background:color-mix(in srgb,var(--crm-danger) 10%,transparent);border:1px solid color-mix(in srgb,var(--crm-danger) 20%,transparent);color:var(--crm-danger);font-size:13px;display:flex;align-items:flex-start;gap:8px}
        .leads-table-wrap{width:100%;max-height:340px;overflow:auto;overscroll-behavior:contain;scrollbar-gutter:stable both-edges}
        .leads-table{width:100%;min-width:1855px;border-collapse:collapse;table-layout:auto}.leads-table th:nth-child(1),.leads-table td:nth-child(1){min-width:230px;width:230px}.leads-table th:nth-child(2),.leads-table td:nth-child(2){min-width:160px;width:160px}.leads-table th:nth-child(3),.leads-table td:nth-child(3){min-width:190px;width:190px}.leads-table th:nth-child(4),.leads-table td:nth-child(4){min-width:145px;width:145px}.leads-table th:nth-child(5),.leads-table td:nth-child(5){min-width:125px;width:125px}.leads-table th:nth-child(6),.leads-table td:nth-child(6){min-width:110px;width:110px}.leads-table th:nth-child(7),.leads-table td:nth-child(7){min-width:245px;width:245px}.leads-table th:nth-child(8),.leads-table td:nth-child(8){min-width:140px;width:140px}.leads-table th:nth-child(9),.leads-table td:nth-child(9){min-width:145px;width:145px}.leads-table th:nth-child(10),.leads-table td:nth-child(10){min-width:120px;width:120px}.leads-table th:nth-child(11),.leads-table td:nth-child(11){min-width:120px;width:120px}.leads-table th:nth-child(12),.leads-table td:nth-child(12){min-width:125px;width:125px}.leads-table th{position:sticky;top:0;z-index:3;text-align:left!important;min-width:100px;padding:13px 18px;white-space:nowrap}.leads-table th:last-child,.leads-table td:last-child{text-align:center}.leads-table tbody tr{height:56px}.leads-table td{white-space:nowrap}.leads-table th,.leads-table td{padding-left:18px;padding-right:18px}.leads-table .crm-assignee-name{white-space:nowrap;display:inline-flex;align-items:center;cursor:pointer}.leads-table th{min-width:100px}.leads-table td{white-space:nowrap}.leads-table th:last-child,.leads-table td:last-child{min-width:120px;width:120px}
        
        .leads-table td{padding:13px 18px;border-bottom:1px solid var(--crm-border);font-size:13px;color:var(--crm-text);vertical-align:middle}
        .leads-table tbody tr{transition:.15s}
        .leads-table tbody tr:hover{background:var(--crm-surface-2)}
        .leads-table tbody tr:last-child td{border-bottom:0}
        .lead-person{display:flex;align-items:center;gap:10px;min-width:190px}
        .lead-avatar{width:34px;height:34px;border-radius:10px;background:var(--crm-primary-soft);color:var(--crm-primary);display:grid;place-items:center;font-size:13px;font-weight:400;flex-shrink:0}
        .lead-person-main{min-width:0}
        .lead-person-name{font-size:13px;font-weight:400;color:var(--crm-text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:190px}
        .lead-person-sub{font-size:13px;color:var(--crm-muted);margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:190px}
        .lead-company{display:flex;align-items:center;gap:7px;color:var(--crm-text);font-weight:400;white-space:nowrap}
        .lead-company svg{color:var(--crm-muted)}
        .lead-contact{display:flex;flex-direction:column;align-items:flex-start;justify-content:center;gap:4px;color:var(--crm-muted);min-width:190px;max-width:260px}.lead-contact-row{width:100%;min-width:0;display:flex;align-items:center;gap:6px;line-height:1.35}.lead-contact-row svg{flex:0 0 auto;color:var(--crm-muted)}.lead-contact-row span{min-width:0;max-width:225px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .lead-source{font-size:13px;font-weight:400;color:var(--crm-muted);white-space:nowrap}
        .lead-status-badge{display:inline-flex;align-items:center;gap:6px;padding:5px 8px;border-radius:7px;font-size:13px;font-weight:400;white-space:nowrap}
        .lead-status-dot{width:5px;height:5px;border-radius:50%;background:currentColor}
        .lead-status-badge.new{color:var(--crm-primary);background:var(--crm-primary-soft)}
        .lead-status-badge.contacted{color:var(--crm-warning);background:color-mix(in srgb,var(--crm-warning) 11%,transparent)}
        .lead-status-badge.qualified{color:var(--crm-success);background:color-mix(in srgb,var(--crm-success) 11%,transparent)}
        .lead-status-badge.unqualified{color:var(--crm-muted);background:var(--crm-surface-2)}
        .lead-status-badge.converted{color:var(--crm-success);background:color-mix(in srgb,var(--crm-success) 13%,transparent)}
        .lead-status-badge.lost{color:var(--crm-danger);background:color-mix(in srgb,var(--crm-danger) 10%,transparent)}
        .lead-rating-badge{display:inline-flex;align-items:center;gap:4px;padding:5px 8px;border-radius:7px;font-size:13px;font-weight:400;white-space:nowrap}
        .lead-rating-badge.hot{color:var(--crm-danger);background:color-mix(in srgb,var(--crm-danger) 10%,transparent)}
        .lead-rating-badge.warm{color:var(--crm-warning);background:color-mix(in srgb,var(--crm-warning) 11%,transparent)}
        .lead-rating-badge.cold{color:var(--crm-muted);background:var(--crm-surface-2)}
        .lead-assignee{display:flex;align-items:center;gap:7px;color:var(--crm-muted);font-size:13px;white-space:nowrap}
        .lead-assignee-avatar{width:25px;height:25px;border-radius:8px;background:var(--crm-primary-soft);color:var(--crm-primary);display:grid;place-items:center;font-size:13px;font-weight:400}
        .lead-unassigned{color:var(--crm-muted);font-size:13px}.lead-assignment-stack{display:grid;gap:4px;min-width:150px}.lead-team-line{display:flex;align-items:center;gap:5px;color:var(--crm-muted);font-size:13px;max-width:190px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.lead-team-line.muted{opacity:.8}
        .lead-tags-cell{display:flex;align-items:center;gap:4px;flex-wrap:wrap;max-width:180px}.lead-tag-pill{display:inline-flex;align-items:center;max-width:85px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding:4px 7px;border-radius:7px;background:var(--crm-primary-soft);color:var(--crm-primary);font-size:13px;font-weight:400}.lead-tag-more{font-size:13px;font-weight:400;color:var(--crm-muted)}
        .lead-date{font-size:13px;color:var(--crm-muted);white-space:nowrap}
        .lead-actions{display:flex;align-items:center;gap:5px}
        .lead-action-btn{width:30px;height:30px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-muted);border-radius:8px;display:grid;place-items:center;cursor:pointer;transition:.16s}
        .lead-action-btn:hover{color:var(--crm-primary);border-color:var(--crm-primary);background:var(--crm-primary-soft)}
        .lead-action-btn.danger:hover{color:var(--crm-danger);border-color:var(--crm-danger);background:color-mix(in srgb,var(--crm-danger) 8%,transparent)}
        .leads-empty{padding:58px 20px;text-align:center;color:var(--crm-muted);display:flex;align-items:center;flex-direction:column}
        .leads-empty-icon{width:52px;height:52px;border-radius:15px;background:var(--crm-primary-soft);color:var(--crm-primary);display:grid;place-items:center;margin-bottom:13px}
        .leads-empty-title{font-size:14px;font-weight:400;color:var(--crm-text)}
        .leads-empty-text{max-width:390px;font-size:13px;line-height:1.6;margin:5px 0 16px}
        .leads-pagination{display:flex;align-items:center;justify-content:space-between;gap:15px;padding:13px 18px;border-top:1px solid var(--crm-border)}
        .leads-pagination-info{font-size:13px;color:var(--crm-muted)}
        .leads-pagination-actions{display:flex;align-items:center;gap:6px}
        .leads-page-number{font-size:13px;color:var(--crm-muted);padding:0 7px}
        .leads-pagination-btn{height:32px;padding:0 10px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:8px;font-size:13px;font-weight:400;display:flex;align-items:center;gap:5px;cursor:pointer}
        .leads-pagination-btn:hover:not(:disabled){border-color:var(--crm-primary);color:var(--crm-primary)}
        .leads-pagination-btn:disabled{opacity:.45;cursor:not-allowed}
        .leads-loading{display:flex;align-items:center;justify-content:center;gap:9px;padding:60px 20px;color:var(--crm-muted);font-size:13px}
        .leads-spinner{width:17px;height:17px;border:2px solid var(--crm-border);border-top-color:var(--crm-primary);border-radius:50%;animation:leads-spin .75s linear infinite;display:inline-block}
        .leads-spinner.small{width:13px;height:13px;border-width:2px}
        .leads-refresh-spin{animation:leads-spin .75s linear infinite}
        @keyframes leads-spin{to{transform:rotate(360deg)}}
        .swal2-container{z-index:20000!important}
        .leads-modal-backdrop{position:fixed;inset:0;background:rgba(15,23,42,.52);display:grid;place-items:center;padding:20px;z-index:1000;backdrop-filter:blur(3px)}
        .leads-modal{width:min(640px,100%);max-height:92vh;overflow:hidden;background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:16px;box-shadow:0 30px 90px rgba(0,0,0,.28);display:flex;flex-direction:column}
        .leads-modal.large{width:min(820px,100%)}
        .leads-modal.compact{width:min(520px,100%)}
        .leads-modal-head{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:18px 20px;border-bottom:1px solid var(--crm-border);flex-shrink:0}
        .leads-modal-title-wrap{min-width:0}
        .leads-modal-eyebrow{font-size:13px;color:var(--crm-primary);font-weight:400;text-transform:uppercase;letter-spacing:.1em;margin-bottom:4px}
        .leads-modal-title{margin:0;font-size:16px;font-weight:400;color:var(--crm-text)}
        .leads-modal-subtitle{margin:4px 0 0;font-size:13px;color:var(--crm-muted)}
        .leads-modal-close{width:32px;height:32px;border:0;background:transparent;color:var(--crm-muted);border-radius:8px;display:grid;place-items:center;cursor:pointer;flex-shrink:0}
        .leads-modal-close:hover{background:var(--crm-surface-2);color:var(--crm-text)}
        .leads-modal-body{overflow:auto}
        .leads-form{padding:20px;display:grid;grid-template-columns:1fr 1fr;gap:15px}
        .leads-form-section{min-width:0}
        .leads-form-section.full{grid-column:1/-1}
        .leads-form-section-spaced{margin-top:4px}
        .leads-form-section-title{display:flex;align-items:center;gap:7px;color:var(--crm-text);font-size:13px;font-weight:400}
        .leads-form-section-title svg{color:var(--crm-primary)}
        .leads-form-section-subtitle{font-size:13px;color:var(--crm-muted);margin-top:4px}
        .leads-field{display:grid;gap:6px;min-width:0}
        .leads-field.full{grid-column:1/-1}
        .leads-field label{font-size:13px;font-weight:400;color:var(--crm-text)}
        .leads-field-help{font-size:13px;color:var(--crm-muted)}
        .leads-field input,.leads-field select,.leads-field textarea{width:100%;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:9px;padding:10px 11px;outline:0;font-size:13px;box-sizing:border-box}
        .leads-field input::placeholder,.leads-field textarea::placeholder{color:var(--crm-muted)}
        .leads-field input:focus,.leads-field select:focus,.leads-field textarea:focus{border-color:var(--crm-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--crm-primary) 9%,transparent)}
        .leads-field textarea{resize:vertical;min-height:110px;line-height:1.55}
        .leads-select-wrap{position:relative}
        .leads-select-wrap select{appearance:none;padding-right:34px}
        .leads-select-wrap svg{position:absolute;right:11px;top:12px;color:var(--crm-muted);pointer-events:none}
        .leads-input-icon-wrap{position:relative}
        .leads-input-icon-wrap svg{position:absolute;left:11px;top:11px;color:var(--crm-muted);pointer-events:none}
        .leads-input-icon-wrap input{padding-left:33px}
        .leads-modal-footer{display:flex;align-items:center;justify-content:flex-end;gap:8px;padding:14px 20px;border-top:1px solid var(--crm-border);flex-shrink:0}
        .leads-view{padding:20px}
        .leads-profile-card{display:flex;align-items:center;gap:13px;padding:15px;border:1px solid var(--crm-border);background:var(--crm-surface-2);border-radius:12px}
        .leads-profile-avatar{width:46px;height:46px;border-radius:13px;background:var(--crm-primary-soft);color:var(--crm-primary);display:grid;place-items:center;font-size:13px;font-weight:400;flex-shrink:0}
        .leads-profile-name{font-size:15px;font-weight:400;color:var(--crm-text)}
        .leads-profile-company{font-size:13px;color:var(--crm-muted);margin-top:4px}
        .leads-profile-badges{display:flex;align-items:center;gap:6px;margin-left:auto;flex-wrap:wrap;justify-content:flex-end}
        .leads-view-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:14px}
        .leads-view-item{padding:12px;border:1px solid var(--crm-border);border-radius:10px;background:var(--crm-surface)}
        .leads-view-item.full{grid-column:1/-1}
        .leads-view-label{font-size:13px;text-transform:uppercase;letter-spacing:.07em;color:var(--crm-muted);font-weight:400}
        .leads-view-value{font-size:13px;color:var(--crm-text);font-weight:400;margin-top:5px;word-break:break-word}
        .leads-description{line-height:1.6;white-space:pre-wrap;font-weight:400}
.leads-assignment-select{position:relative;width:calc(100% - 24px);margin:0 12px}.leads-assignment-trigger{width:100%;min-height:40px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:9px;padding:0 11px;display:flex;align-items:center;gap:8px;text-align:left;cursor:pointer;font-size:13px}.leads-assignment-trigger span{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.leads-assignment-trigger>svg:last-child{margin-left:auto;color:var(--crm-muted)}.leads-assignment-trigger:hover{border-color:var(--crm-primary);background:var(--crm-surface-2)}.leads-assignment-menu{position:absolute;left:0;right:0;top:calc(100% + 5px);z-index:40;max-height:270px;overflow:auto;background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:10px;box-shadow:0 16px 40px rgba(0,0,0,.2);padding:6px}.leads-assignment-search{position:sticky;top:0;z-index:2;display:flex;align-items:center;gap:7px;padding:7px;border:1px solid var(--crm-border);background:var(--crm-surface-2);border-radius:8px;margin-bottom:5px}.leads-assignment-search>svg{color:var(--crm-muted);flex-shrink:0}.leads-assignment-search input{flex:1!important;width:100%!important;min-width:0!important;border:0!important;background:transparent!important;box-shadow:none!important;padding:4px!important;color:var(--crm-text)}.leads-assignment-search button{width:22px;height:22px;min-width:22px;flex:0 0 22px;margin-left:auto;padding:0;border:0;background:transparent;color:var(--crm-muted);display:grid;place-items:center;cursor:pointer}.leads-assignment-option{width:100%;border:0;background:transparent;color:var(--crm-text);display:flex;align-items:center;gap:9px;padding:9px;border-radius:8px;text-align:left;cursor:pointer}.leads-assignment-option:hover,.leads-assignment-option.selected{background:color-mix(in srgb,var(--crm-primary) 9%,transparent);color:var(--crm-primary)}.leads-assignment-option>span{min-width:0;display:grid;gap:2px}.leads-assignment-option strong{font-size:13px;font-weight:400;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.leads-assignment-option small{font-size:13px;color:var(--crm-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.leads-assignment-empty{padding:18px 10px;text-align:center;color:var(--crm-muted);font-size:13px}
.leads-action-content{padding:20px}
        .leads-action-message{font-size:13px;color:var(--crm-text);line-height:1.6;margin:0 0 15px}
        .leads-action-message strong{font-weight:400}
        .leads-action-note{font-size:13px;color:var(--crm-muted);line-height:1.55;margin-top:8px}
        .leads-action-field{display:grid;gap:6px;margin-top:12px}
        .leads-action-field label{font-size:13px;font-weight:400;color:var(--crm-text)}
        .leads-action-field input{height:40px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:9px;padding:0 11px;outline:0;font-size:13px}
        .leads-action-field input:focus{border-color:var(--crm-primary)}        .leads-tag-select{position:relative}
        .leads-tag-trigger{width:100%;min-height:40px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:9px;padding:0 11px;display:flex;align-items:center;gap:8px;text-align:left;cursor:pointer;font-size:13px}
        .leads-tag-trigger-text{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .leads-tag-trigger>svg{margin-left:auto;color:var(--crm-muted)}
        .leads-tag-trigger:hover:not(:disabled){border-color:var(--crm-primary);background:var(--crm-surface-2)}
        .leads-dropdown-menu{position:absolute;left:0;right:0;top:calc(100% + 5px);z-index:80;max-height:270px;overflow:auto;background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:10px;box-shadow:0 16px 40px rgba(0,0,0,.2);padding:6px}
        .leads-dropdown-search{position:sticky;top:0;z-index:2;display:flex;align-items:center;gap:7px;padding:7px;border:1px solid var(--crm-border);background:var(--crm-surface-2);border-radius:8px;margin-bottom:5px}
        .leads-dropdown-search>svg{color:var(--crm-muted)}
        .leads-dropdown-search input{flex:1!important;width:100%!important;min-width:0!important;border:0!important;background:transparent!important;box-shadow:none!important;padding:4px!important;color:var(--crm-text)}
        .leads-dropdown-search button{width:22px;height:22px;border:0;background:transparent;color:var(--crm-muted);display:grid;place-items:center;cursor:pointer}
        .leads-dropdown-option{width:100%;border:0;background:transparent;color:var(--crm-text);display:flex;align-items:center;gap:9px;padding:9px;border-radius:8px;text-align:left;cursor:pointer}
        .leads-dropdown-option:hover,.leads-dropdown-option.selected{background:color-mix(in srgb,var(--crm-primary) 9%,transparent);color:var(--crm-primary)}
        .leads-dropdown-option>span:last-child{min-width:0;display:grid;gap:2px}
        .leads-dropdown-option strong{font-size:13px;font-weight:400}
        .leads-dropdown-option small{font-size:13px;color:var(--crm-muted)}
        .leads-dropdown-empty{padding:18px 10px;text-align:center;color:var(--crm-muted);font-size:13px;display:flex;align-items:center;justify-content:center;gap:7px}
        .leads-check{width:18px;height:18px;border:1px solid var(--crm-border);border-radius:5px;display:grid;place-items:center;color:#fff;flex:0 0 18px}
        .leads-check.checked{background:var(--crm-primary);border-color:var(--crm-primary)}
        .leads-selected-tags{display:flex;flex-wrap:wrap;gap:5px;margin-top:6px}
        .leads-tag-chip{display:inline-flex;align-items:center;gap:4px;padding:4px 7px;border-radius:7px;background:var(--crm-primary-soft);color:var(--crm-primary);font-size:13px;font-weight:400}
        .leads-tag-chip button{width:16px;height:16px;border:0;background:transparent;color:currentColor;padding:0;display:grid;place-items:center;cursor:pointer}
        .leads-view-loading{display:flex;justify-content:center;align-items:center;gap:8px;padding:45px;color:var(--crm-muted);font-size:13px}
        .leads-footer-note{display:flex;align-items:center;justify-content:center;gap:7px;color:var(--crm-muted);font-size:13px;padding:22px 0 0}
        .leads-table .crm-assignee-name{white-space:nowrap;display:inline-flex;align-items:center;cursor:pointer}@media(max-width:1250px){.leads-stats{grid-template-columns:repeat(3,minmax(0,1fr))}}
        @media(max-width:900px){.leads-stats{grid-template-columns:repeat(2,minmax(0,1fr))}.leads-head{align-items:flex-start;flex-direction:column}.leads-head-actions{width:100%}}
        @media(max-width:700px){.leads-page{padding:20px 15px 30px}.leads-title{font-size:23px}.leads-head-actions{flex-wrap:wrap}.leads-head-actions .leads-btn{flex:1}.leads-stats{grid-template-columns:1fr}.leads-panel-head{align-items:flex-start}.leads-panel-head-right{width:100%}.leads-filter-toggle{display:inline-flex}.leads-toolbar{display:none}.leads-toolbar.open{display:flex;flex-direction:column;align-items:stretch}.leads-search-wrap{min-width:0}.leads-filter-select{width:100%}.leads-select-box{width:100%}.leads-filter-clear{text-align:left}.leads-pagination{align-items:flex-start;flex-direction:column}.leads-pagination-actions{width:100%;justify-content:space-between}.leads-form{grid-template-columns:1fr;padding:17px}.leads-field.full{grid-column:auto}.leads-profile-card{align-items:flex-start;flex-wrap:wrap}.leads-profile-badges{margin-left:0;justify-content:flex-start;width:100%}.leads-view-grid{grid-template-columns:1fr}.leads-view-item.full{grid-column:auto}.leads-modal-backdrop{padding:10px}.leads-modal{max-height:95vh}.leads-modal-footer{padding:12px 17px}.leads-modal-footer .leads-btn{flex:1}}
      .leads-table thead th{text-align:left!important;padding-left:20px;padding-right:20px;white-space:nowrap}.leads-table tbody td{padding-left:20px;padding-right:20px}.leads-table td:last-child{text-align:center}`}</style>

      <section className="leads-page">
        <div className="leads-head">
          <div className="leads-head-left">
            <h1 className="leads-title">Leads</h1>

            <p className="leads-subtitle">Capture, qualify and convert prospects from one place.</p>
          </div>

          <div className="leads-head-actions">
            <button
              type="button"
              className="leads-btn"
              onClick={() => {
                if (!businessId) {
                  showAuthAlert({
                    icon: "info",
                    title: "Business workspace unavailable",
                    text: businessError || "Your business workspace is still loading. Please try again.",
                    confirmButtonText: "OK",
                  });
                  return;
                }

                loadLeads(1);
              }}>
              <RefreshCw size={14} className={loading ? "leads-refresh-spin" : ""} />
              {loading ? "Refreshing..." : "Refresh"}
            </button>

            <button
              type="button"
              className="leads-btn primary"
              disabled={!canCreate}
              onClick={() => {
                if (!businessId) {
                  showAuthAlert({
                    icon: "info",
                    title: "Business workspace unavailable",
                    text: businessError || "Your business workspace is not available yet.",
                    confirmButtonText: "OK",
                  });
                  return;
                }

                openCreate();
              }}>
              <Plus size={15} />
              Add lead
            </button>
          </div>
        </div>

        <div className="leads-stats">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <article className="leads-stat" key={stat.title}>
                <div className="leads-stat-top">
                  <div className={`leads-stat-icon ${stat.tone}`}>
                    <Icon size={19} />
                  </div>
                </div>

                <div className="leads-stat-title">{stat.title}</div>

                <div className="leads-stat-value">{stat.value}</div>

                <div className="leads-stat-detail">{stat.detail}</div>
              </article>
            );
          })}
        </div>

        <section className="leads-main-panel">
          <div className={`leads-toolbar ${mobileFilters ? "open" : ""}`}>
            <div className="leads-search-wrap">
              <Search className="leads-search-icon" />

              <input className="leads-search" value={search} onChange={handleSearchChange} placeholder="Search leads by name, email, phone or company..." aria-label="Search leads" />

              {search && (
                <button
                  type="button"
                  className="leads-search-clear"
                  onClick={() => {
                    setSearch("");

                    loadLeads(1, {
                      search: "",
                    });
                  }}
                  aria-label="Clear search">
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="leads-select-box">
              <select
                className="leads-filter-select"
                value={status}
                onChange={(event) => {
                  const value = event.target.value;

                  setStatus(value);

                  loadLeads(1, {
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

            <div className="leads-select-box">
              <select
                className="leads-filter-select"
                value={rating}
                onChange={(event) => {
                  const value = event.target.value;

                  setRating(value);

                  loadLeads(1, {
                    rating: value,
                  });
                }}>
                <option value="">All ratings</option>

                {RATING_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <ChevronDown size={13} />
            </div>

            <div className="leads-select-box">
              <select
                className="leads-filter-select"
                value={source}
                onChange={(event) => {
                  const value = event.target.value;

                  setSource(value);

                  loadLeads(1, {
                    source: value,
                  });
                }}>
                {SOURCE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <ChevronDown size={13} />
            </div>

            {hasFilters && (
              <button type="button" className="leads-filter-clear" onClick={clearFilters}>
                Reset
              </button>
            )}
          </div>

          {(pageError || businessError) && (
            <div className="leads-error">
              <AlertCircle size={15} />

              <span>{pageError || businessError || "Unable to load leads."}</span>
            </div>
          )}

          <div className="leads-table-wrap">
            <table className="leads-table">
              <thead>
                <tr>
                  <th>Lead</th>
                  <th>Company</th>
                  <th>Contact</th>
                  <th>Source</th>
                  <th>Status</th>
                  <th>Rating</th>
                  <th>Assigned to</th>
                  <th>Tags</th>
                  <th>Last contacted</th>
                  <th>Created</th>
                  <th>Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading || businessLoading ? (
                  <tr>
                    <td colSpan={13}>
                      <div className="leads-loading">
                        <span className="leads-spinner" />
                        Loading leads...
                      </div>
                    </td>
                  </tr>
                ) : leads.length === 0 ? (
                  <tr>
                    <td colSpan={13}>
                      <EmptyState search={Boolean(search.trim() || status || rating || source)} onAdd={openCreate} />
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => {
                    const assignedName = getAssignedUserName(lead?.assignedTo);
                    const assignedTeamName = getAssignedTeamName(lead?.assignedTeamId);
                    const leadTagNames = getLeadTagNames(lead?.tags, tags);

                    return (
                      <tr key={lead._id}>
                        <td>
                          <div className="lead-person">
                            <div className="lead-avatar">{getInitials(lead)}</div>

                            <div className="lead-person-main">
                              <div className="lead-person-name">{getLeadName(lead)}</div>

                              <div className="lead-person-sub">{lead.jobTitle || "Lead prospect"}</div>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div className="lead-company">
                            <BriefcaseBusiness size={13} />

                            {lead.companyName || "—"}
                          </div>
                        </td>

                        <td>
                          <div className="lead-contact">
                            {lead.email && (
                              <div className="lead-contact-row" title={lead.email}>
                                <Mail size={12} />
                                <span>{lead.email}</span>
                              </div>
                            )}
                            {lead.phone && (
                              <div className="lead-contact-row" title={lead.phone}>
                                <Phone size={12} />
                                <span>{lead.phone}</span>
                              </div>
                            )}
                            {!lead.email && !lead.phone && "—"}
                          </div>
                        </td>

                        <td>
                          <div style={{ display: "grid", gap: 2 }}>
                              <span className="lead-source">{formatSource(lead.source)}</span>
                              {lead?.customFields?._leadGeneration?.isSupportTicket && <span className="lead-source" style={{ fontSize: 11 }}>Ticket</span>}
                            </div>
                        </td>

                        <td>
                          <StatusBadge status={lead.status} />
                        </td>

                        <td>
                          <RatingBadge rating={lead.rating} />
                        </td>

                        <td>
                          <div className="lead-assignment-stack">
                            {assignedName ? (
                              <div className="lead-assignee">
                                <UserCheck size={12} />
                                <button type="button" className="crm-assignee-name" onClick={() => lead?.assignedTo && setAssigneeDetail({ type: "user", name: assignedName, email: lead?.assignedTo?.email || "" })}>User: {assignedName}</button>
                              </div>
                            ) : (
                              <div className="lead-assignee muted">
                                <UserCheck size={12} />
                                <span>User: Unassigned</span>
                              </div>
                            )}

                            {lead?.assignedTeamId ? (
                              <div className="lead-team-line">
                                <UsersRound size={11} />
                                <span>Team: {assignedTeamName || "Assigned team"}</span>
                              </div>
                            ) : (
                              <div className="lead-team-line muted">
                                <UsersRound size={11} />
                                <span>Team: Unassigned</span>
                              </div>
                            )}
                          </div>
                        </td>

                        <td>
                          {leadTagNames.length ? (
                            <div className="lead-tags-cell">
                              {leadTagNames.slice(0, 2).map((tagName, index) => (
                                <span className="lead-tag-pill" key={`${tagName}-${index}`}>
                                  {tagName}
                                </span>
                              ))}
                              {leadTagNames.length > 2 && <span className="lead-tag-more">+{leadTagNames.length - 2}</span>}
                            </div>
                          ) : (
                            <span className="lead-unassigned">—</span>
                          )}
                        </td>

                        <td>
                          <span className="lead-date">{formatDate(lead.lastContactedAt)}</span>
                        </td>

                        <td>
                          <span className="lead-date">{formatDate(lead.createdAt)}</span>
                        </td>

                        <td>
                          <span className="lead-date">{formatDate(lead.updatedAt)}</span>
                        </td>

                        <td>
                          <div className="lead-actions">
                            <button type="button" className="lead-action-btn" title="View lead" onClick={() => openView(lead)}>
                              <Eye size={14} />
                            </button>

                            <button type="button" className="lead-action-btn" title="Edit lead" disabled={!canUpdate} onClick={() => openEdit(lead)}>
                              <Pencil size={14} />
                            </button>

                            <button type="button" className="lead-action-btn" title="Assign lead" disabled={!canAssign} onClick={() => openAssign(lead)}>
                              <UserCheck size={14} />
                            </button>

                            {lead.status !== "CONVERTED" && (
                              <button type="button" className="lead-action-btn" title="Convert lead" disabled={!canConvert} onClick={() => openConvert(lead)}>
                                <CircleDollarSign size={14} />
                              </button>
                            )}

                            <button type="button" className="lead-action-btn danger" title="Delete lead" disabled={actionLoading || !canDelete} onClick={() => handleDelete(lead)}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="leads-pagination">
            <div className="leads-pagination-info">
              Showing {leads.length ? (currentPage - 1) * Number(pagination.limit || 10) + 1 : 0} - {(currentPage - 1) * Number(pagination.limit || 10) + leads.length} of {Number(pagination.total || leads.length).toLocaleString("en-IN")} leads
            </div>

            <div className="leads-pagination-actions">
              <button type="button" className="leads-pagination-btn" disabled={loading || currentPage <= 1} onClick={() => loadLeads(currentPage - 1)}>
                <ChevronLeft size={13} />
                Previous
              </button>

              <span className="leads-page-number">
                Page {currentPage} of {totalPages}
              </span>

              <button type="button" className="leads-pagination-btn" disabled={loading || currentPage >= totalPages} onClick={() => loadLeads(currentPage + 1)}>
                Next
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        </section>

        <div className="leads-footer-note">
          <Target size={11} />
          Lead management is connected to your BR30 CRM business workspace.
        </div>
      </section>

      {modal && (
        <div
          className="leads-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !saving && !actionLoading) {
              setModal(null);
            }
          }}>
          <div className={`leads-modal ${modal.mode === "view" ? "large" : ""} ${modal.mode === "assign" || modal.mode === "convert" ? "compact" : ""}`}>
            <div className="leads-modal-head">
              <div className="leads-modal-title-wrap">
                <div className="leads-modal-eyebrow">{modal.mode === "create" ? "New prospect" : modal.mode === "edit" ? "Lead management" : modal.mode === "assign" ? "Lead assignment" : modal.mode === "convert" ? "Lead conversion" : "Lead details"}</div>

                <h2 className="leads-modal-title">{modal.mode === "create" ? "Add lead" : modal.mode === "edit" ? "Edit lead" : modal.mode === "assign" ? "Assign lead" : modal.mode === "convert" ? "Convert lead" : getLeadName(modal.lead)}</h2>

                {modal.mode === "view" && modal.lead?.email && <p className="leads-modal-subtitle">{modal.lead.email}</p>}
              </div>

              <button type="button" className="leads-modal-close" disabled={saving || actionLoading} onClick={() => setModal(null)} aria-label="Close">
                <X size={17} />
              </button>
            </div>

            <div className="leads-modal-body">
              {modal.mode === "create" || modal.mode === "edit" ? (
                <LeadForm form={form} setForm={setForm} onSubmit={saveLead} onCancel={() => setModal(null)} saving={saving} mode={modal.mode} tags={tags} tagsLoading={tagsLoading} />
              ) : modal.mode === "view" ? (
                modal.loading ? (
                  <div className="leads-view-loading">
                    <span className="leads-spinner" />
                    Loading latest lead details...
                  </div>
                ) : (
                  <div className="leads-view">
                    <div className="leads-profile-card">
                      <div className="leads-profile-avatar">{getInitials(modal.lead)}</div>

                      <div>
                        <div className="leads-profile-name">{getLeadName(modal.lead)}</div>

                        <div className="leads-profile-company">{modal.lead?.companyName || modal.lead?.jobTitle || "Lead prospect"}</div>
                      </div>

                      <div className="leads-profile-badges">
                        <StatusBadge status={modal.lead?.status} />

                        <RatingBadge rating={modal.lead?.rating} />
                      </div>
                    </div>

                    <div className="leads-view-grid">
                      <div className="leads-view-item">
                        <div className="leads-view-label">Email</div>

                        <div className="leads-view-value">{modal.lead?.email || "—"}</div>
                      </div>

                      <div className="leads-view-item">
                        <div className="leads-view-label">Phone</div>

                        <div className="leads-view-value">{modal.lead?.phone || "—"}</div>
                      </div>

                      <div className="leads-view-item">
                        <div className="leads-view-label">Company</div>

                        <div className="leads-view-value">{modal.lead?.companyName || "—"}</div>
                      </div>

                      <div className="leads-view-item">
                        <div className="leads-view-label">Job title</div>

                        <div className="leads-view-value">{modal.lead?.jobTitle || "—"}</div>
                      </div>

                      <div className="leads-view-item">
                        <div className="leads-view-label">Source</div>

                        <div className="leads-view-value">{formatSource(modal.lead?.source)}</div>
                      </div>

                      <div className="leads-view-item">
                        <div className="leads-view-label">Created</div>

                        <div className="leads-view-value">{formatDate(modal.lead?.createdAt)}</div>
                      </div>

                      <div className="leads-view-item">
                        <div className="leads-view-label">Last contacted</div>

                        <div className="leads-view-value">{formatDate(modal.lead?.lastContactedAt)}</div>
                      </div>

                      <div className="leads-view-item">
                        <div className="leads-view-label">Converted</div>

                        <div className="leads-view-value">{formatDate(modal.lead?.convertedAt)}</div>
                      </div>

                      <div className="leads-view-item">
                        <div className="leads-view-label">Assigned user</div>
                        <div className="leads-view-value">{modal.lead?.assignedTo?.name || modal.lead?.assignedTo?.email || (typeof modal.lead?.assignedTo === "string" ? modal.lead.assignedTo : "Unassigned")}</div>
                      </div>

                      <div className="leads-view-item">
                        <div className="leads-view-label">Assigned team</div>
                        <div className="leads-view-value">{modal.lead?.assignedTeamId?.name || modal.lead?.assignedTeamId?.slug || (typeof modal.lead?.assignedTeamId === "string" ? modal.lead.assignedTeamId : "Unassigned")}</div>
                      </div>

                      <div className="leads-view-item">
                        <div className="leads-view-label">Tags</div>
                        <div className="leads-view-value">{normaliseTags(modal.lead?.tags) || "—"}</div>
                      </div>

                      <div className="leads-view-item">
                        <div className="leads-view-label">Created / updated</div>
                        <div className="leads-view-value">
                          Created {formatDate(modal.lead?.createdAt)} • Updated {formatDate(modal.lead?.updatedAt)}
                        </div>
                      </div>

                      <div className="leads-view-item">
                        <div className="leads-view-label">Created by</div>
                        <div className="leads-view-value">{modal.lead?.createdBy?.name || modal.lead?.createdBy?.email || "—"}</div>
                      </div>

                      <div className="leads-view-item">
                        <div className="leads-view-label">Updated by</div>
                        <div className="leads-view-value">{modal.lead?.updatedBy?.name || modal.lead?.updatedBy?.email || "—"}</div>
                      </div>

                      <div className="leads-view-item">
                        <div className="leads-view-label">Converted contact</div>
                        <div className="leads-view-value">{modal.lead?.convertedContactId ? [modal.lead.convertedContactId?.firstName, modal.lead.convertedContactId?.lastName].filter(Boolean).join(" ") || modal.lead.convertedContactId?.email || "Available" : "—"}</div>
                      </div>

                      <div className="leads-view-item">
                        <div className="leads-view-label">Converted company</div>
                        <div className="leads-view-value">{modal.lead?.convertedCompanyId?.name || "—"}</div>
                      </div>

                      <div className="leads-view-item">
                        <div className="leads-view-label">Converted deal</div>
                        <div className="leads-view-value">{modal.lead?.convertedDealId ? modal.lead.convertedDealId?.name || modal.lead.convertedDealId?._id || "Available" : "—"}</div>
                      </div>

                      <div className="leads-view-item full">
                        <div className="leads-view-label">Custom fields</div>
                        <div className="leads-view-value leads-description">{Object.keys(modal.lead?.customFields || {}).length ? JSON.stringify(modal.lead.customFields, null, 2) : "—"}</div>
                      </div>

                      <div className="leads-view-item full">
                        <div className="leads-view-label">Description</div>

                        <div className="leads-view-value leads-description">{modal.lead?.description || "No description added."}</div>
                      </div>
                    </div>

                    <div className="leads-modal-footer">
                      <button type="button" className="leads-btn" onClick={() => setModal(null)}>
                        Close
                      </button>

                      <button type="button" className="leads-btn" disabled={!canUpdate} onClick={() => openEdit(modal.lead)}>
                        <Pencil size={14} />
                        Edit
                      </button>

                      <button type="button" className="leads-btn primary" disabled={!canAssign} onClick={() => openAssign(modal.lead)}>
                        <UserCheck size={14} />
                        Assign
                      </button>
                    </div>
                  </div>
                )
              ) : modal.mode === "assign" ? (
                <AssignLeadContent lead={modal.lead} assignForm={assignForm} setAssignForm={setAssignForm} members={members} teams={teams} loadingOptions={assignmentOptionsLoading} actionLoading={actionLoading} onCancel={() => setModal(null)} onSubmit={handleAssign} />
              ) : (
                <>
                  <div className="leads-action-content">
                    <p className="leads-action-message">
                      Convert <strong>{getLeadName(modal.lead)}</strong> into a contact.
                    </p>

                    <div className="leads-action-field">
                      <label>
                        Existing company ID
                        <span
                          style={{
                            color: "var(--crm-muted)",
                            fontWeight: 400,
                            marginLeft: 5,
                          }}>
                          (optional)
                        </span>
                      </label>

                      <input value={convertCompanyId} onChange={(event) => setConvertCompanyId(event.target.value)} placeholder="MongoDB company ID" />
                    </div>

                    <div className="leads-action-note">Leave the company ID blank to let the backend create a company when applicable. The current backend conversion flow will create the contact and mark the lead as converted.</div>
                  </div>

                  <div className="leads-modal-footer">
                    <button type="button" className="leads-btn" disabled={actionLoading} onClick={() => setModal(null)}>
                      Cancel
                    </button>

                    <button type="button" className="leads-btn primary" disabled={actionLoading} onClick={handleConvert}>
                      {actionLoading ? (
                        <>
                          <span className="leads-spinner small" />
                          Converting...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={14} />
                          Convert lead
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    {assigneeDetail ? <AssigneeDetailsPopup detail={assigneeDetail} onClose={() => setAssigneeDetail(null)} /> : null}
    </>
  );
}
