import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Building2, Check, ChevronDown, ChevronLeft, ChevronRight, Eye, Mail, Pencil, Phone, Plus, RefreshCw, Search, Trash2, UserCheck, UsersRound, X, MapPin, Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useBusiness from "../../hooks/useBusiness";
import AssigneeDetailsPopup from "../../components/crm/AssigneeDetailsPopup";
import { isManagementRole } from "../../utils/permissions";
import { createCompany, deleteCompany, getCompanyById, getCompanies, updateCompany } from "../../api/company.api";
import { getAssignmentMembers } from "../../api/crm.api";
import { getTeams } from "../../api/operations.api";
import api from "../../api/api";
import { showAuthAlert } from "../../components/auth/authAlert";

const EMPTY_FORM = {
  name: "",
  legalName: "",
  email: "",
  phone: "",
  alternatePhone: "",
  website: "",
  industry: "",
  companySize: "SMALL",
  source: "manual",
  status: "ACTIVE",
  description: "",
  assignedTo: "",
  assignedTeamId: "",
  tags: [],
  address: { street: "", city: "", state: "", country: "", postalCode: "" },
};
const COMPANY_SIZE_OPTIONS = [
  { value: "SOLO", label: "Solo" },
  { value: "SMALL", label: "Small" },
  { value: "MEDIUM", label: "Medium" },
  { value: "LARGE", label: "Large" },
  { value: "ENTERPRISE", label: "Enterprise" },
];
const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
];

const errorMessage = (error, fallback = "Something went wrong.") => {
  const d = error?.response?.data;
  if (Array.isArray(d?.details) && d.details.length)
    return d.details
      .map((x) => x?.message)
      .filter(Boolean)
      .join(", ");
  return d?.message || d?.error?.message || d?.error || error?.message || fallback;
};
const unwrap = (response) => {
  const root = response?.data || response || {};
  return root?.data && typeof root.data === "object" ? root.data : root;
};
const rows = (response) => {
  const d = unwrap(response);
  return d?.companies || d?.items || d?.results || [];
};
const getUserId = (u) => u?.userId?._id || u?.userId?.id || u?.userId || u?._userId || u?._id || u?.id || "";
const getUserName = (u) => {
  const s = u?.userId && typeof u.userId === "object" ? u.userId : u;
  return [s?.firstName, s?.lastName].filter(Boolean).join(" ").trim() || s?.name || s?.fullName || s?.email || "Unassigned";
};
const getTeamId = (t) => t?._id || t?.id || "";
const getTeamName = (t) => t?.name || t?.title || t?.teamName || t?.slug || "Unassigned";
const getTagId = (t) => t?._id || t?.id || "";
const getTagName = (t) => t?.name || t?.title || t?.label || t?.slug || "Unnamed tag";
const formatSize = (v) => COMPANY_SIZE_OPTIONS.find((x) => x.value === v)?.label || v || "—";
const formatDate = (v) => {
  if (!v) return "—";
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

function SearchableAssignmentDropdown({ type, value, options, loading, onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const isUser = type === "user";
  const selected = options.find((item) => String(isUser ? getUserId(item) : getTeamId(item)) === String(value || ""));
  const selectedLabel = selected ? (isUser ? getUserName(selected) : getTeamName(selected)) : "Unassigned";

  const filtered = options.filter((item) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    if (isUser) {
      const name = getUserName(item).toLowerCase();
      const email = String(item?.email || item?.userId?.email || "").toLowerCase();
      return name.includes(q) || email.includes(q);
    }
    return (
      getTeamName(item).toLowerCase().includes(q) ||
      String(item?.slug || "")
        .toLowerCase()
        .includes(q)
    );
  });

  useEffect(() => {
    if (!open) return undefined;
    const handleOutside = (event) => {
      if (!event.target.closest(".companies-assignment-select")) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  return (
    <div className="companies-assignment-select">
      <button type="button" className="companies-assignment-trigger" disabled={loading} onClick={() => setOpen((current) => !current)}>
        {isUser ? <UserCheck size={14} /> : <UsersRound size={14} />}
        <span>{loading ? `Loading ${isUser ? "users" : "teams"}...` : selectedLabel}</span>
        <ChevronDown size={14} />
      </button>

      {open && !loading && (
        <div className="companies-assignment-menu">
          <div className="companies-assignment-search">
            <Search size={13} />
            <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${isUser ? "name or email" : "team"}...`} />
            {query && (
              <button type="button" onClick={() => setQuery("")} aria-label="Clear search">
                <X size={13} />
              </button>
            )}
          </div>

          <button
            type="button"
            className={`companies-assignment-option ${!value ? "selected" : ""}`}
            onClick={() => {
              onChange("");
              setOpen(false);
              setQuery("");
            }}>
            {isUser ? <UserCheck size={14} /> : <UsersRound size={14} />}
            <span>
              <strong>Unassigned</strong>
              <small>Remove {isUser ? "user" : "team"} assignment</small>
            </span>
          </button>

          {filtered.map((item) => {
            const id = isUser ? getUserId(item) : getTeamId(item);
            if (!id) return null;
            const email = item?.email || item?.userId?.email || "";

            return (
              <button
                type="button"
                key={id}
                className={`companies-assignment-option ${String(value) === String(id) ? "selected" : ""}`}
                onClick={() => {
                  onChange(id);
                  setOpen(false);
                  setQuery("");
                }}>
                {isUser ? <UserCheck size={14} /> : <UsersRound size={14} />}
                <span>
                  <strong>{isUser ? getUserName(item) : getTeamName(item)}</strong>
                  {isUser ? email ? <small>{email}</small> : null : item?.slug ? <small>{item.slug}</small> : null}
                </span>
              </button>
            );
          })}

          {filtered.length === 0 && <div className="companies-assignment-empty">No {isUser ? "users" : "teams"} found.</div>}
        </div>
      )}
    </div>
  );
}

function CompanyTagDropdown({ value = [], options = [], loading, onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef(null);
  const selected = Array.isArray(value) ? value.map(String) : [];
  const selectedOptions = selected.map((id) => options.find((tag) => String(getTagId(tag)) === id)).filter(Boolean);
  const filtered = options.filter((tag) => `${getTagName(tag)} ${tag?.slug || ""}`.toLowerCase().includes(query.trim().toLowerCase()));

  useEffect(() => {
    if (!open) return undefined;
    const close = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const toggle = (tag) => {
    const id = String(getTagId(tag));
    if (!id) return;
    onChange(selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id]);
  };

  return (
    <div className="companies-tag-select" ref={ref}>
      <button type="button" className="companies-tag-trigger" disabled={loading} onClick={() => setOpen((current) => !current)}>
        <Tag size={14} />
        <span>{selectedOptions.length ? selectedOptions.map(getTagName).join(", ") : loading ? "Loading tags..." : "Select tags"}</span>
        <ChevronDown size={14} />
      </button>
      {selectedOptions.length > 0 && (
        <div className="companies-selected-tags">
          {selectedOptions.map((tag) => (
            <span className="companies-tag-chip" key={String(getTagId(tag))}>
              {getTagName(tag)}
              <button type="button" onClick={() => toggle(tag)}>
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
      )}
      {open && !loading && (
        <div className="companies-tag-dropdown-menu">
          <div className="companies-tag-dropdown-search">
            <Search size={13} />
            <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tags..." />
            {query && (
              <button type="button" onClick={() => setQuery("")} aria-label="Clear tag search">
                <X size={12} />
              </button>
            )}
          </div>
          {filtered.length ? (
            filtered.map((tag) => {
              const id = String(getTagId(tag));
              const checked = selected.includes(id);
              return (
                <button type="button" className={`companies-tag-dropdown-option ${checked ? "selected" : ""}`} key={id} onClick={() => toggle(tag)}>
                  <span className={`companies-tag-check ${checked ? "checked" : ""}`}>{checked && <Check size={11} />}</span>
                  <span>
                    <strong>{getTagName(tag)}</strong>
                    {tag?.slug && tag.slug !== getTagName(tag) && <small>{tag.slug}</small>}
                  </span>
                </button>
              );
            })
          ) : (
            <div className="companies-tag-dropdown-empty">No tags found.</div>
          )}
        </div>
      )}
    </div>
  );
}

function CompanyForm({ form, setForm, members, teams, tags, loadingOptions, loadingTags }) {
  const update = (key, value) => setForm((x) => ({ ...x, [key]: value }));
  const updateAddress = (key, value) => setForm((x) => ({ ...x, address: { ...(x.address || {}), [key]: value } }));
  const toggleTag = (id) =>
    setForm((x) => {
      const current = Array.isArray(x.tags) ? x.tags : [];
      return { ...x, tags: current.some((v) => String(v) === String(id)) ? current.filter((v) => String(v) !== String(id)) : [...current, id] };
    });
  return (
    <div className="companies-form">
      <div className="companies-section full">
        <div className="companies-section-title">
          <Building2 size={15} />
          Company information
        </div>
        <div className="companies-section-subtitle">Add the primary company and business details.</div>
      </div>
      <div className="companies-field">
        <label>Company name *</label>
        <input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="ABC Pvt Ltd" />
      </div>
      <div className="companies-field">
        <label>Legal name</label>
        <input value={form.legalName} onChange={(e) => update("legalName", e.target.value)} placeholder="ABC Private Limited" />
      </div>
      <div className="companies-field">
        <label>Email</label>
        <div className="companies-input-icon">
          <Mail size={14} />
          <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="company@example.com" />
        </div>
      </div>
      <div className="companies-field">
        <label>Phone</label>
        <div className="companies-input-icon">
          <Phone size={14} />
          <input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+91 99999 99999" />
        </div>
      </div>
      <div className="companies-field">
        <label>Alternate phone</label>
        <input value={form.alternatePhone} onChange={(e) => update("alternatePhone", e.target.value)} placeholder="Alternate phone" />
      </div>
      <div className="companies-field">
        <label>Website</label>
        <input value={form.website} onChange={(e) => update("website", e.target.value)} placeholder="https://example.com" />
      </div>

      <div className="companies-section full companies-section-space">
        <div className="companies-section-title">
          <BriefcaseIcon />
          <span>Business details</span>
        </div>
      </div>
      <div className="companies-field">
        <label>Industry</label>
        <input value={form.industry} onChange={(e) => update("industry", e.target.value)} placeholder="Technology" />
      </div>
      <div className="companies-field">
        <label>Company size</label>
        <div className="companies-select-wrap">
          <select value={form.companySize} onChange={(e) => update("companySize", e.target.value)}>
            {COMPANY_SIZE_OPTIONS.map((x) => (
              <option key={x.value} value={x.value}>
                {x.label}
              </option>
            ))}
          </select>
          <ChevronDown size={14} />
        </div>
      </div>
      <div className="companies-field">
        <label>Source</label>
        <input value={form.source} onChange={(e) => update("source", e.target.value)} placeholder="manual" />
      </div>
      <div className="companies-field">
        <label>Status</label>
        <div className="companies-select-wrap">
          <select value={form.status} onChange={(e) => update("status", e.target.value)}>
            {STATUS_OPTIONS.map((x) => (
              <option key={x.value} value={x.value}>
                {x.label}
              </option>
            ))}
          </select>
          <ChevronDown size={14} />
        </div>
      </div>

      <div className="companies-section full companies-section-space">
        <div className="companies-section-title">
          <MapPin size={15} />
          Address
        </div>
      </div>
      <div className="companies-field full">
        <label>Street</label>
        <input value={form.address?.street || ""} onChange={(e) => updateAddress("street", e.target.value)} placeholder="Street / Building / Area" />
      </div>
      <div className="companies-field">
        <label>City</label>
        <input value={form.address?.city || ""} onChange={(e) => updateAddress("city", e.target.value)} placeholder="City" />
      </div>
      <div className="companies-field">
        <label>State</label>
        <input value={form.address?.state || ""} onChange={(e) => updateAddress("state", e.target.value)} placeholder="State" />
      </div>
      <div className="companies-field">
        <label>Country</label>
        <input value={form.address?.country || ""} onChange={(e) => updateAddress("country", e.target.value)} placeholder="Country" />
      </div>
      <div className="companies-field">
        <label>Postal code</label>
        <input value={form.address?.postalCode || ""} onChange={(e) => updateAddress("postalCode", e.target.value)} placeholder="Postal code" />
      </div>

      <div className="companies-section full companies-section-space">
        <div className="companies-section-title">
          <UsersRound size={15} />
          Assignment & Tags
        </div>
      </div>
      <div className="companies-assignment-row">
        <div className="companies-field">
          <label>Assigned team</label>
          <SearchableAssignmentDropdown type="team" value={form.assignedTeamId} options={teams} loading={loadingOptions} onChange={(value) => update("assignedTeamId", value)} />
        </div>
        <div className="companies-field">
          <label>Assigned user</label>
          <SearchableAssignmentDropdown type="user" value={form.assignedTo} options={members} loading={loadingOptions} onChange={(value) => update("assignedTo", value)} />
        </div>
      </div>
      <div className="companies-field full">
        <label>Tags</label>
        <CompanyTagDropdown value={form.tags} options={tags} loading={loadingTags} onChange={(value) => update("tags", value)} />
      </div>
      <div className="companies-field full">
        <label>Description</label>
        <textarea rows={4} value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Add company notes..." />
      </div>
    </div>
  );
}

function BriefcaseIcon() {
  return <Building2 size={15} />;
}

export default function Companies() {
  const navigate = useNavigate();
  const { businessId, loading: businessLoading, error: businessError, role, isBusinessOwner } = useBusiness();
  const canManage = isManagementRole({ role, isBusinessOwner });
    const [assigneeDetail, setAssigneeDetail] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [industry, setIndustry] = useState("");
  const [source, setSource] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [assignedTeamId, setAssignedTeamId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(null);
  const [assignForm, setAssignForm] = useState({ assignedTo: "", assignedTeamId: "" });
  const [form, setForm] = useState(EMPTY_FORM);
  const [members, setMembers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [tags, setTags] = useState([]);
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [tagsLoading, setTagsLoading] = useState(false);

  const loadCompanies = useCallback(
    async (page = 1, override = {}) => {
      if (!businessId) return;
      setLoading(true);
      setError("");
      const p = {
        search: override.search !== undefined ? override.search : search,
        status: override.status !== undefined ? override.status : status,
        companySize: override.companySize !== undefined ? override.companySize : companySize,
        industry: override.industry !== undefined ? override.industry : industry,
        source: override.source !== undefined ? override.source : source,
        assignedTo: override.assignedTo !== undefined ? override.assignedTo : assignedTo,
        assignedTeamId: override.assignedTeamId !== undefined ? override.assignedTeamId : assignedTeamId,
      };
      try {
        const r = await getCompanies(businessId, { page, limit: pagination.limit, ...Object.fromEntries(Object.entries(p).filter(([, v]) => String(v || "").trim())) });
        const data = unwrap(r);
        const list = data?.companies || data?.items || data?.results || [];
        setCompanies(Array.isArray(list) ? list : []);
        setPagination(data?.pagination || { page, limit: pagination.limit, total: list.length, totalPages: 1 });
      } catch (e) {
        setCompanies([]);
        setError(errorMessage(e, "Unable to load companies."));
      } finally {
        setLoading(false);
      }
    },
    [businessId, pagination.limit, search, status, companySize, industry, source, assignedTo, assignedTeamId]
  );

  useEffect(() => {
    if (businessId) loadCompanies(1);
  }, [businessId]);

  const loadOptions = useCallback(async () => {
    if (!businessId) return;
    setOptionsLoading(true);
    setTagsLoading(true);
    try {
      const [m, t, g] = await Promise.all([getAssignmentMembers(businessId, { page: 1, limit: 100 }), getTeams(businessId, { page: 1, limit: 100 }), api.get(`/tags/business/${businessId}`, { params: { page: 1, limit: 100 } })]);
      const md = unwrap(m),
        td = unwrap(t),
        gd = unwrap(g);
      setMembers(md?.items || md?.members || md?.results || (Array.isArray(md) ? md : []));
      setTeams(td?.items || td?.teams || td?.results || (Array.isArray(td) ? td : []));
      setTags(gd?.items || gd?.tags || gd?.results || (Array.isArray(gd) ? gd : []));
    } catch (e) {
      setMembers([]);
      setTeams([]);
      setTags([]);
      await showAuthAlert({ icon: "error", title: "Options unavailable", text: errorMessage(e, "Unable to load users, teams or tags."), confirmButtonText: "OK" });
    } finally {
      setOptionsLoading(false);
      setTagsLoading(false);
    }
  }, [businessId]);

  const openCreate = async () => {
    setError("");
    await loadOptions();
    setForm({ ...EMPTY_FORM, address: { ...EMPTY_FORM.address }, tags: [] });
    setModal({ mode: "create" });
  };

  const openEdit = async (company) => {
    setError("");
    await loadOptions();
    setForm({
      name: company?.name || "",
      legalName: company?.legalName || "",
      email: company?.email || "",
      phone: company?.phone || "",
      alternatePhone: company?.alternatePhone || "",
      website: company?.website || "",
      industry: company?.industry || "",
      companySize: company?.companySize || "SMALL",
      source: company?.source || "manual",
      status: company?.status || "ACTIVE",
      description: company?.description || "",
      assignedTo: company?.assignedTo?._id || company?.assignedTo || "",
      assignedTeamId: company?.assignedTeamId?._id || company?.assignedTeamId || "",
      tags: Array.isArray(company?.tags) ? company.tags.map(getTagId).filter(Boolean) : [],
      address: { street: company?.address?.street || "", city: company?.address?.city || "", state: company?.address?.state || "", country: company?.address?.country || "", postalCode: company?.address?.postalCode || "" },
    });
    setModal({ mode: "edit", company });
  };

  const openAssign = async (company) => {
    setError("");
    await loadOptions();
    setAssignForm({
      assignedTo: company?.assignedTo?._id || company?.assignedTo || "",
      assignedTeamId: company?.assignedTeamId?._id || company?.assignedTeamId || "",
    });
    setModal({ mode: "assign", company });
  };

  const saveAssignment = async () => {
    if (!businessId || !modal?.company?._id) return;
    setSaving(true);
    try {
      await api.patch(`/companies/business/${businessId}/${modal.company._id}/assign`, {
        assignedTo: String(assignForm.assignedTo || "").trim() || null,
        assignedTeamId: String(assignForm.assignedTeamId || "").trim() || null,
      });
      setModal(null);
      await showAuthAlert({ icon: "success", title: "Assignment updated", text: "Company assignment updated successfully.", confirmButtonText: "Done" });
      await loadCompanies(pagination.page || 1);
    } catch (e) {
      const msg = errorMessage(e, "Unable to update company assignment.");
      await showAuthAlert({ icon: "error", title: "Assignment failed", text: msg, confirmButtonText: "OK" });
    } finally {
      setSaving(false);
    }
  };

  const saveCompany = async () => {
    if (!businessId) return;
    if (!form.name.trim()) {
      await showAuthAlert({ icon: "warning", title: "Company name required", text: "Please enter the company name.", confirmButtonText: "OK" });
      return;
    }
    setSaving(true);
    setError("");
    const payload = {
      name: form.name.trim(),
      legalName: form.legalName.trim() || null,
      email: form.email.trim() || null,
      phone: form.phone.trim() || null,
      alternatePhone: form.alternatePhone.trim() || null,
      website: form.website.trim() || null,
      industry: form.industry.trim() || null,
      companySize: form.companySize || "SMALL",
      source: form.source.trim() || "manual",
      status: form.status || "ACTIVE",
      description: form.description.trim() || null,
      assignedTo: form.assignedTo || null,
      assignedTeamId: form.assignedTeamId || null,
      tags: Array.isArray(form.tags) ? form.tags : [],
      address: form.address || {},
    };
    try {
      if (modal?.mode === "create") await createCompany(businessId, payload);
      else await updateCompany(businessId, modal.company._id, payload);
      setModal(null);
      await showAuthAlert({ icon: "success", title: modal?.mode === "create" ? "Company created" : "Company updated", text: "Company saved successfully.", confirmButtonText: "Done" });
      await loadCompanies(1);
    } catch (e) {
      const msg = errorMessage(e, "Unable to save company.");
      setError(msg);
      await showAuthAlert({ icon: "error", title: "Unable to save company", text: msg, confirmButtonText: "OK" });
    } finally {
      setSaving(false);
    }
  };

  const removeCompany = async (company) => {
    const result = await showAuthAlert({ icon: "warning", title: "Delete company?", text: "This company will be deleted permanently if it has no linked contacts.", showCancelButton: true, confirmButtonText: "Delete", cancelButtonText: "Cancel" });
    if (!result?.isConfirmed) return;
    try {
      await deleteCompany(businessId, company._id);
      await showAuthAlert({ icon: "success", title: "Company deleted", text: "Company deleted successfully.", confirmButtonText: "Done" });
      await loadCompanies(1);
    } catch (e) {
      await showAuthAlert({ icon: "error", title: "Delete failed", text: errorMessage(e, "Unable to delete company."), confirmButtonText: "OK" });
    }
  };

  const total = Number(pagination.total || 0);
  const active = useMemo(() => companies.filter((x) => x.status === "ACTIVE").length, [companies]);
  const inactive = useMemo(() => companies.filter((x) => x.status === "INACTIVE").length, [companies]);
  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setCompanySize("");
    setIndustry("");
    setSource("");
    setAssignedTo("");
    setAssignedTeamId("");
    loadCompanies(1, { search: "", status: "", companySize: "", industry: "", source: "", assignedTo: "", assignedTeamId: "" });
  };

  return (
    <div className="companies-page">
      <style>{`.company-assignment-stack{min-width:230px;white-space:nowrap}.company-assignee,.company-team-line{white-space:nowrap}.company-assignee .crm-assignee-name,.company-team-line .crm-assignee-team{white-space:nowrap;display:inline-block}.crm-assignee-name{white-space:nowrap;display:inline-flex;align-items:center;cursor:pointer;text-decoration:none;background:transparent;border:0;padding:0;margin:0;color:var(--crm-text);font:inherit;font-weight:400;line-height:1.3;text-align:left;box-shadow:none;appearance:none;-webkit-appearance:none}.crm-assignee-name:hover{background:transparent;border:0;box-shadow:none;color:var(--crm-primary);text-decoration:none}.crm-assignee-name:focus,.crm-assignee-name:focus-visible{outline:none;box-shadow:none;background:transparent}.companies-head{display:flex;align-items:flex-end;justify-content:space-between;gap:22px;margin-bottom:22px}.companies-eyebrow{font-size:13px;color:var(--crm-primary);font-weight:400;text-transform:uppercase;letter-spacing:.12em;margin-bottom:7px}.companies-title{font-size:29px;line-height:1.15;letter-spacing:-.8px;margin:0;color:var(--crm-text);font-weight:400}.companies-subtitle{font-size:13px;color:var(--crm-muted);margin:7px 0 0;line-height:1.55}.companies-actions{display:flex;align-items:center;gap:8px}.companies-page{padding:24px 26px 40px;color:var(--crm-text)}.companies-head{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:18px}.companies-title{margin:0;font-size:29px;line-height:1.15;letter-spacing:-.8px;color:var(--crm-text);font-weight:400}.companies-subtitle{margin:5px 0 0;font-size:13px;color:var(--crm-muted)}.companies-actions{display:flex;gap:8px}.companies-btn{height:38px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:9px;padding:0 13px;display:inline-flex;align-items:center;justify-content:center;gap:7px;font-size:13px;font-weight:400;cursor:pointer}.companies-btn.primary{background:var(--crm-primary);border-color:var(--crm-primary);color:#fff}.companies-btn:disabled{opacity:.55;cursor:not-allowed}.companies-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:16px}.companies-stat{position:relative;background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:13px;padding:13px 52px 13px 15px;min-height:58px;display:flex;align-items:center;box-shadow:var(--crm-shadow)}.companies-stat-icon{position:absolute;right:14px;top:50%;transform:translateY(-50%);width:35px;height:35px;border-radius:10px;background:color-mix(in srgb,var(--crm-primary) 10%,transparent);color:var(--crm-primary);display:grid;place-items:center}.companies-stat-label{font-size:13px;color:var(--crm-muted);text-transform:uppercase;font-weight:400}.companies-stat-value{margin-top:3px;font-size:20px;font-weight:400}.companies-stat-sub{margin-top:2px;font-size:13px;line-height:1.2;color:var(--crm-muted)}.companies-toolbar{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:14px}.companies-search{position:relative;width:min(330px,100%)}.companies-search input{width:100%;height:40px;box-sizing:border-box;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:10px;padding:0 36px;outline:0;font-size:13px}.companies-search>svg{position:absolute;left:12px;top:12px;color:var(--crm-muted)}.companies-search-clear{position:absolute;right:7px;top:7px;width:25px;height:25px;border:0;background:transparent;color:var(--crm-muted);display:grid;place-items:center}.companies-filter{height:40px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:9px;padding:0 10px;outline:0;font-size:13px;max-width:150px}.companies-card{background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:14px;overflow:hidden;box-shadow:var(--crm-shadow)}.companies-table-wrap{width:100%;max-height:340px;overflow:auto;overscroll-behavior:contain;scrollbar-gutter:stable both-edges}.companies-table{width:100%;min-width:1430px;border-collapse:collapse;table-layout:auto}.companies-table th:nth-child(1),.companies-table td:nth-child(1){min-width:230px;width:230px}.companies-table th:nth-child(2),.companies-table td:nth-child(2){min-width:155px;width:155px}.companies-table th:nth-child(3),.companies-table td:nth-child(3){min-width:210px;width:210px}.companies-table th:nth-child(4),.companies-table td:nth-child(4){min-width:110px;width:110px}.companies-table th:nth-child(5),.companies-table td:nth-child(5){min-width:105px;width:105px}.companies-table th:nth-child(6),.companies-table td:nth-child(6){min-width:125px;width:125px}.companies-table th:nth-child(7),.companies-table td:nth-child(7){min-width:245px;width:245px}.companies-table th:nth-child(8),.companies-table td:nth-child(8){min-width:125px;width:125px}.companies-table th:nth-child(9),.companies-table td:nth-child(9){min-width:125px;width:125px}.companies-table th{position:sticky;top:0;z-index:3;text-align:left;min-width:100px;padding:13px 18px;white-space:nowrap}.companies-table th:last-child,.companies-table td:last-child{text-align:center}.companies-table tbody tr{height:56px}.companies-table td{white-space:nowrap}.companies-table th,.companies-table td{padding-left:18px;padding-right:18px}.companies-table .crm-assignee-name{white-space:nowrap;display:inline-flex;align-items:center;cursor:pointer}.companies-table th{min-width:100px}.companies-table td{white-space:nowrap}.companies-table th:last-child,.companies-table td:last-child{min-width:120px;width:120px}.companies-table td{padding:12px 14px;border-top:1px solid var(--crm-border);font-size:13px;vertical-align:middle}.company-name-cell{display:flex;align-items:center;gap:9px;min-width:180px}.company-avatar{width:30px;height:30px;border-radius:8px;background:color-mix(in srgb,var(--crm-primary) 11%,transparent);color:var(--crm-primary);display:grid;place-items:center}.company-main-name{font-weight:400;white-space:nowrap}.company-main-sub{margin-top:2px;font-size:13px;color:var(--crm-muted);white-space:nowrap;max-width:180px;overflow:hidden;text-overflow:ellipsis}.company-contact-stack{display:grid;gap:4px}.company-contact-line{display:flex;align-items:center;gap:6px;white-space:nowrap}.company-contact-line svg{color:var(--crm-muted)}.company-assignment-stack{display:grid;gap:5px;min-width:145px}.company-assignee,.company-team-line{display:flex;align-items:center;gap:6px;font-size:13px}.company-assignee svg,.company-team-line svg{color:var(--crm-muted)}.company-label{font-weight:400}.company-status{display:inline-flex;padding:4px 8px;border-radius:999px;font-size:13px;font-weight:400}.company-status.active{background:color-mix(in srgb,#22c55e 12%,transparent);color:#16a34a}.company-status.inactive{background:color-mix(in srgb,var(--crm-muted) 13%,transparent);color:var(--crm-muted)}.company-actions{display:flex;gap:5px}.company-icon-btn{width:29px;height:29px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-muted);border-radius:8px;display:grid;place-items:center;cursor:pointer}.company-icon-btn:hover{color:var(--crm-primary);border-color:var(--crm-primary)}.companies-pagination{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;border-top:1px solid var(--crm-border);font-size:13px;color:var(--crm-muted)}.companies-pagination-actions{display:flex;align-items:center;gap:7px}.companies-loading,.companies-empty{text-align:center;padding:45px;color:var(--crm-muted)}.companies-spinner{width:16px;height:16px;border:2px solid var(--crm-border);border-top-color:var(--crm-primary);border-radius:50%;animation:company-spin .7s linear infinite;display:inline-block}@keyframes company-spin{to{transform:rotate(360deg)}}.companies-modal-backdrop{position:fixed;inset:0;background:rgba(15,23,42,.48);display:grid;place-items:center;padding:18px;z-index:500}.companies-modal{width:min(620px,100%);max-height:92vh;overflow:auto;background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:15px;box-shadow:0 25px 70px rgba(0,0,0,.25)}.companies-modal-head{display:flex;align-items:center;justify-content:space-between;padding:16px 19px;border-bottom:1px solid var(--crm-border)}.companies-modal-title{margin:0;font-size:16px;font-weight:400}.companies-modal-close{width:30px;height:30px;border:0;background:transparent;color:var(--crm-muted);display:grid;place-items:center}.companies-form{display:grid;grid-template-columns:1fr 1fr;gap:13px;padding:17px}.companies-field{display:grid;gap:6px}.companies-field.full{grid-column:1/-1}.companies-field label{font-size:13px;font-weight:400}.companies-field input,.companies-field select,.companies-field textarea{width:100%;box-sizing:border-box;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:9px;padding:10px 11px;outline:0;font-size:13px}.companies-field input:focus,.companies-field select:focus,.companies-field textarea:focus{border-color:var(--crm-primary)}.companies-select-wrap{position:relative}.companies-select-wrap select{appearance:none;padding-right:30px}.companies-select-wrap svg{position:absolute;right:10px;top:12px;color:var(--crm-muted);pointer-events:none}.companies-input-icon{position:relative}.companies-input-icon svg{position:absolute;left:11px;top:12px;color:var(--crm-muted)}.companies-input-icon input{padding-left:33px}.companies-section{display:grid;gap:4px}.companies-section-space{margin-top:4px}.companies-section-title{display:flex;align-items:center;gap:7px;font-size:13px;font-weight:400}.companies-section-title svg{color:var(--crm-primary)}.companies-section-subtitle{font-size:13px;color:var(--crm-muted)}.companies-assignment-select{position:relative;width:100%}.companies-assignment-trigger{width:100%;min-height:40px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:9px;padding:0 11px;display:flex;align-items:center;gap:8px;text-align:left;cursor:pointer;font-size:13px}.companies-assignment-trigger span{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.companies-assignment-trigger>svg:last-child{margin-left:auto;color:var(--crm-muted)}.companies-assignment-trigger:hover:not(:disabled){border-color:var(--crm-primary);background:var(--crm-surface-2)}.companies-assignment-menu{position:absolute;left:0;right:0;top:calc(100% + 5px);z-index:80;max-height:270px;overflow:auto;background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:10px;box-shadow:0 16px 40px rgba(0,0,0,.2);padding:6px}.companies-assignment-search{position:sticky;top:0;z-index:2;display:flex;align-items:center;gap:7px;padding:7px;border:1px solid var(--crm-border);background:var(--crm-surface-2);border-radius:8px;margin-bottom:5px}.companies-assignment-search>svg{color:var(--crm-muted);flex-shrink:0}.companies-assignment-search input{flex:1!important;width:100%!important;min-width:0!important;border:0!important;background:transparent!important;box-shadow:none!important;padding:4px!important;color:var(--crm-text)}.companies-assignment-search button{width:22px;height:22px;min-width:22px;flex:0 0 22px;margin-left:auto;padding:0;border:0;background:transparent;color:var(--crm-muted);display:grid;place-items:center;cursor:pointer}.companies-assignment-option{width:100%;border:0;background:transparent;color:var(--crm-text);display:flex;align-items:center;gap:9px;padding:9px;border-radius:8px;text-align:left;cursor:pointer}.companies-assignment-option:hover,.companies-assignment-option.selected{background:color-mix(in srgb,var(--crm-primary) 9%,transparent);color:var(--crm-primary)}.companies-assignment-option>span{min-width:0;display:grid;gap:2px}.companies-assignment-option strong{font-size:13px;font-weight:400;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.companies-assignment-option small{font-size:13px;color:var(--crm-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.companies-assignment-empty{padding:18px 10px;text-align:center;color:var(--crm-muted);font-size:13px}.companies-assignment-row{grid-column:1/-1;display:grid;grid-template-columns:1fr 1fr;gap:13px}.companies-tag-select{position:relative;width:100%}.companies-tag-trigger{width:100%;min-height:40px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:9px;padding:0 11px;display:flex;align-items:center;gap:8px;text-align:left;cursor:pointer;font-size:13px}.companies-tag-trigger span{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.companies-tag-trigger>svg:last-child{margin-left:auto;color:var(--crm-muted)}.companies-tag-trigger:hover:not(:disabled){border-color:var(--crm-primary);background:var(--crm-surface-2)}.companies-selected-tags{display:flex;flex-wrap:wrap;gap:5px;margin-top:6px}.companies-tag-chip{display:inline-flex;align-items:center;gap:5px;border:1px solid var(--crm-border);background:var(--crm-surface-2);color:var(--crm-text);border-radius:999px;padding:4px 7px;font-size:13px}.companies-tag-chip button{width:17px;height:17px;border:0;background:transparent;color:var(--crm-muted);display:grid;place-items:center;padding:0;cursor:pointer}.companies-tag-dropdown-menu{position:absolute;left:0;right:0;top:calc(100% + 5px);z-index:90;max-height:270px;overflow:auto;background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:10px;box-shadow:0 16px 40px rgba(0,0,0,.2);padding:6px}.companies-tag-dropdown-search{position:sticky;top:0;z-index:2;display:flex;align-items:center;gap:7px;padding:7px;border:1px solid var(--crm-border);background:var(--crm-surface-2);border-radius:8px;margin-bottom:5px}.companies-tag-dropdown-search>svg{color:var(--crm-muted);flex-shrink:0}.companies-tag-dropdown-search input{flex:1!important;width:100%!important;min-width:0!important;border:0!important;background:transparent!important;box-shadow:none!important;padding:4px!important;color:var(--crm-text)}.companies-tag-dropdown-search button{width:22px;height:22px;min-width:22px;border:0;background:transparent;color:var(--crm-muted);display:grid;place-items:center;padding:0;cursor:pointer}.companies-tag-dropdown-option{width:100%;border:0;background:transparent;color:var(--crm-text);display:flex;align-items:center;gap:9px;padding:9px;border-radius:8px;text-align:left;cursor:pointer}.companies-tag-dropdown-option:hover,.companies-tag-dropdown-option.selected{background:color-mix(in srgb,var(--crm-primary) 9%,transparent);color:var(--crm-primary)}.companies-tag-dropdown-option>span:last-child{min-width:0;display:grid;gap:2px}.companies-tag-dropdown-option strong{font-size:13px;font-weight:400;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.companies-tag-dropdown-option small{font-size:13px;color:var(--crm-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.companies-tag-check{width:18px;height:18px;border:1px solid var(--crm-border);border-radius:5px;display:grid;place-items:center;flex:0 0 18px;color:var(--crm-primary)}.companies-tag-check.checked{border-color:var(--crm-primary);background:color-mix(in srgb,var(--crm-primary) 10%,transparent)}.companies-tag-dropdown-empty{padding:18px 10px;text-align:center;color:var(--crm-muted);font-size:13px}.companies-tags-box{display:flex;flex-wrap:wrap;gap:6px;padding:9px;border:1px solid var(--crm-border);border-radius:9px;min-height:42px}.companies-tag-option{border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:999px;padding:6px 9px;font-size:13px;cursor:pointer}.companies-tag-option.selected{border-color:var(--crm-primary);background:color-mix(in srgb,var(--crm-primary) 9%,transparent)}.companies-muted{font-size:13px;color:var(--crm-muted);padding:5px}.companies-modal-foot{display:flex;justify-content:flex-end;gap:8px;padding:13px 19px;border-top:1px solid var(--crm-border)}.companies-modal.assign-modal .companies-form{grid-template-columns:1fr;gap:12px;padding:16px 19px}.companies-modal.assign-modal .companies-field{gap:6px}.companies-modal.assign-modal .companies-section-subtitle{display:none}.companies-modal.assign-modal .companies-modal-head{padding:14px 19px}.companies-modal.assign-modal .companies-modal-title{font-size:15px}.companies-modal.assign-modal .companies-modal-foot{padding:11px 19px}.companies-modal.assign-modal .companies-assignment-menu{max-height:230px}.companies-assign-form{gap:10px;padding:15px}.companies-assign-form .companies-field{gap:5px}.companies-assign-form .companies-field input,.companies-assign-form .companies-field select{padding:9px 10px}.companies-assign-form .companies-section{margin-bottom:0}.companies-table .crm-assignee-name{white-space:nowrap;display:inline-flex;align-items:center;cursor:pointer}@media(max-width:850px){.companies-assignment-row{grid-template-columns:1fr}.companies-stats{grid-template-columns:1fr}.companies-head{align-items:flex-start;flex-direction:column}.companies-actions{width:100%}.companies-form{grid-template-columns:1fr}.companies-field.full{grid-column:auto}}@media(max-width:600px){.companies-page{padding:18px 14px 30px}.companies-search{width:100%}.companies-filter{flex:1;max-width:none}}.companies-table thead th{text-align:left!important;text-align:start!important;padding:10px 13px;vertical-align:middle;white-space:nowrap;background:var(--crm-surface-2);border-bottom:1px solid var(--crm-border);color:var(--crm-muted);font-size:13px;font-weight:400;text-transform:uppercase}.companies-table th{text-align:left!important}.companies-table td{padding-left:18px;padding-right:18px}.companies-table td:last-child{text-align:left}.companies-table{border-spacing:0}.companies-table th,.companies-table td{box-sizing:border-box}}</style>

      <div className="companies-head">
        <div>
          <h1 className="companies-title">Companies</h1>

          <p className="companies-subtitle">Manage your companies directly from the BR30 CRM workspace.</p>
        </div>

        <div className="companies-actions">
          <button className="companies-btn" onClick={() => loadCompanies(1)} disabled={loading}>
            <RefreshCw size={14} />
            Refresh
          </button>
          <button className="companies-btn primary" onClick={openCreate}>
            <Plus size={15} />
            Add Company
          </button>
        </div>
      </div>

      {(error || businessError) && <div style={{ marginBottom: 12, color: "var(--crm-danger)", fontSize: 12 }}>{error || businessError}</div>}

      <div className="companies-stats">
        <div className="companies-stat">
          <div className="companies-stat-icon">
            <Building2 size={18} />
          </div>
          <div>
            <div className="companies-stat-label">Total Companies</div>
            <div className="companies-stat-value">{total.toLocaleString("en-IN")}</div>
            <div className="companies-stat-sub">All companies</div>
          </div>
        </div>
        <div className="companies-stat">
          <div className="companies-stat-icon">
            <Building2 size={18} />
          </div>
          <div>
            <div className="companies-stat-label">Active</div>
            <div className="companies-stat-value">{active}</div>
            <div className="companies-stat-sub">Currently active</div>
          </div>
        </div>
        <div className="companies-stat">
          <div className="companies-stat-icon">
            <Building2 size={18} />
          </div>
          <div>
            <div className="companies-stat-label">Inactive</div>
            <div className="companies-stat-value">{inactive}</div>
            <div className="companies-stat-sub">Currently inactive</div>
          </div>
        </div>
      </div>

      <div className="companies-toolbar">
        <div className="companies-search">
          <Search size={15} />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              loadCompanies(1, { search: e.target.value });
            }}
            placeholder="Search companies..."
          />
          {search && (
            <button
              className="companies-search-clear"
              onClick={() => {
                setSearch("");
                loadCompanies(1, { search: "" });
              }}>
              <X size={14} />
            </button>
          )}
        </div>
        <select
          className="companies-filter"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            loadCompanies(1, { status: e.target.value });
          }}>
          <option value="">Status</option>
          {STATUS_OPTIONS.map((x) => (
            <option key={x.value} value={x.value}>
              {x.label}
            </option>
          ))}
        </select>
        <select
          className="companies-filter"
          value={companySize}
          onChange={(e) => {
            setCompanySize(e.target.value);
            loadCompanies(1, { companySize: e.target.value });
          }}>
          <option value="">Size</option>
          {COMPANY_SIZE_OPTIONS.map((x) => (
            <option key={x.value} value={x.value}>
              {x.label}
            </option>
          ))}
        </select>
        <input className="companies-filter" style={{ width: 130 }} value={industry} onChange={(e) => setIndustry(e.target.value)} onKeyDown={(e) => e.key === "Enter" && loadCompanies(1)} placeholder="Industry" />
        <input className="companies-filter" style={{ width: 120 }} value={source} onChange={(e) => setSource(e.target.value)} onKeyDown={(e) => e.key === "Enter" && loadCompanies(1)} placeholder="Source" />
        {(search || status || companySize || industry || source || assignedTo || assignedTeamId) && (
          <button className="companies-btn" onClick={clearFilters}>
            <X size={13} />
            Clear
          </button>
        )}
      </div>

      <div className="companies-card">
        <div className="companies-table-wrap">
          <table className="companies-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Industry</th>
                <th>Contact</th>
                <th>Size</th>
                <th>Contacts</th>
                <th>Status</th>
                <th>Assigned</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading || businessLoading ? (
                <tr>
                  <td colSpan="9">
                    <div className="companies-loading">
                      <span className="companies-spinner" />
                      Loading companies...
                    </div>
                  </td>
                </tr>
              ) : companies.length === 0 ? (
                <tr>
                  <td colSpan="9">
                    <div className="companies-empty">No companies found.</div>
                  </td>
                </tr>
              ) : (
                companies.map((company) => {
                  const u = company.assignedTo,
                    t = company.assignedTeamId;
                  return (
                    <tr key={company._id}>
                      <td>
                        <div className="company-name-cell">
                          <div className="company-avatar">
                            <Building2 size={15} />
                          </div>
                          <div>
                            <div className="company-main-name">{company.name || "Unnamed company"}</div>
                            <div className="company-main-sub">{company.legalName || company.website || "Business account"}</div>
                          </div>
                        </div>
                      </td>
                      <td>{company.industry || "—"}</td>
                      <td>
                        <div className="company-contact-stack">
                          <div className="company-contact-line">
                            <Mail size={11} />
                            {company.email || "—"}
                          </div>
                          <div className="company-contact-line">
                            <Phone size={11} />
                            {company.phone || "—"}
                          </div>
                        </div>
                      </td>
                      <td>{formatSize(company.companySize)}</td>
                      <td>{Number(company.contactCount || 0)}</td>
                      <td>
                        <span className={`company-status ${company.status === "ACTIVE" ? "active" : "inactive"}`}>{company.status === "ACTIVE" ? "Active" : "Inactive"}</span>
                      </td>
                      <td>
                        <div className="company-assignment-stack">
                          <div className="company-assignee">
                            <UserCheck size={11} />
                            <button type="button" className="crm-assignee-name" onClick={() => u && setAssigneeDetail({ type: "user", name: getUserName(u), email: u?.email || u?.userId?.email || "" })}>
                              <span className="company-label">User:</span> {u ? getUserName(u) : "Unassigned"}
                            </button>
                          </div>
                          <div className="company-team-line">
                            <UsersRound size={11} />
                            <span className="crm-assignee-team">
                              <span className="company-label">Team:</span> {t ? getTeamName(t) : "Unassigned"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>{formatDate(company.createdAt)}</td>
                      <td>
                        <div className="company-actions">
                          <button className="company-icon-btn" title="View" onClick={() => navigate(`/companies/${company._id}`)}>
                            <Eye size={14} />
                          </button>
                          <button className="company-icon-btn" title="Assign" onClick={() => openAssign(company)}>
                            <UserCheck size={14} />
                          </button>
                          <button className="company-icon-btn" title="Edit" onClick={() => openEdit(company)}>
                            <Pencil size={14} />
                          </button>
                          {canManage && (
                            <button className="company-icon-btn" title="Delete" onClick={() => removeCompany(company)}>
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
        <div className="companies-pagination">
          <span>{total.toLocaleString("en-IN")} total</span>
          <div className="companies-pagination-actions">
            <button className="companies-btn" disabled={(pagination.page || 1) <= 1 || loading} onClick={() => loadCompanies((pagination.page || 1) - 1)}>
              <ChevronLeft size={14} />
              Previous
            </button>
            <span>
              Page {pagination.page || 1} / {pagination.totalPages || 1}
            </span>
            <button className="companies-btn" disabled={(pagination.page || 1) >= (pagination.totalPages || 1) || loading} onClick={() => loadCompanies((pagination.page || 1) + 1)}>
              Next
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {modal && (
        <div className="companies-modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && !saving && setModal(null)}>
          <div className={`companies-modal ${modal.mode === "assign" ? "assign-modal" : ""}`}>
            <div className="companies-modal-head">
              <h2 className="companies-modal-title">{modal.mode === "assign" ? "Assign Company" : modal.mode === "create" ? "Add Company" : "Edit Company"}</h2>
              <button className="companies-modal-close" disabled={saving} onClick={() => setModal(null)}>
                <X size={17} />
              </button>
            </div>
            {modal.mode === "assign" ? (
              <div className="companies-form">
                <div className="companies-field">
                  <label>Assigned user</label>
                  <SearchableAssignmentDropdown type="user" value={assignForm.assignedTo} options={members} loading={optionsLoading} onChange={(value) => setAssignForm((current) => ({ ...current, assignedTo: value }))} />
                </div>
                <div className="companies-field">
                  <label>Assigned team</label>
                  <SearchableAssignmentDropdown type="team" value={assignForm.assignedTeamId} options={teams} loading={optionsLoading} onChange={(value) => setAssignForm((current) => ({ ...current, assignedTeamId: value }))} />
                </div>
              </div>
            ) : (
              <CompanyForm form={form} setForm={setForm} members={members} teams={teams} tags={tags} loadingOptions={optionsLoading} loadingTags={tagsLoading} />
            )}
            <div className="companies-modal-foot">
              <button className="companies-btn" disabled={saving} onClick={() => setModal(null)}>
                Cancel
              </button>
              <button className="companies-btn primary" disabled={saving} onClick={modal.mode === "assign" ? saveAssignment : saveCompany}>
                {saving ? (
                  <>
                    <span className="companies-spinner" />
                    Saving...
                  </>
                ) : modal.mode === "create" ? (
                  <>
                    <Plus size={14} />
                    Create Company
                  </>
                ) : (
                  <>
                    <Pencil size={14} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    {assigneeDetail ? <AssigneeDetailsPopup detail={assigneeDetail} onClose={() => setAssigneeDetail(null)} /> : null}
    </div>
  );
}
