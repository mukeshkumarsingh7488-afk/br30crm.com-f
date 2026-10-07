import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Building2, Check, ChevronDown, Edit3, Globe, Mail, MapPin, Phone, RefreshCw, Search, Tag, Trash2, UserRound, UsersRound, X, BriefcaseBusiness, ContactRound } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import useBusiness from "../../hooks/useBusiness";
import api from "../../api/api";
import { deleteCompany, getCompanyById, updateCompany } from "../../api/company.api";
import { getBusinessMembers } from "../../api/crm.api";
import { getTeams } from "../../api/operations.api";
import { showAuthAlert } from "../../components/auth/authAlert";
import ActivityTimeline from "../../components/crm/ActivityTimeline";

const SIZES = ["SOLO", "SMALL", "MEDIUM", "LARGE", "ENTERPRISE"];

const getId = (x) => x?._id || x?.id || "";
const memberSource = (x) => (x?.userId && typeof x.userId === "object" ? x.userId : x);
const memberName = (x) => {
  const u = memberSource(x);
  return [u?.firstName, u?.lastName].filter(Boolean).join(" ").trim() || u?.name || u?.fullName || u?.email || "Unnamed user";
};
const memberEmail = (x) => memberSource(x)?.email || x?.email || "";
const teamName = (x) => x?.name || x?.title || x?.teamName || x?.slug || "Unnamed team";
const tagName = (x) => x?.name || x?.title || x?.label || x?.slug || "Unnamed tag";
const message = (e, f = "Something went wrong.") => {
  const d = e?.response?.data;
  if (Array.isArray(d?.details) && d.details.length)
    return d.details
      .map((x) => x?.message)
      .filter(Boolean)
      .join(", ");
  return d?.message || d?.error?.message || d?.error || e?.message || f;
};
const extractRows = (r) => {
  const root = r?.data || r || {};
  const n = root?.data || root?.result || root?.payload || {};
  for (const s of [root, n]) for (const k of ["items", "contacts", "tags", "members", "teams", "results"]) if (Array.isArray(s?.[k])) return s[k];
  return Array.isArray(root) ? root : Array.isArray(n) ? n : [];
};
const dateTime = (v) => {
  if (!v) return "—";
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
};

function AssignDropdown({ type, value, onChange, items, loading }) {
  const [open, setOpen] = useState(false),
    [query, setQuery] = useState("");
  const ref = useRef(null);
  const user = type === "user";
  useEffect(() => {
    const fn = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);
  const filtered = items.filter((x) => `${user ? memberName(x) : teamName(x)} ${user ? memberEmail(x) : x?.slug || ""}`.toLowerCase().includes(query.toLowerCase()));
  const selected = items.find((x) => String(getId(user ? memberSource(x) : x)) === String(value || ""));
  return (
    <div className="cd-dropdown" ref={ref}>
      <button type="button" className="cd-dropdown-trigger" onClick={() => setOpen((x) => !x)} disabled={loading}>
        {user ? <UserRound size={14} /> : <UsersRound size={14} />}
        <span>{selected ? (user ? memberName(selected) : teamName(selected)) : "Unassigned"}</span>
        <ChevronDown size={14} />
      </button>
      {open && (
        <div className="cd-dropdown-menu">
          <div className="cd-dropdown-search">
            <Search size={13} />
            <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder={user ? "Search user..." : "Search team..."} />
          </div>
          <button
            type="button"
            className="cd-option"
            onClick={() => {
              onChange("");
              setOpen(false);
            }}>
            {user ? <UserRound size={14} /> : <UsersRound size={14} />}
            <span>Unassigned</span>
          </button>
          {filtered.map((item) => {
            const id = getId(user ? memberSource(item) : item);
            if (!id) return null;
            return (
              <button
                type="button"
                key={id}
                className={`cd-option ${String(value) === String(id) ? "selected" : ""}`}
                onClick={() => {
                  onChange(id);
                  setOpen(false);
                }}>
                {user ? <UserRound size={14} /> : <UsersRound size={14} />}
                <span>{user ? memberName(item) : teamName(item)}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function TagsSelect({ value, onChange, tags }) {
  const selected = Array.isArray(value) ? value : [];
  return (
    <div className="cd-tags-wrap">
      {tags.length ? (
        tags.map((tag) => {
          const id = getId(tag),
            active = selected.some((x) => String(x) === String(id));
          return id ? (
            <button type="button" key={id} className={`cd-tag-option ${active ? "selected" : ""}`} onClick={() => onChange(active ? selected.filter((x) => String(x) !== String(id)) : [...selected, id])}>
              <span>{active ? <Check size={10} /> : "+"}</span>
              {tagName(tag)}
            </button>
          ) : null;
        })
      ) : (
        <span className="cd-muted">No tags available.</span>
      )}
    </div>
  );
}

function Item({ label, value, icon: Icon }) {
  return (
    <div className="cd-item">
      <div className="cd-label">
        {Icon && <Icon size={11} />} {label}
      </div>
      <div className="cd-value">{value || "—"}</div>
    </div>
  );
}

export default function CompanyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { businessId, loading: businessLoading, error: businessError } = useBusiness();
  const [company, setCompany] = useState(null),
    [contacts, setContacts] = useState([]),
    [members, setMembers] = useState([]),
    [teams, setTeams] = useState([]),
    [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true),
    [contactsLoading, setContactsLoading] = useState(false),
    [optionsLoading, setOptionsLoading] = useState(false),
    [saving, setSaving] = useState(false),
    [error, setError] = useState("");
  const [editOpen, setEditOpen] = useState(false),
    [assignOpen, setAssignOpen] = useState(false),
    [form, setForm] = useState(null),
    [assignForm, setAssignForm] = useState({ assignedTo: "", assignedTeamId: "" });

  const loadCompany = useCallback(async () => {
    if (!businessId || !id) return;
    setLoading(true);
    try {
      const r = await getCompanyById(businessId, id);
      setCompany(r?.data?.company || r?.company || r?.data || r);
      setError("");
    } catch (e) {
      setCompany(null);
      setError(message(e, "Unable to load company details."));
    } finally {
      setLoading(false);
    }
  }, [businessId, id]);

  const loadContacts = useCallback(async () => {
    if (!businessId || !id) return;
    setContactsLoading(true);
    try {
      const r = await api.get(`/companies/business/${businessId}/${id}/contacts`, { params: { page: 1, limit: 100 } });
      setContacts(extractRows(r));
    } catch (e) {
      setContacts([]);
    } finally {
      setContactsLoading(false);
    }
  }, [businessId, id]);

  const loadOptions = useCallback(async () => {
    if (!businessId) return;
    setOptionsLoading(true);
    try {
      const [m, t, g] = await Promise.all([getBusinessMembers(businessId, { page: 1, limit: 100 }), getTeams(businessId, { page: 1, limit: 100 }), api.get(`/tags/business/${businessId}`, { params: { page: 1, limit: 100 } })]);
      setMembers(extractRows(m));
      setTeams(extractRows(t));
      setTags(extractRows(g));
    } catch (e) {
      await showAuthAlert({ icon: "error", title: "Options unavailable", text: message(e, "Unable to load users, teams or tags."), confirmButtonText: "OK" });
    } finally {
      setOptionsLoading(false);
    }
  }, [businessId]);

  const loadTags = useCallback(async () => {
    if (!businessId) return;
    try {
      const r = await api.get(`/tags/business/${businessId}`, {
        params: { page: 1, limit: 100 },
      });
      setTags(extractRows(r));
    } catch (e) {
      setTags([]);
    }
  }, [businessId]);

  useEffect(() => {
    if (businessId && id) {
      loadCompany();
      loadContacts();
      loadTags();
    }
  }, [businessId, id, loadCompany, loadContacts, loadTags]);

  const openEdit = async () => {
    if (!company) return;
    setForm({
      ...company,
      address: { street: company.address?.street || "", city: company.address?.city || "", state: company.address?.state || "", country: company.address?.country || "", postalCode: company.address?.postalCode || "" },
      assignedTo: company.assignedTo?._id || company.assignedTo || "",
      assignedTeamId: company.assignedTeamId?._id || company.assignedTeamId || "",
      tags: Array.isArray(company.tags) ? company.tags.map(getId).filter(Boolean) : [],
    });
    setEditOpen(true);
    await loadOptions();
  };

  const openAssign = async () => {
    setAssignForm({ assignedTo: company?.assignedTo?._id || company?.assignedTo || "", assignedTeamId: company?.assignedTeamId?._id || company?.assignedTeamId || "" });
    setAssignOpen(true);
    await loadOptions();
  };

  const saveEdit = async () => {
    if (!form || !businessId || !id) return;
    if (!String(form.name || "").trim()) {
      await showAuthAlert({ icon: "warning", title: "Company name required", text: "Please enter company name.", confirmButtonText: "OK" });
      return;
    }
    setSaving(true);
    try {
      await updateCompany(businessId, id, {
        name: String(form.name).trim(),
        legalName: form.legalName?.trim() || null,
        email: form.email?.trim() || null,
        phone: form.phone?.trim() || null,
        alternatePhone: form.alternatePhone?.trim() || null,
        website: form.website?.trim() || null,
        industry: form.industry?.trim() || null,
        companySize: form.companySize || "SMALL",
        source: form.source?.trim() || "manual",
        status: form.status || "ACTIVE",
        description: form.description?.trim() || null,
        address: form.address || {},
        assignedTo: form.assignedTo || null,
        assignedTeamId: form.assignedTeamId || null,
        tags: Array.isArray(form.tags) ? form.tags : [],
      });
      setEditOpen(false);
      await loadCompany();
      await showAuthAlert({ icon: "success", title: "Company updated", text: "Company updated successfully.", confirmButtonText: "Done" });
    } catch (e) {
      await showAuthAlert({ icon: "error", title: "Update failed", text: message(e, "Unable to update company."), confirmButtonText: "OK" });
    } finally {
      setSaving(false);
    }
  };

  const saveAssign = async () => {
    if (!businessId || !id) return;
    setSaving(true);
    try {
      await api.patch(`/companies/business/${businessId}/${id}/assign`, { assignedTo: assignForm.assignedTo || null, assignedTeamId: assignForm.assignedTeamId || null });
      setAssignOpen(false);
      await loadCompany();
      await showAuthAlert({ icon: "success", title: "Assignment updated", text: "Company assignment updated successfully.", confirmButtonText: "Done" });
    } catch (e) {
      await showAuthAlert({ icon: "error", title: "Assignment failed", text: message(e, "Unable to update assignment."), confirmButtonText: "OK" });
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    const r = await showAuthAlert({ icon: "warning", title: "Delete company?", text: `${company?.name || "This company"} will be permanently removed if it has no linked contacts.`, showCancelButton: true, confirmButtonText: "Delete", cancelButtonText: "Cancel" });
    if (!r?.isConfirmed) return;
    setSaving(true);
    try {
      await deleteCompany(businessId, id);
      await showAuthAlert({ icon: "success", title: "Company deleted", text: "Company deleted successfully.", confirmButtonText: "Done" });
      navigate("/crm/companies");
    } catch (e) {
      await showAuthAlert({ icon: "error", title: "Delete failed", text: message(e, "Unable to delete company."), confirmButtonText: "OK" });
    } finally {
      setSaving(false);
    }
  };

  const assignedUser = company?.assignedTo?.name || [company?.assignedTo?.firstName, company?.assignedTo?.lastName].filter(Boolean).join(" ") || company?.assignedTo?.email;
  const assignedTeam = company?.assignedTeamId?.name || company?.assignedTeamId?.title || company?.assignedTeamId?.teamName;

  const companyTags = useMemo(() => {
    if (!Array.isArray(company?.tags)) return [];

    return company.tags
      .map((tag) => {
        if (tag && typeof tag === "object" && (tag.name || tag.title || tag.label || tag.slug)) {
          return tag;
        }

        const tagId = typeof tag === "string" ? tag : getId(tag);
        return tags.find((item) => String(getId(item)) === String(tagId)) || null;
      })
      .filter(Boolean);
  }, [company, tags]);

  if (businessLoading || loading)
    return (
      <div className="company-details-page">
        <style>{`.company-details-page{padding:28px 30px;color:var(--crm-text)}.cd-loading{padding:60px;text-align:center;color:var(--crm-muted)}`}</style>
        <div className="cd-loading">Loading company details...</div>
      </div>
    );

  if (businessError || error || !company)
    return (
      <div className="company-details-page">
        <style>{`.company-details-page{padding:28px 30px;color:var(--crm-text)}.cd-back{height:35px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:9px;padding:0 12px;display:inline-flex;align-items:center;gap:6px}.cd-error{margin-top:18px;padding:18px;border:1px solid var(--crm-border);border-radius:12px;color:var(--crm-danger);background:var(--crm-surface)}`}</style>
        <button className="cd-back" onClick={() => navigate("/companies")}>
          <ArrowLeft size={14} />
          Back to Companies
        </button>
        <div className="cd-error">{error || businessError || "Company not found."}</div>
      </div>
    );

  return (
    <div className="company-details-page">
      <style>{`.company-details-page{padding:28px 30px 42px;max-width:1600px;margin:0 auto;color:var(--crm-text)}.cd-top{display:flex;align-items:flex-end;justify-content:space-between;gap:20px;margin-bottom:20px}.cd-back,.cd-btn{height:35px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:9px;padding:0 11px;display:inline-flex;align-items:center;justify-content:center;gap:6px;font-size:13px;font-weight:400;cursor:pointer}.cd-back{margin-bottom:12px}.cd-btn.primary{background:var(--crm-primary);border-color:var(--crm-primary);color:#fff}.cd-btn.danger:hover{border-color:var(--crm-danger);color:var(--crm-danger)}.cd-heading{font-size:28px;font-weight:400;margin:0}.cd-subtitle{font-size:13px;color:var(--crm-muted);margin-top:5px}.cd-actions{display:flex;gap:7px}.cd-hero{background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:14px;padding:18px;display:flex;align-items:center;gap:14px;margin-bottom:13px}.cd-hero-icon{width:50px;height:50px;border-radius:13px;background:color-mix(in srgb,var(--crm-primary) 12%,transparent);color:var(--crm-primary);display:grid;place-items:center}.cd-hero-name{font-size:19px;font-weight:400}.cd-meta{display:flex;gap:7px;flex-wrap:wrap;margin-top:5px}.cd-badge{padding:5px 8px;border-radius:999px;font-size:13px;font-weight:400;background:var(--crm-surface-2);border:1px solid var(--crm-border);color:var(--crm-muted)}.cd-badge.active{color:var(--crm-success)}.cd-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.cd-card{background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:13px;overflow:visible}.cd-card.full{grid-column:1/-1}.cd-card-head{padding:13px 15px;border-bottom:1px solid var(--crm-border);display:flex;align-items:center;justify-content:space-between}.cd-card-title{display:flex;align-items:center;gap:7px;font-size:13px;font-weight:400}.cd-card-title svg,.cd-label svg{color:var(--crm-primary)}.cd-card-body{padding:14px}.cd-fields{display:grid;grid-template-columns:1fr 1fr;gap:10px}.cd-item{padding:11px;border:1px solid var(--crm-border);border-radius:9px}.cd-label{display:flex;align-items:center;gap:5px;font-size:13px;text-transform:uppercase;letter-spacing:.06em;color:var(--crm-muted);font-weight:400}.cd-value{margin-top:5px;font-size:13px;word-break:break-word;line-height:1.45}.cd-assignment{display:grid;grid-template-columns:1fr 1fr;gap:10px}.cd-assignment-box{padding:11px;border:1px solid var(--crm-border);border-radius:9px}.cd-assignment-label{font-size:13px;text-transform:uppercase;color:var(--crm-muted);font-weight:400;margin-bottom:6px}.cd-assignment-value{display:flex;align-items:center;gap:6px;font-size:13px;font-weight:400}.cd-tags-view{display:flex;flex-wrap:wrap;gap:6px}.cd-tag-view{padding:5px 8px;border:1px solid var(--crm-border);border-radius:999px;font-size:13px;font-weight:400}.cd-description{white-space:pre-wrap;font-size:13px;line-height:1.6}.cd-table{width:100%;border-collapse:collapse}.cd-table th{padding:9px 10px;background:var(--crm-surface-2);font-size:13px;text-align:left;color:var(--crm-muted);text-transform:uppercase}.cd-table td{padding:10px;border-bottom:1px solid var(--crm-border);font-size:13px}.cd-empty{text-align:center;padding:25px;color:var(--crm-muted);font-size:13px}.cd-modal-bg{position:fixed;inset:0;z-index:3000;background:rgba(0,0,0,.48);display:grid;place-items:center;padding:18px}.cd-modal{width:min(850px,100%);max-height:94vh;background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:14px;overflow:hidden;display:flex;flex-direction:column}.cd-modal-head{display:flex;align-items:center;justify-content:space-between;padding:17px 20px;border-bottom:1px solid var(--crm-border)}.cd-modal-head h2{font-size:18px;margin:0}.cd-modal-body{overflow:auto}.cd-form{padding:20px;display:grid;grid-template-columns:1fr 1fr;gap:14px}.cd-field{display:grid;gap:6px}.cd-field.full{grid-column:1/-1}.cd-field label{font-size:13px;font-weight:400}.cd-field input,.cd-field select,.cd-field textarea{width:100%;box-sizing:border-box;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:9px;padding:10px 11px;outline:0;font-size:13px}.cd-field textarea{min-height:100px}.cd-modal-foot{display:flex;justify-content:flex-end;gap:8px;padding:14px 20px;border-top:1px solid var(--crm-border)}.cd-dropdown,.cd-tags-select{position:relative}.cd-dropdown-trigger{width:100%;min-height:40px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:9px;padding:0 11px;display:flex;align-items:center;gap:8px;text-align:left}.cd-dropdown-trigger span{flex:1}.cd-dropdown-menu{position:absolute;left:0;right:0;top:calc(100% + 5px);z-index:3200;max-height:260px;overflow:auto;background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:10px;padding:6px;box-shadow:0 16px 40px rgba(0,0,0,.2)}.cd-dropdown-search{display:flex;gap:7px;padding:7px;border:1px solid var(--crm-border);border-radius:8px;margin-bottom:5px}.cd-dropdown-search input{flex:1;border:0;background:transparent;color:var(--crm-text);outline:0}.cd-option{width:100%;border:0;background:transparent;color:var(--crm-text);display:flex;align-items:center;gap:9px;padding:9px;border-radius:8px;text-align:left}.cd-option:hover,.cd-option.selected{background:color-mix(in srgb,var(--crm-primary) 9%,transparent)}.cd-tags-select{position:relative}.cd-tags-trigger{width:100%;min-height:40px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:9px;padding:0 11px;display:flex;align-items:center;gap:8px;text-align:left;cursor:pointer}.cd-tags-trigger span{flex:1}.cd-tags-trigger-muted{color:var(--crm-muted)}.cd-tags-trigger-value{color:var(--crm-text)}.cd-selected-tags{display:flex;flex-wrap:wrap;gap:5px;margin-top:6px}.cd-selected-tag{display:inline-flex;align-items:center;gap:5px;border:1px solid var(--crm-primary);background:color-mix(in srgb,var(--crm-primary) 9%,transparent);color:var(--crm-text);border-radius:999px;padding:5px 7px;font-size:13px;font-weight:400}.cd-selected-tag button{width:16px;height:16px;border:0;border-radius:50%;display:grid;place-items:center;background:transparent;color:var(--crm-muted);padding:0;cursor:pointer}.cd-selected-tag button:hover{color:var(--crm-text);background:color-mix(in srgb,var(--crm-primary) 12%,transparent)}.cd-tags-menu{position:absolute;left:0;right:0;top:calc(100% + 5px);z-index:3200;max-height:285px;overflow:auto;background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:10px;padding:6px;box-shadow:0 16px 40px rgba(0,0,0,.2)}.cd-tags-search{display:flex;align-items:center;gap:7px;padding:7px;border:1px solid var(--crm-border);border-radius:8px;margin-bottom:5px}.cd-tags-search input{flex:1;border:0;background:transparent;color:var(--crm-text);outline:0;font-size:13px}.cd-tags-search button{border:0;background:transparent;color:var(--crm-muted);padding:2px;display:grid;place-items:center;cursor:pointer}.cd-tags-options{display:grid;gap:2px}.cd-tag-option{width:100%;border:0;background:transparent;color:var(--crm-text);display:flex;align-items:center;gap:8px;padding:9px;border-radius:8px;text-align:left;font-size:13px;cursor:pointer}.cd-tag-option:hover,.cd-tag-option.selected{background:color-mix(in srgb,var(--crm-primary) 9%,transparent)}.cd-tag-check{width:16px;height:16px;border:1px solid var(--crm-border);border-radius:4px;display:grid;place-items:center;flex:0 0 16px;color:var(--crm-primary)}.cd-tag-option.selected .cd-tag-check{border-color:var(--crm-primary);background:color-mix(in srgb,var(--crm-primary) 12%,transparent)}.cd-tags-empty{padding:12px 9px;text-align:center;color:var(--crm-muted);font-size:13px}.cd-muted{font-size:13px;color:var(--crm-muted)}@media(max-width:850px){.cd-grid{grid-template-columns:1fr}.cd-card.full{grid-column:auto}.cd-top{align-items:flex-start;flex-direction:column}.cd-actions{width:100%;flex-wrap:wrap}.cd-fields,.cd-assignment,.cd-form{grid-template-columns:1fr}.cd-field.full{grid-column:auto}}@media(max-width:600px){.company-details-page{padding:18px 14px 30px}.cd-heading{font-size:22px}}`}</style>

      <div className="cd-top">
        <div>
          <button className="cd-back" onClick={() => navigate("/companies")}>
            <ArrowLeft size={14} />
            Back to Companies
          </button>
          <h1 className="cd-heading">{company.name || "Company"}</h1>
          <div className="cd-subtitle">{company.legalName || company.website || "Business organization profile"}</div>
        </div>
        <div className="cd-actions">
          <button
            className="cd-btn"
            onClick={() => {
              loadCompany();
              loadContacts();
            }}>
            <RefreshCw size={14} />
            Refresh
          </button>
          <button className="cd-btn" onClick={openAssign}>
            <UsersRound size={14} />
            Assign
          </button>
          <button className="cd-btn" onClick={openEdit}>
            <Edit3 size={14} />
            Edit
          </button>
          <button className="cd-btn danger" onClick={remove} disabled={saving}>
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      </div>

      <div className="cd-hero">
        <div className="cd-hero-icon">
          <Building2 size={24} />
        </div>
        <div>
          <div className="cd-hero-name">{company.name || "Unnamed company"}</div>
          <div className="cd-meta">
            <span className={`cd-badge ${company.status === "ACTIVE" ? "active" : ""}`}>{company.status || "—"}</span>
            <span className="cd-badge">{company.companySize || "—"}</span>
            {company.industry && <span className="cd-badge">{company.industry}</span>}
          </div>
        </div>
      </div>

      <div className="cd-grid">
        <div className="cd-card">
          <div className="cd-card-head">
            <div className="cd-card-title">
              <Building2 size={14} />
              Company information
            </div>
          </div>
          <div className="cd-card-body">
            <div className="cd-fields">
              <Item label="Company name" value={company.name} icon={Building2} />
              <Item label="Legal name" value={company.legalName} icon={BriefcaseBusiness} />
              <Item label="Industry" value={company.industry} />
              <Item label="Company size" value={company.companySize} />
              <Item label="Source" value={company.source} />
              <Item label="Status" value={company.status} />
              <Item label="Created" value={dateTime(company.createdAt)} />
              <Item label="Updated" value={dateTime(company.updatedAt)} />
            </div>
          </div>
        </div>

        <div className="cd-card">
          <div className="cd-card-head">
            <div className="cd-card-title">
              <ContactRound size={14} />
              Contact information
            </div>
          </div>
          <div className="cd-card-body">
            <div className="cd-fields">
              <Item label="Email" value={company.email} icon={Mail} />
              <Item label="Phone" value={company.phone} icon={Phone} />
              <Item label="Alternate phone" value={company.alternatePhone} icon={Phone} />
              <Item label="Website" value={company.website} icon={Globe} />
            </div>
          </div>
        </div>

        <div className="cd-card full">
          <div className="cd-card-head">
            <div className="cd-card-title">
              <UsersRound size={14} />
              Assignment
            </div>
          </div>
          <div className="cd-card-body">
            <div className="cd-assignment">
              <div className="cd-assignment-box">
                <div className="cd-assignment-label">User</div>
                <div className="cd-assignment-value">
                  <UserRound size={13} />
                  {assignedUser ? `User: ${assignedUser}` : "User: Unassigned"}
                </div>
              </div>
              <div className="cd-assignment-box">
                <div className="cd-assignment-label">Team</div>
                <div className="cd-assignment-value">
                  <UsersRound size={13} />
                  {assignedTeam ? `Team: ${assignedTeam}` : "Team: Unassigned"}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="cd-card">
          <div className="cd-card-head">
            <div className="cd-card-title">
              <MapPin size={14} />
              Address
            </div>
          </div>
          <div className="cd-card-body">
            <div className="cd-fields">
              <Item label="Street" value={company.address?.street} icon={MapPin} />
              <Item label="City" value={company.address?.city} />
              <Item label="State" value={company.address?.state} />
              <Item label="Country" value={company.address?.country} />
              <Item label="Postal code" value={company.address?.postalCode} />
            </div>
          </div>
        </div>

        <div className="cd-card">
          <div className="cd-card-head">
            <div className="cd-card-title">
              <Tag size={14} />
              Tags
            </div>
          </div>
          <div className="cd-card-body">
            {companyTags.length ? (
              <div className="cd-tags-view">
                {companyTags.map((t) => (
                  <span className="cd-tag-view" key={getId(t)}>
                    {tagName(t)}
                  </span>
                ))}
              </div>
            ) : (
              <div className="cd-empty">No tags added.</div>
            )}
          </div>
        </div>

        <div className="cd-card full">
          <div className="cd-card-head">
            <div className="cd-card-title">
              <BriefcaseBusiness size={14} />
              Description
            </div>
          </div>
          <div className="cd-card-body">
            <div className="cd-description">{company.description || "No description added."}</div>
          </div>
        </div>

        <div className="cd-card full">
          <div className="cd-card-head">
            <div className="cd-card-title">
              <ContactRound size={14} />
              Linked contacts
            </div>
            <span className="cd-badge">{contacts.length}</span>
          </div>
          <div className="cd-card-body">
            {contactsLoading ? (
              <div className="cd-empty">Loading contacts...</div>
            ) : !contacts.length ? (
              <div className="cd-empty">No contacts linked with this company.</div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table className="cd-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map((c) => (
                      <tr key={c._id || c.id}>
                        <td>{[c.firstName, c.lastName].filter(Boolean).join(" ") || c.name || "—"}</td>
                        <td>{c.email || "—"}</td>
                        <td>{c.phone || "—"}</td>
                        <td>{c.status || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <ActivityTimeline businessId={businessId} companyId={company?._id} title="Activity timeline" subtitle="Complete activity history for this company." />
      </div>

      {editOpen && form && (
        <div className="cd-modal-bg">
          <div className="cd-modal">
            <div className="cd-modal-head">
              <h2>Edit Company</h2>
              <button className="cd-btn" onClick={() => setEditOpen(false)}>
                <X size={15} />
              </button>
            </div>
            <div className="cd-modal-body">
              <div className="cd-form">
                {["name", "legalName", "email", "phone", "alternatePhone", "website", "industry", "source"].map((k) => (
                  <div className="cd-field" key={k}>
                    <label>{k === "name" ? "Company name *" : k.replace(/([A-Z])/g, " $1").replace(/^./, (x) => x.toUpperCase())}</label>
                    <input type={k === "email" ? "email" : "text"} value={form[k] || ""} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
                  </div>
                ))}
                <div className="cd-field">
                  <label>Company size</label>
                  <select value={form.companySize || "SMALL"} onChange={(e) => setForm({ ...form, companySize: e.target.value })}>
                    {SIZES.map((x) => (
                      <option key={x} value={x}>
                        {x}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="cd-field">
                  <label>Status</label>
                  <select value={form.status || "ACTIVE"} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
                <div className="cd-field full">
                  <label>Street</label>
                  <input value={form.address?.street || ""} onChange={(e) => setForm({ ...form, address: { ...form.address, street: e.target.value } })} />
                </div>
                {["city", "state", "country", "postalCode"].map((k) => (
                  <div className="cd-field" key={k}>
                    <label>{k.replace(/^./, (x) => x.toUpperCase())}</label>
                    <input value={form.address?.[k] || ""} onChange={(e) => setForm({ ...form, address: { ...form.address, [k]: e.target.value } })} />
                  </div>
                ))}
                <div className="cd-field">
                  <label>Assigned user</label>
                  <AssignDropdown type="user" value={form.assignedTo} onChange={(v) => setForm({ ...form, assignedTo: v })} items={members} loading={optionsLoading} />
                </div>
                <div className="cd-field">
                  <label>Assigned team</label>
                  <AssignDropdown type="team" value={form.assignedTeamId} onChange={(v) => setForm({ ...form, assignedTeamId: v })} items={teams} loading={optionsLoading} />
                </div>
                <div className="cd-field full">
                  <label>Tags</label>
                  <TagsSelect value={form.tags} onChange={(v) => setForm({ ...form, tags: v })} tags={tags} />
                </div>
                <div className="cd-field full">
                  <label>Description</label>
                  <textarea value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
              </div>
            </div>
            <div className="cd-modal-foot">
              <button className="cd-btn" disabled={saving} onClick={() => setEditOpen(false)}>
                Cancel
              </button>
              <button className="cd-btn primary" disabled={saving} onClick={saveEdit}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {assignOpen && (
        <div className="cd-modal-bg">
          <div className="cd-modal" style={{ width: "min(620px,100%)" }}>
            <div className="cd-modal-head">
              <h2>Assign Company</h2>
              <button className="cd-btn" onClick={() => setAssignOpen(false)}>
                <X size={15} />
              </button>
            </div>
            <div className="cd-modal-body">
              <div className="cd-form">
                <div className="cd-field full">
                  <label>User</label>
                  <AssignDropdown type="user" value={assignForm.assignedTo} onChange={(v) => setAssignForm({ ...assignForm, assignedTo: v })} items={members} loading={optionsLoading} />
                </div>
                <div className="cd-field full">
                  <label>Team</label>
                  <AssignDropdown type="team" value={assignForm.assignedTeamId} onChange={(v) => setAssignForm({ ...assignForm, assignedTeamId: v })} items={teams} loading={optionsLoading} />
                </div>
              </div>
            </div>
            <div className="cd-modal-foot">
              <button className="cd-btn" onClick={() => setAssignOpen(false)}>
                Cancel
              </button>
              <button className="cd-btn primary" disabled={saving} onClick={saveAssign}>
                {saving ? "Saving..." : "Save Assignment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
