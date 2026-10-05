import { useMemo, useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  BellRing,
  Building2,
  CalendarDays,
  CheckCircle2,
  CheckSquare,
  ChevronDown,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  ClipboardList,
  Clock3,
  ContactRound,
  FileText,
  Filter,
  GitBranch,
  Globe,
  LayoutDashboard,
  Link2,
  LogOut,
  Menu,
  Megaphone,
  MessageCircle,
  MoreHorizontal,
  Network,
  Workflow,
  Moon,
  Monitor,
  Plus,
  RefreshCw,
  QrCode,
  Search,
  Settings,
  Smartphone,
  ShieldCheck,
  Sun,
  Target,
  Tag,
  TrendingUp,
  UserPlus,
  UsersRound,
  X,
} from "lucide-react";

const stats = [
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
  { title: "Follow-up call with Rahul Sharma", type: "CALL", time: "10 min ago", icon: PhoneIcon, tone: "primary" },
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

const workspaceMenu = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Leads", icon: Target },
  { label: "Contacts", icon: ContactRound },
  { label: "Companies", icon: Building2 },
  { label: "Tags", icon: Tag },
  { label: "Deals", icon: CircleDollarSign },
  { label: "Pipelines", icon: GitBranch },
  { label: "Tasks", icon: CheckSquare },
  { label: "Activities", icon: Activity },
  { label: "Meetings", icon: CalendarDays },
  { label: "Calendar", icon: CalendarDays },
];

const insightMenu = [
  { label: "Sales Report", icon: BarChart3 },
  { label: "Leads Report", icon: Target },
  { label: "Deals Report", icon: CircleDollarSign },
  { label: "Activity Report", icon: Activity },
];

const utilityMenu = [
  { label: "Email", icon: FileText },
  { label: "WhatsApp", icon: MessageCircle },
  { label: "SMS", icon: Smartphone },
  { label: "Communication History", icon: FileText },
  { label: "Forms", icon: FileText },
  { label: "Public Links", icon: Link2 },
  { label: "QR", icon: QrCode },
  { label: "Sources / Campaigns", icon: Globe },
  { label: "Automations", icon: Workflow },
  { label: "Workflows", icon: Network },
  { label: "Webhooks", icon: Link2 },
  { label: "Team", icon: UsersRound },
  { label: "Members", icon: UsersRound },
  { label: "Roles", icon: ShieldCheck },
  { label: "Permissions", icon: ShieldCheck },
  { label: "Notifications", icon: BellRing },
  { label: "Audit Logs", icon: ShieldCheck },
  { label: "Integrations", icon: Network },
  { label: "Subscription", icon: CreditCard },
];

const allPreviewPages = [...workspaceMenu, ...insightMenu, ...utilityMenu, { label: "Settings", icon: Settings }];

function PhoneIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function DashboardPreview() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [period, setPeriod] = useState("12 months");
  const [search, setSearch] = useState("");
  const [showActions, setShowActions] = useState(false);
  const [theme, setTheme] = useState("light");
  const [showNotifications, setShowNotifications] = useState(false);

  const periodLabel = useMemo(() => {
    if (period === "30 days") return "Last 30 days";
    if (period === "90 days") return "Last 90 days";
    return "Last 12 months";
  }, [period]);

  const selectPage = (page) => {
    setActivePage(page);
    setMobileOpen(false);
  };

  const cycleTheme = () => {
    const next = theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
    setTheme(next);
  };

  const ThemeIcon = theme === "light" ? Sun : theme === "dark" ? Moon : Monitor;

  return (
    <section className={`lp-crm-preview ${theme === "dark" ? "lp-crm-preview-dark" : ""}`}>
      <style>{`
.lp-crm-preview{--preview-bg:var(--crm-bg,#f7f8fc);--preview-surface:var(--crm-surface,#fff);--preview-surface-2:var(--crm-surface-2,#f5f6fa);--preview-border:var(--crm-border,#e5e7eb);--preview-text:var(--crm-text,#172033);--preview-muted:var(--crm-muted,#667085);--preview-primary:var(--crm-primary,#4f46e5);--preview-primary-soft:var(--crm-primary-soft,#eef2ff);--preview-success:var(--crm-success,#16a34a);--preview-warning:var(--crm-warning,#f59e0b);--preview-danger:var(--crm-danger,#ef4444);--preview-shadow:var(--crm-shadow,0 12px 35px rgba(15,23,42,.08));position:relative;width:100%;max-width:100%;margin:0 auto;padding:78px 6% 92px;background:var(--preview-bg);color:var(--preview-text);isolation:isolate;box-sizing:border-box}.lp-crm-preview-dark{background:#0b1220}.lp-crm-preview-head{max-width:780px;margin:0 auto 34px;text-align:center}.lp-crm-preview-eyebrow{font-size:13px;line-height:1;color:var(--preview-primary);font-weight:400;letter-spacing:.14em;text-transform:uppercase;margin-bottom:12px}.lp-crm-preview-heading{margin:0;color:var(--preview-text);font-size:clamp(30px,4vw,46px);line-height:1.08;letter-spacing:-1.8px;font-weight:400}.lp-crm-preview-subtitle{max-width:680px;margin:14px auto 0;color:var(--preview-muted);font-size:14px;line-height:1.75}.lp-crm-shell{position:relative;width:100%;max-width:1480px;height:min(860px,82vh);min-height:620px;margin:0 auto;border:1px solid var(--preview-border);border-radius:20px;overflow:hidden;background:var(--preview-bg);display:flex;box-shadow:0 30px 90px rgba(15,23,42,.14);isolation:isolate}
.lp-crm-preview-dark{--preview-bg:#0b1220;--preview-surface:#101827;--preview-surface-2:#151f30;--preview-border:#263247;--preview-text:#f3f5f9;--preview-muted:#9aa8bd;--preview-primary:#818cf8;--preview-primary-soft:rgba(129,140,248,.13);--preview-shadow:0 15px 40px rgba(0,0,0,.25)}
.lp-crm-sidebar{width:268px;min-width:268px;height:100%;background:var(--preview-surface);border-right:1px solid var(--preview-border);display:flex;flex-direction:column;position:relative;z-index:30;transition:width .25s ease,min-width .25s ease}
.lp-crm-sidebar.collapsed{width:78px;min-width:78px}
.lp-crm-brand{height:72px;min-height:72px;padding:0 18px;display:flex;align-items:center;gap:12px;border-bottom:1px solid var(--preview-border);overflow:hidden}
.lp-crm-brand-logo{width:38px;height:38px;min-width:38px;border-radius:11px;object-fit:cover;background:var(--preview-primary-soft);border:1px solid var(--preview-border)}
.lp-crm-brand-text{min-width:0;white-space:nowrap}
.lp-crm-brand-title{font-size:15px;font-weight:400;color:var(--preview-text);letter-spacing:-.2px}
.lp-crm-brand-sub{font-size:13px;color:var(--preview-muted);margin-top:3px}
.lp-crm-nav{flex:1;min-height:0;padding:16px 12px 12px;display:flex;flex-direction:column;gap:4px;overflow-y:auto;overflow-x:hidden;scrollbar-width:thin;scrollbar-color:var(--preview-border) transparent}
.lp-crm-nav::-webkit-scrollbar{width:5px}
.lp-crm-nav::-webkit-scrollbar-track{background:transparent}
.lp-crm-nav::-webkit-scrollbar-thumb{background:var(--preview-border);border-radius:99px}
.lp-crm-nav-label{font-size:13px;text-transform:uppercase;letter-spacing:.12em;color:var(--preview-muted);font-weight:400;padding:4px 12px 8px;white-space:nowrap}
.lp-crm-nav-link{height:43px;min-height:43px;width:100%;display:flex;align-items:center;gap:12px;padding:0 12px;border:0;border-radius:11px;background:transparent;text-decoration:none;color:var(--preview-muted);font-size:13px;font-weight:400;white-space:nowrap;cursor:pointer;text-align:left;transition:background .18s,color .18s,transform .18s}
.lp-crm-nav-link:hover{background:var(--preview-surface-2);color:var(--preview-text);transform:translateX(1px)}
.lp-crm-nav-link.active{background:var(--preview-primary-soft);color:var(--preview-primary);font-weight:400}
.lp-crm-nav-icon{width:18px;height:18px;min-width:18px}
.lp-crm-nav-divider{height:1px;min-height:1px;background:var(--preview-border);margin:12px 8px}
.lp-crm-sidebar-bottom{padding:10px 12px 12px;border-top:1px solid var(--preview-border);background:var(--preview-surface)}
.lp-crm-bottom-link{height:43px;width:100%;display:flex;align-items:center;gap:12px;padding:0 12px;border:0;background:transparent;color:var(--preview-muted);border-radius:11px;font-size:13px;font-weight:400;white-space:nowrap;cursor:pointer;text-align:left}
.lp-crm-bottom-link:hover{background:var(--preview-surface-2);color:var(--preview-text)}
.lp-crm-bottom-link.logout:hover{color:var(--preview-danger);background:color-mix(in srgb,var(--preview-danger) 8%,transparent)}
.lp-crm-collapse{position:absolute;right:-13px;top:68px;width:26px;height:26px;border-radius:50%;border:1px solid var(--preview-border);background:var(--preview-surface);color:var(--preview-muted);display:grid;place-items:center;box-shadow:var(--preview-shadow);z-index:40;padding:0;cursor:pointer}
.lp-crm-collapse:hover{color:var(--preview-text);border-color:var(--preview-primary)}
.lp-crm-main{flex:1;min-width:0;min-height:0;height:100%;display:flex;flex-direction:column;overflow:hidden;background:var(--preview-bg)}
.lp-crm-topbar{height:72px;min-height:72px;background:var(--preview-surface);border-bottom:1px solid var(--preview-border);display:flex;align-items:center;justify-content:space-between;padding:0 26px;position:relative;z-index:20}
.lp-crm-top-left{display:flex;align-items:center;gap:14px;min-width:0}
.lp-crm-mobile-menu{display:none;width:38px;height:38px;border:1px solid var(--preview-border);background:var(--preview-surface);color:var(--preview-text);border-radius:10px;place-items:center;cursor:pointer}
.lp-crm-search{width:min(440px,42vw);height:42px;border:1px solid var(--preview-border);background:var(--preview-surface-2);border-radius:11px;display:flex;align-items:center;gap:9px;padding:0 11px;color:var(--preview-muted);transition:border-color .18s,box-shadow .18s,background .18s}
.lp-crm-search:focus-within{border-color:var(--preview-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--preview-primary) 12%,transparent);background:var(--preview-surface)}
.lp-crm-search input{width:100%;min-width:0;border:0;outline:0;background:transparent;color:var(--preview-text);font-size:13px}
.lp-crm-search input::placeholder{color:var(--preview-muted)}
.lp-crm-search-icon{width:17px;height:17px;min-width:17px}
.lp-crm-search-clear{width:26px;height:26px;min-width:26px;border:0;background:transparent;color:var(--preview-muted);border-radius:7px;display:grid;place-items:center;padding:0;cursor:pointer}
.lp-crm-search-clear:hover{background:var(--preview-border);color:var(--preview-text)}
.lp-crm-top-right{display:flex;align-items:center;gap:7px;flex-shrink:0}
.lp-crm-icon-btn{width:40px;height:40px;border:1px solid transparent;background:transparent;border-radius:10px;color:var(--preview-muted);display:grid;place-items:center;position:relative;cursor:pointer}
.lp-crm-icon-btn:hover{background:var(--preview-surface-2);border-color:var(--preview-border);color:var(--preview-text)}
.lp-crm-notification-dot{position:absolute;right:8px;top:7px;width:6px;height:6px;border-radius:50%;background:var(--preview-danger);box-shadow:0 0 0 2px var(--preview-surface)}
.lp-crm-profile{width:40px;height:40px;padding:0;border:1px solid var(--preview-border);background:var(--preview-surface);border-radius:11px;display:grid;place-items:center;margin-left:2px;cursor:pointer}
.lp-crm-profile:hover{border-color:var(--preview-primary);background:var(--preview-surface-2)}
.lp-crm-avatar{width:32px;height:32px;border-radius:9px;display:grid;place-items:center;background:var(--preview-primary);color:#fff;font-size:13px;font-weight:400}
.lp-crm-notification-panel{position:absolute;right:26px;top:58px;width:280px;background:var(--preview-surface);border:1px solid var(--preview-border);border-radius:13px;box-shadow:var(--preview-shadow);padding:8px;z-index:100}
.lp-crm-notification-head{display:flex;align-items:center;justify-content:space-between;padding:10px;font-size:13px;font-weight:400;color:var(--preview-text)}
.lp-crm-notification-item{padding:11px 10px;border-radius:9px}
.lp-crm-notification-item:hover{background:var(--preview-surface-2)}
.lp-crm-notification-title{font-size:13px;font-weight:400;color:var(--preview-text)}
.lp-crm-notification-meta{font-size:13px;color:var(--preview-muted);margin-top:4px}
.lp-crm-content{flex:1;min-height:0;overflow-y:auto;overflow-x:hidden;scrollbar-width:thin;scrollbar-color:var(--preview-border) transparent}
.lp-crm-content::-webkit-scrollbar{width:7px}
.lp-crm-content::-webkit-scrollbar-track{background:transparent}
.lp-crm-content::-webkit-scrollbar-thumb{background:var(--preview-border);border-radius:99px}
.lp-crm-dashboard{padding:28px 30px 42px;max-width:1800px;margin:0 auto;color:var(--preview-text)}
.lp-crm-dashboard-head{display:flex;align-items:flex-end;justify-content:space-between;gap:22px;margin-bottom:24px}
.lp-crm-dashboard-eyebrow{font-size:13px;color:var(--preview-primary);font-weight:400;text-transform:uppercase;letter-spacing:.12em;margin-bottom:7px}
.lp-crm-dashboard-title{font-size:27px;line-height:1.15;letter-spacing:-.8px;margin:0;color:var(--preview-text);font-weight:400}
.lp-crm-dashboard-subtitle{margin:8px 0 0;color:var(--preview-muted);font-size:13px}
.lp-crm-dashboard-actions{display:flex;align-items:center;gap:9px;position:relative;flex-shrink:0}
.lp-crm-action{height:40px;padding:0 13px;border-radius:10px;border:1px solid var(--preview-border);background:var(--preview-surface);color:var(--preview-text);font-size:13px;font-weight:400;display:flex;align-items:center;justify-content:center;gap:8px;transition:.18s;cursor:pointer}
.lp-crm-action:hover{background:var(--preview-surface-2);border-color:var(--preview-primary)}
.lp-crm-action.primary{border-color:var(--preview-primary);background:var(--preview-primary);color:#fff}
.lp-crm-period{height:40px;padding:0 11px;border-radius:10px;border:1px solid var(--preview-border);background:var(--preview-surface);color:var(--preview-text);font-size:13px;font-weight:400;outline:0;cursor:pointer}
.lp-crm-quick-menu{position:absolute;right:0;top:47px;width:190px;padding:7px;background:var(--preview-surface);border:1px solid var(--preview-border);border-radius:12px;box-shadow:var(--preview-shadow);z-index:20}
.lp-crm-quick-menu button{width:100%;height:38px;border:0;background:transparent;color:var(--preview-text);border-radius:8px;display:flex;align-items:center;gap:9px;padding:0 10px;font-size:13px;font-weight:400;text-align:left;cursor:pointer}
.lp-crm-quick-menu button:hover{background:var(--preview-surface-2)}
.lp-crm-stat-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}
.lp-crm-stat{background:var(--preview-surface);border:1px solid var(--preview-border);border-radius:15px;padding:18px;box-shadow:var(--preview-shadow);min-width:0}
.lp-crm-stat-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:17px}
.lp-crm-stat-icon{width:39px;height:39px;border-radius:11px;background:var(--preview-primary-soft);color:var(--preview-primary);display:grid;place-items:center}
.lp-crm-stat-title{font-size:13px;color:var(--preview-muted);font-weight:400}
.lp-crm-stat-value{font-size:22px;letter-spacing:-.5px;font-weight:400;color:var(--preview-text);margin:5px 0 8px}
.lp-crm-stat-change{display:flex;align-items:center;gap:4px;font-size:13px;font-weight:400}
.lp-crm-stat-change.positive{color:var(--preview-success)}
.lp-crm-stat-change.negative{color:var(--preview-danger)}
.lp-crm-stat-change-detail{color:var(--preview-muted);font-weight:400}
.lp-crm-columns{display:grid;grid-template-columns:minmax(0,1.65fr) minmax(300px,.85fr);gap:14px;margin-top:14px}
.lp-crm-columns.equal{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}
.lp-crm-panel{background:var(--preview-surface);border:1px solid var(--preview-border);border-radius:15px;box-shadow:var(--preview-shadow);min-width:0;overflow:hidden}
.lp-crm-panel-head{display:flex;align-items:center;justify-content:space-between;padding:18px 20px;border-bottom:1px solid var(--preview-border);gap:15px}
.lp-crm-panel-title{font-size:13px;font-weight:400;color:var(--preview-text)}
.lp-crm-panel-subtitle{font-size:13px;color:var(--preview-muted);margin-top:3px}
.lp-crm-panel-link{border:0;background:transparent;color:var(--preview-primary);font-size:13px;font-weight:400;display:flex;align-items:center;gap:3px;white-space:nowrap;cursor:pointer}
.lp-crm-chart-wrap{padding:20px;height:285px}
.lp-crm-chart-summary{display:flex;align-items:flex-end;gap:9px;margin-bottom:12px}
.lp-crm-chart-summary-value{font-size:20px;font-weight:400;color:var(--preview-text)}
.lp-crm-chart-summary-change{font-size:13px;color:var(--preview-success);font-weight:400;margin-bottom:3px;display:flex;align-items:center}
.lp-crm-chart{height:100%;display:flex;flex-direction:column}
.lp-crm-chart-grid{flex:1;display:grid;grid-template-columns:repeat(12,1fr);gap:9px;align-items:end;border-bottom:1px solid var(--preview-border);position:relative;padding-top:8px}
.lp-crm-chart-grid:before,.lp-crm-chart-grid:after{content:"";position:absolute;left:0;right:0;border-top:1px dashed var(--preview-border)}
.lp-crm-chart-grid:before{top:33%}
.lp-crm-chart-grid:after{top:66%}
.lp-crm-chart-bar{position:relative;z-index:1;width:100%;border-radius:7px 7px 2px 2px;background:linear-gradient(180deg,var(--preview-primary),color-mix(in srgb,var(--preview-primary) 40%,transparent));min-height:12px;transition:height .35s ease}
.lp-crm-chart-labels{display:grid;grid-template-columns:repeat(12,1fr);gap:9px;margin-top:8px}
.lp-crm-chart-label{text-align:center;font-size:13px;color:var(--preview-muted)}
.lp-crm-pipeline-body{padding:18px 20px}
.lp-crm-pipeline-total{font-size:25px;font-weight:400;color:var(--preview-text);letter-spacing:-.5px}
.lp-crm-pipeline-caption{font-size:13px;color:var(--preview-muted);margin-top:3px}
.lp-crm-pipeline-bars{display:grid;gap:14px;margin-top:23px}
.lp-crm-pipeline-row{display:grid;gap:7px}
.lp-crm-pipeline-label{display:flex;justify-content:space-between;font-size:13px;color:var(--preview-muted);font-weight:400}
.lp-crm-pipeline-right{display:flex;gap:8px}
.lp-crm-pipeline-count{opacity:.7}
.lp-crm-track{height:7px;background:var(--preview-surface-2);border-radius:99px;overflow:hidden}
.lp-crm-fill{height:100%;border-radius:99px;background:var(--preview-primary)}
.lp-crm-fill.green{background:var(--preview-success)}
.lp-crm-fill.orange{background:var(--preview-warning)}
.lp-crm-fill.red{background:var(--preview-danger)}
.lp-crm-insights{display:grid;grid-template-columns:1.05fr .95fr;gap:14px;margin-top:14px}
.lp-crm-source-list{padding:8px 20px 17px}
.lp-crm-source-row{padding:12px 0;border-bottom:1px solid var(--preview-border)}
.lp-crm-source-row:last-child{border-bottom:0}
.lp-crm-source-top{display:flex;align-items:center;justify-content:space-between;font-size:13px;margin-bottom:7px}
.lp-crm-source-name{font-weight:400;color:var(--preview-text)}
.lp-crm-source-count{color:var(--preview-muted)}
.lp-crm-source-track{height:7px;background:var(--preview-surface-2);border-radius:99px;overflow:hidden}
.lp-crm-source-fill{height:100%;background:var(--preview-primary);border-radius:99px}
.lp-crm-conversion-body{padding:20px}
.lp-crm-conversion-main{display:flex;align-items:center;gap:20px}
.lp-crm-ring{width:108px;height:108px;border-radius:50%;display:grid;place-items:center;background:conic-gradient(var(--preview-primary) 0 68%,var(--preview-surface-2) 68% 100%);position:relative;flex-shrink:0}
.lp-crm-ring:after{content:"";position:absolute;inset:9px;border-radius:50%;background:var(--preview-surface)}
.lp-crm-ring-value{position:relative;z-index:1;font-size:20px;font-weight:400;color:var(--preview-text)}
.lp-crm-conversion-label{font-size:13px;font-weight:400;color:var(--preview-text)}
.lp-crm-conversion-description{font-size:13px;color:var(--preview-muted);line-height:1.6;margin-top:6px}
.lp-crm-conversion-change{display:inline-flex;align-items:center;gap:4px;margin-top:9px;color:var(--preview-success);font-size:13px;font-weight:400}
.lp-crm-list{padding:4px 20px 10px}
.lp-crm-list-item{display:flex;gap:12px;padding:14px 0;border-bottom:1px solid var(--preview-border)}
.lp-crm-list-item:last-child{border-bottom:0}
.lp-crm-activity-icon{width:31px;height:31px;border-radius:9px;display:grid;place-items:center;flex:0 0 auto}
.lp-crm-activity-icon.primary{background:var(--preview-primary-soft);color:var(--preview-primary)}
.lp-crm-activity-icon.green{background:color-mix(in srgb,var(--preview-success) 11%,transparent);color:var(--preview-success)}
.lp-crm-activity-icon.orange{background:color-mix(in srgb,var(--preview-warning) 12%,transparent);color:var(--preview-warning)}
.lp-crm-activity-icon.red{background:color-mix(in srgb,var(--preview-danger) 10%,transparent);color:var(--preview-danger)}
.lp-crm-list-main{min-width:0;flex:1}
.lp-crm-list-title{font-size:13px;color:var(--preview-text);font-weight:400;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.lp-crm-list-meta{font-size:13px;color:var(--preview-muted);margin-top:4px}
.lp-crm-list-arrow{align-self:center;color:var(--preview-muted)}
.lp-crm-task-item{display:flex;align-items:center;gap:11px;padding:14px 0;border-bottom:1px solid var(--preview-border)}
.lp-crm-task-item:last-child{border-bottom:0}
.lp-crm-task-check{width:20px;height:20px;border:1px solid var(--preview-border);border-radius:6px;display:grid;place-items:center;flex:0 0 auto;color:var(--preview-primary)}
.lp-crm-task-main{min-width:0;flex:1}
.lp-crm-task-title{font-size:13px;font-weight:400;color:var(--preview-text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.lp-crm-task-due{display:flex;align-items:center;gap:5px;font-size:13px;color:var(--preview-muted);margin-top:4px}
.lp-crm-priority{font-size:13px;font-weight:400;padding:4px 6px;border-radius:5px}
.lp-crm-priority.HIGH,.lp-crm-priority.URGENT{color:var(--preview-danger);background:color-mix(in srgb,var(--preview-danger) 11%,transparent)}
.lp-crm-priority.MEDIUM{color:var(--preview-warning);background:color-mix(in srgb,var(--preview-warning) 12%,transparent)}
.lp-crm-priority.LOW{color:var(--preview-success);background:color-mix(in srgb,var(--preview-success) 10%,transparent)}
.lp-crm-deals{margin-top:14px}
.lp-crm-table-wrap{overflow:auto}
.lp-crm-table{width:100%;min-width:720px;border-collapse:collapse}
.lp-crm-table th{text-align:left;font-size:13px;text-transform:uppercase;letter-spacing:.07em;color:var(--preview-muted);font-weight:400;padding:13px 20px;background:var(--preview-surface-2);border-bottom:1px solid var(--preview-border)}
.lp-crm-table td{padding:14px 20px;border-bottom:1px solid var(--preview-border);font-size:13px;color:var(--preview-text)}
.lp-crm-table tr:last-child td{border-bottom:0}
.lp-crm-table tbody tr:hover{background:var(--preview-surface-2)}
.lp-crm-deal-name{font-weight:400}
.lp-crm-deal-owner{display:flex;align-items:center;gap:7px;color:var(--preview-muted)}
.lp-crm-mini-avatar{width:25px;height:25px;border-radius:8px;background:var(--preview-primary-soft);color:var(--preview-primary);display:grid;place-items:center;font-size:13px;font-weight:400}
.lp-crm-stage{padding:5px 8px;border-radius:6px;background:var(--preview-primary-soft);color:var(--preview-primary);font-size:13px;font-weight:400}
.lp-crm-probability{font-weight:400}
.lp-crm-prob-track{width:75px;height:5px;background:var(--preview-surface-2);border-radius:99px;overflow:hidden;margin-top:5px}
.lp-crm-prob-fill{height:100%;background:var(--preview-success);border-radius:99px}
.lp-crm-team-list{padding:5px 20px 10px}
.lp-crm-team-row{display:flex;align-items:center;gap:10px;padding:13px 0;border-bottom:1px solid var(--preview-border)}
.lp-crm-team-row:last-child{border-bottom:0}
.lp-crm-team-avatar{width:32px;height:32px;border-radius:9px;background:var(--preview-primary-soft);color:var(--preview-primary);display:grid;place-items:center;font-size:13px;font-weight:400}
.lp-crm-team-main{flex:1;min-width:0}
.lp-crm-team-name{font-size:13px;color:var(--preview-text);font-weight:400}
.lp-crm-team-deals{font-size:13px;color:var(--preview-muted);margin-top:3px}
.lp-crm-team-revenue{font-size:13px;font-weight:400;color:var(--preview-text)}
.lp-crm-quick-actions{margin-top:14px}
.lp-crm-quick-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;padding:15px 20px 20px}
.lp-crm-quick-card{height:66px;border:1px solid var(--preview-border);background:var(--preview-surface-2);border-radius:11px;color:var(--preview-text);display:flex;align-items:center;gap:10px;padding:0 13px;text-align:left;transition:.18s;cursor:pointer}
.lp-crm-quick-card:hover{border-color:var(--preview-primary);background:var(--preview-primary-soft);color:var(--preview-primary);transform:translateY(-1px)}
.lp-crm-quick-icon{width:34px;height:34px;border-radius:9px;background:var(--preview-surface);display:grid;place-items:center;flex-shrink:0}
.lp-crm-quick-label{font-size:13px;font-weight:400}
.lp-crm-footer-note{display:flex;align-items:center;justify-content:center;gap:7px;color:var(--preview-muted);font-size:13px;padding:24px 0 0}
.lp-crm-page{padding:28px 30px 42px;max-width:1500px;margin:0 auto}
.lp-crm-page-head{display:flex;align-items:flex-end;justify-content:space-between;gap:20px;margin-bottom:20px}
.lp-crm-page-eyebrow{font-size:13px;color:var(--preview-primary);font-weight:400;text-transform:uppercase;letter-spacing:.12em;margin-bottom:6px}
.lp-crm-page-title{font-size:26px;line-height:1.15;letter-spacing:-.6px;margin:0;font-weight:400;color:var(--preview-text)}
.lp-crm-page-subtitle{font-size:13px;color:var(--preview-muted);margin:7px 0 0}
.lp-crm-page-actions{display:flex;gap:8px}
.lp-crm-page-btn{height:38px;padding:0 13px;border-radius:9px;border:1px solid var(--preview-border);background:var(--preview-surface);color:var(--preview-text);display:flex;align-items:center;gap:7px;font-size:13px;font-weight:400;cursor:pointer}
.lp-crm-page-btn.primary{background:var(--preview-primary);border-color:var(--preview-primary);color:#fff}
.lp-crm-page-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-bottom:14px}
.lp-crm-page-stat{padding:16px;border:1px solid var(--preview-border);background:var(--preview-surface);border-radius:13px;box-shadow:var(--preview-shadow)}
.lp-crm-page-stat-label{font-size:13px;color:var(--preview-muted);font-weight:400}
.lp-crm-page-stat-value{font-size:21px;color:var(--preview-text);font-weight:400;margin-top:6px}
.lp-crm-page-card{border:1px solid var(--preview-border);background:var(--preview-surface);border-radius:14px;box-shadow:var(--preview-shadow);overflow:hidden}
.lp-crm-page-card-head{padding:16px 18px;border-bottom:1px solid var(--preview-border);display:flex;align-items:center;justify-content:space-between}
.lp-crm-page-card-title{font-size:13px;font-weight:400;color:var(--preview-text)}
.lp-crm-page-card-sub{font-size:13px;color:var(--preview-muted);margin-top:3px}
.lp-crm-page-table{width:100%;border-collapse:collapse}
.lp-crm-page-table th{text-align:left;padding:12px 16px;background:var(--preview-surface-2);font-size:13px;text-transform:uppercase;letter-spacing:.07em;color:var(--preview-muted);font-weight:400;border-bottom:1px solid var(--preview-border)}
.lp-crm-page-table td{padding:13px 16px;font-size:13px;color:var(--preview-text);border-bottom:1px solid var(--preview-border)}
.lp-crm-page-table tr:last-child td{border-bottom:0}
.lp-crm-badge{display:inline-flex;padding:4px 7px;border-radius:6px;background:var(--preview-primary-soft);color:var(--preview-primary);font-size:13px;font-weight:400}
.lp-crm-badge.green{background:color-mix(in srgb,var(--preview-success) 11%,transparent);color:var(--preview-success)}
.lp-crm-badge.orange{background:color-mix(in srgb,var(--preview-warning) 12%,transparent);color:var(--preview-warning)}
.lp-crm-empty-row{padding:35px;text-align:center;color:var(--preview-muted);font-size:13px}
.lp-crm-mobile-overlay{display:none}
@media(max-width:1050px){.lp-crm-stat-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.lp-crm-insights{grid-template-columns:1fr}.lp-crm-quick-grid{grid-template-columns:repeat(2,1fr)}.lp-crm-page-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:900px){.lp-crm-preview{padding:58px 18px 70px}.lp-crm-shell{height:760px;min-height:560px}.lp-crm-sidebar{position:absolute;left:0;top:0;bottom:0;height:100%;transform:translateX(-102%);box-shadow:20px 0 50px rgba(15,23,42,.18);transition:transform .25s ease}.lp-crm-sidebar.mobile-open{transform:translateX(0)}.lp-crm-sidebar.collapsed{width:268px;min-width:268px}.lp-crm-sidebar.collapsed .lp-crm-brand-text,.lp-crm-sidebar.collapsed .lp-crm-nav-label,.lp-crm-sidebar.collapsed .lp-crm-nav-link span,.lp-crm-sidebar.collapsed .lp-crm-bottom-link span{display:block}.lp-crm-mobile-menu{display:grid}.lp-crm-search{width:42px;padding:0;justify-content:center}.lp-crm-search input,.lp-crm-search-clear{display:none}.lp-crm-mobile-overlay{position:absolute;inset:0;background:rgba(15,23,42,.42);z-index:25}}
@media(max-width:700px){.lp-crm-dashboard{padding:20px 15px 30px}.lp-crm-dashboard-head{align-items:flex-start;flex-direction:column}.lp-crm-dashboard-actions{width:100%;flex-wrap:wrap}.lp-crm-action,.lp-crm-period{flex:1}.lp-crm-dashboard-title{font-size:23px}.lp-crm-stat-grid{grid-template-columns:1fr}.lp-crm-columns,.lp-crm-columns.equal{grid-template-columns:1fr}.lp-crm-quick-grid{grid-template-columns:1fr}.lp-crm-chart-wrap{height:250px}.lp-crm-conversion-main{align-items:flex-start}.lp-crm-ring{width:90px;height:90px}.lp-crm-page{padding:20px 15px 30px}.lp-crm-page-head{align-items:flex-start;flex-direction:column}.lp-crm-page-actions{width:100%}.lp-crm-page-btn{flex:1}.lp-crm-page-grid{grid-template-columns:1fr}.lp-crm-table-wrap{overflow:auto}.lp-crm-topbar{padding:0 14px}.lp-crm-notification-panel{right:12px;width:250px}}
@media(max-width:520px){.lp-crm-preview{padding:46px 12px 58px}.lp-crm-shell{border-radius:14px;height:700px}.lp-crm-topbar{padding:0 10px}.lp-crm-top-right{gap:3px}.lp-crm-icon-btn{width:37px;height:37px}.lp-crm-profile{width:37px;height:37px}.lp-crm-sidebar{width:280px}.lp-crm-dashboard-actions{gap:6px}.lp-crm-action,.lp-crm-period{height:38px}.lp-crm-panel-head{padding:15px}.lp-crm-chart-wrap{padding:15px 12px}.lp-crm-table{min-width:680px}}
      `}</style>

      <div className="lp-crm-preview-head">
        <div className="lp-crm-preview-eyebrow">POWERFUL CRM WORKSPACE</div>
        <h2 className="lp-crm-preview-heading">Powerful CRM. Everything in One Workspace.</h2>
        <p className="lp-crm-preview-subtitle">Manage your leads, contacts, companies, deals, tasks, activities and team performance from one powerful CRM workspace.</p>
      </div>

      <div className="lp-crm-shell">
        <div className={`lp-crm-sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}>
          <div className="lp-crm-brand">
            <img src="/favicon-32x32.png" className="lp-crm-brand-logo" alt="BR30 CRM" />
            {!collapsed && (
              <div className="lp-crm-brand-text">
                <div className="lp-crm-brand-title">BR30 CRM</div>
                <div className="lp-crm-brand-sub">Business workspace</div>
              </div>
            )}
          </div>

          <nav className="lp-crm-nav">
            {!collapsed && <div className="lp-crm-nav-label">Workspace</div>}
            {workspaceMenu.map(({ label, icon: Icon }) => (
              <button type="button" key={label} className={`lp-crm-nav-link ${activePage === label ? "active" : ""}`} onClick={() => selectPage(label)} title={collapsed ? label : undefined}>
                <Icon className="lp-crm-nav-icon" />
                {!collapsed && <span>{label}</span>}
              </button>
            ))}

            <div className="lp-crm-nav-divider" />
            {!collapsed && <div className="lp-crm-nav-label">Insights</div>}
            {insightMenu.map(({ label, icon: Icon }) => (
              <button type="button" key={label} className={`lp-crm-nav-link ${activePage === label ? "active" : ""}`} onClick={() => selectPage(label)} title={collapsed ? label : undefined}>
                <Icon className="lp-crm-nav-icon" />
                {!collapsed && <span>{label}</span>}
              </button>
            ))}

            <div className="lp-crm-nav-divider" />
            {!collapsed && <div className="lp-crm-nav-label">More</div>}
            {utilityMenu.map(({ label, icon: Icon }) => (
              <button type="button" key={label} className={`lp-crm-nav-link ${activePage === label ? "active" : ""}`} onClick={() => selectPage(label)} title={collapsed ? label : undefined}>
                <Icon className="lp-crm-nav-icon" />
                {!collapsed && <span>{label}</span>}
              </button>
            ))}
          </nav>

          <div className="lp-crm-sidebar-bottom">
            <button type="button" className={`lp-crm-bottom-link ${activePage === "Settings" ? "active" : ""}`} onClick={() => selectPage("Settings")}>
              <Settings className="lp-crm-nav-icon" />
              {!collapsed && <span>Settings</span>}
            </button>

            <button type="button" className="lp-crm-bottom-link logout" onClick={() => setActivePage("Logout")}>
              <LogOut className="lp-crm-nav-icon" />
              {!collapsed && <span>Logout</span>}
            </button>
          </div>

          <button
            type="button"
            className="lp-crm-collapse"
            onClick={() => {
              if (window.innerWidth <= 900) {
                setMobileOpen(false);
              } else {
                setCollapsed((value) => !value);
              }
            }}
            aria-label={mobileOpen ? "Close sidebar" : "Toggle sidebar"}>
            {mobileOpen ? <X /> : collapsed ? <ChevronRight /> : <ChevronLeft />}
          </button>
        </div>

        {mobileOpen && <button type="button" className="lp-crm-mobile-overlay" onClick={() => setMobileOpen(false)} aria-label="Close menu" />}

        <div className="lp-crm-main">
          <header className="lp-crm-topbar">
            <div className="lp-crm-top-left">
              <button type="button" className="lp-crm-mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Open menu">
                <Menu size={19} />
              </button>

              <div className="lp-crm-search">
                <Search className="lp-crm-search-icon" />
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search anything..." aria-label="Search" />
                {search && (
                  <button type="button" className="lp-crm-search-clear" onClick={() => setSearch("")} aria-label="Clear search">
                    <X size={15} />
                  </button>
                )}
              </div>
            </div>

            <div className="lp-crm-top-right">
              <button type="button" className="lp-crm-icon-btn" title={`Theme: ${theme}`} aria-label={`Theme: ${theme}`}>
                <ThemeIcon size={18} />
              </button>

              <button type="button" className="lp-crm-icon-btn" onClick={() => setShowNotifications((value) => !value)} title="Notifications" aria-label="Notifications">
                <Bell size={18} />
                <span className="lp-crm-notification-dot" />
              </button>

              <button type="button" className="lp-crm-profile" title="Profile" aria-label="Profile">
                <span className="lp-crm-avatar">BR</span>
              </button>
            </div>

            {showNotifications && (
              <div className="lp-crm-notification-panel">
                <div className="lp-crm-notification-head">
                  <span>Notifications</span>
                  <button type="button" className="lp-crm-search-clear" onClick={() => setShowNotifications(false)}>
                    <X size={14} />
                  </button>
                </div>

                <div className="lp-crm-notification-item">
                  <div className="lp-crm-notification-title">New lead assigned to sales team</div>
                  <div className="lp-crm-notification-meta">2 hours ago</div>
                </div>

                <div className="lp-crm-notification-item">
                  <div className="lp-crm-notification-title">Acme Industries proposal updated</div>
                  <div className="lp-crm-notification-meta">4 hours ago</div>
                </div>

                <div className="lp-crm-notification-item">
                  <div className="lp-crm-notification-title">Team meeting scheduled</div>
                  <div className="lp-crm-notification-meta">Yesterday</div>
                </div>
              </div>
            )}
          </header>

          <main className="lp-crm-content">
            {activePage === "Dashboard" ? (
              <DashboardHome period={period} setPeriod={setPeriod} periodLabel={periodLabel} showActions={showActions} setShowActions={setShowActions} selectPage={selectPage} />
            ) : activePage === "Logout" ? (
              <PreviewLogout selectPage={selectPage} />
            ) : (
              <PreviewPage page={activePage} selectPage={selectPage} />
            )}
          </main>
        </div>
      </div>
    </section>
  );
}

function DashboardHome({ period, setPeriod, periodLabel, showActions, setShowActions, selectPage }) {
  const currentHour = new Date().getHours();

  const greeting = currentHour >= 5 && currentHour < 12 ? "Good morning" : currentHour >= 12 && currentHour < 17 ? "Good afternoon" : currentHour >= 17 && currentHour < 21 ? "Good evening" : "Good night";
  return (
    <section className="lp-crm-dashboard">
      <div className="lp-crm-dashboard-head">
        <div>
          <div className="lp-crm-dashboard-eyebrow">Business overview</div>
          <h1 className="lp-crm-dashboard-title">{greeting}, Admin👋</h1>
          <p className="lp-crm-dashboard-subtitle">Here’s what’s happening across your business today.</p>
        </div>

        <div className="lp-crm-dashboard-actions">
          <select className="lp-crm-period" value={period} onChange={(event) => setPeriod(event.target.value)} aria-label="Dashboard period">
            <option value="30 days">30 days</option>
            <option value="90 days">90 days</option>
            <option value="12 months">12 months</option>
          </select>

          <button type="button" className="lp-crm-action">
            <RefreshCw size={14} />
            Refresh
          </button>

          <button type="button" className="lp-crm-action primary" onClick={() => setShowActions((value) => !value)}>
            <Plus size={15} />
            Add New
          </button>

          {showActions && (
            <div className="lp-crm-quick-menu">
              {quickActions.map(({ label, icon: Icon }) => (
                <button type="button" key={label} onClick={() => setShowActions(false)}>
                  <Icon size={15} />
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="lp-crm-stat-grid">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <article className="lp-crm-stat" key={stat.title}>
              <div className="lp-crm-stat-top">
                <div className="lp-crm-stat-icon">
                  <Icon size={19} />
                </div>
                <MoreHorizontal size={18} color="var(--preview-muted)" />
              </div>

              <div className="lp-crm-stat-title">{stat.title}</div>
              <div className="lp-crm-stat-value">{stat.value}</div>

              <div className={`lp-crm-stat-change ${stat.positive ? "positive" : "negative"}`}>
                {stat.positive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                {stat.change}
                <span className="lp-crm-stat-change-detail">{stat.detail}</span>
              </div>
            </article>
          );
        })}
      </div>

      <div className="lp-crm-columns">
        <section className="lp-crm-panel">
          <div className="lp-crm-panel-head">
            <div>
              <div className="lp-crm-panel-title">Revenue performance</div>
              <div className="lp-crm-panel-subtitle">{periodLabel} revenue overview</div>
            </div>

            <button type="button" className="lp-crm-panel-link" onClick={() => selectPage("Reports")}>
              View report <ChevronRight size={12} />
            </button>
          </div>

          <div className="lp-crm-chart-wrap">
            <div className="lp-crm-chart-summary">
              <div className="lp-crm-chart-summary-value">₹12.48L</div>
              <div className="lp-crm-chart-summary-change">
                <ArrowUpRight size={11} />
                18.6%
              </div>
            </div>

            <div className="lp-crm-chart">
              <div className="lp-crm-chart-grid">
                {revenueData.map((item) => (
                  <div key={item.month} className="lp-crm-chart-bar" style={{ height: `${item.value}%` }} title={`${item.month}: ${item.value}%`} />
                ))}
              </div>

              <div className="lp-crm-chart-labels">
                {revenueData.map((item) => (
                  <div className="lp-crm-chart-label" key={item.month}>
                    {item.month}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="lp-crm-panel">
          <div className="lp-crm-panel-head">
            <div>
              <div className="lp-crm-panel-title">Sales pipeline</div>
              <div className="lp-crm-panel-subtitle">Current opportunity value</div>
            </div>

            <MoreHorizontal size={18} color="var(--preview-muted)" />
          </div>

          <div className="lp-crm-pipeline-body">
            <div className="lp-crm-pipeline-total">₹28.6L</div>
            <div className="lp-crm-pipeline-caption">Total pipeline value</div>

            <div className="lp-crm-pipeline-bars">
              {pipeline.map((item) => (
                <div className="lp-crm-pipeline-row" key={item.label}>
                  <div className="lp-crm-pipeline-label">
                    <span>{item.label}</span>

                    <span className="lp-crm-pipeline-right">
                      <span>{item.value}</span>
                      <span className="lp-crm-pipeline-count">{item.deals}</span>
                    </span>
                  </div>

                  <div className="lp-crm-track">
                    <div className={`lp-crm-fill ${item.tone === "primary" ? "" : item.tone}`} style={{ width: `${item.width}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <div className="lp-crm-insights">
        <section className="lp-crm-panel">
          <div className="lp-crm-panel-head">
            <div>
              <div className="lp-crm-panel-title">Lead sources</div>
              <div className="lp-crm-panel-subtitle">Where your new leads are coming from</div>
            </div>
            <BarChart3 size={18} color="var(--preview-muted)" />
          </div>

          <div className="lp-crm-source-list">
            {leadSources.map((source) => (
              <div className="lp-crm-source-row" key={source.label}>
                <div className="lp-crm-source-top">
                  <span className="lp-crm-source-name">{source.label}</span>
                  <span className="lp-crm-source-count">
                    {source.count} leads · {source.value}%
                  </span>
                </div>

                <div className="lp-crm-source-track">
                  <div className="lp-crm-source-fill" style={{ width: `${source.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="lp-crm-panel">
          <div className="lp-crm-panel-head">
            <div>
              <div className="lp-crm-panel-title">Conversion overview</div>
              <div className="lp-crm-panel-subtitle">Lead to customer performance</div>
            </div>
            <Target size={18} color="var(--preview-muted)" />
          </div>

          <div className="lp-crm-conversion-body">
            <div className="lp-crm-conversion-main">
              <div className="lp-crm-ring">
                <span className="lp-crm-ring-value">68%</span>
              </div>

              <div>
                <div className="lp-crm-conversion-label">Overall conversion</div>
                <div className="lp-crm-conversion-description">Your sales team converted 68% of qualified opportunities during the selected period.</div>
                <div className="lp-crm-conversion-change">
                  <ArrowUpRight size={12} />
                  +7.4% from previous period
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="lp-crm-columns equal">
        <section className="lp-crm-panel">
          <div className="lp-crm-panel-head">
            <div>
              <div className="lp-crm-panel-title">Recent activities</div>
              <div className="lp-crm-panel-subtitle">Latest customer interactions</div>
            </div>

            <button type="button" className="lp-crm-panel-link" onClick={() => selectPage("Activities")}>
              View all <ChevronRight size={12} />
            </button>
          </div>

          <div className="lp-crm-list">
            {activities.map((activity) => {
              const Icon = activity.icon;

              return (
                <div className="lp-crm-list-item" key={activity.title}>
                  <div className={`lp-crm-activity-icon ${activity.tone}`}>
                    <Icon size={14} />
                  </div>

                  <div className="lp-crm-list-main">
                    <div className="lp-crm-list-title">{activity.title}</div>
                    <div className="lp-crm-list-meta">
                      {activity.type} · {activity.time}
                    </div>
                  </div>

                  <ChevronRight className="lp-crm-list-arrow" size={15} />
                </div>
              );
            })}
          </div>
        </section>

        <section className="lp-crm-panel">
          <div className="lp-crm-panel-head">
            <div>
              <div className="lp-crm-panel-title">Upcoming tasks</div>
              <div className="lp-crm-panel-subtitle">What needs your attention</div>
            </div>

            <button type="button" className="lp-crm-panel-link" onClick={() => selectPage("Tasks")}>
              View all <ChevronRight size={12} />
            </button>
          </div>

          <div className="lp-crm-list">
            {tasks.map((task) => (
              <div className="lp-crm-task-item" key={task.title}>
                <div className="lp-crm-task-check">
                  <CheckCircle2 size={13} />
                </div>

                <div className="lp-crm-task-main">
                  <div className="lp-crm-task-title">{task.title}</div>
                  <div className="lp-crm-task-due">
                    <Clock3 size={11} />
                    {task.due}
                  </div>
                </div>

                <span className={`lp-crm-priority ${task.priority}`}>{task.priority}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="lp-crm-panel lp-crm-deals">
        <div className="lp-crm-panel-head">
          <div>
            <div className="lp-crm-panel-title">Recent deals</div>
            <div className="lp-crm-panel-subtitle">Latest opportunities across your sales pipeline</div>
          </div>

          <button type="button" className="lp-crm-panel-link" onClick={() => selectPage("Deals")}>
            View all deals <ChevronRight size={12} />
          </button>
        </div>

        <div className="lp-crm-table-wrap">
          <table className="lp-crm-table">
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
              {deals.map((deal) => (
                <tr key={deal.name}>
                  <td>
                    <span className="lp-crm-deal-name">{deal.name}</span>
                  </td>

                  <td>
                    <div className="lp-crm-deal-owner">
                      <span className="lp-crm-mini-avatar">{deal.owner.slice(0, 2).toUpperCase()}</span>
                      {deal.owner}
                    </div>
                  </td>

                  <td>
                    <strong>{deal.value}</strong>
                  </td>

                  <td>
                    <span className="lp-crm-stage">{deal.stage}</span>
                  </td>

                  <td>
                    <span className="lp-crm-probability">{deal.probability}%</span>
                    <div className="lp-crm-prob-track">
                      <div className="lp-crm-prob-fill" style={{ width: `${deal.probability}%` }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="lp-crm-columns equal">
        <section className="lp-crm-panel">
          <div className="lp-crm-panel-head">
            <div>
              <div className="lp-crm-panel-title">Team performance</div>
              <div className="lp-crm-panel-subtitle">Top sales activity this period</div>
            </div>

            <button type="button" className="lp-crm-panel-link" onClick={() => selectPage("Team")}>
              View team <ChevronRight size={12} />
            </button>
          </div>

          <div className="lp-crm-team-list">
            {teamPerformance.map((member) => (
              <div className="lp-crm-team-row" key={member.name}>
                <div className="lp-crm-team-avatar">{member.initials}</div>

                <div className="lp-crm-team-main">
                  <div className="lp-crm-team-name">{member.name}</div>
                  <div className="lp-crm-team-deals">{member.deals} closed opportunities</div>
                </div>

                <div className="lp-crm-team-revenue">{member.revenue}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="lp-crm-panel">
          <div className="lp-crm-panel-head">
            <div>
              <div className="lp-crm-panel-title">Workspace snapshot</div>
              <div className="lp-crm-panel-subtitle">Current CRM activity at a glance</div>
            </div>

            <Filter size={17} color="var(--preview-muted)" />
          </div>

          <div className="lp-crm-pipeline-body">
            {[
              ["Contacts", "1,842", "82%", ""],
              ["Companies", "486", "64%", "green"],
              ["Open opportunities", "128", "58%", "orange"],
              ["Completed tasks", "76%", "76%", "green"],
            ].map(([label, value, width, tone]) => (
              <div className="lp-crm-pipeline-row" key={label}>
                <div className="lp-crm-pipeline-label">
                  <span>{label}</span>
                  <span>{value}</span>
                </div>

                <div className="lp-crm-track">
                  <div className={`lp-crm-fill ${tone}`} style={{ width }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="lp-crm-panel lp-crm-quick-actions">
        <div className="lp-crm-panel-head">
          <div>
            <div className="lp-crm-panel-title">Quick actions</div>
            <div className="lp-crm-panel-subtitle">Common actions you can access instantly</div>
          </div>
          <Plus size={17} color="var(--preview-muted)" />
        </div>

        <div className="lp-crm-quick-grid">
          {quickActions.map(({ label, icon: Icon }) => (
            <button type="button" className="lp-crm-quick-card" key={label}>
              <span className="lp-crm-quick-icon">
                <Icon size={16} />
              </span>
              <span className="lp-crm-quick-label">{label}</span>
            </button>
          ))}
        </div>
      </section>

      <div className="lp-crm-footer-note">
        <Clock3 size={11} />
        Dashboard preview is using sample data for demonstration.
      </div>
    </section>
  );
}

function PreviewPage({ page, selectPage }) {
  const config = {
    "Tags": { icon: Tag, subtitle: "Manage tags in your CRM workspace", stats: [["Total", "48"], ["Active", "36"], ["Updated Today", "12"], ["Status", "Healthy"]] },    "Meetings": { icon: CalendarDays, subtitle: "Manage meetings in your CRM workspace", stats: [["Total", "48"], ["Active", "36"], ["Updated Today", "12"], ["Status", "Healthy"]] },    "Sales Report": { icon: BarChart3, subtitle: "Manage sales report in your CRM workspace", stats: [["Total", "48"], ["Active", "36"], ["Updated Today", "12"], ["Status", "Healthy"]] },    "Leads Report": { icon: Target, subtitle: "Manage leads report in your CRM workspace", stats: [["Total", "48"], ["Active", "36"], ["Updated Today", "12"], ["Status", "Healthy"]] },    "Deals Report": { icon: CircleDollarSign, subtitle: "Manage deals report in your CRM workspace", stats: [["Total", "48"], ["Active", "36"], ["Updated Today", "12"], ["Status", "Healthy"]] },    "Activity Report": { icon: Activity, subtitle: "Manage activity report in your CRM workspace", stats: [["Total", "48"], ["Active", "36"], ["Updated Today", "12"], ["Status", "Healthy"]] },    "Email": { icon: FileText, subtitle: "Manage email in your CRM workspace", stats: [["Total", "48"], ["Active", "36"], ["Updated Today", "12"], ["Status", "Healthy"]] },    "WhatsApp": { icon: MessageCircle, subtitle: "Manage whatsapp in your CRM workspace", stats: [["Total", "48"], ["Active", "36"], ["Updated Today", "12"], ["Status", "Healthy"]] },    "SMS": { icon: Smartphone, subtitle: "Manage sms in your CRM workspace", stats: [["Total", "48"], ["Active", "36"], ["Updated Today", "12"], ["Status", "Healthy"]] },    "Communication History": { icon: FileText, subtitle: "Manage communication history in your CRM workspace", stats: [["Total", "48"], ["Active", "36"], ["Updated Today", "12"], ["Status", "Healthy"]] },    "Forms": { icon: FileText, subtitle: "Manage forms in your CRM workspace", stats: [["Total", "48"], ["Active", "36"], ["Updated Today", "12"], ["Status", "Healthy"]] },    "Public Links": { icon: Link2, subtitle: "Manage public links in your CRM workspace", stats: [["Total", "48"], ["Active", "36"], ["Updated Today", "12"], ["Status", "Healthy"]] },    "QR": { icon: QrCode, subtitle: "Manage qr in your CRM workspace", stats: [["Total", "48"], ["Active", "36"], ["Updated Today", "12"], ["Status", "Healthy"]] },    "Sources / Campaigns": { icon: Globe, subtitle: "Manage sources / campaigns in your CRM workspace", stats: [["Total", "48"], ["Active", "36"], ["Updated Today", "12"], ["Status", "Healthy"]] },    "Automations": { icon: Workflow, subtitle: "Manage automations in your CRM workspace", stats: [["Total", "48"], ["Active", "36"], ["Updated Today", "12"], ["Status", "Healthy"]] },    "Workflows": { icon: Network, subtitle: "Manage workflows in your CRM workspace", stats: [["Total", "48"], ["Active", "36"], ["Updated Today", "12"], ["Status", "Healthy"]] },    "Webhooks": { icon: Link2, subtitle: "Manage webhooks in your CRM workspace", stats: [["Total", "48"], ["Active", "36"], ["Updated Today", "12"], ["Status", "Healthy"]] },    "Members": { icon: UsersRound, subtitle: "Manage members in your CRM workspace", stats: [["Total", "48"], ["Active", "36"], ["Updated Today", "12"], ["Status", "Healthy"]] },    "Roles": { icon: ShieldCheck, subtitle: "Manage roles in your CRM workspace", stats: [["Total", "48"], ["Active", "36"], ["Updated Today", "12"], ["Status", "Healthy"]] },    "Permissions": { icon: ShieldCheck, subtitle: "Manage permissions in your CRM workspace", stats: [["Total", "48"], ["Active", "36"], ["Updated Today", "12"], ["Status", "Healthy"]] },    "Integrations": { icon: Network, subtitle: "Manage integrations in your CRM workspace", stats: [["Total", "48"], ["Active", "36"], ["Updated Today", "12"], ["Status", "Healthy"]] },    "Subscription": { icon: CreditCard, subtitle: "Manage subscription in your CRM workspace", stats: [["Total", "48"], ["Active", "36"], ["Updated Today", "12"], ["Status", "Healthy"]] },    Leads: {
      icon: Target,
      subtitle: "Manage and track your sales leads",
      stats: [
        ["Total Leads", "342"],
        ["New Today", "28"],
        ["Qualified", "186"],
        ["Conversion", "68%"],
      ],
    },
    Contacts: {
      icon: ContactRound,
      subtitle: "Manage your customer contacts",
      stats: [
        ["Total Contacts", "1,842"],
        ["New This Month", "126"],
        ["Active", "1,604"],
        ["Archived", "238"],
      ],
    },
    Companies: {
      icon: Building2,
      subtitle: "Manage organizations and business accounts",
      stats: [
        ["Companies", "486"],
        ["Active", "421"],
        ["New This Month", "32"],
        ["Accounts", "184"],
      ],
    },
    Deals: {
      icon: CircleDollarSign,
      subtitle: "Track opportunities across your sales pipeline",
      stats: [
        ["Active Deals", "128"],
        ["Pipeline", "₹28.6L"],
        ["Won This Month", "₹8.4L"],
        ["Win Rate", "72%"],
      ],
    },
    Activities: {
      icon: Activity,
      subtitle: "Track calls, meetings and customer interactions",
      stats: [
        ["Activities", "684"],
        ["Calls", "218"],
        ["Meetings", "146"],
        ["Emails", "320"],
      ],
    },
    Tasks: {
      icon: CheckSquare,
      subtitle: "Manage your team's upcoming work",
      stats: [
        ["Open Tasks", "24"],
        ["Due Today", "8"],
        ["Completed", "76%"],
        ["Overdue", "3"],
      ],
    },
    Pipelines: {
      icon: GitBranch,
      subtitle: "Manage your sales process and opportunity stages",
      stats: [
        ["Pipelines", "4"],
        ["Stages", "18"],
        ["Open Deals", "128"],
        ["Value", "₹28.6L"],
      ],
    },
    Reports: {
      icon: BarChart3,
      subtitle: "Analyze business performance and sales activity",
      stats: [
        ["Reports", "24"],
        ["Revenue", "₹12.48L"],
        ["Growth", "+18.6%"],
        ["Conversion", "68%"],
      ],
    },
    Calendar: {
      icon: CalendarDays,
      subtitle: "Manage meetings, events and important dates",
      stats: [
        ["Today", "6"],
        ["This Week", "24"],
        ["Meetings", "14"],
        ["Events", "10"],
      ],
    },
    Team: {
      icon: UsersRound,
      subtitle: "Monitor team activity and performance",
      stats: [
        ["Team Members", "24"],
        ["Active", "21"],
        ["Top Performer", "Rahul"],
        ["Deals Closed", "87"],
      ],
    },
    Notifications: {
      icon: BellRing,
      subtitle: "Stay updated with important CRM activity",
      stats: [
        ["Unread", "8"],
        ["Today", "14"],
        ["Mentions", "5"],
        ["Alerts", "3"],
      ],
    },
    Templates: {
      icon: FileText,
      subtitle: "Manage reusable communication templates",
      stats: [
        ["Templates", "36"],
        ["Emails", "18"],
        ["Documents", "10"],
        ["Messages", "8"],
      ],
    },
    Announcements: {
      icon: Megaphone,
      subtitle: "Share important updates with your team",
      stats: [
        ["Published", "18"],
        ["Drafts", "4"],
        ["Scheduled", "3"],
        ["Views", "1.8K"],
      ],
    },
    "Audit Log": {
      icon: ShieldCheck,
      subtitle: "Review workspace activity and security events",
      stats: [
        ["Events", "2,846"],
        ["Today", "126"],
        ["Users", "24"],
        ["Alerts", "3"],
      ],
    },
    Settings: {
      icon: Settings,
      subtitle: "Manage workspace preferences and configuration",
      stats: [
        ["Workspace", "Active"],
        ["Members", "24"],
        ["Integrations", "8"],
        ["Security", "Good"],
      ],
    },
  }[page] || { icon: LayoutDashboard, subtitle: "CRM workspace preview", stats: [] };

  const Icon = config.icon;

  const rowsByPage = {
    Leads: [
      ["Rohan Mehta", "Rahul Sharma", "New", "10 min ago"],
      ["Ananya Verma", "Priya Singh", "Qualified", "42 min ago"],
      ["Karan Malhotra", "Amit Kumar", "Contacted", "1 hr ago"],
      ["Sneha Kapoor", "Neha Singh", "New", "2 hrs ago"],
      ["Arjun Patel", "Vikas", "Converted", "Yesterday"],
      ["Meera Joshi", "Rahul Sharma", "Qualified", "Yesterday"],
    ],

    Contacts: [
      ["Riya Sharma", "Acme Industries", "Active", "10 min ago"],
      ["Aditya Kumar", "Nova Technologies", "Active", "42 min ago"],
      ["Pooja Verma", "Vertex Solutions", "Inactive", "1 hr ago"],
      ["Nikhil Singh", "Bluewave Retail", "Active", "2 hrs ago"],
      ["Kavita Rao", "Orion Enterprises", "Active", "Yesterday"],
      ["Aman Gupta", "Summit Group", "Active", "Yesterday"],
    ],

    Companies: [
      ["Acme Industries", "Rahul Sharma", "Active", "Today"],
      ["Nova Technologies", "Priya Singh", "Active", "2 hrs ago"],
      ["Vertex Solutions", "Amit Kumar", "Prospect", "5 hrs ago"],
      ["Bluewave Retail", "Neha Singh", "Active", "Yesterday"],
      ["Orion Enterprises", "Vikas", "Active", "Yesterday"],
      ["Summit Group", "Rahul Sharma", "Inactive", "2 days ago"],
    ],

    Deals: [
      ["Acme Industries Deal", "Rahul Sharma", "Proposal", "Today"],
      ["Nova Technologies Deal", "Priya Singh", "Negotiation", "2 hrs ago"],
      ["Vertex Solutions Deal", "Amit Kumar", "Qualified", "5 hrs ago"],
      ["Bluewave Retail Deal", "Neha Singh", "New", "Yesterday"],
      ["Orion Enterprises Deal", "Vikas", "Proposal", "Yesterday"],
      ["Summit Group Deal", "Rahul Sharma", "Won", "2 days ago"],
    ],

    Activities: [
      ["Follow-up Call", "Rahul Sharma", "Completed", "10 min ago"],
      ["Proposal Sent", "Priya Singh", "Completed", "42 min ago"],
      ["Client Meeting", "Amit Kumar", "In Progress", "1 hr ago"],
      ["Lead Assignment", "Neha Singh", "Completed", "2 hrs ago"],
      ["Deal Negotiation", "Vikas", "In Progress", "3 hrs ago"],
      ["Account Review", "Rahul Sharma", "Completed", "Yesterday"],
    ],

    Tasks: [
      ["Call Premium Client", "Rahul Sharma", "In Progress", "Today"],
      ["Review New Proposal", "Priya Singh", "Pending", "Today"],
      ["Sales Team Meeting", "Amit Kumar", "Pending", "Today"],
      ["Update Lead Pipeline", "Neha Singh", "Completed", "Tomorrow"],
      ["Follow Up With Client", "Vikas", "Pending", "Tomorrow"],
      ["Prepare Sales Report", "Rahul Sharma", "Completed", "2 days ago"],
    ],

    Pipelines: [
      ["New Leads", "Rahul Sharma", "Active", "Today"],
      ["Qualified", "Priya Singh", "Active", "Today"],
      ["Proposal", "Amit Kumar", "Active", "Yesterday"],
      ["Negotiation", "Neha Singh", "Active", "Yesterday"],
      ["Closed Won", "Vikas", "Completed", "2 days ago"],
      ["Closed Lost", "Rahul Sharma", "Completed", "3 days ago"],
    ],

    Reports: [
      ["Revenue Report", "Rahul Sharma", "Completed", "Today"],
      ["Sales Performance", "Priya Singh", "Completed", "Yesterday"],
      ["Lead Conversion", "Amit Kumar", "In Progress", "Yesterday"],
      ["Pipeline Report", "Neha Singh", "Completed", "2 days ago"],
      ["Team Performance", "Vikas", "Completed", "2 days ago"],
      ["Activity Report", "Rahul Sharma", "Completed", "3 days ago"],
    ],

    Calendar: [
      ["Sales Meeting", "Rahul Sharma", "Confirmed", "Today"],
      ["Client Demo", "Priya Singh", "Confirmed", "Today"],
      ["Team Review", "Amit Kumar", "Scheduled", "Tomorrow"],
      ["Proposal Meeting", "Neha Singh", "Confirmed", "Tomorrow"],
      ["Follow-up Meeting", "Vikas", "Scheduled", "2 days ago"],
      ["Quarterly Review", "Rahul Sharma", "Scheduled", "3 days ago"],
    ],

    Team: [
      ["Rahul Sharma", "Sales", "Active", "Today"],
      ["Priya Singh", "Sales", "Active", "Today"],
      ["Amit Kumar", "Business", "Active", "Yesterday"],
      ["Neha Singh", "Sales", "Active", "Yesterday"],
      ["Vikas", "Management", "Active", "Yesterday"],
      ["Karan Mehta", "Support", "Inactive", "2 days ago"],
    ],

    Notifications: [
      ["New Lead Assigned", "Rahul Sharma", "Unread", "10 min ago"],
      ["Proposal Updated", "Priya Singh", "Read", "42 min ago"],
      ["Meeting Reminder", "Amit Kumar", "Unread", "1 hr ago"],
      ["Deal Stage Changed", "Neha Singh", "Read", "2 hrs ago"],
      ["New Comment Received", "Vikas", "Unread", "Yesterday"],
      ["Task Completed", "Rahul Sharma", "Read", "Yesterday"],
    ],

    Templates: [
      ["Welcome Email", "Rahul Sharma", "Active", "Today"],
      ["Sales Proposal", "Priya Singh", "Active", "Yesterday"],
      ["Follow-up Message", "Amit Kumar", "Active", "Yesterday"],
      ["Meeting Reminder", "Neha Singh", "Draft", "2 days ago"],
      ["Invoice Email", "Vikas", "Active", "2 days ago"],
      ["Lead Introduction", "Rahul Sharma", "Draft", "3 days ago"],
    ],

    Announcements: [
      ["Q4 Sales Target", "Rahul Sharma", "Published", "Today"],
      ["New CRM Features", "Priya Singh", "Published", "Yesterday"],
      ["Team Meeting Update", "Amit Kumar", "Scheduled", "Yesterday"],
      ["Holiday Notice", "Neha Singh", "Published", "2 days ago"],
      ["Sales Incentive Plan", "Vikas", "Published", "2 days ago"],
      ["System Maintenance", "Rahul Sharma", "Scheduled", "3 days ago"],
    ],

    "Audit Log": [
      ["Login Activity", "Rahul Sharma", "Active", "10 min ago"],
      ["Deal Updated", "Priya Singh", "Completed", "42 min ago"],
      ["Lead Created", "Amit Kumar", "Completed", "1 hr ago"],
      ["Contact Updated", "Neha Singh", "Completed", "2 hrs ago"],
      ["Settings Changed", "Vikas", "Completed", "Yesterday"],
      ["User Role Updated", "Rahul Sharma", "Completed", "Yesterday"],
    ],

    Settings: [
      ["Workspace Settings", "Admin", "Active", "Today"],
      ["Team Preferences", "Rahul Sharma", "Active", "Yesterday"],
      ["Notification Settings", "Priya Singh", "Active", "Yesterday"],
      ["Security Settings", "Amit Kumar", "Good", "2 days ago"],
      ["Integrations", "Neha Singh", "Connected", "2 days ago"],
      ["Billing Settings", "Vikas", "Active", "3 days ago"],
    ],
  };

  const rows = rowsByPage[page] || [
    [`${page} activity`, "Rahul Sharma", "Active", "Today"],
    [`${page} update`, "Priya Singh", "Completed", "2 hrs ago"],
    [`${page} record`, "Amit Kumar", "In Progress", "Yesterday"],
    [`${page} review`, "Neha Singh", "Active", "Yesterday"],
    [`${page} configuration`, "Vikas", "Updated", "2 days ago"],
  ];

  const performanceByPage = {
    Leads: [
      ["Lead qualification", "88%", 88, ""],
      ["Lead conversion", "68%", 68, "green"],
      ["Follow-up completion", "91%", 91, "orange"],
    ],
    Contacts: [
      ["Contact activity", "82%", 82, ""],
      ["Data completeness", "94%", 94, "green"],
      ["Contact engagement", "76%", 76, "orange"],
    ],
    Companies: [
      ["Account coverage", "86%", 86, ""],
      ["Active accounts", "91%", 91, "green"],
      ["Account growth", "74%", 74, "orange"],
    ],
    Deals: [
      ["Pipeline progress", "84%", 84, ""],
      ["Target achievement", "72%", 72, "green"],
      ["Deal completion", "91%", 91, "orange"],
    ],
    Activities: [
      ["Activity completion", "89%", 89, ""],
      ["Call completion", "78%", 78, "green"],
      ["Meeting completion", "93%", 93, "orange"],
    ],
    Tasks: [
      ["Task completion", "76%", 76, ""],
      ["Due today completion", "84%", 84, "green"],
      ["On-time delivery", "91%", 91, "orange"],
    ],
    Pipelines: [
      ["Stage progression", "81%", 81, ""],
      ["Pipeline coverage", "89%", 89, "green"],
      ["Stage completion", "73%", 73, "orange"],
    ],
    Reports: [
      ["Report generation", "92%", 92, ""],
      ["Data accuracy", "96%", 96, "green"],
      ["Report usage", "78%", 78, "orange"],
    ],
    Calendar: [
      ["Meeting attendance", "87%", 87, ""],
      ["Schedule completion", "94%", 94, "green"],
      ["Event completion", "81%", 81, "orange"],
    ],
    Team: [
      ["Team productivity", "84%", 84, ""],
      ["Target achievement", "91%", 91, "green"],
      ["Team completion", "88%", 88, "orange"],
    ],
    Notifications: [
      ["Notification delivery", "98%", 98, ""],
      ["Read rate", "82%", 82, "green"],
      ["Response rate", "71%", 71, "orange"],
    ],
    Templates: [
      ["Template usage", "79%", 79, ""],
      ["Email delivery", "96%", 96, "green"],
      ["Template completion", "88%", 88, "orange"],
    ],
    Announcements: [
      ["Announcement reach", "91%", 91, ""],
      ["Read rate", "86%", 86, "green"],
      ["Engagement", "72%", 72, "orange"],
    ],
    "Audit Log": [
      ["Log coverage", "99%", 99, ""],
      ["Security checks", "96%", 96, "green"],
      ["Audit completion", "93%", 93, "orange"],
    ],
    Settings: [
      ["Configuration", "92%", 92, ""],
      ["Security health", "96%", 96, "green"],
      ["Workspace readiness", "88%", 88, "orange"],
    ],
  };

  const performanceRows = performanceByPage[page] || [
    ["Current performance", "84%", 84, ""],
    ["Target achievement", "72%", 72, "green"],
    ["Team completion", "91%", 91, "orange"],
  ];

  const recentActivityByPage = {
    Leads: [
      ["New lead created", "Rohan Mehta", "10 min ago"],
      ["Lead qualified", "Ananya Verma", "42 min ago"],
      ["Lead assigned", "Karan Malhotra", "1 hr ago"],
    ],
    Contacts: [
      ["Contact added", "Riya Sharma", "10 min ago"],
      ["Contact updated", "Aditya Kumar", "42 min ago"],
      ["Contact archived", "Pooja Verma", "1 hr ago"],
    ],
    Companies: [
      ["New company added", "Acme Industries", "10 min ago"],
      ["Account updated", "Nova Technologies", "42 min ago"],
      ["Company assigned", "Vertex Solutions", "1 hr ago"],
    ],
    Deals: [
      ["Deal stage updated", "Acme Industries Deal", "10 min ago"],
      ["Proposal sent", "Nova Technologies Deal", "42 min ago"],
      ["Deal qualified", "Vertex Solutions Deal", "1 hr ago"],
    ],
    Activities: [
      ["Client call completed", "Rahul Sharma", "10 min ago"],
      ["Meeting scheduled", "Priya Singh", "42 min ago"],
      ["Email sent", "Amit Kumar", "1 hr ago"],
    ],
    Tasks: [
      ["Task completed", "Call Premium Client", "10 min ago"],
      ["Task assigned", "Review New Proposal", "42 min ago"],
      ["Task due today", "Sales Team Meeting", "1 hr ago"],
    ],
    Pipelines: [
      ["Lead moved to Qualified", "Rahul Sharma", "10 min ago"],
      ["Deal moved to Proposal", "Priya Singh", "42 min ago"],
      ["Deal moved to Negotiation", "Amit Kumar", "1 hr ago"],
    ],
    Reports: [
      ["Revenue report generated", "Rahul Sharma", "10 min ago"],
      ["Sales report updated", "Priya Singh", "42 min ago"],
      ["Conversion report viewed", "Amit Kumar", "1 hr ago"],
    ],
    Calendar: [
      ["Client demo scheduled", "Rahul Sharma", "10 min ago"],
      ["Sales meeting confirmed", "Priya Singh", "42 min ago"],
      ["Team review added", "Amit Kumar", "1 hr ago"],
    ],
    Team: [
      ["New team member added", "Karan Mehta", "10 min ago"],
      ["Target updated", "Rahul Sharma", "42 min ago"],
      ["Performance reviewed", "Priya Singh", "1 hr ago"],
    ],
    Notifications: [
      ["New lead notification", "Rahul Sharma", "10 min ago"],
      ["Deal update notification", "Priya Singh", "42 min ago"],
      ["Task reminder", "Amit Kumar", "1 hr ago"],
    ],
    Templates: [
      ["Welcome Email used", "Rahul Sharma", "10 min ago"],
      ["Sales Proposal updated", "Priya Singh", "42 min ago"],
      ["Follow-up template used", "Amit Kumar", "1 hr ago"],
    ],
    Announcements: [
      ["Announcement published", "Rahul Sharma", "10 min ago"],
      ["Team update scheduled", "Priya Singh", "42 min ago"],
      ["Announcement viewed", "Amit Kumar", "1 hr ago"],
    ],
    "Audit Log": [
      ["Login activity recorded", "Rahul Sharma", "10 min ago"],
      ["Deal update recorded", "Priya Singh", "42 min ago"],
      ["Settings change recorded", "Vikas", "1 hr ago"],
    ],
    Settings: [
      ["Workspace settings updated", "Admin", "10 min ago"],
      ["Notification settings changed", "Rahul Sharma", "42 min ago"],
      ["Security settings reviewed", "Amit Kumar", "1 hr ago"],
    ],
  };

  const performanceRowsForPage = performanceRows;
  const recentActivities = recentActivityByPage[page] || [
    [`${page} created`, "Rahul Sharma", "10 min ago"],
    [`${page} updated`, "Priya Singh", "42 min ago"],
    [`${page} action completed`, "Amit Kumar", "1 hr ago"],
  ];

  return (
    <section className="lp-crm-page">
      <div className="lp-crm-page-head">
        <div>
          <div className="lp-crm-page-eyebrow">CRM workspace</div>
          <h1 className="lp-crm-page-title">{page}</h1>
          <p className="lp-crm-page-subtitle">{config.subtitle}</p>
        </div>

        <div className="lp-crm-page-actions">
          <button type="button" className="lp-crm-page-btn">
            <RefreshCw size={13} />
            Refresh
          </button>

          <button type="button" className="lp-crm-page-btn primary">
            <Plus size={13} />
            Add New
          </button>
        </div>
      </div>

      <div className="lp-crm-page-grid">
        {config.stats.map(([label, value]) => (
          <div className="lp-crm-page-stat" key={label}>
            <div className="lp-crm-page-stat-label">{label}</div>
            <div className="lp-crm-page-stat-value">{value}</div>
          </div>
        ))}
      </div>

      <div className="lp-crm-page-card">
        <div className="lp-crm-page-card-head">
          <div>
            <div className="lp-crm-page-card-title">{page} overview</div>
            <div className="lp-crm-page-card-sub">Preview data for the landing page demonstration</div>
          </div>

          <Icon size={18} color="var(--preview-muted)" />
        </div>

        <div className="lp-crm-table-wrap">
          <table className="lp-crm-page-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Owner</th>
                <th>Status</th>
                <th>Updated</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row, index) => (
                <tr key={`${row[0]}-${index}`}>
                  <td>
                    <strong>{row[0]}</strong>
                  </td>
                  <td>{row[1]}</td>
                  <td>
                    <span className={`lp-crm-badge ${row[2] === "Completed" ? "green" : row[2] === "In Progress" ? "orange" : ""}`}>{row[2]}</span>
                  </td>
                  <td>{row[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="lp-crm-columns equal" style={{ marginTop: "14px" }}>
        <div className="lp-crm-page-card">
          <div className="lp-crm-page-card-head">
            <div>
              <div className="lp-crm-page-card-title">Performance overview</div>
              <div className="lp-crm-page-card-sub">Sample performance metrics</div>
            </div>
            <TrendingUp size={17} color="var(--preview-success)" />
          </div>

          <div className="lp-crm-pipeline-body">
            {performanceRowsForPage.map(([label, value, width, tone]) => (
              <div className="lp-crm-pipeline-row" key={label}>
                <div className="lp-crm-pipeline-label">
                  <span>{label}</span>
                  <span>{value}</span>
                </div>

                <div className="lp-crm-track">
                  <div className={`lp-crm-fill ${tone}`} style={{ width: `${width}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lp-crm-page-card">
          <div className="lp-crm-page-card-head">
            <div>
              <div className="lp-crm-page-card-title">Recent activity</div>
              <div className="lp-crm-page-card-sub">Latest workspace updates</div>
            </div>
            <Clock3 size={17} color="var(--preview-muted)" />
          </div>

          <div className="lp-crm-list">
            {recentActivities.map(([title, name, time, tone, Icon]) => {
              const ActivityIcon = Icon || Activity;

              return (
                <div className="lp-crm-list-item" key={`${title}-${name}`}>
                  <div className={`lp-crm-activity-icon ${tone || "primary"}`}>
                    <ActivityIcon size={13} />
                  </div>

                  <div className="lp-crm-list-main">
                    <div className="lp-crm-list-title">{title}</div>
                    <div className="lp-crm-list-meta">
                      {name} · {time}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="lp-crm-footer-note">
        <Clock3 size={11} />
        This section is a hard-coded CRM preview for demonstration.
      </div>
    </section>
  );
}

function PreviewLogout({ selectPage }) {
  return (
    <section className="lp-crm-page">
      <div className="lp-crm-page-card" style={{ padding: "60px 30px", textAlign: "center" }}>
        <div className="lp-crm-stat-icon" style={{ margin: "0 auto 18px" }}>
          <LogOut size={20} />
        </div>

        <h2 className="lp-crm-page-title" style={{ fontSize: "22px" }}>
          Logout preview
        </h2>

        <p className="lp-crm-page-subtitle" style={{ marginTop: "9px" }}>
          This is only a landing-page demonstration. No actual logout action is performed.
        </p>

        <button type="button" className="lp-crm-page-btn primary" style={{ margin: "22px auto 0" }} onClick={() => selectPage("Dashboard")}>
          <LayoutDashboard size={13} />
          Return to Dashboard
        </button>
      </div>
    </section>
  );
}

export default DashboardPreview;
