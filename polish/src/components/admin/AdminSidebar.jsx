import { LayoutDashboard, Megaphone, Sparkles, Settings, Users, X, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

function AdminSidebar({ open, onClose, collapsed = false, onToggle }) {
  const navigate = useNavigate();

  const menu = [
    {
      label: "Overview",
      icon: LayoutDashboard,
      path: "/admin",
    },
    {
      label: "What's New",
      icon: Sparkles,
      path: "/admin/whats-new",
    },
    {
      label: "Announcements",
      icon: Megaphone,
      path: "/admin/announcements",
    },
    {
      label: "Users",
      icon: Users,
      path: "/admin/users",
    },
    {
      label: "Settings",
      icon: Settings,
      path: "/admin/settings",
      disabled: true,
    },
  ];

  return (
    <aside className={`admin-sidebar ${open ? "is-open" : ""} ${collapsed ? "is-collapsed" : ""}`}>
      <div className="admin-sidebar-header">
        <div className="admin-sidebar-heading">
          <img src="/favicon-32x32.png" alt="Admin Panel" className="admin-sidebar-logo" />
          <span>ADMIN PANEL</span>
        </div>

        <button type="button" className="admin-sidebar-close" onClick={onClose} aria-label="Close Admin Menu" title="Close">
          <X size={20} />
        </button>
      </div>

      <div className="admin-sidebar-scroll">
        <div className="admin-sidebar-section-label">
          <span>ADMINISTRATION</span>
        </div>

        <nav className="admin-sidebar-nav">
          {menu.map((item) => {
            const Icon = item.icon;

            if (item.disabled) {
              return (
                <button type="button" className="admin-sidebar-item disabled" key={item.label} disabled title={`${item.label} - Coming soon`}>
                  <Icon size={18} className="admin-sidebar-item-icon" />

                  <span className="admin-sidebar-item-text">{item.label}</span>

                  <small>Soon</small>
                </button>
              );
            }

            return (
              <NavLink key={item.label} to={item.path} end={item.path === "/admin"} className={({ isActive }) => `admin-sidebar-item ${isActive ? "active" : ""}`} onClick={onClose} title={collapsed ? item.label : undefined}>
                <Icon size={18} className="admin-sidebar-item-icon" />

                <span className="admin-sidebar-item-text">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="admin-sidebar-footer">
        <button
          type="button"
          className="admin-sidebar-crm-link"
          onClick={() => {
            navigate("/dashboard");
            onClose?.();
          }}
          title={collapsed ? "Open CRM Dashboard" : undefined}>
          <ExternalLink size={17} />

          <span>Open CRM Dashboard</span>
        </button>

        <button type="button" className="admin-sidebar-collapse" onClick={onToggle} title={collapsed ? "Expand sidebar" : "Collapse sidebar"} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
          {collapsed ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}

          <span>{collapsed ? "Expand" : "Collapse"}</span>
        </button>
      </div>

      <style>{`
        .admin-sidebar{
          position:fixed;
          left:0;
          top:0;
          bottom:0;
          width:260px;
          min-width:260px;
          height:100dvh;
          box-sizing:border-box;
          display:flex;
          flex-direction:column;
          overflow:hidden;
          background:var(--admin-surface);
          border-right:1px solid var(--admin-border);
          color:var(--admin-text);
          z-index:1100;
          transition:
            width .22s ease,
            transform .22s ease,
            background .2s ease,
            border-color .2s ease;
        }

        .admin-sidebar.is-collapsed{
          width:76px;
          min-width:76px;
        }

        .admin-sidebar-header{
          height:70px;
          min-height:70px;
          padding:0 15px;
          box-sizing:border-box;
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:10px;
          border-bottom:1px solid var(--admin-border);
        }

   .admin-sidebar-heading{min-width:0;display:flex;align-items:center;gap:10px}
.admin-sidebar-logo{width:37px;height:37px;min-width:37px;border-radius:10px;object-fit:cover;display:block}
.admin-sidebar-heading span{font-size:13px;font-weight:400;letter-spacing:.09em;color:var(--admin-text);white-space:nowrap}

        .admin-sidebar-close{
          display:none;
          width:36px;
          height:36px;
          min-width:36px;
          padding:0;
          border:1px solid var(--admin-border);
          border-radius:9px;
          background:var(--admin-surface);
          color:var(--admin-text);
          align-items:center;
          justify-content:center;
          cursor:pointer;
          box-sizing:border-box;
        }

        .admin-sidebar-close:hover{
          background:var(--admin-surface-2);
          border-color:var(--admin-primary);
          color:var(--admin-primary);
        }

        .admin-sidebar-scroll{
          flex:1 1 auto;
          min-height:0;
          overflow-y:auto;
          overflow-x:hidden;
          padding-bottom:12px;
          scrollbar-width:thin;
          scrollbar-color:var(--admin-border) transparent;
          -webkit-overflow-scrolling:touch;
        }

        .admin-sidebar-scroll::-webkit-scrollbar{
          width:6px;
        }

        .admin-sidebar-scroll::-webkit-scrollbar-track{
          background:transparent;
        }

        .admin-sidebar-scroll::-webkit-scrollbar-thumb{
          background:var(--admin-border);
          border-radius:10px;
        }

        .admin-sidebar-section-label{
          height:48px;
          padding:0 17px 9px;
          box-sizing:border-box;
          display:flex;
          align-items:flex-end;
        }

        .admin-sidebar-section-label span{
          font-size:13px;
          font-weight:400;
          letter-spacing:.09em;
          color:var(--admin-muted);
          white-space:nowrap;
        }

        .admin-sidebar-nav{
          padding:0 10px;
          display:flex;
          flex-direction:column;
          gap:4px;
        }

        .admin-sidebar-item{
          width:100%;
          min-height:44px;
          border:0;
          border-radius:10px;
          background:transparent;
          color:var(--admin-muted);
          display:flex;
          align-items:center;
          gap:11px;
          padding:0 12px;
          box-sizing:border-box;
          text-decoration:none;
          font-size:13px;
          text-align:left;
          cursor:pointer;
          transition:
            background .16s ease,
            color .16s ease;
        }

        .admin-sidebar-item:hover{
          background:var(--admin-surface-2);
          color:var(--admin-text);
        }

        .admin-sidebar-item.active{
          background:var(--admin-primary);
          color:#fff;
          box-shadow:
            0 5px 14px
            color-mix(
              in srgb,
              var(--admin-primary) 22%,
              transparent
            );
        }

        .admin-sidebar-item.disabled{
          opacity:.48;
          cursor:not-allowed;
        }

        .admin-sidebar-item.disabled:hover{
          background:transparent;
          color:var(--admin-muted);
        }

        .admin-sidebar-item small{
          margin-left:auto;
          font-size:13px;
          font-weight:400;
          letter-spacing:.02em;
        }

        .admin-sidebar-item-icon{
          min-width:18px;
          flex:0 0 18px;
        }

        .admin-sidebar-item-text{
          min-width:0;
          white-space:nowrap;
          overflow:hidden;
          text-overflow:ellipsis;
        }

        .admin-sidebar-footer{
          flex:0 0 auto;
          padding:12px 10px;
          display:flex;
          flex-direction:column;
          gap:7px;
          border-top:1px solid var(--admin-border);
          background:var(--admin-surface);
        }

        .admin-sidebar-crm-link,
        .admin-sidebar-collapse{
          width:100%;
          height:40px;
          min-height:40px;
          border:1px solid var(--admin-border);
          border-radius:9px;
          background:var(--admin-surface);
          color:var(--admin-text);
          display:flex;
          align-items:center;
          gap:9px;
          padding:0 11px;
          box-sizing:border-box;
          cursor:pointer;
          font-size:13px;
          transition:
            background .16s ease,
            border-color .16s ease,
            color .16s ease;
        }

        .admin-sidebar-crm-link:hover,
        .admin-sidebar-collapse:hover{
          background:var(--admin-surface-2);
          border-color:var(--admin-primary);
        }

        .admin-sidebar-collapse{
          color:var(--admin-muted);
        }

        .admin-sidebar.is-collapsed
        .admin-sidebar-heading span,
        .admin-sidebar.is-collapsed
        .admin-sidebar-section-label span,
        .admin-sidebar.is-collapsed
        .admin-sidebar-item-text,
        .admin-sidebar.is-collapsed
        .admin-sidebar-item small,
        .admin-sidebar.is-collapsed
        .admin-sidebar-crm-link span,
        .admin-sidebar.is-collapsed
        .admin-sidebar-collapse span{
          display:none;
        }

        .admin-sidebar.is-collapsed
        .admin-sidebar-header{
          justify-content:center;
          padding:0 10px;
        }

        .admin-sidebar.is-collapsed
        .admin-sidebar-nav{
          padding:0 10px;
        }

        .admin-sidebar.is-collapsed
        .admin-sidebar-item{
          justify-content:center;
          padding:0;
        }

        .admin-sidebar.is-collapsed
        .admin-sidebar-crm-link,
        .admin-sidebar.is-collapsed
        .admin-sidebar-collapse{
          justify-content:center;
          padding:0;
        }

        @media(max-width:900px){
          .admin-sidebar{
            width:min(290px,88vw);
            min-width:min(290px,88vw);
            transform:translateX(-105%);
            box-shadow:12px 0 35px rgba(0,0,0,.18);
          }

          .admin-sidebar.is-open{
            transform:translateX(0);
          }

          .admin-sidebar.is-collapsed{
            width:min(290px,88vw);
            min-width:min(290px,88vw);
          }

          .admin-sidebar-close{
            display:flex;
          }

          .admin-sidebar.is-collapsed
          .admin-sidebar-heading span,
          .admin-sidebar.is-collapsed
          .admin-sidebar-section-label span,
          .admin-sidebar.is-collapsed
          .admin-sidebar-item-text,
          .admin-sidebar.is-collapsed
          .admin-sidebar-item small,
          .admin-sidebar.is-collapsed
          .admin-sidebar-crm-link span,
          .admin-sidebar.is-collapsed
          .admin-sidebar-collapse span{
            display:block;
          }

          .admin-sidebar.is-collapsed
          .admin-sidebar-header{
            justify-content:space-between;
            padding:0 15px;
          }

          .admin-sidebar.is-collapsed
          .admin-sidebar-item{
            justify-content:flex-start;
            padding:0 12px;
          }

          .admin-sidebar.is-collapsed
          .admin-sidebar-crm-link,
          .admin-sidebar.is-collapsed
          .admin-sidebar-collapse{
            justify-content:flex-start;
            padding:0 11px;
          }
        }

        @media(max-width:520px){
          .admin-sidebar-header{
            height:60px;
            min-height:60px;
          }

          .admin-sidebar{
            width:min(290px,88vw);
            min-width:min(290px,88vw);
          }

          .admin-sidebar.is-collapsed{
            width:min(290px,88vw);
            min-width:min(290px,88vw);
          }
        }

        @media(prefers-reduced-motion:reduce){
          .admin-sidebar{
            transition:none!important;
          }
        }
      `}</style>
    </aside>
  );
}

export default AdminSidebar;
