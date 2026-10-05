import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Menu, Monitor, Moon, ShieldCheck, Sun } from "lucide-react";
import useBusiness from "../../hooks/useBusiness";
import { getUnreadNotificationCount } from "../../api/notification.api";

function Topbar({ theme, setTheme, onMenu }) {
  const navigate = useNavigate();
  const { businessId } = useBusiness();
  const [unreadCount, setUnreadCount] = useState(0);

  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  })();

  const user = storedUser?.user || storedUser;

  const userName = user?.name || "User";

  const isMasterAdmin = user?.isMasterAdmin === true;

  const initials =
    userName
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "U";

  useEffect(() => {
    if (!businessId) return;

    let mounted = true;

    const loadUnread = async () => {
      try {
        const r = await getUnreadNotificationCount(businessId);

        if (mounted) {
          setUnreadCount(Number(r?.count ?? r?.data?.count ?? 0));
        }
      } catch {
        if (mounted) {
          setUnreadCount(0);
        }
      }
    };

    loadUnread();

    const timer = window.setInterval(loadUnread, 30000);

    return () => {
      mounted = false;
      window.clearInterval(timer);
    };
  }, [businessId]);

  const cycleTheme = () => {
    const next = theme === "light" ? "dark" : theme === "dark" ? "system" : "light";

    setTheme(next);
  };

  const ThemeIcon = theme === "light" ? Sun : theme === "dark" ? Moon : Monitor;

  return (
    <>
      <style>{`
        .crm-topbar{height:72px;min-height:72px;background:var(--crm-surface);border-bottom:1px solid var(--crm-border);display:flex;align-items:center;justify-content:space-between;padding:0 26px;position:sticky;top:0;z-index:50;backdrop-filter:blur(16px)}
        .crm-top-left{display:flex;align-items:center;gap:14px;min-width:0}
        .crm-mobile-menu{display:none;width:38px;height:38px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:10px;place-items:center}
        .crm-mobile-menu:hover{background:var(--crm-surface-2)}
        .crm-top-right{display:flex;align-items:center;gap:7px;flex-shrink:0}
        .crm-icon-btn{width:40px;height:40px;border:1px solid transparent;background:transparent;border-radius:10px;color:var(--crm-muted);display:grid;place-items:center;position:relative}
        .crm-icon-btn:hover{background:var(--crm-surface-2);border-color:var(--crm-border);color:var(--crm-text)}
        .crm-admin-dashboard-btn{color:var(--crm-primary)}
        .crm-admin-dashboard-btn:hover{color:var(--crm-primary)}
        .crm-notification-dot{position:absolute;right:5px;top:4px;min-width:16px;height:16px;padding:0 4px;border-radius:50%;background:var(--crm-danger);box-shadow:0 0 0 2px var(--crm-surface);font-size:9px;line-height:16px;text-align:center;color:#fff}
        .crm-profile{width:40px;height:40px;padding:0;border:1px solid var(--crm-border);background:var(--crm-surface);border-radius:11px;display:grid;place-items:center;margin-left:2px}
        .crm-profile:hover{border-color:var(--crm-primary);background:var(--crm-surface-2)}
        .crm-avatar{width:32px;height:32px;border-radius:9px;display:grid;place-items:center;background:var(--crm-primary);color:#fff;font-size:13px;font-weight:400;letter-spacing:.2px}
        .crm-avatar-image{object-fit:cover;display:block}
        @media(max-width:900px){.crm-topbar{padding:0 16px}.crm-mobile-menu{display:grid}}
        @media(max-width:520px){.crm-topbar{padding:0 12px}.crm-top-right{gap:3px}.crm-icon-btn{width:38px;height:38px}.crm-profile{width:38px;height:38px}}
      `}</style>

      <header className="crm-topbar">
        <div className="crm-top-left">
          <button className="crm-mobile-menu" onClick={onMenu} aria-label="Open menu">
            <Menu size={19} />
          </button>
        </div>

        <div className="crm-top-right">
          <button type="button" className="crm-icon-btn" onClick={cycleTheme} title={`Theme: ${theme}`} aria-label={`Theme: ${theme}`}>
            <ThemeIcon size={18} />
          </button>

          {isMasterAdmin && (
            <button type="button" className="crm-icon-btn crm-admin-dashboard-btn" onClick={() => navigate("/admin")} title="Admin Dashboard" aria-label="Admin Dashboard">
              <ShieldCheck size={18} />
            </button>
          )}

          <button type="button" className="crm-icon-btn" onClick={() => navigate("/notifications")} title="Notifications" aria-label="Notifications">
            <Bell size={18} />
            {unreadCount > 0 && <span className="crm-notification-dot">{unreadCount > 99 ? "99+" : unreadCount}</span>}
          </button>

          <button type="button" className="crm-profile" title="Profile" aria-label="Profile" onClick={() => navigate("/profile")}>
            {user?.profileImage ? <img src={user.profileImage} alt={userName} className="crm-avatar crm-avatar-image" /> : <span className="crm-avatar">{initials}</span>}
          </button>
        </div>
      </header>
    </>
  );
}

export default Topbar;
