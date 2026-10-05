import { createLead, deleteLead, getLeads, updateLead } from "../../api/lead.api";
import { createContact, deleteContact, getContacts, updateContact } from "../../api/contact.api";
import { createCompany, deleteCompany, getCompanies, updateCompany } from "../../api/company.api";
import { createDeal, deleteDeal, getDeals, updateDeal } from "../../api/deal.api";
import { createTask, deleteTask, getTasks, updateTask } from "../../api/task.api";
import { createActivity, deleteActivity, getActivities, updateActivity } from "../../api/activity.api";
import { createPipeline, deletePipeline, getPipelines, updatePipeline } from "../../api/pipeline.api";

const text = (name, label, extra = {}) => ({ name, label, ...extra });
const select = (name, label, options, extra = {}) => ({ name, label, type: "select", options, ...extra });

export const leadsConfig = {
  title: "Leads",
  singular: "Lead",
  api: { list: getLeads, create: createLead, update: updateLead, remove: deleteLead },
  fields: [
    text("firstName", "First name"),
    text("lastName", "Last name"),
    text("name", "Display name"),
    text("email", "Email", { type: "email" }),
    text("phone", "Phone"),
    text("companyName", "Company"),
    text("jobTitle", "Job title"),
    text("source", "Source", { defaultValue: "Website" }),
    select(
      "status",
      "Status",
      ["NEW", "CONTACTED", "QUALIFIED", "UNQUALIFIED", "CONVERTED", "LOST"].map((v) => ({ value: v, label: v })),
      { defaultValue: "NEW" }
    ),
    select(
      "rating",
      "Rating",
      ["HOT", "WARM", "COLD"].map((v) => ({ value: v, label: v })),
      { defaultValue: "WARM" }
    ),
    text("description", "Description", { type: "textarea", full: true }),
  ],
  columns: [
    { key: "name", label: "Name", render: (r) => r.name || [r.firstName, r.lastName].filter(Boolean).join(" ") || "—" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "status", label: "Status" },
    { key: "rating", label: "Rating" },
  ],
};
export const contactsConfig = {
  title: "Contacts",
  singular: "Contact",
  api: { list: getContacts, create: createContact, update: updateContact, remove: deleteContact },
  fields: [
    text("firstName", "First name", { required: true }),
    text("lastName", "Last name"),
    text("email", "Email", { type: "email" }),
    text("phone", "Phone"),
    text("alternatePhone", "Alternate phone"),
    text("jobTitle", "Job title"),
    text("companyId", "Company ID"),
    text("source", "Source", { defaultValue: "Website" }),
    select(
      "status",
      "Status",
      [
        { value: "ACTIVE", label: "ACTIVE" },
        { value: "INACTIVE", label: "INACTIVE" },
      ],
      { defaultValue: "ACTIVE" }
    ),
    select(
      "lifecycleStage",
      "Lifecycle stage",
      ["CONTACT", "CUSTOMER", "REPEAT_CUSTOMER", "OTHER"].map((v) => ({ value: v, label: v })),
      { defaultValue: "CONTACT" }
    ),
    text("description", "Description", { type: "textarea", full: true }),
  ],
  columns: [
    { key: "firstName", label: "Name", render: (r) => [r.firstName, r.lastName].filter(Boolean).join(" ") },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "status", label: "Status" },
    { key: "lifecycleStage", label: "Lifecycle" },
  ],
};

export const companiesConfig = {
  title: "Companies",
  singular: "Company",
  api: { list: getCompanies, create: createCompany, update: updateCompany, remove: deleteCompany },
  fields: [
    text("name", "Company name", { required: true }),
    text("legalName", "Legal name"),
    text("email", "Email", { type: "email" }),
    text("phone", "Phone"),
    text("website", "Website"),
    text("industry", "Industry"),
    text("companySize", "Company size"),
    text("source", "Source", { defaultValue: "Website" }),
    select(
      "status",
      "Status",
      [
        { value: "ACTIVE", label: "ACTIVE" },
        { value: "INACTIVE", label: "INACTIVE" },
      ],
      { defaultValue: "ACTIVE" }
    ),
    text("description", "Description", { type: "textarea", full: true }),
  ],
  columns: [
    { key: "name", label: "Company" },
    { key: "industry", label: "Industry" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "status", label: "Status" },
  ],
};
export const dealsConfig = {
  title: "Deals",
  singular: "Deal",
  api: { list: getDeals, create: createDeal, update: updateDeal, remove: deleteDeal },
  fields: [
    text("pipelineId", "Pipeline ID", { required: true }),
    text("stageId", "Stage ID", { required: true }),
    text("name", "Deal name", { required: true }),
    text("contactId", "Contact ID"),
    text("companyId", "Company ID"),
    text("value", "Value", { type: "number", defaultValue: 0 }),
    text("currency", "Currency", { defaultValue: "INR" }),
    text("expectedCloseDate", "Expected close date", { type: "date" }),
    select(
      "status",
      "Status",
      ["OPEN", "WON", "LOST"].map((v) => ({ value: v, label: v })),
      { defaultValue: "OPEN" }
    ),
    text("probability", "Probability %", { type: "number", defaultValue: 0 }),
    text("source", "Source"),
    text("description", "Description", { type: "textarea", full: true }),
  ],
  prepare: (f) => ({ ...f, value: Number(f.value || 0), probability: Number(f.probability || 0), expectedCloseDate: f.expectedCloseDate || null }),
  columns: [
    { key: "name", label: "Deal" },
    { key: "value", label: "Value", render: (r) => `${r.currency || "INR"} ${Number(r.value || 0).toLocaleString("en-IN")}` },
    { key: "status", label: "Status" },
    { key: "probability", label: "Probability" },
    { key: "stageId", label: "Stage" },
  ],
};
export const tasksConfig = {
  title: "Tasks",
  singular: "Task",

  api: {
    list: getTasks,
    create: createTask,
    update: updateTask,
    remove: deleteTask,
  },

  fields: [
    text("title", "Task title", {
      required: true,
    }),

    text("description", "Description", {
      type: "textarea",
      full: true,
    }),

    select(
      "status",
      "Status",
      ["TODO", "IN_PROGRESS", "COMPLETED", "CANCELLED"].map((v) => ({
        value: v,
        label: v,
      })),
      {
        defaultValue: "TODO",
      }
    ),

    select(
      "priority",
      "Priority",
      ["LOW", "MEDIUM", "HIGH", "URGENT"].map((v) => ({
        value: v,
        label: v,
      })),
      {
        defaultValue: "MEDIUM",
      }
    ),

    text("dueDate", "Due date", {
      type: "datetime-local",
    }),

    text("assignedTo", "Assigned user ID"),

    select(
      "relatedType",
      "Related type",
      [
        { value: "", label: "None" },
        { value: "LEAD", label: "Lead" },
        { value: "CONTACT", label: "Contact" },
        { value: "COMPANY", label: "Company" },
        { value: "DEAL", label: "Deal" },
      ],
      {
        defaultValue: "",
      }
    ),

    text("relatedId", "Related record ID"),

    text("tags", "Tags", {
      placeholder: "Tag IDs separated by comma",
    }),
  ],

  prepare: (f) => ({
    ...f,

    dueDate: f.dueDate || null,

    assignedTo: f.assignedTo || null,

    relatedTo:
      f.relatedType && f.relatedId
        ? {
            type: f.relatedType,
            id: f.relatedId,
          }
        : null,

    tags: Array.isArray(f.tags)
      ? f.tags
      : String(f.tags || "")
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean),
  }),

  columns: [
    {
      key: "title",
      label: "Task",
    },

    {
      key: "status",
      label: "Status",
    },

    {
      key: "priority",
      label: "Priority",
    },

    {
      key: "dueDate",
      label: "Due",
      render: (r) =>
        r.dueDate
          ? new Date(r.dueDate).toLocaleString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "—",
    },

    {
      key: "assignedTo",
      label: "Assigned",
      render: (r) => r.assignedTo?.name || r.assignedTo?.email || (typeof r.assignedTo === "string" ? r.assignedTo : "Unassigned"),
    },

    {
      key: "relatedTo",
      label: "Related",
      render: (r) => {
        if (!r.relatedTo?.type && !r.relatedTo?.id) return "—";

        const typeMap = {
          LEAD: "Lead",
          CONTACT: "Contact",
          COMPANY: "Company",
          DEAL: "Deal",
        };

        return typeMap[r.relatedTo?.type] || r.relatedTo?.type || "Related";
      },
    },
  ],
};
export const activitiesConfig = {
  title: "Activities",
  singular: "Activity",
  api: { list: getActivities, create: createActivity, update: updateActivity, remove: deleteActivity },
  fields: [
    select(
      "type",
      "Type",
      ["CALL", "EMAIL", "MEETING", "TASK", "NOTE", "SMS", "WHATSAPP", "FOLLOW_UP", "OTHER"].map((v) => ({ value: v, label: v })),
      { defaultValue: "CALL" }
    ),
    text("subject", "Subject", { required: true }),
    text("description", "Description", { type: "textarea", full: true }),
    select(
      "status",
      "Status",
      ["PLANNED", "IN_PROGRESS", "COMPLETED", "CANCELLED"].map((v) => ({ value: v, label: v })),
      { defaultValue: "PLANNED" }
    ),
    select(
      "priority",
      "Priority",
      ["LOW", "MEDIUM", "HIGH", "URGENT"].map((v) => ({ value: v, label: v })),
      { defaultValue: "MEDIUM" }
    ),
    text("dueAt", "Due", { type: "datetime-local" }),
    text("contactId", "Contact ID"),
    text("companyId", "Company ID"),
    text("leadId", "Lead ID"),
    text("dealId", "Deal ID"),
    text("location", "Location"),
  ],
  columns: [
    { key: "subject", label: "Subject" },
    { key: "type", label: "Type" },
    { key: "status", label: "Status" },
    { key: "priority", label: "Priority" },
    { key: "dueAt", label: "Due" },
  ],
};
export const pipelinesConfig = {
  title: "Pipelines",
  singular: "Pipeline",
  api: { list: getPipelines, create: createPipeline, update: updatePipeline, remove: deletePipeline },
  fields: [
    text("name", "Pipeline name", { required: true }),
    text("description", "Description", { type: "textarea", full: true }),
    select(
      "type",
      "Type",
      ["SALES", "SERVICE", "CUSTOM"].map((v) => ({ value: v, label: v })),
      { defaultValue: "SALES" }
    ),
    select(
      "status",
      "Status",
      [
        { value: "ACTIVE", label: "ACTIVE" },
        { value: "INACTIVE", label: "INACTIVE" },
      ],
      { defaultValue: "ACTIVE" }
    ),
    select(
      "isDefault",
      "Default pipeline",
      [
        { value: "false", label: "No" },
        { value: "true", label: "Yes" },
      ],
      { defaultValue: "false" }
    ),
  ],
  prepare: (f) => ({ ...f, isDefault: f.isDefault === "true" }),
  columns: [
    { key: "name", label: "Pipeline" },
    { key: "type", label: "Type" },
    { key: "status", label: "Status" },
    { key: "isDefault", label: "Default", render: (r) => (r.isDefault ? "Yes" : "No") },
    { key: "stages", label: "Stages", render: (r) => (Array.isArray(r.stages) ? r.stages.length : 0) },
  ],
};
