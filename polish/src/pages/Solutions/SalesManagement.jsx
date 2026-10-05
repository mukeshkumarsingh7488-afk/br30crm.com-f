import { SOLUTIONS_SALES_MANAGEMENT_SUPPORT_FORM_URL } from "../../constants/supportForm";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUp, BarChart3, CheckCircle2, ChevronRight, ClipboardList, DollarSign, FileText, GitBranch, Mail, ShoppingCart, Target, TrendingUp, UsersRound } from "lucide-react";
import LandingNavbar from "../../components/landing/LandingNavbar";
import LandingFooter from "../../components/landing/LandingFooter";

function SalesManagement() {
  const [activeSection, setActiveSection] = useState("overview");

  const sections = [
    { id: "overview", number: "01", title: "Overview" },
    { id: "sales-workspace", number: "02", title: "Sales Workspace" },
    { id: "lead-to-sale", number: "03", title: "Lead to Sale" },
    { id: "pipeline-management", number: "04", title: "Pipeline Management" },
    { id: "deal-management", number: "05", title: "Deal Management" },
    { id: "sales-activities", number: "06", title: "Sales Activities" },
    { id: "follow-ups", number: "07", title: "Follow-Ups" },
    { id: "quotations", number: "08", title: "Quotations & Proposals" },
    { id: "sales-team", number: "09", title: "Sales Team" },
    { id: "sales-performance", number: "10", title: "Sales Performance" },
    { id: "forecasting", number: "11", title: "Sales Forecasting" },
    { id: "customer-relationships", number: "12", title: "Customer Relationships" },
    { id: "sales-process", number: "13", title: "Sales Process" },
    { id: "best-practices", number: "14", title: "Best Practices" },
    { id: "contact", number: "15", title: "Contact Us" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const offset = 150;
      let current = "overview";

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
            <span>Sales Management</span>
          </div>

          <div className="br30-legal-eyebrow">
            <span className="br30-legal-eyebrow-dot" />
            BR30 CRM Sales
          </div>

          <h1>
            Sales <span>Management</span>
          </h1>

          <p className="br30-legal-hero-description">
            BR30 CRM Sales Management provides a structured workspace for managing opportunities, sales pipelines, customer conversations, follow-ups, deals, team activities, and the complete journey from an initial prospect interaction to a completed sale.
          </p>

          <div className="br30-legal-meta">
            <div className="br30-legal-meta-item">
              <ShoppingCart size={14} />
              <span>
                Sales Workspace <strong>Centralized</strong>
              </span>
            </div>

            <div className="br30-legal-meta-item">
              <GitBranch size={14} />
              <span>
                Pipeline <strong>Connected</strong>
              </span>
            </div>

            <div className="br30-legal-meta-item">
              <BarChart3 size={14} />
              <span>
                Performance <strong>Visible</strong>
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
                <DollarSign size={18} />
              </div>

              <div>
                <h2>Turn sales activity into a clear, connected process</h2>
                <p>BR30 CRM is designed to bring sales information, customer relationships, opportunities, activities, follow-ups, and team workflows into one organized environment so businesses can manage their sales process with greater visibility and consistency.</p>
              </div>
            </div>
          </div>

          <section id="overview" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>01</span>
              Overview
            </div>

            <h2>A complete workspace for managing sales</h2>

            <p>
              Sales Management in BR30 CRM provides a centralized approach to organizing the information and activities that contribute to your sales process. Instead of keeping prospects, customer details, opportunities, notes, tasks, and follow-ups across disconnected systems, teams can work from
              a connected CRM workspace.
            </p>

            <p>The sales workspace can be used to understand where opportunities are currently positioned, what actions are required next, which customers need attention, and how sales activities are progressing across the organization.</p>

            <ul>
              <li>Organize prospects and sales opportunities.</li>
              <li>Maintain customer and contact information alongside sales activity.</li>
              <li>Track opportunities through defined sales stages.</li>
              <li>Record calls, meetings, notes, and follow-up activities.</li>
              <li>Coordinate sales responsibilities across team members.</li>
              <li>Review sales activity and performance information.</li>
            </ul>

            <div className="br30-legal-note">
              <strong>Centralized sales view:</strong> BR30 CRM connects customer information and sales activity so teams can work from a consistent source of business information.
            </div>
          </section>

          <section id="sales-workspace" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>02</span>
              Sales Workspace
            </div>

            <h2>Keep the sales process organized in one place</h2>

            <p>
              A sales team often works with multiple pieces of information at the same time. Customer records, contact details, opportunities, activities, tasks, notes, and commercial information can become difficult to manage when they are distributed across spreadsheets, messages, email threads,
              and separate applications.
            </p>

            <p>BR30 CRM brings these related elements into a structured workspace. Authorized users can access the information relevant to their role and use it to manage day-to-day sales operations.</p>

            <h3>Customer context</h3>

            <p>Sales users can maintain customer and contact information alongside relevant opportunity and activity records, making it easier to understand the relationship surrounding an active sales conversation.</p>

            <h3>Opportunity visibility</h3>

            <p>Sales opportunities can be organized according to their current position in the sales process, helping teams identify active opportunities and determine which actions may be required next.</p>

            <h3>Activity coordination</h3>

            <p>Calls, meetings, notes, tasks, and follow-ups can be associated with the broader sales workflow so important actions are less likely to become disconnected from the opportunity they support.</p>
          </section>

          <section id="lead-to-sale" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>03</span>
              Lead to Sale
            </div>

            <h2>Manage the journey from prospect to customer</h2>

            <p>Sales management begins before a deal is closed. Teams need a consistent way to capture prospects, understand their requirements, qualify opportunities, and move suitable prospects toward a commercial conversation.</p>

            <p>BR30 CRM supports a connected approach in which lead information can become part of the wider customer and opportunity workflow. This allows sales teams to maintain context as a prospect progresses through different stages.</p>

            <ul>
              <li>Capture and organize potential opportunities.</li>
              <li>Review lead and prospect information.</li>
              <li>Identify opportunities that require qualification.</li>
              <li>Maintain relevant notes and sales activities.</li>
              <li>Move qualified opportunities into the appropriate sales process.</li>
              <li>Continue tracking the relationship through the deal lifecycle.</li>
            </ul>

            <p>A structured lead-to-sale process can help teams establish consistent workflows while maintaining a clearer record of how an opportunity developed.</p>
          </section>

          <section id="pipeline-management" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>04</span>
              Pipeline Management
            </div>

            <h2>Understand where every opportunity stands</h2>

            <p>A sales pipeline provides a structured representation of active opportunities and the stages they are currently passing through. BR30 CRM can be used to organize these opportunities according to the sales process defined by the business.</p>

            <h3>Stage-based visibility</h3>

            <p>Opportunities can be reviewed according to their current stage, allowing sales teams to understand which opportunities are new, progressing, awaiting action, approaching a decision, or otherwise positioned within the organization's sales workflow.</p>

            <h3>Pipeline organization</h3>

            <p>A consistent pipeline structure helps teams use common terminology and processes when discussing active opportunities. It can also make it easier for managers to review the distribution of opportunities across stages.</p>

            <h3>Pipeline activity</h3>

            <p>Pipeline information becomes more useful when combined with activities and follow-ups. Sales users can use the surrounding customer and activity context to determine what should happen next for an opportunity.</p>

            <div className="br30-legal-note">
              <strong>Process clarity:</strong> Pipeline stages should reflect the actual sales process used by your organization rather than creating unnecessary steps that do not represent meaningful progress.
            </div>
          </section>

          <section id="deal-management" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>05</span>
              Deal Management
            </div>

            <h2>Track opportunities through the deal lifecycle</h2>

            <p>Deal management focuses on the commercial opportunity itself. A deal can contain important information about the customer, opportunity value, stage, responsible team member, expected activity, notes, and other information required by the sales process.</p>

            <p>BR30 CRM provides a structured environment for keeping this information connected. Teams can use deal records to maintain a clearer history of the opportunity rather than relying on disconnected notes or individual memory.</p>

            <ul>
              <li>Associate deals with relevant customers and contacts.</li>
              <li>Maintain opportunity values and commercial information.</li>
              <li>Track the current stage of an opportunity.</li>
              <li>Record relevant sales notes and activities.</li>
              <li>Assign responsibility to appropriate team members.</li>
              <li>Review progress as the opportunity moves through the pipeline.</li>
            </ul>

            <p>A consistent deal management process can also provide useful information for sales reviews, planning, reporting, and forecasting.</p>
          </section>

          <section id="sales-activities" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>06</span>
              Sales Activities
            </div>

            <h2>Connect daily activities with sales opportunities</h2>

            <p>Sales performance is influenced by the quality and consistency of everyday activities. Calls, meetings, demonstrations, messages, notes, tasks, and other interactions can all contribute to the movement of an opportunity.</p>

            <p>BR30 CRM provides a place for sales teams to record and organize these activities in relation to customers and opportunities. This creates a more complete record of the sales relationship.</p>

            <h3>Calls and conversations</h3>

            <p>Important details from customer conversations can be recorded so that relevant team members have access to the context needed for future interactions.</p>

            <h3>Meetings and demonstrations</h3>

            <p>Meetings and product discussions can be connected to the appropriate customer or opportunity, helping teams maintain continuity between sales activities.</p>

            <h3>Tasks</h3>

            <p>Follow-up tasks can help sales users maintain a clear list of actions that need to be completed as part of the sales process.</p>
          </section>

          <section id="follow-ups" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>07</span>
              Follow-Ups
            </div>

            <h2>Make the next sales action visible</h2>

            <p>Follow-up discipline is an important part of maintaining an active sales process. Opportunities can lose momentum when important customer responses, meetings, calls, or commercial actions are not tracked consistently.</p>

            <p>BR30 CRM allows sales workflows to incorporate follow-up activities so team members can identify outstanding actions and continue customer conversations with better context.</p>

            <ul>
              <li>Identify pending customer actions.</li>
              <li>Record the outcome of previous interactions.</li>
              <li>Create tasks for future sales activity.</li>
              <li>Associate follow-ups with relevant opportunities.</li>
              <li>Maintain continuity when responsibility moves between team members.</li>
            </ul>

            <div className="br30-legal-note">
              <strong>Next-action principle:</strong> Every active opportunity should have enough context for the responsible sales user to understand what needs to happen next.
            </div>
          </section>

          <section id="quotations" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>08</span>
              Quotations & Proposals
            </div>

            <h2>Support the commercial conversation</h2>

            <p>Sales conversations frequently progress from understanding customer requirements to discussing pricing, scope, products, services, or commercial terms. A structured sales process can help teams maintain the information associated with these discussions.</p>

            <p>Where quotation or proposal workflows are used within a business, relevant commercial information can be maintained alongside the associated customer and opportunity records.</p>

            <h3>Commercial context</h3>

            <p>Keeping proposal-related information connected to the relevant opportunity can help sales users understand the history and context surrounding a commercial discussion.</p>

            <h3>Customer communication</h3>

            <p>Sales teams can maintain appropriate notes and activities related to proposal discussions, customer questions, revisions, and follow-up conversations.</p>

            <p>The exact quotation, pricing, approval, and proposal process may vary according to the organization's business model and internal procedures.</p>
          </section>

          <section id="sales-team" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>09</span>
              Sales Team
            </div>

            <h2>Coordinate responsibilities across the team</h2>

            <p>Sales processes often involve multiple people. A prospect may be introduced by one team member, qualified by another, managed by an account executive, and reviewed by a manager. Without clear ownership, opportunities can become difficult to track.</p>

            <p>BR30 CRM supports structured ownership and team workflows so businesses can organize responsibility around customers, leads, deals, and activities.</p>

            <ul>
              <li>Assign opportunities to responsible sales users.</li>
              <li>Maintain ownership information for customer relationships.</li>
              <li>Coordinate activities between team members.</li>
              <li>Provide managers with greater visibility into sales activity.</li>
              <li>Reduce confusion around responsibility for active opportunities.</li>
            </ul>

            <p>Appropriate access controls and role permissions should be configured according to the organization's internal requirements.</p>
          </section>

          <section id="sales-performance" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>10</span>
              Sales Performance
            </div>

            <h2>Turn sales activity into useful business information</h2>

            <p>Sales management requires more than tracking individual opportunities. Managers and business owners may also need to understand activity levels, pipeline movement, deal progress, customer engagement, and broader sales trends.</p>

            <p>BR30 CRM can bring sales information together so businesses can review relevant activity and performance information from a more centralized perspective.</p>

            <h3>Activity visibility</h3>

            <p>Reviewing activities can help teams understand how much sales work is taking place and where additional attention may be required.</p>

            <h3>Opportunity visibility</h3>

            <p>Managers can review active opportunities and their pipeline positions to better understand the current sales workload.</p>

            <h3>Performance discussions</h3>

            <p>Sales records can provide useful context for regular team reviews, planning discussions, coaching sessions, and operational decision-making.</p>
          </section>

          <section id="forecasting" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>11</span>
              Sales Forecasting
            </div>

            <h2>Use pipeline information for forward planning</h2>

            <p>Sales forecasting involves using available opportunity information to understand potential future business activity. Forecasting is most useful when the underlying pipeline records are maintained consistently and reflect the current state of opportunities.</p>

            <p>BR30 CRM can provide the underlying sales information that teams use to review pipeline values, stages, opportunity activity, and other relevant indicators as part of their internal forecasting process.</p>

            <ul>
              <li>Review active opportunities.</li>
              <li>Understand opportunity distribution across pipeline stages.</li>
              <li>Review deal values and relevant commercial information.</li>
              <li>Identify opportunities that require additional attention.</li>
              <li>Compare pipeline information across sales periods where appropriate.</li>
            </ul>

            <div className="br30-legal-note">
              <strong>Forecasting context:</strong> CRM data can support forecasting workflows, but forecasts depend on the quality, completeness, timing, and business assumptions applied to the underlying information.
            </div>
          </section>

          <section id="customer-relationships" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>12</span>
              Customer Relationships
            </div>

            <h2>Build sales around long-term customer relationships</h2>

            <p>Sales management does not end when an opportunity is closed. Customer relationships can continue through renewals, additional purchases, account expansion, support interactions, and future opportunities.</p>

            <p>BR30 CRM provides a connected environment where customer information and sales history can remain associated with the broader relationship.</p>

            <ul>
              <li>Maintain customer and contact records.</li>
              <li>Keep relevant interaction history organized.</li>
              <li>Understand previous opportunities and commercial conversations.</li>
              <li>Identify potential future sales opportunities.</li>
              <li>Support continuity when account responsibilities change.</li>
            </ul>

            <p>Maintaining accurate customer records can help teams approach future interactions with greater context and reduce unnecessary duplication of information.</p>
          </section>

          <section id="sales-process" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>13</span>
              Sales Process
            </div>

            <h2>Create a repeatable sales workflow</h2>

            <p>A clear sales process helps teams understand how opportunities should move from one stage to another. BR30 CRM can serve as the operational workspace for applying that process consistently.</p>

            <h3>Define meaningful stages</h3>

            <p>Sales stages should represent meaningful changes in opportunity status and should be understandable to everyone involved in the sales process.</p>

            <h3>Standardize activities</h3>

            <p>Teams can establish consistent expectations around qualification, meetings, demonstrations, proposals, follow-ups, and other activities appropriate to their sales model.</p>

            <h3>Maintain accurate records</h3>

            <p>Sales information should be updated as opportunities progress so that pipeline views and reports remain useful for the people who depend on them.</p>

            <h3>Review and improve</h3>

            <p>Businesses can periodically review their sales process to identify unnecessary steps, repeated work, bottlenecks, and areas where additional automation or clearer responsibilities may improve operations.</p>
          </section>

          <section id="best-practices" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>14</span>
              Best Practices
            </div>

            <h2>Practical principles for effective sales management</h2>

            <p>The effectiveness of a CRM depends not only on the software but also on how consistently the organization uses it. The following principles can help maintain a more reliable sales workspace.</p>

            <ul>
              <li>Keep customer and contact information accurate and current.</li>
              <li>Update opportunity stages when meaningful progress occurs.</li>
              <li>Record important customer interactions promptly.</li>
              <li>Make the next action visible for active opportunities.</li>
              <li>Assign clear ownership to leads, customers, and deals.</li>
              <li>Use consistent sales terminology across the team.</li>
              <li>Review pipeline information regularly.</li>
              <li>Remove duplicate or outdated records where appropriate.</li>
              <li>Use reports and activity information to support operational reviews.</li>
              <li>Configure access permissions according to business responsibilities.</li>
            </ul>

            <p>A disciplined sales process helps ensure that CRM information remains useful not only to individual sales users but also to managers, business owners, and other authorized teams that rely on the information for operational planning.</p>

            <div className="br30-legal-note">
              <strong>Built for connected sales operations:</strong> BR30 CRM brings leads, customers, opportunities, activities, pipelines, and sales information together so businesses can build a more organized and repeatable sales workflow.
            </div>
          </section>

          <section id="contact" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>15</span>
              Contact Us
            </div>

            <h2>Questions about Sales Management?</h2>

            <p>If you have questions about BR30 CRM Sales Management, sales workflows, CRM functionality, account configuration, or how to structure your sales process within the platform, please contact the BR30 CRM support team.</p>

            <div className="br30-legal-contact-card">
              <div className="br30-legal-contact-icon">
                <Mail size={16} />
              </div>

              <div>
                <strong>BR30 CRM Support</strong>

                <a href={SOLUTIONS_SALES_MANAGEMENT_SUPPORT_FORM_URL} className="br30-support-ticket-link" target="_blank" rel="noopener noreferrer">
                  Create Support Ticket
                </a>
              </div>
            </div>

            <div className="br30-legal-contact-card">
              <div className="br30-legal-contact-icon">
                <UsersRound size={16} />
              </div>

              <div>
                <strong>BR30 CRM Sales Team</strong>

                <p>For account-specific sales configuration or workflow questions, please contact us using the email address associated with your BR30 CRM account whenever possible.</p>
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

export default SalesManagement;
