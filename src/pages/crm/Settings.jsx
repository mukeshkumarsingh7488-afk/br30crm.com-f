import { useEffect, useState } from "react";
import { Check, Moon, Save, Sun } from "lucide-react";
import { getCurrentUser, updateProfile } from "../../api/auth";
import { showAuthAlert } from "../../components/auth/authAlert";
import useBusiness from "../../hooks/useBusiness";
import { getBusinessSettings, updateBusinessSettings } from "../../api/settings.api";

const SIDEBAR_MODES = [
  {
    value: "topnav",
    label: "Top Navigation",
    description: "Keep CRM navigation in a horizontal top navigation bar for a wide workspace layout.",
    icon: "↔",
  },
  {
    value: "split",
    label: "Split Sidebar",
    description: "Section navigation and page navigation stay separated for a clean enterprise workspace.",
    icon: "▥",
  },
  {
    value: "accordion",
    label: "Accordion Sidebar",
    description: "Organize sections with expandable and collapsible page groups.",
    icon: "☷",
  },
  {
    value: "compact",
    label: "Compact",
    description: "Keep navigation minimal with page icons and maximum workspace space.",
    icon: "◫",
  },
  {
    value: "floating",
    label: "Floating",
    description: "Use a rounded floating sidebar for a modern premium workspace.",
    icon: "▱",
  },
  {
    value: "rail",
    label: "Mini / Rail",
    description: "Switch between a compact rail and the full navigation when needed.",
    icon: "▥",
  },
  {
    value: "dual",
    label: "Dual-Level Sidebar",
    description: "Choose a section first and display its related pages in a second navigation level.",
    icon: "▤",
  },
  {
    value: "section",
    label: "Section Rail",
    description: "Show section icons only and reveal the complete section menu when you hover.",
    icon: "⋮",
  },
];

export default function Settings() {
  const [theme, setTheme] = useState(localStorage.getItem("crm-theme") || "system");
  const [sidebarMode, setSidebarMode] = useState(localStorage.getItem("crm-sidebar-mode") || "rail");
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const { businessId } = useBusiness();
  const [businessSettings, setBusinessSettings] = useState(null);
  const [settingsLoading, setSettingsLoading] = useState(false);

  useEffect(() => {
    getCurrentUser()
      .then((r) => {
        const u = r?.data?.user || r?.user || r?.data || {};
        setName(u.name || "");
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!businessId) return;
    setSettingsLoading(true);
    getBusinessSettings(businessId)
      .then((r) => setBusinessSettings(r))
      .catch(() => {})
      .finally(() => setSettingsLoading(false));
  }, [businessId]);

  useEffect(() => {
    const savedMode = localStorage.getItem("crm-sidebar-mode");
    if (savedMode) setSidebarMode(savedMode);
  }, []);

  const applyTheme = (selectedTheme) => {
    const root = document.documentElement;
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const activeTheme = selectedTheme === "system" ? (systemDark ? "dark" : "light") : selectedTheme;
    root.setAttribute("data-theme", activeTheme);
    root.style.colorScheme = activeTheme;
  };

  const handleThemeChange = (value) => {
    setTheme(value);
    applyTheme(value);
  };

  const handleSidebarModeChange = (value) => {
    setSidebarMode(value);
    localStorage.setItem("crm-sidebar-mode", value);
    window.dispatchEvent(new CustomEvent("crm-sidebar-mode-change", { detail: value }));
  };

  const save = async () => {
    setSaving(true);
    setMessage("");

    try {
      localStorage.setItem("crm-theme", theme);
      localStorage.setItem("crm-sidebar-mode", sidebarMode);
      applyTheme(theme);

      window.dispatchEvent(new CustomEvent("crm-sidebar-mode-change", { detail: sidebarMode }));

      if (name.trim()) {
        await updateProfile({ name: name.trim() });
      }
      if (businessId && businessSettings) {
        await updateBusinessSettings(businessId, { general: businessSettings.general, regional: businessSettings.regional, notifications: businessSettings.notifications, security: businessSettings.security, crm: businessSettings.crm });
      }

      setMessage("Settings saved successfully.");

      showAuthAlert({
        icon: "success",
        title: "Settings Saved",
        text: "Your CRM settings have been saved successfully.",
        confirmButtonText: "OK",
      });
    } catch (e) {
      const errorMessage = e?.message || "Unable to save settings.";
      setMessage(errorMessage);

      showAuthAlert({
        icon: "error",
        title: "Save Failed",
        text: errorMessage,
        confirmButtonText: "OK",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: "24px 26px" }}>
      <style>{`
        .crm-settings-card{max-width:900px;background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:14px;padding:22px}
        .crm-settings-title{font-size:23px;font-weight:400;margin:0;color:var(--crm-text)}
        .crm-settings-sub{font-size:13px;color:var(--crm-muted);margin:6px 0 20px}
        .crm-setting-row{display:grid;gap:7px;margin-top:16px}
        .crm-setting-row label{font-size:13px;font-weight:400;color:var(--crm-text)}
        .crm-setting-row input,.crm-setting-row select{height:40px;border:1px solid var(--crm-border);border-radius:9px;background:var(--crm-surface);color:var(--crm-text);padding:0 11px;outline:none}
        .crm-setting-row input::placeholder{color:var(--crm-muted)}
        .crm-setting-row input:focus,.crm-setting-row select:focus{border-color:var(--crm-primary);box-shadow:0 0 0 2px var(--crm-primary-soft)}
        .crm-sidebar-settings{margin-top:24px;padding-top:21px;border-top:1px solid var(--crm-border)}
        .crm-sidebar-settings-head{display:flex;align-items:center;gap:10px}
        .crm-sidebar-settings-icon{width:36px;height:36px;min-width:36px;border-radius:10px;display:grid;place-items:center;background:var(--crm-primary-soft);color:var(--crm-primary);border:1px solid var(--crm-border)}
        .crm-sidebar-settings-title{font-size:15px;font-weight:400;color:var(--crm-text)}
        .crm-sidebar-settings-description{margin-top:3px;font-size:13px;color:var(--crm-muted);line-height:1.45}
        .crm-sidebar-mode-grid{margin-top:15px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
        .crm-sidebar-mode{position:relative;min-height:100px;width:100%;border:1px solid var(--crm-border);border-radius:11px;background:var(--crm-surface);color:var(--crm-text);padding:13px;text-align:left;cursor:pointer;transition:border-color .18s ease,background .18s ease,box-shadow .18s ease,transform .18s ease}
        .crm-sidebar-mode:hover{border-color:var(--crm-primary);background:var(--crm-surface-2);transform:translateY(-1px)}
        .crm-sidebar-mode.selected{border-color:var(--crm-primary);background:var(--crm-primary-soft);box-shadow:0 0 0 1px var(--crm-primary)}
        .crm-sidebar-mode-check{position:absolute;right:10px;top:10px;width:20px;height:20px;border-radius:50%;background:var(--crm-primary);color:#fff;display:grid;place-items:center}
        .crm-sidebar-mode-icon{height:25px;font-size:20px;line-height:25px;color:var(--crm-primary)}
        .crm-sidebar-mode-name{margin-top:7px;font-size:14px;font-weight:400;color:var(--crm-text)}
        .crm-sidebar-mode-description{margin-top:3px;font-size:12px;line-height:1.45;color:var(--crm-muted);padding-right:18px}
        .crm-business-settings{margin-top:24px;padding-top:21px;border-top:1px solid var(--crm-border)}.crm-business-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:14px}.crm-business-grid label{display:grid;gap:6px;font-size:12px;color:var(--crm-muted)}.crm-business-grid input:not([type="checkbox"]){height:40px;border:1px solid var(--crm-border);border-radius:9px;background:var(--crm-surface);color:var(--crm-text);padding:0 10px}.crm-setting-toggle{display:flex!important;align-items:center;gap:8px}.crm-setting-toggle input{accent-color:var(--crm-primary)}.crm-setting-save{margin-top:20px;height:38px;border:0;border-radius:9px;background:var(--crm-primary);color:#fff;padding:0 14px;display:inline-flex;align-items:center;gap:7px;font-weight:400}
        .crm-setting-save:hover{filter:brightness(.97)}
        .crm-setting-save:disabled{opacity:.65;cursor:not-allowed}
        .crm-setting-message{margin-top:12px;font-size:13px;color:var(--crm-success)}
        @media(max-width:700px){.crm-business-grid{grid-template-columns:1fr}.crm-sidebar-mode-grid{grid-template-columns:1fr}}
      `}</style>

      <div className="crm-settings-card">
        <h1 className="crm-settings-title">CRM Settings</h1>
        <p className="crm-settings-sub">Manage workspace preferences and your profile basics.</p>

        <div className="crm-setting-row">
          <label>Display name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
        </div>

        <div className="crm-setting-row">
          <label>Appearance</label>
          <select value={theme} onChange={(e) => handleThemeChange(e.target.value)}>
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        <div className="crm-sidebar-settings">
          <div className="crm-sidebar-settings-head">
            <div className="crm-sidebar-settings-icon">
              <span style={{ fontSize: "18px", lineHeight: 1 }}>☷</span>
            </div>

            <div>
              <div className="crm-sidebar-settings-title">Sidebar style</div>
              <div className="crm-sidebar-settings-description">Choose how BR30 CRM navigation appears across your workspace.</div>
            </div>
          </div>

          <div className="crm-sidebar-mode-grid">
            {SIDEBAR_MODES.map((mode) => {
              const selected = sidebarMode === mode.value;

              return (
                <button key={mode.value} type="button" className={`crm-sidebar-mode ${selected ? "selected" : ""}`} onClick={() => handleSidebarModeChange(mode.value)} aria-pressed={selected}>
                  {selected && (
                    <span className="crm-sidebar-mode-check">
                      <Check size={13} />
                    </span>
                  )}

                  <div className="crm-sidebar-mode-icon">{mode.icon}</div>
                  <div className="crm-sidebar-mode-name">{mode.label}</div>
                  <div className="crm-sidebar-mode-description">{mode.description}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="crm-business-settings">
          <div className="crm-sidebar-settings-title">Business & CRM controls</div>
          <div className="crm-sidebar-settings-description">Workspace-wide preferences backed by the BR30 CRM settings API.</div>
          {settingsLoading ? (
            <div className="crm-setting-message">Loading business settings…</div>
          ) : (
            businessSettings && (
              <div className="crm-business-grid">
                <label>
                  Business name
                  <input value={businessSettings.general?.businessName || ""} placeholder="e.g. BR30 CRM" onChange={(e) => setBusinessSettings({ ...businessSettings, general: { ...businessSettings.general, businessName: e.target.value } })} />
                </label>
                <label>
                  Timezone
                  <input value={businessSettings.regional?.timezone || "Asia/Kolkata"} placeholder="e.g. Asia/Kolkata" onChange={(e) => setBusinessSettings({ ...businessSettings, regional: { ...businessSettings.regional, timezone: e.target.value } })} />
                </label>
                <label>
                  Currency
                  <input value={businessSettings.regional?.currency || "INR"} placeholder="e.g. INR" onChange={(e) => setBusinessSettings({ ...businessSettings, regional: { ...businessSettings.regional, currency: e.target.value } })} />
                </label>
                <label>
                  Default page size
                  <input type="number" min="5" max="100" value={businessSettings.crm?.defaultPageSize || 20} placeholder="e.g. 20" onChange={(e) => setBusinessSettings({ ...businessSettings, crm: { ...businessSettings.crm, defaultPageSize: Number(e.target.value) || 20 } })} />
                </label>
                <label className="crm-setting-toggle">
                  <input type="checkbox" checked={businessSettings.notifications?.emailEnabled !== false} onChange={(e) => setBusinessSettings({ ...businessSettings, notifications: { ...businessSettings.notifications, emailEnabled: e.target.checked } })} /> Email notifications
                </label>
                <label className="crm-setting-toggle">
                  <input type="checkbox" checked={businessSettings.notifications?.inAppEnabled !== false} onChange={(e) => setBusinessSettings({ ...businessSettings, notifications: { ...businessSettings.notifications, inAppEnabled: e.target.checked } })} /> In-app notifications
                </label>
                <label className="crm-setting-toggle">
                  <input type="checkbox" checked={Boolean(businessSettings.crm?.autoAssignLeads)} onChange={(e) => setBusinessSettings({ ...businessSettings, crm: { ...businessSettings.crm, autoAssignLeads: e.target.checked } })} /> Auto-assign leads
                </label>
                <label className="crm-setting-toggle">
                  <input type="checkbox" checked={Boolean(businessSettings.crm?.autoCreateActivities)} onChange={(e) => setBusinessSettings({ ...businessSettings, crm: { ...businessSettings.crm, autoCreateActivities: e.target.checked } })} /> Auto-create activities
                </label>
              </div>
            )
          )}
        </div>

        <button className="crm-setting-save" disabled={saving} onClick={save}>
          {theme === "dark" ? <Moon size={15} /> : <Sun size={15} />}
          <Save size={15} />
          {saving ? "Saving..." : "Save settings"}
        </button>

        {message && <div className="crm-setting-message">{message}</div>}
      </div>
    </div>
  );
}
