import { useEffect, useState } from "react";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import useBusiness from "../../hooks/useBusiness";

export default function EntityDetails({ title, api }) {
  const { id } = useParams();
  const { businessId } = useBusiness();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = async () => {
    if (!businessId || !id) return;
    setLoading(true);
    try {
      const r = await api.get(businessId, id);
      setRecord(r?.data || r || null);
      setError("");
    } catch (e) {
      setError(e?.message || "Unable to load record.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, [businessId, id]);
  return (
    <div className="crm-detail-page">
      <style>{`.crm-detail-page{padding:24px 26px}.crm-detail-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:18px}.crm-detail-title{font-size:23px;font-weight:400;margin:0}.crm-detail-card{background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:14px;padding:22px}.crm-detail-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:15px}.crm-detail-item{padding:13px;border:1px solid var(--crm-border);border-radius:10px}.crm-detail-label{font-size:13px;text-transform:uppercase;color:var(--crm-muted);letter-spacing:.06em}.crm-detail-value{margin-top:5px;font-size:13px;color:var(--crm-text);word-break:break-word}.crm-detail-actions{display:flex;gap:8px}.crm-detail-btn{height:36px;padding:0 12px;border:1px solid var(--crm-border);border-radius:9px;background:var(--crm-surface);color:var(--crm-text);display:inline-flex;align-items:center;gap:6px}@media(max-width:700px){.crm-detail-page{padding:18px 14px}.crm-detail-grid{grid-template-columns:1fr}}`}</style>
      <div className="crm-detail-head">
        <div>
          <Link
            className="crm-detail-btn"
            to="-1"
            onClick={(e) => {
              e.preventDefault();
              history.back();
            }}>
            <ArrowLeft size={14} />
            Back
          </Link>
          <h1 className="crm-detail-title" style={{ marginTop: 12 }}>
            {title}
          </h1>
        </div>
        <button className="crm-detail-btn" onClick={load}>
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>
      <div className="crm-detail-card">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div style={{ color: "var(--crm-danger)" }}>{error}</div>
        ) : record ? (
          <div className="crm-detail-grid">
            {Object.entries(record)
              .filter(([k]) => !k.startsWith("__") && k !== "businessId")
              .map(([key, value]) => (
                <div className="crm-detail-item" key={key}>
                  <div className="crm-detail-label">{key}</div>
                  <div className="crm-detail-value">{typeof value === "object" ? JSON.stringify(value, null, 2) : String(value ?? "—")}</div>
                </div>
              ))}
          </div>
        ) : (
          <div>No record found.</div>
        )}
      </div>
    </div>
  );
}
