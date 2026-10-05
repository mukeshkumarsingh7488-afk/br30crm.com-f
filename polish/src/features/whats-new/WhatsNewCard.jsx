import { CalendarDays, ChevronRight, Sparkles, Video } from "lucide-react";

import { formatWhatsNewDate, getWhatsNewMedia, whatsNewTypeClass, whatsNewTypeLabel } from "./whatsNew.utils";

function WhatsNewCard({ item, onOpen }) {
  const media = getWhatsNewMedia(item);

  return (
    <article className="whats-new-card">
      <div className="whats-new-card-media">
        {media.type === "IMAGE" && media.url ? (
          <img src={media.url} alt={item.title || "What's New"} loading="lazy" />
        ) : media.type === "VIDEO" && media.url ? (
          <div className="whats-new-card-video">
            <iframe src={media.url} title={item.title || "What's New video"} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
            <div className="whats-new-video-badge">
              <Video size={13} />
              Video
            </div>
          </div>
        ) : (
          <div className="whats-new-card-no-media">
            <Sparkles size={30} />
            <span>What's New</span>
          </div>
        )}
      </div>

      <div className="whats-new-card-body">
        <div className="whats-new-card-meta">
          <span className={`whats-new-type ${whatsNewTypeClass(item.type)}`}>
            {item.type === "NEW_FEATURE" ? <Sparkles size={13} /> : null}

            {whatsNewTypeLabel(item.type)}
          </span>

          {item.version ? <span className="whats-new-version">v{item.version}</span> : null}
        </div>

        <h3>{item.title}</h3>

        {item.shortDescription ? <p>{item.shortDescription}</p> : null}

        <div className="whats-new-card-footer">
          {item.releaseDate ? (
            <span className="whats-new-date">
              <CalendarDays size={14} />

              {formatWhatsNewDate(item.releaseDate)}
            </span>
          ) : (
            <span />
          )}

          <button type="button" className="whats-new-view-btn" onClick={() => onOpen?.(item)}>
            View Details
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}

export default WhatsNewCard;
