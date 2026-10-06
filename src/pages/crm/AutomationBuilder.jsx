import { Plus, Trash2 } from "lucide-react";

const ACTIONS = [
  ["update_record", "Update record"],
  ["assign_user", "Assign user"],
  ["assign_team", "Assign team"],
  ["add_tag", "Add tag"],
  ["remove_tag", "Remove tag"],
  ["create_task", "Create task"],
  ["create_note", "Create note"],
  ["send_notification", "Send notification"],
  ["send_email", "Send email"],
  ["send_webhook", "Send webhook"],
];
const OPERATORS = ["equals", "not_equals", "contains", "not_contains", "starts_with", "ends_with", "greater_than", "less_than", "greater_than_or_equal", "less_than_or_equal", "is_empty", "is_not_empty", "in", "not_in"];
const inputStyle = { width: "100%", height: 38, border: "1px solid var(--crm-border)", borderRadius: 9, background: "var(--crm-surface)", color: "var(--crm-text)", padding: "0 10px", fontSize: 13, outline: 0 };
const areaStyle = { ...inputStyle, height: 80, padding: "9px 10px", resize: "vertical" };

function optionName(x) {
  const user = x?.userId && typeof x.userId === "object" ? x.userId : x?.user && typeof x.user === "object" ? x.user : null;
  return x?.name || x?.fullName || [x?.firstName, x?.lastName].filter(Boolean).join(" ") || user?.name || user?.fullName || [user?.firstName, user?.lastName].filter(Boolean).join(" ") || x?.email || user?.email || x?.title || x?.teamName || "Unnamed member";
}
function idOf(x) {
  if (!x) return "";

  if (x?.userId && typeof x.userId === "object") {
    return String(x.userId?._id || x.userId?.id || "");
  }

  return String(x?.userId || x?._id || x?.id || "");
}

function ActionConfig({ action, onChange, members = [], teams = [], tags = [] }) {
  const c = action.config || {};
  const set = (key, val) => onChange({ ...action, config: { ...c, [key]: val } });
  const select = (key, items, placeholder) => {
    const val = c[key] || "";
    return (
      <select style={inputStyle} value={val} onChange={(e) => set(key, e.target.value)}>
        <option value="">{placeholder}</option>
        {items.map((x) => (
          <option key={idOf(x)} value={idOf(x)}>
            {optionName(x)}
          </option>
        ))}
      </select>
    );
  };
  const selectMany = (key, items, placeholder) => {
    const val = Array.isArray(c[key]) ? c[key].map(String) : c[key] ? [String(c[key])] : [];
    return (
      <select
        style={{ ...inputStyle, minHeight: 82, height: 82, padding: "8px 10px" }}
        multiple
        value={val}
        onChange={(e) => set(key, Array.from(e.target.selectedOptions).map((option) => option.value))}>
        {items.length === 0 ? <option disabled value="">{placeholder}</option> : null}
        {items.map((x) => (
          <option key={idOf(x)} value={idOf(x)}>
            {optionName(x)}
          </option>
        ))}
      </select>
    );
  };
  if (action.type === "assign_user" || action.type === "send_notification")
    return (
      <div className="auto-config-grid">
        <label>
          {action.type === "assign_user" ? "User" : "Recipient"}
          {action.type === "assign_user" ? select("userId", members, "Select user") : select("recipientId", members, "Select recipient")}
        </label>
        {action.type === "send_notification" && (
          <>
            <label>
              Title
              <input style={inputStyle} value={c.title || ""} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Follow up with new lead" />
            </label>
            <label className="auto-span">
              Message
              <textarea style={areaStyle} value={c.message || ""} onChange={(e) => set("message", e.target.value)} placeholder="e.g. A new lead requires your attention." />
            </label>
          </>
        )}
      </div>
    );
  if (action.type === "assign_team") return <label>Team{select("teamId", teams, "Select team")}</label>;
  if (action.type === "add_tag" || action.type === "remove_tag") return <label>Tag{select("tagId", tags, "Select tag")}</label>;
  if (action.type === "create_task")
    return (
      <div className="auto-config-grid">
        <label>
          Title
          <input style={inputStyle} value={c.title || ""} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Follow up with new lead" />
        </label>
        <label>
          Priority
          <select style={inputStyle} value={c.priority || "MEDIUM"} onChange={(e) => set("priority", e.target.value)}>
            <option>LOW</option>
            <option>MEDIUM</option>
            <option>HIGH</option>
            <option>URGENT</option>
          </select>
        </label>
        <label>
          Description
          <textarea style={areaStyle} value={c.description || ""} onChange={(e) => set("description", e.target.value)} placeholder="e.g. Call the lead and complete the first follow-up." />
        </label>
        <label>
          Due date
          <input style={inputStyle} type="datetime-local" value={c.dueDate ? String(c.dueDate).slice(0, 16) : ""} onChange={(e) => set("dueDate", e.target.value ? new Date(e.target.value).toISOString() : "")} />
        </label>
        <label>Assigned user{select("assignedTo", members, "Optional assignee")}</label>
        <label>
          Tag
          <select
            style={inputStyle}
            value={c.tagId || (Array.isArray(c.tagIds) ? c.tagIds[0] || "" : "")}
            onChange={(e) => onChange({ ...action, config: { ...c, tagId: e.target.value, tagIds: e.target.value ? [e.target.value] : [] } })}>
            <option value="">Optional task tag</option>
            {tags.map((x) => (
              <option key={idOf(x)} value={idOf(x)}>
                {optionName(x)}
              </option>
            ))}
          </select>
        </label>
        <span className="auto-help auto-span">Optional: select a business tag to apply to the task created by this automation.</span>
      </div>
    );
  if (action.type === "create_note")
    return (
      <div className="auto-config-grid">
        <label>
          Title
          <input style={inputStyle} value={c.title || ""} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Follow up with new lead" />
        </label>
        <label className="auto-span">
          Content
          <textarea style={areaStyle} value={c.content || ""} onChange={(e) => set("content", e.target.value)} placeholder="e.g. Follow-up note created by automation." />
          <span className="auto-help">The note is automatically attached to the record that triggered the automation (Lead, Contact, Company or Deal).</span>
        </label>
      </div>
    );
  if (action.type === "send_email")
    return (
      <div className="auto-config-grid">
        <label>
          To
          <input style={inputStyle} value={c.to || ""} onChange={(e) => set("to", e.target.value)} placeholder="email@example.com" />
        </label>
        <label>
          Subject
          <input style={inputStyle} value={c.subject || ""} onChange={(e) => set("subject", e.target.value)} placeholder="e.g. New lead follow-up required" />
        </label>
        <label className="auto-span">
          HTML / message
          <textarea style={areaStyle} value={c.html || c.message || ""} onChange={(e) => set("html", e.target.value)} placeholder="e.g. Hello {{name}}, our team will contact you shortly." />
        </label>
      </div>
    );
  if (action.type === "send_webhook")
    return (
      <div className="auto-config-grid">
        <label className="auto-span">
          URL
          <input style={inputStyle} value={c.url || ""} onChange={(e) => set("url", e.target.value)} placeholder="https://example.com/webhook" />
        </label>
        <label className="auto-span">
          Headers JSON (example: Authorization header JSON)
          <textarea
            style={areaStyle}
            value={typeof c.headers === "string" ? c.headers : JSON.stringify(c.headers || {}, null, 2)}
            onChange={(e) => {
              try {
                set("headers", e.target.value ? JSON.parse(e.target.value) : {});
              } catch {
                set("headers", e.target.value);
              }
            }}
          />
        </label>
      </div>
    );
  return (
    <label className="auto-span">
      Fields / update JSON (example: status to CONTACTED)
      <textarea
        style={areaStyle}
        value={JSON.stringify(c.fields || c.update || {}, null, 2)}
        placeholder='e.g. {"status":"CONTACTED"}'
        onChange={(e) => {
          try {
            set("fields", JSON.parse(e.target.value));
          } catch {}
        }}
      />
    </label>
  );
}

export default function AutomationBuilder({ value, onChange, metadata = {}, members = [], teams = [], tags = [], workflow = false }) {
  const entities = metadata.entities || ["lead", "contact", "company", "deal", "task", "activity", "note"];
  const events = metadata.events || ["created", "updated", "deleted", "status_changed", "assigned", "stage_changed"];
  const fields = metadata.fields?.[value?.trigger?.entity] || [];
  const set = (key, val) => onChange({ ...value, [key]: val });
  const trigger = value.trigger || {};
  const conditions = value.conditions || [];
  const actions = workflow ? value.steps || [] : value.actions || [];
  const setActions = (next) => set(workflow ? "steps" : "actions", next);
  const addCondition = () => set("conditions", [...conditions, { field: fields[0] || "", operator: "equals", value: "" }]);
  const updateCondition = (i, p) =>
    set(
      "conditions",
      conditions.map((x, n) => (n === i ? { ...x, ...p } : x))
    );
  const removeCondition = (i) =>
    set(
      "conditions",
      conditions.filter((_, n) => n !== i)
    );
  const addAction = () => setActions([...actions, { ...(workflow ? { id: `step-${Date.now()}`, name: "New step", delaySeconds: 0, continueOnError: false } : {}), type: "send_notification", config: {} }]);
  const updateAction = (i, p) => setActions(actions.map((x, n) => (n === i ? { ...x, ...p } : x)));
  const removeAction = (i) => setActions(actions.filter((_, n) => n !== i));
  return (
    <div className="auto-builder">
      <div className="auto-section">
        <div className="auto-section-title">Trigger</div>
        <div className="auto-config-grid">
          {(workflow || !workflow) && (
            <label>
              Mode
              <select style={inputStyle} value={trigger.mode || "EVENT"} onChange={(e) => set("trigger", { ...trigger, mode: e.target.value })}>
                <option>EVENT</option>
                <option>SCHEDULE</option>
                <option>MANUAL</option>
              </select>
            </label>
          )}
          <label>
            Entity
            <select style={inputStyle} value={trigger.entity || entities[0]} onChange={(e) => set("trigger", { ...trigger, entity: e.target.value })}>
              {entities.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          <label>
            Event
            <select style={inputStyle} value={trigger.event || events[0]} onChange={(e) => set("trigger", { ...trigger, event: e.target.value })}>
              {events.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          <label>
            Trigger field
            <select style={inputStyle} value={trigger.field || ""} onChange={(e) => set("trigger", { ...trigger, field: e.target.value })}>
              <option value="">No field</option>
              {fields.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          {(trigger.event === "status_changed" || trigger.event === "stage_changed") && (
            <>
              <label>
                From value
                <input style={inputStyle} value={trigger.fromValue ?? ""} placeholder="e.g. NEW" onChange={(e) => set("trigger", { ...trigger, fromValue: e.target.value })} />
              </label>
              <label>
                To value
                <input style={inputStyle} value={trigger.toValue ?? ""} placeholder="e.g. QUALIFIED" onChange={(e) => set("trigger", { ...trigger, toValue: e.target.value })} />
              </label>
            </>
          )}
        </div>
        {trigger.mode === "SCHEDULE" && (
          <div className="auto-config-grid auto-schedule">
            <label>
              Run at
              <input
                style={inputStyle}
                type="datetime-local"
                value={trigger.schedule?.runAt ? String(trigger.schedule.runAt).slice(0, 16) : ""}
                onChange={(e) => set("trigger", { ...trigger, schedule: { ...(trigger.schedule || {}), enabled: true, runAt: e.target.value ? new Date(e.target.value).toISOString() : null } })}
              />
            </label>
            <label>
              Interval seconds (minimum 60)
              <input style={inputStyle} type="number" min="60" value={trigger.schedule?.intervalSeconds || ""} onChange={(e) => set("trigger", { ...trigger, schedule: { ...(trigger.schedule || {}), enabled: true, intervalSeconds: Number(e.target.value) || null } })} />
            </label>
            <label>
              End at
              <input
                style={inputStyle}
                type="datetime-local"
                value={trigger.schedule?.endAt ? String(trigger.schedule.endAt).slice(0, 16) : ""}
                onChange={(e) => set("trigger", { ...trigger, schedule: { ...(trigger.schedule || {}), endAt: e.target.value ? new Date(e.target.value).toISOString() : null } })}
              />
            </label>
            <label>
              Timezone (example: Asia/Kolkata)
              <input style={inputStyle} value={trigger.schedule?.timezone || "UTC"} placeholder="e.g. Asia/Kolkata" onChange={(e) => set("trigger", { ...trigger, schedule: { ...(trigger.schedule || {}), timezone: e.target.value } })} />
            </label>
          </div>
        )}
      </div>
      <div className="auto-section">
        <div className="auto-section-title-row">
          <div>
            <div className="auto-section-title">Conditions</div>
            <div className="auto-help">All rules or any rule can be required before execution.</div>
          </div>
        </div>
        {conditions.length === 0 ? (
          <div className="auto-empty-box">No conditions — the trigger will run without additional rules.</div>
        ) : (
          <div className="auto-rule-list">
            {conditions.map((c, i) => (
              <div className="auto-rule" key={i}>
                <select style={inputStyle} value={c.field || ""} onChange={(e) => updateCondition(i, { field: e.target.value })}>
                  <option value="">Field</option>
                  {fields.map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
                <select style={inputStyle} value={c.operator || "equals"} onChange={(e) => updateCondition(i, { operator: e.target.value })}>
                  {OPERATORS.map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
                <input style={inputStyle} value={Array.isArray(c.value) ? c.value.join(",") : (c.value ?? "")} disabled={["is_empty", "is_not_empty"].includes(c.operator)} onChange={(e) => updateCondition(i, { value: e.target.value })} />
                <button type="button" className="auto-icon-btn danger" onClick={() => removeCondition(i)}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
        {conditions.length > 0 && (
          <label className="auto-logic">
            Condition logic
            <select style={inputStyle} value={value.conditionLogic || "AND"} onChange={(e) => set("conditionLogic", e.target.value)}>
              <option>AND</option>
              <option>OR</option>
            </select>
          </label>
        )}
        <div className="auto-section-footer">
          <button type="button" className="auto-mini-btn" onClick={addCondition}>
            <Plus size={13} /> Add rule
          </button>
        </div>
      </div>
      <div className="auto-section">
        <div className="auto-section-title-row">
          <div>
            <div className="auto-section-title">{workflow ? "Workflow steps" : "Actions"}</div>
            <div className="auto-help">{workflow ? "Run ordered actions with optional delays." : "Run one or more actions after the trigger matches."}</div>
          </div>
        </div>
        <div className="auto-action-list">
          {actions.map((a, i) => (
            <div className="auto-action-card" key={a.id || i}>
              <div className="auto-action-head">
                <strong>{workflow ? `Step ${i + 1}` : `Action ${i + 1}`}</strong>
                <button type="button" className="auto-icon-btn danger" onClick={() => removeAction(i)} disabled={actions.length === 1}>
                  <Trash2 size={14} />
                </button>
              </div>
              {workflow && (
                <div className="auto-config-grid">
                  <label>
                    Name
                    <input style={inputStyle} value={a.name || ""} placeholder="e.g. Create follow-up task" onChange={(e) => updateAction(i, { name: e.target.value })} />
                  </label>
                  <label>
                    Delay before step (seconds)
                    <input style={inputStyle} type="number" min="0" max="2592000" value={a.delaySeconds || 0} placeholder="e.g. 60 seconds" onChange={(e) => updateAction(i, { delaySeconds: Number(e.target.value) || 0 })} />
                  </label>
                </div>
              )}
              <label>
                Action
                <select style={inputStyle} value={a.type || "send_notification"} onChange={(e) => updateAction(i, { type: e.target.value, config: {} })}>
                  {(metadata.actionTypes || ACTIONS.map((x) => x[0])).map((x) => (
                    <option key={x} value={x}>
                      {ACTIONS.find((y) => y[0] === x)?.[1] || x}
                    </option>
                  ))}
                </select>
              </label>
              <div className="auto-action-config">
                <ActionConfig action={a} onChange={(next) => updateAction(i, next)} members={members} teams={teams} tags={tags} />
              </div>
              {workflow && (
                <label className="auto-check">
                  <input type="checkbox" checked={Boolean(a.continueOnError)} onChange={(e) => updateAction(i, { continueOnError: e.target.checked })} /> Continue if this step fails
                </label>
              )}
            </div>
          ))}
        </div>
        <div className="auto-section-footer">
          <button type="button" className="auto-mini-btn" onClick={addAction}>
            <Plus size={13} /> Add {workflow ? "step" : "action"}
          </button>
        </div>
      </div>
      <div className="auto-section">
        <div className="auto-section-title">Execution controls</div>
        <div className="auto-config-grid">
          <label>
            Max runs per record (example: 1)
            <input style={inputStyle} type="number" min="1" placeholder="e.g. 1" value={value.execution?.maxRunsPerRecord || 1} onChange={(e) => set("execution", { ...(value.execution || {}), maxRunsPerRecord: Number(e.target.value) || 1 })} />
          </label>
          <label>
            Cooldown seconds (example: 300)
            <input style={inputStyle} type="number" min="0" placeholder="e.g. 3600" value={value.execution?.cooldownSeconds || 0} onChange={(e) => set("execution", { ...(value.execution || {}), cooldownSeconds: Number(e.target.value) || 0 })} />
          </label>
          <label className="auto-check">
            <input type="checkbox" checked={Boolean(value.execution?.stopOnError)} onChange={(e) => set("execution", { ...(value.execution || {}), stopOnError: e.target.checked })} /> Stop when an action fails
          </label>
        </div>
      </div>
      <style>{`.auto-builder{display:grid;gap:12px}.auto-section{border:1px solid var(--crm-border);border-radius:12px;padding:14px;background:var(--crm-surface)}.auto-section-title{font-size:14px;font-weight:500;color:var(--crm-text)}.auto-section-title-row{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px}.auto-help{font-size:12px;color:var(--crm-muted);margin-top:3px}.auto-config-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:10px}.auto-config-grid label,.auto-logic,.auto-action-card>label{display:grid;gap:6px;font-size:12px;color:var(--crm-muted)}.auto-span{grid-column:1/-1}.auto-rule-list,.auto-action-list{display:grid;gap:9px;margin-top:10px}.auto-section-footer{display:flex;justify-content:flex-end;margin-top:10px}.auto-rule{display:grid;grid-template-columns:1.2fr 1fr 1.2fr 36px;gap:7px;align-items:center}.auto-mini-btn,.auto-icon-btn{border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:8px;height:32px;display:inline-flex;align-items:center;justify-content:center;gap:5px;padding:0 9px;font-size:12px;cursor:pointer}.auto-icon-btn{width:32px;padding:0}.auto-icon-btn.danger{color:var(--crm-danger)}.auto-action-card{border:1px solid var(--crm-border);border-radius:10px;padding:11px;background:var(--crm-surface-2)}.auto-action-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:9px;font-size:13px;color:var(--crm-text)}.auto-action-config{margin-top:9px}.auto-empty-box{padding:14px;border:1px dashed var(--crm-border);border-radius:9px;color:var(--crm-muted);font-size:12px}.auto-logic{max-width:180px;margin-top:10px}.auto-check{display:flex!important;align-items:center;gap:7px!important;margin-top:8px}.auto-check input{accent-color:var(--crm-primary)}@media(max-width:700px){.auto-config-grid{grid-template-columns:1fr}.auto-span{grid-column:auto}.auto-rule{grid-template-columns:1fr 1fr}.auto-rule .auto-icon-btn{grid-column:1/-1;justify-self:end}}`}</style>
    </div>
  );
}
