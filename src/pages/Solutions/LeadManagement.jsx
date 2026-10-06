import { SOLUTIONS_LEAD_MANAGEMENT_SUPPORT_FORM_URL } from "../../constants/supportForm";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUp, ChevronRight, BarChart3, CheckCircle2, FileText, Mail, Target, UsersRound } from "lucide-react";
import LandingNavbar from "../../components/landing/LandingNavbar";
import LandingFooter from "../../components/landing/LandingFooter";

function LeadManagement() {
  const [activeSection, setActiveSection] = useState("overview");

  const sections = [
    { id: "overview", number: "01", title: "Overview" },
    { id: "lead-capture", number: "02", title: "Lead Capture" },
    { id: "lead-organization", number: "03", title: "Lead Organization" },
    { id: "lead-qualification", number: "04", title: "Lead Qualification" },
    { id: "lead-assignment", number: "05", title: "Lead Assignment" },
    { id: "lead-follow-up", number: "06", title: "Follow-Ups & Activities" },
    { id: "lead-pipeline", number: "07", title: "Lead Pipeline" },
    { id: "lead-conversion", number: "08", title: "Lead Conversion" },
    { id: "lead-scoring", number: "09", title: "Lead Prioritization" },
    { id: "lead-reporting", number: "10", title: "Lead Reporting" },
    { id: "team-collaboration", number: "11", title: "Team Collaboration" },
    { id: "data-management", number: "12", title: "Lead Data Management" },
    { id: "security-access", number: "13", title: "Security & Access" },
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
      <style>{`.br30-legal-page{min-height:100vh;background:var(--crm-bg);color:var(--crm-text);font-family:var(--crm-font)}.br30-legal-page *,.br30-legal-page *::before,.br30-legal-page *::after{box-sizing:border-box}.br30-legal-hero{padding:142px 24px 58px;border-bottom:1px solid var(--crm-border);background:var(--crm-bg)}.br30-legal-hero-inner{width:100%;max-width:1120px;margin:0 auto}.br30-legal-breadcrumb{display:flex;align-items:center;gap:6px;margin-bottom:24px;color:var(--crm-muted);font-size:13px}.br30-legal-breadcrumb a{color:var(--crm-muted);text-decoration:none}.br30-legal-breadcrumb a:hover{color:var(--crm-primary)}.br30-legal-breadcrumb svg{opacity:.5}.br30-legal-eyebrow{display:inline-flex;align-items:center;gap:7px;color:var(--crm-primary);font-size:13px;font-weight:400;letter-spacing:.08em;text-transform:uppercase}.br30-legal-eyebrow-dot{width:6px;height:6px;border-radius:50%;background:var(--crm-primary)}.br30-legal-hero h1{margin:16px 0 14px;color:var(--crm-text);font-size:clamp(32px,4vw,48px);line-height:1.12;letter-spacing:-.025em;font-weight:400}.br30-legal-hero h1 span{color:var(--crm-primary)}.br30-legal-hero-description{max-width:780px;margin:0;color:var(--crm-muted);font-size:14px;line-height:1.75}.br30-legal-meta{display:flex;flex-wrap:wrap;gap:8px;margin-top:25px}.br30-legal-meta-item{display:flex;align-items:center;gap:7px;min-height:35px;padding:7px 11px;border:1px solid var(--crm-border);border-radius:9px;background:var(--crm-surface);color:var(--crm-muted);font-size:13px}.br30-legal-meta-item svg{color:var(--crm-primary)}.br30-legal-meta-item strong{color:var(--crm-text);font-weight:400}.br30-legal-main{width:100%;max-width:1120px;margin:0 auto;padding:52px 24px 80px;display:grid;grid-template-columns:235px minmax(0,1fr);gap:50px;align-items:start}.br30-legal-sidebar{position:sticky;top:100px;max-height:calc(100vh - 120px);overflow:auto;padding:7px;border:1px solid var(--crm-border);border-radius:13px;background:var(--crm-surface);box-shadow:var(--crm-shadow);scrollbar-width:thin}.br30-legal-sidebar-title{padding:9px 10px 11px;color:var(--crm-text);font-size:13px;font-weight:400;letter-spacing:.06em;text-transform:uppercase}.br30-legal-sidebar-list{display:flex;flex-direction:column;gap:1px}.br30-legal-sidebar button{width:100%;display:flex;align-items:center;gap:8px;padding:8px 9px;border:0;border-radius:8px;background:transparent;color:var(--crm-muted);font:inherit;font-size:13px;line-height:1.35;text-align:left;cursor:pointer}.br30-legal-sidebar button:hover{background:var(--crm-surface-2);color:var(--crm-text)}.br30-legal-sidebar button.active{background:var(--crm-primary-soft);color:var(--crm-primary);font-weight:400}.br30-legal-sidebar-number{width:22px;flex:0 0 22px;font-size:13px;font-weight:400;opacity:.7}.br30-legal-content{min-width:0}.br30-legal-intro-card{margin-bottom:34px;padding:21px;border:1px solid var(--crm-border);border-radius:13px;background:var(--crm-surface);box-shadow:var(--crm-shadow)}.br30-legal-intro-card-top{display:flex;align-items:flex-start;gap:13px}.br30-legal-intro-icon{width:38px;height:38px;flex:0 0 38px;display:grid;place-items:center;border-radius:9px;background:var(--crm-primary-soft);border:1px solid var(--crm-border);color:var(--crm-primary)}.br30-legal-intro-card h2{margin:0 0 5px;color:var(--crm-text);font-size:15px;font-weight:400;line-height:1.4}.br30-legal-intro-card p{margin:0;color:var(--crm-muted);font-size:13px;line-height:1.75}.br30-legal-section{scroll-margin-top:110px;padding:0 0 38px;margin-bottom:38px;border-bottom:1px solid var(--crm-border)}.br30-legal-section:last-child{border-bottom:0;margin-bottom:0}.br30-legal-section-label{display:flex;align-items:center;gap:8px;margin-bottom:10px;color:var(--crm-primary);font-size:13px;font-weight:400;letter-spacing:.08em;text-transform:uppercase}.br30-legal-section-label span{opacity:.65}.br30-legal-section h2{margin:0 0 14px;color:var(--crm-text);font-size:20px;line-height:1.35;font-weight:400;letter-spacing:-.01em}.br30-legal-section h3{margin:22px 0 8px;color:var(--crm-text);font-size:14px;line-height:1.45;font-weight:400}.br30-legal-section p{margin:0 0 13px;color:var(--crm-muted);font-size:13px;line-height:1.85}.br30-legal-section p:last-child{margin-bottom:0}.br30-legal-section ul{margin:10px 0 17px;padding-left:20px}.br30-legal-section li{margin:7px 0;padding-left:2px;color:var(--crm-muted);font-size:13px;line-height:1.75}.br30-legal-section li::marker{color:var(--crm-primary)}.br30-legal-note{margin:18px 0;padding:14px 16px;border-left:3px solid var(--crm-primary);border-radius:0 9px 9px 0;background:var(--crm-surface-2);color:var(--crm-muted);font-size:13px;line-height:1.75}.br30-legal-note strong{color:var(--crm-text)}.br30-legal-contact-card{display:grid;grid-template-columns:auto 1fr;gap:12px;margin-top:18px;padding:17px;border:1px solid var(--crm-border);border-radius:11px;background:var(--crm-surface)}.br30-legal-contact-icon{width:36px;height:36px;display:grid;place-items:center;border-radius:9px;background:var(--crm-primary-soft);color:var(--crm-primary)}.br30-legal-contact-card strong{display:block;margin-bottom:4px;color:var(--crm-text);font-size:13px}.br30-legal-contact-card a{color:var(--crm-primary);font-size:13px;text-decoration:none}.br30-legal-contact-card a:hover{text-decoration:underline}.br30-legal-contact-card p{margin:0!important}.br30-legal-top-button{position:fixed;right:20px;bottom:20px;z-index:30;width:38px;height:38px;display:grid;place-items:center;border:1px solid var(--crm-border);border-radius:10px;background:var(--crm-surface);color:var(--crm-text);box-shadow:var(--crm-shadow);cursor:pointer;transition:.2s}.br30-legal-top-button:hover{border-color:var(--crm-primary);color:var(--crm-primary);transform:translateY(-2px)}@media(max-width:900px){.br30-legal-main{grid-template-columns:1fr;gap:25px}.br30-legal-sidebar{position:relative;top:auto;max-height:none}.br30-legal-sidebar-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:600px){.br30-legal-hero{padding:120px 17px 45px}.br30-legal-hero h1{font-size:34px}.br30-legal-hero-description{font-size:13px}.br30-legal-meta{display:grid;grid-template-columns:1fr}.br30-legal-main{padding:35px 17px 60px}.br30-legal-sidebar-list{grid-template-columns:1fr}.br30-legal-intro-card{padding:18px}.br30-legal-section{scroll-margin-top:90px;padding-bottom:32px;margin-bottom:32px}.br30-legal-section h2{font-size:18px}.br30-legal-section p,.br30-legal-section li{font-size:13px}.br30-legal-contact-card{grid-template-columns:1fr}.br30-legal-top-button{right:13px;bottom:13px}}`}</style>

      <LandingNavbar />

      <header className="br30-legal-hero">
        <div className="br30-legal-hero-inner">
          <div className="br30-legal-breadcrumb">
            <Link to="/">Home</Link>
            <ChevronRight size={13} />
            <span>Solutions</span>
            <ChevronRight size={13} />
            <span>Lead Management</span>
          </div>

          <div className="br30-legal-eyebrow">
            <span className="br30-legal-eyebrow-dot" />
            BR30 CRM Solutions
          </div>

          <h1>
            Lead <span>Management</span>
          </h1>

          <p className="br30-legal-hero-description">
            BR30 CRM Lead Management helps businesses capture, organize, qualify, assign, track, and convert leads through one connected workspace. Keep every opportunity visible, make follow-ups easier to manage, and give your team a clear view of the journey from first interaction to conversion.
          </p>

          <div className="br30-legal-meta">
            <div className="br30-legal-meta-item">
              <Target size={14} />
              <span>
                Solution <strong>Lead Management</strong>
              </span>
            </div>

            <div className="br30-legal-meta-item">
              <CheckCircle2 size={14} />
              <span>
                Workspace <strong>Unified CRM</strong>
              </span>
            </div>

            <div className="br30-legal-meta-item">
              <BarChart3 size={14} />
              <span>
                Focus <strong>Capture to Conversion</strong>
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
                <Target size={18} />
              </div>

              <div>
                <h2>Turn incoming opportunities into organized sales activity</h2>
                <p>
                  BR30 CRM gives your team a structured place to manage leads from the moment they enter your business through qualification, follow-up, pipeline movement, and conversion. Instead of relying on scattered spreadsheets, messages, notes, and disconnected tools, teams can keep lead
                  information and sales activity connected inside one CRM workspace.
                </p>
              </div>
            </div>
          </div>

          <section id="overview" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>01</span>
              Overview
            </div>

            <h2>A connected system for managing every lead</h2>

            <p>Lead management is the process of capturing potential customers, organizing their information, understanding their needs, assigning ownership, maintaining follow-ups, and moving qualified opportunities toward a successful outcome.</p>

            <p>BR30 CRM brings these activities together so teams can work from a shared view of their opportunities. Each lead can become part of a structured process rather than remaining as an isolated contact or an unfinished task.</p>

            <h3>Designed around the complete lead journey</h3>

            <ul>
              <li>Capture new leads from the channels used by your business.</li>
              <li>Store lead information in an organized CRM record.</li>
              <li>Identify important details needed for qualification.</li>
              <li>Assign ownership and responsibility to the appropriate team member.</li>
              <li>Track calls, meetings, tasks, notes, and other follow-up activities.</li>
              <li>Move leads through the appropriate stages of the sales process.</li>
              <li>Identify qualified opportunities and support conversion into customers or deals.</li>
              <li>Use reporting information to understand lead activity and performance.</li>
            </ul>

            <div className="br30-legal-note">
              <strong>Core idea:</strong> A lead should not disappear after the first interaction. BR30 CRM helps your team maintain context and continue the process until the lead reaches a defined outcome.
            </div>
          </section>

          <section id="lead-capture" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>02</span>
              Lead Capture
            </div>

            <h2>Bring new opportunities into one workspace</h2>

            <p>Every sales process starts with an opportunity. Leads may arrive through website inquiries, referrals, campaigns, phone calls, emails, events, existing relationships, or other business channels.</p>

            <p>BR30 CRM provides a structured place for teams to record and manage these opportunities so that important information is not left across disconnected systems.</p>

            <h3>Capture the information your team needs</h3>

            <ul>
              <li>Lead name and contact information.</li>
              <li>Company or organization details.</li>
              <li>Lead source and acquisition information.</li>
              <li>Business requirements and areas of interest.</li>
              <li>Notes from initial conversations.</li>
              <li>Assigned owner or responsible team member.</li>
              <li>Relevant tasks and next actions.</li>
              <li>Additional custom information required by your sales process.</li>
            </ul>

            <p>Centralizing lead information gives sales teams a more consistent starting point when they begin qualification and follow-up.</p>
          </section>

          <section id="lead-organization" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>03</span>
              Lead Organization
            </div>

            <h2>Keep lead records structured and accessible</h2>

            <p>As the number of opportunities grows, simply collecting leads is not enough. Teams need a consistent way to organize records, identify ownership, find information, and understand what needs attention.</p>

            <p>BR30 CRM allows lead information to remain connected to the wider customer relationship process. This helps teams avoid repeatedly searching through separate notes or communication channels for basic context.</p>

            <h3>Organized records support better daily workflows</h3>

            <ul>
              <li>Search and locate lead records quickly.</li>
              <li>Review relevant contact and company information.</li>
              <li>Understand the current stage of each opportunity.</li>
              <li>Review previous activities and notes.</li>
              <li>Identify the assigned team member.</li>
              <li>Track upcoming actions and follow-up requirements.</li>
            </ul>

            <div className="br30-legal-note">
              <strong>Consistency matters:</strong> A structured lead record makes it easier for different members of a team to understand the same opportunity without rebuilding its history from scratch.
            </div>
          </section>

          <section id="lead-qualification" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>04</span>
              Lead Qualification
            </div>

            <h2>Understand which opportunities need attention</h2>

            <p>Not every lead represents the same level of opportunity. Qualification helps teams understand whether a lead matches the products, services, customer profile, timing, requirements, or commercial conditions relevant to the business.</p>

            <h3>Qualification information can include</h3>

            <ul>
              <li>The lead's business or customer requirements.</li>
              <li>Products or services of interest.</li>
              <li>Expected timing or buying stage.</li>
              <li>Relevant business context.</li>
              <li>Budget or commercial considerations where applicable.</li>
              <li>Decision-making or stakeholder information.</li>
              <li>Previous conversations and responses.</li>
              <li>Specific next steps required before qualification is complete.</li>
            </ul>

            <p>Qualification should remain aligned with the actual sales process of the business. BR30 CRM provides the workspace for recording the information your team uses to make those operational decisions.</p>
          </section>

          <section id="lead-assignment" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>05</span>
              Lead Assignment
            </div>

            <h2>Give every opportunity clear ownership</h2>

            <p>Leads are easier to manage when responsibility is clear. Assigning a lead to an appropriate team member helps establish who is expected to review the opportunity, perform the next activity, communicate with the prospect, and move the record forward.</p>

            <h3>Clear ownership helps teams</h3>

            <ul>
              <li>Know who is responsible for each lead.</li>
              <li>Reduce confusion around follow-up ownership.</li>
              <li>Maintain accountability for next actions.</li>
              <li>Distribute opportunities across relevant team members.</li>
              <li>Provide managers with visibility into assigned work.</li>
            </ul>

            <p>Ownership can become especially important as teams grow, because a lead that has no clearly understood responsibility can easily become an overlooked opportunity.</p>
          </section>

          <section id="lead-follow-up" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>06</span>
              Follow-Ups & Activities
            </div>

            <h2>Keep conversations and next actions connected</h2>

            <p>Consistent follow-up is an important part of managing sales opportunities. BR30 CRM helps teams connect lead records with activities such as calls, meetings, tasks, notes, and other actions associated with the relationship.</p>

            <h3>Maintain a clear activity history</h3>

            <ul>
              <li>Record relevant interactions with a lead.</li>
              <li>Create tasks for future follow-ups.</li>
              <li>Maintain notes from conversations.</li>
              <li>Track important meetings and activities.</li>
              <li>Review previous interactions before contacting a lead again.</li>
              <li>Identify outstanding actions that still require attention.</li>
            </ul>

            <p>Keeping activity context with the lead record reduces the need to reconstruct the relationship from separate applications or personal notes.</p>

            <div className="br30-legal-note">
              <strong>Follow-up principle:</strong> The objective is not simply to create more activities. It is to make the next meaningful action visible and connected to the opportunity.
            </div>
          </section>

          <section id="lead-pipeline" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>07</span>
              Lead Pipeline
            </div>

            <h2>Visualize where opportunities stand</h2>

            <p>A pipeline gives teams a structured view of how leads progress through the sales process. Instead of treating every lead as having the same status, opportunities can be understood according to the stage they currently occupy.</p>

            <h3>Pipeline visibility can help teams understand</h3>

            <ul>
              <li>Which leads are newly received.</li>
              <li>Which opportunities are currently being qualified.</li>
              <li>Which leads require follow-up.</li>
              <li>Which opportunities have progressed into active sales conversations.</li>
              <li>Which leads are ready for conversion.</li>
              <li>Which opportunities have reached a closed or inactive outcome.</li>
            </ul>

            <p>Pipeline stages should reflect the actual workflow of the organization. BR30 CRM provides the framework for maintaining that process in a centralized workspace.</p>
          </section>

          <section id="lead-conversion" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>08</span>
              Lead Conversion
            </div>

            <h2>Move qualified opportunities into the next stage</h2>

            <p>A lead may eventually become a customer, contact, account, or active sales opportunity depending on the organization's workflow.</p>

            <p>Conversion represents an important transition because information collected during the lead stage should continue to support the relationship rather than being lost when the opportunity moves forward.</p>

            <h3>A structured conversion process helps preserve context</h3>

            <ul>
              <li>Carry relevant lead information into the next relationship stage.</li>
              <li>Maintain important notes and interaction history.</li>
              <li>Reduce unnecessary duplicate data entry.</li>
              <li>Connect qualified opportunities with the appropriate sales workflow.</li>
              <li>Give teams visibility into where converted opportunities originated.</li>
            </ul>
          </section>

          <section id="lead-scoring" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>09</span>
              Lead Prioritization
            </div>

            <h2>Focus attention where it is needed</h2>

            <p>Sales teams often manage many opportunities simultaneously. Prioritization helps them decide which leads require immediate attention and which can be handled later according to the organization's process.</p>

            <h3>Useful prioritization signals may include</h3>

            <ul>
              <li>Recent engagement or communication.</li>
              <li>Lead stage and current status.</li>
              <li>Customer requirements or expressed interest.</li>
              <li>Expected timing.</li>
              <li>Assigned owner.</li>
              <li>Upcoming tasks or overdue activities.</li>
              <li>Commercial importance or opportunity value where applicable.</li>
            </ul>

            <p>Prioritization should be based on the information available to the business and the process established by its sales team.</p>
          </section>

          <section id="lead-reporting" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>10</span>
              Lead Reporting
            </div>

            <h2>Turn lead activity into useful business visibility</h2>

            <p>Lead management becomes more useful when teams can understand what is happening across their pipeline. Reporting helps businesses review lead volume, movement, activity, sources, conversion activity, and other operational information available within their CRM.</p>

            <h3>Reporting can help teams review</h3>

            <ul>
              <li>Lead volume over selected periods.</li>
              <li>Lead sources and acquisition channels.</li>
              <li>Distribution of leads across stages.</li>
              <li>Assigned workload across team members.</li>
              <li>Follow-up activity and outstanding actions.</li>
              <li>Lead progression and conversion activity.</li>
              <li>Patterns that may require operational attention.</li>
            </ul>

            <div className="br30-legal-note">
              <strong>Operational visibility:</strong> Reports are most useful when they help teams understand what is happening and support practical decisions about processes, workload, and follow-up.
            </div>
          </section>

          <section id="team-collaboration" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>11</span>
              Team Collaboration
            </div>

            <h2>Give teams shared context around opportunities</h2>

            <p>Lead management is rarely an individual activity. Sales representatives, managers, support teams, marketing teams, and other business users may need access to different parts of the lead journey.</p>

            <p>BR30 CRM provides a shared workspace where authorized team members can work around the same customer and opportunity information according to the access and workflow structure established by the organization.</p>

            <h3>Shared visibility can support</h3>

            <ul>
              <li>Better handoffs between team members.</li>
              <li>More consistent customer context.</li>
              <li>Visibility into ownership and activity.</li>
              <li>Managerial review of pipeline activity.</li>
              <li>Reduced duplication of work.</li>
              <li>More organized collaboration around active opportunities.</li>
            </ul>
          </section>

          <section id="data-management" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>12</span>
              Lead Data Management
            </div>

            <h2>Maintain clean and useful lead information</h2>

            <p>The quality of lead management depends heavily on the quality of the information stored in the CRM. Incomplete, duplicated, outdated, or inconsistent records can make otherwise useful workflows harder to manage.</p>

            <h3>Good lead data practices include</h3>

            <ul>
              <li>Keeping contact details accurate and current.</li>
              <li>Using consistent information formats where practical.</li>
              <li>Recording meaningful notes instead of relying on memory.</li>
              <li>Updating lead stages as opportunities progress.</li>
              <li>Closing or updating stale opportunities appropriately.</li>
              <li>Removing unnecessary duplicate records according to organizational procedures.</li>
              <li>Applying appropriate access controls to sensitive business information.</li>
            </ul>

            <p>Businesses should establish internal data-management practices that reflect their operational requirements and applicable obligations.</p>
          </section>

          <section id="security-access" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>13</span>
              Security & Access
            </div>

            <h2>Keep lead information available to the right people</h2>

            <p>Lead records can contain personal information, business information, commercial discussions, and other information that may require controlled access.</p>

            <p>BR30 CRM supports structured account and access mechanisms intended to help organizations manage who can access information within their workspace.</p>

            <h3>Organizations should consider</h3>

            <ul>
              <li>Assigning appropriate roles and permissions.</li>
              <li>Removing access when users no longer require it.</li>
              <li>Protecting account credentials.</li>
              <li>Reviewing access to sensitive business information.</li>
              <li>Following internal security procedures for CRM usage.</li>
            </ul>

            <div className="br30-legal-note">
              <strong>Important:</strong> No software system can eliminate every security risk. Organizations and users should also protect their devices, credentials, accounts, and business information.
            </div>
          </section>

          <section id="best-practices" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>14</span>
              Best Practices
            </div>

            <h2>Build a consistent lead-management process</h2>

            <p>Technology works best when it is supported by a clear operational process. Businesses using BR30 CRM can establish internal rules for how leads are captured, qualified, assigned, followed up, progressed, and converted.</p>

            <h3>Recommended workflow principles</h3>

            <ul>
              <li>Define clear lead stages that match your sales process.</li>
              <li>Make ownership explicit for every active lead.</li>
              <li>Record important interactions consistently.</li>
              <li>Set clear expectations for follow-up timing.</li>
              <li>Keep lead information complete and accurate.</li>
              <li>Review inactive and aging leads regularly.</li>
              <li>Use reports to identify process bottlenecks.</li>
              <li>Keep team members aligned around common CRM practices.</li>
              <li>Review permissions and access periodically.</li>
            </ul>

            <p>A consistent process allows the CRM to become more than a database. It becomes a shared operating workspace for managing the movement of opportunities through the business.</p>
          </section>

          <section id="contact" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>15</span>
              Contact Us
            </div>

            <h2>Questions about Lead Management?</h2>

            <p>If you have questions about BR30 CRM Lead Management, CRM workflows, lead organization, or how the platform can support your business process, contact the BR30 CRM support team.</p>

            <div className="br30-legal-contact-card">
              <div className="br30-legal-contact-icon">
                <Mail size={16} />
              </div>

              <div>
                <strong>BR30 CRM Support</strong>

                <a href={SOLUTIONS_LEAD_MANAGEMENT_SUPPORT_FORM_URL} className="br30-support-ticket-link" rel="noopener noreferrer">
                  Create Support Ticket
                </a>
              </div>
            </div>

            <div className="br30-legal-contact-card">
              <div className="br30-legal-contact-icon">
                <UsersRound size={16} />
              </div>

              <div>
                <strong>BR30 CRM</strong>

                <p>For account-specific questions, please contact us using the email address associated with your BR30 CRM account whenever possible so that the appropriate context can be reviewed.</p>
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

export default LeadManagement;
