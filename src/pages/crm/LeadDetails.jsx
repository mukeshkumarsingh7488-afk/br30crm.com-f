import { useCallback, useEffect, useRef, useState } from "react";
import { AlertCircle, ArrowLeft, BriefcaseBusiness, Check, CheckCircle2, ChevronDown, Clock3, Edit3, Flame, Mail, Phone, RefreshCw, Search, Trash2, UserCheck, UsersRound, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import useBusiness from "../../hooks/useBusiness";
import api from "../../api/api";
import { assignLead, convertLead, deleteLead, getLeadById, updateLead } from "../../api/lead.api";
import { getBusinessMembers } from "../../api/crm.api";
import { getTeams } from "../../api/operations.api";
import { showAuthAlert } from "../../components/auth/authAlert";

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
  { value: "website", label: "Website" },
  { value: "referral", label: "Referral" },
  { value: "social media", label: "Social Media" },
  { value: "campaign", label: "Campaign" },
  { value: "import", label: "Import" },
  { value: "manual", label: "Manual" },
];

const getErrorMessage = (error, fallback = "Something went wrong.") => {
  const data = error?.response?.data;
  if (Array.isArray(data?.details) && data.details.length) {
    return data.details
      .map((item) => item?.message)
      .filter(Boolean)
      .join(", ");
  }
  return data?.message || data?.error?.message || data?.error || error?.message || fallback;
};

const showErrorAlert = (title, text) =>
  showAuthAlert({
    icon: "error",
    title,
    text,
    confirmButtonText: "OK",
  });

const getLeadName = (lead) => {
  const name = String(lead?.name || "").trim();
  if (name) return name;
  return [lead?.firstName, lead?.lastName].filter(Boolean).join(" ").trim() || "Unnamed lead";
};

const getInitials = (lead) =>
  getLeadName(lead)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "LD";

const formatDate = (value, includeTime = false) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-IN", includeTime ? { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" } : { day: "2-digit", month: "short", year: "numeric" });
};

const formatSource = (value) =>
  value
    ? String(value)
        .replace(/[_-]+/g, " ")
        .replace(/\s+/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase())
    : "—";

const statusLabel = (value) => STATUS_OPTIONS.find((item) => item.value === value)?.label || value || "—";
const ratingLabel = (value) => RATING_OPTIONS.find((item) => item.value === value)?.label || value || "—";

const getTagId = (tag) => (typeof tag === "string" ? tag : tag?._id || tag?.id || tag?.tagId || "");
const getTagName = (tag) => (typeof tag === "string" ? "" : tag?.name || tag?.title || tag?.label || tag?.slug || "Unnamed tag");
const normalizeTagIds = (value) => (Array.isArray(value) ? value.map(getTagId).filter(Boolean).map(String) : []);
const getTagDisplayNames = (value) => (Array.isArray(value) ? value.map(getTagName).filter(Boolean) : []);

const normaliseCustomFields = (value) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return "";
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return "";
  }
};

const parseCustomFields = (value) => {
  const raw = String(value || "").trim();
  if (!raw) return {};
  const parsed = JSON.parse(raw);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Custom fields must be a JSON object.");
  }
  return parsed;
};

const getAssignedUserName = (value) => {
  const user = value?.userId && typeof value.userId === "object" ? value.userId : value;
  if (!user) return typeof value === "string" ? value : "";
  return [user.firstName, user.lastName].filter(Boolean).join(" ").trim() || user.name || user.fullName || user.email || "";
};

const getAssignedTeamName = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value.name || value.title || value.teamName || value.slug || "";
};

function StatusBadge({ value }) {
  const safe = String(value || "NEW").toLowerCase();
  return <span className={`ld-badge status-${safe}`}>{statusLabel(value)}</span>;
}

function RatingBadge({ value }) {
  const safe = String(value || "WARM").toLowerCase();
  return (
    <span className={`ld-badge rating-${safe}`}>
      {String(value || "").toUpperCase() === "HOT" && <Flame size={11} />}
      {ratingLabel(value)}
    </span>
  );
}

function TagDropdown({ value = [], options = [], loading, disabled, onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef(null);
  const selected = normalizeTagIds(value);

  useEffect(() => {
    if (!open) return undefined;
    const handleOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  const selectedOptions = selected.map((id) => options.find((tag) => String(getTagId(tag)) === String(id))).filter(Boolean);
  const filtered = options.filter((tag) => `${getTagName(tag)} ${tag?.slug || ""}`.toLowerCase().includes(query.trim().toLowerCase()));
  const toggle = (tag) => {
    const id = String(getTagId(tag));
    if (!id) return;
    onChange(selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id]);
  };

  return (
    <div className="ld-tag-select" ref={ref}>
      <button type="button" className="ld-tag-trigger" disabled={disabled} onClick={() => setOpen((value) => !value)}>
        <span>{selectedOptions.length ? selectedOptions.map(getTagName).join(", ") : loading ? "Loading tags..." : "Select tags"}</span>
        <ChevronDown size={14} />
      </button>
      {selectedOptions.length > 0 && (
        <div className="ld-selected-tags">
          {selectedOptions.map((tag) => (
            <span className="ld-tag-chip" key={String(getTagId(tag))}>
              {getTagName(tag)}
              <button type="button" aria-label={`Remove ${getTagName(tag)}`} onClick={() => toggle(tag)}>
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
      )}
      {open && (
        <div className="ld-tag-menu">
          <div className="ld-tag-search">
            <Search size={13} />
            <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tags..." />
            {query && (
              <button type="button" onClick={() => setQuery("")}>
                <X size={12} />
              </button>
            )}
          </div>
          {loading ? (
            <div className="ld-assignment-empty">Loading tags...</div>
          ) : filtered.length ? (
            filtered.map((tag) => {
              const id = String(getTagId(tag));
              const checked = selected.includes(id);
              return (
                <button type="button" className={`ld-assignment-option ${checked ? "selected" : ""}`} key={id} onClick={() => toggle(tag)}>
                  <span className={`ld-tag-check ${checked ? "checked" : ""}`}>{checked && <Check size={10} />}</span>
                  <span>
                    <strong>{getTagName(tag)}</strong>
                    {tag?.slug && tag.slug !== getTagName(tag) && <small>{tag.slug}</small>}
                  </span>
                </button>
              );
            })
          ) : (
            <div className="ld-assignment-empty">No tags found.</div>
          )}
        </div>
      )}
    </div>
  );
}

function AssignmentPicker({ title, icon: Icon, value, options, type, onChange, loading }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const handleOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  const getMemberId = (item) => item?._id || item?.id || item?.userId?._id || item?.userId || "";
  const getMemberName = (item) => {
    const user = item?.userId && typeof item.userId === "object" ? item.userId : item;
    return [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() || user?.name || user?.fullName || user?.email || "Unnamed user";
  };
  const getMemberEmail = (item) => {
    const user = item?.userId && typeof item.userId === "object" ? item.userId : item;
    return user?.email || item?.email || "";
  };
  const getTeamId = (item) => item?._id || item?.id || "";
  const getTeamName = (item) => item?.name || item?.title || item?.teamName || "Unnamed team";

  const getId = type === "user" ? getMemberId : getTeamId;
  const getName = type === "user" ? getMemberName : getTeamName;
  const getSecondary = type === "user" ? getMemberEmail : (item) => item?.slug || "";

  const selected = options.find((item) => String(getId(item)) === String(value || ""));
  const filtered = options.filter((item) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return `${getName(item)} ${getSecondary(item)}`.toLowerCase().includes(q);
  });

  return (
    <div className="ld-assignment" ref={ref}>
      <label>{title}</label>
      <button type="button" className="ld-assignment-trigger" disabled={loading} onClick={() => setOpen((v) => !v)}>
        <Icon size={14} />
        <span>{selected ? getName(selected) : `Select ${type}`}</span>
        <ChevronDown size={14} />
      </button>

      {open && (
        <div className="ld-assignment-menu">
          <div className="ld-assignment-search">
            <Search size={13} />
            <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${type}...`} />
            {query && (
              <button type="button" onClick={() => setQuery("")}>
                <X size={13} />
              </button>
            )}
          </div>

          <button
            type="button"
            className={`ld-assignment-option ${!value ? "selected" : ""}`}
            onClick={() => {
              onChange("");
              setOpen(false);
              setQuery("");
            }}>
            <Icon size={14} />
            <span>
              <strong>Unassigned</strong>
              <small>Remove {type} assignment</small>
            </span>
          </button>

          {filtered.map((item) => {
            const id = getId(item);
            if (!id) return null;
            return (
              <button
                type="button"
                key={id}
                className={`ld-assignment-option ${String(value) === String(id) ? "selected" : ""}`}
                onClick={() => {
                  onChange(id);
                  setOpen(false);
                  setQuery("");
                }}>
                <Icon size={14} />
                <span>
                  <strong>{getName(item)}</strong>
                  {getSecondary(item) && <small>{getSecondary(item)}</small>}
                </span>
              </button>
            );
          })}

          {!filtered.length && <div className="ld-assignment-empty">No {type}s found.</div>}
        </div>
      )}
    </div>
  );
}

function LeadEditModal({ lead, onClose, onSaved, businessId, tags, tagsLoading }) {
  const [form, setForm] = useState({
    firstName: lead?.firstName || "",
    lastName: lead?.lastName || "",
    name: lead?.name || "",
    email: lead?.email || "",
    phone: lead?.phone || "",
    companyName: lead?.companyName || "",
    jobTitle: lead?.jobTitle || "",
    source: lead?.source || "manual",
    status: lead?.status || "NEW",
    rating: lead?.rating || "WARM",
    description: lead?.description || "",
    tags: normalizeTagIds(lead?.tags),
    customFields: normaliseCustomFields(lead?.customFields),
  });
  const [saving, setSaving] = useState(false);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async () => {
    if (!form.firstName.trim() && !form.lastName.trim() && !form.name.trim()) {
      await showErrorAlert("Lead validation", "Please provide a first name, last name, or display name.");
      return;
    }

    let customFields;
    try {
      customFields = parseCustomFields(form.customFields);
    } catch (error) {
      await showErrorAlert("Invalid custom fields", error?.message || "Custom fields must be valid JSON.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        firstName: form.firstName.trim() || null,
        lastName: form.lastName.trim() || null,
        name: form.name.trim() || null,
        email: form.email.trim() || null,
        phone: form.phone.trim() || null,
        companyName: form.companyName.trim() || null,
        jobTitle: form.jobTitle.trim() || null,
        source: form.source || "manual",
        status: form.status || "NEW",
        rating: form.rating || "WARM",
        description: form.description.trim() || null,
        tags: normalizeTagIds(form.tags),
        customFields,
      };

      await updateLead(businessId, lead._id, payload);
      await showAuthAlert({ icon: "success", title: "Lead updated", text: "The lead has been updated successfully.", confirmButtonText: "Done" });
      onSaved();
    } catch (error) {
      await showErrorAlert("Unable to update lead", getErrorMessage(error, "Please check the entered information and try again."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="ld-backdrop" onMouseDown={(event) => event.target === event.currentTarget && !saving && onClose()}>
      <div className="ld-modal">
        <div className="ld-modal-head">
          <div>
            <div className="ld-eyebrow">Lead management</div>
            <h2>Edit lead</h2>
          </div>
          <button type="button" className="ld-close" onClick={onClose} disabled={saving}>
            <X size={17} />
          </button>
        </div>

        <div className="ld-modal-body">
          <div className="ld-form">
            {[
              ["firstName", "First name", "Rahul"],
              ["lastName", "Last name", "Sharma"],
              ["name", "Display name", "Optional display name"],
              ["email", "Email", "rahul@example.com"],
              ["phone", "Phone", "+91 99999 99999"],
              ["companyName", "Company", "Company name"],
              ["jobTitle", "Job title", "Sales Manager"],
            ].map(([key, label, placeholder]) => (
              <div className={`ld-field ${key === "name" ? "full" : ""}`} key={key}>
                <label>{label}</label>
                <input type={key === "email" ? "email" : "text"} value={form[key]} onChange={(event) => update(key, event.target.value)} placeholder={placeholder} />
              </div>
            ))}

            <div className="ld-field full">
              <label>Tags</label>
              <TagDropdown value={form.tags} options={tags} loading={tagsLoading} disabled={saving} onChange={(value) => update("tags", value)} />
              <span className="ld-help">Select one or more existing business tags.</span>
            </div>

            <div className="ld-field">
              <label>Lead source</label>
              <div className="ld-select-wrap">
                <select value={form.source} onChange={(event) => update("source", event.target.value)}>
                  {SOURCE_OPTIONS.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} />
              </div>
            </div>

            <div className="ld-field">
              <label>Status</label>
              <div className="ld-select-wrap">
                <select value={form.status} onChange={(event) => update("status", event.target.value)}>
                  {STATUS_OPTIONS.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} />
              </div>
            </div>

            <div className="ld-field">
              <label>Rating</label>
              <div className="ld-select-wrap">
                <select value={form.rating} onChange={(event) => update("rating", event.target.value)}>
                  {RATING_OPTIONS.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} />
              </div>
            </div>

            <div className="ld-field full">
              <label>Description</label>
              <textarea rows={5} value={form.description} onChange={(event) => update("description", event.target.value)} placeholder="Notes, requirements, conversation context..." />
            </div>

            <div className="ld-field full">
              <label>Custom fields</label>
              <textarea rows={6} value={form.customFields} onChange={(event) => update("customFields", event.target.value)} placeholder='{"industry":"Finance","budget":"50000"}' />
              <span className="ld-help">Optional JSON object.</span>
            </div>
          </div>
        </div>

        <div className="ld-modal-footer">
          <button type="button" className="ld-btn" disabled={saving} onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="ld-btn primary" disabled={saving} onClick={submit}>
            {saving ? (
              <>
                <span className="ld-spinner small" /> Saving...
              </>
            ) : (
              <>
                <Check size={14} /> Save changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function AssignModal({ lead, members, teams, loading, onClose, onSaved, businessId }) {
  const [assignedTo, setAssignedTo] = useState(lead?.assignedTo?._id || lead?.assignedTo || "");
  const [assignedTeamId, setAssignedTeamId] = useState(lead?.assignedTeamId?._id || lead?.assignedTeamId || "");
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!assignedTo && !assignedTeamId) {
      await showErrorAlert("Assignment required", "Select a user or team. The current Lead API does not allow both assignments to be empty.");
      return;
    }

    setSaving(true);
    try {
      await assignLead(businessId, lead._id, assignedTo || null, assignedTeamId || null);
      await showAuthAlert({ icon: "success", title: "Assignment updated", text: "The lead assignment has been updated successfully.", confirmButtonText: "Done" });
      onSaved();
    } catch (error) {
      await showErrorAlert("Unable to assign lead", getErrorMessage(error, "The lead assignment could not be updated."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="ld-backdrop" onMouseDown={(event) => event.target === event.currentTarget && !saving && onClose()}>
      <div className="ld-modal">
        <div className="ld-modal-head">
          <div>
            <div className="ld-eyebrow">Lead assignment</div>
            <h2>Assign lead</h2>
            <p>{getLeadName(lead)}</p>
          </div>
          <button type="button" className="ld-close" onClick={onClose} disabled={saving}>
            <X size={17} />
          </button>
        </div>

        <div className="ld-modal-body">
          <div className="ld-form">
            <AssignmentPicker title="Assigned user" icon={UserCheck} value={assignedTo} options={members} type="user" onChange={setAssignedTo} loading={loading || saving} />
            <AssignmentPicker title="Assigned team" icon={UsersRound} value={assignedTeamId} options={teams} type="team" onChange={setAssignedTeamId} loading={loading || saving} />
          </div>
          <div className="ld-assignment-note">Search business members by name/email and teams by name. At least one assignment must remain because of the current Lead API contract.</div>
        </div>

        <div className="ld-modal-footer">
          <button type="button" className="ld-btn" disabled={saving} onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="ld-btn primary" disabled={saving || loading} onClick={submit}>
            {saving ? (
              <>
                <span className="ld-spinner small" /> Updating...
              </>
            ) : (
              <>
                <UserCheck size={14} /> Update assignment
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LeadDetails() {
  const { leadId, id } = useParams();
  const resolvedLeadId = leadId || id;
  const navigate = useNavigate();
  const { businessId, loading: businessLoading, error: businessError } = useBusiness();

  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [members, setMembers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagsLoading, setTagsLoading] = useState(false);
  const [assignmentLoading, setAssignmentLoading] = useState(false);
  const [modal, setModal] = useState(null);

  const loadLead = useCallback(async () => {
    if (!businessId || !resolvedLeadId) return;

    setLoading(true);
    setPageError("");

    try {
      const response = await getLeadById(businessId, resolvedLeadId);
      const data = response?.data?.lead || response?.lead || response?.data || response;
      setLead(data);
    } catch (error) {
      const message = getErrorMessage(error, "Unable to load lead details.");
      setPageError(message);
      setLead(null);
      await showErrorAlert("Unable to load lead", message);
    } finally {
      setLoading(false);
    }
  }, [businessId, resolvedLeadId]);

  const loadAssignmentOptions = useCallback(async () => {
    if (!businessId) return;

    setAssignmentLoading(true);
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
      await showErrorAlert("Assignment options unavailable", getErrorMessage(error, "Unable to load users and teams."));
    } finally {
      setAssignmentLoading(false);
    }
  }, [businessId]);

  const loadTags = useCallback(async () => {
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
    if (businessId && resolvedLeadId) loadLead();
  }, [businessId, resolvedLeadId, loadLead]);

  useEffect(() => {
    if (businessId) loadTags();
  }, [businessId, loadTags]);

  useEffect(() => {
    if (businessError && !businessId && !businessLoading) {
      showErrorAlert("Business unavailable", businessError || "Unable to load your business workspace.");
    }
  }, [businessError, businessId, businessLoading]);

  const openAssign = async () => {
    setModal("assign");
    await loadAssignmentOptions();
  };

  const handleDelete = async () => {
    if (!lead) return;

    const result = await showAuthAlert({
      icon: "warning",
      title: "Delete this lead?",
      text: `${getLeadName(lead)} will be permanently removed from this business.`,
      showCancelButton: true,
      confirmButtonText: "Delete lead",
      cancelButtonText: "Cancel",
    });

    if (!result?.isConfirmed) return;

    try {
      await deleteLead(businessId, lead._id);
      await showAuthAlert({ icon: "success", title: "Lead deleted", text: "The lead has been removed successfully.", confirmButtonText: "Done" });
      navigate("/crm/leads");
    } catch (error) {
      await showErrorAlert("Unable to delete lead", getErrorMessage(error, "The lead could not be deleted."));
    }
  };

  const handleConvert = async () => {
    if (!lead) return;

    if (!lead.firstName && !lead.name) {
      await showErrorAlert("First name required", "This lead needs a first name or display name before it can be converted.");
      return;
    }

    const result = await showAuthAlert({
      icon: "warning",
      title: "Convert this lead?",
      text: `${getLeadName(lead)} will be converted into a contact.`,
      showCancelButton: true,
      confirmButtonText: "Convert lead",
      cancelButtonText: "Cancel",
    });

    if (!result?.isConfirmed) return;

    try {
      await convertLead(businessId, lead._id, {});
      await showAuthAlert({ icon: "success", title: "Lead converted", text: "The lead has been converted to a contact successfully.", confirmButtonText: "Done" });
      await loadLead();
    } catch (error) {
      await showErrorAlert("Unable to convert lead", getErrorMessage(error, "The lead could not be converted."));
    }
  };

  if (loading || businessLoading) {
    return (
      <>
        <style>{`.ld-page{padding:28px 30px;color:var(--crm-text)}.ld-loading{min-height:420px;display:flex;align-items:center;justify-content:center;gap:9px;color:var(--crm-muted);font-size:13px}.ld-spinner{width:17px;height:17px;border:2px solid var(--crm-border);border-top-color:var(--crm-primary);border-radius:50%;animation:ld-spin .75s linear infinite;display:inline-block}.ld-spinner.small{width:13px;height:13px}@keyframes ld-spin{to{transform:rotate(360deg)}}`}</style>
        <section className="ld-page">
          <div className="ld-loading">
            <span className="ld-spinner" /> Loading lead details...
          </div>
        </section>
      </>
    );
  }

  if (!lead) {
    return (
      <>
        <style>{`.ld-page{padding:28px 30px;color:var(--crm-text)}.ld-empty{min-height:420px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;color:var(--crm-muted);gap:10px}.ld-empty strong{color:var(--crm-text);font-size:16px}.ld-empty button{height:38px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:9px;padding:0 13px;cursor:pointer}`}</style>
        <section className="ld-page">
          <div className="ld-empty">
            <AlertCircle size={28} />
            <strong>Lead not found</strong>
            <span>{pageError || "This lead could not be loaded."}</span>
            <button type="button" onClick={() => navigate("/crm/leads")}>
              <ArrowLeft size={14} /> Back to leads
            </button>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <style>{`
        .ld-page{padding:28px 30px 42px;max-width:1500px;margin:0 auto;color:var(--crm-text)}
        .ld-head{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;margin-bottom:18px}
        .ld-head-left{min-width:0}
        .ld-back{height:34px;border:0;background:transparent;color:var(--crm-muted);display:inline-flex;align-items:center;gap:6px;padding:0;margin-bottom:12px;font-size:13px;font-weight:400;cursor:pointer}
        .ld-back:hover{color:var(--crm-text)}
        .ld-eyebrow{font-size:13px;color:var(--crm-primary);font-weight:400;text-transform:uppercase;letter-spacing:.12em;margin-bottom:6px}
        .ld-title{font-size:28px;line-height:1.15;letter-spacing:-.7px;margin:0;color:var(--crm-text);font-weight:400}
        .ld-subtitle{margin:7px 0 0;color:var(--crm-muted);font-size:13px}
        .ld-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap;justify-content:flex-end}
        .ld-btn{height:39px;padding:0 13px;border-radius:9px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);font-size:13px;font-weight:400;display:inline-flex;align-items:center;justify-content:center;gap:7px;cursor:pointer;white-space:nowrap}
        .ld-btn:hover:not(:disabled){border-color:var(--crm-primary);background:var(--crm-surface-2)}
        .ld-btn.primary{border-color:var(--crm-primary);background:var(--crm-primary);color:#fff}.ld-btn.danger{color:var(--crm-danger)}.ld-btn:disabled{opacity:.55;cursor:not-allowed}
        .ld-error{margin-bottom:14px;padding:10px 12px;border-radius:9px;background:color-mix(in srgb,var(--crm-danger) 10%,transparent);border:1px solid color-mix(in srgb,var(--crm-danger) 20%,transparent);color:var(--crm-danger);font-size:13px;display:flex;gap:8px;align-items:flex-start}
        .ld-layout{display:grid;grid-template-columns:minmax(0,1fr) 330px;gap:14px}
        .ld-card{background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:14px;box-shadow:var(--crm-shadow);overflow:hidden}
        .ld-profile{padding:20px;display:flex;align-items:center;gap:13px;background:var(--crm-surface-2);border-bottom:1px solid var(--crm-border)}
        .ld-avatar{width:52px;height:52px;border-radius:14px;background:var(--crm-primary-soft);color:var(--crm-primary);display:grid;place-items:center;font-size:15px;font-weight:400;flex-shrink:0}
        .ld-profile-name{font-size:19px;font-weight:400;color:var(--crm-text)}.ld-profile-sub{font-size:13px;color:var(--crm-muted);margin-top:4px}
        .ld-profile-badges{margin-left:auto;display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end}
        .ld-badge{display:inline-flex;align-items:center;gap:4px;padding:5px 8px;border-radius:7px;font-size:13px;font-weight:400;white-space:nowrap}
        .ld-badge.status-new{color:var(--crm-primary);background:var(--crm-primary-soft)}.ld-badge.status-contacted{color:var(--crm-warning);background:color-mix(in srgb,var(--crm-warning) 11%,transparent)}.ld-badge.status-qualified,.ld-badge.status-converted{color:var(--crm-success);background:color-mix(in srgb,var(--crm-success) 11%,transparent)}.ld-badge.status-unqualified{color:var(--crm-muted);background:var(--crm-surface)}.ld-badge.status-lost{color:var(--crm-danger);background:color-mix(in srgb,var(--crm-danger) 10%,transparent)}
        .ld-badge.rating-hot{color:var(--crm-danger);background:color-mix(in srgb,var(--crm-danger) 10%,transparent)}.ld-badge.rating-warm{color:var(--crm-warning);background:color-mix(in srgb,var(--crm-warning) 11%,transparent)}.ld-badge.rating-cold{color:var(--crm-muted);background:var(--crm-surface)}
        .ld-section{padding:18px 20px;border-bottom:1px solid var(--crm-border)}.ld-section:last-child{border-bottom:0}.ld-section-title{font-size:13px;font-weight:400;color:var(--crm-text);margin-bottom:12px;display:flex;align-items:center;gap:7px}.ld-section-title svg{color:var(--crm-primary)}
        .ld-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.ld-item{padding:11px;border:1px solid var(--crm-border);border-radius:9px;background:var(--crm-surface)}.ld-item.full{grid-column:1/-1}.ld-label{font-size:13px;text-transform:uppercase;letter-spacing:.07em;color:var(--crm-muted);font-weight:400}.ld-value{font-size:13px;color:var(--crm-text);font-weight:400;margin-top:5px;word-break:break-word}.ld-description{white-space:pre-wrap;line-height:1.6;font-weight:400}
        .ld-side-list{display:grid;gap:9px}.ld-side-item{padding:11px;border:1px solid var(--crm-border);border-radius:9px}.ld-side-label{font-size:13px;text-transform:uppercase;letter-spacing:.07em;color:var(--crm-muted);font-weight:400}.ld-side-value{font-size:13px;color:var(--crm-text);font-weight:400;margin-top:5px;word-break:break-word}.ld-assignee{display:flex;align-items:center;gap:7px}.ld-assignee-icon{width:26px;height:26px;border-radius:8px;background:var(--crm-primary-soft);color:var(--crm-primary);display:grid;place-items:center;flex-shrink:0}
        .ld-tags{display:flex;gap:6px;flex-wrap:wrap}.ld-tag{padding:4px 7px;border-radius:6px;background:var(--crm-primary-soft);color:var(--crm-primary);font-size:13px;font-weight:400}
        .ld-json{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:13px;line-height:1.5;white-space:pre-wrap}
        .ld-ref{display:flex;align-items:center;justify-content:space-between;gap:8px}.ld-ref button{border:0;background:transparent;color:var(--crm-primary);font-size:13px;font-weight:400;cursor:pointer}
        .ld-backdrop{position:fixed;inset:0;background:rgba(15,23,42,.52);display:grid;place-items:center;padding:20px;z-index:1100;backdrop-filter:blur(3px)}
        .ld-modal{width:min(760px,100%);max-height:92vh;overflow:hidden;background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:15px;box-shadow:0 30px 90px rgba(0,0,0,.28);display:flex;flex-direction:column}.ld-modal-head{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:18px 20px;border-bottom:1px solid var(--crm-border)}.ld-modal-head h2{margin:0;font-size:16px;color:var(--crm-text);font-weight:400}.ld-modal-head p{margin:4px 0 0;font-size:13px;color:var(--crm-muted)}.ld-close{width:32px;height:32px;border:0;background:transparent;color:var(--crm-muted);border-radius:8px;display:grid;place-items:center;cursor:pointer}.ld-close:hover{background:var(--crm-surface-2);color:var(--crm-text)}
        .ld-modal-body{overflow:auto}.ld-form{padding:20px;display:grid;grid-template-columns:1fr 1fr;gap:14px}.ld-field{display:grid;gap:6px;min-width:0}.ld-field.full{grid-column:1/-1}.ld-field label,.ld-assignment label{font-size:13px;font-weight:400;color:var(--crm-text)}.ld-field input,.ld-field select,.ld-field textarea{width:100%;box-sizing:border-box;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:9px;padding:10px 11px;outline:0;font-size:13px}.ld-field textarea{resize:vertical;line-height:1.55}.ld-field input:focus,.ld-field select:focus,.ld-field textarea:focus{border-color:var(--crm-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--crm-primary) 9%,transparent)}.ld-select-wrap{position:relative}.ld-select-wrap select{appearance:none;padding-right:34px}.ld-select-wrap svg{position:absolute;right:11px;top:12px;color:var(--crm-muted);pointer-events:none}.ld-help{font-size:13px;color:var(--crm-muted)}
        .ld-tag-select{position:relative}.ld-tag-trigger{width:100%;min-height:40px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:9px;padding:0 11px;display:flex;align-items:center;gap:8px;text-align:left;cursor:pointer;font-size:13px}.ld-tag-trigger span{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.ld-tag-trigger>svg{margin-left:auto;color:var(--crm-muted);flex-shrink:0}.ld-tag-trigger:hover{border-color:var(--crm-primary);background:var(--crm-surface-2)}.ld-selected-tags{display:flex;flex-wrap:wrap;gap:5px;margin-top:6px}.ld-tag-chip{display:inline-flex;align-items:center;gap:4px;padding:4px 7px;border-radius:7px;background:var(--crm-primary-soft);color:var(--crm-primary);font-size:13px;font-weight:400}.ld-tag-chip button{width:15px;height:15px;border:0;background:transparent;color:inherit;display:grid;place-items:center;padding:0;cursor:pointer}.ld-tag-menu{position:absolute;left:0;right:0;top:45px;z-index:50;max-height:270px;overflow:auto;background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:10px;box-shadow:0 16px 40px rgba(0,0,0,.2);padding:6px}.ld-tag-search{position:sticky;top:0;z-index:2;display:flex;align-items:center;gap:7px;padding:7px;border:1px solid var(--crm-border);background:var(--crm-surface-2);border-radius:8px;margin-bottom:5px}.ld-tag-search>svg{color:var(--crm-muted);flex-shrink:0}.ld-tag-search input{flex:1;width:100%;min-width:0;border:0!important;background:transparent!important;box-shadow:none!important;padding:4px!important;color:var(--crm-text);outline:0}.ld-tag-search button{width:22px;height:22px;border:0;background:transparent;color:var(--crm-muted);display:grid;place-items:center;padding:0;cursor:pointer}.ld-tag-check{width:18px;height:18px;border:1px solid var(--crm-border);border-radius:5px;display:grid;place-items:center;flex-shrink:0;color:var(--crm-primary)}.ld-tag-check.checked{background:var(--crm-primary-soft);border-color:var(--crm-primary)}
        .ld-assignment{display:grid;gap:6px;position:relative}.ld-assignment-trigger{width:100%;height:40px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:9px;padding:0 11px;display:flex;align-items:center;gap:8px;text-align:left;cursor:pointer;font-size:13px}.ld-assignment-trigger span{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.ld-assignment-trigger>svg:last-child{margin-left:auto;color:var(--crm-muted)}.ld-assignment-trigger:hover{border-color:var(--crm-primary);background:var(--crm-surface-2)}
        .ld-assignment-menu{position:absolute;left:0;right:0;top:62px;z-index:40;max-height:270px;overflow:auto;background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:10px;box-shadow:0 16px 40px rgba(0,0,0,.2);padding:6px}.ld-assignment-search{position:sticky;top:0;z-index:2;display:flex;align-items:center;gap:7px;padding:7px;border:1px solid var(--crm-border);background:var(--crm-surface-2);border-radius:8px;margin-bottom:5px}.ld-assignment-search>svg{color:var(--crm-muted);flex-shrink:0}.ld-assignment-search input{border:0!important;background:transparent!important;box-shadow:none!important;padding:4px!important;min-width:0;color:var(--crm-text)}.ld-assignment-search button{width:22px;height:22px;padding:0;border:0;background:transparent;color:var(--crm-muted);display:grid;place-items:center;cursor:pointer}.ld-assignment-option{width:100%;border:0;background:transparent;color:var(--crm-text);display:flex;align-items:center;gap:9px;padding:9px;border-radius:8px;text-align:left;cursor:pointer}.ld-assignment-option:hover,.ld-assignment-option.selected{background:color-mix(in srgb,var(--crm-primary) 9%,transparent);color:var(--crm-primary)}.ld-assignment-option>span{min-width:0;display:grid;gap:2px}.ld-assignment-option strong{font-size:13px;font-weight:400;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.ld-assignment-option small{font-size:13px;color:var(--crm-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.ld-assignment-empty{padding:18px 10px;text-align:center;color:var(--crm-muted);font-size:13px}.ld-assignment-note{margin:0 20px 20px;padding:10px 11px;border-radius:8px;background:var(--crm-surface-2);color:var(--crm-muted);font-size:13px;line-height:1.55}
        .ld-modal-footer{display:flex;align-items:center;justify-content:flex-end;gap:8px;padding:14px 20px;border-top:1px solid var(--crm-border)}.ld-modal-footer .ld-btn.primary{min-width:145px}
        @media(max-width:1000px){.ld-layout{grid-template-columns:1fr}}@media(max-width:700px){.ld-page{padding:20px 15px 30px}.ld-head{flex-direction:column}.ld-actions{width:100%;justify-content:flex-start}.ld-actions .ld-btn{flex:1}.ld-grid{grid-template-columns:1fr}.ld-item.full{grid-column:auto}.ld-form{grid-template-columns:1fr;padding:17px}.ld-field.full{grid-column:auto}.ld-profile{align-items:flex-start;flex-wrap:wrap}.ld-profile-badges{margin-left:0;justify-content:flex-start;width:100%}.ld-backdrop{padding:10px}.ld-modal{max-height:95vh}.ld-modal-footer{padding:12px 17px}.ld-modal-footer .ld-btn{flex:1}}
      `}</style>

      <section className="ld-page">
        <div className="ld-head">
          <div className="ld-head-left">
            <button type="button" className="ld-back" onClick={() => navigate("/crm/leads")}>
              <ArrowLeft size={14} /> Back to leads
            </button>
            <div className="ld-eyebrow">Sales workspace / Lead details</div>
            <h1 className="ld-title">{getLeadName(lead)}</h1>
            <p className="ld-subtitle">{lead.email || lead.phone || lead.companyName || "Lead prospect"}</p>
          </div>

          <div className="ld-actions">
            <button type="button" className="ld-btn" onClick={loadLead}>
              <RefreshCw size={14} /> Refresh
            </button>
            <button type="button" className="ld-btn" onClick={() => setModal("edit")}>
              <Edit3 size={14} /> Edit
            </button>
            <button type="button" className="ld-btn" onClick={openAssign}>
              <UserCheck size={14} /> Assign
            </button>
            {lead.status !== "CONVERTED" && (
              <button type="button" className="ld-btn primary" onClick={handleConvert}>
                <CheckCircle2 size={14} /> Convert
              </button>
            )}
            {lead.status !== "CONVERTED" && (
              <button type="button" className="ld-btn danger" onClick={handleDelete}>
                <Trash2 size={14} /> Delete
              </button>
            )}
          </div>
        </div>

        {pageError && (
          <div className="ld-error">
            <AlertCircle size={15} />
            <span>{pageError}</span>
          </div>
        )}

        <div className="ld-layout">
          <main className="ld-card">
            <div className="ld-profile">
              <div className="ld-avatar">{getInitials(lead)}</div>
              <div>
                <div className="ld-profile-name">{getLeadName(lead)}</div>
                <div className="ld-profile-sub">{lead.companyName || lead.jobTitle || "Lead prospect"}</div>
              </div>
              <div className="ld-profile-badges">
                <StatusBadge value={lead.status} />
                <RatingBadge value={lead.rating} />
              </div>
            </div>

            <section className="ld-section">
              <div className="ld-section-title">
                <BriefcaseBusiness size={14} /> Lead information
              </div>
              <div className="ld-grid">
                <div className="ld-item">
                  <div className="ld-label">First name</div>
                  <div className="ld-value">{lead.firstName || "—"}</div>
                </div>
                <div className="ld-item">
                  <div className="ld-label">Last name</div>
                  <div className="ld-value">{lead.lastName || "—"}</div>
                </div>
                <div className="ld-item">
                  <div className="ld-label">Email</div>
                  <div className="ld-value">{lead.email || "—"}</div>
                </div>
                <div className="ld-item">
                  <div className="ld-label">Phone</div>
                  <div className="ld-value">{lead.phone || "—"}</div>
                </div>
                <div className="ld-item">
                  <div className="ld-label">Company</div>
                  <div className="ld-value">{lead.companyName || "—"}</div>
                </div>
                <div className="ld-item">
                  <div className="ld-label">Job title</div>
                  <div className="ld-value">{lead.jobTitle || "—"}</div>
                </div>
                <div className="ld-item">
                  <div className="ld-label">Source</div>
                  <div className="ld-value">{formatSource(lead.source)}</div>
                </div>
                <div className="ld-item">
                  <div className="ld-label">Status</div>
                  <div className="ld-value">
                    <StatusBadge value={lead.status} />
                  </div>
                </div>
                <div className="ld-item">
                  <div className="ld-label">Rating</div>
                  <div className="ld-value">
                    <RatingBadge value={lead.rating} />
                  </div>
                </div>
                <div className="ld-item">
                  <div className="ld-label">Last contacted</div>
                  <div className="ld-value">{formatDate(lead.lastContactedAt, true)}</div>
                </div>
                <div className="ld-item">
                  <div className="ld-label">Created</div>
                  <div className="ld-value">{formatDate(lead.createdAt, true)}</div>
                </div>
                <div className="ld-item">
                  <div className="ld-label">Updated</div>
                  <div className="ld-value">{formatDate(lead.updatedAt, true)}</div>
                </div>
                <div className="ld-item full">
                  <div className="ld-label">Description</div>
                  <div className="ld-value ld-description">{lead.description || "No description added."}</div>
                </div>
              </div>
            </section>

            <section className="ld-section">
              <div className="ld-section-title">
                <Clock3 size={14} /> Audit & ownership
              </div>
              <div className="ld-grid">
                <div className="ld-item">
                  <div className="ld-label">Created by</div>
                  <div className="ld-value">{lead.createdBy?.name || lead.createdBy?.email || "—"}</div>
                </div>
                <div className="ld-item">
                  <div className="ld-label">Updated by</div>
                  <div className="ld-value">{lead.updatedBy?.name || lead.updatedBy?.email || "—"}</div>
                </div>
                <div className="ld-item">
                  <div className="ld-label">Assigned user</div>
                  <div className="ld-value">{getAssignedUserName(lead.assignedTo) || "Unassigned"}</div>
                </div>
                <div className="ld-item">
                  <div className="ld-label">Assigned team</div>
                  <div className="ld-value">{getAssignedTeamName(lead.assignedTeamId) || "Unassigned"}</div>
                </div>
              </div>
            </section>

            <section className="ld-section">
              <div className="ld-section-title">
                <Check size={14} /> Tags & custom fields
              </div>
              <div className="ld-grid">
                <div className="ld-item full">
                  <div className="ld-label">Tags</div>
                  <div className="ld-value">
                    {Array.isArray(lead.tags) && lead.tags.length ? (
                      <div className="ld-tags">
                        {lead.tags.map((tag, index) => (
                          <span className="ld-tag" key={`${getTagId(tag) || tag}-${index}`}>
                            {getTagName(tag)}
                          </span>
                        ))}
                      </div>
                    ) : (
                      "—"
                    )}
                  </div>
                </div>
                <div className="ld-item full">
                  <div className="ld-label">Custom fields</div>
                  <div className="ld-value ld-json">{Object.keys(lead.customFields || {}).length ? JSON.stringify(lead.customFields, null, 2) : "—"}</div>
                </div>
              </div>
            </section>
          </main>

          <aside className="ld-card">
            <section className="ld-section">
              <div className="ld-section-title">
                <UserCheck size={14} /> Assignment
              </div>
              <div className="ld-side-list">
                <div className="ld-side-item">
                  <div className="ld-side-label">User</div>
                  <div className="ld-side-value ld-assignee">
                    <span className="ld-assignee-icon">
                      <UserCheck size={13} />
                    </span>
                    {getAssignedUserName(lead.assignedTo) || "Unassigned"}
                  </div>
                </div>
                <div className="ld-side-item">
                  <div className="ld-side-label">Team</div>
                  <div className="ld-side-value ld-assignee">
                    <span className="ld-assignee-icon">
                      <UsersRound size={13} />
                    </span>
                    {getAssignedTeamName(lead.assignedTeamId) || "Unassigned"}
                  </div>
                </div>
                <button type="button" className="ld-btn primary" onClick={openAssign}>
                  <UserCheck size={13} /> Manage assignment
                </button>
              </div>
            </section>

            <section className="ld-section">
              <div className="ld-section-title">
                <CheckCircle2 size={14} /> Conversion
              </div>
              <div className="ld-side-list">
                <div className="ld-side-item">
                  <div className="ld-side-label">Converted at</div>
                  <div className="ld-side-value">{formatDate(lead.convertedAt, true)}</div>
                </div>
                <div className="ld-side-item">
                  <div className="ld-side-label">Converted contact</div>
                  <div className="ld-side-value">{lead.convertedContactId ? [lead.convertedContactId.firstName, lead.convertedContactId.lastName].filter(Boolean).join(" ") || lead.convertedContactId.email || "Available" : "—"}</div>
                </div>
                <div className="ld-side-item">
                  <div className="ld-side-label">Converted company</div>
                  <div className="ld-side-value">{lead.convertedCompanyId?.name || "—"}</div>
                </div>
                <div className="ld-side-item">
                  <div className="ld-side-label">Converted deal</div>
                  <div className="ld-side-value">{lead.convertedDealId?.name || lead.convertedDealId?._id || "—"}</div>
                </div>
                {lead.status !== "CONVERTED" && (
                  <button type="button" className="ld-btn primary" onClick={handleConvert}>
                    <CheckCircle2 size={13} /> Convert lead
                  </button>
                )}
              </div>
            </section>

            <section className="ld-section">
              <div className="ld-section-title">
                <Mail size={14} /> Contact shortcuts
              </div>
              <div className="ld-side-list">
                <div className="ld-side-item">
                  <div className="ld-side-label">Email</div>
                  <div className="ld-side-value">{lead.email || "—"}</div>
                </div>
                <div className="ld-side-item">
                  <div className="ld-side-label">Phone</div>
                  <div className="ld-side-value">{lead.phone || "—"}</div>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </section>

      {modal === "edit" && (
        <LeadEditModal
          lead={lead}
          businessId={businessId}
          tags={tags}
          tagsLoading={tagsLoading}
          onClose={() => setModal(null)}
          onSaved={async () => {
            setModal(null);
            await loadLead();
          }}
        />
      )}
      {modal === "assign" && (
        <AssignModal
          lead={lead}
          members={members}
          teams={teams}
          loading={assignmentLoading}
          businessId={businessId}
          onClose={() => setModal(null)}
          onSaved={async () => {
            setModal(null);
            await loadLead();
          }}
        />
      )}
    </>
  );
}
