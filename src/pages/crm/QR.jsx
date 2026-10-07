import { useEffect, useMemo, useState } from "react";
import { Check, Copy, Download, Edit3, ExternalLink, Link2, MoreVertical, Plus, QrCode as QrCodeIcon, RefreshCw, Search, Share2, Trash2, X, Zap } from "lucide-react";
import useBusiness from "../../hooks/useBusiness";
import { createQrCode, deleteQrCode, getQrCodes, getQrImage, regenerateQrCode, updateQrCode } from "../../api/qr.api";
import { getPublicForms } from "../../api/public-form.api";
import { showAuthAlert } from "../../components/auth/authAlert";

const unwrapArray = (value, keys = []) => {
  if (Array.isArray(value)) return value;

  for (const key of keys) {
    if (Array.isArray(value?.[key])) return value[key];
  }

  if (Array.isArray(value?.data)) return value.data;

  return [];
};

const getFormName = (item) => item?.formId?.name || item?.form?.name || item?.formName || "Public Form";

const getPublicUrl = (item) => item?.publicUrl || item?.url || (item?.formId?.slug ? `${window.location.origin}/public/forms/${item.businessId}/${item.formId.slug}` : "");

const getQrImageSource = (item) => {
  if (!item) return "";

  if (item.qrImage) {
    if (typeof item.qrImage === "string") {
      return item.qrImage;
    }

    if (item.qrImage?.data) {
      return item.qrImage.data;
    }
  }

  if (item.qrImageUrl) return item.qrImageUrl;
  if (item.imageUrl) return item.imageUrl;

  return "";
};

const downloadDataUrl = (dataUrl, filename) => {
  if (!dataUrl) return false;

  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();

  return true;
};

const blobToDataUrl = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;

    reader.readAsDataURL(blob);
  });

export default function QR() {
  const { businessId } = useBusiness();

  const [items, setItems] = useState([]);
  const [forms, setForms] = useState([]);

  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [formFilter, setFormFilter] = useState("");

  const [modal, setModal] = useState(null);
  const [selectedQr, setSelectedQr] = useState(null);

  const [notice, setNotice] = useState("");

  const [formData, setFormData] = useState({
    formId: "",
    name: "",
    size: 400,
    margin: 2,
    errorCorrectionLevel: "M",
    format: "png",
    active: true,
  });

  const showNotice = (message) => {
    setNotice(message);

    window.clearTimeout(window.__br30QrNoticeTimer);

    window.__br30QrNoticeTimer = window.setTimeout(() => {
      setNotice("");
    }, 2200);
  };

  const loadForms = async () => {
    if (!businessId) return;

    setFormLoading(true);

    try {
      const response = await getPublicForms(businessId);
      const list = unwrapArray(response, ["forms", "items"]);

      setForms(list);
    } catch {
      setForms([]);
    } finally {
      setFormLoading(false);
    }
  };

  const load = async () => {
    if (!businessId) return;

    setLoading(true);

    try {
      const params = {};

      if (search.trim()) {
        params.search = search.trim();
      }

      if (statusFilter !== "ALL") {
        params.active = statusFilter === "ACTIVE";
      }

      if (formFilter) {
        params.formId = formFilter;
      }

      const response = await getQrCodes(businessId, params);

      setItems(unwrapArray(response, ["items", "qrs", "qrCodes"]));
    } catch (error) {
      setItems([]);
      showNotice(error?.response?.data?.message || error?.message || "Unable to load QR codes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadForms();
  }, [businessId]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      load();
    }, 250);

    return () => window.clearTimeout(timer);
  }, [businessId, search, statusFilter, formFilter]);

  const activeCount = useMemo(() => items.filter((item) => item.active !== false).length, [items]);

  const inactiveCount = useMemo(() => items.filter((item) => item.active === false).length, [items]);

  const resetForm = () => {
    setFormData({
      formId: "",
      name: "",
      size: 400,
      margin: 2,
      errorCorrectionLevel: "M",
      format: "png",
      active: true,
    });
  };

  const openCreate = () => {
    resetForm();
    setModal("create");
  };

  const openEdit = (item) => {
    setSelectedQr(item);

    setFormData({
      formId: item?.formId?._id || item?.formId || "",
      name: item?.name || "",
      size: item?.size || 400,
      margin: item?.margin ?? 2,
      errorCorrectionLevel: item?.errorCorrectionLevel || "M",
      format: item?.format || "png",
      active: item?.active !== false,
    });

    setModal("edit");
  };

  const closeModal = () => {
    if (saving) return;

    setModal(null);
    setSelectedQr(null);
    resetForm();
  };

  const saveQr = async () => {
    if (!businessId) return;

    if (modal === "create" && !formData.formId) {
      showAuthAlert({
        icon: "warning",
        title: "Public form required",
        text: "Please select a public form.",
        confirmButtonText: "OK",
      });
      return;
    }

    if (!formData.name.trim()) {
      showAuthAlert({
        icon: "warning",
        title: "QR name required",
        text: "Please enter a QR name.",
        confirmButtonText: "OK",
      });
      return;
    }

    setSaving(true);

    try {
      const payload = {
        name: formData.name.trim(),
        size: Number(formData.size),
        margin: Number(formData.margin),
        errorCorrectionLevel: formData.errorCorrectionLevel,
        format: formData.format,
        active: Boolean(formData.active),
      };

      let response;

      if (modal === "create") {
        response = await createQrCode(businessId, {
          ...payload,
          formId: formData.formId,
        });
      } else {
        response = await updateQrCode(businessId, selectedQr._id, payload);
      }

      const created = response?.data || response;

      if (created) {
        setSelectedQr(created);
      }

      showAuthAlert({
        icon: "success",
        title: modal === "create" ? "QR code created" : "QR code updated",
        text: modal === "create" ? "QR code created successfully." : "QR code updated successfully.",
        confirmButtonText: "Done",
      });

      closeModal();
      await load();
    } catch (error) {
      showAuthAlert({
        icon: "error",
        title: "Unable to save QR code",
        text: error?.response?.data?.message || error?.message || "Unable to save QR code.",
        confirmButtonText: "OK",
      });
    } finally {
      setSaving(false);
    }
  };

  const toggleQr = async (item) => {
    if (!businessId || !item?._id) return;

    try {
      await updateQrCode(businessId, item._id, {
        active: item.active === false,
      });

      const activated = item.active === false;

      showAuthAlert({
        icon: "success",
        title: activated ? "QR code activated" : "QR code deactivated",
        text: activated ? "QR code has been activated successfully." : "QR code has been deactivated successfully.",
        confirmButtonText: "Done",
      });

      await load();
    } catch (error) {
      showAuthAlert({
        icon: "error",
        title: "Update failed",
        text: error?.response?.data?.message || error?.message || "Unable to update QR status.",
        confirmButtonText: "OK",
      });
    }
  };

  const removeQr = async (item) => {
    if (!businessId || !item?._id) return;

    const result = await showAuthAlert({
      icon: "warning",
      title: "Delete QR code?",
      text: `"${item.name || "this QR code"}" will be permanently deleted. This action cannot be undone.`,
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    });

    if (!result?.isConfirmed) return;

    try {
      await deleteQrCode(businessId, item._id);

      showAuthAlert({
        icon: "success",
        title: "QR code deleted",
        text: `${item.name || "QR code"} has been deleted successfully.`,
        confirmButtonText: "Done",
      });

      await load();
    } catch (error) {
      showAuthAlert({
        icon: "error",
        title: "Delete failed",
        text: error?.response?.data?.message || error?.message || "Unable to delete QR code.",
        confirmButtonText: "OK",
      });
    }
  };

  const regenerate = async (item) => {
    if (!businessId || !item?._id) return;

    try {
      const response = await regenerateQrCode(businessId, item._id, {
        size: item.size,
        margin: item.margin,
        errorCorrectionLevel: item.errorCorrectionLevel,
        format: item.format,
      });

      const updated = response?.data || response;

      if (updated) {
        setSelectedQr(updated);
        setModal("preview");
      }

      showAuthAlert({
        icon: "success",
        title: "QR code regenerated",
        text: "QR code has been regenerated successfully.",
        confirmButtonText: "Done",
      });

      await load();
    } catch (error) {
      showAuthAlert({
        icon: "error",
        title: "Regeneration failed",
        text: error?.response?.data?.message || error?.message || "Unable to regenerate QR code.",
        confirmButtonText: "OK",
      });
    }
  };

  const copyLink = async (item) => {
    const url = getPublicUrl(item);

    if (!url) {
      showAuthAlert({
        icon: "warning",
        title: "Link unavailable",
        text: "Public link is not available.",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(url);

      showAuthAlert({
        icon: "success",
        title: "Link copied",
        text: "Public link copied to clipboard.",
        confirmButtonText: "Done",
      });
    } catch {
      showAuthAlert({
        icon: "error",
        title: "Copy failed",
        text: "Unable to copy the public link.",
        confirmButtonText: "OK",
      });
    }
  };

  const shareLink = async (item) => {
    const url = getPublicUrl(item);

    if (!url) {
      showNotice("Public link is not available.");
      return;
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: item.name || "BR30 CRM Lead Form",
          text: `Open ${item.name || "this form"}`,
          url,
        });

        return;
      } catch {
        return;
      }
    }

    await copyLink(item);
  };

  const loadImageForItem = async (item) => {
    if (!businessId || !item?._id) return "";

    try {
      const blob = await getQrImage(businessId, item._id);
      return await blobToDataUrl(blob);
    } catch {
      return getQrImageSource(item);
    }
  };

  const previewQr = async (item) => {
    setSelectedQr({
      ...item,
      qrImage: getQrImageSource(item),
    });

    setModal("preview");

    if (!getQrImageSource(item)) {
      const image = await loadImageForItem(item);

      if (image) {
        setSelectedQr((current) => (current ? { ...current, qrImage: image } : current));
      }
    }
  };

  const downloadQr = async (item) => {
    try {
      let image = getQrImageSource(item);

      if (!image) {
        image = await loadImageForItem(item);
      }

      if (!image) {
        showAuthAlert({
          icon: "warning",
          title: "QR image unavailable",
          text: "QR image is not available for download.",
          confirmButtonText: "OK",
        });
        return;
      }

      const extension = item.format === "svg" ? "svg" : "png";

      downloadDataUrl(
        image,
        `${(item.name || "br30-qr")
          .trim()
          .replace(/[^a-z0-9]+/gi, "-")
          .replace(/^-|-$/g, "")
          .toLowerCase()}.${extension}`
      );

      showAuthAlert({
        icon: "success",
        title: "Download started",
        text: "QR code download has started.",
        confirmButtonText: "Done",
      });
    } catch (error) {
      showAuthAlert({
        icon: "error",
        title: "Download failed",
        text: error?.message || "Unable to download QR code.",
        confirmButtonText: "OK",
      });
    }
  };

  const shareQr = async (item) => {
    const url = getPublicUrl(item);

    if (!navigator.share) {
      await shareLink(item);
      return;
    }

    try {
      let image = getQrImageSource(item);

      if (!image) {
        image = await loadImageForItem(item);
      }

      if (image?.startsWith("data:")) {
        const response = await fetch(image);
        const blob = await response.blob();

        const extension = item.format === "svg" ? "svg" : "png";

        const file = new File([blob], `${(item.name || "br30-qr").replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.${extension}`, {
          type: blob.type || "image/png",
        });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: item.name || "BR30 CRM QR",
            text: "Scan this QR code to open the lead form.",
            url,
            files: [file],
          });

          return;
        }
      }

      await navigator.share({
        title: item.name || "BR30 CRM Lead Form",
        text: "Open this lead-generation form.",
        url,
      });
    } catch {}
  };

  return (
    <div className="qr-page">
      <style>{`
        .qr-page{padding:24px 26px 38px;max-width:1500px;margin:auto;color:var(--crm-text)}
        .qr-head{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;margin-bottom:18px}
        .qr-title{font-size:24px;font-weight:400;margin:0 0 5px}
        .qr-subtitle{font-size:13px;color:var(--crm-muted);margin:0;line-height:1.5}
        .qr-head-actions{display:flex;align-items:center;gap:8px;flex-shrink:0}
        .qr-btn{height:38px;border:1px solid var(--crm-border);border-radius:9px;background:var(--crm-surface);color:var(--crm-text);padding:0 12px;display:inline-flex;align-items:center;justify-content:center;gap:7px;font-size:13px;cursor:pointer;transition:.16s ease}
        .qr-btn:hover{background:var(--crm-surface-2);border-color:var(--crm-border);color:var(--crm-text)}
        .qr-btn-primary{background:var(--crm-primary);border-color:var(--crm-primary);color:#fff}
        .qr-btn-primary:hover{background:var(--crm-primary);border-color:var(--crm-primary);color:#fff;filter:brightness(.96)}
        .qr-btn-danger{color:var(--crm-danger)}
        .qr-btn-danger:hover{color:var(--crm-danger)}
        .qr-btn:disabled{opacity:.55;cursor:not-allowed}
        .qr-stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-bottom:16px}
        .qr-stat{border:1px solid var(--crm-border);background:var(--crm-surface);border-radius:12px;padding:14px}
        .qr-stat-label{font-size:12px;color:var(--crm-muted);margin-bottom:5px}
        .qr-stat-value{font-size:21px;font-weight:500;color:var(--crm-text)}
        .qr-toolbar{border:1px solid var(--crm-border);background:var(--crm-surface);border-radius:12px;padding:10px;display:flex;align-items:center;gap:9px;margin-bottom:12px}
        .qr-search{height:38px;min-width:260px;flex:1;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:9px;display:flex;align-items:center;padding:0 10px;gap:8px}
        .qr-search svg{color:var(--crm-muted);flex-shrink:0}
        .qr-search input{border:0;outline:0;background:transparent;color:var(--crm-text);width:100%;font-size:13px}
        .qr-search input::placeholder{color:var(--crm-muted)}
        .qr-search-clear{width:25px;height:25px;border:0;background:transparent;color:var(--crm-muted);display:grid;place-items:center;border-radius:6px;padding:0;cursor:pointer}
        .qr-search-clear:hover{background:transparent;color:var(--crm-text)}
        .qr-select{height:38px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:9px;padding:0 10px;outline:none;font-size:13px;min-width:145px}
        .qr-table-wrap{border:1px solid var(--crm-border);background:var(--crm-surface);border-radius:12px;overflow:hidden}
        .qr-table{width:100%;border-collapse:collapse}
        .qr-table th{height:44px;padding:0 13px;text-align:left;font-size:11px;font-weight:500;color:var(--crm-muted);border-bottom:1px solid var(--crm-border);white-space:nowrap}
        .qr-table td{padding:12px 13px;border-bottom:1px solid var(--crm-border);font-size:13px;vertical-align:middle}
        .qr-table tbody tr:last-child td{border-bottom:0}
        .qr-table tbody tr:hover{background:var(--crm-surface-2)}
        .qr-name{font-weight:500;color:var(--crm-text);display:flex;align-items:center;gap:8px}
        .qr-mini-icon{width:30px;height:30px;border:1px solid var(--crm-border);border-radius:8px;display:grid;place-items:center;color:var(--crm-primary);background:var(--crm-surface)}
        .qr-form-name{color:var(--crm-text);font-size:13px}
        .qr-muted{font-size:11px;color:var(--crm-muted);margin-top:3px}
        .qr-status{display:inline-flex;align-items:center;gap:5px;padding:4px 8px;border-radius:999px;font-size:11px;border:1px solid var(--crm-border)}
        .qr-status.active{color:var(--crm-success,#16a34a)}
        .qr-status.inactive{color:var(--crm-muted)}
        .qr-dot{width:6px;height:6px;border-radius:50%;background:currentColor}
        .qr-actions{display:flex;justify-content:flex-end;align-items:center;gap:4px}
        .qr-action{width:32px;height:32px;border:1px solid transparent;background:transparent;color:var(--crm-muted);border-radius:8px;display:grid;place-items:center;cursor:pointer}
        .qr-action:hover{background:var(--crm-surface-2);border-color:var(--crm-border);color:var(--crm-text)}
        .qr-action.danger:hover{color:var(--crm-danger)}
        .qr-empty{padding:45px 20px;text-align:center;color:var(--crm-muted);font-size:13px}
        .qr-empty-icon{width:44px;height:44px;border:1px solid var(--crm-border);border-radius:12px;display:grid;place-items:center;margin:0 auto 10px;color:var(--crm-muted)}
        .qr-loading{padding:45px 20px;text-align:center;color:var(--crm-muted);font-size:13px}
        .qr-modal-backdrop{position:fixed;inset:0;background:rgba(15,23,42,.5);display:flex;align-items:center;justify-content:center;padding:20px;z-index:1000}
        .qr-modal-card{width:min(560px,100%);max-height:calc(100vh - 40px);overflow:auto;background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:15px;box-shadow:0 20px 60px rgba(0,0,0,.2)}
        .qr-modal-head{display:flex;align-items:center;justify-content:space-between;padding:16px 18px;border-bottom:1px solid var(--crm-border)}
        .qr-modal-title{font-size:16px;font-weight:500;margin:0}
        .qr-close{width:32px;height:32px;border:1px solid transparent;background:transparent;color:var(--crm-muted);border-radius:8px;display:grid;place-items:center;cursor:pointer}
        .qr-close:hover{background:var(--crm-surface-2);color:var(--crm-text)}
        .qr-modal-body{padding:18px}
        .qr-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:13px}
        .qr-field{display:flex;flex-direction:column;gap:6px}
        .qr-field.full{grid-column:1/-1}
        .qr-label{font-size:12px;color:var(--crm-muted)}
        .qr-input,.qr-field select{height:39px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:9px;padding:0 10px;outline:none;font-size:13px;width:100%;box-sizing:border-box}
        .qr-input:focus,.qr-field select:focus{border-color:var(--crm-primary)}
        .qr-check{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--crm-text);cursor:pointer}
        .qr-check input{accent-color:var(--crm-primary)}
        .qr-modal-foot{display:flex;justify-content:flex-end;gap:8px;padding:14px 18px;border-top:1px solid var(--crm-border)}
        .qr-preview{text-align:center}
        .qr-image-box{width:min(360px,100%);min-height:300px;margin:0 auto 15px;border:1px solid var(--crm-border);border-radius:12px;background:#fff;display:flex;align-items:center;justify-content:center;padding:12px;box-sizing:border-box}
        .qr-image{display:block;width:100%;max-width:330px;height:auto;max-height:330px;object-fit:contain}
        .qr-preview-link{font-size:12px;color:var(--crm-muted);word-break:break-all;line-height:1.5;margin-bottom:14px}
        .qr-preview-actions{display:flex;justify-content:center;flex-wrap:wrap;gap:7px}
        .qr-link-line{display:flex;align-items:center;gap:7px;border:1px solid var(--crm-border);border-radius:9px;padding:9px 10px;margin-top:12px}
        .qr-link-line svg{color:var(--crm-muted);flex-shrink:0}
        .qr-link-text{font-size:12px;color:var(--crm-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .qr-notice{position:fixed;right:22px;bottom:22px;z-index:1200;background:var(--crm-text);color:var(--crm-surface);border-radius:10px;padding:10px 13px;font-size:12px;box-shadow:0 10px 30px rgba(0,0,0,.2)}
        @media(max-width:850px){.qr-table-wrap{overflow-x:auto}.qr-table{min-width:850px}.qr-stats{grid-template-columns:1fr 1fr}.qr-toolbar{flex-wrap:wrap}.qr-search{min-width:200px}.qr-head{align-items:stretch;flex-direction:column}.qr-head-actions{justify-content:flex-start}}
        @media(max-width:560px){.qr-page{padding:18px 12px 30px}.qr-stats{grid-template-columns:1fr}.qr-form-grid{grid-template-columns:1fr}.qr-field.full{grid-column:auto}.qr-modal-backdrop{padding:10px}.qr-modal-card{max-height:calc(100vh - 20px)}}
      `}</style>

      <div className="qr-head">
        <div>
          <h1 className="qr-title">QR Codes</h1>
          <p className="qr-subtitle">Create, manage and share QR codes for your public lead-generation forms.</p>
        </div>

        <div className="qr-head-actions">
          <button type="button" className="qr-btn" onClick={load} disabled={loading}>
            <RefreshCw size={15} />
            Refresh
          </button>

          <button type="button" className="qr-btn qr-btn-primary" onClick={openCreate}>
            <Plus size={15} />
            Create QR
          </button>
        </div>
      </div>

      <div className="qr-stats">
        <div className="qr-stat">
          <div className="qr-stat-label">Total QR Codes</div>
          <div className="qr-stat-value">{items.length}</div>
        </div>

        <div className="qr-stat">
          <div className="qr-stat-label">Active</div>
          <div className="qr-stat-value">{activeCount}</div>
        </div>

        <div className="qr-stat">
          <div className="qr-stat-label">Inactive</div>
          <div className="qr-stat-value">{inactiveCount}</div>
        </div>
      </div>

      <div className="qr-toolbar">
        <div className="qr-search">
          <Search size={16} />

          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search QR codes..." />

          {search && (
            <button type="button" className="qr-search-clear" onClick={() => setSearch("")} aria-label="Clear search">
              <X size={15} />
            </button>
          )}
        </div>

        <select className="qr-select" value={formFilter} onChange={(event) => setFormFilter(event.target.value)}>
          <option value="">All Forms</option>

          {forms.map((form) => (
            <option key={form._id} value={form._id}>
              {form.name}
            </option>
          ))}
        </select>

        <select className="qr-select" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
          <option value="ALL">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      <div className="qr-table-wrap">
        {loading ? (
          <div className="qr-loading">Loading QR codes...</div>
        ) : items.length === 0 ? (
          <div className="qr-empty">
            <div className="qr-empty-icon">
              <QrCodeIcon size={21} />
            </div>

            <div>{search || formFilter || statusFilter !== "ALL" ? "No QR codes match your filters." : "No QR codes created yet."}</div>

            {!search && !formFilter && statusFilter === "ALL" && (
              <button type="button" className="qr-btn qr-btn-primary" style={{ marginTop: 12 }} onClick={openCreate}>
                <Plus size={14} />
                Create your first QR
              </button>
            )}
          </div>
        ) : (
          <table className="qr-table">
            <thead>
              <tr>
                <th>QR CODE</th>
                <th>FORM</th>
                <th>FORMAT</th>
                <th>STATUS</th>
                <th>SCANS</th>
                <th>CREATED</th>
                <th style={{ textAlign: "right" }}>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item) => (
                <tr key={item._id}>
                  <td>
                    <div className="qr-name">
                      <div className="qr-mini-icon">
                        <QrCodeIcon size={17} />
                      </div>

                      <div>
                        <div>{item.name || "Untitled QR"}</div>

                        <div className="qr-muted">{item.slug || item.publicUrl || "Public QR"}</div>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div className="qr-form-name">{getFormName(item)}</div>

                    {item?.formId?.slug && <div className="qr-muted">/{item.formId.slug}</div>}
                  </td>

                  <td>
                    <span className="qr-muted">{(item.format || "png").toUpperCase()}</span>
                  </td>

                  <td>
                    <span className={`qr-status ${item.active === false ? "inactive" : "active"}`}>
                      <span className="qr-dot" />
                      {item.active === false ? "Inactive" : "Active"}
                    </span>
                  </td>

                  <td>
                    <span className="qr-muted">{Number(item.scanCount || 0)}</span>
                  </td>

                  <td>
                    <span className="qr-muted">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "—"}</span>
                  </td>

                  <td>
                    <div className="qr-actions">
                      <button type="button" className="qr-action" title="Preview QR" onClick={() => previewQr(item)}>
                        <QrCodeIcon size={15} />
                      </button>

                      <button type="button" className="qr-action" title="Copy public link" onClick={() => copyLink(item)}>
                        <Copy size={15} />
                      </button>

                      <button type="button" className="qr-action" title="Share" onClick={() => shareQr(item)}>
                        <Share2 size={15} />
                      </button>

                      <button type="button" className="qr-action" title="Download QR" onClick={() => downloadQr(item)}>
                        <Download size={15} />
                      </button>

                      <button type="button" className="qr-action" title="Edit" onClick={() => openEdit(item)}>
                        <Edit3 size={15} />
                      </button>

                      <button type="button" className="qr-action" title={item.active === false ? "Activate" : "Deactivate"} onClick={() => toggleQr(item)}>
                        {item.active === false ? <Check size={15} /> : <Zap size={15} />}
                      </button>

                      <button type="button" className="qr-action" title="Regenerate" onClick={() => regenerate(item)}>
                        <RefreshCw size={15} />
                      </button>

                      <button type="button" className="qr-action danger" title="Delete" onClick={() => removeQr(item)}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal === "create" && (
        <div className="qr-modal-backdrop" onClick={closeModal}>
          <div className="qr-modal-card" onClick={(event) => event.stopPropagation()}>
            <div className="qr-modal-head">
              <h2 className="qr-modal-title">Create QR Code</h2>

              <button type="button" className="qr-close" onClick={closeModal} disabled={saving}>
                <X size={17} />
              </button>
            </div>

            <div className="qr-modal-body">
              <div className="qr-form-grid">
                <div className="qr-field full">
                  <label className="qr-label">Public Form *</label>

                  <select
                    className="qr-input"
                    value={formData.formId}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        formId: event.target.value,
                      }))
                    }
                    disabled={formLoading}>
                    <option value="">{formLoading ? "Loading forms..." : "Select a public form"}</option>

                    {forms.map((form) => (
                      <option key={form._id} value={form._id}>
                        {form.name}
                        {form.status === "INACTIVE" ? " — Inactive" : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="qr-field full">
                  <label className="qr-label">QR Name *</label>

                  <input
                    className="qr-input"
                    value={formData.name}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        name: event.target.value,
                      }))
                    }
                    placeholder="Example: Website Lead Form QR"
                    maxLength={150}
                  />
                </div>

                <div className="qr-field">
                  <label className="qr-label">Size</label>

                  <input
                    className="qr-input"
                    type="number"
                    min="100"
                    max="2000"
                    value={formData.size}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        size: event.target.value,
                      }))
                    }
                  />
                </div>

                <div className="qr-field">
                  <label className="qr-label">Margin</label>

                  <input
                    className="qr-input"
                    type="number"
                    min="0"
                    max="20"
                    value={formData.margin}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        margin: event.target.value,
                      }))
                    }
                  />
                </div>

                <div className="qr-field">
                  <label className="qr-label">Error Correction</label>

                  <select
                    value={formData.errorCorrectionLevel}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        errorCorrectionLevel: event.target.value,
                      }))
                    }>
                    <option value="L">Low</option>
                    <option value="M">Medium</option>
                    <option value="Q">Quartile</option>
                    <option value="H">High</option>
                  </select>
                </div>

                <div className="qr-field">
                  <label className="qr-label">Format</label>

                  <select
                    value={formData.format}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        format: event.target.value,
                      }))
                    }>
                    <option value="png">PNG</option>
                    <option value="svg">SVG</option>
                  </select>
                </div>

                <div className="qr-field full">
                  <label className="qr-check">
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(event) =>
                        setFormData((current) => ({
                          ...current,
                          active: event.target.checked,
                        }))
                      }
                    />
                    Active QR code
                  </label>
                </div>
              </div>
            </div>

            <div className="qr-modal-foot">
              <button type="button" className="qr-btn" onClick={closeModal} disabled={saving}>
                Cancel
              </button>

              <button type="button" className="qr-btn qr-btn-primary" onClick={saveQr} disabled={saving}>
                <Check size={15} />
                {saving ? "Creating..." : "Create QR"}
              </button>
            </div>
          </div>
        </div>
      )}

      {modal === "edit" && (
        <div className="qr-modal-backdrop" onClick={closeModal}>
          <div className="qr-modal-card" onClick={(event) => event.stopPropagation()}>
            <div className="qr-modal-head">
              <h2 className="qr-modal-title">Edit QR Code</h2>

              <button type="button" className="qr-close" onClick={closeModal} disabled={saving}>
                <X size={17} />
              </button>
            </div>

            <div className="qr-modal-body">
              <div className="qr-form-grid">
                <div className="qr-field full">
                  <label className="qr-label">QR Name *</label>

                  <input
                    className="qr-input"
                    value={formData.name}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        name: event.target.value,
                      }))
                    }
                    maxLength={150}
                  />
                </div>

                <div className="qr-field">
                  <label className="qr-label">Size</label>

                  <input
                    className="qr-input"
                    type="number"
                    min="100"
                    max="2000"
                    value={formData.size}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        size: event.target.value,
                      }))
                    }
                  />
                </div>

                <div className="qr-field">
                  <label className="qr-label">Margin</label>

                  <input
                    className="qr-input"
                    type="number"
                    min="0"
                    max="20"
                    value={formData.margin}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        margin: event.target.value,
                      }))
                    }
                  />
                </div>

                <div className="qr-field">
                  <label className="qr-label">Error Correction</label>

                  <select
                    value={formData.errorCorrectionLevel}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        errorCorrectionLevel: event.target.value,
                      }))
                    }>
                    <option value="L">Low</option>
                    <option value="M">Medium</option>
                    <option value="Q">Quartile</option>
                    <option value="H">High</option>
                  </select>
                </div>

                <div className="qr-field">
                  <label className="qr-label">Format</label>

                  <select
                    value={formData.format}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        format: event.target.value,
                      }))
                    }>
                    <option value="png">PNG</option>
                    <option value="svg">SVG</option>
                  </select>
                </div>

                <div className="qr-field full">
                  <label className="qr-check">
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(event) =>
                        setFormData((current) => ({
                          ...current,
                          active: event.target.checked,
                        }))
                      }
                    />
                    Active QR code
                  </label>
                </div>
              </div>
            </div>

            <div className="qr-modal-foot">
              <button type="button" className="qr-btn" onClick={closeModal} disabled={saving}>
                Cancel
              </button>

              <button type="button" className="qr-btn qr-btn-primary" onClick={saveQr} disabled={saving}>
                <Check size={15} />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {modal === "preview" && selectedQr && (
        <div
          className="qr-modal-backdrop"
          onClick={() => {
            setModal(null);
            setSelectedQr(null);
          }}>
          <div className="qr-modal-card" onClick={(event) => event.stopPropagation()}>
            <div className="qr-modal-head">
              <div>
                <h2 className="qr-modal-title">{selectedQr.name || "QR Code"}</h2>

                <div className="qr-muted">{getFormName(selectedQr)}</div>
              </div>

              <button
                type="button"
                className="qr-close"
                onClick={() => {
                  setModal(null);
                  setSelectedQr(null);
                }}>
                <X size={17} />
              </button>
            </div>

            <div className="qr-modal-body">
              <div className="qr-preview">
                <div className="qr-image-box">{selectedQr.qrImage ? <img src={selectedQr.qrImage} alt={selectedQr.name || "QR code"} className="qr-image" /> : <div className="qr-loading">Loading QR image...</div>}</div>

                <div className="qr-preview-link">{getPublicUrl(selectedQr) || "Public link unavailable"}</div>

                <div className="qr-preview-actions">
                  <button type="button" className="qr-btn" onClick={() => copyLink(selectedQr)}>
                    <Copy size={14} />
                    Copy Link
                  </button>

                  <button type="button" className="qr-btn" onClick={() => shareLink(selectedQr)}>
                    <Link2 size={14} />
                    Share Link
                  </button>

                  <button type="button" className="qr-btn" onClick={() => downloadQr(selectedQr)}>
                    <Download size={14} />
                    Download QR
                  </button>

                  <button type="button" className="qr-btn" onClick={() => shareQr(selectedQr)}>
                    <Share2 size={14} />
                    Share QR
                  </button>

                  <button type="button" className="qr-btn" onClick={() => regenerate(selectedQr)}>
                    <RefreshCw size={14} />
                    Regenerate
                  </button>

                  <button type="button" className="qr-btn" onClick={() => window.open(getPublicUrl(selectedQr), "_blank", "noopener,noreferrer")} disabled={!getPublicUrl(selectedQr)}>
                    <ExternalLink size={14} />
                    Open Form
                  </button>
                </div>

                <div className="qr-link-line">
                  <Link2 size={15} />

                  <div className="qr-link-text">{getPublicUrl(selectedQr) || "No public URL"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {notice && <div className="qr-notice">{notice}</div>}
    </div>
  );
}
