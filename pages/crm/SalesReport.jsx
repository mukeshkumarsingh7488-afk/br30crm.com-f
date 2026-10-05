import { useEffect, useMemo, useState } from "react";

import { Activity, BarChart3, CalendarDays, CircleDollarSign, Filter, RefreshCw, Search, Target, TrendingUp, Trophy, X, ChevronDown } from "lucide-react";

import { showAuthAlert } from "../../components/auth/authAlert";
import useBusiness from "../../hooks/useBusiness";

import { getSalesReport } from "../../api/report.api";

const getErrorMessage = (err, fallback = "Something went wrong.") => {
  const data = err?.response?.data;

  if (Array.isArray(data?.errors) && data.errors.length) {
    return data.errors
      .map((item) => item?.msg || item?.message || String(item))
      .filter(Boolean)
      .join("\n");
  }

  if (Array.isArray(data?.details) && data.details.length) {
    return data.details
      .map((item) => item?.message || item?.msg || String(item))
      .filter(Boolean)
      .join("\n");
  }

  if (Array.isArray(data?.message)) {
    return data.message.filter(Boolean).join("\n");
  }

  if (typeof data?.message === "string" && data.message.trim()) {
    return data.message;
  }

  if (typeof err?.message === "string" && err.message.trim()) {
    return err.message;
  }

  return fallback;
};

const formatDate = (value) => {
  if (!value) return "—";

  try {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
};

const formatMonth = (value) => {
  if (!value) return "—";

  const parts = String(value).split("-");

  if (parts.length !== 2) return value;

  const year = Number(parts[0]);
  const month = Number(parts[1]);

  if (!year || !month) return value;

  try {
    return new Date(year, month - 1, 1).toLocaleDateString("en-IN", {
      month: "short",
      year: "numeric",
    });
  } catch {
    return value;
  }
};

const formatNumber = (value) => {
  const number = Number(value) || 0;

  return number.toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  });
};

const formatCurrency = (value, currency = "INR") => {
  const number = Number(value) || 0;
  const normalizedCurrency = String(currency || "INR").toUpperCase();

  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: normalizedCurrency,
      maximumFractionDigits: 0,
    }).format(number);
  } catch {
    return `${normalizedCurrency} ${formatNumber(number)}`;
  }
};

const getInitials = (name = "") => {
  const value = String(name || "").trim();

  if (!value) return "—";

  const parts = value.split(/\s+/).filter(Boolean);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

const getStatusClass = (status) => {
  const normalized = String(status || "").toUpperCase();

  if (normalized === "WON") return "won";
  if (normalized === "LOST") return "lost";

  return "open";
};

const getStatusLabel = (status) => {
  const normalized = String(status || "").toUpperCase();

  if (normalized === "WON") return "WON";
  if (normalized === "LOST") return "LOST";
  if (normalized === "OPEN") return "OPEN";

  return normalized || "OPEN";
};

const StatCard = ({ title, value, detail, icon: Icon, tone = "" }) => (
  <article className="sales-stat">
    <div className="sales-stat-content">
      <div className="sales-stat-copy">
        <div className="sales-stat-title">{title}</div>
        <div className="sales-stat-value">{value}</div>
        <div className="sales-stat-detail">{detail}</div>
      </div>

      <div className={`sales-stat-icon ${tone}`}>
        <Icon size={18} />
      </div>
    </div>
  </article>
);

const EmptyState = ({ title, text }) => (
  <div className="sales-empty">
    <div className="sales-empty-icon">
      <BarChart3 size={22} />
    </div>

    <div className="sales-empty-title">{title}</div>

    <div className="sales-empty-text">{text}</div>
  </div>
);

export default function SalesReport() {
  const { businessId, loading: businessLoading, error: businessError } = useBusiness();

  const [report, setReport] = useState(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [statusFilter, setStatusFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");

  const [showFilters, setShowFilters] = useState(false);

  const [visibleRows, setVisibleRows] = useState(50);

  const loadSalesReport = async ({ silent = false, customFilters = {} } = {}) => {
    if (!businessId) return;

    if (silent) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const params = {
        dateFrom: customFilters.dateFrom !== undefined ? customFilters.dateFrom : dateFrom,

        dateTo: customFilters.dateTo !== undefined ? customFilters.dateTo : dateTo,

        status: customFilters.status !== undefined ? customFilters.status : statusFilter,

        source: customFilters.source !== undefined ? customFilters.source : sourceFilter,
      };

      Object.keys(params).forEach((key) => {
        if (params[key] === "" || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });

      const response = await getSalesReport(businessId, params);

      const data = response?.data || response || {};

      setReport({
        summary: data?.summary || {},
        byStatus: Array.isArray(data?.byStatus) ? data.byStatus : [],
        bySource: Array.isArray(data?.bySource) ? data.bySource : [],
        monthly: Array.isArray(data?.monthly) ? data.monthly : [],
        currencies: Array.isArray(data?.currencies) ? data.currencies : [],
        rows: Array.isArray(data?.rows) ? data.rows : [],
        filters: data?.filters || {},
      });

      setVisibleRows(50);
    } catch (err) {
      const message = getErrorMessage(err, "Unable to load sales report.");

      setError(message);

      if (!silent) {
        await showAuthAlert({
          icon: "error",
          title: "Unable to load sales report",
          text: message,
          confirmButtonText: "OK",
        });
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (businessId) {
      loadSalesReport();
    }
  }, [businessId]);

  const summary = report?.summary || {};

  const sourceOptions = useMemo(() => {
    return Array.from(new Set((report?.bySource || []).map((item) => String(item?.source || "").trim()).filter(Boolean))).sort((a, b) => a.localeCompare(b));
  }, [report]);

  const filteredRows = useMemo(() => {
    const rows = Array.isArray(report?.rows) ? report.rows : [];

    const query = String(search || "")
      .trim()
      .toLowerCase();

    if (!query) return rows;

    return rows.filter((deal) => {
      const assignedName = deal?.assignedTo?.name || deal?.assignedTo?.email || "";

      const companyName = deal?.companyId?.name || "";

      const contactName = deal?.contactId?.name || "";

      return [deal?.name, deal?.source, deal?.status, deal?.currency, assignedName, companyName, contactName].some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(query)
      );
    });
  }, [report, search]);

  const displayedRows = useMemo(() => {
    return filteredRows.slice(0, visibleRows);
  }, [filteredRows, visibleRows]);

  const maxMonthlyValue = useMemo(() => {
    return Math.max(1, ...(report?.monthly || []).map((item) => Number(item?.wonRevenue || item?.value || 0)));
  }, [report]);

  const maxSourceValue = useMemo(() => {
    return Math.max(1, ...(report?.bySource || []).map((item) => Number(item?.value || 0)));
  }, [report]);

  const hasActiveFilters = Boolean(dateFrom) || Boolean(dateTo) || Boolean(statusFilter) || Boolean(sourceFilter);

  const clearFilters = async () => {
    setDateFrom("");
    setDateTo("");
    setStatusFilter("");
    setSourceFilter("");
    setSearch("");

    await loadSalesReport({
      silent: false,
      customFilters: {
        dateFrom: "",
        dateTo: "",
        status: "",
        source: "",
      },
    });
  };

  const applyFilters = async () => {
    await loadSalesReport({
      silent: false,
    });
  };

  const handleRefresh = async () => {
    await loadSalesReport({
      silent: true,
    });
  };

  const validateDates = async () => {
    if (dateFrom && dateTo && dateFrom > dateTo) {
      await showAuthAlert({
        icon: "warning",
        title: "Invalid date range",
        text: "From date cannot be later than To date.",
        confirmButtonText: "OK",
      });

      return false;
    }

    return true;
  };

  const handleApply = async () => {
    const valid = await validateDates();

    if (!valid) return;

    await applyFilters();
  };

  const tableRows = displayedRows;

  return (
    <div className="crm-resource-page sales-report-page">
      <style>{`
.sales-report-page{padding:24px 26px 40px;max-width:1550px;margin:auto;color:var(--crm-text);min-width:0}
.sales-report-head{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:18px;min-width:0}
.sales-report-heading{min-width:0}
.sales-report-title{font-size:23px;line-height:1.2;font-weight:400;margin:0;color:var(--crm-text)}
.sales-report-sub{font-size:13px;color:var(--crm-muted);margin:5px 0 0;line-height:1.5}
.sales-report-actions{display:flex;gap:9px;align-items:center;flex-shrink:0}
.sales-btn{height:38px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:9px;padding:0 13px;display:inline-flex;align-items:center;justify-content:center;gap:7px;font-size:13px;font-weight:400;cursor:pointer;white-space:nowrap}
.sales-btn:hover:not(:disabled){filter:brightness(.98)}
.sales-btn:disabled{opacity:.55;cursor:not-allowed}
.sales-btn.primary{background:var(--crm-primary);border-color:var(--crm-primary);color:#fff}
.sales-btn.danger{color:var(--crm-danger)}
.sales-btn svg{flex-shrink:0}
.sales-stats{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:14px;margin-bottom:14px}
.sales-stat{background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:15px;padding:11px 14px;box-shadow:var(--crm-shadow);min-width:0}
.sales-stat-content{display:flex;align-items:center;justify-content:space-between;gap:10px;min-height:70px}
.sales-stat-copy{min-width:0}
.sales-stat-title{font-size:13px;color:var(--crm-muted);font-weight:400;line-height:1.2}
.sales-stat-value{font-size:21px;line-height:1.05;letter-spacing:-.4px;font-weight:400;color:var(--crm-text);margin:5px 0 3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.sales-stat-detail{font-size:13px;color:var(--crm-muted);line-height:1.2}
.sales-stat-icon{width:36px;height:36px;flex:0 0 36px;border-radius:10px;background:var(--crm-primary-soft);color:var(--crm-primary);display:grid;place-items:center}
.sales-stat-icon.green{background:color-mix(in srgb,var(--crm-success) 11%,transparent);color:var(--crm-success)}
.sales-stat-icon.orange{background:color-mix(in srgb,var(--crm-warning) 12%,transparent);color:var(--crm-warning)}
.sales-stat-icon.danger{background:color-mix(in srgb,var(--crm-danger) 10%,transparent);color:var(--crm-danger)}
.sales-stat-icon.blue{background:color-mix(in srgb,var(--crm-primary) 10%,transparent);color:var(--crm-primary)}
.sales-error{margin-bottom:14px;border:1px solid color-mix(in srgb,var(--crm-danger) 24%,var(--crm-border));background:color-mix(in srgb,var(--crm-danger) 6%,var(--crm-surface));color:var(--crm-danger);border-radius:10px;padding:10px 12px;font-size:13px;line-height:1.5}
.sales-toolbar{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:14px;min-width:0}
.sales-search-wrap{position:relative;width:100%;max-width:390px;min-width:0}
.sales-search-icon{position:absolute;left:11px;top:50%;transform:translateY(-50%);color:var(--crm-muted);pointer-events:none}
.sales-search{width:100%;height:38px;border:1px solid var(--crm-border);border-radius:9px;background:var(--crm-surface);color:var(--crm-text);padding:0 36px 0 34px;font-size:13px;outline:0}
.sales-search:focus{border-color:var(--crm-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--crm-primary) 9%,transparent)}
.sales-search::placeholder{color:var(--crm-muted)}
.sales-search-clear{position:absolute;right:7px;top:50%;transform:translateY(-50%);width:25px;height:25px;border:0;border-radius:7px;background:transparent;color:var(--crm-muted);display:grid;place-items:center;cursor:pointer}
.sales-search-clear:hover{color:var(--crm-text)}
.sales-filter-toggle{height:38px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:9px;padding:0 11px;display:inline-flex;align-items:center;gap:7px;font-size:13px;font-weight:400;cursor:pointer}
.sales-filter-toggle.active{color:var(--crm-primary);border-color:color-mix(in srgb,var(--crm-primary) 35%,var(--crm-border));background:color-mix(in srgb,var(--crm-primary) 5%,var(--crm-surface))}
.sales-filter-count{min-width:17px;height:17px;border-radius:50%;display:inline-grid;place-items:center;background:var(--crm-primary);color:#fff;font-size:13px;font-weight:400}
.sales-filter-panel{width:100%;background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:12px;padding:12px;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;box-shadow:var(--crm-shadow);margin-bottom:14px}
.sales-field{min-width:0}
.sales-field-label{display:block;color:var(--crm-muted);font-size:13px;font-weight:400;margin:0 0 5px}
.sales-input,.sales-select{width:100%;height:36px;border:1px solid var(--crm-border);border-radius:8px;background:var(--crm-surface);color:var(--crm-text);padding:0 10px;font-size:13px;outline:0}
.sales-input:focus,.sales-select:focus{border-color:var(--crm-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--crm-primary) 8%,transparent)}
.sales-filter-actions{grid-column:1/-1;display:flex;justify-content:flex-end;gap:8px;padding-top:2px}
.sales-content-grid{display:grid;grid-template-columns:minmax(0,1.7fr) minmax(300px,1fr);gap:14px;margin-bottom:14px}
.sales-panel{background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:15px;box-shadow:var(--crm-shadow);min-width:0;overflow:hidden}
.sales-panel-head{min-height:56px;padding:12px 15px;border-bottom:1px solid var(--crm-border);display:flex;align-items:center;justify-content:space-between;gap:10px}
.sales-panel-heading{min-width:0}
.sales-panel-title{margin:0;font-size:13px;line-height:1.2;font-weight:400;color:var(--crm-text)}
.sales-panel-sub{margin:4px 0 0;color:var(--crm-muted);font-size:13px;line-height:1.3}
.sales-panel-body{padding:14px}
.sales-chart{display:flex;align-items:flex-end;gap:10px;height:210px;overflow-x:auto;padding:8px 2px 0}
.sales-chart-item{min-width:62px;flex:1 0 62px;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:7px}
.sales-chart-value{font-size:13px;color:var(--crm-muted);font-weight:400;white-space:nowrap}
.sales-chart-track{width:28px;height:145px;border-radius:8px;background:var(--crm-surface-2);display:flex;align-items:flex-end;overflow:hidden}
.sales-chart-bar{width:100%;min-height:4px;border-radius:8px;background:var(--crm-primary);transition:height .2s ease}
.sales-chart-label{font-size:13px;color:var(--crm-muted);white-space:nowrap}
.sales-source-list{display:flex;flex-direction:column;gap:12px}
.sales-source-item{min-width:0}
.sales-source-top{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:6px}
.sales-source-name{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px;font-weight:400;color:var(--crm-text)}
.sales-source-value{flex-shrink:0;color:var(--crm-muted);font-size:13px;font-weight:400}
.sales-source-track{width:100%;height:7px;border-radius:20px;background:var(--crm-surface-2);overflow:hidden}
.sales-source-bar{height:100%;border-radius:20px;background:var(--crm-primary)}
.sales-source-meta{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:4px;font-size:13px;color:var(--crm-muted)}
.sales-status-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px}
.sales-status-card{border:1px solid var(--crm-border);border-radius:10px;padding:10px;background:var(--crm-surface-2);min-width:0}
.sales-status-name{display:flex;align-items:center;gap:5px;font-size:13px;font-weight:400;color:var(--crm-muted)}
.sales-status-dot{width:6px;height:6px;border-radius:50%;background:var(--crm-muted)}
.sales-status-dot.won{background:var(--crm-success)}
.sales-status-dot.lost{background:var(--crm-danger)}
.sales-status-dot.open{background:var(--crm-warning)}
.sales-status-number{margin-top:6px;color:var(--crm-text);font-size:19px;line-height:1;font-weight:400}
.sales-status-label{margin-top:4px;color:var(--crm-muted);font-size:13px}
.sales-table-panel{overflow:hidden}
.sales-table-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:13px 15px;border-bottom:1px solid var(--crm-border)}
.sales-table-count{color:var(--crm-muted);font-size:13px;white-space:nowrap}
.sales-table-scroll{width:100%;max-height:480px;overflow-y:auto;overflow-x:auto;scrollbar-width:thin}
.sales-table-scroll::-webkit-scrollbar{width:7px;height:7px}
.sales-table-scroll::-webkit-scrollbar-track{background:var(--crm-surface-2)}
.sales-table-scroll::-webkit-scrollbar-thumb{background:var(--crm-border);border-radius:10px}
.sales-table{width:100%;min-width:1040px;border-collapse:separate;border-spacing:0}
.sales-table th{position:sticky;top:0;z-index:3;background:var(--crm-surface-2);color:var(--crm-muted);font-size:13px;font-weight:400;text-align:left;padding:10px 12px;border-bottom:1px solid var(--crm-border);white-space:nowrap}
.sales-table td{padding:11px 12px;border-bottom:1px solid var(--crm-border);color:var(--crm-text);font-size:13px;vertical-align:middle;background:var(--crm-surface)}
.sales-table tbody tr:hover td{background:var(--crm-surface-2)}
.sales-deal{display:flex;align-items:center;gap:9px;min-width:180px}
.sales-deal-avatar{width:30px;height:30px;flex:0 0 30px;border-radius:8px;background:var(--crm-primary-soft);color:var(--crm-primary);display:grid;place-items:center;font-size:13px;font-weight:400}
.sales-deal-copy{min-width:0}
.sales-deal-name{font-size:13px;font-weight:400;color:var(--crm-text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:230px}
.sales-deal-meta{color:var(--crm-muted);font-size:13px;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:230px}
.sales-status-badge{display:inline-flex;align-items:center;padding:4px 7px;border-radius:7px;font-size:13px;font-weight:400}
.sales-status-badge.won{background:color-mix(in srgb,var(--crm-success) 11%,transparent);color:var(--crm-success)}
.sales-status-badge.lost{background:color-mix(in srgb,var(--crm-danger) 10%,transparent);color:var(--crm-danger)}
.sales-status-badge.open{background:color-mix(in srgb,var(--crm-warning) 11%,transparent);color:var(--crm-warning)}
.sales-value{font-weight:400;white-space:nowrap}
.sales-muted{color:var(--crm-muted)}
.sales-assignee{display:flex;align-items:center;gap:6px;min-width:130px}
.sales-assignee-avatar{width:24px;height:24px;border-radius:7px;background:var(--crm-surface-2);color:var(--crm-text);display:grid;place-items:center;font-size:13px;font-weight:400}
.sales-assignee-name{font-size:13px;font-weight:400;max-width:125px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.sales-pagination{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:11px 14px;border-top:1px solid var(--crm-border);color:var(--crm-muted);font-size:13px}
.sales-load-more{height:30px;padding:0 10px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:7px;font-size:13px;font-weight:400;cursor:pointer}
.sales-load-more:hover{background:var(--crm-surface-2)}
.sales-empty{min-height:210px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:25px}
.sales-empty-icon{width:44px;height:44px;border-radius:12px;background:var(--crm-primary-soft);color:var(--crm-primary);display:grid;place-items:center;margin-bottom:10px}
.sales-empty-title{font-size:13px;font-weight:400;color:var(--crm-text)}
.sales-empty-text{max-width:390px;margin-top:5px;font-size:13px;line-height:1.5;color:var(--crm-muted)}
.sales-loading{min-height:180px;display:grid;place-items:center;color:var(--crm-muted);font-size:13px}
.sales-loading-spinner{width:24px;height:24px;border:2px solid var(--crm-border);border-top-color:var(--crm-primary);border-radius:50%;animation:salesSpin .75s linear infinite}
@keyframes salesSpin{to{transform:rotate(360deg)}
}
@media(max-width:1200px){
.sales-stats{grid-template-columns:repeat(3,minmax(0,1fr))}
.sales-content-grid{grid-template-columns:1fr}
}
@media(max-width:900px){
.sales-stats{grid-template-columns:repeat(2,minmax(0,1fr))}
.sales-filter-panel{grid-template-columns:repeat(2,minmax(0,1fr))}
}
@media(max-width:700px){
.sales-report-page{padding:18px 14px 30px}
.sales-report-head{align-items:flex-start;flex-direction:column}
.sales-report-actions{width:100%}
.sales-report-actions .sales-btn{flex:1}
.sales-stats{grid-template-columns:1fr 1fr;gap:10px}
.sales-stat{padding:10px}
.sales-stat-value{font-size:18px}
.sales-filter-panel{grid-template-columns:1fr}
.sales-filter-actions{justify-content:stretch}
.sales-filter-actions .sales-btn{flex:1}
.sales-search-wrap{max-width:none}
.sales-toolbar{align-items:stretch}
.sales-filter-toggle{width:100%;justify-content:center}
.sales-status-grid{grid-template-columns:1fr}
.sales-panel-head{align-items:flex-start;flex-direction:column}
.sales-pagination{align-items:flex-start;flex-direction:column}
}
@media(max-width:460px){
.sales-stats{grid-template-columns:1fr}
}
      `}</style>

      <div className="sales-report-head">
        <div className="sales-report-heading">
          <h1 className="sales-report-title">Sales Report</h1>

          <p className="sales-report-sub">Track revenue, pipeline value, deal performance and sales trends across your BR30 CRM business workspace.</p>
        </div>

        <div className="sales-report-actions">
          <button type="button" className="sales-btn" onClick={handleRefresh} disabled={loading || refreshing || businessLoading || !businessId}>
            <RefreshCw size={15} className={refreshing ? "sales-refresh-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {(error || businessError) && <div className="sales-error">{error || businessError}</div>}

      <div className="sales-toolbar">
        <div className="sales-search-wrap">
          <Search size={15} className="sales-search-icon" />

          <input type="text" className="sales-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search deals, source, company, contact..." />

          {search && (
            <button type="button" className="sales-search-clear" onClick={() => setSearch("")} aria-label="Clear search">
              <X size={13} />
            </button>
          )}
        </div>

        <button type="button" className={`sales-filter-toggle ${showFilters || hasActiveFilters ? "active" : ""}`} onClick={() => setShowFilters((current) => !current)}>
          <Filter size={14} />
          Filters
          {hasActiveFilters && <span className="sales-filter-count">{[dateFrom, dateTo, statusFilter, sourceFilter].filter(Boolean).length}</span>}
          <ChevronDown
            size={13}
            style={{
              transform: showFilters ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform .15s ease",
            }}
          />
        </button>
      </div>

      {showFilters && (
        <div className="sales-filter-panel">
          <div className="sales-field">
            <label className="sales-field-label">From date</label>

            <input type="date" className="sales-input" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} />
          </div>

          <div className="sales-field">
            <label className="sales-field-label">To date</label>

            <input type="date" className="sales-input" value={dateTo} onChange={(event) => setDateTo(event.target.value)} />
          </div>

          <div className="sales-field">
            <label className="sales-field-label">Deal status</label>

            <select className="sales-select" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="">All statuses</option>
              <option value="OPEN">Open</option>
              <option value="WON">Won</option>
              <option value="LOST">Lost</option>
            </select>
          </div>

          <div className="sales-field">
            <label className="sales-field-label">Sales source</label>

            <select className="sales-select" value={sourceFilter} onChange={(event) => setSourceFilter(event.target.value)}>
              <option value="">All sources</option>

              {sourceOptions.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>
          </div>

          <div className="sales-filter-actions">
            <button type="button" className="sales-btn" onClick={clearFilters} disabled={!hasActiveFilters && !search}>
              <X size={14} />
              Clear Filters
            </button>

            <button type="button" className="sales-btn primary" onClick={handleApply} disabled={loading}>
              <Filter size={14} />
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {loading && !report ? (
        <div className="sales-panel">
          <div className="sales-loading">
            <div>
              <div className="sales-loading-spinner" />
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="sales-stats">
            <StatCard title="Total Deal Value" value={formatCurrency(summary.totalValue, report?.currencies?.[0]?.currency || "INR")} detail={`${formatNumber(summary.totalDeals)} total deals`} icon={CircleDollarSign} tone="blue" />

            <StatCard title="Won Revenue" value={formatCurrency(summary.wonRevenue, report?.currencies?.[0]?.currency || "INR")} detail={`${formatNumber(summary.wonDeals)} won deals`} icon={Trophy} tone="green" />

            <StatCard title="Open Pipeline" value={formatCurrency(summary.openPipeline, report?.currencies?.[0]?.currency || "INR")} detail={`${formatNumber(summary.openDeals)} open deals`} icon={TrendingUp} tone="orange" />

            <StatCard title="Lost Value" value={formatCurrency(summary.lostValue, report?.currencies?.[0]?.currency || "INR")} detail={`${formatNumber(summary.lostDeals)} lost deals`} icon={Activity} tone="danger" />

            <StatCard title="Avg. Deal Value" value={formatCurrency(summary.averageDealValue, report?.currencies?.[0]?.currency || "INR")} detail={`Weighted pipeline ${formatCurrency(summary.weightedPipeline, report?.currencies?.[0]?.currency || "INR")}`} icon={Target} tone="blue" />
          </div>

          <div className="sales-content-grid">
            <section className="sales-panel">
              <div className="sales-panel-head">
                <div className="sales-panel-heading">
                  <h2 className="sales-panel-title">Sales Trend</h2>

                  <p className="sales-panel-sub">Monthly deal value and won revenue performance.</p>
                </div>

                <CalendarDays size={16} color="var(--crm-muted)" />
              </div>

              <div className="sales-panel-body">
                {report?.monthly?.length ? (
                  <div className="sales-chart">
                    {report.monthly.map((item) => {
                      const value = Number(item?.wonRevenue || item?.value || 0);

                      const height = Math.max(4, Math.min(100, (value / maxMonthlyValue) * 100));

                      return (
                        <div className="sales-chart-item" key={item?.month}>
                          <div className="sales-chart-value">{formatCurrency(value, report?.currencies?.[0]?.currency || "INR")}</div>

                          <div className="sales-chart-track">
                            <div
                              className="sales-chart-bar"
                              style={{
                                height: `${height}%`,
                              }}
                              title={formatCurrency(value, report?.currencies?.[0]?.currency || "INR")}
                            />
                          </div>

                          <div className="sales-chart-label">{formatMonth(item?.month)}</div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <EmptyState title="No sales trend available" text="There is not enough deal data for the selected filters." />
                )}
              </div>
            </section>

            <section className="sales-panel">
              <div className="sales-panel-head">
                <div className="sales-panel-heading">
                  <h2 className="sales-panel-title">Sales by Source</h2>

                  <p className="sales-panel-sub">Deal value grouped by acquisition source.</p>
                </div>

                <BarChart3 size={16} color="var(--crm-muted)" />
              </div>

              <div className="sales-panel-body">
                {report?.bySource?.length ? (
                  <div className="sales-source-list">
                    {report.bySource.slice(0, 8).map((item) => {
                      const value = Number(item?.value) || 0;

                      const width = Math.max(3, Math.min(100, (value / maxSourceValue) * 100));

                      return (
                        <div className="sales-source-item" key={item?.source}>
                          <div className="sales-source-top">
                            <div className="sales-source-name">{item?.source || "Unknown"}</div>

                            <div className="sales-source-value">{formatCurrency(value, report?.currencies?.[0]?.currency || "INR")}</div>
                          </div>

                          <div className="sales-source-track">
                            <div
                              className="sales-source-bar"
                              style={{
                                width: `${width}%`,
                              }}
                            />
                          </div>

                          <div className="sales-source-meta">
                            <span>{formatNumber(item?.deals)} deals</span>

                            <span>Won: {formatCurrency(item?.wonRevenue, report?.currencies?.[0]?.currency || "INR")}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <EmptyState title="No source data" text="Sales source information is not available for the selected data." />
                )}
              </div>
            </section>
          </div>

          <section className="sales-panel" style={{ marginBottom: "14px" }}>
            <div className="sales-panel-head">
              <div className="sales-panel-heading">
                <h2 className="sales-panel-title">Deal Status</h2>

                <p className="sales-panel-sub">Current distribution of your sales pipeline.</p>
              </div>
            </div>

            <div className="sales-panel-body">
              <div className="sales-status-grid">
                {["WON", "OPEN", "LOST"].map((status) => {
                  const item = (report?.byStatus || []).find((entry) => String(entry?.status || "").toUpperCase() === status);

                  const count = Number(item?.deals) || 0;

                  return (
                    <div className="sales-status-card" key={status}>
                      <div className="sales-status-name">
                        <span className={`sales-status-dot ${getStatusClass(status)}`} />

                        {getStatusLabel(status)}
                      </div>

                      <div className="sales-status-number">{formatNumber(count)}</div>

                      <div className="sales-status-label">deals</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="sales-panel sales-table-panel">
            <div className="sales-table-head">
              <div className="sales-panel-heading">
                <h2 className="sales-panel-title">Sales Details</h2>

                <p className="sales-panel-sub">Detailed deal-level sales records.</p>
              </div>

              <div className="sales-table-count">
                Showing {formatNumber(tableRows.length)} of {formatNumber(filteredRows.length)}
              </div>
            </div>

            {tableRows.length ? (
              <>
                <div className="sales-table-scroll">
                  <table className="sales-table">
                    <thead>
                      <tr>
                        <th>DEAL</th>
                        <th>VALUE</th>
                        <th>STATUS</th>
                        <th>PROBABILITY</th>
                        <th>SOURCE</th>
                        <th>EXPECTED CLOSE</th>
                        <th>ASSIGNED TO</th>
                        <th>CREATED</th>
                      </tr>
                    </thead>

                    <tbody>
                      {tableRows.map((deal, index) => {
                        const dealName = deal?.name || "Unnamed Deal";

                        const assignedName = deal?.assignedTo?.name || deal?.assignedTo?.email || "Unassigned";

                        const companyName = deal?.companyId?.name || "";

                        return (
                          <tr key={deal?._id || `${dealName}-${index}`}>
                            <td>
                              <div className="sales-deal">
                                <div className="sales-deal-avatar">{getInitials(dealName)}</div>

                                <div className="sales-deal-copy">
                                  <div className="sales-deal-name" title={dealName}>
                                    {dealName}
                                  </div>

                                  <div className="sales-deal-meta" title={companyName}>
                                    {companyName || deal?.contactId?.name || "No company/contact"}
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td>
                              <span className="sales-value">{formatCurrency(deal?.value, deal?.currency || "INR")}</span>
                            </td>

                            <td>
                              <span className={`sales-status-badge ${getStatusClass(deal?.status)}`}>{getStatusLabel(deal?.status)}</span>
                            </td>

                            <td>
                              <span className="sales-muted">{formatNumber(deal?.probability)}%</span>
                            </td>

                            <td>
                              <span className="sales-muted">{deal?.source || "Unknown"}</span>
                            </td>

                            <td>
                              <span className="sales-muted">{formatDate(deal?.expectedCloseDate)}</span>
                            </td>

                            <td>
                              <div className="sales-assignee">
                                <div className="sales-assignee-avatar">{getInitials(assignedName)}</div>

                                <div className="sales-assignee-name" title={assignedName}>
                                  {assignedName}
                                </div>
                              </div>
                            </td>

                            <td>
                              <span className="sales-muted">{formatDate(deal?.createdAt)}</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {visibleRows < filteredRows.length && (
                  <div className="sales-pagination">
                    <span>More sales records are available.</span>

                    <button type="button" className="sales-load-more" onClick={() => setVisibleRows((current) => current + 50)}>
                      Load More
                    </button>
                  </div>
                )}
              </>
            ) : (
              <EmptyState title={search || hasActiveFilters ? "No matching sales" : "No sales data yet"} text={search || hasActiveFilters ? "Try changing your search or clearing the active filters." : "Once deals are created in your CRM, their sales performance will appear here."} />
            )}
          </section>
        </>
      )}
    </div>
  );
}
