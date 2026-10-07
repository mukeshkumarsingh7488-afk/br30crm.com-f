import { useEffect, useMemo, useRef, useState } from "react";
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
  Eye,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  ClipboardList,
  Clock3,
  ContactRound,
  FileText,
  FolderOpen,
  Filter,
  GitBranch,
  Globe,
  LayoutDashboard,
  Link2,
  LogOut,
  Mail,
  Menu,
  Megaphone,
  MessageCircle,
  MoreHorizontal,
  Network,
  Workflow,
  Wrench,
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

const crmMenu = [
  { label: "Leads", icon: Target },
  { label: "Contacts", icon: ContactRound },
  { label: "Companies", icon: Building2 },
  { label: "Tags", icon: Tag },
  { label: "Deals", icon: CircleDollarSign },
  { label: "Pipelines", icon: GitBranch },
  { label: "Tasks", icon: CheckSquare },
  { label: "Activities", icon: Activity },
  { label: "Notes", icon: FileText },
  { label: "Files", icon: FolderOpen },
  { label: "Meetings", icon: CalendarDays },
  { label: "Calendar", icon: CalendarDays },
];

const communicationMenu = [
  { label: "Email", icon: Mail },
  { label: "WhatsApp", icon: MessageCircle },
  { label: "SMS", icon: Smartphone },
  { label: "Communication History", icon: FileText },
];

const leadGenerationMenu = [
  { label: "Forms", icon: FileText },
  { label: "Public Links", icon: Link2 },
  { label: "QR", icon: QrCode },
  { label: "Sources / Campaigns", icon: Globe },
];

const automationMenu = [
  { label: "Automations", icon: Workflow },
  { label: "Workflows", icon: Network },
  { label: "Webhooks", icon: Link2 },
];

const reportsMenu = [
  { label: "Sales", icon: BarChart3 },
  { label: "Leads", icon: Target },
  { label: "Deals", icon: CircleDollarSign },
  { label: "Activity", icon: Activity },
];

const teamMenu = [
  { label: "Team", icon: UsersRound },
  { label: "Members", icon: UsersRound },
  { label: "Roles", icon: ShieldCheck },
  { label: "Permissions", icon: ShieldCheck },
];

const systemMenu = [
  { label: "Notifications", icon: BellRing },
  { label: "Audit Logs", icon: ShieldCheck },
  { label: "CRM Tools", icon: Wrench },
  { label: "Analytics", icon: BarChart3 },
  { label: "Integrations", icon: Network },
  { label: "Subscription", icon: CreditCard },
];

const sections = [
  { label: "CRM", items: crmMenu },
  { label: "Communication", items: communicationMenu },
  { label: "Lead Generation", items: leadGenerationMenu },
  { label: "Automation", items: automationMenu },
  { label: "Reports", items: reportsMenu },
  { label: "Team", items: teamMenu },
  { label: "System", items: systemMenu },
];

const allPreviewPages = sections.flatMap((section) => section.items).concat([{ label: "Settings", icon: Settings }]);

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
  const notificationRef = useRef(null);

  useEffect(() => {
    if (!showNotifications) return;
    const handleOutsideClick = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [showNotifications]);

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
.lp-crm-notification-wrap{position:relative}.lp-crm-notification-panel{position:absolute;right:0;top:48px;width:280px;background:var(--preview-surface);border:1px solid var(--preview-border);border-radius:13px;box-shadow:var(--preview-shadow);padding:8px;z-index:100}
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
.lp-crm-page-grid{display:block;margin-bottom:14px}.lp-crm-page-table-card{width:100%}.lp-crm-page-side{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin-top:14px}.lp-crm-page-side>.lp-crm-page-card:nth-child(3){grid-column:1/-1}
.lp-crm-page-stat-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin-bottom:14px}.lp-crm-page-stat{padding:12px 14px;border:1px solid var(--preview-border);background:var(--preview-surface);border-radius:11px;box-shadow:none;min-width:0}.lp-crm-page-stat-label{font-size:12px;color:var(--preview-muted);font-weight:400;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.lp-crm-page-stat-value{font-size:18px;color:var(--preview-text);font-weight:400;margin-top:4px;line-height:1.2}.lp-crm-page-footer{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 16px;border-top:1px solid var(--preview-border);font-size:12px;color:var(--preview-muted)}.lp-crm-page-pagination{display:flex;align-items:center;gap:6px}.lp-crm-page-pagination .lp-crm-page-btn{width:34px;height:34px;padding:0;justify-content:center}.lp-crm-page-stat{padding:12px 14px;border:1px solid var(--preview-border);background:var(--preview-surface);border-radius:11px;box-shadow:none;min-width:0}
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
@media(max-width:1050px){.lp-crm-stat-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.lp-crm-page-stat-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.lp-crm-insights{grid-template-columns:1fr}.lp-crm-quick-grid{grid-template-columns:repeat(2,1fr)}.lp-crm-page-side{grid-template-columns:1fr}.lp-crm-page-side>.lp-crm-page-card:nth-child(3){grid-column:auto}}
@media(max-width:900px){.lp-crm-preview{padding:58px 18px 70px}.lp-crm-shell{height:760px;min-height:560px}.lp-crm-sidebar{position:absolute;left:0;top:0;bottom:0;height:100%;transform:translateX(-102%);box-shadow:20px 0 50px rgba(15,23,42,.18);transition:transform .25s ease}.lp-crm-sidebar.mobile-open{transform:translateX(0)}.lp-crm-sidebar.collapsed{width:268px;min-width:268px}.lp-crm-sidebar.collapsed .lp-crm-brand-text,.lp-crm-sidebar.collapsed .lp-crm-nav-label,.lp-crm-sidebar.collapsed .lp-crm-nav-link span,.lp-crm-sidebar.collapsed .lp-crm-bottom-link span{display:block}.lp-crm-mobile-menu{display:grid}.lp-crm-search{width:42px;padding:0;justify-content:center}.lp-crm-search input,.lp-crm-search-clear{display:none}.lp-crm-mobile-overlay{position:absolute;inset:0;background:rgba(15,23,42,.42);z-index:25}}
@media(max-width:700px){.lp-crm-page-stat-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.lp-crm-page-footer{align-items:flex-start;flex-wrap:wrap}.lp-crm-dashboard{padding:20px 15px 30px}.lp-crm-dashboard-head{align-items:flex-start;flex-direction:column}.lp-crm-dashboard-actions{width:100%;flex-wrap:wrap}.lp-crm-action,.lp-crm-period{flex:1}.lp-crm-dashboard-title{font-size:23px}.lp-crm-stat-grid{grid-template-columns:1fr}.lp-crm-columns,.lp-crm-columns.equal{grid-template-columns:1fr}.lp-crm-quick-grid{grid-template-columns:1fr}.lp-crm-chart-wrap{height:250px}.lp-crm-conversion-main{align-items:flex-start}.lp-crm-ring{width:90px;height:90px}.lp-crm-page{padding:20px 15px 30px}.lp-crm-page-head{align-items:flex-start;flex-direction:column}.lp-crm-page-actions{width:100%}.lp-crm-page-btn{flex:1}.lp-crm-page-side{grid-template-columns:1fr}.lp-crm-page-side>.lp-crm-page-card:nth-child(3){grid-column:auto}.lp-crm-table-wrap{overflow:auto}.lp-crm-topbar{padding:0 14px}.lp-crm-notification-panel{right:0;width:250px}}
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
            {!collapsed && <div className="lp-crm-nav-label">Dashboard</div>}
            <button type="button" className={`lp-crm-nav-link ${activePage === "Dashboard" ? "active" : ""}`} onClick={() => selectPage("Dashboard")} title={collapsed ? "Dashboard" : undefined}>
              <LayoutDashboard className="lp-crm-nav-icon" />
              {!collapsed && <span>Dashboard</span>}
            </button>

            {sections.map((section, sectionIndex) => (
              <div key={`nav-section-${sectionIndex}`}>
                <div className="lp-crm-nav-divider" />
                {!collapsed && <div className="lp-crm-nav-label">{section.label}</div>}
                {section.items.map(({ label, icon: Icon }, itemIndex) => (
                  <button type="button" key={`nav-item-${sectionIndex}-${itemIndex}`} className={`lp-crm-nav-link ${activePage === label ? "active" : ""}`} onClick={() => selectPage(label)} title={collapsed ? label : undefined}>
                    <Icon className="lp-crm-nav-icon" />
                    {!collapsed && <span>{label}</span>}
                  </button>
                ))}
              </div>
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

              <div ref={notificationRef} className="lp-crm-notification-wrap">
                <button type="button" className="lp-crm-icon-btn" onClick={() => setShowNotifications((value) => !value)} title="Notifications" aria-label="Notifications">
                  <Bell size={18} />
                  <span className="lp-crm-notification-dot" />
                </button>

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
              </div>

              <button type="button" className="lp-crm-profile" title="Profile" aria-label="Profile">
                <span className="lp-crm-avatar">BR</span>
              </button>
            </div>
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

  const greeting = currentHour >= 5 && currentHour < 12 ? "Hello" : currentHour >= 12 && currentHour < 17 ? "Hello" : currentHour >= 17 && currentHour < 21 ? "Hello" : "Hello";
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
              {quickActions.map(({ label, icon: Icon }, index) => (
                <button type="button" key={`quick-menu-${index}`} onClick={() => setShowActions(false)}>
                  <Icon size={15} />
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="lp-crm-stat-grid">
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <article className="lp-crm-stat" key={`dashboard-stat-${index}`}>
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
            {leadSources.map((source, index) => (
              <div className="lp-crm-source-row" key={`lead-source-${index}`}>
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
            {activities.map((activity, index) => {
              const Icon = activity.icon;

              return (
                <div className="lp-crm-list-item" key={`dashboard-activity-${index}`}>
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
            {tasks.map((task, index) => (
              <div className="lp-crm-task-item" key={`dashboard-task-${index}`}>
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
              {deals.map((deal, index) => (
                <tr key={`dashboard-deal-${index}`}>
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
            {teamPerformance.map((member, index) => (
              <div className="lp-crm-team-row" key={`team-member-${index}`}>
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
          {quickActions.map(({ label, icon: Icon }, index) => (
            <button type="button" className="lp-crm-quick-card" key={`quick-action-${index}`}>
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
  const pageData = {
    Leads: {
      icon: Target,
      subtitle: "Capture, qualify and manage every sales opportunity.",
      stats: [
        ["Total Leads", "342"],
        ["New Today", "28"],
        ["Qualified", "186"],
        ["Conversion", "68%"],
      ],
      columns: ["Lead", "Owner", "Source", "Status", "Last Activity"],
      rows: [
        ["Rohan Mehta", "Rahul Sharma", "Website", "New", "10 min ago"],
        ["Ananya Verma", "Priya Singh", "Google Ads", "Qualified", "42 min ago"],
        ["Karan Malhotra", "Amit Kumar", "Referral", "Contacted", "1 hr ago"],
        ["Sneha Kapoor", "Neha Singh", "Facebook", "New", "2 hrs ago"],
        ["Arjun Patel", "Vikas", "Website", "Converted", "Yesterday"],
        ["Meera Joshi", "Rahul Sharma", "Campaign", "Qualified", "Yesterday"],
      ],
    },
    Contacts: {
      icon: ContactRound,
      subtitle: "Keep customer contacts organized, searchable and actionable.",
      stats: [
        ["Total Contacts", "1,842"],
        ["New This Month", "126"],
        ["Active", "1,604"],
        ["Archived", "238"],
      ],
      columns: ["Contact", "Company", "Owner", "Status", "Last Activity"],
      rows: [
        ["Riya Sharma", "Acme Industries", "Rahul Sharma", "Active", "10 min ago"],
        ["Aditya Kumar", "Nova Technologies", "Priya Singh", "Active", "42 min ago"],
        ["Pooja Verma", "Vertex Solutions", "Amit Kumar", "Inactive", "1 hr ago"],
        ["Nikhil Singh", "Bluewave Retail", "Neha Singh", "Active", "2 hrs ago"],
        ["Kavita Rao", "Orion Enterprises", "Vikas", "Active", "Yesterday"],
        ["Aman Gupta", "Summit Group", "Rahul Sharma", "Active", "Yesterday"],
      ],
    },
    Companies: {
      icon: Building2,
      subtitle: "Manage organizations, accounts, owners and business relationships.",
      stats: [
        ["Companies", "486"],
        ["Active", "421"],
        ["New This Month", "32"],
        ["Prospects", "65"],
      ],
      columns: ["Company", "Industry", "Owner", "Status", "Updated"],
      rows: [
        ["Acme Industries", "Manufacturing", "Rahul Sharma", "Active", "Today"],
        ["Nova Technologies", "Technology", "Priya Singh", "Active", "2 hrs ago"],
        ["Vertex Solutions", "SaaS", "Amit Kumar", "Prospect", "5 hrs ago"],
        ["Bluewave Retail", "Retail", "Neha Singh", "Active", "Yesterday"],
        ["Orion Enterprises", "Consulting", "Vikas", "Active", "Yesterday"],
        ["Summit Group", "Finance", "Rahul Sharma", "Inactive", "2 days ago"],
      ],
    },
    Tags: {
      icon: Tag,
      subtitle: "Organize CRM records with reusable labels and customer segments.",
      stats: [
        ["Total Tags", "21"],
        ["Active", "20"],
        ["Used Records", "1,284"],
        ["Unused", "1"],
      ],
      columns: ["Tag", "Color", "Used On", "Records", "Status"],
      rows: [
        ["VIP Customer", "Purple", "Contacts", "186", "Active"],
        ["Hot Lead", "Red", "Leads", "94", "Active"],
        ["Follow Up", "Orange", "Leads", "132", "Active"],
        ["High Value", "Green", "Deals", "76", "Active"],
        ["Website", "Blue", "Leads", "210", "Active"],
        ["Support", "Slate", "Contacts", "58", "Active"],
      ],
    },
    Deals: {
      icon: CircleDollarSign,
      subtitle: "Track opportunities from first conversation to closed revenue.",
      stats: [
        ["Active Deals", "128"],
        ["Pipeline", "₹28.6L"],
        ["Won This Month", "₹8.4L"],
        ["Win Rate", "72%"],
      ],
      columns: ["Deal", "Owner", "Value", "Stage", "Probability"],
      rows: [
        ["Acme Industries", "Rahul Sharma", "₹4,80,000", "Proposal", "72%"],
        ["Nova Technologies", "Priya Singh", "₹3,25,000", "Negotiation", "84%"],
        ["Vertex Solutions", "Amit Kumar", "₹2,10,000", "Qualified", "56%"],
        ["Bluewave Retail", "Neha Singh", "₹1,85,000", "New", "32%"],
        ["Orion Enterprises", "Vikas", "₹1,42,000", "Proposal", "68%"],
        ["Summit Group", "Rahul Sharma", "₹96,000", "Won", "100%"],
      ],
    },
    Pipelines: {
      icon: GitBranch,
      subtitle: "Control sales pipelines, stages and opportunity movement.",
      stats: [
        ["Pipelines", "4"],
        ["Stages", "18"],
        ["Open Deals", "128"],
        ["Pipeline Value", "₹28.6L"],
      ],
      columns: ["Pipeline", "Owner", "Open Deals", "Value", "Status"],
      rows: [
        ["New Business", "Rahul Sharma", "42", "₹8.4L", "Active"],
        ["Enterprise Sales", "Priya Singh", "31", "₹7.1L", "Active"],
        ["Partner Sales", "Amit Kumar", "28", "₹6.8L", "Active"],
        ["Renewals", "Neha Singh", "19", "₹6.3L", "Active"],
        ["Inbound Sales", "Vikas", "8", "₹2.4L", "Active"],
        ["Archived Pipeline", "Rahul Sharma", "0", "₹0", "Archived"],
      ],
    },
    Tasks: {
      icon: CheckSquare,
      subtitle: "Plan follow-ups, deadlines and work across your sales team.",
      stats: [
        ["Open Tasks", "24"],
        ["Due Today", "8"],
        ["Completed", "76%"],
        ["Overdue", "3"],
      ],
      columns: ["Task", "Assignee", "Priority", "Status", "Due"],
      rows: [
        ["Call Premium Client", "Rahul Sharma", "High", "In Progress", "Today · 11:30 AM"],
        ["Review New Proposal", "Priya Singh", "Medium", "Pending", "Today · 2:00 PM"],
        ["Sales Team Meeting", "Amit Kumar", "Urgent", "Pending", "Today · 4:30 PM"],
        ["Update Lead Pipeline", "Neha Singh", "Low", "Completed", "Tomorrow"],
        ["Follow Up With Client", "Vikas", "High", "Pending", "Tomorrow"],
        ["Prepare Sales Report", "Rahul Sharma", "Medium", "Completed", "2 days ago"],
      ],
    },
    Activities: {
      icon: Activity,
      subtitle: "Track calls, meetings, emails and every customer touchpoint.",
      stats: [
        ["Activities", "684"],
        ["Calls", "218"],
        ["Meetings", "146"],
        ["Emails", "320"],
      ],
      columns: ["Activity", "Related To", "Owner", "Outcome", "Time"],
      rows: [
        ["Follow-up Call", "Rohan Mehta", "Rahul Sharma", "Completed", "10 min ago"],
        ["Proposal Sent", "Acme Industries", "Priya Singh", "Sent", "42 min ago"],
        ["Client Meeting", "Nova Technologies", "Amit Kumar", "Completed", "1 hr ago"],
        ["Lead Assignment", "Karan Malhotra", "Neha Singh", "Completed", "2 hrs ago"],
        ["Deal Negotiation", "Vertex Solutions", "Vikas", "In Progress", "3 hrs ago"],
        ["Account Review", "Orion Enterprises", "Rahul Sharma", "Completed", "Yesterday"],
      ],
    },
    Notes: {
      icon: FileText,
      subtitle: "Keep important customer, deal and team notes in one place.",
      stats: [
        ["Total Notes", "326"],
        ["Added Today", "18"],
        ["Pinned", "42"],
        ["Shared", "86"],
      ],
      columns: ["Note", "Related Record", "Created By", "Type", "Updated"],
      rows: [
        ["Pricing discussion", "Acme Industries", "Rahul Sharma", "Deal", "10 min ago"],
        ["Demo feedback", "Rohan Mehta", "Priya Singh", "Lead", "42 min ago"],
        ["Renewal terms", "Orion Enterprises", "Amit Kumar", "Company", "1 hr ago"],
        ["Support summary", "Riya Sharma", "Neha Singh", "Contact", "2 hrs ago"],
        ["Meeting minutes", "Nova Technologies", "Vikas", "Meeting", "Yesterday"],
        ["Campaign notes", "Website Leads", "Rahul Sharma", "Campaign", "Yesterday"],
      ],
    },
    Files: {
      icon: FolderOpen,
      subtitle: "Store and access documents connected to your CRM records.",
      stats: [
        ["Files", "1,284"],
        ["Uploaded Today", "34"],
        ["Shared", "186"],
        ["Storage", "68%"],
      ],
      columns: ["File", "Related To", "Uploaded By", "Size", "Updated"],
      rows: [
        ["Acme Proposal.pdf", "Acme Industries", "Rahul Sharma", "2.4 MB", "10 min ago"],
        ["Product Brochure.pdf", "Nova Technologies", "Priya Singh", "4.8 MB", "42 min ago"],
        ["Contract_v2.pdf", "Vertex Solutions", "Amit Kumar", "1.7 MB", "1 hr ago"],
        ["Pricing Sheet.xlsx", "Bluewave Retail", "Neha Singh", "920 KB", "2 hrs ago"],
        ["Meeting Notes.docx", "Orion Enterprises", "Vikas", "680 KB", "Yesterday"],
        ["Campaign Brief.pdf", "Website Campaign", "Rahul Sharma", "3.2 MB", "Yesterday"],
      ],
    },
    Meetings: {
      icon: CalendarDays,
      subtitle: "Schedule and track customer meetings, demos and reviews.",
      stats: [
        ["Meetings", "48"],
        ["Today", "6"],
        ["Upcoming", "24"],
        ["Completed", "18"],
      ],
      columns: ["Meeting", "Attendee", "Owner", "Status", "Schedule"],
      rows: [
        ["Sales Discovery", "Rohan Mehta", "Rahul Sharma", "Confirmed", "Today · 10:30 AM"],
        ["Product Demo", "Nova Technologies", "Priya Singh", "Confirmed", "Today · 1:00 PM"],
        ["Team Review", "Sales Team", "Amit Kumar", "Scheduled", "Today · 4:30 PM"],
        ["Proposal Review", "Acme Industries", "Neha Singh", "Confirmed", "Tomorrow · 11:00 AM"],
        ["Follow-up Meeting", "Orion Enterprises", "Vikas", "Scheduled", "Tomorrow · 3:00 PM"],
        ["Quarterly Review", "Summit Group", "Rahul Sharma", "Scheduled", "Fri · 2:00 PM"],
      ],
    },
    Calendar: {
      icon: CalendarDays,
      subtitle: "See meetings, tasks, events and deadlines in one calendar.",
      stats: [
        ["Today", "6"],
        ["This Week", "24"],
        ["Meetings", "14"],
        ["Events", "10"],
      ],
      columns: ["Event", "Calendar", "Owner", "Status", "Date"],
      rows: [
        ["Sales Meeting", "Sales Calendar", "Rahul Sharma", "Confirmed", "Today · 10:30 AM"],
        ["Client Demo", "Client Calendar", "Priya Singh", "Confirmed", "Today · 1:00 PM"],
        ["Team Review", "Team Calendar", "Amit Kumar", "Scheduled", "Tomorrow · 4:30 PM"],
        ["Proposal Meeting", "Sales Calendar", "Neha Singh", "Confirmed", "Tomorrow · 11:00 AM"],
        ["Follow-up Meeting", "Client Calendar", "Vikas", "Scheduled", "2 days ago"],
        ["Quarterly Review", "Management", "Rahul Sharma", "Scheduled", "3 days ago"],
      ],
    },
    Email: {
      icon: Mail,
      subtitle: "Send customer emails, track delivery and manage conversations.",
      stats: [
        ["Sent Today", "186"],
        ["Delivered", "98.4%"],
        ["Opened", "72%"],
        ["Replies", "38"],
      ],
      columns: ["Subject", "Recipient", "Sender", "Status", "Sent"],
      rows: [
        ["Proposal for Acme Industries", "Acme Industries", "Rahul Sharma", "Delivered", "10 min ago"],
        ["Product Demo Follow-up", "Nova Technologies", "Priya Singh", "Opened", "42 min ago"],
        ["Pricing Information", "Vertex Solutions", "Amit Kumar", "Replied", "1 hr ago"],
        ["Welcome to BR30 CRM", "Rohan Mehta", "Neha Singh", "Delivered", "2 hrs ago"],
        ["Renewal Reminder", "Orion Enterprises", "Vikas", "Opened", "Yesterday"],
        ["Campaign Update", "Website Leads", "Rahul Sharma", "Delivered", "Yesterday"],
      ],
    },
    WhatsApp: {
      icon: MessageCircle,
      subtitle: "Manage WhatsApp conversations and customer follow-ups.",
      stats: [
        ["Messages Today", "248"],
        ["Delivered", "96%"],
        ["Replies", "82"],
        ["Unread", "14"],
      ],
      columns: ["Conversation", "Contact", "Owner", "Status", "Last Message"],
      rows: [
        ["Acme Industries", "Rohan Mehta", "Rahul Sharma", "Active", "10 min ago"],
        ["Nova Technologies", "Priya Shah", "Priya Singh", "Replied", "42 min ago"],
        ["Vertex Solutions", "Karan Malhotra", "Amit Kumar", "Unread", "1 hr ago"],
        ["Bluewave Retail", "Sneha Kapoor", "Neha Singh", "Active", "2 hrs ago"],
        ["Orion Enterprises", "Kavita Rao", "Vikas", "Replied", "Yesterday"],
        ["Summit Group", "Aman Gupta", "Rahul Sharma", "Closed", "Yesterday"],
      ],
    },
    SMS: {
      icon: Smartphone,
      subtitle: "Send transactional and sales SMS with delivery tracking.",
      stats: [
        ["Sent Today", "412"],
        ["Delivered", "97.2%"],
        ["Replies", "64"],
        ["Failed", "9"],
      ],
      columns: ["Message", "Recipient", "Campaign", "Status", "Sent"],
      rows: [
        ["Your demo is confirmed", "Rohan Mehta", "Demo Follow-up", "Delivered", "10 min ago"],
        ["Proposal ready for review", "Kavita Rao", "Sales", "Delivered", "42 min ago"],
        ["Payment reminder", "Aman Gupta", "Billing", "Replied", "1 hr ago"],
        ["Meeting reminder", "Pooja Verma", "Meetings", "Delivered", "2 hrs ago"],
        ["Welcome message", "Nikhil Singh", "Onboarding", "Delivered", "Yesterday"],
        ["Follow-up reminder", "Arjun Patel", "Leads", "Failed", "Yesterday"],
      ],
    },
    "Communication History": {
      icon: FileText,
      subtitle: "Review the complete communication timeline across channels.",
      stats: [
        ["Interactions", "2,846"],
        ["Calls", "684"],
        ["Messages", "1,462"],
        ["Emails", "700"],
      ],
      columns: ["Channel", "Contact", "Owner", "Outcome", "Time"],
      rows: [
        ["Email", "Rohan Mehta", "Rahul Sharma", "Opened", "10 min ago"],
        ["WhatsApp", "Priya Shah", "Priya Singh", "Replied", "42 min ago"],
        ["Call", "Karan Malhotra", "Amit Kumar", "Completed", "1 hr ago"],
        ["SMS", "Sneha Kapoor", "Neha Singh", "Delivered", "2 hrs ago"],
        ["Meeting", "Kavita Rao", "Vikas", "Completed", "Yesterday"],
        ["Email", "Aman Gupta", "Rahul Sharma", "Replied", "Yesterday"],
      ],
    },
    Forms: {
      icon: FileText,
      subtitle: "Create lead capture forms and track incoming submissions.",
      stats: [
        ["Forms", "12"],
        ["Active", "9"],
        ["Submissions", "1,284"],
        ["Conversion", "14.8%"],
      ],
      columns: ["Form", "Submissions", "Conversion", "Status", "Updated"],
      rows: [
        ["Website Contact Form", "486", "18.4%", "Active", "Today"],
        ["Demo Request", "328", "21.7%", "Active", "Today"],
        ["Lead Capture", "214", "12.9%", "Active", "Yesterday"],
        ["Partner Inquiry", "96", "9.4%", "Active", "Yesterday"],
        ["Newsletter Signup", "142", "8.1%", "Active", "2 days ago"],
        ["Support Request", "18", "—", "Paused", "3 days ago"],
      ],
    },
    "Public Links": {
      icon: Link2,
      subtitle: "Share secure public forms and CRM entry links.",
      stats: [
        ["Links", "18"],
        ["Active", "14"],
        ["Clicks", "3,842"],
        ["Submissions", "684"],
      ],
      columns: ["Link", "Purpose", "Clicks", "Status", "Created"],
      rows: [
        ["/demo-request", "Demo Request", "1,284", "Active", "Today"],
        ["/contact-sales", "Contact Sales", "842", "Active", "Yesterday"],
        ["/lead-capture", "Lead Capture", "684", "Active", "Yesterday"],
        ["/partner", "Partner Inquiry", "418", "Active", "2 days ago"],
        ["/campaign-diwali", "Diwali Campaign", "386", "Active", "3 days ago"],
        ["/support", "Support Request", "228", "Paused", "4 days ago"],
      ],
    },
    QR: {
      icon: QrCode,
      subtitle: "Create trackable QR codes for campaigns and offline lead capture.",
      stats: [
        ["QR Codes", "16"],
        ["Active", "12"],
        ["Scans", "4,286"],
        ["Leads", "386"],
      ],
      columns: ["QR Code", "Campaign", "Scans", "Leads", "Status"],
      rows: [
        ["BR30 Brochure", "Offline Sales", "1,284", "142", "Active"],
        ["Diwali Offer", "Diwali Campaign", "986", "96", "Active"],
        ["Store Visit", "Retail", "742", "64", "Active"],
        ["Product Demo", "Demo Campaign", "518", "48", "Active"],
        ["Partner Meet", "Partner", "426", "24", "Active"],
        ["Feedback QR", "Customer Feedback", "330", "12", "Paused"],
      ],
    },
    "Sources / Campaigns": {
      icon: Globe,
      subtitle: "Track lead sources, campaigns and marketing attribution.",
      stats: [
        ["Sources", "21"],
        ["Campaigns", "14"],
        ["Leads", "1,284"],
        ["Attributed", "86%"],
      ],
      columns: ["Source / Campaign", "Leads", "Conversion", "Spend", "Status"],
      rows: [
        ["Website", "342", "18.6%", "₹24,000", "Active"],
        ["Google Ads", "286", "14.2%", "₹48,000", "Active"],
        ["Facebook", "218", "11.8%", "₹31,500", "Active"],
        ["Referral", "186", "24.7%", "₹0", "Active"],
        ["Diwali Campaign", "142", "19.4%", "₹18,000", "Active"],
        ["WhatsApp", "110", "22.1%", "₹4,500", "Active"],
      ],
    },
    Automations: {
      icon: Workflow,
      subtitle: "Automate CRM actions when records or business events change.",
      stats: [
        ["Automations", "18"],
        ["Active", "14"],
        ["Runs Today", "486"],
        ["Success", "98.6%"],
      ],
      columns: ["Automation", "Trigger", "Action", "Status", "Last Run"],
      rows: [
        ["New Lead Assignment", "Lead Created", "Assign to Sales", "Active", "10 min ago"],
        ["Hot Lead Alert", "Lead Score > 80", "Notify Owner", "Active", "42 min ago"],
        ["Deal Follow-up", "Stage Changed", "Create Task", "Active", "1 hr ago"],
        ["Customer Welcome", "Deal Won", "Send Email", "Active", "2 hrs ago"],
        ["Overdue Task Alert", "Task Overdue", "Notify Manager", "Active", "Yesterday"],
        ["Inactive Lead", "7 Days No Activity", "Create Task", "Paused", "2 days ago"],
      ],
    },
    Workflows: {
      icon: Network,
      subtitle: "Build repeatable multi-step processes for your sales team.",
      stats: [
        ["Workflows", "9"],
        ["Active", "7"],
        ["Executions", "1,284"],
        ["Success", "97.8%"],
      ],
      columns: ["Workflow", "Entity", "Steps", "Status", "Last Run"],
      rows: [
        ["Lead Qualification", "Lead", "5", "Active", "10 min ago"],
        ["New Customer Onboarding", "Contact", "8", "Active", "42 min ago"],
        ["Deal Approval", "Deal", "6", "Active", "1 hr ago"],
        ["Renewal Process", "Company", "7", "Active", "2 hrs ago"],
        ["Sales Follow-up", "Lead", "4", "Active", "Yesterday"],
        ["Support Escalation", "Contact", "5", "Paused", "2 days ago"],
      ],
    },
    Webhooks: {
      icon: Link2,
      subtitle: "Connect BR30 CRM with external systems and event endpoints.",
      stats: [
        ["Webhooks", "14"],
        ["Active", "11"],
        ["Deliveries Today", "2,846"],
        ["Success", "99.1%"],
      ],
      columns: ["Endpoint", "Event", "Deliveries", "Status", "Last Delivery"],
      rows: [
        ["Sales Platform", "lead.created", "684", "Active", "10 min ago"],
        ["ERP Integration", "deal.updated", "486", "Active", "42 min ago"],
        ["Marketing Sync", "contact.created", "328", "Active", "1 hr ago"],
        ["Support System", "ticket.created", "218", "Active", "2 hrs ago"],
        ["Billing System", "deal.won", "142", "Active", "Yesterday"],
        ["Analytics", "activity.created", "96", "Paused", "2 days ago"],
      ],
    },
    Sales: {
      icon: BarChart3,
      subtitle: "Monitor revenue, sales performance and pipeline movement.",
      stats: [
        ["Revenue", "₹12.48L"],
        ["Won Deals", "42"],
        ["Win Rate", "72%"],
        ["Growth", "+18.6%"],
      ],
      columns: ["Metric", "Current", "Previous", "Change", "Trend"],
      rows: [
        ["Revenue", "₹12.48L", "₹10.52L", "+18.6%", "Up"],
        ["Won Deals", "42", "36", "+16.7%", "Up"],
        ["Average Deal", "₹2.14L", "₹1.88L", "+13.8%", "Up"],
        ["Win Rate", "72%", "67%", "+5.0%", "Up"],
        ["Sales Cycle", "18 days", "21 days", "-14.3%", "Improved"],
        ["Forecast", "₹16.8L", "₹14.2L", "+18.3%", "Up"],
      ],
    },
    Leads: {
      icon: Target,
      subtitle: "Measure lead volume, qualification and conversion performance.",
      stats: [
        ["New Leads", "342"],
        ["Qualified", "186"],
        ["Conversion", "68%"],
        ["Cost / Lead", "₹184"],
      ],
      columns: ["Source", "Leads", "Qualified", "Converted", "Conversion"],
      rows: [
        ["Website", "130", "82", "44", "33.8%"],
        ["Google Ads", "92", "48", "18", "19.6%"],
        ["Referral", "65", "42", "26", "40.0%"],
        ["Facebook", "32", "8", "4", "12.5%"],
        ["WhatsApp", "15", "6", "3", "20.0%"],
        ["Campaigns", "8", "0", "0", "0%"],
      ],
    },
    Deals: {
      icon: CircleDollarSign,
      subtitle: "Analyze deal stages, values, wins and sales forecasting.",
      stats: [
        ["Open Deals", "128"],
        ["Pipeline", "₹28.6L"],
        ["Won", "₹8.4L"],
        ["Forecast", "₹16.8L"],
      ],
      columns: ["Stage", "Deals", "Value", "Win Rate", "Movement"],
      rows: [
        ["New", "42", "₹8.4L", "32%", "+12%"],
        ["Qualified", "31", "₹6.8L", "56%", "+8%"],
        ["Proposal", "28", "₹7.1L", "72%", "+14%"],
        ["Negotiation", "19", "₹6.3L", "84%", "+18%"],
        ["Won", "42", "₹8.4L", "100%", "+16%"],
        ["Lost", "12", "₹2.1L", "0%", "-4%"],
      ],
    },
    Activity: {
      icon: Activity,
      subtitle: "Measure team activity, customer engagement and follow-up health.",
      stats: [
        ["Activities", "684"],
        ["Completed", "612"],
        ["Overdue", "18"],
        ["Completion", "89%"],
      ],
      columns: ["Activity Type", "Count", "Completed", "Pending", "Rate"],
      rows: [
        ["Calls", "218", "202", "16", "92.7%"],
        ["Meetings", "146", "136", "10", "93.2%"],
        ["Emails", "320", "274", "46", "85.6%"],
        ["Tasks", "184", "164", "20", "89.1%"],
        ["Notes", "126", "118", "8", "93.7%"],
        ["Follow-ups", "96", "82", "14", "85.4%"],
      ],
    },
    Team: {
      icon: UsersRound,
      subtitle: "See team performance, workload and sales ownership.",
      stats: [
        ["Team Members", "24"],
        ["Active", "21"],
        ["Top Performer", "Rahul"],
        ["Deals Closed", "87"],
      ],
      columns: ["Member", "Department", "Open Tasks", "Deals", "Performance"],
      rows: [
        ["Rahul Sharma", "Sales", "8", "28", "94%"],
        ["Priya Singh", "Sales", "6", "24", "91%"],
        ["Amit Kumar", "Business", "7", "19", "87%"],
        ["Neha Singh", "Sales", "5", "16", "84%"],
        ["Vikas", "Management", "3", "12", "82%"],
        ["Karan Mehta", "Support", "9", "8", "76%"],
      ],
    },
    Members: {
      icon: UsersRound,
      subtitle: "Manage business members, roles, access and team assignments.",
      stats: [
        ["Members", "24"],
        ["Active", "21"],
        ["Pending", "2"],
        ["Suspended", "1"],
      ],
      columns: ["Member", "Email", "Role", "Status", "Last Active"],
      rows: [
        ["Rahul Sharma", "rahul@br30crm.com", "Sales Manager", "Active", "Now"],
        ["Priya Singh", "priya@br30crm.com", "Sales Executive", "Active", "10 min ago"],
        ["Amit Kumar", "amit@br30crm.com", "Business", "Active", "42 min ago"],
        ["Neha Singh", "neha@br30crm.com", "Sales Executive", "Active", "1 hr ago"],
        ["Vikas", "vikas@br30crm.com", "Admin", "Active", "2 hrs ago"],
        ["Karan Mehta", "karan@br30crm.com", "Support", "Pending", "Yesterday"],
      ],
    },
    Roles: {
      icon: ShieldCheck,
      subtitle: "Define business roles and control access across CRM modules.",
      stats: [
        ["Roles", "8"],
        ["Active", "7"],
        ["Members Assigned", "24"],
        ["Custom", "5"],
      ],
      columns: ["Role", "Members", "Permissions", "Status", "Updated"],
      rows: [
        ["Administrator", "2", "All Access", "Active", "Today"],
        ["Sales Manager", "4", "42 permissions", "Active", "Today"],
        ["Sales Executive", "9", "31 permissions", "Active", "Yesterday"],
        ["Support", "3", "18 permissions", "Active", "Yesterday"],
        ["Business", "5", "24 permissions", "Active", "2 days ago"],
        ["Viewer", "1", "12 permissions", "Active", "3 days ago"],
      ],
    },
    Permissions: {
      icon: ShieldCheck,
      subtitle: "Review granular access controls for CRM resources and actions.",
      stats: [
        ["Permissions", "84"],
        ["Granted", "76"],
        ["Restricted", "8"],
        ["Roles", "8"],
      ],
      columns: ["Module", "View", "Create", "Edit", "Delete"],
      rows: [
        ["Leads", "Allowed", "Allowed", "Allowed", "Restricted"],
        ["Contacts", "Allowed", "Allowed", "Allowed", "Restricted"],
        ["Companies", "Allowed", "Allowed", "Allowed", "Restricted"],
        ["Deals", "Allowed", "Allowed", "Allowed", "Restricted"],
        ["Tasks", "Allowed", "Allowed", "Allowed", "Allowed"],
        ["Reports", "Allowed", "Restricted", "Restricted", "Restricted"],
      ],
    },
    Notifications: {
      icon: BellRing,
      subtitle: "Stay on top of assignments, reminders, alerts and CRM events.",
      stats: [
        ["Unread", "8"],
        ["Today", "14"],
        ["Mentions", "5"],
        ["Alerts", "3"],
      ],
      columns: ["Notification", "Source", "Type", "Status", "Time"],
      rows: [
        ["New Lead Assigned", "Rahul Sharma", "Assignment", "Unread", "10 min ago"],
        ["Proposal Updated", "Priya Singh", "Deal", "Read", "42 min ago"],
        ["Meeting Reminder", "Amit Kumar", "Reminder", "Unread", "1 hr ago"],
        ["Deal Stage Changed", "Neha Singh", "Deal", "Read", "2 hrs ago"],
        ["New Comment Received", "Vikas", "Comment", "Unread", "Yesterday"],
        ["Task Completed", "Rahul Sharma", "Task", "Read", "Yesterday"],
      ],
    },
    "Audit Logs": {
      icon: ShieldCheck,
      subtitle: "Review workspace actions, security events and change history.",
      stats: [
        ["Events", "2,846"],
        ["Today", "126"],
        ["Users", "24"],
        ["Alerts", "3"],
      ],
      columns: ["Action", "Actor", "Module", "Result", "Time"],
      rows: [
        ["Login", "Rahul Sharma", "Authentication", "Success", "10 min ago"],
        ["Deal Updated", "Priya Singh", "Deals", "Success", "42 min ago"],
        ["Lead Created", "Amit Kumar", "Leads", "Success", "1 hr ago"],
        ["Contact Updated", "Neha Singh", "Contacts", "Success", "2 hrs ago"],
        ["Settings Changed", "Vikas", "Settings", "Success", "Yesterday"],
        ["Role Updated", "Rahul Sharma", "Team", "Success", "Yesterday"],
      ],
    },
    "CRM Tools": {
      icon: Wrench,
      subtitle: "Manage security, data operations, attribution and workspace utilities.",
      stats: [
        ["API Keys", "6"],
        ["Imports", "28"],
        ["Sessions", "24"],
        ["Tools Active", "9"],
      ],
      columns: ["Tool", "Operation", "Records", "Status", "Last Run"],
      rows: [
        ["API Keys", "Credential Management", "6", "Active", "Today"],
        ["Import / Export", "CSV Import", "1,284", "Completed", "10 min ago"],
        ["Duplicates", "Duplicate Scan", "42", "Resolved", "42 min ago"],
        ["Lead Attribution", "Attribution Sync", "684", "Active", "1 hr ago"],
        ["Sessions", "Session Review", "24", "Healthy", "2 hrs ago"],
        ["Social Leads", "Webhook Intake", "186", "Active", "Yesterday"],
      ],
    },
    Analytics: {
      icon: BarChart3,
      subtitle: "Explore business performance, trends and CRM conversion metrics.",
      stats: [
        ["Revenue", "₹12.48L"],
        ["Leads", "342"],
        ["Conversion", "68%"],
        ["Growth", "+18.6%"],
      ],
      columns: ["Metric", "Current", "Previous", "Change", "Status"],
      rows: [
        ["Revenue", "₹12.48L", "₹10.52L", "+18.6%", "Growing"],
        ["Leads", "342", "274", "+24.8%", "Growing"],
        ["Contacts", "1,842", "1,704", "+8.1%", "Growing"],
        ["Deals", "128", "114", "+12.3%", "Growing"],
        ["Activities", "684", "612", "+11.8%", "Healthy"],
        ["Conversion", "68%", "63%", "+5.0%", "Improved"],
      ],
    },
    Integrations: {
      icon: Network,
      subtitle: "Connect external platforms and keep your CRM data synchronized.",
      stats: [
        ["Integrations", "8"],
        ["Connected", "6"],
        ["Errors", "1"],
        ["Available", "18"],
      ],
      columns: ["Integration", "Category", "Status", "Last Sync", "Records"],
      rows: [
        ["Paytm", "Payments", "Connected", "10 min ago", "684"],
        ["Email Provider", "Communication", "Connected", "42 min ago", "1,284"],
        ["WhatsApp", "Communication", "Connected", "1 hr ago", "842"],
        ["Google Calendar", "Calendar", "Connected", "2 hrs ago", "146"],
        ["Webhooks", "Developer", "Connected", "Yesterday", "2,846"],
        ["Social Leads", "Marketing", "Error", "Yesterday", "186"],
      ],
    },
    Subscription: {
      icon: CreditCard,
      subtitle: "Monitor your CRM plan, usage, billing and workspace limits.",
      stats: [
        ["Plan", "Business"],
        ["Members", "24 / 50"],
        ["Storage", "68%"],
        ["Renewal", "18 Nov"],
      ],
      columns: ["Resource", "Used", "Limit", "Usage", "Status"],
      rows: [
        ["Members", "24", "50", "48%", "Healthy"],
        ["Contacts", "1,842", "10,000", "18%", "Healthy"],
        ["Leads", "342", "5,000", "7%", "Healthy"],
        ["Storage", "6.8 GB", "10 GB", "68%", "Healthy"],
        ["API Requests", "42K", "100K", "42%", "Healthy"],
        ["Automations", "14", "25", "56%", "Healthy"],
      ],
    },
    Settings: {
      icon: Settings,
      subtitle: "Manage workspace preferences, security and configuration.",
      stats: [
        ["Workspace", "Active"],
        ["Members", "24"],
        ["Integrations", "8"],
        ["Security", "Good"],
      ],
      columns: ["Setting", "Area", "Owner", "Status", "Updated"],
      rows: [
        ["Workspace Profile", "Workspace", "Admin", "Active", "Today"],
        ["Team Preferences", "Team", "Rahul Sharma", "Active", "Yesterday"],
        ["Notification Settings", "Notifications", "Priya Singh", "Active", "Yesterday"],
        ["Security Settings", "Security", "Amit Kumar", "Good", "2 days ago"],
        ["Integrations", "Connections", "Neha Singh", "Connected", "2 days ago"],
        ["Billing Settings", "Subscription", "Vikas", "Active", "3 days ago"],
      ],
    },
  };

  const config = pageData[page] || {
    icon: LayoutDashboard,
    subtitle: `Manage ${page.toLowerCase()} in your CRM workspace.`,
    stats: [
      ["Records", "126"],
      ["Active", "98"],
      ["Today", "18"],
      ["Status", "Healthy"],
    ],
    columns: ["Name", "Owner", "Status", "Activity", "Updated"],
    rows: [
      [`${page} Record 01`, "Rahul Sharma", "Active", "Updated", "Today"],
      [`${page} Record 02`, "Priya Singh", "Active", "Created", "Today"],
      [`${page} Record 03`, "Amit Kumar", "Pending", "Reviewed", "Yesterday"],
      [`${page} Record 04`, "Neha Singh", "Active", "Updated", "Yesterday"],
      [`${page} Record 05`, "Vikas", "Completed", "Reviewed", "2 days ago"],
      [`${page} Record 06`, "Rahul Sharma", "Active", "Updated", "3 days ago"],
    ],
  };

  const Icon = config.icon;
  const actionLabel = ["Reports", "Sales", "Leads", "Deals", "Activity"].includes(page) ? "View report" : "View";

  return (
    <section className="lp-crm-page">
      <div className="lp-crm-page-head">
        <div className="lp-crm-page-heading-wrap">
          <div>
            <h2 className="lp-crm-page-title">{page}</h2>
            <p className="lp-crm-page-subtitle">{config.subtitle}</p>
          </div>
        </div>

        <div className="lp-crm-page-actions">
          <button type="button" className="lp-crm-page-btn">
            <RefreshCw size={13} /> Refresh
          </button>
          <button type="button" className="lp-crm-page-btn primary">
            <Plus size={13} /> {page === "Analytics" || page === "CRM Tools" ? "Open tools" : `Add ${page === "Sources / Campaigns" ? "Source" : page.slice(0, -1) || "Record"}`}
          </button>
        </div>
      </div>

      <div className="lp-crm-page-stat-grid">
        {config.stats.map(([label, value], index) => (
          <div className="lp-crm-page-stat" key={`page-stat-${index}`}>
            <div className="lp-crm-page-stat-label">{label}</div>
            <div className="lp-crm-page-stat-value">{value}</div>
          </div>
        ))}
      </div>

      <div className="lp-crm-page-grid">
        <section className="lp-crm-page-card lp-crm-page-table-card">
          <div className="lp-crm-panel-head">
            <div>
              <div className="lp-crm-panel-title">Recent {page} records</div>
              <div className="lp-crm-panel-subtitle">Sample workspace data for demonstration</div>
            </div>
            <button type="button" className="lp-crm-panel-link">
              <Filter size={13} /> Filter
            </button>
          </div>

          <div className="lp-crm-table-wrap">
            <table className="lp-crm-table">
              <thead>
                <tr>
                  {config.columns.map((column) => (
                    <th key={column}>{column}</th>
                  ))}
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {config.rows.map((row, index) => (
                  <tr key={`${page}-${index}`}>
                    {row.map((cell, cellIndex) => (
                      <td key={`${page}-${index}-${cellIndex}`}>{cellIndex === row.length - 1 ? <span className="lp-crm-muted">{cell}</span> : cellIndex === 0 ? <strong>{cell}</strong> : cell}</td>
                    ))}
                    <td>
                      <div style={{ display: "flex", gap: 5 }}>
                        <button type="button" className="lp-crm-icon-btn" title={actionLabel}>
                          <Eye size={13} />
                        </button>
                        <button type="button" className="lp-crm-icon-btn" title="More actions">
                          <MoreHorizontal size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="lp-crm-page-footer">
            <span>Showing 1–6 of {config.stats[0]?.[1] || "126"} records</span>
            <div className="lp-crm-page-pagination">
              <button type="button" className="lp-crm-page-btn">
                <ChevronLeft size={13} />
              </button>
              <button type="button" className="lp-crm-page-btn">
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        </section>

        <aside className="lp-crm-page-side">
          <section className="lp-crm-page-card">
            <div className="lp-crm-panel-head">
              <div>
                <div className="lp-crm-panel-title">Workspace snapshot</div>
                <div className="lp-crm-panel-subtitle">Current {page.toLowerCase()} health</div>
              </div>
              <TrendingUp size={16} color="var(--preview-muted)" />
            </div>

            <div className="lp-crm-pipeline-body">
              {[
                ["Processed", "86%", 86, ""],
                ["Completed", "74%", 74, "green"],
                ["On target", "91%", 91, "orange"],
              ].map(([label, value, width, tone]) => (
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
          </section>

          <section className="lp-crm-page-card">
            <div className="lp-crm-panel-head">
              <div>
                <div className="lp-crm-panel-title">Recent activity</div>
                <div className="lp-crm-panel-subtitle">Latest changes in this module</div>
              </div>
              <Activity size={16} color="var(--preview-muted)" />
            </div>

            <div className="lp-crm-list">
              {config.rows.slice(0, 4).map((row, index) => (
                <div className="lp-crm-list-item" key={`activity-${index}`}>
                  <div className="lp-crm-activity-icon primary">
                    <Activity size={13} />
                  </div>
                  <div className="lp-crm-list-main">
                    <div className="lp-crm-list-title">{row[0]}</div>
                    <div className="lp-crm-list-meta">
                      {row[1]} · {row[row.length - 1]}
                    </div>
                  </div>
                  <ChevronRight className="lp-crm-list-arrow" size={14} />
                </div>
              ))}
            </div>
          </section>

          <section className="lp-crm-page-card">
            <div className="lp-crm-panel-head">
              <div>
                <div className="lp-crm-panel-title">Quick actions</div>
                <div className="lp-crm-panel-subtitle">Common {page.toLowerCase()} actions</div>
              </div>
              <Plus size={16} color="var(--preview-muted)" />
            </div>

            <div className="lp-crm-quick-grid">
              <button type="button" className="lp-crm-quick-card">
                <span className="lp-crm-quick-icon">
                  <Plus size={15} />
                </span>
                <span className="lp-crm-quick-label">Create new</span>
              </button>
              <button type="button" className="lp-crm-quick-card">
                <span className="lp-crm-quick-icon">
                  <Filter size={15} />
                </span>
                <span className="lp-crm-quick-label">Filter records</span>
              </button>
              <button type="button" className="lp-crm-quick-card">
                <span className="lp-crm-quick-icon">
                  <ArrowUpRight size={15} />
                </span>
                <span className="lp-crm-quick-label">Export</span>
              </button>
              <button type="button" className="lp-crm-quick-card">
                <span className="lp-crm-quick-icon">
                  <MoreHorizontal size={15} />
                </span>
                <span className="lp-crm-quick-label">More actions</span>
              </button>
            </div>
          </section>
        </aside>
      </div>

      <div className="lp-crm-footer-note">
        <Clock3 size={11} />
        This CRM preview uses realistic sample data. No live workspace data is connected.
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
