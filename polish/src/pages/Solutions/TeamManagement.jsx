import { SOLUTIONS_TEAM_MANAGEMENT_SUPPORT_FORM_URL } from "../../constants/supportForm";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUp, BriefcaseBusiness, Building2, CheckCircle2, ChevronRight, FileText, Mail, ShieldCheck, UserCheck, UsersRound } from "lucide-react";
import LandingNavbar from "../../components/landing/LandingNavbar";
import LandingFooter from "../../components/landing/LandingFooter";

function TeamManagement() {
  const [activeSection, setActiveSection] = useState("overview");

  const sections = [
    { id: "overview", number: "01", title: "Overview" },
    { id: "team-workspace", number: "02", title: "Team Workspace" },
    { id: "roles-permissions", number: "03", title: "Roles & Permissions" },
    { id: "user-management", number: "04", title: "User Management" },
    { id: "team-collaboration", number: "05", title: "Team Collaboration" },
    { id: "tasks-activities", number: "06", title: "Tasks & Activities" },
    { id: "ownership-assignment", number: "07", title: "Ownership & Assignment" },
    { id: "access-control", number: "08", title: "Access Control" },
    { id: "team-performance", number: "09", title: "Team Performance" },
    { id: "communication", number: "10", title: "Communication" },
    { id: "security", number: "11", title: "Team Security" },
    { id: "best-practices", number: "12", title: "Best Practices" },
    { id: "scaling-teams", number: "13", title: "Scaling Teams" },
    { id: "getting-started", number: "14", title: "Getting Started" },
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
            <span>Team Management</span>
          </div>

          <div className="br30-legal-eyebrow">
            <span className="br30-legal-eyebrow-dot" />
            BR30 CRM Solutions
          </div>

          <h1>
            Team <span>Management</span>
          </h1>

          <p className="br30-legal-hero-description">
            Build a connected team workspace where people, responsibilities, activities, permissions, and business priorities stay organized in one place. BR30 CRM helps teams coordinate customer-facing work, maintain accountability, and keep everyday operations aligned.
          </p>

          <div className="br30-legal-meta">
            <div className="br30-legal-meta-item">
              <UsersRound size={14} />
              <span>
                Solution <strong>Team Operations</strong>
              </span>
            </div>

            <div className="br30-legal-meta-item">
              <ShieldCheck size={14} />
              <span>
                Workspace <strong>Role-Based</strong>
              </span>
            </div>

            <div className="br30-legal-meta-item">
              <FileText size={14} />
              <span>
                Platform <strong>BR30 CRM</strong>
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
                <UsersRound size={18} />
              </div>

              <div>
                <h2>Keep your team aligned around the work that matters</h2>

                <p>
                  BR30 CRM Team Management provides a structured workspace for organizing people, responsibilities, access, activities, ownership, and collaboration. The goal is to give teams a clear operating environment without forcing customer and business information across disconnected systems.
                </p>
              </div>
            </div>
          </div>

          <section id="overview" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>01</span>
              Overview
            </div>

            <h2>A centralized workspace for modern teams</h2>

            <p>Team Management in BR30 CRM is designed to bring the people responsible for customer relationships, sales activities, follow-ups, operations, and business processes into one coordinated workspace.</p>

            <p>Instead of relying on disconnected spreadsheets, personal notes, isolated task lists, or informal communication, teams can organize responsibilities and business activities around shared CRM records.</p>

            <p>The workspace can help managers understand who is responsible for particular customers, leads, deals, activities, and tasks while allowing team members to focus on the work assigned to them.</p>

            <div className="br30-legal-note">
              <strong>Core principle:</strong> Team Management is about creating clarity around people, ownership, access, and accountability so that business work remains organized as the team grows.
            </div>
          </section>

          <section id="team-workspace" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>02</span>
              Team Workspace
            </div>

            <h2>One workspace for people and daily operations</h2>

            <p>A shared workspace gives teams a common environment for handling customer-facing and operational work. Team members can work with the same business records while following the permissions and responsibilities established by the organization.</p>

            <h3>Shared visibility</h3>

            <p>Teams can organize relevant customers, leads, contacts, deals, activities, and tasks so that important information is easier to locate and understand.</p>

            <h3>Personal responsibility</h3>

            <p>Shared visibility does not mean every user needs unrestricted access. Team members can work within the areas and records that are relevant to their responsibilities.</p>

            <h3>Operational consistency</h3>

            <p>A common CRM workspace helps teams follow consistent processes for entering information, updating records, completing tasks, and progressing business opportunities.</p>

            <ul>
              <li>Centralized team workspace.</li>
              <li>Shared business context.</li>
              <li>Clear user responsibilities.</li>
              <li>Organized customer-facing activities.</li>
              <li>Consistent operational workflows.</li>
            </ul>
          </section>

          <section id="roles-permissions" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>03</span>
              Roles & Permissions
            </div>

            <h2>Define access according to responsibilities</h2>

            <p>Different members of an organization may need different levels of access. Team Management supports a structured approach where permissions can be aligned with the responsibilities assigned to each role.</p>

            <h3>Administrative responsibilities</h3>

            <p>Administrators can be responsible for managing users, workspace configuration, permissions, and other organization-level controls.</p>

            <h3>Manager responsibilities</h3>

            <p>Managers may need visibility across teams, customers, leads, activities, and performance information to coordinate work and support their teams.</p>

            <h3>Team member responsibilities</h3>

            <p>Individual users can focus on the records, activities, tasks, and customer relationships associated with their assigned work.</p>

            <div className="br30-legal-note">
              <strong>Access principle:</strong> Organizations should provide users with the level of access necessary for their responsibilities while avoiding unnecessary privileges.
            </div>
          </section>

          <section id="user-management" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>04</span>
              User Management
            </div>

            <h2>Manage the people who work inside your CRM</h2>

            <p>As teams grow, maintaining an accurate user list becomes increasingly important. Team Management provides a structured approach to organizing the people who use the BR30 CRM workspace.</p>

            <h3>User onboarding</h3>

            <p>New team members can be introduced to the workspace with the appropriate account information, role, permissions, and responsibilities.</p>

            <h3>User changes</h3>

            <p>Organizations may need to update user roles, responsibilities, access levels, or team assignments when people move between departments or take on new responsibilities.</p>

            <h3>User lifecycle</h3>

            <p>User management should also account for employees or collaborators who leave the organization or no longer require access to business systems.</p>

            <ul>
              <li>Add and organize team members.</li>
              <li>Assign appropriate roles.</li>
              <li>Update responsibilities when needed.</li>
              <li>Review access regularly.</li>
              <li>Remove or restrict unnecessary access.</li>
            </ul>
          </section>

          <section id="team-collaboration" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>05</span>
              Team Collaboration
            </div>

            <h2>Keep customer work connected across the team</h2>

            <p>Customer relationships often involve more than one person. Effective collaboration requires team members to understand what has happened previously and what needs to happen next.</p>

            <p>BR30 CRM can provide a shared context around customer records, activities, tasks, notes, leads, and deals so that team members can coordinate without repeatedly rebuilding the same context.</p>

            <h3>Shared customer context</h3>

            <p>Relevant information can remain associated with the appropriate CRM records, helping authorized team members understand the history and current state of a relationship.</p>

            <h3>Handoffs</h3>

            <p>When responsibility moves from one team member to another, organized records and activities can make the transition easier to understand and manage.</p>
          </section>

          <section id="tasks-activities" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>06</span>
              Tasks & Activities
            </div>

            <h2>Turn responsibilities into visible actions</h2>

            <p>Teams often lose momentum when responsibilities exist only in conversations or personal reminders. Tasks and activities make important follow-ups more visible and easier to coordinate.</p>

            <h3>Task organization</h3>

            <p>Users can structure work around specific activities and responsibilities rather than relying entirely on memory or informal communication.</p>

            <h3>Follow-up management</h3>

            <p>Customer calls, meetings, follow-ups, reviews, and other activities can be connected to the relevant business context.</p>

            <ul>
              <li>Customer follow-ups.</li>
              <li>Sales activities.</li>
              <li>Internal tasks.</li>
              <li>Meetings and calls.</li>
              <li>Operational reminders.</li>
              <li>Record-specific activities.</li>
            </ul>
          </section>

          <section id="ownership-assignment" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>07</span>
              Ownership & Assignment
            </div>

            <h2>Make responsibility clear</h2>

            <p>Clear ownership is one of the foundations of accountable team operations. When a lead, customer, deal, task, or activity has a responsible person, teams can more easily understand who is expected to take action.</p>

            <h3>Record ownership</h3>

            <p>Organizations can structure their workflows around assigned owners for relevant CRM records.</p>

            <h3>Task assignment</h3>

            <p>Work can be assigned to the appropriate team member based on responsibilities, expertise, availability, or business process.</p>

            <h3>Management visibility</h3>

            <p>Managers can use ownership information to understand how work is distributed and where additional coordination may be required.</p>

            <div className="br30-legal-note">
              <strong>Accountability:</strong> Clear ownership reduces ambiguity around who is responsible for the next action.
            </div>
          </section>

          <section id="access-control" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>08</span>
              Access Control
            </div>

            <h2>Control access to business information</h2>

            <p>Business information should be available to the people who need it while remaining appropriately restricted from users who do not require access.</p>

            <p>Access control can be structured around roles, responsibilities, teams, and organizational requirements. The exact configuration may vary depending on how an organization operates.</p>

            <h3>Access review</h3>

            <p>Organizations should periodically review user access to confirm that permissions remain appropriate as responsibilities change.</p>

            <h3>Least-privilege approach</h3>

            <p>Where practical, users should receive only the permissions necessary to perform their assigned responsibilities.</p>
          </section>

          <section id="team-performance" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>09</span>
              Team Performance
            </div>

            <h2>Understand how work is progressing</h2>

            <p>Team performance is not limited to a single number. Managers may need to understand workload, activity levels, follow-ups, pipeline movement, task completion, and customer-facing work.</p>

            <p>BR30 CRM can bring relevant operational information together so that managers can review team activity using the information available within their workspace.</p>

            <h3>Activity visibility</h3>

            <p>Reviewing activities can help teams understand whether planned customer and business actions are being completed.</p>

            <h3>Workload awareness</h3>

            <p>Assignment and ownership information can help managers identify uneven workloads and coordinate resources where appropriate.</p>

            <h3>Operational review</h3>

            <p>Teams can use CRM information during regular reviews to identify pending work, follow-ups, stalled activities, and areas requiring attention.</p>
          </section>

          <section id="communication" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>10</span>
              Communication
            </div>

            <h2>Keep important business context connected</h2>

            <p>Effective communication is easier when conversations and actions are connected to the business records they relate to.</p>

            <p>Rather than separating customer context from internal responsibilities, teams can organize relevant notes, activities, tasks, and records around the appropriate customer or business relationship.</p>

            <h3>Internal coordination</h3>

            <p>Team members can use shared CRM context to understand the status of work and coordinate next steps.</p>

            <h3>Customer continuity</h3>

            <p>When multiple employees interact with the same customer, organized records can help maintain continuity between interactions.</p>

            <h3>Operational clarity</h3>

            <p>Structured information reduces the need to repeatedly ask other team members for basic context that is already available in the CRM.</p>
          </section>

          <section id="security" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>11</span>
              Team Security
            </div>

            <h2>Build security into everyday team operations</h2>

            <p>Team security involves more than technical infrastructure. Organizations should also establish sensible practices for accounts, permissions, credentials, and access to business information.</p>

            <ul>
              <li>Use strong and unique account credentials.</li>
              <li>Do not share passwords between team members.</li>
              <li>Review user permissions regularly.</li>
              <li>Remove unnecessary access promptly.</li>
              <li>Use appropriate role-based permissions.</li>
              <li>Protect devices used to access business systems.</li>
              <li>Review unusual or unauthorized account activity.</li>
            </ul>

            <div className="br30-legal-note">
              <strong>Security responsibility:</strong> CRM controls and organizational security practices work together. Users and administrators should both take reasonable steps to protect business information.
            </div>
          </section>

          <section id="best-practices" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>12</span>
              Best Practices
            </div>

            <h2>Practical principles for effective team management</h2>

            <p>A CRM becomes more useful when teams establish simple, repeatable operating practices. The following principles can help organizations maintain a clean and dependable workspace.</p>

            <h3>Keep records current</h3>

            <p>Encourage users to update relevant customer, lead, deal, task, and activity information as work progresses.</p>

            <h3>Define ownership clearly</h3>

            <p>Every important workflow should have an understandable owner or responsible team so that work does not become ambiguous.</p>

            <h3>Review permissions</h3>

            <p>Access should be reviewed when employees change roles, teams, responsibilities, or employment status.</p>

            <h3>Use consistent processes</h3>

            <p>Establish common conventions for naming, updating, assigning, and completing CRM records.</p>

            <h3>Review operational data</h3>

            <p>Managers should periodically review team activities, pending work, assignments, and pipeline information to maintain operational visibility.</p>
          </section>

          <section id="scaling-teams" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>13</span>
              Scaling Teams
            </div>

            <h2>Grow without losing operational structure</h2>

            <p>As an organization grows, informal processes that worked for a small team can become difficult to maintain. More users, customers, leads, deals, and activities create a greater need for clear structure.</p>

            <p>Team Management provides a foundation for organizing users and responsibilities as the organization expands.</p>

            <h3>Growing user groups</h3>

            <p>New employees can be introduced into established roles, responsibilities, and workflows instead of creating entirely new processes for every person.</p>

            <h3>Department coordination</h3>

            <p>Different teams can work within the same broader CRM environment while maintaining appropriate responsibilities and access.</p>

            <h3>Process consistency</h3>

            <p>Standardized workflows help organizations maintain predictable operating practices as more people become involved in customer and business operations.</p>
          </section>

          <section id="getting-started" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>14</span>
              Getting Started
            </div>

            <h2>Build your team workspace step by step</h2>

            <p>Organizations can introduce Team Management gradually. A clear starting structure can make it easier for users to understand their responsibilities and use the CRM consistently.</p>

            <ul>
              <li>Identify the people who need CRM access.</li>
              <li>Define the responsibilities of each role.</li>
              <li>Configure appropriate permissions.</li>
              <li>Organize users according to business workflows.</li>
              <li>Define ownership rules for important records.</li>
              <li>Establish task and follow-up practices.</li>
              <li>Train team members on the expected workflow.</li>
              <li>Review access and operational performance regularly.</li>
            </ul>

            <p>The objective is not simply to add users to a system. The objective is to create a reliable operating environment where every person understands what they are responsible for and how their work connects with the wider organization.</p>

            <div className="br30-legal-note">
              <strong>BR30 CRM approach:</strong> Connect people, records, responsibilities, activities, and business processes in one organized workspace.
            </div>
          </section>

          <section id="contact" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>15</span>
              Contact Us
            </div>

            <h2>Questions about Team Management?</h2>

            <p>If you need information about BR30 CRM Team Management, workspace configuration, user roles, permissions, collaboration, or other business operations, contact the BR30 CRM support team.</p>

            <div className="br30-legal-contact-card">
              <div className="br30-legal-contact-icon">
                <Mail size={16} />
              </div>

              <div>
                <strong>BR30 CRM Support</strong>

                <a href={SOLUTIONS_TEAM_MANAGEMENT_SUPPORT_FORM_URL} className="br30-support-ticket-link" target="_blank" rel="noopener noreferrer">
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

                <p>For account-specific questions, user access requests, permissions, or workspace configuration, please contact us using the email address associated with your BR30 CRM account whenever possible.</p>
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

export default TeamManagement;
