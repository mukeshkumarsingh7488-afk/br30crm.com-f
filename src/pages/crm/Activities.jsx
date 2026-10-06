import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CalendarDays, Check, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, Clock3, Eye, Filter, Mail, MessageSquare, Pencil, Phone, Plus, RefreshCw, Search, StickyNote, Tag, Trash2, Users, X } from "lucide-react";

import useBusiness from "../../hooks/useBusiness";
import AssigneeDetailsPopup from "../../components/crm/AssigneeDetailsPopup";
import { isManagementRole } from "../../utils/permissions";

import { completeActivity, createActivity, deleteActivity, getActivities, getActivityById, updateActivity } from "../../api/activity.api";

import { getAssignmentMembers } from "../../api/crm.api";
import api from "../../api/api";

import { showAuthAlert } from "../../components/auth/authAlert";

const TYPE_OPTIONS = [
  { value: "CALL", label: "Call" },
  { value: "EMAIL", label: "Email" },
  { value: "MEETING", label: "Meeting" },
  { value: "TASK", label: "Task" },
  { value: "NOTE", label: "Note" },
  { value: "SMS", label: "SMS" },
  { value: "WHATSAPP", label: "WhatsApp" },
  { value: "FOLLOW_UP", label: "Follow up" },
  { value: "OTHER", label: "Other" },
];

const STATUS_OPTIONS = [
  { value: "PLANNED", label: "Planned" },
  { value: "IN_PROGRESS", label: "In progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

const PRIORITY_OPTIONS = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
  { value: "URGENT", label: "Urgent" },
];

const RELATED_TYPE_OPTIONS = [
  { value: "", label: "No related record" },
  { value: "LEAD", label: "Lead" },
  { value: "CONTACT", label: "Contact" },
  { value: "COMPANY", label: "Company" },
  { value: "DEAL", label: "Deal" },
];

const EMPTY_FORM = {
  type: "CALL",
  subject: "",
  description: "",
  status: "PLANNED",
  priority: "MEDIUM",
  dueAt: "",
  assignedTo: "",
  contactId: "",
  companyId: "",
  leadId: "",
  dealId: "",
  location: "",
  reminderAt: "",
  outcome: "",
  tags: [],
};

const unwrap = (response) => {
  const root = response?.data || response || {};

  if (root?.data && typeof root.data === "object") {
    return root.data;
  }

  return root;
};

const extractRows = (response, keys = []) => {
  const data = unwrap(response);

  for (const key of keys) {
    if (Array.isArray(data?.[key])) {
      return data[key];
    }
  }

  if (Array.isArray(data)) {
    return data;
  }

  return [];
};

const getId = (value) => {
  if (!value) return "";

  if (typeof value === "string") {
    return value;
  }

  return value?._id || value?.id || "";
};

const getMemberId = (member) => {
  if (!member) return "";

  return member?.userId?._id || member?.userId?.id || member?.userId || member?._userId || "";
};

const getMemberUser = (member) => {
  if (member?.userId && typeof member.userId === "object") {
    return member.userId;
  }

  return member;
};

const getMemberName = (member) => {
  const user = getMemberUser(member);

  const name = [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim();

  return name || user?.name || user?.fullName || user?.email || member?.email || "Unnamed user";
};

const getMemberEmail = (member) => {
  const user = getMemberUser(member);

  return user?.email || member?.email || "";
};

const getTagId = (tag) => {
  if (!tag) return "";

  return typeof tag === "string" ? tag : tag?._id || tag?.id || "";
};

const getTagName = (tag) => {
  if (!tag) return "";

  if (typeof tag === "string") {
    return "";
  }

  return tag?.name || tag?.title || tag?.label || tag?.slug || "Unnamed tag";
};

const getErrorMessage = (error, fallback = "Something went wrong.") => {
  const data = error?.response?.data;

  if (Array.isArray(data?.details) && data.details.length) {
    return data.details
      .map((item) => item?.message || item?.msg)
      .filter(Boolean)
      .join(", ");
  }

  if (Array.isArray(data?.errors) && data.errors.length) {
    return data.errors
      .map((item) => item?.message || item?.msg)
      .filter(Boolean)
      .join(", ");
  }

  return data?.message || data?.error?.message || data?.error || error?.message || fallback;
};

const showError = (title, text) =>
  showAuthAlert({
    icon: "error",
    title,
    text,
    confirmButtonText: "OK",
  });

const showSuccess = (title, text) =>
  showAuthAlert({
    icon: "success",
    title,
    text,
    confirmButtonText: "Done",
  });

const formatDate = (value) => {
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
};

const formatDateTime = (value) => {
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
};

const formatDateTimeLocal = (value) => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offset = date.getTimezoneOffset();

  const localDate = new Date(date.getTime() - offset * 60 * 1000);

  return localDate.toISOString().slice(0, 16);
};

const getStatusClass = (status) => {
  if (status === "COMPLETED") return "success";
  if (status === "CANCELLED") return "danger";
  if (status === "IN_PROGRESS") return "warning";
  return "neutral";
};

const getPriorityClass = (priority) => {
  if (priority === "URGENT") return "danger";
  if (priority === "HIGH") return "warning";
  if (priority === "LOW") return "neutral";
  return "info";
};

const getTypeIcon = (type) => {
  if (type === "CALL") return Phone;
  if (type === "EMAIL") return Mail;
  if (type === "MEETING") return CalendarDays;
  if (type === "TASK") return CheckCircle2;
  if (type === "NOTE") return StickyNote;
  if (type === "SMS") return MessageSquare;
  if (type === "WHATSAPP") return MessageSquare;
  if (type === "FOLLOW_UP") return Clock3;

  return Users;
};

const labelFor = (options, value) => options.find((item) => item.value === value)?.label || value || "—";

const getRelatedType = (activity) => {
  if (activity?.leadId) return "LEAD";
  if (activity?.contactId) return "CONTACT";
  if (activity?.companyId) return "COMPANY";
  if (activity?.dealId) return "DEAL";

  return "";
};

const getRelatedValue = (activity) => {
  if (activity?.leadId) return activity.leadId;
  if (activity?.contactId) return activity.contactId;
  if (activity?.companyId) return activity.companyId;
  if (activity?.dealId) return activity.dealId;

  return null;
};

const getRelatedLabel = (type, record) => {
  if (!record) return "—";

  if (type === "LEAD") {
    return record?.name || [record?.firstName, record?.lastName].filter(Boolean).join(" ") || record?.email || "Unnamed lead";
  }

  if (type === "CONTACT") {
    return [record?.firstName, record?.lastName].filter(Boolean).join(" ") || record?.name || record?.email || "Unnamed contact";
  }

  if (type === "COMPANY") {
    return record?.name || record?.legalName || record?.email || "Unnamed company";
  }

  if (type === "DEAL") {
    return record?.name || record?.title || "Unnamed deal";
  }

  return "Unnamed record";
};

function Activities() {
  const { businessId, loading: businessLoading, error: businessError, role, isBusinessOwner } = useBusiness();
  const canManage = isManagementRole({ role, isBusinessOwner });
  const [assigneeDetail, setAssigneeDetail] = useState(null);

  const [activities, setActivities] = useState([]);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  const [filterOpen, setFilterOpen] = useState(false);

  const [members, setMembers] = useState([]);
  const [tags, setTags] = useState([]);

  const [loading, setLoading] = useState(true);
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [modal, setModal] = useState(null);

  const [form, setForm] = useState(EMPTY_FORM);

  const [memberSearch, setMemberSearch] = useState("");
  const [memberDropdownOpen, setMemberDropdownOpen] = useState(false);

  const [tagDropdownOpen, setTagDropdownOpen] = useState(false);

  const [relatedSearch, setRelatedSearch] = useState("");
  const [relatedOptions, setRelatedOptions] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(false);

  const [relatedType, setRelatedType] = useState("");

  const memberDropdownRef = useRef(null);
  const tagDropdownRef = useRef(null);

  const activeFilterCount = useMemo(() => {
    return [status, type, assignedTo].filter(Boolean).length;
  }, [status, type, assignedTo]);

  const selectedMember = useMemo(() => {
    return members.find((member) => getMemberId(member) === form.assignedTo);
  }, [members, form.assignedTo]);

  const filteredMembers = useMemo(() => {
    const query = memberSearch.trim().toLowerCase();

    if (!query) {
      return members;
    }

    return members.filter((member) => {
      const name = getMemberName(member).toLowerCase();
      const email = getMemberEmail(member).toLowerCase();

      return name.includes(query) || email.includes(query);
    });
  }, [members, memberSearch]);

  const selectedTags = useMemo(() => {
    return (form.tags || []).map((id) => tags.find((tag) => getTagId(tag) === id)).filter(Boolean);
  }, [form.tags, tags]);

  const selectedRelated = useMemo(() => {
    if (!form.contactId && !form.companyId && !form.leadId && !form.dealId) {
      return null;
    }

    const selectedId = relatedType === "LEAD" ? form.leadId : relatedType === "CONTACT" ? form.contactId : relatedType === "COMPANY" ? form.companyId : form.dealId;

    if (!selectedId) return null;

    return relatedOptions.find((item) => getId(item) === selectedId) || null;
  }, [form.contactId, form.companyId, form.leadId, form.dealId, relatedOptions, relatedType]);

  const loadOptions = useCallback(async () => {
    if (!businessId) return;

    setOptionsLoading(true);

    try {
      const [membersResponse, tagsResponse] = await Promise.all([
        getAssignmentMembers(businessId, {
          page: 1,
          limit: 100,
        }),

        api.get(`/tags/business/${businessId}`, {
          params: {
            page: 1,
            limit: 100,
          },
        }),
      ]);

      const memberRows = extractRows(membersResponse, ["items", "members", "results"]);

      const tagRows = extractRows(tagsResponse, ["items", "tags", "results"]);

      setMembers(Array.isArray(memberRows) ? memberRows : []);

      setTags(Array.isArray(tagRows) ? tagRows : []);
    } catch (err) {
      setMembers([]);
      setTags([]);

      await showError("Options unavailable", getErrorMessage(err, "Unable to load business members and tags."));
    } finally {
      setOptionsLoading(false);
    }
  }, [businessId]);

  const loadActivities = useCallback(
    async (page = 1, nextSearch = search, nextStatus = status, nextType = type, nextAssignedTo = assignedTo) => {
      if (!businessId) return;

      setLoading(true);
      setError("");

      try {
        const params = {
          page,
          limit: pagination.limit || 10,
        };

        if (nextSearch.trim()) {
          params.search = nextSearch.trim();
        }

        if (nextStatus) {
          params.status = nextStatus;
        }

        if (nextType) {
          params.type = nextType;
        }

        if (nextAssignedTo) {
          params.assignedTo = nextAssignedTo;
        }

        const response = await getActivities(businessId, params);

        const data = unwrap(response);

        const rows = extractRows(response, ["activities", "items", "results"]);

        setActivities(Array.isArray(rows) ? rows : []);

        setPagination(
          data?.pagination || {
            page,
            limit: pagination.limit || 10,
            total: rows.length,
            totalPages: 1,
          }
        );
      } catch (err) {
        const message = getErrorMessage(err, "Unable to load activities.");

        setActivities([]);
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [businessId, pagination.limit, search, status, type, assignedTo]
  );

  useEffect(() => {
    if (!businessId) return;

    loadOptions();
    loadActivities(1);
  }, [businessId]);

  useEffect(() => {
    const handleOutside = (event) => {
      if (memberDropdownRef.current && !memberDropdownRef.current.contains(event.target)) {
        setMemberDropdownOpen(false);
      }

      if (tagDropdownRef.current && !tagDropdownRef.current.contains(event.target)) {
        setTagDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
    };
  }, []);

  const updateForm = (name, value) => {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const resetFilters = () => {
    setStatus("");
    setType("");
    setAssignedTo("");

    loadActivities(1, search, "", "", "");
  };

  const clearSearch = () => {
    setSearch("");

    loadActivities(1, "", status, type, assignedTo);
  };

  const openCreate = async () => {
    setError("");

    if (!members.length || !tags.length) {
      await loadOptions();
    }

    setMemberSearch("");
    setMemberDropdownOpen(false);
    setTagDropdownOpen(false);

    setRelatedSearch("");
    setRelatedOptions([]);
    setRelatedType("");

    setForm({
      ...EMPTY_FORM,
      tags: [],
    });

    setModal({
      mode: "create",
    });
  };

  const openView = async (activity) => {
    if (!businessId || !activity?._id) {
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await getActivityById(businessId, activity._id);

      const data = unwrap(response);

      const currentActivity = data?.activity || data || activity;

      setModal({
        mode: "view",
        activity: currentActivity,
      });
    } catch (err) {
      await showError("Unable to open activity", getErrorMessage(err, "Unable to load activity details."));
    } finally {
      setSaving(false);
    }
  };

  const openEdit = async (activity) => {
    if (!activity?._id) {
      await showError("Unable to edit activity", "Activity ID is missing.");

      return;
    }

    setError("");
    setSaving(true);

    try {
      let currentActivity = activity;

      if (businessId) {
        try {
          const response = await getActivityById(businessId, activity._id);

          const data = unwrap(response);

          currentActivity = data?.activity || data || activity;
        } catch {
          currentActivity = activity;
        }
      }

      const currentRelatedType = getRelatedType(currentActivity);

      const assignedId = currentActivity?.assignedTo?._id || currentActivity?.assignedTo?.id || currentActivity?.assignedTo || "";

      const activityTags = Array.isArray(currentActivity?.tags) ? currentActivity.tags.map(getTagId).filter(Boolean) : [];

      setRelatedType(currentRelatedType);

      setForm({
        type: currentActivity?.type || "CALL",

        subject: currentActivity?.subject || "",

        description: currentActivity?.description || "",

        status: currentActivity?.status || "PLANNED",

        priority: currentActivity?.priority || "MEDIUM",

        dueAt: formatDateTimeLocal(currentActivity?.dueAt),

        assignedTo: assignedId,

        contactId: getId(currentActivity?.contactId),

        companyId: getId(currentActivity?.companyId),

        leadId: getId(currentActivity?.leadId),

        dealId: getId(currentActivity?.dealId),

        location: currentActivity?.location || "",

        reminderAt: formatDateTimeLocal(currentActivity?.reminderAt),

        outcome: currentActivity?.outcome || "",

        tags: activityTags,
      });

      setMemberSearch("");
      setMemberDropdownOpen(false);
      setTagDropdownOpen(false);
      setRelatedSearch("");

      setModal({
        mode: "edit",
        activity: currentActivity,
      });

      if (!members.length || !tags.length) {
        loadOptions().catch(() => {});
      }

      if (currentRelatedType) {
        loadRelatedOptions(currentRelatedType, "").catch(() => {});
      } else {
        setRelatedOptions([]);
      }
    } catch (err) {
      await showError("Unable to open edit", getErrorMessage(err, "Unable to open activity for editing."));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (activity) => {
    if (!businessId || !activity?._id) {
      return;
    }

    const result = await showAuthAlert({
      icon: "warning",
      title: "Delete activity?",
      text: "Are you sure you want to delete this activity? This action cannot be undone.",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (!result?.isConfirmed) {
      return;
    }

    try {
      await deleteActivity(businessId, activity._id);

      const currentPage = pagination.page || 1;

      const shouldGoBack = activities.length === 1 && currentPage > 1;

      await loadActivities(shouldGoBack ? currentPage - 1 : currentPage, search, status, type, assignedTo);

      await showSuccess("Activity Deleted", "Activity deleted successfully.");
    } catch (err) {
      await showError("Unable to delete activity", getErrorMessage(err, "Unable to delete activity."));
    }
  };

  const handleComplete = async (activity) => {
    if (!businessId || !activity?._id) {
      return;
    }

    if (activity.status === "COMPLETED") {
      return;
    }

    const result = await showAuthAlert({
      icon: "question",
      title: "Complete activity?",
      text: "Mark this activity as completed?",
      showCancelButton: true,
      confirmButtonText: "Complete",
      cancelButtonText: "Cancel",
    });

    if (!result?.isConfirmed) {
      return;
    }

    try {
      await completeActivity(businessId, activity._id);

      await loadActivities(pagination.page || 1, search, status, type, assignedTo);

      await showSuccess("Activity Completed", "Activity marked as completed.");
    } catch (err) {
      await showError("Unable to complete activity", getErrorMessage(err, "Unable to complete activity."));
    }
  };

  const loadRelatedOptions = async (nextType, query = "") => {
    if (!businessId || !nextType) {
      setRelatedOptions([]);
      return;
    }

    setRelatedLoading(true);

    try {
      let endpoint = "";

      if (nextType === "LEAD") {
        endpoint = `/leads/business/${businessId}`;
      }

      if (nextType === "CONTACT") {
        endpoint = `/contacts/business/${businessId}`;
      }

      if (nextType === "COMPANY") {
        endpoint = `/companies/business/${businessId}`;
      }

      if (nextType === "DEAL") {
        endpoint = `/deals/business/${businessId}`;
      }

      if (!endpoint) {
        setRelatedOptions([]);
        return;
      }

      const response = await api.get(endpoint, {
        params: {
          page: 1,
          limit: 50,
          ...(query.trim()
            ? {
                search: query.trim(),
              }
            : {}),
        },
      });

      const rows = extractRows(response, ["items", "leads", "contacts", "companies", "deals", "results"]);

      setRelatedOptions(Array.isArray(rows) ? rows : []);
    } catch {
      setRelatedOptions([]);
    } finally {
      setRelatedLoading(false);
    }
  };

  const clearRelated = () => {
    setForm((current) => ({
      ...current,
      contactId: "",
      companyId: "",
      leadId: "",
      dealId: "",
    }));

    setRelatedOptions([]);
    setRelatedSearch("");
  };

  const handleRelatedTypeChange = (nextType) => {
    setRelatedType(nextType);

    clearRelated();

    if (nextType) {
      loadRelatedOptions(nextType, "");
    }
  };

  const selectRelated = (item) => {
    const id = getId(item);

    if (!id) return;

    setForm((current) => ({
      ...current,
      contactId: relatedType === "CONTACT" ? id : "",
      companyId: relatedType === "COMPANY" ? id : "",
      leadId: relatedType === "LEAD" ? id : "",
      dealId: relatedType === "DEAL" ? id : "",
    }));
  };

  const toggleTag = (tagId) => {
    const normalizedTagId = String(tagId || "");
    if (!normalizedTagId) return;
    setForm((current) => {
      const currentTags = Array.isArray(current.tags) ? current.tags.map(getTagId).filter(Boolean).map(String) : [];
      const exists = currentTags.includes(normalizedTagId);
      return {
        ...current,
        tags: exists ? currentTags.filter((id) => id !== normalizedTagId) : [...currentTags, normalizedTagId],
      };
    });
  };

  const getAssignedUserName = (activity) => {
    const assigned = activity?.assignedTo;

    if (!assigned) {
      return "Unassigned";
    }

    if (typeof assigned === "string") {
      const member = members.find((item) => getMemberId(item) === assigned);

      return member ? getMemberName(member) : "Assigned";
    }

    return [assigned?.firstName, assigned?.lastName].filter(Boolean).join(" ").trim() || assigned?.name || assigned?.fullName || assigned?.email || "Assigned";
  };

  const renderRelated = (activity) => {
    const relationType = getRelatedType(activity);

    const related = getRelatedValue(activity);

    if (!relationType || !related) {
      return "—";
    }

    const id = getId(related);

    const label = getRelatedLabel(relationType, typeof related === "object" ? related : null);

    return (
      <div className="activity-related-cell">
        <span className="activity-related-type">{relationType}</span>

        <span>{label !== "—" ? label : id || "Record"}</span>
      </div>
    );
  };

  const getInitials = (name) => {
    if (!name || name === "Unassigned") {
      return "—";
    }

    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  const isOverdue = (activity) => {
    if (!activity?.dueAt || activity?.status === "COMPLETED" || activity?.status === "CANCELLED") {
      return false;
    }

    const date = new Date(activity.dueAt);

    return !Number.isNaN(date.getTime()) && date.getTime() < Date.now();
  };

  const stats = useMemo(() => {
    const total = Number(pagination.total || 0);

    const planned = activities.filter((activity) => activity.status === "PLANNED").length;

    const inProgress = activities.filter((activity) => activity.status === "IN_PROGRESS").length;

    const completed = activities.filter((activity) => activity.status === "COMPLETED").length;

    const urgent = activities.filter((activity) => activity.priority === "URGENT" && activity.status !== "COMPLETED" && activity.status !== "CANCELLED").length;

    return [
      {
        title: "Total activities",
        value: total.toLocaleString("en-IN"),
        detail: "All matching activities",
        icon: CalendarDays,
        tone: "primary",
      },

      {
        title: "Planned",
        value: planned.toLocaleString("en-IN"),
        detail: "On current page",
        icon: Clock3,
        tone: "info",
      },

      {
        title: "In progress",
        value: inProgress.toLocaleString("en-IN"),
        detail: "On current page",
        icon: RefreshCw,
        tone: "warning",
      },

      {
        title: "Completed",
        value: completed.toLocaleString("en-IN"),
        detail: "On current page",
        icon: Check,
        tone: "success",
      },

      {
        title: "Urgent",
        value: urgent.toLocaleString("en-IN"),
        detail: "Open urgent activities",
        icon: Tag,
        tone: "danger",
      },
    ];
  }, [pagination.total, activities]);

  const saveActivity = async () => {
    if (!businessId) {
      await showError("Business unavailable", "Business information is not available.");
      return;
    }

    if (!form.subject.trim()) {
      await showError("Subject required", "Please enter an activity subject.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const payload = {
        type: form.type,

        subject: form.subject.trim(),

        description: form.description.trim() || null,

        status: form.status,

        priority: form.priority,

        dueAt: form.dueAt || null,

        assignedTo: form.assignedTo || null,

        contactId: form.contactId || null,

        companyId: form.companyId || null,

        leadId: form.leadId || null,

        dealId: form.dealId || null,

        location: form.location.trim() || null,

        reminderAt: form.reminderAt || null,

        outcome: form.outcome.trim() || null,

        tags: Array.isArray(form.tags) ? form.tags : [],
      };

      if (modal?.mode === "create") {
        await createActivity(businessId, payload);

        setModal(null);

        await loadActivities(1, search, status, type, assignedTo);

        await showSuccess("Activity Created", "Activity created successfully.");
      } else {
        await updateActivity(businessId, modal.activity._id, payload);

        setModal(null);

        await loadActivities(pagination.page || 1, search, status, type, assignedTo);

        await showSuccess("Activity Updated", "Activity updated successfully.");
      }
    } catch (err) {
      await showError(modal?.mode === "create" ? "Unable to create activity" : "Unable to update activity", getErrorMessage(err, "Unable to save activity."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="crm-resource-page activities-page">
      <style>{`.activities-assignee-cell,.activity-assignee-cell{min-width:230px;white-space:nowrap}.activities-assignee-cell .crm-assignee-name,.activity-assignee-cell .crm-assignee-name{white-space:nowrap;display:inline-block}.crm-assignee-name{white-space:nowrap;display:inline-flex;align-items:center;cursor:pointer;text-decoration:none;background:transparent;border:0;padding:0;margin:0;color:var(--crm-text);font:inherit;font-weight:400;line-height:1.3;text-align:left;box-shadow:none;appearance:none;-webkit-appearance:none}.crm-assignee-name:hover{background:transparent;border:0;box-shadow:none;color:var(--crm-primary);text-decoration:none}.crm-assignee-name:focus,.crm-assignee-name:focus-visible{outline:none;box-shadow:none;background:transparent}
        .activities-page{padding:24px 26px 40px}
        .activities-head{display:flex;align-items:flex-end;justify-content:space-between;gap:18px;margin-bottom:18px}
        .activities-head-left{min-width:0}
        .activities-title{margin:0;color:var(--crm-text);font-size:26px;line-height:1.15;font-weight:400;letter-spacing:-.35px}
        .activities-subtitle{margin:6px 0 0;color:var(--crm-muted);font-size:13px;line-height:1.45;font-weight:400}
        .activities-head-actions{display:flex;align-items:center;gap:8px}
        .activities-btn{height:38px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:9px;padding:0 13px;display:inline-flex;align-items:center;justify-content:center;gap:7px;font-size:13px;font-weight:400;cursor:pointer}
        .activities-btn:hover:not(:disabled){border-color:var(--crm-primary);color:var(--crm-primary)}
        .activities-btn.primary{background:var(--crm-primary);border-color:var(--crm-primary);color:#fff}
        .activities-btn.primary:hover{background:var(--crm-primary);border-color:var(--crm-primary);color:#fff}
        .activities-btn:disabled{opacity:.55;cursor:not-allowed}

        .activities-stats{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px;margin-bottom:16px}
        .activities-stat{border:1px solid var(--crm-border);background:var(--crm-surface);border-radius:12px;padding:12px 13px;box-shadow:var(--crm-shadow);min-width:0}
        .activities-stat-top{display:flex;align-items:center;justify-content:space-between;gap:8px}
        .activities-stat-icon{width:31px;height:31px;border-radius:9px;display:grid;place-items:center;background:color-mix(in srgb,var(--crm-primary) 10%,transparent);color:var(--crm-primary)}
        .activities-stat-icon.success{background:color-mix(in srgb,var(--crm-success) 10%,transparent);color:var(--crm-success)}
        .activities-stat-icon.warning{background:color-mix(in srgb,var(--crm-warning) 10%,transparent);color:var(--crm-warning)}
        .activities-stat-icon.info{background:color-mix(in srgb,var(--crm-info) 10%,transparent);color:var(--crm-info)}
        .activities-stat-icon.danger{background:color-mix(in srgb,var(--crm-danger) 10%,transparent);color:var(--crm-danger)}
        .activities-stat-value{font-size:20px;line-height:1;font-weight:400;color:var(--crm-text)}
        .activities-stat-title{margin-top:8px;color:var(--crm-text);font-size:13px;font-weight:400}
        .activities-stat-detail{margin-top:3px;color:var(--crm-muted);font-size:13px}

        .activities-toolbar{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:13px}
        .activities-search-wrap{position:relative;max-width:460px;width:100%}
        .activities-search{width:100%;height:40px;box-sizing:border-box;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:10px;padding:0 40px;font-size:13px;outline:0}
        .activities-search:focus{border-color:var(--crm-primary)}
        .activities-search::placeholder{color:var(--crm-muted)}
        .activities-search-icon{position:absolute;left:12px;top:12px;color:var(--crm-muted);pointer-events:none}
        .activities-search-clear{position:absolute;right:8px;top:8px;width:24px;height:24px;border:0;background:transparent;color:var(--crm-muted);border-radius:7px;display:grid;place-items:center;cursor:pointer;padding:0}
        .activities-search-clear:hover{background:var(--crm-surface-2);color:var(--crm-text)}
        .activities-toolbar-right{display:flex;align-items:center;gap:8px}
        .activities-filter-btn{height:40px}
        .activities-filter-count{min-width:18px;height:18px;border-radius:999px;background:var(--crm-primary);color:#fff;display:inline-grid;place-items:center;font-size:13px}

        .activities-filter-panel{border:1px solid var(--crm-border);background:var(--crm-surface);border-radius:12px;padding:12px;margin-bottom:13px;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;box-shadow:var(--crm-shadow)}
        .activities-filter-field{display:grid;gap:5px}
        .activities-filter-field label{font-size:13px;font-weight:400;color:var(--crm-muted)}
        .activities-filter-field select{height:37px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:8px;padding:0 10px;outline:0;font-size:13px}
        .activities-filter-clear{height:37px;align-self:end}

        .activities-error{white-space:pre-line;margin-bottom:12px;padding:10px 12px;border-radius:9px;background:color-mix(in srgb,var(--crm-danger) 10%,transparent);color:var(--crm-danger);font-size:13px}

        .activities-card{border:1px solid var(--crm-border);background:var(--crm-surface);border-radius:14px;overflow:auto;box-shadow:var(--crm-shadow)}
        .activities-table-wrap{width:100%;max-height:340px;overflow:auto;overscroll-behavior:contain;scrollbar-gutter:stable both-edges}.activities-table{width:100%;min-width:1450px;border-collapse:collapse;table-layout:auto}.activities-table th:nth-child(1),.activities-table td:nth-child(1){min-width:220px;width:220px}.activities-table th:nth-child(2),.activities-table td:nth-child(2){min-width:135px;width:135px}.activities-table th:nth-child(3),.activities-table td:nth-child(3){min-width:125px;width:125px}.activities-table th:nth-child(4),.activities-table td:nth-child(4){min-width:120px;width:120px}.activities-table th:nth-child(5),.activities-table td:nth-child(5){min-width:135px;width:135px}.activities-table th:nth-child(6),.activities-table td:nth-child(6){min-width:245px;width:245px}.activities-table th:nth-child(7),.activities-table td:nth-child(7){min-width:200px;width:200px}.activities-table th:nth-child(8),.activities-table td:nth-child(8){min-width:145px;width:145px}.activities-table th:nth-child(9),.activities-table td:nth-child(9){min-width:125px;width:125px}.activities-table th{position:sticky;top:0;z-index:3;text-align:left!important;min-width:100px;padding:13px 18px;white-space:nowrap}.activities-table th:last-child,.activities-table td:last-child{text-align:center}.activities-table tbody tr{height:56px}.activities-table td{white-space:nowrap}.activities-table th,.activities-table td{padding-left:18px;padding-right:18px}.activities-table .crm-assignee-name{white-space:nowrap;display:inline-flex;align-items:center;cursor:pointer}
        
        .activities-table td{border-top:1px solid var(--crm-border);padding:12px 14px;font-size:13px;color:var(--crm-text);vertical-align:middle}
        .activities-table tbody tr:hover{background:color-mix(in srgb,var(--crm-primary) 3%,transparent)}

        .activity-title-cell{display:flex;align-items:center;gap:9px;min-width:190px}
        .activity-title-icon{width:30px;height:30px;border-radius:8px;display:grid;place-items:center;background:color-mix(in srgb,var(--crm-primary) 9%,transparent);color:var(--crm-primary);flex:0 0 auto}
        .activity-title-main{font-weight:400;color:var(--crm-text);max-width:250px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .activity-title-desc{margin-top:2px;color:var(--crm-muted);font-size:13px;max-width:250px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .activity-muted{color:var(--crm-muted)}

        .activity-badge{display:inline-flex;align-items:center;justify-content:center;min-height:24px;padding:0 8px;border-radius:999px;font-size:13px;font-weight:400;letter-spacing:.03em;white-space:nowrap}
        .activity-badge.success{background:color-mix(in srgb,var(--crm-success) 11%,transparent);color:var(--crm-success)}
        .activity-badge.warning{background:color-mix(in srgb,var(--crm-warning) 12%,transparent);color:var(--crm-warning)}
        .activity-badge.danger{background:color-mix(in srgb,var(--crm-danger) 11%,transparent);color:var(--crm-danger)}
        .activity-badge.info{background:color-mix(in srgb,var(--crm-info) 11%,transparent);color:var(--crm-info)}
        .activity-badge.neutral{background:color-mix(in srgb,var(--crm-muted) 11%,transparent);color:var(--crm-muted)}

        .activity-due-overdue{color:var(--crm-danger);font-weight:400}
        .activity-assignee{display:flex;align-items:center;gap:7px;white-space:nowrap}
        .activity-avatar{width:27px;height:27px;border-radius:50%;display:grid;place-items:center;background:color-mix(in srgb,var(--crm-primary) 12%,transparent);color:var(--crm-primary);font-size:13px;font-weight:400}
        .activity-related-cell{display:grid;gap:3px;max-width:180px}
        .activity-related-type{font-size:13px;color:var(--crm-primary);font-weight:400}
        .activity-related-cell>span:last-child{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}

        .activity-tags{display:flex;align-items:center;gap:4px;flex-wrap:wrap;max-width:180px}
        .activity-tag{padding:4px 7px;border-radius:6px;background:var(--crm-surface-2);color:var(--crm-muted);font-size:13px}

        .activities-actions{display:flex;align-items:center;gap:5px}
        .activities-icon-btn{width:29px;height:29px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-muted);border-radius:8px;display:grid;place-items:center;cursor:pointer;padding:0}
        .activities-icon-btn:hover{border-color:var(--crm-primary);color:var(--crm-primary);background:var(--crm-surface-2)}
        .activities-icon-btn.complete:hover{border-color:var(--crm-success);color:var(--crm-success)}
        .activities-icon-btn.delete:hover{border-color:var(--crm-danger);color:var(--crm-danger)}

        .activities-empty{padding:48px 20px;text-align:center;color:var(--crm-muted);font-size:13px}
        .activities-pagination{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:13px 15px;border-top:1px solid var(--crm-border);font-size:13px;color:var(--crm-muted)}
        .activities-pagination-actions{display:flex;align-items:center;gap:7px}
        .activities-pagination-btn{height:32px;padding:0 10px}

        .activities-modal-backdrop{position:fixed;inset:0;background:rgba(15,23,42,.48);display:grid;place-items:center;padding:20px;z-index:600}
        .activities-modal{width:min(820px,100%);max-height:91vh;overflow:auto;background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:15px;box-shadow:0 25px 70px rgba(0,0,0,.22)}
        .activities-modal-head{display:flex;justify-content:space-between;align-items:center;padding:17px 20px;border-bottom:1px solid var(--crm-border);position:sticky;top:0;background:var(--crm-surface);z-index:4}
        .activities-modal-title{margin:0;color:var(--crm-text);font-size:16px;font-weight:400}
        .activities-modal-close{width:32px;height:32px;border:0;background:transparent;color:var(--crm-muted);border-radius:8px;display:grid;place-items:center;cursor:pointer}
        .activities-modal-close:hover{background:var(--crm-surface-2);color:var(--crm-text)}

        .activities-form{padding:20px;display:grid;grid-template-columns:1fr 1fr;gap:14px}
        .activities-field{display:grid;gap:6px;min-width:0}
        .activities-field.full{grid-column:1/-1}
        .activities-field label{font-size:13px;font-weight:400;color:var(--crm-text)}
        .activities-field input,.activities-field select,.activities-field textarea{width:100%;box-sizing:border-box;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:9px;padding:10px 11px;outline:0;font:inherit;font-size:13px}
        .activities-field textarea{resize:vertical;min-height:95px}
        .activities-field input::placeholder,.activities-field textarea::placeholder{color:var(--crm-muted)}
        .activities-field input:focus,.activities-field select:focus,.activities-field textarea:focus{border-color:var(--crm-primary)}
        .activities-field-help{font-size:13px;color:var(--crm-muted)}

        .activities-modal-foot{display:flex;justify-content:flex-end;gap:8px;padding:14px 20px;border-top:1px solid var(--crm-border);position:sticky;bottom:0;background:var(--crm-surface);z-index:4}

        .activities-custom-select{position:relative}
        .activities-custom-trigger{width:100%;min-height:39px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:9px;padding:8px 36px 8px 11px;display:flex;align-items:center;text-align:left;position:relative;cursor:pointer;font-size:13px}
        .activities-custom-trigger .activities-chevron{position:absolute;right:10px;color:var(--crm-muted)}
        .activities-custom-menu{position:absolute;left:0;right:0;top:calc(100% + 5px);background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:10px;box-shadow:0 18px 45px rgba(0,0,0,.18);z-index:20;overflow:hidden}
        .activities-member-search{padding:8px;border-bottom:1px solid var(--crm-border)}
        .activities-member-search input{width:100%;box-sizing:border-box;height:34px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:7px;padding:0 9px;font-size:13px;outline:0}
        .activities-option-list{max-height:190px;overflow:auto}
        .activities-option{width:100%;border:0;background:transparent;color:var(--crm-text);padding:9px 10px;display:flex;align-items:center;gap:8px;text-align:left;cursor:pointer;font-size:13px}
        .activities-option:hover{background:var(--crm-surface-2)}
        .activities-option.active{background:color-mix(in srgb,var(--crm-primary) 8%,transparent)}
        .activities-option-avatar{width:25px;height:25px;border-radius:50%;background:color-mix(in srgb,var(--crm-primary) 12%,transparent);color:var(--crm-primary);display:grid;place-items:center;font-size:13px;font-weight:400;flex:0 0 auto}
        .activities-option-info{min-width:0;display:flex;flex-direction:column;align-items:flex-start;gap:2px}
        .activities-option-name{font-weight:400;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .activities-option-email{font-size:13px;color:var(--crm-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}

        .activities-tags-control{position:relative}
        .activities-tags-trigger{min-height:39px;width:100%;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:9px;padding:7px 36px 7px 9px;display:flex;align-items:center;gap:5px;flex-wrap:wrap;position:relative;cursor:pointer}
        .activities-tags-trigger-chevron{position:absolute;right:10px;color:var(--crm-muted)}
        .activities-tag-chip{padding:4px 7px;border-radius:6px;background:color-mix(in srgb,var(--crm-primary) 9%,transparent);color:var(--crm-primary);font-size:13px;font-weight:400}
        .activities-tags-menu{position:absolute;left:0;right:0;top:calc(100% + 5px);background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:10px;box-shadow:0 18px 45px rgba(0,0,0,.18);z-index:25;max-height:220px;overflow:auto;padding:5px}
        .activities-tag-option{width:100%;border:0;background:transparent;color:var(--crm-text);padding:8px 9px;border-radius:7px;display:flex;align-items:center;gap:8px;text-align:left;cursor:pointer;font-size:13px}
        .activities-tag-option:hover{background:var(--crm-surface-2)}
        .activities-tag-check{width:18px;height:18px;border:1px solid var(--crm-border);border-radius:5px;display:grid;place-items:center;color:transparent}
        .activities-tag-option.selected .activities-tag-check{background:var(--crm-primary);border-color:var(--crm-primary);color:#fff}

        .activities-related-search{display:flex;gap:7px;margin-bottom:7px}
        .activities-related-search input{flex:1}
        .activities-related-options{max-height:150px;overflow:auto;border:1px solid var(--crm-border);border-radius:8px}
        .activities-related-option{width:100%;border:0;border-bottom:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);padding:9px;text-align:left;cursor:pointer;font-size:13px}
        .activities-related-option:last-child{border-bottom:0}
        .activities-related-option:hover{background:var(--crm-surface-2)}
        .activities-related-selected{margin-top:6px;padding:8px 10px;border:1px solid color-mix(in srgb,var(--crm-primary) 35%,var(--crm-border));border-radius:8px;background:color-mix(in srgb,var(--crm-primary) 5%,transparent);color:var(--crm-text);font-size:13px}

        .activities-view-grid{padding:20px;display:grid;grid-template-columns:1fr 1fr;gap:15px}
        .activities-view-item{display:grid;gap:5px}
        .activities-view-item.full{grid-column:1/-1}
        .activities-view-label{font-size:13px;font-weight:400;color:var(--crm-muted);text-transform:uppercase;letter-spacing:.04em}
        .activities-view-value{font-size:13px;color:var(--crm-text);white-space:pre-wrap;word-break:break-word}

        .activities-view-tags{display:flex;align-items:center;gap:4px;flex-wrap:wrap}
        .activities-outcome{padding:10px 11px;border:1px solid var(--crm-border);border-radius:9px;background:var(--crm-surface-2);white-space:pre-wrap}

        .activities-table .crm-assignee-name{white-space:nowrap;display:inline-flex;align-items:center;cursor:pointer}@media(max-width:900px){
          .activities-stats{grid-template-columns:repeat(3,minmax(0,1fr))}
          .activities-filter-panel{grid-template-columns:repeat(2,minmax(0,1fr))}
        }

        @media(max-width:700px){
          .activities-page{padding:18px 14px 30px}
          .activities-head{align-items:flex-start;flex-direction:column}
          .activities-head-actions{width:100%}
          .activities-head-actions .activities-btn{flex:1}
          .activities-stats{grid-template-columns:1fr 1fr}
          .activities-toolbar{align-items:stretch;flex-direction:column}
          .activities-toolbar-right{justify-content:space-between}
          .activities-search-wrap{max-width:none}
          .activities-filter-panel{grid-template-columns:1fr}
          .activities-form{grid-template-columns:1fr}
          .activities-field.full{grid-column:auto}
          .activities-view-grid{grid-template-columns:1fr}
          .activities-view-item.full{grid-column:auto}
          .activities-pagination{align-items:flex-start;flex-direction:column}
        }
      .activities-table thead th{text-align:left!important;padding-left:20px;padding-right:20px;white-space:nowrap}.activities-table tbody td{padding-left:20px;padding-right:20px}.activities-table td:last-child{text-align:center}`}</style>

      <div className="activities-head">
        <div className="activities-head-left">
          <h1 className="activities-title">Activities</h1>

          <p className="activities-subtitle">Plan, track and manage your CRM activities from one place.</p>
        </div>

        <div className="activities-head-actions">
          <button type="button" className="activities-btn" onClick={() => loadActivities(pagination.page || 1, search, status, type, assignedTo)} disabled={loading}>
            <RefreshCw size={14} />
            Refresh
          </button>

          <button type="button" className="activities-btn primary" onClick={openCreate} disabled={businessLoading}>
            <Plus size={14} />
            Add Activity
          </button>
        </div>
      </div>

      {businessError || error ? <div className="activities-error">{error || businessError}</div> : null}

      <div className="activities-stats">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div className="activities-stat" key={stat.title}>
              <div className="activities-stat-top">
                <div className={`activities-stat-icon ${stat.tone || ""}`}>
                  <Icon size={15} />
                </div>

                <div className="activities-stat-value">{stat.value}</div>
              </div>

              <div className="activities-stat-title">{stat.title}</div>

              <div className="activities-stat-detail">{stat.detail}</div>
            </div>
          );
        })}
      </div>

      <div className="activities-toolbar">
        <div className="activities-search-wrap">
          <Search size={16} className="activities-search-icon" />

          <input
            className="activities-search"
            value={search}
            onChange={(event) => {
              const value = event.target.value;

              setSearch(value);

              loadActivities(1, value, status, type, assignedTo);
            }}
            placeholder="Search activities..."
          />

          {search ? (
            <button type="button" className="activities-search-clear" onClick={clearSearch} title="Clear search" aria-label="Clear search">
              <X size={14} />
            </button>
          ) : null}
        </div>

        <div className="activities-toolbar-right">
          <button type="button" className="activities-btn activities-filter-btn" onClick={() => setFilterOpen((value) => !value)}>
            <Filter size={14} />
            Filters
            {activeFilterCount > 0 ? <span className="activities-filter-count">{activeFilterCount}</span> : null}
          </button>
        </div>
      </div>

      {filterOpen ? (
        <div className="activities-filter-panel">
          <div className="activities-filter-field">
            <label>Status</label>

            <select
              value={status}
              onChange={(event) => {
                const value = event.target.value;

                setStatus(value);

                loadActivities(1, search, value, type, assignedTo);
              }}>
              <option value="">All statuses</option>

              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="activities-filter-field">
            <label>Type</label>

            <select
              value={type}
              onChange={(event) => {
                const value = event.target.value;

                setType(value);

                loadActivities(1, search, status, value, assignedTo);
              }}>
              <option value="">All types</option>

              {TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="activities-filter-field">
            <label>Assigned user</label>

            <select
              value={assignedTo}
              onChange={(event) => {
                const value = event.target.value;

                setAssignedTo(value);

                loadActivities(1, search, status, type, value);
              }}>
              <option value="">All users</option>

              {members.map((member) => (
                <option key={getMemberId(member)} value={getMemberId(member)}>
                  {getMemberName(member)}
                </option>
              ))}
            </select>
          </div>

          <button type="button" className="activities-btn activities-filter-clear" onClick={resetFilters} disabled={!activeFilterCount}>
            Clear filters
          </button>
        </div>
      ) : null}

      <div className="activities-card">
        <div className="activities-table-wrap">
          <table className="activities-table">
            <thead>
              <tr>
                <th>Activity</th>

                <th>Type</th>

                <th>Status</th>

                <th>Priority</th>

                <th>Due</th>

                <th>Assigned to</th>

                <th>Related to</th>

                <th>Tags</th>

                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading || businessLoading ? (
                <tr>
                  <td colSpan={9}>
                    <div className="activities-empty">Loading activities...</div>
                  </td>
                </tr>
              ) : activities.length === 0 ? (
                <tr>
                  <td colSpan={9}>
                    <div className="activities-empty">No activities found.</div>
                  </td>
                </tr>
              ) : (
                activities.map((activity) => {
                  const assignedName = String(getAssignedUserName(activity) || "Unassigned");

                  const initials = getInitials(assignedName);

                  const Icon = getTypeIcon(activity.type);

                  return (
                    <tr key={activity._id}>
                      <td>
                        <div className="activity-title-cell">
                          <div className="activity-title-icon">
                            <Icon size={14} />
                          </div>

                          <div>
                            <div className="activity-title-main">{activity.subject || "Untitled activity"}</div>

                            {activity.description ? <div className="activity-title-desc">{activity.description}</div> : null}
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="activity-badge info">{labelFor(TYPE_OPTIONS, activity.type)}</span>
                      </td>

                      <td>
                        <span className={`activity-badge ${getStatusClass(activity.status)}`}>{labelFor(STATUS_OPTIONS, activity.status)}</span>
                      </td>

                      <td>
                        <span className={`activity-badge ${getPriorityClass(activity.priority)}`}>{labelFor(PRIORITY_OPTIONS, activity.priority)}</span>
                      </td>

                      <td>
                        <span className={isOverdue(activity) ? "activity-due-overdue" : ""}>{formatDate(activity.dueAt)}</span>
                      </td>

                      <td>
                        <div className="activity-assignee">
                          <span className="activity-avatar">{initials}</span>

                          <button type="button" className="crm-assignee-name" onClick={() => activity?.assignedTo && typeof activity.assignedTo === "object" && setAssigneeDetail({ type: "user", name: assignedName, email: activity?.assignedTo?.email || "" })}>
                            {assignedName}
                          </button>
                        </div>
                      </td>

                      <td>{renderRelated(activity)}</td>

                      <td>
                        <div className="activity-tags">
                          {Array.isArray(activity.tags) && activity.tags.length ? (
                            activity.tags.slice(0, 3).map((tag) => (
                              <span className="activity-tag" key={getTagId(tag)}>
                                {getTagName(tag)}
                              </span>
                            ))
                          ) : (
                            <span className="activity-muted">—</span>
                          )}

                          {Array.isArray(activity.tags) && activity.tags.length > 3 ? <span className="activity-tag">+{activity.tags.length - 3}</span> : null}
                        </div>
                      </td>

                      <td>
                        <div className="activities-actions">
                          <button type="button" className="activities-icon-btn" title="View" onClick={() => openView(activity)}>
                            <Eye size={14} />
                          </button>

                          <button type="button" className="activities-icon-btn" title="Edit" onClick={() => openEdit(activity)}>
                            <Pencil size={14} />
                          </button>

                          {activity.status !== "COMPLETED" ? (
                            <button type="button" className="activities-icon-btn complete" title="Complete" onClick={() => handleComplete(activity)}>
                              <Check size={14} />
                            </button>
                          ) : null}

                          {canManage && (
                            <button type="button" className="activities-icon-btn delete" title="Delete" onClick={() => handleDelete(activity)}>
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

        <div className="activities-pagination">
          <span>{pagination.total ?? activities.length} total</span>

          <div className="activities-pagination-actions">
            <button type="button" className="activities-btn activities-pagination-btn" disabled={loading || (pagination.page || 1) <= 1} onClick={() => loadActivities((pagination.page || 1) - 1, search, status, type, assignedTo)}>
              <ChevronLeft size={13} />
              Previous
            </button>

            <span>
              Page {pagination.page || 1} / {pagination.totalPages || 1}
            </span>

            <button type="button" className="activities-btn activities-pagination-btn" disabled={loading || (pagination.page || 1) >= (pagination.totalPages || 1)} onClick={() => loadActivities((pagination.page || 1) + 1, search, status, type, assignedTo)}>
              Next
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {modal ? (
        <div
          className="activities-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !saving) {
              setModal(null);
            }
          }}>
          <div className="activities-modal">
            <div className="activities-modal-head">
              <h2 className="activities-modal-title">{modal.mode === "create" ? "Add Activity" : modal.mode === "edit" ? "Edit Activity" : "Activity details"}</h2>

              <button type="button" className="activities-modal-close" disabled={saving} onClick={() => !saving && setModal(null)}>
                <X size={17} />
              </button>
            </div>

            {modal.mode === "view" ? (
              <>
                <div className="activities-view-grid">
                  <div className="activities-view-item">
                    <div className="activities-view-label">Subject</div>

                    <div className="activities-view-value">{modal.activity?.subject || "—"}</div>
                  </div>

                  <div className="activities-view-item">
                    <div className="activities-view-label">Type</div>

                    <div className="activities-view-value">
                      <span className="activity-badge info">{labelFor(TYPE_OPTIONS, modal.activity?.type)}</span>
                    </div>
                  </div>

                  <div className="activities-view-item">
                    <div className="activities-view-label">Status</div>

                    <div className="activities-view-value">
                      <span className={`activity-badge ${getStatusClass(modal.activity?.status)}`}>{labelFor(STATUS_OPTIONS, modal.activity?.status)}</span>
                    </div>
                  </div>

                  <div className="activities-view-item">
                    <div className="activities-view-label">Priority</div>

                    <div className="activities-view-value">
                      <span className={`activity-badge ${getPriorityClass(modal.activity?.priority)}`}>{labelFor(PRIORITY_OPTIONS, modal.activity?.priority)}</span>
                    </div>
                  </div>

                  <div className="activities-view-item">
                    <div className="activities-view-label">Due date</div>

                    <div className="activities-view-value">{formatDateTime(modal.activity?.dueAt)}</div>
                  </div>

                  <div className="activities-view-item">
                    <div className="activities-view-label">Assigned to</div>

                    <div className="activities-view-value">{getAssignedUserName(modal.activity)}</div>
                  </div>

                  <div className="activities-view-item">
                    <div className="activities-view-label">Related record</div>

                    <div className="activities-view-value">{renderRelated(modal.activity)}</div>
                  </div>

                  <div className="activities-view-item">
                    <div className="activities-view-label">Location</div>

                    <div className="activities-view-value">{modal.activity?.location || "—"}</div>
                  </div>

                  <div className="activities-view-item">
                    <div className="activities-view-label">Reminder</div>

                    <div className="activities-view-value">{formatDateTime(modal.activity?.reminderAt)}</div>
                  </div>

                  <div className="activities-view-item">
                    <div className="activities-view-label">Completed at</div>

                    <div className="activities-view-value">{formatDateTime(modal.activity?.completedAt)}</div>
                  </div>

                  <div className="activities-view-item full">
                    <div className="activities-view-label">Description</div>

                    <div className="activities-view-value">{modal.activity?.description || "—"}</div>
                  </div>

                  <div className="activities-view-item full">
                    <div className="activities-view-label">Outcome</div>

                    <div className="activities-view-value">
                      <div className="activities-outcome">{modal.activity?.outcome || "—"}</div>
                    </div>
                  </div>

                  <div className="activities-view-item full">
                    <div className="activities-view-label">Tags</div>

                    <div className="activities-view-value">
                      <div className="activities-view-tags">
                        {Array.isArray(modal.activity?.tags) && modal.activity.tags.length
                          ? modal.activity.tags.map((tag) => (
                              <span className="activity-tag" key={getTagId(tag)}>
                                {getTagName(tag)}
                              </span>
                            ))
                          : "—"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="activities-modal-foot">
                  <button type="button" className="activities-btn" onClick={() => setModal(null)}>
                    Close
                  </button>

                  {modal.activity?.status !== "COMPLETED" ? (
                    <button type="button" className="activities-btn" onClick={() => handleComplete(modal.activity)}>
                      <Check size={14} />
                      Complete
                    </button>
                  ) : null}

                  <button type="button" className="activities-btn primary" onClick={() => openEdit(modal.activity)}>
                    <Pencil size={14} />
                    Edit
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="activities-form">
                  <div className="activities-field full">
                    <label>Subject *</label>

                    <input value={form.subject} onChange={(event) => updateForm("subject", event.target.value)} placeholder="Enter activity subject" maxLength={200} />
                  </div>

                  <div className="activities-field">
                    <label>Activity type</label>

                    <select value={form.type} onChange={(event) => updateForm("type", event.target.value)}>
                      {TYPE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="activities-field">
                    <label>Status</label>

                    <select value={form.status} onChange={(event) => updateForm("status", event.target.value)}>
                      {STATUS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="activities-field">
                    <label>Priority</label>

                    <select value={form.priority} onChange={(event) => updateForm("priority", event.target.value)}>
                      {PRIORITY_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="activities-field">
                    <label>Due date</label>

                    <input type="datetime-local" value={form.dueAt} onChange={(event) => updateForm("dueAt", event.target.value)} />
                  </div>

                  <div className="activities-field" ref={memberDropdownRef}>
                    <label>Assigned user</label>

                    <div className="activities-custom-select">
                      <button
                        type="button"
                        className="activities-custom-trigger"
                        onClick={() => {
                          setMemberDropdownOpen((value) => !value);

                          setTagDropdownOpen(false);
                        }}>
                        {selectedMember ? getMemberName(selectedMember) : "Unassigned"}

                        <ChevronDown className="activities-chevron" size={14} />
                      </button>

                      {memberDropdownOpen ? (
                        <div className="activities-custom-menu">
                          <div className="activities-member-search">
                            <input value={memberSearch} onChange={(event) => setMemberSearch(event.target.value)} placeholder="Search name or email..." autoFocus />
                          </div>

                          <div className="activities-option-list">
                            <button
                              type="button"
                              className="activities-option"
                              onClick={() => {
                                updateForm("assignedTo", "");

                                setMemberDropdownOpen(false);
                              }}>
                              <span className="activities-option-avatar">—</span>

                              <span className="activities-option-info">
                                <span className="activities-option-name">Unassigned</span>
                              </span>
                            </button>

                            {optionsLoading ? (
                              <div className="activities-empty">Loading users...</div>
                            ) : filteredMembers.length === 0 ? (
                              <div className="activities-empty">No users found.</div>
                            ) : (
                              filteredMembers.map((member) => {
                                const memberId = getMemberId(member);

                                const memberName = getMemberName(member);

                                const memberEmail = getMemberEmail(member);

                                const initials = getInitials(memberName);

                                return (
                                  <button
                                    type="button"
                                    className={`activities-option ${form.assignedTo === memberId ? "active" : ""}`}
                                    key={memberId}
                                    onClick={() => {
                                      updateForm("assignedTo", memberId);

                                      setMemberDropdownOpen(false);
                                    }}>
                                    <span className="activities-option-avatar">{initials || "U"}</span>

                                    <span className="activities-option-info">
                                      <span className="activities-option-name">{memberName}</span>

                                      {memberEmail ? <span className="activities-option-email">{memberEmail}</span> : null}
                                    </span>

                                    {form.assignedTo === memberId ? <Check size={13} /> : null}
                                  </button>
                                );
                              })
                            )}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="activities-field">
                    <label>Related record</label>

                    <select value={relatedType} onChange={(event) => handleRelatedTypeChange(event.target.value)}>
                      {RELATED_TYPE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {relatedType ? (
                    <div className="activities-field full">
                      <label>Select {labelFor(RELATED_TYPE_OPTIONS, relatedType)}</label>

                      <div className="activities-related-search">
                        <input
                          value={relatedSearch}
                          onChange={(event) => {
                            const value = event.target.value;

                            setRelatedSearch(value);

                            loadRelatedOptions(relatedType, value);
                          }}
                          placeholder={`Search ${relatedType.toLowerCase()}...`}
                        />

                        <button type="button" className="activities-btn" onClick={() => loadRelatedOptions(relatedType, relatedSearch)}>
                          <Search size={13} />
                        </button>

                        {form.contactId || form.companyId || form.leadId || form.dealId ? (
                          <button type="button" className="activities-btn" onClick={clearRelated} title="Clear related record">
                            <X size={13} />
                          </button>
                        ) : null}
                      </div>

                      {selectedRelated ? (
                        <div className="activities-related-selected">
                          Selected: <strong>{getRelatedLabel(relatedType, selectedRelated)}</strong>
                        </div>
                      ) : null}

                      {relatedLoading ? (
                        <div className="activities-field-help">Loading records...</div>
                      ) : relatedOptions.length ? (
                        <div className="activities-related-options">
                          {relatedOptions.map((item) => {
                            const id = getId(item);

                            return (
                              <button type="button" className="activities-related-option" key={id} onClick={() => selectRelated(item)}>
                                {getRelatedLabel(relatedType, item)}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="activities-field-help">No matching records found.</div>
                      )}
                    </div>
                  ) : null}

                  <div className="activities-field">
                    <label>Location</label>

                    <input value={form.location} onChange={(event) => updateForm("location", event.target.value)} placeholder="Add location" maxLength={500} />
                  </div>

                  <div className="activities-field">
                    <label>Reminder</label>

                    <input type="datetime-local" value={form.reminderAt} onChange={(event) => updateForm("reminderAt", event.target.value)} />
                  </div>

                  <div className="activities-field full" ref={tagDropdownRef}>
                    <label>Tags</label>

                    <div className="activities-tags-control">
                      <button
                        type="button"
                        className="activities-tags-trigger"
                        onClick={() => {
                          setTagDropdownOpen((value) => !value);

                          setMemberDropdownOpen(false);
                        }}>
                        {selectedTags.length ? (
                          selectedTags.map((tag) => (
                            <span className="activities-tag-chip" key={getTagId(tag)}>
                              {getTagName(tag)}
                            </span>
                          ))
                        ) : (
                          <span className="activity-muted">Select tags</span>
                        )}

                        <ChevronDown className="activities-tags-trigger-chevron" size={14} />
                      </button>

                      {tagDropdownOpen ? (
                        <div className="activities-tags-menu">
                          {tags.length === 0 ? (
                            <div className="activities-empty">No tags available.</div>
                          ) : (
                            tags.map((tag) => {
                              const id = getTagId(tag);

                              const selected = (form.tags || []).map(String).includes(String(id));

                              return (
                                <button type="button" className={`activities-tag-option ${selected ? "selected" : ""}`} key={id} onClick={() => toggleTag(id)}>
                                  <span className="activities-tag-check">{selected ? <Check size={11} /> : null}</span>

                                  <span>{getTagName(tag)}</span>
                                </button>
                              );
                            })
                          )}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="activities-field full">
                    <label>Outcome</label>

                    <textarea value={form.outcome} onChange={(event) => updateForm("outcome", event.target.value)} placeholder="Add activity outcome..." maxLength={2000} />
                  </div>

                  <div className="activities-field full">
                    <label>Description</label>

                    <textarea value={form.description} onChange={(event) => updateForm("description", event.target.value)} placeholder="Add activity details..." maxLength={5000} />
                  </div>
                </div>

                <div className="activities-modal-foot">
                  <button type="button" className="activities-btn" disabled={saving} onClick={() => !saving && setModal(null)}>
                    Cancel
                  </button>

                  <button type="button" className="activities-btn primary" disabled={saving || optionsLoading} onClick={saveActivity}>
                    {saving ? (
                      "Saving..."
                    ) : modal.mode === "create" ? (
                      <>
                        <Plus size={14} />
                        Create Activity
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
            )}
          </div>
        </div>
      ) : null}
      {assigneeDetail ? <AssigneeDetailsPopup detail={assigneeDetail} onClose={() => setAssigneeDetail(null)} /> : null}
    </div>
  );
}

export default Activities;
