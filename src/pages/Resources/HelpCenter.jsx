import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUp, BookOpen, CheckCircle2, ChevronRight, CircleHelp, FileText, Mail, MessageCircle, Search, ShieldCheck, UserCheck } from "lucide-react";
import LandingNavbar from "../../components/landing/LandingNavbar";
import LandingFooter from "../../components/landing/LandingFooter";
import { RESOURCES_HELP_CENTER_SUPPORT_FORM_URL } from "../../constants/supportForm";

function HelpCenter() {
  const [activeSection, setActiveSection] = useState("welcome");

  const sections = [
    { id: "welcome", number: "01", title: "Welcome" },
    { id: "account", number: "02", title: "Account Help" },
    { id: "login", number: "03", title: "Login & Access" },
    { id: "customers", number: "04", title: "Customers" },
    { id: "sales", number: "05", title: "Sales & CRM" },
    { id: "team", number: "06", title: "Team & Roles" },
    { id: "security", number: "07", title: "Security" },
    { id: "settings", number: "08", title: "Settings" },
    { id: "billing", number: "09", title: "Billing & Plans" },
    { id: "troubleshooting", number: "10", title: "Troubleshooting" },
    { id: "contact", number: "11", title: "Contact Support" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const offset = 150;
      let current = "welcome";

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
    <div className="br30-help-page">
      <style>{`.br30-help-page{min-height:100vh;background:var(--crm-bg);color:var(--crm-text);font-family:var(--crm-font)}.br30-help-page *,.br30-help-page *::before,.br30-help-page *::after{box-sizing:border-box}.br30-help-hero{padding:142px 24px 58px;border-bottom:1px solid var(--crm-border);background:var(--crm-bg)}.br30-help-hero-inner{width:100%;max-width:1120px;margin:0 auto}.br30-help-breadcrumb{display:flex;align-items:center;gap:6px;margin-bottom:24px;color:var(--crm-muted);font-size:13px}.br30-help-breadcrumb a{color:var(--crm-muted);text-decoration:none}.br30-help-breadcrumb a:hover{color:var(--crm-primary)}.br30-help-eyebrow{display:inline-flex;align-items:center;gap:7px;color:var(--crm-primary);font-size:13px;font-weight:400;letter-spacing:.08em;text-transform:uppercase}.br30-help-eyebrow-dot{width:6px;height:6px;border-radius:50%;background:var(--crm-primary)}.br30-help-hero h1{margin:16px 0 14px;color:var(--crm-text);font-size:clamp(32px,4vw,48px);line-height:1.12;letter-spacing:-.025em;font-weight:400}.br30-help-hero h1 span{color:var(--crm-primary)}.br30-help-description{max-width:760px;margin:0;color:var(--crm-muted);font-size:14px;line-height:1.75}.br30-help-meta{display:flex;flex-wrap:wrap;gap:8px;margin-top:15px}.br30-help-meta-item{display:flex;align-items:center;gap:7px;min-height:35px;padding:7px 11px;border:1px solid var(--crm-border);border-radius:9px;background:var(--crm-surface);color:var(--crm-muted);font-size:13px}.br30-help-meta-item svg{color:var(--crm-primary)}.br30-help-meta-item strong{color:var(--crm-text);font-weight:400}.br30-help-main{width:100%;max-width:1120px;margin:0 auto;padding:52px 24px 80px;display:grid;grid-template-columns:235px minmax(0,1fr);gap:50px;align-items:start}.br30-help-sidebar{position:sticky;top:100px;max-height:calc(100vh - 120px);overflow:auto;padding:7px;border:1px solid var(--crm-border);border-radius:13px;background:var(--crm-surface);box-shadow:var(--crm-shadow);scrollbar-width:thin}.br30-help-sidebar-title{padding:9px 10px 11px;color:var(--crm-text);font-size:13px;font-weight:400;letter-spacing:.06em;text-transform:uppercase}.br30-help-sidebar-list{display:flex;flex-direction:column;gap:1px}.br30-help-sidebar button{width:100%;display:flex;align-items:center;gap:8px;padding:8px 9px;border:0;border-radius:8px;background:transparent;color:var(--crm-muted);font:inherit;font-size:13px;line-height:1.35;text-align:left;cursor:pointer}.br30-help-sidebar button:hover{background:var(--crm-surface-2);color:var(--crm-text)}.br30-help-sidebar button.active{background:var(--crm-primary-soft);color:var(--crm-primary);font-weight:400}.br30-help-number{width:22px;flex:0 0 22px;font-size:13px;font-weight:400;opacity:.7}.br30-help-content{min-width:0}.br30-help-intro{margin-bottom:34px;padding:21px;border:1px solid var(--crm-border);border-radius:13px;background:var(--crm-surface);box-shadow:var(--crm-shadow)}.br30-help-intro-top{display:flex;align-items:flex-start;gap:13px}.br30-help-intro-icon{width:38px;height:38px;flex:0 0 38px;display:grid;place-items:center;border-radius:9px;background:var(--crm-primary-soft);border:1px solid var(--crm-border);color:var(--crm-primary)}.br30-help-intro h2{margin:0 0 5px;color:var(--crm-text);font-size:15px;font-weight:400}.br30-help-intro p{margin:0;color:var(--crm-muted);font-size:13px;line-height:1.75}.br30-help-section{scroll-margin-top:110px;padding:0 0 38px;margin-bottom:38px;border-bottom:1px solid var(--crm-border)}.br30-help-section:last-child{border-bottom:0;margin-bottom:0}.br30-help-label{display:flex;align-items:center;gap:8px;margin-bottom:10px;color:var(--crm-primary);font-size:13px;font-weight:400;letter-spacing:.08em;text-transform:uppercase}.br30-help-label span{opacity:.65}.br30-help-section h2{margin:0 0 14px;color:var(--crm-text);font-size:20px;line-height:1.35;font-weight:400;letter-spacing:-.01em}.br30-help-section h3{margin:22px 0 8px;color:var(--crm-text);font-size:14px;font-weight:400}.br30-help-section p{margin:0 0 13px;color:var(--crm-muted);font-size:13px;line-height:1.85}.br30-help-section ul{margin:10px 0 17px;padding-left:20px}.br30-help-section li{margin:7px 0;color:var(--crm-muted);font-size:13px;line-height:1.75}.br30-help-section li::marker{color:var(--crm-primary)}.br30-help-card-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:18px}.br30-help-card{padding:16px;border:1px solid var(--crm-border);border-radius:11px;background:var(--crm-surface);transition:.2s}.br30-help-card:hover{border-color:color-mix(in srgb,var(--crm-primary) 35%,var(--crm-border));transform:translateY(-2px)}.br30-help-card-icon{width:32px;height:32px;display:grid;place-items:center;margin-bottom:10px;border-radius:8px;background:var(--crm-primary-soft);color:var(--crm-primary)}.br30-help-card strong{display:block;margin-bottom:5px;color:var(--crm-text);font-size:13px}.br30-help-card p{margin:0;font-size:13px;line-height:1.65}.br30-help-note{margin:18px 0;padding:14px 16px;border-left:3px solid var(--crm-primary);border-radius:0 9px 9px 0;background:var(--crm-surface-2);color:var(--crm-muted);font-size:13px;line-height:1.75}.br30-help-note strong{color:var(--crm-text)}.br30-help-contact{display:grid;grid-template-columns:auto 1fr;gap:12px;margin-top:18px;padding:17px;border:1px solid var(--crm-border);border-radius:11px;background:var(--crm-surface)}.br30-help-contact-icon{width:36px;height:36px;display:grid;place-items:center;border-radius:9px;background:var(--crm-primary-soft);color:var(--crm-primary)}.br30-help-contact strong{display:block;margin-bottom:4px;color:var(--crm-text);font-size:13px}.br30-help-contact a{color:var(--crm-primary);font-size:13px;text-decoration:none}.br30-help-contact a:hover{text-decoration:underline}.br30-help-top{position:fixed;right:20px;bottom:20px;z-index:30;width:38px;height:38px;display:grid;place-items:center;border:1px solid var(--crm-border);border-radius:10px;background:var(--crm-surface);color:var(--crm-text);box-shadow:var(--crm-shadow);cursor:pointer;transition:.2s}.br30-help-top:hover{border-color:var(--crm-primary);color:var(--crm-primary);transform:translateY(-2px)}@media(max-width:900px){.br30-help-main{grid-template-columns:1fr;gap:25px}.br30-help-sidebar{position:relative;top:auto;max-height:none}.br30-help-sidebar-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:600px){.br30-help-hero{padding:120px 17px 45px}.br30-help-hero h1{font-size:34px}.br30-help-description{font-size:13px}.br30-help-meta{display:grid;grid-template-columns:1fr}.br30-help-main{padding:35px 17px 60px}.br30-help-sidebar-list{grid-template-columns:1fr}.br30-help-intro{padding:18px}.br30-help-section{scroll-margin-top:90px;padding-bottom:32px;margin-bottom:32px}.br30-help-section h2{font-size:18px}.br30-help-section p,.br30-help-section li{font-size:13px}.br30-help-card-grid{grid-template-columns:1fr}.br30-help-contact{grid-template-columns:1fr}.br30-help-top{right:13px;bottom:13px}}`}</style>

      <LandingNavbar />

      <header className="br30-help-hero">
        <div className="br30-help-hero-inner">
          <div className="br30-help-breadcrumb">
            <Link to="/">Home</Link>
            <ChevronRight size={13} />
            <span>Resources</span>
            <ChevronRight size={13} />
            <span>Help Center</span>
          </div>

          <div className="br30-help-eyebrow">
            <span className="br30-help-eyebrow-dot" />
            BR30 CRM Support
          </div>

          <h1>
            How can we <span>help?</span>
          </h1>

          <p className="br30-help-description">Find practical answers for account access, CRM workflows, customer management, team administration, security, settings, billing, and common issues.</p>

          <div className="br30-help-meta">
            <div className="br30-help-meta-item">
              <CircleHelp size={14} />
              <span>
                Help Center <strong>v1.0</strong>
              </span>
            </div>

            <div className="br30-help-meta-item">
              <CheckCircle2 size={14} />
              <span>
                Support <strong>Available</strong>
              </span>
            </div>

            <div className="br30-help-meta-item">
              <FileText size={14} />
              <span>
                Updated <strong>September 24, 2026</strong>
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="br30-help-main">
        <aside className="br30-help-sidebar">
          <div className="br30-help-sidebar-title">Help Topics</div>

          <div className="br30-help-sidebar-list">
            {sections.map((section) => (
              <button key={section.id} type="button" className={activeSection === section.id ? "active" : ""} onClick={() => scrollToSection(section.id)}>
                <span className="br30-help-number">{section.number}</span>
                <span>{section.title}</span>
              </button>
            ))}
          </div>
        </aside>

        <article className="br30-help-content">
          <div className="br30-help-intro">
            <div className="br30-help-intro-top">
              <div className="br30-help-intro-icon">
                <MessageCircle size={18} />
              </div>

              <div>
                <h2>Welcome to the BR30 CRM Help Center</h2>
                <p>Use the sections below to quickly find guidance for common account, CRM, security, billing, and support questions.</p>
              </div>
            </div>
          </div>

          <section id="welcome" className="br30-help-section">
            <div className="br30-help-label">
              <span>01</span> Welcome
            </div>
            <h2>Get help with BR30 CRM</h2>
            <p>BR30 CRM is designed to provide businesses with a centralized workspace for customers, sales, teams, and everyday business operations.</p>
            <p>Use this Help Center for practical guidance and troubleshooting information.</p>
            <div className="br30-help-note">
              <strong>Tip:</strong> If you cannot find an answer here, contact the BR30 CRM support team with as much relevant information as possible.
            </div>
          </section>

          <section id="account" className="br30-help-section">
            <div className="br30-help-label">
              <span>02</span> Account Help
            </div>
            <h2>Managing your account</h2>
            <p>Your BR30 CRM account contains the information required to identify your account and provide access to the platform.</p>
            <ul>
              <li>Keep your account information accurate.</li>
              <li>Use a secure password.</li>
              <li>Keep authentication information private.</li>
              <li>Review your profile and account settings regularly.</li>
            </ul>
          </section>

          <section id="login" className="br30-help-section">
            <div className="br30-help-label">
              <span>03</span> Login & Access
            </div>
            <h2>Problems signing in?</h2>
            <p>If you cannot access your account, first verify that the email address and password you are using are correct.</p>
            <h3>Common checks</h3>
            <ul>
              <li>Confirm that you are using the correct email address.</li>
              <li>Check whether your password was entered correctly.</li>
              <li>Use the Forgot Password option when necessary.</li>
              <li>Complete any email or OTP verification requested by the system.</li>
              <li>Contact support if you believe your account access has been compromised.</li>
            </ul>
          </section>

          <section id="customers" className="br30-help-section">
            <div className="br30-help-label">
              <span>04</span> Customers
            </div>
            <h2>Managing customer records</h2>
            <p>Customer records help keep important business relationship information organized within your CRM workspace.</p>
            <ul>
              <li>Create customer records using accurate information.</li>
              <li>Keep contact details up to date.</li>
              <li>Use notes to preserve useful business context.</li>
              <li>Review records before making important customer decisions.</li>
            </ul>
          </section>

          <section id="sales" className="br30-help-section">
            <div className="br30-help-label">
              <span>05</span> Sales & CRM
            </div>
            <h2>Organize your sales workflow</h2>
            <p>Use supported CRM features to organize leads, customers, deals, activities, and follow-ups.</p>
            <div className="br30-help-card-grid">
              <div className="br30-help-card">
                <div className="br30-help-card-icon">
                  <BookOpen size={15} />
                </div>
                <strong>Customer Workflow</strong>
                <p>Maintain organized customer information and relevant interactions.</p>
              </div>
              <div className="br30-help-card">
                <div className="br30-help-card-icon">
                  <CheckCircle2 size={15} />
                </div>
                <strong>Follow-ups</strong>
                <p>Keep track of important sales activities and next steps.</p>
              </div>
            </div>
          </section>

          <section id="team" className="br30-help-section">
            <div className="br30-help-label">
              <span>06</span> Team & Roles
            </div>
            <h2>Managing team access</h2>
            <p>Workspace administrators can manage team members and available roles according to the permissions supported by BR30 CRM.</p>
            <ul>
              <li>Only invite people who require access.</li>
              <li>Assign appropriate roles and permissions.</li>
              <li>Review team access periodically.</li>
              <li>Remove access when it is no longer required.</li>
            </ul>
          </section>

          <section id="security" className="br30-help-section">
            <div className="br30-help-label">
              <span>07</span> Security
            </div>
            <h2>Keep your account secure</h2>
            <p>Account security is important when storing business and customer information in a CRM platform.</p>
            <ul>
              <li>Never share your password.</li>
              <li>Never share authentication codes with unknown people.</li>
              <li>Use secure devices when accessing your account.</li>
              <li>Report suspicious activity promptly.</li>
            </ul>
            <div className="br30-help-note">
              <strong>Security:</strong> BR30 CRM support will not intentionally ask you to disclose your password or authentication codes through an unsolicited request.
            </div>
          </section>

          <section id="settings" className="br30-help-section">
            <div className="br30-help-label">
              <span>08</span> Settings
            </div>
            <h2>Customize your experience</h2>
            <p>Review your available settings to manage supported preferences, appearance options, notifications, and account-related configuration.</p>
            <ul>
              <li>Review appearance preferences.</li>
              <li>Check notification settings.</li>
              <li>Maintain account information.</li>
              <li>Review available workspace preferences.</li>
            </ul>
          </section>

          <section id="billing" className="br30-help-section">
            <div className="br30-help-label">
              <span>09</span> Billing & Plans
            </div>
            <h2>Questions about billing</h2>
            <p>Billing availability and plan functionality may depend on the BR30 CRM service or subscription associated with your account.</p>
            <p>For account-specific billing questions, create a support ticket and include relevant account information where appropriate.</p>
          </section>

          <section id="troubleshooting" className="br30-help-section">
            <div className="br30-help-label">
              <span>10</span> Troubleshooting
            </div>
            <h2>Common troubleshooting steps</h2>
            <ul>
              <li>Refresh the page and try the action again.</li>
              <li>Check your internet connection.</li>
              <li>Try the latest version of your browser.</li>
              <li>Clear browser cache when appropriate.</li>
              <li>Sign out and sign back in.</li>
              <li>Record the exact error message if the issue continues.</li>
            </ul>
            <div className="br30-help-note">
              <strong>When contacting support:</strong> Include the page name, action you were performing, approximate time of the issue, and exact error message if available.
            </div>
          </section>

          <section id="contact" className="br30-help-section">
            <div className="br30-help-label">
              <span>11</span> Contact Support
            </div>
            <h2>Still need help?</h2>
            <p>If the Help Center does not answer your question, contact the BR30 CRM support team. Providing clear details helps the support team understand your request.</p>

            <div className="br30-help-contact">
              <div className="br30-help-contact-icon">
                <Mail size={16} />
              </div>
              <div>
                <strong>BR30 CRM Support</strong>
                <a href={RESOURCES_HELP_CENTER_SUPPORT_FORM_URL} className="br30-support-ticket-link" rel="noopener noreferrer">
                  Create Support Ticket
                </a>
              </div>
            </div>

            <div className="br30-help-contact">
              <div className="br30-help-contact-icon">
                <UserCheck size={16} />
              </div>
              <div>
                <strong>Account-specific assistance</strong>
                <p>When contacting support about your account, use the email address associated with your BR30 CRM account whenever possible.</p>
              </div>
            </div>
          </section>
        </article>
      </main>

      <button type="button" className="br30-help-top" onClick={handleBackToTop} aria-label="Back to top" title="Back to top">
        <ArrowUp size={16} />
      </button>

      <LandingFooter />
    </div>
  );
}

export default HelpCenter;
