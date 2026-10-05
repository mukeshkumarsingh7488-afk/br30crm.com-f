import { useEffect, useMemo, useState } from "react";
import { Eye, Pencil, Plus, RefreshCw, Search, Trash2, X, ShieldCheck, Shield, CheckCircle2, CircleOff } from "lucide-react";

import { showAuthAlert } from "../../components/auth/authAlert";
import useBusiness from "../../hooks/useBusiness";

import { getRoles, getRoleById, createRole, updateRole, deleteRole } from "../../api/role.api";

import { getAllAvailablePermissions } from "../../api/permission.api";
import { hasPermission, PERMISSIONS, isManagementRole } from "../../utils/permissions";

const EMPTY_FORM = {
  name: "",
  description: "",
  isDefault: false,
  isActive: true,
  permissions: [],
};

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

  if (!value) return "R";

  const parts = value.split(/\s+/).filter(Boolean);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

const getRoleName = (role) => {
  return role?.name || "Unnamed Role";
};

const getRoleType = (role) => {
  return String(role?.type || "CUSTOM").toUpperCase();
};

const StatusBadge = ({ active }) => {
  return active ? <span className="role-status active">ACTIVE</span> : <span className="role-status inactive">INACTIVE</span>;
};

const TypeBadge = ({ type }) => {
  const normalized = String(type || "").toUpperCase();

  return (
    <span className={`role-type ${normalized === "SYSTEM" ? "system" : "custom"}`}>
      <ShieldCheck size={12} />
      {normalized || "CUSTOM"}
    </span>
  );
};

export default function Roles() {
  const { businessId, permissions: userPermissions, role, isBusinessOwner, loading: businessLoading, error: businessError } = useBusiness();

  const access = { permissions: userPermissions, isBusinessOwner };
  const canManage = isManagementRole({ role, isBusinessOwner });
  const canCreateRole = canManage && hasPermission(access, PERMISSIONS.ROLES_CREATE);
  const canUpdateRole = canManage && hasPermission(access, PERMISSIONS.ROLES_UPDATE);
  const canDeleteRole = canManage && hasPermission(access, PERMISSIONS.ROLES_DELETE);

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

  const [permissions, setPermissions] = useState([]);
  const [permissionsLoading, setPermissionsLoading] = useState(false);
  const [permissionSearch, setPermissionSearch] = useState("");

  const loadPermissions = async () => {
    if (!businessId) return;

    setPermissionsLoading(true);

    try {
      const response = await getAllAvailablePermissions(businessId, {
        includeInactive: false,
      });

      const data = response?.data || response || {};

      const merged = [...(Array.isArray(data?.systemPermissions) ? data.systemPermissions : []), ...(Array.isArray(data?.businessPermissions) ? data.businessPermissions : [])];

      setPermissions(Array.from(new Map(merged.map((permission) => [String(permission?._id), permission])).values()));
    } catch (err) {
      setPermissions([]);

      setError(getErrorMessage(err, "Unable to load permissions."));
    } finally {
      setPermissionsLoading(false);
    }
  };

  const loadRoles = async (page = pagination.page || 1, includeInactive = statusFilter === "INACTIVE") => {
    if (!businessId) return;

    setLoading(true);
    setError("");

    try {
      const response = await getRoles(businessId, {
        includeInactive,
      });

      const data = response?.data || response || {};

      const rows = Array.isArray(data?.roles) ? data.roles : Array.isArray(data?.items) ? data.items : [];

      let filteredRows = rows;

      if (statusFilter === "ACTIVE") {
        filteredRows = rows.filter((role) => role?.isActive !== false);
      }

      if (statusFilter === "INACTIVE") {
        filteredRows = rows.filter((role) => role?.isActive === false);
      }

      setItems(filteredRows);

      setPagination({
        page,
        limit: 100,
        total: filteredRows.length,
        totalPages: 1,
      });
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load business roles."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (businessId) {
      loadRoles(1, statusFilter === "INACTIVE");
      loadPermissions();
    }
  }, [businessId, statusFilter]);

  useEffect(() => {
    if (businessError && !businessId && !businessLoading) {
      setError(businessError || "Unable to load your business workspace.");
    }
  }, [businessError, businessId, businessLoading]);

  const filteredItems = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) return items;

    return items.filter((role) => {
      const name = String(role?.name || "").toLowerCase();

      const description = String(role?.description || "").toLowerCase();

      const slug = String(role?.slug || "").toLowerCase();

      const type = String(role?.type || "").toLowerCase();

      return name.includes(value) || description.includes(value) || slug.includes(value) || type.includes(value);
    });
  }, [items, search]);

  const roleStats = useMemo(() => {
    const total = items.length;

    const active = items.filter((role) => role?.isActive !== false).length;

    const inactive = items.filter((role) => role?.isActive === false).length;

    const system = items.filter((role) => getRoleType(role) === "SYSTEM").length;

    return [
      {
        title: "Total Roles",
        value: total.toLocaleString("en-IN"),
        detail: "Business roles",
        icon: Shield,
        tone: "",
      },
      {
        title: "Active",
        value: active.toLocaleString("en-IN"),
        detail: "Currently enabled",
        icon: CheckCircle2,
        tone: "green",
      },
      {
        title: "Inactive",
        value: inactive.toLocaleString("en-IN"),
        detail: "Currently disabled",
        icon: CircleOff,
        tone: "orange",
      },
      {
        title: "System Roles",
        value: system.toLocaleString("en-IN"),
        detail: "Predefined roles",
        icon: ShieldCheck,
        tone: "danger",
      },
    ];
  }, [items]);

  const clearSearch = () => {
    setSearch("");
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("");
  };

  const getPermissionIds = (value = []) =>
    Array.isArray(value)
      ? value
          .map((permission) => (typeof permission === "string" ? permission : permission?._id || permission?.id || ""))
          .filter(Boolean)
          .map(String)
      : [];

  const filteredPermissions = useMemo(() => {
    const query = permissionSearch.trim().toLowerCase();

    if (!query) return permissions;

    return permissions.filter((permission) =>
      [permission?.name, permission?.slug, permission?.module, permission?.action].some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(query)
      )
    );
  }, [permissions, permissionSearch]);

  const togglePermission = (id) => {
    const value = String(id);

    setForm((current) => {
      const ids = getPermissionIds(current.permissions);

      return {
        ...current,
        permissions: ids.includes(value) ? ids.filter((item) => item !== value) : [...ids, value],
      };
    });
  };

  const selectAllPermissions = () => {
    setForm((current) => ({
      ...current,
      permissions: permissions.map((permission) => String(permission?._id)).filter(Boolean),
    }));
  };

  const clearAllPermissions = () => {
    setForm((current) => ({
      ...current,
      permissions: [],
    }));
  };

  const openCreate = () => {
    setError("");

    setForm({
      ...EMPTY_FORM,
    });

    setPermissionSearch("");

    setModal({
      mode: "create",
    });
  };

  const openEdit = (role) => {
    setError("");

    const activePermissionIds = new Set(permissions.map((permission) => String(permission?._id || "")).filter(Boolean));
    const assignedPermissionIds = getPermissionIds(role?.permissions);

    /*
     * Only active permissions are assignable to a role.
     * If an older role contains a permission that has since been
     * deactivated, do not keep that stale ID in the edit payload.
     */
    const editablePermissionIds = assignedPermissionIds.filter((permissionId) => activePermissionIds.has(permissionId));

    setForm({
      name: role?.name || "",
      description: role?.description || "",
      isDefault: Boolean(role?.isDefault),
      isActive: role?.isActive !== false,
      permissions: editablePermissionIds,
    });

    setPermissionSearch("");

    setModal({
      mode: "edit",
      item: role,
    });
  };

  const openView = async (role) => {
    if (!role?._id) return;

    setError("");
    setLoading(true);

    try {
      const response = await getRoleById(role._id);

      const data = response?.data || response || {};

      const nextRole = data?.role || role;

      setModal({
        mode: "view",
        item: nextRole,
      });
    } catch (err) {
      const message = getErrorMessage(err, "Unable to load role details.");

      setError(message);

      await showAuthAlert({
        icon: "error",
        title: "Unable to load role",
        text: message,
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const name = String(form.name || "").trim();

    if (!name) {
      return "Role name is required.";
    }

    if (name.length < 2 || name.length > 100) {
      return "Role name must be between 2 and 100 characters.";
    }

    if (String(form.description || "").length > 500) {
      return "Role description cannot exceed 500 characters.";
    }

    return "";
  };

  const saveRole = async () => {
    const allowed = modal === "create" ? canCreateRole : canUpdateRole;
    if (!allowed) return;
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
      if (modal.mode === "create") {
        const payload = {
          name: form.name.trim(),
          description: form.description.trim() ? form.description.trim() : null,
          isDefault: Boolean(form.isDefault),
          permissions: getPermissionIds(form.permissions),
        };

        await createRole(businessId, payload);
      } else {
        const payload = {
          name: form.name.trim(),
          description: form.description.trim() ? form.description.trim() : null,
          isDefault: Boolean(form.isDefault),
          isActive: Boolean(form.isActive),
          permissions: getPermissionIds(form.permissions),
        };

        await updateRole(businessId, modal.item._id, payload);
      }

      const currentMode = modal.mode;

      setModal(null);

      setForm({
        ...EMPTY_FORM,
      });

      await loadRoles(pagination.page || 1, statusFilter === "INACTIVE");

      await showAuthAlert({
        icon: "success",
        title: currentMode === "create" ? "Role Created" : "Role Updated",
        text: currentMode === "create" ? "Role created successfully." : "Role updated successfully.",
        confirmButtonText: "Done",
      });
    } catch (err) {
      const message = getErrorMessage(err, modal.mode === "create" ? "Unable to create the role." : "Unable to update the role.");

      setError(message);

      await showAuthAlert({
        icon: "error",
        title: modal.mode === "create" ? "Unable to create role" : "Unable to update role",
        text: message,
        confirmButtonText: "OK",
      });
    } finally {
      setSaving(false);
    }
  };

  const deactivateRole = async (role) => {
    if (!role?._id) return;

    const roleName = getRoleName(role);

    const result = await showAuthAlert({
      icon: "warning",
      title: "Deactivate Role?",
      text: `${roleName} will be deactivated from this business. Are you sure you want to continue?`,
      showCancelButton: true,
      confirmButtonText: "Deactivate",
      cancelButtonText: "Cancel",
    });

    if (!result?.isConfirmed) return;

    setError("");

    try {
      await deleteRole(businessId, role._id);

      await loadRoles(pagination.page || 1, statusFilter === "INACTIVE");

      await showAuthAlert({
        icon: "success",
        title: "Role Deactivated",
        text: "Role deactivated successfully.",
        confirmButtonText: "Done",
      });
    } catch (err) {
      const message = getErrorMessage(err, "Unable to deactivate the role.");

      setError(message);

      await showAuthAlert({
        icon: "error",
        title: "Unable to deactivate role",
        text: message,
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="crm-resource-page">
      <style>{`
        .crm-resource-page{padding:24px 26px 40px;min-width:0}
        .crm-resource-head{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:18px;min-width:0}
        .crm-resource-heading{min-width:0}
        .crm-resource-title{font-size:23px;font-weight:400;margin:0;color:var(--crm-text)}
        .crm-resource-sub{font-size:13px;color:var(--crm-muted);margin:5px 0 0}
        .crm-resource-actions{display:flex;gap:9px;align-items:center;flex-shrink:0}
        .crm-btn{height:38px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:9px;padding:0 13px;display:inline-flex;align-items:center;gap:7px;font-size:13px;font-weight:400;cursor:pointer;white-space:nowrap}
        .crm-btn.primary{background:var(--crm-primary);border-color:var(--crm-primary);color:#fff}
        .crm-btn:hover:not(:disabled){filter:brightness(.98)}
        .crm-btn:disabled{opacity:.55;cursor:not-allowed}
        .member-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;margin-bottom:14px}
        .member-stat{background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:15px;padding:11px 14px;box-shadow:var(--crm-shadow);min-width:0}
        .member-stat-content{display:flex;align-items:center;justify-content:space-between;gap:10px;min-height:70px}
        .member-stat-copy{min-width:0}
        .member-stat-icon{width:36px;height:36px;flex:0 0 36px;border-radius:10px;background:var(--crm-primary-soft);color:var(--crm-primary);display:grid;place-items:center}
        .member-stat-icon.green{background:color-mix(in srgb,var(--crm-success) 11%,transparent);color:var(--crm-success)}
        .member-stat-icon.orange{background:color-mix(in srgb,var(--crm-warning) 12%,transparent);color:var(--crm-warning)}
        .member-stat-icon.danger{background:color-mix(in srgb,var(--crm-danger) 10%,transparent);color:var(--crm-danger)}
        .member-stat-title{font-size:13px;color:var(--crm-muted);font-weight:400;line-height:1.2}
        .member-stat-value{font-size:22px;line-height:1.05;letter-spacing:-.4px;font-weight:400;color:var(--crm-text);margin:5px 0 3px}
        .member-stat-detail{font-size:13px;color:var(--crm-muted);line-height:1.2}
        .member-toolbar{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:14px;min-width:0}
        .roles-search-wrap{position:relative;width:100%;max-width:460px;min-width:0}
        .roles-search{width:100%;height:40px;box-sizing:border-box;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:10px;padding:0 40px}
        .roles-search::placeholder{color:var(--crm-muted)}
        .roles-search-icon{position:absolute;left:12px;top:12px;color:var(--crm-muted);width:16px;height:16px;pointer-events:none}
        .roles-search-clear{position:absolute;right:9px;top:8px;width:24px;height:24px;border:0;border-radius:7px;background:transparent;color:var(--crm-muted);display:grid;place-items:center;cursor:pointer;padding:0}
        .roles-search-clear:hover{background:var(--crm-surface-2);color:var(--crm-text)}
        .member-filter{height:40px;min-width:145px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:10px;padding:0 11px;font-size:13px;outline:0}
        .member-filter:focus{border-color:var(--crm-primary)}
        .crm-resource-card{height:calc(100vh - 315px);min-height:360px;border:1px solid var(--crm-border);background:var(--crm-surface);border-radius:14px;overflow:auto;box-shadow:var(--crm-shadow);position:relative}
        .crm-table{width:100%;border-collapse:separate;border-spacing:0;min-width:1080px}
        .crm-table th{position:sticky;top:0;z-index:5;background:var(--crm-surface-2);font-size:13px;text-transform:uppercase;letter-spacing:.06em;color:var(--crm-muted);text-align:left;padding:13px 16px;white-space:nowrap;border-bottom:1px solid var(--crm-border)}
        .crm-table td{border-top:1px solid var(--crm-border);padding:13px 16px;font-size:13px;color:var(--crm-text);vertical-align:middle;background:var(--crm-surface)}
        .crm-table tbody tr:hover td{background:color-mix(in srgb,var(--crm-primary) 3%,var(--crm-surface))}
        .crm-table th:nth-child(1){width:230px}
        .crm-table th:nth-child(2){width:280px}
        .crm-table th:nth-child(3){width:115px}
        .crm-table th:nth-child(4){width:125px}
        .crm-table th:nth-child(5){width:115px}
        .crm-table th:nth-child(6){width:120px}
        .crm-table th:nth-child(7){width:125px}
        .crm-actions-cell{display:flex;gap:5px;align-items:center}
        .crm-icon-btn{width:30px;height:30px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-muted);border-radius:8px;display:grid;place-items:center;cursor:pointer;padding:0}
        .crm-icon-btn:hover{color:var(--crm-primary);border-color:var(--crm-primary);background:var(--crm-surface-2)}
        .crm-icon-btn.danger:hover{color:var(--crm-danger);border-color:var(--crm-danger)}
        .crm-error{white-space:pre-line;margin-bottom:12px;padding:10px 12px;border-radius:9px;background:color-mix(in srgb,var(--crm-danger) 10%,transparent);color:var(--crm-danger);font-size:13px}
        .crm-empty{padding:48px 20px;text-align:center;color:var(--crm-muted);font-size:13px}
        .crm-resource-title{margin:0;color:var(--crm-text);font-size:28px;line-height:1.15;font-weight:400;letter-spacing:-.5px}
        .crm-resource-sub{margin:7px 0 0;color:var(--crm-muted);font-size:14px;line-height:1.45;font-weight:400}
        .role-name-cell{display:flex;align-items:center;gap:10px;min-width:210px}
        .role-avatar{width:34px;height:34px;border-radius:10px;background:var(--crm-primary-soft);color:var(--crm-primary);display:grid;place-items:center;flex:0 0 34px;font-size:13px;font-weight:400}
        .role-name-main{font-weight:400;color:var(--crm-text)}
        .role-name-sub{font-size:13px;color:var(--crm-muted);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:250px}
        .role-description{font-size:13px;color:var(--crm-muted);max-width:300px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .role-permission-summary{display:inline-flex;align-items:center;gap:4px;padding:5px 9px;border-radius:8px;background:color-mix(in srgb,var(--crm-primary) 9%,transparent);color:var(--crm-primary);font-size:13px;font-weight:400;white-space:nowrap}
        .role-permission-summary .assigned{font-weight:400}
        .role-permission-summary .separator{opacity:.55}
        .role-permission-summary .total{font-weight:400}
        .role-type{display:inline-flex;align-items:center;gap:5px;padding:4px 8px;border-radius:7px;background:color-mix(in srgb,var(--crm-primary) 9%,transparent);color:var(--crm-primary);font-size:13px;font-weight:400}
        .role-type.system{background:color-mix(in srgb,var(--crm-warning) 11%,transparent);color:var(--crm-warning)}
        .role-type.custom{background:color-mix(in srgb,var(--crm-primary) 9%,transparent);color:var(--crm-primary)}
        .role-status{display:inline-flex;align-items:center;padding:4px 8px;border-radius:7px;font-size:13px;font-weight:400}
        .role-status.active{background:color-mix(in srgb,var(--crm-success) 11%,transparent);color:var(--crm-success)}
        .role-status.inactive{background:color-mix(in srgb,var(--crm-muted) 12%,transparent);color:var(--crm-muted)}
        .role-default{display:inline-flex;align-items:center;padding:4px 8px;border-radius:7px;font-size:13px;font-weight:400}
        .role-default.yes{background:color-mix(in srgb,var(--crm-success) 11%,transparent);color:var(--crm-success)}
        .role-default.no{background:color-mix(in srgb,var(--crm-muted) 10%,transparent);color:var(--crm-muted)}
        .crm-pagination{display:flex;justify-content:space-between;align-items:center;padding:13px 16px;border-top:1px solid var(--crm-border);font-size:13px;color:var(--crm-muted);gap:12px;background:var(--crm-surface);position:sticky;bottom:0;z-index:4}
        .crm-modal-backdrop{position:fixed;inset:0;background:rgba(15,23,42,.45);display:grid;place-items:center;padding:20px;z-index:500}
        .crm-modal{width:min(680px,100%);max-height:90vh;overflow:auto;background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:15px;box-shadow:0 25px 70px rgba(0,0,0,.2)}
        .crm-modal-head{display:flex;justify-content:space-between;align-items:center;padding:17px 20px;border-bottom:1px solid var(--crm-border);position:sticky;top:0;background:var(--crm-surface);z-index:2}
        .crm-modal-title{margin:0;font-size:16px;font-weight:400;color:var(--crm-text)}
        .crm-modal-close{border:0;background:transparent;color:var(--crm-muted);width:32px;height:32px;display:grid;place-items:center;border-radius:8px;cursor:pointer}
        .crm-modal-close:hover{background:var(--crm-surface-2);color:var(--crm-text)}
        .crm-form{padding:20px;display:grid;grid-template-columns:1fr 1fr;gap:14px}
        .crm-field{display:grid;gap:6px;min-width:0}
        .crm-field.full{grid-column:1/-1}
        .crm-field label{font-size:13px;font-weight:400;color:var(--crm-text)}
        .crm-field input,.crm-field select,.crm-field textarea{width:100%;box-sizing:border-box;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:9px;padding:10px 11px;outline:0;font:inherit}
        .crm-field input::placeholder,.crm-field textarea::placeholder{color:var(--crm-muted)}
        .crm-field input:focus,.crm-field select:focus,.crm-field textarea:focus{border-color:var(--crm-primary)}
        .crm-field-help{font-size:13px;color:var(--crm-muted);line-height:1.4}
        .crm-modal-foot{display:flex;justify-content:flex-end;gap:8px;padding:14px 20px;border-top:1px solid var(--crm-border);position:sticky;bottom:0;background:var(--crm-surface)}
        .role-view-grid{padding:20px;display:grid;grid-template-columns:1fr 1fr;gap:14px}
        .role-view-card{border:1px solid var(--crm-border);border-radius:10px;padding:12px;background:var(--crm-surface-2)}
        .role-view-card.full{grid-column:1/-1}
        .role-view-label{font-size:13px;color:var(--crm-muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:5px}
        .role-view-text{font-size:13px;color:var(--crm-text);font-weight:400;word-break:break-word}
        .role-view-profile{display:flex;align-items:center;gap:12px}
        .role-view-avatar{width:44px;height:44px;border-radius:12px;background:var(--crm-primary-soft);color:var(--crm-primary);display:grid;place-items:center;font-size:13px;font-weight:400}
        .role-view-name{font-size:14px;font-weight:400;color:var(--crm-text)}
        .role-view-slug{font-size:13px;color:var(--crm-muted);margin-top:3px}
        .role-permissions-box{border:1px solid var(--crm-border);border-radius:10px;background:var(--crm-surface-2);overflow:hidden}
        .role-permissions-head{display:flex;align-items:center;gap:8px;padding:9px;border-bottom:1px solid var(--crm-border)}
        .role-permissions-search{flex:1;min-width:0;height:34px;border:1px solid var(--crm-border);border-radius:8px;background:var(--crm-surface);color:var(--crm-text);padding:0 10px;font-size:13px;outline:0}
        .role-permissions-actions{display:flex;gap:5px}
        .role-permission-action{height:30px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:7px;padding:0 8px;font-size:13px;font-weight:400;cursor:pointer}
        .role-permissions-list{max-height:260px;overflow:auto;padding:7px}
        .role-permission-item{display:flex;align-items:center;gap:9px;padding:8px;border-radius:8px;cursor:pointer}
        .role-permission-item:hover{background:var(--crm-surface)}
        .role-permission-item input{width:15px;height:15px;accent-color:var(--crm-primary)}
        .role-permission-copy{min-width:0}
        .role-permission-name{display:block;font-size:13px;font-weight:400;color:var(--crm-text)}
        .role-permission-meta{display:block;font-size:13px;color:var(--crm-muted);margin-top:2px}
        .role-permission-empty{padding:22px;text-align:center;color:var(--crm-muted);font-size:13px}
        .role-permission-count{font-size:13px;color:var(--crm-muted)}
        .role-view-permissions{display:flex;flex-wrap:wrap;gap:6px}
        .role-permission-chip{display:inline-flex;padding:5px 8px;border-radius:7px;background:color-mix(in srgb,var(--crm-primary) 9%,transparent);color:var(--crm-primary);font-size:13px;font-weight:400}
        .role-permission-chip.custom{background:color-mix(in srgb,var(--crm-warning) 11%,transparent);color:var(--crm-warning)}
        @media(max-width:900px){
          .member-stats{grid-template-columns:repeat(2,minmax(0,1fr))}
          .crm-resource-card{height:calc(100vh - 355px)}
        }
        @media(max-width:700px){
          .crm-resource-page{padding:18px 14px 30px}
          .crm-resource-head{align-items:flex-start;flex-direction:column}
          .crm-resource-actions{width:100%}
          .crm-resource-actions .crm-btn{flex:1;justify-content:center}
          .member-toolbar{align-items:stretch;flex-direction:column}
          .roles-search-wrap{max-width:none}
          .member-filter{width:100%}
          .crm-form{grid-template-columns:1fr}
          .crm-field.full{grid-column:auto}
          .crm-pagination{align-items:flex-start;flex-direction:column}
          .role-view-grid{grid-template-columns:1fr}
          .role-view-card.full{grid-column:auto}
          .crm-resource-card{height:calc(100vh - 430px);min-height:300px}
        }
      `}</style>
      <div className="crm-resource-head">
        <div className="crm-resource-heading">
          <h1 className="crm-resource-title">Roles</h1>

          <p className="crm-resource-sub">Manage roles and access levels connected to your BR30 CRM business workspace.</p>
        </div>

        <div className="crm-resource-actions">
          <button type="button" className="crm-btn" onClick={() => loadRoles(pagination.page || 1, statusFilter === "INACTIVE")} disabled={loading}>
            <RefreshCw size={15} />
            Refresh
          </button>

          <button type="button" className="crm-btn primary" onClick={openCreate} disabled={!canCreateRole}>
            <Plus size={15} />
            Add Role
          </button>
        </div>
      </div>

      <div className="member-stats">
        {roleStats.map((stat) => {
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

      {(error || businessError) && <div className="crm-error">{error || businessError}</div>}

      <div className="member-toolbar">
        <div className="roles-search-wrap">
          <Search className="roles-search-icon" />

          <input className="roles-search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search roles..." />

          {search && (
            <button type="button" className="roles-search-clear" onClick={clearSearch} aria-label="Clear search" title="Clear search">
              <X size={15} />
            </button>
          )}
        </div>

        <select className="member-filter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>

        {(search || statusFilter) && (
          <button type="button" className="crm-btn" onClick={clearFilters}>
            Clear Filters
          </button>
        )}
      </div>

      <div className="crm-resource-card">
        <table className="crm-table">
          <thead>
            <tr>
              <th>Role</th>
              <th>Description</th>
              <th>Permissions</th>
              <th>Type</th>
              <th>Default</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading || businessLoading ? (
              <tr>
                <td colSpan={8}>
                  <div className="crm-empty">Loading roles...</div>
                </td>
              </tr>
            ) : filteredItems.length === 0 ? (
              <tr>
                <td colSpan={8}>
                  <div className="crm-empty">No roles found.</div>
                </td>
              </tr>
            ) : (
              filteredItems.map((role) => {
                const name = getRoleName(role);

                const assignedPermissions = getPermissionIds(role?.permissions).length;

                const totalPermissions = permissions.length;

                return (
                  <tr key={role._id}>
                    <td>
                      <div className="role-name-cell">
                        <div className="role-avatar">{getInitials(name)}</div>

                        <div>
                          <div className="role-name-main">{name}</div>

                          <div className="role-name-sub">{role?.slug ? `Slug: ${role.slug}` : "Business role"}</div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="role-description">{role?.description || "No description"}</span>
                    </td>

                    <td>
                      <span className="role-permission-summary" title={`${assignedPermissions} of ${totalPermissions} available permissions assigned`}>
                        <span className="assigned">{assignedPermissions}</span>

                        <span className="separator">/</span>

                        <span className="total">{totalPermissions}</span>
                      </span>
                    </td>

                    <td>
                      <TypeBadge type={getRoleType(role)} />
                    </td>

                    <td>
                      <span className={`role-default ${role?.isDefault ? "yes" : "no"}`}>{role?.isDefault ? "DEFAULT" : "—"}</span>
                    </td>

                    <td>
                      <StatusBadge active={role?.isActive !== false} />
                    </td>

                    <td>{formatDate(role?.createdAt)}</td>

                    <td>
                      <div className="crm-actions-cell">
                        <button type="button" className="crm-icon-btn" onClick={() => openView(role)} title="View" aria-label="View Role">
                          <Eye size={14} />
                        </button>

                        {role?.type !== "SYSTEM" && (
                          <button type="button" className="crm-icon-btn" onClick={() => openEdit(role)} title="Edit" aria-label="Edit Role" disabled={!canUpdateRole}>
                            <Pencil size={14} />
                          </button>
                        )}

                        {role?.isActive !== false && role?.type !== "SYSTEM" && (
                          <button type="button" className="crm-icon-btn danger" onClick={() => deactivateRole(role)} title="Deactivate" aria-label="Deactivate Role" disabled={!canDeleteRole}>
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

        <div className="crm-pagination">
          <span>{filteredItems.length} total</span>

          <div className="crm-resource-actions">
            <button type="button" className="crm-btn" disabled>
              Previous
            </button>

            <span>Page 1 / 1</span>

            <button type="button" className="crm-btn" disabled>
              Next
            </button>
          </div>
        </div>
      </div>

      {modal && (modal.mode === "create" || modal.mode === "edit") && (
        <div
          className="crm-modal-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !saving) {
              setModal(null);
            }
          }}>
          <div className="crm-modal">
            <div className="crm-modal-head">
              <h2 className="crm-modal-title">{modal.mode === "create" ? "Add Role" : "Edit Role"}</h2>

              <button type="button" className="crm-modal-close" onClick={() => !saving && setModal(null)} disabled={saving} aria-label="Close">
                <X size={17} />
              </button>
            </div>

            <div className="crm-form">
              <div className="crm-field full">
                <label>Role name *</label>

                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      name: e.target.value,
                    }))
                  }
                  placeholder="Enter role name"
                  maxLength={100}
                />
              </div>

              <div className="crm-field full">
                <label>Description</label>

                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Describe what this role is used for"
                  maxLength={500}
                />

                <div className="crm-field-help">Maximum 500 characters.</div>
              </div>

              <div className="crm-field">
                <label>Default Role</label>

                <select
                  value={form.isDefault ? "YES" : "NO"}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      isDefault: e.target.value === "YES",
                    }))
                  }>
                  <option value="NO">No</option>

                  <option value="YES">Yes</option>
                </select>
              </div>

              <div className="crm-field full">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 10,
                  }}>
                  <label>Permissions</label>

                  <span className="role-permission-count">{getPermissionIds(form.permissions).length} selected</span>
                </div>

                <div className="role-permissions-box">
                  <div className="role-permissions-head">
                    <input className="role-permissions-search" value={permissionSearch} onChange={(e) => setPermissionSearch(e.target.value)} placeholder="Search permissions..." />

                    <div className="role-permissions-actions">
                      <button type="button" className="role-permission-action" onClick={selectAllPermissions} disabled={permissionsLoading || !permissions.length}>
                        All
                      </button>

                      <button type="button" className="role-permission-action" onClick={clearAllPermissions} disabled={!getPermissionIds(form.permissions).length}>
                        Clear
                      </button>
                    </div>
                  </div>

                  <div className="role-permissions-list">
                    {permissionsLoading ? (
                      <div className="role-permission-empty">Loading permissions...</div>
                    ) : filteredPermissions.length === 0 ? (
                      <div className="role-permission-empty">No permissions found.</div>
                    ) : (
                      filteredPermissions.map((permission) => {
                        const id = String(permission?._id || "");

                        const checked = getPermissionIds(form.permissions).includes(id);

                        return (
                          <label className="role-permission-item" key={id}>
                            <input type="checkbox" checked={checked} onChange={() => togglePermission(id)} />

                            <span className="role-permission-copy">
                              <span className="role-permission-name">{permission?.name || permission?.slug || "Permission"}</span>

                              <span className="role-permission-meta">
                                {permission?.module || "module"} · {permission?.action || "action"} · {permission?.type || "SYSTEM"}
                              </span>
                            </span>
                          </label>
                        );
                      })
                    )}
                  </div>
                </div>

                <div className="crm-field-help">Select the active system or business permissions this role should have.</div>
              </div>

              {modal.mode === "edit" && (
                <div className="crm-field">
                  <label>Status</label>

                  <select
                    value={form.isActive ? "ACTIVE" : "INACTIVE"}
                    onChange={(e) =>
                      setForm((current) => ({
                        ...current,
                        isActive: e.target.value === "ACTIVE",
                      }))
                    }>
                    <option value="ACTIVE">ACTIVE</option>

                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              )}
            </div>

            <div className="crm-modal-foot">
              <button type="button" className="crm-btn" onClick={() => !saving && setModal(null)} disabled={saving}>
                Cancel
              </button>

              <button type="button" className="crm-btn primary" disabled={saving} onClick={saveRole}>
                {saving ? "Saving..." : modal.mode === "create" ? "Create Role" : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {modal && modal.mode === "view" && (
        <div
          className="crm-modal-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setModal(null);
            }
          }}>
          <div className="crm-modal">
            <div className="crm-modal-head">
              <h2 className="crm-modal-title">Role Details</h2>

              <button type="button" className="crm-modal-close" onClick={() => setModal(null)} aria-label="Close">
                <X size={17} />
              </button>
            </div>

            <div className="role-view-grid">
              <div className="role-view-card full">
                <div className="role-view-profile">
                  <div className="role-view-avatar">{getInitials(getRoleName(modal.item))}</div>

                  <div>
                    <div className="role-view-name">{getRoleName(modal.item)}</div>

                    <div className="role-view-slug">{modal.item?.slug ? modal.item.slug : "Business role"}</div>
                  </div>
                </div>
              </div>

              <div className="role-view-card">
                <div className="role-view-label">Name</div>

                <div className="role-view-text">{modal.item?.name || "—"}</div>
              </div>

              <div className="role-view-card">
                <div className="role-view-label">Type</div>

                <div className="role-view-text">
                  <TypeBadge type={getRoleType(modal.item)} />
                </div>
              </div>

              <div className="role-view-card">
                <div className="role-view-label">Status</div>

                <div className="role-view-text">
                  <StatusBadge active={modal.item?.isActive !== false} />
                </div>
              </div>

              <div className="role-view-card">
                <div className="role-view-label">Default</div>

                <div className="role-view-text">{modal.item?.isDefault ? "Yes" : "No"}</div>
              </div>

              <div className="role-view-card">
                <div className="role-view-label">Created</div>

                <div className="role-view-text">{formatDate(modal.item?.createdAt)}</div>
              </div>

              <div className="role-view-card">
                <div className="role-view-label">Updated</div>

                <div className="role-view-text">{formatDate(modal.item?.updatedAt)}</div>
              </div>

              <div className="role-view-card full">
                <div className="role-view-label">Description</div>

                <div className="role-view-text">{modal.item?.description || "No description available."}</div>
              </div>

              <div className="role-view-card full">
                <div className="role-view-label">Permissions</div>

                <div className="role-view-text">
                  {getPermissionIds(modal.item?.permissions).length ? (
                    <div className="role-view-permissions">
                      {modal.item.permissions.map((permission, index) => {
                        const id = permission?._id || permission?.id || String(permission || index);

                        const type = String(permission?.type || "SYSTEM").toLowerCase();

                        return (
                          <span key={String(id)} className={`role-permission-chip ${type === "custom" ? "custom" : ""}`}>
                            {permission?.name || permission?.slug || String(permission)}
                          </span>
                        );
                      })}
                    </div>
                  ) : (
                    "No permissions assigned."
                  )}
                </div>
              </div>

              <div className="role-view-card full">
                <div className="role-view-label">Permission Count</div>

                <div className="role-view-text">
                  {getPermissionIds(modal.item?.permissions).length} / {permissions.length}
                </div>
              </div>

              <div className="role-view-card full">
                <div className="role-view-label">Role ID</div>

                <div className="role-view-text">{modal.item?._id || "—"}</div>
              </div>
            </div>

            <div className="crm-modal-foot">
              <button type="button" className="crm-btn" onClick={() => setModal(null)}>
                Close
              </button>

              {modal.item?.type !== "SYSTEM" && (
                <button type="button" className="crm-btn primary" onClick={() => openEdit(modal.item)}>
                  <Pencil size={14} />
                  Edit Role
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
