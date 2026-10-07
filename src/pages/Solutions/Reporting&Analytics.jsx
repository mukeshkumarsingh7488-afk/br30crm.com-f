import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUp, BarChart3, CheckCircle2, ChevronRight, Database, FileText, Mail, PieChart, ShieldCheck, TrendingUp, UserCheck } from "lucide-react";
import LandingNavbar from "../../components/landing/LandingNavbar";
import LandingFooter from "../../components/landing/LandingFooter";

function ReportingAnalytics() {
  const [activeSection, setActiveSection] = useState("introduction");

  const sections = [
    { id: "introduction", number: "01", title: "Introduction" },
    { id: "reporting-overview", number: "02", title: "Reporting Overview" },
    { id: "dashboard-insights", number: "03", title: "Dashboard Insights" },
    { id: "sales-reports", number: "04", title: "Sales Reports" },
    { id: "lead-reports", number: "05", title: "Lead Reports" },
    { id: "customer-reports", number: "06", title: "Customer Reports" },
    { id: "pipeline-analytics", number: "07", title: "Pipeline Analytics" },
    { id: "team-performance", number: "08", title: "Team Performance" },
    { id: "activity-analytics", number: "09", title: "Activity Analytics" },
    { id: "financial-insights", number: "10", title: "Financial Insights" },
    { id: "filters-segmentation", number: "11", title: "Filters & Segmentation" },
    { id: "data-accuracy", number: "12", title: "Data Accuracy" },
    { id: "exports", number: "13", title: "Reports & Exports" },
    { id: "permissions", number: "14", title: "Access & Permissions" },
    { id: "best-practices", number: "15", title: "Best Practices" },
    { id: "contact", number: "16", title: "Contact Us" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const offset = 150;
      let current = "introduction";

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (!element) continue;

        if (element.getBoundingClientRect().top <= offset) {
          current = section.id;
        }
      }

      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (!element) return;

    const top = element.getBoundingClientRect().top + window.scrollY - 105;

    window.scrollTo({
      top,
      behavior: "smooth",
    });

    setActiveSection(id);
  };

  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="br30-legal-page">
      <style>{`.br30-legal-page{min-height:100vh;background:var(--crm-bg);color:var(--crm-text);font-family:var(--crm-font)}.br30-legal-page *,.br30-legal-page *::before,.br30-legal-page *::after{box-sizing:border-box}.br30-legal-hero{padding:142px 24px 58px;border-bottom:1px solid var(--crm-border);background:var(--crm-bg)}.br30-legal-hero-inner{width:100%;max-width:1120px;margin:0 auto}.br30-legal-breadcrumb{display:flex;align-items:center;gap:6px;margin-bottom:24px;color:var(--crm-muted);font-size:13px}.br30-legal-breadcrumb a{color:var(--crm-muted);text-decoration:none}.br30-legal-breadcrumb a:hover{color:var(--crm-primary)}.br30-legal-breadcrumb svg{opacity:.5}.br30-legal-eyebrow{display:inline-flex;align-items:center;gap:7px;color:var(--crm-primary);font-size:13px;font-weight:400;letter-spacing:.08em;text-transform:uppercase}.br30-legal-eyebrow-dot{width:6px;height:6px;border-radius:50%;background:var(--crm-primary)}.br30-legal-hero h1{margin:16px 0 14px;color:var(--crm-text);font-size:clamp(32px,4vw,48px);line-height:1.12;letter-spacing:-.025em;font-weight:400}.br30-legal-hero h1 span{color:var(--crm-primary)}.br30-legal-hero-description{max-width:760px;margin:0;color:var(--crm-muted);font-size:14px;line-height:1.75}.br30-legal-meta{display:flex;flex-wrap:wrap;gap:8px;margin-top:25px}.br30-legal-meta-item{display:flex;align-items:center;gap:7px;min-height:35px;padding:7px 11px;border:1px solid var(--crm-border);border-radius:9px;background:var(--crm-surface);color:var(--crm-muted);font-size:13px}.br30-legal-meta-item svg{color:var(--crm-primary)}.br30-legal-meta-item strong{color:var(--crm-text);font-weight:400}.br30-legal-main{width:100%;max-width:1120px;margin:0 auto;padding:52px 24px 80px;display:grid;grid-template-columns:235px minmax(0,1fr);gap:50px;align-items:start}.br30-legal-sidebar{position:sticky;top:100px;max-height:calc(100vh - 120px);overflow:auto;padding:7px;border:1px solid var(--crm-border);border-radius:13px;background:var(--crm-surface);box-shadow:var(--crm-shadow);scrollbar-width:thin}.br30-legal-sidebar-title{padding:9px 10px 11px;color:var(--crm-text);font-size:13px;font-weight:400;letter-spacing:.06em;text-transform:uppercase}.br30-legal-sidebar-list{display:flex;flex-direction:column;gap:1px}.br30-legal-sidebar button{width:100%;display:flex;align-items:center;gap:8px;padding:8px 9px;border:0;border-radius:8px;background:transparent;color:var(--crm-muted);font:inherit;font-size:13px;line-height:1.35;text-align:left;cursor:pointer}.br30-legal-sidebar button:hover{background:var(--crm-surface-2);color:var(--crm-text)}.br30-legal-sidebar button.active{background:var(--crm-primary-soft);color:var(--crm-primary);font-weight:400}.br30-legal-sidebar-number{width:22px;flex:0 0 22px;font-size:13px;font-weight:400;opacity:.7}.br30-legal-content{min-width:0}.br30-legal-intro-card{margin-bottom:34px;padding:21px;border:1px solid var(--crm-border);border-radius:13px;background:var(--crm-surface);box-shadow:var(--crm-shadow)}.br30-legal-intro-card-top{display:flex;align-items:flex-start;gap:13px}.br30-legal-intro-icon{width:38px;height:38px;flex:0 0 38px;display:grid;place-items:center;border-radius:9px;background:var(--crm-primary-soft);border:1px solid var(--crm-border);color:var(--crm-primary)}.br30-legal-intro-card h2{margin:0 0 5px;color:var(--crm-text);font-size:15px;font-weight:400;line-height:1.4}.br30-legal-intro-card p{margin:0;color:var(--crm-muted);font-size:13px;line-height:1.75}.br30-legal-section{scroll-margin-top:110px;padding:0 0 38px;margin-bottom:38px;border-bottom:1px solid var(--crm-border)}.br30-legal-section:last-child{border-bottom:0;margin-bottom:0}.br30-legal-section-label{display:flex;align-items:center;gap:8px;margin-bottom:10px;color:var(--crm-primary);font-size:13px;font-weight:400;letter-spacing:.08em;text-transform:uppercase}.br30-legal-section-label span{opacity:.65}.br30-legal-section h2{margin:0 0 14px;color:var(--crm-text);font-size:20px;line-height:1.35;font-weight:400;letter-spacing:-.01em}.br30-legal-section h3{margin:22px 0 8px;color:var(--crm-text);font-size:14px;line-height:1.45;font-weight:400}.br30-legal-section p{margin:0 0 13px;color:var(--crm-muted);font-size:13px;line-height:1.85}.br30-legal-section p:last-child{margin-bottom:0}.br30-legal-section ul{margin:10px 0 17px;padding-left:20px}.br30-legal-section li{margin:7px 0;padding-left:2px;color:var(--crm-muted);font-size:13px;line-height:1.75}.br30-legal-section li::marker{color:var(--crm-primary)}.br30-legal-note{margin:18px 0;padding:14px 16px;border-left:3px solid var(--crm-primary);border-radius:0 9px 9px 0;background:var(--crm-surface-2);color:var(--crm-muted);font-size:13px;line-height:1.75}.br30-legal-note strong{color:var(--crm-text)}.br30-legal-contact-card{display:grid;grid-template-columns:auto 1fr;gap:12px;margin-top:18px;padding:17px;border:1px solid var(--crm-border);border-radius:11px;background:var(--crm-surface)}.br30-legal-contact-icon{width:36px;height:36px;display:grid;place-items:center;border-radius:9px;background:var(--crm-primary-soft);color:var(--crm-primary)}.br30-legal-contact-card strong{display:block;margin-bottom:4px;color:var(--crm-text);font-size:13px}.br30-legal-contact-card a{color:var(--crm-primary);font-size:13px;text-decoration:none}.br30-legal-contact-card a:hover{text-decoration:underline}.br30-legal-contact-card p{margin:0!important}.br30-legal-top-button{position:fixed;right:20px;bottom:20px;z-index:30;width:38px;height:38px;display:grid;place-items:center;border:1px solid var(--crm-border);border-radius:10px;background:var(--crm-surface);color:var(--crm-text);box-shadow:var(--crm-shadow);cursor:pointer;transition:.2s}.br30-legal-top-button:hover{border-color:var(--crm-primary);color:var(--crm-primary);transform:translateY(-2px)}@media(max-width:900px){.br30-legal-main{grid-template-columns:1fr;gap:25px}.br30-legal-sidebar{position:relative;top:auto;max-height:none}.br30-legal-sidebar-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:600px){.br30-legal-hero{padding:120px 17px 45px}.br30-legal-hero h1{font-size:34px}.br30-legal-hero-description{font-size:13px}.br30-legal-meta{display:grid;grid-template-columns:1fr}.br30-legal-main{padding:35px 17px 60px}.br30-legal-sidebar-list{grid-template-columns:1fr}.br30-legal-intro-card{padding:18px}.br30-legal-section{scroll-margin-top:90px;padding-bottom:32px;margin-bottom:32px}.br30-legal-section h2{font-size:18px}.br30-legal-section p,.br30-legal-section li{font-size:13px}.br30-legal-contact-card{grid-template-columns:1fr}.br30-legal-top-button{right:13px;bottom:13px}}`}</style>

      <LandingNavbar />

      <header className="br30-legal-hero">
        <div className="br30-legal-hero-inner">
          <div className="br30-legal-breadcrumb">
            <Link to="/">Home</Link>
            <ChevronRight size={13} />
            <span>Solutions</span>
            <ChevronRight size={13} />
            <span>Reporting & Analytics</span>
          </div>

          <div className="br30-legal-eyebrow">
            <span className="br30-legal-eyebrow-dot" />
            BR30 CRM Reporting
          </div>

          <h1>
            Reporting <span>& Analytics</span>
          </h1>

          <p className="br30-legal-hero-description">
            Turn everyday CRM activity into clear business intelligence. BR30 CRM Reporting & Analytics helps teams understand sales performance, customer activity, pipeline movement, lead conversion, team productivity, and operational trends through structured reports and actionable insights.
          </p>

          <div className="br30-legal-meta">
            <div className="br30-legal-meta-item">
              <BarChart3 size={14} />
              <span>
                Reporting <strong>Business Intelligence</strong>
              </span>
            </div>

            <div className="br30-legal-meta-item">
              <TrendingUp size={14} />
              <span>
                Focus <strong>Performance & Growth</strong>
              </span>
            </div>

            <div className="br30-legal-meta-item">
              <FileText size={14} />
              <span>
                Version <strong>1.0</strong>
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="br30-legal-main">
        <aside className="br30-legal-sidebar">
          <div className="br30-legal-sidebar-title">On this page</div>

          <div className="br30-legal-sidebar-list">
            {sections.map((section) => (
              <button key={section.id} type="button" className={activeSection === section.id ? "active" : ""} onClick={() => scrollToSection(section.id)}>
                <span className="br30-legal-sidebar-number">{section.number}</span>
                <span>{section.title}</span>
              </button>
            ))}
          </div>
        </aside>

        <article className="br30-legal-content">
          <div className="br30-legal-intro-card">
            <div className="br30-legal-intro-card-top">
              <div className="br30-legal-intro-icon">
                <PieChart size={18} />
              </div>

              <div>
                <h2>Make your CRM data useful</h2>

                <p>
                  BR30 CRM Reporting & Analytics is designed to give businesses a structured view of the information already being managed inside their CRM. Instead of relying on scattered spreadsheets or manually prepared summaries, teams can use organized reporting views to understand what is
                  happening across leads, customers, sales, activities, pipelines, and team operations.
                </p>
              </div>
            </div>
          </div>

          <section id="introduction" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>01</span>
              Introduction
            </div>

            <h2>Understanding your business through CRM data</h2>

            <p>Reporting & Analytics brings together important CRM information and presents it in a form that is easier to understand, compare, monitor, and use for business planning.</p>

            <p>Every customer interaction, lead update, sales activity, task, deal movement, and pipeline change can contribute to a broader picture of business performance. BR30 CRM reporting is designed to help teams move from individual records toward meaningful operational visibility.</p>

            <p>Reports can support day-to-day management as well as longer-term planning by helping teams identify patterns, measure progress, understand bottlenecks, and review outcomes against business objectives.</p>

            <div className="br30-legal-note">
              <strong>Core idea:</strong> Reporting should not simply display numbers. It should make important business information easier to understand and help teams ask better operational questions.
            </div>
          </section>

          <section id="reporting-overview" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>02</span>
              Reporting Overview
            </div>

            <h2>A structured view of business performance</h2>

            <p>BR30 CRM reporting can bring together information from different areas of the CRM so that users can review business activity from a broader perspective.</p>

            <h3>Common reporting areas</h3>

            <ul>
              <li>Lead generation and lead conversion.</li>
              <li>Customer acquisition and customer activity.</li>
              <li>Sales opportunities and deal progress.</li>
              <li>Pipeline value and stage distribution.</li>
              <li>Tasks, calls, meetings, and follow-up activity.</li>
              <li>Team productivity and assigned workload.</li>
              <li>Revenue-related business information.</li>
              <li>Operational trends over selected periods.</li>
            </ul>

            <p>The exact information available in a report depends on the CRM records, fields, permissions, configuration, and data entered by authorized users.</p>
          </section>

          <section id="dashboard-insights" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>03</span>
              Dashboard Insights
            </div>

            <h2>See important information at a glance</h2>

            <p>Dashboards provide a high-level view of important CRM metrics without requiring users to inspect individual records one by one.</p>

            <p>A well-structured dashboard can help managers quickly understand the current state of sales, customer activity, lead flow, pipeline movement, and team workload.</p>

            <h3>Useful dashboard indicators</h3>

            <ul>
              <li>Total leads and newly created leads.</li>
              <li>Open opportunities and active deals.</li>
              <li>Pipeline value and stage distribution.</li>
              <li>Converted and closed records.</li>
              <li>Pending tasks and follow-up activities.</li>
              <li>Recent customer and sales activity.</li>
              <li>Performance trends across selected periods.</li>
            </ul>

            <div className="br30-legal-note">
              <strong>Management view:</strong> Dashboard metrics are most useful when they are reviewed regularly alongside the underlying CRM records and business context.
            </div>
          </section>

          <section id="sales-reports" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>04</span>
              Sales Reports
            </div>

            <h2>Understand sales activity and outcomes</h2>

            <p>Sales reports help teams understand how opportunities move through the sales process and where business results are being generated.</p>

            <h3>Sales performance information</h3>

            <ul>
              <li>Number of opportunities created during a period.</li>
              <li>Open, won, and lost opportunities.</li>
              <li>Deal values across different stages.</li>
              <li>Sales activity by representative.</li>
              <li>Sales results across selected time periods.</li>
              <li>Conversion patterns between pipeline stages.</li>
              <li>Average deal and activity-related indicators where supported by available data.</li>
            </ul>

            <p>Sales reports can be used by representatives to review their own activity and by managers to understand broader sales operations.</p>
          </section>

          <section id="lead-reports" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>05</span>
              Lead Reports
            </div>

            <h2>Track lead generation and conversion</h2>

            <p>Leads represent potential business opportunities. Reporting on leads helps teams understand where prospects are coming from, how many are being worked, and what happens after initial qualification.</p>

            <h3>Lead reporting can include</h3>

            <ul>
              <li>Total lead volume.</li>
              <li>New leads over a selected period.</li>
              <li>Lead status and qualification stages.</li>
              <li>Lead ownership and assignment.</li>
              <li>Follow-up activity.</li>
              <li>Lead-to-customer conversion information.</li>
              <li>Sources or categories where those fields are available.</li>
            </ul>

            <p>Reviewing lead reports regularly can help teams identify gaps in follow-up processes and understand how prospect activity contributes to the broader sales pipeline.</p>
          </section>

          <section id="customer-reports" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>06</span>
              Customer Reports
            </div>

            <h2>Build visibility into customer relationships</h2>

            <p>Customer reporting provides a structured way to understand the customer records managed inside BR30 CRM and the activity associated with those relationships.</p>

            <h3>Customer information may include</h3>

            <ul>
              <li>Total customer records.</li>
              <li>New customers during selected periods.</li>
              <li>Customer status or segmentation.</li>
              <li>Associated contacts and companies.</li>
              <li>Sales opportunities connected to customers.</li>
              <li>Recent interactions and activities.</li>
              <li>Account ownership and responsible team members.</li>
            </ul>

            <p>Customer reports can help teams maintain visibility across accounts and identify relationships that require attention or follow-up.</p>
          </section>

          <section id="pipeline-analytics" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>07</span>
              Pipeline Analytics
            </div>

            <h2>Understand where opportunities stand</h2>

            <p>Pipeline analytics provide visibility into how opportunities are distributed across different stages of the sales process.</p>

            <h3>Pipeline views</h3>

            <ul>
              <li>Number of opportunities in each stage.</li>
              <li>Total opportunity value by stage.</li>
              <li>Movement between pipeline stages.</li>
              <li>Open versus completed opportunities.</li>
              <li>Potential bottlenecks in the sales process.</li>
              <li>Pipeline activity over selected periods.</li>
            </ul>

            <p>Pipeline reporting can help teams understand whether opportunities are progressing, remaining inactive, or accumulating in particular stages.</p>

            <div className="br30-legal-note">
              <strong>Important:</strong> Pipeline insights depend heavily on accurate stage updates, ownership information, deal values, and timely CRM activity.
            </div>
          </section>

          <section id="team-performance" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>08</span>
              Team Performance
            </div>

            <h2>Review team activity and workload</h2>

            <p>BR30 CRM can help managers review business activity associated with individual team members and broader teams.</p>

            <h3>Team activity indicators</h3>

            <ul>
              <li>Assigned leads and opportunities.</li>
              <li>Completed and pending tasks.</li>
              <li>Customer follow-up activity.</li>
              <li>Sales activities associated with users.</li>
              <li>Opportunity ownership.</li>
              <li>Workload distribution.</li>
              <li>Performance trends based on available CRM data.</li>
            </ul>

            <p>Team reporting should be interpreted in context. Activity volume alone does not necessarily represent business outcomes, so operational activity should be reviewed together with conversion, customer, and sales information.</p>
          </section>

          <section id="activity-analytics" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>09</span>
              Activity Analytics
            </div>

            <h2>Monitor the work happening inside the CRM</h2>

            <p>Activities such as calls, meetings, tasks, notes, and follow-ups provide useful information about how customer and sales workflows are being managed.</p>

            <h3>Activity reporting</h3>

            <ul>
              <li>Completed activities.</li>
              <li>Pending tasks and follow-ups.</li>
              <li>Activity volume by user.</li>
              <li>Activity volume by date or period.</li>
              <li>Activities associated with leads, customers, companies, or deals.</li>
              <li>Outstanding work requiring attention.</li>
            </ul>

            <p>Activity analytics can help teams identify operational gaps and ensure that important customer-facing work is being recorded and followed through.</p>
          </section>

          <section id="financial-insights" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>10</span>
              Financial Insights
            </div>

            <h2>Review business value and sales-related numbers</h2>

            <p>Where financial or monetary fields are configured within the CRM, reporting can help users understand the value associated with opportunities and sales activity.</p>

            <h3>Potential financial indicators</h3>

            <ul>
              <li>Opportunity values.</li>
              <li>Pipeline value.</li>
              <li>Closed opportunity values.</li>
              <li>Won and lost value comparisons.</li>
              <li>Value distribution across pipeline stages.</li>
              <li>Sales-related trends over time.</li>
            </ul>

            <p>Financial reporting is dependent on the accuracy, completeness, currency, and business meaning of the monetary data entered into the CRM.</p>

            <div className="br30-legal-note">
              <strong>Data consideration:</strong> CRM financial reports are operational reporting tools and should be reconciled with the organization's accounting or financial systems where formal financial records are required.
            </div>
          </section>

          <section id="filters-segmentation" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>11</span>
              Filters & Segmentation
            </div>

            <h2>Focus reports on the information that matters</h2>

            <p>Filters and segmentation allow users to narrow reporting information according to relevant business attributes.</p>

            <h3>Common filtering dimensions</h3>

            <ul>
              <li>Date ranges and reporting periods.</li>
              <li>Lead or customer status.</li>
              <li>Sales pipeline stages.</li>
              <li>Assigned team members.</li>
              <li>Companies or customer segments.</li>
              <li>Activity types.</li>
              <li>Deal or opportunity categories.</li>
            </ul>

            <p>Using focused filters can make reports easier to interpret and can help different teams review the same underlying CRM data from their own operational perspective.</p>
          </section>

          <section id="data-accuracy" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>12</span>
              Data Accuracy
            </div>

            <h2>Reliable reporting starts with reliable data</h2>

            <p>Reports are only as useful as the information on which they are based. Incorrect, outdated, incomplete, or duplicated CRM records can affect reporting results.</p>

            <h3>Recommended data practices</h3>

            <ul>
              <li>Keep customer and company information current.</li>
              <li>Update opportunity stages promptly.</li>
              <li>Record important customer activities consistently.</li>
              <li>Use standardized statuses and categories.</li>
              <li>Avoid unnecessary duplicate records.</li>
              <li>Maintain accurate ownership and assignment information.</li>
              <li>Review important reports against source records when necessary.</li>
            </ul>

            <p>Consistent data management creates a stronger foundation for reporting, forecasting, operational reviews, and business planning.</p>
          </section>

          <section id="exports" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>13</span>
              Reports & Exports
            </div>

            <h2>Use reporting information outside the CRM when needed</h2>

            <p>Depending on the features and configuration available to an account, users may be able to review, download, or export selected business information for operational use.</p>

            <h3>Common reporting uses</h3>

            <ul>
              <li>Management reviews.</li>
              <li>Sales meetings.</li>
              <li>Performance discussions.</li>
              <li>Operational planning.</li>
              <li>Internal business analysis.</li>
              <li>Record keeping and business documentation.</li>
            </ul>

            <p>Exported information should be handled according to the organization's internal security, privacy, retention, and access-control requirements.</p>

            <div className="br30-legal-note">
              <strong>Security reminder:</strong> Reports and exported files may contain sensitive business information. Store and share them only with people who are authorized to access the underlying data.
            </div>
          </section>

          <section id="permissions" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>14</span>
              Access & Permissions
            </div>

            <h2>Reporting visibility should follow account permissions</h2>

            <p>Reporting information may contain customer, sales, financial, employee, or operational data. Access to reports should therefore follow the permissions and roles configured for the relevant BR30 CRM account.</p>

            <h3>Access considerations</h3>

            <ul>
              <li>Users should only access information required for their responsibilities.</li>
              <li>Managers may require broader reporting visibility than individual users.</li>
              <li>Sensitive business information should be shared carefully.</li>
              <li>Account administrators should regularly review user access.</li>
              <li>Export permissions should be managed appropriately.</li>
            </ul>

            <p>The visibility of specific reporting information can depend on account configuration, user role, record ownership, permissions, and the functionality available within the applicable BR30 CRM environment.</p>
          </section>

          <section id="best-practices" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>15</span>
              Best Practices
            </div>

            <h2>Build a consistent reporting process</h2>

            <p>Reporting becomes significantly more useful when teams follow a consistent process for entering information, reviewing metrics, and acting on findings.</p>

            <h3>Recommended reporting workflow</h3>

            <ul>
              <li>Define the business questions the report should answer.</li>
              <li>Keep CRM records updated consistently.</li>
              <li>Use standardized statuses and categories.</li>
              <li>Review important dashboards regularly.</li>
              <li>Compare performance across meaningful time periods.</li>
              <li>Investigate unusual changes before drawing conclusions.</li>
              <li>Connect reported activity with actual business outcomes.</li>
              <li>Review and improve reporting requirements as the business changes.</li>
            </ul>

            <p>A reporting system works best when reports are treated as part of the operating process rather than as isolated documents viewed only when a problem occurs.</p>

            <div className="br30-legal-note">
              <strong>Practical approach:</strong> Start with a small number of meaningful metrics, establish consistent data practices, and expand reporting as the organization's requirements become clearer.
            </div>
          </section>

          <section id="contact" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>16</span>
              Contact Us
            </div>

            <h2>Questions about Reporting & Analytics?</h2>

            <p>If you have questions about BR30 CRM reporting, analytics, dashboards, available reporting capabilities, account configuration, or how reporting information should be used within your organization, please contact the BR30 CRM support team.</p>

            <div className="br30-legal-contact-card">
              <div className="br30-legal-contact-icon">
                <Mail size={16} />
              </div>

              <div>
                <strong>BR30 CRM Support</strong>

                <a
                  href="https://br30crm-com-f.vercel.app/public/forms/6ac4a4ce8ab8658ebe3748f7/br30-crm-solutions-support-ticket?utm_source=br30crm-solutions-reporting-analytics&utm_medium=website&lead_source=br30crm-solutions-reporting-analytics&form_id=6ac2f06f45d94386aa073fc0&source_id=6ac2f19b45d94386aa073fc4"
                  className="br30-support-ticket-link"
                  rel="noopener noreferrer">
                  Create Support Ticket
                </a>
              </div>
            </div>

            <div className="br30-legal-contact-card">
              <div className="br30-legal-contact-icon">
                <UserCheck size={16} />
              </div>

              <div>
                <strong>BR30 CRM</strong>

                <p>For account-specific reporting questions, please contact us using the email address associated with your BR30 CRM account whenever possible and include relevant details about the report, dashboard, or workflow you are reviewing.</p>
              </div>
            </div>
          </section>
        </article>
      </main>

      <button type="button" className="br30-legal-top-button" onClick={handleBackToTop} aria-label="Back to top" title="Back to top">
        <ArrowUp size={16} />
      </button>

      <LandingFooter />
    </div>
  );
}

export default ReportingAnalytics;
