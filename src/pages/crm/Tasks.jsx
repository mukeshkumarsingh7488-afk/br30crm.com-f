import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Check, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, Eye, Filter, Pencil, Plus, RefreshCw, Search, Tag, Trash2, UserCheck, X } from "lucide-react";

import useBusiness from "../../hooks/useBusiness";
import AssigneeDetailsPopup from "../../components/crm/AssigneeDetailsPopup";
import { isManagementRole } from "../../utils/permissions";

import { assignTask, completeTask, createTask, deleteTask, getTaskById, getTasks, updateTask } from "../../api/task.api";

import { getAssignmentMembers } from "../../api/crm.api";
import api from "../../api/api";

import { showAuthAlert } from "../../components/auth/authAlert";

const STATUS_OPTIONS = [
  { value: "TODO", label: "To do" },
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
  title: "",
  description: "",
  status: "TODO",
  priority: "MEDIUM",
  dueDate: "",
  assignedTo: "",
  relatedToType: "",
  relatedToId: "",
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

  if (member?.userId && typeof member.userId === "object") {
    return member.userId?._id || member.userId?.id || "";
  }

  return member?.userId || "";
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
    return tag;
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

const labelFor = (options, value) => options.find((item) => item.value === value)?.label || value || "—";

function Tasks() {
  const { businessId, loading: businessLoading, error: businessError, role, isBusinessOwner } = useBusiness();
  const canManage = isManagementRole({ role, isBusinessOwner });
    const [assigneeDetail, setAssigneeDetail] = useState(null);

  const [tasks, setTasks] = useState([]);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
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
  const [relatedRecords, setRelatedRecords] = useState({});

  const memberDropdownRef = useRef(null);
  const tagDropdownRef = useRef(null);

  const activeFilterCount = useMemo(() => {
    return [status, priority, assignedTo].filter(Boolean).length;
  }, [status, priority, assignedTo]);

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

  const loadTasks = useCallback(
    async (page = 1, nextSearch = search, nextStatus = status, nextPriority = priority, nextAssignedTo = assignedTo) => {
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

        if (nextPriority) {
          params.priority = nextPriority;
        }

        if (nextAssignedTo) {
          params.assignedTo = nextAssignedTo;
        }

        params.sortBy = "createdAt";
        params.sortOrder = "desc";

        const response = await getTasks(businessId, params);

        const data = unwrap(response);

        const rows = extractRows(response, ["items", "tasks", "results"]);

        setTasks(Array.isArray(rows) ? rows : []);

        setPagination(
          data?.pagination || {
            page,
            limit: pagination.limit || 10,
            total: rows.length,
            totalPages: 1,
          }
        );
      } catch (err) {
        const message = getErrorMessage(err, "Unable to load tasks.");

        setTasks([]);
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [businessId, pagination.limit, search, status, priority, assignedTo]
  );

  useEffect(() => {
    if (!businessId) return;

    loadOptions();
    loadTasks(1);
  }, [businessId]);

  useEffect(() => {
    if (!businessId || !tasks.length) return;

    let cancelled = false;

    const loadRelatedRecordNames = async () => {
      const needed = [];
      for (const task of tasks) {
        const type = task?.relatedTo?.type || "";
        const rawId = task?.relatedTo?.id;
        const id = rawId?._id || rawId?.id || rawId || "";
        if (!type || !id || typeof id !== "string") continue;
        if (rawId && typeof rawId === "object" && (rawId.name || rawId.firstName || rawId.title || rawId.legalName)) continue;
        const key = `${type}:${id}`;
        if (!relatedRecords[key]) needed.push({ type, id, key });
      }

      if (!needed.length) return;

      const endpointFor = (type, id) => {
        if (type === "LEAD") return `/leads/business/${businessId}/${id}`;
        if (type === "CONTACT") return `/contacts/business/${businessId}/${id}`;
        if (type === "COMPANY") return `/companies/business/${businessId}/${id}`;
        if (type === "DEAL") return `/deals/business/${businessId}/${id}`;
        return null;
      };

      const entries = await Promise.all(
        needed.map(async ({ type, id, key }) => {
          try {
            const endpoint = endpointFor(type, id);
            if (!endpoint) return null;
            const response = await api.get(endpoint);
            const data = unwrap(response);
            const record = data?.lead || data?.contact || data?.company || data?.deal || data;
            return record && typeof record === "object" ? [key, record] : null;
          } catch {
            return null;
          }
        })
      );

      if (cancelled) return;
      setRelatedRecords((current) => {
        const next = { ...current };
        entries.filter(Boolean).forEach(([key, record]) => {
          next[key] = record;
        });
        return next;
      });
    };

    loadRelatedRecordNames();
    return () => {
      cancelled = true;
    };
  }, [businessId, tasks, relatedRecords]);

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
    setPriority("");
    setAssignedTo("");

    loadTasks(1, search, "", "", "");
  };

  const clearSearch = () => {
    setSearch("");

    loadTasks(1, "", status, priority, assignedTo);
  };

  const openCreate = async () => {
    setError("");

    setMemberSearch("");
    setMemberDropdownOpen(false);
    setTagDropdownOpen(false);
    setRelatedSearch("");

    setForm({
      ...EMPTY_FORM,
      tags: [],
    });

    setRelatedOptions([]);

    setModal({
      mode: "create",
    });

    if (!members.length || !tags.length) {
      try {
        await loadOptions();
      } catch (error) {
        console.error("Unable to load task options:", error);
      }
    }
  };

  const openView = async (task) => {
    if (!businessId || !task?._id) return;

    setSaving(true);
    setError("");

    try {
      const response = await getTaskById(businessId, task._id);

      const data = unwrap(response);

      const currentTask = data?.task || data || task;

      setModal({
        mode: "view",
        task: currentTask,
      });
    } catch (err) {
      await showError("Unable to open task", getErrorMessage(err, "Unable to load task details."));
    } finally {
      setSaving(false);
    }
  };

  const openEdit = (task) => {
    if (!task?._id) {
      showError("Unable to edit task", "Task ID is missing.");
      return;
    }

    const relatedType = task?.relatedTo?.type || "";

    const relatedId = task?.relatedTo?.id?._id || task?.relatedTo?.id?.id || task?.relatedTo?.id || "";

    const assignedId = task?.assignedTo?._id || task?.assignedTo?.id || task?.assignedTo || "";

    const taskTags = Array.isArray(task?.tags) ? task.tags.map(getTagId).filter(Boolean) : [];

    setError("");

    setSaving(false);

    setForm({
      title: task?.title || "",
      description: task?.description || "",
      status: task?.status || "TODO",
      priority: task?.priority || "MEDIUM",
      dueDate: formatDateTimeLocal(task?.dueDate),
      assignedTo: assignedId,
      relatedToType: relatedType,
      relatedToId: relatedId,
      tags: taskTags,
    });

    setMemberSearch("");
    setMemberDropdownOpen(false);
    setTagDropdownOpen(false);
    setRelatedSearch("");

    setModal({
      mode: "edit",
      task,
    });

    if (!members.length || !tags.length) {
      loadOptions().catch(() => {});
    }

    if (relatedType) {
      loadRelatedOptions(relatedType, "").catch(() => {});
    } else {
      setRelatedOptions([]);
    }
  };

  const validateForm = () => {
    if (!String(form.title || "").trim()) {
      return "Task title is required.";
    }

    if (form.relatedToType && !form.relatedToId) {
      return "Please select the related record.";
    }

    return "";
  };

  const buildPayload = () => {
    const payload = {
      title: String(form.title || "").trim(),
      description: String(form.description || "").trim() || null,
      status: form.status || "TODO",
      priority: form.priority || "MEDIUM",
      dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
      assignedTo: form.assignedTo || null,
      tags: Array.isArray(form.tags) ? form.tags.filter(Boolean) : [],
    };

    if (form.relatedToType && form.relatedToId) {
      payload.relatedTo = {
        type: form.relatedToType,
        id: form.relatedToId,
      };
    } else {
      payload.relatedTo = null;
    }

    return payload;
  };

  const saveTask = async () => {
    if (!businessId || !modal) return;

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);

      await showAuthAlert({
        icon: "warning",
        title: "Validation required",
        text: validationError,
        confirmButtonText: "OK",
      });

      return;
    }

    setSaving(true);
    setError("");

    try {
      const payload = buildPayload();

      if (modal.mode === "create") {
        await createTask(businessId, payload);
      } else if (modal.mode === "edit") {
        await updateTask(businessId, modal.task._id, payload);
      }

      setModal(null);

      await loadTasks(modal.mode === "create" ? 1 : pagination.page, search, status, priority, assignedTo);

      await showSuccess(modal.mode === "create" ? "Task Created" : "Task Updated", modal.mode === "create" ? "Task created successfully." : "Task updated successfully.");
    } catch (err) {
      const message = getErrorMessage(err, modal.mode === "create" ? "Unable to create task." : "Unable to update task.");

      setError(message);

      await showError(modal.mode === "create" ? "Unable to create task" : "Unable to update task", message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (task) => {
    if (!businessId || !task?._id) return;

    const result = await showAuthAlert({
      icon: "warning",
      title: "Delete task?",
      text: "Are you sure you want to delete this task? This action cannot be undone.",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (!result?.isConfirmed) return;

    try {
      await deleteTask(businessId, task._id);

      const currentPage = pagination.page || 1;

      const shouldGoBack = tasks.length === 1 && currentPage > 1;

      await loadTasks(shouldGoBack ? currentPage - 1 : currentPage, search, status, priority, assignedTo);

      await showSuccess("Task Deleted", "Task deleted successfully.");
    } catch (err) {
      await showError("Unable to delete task", getErrorMessage(err, "Unable to delete task."));
    }
  };

  const handleAssign = async (task, memberId) => {
    if (!businessId || !task?._id || !memberId) {
      return;
    }

    try {
      await assignTask(businessId, task._id, memberId);

      await loadTasks(pagination.page || 1, search, status, priority, assignedTo);

      await showSuccess("Task Assigned", "Task assigned successfully.");
    } catch (err) {
      await showError("Unable to assign task", getErrorMessage(err, "Unable to assign task."));
    }
  };

  const handleComplete = async (task) => {
    if (!businessId || !task?._id) return;

    if (task.status === "COMPLETED") {
      return;
    }

    const result = await showAuthAlert({
      icon: "question",
      title: "Complete task?",
      text: "Mark this task as completed?",
      showCancelButton: true,
      confirmButtonText: "Complete",
      cancelButtonText: "Cancel",
    });

    if (!result?.isConfirmed) return;

    try {
      await completeTask(businessId, task._id);

      await loadTasks(pagination.page || 1, search, status, priority, assignedTo);

      await showSuccess("Task Completed", "Task marked as completed.");
    } catch (err) {
      await showError("Unable to complete task", getErrorMessage(err, "Unable to complete task."));
    }
  };

  const loadRelatedOptions = async (type, query = "") => {
    if (!businessId || !type) {
      setRelatedOptions([]);
      return;
    }

    setRelatedLoading(true);

    try {
      let endpoint = "";

      if (type === "LEAD") {
        endpoint = `/leads/business/${businessId}`;
      }

      if (type === "CONTACT") {
        endpoint = `/contacts/business/${businessId}`;
      }

      if (type === "COMPANY") {
        endpoint = `/companies/business/${businessId}`;
      }

      if (type === "DEAL") {
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
          ...(query.trim() ? { search: query.trim() } : {}),
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

  const relatedLabel = (item) => {
    if (!item) return "—";

    if (form.relatedToType === "LEAD") {
      return item?.name || [item?.firstName, item?.lastName].filter(Boolean).join(" ") || item?.email || "Unnamed lead";
    }

    if (form.relatedToType === "CONTACT") {
      return [item?.firstName, item?.lastName].filter(Boolean).join(" ") || item?.name || item?.email || "Unnamed contact";
    }

    if (form.relatedToType === "COMPANY") {
      return item?.name || item?.legalName || item?.email || "Unnamed company";
    }

    if (form.relatedToType === "DEAL") {
      return item?.name || item?.title || "Unnamed deal";
    }

    return "Unnamed record";
  };

  const selectedRelated = useMemo(() => {
    if (!form.relatedToId) return null;

    return relatedOptions.find((item) => getId(item) === form.relatedToId) || null;
  }, [relatedOptions, form.relatedToId]);

  const toggleTag = (tagId) => {
    setForm((current) => {
      const currentTags = Array.isArray(current.tags) ? current.tags.map(getTagId).filter(Boolean).map(String) : [];

      const exists = currentTags.includes(tagId);

      return {
        ...current,
        tags: exists ? currentTags.filter((id) => id !== tagId) : [...currentTags, tagId],
      };
    });
  };

  const getAssignedUserName = (task) => {
    const assigned = task?.assignedTo;

    if (!assigned) return "Unassigned";

    if (typeof assigned === "string") {
      const member = members.find((item) => getMemberId(item) === assigned);
      return member ? getMemberName(member) : "Assigned";
    }

    return [assigned?.firstName, assigned?.lastName].filter(Boolean).join(" ").trim() || assigned?.name || assigned?.email || "Assigned";
  };

  const renderRelated = (task) => {
    if (!task?.relatedTo) return "—";

    const type = task.relatedTo.type || "";
    const rawId = task.relatedTo.id;
    const id = rawId?._id || rawId?.id || rawId || "";
    const inlineRecord = rawId && typeof rawId === "object" ? rawId : null;
    const cachedRecord = typeof id === "string" ? relatedRecords[`${type}:${id}`] : null;
    const relatedRecord = inlineRecord || cachedRecord;

    let label = "—";
    if (relatedRecord) {
      if (type === "CONTACT") {
        label = [relatedRecord?.firstName, relatedRecord?.lastName].filter(Boolean).join(" ").trim() || relatedRecord?.name || relatedRecord?.email || "Unnamed contact";
      } else if (type === "LEAD") {
        label = relatedRecord?.name || [relatedRecord?.firstName, relatedRecord?.lastName].filter(Boolean).join(" ").trim() || relatedRecord?.email || "Unnamed lead";
      } else {
        label = relatedRecord?.name || relatedRecord?.legalName || relatedRecord?.title || relatedRecord?.email || "Unnamed record";
      }
    }

    return (
      <div className="task-related-cell">
        <span className="task-related-type">{type}</span>
        <span>{label}</span>
      </div>
    );
  };

  const stats = useMemo(() => {
    const total = Number(pagination.total || 0);

    const todo = tasks.filter((task) => task.status === "TODO").length;

    const inProgress = tasks.filter((task) => task.status === "IN_PROGRESS").length;

    const completed = tasks.filter((task) => task.status === "COMPLETED").length;

    const urgent = tasks.filter((task) => task.priority === "URGENT" && task.status !== "COMPLETED").length;

    return [
      {
        title: "Total tasks",
        value: total.toLocaleString("en-IN"),
        detail: "All matching tasks",
        icon: CheckSquareIcon,
        tone: "primary",
      },
      {
        title: "To do",
        value: todo.toLocaleString("en-IN"),
        detail: "On current page",
        icon: CheckCircle2,
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
        detail: "Open urgent tasks",
        icon: Tag,
        tone: "danger",
      },
    ];
  }, [pagination.total, tasks]);

  return (
    <div className="crm-resource-page tasks-page">
      <style>{`.tasks-assignee-cell,.task-assignee-cell{min-width:230px;white-space:nowrap}.tasks-assignee-cell .crm-assignee-name,.task-assignee-cell .crm-assignee-name{white-space:nowrap;display:inline-block}.crm-assignee-name{white-space:nowrap;display:inline-flex;align-items:center;cursor:pointer;text-decoration:none;background:transparent;border:0;padding:0;margin:0;color:var(--crm-text);font:inherit;font-weight:400;line-height:1.3;text-align:left;box-shadow:none;appearance:none;-webkit-appearance:none}.crm-assignee-name:hover{background:transparent;border:0;box-shadow:none;color:var(--crm-primary);text-decoration:none}.crm-assignee-name:focus,.crm-assignee-name:focus-visible{outline:none;box-shadow:none;background:transparent}
        .tasks-page{padding:24px 26px 40px}
        .tasks-head{display:flex;align-items:flex-end;justify-content:space-between;gap:18px;margin-bottom:18px}
        .tasks-head-left{min-width:0}
        .tasks-title{margin:0;color:var(--crm-text);font-size:26px;line-height:1.15;font-weight:400;letter-spacing:-.35px}
        .tasks-subtitle{margin:6px 0 0;color:var(--crm-muted);font-size:13px;line-height:1.45;font-weight:400}
        .tasks-head-actions{display:flex;align-items:center;gap:8px}
        .tasks-btn{height:38px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:9px;padding:0 13px;display:inline-flex;align-items:center;justify-content:center;gap:7px;font-size:13px;font-weight:400;cursor:pointer}
        .tasks-btn:hover:not(:disabled){border-color:var(--crm-primary);color:var(--crm-primary)}
        .tasks-btn.primary{background:var(--crm-primary);border-color:var(--crm-primary);color:#fff}
        .tasks-btn.primary:hover{background:var(--crm-primary);border-color:var(--crm-primary);color:#fff}
        .tasks-btn:disabled{opacity:.55;cursor:not-allowed}
        .tasks-stats{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px;margin-bottom:16px}
        .tasks-stat{border:1px solid var(--crm-border);background:var(--crm-surface);border-radius:12px;padding:12px 13px;box-shadow:var(--crm-shadow);min-width:0}
        .tasks-stat-top{display:flex;align-items:center;justify-content:space-between;gap:8px}
        .tasks-stat-icon{width:31px;height:31px;border-radius:9px;display:grid;place-items:center;background:color-mix(in srgb,var(--crm-primary) 10%,transparent);color:var(--crm-primary)}
        .tasks-stat-icon.success{background:color-mix(in srgb,var(--crm-success) 10%,transparent);color:var(--crm-success)}
        .tasks-stat-icon.warning{background:color-mix(in srgb,var(--crm-warning) 10%,transparent);color:var(--crm-warning)}
        .tasks-stat-icon.info{background:color-mix(in srgb,var(--crm-info) 10%,transparent);color:var(--crm-info)}
        .tasks-stat-icon.danger{background:color-mix(in srgb,var(--crm-danger) 10%,transparent);color:var(--crm-danger)}
        .tasks-stat-value{font-size:20px;line-height:1;font-weight:400;color:var(--crm-text)}
        .tasks-stat-title{margin-top:8px;color:var(--crm-text);font-size:13px;font-weight:400}
        .tasks-stat-detail{margin-top:3px;color:var(--crm-muted);font-size:13px}
        .tasks-toolbar{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:13px}
        .tasks-search-wrap{position:relative;max-width:460px;width:100%}
        .tasks-search{width:100%;height:40px;box-sizing:border-box;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:10px;padding:0 40px;font-size:13px;outline:0}
        .tasks-search:focus{border-color:var(--crm-primary)}
        .tasks-search::placeholder{color:var(--crm-muted)}
        .tasks-search-icon{position:absolute;left:12px;top:12px;color:var(--crm-muted);pointer-events:none}
        .tasks-search-clear{position:absolute;right:8px;top:8px;width:24px;height:24px;border:0;background:transparent;color:var(--crm-muted);border-radius:7px;display:grid;place-items:center;cursor:pointer;padding:0}
        .tasks-search-clear:hover{background:var(--crm-surface-2);color:var(--crm-text)}
        .tasks-toolbar-right{display:flex;align-items:center;gap:8px}
        .tasks-filter-btn{height:40px}
        .tasks-filter-count{min-width:18px;height:18px;border-radius:999px;background:var(--crm-primary);color:#fff;display:inline-grid;place-items:center;font-size:13px}
        .tasks-filter-panel{border:1px solid var(--crm-border);background:var(--crm-surface);border-radius:12px;padding:12px;margin-bottom:13px;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;box-shadow:var(--crm-shadow)}
        .tasks-filter-field{display:grid;gap:5px}
        .tasks-filter-field label{font-size:13px;font-weight:400;color:var(--crm-muted)}
        .tasks-filter-field select{height:37px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:8px;padding:0 10px;outline:0;font-size:13px}
        .tasks-filter-clear{height:37px;align-self:end}
        .tasks-error{white-space:pre-line;margin-bottom:12px;padding:10px 12px;border-radius:9px;background:color-mix(in srgb,var(--crm-danger) 10%,transparent);color:var(--crm-danger);font-size:13px}
        .tasks-card{border:1px solid var(--crm-border);background:var(--crm-surface);border-radius:14px;overflow:auto;box-shadow:var(--crm-shadow)}
        .tasks-table-wrap{width:100%;max-height:340px;overflow:auto;overscroll-behavior:contain;scrollbar-gutter:stable both-edges}.tasks-table{width:100%;min-width:1345px;border-collapse:collapse;table-layout:auto}.tasks-table th:nth-child(1),.tasks-table td:nth-child(1){min-width:250px;width:250px}.tasks-table th:nth-child(2),.tasks-table td:nth-child(2){min-width:125px;width:125px}.tasks-table th:nth-child(3),.tasks-table td:nth-child(3){min-width:120px;width:120px}.tasks-table th:nth-child(4),.tasks-table td:nth-child(4){min-width:135px;width:135px}.tasks-table th:nth-child(5),.tasks-table td:nth-child(5){min-width:245px;width:245px}.tasks-table th:nth-child(6),.tasks-table td:nth-child(6){min-width:200px;width:200px}.tasks-table th:nth-child(7),.tasks-table td:nth-child(7){min-width:145px;width:145px}.tasks-table th:nth-child(8),.tasks-table td:nth-child(8){min-width:125px;width:125px}.tasks-table th{position:sticky;top:0;z-index:3;text-align:left!important;min-width:100px;padding:13px 18px;white-space:nowrap}.tasks-table th:last-child,.tasks-table td:last-child{text-align:center}.tasks-table tbody tr{height:56px}.tasks-table td{white-space:nowrap}.tasks-table th,.tasks-table td{padding-left:18px;padding-right:18px}.tasks-table .crm-assignee-name{white-space:nowrap;display:inline-flex;align-items:center;cursor:pointer}
        
        .tasks-table td{border-top:1px solid var(--crm-border);padding:12px 14px;font-size:13px;color:var(--crm-text);vertical-align:middle}
        .tasks-table tbody tr:hover{background:color-mix(in srgb,var(--crm-primary) 3%,transparent)}
        .task-title-cell{display:flex;align-items:center;gap:9px;min-width:180px}
        .task-title-icon{width:30px;height:30px;border-radius:8px;display:grid;place-items:center;background:color-mix(in srgb,var(--crm-primary) 9%,transparent);color:var(--crm-primary);flex:0 0 auto}
        .task-title-main{font-weight:400;color:var(--crm-text);max-width:260px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .task-title-desc{margin-top:2px;color:var(--crm-muted);font-size:13px;max-width:260px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .task-muted{color:var(--crm-muted)}
        .task-badge{display:inline-flex;align-items:center;justify-content:center;min-height:24px;padding:0 8px;border-radius:999px;font-size:13px;font-weight:400;letter-spacing:.03em;white-space:nowrap}
        .task-badge.success{background:color-mix(in srgb,var(--crm-success) 11%,transparent);color:var(--crm-success)}
        .task-badge.warning{background:color-mix(in srgb,var(--crm-warning) 12%,transparent);color:var(--crm-warning)}
        .task-badge.danger{background:color-mix(in srgb,var(--crm-danger) 11%,transparent);color:var(--crm-danger)}
        .task-badge.info{background:color-mix(in srgb,var(--crm-info) 11%,transparent);color:var(--crm-info)}
        .task-badge.neutral{background:color-mix(in srgb,var(--crm-muted) 11%,transparent);color:var(--crm-muted)}
        .task-assignee{display:flex;align-items:center;gap:7px;white-space:nowrap}
        .task-avatar{width:27px;height:27px;border-radius:50%;display:grid;place-items:center;background:color-mix(in srgb,var(--crm-primary) 12%,transparent);color:var(--crm-primary);font-size:13px;font-weight:400}
        .task-related-cell{display:grid;gap:3px}
        .task-related-type{font-size:13px;color:var(--crm-primary);font-weight:400}
        .task-tags{display:flex;align-items:center;gap:4px;flex-wrap:wrap;max-width:180px}
        .task-tag{padding:4px 7px;border-radius:6px;background:var(--crm-surface-2);color:var(--crm-muted);font-size:13px}
        .tasks-actions{display:flex;align-items:center;gap:5px}
        .tasks-icon-btn{width:29px;height:29px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-muted);border-radius:8px;display:grid;place-items:center;cursor:pointer;padding:0}
        .tasks-icon-btn:hover{border-color:var(--crm-primary);color:var(--crm-primary);background:var(--crm-surface-2)}
        .tasks-icon-btn.complete:hover{border-color:var(--crm-success);color:var(--crm-success)}
        .tasks-icon-btn.delete:hover{border-color:var(--crm-danger);color:var(--crm-danger)}
        .tasks-empty{padding:48px 20px;text-align:center;color:var(--crm-muted);font-size:13px}
        .tasks-pagination{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:13px 15px;border-top:1px solid var(--crm-border);font-size:13px;color:var(--crm-muted)}
        .tasks-pagination-actions{display:flex;align-items:center;gap:7px}
        .tasks-pagination-btn{height:32px;padding:0 10px}
        .tasks-modal-backdrop{position:fixed;inset:0;background:rgba(15,23,42,.48);display:grid;place-items:center;padding:20px;z-index:600}
        .tasks-modal{width:min(760px,100%);max-height:91vh;overflow:auto;background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:15px;box-shadow:0 25px 70px rgba(0,0,0,.22)}
        .tasks-modal-head{display:flex;justify-content:space-between;align-items:center;padding:17px 20px;border-bottom:1px solid var(--crm-border);position:sticky;top:0;background:var(--crm-surface);z-index:4}
        .tasks-modal-title{margin:0;color:var(--crm-text);font-size:16px;font-weight:400}
        .tasks-modal-close{width:32px;height:32px;border:0;background:transparent;color:var(--crm-muted);border-radius:8px;display:grid;place-items:center;cursor:pointer}
        .tasks-modal-close:hover{background:var(--crm-surface-2);color:var(--crm-text)}
        .tasks-form{padding:20px;display:grid;grid-template-columns:1fr 1fr;gap:14px}
        .tasks-field{display:grid;gap:6px;min-width:0}
        .tasks-field.full{grid-column:1/-1}
        .tasks-field label{font-size:13px;font-weight:400;color:var(--crm-text)}
        .tasks-field input,.tasks-field select,.tasks-field textarea{width:100%;box-sizing:border-box;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:9px;padding:10px 11px;outline:0;font:inherit;font-size:13px}
        .tasks-field textarea{resize:vertical;min-height:95px}
        .tasks-field input::placeholder,.tasks-field textarea::placeholder{color:var(--crm-muted)}
        .tasks-field input:focus,.tasks-field select:focus,.tasks-field textarea:focus{border-color:var(--crm-primary)}
        .tasks-field-help{font-size:13px;color:var(--crm-muted)}
        .tasks-modal-foot{display:flex;justify-content:flex-end;gap:8px;padding:14px 20px;border-top:1px solid var(--crm-border);position:sticky;bottom:0;background:var(--crm-surface);z-index:4}
        .tasks-custom-select{position:relative}
        .tasks-custom-trigger{width:100%;min-height:39px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:9px;padding:8px 36px 8px 11px;display:flex;align-items:center;text-align:left;position:relative;cursor:pointer;font-size:13px}
        .tasks-custom-trigger .tasks-chevron{position:absolute;right:10px;color:var(--crm-muted)}
        .tasks-custom-menu{position:absolute;left:0;right:0;top:calc(100% + 5px);background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:10px;box-shadow:0 18px 45px rgba(0,0,0,.18);z-index:20;overflow:hidden}
        .tasks-member-search{padding:8px;border-bottom:1px solid var(--crm-border)}
        .tasks-member-search input{width:100%;box-sizing:border-box;height:34px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:7px;padding:0 9px;font-size:13px;outline:0}
        .tasks-option-list{max-height:190px;overflow:auto}
        .tasks-option{width:100%;border:0;background:transparent;color:var(--crm-text);padding:9px 10px;display:flex;align-items:center;gap:8px;text-align:left;cursor:pointer;font-size:13px}
        .tasks-option:hover{background:var(--crm-surface-2)}
        .tasks-option.active{background:color-mix(in srgb,var(--crm-primary) 8%,transparent)}
        .tasks-option-avatar{width:25px;height:25px;border-radius:50%;background:color-mix(in srgb,var(--crm-primary) 12%,transparent);color:var(--crm-primary);display:grid;place-items:center;font-size:13px;font-weight:400;flex:0 0 auto}
        .tasks-option-info{min-width:0;display:flex;flex-direction:column;align-items:flex-start;gap:3px;width:100%}
        .tasks-option-name{font-weight:400;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .tasks-option-email{font-size:12px;color:var(--crm-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;display:block;width:100%;line-height:1.25}
        .tasks-tags-control{position:relative}
        .tasks-tags-trigger{min-height:39px;width:100%;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:9px;padding:7px 36px 7px 9px;display:flex;align-items:center;gap:5px;flex-wrap:wrap;position:relative;cursor:pointer}
        .tasks-tags-trigger-chevron{position:absolute;right:10px;color:var(--crm-muted)}
        .tasks-tag-chip{padding:4px 7px;border-radius:6px;background:color-mix(in srgb,var(--crm-primary) 9%,transparent);color:var(--crm-primary);font-size:13px;font-weight:400}
        .tasks-tags-menu{position:absolute;left:0;right:0;top:calc(100% + 5px);background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:10px;box-shadow:0 18px 45px rgba(0,0,0,.18);z-index:25;max-height:220px;overflow:auto;padding:5px}
        .tasks-tag-option{width:100%;border:0;background:transparent;color:var(--crm-text);padding:8px 9px;border-radius:7px;display:flex;align-items:center;gap:8px;text-align:left;cursor:pointer;font-size:13px}
        .tasks-tag-option:hover{background:var(--crm-surface-2)}
        .tasks-tag-check{width:18px;height:18px;border:1px solid var(--crm-border);border-radius:5px;display:grid;place-items:center;color:transparent}
        .tasks-tag-option.selected .tasks-tag-check{background:var(--crm-primary);border-color:var(--crm-primary);color:#fff}
        .tasks-related-search{display:flex;gap:7px;margin-bottom:7px}
        .tasks-related-search input{flex:1}
        .tasks-related-options{max-height:150px;overflow:auto;border:1px solid var(--crm-border);border-radius:8px}
        .tasks-related-option{width:100%;border:0;border-bottom:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);padding:9px;text-align:left;cursor:pointer;font-size:13px}
        .tasks-related-option:last-child{border-bottom:0}
        .tasks-related-option:hover{background:var(--crm-surface-2)}
        .tasks-related-selected{margin-top:6px;padding:8px 10px;border:1px solid color-mix(in srgb,var(--crm-primary) 35%,var(--crm-border));border-radius:8px;background:color-mix(in srgb,var(--crm-primary) 5%,transparent);color:var(--crm-text);font-size:13px}
        .tasks-view-grid{padding:20px;display:grid;grid-template-columns:1fr 1fr;gap:15px}
        .tasks-view-item{display:grid;gap:5px}
        .tasks-view-item.full{grid-column:1/-1}
        .tasks-view-label{font-size:13px;font-weight:400;color:var(--crm-muted);text-transform:uppercase;letter-spacing:.04em}
        .tasks-view-value{font-size:13px;color:var(--crm-text);white-space:pre-wrap;word-break:break-word}
        .tasks-table .crm-assignee-name{white-space:nowrap;display:inline-flex;align-items:center;cursor:pointer}@media(max-width:900px){
          .tasks-stats{grid-template-columns:repeat(3,minmax(0,1fr))}
          .tasks-filter-panel{grid-template-columns:repeat(2,minmax(0,1fr))}
        }
        @media(max-width:700px){
          .tasks-page{padding:18px 14px 30px}
          .tasks-head{align-items:flex-start;flex-direction:column}
          .tasks-head-actions{width:100%}
          .tasks-head-actions .tasks-btn{flex:1}
          .tasks-stats{grid-template-columns:1fr 1fr}
          .tasks-toolbar{align-items:stretch;flex-direction:column}
          .tasks-toolbar-right{justify-content:space-between}
          .tasks-search-wrap{max-width:none}
          .tasks-filter-panel{grid-template-columns:1fr}
          .tasks-form{grid-template-columns:1fr}
          .tasks-field.full{grid-column:auto}
          .tasks-view-grid{grid-template-columns:1fr}
          .tasks-view-item.full{grid-column:auto}
          .tasks-pagination{align-items:flex-start;flex-direction:column}
        }
      .tasks-table thead th{text-align:left!important;padding-left:20px;padding-right:20px;white-space:nowrap}.tasks-table tbody td{padding-left:20px;padding-right:20px}.tasks-table td:last-child{text-align:center}`}</style>

      <div className="tasks-head">
        <div className="tasks-head-left">
          <h1 className="tasks-title">Tasks</h1>

          <p className="tasks-subtitle">Plan, assign and track your CRM tasks from one place.</p>
        </div>

        <div className="tasks-head-actions">
          <button type="button" className="tasks-btn" onClick={() => loadTasks(pagination.page || 1, search, status, priority, assignedTo)} disabled={loading}>
            <RefreshCw size={14} />
            Refresh
          </button>

          <button type="button" className="tasks-btn primary" onClick={openCreate} disabled={businessLoading}>
            <Plus size={14} />
            Add Task
          </button>
        </div>
      </div>

      {businessError || error ? <div className="tasks-error">{error || businessError}</div> : null}

      <div className="tasks-stats">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div className="tasks-stat" key={stat.title}>
              <div className="tasks-stat-top">
                <div className={`tasks-stat-icon ${stat.tone || ""}`}>
                  <Icon size={15} />
                </div>

                <div className="tasks-stat-value">{stat.value}</div>
              </div>

              <div className="tasks-stat-title">{stat.title}</div>

              <div className="tasks-stat-detail">{stat.detail}</div>
            </div>
          );
        })}
      </div>

      <div className="tasks-toolbar">
        <div className="tasks-search-wrap">
          <Search size={16} className="tasks-search-icon" />

          <input
            className="tasks-search"
            value={search}
            onChange={(event) => {
              const value = event.target.value;

              setSearch(value);

              loadTasks(1, value, status, priority, assignedTo);
            }}
            placeholder="Search tasks..."
          />

          {search ? (
            <button type="button" className="tasks-search-clear" onClick={clearSearch} title="Clear search" aria-label="Clear search">
              <X size={14} />
            </button>
          ) : null}
        </div>

        <div className="tasks-toolbar-right">
          <button type="button" className="tasks-btn tasks-filter-btn" onClick={() => setFilterOpen((value) => !value)}>
            <Filter size={14} />
            Filters
            {activeFilterCount > 0 ? <span className="tasks-filter-count">{activeFilterCount}</span> : null}
          </button>
        </div>
      </div>

      {filterOpen ? (
        <div className="tasks-filter-panel">
          <div className="tasks-filter-field">
            <label>Status</label>

            <select
              value={status}
              onChange={(event) => {
                const value = event.target.value;

                setStatus(value);

                loadTasks(1, search, value, priority, assignedTo);
              }}>
              <option value="">All statuses</option>

              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="tasks-filter-field">
            <label>Priority</label>

            <select
              value={priority}
              onChange={(event) => {
                const value = event.target.value;

                setPriority(value);

                loadTasks(1, search, status, value, assignedTo);
              }}>
              <option value="">All priorities</option>

              {PRIORITY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="tasks-filter-field">
            <label>Assigned user</label>

            <select
              value={assignedTo}
              onChange={(event) => {
                const value = event.target.value;

                setAssignedTo(value);

                loadTasks(1, search, status, priority, value);
              }}>
              <option value="">All users</option>

              {members.map((member) => (
                <option key={getMemberId(member)} value={getMemberId(member)}>
                  {getMemberName(member)}
                </option>
              ))}
            </select>
          </div>

          <button type="button" className="tasks-btn tasks-filter-clear" onClick={resetFilters} disabled={!activeFilterCount}>
            Clear filters
          </button>
        </div>
      ) : null}

      <div className="tasks-card">
        <div className="tasks-table-wrap">
        <table className="tasks-table">
          <thead>
            <tr>
              <th>Task</th>
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
                <td colSpan={8}>
                  <div className="tasks-empty">Loading tasks...</div>
                </td>
              </tr>
            ) : tasks.length === 0 ? (
              <tr>
                <td colSpan={8}>
                  <div className="tasks-empty">No tasks found.</div>
                </td>
              </tr>
            ) : (
              tasks.map((task) => {
                const assigned = task?.assignedTo;

                const assignedName = String(getAssignedUserName(task) || "Unassigned");

                const initials =
                  assignedName !== "Unassigned"
                    ? assignedName
                        .split(" ")
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((part) => part[0])
                        .join("")
                        .toUpperCase()
                    : "—";

                return (
                  <tr key={task._id}>
                    <td>
                      <div className="task-title-cell">
                        <div className="task-title-icon">
                          <CheckSquareIcon size={14} />
                        </div>

                        <div>
                          <div className="task-title-main">{task.title || "Untitled task"}</div>

                          {task.description ? <div className="task-title-desc">{task.description}</div> : null}
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className={`task-badge ${getStatusClass(task.status)}`}>{labelFor(STATUS_OPTIONS, task.status)}</span>
                    </td>

                    <td>
                      <span className={`task-badge ${getPriorityClass(task.priority)}`}>{labelFor(PRIORITY_OPTIONS, task.priority)}</span>
                    </td>

                    <td>{formatDate(task.dueDate)}</td>

                    <td>
                      <div className="task-assignee">
                        <span className="task-avatar">{initials}</span>

                        <button type="button" className="crm-assignee-name" onClick={() => assigned && typeof assigned === "object" && setAssigneeDetail({ type: "user", name: assignedName, email: assigned?.email || "" })}>{assigned ? assignedName : "Unassigned"}</button>
                      </div>
                    </td>

                    <td>{renderRelated(task)}</td>

                    <td>
                      <div className="task-tags">
                        {Array.isArray(task.tags) && task.tags.length ? (
                          task.tags.slice(0, 3).map((tag) => (
                            <span className="task-tag" key={getTagId(tag)}>
                              {getTagName(tag)}
                            </span>
                          ))
                        ) : (
                          <span className="task-muted">—</span>
                        )}

                        {Array.isArray(task.tags) && task.tags.length > 3 ? <span className="task-tag">+{task.tags.length - 3}</span> : null}
                      </div>
                    </td>

                    <td>
                      <div className="tasks-actions">
                        <button type="button" className="tasks-icon-btn" title="View" onClick={() => openView(task)}>
                          <Eye size={14} />
                        </button>

                        <button
                          type="button"
                          className="tasks-icon-btn"
                          title="Edit"
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            openEdit(task);
                          }}>
                          <Pencil size={14} />
                        </button>

                        {task.status !== "COMPLETED" ? (
                          <button type="button" className="tasks-icon-btn complete" title="Complete" onClick={() => handleComplete(task)}>
                            <Check size={14} />
                          </button>
                        ) : null}

                        {canManage && (
                          <button type="button" className="tasks-icon-btn delete" title="Delete" onClick={() => handleDelete(task)}>
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

        <div className="tasks-pagination">
          <span>{pagination.total ?? tasks.length} total</span>

          <div className="tasks-pagination-actions">
            <button type="button" className="tasks-btn tasks-pagination-btn" disabled={loading || (pagination.page || 1) <= 1} onClick={() => loadTasks((pagination.page || 1) - 1, search, status, priority, assignedTo)}>
              <ChevronLeft size={13} />
              Previous
            </button>

            <span>
              Page {pagination.page || 1} / {pagination.totalPages || 1}
            </span>

            <button type="button" className="tasks-btn tasks-pagination-btn" disabled={loading || (pagination.page || 1) >= (pagination.totalPages || 1)} onClick={() => loadTasks((pagination.page || 1) + 1, search, status, priority, assignedTo)}>
              Next
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {modal ? (
        <div
          className="tasks-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !saving) {
              setModal(null);
            }
          }}>
          <div className="tasks-modal">
            <div className="tasks-modal-head">
              <h2 className="tasks-modal-title">{modal.mode === "create" ? "Add Task" : modal.mode === "edit" ? "Edit Task" : "Task details"}</h2>

              <button type="button" className="tasks-modal-close" disabled={saving} onClick={() => !saving && setModal(null)}>
                <X size={17} />
              </button>
            </div>

            {modal.mode === "view" ? (
              <>
                <div className="tasks-view-grid">
                  <div className="tasks-view-item">
                    <div className="tasks-view-label">Task</div>

                    <div className="tasks-view-value">{modal.task?.title || "—"}</div>
                  </div>

                  <div className="tasks-view-item">
                    <div className="tasks-view-label">Status</div>

                    <div className="tasks-view-value">
                      <span className={`task-badge ${getStatusClass(modal.task?.status)}`}>{labelFor(STATUS_OPTIONS, modal.task?.status)}</span>
                    </div>
                  </div>

                  <div className="tasks-view-item">
                    <div className="tasks-view-label">Priority</div>

                    <div className="tasks-view-value">
                      <span className={`task-badge ${getPriorityClass(modal.task?.priority)}`}>{labelFor(PRIORITY_OPTIONS, modal.task?.priority)}</span>
                    </div>
                  </div>

                  <div className="tasks-view-item">
                    <div className="tasks-view-label">Due date</div>

                    <div className="tasks-view-value">{formatDate(modal.task?.dueDate)}</div>
                  </div>

                  <div className="tasks-view-item">
                    <div className="tasks-view-label">Assigned to</div>

                    <div className="tasks-view-value">{getAssignedUserName(modal.task)}</div>
                  </div>

                  <div className="tasks-view-item">
                    <div className="tasks-view-label">Related record</div>

                    <div className="tasks-view-value">{renderRelated(modal.task)}</div>
                  </div>

                  <div className="tasks-view-item full">
                    <div className="tasks-view-label">Description</div>

                    <div className="tasks-view-value">{modal.task?.description || "—"}</div>
                  </div>

                  <div className="tasks-view-item full">
                    <div className="tasks-view-label">Tags</div>

                    <div className="tasks-view-value">
                      <div className="task-tags">
                        {Array.isArray(modal.task?.tags) && modal.task.tags.length
                          ? modal.task.tags.map((tag) => (
                              <span className="task-tag" key={getTagId(tag)}>
                                {getTagName(tag)}
                              </span>
                            ))
                          : "—"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="tasks-modal-foot">
                  <button type="button" className="tasks-btn" onClick={() => setModal(null)}>
                    Close
                  </button>

                  {modal.task?.status !== "COMPLETED" ? (
                    <button type="button" className="tasks-btn" onClick={() => handleComplete(modal.task)}>
                      <Check size={14} />
                      Complete
                    </button>
                  ) : null}

                  <button type="button" className="tasks-btn primary" onClick={() => openEdit(modal.task)}>
                    <Pencil size={14} />
                    Edit
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="tasks-form">
                  <div className="tasks-field full">
                    <label>Task title *</label>

                    <input value={form.title} onChange={(event) => updateForm("title", event.target.value)} placeholder="Enter task title" maxLength={200} />
                  </div>

                  <div className="tasks-field">
                    <label>Status</label>

                    <select value={form.status} onChange={(event) => updateForm("status", event.target.value)}>
                      {STATUS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="tasks-field">
                    <label>Priority</label>

                    <select value={form.priority} onChange={(event) => updateForm("priority", event.target.value)}>
                      {PRIORITY_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="tasks-field">
                    <label>Due date</label>

                    <input type="datetime-local" value={form.dueDate} onChange={(event) => updateForm("dueDate", event.target.value)} />
                  </div>

                  <div className="tasks-field" ref={memberDropdownRef}>
                    <label>Assigned user</label>

                    <div className="tasks-custom-select">
                      <button
                        type="button"
                        className="tasks-custom-trigger"
                        onClick={() => {
                          setMemberDropdownOpen((value) => !value);
                          setTagDropdownOpen(false);
                        }}>
                        {selectedMember ? getMemberName(selectedMember) : "Unassigned"}

                        <ChevronDown className="tasks-chevron" size={14} />
                      </button>

                      {memberDropdownOpen ? (
                        <div className="tasks-custom-menu">
                          <div className="tasks-member-search">
                            <input value={memberSearch} onChange={(event) => setMemberSearch(event.target.value)} placeholder="Search name or email..." autoFocus />
                          </div>

                          <div className="tasks-option-list">
                            <button
                              type="button"
                              className="tasks-option"
                              onClick={() => {
                                updateForm("assignedTo", "");
                                setMemberDropdownOpen(false);
                              }}>
                              <span className="tasks-option-avatar">—</span>

                              <span className="tasks-option-info">
                                <span className="tasks-option-name">Unassigned</span>
                              </span>
                            </button>

                            {optionsLoading ? (
                              <div className="tasks-empty">Loading users...</div>
                            ) : filteredMembers.length === 0 ? (
                              <div className="tasks-empty">No users found.</div>
                            ) : (
                              filteredMembers.map((member) => {
                                const memberId = getMemberId(member);

                                const memberName = getMemberName(member);

                                const memberEmail = getMemberEmail(member);

                                const initials = memberName
                                  .split(" ")
                                  .filter(Boolean)
                                  .slice(0, 2)
                                  .map((part) => part[0])
                                  .join("")
                                  .toUpperCase();

                                return (
                                  <button
                                    type="button"
                                    className={`tasks-option ${form.assignedTo === memberId ? "active" : ""}`}
                                    key={memberId}
                                    onClick={() => {
                                      updateForm("assignedTo", memberId);
                                      setMemberDropdownOpen(false);
                                    }}>
                                    <span className="tasks-option-avatar">{initials || "U"}</span>

                                    <span className="tasks-option-info">
                                      <span className="tasks-option-name">{memberName}</span>

                                      {memberEmail ? <span className="tasks-option-email">{memberEmail}</span> : null}
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

                  <div className="tasks-field">
                    <label>Related record</label>

                    <select
                      value={form.relatedToType}
                      onChange={(event) => {
                        const type = event.target.value;

                        setForm((current) => ({
                          ...current,
                          relatedToType: type,
                          relatedToId: "",
                        }));

                        setRelatedOptions([]);
                        setRelatedSearch("");

                        if (type) {
                          loadRelatedOptions(type, "");
                        }
                      }}>
                      {RELATED_TYPE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {form.relatedToType ? (
                    <div className="tasks-field full">
                      <label>Select {labelFor(RELATED_TYPE_OPTIONS, form.relatedToType)}</label>

                      <div className="tasks-related-search">
                        <input
                          value={relatedSearch}
                          onChange={(event) => {
                            const value = event.target.value;

                            setRelatedSearch(value);

                            loadRelatedOptions(form.relatedToType, value);
                          }}
                          placeholder={`Search ${form.relatedToType.toLowerCase()}...`}
                        />

                        <button type="button" className="tasks-btn" onClick={() => loadRelatedOptions(form.relatedToType, relatedSearch)}>
                          <Search size={13} />
                        </button>
                      </div>

                      {selectedRelated ? (
                        <div className="tasks-related-selected">
                          Selected: <strong>{relatedLabel(selectedRelated)}</strong>
                        </div>
                      ) : null}

                      {relatedLoading ? (
                        <div className="tasks-field-help">Loading records...</div>
                      ) : relatedOptions.length ? (
                        <div className="tasks-related-options">
                          {relatedOptions.map((item) => {
                            const id = getId(item);

                            return (
                              <button type="button" className="tasks-related-option" key={id} onClick={() => updateForm("relatedToId", id)}>
                                {relatedLabel(item)}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="tasks-field-help">No matching records found.</div>
                      )}
                    </div>
                  ) : null}

                  <div className="tasks-field full" ref={tagDropdownRef}>
                    <label>Tags</label>

                    <div className="tasks-tags-control">
                      <button
                        type="button"
                        className="tasks-tags-trigger"
                        onClick={() => {
                          setTagDropdownOpen((value) => !value);
                          setMemberDropdownOpen(false);
                        }}>
                        {selectedTags.length ? (
                          selectedTags.map((tag) => (
                            <span className="tasks-tag-chip" key={getTagId(tag)}>
                              {getTagName(tag)}
                            </span>
                          ))
                        ) : (
                          <span className="task-muted">Select tags</span>
                        )}

                        <ChevronDown className="tasks-tags-trigger-chevron" size={14} />
                      </button>

                      {tagDropdownOpen ? (
                        <div className="tasks-tags-menu">
                          {tags.length === 0 ? (
                            <div className="tasks-empty">No tags available.</div>
                          ) : (
                            tags.map((tag) => {
                              const id = getTagId(tag);

                              const selected = (form.tags || []).includes(id);

                              return (
                                <button type="button" className={`tasks-tag-option ${selected ? "selected" : ""}`} key={id} onClick={() => toggleTag(id)}>
                                  <span className="tasks-tag-check">{selected ? <Check size={11} /> : null}</span>

                                  <span>{getTagName(tag)}</span>
                                </button>
                              );
                            })
                          )}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="tasks-field full">
                    <label>Description</label>

                    <textarea value={form.description} onChange={(event) => updateForm("description", event.target.value)} placeholder="Add task details..." maxLength={2000} />
                  </div>
                </div>

                <div className="tasks-modal-foot">
                  <button type="button" className="tasks-btn" disabled={saving} onClick={() => !saving && setModal(null)}>
                    Cancel
                  </button>

                  <button type="button" className="tasks-btn primary" disabled={saving || optionsLoading} onClick={saveTask}>
                    {saving ? (
                      "Saving..."
                    ) : modal.mode === "create" ? (
                      <>
                        <Plus size={14} />
                        Create Task
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

function CheckSquareIcon({ size = 16 }) {
  return <CheckCircle2 size={size} />;
}

export default Tasks;
