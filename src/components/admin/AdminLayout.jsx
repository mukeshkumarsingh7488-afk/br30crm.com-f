import { useCallback, useEffect, useState } from "react";
import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";

const ADMIN_THEME_KEY = "admin-theme";

function getInitialTheme() {
  try {
    const savedTheme = localStorage.getItem(ADMIN_THEME_KEY);

    if (savedTheme === "light" || savedTheme === "dark" || savedTheme === "device") {
      return savedTheme;
    }
  } catch (error) {
    console.warn("Unable to read admin theme preference:", error);
  }

  return "device";
}

function getDeviceTheme() {
  if (typeof window === "undefined" || !window.matchMedia) {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function resolveTheme(theme) {
  return theme === "light" || theme === "dark" ? theme : getDeviceTheme();
}

function AdminLayout({ children }) {
  const [theme, setThemeState] = useState(getInitialTheme);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const setTheme = useCallback((nextTheme) => {
    const validTheme = ["light", "dark", "device"].includes(nextTheme) ? nextTheme : "device";

    setThemeState(validTheme);

    try {
      localStorage.setItem(ADMIN_THEME_KEY, validTheme);
    } catch (error) {
      console.warn("Unable to save admin theme preference:", error);
    }
  }, []);

  const toggleSidebarCollapse = useCallback(() => {
    setSidebarCollapsed((current) => !current);
  }, []);

  const openMobileSidebar = useCallback(() => {
    setSidebarOpen(true);
  }, []);

  const closeMobileSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const resolvedTheme = resolveTheme(theme);

    root.setAttribute("data-admin-theme", resolvedTheme);
    root.setAttribute("data-admin-theme-mode", theme);

    root.style.setProperty("--admin-primary", "#2563eb");
    root.style.setProperty("--admin-primary-hover", "#1d4ed8");
    root.style.setProperty("--admin-primary-soft", resolvedTheme === "dark" ? "#172554" : "#eff6ff");

    root.style.setProperty("--admin-bg", resolvedTheme === "dark" ? "#080d18" : "#f5f7fb");

    root.style.setProperty("--admin-surface", resolvedTheme === "dark" ? "#0f172a" : "#ffffff");

    root.style.setProperty("--admin-surface-2", resolvedTheme === "dark" ? "#172033" : "#f8fafc");

    root.style.setProperty("--admin-surface-3", resolvedTheme === "dark" ? "#1e293b" : "#f1f5f9");

    root.style.setProperty("--admin-border", resolvedTheme === "dark" ? "#263449" : "#e2e8f0");

    root.style.setProperty("--admin-border-strong", resolvedTheme === "dark" ? "#34445c" : "#cbd5e1");

    root.style.setProperty("--admin-text", resolvedTheme === "dark" ? "#f8fafc" : "#0f172a");

    root.style.setProperty("--admin-text-secondary", resolvedTheme === "dark" ? "#cbd5e1" : "#334155");

    root.style.setProperty("--admin-muted", resolvedTheme === "dark" ? "#94a3b8" : "#64748b");

    root.style.setProperty("--admin-placeholder", resolvedTheme === "dark" ? "#64748b" : "#94a3b8");

    root.style.setProperty("--admin-danger", "#dc2626");
    root.style.setProperty("--admin-danger-hover", "#b91c1c");

    root.style.setProperty("--admin-danger-bg", resolvedTheme === "dark" ? "#35151a" : "#fee2e2");

    root.style.setProperty("--admin-success", "#16a34a");

    root.style.setProperty("--admin-success-bg", resolvedTheme === "dark" ? "#102d1c" : "#dcfce7");

    root.style.setProperty("--admin-warning", "#d97706");

    root.style.setProperty("--admin-warning-bg", resolvedTheme === "dark" ? "#35250f" : "#fef3c7");

    root.style.setProperty("--admin-info", "#0284c7");

    root.style.setProperty("--admin-info-bg", resolvedTheme === "dark" ? "#08263a" : "#e0f2fe");

    root.style.setProperty("--admin-shadow-sm", resolvedTheme === "dark" ? "0 2px 8px rgba(0,0,0,.28)" : "0 2px 8px rgba(15,23,42,.05)");

    root.style.setProperty("--admin-shadow-md", resolvedTheme === "dark" ? "0 8px 28px rgba(0,0,0,.32)" : "0 8px 28px rgba(15,23,42,.07)");

    root.style.setProperty("--admin-sidebar-width", sidebarCollapsed ? "76px" : "260px");
  }, [theme, sidebarCollapsed]);

  useEffect(() => {
    if (theme !== "device" || !window.matchMedia) {
      return undefined;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleDeviceThemeChange = () => {
      document.documentElement.setAttribute("data-admin-theme", getDeviceTheme());
    };

    mediaQuery.addEventListener?.("change", handleDeviceThemeChange);

    return () => {
      mediaQuery.removeEventListener?.("change", handleDeviceThemeChange);
    };
  }, [theme]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (!sidebarOpen || window.innerWidth > 900) {
      document.body.style.overflow = "";
      return undefined;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [sidebarOpen]);

  return (
    <div className={`admin-shell ${sidebarCollapsed ? "admin-sidebar-collapsed" : ""} ${sidebarOpen ? "admin-mobile-sidebar-open" : ""}`}>
      <AdminSidebar open={sidebarOpen} collapsed={sidebarCollapsed} onClose={closeMobileSidebar} onToggle={toggleSidebarCollapse} />

      {sidebarOpen && <button type="button" className="admin-mobile-overlay" onClick={closeMobileSidebar} aria-label="Close admin menu" />}

      <div className="admin-main">
        <AdminNavbar theme={theme} setTheme={setTheme} onMenuClick={openMobileSidebar} />

        <main className="admin-content">{children}</main>
      </div>

      <style>{`.admin-shell{--admin-current-sidebar-width:260px;width:100%;height:100dvh;min-height:100dvh;display:flex;overflow:hidden;background:var(--admin-bg);color:var(--admin-text)}.admin-shell.admin-sidebar-collapsed{--admin-current-sidebar-width:76px}.admin-main{width:calc(100% - var(--admin-current-sidebar-width));min-width:0;height:100dvh;min-height:0;margin-left:var(--admin-current-sidebar-width);display:flex;flex-direction:column;overflow:hidden;transition:width .22s ease,margin-left .22s ease}.admin-content{flex:1 1 auto;width:100%;min-width:0;min-height:0;overflow-y:auto;overflow-x:hidden;overscroll-behavior:contain;background:var(--admin-bg);color:var(--admin-text);-webkit-overflow-scrolling:touch}.admin-mobile-overlay{display:none}@media(max-width:900px){.admin-shell,.admin-shell.admin-sidebar-collapsed{--admin-current-sidebar-width:0px;display:block;width:100%;height:100dvh;min-height:100dvh;overflow:hidden}.admin-main{width:100%;height:100dvh;min-height:0;margin-left:0;overflow:hidden}.admin-content{width:100%;height:auto;min-height:0;overflow-y:auto;overflow-x:hidden}.admin-mobile-overlay{display:block;position:fixed;inset:0;width:100%;height:100%;padding:0;border:0;background:rgba(2,6,23,.52);backdrop-filter:blur(2px);-webkit-backdrop-filter:blur(2px);cursor:pointer;z-index:1090}}@media(prefers-reduced-motion:reduce){.admin-main{transition:none!important}}`}</style>
    </div>
  );
}

export default AdminLayout;
