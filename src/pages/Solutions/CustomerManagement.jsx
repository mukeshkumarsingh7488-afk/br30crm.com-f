import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUp, BarChart3, CheckCircle2, ChevronRight, CircleUserRound, Database, FileText, Headphones, Mail, ShieldCheck, UsersRound } from "lucide-react";
import LandingNavbar from "../../components/landing/LandingNavbar";
import LandingFooter from "../../components/landing/LandingFooter";

function CustomerManagement() {
  const [activeSection, setActiveSection] = useState("overview");

  const sections = [
    { id: "overview", number: "01", title: "Overview" },
    { id: "customer-profiles", number: "02", title: "Customer Profiles" },
    { id: "customer-data", number: "03", title: "Customer Data" },
    { id: "customer-history", number: "04", title: "Customer History" },
    { id: "communication", number: "05", title: "Communication" },
    { id: "follow-ups", number: "06", title: "Follow-Ups & Activities" },
    { id: "segmentation", number: "07", title: "Customer Segmentation" },
    { id: "team-collaboration", number: "08", title: "Team Collaboration" },
    { id: "customer-support", number: "09", title: "Customer Support" },
    { id: "reporting", number: "10", title: "Customer Insights" },
    { id: "security", number: "11", title: "Data & Security" },
    { id: "best-practices", number: "12", title: "Best Practices" },
    { id: "business-value", number: "13", title: "Business Value" },
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
            <span>Customer Management</span>
          </div>

          <div className="br30-legal-eyebrow">
            <span className="br30-legal-eyebrow-dot" />
            BR30 CRM Solutions
          </div>

          <h1>
            Customer <span>Management</span>
          </h1>

          <p className="br30-legal-hero-description">
            BR30 CRM Customer Management gives businesses a centralized workspace to organize customer information, understand relationships, coordinate teams, manage interactions, and build consistent customer experiences from the first conversation through long-term retention.
          </p>

          <div className="br30-legal-meta">
            <div className="br30-legal-meta-item">
              <UsersRound size={14} />
              <span>
                Solution <strong>Customer Management</strong>
              </span>
            </div>

            <div className="br30-legal-meta-item">
              <ShieldCheck size={14} />
              <span>
                Built For <strong>Modern Businesses</strong>
              </span>
            </div>

            <div className="br30-legal-meta-item">
              <FileText size={14} />
              <span>
                BR30 CRM <strong>All-in-One Platform</strong>
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
                <CircleUserRound size={18} />
              </div>

              <div>
                <h2>Build stronger customer relationships from one workspace</h2>

                <p>BR30 CRM brings customer records, communication history, activities, follow-ups, business context, and team collaboration into one connected system so your team can spend less time searching for information and more time building meaningful customer relationships.</p>
              </div>
            </div>
          </div>

          <section id="overview" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>01</span>
              Overview
            </div>

            <h2>A complete workspace for customer relationships</h2>

            <p>
              Customer relationships are often spread across spreadsheets, email conversations, messaging applications, documents, call records, and individual team members. This makes it difficult to understand the complete history of a customer and can create unnecessary delays in follow-ups and
              decision-making.
            </p>

            <p>BR30 CRM brings these relationship details together in a structured customer workspace. Teams can maintain customer records, track interactions, manage activities, review history, and keep important business information connected to the right customer.</p>

            <p>The goal is not simply to store contact information. Customer Management is designed to provide the context teams need to understand who a customer is, what they need, what has already happened, and what should happen next.</p>

            <div className="br30-legal-note">
              <strong>Core idea:</strong> Every customer should have a clear, organized, and accessible relationship history that authorized team members can understand without relying on scattered information.
            </div>
          </section>

          <section id="customer-profiles" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>02</span>
              Customer Profiles
            </div>

            <h2>Maintain complete customer profiles</h2>

            <p>BR30 CRM allows businesses to maintain structured customer profiles containing the information required to understand and manage ongoing relationships.</p>

            <h3>Centralized customer information</h3>

            <ul>
              <li>Customer names and contact information.</li>
              <li>Company and organization details.</li>
              <li>Customer type and relationship information.</li>
              <li>Assigned team members and ownership details.</li>
              <li>Relevant notes and business context.</li>
              <li>Relationship history and associated activities.</li>
            </ul>

            <h3>Consistent customer records</h3>

            <p>A structured profile helps teams maintain consistent information instead of keeping separate customer records across multiple tools. Authorized users can work from the same customer context and reduce unnecessary duplication.</p>

            <p>Customer profiles can also serve as the starting point for connected CRM workflows such as activities, opportunities, tasks, communication, reporting, and other business operations supported by BR30 CRM.</p>
          </section>

          <section id="customer-data" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>03</span>
              Customer Data
            </div>

            <h2>Keep customer data organized and useful</h2>

            <p>Customer data becomes more valuable when it is organized around the relationship rather than stored as isolated fields. BR30 CRM is designed to help teams keep relevant information connected to the customer record.</p>

            <h3>Structured information</h3>

            <p>
              Businesses can organize customer information into meaningful records that support day-to-day operations. This can include contact details, company information, notes, activities, relationship status, assigned ownership, and other information relevant to the organization's workflow.
            </p>

            <h3>Business context</h3>

            <p>A customer record can provide the surrounding context required by sales, support, operations, and management teams. Instead of viewing a customer as a single contact entry, teams can understand the broader relationship and the activity associated with it.</p>

            <div className="br30-legal-note">
              <strong>Good practice:</strong> Keep customer records accurate, relevant, and up to date. Avoid storing unnecessary information and apply appropriate access controls according to your organization's responsibilities.
            </div>
          </section>

          <section id="customer-history" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>04</span>
              Customer History
            </div>

            <h2>Understand the complete relationship history</h2>

            <p>A customer interaction rarely exists in isolation. Previous calls, meetings, notes, follow-ups, tasks, and business conversations can all provide important context for the next interaction.</p>

            <p>BR30 CRM helps teams keep relevant relationship activity connected to customer records so that authorized users can review what has already happened before taking the next action.</p>

            <h3>Relationship context</h3>

            <ul>
              <li>Review previous customer interactions.</li>
              <li>Understand recent activities and follow-ups.</li>
              <li>Track important customer notes.</li>
              <li>Identify outstanding actions.</li>
              <li>Maintain continuity when responsibility changes between team members.</li>
            </ul>

            <p>This continuity can be especially useful when multiple employees work with the same customer or when a customer relationship continues over a long period.</p>
          </section>

          <section id="communication" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>05</span>
              Communication
            </div>

            <h2>Keep customer communication connected</h2>

            <p>Effective customer management depends on timely and consistent communication. BR30 CRM is designed to provide a structured place for teams to manage the customer context associated with their communications and interactions.</p>

            <h3>Communication context</h3>

            <p>Teams can use customer records and associated activity information to understand the purpose of previous conversations, current requirements, pending actions, and important relationship details.</p>

            <h3>Better internal continuity</h3>

            <p>When customer context is accessible to authorized team members, businesses can reduce dependency on individual employees remembering every detail of a relationship. This helps create a more consistent internal workflow when responsibilities change.</p>

            <div className="br30-legal-note">
              <strong>Customer experience:</strong> Consistent access to relevant context can help teams avoid repeatedly asking customers for information they have already provided.
            </div>
          </section>

          <section id="follow-ups" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>06</span>
              Follow-Ups & Activities
            </div>

            <h2>Make sure important customer actions are not forgotten</h2>

            <p>Customer management does not end after an interaction. Follow-ups, meetings, calls, tasks, reminders, and other activities often determine whether a relationship continues to move forward.</p>

            <h3>Organized activities</h3>

            <ul>
              <li>Record customer-related tasks and activities.</li>
              <li>Track pending follow-ups.</li>
              <li>Coordinate important customer actions.</li>
              <li>Maintain visibility of upcoming work.</li>
              <li>Connect activities with the relevant customer context.</li>
            </ul>

            <p>By connecting activities to customer records, teams can work from a relationship-centered view rather than maintaining disconnected personal reminders and spreadsheets.</p>
          </section>

          <section id="segmentation" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>07</span>
              Customer Segmentation
            </div>

            <h2>Organize customers around meaningful business groups</h2>

            <p>Different customers can have different needs, values, stages, priorities, and engagement patterns. Customer segmentation helps businesses organize their customer base into groups that make operational sense.</p>

            <h3>Useful segmentation approaches</h3>

            <ul>
              <li>Customer type or account category.</li>
              <li>Industry or business segment.</li>
              <li>Relationship stage.</li>
              <li>Customer ownership or responsible team.</li>
              <li>Business priority.</li>
              <li>Engagement or activity status.</li>
            </ul>

            <p>Segmentation can support more focused workflows, clearer reporting, and better organization of customer-related activities.</p>
          </section>

          <section id="team-collaboration" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>08</span>
              Team Collaboration
            </div>

            <h2>Give teams a shared customer view</h2>

            <p>Customer relationships frequently involve more than one person. Sales representatives, managers, support teams, account owners, and operational staff may all interact with the same customer at different stages.</p>

            <p>BR30 CRM helps organizations establish a shared customer workspace where authorized users can access relevant information and coordinate customer-related work according to their roles and permissions.</p>

            <h3>Connected teamwork</h3>

            <ul>
              <li>Maintain shared customer context.</li>
              <li>Coordinate ownership and responsibilities.</li>
              <li>Reduce duplicated customer work.</li>
              <li>Improve handoffs between teams.</li>
              <li>Keep important relationship information accessible to authorized users.</li>
            </ul>

            <div className="br30-legal-note">
              <strong>Operational advantage:</strong> A shared customer view can reduce information gaps when multiple teams contribute to the same customer relationship.
            </div>
          </section>

          <section id="customer-support" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>09</span>
              Customer Support
            </div>

            <h2>Support customers with better context</h2>

            <p>Customer support becomes more effective when support teams can understand the relationship and relevant history before responding to a request.</p>

            <p>BR30 CRM can provide a central customer context that helps authorized teams understand previous activities, customer information, notes, ownership, and related business interactions.</p>

            <h3>Support workflow benefits</h3>

            <ul>
              <li>Identify the customer quickly.</li>
              <li>Review relevant customer information.</li>
              <li>Understand previous interactions.</li>
              <li>Coordinate follow-up actions.</li>
              <li>Maintain continuity across support interactions.</li>
            </ul>

            <p>This structure helps businesses create a more organized support workflow without forcing every team member to reconstruct the customer's history manually.</p>
          </section>

          <section id="reporting" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>10</span>
              Customer Insights
            </div>

            <h2>Turn customer activity into useful business insight</h2>

            <p>Customer records are valuable not only for individual interactions but also for understanding broader business activity. Structured customer information can support reporting and operational analysis.</p>

            <h3>Customer-related insights</h3>

            <ul>
              <li>Understand customer activity levels.</li>
              <li>Review relationship trends.</li>
              <li>Identify areas requiring follow-up.</li>
              <li>Understand workload across customer-facing teams.</li>
              <li>Connect customer information with broader CRM reporting.</li>
            </ul>

            <p>Managers can use organized customer information as part of their broader operational decision-making process, subject to the data available and the reporting capabilities configured in their BR30 CRM environment.</p>
          </section>

          <section id="security" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>11</span>
              Data & Security
            </div>

            <h2>Protect customer information through responsible access</h2>

            <p>Customer records can contain sensitive business and personal information. Businesses should therefore establish appropriate access controls and operational practices when using any CRM platform.</p>

            <h3>Access management</h3>

            <ul>
              <li>Provide access according to job responsibilities.</li>
              <li>Review user permissions regularly.</li>
              <li>Remove access when responsibilities change.</li>
              <li>Protect account credentials and authentication information.</li>
              <li>Avoid unnecessary storage of sensitive information.</li>
            </ul>

            <p>BR30 CRM provides platform-level functionality intended to support controlled access and responsible management of business information. Customers remain responsible for configuring their organization and users appropriately.</p>

            <div className="br30-legal-note">
              <strong>Security principle:</strong> Customer information should only be accessible to people who require it for legitimate business responsibilities.
            </div>
          </section>

          <section id="best-practices" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>12</span>
              Best Practices
            </div>

            <h2>Build a reliable customer management process</h2>

            <p>Technology works best when supported by clear internal processes. Businesses can improve the value of customer management by establishing consistent practices across their teams.</p>

            <h3>Recommended operational practices</h3>

            <ul>
              <li>Keep customer records accurate and current.</li>
              <li>Use consistent naming and data-entry conventions.</li>
              <li>Record important customer interactions promptly.</li>
              <li>Assign clear ownership for customer relationships.</li>
              <li>Define follow-up responsibilities.</li>
              <li>Review inactive or outdated customer records.</li>
              <li>Train team members on the organization's CRM process.</li>
              <li>Regularly review permissions and access levels.</li>
            </ul>

            <p>These practices can help ensure that the CRM remains a reliable source of customer information rather than becoming another disconnected database.</p>
          </section>

          <section id="business-value" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>13</span>
              Business Value
            </div>

            <h2>Create a more connected customer operation</h2>

            <p>A well-organized customer management process can influence multiple parts of a business. When customer information is centralized and accessible to authorized teams, businesses can establish clearer workflows around relationships and follow-up activities.</p>

            <h3>Areas supported by customer management</h3>

            <ul>
              <li>Improved visibility into customer relationships.</li>
              <li>More consistent customer follow-up.</li>
              <li>Better internal coordination.</li>
              <li>Reduced dependency on scattered records.</li>
              <li>Clearer ownership of customer relationships.</li>
              <li>More structured customer reporting.</li>
              <li>Better continuity across teams.</li>
            </ul>

            <p>Customer Management therefore forms an important part of the broader BR30 CRM platform and can connect naturally with sales, lead management, reporting, activities, team operations, and other CRM workflows.</p>
          </section>

          <section id="getting-started" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>14</span>
              Getting Started
            </div>

            <h2>Start building a structured customer workspace</h2>

            <p>Businesses can begin by establishing a consistent customer record structure and deciding which information is important for their daily operations. From there, teams can define ownership, activities, follow-ups, access permissions, and reporting requirements.</p>

            <h3>A practical starting process</h3>

            <ul>
              <li>Define the customer information your organization needs.</li>
              <li>Import or create customer records using consistent information.</li>
              <li>Assign appropriate customer ownership.</li>
              <li>Establish activity and follow-up practices.</li>
              <li>Configure access according to team responsibilities.</li>
              <li>Review customer data quality regularly.</li>
              <li>Connect customer management with the rest of your CRM workflow.</li>
            </ul>

            <p>As your organization grows, the same customer management foundation can support additional workflows and teams within the broader BR30 CRM environment.</p>

            <div className="br30-legal-note">
              <strong>Built for growth:</strong> BR30 CRM Customer Management is designed as part of an all-in-one CRM environment so customer information can remain connected to the wider business workflow.
            </div>
          </section>

          <section id="contact" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>15</span>
              Contact Us
            </div>

            <h2>Questions about Customer Management?</h2>

            <p>If you have questions about BR30 CRM Customer Management, account setup, workflows, customer records, permissions, or other platform capabilities, our support team can help you understand the available options.</p>

            <div className="br30-legal-contact-card">
              <div className="br30-legal-contact-icon">
                <Mail size={16} />
              </div>

              <div>
                <strong>BR30 CRM Support</strong>

                <a
                  href="https://br30crm-com-f.vercel.app/public/forms/6ac4a4ce8ab8658ebe3748f7/br30-crm-solutions-support-ticket?utm_source=br30crm-solutions-customer-management&utm_medium=website&lead_source=br30crm-solutions-customer-management&form_id=6ac2f06f45d94386aa073fc0&source_id=6ac2f16345d94386aa073fc2"
                  className="br30-support-ticket-link"
                  rel="noopener noreferrer">
                  Create Support Ticket
                </a>
              </div>
            </div>

            <div className="br30-legal-contact-card">
              <div className="br30-legal-contact-icon">
                <Headphones size={16} />
              </div>

              <div>
                <strong>BR30 CRM</strong>

                <p>For account-specific questions or customer data requests, please contact us using the email address associated with your BR30 CRM account whenever possible.</p>
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

export default CustomerManagement;
