import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUp, ChevronRight, Globe2, Layers3, Network, ShieldCheck, Users } from "lucide-react";
import LandingNavbar from "../../components/landing/LandingNavbar";
import LandingFooter from "../../components/landing/LandingFooter";
import { COMPANY_ECOSYSTEM_SUPPORT_FORM_URL } from "../../constants/supportForm";

function Ecosystem() {
  const [activeSection, setActiveSection] = useState("overview");

  const sections = [
    { id: "overview", number: "01", title: "Overview" },
    { id: "what-is-ecosystem", number: "02", title: "What Is the BR30 Ecosystem" },
    { id: "platform", number: "03", title: "Platform Foundation" },
    { id: "business-workflows", number: "04", title: "Business Workflows" },
    { id: "customer-management", number: "05", title: "Customer Management" },
    { id: "sales-operations", number: "06", title: "Sales & Operations" },
    { id: "teams", number: "07", title: "Teams & Collaboration" },
    { id: "integrations", number: "08", title: "Integrations" },
    { id: "data", number: "09", title: "Data & Information" },
    { id: "security", number: "10", title: "Security & Trust" },
    { id: "scalability", number: "11", title: "Scalability" },
    { id: "future", number: "12", title: "Future Development" },
    { id: "contact", number: "13", title: "Contact Us" },
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
            <span>Company</span>
            <ChevronRight size={13} />
            <span>Ecosystem</span>
          </div>

          <div className="br30-legal-eyebrow">
            <span className="br30-legal-eyebrow-dot" />
            BR30 CRM Ecosystem
          </div>

          <h1>
            Connected <span>Business Ecosystem</span>
          </h1>

          <p className="br30-legal-hero-description">The BR30 CRM ecosystem brings customer management, sales activities, business workflows, team collaboration, integrations, and operational information together in one connected workspace.</p>

          <div className="br30-legal-meta">
            <div className="br30-legal-meta-item">
              <Network size={14} />
              <span>
                Ecosystem <strong>Connected Workspace</strong>
              </span>
            </div>

            <div className="br30-legal-meta-item">
              <Layers3 size={14} />
              <span>
                Platform <strong>BR30 CRM</strong>
              </span>
            </div>

            <div className="br30-legal-meta-item">
              <Globe2 size={14} />
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
                <Network size={18} />
              </div>

              <div>
                <h2>A connected foundation for modern business</h2>

                <p>BR30 CRM is designed to connect the people, information, workflows, and tools involved in everyday business operations so teams can work from a consistent and organized workspace.</p>
              </div>
            </div>
          </div>

          <section id="overview" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>01</span>
              Overview
            </div>

            <h2>About the BR30 CRM ecosystem</h2>

            <p>The BR30 CRM ecosystem represents the connected environment surrounding the BR30 CRM platform, including the core application, business workflows, users, teams, information, integrations, and supporting services.</p>

            <p>The purpose of this ecosystem is to provide businesses with a unified place to organize customer relationships, sales activities, operational information, and team processes.</p>

            <div className="br30-legal-note">
              <strong>Designed for connection:</strong> Each part of the ecosystem is intended to work together while allowing businesses to maintain their own workflows, roles, permissions, and operating practices.
            </div>
          </section>

          <section id="what-is-ecosystem" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>02</span>
              What Is the BR30 Ecosystem
            </div>

            <h2>One environment for connected business activity</h2>

            <p>A CRM ecosystem is more than a customer database. It can include the information, processes, people, applications, and services that support customer-facing and internal business activities.</p>

            <p>BR30 CRM brings these elements together through a common workspace, helping users organize information and access the tools relevant to their responsibilities.</p>

            <ul>
              <li>Customer and contact information.</li>
              <li>Sales and relationship activities.</li>
              <li>Tasks, notes, and business workflows.</li>
              <li>Team and user management.</li>
              <li>Connected services and integrations.</li>
              <li>Operational and business information.</li>
            </ul>
          </section>

          <section id="platform" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>03</span>
              Platform Foundation
            </div>

            <h2>The core BR30 CRM platform</h2>

            <p>The BR30 CRM platform provides the central workspace through which users can manage customer relationships and organize business activities.</p>

            <p>The platform is structured to support different users and responsibilities while maintaining a consistent experience across the business.</p>

            <h3>Core platform areas</h3>

            <ul>
              <li>Account and user management.</li>
              <li>Customer relationship management.</li>
              <li>Sales and activity management.</li>
              <li>Business dashboards and reporting.</li>
              <li>Workflow and operational organization.</li>
              <li>Security and access controls.</li>
            </ul>
          </section>

          <section id="business-workflows" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>04</span>
              Business Workflows
            </div>

            <h2>Organizing everyday business processes</h2>

            <p>BR30 CRM can support business workflows by bringing related activities and information into a structured workspace.</p>

            <p>Businesses can organize processes around their own operational requirements, allowing teams to manage recurring activities, customer interactions, follow-ups, and internal responsibilities.</p>

            <ul>
              <li>Lead and customer follow-up.</li>
              <li>Task assignment and tracking.</li>
              <li>Sales activity organization.</li>
              <li>Customer communication records.</li>
              <li>Internal operational processes.</li>
              <li>Business activity visibility.</li>
            </ul>
          </section>

          <section id="customer-management" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>05</span>
              Customer Management
            </div>

            <h2>Keeping customer relationships organized</h2>

            <p>Customer information is an important part of the BR30 CRM ecosystem. The platform provides a structured environment for storing and working with customer and contact information.</p>

            <p>Authorized users can use customer records to understand relationships, maintain relevant information, track activities, and coordinate follow-up actions.</p>

            <div className="br30-legal-note">
              <strong>Business responsibility:</strong> Organizations remain responsible for the information they enter into the platform and for ensuring that their collection and use of customer information follows applicable requirements.
            </div>
          </section>

          <section id="sales-operations" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>06</span>
              Sales & Operations
            </div>

            <h2>Connecting sales with business operations</h2>

            <p>BR30 CRM can help connect sales activities with the operational information needed to support those activities.</p>

            <p>This connected approach can help teams maintain visibility across customer interactions, opportunities, follow-ups, tasks, and related business activities.</p>

            <h3>Connected activity management</h3>

            <ul>
              <li>Sales pipeline activities.</li>
              <li>Customer follow-ups.</li>
              <li>Tasks and reminders.</li>
              <li>Business notes and records.</li>
              <li>Operational activity tracking.</li>
            </ul>
          </section>

          <section id="teams" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>07</span>
              Teams & Collaboration
            </div>

            <h2>Supporting people across the organization</h2>

            <p>A connected CRM environment can help different members of a business work from shared information and coordinated processes.</p>

            <p>BR30 CRM can support role-based access and responsibilities so users can interact with the information and functionality relevant to their work.</p>

            <ul>
              <li>User accounts and profiles.</li>
              <li>Role-based access.</li>
              <li>Shared customer information.</li>
              <li>Assigned activities and responsibilities.</li>
              <li>Centralized business records.</li>
            </ul>

            <div className="br30-legal-note">
              <strong>Access principle:</strong> Organizations should configure user access according to their own internal responsibilities and information-management requirements.
            </div>
          </section>

          <section id="integrations" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>08</span>
              Integrations
            </div>

            <h2>Connecting external services</h2>

            <p>The BR30 CRM ecosystem may include integrations with external services that support communications, authentication, analytics, infrastructure, payments, notifications, or other business functionality.</p>

            <p>Integrations can allow relevant information or actions to move between systems while supporting the workflows configured by the business.</p>

            <h3>Third-party services</h3>

            <p>External services operate according to their own availability, functionality, privacy practices, and terms. The availability of any particular integration may change as the platform and connected services evolve.</p>
          </section>

          <section id="data" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>09</span>
              Data & Information
            </div>

            <h2>Information at the center of the ecosystem</h2>

            <p>Information connects the different components of a CRM ecosystem. BR30 CRM is designed to provide structured access to information that users need for customer management and business operations.</p>

            <p>Depending on the features used, this may include customer records, contact details, sales information, tasks, notes, activities, and other business records entered by authorized users.</p>

            <ul>
              <li>Structured customer information.</li>
              <li>Business activity records.</li>
              <li>Sales and relationship information.</li>
              <li>Team and workflow information.</li>
              <li>Account and configuration information.</li>
            </ul>
          </section>

          <section id="security" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>10</span>
              Security & Trust
            </div>

            <h2>Building a responsible business environment</h2>

            <p>Security is an important part of the BR30 CRM ecosystem. The platform may use authentication, access controls, protected communications, monitoring, and other technical or organizational measures intended to protect accounts and information.</p>

            <p>Users and organizations also play an important role in maintaining security by protecting credentials, managing access appropriately, and using trusted devices and networks.</p>

            <div className="br30-legal-note">
              <strong>Shared responsibility:</strong> No internet-based system can be guaranteed to be completely secure. Effective protection depends on both platform-level safeguards and responsible user practices.
            </div>
          </section>

          <section id="scalability" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>11</span>
              Scalability
            </div>

            <h2>Designed to grow with business needs</h2>

            <p>Business requirements can change as organizations grow. The BR30 CRM ecosystem is intended to provide a foundation that can support evolving customer relationships, teams, workflows, and operational requirements.</p>

            <p>Businesses may use different parts of the platform depending on their size, structure, processes, and operational needs.</p>

            <h3>Growing business requirements</h3>

            <ul>
              <li>Additional users and teams.</li>
              <li>Expanding customer information.</li>
              <li>Increasing business activity.</li>
              <li>Additional workflows and processes.</li>
              <li>Connected tools and services.</li>
            </ul>
          </section>

          <section id="future" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>12</span>
              Future Development
            </div>

            <h2>An ecosystem that continues to evolve</h2>

            <p>BR30 CRM may continue to evolve as business requirements, technology, security practices, and customer needs change.</p>

            <p>New functionality, integrations, workflow capabilities, and supporting services may be introduced over time. Existing features may also be improved, modified, replaced, or discontinued.</p>

            <p>Product availability and functionality may vary depending on the applicable BR30 CRM plan, service configuration, technical requirements, or other operational considerations.</p>
          </section>

          <section id="contact" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>13</span>
              Contact Us
            </div>

            <h2>Questions about the BR30 ecosystem?</h2>

            <p>If you have questions about BR30 CRM, its platform, integrations, business workflows, or the broader ecosystem, please contact the BR30 CRM support team.</p>

            <div className="br30-legal-contact-card">
              <div className="br30-legal-contact-icon">
                <Users size={16} />
              </div>

              <div>
                <strong>BR30 CRM Support</strong>

                <a href={COMPANY_ECOSYSTEM_SUPPORT_FORM_URL} className="br30-support-ticket-link" rel="noopener noreferrer">
                  Create Support Ticket
                </a>
              </div>
            </div>

            <div className="br30-legal-contact-card">
              <div className="br30-legal-contact-icon">
                <ShieldCheck size={16} />
              </div>

              <div>
                <strong>BR30 CRM</strong>

                <p>For account-specific or business-specific requests, please create a support ticket using the email address associated with your BR30 CRM account whenever possible.</p>
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

export default Ecosystem;
