import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Activity, ArrowDown, ArrowUp, BarChart3, CalendarDays, CheckCircle2, ChevronDown, ChevronUp, CircleAlert, Clock3, Download, Filter, Flame, Loader2, RefreshCw, Search, Target, TrendingUp, Trophy, UserRound, Users, X, XCircle } from "lucide-react";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { getLeadsReport } from "../../api/report.api";
import useBusiness from "../../hooks/useBusiness";

/*
 * ============================================================
 * HELPERS
 * ============================================================
 */

const formatNumber = (value) => {
  const number = Number(value);

  if (!Number.isFinite(number)) return "0";

  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 1,
  }).format(number);
};

const formatPercent = (value) => {
  const number = Number(value);

  if (!Number.isFinite(number)) return "0%";

  return `${number.toFixed(1)}%`;
};

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatMonth = (value) => {
  if (!value) return "—";

  const parts = String(value).split("-");

  if (parts.length !== 2) return value;

  const year = Number(parts[0]);
  const month = Number(parts[1]);

  if (!year || !month) return value;

  const date = new Date(year, month - 1, 1);

  return date.toLocaleDateString("en-IN", {
    month: "short",
    year: "numeric",
  });
};

const displayName = (lead) => {
  const fullName = [lead?.firstName, lead?.lastName].filter(Boolean).join(" ").trim();

  return fullName || lead?.name || lead?.email || lead?.phone || "Unnamed Lead";
};

const statusLabel = (value) => {
  if (!value) return "Unknown";

  return String(value)
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const ratingLabel = (value) => {
  if (!value) return "Unknown";

  return String(value)
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const normalizeResponse = (response) => {
  /*
   * Supports the normal ApiResponse structure as well as
   * direct response.data structures.
   */

  const root = response?.data ?? response ?? {};

  if (root?.data && typeof root.data === "object") {
    return root.data;
  }

  return root;
};

const escapeCsvValue = (value) => {
  const stringValue = value === null || value === undefined ? "" : String(value);

  return `"${stringValue.replace(/"/g, '""')}"`;
};

/*
 * ============================================================
 * COMPONENT
 * ============================================================
 */

const LeadsReport = () => {
  const { businessId, loading: businessLoading, error: businessError } = useBusiness();

  const [report, setReport] = useState(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [status, setStatus] = useState("");
  const [source, setSource] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  const [search, setSearch] = useState("");

  const [activeSection, setActiveSection] = useState("overview");

  const [showFilters, setShowFilters] = useState(false);

  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");

  /*
   * ----------------------------------------------------------
   * Business context
   * ----------------------------------------------------------
   */

  useEffect(() => {
    if (businessError && !businessId && !businessLoading) {
      setError(businessError || "Unable to load your business workspace.");
    }
  }, [businessError, businessId, businessLoading]);

  /*
   * ----------------------------------------------------------
   * SweetAlert theme helper
   * ----------------------------------------------------------
   */

  const showErrorAlert = useCallback((message) => {
    Swal.fire({
      icon: "error",
      title: "Unable to load report",
      text: message || "Something went wrong while loading the report.",
      confirmButtonText: "OK",
      customClass: {
        popup: "crm-swal-popup",
        title: "crm-swal-title",
        htmlContainer: "crm-swal-text",
        confirmButton: "crm-swal-confirm",
      },
    });
  }, []);

  /*
   * ----------------------------------------------------------
   * Fetch report
   * ----------------------------------------------------------
   */

  const loadReport = useCallback(
    async (options = {}) => {
      const silent = options.silent === true;

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
        const params = {};

        if (dateFrom) {
          params.dateFrom = dateFrom;
        }

        if (dateTo) {
          params.dateTo = dateTo;
        }

        if (status) {
          params.status = status;
        }

        if (source) {
          params.source = source;
        }

        if (assignedTo) {
          params.assignedTo = assignedTo;
        }

        const response = await getLeadsReport(businessId, params);

        const data = normalizeResponse(response);

        setReport({
          filters: data?.filters || {},
          summary: data?.summary || {},
          byStatus: Array.isArray(data?.byStatus) ? data.byStatus : [],
          bySource: Array.isArray(data?.bySource) ? data.bySource : [],
          byRating: Array.isArray(data?.byRating) ? data.byRating : [],
          byAssignedUser: Array.isArray(data?.byAssignedUser) ? data.byAssignedUser : [],
          byAssignedTeam: Array.isArray(data?.byAssignedTeam) ? data.byAssignedTeam : [],
          monthly: Array.isArray(data?.monthly) ? data.monthly : [],
          rows: Array.isArray(data?.rows) ? data.rows : [],
        });
      } catch (err) {
        const message = err?.response?.data?.message || err?.response?.data?.error || err?.message || "Unable to load leads report.";

        setError(message);

        if (!silent) {
          showErrorAlert(message);
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [businessId, businessLoading, businessError, dateFrom, dateTo, status, source, assignedTo, showErrorAlert]
  );

  useEffect(() => {
    loadReport();
  }, [loadReport]);

  /*
   * ----------------------------------------------------------
   * Data
   * ----------------------------------------------------------
   */

  const summary = report?.summary || {};

  const rows = report?.rows || [];

  const byStatus = report?.byStatus || [];
  const bySource = report?.bySource || [];
  const byRating = report?.byRating || [];
  const byAssignedUser = report?.byAssignedUser || [];
  const byAssignedTeam = report?.byAssignedTeam || [];
  const monthly = report?.monthly || [];

  /*
   * ----------------------------------------------------------
   * Sources
   * ----------------------------------------------------------
   */

  const sourceOptions = useMemo(() => {
    return bySource
      .map((item) => item?.source)
      .filter(Boolean)
      .sort((a, b) => String(a).localeCompare(String(b)));
  }, [bySource]);

  /*
   * ----------------------------------------------------------
   * Assigned users
   * ----------------------------------------------------------
   */

  const assignedUserOptions = useMemo(() => {
    return byAssignedUser
      .filter((item) => item?.userId)
      .map((item) => ({
        id: item.userId,
        name: item.name || item.email || "Unknown User",
      }))
      .sort((a, b) => String(a.name).localeCompare(String(b.name)));
  }, [byAssignedUser]);

  /*
   * ----------------------------------------------------------
   * Filtered table rows
   * ----------------------------------------------------------
   */

  const filteredRows = useMemo(() => {
    const query = String(search || "")
      .trim()
      .toLowerCase();

    let result = rows;

    if (query) {
      result = result.filter((lead) => {
        const values = [displayName(lead), lead?.email, lead?.phone, lead?.companyName, lead?.source, lead?.status, lead?.rating, lead?.assignedTo?.name, lead?.assignedTo?.email, lead?.assignedTeamId?.name];

        return values.some((value) =>
          String(value || "")
            .toLowerCase()
            .includes(query)
        );
      });
    }

    result = [...result].sort((a, b) => {
      let first;
      let second;

      if (sortField === "name") {
        first = displayName(a);
        second = displayName(b);
      } else if (sortField === "status") {
        first = a?.status || "";
        second = b?.status || "";
      } else if (sortField === "source") {
        first = a?.source || "";
        second = b?.source || "";
      } else if (sortField === "rating") {
        first = a?.rating || "";
        second = b?.rating || "";
      } else {
        first = a?.createdAt || "";
        second = b?.createdAt || "";
      }

      const aValue = typeof first === "string" ? first.toLowerCase() : first;

      const bValue = typeof second === "string" ? second.toLowerCase() : second;

      if (aValue < bValue) {
        return sortDirection === "asc" ? -1 : 1;
      }

      if (aValue > bValue) {
        return sortDirection === "asc" ? 1 : -1;
      }

      return 0;
    });

    return result;
  }, [rows, search, sortField, sortDirection]);

  /*
   * ----------------------------------------------------------
   * Active filters
   * ----------------------------------------------------------
   */

  const activeFilterCount = [dateFrom, dateTo, status, source, assignedTo].filter(Boolean).length;

  /*
   * ----------------------------------------------------------
   * Clear filters
   * ----------------------------------------------------------
   */

  const clearFilters = () => {
    setDateFrom("");
    setDateTo("");
    setStatus("");
    setSource("");
    setAssignedTo("");
    setSearch("");
  };

  /*
   * ----------------------------------------------------------
   * Sorting
   * ----------------------------------------------------------
   */

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortField(field);
    setSortDirection("asc");
  };

  /*
   * ----------------------------------------------------------
   * Export CSV
   * ----------------------------------------------------------
   */

  const exportCsv = () => {
    if (!filteredRows.length) {
      Swal.fire({
        icon: "info",
        title: "No data to export",
        text: "There are no lead records available for export.",
        confirmButtonText: "OK",
      });

      return;
    }

    const headers = ["Lead Name", "Email", "Phone", "Company", "Source", "Status", "Rating", "Assigned User", "Assigned Team", "Created At", "Last Contacted", "Converted At"];

    const data = filteredRows.map((lead) => [
      displayName(lead),
      lead?.email || "",
      lead?.phone || "",
      lead?.companyName || "",
      lead?.source || "",
      lead?.status || "",
      lead?.rating || "",
      lead?.assignedTo?.name || lead?.assignedTo?.email || "",
      lead?.assignedTeamId?.name || "",
      formatDate(lead?.createdAt),
      formatDate(lead?.lastContactedAt),
      formatDate(lead?.convertedAt),
    ]);

    const csv = [headers.map(escapeCsvValue).join(","), ...data.map((row) => row.map(escapeCsvValue).join(","))].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `leads-report-${new Date().toISOString().slice(0, 10)}.csv`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  /*
   * ----------------------------------------------------------
   * Export Excel
   * ----------------------------------------------------------
   */

  const exportExcel = () => {
    if (!filteredRows.length) {
      Swal.fire({
        icon: "info",
        title: "No data to export",
        text: "There are no lead records available for export.",
        confirmButtonText: "OK",
      });

      return;
    }

    const worksheetData = filteredRows.map((lead) => ({
      "Lead Name": displayName(lead),
      Email: lead?.email || "",
      Phone: lead?.phone || "",
      Company: lead?.companyName || "",
      Source: lead?.source || "",
      Status: lead?.status || "",
      Rating: lead?.rating || "",
      "Assigned User": lead?.assignedTo?.name || lead?.assignedTo?.email || "",
      "Assigned Team": lead?.assignedTeamId?.name || "",
      "Created At": formatDate(lead?.createdAt),
      "Last Contacted": formatDate(lead?.lastContactedAt),
      "Converted At": formatDate(lead?.convertedAt),
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads Report");

    XLSX.writeFile(workbook, `leads-report-${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  /*
   * ----------------------------------------------------------
   * Status classes
   * ----------------------------------------------------------
   */

  const getStatusClass = (value) => {
    switch (String(value || "").toUpperCase()) {
      case "NEW":
        return "leads-report-status leads-report-status-new";

      case "CONTACTED":
        return "leads-report-status leads-report-status-contacted";

      case "QUALIFIED":
        return "leads-report-status leads-report-status-qualified";

      case "UNQUALIFIED":
        return "leads-report-status leads-report-status-unqualified";

      case "CONVERTED":
        return "leads-report-status leads-report-status-converted";

      case "LOST":
        return "leads-report-status leads-report-status-lost";

      default:
        return "leads-report-status";
    }
  };

  const getRatingClass = (value) => {
    switch (String(value || "").toUpperCase()) {
      case "HOT":
        return "leads-report-rating leads-report-rating-hot";

      case "WARM":
        return "leads-report-rating leads-report-rating-warm";

      case "COLD":
        return "leads-report-rating leads-report-rating-cold";

      default:
        return "leads-report-rating";
    }
  };

  /*
   * ----------------------------------------------------------
   * Sort icon
   * ----------------------------------------------------------
   */

  const SortIcon = ({ field }) => {
    if (sortField !== field) {
      return <ChevronDown size={13} className="leads-report-sort-muted" />;
    }

    return sortDirection === "asc" ? <ChevronUp size={13} /> : <ChevronDown size={13} />;
  };

  /*
   * ============================================================
   * LOADING
   * ============================================================
   */

  if (loading || businessLoading) {
    return (
      <>
        <style>{styles}</style>

        <div className="leads-report-page">
          <div className="leads-report-loading">
            <div className="leads-report-loading-icon">
              <Loader2 size={30} className="leads-report-spin" />
            </div>

            <div>
              <h3>Loading Leads Report</h3>
              <p>Preparing your lead analytics and performance data...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  /*
   * ============================================================
   * PAGE
   * ============================================================
   */

  return (
    <>
      <style>{styles}</style>

      <div className="leads-report-page">
        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <div className="leads-report-header">
          <div className="leads-report-header-left">
            <div>
              <h1 className="leads-report-title">Leads Report</h1>

              <p className="leads-report-subtitle">Track lead performance, conversion and acquisition trends.</p>
            </div>
          </div>

          <div className="leads-report-header-actions">
            <button type="button" className="leads-report-btn leads-report-btn-secondary" onClick={() => loadReport({ silent: true })} disabled={refreshing}>
              <RefreshCw size={16} className={refreshing ? "leads-report-spin" : ""} />

              {refreshing ? "Refreshing..." : "Refresh"}
            </button>

            <button type="button" className="leads-report-btn leads-report-btn-secondary" onClick={exportCsv}>
              <Download size={16} />
              CSV
            </button>

            <button type="button" className="leads-report-btn leads-report-btn-primary" onClick={exportExcel}>
              <Download size={16} />
              Excel
            </button>
          </div>
        </div>

        {/* ================================================== */}
        {/* FILTER BAR */}
        {/* ================================================== */}

        <div className="leads-report-filter-card">
          <div className="leads-report-filter-top">
            <div className="leads-report-filter-title">
              <Filter size={17} />
              <span>Report Filters</span>

              {activeFilterCount > 0 && <span className="leads-report-filter-count">{activeFilterCount}</span>}
            </div>

            <div className="leads-report-filter-actions">
              {activeFilterCount > 0 && (
                <button type="button" className="leads-report-clear-btn" onClick={clearFilters}>
                  <X size={15} />
                  Clear Filters
                </button>
              )}

              <button type="button" className="leads-report-filter-toggle" onClick={() => setShowFilters((current) => !current)}>
                {showFilters ? "Hide Filters" : "Show Filters"}

                {showFilters ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="leads-report-filter-grid">
              <div className="leads-report-field">
                <label>From Date</label>

                <div className="leads-report-input-wrap">
                  <CalendarDays size={15} />

                  <input type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} />
                </div>
              </div>

              <div className="leads-report-field">
                <label>To Date</label>

                <div className="leads-report-input-wrap">
                  <CalendarDays size={15} />

                  <input type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} />
                </div>
              </div>

              <div className="leads-report-field">
                <label>Status</label>

                <div className="leads-report-input-wrap">
                  <Activity size={15} />

                  <select value={status} onChange={(event) => setStatus(event.target.value)}>
                    <option value="">All Statuses</option>
                    <option value="NEW">New</option>
                    <option value="CONTACTED">Contacted</option>
                    <option value="QUALIFIED">Qualified</option>
                    <option value="UNQUALIFIED">Unqualified</option>
                    <option value="CONVERTED">Converted</option>
                    <option value="LOST">Lost</option>
                  </select>
                </div>
              </div>

              <div className="leads-report-field">
                <label>Source</label>

                <div className="leads-report-input-wrap">
                  <Target size={15} />

                  <select value={source} onChange={(event) => setSource(event.target.value)}>
                    <option value="">All Sources</option>

                    {sourceOptions.map((item) => (
                      <option value={item} key={item}>
                        {statusLabel(item)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="leads-report-field">
                <label>Assigned User</label>

                <div className="leads-report-input-wrap">
                  <UserRound size={15} />

                  <select value={assignedTo} onChange={(event) => setAssignedTo(event.target.value)}>
                    <option value="">All Users</option>

                    {assignedUserOptions.map((user) => (
                      <option value={user.id} key={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="leads-report-filter-apply">
                <button type="button" className="leads-report-btn leads-report-btn-primary" onClick={() => loadReport()}>
                  <Filter size={15} />
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ================================================== */}
        {/* ERROR */}
        {/* ================================================== */}

        {error && (
          <div className="leads-report-error">
            <CircleAlert size={18} />

            <div>
              <strong>Unable to load report</strong>
              <span>{error}</span>
            </div>

            <button type="button" onClick={() => loadReport()}>
              Try Again
            </button>
          </div>
        )}

        {/* ================================================== */}
        {/* SUMMARY CARDS */}
        {/* ================================================== */}

        <div className="leads-report-summary-grid">
          <div className="leads-report-summary-card">
            <div className="leads-report-summary-icon">
              <Users size={19} />
            </div>

            <div className="leads-report-summary-content">
              <span>Total Leads</span>
              <strong>{formatNumber(summary.totalLeads)}</strong>

              <small>All leads in selected period</small>
            </div>
          </div>

          <div className="leads-report-summary-card">
            <div className="leads-report-summary-icon leads-report-summary-icon-green">
              <CheckCircle2 size={19} />
            </div>

            <div className="leads-report-summary-content">
              <span>Converted</span>
              <strong>{formatNumber(summary.convertedLeads)}</strong>

              <small className="leads-report-positive">{formatPercent(summary.conversionRate)} conversion rate</small>
            </div>
          </div>

          <div className="leads-report-summary-card">
            <div className="leads-report-summary-icon leads-report-summary-icon-blue">
              <Target size={19} />
            </div>

            <div className="leads-report-summary-content">
              <span>Qualified</span>
              <strong>{formatNumber(summary.qualifiedLeads)}</strong>

              <small>{formatPercent(summary.qualifiedRate)} of total leads</small>
            </div>
          </div>

          <div className="leads-report-summary-card">
            <div className="leads-report-summary-icon leads-report-summary-icon-orange">
              <Flame size={19} />
            </div>

            <div className="leads-report-summary-content">
              <span>Hot Leads</span>
              <strong>{formatNumber(summary.hotLeads)}</strong>

              <small>High-priority prospects</small>
            </div>
          </div>

          <div className="leads-report-summary-card">
            <div className="leads-report-summary-icon leads-report-summary-icon-red">
              <XCircle size={19} />
            </div>

            <div className="leads-report-summary-content">
              <span>Lost Leads</span>
              <strong>{formatNumber(summary.lostLeads)}</strong>

              <small>Leads marked as lost</small>
            </div>
          </div>
        </div>

        {/* ================================================== */}
        {/* SECONDARY METRICS */}
        {/* ================================================== */}

        <div className="leads-report-mini-grid">
          <div className="leads-report-mini-card">
            <div>
              <span>New Leads</span>
              <strong>{formatNumber(summary.newLeads)}</strong>
            </div>

            <div className="leads-report-mini-icon">
              <TrendingUp size={17} />
            </div>
          </div>

          <div className="leads-report-mini-card">
            <div>
              <span>Contacted</span>
              <strong>{formatNumber(summary.contactedLeads)}</strong>
            </div>

            <div className="leads-report-mini-icon">
              <Activity size={17} />
            </div>
          </div>

          <div className="leads-report-mini-card">
            <div>
              <span>Warm Leads</span>
              <strong>{formatNumber(summary.warmLeads)}</strong>
            </div>

            <div className="leads-report-mini-icon">
              <Clock3 size={17} />
            </div>
          </div>

          <div className="leads-report-mini-card">
            <div>
              <span>Cold Leads</span>
              <strong>{formatNumber(summary.coldLeads)}</strong>
            </div>

            <div className="leads-report-mini-icon">
              <ArrowDown size={17} />
            </div>
          </div>
        </div>

        {/* ================================================== */}
        {/* SECTION TABS */}
        {/* ================================================== */}

        <div className="leads-report-tabs">
          <button type="button" className={activeSection === "overview" ? "leads-report-tab leads-report-tab-active" : "leads-report-tab"} onClick={() => setActiveSection("overview")}>
            <BarChart3 size={16} />
            Overview
          </button>

          <button type="button" className={activeSection === "people" ? "leads-report-tab leads-report-tab-active" : "leads-report-tab"} onClick={() => setActiveSection("people")}>
            <Users size={16} />
            Assignment
          </button>

          <button type="button" className={activeSection === "leads" ? "leads-report-tab leads-report-tab-active" : "leads-report-tab"} onClick={() => setActiveSection("leads")}>
            <UserRound size={16} />
            Lead Details
          </button>
        </div>

        {/* ================================================== */}
        {/* OVERVIEW */}
        {/* ================================================== */}

        {activeSection === "overview" && (
          <div className="leads-report-content-grid">
            {/* STATUS */}
            <div className="leads-report-panel">
              <div className="leads-report-panel-header">
                <div>
                  <h3>Lead Status</h3>
                  <p>Distribution by current status</p>
                </div>

                <Activity size={18} />
              </div>

              <div className="leads-report-breakdown">
                {byStatus.length ? (
                  byStatus.map((item) => {
                    const percentage = summary.totalLeads > 0 ? (Number(item.leads) / Number(summary.totalLeads)) * 100 : 0;

                    return (
                      <div className="leads-report-breakdown-item" key={item.status}>
                        <div className="leads-report-breakdown-top">
                          <span>{statusLabel(item.status)}</span>

                          <strong>{formatNumber(item.leads)}</strong>
                        </div>

                        <div className="leads-report-progress">
                          <div
                            style={{
                              width: `${Math.min(percentage, 100)}%`,
                            }}
                          />
                        </div>

                        <small>{formatPercent(percentage)}</small>
                      </div>
                    );
                  })
                ) : (
                  <div className="leads-report-empty-small">No status data available.</div>
                )}
              </div>
            </div>

            {/* SOURCE */}
            <div className="leads-report-panel">
              <div className="leads-report-panel-header">
                <div>
                  <h3>Lead Sources</h3>
                  <p>Where your leads are coming from</p>
                </div>

                <Target size={18} />
              </div>

              <div className="leads-report-breakdown">
                {bySource.length ? (
                  bySource.map((item) => {
                    const percentage = summary.totalLeads > 0 ? (Number(item.leads) / Number(summary.totalLeads)) * 100 : 0;

                    return (
                      <div className="leads-report-breakdown-item" key={item.source}>
                        <div className="leads-report-breakdown-top">
                          <span>{statusLabel(item.source)}</span>

                          <strong>{formatNumber(item.leads)}</strong>
                        </div>

                        <div className="leads-report-progress">
                          <div
                            style={{
                              width: `${Math.min(percentage, 100)}%`,
                            }}
                          />
                        </div>

                        <small>{formatPercent(percentage)}</small>
                      </div>
                    );
                  })
                ) : (
                  <div className="leads-report-empty-small">No source data available.</div>
                )}
              </div>
            </div>

            {/* RATING */}
            <div className="leads-report-panel">
              <div className="leads-report-panel-header">
                <div>
                  <h3>Lead Rating</h3>
                  <p>Lead quality distribution</p>
                </div>

                <Flame size={18} />
              </div>

              <div className="leads-report-rating-grid">
                {[
                  {
                    key: "HOT",
                    label: "Hot",
                    value: summary.hotLeads,
                    className: "leads-report-rating-box-hot",
                  },
                  {
                    key: "WARM",
                    label: "Warm",
                    value: summary.warmLeads,
                    className: "leads-report-rating-box-warm",
                  },
                  {
                    key: "COLD",
                    label: "Cold",
                    value: summary.coldLeads,
                    className: "leads-report-rating-box-cold",
                  },
                ].map((item) => (
                  <div className={`leads-report-rating-box ${item.className}`} key={item.key}>
                    <span>{item.label}</span>
                    <strong>{formatNumber(item.value)}</strong>
                  </div>
                ))}
              </div>

              <div className="leads-report-rating-list">
                {byRating.map((item) => (
                  <div className="leads-report-rating-list-row" key={item.rating}>
                    <span className={getRatingClass(item.rating)}>{ratingLabel(item.rating)}</span>

                    <strong>{formatNumber(item.leads)}</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* MONTHLY */}
            <div className="leads-report-panel leads-report-panel-wide">
              <div className="leads-report-panel-header">
                <div>
                  <h3>Lead Trend</h3>
                  <p>Monthly lead creation and conversion</p>
                </div>

                <TrendingUp size={18} />
              </div>

              {monthly.length ? (
                <div className="leads-report-monthly-table-wrap">
                  <table className="leads-report-simple-table">
                    <thead>
                      <tr>
                        <th>Month</th>
                        <th>Leads</th>
                        <th>Qualified</th>
                        <th>Converted</th>
                        <th>Lost</th>
                        <th>Conversion</th>
                      </tr>
                    </thead>

                    <tbody>
                      {monthly.map((item) => {
                        const conversion = Number(item.leads) > 0 ? (Number(item.converted) / Number(item.leads)) * 100 : 0;

                        return (
                          <tr key={item.month}>
                            <td>
                              <strong>{formatMonth(item.month)}</strong>
                            </td>

                            <td>{formatNumber(item.leads)}</td>

                            <td>{formatNumber(item.qualified)}</td>

                            <td className="leads-report-table-positive">{formatNumber(item.converted)}</td>

                            <td className="leads-report-table-negative">{formatNumber(item.lost)}</td>

                            <td>
                              <span className="leads-report-percentage-pill">{formatPercent(conversion)}</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="leads-report-empty">
                  <BarChart3 size={30} />
                  <strong>No monthly data</strong>
                  <span>There is no trend data for the selected filters.</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================================================== */}
        {/* ASSIGNMENT */}
        {/* ================================================== */}

        {activeSection === "people" && (
          <div className="leads-report-content-grid">
            <div className="leads-report-panel leads-report-panel-wide">
              <div className="leads-report-panel-header">
                <div>
                  <h3>Assigned Users</h3>
                  <p>Lead workload and conversion by user</p>
                </div>

                <UserRound size={18} />
              </div>

              <div className="leads-report-scroll-table">
                <table className="leads-report-simple-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Leads</th>
                      <th>Converted</th>
                      <th>Conversion Rate</th>
                    </tr>
                  </thead>

                  <tbody>
                    {byAssignedUser.length ? (
                      byAssignedUser.map((item) => (
                        <tr key={item.userId || `user-${item.name}`}>
                          <td>
                            <div className="leads-report-person">
                              <div className="leads-report-avatar">
                                {String(item.name || "U")
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>

                              <div>
                                <strong>{item.name || "Unassigned"}</strong>

                                {item.email && <span>{item.email}</span>}
                              </div>
                            </div>
                          </td>

                          <td>{formatNumber(item.leads)}</td>

                          <td className="leads-report-table-positive">{formatNumber(item.converted)}</td>

                          <td>
                            <span className="leads-report-percentage-pill">{formatPercent(item.conversionRate)}</span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="leads-report-table-empty">
                          No assigned user data available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="leads-report-panel leads-report-panel-wide">
              <div className="leads-report-panel-header">
                <div>
                  <h3>Assigned Teams</h3>
                  <p>Lead distribution across teams</p>
                </div>

                <Users size={18} />
              </div>

              <div className="leads-report-scroll-table">
                <table className="leads-report-simple-table">
                  <thead>
                    <tr>
                      <th>Team</th>
                      <th>Leads</th>
                      <th>Converted</th>
                      <th>Conversion Rate</th>
                    </tr>
                  </thead>

                  <tbody>
                    {byAssignedTeam.length ? (
                      byAssignedTeam.map((item) => (
                        <tr key={item.teamId || `team-${item.name}`}>
                          <td>
                            <div className="leads-report-person">
                              <div className="leads-report-team-icon">
                                <Users size={15} />
                              </div>

                              <div>
                                <strong>{item.name || "Unassigned"}</strong>
                              </div>
                            </div>
                          </td>

                          <td>{formatNumber(item.leads)}</td>

                          <td className="leads-report-table-positive">{formatNumber(item.converted)}</td>

                          <td>
                            <span className="leads-report-percentage-pill">{formatPercent(item.conversionRate)}</span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="leads-report-table-empty">
                          No assigned team data available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================================================== */}
        {/* LEAD DETAILS */}
        {/* ================================================== */}

        {activeSection === "leads" && (
          <div className="leads-report-panel leads-report-details-panel">
            <div className="leads-report-panel-header leads-report-details-header">
              <div>
                <h3>Lead Details</h3>
                <p>Detailed records returned by the report</p>
              </div>

              <div className="leads-report-detail-actions">
                <div className="leads-report-search">
                  <Search size={16} />

                  <input type="text" placeholder="Search leads..." value={search} onChange={(event) => setSearch(event.target.value)} />

                  {search && (
                    <button type="button" onClick={() => setSearch("")} aria-label="Clear search">
                      <X size={14} />
                    </button>
                  )}
                </div>

                <span className="leads-report-record-count">{formatNumber(filteredRows.length)} records</span>
              </div>
            </div>

            <div className="leads-report-details-table">
              <table>
                <thead>
                  <tr>
                    <th>
                      <button type="button" onClick={() => handleSort("name")}>
                        Lead
                        <SortIcon field="name" />
                      </button>
                    </th>

                    <th>Contact</th>

                    <th>
                      <button type="button" onClick={() => handleSort("company")}>
                        Company
                        <SortIcon field="company" />
                      </button>
                    </th>

                    <th>
                      <button type="button" onClick={() => handleSort("source")}>
                        Source
                        <SortIcon field="source" />
                      </button>
                    </th>

                    <th>
                      <button type="button" onClick={() => handleSort("status")}>
                        Status
                        <SortIcon field="status" />
                      </button>
                    </th>

                    <th>
                      <button type="button" onClick={() => handleSort("rating")}>
                        Rating
                        <SortIcon field="rating" />
                      </button>
                    </th>

                    <th>Assigned To</th>

                    <th>
                      <button type="button" onClick={() => handleSort("createdAt")}>
                        Created
                        <SortIcon field="createdAt" />
                      </button>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredRows.length ? (
                    filteredRows.map((lead, index) => (
                      <tr key={lead?._id || lead?.id || `lead-${index}`}>
                        <td>
                          <div className="leads-report-lead-cell">
                            <div className="leads-report-lead-avatar">{displayName(lead).charAt(0).toUpperCase()}</div>

                            <div>
                              <strong>{displayName(lead)}</strong>

                              {lead?.jobTitle && <span>{lead.jobTitle}</span>}
                            </div>
                          </div>
                        </td>

                        <td>
                          <div className="leads-report-contact-cell">
                            {lead?.email && <span>{lead.email}</span>}

                            {lead?.phone && <small>{lead.phone}</small>}

                            {!lead?.email && !lead?.phone && <span className="leads-report-muted">No contact details</span>}
                          </div>
                        </td>

                        <td>{lead?.companyName || <span className="leads-report-muted">—</span>}</td>

                        <td>
                          <span className="leads-report-source-pill">{statusLabel(lead?.source || "manual")}</span>
                        </td>

                        <td>
                          <span className={getStatusClass(lead?.status)}>{statusLabel(lead?.status)}</span>
                        </td>

                        <td>
                          <span className={getRatingClass(lead?.rating)}>{ratingLabel(lead?.rating)}</span>
                        </td>

                        <td>
                          <div className="leads-report-assignee">
                            <div className="leads-report-small-avatar">{(lead?.assignedTo?.name || lead?.assignedTo?.email || "U").charAt(0).toUpperCase()}</div>

                            <span>{lead?.assignedTo?.name || lead?.assignedTo?.email || "Unassigned"}</span>
                          </div>
                        </td>

                        <td>
                          <span className="leads-report-date">{formatDate(lead?.createdAt)}</span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="leads-report-no-data">
                        <div>
                          <Search size={28} />
                          <strong>No leads found</strong>
                          <span>Try changing your filters or search term.</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================================================== */}
        {/* FOOTER */}
        {/* ================================================== */}

        <div className="leads-report-footer">
          <span>
            Showing {formatNumber(filteredRows.length)} of {formatNumber(rows.length)} leads
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

/*
 * ============================================================
 * STYLES
 * ============================================================
 */

const styles = `.leads-report-input-wrap select{color:var(--crm-text,#111827);background:var(--crm-surface,#fff);color-scheme:light}.leads-report-input-wrap select option{color:var(--crm-text,#111827);background:var(--crm-surface,#fff)}.leads-report-input-wrap input[type="date"]{color-scheme:light;-webkit-appearance:auto;appearance:auto;accent-color:var(--crm-primary,#2563eb);cursor:pointer}.leads-report-input-wrap input[type="date"]::-webkit-calendar-picker-indicator{display:block;opacity:1!important;visibility:visible!important;cursor:pointer;width:16px;height:16px}.dark .leads-report-input-wrap input[type="date"],[data-theme="dark"] .leads-report-input-wrap input[type="date"],html.dark .leads-report-input-wrap input[type="date"],body.dark .leads-report-input-wrap input[type="date"],body.dark-mode .leads-report-input-wrap input[type="date"],html.dark-mode .leads-report-input-wrap input[type="date"],.dark-theme .leads-report-input-wrap input[type="date"]{color-scheme:dark;background:transparent;color:var(--crm-text,#f8fafc)}.dark .leads-report-input-wrap select{color:var(--crm-text,#f3f4f6);background:var(--crm-surface,#111827);color-scheme:dark}.dark .leads-report-input-wrap select option{color:var(--crm-text,#f3f4f6);background:var(--crm-surface,#111827)}[data-theme="dark"] .leads-report-input-wrap select{color:var(--crm-text,#f3f4f6);background:var(--crm-surface,#111827);color-scheme:dark}[data-theme="dark"] .leads-report-input-wrap select option{color:var(--crm-text,#f3f4f6);background:var(--crm-surface,#111827)}.leads-report-page{width:100%; min-width:0; padding:22px; color:var(--crm-text,#1f2937);}.leads-report-header{display:flex; align-items:center; justify-content:space-between; gap:18px; margin-bottom:18px;}.leads-report-header-left{display:flex; align-items:center; gap:13px; min-width:0;}.leads-report-title-icon{width:44px; height:44px; min-width:44px; display:flex; align-items:center; justify-content:center; border-radius:12px; background:var(--crm-primary,#2563eb); color:#fff; box-shadow:0 8px 20px rgba(37,99,235,.18);}.leads-report-title{margin:0; font-size:24px; line-height:1.25; font-weight:400; color:var(--crm-text,#1f2937);}.leads-report-subtitle{margin:5px 0 0; font-size:13px; line-height:1.5; color:var(--crm-muted,#6b7280);}.leads-report-header-actions{display:flex; align-items:center; justify-content:flex-end; gap:8px; flex-wrap:wrap;}.leads-report-btn{min-height:38px; border:1px solid var(--crm-border,#e5e7eb); border-radius:9px; padding:0 13px; display:inline-flex; align-items:center; justify-content:center; gap:7px; font-size:13px; font-weight:400; cursor:pointer; transition:.18s ease; white-space:nowrap;}.leads-report-btn:disabled{opacity:.6; cursor:not-allowed;}.leads-report-btn-secondary{background:var(--crm-surface,#fff); color:var(--crm-text,#374151);}.leads-report-btn-secondary:hover:not(:disabled){background:var(--crm-bg,#f8fafc); border-color:var(--crm-primary,#2563eb);}.leads-report-btn-primary{background:var(--crm-primary,#2563eb); border-color:var(--crm-primary,#2563eb); color:#fff;}.leads-report-btn-primary:hover:not(:disabled){filter:brightness(.95);}.leads-report-filter-card{border:1px solid var(--crm-border,#e5e7eb); background:var(--crm-surface,#fff); border-radius:12px; margin-bottom:18px; overflow:hidden;}.leads-report-filter-top{min-height:54px; padding:0 15px; display:flex; align-items:center; justify-content:space-between; gap:12px;}.leads-report-filter-title{display:flex; align-items:center; gap:8px; font-size:13px; font-weight:400; color:var(--crm-text,#374151);}.leads-report-filter-count{min-width:20px; height:20px; padding:0 6px; display:inline-flex; align-items:center; justify-content:center; border-radius:20px; background:var(--crm-primary,#2563eb); color:#fff; font-size:13px; font-weight:400;}.leads-report-filter-actions{display:flex; align-items:center; gap:8px;}.leads-report-clear-btn, .leads-report-filter-toggle{height:32px; padding:0 10px; display:inline-flex; align-items:center; gap:6px; border-radius:8px; border:1px solid var(--crm-border,#e5e7eb); background:transparent; color:var(--crm-muted,#6b7280); font-size:13px; font-weight:400; cursor:pointer;}.leads-report-clear-btn:hover, .leads-report-filter-toggle:hover{background:var(--crm-bg,#f8fafc); color:var(--crm-text,#374151);}.leads-report-filter-grid{border-top:1px solid var(--crm-border,#e5e7eb); padding:15px; display:grid; grid-template-columns:repeat(5,minmax(0,1fr)) auto; gap:12px; align-items:end;}.leads-report-field{min-width:0;}.leads-report-field label{display:block; margin:0 0 6px; font-size:13px; line-height:1.2; font-weight:400; color:var(--crm-muted,#6b7280);}.leads-report-input-wrap{min-height:38px; display:flex; align-items:center; gap:8px; padding:0 10px; border:1px solid var(--crm-border,#e5e7eb); border-radius:8px; background:var(--crm-surface,#fff); color:var(--crm-muted,#6b7280);}.leads-report-input-wrap:focus-within{border-color:var(--crm-primary,#2563eb); box-shadow:0 0 0 3px rgba(37,99,235,.08);}.leads-report-input-wrap input, .leads-report-input-wrap select{width:100%; min-width:0; height:36px; border:0; outline:0; background:transparent; color:var(--crm-text,#374151); font-size:13px;}.leads-report-input-wrap select{cursor:pointer;}.leads-report-filter-apply{display:flex; justify-content:flex-end;}.leads-report-error{margin-bottom:18px; padding:12px 14px; border:1px solid rgba(239,68,68,.22); border-radius:10px; background:rgba(239,68,68,.06); display:flex; align-items:center; gap:10px; color:#dc2626;}.leads-report-error>div{flex:1; min-width:0; display:flex; flex-direction:column; gap:2px;}.leads-report-error strong{font-size:13px;}.leads-report-error span{font-size:13px; color:var(--crm-muted,#6b7280);}.leads-report-error button{border:0; background:transparent; color:#dc2626; font-size:13px; font-weight:400; cursor:pointer;}.leads-report-summary-grid{display:grid; grid-template-columns:repeat(5,minmax(0,1fr)); gap:12px; margin-bottom:12px;}.leads-report-summary-card{min-width:0; padding:16px; border:1px solid var(--crm-border,#e5e7eb); border-radius:12px; background:var(--crm-surface,#fff); display:flex; align-items:flex-start; gap:12px;}.leads-report-summary-icon{width:38px; height:38px; min-width:38px; display:flex; align-items:center; justify-content:center; border-radius:10px; background:rgba(37,99,235,.1); color:var(--crm-primary,#2563eb);}.leads-report-summary-icon-green{background:rgba(16,185,129,.1); color:#059669;}.leads-report-summary-icon-blue{background:rgba(59,130,246,.1); color:#2563eb;}.leads-report-summary-icon-orange{background:rgba(245,158,11,.11); color:#d97706;}.leads-report-summary-icon-red{background:rgba(239,68,68,.1); color:#dc2626;}.leads-report-summary-content{min-width:0; display:flex; flex-direction:column;}.leads-report-summary-content>span{font-size:13px; color:var(--crm-muted,#6b7280); font-weight:400;}.leads-report-summary-content>strong{margin-top:4px; font-size:22px; line-height:1.15; font-weight:400; color:var(--crm-text,#1f2937);}.leads-report-summary-content>small{margin-top:4px; font-size:13px; color:var(--crm-muted,#6b7280); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;}.leads-report-positive{color:#059669!important;}.leads-report-mini-grid{display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:12px; margin-bottom:18px;}.leads-report-mini-card{min-width:0; min-height:66px; padding:12px 14px; border:1px solid var(--crm-border,#e5e7eb); border-radius:11px; background:var(--crm-surface,#fff); display:flex; align-items:center; justify-content:space-between; gap:12px;}.leads-report-mini-card>div:first-child{min-width:0; display:flex; flex-direction:column;}.leads-report-mini-card span{font-size:13px; color:var(--crm-muted,#6b7280);}.leads-report-mini-card strong{margin-top:3px; font-size:17px; color:var(--crm-text,#1f2937);}.leads-report-mini-icon{width:32px; height:32px; min-width:32px; display:flex; align-items:center; justify-content:center; border-radius:9px; background:var(--crm-bg,#f8fafc); color:var(--crm-primary,#2563eb);}.leads-report-tabs{display:flex; align-items:center; gap:3px; margin-bottom:14px; padding:4px; border:1px solid var(--crm-border,#e5e7eb); border-radius:10px; background:var(--crm-bg,#f8fafc); width:max-content; max-width:100%;}.leads-report-tab{height:34px; padding:0 12px; display:inline-flex; align-items:center; gap:7px; border:0; border-radius:7px; background:transparent; color:var(--crm-muted,#6b7280); font-size:13px; font-weight:400; cursor:pointer;}.leads-report-tab:hover{color:var(--crm-text,#374151);}.leads-report-tab-active{background:var(--crm-surface,#fff); color:var(--crm-primary,#2563eb); box-shadow:0 1px 3px rgba(15,23,42,.08);}.leads-report-content-grid{display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:14px;}.leads-report-panel{min-width:0; border:1px solid var(--crm-border,#e5e7eb); border-radius:12px; background:var(--crm-surface,#fff); overflow:hidden;}.leads-report-panel-wide{grid-column:1 / -1;}.leads-report-panel-header{min-height:64px; padding:14px 16px; display:flex; align-items:center; justify-content:space-between; gap:12px; border-bottom:1px solid var(--crm-border,#e5e7eb);}.leads-report-panel-header>div{min-width:0;}.leads-report-panel-header h3{margin:0; font-size:14px; line-height:1.3; font-weight:400; color:var(--crm-text,#1f2937);}.leads-report-panel-header p{margin:4px 0 0; font-size:13px; color:var(--crm-muted,#6b7280);}.leads-report-panel-header>svg{color:var(--crm-muted,#6b7280);}.leads-report-breakdown{padding:14px 16px 16px;}.leads-report-breakdown-item{margin-bottom:14px;}.leads-report-breakdown-item:last-child{margin-bottom:0;}.leads-report-breakdown-top{display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:6px;}.leads-report-breakdown-top span{font-size:13px; color:var(--crm-text,#374151);}.leads-report-breakdown-top strong{font-size:13px; color:var(--crm-text,#1f2937);}.leads-report-progress{width:100%; height:6px; border-radius:20px; overflow:hidden; background:var(--crm-bg,#f1f5f9);}.leads-report-progress>div{height:100%; border-radius:20px; background:var(--crm-primary,#2563eb); transition:width .3s ease;}.leads-report-breakdown-item small{display:block; margin-top:4px; font-size:13px; color:var(--crm-muted,#6b7280);}.leads-report-rating-grid{padding:14px 16px 8px; display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:9px;}.leads-report-rating-box{min-width:0; padding:12px 10px; border:1px solid var(--crm-border,#e5e7eb); border-radius:9px; display:flex; flex-direction:column; gap:4px;}.leads-report-rating-box span{font-size:13px; font-weight:400;}.leads-report-rating-box strong{font-size:18px;}.leads-report-rating-box-hot{background:rgba(239,68,68,.05); border-color:rgba(239,68,68,.15); color:#dc2626;}.leads-report-rating-box-warm{background:rgba(245,158,11,.05); border-color:rgba(245,158,11,.15); color:#d97706;}.leads-report-rating-box-cold{background:rgba(59,130,246,.05); border-color:rgba(59,130,246,.15); color:#2563eb;}.leads-report-rating-list{padding:8px 16px 16px;}.leads-report-rating-list-row{min-height:34px; display:flex; align-items:center; justify-content:space-between; gap:10px; border-bottom:1px solid var(--crm-border,#e5e7eb);}.leads-report-rating-list-row:last-child{border-bottom:0;}.leads-report-rating{display:inline-flex; align-items:center; min-height:23px; padding:0 8px; border-radius:20px; font-size:13px; font-weight:400; text-transform:capitalize; background:var(--crm-bg,#f8fafc); color:var(--crm-muted,#6b7280);}.leads-report-rating-hot{background:rgba(239,68,68,.1); color:#dc2626;}.leads-report-rating-warm{background:rgba(245,158,11,.1); color:#d97706;}.leads-report-rating-cold{background:rgba(59,130,246,.1); color:#2563eb;}.leads-report-monthly-table-wrap{overflow:auto; max-height:300px;}.leads-report-simple-table{width:100%; border-collapse:collapse;}.leads-report-simple-table th{position:sticky; top:0; z-index:1; padding:10px 14px; text-align:left; background:var(--crm-bg,#f8fafc); border-bottom:1px solid var(--crm-border,#e5e7eb); color:var(--crm-muted,#6b7280); font-size:13px; font-weight:400; text-transform:uppercase; letter-spacing:.02em; white-space:nowrap;}.leads-report-simple-table td{padding:11px 14px; border-bottom:1px solid var(--crm-border,#e5e7eb); color:var(--crm-text,#374151); font-size:13px; white-space:nowrap;}.leads-report-simple-table tbody tr:last-child td{border-bottom:0;}.leads-report-simple-table tbody tr:hover{background:var(--crm-bg,#f8fafc);}.leads-report-table-positive{color:#059669!important; font-weight:400;}.leads-report-table-negative{color:#dc2626!important; font-weight:400;}.leads-report-percentage-pill{display:inline-flex; align-items:center; min-height:23px; padding:0 8px; border-radius:20px; background:rgba(37,99,235,.09); color:var(--crm-primary,#2563eb); font-size:13px; font-weight:400;}.leads-report-empty{min-height:180px; display:flex; align-items:center; justify-content:center; flex-direction:column; gap:6px; color:var(--crm-muted,#6b7280);}.leads-report-empty strong{font-size:13px; color:var(--crm-text,#374151);}.leads-report-empty span{font-size:13px;}.leads-report-empty-small{padding:28px 10px; text-align:center; color:var(--crm-muted,#6b7280); font-size:13px;}.leads-report-scroll-table{max-height:350px; overflow:auto;}.leads-report-person{display:flex; align-items:center; gap:9px; min-width:170px;}.leads-report-person>div:last-child{min-width:0; display:flex; flex-direction:column;}.leads-report-person strong{max-width:220px; overflow:hidden; text-overflow:ellipsis; font-size:13px; color:var(--crm-text,#374151);}.leads-report-person span{max-width:220px; margin-top:2px; overflow:hidden; text-overflow:ellipsis; font-size:13px; color:var(--crm-muted,#6b7280);}.leads-report-avatar, .leads-report-small-avatar{display:flex; align-items:center; justify-content:center; border-radius:50%; flex-shrink:0; background:rgba(37,99,235,.1); color:var(--crm-primary,#2563eb); font-weight:400;}.leads-report-avatar{width:32px; height:32px; font-size:13px;}.leads-report-small-avatar{width:27px; height:27px; font-size:13px;}.leads-report-team-icon{width:32px; height:32px; min-width:32px; display:flex; align-items:center; justify-content:center; border-radius:9px; background:rgba(37,99,235,.1); color:var(--crm-primary,#2563eb);}.leads-report-table-empty{height:100px; text-align:center!important; color:var(--crm-muted,#6b7280)!important;}.leads-report-details-panel{overflow:hidden;}.leads-report-details-header{align-items:center;}.leads-report-detail-actions{display:flex!important; align-items:center; justify-content:flex-end; gap:10px;}.leads-report-search{width:260px; height:34px; display:flex; align-items:center; gap:7px; padding:0 9px; border:1px solid var(--crm-border,#e5e7eb); border-radius:8px; background:var(--crm-surface,#fff); color:var(--crm-muted,#6b7280);}.leads-report-search:focus-within{border-color:var(--crm-primary,#2563eb); box-shadow:0 0 0 3px rgba(37,99,235,.08);}.leads-report-search input{width:100%; min-width:0; border:0; outline:0; background:transparent; color:var(--crm-text,#374151); font-size:13px;}.leads-report-search input::placeholder{color:var(--crm-muted,#9ca3af);}.leads-report-search button{width:22px; height:22px; padding:0; display:flex; align-items:center; justify-content:center; border:0; border-radius:5px; background:var(--crm-bg,#f1f5f9); color:var(--crm-muted,#6b7280); cursor:pointer;}.leads-report-search button:hover{color:var(--crm-text,#374151);}.leads-report-record-count{font-size:13px; color:var(--crm-muted,#6b7280); white-space:nowrap;}.leads-report-details-table{width:100%; overflow:auto; max-height:560px;}.leads-report-details-table table{width:100%; min-width:1120px; border-collapse:collapse;}.leads-report-details-table th{position:sticky; top:0; z-index:2; height:43px; padding:0 13px; text-align:left; background:var(--crm-bg,#f8fafc); border-bottom:1px solid var(--crm-border,#e5e7eb); color:var(--crm-muted,#6b7280); font-size:13px; font-weight:400; text-transform:uppercase; white-space:nowrap;}.leads-report-details-table th button{display:inline-flex; align-items:center; gap:4px; padding:0; border:0; background:transparent; color:inherit; font:inherit; cursor:pointer;}.leads-report-details-table th button:hover{color:var(--crm-text,#374151);}.leads-report-sort-muted{opacity:.45;}.leads-report-details-table td{height:58px; padding:8px 13px; border-bottom:1px solid var(--crm-border,#e5e7eb); color:var(--crm-text,#374151); font-size:13px; white-space:nowrap;}.leads-report-details-table tbody tr:hover{background:var(--crm-bg,#f8fafc);}.leads-report-lead-cell{min-width:190px; display:flex; align-items:center; gap:9px;}.leads-report-lead-cell>div:last-child{min-width:0; display:flex; flex-direction:column;}.leads-report-lead-cell strong{max-width:220px; overflow:hidden; text-overflow:ellipsis; color:var(--crm-text,#374151); font-size:13px;}.leads-report-lead-cell span{max-width:220px; margin-top:2px; overflow:hidden; text-overflow:ellipsis; color:var(--crm-muted,#6b7280); font-size:13px;}.leads-report-lead-avatar{width:31px; height:31px; min-width:31px; display:flex; align-items:center; justify-content:center; border-radius:9px; background:rgba(37,99,235,.1); color:var(--crm-primary,#2563eb); font-size:13px; font-weight:400;}.leads-report-contact-cell{display:flex; flex-direction:column; min-width:170px; max-width:210px;}.leads-report-contact-cell span{overflow:hidden; text-overflow:ellipsis; font-size:13px;}.leads-report-contact-cell small{margin-top:2px; color:var(--crm-muted,#6b7280); font-size:13px;}.leads-report-source-pill{display:inline-flex; align-items:center; max-width:120px; min-height:24px; padding:0 8px; overflow:hidden; text-overflow:ellipsis; border-radius:6px; background:var(--crm-bg,#f1f5f9); color:var(--crm-text,#475569); font-size:13px; font-weight:400; text-transform:capitalize;}.leads-report-status{display:inline-flex; align-items:center; min-height:24px; padding:0 8px; border-radius:20px; background:var(--crm-bg,#f1f5f9); color:var(--crm-muted,#64748b); font-size:13px; font-weight:400;}.leads-report-status-new{background:rgba(59,130,246,.1); color:#2563eb;}.leads-report-status-contacted{background:rgba(139,92,246,.1); color:#7c3aed;}.leads-report-status-qualified{background:rgba(16,185,129,.1); color:#059669;}.leads-report-status-unqualified{background:rgba(100,116,139,.1); color:#64748b;}.leads-report-status-converted{background:rgba(16,185,129,.12); color:#047857;}.leads-report-status-lost{background:rgba(239,68,68,.1); color:#dc2626;}.leads-report-assignee{display:flex; align-items:center; gap:7px; min-width:130px;}.leads-report-assignee>span{max-width:150px; overflow:hidden; text-overflow:ellipsis;}.leads-report-date{color:var(--crm-muted,#6b7280); font-size:13px;}.leads-report-muted{color:var(--crm-muted,#9ca3af)!important;}.leads-report-no-data{height:260px!important; text-align:center!important;}.leads-report-no-data>div{display:flex; align-items:center; justify-content:center; flex-direction:column; gap:7px; color:var(--crm-muted,#6b7280);}.leads-report-no-data strong{color:var(--crm-text,#374151); font-size:13px;}.leads-report-no-data span{font-size:13px;}.leads-report-footer{margin-top:14px; padding:0 2px; display:flex; align-items:center; justify-content:space-between; gap:12px; color:var(--crm-muted,#6b7280); font-size:13px;}.leads-report-loading{min-height:420px; display:flex; align-items:center; justify-content:center; gap:13px; color:var(--crm-muted,#6b7280);}.leads-report-loading-icon{width:54px; height:54px; display:flex; align-items:center; justify-content:center; border-radius:14px; background:rgba(37,99,235,.09); color:var(--crm-primary,#2563eb);}.leads-report-loading h3{margin:0; color:var(--crm-text,#374151); font-size:15px;}.leads-report-loading p{margin:5px 0 0; font-size:13px;}.leads-report-spin{animation:leadsReportSpin 1s linear infinite;}
@keyframes leadsReportSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)} }
@media(max-width:1200px){.leads-report-summary-grid{grid-template-columns:repeat(3,minmax(0,1fr));}.leads-report-filter-grid{grid-template-columns:repeat(3,minmax(0,1fr));}.leads-report-filter-apply{justify-content:flex-start;} }
@media(max-width:900px){.leads-report-page{padding:16px;}.leads-report-header{align-items:flex-start; flex-direction:column;}.leads-report-header-actions{width:100%; justify-content:flex-start;}.leads-report-summary-grid{grid-template-columns:repeat(2,minmax(0,1fr));}.leads-report-mini-grid{grid-template-columns:repeat(2,minmax(0,1fr));}.leads-report-content-grid{grid-template-columns:1fr;}.leads-report-panel-wide{grid-column:auto;}.leads-report-filter-grid{grid-template-columns:repeat(2,minmax(0,1fr));}.leads-report-detail-actions{flex-direction:column; align-items:flex-end!important;} }
@media(max-width:620px){.leads-report-page{padding:12px;}.leads-report-title{font-size:20px;}.leads-report-header-actions{display:grid; grid-template-columns:repeat(2,minmax(0,1fr));}.leads-report-header-actions .leads-report-btn{width:100%;}.leads-report-summary-grid{grid-template-columns:1fr;}.leads-report-mini-grid{grid-template-columns:1fr 1fr;}.leads-report-filter-top{align-items:flex-start; flex-direction:column; padding:12px;}.leads-report-filter-actions{width:100%; justify-content:space-between;}.leads-report-filter-grid{grid-template-columns:1fr;}.leads-report-tabs{width:100%; overflow:auto;}.leads-report-tab{flex:1; justify-content:center; white-space:nowrap;}.leads-report-panel-header{align-items:flex-start; flex-direction:column;}.leads-report-details-header{align-items:flex-start;}.leads-report-detail-actions{width:100%; align-items:stretch!important;}.leads-report-search{width:100%;}.leads-report-footer{flex-direction:column; align-items:flex-start;} }
`;

export default LeadsReport;
