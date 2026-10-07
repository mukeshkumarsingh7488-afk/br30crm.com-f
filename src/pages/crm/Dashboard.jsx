import { useEffect, useMemo, useState } from "react";
import { Activity, ArrowDownRight, ArrowUpRight, BarChart3, CalendarDays, CheckCircle2, ChevronRight, CircleDollarSign, Clock3, Filter, MoreHorizontal, Phone, Plus, RefreshCw, Target, TrendingUp, UserPlus, UsersRound } from "lucide-react";
import { getCurrentUser } from "../../api/auth";
import { getAnalyticsOverview } from "../../api/crm.api";
import { getLeads } from "../../api/lead.api";
import { getDeals } from "../../api/deal.api";
import { getTasks } from "../../api/task.api";
import { getActivities } from "../../api/activity.api";
import useBusiness from "../../hooks/useBusiness";
import { useNavigate } from "react-router-dom";

const defaultStats = [
  { title: "Total Revenue", value: "₹12,48,600", change: "+18.6%", positive: true, detail: "vs last month", icon: CircleDollarSign },
  { title: "Active Deals", value: "128", change: "+12.4%", positive: true, detail: "vs last month", icon: Target },
  { title: "New Leads", value: "342", change: "+24.8%", positive: true, detail: "vs last month", icon: UsersRound },
  { title: "Open Tasks", value: "24", change: "-8.2%", positive: false, detail: "vs last month", icon: CheckCircle2 },
];

const revenueData = [
  { month: "Jan", value: 48 },
  { month: "Feb", value: 58 },
  { month: "Mar", value: 44 },
  { month: "Apr", value: 70 },
  { month: "May", value: 62 },
  { month: "Jun", value: 78 },
  { month: "Jul", value: 67 },
  { month: "Aug", value: 84 },
  { month: "Sep", value: 73 },
  { month: "Oct", value: 91 },
  { month: "Nov", value: 80 },
  { month: "Dec", value: 96 },
];

const pipeline = [
  { label: "New Leads", value: "₹8.4L", width: 78, tone: "primary", deals: 42 },
  { label: "Qualified", value: "₹6.8L", width: 64, tone: "green", deals: 31 },
  { label: "Proposal", value: "₹7.1L", width: 70, tone: "orange", deals: 28 },
  { label: "Negotiation", value: "₹6.3L", width: 58, tone: "red", deals: 19 },
];

const activities = [
  { title: "Follow-up call with Rahul Sharma", type: "CALL", time: "10 min ago", icon: Phone, tone: "primary" },
  { title: "Proposal sent to Acme Industries", type: "EMAIL", time: "42 min ago", icon: Activity, tone: "green" },
  { title: "Meeting completed with Neha Singh", type: "MEETING", time: "1 hr ago", icon: CalendarDays, tone: "orange" },
  { title: "New lead assigned to sales team", type: "LEAD", time: "2 hrs ago", icon: UserPlus, tone: "red" },
  { title: "Deal moved to negotiation stage", type: "DEAL", time: "3 hrs ago", icon: TrendingUp, tone: "primary" },
];

const tasks = [
  { title: "Call premium client", due: "Today · 11:30 AM", priority: "HIGH" },
  { title: "Review new proposal", due: "Today · 2:00 PM", priority: "MEDIUM" },
  { title: "Sales team meeting", due: "Today · 4:30 PM", priority: "URGENT" },
  { title: "Update lead pipeline", due: "Tomorrow · 10:00 AM", priority: "LOW" },
];

const deals = [
  { name: "Acme Industries", owner: "Rahul", value: "₹4,80,000", stage: "Proposal", probability: 72 },
  { name: "Nova Technologies", owner: "Priya", value: "₹3,25,000", stage: "Negotiation", probability: 84 },
  { name: "Vertex Solutions", owner: "Amit", value: "₹2,10,000", stage: "Qualified", probability: 56 },
  { name: "Bluewave Retail", owner: "Neha", value: "₹1,85,000", stage: "New", probability: 32 },
  { name: "Orion Enterprises", owner: "Vikas", value: "₹1,42,000", stage: "Proposal", probability: 68 },
];

const leadSources = [
  { label: "Website", value: 38, count: 130 },
  { label: "Referral", value: 27, count: 92 },
  { label: "Social Media", value: 19, count: 65 },
  { label: "Campaigns", value: 16, count: 55 },
];

const teamPerformance = [
  { name: "Rahul Sharma", deals: 28, revenue: "₹6.4L", initials: "RS" },
  { name: "Priya Singh", deals: 24, revenue: "₹5.8L", initials: "PS" },
  { name: "Amit Kumar", deals: 19, revenue: "₹4.7L", initials: "AK" },
  { name: "Neha Singh", deals: 16, revenue: "₹3.9L", initials: "NS" },
];

const quickActions = [
  { label: "Add Lead", icon: UserPlus },
  { label: "Create Deal", icon: CircleDollarSign },
  { label: "New Task", icon: CheckCircle2 },
  { label: "Add Contact", icon: UsersRound },
];

function getGreeting() {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) return "Good Morning";
  if (hour >= 12 && hour < 17) return "Good Afternoon";
  if (hour >= 17 && hour < 21) return "Good Evening";

  return "Good Night";
}

function Dashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [period, setPeriod] = useState("12 months");
  const [showActions, setShowActions] = useState(false);
  const [liveStats, setLiveStats] = useState(defaultStats);
  const [liveDeals, setLiveDeals] = useState(deals);
  const [liveTasks, setLiveTasks] = useState(tasks);
  const [liveActivities, setLiveActivities] = useState(activities);
  const { businessId } = useBusiness();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const loadCurrentUser = async () => {
      try {
        const response = await getCurrentUser();

        const userData = response?.data?.user?.user || response?.data?.user || response?.user || response?.data || null;

        if (mounted) {
          setCurrentUser(userData);
        }
      } catch (error) {
        if (mounted) {
          setCurrentUser(null);
        }
      }
    };

    loadCurrentUser();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!businessId) return;
    const end = new Date();
    const start = new Date();
    start.setFullYear(start.getFullYear() - 1);
    const params = { startDate: start.toISOString().slice(0, 10), endDate: end.toISOString().slice(0, 10) };
    Promise.all([getAnalyticsOverview(businessId, params), getDeals(businessId, { page: 1, limit: 5 }), getTasks(businessId, { page: 1, limit: 5 }), getActivities(businessId, { page: 1, limit: 5 }), getLeads(businessId, { page: 1, limit: 5 })])
      .then(([analytics, dealRes, taskRes, activityRes]) => {
        const overview = analytics?.data?.overview || analytics?.overview || {};
        setLiveStats([
          { title: "Total Leads", value: String(overview.leads ?? 0), change: "Live", positive: true, detail: "last 12 months", icon: UsersRound },
          { title: "Active Deals", value: String(overview.deals ?? 0), change: "Live", positive: true, detail: "last 12 months", icon: Target },
          { title: "Open Tasks", value: String(overview.tasks ?? 0), change: "Live", positive: true, detail: "last 12 months", icon: CheckCircle2 },
          { title: "Activities", value: String(overview.activities ?? 0), change: "Live", positive: true, detail: "last 12 months", icon: Activity },
        ]);
        const unwrap = (r, keys) => keys.reduce((value, key) => value || r?.data?.[key], null) || [];
        const ds = unwrap(dealRes, ["deals", "items"]);
        const ts = unwrap(taskRes, ["tasks", "items"]);
        const as = unwrap(activityRes, ["activities", "items"]);
        if (ds.length) setLiveDeals(ds);
        if (ts.length) setLiveTasks(ts);
        if (as.length) setLiveActivities(as);
      })
      .catch((error) => {
        console.error("Dashboard overview fetch failed:", error);
      });
  }, [businessId]);

  const userName = currentUser?.name?.trim()?.split(/\s+/)[0] || "there";

  const greeting = useMemo(() => {
    return getGreeting();
  }, []);

  const periodLabel = useMemo(() => {
    if (period === "30 days") return "Last 30 days";
    if (period === "90 days") return "Last 90 days";
    return "Last 12 months";
  }, [period]);

  return (
    <>
      <style>{`
        .dashboard-page{padding:28px 30px 42px;max-width:1800px;margin:0 auto;color:var(--crm-text)}
        .dashboard-head{display:flex;align-items:flex-end;justify-content:space-between;gap:22px;margin-bottom:24px}
        .dashboard-head-left{min-width:0}
        .dashboard-title{font-size:29px;line-height:1.15;letter-spacing:-.8px;margin:0;color:var(--crm-text);font-weight:400}
        .dashboard-subtitle{margin:8px 0 0;color:var(--crm-muted);font-size:13px}
        .dashboard-actions{display:flex;align-items:center;gap:9px;position:relative;flex-shrink:0}
        .dashboard-action{height:40px;padding:0 14px;border-radius:10px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);font-size:13px;font-weight:400;display:flex;align-items:center;justify-content:center;gap:8px;transition:.18s}
        .dashboard-action:hover{background:var(--crm-surface-2);border-color:var(--crm-primary)}
        .dashboard-action.primary{border-color:var(--crm-primary);background:var(--crm-primary);color:#fff}
        .dashboard-action.primary:hover{filter:brightness(.96)}
        .dashboard-period{height:40px;padding:0 12px;border-radius:10px;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);font-size:13px;font-weight:400;outline:0}
        .dashboard-quick-menu{position:absolute;right:0;top:47px;width:190px;padding:7px;background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:12px;box-shadow:var(--crm-shadow);z-index:20}
        .quick-menu-item{width:100%;height:38px;border:0;background:transparent;color:var(--crm-text);border-radius:8px;display:flex;align-items:center;gap:9px;padding:0 10px;font-size:13px;font-weight:400;text-align:left}
        .quick-menu-item:hover{background:var(--crm-surface-2)}
        .dashboard-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}
        .stat-card{background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:15px;padding:18px;box-shadow:var(--crm-shadow);min-width:0}
        .stat-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:17px}
        .stat-icon{width:39px;height:39px;border-radius:11px;background:var(--crm-primary-soft);color:var(--crm-primary);display:grid;place-items:center}
        .stat-menu{color:var(--crm-muted)}
        .stat-title{font-size:13px;color:var(--crm-muted);font-weight:400}
        .stat-value{font-size:24px;letter-spacing:-.5px;font-weight:400;color:var(--crm-text);margin:5px 0 8px}
        .stat-change{display:flex;align-items:center;gap:4px;font-size:13px;font-weight:400}
        .stat-change.positive{color:var(--crm-success)}
        .stat-change.negative{color:var(--crm-danger)}
        .stat-change-detail{color:var(--crm-muted);font-weight:400}
        .dashboard-columns{display:grid;grid-template-columns:minmax(0,1.65fr) minmax(320px,.85fr);gap:14px;margin-top:14px}
        .dashboard-columns.equal{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}
        .panel{background:var(--crm-surface);border:1px solid var(--crm-border);border-radius:15px;box-shadow:var(--crm-shadow);min-width:0;overflow:hidden}
        .panel-head{display:flex;align-items:center;justify-content:space-between;padding:18px 20px;border-bottom:1px solid var(--crm-border);gap:15px}
        .panel-head-left{min-width:0}
        .panel-title{font-size:14px;font-weight:400;color:var(--crm-text)}
        .panel-subtitle{font-size:13px;color:var(--crm-muted);margin-top:3px}
        .panel-link{border:0;background:transparent;color:var(--crm-primary);font-size:13px;font-weight:400;display:flex;align-items:center;gap:3px;white-space:nowrap}
        .panel-link:hover{text-decoration:underline}
        .chart-wrap{padding:20px;height:285px}
        .chart{height:100%;display:flex;flex-direction:column}
        .chart-grid{flex:1;display:grid;grid-template-columns:repeat(12,1fr);gap:9px;align-items:end;border-bottom:1px solid var(--crm-border);position:relative;padding-top:8px}
        .chart-grid:before,.chart-grid:after{content:"";position:absolute;left:0;right:0;border-top:1px dashed var(--crm-border)}
        .chart-grid:before{top:33%}
        .chart-grid:after{top:66%}
        .chart-bar{position:relative;z-index:1;width:100%;border-radius:7px 7px 2px 2px;background:linear-gradient(180deg,var(--crm-primary),color-mix(in srgb,var(--crm-primary) 40%,transparent));min-height:12px;transition:height .35s ease}
        .chart-bar:hover{filter:brightness(1.08)}
        .chart-labels{display:grid;grid-template-columns:repeat(12,1fr);gap:9px;margin-top:8px}
        .chart-label{text-align:center;font-size:13px;color:var(--crm-muted)}
        .chart-summary{display:flex;align-items:flex-end;gap:9px;margin-bottom:12px}
        .chart-summary-value{font-size:21px;font-weight:400;color:var(--crm-text)}
        .chart-summary-change{font-size:13px;color:var(--crm-success);font-weight:400;margin-bottom:3px}
        .pipeline-body{padding:18px 20px}
        .pipeline-total{font-size:26px;font-weight:400;color:var(--crm-text);letter-spacing:-.5px}
        .pipeline-caption{font-size:13px;color:var(--crm-muted);margin-top:3px}
        .pipeline-bars{display:grid;gap:14px;margin-top:23px}
        .pipeline-row{display:grid;gap:7px}
        .pipeline-label{display:flex;justify-content:space-between;font-size:13px;color:var(--crm-muted);font-weight:400}
        .pipeline-label-left{display:flex;align-items:center;gap:7px}
        .pipeline-label-right{display:flex;gap:8px}
        .pipeline-count{opacity:.7}
        .pipeline-track{height:7px;background:var(--crm-surface-2);border-radius:99px;overflow:hidden}
        .pipeline-fill{height:100%;border-radius:99px;background:var(--crm-primary)}
        .pipeline-fill.green{background:var(--crm-success)}
        .pipeline-fill.orange{background:var(--crm-warning)}
        .pipeline-fill.red{background:var(--crm-danger)}
        .insights-row{display:grid;grid-template-columns:1.05fr .95fr;gap:14px;margin-top:14px}
        .lead-source-list{padding:8px 20px 17px}
        .source-row{padding:12px 0;border-bottom:1px solid var(--crm-border)}
        .source-row:last-child{border-bottom:0}
        .source-top{display:flex;align-items:center;justify-content:space-between;font-size:13px;margin-bottom:7px}
        .source-name{font-weight:400;color:var(--crm-text)}
        .source-count{color:var(--crm-muted)}
        .source-track{height:7px;background:var(--crm-surface-2);border-radius:99px;overflow:hidden}
        .source-fill{height:100%;background:var(--crm-primary);border-radius:99px}
        .conversion-body{padding:20px}
        .conversion-main{display:flex;align-items:center;gap:20px}
        .conversion-ring{width:108px;height:108px;border-radius:50%;display:grid;place-items:center;background:conic-gradient(var(--crm-primary) 0 68%,var(--crm-surface-2) 68% 100%);position:relative;flex-shrink:0}
        .conversion-ring:after{content:"";position:absolute;inset:9px;border-radius:50%;background:var(--crm-surface)}
        .conversion-value{position:relative;z-index:1;font-size:21px;font-weight:400;color:var(--crm-text)}
        .conversion-copy{min-width:0}
        .conversion-label{font-size:13px;font-weight:400;color:var(--crm-text)}
        .conversion-description{font-size:13px;color:var(--crm-muted);line-height:1.6;margin-top:6px}
        .conversion-change{display:inline-flex;align-items:center;gap:4px;margin-top:9px;color:var(--crm-success);font-size:13px;font-weight:400}
        .activity-list{padding:4px 20px 10px}
        .activity-item{display:flex;gap:12px;padding:14px 0;border-bottom:1px solid var(--crm-border)}
        .activity-item:last-child{border-bottom:0}
        .activity-icon{width:31px;height:31px;border-radius:9px;display:grid;place-items:center;flex:0 0 auto}
        .activity-icon.primary{background:var(--crm-primary-soft);color:var(--crm-primary)}
        .activity-icon.green{background:color-mix(in srgb,var(--crm-success) 11%,transparent);color:var(--crm-success)}
        .activity-icon.orange{background:color-mix(in srgb,var(--crm-warning) 12%,transparent);color:var(--crm-warning)}
        .activity-icon.red{background:color-mix(in srgb,var(--crm-danger) 10%,transparent);color:var(--crm-danger)}
        .activity-main{min-width:0;flex:1}
        .activity-title{font-size:13px;color:var(--crm-text);font-weight:400;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .activity-meta{font-size:13px;color:var(--crm-muted);margin-top:4px}
        .activity-arrow{align-self:center;color:var(--crm-muted)}
        .task-list{padding:4px 20px 10px}
        .task-item{display:flex;align-items:center;gap:11px;padding:14px 0;border-bottom:1px solid var(--crm-border)}
        .task-item:last-child{border-bottom:0}
        .task-check{width:20px;height:20px;border:1px solid var(--crm-border);border-radius:6px;display:grid;place-items:center;flex:0 0 auto;color:var(--crm-primary)}
        .task-main{min-width:0;flex:1}
        .task-title{font-size:13px;font-weight:400;color:var(--crm-text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .task-due{display:flex;align-items:center;gap:5px;font-size:13px;color:var(--crm-muted);margin-top:4px}
        .priority{font-size:13px;font-weight:400;padding:4px 6px;border-radius:5px}
        .priority.HIGH{color:var(--crm-danger);background:color-mix(in srgb,var(--crm-danger) 10%,transparent)}
        .priority.URGENT{color:var(--crm-danger);background:color-mix(in srgb,var(--crm-danger) 14%,transparent)}
        .priority.MEDIUM{color:var(--crm-warning);background:color-mix(in srgb,var(--crm-warning) 12%,transparent)}
        .priority.LOW{color:var(--crm-success);background:color-mix(in srgb,var(--crm-success) 10%,transparent)}
        .deals-panel{margin-top:14px}
        .deal-table-wrap{overflow:auto}
        .deal-table{width:100%;min-width:720px;border-collapse:collapse}
        .deal-table th{text-align:left;font-size:13px;text-transform:uppercase;letter-spacing:.07em;color:var(--crm-muted);font-weight:400;padding:13px 20px;background:var(--crm-surface-2);border-bottom:1px solid var(--crm-border)}
        .deal-table td{padding:14px 20px;border-bottom:1px solid var(--crm-border);font-size:13px;color:var(--crm-text)}
        .deal-table tr:last-child td{border-bottom:0}
        .deal-table tbody tr:hover{background:var(--crm-surface-2)}
        .deal-name{font-weight:400}
        .deal-owner{display:flex;align-items:center;gap:7px;color:var(--crm-muted)}
        .mini-avatar{width:25px;height:25px;border-radius:8px;background:var(--crm-primary-soft);color:var(--crm-primary);display:grid;place-items:center;font-size:13px;font-weight:400}
        .stage{padding:5px 8px;border-radius:6px;background:var(--crm-primary-soft);color:var(--crm-primary);font-size:13px;font-weight:400}
        .probability{font-weight:400}
        .probability-track{width:75px;height:5px;background:var(--crm-surface-2);border-radius:99px;overflow:hidden;margin-top:5px}
        .probability-fill{height:100%;background:var(--crm-success);border-radius:99px}
        .team-list{padding:5px 20px 10px}
        .team-row{display:flex;align-items:center;gap:10px;padding:13px 0;border-bottom:1px solid var(--crm-border)}
        .team-row:last-child{border-bottom:0}
        .team-avatar{width:32px;height:32px;border-radius:9px;background:var(--crm-primary-soft);color:var(--crm-primary);display:grid;place-items:center;font-size:13px;font-weight:400}
        .team-main{flex:1;min-width:0}
        .team-name{font-size:13px;color:var(--crm-text);font-weight:400}
        .team-deals{font-size:13px;color:var(--crm-muted);margin-top:3px}
        .team-revenue{font-size:13px;font-weight:400;color:var(--crm-text)}
        .quick-actions-panel{margin-top:14px}
        .quick-actions{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;padding:15px 20px 20px}
        .quick-action-card{height:66px;border:1px solid var(--crm-border);background:var(--crm-surface-2);border-radius:11px;color:var(--crm-text);display:flex;align-items:center;gap:10px;padding:0 13px;text-align:left;transition:.18s}
        .quick-action-card:hover{border-color:var(--crm-primary);background:var(--crm-primary-soft);color:var(--crm-primary);transform:translateY(-1px)}
        .quick-action-icon{width:34px;height:34px;border-radius:9px;background:var(--crm-surface);display:grid;place-items:center;flex-shrink:0}
        .quick-action-label{font-size:13px;font-weight:400}
        .dashboard-footer-note{display:flex;align-items:center;justify-content:center;gap:7px;color:var(--crm-muted);font-size:13px;padding:24px 0 0}
        @media(max-width:1250px){.dashboard-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.insights-row{grid-template-columns:1fr}.quick-actions{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:950px){.dashboard-columns,.dashboard-columns.equal{grid-template-columns:1fr}}
        @media(max-width:700px){.dashboard-page{padding:20px 15px 30px}.dashboard-head{align-items:flex-start;flex-direction:column}.dashboard-actions{width:100%;flex-wrap:wrap}.dashboard-action,.dashboard-period{flex:1}.dashboard-title{font-size:23px}.dashboard-grid{grid-template-columns:1fr}.quick-actions{grid-template-columns:1fr}.chart-wrap{height:250px}.conversion-main{align-items:flex-start}.conversion-ring{width:90px;height:90px}.deal-table{min-width:720px}}
      `}</style>

      <section className="dashboard-page">
        <div className="dashboard-head">
          <div className="dashboard-head-left">
            <h1 className="dashboard-title">
              {greeting}, {userName} 👋
            </h1>

            <p className="dashboard-subtitle">Here’s what’s happening across your business today.</p>
          </div>

          <div className="dashboard-actions">
            <select className="dashboard-period" value={period} onChange={(event) => setPeriod(event.target.value)} aria-label="Dashboard period">
              <option value="30 days">30 days</option>
              <option value="90 days">90 days</option>
              <option value="12 months">12 months</option>
            </select>

            <button type="button" className="dashboard-action">
              <RefreshCw size={14} />
              Refresh
            </button>

            <button type="button" className="dashboard-action primary" onClick={() => setShowActions((value) => !value)}>
              <Plus size={15} />
              Add New
            </button>

            {showActions && (
              <div className="dashboard-quick-menu">
                {quickActions.map(({ label, icon: Icon }) => (
                  <button type="button" className="quick-menu-item" key={label} onClick={() => setShowActions(false)}>
                    <Icon size={15} />
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="dashboard-grid">
          {liveStats.map((stat) => {
            const Icon = stat.icon;

            return (
              <article className="stat-card" key={stat.title}>
                <div className="stat-top">
                  <div className="stat-icon">
                    <Icon size={19} />
                  </div>

                  <MoreHorizontal className="stat-menu" size={18} />
                </div>

                <div className="stat-title">{stat.title}</div>
                <div className="stat-value">{stat.value}</div>

                <div className={`stat-change ${stat.positive ? "positive" : "negative"}`}>
                  {stat.positive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                  {stat.change}
                  <span className="stat-change-detail">{stat.detail}</span>
                </div>
              </article>
            );
          })}
        </div>

        <div className="dashboard-columns">
          <section className="panel">
            <div className="panel-head">
              <div className="panel-head-left">
                <div className="panel-title">Revenue performance</div>
                <div className="panel-subtitle">{periodLabel} revenue overview</div>
              </div>

              <button type="button" className="panel-link">
                View report <ChevronRight size={12} />
              </button>
            </div>

            <div className="chart-wrap">
              <div className="chart-summary">
                <div className="chart-summary-value">₹12.48L</div>

                <div className="chart-summary-change">
                  <ArrowUpRight size={11} />
                  18.6%
                </div>
              </div>

              <div className="chart">
                <div className="chart-grid">
                  {revenueData.map((item) => (
                    <div key={item.month} className="chart-bar" style={{ height: `${item.value}%` }} title={`${item.month}: ${item.value}%`} />
                  ))}
                </div>

                <div className="chart-labels">
                  {revenueData.map((item) => (
                    <div className="chart-label" key={item.month}>
                      {item.month}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="panel">
            <div className="panel-head">
              <div className="panel-head-left">
                <div className="panel-title">Sales pipeline</div>
                <div className="panel-subtitle">Current opportunity value</div>
              </div>

              <MoreHorizontal size={18} color="var(--crm-muted)" />
            </div>

            <div className="pipeline-body">
              <div className="pipeline-total">₹28.6L</div>
              <div className="pipeline-caption">Total pipeline value</div>

              <div className="pipeline-bars">
                {pipeline.map((item) => (
                  <div className="pipeline-row" key={item.label}>
                    <div className="pipeline-label">
                      <div className="pipeline-label-left">
                        <span>{item.label}</span>
                      </div>

                      <div className="pipeline-label-right">
                        <span>{item.value}</span>
                        <span className="pipeline-count">{item.deals}</span>
                      </div>
                    </div>

                    <div className="pipeline-track">
                      <div className={`pipeline-fill ${item.tone === "primary" ? "" : item.tone}`} style={{ width: `${item.width}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        <div className="insights-row">
          <section className="panel">
            <div className="panel-head">
              <div className="panel-head-left">
                <div className="panel-title">Lead sources</div>
                <div className="panel-subtitle">Where your new leads are coming from</div>
              </div>

              <BarChart3 size={18} color="var(--crm-muted)" />
            </div>

            <div className="lead-source-list">
              {leadSources.map((source) => (
                <div className="source-row" key={source.label}>
                  <div className="source-top">
                    <span className="source-name">{source.label}</span>

                    <span className="source-count">
                      {source.count} leads · {source.value}%
                    </span>
                  </div>

                  <div className="source-track">
                    <div className="source-fill" style={{ width: `${source.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="panel">
            <div className="panel-head">
              <div className="panel-head-left">
                <div className="panel-title">Conversion overview</div>
                <div className="panel-subtitle">Lead to customer performance</div>
              </div>

              <Target size={18} color="var(--crm-muted)" />
            </div>

            <div className="conversion-body">
              <div className="conversion-main">
                <div className="conversion-ring">
                  <span className="conversion-value">68%</span>
                </div>

                <div className="conversion-copy">
                  <div className="conversion-label">Overall conversion</div>

                  <div className="conversion-description">Your sales team converted 68% of qualified opportunities during the selected period.</div>

                  <div className="conversion-change">
                    <ArrowUpRight size={12} />
                    +7.4% from previous period
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="dashboard-columns equal">
          <section className="panel">
            <div className="panel-head">
              <div className="panel-head-left">
                <div className="panel-title">Recent activities</div>
                <div className="panel-subtitle">Latest customer interactions</div>
              </div>

              <button type="button" className="panel-link">
                View all <ChevronRight size={12} />
              </button>
            </div>

            <div className="activity-list">
              {activities.map((activity) => {
                const Icon = activity.icon;

                return (
                  <div className="activity-item" key={activity.title}>
                    <div className={`activity-icon ${activity.tone}`}>
                      <Icon size={14} />
                    </div>

                    <div className="activity-main">
                      <div className="activity-title">{activity.title}</div>

                      <div className="activity-meta">
                        {activity.type} · {activity.time}
                      </div>
                    </div>

                    <ChevronRight className="activity-arrow" size={15} />
                  </div>
                );
              })}
            </div>
          </section>

          <section className="panel">
            <div className="panel-head">
              <div className="panel-head-left">
                <div className="panel-title">Upcoming tasks</div>
                <div className="panel-subtitle">What needs your attention</div>
              </div>

              <button type="button" className="panel-link">
                View all <ChevronRight size={12} />
              </button>
            </div>

            <div className="task-list">
              {liveTasks.map((task) => (
                <div className="task-item" key={task.title}>
                  <div className="task-check">
                    <CheckCircle2 size={13} />
                  </div>

                  <div className="task-main">
                    <div className="task-title">{task.title}</div>

                    <div className="task-due">
                      <Clock3 size={11} />
                      {task.due}
                    </div>
                  </div>

                  <span className={`priority ${task.priority}`}>{task.priority}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="panel deals-panel">
          <div className="panel-head">
            <div className="panel-head-left">
              <div className="panel-title">Recent deals</div>
              <div className="panel-subtitle">Latest opportunities across your sales pipeline</div>
            </div>

            <button type="button" className="panel-link">
              View all deals <ChevronRight size={12} />
            </button>
          </div>

          <div className="deal-table-wrap">
            <table className="deal-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Owner</th>
                  <th>Deal value</th>
                  <th>Stage</th>
                  <th>Probability</th>
                </tr>
              </thead>

              <tbody>
                {liveDeals.map((deal) => (
                  <tr key={deal.name}>
                    <td>
                      <span className="deal-name">{deal.name}</span>
                    </td>

                    <td>
                      <div className="deal-owner">
                        <span className="mini-avatar">{(deal.owner || "NA").slice(0, 2).toUpperCase()}</span>
                        {deal.owner || "Unassigned"}
                      </div>
                    </td>

                    <td>
                      <strong>{deal.value}</strong>
                    </td>

                    <td>
                      <span className="stage">{deal.stage}</span>
                    </td>

                    <td>
                      <span className="probability">{deal.probability}%</span>

                      <div className="probability-track">
                        <div className="probability-fill" style={{ width: `${deal.probability}%` }} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="dashboard-columns equal">
          <section className="panel">
            <div className="panel-head">
              <div className="panel-head-left">
                <div className="panel-title">Team performance</div>
                <div className="panel-subtitle">Top sales activity this period</div>
              </div>

              <button type="button" className="panel-link">
                View team <ChevronRight size={12} />
              </button>
            </div>

            <div className="team-list">
              {teamPerformance.map((member) => (
                <div className="team-row" key={member.name}>
                  <div className="team-avatar">{member.initials}</div>

                  <div className="team-main">
                    <div className="team-name">{member.name}</div>
                    <div className="team-deals">{member.deals} closed opportunities</div>
                  </div>

                  <div className="team-revenue">{member.revenue}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="panel">
            <div className="panel-head">
              <div className="panel-head-left">
                <div className="panel-title">Workspace snapshot</div>
                <div className="panel-subtitle">Current CRM activity at a glance</div>
              </div>

              <Filter size={17} color="var(--crm-muted)" />
            </div>

            <div className="pipeline-body">
              <div className="pipeline-row">
                <div className="pipeline-label">
                  <span>Contacts</span>
                  <span>1,842</span>
                </div>

                <div className="pipeline-track">
                  <div className="pipeline-fill" style={{ width: "82%" }} />
                </div>
              </div>

              <div className="pipeline-row">
                <div className="pipeline-label">
                  <span>Companies</span>
                  <span>486</span>
                </div>

                <div className="pipeline-track">
                  <div className="pipeline-fill green" style={{ width: "64%" }} />
                </div>
              </div>

              <div className="pipeline-row">
                <div className="pipeline-label">
                  <span>Open opportunities</span>
                  <span>128</span>
                </div>

                <div className="pipeline-track">
                  <div className="pipeline-fill orange" style={{ width: "58%" }} />
                </div>
              </div>

              <div className="pipeline-row">
                <div className="pipeline-label">
                  <span>Completed tasks</span>
                  <span>76%</span>
                </div>

                <div className="pipeline-track">
                  <div className="pipeline-fill green" style={{ width: "76%" }} />
                </div>
              </div>
            </div>
          </section>
        </div>

        <section className="panel quick-actions-panel">
          <div className="panel-head">
            <div className="panel-head-left">
              <div className="panel-title">Quick actions</div>
              <div className="panel-subtitle">Common actions you can access instantly</div>
            </div>

            <Plus size={17} color="var(--crm-muted)" />
          </div>

          <div className="quick-actions">
            {quickActions.map(({ label, icon: Icon }) => (
              <button type="button" className="quick-action-card" key={label}>
                <span className="quick-action-icon">
                  <Icon size={16} />
                </span>

                <span className="quick-action-label">{label}</span>
              </button>
            ))}
          </div>
        </section>

        <div className="dashboard-footer-note">
          <Clock3 size={11} />
          Dashboard data is currently using preview data and is ready for backend integration.
        </div>
      </section>
    </>
  );
}

export default Dashboard;
