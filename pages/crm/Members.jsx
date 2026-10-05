import { useEffect, useMemo, useState } from "react";
import { Eye, Pencil, Plus, RefreshCw, Search, Trash2, X, Users, UserCheck, UserX, ShieldCheck, Ban } from "lucide-react";

import { showAuthAlert } from "../../components/auth/authAlert";
import useBusiness from "../../hooks/useBusiness";
import { isManagementRole } from "../../utils/permissions";

import { getMembers, getMemberById, addMember, updateMember, removeMember } from "../../api/member.api";

const getErrorMessage = (err, fallback = "Something went wrong.") => {
  const data = err?.response?.data;

  if (Array.isArray(data?.errors) && data.errors.length) {
    return data.errors
      .map((item) => item?.msg || item?.message || String(item))
      .filter(Boolean)
      .join("\n");
  }

  if (Array.isArray(data?.details) && data.details.length) {
    return data.details
      .map((item) => item?.message || item?.msg || String(item))
      .filter(Boolean)
      .join("\n");
  }

  if (Array.isArray(data?.message)) {
    return data.message.filter(Boolean).join("\n");
  }

  if (typeof data?.message === "string" && data.message.trim()) {
    return data.message;
  }

  if (typeof err?.message === "string" && err.message.trim()) {
    return err.message;
  }

  return fallback;
};

const EMPTY_FORM = {
  userId: "",
  roleId: "",
  status: "ACTIVE",
};

const formatDate = (value) => {
  if (!value) return "—";

  try {
    return new Date(value).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
};

const getInitials = (name = "") => {
  const value = String(name).trim();

  if (!value) return "U";

  const parts = value.split(/\s+/).filter(Boolean);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

const getMemberName = (member) => {
  return member?.userId?.name || member?.userId?.email || "Unknown User";
};

const getMemberEmail = (member) => {
  return member?.userId?.email || "—";
};

const getMemberPhone = (member) => {
  return member?.userId?.phone || "—";
};

const getRoleName = (member) => {
  return member?.roleId?.name || "No role";
};

const getRoleId = (member) => {
  if (!member?.roleId) return "";

  if (typeof member.roleId === "string") {
    return member.roleId;
  }

  return member.roleId?._id || "";
};

const StatusBadge = ({ status }) => {
  const normalized = String(status || "").toUpperCase();

  const className = normalized === "ACTIVE" ? "active" : normalized === "SUSPENDED" ? "suspended" : "inactive";

  return <span className={`members-page-status ${className}`}>{normalized || "—"}</span>;
};

export default function Members() {
  const { businessId, loading: businessLoading, error: businessError, role, isBusinessOwner } = useBusiness();
  const canManage = isManagementRole({ role, isBusinessOwner });

  const [items, setItems] = useState([]);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 100,
    total: 0,
    totalPages: 1,
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const [selectedMember, setSelectedMember] = useState(null);

  const loadMembers = async (page = pagination.page || 1, nextStatus = statusFilter) => {
    if (!businessId) return;

    setLoading(true);
    setError("");

    try {
      const response = await getMembers(businessId, {
        page,
        limit: 100,
        ...(nextStatus ? { status: nextStatus } : {}),
      });

      const data = response?.data || response || {};

      const rows = Array.isArray(data?.members) ? data.members : Array.isArray(data?.items) ? data.items : [];

      setItems(rows);

      setPagination(
        data?.pagination || {
          page,
          limit: 100,
          total: rows.length,
          totalPages: 1,
        }
      );
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load business members."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (businessId) {
      loadMembers(1, statusFilter);
    }
  }, [businessId, statusFilter]);

  useEffect(() => {
    if (businessError && !businessId && !businessLoading) {
      setError(businessError || "Unable to load your business workspace.");
    }
  }, [businessError, businessId, businessLoading]);

  const filteredItems = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return items;
    }

    return items.filter((member) => {
      const name = getMemberName(member).toLowerCase();
      const email = getMemberEmail(member).toLowerCase();
      const phone = getMemberPhone(member).toLowerCase();
      const role = getRoleName(member).toLowerCase();
      const status = String(member?.status || "").toLowerCase();

      return name.includes(value) || email.includes(value) || phone.includes(value) || role.includes(value) || status.includes(value);
    });
  }, [items, search]);

  const memberStats = useMemo(() => {
    const total = Number(pagination.total ?? items.length ?? 0);

    const active = items.filter((member) => member?.status === "ACTIVE").length;

    const inactive = items.filter((member) => member?.status === "INACTIVE").length;

    const suspended = items.filter((member) => member?.status === "SUSPENDED").length;

    return [
      {
        title: "Total Members",
        value: total.toLocaleString("en-IN"),
        detail: "All business members",
        icon: Users,
        tone: "",
      },
      {
        title: "Active",
        value: active.toLocaleString("en-IN"),
        detail: "On current page",
        icon: UserCheck,
        tone: "green",
      },
      {
        title: "Inactive",
        value: inactive.toLocaleString("en-IN"),
        detail: "On current page",
        icon: UserX,
        tone: "orange",
      },
      {
        title: "Suspended",
        value: suspended.toLocaleString("en-IN"),
        detail: "On current page",
        icon: Ban,
        tone: "danger",
      },
    ];
  }, [items, pagination.total]);

  const clearSearch = () => {
    setSearch("");
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("");
    loadMembers(1, "");
  };

  const openCreate = () => {
    setError("");
    setForm({ ...EMPTY_FORM });
    setSelectedMember(null);

    setModal({
      mode: "create",
    });
  };

  const openEdit = (member) => {
    setError("");
    setSelectedMember(member);

    setForm({
      userId: member?.userId?._id || "",
      roleId: getRoleId(member),
      status: member?.status || "ACTIVE",
    });

    setModal({
      mode: "edit",
      item: member,
    });
  };

  const openView = async (member) => {
    if (!member?._id) return;

    setError("");
    setLoading(true);

    try {
      const response = await getMemberById(member._id);

      const data = response?.data || response || {};

      const nextMember = data?.member || member;

      setSelectedMember(nextMember);

      setModal({
        mode: "view",
        item: nextMember,
      });
    } catch (err) {
      const message = getErrorMessage(err, "Unable to load member details.");

      setError(message);

      await showAuthAlert({
        icon: "error",
        title: "Unable to load member",
        text: message,
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  const validateCreate = () => {
    if (!form.userId.trim()) {
      return "User ID is required.";
    }

    if (!/^[a-f\d]{24}$/i.test(form.userId.trim())) {
      return "Please enter a valid User ID.";
    }

    if (form.roleId.trim() && !/^[a-f\d]{24}$/i.test(form.roleId.trim())) {
      return "Please enter a valid Role ID.";
    }

    if (!["ACTIVE", "INACTIVE", "SUSPENDED"].includes(form.status)) {
      return "Please select a valid member status.";
    }

    return "";
  };

  const validateEdit = () => {
    if (form.roleId.trim() && !/^[a-f\d]{24}$/i.test(form.roleId.trim())) {
      return "Please enter a valid Role ID.";
    }

    if (!["ACTIVE", "INACTIVE", "SUSPENDED"].includes(form.status)) {
      return "Please select a valid member status.";
    }

    return "";
  };

  const saveMember = async () => {
    if (!businessId || !modal) return;

    const validationError = modal.mode === "create" ? validateCreate() : validateEdit();

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
      if (modal.mode === "create") {
        const payload = {
          userId: form.userId.trim(),
          roleId: form.roleId.trim() ? form.roleId.trim() : null,
          status: form.status,
        };

        await addMember(businessId, payload);
      } else {
        const payload = {
          roleId: form.roleId.trim() ? form.roleId.trim() : null,
          status: form.status,
        };

        await updateMember(modal.item._id, payload);
      }

      setModal(null);
      setSelectedMember(null);
      setForm({ ...EMPTY_FORM });

      await loadMembers(pagination.page || 1, statusFilter);

      await showAuthAlert({
        icon: "success",
        title: modal.mode === "create" ? "Member Added" : "Member Updated",
        text: modal.mode === "create" ? "Business member added successfully." : "Business member updated successfully.",
        confirmButtonText: "Done",
      });
    } catch (err) {
      const message = getErrorMessage(err, modal.mode === "create" ? "Unable to add the member." : "Unable to update the member.");

      setError(message);

      await showAuthAlert({
        icon: "error",
        title: modal.mode === "create" ? "Unable to add member" : "Unable to update member",
        text: message,
        confirmButtonText: "OK",
      });
    } finally {
      setSaving(false);
    }
  };

  const deactivateMember = async (member) => {
    if (!member?._id) return;

    const memberName = getMemberName(member);

    const result = await showAuthAlert({
      icon: "warning",
      title: "Remove Member?",
      text: `${memberName} will be deactivated from this business. Are you sure you want to continue?`,
      showCancelButton: true,
      confirmButtonText: "Remove",
      cancelButtonText: "Cancel",
    });

    if (!result?.isConfirmed) return;

    setError("");

    try {
      await removeMember(member._id);

      await loadMembers(pagination.page || 1, statusFilter);

      await showAuthAlert({
        icon: "success",
        title: "Member Removed",
        text: "Business member deactivated successfully.",
        confirmButtonText: "Done",
      });
    } catch (err) {
      const message = getErrorMessage(err, "Unable to remove the member.");

      setError(message);

      await showAuthAlert({
        icon: "error",
        title: "Unable to remove member",
        text: message,
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="members-page">
      <style>{`
        .members-page{padding:24px 26px 40px;width:100%;max-width:100%;min-width:0;box-sizing:border-box;color:var(--crm-text);overflow:hidden}
        .members-page *{box-sizing:border-box}

        .members-page .members-head{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:18px;min-width:0}
        .members-page .members-heading{min-width:0}
        .members-page .members-title{margin:0;color:var(--crm-text);font-size:28px;line-height:1.15;font-weight:400;letter-spacing:-.5px}
        .members-page .members-sub{margin:7px 0 0;color:var(--crm-muted);font-size:14px;line-height:1.45;font-weight:400}

        .members-page .members-actions{display:flex;align-items:center;gap:9px;min-width:0;flex-shrink:0}
        .members-page .members-btn{height:38px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:9px;padding:0 13px;display:inline-flex;align-items:center;justify-content:center;gap:7px;font-size:13px;font-weight:400;cursor:pointer;white-space:nowrap}
        .members-page .members-btn.primary{background:var(--crm-primary);border-color:var(--crm-primary);color:#fff}
        .members-page .members-btn:hover:not(:disabled){filter:brightness(.98)}
        .members-page .members-btn:disabled{opacity:.55;cursor:not-allowed}

        .members-page .member-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;margin-bottom:14px}
        .members-page .member-stat{background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:15px;padding:11px 14px;box-shadow:var(--crm-shadow);min-width:0}
        .members-page .member-stat-content{display:flex;align-items:center;justify-content:space-between;gap:10px;min-height:70px}
        .members-page .member-stat-copy{min-width:0}
        .members-page .member-stat-icon{width:36px;height:36px;flex:0 0 36px;border-radius:10px;background:var(--crm-primary-soft);color:var(--crm-primary);display:grid;place-items:center}
        .members-page .member-stat-icon.green{background:color-mix(in srgb,var(--crm-success) 11%,transparent);color:var(--crm-success)}
        .members-page .member-stat-icon.orange{background:color-mix(in srgb,var(--crm-warning) 12%,transparent);color:var(--crm-warning)}
        .members-page .member-stat-icon.danger{background:color-mix(in srgb,var(--crm-danger) 10%,transparent);color:var(--crm-danger)}
        .members-page .member-stat-title{font-size:13px;color:var(--crm-muted);font-weight:400;line-height:1.2}
        .members-page .member-stat-value{font-size:22px;line-height:1.05;letter-spacing:-.4px;font-weight:400;color:var(--crm-text);margin:5px 0 3px}
        .members-page .member-stat-detail{font-size:13px;color:var(--crm-muted);line-height:1.2}

        .members-page .member-toolbar{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:14px}
        .members-page .member-search-wrap{position:relative;width:100%;max-width:460px;min-width:0}
        .members-page .member-search{width:100%;height:40px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:10px;padding:0 40px;outline:0;font-size:13px}
        .members-page .member-search::placeholder{color:var(--crm-muted)}
        .members-page .member-search:focus{border-color:var(--crm-primary)}
        .members-page .member-search-icon{position:absolute;left:12px;top:12px;color:var(--crm-muted);width:16px;height:16px;pointer-events:none}
        .members-page .member-search-clear{position:absolute;right:9px;top:8px;width:24px;height:24px;border:0;border-radius:7px;background:transparent;color:var(--crm-muted);display:grid;place-items:center;cursor:pointer;padding:0}
        .members-page .member-search-clear:hover{background:var(--crm-surface-2);color:var(--crm-text)}

        .members-page .member-filter{height:40px;min-width:145px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:10px;padding:0 11px;font-size:13px;outline:0;cursor:pointer}
        .members-page .member-filter:focus{border-color:var(--crm-primary)}

        .members-page .member-table-card{width:100%;max-width:100%;min-width:0;height:calc(100vh - 355px);min-height:300px;box-sizing:border-box;border:1px solid var(--crm-border);background:var(--crm-surface);border-radius:14px;box-shadow:var(--crm-shadow);overflow:hidden;display:flex;flex-direction:column}
        .members-page .member-table-scroll{width:100%;min-width:0;flex:1;overflow-x:auto;overflow-y:auto;scrollbar-width:thin}
        .members-page .member-table-scroll::-webkit-scrollbar{width:8px;height:8px}
        .members-page .member-table-scroll::-webkit-scrollbar-thumb{background:var(--crm-border);border-radius:10px}
        .members-page .member-table-scroll::-webkit-scrollbar-track{background:transparent}

        .members-page .member-table{width:100%;min-width:1000px;border-collapse:separate;border-spacing:0;table-layout:auto}
        .members-page .member-table th{position:sticky;top:0;z-index:5;height:43px;background:var(--crm-surface-2);font-size:13px;text-transform:uppercase;letter-spacing:.06em;color:var(--crm-muted);text-align:left;padding:13px 16px;white-space:nowrap;border-bottom:1px solid var(--crm-border)}
        .members-page .member-table td{border-bottom:1px solid var(--crm-border);padding:13px 16px;font-size:13px;color:var(--crm-text);vertical-align:middle;background:var(--crm-surface)}
        .members-page .member-table tbody tr:hover td{background:color-mix(in srgb,var(--crm-primary) 3%,transparent)}
        .members-page .member-table tbody tr:last-child td{border-bottom:0}

        .members-page .member-name-cell{display:flex;align-items:center;gap:10px;min-width:210px}
        .members-page .member-avatar{width:34px;height:34px;border-radius:10px;background:var(--crm-primary-soft);color:var(--crm-primary);display:grid;place-items:center;flex:0 0 34px;font-size:13px;font-weight:400;overflow:hidden}
        .members-page .member-avatar img{width:100%;height:100%;object-fit:cover}
        .members-page .member-name-main{font-weight:400;color:var(--crm-text)}
        .members-page .member-name-sub{font-size:13px;color:var(--crm-muted);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:220px}
        .members-page .member-email{color:var(--crm-muted);font-size:13px}
        .members-page .member-phone{font-size:13px;color:var(--crm-text)}
        .members-page .member-role{display:inline-flex;align-items:center;gap:5px;padding:4px 8px;border-radius:7px;background:color-mix(in srgb,var(--crm-primary) 9%,transparent);color:var(--crm-primary);font-size:13px;font-weight:400;white-space:nowrap}
        .members-page .member-role.muted{background:color-mix(in srgb,var(--crm-muted) 10%,transparent);color:var(--crm-muted)}
        .members-page .members-page-status{display:inline-flex;align-items:center;padding:4px 8px;border-radius:7px;font-size:13px;font-weight:400}
        .members-page .members-page-status.active{background:color-mix(in srgb,var(--crm-success) 11%,transparent);color:var(--crm-success)}
        .members-page .members-page-status.inactive{background:color-mix(in srgb,var(--crm-muted) 12%,transparent);color:var(--crm-muted)}
        .members-page .members-page-status.suspended{background:color-mix(in srgb,var(--crm-danger) 10%,transparent);color:var(--crm-danger)}

        .members-page .member-actions-cell{display:flex;gap:5px;align-items:center}
        .members-page .member-icon-btn{width:30px;height:30px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-muted);border-radius:8px;display:grid;place-items:center;cursor:pointer;padding:0}
        .members-page .member-icon-btn:hover{color:var(--crm-primary);border-color:var(--crm-primary);background:var(--crm-surface-2)}
        .members-page .member-icon-btn.danger:hover{color:var(--crm-danger);border-color:var(--crm-danger)}

        .members-page .member-error{white-space:pre-line;margin-bottom:12px;padding:10px 12px;border-radius:9px;background:color-mix(in srgb,var(--crm-danger) 10%,transparent);color:var(--crm-danger);font-size:13px}
        .members-page .member-empty{padding:48px 20px;text-align:center;color:var(--crm-muted);font-size:13px}

        .members-page .member-pagination{display:flex;justify-content:space-between;align-items:center;padding:13px 16px;border-top:1px solid var(--crm-border);font-size:13px;color:var(--crm-muted);gap:12px;flex:0 0 auto;background:var(--crm-surface)}
        .members-page .member-pagination-actions{display:flex;align-items:center;gap:10px}

        .members-page .member-modal-backdrop{position:fixed;inset:0;background:rgba(15,23,42,.45);display:grid;place-items:center;padding:20px;z-index:500}
        .members-page .member-modal{width:min(680px,100%);max-height:90vh;overflow:auto;background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:15px;box-shadow:0 25px 70px rgba(0,0,0,.2)}
        .members-page .member-modal-head{display:flex;justify-content:space-between;align-items:center;padding:17px 20px;border-bottom:1px solid var(--crm-border);position:sticky;top:0;background:var(--crm-surface);z-index:2}
        .members-page .member-modal-title{margin:0;font-size:16px;font-weight:400;color:var(--crm-text)}
        .members-page .member-modal-close{border:0;background:transparent;color:var(--crm-muted);width:32px;height:32px;display:grid;place-items:center;border-radius:8px;cursor:pointer}
        .members-page .member-modal-close:hover{background:var(--crm-surface-2);color:var(--crm-text)}

        .members-page .member-form{padding:20px;display:grid;grid-template-columns:1fr 1fr;gap:14px}
        .members-page .member-field{display:grid;gap:6px;min-width:0}
        .members-page .member-field.full{grid-column:1/-1}
        .members-page .member-field label{font-size:13px;font-weight:400;color:var(--crm-text)}
        .members-page .member-field input,.members-page .member-field select,.members-page .member-field textarea{width:100%;box-sizing:border-box;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:9px;padding:10px 11px;outline:0;font:inherit}
        .members-page .member-field input::placeholder,.members-page .member-field textarea::placeholder{color:var(--crm-muted)}
        .members-page .member-field input:focus,.members-page .member-field select:focus,.members-page .member-field textarea:focus{border-color:var(--crm-primary)}
        .members-page .member-field-help{font-size:13px;color:var(--crm-muted);line-height:1.4}

        .members-page .member-modal-foot{display:flex;justify-content:flex-end;gap:8px;padding:14px 20px;border-top:1px solid var(--crm-border);position:sticky;bottom:0;background:var(--crm-surface)}

        .members-page .member-view-grid{padding:20px;display:grid;grid-template-columns:1fr 1fr;gap:14px}
        .members-page .member-view-card{border:1px solid var(--crm-border);border-radius:10px;padding:12px;background:var(--crm-surface-2)}
        .members-page .member-view-card.full{grid-column:1/-1}
        .members-page .member-view-label{font-size:13px;color:var(--crm-muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:5px}
        .members-page .member-view-text{font-size:13px;color:var(--crm-text);font-weight:400;word-break:break-word}
        .members-page .member-view-profile{display:flex;align-items:center;gap:12px}
        .members-page .member-view-avatar{width:44px;height:44px;border-radius:12px;background:var(--crm-primary-soft);color:var(--crm-primary);display:grid;place-items:center;font-size:13px;font-weight:400;overflow:hidden}
        .members-page .member-view-avatar img{width:100%;height:100%;object-fit:cover}
        .members-page .member-view-name{font-size:14px;font-weight:400;color:var(--crm-text)}
        .members-page .member-view-email{font-size:13px;color:var(--crm-muted);margin-top:3px}

        @media(max-width:900px){
          .members-page .member-stats{grid-template-columns:repeat(2,minmax(0,1fr))}
          .members-page .member-table-card{height:calc(100vh - 390px)}
        }

        @media(max-width:700px){
          .members-page{padding:18px 14px 30px}
          .members-page .members-head{align-items:flex-start;flex-direction:column}
          .members-page .members-actions{width:100%}
          .members-page .members-actions .members-btn{flex:1}
          .members-page .member-toolbar{align-items:stretch;flex-direction:column}
          .members-page .member-search-wrap{max-width:100%;min-width:0}
          .members-page .member-filter{width:100%;max-width:100%}
          .members-page .member-table-card{height:calc(100vh - 450px);min-height:280px}
          .members-page .member-form{grid-template-columns:1fr}
          .members-page .member-field.full{grid-column:auto}
          .members-page .member-pagination{align-items:flex-start;flex-direction:column}
          .members-page .member-pagination-actions{width:100%;justify-content:space-between}
          .members-page .member-view-grid{grid-template-columns:1fr}
          .members-page .member-view-card.full{grid-column:auto}
        }
      `}</style>

      <div className="members-head">
        <div className="members-heading">
          <h1 className="members-title">Members</h1>

          <p className="members-sub">Manage users and members connected to your BR30 CRM business workspace.</p>
        </div>

        <div className="members-actions">
          <button type="button" className="members-btn" onClick={() => loadMembers(pagination.page || 1, statusFilter)} disabled={loading}>
            <RefreshCw size={15} />
            Refresh
          </button>

          {canManage && <button type="button" className="members-btn primary" onClick={openCreate}>
            <Plus size={15} />
            Add Member
          </button>}
        </div>
      </div>

      <div className="member-stats">
        {memberStats.map((stat) => {
          const Icon = stat.icon;

          return (
            <article className="member-stat" key={stat.title}>
              <div className="member-stat-content">
                <div className="member-stat-copy">
                  <div className="member-stat-title">{stat.title}</div>

                  <div className="member-stat-value">{stat.value}</div>

                  <div className="member-stat-detail">{stat.detail}</div>
                </div>

                <div className={`member-stat-icon ${stat.tone}`}>
                  <Icon size={18} />
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {(error || businessError) && <div className="member-error">{error || businessError}</div>}

      <div className="member-toolbar">
        <div className="member-search-wrap">
          <Search className="member-search-icon" />

          <input className="member-search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search members..." />

          {search && (
            <button type="button" className="member-search-clear" onClick={clearSearch} aria-label="Clear search" title="Clear search">
              <X size={15} />
            </button>
          )}
        </div>

        <select className="member-filter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="SUSPENDED">Suspended</option>
        </select>

        {(search || statusFilter) && (
          <button type="button" className="members-btn" onClick={clearFilters}>
            Clear Filters
          </button>
        )}
      </div>

      <div className="member-table-card">
        <div className="member-table-scroll">
          <table className="member-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading || businessLoading ? (
                <tr>
                  <td colSpan={7}>
                    <div className="member-empty">Loading members...</div>
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="member-empty">No members found.</div>
                  </td>
                </tr>
              ) : (
                filteredItems.map((member) => {
                  const name = getMemberName(member);

                  return (
                    <tr key={member._id}>
                      <td>
                        <div className="member-name-cell">
                          <div className="member-avatar">{member?.userId?.profileImage ? <img src={member.userId.profileImage} alt={name} /> : getInitials(name)}</div>

                          <div>
                            <div className="member-name-main">{name}</div>

                            <div className="member-name-sub">{member?.userId?._id ? `User ID: ${member.userId._id}` : "Business member"}</div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="member-email">{getMemberEmail(member)}</span>
                      </td>

                      <td>
                        <span className="member-phone">{getMemberPhone(member)}</span>
                      </td>

                      <td>
                        <span className={`member-role ${!member?.roleId ? "muted" : ""}`}>
                          <ShieldCheck size={12} />
                          {getRoleName(member)}
                        </span>
                      </td>

                      <td>
                        <StatusBadge status={member?.status} />
                      </td>

                      <td>{formatDate(member?.joinedAt)}</td>

                      <td>
                        <div className="member-actions-cell">
                          <button type="button" className="member-icon-btn" onClick={() => openView(member)} title="View" aria-label="View Member">
                            <Eye size={14} />
                          </button>

                          {canManage && (
                            <button type="button" className="member-icon-btn" onClick={() => openEdit(member)} title="Edit" aria-label="Edit Member">
                              <Pencil size={14} />
                            </button>
                          )}

                          {canManage && member?.status !== "INACTIVE" && (
                            <button type="button" className="member-icon-btn danger" onClick={() => deactivateMember(member)} title="Remove" aria-label="Remove Member">
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

        <div className="member-pagination">
          <span>{pagination.total ?? items.length} total</span>

          <div className="member-pagination-actions">
            <button type="button" className="members-btn" disabled={loading || (pagination.page || 1) <= 1} onClick={() => loadMembers((pagination.page || 1) - 1, statusFilter)}>
              Previous
            </button>

            <span>
              Page {pagination.page || 1} / {pagination.totalPages || 1}
            </span>

            <button type="button" className="members-btn" disabled={loading || (pagination.page || 1) >= (pagination.totalPages || 1)} onClick={() => loadMembers((pagination.page || 1) + 1, statusFilter)}>
              Next
            </button>
          </div>
        </div>
      </div>

      {modal && (modal.mode === "create" || modal.mode === "edit") && (
        <div
          className="member-modal-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !saving) {
              setModal(null);
            }
          }}>
          <div className="member-modal">
            <div className="member-modal-head">
              <h2 className="member-modal-title">{modal.mode === "create" ? "Add Member" : "Edit Member"}</h2>

              <button type="button" className="member-modal-close" onClick={() => !saving && setModal(null)} disabled={saving} aria-label="Close">
                <X size={17} />
              </button>
            </div>

            <div className="member-form">
              {modal.mode === "create" && (
                <div className="member-field full">
                  <label>User ID *</label>

                  <input
                    type="text"
                    value={form.userId}
                    onChange={(e) =>
                      setForm((current) => ({
                        ...current,
                        userId: e.target.value,
                      }))
                    }
                    placeholder="Enter User ID"
                  />

                  <div className="member-field-help">Enter the existing User ID that should be added to this business.</div>
                </div>
              )}

              {modal.mode === "edit" && (
                <div className="member-field full">
                  <label>Member</label>

                  <input type="text" value={getMemberName(selectedMember || modal.item)} readOnly />
                </div>
              )}

              <div className="member-field">
                <label>Role ID</label>

                <input
                  type="text"
                  value={form.roleId}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      roleId: e.target.value,
                    }))
                  }
                  placeholder="Enter Role ID"
                />

                <div className="member-field-help">Optional. Leave empty if no role is assigned.</div>
              </div>

              <div className="member-field">
                <label>Status</label>

                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      status: e.target.value,
                    }))
                  }>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                  <option value="SUSPENDED">SUSPENDED</option>
                </select>
              </div>
            </div>

            <div className="member-modal-foot">
              <button type="button" className="members-btn" onClick={() => !saving && setModal(null)} disabled={saving}>
                Cancel
              </button>

              <button type="button" className="members-btn primary" disabled={saving} onClick={saveMember}>
                {saving ? "Saving..." : modal.mode === "create" ? "Add Member" : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {modal && modal.mode === "view" && (
        <div
          className="member-modal-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setModal(null);
            }
          }}>
          <div className="member-modal">
            <div className="member-modal-head">
              <h2 className="member-modal-title">Member Details</h2>

              <button type="button" className="member-modal-close" onClick={() => setModal(null)} aria-label="Close">
                <X size={17} />
              </button>
            </div>

            <div className="member-view-grid">
              <div className="member-view-card full">
                <div className="member-view-profile">
                  <div className="member-view-avatar">{modal.item?.userId?.profileImage ? <img src={modal.item.userId.profileImage} alt={getMemberName(modal.item)} /> : getInitials(getMemberName(modal.item))}</div>

                  <div>
                    <div className="member-view-name">{getMemberName(modal.item)}</div>

                    <div className="member-view-email">{getMemberEmail(modal.item)}</div>
                  </div>
                </div>
              </div>

              <div className="member-view-card">
                <div className="member-view-label">Email</div>

                <div className="member-view-text">{getMemberEmail(modal.item)}</div>
              </div>

              <div className="member-view-card">
                <div className="member-view-label">Phone</div>

                <div className="member-view-text">{getMemberPhone(modal.item)}</div>
              </div>

              <div className="member-view-card">
                <div className="member-view-label">Role</div>

                <div className="member-view-text">{getRoleName(modal.item)}</div>
              </div>

              <div className="member-view-card">
                <div className="member-view-label">Status</div>

                <div className="member-view-text">
                  <StatusBadge status={modal.item?.status} />
                </div>
              </div>

              <div className="member-view-card">
                <div className="member-view-label">Joined</div>

                <div className="member-view-text">{formatDate(modal.item?.joinedAt)}</div>
              </div>

              <div className="member-view-card">
                <div className="member-view-label">User ID</div>

                <div className="member-view-text">{modal.item?.userId?._id || "—"}</div>
              </div>

              <div className="member-view-card full">
                <div className="member-view-label">Member ID</div>

                <div className="member-view-text">{modal.item?._id || "—"}</div>
              </div>
            </div>

            <div className="member-modal-foot">
              <button type="button" className="members-btn" onClick={() => setModal(null)}>
                Close
              </button>

              <button type="button" className="members-btn primary" onClick={() => openEdit(modal.item)}>
                <Pencil size={14} />
                Edit Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
