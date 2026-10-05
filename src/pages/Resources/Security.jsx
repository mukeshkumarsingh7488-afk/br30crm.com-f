import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUp, CheckCircle2, ChevronRight, Database, FileCheck2, LockKeyhole, Mail, Server, Shield, ShieldCheck, UserCheck } from "lucide-react";
import LandingNavbar from "../../components/landing/LandingNavbar";
import LandingFooter from "../../components/landing/LandingFooter";
import { RESOURCES_SECURITY_SUPPORT_FORM_URL } from "../../constants/supportForm";

function Security() {
  const [activeSection, setActiveSection] = useState("overview");

  const sections = [
    { id: "overview", number: "01", title: "Security Overview" },
    { id: "account-security", number: "02", title: "Account Security" },
    { id: "access-control", number: "03", title: "Access Control" },
    { id: "data-protection", number: "04", title: "Data Protection" },
    { id: "application-security", number: "05", title: "Application Security" },
    { id: "infrastructure", number: "06", title: "Infrastructure Security" },
    { id: "monitoring", number: "07", title: "Monitoring & Logging" },
    { id: "incident-response", number: "08", title: "Incident Response" },
    { id: "backups", number: "09", title: "Backups & Recovery" },
    { id: "third-party", number: "10", title: "Third-Party Services" },
    { id: "customer-responsibility", number: "11", title: "Customer Responsibility" },
    { id: "security-requests", number: "12", title: "Security Requests" },
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
      <style>{`.br30-legal-page{min-height:100vh;background:var(--crm-bg);color:var(--crm-text);font-family:var(--crm-font)}.br30-legal-page *,.br30-legal-page *::before,.br30-legal-page *::after{box-sizing:border-box}.br30-legal-hero{padding:142px 24px 58px;border-bottom:1px solid var(--crm-border);background:var(--crm-bg)}.br30-legal-hero-inner{width:100%;max-width:1120px;margin:0 auto}.br30-legal-breadcrumb{display:flex;align-items:center;gap:6px;margin-bottom:24px;color:var(--crm-muted);font-size:13px}.br30-legal-breadcrumb a{color:var(--crm-muted);text-decoration:none}.br30-legal-breadcrumb a:hover{color:var(--crm-primary)}.br30-legal-breadcrumb svg{opacity:.5}.br30-legal-eyebrow{display:inline-flex;align-items:center;gap:7px;color:var(--crm-primary);font-size:13px;font-weight:400;letter-spacing:.08em;text-transform:uppercase}.br30-legal-eyebrow-dot{width:6px;height:6px;border-radius:50%;background:var(--crm-primary)}.br30-legal-hero h1{margin:16px 0 14px;color:var(--crm-text);font-size:clamp(32px,4vw,48px);line-height:1.12;letter-spacing:-.025em;font-weight:400}.br30-legal-hero h1 span{color:var(--crm-primary)}.br30-legal-hero-description{max-width:760px;margin:0;color:var(--crm-muted);font-size:14px;line-height:1.75}.br30-legal-meta{display:flex;flex-wrap:wrap;gap:8px;margin-top:25px}.br30-legal-meta-item{display:flex;align-items:center;gap:7px;min-height:35px;padding:7px 11px;border:1px solid var(--crm-border);border-radius:9px;background:var(--crm-surface);color:var(--crm-muted);font-size:13px}.br30-legal-meta-item svg{color:var(--crm-primary)}.br30-legal-meta-item strong{color:var(--crm-text);font-weight:400}.br30-legal-main{width:100%;max-width:1120px;margin:0 auto;padding:52px 24px 80px;display:grid;grid-template-columns:235px minmax(0,1fr);gap:50px;align-items:start}.br30-legal-sidebar{position:sticky;top:100px;max-height:calc(100vh - 120px);overflow:auto;padding:7px;border:1px solid var(--crm-border);border-radius:13px;background:var(--crm-surface);box-shadow:var(--crm-shadow);scrollbar-width:thin}.br30-legal-sidebar-title{padding:9px 10px 11px;color:var(--crm-text);font-size:13px;font-weight:400;letter-spacing:.06em;text-transform:uppercase}.br30-legal-sidebar-list{display:flex;flex-direction:column;gap:1px}.br30-legal-sidebar button{width:100%;display:flex;align-items:center;gap:8px;padding:8px 9px;border:0;border-radius:8px;background:transparent;color:var(--crm-muted);font:inherit;font-size:13px;line-height:1.35;text-align:left;cursor:pointer}.br30-legal-sidebar button:hover{background:var(--crm-surface-2);color:var(--crm-text)}.br30-legal-sidebar button.active{background:var(--crm-primary-soft);color:var(--crm-primary);font-weight:400}.br30-legal-sidebar-number{width:22px;flex:0 0 22px;font-size:13px;font-weight:400;opacity:.7}.br30-legal-content{min-width:0}.br30-legal-intro-card{margin-bottom:34px;padding:21px;border:1px solid var(--crm-border);border-radius:13px;background:var(--crm-surface);box-shadow:var(--crm-shadow)}.br30-legal-intro-card-top{display:flex;align-items:flex-start;gap:13px}.br30-legal-intro-icon{width:38px;height:38px;flex:0 0 38px;display:grid;place-items:center;border-radius:9px;background:var(--crm-primary-soft);border:1px solid var(--crm-border);color:var(--crm-primary)}.br30-legal-intro-card h2{margin:0 0 5px;color:var(--crm-text);font-size:15px;font-weight:400;line-height:1.4}.br30-legal-intro-card p{margin:0;color:var(--crm-muted);font-size:13px;line-height:1.75}.br30-security-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:18px 0 5px}.br30-security-card{padding:15px;border:1px solid var(--crm-border);border-radius:11px;background:var(--crm-surface-2)}.br30-security-card-icon{width:32px;height:32px;display:grid;place-items:center;margin-bottom:10px;border-radius:8px;background:var(--crm-primary-soft);color:var(--crm-primary)}.br30-security-card strong{display:block;margin-bottom:4px;color:var(--crm-text);font-size:13px}.br30-security-card span{display:block;color:var(--crm-muted);font-size:13px;line-height:1.65}.br30-legal-section{scroll-margin-top:110px;padding:0 0 38px;margin-bottom:38px;border-bottom:1px solid var(--crm-border)}.br30-legal-section:last-child{border-bottom:0;margin-bottom:0}.br30-legal-section-label{display:flex;align-items:center;gap:8px;margin-bottom:10px;color:var(--crm-primary);font-size:13px;font-weight:400;letter-spacing:.08em;text-transform:uppercase}.br30-legal-section-label span{opacity:.65}.br30-legal-section h2{margin:0 0 14px;color:var(--crm-text);font-size:20px;line-height:1.35;font-weight:400;letter-spacing:-.01em}.br30-legal-section h3{margin:22px 0 8px;color:var(--crm-text);font-size:14px;line-height:1.45;font-weight:400}.br30-legal-section p{margin:0 0 13px;color:var(--crm-muted);font-size:13px;line-height:1.85}.br30-legal-section p:last-child{margin-bottom:0}.br30-legal-section ul{margin:10px 0 17px;padding-left:20px}.br30-legal-section li{margin:7px 0;padding-left:2px;color:var(--crm-muted);font-size:13px;line-height:1.75}.br30-legal-section li::marker{color:var(--crm-primary)}.br30-legal-note{margin:18px 0;padding:14px 16px;border-left:3px solid var(--crm-primary);border-radius:0 9px 9px 0;background:var(--crm-surface-2);color:var(--crm-muted);font-size:13px;line-height:1.75}.br30-legal-note strong{color:var(--crm-text)}.br30-security-check-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin:15px 0 18px}.br30-security-check{display:flex;align-items:flex-start;gap:8px;padding:11px 12px;border:1px solid var(--crm-border);border-radius:9px;background:var(--crm-surface)}.br30-security-check svg{flex:0 0 auto;margin-top:2px;color:var(--crm-primary)}.br30-security-check span{color:var(--crm-muted);font-size:13px;line-height:1.6}.br30-legal-contact-card{display:grid;grid-template-columns:auto 1fr;gap:12px;margin-top:18px;padding:17px;border:1px solid var(--crm-border);border-radius:11px;background:var(--crm-surface)}.br30-legal-contact-icon{width:36px;height:36px;display:grid;place-items:center;border-radius:9px;background:var(--crm-primary-soft);color:var(--crm-primary)}.br30-legal-contact-card strong{display:block;margin-bottom:4px;color:var(--crm-text);font-size:13px}.br30-legal-contact-card a{color:var(--crm-primary);font-size:13px;text-decoration:none}.br30-legal-contact-card a:hover{text-decoration:underline}.br30-legal-contact-card p{margin:0!important}.br30-legal-top-button{position:fixed;right:20px;bottom:20px;z-index:30;width:38px;height:38px;display:grid;place-items:center;border:1px solid var(--crm-border);border-radius:10px;background:var(--crm-surface);color:var(--crm-text);box-shadow:var(--crm-shadow);cursor:pointer;transition:.2s}.br30-legal-top-button:hover{border-color:var(--crm-primary);color:var(--crm-primary);transform:translateY(-2px)}@media(max-width:900px){.br30-legal-main{grid-template-columns:1fr;gap:25px}.br30-legal-sidebar{position:relative;top:auto;max-height:none}.br30-legal-sidebar-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr))}.br30-security-grid,.br30-security-check-list{grid-template-columns:1fr}}@media(max-width:600px){.br30-legal-hero{padding:120px 17px 45px}.br30-legal-hero h1{font-size:34px}.br30-legal-hero-description{font-size:13px}.br30-legal-meta{display:grid;grid-template-columns:1fr}.br30-legal-main{padding:35px 17px 60px}.br30-legal-sidebar-list{grid-template-columns:1fr}.br30-legal-intro-card{padding:18px}.br30-legal-section{scroll-margin-top:90px;padding-bottom:32px;margin-bottom:32px}.br30-legal-section h2{font-size:18px}.br30-legal-section p,.br30-legal-section li{font-size:13px}.br30-legal-contact-card{grid-template-columns:1fr}.br30-legal-top-button{right:13px;bottom:13px}}`}</style>

      <LandingNavbar />

      <header className="br30-legal-hero">
        <div className="br30-legal-hero-inner">
          <div className="br30-legal-breadcrumb">
            <Link to="/">Home</Link>
            <ChevronRight size={13} />
            <span>Resources</span>
            <ChevronRight size={13} />
            <span>Security</span>
          </div>

          <div className="br30-legal-eyebrow">
            <span className="br30-legal-eyebrow-dot" />
            BR30 CRM Security
          </div>

          <h1>
            Security <span>at BR30 CRM</span>
          </h1>

          <p className="br30-legal-hero-description">BR30 CRM is designed with security-focused controls across account access, application operations, infrastructure, data handling, monitoring, and incident response to help protect business information entrusted to the platform.</p>

          <div className="br30-legal-meta">
            <div className="br30-legal-meta-item">
              <Database size={14} />
              <span>
                Last Updated <strong>September 24, 2026</strong>
              </span>
            </div>

            <div className="br30-legal-meta-item">
              <ShieldCheck size={14} />
              <span>
                Effective From <strong>September 24, 2026</strong>
              </span>
            </div>

            <div className="br30-legal-meta-item">
              <FileCheck2 size={14} />
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
                <Shield size={18} />
              </div>

              <div>
                <h2>Security is part of the BR30 CRM experience</h2>

                <p>We use a combination of technical, organizational, and operational safeguards intended to protect accounts, applications, infrastructure, and information handled through BR30 CRM.</p>
              </div>
            </div>

            <div className="br30-security-grid">
              <div className="br30-security-card">
                <div className="br30-security-card-icon">
                  <LockKeyhole size={15} />
                </div>
                <strong>Account Protection</strong>
                <span>Authentication and access controls help protect individual accounts and business workspaces.</span>
              </div>

              <div className="br30-security-card">
                <div className="br30-security-card-icon">
                  <Server size={15} />
                </div>
                <strong>Infrastructure Controls</strong>
                <span>Operational safeguards are used to support reliable and controlled service infrastructure.</span>
              </div>

              <div className="br30-security-card">
                <div className="br30-security-card-icon">
                  <Database size={15} />
                </div>
                <strong>Data Protection</strong>
                <span>Data handling practices are designed to reduce unauthorized access and unnecessary exposure.</span>
              </div>

              <div className="br30-security-card">
                <div className="br30-security-card-icon">
                  <ShieldCheck size={15} />
                </div>
                <strong>Security Monitoring</strong>
                <span>Relevant system activity may be monitored and logged to help identify operational and security issues.</span>
              </div>
            </div>
          </div>

          <section id="overview" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>01</span>
              Security Overview
            </div>

            <h2>Our approach to security</h2>

            <p>Security is an important part of operating BR30 CRM. We aim to protect information and services through appropriate technical and organizational measures that are proportionate to the nature of the platform and the information handled.</p>

            <p>Our security practices may evolve as our technology, services, infrastructure, operational requirements, and security environment change.</p>

            <div className="br30-legal-note">
              <strong>Important:</strong> No internet-connected service can guarantee absolute security. Security depends on both platform safeguards and the actions taken by users and organizations.
            </div>
          </section>

          <section id="account-security" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>02</span>
              Account Security
            </div>

            <h2>Protecting user accounts</h2>

            <p>BR30 CRM uses authentication and account-management mechanisms intended to help prevent unauthorized access to user accounts.</p>

            <div className="br30-security-check-list">
              <div className="br30-security-check">
                <CheckCircle2 size={14} />
                <span>Account authentication and credential controls.</span>
              </div>

              <div className="br30-security-check">
                <CheckCircle2 size={14} />
                <span>Session and authentication-state protections.</span>
              </div>

              <div className="br30-security-check">
                <CheckCircle2 size={14} />
                <span>Controls designed to reduce unauthorized access.</span>
              </div>

              <div className="br30-security-check">
                <CheckCircle2 size={14} />
                <span>Security-related account activity handling.</span>
              </div>
            </div>

            <p>Users are responsible for maintaining the confidentiality of their passwords, authentication information, devices, and recovery details.</p>
          </section>

          <section id="access-control" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>03</span>
              Access Control
            </div>

            <h2>Controlled access to information</h2>

            <p>BR30 CRM may use role-based permissions and other access-control mechanisms to help determine what users can access within a business workspace.</p>

            <h3>Role-based access</h3>

            <p>Depending on the account configuration, different users may have different permissions based on their assigned roles and responsibilities.</p>

            <h3>Least-privilege principles</h3>

            <p>Access controls are intended to limit access to information and functionality to the level reasonably necessary for a user's authorized responsibilities.</p>

            <h3>Administrative access</h3>

            <p>Administrative functionality may be restricted to authorized personnel or users with appropriate account permissions.</p>
          </section>

          <section id="data-protection" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>04</span>
              Data Protection
            </div>

            <h2>Protecting business information</h2>

            <p>BR30 CRM is designed to support the responsible handling of customer and business information entered into the platform.</p>

            <ul>
              <li>Access controls intended to limit unauthorized access.</li>
              <li>Appropriate safeguards around account and session information.</li>
              <li>Operational practices designed to reduce unnecessary exposure.</li>
              <li>Security monitoring and logging where appropriate.</li>
              <li>Procedures intended to support security incident handling.</li>
            </ul>

            <p>Customers should also configure their workspace permissions appropriately and avoid storing information that is unnecessary for their legitimate business purposes.</p>
          </section>

          <section id="application-security" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>05</span>
              Application Security
            </div>

            <h2>Security within the BR30 CRM application</h2>

            <p>Application security is considered throughout the development, deployment, maintenance, and operation of BR30 CRM.</p>

            <h3>Authentication</h3>

            <p>Authentication mechanisms are used to verify users before allowing access to protected areas of the platform.</p>

            <h3>Input and request handling</h3>

            <p>Application requests and user-provided information may be validated and handled using controls intended to reduce common application security risks.</p>

            <h3>Ongoing improvements</h3>

            <p>Security practices may be reviewed and improved as new vulnerabilities, technologies, and operational requirements are identified.</p>
          </section>

          <section id="infrastructure" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>06</span>
              Infrastructure Security
            </div>

            <h2>Infrastructure and service environment</h2>

            <p>BR30 CRM may rely on hosting, cloud, database, networking, email, authentication, monitoring, and other infrastructure providers to operate the platform.</p>

            <p>Infrastructure components may be configured with access controls, authentication mechanisms, monitoring, and other operational safeguards appropriate to their role in the service.</p>

            <div className="br30-legal-note">
              <strong>Third-party infrastructure:</strong> Some underlying infrastructure may be operated by specialized service providers. Their own security practices and contractual commitments may also apply to the services they provide.
            </div>
          </section>

          <section id="monitoring" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>07</span>
              Monitoring & Logging
            </div>

            <h2>Monitoring relevant system activity</h2>

            <p>Where appropriate, BR30 CRM may maintain logs and monitor relevant system activity to support security, reliability, troubleshooting, abuse prevention, and operational management.</p>

            <ul>
              <li>Authentication and access-related events.</li>
              <li>Application and system activity.</li>
              <li>Operational errors and service events.</li>
              <li>Security-relevant events where appropriate.</li>
              <li>Performance and reliability information.</li>
            </ul>

            <p>Logs and monitoring information may be retained for periods appropriate to their operational, security, and legal purposes.</p>
          </section>

          <section id="incident-response" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>08</span>
              Incident Response
            </div>

            <h2>Responding to security incidents</h2>

            <p>BR30 CRM may maintain operational procedures for identifying, investigating, containing, and responding to security incidents that affect the platform or information handled through it.</p>

            <h3>Detection and investigation</h3>

            <p>Relevant alerts, reports, logs, and other available information may be reviewed to understand the nature and scope of a security event.</p>

            <h3>Containment and remediation</h3>

            <p>Where appropriate, steps may be taken to contain an incident, protect affected systems, restore normal operation, and reduce the likelihood of recurrence.</p>

            <h3>Customer communication</h3>

            <p>Where notification is required by applicable law or contractual obligations, affected customers may be contacted using available account or organizational contact information.</p>
          </section>

          <section id="backups" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>09</span>
              Backups & Recovery
            </div>

            <h2>Service continuity and recovery</h2>

            <p>Depending on the service architecture and infrastructure used, BR30 CRM may use backups and recovery procedures intended to support service continuity and restore information following certain operational failures.</p>

            <p>Backup availability, retention, restoration procedures, and recovery objectives may vary depending on the relevant service, infrastructure, and operational requirements.</p>

            <div className="br30-legal-note">
              <strong>Customer responsibility:</strong> Customers should maintain their own appropriate records and business continuity procedures for information that is critical to their operations.
            </div>
          </section>

          <section id="third-party" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>10</span>
              Third-Party Services
            </div>

            <h2>External providers and integrations</h2>

            <p>BR30 CRM may use third-party services for hosting, databases, email delivery, authentication, payments, analytics, monitoring, security, communications, and other operational functions.</p>

            <p>Information processed by these providers may be subject to their applicable security practices, terms, contractual commitments, and privacy policies.</p>

            <p>We seek to work with service providers appropriate to the role they perform within the BR30 CRM service environment.</p>
          </section>

          <section id="customer-responsibility" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>11</span>
              Customer Responsibility
            </div>

            <h2>Security is a shared responsibility</h2>

            <p>Platform security depends not only on BR30 CRM controls but also on how customers and users configure and use their accounts.</p>

            <ul>
              <li>Use strong and unique account credentials.</li>
              <li>Do not share passwords or authentication codes.</li>
              <li>Assign appropriate roles and permissions.</li>
              <li>Remove access for users who no longer need it.</li>
              <li>Keep devices and browsers reasonably protected.</li>
              <li>Report suspected unauthorized access promptly.</li>
              <li>Avoid entering unnecessary sensitive information into the platform.</li>
            </ul>

            <p>Customers should establish internal policies appropriate to their own organization, workforce, regulatory obligations, and business requirements.</p>
          </section>

          <section id="security-requests" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>12</span>
              Security Requests
            </div>

            <h2>Questions and security concerns</h2>

            <p>If you identify a suspected security issue, unauthorized account activity, data exposure, or another security concern involving BR30 CRM, please contact our support team with relevant details.</p>

            <div className="br30-legal-contact-card">
              <div className="br30-legal-contact-icon">
                <Mail size={16} />
              </div>

              <div>
                <strong>Security & Support</strong>

                <a href={RESOURCES_SECURITY_SUPPORT_FORM_URL} className="br30-support-ticket-link" target="_blank" rel="noopener noreferrer">
                  Create Support Ticket
                </a>
              </div>
            </div>

            <div className="br30-legal-contact-card">
              <div className="br30-legal-contact-icon">
                <UserCheck size={16} />
              </div>

              <div>
                <strong>Responsible Reporting</strong>

                <p>Please avoid publicly disclosing sensitive security details before BR30 CRM has had a reasonable opportunity to review and address the reported issue.</p>
              </div>
            </div>

            <div className="br30-legal-note">
              <strong>Security reporting:</strong> When reporting an issue, include enough information to help us understand the affected feature, account, behavior, or environment without unnecessarily including passwords, authentication codes, or other sensitive credentials.
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

export default Security;
