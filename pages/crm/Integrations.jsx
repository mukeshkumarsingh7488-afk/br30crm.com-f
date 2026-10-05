import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle2, CircleAlert, Link2, Mail, MessageCircle, Plus, RefreshCw, Settings2, Smartphone, Trash2, X } from "lucide-react";
import useBusiness from "../../hooks/useBusiness";
import { createIntegration, deleteIntegration, getIntegrations, updateIntegrationStatus } from "../../api/integration.api";
import { showAuthAlert } from "../../components/auth/authAlert";

const PROVIDERS = [
  { type: "EMAIL", provider: "brevo", label: "Brevo Email", icon: Mail, description: "Transactional email through the BR30 CRM Brevo sender." },
  { type: "SMS", provider: "brevo", label: "Brevo SMS", icon: Smartphone, description: "1:1 SMS sending and delivery tracking." },
  { type: "WHATSAPP", provider: "brevo", label: "Brevo WhatsApp", icon: MessageCircle, description: "1:1 WhatsApp messaging through the connected Brevo sender." },
  { type: "CONVERSATION", provider: "brevo", label: "Brevo Conversations", icon: MessageCircle, description: "Future-ready Conversations inbox and visitor messaging.", comingSoon: true },
  { type: "SOCIAL", provider: "brevo", label: "Social messaging", icon: Link2, description: "Reserved integration slot for future supported social channels.", comingSoon: true },
  { type: "PHONE", provider: "brevo", label: "Brevo Phone", icon: Smartphone, description: "Future-ready calling, recordings, voicemail and call events.", comingSoon: true },
];

const emptyForm = { name: "", type: "EMAIL", provider: "brevo", status: "ACTIVE", sender: "", senderNumber: "", phoneNumber: "", webhookSecret: "" };

const unwrapValue = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value?._id || value?.id || "";
};

function Integrations() {
  const { businessId, loading: businessLoading } = useBusiness();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const load = useCallback(async () => {
    if (!businessId) return;
    setLoading(true);
    setError("");
    try {
      const result = await getIntegrations(businessId, { page: 1, limit: 100 });
      setItems(result.items || []);
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Unable to load integrations.");
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  useEffect(() => { load(); }, [load]);

  const connectedTypes = useMemo(() => new Set(items.filter((item) => item.status === "ACTIVE").map((item) => item.type)), [items]);

  const openCreate = (type = "EMAIL", provider = "brevo") => {
    const meta = PROVIDERS.find((item) => item.type === type) || PROVIDERS[0];
    if (meta.comingSoon) return;
    setForm({ ...emptyForm, type, provider, name: meta.label });
    setModal(true);
  };

  const save = async () => {
    if (!businessId || !form.name.trim()) return;
    setSaving(true);
    setError("");
    try {
      const config = {};
      const metadata = {};
      if (form.sender.trim()) config.sender = form.sender.trim();
      if (form.senderNumber.trim()) config.senderNumber = form.senderNumber.trim();
      if (form.phoneNumber.trim()) config.phoneNumber = form.phoneNumber.trim();
      if (form.webhookSecret.trim()) config.webhookSecret = form.webhookSecret.trim();
      await createIntegration(businessId, {
        name: form.name.trim(),
        provider: form.provider,
        type: form.type,
        status: form.status,
        config,
        metadata,
        credentials: {},
      });
      setModal(false);
      setForm(emptyForm);
      await load();
      await showAuthAlert({ icon: "success", title: "Integration connected", text: `${form.name} is ready in BR30 CRM.`, confirmButtonText: "Done" });
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Unable to connect integration.");
    } finally {
      setSaving(false);
    }
  };

  const toggle = async (item) => {
    try {
      await updateIntegrationStatus(businessId, unwrapValue(item), item.status === "ACTIVE" ? "INACTIVE" : "ACTIVE");
      await load();
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Unable to update integration.");
    }
  };

  const remove = async (item) => {
    const result = await showAuthAlert({ icon: "warning", title: "Remove integration?", text: `Remove ${item.name || item.provider}?`, showCancelButton: true, confirmButtonText: "Remove", cancelButtonText: "Cancel" });
    if (!result.isConfirmed) return;
    try {
      await deleteIntegration(businessId, unwrapValue(item));
      await load();
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Unable to remove integration.");
    }
  };

  return (
    <div className="crm-integration-page">
      <style>{`
        .crm-integration-page{padding:24px 26px 36px;max-width:1500px;margin:0 auto}
        .crm-integration-head{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;margin-bottom:20px}
        .crm-integration-title{margin:0;font-size:24px;font-weight:400;letter-spacing:-.35px}.crm-integration-sub{margin:6px 0 0;color:var(--crm-muted);font-size:13px}
        .crm-integration-actions{display:flex;gap:8px}.crm-integration-btn{height:38px;border:1px solid var(--crm-border);border-radius:9px;background:var(--crm-surface);color:var(--crm-text);padding:0 12px;display:inline-flex;align-items:center;gap:7px}.crm-integration-btn.primary{background:var(--crm-primary);border-color:var(--crm-primary);color:#fff}
        .crm-integration-alert{padding:11px 13px;border:1px solid color-mix(in srgb,var(--crm-danger) 25%,var(--crm-border));background:color-mix(in srgb,var(--crm-danger) 7%,var(--crm-surface));color:var(--crm-danger);border-radius:10px;font-size:13px;margin-bottom:16px}
        .crm-integration-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.crm-integration-card{background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:14px;padding:17px;min-height:190px;display:flex;flex-direction:column}
        .crm-integration-card-top{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}.crm-integration-icon{width:40px;height:40px;border-radius:11px;background:var(--crm-primary-soft);color:var(--crm-primary);display:grid;place-items:center}
        .crm-integration-status{font-size:13px;font-weight:400;border-radius:99px;padding:5px 8px;background:var(--crm-surface-2);color:var(--crm-muted)}.crm-integration-status.active{color:var(--crm-success);background:color-mix(in srgb,var(--crm-success) 10%,var(--crm-surface))}
        .crm-integration-name{margin:15px 0 5px;font-size:14px;font-weight:400}.crm-integration-desc{margin:0;color:var(--crm-muted);font-size:13px;line-height:1.55;min-height:36px}
        .crm-integration-meta{margin-top:auto;padding-top:13px;border-top:1px solid var(--crm-border);display:flex;justify-content:space-between;align-items:center;gap:8px}.crm-integration-provider{font-size:13px;color:var(--crm-muted);text-transform:uppercase;letter-spacing:.08em}
        .crm-integration-card-actions{display:flex;gap:6px}.crm-integration-mini{height:30px;border:1px solid var(--crm-border);border-radius:8px;background:var(--crm-surface);color:var(--crm-muted);display:grid;place-items:center;padding:0 8px;font-size:13px}.crm-integration-mini:hover{color:var(--crm-text);background:var(--crm-surface-2)}
        .crm-integration-empty{grid-column:1/-1;padding:44px;text-align:center;color:var(--crm-muted);border:1px dashed var(--crm-border);border-radius:14px}
        .crm-integration-modal{position:fixed;inset:0;background:rgba(15,23,42,.48);display:grid;place-items:center;padding:20px;z-index:700}.crm-integration-dialog{width:min(560px,100%);background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:15px;box-shadow:var(--crm-shadow-lg);padding:20px}.crm-integration-dialog-head{display:flex;justify-content:space-between;align-items:center}.crm-integration-dialog h2{font-size:17px;margin:0}.crm-integration-close{width:32px;height:32px;border:0;border-radius:8px;background:transparent;color:var(--crm-muted);display:grid;place-items:center}.crm-integration-fields{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:18px}.crm-integration-field{display:grid;gap:6px}.crm-integration-field.full{grid-column:1/-1}.crm-integration-field label{font-size:13px;font-weight:400}.crm-integration-field input,.crm-integration-field select{height:40px;border:1px solid var(--crm-border);border-radius:9px;background:var(--crm-surface);color:var(--crm-text);padding:0 11px;outline:none}.crm-integration-field input:focus,.crm-integration-field select:focus{border-color:var(--crm-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--crm-primary) 10%,transparent)}.crm-integration-foot{display:flex;justify-content:flex-end;gap:8px;margin-top:18px}
        @media(max-width:1050px){.crm-integration-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:680px){.crm-integration-page{padding:18px}.crm-integration-head{flex-direction:column}.crm-integration-grid{grid-template-columns:1fr}.crm-integration-fields{grid-template-columns:1fr}.crm-integration-field.full{grid-column:auto}}
      `}</style>
      <div className="crm-integration-head">
        <div><h1 className="crm-integration-title">Integrations</h1><p className="crm-integration-sub">Connect communication and future-ready provider capabilities for this business.</p></div>
        <div className="crm-integration-actions"><button className="crm-integration-btn" onClick={load} disabled={loading}><RefreshCw size={14}/> Refresh</button><button className="crm-integration-btn primary" onClick={() => openCreate()}><Plus size={14}/> Add integration</button></div>
      </div>
      {error && <div className="crm-integration-alert">{error}</div>}
      <div className="crm-integration-grid">
        {PROVIDERS.map((meta) => {
          const connected = items.find((item) => item.type === meta.type);
          const Icon = meta.icon;
          const comingSoon = Boolean(meta.comingSoon);
          return (
            <div className="crm-integration-card" key={meta.type}>
              <div className="crm-integration-card-top"><div className="crm-integration-icon"><Icon size={19}/></div><span className={`crm-integration-status ${connected?.status === "ACTIVE" ? "active" : ""}`}>{comingSoon ? "COMING SOON" : connected?.status || "NOT CONNECTED"}</span></div>
              <h3 className="crm-integration-name">{meta.label}</h3><p className="crm-integration-desc">{meta.description}</p>
              <div className="crm-integration-meta"><span className="crm-integration-provider">{meta.provider}</span><div className="crm-integration-card-actions">
                {comingSoon ? <span className="crm-integration-mini" style={{cursor:"default",opacity:.65}}>Future</span> : connected ? <><button className="crm-integration-mini" onClick={() => toggle(connected)}>{connected.status === "ACTIVE" ? "Disable" : "Enable"}</button><button className="crm-integration-mini" onClick={() => remove(connected)} title="Remove"><Trash2 size={13}/></button></> : <button className="crm-integration-mini" onClick={() => openCreate(meta.type, meta.provider)}><Link2 size={13}/> Connect</button>}
              </div></div>
            </div>
          );
        })}
        {loading || businessLoading ? <div className="crm-integration-empty">Loading integrations…</div> : null}
      </div>
      {modal && <div className="crm-integration-modal" onMouseDown={(e) => e.target === e.currentTarget && setModal(false)}>
        <div className="crm-integration-dialog">
          <div className="crm-integration-dialog-head"><h2>Connect {form.name || "integration"}</h2><button className="crm-integration-close" onClick={() => setModal(false)}><X size={17}/></button></div>
          <div className="crm-integration-fields">
            <div className="crm-integration-field full"><label>Integration name</label><input value={form.name} onChange={(e) => setForm({...form,name:e.target.value})} /></div>
            <div className="crm-integration-field"><label>Channel</label><select value={form.type} onChange={(e) => setForm({...form,type:e.target.value})}>{PROVIDERS.filter((p) => !p.comingSoon).map((p)=><option key={p.type} value={p.type}>{p.label}</option>)}</select></div>
            <div className="crm-integration-field"><label>Provider</label><input value={form.provider} readOnly /></div>
            {(form.type === "SMS") && <div className="crm-integration-field"><label>SMS sender</label><input value={form.sender} onChange={(e)=>setForm({...form,sender:e.target.value})} placeholder="Approved Brevo sender" /></div>}
            {(form.type === "WHATSAPP") && <><div className="crm-integration-field"><label>Sender number</label><input value={form.senderNumber} onChange={(e)=>setForm({...form,senderNumber:e.target.value})} placeholder="Connected WhatsApp sender" /></div><div className="crm-integration-field"><label>Phone number</label><input value={form.phoneNumber} onChange={(e)=>setForm({...form,phoneNumber:e.target.value})} /></div></>}
            {(form.type === "CONVERSATION" || form.type === "SOCIAL" || form.type === "PHONE") && <div className="crm-integration-field full"><label>Webhook secret (optional)</label><input value={form.webhookSecret} onChange={(e)=>setForm({...form,webhookSecret:e.target.value})} placeholder="Used to validate provider events" /></div>}
          </div>
          <div className="crm-integration-foot"><button className="crm-integration-btn" onClick={()=>setModal(false)}>Cancel</button><button className="crm-integration-btn primary" disabled={saving} onClick={save}>{saving ? "Connecting…" : "Connect"}</button></div>
        </div>
      </div>}
    </div>
  );
}

export default Integrations;
