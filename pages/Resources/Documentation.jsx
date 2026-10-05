import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUp, BookOpen, CheckCircle2, ChevronRight, Code2, FileText, Mail, Search, ShieldCheck, Sparkles } from "lucide-react";
import LandingNavbar from "../../components/landing/LandingNavbar";
import LandingFooter from "../../components/landing/LandingFooter";
import { RESOURCES_DOCUMENTATION_SUPPORT_FORM_URL } from "../../constants/supportForm";

function Documentation() {
  const [activeSection, setActiveSection] = useState("getting-started");

  const sections = [
    { id: "getting-started", number: "01", title: "Getting Started" },
    { id: "account-setup", number: "02", title: "Account Setup" },
    { id: "dashboard", number: "03", title: "Dashboard" },
    { id: "customers", number: "04", title: "Customers & Contacts" },
    { id: "sales", number: "05", title: "Sales Management" },
    { id: "tasks", number: "06", title: "Tasks & Activities" },
    { id: "team", number: "07", title: "Team Management" },
    { id: "security", number: "08", title: "Security & Access" },
    { id: "settings", number: "09", title: "Settings" },
    { id: "integrations", number: "10", title: "Integrations" },
    { id: "api", number: "11", title: "API & Developers" },
    { id: "support", number: "12", title: "Support" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const offset = 150;
      let current = "getting-started";

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element && element.getBoundingClientRect().top <= offset) {
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

    window.scrollTo({
      top: element.getBoundingClientRect().top + window.scrollY - 105,
      behavior: "smooth",
    });

    setActiveSection(id);
  };

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="br30-doc-page">
      <style>{`.br30-doc-page{min-height:100vh;background:var(--crm-bg);color:var(--crm-text);font-family:var(--crm-font)}.br30-doc-page *,.br30-doc-page *::before,.br30-doc-page *::after{box-sizing:border-box}.br30-doc-hero{padding:142px 24px 58px;border-bottom:1px solid var(--crm-border);background:var(--crm-bg)}.br30-doc-hero-inner{width:100%;max-width:1120px;margin:0 auto}.br30-doc-breadcrumb{display:flex;align-items:center;gap:6px;margin-bottom:24px;color:var(--crm-muted);font-size:13px}.br30-doc-breadcrumb a{color:var(--crm-muted);text-decoration:none}.br30-doc-breadcrumb a:hover{color:var(--crm-primary)}.br30-doc-eyebrow{display:inline-flex;align-items:center;gap:7px;color:var(--crm-primary);font-size:13px;font-weight:400;letter-spacing:.08em;text-transform:uppercase}.br30-doc-eyebrow-dot{width:6px;height:6px;border-radius:50%;background:var(--crm-primary)}.br30-doc-hero h1{margin:16px 0 14px;color:var(--crm-text);font-size:clamp(32px,4vw,48px);line-height:1.12;letter-spacing:-.025em;font-weight:400}.br30-doc-hero h1 span{color:var(--crm-primary)}.br30-doc-description{max-width:760px;margin:0;color:var(--crm-muted);font-size:14px;line-height:1.75}.br30-doc-meta{display:flex;flex-wrap:wrap;gap:8px;margin-top:25px}.br30-doc-meta-item{display:flex;align-items:center;gap:7px;min-height:35px;padding:7px 11px;border:1px solid var(--crm-border);border-radius:9px;background:var(--crm-surface);color:var(--crm-muted);font-size:13px}.br30-doc-meta-item svg{color:var(--crm-primary)}.br30-doc-meta-item strong{color:var(--crm-text);font-weight:400}.br30-doc-main{width:100%;max-width:1120px;margin:0 auto;padding:52px 24px 80px;display:grid;grid-template-columns:235px minmax(0,1fr);gap:50px;align-items:start}.br30-doc-sidebar{position:sticky;top:100px;max-height:calc(100vh - 120px);overflow:auto;padding:7px;border:1px solid var(--crm-border);border-radius:13px;background:var(--crm-surface);box-shadow:var(--crm-shadow);scrollbar-width:thin}.br30-doc-sidebar-title{padding:9px 10px 11px;color:var(--crm-text);font-size:13px;font-weight:400;letter-spacing:.06em;text-transform:uppercase}.br30-doc-sidebar-list{display:flex;flex-direction:column;gap:1px}.br30-doc-sidebar button{width:100%;display:flex;align-items:center;gap:8px;padding:8px 9px;border:0;border-radius:8px;background:transparent;color:var(--crm-muted);font:inherit;font-size:13px;line-height:1.35;text-align:left;cursor:pointer}.br30-doc-sidebar button:hover{background:var(--crm-surface-2);color:var(--crm-text)}.br30-doc-sidebar button.active{background:var(--crm-primary-soft);color:var(--crm-primary);font-weight:400}.br30-doc-number{width:22px;flex:0 0 22px;font-size:13px;font-weight:400;opacity:.7}.br30-doc-content{min-width:0}.br30-doc-intro{margin-bottom:34px;padding:21px;border:1px solid var(--crm-border);border-radius:13px;background:var(--crm-surface);box-shadow:var(--crm-shadow)}.br30-doc-intro-top{display:flex;align-items:flex-start;gap:13px}.br30-doc-intro-icon{width:38px;height:38px;flex:0 0 38px;display:grid;place-items:center;border-radius:9px;background:var(--crm-primary-soft);border:1px solid var(--crm-border);color:var(--crm-primary)}.br30-doc-intro h2{margin:0 0 5px;color:var(--crm-text);font-size:15px;font-weight:400}.br30-doc-intro p{margin:0;color:var(--crm-muted);font-size:13px;line-height:1.75}.br30-doc-section{scroll-margin-top:110px;padding:0 0 38px;margin-bottom:38px;border-bottom:1px solid var(--crm-border)}.br30-doc-section:last-child{border-bottom:0;margin-bottom:0}.br30-doc-label{display:flex;align-items:center;gap:8px;margin-bottom:10px;color:var(--crm-primary);font-size:13px;font-weight:400;letter-spacing:.08em;text-transform:uppercase}.br30-doc-label span{opacity:.65}.br30-doc-section h2{margin:0 0 14px;color:var(--crm-text);font-size:20px;line-height:1.35;font-weight:400;letter-spacing:-.01em}.br30-doc-section h3{margin:22px 0 8px;color:var(--crm-text);font-size:14px;font-weight:400}.br30-doc-section p{margin:0 0 13px;color:var(--crm-muted);font-size:13px;line-height:1.85}.br30-doc-section ul{margin:10px 0 17px;padding-left:20px}.br30-doc-section li{margin:7px 0;color:var(--crm-muted);font-size:13px;line-height:1.75}.br30-doc-section li::marker{color:var(--crm-primary)}.br30-doc-card-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:18px}.br30-doc-card{padding:16px;border:1px solid var(--crm-border);border-radius:11px;background:var(--crm-surface);transition:.2s}.br30-doc-card:hover{border-color:color-mix(in srgb,var(--crm-primary) 35%,var(--crm-border));transform:translateY(-2px)}.br30-doc-card-icon{width:32px;height:32px;display:grid;place-items:center;margin-bottom:10px;border-radius:8px;background:var(--crm-primary-soft);color:var(--crm-primary)}.br30-doc-card strong{display:block;margin-bottom:5px;color:var(--crm-text);font-size:13px}.br30-doc-card p{margin:0;font-size:13px;line-height:1.65}.br30-doc-note{margin:18px 0;padding:14px 16px;border-left:3px solid var(--crm-primary);border-radius:0 9px 9px 0;background:var(--crm-surface-2);color:var(--crm-muted);font-size:13px;line-height:1.75}.br30-doc-note strong{color:var(--crm-text)}.br30-doc-contact{display:grid;grid-template-columns:auto 1fr;gap:12px;margin-top:18px;padding:17px;border:1px solid var(--crm-border);border-radius:11px;background:var(--crm-surface)}.br30-doc-contact-icon{width:36px;height:36px;display:grid;place-items:center;border-radius:9px;background:var(--crm-primary-soft);color:var(--crm-primary)}.br30-doc-contact strong{display:block;margin-bottom:4px;color:var(--crm-text);font-size:13px}.br30-doc-contact a{color:var(--crm-primary);font-size:13px;text-decoration:none}.br30-doc-contact a:hover{text-decoration:underline}.br30-doc-top{position:fixed;right:20px;bottom:20px;z-index:30;width:38px;height:38px;display:grid;place-items:center;border:1px solid var(--crm-border);border-radius:10px;background:var(--crm-surface);color:var(--crm-text);box-shadow:var(--crm-shadow);cursor:pointer;transition:.2s}.br30-doc-top:hover{border-color:var(--crm-primary);color:var(--crm-primary);transform:translateY(-2px)}@media(max-width:900px){.br30-doc-main{grid-template-columns:1fr;gap:25px}.br30-doc-sidebar{position:relative;top:auto;max-height:none}.br30-doc-sidebar-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:600px){.br30-doc-hero{padding:120px 17px 45px}.br30-doc-hero h1{font-size:34px}.br30-doc-description{font-size:13px}.br30-doc-meta{display:grid;grid-template-columns:1fr}.br30-doc-main{padding:35px 17px 60px}.br30-doc-sidebar-list{grid-template-columns:1fr}.br30-doc-intro{padding:18px}.br30-doc-section{scroll-margin-top:90px;padding-bottom:32px;margin-bottom:32px}.br30-doc-section h2{font-size:18px}.br30-doc-section p,.br30-doc-section li{font-size:13px}.br30-doc-card-grid{grid-template-columns:1fr}.br30-doc-contact{grid-template-columns:1fr}.br30-doc-top{right:13px;bottom:13px}}`}</style>

      <LandingNavbar />

      <header className="br30-doc-hero">
        <div className="br30-doc-hero-inner">
          <div className="br30-doc-breadcrumb">
            <Link to="/">Home</Link>
            <ChevronRight size={13} />
            <span>Resources</span>
            <ChevronRight size={13} />
            <span>Documentation</span>
          </div>

          <div className="br30-doc-eyebrow">
            <span className="br30-doc-eyebrow-dot" />
            BR30 CRM Resources
          </div>

          <h1>
            Product <span>Documentation</span>
          </h1>

          <p className="br30-doc-description">Learn how to use BR30 CRM, configure your workspace, manage customers and sales, control team access, and get the most from your business workspace.</p>

          <div className="br30-doc-meta">
            <div className="br30-doc-meta-item">
              <BookOpen size={14} />
              <span>
                Documentation <strong>v1.0</strong>
              </span>
            </div>

            <div className="br30-doc-meta-item">
              <CheckCircle2 size={14} />
              <span>
                Status <strong>Current</strong>
              </span>
            </div>

            <div className="br30-doc-meta-item">
              <FileText size={14} />
              <span>
                Updated <strong>September 24, 2026</strong>
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="br30-doc-main">
        <aside className="br30-doc-sidebar">
          <div className="br30-doc-sidebar-title">Documentation</div>

          <div className="br30-doc-sidebar-list">
            {sections.map((section) => (
              <button key={section.id} type="button" className={activeSection === section.id ? "active" : ""} onClick={() => scrollToSection(section.id)}>
                <span className="br30-doc-number">{section.number}</span>
                <span>{section.title}</span>
              </button>
            ))}
          </div>
        </aside>

        <article className="br30-doc-content">
          <div className="br30-doc-intro">
            <div className="br30-doc-intro-top">
              <div className="br30-doc-intro-icon">
                <BookOpen size={18} />
              </div>

              <div>
                <h2>Welcome to BR30 CRM Documentation</h2>
                <p>Use this documentation as a practical guide for setting up your workspace, managing day-to-day CRM activities, and understanding the core features available in BR30 CRM.</p>
              </div>
            </div>
          </div>

          <section id="getting-started" className="br30-doc-section">
            <div className="br30-doc-label">
              <span>01</span> Getting Started
            </div>
            <h2>Start using BR30 CRM</h2>
            <p>BR30 CRM provides a centralized workspace for managing customers, sales activities, business records, teams, and everyday workflows.</p>
            <h3>Recommended first steps</h3>
            <ul>
              <li>Create or sign in to your BR30 CRM account.</li>
              <li>Complete your basic account and workspace information.</li>
              <li>Review available dashboard and CRM modules.</li>
              <li>Add your first customer or business contact.</li>
              <li>Invite team members where team collaboration is required.</li>
            </ul>
            <div className="br30-doc-note">
              <strong>Tip:</strong> Start with your customer records and team structure before building more advanced workflows.
            </div>
          </section>

          <section id="account-setup" className="br30-doc-section">
            <div className="br30-doc-label">
              <span>02</span> Account Setup
            </div>
            <h2>Configure your account</h2>
            <p>Your account settings control important information related to your BR30 CRM workspace and user profile.</p>
            <h3>Account configuration</h3>
            <ul>
              <li>Maintain your profile information.</li>
              <li>Manage authentication credentials.</li>
              <li>Review account role and access permissions.</li>
              <li>Configure available communication preferences.</li>
              <li>Review security-related settings.</li>
            </ul>
          </section>

          <section id="dashboard" className="br30-doc-section">
            <div className="br30-doc-label">
              <span>03</span> Dashboard
            </div>
            <h2>Your business overview</h2>
            <p>The dashboard provides a central view of important business information and activity available to your account.</p>
            <div className="br30-doc-card-grid">
              <div className="br30-doc-card">
                <div className="br30-doc-card-icon">
                  <Sparkles size={15} />
                </div>
                <strong>Business Overview</strong>
                <p>Review important activity and operational information from one workspace.</p>
              </div>
              <div className="br30-doc-card">
                <div className="br30-doc-card-icon">
                  <FileText size={15} />
                </div>
                <strong>Recent Activity</strong>
                <p>Keep track of recent records, actions, and relevant CRM activity.</p>
              </div>
            </div>
          </section>

          <section id="customers" className="br30-doc-section">
            <div className="br30-doc-label">
              <span>04</span> Customers & Contacts
            </div>
            <h2>Manage customer relationships</h2>
            <p>Use customer and contact records to organize the people and organizations your business works with.</p>
            <ul>
              <li>Create and maintain customer records.</li>
              <li>Store relevant contact information.</li>
              <li>Update customer details when information changes.</li>
              <li>Search and review customer records.</li>
              <li>Maintain useful notes and business context.</li>
            </ul>
          </section>

          <section id="sales" className="br30-doc-section">
            <div className="br30-doc-label">
              <span>05</span> Sales Management
            </div>
            <h2>Organize your sales workflow</h2>
            <p>BR30 CRM can be used to organize sales-related records and activities throughout your business workflow.</p>
            <h3>Sales workflow</h3>
            <ul>
              <li>Capture leads and opportunities.</li>
              <li>Maintain customer and deal information.</li>
              <li>Track relevant sales activities.</li>
              <li>Update records as opportunities progress.</li>
              <li>Keep sales information organized for your team.</li>
            </ul>
          </section>

          <section id="tasks" className="br30-doc-section">
            <div className="br30-doc-label">
              <span>06</span> Tasks & Activities
            </div>
            <h2>Keep work organized</h2>
            <p>Tasks and activities help users maintain visibility over follow-ups, responsibilities, and important business actions.</p>
            <ul>
              <li>Create tasks for upcoming work.</li>
              <li>Assign responsibilities where supported.</li>
              <li>Track task status and completion.</li>
              <li>Maintain notes related to customer or business activity.</li>
            </ul>
          </section>

          <section id="team" className="br30-doc-section">
            <div className="br30-doc-label">
              <span>07</span> Team Management
            </div>
            <h2>Manage users and collaboration</h2>
            <p>Workspace administrators can manage users and available access according to the roles and permissions supported by BR30 CRM.</p>
            <h3>Team administration</h3>
            <ul>
              <li>Invite authorized team members.</li>
              <li>Review user roles and access.</li>
              <li>Update user information where permitted.</li>
              <li>Remove or restrict access when required.</li>
            </ul>
          </section>

          <section id="security" className="br30-doc-section">
            <div className="br30-doc-label">
              <span>08</span> Security & Access
            </div>
            <h2>Protect your workspace</h2>
            <p>Security features help protect account access and business information stored within BR30 CRM.</p>
            <ul>
              <li>Use strong and unique authentication credentials.</li>
              <li>Do not share passwords or verification codes.</li>
              <li>Review account access regularly.</li>
              <li>Remove access that is no longer required.</li>
              <li>Contact support if you notice suspicious account activity.</li>
            </ul>
            <div className="br30-doc-note">
              <strong>Security reminder:</strong> Account security is a shared responsibility between BR30 CRM and the people who use the platform.
            </div>
          </section>

          <section id="settings" className="br30-doc-section">
            <div className="br30-doc-label">
              <span>09</span> Settings
            </div>
            <h2>Personalize your workspace</h2>
            <p>Settings allow users to manage supported account preferences and workspace behavior.</p>
            <ul>
              <li>Review appearance preferences.</li>
              <li>Manage available notification settings.</li>
              <li>Review profile and account preferences.</li>
              <li>Configure supported workspace options.</li>
            </ul>
          </section>

          <section id="integrations" className="br30-doc-section">
            <div className="br30-doc-label">
              <span>10</span> Integrations
            </div>
            <h2>Connect your workflow</h2>
            <p>Where available, BR30 CRM may connect with third-party services to support communication, payments, analytics, infrastructure, or other business workflows.</p>
            <p>Availability and configuration requirements may vary depending on the integration and your account or plan.</p>
          </section>

          <section id="api" className="br30-doc-section">
            <div className="br30-doc-label">
              <span>11</span> API & Developers
            </div>
            <h2>Developer resources</h2>
            <p>Developer functionality may allow approved applications or services to interact with supported BR30 CRM capabilities.</p>
            <div className="br30-doc-card-grid">
              <div className="br30-doc-card">
                <div className="br30-doc-card-icon">
                  <Code2 size={15} />
                </div>
                <strong>API Access</strong>
                <p>Review the API capabilities available to your account or integration.</p>
              </div>
              <div className="br30-doc-card">
                <div className="br30-doc-card-icon">
                  <ShieldCheck size={15} />
                </div>
                <strong>Secure Integration</strong>
                <p>Protect API credentials and only provide access to trusted applications.</p>
              </div>
            </div>
          </section>

          <section id="support" className="br30-doc-section">
            <div className="br30-doc-label">
              <span>12</span> Support
            </div>
            <h2>Need assistance?</h2>
            <p>If you need help with BR30 CRM, account access, security, or product functionality, contact the BR30 CRM support team.</p>

            <div className="br30-doc-contact">
              <div className="br30-doc-contact-icon">
                <Mail size={16} />
              </div>
              <div>
                <strong>BR30 CRM Support</strong>
                <a href={RESOURCES_DOCUMENTATION_SUPPORT_FORM_URL} className="br30-support-ticket-link" target="_blank" rel="noopener noreferrer">
                  Create Support Ticket
                </a>
              </div>
            </div>
          </section>
        </article>
      </main>

      <button type="button" className="br30-doc-top" onClick={handleBackToTop} aria-label="Back to top" title="Back to top">
        <ArrowUp size={16} />
      </button>

      <LandingFooter />
    </div>
  );
}

export default Documentation;
