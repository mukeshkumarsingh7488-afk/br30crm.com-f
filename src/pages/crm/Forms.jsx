import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, ChevronDown, Clipboard, Copy, Download, ExternalLink, Eye, Link, MoreHorizontal, Plus, QrCode, RefreshCw, Search, Settings2, Share2, Trash2, X, Zap } from "lucide-react";
import useBusiness from "../../hooks/useBusiness";
import { createPublicForm, deletePublicForm, getPublicFormQr, getPublicForms, updatePublicForm } from "../../api/public-form.api";
import { showAuthAlert } from "../../components/auth/authAlert";

const blank = {
  name: "",
  slug: "",
  description: "",
  purpose: "LEAD",
  source: "website",
  campaign: "",
  successMessage: "Thank you. We will contact you shortly.",
  redirectUrl: "",
  status: "ACTIVE",
  spamProtection: true,
  settings: {},
  fields: [
    {
      key: "name",
      label: "Name",
      type: "text",
      required: true,
      placeholder: "Enter your name",
      helpText: "",
      options: [],
      order: 0,
    },
    {
      key: "email",
      label: "Email",
      type: "email",
      required: true,
      placeholder: "Enter your email",
      helpText: "",
      options: [],
      order: 1,
    },
    {
      key: "phone",
      label: "Phone",
      type: "phone",
      required: false,
      placeholder: "Enter phone number",
      helpText: "",
      options: [],
      order: 2,
    },
    {
      key: "message",
      label: "Message",
      type: "textarea",
      required: false,
      placeholder: "How can we help?",
      helpText: "",
      options: [],
      order: 3,
    },
  ],
};

const err = (e) => e?.response?.data?.message || e?.response?.data?.error || e?.message || "Something went wrong.";

const cloneBlank = () => ({
  ...blank,
  settings: {},
  fields: blank.fields.map((x) => ({
    ...x,
    options: Array.isArray(x.options) ? [...x.options] : [],
  })),
});

const normalizeForm = (item) => ({
  ...cloneBlank(),
  ...item,
  redirectUrl: item?.redirectUrl || "",
  purpose: item?.purpose === "SUPPORT" ? "SUPPORT" : "LEAD",
  source: item?.source || "website",
  campaign: item?.campaign || "",
  successMessage: item?.successMessage || "Thank you. We will contact you shortly.",
  status: item?.status || "ACTIVE",
  spamProtection: item?.spamProtection !== false,
  settings: item?.settings || {},
  fields: Array.isArray(item?.fields)
    ? item.fields.map((field, index) => ({
        key: field?.key || `field_${index + 1}`,
        label: field?.label || `Field ${index + 1}`,
        type: String(field?.type || "text").toLowerCase(),
        required: Boolean(field?.required),
        placeholder: field?.placeholder || "",
        helpText: field?.helpText || "",
        options: Array.isArray(field?.options) ? [...field.options] : [],
        order: Number.isFinite(field?.order) ? field.order : index,
      }))
    : [],
});

export default function Forms() {
  const { businessId, loading: businessLoading } = useBusiness();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(cloneBlank());

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [actionId, setActionId] = useState(null);
  const [menuId, setMenuId] = useState(null);

  const [qrModal, setQrModal] = useState(false);
  const [qrItem, setQrItem] = useState(null);
  const [qrData, setQrData] = useState(null);
  const [qrLoading, setQrLoading] = useState(false);

  const [embedModal, setEmbedModal] = useState(false);
  const [embedItem, setEmbedItem] = useState(null);

  const [previewModal, setPreviewModal] = useState(false);
  const [previewItem, setPreviewItem] = useState(null);

  const load = useCallback(async () => {
    if (!businessId) return;

    setLoading(true);
    setError("");

    try {
      const response = await getPublicForms(businessId);
      const data = Array.isArray(response) ? response : response?.forms || response?.items || [];

      setItems(data);
    } catch (e) {
      setError(err(e));
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const closeMenu = () => setMenuId(null);
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, []);

  const publicUrl = useCallback(
    (item) => {
      if (!businessId || !item?.slug) return "";
      return `${window.location.origin}/public/forms/${businessId}/${item.slug}`;
    },
    [businessId]
  );

  const embedUrl = useCallback(
    (item) => {
      const url = publicUrl(item);
      return `${window.location.origin}/public/forms/embed/${businessId}/${item?.slug || ""}`;
    },
    [businessId, publicUrl]
  );

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();

    return items.filter((item) => {
      const matchesSearch =
        !q ||
        String(item?.name || "")
          .toLowerCase()
          .includes(q) ||
        String(item?.slug || "")
          .toLowerCase()
          .includes(q) ||
        String(item?.source || "")
          .toLowerCase()
          .includes(q) ||
        String(item?.campaign || "")
          .toLowerCase()
          .includes(q);

      const matchesStatus = statusFilter === "ALL" || item?.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [items, search, statusFilter]);

  const openNew = () => {
    setEditing(null);
    setForm(cloneBlank());
    setError("");
    setModal(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm(normalizeForm(item));
    setError("");
    setModal(true);
    setMenuId(null);
  };

  const save = async () => {
    if (!businessId) return;

    if (!form.name.trim()) {
      setError("Form name is required.");
      return;
    }

    if (!form.fields.length) {
      setError("At least one form field is required.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const payload = {
        ...form,
        name: form.name.trim(),
        purpose: form.purpose === "SUPPORT" ? "SUPPORT" : "LEAD",
        slug: form.slug.trim(),
        source: form.source.trim() || "website",
        campaign: form.campaign.trim() || null,
        redirectUrl: form.redirectUrl.trim() || null,
        fields: form.fields.map((field, index) => ({
          ...field,
          key: String(field.key || "")
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9_]+/g, "_"),
          label: String(field.label || "").trim(),
          options: Array.isArray(field.options) ? field.options.filter((x) => String(x).trim() !== "") : [],
          order: index,
        })),
      };

      if (editing?._id) {
        await updatePublicForm(businessId, editing._id, payload);
      } else {
        await createPublicForm(businessId, payload);
      }

      setModal(false);
      setEditing(null);
      await load();

      showAuthAlert({
        icon: "success",
        title: editing ? "Form updated" : "Form created",
        text: editing ? "Your form has been updated." : form.purpose === "SUPPORT" ? "Your support ticket form is ready." : "Your lead generation form is ready.",
        confirmButtonText: "Done",
      });
    } catch (e) {
      setError(err(e));
    } finally {
      setSaving(false);
    }
  };

  const removeForm = async (item) => {
    if (!businessId || !item?._id) return;

    const confirmed = await showAuthAlert({
      icon: "warning",
      title: `Delete "${item.name}"?`,
      text: "This action cannot be undone.",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (!confirmed?.isConfirmed) return;

    setActionId(item._id);
    setMenuId(null);
    setError("");

    try {
      await deletePublicForm(businessId, item._id);
      await load();

      await showAuthAlert({
        icon: "success",
        title: "Form deleted",
        text: `${item.name} has been deleted.`,
        confirmButtonText: "Done",
      });
    } catch (e) {
      setError(err(e));

      await showAuthAlert({
        icon: "error",
        title: "Delete failed",
        text: err(e),
        confirmButtonText: "Done",
      });
    } finally {
      setActionId(null);
    }
  };

  const toggleStatus = async (item) => {
    if (!businessId || !item?._id) return;

    const nextStatus = item.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    setActionId(item._id);
    setMenuId(null);
    setError("");

    try {
      await updatePublicForm(businessId, item._id, {
        status: nextStatus,
      });

      await load();

      showAuthAlert({
        icon: "success",
        title: nextStatus === "ACTIVE" ? "Form activated" : "Form deactivated",
        text: nextStatus === "ACTIVE" ? "The public form is live again." : "The public form is no longer accepting submissions.",
        confirmButtonText: "Done",
      });
    } catch (e) {
      setError(err(e));
    } finally {
      setActionId(null);
    }
  };

  const copyText = async (value, title = "Copied") => {
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);

      showAuthAlert({
        icon: "success",
        title,
        text: "Copied to clipboard.",
        confirmButtonText: "Done",
      });
    } catch {
      setError("Unable to copy. Please copy it manually.");
    }
  };

  const shareLink = async (item) => {
    const url = publicUrl(item);
    setMenuId(null);

    if (!url) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: item.name,
          text: `Open ${item.name}`,
          url,
        });
      } else {
        await copyText(url, "Link copied");
      }
    } catch {}
  };

  const openPublic = (item) => {
    const url = publicUrl(item);
    if (url) window.open(url, "_blank", "noopener,noreferrer");
    setMenuId(null);
  };

  const openQr = async (item) => {
    if (!businessId || !item?.slug) return;

    setQrItem(item);
    setQrData(null);
    setQrModal(true);
    setQrLoading(true);
    setMenuId(null);

    try {
      const response = await getPublicFormQr(businessId, item.slug);
      setQrData(response?.data || response || null);
    } catch (e) {
      setError(err(e));
    } finally {
      setQrLoading(false);
    }
  };

  const qrImage = qrData?.qrImageUrl || qrData?.imageUrl || qrData?.url || qrData?.qrUrl || "";

  const qrPublicUrl = qrData?.publicUrl || publicUrl(qrItem);

  const downloadQr = async () => {
    if (!qrImage) return;

    try {
      const response = await fetch(qrImage);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);

      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = `${qrItem?.slug || "lead-form"}-qr.png`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();

      URL.revokeObjectURL(objectUrl);
    } catch {
      window.open(qrImage, "_blank", "noopener,noreferrer");
    }
  };

  const shareQr = async () => {
    if (!qrImage) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `${qrItem?.name || "Lead form"} QR`,
          text: qrPublicUrl,
          url: qrPublicUrl,
        });
      } else {
        await copyText(qrPublicUrl, "QR link copied");
      }
    } catch {}
  };

  const addField = () => {
    setForm((current) => ({
      ...current,
      fields: [
        ...current.fields,
        {
          key: `field_${current.fields.length + 1}`,
          label: "New field",
          type: "text",
          required: false,
          placeholder: "",
          helpText: "",
          options: [],
          order: current.fields.length,
        },
      ],
    }));
  };

  const updateField = (index, changes) => {
    setForm((current) => ({
      ...current,
      fields: current.fields.map((field, i) => (i === index ? { ...field, ...changes } : field)),
    }));
  };

  const addFieldOption = (fieldIndex) => {
    setForm((current) => ({
      ...current,
      fields: current.fields.map((field, index) =>
        index === fieldIndex
          ? {
              ...field,
              options: [...(Array.isArray(field.options) ? field.options : []), ""],
            }
          : field
      ),
    }));
  };

  const updateFieldOption = (fieldIndex, optionIndex, value) => {
    setForm((current) => ({
      ...current,
      fields: current.fields.map((field, index) =>
        index === fieldIndex
          ? {
              ...field,
              options: (Array.isArray(field.options) ? field.options : []).map((option, i) => (i === optionIndex ? value : option)),
            }
          : field
      ),
    }));
  };

  const removeFieldOption = (fieldIndex, optionIndex) => {
    setForm((current) => ({
      ...current,
      fields: current.fields.map((field, index) =>
        index === fieldIndex
          ? {
              ...field,
              options: (Array.isArray(field.options) ? field.options : []).filter((_, i) => i !== optionIndex),
            }
          : field
      ),
    }));
  };

  const removeField = (index) => {
    setForm((current) => ({
      ...current,
      fields: current.fields.filter((_, i) => i !== index).map((field, i) => ({ ...field, order: i })),
    }));
  };

  const moveField = (index, direction) => {
    setForm((current) => {
      const next = [...current.fields];
      const target = index + direction;

      if (target < 0 || target >= next.length) return current;

      [next[index], next[target]] = [next[target], next[index]];

      return {
        ...current,
        fields: next.map((field, i) => ({
          ...field,
          order: i,
        })),
      };
    });
  };

  const openEmbed = (item) => {
    setEmbedItem(item);
    setEmbedModal(true);
    setMenuId(null);
  };

  const embedCode = useMemo(() => {
    if (!embedItem) return "";

    const url = publicUrl(embedItem);

    return `<iframe src="${url}" title="${String(embedItem.name || "Lead Generation Form").replace(/"/g, "&quot;")}" width="100%" height="650" frameborder="0" style="border:0;max-width:100%;"></iframe>`;
  }, [embedItem, publicUrl]);

  const openPreview = (item) => {
    setPreviewItem(item);
    setPreviewModal(true);
    setMenuId(null);
  };

  return (
    <div className="gen-page">
      <style>{`
        .gen-page{padding:24px 26px 38px;max-width:1450px;margin:auto;color:var(--crm-text)}
        .gen-head{display:flex;justify-content:space-between;gap:15px;margin-bottom:16px}
        .gen-title{font-size:24px;font-weight:400;margin:0}
        .gen-sub{font-size:13px;color:var(--crm-muted);margin:5px 0}
        .gen-actions{display:flex;gap:8px;align-items:center}
        .gen-btn{height:38px;border:1px solid var(--crm-border);border-radius:9px;background:var(--crm-surface);color:var(--crm-text);padding:0 12px;display:inline-flex;align-items:center;justify-content:center;gap:7px;cursor:pointer;transition:.18s ease}
        .gen-btn:hover{background:var(--crm-surface-2);border-color:var(--crm-primary);color:var(--crm-text)}
        .gen-btn.primary{background:var(--crm-primary);border-color:var(--crm-primary);color:#fff}
        .gen-btn.primary:hover{opacity:.92;color:#fff}
        .gen-btn.danger{color:var(--crm-danger)}
        .gen-btn:disabled{opacity:.55;cursor:not-allowed}
        .gen-toolbar{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:14px;flex-wrap:wrap}
        .gen-search{height:40px;min-width:280px;display:flex;align-items:center;gap:8px;border:1px solid var(--crm-border);border-radius:10px;background:var(--crm-surface);padding:0 10px;color:var(--crm-muted)}
        .gen-search input{flex:1;min-width:0;border:0;outline:0;background:transparent;color:var(--crm-text);font-size:13px}
        .gen-search button{width:25px;height:25px;border:0;background:transparent;color:var(--crm-muted);display:grid;place-items:center;border-radius:6px;cursor:pointer;padding:0}
        .gen-search button:hover{background:transparent;color:var(--crm-text)}
        .gen-filter{height:40px;border:1px solid var(--crm-border);border-radius:10px;background:var(--crm-surface);color:var(--crm-text);padding:0 10px;outline:0}
        .gen-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
        .gen-card{border:1px solid var(--crm-border);border-radius:13px;background:var(--crm-surface);padding:15px;box-shadow:var(--crm-shadow);min-width:0}
        .gen-card:hover{border-color:color-mix(in srgb,var(--crm-primary) 35%,var(--crm-border))}
        .gen-card-top{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}
        .gen-card h3{font-size:15px;font-weight:500;margin:0 0 6px;word-break:break-word}
        .muted{font-size:12px;color:var(--crm-muted)}
        .gen-status{display:inline-flex;align-items:center;height:24px;padding:0 8px;border-radius:999px;font-size:11px;font-weight:500}
        .gen-status.active{background:color-mix(in srgb,var(--crm-success) 12%,transparent);color:var(--crm-success)}
        .gen-status.inactive{background:color-mix(in srgb,var(--crm-danger) 10%,transparent);color:var(--crm-danger)}
        .gen-meta{display:flex;flex-wrap:wrap;gap:7px;margin-top:10px}
        .gen-chip{border:1px solid var(--crm-border);border-radius:7px;padding:4px 7px;font-size:11px;color:var(--crm-muted)}
        .gen-card-actions{display:flex;gap:6px;margin-top:13px;flex-wrap:wrap}
        .gen-small-btn{height:34px;padding:0 9px;border:1px solid var(--crm-border);border-radius:8px;background:var(--crm-surface);color:var(--crm-text);display:inline-flex;align-items:center;gap:6px;cursor:pointer;font-size:12px}
        .gen-small-btn:hover{background:var(--crm-surface-2);border-color:var(--crm-primary)}
        .gen-more{position:relative}
        .gen-more-menu{position:absolute;right:0;top:40px;width:190px;background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:10px;padding:5px;box-shadow:var(--crm-shadow);z-index:80}
        .gen-more-item{width:100%;height:35px;border:0;background:transparent;color:var(--crm-text);border-radius:7px;display:flex;align-items:center;gap:8px;padding:0 9px;cursor:pointer;font-size:12px;text-align:left}
        .gen-more-item:hover{background:var(--crm-surface-2)}
        .gen-more-item.danger{color:var(--crm-danger)}
        .gen-modal{position:fixed;inset:0;background:rgba(15,23,42,.48);display:grid;place-items:center;padding:18px;z-index:900}
        .gen-dialog{width:min(920px,100%);max-height:94vh;overflow:auto;background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:14px;padding:18px}
        .gen-dialog.small{width:min(520px,100%)}
        .gen-dialog.medium{width:min(680px,100%)}
        .gen-dialog-header{display:flex;align-items:center;justify-content:space-between;gap:10px}
        .gen-dialog-title{font-size:16px;font-weight:500}
        .gen-form{display:grid;grid-template-columns:1fr 1fr;gap:10px}
        .gen-form label{display:grid;gap:6px;font-size:12px;color:var(--crm-muted)}
        .gen-form input,.gen-form textarea,.gen-form select{width:100%;box-sizing:border-box;border:1px solid var(--crm-border);border-radius:9px;background:var(--crm-surface);color:var(--crm-text);padding:9px 10px;outline:0}
        .gen-form input:focus,.gen-form textarea:focus,.gen-form select:focus{border-color:var(--crm-primary)}
        .gen-form textarea{min-height:82px;resize:vertical}
        .span{grid-column:1/-1}
        .field-box{border:1px solid var(--crm-border);border-radius:10px;padding:10px;background:var(--crm-surface-2)}
        .field-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px}
        .field-title{font-size:12px;font-weight:500;color:var(--crm-text)}
        .field-row{display:grid;grid-template-columns:1fr 1.1fr 130px 80px;gap:7px;align-items:center;margin-bottom:7px}
        .field-extra{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:7px}
        .field-extra input{height:36px}
        .field-options{margin-top:7px}
        .field-check{display:flex!important;align-items:center;gap:7px!important;grid-template-columns:auto 1fr!important}
        .field-check input{width:auto}
        .gen-foot{display:flex;justify-content:flex-end;gap:8px;margin-top:15px}
        .gen-code{width:100%;min-height:150px;box-sizing:border-box;border:1px solid var(--crm-border);border-radius:10px;background:var(--crm-surface-2);color:var(--crm-text);padding:12px;font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-size:12px;line-height:1.55;resize:vertical}
        .qr-wrap{display:grid;place-items:center;padding:14px}
        .qr-wrap img{width:min(330px,100%);aspect-ratio:1/1;object-fit:contain;border-radius:10px;background:#fff;padding:8px}
        .qr-url{margin-top:10px;border:1px solid var(--crm-border);border-radius:9px;padding:9px 10px;font-size:12px;color:var(--crm-muted);word-break:break-all}
        .preview-box{border:1px solid var(--crm-border);border-radius:12px;background:var(--crm-surface-2);padding:16px}
        .preview-field{display:grid;gap:6px;margin-bottom:12px}
        .preview-field span{font-size:12px;color:var(--crm-muted)}
        .preview-field input,.preview-field textarea,.preview-field select{width:100%;box-sizing:border-box;border:1px solid var(--crm-border);border-radius:8px;background:var(--crm-surface);color:var(--crm-text);padding:9px}
        .empty-state{grid-column:1/-1;text-align:center;padding:42px 20px}
        .empty-icon{width:44px;height:44px;border:1px solid var(--crm-border);border-radius:12px;display:grid;place-items:center;margin:0 auto 10px;color:var(--crm-muted)}
        @media(max-width:1000px){.gen-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
        @media(max-width:800px){.gen-grid{grid-template-columns:1fr}.gen-head{flex-direction:column}.gen-form{grid-template-columns:1fr}.span{grid-column:auto}.field-row{grid-template-columns:1fr 1fr}.field-extra{grid-template-columns:1fr}.gen-search{min-width:0;width:100%}}
        @media(max-width:520px){.gen-page{padding:16px 12px 30px}.gen-actions{width:100%}.gen-actions .gen-btn{flex:1}.gen-toolbar{align-items:stretch}.gen-filter{width:100%}.gen-card-actions .gen-small-btn{flex:1}.field-row{grid-template-columns:1fr}.gen-dialog{padding:14px}}
      `}</style>

      <div className="gen-head">
        <div>
          <h1 className="gen-title">Lead Generation Forms</h1>
          <p className="gen-sub">Create public forms that capture leads directly into BR30 CRM.</p>
        </div>

        <div className="gen-actions">
          <button type="button" className="gen-btn" onClick={load} disabled={loading}>
            <RefreshCw size={14} />
            Refresh
          </button>

          <button type="button" className="gen-btn primary" onClick={openNew}>
            <Plus size={14} />
            New form
          </button>
        </div>
      </div>

      {error && (
        <div
          className="muted"
          style={{
            color: "var(--crm-danger)",
            marginBottom: 10,
          }}>
          {error}
        </div>
      )}

      <div className="gen-toolbar">
        <div className="gen-search">
          <Search size={16} />
          <input value={search} placeholder="Search forms, source or campaign..." onChange={(e) => setSearch(e.target.value)} />
          {search && (
            <button type="button" aria-label="Clear search" onClick={() => setSearch("")}>
              <X size={15} />
            </button>
          )}
        </div>

        <select className="gen-filter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="ALL">All forms</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      <div className="gen-grid">
        {loading || businessLoading ? (
          <div className="gen-card">Loading forms…</div>
        ) : filteredItems.length ? (
          filteredItems.map((item) => {
            const isBusy = actionId === item._id;
            const url = publicUrl(item);

            return (
              <div className="gen-card" key={item._id}>
                <div className="gen-card-top">
                  <div style={{ minWidth: 0 }}>
                    <h3>{item.name}</h3>
                    <div className="muted">/{item.slug}</div>
                  </div>

                  <span className={`gen-status ${item.status === "ACTIVE" ? "active" : "inactive"}`}>{item.status === "ACTIVE" ? "Active" : "Inactive"}</span>
                </div>

                <p className="muted">{item.description || "No description"}</p>

                <div className="gen-meta">
                  <span className="gen-chip">{item.fields?.length || 0} fields</span>
                  {item.purpose === "SUPPORT" && <span className="gen-chip">Support Ticket</span>} {item.source && <span className="gen-chip">Source: {item.source}</span>}
                  {item.campaign && <span className="gen-chip">Campaign: {item.campaign}</span>}
                </div>

                <div className="gen-card-actions">
                  <button type="button" className="gen-small-btn" onClick={() => openEdit(item)}>
                    <Settings2 size={14} />
                    Edit
                  </button>

                  <button type="button" className="gen-small-btn" onClick={() => copyText(url, "Link copied")}>
                    <Copy size={14} />
                    Copy
                  </button>

                  <button type="button" className="gen-small-btn" onClick={() => openPublic(item)}>
                    <ExternalLink size={14} />
                    Open
                  </button>

                  <div className="gen-more" onClick={(e) => e.stopPropagation()}>
                    <button type="button" className="gen-small-btn" onClick={() => setMenuId((current) => (current === item._id ? null : item._id))} aria-label="More actions">
                      <MoreHorizontal size={15} />
                    </button>

                    {menuId === item._id && (
                      <div className="gen-more-menu">
                        <button type="button" className="gen-more-item" onClick={() => openPreview(item)}>
                          <Eye size={14} />
                          Preview form
                        </button>

                        <button type="button" className="gen-more-item" onClick={() => shareLink(item)}>
                          <Share2 size={14} />
                          Share link
                        </button>

                        <button type="button" className="gen-more-item" onClick={() => openQr(item)}>
                          <QrCode size={14} />
                          QR code
                        </button>

                        <button type="button" className="gen-more-item" onClick={() => openEmbed(item)}>
                          <Clipboard size={14} />
                          Embed on website
                        </button>

                        <button type="button" className="gen-more-item" disabled={isBusy} onClick={() => toggleStatus(item)}>
                          <Zap size={14} />
                          {item.status === "ACTIVE" ? "Deactivate" : "Activate"}
                        </button>

                        <button type="button" className="gen-more-item danger" disabled={isBusy} onClick={() => removeForm(item)}>
                          <Trash2 size={14} />
                          Delete form
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="gen-card empty-state">
            <div className="empty-icon">
              <Link size={20} />
            </div>
            <h3 style={{ margin: "0 0 5px", fontWeight: 500 }}>{search || statusFilter !== "ALL" ? "No matching forms" : "No forms yet"}</h3>
            <div className="muted">{search || statusFilter !== "ALL" ? "Try changing your search or filter." : "Create your first lead capture form."}</div>
          </div>
        )}
      </div>

      {modal && (
        <div className="gen-modal">
          <div className="gen-dialog">
            <div className="gen-dialog-header">
              <div>
                <div className="gen-dialog-title">{editing ? "Edit form" : "New form"}</div>
                <div className="muted">Configure a lead or support intake form and its tracking source.</div>
              </div>

              <button type="button" className="gen-btn" onClick={() => setModal(false)}>
                <X size={15} />
                Close
              </button>
            </div>

            <div className="gen-form" style={{ marginTop: 16 }}>
              <label>
                Form name
                <input value={form.name} placeholder="e.g. Website Contact Form" onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </label>

              <label>
                Slug
                <input value={form.slug} placeholder="e.g. website-contact" onChange={(e) => setForm({ ...form, slug: e.target.value })} />
              </label>

              <label>
                Form purpose
                <select
                  value={form.purpose}
                  onChange={(e) => {
                    const purpose = e.target.value;
                    if (purpose === "SUPPORT" && form.purpose !== "SUPPORT") {
                      setForm({
                        ...form,
                        purpose,
                        successMessage: "Your support request has been submitted successfully. Our team will get back to you shortly.",
                        fields: [
                          { key: "name", label: "Full Name", type: "name", required: true, placeholder: "Enter your full name", helpText: "", options: [], order: 0 },
                          { key: "email", label: "Email", type: "email", required: true, placeholder: "Enter your email", helpText: "", options: [], order: 1 },
                          { key: "phone", label: "Phone", type: "phone", required: false, placeholder: "Enter phone number", helpText: "", options: [], order: 2 },
                          {
                            key: "category",
                            label: "Issue Category",
                            type: "select",
                            required: true,
                            placeholder: "Select issue category",
                            helpText: "",
                            options: ["Account & Login", "Billing & Payment", "Order", "Product / Service", "Technical Issue", "Delivery", "Refund / Cancellation", "Security", "Other"],
                            order: 3,
                          },
                          { key: "subject", label: "Subject", type: "text", required: true, placeholder: "Briefly describe the issue", helpText: "", options: [], order: 4 },
                          { key: "message", label: "Describe your issue", type: "textarea", required: true, placeholder: "Tell us what happened and how we can help.", helpText: "", options: [], order: 5 },
                          { key: "referenceId", label: "Order / Reference ID", type: "text", required: false, placeholder: "Optional", helpText: "", options: [], order: 6 },
                        ],
                      });
                    } else {
                      setForm({ ...form, purpose });
                    }
                  }}>
                  <option value="LEAD">Lead Generation</option>
                  <option value="SUPPORT">Support Ticket</option>
                </select>
              </label>

              <label>
                Source
                <input value={form.source} placeholder="e.g. br30-kart" onChange={(e) => setForm({ ...form, source: e.target.value })} />
              </label>

              <label>
                Campaign
                <input value={form.campaign} placeholder="e.g. Diwali-2026" onChange={(e) => setForm({ ...form, campaign: e.target.value })} />
              </label>

              <label className="span">
                Description
                <textarea value={form.description} placeholder="Describe what this form is used for." onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </label>

              <label>
                Success message
                <input
                  value={form.successMessage}
                  placeholder="Thanks! We will contact you shortly."
                  onChange={(e) =>
                    setForm({
                      ...form,
                      successMessage: e.target.value,
                    })
                  }
                />
              </label>

              <label>
                Redirect URL
                <input
                  value={form.redirectUrl}
                  placeholder="https://example.com/thank-you"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      redirectUrl: e.target.value,
                    })
                  }
                />
              </label>

              <label>
                Status
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      status: e.target.value,
                    })
                  }>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </label>

              <label className="field-check">
                <input
                  type="checkbox"
                  checked={form.spamProtection}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      spamProtection: e.target.checked,
                    })
                  }
                />
                Enable spam protection
              </label>

              <div className="span">
                <div className="field-head">
                  <div>
                    <div className="field-title">Form fields</div>
                    <div className="muted">Configure the information your leads or support customers submit.</div>
                  </div>
                </div>

                <div style={{ display: "grid", gap: 8 }}>
                  {form.fields.map((field, index) => (
                    <div className="field-box" key={index}>
                      <div className="field-head">
                        <div className="field-title">Field {index + 1}</div>

                        <div style={{ display: "flex", gap: 5 }}>
                          <button type="button" className="gen-small-btn" disabled={index === 0} onClick={() => moveField(index, -1)} title="Move up">
                            ↑
                          </button>

                          <button type="button" className="gen-small-btn" disabled={index === form.fields.length - 1} onClick={() => moveField(index, 1)} title="Move down">
                            ↓
                          </button>

                          <button type="button" className="gen-small-btn" onClick={() => removeField(index)} title="Remove field">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      <div className="field-row">
                        <input
                          value={field.key}
                          placeholder="key e.g. email"
                          onChange={(e) =>
                            updateField(index, {
                              key: e.target.value,
                            })
                          }
                        />

                        <input
                          value={field.label}
                          placeholder="Label e.g. Email"
                          onChange={(e) =>
                            updateField(index, {
                              label: e.target.value,
                            })
                          }
                        />

                        <select
                          value={field.type}
                          onChange={(e) => {
                            const type = e.target.value;
                            updateField(index, {
                              type,
                              key: type === "name" ? "name" : field.key,
                              label: type === "name" ? "Name" : field.label,
                              options: type === "select" ? field.options || [] : [],
                            });
                          }}>
                          <option value="name">Name</option>
                          <option value="text">Text</option>
                          <option value="email">Email</option>
                          <option value="phone">Phone</option>
                          <option value="number">Number</option>
                          <option value="textarea">Textarea</option>
                          <option value="select">Select</option>
                          <option value="date">Date</option>
                        </select>

                        <label className="field-check">
                          <input
                            type="checkbox"
                            checked={Boolean(field.required)}
                            onChange={(e) =>
                              updateField(index, {
                                required: e.target.checked,
                              })
                            }
                          />
                          Required
                        </label>
                      </div>

                      <div className="field-extra">
                        <input
                          value={field.placeholder || ""}
                          placeholder="Placeholder"
                          onChange={(e) =>
                            updateField(index, {
                              placeholder: e.target.value,
                            })
                          }
                        />

                        <input
                          value={field.helpText || ""}
                          placeholder="Help text"
                          onChange={(e) =>
                            updateField(index, {
                              helpText: e.target.value,
                            })
                          }
                        />
                      </div>

                      {String(field.type || "").toLowerCase() === "select" && (
                        <div className="field-options" style={{ display: "grid", gap: 8 }}>
                          {(Array.isArray(field.options) ? field.options : []).map((option, optionIndex) => (
                            <div
                              key={`${index}-option-${optionIndex}`}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                              }}>
                              <input
                                style={{
                                  flex: 1,
                                  width: "100%",
                                  boxSizing: "border-box",
                                  height: 36,
                                  border: "1px solid var(--crm-border)",
                                  borderRadius: 8,
                                  background: "var(--crm-surface)",
                                  color: "var(--crm-text)",
                                  padding: "0 10px",
                                  outline: 0,
                                }}
                                value={option}
                                placeholder={`Option ${optionIndex + 1}`}
                                onChange={(e) => updateFieldOption(index, optionIndex, e.target.value)}
                              />

                              <button
                                type="button"
                                className="gen-small-btn"
                                onClick={() => removeFieldOption(index, optionIndex)}
                                title="Remove option"
                                style={{
                                  flexShrink: 0,
                                  width: 36,
                                  height: 36,
                                  display: "inline-flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}>
                                <X size={14} />
                              </button>
                            </div>
                          ))}

                          <div style={{ display: "flex", justifyContent: "flex-start", marginTop: 2 }}>
                            <button type="button" className="gen-btn" onClick={() => addFieldOption(index)}>
                              <Plus size={14} />
                              Add option
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
                  <button type="button" className="gen-btn" onClick={addField}>
                    <Plus size={14} />
                    Add field
                  </button>
                </div>
              </div>
            </div>

            <div className="gen-foot">
              <button type="button" className="gen-btn" onClick={() => setModal(false)}>
                Cancel
              </button>

              <button type="button" className="gen-btn primary" disabled={saving} onClick={save}>
                {saving ? "Saving…" : editing ? "Update form" : "Save form"}
              </button>
            </div>
          </div>
        </div>
      )}

      {qrModal && (
        <div className="gen-modal">
          <div className="gen-dialog small">
            <div className="gen-dialog-header">
              <div>
                <div className="gen-dialog-title">QR Code</div>
                <div className="muted">{qrItem?.name || "Lead generation form"}</div>
              </div>

              <button type="button" className="gen-btn" onClick={() => setQrModal(false)}>
                <X size={15} />
              </button>
            </div>

            {qrLoading ? (
              <div className="muted" style={{ padding: "45px 10px", textAlign: "center" }}>
                Generating QR code…
              </div>
            ) : qrImage ? (
              <>
                <div className="qr-wrap">
                  <img src={qrImage} alt={`${qrItem?.name || "Form"} QR`} />
                </div>

                <div className="qr-url">{qrPublicUrl}</div>

                <div className="gen-card-actions" style={{ marginTop: 12 }}>
                  <button type="button" className="gen-btn" onClick={() => copyText(qrPublicUrl, "QR link copied")}>
                    <Copy size={14} />
                    Copy link
                  </button>

                  <button type="button" className="gen-btn" onClick={downloadQr}>
                    <Download size={14} />
                    Download QR
                  </button>

                  <button type="button" className="gen-btn" onClick={shareQr}>
                    <Share2 size={14} />
                    Share QR
                  </button>
                </div>
              </>
            ) : (
              <div className="muted" style={{ padding: "35px 10px", textAlign: "center" }}>
                QR code could not be generated.
              </div>
            )}
          </div>
        </div>
      )}

      {embedModal && (
        <div className="gen-modal">
          <div className="gen-dialog medium">
            <div className="gen-dialog-header">
              <div>
                <div className="gen-dialog-title">Embed on website</div>
                <div className="muted">Copy this code and paste it into your website.</div>
              </div>

              <button type="button" className="gen-btn" onClick={() => setEmbedModal(false)}>
                <X size={15} />
              </button>
            </div>

            <div style={{ marginTop: 15 }}>
              <div className="muted" style={{ marginBottom: 7 }}>
                Public form URL
              </div>

              <div className="qr-url">{embedItem ? publicUrl(embedItem) : ""}</div>
            </div>

            <div style={{ marginTop: 15 }}>
              <div className="muted" style={{ marginBottom: 7 }}>
                Embed code
              </div>

              <textarea className="gen-code" value={embedCode} readOnly />
            </div>

            <div className="gen-foot">
              <button type="button" className="gen-btn" onClick={() => copyText(embedCode, "Embed code copied")}>
                <Copy size={14} />
                Copy embed code
              </button>

              <button type="button" className="gen-btn primary" onClick={() => setEmbedModal(false)}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {previewModal && previewItem && (
        <div className="gen-modal">
          <div className="gen-dialog medium">
            <div className="gen-dialog-header">
              <div>
                <div className="gen-dialog-title">{previewItem.name}</div>
                <div className="muted">Form preview</div>
              </div>

              <button type="button" className="gen-btn" onClick={() => setPreviewModal(false)}>
                <X size={15} />
              </button>
            </div>

            <div className="preview-box" style={{ marginTop: 15 }}>
              {previewItem.description && (
                <p className="muted" style={{ marginTop: 0 }}>
                  {previewItem.description}
                </p>
              )}

              {previewItem.fields?.map((field, index) => (
                <div className="preview-field" key={`${field.key}-${index}`}>
                  <span>
                    {field.label}
                    {field.required ? " *" : ""}
                  </span>

                  {field.type === "textarea" ? (
                    <textarea placeholder={field.placeholder || ""} disabled />
                  ) : field.type === "select" ? (
                    <select disabled defaultValue="">
                      <option value="">{field.placeholder || `Select ${field.label}`}</option>

                      {(field.options || []).map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  ) : (
                    <input type={field.type === "phone" ? "tel" : field.type === "number" ? "number" : field.type === "date" ? "date" : field.type === "email" ? "email" : "text"} placeholder={field.placeholder || ""} disabled />
                  )}

                  {field.helpText && <small className="muted">{field.helpText}</small>}
                </div>
              ))}

              <button type="button" className="gen-btn primary" disabled>
                Submit
              </button>
            </div>

            <div className="gen-foot">
              <button type="button" className="gen-btn" onClick={() => copyText(publicUrl(previewItem), "Link copied")}>
                <Copy size={14} />
                Copy public link
              </button>

              <button type="button" className="gen-btn" onClick={() => openPublic(previewItem)}>
                <ExternalLink size={14} />
                Open live form
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
