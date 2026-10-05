import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import useBusiness from "../hooks/useBusiness";
import { hasPermission, PERMISSIONS } from "../utils/permissions";

const resolveRequiredPermission = (pathname) => {
  const rules = [
    [/^\/dashboard(?:\/|$)/, PERMISSIONS.DASHBOARD_VIEW],
    [/^\/leads(?:\/|$)/, PERMISSIONS.LEADS_VIEW],
    [/^\/contacts(?:\/|$)/, PERMISSIONS.CONTACTS_VIEW],
    [/^\/companies(?:\/|$)/, PERMISSIONS.COMPANIES_VIEW],
    [/^\/deals(?:\/|$)/, PERMISSIONS.DEALS_VIEW],
    [/^\/activities(?:\/|$)/, PERMISSIONS.ACTIVITIES_VIEW],
    [/^\/tasks(?:\/|$)/, PERMISSIONS.TASKS_VIEW],
    [/^\/pipelines(?:\/|$)/, PERMISSIONS.PIPELINES_VIEW],
    [/^\/tags(?:\/|$)/, PERMISSIONS.TAGS_VIEW],
    [/^\/meetings(?:\/|$)/, PERMISSIONS.MEETINGS_VIEW],
    [/^\/calendar(?:\/|$)/, PERMISSIONS.CALENDAR_VIEW],
    [/^\/(email|whatsapp|sms|communication-history)(?:\/|$)/, PERMISSIONS.COMMUNICATIONS_VIEW],
    [/^\/(forms|public-links|qr)(?:\/|$)/, PERMISSIONS.FORMS_VIEW],
    [/^\/sources-campaigns(?:\/|$)/, PERMISSIONS.LEAD_SOURCES_VIEW],
    [/^\/automations(?:\/|$)/, PERMISSIONS.AUTOMATIONS_VIEW],
    [/^\/workflows(?:\/|$)/, PERMISSIONS.WORKFLOWS_VIEW],
    [/^\/webhooks(?:\/|$)/, PERMISSIONS.WEBHOOKS_VIEW],
    [/^\/reports\/sales(?:\/|$)/, PERMISSIONS.SALES_REPORT_VIEW],
    [/^\/reports\/leads(?:\/|$)/, PERMISSIONS.LEADS_REPORT_VIEW],
    [/^\/reports\/deals(?:\/|$)/, PERMISSIONS.DEALS_REPORT_VIEW],
    [/^\/reports\/activity(?:\/|$)/, PERMISSIONS.ACTIVITIES_REPORT_VIEW],
    [/^\/reports(?:\/|$)/, PERMISSIONS.REPORTS_VIEW],
    [/^\/team\/roles(?:\/|$)/, PERMISSIONS.ROLES_VIEW],
    [/^\/team\/permissions(?:\/|$)/, PERMISSIONS.PERMISSIONS_VIEW],
    [/^\/team(?:\/|$)/, PERMISSIONS.USERS_VIEW],
    [/^\/notifications(?:\/|$)/, PERMISSIONS.NOTIFICATIONS_VIEW],
    [/^\/audit-log(?:\/|$)/, PERMISSIONS.AUDIT_VIEW],
    [/^\/integrations(?:\/|$)/, PERMISSIONS.INTEGRATIONS_VIEW],
    [/^\/settings(?:\/|$)/, PERMISSIONS.SETTINGS_VIEW],
    [/^\/subscription(?:\/|$)/, PERMISSIONS.SETTINGS_VIEW],
  ];

  return rules.find(([pattern]) => pattern.test(pathname))?.[1] || null;
};

function ProtectedRoute() {
  const { user, loading: authLoading } = useAuth();
  const { permissions, isBusinessOwner, loading: businessLoading, error: businessError } = useBusiness();
  const location = useLocation();

  if (authLoading) {
    return (
      <div className="app-auth-loading">
        <div className="app-auth-loading-spinner" />
        <p>Checking your session...</p>
      </div>
    );
  }

  if (!user || !localStorage.getItem("token")) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  /* My Profile is intentionally outside the permission matrix. */
  if (location.pathname === "/profile") {
    return <Outlet />;
  }

  if (businessLoading) {
    return (
      <div className="app-auth-loading">
        <div className="app-auth-loading-spinner" />
        <p>Checking your access...</p>
      </div>
    );
  }

  if (businessError) {
    return <Navigate to="/profile" replace state={{ accessError: businessError }} />;
  }

  const requiredPermission = resolveRequiredPermission(location.pathname);

  if (requiredPermission && !hasPermission({ permissions, isBusinessOwner }, requiredPermission)) {
    return <Navigate to="/profile" replace state={{ accessDenied: true, requiredPermission }} />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
