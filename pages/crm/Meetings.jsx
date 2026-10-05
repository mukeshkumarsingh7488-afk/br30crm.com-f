import { CalendarDays, Plus, Search, X, Pencil, Trash2, CheckCircle2, Clock3, MapPin, Video, Users, ChevronLeft, ChevronRight, RefreshCw, MoreVertical, UserPlus, Building2, BriefcaseBusiness, Contact, Link2, Bell } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import useBusiness from "../../hooks/useBusiness";
import { showAuthAlert } from "../../components/auth/authAlert";

/* ============================================================
   MEETINGS PAGE STYLES
   Injected into <head> so the page styles are applied reliably
   even when the global CRM stylesheet is loaded separately.
   ============================================================ */
const MEETINGS_PAGE_CSS = String.raw`
        .br30-meet-crm-resource-page{padding:24px 26px 40px}
        .br30-meet-crm-resource-head{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:18px}
        .br30-meet-crm-resource-title{font-size:23px;font-weight:400;margin:0;color:var(--crm-text)}
        .br30-meet-crm-resource-sub{font-size:13px;color:var(--crm-muted);margin:5px 0 0}
        .br30-meet-crm-resource-actions{display:flex;gap:9px;align-items:center}
        .br30-meet-crm-btn{height:38px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:9px;padding:0 13px;display:inline-flex;align-items:center;gap:7px;font-size:13px;font-weight:400;cursor:pointer}
        .br30-meet-crm-btn.br30-meet-primary{background:var(--crm-primary);border-color:var(--crm-primary);color:#fff}
        .br30-meet-crm-btn:hover:not(:disabled){filter:brightness(.98)}
        .br30-meet-crm-btn:disabled{opacity:.55;cursor:not-allowed}
        .br30-meet-crm-search-wrap{position:relative;width:100%;max-width:460px}
        .br30-meet-crm-search{width:100%;height:40px;box-sizing:border-box;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:10px;padding:0 40px}
        .br30-meet-crm-search::placeholder{color:var(--crm-muted)}
        .br30-meet-crm-search-icon{position:absolute;left:12px;top:12px;color:var(--crm-muted);width:16px;height:16px;pointer-events:none}
        .br30-meet-crm-search-clear{position:absolute;right:9px;top:8px;width:24px;height:24px;border:0;border-radius:7px;background:transparent;color:var(--crm-muted);display:grid;place-items:center;cursor:pointer;padding:0}
        .br30-meet-crm-search-clear:hover{background:var(--crm-surface-2);color:var(--crm-text)}
        .br30-meet-crm-resource-card{border:1px solid var(--crm-border);background:var(--crm-surface);border-radius:14px;overflow:hidden;box-shadow:var(--crm-shadow,none)}
        .br30-meet-crm-table{width:100%;border-collapse:collapse;min-width:760px}
        .br30-meet-crm-table th{background:var(--crm-surface-2);font-size:13px;text-transform:uppercase;letter-spacing:.06em;color:var(--crm-muted);text-align:left;padding:13px 16px;white-space:nowrap}
        .br30-meet-crm-table td{border-top:1px solid var(--crm-border);padding:13px 16px;font-size:13px;color:var(--crm-text);vertical-align:middle}
        .br30-meet-crm-table tbody tr:hover{background:color-mix(in srgb,var(--crm-primary) 3%,transparent)}
        .br30-meet-crm-actions-cell{display:flex;gap:5px;align-items:center}
        .br30-meet-crm-icon-btn{width:30px;height:30px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-muted);border-radius:8px;display:grid;place-items:center;cursor:pointer;padding:0}
        .br30-meet-crm-icon-btn:hover{color:var(--crm-primary);border-color:var(--crm-primary);background:var(--crm-surface-2)}
        .br30-meet-crm-error{white-space:pre-line;margin-bottom:12px;padding:10px 12px;border-radius:9px;background:color-mix(in srgb,var(--crm-danger) 10%,transparent);color:var(--crm-danger);font-size:13px}
        .br30-meet-crm-pagination{display:flex;justify-content:space-between;align-items:center;padding:13px 16px;border-top:1px solid var(--crm-border);font-size:13px;color:var(--crm-muted);gap:12px}
        .br30-meet-meetings-stats-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:14px;margin:20px 0}
        .br30-meet-meetings-stat-card{display:flex;align-items:center;gap:12px;border:1px solid var(--crm-border);background:var(--crm-surface);border-radius:12px;padding:16px}
        .br30-meet-meetings-stat-icon{width:38px;height:38px;min-width:38px;display:flex;align-items:center;justify-content:center;border-radius:9px;border:1px solid var(--crm-border);color:var(--crm-primary)}
        .br30-meet-meetings-stat-card span{display:block;color:var(--crm-muted);font-size:13px;margin-bottom:4px}
        .br30-meet-meetings-stat-card strong{display:block;color:var(--crm-text);font-size:20px;line-height:1.1}
        .br30-meet-meetings-toolbar{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:16px}
        .br30-meet-meetings-search{height:40px;min-width:260px;flex:1;display:flex;align-items:center;gap:8px;padding:0 10px;border:1px solid var(--crm-border);border-radius:8px;background:var(--crm-surface);color:var(--crm-muted)}
        .br30-meet-meetings-search input{width:100%;height:100%;border:0;outline:0;background:transparent;color:var(--crm-text)}
        .br30-meet-meetings-clear-btn{border:0;background:transparent;color:var(--crm-muted);display:flex;align-items:center;justify-content:center;padding:3px;cursor:pointer}
        .br30-meet-meetings-card{border:1px solid var(--crm-border);background:var(--crm-surface);border-radius:12px;overflow:visible}
        .br30-meet-meetings-table-wrap{width:100%;overflow-x:auto}
        .br30-meet-meetings-table{width:100%;border-collapse:collapse;min-width:1180px}
        .br30-meet-meetings-table th{padding:13px 15px;text-align:left;border-bottom:1px solid var(--crm-border);color:var(--crm-muted);font-size:13px;font-weight:400;white-space:nowrap}
        .br30-meet-meetings-table td{padding:14px 15px;border-bottom:1px solid var(--crm-border);color:var(--crm-text);vertical-align:middle}
        .br30-meet-meetings-table tbody tr:last-child td{border-bottom:0}
        .br30-meet-meeting-title{font-size:14px;font-weight:400;color:var(--crm-text);max-width:260px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .br30-meet-meeting-description{font-size:13px;color:var(--crm-muted);max-width:260px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:4px}
        .br30-meet-meeting-date-cell strong,.br30-meet-meeting-person-cell strong{display:block;font-size:13px;font-weight:400}
        .br30-meet-meeting-date-cell span,.br30-meet-meeting-person-cell span{display:block;font-size:13px;color:var(--crm-muted);margin-top:3px}
        .br30-meet-meeting-status-badge{display:inline-flex;align-items:center;padding:5px 9px;border-radius:999px;font-size:13px;font-weight:400;border:1px solid var(--crm-border)}
        .br30-meet-meeting-status-badge.br30-meet-scheduled{color:var(--crm-primary)}
        .br30-meet-meeting-status-badge.br30-meet-in-progress{color:var(--crm-primary)}
        .br30-meet-meeting-status-badge.br30-meet-completed{color:#15803d}
        .br30-meet-meeting-status-badge.br30-meet-cancelled,.br30-meet-meeting-status-badge.br30-meet-no-show{color:#b91c1c}
        .br30-meet-meeting-location-link,.br30-meet-meeting-location-text{display:inline-flex;align-items:center;gap:5px;color:var(--crm-text);font-size:13px;text-decoration:none}
        .br30-meet-meeting-location-link:hover{color:var(--crm-primary)}
        .br30-meet-meeting-muted{color:var(--crm-muted)}
        .br30-meet-meeting-attendees-cell{display:inline-flex;align-items:center;gap:6px;color:var(--crm-muted);font-size:13px}
        .br30-meet-meeting-related-cell{display:flex;flex-direction:column;gap:3px;min-width:120px}
        .br30-meet-meeting-related-cell span{font-size:13px;text-transform:uppercase;letter-spacing:.04em;color:var(--crm-muted)}
        .br30-meet-meeting-related-cell strong{font-size:13px;color:var(--crm-text);font-weight:400;max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .br30-meet-meetings-actions-head{text-align:right!important}
        .br30-meet-meeting-actions{position:relative;display:flex;justify-content:flex-end}
        .br30-meet-meeting-action-menu{position:absolute;right:0;top:38px;z-index:30;min-width:155px;padding:5px;border:1px solid var(--crm-border);border-radius:9px;background:var(--crm-surface);box-shadow:0 10px 30px rgba(0,0,0,.12)}
        .br30-meet-meeting-action-menu button{width:100%;display:flex;align-items:center;gap:8px;padding:9px 10px;border:0;background:transparent;border-radius:6px;color:var(--crm-text);font-size:13px;text-align:left;cursor:pointer}
        .br30-meet-meeting-action-menu button:hover{background:var(--crm-border)}
        .br30-meet-meeting-action-menu button.br30-meet-danger{color:#dc2626}
        .br30-meet-crm-primary-btn,.br30-meet-crm-secondary-btn{height:38px;border:1px solid var(--crm-border);border-radius:9px;padding:0 14px;display:inline-flex;align-items:center;justify-content:center;gap:7px;font-size:13px;font-weight:400;line-height:1;cursor:pointer;transition:background .15s ease,border-color .15s ease,color .15s ease,filter .15s ease;box-sizing:border-box;font-family:inherit;white-space:nowrap}
        .br30-meet-crm-primary-btn{background:var(--crm-primary);border-color:var(--crm-primary);color:#fff}
        .br30-meet-crm-primary-btn:hover:not(:disabled){filter:brightness(.96)}
        .br30-meet-crm-secondary-btn{background:var(--crm-surface);border-color:var(--crm-border);color:var(--crm-text)}
        .br30-meet-crm-secondary-btn:hover:not(:disabled){background:var(--crm-surface-2);border-color:var(--crm-primary);color:var(--crm-primary)}
        .br30-meet-crm-primary-btn:disabled,.br30-meet-crm-secondary-btn:disabled{opacity:.55;cursor:not-allowed}
        .br30-meet-crm-empty-state{width:100%;min-height:260px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:40px 24px;box-sizing:border-box;}
        .br30-meet-crm-empty-state h2{margin:0 0 10px;text-align:center;}
        .br30-meet-crm-empty-state p{margin:0 0 20px;text-align:center;}
        .br30-meet-crm-empty-state button{margin:0 auto;}
        .br30-meet-meetings-table-wrap{background:var(--crm-surface);border-radius:12px;overflow:auto}
        .br30-meet-meetings-table{display:table;width:100%;border-collapse:separate;border-spacing:0;min-width:1180px;background:var(--crm-surface)}
        .br30-meet-meetings-table thead{background:var(--crm-surface-2)}
        .br30-meet-meetings-table thead tr{background:var(--crm-surface-2)}
        .br30-meet-meetings-table thead th{background:var(--crm-surface-2)!important;color:var(--crm-muted)!important;border-bottom:1px solid var(--crm-border)!important;padding:13px 16px!important;font-size:13px!important;font-weight:400!important;text-transform:uppercase;letter-spacing:.06em;text-align:left;white-space:nowrap;line-height:1.2}
        .br30-meet-meetings-table tbody{background:var(--crm-surface)}
        .br30-meet-meetings-table tbody tr{background:var(--crm-surface);transition:background .15s ease}
        .br30-meet-meetings-table tbody tr:hover{background:var(--crm-surface-2)!important}
        .br30-meet-meetings-table tbody td{background:transparent!important;color:var(--crm-text)!important;border-bottom:1px solid var(--crm-border)!important;border-top:0!important;padding:13px 16px!important;font-size:13px!important;vertical-align:middle;line-height:1.35}
        .br30-meet-meetings-table tbody tr:last-child td{border-bottom:0!important}
        .br30-meet-meetings-table th:first-child{border-top-left-radius:12px}
        .br30-meet-meetings-table th:last-child{border-top-right-radius:12px}
        .br30-meet-meetings-pagination{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:13px 15px;border-top:1px solid var(--crm-border);color:var(--crm-muted);font-size:13px}
        .br30-meet-meetings-pagination-actions{display:flex;align-items:center;gap:10px}
        .br30-meet-meetings-loading{min-height:300px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;color:var(--crm-muted);font-size:13px}.br30-meet-meetings-table-loading{min-height:360px}.br30-meet-meetings-table-empty{min-height:360px;display:flex;align-items:center;justify-content:center}.br30-meet-meetings-table-wrap{width:100%;min-height:360px}
        .br30-meet-meetings-spinner,.br30-meet-meeting-button-spinner{width:18px;height:18px;border:2px solid var(--crm-border);border-top-color:var(--crm-primary);border-radius:50%;animation:meetingSpin .7s linear infinite}
        .br30-meet-meeting-button-spinner{width:14px;height:14px}
        .br30-meet-meetings-error{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:15px;padding:12px 14px;border:1px solid var(--crm-border);border-radius:9px;color:#dc2626;background:var(--crm-surface);font-size:13px}
        .br30-meet-meetings-error button{border:0;background:transparent;color:var(--crm-primary);font-weight:400;cursor:pointer}
        .br30-meet-meeting-modal-overlay{position:fixed;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(0,0,0,.48)}
        .br30-meet-meeting-modal{width:min(940px,100%);max-height:92vh;display:flex;flex-direction:column;border:1px solid var(--crm-border);border-radius:14px;background:var(--crm-surface);box-shadow:0 20px 60px rgba(0,0,0,.2);overflow:hidden}
        .br30-meet-meeting-modal-header{display:flex;align-items:flex-start;justify-content:space-between;gap:20px;padding:20px;border-bottom:1px solid var(--crm-border)}
        .br30-meet-meeting-modal-header h2{margin:0;color:var(--crm-text);font-size:18px;font-weight:400}
        .br30-meet-meeting-modal-header p{margin:5px 0 0;color:var(--crm-muted);font-size:13px}
        .br30-meet-meeting-form{overflow-y:auto}
        .br30-meet-meeting-form-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;padding:20px}
        .br30-meet-meeting-form-grid.br30-meet-inner-grid{padding:0;margin-top:4px}
        .br30-meet-meeting-form-section{border-top:1px solid var(--crm-border);padding-top:16px}
        .br30-meet-meeting-section-title{display:flex;align-items:center;gap:6px;font-size:13px;font-weight:400;color:var(--crm-text);margin-bottom:12px}
        .br30-meet-meeting-section-title-row{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px}
        .br30-meet-meeting-form-grid .br30-meet-full{grid-column:1/-1}
        .br30-meet-crm-form-group{display:flex;flex-direction:column;gap:6px}
        .br30-meet-crm-form-group label{font-size:13px;font-weight:400;color:var(--crm-text)}
        .br30-meet-crm-form-group label span{color:#dc2626}
        .br30-meet-crm-input,.br30-meet-crm-select,.br30-meet-crm-textarea{width:100%;box-sizing:border-box;border:1px solid var(--crm-border);border-radius:8px;background:var(--crm-surface);color:var(--crm-text);outline:0;font:inherit;font-size:13px}
        .br30-meet-crm-input,.br30-meet-crm-select{height:40px;padding:0 11px}
        .br30-meet-crm-textarea{padding:10px 11px;resize:vertical}
        .br30-meet-crm-input:focus,.br30-meet-crm-select:focus,.br30-meet-crm-textarea:focus{border-color:var(--crm-primary)}
        .br30-meet-meeting-searchable-select{position:relative;width:100%}
        .br30-meet-meeting-searchable-trigger{width:100%;height:40px;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:0 11px;border:1px solid var(--crm-border);border-radius:8px;background:var(--crm-surface);color:var(--crm-text);font:inherit;font-size:13px;cursor:pointer;text-align:left}
        .br30-meet-meeting-searchable-trigger:hover,.br30-meet-meeting-searchable-trigger.br30-meet-is-open{border-color:var(--crm-primary)}
        .br30-meet-meeting-searchable-trigger:disabled{opacity:.55;cursor:not-allowed}
        .br30-meet-meeting-select-placeholder{color:var(--crm-muted)}
        .br30-meet-meeting-select-chevron{transition:transform .15s ease;color:var(--crm-muted)}
        .br30-meet-meeting-select-chevron.br30-meet-rotate{transform:rotate(90deg)}
        .br30-meet-meeting-searchable-menu{position:absolute;left:0;right:0;top:44px;z-index:1100;border:1px solid var(--crm-border);border-radius:9px;background:var(--crm-surface);box-shadow:0 12px 35px rgba(0,0,0,.18);overflow:hidden}
        .br30-meet-meeting-searchable-search{height:38px;display:flex;align-items:center;gap:7px;padding:0 9px;border-bottom:1px solid var(--crm-border);color:var(--crm-muted)}
        .br30-meet-meeting-searchable-search input{width:100%;height:100%;border:0;outline:0;background:transparent;color:var(--crm-text);font-size:13px}
        .br30-meet-meeting-searchable-search button{display:flex;align-items:center;justify-content:center;border:0;background:transparent;color:var(--crm-muted);cursor:pointer}
        .br30-meet-meeting-searchable-options{max-height:240px;overflow-y:auto;padding:4px}
        .br30-meet-meeting-searchable-option{width:100%;display:flex;align-items:center;gap:9px;padding:9px 10px;border:0;background:transparent;border-radius:6px;color:var(--crm-text);cursor:pointer;text-align:left}
        .br30-meet-meeting-searchable-option:hover,.br30-meet-meeting-searchable-option.br30-meet-selected{background:var(--crm-border)}
        .br30-meet-meeting-searchable-option.br30-meet-clear-option{color:var(--crm-muted);border-bottom:1px solid var(--crm-border);border-radius:0;margin-bottom:3px}
        .br30-meet-meeting-option-icon{width:28px;height:28px;display:flex;align-items:center;justify-content:center;border:1px solid var(--crm-border);border-radius:7px;color:var(--crm-primary);flex:0 0 28px}
        .br30-meet-meeting-option-content{display:flex;flex-direction:column;gap:2px;min-width:0}
        .br30-meet-meeting-option-content strong{font-size:13px;color:var(--crm-text);font-weight:400;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .br30-meet-meeting-option-content small{font-size:13px;color:var(--crm-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .br30-meet-meeting-select-message{padding:18px 10px;text-align:center;color:var(--crm-muted);font-size:13px}
        .br30-meet-meeting-attendee-picker{position:relative}
        .br30-meet-meeting-attendee-picker-icon{position:absolute;right:12px;top:12px;pointer-events:none;color:var(--crm-muted)}
        .br30-meet-meeting-attendee-list{display:flex;flex-direction:column;gap:7px;margin-top:10px}
        .br30-meet-meeting-attendee-item{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:9px 10px;border:1px solid var(--crm-border);border-radius:8px}
        .br30-meet-meeting-attendee-item strong{display:block;font-size:13px;color:var(--crm-text)}
        .br30-meet-meeting-attendee-item span{display:block;margin-top:2px;font-size:13px;color:var(--crm-muted)}
        .br30-meet-meeting-reminder-row{display:grid;grid-template-columns:1fr 1fr auto;align-items:end;gap:10px;margin-bottom:10px}
        .br30-meet-danger-icon{color:#dc2626!important}
        .br30-meet-meeting-modal-footer{display:flex;justify-content:flex-end;gap:10px;padding:15px 20px;border-top:1px solid var(--crm-border)}
        @keyframes meetingSpin{to{transform:rotate(360deg)}}
        @media(max-width:1100px){.br30-meet-meetings-stats-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
        @media(max-width:900px){.br30-meet-meetings-stats-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
        @media(max-width:650px){.br30-meet-meetings-stats-grid{grid-template-columns:1fr}.br30-meet-meeting-form-grid{grid-template-columns:1fr}.br30-meet-meeting-form-grid .br30-meet-full{grid-column:auto}.br30-meet-meeting-form-grid.br30-meet-inner-grid{grid-template-columns:1fr}.br30-meet-meeting-reminder-row{grid-template-columns:1fr}.br30-meet-meeting-modal-overlay{padding:8px}.br30-meet-meeting-modal{max-height:96vh}.br30-meet-meetings-pagination{align-items:flex-start;flex-direction:column}}
      
        .br30-meet-meetings-page .br30-meet-meetings-stats-grid{margin:18px 0 14px}
        .br30-meet-meetings-page .br30-meet-meetings-toolbar{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:16px}
        .br30-meet-meetings-page .br30-meet-meetings-search-wrap{flex:1;min-width:260px;max-width:none;margin:0}
        .br30-meet-meetings-page .br30-meet-meetings-filter-select{width:150px;height:40px;padding:0 11px}
        .br30-meet-meetings-page .br30-meet-meetings-date-filter{width:150px;height:40px}
        .br30-meet-meetings-page .br30-meet-meetings-card{overflow:hidden}
        .br30-meet-meetings-page .br30-meet-meetings-table{min-width:1180px}
        .br30-meet-meetings-page .br30-meet-meetings-table-wrap{width:100%;overflow-x:auto}
        .br30-meet-meetings-page .br30-meet-meetings-pagination{border-top:1px solid var(--crm-border)}
        @media(max-width:700px){
          .br30-meet-meetings-page.br30-meet-crm-resource-page{padding:18px 14px 30px}
          .br30-meet-meetings-page .br30-meet-crm-resource-head{align-items:flex-start;flex-direction:column}
          .br30-meet-meetings-page .br30-meet-crm-resource-actions{width:100%}
          .br30-meet-meetings-page .br30-meet-crm-resource-actions .br30-meet-crm-btn{flex:1;justify-content:center}
          .br30-meet-meetings-page .br30-meet-meetings-search-wrap{min-width:100%}
          .br30-meet-meetings-page .br30-meet-meetings-filter-select,.br30-meet-meetings-page .br30-meet-meetings-date-filter{width:100%;flex:1}
          .br30-meet-meetings-page .br30-meet-meetings-toolbar .br30-meet-crm-btn{flex:1;justify-content:center}

          }
      `;
import { getMeetings, createMeeting, updateMeeting, deleteMeeting } from "../../api/meeting.api";

import { getBusinessMembers } from "../../api/business-member.api";
import { getAssignmentMembers } from "../../api/crm.api";
import { getContacts } from "../../api/contact.api";
import { getLeads } from "../../api/lead.api";
import { getCompanies } from "../../api/company.api";
import { getDeals } from "../../api/deal.api";

/* ============================================================
   HELPERS
   ============================================================ */

const showError = (title, text) =>
  showAuthAlert({
    icon: "error",
    title,
    text,
    confirmButtonText: "OK",
  });

const showSuccess = (title, text) =>
  showAuthAlert({
    icon: "success",
    title,
    text,
    confirmButtonText: "Done",
  });

function getErrorMessage(error, fallback) {
  return error?.response?.data?.message || error?.response?.data?.error || error?.response?.data?.errors?.[0]?.msg || fallback;
}

function formatDateTime(value) {
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
}

function formatDate(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function toDateTimeLocal(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const pad = (number) => String(number).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function toISOStringFromLocal(value) {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return null;

  return date.toISOString();
}

function getStatusLabel(status) {
  if (!status) return "Scheduled";

  return status
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getMeetingStatusClass(status) {
  switch (status) {
    case "COMPLETED":
      return "br30-meet-completed";

    case "CANCELLED":
      return "br30-meet-cancelled";

    case "NO_SHOW":
      return "br30-meet-no-show";

    case "IN_PROGRESS":
      return "br30-meet-in-progress";

    default:
      return "br30-meet-scheduled";
  }
}

function getInitialForm() {
  return {
    title: "",
    description: "",
    startAt: "",
    endAt: "",
    timezone: "Asia/Kolkata",
    location: "",
    meetingUrl: "",
    status: "SCHEDULED",

    organizerId: "",

    attendees: [],

    relatedType: "",
    relatedId: "",
    relatedLabel: "",

    reminders: [
      {
        minutesBefore: 15,
        channel: "IN_APP",
      },
    ],

    notes: "",
    outcome: "",
    cancellationReason: "",
  };
}

function extractArray(response, keys = []) {
  const root = response?.data ?? response;

  if (Array.isArray(root)) {
    return root;
  }

  for (const key of keys) {
    if (Array.isArray(root?.[key])) {
      return root[key];
    }
  }

  if (Array.isArray(root?.data)) {
    return root.data;
  }

  return [];
}

function getObjectId(value) {
  if (!value) return "";

  if (typeof value === "string") return value;

  return value?._id || value?.id || value?.userId || "";
}

function getMemberUser(member) {
  return member?.user || member?.userId || member;
}

function getMemberId(member) {
  const user = getMemberUser(member);

  return member?.userId?._id || member?.userId?.id || member?.userId || user?._id || user?.id || member?._userId || "";
}

function getMemberName(member) {
  const user = getMemberUser(member);

  return user?.name || [user?.firstName, user?.lastName].filter(Boolean).join(" ") || member?.name || [member?.firstName, member?.lastName].filter(Boolean).join(" ") || user?.email || member?.email || "User";
}

function getMemberEmail(member) {
  const user = getMemberUser(member);

  return user?.email || member?.email || "";
}

function getRecordId(record) {
  return record?._id || record?.id || "";
}

function getContactName(record) {
  return record?.name || [record?.firstName, record?.lastName].filter(Boolean).join(" ") || record?.email || record?.phone || "Contact";
}

function getLeadName(record) {
  return record?.name || [record?.firstName, record?.lastName].filter(Boolean).join(" ") || record?.title || record?.email || "Lead";
}

function getCompanyName(record) {
  return record?.name || record?.legalName || record?.email || "Company";
}

function getDealName(record) {
  return record?.name || record?.title || "Deal";
}

function normalizeMeeting(meeting) {
  if (!meeting) return null;

  const relatedType = meeting.relatedTo?.type || "";
  const relatedId = getObjectId(meeting.relatedTo?.id);

  const metadata = meeting.metadata && typeof meeting.metadata === "object" ? meeting.metadata : {};

  return {
    ...meeting,

    startAt: toDateTimeLocal(meeting.startAt),
    endAt: toDateTimeLocal(meeting.endAt),

    organizerId: getObjectId(meeting.organizerId),

    relatedType,
    relatedId,
    relatedLabel: "",

    attendees: Array.isArray(meeting.attendees)
      ? meeting.attendees.map((attendee) => ({
          userId: attendee?.userId?._id || attendee?.userId?.id || attendee?.userId || "",
          name: attendee?.name || attendee?.userId?.name || [attendee?.userId?.firstName, attendee?.userId?.lastName].filter(Boolean).join(" ") || "",
          email: attendee?.email || attendee?.userId?.email || "",
          response: attendee?.response || "PENDING",
        }))
      : [],

    reminders:
      Array.isArray(meeting.reminders) && meeting.reminders.length
        ? meeting.reminders
        : [
            {
              minutesBefore: 15,
              channel: "IN_APP",
            },
          ],

    notes: metadata?.notes || "",
    outcome: metadata?.outcome || "",
    cancellationReason: metadata?.cancellationReason || "",
  };
}

/* ============================================================
   SEARCHABLE SELECT
   ============================================================ */

function SearchableSelect({ value, options, onChange, placeholder = "Select...", disabled = false, loading = false, emptyText = "No records found." }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const selected = options.find((option) => String(option.value) === String(value));

  const filteredOptions = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) return options;

    return options.filter((option) => `${option.label} ${option.email || ""}`.toLowerCase().includes(normalized));
  }, [options, query]);

  useEffect(() => {
    if (!open) {
      setQuery("");
    }
  }, [open]);

  useEffect(() => {
    const handleOutside = (event) => {
      if (!event.target.closest(".br30-meet-meeting-searchable-select")) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
    };
  }, []);

  return (
    <div className="br30-meet-meeting-searchable-select">
      <button type="button" className={`br30-meet-meeting-searchable-trigger ${open ? "br30-meet-is-open" : ""}`} disabled={disabled} onClick={() => setOpen((previous) => !previous)}>
        <span className={selected ? "" : "br30-meet-meeting-select-placeholder"}>{selected?.label || placeholder}</span>

        <ChevronRight size={15} className={`br30-meet-meeting-select-chevron ${open ? "br30-meet-rotate" : ""}`} />
      </button>

      {open && !disabled && (
        <div className="br30-meet-meeting-searchable-menu">
          <div className="br30-meet-meeting-searchable-search">
            <Search size={15} />

            <input autoFocus type="text" placeholder="Search..." value={query} onChange={(event) => setQuery(event.target.value)} onClick={(event) => event.stopPropagation()} />

            {query && (
              <button type="button" onClick={() => setQuery("")}>
                <X size={14} />
              </button>
            )}
          </div>

          <div className="br30-meet-meeting-searchable-options">
            {loading ? (
              <div className="br30-meet-meeting-select-message">Loading...</div>
            ) : filteredOptions.length === 0 ? (
              <div className="br30-meet-meeting-select-message">{emptyText}</div>
            ) : (
              <>
                {value && (
                  <button
                    type="button"
                    className="br30-meet-meeting-searchable-option br30-meet-clear-option"
                    onClick={() => {
                      onChange("");
                      setOpen(false);
                    }}>
                    <X size={14} />
                    Clear selection
                  </button>
                )}

                {filteredOptions.map((option) => (
                  <button
                    type="button"
                    key={String(option.value)}
                    className={`br30-meet-meeting-searchable-option ${String(option.value) === String(value) ? "br30-meet-selected" : ""}`}
                    onClick={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}>
                    {option.icon && <span className="br30-meet-meeting-option-icon">{option.icon}</span>}

                    <span className="br30-meet-meeting-option-content">
                      <strong>{option.label}</strong>

                      {option.email && <small>{option.email}</small>}
                    </span>
                  </button>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   MEETINGS
   ============================================================ */

function Meetings() {
  const { businessId, loading: businessLoading, error: businessError } = useBusiness();

  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [members, setMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);

  const [contacts, setContacts] = useState([]);
  const [leads, setLeads] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [deals, setDeals] = useState([]);

  const [recordsLoading, setRecordsLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const [showModal, setShowModal] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState(null);

  const [form, setForm] = useState(getInitialForm());

  const [expandedMenu, setExpandedMenu] = useState(null);

  const [error, setError] = useState("");

  /* ==========================================================
     LOAD MEETINGS
     ========================================================== */

  const loadMeetings = useCallback(async () => {
    if (!businessId) {
      setLoading(false);
      setError("Business information is not available. Please login again.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const params = {
        page: 1,
        limit: 100,
      };

      if (statusFilter) {
        params.status = statusFilter;
      }

      if (fromDate) {
        params.from = new Date(`${fromDate}T00:00:00`).toISOString();
      }

      if (toDate) {
        params.to = new Date(`${toDate}T23:59:59`).toISOString();
      }

      const response = await getMeetings(businessId, params);

      const rows = extractArray(response, ["meetings", "items", "results"]);

      setMeetings(rows);
    } catch (err) {
      console.error("Failed to load meetings:", err);

      setError(getErrorMessage(err, "Failed to load meetings."));

      setMeetings([]);
    } finally {
      setLoading(false);
    }
  }, [businessId, statusFilter, fromDate, toDate]);

  /* ==========================================================
     LOAD BUSINESS MEMBERS
     ========================================================== */

  const loadMembers = useCallback(async () => {
    if (!businessId) return;

    try {
      setMembersLoading(true);

      const response = await getAssignmentMembers(businessId, {
        page: 1,
        limit: 100,
      });

      const data = response?.data || response || {};

      const rows = data?.members || data?.users || data?.items || data?.results || data?.data?.members || data?.data?.users || data?.data?.items || data?.data?.results || [];

      setMembers(Array.isArray(rows) ? rows : []);
    } catch (err) {
      console.error("Failed to load business members:", err);
      setMembers([]);
    } finally {
      setMembersLoading(false);
    }
  }, [businessId]);

  /* ==========================================================
     LOAD RELATED CRM RECORDS
     ========================================================== */

  const loadRelatedRecords = useCallback(async () => {
    if (!businessId) return;

    setRecordsLoading(true);

    try {
      const results = await Promise.allSettled([getContacts(businessId, { page: 1, limit: 100 }), getLeads(businessId, { page: 1, limit: 100 }), getCompanies(businessId, { page: 1, limit: 100 }), getDeals(businessId, { page: 1, limit: 100 })]);

      const extractRows = (result, keys) => {
        if (result.status !== "fulfilled") return [];

        const response = result.value;
        const root = response?.data || response || {};

        const data = root?.data && typeof root.data === "object" ? root.data : root;

        for (const key of keys) {
          if (Array.isArray(data?.[key])) {
            return data[key];
          }
        }

        if (Array.isArray(data)) {
          return data;
        }

        return [];
      };

      setContacts(extractRows(results[0], ["contacts", "items", "results"]));

      setLeads(extractRows(results[1], ["leads", "items", "results"]));

      setCompanies(extractRows(results[2], ["companies", "items", "results"]));

      setDeals(extractRows(results[3], ["deals", "items", "results"]));
    } catch (err) {
      console.error("Failed to load related CRM records:", err);
    } finally {
      setRecordsLoading(false);
    }
  }, [businessId]);

  useEffect(() => {
    if (!businessId) return;
    loadMeetings();
  }, [businessId, loadMeetings]);

  useEffect(() => {
    if (!businessId) return;
    loadMembers();
    loadRelatedRecords();
  }, [businessId, loadMembers, loadRelatedRecords]);

  /* ==========================================================
     SEARCH / FILTER
     ========================================================== */

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("");
    setFromDate("");
    setToDate("");
    setPage(1);
  };

  const filteredMeetings = useMemo(() => {
    let rows = Array.isArray(meetings) ? [...meetings] : [];

    const normalizedSearch = search.trim().toLowerCase();

    if (normalizedSearch) {
      rows = rows.filter((meeting) => {
        const organizer = meeting?.organizerId;

        const organizerName = organizer?.name || [organizer?.firstName, organizer?.lastName].filter(Boolean).join(" ") || organizer?.email || "";

        const attendeesText = Array.isArray(meeting?.attendees) ? meeting.attendees.map((attendee) => `${attendee?.name || ""} ${attendee?.email || ""}`).join(" ") : "";

        const relatedText = meeting?.relatedTo ? `${meeting.relatedTo.type || ""} ${meeting.relatedTo.id || ""}` : "";

        const searchable = [meeting?.title, meeting?.description, meeting?.location, meeting?.meetingUrl, organizerName, organizer?.email, attendeesText, relatedText].filter(Boolean).join(" ").toLowerCase();

        return searchable.includes(normalizedSearch);
      });
    }

    return rows;
  }, [meetings, search]);

  const totalFiltered = filteredMeetings.length;

  const totalPages = Math.max(1, Math.ceil(totalFiltered / limit));

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paginatedMeetings = useMemo(() => {
    const start = (page - 1) * limit;

    return filteredMeetings.slice(start, start + limit);
  }, [filteredMeetings, page, limit]);

  useEffect(() => {
    setPagination({
      page,
      limit,
      total: totalFiltered,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    });
  }, [page, limit, totalFiltered, totalPages]);

  /* ==========================================================
     FORM
     ========================================================== */

  const openCreateModal = () => {
    setEditingMeeting(null);

    setForm(getInitialForm());

    setShowModal(true);
  };

  const openEditModal = (meeting) => {
    const normalized = normalizeMeeting(meeting);

    setEditingMeeting(meeting);

    setForm({
      ...getInitialForm(),
      ...normalized,

      status: meeting.status || "SCHEDULED",

      organizerId: getObjectId(meeting.organizerId),

      relatedType: meeting.relatedTo?.type || "",

      relatedId: getObjectId(meeting.relatedTo?.id),

      relatedLabel: "",
    });

    setExpandedMenu(null);
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingMeeting(null);
    setForm(getInitialForm());
  };

  const updateForm = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  /* ==========================================================
     MEMBER OPTIONS
     ========================================================== */

  const memberOptions = useMemo(() => {
    const seen = new Set();

    return members
      .map((member) => {
        const id = getMemberId(member);

        if (!id || seen.has(String(id))) {
          return null;
        }

        seen.add(String(id));

        return {
          value: id,
          label: getMemberName(member),
          email: getMemberEmail(member),
        };
      })
      .filter(Boolean);
  }, [members]);

  /* ==========================================================
     RELATED OPTIONS
     ========================================================== */

  const relatedOptions = useMemo(() => {
    if (form.relatedType === "CONTACT") {
      return contacts
        .map((record) => {
          const id = getRecordId(record);

          if (!id) return null;

          return {
            value: id,
            label: getContactName(record),
            email: record?.email || record?.phone || "",
            icon: <Contact size={15} />,
          };
        })
        .filter(Boolean);
    }

    if (form.relatedType === "LEAD") {
      return leads
        .map((record) => {
          const id = getRecordId(record);

          if (!id) return null;

          return {
            value: id,
            label: getLeadName(record),
            email: record?.email || record?.phone || "",
            icon: <BriefcaseBusiness size={15} />,
          };
        })
        .filter(Boolean);
    }

    if (form.relatedType === "COMPANY") {
      return companies
        .map((record) => {
          const id = getRecordId(record);

          if (!id) return null;

          return {
            value: id,
            label: getCompanyName(record),
            email: record?.email || record?.phone || "",
            icon: <Building2 size={15} />,
          };
        })
        .filter(Boolean);
    }

    if (form.relatedType === "DEAL") {
      return deals
        .map((record) => {
          const id = getRecordId(record);

          if (!id) return null;

          return {
            value: id,
            label: getDealName(record),
            email: record?.value !== undefined ? `${record?.currency || "INR"} ${Number(record.value || 0).toLocaleString("en-IN")}` : "",
            icon: <BriefcaseBusiness size={15} />,
          };
        })
        .filter(Boolean);
    }

    return [];
  }, [form.relatedType, contacts, leads, companies, deals]);

  /* ==========================================================
     ATTENDEES
     ========================================================== */

  const addAttendee = (memberId) => {
    if (!memberId) return;

    const member = members.find((item) => String(getMemberId(item)) === String(memberId));

    if (!member) return;

    const userId = getMemberId(member);
    const name = getMemberName(member);
    const email = getMemberEmail(member);

    const alreadyExists = form.attendees.some((attendee) => String(attendee.userId) === String(userId));

    if (alreadyExists) {
      crmSwal({
        icon: "warning",
        title: "Already added",
        text: `${name} is already added as an attendee.`,
      });

      return;
    }

    setForm((previous) => ({
      ...previous,

      attendees: [
        ...previous.attendees,
        {
          userId,
          name,
          email,
          response: "PENDING",
        },
      ],
    }));
  };

  const removeAttendee = (index) => {
    setForm((previous) => ({
      ...previous,

      attendees: previous.attendees.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  /* ==========================================================
     REMINDERS
     ========================================================== */

  const addReminder = () => {
    if (form.reminders.length >= 20) {
      crmSwal({
        icon: "warning",
        title: "Limit reached",
        text: "Maximum 20 reminders are allowed.",
      });

      return;
    }

    setForm((previous) => ({
      ...previous,

      reminders: [
        ...previous.reminders,
        {
          minutesBefore: 15,
          channel: "IN_APP",
        },
      ],
    }));
  };

  const updateReminder = (index, field, value) => {
    setForm((previous) => ({
      ...previous,

      reminders: previous.reminders.map((reminder, reminderIndex) =>
        reminderIndex === index
          ? {
              ...reminder,
              [field]: field === "minutesBefore" ? Number(value) : value,
            }
          : reminder
      ),
    }));
  };

  const removeReminder = (index) => {
    setForm((previous) => ({
      ...previous,

      reminders: previous.reminders.filter((_, reminderIndex) => reminderIndex !== index),
    }));
  };

  /* ==========================================================
     VALIDATION
     ========================================================== */

  const validateForm = () => {
    if (!form.title.trim()) {
      crmSwal({
        icon: "warning",
        title: "Title required",
        text: "Please enter a meeting title.",
      });

      return false;
    }

    if (!form.startAt) {
      crmSwal({
        icon: "warning",
        title: "Start time required",
        text: "Please select meeting start time.",
      });

      return false;
    }

    if (!form.endAt) {
      crmSwal({
        icon: "warning",
        title: "End time required",
        text: "Please select meeting end time.",
      });

      return false;
    }

    const start = new Date(form.startAt);
    const end = new Date(form.endAt);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      crmSwal({
        icon: "warning",
        title: "Invalid date",
        text: "Please select valid meeting dates.",
      });

      return false;
    }

    if (end <= start) {
      crmSwal({
        icon: "warning",
        title: "Invalid time",
        text: "Meeting end time must be after start time.",
      });

      return false;
    }

    if (form.meetingUrl && !/^https?:\/\/.+/i.test(form.meetingUrl.trim())) {
      crmSwal({
        icon: "warning",
        title: "Invalid meeting URL",
        text: "Meeting URL must start with http:// or https://.",
      });

      return false;
    }

    if (form.relatedType && !form.relatedId) {
      crmSwal({
        icon: "warning",
        title: "Related record required",
        text: "Please select the related CRM record.",
      });

      return false;
    }

    for (const reminder of form.reminders) {
      const minutes = Number(reminder.minutesBefore);

      if (Number.isNaN(minutes) || minutes < 0 || minutes > 10080) {
        crmSwal({
          icon: "warning",
          title: "Invalid reminder",
          text: "Reminder must be between 0 and 10080 minutes.",
        });

        return false;
      }
    }

    return true;
  };

  /* ==========================================================
     SUBMIT
     ========================================================== */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!businessId || !validateForm()) {
      return;
    }

    try {
      setSaving(true);

      const existingMetadata = editingMeeting?.metadata && typeof editingMeeting.metadata === "object" ? editingMeeting.metadata : {};

      const payload = {
        title: String(form.title || "").trim(),
        organizerId: form.organizerId || null,

        startAt: toISOStringFromLocal(form.startAt),

        endAt: toISOStringFromLocal(form.endAt),

        timezone: form.timezone.trim() || "Asia/Kolkata",

        location: form.location.trim() || null,

        meetingUrl: form.meetingUrl.trim() || null,

        attendees: form.attendees.map((attendee) => ({
          userId: attendee.userId || null,
          name: attendee.name || null,
          email: attendee.email || null,
          response: attendee.response || "PENDING",
        })),

        relatedTo: form.relatedType
          ? {
              type: form.relatedType,
              id: form.relatedId,
            }
          : undefined,

        reminders: form.reminders.map((reminder) => ({
          minutesBefore: Number(reminder.minutesBefore),
          channel: reminder.channel || "IN_APP",
        })),

        metadata: {
          ...existingMetadata,
          notes: form.notes.trim() || null,
          outcome: form.outcome.trim() || null,
          cancellationReason: form.cancellationReason.trim() || null,
        },
      };

      if (editingMeeting) {
        payload.status = form.status || "SCHEDULED";

        await updateMeeting(businessId, editingMeeting._id, payload);

        await showSuccess("Meeting updated", "Meeting has been updated successfully.");
      } else {
        await createMeeting(businessId, payload);

        await showSuccess("Meeting created", "Meeting has been created successfully.");
      }

      closeModal();

      await loadMeetings();
    } catch (err) {
      console.error("Failed to save meeting:", err);

      await showError("Unable to save meeting", getErrorMessage(err, "Something went wrong while saving the meeting."));
    } finally {
      setSaving(false);
    }
  };

  /* ==========================================================
     DELETE
     ========================================================== */

  const handleDelete = async (meeting) => {
    setExpandedMenu(null);

    const result = await crmSwal({
      icon: "warning",
      title: "Delete meeting?",
      text: `"${meeting.title}" will be removed from the meeting list.`,
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await deleteMeeting(businessId, meeting._id);

      await crmSwal({
        icon: "success",
        title: "Meeting deleted",
        text: "Meeting has been deleted successfully.",
        timer: 1600,
        showConfirmButton: false,
      });

      await loadMeetings();
    } catch (err) {
      console.error("Failed to delete meeting:", err);

      crmSwal({
        icon: "error",
        title: "Unable to delete meeting",
        text: getErrorMessage(err, "Something went wrong while deleting the meeting."),
      });
    }
  };

  /* ==========================================================
     STATUS
     ========================================================== */

  const changeStatus = async (meeting, status) => {
    setExpandedMenu(null);

    let outcome = null;
    let cancellationReason = null;

    const currentMetadata = meeting?.metadata && typeof meeting.metadata === "object" ? meeting.metadata : {};

    if (status === "COMPLETED") {
      const result = await crmSwal({
        title: "Complete meeting",
        input: "textarea",
        inputLabel: "Meeting outcome",
        inputPlaceholder: "Enter meeting outcome...",
        inputValue: currentMetadata?.outcome || "",
        showCancelButton: true,
        confirmButtonText: "Complete",
        cancelButtonText: "Cancel",
      });

      if (!result.isConfirmed) {
        return;
      }

      outcome = result.value?.trim() || null;
    }

    if (status === "CANCELLED") {
      const result = await crmSwal({
        title: "Cancel meeting",
        input: "textarea",
        inputLabel: "Cancellation reason",
        inputPlaceholder: "Enter cancellation reason...",
        inputValue: currentMetadata?.cancellationReason || "",
        showCancelButton: true,
        confirmButtonText: "Cancel Meeting",
        cancelButtonText: "Keep Meeting",
      });

      if (!result.isConfirmed) {
        return;
      }

      cancellationReason = result.value?.trim() || null;
    }

    try {
      await updateMeeting(businessId, meeting._id, {
        status,

        metadata: {
          ...currentMetadata,

          outcome: outcome ?? currentMetadata?.outcome ?? null,

          cancellationReason: cancellationReason ?? currentMetadata?.cancellationReason ?? null,
        },
      });

      await crmSwal({
        icon: "success",
        title: "Status updated",
        text: `Meeting marked as ${getStatusLabel(status)}.`,
        timer: 1600,
        showConfirmButton: false,
      });

      await loadMeetings();
    } catch (err) {
      console.error("Failed to update meeting status:", err);

      crmSwal({
        icon: "error",
        title: "Unable to update status",
        text: getErrorMessage(err, "Something went wrong."),
      });
    }
  };

  /* ==========================================================
     STATS
     ========================================================== */

  const stats = useMemo(() => {
    const source = Array.isArray(meetings) ? meetings : [];

    const scheduled = source.filter((meeting) => meeting.status === "SCHEDULED").length;

    const completed = source.filter((meeting) => meeting.status === "COMPLETED").length;

    const cancelled = source.filter((meeting) => meeting.status === "CANCELLED").length;

    const upcoming = source.filter((meeting) => {
      if (!meeting.startAt || meeting.status === "CANCELLED" || meeting.status === "COMPLETED") {
        return false;
      }

      return new Date(meeting.startAt) > new Date();
    }).length;

    return {
      total: source.length,
      scheduled,
      upcoming,
      completed,
      cancelled,
    };
  }, [meetings]);

  /* ==========================================================
     RELATED LABEL
     ========================================================== */

  const getRelatedDisplay = (meeting) => {
    const type = meeting?.relatedTo?.type;

    const id = getObjectId(meeting?.relatedTo?.id);

    if (!type || !id) {
      return null;
    }

    let record = null;

    if (type === "CONTACT") {
      record = contacts.find((item) => String(getRecordId(item)) === String(id));

      return {
        type: "Contact",
        name: record ? getContactName(record) : "Contact",
      };
    }

    if (type === "LEAD") {
      record = leads.find((item) => String(getRecordId(item)) === String(id));

      return {
        type: "Lead",
        name: record ? getLeadName(record) : "Lead",
      };
    }

    if (type === "COMPANY") {
      record = companies.find((item) => String(getRecordId(item)) === String(id));

      return {
        type: "Company",
        name: record ? getCompanyName(record) : "Company",
      };
    }

    if (type === "DEAL") {
      record = deals.find((item) => String(getRecordId(item)) === String(id));

      return {
        type: "Deal",
        name: record ? getDealName(record) : "Deal",
      };
    }

    return {
      type,
      name: "Related record",
    };
  };

  /* ==========================================================
     RENDER
     ========================================================== */

  return (
    <>
      <style>{MEETINGS_PAGE_CSS}</style>

      <div className="br30-meet-crm-resource-page br30-meet-meetings-page">
        <div className="br30-meet-crm-resource-head">
          <div>
            <h1 className="br30-meet-crm-resource-title">Meetings</h1>
            <p className="br30-meet-crm-resource-sub">Manage and track your meetings directly from the BR30 CRM workspace.</p>
          </div>

          <div className="br30-meet-crm-resource-actions">
            <button
              type="button"
              className="br30-meet-crm-btn"
              onClick={() => {
                loadMeetings();
                loadMembers();
                loadRelatedRecords();
              }}
              disabled={loading}>
              <RefreshCw size={15} />
              Refresh
            </button>

            <button type="button" className="br30-meet-crm-btn br30-meet-primary" onClick={openCreateModal}>
              <Plus size={15} />
              Add Meeting
            </button>
          </div>
        </div>

        {/* ====================================================
            STATS
            ==================================================== */}

        <div className="br30-meet-meetings-stats-grid">
          <div className="br30-meet-meetings-stat-card">
            <div className="br30-meet-meetings-stat-icon">
              <CalendarDays size={20} />
            </div>

            <div>
              <span>Total Meetings</span>
              <strong>{stats.total}</strong>
            </div>
          </div>

          <div className="br30-meet-meetings-stat-card">
            <div className="br30-meet-meetings-stat-icon">
              <Clock3 size={20} />
            </div>

            <div>
              <span>Scheduled</span>
              <strong>{stats.scheduled}</strong>
            </div>
          </div>

          <div className="br30-meet-meetings-stat-card">
            <div className="br30-meet-meetings-stat-icon">
              <CalendarDays size={20} />
            </div>

            <div>
              <span>Upcoming</span>
              <strong>{stats.upcoming}</strong>
            </div>
          </div>

          <div className="br30-meet-meetings-stat-card">
            <div className="br30-meet-meetings-stat-icon">
              <CheckCircle2 size={20} />
            </div>

            <div>
              <span>Completed</span>
              <strong>{stats.completed}</strong>
            </div>
          </div>

          <div className="br30-meet-meetings-stat-card">
            <div className="br30-meet-meetings-stat-icon">
              <X size={20} />
            </div>

            <div>
              <span>Cancelled</span>
              <strong>{stats.cancelled}</strong>
            </div>
          </div>
        </div>

        {/* ====================================================
            FILTERS
            ==================================================== */}

        <div className="br30-meet-meetings-toolbar">
          <div className="br30-meet-crm-search-wrap br30-meet-meetings-search-wrap">
            <Search className="br30-meet-crm-search-icon" size={16} />
            <input
              className="br30-meet-crm-search"
              type="text"
              placeholder="Search meetings..."
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
            />
            {search && (
              <button
                type="button"
                className="br30-meet-crm-search-clear"
                onClick={() => {
                  setSearch("");
                  setPage(1);
                }}
                aria-label="Clear search"
                title="Clear search">
                <X size={15} />
              </button>
            )}
          </div>

          <select
            className="br30-meet-crm-select br30-meet-meetings-filter-select"
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value);
              setPage(1);
            }}>
            <option value="">All Statuses</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="NO_SHOW">No Show</option>
          </select>

          <input
            type="date"
            className="br30-meet-crm-input br30-meet-meetings-date-filter"
            value={fromDate}
            onChange={(event) => {
              setFromDate(event.target.value);
              setPage(1);
            }}
          />
          <input
            type="date"
            className="br30-meet-crm-input br30-meet-meetings-date-filter"
            value={toDate}
            onChange={(event) => {
              setToDate(event.target.value);
              setPage(1);
            }}
          />

          {(search || statusFilter || fromDate || toDate) && (
            <button type="button" className="br30-meet-crm-btn" onClick={resetFilters}>
              Clear Filters
            </button>
          )}
        </div>

        {/* ====================================================
            ERROR
            ==================================================== */}

        {error && (
          <div className="br30-meet-meetings-error">
            <span>{error}</span>

            <button type="button" onClick={loadMeetings}>
              Retry
            </button>
          </div>
        )}

        {/* ====================================================
            TABLE
            ==================================================== */}

        <div className="br30-meet-crm-resource-card br30-meet-meetings-card">
          <div className="br30-meet-meetings-table-wrap">
            <table className="br30-meet-meetings-table">
              <thead>
                <tr>
                  <th>Meeting</th>
                  <th>Date & Time</th>
                  <th>Organizer</th>
                  <th>Attendees</th>
                  <th>Related</th>
                  <th>Status</th>
                  <th>Location</th>
                  <th className="br30-meet-meetings-actions-head">Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8">
                      <div className="br30-meet-meetings-loading br30-meet-meetings-table-loading">
                        <div className="br30-meet-meetings-spinner" />
                        <span>Loading meetings...</span>
                      </div>
                    </td>
                  </tr>
                ) : paginatedMeetings.length === 0 ? (
                  <tr>
                    <td colSpan="8">
                      <div className="br30-meet-crm-empty-state br30-meet-meetings-table-empty">
                        <CalendarDays size={42} />
                        <h2>No meetings found</h2>
                        <p>{search || statusFilter || fromDate || toDate ? "No meetings match your current filters." : "Create your first meeting to start managing your schedule."}</p>

                        {!(search || statusFilter || fromDate || toDate) && (
                          <button type="button" className="br30-meet-crm-primary-btn" onClick={openCreateModal}>
                            <Plus size={17} />
                            Add Meeting
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedMeetings.map((meeting) => {
                    const organizer = meeting.organizerId;

                    const organizerName = organizer?.name || [organizer?.firstName, organizer?.lastName].filter(Boolean).join(" ") || organizer?.email || "—";

                    const related = getRelatedDisplay(meeting);

                    return (
                      <tr key={meeting._id}>
                        <td>
                          <div className="br30-meet-meeting-title-cell">
                            <div className="br30-meet-meeting-title">{meeting.title}</div>
                            {meeting.description && <div className="br30-meet-meeting-description">{meeting.description}</div>}
                          </div>
                        </td>

                        <td>
                          <div className="br30-meet-meeting-date-cell">
                            <strong>{formatDate(meeting.startAt)}</strong>
                            <span>
                              {formatTime(meeting.startAt)}
                              {" — "}
                              {formatTime(meeting.endAt)}
                            </span>
                          </div>
                        </td>

                        <td>
                          <div className="br30-meet-meeting-person-cell">
                            <strong>{organizerName}</strong>
                            {organizer?.email && <span>{organizer.email}</span>}
                          </div>
                        </td>

                        <td>
                          <div className="br30-meet-meeting-attendees-cell">
                            <Users size={15} />
                            <span>{Array.isArray(meeting.attendees) ? meeting.attendees.length : 0}</span>
                          </div>
                        </td>

                        <td>
                          {related ? (
                            <div className="br30-meet-meeting-related-cell">
                              <span>{related.type}</span>
                              <strong>{related.name}</strong>
                            </div>
                          ) : (
                            <span className="br30-meet-meeting-muted">—</span>
                          )}
                        </td>

                        <td>
                          <span className={`br30-meet-meeting-status-badge ${getMeetingStatusClass(meeting.status)}`}>{getStatusLabel(meeting.status)}</span>
                        </td>

                        <td>
                          {meeting.meetingUrl ? (
                            <a href={meeting.meetingUrl} target="_blank" rel="noreferrer" className="br30-meet-meeting-location-link">
                              <Video size={15} />
                              Join
                            </a>
                          ) : meeting.location ? (
                            <span className="br30-meet-meeting-location-text">
                              <MapPin size={15} />
                              {meeting.location}
                            </span>
                          ) : (
                            <span className="br30-meet-meeting-muted">—</span>
                          )}
                        </td>

                        <td>
                          <div className="br30-meet-meeting-actions" onClick={(event) => event.stopPropagation()}>
                            <button type="button" className="br30-meet-crm-icon-btn" onClick={() => setExpandedMenu(expandedMenu === meeting._id ? null : meeting._id)} title="Actions">
                              <MoreVertical size={17} />
                            </button>

                            {expandedMenu === meeting._id && (
                              <div className="br30-meet-meeting-action-menu">
                                <button type="button" onClick={() => openEditModal(meeting)}>
                                  <Pencil size={15} />
                                  Edit
                                </button>

                                {meeting.status !== "COMPLETED" && (
                                  <button type="button" onClick={() => changeStatus(meeting, "COMPLETED")}>
                                    <CheckCircle2 size={15} />
                                    Complete
                                  </button>
                                )}

                                {meeting.status !== "CANCELLED" && (
                                  <button type="button" onClick={() => changeStatus(meeting, "CANCELLED")}>
                                    <X size={15} />
                                    Cancel
                                  </button>
                                )}

                                <button type="button" className="br30-meet-danger" onClick={() => handleDelete(meeting)}>
                                  <Trash2 size={15} />
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="br30-meet-crm-pagination br30-meet-meetings-pagination">
            <span>
              Showing {loading ? 0 : paginatedMeetings.length} of {totalFiltered} meetings
            </span>

            <div className="br30-meet-meetings-pagination-actions">
              <button type="button" className="br30-meet-crm-icon-btn" disabled={loading || page <= 1} onClick={() => setPage(Math.max(page - 1, 1))}>
                <ChevronLeft size={17} />
              </button>

              <span>
                Page {page} of {totalPages}
              </span>

              <button type="button" className="br30-meet-crm-icon-btn" disabled={loading || page >= totalPages} onClick={() => setPage(page + 1)}>
                <ChevronRight size={17} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================
          MEETING MODAL
          ====================================================== */}

      {showModal && (
        <div
          className="br30-meet-meeting-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}>
          <div className="br30-meet-meeting-modal">
            <div className="br30-meet-meeting-modal-header">
              <div>
                <h2>{editingMeeting ? "Edit Meeting" : "Add Meeting"}</h2>

                <p>{editingMeeting ? "Update meeting details." : "Create a new meeting."}</p>
              </div>

              <button type="button" className="br30-meet-crm-icon-btn" onClick={closeModal} disabled={saving}>
                <X size={19} />
              </button>
            </div>

            <form className="br30-meet-meeting-form" onSubmit={handleSubmit}>
              <div className="br30-meet-meeting-form-grid">
                {/* Title */}

                <div className="br30-meet-crm-form-group br30-meet-full">
                  <label>
                    Meeting Title <span>*</span>
                  </label>

                  <input type="text" className="br30-meet-crm-input" placeholder="Enter meeting title" value={form.title} onChange={(event) => updateForm("title", event.target.value)} maxLength={200} required />
                </div>

                {/* Date */}

                <div className="br30-meet-crm-form-group">
                  <label>
                    Start Date & Time <span>*</span>
                  </label>

                  <input type="datetime-local" className="br30-meet-crm-input" value={form.startAt} onChange={(event) => updateForm("startAt", event.target.value)} required />
                </div>

                <div className="br30-meet-crm-form-group">
                  <label>
                    End Date & Time <span>*</span>
                  </label>

                  <input type="datetime-local" className="br30-meet-crm-input" value={form.endAt} onChange={(event) => updateForm("endAt", event.target.value)} required />
                </div>

                {/* Timezone */}

                <div className="br30-meet-crm-form-group">
                  <label>Timezone</label>

                  <input type="text" className="br30-meet-crm-input" value={form.timezone} onChange={(event) => updateForm("timezone", event.target.value)} />
                </div>

                {/* Organizer */}

                <div className="br30-meet-crm-form-group">
                  <label>Organizer</label>

                  <SearchableSelect value={form.organizerId} options={memberOptions} onChange={(value) => updateForm("organizerId", value)} placeholder="Select organizer" loading={membersLoading} emptyText="No business members found." />
                </div>

                {/* Status */}

                {editingMeeting && (
                  <div className="br30-meet-crm-form-group">
                    <label>Status</label>

                    <select className="br30-meet-crm-select" value={form.status} onChange={(event) => updateForm("status", event.target.value)}>
                      <option value="SCHEDULED">Scheduled</option>

                      <option value="IN_PROGRESS">In Progress</option>

                      <option value="COMPLETED">Completed</option>

                      <option value="CANCELLED">Cancelled</option>

                      <option value="NO_SHOW">No Show</option>
                    </select>
                  </div>
                )}

                {/* Location */}

                <div className="br30-meet-crm-form-group">
                  <label>Location</label>

                  <input type="text" className="br30-meet-crm-input" placeholder="Office / Client location" value={form.location} onChange={(event) => updateForm("location", event.target.value)} maxLength={500} />
                </div>

                {/* Meeting URL */}

                <div className="br30-meet-crm-form-group">
                  <label>Meeting URL</label>

                  <input type="url" className="br30-meet-crm-input" placeholder="https://meet.google.com/..." value={form.meetingUrl} onChange={(event) => updateForm("meetingUrl", event.target.value)} />
                </div>

                {/* Description */}

                <div className="br30-meet-crm-form-group br30-meet-full">
                  <label>Description</label>

                  <textarea className="br30-meet-crm-textarea" placeholder="Enter meeting description..." value={form.description} onChange={(event) => updateForm("description", event.target.value)} maxLength={5000} rows={4} />
                </div>

                {/* Related CRM */}

                <div className="br30-meet-meeting-form-section br30-meet-full">
                  <div className="br30-meet-meeting-section-title">Related CRM Record</div>

                  <div className="br30-meet-meeting-form-grid br30-meet-inner-grid">
                    <div className="br30-meet-crm-form-group">
                      <label>Related Type</label>

                      <select
                        className="br30-meet-crm-select"
                        value={form.relatedType}
                        onChange={(event) => {
                          updateForm("relatedType", event.target.value);

                          updateForm("relatedId", "");
                        }}>
                        <option value="">None</option>

                        <option value="LEAD">Lead</option>

                        <option value="CONTACT">Contact</option>

                        <option value="COMPANY">Company</option>

                        <option value="DEAL">Deal</option>
                      </select>
                    </div>

                    <div className="br30-meet-crm-form-group">
                      <label>Related Record</label>

                      <SearchableSelect
                        value={form.relatedId}
                        options={relatedOptions}
                        onChange={(value) => updateForm("relatedId", value)}
                        placeholder={form.relatedType ? `Search ${form.relatedType.toLowerCase()}...` : "Select type first"}
                        disabled={!form.relatedType}
                        loading={recordsLoading}
                        emptyText={`No ${form.relatedType ? form.relatedType.toLowerCase() : "related"} records found.`}
                      />
                    </div>
                  </div>
                </div>

                {/* Attendees */}

                <div className="br30-meet-meeting-form-section br30-meet-full">
                  <div className="br30-meet-meeting-section-title">Attendees</div>

                  <div className="br30-meet-meeting-attendee-picker">
                    <SearchableSelect
                      value=""
                      options={memberOptions.filter((option) => !form.attendees.some((attendee) => String(attendee.userId) === String(option.value)))}
                      onChange={addAttendee}
                      placeholder="Search and add attendee..."
                      loading={membersLoading}
                      emptyText="No available business members."
                    />

                    <div className="br30-meet-meeting-attendee-picker-icon">
                      <UserPlus size={16} />
                    </div>
                  </div>

                  {form.attendees.length > 0 && (
                    <div className="br30-meet-meeting-attendee-list">
                      {form.attendees.map((attendee, index) => (
                        <div className="br30-meet-meeting-attendee-item" key={`${attendee.userId}-${index}`}>
                          <div>
                            <strong>{attendee.name || "Attendee"}</strong>

                            {attendee.email && <span>{attendee.email}</span>}
                          </div>

                          <button type="button" className="br30-meet-crm-icon-btn" onClick={() => removeAttendee(index)} title="Remove attendee">
                            <X size={15} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Reminders */}

                <div className="br30-meet-meeting-form-section br30-meet-full">
                  <div className="br30-meet-meeting-section-title-row">
                    <div className="br30-meet-meeting-section-title">
                      <Bell size={14} />
                      Reminders
                    </div>

                    <button type="button" className="br30-meet-crm-secondary-btn" onClick={addReminder}>
                      <Plus size={15} />
                      Add Reminder
                    </button>
                  </div>

                  {form.reminders.map((reminder, index) => (
                    <div className="br30-meet-meeting-reminder-row" key={index}>
                      <div className="br30-meet-crm-form-group">
                        <label>Minutes Before</label>

                        <input type="number" min="0" max="10080" className="br30-meet-crm-input" value={reminder.minutesBefore} onChange={(event) => updateReminder(index, "minutesBefore", event.target.value)} />
                      </div>

                      <div className="br30-meet-crm-form-group">
                        <label>Channel</label>

                        <select className="br30-meet-crm-select" value={reminder.channel} onChange={(event) => updateReminder(index, "channel", event.target.value)}>
                          <option value="IN_APP">In App</option>

                          <option value="EMAIL">Email</option>

                          <option value="WHATSAPP">WhatsApp</option>

                          <option value="SMS">SMS</option>
                        </select>
                      </div>

                      <button type="button" className="br30-meet-crm-icon-btn br30-meet-danger-icon" onClick={() => removeReminder(index)} title="Remove reminder">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Notes */}

                <div className="br30-meet-crm-form-group br30-meet-full">
                  <label>Notes</label>

                  <textarea className="br30-meet-crm-textarea" placeholder="Internal meeting notes..." value={form.notes} onChange={(event) => updateForm("notes", event.target.value)} maxLength={5000} rows={3} />
                </div>

                {/* Outcome */}

                {editingMeeting && form.status === "COMPLETED" && (
                  <div className="br30-meet-crm-form-group br30-meet-full">
                    <label>Meeting Outcome</label>

                    <textarea className="br30-meet-crm-textarea" placeholder="Enter meeting outcome..." value={form.outcome} onChange={(event) => updateForm("outcome", event.target.value)} maxLength={5000} rows={3} />
                  </div>
                )}

                {/* Cancellation */}

                {editingMeeting && form.status === "CANCELLED" && (
                  <div className="br30-meet-crm-form-group br30-meet-full">
                    <label>Cancellation Reason</label>

                    <textarea className="br30-meet-crm-textarea" placeholder="Enter cancellation reason..." value={form.cancellationReason} onChange={(event) => updateForm("cancellationReason", event.target.value)} maxLength={2000} rows={3} />
                  </div>
                )}
              </div>

              <div className="br30-meet-meeting-modal-footer">
                <button type="button" className="br30-meet-crm-secondary-btn" onClick={closeModal} disabled={saving}>
                  Cancel
                </button>

                <button type="submit" className="br30-meet-crm-primary-btn" disabled={saving}>
                  {saving ? (
                    <>
                      <span className="br30-meet-meeting-button-spinner" />
                      Saving...
                    </>
                  ) : (
                    <>
                      {editingMeeting ? <Pencil size={16} /> : <Plus size={16} />}

                      {editingMeeting ? "Update Meeting" : "Create Meeting"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Meetings;
