import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Search, RefreshCw, Mail, MessageCircle, Smartphone, ChevronLeft, ChevronRight, X, Eye, Clock3, CheckCircle2, AlertCircle, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import Swal from "sweetalert2";

import useBusiness from "../../hooks/useBusiness";
import { getCommunicationHistory } from "../../api/communication.api";

const CHANNELS = [
  { value: "ALL", label: "All", icon: null },
  { value: "EMAIL", label: "Email", icon: Mail },
  { value: "WHATSAPP", label: "WhatsApp", icon: MessageCircle },
  { value: "SMS", label: "SMS", icon: Smartphone },
];

const PAGE_SIZE = 50;

const formatDate = (value) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getChannelIcon = (channel) => {
  if (channel === "EMAIL") return Mail;
  if (channel === "WHATSAPP") return MessageCircle;
  if (channel === "SMS") return Smartphone;
  return Mail;
};

const getChannelLabel = (channel) => {
  if (channel === "EMAIL") return "Email";
  if (channel === "WHATSAPP") return "WhatsApp";
  if (channel === "SMS") return "SMS";
  return channel || "-";
};

const getStatusClass = (status) => {
  switch (status) {
    case "SENT":
    case "DELIVERED":
    case "RECEIVED":
      return "success";

    case "FAILED":
      return "danger";

    case "QUEUED":
      return "warning";

    default:
      return "neutral";
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case "SENT":
    case "DELIVERED":
    case "RECEIVED":
      return CheckCircle2;

    case "FAILED":
      return AlertCircle;

    case "QUEUED":
      return Clock3;

    default:
      return Clock3;
  }
};

function CommunicationHistory() {
  const { businessId, loading: businessLoading } = useBusiness();

  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 0,
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [channel, setChannel] = useState("ALL");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [selectedCommunication, setSelectedCommunication] = useState(null);

  const loadHistory = useCallback(
    async (showRefresh = false) => {
      if (!businessId) {
        setItems([]);
        setLoading(false);
        return;
      }

      try {
        if (showRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const response = await getCommunicationHistory(businessId, {
          page,
          limit: PAGE_SIZE,
          ...(channel !== "ALL" ? { channel } : {}),
        });

        const rows = Array.isArray(response?.items) ? response.items : [];

        setItems(rows);

        setPagination({
          page: Number(response?.pagination?.page) || page,
          limit: Number(response?.pagination?.limit) || PAGE_SIZE,
          total: Number(response?.pagination?.total) || 0,
          totalPages: Number(response?.pagination?.totalPages) || 0,
        });
      } catch (err) {
        console.error("Communication history error:", err);

        setItems([]);

        setError(err?.message || "Unable to load communication history.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [businessId, page, channel]
  );

  useEffect(() => {
    loadHistory(false);
  }, [loadHistory]);

  useEffect(() => {
    setPage(1);
  }, [channel]);

  const filteredItems = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) return items;

    return items.filter((item) => {
      const searchableText = [item?.to, item?.from, item?.subject, item?.body, item?.channel, item?.status, item?.provider, item?.errorMessage, item?.relatedTo?.type].filter(Boolean).join(" ").toLowerCase();

      return searchableText.includes(value);
    });
  }, [items, search]);

  const stats = useMemo(() => {
    return {
      total: pagination.total || 0,
      email: items.filter((item) => item?.channel === "EMAIL").length,
      whatsapp: items.filter((item) => item?.channel === "WHATSAPP").length,
      sms: items.filter((item) => item?.channel === "SMS").length,
      failed: items.filter((item) => item?.status === "FAILED").length,
    };
  }, [items, pagination.total]);

  const clearSearch = () => {
    setSearch("");
  };

  const handlePageChange = (nextPage) => {
    if (nextPage < 1) return;

    if (pagination.totalPages && nextPage > pagination.totalPages) {
      return;
    }

    setPage(nextPage);
  };

  const showError = () => {
    if (!error) return;

    Swal.fire({
      icon: "error",
      title: "Unable to load communication history",
      text: error,
      confirmButtonText: "OK",
    });
  };

  useEffect(() => {
    if (error) {
      showError();
    }
  }, [error]);

  return (
    <div className="communication-history-page">
      <style>{`
.communication-history-page{padding:24px;color:var(--crm-text);min-height:100%;background:var(--crm-bg,transparent)}
.communication-history-header{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;margin-bottom:22px}
.communication-history-title{margin:0;font-size:26px;line-height:1.2;font-weight:400;color:var(--crm-text)}
.communication-history-subtitle{margin:7px 0 0;font-size:13px;color:var(--crm-muted)}
.communication-history-actions{display:flex;align-items:center;gap:9px}
.communication-history-refresh{height:40px;padding:0 14px;border:1px solid var(--crm-border);border-radius:10px;background:var(--crm-surface);color:var(--crm-text);display:flex;align-items:center;gap:8px;cursor:pointer;font-size:13px;font-weight:400}
.communication-history-refresh:hover{background:var(--crm-surface-2)}
.communication-history-refresh svg{width:16px;height:16px}
.communication-history-refresh.loading svg{animation:communication-spin .8s linear infinite}
@keyframes communication-spin{to{transform:rotate(360deg)}}
.communication-history-stats{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:12px;margin-bottom:18px}
.communication-history-stat{border:1px solid var(--crm-border);background:var(--crm-surface);border-radius:13px;padding:15px;min-width:0}
.communication-history-stat-label{color:var(--crm-muted);font-size:13px;font-weight:400;margin-bottom:7px}
.communication-history-stat-value{color:var(--crm-text);font-size:22px;line-height:1;font-weight:400}
.communication-history-toolbar{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:13px;border:1px solid var(--crm-border);background:var(--crm-surface);border-radius:13px;margin-bottom:14px}
.communication-history-search{position:relative;flex:1;max-width:430px}
.communication-history-search svg.search-icon{position:absolute;left:12px;top:50%;transform:translateY(-50%);width:17px;height:17px;color:var(--crm-muted);pointer-events:none}
.communication-history-search input{width:100%;height:40px;border:1px solid var(--crm-border);border-radius:10px;background:var(--crm-surface);color:var(--crm-text);padding:0 38px 0 38px;outline:none;font-size:13px;box-sizing:border-box}
.communication-history-search input:focus{border-color:var(--crm-primary)}
.communication-history-search input::placeholder{color:var(--crm-muted)}
.communication-history-search-clear{position:absolute;right:8px;top:50%;transform:translateY(-50%);width:26px;height:26px;display:grid;place-items:center;border:0;border-radius:7px;background:transparent;color:var(--crm-muted);cursor:pointer}
.communication-history-search-clear:hover{background:transparent;color:var(--crm-muted)}
.communication-history-search-clear svg{width:15px;height:15px}
.communication-history-filters{display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.communication-history-filter{height:36px;padding:0 12px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-muted);border-radius:9px;cursor:pointer;font-size:13px;font-weight:400;display:flex;align-items:center;gap:7px}
.communication-history-filter:hover{color:var(--crm-text);background:var(--crm-surface-2)}
.communication-history-filter.active{background:var(--crm-primary-soft);color:var(--crm-primary);border-color:var(--crm-primary)}
.communication-history-filter svg{width:15px;height:15px}
.communication-history-table-wrap{overflow:hidden;border:1px solid var(--crm-border);border-radius:13px;background:var(--crm-surface)}
.communication-history-table-scroll{overflow-x:auto}
.communication-history-table{width:100%;min-width:900px;border-collapse:collapse}
.communication-history-table th{text-align:left;padding:12px 15px;font-size:13px;text-transform:uppercase;letter-spacing:.06em;font-weight:400;color:var(--crm-muted);background:var(--crm-surface-2);border-bottom:1px solid var(--crm-border);white-space:nowrap}
.communication-history-table td{padding:14px 15px;border-bottom:1px solid var(--crm-border);font-size:13px;color:var(--crm-text);vertical-align:middle}
.communication-history-table tbody tr:last-child td{border-bottom:0}
.communication-history-table tbody tr{cursor:pointer;transition:background .18s ease}
.communication-history-table tbody tr:hover{background:var(--crm-surface-2)}
.communication-channel{display:flex;align-items:center;gap:8px;font-weight:400}
.communication-channel-icon{width:30px;height:30px;border-radius:9px;display:grid;place-items:center;background:var(--crm-primary-soft);color:var(--crm-primary);flex:0 0 30px}
.communication-channel-icon svg{width:15px;height:15px}
.communication-recipient{max-width:210px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.communication-subject{max-width:240px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:400}
.communication-body{max-width:280px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--crm-muted)}
.communication-direction{display:inline-flex;align-items:center;gap:5px;font-size:13px;font-weight:400}
.communication-direction svg{width:13px;height:13px}
.communication-status{display:inline-flex;align-items:center;gap:5px;padding:5px 8px;border-radius:999px;font-size:13px;font-weight:400;white-space:nowrap}
.communication-status svg{width:13px;height:13px}
.communication-status.success{color:var(--crm-success,#16a34a);background:color-mix(in srgb,var(--crm-success,#16a34a) 10%,transparent)}
.communication-status.danger{color:var(--crm-danger,#dc2626);background:color-mix(in srgb,var(--crm-danger,#dc2626) 10%,transparent)}
.communication-status.warning{color:var(--crm-warning,#d97706);background:color-mix(in srgb,var(--crm-warning,#d97706) 10%,transparent)}
.communication-status.neutral{color:var(--crm-muted);background:var(--crm-surface-2)}
.communication-view-btn{width:34px;height:34px;display:grid;place-items:center;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-muted);border-radius:8px;cursor:pointer}
.communication-view-btn:hover{color:var(--crm-primary);border-color:var(--crm-primary);background:var(--crm-primary-soft)}
.communication-view-btn svg{width:16px;height:16px}
.communication-empty{padding:55px 20px;text-align:center;color:var(--crm-muted)}
.communication-empty-icon{width:48px;height:48px;margin:0 auto 12px;display:grid;place-items:center;border-radius:14px;background:var(--crm-surface-2);color:var(--crm-muted)}
.communication-empty-icon svg{width:22px;height:22px}
.communication-empty-title{color:var(--crm-text);font-size:14px;font-weight:400;margin-bottom:5px}
.communication-empty-text{font-size:13px}
.communication-loading{padding:55px 20px;text-align:center;color:var(--crm-muted);font-size:13px}
.communication-history-footer{display:flex;align-items:center;justify-content:space-between;gap:15px;padding:13px 15px;border-top:1px solid var(--crm-border)}
.communication-history-count{color:var(--crm-muted);font-size:13px}
.communication-history-pagination{display:flex;align-items:center;gap:6px}
.communication-page-btn{width:34px;height:34px;border:1px solid var(--crm-border);border-radius:8px;background:var(--crm-surface);color:var(--crm-muted);display:grid;place-items:center;cursor:pointer}
.communication-page-btn:hover:not(:disabled){color:var(--crm-text);background:var(--crm-surface-2)}
.communication-page-btn:disabled{opacity:.45;cursor:not-allowed}
.communication-page-number{min-width:34px;height:34px;padding:0 9px;display:grid;place-items:center;border-radius:8px;background:var(--crm-primary-soft);color:var(--crm-primary);font-size:13px;font-weight:400}
.communication-modal-overlay{position:fixed;inset:0;z-index:1000;background:rgba(0,0,0,.48);display:flex;align-items:center;justify-content:center;padding:20px}
.communication-modal{width:min(700px,100%);max-height:90vh;overflow:auto;background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:16px;box-shadow:var(--crm-shadow)}
.communication-modal-header{display:flex;align-items:center;justify-content:space-between;gap:15px;padding:18px 20px;border-bottom:1px solid var(--crm-border)}
.communication-modal-title{margin:0;color:var(--crm-text);font-size:17px;font-weight:400}
.communication-modal-close{width:34px;height:34px;display:grid;place-items:center;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-muted);border-radius:8px;cursor:pointer}
.communication-modal-close:hover{color:var(--crm-text);background:var(--crm-surface-2)}
.communication-modal-close svg{width:17px;height:17px}
.communication-modal-body{padding:20px}
.communication-detail-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
.communication-detail-item{min-width:0}
.communication-detail-label{color:var(--crm-muted);font-size:13px;text-transform:uppercase;letter-spacing:.06em;font-weight:400;margin-bottom:5px}
.communication-detail-value{color:var(--crm-text);font-size:13px;word-break:break-word}
.communication-detail-full{grid-column:1 / -1}
.communication-message{margin-top:18px;border:1px solid var(--crm-border);border-radius:11px;overflow:hidden}
.communication-message-header{padding:10px 12px;background:var(--crm-surface-2);color:var(--crm-muted);font-size:13px;font-weight:400;border-bottom:1px solid var(--crm-border)}
.communication-message-body{padding:14px;color:var(--crm-text);font-size:13px;line-height:1.65;white-space:pre-wrap;word-break:break-word}
@media(max-width:1100px){.communication-history-stats{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media(max-width:800px){.communication-history-page{padding:16px}.communication-history-header{flex-direction:column}.communication-history-actions{width:100%}.communication-history-refresh{width:100%;justify-content:center}.communication-history-toolbar{flex-direction:column;align-items:stretch}.communication-history-search{max-width:none}.communication-history-filters{overflow-x:auto;flex-wrap:nowrap;padding-bottom:2px}.communication-history-filter{flex:0 0 auto}.communication-history-stats{grid-template-columns:repeat(2,minmax(0,1fr))}.communication-detail-grid{grid-template-columns:1fr}.communication-detail-full{grid-column:auto}.communication-history-footer{flex-direction:column;align-items:stretch}.communication-history-pagination{justify-content:flex-end}}
@media(max-width:480px){.communication-history-title{font-size:22px}.communication-history-stats{grid-template-columns:1fr 1fr}}
`}</style>

      <div className="communication-history-header">
        <div>
          <h1 className="communication-history-title">Communication History</h1>

          <p className="communication-history-subtitle">View and track all Email, WhatsApp and SMS communications from your business workspace.</p>
        </div>

        <div className="communication-history-actions">
          <button type="button" className={`communication-history-refresh ${refreshing ? "loading" : ""}`} onClick={() => loadHistory(true)} disabled={loading || refreshing || businessLoading}>
            <RefreshCw />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      <div className="communication-history-stats">
        <div className="communication-history-stat">
          <div className="communication-history-stat-label">Total Communications</div>

          <div className="communication-history-stat-value">{stats.total}</div>
        </div>

        <div className="communication-history-stat">
          <div className="communication-history-stat-label">Email</div>

          <div className="communication-history-stat-value">{stats.email}</div>
        </div>

        <div className="communication-history-stat">
          <div className="communication-history-stat-label">WhatsApp</div>

          <div className="communication-history-stat-value">{stats.whatsapp}</div>
        </div>

        <div className="communication-history-stat">
          <div className="communication-history-stat-label">SMS</div>

          <div className="communication-history-stat-value">{stats.sms}</div>
        </div>

        <div className="communication-history-stat">
          <div className="communication-history-stat-label">Failed</div>

          <div className="communication-history-stat-value">{stats.failed}</div>
        </div>
      </div>

      <div className="communication-history-toolbar">
        <div className="communication-history-search">
          <Search className="search-icon" />

          <input type="text" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search recipient, subject, message, status..." />

          {search && (
            <button type="button" className="communication-history-search-clear" onClick={clearSearch} aria-label="Clear search" title="Clear search">
              <X />
            </button>
          )}
        </div>

        <div className="communication-history-filters">
          {CHANNELS.map((item) => {
            const Icon = item.icon;

            return (
              <button key={item.value} type="button" className={`communication-history-filter ${channel === item.value ? "active" : ""}`} onClick={() => setChannel(item.value)}>
                {Icon && <Icon />}
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="communication-history-table-wrap">
        {loading || businessLoading ? (
          <div className="communication-loading">Loading communication history...</div>
        ) : filteredItems.length === 0 ? (
          <div className="communication-empty">
            <div className="communication-empty-icon">
              <Mail />
            </div>

            <div className="communication-empty-title">{search ? "No matching communications" : "No communications yet"}</div>

            <div className="communication-empty-text">{search ? "Try another search term or clear the search." : "Sent and received communications will appear here."}</div>
          </div>
        ) : (
          <>
            <div className="communication-history-table-scroll">
              <table className="communication-history-table">
                <thead>
                  <tr>
                    <th>Channel</th>
                    <th>Direction</th>
                    <th>Recipient</th>
                    <th>Subject / Message</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {filteredItems.map((item) => {
                    const ChannelIcon = getChannelIcon(item?.channel);
                    const StatusIcon = getStatusIcon(item?.status);

                    const direction = item?.direction === "INBOUND" ? "INBOUND" : "OUTBOUND";

                    return (
                      <tr
                        key={item?._id || item?.id || `${item?.createdAt}-${item?.to}`}
                        className="communication-history-row"
                        onClick={(event) => {
                          event.stopPropagation();
                          setSelectedCommunication(item);
                        }}>
                        <td>
                          <div className="communication-channel">
                            <div className="communication-channel-icon">
                              <ChannelIcon />
                            </div>

                            <span>{getChannelLabel(item?.channel)}</span>
                          </div>
                        </td>

                        <td>
                          <span className="communication-direction">
                            {direction === "INBOUND" ? <ArrowDownLeft /> : <ArrowUpRight />}

                            {direction === "INBOUND" ? "Received" : "Sent"}
                          </span>
                        </td>

                        <td>
                          <div className="communication-recipient" title={item?.to || item?.from || ""}>
                            {item?.to || item?.from || "-"}
                          </div>
                        </td>

                        <td>
                          {item?.subject ? (
                            <>
                              <div className="communication-subject" title={item.subject}>
                                {item.subject}
                              </div>

                              <div className="communication-body" title={item?.body || ""}>
                                {item?.body || "-"}
                              </div>
                            </>
                          ) : (
                            <div className="communication-body" title={item?.body || ""}>
                              {item?.body || "-"}
                            </div>
                          )}
                        </td>

                        <td>
                          <span className={`communication-status ${getStatusClass(item?.status)}`}>
                            <StatusIcon />
                            {item?.status || "UNKNOWN"}
                          </span>
                        </td>

                        <td>
                          <span title={item?.createdAt || ""}>{formatDate(item?.createdAt)}</span>
                        </td>

                        <td>
                          <button
                            type="button"
                            className="communication-view-btn"
                            onClick={(event) => {
                              event.stopPropagation();
                              setSelectedCommunication(item);
                            }}
                            title="View communication"
                            aria-label="View communication">
                            <Eye />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="communication-history-footer">
              <div className="communication-history-count">
                Showing {filteredItems.length} of {pagination.total || filteredItems.length} communications
              </div>

              {pagination.totalPages > 1 && (
                <div className="communication-history-pagination">
                  <button type="button" className="communication-page-btn" onClick={() => handlePageChange(page - 1)} disabled={page <= 1} title="Previous page">
                    <ChevronLeft />
                  </button>

                  <div className="communication-page-number">
                    {page}
                    {pagination.totalPages ? ` / ${pagination.totalPages}` : ""}
                  </div>

                  <button type="button" className="communication-page-btn" onClick={() => handlePageChange(page + 1)} disabled={pagination.totalPages > 0 && page >= pagination.totalPages} title="Next page">
                    <ChevronRight />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {selectedCommunication && (
        <div
          className="communication-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedCommunication(null);
            }
          }}>
          <div className="communication-modal">
            <div className="communication-modal-header">
              <h2 className="communication-modal-title">Communication Details</h2>

              <button type="button" className="communication-modal-close" onClick={() => setSelectedCommunication(null)} title="Close" aria-label="Close">
                <X />
              </button>
            </div>

            <div className="communication-modal-body">
              <div className="communication-detail-grid">
                <div className="communication-detail-item">
                  <div className="communication-detail-label">Channel</div>

                  <div className="communication-detail-value">{getChannelLabel(selectedCommunication?.channel)}</div>
                </div>

                <div className="communication-detail-item">
                  <div className="communication-detail-label">Status</div>

                  <div className="communication-detail-value">{selectedCommunication?.status || "-"}</div>
                </div>

                <div className="communication-detail-item">
                  <div className="communication-detail-label">Direction</div>

                  <div className="communication-detail-value">{selectedCommunication?.direction === "INBOUND" ? "Received" : "Sent"}</div>
                </div>

                <div className="communication-detail-item">
                  <div className="communication-detail-label">Date</div>

                  <div className="communication-detail-value">{formatDate(selectedCommunication?.createdAt)}</div>
                </div>

                <div className="communication-detail-item">
                  <div className="communication-detail-label">To</div>

                  <div className="communication-detail-value">{selectedCommunication?.to || "-"}</div>
                </div>

                <div className="communication-detail-item">
                  <div className="communication-detail-label">From</div>

                  <div className="communication-detail-value">{selectedCommunication?.from || "-"}</div>
                </div>

                {selectedCommunication?.subject && (
                  <div className="communication-detail-item communication-detail-full">
                    <div className="communication-detail-label">Subject</div>

                    <div className="communication-detail-value">{selectedCommunication.subject}</div>
                  </div>
                )}

                {selectedCommunication?.provider && (
                  <div className="communication-detail-item">
                    <div className="communication-detail-label">Provider</div>

                    <div className="communication-detail-value">{selectedCommunication.provider}</div>
                  </div>
                )}

                {selectedCommunication?.providerMessageId && (
                  <div className="communication-detail-item">
                    <div className="communication-detail-label">Provider Message ID</div>

                    <div className="communication-detail-value">{selectedCommunication.providerMessageId}</div>
                  </div>
                )}

                {selectedCommunication?.errorMessage && (
                  <div className="communication-detail-item communication-detail-full">
                    <div className="communication-detail-label">Error</div>

                    <div className="communication-detail-value">{selectedCommunication.errorMessage}</div>
                  </div>
                )}
              </div>

              <div className="communication-message">
                <div className="communication-message-header">Message</div>

                <div className="communication-message-body">{selectedCommunication?.body || "-"}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CommunicationHistory;
