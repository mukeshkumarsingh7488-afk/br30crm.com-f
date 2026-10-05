import { useCallback, useEffect, useState } from "react";

import { ChevronLeft, ChevronRight, RefreshCw, Sparkles } from "lucide-react";

import { getPublicWhatsNew } from "../../api/whatsNew.api";

import LandingNavbar from "../../components/landing/LandingNavbar";
import LandingFooter from "../../components/landing/LandingFooter";

import WhatsNewCard from "../../features/whats-new/WhatsNewCard";
import WhatsNewModal from "../../features/whats-new/WhatsNewModal";

import { normalizeWhatsNewResponse } from "../../features/whats-new/whatsNew.utils";

function WhatsNew() {
  const [items, setItems] = useState([]);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });

  const [selectedItem, setSelectedItem] = useState(null);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const fetchWhatsNew = useCallback(async (page = 1) => {
    try {
      setError("");

      if (page === 1) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      const response = await getPublicWhatsNew({
        page,
        limit: 12,
      });

      const normalized = normalizeWhatsNewResponse(response);

      setItems(normalized.items);

      setPagination(normalized.pagination);
    } catch (err) {
      console.error("Failed to fetch What's New:", err);

      setError(err?.response?.data?.message || err?.message || "Unable to load What's New.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchWhatsNew(1);
  }, [fetchWhatsNew]);

  const handlePageChange = (nextPage) => {
    if (nextPage < 1 || (pagination.totalPages > 0 && nextPage > pagination.totalPages)) {
      return;
    }

    fetchWhatsNew(nextPage);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleRetry = () => {
    fetchWhatsNew(pagination.page || 1);
  };

  return (
    <>
      <LandingNavbar />
      <main className="whats-new-page">
        <section className="whats-new-hero">
          <div className="whats-new-hero-copy">
            <div className="whats-new-hero-icon">
              <Sparkles size={23} />
            </div>

            <div>
              <span className="whats-new-eyebrow">PRODUCT UPDATES</span>

              <h1>What's New</h1>

              <p>Discover the latest features, improvements and updates.</p>
            </div>
          </div>

          <button type="button" className="whats-new-refresh-btn" onClick={handleRetry} disabled={loading || refreshing}>
            <RefreshCw size={16} className={refreshing ? "is-spinning" : ""} />

            {refreshing ? "Refreshing" : "Refresh"}
          </button>
        </section>

        {loading ? (
          <section className="whats-new-grid">
            {Array.from({
              length: 6,
            }).map((_, index) => (
              <div className="whats-new-skeleton" key={index}>
                <div className="whats-new-skeleton-media" />

                <div className="whats-new-skeleton-content">
                  <div className="whats-new-skeleton-line short" />
                  <div className="whats-new-skeleton-line" />
                  <div className="whats-new-skeleton-line" />
                  <div className="whats-new-skeleton-line medium" />
                </div>
              </div>
            ))}
          </section>
        ) : error ? (
          <section className="whats-new-state">
            <div className="whats-new-state-icon">
              <RefreshCw size={23} />
            </div>

            <h2>Unable to load What's New</h2>

            <p>{error}</p>

            <button type="button" onClick={handleRetry} className="whats-new-primary-btn">
              Try Again
            </button>
          </section>
        ) : items.length === 0 ? (
          <section className="whats-new-state">
            <div className="whats-new-state-icon">
              <Sparkles size={23} />
            </div>

            <h2>No updates yet</h2>

            <p>New features and improvements will appear here.</p>
          </section>
        ) : (
          <>
            <section className="whats-new-grid">
              {items.map((item) => (
                <WhatsNewCard key={item._id || item.slug} item={item} onOpen={setSelectedItem} />
              ))}
            </section>

            {pagination.totalPages > 1 ? (
              <nav className="whats-new-pagination" aria-label="What's New pagination">
                <button type="button" disabled={pagination.page <= 1} onClick={() => handlePageChange(pagination.page - 1)}>
                  <ChevronLeft size={17} />
                </button>

                <span>
                  <strong>{pagination.page}</strong>
                  <span> / {pagination.totalPages}</span>
                </span>

                <button type="button" disabled={pagination.page >= pagination.totalPages} onClick={() => handlePageChange(pagination.page + 1)}>
                  <ChevronRight size={17} />
                </button>
              </nav>
            ) : null}
          </>
        )}
      </main>

      <WhatsNewModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      <LandingFooter />
      <style>{`
        .whats-new-page{width:100%;max-width:1260px;margin:0 auto;padding:100px 26px 70px;box-sizing:border-box}.whats-new-hero{display:flex;align-items:center;justify-content:space-between;gap:25px;margin-bottom:34px}.whats-new-hero-copy{display:flex;align-items:center;gap:16px}.whats-new-hero-icon{width:50px;height:50px;border-radius:15px;display:flex;align-items:center;justify-content:center;background:var(--admin-primary,#2563eb);color:#fff;box-shadow:0 10px 25px rgba(37,99,235,.2)}.whats-new-eyebrow{display:block;margin-bottom:5px;font-size:13px;letter-spacing:.12em;font-weight:400;color:var(--admin-primary,#2563eb)}.whats-new-hero h1{margin:0;font-size:31px;line-height:1.15;color:var(--admin-text,#111827)}html.dark .whats-new-hero h1,body.dark .whats-new-hero h1,[data-theme="dark"] .whats-new-hero h1,[data-mode="dark"] .whats-new-hero h1{color:#fff!important}.whats-new-hero p{margin:6px 0 0;color:var(--admin-text-muted,#6b7280);font-size:14px}.whats-new-refresh-btn{height:41px;padding:0 14px;border:1px solid var(--admin-border,#e5e7eb);border-radius:10px;background:var(--admin-surface,#fff);color:var(--admin-text,#111827);display:flex;align-items:center;gap:8px;font-size:13px;font-weight:400;cursor:pointer;transition:.2s}.whats-new-refresh-btn:hover:not(:disabled){border-color:var(--admin-primary,#2563eb);color:var(--admin-primary,#2563eb)}.whats-new-refresh-btn:disabled{opacity:.55;cursor:not-allowed}.is-spinning{animation:whatsNewSpin .75s linear infinite}@keyframes whatsNewSpin{to{transform:rotate(360deg)}}.whats-new-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:22px}.whats-new-card{overflow:hidden;border:1px solid var(--admin-border,#e5e7eb);border-radius:19px;background:var(--admin-surface,#fff);box-shadow:0 5px 24px rgba(15,23,42,.045);transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease}.whats-new-card:hover{transform:translateY(-4px);box-shadow:0 15px 38px rgba(15,23,42,.1);border-color:rgba(37,99,235,.18)}.whats-new-card-media{height:205px;background:var(--admin-surface-2,#f3f4f6);overflow:hidden}.whats-new-card-media img{width:100%;height:100%;display:block;object-fit:cover}.whats-new-card-video{position:relative;width:100%;height:100%}.whats-new-card-video iframe{width:100%;height:100%;border:0;display:block}.whats-new-video-badge{position:absolute;right:11px;bottom:11px;padding:6px 9px;border-radius:8px;background:rgba(0,0,0,.65);backdrop-filter:blur(5px);color:#fff;font-size:13px;font-weight:400;display:flex;align-items:center;gap:5px}.whats-new-card-no-media{height:100%;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:7px;color:var(--admin-primary,#2563eb);background:linear-gradient(135deg,var(--admin-primary-soft,#eff6ff),var(--admin-surface-2,#f3f4f6));font-size:13px;font-weight:400}.whats-new-card-body{padding:20px}.whats-new-card-meta{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:12px}.whats-new-type{display:inline-flex;align-items:center;gap:5px;font-size:13px;font-weight:400;padding:5px 9px;border-radius:999px;background:var(--admin-surface-2,#f3f4f6)}.whats-new-type-new{background:#eff6ff;color:#2563eb}.whats-new-type-improvement{background:#ecfdf5;color:#059669}.whats-new-type-fix{background:#fff7ed;color:#ea580c}.whats-new-type-upcoming{background:#f5f3ff;color:#7c3aed}.whats-new-version{font-size:13px;color:var(--admin-text-muted,#6b7280)}.whats-new-card h3{margin:0 0 9px;font-size:19px;line-height:1.35;color:var(--admin-text,#111827)}.whats-new-card p{margin:0;color:var(--admin-text-muted,#6b7280);font-size:13px;line-height:1.65;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}.whats-new-card-footer{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:20px}.whats-new-date{display:flex;align-items:center;gap:6px;font-size:13px;color:var(--admin-text-muted,#6b7280)}.whats-new-view-btn{border:0;background:none;padding:0;display:flex;align-items:center;gap:4px;font-size:13px;font-weight:400;color:var(--admin-primary,#2563eb);cursor:pointer}.whats-new-state{min-height:320px;border:1px dashed var(--admin-border,#d1d5db);border-radius:19px;display:flex;align-items:center;justify-content:center;flex-direction:column;text-align:center;padding:30px}.whats-new-state-icon{width:48px;height:48px;border-radius:14px;display:flex;align-items:center;justify-content:center;background:var(--admin-primary-soft,#eff6ff);color:var(--admin-primary,#2563eb);margin-bottom:14px}.whats-new-state h2{margin:0 0 7px;font-size:20px}.whats-new-state p{margin:0 0 18px;color:var(--admin-text-muted,#6b7280);font-size:13px}.whats-new-primary-btn{height:40px;padding:0 16px;border:0;border-radius:9px;background:var(--admin-primary,#2563eb);color:#fff;font-size:13px;font-weight:400;cursor:pointer}.whats-new-pagination{display:flex;align-items:center;justify-content:center;gap:13px;margin-top:32px}.whats-new-pagination button{width:39px;height:39px;border:1px solid var(--admin-border,#e5e7eb);border-radius:10px;background:var(--admin-surface,#fff);color:var(--admin-text,#111827);display:flex;align-items:center;justify-content:center;cursor:pointer}.whats-new-pagination button:hover:not(:disabled){border-color:var(--admin-primary,#2563eb);color:var(--admin-primary,#2563eb)}.whats-new-pagination button:disabled{opacity:.4;cursor:not-allowed}.whats-new-pagination span{font-size:13px;color:var(--admin-text-muted,#6b7280)}.whats-new-pagination strong{color:var(--admin-text,#111827)}.whats-new-skeleton{border:1px solid var(--admin-border,#e5e7eb);border-radius:19px;overflow:hidden;background:var(--admin-surface,#fff)}.whats-new-skeleton-media{height:205px;background:var(--admin-surface-2,#f3f4f6)}.whats-new-skeleton-content{padding:20px}.whats-new-skeleton-line{height:12px;border-radius:7px;background:var(--admin-surface-2,#f3f4f6);margin-bottom:12px}.whats-new-skeleton-line.short{width:35%}.whats-new-skeleton-line.medium{width:70%}@media(max-width:1000px){.whats-new-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:650px){.whats-new-page{padding:88px 15px 48px}.whats-new-hero{align-items:flex-start;flex-direction:column}.whats-new-hero-copy{align-items:flex-start}.whats-new-refresh-btn{width:100%;justify-content:center}.whats-new-grid{grid-template-columns:1fr}.whats-new-hero h1{font-size:26px}.whats-new-card-media{height:210px}}
      `}</style>
    </>
  );
}

export default WhatsNew;
