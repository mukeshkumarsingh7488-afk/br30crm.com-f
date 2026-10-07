import { useEffect, useMemo, useState } from "react";
import { Ban, CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, Clock3, Edit3, Eye, Mail, Phone, RefreshCw, Search, ShieldCheck, Trash2, UserCheck, UserX, Users, X } from "lucide-react";
import Swal from "sweetalert2";

import { getAdminOverview, getAdminUser, updateAdminUser, updateAdminUserStatus, deleteAdminUser } from "../../api/admin.api";

function formatDate(value) {
  if (!value) return "Never";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(value) {
  if (!value) return "Never";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getInitials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (!parts.length) return "U";

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function getUserId(user) {
  return user?._id || user?.id || "";
}

function getStatusLabel(status) {
  if (status === "ACTIVE") return "Active";
  if (status === "INACTIVE") return "Inactive";
  if (status === "SUSPENDED") return "Suspended";

  return status || "Unknown";
}

function getStatusClass(status) {
  if (status === "ACTIVE") {
    return "admin-user-status active";
  }

  if (status === "SUSPENDED") {
    return "admin-user-status suspended";
  }

  return "admin-user-status inactive";
}

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [verificationFilter, setVerificationFilter] = useState("ALL");

  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  });

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
  });

  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [savingEdit, setSavingEdit] = useState(false);

  const [adminTheme, setAdminTheme] = useState(() => {
    if (typeof document === "undefined") {
      return "light";
    }

    return document.documentElement.getAttribute("data-admin-theme") === "dark" ? "dark" : "light";
  });

  useEffect(() => {
    const root = document.documentElement;

    const syncTheme = () => {
      setAdminTheme(root.getAttribute("data-admin-theme") === "dark" ? "dark" : "light");
    };

    syncTheme();

    const observer = new MutationObserver(syncTheme);

    observer.observe(root, {
      attributes: true,
      attributeFilter: ["data-admin-theme"],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const getSweetAlertTheme = () => {
    const currentTheme = document.documentElement.getAttribute("data-admin-theme");

    const isDark = currentTheme === "dark";

    return {
      background: isDark ? "#0f172a" : "#ffffff",
      color: isDark ? "#f8fafc" : "#0f172a",

      confirmButtonColor: isDark ? "#2563eb" : "#2563eb",

      cancelButtonColor: isDark ? "#334155" : "#e2e8f0",

      borderColor: isDark ? "#263449" : "#e2e8f0",

      muted: isDark ? "#94a3b8" : "#64748b",

      inputBackground: isDark ? "#172033" : "#ffffff",

      inputBorder: isDark ? "#34445c" : "#cbd5e1",
    };
  };

  const fireAlert = async (options = {}) => {
    const colors = getSweetAlertTheme();

    return Swal.fire({
      background: colors.background,
      color: colors.color,

      confirmButtonColor: colors.confirmButtonColor,
      cancelButtonColor: colors.cancelButtonColor,

      customClass: {
        popup: "admin-users-swal-popup",
        title: "admin-users-swal-title",
        htmlContainer: "admin-users-swal-content",
        confirmButton: "admin-users-swal-confirm",
        cancelButton: "admin-users-swal-cancel",
      },

      ...options,
    });
  };

  const loadUsers = async (showLoader = true) => {
    try {
      if (showLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      const response = await getAdminOverview({
        page,
        limit,
      });

      const data = response?.data || response;

      const overview = data?.stats || data?.data?.stats || data;

      const userData = overview?.users || {};

      setUsers(Array.isArray(userData.list) ? userData.list : []);

      setStats({
        total: Number(userData.total || 0),
        active: Number(userData.active || 0),
      });

      setPagination({
        page: Number(userData.pagination?.page || page),
        limit: Number(userData.pagination?.limit || limit),
        total: Number(userData.pagination?.total || 0),
        totalPages: Number(userData.pagination?.totalPages || 1),
      });
    } catch (error) {
      await fireAlert({
        icon: "error",
        title: "Unable to load users",
        text: error?.response?.data?.message || error?.message || "Something went wrong while loading users.",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadUsers(true);
  }, [page, limit]);

  const filteredUsers = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return users.filter((user) => {
      const userId = String(getUserId(user)).toLowerCase();

      const name = String(user?.name || "").toLowerCase();

      const email = String(user?.email || "").toLowerCase();

      const phone = String(user?.phone || "").toLowerCase();

      const matchesSearch = !searchValue || userId.includes(searchValue) || name.includes(searchValue) || email.includes(searchValue) || phone.includes(searchValue);

      const matchesStatus = statusFilter === "ALL" || String(user?.status || "").toUpperCase() === statusFilter;

      const verified = user?.emailVerified === true;

      const matchesVerification = verificationFilter === "ALL" || (verificationFilter === "VERIFIED" && verified) || (verificationFilter === "UNVERIFIED" && !verified);

      return matchesSearch && matchesStatus && matchesVerification;
    });
  }, [users, search, statusFilter, verificationFilter]);

  const verifiedCount = useMemo(() => {
    return users.filter((user) => user?.emailVerified === true).length;
  }, [users]);

  const blockedCount = useMemo(() => {
    return users.filter((user) => user?.status === "SUSPENDED" || user?.status === "INACTIVE").length;
  }, [users]);

  const handleRefresh = async () => {
    await loadUsers(false);
  };

  const handleView = async (user) => {
    const userId = getUserId(user);

    if (!userId) return;

    try {
      const response = await getAdminUser(userId);

      const data = response?.data || response;

      const detailedUser = data?.user || data?.data?.user || data;

      setSelectedUser({
        ...user,
        ...detailedUser,
        businessId: detailedUser?.businessId || user?.businessId || null,
        membershipId: detailedUser?.membershipId || user?.membershipId || null,
      });
    } catch (error) {
      setSelectedUser(user);

      await fireAlert({
        icon: "error",
        title: "Unable to load user details",
        text: error?.response?.data?.message || error?.message || "Something went wrong while loading user details.",
        confirmButtonText: "OK",
      });
    }
  };

  const handleEditOpen = (user) => {
    setEditingUser(user);

    setEditForm({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    });
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;

    setEditForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();

    if (!editingUser) return;

    const userId = getUserId(editingUser);

    if (!userId) {
      await fireAlert({
        icon: "error",
        title: "Invalid user",
        text: "User ID was not found.",
      });

      return;
    }

    if (!editForm.name.trim()) {
      await fireAlert({
        icon: "warning",
        title: "Name required",
        text: "Please enter the user's name.",
      });

      return;
    }

    if (!editForm.email.trim()) {
      await fireAlert({
        icon: "warning",
        title: "Email required",
        text: "Please enter the user's email.",
      });

      return;
    }

    try {
      setSavingEdit(true);

      await updateAdminUser(userId, {
        name: editForm.name.trim(),
        email: editForm.email.trim().toLowerCase(),
        phone: editForm.phone.trim() || null,
      });

      setEditingUser(null);

      await fireAlert({
        icon: "success",
        title: "User updated",
        text: "User information has been updated successfully.",
        timer: 1800,
        showConfirmButton: false,
      });

      await loadUsers(false);
    } catch (error) {
      await fireAlert({
        icon: "error",
        title: "Update failed",
        text: error?.response?.data?.message || error?.message || "Unable to update user.",
        confirmButtonText: "OK",
      });
    } finally {
      setSavingEdit(false);
    }
  };

  const handleToggleStatus = async (user) => {
    const userId = getUserId(user);

    if (!userId) return;

    const isActive = user?.status === "ACTIVE";

    const result = await fireAlert({
      icon: isActive ? "warning" : "question",

      title: isActive ? "Block this user?" : "Activate this user?",

      html: isActive ? `Are you sure you want to block <strong>${user?.name || "this user"}</strong>?` : `Are you sure you want to activate <strong>${user?.name || "this user"}</strong>?`,

      showCancelButton: true,

      confirmButtonText: isActive ? "Yes, block user" : "Yes, activate",

      cancelButtonText: "Cancel",

      reverseButtons: true,

      focusCancel: true,

      allowOutsideClick: false,
    });

    if (!result.isConfirmed) return;

    try {
      const nextStatus = isActive ? "SUSPENDED" : "ACTIVE";

      await updateAdminUserStatus(userId, nextStatus);

      await fireAlert({
        icon: "success",

        title: isActive ? "User blocked" : "User activated",

        text: isActive ? "The user has been blocked successfully." : "The user has been activated successfully.",

        timer: 1800,

        showConfirmButton: false,
      });

      await loadUsers(false);
    } catch (error) {
      await fireAlert({
        icon: "error",
        title: "Action failed",
        text: error?.response?.data?.message || error?.message || "Unable to update user status.",
      });
    }
  };

  const handleDelete = async (user) => {
    const userId = getUserId(user);

    if (!userId) return;

    const result = await fireAlert({
      icon: "warning",

      title: "Delete user?",

      html: `
        <div style="line-height:1.6;">
          This action cannot be undone.<br />
          User <strong>${user?.name || "this user"}</strong>
          and their account will be permanently deleted.
        </div>
      `,

      showCancelButton: true,

      confirmButtonText: "Yes, delete user",

      cancelButtonText: "Cancel",

      confirmButtonColor: "#dc2626",

      reverseButtons: true,

      focusCancel: true,

      allowOutsideClick: false,
    });

    if (!result.isConfirmed) return;

    try {
      await deleteAdminUser(userId);

      await fireAlert({
        icon: "success",

        title: "User deleted",

        text: "The user has been permanently deleted.",

        timer: 1800,

        showConfirmButton: false,
      });

      if (users.length === 1 && page > 1) {
        setPage((previous) => Math.max(previous - 1, 1));
      } else {
        await loadUsers(false);
      }
    } catch (error) {
      await fireAlert({
        icon: "error",
        title: "Delete failed",
        text: error?.response?.data?.message || error?.message || "Unable to delete user.",
      });
    }
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
    setVerificationFilter("ALL");
    setPage(1);
  };

  return (
    <>
      <style>{`
.admin-users-page{width:100%;min-width:0;padding:28px 28px 45px;box-sizing:border-box;color:var(--admin-text);background:transparent;}
.admin-users-head{display:flex;align-items:flex-start;justify-content:space-between;gap:20px;margin-bottom:24px;}
.admin-users-title{margin:0;color:var(--admin-text);font-size:29px;line-height:1.2}
.admin-users-subtitle{margin:8px 0 0;color:var(--admin-muted);font-size:14px;line-height:1.6;}
.admin-users-head-actions{display:flex;align-items:center;gap:10px;flex-shrink:0;}
.admin-users-refresh{width:40px;height:40px;border:1px solid var(--admin-border);background:var(--admin-surface);color:var(--admin-text);border-radius:10px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:.2s ease;box-shadow:var(--admin-shadow-sm);}
.admin-users-refresh:hover{border-color:var(--admin-primary);color:var(--admin-primary);background:var(--admin-surface-2);transform:translateY(-1px);}
.admin-users-refresh:disabled{opacity:.55;cursor:not-allowed;transform:none;}
.admin-users-refresh.spinning svg{animation:adminUsersSpin .8s linear infinite;}
@keyframes adminUsersSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}

.admin-users-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;margin-bottom:20px;}
.admin-users-stat{min-width:0;padding:18px;border:1px solid var(--admin-border);border-radius:14px;background:var(--admin-surface);box-shadow:var(--admin-shadow-sm);display:flex;align-items:center;gap:14px;box-sizing:border-box;}
.admin-users-stat-icon{width:42px;height:42px;border-radius:11px;display:flex;align-items:center;justify-content:center;background:var(--admin-primary-soft);color:var(--admin-primary);flex-shrink:0;}
.admin-users-stat-icon.green{background:var(--admin-success-bg);color:var(--admin-success);}
.admin-users-stat-icon.orange{background:var(--admin-warning-bg);color:var(--admin-warning);}
.admin-users-stat-icon.red{background:var(--admin-danger-bg);color:var(--admin-danger);}
.admin-users-stat-label{color:var(--admin-muted);font-size:13px;font-weight:400;margin-bottom:4px;}
.admin-users-stat-value{color:var(--admin-text);font-size:22px;font-weight:400;line-height:1;}

.admin-users-toolbar{display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:14px;margin-bottom:16px;border:1px solid var(--admin-border);border-radius:14px;background:var(--admin-surface);box-shadow:var(--admin-shadow-sm);}
.admin-users-search{position:relative;flex:1 1 280px;min-width:220px;}
.admin-users-search>svg{position:absolute;left:13px;top:50%;transform:translateY(-50%);color:var(--admin-muted);pointer-events:none;z-index:2;}
.admin-users-search input{width:100%;height:40px;box-sizing:border-box;border:1px solid var(--admin-border);border-radius:9px;background:var(--admin-surface-2);color:var(--admin-text);padding:0 42px 0 39px;outline:none;font-size:13px;transition:.18s ease;color-scheme:light dark;}
.admin-users-search input::placeholder{color:var(--admin-placeholder);}
.admin-users-search input:hover{border-color:var(--admin-border-strong);}
.admin-users-search input:focus{border-color:var(--admin-primary);background:var(--admin-surface);box-shadow:0 0 0 3px rgba(37,99,235,.10);}
.admin-users-search button{position:absolute;right:8px;top:50%;transform:translateY(-50%);width:25px;height:25px;padding:0;border:0;border-radius:7px;background:transparent;color:var(--admin-muted);display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:3;}
.admin-users-search button:hover{background:var(--admin-surface-3);color:var(--admin-text);}
.admin-users-select{height:40px;min-width:145px;border:1px solid var(--admin-border);border-radius:9px;background:var(--admin-surface-2);color:var(--admin-text);padding:0 12px;outline:none;font-size:13px;cursor:pointer;transition:.18s ease;color-scheme:light dark;}
.admin-users-select:hover{border-color:var(--admin-border-strong);}
.admin-users-select:focus{border-color:var(--admin-primary);background:var(--admin-surface);box-shadow:0 0 0 3px rgba(37,99,235,.10);}
.admin-users-select option{background:var(--admin-surface);color:var(--admin-text);}
.admin-users-clear{height:40px;padding:0 13px;display:inline-flex;align-items:center;gap:7px;border:1px solid var(--admin-border);border-radius:9px;background:var(--admin-surface);color:var(--admin-muted);cursor:pointer;font-size:13px;font-weight:400;transition:.18s ease;}
.admin-users-clear:hover{color:var(--admin-text);border-color:var(--admin-primary);background:var(--admin-surface-2);}

.admin-users-table-card{width:100%;border:1px solid var(--admin-border);border-radius:14px;background:var(--admin-surface);box-shadow:var(--admin-shadow-sm);overflow:hidden;}
.admin-users-table-wrap{width:100%;overflow:hidden;}
.admin-users-table{width:100%;border-collapse:collapse;table-layout:fixed;background:var(--admin-surface);}
.admin-users-table th{padding:13px 14px;text-align:left;background:var(--admin-surface-2);color:var(--admin-muted);font-size:13px;font-weight:400;letter-spacing:.05em;text-transform:uppercase;border-bottom:1px solid var(--admin-border);}
.admin-users-table td{padding:14px;border-bottom:1px solid var(--admin-border);vertical-align:middle;color:var(--admin-text);font-size:13px;background:var(--admin-surface);}
.admin-users-table tbody tr:last-child td{border-bottom:none;}
.admin-users-table tbody tr{transition:background .16s ease;}
.admin-users-table tbody tr:hover td{background:var(--admin-surface-2);}
.admin-users-table th:nth-child(1),.admin-users-table td:nth-child(1){width:27%;}
.admin-users-table th:nth-child(2),.admin-users-table td:nth-child(2){width:15%;}
.admin-users-table th:nth-child(3),.admin-users-table td:nth-child(3){width:12%;}
.admin-users-table th:nth-child(4),.admin-users-table td:nth-child(4){width:13%;}
.admin-users-table th:nth-child(5),.admin-users-table td:nth-child(5){width:12%;}
.admin-users-table th:nth-child(6),.admin-users-table td:nth-child(6){width:10%;}
.admin-users-table th:nth-child(7),.admin-users-table td:nth-child(7){width:11%;}

.admin-user-main{display:flex;align-items:center;gap:10px;min-width:0;}
.admin-user-avatar{width:38px;height:38px;flex:0 0 38px;border-radius:10px;background:var(--admin-primary-soft);color:var(--admin-primary);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:400;}
.admin-user-info{min-width:0;}
.admin-user-name{font-size:13px;font-weight:400;color:var(--admin-text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.admin-user-contact{margin-top:3px;display:flex;flex-direction:column;gap:2px;color:var(--admin-muted);font-size:13px;line-height:1.3;}
.admin-user-contact span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.admin-user-id{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;color:var(--admin-muted);font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}

.admin-user-status{display:inline-flex;align-items:center;gap:6px;padding:5px 8px;border-radius:999px;font-size:13px;font-weight:400;white-space:nowrap;}
.admin-user-status.active{color:var(--admin-success);background:var(--admin-success-bg);}
.admin-user-status.inactive{color:var(--admin-warning);background:var(--admin-warning-bg);}
.admin-user-status.suspended{color:var(--admin-danger);background:var(--admin-danger-bg);}
.admin-user-verify{display:inline-flex;align-items:center;gap:5px;font-size:13px;font-weight:400;white-space:nowrap;}
.admin-user-verify.verified{color:var(--admin-success);}
.admin-user-verify.unverified{color:var(--admin-warning);}

.admin-user-date{display:flex;flex-direction:column;gap:2px;}
.admin-user-date strong{color:var(--admin-text);font-size:13px;font-weight:400;}
.admin-user-date span{color:var(--admin-muted);font-size:13px;}

.admin-user-actions{display:flex;align-items:center;justify-content:flex-end;gap:5px;}
.admin-user-action{width:32px;height:32px;display:flex;align-items:center;justify-content:center;border:1px solid var(--admin-border);background:var(--admin-surface);color:var(--admin-muted);border-radius:8px;cursor:pointer;transition:.18s ease;}
.admin-user-action:hover{color:var(--admin-primary);border-color:var(--admin-primary);background:var(--admin-surface-2);}
.admin-user-action.danger:hover{color:var(--admin-danger);border-color:var(--admin-danger);background:var(--admin-danger-bg);}
.admin-user-action.success:hover{color:var(--admin-success);border-color:var(--admin-success);background:var(--admin-success-bg);}

.admin-users-empty{padding:55px 20px;text-align:center;color:var(--admin-muted);background:var(--admin-surface);}
.admin-users-empty strong{color:var(--admin-text);}
.admin-users-empty-icon{width:48px;height:48px;margin:0 auto 12px;border-radius:12px;background:var(--admin-primary-soft);color:var(--admin-primary);display:flex;align-items:center;justify-content:center;}
.admin-users-loading{padding:55px 20px;text-align:center;color:var(--admin-muted);background:var(--admin-surface);}
.admin-users-spinner{width:28px;height:28px;border:3px solid var(--admin-border);border-top-color:var(--admin-primary);border-radius:50%;animation:adminUsersSpin .8s linear infinite;margin:0 auto 12px;}

.admin-users-footer{display:flex;align-items:center;justify-content:space-between;gap:15px;padding:14px 16px;border-top:1px solid var(--admin-border);background:var(--admin-surface);color:var(--admin-text);}
.admin-users-count{color:var(--admin-muted);font-size:13px;}
.admin-users-count strong{color:var(--admin-text);}
.admin-users-pagination{display:flex;align-items:center;gap:7px;}
.admin-users-page-btn{width:34px;height:34px;display:flex;align-items:center;justify-content:center;border:1px solid var(--admin-border);border-radius:8px;background:var(--admin-surface);color:var(--admin-text);cursor:pointer;}
.admin-users-page-btn:hover:not(:disabled){border-color:var(--admin-primary);color:var(--admin-primary);background:var(--admin-surface-2);}
.admin-users-page-btn:disabled{opacity:.45;cursor:not-allowed;}
.admin-users-page-number{min-width:34px;height:34px;padding:0 8px;display:flex;align-items:center;justify-content:center;border-radius:8px;background:var(--admin-primary);color:#fff;font-size:13px;font-weight:400;}

.admin-users-overlay{position:fixed;top:70px;left:var(--admin-current-sidebar-width,260px);right:0;bottom:0;z-index:90;background:rgba(2,6,23,.58);display:flex;align-items:center;justify-content:center;padding:20px;box-sizing:border-box;}
.admin-users-modal{width:min(620px,100%);max-height:calc(100vh - 110px);overflow:auto;background:var(--admin-surface);color:var(--admin-text);border:1px solid var(--admin-border);border-radius:16px;box-shadow:var(--admin-shadow-md);}
.admin-users-modal-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:20px 22px;border-bottom:1px solid var(--admin-border);background:var(--admin-surface);}
.admin-users-modal-title{margin:0;font-size:18px;font-weight:400;color:var(--admin-text);}
.admin-users-modal-close{width:34px;height:34px;border:1px solid var(--admin-border);border-radius:8px;background:var(--admin-surface);color:var(--admin-muted);display:flex;align-items:center;justify-content:center;cursor:pointer;}
.admin-users-modal-close:hover{color:var(--admin-text);border-color:var(--admin-primary);background:var(--admin-surface-2);}
.admin-users-modal-body{padding:22px;background:var(--admin-surface);}

.admin-user-detail-top{display:flex;align-items:center;gap:14px;padding:15px;background:var(--admin-surface-2);border:1px solid var(--admin-border);border-radius:12px;margin-bottom:18px;}
.admin-user-detail-avatar{width:50px;height:50px;border-radius:13px;background:var(--admin-primary-soft);color:var(--admin-primary);display:flex;align-items:center;justify-content:center;font-weight:400;}
.admin-user-detail-name{margin:0 0 4px;font-size:17px;font-weight:400;color:var(--admin-text);}
.admin-user-detail-email{color:var(--admin-muted);font-size:13px;}
.admin-user-detail-top-info{min-width:0;flex:1;display:flex;align-items:center;justify-content:space-between;gap:20px;}
.admin-user-detail-business{min-width:0;flex:0 0 250px;display:flex;flex-direction:column;align-items:flex-end;gap:8px;}
.admin-user-detail-business-item{min-width:0;text-align:right;}
.admin-user-detail-business-label{color:var(--admin-muted);font-size:11px;font-weight:400;text-transform:uppercase;letter-spacing:.05em;margin-bottom:3px;}
.admin-user-detail-business-value{color:var(--admin-text);font-size:11px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:250px;}
.admin-user-detail-business-label{color:var(--admin-muted);font-size:11px;font-weight:400;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px;}
.admin-user-detail-business-value{color:var(--admin-text);font-size:12px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:240px;}
.admin-user-detail-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;}
.admin-user-detail-item{padding:13px;border:1px solid var(--admin-border);border-radius:10px;min-width:0;background:var(--admin-surface);color:var(--admin-text);}
.admin-user-detail-label{color:var(--admin-muted);font-size:13px;font-weight:400;text-transform:uppercase;letter-spacing:.05em;margin-bottom:5px;}
.admin-user-detail-value{color:var(--admin-text);font-size:13px;font-weight:400;overflow-wrap:anywhere;}

.admin-users-form{display:flex;flex-direction:column;gap:15px;}
.admin-users-form-field{display:flex;flex-direction:column;gap:6px;}
.admin-users-form-label{color:var(--admin-text);font-size:13px;font-weight:400;}
.admin-users-form-input{width:100%;height:42px;box-sizing:border-box;border:1px solid var(--admin-border);border-radius:9px;background:var(--admin-surface-2);color:var(--admin-text);padding:0 12px;outline:none;font-size:13px;transition:.18s ease;color-scheme:light dark;}
.admin-users-form-input::placeholder{color:var(--admin-placeholder);}
.admin-users-form-input:hover{border-color:var(--admin-border-strong);}
.admin-users-form-input:focus{border-color:var(--admin-primary);background:var(--admin-surface);box-shadow:0 0 0 3px rgba(37,99,235,.10);}
.admin-users-form-actions{display:flex;justify-content:flex-end;gap:9px;margin-top:4px;}
.admin-users-form-btn{height:40px;padding:0 15px;border-radius:9px;border:1px solid var(--admin-border);background:var(--admin-surface);color:var(--admin-text);cursor:pointer;font-size:13px;font-weight:400;}
.admin-users-form-btn:hover:not(:disabled){background:var(--admin-surface-2);border-color:var(--admin-border-strong);}
.admin-users-form-btn.primary{background:var(--admin-primary);color:#fff;border-color:var(--admin-primary);}
.admin-users-form-btn.primary:hover:not(:disabled){background:var(--admin-primary-hover);border-color:var(--admin-primary-hover);}
.admin-users-form-btn:disabled{opacity:.55;cursor:not-allowed;}

.admin-users-swal-popup{background:var(--admin-surface)!important;color:var(--admin-text)!important;border:1px solid var(--admin-border)!important;border-radius:16px!important;box-shadow:var(--admin-shadow-md)!important;}
.admin-users-swal-title{font-size:20px!important;font-weight:400!important;color:var(--admin-text)!important;}
.admin-users-swal-content{font-size:13px!important;color:var(--admin-text-secondary)!important;}
.admin-users-swal-confirm,.admin-users-swal-cancel{border-radius:9px!important;font-size:13px!important;font-weight:400!important;padding:9px 16px!important;}
.admin-users-swal-cancel{color:var(--admin-text)!important;background:var(--admin-surface-2)!important;border:1px solid var(--admin-border)!important;}
.admin-users-swal-input{background:var(--admin-surface-2)!important;color:var(--admin-text)!important;border:1px solid var(--admin-border)!important;}

.admin-user-avatar{width:38px;height:38px;flex:0 0 38px;border-radius:10px;background:var(--admin-primary-soft);color:var(--admin-primary);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:400;overflow:hidden;}
.admin-user-avatar-image{width:100%;height:100%;display:block;object-fit:cover;border-radius:inherit;}
.admin-user-avatar-fallback{width:100%;height:100%;align-items:center;justify-content:center;background:var(--admin-primary-soft);color:var(--admin-primary);font-size:13px;font-weight:400;border-radius:inherit;}
.admin-user-detail-avatar{width:50px;height:50px;border-radius:13px;background:var(--admin-primary-soft);color:var(--admin-primary);display:flex;align-items:center;justify-content:center;font-weight:400;overflow:hidden;flex:0 0 50px;}
.admin-user-detail-avatar-image{width:100%;height:100%;display:block;object-fit:cover;border-radius:inherit;}
.admin-user-detail-avatar-fallback{width:100%;height:100%;align-items:center;justify-content:center;background:var(--admin-primary-soft);color:var(--admin-primary);font-weight:400;border-radius:inherit;}

[data-admin-theme="dark"] .admin-users-page,[data-admin-theme="dark"] .admin-users-page *{color-scheme:dark;}
[data-admin-theme="light"] .admin-users-page,[data-admin-theme="light"] .admin-users-page *{color-scheme:light;}
[data-admin-theme="dark"] .admin-users-search input,[data-admin-theme="dark"] .admin-users-select,[data-admin-theme="dark"] .admin-users-form-input{background:var(--admin-surface-2);color:var(--admin-text);border-color:var(--admin-border-strong);}
[data-admin-theme="dark"] .admin-users-table,[data-admin-theme="dark"] .admin-users-table tbody,[data-admin-theme="dark"] .admin-users-table tr,[data-admin-theme="dark"] .admin-users-table td{background:var(--admin-surface);}
[data-admin-theme="dark"] .admin-users-table th{background:var(--admin-surface-2);color:var(--admin-muted);border-color:var(--admin-border);}
[data-admin-theme="dark"] .admin-users-table tbody tr:hover td{background:var(--admin-surface-2);}
[data-admin-theme="dark"] .admin-users-modal,[data-admin-theme="dark"] .admin-users-modal-head,[data-admin-theme="dark"] .admin-users-modal-body,[data-admin-theme="dark"] .admin-user-detail-item,[data-admin-theme="dark"] .admin-users-footer{background:var(--admin-surface);color:var(--admin-text);}
[data-admin-theme="dark"] .admin-user-detail-top{background:var(--admin-surface-2);border-color:var(--admin-border);}
[data-admin-theme="dark"] .admin-users-select option{background:var(--admin-surface);color:var(--admin-text);}
[data-admin-theme="dark"] .admin-users-swal-popup{background:var(--admin-surface)!important;color:var(--admin-text)!important;}
[data-admin-theme="dark"] .swal2-popup{background:var(--admin-surface)!important;color:var(--admin-text)!important;}
[data-admin-theme="dark"] .swal2-title{color:var(--admin-text)!important;}
[data-admin-theme="dark"] .swal2-html-container{color:var(--admin-text-secondary)!important;}
[data-admin-theme="dark"] .swal2-input,[data-admin-theme="dark"] .swal2-textarea,[data-admin-theme="dark"] .swal2-select{background:var(--admin-surface-2)!important;color:var(--admin-text)!important;border-color:var(--admin-border-strong)!important;}
[data-admin-theme="light"] .swal2-popup{background:var(--admin-surface)!important;color:var(--admin-text)!important;}
[data-admin-theme="light"] .swal2-title{color:var(--admin-text)!important;}
[data-admin-theme="light"] .swal2-html-container{color:var(--admin-text-secondary)!important;}
[data-admin-theme="light"] .swal2-input,[data-admin-theme="light"] .swal2-textarea,[data-admin-theme="light"] .swal2-select{background:var(--admin-surface-2)!important;color:var(--admin-text)!important;border-color:var(--admin-border)!important;}

@media(max-width:1100px){
.admin-users-stats{grid-template-columns:repeat(2,minmax(0,1fr));}
.admin-users-table th:nth-child(2),.admin-users-table td:nth-child(2){display:none;}
.admin-users-table th:nth-child(1),.admin-users-table td:nth-child(1){width:31%;}
.admin-users-table th:nth-child(3),.admin-users-table td:nth-child(3){width:14%;}
.admin-users-table th:nth-child(4),.admin-users-table td:nth-child(4){width:15%;}
.admin-users-table th:nth-child(5),.admin-users-table td:nth-child(5){width:14%;}
.admin-users-table th:nth-child(6),.admin-users-table td:nth-child(6){width:13%;}
.admin-users-table th:nth-child(7),.admin-users-table td:nth-child(7){width:13%;}
}

@media(max-width:900px){
.admin-users-page{padding:22px 18px 40px;}
.admin-users-overlay{top:64px;left:0;padding:15px;}
.admin-users-modal{max-height:calc(100vh - 94px);}
}

@media(max-width:760px){
.admin-users-head{flex-direction:column;}
.admin-users-head-actions{width:100%;justify-content:flex-end;}
.admin-users-stats{grid-template-columns:1fr 1fr;gap:9px;}
.admin-users-stat{padding:13px;}
.admin-users-stat-icon{width:36px;height:36px;}
.admin-users-stat-value{font-size:18px;}
.admin-users-toolbar{align-items:stretch;}
.admin-users-search{flex-basis:100%;}
.admin-users-select{flex:1;min-width:0;}
.admin-users-table th:nth-child(4),.admin-users-table td:nth-child(4){display:none;}
.admin-users-table th:nth-child(1),.admin-users-table td:nth-child(1){width:42%;}
.admin-users-table th:nth-child(3),.admin-users-table td:nth-child(3){width:18%;}
.admin-users-table th:nth-child(5),.admin-users-table td:nth-child(5){width:17%;}
.admin-users-table th:nth-child(6),.admin-users-table td:nth-child(6){display:none;}
.admin-users-table th:nth-child(7),.admin-users-table td:nth-child(7){width:23%;}
.admin-users-table th,.admin-users-table td{padding:10px 7px;}
.admin-user-avatar{width:32px;height:32px;flex-basis:32px;font-size:13px;}
.admin-user-main{gap:7px;}
.admin-user-contact{display:none;}
.admin-user-name{font-size:13px;}
.admin-user-id{font-size:13px;}
.admin-user-action{width:29px;height:29px;}
.admin-user-action.edit-action{display:none;}
.admin-users-footer{flex-direction:column;align-items:stretch;}
.admin-users-pagination{justify-content:center;}
.admin-user-detail-grid{grid-template-columns:1fr;}
}

@media(max-width:460px){
.admin-users-page{padding:18px 12px 30px;}
.admin-users-stats{grid-template-columns:1fr;}
.admin-users-table th:nth-child(3),.admin-users-table td:nth-child(3){display:none;}
.admin-users-table th:nth-child(1),.admin-users-table td:nth-child(1){width:50%;}
.admin-users-table th:nth-child(5),.admin-users-table td:nth-child(5){width:20%;}
.admin-users-table th:nth-child(7),.admin-users-table td:nth-child(7){width:30%;}
.admin-users-overlay{padding:10px;}
}

@media(prefers-reduced-motion:reduce){
.admin-users-refresh,.admin-users-action,.admin-users-search input,.admin-users-select,.admin-users-clear,.admin-users-form-input{transition:none!important;}
.admin-users-refresh.spinning svg,.admin-users-spinner{animation:none!important;}
}
`}</style>

      <section className="admin-users-page">
        {}

        <div className="admin-users-head">
          <div>
            <h1 className="admin-users-title">Users</h1>

            <p className="admin-users-subtitle">Manage CRM users, account status, verification and contact information.</p>
          </div>

          <div className="admin-users-head-actions">
            <button type="button" className={`admin-users-refresh ${refreshing ? "spinning" : ""}`} onClick={handleRefresh} disabled={refreshing} title="Refresh users" aria-label="Refresh users">
              <RefreshCw size={17} />
            </button>
          </div>
        </div>

        {}

        <div className="admin-users-stats">
          <div className="admin-users-stat">
            <div className="admin-users-stat-icon">
              <Users size={20} />
            </div>

            <div>
              <div className="admin-users-stat-label">Total Users</div>

              <div className="admin-users-stat-value">{stats.total}</div>
            </div>
          </div>

          <div className="admin-users-stat">
            <div className="admin-users-stat-icon green">
              <UserCheck size={20} />
            </div>

            <div>
              <div className="admin-users-stat-label">Active Users</div>

              <div className="admin-users-stat-value">{stats.active}</div>
            </div>
          </div>

          <div className="admin-users-stat">
            <div className="admin-users-stat-icon orange">
              <ShieldCheck size={20} />
            </div>

            <div>
              <div className="admin-users-stat-label">Verified</div>

              <div className="admin-users-stat-value">{verifiedCount}</div>
            </div>
          </div>

          <div className="admin-users-stat">
            <div className="admin-users-stat-icon red">
              <UserX size={20} />
            </div>

            <div>
              <div className="admin-users-stat-label">Blocked / Inactive</div>

              <div className="admin-users-stat-value">{blockedCount}</div>
            </div>
          </div>
        </div>

        {}

        <div className="admin-users-toolbar">
          <div className="admin-users-search">
            <Search size={17} className="admin-users-search-icon" />

            <input type="text" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, email, phone or user ID..." />

            {search.trim() ? (
              <button type="button" className="admin-users-search-clear" onClick={() => setSearch("")} aria-label="Clear search" title="Clear search">
                <X size={15} />
              </button>
            ) : null}
          </div>

          <select
            className="admin-users-select"
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value);
              setPage(1);
            }}>
            <option value="ALL">All Status</option>

            <option value="ACTIVE">Active</option>

            <option value="INACTIVE">Inactive</option>

            <option value="SUSPENDED">Suspended</option>
          </select>

          <select
            className="admin-users-select"
            value={verificationFilter}
            onChange={(event) => {
              setVerificationFilter(event.target.value);
              setPage(1);
            }}>
            <option value="ALL">All Verification</option>

            <option value="VERIFIED">Verified</option>

            <option value="UNVERIFIED">Unverified</option>
          </select>

          {(search || statusFilter !== "ALL" || verificationFilter !== "ALL") && (
            <button type="button" className="admin-users-clear" onClick={clearFilters}>
              <X size={15} />
              Clear
            </button>
          )}
        </div>

        {}

        <div className="admin-users-table-card">
          <div className="admin-users-table-wrap">
            {loading ? (
              <div className="admin-users-loading">
                <div className="admin-users-spinner" />
                Loading users...
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="admin-users-empty">
                <div className="admin-users-empty-icon">
                  <Users size={22} />
                </div>

                <strong>No users found</strong>

                <div
                  style={{
                    marginTop: 6,
                    fontSize: 12,
                  }}>
                  Try changing your search or filters.
                </div>
              </div>
            ) : (
              <table className="admin-users-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>User ID</th>
                    <th>Status</th>
                    <th>Verification</th>
                    <th>Last Login</th>
                    <th>Created</th>

                    <th
                      style={{
                        textAlign: "right",
                      }}>
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => {
                    const userId = getUserId(user);

                    const isActive = user?.status === "ACTIVE";

                    return (
                      <tr key={userId}>
                        <td>
                          <div className="admin-user-main">
                            <div className="admin-user-avatar">
                              {user?.profileImage ? (
                                <img
                                  src={user.profileImage}
                                  alt={user?.name || "User"}
                                  className="admin-user-avatar-image"
                                  onError={(event) => {
                                    event.currentTarget.style.display = "none";
                                    event.currentTarget.nextElementSibling.style.display = "flex";
                                  }}
                                />
                              ) : null}

                              <div className="admin-user-avatar-fallback" style={{ display: user?.profileImage ? "none" : "flex" }}>
                                {getInitials(user?.name)}
                              </div>
                            </div>

                            <div className="admin-user-info">
                              <div className="admin-user-name" title={user?.name || "Unnamed user"}>
                                {user?.name || "Unnamed user"}
                              </div>

                              <div className="admin-user-contact">
                                <span title={user?.email || ""}>
                                  <Mail
                                    size={10}
                                    style={{
                                      display: "inline",
                                      marginRight: 4,
                                      verticalAlign: "-1px",
                                    }}
                                  />

                                  {user?.email || "No email"}
                                </span>

                                <span title={user?.phone || ""}>
                                  <Phone
                                    size={10}
                                    style={{
                                      display: "inline",
                                      marginRight: 4,
                                      verticalAlign: "-1px",
                                    }}
                                  />

                                  {user?.phone || "No mobile"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div className="admin-user-id" title={userId}>
                            {userId || "—"}
                          </div>
                        </td>

                        <td>
                          <span className={getStatusClass(user?.status)}>
                            {user?.status === "ACTIVE" ? <CheckCircle2 size={12} /> : <Ban size={12} />}

                            {getStatusLabel(user?.status)}
                          </span>
                        </td>

                        <td>
                          {user?.emailVerified ? (
                            <span className="admin-user-verify verified">
                              <CheckCircle2 size={14} />
                              Verified
                            </span>
                          ) : (
                            <span className="admin-user-verify unverified">
                              <Clock3 size={14} />
                              Pending
                            </span>
                          )}
                        </td>

                        <td>
                          <div className="admin-user-date">
                            <strong>{formatDate(user?.lastLoginAt)}</strong>

                            {user?.lastLoginAt ? (
                              <span>
                                {new Date(user.lastLoginAt).toLocaleTimeString("en-IN", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            ) : (
                              <span>Not logged in</span>
                            )}
                          </div>
                        </td>

                        <td>
                          <div className="admin-user-date">
                            <strong>{formatDate(user?.createdAt)}</strong>

                            <span>
                              <CalendarDays
                                size={10}
                                style={{
                                  display: "inline",
                                  marginRight: 3,
                                  verticalAlign: "-1px",
                                }}
                              />
                              Account
                            </span>
                          </div>
                        </td>

                        <td>
                          <div className="admin-user-actions">
                            <button type="button" className="admin-user-action" title="View details" onClick={() => handleView(user)}>
                              <Eye size={15} />
                            </button>

                            <button type="button" className="admin-user-action edit-action" title="Edit user" onClick={() => handleEditOpen(user)}>
                              <Edit3 size={15} />
                            </button>

                            <button type="button" className={`admin-user-action ${isActive ? "danger" : "success"}`} title={isActive ? "Block user" : "Activate user"} onClick={() => handleToggleStatus(user)}>
                              {isActive ? <Ban size={15} /> : <UserCheck size={15} />}
                            </button>

                            <button type="button" className="admin-user-action danger" title="Delete user" onClick={() => handleDelete(user)}>
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {!loading && (
            <div className="admin-users-footer">
              <div className="admin-users-count">
                Showing <strong>{filteredUsers.length}</strong> of <strong>{pagination.total}</strong> users
              </div>

              <div className="admin-users-pagination">
                <button type="button" className="admin-users-page-btn" disabled={page <= 1} onClick={() => setPage((previous) => Math.max(previous - 1, 1))} title="Previous page">
                  <ChevronLeft size={16} />
                </button>

                <span className="admin-users-page-number">{pagination.page}</span>

                <span
                  style={{
                    color: "var(--admin-muted)",
                    fontSize: 12,
                  }}>
                  of {Math.max(pagination.totalPages, 1)}
                </span>

                <button type="button" className="admin-users-page-btn" disabled={page >= pagination.totalPages} onClick={() => setPage((previous) => Math.min(previous + 1, Math.max(pagination.totalPages, 1)))} title="Next page">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {}

      {selectedUser && (
        <div
          className="admin-users-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedUser(null);
            }
          }}>
          <div className="admin-users-modal">
            <div className="admin-users-modal-head">
              <h2 className="admin-users-modal-title">User Details</h2>

              <button type="button" className="admin-users-modal-close" onClick={() => setSelectedUser(null)} aria-label="Close">
                <X size={17} />
              </button>
            </div>

            <div className="admin-users-modal-body">
              <div className="admin-user-detail-top">
                <div className="admin-user-detail-avatar">
                  {selectedUser?.profileImage ? (
                    <img
                      src={selectedUser.profileImage}
                      alt={selectedUser?.name || "User"}
                      className="admin-user-detail-avatar-image"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                        event.currentTarget.nextElementSibling.style.display = "flex";
                      }}
                    />
                  ) : null}

                  <div className="admin-user-detail-avatar-fallback" style={{ display: selectedUser?.profileImage ? "none" : "flex" }}>
                    {getInitials(selectedUser?.name)}
                  </div>
                </div>

                <div className="admin-user-detail-top-info">
                  <div>
                    <h3 className="admin-user-detail-name">{selectedUser?.name || "Unnamed user"}</h3>

                    <div className="admin-user-detail-email">{selectedUser?.email || "No email"}</div>
                  </div>

                  <div className="admin-user-detail-business">
                    <div className="admin-user-detail-business-item">
                      <div className="admin-user-detail-business-label">Business ID</div>

                      <div className="admin-user-detail-business-value" title={selectedUser?.businessId?._id || selectedUser?.businessId || "—"}>
                        {selectedUser?.businessId?._id || selectedUser?.businessId || "—"}
                      </div>
                    </div>

                    <div className="admin-user-detail-business-item">
                      <div className="admin-user-detail-business-label">Membership ID</div>

                      <div className="admin-user-detail-business-value" title={selectedUser?.membershipId || "—"}>
                        {selectedUser?.membershipId || "—"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="admin-user-detail-grid">
                <div className="admin-user-detail-item">
                  <div className="admin-user-detail-label">User ID</div>

                  <div className="admin-user-detail-value">{getUserId(selectedUser) || "—"}</div>
                </div>

                <div className="admin-user-detail-item">
                  <div className="admin-user-detail-label">Mobile</div>

                  <div className="admin-user-detail-value">{selectedUser?.phone || "Not provided"}</div>
                </div>

                <div className="admin-user-detail-item">
                  <div className="admin-user-detail-label">Status</div>

                  <div className="admin-user-detail-value">{getStatusLabel(selectedUser?.status)}</div>
                </div>

                <div className="admin-user-detail-item">
                  <div className="admin-user-detail-label">Email Verification</div>

                  <div className="admin-user-detail-value">{selectedUser?.emailVerified ? "Verified" : "Not verified"}</div>
                </div>

                <div className="admin-user-detail-item">
                  <div className="admin-user-detail-label">Last Login</div>

                  <div className="admin-user-detail-value">{formatDateTime(selectedUser?.lastLoginAt)}</div>
                </div>

                <div className="admin-user-detail-item">
                  <div className="admin-user-detail-label">Account Created</div>

                  <div className="admin-user-detail-value">{formatDateTime(selectedUser?.createdAt)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {}

      {editingUser && (
        <div
          className="admin-users-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !savingEdit) {
              setEditingUser(null);
            }
          }}>
          <div className="admin-users-modal">
            <div className="admin-users-modal-head">
              <h2 className="admin-users-modal-title">Edit User</h2>

              <button
                type="button"
                className="admin-users-modal-close"
                onClick={() => {
                  if (!savingEdit) {
                    setEditingUser(null);
                  }
                }}
                aria-label="Close">
                <X size={17} />
              </button>
            </div>

            <div className="admin-users-modal-body">
              <form className="admin-users-form" onSubmit={handleEditSubmit}>
                <div className="admin-users-form-field">
                  <label className="admin-users-form-label" htmlFor="admin-user-name">
                    Full Name
                  </label>

                  <input id="admin-user-name" name="name" className="admin-users-form-input" value={editForm.name} onChange={handleEditChange} placeholder="Enter full name" autoComplete="name" />
                </div>

                <div className="admin-users-form-field">
                  <label className="admin-users-form-label" htmlFor="admin-user-email">
                    Email Address
                  </label>

                  <input id="admin-user-email" name="email" type="email" className="admin-users-form-input" value={editForm.email} onChange={handleEditChange} placeholder="Enter email address" autoComplete="email" />
                </div>

                <div className="admin-users-form-field">
                  <label className="admin-users-form-label" htmlFor="admin-user-phone">
                    Mobile Number
                  </label>

                  <input id="admin-user-phone" name="phone" type="tel" className="admin-users-form-input" value={editForm.phone} onChange={handleEditChange} placeholder="Enter mobile number" autoComplete="tel" />
                </div>

                <div className="admin-users-form-actions">
                  <button type="button" className="admin-users-form-btn" onClick={() => setEditingUser(null)} disabled={savingEdit}>
                    Cancel
                  </button>

                  <button type="submit" className="admin-users-form-btn primary" disabled={savingEdit}>
                    {savingEdit ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminUsers;
