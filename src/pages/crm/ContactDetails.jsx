import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, BriefcaseBusiness, CalendarDays, Check, ChevronDown, Edit3, Mail, MapPin, Phone, RefreshCw, Search, Trash2, UserRound, UsersRound, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getTags, getTagRows } from "../../api/tag.api";
import { deleteContact, getContactById, updateContact } from "../../api/contact.api";
import api from "../../api/api";
import { getBusinessMembers } from "../../api/crm.api";
import { getTeams } from "../../api/operations.api";

import { showAuthAlert } from "../../components/auth/authAlert";
import useBusiness from "../../hooks/useBusiness";
import ActivityTimeline from "../../components/crm/ActivityTimeline";

const getErrorMessage = (error, fallback) => {
  const data = error?.response?.data;

  if (Array.isArray(data?.details) && data.details.length) {
    return data.details
      .map((item) => item?.message)
      .filter(Boolean)
      .join(", ");
  }

  return data?.message || data?.error?.message || data?.error || error?.message || fallback;
};

const getContactName = (contact) => {
  const fullName = [contact?.firstName, contact?.lastName].filter(Boolean).join(" ").trim();

  return fullName || contact?.name || "Unnamed contact";
};

const getInitials = (contact) => {
  const name = getContactName(contact);

  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "CO"
  );
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

const getId = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value?._id || value?.id || "";
};

const getMemberObject = (value) => (value?.userId && typeof value.userId === "object" ? value.userId : value);

const getMemberName = (member) => {
  const user = getMemberObject(member);
  return [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() || user?.name || user?.fullName || user?.email || "Unnamed user";
};

const getMemberEmail = (member) => {
  const user = getMemberObject(member);
  return user?.email || member?.email || "";
};

const getTeamName = (team) => team?.name || team?.title || team?.teamName || "Unnamed team";
const getTagName = (tag) => {
  if (tag && typeof tag === "object") {
    return tag?.name || tag?.title || tag?.label || tag?.slug || "Unnamed tag";
  }

  const foundTag = tags.find((item) => String(getId(item)) === String(tag));

  return foundTag?.name || foundTag?.title || foundTag?.label || foundTag?.slug || "Unnamed tag";
};

const normaliseTagIds = (tags) => {
  if (!Array.isArray(tags)) return [];
  return tags.map((tag) => getId(tag)).filter(Boolean);
};

const getCustomFieldsValue = (customFields) => {
  if (!customFields || typeof customFields !== "object") return "";
  try {
    return JSON.stringify(customFields, null, 2);
  } catch {
    return "";
  }
};

const parseCustomFields = (value) => {
  if (value === undefined || value === null || String(value).trim() === "") return {};
  if (typeof value === "object" && !Array.isArray(value)) return value;
  const raw = String(value).trim();
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Custom fields must be a JSON object.");
    return parsed;
  } catch {
    throw new Error('Custom fields must be valid JSON, for example {"customerType":"VIP"}.');
  }
};

const buildEditForm = (contact) => ({
  firstName: contact?.firstName || "",
  lastName: contact?.lastName || "",
  email: contact?.email || "",
  phone: contact?.phone || "",
  alternatePhone: contact?.alternatePhone || "",
  jobTitle: contact?.jobTitle || "",
  companyId: contact?.companyId?._id || contact?.companyId || "",
  source: contact?.source || "manual",
  status: contact?.status || "ACTIVE",
  lifecycleStage: contact?.lifecycleStage || "CONTACT",
  description: contact?.description || "",
  assignedTo: getId(contact?.assignedTo),
  assignedTeamId: getId(contact?.assignedTeamId),
  tags: normaliseTagIds(contact?.tags),
  customFields: getCustomFieldsValue(contact?.customFields),
  address: {
    street: contact?.address?.street || "",
    city: contact?.address?.city || "",
    state: contact?.address?.state || "",
    country: contact?.address?.country || "",
    postalCode: contact?.address?.postalCode || "",
  },
});

const buildPayload = (form) => {
  const payload = {
    firstName: String(form.firstName || "").trim(),
    lastName: String(form.lastName || "").trim(),
    email: String(form.email || "").trim(),
    phone: String(form.phone || "").trim(),
    alternatePhone: String(form.alternatePhone || "").trim(),
    jobTitle: String(form.jobTitle || "").trim(),
    source: String(form.source || "").trim(),
    status: form.status,
    lifecycleStage: form.lifecycleStage,
    description: String(form.description || "").trim(),
    tags: Array.isArray(form.tags) ? form.tags.filter(Boolean) : [],
    customFields: parseCustomFields(form.customFields),
  };

  payload.companyId = String(form.companyId || "").trim() || null;
  payload.assignedTo = String(form.assignedTo || "").trim() || null;
  payload.assignedTeamId = String(form.assignedTeamId || "").trim() || null;

  const address = {};
  Object.entries(form.address || {}).forEach(([key, value]) => {
    const trimmed = String(value || "").trim();
    if (trimmed) address[key] = trimmed;
  });
  if (Object.keys(address).length) payload.address = address;
  return payload;
};

function SearchableAssignmentDropdown({ type, value, onChange, members, teams, loading }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef(null);
  const isUser = type === "user";
  const options = isUser ? members : teams;

  useEffect(() => {
    const handler = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
        setQuery("");
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const selected = options.find((item) => String(getId(isUser ? (item?.userId && typeof item.userId === "object" ? item.userId : item) : item)) === String(value || ""));
  const filtered = options.filter((item) => {
    const text = isUser ? `${getMemberName(item)} ${getMemberEmail(item)}` : `${getTeamName(item)} ${item?.slug || ""}`;
    return text.toLowerCase().includes(query.trim().toLowerCase());
  });

  const choose = (next) => {
    onChange(next);
    setOpen(false);
    setQuery("");
  };

  return (
    <div ref={ref} className="contact-edit-dropdown">
      <button
        type="button"
        className="contact-edit-dropdown-trigger"
        onClick={() => {
          setOpen((v) => !v);
          setQuery("");
        }}
        disabled={loading}>
        {isUser ? <UserRound size={14} /> : <UsersRound size={14} />}
        <span>{selected ? (isUser ? getMemberName(selected) : getTeamName(selected)) : isUser ? "Select user" : "Select team"}</span>
        <ChevronDown size={14} />
      </button>
      {open && (
        <div className="contact-edit-dropdown-menu">
          <div className="contact-edit-dropdown-search">
            <Search size={13} />
            <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder={isUser ? "Search name or email..." : "Search team..."} />
            {query && (
              <button type="button" onClick={() => setQuery("")}>
                <X size={13} />
              </button>
            )}
          </div>
          <button type="button" className={`contact-edit-dropdown-option ${!value ? "selected" : ""}`} onClick={() => choose("")}>
            {isUser ? <UserRound size={14} /> : <UsersRound size={14} />}
            <span>
              <strong>Unassigned</strong>
              <small>{isUser ? "Remove user assignment" : "Remove team assignment"}</small>
            </span>
          </button>
          {filtered.map((item) => {
            const source = isUser && item?.userId && typeof item.userId === "object" ? item.userId : item;
            const id = getId(source);
            if (!id) return null;
            return (
              <button type="button" key={id} className={`contact-edit-dropdown-option ${String(value || "") === String(id) ? "selected" : ""}`} onClick={() => choose(id)}>
                {isUser ? <UserRound size={14} /> : <UsersRound size={14} />}
                <span>
                  <strong>{isUser ? getMemberName(item) : getTeamName(item)}</strong>
                  {isUser ? <small>{getMemberEmail(item)}</small> : item?.slug ? <small>{item.slug}</small> : null}
                </span>
              </button>
            );
          })}
          {!loading && filtered.length === 0 && <div className="contact-edit-dropdown-empty">{isUser ? "No users found." : "No teams found."}</div>}
        </div>
      )}
    </div>
  );
}

function SearchableTagsDropdown({ value, onChange, tags, loading }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef(null);
  const selectedIds = Array.isArray(value) ? value : [];

  useEffect(() => {
    const handler = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
        setQuery("");
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const filtered = tags.filter((tag) => `${getTagName(tag)} ${tag?.slug || ""}`.toLowerCase().includes(query.trim().toLowerCase()));
  const selectedTags = selectedIds.map((id) => tags.find((tag) => String(getId(tag)) === String(id))).filter(Boolean);

  const toggle = (id) => {
    if (!id) return;
    onChange(selectedIds.some((item) => String(item) === String(id)) ? selectedIds.filter((item) => String(item) !== String(id)) : [...selectedIds, id]);
  };

  return (
    <div ref={ref} className="contact-edit-dropdown contact-edit-tags-dropdown">
      <button
        type="button"
        className="contact-edit-dropdown-trigger"
        onClick={() => {
          setOpen((v) => !v);
          setQuery("");
        }}
        disabled={loading}>
        <span>{loading ? "Loading tags..." : selectedTags.length ? `${selectedTags.length} tag${selectedTags.length > 1 ? "s" : ""} selected` : "Select tags"}</span>
        <ChevronDown size={14} />
      </button>
      {selectedTags.length > 0 && (
        <div className="contact-edit-tag-chips">
          {selectedTags.map((tag) => {
            const tagId = getId(tag);
            return (
              <span className="contact-edit-tag-chip" key={tagId}>
                {getTagName(tag)}
                <button type="button" onClick={() => toggle(tagId)}>
                  <X size={10} />
                </button>
              </span>
            );
          })}
        </div>
      )}
      {open && (
        <div className="contact-edit-dropdown-menu">
          <div className="contact-edit-dropdown-search">
            <Search size={13} />
            <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tags..." />
            {query && (
              <button type="button" onClick={() => setQuery("")}>
                <X size={13} />
              </button>
            )}
          </div>
          {filtered.map((tag) => {
            const id = getId(tag);
            if (!id) return null;
            const selected = selectedIds.some((item) => String(item) === String(id));
            return (
              <button type="button" key={id} className={`contact-edit-dropdown-option ${selected ? "selected" : ""}`} onClick={() => toggle(id)}>
                <span className={`contact-edit-check ${selected ? "selected" : ""}`}>{selected ? <Check size={10} /> : null}</span>
                <span>
                  <strong>{getTagName(tag)}</strong>
                  {tag?.slug && <small>{tag.slug}</small>}
                </span>
              </button>
            );
          })}
          {!loading && filtered.length === 0 && <div className="contact-edit-dropdown-empty">{query ? "No tags found." : "No tags available."}</div>}
        </div>
      )}
    </div>
  );
}

function EditContactModal({ form, setForm, saving, onCancel, onSubmit, members, teams, tags, loadingOptions, loadingTags }) {
  const update = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const updateAddress = (field, value) => {
    setForm((current) => ({
      ...current,
      address: {
        ...current.address,
        [field]: value,
      },
    }));
  };

  const handleKeyDown = (event) => {
    if (event.key !== "Enter") return;

    if (event.shiftKey || event.ctrlKey || event.metaKey || event.target.tagName === "TEXTAREA" || event.target.tagName === "SELECT") {
      return;
    }

    event.preventDefault();

    const formElement = event.currentTarget;

    const focusable = Array.from(formElement.querySelectorAll("input:not([disabled]),select:not([disabled]),textarea:not([disabled])")).filter((element) => element.offsetParent !== null);

    const index = focusable.indexOf(event.target);

    if (index >= 0 && index < focusable.length - 1) {
      focusable[index + 1].focus();
    } else {
      onSubmit();
    }
  };

  return (
    <div className="contact-edit-backdrop">
      <div className="contact-edit-modal">
        <div className="contact-edit-head">
          <div>
            <div className="contact-edit-eyebrow">Contact management</div>

            <h2 className="contact-edit-title">Edit contact</h2>

            <p className="contact-edit-subtitle">Update contact information and CRM details.</p>
          </div>

          <button type="button" className="contact-edit-close" onClick={onCancel} disabled={saving}>
            <X size={17} />
          </button>
        </div>

        <div className="contact-edit-body">
          <form className="contact-edit-form" onKeyDown={handleKeyDown}>
            <div className="contact-edit-section full">
              <div className="contact-edit-section-title">
                <UserRound size={15} />
                Basic information
              </div>
            </div>

            <div className="contact-edit-field">
              <label>
                First name <span>*</span>
              </label>

              <input autoFocus value={form.firstName} onChange={(event) => update("firstName", event.target.value)} maxLength={100} />
            </div>

            <div className="contact-edit-field">
              <label>Last name</label>

              <input value={form.lastName} onChange={(event) => update("lastName", event.target.value)} maxLength={100} />
            </div>

            <div className="contact-edit-field">
              <label>Email</label>

              <input type="email" value={form.email} onChange={(event) => update("email", event.target.value)} maxLength={200} />
            </div>

            <div className="contact-edit-field">
              <label>Phone</label>

              <input value={form.phone} onChange={(event) => update("phone", event.target.value)} maxLength={50} />
            </div>

            <div className="contact-edit-field">
              <label>Alternate phone</label>

              <input value={form.alternatePhone} onChange={(event) => update("alternatePhone", event.target.value)} maxLength={50} />
            </div>

            <div className="contact-edit-field">
              <label>Job title</label>

              <input value={form.jobTitle} onChange={(event) => update("jobTitle", event.target.value)} maxLength={150} />
            </div>

            <div className="contact-edit-section full">
              <div className="contact-edit-section-title">
                <BriefcaseBusiness size={15} />
                CRM information
              </div>
            </div>

            <div className="contact-edit-field">
              <label>Company ID</label>

              <input value={form.companyId} onChange={(event) => update("companyId", event.target.value)} placeholder="24-character company ID" />
            </div>

            <div className="contact-edit-field">
              <label>Source</label>

              <input value={form.source} onChange={(event) => update("source", event.target.value)} maxLength={100} />
            </div>

            <div className="contact-edit-field">
              <label>Status</label>

              <div className="contact-edit-select">
                <select value={form.status} onChange={(event) => update("status", event.target.value)}>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>

                <ChevronDown size={14} />
              </div>
            </div>

            <div className="contact-edit-field">
              <label>Lifecycle stage</label>

              <div className="contact-edit-select">
                <select value={form.lifecycleStage} onChange={(event) => update("lifecycleStage", event.target.value)}>
                  <option value="CONTACT">Contact</option>
                  <option value="CUSTOMER">Customer</option>
                  <option value="REPEAT_CUSTOMER">Repeat customer</option>
                  <option value="OTHER">Other</option>
                </select>

                <ChevronDown size={14} />
              </div>
            </div>

            <div className="contact-edit-section full">
              <div className="contact-edit-section-title">
                <UsersRound size={15} />
                Ownership
              </div>
            </div>

            <div className="contact-edit-field">
              <label>Assigned user</label>
              <SearchableAssignmentDropdown type="user" value={form.assignedTo} onChange={(value) => update("assignedTo", value)} members={members} teams={teams} loading={loadingOptions || saving} />
              <div className="contact-edit-help">Search by user name or email.</div>
            </div>

            <div className="contact-edit-field">
              <label>Assigned team</label>
              <SearchableAssignmentDropdown type="team" value={form.assignedTeamId} onChange={(value) => update("assignedTeamId", value)} members={members} teams={teams} loading={loadingOptions || saving} />
              <div className="contact-edit-help">Search by team name.</div>
            </div>

            <div className="contact-edit-section full">
              <div className="contact-edit-section-title">
                <MapPin size={15} />
                Address
              </div>
            </div>

            <div className="contact-edit-field full">
              <label>Street</label>

              <input value={form.address.street} onChange={(event) => updateAddress("street", event.target.value)} maxLength={250} />
            </div>

            <div className="contact-edit-field">
              <label>City</label>

              <input value={form.address.city} onChange={(event) => updateAddress("city", event.target.value)} maxLength={100} />
            </div>

            <div className="contact-edit-field">
              <label>State</label>

              <input value={form.address.state} onChange={(event) => updateAddress("state", event.target.value)} maxLength={100} />
            </div>

            <div className="contact-edit-field">
              <label>Country</label>

              <input value={form.address.country} onChange={(event) => updateAddress("country", event.target.value)} maxLength={100} />
            </div>

            <div className="contact-edit-field">
              <label>Postal code</label>

              <input value={form.address.postalCode} onChange={(event) => updateAddress("postalCode", event.target.value)} maxLength={30} />
            </div>

            <div className="contact-edit-section full">
              <div className="contact-edit-section-title">
                <UsersRound size={15} />
                Tags & custom fields
              </div>
            </div>

            <div className="contact-edit-field full">
              <label>Tags</label>
              <SearchableTagsDropdown value={form.tags} onChange={(value) => update("tags", value)} tags={tags} loading={loadingTags} />
              <div className="contact-edit-help">Search and select one or more business tags.</div>
            </div>

            <div className="contact-edit-field full">
              <label>Custom fields</label>

              <textarea rows={5} value={form.customFields} onChange={(event) => update("customFields", event.target.value)} placeholder={'{"customerType":"VIP"}'} />
            </div>

            <div className="contact-edit-section full">
              <div className="contact-edit-section-title">
                <Phone size={15} />
                Description
              </div>
            </div>

            <div className="contact-edit-field full">
              <textarea rows={5} value={form.description} onChange={(event) => update("description", event.target.value)} maxLength={5000} />
            </div>
          </form>
        </div>

        <div className="contact-edit-footer">
          <button type="button" className="contact-edit-btn" onClick={onCancel} disabled={saving}>
            Cancel
          </button>

          <button type="button" className="contact-edit-btn primary" onClick={onSubmit} disabled={saving}>
            {saving ? (
              <>
                <span className="contact-edit-spinner" />
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
      </div>
    </div>
  );
}

export default function ContactDetails() {
  const getTagName = (tag) => {
    if (tag && typeof tag === "object") {
      return tag?.name || tag?.title || tag?.label || tag?.slug || "Unnamed tag";
    }

    const foundTag = tags.find((item) => String(getId(item)) === String(tag));

    return foundTag?.name || foundTag?.title || foundTag?.label || foundTag?.slug || "Unnamed tag";
  };
  const navigate = useNavigate();
  const { id } = useParams();

  const { businessId, loading: businessLoading, error: businessError } = useBusiness();

  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [members, setMembers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [tags, setTags] = useState([]);
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [tagsLoading, setTagsLoading] = useState(false);

  const [editOpen, setEditOpen] = useState(false);

  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    alternatePhone: "",
    jobTitle: "",
    companyId: "",
    source: "manual",
    status: "ACTIVE",
    lifecycleStage: "CONTACT",
    description: "",
    assignedTo: "",
    assignedTeamId: "",
    tags: "",
    customFields: "",
    address: {
      street: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
    },
  });

  const loadContact = useCallback(async () => {
    if (!businessId || !id) return;

    setLoading(true);
    setPageError("");

    try {
      const [response, tagsResponse] = await Promise.all([getContactById(businessId, id), getTags(businessId, { page: 1, limit: 100 })]);

      setTags(getTagRows(tagsResponse));

      const data = response?.data || response || {};
      const result = data?.contact || data;

      setContact(result);
    } catch (error) {
      setPageError(getErrorMessage(error, "Unable to load contact details."));
    } finally {
      setLoading(false);
    }
  }, [businessId, id]);

  useEffect(() => {
    if (businessId && id) {
      loadContact();
    }
  }, [businessId, id, loadContact]);

  const loadEditOptions = useCallback(
    async (existingContact = null) => {
      if (!businessId) return;
      setOptionsLoading(true);
      setTagsLoading(true);
      try {
        const [membersResponse, teamsResponse, tagsResponse] = await Promise.all([getBusinessMembers(businessId, { page: 1, limit: 100 }), getTeams(businessId, { page: 1, limit: 100 }), api.get(`/tags/business/${businessId}`, { params: { page: 1, limit: 100 } })]);

        const unwrap = (response) => response?.data || response || {};
        const extract = (value, keys) => {
          const data = unwrap(value);
          const nested = data?.data || data?.result || data?.payload || {};
          for (const source of [data, nested]) {
            for (const key of keys) if (Array.isArray(source?.[key])) return source[key];
          }
          if (Array.isArray(data)) return data;
          if (Array.isArray(nested)) return nested;
          return [];
        };

        setMembers(extract(membersResponse, ["items", "members", "results"]));
        setTeams(extract(teamsResponse, ["items", "teams", "results"]));
        const fetchedTags = extract(tagsResponse, ["items", "tags", "results"]);
        const existingTags = Array.isArray(existingContact?.tags) ? existingContact.tags.filter((tag) => typeof tag === "object" && getId(tag)) : [];
        const merged = [...fetchedTags];
        existingTags.forEach((tag) => {
          if (!merged.some((item) => String(getId(item)) === String(getId(tag)))) merged.push(tag);
        });
        setTags(merged);
      } catch (error) {
        setMembers([]);
        setTeams([]);
        setTags(Array.isArray(existingContact?.tags) ? existingContact.tags.filter((tag) => typeof tag === "object") : []);
        const message = getErrorMessage(error, "Unable to load assignment users, teams or tags.");
        await showAuthAlert({ icon: "error", title: "Options unavailable", text: message, confirmButtonText: "OK" });
      } finally {
        setOptionsLoading(false);
        setTagsLoading(false);
      }
    },
    [businessId]
  );

  const openEdit = async () => {
    setEditForm(buildEditForm(contact));
    setPageError("");
    setEditOpen(true);
    await loadEditOptions(contact);
  };

  const handleUpdate = async () => {
    if (!businessId || !id) return;

    const firstName = editForm.firstName.trim();

    if (!firstName) {
      await showAuthAlert({
        icon: "error",
        title: "First name required",
        text: "Please enter the contact's first name.",
        confirmButtonText: "OK",
      });

      return;
    }

    if (editForm.companyId.trim() && !/^[a-f\d]{24}$/i.test(editForm.companyId.trim())) {
      await showAuthAlert({
        icon: "error",
        title: "Invalid company ID",
        text: "Please enter a valid 24-character company ID or leave it empty.",
        confirmButtonText: "OK",
      });

      return;
    }

    if (editForm.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email.trim())) {
      await showAuthAlert({
        icon: "error",
        title: "Invalid email",
        text: "Please enter a valid email address.",
        confirmButtonText: "OK",
      });

      return;
    }

    let payload;

    try {
      payload = buildPayload(editForm);
    } catch (error) {
      await showAuthAlert({
        icon: "error",
        title: "Invalid custom fields",
        text: error.message,
        confirmButtonText: "OK",
      });

      return;
    }

    setSaving(true);
    setPageError("");

    try {
      const response = await updateContact(businessId, id, payload);

      const data = response?.data || response || {};
      const updatedContact = data?.contact || data;

      if (updatedContact?._id) {
        setContact(updatedContact);
      } else {
        await loadContact();
      }

      setEditOpen(false);

      await showAuthAlert({
        icon: "success",
        title: "Contact updated",
        text: "Contact details have been updated successfully.",
        confirmButtonText: "Done",
      });
    } catch (error) {
      await showAuthAlert({
        icon: "error",
        title: "Unable to update contact",
        text: getErrorMessage(error, "The contact could not be updated."),
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
      title: "Delete contact?",
      text: `This will permanently remove ${getContactName(contact)}.`,
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (!result?.isConfirmed) return;

    setDeleting(true);
    setPageError("");

    try {
      await deleteContact(businessId, id);

      await showAuthAlert({
        icon: "success",
        title: "Contact deleted",
        text: "The contact has been removed successfully.",
        confirmButtonText: "Done",
      });

      navigate("/contacts");
    } catch (error) {
      await showAuthAlert({
        icon: "error",
        title: "Unable to delete contact",
        text: getErrorMessage(error, "The contact could not be deleted."),
        confirmButtonText: "OK",
      });
    } finally {
      setDeleting(false);
    }
  };

  if (businessLoading) {
    return (
      <div className="contact-details-page">
        <div className="contact-details-loading">Loading business workspace...</div>
      </div>
    );
  }

  if (businessError && !businessId) {
    return (
      <div className="contact-details-page">
        <div className="contact-details-error">{businessError}</div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .contact-details-page{padding:28px 30px 42px;max-width:1400px;margin:0 auto;color:var(--crm-text)}
        .contact-details-top{display:flex;align-items:center;justify-content:space-between;gap:15px;margin-bottom:20px}
        .contact-details-top-left{display:flex;align-items:center;gap:9px}
        .contact-details-back{width:34px;height:34px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-muted);border-radius:9px;display:grid;place-items:center;cursor:pointer}
        .contact-details-back:hover{background:var(--crm-surface-2);color:var(--crm-text);border-color:var(--crm-primary)}
        .contact-details-eyebrow{font-size:13px;color:var(--crm-primary);font-weight:400;text-transform:uppercase;letter-spacing:.11em}
        .contact-details-heading{font-size:25px;font-weight:400;line-height:1.15;margin:4px 0 0;color:var(--crm-text)}
        .contact-details-actions{display:flex;align-items:center;gap:7px}
        .contact-details-btn{height:35px;padding:0 12px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:9px;display:inline-flex;align-items:center;justify-content:center;gap:7px;cursor:pointer;font-size:13px;font-weight:400}
        .contact-details-btn:hover{background:var(--crm-surface-2);border-color:var(--crm-primary)}
        .contact-details-btn.danger{color:var(--crm-danger)}
        .contact-details-btn:disabled{opacity:.5;cursor:not-allowed}
        .contact-details-profile{border:1px solid var(--crm-border);background:var(--crm-surface);border-radius:13px;padding:18px;display:flex;align-items:center;gap:15px;margin-bottom:14px}
        .contact-details-avatar{width:58px;height:58px;border-radius:14px;display:grid;place-items:center;background:color-mix(in srgb,var(--crm-primary) 12%,transparent);color:var(--crm-primary);font-size:17px;font-weight:400;flex-shrink:0}
        .contact-details-name{font-size:20px;font-weight:400;color:var(--crm-text)}
        .contact-details-meta{font-size:13px;color:var(--crm-muted);margin-top:4px}
        .contact-details-badges{display:flex;align-items:center;gap:6px;margin-top:8px;flex-wrap:wrap}
        .contact-details-badge{font-size:13px;font-weight:400;padding:5px 8px;border-radius:999px;background:var(--crm-surface-2);border:1px solid var(--crm-border);color:var(--crm-text)}
        .contact-details-badge.active{color:var(--crm-success);background:color-mix(in srgb,var(--crm-success) 10%,transparent)}
        .contact-details-grid{display:grid;grid-template-columns:1.2fr .8fr;gap:14px}
        .contact-details-card{border:1px solid var(--crm-border);background:var(--crm-surface);border-radius:13px;overflow:hidden}
        .contact-details-card-head{padding:13px 15px;border-bottom:1px solid var(--crm-border);display:flex;align-items:center;gap:7px}
        .contact-details-card-head svg{color:var(--crm-primary)}
        .contact-details-card-title{font-size:13px;font-weight:400;color:var(--crm-text)}
        .contact-details-card-body{padding:15px}
        .contact-details-fields{display:grid;grid-template-columns:1fr 1fr;gap:13px}
        .contact-details-label{font-size:13px;color:var(--crm-muted);font-weight:400;text-transform:uppercase;letter-spacing:.05em}
        .contact-details-value{font-size:13px;color:var(--crm-text);font-weight:400;margin-top:4px;word-break:break-word}
        .contact-details-value a{color:var(--crm-primary);text-decoration:none}
        .contact-details-note{font-size:13px;color:var(--crm-text);line-height:1.65;white-space:pre-wrap}
        .contact-details-empty{font-size:13px;color:var(--crm-muted)}
        .contact-details-loading{padding:30px;text-align:center;color:var(--crm-muted);font-size:13px;border:1px solid var(--crm-border);background:var(--crm-surface);border-radius:12px}
        .contact-details-error{padding:13px 15px;border:1px solid color-mix(in srgb,var(--crm-danger) 30%,var(--crm-border));background:color-mix(in srgb,var(--crm-danger) 7%,var(--crm-surface));color:var(--crm-danger);border-radius:10px;font-size:13px;margin-bottom:14px}
        .contact-details-info-list{display:grid;gap:11px}
        .contact-details-info-row{display:flex;align-items:flex-start;justify-content:space-between;gap:15px}
        .contact-details-info-row .contact-details-label{flex:0 0 100px}
        .contact-details-info-row .contact-details-value{text-align:right;margin-top:0;max-width:70%}
        .contact-details-tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:5px}
        .contact-details-tag{font-size:13px;font-weight:400;padding:5px 8px;border-radius:999px;background:var(--crm-surface-2);border:1px solid var(--crm-border);color:var(--crm-text)}
        .contact-details-custom{display:grid;gap:7px;margin-top:5px}
        .contact-details-custom-row{display:flex;justify-content:space-between;gap:12px;border-bottom:1px solid var(--crm-border);padding-bottom:6px}
        .contact-details-custom-key{font-size:13px;color:var(--crm-muted);font-weight:400}
        .contact-details-custom-value{font-size:13px;color:var(--crm-text);font-weight:400;text-align:right;word-break:break-word}
        .contact-edit-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.48);z-index:1100;display:flex;align-items:center;justify-content:center;padding:20px}
        .contact-edit-modal{width:min(780px,100%);max-height:min(92vh,900px);display:flex;flex-direction:column;background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:14px;box-shadow:0 25px 70px rgba(0,0,0,.25);overflow:hidden}
        .contact-edit-head{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;padding:18px 20px;border-bottom:1px solid var(--crm-border)}
        .contact-edit-eyebrow{font-size:13px;color:var(--crm-primary);font-weight:400;text-transform:uppercase;letter-spacing:.1em;margin-bottom:4px}
        .contact-edit-title{margin:0;font-size:16px;font-weight:400;color:var(--crm-text)}
        .contact-edit-subtitle{margin:4px 0 0;font-size:13px;color:var(--crm-muted)}
        .contact-edit-close{width:32px;height:32px;border:0;background:transparent;color:var(--crm-muted);border-radius:8px;display:grid;place-items:center;cursor:pointer}
        .contact-edit-body{overflow:auto}
        .contact-edit-form{padding:20px;display:grid;grid-template-columns:1fr 1fr;gap:15px}
        .contact-edit-section.full,.contact-edit-field.full{grid-column:1/-1}
        .contact-edit-section-title{display:flex;align-items:center;gap:7px;font-size:13px;font-weight:400;color:var(--crm-text)}
        .contact-edit-section-title svg{color:var(--crm-primary)}
        .contact-edit-field{display:grid;gap:6px}
        .contact-edit-field label{font-size:13px;font-weight:400;color:var(--crm-text)}
        .contact-edit-field label span{color:var(--crm-danger)}
        .contact-edit-field input,.contact-edit-field select,.contact-edit-field textarea{width:100%;box-sizing:border-box;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:9px;padding:10px 11px;outline:0;font-size:13px}
        .contact-edit-field input:focus,.contact-edit-field select:focus,.contact-edit-field textarea:focus{border-color:var(--crm-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--crm-primary) 9%,transparent)}
        .contact-edit-field textarea{resize:vertical;min-height:110px}
        .contact-edit-select{position:relative}
        .contact-edit-select select{appearance:none;padding-right:34px}
        .contact-edit-select svg{position:absolute;right:11px;top:12px;color:var(--crm-muted);pointer-events:none}
        .contact-edit-footer{display:flex;justify-content:flex-end;gap:8px;padding:14px 20px;border-top:1px solid var(--crm-border)}
        .contact-edit-btn{height:36px;padding:0 13px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:9px;display:inline-flex;align-items:center;justify-content:center;gap:7px;cursor:pointer;font-size:13px;font-weight:400}
        .contact-edit-btn:hover{background:var(--crm-surface-2);border-color:var(--crm-primary)}
        .contact-edit-btn.primary{background:var(--crm-primary);border-color:var(--crm-primary);color:#fff}
        .contact-edit-btn:disabled{opacity:.5;cursor:not-allowed}
        .contact-edit-spinner{width:13px;height:13px;border:2px solid currentColor;border-right-color:transparent;border-radius:50%;animation:contact-edit-spin .7s linear infinite}
        @keyframes contact-edit-spin{to{transform:rotate(360deg)}}
        .contact-edit-help{font-size:13px;color:var(--crm-muted);line-height:1.4}
        .contact-edit-dropdown{position:relative;width:100%}
        .contact-edit-dropdown-trigger{width:100%;min-height:39px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:9px;padding:0 10px;display:flex;align-items:center;gap:8px;text-align:left;cursor:pointer;font-size:13px}
        .contact-edit-dropdown-trigger span{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .contact-edit-dropdown-trigger>svg:last-child{margin-left:auto;color:var(--crm-muted)}
        .contact-edit-dropdown-trigger:hover{border-color:var(--crm-primary);background:var(--crm-surface-2)}
        .contact-edit-dropdown-menu{position:absolute;left:0;right:0;top:calc(100% + 5px);z-index:1200;max-height:280px;overflow:auto;background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:10px;box-shadow:0 18px 45px rgba(0,0,0,.22);padding:6px}
        .contact-edit-dropdown-search{position:sticky;top:0;z-index:2;display:flex;align-items:center;gap:7px;padding:7px;border:1px solid var(--crm-border);background:var(--crm-surface-2);border-radius:8px;margin-bottom:5px}
        .contact-edit-dropdown-search>svg{color:var(--crm-muted);flex-shrink:0}
        .contact-edit-dropdown-search input{flex:1!important;width:100%!important;min-width:0!important;border:0!important;background:transparent!important;box-shadow:none!important;padding:4px!important;color:var(--crm-text)}
        .contact-edit-dropdown-search button{width:22px;height:22px;min-width:22px;padding:0;border:0;background:transparent;color:var(--crm-muted);display:grid;place-items:center;cursor:pointer}
        .contact-edit-dropdown-option{width:100%;border:0;background:transparent;color:var(--crm-text);display:flex;align-items:center;gap:9px;padding:9px;border-radius:8px;text-align:left;cursor:pointer}
        .contact-edit-dropdown-option:hover,.contact-edit-dropdown-option.selected{background:color-mix(in srgb,var(--crm-primary) 9%,transparent);color:var(--crm-primary)}
        .contact-edit-dropdown-option>span:last-child{min-width:0;display:grid;gap:2px}
        .contact-edit-dropdown-option strong{font-size:13px;font-weight:400;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .contact-edit-dropdown-option small{font-size:13px;color:var(--crm-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .contact-edit-dropdown-empty{padding:18px 10px;text-align:center;color:var(--crm-muted);font-size:13px}
        .contact-edit-tag-chips{display:flex;flex-wrap:wrap;gap:5px;margin-top:7px}
        .contact-edit-tag-chip{display:inline-flex;align-items:center;gap:5px;padding:5px 7px;border:1px solid var(--crm-border);background:var(--crm-surface-2);color:var(--crm-text);border-radius:999px;font-size:13px;font-weight:400}
        .contact-edit-tag-chip button{width:17px;height:17px;padding:0;border:0;background:transparent;color:var(--crm-muted);display:grid;place-items:center;cursor:pointer;border-radius:50%}
        .contact-edit-tag-chip button:hover{color:var(--crm-text);background:var(--crm-border)}
        .contact-edit-check{width:17px;height:17px;border:1px solid var(--crm-border);border-radius:5px;display:grid;place-items:center;flex:0 0 17px;color:var(--crm-primary)}
        .contact-edit-check.selected{border-color:var(--crm-primary);background:color-mix(in srgb,var(--crm-primary) 10%,transparent)}
        @media(max-width:850px){.contact-details-page{padding:22px 18px 35px}.contact-details-grid{grid-template-columns:1fr}}
        @media(max-width:620px){.contact-details-page{padding:18px 14px 30px}.contact-details-top{align-items:flex-start;flex-direction:column}.contact-details-top-left{width:100%}.contact-details-actions{width:100%}.contact-details-btn{flex:1}.contact-details-fields{grid-template-columns:1fr}.contact-details-heading{font-size:22px}.contact-edit-backdrop{padding:10px}.contact-edit-modal{max-height:94vh}.contact-edit-form{grid-template-columns:1fr}.contact-edit-section.full,.contact-edit-field.full{grid-column:auto}}
      `}</style>

      <div className="contact-details-page">
        <div className="contact-details-top">
          <div className="contact-details-top-left">
            <button type="button" className="contact-details-back" onClick={() => navigate("/contacts")} title="Back to contacts">
              <ArrowLeft size={16} />
            </button>

            <div>
              <h1 className="contact-details-heading">Contact Details</h1>
            </div>
          </div>

          <div className="contact-details-actions">
            <button type="button" className="contact-details-btn" onClick={loadContact} disabled={loading}>
              <RefreshCw size={13} />
              Refresh
            </button>

            <button type="button" className="contact-details-btn" onClick={openEdit} disabled={!contact || saving}>
              <Edit3 size={13} />
              Edit
            </button>

            <button type="button" className="contact-details-btn danger" onClick={handleDelete} disabled={deleting || !contact}>
              {deleting ? <span className="contact-edit-spinner" /> : <Trash2 size={13} />}
              Delete
            </button>
          </div>
        </div>

        {pageError && <div className="contact-details-error">{pageError}</div>}

        {loading ? (
          <div className="contact-details-loading">Loading contact details...</div>
        ) : !contact ? (
          <div className="contact-details-loading">Contact not found.</div>
        ) : (
          <>
            <div className="contact-details-profile">
              <div className="contact-details-avatar">{getInitials(contact)}</div>

              <div>
                <div className="contact-details-name">{getContactName(contact)}</div>

                <div className="contact-details-meta">{contact?.jobTitle || "Contact profile"}</div>

                <div className="contact-details-badges">
                  <span className={`contact-details-badge ${contact?.status === "ACTIVE" ? "active" : ""}`}>{contact?.status === "ACTIVE" ? "Active" : "Inactive"}</span>

                  <span className="contact-details-badge">{contact?.lifecycleStage?.replaceAll("_", " ") || "Contact"}</span>

                  {contact?.source && <span className="contact-details-badge">{contact.source}</span>}
                </div>
              </div>
            </div>

            <div className="contact-details-grid">
              <div className="contact-details-card">
                <div className="contact-details-card-head">
                  <UserRound size={14} />
                  <div className="contact-details-card-title">Contact information</div>
                </div>

                <div className="contact-details-card-body">
                  <div className="contact-details-fields">
                    <div>
                      <div className="contact-details-label">Email</div>

                      <div className="contact-details-value">{contact?.email ? <a href={`mailto:${contact.email}`}>{contact.email}</a> : "—"}</div>
                    </div>

                    <div>
                      <div className="contact-details-label">Phone</div>

                      <div className="contact-details-value">{contact?.phone ? <a href={`tel:${contact.phone}`}>{contact.phone}</a> : "—"}</div>
                    </div>

                    <div>
                      <div className="contact-details-label">Alternate phone</div>

                      <div className="contact-details-value">{contact?.alternatePhone || "—"}</div>
                    </div>

                    <div>
                      <div className="contact-details-label">Job title</div>

                      <div className="contact-details-value">{contact?.jobTitle || "—"}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="contact-details-card">
                <div className="contact-details-card-head">
                  <BriefcaseBusiness size={14} />
                  <div className="contact-details-card-title">CRM information</div>
                </div>

                <div className="contact-details-card-body">
                  <div className="contact-details-info-list">
                    <div className="contact-details-info-row">
                      <div className="contact-details-label">Company</div>

                      <div className="contact-details-value">{contact?.companyId?.name || contact?.company?.name || (typeof contact?.companyId === "string" ? contact.companyId : "—")}</div>
                    </div>

                    <div className="contact-details-info-row">
                      <div className="contact-details-label">Source</div>

                      <div className="contact-details-value">{contact?.source || "—"}</div>
                    </div>

                    <div className="contact-details-info-row">
                      <div className="contact-details-label">User</div>

                      <div className="contact-details-value">{getMemberName(contact?.assignedTo) !== "Unnamed user" ? getMemberName(contact?.assignedTo) : "Unassigned"}</div>
                    </div>

                    <div className="contact-details-info-row">
                      <div className="contact-details-label">Team</div>

                      <div className="contact-details-value">{contact?.assignedTeamId ? getTeamName(contact.assignedTeamId) : "Unassigned"}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="contact-details-card">
                <div className="contact-details-card-head">
                  <MapPin size={14} />
                  <div className="contact-details-card-title">Address</div>
                </div>

                <div className="contact-details-card-body">
                  {contact?.address && Object.values(contact.address).some(Boolean) ? (
                    <div className="contact-details-fields">
                      <div>
                        <div className="contact-details-label">Street</div>
                        <div className="contact-details-value">{contact.address.street || "—"}</div>
                      </div>

                      <div>
                        <div className="contact-details-label">City</div>
                        <div className="contact-details-value">{contact.address.city || "—"}</div>
                      </div>

                      <div>
                        <div className="contact-details-label">State</div>
                        <div className="contact-details-value">{contact.address.state || "—"}</div>
                      </div>

                      <div>
                        <div className="contact-details-label">Country</div>
                        <div className="contact-details-value">{contact.address.country || "—"}</div>
                      </div>

                      <div>
                        <div className="contact-details-label">Postal code</div>
                        <div className="contact-details-value">{contact.address.postalCode || "—"}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="contact-details-empty">No address has been added.</div>
                  )}
                </div>
              </div>

              <div className="contact-details-card">
                <div className="contact-details-card-head">
                  <CalendarDays size={14} />
                  <div className="contact-details-card-title">Record information</div>
                </div>

                <div className="contact-details-card-body">
                  <div className="contact-details-info-list">
                    <div className="contact-details-info-row">
                      <div className="contact-details-label">Created</div>

                      <div className="contact-details-value">{formatDateTime(contact?.createdAt)}</div>
                    </div>

                    <div className="contact-details-info-row">
                      <div className="contact-details-label">Updated</div>

                      <div className="contact-details-value">{formatDateTime(contact?.updatedAt)}</div>
                    </div>

                    <div className="contact-details-info-row">
                      <div className="contact-details-label">Last contacted</div>

                      <div className="contact-details-value">{formatDateTime(contact?.lastContactedAt)}</div>
                    </div>

                    <div className="contact-details-info-row">
                      <div className="contact-details-label">Created by</div>

                      <div className="contact-details-value">{getMemberName(contact?.createdBy) !== "Unnamed user" ? getMemberName(contact?.createdBy) : "—"}</div>
                    </div>

                    <div className="contact-details-info-row">
                      <div className="contact-details-label">Updated by</div>

                      <div className="contact-details-value">{getMemberName(contact?.updatedBy) !== "Unnamed user" ? getMemberName(contact?.updatedBy) : "—"}</div>
                    </div>

                    <div className="contact-details-info-row">
                      <div className="contact-details-label">Source lead</div>

                      <div className="contact-details-value">{contact?.sourceLeadId?.name || [contact?.sourceLeadId?.firstName, contact?.sourceLeadId?.lastName].filter(Boolean).join(" ") || contact?.sourceLeadId?.email || contact?.sourceLeadId?._id || contact?.sourceLeadId || "—"}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="contact-details-card">
                <div className="contact-details-card-head">
                  <UsersRound size={14} />
                  <div className="contact-details-card-title">Description</div>
                </div>

                <div className="contact-details-card-body">{contact?.description ? <div className="contact-details-note">{contact.description}</div> : <div className="contact-details-empty">No description has been added.</div>}</div>
              </div>

              <div className="contact-details-card">
                <div className="contact-details-card-head">
                  <Phone size={14} />
                  <div className="contact-details-card-title">Tags & custom fields</div>
                </div>

                <div className="contact-details-card-body">
                  <div>
                    <div className="contact-details-label">Tags</div>

                    {Array.isArray(contact?.tags) && contact.tags.length ? (
                      <div className="contact-details-tags">
                        {contact.tags.map((tag, index) => (
                          <span className="contact-details-tag" key={tag?._id || tag?.id || tag?.name || index}>
                            {getTagName(tag)}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="contact-details-value">No tags</div>
                    )}
                  </div>

                  <div style={{ marginTop: 16 }}>
                    <div className="contact-details-label">Custom fields</div>

                    {contact?.customFields && Object.keys(contact.customFields).length ? (
                      <div className="contact-details-custom">
                        {Object.entries(contact.customFields).map(([key, value]) => (
                          <div className="contact-details-custom-row" key={key}>
                            <span className="contact-details-custom-key">{key}</span>

                            <span className="contact-details-custom-value">{typeof value === "object" ? JSON.stringify(value) : String(value)}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="contact-details-value">No custom fields</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <ActivityTimeline businessId={businessId} contactId={contact?._id} title="Activity timeline" subtitle="Complete activity history for this contact." />
          </>
        )}
      </div>

      {editOpen && contact && <EditContactModal form={editForm} setForm={setEditForm} saving={saving} members={members} teams={teams} tags={tags} loadingOptions={optionsLoading} loadingTags={tagsLoading} onCancel={() => setEditOpen(false)} onSubmit={handleUpdate} />}
    </>
  );
}
