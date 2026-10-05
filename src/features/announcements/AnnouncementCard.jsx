import { CalendarDays, ChevronRight, Megaphone } from "lucide-react";

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
    month: "short",
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

function AnnouncementCard({ announcement, onOpen }) {
  if (!announcement) return null;

  const youtubeUrl = announcement.mediaType === "VIDEO" ? getYouTubeEmbedUrl(announcement.videoUrl) : null;

  const directVideo = announcement.mediaType === "VIDEO" && announcement.videoUrl && isDirectVideoUrl(announcement.videoUrl);

  return (
    <>
      <article className="announcement-card">
        {announcement.mediaType === "IMAGE" && announcement.imageUrl ? (
          <div className="announcement-card-media">
            <img src={announcement.imageUrl} alt={announcement.title || "Announcement"} loading="lazy" />
          </div>
        ) : announcement.mediaType === "VIDEO" && youtubeUrl ? (
          <div className="announcement-card-media">
            <iframe src={youtubeUrl} title={announcement.title || "Announcement video"} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
          </div>
        ) : announcement.mediaType === "VIDEO" && directVideo ? (
          <div className="announcement-card-media">
            <video src={announcement.videoUrl} poster={announcement.videoThumbnailUrl || undefined} playsInline controls preload="metadata" />
          </div>
        ) : null}

        <div className="announcement-card-body">
          <div className="announcement-card-meta">
            <span className="announcement-type">
              <Megaphone size={14} />
              {typeLabel(announcement.type)}
            </span>

            {announcement.version ? <span className="announcement-version">v{announcement.version}</span> : null}

            {announcement.isFeatured ? <span className="announcement-featured">Featured</span> : null}
          </div>

          <h3>{announcement.title}</h3>

          {announcement.shortDescription ? <p>{announcement.shortDescription}</p> : null}

          {Array.isArray(announcement.tags) && announcement.tags.length > 0 ? (
            <div className="announcement-tags">
              {announcement.tags.slice(0, 4).map((tag, index) => (
                <span key={`${tag}-${index}`}>{tag}</span>
              ))}
            </div>
          ) : null}

          <div className="announcement-card-footer">
            {announcement.releaseDate ? (
              <span className="announcement-date">
                <CalendarDays size={15} />
                {formatDate(announcement.releaseDate)}
              </span>
            ) : (
              <span />
            )}

            <button type="button" className="announcement-view-btn" onClick={() => onOpen?.(announcement)}>
              Read More
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </article>

      <style>{`
        .announcement-card {
          width: 100%;
          max-width: 400px;
          min-width: 0;
          overflow: hidden;
          border-radius: 16px;
          box-sizing: border-box;
        }

        .announcement-card-media {
          width: 100%;
          aspect-ratio: 16 / 9;
          overflow: hidden;
          background: #000;
          position: relative;
        }

        .announcement-card-media img,
        .announcement-card-media video,
        .announcement-card-media iframe {
          display: block;
          width: 100%;
          height: 100%;
          min-width: 0;
          min-height: 0;
          border: 0;
          object-fit: cover;
        }

        .announcement-card-media iframe {
          position: absolute;
          inset: 0;
        }

        .announcement-card-body {
          min-width: 0;
          box-sizing: border-box;
        }

        .announcement-card-body h3 {
          overflow-wrap: anywhere;
        }

        .announcement-card-body p {
          overflow-wrap: anywhere;
        }

        .announcement-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          min-width: 0;
        }

        .announcement-date {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          min-width: 0;
          white-space: nowrap;
        }

        .announcement-view-btn {
          flex-shrink: 0;
        }

        @media (max-width: 600px) {
          .announcement-card {
            max-width: 100%;
            border-radius: 14px;
          }

          .announcement-card-media {
            aspect-ratio: 16 / 9;
          }

          .announcement-card-footer {
            gap: 8px;
          }
        }
      `}</style>
    </>
  );
}

export default AnnouncementCard;
