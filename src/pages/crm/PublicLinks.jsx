import { useEffect, useState } from "react";
import { Check, Copy, Download, ExternalLink, Link2, QrCode, RefreshCw, Share2, X } from "lucide-react";
import useBusiness from "../../hooks/useBusiness";
import { getPublicForms, getPublicFormQr } from "../../api/public-form.api";

export default function PublicLinks() {
  const { businessId } = useBusiness();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [qr, setQr] = useState(null);
  const [qrLoading, setQrLoading] = useState(false);
  const [copied, setCopied] = useState("");
  const [sharing, setSharing] = useState("");
  const [downloading, setDownloading] = useState(false);

  const getPublicUrl = (form) => {
    if (!form?.slug || !businessId) return "";
    return `${window.location.origin}/public/forms/${businessId}/${form.slug}`;
  };

  const copyText = async (text, key = "link") => {
    if (!text) return;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      setCopied(key);

      window.setTimeout(() => {
        setCopied((current) => (current === key ? "" : current));
      }, 1800);
    } catch {
      setError("Unable to copy the link.");
    }
  };

  const load = async () => {
    if (!businessId) {
      setItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await getPublicForms(businessId);

      const forms = Array.isArray(response) ? response : Array.isArray(response?.forms) ? response.forms : Array.isArray(response?.data) ? response.data : [];

      setItems(forms);
    } catch (err) {
      setItems([]);
      setError(err?.response?.data?.message || err?.message || "Unable to load public links.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [businessId]);

  const openLink = (url) => {
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const shareLink = async (form) => {
    const url = getPublicUrl(form);

    if (!url) return;

    setSharing(form._id);

    try {
      if (navigator.share) {
        await navigator.share({
          title: form.name || "Public Form",
          text: form.description || `Submit your details through ${form.name || "this form"}.`,
          url,
        });
      } else {
        await copyText(url, `share-${form._id}`);
      }
    } catch (err) {
      if (err?.name !== "AbortError") {
        await copyText(url, `share-${form._id}`);
      }
    } finally {
      setSharing("");
    }
  };

  const openQr = async (form) => {
    if (!form?._id) return;

    setQrLoading(true);
    setError("");

    try {
      const response = await getPublicFormQr(businessId, form.slug);

      const data = response?.data || response?.qr || response || {};

      setQr({
        form,
        publicUrl: data?.publicUrl || getPublicUrl(form),
        qrImageUrl: data?.qrImageUrl || data?.imageUrl || data?.url || "",
      });
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Unable to generate QR code.");
    } finally {
      setQrLoading(false);
    }
  };

  const shareQr = async () => {
    if (!qr?.publicUrl) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `${qr.form?.name || "Public Form"} QR`,
          text: "Open this link to submit the form.",
          url: qr.publicUrl,
        });
      } else {
        await copyText(qr.publicUrl, "qr-share");
      }
    } catch (err) {
      if (err?.name !== "AbortError") {
        await copyText(qr.publicUrl, "qr-share");
      }
    }
  };

  const downloadQr = async () => {
    if (!qr?.qrImageUrl) return;

    setDownloading(true);

    try {
      const response = await fetch(qr.qrImageUrl, {
        mode: "cors",
      });

      if (!response.ok) {
        throw new Error("Unable to download QR image.");
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const anchor = document.createElement("a");
      anchor.href = blobUrl;
      anchor.download = `${(qr.form?.slug || "public-form").replace(/[^a-z0-9-_]/gi, "-").toLowerCase()}-qr.png`;

      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();

      window.URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(qr.qrImageUrl, "_blank", "noopener,noreferrer");
    } finally {
      setDownloading(false);
    }
  };

  const closeQr = () => {
    setQr(null);
  };

  return (
    <div className="gen-page">
      <style>{`
        .gen-page{padding:24px 26px 38px;max-width:1450px;margin:auto;color:var(--crm-text)}
        .gen-head{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:18px}
        .gen-title{font-size:24px;font-weight:400;line-height:1.25;margin:0}
        .gen-sub{font-size:13px;color:var(--crm-muted);margin:5px 0 0}
        .gen-head-actions{display:flex;align-items:center;gap:8px;flex-shrink:0}
        .gen-btn{height:36px;border:1px solid var(--crm-border);border-radius:9px;background:var(--crm-surface);color:var(--crm-text);padding:0 11px;display:inline-flex;align-items:center;justify-content:center;gap:6px;font-size:13px;cursor:pointer;transition:.16s ease}
        .gen-btn:hover{background:var(--crm-surface-2);border-color:var(--crm-primary);color:var(--crm-text)}
        .gen-btn:disabled{opacity:.55;cursor:not-allowed}
        .gen-btn-primary{border-color:var(--crm-primary);color:var(--crm-primary)}
        .gen-grid{display:grid;gap:10px}
        .gen-card{border:1px solid var(--crm-border);border-radius:12px;background:var(--crm-surface);padding:14px;display:flex;justify-content:space-between;gap:16px;align-items:center;min-width:0}
        .gen-card-main{min-width:0;flex:1}
        .gen-card-title{font-size:14px;font-weight:500;color:var(--crm-text);margin:0 0 5px}
        .gen-card-url{font-size:12px;color:var(--crm-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:680px}
        .gen-meta{display:flex;align-items:center;gap:7px;flex-wrap:wrap;margin-top:8px}
        .muted{font-size:12px;color:var(--crm-muted)}
        .gen-status{display:inline-flex;align-items:center;gap:5px;height:24px;padding:0 8px;border-radius:999px;font-size:11px;font-weight:500;border:1px solid var(--crm-border)}
        .gen-status-active{color:var(--crm-success);background:color-mix(in srgb,var(--crm-success) 9%,var(--crm-surface))}
        .gen-status-inactive{color:var(--crm-muted);background:var(--crm-surface-2)}
        .gen-actions{display:flex;align-items:center;gap:6px;flex-wrap:wrap;justify-content:flex-end}
        .gen-icon-btn{width:36px;height:36px;border:1px solid var(--crm-border);border-radius:9px;background:var(--crm-surface);color:var(--crm-muted);display:grid;place-items:center;cursor:pointer;transition:.16s ease}
        .gen-icon-btn:hover{background:var(--crm-surface-2);border-color:var(--crm-primary);color:var(--crm-text)}
        .gen-icon-btn:disabled{opacity:.55;cursor:not-allowed}
        .gen-copy-success{color:var(--crm-success)!important;border-color:var(--crm-success)!important}
        .gen-alert{border:1px solid var(--crm-border);background:var(--crm-surface);border-radius:10px;padding:11px 13px;margin-bottom:12px;color:var(--crm-text);font-size:13px;display:flex;align-items:center;justify-content:space-between;gap:12px}
        .gen-empty{border:1px dashed var(--crm-border);border-radius:12px;background:var(--crm-surface);padding:42px 20px;text-align:center;color:var(--crm-muted)}
        .gen-empty-icon{width:42px;height:42px;margin:0 auto 10px;border-radius:11px;background:var(--crm-surface-2);display:grid;place-items:center;color:var(--crm-muted)}
        .qr-modal{position:fixed;inset:0;background:rgba(15,23,42,.52);display:grid;place-items:center;z-index:900;padding:20px}
        .qr-card{width:min(470px,100%);background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:16px;padding:18px;box-shadow:0 20px 60px rgba(0,0,0,.22)}
        .qr-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}
        .qr-title{font-size:16px;font-weight:500;margin:0;color:var(--crm-text)}
        .qr-close{width:34px;height:34px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-muted);border-radius:9px;display:grid;place-items:center;cursor:pointer}
        .qr-close:hover{background:var(--crm-surface-2);color:var(--crm-text)}
        .qr-image-wrap{display:flex;justify-content:center;align-items:center;padding:14px;border:1px solid var(--crm-border);border-radius:12px;background:var(--crm-surface-2)}
        .qr-image{width:300px;height:300px;max-width:80vw;max-height:55vh;object-fit:contain;display:block;background:#fff;border-radius:6px}
        .qr-url{margin-top:11px;padding:9px 10px;border:1px solid var(--crm-border);border-radius:9px;font-size:11px;color:var(--crm-muted);word-break:break-all;background:var(--crm-surface)}
        .qr-actions{display:flex;align-items:center;justify-content:flex-end;gap:7px;margin-top:12px;flex-wrap:wrap}
        .qr-loading{display:grid;place-items:center;height:300px;color:var(--crm-muted);font-size:13px}
        @media(max-width:760px){
          .gen-page{padding:18px 14px 30px}
          .gen-head{align-items:flex-start}
          .gen-head-actions{margin-top:2px}
          .gen-card{align-items:flex-start;flex-direction:column}
          .gen-card-url{max-width:100%}
          .gen-actions{width:100%;justify-content:flex-start}
        }
        @media(max-width:520px){
          .gen-head{flex-direction:column}
          .gen-head-actions{width:100%}
          .gen-head-actions .gen-btn{flex:1}
          .gen-title{font-size:21px}
          .gen-actions{gap:5px}
          .gen-btn{padding:0 9px}
        }
      `}</style>

      <div className="gen-head">
        <div>
          <h1 className="gen-title">Public Links</h1>
          <p className="gen-sub">Shareable links for your lead-generation forms.</p>
        </div>

        <div className="gen-head-actions">
          <button type="button" className="gen-btn" onClick={load} disabled={loading} title="Refresh">
            <RefreshCw size={14} className={loading ? "gen-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="gen-alert">
          <span>{error}</span>

          <button type="button" className="gen-icon-btn" onClick={() => setError("")} title="Dismiss" aria-label="Dismiss">
            <X size={15} />
          </button>
        </div>
      )}

      <div className="gen-grid">
        {loading ? (
          <div className="gen-card">
            <div className="muted">Loading public links…</div>
          </div>
        ) : items.length ? (
          items.map((form) => {
            const publicUrl = getPublicUrl(form);
            const isActive = form.status === "ACTIVE";
            const copiedKey = `link-${form._id}`;

            return (
              <div className="gen-card" key={form._id}>
                <div className="gen-card-main">
                  <h3 className="gen-card-title">{form.name || "Untitled Form"}</h3>

                  <div className="gen-card-url" title={publicUrl}>
                    {publicUrl || "Public URL unavailable"}
                  </div>

                  <div className="gen-meta">
                    <span className={`gen-status ${isActive ? "gen-status-active" : "gen-status-inactive"}`}>
                      <span>●</span>
                      {isActive ? "Active" : "Inactive"}
                    </span>

                    <span className="muted">Source: {form.source || "—"}</span>

                    <span className="muted">Campaign: {form.campaign || "—"}</span>
                  </div>
                </div>

                <div className="gen-actions">
                  <button type="button" className={`gen-btn ${copied === copiedKey ? "gen-copy-success" : ""}`} onClick={() => copyText(publicUrl, copiedKey)} disabled={!publicUrl} title="Copy public link">
                    {copied === copiedKey ? <Check size={14} /> : <Copy size={14} />}
                    {copied === copiedKey ? "Copied" : "Copy"}
                  </button>

                  <button type="button" className="gen-btn" onClick={() => shareLink(form)} disabled={!publicUrl || sharing === form._id} title="Share public link">
                    <Share2 size={14} />
                    Share
                  </button>

                  <button type="button" className="gen-icon-btn" onClick={() => openLink(publicUrl)} disabled={!publicUrl} title="Open public form" aria-label="Open public form">
                    <ExternalLink size={15} />
                  </button>

                  <button type="button" className="gen-btn gen-btn-primary" onClick={() => openQr(form)} disabled={qrLoading || !form.slug} title="View QR code">
                    <QrCode size={14} />
                    QR
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="gen-empty">
            <div className="gen-empty-icon">
              <Link2 size={20} />
            </div>

            <div style={{ fontSize: 14, color: "var(--crm-text)" }}>No public forms available.</div>

            <div className="muted" style={{ marginTop: 5 }}>
              Create a public lead form first to generate shareable links.
            </div>
          </div>
        )}
      </div>

      {qr && (
        <div className="qr-modal" onClick={closeQr} role="presentation">
          <div className="qr-card" onClick={(event) => event.stopPropagation()}>
            <div className="qr-head">
              <div>
                <h3 className="qr-title">{qr.form?.name || "Public Form"} QR Code</h3>

                <div className="muted" style={{ marginTop: 3 }}>
                  Scan to open the lead form
                </div>
              </div>

              <button type="button" className="qr-close" onClick={closeQr} title="Close" aria-label="Close QR code">
                <X size={16} />
              </button>
            </div>

            {qr.qrImageUrl ? (
              <div className="qr-image-wrap">
                <img src={qr.qrImageUrl} alt={`${qr.form?.name || "Public form"} QR code`} className="qr-image" />
              </div>
            ) : (
              <div className="qr-image-wrap">
                <div className="qr-loading">QR image unavailable.</div>
              </div>
            )}

            <div className="qr-url" title={qr.publicUrl}>
              {qr.publicUrl || "Public URL unavailable"}
            </div>

            <div className="qr-actions">
              <button type="button" className={`gen-btn ${copied === "qr-link" ? "gen-copy-success" : ""}`} onClick={() => copyText(qr.publicUrl, "qr-link")} disabled={!qr.publicUrl}>
                {copied === "qr-link" ? <Check size={14} /> : <Copy size={14} />}
                {copied === "qr-link" ? "Copied" : "Copy Link"}
              </button>

              <button type="button" className="gen-btn" onClick={shareQr} disabled={!qr.publicUrl}>
                <Share2 size={14} />
                Share
              </button>

              <button type="button" className="gen-btn" onClick={downloadQr} disabled={!qr.qrImageUrl || downloading}>
                <Download size={14} />
                {downloading ? "Downloading…" : "Download QR"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
