import { useCallback, useEffect, useState } from "react";
import { Check, Copy, Database, Download, Edit3, Eye, ExternalLink, KeyRound, Link2, MailPlus, Plus, RefreshCw, Search, Shield, Trash2, Upload, Users, X } from "lucide-react";
import useBusiness from "../../hooks/useBusiness";
import { getApiKeys, createApiKey, updateApiKey, deleteApiKey } from "../../api/api-key.api";
import { getInvitations, createInvitation, resendInvitation, cancelInvitation } from "../../api/invitation.api";
import { scanDuplicates, getDuplicates, resolveDuplicate } from "../../api/duplicate.api";
import { createImportJob, createExportJob, getImportExportJobs, downloadExportJob } from "../../api/import-export.api";
import { getSessions, revokeSession, revokeAllSessions } from "../../api/session.api";
import { getSocialLeadConfig, rotateSocialLeadSecret } from "../../api/social-lead.api";
import { getRoles } from "../../api/role.api";
import { getLeads } from "../../api/lead.api";
import { getLeadAttributions, getLeadAttributionSummary } from "../../api/leadAttribution.api";
import { createLeadSource, deleteLeadSource, getLeadSources, toggleLeadSource, updateLeadSource } from "../../api/lead-source.api";
import { showAuthAlert } from "../../components/auth/authAlert";

const TABS = [
  ["api-keys", "API Keys", KeyRound],
  ["duplicates", "Duplicates", Database],
  ["import-export", "Import / Export", Upload],
  ["invitations", "Invitations", MailPlus],
  ["lead-sources", "Lead Sources", Link2],
  ["attribution", "Lead Attribution", Link2],
  ["sessions", "Sessions", Shield],
  ["social-leads", "Social Leads", Users],
];

const ENTITY_TYPES = ["LEAD", "CONTACT", "COMPANY", "DEAL"];
const DUPLICATE_TYPES = ["CONTACT", "COMPANY", "LEAD"];
const SOURCE_TYPES = ["SOURCE", "CAMPAIGN"];

const emptySource = { name: "", type: "SOURCE", code: "", medium: "", description: "", active: true };
const errorText = (error) => error?.response?.data?.message || error?.response?.data?.error?.message || error?.message || "Something went wrong.";
const unwrap = (response) => response?.data || response || {};
const itemsOf = (response, key) => {
  const value = unwrap(response);
  return Array.isArray(value) ? value : Array.isArray(value?.[key]) ? value[key] : Array.isArray(value?.items) ? value.items : [];
};
const dateText = (value) => (value ? new Date(value).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—");

export default function CRMTools() {
  const { businessId } = useBusiness();
  const [tab, setTab] = useState("api-keys");
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const [apiKeys, setApiKeys] = useState([]);
  const [apiKeyPagination, setApiKeyPagination] = useState({ page: 1, total: 0, totalPages: 1 });
  const [apiKeyModal, setApiKeyModal] = useState(false);
  const [apiKeyForm, setApiKeyForm] = useState({ name: "", expiresAt: "" });
  const [newKey, setNewKey] = useState("");
  const [newKeyId, setNewKeyId] = useState("");
  const [visibleKeyId, setVisibleKeyId] = useState("");

  const [duplicates, setDuplicates] = useState([]);
  const [duplicatePagination, setDuplicatePagination] = useState({ page: 1, total: 0, totalPages: 1 });
  const [duplicateType, setDuplicateType] = useState("CONTACT");
  const [duplicateStatus, setDuplicateStatus] = useState("OPEN");

  const [jobs, setJobs] = useState([]);
  const [jobPagination, setJobPagination] = useState({ page: 1, total: 0, totalPages: 1 });
  const [importType, setImportType] = useState("LEAD");
  const [importFile, setImportFile] = useState(null);
  const [exportType, setExportType] = useState("LEAD");

  const [invitations, setInvitations] = useState([]);
  const [invitationPagination, setInvitationPagination] = useState({ page: 1, total: 0, totalPages: 1 });
  const [roles, setRoles] = useState([]);
  const [invitationForm, setInvitationForm] = useState({ email: "", roleId: "" });

  const [sources, setSources] = useState([]);
  const [sourceSearch, setSourceSearch] = useState("");
  const [sourceType, setSourceType] = useState("");
  const [sourceModal, setSourceModal] = useState(false);
  const [editingSource, setEditingSource] = useState(null);
  const [sourceForm, setSourceForm] = useState({ ...emptySource });

  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState("");
  const [attributions, setAttributions] = useState([]);
  const [attributionSummary, setAttributionSummary] = useState(null);

  const [sessions, setSessions] = useState([]);
  const [socialConfig, setSocialConfig] = useState(null);
  const [rotatedSecret, setRotatedSecret] = useState("");

  const loadApiKeys = useCallback(
    async (page = 1) => {
      if (!businessId) return;
      const r = await getApiKeys(businessId, { page, limit: 10 });
      const d = unwrap(r);
      setApiKeys(d.apiKeys || []);
      setApiKeyPagination(d.pagination || {});
    },
    [businessId]
  );

  const loadDuplicates = useCallback(
    async (page = 1) => {
      if (!businessId) return;
      const r = await getDuplicates(businessId, { page, limit: 10, entityType: duplicateType, status: duplicateStatus });
      const d = unwrap(r);
      setDuplicates(d.items || []);
      setDuplicatePagination(d.pagination || {});
    },
    [businessId, duplicateType, duplicateStatus]
  );

  const loadJobs = useCallback(
    async (page = 1) => {
      if (!businessId) return;
      const r = await getImportExportJobs(businessId, { page, limit: 10 });
      const d = unwrap(r);
      setJobs(d.items || []);
      setJobPagination(d.pagination || {});
    },
    [businessId]
  );

  const loadInvitations = useCallback(
    async (page = 1) => {
      if (!businessId) return;
      const r = await getInvitations(businessId, { page, limit: 10 });
      const d = unwrap(r);
      setInvitations(d.invitations || []);
      setInvitationPagination(d.pagination || {});
    },
    [businessId]
  );

  const loadSources = useCallback(async () => {
    if (!businessId) return;
    const r = await getLeadSources(businessId, { search: sourceSearch || undefined, type: sourceType || undefined });
    setSources(itemsOf(r, "sources"));
  }, [businessId, sourceSearch, sourceType]);

  const loadLeads = useCallback(async () => {
    if (!businessId) return;
    const r = await getLeads(businessId, { page: 1, limit: 100 });
    const d = unwrap(r);
    setLeads(d.leads || d.items || []);
  }, [businessId]);

  const loadSessions = useCallback(async () => {
    const r = await getSessions();
    setSessions(itemsOf(r, "sessions"));
  }, []);

  const loadSocialConfig = useCallback(async () => {
    if (!businessId) return;
    setSocialConfig(unwrap(await getSocialLeadConfig(businessId)));
  }, [businessId]);

  useEffect(() => {
    if (businessId && tab === "api-keys") loadApiKeys();
  }, [businessId, tab, loadApiKeys]);
  useEffect(() => {
    if (businessId && tab === "duplicates") loadDuplicates();
  }, [businessId, tab, loadDuplicates]);
  useEffect(() => {
    if (businessId && tab === "import-export") loadJobs();
  }, [businessId, tab, loadJobs]);
  useEffect(() => {
    if (businessId && tab === "invitations") {
      loadInvitations();
      getRoles(businessId, { limit: 100 })
        .then((r) => setRoles(itemsOf(r, "roles")))
        .catch(() => setRoles([]));
    }
  }, [businessId, tab, loadInvitations]);
  useEffect(() => {
    if (businessId && tab === "lead-sources") loadSources();
  }, [businessId, tab, loadSources]);
  useEffect(() => {
    if (businessId && tab === "attribution") loadLeads();
  }, [businessId, tab, loadLeads]);
  useEffect(() => {
    if (tab === "sessions") loadSessions();
  }, [tab, loadSessions]);
  useEffect(() => {
    if (businessId && tab === "social-leads") loadSocialConfig();
  }, [businessId, tab, loadSocialConfig]);

  useEffect(() => {
    if (!selectedLead || !businessId) {
      setAttributions([]);
      setAttributionSummary(null);
      return;
    }
    Promise.all([getLeadAttributions(businessId, selectedLead), getLeadAttributionSummary(businessId, selectedLead)])
      .then(([a, s]) => {
        const attributionData = unwrap(a);
        const records = Array.isArray(attributionData) ? attributionData : attributionData?.records || attributionData?.attributions || [];
        setAttributions(records);
        setAttributionSummary(unwrap(s));
        setError("");
      })
      .catch((e) => setError(errorText(e)));
  }, [businessId, selectedLead]);

  const run = async (action, success = "Updated successfully.") => {
    setError("");
    try {
      await action();
      await showAuthAlert({ icon: "success", title: "Done", text: success, confirmButtonText: "Done" });
      return true;
    } catch (e) {
      const message = errorText(e);
      setError(message);
      await showAuthAlert({ icon: "error", title: "Action failed", text: message, confirmButtonText: "OK" });
      return false;
    }
  };

  const handleHeaderRefresh = async () => {
    setError("");
    setRefreshing(true);

    try {
      if (tab === "api-keys") {
        await loadApiKeys(apiKeyPagination.page || 1);
      } else if (tab === "duplicates") {
        await loadDuplicates(duplicatePagination.page || 1);
      } else if (tab === "import-export") {
        await loadJobs(jobPagination.page || 1);
      } else if (tab === "invitations") {
        await loadInvitations(invitationPagination.page || 1);
      } else if (tab === "lead-sources") {
        await loadSources();
      } else if (tab === "attribution") {
        await loadLeads();

        if (selectedLead) {
          const [a, s] = await Promise.all([getLeadAttributions(businessId, selectedLead), getLeadAttributionSummary(businessId, selectedLead)]);

          const attributionData = unwrap(a);
          const records = Array.isArray(attributionData) ? attributionData : attributionData?.records || attributionData?.attributions || [];

          setAttributions(records);
          setAttributionSummary(unwrap(s));
        }
      } else if (tab === "sessions") {
        await loadSessions();
      } else if (tab === "social-leads") {
        await loadSocialConfig();
      }
    } catch (e) {
      setError(errorText(e));
    } finally {
      setRefreshing(false);
    }
  };

  const handleApiKeysRefresh = async () => {
    setError("");
    setRefreshing(true);

    try {
      await loadApiKeys(apiKeyPagination.page || 1);
    } catch (e) {
      setError(errorText(e));
    } finally {
      setRefreshing(false);
    }
  };

  const confirmAction = async ({ title, text, confirmButtonText = "Yes, continue" }) => {
    return showAuthAlert({ icon: "warning", title, text, showCancelButton: true, confirmButtonText, cancelButtonText: "Cancel" });
  };

  const createKey = async () => {
    if (!apiKeyForm.name.trim()) return setError("API key name is required.");
    setError("");
    try {
      const r = unwrap(await createApiKey(businessId, { name: apiKeyForm.name.trim(), expiresAt: apiKeyForm.expiresAt || null }));
      setNewKey(r.apiKey || "");
      setNewKeyId(r.apiKeyData?._id || "");
      setVisibleKeyId(r.apiKeyData?._id || "");
      setApiKeyModal(false);
      setApiKeyForm({ name: "", expiresAt: "" });
      await loadApiKeys(1);
      await showAuthAlert({ icon: "success", title: "API key created", text: "Copy the key now. The full key is not recoverable later.", confirmButtonText: "Done" });
    } catch (e) {
      setError(errorText(e));
      await showAuthAlert({ icon: "error", title: "Unable to create key", text: errorText(e), confirmButtonText: "OK" });
    }
  };

  const removeKey = async (id) => {
    const result = await confirmAction({ title: "Delete API key?", text: "This API credential will be permanently deleted.", confirmButtonText: "Yes, delete" });
    if (!result?.isConfirmed) return;
    await run(async () => {
      await deleteApiKey(businessId, id);
      await loadApiKeys(apiKeyPagination.page);
    }, "API key deleted successfully.");
  };

  const revokeKey = async (id) => {
    const result = await confirmAction({ title: "Revoke API key?", text: "This key will stop working immediately.", confirmButtonText: "Yes, revoke" });
    if (!result?.isConfirmed) return;
    await run(async () => {
      await updateApiKey(businessId, id, { status: "REVOKED" });
      await loadApiKeys(apiKeyPagination.page);
    }, "API key revoked successfully.");
  };

  const copyText = async (value, success = "Copied to clipboard.") => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      await showAuthAlert({ icon: "success", title: "Copied", text: success, confirmButtonText: "Done" });
    } catch {
      setError("Unable to copy to clipboard.");
    }
  };

  const showKey = async (item) => {
    setVisibleKeyId((current) => (current === item._id ? "" : item._id));
    if (item._id !== newKeyId) {
      await showAuthAlert({ icon: "info", title: "API key protected", text: "The full key is only available when it is created. This record can only show its prefix.", confirmButtonText: "OK" });
    }
  };

  const scan = () =>
    run(async () => {
      await scanDuplicates(businessId, duplicateType);
      await loadDuplicates(1);
    }, "Duplicate scan completed.");
  const resolve = async (id, action) => {
    const result = await confirmAction({
      title: action === "merge" ? "Merge duplicate records?" : "Ignore duplicate?",
      text: action === "merge" ? "The duplicate record will be merged into the primary record." : "This duplicate will be marked as ignored.",
      confirmButtonText: action === "merge" ? "Yes, merge" : "Yes, ignore",
    });
    if (!result?.isConfirmed) return;
    await run(
      async () => {
        await resolveDuplicate(businessId, id, action);
        await loadDuplicates(duplicatePagination.page);
      },
      action === "merge" ? "Records merged successfully." : "Duplicate ignored successfully."
    );
  };

  const importCsv = async () => {
    if (!importFile) {
      setError("Select a CSV file first.");
      return;
    }
    setError("");
    try {
      const csv = await importFile.text();
      await createImportJob(businessId, { entityType: importType, csv, fileName: importFile.name });
      setImportFile(null);
      await loadJobs(1);
      await showAuthAlert({ icon: "success", title: "Import queued", text: "Your import job has been queued for processing.", confirmButtonText: "Done" });
    } catch (e) {
      const message = errorText(e);
      setError(message);
      await showAuthAlert({ icon: "error", title: "Import failed", text: message, confirmButtonText: "OK" });
    }
  };

  const exportData = async () => {
    await run(async () => {
      await createExportJob(businessId, { entityType: exportType, filter: {} });
      await loadJobs(1);
    }, "Export generated successfully.");
  };

  const downloadJob = async (job) => {
    setError("");
    try {
      const response = await downloadExportJob(businessId, job._id);
      const url = URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${String(job.entityType || "export").toLowerCase()}-export.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      const message = errorText(e);
      setError(message);
      await showAuthAlert({ icon: "error", title: "Download failed", text: message, confirmButtonText: "OK" });
    }
  };

  const sendInvitation = async () => {
    if (!invitationForm.email.trim() || !invitationForm.roleId) {
      setError("Email and role are required.");
      return;
    }
    await run(async () => {
      await createInvitation(businessId, invitationForm);
      setInvitationForm({ email: "", roleId: "" });
      await loadInvitations(1);
    }, "Invitation sent successfully.");
  };

  const resend = async (id) => {
    const result = await confirmAction({ title: "Resend invitation?", text: "A new invitation email will be sent to this address.", confirmButtonText: "Yes, resend" });
    if (!result?.isConfirmed) return;
    await run(async () => {
      await resendInvitation(businessId, id);
      await loadInvitations(invitationPagination.page);
    }, "Invitation resent successfully.");
  };

  const cancel = async (id) => {
    const result = await confirmAction({ title: "Cancel invitation?", text: "This pending invitation will no longer be valid.", confirmButtonText: "Yes, cancel" });
    if (!result?.isConfirmed) return;
    await run(async () => {
      await cancelInvitation(businessId, id);
      await loadInvitations(invitationPagination.page);
    }, "Invitation cancelled successfully.");
  };

  const saveSource = async () => {
    if (!sourceForm.name.trim()) {
      setError("Source or campaign name is required.");
      return;
    }
    await run(
      async () => {
        const payload = { name: sourceForm.name.trim(), type: sourceForm.type, code: sourceForm.code.trim(), medium: sourceForm.medium.trim(), description: sourceForm.description.trim(), active: Boolean(sourceForm.active) };
        if (editingSource) await updateLeadSource(businessId, editingSource._id, payload);
        else await createLeadSource(businessId, payload);
        setSourceModal(false);
        setEditingSource(null);
        setSourceForm({ ...emptySource });
        await loadSources();
      },
      editingSource ? "Lead source updated successfully." : "Lead source created successfully."
    );
  };

  const removeSource = async (item) => {
    const result = await confirmAction({ title: "Delete source/campaign?", text: `"${item.name}" will be permanently deleted.`, confirmButtonText: "Yes, delete" });
    if (!result?.isConfirmed) return;
    await run(async () => {
      await deleteLeadSource(businessId, item._id);
      await loadSources();
    }, "Source or campaign deleted successfully.");
  };

  const toggleSource = async (item) => {
    await run(
      async () => {
        await toggleLeadSource(businessId, item._id);
        await loadSources();
      },
      item.active ? "Source deactivated successfully." : "Source activated successfully."
    );
  };

  const rotateSecret = async () => {
    const result = await confirmAction({ title: "Rotate webhook secret?", text: "The previous secret will stop working immediately.", confirmButtonText: "Yes, rotate" });
    if (!result?.isConfirmed) return;
    await run(async () => {
      const r = unwrap(await rotateSocialLeadSecret(businessId));
      setRotatedSecret(r.secret || "");
      await loadSocialConfig();
    }, "Social webhook secret rotated successfully.");
  };

  const revokeOneSession = async (sessionId) => {
    const result = await confirmAction({ title: "Revoke this session?", text: "This device will be signed out.", confirmButtonText: "Yes, revoke" });
    if (!result?.isConfirmed) return;
    await run(async () => {
      await revokeSession(sessionId);
      await loadSessions();
    }, "Session revoked successfully.");
  };

  const revokeAll = async () => {
    const result = await confirmAction({ title: "Revoke all other sessions?", text: "All other active devices will be signed out. Your current session will remain active.", confirmButtonText: "Yes, revoke all" });
    if (!result?.isConfirmed) return;
    await run(async () => {
      await revokeAllSessions();
      await loadSessions();
    }, "All other sessions revoked successfully.");
  };

  const sourceRows = sources.filter((item) => item);

  return (
    <div className="crm-tools-page">
      <style>{`.crm-tools-page{padding:24px 26px 40px;max-width:1550px;margin:auto;color:var(--crm-text)}.crm-tools-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:18px}.crm-tools-title{margin:0;font-size:25px;font-weight:400;letter-spacing:-.35px}.crm-tools-sub{margin:6px 0 0;color:var(--crm-muted);font-size:13px}.crm-tools-tabs{display:flex;gap:5px;overflow:auto;padding:4px;margin-bottom:14px;border:1px solid var(--crm-border);border-radius:12px;background:var(--crm-surface)}.crm-tools-tab{height:36px;padding:0 12px;border:0;border-radius:8px;background:transparent;color:var(--crm-muted);display:inline-flex;align-items:center;gap:7px;white-space:nowrap;font-size:13px}.crm-tools-tab.active{background:var(--crm-primary-soft);color:var(--crm-primary)}.crm-tools-card{background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:14px;box-shadow:var(--crm-shadow);overflow:hidden}.crm-tools-toolbar{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:15px;border-bottom:1px solid var(--crm-border);flex-wrap:wrap}.crm-tools-actions{display:flex;align-items:center;gap:7px;flex-wrap:wrap}.crm-tools-btn{height:36px;padding:0 11px;border:1px solid var(--crm-border);border-radius:8px;background:var(--crm-surface);color:var(--crm-text);display:inline-flex;align-items:center;justify-content:center;gap:7px;font-size:13px}.crm-tools-btn.primary{background:var(--crm-primary);border-color:var(--crm-primary);color:#fff}.crm-tools-btn.danger{color:var(--crm-danger)}.crm-tools-input,.crm-tools-select{height:36px;border:1px solid var(--crm-border);border-radius:8px;background:var(--crm-surface);color:var(--crm-text);padding:0 10px;outline:none;font-size:13px}.crm-tools-input:focus,.crm-tools-select:focus{border-color:var(--crm-primary)}.crm-tools-error{margin-bottom:12px;padding:10px 12px;border-radius:9px;background:color-mix(in srgb,var(--crm-danger) 8%,transparent);color:var(--crm-danger);font-size:13px}.crm-tools-table-wrap{overflow:auto}.crm-tools-table{width:100%;border-collapse:collapse;min-width:850px}.crm-tools-table th,.crm-tools-table td{padding:12px 14px;border-bottom:1px solid var(--crm-border);text-align:left;font-size:13px;vertical-align:middle}.crm-tools-table th{background:var(--crm-surface-2);color:var(--crm-muted);font-weight:400;white-space:nowrap}.crm-tools-table td{color:var(--crm-text)}.crm-tools-muted{color:var(--crm-muted);font-size:12px}.crm-tools-status{display:inline-flex;padding:4px 8px;border-radius:7px;background:var(--crm-surface-2);color:var(--crm-muted);font-size:12px}.crm-tools-status.active,.crm-tools-status.completed{color:var(--crm-success);background:color-mix(in srgb,var(--crm-success) 10%,transparent)}.crm-tools-status.pending,.crm-tools-status.processing{color:var(--crm-warning);background:color-mix(in srgb,var(--crm-warning) 10%,transparent)}.crm-tools-status.revoked,.crm-tools-status.failed{color:var(--crm-danger);background:color-mix(in srgb,var(--crm-danger) 10%,transparent)}.crm-tools-row-actions{display:flex;gap:5px;align-items:center}.crm-tools-icon{width:30px;height:30px;border:1px solid var(--crm-border);border-radius:8px;background:var(--crm-surface);color:var(--crm-muted);display:grid;place-items:center}.crm-tools-icon:hover{color:var(--crm-primary);border-color:var(--crm-primary)}.crm-tools-empty{padding:45px;text-align:center;color:var(--crm-muted);font-size:13px}.crm-tools-form{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;padding:16px}.crm-tools-field{display:grid;gap:6px}.crm-tools-field.full{grid-column:1/-1}.crm-tools-field label{font-size:13px}.crm-tools-file{height:36px;display:flex;align-items:center;gap:8px;border:1px dashed var(--crm-border);border-radius:8px;padding:0 10px;color:var(--crm-muted);font-size:13px;overflow:hidden}.crm-tools-file input{display:none}.crm-tools-help{padding:14px 16px;color:var(--crm-muted);font-size:13px;line-height:1.6}.crm-tools-secret{margin:0 16px 16px;padding:13px;border:1px dashed var(--crm-primary);border-radius:10px;background:var(--crm-primary-soft);color:var(--crm-text);word-break:break-all;font-size:13px}.crm-tools-modal-backdrop{position:fixed;inset:0;background:rgba(15,23,42,.48);display:grid;place-items:center;padding:20px;z-index:800}.crm-tools-modal{width:min(520px,100%);background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:14px;box-shadow:var(--crm-shadow);padding:18px}.crm-tools-modal-head{display:flex;align-items:center;justify-content:space-between}.crm-tools-modal-head h2{margin:0;font-size:17px;font-weight:400}.crm-tools-close{width:31px;height:31px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-muted);border-radius:8px;display:grid;place-items:center}.crm-tools-modal-foot{display:flex;justify-content:flex-end;gap:7px;margin-top:16px}.crm-tools-summary{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;padding:15px}.crm-tools-stat{padding:13px;border:1px solid var(--crm-border);border-radius:10px;background:var(--crm-surface-2)}.crm-tools-stat-label{font-size:12px;color:var(--crm-muted)}.crm-tools-stat-value{font-size:22px;margin-top:4px}.crm-tools-code{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px}.crm-tools-webhook{display:grid;gap:10px;padding:16px}.crm-tools-webhook-row{display:grid;grid-template-columns:120px 1fr auto;gap:10px;align-items:center}.crm-tools-webhook-label{font-size:12px;color:var(--crm-muted)}.crm-tools-webhook-value{padding:10px;border:1px solid var(--crm-border);border-radius:9px;background:var(--crm-surface-2);word-break:break-all;font-size:12px}.crm-tools-pager{display:flex;align-items:center;justify-content:flex-end;gap:7px;padding:12px 14px}.crm-tools-page-btn{width:32px;height:32px;border:1px solid var(--crm-border);border-radius:8px;background:var(--crm-surface);color:var(--crm-text)}.crm-tools-page-btn:disabled{opacity:.45}.crm-tools-attribution{padding:16px}.crm-tools-attribution-list{display:grid;gap:9px;margin-top:12px}.crm-tools-attribution-item{padding:12px;border:1px solid var(--crm-border);border-radius:10px;background:var(--crm-surface-2)}.crm-tools-attribution-top{display:flex;justify-content:space-between;gap:10px}.crm-tools-attribution-meta{display:flex;flex-wrap:wrap;gap:8px;margin-top:6px;color:var(--crm-muted);font-size:12px}.crm-tools-source-controls{display:flex;align-items:center;gap:7px;flex-wrap:wrap}.crm-tools-source-code{display:inline-flex;align-items:center;gap:5px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px}.crm-tools-link{color:var(--crm-primary);text-decoration:none;font-size:13px;display:inline-flex;align-items:center;gap:5px}.crm-tools-refreshing{animation:crm-tools-spin .8s linear infinite}.crm-tools-btn:disabled{cursor:not-allowed;opacity:.7}@keyframes crm-tools-spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}@media(max-width:900px){.crm-tools-page{padding:18px}.crm-tools-summary{grid-template-columns:repeat(2,minmax(0,1fr))}.crm-tools-form{grid-template-columns:1fr}.crm-tools-field.full{grid-column:auto}.crm-tools-webhook-row{grid-template-columns:1fr}.crm-tools-webhook-row .crm-tools-icon{justify-self:start}}@media(max-width:560px){.crm-tools-summary{grid-template-columns:1fr}.crm-tools-head{flex-direction:column}}`}</style>
      <div className="crm-tools-head">
        <div>
          <h1 className="crm-tools-title">CRM Tools</h1>
          <p className="crm-tools-sub">Manage security, data operations, attribution and workspace utilities.</p>
        </div>
        <button type="button" className="crm-tools-btn" onClick={handleHeaderRefresh} disabled={refreshing}>
          <RefreshCw size={14} className={refreshing ? "crm-tools-refreshing" : ""} /> {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>
      {error && <div className="crm-tools-error">{error}</div>}
      <div className="crm-tools-tabs">
        {TABS.map(([id, label, Icon]) => (
          <button
            key={id}
            className={`crm-tools-tab ${tab === id ? "active" : ""}`}
            onClick={() => {
              setTab(id);
              setError("");
            }}>
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {tab === "api-keys" && (
        <div className="crm-tools-card">
          <div className="crm-tools-toolbar">
            <div>
              <strong>API Keys</strong>
              <div className="crm-tools-muted">Create and revoke business API credentials.</div>
            </div>
            <div className="crm-tools-actions">
              <button type="button" className="crm-tools-btn" onClick={handleApiKeysRefresh} disabled={refreshing}>
                <RefreshCw size={14} className={refreshing ? "crm-tools-refreshing" : ""} /> {refreshing ? "Refreshing..." : "Refresh"}
              </button>
              <button className="crm-tools-btn primary" onClick={() => setApiKeyModal(true)}>
                <KeyRound size={14} /> Create key
              </button>
            </div>
          </div>
          {newKey && (
            <div className="crm-tools-secret">
              <strong>New API key:</strong>
              <div className="crm-tools-code" style={{ marginTop: 6 }}>
                {newKey}
              </div>
              <div className="crm-tools-row-actions" style={{ marginTop: 9 }}>
                <button className="crm-tools-btn" onClick={() => copyText(newKey, "API key copied. Store it securely.")}>
                  <Copy size={13} /> Copy key
                </button>
                <button className="crm-tools-btn" onClick={() => setNewKey("")}>
                  <X size={13} /> Hide
                </button>
              </div>
            </div>
          )}
          <div className="crm-tools-table-wrap">
            <table className="crm-tools-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Key</th>
                  <th>Status</th>
                  <th>Expires</th>
                  <th>Created</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {apiKeys.map((item) => (
                  <tr key={item._id}>
                    <td>{item.name}</td>
                    <td className="crm-tools-code">
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                        {visibleKeyId === item._id && item._id === newKeyId ? newKey : `${item.keyPrefix}••••`}
                        {item._id === newKeyId && (
                          <button className="crm-tools-icon" title="Copy key" onClick={() => copyText(newKey)}>
                            <Copy size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={`crm-tools-status ${String(item.status).toLowerCase()}`}>{item.status}</span>
                    </td>
                    <td>{dateText(item.expiresAt)}</td>
                    <td>{dateText(item.createdAt)}</td>
                    <td>
                      <div className="crm-tools-row-actions">
                        <button className="crm-tools-icon" title="View key" onClick={() => showKey(item)}>
                          <Eye size={14} />
                        </button>
                        {item.status !== "REVOKED" && (
                          <button className="crm-tools-icon" title="Revoke" onClick={() => revokeKey(item._id)}>
                            <Shield size={14} />
                          </button>
                        )}
                        <button className="crm-tools-icon" title="Delete" onClick={() => removeKey(item._id)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!apiKeys.length && (
                  <tr>
                    <td colSpan="6" className="crm-tools-empty">
                      No API keys found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <Pager pagination={apiKeyPagination} onChange={loadApiKeys} />
        </div>
      )}

      {tab === "duplicates" && (
        <div className="crm-tools-card">
          <div className="crm-tools-toolbar">
            <div>
              <strong>Duplicate Manager</strong>
              <div className="crm-tools-muted">Find and resolve repeated CRM records.</div>
            </div>
            <div className="crm-tools-actions">
              <select className="crm-tools-select" value={duplicateType} onChange={(e) => setDuplicateType(e.target.value)}>
                {DUPLICATE_TYPES.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
              <select className="crm-tools-select" value={duplicateStatus} onChange={(e) => setDuplicateStatus(e.target.value)}>
                <option>OPEN</option>
                <option>IGNORED</option>
                <option>MERGED</option>
              </select>
              <button className="crm-tools-btn primary" onClick={scan}>
                <Search size={14} /> Scan
              </button>
            </div>
          </div>
          <div className="crm-tools-table-wrap">
            <table className="crm-tools-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Primary</th>
                  <th>Duplicate</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {duplicates.map((item) => (
                  <tr key={item._id}>
                    <td>{item.entityType}</td>
                    <td>{item.primaryName || item.primaryId}</td>
                    <td>{item.duplicateName || item.duplicateId}</td>
                    <td>{item.reason}</td>
                    <td>
                      <span className="crm-tools-status">{item.status}</span>
                    </td>
                    <td>{dateText(item.createdAt)}</td>
                    <td>
                      {item.status === "OPEN" && (
                        <div className="crm-tools-row-actions">
                          <button className="crm-tools-btn" onClick={() => resolve(item._id, "merge")}>
                            Merge
                          </button>
                          <button className="crm-tools-btn danger" onClick={() => resolve(item._id, "ignore")}>
                            Ignore
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {!duplicates.length && (
                  <tr>
                    <td colSpan="7" className="crm-tools-empty">
                      No duplicates found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <Pager pagination={duplicatePagination} onChange={loadDuplicates} />
        </div>
      )}

      {tab === "import-export" && (
        <div className="crm-tools-card">
          <div className="crm-tools-toolbar">
            <div>
              <strong>Import / Export</strong>
              <div className="crm-tools-muted">Move CRM data with CSV files and track processing jobs.</div>
            </div>
            <div className="crm-tools-actions">
              <select className="crm-tools-select" value={exportType} onChange={(e) => setExportType(e.target.value)}>
                {ENTITY_TYPES.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
              <button className="crm-tools-btn primary" onClick={exportData}>
                <Download size={14} /> Export
              </button>
            </div>
          </div>
          <div className="crm-tools-form">
            <div className="crm-tools-field">
              <label>Import entity</label>
              <select className="crm-tools-select" value={importType} onChange={(e) => setImportType(e.target.value)}>
                {ENTITY_TYPES.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </div>
            <div className="crm-tools-field">
              <label>CSV file</label>
              <label className="crm-tools-file">
                <Upload size={14} />
                <span>{importFile?.name || "Choose CSV file"}</span>
                <input type="file" accept=".csv,text/csv" onChange={(e) => setImportFile(e.target.files?.[0] || null)} />
              </label>
            </div>
            <div className="crm-tools-field full">
              <button className="crm-tools-btn primary" onClick={importCsv}>
                <Upload size={14} /> Queue import
              </button>
            </div>
          </div>
          <div className="crm-tools-table-wrap">
            <table className="crm-tools-table">
              <thead>
                <tr>
                  <th>Direction</th>
                  <th>Entity</th>
                  <th>Status</th>
                  <th>Rows</th>
                  <th>Success</th>
                  <th>Failed</th>
                  <th>Created</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job._id}>
                    <td>{job.direction}</td>
                    <td>{job.entityType}</td>
                    <td>
                      <span className={`crm-tools-status ${String(job.status).toLowerCase()}`}>{job.status}</span>
                    </td>
                    <td>{job.totalRows ?? 0}</td>
                    <td>{job.successRows ?? 0}</td>
                    <td>{job.failedRows ?? 0}</td>
                    <td>{dateText(job.createdAt)}</td>
                    <td>
                      {job.direction === "EXPORT" && (
                        <button className="crm-tools-btn" onClick={() => downloadJob(job)}>
                          <Download size={13} /> CSV
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {!jobs.length && (
                  <tr>
                    <td colSpan="8" className="crm-tools-empty">
                      No import/export jobs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <Pager pagination={jobPagination} onChange={loadJobs} />
        </div>
      )}

      {tab === "invitations" && (
        <div className="crm-tools-card">
          <div className="crm-tools-toolbar">
            <div>
              <strong>Business Invitations</strong>
              <div className="crm-tools-muted">Invite people with a specific business role.</div>
            </div>
            <button className="crm-tools-btn" onClick={() => loadInvitations(invitationPagination.page)}>
              <RefreshCw size={14} /> Refresh
            </button>
          </div>
          <div className="crm-tools-form">
            <div className="crm-tools-field">
              <label>Email</label>
              <input className="crm-tools-input" type="email" value={invitationForm.email} onChange={(e) => setInvitationForm({ ...invitationForm, email: e.target.value })} placeholder="user@example.com" />
            </div>
            <div className="crm-tools-field">
              <label>Role</label>
              <select className="crm-tools-select" value={invitationForm.roleId} onChange={(e) => setInvitationForm({ ...invitationForm, roleId: e.target.value })}>
                <option value="">Select role</option>
                {roles
                  .filter((r) => r.isActive !== false)
                  .map((r) => (
                    <option key={r._id} value={r._id}>
                      {r.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="crm-tools-field full">
              <button className="crm-tools-btn primary" onClick={sendInvitation}>
                <MailPlus size={14} /> Send invitation
              </button>
            </div>
          </div>
          <div className="crm-tools-table-wrap">
            <table className="crm-tools-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Expires</th>
                  <th>Invited</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {invitations.map((item) => (
                  <tr key={item._id}>
                    <td>{item.email}</td>
                    <td>{item.roleId?.name || "—"}</td>
                    <td>
                      <span className="crm-tools-status">{item.status}</span>
                    </td>
                    <td>{dateText(item.expiresAt)}</td>
                    <td>{dateText(item.createdAt)}</td>
                    <td>
                      {item.status === "PENDING" && (
                        <div className="crm-tools-row-actions">
                          <button className="crm-tools-btn" onClick={() => resend(item._id)}>
                            Resend
                          </button>
                          <button className="crm-tools-btn danger" onClick={() => cancel(item._id)}>
                            Cancel
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {!invitations.length && (
                  <tr>
                    <td colSpan="6" className="crm-tools-empty">
                      No invitations found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <Pager pagination={invitationPagination} onChange={loadInvitations} />
        </div>
      )}

      {tab === "lead-sources" && (
        <div className="crm-tools-card">
          <div className="crm-tools-toolbar">
            <div>
              <strong>Lead Sources & Campaigns</strong>
              <div className="crm-tools-muted">Manage acquisition sources and campaign tracking.</div>
            </div>
            <div className="crm-tools-source-controls">
              <input className="crm-tools-input" value={sourceSearch} onChange={(e) => setSourceSearch(e.target.value)} placeholder="Search..." />
              <select className="crm-tools-select" value={sourceType} onChange={(e) => setSourceType(e.target.value)}>
                <option value="">All types</option>
                {SOURCE_TYPES.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
              <button
                className="crm-tools-btn primary"
                onClick={() => {
                  setEditingSource(null);
                  setSourceForm({ ...emptySource });
                  setSourceModal(true);
                }}>
                <Plus size={14} /> Add
              </button>
            </div>
          </div>
          <div className="crm-tools-table-wrap">
            <table className="crm-tools-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Code</th>
                  <th>Medium</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {sourceRows.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <strong>{item.name}</strong>
                      <div className="crm-tools-muted">{item.description || "—"}</div>
                    </td>
                    <td>{item.type}</td>
                    <td>
                      <span className="crm-tools-source-code">
                        {item.code || "—"}
                        <button className="crm-tools-icon" title="Copy code" onClick={() => copyText(item.code, "Source code copied.")} disabled={!item.code}>
                          <Copy size={12} />
                        </button>
                      </span>
                    </td>
                    <td>{item.medium || "—"}</td>
                    <td>
                      <span className={`crm-tools-status ${item.active ? "active" : "revoked"}`}>{item.active ? "ACTIVE" : "INACTIVE"}</span>
                    </td>
                    <td>{dateText(item.createdAt)}</td>
                    <td>
                      <div className="crm-tools-row-actions">
                        <button
                          className="crm-tools-icon"
                          title="Edit"
                          onClick={() => {
                            setEditingSource(item);
                            setSourceForm({ name: item.name || "", type: item.type || "SOURCE", code: item.code || "", medium: item.medium || "", description: item.description || "", active: item.active !== false });
                            setSourceModal(true);
                          }}>
                          <Edit3 size={14} />
                        </button>
                        <button className="crm-tools-icon" title={item.active ? "Deactivate" : "Activate"} onClick={() => toggleSource(item)}>
                          {item.active ? <Shield size={14} /> : <Check size={14} />}
                        </button>
                        <button className="crm-tools-icon" title="Delete" onClick={() => removeSource(item)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!sourceRows.length && (
                  <tr>
                    <td colSpan="7" className="crm-tools-empty">
                      No lead sources or campaigns found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div style={{ padding: "12px 14px" }}>
            <a className="crm-tools-link" href="/sources-campaigns">
              <ExternalLink size={13} /> Open Sources / Campaigns
            </a>
          </div>
        </div>
      )}

      {tab === "attribution" && (
        <div className="crm-tools-card">
          <div className="crm-tools-toolbar">
            <div>
              <strong>Lead Attribution</strong>
              <div className="crm-tools-muted">Review first-touch, last-touch, source and campaign attribution.</div>
            </div>
            <select className="crm-tools-select" value={selectedLead} onChange={(e) => setSelectedLead(e.target.value)}>
              <option value="">Select lead</option>
              {leads.map((lead) => (
                <option key={lead._id} value={lead._id}>
                  {lead.name || [lead.firstName, lead.lastName].filter(Boolean).join(" ") || lead.email || lead._id}
                </option>
              ))}
            </select>
          </div>
          {selectedLead && (
            <>
              <div className="crm-tools-summary">
                <div className="crm-tools-stat">
                  <div className="crm-tools-stat-label">First touch</div>
                  <div className="crm-tools-stat-value">{attributionSummary?.firstTouch?.source || "—"}</div>
                </div>
                <div className="crm-tools-stat">
                  <div className="crm-tools-stat-label">Last touch</div>
                  <div className="crm-tools-stat-value">{attributionSummary?.lastTouch?.source || "—"}</div>
                </div>
                <div className="crm-tools-stat">
                  <div className="crm-tools-stat-label">Touches</div>
                  <div className="crm-tools-stat-value">{attributionSummary?.totalTouches ?? attributions.length}</div>
                </div>
                <div className="crm-tools-stat">
                  <div className="crm-tools-stat-label">Campaign</div>
                  <div className="crm-tools-stat-value">{attributionSummary?.lastTouch?.campaign || "—"}</div>
                </div>
              </div>
              <div className="crm-tools-attribution">
                <div className="crm-tools-attribution-list">
                  {attributions.map((item) => (
                    <div className="crm-tools-attribution-item" key={item._id}>
                      <div className="crm-tools-attribution-top">
                        <strong>{item.source || "Direct"}</strong>
                        <span className="crm-tools-status">{item.attributionType || item.touchType}</span>
                      </div>
                      <div className="crm-tools-attribution-meta">
                        <span>{item.medium || "No medium"}</span>
                        <span>{item.campaign || "No campaign"}</span>
                        <span>{dateText(item.capturedAt || item.createdAt)}</span>
                      </div>
                      {item.landingUrl && (
                        <div className="crm-tools-muted" style={{ marginTop: 7 }}>
                          {item.landingUrl}
                        </div>
                      )}
                    </div>
                  ))}
                  {!attributions.length && <div className="crm-tools-empty">No attribution records found for this lead.</div>}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {tab === "sessions" && (
        <div className="crm-tools-card">
          <div className="crm-tools-toolbar">
            <div>
              <strong>Active Sessions</strong>
              <div className="crm-tools-muted">Review devices currently signed in to your account.</div>
            </div>
            <div className="crm-tools-actions">
              <button className="crm-tools-btn" onClick={loadSessions}>
                <RefreshCw size={14} /> Refresh
              </button>
              <button className="crm-tools-btn danger" onClick={revokeAll}>
                <Shield size={14} /> Revoke all
              </button>
            </div>
          </div>
          <div className="crm-tools-table-wrap">
            <table className="crm-tools-table">
              <thead>
                <tr>
                  <th>Device</th>
                  <th>IP</th>
                  <th>Last used</th>
                  <th>Expires</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((item) => (
                  <tr key={item.sessionId}>
                    <td>
                      <strong>{item.deviceName || "Unknown device"}</strong>
                      <div className="crm-tools-muted">{item.userAgent || "—"}</div>
                    </td>
                    <td>{item.ipAddress || "—"}</td>
                    <td>{dateText(item.lastUsedAt)}</td>
                    <td>{dateText(item.expiresAt)}</td>
                    <td>
                      <button className="crm-tools-btn danger" onClick={() => revokeOneSession(item.sessionId)}>
                        Revoke
                      </button>
                    </td>
                  </tr>
                ))}
                {!sessions.length && (
                  <tr>
                    <td colSpan="5" className="crm-tools-empty">
                      No active sessions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "social-leads" && (
        <div className="crm-tools-card">
          <div className="crm-tools-toolbar">
            <div>
              <strong>Social Lead Webhook</strong>
              <div className="crm-tools-muted">Receive social lead payloads directly into Leads.</div>
            </div>
            <button className="crm-tools-btn primary" onClick={rotateSecret}>
              <RefreshCw size={14} /> Rotate secret
            </button>
          </div>
          <div className="crm-tools-webhook">
            <div className="crm-tools-webhook-row">
              <div className="crm-tools-webhook-label">Status</div>
              <div className="crm-tools-webhook-value">{socialConfig?.configured ? "Configured" : "Not configured"}</div>
            </div>
            <div className="crm-tools-webhook-row">
              <div className="crm-tools-webhook-label">Endpoint</div>
              <div className="crm-tools-webhook-value crm-tools-code">{socialConfig?.endpoint || `${window.location.origin}/api/v1/social-leads/{businessId}/{source}`}</div>
              <button className="crm-tools-icon" title="Copy endpoint" onClick={() => copyText(socialConfig?.endpoint || `${window.location.origin}/api/v1/social-leads/${businessId}/{source}`, "Webhook endpoint copied.")}>
                <Copy size={14} />
              </button>
            </div>
            <div className="crm-tools-webhook-row">
              <div className="crm-tools-webhook-label">Secret</div>
              <div className="crm-tools-webhook-value">{socialConfig?.secretPreview || "Not configured"}</div>
              <button
                className="crm-tools-icon"
                title="Copy new secret"
                onClick={() => (rotatedSecret ? copyText(rotatedSecret, "Webhook secret copied. Store it securely.") : showAuthAlert({ icon: "info", title: "Secret protected", text: "The current secret is only available when it is generated or rotated.", confirmButtonText: "OK" }))}>
                <Copy size={14} />
              </button>
            </div>
            <div className="crm-tools-help">
              Use the endpoint with a source such as <strong>facebook</strong>, <strong>instagram</strong> or <strong>linkedin</strong>. Send the generated secret as the HMAC signing key when your provider supports signed webhooks.
            </div>
          </div>
          {rotatedSecret && (
            <div className="crm-tools-secret">
              <strong>New webhook secret:</strong>
              <div className="crm-tools-code" style={{ marginTop: 6 }}>
                {rotatedSecret}
              </div>
              <div className="crm-tools-row-actions" style={{ marginTop: 9 }}>
                <button className="crm-tools-btn" onClick={() => copyText(rotatedSecret, "Webhook secret copied. Store it securely.")}>
                  <Copy size={13} /> Copy
                </button>
                <button className="crm-tools-btn" onClick={() => setRotatedSecret("")}>
                  <X size={13} /> Hide
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {apiKeyModal && (
        <div className="crm-tools-modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setApiKeyModal(false)}>
          <div className="crm-tools-modal">
            <div className="crm-tools-modal-head">
              <h2>Create API key</h2>
              <button className="crm-tools-close" onClick={() => setApiKeyModal(false)}>
                <X size={15} />
              </button>
            </div>
            <div className="crm-tools-form" style={{ padding: "18px 0 0" }}>
              <div className="crm-tools-field">
                <label>Name</label>
                <input className="crm-tools-input" value={apiKeyForm.name} onChange={(e) => setApiKeyForm({ ...apiKeyForm, name: e.target.value })} placeholder="Production integration" />
              </div>
              <div className="crm-tools-field">
                <label>Expiry</label>
                <input className="crm-tools-input" type="date" value={apiKeyForm.expiresAt} onChange={(e) => setApiKeyForm({ ...apiKeyForm, expiresAt: e.target.value })} />
              </div>
            </div>
            <div className="crm-tools-modal-foot">
              <button className="crm-tools-btn" onClick={() => setApiKeyModal(false)}>
                Cancel
              </button>
              <button className="crm-tools-btn primary" onClick={createKey}>
                Create key
              </button>
            </div>
          </div>
        </div>
      )}

      {sourceModal && (
        <div className="crm-tools-modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setSourceModal(false)}>
          <div className="crm-tools-modal">
            <div className="crm-tools-modal-head">
              <h2>{editingSource ? "Edit source or campaign" : "Create source or campaign"}</h2>
              <button className="crm-tools-close" onClick={() => setSourceModal(false)}>
                <X size={15} />
              </button>
            </div>
            <div className="crm-tools-form" style={{ padding: "18px 0 0" }}>
              <div className="crm-tools-field">
                <label>Name</label>
                <input className="crm-tools-input" value={sourceForm.name} onChange={(e) => setSourceForm({ ...sourceForm, name: e.target.value })} placeholder="Website" />
              </div>
              <div className="crm-tools-field">
                <label>Type</label>
                <select className="crm-tools-select" value={sourceForm.type} onChange={(e) => setSourceForm({ ...sourceForm, type: e.target.value })}>
                  {SOURCE_TYPES.map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </div>
              <div className="crm-tools-field">
                <label>Code</label>
                <input className="crm-tools-input" value={sourceForm.code} onChange={(e) => setSourceForm({ ...sourceForm, code: e.target.value })} placeholder="website" />
              </div>
              <div className="crm-tools-field">
                <label>Medium</label>
                <input className="crm-tools-input" value={sourceForm.medium} onChange={(e) => setSourceForm({ ...sourceForm, medium: e.target.value })} placeholder="organic" />
              </div>
              <div className="crm-tools-field full">
                <label>Description</label>
                <input className="crm-tools-input" value={sourceForm.description} onChange={(e) => setSourceForm({ ...sourceForm, description: e.target.value })} placeholder="Short description" />
              </div>
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                <input type="checkbox" checked={sourceForm.active} onChange={(e) => setSourceForm({ ...sourceForm, active: e.target.checked })} /> Active
              </label>
            </div>
            <div className="crm-tools-modal-foot">
              <button className="crm-tools-btn" onClick={() => setSourceModal(false)}>
                Cancel
              </button>
              <button className="crm-tools-btn primary" onClick={saveSource}>
                {editingSource ? "Save changes" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Pager({ pagination = {}, onChange }) {
  return (
    <div className="crm-tools-pager">
      <span className="crm-tools-muted">
        Page {pagination.page || 1} of {pagination.totalPages || 1} • {pagination.total || 0} records
      </span>
      <button className="crm-tools-page-btn" disabled={(pagination.page || 1) <= 1} onClick={() => onChange((pagination.page || 1) - 1)}>
        ‹
      </button>
      <button className="crm-tools-page-btn" disabled={(pagination.page || 1) >= (pagination.totalPages || 1)} onClick={() => onChange((pagination.page || 1) + 1)}>
        ›
      </button>
    </div>
  );
}
