import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUp, CheckCircle2, ChevronRight, Clock3, FileText, Mail, MessageSquare, Phone, Send, ShieldCheck, Ticket } from "lucide-react";
import LandingNavbar from "../../components/landing/LandingNavbar";
import LandingFooter from "../../components/landing/LandingFooter";
import { SUPPORT_FORM_URL } from "../../constants/supportForm";

function Contact() {
  const [activeSection, setActiveSection] = useState("contact-support");

  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="br30-legal-page">
      <style>{`.br30-legal-page{min-height:100vh;background:var(--crm-bg);color:var(--crm-text);font-family:var(--crm-font)}.br30-legal-page *,.br30-legal-page *::before,.br30-legal-page *::after{box-sizing:border-box}.br30-legal-hero{padding:142px 24px 58px;border-bottom:1px solid var(--crm-border);background:var(--crm-bg)}.br30-legal-hero-inner{width:100%;max-width:1120px;margin:0 auto}.br30-legal-breadcrumb{display:flex;align-items:center;gap:6px;margin-bottom:24px;color:var(--crm-muted);font-size:13px}.br30-legal-breadcrumb a{color:var(--crm-muted);text-decoration:none}.br30-legal-breadcrumb a:hover{color:var(--crm-primary)}.br30-legal-breadcrumb svg{opacity:.5}.br30-legal-eyebrow{display:inline-flex;align-items:center;gap:7px;color:var(--crm-primary);font-size:13px;font-weight:400;letter-spacing:.08em;text-transform:uppercase}.br30-legal-eyebrow-dot{width:6px;height:6px;border-radius:50%;background:var(--crm-primary)}.br30-legal-hero h1{margin:16px 0 14px;color:var(--crm-text);font-size:clamp(32px,4vw,48px);line-height:1.12;letter-spacing:-.025em;font-weight:400}.br30-legal-hero h1 span{color:var(--crm-primary)}.br30-legal-hero-description{max-width:760px;margin:0;color:var(--crm-muted);font-size:14px;line-height:1.75}.br30-legal-meta{display:flex;flex-wrap:wrap;gap:8px;margin-top:25px}.br30-legal-meta-item{display:flex;align-items:center;gap:7px;min-height:35px;padding:7px 11px;border:1px solid var(--crm-border);border-radius:9px;background:var(--crm-surface);color:var(--crm-muted);font-size:13px}.br30-legal-meta-item svg{color:var(--crm-primary)}.br30-legal-meta-item strong{color:var(--crm-text);font-weight:400}.br30-legal-main{width:100%;max-width:1120px;margin:0 auto;padding:52px 24px 80px;display:grid;grid-template-columns:235px minmax(0,1fr);gap:50px;align-items:start}.br30-legal-sidebar{position:sticky;top:100px;max-height:calc(100vh - 120px);overflow:auto;padding:7px;border:1px solid var(--crm-border);border-radius:13px;background:var(--crm-surface);box-shadow:var(--crm-shadow);scrollbar-width:thin}.br30-legal-sidebar-title{padding:9px 10px 11px;color:var(--crm-text);font-size:13px;font-weight:400;letter-spacing:.06em;text-transform:uppercase}.br30-legal-sidebar-list{display:flex;flex-direction:column;gap:1px}.br30-legal-sidebar button{width:100%;display:flex;align-items:center;gap:8px;padding:8px 9px;border:0;border-radius:8px;background:transparent;color:var(--crm-muted);font:inherit;font-size:13px;line-height:1.35;text-align:left;cursor:pointer}.br30-legal-sidebar button:hover{background:var(--crm-surface-2);color:var(--crm-text)}.br30-legal-sidebar button.active{background:var(--crm-primary-soft);color:var(--crm-primary);font-weight:400}.br30-legal-sidebar-number{width:22px;flex:0 0 22px;font-size:13px;font-weight:400;opacity:.7}.br30-legal-content{min-width:0}.br30-legal-intro-card{margin-bottom:34px;padding:21px;border:1px solid var(--crm-border);border-radius:13px;background:var(--crm-surface);box-shadow:var(--crm-shadow)}.br30-legal-intro-card-top{display:flex;align-items:flex-start;gap:13px}.br30-legal-intro-icon{width:38px;height:38px;flex:0 0 38px;display:grid;place-items:center;border-radius:9px;background:var(--crm-primary-soft);border:1px solid var(--crm-border);color:var(--crm-primary)}.br30-legal-intro-card h2{margin:0 0 5px;color:var(--crm-text);font-size:15px;font-weight:400;line-height:1.4}.br30-legal-intro-card p{margin:0;color:var(--crm-muted);font-size:13px;line-height:1.75}.br30-legal-section{scroll-margin-top:110px;padding:0 0 38px;margin-bottom:38px;border-bottom:1px solid var(--crm-border)}.br30-legal-section:last-child{border-bottom:0;margin-bottom:0}.br30-legal-section-label{display:flex;align-items:center;gap:8px;margin-bottom:10px;color:var(--crm-primary);font-size:13px;font-weight:400;letter-spacing:.08em;text-transform:uppercase}.br30-legal-section-label span{opacity:.65}.br30-legal-section h2{margin:0 0 14px;color:var(--crm-text);font-size:20px;line-height:1.35;font-weight:400;letter-spacing:-.01em}.br30-legal-section h3{margin:22px 0 8px;color:var(--crm-text);font-size:14px;line-height:1.45;font-weight:400}.br30-legal-section p{margin:0 0 13px;color:var(--crm-muted);font-size:13px;line-height:1.85}.br30-legal-section p:last-child{margin-bottom:0}.br30-legal-section ul{margin:10px 0 17px;padding-left:20px}.br30-legal-section li{margin:7px 0;padding-left:2px;color:var(--crm-muted);font-size:13px;line-height:1.75}.br30-legal-section li::marker{color:var(--crm-primary)}.br30-legal-note{margin:18px 0;padding:14px 16px;border-left:3px solid var(--crm-primary);border-radius:0 9px 9px 0;background:var(--crm-surface-2);color:var(--crm-muted);font-size:13px;line-height:1.75}.br30-legal-note strong{color:var(--crm-text)}.br30-legal-contact-card{display:grid;grid-template-columns:auto 1fr;gap:12px;margin-top:18px;padding:17px;border:1px solid var(--crm-border);border-radius:11px;background:var(--crm-surface)}.br30-legal-contact-icon{width:36px;height:36px;display:grid;place-items:center;border-radius:9px;background:var(--crm-primary-soft);color:var(--crm-primary)}.br30-legal-contact-card strong{display:block;margin-bottom:4px;color:var(--crm-text);font-size:13px}.br30-legal-contact-card a{color:var(--crm-primary);font-size:13px;text-decoration:none}.br30-legal-contact-card a:hover{text-decoration:underline}.br30-legal-contact-card p{margin:0!important}.br30-contact-form{display:grid;gap:15px}.br30-contact-grid{display:grid;grid-template-columns:1fr 1fr;gap:15px}.br30-contact-field{display:flex;flex-direction:column;gap:7px}.br30-contact-label{color:var(--crm-text);font-size:13px;font-weight:400}.br30-contact-input,.br30-contact-select,.br30-contact-textarea{width:100%;border:1px solid var(--crm-border);border-radius:9px;background:var(--crm-surface-2);color:var(--crm-text);font:inherit;font-size:13px;outline:none;transition:.2s}.br30-contact-input,.br30-contact-select{height:40px;padding:0 12px}.br30-contact-textarea{min-height:125px;padding:11px 12px;resize:vertical;line-height:1.6}.br30-contact-input::placeholder,.br30-contact-textarea::placeholder{color:var(--crm-muted);opacity:.7}.br30-contact-input:focus,.br30-contact-select:focus,.br30-contact-textarea:focus{border-color:var(--crm-primary);box-shadow:0 0 0 3px var(--crm-primary-soft)}.br30-contact-submit{height:42px;display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:0 17px;border:1px solid var(--crm-primary);border-radius:9px;background:var(--crm-primary);color:#fff!important;font:inherit;font-size:13px;font-weight:500;text-decoration:none!important;cursor:pointer;transition:.2s}.br30-contact-submit:hover{background:var(--crm-primary-hover);color:#fff!important;text-decoration:none!important;transform:translateY(-1px)}.br30-contact-submit:disabled{opacity:.65;cursor:not-allowed;transform:none}.br30-contact-email-link{display:inline-flex;align-items:center;gap:7px;margin-top:4px;color:var(--crm-primary);font-size:13px;text-decoration:none}.br30-contact-email-link:hover{text-decoration:underline}.br30-legal-top-button{position:fixed;right:20px;bottom:20px;z-index:30;width:38px;height:38px;display:grid;place-items:center;border:1px solid var(--crm-border);border-radius:10px;background:var(--crm-surface);color:var(--crm-text);box-shadow:var(--crm-shadow);cursor:pointer;transition:.2s}.br30-legal-top-button:hover{border-color:var(--crm-primary);color:var(--crm-primary);transform:translateY(-2px)}@media(max-width:900px){.br30-legal-main{grid-template-columns:1fr;gap:25px}.br30-legal-sidebar{position:relative;top:auto;max-height:none}.br30-legal-sidebar-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:600px){.br30-legal-hero{padding:120px 17px 45px}.br30-legal-hero h1{font-size:34px}.br30-legal-hero-description{font-size:13px}.br30-legal-meta{display:grid;grid-template-columns:1fr}.br30-legal-main{padding:35px 17px 60px}.br30-legal-sidebar-list{grid-template-columns:1fr}.br30-legal-intro-card{padding:18px}.br30-legal-section{scroll-margin-top:90px;padding-bottom:32px;margin-bottom:32px}.br30-legal-section h2{font-size:18px}.br30-legal-section p,.br30-legal-section li{font-size:13px}.br30-legal-contact-card{grid-template-columns:1fr}.br30-contact-grid{grid-template-columns:1fr}.br30-legal-top-button{right:13px;bottom:13px}}`}</style>

      <LandingNavbar />

      <header className="br30-legal-hero">
        <div className="br30-legal-hero-inner">
          <div className="br30-legal-breadcrumb">
            <Link to="/">Home</Link>
            <ChevronRight size={13} />
            <span>Company</span>
            <ChevronRight size={13} />
            <span>Contact</span>
          </div>

          <div className="br30-legal-eyebrow">
            <span className="br30-legal-eyebrow-dot" />
            BR30 CRM Support
          </div>

          <h1>
            Contact <span>Support</span>
          </h1>

          <p className="br30-legal-hero-description">Need help with BR30 CRM? Create a support ticket, report an issue, ask a question, or contact our support team directly. We are here to help you with your BR30 CRM experience.</p>

          <div className="br30-legal-meta">
            <div className="br30-legal-meta-item">
              <Ticket size={14} />
              <span>
                Support <strong>Ticket System</strong>
              </span>
            </div>

            <div className="br30-legal-meta-item">
              <Clock3 size={14} />
              <span>
                Support <strong>Business Hours</strong>
              </span>
            </div>

            <div className="br30-legal-meta-item">
              <Mail size={14} />
              <span>
                Support <strong>Ticket System</strong>
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="br30-legal-main">
        <aside className="br30-legal-sidebar">
          <div className="br30-legal-sidebar-title">On this page</div>

          <div className="br30-legal-sidebar-list">
            <button
              type="button"
              className={activeSection === "contact-support" ? "active" : ""}
              onClick={() => {
                document.getElementById("contact-support")?.scrollIntoView({ behavior: "smooth", block: "start" });
                setActiveSection("contact-support");
              }}>
              <span className="br30-legal-sidebar-number">01</span>
              <span>Contact Support</span>
            </button>

            <button
              type="button"
              className={activeSection === "ticket-system" ? "active" : ""}
              onClick={() => {
                document.getElementById("ticket-system")?.scrollIntoView({ behavior: "smooth", block: "start" });
                setActiveSection("ticket-system");
              }}>
              <span className="br30-legal-sidebar-number">02</span>
              <span>Support Tickets</span>
            </button>

            <button
              type="button"
              className={activeSection === "support-form" ? "active" : ""}
              onClick={() => {
                document.getElementById("support-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
                setActiveSection("support-form");
              }}>
              <span className="br30-legal-sidebar-number">03</span>
              <span>Create Ticket</span>
            </button>

            <button
              type="button"
              className={activeSection === "email-support" ? "active" : ""}
              onClick={() => {
                document.getElementById("email-support")?.scrollIntoView({ behavior: "smooth", block: "start" });
                setActiveSection("email-support");
              }}>
              <span className="br30-legal-sidebar-number">04</span>
              <span>Ticket Access</span>
            </button>
          </div>
        </aside>

        <article className="br30-legal-content">
          <div className="br30-legal-intro-card">
            <div className="br30-legal-intro-card-top">
              <div className="br30-legal-intro-icon">
                <MessageSquare size={18} />
              </div>

              <div>
                <h2>We are here to help</h2>

                <p>Use the BR30 CRM support ticket system to submit your request with the relevant details. Your request will be routed through our CRM support workflow.</p>
              </div>
            </div>
          </div>

          <section id="contact-support" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>01</span>
              Contact Support
            </div>

            <h2>How can we help?</h2>

            <p>Whether you have an account question, technical issue, billing concern, feature request, or general question about BR30 CRM, you can contact our support team.</p>

            <ul>
              <li>Account and login assistance.</li>
              <li>Technical and application issues.</li>
              <li>Billing and subscription questions.</li>
              <li>Feature and product-related questions.</li>
              <li>Security or account-access concerns.</li>
              <li>General BR30 CRM support requests.</li>
            </ul>

            <div className="br30-legal-note">
              <strong>For faster support:</strong> Include your account email, a clear subject, and as much relevant information about the issue as possible.
            </div>
          </section>

          <section id="ticket-system" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>02</span>
              Support Tickets
            </div>

            <h2>Submit a support request</h2>

            <p>BR30 CRM uses support requests to organize customer questions and issues. A detailed request helps the support team understand the problem and respond more efficiently.</p>

            <h3>What to include</h3>

            <ul>
              <li>Your name and account email.</li>
              <li>A short and clear subject.</li>
              <li>The issue or request you are contacting us about.</li>
              <li>Relevant error messages or steps that caused the issue.</li>
              <li>Any additional information that may help investigation.</li>
            </ul>
          </section>

          <section id="support-form" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>03</span>
              Create Ticket
            </div>

            <h2>Open a support ticket</h2>

            <p>Use the BR30 CRM support form to provide your details and describe your issue. The request will enter our support workflow and can be tracked by the support team.</p>

            <div className="br30-legal-contact-card">
              <div className="br30-legal-contact-icon">
                <Ticket size={16} />
              </div>

              <div>
                <strong>BR30 Support Ticket</strong>
                <p>Create a ticket for account, technical, billing, product, security, or general support requests.</p>
                <a href={SUPPORT_FORM_URL} className="br30-contact-submit" target="_blank" rel="noopener noreferrer">
                  <Ticket size={14} />
                  Create Support Ticket
                </a>
              </div>
            </div>
          </section>

          <section id="email-support" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>04</span>
              Ticket Access
            </div>

            <h2>Use the support ticket system</h2>

            <p>We no longer use direct email as the primary support intake. Create a ticket so your request can be captured, categorized, and handled through BR30 CRM.</p>

            <div className="br30-legal-contact-card">
              <div className="br30-legal-contact-icon">
                <Ticket size={16} />
              </div>

              <div>
                <strong>Create Support Ticket</strong>
                <p>Please submit your request through the official BR30 CRM support form.</p>
                <a href={SUPPORT_FORM_URL} className="br30-contact-submit" target="_blank" rel="noopener noreferrer">
                  <Ticket size={14} />
                  Open Support Form
                </a>
              </div>
            </div>

            <div className="br30-legal-contact-card">
              <div className="br30-legal-contact-icon">
                <ShieldCheck size={16} />
              </div>

              <div>
                <strong>Account & Security</strong>
                <p>For account-specific requests or security concerns, submit the ticket using the email address associated with your BR30 CRM account whenever possible.</p>
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

export default Contact;
