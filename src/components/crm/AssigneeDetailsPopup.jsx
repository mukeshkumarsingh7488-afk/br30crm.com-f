import { X, UserRound, UsersRound, Mail } from "lucide-react";

export default function AssigneeDetailsPopup({ detail, onClose }) {
  if (!detail) return null;
  const isTeam = detail.type === "team";
  return (
    <div className="crm-assignee-popup-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="crm-assignee-popup" role="dialog" aria-modal="true">
        <div className="crm-assignee-popup-head">
          <div className="crm-assignee-popup-title">{isTeam ? "Team Details" : "Assigned User Details"}</div>
          <button type="button" className="crm-assignee-popup-close" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>
        <div className="crm-assignee-popup-icon">{isTeam ? <UsersRound size={20} /> : <UserRound size={20} />}</div>
        <div className="crm-assignee-popup-name">{detail.name || "Unassigned"}</div>
        {!isTeam && detail.email ? (
          <div className="crm-assignee-popup-row">
            <Mail size={13} />
            <span>{detail.email}</span>
          </div>
        ) : null}
        {isTeam && detail.slug ? (
          <div className="crm-assignee-popup-row">
            <span>Slug</span>
            <span>{detail.slug}</span>
          </div>
        ) : null}
      </div>
      <style>{`.crm-assignee-popup-backdrop{position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.28);display:flex;align-items:center;justify-content:center;padding:20px}.crm-assignee-popup{width:min(390px,100%);border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:14px;box-shadow:0 20px 60px rgba(0,0,0,.18);padding:20px}.crm-assignee-popup-head{display:flex;align-items:center;justify-content:space-between;gap:12px}.crm-assignee-popup-title{font-size:14px;font-weight:500}.crm-assignee-popup-close{border:0;background:transparent;color:var(--crm-muted);cursor:pointer;padding:4px}.crm-assignee-popup-icon{width:42px;height:42px;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:22px auto 10px;border:1px solid var(--crm-border)}.crm-assignee-popup-name{text-align:center;font-size:18px;font-weight:500}.crm-assignee-popup-row{display:flex;align-items:center;justify-content:center;gap:7px;margin-top:9px;color:var(--crm-muted);font-size:13px}`}</style>
    </div>
  );
}
