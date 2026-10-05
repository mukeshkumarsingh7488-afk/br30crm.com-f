import { useEffect, useState } from "react";
import { Cookie, Settings2, X, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const COOKIE_CONSENT_KEY = "br30-cookie-consent";

const defaultPreferences = {
  essential: true,
  analytics: false,
  functional: false,
  marketing: false,
};

function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [preferences, setPreferences] = useState(defaultPreferences);

  useEffect(() => {
    const savedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);

    if (!savedConsent) {
      setVisible(true);
      return;
    }

    try {
      const parsed = JSON.parse(savedConsent);

      if (parsed?.preferences) {
        setPreferences({
          ...defaultPreferences,
          ...parsed.preferences,
          essential: true,
        });
      }
    } catch {
      localStorage.removeItem(COOKIE_CONSENT_KEY);
      setVisible(true);
    }
  }, []);

  const saveConsent = (nextPreferences) => {
    const consentData = {
      version: 1,
      savedAt: new Date().toISOString(),
      preferences: {
        ...nextPreferences,
        essential: true,
      },
    };

    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consentData));

    setPreferences(consentData.preferences);
    setVisible(false);
    setPreferencesOpen(false);
  };

  const acceptAll = () => {
    saveConsent({
      essential: true,
      analytics: true,
      functional: true,
      marketing: true,
    });
  };

  const rejectNonEssential = () => {
    saveConsent({
      essential: true,
      analytics: false,
      functional: false,
      marketing: false,
    });
  };

  const savePreferences = () => {
    saveConsent(preferences);
  };

  const togglePreference = (type) => {
    if (type === "essential") return;

    setPreferences((current) => ({
      ...current,
      [type]: !current[type],
    }));
  };

  const closePopup = () => {
    setVisible(false);
  };

  if (!visible) {
    return null;
  }

  return (
    <>
      <style>{`.br30-cookie-overlay{position:fixed;inset:0;z-index:9998;pointer-events:none}.br30-cookie-box{position:fixed;right:20px;bottom:20px;z-index:9999;width:min(430px,calc(100vw - 30px));border:1px solid var(--crm-border);border-radius:16px;background:var(--crm-surface);color:var(--crm-text);box-shadow:0 24px 70px rgba(15,23,42,.2);overflow:hidden;pointer-events:auto;animation:br30CookieIn .25s ease}.br30-cookie-top{display:flex;align-items:flex-start;gap:12px;padding:18px 18px 12px}.br30-cookie-icon{width:38px;height:38px;flex:0 0 38px;display:grid;place-items:center;border-radius:10px;background:var(--crm-primary-soft);color:var(--crm-primary);border:1px solid var(--crm-border)}.br30-cookie-title-wrap{min-width:0;flex:1;padding-right:28px}.br30-cookie-title{margin:0;color:var(--crm-text);font-size:14px;line-height:1.35;font-weight:400}.br30-cookie-description{margin:7px 0 0;color:var(--crm-muted);font-size:13px;line-height:1.7}.br30-cookie-close{position:absolute;top:10px;right:10px;width:30px;height:30px;display:grid;place-items:center;border:1px solid transparent;border-radius:8px;background:transparent;color:var(--crm-muted);cursor:pointer;transition:.18s}.br30-cookie-close:hover{background:var(--crm-surface-2);border-color:var(--crm-border);color:var(--crm-text)}.br30-cookie-links{display:flex;align-items:center;gap:6px;flex-wrap:wrap;padding:0 18px 13px}.br30-cookie-links a{color:var(--crm-primary);font-size:13px;text-decoration:none}.br30-cookie-links a:hover{text-decoration:underline}.br30-cookie-links span{color:var(--crm-border);font-size:13px}.br30-cookie-actions{display:grid;grid-template-columns:1fr 1fr 1fr;gap:7px;padding:13px 18px 16px;border-top:1px solid var(--crm-border);background:var(--crm-surface-2)}.br30-cookie-btn{height:36px;padding:0 10px;border:1px solid var(--crm-border);border-radius:8px;background:var(--crm-surface);color:var(--crm-text);font:inherit;font-size:13px;font-weight:400;cursor:pointer;transition:.18s}.br30-cookie-btn:hover{border-color:var(--crm-primary);color:var(--crm-primary)}.br30-cookie-btn.primary{border-color:var(--crm-primary);background:var(--crm-primary);color:#fff}.br30-cookie-btn.primary:hover{filter:brightness(.96)}.br30-cookie-preferences{padding:0 18px 17px;border-top:1px solid var(--crm-border);background:var(--crm-surface)}.br30-cookie-preferences-title{display:flex;align-items:center;gap:7px;padding:15px 0 10px;color:var(--crm-text);font-size:13px;font-weight:400}.br30-cookie-preference{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 0;border-bottom:1px solid var(--crm-border)}.br30-cookie-preference:last-of-type{border-bottom:0}.br30-cookie-preference-info{min-width:0}.br30-cookie-preference-name{display:block;color:var(--crm-text);font-size:13px;font-weight:400}.br30-cookie-preference-description{display:block;margin-top:3px;color:var(--crm-muted);font-size:13px;line-height:1.5}.br30-cookie-toggle{position:relative;width:34px;height:19px;flex:0 0 34px;border:0;border-radius:20px;background:var(--crm-border);cursor:pointer;transition:.18s}.br30-cookie-toggle::after{content:"";position:absolute;top:3px;left:3px;width:13px;height:13px;border-radius:50%;background:var(--crm-surface);box-shadow:0 1px 3px rgba(0,0,0,.18);transition:.18s}.br30-cookie-toggle.active{background:var(--crm-primary)}.br30-cookie-toggle.active::after{transform:translateX(15px)}.br30-cookie-toggle.locked{opacity:.65;cursor:not-allowed}.br30-cookie-save{width:100%;height:36px;margin-top:11px;border:1px solid var(--crm-primary);border-radius:8px;background:var(--crm-primary);color:#fff;font:inherit;font-size:13px;font-weight:400;cursor:pointer}@keyframes br30CookieIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}@media(max-width:520px){.br30-cookie-box{right:10px;bottom:10px;width:calc(100vw - 20px);border-radius:14px}.br30-cookie-top{padding:16px 15px 11px}.br30-cookie-links{padding:0 15px 12px}.br30-cookie-actions{grid-template-columns:1fr 1fr;padding:12px 15px 14px}.br30-cookie-btn:last-child{grid-column:1/-1}.br30-cookie-preferences{padding:0 15px 15px}}`}</style>

      <div className="br30-cookie-overlay">
        <div className="br30-cookie-box" role="dialog" aria-modal="false" aria-labelledby="br30-cookie-title">
          <button type="button" className="br30-cookie-close" onClick={closePopup} aria-label="Close cookie notice" title="Close">
            <X size={15} />
          </button>

          <div className="br30-cookie-top">
            <div className="br30-cookie-icon">
              <Cookie size={19} />
            </div>

            <div className="br30-cookie-title-wrap">
              <h2 id="br30-cookie-title" className="br30-cookie-title">
                We use cookies
              </h2>

              <p className="br30-cookie-description">BR30 CRM uses cookies and similar technologies to keep the website secure, remember your preferences, and improve your experience. You can accept all cookies or manage your preferences.</p>
            </div>
          </div>

          <div className="br30-cookie-links">
            <Link to="/cookies">Cookie Policy</Link>
            <span>•</span>
            <Link to="/privacy">Privacy Policy</Link>
          </div>

          {preferencesOpen && (
            <div className="br30-cookie-preferences">
              <div className="br30-cookie-preferences-title">
                <Settings2 size={13} />
                Cookie Preferences
              </div>

              <div className="br30-cookie-preference">
                <div className="br30-cookie-preference-info">
                  <span className="br30-cookie-preference-name">Essential Cookies</span>
                  <span className="br30-cookie-preference-description">Required for security, authentication, navigation, and basic website functionality.</span>
                </div>

                <button type="button" className="br30-cookie-toggle active locked" disabled aria-label="Essential cookies always enabled"></button>
              </div>

              <div className="br30-cookie-preference">
                <div className="br30-cookie-preference-info">
                  <span className="br30-cookie-preference-name">Analytics Cookies</span>
                  <span className="br30-cookie-preference-description">Help us understand website usage and improve performance.</span>
                </div>

                <button type="button" className={`br30-cookie-toggle${preferences.analytics ? " active" : ""}`} onClick={() => togglePreference("analytics")} aria-label="Toggle analytics cookies"></button>
              </div>

              <div className="br30-cookie-preference">
                <div className="br30-cookie-preference-info">
                  <span className="br30-cookie-preference-name">Functional Cookies</span>
                  <span className="br30-cookie-preference-description">Remember preferences and support enhanced website functionality.</span>
                </div>

                <button type="button" className={`br30-cookie-toggle${preferences.functional ? " active" : ""}`} onClick={() => togglePreference("functional")} aria-label="Toggle functional cookies"></button>
              </div>

              <div className="br30-cookie-preference">
                <div className="br30-cookie-preference-info">
                  <span className="br30-cookie-preference-name">Marketing Cookies</span>
                  <span className="br30-cookie-preference-description">Used for relevant marketing, advertising, and campaign measurement when enabled.</span>
                </div>

                <button type="button" className={`br30-cookie-toggle${preferences.marketing ? " active" : ""}`} onClick={() => togglePreference("marketing")} aria-label="Toggle marketing cookies"></button>
              </div>

              <button type="button" className="br30-cookie-save" onClick={savePreferences}>
                Save Preferences
              </button>
            </div>
          )}

          {!preferencesOpen && (
            <div className="br30-cookie-actions">
              <button type="button" className="br30-cookie-btn" onClick={rejectNonEssential}>
                Essential Only
              </button>

              <button type="button" className="br30-cookie-btn" onClick={() => setPreferencesOpen(true)}>
                Manage
              </button>

              <button type="button" className="br30-cookie-btn primary" onClick={acceptAll}>
                Accept All
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default CookieConsent;
