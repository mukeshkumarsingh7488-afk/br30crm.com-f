import { useCallback, useEffect, useState } from "react";
import { BarChart3, Plus, RefreshCw, Trash2 } from "lucide-react";
import useBusiness from "../../hooks/useBusiness";
import { createAnalyticsSnapshot, deleteAnalyticsSnapshot, getAnalyticsMetric, getAnalyticsOverview, getAnalyticsSnapshots } from "../../api/analytics.api";
import { showAuthAlert } from "../../components/auth/authAlert";

const METRICS = ["leads", "contacts", "companies", "deals", "tasks", "activities"];

const errorText = (e) => e?.response?.data?.message || e?.response?.data?.error?.message || e?.message || "Unable to load analytics.";

const unwrap = (r) => r?.data || r || {};

const dateValue = (d) => d.toISOString().slice(0, 10);

const formatDate = (v) => (v ? new Date(v).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—");

export default function Analytics() {
  const { businessId } = useBusiness();

  const today = new Date();
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  const [range, setRange] = useState({
    startDate: dateValue(monthStart),
    endDate: dateValue(today),
  });

  const [overview, setOverview] = useState({});
  const [selectedMetricValue, setSelectedMetricValue] = useState(0);
  const [series, setSeries] = useState([]);
  const [snapshots, setSnapshots] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 1,
  });

  const [metric, setMetric] = useState("leads");
  const [period, setPeriod] = useState("MONTHLY");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(
    async (page = 1) => {
      if (!businessId) return;

      setLoading(true);
      setError("");

      try {
        const [overviewResponse, metricResponse, snapshotsResponse] = await Promise.all([
          getAnalyticsOverview(businessId, range),
          getAnalyticsMetric(businessId, metric, {
            ...range,
            period,
          }),
          getAnalyticsSnapshots(businessId, {
            page,
            limit: 20,
          }),
        ]);

        const overviewData = unwrap(overviewResponse);
        const metricData = unwrap(metricResponse);
        const snapshotsData = unwrap(snapshotsResponse);

        setOverview(overviewData.overview || {});
        setSelectedMetricValue(Number(metricData.value ?? metricData.metric?.value ?? 0));
        setSeries(Array.isArray(metricData.series) ? metricData.series : []);
        setSnapshots(Array.isArray(snapshotsData.snapshots) ? snapshotsData.snapshots : []);
        setPagination(
          snapshotsData.pagination || {
            page: 1,
            total: 0,
            totalPages: 1,
          }
        );
      } catch (e) {
        setError(errorText(e));
      } finally {
        setLoading(false);
      }
    },
    [businessId, range, metric, period]
  );

  const handleRefresh = async () => {
    if (!businessId || refreshing) return;

    setRefreshing(true);
    setError("");

    try {
      await load(pagination.page || 1);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
  }, [load]);

  const createSnapshot = async () => {
    if (!businessId) return;

    try {
      setError("");

      await createAnalyticsSnapshot(businessId, {
        metric,
        period,
        startDate: range.startDate,
        endDate: range.endDate,
      });

      await load(1);

      await showAuthAlert({
        icon: "success",
        title: "Snapshot created",
        text: "Analytics snapshot saved successfully.",
        confirmButtonText: "Done",
      });
    } catch (e) {
      setError(errorText(e));
    }
  };

  const remove = async (id) => {
    const result = await showAuthAlert({
      icon: "warning",
      title: "Delete snapshot?",
      text: "This analytics snapshot will be permanently deleted.",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (!result?.isConfirmed) return;

    try {
      setError("");

      await deleteAnalyticsSnapshot(businessId, id);

      await load(pagination.page || 1);
    } catch (e) {
      setError(errorText(e));
    }
  };

  return (
    <div className="crm-analytics-page">
      <style>{`.crm-analytics-page{padding:24px 26px 40px;max-width:1550px;margin:auto;color:var(--crm-text)}.crm-analytics-head{display:flex;align-items:flex-start;justify-content:space-between;gap:15px;margin-bottom:18px}.crm-analytics-title{margin:0;font-size:25px;font-weight:400}.crm-analytics-sub{margin:6px 0 0;color:var(--crm-muted);font-size:13px}.crm-analytics-actions{display:flex;gap:7px;flex-wrap:wrap}.crm-analytics-btn{height:36px;padding:0 11px;border:1px solid var(--crm-border);border-radius:8px;background:var(--crm-surface);color:var(--crm-text);display:inline-flex;align-items:center;gap:7px;font-size:13px}.crm-analytics-btn.primary{background:var(--crm-primary);border-color:var(--crm-primary);color:#fff}.crm-analytics-btn:disabled{opacity:.6;cursor:not-allowed}.crm-analytics-filter{display:grid;grid-template-columns:1fr 1fr 1fr auto;gap:9px;padding:13px;background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:12px;margin-bottom:14px}.crm-analytics-filter input,.crm-analytics-filter select{height:36px;border:1px solid var(--crm-border);border-radius:8px;background:var(--crm-surface);color:var(--crm-text);padding:0 10px}.crm-analytics-grid{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:10px;margin-bottom:14px}.crm-analytics-stat{background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:12px;padding:14px}.crm-analytics-stat-label{color:var(--crm-muted);font-size:12px;text-transform:capitalize}.crm-analytics-stat-value{font-size:24px;margin-top:5px}.crm-analytics-stat.selected{border-color:var(--crm-primary);box-shadow:0 0 0 1px var(--crm-primary) inset}.crm-analytics-selected{margin:-4px 0 14px;color:var(--crm-muted);font-size:12px}.crm-analytics-card{background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:14px;overflow:hidden;box-shadow:var(--crm-shadow)}.crm-analytics-card-head{display:flex;justify-content:space-between;align-items:center;padding:14px 16px;border-bottom:1px solid var(--crm-border)}.crm-analytics-table{width:100%;border-collapse:collapse}.crm-analytics-table th,.crm-analytics-table td{padding:12px 14px;border-bottom:1px solid var(--crm-border);text-align:left;font-size:13px}.crm-analytics-table th{background:var(--crm-surface-2);color:var(--crm-muted);font-weight:400}.crm-analytics-icon{width:30px;height:30px;border:1px solid var(--crm-border);border-radius:8px;background:var(--crm-surface);color:var(--crm-muted);display:grid;place-items:center}.crm-analytics-icon:disabled{opacity:.5;cursor:not-allowed}.crm-analytics-empty{padding:40px;text-align:center;color:var(--crm-muted);font-size:13px}.crm-analytics-muted-cell{color:var(--crm-muted);font-size:12px}.activity-report-spin{animation:crmAnalyticsSpin 1s linear infinite}@keyframes crmAnalyticsSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}@media(max-width:1100px){.crm-analytics-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}@media(max-width:700px){.crm-analytics-page{padding:18px}.crm-analytics-head{flex-direction:column}.crm-analytics-filter{grid-template-columns:1fr 1fr}.crm-analytics-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}`}</style>

      <div className="crm-analytics-head">
        <div>
          <h1 className="crm-analytics-title">Analytics</h1>
          <p className="crm-analytics-sub">Measure CRM growth and save reporting snapshots for review.</p>
        </div>

        <div className="crm-analytics-actions">
          <button type="button" className="crm-analytics-btn" onClick={handleRefresh} disabled={refreshing || loading}>
            <RefreshCw size={14} className={refreshing ? "activity-report-spin" : ""} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>

          <button type="button" className="crm-analytics-btn primary" onClick={createSnapshot} disabled={loading || refreshing}>
            <Plus size={14} />
            Save snapshot
          </button>
        </div>
      </div>

      {error && <div style={{ marginBottom: 12, color: "var(--crm-danger)", fontSize: 13 }}>{error}</div>}

      <div className="crm-analytics-filter">
        <input
          type="date"
          value={range.startDate}
          onChange={(e) =>
            setRange((current) => ({
              ...current,
              startDate: e.target.value,
            }))
          }
        />

        <input
          type="date"
          value={range.endDate}
          onChange={(e) =>
            setRange((current) => ({
              ...current,
              endDate: e.target.value,
            }))
          }
        />

        <select value={metric} onChange={(e) => setMetric(e.target.value)}>
          {METRICS.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>

        <select value={period} onChange={(e) => setPeriod(e.target.value)}>
          <option value="DAILY">DAILY</option>
          <option value="WEEKLY">WEEKLY</option>
          <option value="MONTHLY">MONTHLY</option>
          <option value="YEARLY">YEARLY</option>
          <option value="CUSTOM">CUSTOM</option>
        </select>
      </div>

      <div className="crm-analytics-grid">
        {METRICS.map((name) => (
          <div className={`crm-analytics-stat${name === metric ? " selected" : ""}`} key={name}>
            <div className="crm-analytics-stat-label">{name}</div>

            <div className="crm-analytics-stat-value">{Number(overview?.[name] || 0).toLocaleString("en-IN")}</div>
          </div>
        ))}
      </div>

      <div className="crm-analytics-selected">
        Selected metric: <strong style={{ color: "var(--crm-text)" }}>{metric}</strong>
        {" · "}
        Current value: <strong style={{ color: "var(--crm-text)" }}>{selectedMetricValue.toLocaleString("en-IN")}</strong>
      </div>

      <div className="crm-analytics-card" style={{ marginBottom: 14 }}>
        <div className="crm-analytics-card-head">
          <div>
            <strong>{metric} trend</strong>

            <div style={{ color: "var(--crm-muted)", fontSize: 12, marginTop: 3 }}>Activity for the selected date range and period.</div>
          </div>

          <BarChart3 size={17} />
        </div>

        <div style={{ overflow: "auto" }}>
          <table className="crm-analytics-table">
            <thead>
              <tr>
                <th>Period</th>
                <th>Value</th>
              </tr>
            </thead>

            <tbody>
              {series.map((item, index) => (
                <tr key={`${String(item.periodStart)}-${index}`}>
                  <td>{formatDate(item.periodStart)}</td>

                  <td>
                    <strong>{Number(item.value || 0).toLocaleString("en-IN")}</strong>
                  </td>
                </tr>
              ))}

              {!series.length && (
                <tr>
                  <td colSpan="2" className="crm-analytics-empty">
                    No {metric} records found for the selected date range.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="crm-analytics-card">
        <div className="crm-analytics-card-head">
          <div>
            <strong>Analytics snapshots</strong>

            <div style={{ color: "var(--crm-muted)", fontSize: 12, marginTop: 3 }}>Saved point-in-time metrics across CRM modules.</div>
          </div>

          <BarChart3 size={17} />
        </div>

        <div style={{ overflow: "auto" }}>
          <table className="crm-analytics-table">
            <thead>
              <tr>
                <th>Metric</th>
                <th>Period</th>
                <th>Range</th>
                <th>Value</th>
                <th>Generated</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>
                  <strong>{metric}</strong>
                </td>

                <td>{period}</td>

                <td>
                  {formatDate(range.startDate)} — {formatDate(range.endDate)}
                </td>

                <td>
                  <strong>{selectedMetricValue.toLocaleString("en-IN")}</strong>
                </td>

                <td>Current</td>

                <td>
                  <span className="crm-analytics-muted-cell">Live</span>
                </td>
              </tr>

              {snapshots.map((item) => (
                <tr key={item._id}>
                  <td>{item.metric}</td>

                  <td>{item.period}</td>

                  <td>
                    {formatDate(item.startDate)} — {formatDate(item.endDate)}
                  </td>

                  <td>{Number(item.value || 0).toLocaleString("en-IN")}</td>

                  <td>{formatDate(item.generatedAt || item.createdAt)}</td>

                  <td>
                    <button type="button" className="crm-analytics-icon" title="Delete" onClick={() => remove(item._id)}>
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}

              {!snapshots.length && (
                <tr>
                  <td colSpan="6" className="crm-analytics-empty">
                    No saved snapshots. The current filtered metric is shown above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 7,
            padding: 12,
          }}>
          <span style={{ color: "var(--crm-muted)", fontSize: 12 }}>
            Page {pagination.page || 1} of {pagination.totalPages || 1} • {pagination.total || 0} records
          </span>

          <button type="button" className="crm-analytics-icon" disabled={refreshing || (pagination.page || 1) <= 1} onClick={() => load((pagination.page || 1) - 1)} title="Previous page">
            ‹
          </button>

          <button type="button" className="crm-analytics-icon" disabled={refreshing || (pagination.page || 1) >= (pagination.totalPages || 1)} onClick={() => load((pagination.page || 1) + 1)} title="Next page">
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
