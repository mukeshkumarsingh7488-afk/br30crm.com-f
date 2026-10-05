import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Mail, Plus, Search, RefreshCw, X, Send, Inbox, CheckCircle2, Clock3, AlertCircle, ChevronLeft, ChevronRight, Eye, Reply } from "lucide-react";

import useBusiness from "../../hooks/useBusiness";
import { getEmails, sendEmail } from "../../api/email.api";
import { getCommunicationSenders } from "../../api/communication.api";
import { getIntegrations } from "../../api/integration.api";
import { showAuthAlert } from "../../components/auth/authAlert";

const PAGE_SIZE = 50;

const formatDateTime = (value) => {
  if (!value) return "—";

  try {
    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return "—";
  }
};

const getInitials = (value = "") => {
  const text = String(value).trim();

  if (!text) return "M";

  return text
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
};

const getStatusClass = (status) => {
  switch (String(status || "").toUpperCase()) {
    case "SENT":
    case "DELIVERED":
      return "email-status-success";

    case "QUEUED":
      return "email-status-pending";

    case "FAILED":
      return "email-status-failed";

    case "RECEIVED":
      return "email-status-received";

    default:
      return "email-status-default";
  }
};

const getStatusIcon = (status) => {
  switch (String(status || "").toUpperCase()) {
    case "SENT":
    case "DELIVERED":
      return <CheckCircle2 size={14} />;

    case "QUEUED":
      return <Clock3 size={14} />;

    case "FAILED":
      return <AlertCircle size={14} />;

    case "RECEIVED":
      return <Inbox size={14} />;

    default:
      return <Mail size={14} />;
  }
};

const normalizeEmailResponse = (response) => {
  if (Array.isArray(response)) {
    return {
      items: response,
      pagination: {
        page: 1,
        limit: PAGE_SIZE,
        total: response.length,
        totalPages: 1,
      },
    };
  }

  const root = response?.data || response || {};

  const data = root?.data && typeof root.data === "object" ? root.data : root;

  const items = Array.isArray(data?.items) ? data.items : Array.isArray(data?.emails) ? data.emails : [];

  const pagination = data?.pagination || {};

  return {
    items,
    pagination: {
      page: Number(pagination.page) || 1,
      limit: Number(pagination.limit) || PAGE_SIZE,
      total: Number(pagination.total) || items.length,
      totalPages: Number(pagination.totalPages) || (items.length ? 1 : 0),
    },
  };
};

const getErrorMessage = (error, fallback = "Something went wrong.") => {
  return error?.response?.data?.message || error?.response?.data?.error || error?.data?.message || error?.message || fallback;
};

function Email() {
  const { businessId, loading: businessLoading, error: businessError } = useBusiness();

  const [emails, setEmails] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sending, setSending] = useState(false);

  const [error, setError] = useState("");

  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 0,
  });

  const [search, setSearch] = useState("");

  const [composeOpen, setComposeOpen] = useState(false);
  const [senderEmail, setSenderEmail] = useState("");
  const [emailIntegrationActive, setEmailIntegrationActive] = useState(false);

  const [viewEmail, setViewEmail] = useState(null);

  const [form, setForm] = useState({
    to: "",
    subject: "",
    body: "",
  });

  /*
   * ============================================================
   * LOAD EMAILS
   * ============================================================
   */

  const loadEmails = useCallback(
    async (showRefreshLoader = false) => {
      if (!businessId) {
        setEmails([]);
        setLoading(false);
        return;
      }

      if (showRefreshLoader) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      try {
        const response = await getEmails(businessId, {
          page,
          limit: PAGE_SIZE,
        });

        const normalized = normalizeEmailResponse(response);

        setEmails(normalized.items);

        setPagination(normalized.pagination);
      } catch (err) {
        console.error("Unable to load emails:", err);

        setEmails([]);

        const message = getErrorMessage(err, "Unable to load email communication history.");

        setError(message);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [businessId, page]
  );

  useEffect(() => {
    loadEmails();
  }, [loadEmails]);

  useEffect(() => {
    if (!businessId) return;
    Promise.all([getCommunicationSenders(businessId).catch(() => null), getIntegrations(businessId, { page: 1, limit: 100 }).catch(() => ({ items: [] }))])
      .then(([result, integrationResult]) => {
        const integrations = Array.isArray(integrationResult?.items) ? integrationResult.items : [];
        const active = integrations.some((item) => String(item?.type || "").toUpperCase() === "EMAIL" && String(item?.status || "").toUpperCase() === "ACTIVE");
        setEmailIntegrationActive(active);
        setSenderEmail(result?.email?.sender || "");
      })
      .catch(() => {
        setEmailIntegrationActive(false);
        setSenderEmail("");
      });
  }, [businessId]);

  /*
   * ============================================================
   * SEARCH
   * ============================================================
   */

  const filteredEmails = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return emails;

    return emails.filter((email) => {
      const values = [email?.to, email?.from, email?.subject, email?.body, email?.status, email?.provider, email?.direction];

      return values.some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(query)
      );
    });
  }, [emails, search]);

  /*
   * ============================================================
   * STATS
   * ============================================================
   */

  const stats = useMemo(() => {
    const sent = emails.filter((item) => ["SENT", "DELIVERED"].includes(String(item?.status || "").toUpperCase())).length;

    const queued = emails.filter((item) => String(item?.status || "").toUpperCase() === "QUEUED").length;

    const failed = emails.filter((item) => String(item?.status || "").toUpperCase() === "FAILED").length;

    const received = emails.filter((item) => String(item?.direction || "").toUpperCase() === "INBOUND" || String(item?.status || "").toUpperCase() === "RECEIVED").length;

    return {
      total: pagination.total || emails.length,
      sent,
      queued,
      failed,
      received,
    };
  }, [emails, pagination.total]);

  /*
   * ============================================================
   * FORM
   * ============================================================
   */

  const resetCompose = () => {
    setForm({
      to: "",
      subject: "",
      body: "",
    });
  };

  const closeCompose = () => {
    if (sending) return;

    setComposeOpen(false);
    resetCompose();
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /*
   * ============================================================
   * VALIDATION
   * ============================================================
   */

  const validateForm = () => {
    const to = form.to.trim();
    const subject = form.subject.trim();
    const body = form.body.trim();

    if (!to) {
      showAuthAlert({
        icon: "warning",
        title: "Recipient required",
        text: "Please enter the recipient email address.",
        confirmButtonText: "OK",
      });

      return false;
    }

    const recipients = to
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const invalidRecipient = recipients.find((email) => !emailPattern.test(email));

    if (invalidRecipient) {
      showAuthAlert({
        icon: "warning",
        title: "Invalid email",
        text: `"${invalidRecipient}" is not a valid email address.`,
        confirmButtonText: "OK",
      });

      return false;
    }

    if (!subject) {
      showAuthAlert({
        icon: "warning",
        title: "Subject required",
        text: "Please enter an email subject.",
        confirmButtonText: "OK",
      });

      return false;
    }

    if (!body) {
      showAuthAlert({
        icon: "warning",
        title: "Message required",
        text: "Please enter your email message.",
        confirmButtonText: "OK",
      });

      return false;
    }

    return true;
  };

  /*
   * ============================================================
   * SEND EMAIL
   * ============================================================
   */

  const handleSendEmail = async (event) => {
    event.preventDefault();

    if (!businessId || sending) return;

    if (!emailIntegrationActive) {
      await showAuthAlert({
        icon: "warning",
        title: "Email integration not active",
        text: "Connect and activate the Brevo Email integration before sending email.",
        confirmButtonText: "OK",
      });
      return;
    }

    if (!validateForm()) return;

    setSending(true);

    try {
      const recipients = form.to
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      const recipient = recipients.length === 1 ? recipients[0] : recipients.join(",");

      const sendResult = await sendEmail(businessId, {
        to: recipient,
        subject: form.subject.trim(),
        body: form.body.trim(),
        html: form.body.trim().replace(/\n/g, "<br />"),
      });

      const status = String(sendResult?.status || "").toUpperCase();
      const accepted = sendResult?.accepted === true || sendResult?.queued === true || status === "QUEUED" || status === "SENT" || status === "DELIVERED";

      const failed = status === "FAILED" || sendResult?.success === false || sendResult?.delivered === false;

      if (failed && !accepted) {
        throw new Error(sendResult?.message || sendResult?.errorMessage || "Email could not be sent.");
      }

      setComposeOpen(false);
      resetCompose();

      await showAuthAlert({
        icon: "success",
        title: "Email sent",
        text: status === "DELIVERED" ? "Your email was delivered successfully." : "Your email was accepted by Brevo and is being delivered. Delivery status will update in communication history.",
        timer: 2200,
        showConfirmButton: false,
      });

      if (page !== 1) {
        setPage(1);
      } else {
        await loadEmails();
      }
    } catch (err) {
      console.error("Email sending failed:", err);

      await showAuthAlert({
        icon: "error",
        title: "Email not sent",
        text: getErrorMessage(err, "Unable to send email."),
        confirmButtonText: "OK",
      });
    } finally {
      setSending(false);
    }
  };

  /*
   * ============================================================
   * PAGINATION
   * ============================================================
   */

  const handlePreviousPage = () => {
    if (page <= 1) return;

    setPage((previous) => previous - 1);
  };

  const handleNextPage = () => {
    if (!pagination.totalPages || page >= pagination.totalPages) {
      return;
    }

    setPage((previous) => previous + 1);
  };

  /*
   * ============================================================
   * UI ACTIONS
   * ============================================================
   */

  const handleRefresh = async () => {
    await loadEmails(true);
  };

  const handleOpenCompose = () => {
    resetCompose();
    setComposeOpen(true);
  };

  return (
    <div className="crm-email-page">
      <style>{`
.crm-email-page{width:100%;min-height:100%;padding:24px;color:var(--crm-text);background:var(--crm-bg);box-sizing:border-box;}
.crm-email-header{display:flex;align-items:flex-start;justify-content:space-between;gap:20px;margin-bottom:22px;}
.crm-email-sender-badge{font-size:13px;color:var(--crm-muted);margin-top:6px;}
.crm-email-sender-badge strong{color:var(--crm-text);font-weight:400;}
.crm-email-heading{display:flex;align-items:center;gap:12px;min-width:0;}
.crm-email-heading h1{margin:0;font-size:24px;line-height:1.2;font-weight:400;color:var(--crm-text);}
.crm-email-heading p{margin:5px 0 0;font-size:13px;color:var(--crm-muted);}
.crm-email-header-actions{display:flex;align-items:center;gap:8px;}
.crm-email-btn{height:40px;padding:0 14px;border-radius:10px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);display:inline-flex;align-items:center;justify-content:center;gap:8px;cursor:pointer;font-size:13px;font-weight:400;transition:.18s ease;}
.crm-email-btn:hover{border-color:var(--crm-primary);color:var(--crm-primary);background:var(--crm-surface-2);}
.crm-email-btn-primary{border-color:var(--crm-primary);background:var(--crm-primary);color:#fff;}
.crm-email-btn-primary:hover{background:var(--crm-primary);color:#fff;opacity:.92;}
.crm-email-btn:disabled{opacity:.55;cursor:not-allowed;}
.crm-email-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;margin-bottom:18px;}
.crm-email-stat{min-height:88px;padding:16px;border:1px solid var(--crm-border);border-radius:14px;background:var(--crm-surface);display:flex;align-items:center;gap:13px;box-sizing:border-box;}
.crm-email-stat-icon{width:38px;height:38px;min-width:38px;border-radius:10px;display:grid;place-items:center;background:var(--crm-surface-2);color:var(--crm-primary);}
.crm-email-stat-value{font-size:21px;line-height:1.1;font-weight:400;color:var(--crm-text);}
.crm-email-stat-label{margin-top:4px;font-size:13px;color:var(--crm-muted);}
.crm-email-panel{border:1px solid var(--crm-border);border-radius:15px;background:var(--crm-surface);overflow:hidden;}
.crm-email-toolbar{min-height:68px;padding:12px 14px;border-bottom:1px solid var(--crm-border);display:flex;align-items:center;justify-content:space-between;gap:12px;box-sizing:border-box;}
.crm-email-search{position:relative;width:min(390px,100%);}
.crm-email-search svg{position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--crm-muted);pointer-events:none;}
.crm-email-search input{width:100%;height:40px;box-sizing:border-box;border:1px solid var(--crm-border);border-radius:10px;outline:none;padding:0 38px;background:var(--crm-surface);color:var(--crm-text);font-size:13px;}
.crm-email-search input:focus{border-color:var(--crm-primary);}
.crm-email-search-clear{position:absolute;right:8px;top:50%;transform:translateY(-50%);width:25px;height:25px;border:0;border-radius:7px;color:var(--crm-muted);background:transparent;display:grid;place-items:center;cursor:pointer;padding:0;}
.crm-email-search-clear:hover{color:var(--crm-text);background:transparent;}
.crm-email-table-wrap{width:100%;overflow-x:auto;}
.crm-email-table{width:100%;border-collapse:collapse;min-width:850px;}
.crm-email-table th{height:44px;padding:0 16px;text-align:left;background:var(--crm-surface-2);border-bottom:1px solid var(--crm-border);color:var(--crm-muted);font-size:13px;font-weight:400;text-transform:uppercase;letter-spacing:.05em;white-space:nowrap;}
.crm-email-table td{padding:13px 16px;border-bottom:1px solid var(--crm-border);color:var(--crm-text);font-size:13px;vertical-align:middle;}
.crm-email-table tbody tr{cursor:pointer;transition:background .15s ease;}
.crm-email-table tbody tr:hover{background:var(--crm-surface-2);}
.crm-email-recipient{display:flex;align-items:center;gap:10px;min-width:190px;}
.crm-email-avatar{width:34px;height:34px;min-width:34px;border-radius:50%;display:grid;place-items:center;background:var(--crm-primary-soft);color:var(--crm-primary);font-size:13px;font-weight:400;}
.crm-email-recipient-main{min-width:0;}
.crm-email-recipient-address{max-width:240px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:400;color:var(--crm-text);}
.crm-email-direction{margin-top:3px;font-size:13px;color:var(--crm-muted);}
.crm-email-subject{max-width:310px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:400;}
.crm-email-preview{max-width:300px;margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--crm-muted);font-size:13px;}
.crm-email-status{display:inline-flex;align-items:center;gap:5px;height:27px;padding:0 9px;border-radius:999px;font-size:13px;font-weight:400;white-space:nowrap;border:1px solid var(--crm-border);}
.email-status-success{color:var(--crm-success);background:color-mix(in srgb,var(--crm-success) 9%,transparent);}
.email-status-pending{color:var(--crm-warning);background:color-mix(in srgb,var(--crm-warning) 9%,transparent);}
.email-status-failed{color:var(--crm-danger);background:color-mix(in srgb,var(--crm-danger) 9%,transparent);}
.email-status-received{color:var(--crm-primary);background:var(--crm-primary-soft);}
.email-status-default{color:var(--crm-muted);background:var(--crm-surface-2);}
.crm-email-date{white-space:nowrap;color:var(--crm-muted);font-size:13px;}
.crm-email-view-btn{width:34px;height:34px;border:1px solid var(--crm-border);border-radius:9px;background:var(--crm-surface);color:var(--crm-muted);display:grid;place-items:center;cursor:pointer;}
.crm-email-view-btn:hover{color:var(--crm-primary);border-color:var(--crm-primary);}
.crm-email-empty{min-height:260px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:30px;text-align:center;color:var(--crm-muted);}
.crm-email-empty-icon{width:54px;height:54px;border-radius:15px;display:grid;place-items:center;background:var(--crm-surface-2);color:var(--crm-muted);margin-bottom:12px;}
.crm-email-empty h3{margin:0;color:var(--crm-text);font-size:15px;}
.crm-email-empty p{margin:6px 0 0;font-size:13px;}
.crm-email-error{margin:14px;padding:13px 14px;border:1px solid color-mix(in srgb,var(--crm-danger) 25%,var(--crm-border));border-radius:10px;color:var(--crm-danger);background:color-mix(in srgb,var(--crm-danger) 7%,transparent);font-size:13px;}
.crm-email-pagination{min-height:62px;padding:10px 14px;display:flex;align-items:center;justify-content:space-between;gap:12px;border-top:1px solid var(--crm-border);}
.crm-email-pagination-info{font-size:13px;color:var(--crm-muted);}
.crm-email-pagination-actions{display:flex;align-items:center;gap:6px;}
.crm-email-page-btn{width:34px;height:34px;border:1px solid var(--crm-border);border-radius:8px;background:var(--crm-surface);color:var(--crm-muted);display:grid;place-items:center;cursor:pointer;}
.crm-email-page-btn:hover:not(:disabled){color:var(--crm-primary);border-color:var(--crm-primary);}
.crm-email-page-btn:disabled{opacity:.45;cursor:not-allowed;}
.crm-email-page-number{min-width:70px;text-align:center;font-size:13px;color:var(--crm-text);}
.crm-email-overlay{position:fixed;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(0,0,0,.48);box-sizing:border-box;}
.crm-email-modal{width:min(720px,100%);max-height:calc(100vh - 40px);overflow:auto;border:1px solid var(--crm-border);border-radius:16px;background:var(--crm-surface);box-shadow:var(--crm-shadow);}
.crm-email-modal-header{height:64px;padding:0 18px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--crm-border);}
.crm-email-modal-title{display:flex;align-items:center;gap:10px;color:var(--crm-text);font-size:16px;font-weight:400;}
.crm-email-modal-close{width:34px;height:34px;border:0;border-radius:8px;background:transparent;color:var(--crm-muted);display:grid;place-items:center;cursor:pointer;}
.crm-email-modal-close:hover{color:var(--crm-text);background:var(--crm-surface-2);}
.crm-email-form{padding:18px;}
.crm-email-field{margin-bottom:15px;}
.crm-email-field label{display:block;margin-bottom:7px;color:var(--crm-text);font-size:13px;font-weight:400;}
.crm-email-field input,.crm-email-field textarea{width:100%;box-sizing:border-box;border:1px solid var(--crm-border);border-radius:10px;background:var(--crm-surface-2);color:var(--crm-text);outline:none;font-size:13px;font-family:inherit;}
.crm-email-field input{height:42px;padding:0 12px;}
.crm-email-field textarea{min-height:240px;resize:vertical;padding:12px;line-height:1.55;}
.crm-email-field input:focus,.crm-email-field textarea:focus{border-color:var(--crm-primary);background:var(--crm-surface);}
.crm-email-help{margin-top:6px;color:var(--crm-muted);font-size:13px;}
.crm-email-modal-footer{padding:14px 18px;border-top:1px solid var(--crm-border);display:flex;align-items:center;justify-content:flex-end;gap:8px;}
.crm-email-view-modal{width:min(760px,100%);}
.crm-email-detail{padding:18px;}
.crm-email-detail-row{margin-bottom:15px;}
.crm-email-detail-label{margin-bottom:5px;color:var(--crm-muted);font-size:13px;font-weight:400;text-transform:uppercase;letter-spacing:.05em;}
.crm-email-detail-value{color:var(--crm-text);font-size:13px;word-break:break-word;}
.crm-email-body{padding:14px;border:1px solid var(--crm-border);border-radius:10px;background:var(--crm-surface-2);color:var(--crm-text);font-size:13px;line-height:1.65;white-space:pre-wrap;word-break:break-word;}
.crm-email-loading{min-height:260px;display:flex;align-items:center;justify-content:center;color:var(--crm-muted);gap:9px;font-size:13px;}
.crm-email-spinner{animation:crmEmailSpin .8s linear infinite;}
@keyframes crmEmailSpin{to{transform:rotate(360deg)}}
@media(max-width:900px){.crm-email-stats{grid-template-columns:repeat(2,minmax(0,1fr));}.crm-email-header{flex-direction:column;}.crm-email-header-actions{width:100%;}.crm-email-header-actions .crm-email-btn{flex:1;}}
@media(max-width:600px){.crm-email-page{padding:15px;}.crm-email-stats{grid-template-columns:1fr;}.crm-email-toolbar{align-items:stretch;flex-direction:column;}.crm-email-search{width:100%;}.crm-email-pagination{flex-direction:column;align-items:flex-start;}.crm-email-modal-footer{flex-direction:column-reverse;}.crm-email-modal-footer .crm-email-btn{width:100%;}}
      `}</style>

      <div className="crm-email-header">
        <div className="crm-email-heading">
          <div>
            <h1>Email</h1>
            <p>Send emails and manage your business communication history.</p>
            {senderEmail && (
              <div className="crm-email-sender-badge">
                Sending as <strong>{senderEmail}</strong> via Brevo
              </div>
            )}
          </div>
        </div>

        <div className="crm-email-header-actions">
          <button type="button" className="crm-email-btn" onClick={handleRefresh} disabled={loading || refreshing} title="Refresh">
            <RefreshCw size={16} className={loading || refreshing ? "crm-email-spinner" : ""} />
            Refresh
          </button>

          <button type="button" className="crm-email-btn crm-email-btn-primary" onClick={handleOpenCompose} disabled={businessLoading || !businessId}>
            <Plus size={17} />
            Compose Email
          </button>
        </div>
      </div>

      {businessError && !businessId && <div className="crm-email-error">{businessError}</div>}

      <div className="crm-email-stats">
        <div className="crm-email-stat">
          <div className="crm-email-stat-icon">
            <Inbox size={18} />
          </div>

          <div>
            <div className="crm-email-stat-value">{stats.total}</div>
            <div className="crm-email-stat-label">Total emails</div>
          </div>
        </div>

        <div className="crm-email-stat">
          <div className="crm-email-stat-icon">
            <CheckCircle2 size={18} />
          </div>

          <div>
            <div className="crm-email-stat-value">{stats.sent}</div>
            <div className="crm-email-stat-label">Sent / Delivered</div>
          </div>
        </div>

        <div className="crm-email-stat">
          <div className="crm-email-stat-icon">
            <Inbox size={18} />
          </div>

          <div>
            <div className="crm-email-stat-value">{stats.received}</div>
            <div className="crm-email-stat-label">Received</div>
          </div>
        </div>

        <div className="crm-email-stat">
          <div className="crm-email-stat-icon">
            <AlertCircle size={18} />
          </div>

          <div>
            <div className="crm-email-stat-value">{stats.failed}</div>
            <div className="crm-email-stat-label">Failed</div>
          </div>
        </div>
      </div>

      <div className="crm-email-panel">
        <div className="crm-email-toolbar">
          <div className="crm-email-search">
            <Search size={16} />

            <input type="text" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search recipient, subject or message..." />

            {search && (
              <button type="button" className="crm-email-search-clear" onClick={() => setSearch("")} aria-label="Clear search">
                <X size={14} />
              </button>
            )}
          </div>

          <div
            style={{
              fontSize: "12px",
              color: "var(--crm-muted)",
              whiteSpace: "nowrap",
            }}>
            {filteredEmails.length} shown
          </div>
        </div>

        {error && <div className="crm-email-error">{error}</div>}

        {businessLoading || loading ? (
          <div className="crm-email-loading">
            <RefreshCw size={17} className="crm-email-spinner" />
            Loading email history...
          </div>
        ) : filteredEmails.length === 0 ? (
          <div className="crm-email-empty">
            <div className="crm-email-empty-icon">
              <Mail size={24} />
            </div>

            <h3>{search ? "No matching emails" : "No email communication yet"}</h3>

            <p>{search ? "Try another recipient, subject or message." : "Send your first business email to start the communication history."}</p>

            {!search && (
              <button type="button" className="crm-email-btn crm-email-btn-primary" style={{ marginTop: "15px" }} onClick={handleOpenCompose} disabled={!businessId}>
                <Plus size={16} />
                Compose Email
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="crm-email-table-wrap">
              <table className="crm-email-table">
                <thead>
                  <tr>
                    <th>Recipient</th>
                    <th>Subject</th>
                    <th>Status</th>
                    <th>Provider</th>
                    <th>Date</th>
                    <th style={{ width: "60px" }}>View</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredEmails.map((email) => (
                    <tr key={email?._id || email?.id || `${email?.to}-${email?.createdAt}`} onClick={() => setViewEmail(email)}>
                      <td>
                        <div className="crm-email-recipient">
                          <div className="crm-email-avatar">{getInitials(email?.to || email?.from)}</div>

                          <div className="crm-email-recipient-main">
                            <div className="crm-email-recipient-address">{email?.direction === "INBOUND" ? email?.from || "Unknown sender" : email?.to || "Unknown recipient"}</div>

                            <div className="crm-email-direction">{email?.direction === "INBOUND" ? "Incoming" : "Outgoing"}</div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="crm-email-subject">{email?.subject || "(No subject)"}</div>

                        <div className="crm-email-preview">{email?.body || ""}</div>
                      </td>

                      <td>
                        <span className={`crm-email-status ${getStatusClass(email?.status)}`}>
                          {getStatusIcon(email?.status)}

                          {email?.status || "UNKNOWN"}
                        </span>
                      </td>

                      <td>
                        <span
                          style={{
                            fontSize: "12px",
                            color: "var(--crm-muted)",
                          }}>
                          {email?.provider || "—"}
                        </span>
                      </td>

                      <td>
                        <div className="crm-email-date">{formatDateTime(email?.createdAt)}</div>
                      </td>

                      <td>
                        <button
                          type="button"
                          className="crm-email-view-btn"
                          onClick={(event) => {
                            event.stopPropagation();
                            setViewEmail(email);
                          }}
                          title="View email">
                          <Eye size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="crm-email-pagination">
              <div className="crm-email-pagination-info">
                Page {page}
                {pagination.totalPages ? ` of ${pagination.totalPages}` : ""}
                {" • "}
                {pagination.total} total emails
              </div>

              <div className="crm-email-pagination-actions">
                <button type="button" className="crm-email-page-btn" onClick={handlePreviousPage} disabled={page <= 1 || loading} title="Previous page">
                  <ChevronLeft size={16} />
                </button>

                <div className="crm-email-page-number">{page}</div>

                <button type="button" className="crm-email-page-btn" onClick={handleNextPage} disabled={loading || !pagination.totalPages || page >= pagination.totalPages} title="Next page">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {composeOpen && (
        <div
          className="crm-email-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !sending) {
              closeCompose();
            }
          }}>
          <div className="crm-email-modal">
            <div className="crm-email-modal-header">
              <div className="crm-email-modal-title">
                <Mail size={18} />
                Compose Email
              </div>

              <button type="button" className="crm-email-modal-close" onClick={closeCompose} disabled={sending} title="Close">
                <X size={18} />
              </button>
            </div>

            <form className="crm-email-form" onSubmit={handleSendEmail}>
              <div className="crm-email-field">
                <label htmlFor="email-to">To</label>

                <input id="email-to" name="to" type="text" value={form.to} onChange={handleFormChange} placeholder="customer@example.com" autoComplete="email" disabled={sending} />

                <div className="crm-email-help">For multiple recipients, separate email addresses with commas.</div>
              </div>

              <div className="crm-email-field">
                <label htmlFor="email-subject">Subject</label>

                <input id="email-subject" name="subject" type="text" value={form.subject} onChange={handleFormChange} placeholder="Enter email subject" maxLength={300} disabled={sending} />
              </div>

              <div className="crm-email-field">
                <label htmlFor="email-body">Message</label>

                <textarea id="email-body" name="body" value={form.body} onChange={handleFormChange} placeholder="Write your message..." maxLength={20000} disabled={sending} />
              </div>

              <div className="crm-email-help">The configured BR30 CRM email service will be used to deliver this message. Activate the Brevo Email integration before sending.</div>
            </form>

            <div className="crm-email-modal-footer">
              <button type="button" className="crm-email-btn" onClick={closeCompose} disabled={sending}>
                Cancel
              </button>

              <button type="button" className="crm-email-btn crm-email-btn-primary" onClick={handleSendEmail} disabled={sending || !businessId || !emailIntegrationActive}>
                {sending ? (
                  <>
                    <RefreshCw size={16} className="crm-email-spinner" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Send Email
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {viewEmail && (
        <div
          className="crm-email-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setViewEmail(null);
            }
          }}>
          <div className="crm-email-modal crm-email-view-modal">
            <div className="crm-email-modal-header">
              <div className="crm-email-modal-title">
                <Mail size={18} />
                Email Details
              </div>

              <button type="button" className="crm-email-modal-close" onClick={() => setViewEmail(null)} title="Close">
                <X size={18} />
              </button>
            </div>

            <div className="crm-email-detail">
              <div className="crm-email-detail-row">
                <div className="crm-email-detail-label">Direction</div>

                <div className="crm-email-detail-value">{viewEmail?.direction === "INBOUND" ? "Incoming" : "Outgoing"}</div>
              </div>

              <div className="crm-email-detail-row">
                <div className="crm-email-detail-label">To</div>

                <div className="crm-email-detail-value">{viewEmail?.to || "—"}</div>
              </div>

              {viewEmail?.from && (
                <div className="crm-email-detail-row">
                  <div className="crm-email-detail-label">From</div>

                  <div className="crm-email-detail-value">{viewEmail.from}</div>
                </div>
              )}

              <div className="crm-email-detail-row">
                <div className="crm-email-detail-label">Subject</div>

                <div className="crm-email-detail-value">{viewEmail?.subject || "(No subject)"}</div>
              </div>

              <div className="crm-email-detail-row">
                <div className="crm-email-detail-label">Status</div>

                <span className={`crm-email-status ${getStatusClass(viewEmail?.status)}`}>
                  {getStatusIcon(viewEmail?.status)}

                  {viewEmail?.status || "UNKNOWN"}
                </span>
              </div>

              <div className="crm-email-detail-row">
                <div className="crm-email-detail-label">Date</div>

                <div className="crm-email-detail-value">{formatDateTime(viewEmail?.createdAt)}</div>
              </div>

              {viewEmail?.provider && (
                <div className="crm-email-detail-row">
                  <div className="crm-email-detail-label">Provider</div>

                  <div className="crm-email-detail-value">{viewEmail.provider}</div>
                </div>
              )}

              {viewEmail?.providerMessageId && (
                <div className="crm-email-detail-row">
                  <div className="crm-email-detail-label">Provider Message ID</div>

                  <div className="crm-email-detail-value">{viewEmail.providerMessageId}</div>
                </div>
              )}

              {viewEmail?.errorMessage && (
                <div className="crm-email-detail-row">
                  <div className="crm-email-detail-label">Error</div>

                  <div
                    className="crm-email-detail-value"
                    style={{
                      color: "var(--crm-danger)",
                    }}>
                    {viewEmail.errorMessage}
                  </div>
                </div>
              )}

              <div className="crm-email-detail-row">
                <div className="crm-email-detail-label">Message</div>

                <div className="crm-email-body">{viewEmail?.body || ""}</div>
              </div>
            </div>

            <div className="crm-email-modal-footer">
              <button type="button" className="crm-email-btn" onClick={() => setViewEmail(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Email;
