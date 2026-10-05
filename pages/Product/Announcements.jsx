import { useCallback, useEffect, useState } from "react";
import { Bell, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";

import { getPublicAnnouncements } from "../../api/announcement.api";

import LandingNavbar from "../../components/landing/LandingNavbar";
import LandingFooter from "../../components/landing/LandingFooter";

import AnnouncementCard from "../../features/announcements/AnnouncementCard";
import AnnouncementModal from "../../features/announcements/AnnouncementModal";

function Announcements() {
  const [announcements, setAnnouncements] = useState([]);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });

  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchAnnouncements = useCallback(async (page = 1) => {
    try {
      setError("");

      if (page === 1) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      const response = await getPublicAnnouncements({
        page,
        limit: 12,
      });

      const data = response?.data || response || {};

      setAnnouncements(Array.isArray(data.announcements) ? data.announcements : []);

      setPagination({
        page: Number(data.pagination?.page) || page,
        limit: Number(data.pagination?.limit) || 12,
        total: Number(data.pagination?.total) || 0,
        totalPages: Number(data.pagination?.totalPages) || 0,
      });
    } catch (err) {
      console.error("Failed to fetch announcements:", err);

      setError(err?.response?.data?.message || err?.message || "Unable to load announcements.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAnnouncements(1);
  }, [fetchAnnouncements]);

  const handlePageChange = (nextPage) => {
    if (nextPage < 1 || (pagination.totalPages > 0 && nextPage > pagination.totalPages)) {
      return;
    }

    fetchAnnouncements(nextPage);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleRetry = () => {
    fetchAnnouncements(pagination.page || 1);
  };

  return (
    <>
      <LandingNavbar />

      <main className="announcements-page">
        <section className="announcements-hero">
          <div className="announcements-hero-icon">
            <Bell size={25} />
          </div>

          <div>
            <h1>Announcements</h1>
            <p>Stay up to date with important updates and releases.</p>
          </div>

          <button type="button" className="announcements-refresh-btn" onClick={handleRetry} disabled={loading || refreshing} aria-label="Refresh announcements">
            <RefreshCw size={17} className={refreshing ? "is-spinning" : ""} />
            Refresh
          </button>
        </section>

        {loading ? (
          <section className="announcements-grid">
            {Array.from({ length: 6 }).map((_, index) => (
              <div className="announcement-skeleton" key={index}>
                <div className="announcement-skeleton-media" />

                <div className="announcement-skeleton-content">
                  <div className="announcement-skeleton-line short" />
                  <div className="announcement-skeleton-line" />
                  <div className="announcement-skeleton-line" />
                  <div className="announcement-skeleton-line medium" />
                </div>
              </div>
            ))}
          </section>
        ) : error ? (
          <section className="announcements-state">
            <div className="announcements-state-icon">
              <RefreshCw size={24} />
            </div>

            <h2>Unable to load announcements</h2>
            <p>{error}</p>

            <button type="button" onClick={handleRetry} className="announcements-primary-btn">
              Try Again
            </button>
          </section>
        ) : announcements.length === 0 ? (
          <section className="announcements-state">
            <div className="announcements-state-icon">
              <Bell size={24} />
            </div>

            <h2>No announcements yet</h2>
            <p>Important updates and releases will appear here.</p>
          </section>
        ) : (
          <>
            <section className="announcements-grid">
              {announcements.map((announcement) => (
                <AnnouncementCard key={announcement._id || announcement.slug} announcement={announcement} onOpen={setSelectedAnnouncement} />
              ))}
            </section>

            {pagination.totalPages > 1 ? (
              <nav className="announcements-pagination" aria-label="Announcements pagination">
                <button type="button" disabled={pagination.page <= 1} onClick={() => handlePageChange(pagination.page - 1)} aria-label="Previous page">
                  <ChevronLeft size={18} />
                </button>

                <span>
                  Page {pagination.page} of {pagination.totalPages}
                </span>

                <button type="button" disabled={pagination.page >= pagination.totalPages} onClick={() => handlePageChange(pagination.page + 1)} aria-label="Next page">
                  <ChevronRight size={18} />
                </button>
              </nav>
            ) : null}
          </>
        )}
      </main>

      <AnnouncementModal announcement={selectedAnnouncement} onClose={() => setSelectedAnnouncement(null)} />

      <LandingFooter />

      <style>{`
.announcements-page{width:100%;max-width:1240px;margin:0 auto;padding:100px 24px 60px;box-sizing:border-box}.announcements-hero{display:flex;align-items:center;gap:16px;margin-bottom:30px}.announcements-hero-icon{width:52px;height:52px;border-radius:14px;display:flex;align-items:center;justify-content:center;background:#2563eb;color:#fff;flex:0 0 auto}.announcements-hero h1{margin:0;font-size:30px;line-height:1.2;color:#111827}.announcements-hero p{margin:6px 0 0;color:#6b7280}.announcements-refresh-btn{margin-left:auto;height:40px;padding:0 14px;border:1px solid #e5e7eb;border-radius:9px;background:#fff;color:#111827;display:flex;align-items:center;gap:8px;cursor:pointer}.announcements-refresh-btn:disabled{opacity:.6;cursor:not-allowed}.is-spinning{animation:announcementSpin .8s linear infinite}@keyframes announcementSpin{to{transform:rotate(360deg)}}.announcements-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}.announcement-card{overflow:hidden;border:1px solid #e5e7eb;border-radius:16px;background:#fff;box-shadow:0 4px 16px rgba(0,0,0,.04);transition:transform .2s ease,box-shadow .2s ease}.announcement-card:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,.08)}.announcement-card-media{width:100%;height:190px;background:#f3f4f6;overflow:hidden}.announcement-card-media img,.announcement-card-media video{width:100%;height:100%;object-fit:cover;display:block}.announcement-card-body{padding:20px}.announcement-card-meta{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:12px}.announcement-type{display:inline-flex;align-items:center;gap:5px;font-size:13px;font-weight:400;padding:5px 9px;border-radius:999px;background:#f3f4f6;color:#374151}.announcement-version{font-size:13px;color:#6b7280}.announcement-card h3{margin:0 0 9px;font-size:19px;line-height:1.35;color:#111827}.announcement-card p{margin:0;color:#6b7280;line-height:1.6;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}.announcement-tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:13px}.announcement-tags span,.announcement-modal-tags span{font-size:13px;padding:4px 8px;border-radius:999px;background:#f3f4f6;color:#6b7280}.announcement-card-footer{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:20px}.announcement-date{display:flex;align-items:center;gap:6px;font-size:13px;color:#6b7280}.announcement-view-btn{border:0;background:none;padding:0;display:flex;align-items:center;gap:4px;font-weight:400;color:#2563eb;cursor:pointer}.announcements-state{min-height:300px;border:1px dashed #cbd5e1;border-radius:16px;background:#fff;display:flex;align-items:center;justify-content:center;flex-direction:column;text-align:center;padding:30px}.announcements-state-icon{width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:#e5e7eb;color:#111827;margin-bottom:14px}.announcements-state h2{margin:0 0 7px;color:#111827}.announcements-state p{margin:0 0 18px;color:#6b7280}.announcements-primary-btn{height:40px;padding:0 16px;border:0;border-radius:9px;background:#2563eb;color:#fff;cursor:pointer}.announcements-pagination{display:flex;align-items:center;justify-content:center;gap:16px;margin-top:30px}.announcements-pagination button{width:38px;height:38px;border:1px solid #e5e7eb;border-radius:9px;background:#fff;color:#111827;display:flex;align-items:center;justify-content:center;cursor:pointer}.announcements-pagination button:disabled{opacity:.45;cursor:not-allowed}.announcements-pagination span{font-size:14px;color:#6b7280}.announcement-skeleton{border:1px solid #e5e7eb;border-radius:16px;overflow:hidden;background:#fff}.announcement-skeleton-media{height:190px;background:#f3f4f6}.announcement-skeleton-content{padding:20px}.announcement-skeleton-line{height:13px;border-radius:7px;background:#f3f4f6;margin-bottom:12px}.announcement-skeleton-line.short{width:35%}.announcement-skeleton-line.medium{width:70%}html.dark .announcements-page,body.dark .announcements-page,[data-theme="dark"] .announcements-page,[data-mode="dark"] .announcements-page{color:#fff}html.dark .announcements-hero h1,body.dark .announcements-hero h1,[data-theme="dark"] .announcements-hero h1,[data-mode="dark"] .announcements-hero h1{color:#fff!important}html.dark .announcements-hero p,body.dark .announcements-hero p,[data-theme="dark"] .announcements-hero p,[data-mode="dark"] .announcements-hero p{color:#9ca3af!important}html.dark .announcements-refresh-btn,body.dark .announcements-refresh-btn,[data-theme="dark"] .announcements-refresh-btn,[data-mode="dark"] .announcements-refresh-btn{background:#111827!important;border-color:#374151!important;color:#fff!important}html.dark .announcement-card,body.dark .announcement-card,[data-theme="dark"] .announcement-card,[data-mode="dark"] .announcement-card{background:#111827!important;border-color:#374151!important}html.dark .announcement-card h3,body.dark .announcement-card h3,[data-theme="dark"] .announcement-card h3,[data-mode="dark"] .announcement-card h3{color:#fff!important}html.dark .announcement-card p,body.dark .announcement-card p,[data-theme="dark"] .announcement-card p,[data-mode="dark"] .announcement-card p{color:#9ca3af!important}html.dark .announcement-type,body.dark .announcement-type,[data-theme="dark"] .announcement-type,[data-mode="dark"] .announcement-type{background:#1f2937!important;color:#e5e7eb!important}html.dark .announcement-tags span,body.dark .announcement-tags span,[data-theme="dark"] .announcement-tags span,[data-mode="dark"] .announcement-tags span{background:#1f2937!important;color:#9ca3af!important}html.dark .announcements-state,body.dark .announcements-state,[data-theme="dark"] .announcements-state,[data-mode="dark"] .announcements-state{background:#111827!important;border-color:#374151!important}html.dark .announcements-state-icon,body.dark .announcements-state-icon,[data-theme="dark"] .announcements-state-icon,[data-mode="dark"] .announcements-state-icon{background:#1f2937!important;color:#fff!important}html.dark .announcements-state h2,body.dark .announcements-state h2,[data-theme="dark"] .announcements-state h2,[data-mode="dark"] .announcements-state h2{color:#fff!important}html.dark .announcements-state p,body.dark .announcements-state p,[data-theme="dark"] .announcements-state p,[data-mode="dark"] .announcements-state p{color:#9ca3af!important}html.dark .announcements-pagination button,body.dark .announcements-pagination button,[data-theme="dark"] .announcements-pagination button,[data-mode="dark"] .announcements-pagination button{background:#111827!important;border-color:#374151!important;color:#fff!important}@media(max-width:1000px){.announcements-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:650px){.announcements-page{padding:88px 15px 45px}.announcements-hero{align-items:flex-start;flex-wrap:wrap}.announcements-refresh-btn{margin-left:68px}.announcements-grid{grid-template-columns:1fr}.announcements-hero h1{font-size:25px}.announcement-card-media{height:200px}}
`}</style>
    </>
  );
}

export default Announcements;
