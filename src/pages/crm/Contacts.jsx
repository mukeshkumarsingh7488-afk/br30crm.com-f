import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BriefcaseBusiness, Check, ChevronDown, Eye, Mail, MapPin, Pencil, Phone, Plus, RefreshCw, Search, Trash2, UserRound, UsersRound, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getTags, getTagRows } from "../../api/tag.api";
import { assignContact, createContact, deleteContact, getContacts, updateContact } from "../../api/contact.api";
import { getAssignmentMembers } from "../../api/crm.api";
import { getTeams } from "../../api/operations.api";

import { showAuthAlert } from "../../components/auth/authAlert";
import useBusiness from "../../hooks/useBusiness";
import AssigneeDetailsPopup from "../../components/crm/AssigneeDetailsPopup";
import { isManagementRole } from "../../utils/permissions";

const EMPTY_FORM = {
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
  tags: [],
  customFields: "",
  address: {
    street: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
  },
};

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
];

const LIFECYCLE_OPTIONS = [
  { value: "", label: "All lifecycle stages" },
  { value: "CONTACT", label: "Contact" },
  { value: "CUSTOMER", label: "Customer" },
  { value: "REPEAT_CUSTOMER", label: "Repeat customer" },
  { value: "OTHER", label: "Other" },
];

const CREATE_LIFECYCLE_OPTIONS = LIFECYCLE_OPTIONS.filter((option) => option.value);

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

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const normaliseTags = (tags) => {
  if (!Array.isArray(tags)) return [];

  return tags
    .map((tag) => {
      if (typeof tag === "string") return tag;
      return tag?._id || tag?.id || "";
    })
    .filter(Boolean);
};

const normaliseCustomFields = (value) => {
  if (value === undefined || value === null || value === "") return "";
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return "";
  }
};

const getAssignedUserName = (contact) => {
  const user = contact?.assignedTo && typeof contact.assignedTo === "object" ? contact.assignedTo : null;
  if (!user) return "Unassigned";
  return [user.firstName, user.lastName].filter(Boolean).join(" ").trim() || user.name || user.fullName || user.email || "Unassigned";
};

const getAssignedUserEmail = (contact) => {
  const user = contact?.assignedTo && typeof contact.assignedTo === "object" ? contact.assignedTo : null;
  return user?.email || "";
};

const getAssignedTeamName = (contact) => {
  const team = contact?.assignedTeamId && typeof contact.assignedTeamId === "object" ? contact.assignedTeamId : null;
  return team?.name || team?.title || team?.teamName || team?.slug || "Unassigned";
};

const getTagDisplayName = (tag, tags = []) => {
  if (tag && typeof tag === "object") return tag.name || tag.title || tag.label || tag.slug || "Unnamed tag";
  const match = tags.find((item) => String(item?._id || item?.id || "") === String(tag || ""));
  return match?.name || match?.title || match?.label || match?.slug || "Tag";
};

const parseCustomFields = (value) => {
  if (value === undefined || value === null || String(value).trim() === "") return {};

  if (typeof value === "object" && !Array.isArray(value)) return value;

  const raw = String(value).trim();

  try {
    const parsed = JSON.parse(raw);

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("Custom fields must be a JSON object.");
    }

    return parsed;
  } catch (error) {
    const lines = raw
      .split(/\r?\n|,/)
      .map((line) => line.trim())
      .filter(Boolean);
    const objectFromPairs = {};
    let hasPair = false;

    lines.forEach((line) => {
      const separatorIndex = line.indexOf(":") >= 0 ? line.indexOf(":") : line.indexOf("=");
      if (separatorIndex <= 0) return;

      const key = line.slice(0, separatorIndex).trim();
      const itemValue = line.slice(separatorIndex + 1).trim();
      if (!key || !itemValue) return;

      objectFromPairs[key] = itemValue;
      hasPair = true;
    });

    if (hasPair) return objectFromPairs;
    return { value: raw };
  }
};

const cleanPayload = (form) => {
  const payload = {};

  Object.entries(form).forEach(([key, value]) => {
    if (key === "address") return;

    if (typeof value === "string") {
      const trimmed = value.trim();

      if (trimmed !== "") payload[key] = trimmed;
    } else if (value !== undefined) {
      payload[key] = value;
    }
  });

  const address = {};

  Object.entries(form.address || {}).forEach(([key, value]) => {
    const trimmed = String(value || "").trim();

    if (trimmed) address[key] = trimmed;
  });

  if (Object.keys(address).length) {
    payload.address = address;
  }

  payload.tags = Array.isArray(form.tags) ? form.tags.filter(Boolean) : [];
  payload.customFields = parseCustomFields(form.customFields);

  if (!payload.companyId) delete payload.companyId;
  if (!payload.source) delete payload.source;
  if (!payload.assignedTo) delete payload.assignedTo;
  if (!payload.assignedTeamId) delete payload.assignedTeamId;

  return payload;
};

const validateContactForm = (form, mode = "create") => {
  const firstName = String(form.firstName || "").trim();
  const lastName = String(form.lastName || "").trim();
  const email = String(form.email || "").trim();
  const phone = String(form.phone || "").trim();
  const alternatePhone = String(form.alternatePhone || "").trim();
  const jobTitle = String(form.jobTitle || "").trim();
  const companyId = String(form.companyId || "").trim();
  const source = String(form.source || "").trim();
  const description = String(form.description || "").trim();

  if (mode === "create" && !firstName) {
    return {
      title: "First name required",
      text: "Please enter the contact's first name.",
    };
  }

  if (mode === "edit" && !firstName) {
    return {
      title: "First name required",
      text: "First name cannot be empty.",
    };
  }

  if (firstName.length > 100) {
    return {
      title: "Invalid first name",
      text: "First name cannot exceed 100 characters.",
    };
  }

  if (lastName.length > 100) {
    return {
      title: "Invalid last name",
      text: "Last name cannot exceed 100 characters.",
    };
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return {
      title: "Invalid email",
      text: "Please enter a valid email address.",
    };
  }

  if (email.length > 200) {
    return {
      title: "Invalid email",
      text: "Email cannot exceed 200 characters.",
    };
  }

  if (phone.length > 50) {
    return {
      title: "Invalid phone",
      text: "Phone cannot exceed 50 characters.",
    };
  }

  if (alternatePhone.length > 50) {
    return {
      title: "Invalid alternate phone",
      text: "Alternate phone cannot exceed 50 characters.",
    };
  }

  if (jobTitle.length > 150) {
    return {
      title: "Invalid job title",
      text: "Job title cannot exceed 150 characters.",
    };
  }

  if (companyId && !/^[a-f\d]{24}$/i.test(companyId)) {
    return {
      title: "Invalid company ID",
      text: "Please enter a valid 24-character company ID or leave it empty.",
    };
  }

  if (source && (source.length < 2 || source.length > 100)) {
    return {
      title: "Invalid source",
      text: "Source must be between 2 and 100 characters.",
    };
  }

  if (Array.isArray(form.tags)) {
    const invalidTag = form.tags.find((tagId) => !/^[a-f\d]{24}$/i.test(String(tagId || "")));
    if (invalidTag) {
      return {
        title: "Invalid tag",
        text: "Please select tags from the Tags dropdown instead of entering tag text manually.",
      };
    }
  }

  if (description.length > 5000) {
    return {
      title: "Description too long",
      text: "Description cannot exceed 5000 characters.",
    };
  }

  try {
    parseCustomFields(form.customFields);
  } catch (error) {
    return {
      title: "Invalid custom fields",
      text: error.message,
    };
  }

  return null;
};

function AssignmentDropdown({ type, value, onChange, members, teams, loadingOptions }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
        setQuery("");
      }
    };

    if (open) document.addEventListener("mousedown", handleOutsideClick);

    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [open]);

  const isUser = type === "user";
  const options = isUser ? members : teams;

  const getId = (item) => (isUser ? item?.userId?._id || item?.userId?.id || item?.userId || item?._userId || "" : item?._id || item?.id || "");
  const getName = (item) => {
    if (!isUser) return item?.name || item?.title || item?.teamName || "Unnamed team";
    const user = item?.userId && typeof item.userId === "object" ? item.userId : item;
    return [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() || user?.name || user?.fullName || user?.email || "Unnamed user";
  };
  const getSecondary = (item) => {
    if (!isUser) return item?.slug || "";
    const user = item?.userId && typeof item.userId === "object" ? item.userId : item;
    return user?.email || item?.email || "";
  };

  const selected = options.find((item) => String(getId(item)) === String(value || ""));
  const filtered = options.filter((item) => `${getName(item)} ${getSecondary(item)}`.toLowerCase().includes(query.trim().toLowerCase()));
  const label = isUser ? "Select user" : "Select team";
  const placeholder = isUser ? "Search user..." : "Search team...";

  const choose = (nextValue) => {
    onChange(nextValue);
    setOpen(false);
    setQuery("");
  };

  return (
    <div ref={dropdownRef} className="contacts-assignment-select">
      <button
        type="button"
        className="contacts-assignment-trigger"
        onClick={() => {
          setOpen((current) => !current);
          setQuery("");
        }}
        disabled={loadingOptions}>
        {isUser ? <UserRound size={14} /> : <UsersRound size={14} />}
        <span>{selected ? getName(selected) : label}</span>
        <ChevronDown size={14} />
      </button>

      {open && (
        <div className="contacts-assignment-menu">
          <div className="contacts-assignment-search">
            <Search size={13} />
            <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder={placeholder} />
            {query && (
              <button type="button" onClick={() => setQuery("")} title="Clear search">
                <X size={13} />
              </button>
            )}
          </div>

          <button type="button" className={`contacts-assignment-option ${!value ? "selected" : ""}`} onClick={() => choose("")}>
            {isUser ? <UserRound size={14} /> : <UsersRound size={14} />}
            <span>
              <strong>Unassigned</strong>
              <small>{isUser ? "Remove user assignment" : "Remove team assignment"}</small>
            </span>
          </button>

          {filtered.map((item) => {
            const id = getId(item);
            if (!id) return null;
            return (
              <button type="button" key={id} className={`contacts-assignment-option ${String(value || "") === String(id) ? "selected" : ""}`} onClick={() => choose(id)}>
                {isUser ? <UserRound size={14} /> : <UsersRound size={14} />}
                <span>
                  <strong>{getName(item)}</strong>
                  {getSecondary(item) && <small>{getSecondary(item)}</small>}
                </span>
              </button>
            );
          })}

          {!loadingOptions && filtered.length === 0 && <div className="contacts-assignment-empty">{isUser ? "No users found." : "No teams found."}</div>}
        </div>
      )}
    </div>
  );
}

function TagDropdown({ value, onChange, tags, loadingTags }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
        setQuery("");
      }
    };

    if (open) document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [open]);

  const selectedIds = Array.isArray(value) ? value : [];
  const getId = (tag) => tag?._id || tag?.id || "";
  const getName = (tag) => tag?.name || tag?.title || tag?.label || tag?.slug || "Unnamed tag";
  const filtered = tags.filter((tag) => `${getName(tag)} ${tag?.slug || ""}`.toLowerCase().includes(query.trim().toLowerCase()));

  const toggleTag = (id) => {
    if (!id) return;
    const next = selectedIds.some((item) => String(item) === String(id)) ? selectedIds.filter((item) => String(item) !== String(id)) : [...selectedIds, id];
    onChange(next);
  };

  const removeTag = (id) => onChange(selectedIds.filter((item) => String(item) !== String(id)));
  const selectedTags = selectedIds.map((id) => tags.find((tag) => String(getId(tag)) === String(id))).filter(Boolean);

  return (
    <div ref={dropdownRef} className="contacts-tags-select">
      <button
        type="button"
        className="contacts-tags-trigger"
        onClick={() => {
          setOpen((current) => !current);
          setQuery("");
        }}
        disabled={loadingTags}>
        <span>{selectedTags.length ? `${selectedTags.length} tag${selectedTags.length > 1 ? "s" : ""} selected` : "Select tags"}</span>
        <ChevronDown size={14} />
      </button>

      {selectedTags.length > 0 && (
        <div className="contacts-tag-chips">
          {selectedTags.map((tag) => {
            const id = getId(tag);
            return (
              <span className="contacts-tag-chip" key={id}>
                {getName(tag)}
                <button type="button" onClick={() => removeTag(id)} title="Remove tag">
                  <X size={11} />
                </button>
              </span>
            );
          })}
        </div>
      )}

      {open && (
        <div className="contacts-tags-menu">
          <div className="contacts-assignment-search">
            <Search size={13} />
            <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tags..." />
            {query && (
              <button type="button" onClick={() => setQuery("")} title="Clear search">
                <X size={13} />
              </button>
            )}
          </div>

          {filtered.map((tag) => {
            const id = getId(tag);
            if (!id) return null;
            const selected = selectedIds.some((item) => String(item) === String(id));
            return (
              <button type="button" key={id} className={`contacts-tag-option ${selected ? "selected" : ""}`} onClick={() => toggleTag(id)}>
                <span className={`contacts-tag-check ${selected ? "selected" : ""}`}>{selected ? <Check size={11} /> : null}</span>
                <span>{getName(tag)}</span>
              </button>
            );
          })}

          {!loadingTags && filtered.length === 0 && <div className="contacts-assignment-empty">{query ? "No tags found." : "No tags available."}</div>}
        </div>
      )}
    </div>
  );
}

function ContactFormModal({ mode, form, setForm, saving, members, teams, loadingOptions, tags, loadingTags, onCancel, onSubmit }) {
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

    if (event.shiftKey || event.ctrlKey || event.metaKey || event.target.tagName === "TEXTAREA" || event.target.tagName === "SELECT" || event.target.type === "button") {
      return;
    }

    event.preventDefault();

    const formElement = event.currentTarget;

    const focusable = Array.from(formElement.querySelectorAll("input:not([disabled]), select:not([disabled]), textarea:not([disabled])")).filter((element) => element.offsetParent !== null);

    const currentIndex = focusable.indexOf(event.target);

    if (currentIndex >= 0 && currentIndex < focusable.length - 1) {
      focusable[currentIndex + 1].focus();
    } else {
      onSubmit();
    }
  };

  return (
    <div className="contacts-modal-backdrop">
      <div className="contacts-modal">
        <div className="contacts-modal-head">
          <div>
            <div className="contacts-modal-eyebrow">{mode === "create" ? "New contact" : "Edit contact"}</div>

            <h2 className="contacts-modal-title">{mode === "create" ? "Create a contact" : "Update contact"}</h2>

            <p className="contacts-modal-subtitle">Enter contact information and CRM details.</p>
          </div>

          <button type="button" className="contacts-modal-close" onClick={onCancel} disabled={saving}>
            <X size={17} />
          </button>
        </div>

        <div className="contacts-modal-body">
          <form className="contacts-form" onKeyDown={handleKeyDown}>
            <div className="contacts-form-section full">
              <div className="contacts-form-section-title">
                <UserRound size={15} />
                Basic information
              </div>

              <div className="contacts-form-section-subtitle">Primary contact and communication details.</div>
            </div>

            <div className="contacts-field">
              <label>
                First name <span>*</span>
              </label>

              <input autoFocus value={form.firstName} onChange={(event) => update("firstName", event.target.value)} placeholder="First name" maxLength={100} />
            </div>

            <div className="contacts-field">
              <label>Last name</label>

              <input value={form.lastName} onChange={(event) => update("lastName", event.target.value)} placeholder="Last name" maxLength={100} />
            </div>

            <div className="contacts-field">
              <label>Email</label>

              <div className="contacts-input-icon-wrap">
                <Mail size={14} />

                <input type="email" value={form.email} onChange={(event) => update("email", event.target.value)} placeholder="name@example.com" maxLength={200} />
              </div>
            </div>

            <div className="contacts-field">
              <label>Phone</label>

              <div className="contacts-input-icon-wrap">
                <Phone size={14} />

                <input value={form.phone} onChange={(event) => update("phone", event.target.value)} placeholder="Primary phone" maxLength={50} />
              </div>
            </div>

            <div className="contacts-field">
              <label>Alternate phone</label>

              <input value={form.alternatePhone} onChange={(event) => update("alternatePhone", event.target.value)} placeholder="Alternate phone" maxLength={50} />
            </div>

            <div className="contacts-field">
              <label>Job title</label>

              <input value={form.jobTitle} onChange={(event) => update("jobTitle", event.target.value)} placeholder="e.g. Sales Manager" maxLength={150} />
            </div>

            <div className="contacts-form-section full contacts-form-section-spaced">
              <div className="contacts-form-section-title">
                <BriefcaseBusiness size={15} />
                CRM information
              </div>

              <div className="contacts-form-section-subtitle">Company, lifecycle, source and ownership.</div>
            </div>

            <div className="contacts-field">
              <label>Company ID</label>

              <input value={form.companyId} onChange={(event) => update("companyId", event.target.value)} placeholder="24-character company ID" />

              <div className="contacts-field-help">Enter a valid company MongoDB ID or leave empty.</div>
            </div>

            <div className="contacts-field">
              <label>Source</label>

              <input value={form.source} onChange={(event) => update("source", event.target.value)} placeholder="manual" maxLength={100} />
            </div>

            <div className="contacts-field">
              <label>Status</label>

              <div className="contacts-select-wrap">
                <select value={form.status} onChange={(event) => update("status", event.target.value)}>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>

                <ChevronDown size={14} />
              </div>
            </div>

            <div className="contacts-field">
              <label>Lifecycle stage</label>

              <div className="contacts-select-wrap">
                <select value={form.lifecycleStage} onChange={(event) => update("lifecycleStage", event.target.value)}>
                  {CREATE_LIFECYCLE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <ChevronDown size={14} />
              </div>
            </div>

            <div className="contacts-form-section full contacts-form-section-spaced">
              <div className="contacts-form-section-title">
                <UsersRound size={15} />
                Ownership
              </div>

              <div className="contacts-form-section-subtitle">Optional user/team assignment. Backend currently accepts IDs.</div>
            </div>

            <div className="contacts-field">
              <label>Assigned user</label>
              <AssignmentDropdown type="user" value={form.assignedTo} onChange={(value) => update("assignedTo", value)} members={members} teams={teams} loadingOptions={loadingOptions} />
              <div className="contacts-field-help">Search and select a business member by name or email.</div>
            </div>

            <div className="contacts-field">
              <label>Assigned team</label>
              <AssignmentDropdown type="team" value={form.assignedTeamId} onChange={(value) => update("assignedTeamId", value)} members={members} teams={teams} loadingOptions={loadingOptions} />
              <div className="contacts-field-help">Search and select a team by name.</div>
            </div>

            <div className="contacts-form-section full contacts-form-section-spaced">
              <div className="contacts-form-section-title">
                <MapPin size={15} />
                Address
              </div>

              <div className="contacts-form-section-subtitle">Store the contact's complete address.</div>
            </div>

            <div className="contacts-field full">
              <label>Street</label>

              <input value={form.address.street} onChange={(event) => updateAddress("street", event.target.value)} placeholder="Street address" maxLength={250} />
            </div>

            <div className="contacts-field">
              <label>City</label>

              <input value={form.address.city} onChange={(event) => updateAddress("city", event.target.value)} placeholder="City" maxLength={100} />
            </div>

            <div className="contacts-field">
              <label>State</label>

              <input value={form.address.state} onChange={(event) => updateAddress("state", event.target.value)} placeholder="State" maxLength={100} />
            </div>

            <div className="contacts-field">
              <label>Country</label>

              <input value={form.address.country} onChange={(event) => updateAddress("country", event.target.value)} placeholder="Country" maxLength={100} />
            </div>

            <div className="contacts-field">
              <label>Postal code</label>

              <input value={form.address.postalCode} onChange={(event) => updateAddress("postalCode", event.target.value)} placeholder="Postal code" maxLength={30} />
            </div>

            <div className="contacts-form-section full contacts-form-section-spaced">
              <div className="contacts-form-section-title">
                <UsersRound size={15} />
                Tags & custom fields
              </div>

              <div className="contacts-form-section-subtitle">Tags are comma-separated. Custom fields accept JSON, key:value pairs, or a simple value.</div>
            </div>

            <div className="contacts-field full">
              <label>Tags</label>
              <TagDropdown value={form.tags} onChange={(value) => update("tags", value)} tags={tags} loadingTags={loadingTags} />
              <div className="contacts-field-help">Search and select one or more business tags.</div>
            </div>

            <div className="contacts-field full">
              <label>Custom fields</label>

              <textarea rows={5} value={form.customFields} onChange={(event) => update("customFields", event.target.value)} placeholder="e.g. Customer type: VIP, Source campaign: Summer, Preferred contact: Email" />
            </div>

            <div className="contacts-form-section full contacts-form-section-spaced">
              <div className="contacts-form-section-title">
                <MapPin size={15} />
                Notes
              </div>
            </div>

            <div className="contacts-field full">
              <label>Description</label>

              <textarea rows={5} value={form.description} onChange={(event) => update("description", event.target.value)} placeholder="Add notes, requirements, conversation context..." maxLength={5000} />
            </div>
          </form>
        </div>

        <div className="contacts-modal-footer">
          <button type="button" className="contacts-btn" onClick={onCancel} disabled={saving}>
            Cancel
          </button>

          <button type="button" className="contacts-btn primary" onClick={onSubmit} disabled={saving}>
            {saving ? (
              <>
                <span className="contacts-spinner small" />
                Saving...
              </>
            ) : (
              <>
                <Check size={15} />
                {mode === "create" ? "Create contact" : "Save changes"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function AssignModal({ contact, form, setForm, saving, members, teams, loadingOptions, onCancel, onSubmit }) {
  const update = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  return (
    <div className="contacts-modal-backdrop">
      <div className="contacts-modal contacts-assign-modal">
        <div className="contacts-modal-head">
          <div className="contacts-modal-title-wrap">
            <div className="contacts-modal-eyebrow">Contact assignment</div>
            <h2 className="contacts-modal-title">Assign contact</h2>
            <p className="contacts-modal-subtitle">{getContactName(contact)}</p>
          </div>
          <button type="button" className="contacts-modal-close" onClick={onCancel} disabled={saving}>
            <X size={17} />
          </button>
        </div>

        <div className="contacts-modal-body">
          <div className="contacts-form">
            <div className="contacts-field full">
              <label>Assigned user</label>
              <AssignmentDropdown type="user" value={form.assignedTo} onChange={(value) => update("assignedTo", value)} members={members} teams={teams} loadingOptions={loadingOptions || saving} />
              <div className="contacts-field-help">Search by user name or email.</div>
            </div>

            <div className="contacts-field full">
              <label>Assigned team</label>
              <AssignmentDropdown type="team" value={form.assignedTeamId} onChange={(value) => update("assignedTeamId", value)} members={members} teams={teams} loadingOptions={loadingOptions || saving} />
              <div className="contacts-field-help">Search by team name.</div>
            </div>
          </div>
        </div>

        <div className="contacts-modal-footer">
          <button type="button" className="contacts-btn" onClick={onCancel} disabled={saving}>
            Cancel
          </button>
          <button type="button" className="contacts-btn primary" onClick={onSubmit} disabled={saving || loadingOptions}>
            {saving ? (
              <>
                <span className="contacts-spinner small" /> Updating...
              </>
            ) : (
              <>
                <Check size={15} /> Update assignment
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Contacts() {
  const navigate = useNavigate();

  const { businessId, loading: businessLoading, error: businessError, role, isBusinessOwner } = useBusiness();
  const canManage = isManagementRole({ role, isBusinessOwner });
  const [assigneeDetail, setAssigneeDetail] = useState(null);

  const [contacts, setContacts] = useState([]);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [lifecycleStage, setLifecycleStage] = useState("");
  const [source, setSource] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [members, setMembers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [tags, setTags] = useState([]);
  const [assignmentOptionsLoading, setAssignmentOptionsLoading] = useState(false);
  const [tagsLoading, setTagsLoading] = useState(false);
  const [pageError, setPageError] = useState("");

  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });

  const [assignForm, setAssignForm] = useState({
    assignedTo: "",
    assignedTeamId: "",
  });

  const [mobileFilters, setMobileFilters] = useState(false);

  const loadContacts = useCallback(
    async (nextPage = 1, overrides = {}) => {
      if (!businessId) return;

      setLoading(true);

      const nextSearch = overrides.search !== undefined ? overrides.search : search;

      const nextStatus = overrides.status !== undefined ? overrides.status : status;

      const nextLifecycleStage = overrides.lifecycleStage !== undefined ? overrides.lifecycleStage : lifecycleStage;

      const nextSource = overrides.source !== undefined ? overrides.source : source;

      try {
        const response = await getContacts(businessId, {
          page: nextPage,
          limit: pagination.limit,
          ...(nextSearch.trim() ? { search: nextSearch.trim() } : {}),
          ...(nextStatus ? { status: nextStatus } : {}),
          ...(nextLifecycleStage ? { lifecycleStage: nextLifecycleStage } : {}),
          ...(nextSource.trim() ? { source: nextSource.trim() } : {}),
        });

        const data = response?.data || response || {};
        const rows = data?.items || data?.contacts || [];

        setContacts(Array.isArray(rows) ? rows : []);

        setPagination(
          data?.pagination || {
            page: nextPage,
            limit: pagination.limit,
            total: rows.length,
            totalPages: 1,
          }
        );
      } catch (error) {
        await showErrorAlert("Unable to load contacts", getErrorMessage(error, "Something went wrong while loading contacts."));
      } finally {
        setLoading(false);
      }
    },
    [businessId, lifecycleStage, pagination.limit, search, source, status]
  );

  useEffect(() => {
    if (businessId) loadContacts(1);
  }, [businessId]);

  useEffect(() => {
    if (businessError && !businessId && !businessLoading) {
      showErrorAlert("Business unavailable", businessError || "Unable to load your business workspace.");
    }
  }, [businessError, businessId, businessLoading]);

  const stats = useMemo(() => {
    const total = Number(pagination.total || 0);

    const activeCount = contacts.filter((contact) => contact.status === "ACTIVE").length;

    const customerCount = contacts.filter((contact) => contact.lifecycleStage === "CUSTOMER").length;

    const repeatCustomerCount = contacts.filter((contact) => contact.lifecycleStage === "REPEAT_CUSTOMER").length;

    return [
      {
        title: "Total contacts",
        value: total.toLocaleString("en-IN"),
        detail: "All matching contacts",
        icon: UsersRound,
        tone: "primary",
      },
      {
        title: "Active",
        value: activeCount.toLocaleString("en-IN"),
        detail: "On current page",
        icon: UserRound,
        tone: "success",
      },
      {
        title: "Customers",
        value: customerCount.toLocaleString("en-IN"),
        detail: "On current page",
        icon: BriefcaseBusiness,
        tone: "warning",
      },
      {
        title: "Repeat customers",
        value: repeatCustomerCount.toLocaleString("en-IN"),
        detail: "On current page",
        icon: Check,
        tone: "info",
      },
    ];
  }, [contacts, pagination.total]);

  const loadAssignmentOptions = useCallback(async () => {
    if (!businessId) return;

    setAssignmentOptionsLoading(true);
    setPageError("");

    try {
      const [membersResponse, teamsResponse] = await Promise.all([getAssignmentMembers(businessId, { page: 1, limit: 100 }), getTeams(businessId, { page: 1, limit: 100 })]);

      const memberData = membersResponse?.data || membersResponse || {};
      const teamData = teamsResponse?.data || teamsResponse || {};

      const memberRows = memberData?.items || memberData?.members || memberData?.results || (Array.isArray(memberData) ? memberData : []);
      const teamRows = teamData?.items || teamData?.teams || teamData?.results || (Array.isArray(teamData) ? teamData : []);

      setMembers(Array.isArray(memberRows) ? memberRows : []);
      setTeams(Array.isArray(teamRows) ? teamRows : []);
    } catch (error) {
      setMembers([]);
      setTeams([]);
      const message = getErrorMessage(error, "Unable to load users and teams for assignment.");
      setPageError(message);
      await showErrorAlert("Assignment options unavailable", message);
    } finally {
      setAssignmentOptionsLoading(false);
    }
  }, [businessId]);

  const loadTags = useCallback(async () => {
    if (!businessId) return;

    setTagsLoading(true);

    try {
      const response = await getTags(businessId, {
        page: 1,
        limit: 100,
      });

      setTags(getTagRows(response));
    } catch (error) {
      setTags([]);
      await showErrorAlert("Tags unavailable", getErrorMessage(error, "Unable to load tags."));
    } finally {
      setTagsLoading(false);
    }
  }, [businessId]);

  useEffect(() => {
    if (!businessId) return;
    Promise.all([loadAssignmentOptions(), loadTags()]).catch(() => {});
  }, [businessId, loadAssignmentOptions, loadTags]);

  const currentPage = Number(pagination.page || 1);
  const totalPages = Math.max(Number(pagination.totalPages || 1), 1);

  const hasFilters = Boolean(search.trim()) || Boolean(status) || Boolean(lifecycleStage) || Boolean(source.trim());

  const openCreate = async () => {
    setForm({
      ...EMPTY_FORM,
      address: { ...EMPTY_FORM.address },
    });

    setModal({ mode: "create" });
    await Promise.all([loadAssignmentOptions(), loadTags()]);
  };

  const openEdit = async (contact) => {
    setForm({
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
      assignedTo: contact?.assignedTo?._id || contact?.assignedTo || "",
      assignedTeamId: contact?.assignedTeamId?._id || contact?.assignedTeamId || "",
      tags: normaliseTags(contact?.tags),
      customFields: normaliseCustomFields(contact?.customFields),
      address: {
        street: contact?.address?.street || "",
        city: contact?.address?.city || "",
        state: contact?.address?.state || "",
        country: contact?.address?.country || "",
        postalCode: contact?.address?.postalCode || "",
      },
    });

    setModal({
      mode: "edit",
      contact,
    });
    await Promise.all([loadAssignmentOptions(), loadTags()]);
  };

  const openAssign = async (contact) => {
    setAssignForm({
      assignedTo: contact?.assignedTo?._id || contact?.assignedTo || "",
      assignedTeamId: contact?.assignedTeamId?._id || contact?.assignedTeamId || "",
    });

    setPageError("");

    setModal({
      mode: "assign",
      contact,
    });

    await loadAssignmentOptions();
  };

  const handleCreateOrUpdate = async () => {
    const validationError = validateContactForm(form, modal?.mode === "edit" ? "edit" : "create");

    if (validationError) {
      await showErrorAlert(validationError.title, validationError.text);
      return;
    }

    setSaving(true);

    try {
      const payload = cleanPayload(form);

      if (modal?.mode === "create") {
        await createContact(businessId, payload);

        setModal(null);

        await loadContacts(1);

        await showAuthAlert({
          icon: "success",
          title: "Contact created",
          text: "The contact has been created successfully.",
          confirmButtonText: "Done",
        });
      } else {
        await updateContact(businessId, modal.contact._id, payload);

        setModal(null);

        await loadContacts(currentPage);

        await showAuthAlert({
          icon: "success",
          title: "Contact updated",
          text: "The contact has been updated successfully.",
          confirmButtonText: "Done",
        });
      }
    } catch (error) {
      await showErrorAlert(modal?.mode === "create" ? "Unable to create contact" : "Unable to update contact", getErrorMessage(error, "Please check the entered information and try again."));
    } finally {
      setSaving(false);
    }
  };

  const handleAssign = async () => {
    if (!modal?.contact?._id) return;

    setActionLoading(true);

    try {
      await assignContact(businessId, modal.contact._id, {
        assignedTo: assignForm.assignedTo.trim() || null,
        assignedTeamId: assignForm.assignedTeamId.trim() || null,
      });

      setModal(null);

      await loadContacts(currentPage);

      await showAuthAlert({
        icon: "success",
        title: "Contact assigned",
        text: "The contact assignment has been updated.",
        confirmButtonText: "Done",
      });
    } catch (error) {
      await showErrorAlert("Unable to assign contact", getErrorMessage(error, "The contact assignment could not be updated."));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (contact) => {
    if (!contact?._id) return;

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

    setActionLoading(true);

    try {
      await deleteContact(businessId, contact._id);

      const nextPage = contacts.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;

      await loadContacts(nextPage);

      await showAuthAlert({
        icon: "success",
        title: "Contact deleted",
        text: "The contact has been removed successfully.",
        confirmButtonText: "Done",
      });
    } catch (error) {
      await showErrorAlert("Unable to delete contact", getErrorMessage(error, "The contact could not be deleted."));
    } finally {
      setActionLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;

    setSearch(value);

    loadContacts(1, {
      search: value,
    });
  };

  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setLifecycleStage("");
    setSource("");

    loadContacts(1, {
      search: "",
      status: "",
      lifecycleStage: "",
      source: "",
    });
  };

  return (
    <>
      <style>{`.contacts-assigned-cell{min-width:230px;white-space:nowrap}.contacts-assigned-user,.contacts-assigned-team{white-space:nowrap}.contacts-assigned-user .crm-assignee-name,.contacts-assigned-team .crm-assignee-team{white-space:nowrap;display:inline-block}.crm-assignee-name{white-space:nowrap;display:inline-flex;align-items:center;cursor:pointer;text-decoration:none;background:transparent;border:0;padding:0;margin:0;color:var(--crm-text);font:inherit;font-weight:400;line-height:1.3;text-align:left;box-shadow:none;appearance:none;-webkit-appearance:none}.crm-assignee-name:hover{background:transparent;border:0;box-shadow:none;color:var(--crm-primary);text-decoration:none}.crm-assignee-name:focus,.crm-assignee-name:focus-visible{outline:none;box-shadow:none;background:transparent}
        .swal2-container{z-index:20000!important}.swal2-popup{z-index:20001!important}.contacts-page{padding:28px 30px 42px;max-width:1800px;margin:0 auto;color:var(--crm-text)}
        .contacts-head{display:flex;align-items:flex-end;justify-content:space-between;gap:22px;margin-bottom:22px}
        .contacts-eyebrow{font-size:13px;color:var(--crm-primary);font-weight:400;text-transform:uppercase;letter-spacing:.12em;margin-bottom:7px}
        .contacts-title{font-size:29px;line-height:1.15;letter-spacing:-.8px;margin:0;color:var(--crm-text);font-weight:400}
        .contacts-subtitle{font-size:13px;color:var(--crm-muted);margin:7px 0 0;line-height:1.55}
        .contacts-head-actions{display:flex;align-items:center;gap:8px}
        .contacts-btn{height:36px;padding:0 13px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:9px;display:inline-flex;align-items:center;justify-content:center;gap:7px;cursor:pointer;font-size:13px;font-weight:400}
        .contacts-btn:hover{background:var(--crm-surface-2);border-color:var(--crm-primary)}
        .contacts-btn.primary{background:var(--crm-primary);border-color:var(--crm-primary);color:#fff}
        .contacts-btn:disabled{opacity:.55;cursor:not-allowed}
        .contacts-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-bottom:18px}
        .contacts-stat{border:1px solid var(--crm-border);background:var(--crm-surface);border-radius:12px;padding:14px;display:flex;align-items:center;justify-content:space-between;gap:12px}
        .contacts-stat-title{font-size:13px;color:var(--crm-muted);font-weight:400;text-transform:uppercase}
        .contacts-stat-value{font-size:22px;font-weight:400;color:var(--crm-text);margin-top:5px}
        .contacts-stat-detail{font-size:13px;color:var(--crm-muted);margin-top:4px}
        .contacts-stat-icon{width:34px;height:34px;border-radius:9px;display:grid;place-items:center;color:var(--crm-primary);background:color-mix(in srgb,var(--crm-primary) 11%,transparent)}
        .contacts-stat-icon.success{color:var(--crm-success);background:color-mix(in srgb,var(--crm-success) 11%,transparent)}
        .contacts-stat-icon.warning{color:var(--crm-warning);background:color-mix(in srgb,var(--crm-warning) 11%,transparent)}
        .contacts-stat-icon.info{color:var(--crm-info);background:color-mix(in srgb,var(--crm-info) 11%,transparent)}
        .contacts-panel{border:1px solid var(--crm-border);background:var(--crm-surface);border-radius:13px;overflow:hidden}
        .contacts-toolbar{padding:12px;border-bottom:1px solid var(--crm-border);display:flex;align-items:center;gap:8px;flex-wrap:wrap}
        .contacts-search{position:relative;flex:1 1 250px;min-width:180px}
        .contacts-search>svg{position:absolute;left:11px;top:50%;transform:translateY(-50%);color:var(--crm-muted);pointer-events:none}
        .contacts-search input{width:100%;height:36px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:9px;padding:0 34px 0 33px;outline:0;font-size:13px;box-sizing:border-box}
        .contacts-search input:focus{border-color:var(--crm-primary)}
        .contacts-filter{height:36px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:9px;padding:0 30px 0 10px;outline:0;font-size:13px;font-weight:400}
        .contacts-filter-wrap{position:relative}
        .contacts-filter-wrap svg{position:absolute;right:9px;top:11px;color:var(--crm-muted);pointer-events:none}
        .contacts-clear{height:36px;padding:0 10px;border:0;background:transparent;color:var(--crm-muted);font-size:13px;font-weight:400;cursor:pointer}
        .contacts-mobile-filter-btn{display:none}
        .contacts-table-wrap{width:100%;max-height:340px;overflow:auto;overscroll-behavior:contain;scrollbar-gutter:stable both-edges}
        .contacts-table{width:100%;min-width:1940px;border-collapse:collapse;table-layout:auto}.contacts-table th:nth-child(1),.contacts-table td:nth-child(1){min-width:210px;width:210px}.contacts-table th:nth-child(2),.contacts-table td:nth-child(2){min-width:230px;width:230px}.contacts-table th:nth-child(3),.contacts-table td:nth-child(3){min-width:150px;width:150px}.contacts-table th:nth-child(4),.contacts-table td:nth-child(4){min-width:180px;width:180px}.contacts-table th:nth-child(5),.contacts-table td:nth-child(5){min-width:125px;width:125px}.contacts-table th:nth-child(6),.contacts-table td:nth-child(6){min-width:120px;width:120px}.contacts-table th:nth-child(7),.contacts-table td:nth-child(7){min-width:140px;width:140px}.contacts-table th:nth-child(8),.contacts-table td:nth-child(8){min-width:245px;width:245px}.contacts-table th:nth-child(9),.contacts-table td:nth-child(9){min-width:145px;width:145px}.contacts-table th:nth-child(10),.contacts-table td:nth-child(10){min-width:145px;width:145px}.contacts-table th:nth-child(11),.contacts-table td:nth-child(11){min-width:125px;width:125px}.contacts-table th:nth-child(12),.contacts-table td:nth-child(12){min-width:125px;width:125px}.contacts-table th{position:sticky;top:0;z-index:3;text-align:left!important;min-width:100px;padding:13px 18px;white-space:nowrap}.contacts-table th:last-child,.contacts-table td:last-child{text-align:center}.contacts-table tbody tr{height:56px}.contacts-table td{white-space:nowrap}.contacts-table th,.contacts-table td{padding-left:18px;padding-right:18px}.contacts-table .crm-assignee-name{white-space:nowrap;display:inline-flex;align-items:center;cursor:pointer}
        
        .contacts-table td{padding:12px 13px;border-bottom:1px solid var(--crm-border);font-size:13px;color:var(--crm-text);vertical-align:middle}
        .contacts-table tbody tr:hover{background:color-mix(in srgb,var(--crm-primary) 3%,transparent)}
        .contacts-person{display:flex;align-items:center;gap:9px;min-width:190px}
        .contacts-avatar{width:32px;height:32px;border-radius:9px;display:grid;place-items:center;background:color-mix(in srgb,var(--crm-primary) 12%,transparent);color:var(--crm-primary);font-size:13px;font-weight:400}
        .contacts-person-name{font-size:13px;font-weight:400;color:var(--crm-text)}
        .contacts-person-email{font-size:13px;color:var(--crm-muted);margin-top:2px;max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .contacts-status{display:inline-flex;padding:5px 8px;border-radius:999px;font-size:13px;font-weight:400}
        .contacts-status.active{color:var(--crm-success);background:color-mix(in srgb,var(--crm-success) 10%,transparent)}
        .contacts-status.inactive{color:var(--crm-danger);background:color-mix(in srgb,var(--crm-danger) 10%,transparent)}
        .contacts-stage{font-size:13px;font-weight:400;color:var(--crm-text);background:var(--crm-surface-2);border:1px solid var(--crm-border);padding:5px 8px;border-radius:7px;white-space:nowrap}
        .contacts-row-actions{display:flex;align-items:center;justify-content:flex-end;gap:5px}
        .contacts-icon-btn{width:29px;height:29px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-muted);border-radius:7px;display:grid;place-items:center;cursor:pointer}
        .contacts-icon-btn:hover{color:var(--crm-text);background:var(--crm-surface-2);border-color:var(--crm-primary)}
        .contacts-icon-btn.danger:hover{color:var(--crm-danger);border-color:var(--crm-danger)}
        .contacts-empty{padding:50px 20px;text-align:center;color:var(--crm-muted);font-size:13px}
        .contacts-empty-icon{width:40px;height:40px;border-radius:11px;margin:0 auto 10px;display:grid;place-items:center;background:var(--crm-surface-2)}
        .contacts-pagination{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px;border-top:1px solid var(--crm-border)}
        .contacts-page-info{font-size:13px;color:var(--crm-muted)}
        .contacts-page-actions{display:flex;gap:5px}
        .contacts-assignment-select{position:relative}.contacts-assignment-trigger{width:100%;min-height:40px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:9px;padding:0 11px;display:flex;align-items:center;gap:8px;text-align:left;cursor:pointer;font-size:13px}.contacts-assignment-trigger span{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.contacts-assignment-trigger>svg:last-child{margin-left:auto;color:var(--crm-muted)}.contacts-assignment-trigger:hover{border-color:var(--crm-primary);background:var(--crm-surface-2)}.contacts-assignment-menu{position:absolute;left:0;right:0;top:calc(100% + 5px);z-index:30;max-height:270px;overflow:auto;background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:10px;box-shadow:0 16px 40px rgba(0,0,0,.2);padding:6px}.contacts-assignment-search{position:sticky;top:0;z-index:2;display:flex;align-items:center;gap:7px;padding:7px;border:1px solid var(--crm-border);background:var(--crm-surface-2);border-radius:8px;margin-bottom:5px}.contacts-assignment-search>svg{color:var(--crm-muted);flex-shrink:0}.contacts-assignment-search input{flex:1!important;width:100%!important;border:0!important;background:transparent!important;box-shadow:none!important;padding:4px!important;min-width:0!important;color:var(--crm-text)}.contacts-assignment-search button{width:22px;height:22px;min-width:22px;flex:0 0 22px;margin-left:auto;padding:0;border:0;background:transparent;color:var(--crm-muted);display:grid;place-items:center;cursor:pointer}.contacts-assignment-option{width:100%;border:0;background:transparent;color:var(--crm-text);display:flex;align-items:center;gap:9px;padding:9px;border-radius:8px;text-align:left;cursor:pointer}.contacts-assignment-option:hover,.contacts-assignment-option.selected{background:color-mix(in srgb,var(--crm-primary) 9%,transparent);color:var(--crm-primary)}.contacts-assignment-option>span{min-width:0;display:grid;gap:2px}.contacts-assignment-option strong{font-size:13px;font-weight:400;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.contacts-assignment-option small{font-size:13px;color:var(--crm-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.contacts-assignment-empty{padding:18px 10px;text-align:center;color:var(--crm-muted);font-size:13px}.contacts-tags-select{position:relative}.contacts-tags-trigger{width:100%;min-height:40px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:9px;padding:0 11px;display:flex;align-items:center;gap:8px;text-align:left;cursor:pointer;font-size:13px}.contacts-tags-trigger span{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.contacts-tags-trigger>svg{margin-left:auto;color:var(--crm-muted)}.contacts-tags-trigger:hover{border-color:var(--crm-primary);background:var(--crm-surface-2)}.contacts-tags-menu{position:absolute;left:0;right:0;top:calc(100% + 5px);z-index:40;max-height:270px;overflow:auto;background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:10px;box-shadow:0 16px 40px rgba(0,0,0,.2);padding:6px}.contacts-tag-option{width:100%;border:0;background:transparent;color:var(--crm-text);display:flex;align-items:center;gap:9px;padding:9px;border-radius:8px;text-align:left;cursor:pointer;font-size:13px}.contacts-tag-option:hover,.contacts-tag-option.selected{background:color-mix(in srgb,var(--crm-primary) 9%,transparent);color:var(--crm-primary)}.contacts-tag-check{width:17px;height:17px;border:1px solid var(--crm-border);border-radius:5px;display:grid;place-items:center;flex:0 0 17px}.contacts-tag-check.selected{background:var(--crm-primary);border-color:var(--crm-primary);color:#fff}.contacts-tag-chips{display:flex;flex-wrap:wrap;gap:5px;margin-top:6px}.contacts-tag-chip{display:inline-flex;align-items:center;gap:5px;max-width:100%;padding:5px 7px;border:1px solid color-mix(in srgb,var(--crm-primary) 20%,var(--crm-border));background:color-mix(in srgb,var(--crm-primary) 8%,transparent);color:var(--crm-text);border-radius:999px;font-size:13px;font-weight:400}.contacts-tag-chip button{width:16px;height:16px;border:0;background:transparent;color:var(--crm-muted);display:grid;place-items:center;padding:0;cursor:pointer}
        .contacts-contact-email{font-size:13px;color:var(--crm-text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:220px}.contacts-contact-phone{font-size:13px;color:var(--crm-muted);margin-top:3px;white-space:nowrap}.contacts-contact-company{font-size:13px;font-weight:400;color:var(--crm-text);white-space:nowrap}.contacts-assigned-cell{display:grid;gap:4px;min-width:155px}.contacts-assigned-user,.contacts-assigned-team{display:flex;align-items:center;gap:6px;min-width:0}.contacts-assigned-user svg,.contacts-assigned-team svg{color:var(--crm-muted);flex:0 0 auto}.contacts-assigned-user strong{font-size:13px;font-weight:400;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.contacts-assigned-team span{font-size:13px;color:var(--crm-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.contacts-tags-cell{display:flex;align-items:center;gap:4px;flex-wrap:wrap;max-width:190px}.contacts-table-tag{display:inline-flex;align-items:center;padding:4px 7px;border-radius:999px;background:color-mix(in srgb,var(--crm-primary) 9%,transparent);border:1px solid color-mix(in srgb,var(--crm-primary) 18%,var(--crm-border));color:var(--crm-text);font-size:13px;font-weight:400;white-space:nowrap}.contacts-table-more{font-size:13px;color:var(--crm-muted);font-weight:400}.contacts-table-muted{font-size:13px;color:var(--crm-muted);white-space:nowrap}.contacts-source-cell{font-size:13px;color:var(--crm-text);font-weight:400;white-space:nowrap}.contacts-last-contacted{font-size:13px;color:var(--crm-text);white-space:nowrap}.contacts-page-btn{height:30px;min-width:30px;padding:0 9px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:7px;font-size:13px;font-weight:400;cursor:pointer}
        .contacts-page-btn.active{background:var(--crm-primary);border-color:var(--crm-primary);color:#fff}
        .contacts-page-btn:disabled{opacity:.45;cursor:not-allowed}
        .contacts-modal-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.48);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px}
        .contacts-modal{width:min(820px,100%);max-height:min(92vh,900px);display:flex;flex-direction:column;background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:14px;box-shadow:0 25px 70px rgba(0,0,0,.25);overflow:hidden}
        .contacts-assign-modal{width:min(560px,100%)}
        .contacts-modal-head{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;padding:18px 20px;border-bottom:1px solid var(--crm-border)}
        .contacts-modal-eyebrow{font-size:13px;color:var(--crm-primary);font-weight:400;text-transform:uppercase;letter-spacing:.1em;margin-bottom:4px}
        .contacts-modal-title{margin:0;font-size:16px;font-weight:400;color:var(--crm-text)}
        .contacts-modal-subtitle{margin:4px 0 0;font-size:13px;color:var(--crm-muted)}
        .contacts-modal-close{width:32px;height:32px;border:0;background:transparent;color:var(--crm-muted);border-radius:8px;display:grid;place-items:center;cursor:pointer}
        .contacts-modal-body{overflow:auto}
        .contacts-form{padding:20px;display:grid;grid-template-columns:1fr 1fr;gap:15px}
        .contacts-form-section.full,.contacts-field.full{grid-column:1/-1}
        .contacts-form-section-spaced{margin-top:4px}
        .contacts-form-section-title{display:flex;align-items:center;gap:7px;color:var(--crm-text);font-size:13px;font-weight:400}
        .contacts-form-section-title svg{color:var(--crm-primary)}
        .contacts-form-section-subtitle{font-size:13px;color:var(--crm-muted);margin-top:4px}
        .contacts-field{display:grid;gap:6px}
        .contacts-field label{font-size:13px;font-weight:400;color:var(--crm-text)}
        .contacts-field label span{color:var(--crm-danger)}
        .contacts-field-help{font-size:13px;color:var(--crm-muted)}
        .contacts-field input,.contacts-field select,.contacts-field textarea{width:100%;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:9px;padding:10px 11px;outline:0;font-size:13px;box-sizing:border-box}
        .contacts-field input:focus,.contacts-field select:focus,.contacts-field textarea:focus{border-color:var(--crm-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--crm-primary) 9%,transparent)}
        .contacts-field textarea{resize:vertical;min-height:110px;line-height:1.55}
        .contacts-select-wrap{position:relative}
        .contacts-select-wrap select{appearance:none;padding-right:34px}
        .contacts-select-wrap svg{position:absolute;right:11px;top:12px;color:var(--crm-muted);pointer-events:none}
        .contacts-input-icon-wrap{position:relative}
        .contacts-input-icon-wrap svg{position:absolute;left:11px;top:11px;color:var(--crm-muted);pointer-events:none}
        .contacts-input-icon-wrap input{padding-left:33px}
        .contacts-modal-footer{display:flex;align-items:center;justify-content:flex-end;gap:8px;padding:14px 20px;border-top:1px solid var(--crm-border)}
        .contacts-spinner{width:15px;height:15px;border:2px solid currentColor;border-right-color:transparent;border-radius:50%;display:inline-block;animation:contacts-spin .7s linear infinite}
        .contacts-spinner.small{width:13px;height:13px}
        @keyframes contacts-spin{to{transform:rotate(360deg)}}
        .contacts-table .crm-assignee-name{white-space:nowrap;display:inline-flex;align-items:center;cursor:pointer}@media(max-width:1050px){.contacts-stats{grid-template-columns:repeat(2,minmax(0,1fr))}.contacts-page{padding:24px 20px 36px}}
        @media(max-width:760px){.contacts-page{padding:20px 14px 30px}.contacts-head{align-items:flex-start;flex-direction:column}.contacts-head-actions{width:100%}.contacts-head-actions .contacts-btn.primary{margin-left:auto}.contacts-stats{grid-template-columns:1fr 1fr}.contacts-toolbar{align-items:stretch}.contacts-search{flex-basis:100%}.contacts-mobile-filter-btn{display:inline-flex}.contacts-filter-wrap.mobile-hidden{display:none}.contacts-filter-wrap{flex:1}.contacts-filter{width:100%}.contacts-form{grid-template-columns:1fr}.contacts-form-section.full,.contacts-field.full{grid-column:auto}.contacts-modal-backdrop{padding:10px}.contacts-modal{max-height:94vh}.contacts-pagination{align-items:flex-start;flex-direction:column}.contacts-page-actions{width:100%;justify-content:flex-end}}
        @media(max-width:480px){.contacts-stats{grid-template-columns:1fr}.contacts-head-actions{justify-content:space-between}.contacts-head-actions .contacts-btn{flex:1}.contacts-head-actions .contacts-btn.primary{margin-left:0}}
      .contacts-table thead th{text-align:left!important;padding-left:20px;padding-right:20px;white-space:nowrap}.contacts-table tbody td{padding-left:20px;padding-right:20px}.contacts-table td:last-child{text-align:center}`}</style>

      <div className="contacts-page">
        <div className="contacts-head">
          <div>
            <h1 className="contacts-title">Contacts</h1>
            <p className="contacts-subtitle">Manage customer relationships, contact information and ownership from one place.</p>
          </div>

          <div className="contacts-head-actions">
            <button type="button" className="contacts-btn" onClick={() => loadContacts(currentPage)} disabled={loading}>
              <RefreshCw size={14} />
              Refresh
            </button>

            <button type="button" className="contacts-btn primary" onClick={openCreate} disabled={!businessId}>
              <Plus size={15} />
              New contact
            </button>
          </div>
        </div>

        <div className="contacts-stats">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div className="contacts-stat" key={stat.title}>
                <div>
                  <div className="contacts-stat-title">{stat.title}</div>
                  <div className="contacts-stat-value">{stat.value}</div>
                  <div className="contacts-stat-detail">{stat.detail}</div>
                </div>

                <div className={`contacts-stat-icon ${stat.tone}`}>
                  <Icon size={17} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="contacts-panel">
          <div className="contacts-toolbar">
            <div className="contacts-search">
              <Search size={14} />

              <input value={search} onChange={handleSearchChange} placeholder="Search contacts..." />

              {search && (
                <button
                  type="button"
                  onClick={() =>
                    handleSearchChange({
                      target: { value: "" },
                    })
                  }
                  title="Clear search"
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 0,
                    margin: 0,
                    border: "none",
                    background: "transparent",
                    color: "var(--crm-muted)",
                    cursor: "pointer",
                  }}>
                  <X size={14} />
                </button>
              )}
            </div>

            <button type="button" className="contacts-btn contacts-mobile-filter-btn" onClick={() => setMobileFilters((value) => !value)}>
              Filters
            </button>

            <div className={`contacts-filter-wrap ${mobileFilters ? "" : "mobile-hidden"}`}>
              <select
                className="contacts-filter"
                value={status}
                onChange={(event) => {
                  const value = event.target.value;
                  setStatus(value);
                  loadContacts(1, { status: value });
                }}>
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <ChevronDown size={13} />
            </div>

            <div className={`contacts-filter-wrap ${mobileFilters ? "" : "mobile-hidden"}`}>
              <select
                className="contacts-filter"
                value={lifecycleStage}
                onChange={(event) => {
                  const value = event.target.value;
                  setLifecycleStage(value);
                  loadContacts(1, {
                    lifecycleStage: value,
                  });
                }}>
                {LIFECYCLE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <ChevronDown size={13} />
            </div>

            <input
              className={`contacts-filter ${mobileFilters ? "" : "mobile-hidden"}`}
              style={{ minWidth: 130 }}
              value={source}
              onChange={(event) => {
                const value = event.target.value;
                setSource(value);
                loadContacts(1, { source: value });
              }}
              placeholder="Source"
            />

            {hasFilters && (
              <button type="button" className="contacts-clear" onClick={clearFilters}>
                Clear filters
              </button>
            )}
          </div>

          <div className="contacts-table-wrap">
            <table className="contacts-table">
              <thead>
                <tr>
                  <th>Contact</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Company</th>
                  <th>Lifecycle</th>
                  <th>Status</th>
                  <th>Source</th>
                  <th>Assigned</th>
                  <th>Tags</th>
                  <th>Last contacted</th>
                  <th>Updated</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="12">
                      <div className="contacts-empty">Loading contacts...</div>
                    </td>
                  </tr>
                ) : contacts.length === 0 ? (
                  <tr>
                    <td colSpan="12">
                      <div className="contacts-empty">
                        <div className="contacts-empty-icon">
                          <UsersRound size={18} />
                        </div>
                        <div>No contacts found.</div>
                        {hasFilters && (
                          <button type="button" className="contacts-clear" onClick={clearFilters}>
                            Clear filters
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  contacts.map((contact) => {
                    const companyName = contact?.companyId?.name || contact?.company?.name || (typeof contact?.companyId === "string" ? contact.companyId : "—");
                    const contactTags = Array.isArray(contact?.tags) ? contact.tags : [];
                    const assignedUser = getAssignedUserName(contact);
                    const assignedUserEmail = getAssignedUserEmail(contact);
                    const assignedTeam = getAssignedTeamName(contact);

                    return (
                      <tr key={contact._id}>
                        <td>
                          <div className="contacts-person">
                            <div className="contacts-avatar">{getInitials(contact)}</div>
                            <div>
                              <div className="contacts-person-name">{getContactName(contact)}</div>
                              {contact?.jobTitle && <div className="contacts-person-email">{contact.jobTitle}</div>}
                            </div>
                          </div>
                        </td>

                        <td>
                          <div className="contacts-contact-email" title={contact?.email || "No email"}>
                            {contact?.email || "—"}
                          </div>
                        </td>

                        <td>
                          <div className="contacts-contact-phone">{contact?.phone || "—"}</div>
                          {contact?.alternatePhone && <div className="contacts-contact-phone">Alt: {contact.alternatePhone}</div>}
                        </td>

                        <td>
                          <div className="contacts-contact-company">{companyName}</div>
                        </td>

                        <td>
                          <span className="contacts-stage">{contact?.lifecycleStage?.replaceAll("_", " ") || "—"}</span>
                        </td>

                        <td>
                          <span className={`contacts-status ${contact?.status === "ACTIVE" ? "active" : "inactive"}`}>{contact?.status === "ACTIVE" ? "Active" : "Inactive"}</span>
                        </td>

                        <td>
                          <div className="contacts-source-cell">{contact?.source || "—"}</div>
                        </td>

                        <td>
                          <div className="contacts-assigned-cell">
                            <div className="contacts-assigned-user">
                              <UserRound size={12} />
                              <button type="button" className="crm-assignee-name" onClick={() => contact?.assignedTo && setAssigneeDetail({ type: "user", name: assignedUser, email: assignedUserEmail })}>{`User: ${assignedUser}`}</button>
                            </div>
                            <div className="contacts-assigned-team">
                              <UsersRound size={12} />
                              <span className="crm-assignee-team">{`Team: ${assignedTeam}`}</span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div className="contacts-tags-cell">
                            {contactTags.length ? (
                              contactTags.slice(0, 2).map((tag, index) => (
                                <span className="contacts-table-tag" key={String(tag?._id || tag?.id || tag || index)}>
                                  {getTagDisplayName(tag, tags)}
                                </span>
                              ))
                            ) : (
                              <span className="contacts-table-muted">—</span>
                            )}
                            {contactTags.length > 2 && <span className="contacts-table-more">+{contactTags.length - 2}</span>}
                          </div>
                        </td>

                        <td>
                          <div className="contacts-last-contacted">{formatDate(contact?.lastContactedAt)}</div>
                        </td>
                        <td>
                          <div className="contacts-table-muted">{formatDate(contact?.updatedAt)}</div>
                        </td>

                        <td>
                          <div className="contacts-row-actions">
                            <button type="button" className="contacts-icon-btn" title="View contact" onClick={() => navigate(`/contacts/${contact._id}`)}>
                              <Eye size={14} />
                            </button>
                            <button type="button" className="contacts-icon-btn" title="Edit contact" onClick={() => openEdit(contact)}>
                              <Pencil size={14} />
                            </button>
                            <button type="button" className="contacts-icon-btn" title="Assign contact" onClick={() => openAssign(contact)}>
                              <UserRound size={14} />
                            </button>
                            {canManage && (
                              <button type="button" className="contacts-icon-btn danger" title="Delete contact" onClick={() => handleDelete(contact)} disabled={actionLoading}>
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

          <div className="contacts-pagination">
            <div className="contacts-page-info">
              Page {currentPage} of {totalPages}
              {Number(pagination.total || 0) > 0 ? ` • ${Number(pagination.total).toLocaleString("en-IN")} total` : ""}
            </div>

            <div className="contacts-page-actions">
              <button type="button" className="contacts-page-btn" disabled={loading || currentPage <= 1} onClick={() => loadContacts(currentPage - 1)}>
                Previous
              </button>

              {Array.from({ length: Math.min(totalPages, 5) }, (_, index) => {
                let pageNumber;

                if (totalPages <= 5) {
                  pageNumber = index + 1;
                } else if (currentPage <= 3) {
                  pageNumber = index + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + index;
                } else {
                  pageNumber = currentPage - 2 + index;
                }

                return (
                  <button type="button" key={pageNumber} className={`contacts-page-btn ${pageNumber === currentPage ? "active" : ""}`} disabled={loading} onClick={() => loadContacts(pageNumber)}>
                    {pageNumber}
                  </button>
                );
              })}

              <button type="button" className="contacts-page-btn" disabled={loading || currentPage >= totalPages} onClick={() => loadContacts(currentPage + 1)}>
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {(modal?.mode === "create" || modal?.mode === "edit") && (
        <ContactFormModal mode={modal.mode} form={form} setForm={setForm} saving={saving} members={members} teams={teams} loadingOptions={assignmentOptionsLoading} tags={tags} loadingTags={tagsLoading} onCancel={() => setModal(null)} onSubmit={handleCreateOrUpdate} />
      )}

      {modal?.mode === "assign" ? <AssignModal contact={modal.contact} form={assignForm} setForm={setAssignForm} saving={actionLoading} members={members} teams={teams} loadingOptions={assignmentOptionsLoading} onCancel={() => setModal(null)} onSubmit={handleAssign} /> : null}
      {assigneeDetail ? <AssigneeDetailsPopup detail={assigneeDetail} onClose={() => setAssigneeDetail(null)} /> : null}
    </>
  );
}
