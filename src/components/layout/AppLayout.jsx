import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function AppLayout() {
  const [theme, setTheme] = useState(localStorage.getItem("crm-theme") || "light");
  const [sidebarMode, setSidebarMode] = useState(() => {
    const saved = localStorage.getItem("crm-sidebar-mode");
    if (!saved || saved === "topnav") {
      localStorage.setItem("crm-sidebar-mode", "rail");
      return "rail";
    }
    return saved;
  });

  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const savedMode = localStorage.getItem("crm-sidebar-mode");
    const saved = localStorage.getItem("crm-sidebar-collapsed");
    if (savedMode === "rail") return true;
    return saved !== null ? saved === "true" : false;
  });

  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const activeTheme = theme === "system" ? (systemDark ? "dark" : "light") : theme;

    root.setAttribute("data-theme", activeTheme);
    root.style.colorScheme = activeTheme;
    localStorage.setItem("crm-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("crm-sidebar-collapsed", String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  useEffect(() => {
    if (sidebarMode === "rail") {
      setSidebarCollapsed(true);
    }
  }, [sidebarMode]);

  useEffect(() => {
    const handleThemeChange = (event) => {
      const nextTheme = event.detail || localStorage.getItem("crm-theme") || "system";
      setTheme(nextTheme);
    };

    const handleSidebarModeChange = (event) => {
      const nextMode = event.detail || localStorage.getItem("crm-sidebar-mode") || "rail";

      setSidebarMode(nextMode);

      if (nextMode === "rail") {
        setSidebarCollapsed(true);
      } else {
        setSidebarCollapsed(false);
      }

      setMobileOpen(false);
    };

    window.addEventListener("crm-theme-change", handleThemeChange);
    window.addEventListener("crm-sidebar-mode-change", handleSidebarModeChange);

    return () => {
      window.removeEventListener("crm-theme-change", handleThemeChange);
      window.removeEventListener("crm-sidebar-mode-change", handleSidebarModeChange);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;

    root.style.setProperty("--crm-font", "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif");

    document.body.style.margin = "0";
    document.body.style.fontFamily = "var(--crm-font)";
    document.body.style.background = "var(--crm-bg)";
    document.body.style.color = "var(--crm-text)";
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const isTopNav = sidebarMode === "topnav";

  return (
    <>
      <style>{`
        :root{--crm-bg:#f5f7fb;--crm-surface:#ffffff;--crm-surface-2:#f8fafc;--crm-border:#e5e7eb;--crm-text:#111827;--crm-muted:#667085;--crm-primary:#4f46e5;--crm-primary-soft:#eef2ff;--crm-success:#16a34a;--crm-warning:#d97706;--crm-danger:#dc2626;--crm-shadow:0 8px 30px rgba(15,23,42,.06);--crm-sidebar:268px;--crm-topbar:72px}
        [data-theme="dark"]{--crm-bg:#0b1020;--crm-surface:#111827;--crm-surface-2:#172033;--crm-border:#263247;--crm-text:#f8fafc;--crm-muted:#94a3b8;--crm-primary:#818cf8;--crm-primary-soft:#1e1b4b;--crm-success:#4ade80;--crm-warning:#fbbf24;--crm-danger:#f87171;--crm-shadow:0 10px 35px rgba(0,0,0,.28)}
        *{box-sizing:border-box}
        html,body,#root{min-height:100%;width:100%}
        button,input{font:inherit}
        button{cursor:pointer}
        .crm-shell{height:100vh;width:100%;display:flex;background:var(--crm-bg);color:var(--crm-text);overflow:hidden}
        .crm-workspace{min-width:0;flex:1;height:100vh;display:flex;flex-direction:column}
        .crm-main{flex:1;min-height:0;overflow:auto}
        .crm-topnav-shell{display:block}
        .crm-topnav-shell .crm-workspace{width:100%;height:100vh;display:block}
        .crm-topnav-shell .crm-main{width:100%;height:100vh;min-height:0;overflow:auto;padding-top:72px}
        .crm-main::-webkit-scrollbar{width:8px}
        .crm-main::-webkit-scrollbar-thumb{background:var(--crm-border);border-radius:99px}
        .crm-mobile-overlay{display:none}
        @media(max-width:900px){.crm-mobile-overlay{display:block;position:fixed;inset:0;background:rgba(15,23,42,.35);z-index:90}}
        @media(max-width:900px){.crm-shell{display:block}.crm-workspace{height:100vh}.crm-topnav-shell .crm-workspace{height:100vh}.crm-topnav-shell .crm-main{height:100vh;padding-top:72px}}
      `}</style>

      <div className={`crm-shell ${isTopNav ? "crm-topnav-shell" : ""}`}>
        <Sidebar sidebarMode={sidebarMode} collapsed={sidebarCollapsed} mobileOpen={mobileOpen} onToggle={() => setSidebarCollapsed((value) => !value)} onMobileClose={() => setMobileOpen(false)} />

        {!isTopNav && mobileOpen && <div className="crm-mobile-overlay" onClick={() => setMobileOpen(false)} />}

        <section className="crm-workspace">
          {!isTopNav && <Topbar theme={theme} setTheme={setTheme} onMenu={() => setMobileOpen((value) => !value)} />}

          <main className="crm-main">
            <Outlet />
          </main>
        </section>
      </div>
    </>
  );
}

export default AppLayout;
