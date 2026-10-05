import { LogOut, Menu, Monitor, Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { showAuthAlert } from "../auth/authAlert";

function AdminNavbar({ theme, setTheme, onMenuClick }) {
  const navigate = useNavigate();

  const handleThemeToggle = () => {
    const nextTheme = theme === "light" ? "dark" : theme === "dark" ? "device" : "light";

    setTheme(nextTheme);
  };

  const handleLogout = async () => {
    const result = await showAuthAlert({
      icon: "warning",
      title: "Logout from Admin Panel?",
      text: "You will be signed out from your current session.",
      showCancelButton: true,
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      focusCancel: true,
      allowOutsideClick: false,
      allowEscapeKey: true,
    });

    if (!result?.isConfirmed) return;

    try {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      await showAuthAlert({
        icon: "success",
        title: "Logged out",
        text: "You have been successfully logged out.",
        timer: 1200,
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
      });

      navigate("/", { replace: true });
    } catch (error) {
      console.error("Admin logout error:", error);

      await showAuthAlert({
        icon: "error",
        title: "Logout failed",
        text: "Unable to complete logout. Please try again.",
        confirmButtonText: "OK",
      });
    }
  };

  const ThemeIcon = theme === "light" ? Sun : theme === "dark" ? Moon : Monitor;

  const themeLabel = theme === "light" ? "Light" : theme === "dark" ? "Dark" : "Device";

  return (
    <>
      <header className="admin-navbar">
        <div className="admin-navbar-left">
          <button type="button" className="admin-mobile-menu-btn" onClick={onMenuClick} aria-label="Open admin menu" title="Open menu">
            <Menu size={20} />
          </button>
        </div>

        <div className="admin-navbar-actions">
          <button type="button" className="admin-theme-btn" onClick={handleThemeToggle} title={`Theme: ${themeLabel}. Click to change.`} aria-label={`Theme: ${themeLabel}. Click to change.`}>
            <ThemeIcon size={18} />
          </button>

          <button type="button" className="admin-crm-btn" onClick={() => navigate("/dashboard")} title="Open CRM Dashboard" aria-label="Open CRM Dashboard">
            CRM
          </button>

          <button type="button" className="admin-logout-btn" onClick={handleLogout} title="Logout" aria-label="Logout">
            <LogOut size={17} />
          </button>
        </div>
      </header>

      <style>{`
        .admin-navbar{width:100%;height:70px;min-height:70px;flex:0 0 70px;box-sizing:border-box;padding:0 22px;border-bottom:1px solid var(--admin-border);background:var(--admin-surface);color:var(--admin-text);display:flex;align-items:center;justify-content:space-between;gap:20px;position:relative;z-index:100;box-shadow:0 1px 3px rgba(15,23,42,.05);}
        .admin-navbar-left{min-width:0;flex:1;display:flex;align-items:center;}
        .admin-navbar-actions{display:flex;align-items:center;gap:8px;flex-shrink:0;}
        .admin-mobile-menu-btn{display:none;width:39px;height:39px;padding:0;border:1px solid var(--admin-border);border-radius:10px;background:var(--admin-surface);color:var(--admin-text);align-items:center;justify-content:center;cursor:pointer;transition:all .18s ease;}
        .admin-mobile-menu-btn:hover{background:var(--admin-surface-2);border-color:var(--admin-primary);color:var(--admin-primary);}
        .admin-theme-btn,.admin-crm-btn,.admin-logout-btn{height:39px;border-radius:10px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .18s ease;box-sizing:border-box;}
        .admin-theme-btn{width:39px;padding:0;border:1px solid var(--admin-border);background:var(--admin-surface);color:var(--admin-text);}
        .admin-theme-btn svg{color:var(--admin-primary);}
        .admin-theme-btn:hover{background:var(--admin-surface-2);border-color:var(--admin-primary);transform:translateY(-1px);}
        .admin-crm-btn{min-width:58px;padding:0 13px;border:1px solid var(--admin-primary);background:var(--admin-primary);color:#fff;font-size:13px;font-weight:400;}
        .admin-crm-btn:hover{filter:brightness(.94);transform:translateY(-1px);box-shadow:0 5px 14px rgba(37,99,235,.2);}
        .admin-logout-btn{width:39px;padding:0;border:1px solid var(--admin-border);background:var(--admin-surface);color:var(--admin-muted);}
        .admin-logout-btn:hover{background:var(--admin-danger-bg);border-color:var(--admin-danger);color:var(--admin-danger);transform:translateY(-1px);}
        @media(max-width:900px){
          .admin-navbar{height:64px;min-height:64px;flex-basis:64px;padding:0 15px;}
          .admin-mobile-menu-btn{display:flex;width:38px;height:38px;}
          .admin-navbar-actions{gap:6px;}
          .admin-theme-btn,.admin-crm-btn,.admin-logout-btn{height:38px;}
          .admin-theme-btn{width:38px;}
          .admin-crm-btn{min-width:52px;padding:0 11px;}
          .admin-logout-btn{width:38px;}
        }
        @media(max-width:520px){
          .admin-navbar{height:60px;min-height:60px;flex-basis:60px;padding:0 11px;}
          .admin-mobile-menu-btn,.admin-theme-btn,.admin-crm-btn,.admin-logout-btn{width:36px;min-width:36px;height:36px;padding:0;}
          .admin-crm-btn{font-size:13px;}
          .admin-navbar-actions{gap:5px;}
        }
        @media(prefers-reduced-motion:reduce){
          .admin-mobile-menu-btn,.admin-theme-btn,.admin-crm-btn,.admin-logout-btn{transition:none!important;}
        }
      `}</style>
    </>
  );
}

export default AdminNavbar;
