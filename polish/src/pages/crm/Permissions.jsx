import React, { useEffect, useMemo, useState } from "react";

import { Activity, Check, Edit3, KeyRound, Plus, RefreshCw, Search, ShieldCheck, Trash2, X } from "lucide-react";

import useBusiness from "../../hooks/useBusiness";

import { showAuthAlert } from "../../components/auth/authAlert";

import { getSystemPermissions, getBusinessPermissions, createPermission, updatePermission, deletePermission } from "../../api/permission.api";
import { hasPermission, PERMISSIONS, isManagementRole } from "../../utils/permissions";

function Permissions() {
  const { businessId, permissions: userPermissions, isBusinessOwner, loading: businessLoading, error: businessError } = useBusiness();

  const access = { permissions: userPermissions, isBusinessOwner };
  const canManage = isManagementRole(access);
  const canAddPermission = canManage && hasPermission(access, PERMISSIONS.PERMISSIONS_ADD);
  const canManagePermissions = canManage && hasPermission(access, PERMISSIONS.PERMISSIONS_MANAGE);

  const [permissions, setPermissions] = useState([]);

  const [search, setSearch] = useState("");

  const [typeFilter, setTypeFilter] = useState("");

  const [statusFilter, setStatusFilter] = useState("");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [modal, setModal] = useState(null);

  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",

    description: "",

    module: "",

    action: "",
  });

  const [selectedPermission, setSelectedPermission] = useState(null);

  const getPermissionId = (permission) => permission?._id || permission?.id;

  const getPermissionName = (permission) => permission?.name || "Unnamed Permission";

  const getPermissionType = (permission) => String(permission?.type || "SYSTEM").toUpperCase();

  const isPermissionActive = (permission) => permission?.isActive !== false;

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

  const getInitials = (name) => {
    const value = String(name || "").trim();

    if (!value) return "P";

    const parts = value.split(/\s+/).filter(Boolean);

    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }

    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  };

  const loadPermissions = async () => {
    if (!businessId) return;

    setLoading(true);

    setError("");

    try {
      const [systemResponse, businessResponse] = await Promise.all([
        getSystemPermissions({
          includeInactive: true,
        }),

        getBusinessPermissions(businessId, {
          includeInactive: true,
        }),
      ]);

      const systemPermissions = systemResponse?.data?.permissions || systemResponse?.permissions || [];

      const businessPermissions = businessResponse?.data?.permissions || businessResponse?.permissions || [];

      const combined = [...systemPermissions, ...businessPermissions];

      const uniquePermissions = Array.from(new Map(combined.map((permission) => [String(getPermissionId(permission)), permission])).values());

      setPermissions(uniquePermissions);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Unable to load permissions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPermissions();
  }, [businessId]);

  const filteredPermissions = useMemo(() => {
    const query = search.trim().toLowerCase();

    return permissions.filter((permission) => {
      const name = String(permission?.name || "").toLowerCase();

      const slug = String(permission?.slug || "").toLowerCase();

      const description = String(permission?.description || "").toLowerCase();

      const module = String(permission?.module || "").toLowerCase();

      const action = String(permission?.action || "").toLowerCase();

      const matchesSearch = !query || name.includes(query) || slug.includes(query) || description.includes(query) || module.includes(query) || action.includes(query);

      const matchesType = !typeFilter || getPermissionType(permission) === typeFilter;

      const matchesStatus = !statusFilter || (statusFilter === "ACTIVE" && isPermissionActive(permission)) || (statusFilter === "INACTIVE" && !isPermissionActive(permission));

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [permissions, search, typeFilter, statusFilter]);

  const stats = useMemo(() => {
    const total = permissions.length;

    const active = permissions.filter((permission) => isPermissionActive(permission)).length;

    const system = permissions.filter((permission) => getPermissionType(permission) === "SYSTEM").length;

    const custom = permissions.filter((permission) => getPermissionType(permission) === "CUSTOM").length;

    return {
      total,

      active,

      system,

      custom,
    };
  }, [permissions]);

  const permissionStats = [
    {
      title: "Total Permissions",

      value: stats.total,

      detail: "All available permissions",

      icon: ShieldCheck,

      tone: "total",
    },

    {
      title: "Active",

      value: stats.active,

      detail: "Currently active",

      icon: Check,

      tone: "active",
    },

    {
      title: "System",

      value: stats.system,

      detail: "CRM system permissions",

      icon: KeyRound,

      tone: "system",
    },

    {
      title: "Custom",

      value: stats.custom,

      detail: "Business permissions",

      icon: Activity,

      tone: "custom",
    },
  ];

  const clearSearch = () => {
    setSearch("");
  };

  const clearFilters = () => {
    setSearch("");

    setTypeFilter("");

    setStatusFilter("");
  };

  const openCreate = () => {
    setSelectedPermission(null);

    setForm({
      name: "",

      description: "",

      module: "",

      action: "",
    });

    setModal("create");
  };

  const openEdit = (permission) => {
    setSelectedPermission(permission);

    setForm({
      name: permission?.name || "",

      description: permission?.description || "",

      module: permission?.module || "",

      action: permission?.action || "",
    });

    setModal("edit");
  };

  const closeModal = () => {
    if (saving) return;

    setModal(null);

    setSelectedPermission(null);

    setForm({
      name: "",

      description: "",

      module: "",

      action: "",
    });
  };

  const handleFormChange = (field, value) => {
    setForm((previous) => ({
      ...previous,

      [field]: value,
    }));
  };

  const savePermission = async () => {
    if (modal === "create" ? !canAddPermission : !canManagePermissions) return;
    const name = form.name.trim();

    const description = form.description.trim();

    const module = form.module.trim();

    const action = form.action.trim();

    if (!name) {
      await showAuthAlert({
        icon: "warning",

        title: "Permission name required",

        text: "Please enter a permission name.",

        confirmButtonText: "OK",
      });

      return;
    }

    if (!module) {
      await showAuthAlert({
        icon: "warning",

        title: "Module required",

        text: "Please enter the permission module.",

        confirmButtonText: "OK",
      });

      return;
    }

    if (!action) {
      await showAuthAlert({
        icon: "warning",

        title: "Action required",

        text: "Please enter the permission action.",

        confirmButtonText: "OK",
      });

      return;
    }

    setSaving(true);

    try {
      if (modal === "create") {
        await createPermission(businessId, {
          name,

          description: description || null,

          module,

          action,
        });

        await showAuthAlert({
          icon: "success",

          title: "Permission created",

          text: "Permission created successfully.",

          confirmButtonText: "Done",
        });
      } else {
        if (getPermissionType(selectedPermission) === "SYSTEM") {
          await showAuthAlert({
            icon: "info",
            title: "System permission",
            text: "System permissions can only be activated or deactivated.",
            confirmButtonText: "OK",
          });
          return;
        }

        const permissionId = getPermissionId(selectedPermission);

        await updatePermission(permissionId, {
          name,

          description: description || null,

          module,

          action,
        });

        await showAuthAlert({
          icon: "success",

          title: "Permission updated",

          text: "Permission updated successfully.",

          confirmButtonText: "Done",
        });
      }

      closeModal();

      await loadPermissions();
    } catch (err) {
      await showAuthAlert({
        icon: "error",

        title: "Unable to save",

        text: err?.response?.data?.message || err?.message || "Unable to save permission.",

        confirmButtonText: "OK",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (permission) => {
    if (!canManagePermissions) return;
    const permissionId = getPermissionId(permission);

    if (!permissionId) return;

    const currentlyActive = isPermissionActive(permission);

    const result = await showAuthAlert({
      icon: "warning",

      title: currentlyActive ? "Deactivate permission?" : "Activate permission?",

      text: currentlyActive ? "This permission will become inactive." : "This permission will become active.",

      showCancelButton: true,

      confirmButtonText: currentlyActive ? "Deactivate" : "Activate",

      cancelButtonText: "Cancel",
    });

    if (!result?.isConfirmed) return;

    try {
      await updatePermission(permissionId, {
        isActive: !currentlyActive,
      });

      await loadPermissions();

      await showAuthAlert({
        icon: "success",

        title: currentlyActive ? "Permission deactivated" : "Permission activated",

        text: currentlyActive ? "Permission has been deactivated." : "Permission has been activated.",

        confirmButtonText: "Done",
      });
    } catch (err) {
      await showAuthAlert({
        icon: "error",

        title: "Unable to update",

        text: err?.response?.data?.message || err?.message || "Unable to update permission.",

        confirmButtonText: "OK",
      });
    }
  };

  const handleDelete = async (permission) => {
    if (!canManagePermissions) return;
    const permissionId = getPermissionId(permission);

    if (!permissionId) return;

    if (getPermissionType(permission) === "SYSTEM") {
      await showAuthAlert({
        icon: "info",

        title: "System permission",

        text: "System permissions cannot be deleted from this page.",

        confirmButtonText: "OK",
      });

      return;
    }

    const result = await showAuthAlert({
      icon: "warning",

      title: "Delete permission?",

      text: "This will permanently delete the custom permission.",

      showCancelButton: true,

      confirmButtonText: "Delete",

      cancelButtonText: "Cancel",
    });

    if (!result?.isConfirmed) return;

    try {
      await deletePermission(permissionId);

      await loadPermissions();

      await showAuthAlert({
        icon: "success",

        title: "Permission deleted",

        text: "Permission deleted successfully.",

        confirmButtonText: "Done",
      });
    } catch (err) {
      await showAuthAlert({
        icon: "error",

        title: "Unable to delete",

        text: err?.response?.data?.message || err?.message || "Unable to delete permission.",

        confirmButtonText: "OK",
      });
    }
  };

  const statusClass = (active) => (active ? "permission-status active" : "permission-status inactive");

  const typeClass = (type) => (type === "CUSTOM" ? "permission-type custom" : "permission-type system");

  return (
    <div className="permissions-page">
      <style>{`.permissions-page{padding:24px 26px;color:var(--crm-text);min-width:0}.permissions-page *{box-sizing:border-box}.permissions-page-header{display:flex;justify-content:space-between;align-items:flex-start;gap:18px;margin-bottom:18px}.permissions-page-title{font-size:26px;line-height:1.1;font-weight:400;margin:0;color:var(--crm-text)}.permissions-page-subtitle{font-size:13px;color:var(--crm-muted);margin:8px 0 0}.permissions-page-actions{display:flex;align-items:center;gap:8px;flex-shrink:0}.permissions-page-btn{height:40px;border:1px solid var(--crm-border);border-radius:10px;background:var(--crm-surface);color:var(--crm-text);padding:0 13px;display:inline-flex;align-items:center;justify-content:center;gap:7px;font-size:13px;font-weight:400;cursor:pointer;transition:.15s ease}.permissions-page-btn:hover{border-color:var(--crm-primary);background:var(--crm-surface-2)}.permissions-page-btn-primary{background:var(--crm-primary);border-color:var(--crm-primary);color:#fff}.permissions-page-btn-primary:hover{opacity:.92;background:var(--crm-primary);border-color:var(--crm-primary)}.permissions-page-btn:disabled{opacity:.55;cursor:not-allowed}.permissions-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-bottom:14px}.permissions-stat{min-height:124px;background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:15px;padding:18px 17px;display:flex;align-items:center;justify-content:space-between;gap:12px}.permissions-stat-copy{min-width:0}.permissions-stat-title{font-size:13px;font-weight:400;color:var(--crm-muted);margin-bottom:8px}.permissions-stat-value{font-size:27px;line-height:1;font-weight:400;color:var(--crm-text)}.permissions-stat-detail{font-size:13px;color:var(--crm-muted);margin-top:8px}.permissions-stat-icon{width:42px;height:42px;border-radius:12px;display:grid;place-items:center;flex-shrink:0}.permissions-stat-total .permissions-stat-icon{color:#8b87ff;background:rgba(89,71,216,.2)}.permissions-stat-active .permissions-stat-icon{color:#35d98a;background:rgba(22,163,74,.16)}.permissions-stat-system .permissions-stat-icon{color:#62a8ff;background:rgba(37,99,235,.16)}.permissions-stat-custom .permissions-stat-icon{color:#f5b91f;background:rgba(180,120,0,.16)}.permissions-error{color:var(--crm-danger);font-size:13px;margin-bottom:12px}.permissions-toolbar{display:flex;align-items:center;gap:10px;margin-bottom:14px}.permissions-search{position:relative;flex:0 1 680px;min-width:260px}.permissions-search>svg{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:var(--crm-muted);pointer-events:none}.permissions-search input{width:100%;height:42px;border:1px solid var(--crm-border);border-radius:11px;background:var(--crm-surface);color:var(--crm-text);padding:0 40px;font-size:13px;outline:none}.permissions-search input:focus{border-color:var(--crm-primary)}.permissions-search input::placeholder{color:var(--crm-muted)}.permissions-search-clear{position:absolute;right:9px;top:9px;width:24px;height:24px;border:0;background:transparent;color:var(--crm-muted);display:grid;place-items:center;cursor:pointer;border-radius:6px}.permissions-search-clear:hover{background:var(--crm-surface-2);color:var(--crm-text)}.permissions-filter{height:42px;min-width:155px;border:1px solid var(--crm-border);border-radius:11px;background:var(--crm-surface);color:var(--crm-text);padding:0 12px;font-size:13px;outline:none;cursor:pointer}.permissions-filter:focus{border-color:var(--crm-primary)}.permissions-clear{height:42px}.permissions-table-card{width:100%;background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:15px;overflow:hidden}.permissions-table-wrap{width:100%;max-height:calc(100vh - 390px);min-height:360px;overflow:auto}.permissions-table{width:100%;min-width:1050px;border-collapse:collapse}.permissions-table th{height:43px;padding:0 16px;text-align:left;background:var(--crm-surface-2);border-bottom:1px solid var(--crm-border);font-size:13px;font-weight:400;letter-spacing:.05em;text-transform:uppercase;color:var(--crm-muted);white-space:nowrap;position:sticky;top:0;z-index:2}.permissions-table td{padding:13px 16px;border-bottom:1px solid var(--crm-border);font-size:13px;color:var(--crm-text);vertical-align:middle}.permissions-table tbody tr:last-child td{border-bottom:0}.permissions-table tbody tr:hover{background:rgba(255,255,255,.015)}.permission-name-cell{display:flex;align-items:center;gap:10px;min-width:220px}.permission-avatar{width:36px;height:36px;border-radius:10px;background:var(--crm-primary-soft);color:var(--crm-primary);display:grid;place-items:center;font-size:13px;font-weight:400;flex-shrink:0}.permission-name-main{font-size:13px;font-weight:400;color:var(--crm-text);line-height:1.3}.permission-name-sub{font-size:13px;color:var(--crm-muted);margin-top:3px;white-space:nowrap}.permission-description{display:block;max-width:280px;color:var(--crm-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.permission-module{font-size:13px;font-weight:400;color:var(--crm-text);text-transform:capitalize}.permission-action{display:inline-flex;padding:5px 8px;border-radius:7px;background:var(--crm-surface-2);color:var(--crm-text);font-size:13px;font-weight:400}.permission-type{display:inline-flex;align-items:center;padding:5px 8px;border-radius:7px;font-size:13px;font-weight:400;letter-spacing:.04em}.permission-type.system{background:rgba(37,99,235,.13);color:#62a8ff}.permission-type.custom{background:rgba(180,120,0,.14);color:#f5b91f}.permission-status{display:inline-flex;align-items:center;padding:5px 8px;border-radius:7px;font-size:13px;font-weight:400;letter-spacing:.04em}.permission-status.active{background:rgba(22,163,74,.13);color:#35d98a}.permission-status.inactive{background:rgba(190,55,70,.13);color:#ff6d78}.permission-actions{display:flex;align-items:center;gap:6px}.permission-action-btn{width:32px;height:32px;border:1px solid var(--crm-border);border-radius:8px;background:var(--crm-surface);color:var(--crm-muted);display:grid;place-items:center;cursor:pointer}.permission-action-btn:hover{background:var(--crm-surface-2);color:var(--crm-text);border-color:var(--crm-primary)}.permission-action-btn.danger:hover{color:#ff6d78;border-color:#ff6d78}.permissions-empty{text-align:center;padding:55px 20px;color:var(--crm-muted);font-size:13px}.permissions-loading{display:flex;align-items:center;justify-content:center;gap:8px}.permissions-spinner{animation:permissions-spin 1s linear infinite}@keyframes permissions-spin{to{transform:rotate(360deg)}}.permissions-modal{position:fixed;inset:0;background:rgba(15,23,42,.48);display:grid;place-items:center;padding:20px;z-index:1000}.permissions-dialog{width:min(620px,100%);max-height:calc(100vh - 40px);overflow:auto;background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:15px;box-shadow:0 24px 70px rgba(0,0,0,.28)}.permissions-dialog-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;padding:18px 20px;border-bottom:1px solid var(--crm-border)}.permissions-dialog-title{font-size:16px;font-weight:400;color:var(--crm-text);margin:0}.permissions-dialog-subtitle{font-size:13px;color:var(--crm-muted);margin:5px 0 0}.permissions-dialog-close{width:32px;height:32px;border:1px solid var(--crm-border);border-radius:8px;background:var(--crm-surface);color:var(--crm-muted);display:grid;place-items:center;cursor:pointer}.permissions-dialog-body{padding:20px}.permissions-form{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.permissions-field{display:grid;gap:6px}.permissions-field.full{grid-column:1/-1}.permissions-field label{font-size:13px;font-weight:400;color:var(--crm-text)}.permissions-field input,.permissions-field textarea{width:100%;border:1px solid var(--crm-border);border-radius:9px;background:var(--crm-surface);color:var(--crm-text);padding:10px 11px;font-size:13px;outline:none}.permissions-field input{height:40px}.permissions-field textarea{min-height:90px;resize:vertical}.permissions-field input:focus,.permissions-field textarea:focus{border-color:var(--crm-primary)}.permissions-dialog-footer{padding:14px 20px;border-top:1px solid var(--crm-border);display:flex;align-items:center;justify-content:space-between;gap:10px}.permissions-dialog-footer-left,.permissions-dialog-footer-right{display:flex;align-items:center;gap:8px}.permissions-dialog-footer .permissions-page-btn{min-width:90px}.permissions-status-btn:hover{border-color:var(--crm-warning);color:var(--crm-warning)}.permissions-delete-btn{color:var(--crm-danger);border-color:color-mix(in srgb,var(--crm-danger) 35%,var(--crm-border))}.permissions-delete-btn:hover{color:var(--crm-danger);border-color:var(--crm-danger);background:color-mix(in srgb,var(--crm-danger) 7%,var(--crm-surface))}@media(max-width:900px){.permissions-stats{grid-template-columns:repeat(2,minmax(0,1fr))}.permissions-page-header{align-items:flex-start}.permissions-toolbar{flex-wrap:wrap}.permissions-search{flex:1 1 100%}.permissions-filter{flex:0 0 155px}}@media(max-width:700px){.permissions-dialog-footer{align-items:stretch;flex-direction:column}.permissions-dialog-footer-left,.permissions-dialog-footer-right{width:100%}.permissions-dialog-footer-left .permissions-page-btn,.permissions-dialog-footer-right .permissions-page-btn{flex:1}.permissions-page{padding:18px 14px 30px}.permissions-page-header{flex-direction:column}.permissions-page-actions{width:100%}.permissions-page-actions .permissions-page-btn{flex:1}.permissions-stats{grid-template-columns:repeat(2,minmax(0,1fr))}.permissions-toolbar{align-items:stretch;flex-direction:column}.permissions-search{max-width:none}.permissions-filter{width:100%}.permissions-clear{width:100%}.permissions-form{grid-template-columns:1fr}.permissions-field.full{grid-column:auto}}@media(max-width:500px){.permissions-stats{grid-template-columns:1fr}.permissions-page-title{font-size:23px}.permissions-table-wrap{min-height:320px}}`}</style>

      <div className="permissions-page-header">
        <div>
          <h1 className="permissions-page-title">Permissions</h1>

          <p className="permissions-page-subtitle">Manage system and custom permissions connected to your BR30 CRM business workspace.</p>
        </div>

        <div className="permissions-page-actions">
          <button type="button" className="permissions-page-btn" onClick={loadPermissions} disabled={loading || businessLoading}>
            <RefreshCw size={15} className={loading ? "permissions-spinner" : ""} />
            Refresh
          </button>

          <button type="button" className="permissions-page-btn permissions-page-btn-primary" onClick={openCreate} disabled={!canAddPermission}>
            <Plus size={15} />
            Add Permission
          </button>
        </div>
      </div>

      {(error || businessError) && <div className="permissions-error">{error || businessError}</div>}

      <div className="permissions-stats">
        {permissionStats.map((stat) => {
          const Icon = stat.icon;

          return (
            <article className={`permissions-stat permissions-stat-${stat.tone}`} key={stat.title}>
              <div className="permissions-stat-copy">
                <div className="permissions-stat-title">{stat.title}</div>

                <div className="permissions-stat-value">{stat.value}</div>

                <div className="permissions-stat-detail">{stat.detail}</div>
              </div>

              <div className="permissions-stat-icon">
                <Icon size={19} />
              </div>
            </article>
          );
        })}
      </div>

      <div className="permissions-toolbar">
        <div className="permissions-search">
          <Search size={17} />

          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search permissions..." />

          {search && (
            <button type="button" className="permissions-search-clear" onClick={clearSearch} aria-label="Clear search" title="Clear search">
              <X size={15} />
            </button>
          )}
        </div>

        <select className="permissions-filter" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
          <option value="">All Types</option>

          <option value="SYSTEM">System</option>

          <option value="CUSTOM">Custom</option>
        </select>

        <select className="permissions-filter" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
          <option value="">All Status</option>

          <option value="ACTIVE">Active</option>

          <option value="INACTIVE">Inactive</option>
        </select>

        {(search || typeFilter || statusFilter) && (
          <button type="button" className="permissions-page-btn permissions-clear" onClick={clearFilters}>
            Clear Filters
          </button>
        )}
      </div>

      <div className="permissions-table-card">
        <div className="permissions-table-wrap">
          <table className="permissions-table">
            <thead>
              <tr>
                <th>Permission</th>

                <th>Description</th>

                <th>Module</th>

                <th>Action</th>

                <th>Type</th>

                <th>Status</th>

                <th>Created</th>

                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading || businessLoading ? (
                <tr>
                  <td colSpan="8">
                    <div className="permissions-empty">
                      <div className="permissions-loading">
                        <RefreshCw size={16} className="permissions-spinner" />
                        Loading permissions...
                      </div>
                    </div>
                  </td>
                </tr>
              ) : filteredPermissions.length === 0 ? (
                <tr>
                  <td colSpan="8">
                    <div className="permissions-empty">No permissions found.</div>
                  </td>
                </tr>
              ) : (
                filteredPermissions.map((permission) => {
                  const permissionId = getPermissionId(permission);

                  const name = getPermissionName(permission);

                  const type = getPermissionType(permission);

                  const active = isPermissionActive(permission);

                  return (
                    <tr key={permissionId}>
                      <td>
                        <div className="permission-name-cell">
                          <div className="permission-avatar">{getInitials(name)}</div>

                          <div>
                            <div className="permission-name-main">{name}</div>

                            <div className="permission-name-sub">{permission?.slug ? permission.slug : "Permission"}</div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="permission-description">{permission?.description || "No description"}</span>
                      </td>

                      <td>
                        <span className="permission-module">{permission?.module || "—"}</span>
                      </td>

                      <td>
                        <span className="permission-action">{permission?.action || "—"}</span>
                      </td>

                      <td>
                        <span className={typeClass(type)}>{type}</span>
                      </td>

                      <td>
                        <span className={statusClass(active)}>{active ? "ACTIVE" : "INACTIVE"}</span>
                      </td>

                      <td>{formatDate(permission?.createdAt)}</td>

                      <td>
                        <div className="permission-actions">
                          {type === "CUSTOM" && (
                            <button type="button" className="permission-action-btn" title="Edit" onClick={() => openEdit(permission)} disabled={!canManagePermissions}>
                              <Edit3 size={14} />
                            </button>
                          )}

                          <button type="button" className="permission-action-btn" title={active ? "Deactivate" : "Activate"} onClick={() => handleToggleStatus(permission)} disabled={!canManagePermissions}>
                            {active ? <Trash2 size={14} /> : <Check size={14} />}
                          </button>

                          {type === "CUSTOM" && (
                            <button type="button" className="permission-action-btn danger" title="Delete" onClick={() => handleDelete(permission)} disabled={!canManagePermissions}>
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
      </div>

      {modal && (
        <div
          className="permissions-modal"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !saving) {
              closeModal();
            }
          }}>
          <div className="permissions-dialog">
            <div className="permissions-dialog-head">
              <div>
                <h2 className="permissions-dialog-title">{modal === "create" ? "Add Permission" : "Edit Permission"}</h2>

                <p className="permissions-dialog-subtitle">{modal === "create" ? "Create a custom permission for this business." : "Update the permission details."}</p>
              </div>

              <button type="button" className="permissions-dialog-close" onClick={closeModal} disabled={saving}>
                <X size={16} />
              </button>
            </div>

            <div className="permissions-dialog-body">
              <div className="permissions-form">
                <div className="permissions-field">
                  <label>Permission Name</label>

                  <input value={form.name} onChange={(event) => handleFormChange("name", event.target.value)} placeholder="e.g. Leads View" disabled={saving || (modal === "edit" && getPermissionType(selectedPermission) === "SYSTEM")} />
                </div>

                <div className="permissions-field">
                  <label>Module</label>

                  <input value={form.module} onChange={(event) => handleFormChange("module", event.target.value)} placeholder="e.g. leads" disabled={saving || (modal === "edit" && getPermissionType(selectedPermission) === "SYSTEM")} />
                </div>

                <div className="permissions-field">
                  <label>Action</label>

                  <input value={form.action} onChange={(event) => handleFormChange("action", event.target.value)} placeholder="e.g. view" disabled={saving || (modal === "edit" && getPermissionType(selectedPermission) === "SYSTEM")} />
                </div>

                <div className="permissions-field full">
                  <label>Description</label>

                  <textarea value={form.description} onChange={(event) => handleFormChange("description", event.target.value)} placeholder="Describe what this permission allows..." disabled={saving || (modal === "edit" && getPermissionType(selectedPermission) === "SYSTEM")} />
                </div>
              </div>
            </div>

            <div className="permissions-dialog-footer">
              {modal === "edit" && selectedPermission && (
                <div className="permissions-dialog-footer-left">
                  <button type="button" className="permissions-page-btn permissions-status-btn" onClick={() => handleToggleStatus(selectedPermission)} disabled={saving}>
                    {isPermissionActive(selectedPermission) ? <Trash2 size={14} /> : <Check size={14} />}

                    {isPermissionActive(selectedPermission) ? "Deactivate" : "Activate"}
                  </button>

                  {getPermissionType(selectedPermission) === "CUSTOM" && (
                    <button
                      type="button"
                      className="permissions-page-btn permissions-delete-btn"
                      onClick={async () => {
                        await handleDelete(selectedPermission);
                        closeModal();
                      }}
                      disabled={saving}>
                      <Trash2 size={14} />
                      Delete
                    </button>
                  )}
                </div>
              )}

              <div className="permissions-dialog-footer-right">
                <button type="button" className="permissions-page-btn" onClick={closeModal} disabled={saving}>
                  Cancel
                </button>

                {!(modal === "edit" && selectedPermission && getPermissionType(selectedPermission) === "SYSTEM") && (
                  <button type="button" className="permissions-page-btn permissions-page-btn-primary" onClick={savePermission} disabled={saving}>
                    {saving ? (
                      <>
                        <RefreshCw size={14} className="permissions-spinner" />
                        Saving...
                      </>
                    ) : (
                      <>
                        {modal === "create" ? <Plus size={14} /> : <Check size={14} />}

                        {modal === "create" ? "Create Permission" : "Save Changes"}
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Permissions;
