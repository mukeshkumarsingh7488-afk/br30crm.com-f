import { useEffect, useState } from "react";
import { X, CalendarDays, Clock3, MapPin, Video, FileText } from "lucide-react";

const EMPTY_FORM = {
  type: "MEETING",
  title: "",
  description: "",
  startAt: "",
  endAt: "",
  location: "",
  meetingUrl: "",
  status: "SCHEDULED",
  priority: "MEDIUM",
};

const toDateTimeLocal = (value) => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const pad = (value) => String(value).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const toISOString = (value) => {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
};

function CalendarEventModal({ open, mode = "create", event = null, onClose, onSave, saving = false }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    if (event) {
      if (event.kind === "MEETING") {
        setForm({
          type: "MEETING",
          title: event.raw?.title || event.title || "",
          description: event.raw?.description || "",
          startAt: toDateTimeLocal(event.raw?.startAt || event.start),
          endAt: toDateTimeLocal(event.raw?.endAt || event.end),
          location: event.raw?.location || "",
          meetingUrl: event.raw?.meetingUrl || "",
          status: event.raw?.status || "SCHEDULED",
          priority: "MEDIUM",
        });
      } else {
        setForm({
          type: event.raw?.type || "TASK",
          title: event.raw?.subject || event.title || "",
          description: event.raw?.description || "",
          startAt: toDateTimeLocal(event.raw?.dueAt || event.start),
          endAt: toDateTimeLocal(event.raw?.dueAt || event.end),
          location: event.raw?.location || "",
          meetingUrl: "",
          status: event.raw?.status || "PLANNED",
          priority: event.raw?.priority || "MEDIUM",
        });
      }
    } else {
      setForm(EMPTY_FORM);
    }

    setError("");
  }, [open, event]);

  if (!open) {
    return null;
  }

  const updateField = (name, value) => {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (eventObject) => {
    eventObject.preventDefault();

    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }

    if (!form.startAt) {
      setError("Start date and time are required.");
      return;
    }

    if (!form.endAt) {
      setError("End date and time are required.");
      return;
    }

    const start = new Date(form.startAt);
    const end = new Date(form.endAt);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      setError("Please select valid date and time.");
      return;
    }

    if (end <= start) {
      setError("End time must be after start time.");
      return;
    }

    if (form.meetingUrl && !/^https?:\/\/.+/i.test(form.meetingUrl.trim())) {
      setError("Meeting URL must start with http:// or https://.");
      return;
    }

    const payload =
      form.type === "MEETING"
        ? {
            title: form.title.trim(),
            description: form.description.trim() || null,
            startAt: toISOString(form.startAt),
            endAt: toISOString(form.endAt),
            timezone: "Asia/Kolkata",
            location: form.location.trim() || null,
            meetingUrl: form.meetingUrl.trim() || null,
            status: form.status || "SCHEDULED",
            attendees: [],
            relatedTo: null,
            reminders: [],
            notes: null,
          }
        : {
            type: form.type,
            subject: form.title.trim(),
            description: form.description.trim() || null,
            status: form.status || "PLANNED",
            priority: form.priority || "MEDIUM",
            dueAt: toISOString(form.startAt),
            assignedTo: null,
            contactId: null,
            companyId: null,
            leadId: null,
            dealId: null,
            location: form.location.trim() || null,
            reminderAt: null,
            outcome: null,
            tags: [],
          };

    await onSave(payload);
  };

  return (
    <div className="br30-calendar-modal-backdrop" onMouseDown={onClose}>
      <div className="br30-calendar-modal" onMouseDown={(eventObject) => eventObject.stopPropagation()}>
        <div className="br30-calendar-modal-header">
          <div>
            <div className="br30-calendar-modal-eyebrow">{mode === "edit" ? "Edit event" : "New event"}</div>

            <h2>{mode === "edit" ? "Update calendar event" : "Create calendar event"}</h2>
          </div>

          <button type="button" onClick={onClose} className="br30-calendar-modal-close">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="br30-calendar-modal-body">
            <div className="br30-calendar-form-grid">
              <label className="br30-calendar-field br30-calendar-field-full">
                <span>Event type</span>

                <select value={form.type} onChange={(eventObject) => updateField("type", eventObject.target.value)} disabled={mode === "edit"}>
                  <option value="MEETING">Meeting</option>
                  <option value="CALL">Call</option>
                  <option value="TASK">Task</option>
                  <option value="EMAIL">Email</option>
                  <option value="FOLLOW_UP">Follow up</option>
                  <option value="NOTE">Note</option>
                  <option value="OTHER">Other</option>
                </select>
              </label>

              <label className="br30-calendar-field br30-calendar-field-full">
                <span>Title</span>

                <div className="br30-calendar-input-icon">
                  <CalendarDays size={16} />

                  <input value={form.title} onChange={(eventObject) => updateField("title", eventObject.target.value)} placeholder="Enter event title" />
                </div>
              </label>

              <label className="br30-calendar-field">
                <span>Start</span>

                <div className="br30-calendar-input-icon">
                  <Clock3 size={16} />

                  <input type="datetime-local" value={form.startAt} onChange={(eventObject) => updateField("startAt", eventObject.target.value)} />
                </div>
              </label>

              <label className="br30-calendar-field">
                <span>End</span>

                <div className="br30-calendar-input-icon">
                  <Clock3 size={16} />

                  <input type="datetime-local" value={form.endAt} onChange={(eventObject) => updateField("endAt", eventObject.target.value)} />
                </div>
              </label>

              {form.type === "MEETING" ? (
                <>
                  <label className="br30-calendar-field">
                    <span>Status</span>

                    <select value={form.status} onChange={(eventObject) => updateField("status", eventObject.target.value)}>
                      <option value="SCHEDULED">Scheduled</option>
                      <option value="IN_PROGRESS">In progress</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                      <option value="NO_SHOW">No show</option>
                    </select>
                  </label>

                  <label className="br30-calendar-field">
                    <span>Location</span>

                    <div className="br30-calendar-input-icon">
                      <MapPin size={16} />

                      <input value={form.location} onChange={(eventObject) => updateField("location", eventObject.target.value)} placeholder="Office / location" />
                    </div>
                  </label>

                  <label className="br30-calendar-field br30-calendar-field-full">
                    <span>Meeting URL</span>

                    <div className="br30-calendar-input-icon">
                      <Video size={16} />

                      <input value={form.meetingUrl} onChange={(eventObject) => updateField("meetingUrl", eventObject.target.value)} placeholder="https://meet.google.com/..." />
                    </div>
                  </label>
                </>
              ) : (
                <>
                  <label className="br30-calendar-field">
                    <span>Status</span>

                    <select value={form.status} onChange={(eventObject) => updateField("status", eventObject.target.value)}>
                      <option value="PLANNED">Planned</option>
                      <option value="IN_PROGRESS">In progress</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </label>

                  <label className="br30-calendar-field">
                    <span>Priority</span>

                    <select value={form.priority} onChange={(eventObject) => updateField("priority", eventObject.target.value)}>
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="URGENT">Urgent</option>
                    </select>
                  </label>

                  <label className="br30-calendar-field br30-calendar-field-full">
                    <span>Location</span>

                    <div className="br30-calendar-input-icon">
                      <MapPin size={16} />

                      <input value={form.location} onChange={(eventObject) => updateField("location", eventObject.target.value)} placeholder="Location" />
                    </div>
                  </label>
                </>
              )}

              <label className="br30-calendar-field br30-calendar-field-full">
                <span>Description</span>

                <div className="br30-calendar-input-icon br30-calendar-textarea-icon">
                  <FileText size={16} />

                  <textarea value={form.description} onChange={(eventObject) => updateField("description", eventObject.target.value)} placeholder="Add notes or description..." rows={4} />
                </div>
              </label>
            </div>

            {error ? <div className="br30-calendar-form-error">{error}</div> : null}
          </div>

          <div className="br30-calendar-modal-footer">
            <button type="button" className="br30-calendar-btn" onClick={onClose} disabled={saving}>
              Cancel
            </button>

            <button type="submit" className="br30-calendar-btn br30-calendar-btn-primary" disabled={saving}>
              {saving ? "Saving..." : mode === "edit" ? "Save changes" : "Create event"}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .br30-calendar-modal-backdrop{position:fixed;inset:0;z-index:9999;background:rgba(15,23,42,.48);display:flex;align-items:center;justify-content:center;padding:20px}
        .br30-calendar-modal{width:min(680px,100%);max-height:calc(100vh - 40px);overflow:auto;background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:16px;box-shadow:0 24px 70px rgba(15,23,42,.24);color:var(--crm-text)}
        .br30-calendar-modal-header{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;padding:20px 22px;border-bottom:1px solid var(--crm-border)}
        .br30-calendar-modal-eyebrow{font-size:13px;font-weight:400;text-transform:uppercase;letter-spacing:.09em;color:var(--crm-primary);margin-bottom:5px}
        .br30-calendar-modal-header h2{margin:0;font-size:20px;line-height:1.2;font-weight:400;color:var(--crm-text)}
        .br30-calendar-modal-close{width:34px;height:34px;border:1px solid var(--crm-border);border-radius:9px;background:var(--crm-surface);color:var(--crm-muted);display:flex;align-items:center;justify-content:center;cursor:pointer}
        .br30-calendar-modal-close:hover{border-color:var(--crm-primary);color:var(--crm-primary)}
        .br30-calendar-modal-body{padding:20px 22px}
        .br30-calendar-form-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:15px}
        .br30-calendar-field{display:flex;flex-direction:column;gap:7px;min-width:0}
        .br30-calendar-field-full{grid-column:1/-1}
        .br30-calendar-field>span{font-size:13px;font-weight:400;color:var(--crm-muted)}
        .br30-calendar-field input,.br30-calendar-field select,.br30-calendar-field textarea{width:100%;box-sizing:border-box;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:9px;outline:none;font-size:13px;font-family:inherit}
        .br30-calendar-field input,.br30-calendar-field select{height:40px;padding:0 11px}
        .br30-calendar-field textarea{padding:10px 11px;resize:vertical;min-height:95px}
        .br30-calendar-field input:focus,.br30-calendar-field select:focus,.br30-calendar-field textarea:focus{border-color:var(--crm-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--crm-primary) 10%,transparent)}
        .br30-calendar-input-icon{display:flex;align-items:center;gap:8px;border:1px solid var(--crm-border);background:var(--crm-surface);border-radius:9px;padding:0 10px;color:var(--crm-muted)}
        .br30-calendar-input-icon:focus-within{border-color:var(--crm-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--crm-primary) 10%,transparent)}
        .br30-calendar-input-icon input,.br30-calendar-input-icon textarea{border:0!important;box-shadow:none!important;padding-left:0}
        .br30-calendar-input-icon input{height:38px}
        .br30-calendar-textarea-icon{align-items:flex-start;padding-top:9px}
        .br30-calendar-form-error{margin-top:16px;border:1px solid color-mix(in srgb,var(--crm-danger) 35%,var(--crm-border));background:color-mix(in srgb,var(--crm-danger) 7%,transparent);color:var(--crm-danger);border-radius:9px;padding:10px 12px;font-size:13px}
        .br30-calendar-modal-footer{display:flex;justify-content:flex-end;gap:8px;padding:15px 22px;border-top:1px solid var(--crm-border)}
        .br30-calendar-btn{height:38px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:9px;padding:0 15px;font-size:13px;font-weight:400;cursor:pointer}
        .br30-calendar-btn:disabled{opacity:.55;cursor:not-allowed}
        .br30-calendar-btn-primary{background:var(--crm-primary);border-color:var(--crm-primary);color:#fff}
        @media(max-width:650px){.br30-calendar-form-grid{grid-template-columns:1fr}.br30-calendar-field-full{grid-column:auto}.br30-calendar-modal-header,.br30-calendar-modal-body,.br30-calendar-modal-footer{padding-left:15px;padding-right:15px}}
      `}</style>
    </div>
  );
}

export default CalendarEventModal;
