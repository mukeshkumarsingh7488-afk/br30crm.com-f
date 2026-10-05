import { SOLUTIONS_BUSINESS_OPERATIONS_SUPPORT_FORM_URL } from "../../constants/supportForm";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUp, BarChart3, Building2, CalendarDays, CheckCircle2, CheckSquare, ChevronRight, CircleDollarSign, ClipboardList, ContactRound, FileText, GitBranch, LayoutDashboard, Mail, Settings, ShieldCheck, Target, TrendingUp, UserCheck, UserPlus, UsersRound } from "lucide-react";
import LandingNavbar from "../../components/landing/LandingNavbar";
import LandingFooter from "../../components/landing/LandingFooter";

function BusinessOperations() {
  const [activeSection, setActiveSection] = useState("overview");

  const sections = [
    { id: "overview", number: "01", title: "Overview" },
    { id: "centralized-workspace", number: "02", title: "Centralized Workspace" },
    { id: "lead-management", number: "03", title: "Lead Management" },
    { id: "contact-management", number: "04", title: "Contact Management" },
    { id: "company-management", number: "05", title: "Company Management" },
    { id: "sales-management", number: "06", title: "Sales & Deal Management" },
    { id: "pipeline-management", number: "07", title: "Pipeline Management" },
    { id: "tasks-activities", number: "08", title: "Tasks & Activities" },
    { id: "team-collaboration", number: "09", title: "Team Collaboration" },
    { id: "reporting-analytics", number: "10", title: "Reporting & Analytics" },
    { id: "workflow-automation", number: "11", title: "Workflow & Productivity" },
    { id: "customer-visibility", number: "12", title: "Customer Visibility" },
    { id: "security-controls", number: "13", title: "Operational Controls" },
    { id: "scalable-operations", number: "14", title: "Scalable Operations" },
    { id: "getting-started", number: "15", title: "Getting Started" },
    { id: "contact", number: "16", title: "Contact Us" },
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
      <style>{`
        .br30-legal-page{min-height:100vh;background:var(--crm-bg);color:var(--crm-text);font-family:var(--crm-font)}
        .br30-legal-page *,.br30-legal-page *::before,.br30-legal-page *::after{box-sizing:border-box}

        .br30-legal-hero{padding:142px 24px 58px;border-bottom:1px solid var(--crm-border);background:var(--crm-bg)}
        .br30-legal-hero-inner{width:100%;max-width:1120px;margin:0 auto}

        .br30-legal-breadcrumb{display:flex;align-items:center;gap:6px;margin-bottom:24px;color:var(--crm-muted);font-size:13px}
        .br30-legal-breadcrumb a{color:var(--crm-muted);text-decoration:none}
        .br30-legal-breadcrumb a:hover{color:var(--crm-primary)}
        .br30-legal-breadcrumb svg{opacity:.5}

        .br30-legal-eyebrow{display:inline-flex;align-items:center;gap:7px;color:var(--crm-primary);font-size:13px;font-weight:400;letter-spacing:.08em;text-transform:uppercase}
        .br30-legal-eyebrow-dot{width:6px;height:6px;border-radius:50%;background:var(--crm-primary)}

        .br30-legal-hero h1{margin:16px 0 14px;color:var(--crm-text);font-size:clamp(32px,4vw,48px);line-height:1.12;letter-spacing:-.025em;font-weight:400}
        .br30-legal-hero h1 span{color:var(--crm-primary)}

        .br30-legal-hero-description{max-width:790px;margin:0;color:var(--crm-muted);font-size:14px;line-height:1.75}

        .br30-legal-meta{display:flex;flex-wrap:wrap;gap:8px;margin-top:25px}
        .br30-legal-meta-item{display:flex;align-items:center;gap:7px;min-height:35px;padding:7px 11px;border:1px solid var(--crm-border);border-radius:9px;background:var(--crm-surface);color:var(--crm-muted);font-size:13px}
        .br30-legal-meta-item svg{color:var(--crm-primary)}
        .br30-legal-meta-item strong{color:var(--crm-text);font-weight:400}

        .br30-legal-main{width:100%;max-width:1120px;margin:0 auto;padding:52px 24px 80px;display:grid;grid-template-columns:235px minmax(0,1fr);gap:50px;align-items:start}

        .br30-legal-sidebar{position:sticky;top:100px;max-height:calc(100vh - 120px);overflow:auto;padding:7px;border:1px solid var(--crm-border);border-radius:13px;background:var(--crm-surface);box-shadow:var(--crm-shadow);scrollbar-width:thin}
        .br30-legal-sidebar-title{padding:9px 10px 11px;color:var(--crm-text);font-size:13px;font-weight:400;letter-spacing:.06em;text-transform:uppercase}
        .br30-legal-sidebar-list{display:flex;flex-direction:column;gap:1px}

        .br30-legal-sidebar button{width:100%;display:flex;align-items:center;gap:8px;padding:8px 9px;border:0;border-radius:8px;background:transparent;color:var(--crm-muted);font:inherit;font-size:13px;line-height:1.35;text-align:left;cursor:pointer}
        .br30-legal-sidebar button:hover{background:var(--crm-surface-2);color:var(--crm-text)}
        .br30-legal-sidebar button.active{background:var(--crm-primary-soft);color:var(--crm-primary);font-weight:400}
        .br30-legal-sidebar-number{width:22px;flex:0 0 22px;font-size:13px;font-weight:400;opacity:.7}

        .br30-legal-content{min-width:0}

        .br30-legal-intro-card{margin-bottom:34px;padding:21px;border:1px solid var(--crm-border);border-radius:13px;background:var(--crm-surface);box-shadow:var(--crm-shadow)}
        .br30-legal-intro-card-top{display:flex;align-items:flex-start;gap:13px}
        .br30-legal-intro-icon{width:38px;height:38px;flex:0 0 38px;display:grid;place-items:center;border-radius:9px;background:var(--crm-primary-soft);border:1px solid var(--crm-border);color:var(--crm-primary)}
        .br30-legal-intro-card h2{margin:0 0 5px;color:var(--crm-text);font-size:15px;font-weight:400;line-height:1.4}
        .br30-legal-intro-card p{margin:0;color:var(--crm-muted);font-size:13px;line-height:1.75}

        .br30-legal-section{scroll-margin-top:110px;padding:0 0 38px;margin-bottom:38px;border-bottom:1px solid var(--crm-border)}
        .br30-legal-section:last-child{border-bottom:0;margin-bottom:0}

        .br30-legal-section-label{display:flex;align-items:center;gap:8px;margin-bottom:10px;color:var(--crm-primary);font-size:13px;font-weight:400;letter-spacing:.08em;text-transform:uppercase}
        .br30-legal-section-label span{opacity:.65}

        .br30-legal-section h2{margin:0 0 14px;color:var(--crm-text);font-size:20px;line-height:1.35;font-weight:400;letter-spacing:-.01em}
        .br30-legal-section h3{margin:22px 0 8px;color:var(--crm-text);font-size:14px;line-height:1.45;font-weight:400}
        .br30-legal-section p{margin:0 0 13px;color:var(--crm-muted);font-size:13px;line-height:1.85}
        .br30-legal-section p:last-child{margin-bottom:0}

        .br30-legal-section ul{margin:10px 0 17px;padding-left:20px}
        .br30-legal-section li{margin:7px 0;padding-left:2px;color:var(--crm-muted);font-size:13px;line-height:1.75}
        .br30-legal-section li::marker{color:var(--crm-primary)}

        .br30-legal-note{margin:18px 0;padding:14px 16px;border-left:3px solid var(--crm-primary);border-radius:0 9px 9px 0;background:var(--crm-surface-2);color:var(--crm-muted);font-size:13px;line-height:1.75}
        .br30-legal-note strong{color:var(--crm-text)}

        .br30-legal-contact-card{display:grid;grid-template-columns:auto 1fr;gap:12px;margin-top:18px;padding:17px;border:1px solid var(--crm-border);border-radius:11px;background:var(--crm-surface)}
        .br30-legal-contact-icon{width:36px;height:36px;display:grid;place-items:center;border-radius:9px;background:var(--crm-primary-soft);color:var(--crm-primary)}
        .br30-legal-contact-card strong{display:block;margin-bottom:4px;color:var(--crm-text);font-size:13px}
        .br30-legal-contact-card a{color:var(--crm-primary);font-size:13px;text-decoration:none}
        .br30-legal-contact-card a:hover{text-decoration:underline}
        .br30-legal-contact-card p{margin:0!important}

        .br30-legal-top-button{position:fixed;right:20px;bottom:20px;z-index:30;width:38px;height:38px;display:grid;place-items:center;border:1px solid var(--crm-border);border-radius:10px;background:var(--crm-surface);color:var(--crm-text);box-shadow:var(--crm-shadow);cursor:pointer;transition:.2s}
        .br30-legal-top-button:hover{border-color:var(--crm-primary);color:var(--crm-primary);transform:translateY(-2px)}

        @media(max-width:900px){
          .br30-legal-main{grid-template-columns:1fr;gap:25px}
          .br30-legal-sidebar{position:relative;top:auto;max-height:none}
          .br30-legal-sidebar-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr))}
        }

        @media(max-width:600px){
          .br30-legal-hero{padding:120px 17px 45px}
          .br30-legal-hero h1{font-size:34px}
          .br30-legal-hero-description{font-size:13px}
          .br30-legal-meta{display:grid;grid-template-columns:1fr}
          .br30-legal-main{padding:35px 17px 60px}
          .br30-legal-sidebar-list{grid-template-columns:1fr}
          .br30-legal-intro-card{padding:18px}
          .br30-legal-section{scroll-margin-top:90px;padding-bottom:32px;margin-bottom:32px}
          .br30-legal-section h2{font-size:18px}
          .br30-legal-section p,.br30-legal-section li{font-size:13px}
          .br30-legal-contact-card{grid-template-columns:1fr}
          .br30-legal-top-button{right:13px;bottom:13px}
        }
      `}</style>

      <LandingNavbar />

      <header className="br30-legal-hero">
        <div className="br30-legal-hero-inner">
          <div className="br30-legal-breadcrumb">
            <Link to="/">Home</Link>
            <ChevronRight size={13} />
            <span>Solutions</span>
            <ChevronRight size={13} />
            <span>Business Operations</span>
          </div>

          <div className="br30-legal-eyebrow">
            <span className="br30-legal-eyebrow-dot" />
            BR30 CRM Business Operations
          </div>

          <h1>
            Business <span>Operations</span>
          </h1>

          <p className="br30-legal-hero-description">BR30 CRM brings your leads, contacts, companies, deals, tasks, activities, pipelines, reporting, and team workflows into one connected business workspace designed to help your organization operate with greater clarity and consistency.</p>

          <div className="br30-legal-meta">
            <div className="br30-legal-meta-item">
              <LayoutDashboard size={14} />
              <span>
                Workspace <strong>All-in-One CRM</strong>
              </span>
            </div>

            <div className="br30-legal-meta-item">
              <TrendingUp size={14} />
              <span>
                Focus <strong>Business Growth</strong>
              </span>
            </div>

            <div className="br30-legal-meta-item">
              <FileText size={14} />
              <span>
                Solution <strong>Business Operations</strong>
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
                <LayoutDashboard size={18} />
              </div>

              <div>
                <h2>One connected workspace for the way your business operates</h2>

                <p>BR30 CRM is built around the day-to-day work that keeps a business moving. Instead of managing customer information, sales opportunities, follow-ups, tasks, and team activity across disconnected tools, teams can organize these workflows inside one connected CRM environment.</p>
              </div>
            </div>
          </div>

          <section id="overview" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>01</span>
              Overview
            </div>

            <h2>A complete operating layer for your customer-facing business</h2>

            <p>
              Business operations become difficult to manage when important information is spread across spreadsheets, messaging platforms, personal notes, separate task applications, and disconnected reporting tools. BR30 CRM brings the core information and activities involved in customer and sales
              operations into a single workspace.
            </p>

            <p>The platform can be used to organize the full journey from a new lead through qualification, relationship management, opportunity development, deal progression, follow-up, and ongoing customer engagement.</p>

            <p>The objective is not simply to store customer records. A CRM should help a team understand what is happening, what needs to happen next, who owns an activity, where opportunities are located, and how business performance is developing over time.</p>

            <div className="br30-legal-note">
              <strong>Built as an all-in-one CRM:</strong> BR30 CRM connects customer data, sales workflows, activities, tasks, pipelines, teams, and reporting so that everyday business operations can be managed from one central environment.
            </div>
          </section>

          <section id="centralized-workspace" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>02</span>
              Centralized Workspace
            </div>

            <h2>Keep important business information in one place</h2>

            <p>A centralized workspace gives teams a consistent place to access the information they need throughout the working day. Instead of repeatedly searching through different systems, users can work with connected CRM records and operational information from the same environment.</p>

            <h3>Connected customer records</h3>

            <p>Leads, contacts, companies, deals, tasks, and activities can be organized as related parts of the same business workflow. This helps users maintain context as a relationship moves from one stage to another.</p>

            <h3>One workspace for daily execution</h3>

            <ul>
              <li>Review current business activity from a central dashboard.</li>
              <li>Access leads and customer records without switching between unrelated tools.</li>
              <li>Track open deals and their current sales stages.</li>
              <li>Review upcoming tasks, meetings, and follow-ups.</li>
              <li>Monitor team activity and operational priorities.</li>
              <li>Use reports and analytics to understand business performance.</li>
            </ul>

            <p>This structure helps create a common operating environment where information can be easier to find, understand, and act upon.</p>
          </section>

          <section id="lead-management" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>03</span>
              Lead Management
            </div>

            <h2>Capture and manage opportunities from the first interaction</h2>

            <p>Leads represent potential business opportunities, and managing them consistently is an important part of a healthy sales operation. BR30 CRM provides a structured environment for organizing lead information and following the progression of potential customers.</p>

            <h3>Lead organization</h3>

            <ul>
              <li>Maintain individual lead records.</li>
              <li>Organize lead information for quick access.</li>
              <li>Track ownership and responsibility across the team.</li>
              <li>Record relevant follow-up activities.</li>
              <li>Move prospects through defined qualification stages.</li>
              <li>Maintain context around previous interactions.</li>
            </ul>

            <h3>From lead to opportunity</h3>

            <p>
              A lead should not become another record that simply sits inside a database. The purpose of lead management is to provide a clear path for deciding what should happen next. Teams can use lead information together with tasks, activities, contacts, and deals to move qualified
              opportunities into the appropriate sales workflow.
            </p>

            <div className="br30-legal-note">
              <strong>Operational benefit:</strong> A structured lead process can help teams reduce forgotten follow-ups and create clearer ownership around new opportunities.
            </div>
          </section>

          <section id="contact-management" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>04</span>
              Contact Management
            </div>

            <h2>Maintain a reliable view of the people your business works with</h2>

            <p>Contact management gives teams a structured way to maintain information about customers, prospects, partners, and other important business relationships.</p>

            <h3>Organized contact information</h3>

            <p>Instead of keeping customer information inside individual spreadsheets or personal records, teams can maintain contact information within the CRM and connect it with relevant company, lead, deal, activity, and task records.</p>

            <ul>
              <li>Maintain names and contact details.</li>
              <li>Connect people with relevant companies.</li>
              <li>Associate contacts with sales opportunities.</li>
              <li>Record activities and important interactions.</li>
              <li>Maintain notes and operational context.</li>
              <li>Make relationship information accessible to authorized team members.</li>
            </ul>

            <h3>Better relationship continuity</h3>

            <p>When customer information is organized consistently, team members can understand the context of a relationship even when responsibility changes between people or departments.</p>
          </section>

          <section id="company-management" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>05</span>
              Company Management
            </div>

            <h2>Build a complete business view around organizations</h2>

            <p>Many business relationships involve multiple contacts working within the same organization. Company management provides a structured layer for organizing those relationships and understanding the broader business context behind individual contacts.</p>

            <h3>Organization-level visibility</h3>

            <p>Teams can maintain company records and connect related contacts, opportunities, activities, and business information. This helps users understand not only who they are communicating with, but also which organization that relationship belongs to.</p>

            <ul>
              <li>Maintain company and organization records.</li>
              <li>Associate multiple contacts with a company.</li>
              <li>Track opportunities connected to an organization.</li>
              <li>Review relationship activity in context.</li>
              <li>Maintain business notes and relevant information.</li>
            </ul>

            <div className="br30-legal-note">
              <strong>Business context:</strong> Company-level organization helps teams move beyond isolated contact records and maintain a broader view of important customer relationships.
            </div>
          </section>

          <section id="sales-management" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>06</span>
              Sales & Deal Management
            </div>

            <h2>Manage opportunities from creation to completion</h2>

            <p>Sales teams need a clear system for tracking opportunities, expected values, ownership, stages, activities, and next steps. BR30 CRM provides a structured deal-management environment for organizing those elements together.</p>

            <h3>Opportunity management</h3>

            <ul>
              <li>Create and organize sales opportunities.</li>
              <li>Associate deals with relevant contacts and companies.</li>
              <li>Assign ownership to responsible team members.</li>
              <li>Track deal value and sales stage.</li>
              <li>Monitor probability and progression.</li>
              <li>Record activities and follow-up requirements.</li>
            </ul>

            <h3>Sales visibility</h3>

            <p>A structured deal record makes it easier for teams to understand which opportunities require attention and what actions may be necessary to move them forward.</p>

            <p>Managers can use the same information to understand the current sales pipeline, identify opportunities requiring attention, and review the overall movement of active deals.</p>
          </section>

          <section id="pipeline-management" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>07</span>
              Pipeline Management
            </div>

            <h2>Visualize where opportunities stand in the sales process</h2>

            <p>A sales pipeline provides a structured representation of how opportunities move through the sales process. BR30 CRM can organize opportunities into defined stages so teams can quickly understand what is new, qualified, being proposed, under negotiation, or approaching completion.</p>

            <h3>Stage-based visibility</h3>

            <ul>
              <li>Define a structured progression for opportunities.</li>
              <li>Understand the number of deals within each stage.</li>
              <li>Review potential value across pipeline stages.</li>
              <li>Identify opportunities that may require follow-up.</li>
              <li>Maintain a common sales process across the team.</li>
            </ul>

            <h3>Pipeline discipline</h3>

            <p>A well-maintained pipeline provides a common language for sales teams and managers. Instead of relying on individual assumptions, the team can work from a shared representation of opportunity status.</p>

            <div className="br30-legal-note">
              <strong>Operational visibility:</strong> Pipeline management connects individual deal records with a broader view of sales activity and potential revenue.
            </div>
          </section>

          <section id="tasks-activities" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>08</span>
              Tasks & Activities
            </div>

            <h2>Turn customer interactions into organized next steps</h2>

            <p>Customer relationships depend on consistent execution. Calls, meetings, emails, follow-ups, reviews, and internal tasks can easily be missed when they are managed informally.</p>

            <h3>Activity tracking</h3>

            <p>BR30 CRM provides an operational layer for recording and organizing activities associated with customer and sales workflows.</p>

            <ul>
              <li>Record calls and customer conversations.</li>
              <li>Track meetings and important interactions.</li>
              <li>Maintain follow-up activities.</li>
              <li>Associate activities with relevant business records.</li>
              <li>Review recent activity history.</li>
              <li>Keep upcoming work visible through tasks.</li>
            </ul>

            <h3>Task management</h3>

            <p>Tasks help translate CRM information into action. A deal may require a proposal review, a lead may require a follow-up call, or a customer may need an account review. Organizing those actions gives teams a clearer operational workflow.</p>
          </section>

          <section id="team-collaboration" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>09</span>
              Team Collaboration
            </div>

            <h2>Keep teams aligned around customers and priorities</h2>

            <p>Business operations rarely depend on one person. Sales, management, customer-facing teams, and other contributors may interact with the same customers and opportunities throughout the business lifecycle.</p>

            <h3>Shared operational context</h3>

            <p>BR30 CRM helps teams work from shared customer and business information rather than relying exclusively on individual knowledge.</p>

            <ul>
              <li>Assign records and responsibilities to team members.</li>
              <li>Maintain shared information around customer relationships.</li>
              <li>Track team activities and operational work.</li>
              <li>Review individual and team performance information.</li>
              <li>Support handoffs between team members.</li>
              <li>Maintain continuity when ownership changes.</li>
            </ul>

            <h3>Management visibility</h3>

            <p>Managers can use centralized CRM information to understand what the team is working on, where opportunities are progressing, and where additional attention may be required.</p>
          </section>

          <section id="reporting-analytics" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>10</span>
              Reporting & Analytics
            </div>

            <h2>Turn operational activity into useful business insight</h2>

            <p>CRM data becomes more valuable when teams can understand what the underlying information means for the business. Reporting and analytics provide a way to review activity, pipeline movement, revenue-related information, team performance, and other operational indicators.</p>

            <h3>Business performance visibility</h3>

            <ul>
              <li>Review sales and revenue-related information.</li>
              <li>Understand lead and opportunity activity.</li>
              <li>Monitor pipeline distribution.</li>
              <li>Review team performance indicators.</li>
              <li>Identify operational trends.</li>
              <li>Support management discussions with organized data.</li>
            </ul>

            <h3>From records to decisions</h3>

            <p>Reporting does not replace business judgment. Instead, it gives teams a structured information layer that can support planning, prioritization, review meetings, and operational decision-making.</p>

            <div className="br30-legal-note">
              <strong>Connected reporting:</strong> Because CRM records, activities, opportunities, and team information are managed together, reporting can be connected to the underlying workflow rather than existing as an isolated reporting system.
            </div>
          </section>

          <section id="workflow-automation" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>11</span>
              Workflow & Productivity
            </div>

            <h2>Create a more consistent way for teams to execute daily work</h2>

            <p>Business productivity is not only about completing more tasks. It is also about creating repeatable processes that help teams know what should happen, when it should happen, and who is responsible.</p>

            <h3>Repeatable workflows</h3>

            <p>
              BR30 CRM can act as the central workspace around which teams organize recurring sales and customer-management processes. Leads can be followed through qualification, deals can move through defined stages, activities can be recorded, and tasks can be created around important next steps.
            </p>

            <ul>
              <li>Standardize common sales workflows.</li>
              <li>Organize recurring customer follow-ups.</li>
              <li>Connect tasks with customer and deal activity.</li>
              <li>Maintain consistent pipeline stages.</li>
              <li>Reduce dependence on disconnected personal workflows.</li>
              <li>Give teams a repeatable operational structure.</li>
            </ul>

            <h3>Quick execution</h3>

            <p>A centralized CRM also makes common actions easier to access. Teams can move between leads, contacts, companies, deals, activities, tasks, pipelines, reports, and other workspace functions without rebuilding their context every time.</p>
          </section>

          <section id="customer-visibility" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>12</span>
              Customer Visibility
            </div>

            <h2>Build a clearer picture of every customer relationship</h2>

            <p>Strong customer management depends on context. A customer relationship may include multiple contacts, conversations, opportunities, tasks, meetings, and follow-ups. Keeping those elements connected helps teams understand the relationship as a whole.</p>

            <h3>Relationship history</h3>

            <p>CRM records can provide a structured place to maintain relevant customer information and activity history. This can help authorized team members understand previous interactions before taking the next action.</p>

            <h3>Customer continuity</h3>

            <ul>
              <li>Maintain customer information in a structured record.</li>
              <li>Connect contacts and companies.</li>
              <li>Associate deals with customer relationships.</li>
              <li>Track important activities and follow-ups.</li>
              <li>Maintain notes and operational context.</li>
              <li>Support smoother transitions between team members.</li>
            </ul>

            <p>The result is a more connected customer view that can support consistent communication and better internal coordination.</p>
          </section>

          <section id="security-controls" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>13</span>
              Operational Controls
            </div>

            <h2>Keep business operations structured and controlled</h2>

            <p>As organizations grow, operational complexity grows with them. More users, more customers, more deals, and more activity can make it increasingly important to establish clear structures around access, responsibilities, records, and workflows.</p>

            <h3>Role-aware operations</h3>

            <p>BR30 CRM can support role-based business environments where different users may have different responsibilities and levels of access. This allows organizations to structure their workspace around how their teams actually operate.</p>

            <h3>Operational consistency</h3>

            <ul>
              <li>Organize responsibilities around defined users and teams.</li>
              <li>Maintain structured customer and sales records.</li>
              <li>Use consistent pipeline stages and workflows.</li>
              <li>Keep operational activity visible within the CRM.</li>
              <li>Support controlled access to business information.</li>
              <li>Maintain a clearer operational record of business activity.</li>
            </ul>

            <div className="br30-legal-note">
              <strong>Important:</strong> Organizations remain responsible for configuring users, permissions, workflows, and internal processes appropriately for their own business requirements.
            </div>
          </section>

          <section id="scalable-operations" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>14</span>
              Scalable Operations
            </div>

            <h2>Build an operating system that can grow with your business</h2>

            <p>A CRM should remain useful as the business becomes more complicated. The operational structure that works for a small team can become difficult to maintain when customer volume, sales activity, team size, and reporting requirements increase.</p>

            <h3>From small teams to growing organizations</h3>

            <p>BR30 CRM provides a connected foundation around which businesses can organize their customer and sales operations. As the number of records and users grows, a centralized CRM can help preserve consistency across the organization.</p>

            <ul>
              <li>Expand customer and contact records as relationships grow.</li>
              <li>Manage increasing numbers of leads and opportunities.</li>
              <li>Organize larger sales pipelines.</li>
              <li>Support multiple team members and responsibilities.</li>
              <li>Maintain reporting visibility as operational activity increases.</li>
              <li>Keep core business workflows inside one connected system.</li>
            </ul>

            <h3>Designed around operational clarity</h3>

            <p>Growth should not require teams to rebuild their entire information architecture every time the business changes. A centralized CRM creates a common structure that can evolve with changing teams, processes, customers, and sales activity.</p>

            <div className="br30-legal-note">
              <strong>Long-term value:</strong> The goal is to provide a consistent business workspace that remains useful as your organization, customer relationships, and operational needs evolve.
            </div>
          </section>

          <section id="getting-started" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>15</span>
              Getting Started
            </div>

            <h2>Bring your business operations into one connected workflow</h2>

            <p>Getting started with BR30 CRM begins with understanding the information and processes your organization relies on every day. The platform can then be structured around the way your team manages leads, customers, sales opportunities, activities, and operational work.</p>

            <h3>Start with your core records</h3>

            <ul>
              <li>Set up your organization and business workspace.</li>
              <li>Organize your customer and company information.</li>
              <li>Bring leads and sales opportunities into the CRM.</li>
              <li>Define the stages used by your sales process.</li>
              <li>Set up users and team responsibilities.</li>
            </ul>

            <h3>Build the workflow</h3>

            <p>Once the core information is organized, teams can establish the daily workflow around tasks, activities, follow-ups, deals, and reporting. The objective is to make the CRM part of everyday execution rather than a system that is updated only after work has already happened.</p>

            <h3>Use information continuously</h3>

            <p>The value of a CRM grows when teams consistently maintain their records and use the information to coordinate customer interactions, sales activity, and management reviews.</p>

            <div className="br30-legal-note">
              <strong>Start simple, grow systematically:</strong> Begin with the workflows that matter most to your business and expand the CRM structure as your operational requirements evolve.
            </div>
          </section>

          <section id="contact" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>16</span>
              Contact Us
            </div>

            <h2>Questions about BR30 CRM Business Operations?</h2>

            <p>If you have questions about BR30 CRM, business operations, available CRM capabilities, implementation, workflows, or how the platform can fit into your organization, contact the BR30 CRM support team.</p>

            <p>Our team can help you understand the platform and determine how its workspace, customer management, sales, activity, task, reporting, and team capabilities can be organized around your business requirements.</p>

            <div className="br30-legal-contact-card">
              <div className="br30-legal-contact-icon">
                <Mail size={16} />
              </div>

              <div>
                <strong>BR30 CRM Support</strong>

                <a href={SOLUTIONS_BUSINESS_OPERATIONS_SUPPORT_FORM_URL} className="br30-support-ticket-link" target="_blank" rel="noopener noreferrer">
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

                <p>For account-specific questions or operational requirements, please contact us using the email address associated with your BR30 CRM account whenever possible.</p>
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

export default BusinessOperations;
