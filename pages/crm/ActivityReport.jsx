import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Activity, ArrowDown, ArrowUp, BarChart3, CalendarDays, CheckCircle2, ChevronDown, ChevronUp, Clock3, Download, Filter, ListChecks, Loader2, RefreshCw, Search, UserRound, Users, X, XCircle } from "lucide-react";
import * as XLSX from "xlsx";
import { getActivitiesReport } from "../../api/report.api";
import useBusiness from "../../hooks/useBusiness";
import { showAuthAlert } from "../../components/auth/authAlert";

/*
 * ============================================================
 * HELPERS
 * ============================================================
 */

const formatNumber = (value) => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "0";
  }

  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 1,
  }).format(number);
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

const formatDateTime = (value) => {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
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

const labelize = (value) => {
  if (!value) {
    return "Unknown";
  }

  return String(value)
    .replace(/_/g, " ")
    .replace(/-/g, " ")
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

const getErrorMessage = (error, fallback = "Unable to load activity report.") => {
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

/*
 * ============================================================
 * COMPONENT
 * ============================================================
 */

const ActivityReport = () => {
  const { businessId, loading: businessLoading, error: businessError } = useBusiness();

  const [report, setReport] = useState(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  const [search, setSearch] = useState("");

  const [showFilters, setShowFilters] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");

  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");

  const [visibleRows, setVisibleRows] = useState(50);

  /*
   * ============================================================
   * BUSINESS ERROR
   * ============================================================
   */

  useEffect(() => {
    if (businessError && !businessId && !businessLoading) {
      setError(businessError || "Unable to load your business workspace.");
    }
  }, [businessError, businessId, businessLoading]);

  /*
   * ============================================================
   * ERROR ALERT
   * ============================================================
   */

  const showErrorAlert = useCallback(async (message) => {
    await showAuthAlert({
      icon: "error",
      title: "Unable to load activity report",
      text: message || "Something went wrong while loading the activity report.",
      confirmButtonText: "OK",
    });
  }, []);

  /*
   * ============================================================
   * LOAD REPORT
   * ============================================================
   */

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

          type: customFilters.type !== undefined ? customFilters.type : type,

          status: customFilters.status !== undefined ? customFilters.status : status,

          assignedTo: customFilters.assignedTo !== undefined ? customFilters.assignedTo : assignedTo,
        };

        Object.keys(params).forEach((key) => {
          if (params[key] === "" || params[key] === null || params[key] === undefined) {
            delete params[key];
          }
        });

        const response = await getActivitiesReport(businessId, params);

        const data = normalizeResponse(response);

        setReport({
          filters: data?.filters || {},
          summary: data?.summary || {},
          byType: Array.isArray(data?.byType) ? data.byType : [],
          byStatus: Array.isArray(data?.byStatus) ? data.byStatus : [],
          byAssignedUser: Array.isArray(data?.byAssignedUser) ? data.byAssignedUser : [],
          monthly: Array.isArray(data?.monthly) ? data.monthly : [],
          rows: Array.isArray(data?.rows) ? data.rows : [],
        });

        setVisibleRows(50);
      } catch (err) {
        const message = getErrorMessage(err, "Unable to load activity report.");

        setError(message);

        if (!silent) {
          await showErrorAlert(message);
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [businessId, businessLoading, businessError, dateFrom, dateTo, type, status, assignedTo, showErrorAlert]
  );

  useEffect(() => {
    if (businessId && !businessLoading) {
      loadReport();
    }
  }, [businessId, businessLoading]);

  /*
   * ============================================================
   * REPORT DATA
   * ============================================================
   */

  const summary = report?.summary || {};

  const rows = Array.isArray(report?.rows) ? report.rows : [];

  const byType = Array.isArray(report?.byType) ? report.byType : [];

  const byStatus = Array.isArray(report?.byStatus) ? report.byStatus : [];

  const byAssignedUser = Array.isArray(report?.byAssignedUser) ? report.byAssignedUser : [];

  const monthly = Array.isArray(report?.monthly) ? report.monthly : [];

  /*
   * ============================================================
   * TYPE OPTIONS
   * ============================================================
   */

  const typeOptions = useMemo(() => {
    return Array.from(new Set(byType.map((item) => String(item?.type || "").trim()).filter(Boolean))).sort((a, b) => a.localeCompare(b));
  }, [byType]);

  /*
   * ============================================================
   * STATUS OPTIONS
   * ============================================================
   */

  const statusOptions = useMemo(() => {
    return Array.from(new Set(byStatus.map((item) => String(item?.status || "").trim()).filter(Boolean))).sort((a, b) => a.localeCompare(b));
  }, [byStatus]);

  /*
   * ============================================================
   * ASSIGNED USER OPTIONS
   * ============================================================
   */

  const assignedUserOptions = useMemo(() => {
    return byAssignedUser
      .filter((item) => item?.assignedTo)
      .map((item) => ({
        id: String(item.assignedTo),
        name: item?.name || item?.email || "Unknown User",
        email: item?.email || "",
      }))
      .sort((a, b) => String(a.name).localeCompare(String(b.name)));
  }, [byAssignedUser]);

  /*
   * ============================================================
   * FILTERED ROWS
   * ============================================================
   */

  const filteredRows = useMemo(() => {
    const query = String(search || "")
      .trim()
      .toLowerCase();

    let result = [...rows];

    if (query) {
      result = result.filter((activity) => {
        const assignedName = activity?.assignedTo?.name || activity?.assignedTo?.email || "";

        const values = [
          activity?.title,
          activity?.name,
          activity?.description,
          activity?.type,
          activity?.status,
          activity?.subject,
          activity?.activityType,
          assignedName,
          activity?.assignedTo?.email,
          activity?.contactId?.name,
          activity?.contactId?.email,
          activity?.companyId?.name,
          activity?.leadId?.name,
          activity?.dealId?.name,
        ];

        return values.some((value) =>
          String(value || "")
            .toLowerCase()
            .includes(query)
        );
      });
    }

    result.sort((a, b) => {
      let first = "";
      let second = "";

      if (sortField === "type") {
        first = a?.type || a?.activityType || "";
        second = b?.type || b?.activityType || "";
      } else if (sortField === "status") {
        first = a?.status || "";
        second = b?.status || "";
      } else if (sortField === "assignedTo") {
        first = a?.assignedTo?.name || a?.assignedTo?.email || "";

        second = b?.assignedTo?.name || b?.assignedTo?.email || "";
      } else if (sortField === "title") {
        first = a?.title || a?.name || a?.subject || "";

        second = b?.title || b?.name || b?.subject || "";
      } else {
        first = new Date(a?.createdAt || 0).getTime();
        second = new Date(b?.createdAt || 0).getTime();
      }

      if (typeof first === "string" && typeof second === "string") {
        const aValue = first.toLowerCase();
        const bValue = second.toLowerCase();

        if (aValue < bValue) {
          return sortDirection === "asc" ? -1 : 1;
        }

        if (aValue > bValue) {
          return sortDirection === "asc" ? 1 : -1;
        }

        return 0;
      }

      if (first < second) {
        return sortDirection === "asc" ? -1 : 1;
      }

      if (first > second) {
        return sortDirection === "asc" ? 1 : -1;
      }

      return 0;
    });

    return result;
  }, [rows, search, sortField, sortDirection]);

  const displayedRows = useMemo(() => {
    return filteredRows.slice(0, visibleRows);
  }, [filteredRows, visibleRows]);

  /*
   * ============================================================
   * MAX VALUES
   * ============================================================
   */

  const maxTypeCount = useMemo(() => {
    return Math.max(1, ...byType.map((item) => Number(item?.count) || 0));
  }, [byType]);

  const maxStatusCount = useMemo(() => {
    return Math.max(1, ...byStatus.map((item) => Number(item?.count) || 0));
  }, [byStatus]);

  const maxMonthlyCount = useMemo(() => {
    return Math.max(1, ...monthly.map((item) => Number(item?.count) || 0));
  }, [monthly]);

  /*
   * ============================================================
   * ACTIVE FILTERS
   * ============================================================
   */

  const activeFilterCount = [dateFrom, dateTo, type, status, assignedTo].filter(Boolean).length;

  const hasActiveFilters = activeFilterCount > 0;

  /*
   * ============================================================
   * FILTER ACTIONS
   * ============================================================
   */

  const clearFilters = async () => {
    setDateFrom("");
    setDateTo("");
    setType("");
    setStatus("");
    setAssignedTo("");
    setSearch("");

    await loadReport({
      silent: false,
      customFilters: {
        dateFrom: "",
        dateTo: "",
        type: "",
        status: "",
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

  /*
   * ============================================================
   * SORT
   * ============================================================
   */

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
      return <ChevronDown size={13} className="activity-report-sort-muted" />;
    }

    return sortDirection === "asc" ? <ChevronUp size={13} /> : <ChevronDown size={13} />;
  };

  /*
   * ============================================================
   * STATUS CLASS
   * ============================================================
   */

  const getStatusClass = (value) => {
    switch (String(value || "").toUpperCase()) {
      case "COMPLETED":
      case "DONE":
      case "SUCCESS":
        return "activity-report-status activity-report-status-success";

      case "PENDING":
      case "OPEN":
        return "activity-report-status activity-report-status-pending";

      case "CANCELLED":
      case "CANCELED":
      case "FAILED":
        return "activity-report-status activity-report-status-danger";

      case "IN_PROGRESS":
      case "PROCESSING":
        return "activity-report-status activity-report-status-progress";

      default:
        return "activity-report-status";
    }
  };

  /*
   * ============================================================
   * ACTIVITY TYPE ICON LABEL
   * ============================================================
   */

  const getActivityIcon = (value) => {
    const normalized = String(value || "").toUpperCase();

    if (normalized.includes("CALL")) {
      return "C";
    }

    if (normalized.includes("MEETING")) {
      return "M";
    }

    if (normalized.includes("EMAIL")) {
      return "E";
    }

    if (normalized.includes("TASK")) {
      return "T";
    }

    if (normalized.includes("NOTE")) {
      return "N";
    }

    return "A";
  };

  /*
   * ============================================================
   * EXPORT CSV
   * ============================================================
   */

  const exportCsv = async () => {
    if (!filteredRows.length) {
      await showAuthAlert({
        icon: "info",
        title: "No activities available",
        text: "There are no activity records available for export.",
        confirmButtonText: "OK",
      });

      return;
    }

    const headers = ["Activity", "Type", "Status", "Assigned User", "Assigned Email", "Contact", "Company", "Lead", "Deal", "Created At"];

    const lines = [headers.map(escapeCsvValue).join(",")];

    filteredRows.forEach((activity) => {
      lines.push(
        [
          activity?.title || activity?.name || activity?.subject || activity?.description || "Activity",

          activity?.type || activity?.activityType || "",

          activity?.status || "",

          activity?.assignedTo?.name || activity?.assignedTo?.email || "Unassigned",

          activity?.assignedTo?.email || "",

          activity?.contactId?.name || activity?.contactId?.email || "",

          activity?.companyId?.name || "",

          activity?.leadId?.name || "",

          activity?.dealId?.name || "",

          formatDateTime(activity?.createdAt),
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

    link.download = `activity-report-${new Date().toISOString().slice(0, 10)}.csv`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  /*
   * ============================================================
   * EXPORT EXCEL
   * ============================================================
   */

  const exportExcel = async () => {
    if (!filteredRows.length) {
      await showAuthAlert({
        icon: "info",
        title: "No activities available",
        text: "There are no activity records available for export.",
        confirmButtonText: "OK",
      });

      return;
    }

    const worksheetData = filteredRows.map((activity) => ({
      Activity: activity?.title || activity?.name || activity?.subject || activity?.description || "Activity",

      Type: activity?.type || activity?.activityType || "",

      Status: activity?.status || "",

      "Assigned User": activity?.assignedTo?.name || activity?.assignedTo?.email || "Unassigned",

      "Assigned Email": activity?.assignedTo?.email || "",

      Contact: activity?.contactId?.name || activity?.contactId?.email || "",

      Company: activity?.companyId?.name || "",

      Lead: activity?.leadId?.name || "",

      Deal: activity?.dealId?.name || "",

      "Created At": formatDateTime(activity?.createdAt),
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Activity Report");

    XLSX.writeFile(workbook, `activity-report-${new Date().toISOString().slice(0, 10)}.xlsx`);
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

        <div className="activity-report-page">
          <div className="activity-report-loading">
            <div className="activity-report-loading-icon">
              <Loader2 size={30} className="activity-report-spin" />
            </div>

            <div>
              <h3>Loading Activity Report</h3>

              <p>Preparing your activity analytics and performance data...</p>
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

      <div className="activity-report-page">
        {/* HEADER */}

        <div className="activity-report-header">
          <div className="activity-report-heading">
            <h1 className="activity-report-title">Activity Report</h1>

            <p className="activity-report-subtitle">Track activity volume, status, ownership and engagement trends.</p>
          </div>

          <div className="activity-report-header-actions">
            <button type="button" className="activity-report-btn activity-report-btn-secondary" onClick={handleRefresh} disabled={refreshing}>
              <RefreshCw size={16} className={refreshing ? "activity-report-spin" : ""} />

              {refreshing ? "Refreshing..." : "Refresh"}
            </button>

            <button type="button" className="activity-report-btn activity-report-btn-secondary" onClick={exportCsv}>
              <Download size={16} />
              CSV
            </button>

            <button type="button" className="activity-report-btn activity-report-btn-primary" onClick={exportExcel}>
              <Download size={16} />
              Excel
            </button>
          </div>
        </div>

        {/* FILTERS */}

        <div className="activity-report-filter-card">
          <div className="activity-report-filter-top">
            <div className="activity-report-filter-title">
              <Filter size={17} />

              <span>Report Filters</span>

              {activeFilterCount > 0 && <span className="activity-report-filter-count">{activeFilterCount}</span>}
            </div>

            <div className="activity-report-filter-actions">
              {hasActiveFilters && (
                <button type="button" className="activity-report-clear-btn" onClick={clearFilters}>
                  <X size={15} />
                  Clear Filters
                </button>
              )}

              <button type="button" className="activity-report-filter-toggle" onClick={() => setShowFilters((current) => !current)}>
                {showFilters ? "Hide Filters" : "Show Filters"}

                {showFilters ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="activity-report-filter-grid">
              <div className="activity-report-field">
                <label>From Date</label>

                <div className="activity-report-input-wrap">
                  <CalendarDays size={15} />

                  <input type="date" className="activity-report-date-input" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} />
                </div>
              </div>

              <div className="activity-report-field">
                <label>To Date</label>

                <div className="activity-report-input-wrap">
                  <CalendarDays size={15} />

                  <input type="date" className="activity-report-date-input" value={dateTo} onChange={(event) => setDateTo(event.target.value)} />
                </div>
              </div>

              <div className="activity-report-field">
                <label>Activity Type</label>

                <div className="activity-report-input-wrap">
                  <Activity size={15} />

                  <select value={type} onChange={(event) => setType(event.target.value)}>
                    <option value="">All Types</option>

                    {typeOptions.map((item) => (
                      <option value={item} key={item}>
                        {labelize(item)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="activity-report-field">
                <label>Status</label>

                <div className="activity-report-input-wrap">
                  <ListChecks size={15} />

                  <select value={status} onChange={(event) => setStatus(event.target.value)}>
                    <option value="">All Statuses</option>

                    {statusOptions.map((item) => (
                      <option value={item} key={item}>
                        {labelize(item)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="activity-report-field">
                <label>Assigned User</label>

                <div className="activity-report-input-wrap">
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

              <div className="activity-report-filter-apply">
                <button type="button" className="activity-report-btn activity-report-btn-primary" onClick={applyFilters}>
                  <Filter size={15} />
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ERROR */}

        {error && (
          <div className="activity-report-error">
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

        {/* SUMMARY */}

        <div className="activity-report-summary-grid">
          <div className="activity-report-summary-card">
            <div className="activity-report-summary-icon">
              <Activity size={19} />
            </div>

            <div className="activity-report-summary-content">
              <span>Total Activities</span>

              <strong>{formatNumber(summary.total)}</strong>

              <small>All activities in selected period</small>
            </div>
          </div>

          <div className="activity-report-summary-card">
            <div className="activity-report-summary-icon activity-report-summary-icon-green">
              <CheckCircle2 size={19} />
            </div>

            <div className="activity-report-summary-content">
              <span>Completed</span>

              <strong>{formatNumber(byStatus.find((item) => String(item?.status).toUpperCase() === "COMPLETED")?.count || 0)}</strong>

              <small>Completed activities</small>
            </div>
          </div>

          <div className="activity-report-summary-card">
            <div className="activity-report-summary-icon activity-report-summary-icon-blue">
              <Clock3 size={19} />
            </div>

            <div className="activity-report-summary-content">
              <span>Pending</span>

              <strong>{formatNumber(byStatus.find((item) => String(item?.status).toUpperCase() === "PENDING")?.count || 0)}</strong>

              <small>Pending activities</small>
            </div>
          </div>

          <div className="activity-report-summary-card">
            <div className="activity-report-summary-icon activity-report-summary-icon-orange">
              <Users size={19} />
            </div>

            <div className="activity-report-summary-content">
              <span>Assigned Users</span>

              <strong>{formatNumber(byAssignedUser.length)}</strong>

              <small>Users with activity workload</small>
            </div>
          </div>

          <div className="activity-report-summary-card">
            <div className="activity-report-summary-icon activity-report-summary-icon-purple">
              <BarChart3 size={19} />
            </div>

            <div className="activity-report-summary-content">
              <span>Activity Types</span>

              <strong>{formatNumber(byType.length)}</strong>

              <small>Different activity types</small>
            </div>
          </div>
        </div>

        {/* MINI METRICS */}

        <div className="activity-report-mini-grid">
          <div className="activity-report-mini-card">
            <div>
              <span>Statuses</span>

              <strong>{formatNumber(byStatus.length)}</strong>
            </div>

            <div className="activity-report-mini-icon">
              <ListChecks size={17} />
            </div>
          </div>

          <div className="activity-report-mini-card">
            <div>
              <span>Monthly Records</span>

              <strong>{formatNumber(monthly.length)}</strong>
            </div>

            <div className="activity-report-mini-icon">
              <CalendarDays size={17} />
            </div>
          </div>

          <div className="activity-report-mini-card">
            <div>
              <span>Visible Records</span>

              <strong>{formatNumber(filteredRows.length)}</strong>
            </div>

            <div className="activity-report-mini-icon">
              <Search size={17} />
            </div>
          </div>

          <div className="activity-report-mini-card">
            <div>
              <span>Assigned Workload</span>

              <strong>{formatNumber(byAssignedUser.reduce((total, item) => total + (Number(item?.count) || 0), 0))}</strong>
            </div>

            <div className="activity-report-mini-icon">
              <UserRound size={17} />
            </div>
          </div>
        </div>

        {/* TABS */}

        <div className="activity-report-tabs">
          <button type="button" className={activeSection === "overview" ? "activity-report-tab activity-report-tab-active" : "activity-report-tab"} onClick={() => setActiveSection("overview")}>
            <BarChart3 size={16} />
            Overview
          </button>

          <button type="button" className={activeSection === "people" ? "activity-report-tab activity-report-tab-active" : "activity-report-tab"} onClick={() => setActiveSection("people")}>
            <Users size={16} />
            Assignment
          </button>

          <button type="button" className={activeSection === "activities" ? "activity-report-tab activity-report-tab-active" : "activity-report-tab"} onClick={() => setActiveSection("activities")}>
            <Activity size={16} />
            Activity Details
          </button>
        </div>

        {/* OVERVIEW */}

        {activeSection === "overview" && (
          <div className="activity-report-content-grid">
            <div className="activity-report-panel">
              <div className="activity-report-panel-header">
                <div>
                  <h3>Activity Types</h3>

                  <p>Distribution by activity type</p>
                </div>

                <Activity size={18} />
              </div>

              <div className="activity-report-breakdown">
                {byType.length ? (
                  byType.map((item) => {
                    const count = Number(item?.count) || 0;

                    const percentage = summary.total > 0 ? (count / Number(summary.total)) * 100 : 0;

                    return (
                      <div className="activity-report-breakdown-item" key={item?.type}>
                        <div className="activity-report-breakdown-top">
                          <span>{labelize(item?.type)}</span>

                          <strong>{formatNumber(count)}</strong>
                        </div>

                        <div className="activity-report-progress">
                          <div
                            style={{
                              width: `${Math.min(percentage, 100)}%`,
                            }}
                          />
                        </div>

                        <small>{percentage.toFixed(1)}%</small>
                      </div>
                    );
                  })
                ) : (
                  <div className="activity-report-empty-small">No activity type data available.</div>
                )}
              </div>
            </div>

            <div className="activity-report-panel">
              <div className="activity-report-panel-header">
                <div>
                  <h3>Activity Status</h3>

                  <p>Distribution by current status</p>
                </div>

                <ListChecks size={18} />
              </div>

              <div className="activity-report-breakdown">
                {byStatus.length ? (
                  byStatus.map((item) => {
                    const count = Number(item?.count) || 0;

                    const percentage = summary.total > 0 ? (count / Number(summary.total)) * 100 : 0;

                    return (
                      <div className="activity-report-breakdown-item" key={item?.status}>
                        <div className="activity-report-breakdown-top">
                          <span>{labelize(item?.status)}</span>

                          <strong>{formatNumber(count)}</strong>
                        </div>

                        <div className="activity-report-progress">
                          <div
                            style={{
                              width: `${Math.min(percentage, 100)}%`,
                            }}
                          />
                        </div>

                        <small>{percentage.toFixed(1)}%</small>
                      </div>
                    );
                  })
                ) : (
                  <div className="activity-report-empty-small">No status data available.</div>
                )}
              </div>
            </div>

            <div className="activity-report-panel activity-report-panel-wide">
              <div className="activity-report-panel-header">
                <div>
                  <h3>Monthly Activity Trend</h3>

                  <p>Activity creation volume by month</p>
                </div>

                <TrendingIcon />
              </div>

              {monthly.length ? (
                <div className="activity-report-monthly-list">
                  {monthly.map((item) => {
                    const count = Number(item?.count) || 0;

                    const percentage = maxMonthlyCount > 0 ? (count / maxMonthlyCount) * 100 : 0;

                    return (
                      <div className="activity-report-month-row" key={item?.month}>
                        <div className="activity-report-month-label">
                          <strong>{formatMonth(item?.month)}</strong>

                          <span>{formatNumber(count)} activities</span>
                        </div>

                        <div className="activity-report-month-track">
                          <span
                            style={{
                              width: `${Math.min(percentage, 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="activity-report-empty">
                  <BarChart3 size={30} />

                  <strong>No monthly data</strong>

                  <span>There is no monthly trend data for the selected filters.</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ASSIGNMENT */}

        {activeSection === "people" && (
          <div className="activity-report-panel activity-report-panel-wide">
            <div className="activity-report-panel-header">
              <div>
                <h3>Assigned Users</h3>

                <p>Activity workload by assigned user</p>
              </div>

              <UserRound size={18} />
            </div>

            {byAssignedUser.length ? (
              <div className="activity-report-assignment-list">
                {byAssignedUser.map((item) => {
                  const count = Number(item?.count) || 0;

                  const percentage = summary.total > 0 ? (count / Number(summary.total)) * 100 : 0;

                  return (
                    <div className="activity-report-assignment-row" key={item?.assignedTo || item?.name || "unassigned"}>
                      <div className="activity-report-person">
                        <div className="activity-report-avatar">{(item?.name || item?.email || "U").charAt(0).toUpperCase()}</div>

                        <div>
                          <strong>{item?.name || "Unassigned"}</strong>

                          <span>{item?.email || "No email"}</span>
                        </div>
                      </div>

                      <div className="activity-report-assignment-middle">
                        <div className="activity-report-progress">
                          <div
                            style={{
                              width: `${Math.min(percentage, 100)}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div className="activity-report-assignment-count">
                        <strong>{formatNumber(count)}</strong>

                        <span>{percentage.toFixed(1)}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="activity-report-empty">
                <Users size={30} />

                <strong>No assignment data</strong>

                <span>No assigned user data is available for the selected filters.</span>
              </div>
            )}
          </div>
        )}

        {/* DETAILS */}

        {activeSection === "activities" && (
          <div className="activity-report-panel activity-report-details-panel">
            <div className="activity-report-details-header">
              <div>
                <h3>Activity Details</h3>

                <p>Detailed activity records returned by the report.</p>
              </div>

              <div className="activity-report-detail-actions">
                <div className="activity-report-search">
                  <Search size={16} />

                  <input type="text" value={search} placeholder="Search activities..." onChange={(event) => setSearch(event.target.value)} />

                  {search && (
                    <button type="button" onClick={() => setSearch("")} aria-label="Clear search">
                      <X size={15} />
                    </button>
                  )}
                </div>

                <span className="activity-report-result-count">{formatNumber(filteredRows.length)} records</span>
              </div>
            </div>

            <div className="activity-report-table-scroll">
              <table className="activity-report-table">
                <thead>
                  <tr>
                    <th onClick={() => handleSort("title")}>
                      <span>
                        Activity
                        <SortIcon field="title" />
                      </span>
                    </th>

                    <th onClick={() => handleSort("type")}>
                      <span>
                        Type
                        <SortIcon field="type" />
                      </span>
                    </th>

                    <th onClick={() => handleSort("status")}>
                      <span>
                        Status
                        <SortIcon field="status" />
                      </span>
                    </th>

                    <th onClick={() => handleSort("assignedTo")}>
                      <span>
                        Assigned User
                        <SortIcon field="assignedTo" />
                      </span>
                    </th>

                    <th>Contact</th>

                    <th>Company</th>

                    <th>Related Record</th>

                    <th onClick={() => handleSort("createdAt")}>
                      <span>
                        Created
                        <SortIcon field="createdAt" />
                      </span>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {displayedRows.length ? (
                    displayedRows.map((activity) => {
                      const title = activity?.title || activity?.name || activity?.subject || activity?.description || "Activity";

                      const activityType = activity?.type || activity?.activityType || "UNKNOWN";

                      const assignedName = activity?.assignedTo?.name || activity?.assignedTo?.email || "Unassigned";

                      const contactName = activity?.contactId?.name || activity?.contactId?.email || "—";

                      const companyName = activity?.companyId?.name || "—";

                      const relatedName = activity?.leadId?.name || activity?.dealId?.name || activity?.taskId?.title || "—";

                      return (
                        <tr key={activity?._id || `${title}-${activity?.createdAt}`}>
                          <td>
                            <div className="activity-report-activity-cell">
                              <div className="activity-report-activity-icon">{getActivityIcon(activityType)}</div>

                              <div>
                                <strong>{title}</strong>

                                <span>{activity?.description ? String(activity.description).slice(0, 70) : "Activity record"}</span>
                              </div>
                            </div>
                          </td>

                          <td>
                            <span className="activity-report-type-pill">{labelize(activityType)}</span>
                          </td>

                          <td>
                            <span className={getStatusClass(activity?.status)}>{labelize(activity?.status)}</span>
                          </td>

                          <td>
                            <div className="activity-report-person">
                              <div className="activity-report-small-avatar">{assignedName.charAt(0).toUpperCase()}</div>

                              <span>{assignedName}</span>
                            </div>
                          </td>

                          <td>
                            <span className="activity-report-table-text">{contactName}</span>
                          </td>

                          <td>
                            <span className="activity-report-table-text">{companyName}</span>
                          </td>

                          <td>
                            <span className="activity-report-table-text">{relatedName}</span>
                          </td>

                          <td>
                            <span className="activity-report-date">{formatDateTime(activity?.createdAt)}</span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="8" className="activity-report-no-data">
                        <div>
                          <Search size={28} />

                          <strong>No activities found</strong>

                          <span>Try changing your filters or search term.</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {filteredRows.length > visibleRows && (
              <div className="activity-report-load-more">
                <button type="button" className="activity-report-btn activity-report-btn-secondary" onClick={() => setVisibleRows((current) => current + 50)}>
                  Load More
                </button>
              </div>
            )}
          </div>
        )}

        {/* FOOTER */}

        <div className="activity-report-footer">
          <span>
            Showing {formatNumber(displayedRows.length)} of {formatNumber(filteredRows.length)} activities
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
 * SMALL TREND ICON
 * ============================================================
 */

const TrendingIcon = () => <ArrowUp size={18} />;

/*
 * ============================================================
 * STYLES
 * ============================================================
 */

const styles = `
.activity-report-page{width:100%;min-width:0;padding:22px;color:var(--crm-text,#1f2937);}
.activity-report-header{display:flex;align-items:flex-end;justify-content:space-between;gap:18px;margin-bottom:18px;}
.activity-report-heading{min-width:0;}
.activity-report-title{margin:0;font-size:25px;line-height:1.2;font-weight:400;color:var(--crm-text,#111827);}
.activity-report-subtitle{margin:6px 0 0;color:var(--crm-muted,#6b7280);font-size:13px;}
.activity-report-header-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
.activity-report-btn{height:36px;border-radius:8px;padding:0 12px;border:1px solid var(--crm-border,#e5e7eb);display:inline-flex;align-items:center;justify-content:center;gap:7px;font-size:13px;font-weight:400;cursor:pointer;transition:none;white-space:nowrap;}
.activity-report-btn:disabled{opacity:.55;cursor:not-allowed;}
.activity-report-btn-secondary{background:var(--crm-surface,#fff);color:var(--crm-text,#374151);}
.activity-report-btn-primary{background:var(--crm-primary,#2563eb);border-color:var(--crm-primary,#2563eb);color:#fff;}
.activity-report-filter-card{border:1px solid var(--crm-border,#e5e7eb);background:var(--crm-surface,#fff);border-radius:12px;margin-bottom:18px;overflow:hidden;}
.activity-report-filter-top{min-height:54px;padding:0 14px;display:flex;align-items:center;justify-content:space-between;gap:12px;}
.activity-report-filter-title{display:flex;align-items:center;gap:8px;color:var(--crm-text,#374151);font-size:13px;font-weight:400;}
.activity-report-filter-title svg{color:var(--crm-primary,#2563eb);}
.activity-report-filter-count{min-width:19px;height:19px;border-radius:10px;display:inline-flex;align-items:center;justify-content:center;background:rgba(37,99,235,.1);color:var(--crm-primary,#2563eb);font-size:13px;font-weight:400;}
.activity-report-filter-actions{display:flex;align-items:center;gap:8px;}
.activity-report-clear-btn{height:30px;padding:0 9px;border:1px solid var(--crm-border,#e5e7eb);border-radius:7px;background:var(--crm-surface,#fff);color:var(--crm-muted,#6b7280);display:inline-flex;align-items:center;gap:5px;font-size:13px;font-weight:400;cursor:pointer;}
.activity-report-filter-toggle{height:30px;padding:0 9px;border:1px solid var(--crm-border,#e5e7eb);border-radius:7px;background:var(--crm-surface,#fff);color:var(--crm-text,#374151);display:inline-flex;align-items:center;gap:5px;font-size:13px;font-weight:400;cursor:pointer;}
.activity-report-filter-grid{border-top:1px solid var(--crm-border,#e5e7eb);padding:14px;display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:12px;}
.activity-report-field{min-width:0;}
.activity-report-field label{display:block;margin-bottom:6px;font-size:13px;font-weight:400;color:var(--crm-muted,#6b7280);}
.activity-report-input-wrap{height:38px;border:1px solid var(--crm-border,#e5e7eb);background:var(--crm-surface,#fff);border-radius:8px;display:flex;align-items:center;gap:7px;padding:0 10px;color:var(--crm-muted,#6b7280);}
.activity-report-input-wrap:focus-within{border-color:var(--crm-primary,#2563eb);box-shadow:0 0 0 3px rgba(37,99,235,.08);}
.activity-report-input-wrap input,.activity-report-input-wrap select{width:100%;height:100%;border:0;outline:0;background:transparent;color:var(--crm-text,#374151);font-size:13px;min-width:0;}
.activity-report-input-wrap select{cursor:pointer;}
.activity-report-input-wrap option{background:var(--crm-surface,#fff);color:var(--crm-text,#374151);}
.activity-report-input-wrap input[type="date"]{color-scheme:light;-webkit-appearance:auto;appearance:auto;accent-color:var(--crm-primary,#2563eb);cursor:pointer;}
.activity-report-date-input{color-scheme:light;-webkit-appearance:auto;appearance:auto;accent-color:var(--crm-primary,#2563eb);cursor:pointer;}
.activity-report-input-wrap input[type="date"]::-webkit-calendar-picker-indicator{display:block;opacity:1!important;visibility:visible!important;cursor:pointer;width:16px;height:16px;}
.activity-report-date-input::-webkit-calendar-picker-indicator{display:block;opacity:1!important;visibility:visible!important;cursor:pointer;width:16px;height:16px;}
.dark .activity-report-input-wrap input[type="date"],[data-theme="dark"] .activity-report-input-wrap input[type="date"],html.dark .activity-report-input-wrap input[type="date"],body.dark .activity-report-input-wrap input[type="date"],body.dark-mode .activity-report-input-wrap input[type="date"],html.dark-mode .activity-report-input-wrap input[type="date"],.dark-theme .activity-report-input-wrap input[type="date"],.dark .activity-report-date-input,[data-theme="dark"] .activity-report-date-input,html.dark .activity-report-date-input,body.dark .activity-report-date-input,body.dark-mode .activity-report-date-input,html.dark-mode .activity-report-date-input,.dark-theme .activity-report-date-input{color-scheme:dark;background:transparent;color:var(--crm-text,#f8fafc);}


.activity-report-filter-apply{display:flex;align-items:flex-end;}
.activity-report-filter-apply .activity-report-btn{width:100%;}
.activity-report-error{border:1px solid rgba(239,68,68,.25);background:rgba(239,68,68,.07);border-radius:10px;padding:12px 14px;margin-bottom:18px;display:flex;align-items:center;gap:10px;color:#dc2626;}
.activity-report-error>div{display:flex;flex-direction:column;gap:2px;flex:1;min-width:0;}
.activity-report-error strong{font-size:13px;}
.activity-report-error span{font-size:13px;white-space:pre-wrap;}
.activity-report-error button{border:1px solid rgba(239,68,68,.25);background:transparent;color:#dc2626;border-radius:7px;padding:6px 10px;font-size:13px;font-weight:400;cursor:pointer;}
.activity-report-summary-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:12px;margin-bottom:12px;}
.activity-report-summary-card{border:1px solid var(--crm-border,#e5e7eb);background:var(--crm-surface,#fff);border-radius:12px;padding:14px;display:flex;align-items:flex-start;gap:11px;min-width:0;}
.activity-report-summary-icon{width:36px;height:36px;min-width:36px;border-radius:9px;display:flex;align-items:center;justify-content:center;background:rgba(37,99,235,.1);color:var(--crm-primary,#2563eb);}
.activity-report-summary-icon-green{background:rgba(16,185,129,.1);color:#10b981;}
.activity-report-summary-icon-blue{background:rgba(59,130,246,.1);color:#3b82f6;}
.activity-report-summary-icon-orange{background:rgba(245,158,11,.1);color:#d97706;}
.activity-report-summary-icon-purple{background:rgba(139,92,246,.1);color:#7c3aed;}
.activity-report-summary-content{min-width:0;display:flex;flex-direction:column;}
.activity-report-summary-content span{font-size:13px;color:var(--crm-muted,#6b7280);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.activity-report-summary-content strong{margin-top:3px;font-size:20px;line-height:1.2;color:var(--crm-text,#111827);}
.activity-report-summary-content small{margin-top:4px;font-size:13px;color:var(--crm-muted,#6b7280);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.activity-report-mini-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin-bottom:14px;}
.activity-report-mini-card{border:1px solid var(--crm-border,#e5e7eb);background:var(--crm-surface,#fff);border-radius:10px;padding:11px 13px;display:flex;align-items:center;justify-content:space-between;gap:10px;}
.activity-report-mini-card>div:first-child{display:flex;flex-direction:column;min-width:0;}
.activity-report-mini-card span{font-size:13px;color:var(--crm-muted,#6b7280);}
.activity-report-mini-card strong{margin-top:3px;font-size:17px;color:var(--crm-text,#111827);}
.activity-report-mini-icon{width:30px;height:30px;border-radius:8px;background:rgba(37,99,235,.08);color:var(--crm-primary,#2563eb);display:flex;align-items:center;justify-content:center;}
.activity-report-tabs{display:flex;align-items:center;gap:4px;border-bottom:1px solid var(--crm-border,#e5e7eb);margin-bottom:14px;}
.activity-report-tab{height:40px;padding:0 13px;border:0;background:transparent;color:var(--crm-muted,#6b7280);display:inline-flex;align-items:center;gap:7px;font-size:13px;font-weight:400;cursor:pointer;border-bottom:2px solid transparent;}
.activity-report-tab-active{color:var(--crm-primary,#2563eb);border-bottom-color:var(--crm-primary,#2563eb);}
.activity-report-content-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;}
.activity-report-panel{border:1px solid var(--crm-border,#e5e7eb);background:var(--crm-surface,#fff);border-radius:12px;min-width:0;overflow:hidden;}
.activity-report-panel-wide{grid-column:1/-1;}
.activity-report-panel-header{padding:14px 15px;border-bottom:1px solid var(--crm-border,#e5e7eb);display:flex;align-items:center;justify-content:space-between;gap:12px;color:var(--crm-muted,#6b7280);}
.activity-report-panel-header>div{min-width:0;}
.activity-report-panel-header h3{margin:0;color:var(--crm-text,#111827);font-size:13px;font-weight:400;}
.activity-report-panel-header p{margin:4px 0 0;color:var(--crm-muted,#6b7280);font-size:13px;}
.activity-report-breakdown{padding:14px 15px;}
.activity-report-breakdown-item{margin-bottom:14px;}
.activity-report-breakdown-item:last-child{margin-bottom:0;}
.activity-report-breakdown-top{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:6px;}
.activity-report-breakdown-top span{font-size:13px;color:var(--crm-text,#374151);}
.activity-report-breakdown-top strong{font-size:13px;color:var(--crm-text,#111827);}
.activity-report-progress{height:6px;border-radius:10px;background:var(--crm-border,#e5e7eb);overflow:hidden;}
.activity-report-progress>div{height:100%;border-radius:10px;background:var(--crm-primary,#2563eb);}
.activity-report-breakdown-item small{display:block;margin-top:4px;text-align:right;color:var(--crm-muted,#6b7280);font-size:13px;}
.activity-report-monthly-list{padding:14px 15px;}
.activity-report-month-row{display:grid;grid-template-columns:160px minmax(0,1fr);align-items:center;gap:16px;margin-bottom:13px;}
.activity-report-month-row:last-child{margin-bottom:0;}
.activity-report-month-label{display:flex;align-items:center;justify-content:space-between;gap:10px;}
.activity-report-month-label strong{font-size:13px;color:var(--crm-text,#374151);}
.activity-report-month-label span{font-size:13px;color:var(--crm-muted,#6b7280);}
.activity-report-month-track{height:8px;border-radius:10px;background:var(--crm-border,#e5e7eb);overflow:hidden;}
.activity-report-month-track span{display:block;height:100%;border-radius:10px;background:var(--crm-primary,#2563eb);}
.activity-report-assignment-list{padding:0 15px;}
.activity-report-assignment-row{min-height:65px;border-bottom:1px solid var(--crm-border,#e5e7eb);display:grid;grid-template-columns:240px minmax(0,1fr) 70px;align-items:center;gap:18px;}
.activity-report-assignment-row:last-child{border-bottom:0;}
.activity-report-person{display:flex;align-items:center;gap:9px;min-width:0;}
.activity-report-person>div:last-child{display:flex;flex-direction:column;min-width:0;}
.activity-report-person strong{font-size:13px;color:var(--crm-text,#374151);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.activity-report-person span{margin-top:2px;font-size:13px;color:var(--crm-muted,#6b7280);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.activity-report-avatar{width:32px;height:32px;min-width:32px;border-radius:9px;background:rgba(37,99,235,.1);color:var(--crm-primary,#2563eb);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:400;}
.activity-report-assignment-middle{min-width:0;}
.activity-report-assignment-count{display:flex;flex-direction:column;align-items:flex-end;}
.activity-report-assignment-count strong{font-size:13px;color:var(--crm-text,#111827);}
.activity-report-assignment-count span{margin-top:2px;font-size:13px;color:var(--crm-muted,#6b7280);}
.activity-report-details-panel{overflow:hidden;}
.activity-report-details-header{padding:14px 15px;border-bottom:1px solid var(--crm-border,#e5e7eb);display:flex;align-items:center;justify-content:space-between;gap:14px;}
.activity-report-details-header h3{margin:0;color:var(--crm-text,#111827);font-size:13px;font-weight:400;}
.activity-report-details-header p{margin:4px 0 0;color:var(--crm-muted,#6b7280);font-size:13px;}
.activity-report-detail-actions{display:flex;align-items:center;gap:10px;}
.activity-report-search{width:260px;height:34px;border:1px solid var(--crm-border,#e5e7eb);border-radius:8px;background:var(--crm-surface,#fff);display:flex;align-items:center;gap:7px;padding:0 9px;color:var(--crm-muted,#6b7280);}
.activity-report-search input{width:100%;height:100%;border:0;outline:0;background:transparent;color:var(--crm-text,#374151);font-size:13px;min-width:0;}
.activity-report-search button{width:22px;height:22px;min-width:22px;border:0;background:transparent;color:var(--crm-muted,#6b7280);display:flex;align-items:center;justify-content:center;padding:0;cursor:pointer;}
.activity-report-result-count{font-size:13px;color:var(--crm-muted,#6b7280);white-space:nowrap;}
.activity-report-table-scroll{width:100%;overflow-x:auto;}
.activity-report-table{width:100%;border-collapse:collapse;min-width:1000px;}
.activity-report-table th{height:40px;padding:0 12px;text-align:left;border-bottom:1px solid var(--crm-border,#e5e7eb);background:var(--crm-surface,#fff);color:var(--crm-muted,#6b7280);font-size:13px;font-weight:400;white-space:nowrap;}
.activity-report-table th>span{display:inline-flex;align-items:center;gap:4px;}
.activity-report-table th[onClick]{cursor:pointer;}
.activity-report-table td{height:58px;padding:8px 12px;border-bottom:1px solid var(--crm-border,#e5e7eb);color:var(--crm-text,#374151);font-size:13px;vertical-align:middle;}
.activity-report-table tbody tr:last-child td{border-bottom:0;}
.activity-report-activity-cell{display:flex;align-items:center;gap:9px;min-width:190px;}
.activity-report-activity-icon{width:31px;height:31px;min-width:31px;border-radius:8px;background:rgba(37,99,235,.09);color:var(--crm-primary,#2563eb);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:400;}
.activity-report-activity-cell>div:last-child{display:flex;flex-direction:column;min-width:0;}
.activity-report-activity-cell strong{font-size:13px;color:var(--crm-text,#374151);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:210px;}
.activity-report-activity-cell span{margin-top:2px;color:var(--crm-muted,#6b7280);font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:210px;}
.activity-report-type-pill{display:inline-flex;align-items:center;padding:4px 7px;border-radius:6px;background:rgba(37,99,235,.08);color:var(--crm-primary,#2563eb);font-size:13px;font-weight:400;white-space:nowrap;}
.activity-report-status{display:inline-flex;align-items:center;padding:4px 8px;border-radius:6px;background:rgba(107,114,128,.1);color:#6b7280;font-size:13px;font-weight:400;white-space:nowrap;}
.activity-report-status-success{background:rgba(16,185,129,.1);color:#059669;}
.activity-report-status-pending{background:rgba(245,158,11,.1);color:#d97706;}
.activity-report-status-danger{background:rgba(239,68,68,.1);color:#dc2626;}
.activity-report-status-progress{background:rgba(59,130,246,.1);color:#2563eb;}
.activity-report-small-avatar{width:25px;height:25px;min-width:25px;border-radius:7px;background:rgba(37,99,235,.09);color:var(--crm-primary,#2563eb);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:400;}
.activity-report-person span{font-size:13px;}
.activity-report-table-text{font-size:13px;color:var(--crm-text,#374151);white-space:nowrap;}
.activity-report-date{font-size:13px;color:var(--crm-muted,#6b7280);white-space:nowrap;}
.activity-report-no-data{height:220px!important;text-align:center!important;}
.activity-report-no-data>div{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px;color:var(--crm-muted,#6b7280);}
.activity-report-no-data strong{font-size:13px;color:var(--crm-text,#374151);}
.activity-report-no-data span{font-size:13px;}
.activity-report-empty{min-height:180px;padding:30px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px;color:var(--crm-muted,#6b7280);text-align:center;}
.activity-report-empty strong{font-size:13px;color:var(--crm-text,#374151);}
.activity-report-empty span{font-size:13px;}
.activity-report-empty-small{padding:20px;text-align:center;color:var(--crm-muted,#6b7280);font-size:13px;}
.activity-report-load-more{padding:12px;border-top:1px solid var(--crm-border,#e5e7eb);display:flex;justify-content:center;}
.activity-report-footer{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 2px 0;color:var(--crm-muted,#6b7280);font-size:13px;}
.activity-report-loading{min-height:360px;border:1px solid var(--crm-border,#e5e7eb);background:var(--crm-surface,#fff);border-radius:12px;display:flex;align-items:center;justify-content:center;gap:13px;padding:30px;}
.activity-report-loading-icon{width:48px;height:48px;border-radius:12px;background:rgba(37,99,235,.08);color:var(--crm-primary,#2563eb);display:flex;align-items:center;justify-content:center;}
.activity-report-loading h3{margin:0;color:var(--crm-text,#111827);font-size:14px;}
.activity-report-loading p{margin:5px 0 0;color:var(--crm-muted,#6b7280);font-size:13px;}
.activity-report-spin{animation:activityReportSpin 1s linear infinite;}
.activity-report-sort-muted{opacity:.35;}
@keyframes activityReportSpin{to{transform:rotate(360deg);}}
.dark .activity-report-page,[data-theme="dark"] .activity-report-page,html.dark .activity-report-page,body.dark .activity-report-page,body.dark-mode .activity-report-page,html.dark-mode .activity-report-page,.dark-theme .activity-report-page{color:var(--crm-text,#f8fafc);}
.dark .activity-report-input-wrap select option,[data-theme="dark"] .activity-report-input-wrap select option,html.dark .activity-report-input-wrap select option,body.dark .activity-report-input-wrap select option,body.dark-mode .activity-report-input-wrap select option,html.dark-mode .activity-report-input-wrap select option,.dark-theme .activity-report-input-wrap select option{background:var(--crm-surface,#111827);color:var(--crm-text,#f8fafc);}
@media (max-width:1200px){.activity-report-summary-grid{grid-template-columns:repeat(3,minmax(0,1fr));}.activity-report-filter-grid{grid-template-columns:repeat(3,minmax(0,1fr));}.activity-report-mini-grid{grid-template-columns:repeat(2,minmax(0,1fr));}}
@media (max-width:800px){.activity-report-page{padding:15px;}.activity-report-header{align-items:flex-start;flex-direction:column;}.activity-report-header-actions{width:100%;}.activity-report-header-actions .activity-report-btn{flex:1;}.activity-report-summary-grid{grid-template-columns:repeat(2,minmax(0,1fr));}.activity-report-content-grid{grid-template-columns:1fr;}.activity-report-panel-wide{grid-column:auto;}.activity-report-filter-grid{grid-template-columns:repeat(2,minmax(0,1fr));}.activity-report-assignment-row{grid-template-columns:1fr;gap:9px;padding:12px 0;}.activity-report-assignment-count{align-items:flex-start;}.activity-report-details-header{align-items:flex-start;flex-direction:column;}.activity-report-detail-actions{width:100%;}.activity-report-search{width:100%;}.activity-report-footer{flex-direction:column;align-items:flex-start;}}
@media (max-width:520px){.activity-report-summary-grid,.activity-report-mini-grid,.activity-report-filter-grid{grid-template-columns:1fr;}.activity-report-filter-top{align-items:flex-start;flex-direction:column;padding:11px 12px;}.activity-report-filter-actions{width:100%;justify-content:flex-end;}.activity-report-tabs{overflow-x:auto;}.activity-report-tab{white-space:nowrap;}.activity-report-header-actions{display:grid;grid-template-columns:1fr 1fr;}.activity-report-header-actions .activity-report-btn{width:100%;}.activity-report-header-actions .activity-report-btn-primary{grid-column:1/-1;}}
`;

export default ActivityReport;
