import { useCallback, useEffect, useState } from "react";
import { AlertCircle, LoaderCircle, ShieldAlert } from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";

import { getAdminOverview } from "../../api/admin.api";
import AdminLayout from "../../components/admin/AdminLayout";

function AdminPanel() {
  const navigate = useNavigate();

  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOverview = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminOverview();

      if (!response?.success) {
        throw new Error(response?.message || "Unable to load admin dashboard.");
      }

      const data = response?.data || {};

      setOverview(data);
    } catch (err) {
      console.error("Admin overview error:", err);

      const status = err?.response?.status;

      if (status === 401) {
        navigate("/", { replace: true });
        return;
      }

      if (status === 403) {
        setError("You do not have Master Admin access.");
        return;
      }

      if (status === 429) {
        setError("Too many requests. Please wait a moment and try again.");
        return;
      }

      setError(err?.response?.data?.message || err?.message || "Unable to load Admin Panel.");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="admin-page-loading">
          <div className="admin-loading-icon">
            <LoaderCircle className="admin-loading-spinner" size={34} />
          </div>

          <h2>Loading Admin Panel</h2>

          <p>Verifying Master Admin access and loading dashboard data...</p>

          <div className="admin-loading-bar">
            <span />
          </div>
        </div>
      );
    }

    if (error && !overview) {
      const accessDenied = error.includes("Master Admin");

      return (
        <div className="admin-access-error">
          <div className="admin-access-error-card">
            <div className="admin-access-error-icon">{accessDenied ? <ShieldAlert size={31} /> : <AlertCircle size={31} />}</div>

            <span className="admin-access-error-label">{accessDenied ? "SECURITY" : "SYSTEM ERROR"}</span>

            <h2>{accessDenied ? "Access Denied" : "Admin Panel Error"}</h2>

            <p>{error}</p>

            <div className="admin-access-error-actions">
              <button type="button" className="admin-retry-btn" onClick={loadOverview}>
                Try Again
              </button>

              <button type="button" className="admin-back-btn" onClick={() => navigate("/dashboard")}>
                Back to CRM
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <Outlet
        context={{
          overview,
          loading,
          error,
          reloadOverview: loadOverview,
        }}
      />
    );
  };

  return (
    <AdminLayout>
      {renderContent()}

      <style>{`
.admin-page-loading{min-height:calc(100vh - 70px);display:flex;align-items:center;justify-content:center;flex-direction:column;text-align:center;padding:30px;box-sizing:border-box;color:var(--admin-text);background:var(--admin-bg);}
.admin-loading-icon{width:68px;height:68px;border:1px solid var(--admin-border);border-radius:18px;background:var(--admin-surface);display:flex;align-items:center;justify-content:center;box-shadow:var(--admin-shadow-sm);}
.admin-loading-spinner{color:var(--admin-primary);animation:adminLoadingSpin 1s linear infinite;}
.admin-page-loading h2{margin:18px 0 7px;font-size:22px;font-weight:400;color:var(--admin-text);}
.admin-page-loading p{max-width:440px;margin:0;color:var(--admin-muted);font-size:13px;line-height:1.6;}
.admin-loading-bar{width:min(260px,80vw);height:4px;margin-top:20px;border-radius:20px;overflow:hidden;background:var(--admin-surface-3);}
.admin-loading-bar span{display:block;width:40%;height:100%;border-radius:20px;background:var(--admin-primary);animation:adminLoadingBar 1.2s ease-in-out infinite;}
.admin-access-error{min-height:calc(100vh - 70px);display:flex;align-items:center;justify-content:center;padding:30px;box-sizing:border-box;background:var(--admin-bg);color:var(--admin-text);}
.admin-access-error-card{width:min(520px,100%);padding:34px;border:1px solid var(--admin-border);border-radius:20px;background:var(--admin-surface);box-shadow:var(--admin-shadow-md);text-align:center;}
.admin-access-error-icon{width:68px;height:68px;margin:0 auto 16px;border-radius:18px;display:flex;align-items:center;justify-content:center;background:var(--admin-danger-bg);color:var(--admin-danger);}
.admin-access-error-label{display:inline-flex;font-size:13px;font-weight:400;letter-spacing:.1em;color:var(--admin-danger);margin-bottom:8px;}
.admin-access-error h2{margin:0 0 9px;font-size:24px;font-weight:400;color:var(--admin-text);}
.admin-access-error p{max-width:430px;margin:0 auto;color:var(--admin-muted);font-size:13px;line-height:1.65;}
.admin-access-error-actions{display:flex;align-items:center;justify-content:center;gap:9px;margin-top:24px;}
.admin-retry-btn,.admin-back-btn{height:41px;padding:0 16px;border-radius:10px;display:inline-flex;align-items:center;justify-content:center;gap:7px;font-size:13px;font-weight:400;cursor:pointer;}
.admin-retry-btn{border:1px solid var(--admin-primary);background:var(--admin-primary);color:#fff;}
.admin-retry-btn:hover{background:var(--admin-primary-hover);border-color:var(--admin-primary-hover);}
.admin-back-btn{border:1px solid var(--admin-border);background:var(--admin-surface);color:var(--admin-text);}
.admin-back-btn:hover{background:var(--admin-surface-2);border-color:var(--admin-border-strong);}
@keyframes adminLoadingSpin{to{transform:rotate(360deg);}}
@keyframes adminLoadingBar{0%{transform:translateX(-120%);}100%{transform:translateX(350%);}}
@media(max-width:520px){.admin-access-error{padding:18px;}.admin-access-error-card{padding:25px 18px;border-radius:16px;}.admin-access-error h2{font-size:21px;}.admin-access-error-actions{flex-direction:column;width:100%;}.admin-retry-btn,.admin-back-btn{width:100%;}}
@media(prefers-reduced-motion:reduce){.admin-loading-spinner,.admin-loading-bar span{animation:none;}}
`}</style>
    </AdminLayout>
  );
}

export default AdminPanel;
