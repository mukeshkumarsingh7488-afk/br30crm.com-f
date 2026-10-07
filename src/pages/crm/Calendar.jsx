import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Clock3, MapPin, Plus, RefreshCw, Search, Video, X, Pencil, Trash2, List, Grid2X2, CalendarRange } from "lucide-react";

import useBusiness from "../../hooks/useBusiness";

import { getCalendarMeetings, createCalendarMeeting, updateCalendarMeeting, deleteCalendarMeeting, getCalendarActivities, createCalendarActivity, updateCalendarActivity, deleteCalendarActivity, extractMeetingRows, extractActivityRows } from "../../api/calendar.api";

import { showAuthAlert } from "../../components/auth/authAlert";

import CalendarEventModal from "./CalendarEventModal";

const VIEW_OPTIONS = [
  { value: "month", label: "Month" },
  { value: "week", label: "Week" },
  { value: "day", label: "Day" },
  { value: "agenda", label: "Agenda" },
];

const STATUS_OPTIONS = [
  { value: "", label: "All status" },
  { value: "SCHEDULED", label: "Scheduled" },
  { value: "IN_PROGRESS", label: "In progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "NO_SHOW", label: "No show" },
];

const getId = (value) => {
  if (!value) return "";

  if (typeof value === "string") {
    return value;
  }

  return value?._id || value?.id || "";
};

const getErrorMessage = (error, fallback = "Something went wrong.") => {
  const data = error?.response?.data;

  if (Array.isArray(data?.details) && data.details.length) {
    return data.details
      .map((item) => item?.message || item?.msg)
      .filter(Boolean)
      .join(", ");
  }

  if (Array.isArray(data?.errors) && data.errors.length) {
    return data.errors
      .map((item) => item?.message || item?.msg)
      .filter(Boolean)
      .join(", ");
  }

  return data?.message || data?.error?.message || data?.error || error?.message || fallback;
};

const startOfDay = (date) => {
  const value = new Date(date);

  value.setHours(0, 0, 0, 0);

  return value;
};

const endOfDay = (date) => {
  const value = new Date(date);

  value.setHours(23, 59, 59, 999);

  return value;
};

const startOfWeek = (date) => {
  const value = startOfDay(date);
  const day = value.getDay();

  value.setDate(value.getDate() - day);

  return value;
};

const endOfWeek = (date) => {
  const value = startOfWeek(date);

  value.setDate(value.getDate() + 6);
  value.setHours(23, 59, 59, 999);

  return value;
};

const startOfMonth = (date) => {
  const value = new Date(date);

  value.setDate(1);
  value.setHours(0, 0, 0, 0);

  return value;
};

const endOfMonth = (date) => {
  const value = new Date(date);

  value.setMonth(value.getMonth() + 1, 0);
  value.setHours(23, 59, 59, 999);

  return value;
};

const formatDateKey = (date) => {
  const value = new Date(date);

  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
};

const formatMonthTitle = (date) =>
  new Intl.DateTimeFormat("en-IN", {
    month: "long",
    year: "numeric",
  }).format(date);

const formatDayTitle = (date) =>
  new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);

const formatShortDate = (date) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
  }).format(date);

const formatTime = (value) => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getEventEnd = (event) => {
  if (event.end) {
    return new Date(event.end);
  }

  return new Date(new Date(event.start).getTime() + 60 * 60 * 1000);
};

const normalizeMeeting = (meeting) => ({
  id: `meeting-${meeting?._id}`,
  sourceId: meeting?._id,
  kind: "MEETING",
  title: meeting?.title || "Untitled meeting",
  start: meeting?.startAt,
  end: meeting?.endAt || meeting?.startAt,
  status: meeting?.status || "SCHEDULED",
  location: meeting?.location || "",
  meetingUrl: meeting?.meetingUrl || "",
  description: meeting?.description || "",
  raw: meeting,
});

const normalizeActivity = (activity) => {
  const start = activity?.dueAt || activity?.createdAt;

  return {
    id: `activity-${activity?._id}`,
    sourceId: activity?._id,
    kind: "ACTIVITY",
    title: activity?.subject || "Untitled activity",
    start,
    end: start,
    status: activity?.status || "PLANNED",
    type: activity?.type || "OTHER",
    priority: activity?.priority || "MEDIUM",
    location: activity?.location || "",
    description: activity?.description || "",
    raw: activity,
  };
};

const getEventClass = (event) => {
  if (event.kind === "MEETING") {
    switch (event.status) {
      case "COMPLETED":
        return "completed";

      case "CANCELLED":
        return "cancelled";

      case "IN_PROGRESS":
        return "progress";

      case "NO_SHOW":
        return "no-show";

      default:
        return "meeting";
    }
  }

  if (event.status === "COMPLETED") {
    return "activity-completed";
  }

  if (event.priority === "URGENT") {
    return "activity-urgent";
  }

  return "activity";
};

const getWeekDays = (date) => {
  const first = startOfWeek(date);

  return Array.from({ length: 7 }, (_, index) => {
    const value = new Date(first);

    value.setDate(first.getDate() + index);

    return value;
  });
};

const getMonthCells = (date) => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);

  const gridStart = startOfWeek(monthStart);
  const gridEnd = endOfWeek(monthEnd);

  const cells = [];

  const current = new Date(gridStart);

  while (current <= gridEnd) {
    cells.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return cells;
};

const isSameDay = (a, b) => formatDateKey(a) === formatDateKey(b);

const getEventsForDay = (events, date) => {
  const dayStart = startOfDay(date);
  const dayEnd = endOfDay(date);

  return events.filter((event) => {
    const start = new Date(event.start);
    const end = getEventEnd(event);

    return start <= dayEnd && end >= dayStart;
  });
};

const getBusinessDateRange = (view, date) => {
  if (view === "day") {
    return {
      from: startOfDay(date),
      to: endOfDay(date),
    };
  }

  if (view === "week") {
    return {
      from: startOfWeek(date),
      to: endOfWeek(date),
    };
  }

  if (view === "agenda") {
    return {
      from: startOfDay(date),
      to: new Date(new Date(date).setDate(date.getDate() + 30)),
    };
  }

  return {
    from: startOfWeek(startOfMonth(date)),
    to: endOfWeek(endOfMonth(date)),
  };
};

export default function Calendar() {
  const { businessId, loading: businessLoading } = useBusiness();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("month");

  const [meetings, setMeetings] = useState([]);
  const [activities, setActivities] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [modal, setModal] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const loadCalendar = useCallback(
    async (silent = false) => {
      if (!businessId) {
        return;
      }

      setLoading(true);

      try {
        const range = getBusinessDateRange(view, currentDate);

        const from = range.from.toISOString();
        const to = range.to.toISOString();

        const [meetingResponse, activityResponse] = await Promise.all([
          getCalendarMeetings(businessId, {
            page: 1,
            limit: 100,
            from,
            to,
            ...(statusFilter ? { status: statusFilter } : {}),
          }),

          getCalendarActivities(businessId, {
            page: 1,
            limit: 100,
          }),
        ]);

        setMeetings(extractMeetingRows(meetingResponse));
        setActivities(extractActivityRows(activityResponse));
      } catch (error) {
        if (!silent) {
          await showAuthAlert({
            icon: "error",
            title: "Unable to load calendar",
            text: getErrorMessage(error, "Unable to load calendar events."),
            confirmButtonText: "OK",
          });
        }
      } finally {
        setLoading(false);
      }
    },
    [businessId, currentDate, view, statusFilter]
  );

  useEffect(() => {
    if (!businessLoading && businessId) {
      loadCalendar();
    }
  }, [businessLoading, businessId, loadCalendar]);

  const events = useMemo(() => {
    const meetingEvents = meetings.filter((meeting) => meeting?._id).map(normalizeMeeting);

    const activityEvents = activities.filter((activity) => activity?._id && (activity?.dueAt || activity?.createdAt)).map(normalizeActivity);

    const all = [...meetingEvents, ...activityEvents];

    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return all;
    }

    return all.filter((event) => {
      const raw = event?.raw || {};

      const organizer = raw?.organizerId;

      const organizerName = organizer?.name || [organizer?.firstName, organizer?.lastName].filter(Boolean).join(" ") || "";

      const organizerEmail = organizer?.email || "";

      const attendeesText = Array.isArray(raw?.attendees) ? raw.attendees.map((attendee) => [attendee?.name, attendee?.email, attendee?.response, attendee?.userId].filter(Boolean).join(" ")).join(" ") : "";

      const relatedText = raw?.relatedTo ? [raw.relatedTo?.type, raw.relatedTo?.id].filter(Boolean).join(" ") : "";

      const tagsText = Array.isArray(raw?.tags) ? raw.tags.map((tag) => (typeof tag === "string" ? tag : tag?.name || tag?.title || tag?.label || tag?.slug || "")).join(" ") : "";

      const searchable = [
        event?.title,
        event?.kind,
        event?.type,
        event?.status,
        event?.priority,
        event?.location,
        event?.meetingUrl,
        event?.description,

        raw?.title,
        raw?.subject,
        raw?.description,
        raw?.outcome,
        raw?.notes,
        raw?.location,
        raw?.meetingUrl,
        raw?.type,
        raw?.status,
        raw?.priority,

        organizerName,
        organizerEmail,
        attendeesText,
        relatedText,
        tagsText,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(normalizedSearch);
    });
  }, [meetings, activities, search]);

  const stats = useMemo(() => {
    const total = events.length;
    const meetingsCount = events.filter((event) => event.kind === "MEETING").length;
    const activitiesCount = events.filter((event) => event.kind === "ACTIVITY").length;
    const completed = events.filter((event) => event.status === "COMPLETED").length;
    const upcoming = events.filter((event) => {
      const start = new Date(event.start);
      return !Number.isNaN(start.getTime()) && start >= new Date() && event.status !== "CANCELLED";
    }).length;

    return {
      total,
      meetingsCount,
      activitiesCount,
      completed,
      upcoming,
    };
  }, [events]);

  const moveDate = (direction) => {
    setCurrentDate((current) => {
      const next = new Date(current);

      if (view === "month") {
        next.setMonth(next.getMonth() + direction);
      } else if (view === "week") {
        next.setDate(next.getDate() + direction * 7);
      } else {
        next.setDate(next.getDate() + direction);
      }

      return next;
    });
  };

  const goToday = () => {
    setCurrentDate(new Date());
  };

  const openCreate = (date = currentDate) => {
    const base = new Date(date);

    if (view !== "day") {
      base.setHours(10, 0, 0, 0);
    }

    const end = new Date(base);
    end.setHours(base.getHours() + 1);

    setModal({
      mode: "create",
      event: null,
      initialStart: base,
      initialEnd: end,
    });
  };

  const openEvent = (event) => {
    setSelectedEvent(event);
  };

  const openEdit = (event) => {
    setSelectedEvent(null);

    setModal({
      mode: "edit",
      event,
    });
  };

  const handleDelete = async (event) => {
    if (!businessId || !event?.sourceId) {
      return;
    }

    const result = await showAuthAlert({
      icon: "warning",
      title: `Delete ${event.kind === "MEETING" ? "meeting" : "activity"}?`,
      text: "This action cannot be undone.",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (!result?.isConfirmed) {
      return;
    }

    try {
      setSaving(true);

      if (event.kind === "MEETING") {
        await deleteCalendarMeeting(businessId, event.sourceId);
      } else {
        await deleteCalendarActivity(businessId, event.sourceId);
      }

      setSelectedEvent(null);

      await loadCalendar();

      await showAuthAlert({
        icon: "success",
        title: "Event deleted",
        text: "Calendar event deleted successfully.",
        confirmButtonText: "Done",
      });
    } catch (error) {
      await showAuthAlert({
        icon: "error",
        title: "Unable to delete event",
        text: getErrorMessage(error, "Unable to delete calendar event."),
        confirmButtonText: "OK",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async (payload) => {
    if (!businessId || !modal) {
      return;
    }

    const currentModal = modal;

    try {
      setSaving(true);

      if (currentModal.event?.kind === "MEETING") {
        await updateCalendarMeeting(businessId, currentModal.event.sourceId, payload);
      } else if (currentModal.event?.kind === "ACTIVITY") {
        await updateCalendarActivity(businessId, currentModal.event.sourceId, payload);
      } else if (payload?.title !== undefined) {
        await createCalendarMeeting(businessId, payload);
      } else {
        await createCalendarActivity(businessId, payload);
      }

      setModal(null);

      await loadCalendar();

      await showAuthAlert({
        icon: "success",
        title: currentModal.mode === "edit" ? "Event updated" : "Event created",
        text: currentModal.mode === "edit" ? "Calendar event updated successfully." : "Calendar event created successfully.",
        confirmButtonText: "Done",
      });
    } catch (error) {
      await showAuthAlert({
        icon: "error",
        title: currentModal.mode === "edit" ? "Unable to update event" : "Unable to create event",
        text: getErrorMessage(error, "Unable to save calendar event."),
        confirmButtonText: "OK",
      });
    } finally {
      setSaving(false);
    }
  };

  const renderEvent = (event) => {
    return (
      <button
        type="button"
        key={event.id}
        className={`br30-calendar-event ${getEventClass(event)} ${search.trim() ? "br30-calendar-event-search-match" : ""}`}
        onClick={(clickEvent) => {
          clickEvent.stopPropagation();
          openEvent(event);
        }}>
        <span className="br30-calendar-event-time">{formatTime(event.start)}</span>

        <span className="br30-calendar-event-title">{event.title}</span>
      </button>
    );
  };

  const renderMonth = () => {
    const cells = getMonthCells(currentDate);

    return (
      <div className="br30-calendar-month">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="br30-calendar-weekday">
            {day}
          </div>
        ))}

        {cells.map((date) => {
          const dayEvents = getEventsForDay(events, date);

          const outside = date.getMonth() !== currentDate.getMonth();

          const today = isSameDay(date, new Date());

          return (
            <div key={formatDateKey(date)} className={`br30-calendar-day-cell ${outside ? "outside" : ""} ${today ? "today" : ""}`} onDoubleClick={() => openCreate(date)}>
              <div className="br30-calendar-day-header">
                <span>{date.getDate()}</span>

                {today ? <small>Today</small> : null}
              </div>

              <div className="br30-calendar-day-events">
                {dayEvents.slice(0, 4).map(renderEvent)}

                {dayEvents.length > 4 ? (
                  <button type="button" className="br30-calendar-more" onClick={() => setView("day")}>
                    +{dayEvents.length - 4} more
                  </button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderWeek = () => {
    const days = getWeekDays(currentDate);

    return (
      <div className="br30-calendar-week">
        <div className="br30-calendar-week-head">
          {days.map((date) => (
            <div key={formatDateKey(date)} className={`br30-calendar-week-day-head ${isSameDay(date, new Date()) ? "today" : ""}`}>
              <span>
                {date.toLocaleDateString("en-IN", {
                  weekday: "short",
                })}
              </span>

              <strong>{date.getDate()}</strong>
            </div>
          ))}
        </div>

        <div className="br30-calendar-week-body">
          {days.map((date) => {
            const dayEvents = getEventsForDay(events, date);

            return (
              <div key={formatDateKey(date)} className="br30-calendar-week-column" onDoubleClick={() => openCreate(date)}>
                {dayEvents.map(renderEvent)}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDay = () => {
    const dayEvents = getEventsForDay(events, currentDate);

    return (
      <div className="br30-calendar-day-view">
        <div className="br30-calendar-day-view-head">{formatDayTitle(currentDate)}</div>

        <div className="br30-calendar-day-timeline">
          {Array.from({ length: 24 }, (_, hour) => (
            <div
              key={hour}
              className="br30-calendar-hour-row"
              onDoubleClick={() => {
                const date = new Date(currentDate);

                date.setHours(hour, 0, 0, 0);

                openCreate(date);
              }}>
              <span>{String(hour).padStart(2, "0")}:00</span>

              <div>
                {dayEvents
                  .filter((event) => {
                    const date = new Date(event.start);

                    return date.getHours() === hour;
                  })
                  .map(renderEvent)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAgenda = () => {
    const sorted = [...events].sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

    if (!sorted.length) {
      return (
        <div className="br30-calendar-empty">
          <CalendarDays size={30} />
          <strong>No calendar events</strong>
          <span>There are no events in this period.</span>
        </div>
      );
    }

    return (
      <div className="br30-calendar-agenda">
        {sorted.map((event) => (
          <button type="button" key={event.id} className="br30-calendar-agenda-item" onClick={() => openEvent(event)}>
            <div className={`br30-calendar-agenda-dot ${getEventClass(event)}`} />

            <div className="br30-calendar-agenda-main">
              <strong>{event.title}</strong>

              <span>
                {new Date(event.start).toLocaleString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            <span className="br30-calendar-agenda-type">{event.kind === "MEETING" ? "Meeting" : event.type || "Activity"}</span>
          </button>
        ))}
      </div>
    );
  };

  let headerTitle = formatMonthTitle(currentDate);

  if (view === "week") {
    const days = getWeekDays(currentDate);

    headerTitle = `${formatShortDate(days[0])} – ${formatShortDate(days[6])} ${currentDate.getFullYear()}`;
  }

  if (view === "day") {
    headerTitle = formatDayTitle(currentDate);
  }

  if (view === "agenda") {
    headerTitle = `Agenda · ${formatMonthTitle(currentDate)}`;
  }

  return (
    <div className="br30-calendar-page">
      <style>{`
        .br30-calendar-page{padding:24px 26px 40px;color:var(--crm-text);min-width:0}
        .br30-calendar-head{display:flex;align-items:flex-end;justify-content:space-between;gap:18px;margin-bottom:18px}
        .br30-calendar-head-left{min-width:0}
        .br30-calendar-title{margin:0;font-size:26px;line-height:1.15;font-weight:400;color:var(--crm-text);letter-spacing:-.3px}
        .br30-calendar-subtitle{margin:6px 0 0;color:var(--crm-muted);font-size:13px}
        .br30-calendar-head-actions{display:flex;align-items:center;gap:8px}
        .br30-calendar-btn{height:38px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:9px;padding:0 13px;display:inline-flex;align-items:center;justify-content:center;gap:7px;font-size:13px;font-weight:400;cursor:pointer}
        .br30-calendar-btn:hover{border-color:var(--crm-primary);color:var(--crm-primary)}
        .br30-calendar-btn-primary{background:var(--crm-primary);border-color:var(--crm-primary);color:#fff}
        .br30-calendar-btn-primary:hover{background:var(--crm-primary);border-color:var(--crm-primary);color:#fff;filter:brightness(.96)}
        .br30-calendar-btn:disabled{opacity:.55;cursor:not-allowed}
        .br30-calendar-stats{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px;margin-bottom:16px}
        .br30-calendar-stat{border:1px solid var(--crm-border);background:var(--crm-surface);border-radius:12px;padding:12px 13px;box-shadow:var(--crm-shadow);min-width:0}
        .br30-calendar-stat-label{font-size:13px;color:var(--crm-muted);font-weight:400;text-transform:uppercase;letter-spacing:.06em}
        .br30-calendar-stat-value{font-size:21px;font-weight:400;color:var(--crm-text);margin-top:5px}
        .br30-calendar-toolbar{border:1px solid var(--crm-border);background:var(--crm-surface);border-radius:12px;padding:10px;display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px}
        .br30-calendar-toolbar-left,.br30-calendar-toolbar-right{display:flex;align-items:center;gap:7px}
        .br30-calendar-search{height:38px;width:240px;border:1px solid var(--crm-border);background:var(--crm-surface);border-radius:9px;display:flex;align-items:center;gap:8px;padding:0 10px;color:var(--crm-muted)}
        .br30-calendar-search input{border:0;outline:0;background:transparent;color:var(--crm-text);width:100%;font-size:13px}
        .br30-calendar-search input::placeholder{color:var(--crm-muted)}
        .br30-calendar-search button{border:0;background:transparent;color:var(--crm-muted);display:flex;cursor:pointer;padding:2px}
        .br30-calendar-search-results{border:1px solid var(--crm-border);background:var(--crm-surface);border-radius:12px;padding:10px;margin-bottom:12px;box-shadow:var(--crm-shadow)}
        .br30-calendar-search-results-head{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:2px 3px 9px;border-bottom:1px solid var(--crm-border)}
        .br30-calendar-search-results-head>div{display:flex;align-items:baseline;gap:8px;min-width:0}
        .br30-calendar-search-results-head strong{font-size:13px;color:var(--crm-text)}
        .br30-calendar-search-results-head span{font-size:13px;color:var(--crm-muted)}
        .br30-calendar-search-results-head button{width:28px;height:28px;border:1px solid var(--crm-border);border-radius:8px;background:var(--crm-surface-2);color:var(--crm-muted);display:flex;align-items:center;justify-content:center;cursor:pointer}
        .br30-calendar-search-results-list{display:flex;flex-direction:column;gap:5px;padding-top:8px}
        .br30-calendar-search-result{width:100%;border:1px solid var(--crm-border);background:var(--crm-surface-2);border-radius:9px;padding:9px 10px;display:flex;align-items:center;gap:9px;text-align:left;color:var(--crm-text);cursor:pointer}
        .br30-calendar-search-result:hover{border-color:var(--crm-primary);background:color-mix(in srgb,var(--crm-primary) 6%,var(--crm-surface))}
        .br30-calendar-search-result-dot{width:8px;height:8px;border-radius:50%;background:var(--crm-primary);flex:0 0 8px;box-shadow:0 0 0 3px color-mix(in srgb,var(--crm-primary) 12%,transparent)}
        .br30-calendar-search-result-dot.meeting{background:var(--crm-primary)}
        .br30-calendar-search-result-dot.activity{background:var(--crm-success)}
        .br30-calendar-search-result-main{display:flex;flex-direction:column;gap:3px;min-width:0;flex:1}
        .br30-calendar-search-result-main strong{font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .br30-calendar-search-result-main span{font-size:13px;color:var(--crm-muted)}
        .br30-calendar-search-result-status{font-size:13px;color:var(--crm-primary);font-weight:400;text-transform:uppercase;white-space:nowrap}
        .br30-calendar-search-no-results{padding:15px 5px;text-align:center;font-size:13px;color:var(--crm-muted)}
        .br30-calendar-event-search-match{box-shadow:0 0 0 1px color-mix(in srgb,var(--crm-primary) 30%,transparent),0 0 0 3px color-mix(in srgb,var(--crm-primary) 8%,transparent)}
        .br30-calendar-select{height:38px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);border-radius:9px;padding:0 10px;font-size:13px;outline:none}
        .br30-calendar-nav{display:flex;align-items:center;border:1px solid var(--crm-border);border-radius:9px;overflow:hidden}
        .br30-calendar-nav button{height:38px;width:38px;border:0;background:var(--crm-surface);color:var(--crm-text);display:flex;align-items:center;justify-content:center;cursor:pointer}
        .br30-calendar-nav button+button{border-left:1px solid var(--crm-border)}
        .br30-calendar-nav button:hover{background:var(--crm-surface-2);color:var(--crm-primary)}
        .br30-calendar-period{min-width:210px;text-align:center;font-size:13px;font-weight:400;color:var(--crm-text)}
        .br30-calendar-view-switch{display:flex;border:1px solid var(--crm-border);border-radius:9px;overflow:hidden}
        .br30-calendar-view-switch button{height:38px;border:0;border-right:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-muted);padding:0 11px;font-size:13px;font-weight:400;cursor:pointer}
        .br30-calendar-view-switch button:last-child{border-right:0}
        .br30-calendar-view-switch button.active{background:color-mix(in srgb,var(--crm-primary) 10%,var(--crm-surface));color:var(--crm-primary)}
        .br30-calendar-card{border:1px solid var(--crm-border);background:var(--crm-surface);border-radius:12px;overflow:hidden;box-shadow:var(--crm-shadow);min-height:650px}
        .br30-calendar-loading{min-height:650px;display:flex;align-items:center;justify-content:center;color:var(--crm-muted);font-size:13px;gap:9px}
        .br30-calendar-spin{animation:br30-calendar-spin 1s linear infinite}
        @keyframes br30-calendar-spin{to{transform:rotate(360deg)}}
        .br30-calendar-month{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));min-height:650px}
        .br30-calendar-weekday{height:38px;padding:11px 10px;border-bottom:1px solid var(--crm-border);border-right:1px solid var(--crm-border);font-size:13px;text-transform:uppercase;letter-spacing:.06em;font-weight:400;color:var(--crm-muted);background:var(--crm-surface-2)}
        .br30-calendar-weekday:nth-child(7){border-right:0}
        .br30-calendar-day-cell{min-height:112px;border-right:1px solid var(--crm-border);border-bottom:1px solid var(--crm-border);padding:8px;cursor:pointer;background:var(--crm-surface)}
        .br30-calendar-day-cell:nth-child(7n){border-right:0}
        .br30-calendar-day-cell.outside{background:color-mix(in srgb,var(--crm-surface-2) 55%,transparent)}
        .br30-calendar-day-cell.today{background:color-mix(in srgb,var(--crm-primary) 4%,var(--crm-surface))}
        .br30-calendar-day-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px}
        .br30-calendar-day-header span{width:25px;height:25px;display:grid;place-items:center;border-radius:50%;font-size:13px;font-weight:400;color:var(--crm-text)}
        .br30-calendar-day-cell.today .br30-calendar-day-header span{background:var(--crm-primary);color:#fff}
        .br30-calendar-day-header small{font-size:13px;color:var(--crm-primary);font-weight:400}
        .br30-calendar-day-events{display:flex;flex-direction:column;gap:3px}
        .br30-calendar-event{width:100%;border:0;border-left:3px solid var(--crm-primary);background:color-mix(in srgb,var(--crm-primary) 9%,var(--crm-surface));border-radius:5px;padding:4px 5px;text-align:left;display:flex;gap:5px;cursor:pointer;overflow:hidden}
        .br30-calendar-event-time{font-size:13px;color:var(--crm-muted);flex-shrink:0}
        .br30-calendar-event-title{font-size:13px;color:var(--crm-text);font-weight:400;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .br30-calendar-event.meeting{border-left-color:var(--crm-primary)}
        .br30-calendar-event.completed,.br30-calendar-event.activity-completed{border-left-color:var(--crm-success)}
        .br30-calendar-event.cancelled{border-left-color:var(--crm-danger);opacity:.65}
        .br30-calendar-event.progress{border-left-color:var(--crm-warning)}
        .br30-calendar-event.no-show{border-left-color:var(--crm-danger)}
        .br30-calendar-event.activity{border-left-color:var(--crm-info,var(--crm-primary))}
        .br30-calendar-event.activity-urgent{border-left-color:var(--crm-danger)}
        .br30-calendar-more{border:0;background:transparent;color:var(--crm-primary);font-size:13px;font-weight:400;text-align:left;padding:2px 4px;cursor:pointer}
        .br30-calendar-week{min-height:650px}
        .br30-calendar-week-head{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));border-bottom:1px solid var(--crm-border)}
        .br30-calendar-week-day-head{padding:12px;border-right:1px solid var(--crm-border);display:flex;align-items:center;justify-content:space-between;gap:6px}
        .br30-calendar-week-day-head:last-child{border-right:0}
        .br30-calendar-week-day-head span{font-size:13px;color:var(--crm-muted);text-transform:uppercase;font-weight:400}
        .br30-calendar-week-day-head strong{font-size:13px}
        .br30-calendar-week-day-head.today strong{color:var(--crm-primary)}
        .br30-calendar-week-body{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));min-height:600px}
        .br30-calendar-week-column{border-right:1px solid var(--crm-border);padding:8px;display:flex;flex-direction:column;gap:5px}
        .br30-calendar-week-column:last-child{border-right:0}
        .br30-calendar-day-view-head{padding:18px;border-bottom:1px solid var(--crm-border);font-size:15px;font-weight:400}
        .br30-calendar-hour-row{min-height:58px;border-bottom:1px solid var(--crm-border);display:grid;grid-template-columns:70px 1fr}
        .br30-calendar-hour-row>span{padding:10px;border-right:1px solid var(--crm-border);font-size:13px;color:var(--crm-muted)}
        .br30-calendar-hour-row>div{padding:6px 10px;display:flex;flex-direction:column;gap:4px}
        .br30-calendar-agenda{padding:10px}
        .br30-calendar-agenda-item{width:100%;border:1px solid var(--crm-border);background:var(--crm-surface);border-radius:10px;padding:13px;display:flex;align-items:center;gap:12px;text-align:left;margin-bottom:7px;cursor:pointer;color:var(--crm-text)}
        .br30-calendar-agenda-item:hover{border-color:var(--crm-primary);background:color-mix(in srgb,var(--crm-primary) 3%,var(--crm-surface))}
        .br30-calendar-agenda-dot{width:8px;height:8px;border-radius:50%;background:var(--crm-primary);flex-shrink:0}
        .br30-calendar-agenda-dot.completed{background:var(--crm-success)}
        .br30-calendar-agenda-dot.cancelled{background:var(--crm-danger)}
        .br30-calendar-agenda-main{display:flex;flex-direction:column;gap:4px;min-width:0;flex:1}
        .br30-calendar-agenda-main strong{font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .br30-calendar-agenda-main span{font-size:13px;color:var(--crm-muted)}
        .br30-calendar-agenda-type{font-size:13px;color:var(--crm-primary);font-weight:400}
        .br30-calendar-empty{min-height:650px;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:7px;color:var(--crm-muted)}
        .br30-calendar-empty strong{font-size:13px;color:var(--crm-text)}
        .br30-calendar-empty span{font-size:13px}
        .swal2-container{z-index:20000!important}
        .swal2-popup{z-index:20001!important}
        .br30-calendar-detail-backdrop{position:fixed;inset:0;z-index:9998;background:rgba(15,23,42,.35);display:flex;align-items:center;justify-content:center;padding:20px}
        .br30-calendar-detail{width:min(460px,100%);background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:15px;box-shadow:0 24px 70px rgba(15,23,42,.22);overflow:hidden}
        .br30-calendar-detail-head{padding:17px 18px;border-bottom:1px solid var(--crm-border);display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
        .br30-calendar-detail-kind{font-size:13px;color:var(--crm-primary);font-weight:400;text-transform:uppercase;letter-spacing:.08em;margin-bottom:5px}
        .br30-calendar-detail-head h3{margin:0;font-size:17px;color:var(--crm-text)}
        .br30-calendar-detail-close{width:32px;height:32px;border:1px solid var(--crm-border);border-radius:8px;background:var(--crm-surface);color:var(--crm-muted);display:flex;align-items:center;justify-content:center;cursor:pointer}
        .br30-calendar-detail-body{padding:18px}
        .br30-calendar-detail-row{display:flex;align-items:flex-start;gap:10px;padding:9px 0;color:var(--crm-muted);font-size:13px}
        .br30-calendar-detail-row svg{flex-shrink:0;color:var(--crm-primary)}
        .br30-calendar-detail-row span{color:var(--crm-text);line-height:1.45}
        .br30-calendar-detail-description{border-top:1px solid var(--crm-border);padding-top:13px;margin-top:7px;color:var(--crm-muted);font-size:13px;line-height:1.5}
        .br30-calendar-detail-actions{display:flex;justify-content:flex-end;gap:7px;padding:13px 18px;border-top:1px solid var(--crm-border)}
        @media(max-width:1050px){.br30-calendar-stats{grid-template-columns:repeat(3,minmax(0,1fr))}.br30-calendar-toolbar{align-items:stretch;flex-direction:column}.br30-calendar-toolbar-left,.br30-calendar-toolbar-right{width:100%}.br30-calendar-search{flex:1;width:auto}}
        @media(max-width:750px){.br30-calendar-page{padding:18px 14px 30px}.br30-calendar-head{align-items:flex-start;flex-direction:column}.br30-calendar-head-actions{width:100%}.br30-calendar-head-actions .br30-calendar-btn{flex:1}.br30-calendar-stats{grid-template-columns:repeat(2,minmax(0,1fr))}.br30-calendar-toolbar-left,.br30-calendar-toolbar-right{flex-wrap:wrap}.br30-calendar-search{width:100%;flex-basis:100%}.br30-calendar-period{min-width:0;flex:1;font-size:13px}.br30-calendar-view-switch button{padding:0 8px}.br30-calendar-month{min-width:700px}.br30-calendar-card{overflow:auto}.br30-calendar-week{min-width:700px}.br30-calendar-week-body{min-height:500px}.br30-calendar-day-cell{min-height:95px}}
        @media(max-width:480px){.br30-calendar-stats{grid-template-columns:1fr}.br30-calendar-view-switch button{font-size:13px;padding:0 6px}.br30-calendar-nav button{width:34px}.br30-calendar-btn{padding:0 10px}}
      `}</style>

      <div className="br30-calendar-head">
        <div className="br30-calendar-head-left">
          <h1 className="br30-calendar-title">Calendar</h1>

          <p className="br30-calendar-subtitle">Manage meetings and CRM activities from one place.</p>
        </div>

        <div className="br30-calendar-head-actions">
          <button type="button" className="br30-calendar-btn" onClick={loadCalendar} disabled={loading}>
            <RefreshCw size={15} className={loading ? "br30-calendar-spin" : ""} />
            Refresh
          </button>

          <button type="button" className="br30-calendar-btn br30-calendar-btn-primary" onClick={() => openCreate()}>
            <Plus size={16} />
            New event
          </button>
        </div>
      </div>

      <div className="br30-calendar-stats">
        <div className="br30-calendar-stat">
          <div className="br30-calendar-stat-label">Total events</div>

          <div className="br30-calendar-stat-value">{stats.total}</div>
        </div>

        <div className="br30-calendar-stat">
          <div className="br30-calendar-stat-label">Meetings</div>

          <div className="br30-calendar-stat-value">{stats.meetingsCount}</div>
        </div>

        <div className="br30-calendar-stat">
          <div className="br30-calendar-stat-label">Activities</div>

          <div className="br30-calendar-stat-value">{stats.activitiesCount}</div>
        </div>

        <div className="br30-calendar-stat">
          <div className="br30-calendar-stat-label">Upcoming</div>

          <div className="br30-calendar-stat-value">{stats.upcoming}</div>
        </div>

        <div className="br30-calendar-stat">
          <div className="br30-calendar-stat-label">Completed</div>

          <div className="br30-calendar-stat-value">{stats.completed}</div>
        </div>
      </div>

      <div className="br30-calendar-toolbar">
        <div className="br30-calendar-toolbar-left">
          <div className="br30-calendar-search">
            <Search size={15} />

            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search calendar..." />

            {search ? (
              <button type="button" onClick={() => setSearch("")} aria-label="Clear search">
                <X size={14} />
              </button>
            ) : null}
          </div>

          <select className="br30-calendar-select" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="br30-calendar-toolbar-right">
          <button type="button" className="br30-calendar-btn" onClick={goToday}>
            Today
          </button>

          <div className="br30-calendar-nav">
            <button type="button" onClick={() => moveDate(-1)} title="Previous">
              <ChevronLeft size={17} />
            </button>

            <div className="br30-calendar-period">{headerTitle}</div>

            <button type="button" onClick={() => moveDate(1)} title="Next">
              <ChevronRight size={17} />
            </button>
          </div>

          <div className="br30-calendar-view-switch">
            {VIEW_OPTIONS.map((option) => (
              <button type="button" key={option.value} className={view === option.value ? "active" : ""} onClick={() => setView(option.value)}>
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {search.trim() ? (
        <div className="br30-calendar-search-results">
          <div className="br30-calendar-search-results-head">
            <div>
              <strong>Search results</strong>
              <span>
                {events.length} matching event{events.length === 1 ? "" : "s"}
              </span>
            </div>
            <button type="button" onClick={() => setSearch("")} aria-label="Clear search">
              <X size={14} />
            </button>
          </div>

          {events.length ? (
            <div className="br30-calendar-search-results-list">
              {events.slice(0, 12).map((event) => (
                <button
                  type="button"
                  key={`search-${event.id}`}
                  className="br30-calendar-search-result"
                  onClick={() => {
                    setSelectedEvent(event);
                    setCurrentDate(new Date(event.start));
                  }}>
                  <span className={`br30-calendar-search-result-dot ${event.kind === "MEETING" ? "meeting" : "activity"}`} />
                  <span className="br30-calendar-search-result-main">
                    <strong>{event.title}</strong>
                    <span>
                      {event.kind === "MEETING" ? "Meeting" : event.type || "Activity"} · {new Date(event.start).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </span>
                  <span className="br30-calendar-search-result-status">{String(event.status || "").replaceAll("_", " ")}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="br30-calendar-search-no-results">No matching calendar event found.</div>
          )}
        </div>
      ) : null}

      <div className="br30-calendar-card">
        {loading ? (
          <div className="br30-calendar-loading">
            <RefreshCw size={18} className="br30-calendar-spin" />
            Loading calendar...
          </div>
        ) : (
          <>
            {view === "month" ? renderMonth() : null}

            {view === "week" ? renderWeek() : null}

            {view === "day" ? renderDay() : null}

            {view === "agenda" ? renderAgenda() : null}
          </>
        )}
      </div>

      {selectedEvent ? (
        <div className="br30-calendar-detail-backdrop" onMouseDown={() => setSelectedEvent(null)}>
          <div className="br30-calendar-detail" onMouseDown={(event) => event.stopPropagation()}>
            <div className="br30-calendar-detail-head">
              <div>
                <div className="br30-calendar-detail-kind">{selectedEvent.kind === "MEETING" ? "Meeting" : selectedEvent.type || "Activity"}</div>

                <h3>{selectedEvent.title}</h3>
              </div>

              <button type="button" className="br30-calendar-detail-close" onClick={() => setSelectedEvent(null)}>
                <X size={16} />
              </button>
            </div>

            <div className="br30-calendar-detail-body">
              <div className="br30-calendar-detail-row">
                <Clock3 size={15} />

                <span>
                  {new Date(selectedEvent.start).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              {selectedEvent.location ? (
                <div className="br30-calendar-detail-row">
                  <MapPin size={15} />

                  <span>{selectedEvent.location}</span>
                </div>
              ) : null}

              {selectedEvent.meetingUrl ? (
                <div className="br30-calendar-detail-row">
                  <Video size={15} />

                  <span>{selectedEvent.meetingUrl}</span>
                </div>
              ) : null}

              {selectedEvent.status ? (
                <div className="br30-calendar-detail-row">
                  <CalendarDays size={15} />

                  <span>{selectedEvent.status.replaceAll("_", " ")}</span>
                </div>
              ) : null}

              {selectedEvent.description ? <div className="br30-calendar-detail-description">{selectedEvent.description}</div> : null}
            </div>

            <div className="br30-calendar-detail-actions">
              <button type="button" className="br30-calendar-btn" onClick={() => openEdit(selectedEvent)}>
                <Pencil size={14} />
                Edit
              </button>

              <button type="button" className="br30-calendar-btn" onClick={() => handleDelete(selectedEvent)} disabled={saving}>
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <CalendarEventModal
        open={Boolean(modal)}
        mode={modal?.mode || "create"}
        event={modal?.event || null}
        onClose={() => {
          if (!saving) {
            setModal(null);
          }
        }}
        onSave={handleSave}
        saving={saving}
      />
    </div>
  );
}
