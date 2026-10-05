import { useEffect } from "react";
import { createPortal } from "react-dom";
import { CalendarDays, ExternalLink, X } from "lucide-react";

const typeLabel = (type) => {
  const labels = {
    NEW_FEATURE: "New Feature",
    IMPROVEMENT: "Improvement",
    UPDATE: "Update",
    FIX: "Fix",
    SECURITY: "Security",
    MAINTENANCE: "Maintenance",
    RELEASE: "Release",
  };

  return labels[type] || type || "Announcement";
};

const formatDate = (date) => {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;

  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("youtube.com")) {
      if (parsed.pathname === "/watch") {
        const videoId = parsed.searchParams.get("v");

        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }

      if (parsed.pathname.startsWith("/shorts/")) {
        const videoId = parsed.pathname.split("/shorts/")[1]?.split("/")[0];

        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }

      if (parsed.pathname.startsWith("/embed/")) {
        return url;
      }
    }

    if (parsed.hostname === "youtu.be") {
      const videoId = parsed.pathname.replace("/", "").split("/")[0];

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }
  } catch (error) {
    return null;
  }

  return null;
};

const isDirectVideoUrl = (url) => {
  if (!url) return false;

  return /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(url);
};

function AnnouncementModal({ announcement, onClose }) {
  useEffect(() => {
    if (!announcement) return undefined;

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
  }, [announcement, onClose]);

  if (!announcement) return null;

  const youtubeUrl = announcement.mediaType === "VIDEO" ? getYouTubeEmbedUrl(announcement.videoUrl) : null;

  const directVideo = announcement.mediaType === "VIDEO" && announcement.videoUrl && isDirectVideoUrl(announcement.videoUrl);

  const handleCTA = () => {
    if (!announcement.ctaUrl) return;

    const url = announcement.ctaUrl.trim();

    if (/^https?:\/\//i.test(url)) {
      window.open(url, "_blank", "noopener,noreferrer");
      return;
    }

    window.location.href = url;
  };

  const modalContent = (
    <>
      <div
        className="announcement-modal-overlay"
        role="presentation"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            onClose?.();
          }
        }}>
        <div className="announcement-modal" role="dialog" aria-modal="true" aria-labelledby="announcement-modal-title">
          <button type="button" className="announcement-modal-close" onClick={onClose} aria-label="Close announcement">
            <X size={20} />
          </button>

          {announcement.mediaType === "IMAGE" && announcement.imageUrl ? (
            <div className="announcement-modal-media">
              <img src={announcement.imageUrl} alt={announcement.title || "Announcement"} />
            </div>
          ) : announcement.mediaType === "VIDEO" && youtubeUrl ? (
            <div className="announcement-modal-media">
              <iframe src={youtubeUrl} title={announcement.title || "Announcement video"} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
            </div>
          ) : announcement.mediaType === "VIDEO" && directVideo ? (
            <div className="announcement-modal-media">
              <video src={announcement.videoUrl} poster={announcement.videoThumbnailUrl || undefined} playsInline controls preload="metadata" />
            </div>
          ) : null}

          <div className="announcement-modal-content">
            <div className="announcement-modal-meta">
              <span>{typeLabel(announcement.type)}</span>

              {announcement.version ? <span>v{announcement.version}</span> : null}

              {announcement.releaseDate ? (
                <span className="announcement-modal-date">
                  <CalendarDays size={14} />
                  {formatDate(announcement.releaseDate)}
                </span>
              ) : null}
            </div>

            <h2 id="announcement-modal-title">{announcement.title}</h2>

            {announcement.shortDescription ? <p className="announcement-modal-short">{announcement.shortDescription}</p> : null}

            {announcement.description ? (
              <div className="announcement-modal-section">
                <h3>Details</h3>
                <p>{announcement.description}</p>
              </div>
            ) : null}

            {Array.isArray(announcement.tags) && announcement.tags.length > 0 ? (
              <div className="announcement-modal-section">
                <h3>Tags</h3>

                <div className="announcement-modal-tags">
                  {announcement.tags.map((tag, index) => (
                    <span key={`${tag}-${index}`}>{tag}</span>
                  ))}
                </div>
              </div>
            ) : null}

            {announcement.ctaText && announcement.ctaUrl ? (
              <button type="button" className="announcement-modal-action" onClick={handleCTA}>
                {announcement.ctaText}
                <ExternalLink size={16} />
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <style>{`
        .announcement-modal-overlay {
          position: fixed !important;
          inset: 0 !important;
          width: 100vw;
          height: 100dvh;
          z-index: 999999 !important;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          box-sizing: border-box;
          background: rgba(0, 0, 0, 0.68);
          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);
          overflow-y: auto;
        }

        .announcement-modal {
          position: relative;
          width: min(920px, 100%);
          max-width: 920px;
          max-height: calc(100dvh - 48px);
          margin: auto;
          overflow-x: hidden;
          overflow-y: auto;
          border-radius: 20px;
          box-sizing: border-box;
          background: var(--announcement-modal-bg, #ffffff);
          color: var(--announcement-modal-text, #111827);
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.35);
        }

        .announcement-modal-close {
          position: absolute;
          top: 14px;
          right: 14px;
          z-index: 20;
          width: 42px;
          height: 42px;
          border: 1px solid rgba(0, 0, 0, 0.12);
          border-radius: 12px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          background: rgba(255, 255, 255, 0.96);
          color: #111827;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
        }

        .announcement-modal-close:hover {
          transform: translateY(-1px);
        }

        .announcement-modal-media {
          width: 100%;
          aspect-ratio: 16 / 9;
          overflow: hidden;
          background: #000;
        }

        .announcement-modal-media img,
        .announcement-modal-media video,
        .announcement-modal-media iframe {
          display: block;
          width: 100%;
          height: 100%;
          border: 0;
          object-fit: cover;
        }

        .announcement-modal-media iframe {
          background: #000;
        }

        .announcement-modal-content {
          padding: 28px 30px 32px;
          box-sizing: border-box;
        }

        .announcement-modal-meta {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 14px;
        }

        .announcement-modal-meta > span {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 6px 10px;
          border-radius: 8px;
          background: rgba(37, 99, 235, 0.08);
          color: #2563eb;
          font-size: 13px;
          font-weight: 400;
        }

        .announcement-modal-date {
          white-space: nowrap;
        }

        .announcement-modal-content h2 {
          margin: 0;
          font-size: clamp(24px, 3vw, 34px);
          line-height: 1.2;
          overflow-wrap: anywhere;
        }

        .announcement-modal-short {
          margin: 12px 0 0;
          color: #64748b;
          font-size: 16px;
          line-height: 1.65;
          overflow-wrap: anywhere;
        }

        .announcement-modal-section {
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid rgba(100, 116, 139, 0.18);
        }

        .announcement-modal-section h3 {
          margin: 0 0 10px;
          font-size: 15px;
        }

        .announcement-modal-section p {
          margin: 0;
          color: #64748b;
          line-height: 1.75;
          white-space: pre-wrap;
          overflow-wrap: anywhere;
        }

        .announcement-modal-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .announcement-modal-tags span {
          padding: 6px 10px;
          border-radius: 8px;
          background: rgba(100, 116, 139, 0.1);
          color: #64748b;
          font-size: 13px;
        }

        .announcement-modal-action {
          margin-top: 24px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 44px;
          padding: 0 18px;
          border: 0;
          border-radius: 10px;
          background: #2563eb;
          color: #ffffff;
          font-weight: 400;
          cursor: pointer;
        }

        .announcement-modal-action:hover {
          filter: brightness(1.08);
        }

        @media (prefers-color-scheme: dark) {
          .announcement-modal {
            --announcement-modal-bg: #111827;
            --announcement-modal-text: #f8fafc;
            box-shadow: 0 30px 90px rgba(0, 0, 0, 0.65);
          }

          .announcement-modal-close {
            background: #1e293b;
            color: #f8fafc;
            border-color: rgba(255, 255, 255, 0.12);
          }

          .announcement-modal-short,
          .announcement-modal-section p {
            color: #94a3b8;
          }

          .announcement-modal-section {
            border-top-color: rgba(148, 163, 184, 0.18);
          }

          .announcement-modal-tags span {
            background: rgba(148, 163, 184, 0.12);
            color: #94a3b8;
          }
        }

        @media (max-width: 700px) {
          .announcement-modal-overlay {
            padding: 12px;
            align-items: center;
          }

          .announcement-modal {
            width: 100%;
            max-height: calc(100dvh - 24px);
            border-radius: 16px;
          }

          .announcement-modal-close {
            top: 10px;
            right: 10px;
            width: 38px;
            height: 38px;
          }

          .announcement-modal-content {
            padding: 22px 18px 24px;
          }

          .announcement-modal-media {
            aspect-ratio: 16 / 9;
          }
        }
      `}</style>
    </>
  );

  return createPortal(modalContent, document.body);
}

export default AnnouncementModal;
