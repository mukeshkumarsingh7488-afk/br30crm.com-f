import React, { useCallback, useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";

import useBusiness from "../../hooks/useBusiness";
import { getWhatsAppMessages, sendWhatsAppMessage } from "../../api/whatsapp.api";
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

  if (value === "SENT") return "wa-status wa-status-sent";
  if (value === "DELIVERED") return "wa-status wa-status-delivered";
  if (value === "RECEIVED") return "wa-status wa-status-received";
  if (value === "FAILED") return "wa-status wa-status-failed";
  if (value === "QUEUED") return "wa-status wa-status-queued";

  return "wa-status";
};

function WhatsApp() {
  const [whatsappIntegrationActive, setWhatsappIntegrationActive] = useState(false);
  const { businessId, loading: businessLoading } = useBusiness();
  useEffect(() => {
    if (!businessId) {
      setWhatsappIntegrationActive(false);
      return;
    }
    getIntegrations(businessId, { page: 1, limit: 100 })
      .then((result) => {
        const integrations = Array.isArray(result?.items) ? result.items : [];
        setWhatsappIntegrationActive(integrations.some((item) => String(item?.type || "").toUpperCase() === "WHATSAPP" && String(item?.status || "").toUpperCase() === "ACTIVE"));
      })
      .catch(() => setWhatsappIntegrationActive(false));
  }, [businessId]);

  useEffect(() => {
    if (!businessId) return;
    getCommunicationSenders(businessId)
      .then((result) => {
        const integrations = Array.isArray(result?.integrations) ? result.integrations : [];
        const match = integrations.find((item) => item.type === "WHATSAPP" && item.status === "ACTIVE");
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
        const response = await getWhatsAppMessages(businessId, {
          page,
          limit: 50,
        });

        setItems(unwrapItems(response));
        setPagination(getPagination(response));
      } catch (err) {
        const message = err?.response?.data?.message || err?.data?.message || err?.message || "Unable to load WhatsApp messages.";

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

    if (!whatsappIntegrationActive) {
      await Swal.fire({ icon: "warning", title: "WhatsApp integration not active", text: "Connect and activate the Brevo WhatsApp integration before sending.", confirmButtonText: "OK" });
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
        title: "WhatsApp number required",
        text: "Please enter the recipient WhatsApp number.",
      });
      return;
    }

    if (!message) {
      await Swal.fire({
        icon: "warning",
        title: "Message required",
        text: "Please enter a WhatsApp message.",
      });
      return;
    }

    setSending(true);

    try {
      const sendResult = await sendWhatsAppMessage(businessId, {
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
        title: "Message sent",
        text: "Your WhatsApp message was sent successfully.",
        timer: 1800,
        showConfirmButton: false,
      });

      await loadMessages(1);
    } catch (err) {
      const messageText = err?.response?.data?.message || err?.data?.message || err?.message || "Unable to send WhatsApp message.";

      await Swal.fire({
        icon: "error",
        title: "Message not sent",
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
    <div className="crm-page wa-page">
      <style>{` .crm-channel-sender-badge{font-size:13px;color:var(--crm-muted);margin-top:5px}.crm-channel-sender-badge strong{color:var(--crm-text);font-weight:400} 
        .wa-page{
          width:100%;
          min-height:100%;
          padding:24px;
          color:var(--crm-text);
          box-sizing:border-box;
        }

        .wa-header{
          display:flex;
          align-items:flex-start;
          justify-content:space-between;
          gap:20px;
          margin-bottom:20px;
        }

        .wa-title-wrap{
          min-width:0;
        }

        .wa-title{
          margin:0;
          font-size:24px;
          line-height:1.25;
          font-weight:400;
          color:var(--crm-text);
        }

        .wa-subtitle{
          margin:7px 0 0;
          font-size:13px;
          color:var(--crm-muted);
          line-height:1.5;
        }

        .wa-refresh{
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

        .wa-refresh:hover{
          background:var(--crm-surface-2);
          border-color:var(--crm-primary);
        }

        .wa-grid{
          display:grid;
          grid-template-columns:minmax(0,1fr) minmax(0,1.35fr);
          gap:18px;
          align-items:start;
        }

        .wa-card{
          background:var(--crm-surface);
          border:1px solid var(--crm-border);
          border-radius:14px;
          box-shadow:var(--crm-shadow);
          overflow:hidden;
        }

        .wa-card-header{
          padding:17px 18px;
          border-bottom:1px solid var(--crm-border);
        }

        .wa-card-title{
          margin:0;
          font-size:14px;
          font-weight:400;
          color:var(--crm-text);
        }

        .wa-card-subtitle{
          margin:5px 0 0;
          font-size:13px;
          color:var(--crm-muted);
        }

        .wa-form{
          padding:18px;
        }

        .wa-field{
          margin-bottom:16px;
        }

        .wa-label{
          display:block;
          margin-bottom:7px;
          font-size:13px;
          font-weight:400;
          color:var(--crm-text);
        }

        .wa-input,
        .wa-textarea{
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

        .wa-input{
          height:42px;
          padding:0 12px;
        }

        .wa-textarea{
          min-height:145px;
          padding:12px;
          resize:vertical;
          line-height:1.5;
        }

        .wa-input:focus,
        .wa-textarea:focus{
          border-color:var(--crm-primary);
          box-shadow:0 0 0 3px color-mix(in srgb,var(--crm-primary) 10%,transparent);
        }

        .wa-help{
          margin-top:6px;
          font-size:13px;
          color:var(--crm-muted);
        }

        .wa-send{
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

        .wa-send:hover:not(:disabled){
          filter:brightness(.96);
        }

        .wa-send:disabled{
          opacity:.55;
          cursor:not-allowed;
        }

        .wa-history{
          min-width:0;
        }

        .wa-history-body{
          min-height:300px;
        }

        .wa-loading,
        .wa-error,
        .wa-empty{
          padding:35px 20px;
          text-align:center;
          font-size:13px;
          color:var(--crm-muted);
        }

        .wa-error{
          color:var(--crm-danger);
        }

        .wa-list{
          display:flex;
          flex-direction:column;
        }

        .wa-row{
          padding:15px 18px;
          border-bottom:1px solid var(--crm-border);
        }

        .wa-row:last-child{
          border-bottom:0;
        }

        .wa-row-top{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:12px;
          margin-bottom:8px;
        }

        .wa-recipient{
          min-width:0;
          font-size:13px;
          font-weight:400;
          color:var(--crm-text);
          overflow:hidden;
          text-overflow:ellipsis;
          white-space:nowrap;
        }

        .wa-date{
          flex:0 0 auto;
          font-size:13px;
          color:var(--crm-muted);
        }

        .wa-message{
          margin:0;
          color:var(--crm-muted);
          font-size:13px;
          line-height:1.5;
          white-space:pre-wrap;
          word-break:break-word;
        }

        .wa-row-bottom{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:10px;
          margin-top:10px;
        }

        .wa-status{
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

        .wa-status-sent,
        .wa-status-delivered{
          color:var(--crm-success);
        }

        .wa-status-failed{
          color:var(--crm-danger);
        }

        .wa-provider{
          font-size:13px;
          color:var(--crm-muted);
        }

        .wa-pagination{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:12px;
          padding:13px 18px;
          border-top:1px solid var(--crm-border);
        }

        .wa-pagination-info{
          font-size:13px;
          color:var(--crm-muted);
        }

        .wa-pagination-actions{
          display:flex;
          gap:7px;
        }

        .wa-page-btn{
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

        .wa-page-btn:hover:not(:disabled){
          background:var(--crm-surface-2);
          border-color:var(--crm-primary);
        }

        .wa-page-btn:disabled{
          opacity:.45;
          cursor:not-allowed;
        }

        @media(max-width:1000px){
          .wa-grid{
            grid-template-columns:1fr;
          }
        }

        @media(max-width:600px){
          .wa-page{
            padding:16px;
          }

          .wa-header{
            align-items:stretch;
            flex-direction:column;
          }

          .wa-refresh{
            width:100%;
          }

          .wa-row-top{
            align-items:flex-start;
            flex-direction:column;
          }

          .wa-pagination{
            align-items:flex-start;
            flex-direction:column;
          }
        }
      `}</style>

      <div className="wa-header">
        <div className="wa-title-wrap">
          <h1 className="wa-title">WhatsApp</h1>
          {senderNumber && (
            <div className="crm-channel-sender-badge">
              Sending as <strong>{senderNumber}</strong> via Brevo
            </div>
          )}
          <p className="wa-subtitle">Send WhatsApp messages from your connected business WhatsApp identity and keep the communication history in BR30 CRM.</p>
        </div>

        <button type="button" className="wa-refresh" onClick={() => loadMessages(1)} disabled={loading || businessLoading}>
          Refresh
        </button>
      </div>

      <div className="wa-grid">
        <section className="wa-card">
          <div className="wa-card-header">
            <h2 className="wa-card-title">Send WhatsApp Message</h2>
            <p className="wa-card-subtitle">The sender identity is handled by your connected WhatsApp integration.</p>
          </div>

          <form className="wa-form" onSubmit={handleSend}>
            <div className="wa-field">
              <label className="wa-label" htmlFor="whatsapp-recipient">
                Recipient WhatsApp Number
              </label>

              <input id="whatsapp-recipient" type="tel" className="wa-input" value={to} onChange={(event) => setTo(event.target.value)} placeholder="+91 99999 99999" autoComplete="tel" />

              <div className="wa-help">Enter the recipient number with country code.</div>
            </div>

            <div className="wa-field">
              <label className="wa-label" htmlFor="whatsapp-message">
                Message
              </label>

              <textarea id="whatsapp-message" className="wa-textarea" value={body} onChange={(event) => setBody(event.target.value)} placeholder="Type your WhatsApp message..." maxLength={20000} />

              <div className="wa-help">{body.length}/20000 characters</div>
            </div>

            <button type="submit" className="wa-send" disabled={!canSend || businessLoading || !whatsappIntegrationActive}>
              {sending ? "Sending..." : "Send WhatsApp Message"}
            </button>
          </form>
        </section>

        <section className="wa-card wa-history">
          <div className="wa-card-header">
            <h2 className="wa-card-title">WhatsApp History</h2>
            <p className="wa-card-subtitle">Recent WhatsApp communication for this business.</p>
          </div>

          <div className="wa-history-body">
            {businessLoading || loading ? (
              <div className="wa-loading">Loading WhatsApp history...</div>
            ) : error ? (
              <div className="wa-error">{error}</div>
            ) : items.length === 0 ? (
              <div className="wa-empty">No WhatsApp communication found.</div>
            ) : (
              <div className="wa-list">
                {items.map((item) => (
                  <div className="wa-row" key={item?._id || item?.id}>
                    <div className="wa-row-top">
                      <div className="wa-recipient">{item?.direction === "INBOUND" ? `From: ${item?.from || item?.to || "Unknown"}` : `To: ${item?.to || "Unknown"}`}</div>

                      <div className="wa-date">{formatDateTime(item?.createdAt)}</div>
                    </div>

                    <p className="wa-message">{item?.body || "No message content"}</p>

                    <div className="wa-row-bottom">
                      <span className={statusClass(item?.status)}>{item?.status || "UNKNOWN"}</span>

                      {item?.provider && <span className="wa-provider">{item.provider}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {pagination.totalPages > 1 && (
            <div className="wa-pagination">
              <div className="wa-pagination-info">
                Page {pagination.page} of {pagination.totalPages}
                {pagination.total > 0 ? ` · ${pagination.total} messages` : ""}
              </div>

              <div className="wa-pagination-actions">
                <button type="button" className="wa-page-btn" disabled={loading || pagination.page <= 1} onClick={() => handlePageChange(pagination.page - 1)}>
                  Previous
                </button>

                <button type="button" className="wa-page-btn" disabled={loading || pagination.page >= pagination.totalPages} onClick={() => handlePageChange(pagination.page + 1)}>
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

export default WhatsApp;
