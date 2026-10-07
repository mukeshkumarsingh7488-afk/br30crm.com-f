export const ACCESS_STORAGE_KEY = "br30-crm-access";

const normalizePermissionList = (permissions) => {
  if (!Array.isArray(permissions)) return [];

  return permissions
    .map((permission) => {
      if (typeof permission === "string") return permission.trim().toLowerCase();
      return String(permission?.slug || "")
        .trim()
        .toLowerCase();
    })
    .filter(Boolean);
};

export const normalizeAccess = (access = {}) => {
  const role = access?.role || access?.roleId || null;
  const roleSlug = String(role?.slug || access?.roleSlug || "")
    .trim()
    .toLowerCase();
  const permissions = normalizePermissionList(access?.permissions || role?.permissions || []);

  return {
    businessId: access?.businessId ? String(access.businessId) : "",
    role,
    roleSlug,
    permissions,
    isBusinessOwner: Boolean(access?.isBusinessOwner),
    loading: Boolean(access?.loading),
  };
};

export const isManagementRole = (access) => {
  const normalized = normalizeAccess(access);
  if (normalized.isBusinessOwner) return true;
  const slug = String(normalized.roleSlug || "")
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-");
  const name = String(normalized.role?.name || "")
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-");
  return slug === "manager" || slug === "team-manager" || slug.endsWith("-manager") || name === "manager" || name === "team-manager" || name.endsWith("-manager");
};

export const hasPermission = (access, requiredPermission) => {
  const normalized = normalizeAccess(access);

  if (!requiredPermission) return true;
  if (normalized.isBusinessOwner) return true;

  return normalized.permissions.includes(String(requiredPermission).trim().toLowerCase());
};

export const hasAnyPermission = (access, requiredPermissions = []) => {
  if (!Array.isArray(requiredPermissions) || !requiredPermissions.length) return true;

  const normalized = normalizeAccess(access);

  if (normalized.isBusinessOwner) return true;

  const allowed = new Set(normalized.permissions);
  return requiredPermissions.some((permission) => allowed.has(String(permission).trim().toLowerCase()));
};

export const hasAllPermissions = (access, requiredPermissions = []) => {
  if (!Array.isArray(requiredPermissions) || !requiredPermissions.length) return true;

  const normalized = normalizeAccess(access);

  if (normalized.isBusinessOwner) return true;

  const allowed = new Set(normalized.permissions);
  return requiredPermissions.every((permission) => allowed.has(String(permission).trim().toLowerCase()));
};

export const getStoredAccess = () => {
  try {
    const value = localStorage.getItem(ACCESS_STORAGE_KEY);
    return value ? normalizeAccess(JSON.parse(value)) : normalizeAccess();
  } catch {
    localStorage.removeItem(ACCESS_STORAGE_KEY);
    return normalizeAccess();
  }
};

export const saveAccess = (access) => {
  const normalized = normalizeAccess(access);
  localStorage.setItem(ACCESS_STORAGE_KEY, JSON.stringify(normalized));
  window.dispatchEvent(new CustomEvent("crm-access-change", { detail: normalized }));
  return normalized;
};

export const clearAccess = () => {
  localStorage.removeItem(ACCESS_STORAGE_KEY);
  window.dispatchEvent(new CustomEvent("crm-access-change"));
};

export const PERMISSIONS = Object.freeze({
  DASHBOARD_VIEW: "dashboard.view",
  LEADS_VIEW: "leads.view",
  LEADS_CREATE: "leads.create",
  LEADS_UPDATE: "leads.update",
  LEADS_DELETE: "leads.delete",
  LEADS_ASSIGN: "leads.assign",
  LEADS_CONVERT: "leads.convert",
  LEADS_EXPORT: "leads.export",
  CONTACTS_VIEW: "contacts.view",
  CONTACTS_CREATE: "contacts.create",
  CONTACTS_UPDATE: "contacts.update",
  CONTACTS_DELETE: "contacts.delete",
  CONTACTS_ASSIGN: "contacts.assign",
  CONTACTS_EXPORT: "contacts.export",
  COMPANIES_VIEW: "companies.view",
  COMPANIES_CREATE: "companies.create",
  COMPANIES_UPDATE: "companies.update",
  COMPANIES_DELETE: "companies.delete",
  COMPANIES_ASSIGN: "companies.assign",
  COMPANIES_EXPORT: "companies.export",
  DEALS_VIEW: "deals.view",
  DEALS_CREATE: "deals.create",
  DEALS_UPDATE: "deals.update",
  DEALS_DELETE: "deals.delete",
  DEALS_ASSIGN: "deals.assign",
  DEALS_EXPORT: "deals.export",
  ACTIVITIES_VIEW: "activities.view",
  ACTIVITIES_CREATE: "activities.create",
  ACTIVITIES_UPDATE: "activities.update",
  ACTIVITIES_DELETE: "activities.delete",
  ACTIVITIES_COMPLETE: "activities.complete",
  TASKS_VIEW: "tasks.view",
  TASKS_CREATE: "tasks.create",
  TASKS_UPDATE: "tasks.update",
  TASKS_DELETE: "tasks.delete",
  TASKS_ASSIGN: "tasks.assign",
  TASKS_COMPLETE: "tasks.complete",
  NOTES_VIEW: "notes.view",
  NOTES_CREATE: "notes.create",
  NOTES_UPDATE: "notes.update",
  NOTES_DELETE: "notes.delete",
  PIPELINES_VIEW: "pipelines.view",
  PIPELINES_CREATE: "pipelines.create",
  PIPELINES_UPDATE: "pipelines.update",
  PIPELINES_DELETE: "pipelines.delete",
  TAGS_VIEW: "tags.view",
  TAGS_CREATE: "tags.create",
  TAGS_UPDATE: "tags.update",
  TAGS_DELETE: "tags.delete",
  TEAMS_VIEW: "teams.view",
  TEAMS_CREATE: "teams.create",
  TEAMS_UPDATE: "teams.update",
  TEAMS_DELETE: "teams.delete",
  USERS_VIEW: "users.view",
  USERS_CREATE: "users.create",
  USERS_UPDATE: "users.update",
  USERS_DELETE: "users.delete",
  USERS_ASSIGN: "users.assign",
  ROLES_VIEW: "roles.view",
  ROLES_CREATE: "roles.create",
  ROLES_UPDATE: "roles.update",
  ROLES_DELETE: "roles.delete",
  PERMISSIONS_VIEW: "permissions.view",
  PERMISSIONS_MANAGE: "permissions.manage",
  PERMISSIONS_ADD: "permissions.add",
  FORMS_VIEW: "forms.view",
  FORMS_CREATE: "forms.create",
  FORMS_UPDATE: "forms.update",
  FORMS_DELETE: "forms.delete",
  MEETINGS_VIEW: "meetings.view",
  MEETINGS_CREATE: "meetings.create",
  MEETINGS_UPDATE: "meetings.update",
  MEETINGS_DELETE: "meetings.delete",
  MEETINGS_COMPLETE: "meetings.complete",
  MEETINGS_JOIN: "meetings.join",
  MEETINGS_CANCEL: "meetings.cancel",
  CALENDAR_VIEW: "calendar.view",
  CALENDAR_CREATE: "calendar.create",
  CALENDAR_UPDATE: "calendar.update",
  CALENDAR_DELETE: "calendar.delete",
  CALENDAR_ACCOUNTS_VIEW: "calendar.accounts.view",
  CALENDAR_ACCOUNTS_MANAGE: "calendar.accounts.manage",
  CALENDAR_AVAILABILITY_VIEW: "calendar.availability.view",
  CALENDAR_AVAILABILITY_MANAGE: "calendar.availability.manage",
  COMMUNICATIONS_VIEW: "communications.view",
  COMMUNICATIONS_SEND: "communications.send",
  WEBHOOKS_VIEW: "webhooks.view",
  WEBHOOKS_CREATE: "webhooks.create",
  WEBHOOKS_UPDATE: "webhooks.update",
  WEBHOOKS_DELETE: "webhooks.delete",
  AUTOMATIONS_VIEW: "automations.view",
  AUTOMATIONS_CREATE: "automations.create",
  AUTOMATIONS_UPDATE: "automations.update",
  AUTOMATIONS_DELETE: "automations.delete",
  AUTOMATIONS_EXECUTE: "automations.execute",
  WORKFLOWS_VIEW: "workflows.view",
  WORKFLOWS_CREATE: "workflows.create",
  WORKFLOWS_UPDATE: "workflows.update",
  WORKFLOWS_DELETE: "workflows.delete",
  WORKFLOWS_EXECUTE: "workflows.execute",
  NOTIFICATIONS_VIEW: "notifications.view",
  NOTIFICATIONS_CREATE: "notifications.create",
  NOTIFICATIONS_UPDATE: "notifications.update",
  NOTIFICATIONS_DELETE: "notifications.delete",
  NOTIFICATIONS_MANAGE: "notifications.manage",
  AUDIT_VIEW: "audit.view",
  ANALYTICS_VIEW: "analytics.view",
  ANALYTICS_CREATE: "analytics.create",
  ANALYTICS_DELETE: "analytics.delete",
  ANALYTICS_EXPORT: "analytics.export",
  REPORTS_VIEW: "reports.view",
  REPORTS_CREATE: "reports.create",
  REPORTS_UPDATE: "reports.update",
  REPORTS_DELETE: "reports.delete",
  SALES_REPORT_VIEW: "sales-report.view",
  LEADS_REPORT_VIEW: "leads-report.view",
  DEALS_REPORT_VIEW: "deals-report.view",
  ACTIVITIES_REPORT_VIEW: "activities-report.view",
  SETTINGS_VIEW: "settings.view",
  SETTINGS_CREATE: "settings.create",
  SETTINGS_UPDATE: "settings.update",
  INTEGRATIONS_VIEW: "integrations.view",
  INTEGRATIONS_CREATE: "integrations.create",
  INTEGRATIONS_UPDATE: "integrations.update",
  INTEGRATIONS_DELETE: "integrations.delete",
  CUSTOM_FIELDS_VIEW: "custom-fields.view",
  CUSTOM_FIELDS_CREATE: "custom-fields.create",
  CUSTOM_FIELDS_UPDATE: "custom-fields.update",
  CUSTOM_FIELDS_DELETE: "custom-fields.delete",
  DUPLICATES_VIEW: "duplicates.view",
  DUPLICATES_MANAGE: "duplicates.manage",
  IMPORTS_VIEW: "imports.view",
  IMPORTS_CREATE: "imports.create",
  EXPORTS_CREATE: "exports.create",
  FILES_VIEW: "files.view",
  FILES_CREATE: "files.create",
  FILES_UPDATE: "files.update",
  FILES_DELETE: "files.delete",
  SEARCH_VIEW: "search.view",
  API_KEYS_VIEW: "api-keys.view",
  API_KEYS_CREATE: "api-keys.create",
  API_KEYS_UPDATE: "api-keys.update",
  API_KEYS_DELETE: "api-keys.delete",
  INVITATIONS_VIEW: "invitations.view",
  INVITATIONS_CREATE: "invitations.create",
  INVITATIONS_DELETE: "invitations.delete",
  WHATSNEW_VIEW: "whatsnew.view",
  WHATSNEW_CREATE: "whatsnew.create",
  WHATSNEW_UPDATE: "whatsnew.update",
  WHATSNEW_DELETE: "whatsnew.delete",
  LEAD_SOURCES_VIEW: "lead-sources.view",
  LEAD_SOURCES_CREATE: "lead-sources.create",
  LEAD_SOURCES_UPDATE: "lead-sources.update",
  LEAD_SOURCES_DELETE: "lead-sources.delete",
  LEAD_ATTRIBUTION_VIEW: "lead-attribution.view",
  LEAD_ATTRIBUTION_CREATE: "lead-attribution.create",
  LEAD_ATTRIBUTION_UPDATE: "lead-attribution.update",
  LEAD_ATTRIBUTION_DELETE: "lead-attribution.delete",
});

export const assertFrontendPermission = (requiredPermission, message = "You do not have permission to perform this action.") => {
  const access = getStoredAccess();

  if (!requiredPermission || access.isBusinessOwner) return true;

  if (hasPermission(access, requiredPermission)) return true;

  const error = new Error(message);
  error.code = "CLIENT_PERMISSION_DENIED";
  error.status = 403;
  throw error;
};
