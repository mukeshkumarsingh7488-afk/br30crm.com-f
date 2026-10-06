import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { NavLink, useNavigate } from "react-router-dom";

import {
  Activity,
  BarChart3,
  Bell,
  BellRing,
  CreditCard,
  Building2,
  CalendarDays,
  CheckSquare,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  ContactRound,
  FileText,
  GitBranch,
  Globe,
  LayoutDashboard,
  Laptop,
  Link2,
  LogOut,
  Mail,
  MessageCircle,
  Monitor,
  Moon,
  Network,
  QrCode,
  Settings,
  ShieldCheck,
  Smartphone,
  Sun,
  Target,
  UsersRound,
  Workflow,
  X,
  Tag,
} from "lucide-react";

import { showAuthAlert } from "../auth/authAlert";
import useBusiness from "../../hooks/useBusiness";
import { hasPermission, PERMISSIONS } from "../../utils/permissions";

const crmMenu = [
  { label: "Leads", path: "/leads", icon: Target },
  { label: "Contacts", path: "/contacts", icon: ContactRound },
  { label: "Companies", path: "/companies", icon: Building2 },
  { label: "Tags", path: "/tags", icon: Tag },
  { label: "Deals", path: "/deals", icon: CircleDollarSign },
  { label: "Pipelines", path: "/pipelines", icon: GitBranch },
  { label: "Tasks", path: "/tasks", icon: CheckSquare },
  { label: "Activities", path: "/activities", icon: Activity },
  { label: "Meetings", path: "/meetings", icon: CalendarDays },
  { label: "Calendar", path: "/calendar", icon: CalendarDays },
];

const communicationMenu = [
  { label: "Email", path: "/email", icon: Mail },
  { label: "WhatsApp", path: "/whatsapp", icon: MessageCircle },
  { label: "SMS", path: "/sms", icon: Smartphone },
  { label: "Communication History", path: "/communication-history", icon: FileText },
];

const leadGenerationMenu = [
  { label: "Forms", path: "/forms", icon: FileText },
  { label: "Public Links", path: "/public-links", icon: Link2 },
  { label: "QR", path: "/qr", icon: QrCode },
  { label: "Sources / Campaigns", path: "/sources-campaigns", icon: Globe },
];

const automationMenu = [
  { label: "Automations", path: "/automations", icon: Workflow },
  { label: "Workflows", path: "/workflows", icon: Network },
  { label: "Webhooks", path: "/webhooks", icon: Link2 },
];

const reportsMenu = [
  { label: "Sales", path: "/reports/sales", icon: BarChart3 },
  { label: "Leads", path: "/reports/leads", icon: Target },
  { label: "Deals", path: "/reports/deals", icon: CircleDollarSign },
  { label: "Activity", path: "/reports/activity", icon: Activity },
];

const teamMenu = [
  { label: "Team", path: "/team", icon: UsersRound },
  { label: "Members", path: "/team/members", icon: UsersRound },
  { label: "Roles", path: "/team/roles", icon: ShieldCheck },
  { label: "Permissions", path: "/team/permissions", icon: ShieldCheck },
];

const systemMenu = [
  { label: "Notifications", path: "/notifications", icon: BellRing },
  { label: "Audit Logs", path: "/audit-log", icon: ShieldCheck },
  { label: "Integrations", path: "/integrations", icon: Network },
  { label: "Subscription", path: "/subscription", icon: CreditCard },
];

const sections = [
  { label: "CRM", icon: ContactRound, items: crmMenu },
  { label: "Communication", icon: MessageCircle, items: communicationMenu },
  { label: "Lead Generation", icon: Globe, items: leadGenerationMenu },
  { label: "Automation", icon: Workflow, items: automationMenu },
  { label: "Reports", icon: BarChart3, items: reportsMenu },
  { label: "Team", icon: UsersRound, items: teamMenu },
  { label: "System", icon: Laptop, items: systemMenu },
];

const normalizeMode = (mode) =>
  ({
    default: "rail",
    classic: "accordion",
    overlay: "dual",
  })[mode] ||
  mode ||
  "rail";

function Sidebar({ collapsed, mobileOpen, sidebarMode = "rail", onToggle, onMobileClose }) {
  const navigate = useNavigate();
  const activeMode = normalizeMode(sidebarMode);
  const { permissions, isBusinessOwner } = useBusiness();
  const access = { permissions, isBusinessOwner };

  const [sectionHover, setSectionHover] = useState(null);
  const [expandedSection, setExpandedSection] = useState("CRM");
  const [theme, setTheme] = useState(localStorage.getItem("crm-theme") || "system");

  const [user, setUser] = useState(() => {
    try {
      const value = JSON.parse(localStorage.getItem("user") || "null");
      return value?.user || value || {};
    } catch {
      return {};
    }
  });

  const sectionHoverTimer = useRef(null);

  useEffect(() => {
    const onThemeChange = (event) => {
      setTheme(event.detail || localStorage.getItem("crm-theme") || "system");
    };

    const onStorage = () => {
      setTheme(localStorage.getItem("crm-theme") || "system");
    };

    window.addEventListener("crm-theme-change", onThemeChange);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("crm-theme-change", onThemeChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  useEffect(() => {
    const onUserChange = () => {
      try {
        const value = JSON.parse(localStorage.getItem("user") || "null");
        setUser(value?.user || value || {});
      } catch {}
    };

    window.addEventListener("crm-user-change", onUserChange);

    return () => {
      window.removeEventListener("crm-user-change", onUserChange);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (sectionHoverTimer.current) {
        clearTimeout(sectionHoverTimer.current);
      }
    };
  }, []);

  const userName = user?.name || "User";

  const initials = useMemo(
    () =>
      userName
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join("") || "U",
    [userName]
  );

  const ThemeIcon = theme === "light" ? Sun : theme === "dark" ? Moon : Monitor;

  const handleLogout = async () => {
    const result = await showAuthAlert({
      icon: "warning",
      title: "Logout?",
      text: "Are you sure you want to logout from BR30 CRM?",
      showCancelButton: true,
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Cancel",
      allowOutsideClick: false,
      allowEscapeKey: true,
    });

    if (!result.isConfirmed) return;

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const cycleTheme = () => {
    const next = theme === "light" ? "dark" : theme === "dark" ? "system" : "light";

    localStorage.setItem("crm-theme", next);
    setTheme(next);

    window.dispatchEvent(
      new CustomEvent("crm-theme-change", {
        detail: next,
      })
    );
  };

  const handleNavClick = () => {
    if (mobileOpen) {
      onMobileClose?.();
    }
  };

  const permissionForPath = (path) => {
    if (path === "/dashboard") return PERMISSIONS.DASHBOARD_VIEW;
    if (path === "/leads") return PERMISSIONS.LEADS_VIEW;
    if (path === "/contacts") return PERMISSIONS.CONTACTS_VIEW;
    if (path === "/companies") return PERMISSIONS.COMPANIES_VIEW;
    if (path === "/deals") return PERMISSIONS.DEALS_VIEW;
    if (path === "/activities") return PERMISSIONS.ACTIVITIES_VIEW;
    if (path === "/tasks") return PERMISSIONS.TASKS_VIEW;
    if (path === "/pipelines") return PERMISSIONS.PIPELINES_VIEW;
    if (path === "/tags") return PERMISSIONS.TAGS_VIEW;
    if (path === "/meetings") return PERMISSIONS.MEETINGS_VIEW;
    if (path === "/calendar") return PERMISSIONS.CALENDAR_VIEW;
    if (["/email", "/whatsapp", "/sms", "/communication-history"].includes(path)) return PERMISSIONS.COMMUNICATIONS_VIEW;
    if (["/forms", "/public-links", "/qr"].includes(path)) return PERMISSIONS.FORMS_VIEW;
    if (path === "/sources-campaigns") return PERMISSIONS.LEAD_SOURCES_VIEW;
    if (path === "/automations") return PERMISSIONS.AUTOMATIONS_VIEW;
    if (path === "/workflows") return PERMISSIONS.WORKFLOWS_VIEW;
    if (path === "/webhooks") return PERMISSIONS.WEBHOOKS_VIEW;
    if (path === "/reports/sales") return PERMISSIONS.SALES_REPORT_VIEW;
    if (path === "/reports/leads") return PERMISSIONS.LEADS_REPORT_VIEW;
    if (path === "/reports/deals") return PERMISSIONS.DEALS_REPORT_VIEW;
    if (path === "/reports/activity") return PERMISSIONS.ACTIVITIES_REPORT_VIEW;
    if (path === "/team/roles") return PERMISSIONS.ROLES_VIEW;
    if (path === "/team/permissions") return PERMISSIONS.PERMISSIONS_VIEW;
    if (["/team", "/team/members"].includes(path)) return PERMISSIONS.USERS_VIEW;
    if (path === "/notifications") return PERMISSIONS.NOTIFICATIONS_VIEW;
    if (path === "/audit-log") return PERMISSIONS.AUDIT_VIEW;
    if (path === "/integrations") return PERMISSIONS.INTEGRATIONS_VIEW;
    if (["/settings", "/subscription"].includes(path)) return PERMISSIONS.SETTINGS_VIEW;
    return null;
  };

  const renderMenu = (items, options = {}) =>
    items
      .filter(({ path }) => hasPermission(access, permissionForPath(path)))
      .map(({ label, path, icon: Icon }) => (
        <NavLink key={path} to={path} end={path === "/team"} onClick={handleNavClick} className={({ isActive }) => `crm-nav-link ${isActive ? "active" : ""}`} title={options.iconOnly ? label : undefined}>
          <Icon className="crm-nav-icon" />
          {!options.iconOnly && <span>{label}</span>}
        </NavLink>
      ));

  const renderDashboard = (options = {}) => {
    if (!hasPermission(access, PERMISSIONS.DASHBOARD_VIEW)) return null;

    return (
      <NavLink to="/dashboard" end onClick={handleNavClick} className={({ isActive }) => `crm-nav-link ${isActive ? "active" : ""}`} title={options.iconOnly ? "Dashboard" : undefined}>
        <LayoutDashboard className="crm-nav-icon" />
        {!options.iconOnly && <span>Dashboard</span>}
      </NavLink>
    );
  };

  const renderSection = (label, items, options = {}) => (
    <div key={label} className="crm-nav-section">
      {!options.iconOnly && <div className="crm-nav-divider" />}
      {!options.hideLabel && !options.iconOnly && <div className="crm-nav-label">{label}</div>}
      {renderMenu(items, options)}
    </div>
  );

  const renderNormalNavigation = (options = {}) => (
    <>
      {renderDashboard(options)}
      {sections.map((section) => renderSection(section.label, section.items, options))}
    </>
  );

  const renderBottom = (iconOnly = false) => (
    <div className="crm-sidebar-bottom">
      <NavLink to="/settings" end onClick={handleNavClick} className="crm-bottom-link" title={iconOnly ? "Settings" : undefined}>
        <Settings className="crm-nav-icon" />
        {!iconOnly && <span>Settings</span>}
      </NavLink>

      <button type="button" className="crm-bottom-link crm-logout" onClick={handleLogout} title={iconOnly ? "Logout" : undefined}>
        <LogOut className="crm-nav-icon" />
        {!iconOnly && <span>Logout</span>}
      </button>
    </div>
  );

  const clearSectionHoverTimer = () => {
    if (sectionHoverTimer.current) {
      clearTimeout(sectionHoverTimer.current);
      sectionHoverTimer.current = null;
    }
  };

  const closeSectionHoverLater = () => {
    clearSectionHoverTimer();

    sectionHoverTimer.current = setTimeout(() => {
      setSectionHover(null);
      sectionHoverTimer.current = null;
    }, 320);
  };

  const handleSectionMouseEnter = (event, label) => {
    clearSectionHoverTimer();

    const rect = event.currentTarget.getBoundingClientRect();
    const panelHeight = Math.min(500, Math.max(260, window.innerHeight - 40));

    const top = Math.max(14, Math.min(rect.top, window.innerHeight - panelHeight - 14));

    const left = rect.right + 10;

    setSectionHover({
      label,
      top,
      left,
    });
  };

  const hoveredSection = sectionHover ? sections.find((section) => section.label === sectionHover.label) : null;

  const renderSectionHoverPanel = () => {
    if (!sectionHover || !hoveredSection) return null;

    return createPortal(
      <div
        className="crm-section-hover-panel"
        style={{
          top: `${sectionHover.top}px`,
          left: `${sectionHover.left}px`,
        }}
        onMouseEnter={clearSectionHoverTimer}
        onMouseLeave={closeSectionHoverLater}>
        <div className="crm-section-hover-title">
          <hoveredSection.icon />
          <span>{hoveredSection.label}</span>
        </div>

        <div className="crm-section-hover-menu">{renderMenu(hoveredSection.items)}</div>
      </div>,
      document.body
    );
  };

  const renderSectionRail = () => (
    <div className="crm-section-rail-inner">
      <div className="crm-section-rail-brand">
        <img src="/favicon-32x32.png" className="crm-section-rail-logo" alt="BR30 CRM" />
      </div>

      <div className="crm-section-rail-nav">
        <NavLink to="/dashboard" end onClick={handleNavClick} className={({ isActive }) => `crm-section-rail-button ${isActive ? "active" : ""}`} title="Dashboard">
          <LayoutDashboard />
          <span className="crm-section-rail-tooltip">Dashboard</span>
        </NavLink>

        {sections.map(({ label, icon: SectionIcon }) => (
          <div className="crm-section-rail-item" key={label} onMouseEnter={(event) => handleSectionMouseEnter(event, label)} onMouseLeave={closeSectionHoverLater}>
            <button type="button" className={`crm-section-rail-button ${sectionHover?.label === label ? "active" : ""}`} title={label} aria-label={label}>
              <SectionIcon />

              <span className="crm-section-rail-tooltip">{label}</span>
            </button>
          </div>
        ))}
      </div>

      <div className="crm-section-rail-bottom">
        <NavLink to="/settings" end onClick={handleNavClick} className="crm-section-rail-button" title="Settings">
          <Settings />
          <span className="crm-section-rail-tooltip">Settings</span>
        </NavLink>

        <button type="button" className="crm-section-rail-button crm-section-rail-logout" onClick={handleLogout} title="Logout">
          <LogOut />
          <span className="crm-section-rail-tooltip">Logout</span>
        </button>
      </div>

      {renderSectionHoverPanel()}
    </div>
  );

  const renderTopActions = () => (
    <div className="crm-topnav-actions">
      <button type="button" className="crm-topnav-action" onClick={cycleTheme} title={`Theme: ${theme}`} aria-label={`Theme: ${theme}`}>
        <ThemeIcon />
      </button>

      <button type="button" className="crm-topnav-action" onClick={() => navigate("/notifications")} title="Notifications" aria-label="Notifications">
        <Bell />
        <span className="crm-topnav-notification-dot" />
      </button>

      <button type="button" className="crm-topnav-action crm-topnav-profile" onClick={() => navigate("/profile")} title="Profile" aria-label="Profile">
        {user?.profileImage ? <img src={user.profileImage} alt={userName} /> : <span>{initials}</span>}
      </button>

      <NavLink to="/settings" end onClick={handleNavClick} className="crm-topnav-action" title="Settings" aria-label="Settings">
        <Settings />
      </NavLink>

      <button type="button" className="crm-topnav-action" onClick={handleLogout} title="Logout" aria-label="Logout">
        <LogOut />
      </button>
    </div>
  );

  const renderTopNavigation = () => (
    <div className="crm-topnav-inner">
      <div className="crm-topnav-brand">
        <img src="/favicon-32x32.png" className="crm-brand-logo" alt="BR30 CRM" />

        <div className="crm-brand-text">
          <div className="crm-brand-title">BR30 CRM</div>

          <div className="crm-brand-sub">Business workspace</div>
        </div>
      </div>

      <nav className="crm-topnav-menu">
        {renderDashboard()}

        {sections.map(({ label, icon: SectionIcon, items }) => (
          <div className="crm-topnav-section" key={label}>
            <button type="button" className="crm-topnav-section-button" title={label}>
              <SectionIcon />
              <span>{label}</span>
              <ChevronDown />
            </button>

            <div className="crm-topnav-dropdown">
              <div className="crm-topnav-dropdown-title">{label}</div>

              {renderMenu(items)}
            </div>
          </div>
        ))}
      </nav>

      {renderTopActions()}
    </div>
  );

  const renderSplit = (iconOnly = false) => (
    <>
      <div className="crm-brand">
        <img src="/favicon-32x32.png" className="crm-brand-logo" alt="BR30 CRM" />

        {!iconOnly && (
          <div className="crm-brand-text">
            <div className="crm-brand-title">BR30 CRM</div>

            <div className="crm-brand-sub">Business workspace</div>
          </div>
        )}
      </div>

      <nav className="crm-nav">
        {!iconOnly && <div className="crm-nav-label crm-workspace-label">Workspace</div>}

        {renderNormalNavigation({
          iconOnly,
          hideLabel: iconOnly,
        })}
      </nav>

      {renderBottom(iconOnly)}
    </>
  );

  const renderAccordion = () => (
    <>
      <div className="crm-brand">
        <img src="/favicon-32x32.png" className="crm-brand-logo" alt="BR30 CRM" />

        <div className="crm-brand-text">
          <div className="crm-brand-title">BR30 CRM</div>

          <div className="crm-brand-sub">Business workspace</div>
        </div>
      </div>

      <nav className="crm-nav crm-accordion-nav">
        {renderDashboard()}

        {sections.map(({ label, icon: SectionIcon, items }) => (
          <div key={label} className="crm-accordion-section">
            <button type="button" className="crm-accordion-header" onClick={() => setExpandedSection((value) => (value === label ? "" : label))}>
              <span>
                <SectionIcon />
                <span>{label}</span>
              </span>

              <ChevronDown className={expandedSection === label ? "open" : ""} />
            </button>

            {expandedSection === label && <div className="crm-accordion-items">{renderMenu(items)}</div>}
          </div>
        ))}
      </nav>

      {renderBottom(false)}
    </>
  );

  const renderDual = () => (
    <>
      <div className="crm-dual-primary">
        <div className="crm-brand crm-dual-brand">
          <img src="/favicon-32x32.png" className="crm-brand-logo" alt="BR30 CRM" />
        </div>

        <NavLink to="/dashboard" end onClick={handleNavClick} className={({ isActive }) => `crm-dual-primary-item ${isActive ? "active" : ""}`} title="Dashboard">
          <LayoutDashboard />
        </NavLink>

        {sections.map(({ label, icon: SectionIcon }) => (
          <button type="button" key={label} className={`crm-dual-primary-item ${expandedSection === label ? "active" : ""}`} onClick={() => setExpandedSection(label)} title={label}>
            <SectionIcon />
          </button>
        ))}

        <div className="crm-dual-primary-spacer" />

        <NavLink to="/settings" end onClick={handleNavClick} className="crm-dual-primary-item" title="Settings">
          <Settings />
        </NavLink>

        <button type="button" className="crm-dual-primary-item" onClick={handleLogout} title="Logout">
          <LogOut />
        </button>
      </div>

      <div className="crm-dual-secondary">
        <div className="crm-dual-secondary-title">{expandedSection || "CRM"}</div>

        {expandedSection === "CRM" ? renderMenu(crmMenu) : renderMenu(sections.find((section) => section.label === expandedSection)?.items || [])}
      </div>
    </>
  );

  const sidebarClassName = ["crm-sidebar", `crm-sidebar-${activeMode}`, collapsed ? "collapsed" : "", mobileOpen ? "mobile-open" : ""].filter(Boolean).join(" ");

  if (activeMode === "topnav") {
    return (
      <>
        <style>{sidebarStyles}</style>

        <aside className={sidebarClassName}>{renderTopNavigation()}</aside>
      </>
    );
  }

  if (activeMode === "section") {
    return (
      <>
        <style>{sidebarStyles}</style>

        <aside className={sidebarClassName}>{renderSectionRail()}</aside>
      </>
    );
  }

  const iconOnly = activeMode === "compact" || collapsed;

  if (activeMode === "dual") {
    return (
      <>
        <style>{sidebarStyles}</style>

        <aside className={`${sidebarClassName} crm-sidebar-dual`}>{renderDual()}</aside>
      </>
    );
  }

  if (activeMode === "accordion") {
    return (
      <>
        <style>{sidebarStyles}</style>

        <aside className={`${sidebarClassName} crm-sidebar-accordion`}>
          <button type="button" className="crm-mobile-close" onClick={onMobileClose} aria-label="Close sidebar" title="Close sidebar">
            <X />
          </button>

          {renderAccordion()}
        </aside>
      </>
    );
  }

  return (
    <>
      <style>{sidebarStyles}</style>

      <aside className={sidebarClassName}>
        <button type="button" className="crm-mobile-close" onClick={onMobileClose} aria-label="Close sidebar" title="Close sidebar">
          <X />
        </button>

        {renderSplit(iconOnly)}

        {activeMode !== "compact" && activeMode !== "overlay" && activeMode !== "floating" && (
          <button type="button" className="crm-collapse" onClick={onToggle} aria-label="Toggle sidebar" title={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </button>
        )}
      </aside>
    </>
  );
}

const sidebarStyles = `
.crm-sidebar{width:268px;height:100vh;flex:0 0 268px;background:var(--crm-surface);border-right:1px solid var(--crm-border);display:flex;flex-direction:column;transition:width .25s ease,flex-basis .25s ease,transform .25s ease,box-shadow .25s ease;position:relative;z-index:100;min-height:0;color:var(--crm-text)}
.crm-sidebar.collapsed{width:78px;flex-basis:78px}
.crm-sidebar-compact{width:78px;flex-basis:78px}
.crm-sidebar-rail{width:268px;flex-basis:268px}
.crm-sidebar-rail.collapsed{width:78px;flex-basis:78px}
.crm-sidebar-floating{margin:12px 0 12px 12px;width:268px;flex-basis:268px;height:calc(100vh - 24px);border:1px solid var(--crm-border);border-radius:18px;overflow:hidden;box-shadow:var(--crm-shadow)}
.crm-sidebar-floating.collapsed{width:78px;flex-basis:78px}
.crm-sidebar-overlay{position:fixed;left:0;top:0;width:268px;height:100vh;flex:0 0 268px;box-shadow:var(--crm-shadow);transform:translateX(-100%);z-index:120}
.crm-sidebar-overlay.mobile-open{transform:translateX(0)}
.crm-brand{height:72px;min-height:72px;padding:0 18px;display:flex;align-items:center;gap:12px;border-bottom:1px solid var(--crm-border);overflow:hidden}
.crm-brand-logo{width:38px;height:38px;min-width:38px;border-radius:11px;object-fit:cover;background:var(--crm-primary-soft);border:1px solid var(--crm-border)}
.crm-brand-text{min-width:0;white-space:nowrap}
.crm-brand-title{font-size:15px;font-weight:400;color:var(--crm-text);letter-spacing:-.2px}
.crm-brand-sub{font-size:13px;color:var(--crm-muted);margin-top:2px}
.crm-nav{flex:1;min-height:0;padding:16px 12px 12px;display:flex;flex-direction:column;gap:4px;overflow-y:auto;overflow-x:hidden;scrollbar-width:thin;scrollbar-color:var(--crm-border) transparent}
.crm-nav::-webkit-scrollbar{width:5px}
.crm-nav::-webkit-scrollbar-track{background:transparent}
.crm-nav::-webkit-scrollbar-thumb{background:var(--crm-border);border-radius:99px}
.crm-nav-section{display:flex;flex-direction:column;gap:4px}
.crm-nav-label{font-size:13px;text-transform:uppercase;letter-spacing:.12em;color:var(--crm-muted);font-weight:400;padding:4px 12px 8px;white-space:nowrap}
.crm-nav-link{height:43px;min-height:43px;display:flex;align-items:center;gap:12px;padding:0 12px;border-radius:11px;text-decoration:none;color:var(--crm-muted);font-size:13px;font-weight:400;white-space:nowrap;transition:background .18s,color .18s,transform .18s}
.crm-nav-link:hover{background:var(--crm-surface-2);color:var(--crm-text);transform:translateX(1px)}
.crm-nav-link.active{background:var(--crm-primary-soft);color:var(--crm-primary);font-weight:400}
.crm-nav-icon{width:18px;height:18px;min-width:18px}
.crm-nav-divider{height:1px;min-height:1px;background:var(--crm-border);margin:12px 8px}
.crm-sidebar-bottom{padding:10px 12px 12px;border-top:1px solid var(--crm-border);background:var(--crm-surface)}
.crm-bottom-link{height:43px;display:flex;align-items:center;gap:12px;padding:0 12px;color:var(--crm-muted);text-decoration:none;border-radius:11px;font-size:13px;font-weight:400;white-space:nowrap;transition:.18s}
.crm-bottom-link:hover{background:var(--crm-surface-2);color:var(--crm-text)}
.crm-logout{width:100%;border:0;background:transparent;cursor:pointer}
.crm-logout:hover{color:var(--crm-danger);background:color-mix(in srgb,var(--crm-danger) 8%,transparent)}
.crm-collapse{position:absolute;right:-13px;top:96px;width:26px;height:26px;border-radius:50%;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-muted);display:grid;place-items:center;box-shadow:var(--crm-shadow);z-index:110;padding:0}
.crm-collapse:hover{color:var(--crm-text);border-color:var(--crm-primary)}
.crm-collapse svg{width:14px;height:14px}
.crm-sidebar.collapsed .crm-brand{justify-content:center;padding:0 10px}
.crm-sidebar.collapsed .crm-nav{padding-left:10px;padding-right:10px}
.crm-sidebar.collapsed .crm-nav-link{justify-content:center;padding:0}
.crm-sidebar.collapsed .crm-nav-divider{margin-left:8px;margin-right:8px}
.crm-sidebar.collapsed .crm-sidebar-bottom{padding-left:10px;padding-right:10px}
.crm-sidebar.collapsed .crm-bottom-link{justify-content:center;padding:0}
.crm-sidebar.collapsed .crm-nav-link:hover{transform:none}
.crm-sidebar-compact .crm-brand{justify-content:center;padding:0 10px}
.crm-sidebar-compact .crm-nav{padding-left:10px;padding-right:10px}
.crm-sidebar-compact .crm-nav-link{justify-content:center;padding:0}
.crm-sidebar-compact .crm-nav-divider{margin-left:8px;margin-right:8px}
.crm-sidebar-compact .crm-sidebar-bottom{padding-left:10px;padding-right:10px}
.crm-sidebar-compact .crm-bottom-link{justify-content:center;padding:0}
.crm-sidebar-compact .crm-nav-link:hover{transform:none}
.crm-sidebar-rail.collapsed .crm-brand{justify-content:center;padding:0 10px}
.crm-sidebar-rail.collapsed .crm-nav{padding-left:10px;padding-right:10px}
.crm-sidebar-rail.collapsed .crm-nav-link{justify-content:center;padding:0}
.crm-sidebar-rail.collapsed .crm-nav-divider{margin-left:8px;margin-right:8px}
.crm-sidebar-rail.collapsed .crm-sidebar-bottom{padding-left:10px;padding-right:10px}
.crm-sidebar-rail.collapsed .crm-bottom-link{justify-content:center;padding:0}
.crm-sidebar-rail.collapsed .crm-nav-link:hover{transform:none}
.crm-mobile-close{display:none;position:absolute;left:calc(100% + 10px);right:auto;top:18px;width:38px;height:38px;border:1px solid var(--crm-border);border-radius:10px;background:var(--crm-surface);color:var(--crm-muted);place-items:center;z-index:120;padding:0;box-shadow:var(--crm-shadow)}
.crm-mobile-close:hover{color:var(--crm-text);border-color:var(--crm-primary);background:var(--crm-surface-2)}
.crm-mobile-close svg{width:18px;height:18px}
.crm-sidebar-section{width:78px;flex-basis:78px;overflow:visible;border-right:1px solid var(--crm-border)}
.crm-section-rail-inner{height:100%;width:100%;display:flex;flex-direction:column;align-items:center;overflow:visible}
.crm-section-rail-brand{height:72px;min-height:72px;width:100%;display:grid;place-items:center;border-bottom:1px solid var(--crm-border)}
.crm-section-rail-logo{width:38px;height:38px;border-radius:11px;object-fit:cover;background:var(--crm-primary-soft);border:1px solid var(--crm-border)}
.crm-section-rail-nav{flex:1;min-height:0;width:100%;padding:12px 9px;overflow-y:auto;overflow-x:hidden;display:flex;flex-direction:column;align-items:center;gap:6px;scrollbar-width:thin;scrollbar-color:var(--crm-border) transparent}
.crm-section-rail-nav::-webkit-scrollbar{width:4px}
.crm-section-rail-nav::-webkit-scrollbar-thumb{background:var(--crm-border);border-radius:99px}
.crm-section-rail-item{position:relative;width:100%;display:flex;justify-content:center}
.crm-section-rail-button{position:relative;width:46px;height:46px;min-width:46px;border:0;border-radius:12px;background:transparent;color:var(--crm-muted);display:grid;place-items:center;text-decoration:none;cursor:pointer;padding:0;transition:background .18s,color .18s}
.crm-section-rail-button:hover,.crm-section-rail-button.active{background:var(--crm-primary-soft);color:var(--crm-primary)}
.crm-section-rail-button svg{width:20px;height:20px}
.crm-section-rail-tooltip{position:absolute;left:54px;top:50%;transform:translateY(-50%);padding:7px 9px;border-radius:8px;background:var(--crm-text);color:var(--crm-surface);font-size:12px;font-weight:400;white-space:nowrap;opacity:0;pointer-events:none;transition:opacity .15s,transform .15s;z-index:150}
.crm-section-rail-button:hover .crm-section-rail-tooltip{opacity:1;transform:translate(2px,-50%)}
.crm-section-hover-panel{position:fixed;min-width:240px;max-width:310px;max-height:calc(100vh - 28px);overflow-y:auto;overflow-x:hidden;padding:10px;background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:13px;box-shadow:var(--crm-shadow);opacity:1;visibility:visible;transform:translateX(0);pointer-events:auto;z-index:99999}
.crm-section-hover-title{display:flex;align-items:center;gap:8px;padding:7px 10px 10px;color:var(--crm-text);font-size:13px;font-weight:500;border-bottom:1px solid var(--crm-border);margin-bottom:5px}
.crm-section-hover-title svg{width:17px;height:17px;color:var(--crm-primary)}
.crm-section-hover-menu{display:flex;flex-direction:column;gap:2px}
.crm-section-hover-menu .crm-nav-link{height:40px;min-height:40px}
.crm-section-rail-bottom{width:100%;padding:10px 9px 12px;border-top:1px solid var(--crm-border);display:flex;flex-direction:column;align-items:center;gap:5px}
.crm-section-rail-logout:hover{color:var(--crm-danger);background:color-mix(in srgb,var(--crm-danger) 8%,transparent)}
.crm-sidebar-topnav{position:fixed;left:0;right:0;top:0;width:100%;height:72px;min-height:72px;flex:0 0 72px;border-right:0;border-bottom:1px solid var(--crm-border);z-index:1000;box-shadow:var(--crm-shadow);overflow:visible}
.crm-topnav-inner{width:100%;height:72px;display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;padding:0 18px;gap:14px}
.crm-topnav-brand{display:flex;align-items:center;gap:10px;min-width:0}
.crm-topnav-menu{height:100%;display:flex;align-items:center;gap:2px;min-width:0;overflow:visible;scrollbar-width:none}
.crm-topnav-menu::-webkit-scrollbar{display:none}
.crm-topnav-menu>.crm-nav-link{height:42px;flex:0 0 auto}
.crm-topnav-section{height:100%;display:flex;align-items:center;position:relative;flex:0 0 auto}
.crm-topnav-section-button{height:42px;padding:0 9px;border:0;background:transparent;border-radius:10px;color:var(--crm-muted);display:flex;align-items:center;gap:6px;font-size:13px;font-weight:400;white-space:nowrap;cursor:pointer}
.crm-topnav-section-button:hover{background:var(--crm-surface-2);color:var(--crm-text)}
.crm-topnav-section-button svg{width:17px;height:17px}
.crm-topnav-section-button svg:last-child{width:13px;height:13px;opacity:.65}
.crm-topnav-dropdown{position:absolute;top:64px;left:0;min-width:235px;max-height:calc(100vh - 86px);overflow:auto;padding:8px;background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:12px;box-shadow:var(--crm-shadow);opacity:0;visibility:hidden;transform:translateY(-5px);pointer-events:none;transition:opacity .16s,transform .16s,visibility .16s;z-index:9999}
.crm-topnav-section:hover .crm-topnav-dropdown{opacity:1;visibility:visible;transform:translateY(0);pointer-events:auto}
.crm-topnav-dropdown-title{padding:7px 10px 9px;font-size:13px;font-weight:500;color:var(--crm-text);border-bottom:1px solid var(--crm-border);margin-bottom:5px}
.crm-topnav-dropdown .crm-nav-link{height:40px;min-height:40px}
.crm-topnav-actions{height:100%;display:flex;align-items:center;justify-content:flex-end;gap:3px;min-width:max-content;flex:0 0 auto;margin-left:0;padding-left:10px;border-left:1px solid var(--crm-border);background:var(--crm-surface)}
.crm-topnav-action{width:40px;height:40px;border:1px solid transparent;border-radius:10px;background:transparent;color:var(--crm-muted);display:grid;place-items:center;text-decoration:none;cursor:pointer;position:relative;flex:0 0 40px}
.crm-topnav-action:hover{background:var(--crm-surface-2);border-color:var(--crm-border);color:var(--crm-text)}
.crm-topnav-action svg{width:18px;height:18px}
.crm-topnav-notification-dot{position:absolute;right:7px;top:6px;width:6px;height:6px;border-radius:50%;background:var(--crm-danger);box-shadow:0 0 0 2px var(--crm-surface)}
.crm-topnav-profile{overflow:hidden;padding:0}
.crm-topnav-profile img,.crm-topnav-profile span{width:32px;height:32px;border-radius:9px;display:grid;place-items:center}
.crm-topnav-profile img{object-fit:cover}
.crm-topnav-profile span{background:var(--crm-primary);color:#fff;font-size:12px;font-weight:400}
.crm-accordion-nav{gap:5px}
.crm-accordion-section{display:flex;flex-direction:column}
.crm-accordion-header{height:43px;border:0;background:transparent;color:var(--crm-muted);border-radius:11px;display:flex;align-items:center;justify-content:space-between;padding:0 12px;font:inherit;cursor:pointer}
.crm-accordion-header:hover{background:var(--crm-surface-2);color:var(--crm-text)}
.crm-accordion-header>span{display:flex;align-items:center;gap:12px}
.crm-accordion-header svg{width:18px;height:18px;transition:transform .18s}
.crm-accordion-header>svg{width:15px;height:15px}
.crm-accordion-header>svg.open{transform:rotate(180deg)}
.crm-accordion-items{padding-left:9px;display:flex;flex-direction:column;gap:2px}
.crm-dual-primary{width:78px;min-width:78px;height:100%;display:flex;flex-direction:column;align-items:center;border-right:1px solid var(--crm-border);background:var(--crm-surface)}
.crm-dual-brand{width:100%;justify-content:center;padding:0 10px}
.crm-dual-primary-item{width:46px;height:46px;margin:3px 0;border:0;border-radius:12px;background:transparent;color:var(--crm-muted);display:grid;place-items:center;text-decoration:none;cursor:pointer}
.crm-dual-primary-item:hover,.crm-dual-primary-item.active{background:var(--crm-primary-soft);color:var(--crm-primary)}
.crm-dual-primary-item svg{width:20px;height:20px}
.crm-dual-primary-spacer{flex:1}
.crm-sidebar-dual{width:310px;flex-basis:310px;flex-direction:row}
.crm-dual-secondary{flex:1;min-width:0;padding:16px 12px;overflow:auto}
.crm-dual-secondary-title{font-size:14px;color:var(--crm-text);padding:6px 10px 12px;border-bottom:1px solid var(--crm-border);margin-bottom:6px}
.crm-sidebar-accordion{width:268px;flex-basis:268px}
@media(max-width:1200px){.crm-topnav-section-button{padding-left:6px;padding-right:6px;gap:4px}.crm-topnav-inner{gap:8px;padding:0 10px}.crm-topnav-brand .crm-brand-text{display:none}.crm-topnav-action{width:38px;height:38px;flex-basis:38px}}
@media(max-width:900px){.crm-sidebar:not(.crm-sidebar-topnav){position:fixed;left:0;top:0;height:100vh;box-shadow:var(--crm-shadow);transform:translateX(-100%);transition:transform .25s ease;z-index:1000}.crm-sidebar:not(.crm-sidebar-topnav).mobile-open{transform:translateX(0)}.crm-collapse{display:none}.crm-mobile-close{display:none}.crm-sidebar.mobile-open .crm-mobile-close{display:grid}.crm-sidebar-floating{margin:0;height:100vh;border-radius:0;border:0}.crm-section-hover-panel{max-width:calc(100vw - 92px);min-width:220px}.crm-topnav-inner{padding:0 7px;gap:4px}.crm-topnav-brand{min-width:42px}.crm-topnav-brand .crm-brand-text{display:none}.crm-topnav-menu{gap:0}.crm-topnav-menu>.crm-nav-link span,.crm-topnav-section-button span,.crm-topnav-section-button svg:last-child{display:none}.crm-topnav-menu>.crm-nav-link,.crm-topnav-section-button{width:40px;justify-content:center;padding:0}.crm-topnav-actions{gap:1px;padding-left:4px}.crm-topnav-action{width:36px;height:36px;flex-basis:36px}.crm-topnav-profile img,.crm-topnav-profile span{width:29px;height:29px}}
`;

export default Sidebar;
