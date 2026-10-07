import { getStoredAccess, hasAllPermissions, hasPermission } from "./permissions";

const ACTION_METHODS = new Set(["POST", "PATCH", "PUT", "DELETE"]);

const segment = (url = "") => {
  const clean = String(url).split("?")[0];
  return clean.startsWith("/") ? clean : `/${clean}`;
};

export const resolveRequestPermissions = ({ method = "GET", url = "", data = null }) => {
  const upperMethod = String(method || "GET").toUpperCase();
  const path = segment(url);
  const isWrite = ACTION_METHODS.has(upperMethod);

  if (!path.includes("/business/")) return [];

  const rules = [
    [/\/leads\/business\//, "leads"],
    [/\/lead-sources\/business\//, "lead-sources"],
    [/\/lead-attribution\/business\//, "lead-attribution"],
    [/\/contacts\/business\//, "contacts"],
    [/\/companies\/business\//, "companies"],
    [/\/deals\/business\//, "deals"],
    [/\/activities\/business\//, "activities"],
    [/\/tasks\/business\//, "tasks"],
    [/\/notes\/business\//, "notes"],
    [/\/pipelines\/business\//, "pipelines"],
    [/\/tags\/business\//, "tags"],
    [/\/teams\/business\//, "teams"],
    [/\/business-members\//, "users"],
    [/\/roles\/business\//, "roles"],
    [/\/permissions\/business\//, "permissions"],
    [/\/forms\/business\//, "forms"],
    [/\/qr\/business\//, "forms"],
    [/\/meetings\/business\//, "meetings"],
    [/\/calendar\/business\//, "calendar"],
    [/\/communications\/business\//, "communications"],
    [/\/webhooks\/business\//, "webhooks"],
    [/\/automations\/business\//, "automations"],
    [/\/workflows\/business\//, "workflows"],
    [/\/notifications\/business\//, "notifications"],
    [/\/audit\/business\//, "audit"],
    [/\/analytics\/business\//, "analytics"],
    [/\/reports\/business\//, "reports"],
    [/\/settings\/business\//, "settings"],
    [/\/integrations\/business\//, "integrations"],
    [/\/custom-fields\/business\//, "custom-fields"],
    [/\/duplicates\/business\//, "duplicates"],
    [/\/imports\/business\//, "imports"],
    [/\/files\/business\//, "files"],
    [/\/search\/business\//, "search"],
    [/\/api-keys\/business\//, "api-keys"],
    [/\/invitations\/business\//, "invitations"],
  ];

  const matched = rules.find(([pattern]) => pattern.test(path));
  if (!matched) return [];

  const module = matched[1];
  if (/\/leads\/business\/[^/]+\/[^/]+\/convert$/.test(path)) return ["leads.convert"];
  if (/\/leads\/business\/[^/]+\/[^/]+\/assign$/.test(path)) return ["leads.assign"];
  if (/\/contacts\/business\/[^/]+\/[^/]+\/assign$/.test(path)) return ["contacts.assign"];
  if (/\/companies\/business\/[^/]+\/[^/]+\/assign$/.test(path)) return ["companies.assign"];
  if (/\/deals\/business\/[^/]+\/[^/]+\/assign$/.test(path)) return ["deals.assign"];
  if (/\/tasks\/business\/[^/]+\/[^/]+\/(?:assign|unassign)$/.test(path)) return ["tasks.assign"];
  if (/\/tasks\/business\/[^/]+\/[^/]+\/complete$/.test(path)) return ["tasks.complete"];
  if (/\/activities\/business\/[^/]+\/[^/]+\/complete$/.test(path)) return ["activities.complete"];
  if (/\/automations\/business\/[^/]+\/[^/]+\/execute$/.test(path)) return ["automations.execute"];
  if (/\/automations\/business\/[^/]+\/[^/]+\/clone$/.test(path)) return ["automations.create"];
  if (/\/workflows\/business\/[^/]+\/[^/]+\/execute$/.test(path)) return ["workflows.execute"];
  if (/\/webhooks\/business\/[^/]+\/[^/]+\/(?:test|regenerate-secret|deliveries\/[^/]+\/retry)$/.test(path)) return ["webhooks.update"];
  if (/\/reports\/business\/[^/]+\/sales$/.test(path)) return ["sales-report.view"];
  if (/\/reports\/business\/[^/]+\/leads$/.test(path)) return ["leads-report.view"];
  if (/\/reports\/business\/[^/]+\/deals$/.test(path)) return ["deals-report.view"];
  if (/\/reports\/business\/[^/]+\/activities$/.test(path)) return ["activities-report.view"];
  if (/\/reports\/business\/[^/]+\/[^/]+\/run$/.test(path)) return ["reports.view"];
  if (/\/permissions\/[^/]+$/.test(path) && upperMethod === "PATCH") return ["permissions.manage"];
  if (/\/permissions\/[^/]+$/.test(path) && upperMethod === "DELETE") return ["permissions.manage"];

  if (!isWrite) return [`${module}.view`];
  if (upperMethod === "POST") return [`${module}.create`];
  if (upperMethod === "DELETE") return [`${module}.delete`];
  return [`${module}.update`];
};

export const assertRequestPermission = ({ method, url }) => {
  const required = resolveRequestPermissions({ method, url });
  if (!required.length) return true;

  const access = getStoredAccess();
  if (access.isBusinessOwner) return true;

  const allowed = required.length === 1 ? hasPermission(access, required[0]) : hasAllPermissions(access, required);
  if (allowed) return true;

  const error = new Error(`Permission denied. Required: ${required.join(", ")}`);
  error.code = "CLIENT_PERMISSION_DENIED";
  error.status = 403;
  error.requiredPermissions = required;
  throw error;
};
