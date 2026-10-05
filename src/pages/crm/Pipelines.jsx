import { useEffect, useMemo, useState } from "react";
import { BarChart3, CheckCircle2, Eye, Layers3, Pencil, Plus, RefreshCw, Search, Trash2, X, GripVertical, CircleOff } from "lucide-react";

import { showAuthAlert } from "../../components/auth/authAlert";
import useBusiness from "../../hooks/useBusiness";

import { getPipelines, getPipelineById, createPipeline, updatePipeline, deletePipeline, addPipelineStage, updatePipelineStage, deletePipelineStage } from "../../api/pipeline.api";

const getErrorMessage = (err, fallback = "Something went wrong.") => {
  const data = err?.response?.data;

  if (Array.isArray(data?.errors) && data.errors.length) {
    return data.errors
      .map((item) => item?.msg || item?.message || String(item))
      .filter(Boolean)
      .join("\n");
  }

  if (Array.isArray(data?.message)) {
    return data.message.filter(Boolean).join("\n");
  }

  if (typeof data?.message === "string" && data.message.trim()) {
    return data.message;
  }

  if (typeof err?.message === "string" && err.message.trim()) {
    return err.message;
  }

  return fallback;
};

const EMPTY_PIPELINE_FORM = {
  name: "",
  description: "",
  type: "SALES",
  status: "ACTIVE",
  isDefault: false,
};

const EMPTY_STAGE_FORM = {
  name: "",
  description: "",
  probability: 0,
  color: "",
  isClosed: false,
  isWon: false,
  isActive: true,
  order: 0,
};

const formatDate = (value) => {
  if (!value) return "—";

  try {
    return new Date(value).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
};

const PipelineStageBadge = ({ stage }) => {
  const background = stage?.isWon ? "color-mix(in srgb,var(--crm-success) 12%,transparent)" : stage?.isClosed ? "color-mix(in srgb,var(--crm-danger) 10%,transparent)" : "color-mix(in srgb,var(--crm-primary) 9%,transparent)";

  const color = stage?.isWon ? "var(--crm-success)" : stage?.isClosed ? "var(--crm-danger)" : "var(--crm-primary)";

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "4px 8px",
        borderRadius: 7,
        fontSize: 10,
        fontWeight: 400,
        background,
        color,
        whiteSpace: "nowrap",
      }}>
      {stage?.name || "Unnamed"}
    </span>
  );
};

export default function Pipelines() {
  const { businessId, loading: businessLoading, error: businessError } = useBusiness();

  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [stageSaving, setStageSaving] = useState(false);

  const [error, setError] = useState("");

  const [modal, setModal] = useState(null);
  const [pipelineForm, setPipelineForm] = useState(EMPTY_PIPELINE_FORM);
  const [pipelineStages, setPipelineStages] = useState([]);

  const [stageModal, setStageModal] = useState(null);
  const [stageForm, setStageForm] = useState(EMPTY_STAGE_FORM);

  const [selectedPipeline, setSelectedPipeline] = useState(null);
  const [selectedStage, setSelectedStage] = useState(null);

  const loadPipelines = async (page = pagination.page || 1, nextSearch = search) => {
    if (!businessId) return;

    setLoading(true);
    setError("");

    try {
      const response = await getPipelines(businessId, {
        page,
        limit: pagination.limit || 10,
        includeInactive: true,
        ...(nextSearch ? { search: nextSearch } : {}),
        ...(typeFilter ? { type: typeFilter } : {}),
        ...(statusFilter ? { status: statusFilter } : {}),
      });

      const data = response?.data || response || {};

      const rows = Array.isArray(data?.pipelines) ? data.pipelines : Array.isArray(data?.items) ? data.items : [];

      setItems(rows);

      setPagination(
        data?.pagination || {
          page,
          limit: pagination.limit || 10,
          total: rows.length,
          totalPages: 1,
        }
      );
    } catch (err) {
      const message = getErrorMessage(err, "Unable to load pipelines.");

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (businessId) {
      loadPipelines(1, search);
    }
  }, [businessId, typeFilter, statusFilter]);

  useEffect(() => {
    if (businessError && !businessId && !businessLoading) {
      setError(businessError || "Unable to load your business workspace.");
    }
  }, [businessError, businessId, businessLoading]);

  const totalStages = useMemo(() => items.reduce((total, pipeline) => total + (Array.isArray(pipeline?.stages) ? pipeline.stages.length : 0), 0), [items]);

  const pipelineStats = useMemo(() => {
    const total = Number(pagination.total ?? items.length ?? 0);
    const active = items.filter((pipeline) => pipeline?.status === "ACTIVE").length;
    const inactive = items.filter((pipeline) => pipeline?.status === "INACTIVE").length;
    const defaults = items.filter((pipeline) => Boolean(pipeline?.isDefault)).length;

    return [
      { title: "Total Pipelines", value: total.toLocaleString("en-IN"), detail: "All pipelines", icon: Layers3, tone: "" },
      { title: "Active", value: active.toLocaleString("en-IN"), detail: "On current page", icon: CheckCircle2, tone: "green" },
      { title: "Inactive", value: inactive.toLocaleString("en-IN"), detail: "On current page", icon: CircleOff, tone: "orange" },
      { title: "Default", value: defaults.toLocaleString("en-IN"), detail: "On current page", icon: BarChart3, tone: "success" },
    ];
  }, [items, pagination.total]);

  const openCreate = () => {
    setError("");
    setPipelineForm({ ...EMPTY_PIPELINE_FORM });
    setPipelineStages([]);
    setModal({ mode: "create" });
  };

  const openEdit = (pipeline) => {
    setError("");

    setPipelineForm({
      name: pipeline?.name || "",
      description: pipeline?.description || "",
      type: pipeline?.type || "SALES",
      status: pipeline?.status || "ACTIVE",
      isDefault: Boolean(pipeline?.isDefault),
    });

    setPipelineStages(
      Array.isArray(pipeline?.stages)
        ? [...pipeline.stages]
            .sort((a, b) => Number(a?.order ?? 0) - Number(b?.order ?? 0))
            .map((stage, index) => ({
              name: stage?.name || "",
              description: stage?.description || "",
              probability: Number(stage?.probability ?? 0),
              color: stage?.color || "",
              isClosed: Boolean(stage?.isClosed),
              isWon: Boolean(stage?.isWon),
              isActive: stage?.isActive !== false,
              order: index,
            }))
        : []
    );

    setSelectedPipeline(pipeline);
    setModal({
      mode: "edit",
      item: pipeline,
    });
  };

  const openView = async (pipeline) => {
    setError("");
    setLoading(true);

    try {
      const response = await getPipelineById(businessId, pipeline._id);

      const data = response?.data || response || {};
      const nextPipeline = data?.pipeline || pipeline;

      setSelectedPipeline(nextPipeline);

      setModal({
        mode: "view",
        item: nextPipeline,
      });
    } catch (err) {
      const message = getErrorMessage(err, "Unable to load pipeline details.");

      setError(message);

      await showAuthAlert({
        icon: "error",
        title: "Unable to load pipeline",
        text: message,
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  const validatePipeline = () => {
    if (!pipelineForm.name.trim()) {
      return "Pipeline name is required.";
    }

    if (pipelineForm.name.trim().length < 2) {
      return "Pipeline name must be at least 2 characters.";
    }

    if (pipelineForm.name.trim().length > 150) {
      return "Pipeline name cannot exceed 150 characters.";
    }

    const invalidStage = pipelineStages.find((stage) => !String(stage?.name || "").trim());
    if (invalidStage) {
      return "Every pipeline stage must have a name.";
    }

    return "";
  };

  const addPipelineFormStage = () => {
    setPipelineStages((current) => [...current, { ...EMPTY_STAGE_FORM, order: current.length }]);
  };

  const updatePipelineFormStage = (index, field, value) => {
    setPipelineStages((current) => current.map((stage, stageIndex) => (stageIndex === index ? { ...stage, [field]: value } : stage)));
  };

  const removePipelineFormStage = (index) => {
    setPipelineStages((current) => current.filter((_, stageIndex) => stageIndex !== index).map((stage, stageIndex) => ({ ...stage, order: stageIndex })));
  };

  const savePipeline = async () => {
    if (!businessId || !modal) return;

    const validationError = validatePipeline();

    if (validationError) {
      setError(validationError);

      await showAuthAlert({
        icon: "warning",
        title: "Validation required",
        text: validationError,
        confirmButtonText: "OK",
      });

      return;
    }

    setSaving(true);
    setError("");

    const payload = {
      name: pipelineForm.name.trim(),
      description: pipelineForm.description?.trim() || null,
      type: pipelineForm.type,
      status: pipelineForm.status,
      isDefault: Boolean(pipelineForm.isDefault),
      stages: pipelineStages.map((stage, index) => ({
        name: stage.name.trim(),
        description: stage.description?.trim() || null,
        probability: Number(stage.probability || 0),
        color: stage.color?.trim() || null,
        isClosed: Boolean(stage.isClosed),
        isWon: Boolean(stage.isWon),
        isActive: Boolean(stage.isActive),
        order: index,
      })),
    };

    try {
      if (modal.mode === "create") {
        await createPipeline(businessId, payload);
      } else {
        await updatePipeline(businessId, modal.item._id, payload);
      }

      setModal(null);
      setSelectedPipeline(null);

      await loadPipelines(1, search);

      await showAuthAlert({
        icon: "success",
        title: modal.mode === "create" ? "Pipeline Created" : "Pipeline Updated",
        text: modal.mode === "create" ? "Pipeline created successfully." : "Pipeline updated successfully.",
        confirmButtonText: "Done",
      });
    } catch (err) {
      const message = getErrorMessage(err, modal.mode === "create" ? "Unable to create the pipeline." : "Unable to update the pipeline.");

      setError(message);

      await showAuthAlert({
        icon: "error",
        title: modal.mode === "create" ? "Unable to create pipeline" : "Unable to update pipeline",
        text: message,
        confirmButtonText: "OK",
      });
    } finally {
      setSaving(false);
    }
  };

  const removePipeline = async (pipeline) => {
    if (!businessId) return;

    const result = await showAuthAlert({
      icon: "warning",
      title: "Delete Pipeline?",
      text: "This pipeline will be deactivated. Are you sure you want to continue?",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (!result?.isConfirmed) return;

    setError("");

    try {
      await deletePipeline(businessId, pipeline._id);

      await loadPipelines(pagination.page || 1, search);

      await showAuthAlert({
        icon: "success",
        title: "Deleted",
        text: "Pipeline deactivated successfully.",
        confirmButtonText: "Done",
      });
    } catch (err) {
      const message = getErrorMessage(err, "Unable to delete the pipeline.");

      setError(message);

      await showAuthAlert({
        icon: "error",
        title: "Unable to delete pipeline",
        text: message,
        confirmButtonText: "OK",
      });
    }
  };

  const openAddStage = (pipeline) => {
    const stages = Array.isArray(pipeline?.stages) ? pipeline.stages : [];

    const nextOrder = stages.length ? Math.max(...stages.map((stage) => Number(stage?.order ?? 0))) + 1 : 0;

    setStageForm({
      ...EMPTY_STAGE_FORM,
      order: nextOrder,
    });

    setSelectedPipeline(pipeline);
    setSelectedStage(null);
    setStageModal({
      mode: "create",
      pipeline,
    });
  };

  const openEditStage = (pipeline, stage) => {
    setStageForm({
      name: stage?.name || "",
      description: stage?.description || "",
      probability: Number(stage?.probability ?? 0),
      color: stage?.color || "",
      isClosed: Boolean(stage?.isClosed),
      isWon: Boolean(stage?.isWon),
      isActive: stage?.isActive !== false,
      order: Number(stage?.order ?? 0),
    });

    setSelectedPipeline(pipeline);
    setSelectedStage(stage);

    setStageModal({
      mode: "edit",
      pipeline,
      stage,
    });
  };

  const saveStage = async () => {
    if (!businessId || !stageModal?.pipeline?._id) return;

    if (!stageForm.name.trim()) {
      await showAuthAlert({
        icon: "warning",
        title: "Validation required",
        text: "Stage name is required.",
        confirmButtonText: "OK",
      });

      return;
    }

    setStageSaving(true);
    setError("");

    const payload = {
      name: stageForm.name.trim(),
      description: stageForm.description?.trim() || null,
      probability: Number(stageForm.probability || 0),
      color: stageForm.color?.trim() || null,
      isClosed: Boolean(stageForm.isClosed),
      isWon: Boolean(stageForm.isWon),
      isActive: Boolean(stageForm.isActive),
      order: Number(stageForm.order || 0),
    };

    try {
      if (stageModal.mode === "create") {
        await addPipelineStage(businessId, stageModal.pipeline._id, payload);
      } else {
        await updatePipelineStage(businessId, stageModal.pipeline._id, stageModal.stage._id, payload);
      }

      setStageModal(null);
      setSelectedStage(null);

      await loadPipelines(pagination.page || 1, search);

      await showAuthAlert({
        icon: "success",
        title: stageModal.mode === "create" ? "Stage Added" : "Stage Updated",
        text: stageModal.mode === "create" ? "Pipeline stage added successfully." : "Pipeline stage updated successfully.",
        confirmButtonText: "Done",
      });
    } catch (err) {
      const message = getErrorMessage(err, stageModal.mode === "create" ? "Unable to add pipeline stage." : "Unable to update pipeline stage.");

      setError(message);

      await showAuthAlert({
        icon: "error",
        title: stageModal.mode === "create" ? "Unable to add stage" : "Unable to update stage",
        text: message,
        confirmButtonText: "OK",
      });
    } finally {
      setStageSaving(false);
    }
  };

  const removeStage = async (pipeline, stage) => {
    if (!businessId || !pipeline?._id || !stage?._id) return;

    const result = await showAuthAlert({
      icon: "warning",
      title: "Delete Stage?",
      text: `Are you sure you want to delete "${stage.name}"?`,
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (!result?.isConfirmed) return;

    setError("");

    try {
      await deletePipelineStage(businessId, pipeline._id, stage._id);

      await loadPipelines(pagination.page || 1, search);

      await showAuthAlert({
        icon: "success",
        title: "Stage Deleted",
        text: "Pipeline stage deleted successfully.",
        confirmButtonText: "Done",
      });
    } catch (err) {
      const message = getErrorMessage(err, "Unable to delete pipeline stage.");

      setError(message);

      await showAuthAlert({
        icon: "error",
        title: "Unable to delete stage",
        text: message,
        confirmButtonText: "OK",
      });
    }
  };

  const clearSearch = () => {
    setSearch("");
    loadPipelines(1, "");
  };

  const clearFilters = () => {
    setSearch("");
    setTypeFilter("");
    setStatusFilter("");
    loadPipelines(1, "");
  };

  return (
    <div className="pipeline-page crm-resource-page">
      <style>{`
      .pipeline-page{width:100%;min-width:0}
        .crm-resource-page{padding:24px 26px 40px}
        .crm-resource-head{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:18px}
        .crm-resource-title{font-size:23px;font-weight:400;margin:0;color:var(--crm-text)}
        .crm-resource-sub{font-size:13px;color:var(--crm-muted);margin:5px 0 0}
        .crm-resource-actions{display:flex;gap:9px;align-items:center}
        .crm-btn{height:38px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:9px;padding:0 13px;display:inline-flex;align-items:center;gap:7px;font-size:13px;font-weight:400;cursor:pointer}
        .crm-btn.primary{background:var(--crm-primary);border-color:var(--crm-primary);color:#fff}
        .crm-btn:hover:not(:disabled){filter:brightness(.98)}
        .crm-btn:disabled{opacity:.55;cursor:not-allowed}

        .pipeline-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;margin-bottom:14px}
        .pipeline-stat{background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:15px;padding:11px 14px;box-shadow:var(--crm-shadow);min-width:0}
        .pipeline-stat-content{display:flex;align-items:center;justify-content:space-between;gap:10px;min-height:70px}
        .pipeline-stat-copy{min-width:0}
        .pipeline-stat-icon{width:36px;height:36px;flex:0 0 36px;border-radius:10px;background:var(--crm-primary-soft);color:var(--crm-primary);display:grid;place-items:center}
        .pipeline-stat-icon.green{background:color-mix(in srgb,var(--crm-success) 11%,transparent);color:var(--crm-success)}
        .pipeline-stat-icon.orange{background:color-mix(in srgb,var(--crm-warning) 12%,transparent);color:var(--crm-warning)}
        .pipeline-stat-icon.success{background:color-mix(in srgb,var(--crm-success) 11%,transparent);color:var(--crm-success)}
        .pipeline-stat-title{font-size:13px;color:var(--crm-muted);font-weight:400;line-height:1.2}
        .pipeline-stat-value{font-size:22px;line-height:1.05;letter-spacing:-.4px;font-weight:400;color:var(--crm-text);margin:5px 0 3px}
        .pipeline-stat-detail{font-size:13px;color:var(--crm-muted);line-height:1.2}

        .pipeline-toolbar{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:14px}
        .pipeline-page .crm-search-wrap{position:relative;width:100%;max-width:460px}
        .pipeline-page .crm-search{width:100%;height:40px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:10px;padding:0 40px}
        .pipeline-page .crm-search::placeholder{color:var(--crm-muted)}
        .pipeline-page .crm-search-icon{position:absolute;left:12px;top:12px;color:var(--crm-muted);width:16px;height:16px;pointer-events:none}
        .pipeline-page .crm-search-clear{position:absolute;right:9px;top:8px;width:24px;height:24px;border:0;border-radius:7px;background:transparent;color:var(--crm-muted);display:grid;place-items:center;cursor:pointer;padding:0}
        .pipeline-page .crm-search-clear:hover{background:var(--crm-surface-2);color:var(--crm-text)}

        .pipeline-filter{height:40px;min-width:145px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:10px;padding:0 11px;font-size:13px;outline:0}
        .pipeline-filter:focus{border-color:var(--crm-primary)}

        .crm-resource-card{border:1px solid var(--crm-border);background:var(--crm-surface);border-radius:14px;overflow:auto;box-shadow:var(--crm-shadow)}
        .crm-table{width:100%;border-collapse:collapse;min-width:980px}
        .crm-table th{background:var(--crm-surface-2);font-size:13px;text-transform:uppercase;letter-spacing:.06em;color:var(--crm-muted);text-align:left;padding:13px 16px;white-space:nowrap}
        .crm-table td{border-top:1px solid var(--crm-border);padding:13px 16px;font-size:13px;color:var(--crm-text);vertical-align:middle}
        .crm-table tbody tr:hover{background:color-mix(in srgb,var(--crm-primary) 3%,transparent)}

        .crm-actions-cell{display:flex;gap:5px;align-items:center}
        .crm-icon-btn{width:30px;height:30px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-muted);border-radius:8px;display:grid;place-items:center;cursor:pointer;padding:0}
        .crm-icon-btn:hover{color:var(--crm-primary);border-color:var(--crm-primary);background:var(--crm-surface-2)}

        .crm-error{white-space:pre-line;margin-bottom:12px;padding:10px 12px;border-radius:9px;background:color-mix(in srgb,var(--crm-danger) 10%,transparent);color:var(--crm-danger);font-size:13px}
        .crm-empty{padding:48px 20px;text-align:center;color:var(--crm-muted);font-size:13px}

        .crm-pagination{display:flex;justify-content:space-between;align-items:center;padding:13px 16px;border-top:1px solid var(--crm-border);font-size:13px;color:var(--crm-muted);gap:12px}
        .crm-resource-title{margin:0;color:var(--crm-text);font-size:28px;line-height:1.15;font-weight:400;letter-spacing:-.5px;}
        .crm-resource-sub{margin:7px 0 0;color:var(--crm-muted);font-size:14px;line-height:1.45;font-weight:400;}
        .pipeline-name-cell{display:flex;align-items:center;gap:9px;min-width:180px}
        .pipeline-name-main{font-weight:400;color:var(--crm-text)}
        .pipeline-name-sub{font-size:13px;color:var(--crm-muted);margin-top:2px}
        .pipeline-dot{width:8px;height:8px;border-radius:50%;background:var(--crm-primary);flex:0 0 auto}
        .pipeline-dot.inactive{background:var(--crm-muted)}

        .pipeline-status{display:inline-flex;align-items:center;padding:4px 8px;border-radius:7px;font-size:13px;font-weight:400}
        .pipeline-status.active{background:color-mix(in srgb,var(--crm-success) 11%,transparent);color:var(--crm-success)}
        .pipeline-status.inactive{background:color-mix(in srgb,var(--crm-muted) 12%,transparent);color:var(--crm-muted)}

        .pipeline-type{font-size:13px;font-weight:400;color:var(--crm-muted);letter-spacing:.04em}

        .pipeline-default{display:inline-flex;align-items:center;padding:4px 8px;border-radius:7px;background:color-mix(in srgb,var(--crm-primary) 10%,transparent);color:var(--crm-primary);font-size:13px;font-weight:400}

        .pipeline-stage-count{font-size:13px;color:var(--crm-text);font-weight:400}

        .crm-modal-backdrop{position:fixed;inset:0;background:rgba(15,23,42,.45);display:grid;place-items:center;padding:20px;z-index:500}
        .crm-modal{width:min(680px,100%);max-height:90vh;overflow:auto;background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:15px;box-shadow:0 25px 70px rgba(0,0,0,.2)}
        .crm-modal.wide{width:min(850px,100%)}
        .crm-modal-head{display:flex;justify-content:space-between;align-items:center;padding:17px 20px;border-bottom:1px solid var(--crm-border);position:sticky;top:0;background:var(--crm-surface);z-index:2}
        .crm-modal-title{margin:0;font-size:16px;font-weight:400;color:var(--crm-text)}
        .crm-modal-close{border:0;background:transparent;color:var(--crm-muted);width:32px;height:32px;display:grid;place-items:center;border-radius:8px;cursor:pointer}
        .crm-modal-close:hover{background:var(--crm-surface-2);color:var(--crm-text)}

        .crm-form{padding:20px;display:grid;grid-template-columns:1fr 1fr;gap:14px}
        .crm-field{display:grid;gap:6px;min-width:0}
        .crm-field.full{grid-column:1/-1}
        .crm-field label{font-size:13px;font-weight:400;color:var(--crm-text)}
        .crm-field input,.crm-field select,.crm-field textarea{width:100%;box-sizing:border-box;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:9px;padding:10px 11px;outline:0;font:inherit}
        .crm-field input::placeholder,.crm-field textarea::placeholder{color:var(--crm-muted)}
        .crm-field input:focus,.crm-field select:focus,.crm-field textarea:focus{border-color:var(--crm-primary)}

        .crm-check-row{display:flex;align-items:center;gap:8px;height:40px}
        .crm-check-row input{width:15px;height:15px;accent-color:var(--crm-primary)}
        .crm-check-row label{margin:0!important}

        .crm-modal-foot{display:flex;justify-content:flex-end;gap:8px;padding:14px 20px;border-top:1px solid var(--crm-border);position:sticky;bottom:0;background:var(--crm-surface)}
        .crm-view-value{color:var(--crm-text);font-size:13px;word-break:break-word;white-space:pre-wrap}

        .pipeline-view-grid{padding:20px;display:grid;grid-template-columns:1fr 1fr;gap:14px}
        .pipeline-view-card{border:1px solid var(--crm-border);border-radius:10px;padding:12px;background:var(--crm-surface-2)}
        .pipeline-view-label{font-size:13px;color:var(--crm-muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:5px}
        .pipeline-view-text{font-size:13px;color:var(--crm-text);font-weight:400}
        .pipeline-view-description{grid-column:1/-1}

        .pipeline-stages-wrap{padding:0 20px 20px}
        .pipeline-stages-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px}
        .pipeline-stages-title{margin:0;font-size:13px;font-weight:400;color:var(--crm-text)}
        .pipeline-stage-list{display:grid;gap:8px}
        .pipeline-stage-row{display:grid;grid-template-columns:32px minmax(150px,1fr) 90px 100px auto;align-items:center;gap:10px;border:1px solid var(--crm-border);border-radius:10px;padding:10px 11px;background:var(--crm-surface)}
        .pipeline-stage-order{color:var(--crm-muted);display:grid;place-items:center}
        .pipeline-stage-info{min-width:0}
        .pipeline-stage-name{font-size:13px;font-weight:400;color:var(--crm-text)}
        .pipeline-stage-desc{font-size:13px;color:var(--crm-muted);margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .pipeline-stage-probability{font-size:13px;color:var(--crm-muted)}
        .pipeline-stage-builder{grid-column:1/-1;border:1px solid var(--crm-border);border-radius:12px;background:var(--crm-surface-2);padding:14px}
        .pipeline-stage-builder-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px}
        .pipeline-stage-builder-title{margin:0;font-size:13px;font-weight:400;color:var(--crm-text)}
        .pipeline-stage-builder-list{display:grid;gap:10px}
        .pipeline-stage-builder-row{border:1px solid var(--crm-border);background:var(--crm-surface);border-radius:10px;padding:11px}
        .pipeline-stage-builder-grid{display:grid;grid-template-columns:minmax(180px,1.2fr) minmax(130px,.8fr) 110px 110px;gap:10px}
        .pipeline-stage-builder-grid .crm-field.full{grid-column:1/-1}
        .pipeline-stage-builder-actions{display:flex;align-items:center;justify-content:space-between;margin-top:9px;gap:10px}
        .pipeline-stage-builder-checks{display:flex;align-items:center;gap:16px;flex-wrap:wrap}
        .pipeline-stage-builder-empty{padding:16px;text-align:center;border:1px dashed var(--crm-border);border-radius:9px;color:var(--crm-muted);font-size:13px}

        @media(max-width:700px){
          .crm-resource-page{padding:18px 14px 30px}
          .pipeline-stats{grid-template-columns:1fr}
          .crm-resource-head{align-items:flex-start;flex-direction:column}
          .crm-resource-actions{width:100%}
          .crm-resource-actions .crm-btn{flex:1;justify-content:center}
          .pipeline-stats{grid-template-columns:repeat(2,minmax(0,1fr))}
          .pipeline-toolbar{align-items:stretch;flex-direction:column}
          .pipeline-page .crm-search-wrap{max-width:none}
          .pipeline-filter{width:100%}
          .crm-form{grid-template-columns:1fr}
          .crm-field.full{grid-column:auto}
          .crm-pagination{align-items:flex-start;flex-direction:column}
          .pipeline-view-grid{grid-template-columns:1fr}
          .pipeline-view-description{grid-column:auto}
          .pipeline-stage-row{grid-template-columns:25px minmax(120px,1fr) auto}
          .pipeline-stage-probability{display:none}
          .pipeline-stage-actions{grid-column:2/-1;justify-content:flex-start}
          .pipeline-stage-builder{grid-column:auto}
          .pipeline-stage-builder-grid{grid-template-columns:1fr}
          .pipeline-stage-builder-grid .crm-field.full{grid-column:auto}
        }
      `}</style>

      <div className="crm-resource-head">
        <div className="crm-resource-heading">
          <h1 className="crm-resource-title">Pipelines</h1>

          <p className="crm-resource-sub">Manage your pipelines and stages directly from the BR30 CRM workspace.</p>
        </div>

        <div className="crm-resource-actions">
          <button type="button" className="crm-btn" onClick={() => loadPipelines(1, search)} disabled={loading}>
            <RefreshCw size={15} />
            Refresh
          </button>

          <button type="button" className="crm-btn primary" onClick={openCreate}>
            <Plus size={15} />
            Add Pipeline
          </button>
        </div>
      </div>

      <div className="pipeline-stats">
        {pipelineStats.map((stat) => {
          const Icon = stat.icon;

          return (
            <article className="pipeline-stat" key={stat.title}>
              <div className="pipeline-stat-content">
                <div className="pipeline-stat-copy">
                  <div className="pipeline-stat-title">{stat.title}</div>
                  <div className="pipeline-stat-value">{stat.value}</div>
                  <div className="pipeline-stat-detail">{stat.detail}</div>
                </div>

                <div className={`pipeline-stat-icon ${stat.tone}`}>
                  <Icon size={18} />
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {(error || businessError) && <div className="crm-error">{error || businessError}</div>}

      <div className="pipeline-toolbar">
        <div className="crm-search-wrap">
          <Search className="crm-search-icon" />

          <input
            className="crm-search"
            value={search}
            onChange={(e) => {
              const value = e.target.value;
              setSearch(value);
              loadPipelines(1, value);
            }}
            placeholder="Search pipelines..."
          />

          {search && (
            <button type="button" className="crm-search-clear" onClick={clearSearch} aria-label="Clear search" title="Clear search">
              <X size={15} />
            </button>
          )}
        </div>

        <select className="pipeline-filter" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="">All Types</option>
          <option value="SALES">Sales</option>
          <option value="SERVICE">Service</option>
          <option value="CUSTOM">Custom</option>
        </select>

        <select className="pipeline-filter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>

        {(search || typeFilter || statusFilter) && (
          <button type="button" className="crm-btn" onClick={clearFilters}>
            Clear Filters
          </button>
        )}
      </div>

      <div className="crm-resource-card">
        <table className="crm-table">
          <thead>
            <tr>
              <th>Pipeline</th>
              <th>Type</th>
              <th>Status</th>
              <th>Default</th>
              <th>Stages</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading || businessLoading ? (
              <tr>
                <td colSpan={7}>
                  <div className="crm-empty">Loading pipelines...</div>
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <div className="crm-empty">No pipelines found.</div>
                </td>
              </tr>
            ) : (
              items.map((pipeline) => {
                const stages = Array.isArray(pipeline?.stages) ? [...pipeline.stages].sort((a, b) => Number(a?.order ?? 0) - Number(b?.order ?? 0)) : [];

                return (
                  <tr key={pipeline._id}>
                    <td>
                      <div className="pipeline-name-cell">
                        <span className={`pipeline-dot ${pipeline.status !== "ACTIVE" ? "inactive" : ""}`} />

                        <div>
                          <div className="pipeline-name-main">{pipeline.name || "—"}</div>

                          <div className="pipeline-name-sub">{pipeline.description || "No description"}</div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="pipeline-type">{pipeline.type || "—"}</span>
                    </td>

                    <td>
                      <span className={`pipeline-status ${pipeline.status === "ACTIVE" ? "active" : "inactive"}`}>{pipeline.status || "—"}</span>
                    </td>

                    <td>{pipeline.isDefault ? <span className="pipeline-default">Default</span> : <span style={{ color: "var(--crm-muted)" }}>—</span>}</td>

                    <td>
                      <span className="pipeline-stage-count">
                        {stages.length} {stages.length === 1 ? "stage" : "stages"}
                      </span>
                    </td>

                    <td>{formatDate(pipeline.createdAt)}</td>

                    <td>
                      <div className="crm-actions-cell">
                        <button type="button" className="crm-icon-btn" onClick={() => openView(pipeline)} title="View" aria-label="View Pipeline">
                          <Eye size={14} />
                        </button>

                        <button type="button" className="crm-icon-btn" onClick={() => openEdit(pipeline)} title="Edit" aria-label="Edit Pipeline">
                          <Pencil size={14} />
                        </button>

                        <button type="button" className="crm-icon-btn" onClick={() => removePipeline(pipeline)} title="Delete" aria-label="Delete Pipeline">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        <div className="crm-pagination">
          <span>{pagination.total ?? items.length} total</span>

          <div className="crm-resource-actions">
            <button type="button" className="crm-btn" disabled={loading || (pagination.page || 1) <= 1} onClick={() => loadPipelines((pagination.page || 1) - 1, search)}>
              Previous
            </button>

            <span>
              Page {pagination.page || 1} / {pagination.totalPages || 1}
            </span>

            <button type="button" className="crm-btn" disabled={loading || (pagination.page || 1) >= (pagination.totalPages || 1)} onClick={() => loadPipelines((pagination.page || 1) + 1, search)}>
              Next
            </button>
          </div>
        </div>
      </div>

      {/* PIPELINE CREATE / EDIT / VIEW MODAL */}
      {modal && (
        <div
          className="crm-modal-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !saving && !stageSaving) {
              setModal(null);
            }
          }}>
          <div className="crm-modal wide">
            <div className="crm-modal-head">
              <h2 className="crm-modal-title">{modal.mode === "create" ? "Add Pipeline" : modal.mode === "edit" ? "Edit Pipeline" : "Pipeline Details"}</h2>

              <button type="button" className="crm-modal-close" onClick={() => !saving && !stageSaving && setModal(null)} disabled={saving || stageSaving} aria-label="Close">
                <X size={17} />
              </button>
            </div>

            {modal.mode === "view" ? (
              <>
                <div className="pipeline-view-grid">
                  <div className="pipeline-view-card">
                    <div className="pipeline-view-label">Pipeline</div>
                    <div className="pipeline-view-text">{modal.item?.name || "—"}</div>
                  </div>

                  <div className="pipeline-view-card">
                    <div className="pipeline-view-label">Type</div>
                    <div className="pipeline-view-text">{modal.item?.type || "—"}</div>
                  </div>

                  <div className="pipeline-view-card">
                    <div className="pipeline-view-label">Status</div>
                    <div className="pipeline-view-text">{modal.item?.status || "—"}</div>
                  </div>

                  <div className="pipeline-view-card">
                    <div className="pipeline-view-label">Default</div>
                    <div className="pipeline-view-text">{modal.item?.isDefault ? "Yes" : "No"}</div>
                  </div>

                  <div className="pipeline-view-card pipeline-view-description">
                    <div className="pipeline-view-label">Description</div>
                    <div className="pipeline-view-text">{modal.item?.description || "—"}</div>
                  </div>
                </div>

                <div className="pipeline-stages-wrap">
                  <div className="pipeline-stages-head">
                    <h3 className="pipeline-stages-title">Pipeline Stages</h3>

                    <button type="button" className="crm-btn primary" onClick={() => openAddStage(modal.item)}>
                      <Plus size={14} />
                      Add Stage
                    </button>
                  </div>

                  <div className="pipeline-stage-list">
                    {Array.isArray(modal.item?.stages) && modal.item.stages.length ? (
                      [...modal.item.stages]
                        .sort((a, b) => Number(a?.order ?? 0) - Number(b?.order ?? 0))
                        .map((stage, index) => (
                          <div className="pipeline-stage-row" key={stage._id || index}>
                            <div className="pipeline-stage-order">
                              <GripVertical size={14} />
                            </div>

                            <div className="pipeline-stage-info">
                              <div className="pipeline-stage-name">
                                <PipelineStageBadge stage={stage} />
                              </div>

                              <div className="pipeline-stage-desc">{stage.description || "No description"}</div>
                            </div>

                            <div className="pipeline-stage-probability">{Number(stage.probability || 0)}%</div>

                            <div>{stage.isWon ? <span className="pipeline-default">Won</span> : stage.isClosed ? <span className="pipeline-status inactive">Closed</span> : <span className="pipeline-status active">Open</span>}</div>

                            <div className="pipeline-stage-actions">
                              <button type="button" className="crm-icon-btn" onClick={() => openEditStage(modal.item, stage)} title="Edit Stage" aria-label="Edit Stage">
                                <Pencil size={13} />
                              </button>

                              <button type="button" className="crm-icon-btn" onClick={() => removeStage(modal.item, stage)} title="Delete Stage" aria-label="Delete Stage">
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        ))
                    ) : (
                      <div className="crm-empty">No stages found for this pipeline.</div>
                    )}
                  </div>
                </div>

                <div className="crm-modal-foot">
                  <button type="button" className="crm-btn" onClick={() => setModal(null)}>
                    Close
                  </button>

                  <button type="button" className="crm-btn primary" onClick={() => openEdit(modal.item)}>
                    <Pencil size={14} />
                    Edit Pipeline
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="crm-form">
                  <div className="crm-field">
                    <label>Pipeline name *</label>

                    <input
                      type="text"
                      value={pipelineForm.name}
                      onChange={(e) =>
                        setPipelineForm((current) => ({
                          ...current,
                          name: e.target.value,
                        }))
                      }
                      placeholder="Pipeline name"
                    />
                  </div>

                  <div className="crm-field">
                    <label>Type</label>

                    <select
                      value={pipelineForm.type}
                      onChange={(e) =>
                        setPipelineForm((current) => ({
                          ...current,
                          type: e.target.value,
                        }))
                      }>
                      <option value="SALES">SALES</option>
                      <option value="SERVICE">SERVICE</option>
                      <option value="CUSTOM">CUSTOM</option>
                    </select>
                  </div>

                  <div className="crm-field">
                    <label>Status</label>

                    <select
                      value={pipelineForm.status}
                      onChange={(e) =>
                        setPipelineForm((current) => ({
                          ...current,
                          status: e.target.value,
                        }))
                      }>
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="INACTIVE">INACTIVE</option>
                    </select>
                  </div>

                  <div className="crm-field">
                    <label>Default pipeline</label>

                    <div className="crm-check-row">
                      <input
                        id="pipeline-default"
                        type="checkbox"
                        checked={Boolean(pipelineForm.isDefault)}
                        onChange={(e) =>
                          setPipelineForm((current) => ({
                            ...current,
                            isDefault: e.target.checked,
                          }))
                        }
                      />

                      <label htmlFor="pipeline-default">Set as default pipeline</label>
                    </div>
                  </div>

                  <div className="crm-field full">
                    <label>Description</label>

                    <textarea
                      rows={4}
                      value={pipelineForm.description}
                      onChange={(e) =>
                        setPipelineForm((current) => ({
                          ...current,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Pipeline description"
                    />
                  </div>

                  <div className="pipeline-stage-builder">
                    <div className="pipeline-stage-builder-head">
                      <div>
                        <h3 className="pipeline-stage-builder-title">Pipeline Stages</h3>
                        <div className="pipeline-name-sub">Add the stages that will be available when creating Deals.</div>
                      </div>
                      <button type="button" className="crm-btn primary" onClick={addPipelineFormStage} disabled={saving}>
                        <Plus size={14} />
                        Add Stage
                      </button>
                    </div>

                    <div className="pipeline-stage-builder-list">
                      {pipelineStages.length ? (
                        pipelineStages.map((stage, index) => (
                          <div className="pipeline-stage-builder-row" key={`pipeline-form-stage-${index}`}>
                            <div className="pipeline-stage-builder-grid">
                              <div className="crm-field">
                                <label>Stage name *</label>
                                <input type="text" value={stage.name} onChange={(e) => updatePipelineFormStage(index, "name", e.target.value)} placeholder="e.g. New Lead" />
                              </div>

                              <div className="crm-field">
                                <label>Probability %</label>
                                <input type="number" min="0" max="100" value={stage.probability} onChange={(e) => updatePipelineFormStage(index, "probability", e.target.value)} />
                              </div>

                              <div className="crm-field">
                                <label>Color</label>
                                <input type="text" value={stage.color} onChange={(e) => updatePipelineFormStage(index, "color", e.target.value)} placeholder="#3B82F6" />
                              </div>

                              <div className="crm-field">
                                <label>Order</label>
                                <input type="number" min="0" value={index} readOnly />
                              </div>

                              <div className="crm-field full">
                                <label>Description</label>
                                <textarea rows={2} value={stage.description} onChange={(e) => updatePipelineFormStage(index, "description", e.target.value)} placeholder="Stage description" />
                              </div>
                            </div>

                            <div className="pipeline-stage-builder-actions">
                              <div className="pipeline-stage-builder-checks">
                                <div className="crm-check-row">
                                  <input id={`pipeline-stage-active-${index}`} type="checkbox" checked={Boolean(stage.isActive)} onChange={(e) => updatePipelineFormStage(index, "isActive", e.target.checked)} />
                                  <label htmlFor={`pipeline-stage-active-${index}`}>Active</label>
                                </div>

                                <div className="crm-check-row">
                                  <input id={`pipeline-stage-closed-${index}`} type="checkbox" checked={Boolean(stage.isClosed)} onChange={(e) => updatePipelineFormStage(index, "isClosed", e.target.checked)} />
                                  <label htmlFor={`pipeline-stage-closed-${index}`}>Closed</label>
                                </div>

                                <div className="crm-check-row">
                                  <input
                                    id={`pipeline-stage-won-${index}`}
                                    type="checkbox"
                                    checked={Boolean(stage.isWon)}
                                    onChange={(e) => setPipelineStages((current) => current.map((item, stageIndex) => (stageIndex === index ? { ...item, isWon: e.target.checked, isClosed: e.target.checked ? true : item.isClosed } : item)))}
                                  />
                                  <label htmlFor={`pipeline-stage-won-${index}`}>Won</label>
                                </div>
                              </div>

                              <button type="button" className="crm-icon-btn" onClick={() => removePipelineFormStage(index)} disabled={saving} title="Remove stage" aria-label="Remove stage">
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="pipeline-stage-builder-empty">
                          No stages added yet. Click <strong>Add Stage</strong> to create the first stage.
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="crm-modal-foot">
                  <button type="button" className="crm-btn" onClick={() => !saving && setModal(null)} disabled={saving}>
                    Cancel
                  </button>

                  <button type="button" className="crm-btn primary" disabled={saving} onClick={savePipeline}>
                    {saving ? "Saving..." : modal.mode === "create" ? "Create Pipeline" : "Save changes"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* STAGE CREATE / EDIT MODAL */}
      {stageModal && (
        <div
          className="crm-modal-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !stageSaving) {
              setStageModal(null);
            }
          }}>
          <div className="crm-modal">
            <div className="crm-modal-head">
              <h2 className="crm-modal-title">{stageModal.mode === "create" ? "Add Pipeline Stage" : "Edit Pipeline Stage"}</h2>

              <button type="button" className="crm-modal-close" onClick={() => !stageSaving && setStageModal(null)} disabled={stageSaving} aria-label="Close">
                <X size={17} />
              </button>
            </div>

            <div className="crm-form">
              <div className="crm-field">
                <label>Stage name *</label>

                <input
                  type="text"
                  value={stageForm.name}
                  onChange={(e) =>
                    setStageForm((current) => ({
                      ...current,
                      name: e.target.value,
                    }))
                  }
                  placeholder="Stage name"
                />
              </div>

              <div className="crm-field">
                <label>Probability %</label>

                <input
                  type="number"
                  min="0"
                  max="100"
                  value={stageForm.probability}
                  onChange={(e) =>
                    setStageForm((current) => ({
                      ...current,
                      probability: e.target.value,
                    }))
                  }
                  placeholder="0"
                />
              </div>

              <div className="crm-field">
                <label>Color</label>

                <input
                  type="text"
                  value={stageForm.color}
                  onChange={(e) =>
                    setStageForm((current) => ({
                      ...current,
                      color: e.target.value,
                    }))
                  }
                  placeholder="e.g. #3B82F6"
                />
              </div>

              <div className="crm-field">
                <label>Order</label>

                <input
                  type="number"
                  min="0"
                  value={stageForm.order}
                  onChange={(e) =>
                    setStageForm((current) => ({
                      ...current,
                      order: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="crm-field full">
                <label>Description</label>

                <textarea
                  rows={4}
                  value={stageForm.description}
                  onChange={(e) =>
                    setStageForm((current) => ({
                      ...current,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Stage description"
                />
              </div>

              <div className="crm-field">
                <label>Stage status</label>

                <div className="crm-check-row">
                  <input
                    id="stage-active"
                    type="checkbox"
                    checked={Boolean(stageForm.isActive)}
                    onChange={(e) =>
                      setStageForm((current) => ({
                        ...current,
                        isActive: e.target.checked,
                      }))
                    }
                  />

                  <label htmlFor="stage-active">Active stage</label>
                </div>
              </div>

              <div className="crm-field">
                <label>Closed / Won</label>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 18,
                    minHeight: 40,
                  }}>
                  <div className="crm-check-row">
                    <input
                      id="stage-closed"
                      type="checkbox"
                      checked={Boolean(stageForm.isClosed)}
                      onChange={(e) =>
                        setStageForm((current) => ({
                          ...current,
                          isClosed: e.target.checked,
                        }))
                      }
                    />

                    <label htmlFor="stage-closed">Closed</label>
                  </div>

                  <div className="crm-check-row">
                    <input
                      id="stage-won"
                      type="checkbox"
                      checked={Boolean(stageForm.isWon)}
                      onChange={(e) =>
                        setStageForm((current) => ({
                          ...current,
                          isWon: e.target.checked,
                        }))
                      }
                    />

                    <label htmlFor="stage-won">Won</label>
                  </div>
                </div>
              </div>
            </div>

            <div className="crm-modal-foot">
              <button type="button" className="crm-btn" onClick={() => !stageSaving && setStageModal(null)} disabled={stageSaving}>
                Cancel
              </button>

              <button type="button" className="crm-btn primary" disabled={stageSaving} onClick={saveStage}>
                {stageSaving ? "Saving..." : stageModal.mode === "create" ? "Add Stage" : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
