import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Activity, ArrowDown, ArrowUp, BarChart3, CalendarDays, CheckCircle2, ChevronDown, ChevronUp, CircleDollarSign, Clock3, Download, Filter, Loader2, RefreshCw, Search, Target, TrendingUp, Trophy, UserRound, X, XCircle } from "lucide-react";
import * as XLSX from "xlsx";
import { getDealsReport } from "../../api/report.api";
import useBusiness from "../../hooks/useBusiness";
import { showAuthAlert } from "../../components/auth/authAlert";

const formatNumber = (value) => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "0";
  }

  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 1,
  }).format(number);
};

const formatCurrency = (value, currency = "INR") => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return `${currency || "INR"} 0`;
  }

  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency || "INR",
      maximumFractionDigits: 0,
    }).format(number);
  } catch {
    return `${currency || "INR"} ${formatNumber(number)}`;
  }
};

const formatCompactCurrency = (value, currency = "INR") => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return `${currency || "INR"} 0`;
  }

  if (Math.abs(number) >= 10000000) {
    return `${currency || "INR"} ${(number / 10000000).toFixed(1)}Cr`;
  }

  if (Math.abs(number) >= 100000) {
    return `${currency || "INR"} ${(number / 100000).toFixed(1)}L`;
  }

  if (Math.abs(number) >= 1000) {
    return `${currency || "INR"} ${(number / 1000).toFixed(1)}K`;
  }

  return `${currency || "INR"} ${formatNumber(number)}`;
};

const formatPercent = (value) => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "0%";
  }

  return `${number.toFixed(1)}%`;
};

const formatDate = (value) => {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatMonth = (value) => {
  if (!value) {
    return "—";
  }

  const parts = String(value).split("-");

  if (parts.length !== 2) {
    return String(value);
  }

  const year = Number(parts[0]);
  const month = Number(parts[1]);

  if (!year || !month) {
    return String(value);
  }

  const date = new Date(year, month - 1, 1);

  return date.toLocaleDateString("en-IN", {
    month: "short",
    year: "numeric",
  });
};

const statusLabel = (value) => {
  if (!value) {
    return "Unknown";
  }

  return String(value)
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const normalizeResponse = (response) => {
  const root = response?.data ?? response ?? {};

  if (root?.data && typeof root.data === "object") {
    return root.data;
  }

  return root;
};

const getErrorMessage = (error, fallback = "Unable to load deals report.") => {
  const data = error?.response?.data;

  if (Array.isArray(data?.details) && data.details.length) {
    return data.details
      .map((item) => item?.message || item?.msg || String(item))
      .filter(Boolean)
      .join("\n");
  }

  if (Array.isArray(data?.errors) && data.errors.length) {
    return data.errors
      .map((item) => item?.message || item?.msg || String(item))
      .filter(Boolean)
      .join("\n");
  }

  if (typeof data?.message === "string" && data.message.trim()) {
    return data.message;
  }

  if (typeof error?.message === "string" && error.message.trim()) {
    return error.message;
  }

  return fallback;
};

const escapeCsvValue = (value) => {
  const stringValue = value === null || value === undefined ? "" : String(value);

  return `"${stringValue.replace(/"/g, '""')}"`;
};

const DealsReport = () => {
  const { businessId, loading: businessLoading, error: businessError } = useBusiness();

  const [report, setReport] = useState(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [statusFilter, setStatusFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  const [search, setSearch] = useState("");

  const [showFilters, setShowFilters] = useState(false);

  const [activeSection, setActiveSection] = useState("overview");

  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");

  const [visibleRows, setVisibleRows] = useState(50);

  useEffect(() => {
    if (businessError && !businessId && !businessLoading) {
      setError(businessError || "Unable to load your business workspace.");
    }
  }, [businessError, businessId, businessLoading]);

  const showErrorAlert = useCallback(async (message) => {
    await showAuthAlert({
      icon: "error",
      title: "Unable to load deals report",
      text: message || "Something went wrong while loading the deals report.",
      confirmButtonText: "OK",
    });
  }, []);

  const loadReport = useCallback(
    async (options = {}) => {
      const silent = options.silent === true;
      const customFilters = options.customFilters || {};

      if (businessLoading) {
        return;
      }

      if (!businessId) {
        setLoading(false);
        setRefreshing(false);
        setError(businessError || "Business information is not available.");
        return;
      }

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
          assignedTo: customFilters.assignedTo !== undefined ? customFilters.assignedTo : assignedTo,
        };

        Object.keys(params).forEach((key) => {
          if (params[key] === "" || params[key] === null || params[key] === undefined) {
            delete params[key];
          }
        });

        const response = await getDealsReport(businessId, params);

        const data = normalizeResponse(response);

        setReport({
          filters: data?.filters || {},
          summary: data?.summary || {},
          byStatus: Array.isArray(data?.byStatus) ? data.byStatus : [],
          bySource: Array.isArray(data?.bySource) ? data.bySource : [],
          monthly: Array.isArray(data?.monthly) ? data.monthly : [],
          currencies: Array.isArray(data?.currencies) ? data.currencies : [],
          rows: Array.isArray(data?.rows) ? data.rows : [],
        });

        setVisibleRows(50);
      } catch (err) {
        const message = getErrorMessage(err, "Unable to load deals report.");

        setError(message);

        if (!silent) {
          await showErrorAlert(message);
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [businessId, businessLoading, businessError, dateFrom, dateTo, statusFilter, sourceFilter, assignedTo, showErrorAlert]
  );

  useEffect(() => {
    if (businessId && !businessLoading) {
      loadReport();
    }
  }, [businessId, businessLoading]);

  const summary = report?.summary || {};

  const rows = Array.isArray(report?.rows) ? report.rows : [];

  const byStatus = Array.isArray(report?.byStatus) ? report.byStatus : [];

  const bySource = Array.isArray(report?.bySource) ? report.bySource : [];

  const monthly = Array.isArray(report?.monthly) ? report.monthly : [];

  const currencies = Array.isArray(report?.currencies) ? report.currencies : [];

  const sourceOptions = useMemo(() => {
    return Array.from(new Set(bySource.map((item) => String(item?.source || "").trim()).filter(Boolean))).sort((a, b) => a.localeCompare(b));
  }, [bySource]);

  const assignedUserOptions = useMemo(() => {
    const map = new Map();

    rows.forEach((deal) => {
      const user = deal?.assignedTo;

      if (!user) {
        return;
      }

      const id = user?._id || user?.id;

      if (!id) {
        return;
      }

      const name = user?.name || user?.email || "Unknown User";

      map.set(String(id), {
        id: String(id),
        name,
        email: user?.email || "",
      });
    });

    return Array.from(map.values()).sort((a, b) => String(a.name).localeCompare(String(b.name)));
  }, [rows]);

  const filteredRows = useMemo(() => {
    const query = String(search || "")
      .trim()
      .toLowerCase();

    let result = [...rows];

    if (query) {
      result = result.filter((deal) => {
        const assignedName = deal?.assignedTo?.name || deal?.assignedTo?.email || "";

        const companyName = deal?.companyId?.name || "";

        const contactName = deal?.contactId?.name || "";

        const pipelineName = deal?.pipelineId?.name || "";

        const stageName = deal?.stageId?.name || "";

        return [deal?.name, deal?.source, deal?.status, deal?.currency, assignedName, companyName, contactName, pipelineName, stageName].some((value) =>
          String(value || "")
            .toLowerCase()
            .includes(query)
        );
      });
    }

    result.sort((a, b) => {
      let first;
      let second;

      if (sortField === "value") {
        first = Number(a?.value) || 0;
        second = Number(b?.value) || 0;
      } else if (sortField === "expectedCloseDate") {
        first = new Date(a?.expectedCloseDate || 0).getTime();
        second = new Date(b?.expectedCloseDate || 0).getTime();
      } else {
        first = new Date(a?.createdAt || 0).getTime();
        second = new Date(b?.createdAt || 0).getTime();
      }

      if (sortDirection === "asc") {
        return first - second;
      }

      return second - first;
    });

    return result;
  }, [rows, search, sortField, sortDirection]);

  const displayedRows = useMemo(() => {
    return filteredRows.slice(0, visibleRows);
  }, [filteredRows, visibleRows]);

  const maxMonthlyValue = useMemo(() => {
    return Math.max(1, ...monthly.map((item) => Number(item?.wonRevenue || item?.value || 0)));
  }, [monthly]);

  const maxSourceValue = useMemo(() => {
    return Math.max(1, ...bySource.map((item) => Number(item?.value || 0)));
  }, [bySource]);

  const primaryCurrency = currencies?.[0]?.currency || report?.rows?.[0]?.currency || "INR";

  const activeFilterCount = [dateFrom, dateTo, statusFilter, sourceFilter, assignedTo].filter(Boolean).length;

  const hasActiveFilters = activeFilterCount > 0;

  const clearFilters = async () => {
    setDateFrom("");
    setDateTo("");
    setStatusFilter("");
    setSourceFilter("");
    setAssignedTo("");
    setSearch("");

    await loadReport({
      silent: false,
      customFilters: {
        dateFrom: "",
        dateTo: "",
        status: "",
        source: "",
        assignedTo: "",
      },
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

  const applyFilters = async () => {
    const valid = await validateDates();

    if (!valid) {
      return;
    }

    await loadReport({
      silent: false,
    });
  };

  const handleRefresh = async () => {
    await loadReport({
      silent: true,
    });
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));

      return;
    }

    setSortField(field);
    setSortDirection("desc");
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) {
      return <ChevronDown size={13} className="deals-report-sort-muted" />;
    }

    return sortDirection === "asc" ? <ChevronUp size={13} /> : <ChevronDown size={13} />;
  };

  const getStatusClass = (value) => {
    switch (String(value || "").toUpperCase()) {
      case "WON":
        return "deals-report-status deals-report-status-won";

      case "OPEN":
        return "deals-report-status deals-report-status-open";

      case "LOST":
        return "deals-report-status deals-report-status-lost";

      default:
        return "deals-report-status";
    }
  };

  const exportCsv = async () => {
    if (!filteredRows.length) {
      await showAuthAlert({
        icon: "info",
        title: "No deals available",
        text: "There are no deal records available for export.",
        confirmButtonText: "OK",
      });

      return;
    }

    const headers = ["Deal Name", "Value", "Currency", "Status", "Probability", "Source", "Contact", "Company", "Assigned User", "Expected Close Date", "Created At"];

    const lines = [headers.map(escapeCsvValue).join(",")];

    filteredRows.forEach((deal) => {
      lines.push(
        [
          deal?.name || "",
          deal?.value || 0,
          deal?.currency || "",
          deal?.status || "",
          deal?.probability || 0,
          deal?.source || "",
          deal?.contactId?.name || deal?.contactId?.email || "",
          deal?.companyId?.name || "",
          deal?.assignedTo?.name || deal?.assignedTo?.email || "",
          formatDate(deal?.expectedCloseDate),
          formatDate(deal?.createdAt),
        ]
          .map(escapeCsvValue)
          .join(",")
      );
    });

    const blob = new Blob([lines.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = `deals-report-${new Date().toISOString().slice(0, 10)}.csv`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const exportExcel = async () => {
    if (!filteredRows.length) {
      await showAuthAlert({
        icon: "info",
        title: "No deals available",
        text: "There are no deal records available for export.",
        confirmButtonText: "OK",
      });

      return;
    }

    const worksheetData = filteredRows.map((deal) => ({
      "Deal Name": deal?.name || "",
      Value: Number(deal?.value) || 0,
      Currency: deal?.currency || "INR",
      Status: deal?.status || "",
      Probability: Number(deal?.probability) || 0,
      Source: deal?.source || "",
      Contact: deal?.contactId?.name || deal?.contactId?.email || "",
      Company: deal?.companyId?.name || "",
      "Assigned User": deal?.assignedTo?.name || deal?.assignedTo?.email || "",
      "Expected Close": formatDate(deal?.expectedCloseDate),
      "Created At": formatDate(deal?.createdAt),
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Deals Report");

    XLSX.writeFile(workbook, `deals-report-${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  if (loading || businessLoading) {
    return (
      <>
        <style>{styles}</style>

        <div className="deals-report-page">
          <div className="deals-report-loading">
            <div className="deals-report-loading-icon">
              <Loader2 size={30} className="deals-report-spin" />
            </div>

            <div>
              <h3>Loading Deals Report</h3>

              <p>Preparing your deal analytics and pipeline performance data...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>

      <div className="deals-report-page">
        {}
        {}
        {}

        <div className="deals-report-header">
          <div className="deals-report-heading">
            <h1 className="deals-report-title">Deals Report</h1>

            <p className="deals-report-subtitle">Track deal performance, pipeline value, revenue and closing trends.</p>
          </div>

          <div className="deals-report-header-actions">
            <button type="button" className="deals-report-btn deals-report-btn-secondary" onClick={handleRefresh} disabled={refreshing}>
              <RefreshCw size={16} className={refreshing ? "deals-report-spin" : ""} />

              {refreshing ? "Refreshing..." : "Refresh"}
            </button>

            <button type="button" className="deals-report-btn deals-report-btn-secondary" onClick={exportCsv}>
              <Download size={16} />
              CSV
            </button>

            <button type="button" className="deals-report-btn deals-report-btn-primary" onClick={exportExcel}>
              <Download size={16} />
              Excel
            </button>
          </div>
        </div>

        {}
        {}
        {}

        <div className="deals-report-filter-card">
          <div className="deals-report-filter-top">
            <div className="deals-report-filter-title">
              <Filter size={17} />

              <span>Report Filters</span>

              {activeFilterCount > 0 && <span className="deals-report-filter-count">{activeFilterCount}</span>}
            </div>

            <div className="deals-report-filter-actions">
              {hasActiveFilters && (
                <button type="button" className="deals-report-clear-btn" onClick={clearFilters}>
                  <X size={15} />
                  Clear Filters
                </button>
              )}

              <button type="button" className="deals-report-filter-toggle" onClick={() => setShowFilters((current) => !current)}>
                {showFilters ? "Hide Filters" : "Show Filters"}

                {showFilters ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="deals-report-filter-grid">
              <div className="deals-report-field">
                <label>From Date</label>

                <div className="deals-report-input-wrap">
                  <CalendarDays size={15} />

                  <input type="date" className="deals-report-date-input" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} />
                </div>
              </div>

              <div className="deals-report-field">
                <label>To Date</label>

                <div className="deals-report-input-wrap">
                  <CalendarDays size={15} />

                  <input type="date" className="deals-report-date-input" value={dateTo} onChange={(event) => setDateTo(event.target.value)} />
                </div>
              </div>

              <div className="deals-report-field">
                <label>Status</label>

                <div className="deals-report-input-wrap">
                  <Activity size={15} />

                  <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                    <option value="">All Statuses</option>

                    <option value="OPEN">Open</option>

                    <option value="WON">Won</option>

                    <option value="LOST">Lost</option>
                  </select>
                </div>
              </div>

              <div className="deals-report-field">
                <label>Source</label>

                <div className="deals-report-input-wrap">
                  <Target size={15} />

                  <select value={sourceFilter} onChange={(event) => setSourceFilter(event.target.value)}>
                    <option value="">All Sources</option>

                    {sourceOptions.map((source) => (
                      <option key={source} value={source}>
                        {statusLabel(source)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="deals-report-field">
                <label>Assigned User</label>

                <div className="deals-report-input-wrap">
                  <UserRound size={15} />

                  <select value={assignedTo} onChange={(event) => setAssignedTo(event.target.value)}>
                    <option value="">All Users</option>

                    {assignedUserOptions.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="deals-report-filter-apply">
                <button type="button" className="deals-report-btn deals-report-btn-primary" onClick={applyFilters}>
                  <Filter size={15} />
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {}
        {}
        {}

        {error && (
          <div className="deals-report-error">
            <XCircle size={18} />

            <div>
              <strong>Unable to load report</strong>

              <span>{error}</span>
            </div>

            <button
              type="button"
              onClick={() =>
                loadReport({
                  silent: false,
                })
              }>
              Retry
            </button>
          </div>
        )}

        {}
        {}
        {}

        <div className="deals-report-summary-grid">
          <div className="deals-report-summary-card">
            <div className="deals-report-summary-icon">
              <BarChart3 size={19} />
            </div>

            <div className="deals-report-summary-content">
              <span>Total Deals</span>

              <strong>{formatNumber(summary.totalDeals)}</strong>

              <small>All active deal records</small>
            </div>
          </div>

          <div className="deals-report-summary-card">
            <div className="deals-report-summary-icon green">
              <CircleDollarSign size={19} />
            </div>

            <div className="deals-report-summary-content">
              <span>Total Value</span>

              <strong>{formatCompactCurrency(summary.totalValue, primaryCurrency)}</strong>

              <small>Combined deal value</small>
            </div>
          </div>

          <div className="deals-report-summary-card">
            <div className="deals-report-summary-icon success">
              <Trophy size={19} />
            </div>

            <div className="deals-report-summary-content">
              <span>Won Revenue</span>

              <strong>{formatCompactCurrency(summary.wonRevenue, primaryCurrency)}</strong>

              <small>{formatNumber(summary.wonDeals)} won deals</small>
            </div>
          </div>

          <div className="deals-report-summary-card">
            <div className="deals-report-summary-icon orange">
              <TrendingUp size={19} />
            </div>

            <div className="deals-report-summary-content">
              <span>Open Pipeline</span>

              <strong>{formatCompactCurrency(summary.openPipeline, primaryCurrency)}</strong>

              <small>{formatNumber(summary.openDeals)} open deals</small>
            </div>
          </div>

          <div className="deals-report-summary-card">
            <div className="deals-report-summary-icon purple">
              <Target size={19} />
            </div>

            <div className="deals-report-summary-content">
              <span>Weighted Pipeline</span>

              <strong>{formatCompactCurrency(summary.weightedPipeline, primaryCurrency)}</strong>

              <small>Probability adjusted</small>
            </div>
          </div>

          <div className="deals-report-summary-card">
            <div className="deals-report-summary-icon red">
              <XCircle size={19} />
            </div>

            <div className="deals-report-summary-content">
              <span>Lost Value</span>

              <strong>{formatCompactCurrency(summary.lostValue, primaryCurrency)}</strong>

              <small>{formatNumber(summary.lostDeals)} lost deals</small>
            </div>
          </div>
        </div>

        {}
        {}
        {}

        <div className="deals-report-mini-grid">
          <div className="deals-report-mini-card">
            <span>Average Deal</span>

            <strong>{formatCompactCurrency(summary.averageDealValue, primaryCurrency)}</strong>
          </div>

          <div className="deals-report-mini-card">
            <span>Won Deals</span>

            <strong>{formatNumber(summary.wonDeals)}</strong>
          </div>

          <div className="deals-report-mini-card">
            <span>Open Deals</span>

            <strong>{formatNumber(summary.openDeals)}</strong>
          </div>

          <div className="deals-report-mini-card">
            <span>Lost Deals</span>

            <strong>{formatNumber(summary.lostDeals)}</strong>
          </div>
        </div>

        {}
        {}
        {}

        <div className="deals-report-tabs">
          <button type="button" className={`deals-report-tab ${activeSection === "overview" ? "active" : ""}`} onClick={() => setActiveSection("overview")}>
            <BarChart3 size={15} />
            Overview
          </button>

          <button type="button" className={`deals-report-tab ${activeSection === "deals" ? "active" : ""}`} onClick={() => setActiveSection("deals")}>
            <Activity size={15} />
            Deal Details
          </button>
        </div>

        {}
        {}
        {}

        {activeSection === "overview" && (
          <div className="deals-report-content-grid">
            <div className="deals-report-panel">
              <div className="deals-report-panel-header">
                <div>
                  <h3>Deal Status</h3>

                  <p>Distribution across deal lifecycle stages.</p>
                </div>

                <Activity size={18} />
              </div>

              <div className="deals-report-scroll-table">
                <table className="deals-report-simple-table">
                  <thead>
                    <tr>
                      <th>Status</th>
                      <th>Deals</th>
                      <th>Share</th>
                    </tr>
                  </thead>

                  <tbody>
                    {byStatus.length ? (
                      byStatus.map((item) => {
                        const count = Number(item?.deals) || 0;

                        const total = Number(summary.totalDeals) || 0;

                        const share = total > 0 ? (count / total) * 100 : 0;

                        return (
                          <tr key={item?.status || "unknown"}>
                            <td>
                              <span className={getStatusClass(item?.status)}>{statusLabel(item?.status)}</span>
                            </td>

                            <td>{formatNumber(count)}</td>

                            <td>
                              <span className="deals-report-percentage-pill">{formatPercent(share)}</span>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="3" className="deals-report-table-empty">
                          No status data available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="deals-report-panel">
              <div className="deals-report-panel-header">
                <div>
                  <h3>Deal Sources</h3>

                  <p>Value generated from each acquisition source.</p>
                </div>

                <Target size={18} />
              </div>

              <div className="deals-report-source-list">
                {bySource.length ? (
                  bySource.map((item) => {
                    const value = Number(item?.value) || 0;

                    const width = Math.min(100, (value / maxSourceValue) * 100);

                    return (
                      <div className="deals-report-source-row" key={item?.source || "unknown"}>
                        <div className="deals-report-source-top">
                          <span>{statusLabel(item?.source || "Unknown")}</span>

                          <strong>{formatCompactCurrency(value, primaryCurrency)}</strong>
                        </div>

                        <div className="deals-report-progress">
                          <span
                            style={{
                              width: `${width}%`,
                            }}
                          />
                        </div>

                        <div className="deals-report-source-meta">
                          <span>{formatNumber(item?.deals)} deals</span>

                          <span>Won: {formatCompactCurrency(item?.wonRevenue, primaryCurrency)}</span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="deals-report-empty-box">
                    <Target size={24} />

                    <strong>No source data</strong>

                    <span>Source analytics will appear here when deal data is available.</span>
                  </div>
                )}
              </div>
            </div>

            <div className="deals-report-panel deals-report-panel-wide">
              <div className="deals-report-panel-header">
                <div>
                  <h3>Monthly Deal Performance</h3>

                  <p>Deal value and won revenue by month.</p>
                </div>

                <Clock3 size={18} />
              </div>

              <div className="deals-report-monthly-list">
                {monthly.length ? (
                  monthly.map((item) => {
                    const value = Number(item?.value) || 0;

                    const wonRevenue = Number(item?.wonRevenue) || 0;

                    const valueWidth = Math.min(100, (value / maxMonthlyValue) * 100);

                    return (
                      <div className="deals-report-month-row" key={item?.month || Math.random()}>
                        <div className="deals-report-month-label">{formatMonth(item?.month)}</div>

                        <div className="deals-report-month-bar-wrap">
                          <div className="deals-report-month-bar">
                            <span
                              style={{
                                width: `${valueWidth}%`,
                              }}
                            />
                          </div>
                        </div>

                        <div className="deals-report-month-value">{formatCompactCurrency(value, primaryCurrency)}</div>

                        <div className="deals-report-month-won">Won {formatCompactCurrency(wonRevenue, primaryCurrency)}</div>
                      </div>
                    );
                  })
                ) : (
                  <div className="deals-report-empty-box">
                    <Clock3 size={24} />

                    <strong>No monthly data</strong>

                    <span>Monthly performance will appear when deal records are available.</span>
                  </div>
                )}
              </div>
            </div>

            <div className="deals-report-panel">
              <div className="deals-report-panel-header">
                <div>
                  <h3>Currency Breakdown</h3>

                  <p>Deal value grouped by currency.</p>
                </div>

                <CircleDollarSign size={18} />
              </div>

              <div className="deals-report-currency-list">
                {currencies.length ? (
                  currencies.map((item) => (
                    <div className="deals-report-currency-row" key={item?.currency || "currency"}>
                      <div className="deals-report-currency-icon">
                        <CircleDollarSign size={15} />
                      </div>

                      <div>
                        <strong>{item?.currency || "INR"}</strong>

                        <span>Deal value</span>
                      </div>

                      <b>{formatCompactCurrency(item?.value, item?.currency)}</b>
                    </div>
                  ))
                ) : (
                  <div className="deals-report-empty-box">
                    <CircleDollarSign size={24} />

                    <strong>No currency data</strong>

                    <span>Currency breakdown will appear here.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {}
        {}
        {}

        {activeSection === "deals" && (
          <div className="deals-report-panel deals-report-details-panel">
            <div className="deals-report-panel-header deals-report-details-header">
              <div>
                <h3>Deal Details</h3>

                <p>Detailed deal records returned by the report.</p>
              </div>

              <div className="deals-report-detail-actions">
                <div className="deals-report-search">
                  <Search size={16} />

                  <input type="text" value={search} placeholder="Search deals..." onChange={(event) => setSearch(event.target.value)} />

                  {search && (
                    <button type="button" onClick={() => setSearch("")} aria-label="Clear search">
                      <X size={15} />
                    </button>
                  )}
                </div>

                <span className="deals-report-result-count">{formatNumber(filteredRows.length)} records</span>
              </div>
            </div>

            <div className="deals-report-table-scroll">
              <table className="deals-report-table">
                <thead>
                  <tr>
                    <th onClick={() => handleSort("createdAt")}>
                      <span>
                        Deal
                        <SortIcon field="createdAt" />
                      </span>
                    </th>

                    <th onClick={() => handleSort("value")}>
                      <span>
                        Value
                        <SortIcon field="value" />
                      </span>
                    </th>

                    <th>Status</th>

                    <th>Probability</th>

                    <th>Contact</th>

                    <th>Company</th>

                    <th>Assigned User</th>

                    <th onClick={() => handleSort("expectedCloseDate")}>
                      <span>
                        Expected Close
                        <SortIcon field="expectedCloseDate" />
                      </span>
                    </th>

                    <th>Created</th>
                  </tr>
                </thead>

                <tbody>
                  {displayedRows.length ? (
                    displayedRows.map((deal) => (
                      <tr key={deal?._id || `${deal?.name}-${deal?.createdAt}`}>
                        <td>
                          <div className="deals-report-deal-cell">
                            <div className="deals-report-deal-icon">
                              <TrendingUp size={15} />
                            </div>

                            <div>
                              <strong>{deal?.name || "Unnamed Deal"}</strong>

                              <span>{deal?.source || "Manual"}</span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div className="deals-report-value-cell">
                            <strong>{formatCompactCurrency(deal?.value, deal?.currency || "INR")}</strong>

                            <span>{deal?.currency || "INR"}</span>
                          </div>
                        </td>

                        <td>
                          <span className={getStatusClass(deal?.status)}>{statusLabel(deal?.status)}</span>
                        </td>

                        <td>
                          <div className="deals-report-probability">
                            <div className="deals-report-probability-track">
                              <span
                                style={{
                                  width: `${Math.min(100, Math.max(0, Number(deal?.probability) || 0))}%`,
                                }}
                              />
                            </div>

                            <span>{formatPercent(deal?.probability)}</span>
                          </div>
                        </td>

                        <td>
                          <div className="deals-report-person">
                            <div className="deals-report-small-avatar">{(deal?.contactId?.name || deal?.contactId?.email || "C").charAt(0).toUpperCase()}</div>

                            <span>{deal?.contactId?.name || deal?.contactId?.email || "No Contact"}</span>
                          </div>
                        </td>

                        <td>
                          <span className="deals-report-table-text">{deal?.companyId?.name || "No Company"}</span>
                        </td>

                        <td>
                          <div className="deals-report-person">
                            <div className="deals-report-small-avatar">{(deal?.assignedTo?.name || deal?.assignedTo?.email || "U").charAt(0).toUpperCase()}</div>

                            <span>{deal?.assignedTo?.name || deal?.assignedTo?.email || "Unassigned"}</span>
                          </div>
                        </td>

                        <td>
                          <span className="deals-report-date">{formatDate(deal?.expectedCloseDate)}</span>
                        </td>

                        <td>
                          <span className="deals-report-date">{formatDate(deal?.createdAt)}</span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="deals-report-no-data">
                        <div>
                          <Search size={28} />

                          <strong>No deals found</strong>

                          <span>Try changing your filters or search term.</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {filteredRows.length > visibleRows && (
              <div className="deals-report-load-more">
                <button type="button" className="deals-report-btn deals-report-btn-secondary" onClick={() => setVisibleRows((current) => current + 50)}>
                  Load More
                </button>
              </div>
            )}
          </div>
        )}

        {}
        {}
        {}

        <div className="deals-report-footer">
          <span>
            Showing {formatNumber(displayedRows.length)} of {formatNumber(filteredRows.length)} deals
          </span>

          <span>
            Last updated{" "}
            {new Date().toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>
    </>
  );
};

const styles = `
.deals-report-page{width:100%;min-width:0;padding:22px;color:var(--crm-text,#1f2937);}
.deals-report-header{display:flex;align-items:center;justify-content:space-between;gap:18px;margin-bottom:18px;}
.deals-report-heading{min-width:0;}
.deals-report-title{font-size:23px;line-height:1.2;font-weight:400;margin:0;color:var(--crm-text,#1f2937);}
.deals-report-subtitle{font-size:13px;color:var(--crm-muted,#6b7280);margin:5px 0 0;line-height:1.5;}
.deals-report-header-actions{display:flex;align-items:center;justify-content:flex-end;gap:8px;flex-wrap:wrap;flex-shrink:0;}
.deals-report-btn{min-height:38px;border:1px solid var(--crm-border,#e5e7eb);border-radius:9px;padding:0 13px;display:inline-flex;align-items:center;justify-content:center;gap:7px;font-size:13px;font-weight:400;cursor:pointer;transition:.18s ease;white-space:nowrap;}
.deals-report-btn:disabled{opacity:.6;cursor:not-allowed;}
.deals-report-btn-secondary{background:var(--crm-surface,#fff);color:var(--crm-text,#374151);}
.deals-report-btn-secondary:hover:not(:disabled){background:var(--crm-bg,#f8fafc);border-color:var(--crm-primary,#2563eb);}
.deals-report-btn-primary{background:var(--crm-primary,#2563eb);border-color:var(--crm-primary,#2563eb);color:#fff;}
.deals-report-btn-primary:hover:not(:disabled){filter:brightness(.95);}
.deals-report-filter-card{border:1px solid var(--crm-border,#e5e7eb);background:var(--crm-surface,#fff);border-radius:12px;margin-bottom:18px;overflow:hidden;}
.deals-report-filter-top{min-height:54px;padding:0 15px;display:flex;align-items:center;justify-content:space-between;gap:12px;}
.deals-report-filter-title{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:400;color:var(--crm-text,#374151);}
.deals-report-filter-count{min-width:20px;height:20px;padding:0 6px;border-radius:999px;background:var(--crm-primary,#2563eb);color:#fff;font-size:13px;display:inline-flex;align-items:center;justify-content:center;}
.deals-report-filter-actions{display:flex;align-items:center;gap:8px;}
.deals-report-clear-btn{border:0;background:transparent;color:var(--crm-muted,#6b7280);display:inline-flex;align-items:center;gap:5px;font-size:13px;font-weight:400;cursor:pointer;padding:7px 8px;border-radius:7px;}
.deals-report-clear-btn:hover{background:var(--crm-bg,#f8fafc);color:var(--crm-text,#374151);}
.deals-report-filter-toggle{border:1px solid var(--crm-border,#e5e7eb);background:var(--crm-surface,#fff);color:var(--crm-text,#374151);min-height:34px;padding:0 10px;border-radius:8px;display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:400;cursor:pointer;}
.deals-report-filter-grid{border-top:1px solid var(--crm-border,#e5e7eb);padding:15px;display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:12px;background:var(--crm-bg,#f8fafc);}
.deals-report-field{min-width:0;}
.deals-report-field label{display:block;margin-bottom:6px;font-size:13px;font-weight:400;color:var(--crm-muted,#6b7280);}
.deals-report-input-wrap{height:38px;border:1px solid var(--crm-border,#e5e7eb);background:var(--crm-surface,#fff);border-radius:8px;display:flex;align-items:center;gap:7px;padding:0 10px;color:var(--crm-muted,#6b7280);}
.deals-report-input-wrap:focus-within{border-color:var(--crm-primary,#2563eb);box-shadow:0 0 0 3px rgba(37,99,235,.08);}
.deals-report-input-wrap input,.deals-report-input-wrap select{width:100%;height:100%;border:0;outline:0;background:transparent;color:var(--crm-text,#374151);font-size:13px;min-width:0;}
.deals-report-input-wrap select{cursor:pointer;}
.deals-report-input-wrap option{background:var(--crm-surface,#fff);color:var(--crm-text,#374151);}
.deals-report-input-wrap input[type="date"]{color-scheme:light;-webkit-appearance:auto;appearance:auto;accent-color:var(--crm-primary,#2563eb);cursor:pointer;}
.deals-report-date-input{color-scheme:light;-webkit-appearance:auto;appearance:auto;accent-color:var(--crm-primary,#2563eb);cursor:pointer;}
.deals-report-input-wrap input[type="date"]::-webkit-calendar-picker-indicator,.deals-report-date-input::-webkit-calendar-picker-indicator{color:#374151!important;opacity:1!important;visibility:visible!important;}
.deals-report-input-wrap input[type="date"]::-webkit-calendar-picker-indicator{display:block;opacity:1!important;visibility:visible!important;cursor:pointer;width:16px;height:16px;}
.deals-report-date-input::-webkit-calendar-picker-indicator{display:block;opacity:1!important;visibility:visible!important;cursor:pointer;width:16px;height:16px;}
.dark .deals-report-input-wrap input[type="date"],[data-theme="dark"] .deals-report-input-wrap input[type="date"],html.dark .deals-report-input-wrap input[type="date"],body.dark .deals-report-input-wrap input[type="date"],body.dark-mode .deals-report-input-wrap input[type="date"],html.dark-mode .deals-report-input-wrap input[type="date"],.dark-theme .deals-report-input-wrap input[type="date"],.dark .deals-report-date-input,[data-theme="dark"] .deals-report-date-input,html.dark .deals-report-date-input,body.dark .deals-report-date-input,body.dark-mode .deals-report-date-input,html.dark-mode .deals-report-date-input,.dark-theme .deals-report-date-input{color-scheme:dark;background:transparent;color:var(--crm-text,#f8fafc);}

@media (prefers-color-scheme:dark){}
.deals-report-filter-apply{display:flex;align-items:flex-end;}
.deals-report-filter-apply .deals-report-btn{width:100%;}
.deals-report-error{border:1px solid rgba(239,68,68,.25);background:rgba(239,68,68,.07);border-radius:10px;padding:12px 14px;margin-bottom:18px;display:flex;align-items:center;gap:10px;color:#dc2626;}
.deals-report-error>div{display:flex;flex-direction:column;gap:2px;flex:1;min-width:0;}
.deals-report-error strong{font-size:13px;}
.deals-report-error span{font-size:13px;white-space:pre-wrap;}
.deals-report-error button{border:1px solid rgba(239,68,68,.25);background:transparent;color:#dc2626;border-radius:7px;padding:6px 10px;font-size:13px;font-weight:400;cursor:pointer;}
.deals-report-summary-grid{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:12px;margin-bottom:12px;}
.deals-report-summary-card{border:1px solid var(--crm-border,#e5e7eb);background:var(--crm-surface,#fff);border-radius:12px;padding:14px;display:flex;align-items:flex-start;gap:11px;min-width:0;}
.deals-report-summary-icon{width:36px;height:36px;min-width:36px;border-radius:9px;display:flex;align-items:center;justify-content:center;background:rgba(37,99,235,.1);color:var(--crm-primary,#2563eb);}
.deals-report-summary-icon.green{background:rgba(16,185,129,.1);color:#10b981;}
.deals-report-summary-icon.success{background:rgba(34,197,94,.1);color:#16a34a;}
.deals-report-summary-icon.orange{background:rgba(245,158,11,.1);color:#d97706;}
.deals-report-summary-icon.purple{background:rgba(139,92,246,.1);color:#7c3aed;}
.deals-report-summary-icon.red{background:rgba(239,68,68,.1);color:#dc2626;}
.deals-report-summary-content{min-width:0;display:flex;flex-direction:column;}
.deals-report-summary-content span{font-size:13px;color:var(--crm-muted,#6b7280);margin-bottom:4px;}
.deals-report-summary-content strong{font-size:19px;line-height:1.15;color:var(--crm-text,#1f2937);font-weight:400;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.deals-report-summary-content small{font-size:13px;color:var(--crm-muted,#9ca3af);margin-top:5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.deals-report-mini-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin-bottom:18px;}
.deals-report-mini-card{border:1px solid var(--crm-border,#e5e7eb);background:var(--crm-surface,#fff);border-radius:10px;padding:11px 13px;display:flex;align-items:center;justify-content:space-between;gap:12px;}
.deals-report-mini-card span{font-size:13px;color:var(--crm-muted,#6b7280);}
.deals-report-mini-card strong{font-size:14px;color:var(--crm-text,#1f2937);}
.deals-report-tabs{display:flex;align-items:center;gap:5px;border-bottom:1px solid var(--crm-border,#e5e7eb);margin-bottom:15px;}
.deals-report-tab{border:0;background:transparent;color:var(--crm-muted,#6b7280);padding:10px 13px;display:inline-flex;align-items:center;gap:7px;font-size:13px;font-weight:400;cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-1px;}
.deals-report-tab:hover{color:var(--crm-text,#374151);}
.deals-report-tab.active{color:var(--crm-primary,#2563eb);border-bottom-color:var(--crm-primary,#2563eb);}
.deals-report-content-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:15px;}
.deals-report-panel{border:1px solid var(--crm-border,#e5e7eb);background:var(--crm-surface,#fff);border-radius:12px;overflow:hidden;min-width:0;}
.deals-report-panel-wide{grid-column:1 / -1;}
.deals-report-panel-header{padding:14px 15px;border-bottom:1px solid var(--crm-border,#e5e7eb);display:flex;align-items:center;justify-content:space-between;gap:12px;color:var(--crm-muted,#6b7280);}
.deals-report-panel-header h3{margin:0;color:var(--crm-text,#1f2937);font-size:13px;font-weight:400;}
.deals-report-panel-header p{margin:4px 0 0;color:var(--crm-muted,#6b7280);font-size:13px;}
.deals-report-scroll-table{max-height:310px;overflow:auto;}
.deals-report-simple-table{width:100%;border-collapse:collapse;font-size:13px;}
.deals-report-simple-table th{position:sticky;top:0;z-index:1;background:var(--crm-surface,#fff);color:var(--crm-muted,#6b7280);font-size:13px;text-transform:uppercase;letter-spacing:.04em;font-weight:400;text-align:left;padding:10px 13px;border-bottom:1px solid var(--crm-border,#e5e7eb);}
.deals-report-simple-table td{padding:11px 13px;border-bottom:1px solid var(--crm-border,#e5e7eb);color:var(--crm-text,#374151);}
.deals-report-simple-table tbody tr:last-child td{border-bottom:0;}
.deals-report-simple-table tbody tr:hover{background:var(--crm-bg,#f8fafc);}
.deals-report-status{display:inline-flex;align-items:center;padding:4px 8px;border-radius:999px;font-size:13px;font-weight:400;background:rgba(107,114,128,.1);color:var(--crm-muted,#6b7280);}
.deals-report-status-won{background:rgba(16,185,129,.1);color:#059669;}
.deals-report-status-open{background:rgba(37,99,235,.1);color:#2563eb;}
.deals-report-status-lost{background:rgba(239,68,68,.1);color:#dc2626;}
.deals-report-percentage-pill{display:inline-flex;padding:4px 7px;border-radius:6px;background:rgba(37,99,235,.08);color:var(--crm-primary,#2563eb);font-size:13px;font-weight:400;}
.deals-report-table-empty{text-align:center!important;color:var(--crm-muted,#6b7280)!important;padding:28px 13px!important;}
.deals-report-source-list{padding:14px 15px;max-height:310px;overflow:auto;}
.deals-report-source-row{padding:9px 0;border-bottom:1px solid var(--crm-border,#e5e7eb);}
.deals-report-source-row:last-child{border-bottom:0;}
.deals-report-source-top{display:flex;align-items:center;justify-content:space-between;gap:10px;font-size:13px;}
.deals-report-source-top span{color:var(--crm-text,#374151);font-weight:400;}
.deals-report-source-top strong{color:var(--crm-text,#1f2937);font-size:13px;}
.deals-report-progress{height:6px;background:var(--crm-bg,#f1f5f9);border-radius:999px;overflow:hidden;margin:7px 0 5px;}
.deals-report-progress span{display:block;height:100%;border-radius:999px;background:var(--crm-primary,#2563eb);}
.deals-report-source-meta{display:flex;justify-content:space-between;gap:10px;color:var(--crm-muted,#9ca3af);font-size:13px;}
.deals-report-monthly-list{padding:14px 15px;max-height:330px;overflow:auto;}
.deals-report-month-row{display:grid;grid-template-columns:75px minmax(100px,1fr) 100px 100px;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--crm-border,#e5e7eb);}
.deals-report-month-row:last-child{border-bottom:0;}
.deals-report-month-label{font-size:13px;font-weight:400;color:var(--crm-text,#374151);}
.deals-report-month-bar-wrap{min-width:0;}
.deals-report-month-bar{height:8px;background:var(--crm-bg,#f1f5f9);border-radius:999px;overflow:hidden;}
.deals-report-month-bar span{display:block;height:100%;border-radius:999px;background:var(--crm-primary,#2563eb);}
.deals-report-month-value{font-size:13px;font-weight:400;color:var(--crm-text,#374151);text-align:right;}
.deals-report-month-won{font-size:13px;color:#059669;text-align:right;}
.deals-report-currency-list{padding:14px 15px;max-height:310px;overflow:auto;}
.deals-report-currency-row{display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--crm-border,#e5e7eb);}
.deals-report-currency-row:last-child{border-bottom:0;}
.deals-report-currency-icon{width:30px;height:30px;border-radius:8px;background:rgba(37,99,235,.08);color:var(--crm-primary,#2563eb);display:flex;align-items:center;justify-content:center;}
.deals-report-currency-row>div:nth-child(2){flex:1;display:flex;flex-direction:column;gap:2px;}
.deals-report-currency-row strong{font-size:13px;color:var(--crm-text,#374151);}
.deals-report-currency-row span{font-size:13px;color:var(--crm-muted,#9ca3af);}
.deals-report-currency-row>b{font-size:13px;color:var(--crm-text,#1f2937);}
.deals-report-empty-box{min-height:170px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:6px;color:var(--crm-muted,#9ca3af);padding:20px;}
.deals-report-empty-box strong{font-size:13px;color:var(--crm-text,#374151);}
.deals-report-empty-box span{font-size:13px;max-width:260px;line-height:1.5;}
.deals-report-details-panel{overflow:hidden;}
.deals-report-details-header{align-items:center;}
.deals-report-detail-actions{display:flex;align-items:center;gap:9px;min-width:0;}
.deals-report-search{height:36px;width:250px;border:1px solid var(--crm-border,#e5e7eb);background:var(--crm-surface,#fff);border-radius:8px;display:flex;align-items:center;gap:7px;padding:0 9px;color:var(--crm-muted,#6b7280);}
.deals-report-search:focus-within{border-color:var(--crm-primary,#2563eb);box-shadow:0 0 0 3px rgba(37,99,235,.08);}
.deals-report-search input{width:100%;min-width:0;border:0;outline:0;background:transparent;color:var(--crm-text,#374151);font-size:13px;}
.deals-report-search button{width:24px;height:24px;border:0;background:transparent;color:var(--crm-muted,#9ca3af);display:flex;align-items:center;justify-content:center;border-radius:5px;cursor:pointer;padding:0;}
.deals-report-search button:hover{background:var(--crm-bg,#f8fafc);color:var(--crm-text,#374151);}
.deals-report-result-count{font-size:13px;color:var(--crm-muted,#6b7280);white-space:nowrap;}
.deals-report-table-scroll{max-height:520px;overflow:auto;}
.deals-report-table{width:100%;border-collapse:separate;border-spacing:0;min-width:1050px;font-size:13px;}
.deals-report-table th{position:sticky;top:0;z-index:2;background:var(--crm-surface,#fff);color:var(--crm-muted,#6b7280);font-size:13px;text-transform:uppercase;letter-spacing:.04em;font-weight:400;text-align:left;padding:11px 12px;border-bottom:1px solid var(--crm-border,#e5e7eb);white-space:nowrap;cursor:pointer;}
.deals-report-table th:not(:first-child){text-align:left;}
.deals-report-table th span{display:inline-flex;align-items:center;gap:4px;}
.deals-report-table td{padding:11px 12px;border-bottom:1px solid var(--crm-border,#e5e7eb);color:var(--crm-text,#374151);vertical-align:middle;white-space:nowrap;}
.deals-report-table tbody tr:hover{background:var(--crm-bg,#f8fafc);}
.deals-report-sort-muted{opacity:.35;}
.deals-report-deal-cell{display:flex;align-items:center;gap:9px;min-width:160px;}
.deals-report-deal-icon{width:30px;height:30px;min-width:30px;border-radius:8px;background:rgba(37,99,235,.09);color:var(--crm-primary,#2563eb);display:flex;align-items:center;justify-content:center;}
.deals-report-deal-cell>div:last-child{display:flex;flex-direction:column;gap:2px;min-width:0;}
.deals-report-deal-cell strong{font-size:13px;color:var(--crm-text,#1f2937);max-width:170px;overflow:hidden;text-overflow:ellipsis;}
.deals-report-deal-cell span{font-size:13px;color:var(--crm-muted,#9ca3af);text-transform:capitalize;}
.deals-report-value-cell{display:flex;flex-direction:column;gap:2px;}
.deals-report-value-cell strong{font-size:13px;color:var(--crm-text,#1f2937);}
.deals-report-value-cell span{font-size:13px;color:var(--crm-muted,#9ca3af);}
.deals-report-probability{display:flex;align-items:center;gap:7px;min-width:100px;}
.deals-report-probability-track{width:58px;height:5px;border-radius:999px;background:var(--crm-bg,#eef2f7);overflow:hidden;}
.deals-report-probability-track span{display:block;height:100%;border-radius:999px;background:var(--crm-primary,#2563eb);}
.deals-report-probability>span{font-size:13px;color:var(--crm-muted,#6b7280);}
.deals-report-person{display:flex;align-items:center;gap:7px;min-width:120px;}
.deals-report-person span{font-size:13px;max-width:120px;overflow:hidden;text-overflow:ellipsis;}
.deals-report-small-avatar{width:25px;height:25px;min-width:25px;border-radius:50%;background:var(--crm-bg,#f1f5f9);color:var(--crm-primary,#2563eb);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:400;}
.deals-report-table-text{font-size:13px;max-width:120px;display:block;overflow:hidden;text-overflow:ellipsis;}
.deals-report-date{font-size:13px;color:var(--crm-muted,#6b7280);}
.deals-report-no-data{text-align:center!important;padding:55px 20px!important;}
.deals-report-no-data>div{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px;color:var(--crm-muted,#9ca3af);}
.deals-report-no-data strong{font-size:13px;color:var(--crm-text,#374151);}
.deals-report-no-data span{font-size:13px;}
.deals-report-load-more{display:flex;justify-content:center;padding:12px;border-top:1px solid var(--crm-border,#e5e7eb);}
.deals-report-footer{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:13px;color:var(--crm-muted,#9ca3af);font-size:13px;}
.deals-report-loading{min-height:320px;border:1px solid var(--crm-border,#e5e7eb);background:var(--crm-surface,#fff);border-radius:12px;display:flex;align-items:center;justify-content:center;gap:13px;padding:30px;}
.deals-report-loading-icon{width:52px;height:52px;border-radius:13px;background:rgba(37,99,235,.08);color:var(--crm-primary,#2563eb);display:flex;align-items:center;justify-content:center;}
.deals-report-loading h3{margin:0;color:var(--crm-text,#374151);font-size:14px;}
.deals-report-loading p{margin:5px 0 0;color:var(--crm-muted,#6b7280);font-size:13px;}
.deals-report-spin{animation:deals-report-spin 1s linear infinite;}
@keyframes deals-report-spin{to{transform:rotate(360deg);}}
@media(max-width:1250px){.deals-report-summary-grid{grid-template-columns:repeat(3,minmax(0,1fr));}.deals-report-filter-grid{grid-template-columns:repeat(3,minmax(0,1fr));}}
@media(max-width:900px){.deals-report-page{padding:16px;}.deals-report-header{align-items:flex-start;flex-direction:column;}.deals-report-header-actions{width:100%;justify-content:flex-start;}.deals-report-summary-grid{grid-template-columns:repeat(2,minmax(0,1fr));}.deals-report-mini-grid{grid-template-columns:repeat(2,minmax(0,1fr));}.deals-report-content-grid{grid-template-columns:1fr;}.deals-report-panel-wide{grid-column:auto;}.deals-report-filter-grid{grid-template-columns:repeat(2,minmax(0,1fr));}.deals-report-details-header{align-items:flex-start;flex-direction:column;}.deals-report-detail-actions{width:100%;justify-content:space-between;}.deals-report-search{flex:1;max-width:400px;}}
@media(max-width:620px){.deals-report-page{padding:12px;}.deals-report-title{font-size:20px;}.deals-report-header-actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));width:100%;}.deals-report-header-actions .deals-report-btn{width:100%;}.deals-report-summary-grid{grid-template-columns:1fr;}.deals-report-mini-grid{grid-template-columns:1fr 1fr;}.deals-report-filter-top{align-items:flex-start;flex-direction:column;padding:12px;}.deals-report-filter-actions{width:100%;justify-content:space-between;}.deals-report-filter-grid{grid-template-columns:1fr;}.deals-report-tabs{width:100%;overflow:auto;}.deals-report-tab{flex:1;justify-content:center;white-space:nowrap;}.deals-report-detail-actions{flex-direction:column;align-items:stretch;}.deals-report-search{width:100%;max-width:none;}.deals-report-result-count{align-self:flex-start;}.deals-report-footer{flex-direction:column;align-items:flex-start;}.deals-report-month-row{grid-template-columns:60px minmax(80px,1fr);}.deals-report-month-value,.deals-report-month-won{text-align:left;}.deals-report-month-won{grid-column:2;}}
`;

export default DealsReport;
