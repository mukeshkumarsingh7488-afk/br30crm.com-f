import { CalendarDays, ExternalLink, Sparkles, X } from "lucide-react";

import { useEffect } from "react";

import { formatWhatsNewDate, getWhatsNewMedia, whatsNewTypeLabel } from "./whatsNew.utils";

function WhatsNewModal({ item, onClose }) {
  useEffect(() => {
    if (!item) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);

      document.body.style.overflow = previousOverflow;
    };
  }, [item, onClose]);

  if (!item) {
    return null;
  }

  const media = getWhatsNewMedia(item);

  const handleAction = () => {
    if (!item.actionUrl) {
      return;
    }

    const url = String(item.actionUrl).trim();

    if (url.startsWith("/") || url.startsWith("#")) {
      window.location.href = url;
      return;
    }

    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className="whats-new-modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose?.();
        }
      }}>
      <div className="whats-new-modal" role="dialog" aria-modal="true" aria-labelledby="whats-new-modal-title">
        <button type="button" className="whats-new-modal-close" onClick={onClose} aria-label="Close">
          <X size={19} />
        </button>

        <div className="whats-new-modal-media">
          {media.type === "IMAGE" && media.url ? (
            <img src={media.url} alt={item.title || "What's New"} />
          ) : media.type === "VIDEO" && media.url ? (
            <iframe src={media.url} title={item.title || "What's New video"} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
          ) : (
            <div className="whats-new-modal-no-media">
              <Sparkles size={38} />
            </div>
          )}
        </div>

        <div className="whats-new-modal-content">
          <div className="whats-new-modal-meta">
            <span>{whatsNewTypeLabel(item.type)}</span>

            {item.version ? <span>v{item.version}</span> : null}

            {item.releaseDate ? (
              <span>
                <CalendarDays size={14} />

                {formatWhatsNewDate(item.releaseDate)}
              </span>
            ) : null}
          </div>

          <h2 id="whats-new-modal-title">{item.title}</h2>

          {item.shortDescription ? <p className="whats-new-modal-short">{item.shortDescription}</p> : null}

          {item.description ? (
            <section className="whats-new-modal-section">
              <h3>Details</h3>

              <p className="whats-new-description">{item.description}</p>
            </section>
          ) : null}

          {Array.isArray(item.features) && item.features.length > 0 ? (
            <section className="whats-new-modal-section">
              <h3>What's included</h3>

              <ul className="whats-new-feature-list">
                {item.features.map((feature, index) => (
                  <li key={`${feature}-${index}`}>
                    <span />
                    {feature}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {item.howToUse ? (
            <section className="whats-new-modal-section">
              <h3>How to use</h3>

              <p className="whats-new-description">{item.howToUse}</p>
            </section>
          ) : null}

          {item.actionText && item.actionUrl ? (
            <button type="button" className="whats-new-modal-action" onClick={handleAction}>
              {item.actionText}

              <ExternalLink size={16} />
            </button>
          ) : null}
        </div>
      </div>

      <style>{`
        .whats-new-modal-overlay{position:fixed;inset:0;z-index:9999;background:rgba(8,15,30,.72);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:22px}.whats-new-modal{position:relative;width:min(820px,100%);max-height:92vh;overflow:auto;background:var(--admin-surface,#fff);border:1px solid var(--admin-border,#e5e7eb);border-radius:24px;box-shadow:0 30px 90px rgba(0,0,0,.25)}.whats-new-modal-close{position:absolute;right:15px;top:15px;z-index:3;width:38px;height:38px;border:1px solid rgba(255,255,255,.35);border-radius:50%;background:rgba(0,0,0,.45);color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer}.whats-new-modal-media{width:100%;aspect-ratio:16/8;overflow:hidden;background:#111827}.whats-new-modal-media img,.whats-new-modal-media iframe{width:100%;height:100%;border:0;display:block;object-fit:cover}.whats-new-modal-no-media{width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,.7)}.whats-new-modal-content{padding:30px 32px 34px}.whats-new-modal-meta{display:flex;align-items:center;gap:9px;flex-wrap:wrap;color:var(--admin-text-muted,#6b7280);font-size:13px}.whats-new-modal-meta span{display:inline-flex;align-items:center;gap:5px}.whats-new-modal-meta span:first-child{padding:6px 10px;border-radius:999px;background:var(--admin-primary-soft,#eff6ff);color:var(--admin-primary,#2563eb);font-weight:400}.whats-new-modal-content h2{margin:14px 0 9px;font-size:30px;line-height:1.2;color:var(--admin-text,#111827)}.whats-new-modal-short{margin:0;color:var(--admin-text-secondary,#4b5563);font-size:15px;line-height:1.7}.whats-new-modal-section{margin-top:26px}.whats-new-modal-section h3{margin:0 0 9px;font-size:14px;color:var(--admin-text,#111827)}.whats-new-description{margin:0;white-space:pre-wrap;color:var(--admin-text-secondary,#4b5563);line-height:1.75;font-size:14px}.whats-new-feature-list{padding:0;margin:0;list-style:none;display:grid;gap:9px}.whats-new-feature-list li{display:flex;align-items:flex-start;gap:9px;color:var(--admin-text-secondary,#4b5563);line-height:1.55;font-size:14px}.whats-new-feature-list li span{width:7px;height:7px;margin-top:7px;border-radius:50%;background:var(--admin-primary,#2563eb);flex:0 0 7px}.whats-new-modal-action{margin-top:28px;height:44px;padding:0 17px;border:0;border-radius:11px;background:var(--admin-primary,#2563eb);color:#fff;font-weight:400;display:inline-flex;align-items:center;gap:8px;cursor:pointer}.whats-new-modal-action:hover{filter:brightness(.96)}@media(max-width:600px){.whats-new-modal-overlay{padding:10px}.whats-new-modal{border-radius:18px;max-height:95vh}.whats-new-modal-content{padding:23px 20px 25px}.whats-new-modal-content h2{font-size:24px}.whats-new-modal-media{aspect-ratio:16/10}}
      `}</style>
    </div>
  );
}

export default WhatsNewModal;
