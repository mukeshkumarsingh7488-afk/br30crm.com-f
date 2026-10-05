import React, { useCallback, useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";

import useBusiness from "../../hooks/useBusiness";
import { getSmsMessages, sendSms } from "../../api/sms.api";
import { getCommunicationSenders } from "../../api/communication.api";
import { getIntegrations } from "../../api/integration.api";

const unwrapItems = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.items)) return response.items;
  if (Array.isArray(response?.data?.items)) return response.data.items;
  return [];
};

const getPagination = (response) => {
  const pagination = response?.pagination || response?.data?.pagination || {};

  return {
    page: Number(pagination.page) || 1,
    limit: Number(pagination.limit) || 50,
    total: Number(pagination.total) || 0,
    totalPages: Number(pagination.totalPages) || 0,
  };
};

const formatDateTime = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const statusClass = (status) => {
  const value = String(status || "").toUpperCase();

  if (value === "SENT") return "sms-status sms-status-sent";
  if (value === "DELIVERED") return "sms-status sms-status-delivered";
  if (value === "RECEIVED") return "sms-status sms-status-received";
  if (value === "FAILED") return "sms-status sms-status-failed";
  if (value === "QUEUED") return "sms-status sms-status-queued";

  return "sms-status";
};

function SMS() {
  const [smsIntegrationActive, setSmsIntegrationActive] = useState(false);
  const { businessId, loading: businessLoading } = useBusiness();
  useEffect(() => {
    if (!businessId) {
      setSmsIntegrationActive(false);
      return;
    }
    getIntegrations(businessId, { page: 1, limit: 100 })
      .then((result) => {
        const integrations = Array.isArray(result?.items) ? result.items : [];
        setSmsIntegrationActive(integrations.some((item) => String(item?.type || "").toUpperCase() === "SMS" && String(item?.status || "").toUpperCase() === "ACTIVE"));
      })
      .catch(() => setSmsIntegrationActive(false));
  }, [businessId]);

  useEffect(() => {
    if (!businessId) return;
    getCommunicationSenders(businessId)
      .then((result) => {
        const integrations = Array.isArray(result?.integrations) ? result.integrations : [];
        const match = integrations.find((item) => item.type === "SMS" && item.status === "ACTIVE");
        setSenderNumber(match?.config?.senderNumber || match?.config?.phoneNumber || match?.config?.sender || result?.email?.sender || "");
      })
      .catch(() => setSenderNumber(""));
  }, [businessId]);

  const [to, setTo] = useState("");
  const [senderNumber, setSenderNumber] = useState("");
  const [body, setBody] = useState("");

  const [items, setItems] = useState([]);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  });

  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const loadMessages = useCallback(
    async (page = 1) => {
      if (!businessId) return;

      setLoading(true);
      setError("");

      try {
        const response = await getSmsMessages(businessId, {
          page,
          limit: 50,
        });

        setItems(unwrapItems(response));
        setPagination(getPagination(response));
      } catch (err) {
        const message = err?.response?.data?.message || err?.data?.message || err?.message || "Unable to load SMS history.";

        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [businessId]
  );

  useEffect(() => {
    if (!businessId) return;

    loadMessages(1);
  }, [businessId, loadMessages]);

  const canSend = useMemo(() => {
    return Boolean(businessId && String(to).trim() && String(body).trim() && !sending);
  }, [businessId, to, body, sending]);

  const handleSend = async (event) => {
    event.preventDefault();

    if (!smsIntegrationActive) {
      await Swal.fire({ icon: "warning", title: "SMS integration not active", text: "Connect and activate the Brevo SMS integration before sending.", confirmButtonText: "OK" });
      return;
    }

    const recipient = String(to).trim();
    const message = String(body).trim();

    if (!businessId) {
      await Swal.fire({
        icon: "warning",
        title: "Business workspace not found",
        text: "Please select a valid business workspace first.",
      });

      return;
    }

    if (!recipient) {
      await Swal.fire({
        icon: "warning",
        title: "Mobile number required",
        text: "Please enter the recipient mobile number.",
      });

      return;
    }

    if (!message) {
      await Swal.fire({
        icon: "warning",
        title: "Message required",
        text: "Please enter an SMS message.",
      });

      return;
    }

    setSending(true);

    try {
      const sendResult = await sendSms(businessId, {
        to: recipient,
        body: message,
      });

      if (String(sendResult?.status || "").toUpperCase() !== "DELIVERED" || sendResult?.delivered !== true) {
        throw new Error(sendResult?.message || "Brevo delivery confirmation was not received.");
      }

      setTo("");
      setBody("");

      await Swal.fire({
        icon: "success",
        title: "SMS sent",
        text: "Your SMS was sent successfully.",
        timer: 1800,
        showConfirmButton: false,
      });

      await loadMessages(1);
    } catch (err) {
      const messageText = err?.response?.data?.message || err?.data?.message || err?.message || "Unable to send SMS.";

      await Swal.fire({
        icon: "error",
        title: "SMS not sent",
        text: messageText,
      });
    } finally {
      setSending(false);
    }
  };

  const handlePageChange = async (page) => {
    if (page < 1 || (pagination.totalPages > 0 && page > pagination.totalPages)) {
      return;
    }

    await loadMessages(page);
  };

  return (
    <div className="crm-page sms-page">
      <style>{` .crm-channel-sender-badge{font-size:13px;color:var(--crm-muted);margin-top:5px}.crm-channel-sender-badge strong{color:var(--crm-text);font-weight:400} 
        .sms-page{
          width:100%;
          min-height:100%;
          padding:24px;
          color:var(--crm-text);
          box-sizing:border-box;
        }

        .sms-header{
          display:flex;
          align-items:flex-start;
          justify-content:space-between;
          gap:20px;
          margin-bottom:20px;
        }

        .sms-title-wrap{
          min-width:0;
        }

        .sms-title{
          margin:0;
          font-size:24px;
          line-height:1.25;
          font-weight:400;
          color:var(--crm-text);
        }

        .sms-subtitle{
          margin:7px 0 0;
          font-size:13px;
          color:var(--crm-muted);
          line-height:1.5;
        }

        .sms-refresh{
          height:38px;
          padding:0 14px;
          border:1px solid var(--crm-border);
          border-radius:9px;
          background:var(--crm-surface);
          color:var(--crm-text);
          cursor:pointer;
          font-size:13px;
          font-weight:400;
        }

        .sms-refresh:hover{
          background:var(--crm-surface-2);
          border-color:var(--crm-primary);
        }

        .sms-grid{
          display:grid;
          grid-template-columns:minmax(0,1fr) minmax(0,1.35fr);
          gap:18px;
          align-items:start;
        }

        .sms-card{
          background:var(--crm-surface);
          border:1px solid var(--crm-border);
          border-radius:14px;
          box-shadow:var(--crm-shadow);
          overflow:hidden;
        }

        .sms-card-header{
          padding:17px 18px;
          border-bottom:1px solid var(--crm-border);
        }

        .sms-card-title{
          margin:0;
          font-size:14px;
          font-weight:400;
          color:var(--crm-text);
        }

        .sms-card-subtitle{
          margin:5px 0 0;
          font-size:13px;
          color:var(--crm-muted);
        }

        .sms-form{
          padding:18px;
        }

        .sms-field{
          margin-bottom:16px;
        }

        .sms-label{
          display:block;
          margin-bottom:7px;
          font-size:13px;
          font-weight:400;
          color:var(--crm-text);
        }

        .sms-input,
        .sms-textarea{
          width:100%;
          box-sizing:border-box;
          border:1px solid var(--crm-border);
          background:var(--crm-surface);
          color:var(--crm-text);
          border-radius:9px;
          outline:none;
          font-family:inherit;
          font-size:13px;
          transition:border-color .18s,box-shadow .18s;
        }

        .sms-input{
          height:42px;
          padding:0 12px;
        }

        .sms-textarea{
          min-height:145px;
          padding:12px;
          resize:vertical;
          line-height:1.5;
        }

        .sms-input:focus,
        .sms-textarea:focus{
          border-color:var(--crm-primary);
          box-shadow:0 0 0 3px color-mix(in srgb,var(--crm-primary) 10%,transparent);
        }

        .sms-help{
          margin-top:6px;
          font-size:13px;
          color:var(--crm-muted);
        }

        .sms-send{
          width:100%;
          height:42px;
          border:0;
          border-radius:9px;
          background:var(--crm-primary);
          color:#fff;
          cursor:pointer;
          font-size:13px;
          font-weight:400;
        }

        .sms-send:hover:not(:disabled){
          filter:brightness(.96);
        }

        .sms-send:disabled{
          opacity:.55;
          cursor:not-allowed;
        }

        .sms-history{
          min-width:0;
        }

        .sms-history-body{
          min-height:300px;
        }

        .sms-loading,
        .sms-error,
        .sms-empty{
          padding:35px 20px;
          text-align:center;
          font-size:13px;
          color:var(--crm-muted);
        }

        .sms-error{
          color:var(--crm-danger);
        }

        .sms-list{
          display:flex;
          flex-direction:column;
        }

        .sms-row{
          padding:15px 18px;
          border-bottom:1px solid var(--crm-border);
        }

        .sms-row:last-child{
          border-bottom:0;
        }

        .sms-row-top{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:12px;
          margin-bottom:8px;
        }

        .sms-recipient{
          min-width:0;
          font-size:13px;
          font-weight:400;
          color:var(--crm-text);
          overflow:hidden;
          text-overflow:ellipsis;
          white-space:nowrap;
        }

        .sms-date{
          flex:0 0 auto;
          font-size:13px;
          color:var(--crm-muted);
        }

        .sms-message{
          margin:0;
          color:var(--crm-muted);
          font-size:13px;
          line-height:1.5;
          white-space:pre-wrap;
          word-break:break-word;
        }

        .sms-row-bottom{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:10px;
          margin-top:10px;
        }

        .sms-status{
          display:inline-flex;
          align-items:center;
          min-height:24px;
          padding:0 8px;
          border-radius:999px;
          border:1px solid var(--crm-border);
          font-size:13px;
          font-weight:400;
          letter-spacing:.03em;
          color:var(--crm-muted);
          background:var(--crm-surface-2);
        }

        .sms-status-sent,
        .sms-status-delivered{
          color:var(--crm-success);
        }

        .sms-status-failed{
          color:var(--crm-danger);
        }

        .sms-provider{
          font-size:13px;
          color:var(--crm-muted);
        }

        .sms-pagination{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:12px;
          padding:13px 18px;
          border-top:1px solid var(--crm-border);
        }

        .sms-pagination-info{
          font-size:13px;
          color:var(--crm-muted);
        }

        .sms-pagination-actions{
          display:flex;
          gap:7px;
        }

        .sms-page-btn{
          min-width:34px;
          height:32px;
          padding:0 9px;
          border:1px solid var(--crm-border);
          border-radius:8px;
          background:var(--crm-surface);
          color:var(--crm-text);
          cursor:pointer;
          font-size:13px;
        }

        .sms-page-btn:hover:not(:disabled){
          background:var(--crm-surface-2);
          border-color:var(--crm-primary);
        }

        .sms-page-btn:disabled{
          opacity:.45;
          cursor:not-allowed;
        }

        @media(max-width:1000px){
          .sms-grid{
            grid-template-columns:1fr;
          }
        }

        @media(max-width:600px){
          .sms-page{
            padding:16px;
          }

          .sms-header{
            align-items:stretch;
            flex-direction:column;
          }

          .sms-refresh{
            width:100%;
          }

          .sms-row-top{
            align-items:flex-start;
            flex-direction:column;
          }

          .sms-pagination{
            align-items:flex-start;
            flex-direction:column;
          }
        }
      `}</style>

      <div className="sms-header">
        <div className="sms-title-wrap">
          <h1 className="sms-title">SMS</h1>
          {senderNumber && (
            <div className="crm-channel-sender-badge">
              Sending as <strong>{senderNumber}</strong> via Brevo
            </div>
          )}

          <p className="sms-subtitle">Send SMS from your connected business SMS identity and keep all communication records inside BR30 CRM.</p>
        </div>

        <button type="button" className="sms-refresh" onClick={() => loadMessages(1)} disabled={loading || businessLoading}>
          Refresh
        </button>
      </div>

      <div className="sms-grid">
        <section className="sms-card">
          <div className="sms-card-header">
            <h2 className="sms-card-title">Send SMS</h2>

            <p className="sms-card-subtitle">The sender identity is handled by your connected SMS provider.</p>
          </div>

          <form className="sms-form" onSubmit={handleSend}>
            <div className="sms-field">
              <label className="sms-label" htmlFor="sms-recipient">
                Recipient Mobile Number
              </label>

              <input id="sms-recipient" type="tel" className="sms-input" value={to} onChange={(event) => setTo(event.target.value)} placeholder="+91 99999 99999" autoComplete="tel" />

              <div className="sms-help">Enter the recipient number with country code.</div>
            </div>

            <div className="sms-field">
              <label className="sms-label" htmlFor="sms-message">
                Message
              </label>

              <textarea id="sms-message" className="sms-textarea" value={body} onChange={(event) => setBody(event.target.value)} placeholder="Type your SMS message..." maxLength={20000} />

              <div className="sms-help">{body.length}/20000 characters</div>
            </div>

            <button type="submit" className="sms-send" disabled={!canSend || businessLoading || !smsIntegrationActive}>
              {sending ? "Sending..." : "Send SMS"}
            </button>
          </form>
        </section>

        <section className="sms-card sms-history">
          <div className="sms-card-header">
            <h2 className="sms-card-title">SMS History</h2>

            <p className="sms-card-subtitle">Recent SMS communication for this business.</p>
          </div>

          <div className="sms-history-body">
            {businessLoading || loading ? (
              <div className="sms-loading">Loading SMS history...</div>
            ) : error ? (
              <div className="sms-error">{error}</div>
            ) : items.length === 0 ? (
              <div className="sms-empty">No SMS communication found.</div>
            ) : (
              <div className="sms-list">
                {items.map((item) => (
                  <div className="sms-row" key={item?._id || item?.id}>
                    <div className="sms-row-top">
                      <div className="sms-recipient">{item?.direction === "INBOUND" ? `From: ${item?.from || item?.to || "Unknown"}` : `To: ${item?.to || "Unknown"}`}</div>

                      <div className="sms-date">{formatDateTime(item?.createdAt)}</div>
                    </div>

                    <p className="sms-message">{item?.body || "No message content"}</p>

                    <div className="sms-row-bottom">
                      <span className={statusClass(item?.status)}>{item?.status || "UNKNOWN"}</span>

                      {item?.provider && <span className="sms-provider">{item.provider}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {pagination.totalPages > 1 && (
            <div className="sms-pagination">
              <div className="sms-pagination-info">
                Page {pagination.page} of {pagination.totalPages}
                {pagination.total > 0 ? ` · ${pagination.total} messages` : ""}
              </div>

              <div className="sms-pagination-actions">
                <button type="button" className="sms-page-btn" disabled={loading || pagination.page <= 1} onClick={() => handlePageChange(pagination.page - 1)}>
                  Previous
                </button>

                <button type="button" className="sms-page-btn" disabled={loading || pagination.page >= pagination.totalPages} onClick={() => handlePageChange(pagination.page + 1)}>
                  Next
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default SMS;
