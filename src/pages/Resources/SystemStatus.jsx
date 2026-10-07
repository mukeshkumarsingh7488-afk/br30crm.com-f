import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUp, CheckCircle2, ChevronRight, Clock3, FileText, Mail, Server, ShieldCheck, Wrench, AlertTriangle, Activity } from "lucide-react";
import LandingNavbar from "../../components/landing/LandingNavbar";
import LandingFooter from "../../components/landing/LandingFooter";

function SystemStatus() {
  const [activeSection, setActiveSection] = useState("overview");

  const sections = [
    { id: "overview", number: "01", title: "System Overview" },
    { id: "service-status", number: "02", title: "Service Status" },
    { id: "availability", number: "03", title: "Availability" },
    { id: "maintenance", number: "04", title: "Maintenance" },
    { id: "incidents", number: "05", title: "Service Incidents" },
    { id: "degraded-service", number: "06", title: "Degraded Service" },
    { id: "security", number: "07", title: "Security & Monitoring" },
    { id: "notifications", number: "08", title: "Notifications" },
    { id: "historical-status", number: "09", title: "Status History" },
    { id: "third-party", number: "10", title: "Third-Party Services" },
    { id: "maintenance-windows", number: "11", title: "Maintenance Windows" },
    { id: "support", number: "12", title: "Support" },
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
      <style>{`.br30-legal-page{min-height:100vh;background:var(--crm-bg);color:var(--crm-text);font-family:var(--crm-font)}.br30-legal-page *,.br30-legal-page *::before,.br30-legal-page *::after{box-sizing:border-box}.br30-legal-hero{padding:142px 24px 58px;border-bottom:1px solid var(--crm-border);background:var(--crm-bg)}.br30-legal-hero-inner{width:100%;max-width:1120px;margin:0 auto}.br30-legal-breadcrumb{display:flex;align-items:center;gap:6px;margin-bottom:24px;color:var(--crm-muted);font-size:13px}.br30-legal-breadcrumb a{color:var(--crm-muted);text-decoration:none}.br30-legal-breadcrumb a:hover{color:var(--crm-primary)}.br30-legal-breadcrumb svg{opacity:.5}.br30-legal-eyebrow{display:inline-flex;align-items:center;gap:7px;color:var(--crm-primary);font-size:13px;font-weight:400;letter-spacing:.08em;text-transform:uppercase}.br30-legal-eyebrow-dot{width:6px;height:6px;border-radius:50%;background:var(--crm-primary)}.br30-legal-hero h1{margin:16px 0 14px;color:var(--crm-text);font-size:clamp(32px,4vw,48px);line-height:1.12;letter-spacing:-.025em;font-weight:400}.br30-legal-hero h1 span{color:var(--crm-primary)}.br30-legal-hero-description{max-width:760px;margin:0;color:var(--crm-muted);font-size:14px;line-height:1.75}.br30-legal-meta{display:flex;flex-wrap:wrap;gap:8px;margin-top:25px}.br30-legal-meta-item{display:flex;align-items:center;gap:7px;min-height:35px;padding:7px 11px;border:1px solid var(--crm-border);border-radius:9px;background:var(--crm-surface);color:var(--crm-muted);font-size:13px}.br30-legal-meta-item svg{color:var(--crm-primary)}.br30-legal-meta-item strong{color:var(--crm-text);font-weight:400}.br30-legal-main{width:100%;max-width:1120px;margin:0 auto;padding:52px 24px 80px;display:grid;grid-template-columns:235px minmax(0,1fr);gap:50px;align-items:start}.br30-legal-sidebar{position:sticky;top:100px;max-height:calc(100vh - 120px);overflow:auto;padding:7px;border:1px solid var(--crm-border);border-radius:13px;background:var(--crm-surface);box-shadow:var(--crm-shadow);scrollbar-width:thin}.br30-legal-sidebar-title{padding:9px 10px 11px;color:var(--crm-text);font-size:13px;font-weight:400;letter-spacing:.06em;text-transform:uppercase}.br30-legal-sidebar-list{display:flex;flex-direction:column;gap:1px}.br30-legal-sidebar button{width:100%;display:flex;align-items:center;gap:8px;padding:8px 9px;border:0;border-radius:8px;background:transparent;color:var(--crm-muted);font:inherit;font-size:13px;line-height:1.35;text-align:left;cursor:pointer}.br30-legal-sidebar button:hover{background:var(--crm-surface-2);color:var(--crm-text)}.br30-legal-sidebar button.active{background:var(--crm-primary-soft);color:var(--crm-primary);font-weight:400}.br30-legal-sidebar-number{width:22px;flex:0 0 22px;font-size:13px;font-weight:400;opacity:.7}.br30-legal-content{min-width:0}.br30-legal-intro-card{margin-bottom:34px;padding:21px;border:1px solid var(--crm-border);border-radius:13px;background:var(--crm-surface);box-shadow:var(--crm-shadow)}.br30-legal-intro-card-top{display:flex;align-items:flex-start;gap:13px}.br30-legal-intro-icon{width:38px;height:38px;flex:0 0 38px;display:grid;place-items:center;border-radius:9px;background:var(--crm-primary-soft);border:1px solid var(--crm-border);color:var(--crm-primary)}.br30-legal-intro-card h2{margin:0 0 5px;color:var(--crm-text);font-size:15px;font-weight:400;line-height:1.4}.br30-legal-intro-card p{margin:0;color:var(--crm-muted);font-size:13px;line-height:1.75}.br30-legal-section{scroll-margin-top:110px;padding:0 0 38px;margin-bottom:38px;border-bottom:1px solid var(--crm-border)}.br30-legal-section:last-child{border-bottom:0;margin-bottom:0}.br30-legal-section-label{display:flex;align-items:center;gap:8px;margin-bottom:10px;color:var(--crm-primary);font-size:13px;font-weight:400;letter-spacing:.08em;text-transform:uppercase}.br30-legal-section-label span{opacity:.65}.br30-legal-section h2{margin:0 0 14px;color:var(--crm-text);font-size:20px;line-height:1.35;font-weight:400;letter-spacing:-.01em}.br30-legal-section h3{margin:22px 0 8px;color:var(--crm-text);font-size:14px;line-height:1.45;font-weight:400}.br30-legal-section p{margin:0 0 13px;color:var(--crm-muted);font-size:13px;line-height:1.85}.br30-legal-section p:last-child{margin-bottom:0}.br30-legal-section ul{margin:10px 0 17px;padding-left:20px}.br30-legal-section li{margin:7px 0;padding-left:2px;color:var(--crm-muted);font-size:13px;line-height:1.75}.br30-legal-section li::marker{color:var(--crm-primary)}.br30-legal-note{margin:18px 0;padding:14px 16px;border-left:3px solid var(--crm-primary);border-radius:0 9px 9px 0;background:var(--crm-surface-2);color:var(--crm-muted);font-size:13px;line-height:1.75}.br30-legal-note strong{color:var(--crm-text)}.br30-legal-contact-card{display:grid;grid-template-columns:auto 1fr;gap:12px;margin-top:18px;padding:17px;border:1px solid var(--crm-border);border-radius:11px;background:var(--crm-surface)}.br30-legal-contact-icon{width:36px;height:36px;display:grid;place-items:center;border-radius:9px;background:var(--crm-primary-soft);color:var(--crm-primary)}.br30-legal-contact-card strong{display:block;margin-bottom:4px;color:var(--crm-text);font-size:13px}.br30-legal-contact-card a{color:var(--crm-primary);font-size:13px;text-decoration:none}.br30-legal-contact-card a:hover{text-decoration:underline}.br30-legal-contact-card p{margin:0!important}.br30-legal-status{display:flex;align-items:center;gap:9px;margin:0 0 18px;padding:12px 14px;border:1px solid var(--crm-border);border-radius:10px;background:var(--crm-surface-2);color:var(--crm-text);font-size:13px}.br30-legal-status-dot{width:8px;height:8px;flex:0 0 8px;border-radius:50%;background:var(--crm-success);box-shadow:0 0 0 4px color-mix(in srgb,var(--crm-success) 12%,transparent)}.br30-legal-status strong{font-weight:400}.br30-legal-top-button{position:fixed;right:20px;bottom:20px;z-index:30;width:38px;height:38px;display:grid;place-items:center;border:1px solid var(--crm-border);border-radius:10px;background:var(--crm-surface);color:var(--crm-text);box-shadow:var(--crm-shadow);cursor:pointer;transition:.2s}.br30-legal-top-button:hover{border-color:var(--crm-primary);color:var(--crm-primary);transform:translateY(-2px)}@media(max-width:900px){.br30-legal-main{grid-template-columns:1fr;gap:25px}.br30-legal-sidebar{position:relative;top:auto;max-height:none}.br30-legal-sidebar-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:600px){.br30-legal-hero{padding:120px 17px 45px}.br30-legal-hero h1{font-size:34px}.br30-legal-hero-description{font-size:13px}.br30-legal-meta{display:grid;grid-template-columns:1fr}.br30-legal-main{padding:35px 17px 60px}.br30-legal-sidebar-list{grid-template-columns:1fr}.br30-legal-intro-card{padding:18px}.br30-legal-section{scroll-margin-top:90px;padding-bottom:32px;margin-bottom:32px}.br30-legal-section h2{font-size:18px}.br30-legal-section p,.br30-legal-section li{font-size:13px}.br30-legal-contact-card{grid-template-columns:1fr}.br30-legal-top-button{right:13px;bottom:13px}}`}</style>

      <LandingNavbar />

      <header className="br30-legal-hero">
        <div className="br30-legal-hero-inner">
          <div className="br30-legal-breadcrumb">
            <Link to="/">Home</Link>
            <ChevronRight size={13} />
            <span>System</span>
            <ChevronRight size={13} />
            <span>System Status</span>
          </div>

          <div className="br30-legal-eyebrow">
            <span className="br30-legal-eyebrow-dot" />
            BR30 CRM System
          </div>

          <h1>
            System <span>Status</span>
          </h1>

          <p className="br30-legal-hero-description">This page provides information about the operational status, availability, maintenance activities, service incidents, and infrastructure supporting BR30 CRM.</p>

          <div className="br30-legal-meta">
            <div className="br30-legal-meta-item">
              <Activity size={14} />
              <span>
                Current Status <strong>Operational</strong>
              </span>
            </div>

            <div className="br30-legal-meta-item">
              <Clock3 size={14} />
              <span>
                Last Updated <strong>September 24, 2026</strong>
              </span>
            </div>

            <div className="br30-legal-meta-item">
              <FileText size={14} />
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
                <Server size={18} />
              </div>

              <div>
                <h2>BR30 CRM services are operational</h2>

                <p>BR30 CRM continuously works to maintain the availability, reliability, security, and performance of the platform and its supporting services.</p>
              </div>
            </div>
          </div>

          <section id="overview" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>01</span>
              System Overview
            </div>

            <h2>About BR30 CRM system status</h2>

            <div className="br30-legal-status">
              <span className="br30-legal-status-dot" />
              <span>
                All currently monitored BR30 CRM services are <strong>operational</strong>.
              </span>
            </div>

            <p>BR30 CRM uses application, database, infrastructure, networking, authentication, and supporting services to provide the platform and its features.</p>

            <p>This System Status page is intended to provide customers and users with general information about service availability and known operational events.</p>

            <div className="br30-legal-note">
              <strong>Important:</strong> The information shown on this page represents the current operational status maintained by BR30 CRM and may not reflect every temporary or user-specific issue.
            </div>
          </section>

          <section id="service-status" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>02</span>
              Service Status
            </div>

            <h2>Current service condition</h2>

            <p>BR30 CRM may monitor different components of the platform to identify availability, performance, authentication, and infrastructure issues.</p>

            <h3>Operational</h3>

            <p>A service is considered operational when it is generally available and functioning as expected.</p>

            <h3>Degraded performance</h3>

            <p>A service may be considered degraded when it remains available but users may experience slower performance, intermittent failures, or limited functionality.</p>

            <h3>Service disruption</h3>

            <p>A service disruption may be reported when a significant portion of a service is unavailable or substantially affected.</p>
          </section>

          <section id="availability" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>03</span>
              Availability
            </div>

            <h2>Platform availability</h2>

            <p>BR30 CRM aims to maintain reliable access to its services during normal operating conditions.</p>

            <p>Availability may be affected by planned maintenance, unexpected technical failures, infrastructure issues, network conditions, third-party dependencies, security events, or circumstances outside the reasonable control of BR30 CRM.</p>

            <ul>
              <li>Application availability and responsiveness.</li>
              <li>Authentication and account access.</li>
              <li>Database and data service availability.</li>
              <li>Supporting infrastructure and networking.</li>
              <li>Important third-party service dependencies.</li>
            </ul>
          </section>

          <section id="maintenance" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>04</span>
              Maintenance
            </div>

            <h2>Planned maintenance activities</h2>

            <p>BR30 CRM may periodically perform maintenance to improve performance, reliability, security, infrastructure, or product functionality.</p>

            <p>Planned maintenance may require temporary service limitations or short interruptions depending on the nature of the work.</p>

            <p>Where practical, BR30 CRM may provide advance information about material maintenance activities through available communication channels.</p>

            <div className="br30-legal-note">
              <strong>Maintenance:</strong> Emergency maintenance may sometimes be performed without advance notice when necessary to protect the platform, users, or data.
            </div>
          </section>

          <section id="incidents" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>05</span>
              Service Incidents
            </div>

            <h2>Handling service incidents</h2>

            <p>When a significant service issue is identified, BR30 CRM may investigate the underlying cause, assess affected services, and take appropriate steps to restore normal operation.</p>

            <h3>Incident investigation</h3>

            <p>Technical teams may review system logs, monitoring information, infrastructure metrics, application behavior, and other relevant operational data.</p>

            <h3>Service restoration</h3>

            <p>Restoration activities may include configuration changes, infrastructure recovery, software updates, service restarts, database recovery, or other appropriate technical measures.</p>
          </section>

          <section id="degraded-service" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>06</span>
              Degraded Service
            </div>

            <h2>When service performance is reduced</h2>

            <p>A service may remain available while some users experience delays, intermittent errors, reduced functionality, or other performance issues.</p>

            <p>In these situations, BR30 CRM may classify the affected service as degraded while investigation and remediation activities are underway.</p>

            <ul>
              <li>Slower application response times.</li>
              <li>Intermittent login or authentication issues.</li>
              <li>Temporary feature limitations.</li>
              <li>Delayed background processing.</li>
              <li>Temporary third-party service interruptions.</li>
            </ul>
          </section>

          <section id="security" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>07</span>
              Security & Monitoring
            </div>

            <h2>Monitoring platform reliability and security</h2>

            <p>BR30 CRM may use monitoring and operational controls to identify availability, performance, infrastructure, authentication, and security-related events.</p>

            <ul>
              <li>Service availability monitoring.</li>
              <li>Application and infrastructure monitoring.</li>
              <li>Error and performance logging.</li>
              <li>Authentication and access monitoring.</li>
              <li>Operational alerting and incident response.</li>
            </ul>

            <p>Security-related information may not always be publicly disclosed in detail where doing so could create additional security or operational risks.</p>
          </section>

          <section id="notifications" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>08</span>
              Notifications
            </div>

            <h2>Service communication</h2>

            <p>Depending on the nature and impact of an event, BR30 CRM may communicate important service information through available channels.</p>

            <p>Communication may include information about significant interruptions, maintenance activities, service restoration, or other events that materially affect platform availability.</p>

            <div className="br30-legal-note">
              <strong>Note:</strong> Not every minor, short-lived, or user-specific issue will necessarily result in a public status notification.
            </div>
          </section>

          <section id="historical-status" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>09</span>
              Status History
            </div>

            <h2>Historical service information</h2>

            <p>BR30 CRM may maintain records of significant maintenance activities, incidents, service interruptions, and operational events.</p>

            <p>Historical information may be used for operational review, troubleshooting, service improvement, reliability planning, and customer communication.</p>

            <p>Historical status information may not include every internal operational event or temporary technical condition.</p>
          </section>

          <section id="third-party" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>10</span>
              Third-Party Services
            </div>

            <h2>External infrastructure and dependencies</h2>

            <p>BR30 CRM may rely on third-party providers for infrastructure, hosting, databases, communications, authentication, analytics, payments, security, email delivery, monitoring, or other supporting functionality.</p>

            <p>An interruption affecting an external provider may affect one or more BR30 CRM services even when the core application itself is operating normally.</p>

            <p>Third-party providers may maintain their own operational status information and service policies.</p>
          </section>

          <section id="maintenance-windows" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>11</span>
              Maintenance Windows
            </div>

            <h2>Scheduled maintenance periods</h2>

            <p>Maintenance activities may be scheduled during periods selected to reduce potential disruption to users where reasonably practical.</p>

            <p>Maintenance windows can vary depending on the technical requirements of the work, infrastructure dependencies, urgency, and operational conditions.</p>

            <p>Emergency maintenance may occur outside a normal maintenance window when immediate action is required.</p>
          </section>

          <section id="support" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>12</span>
              Support
            </div>

            <h2>Need help with a service issue?</h2>

            <p>If you are experiencing an issue that is not reflected on this System Status page, you can contact BR30 CRM support with relevant information about the problem.</p>

            <p>When contacting support, providing the affected account, approximate time of the issue, relevant error message, and a description of the problem may help with investigation.</p>

            <div className="br30-legal-contact-card">
              <div className="br30-legal-contact-icon">
                <Mail size={16} />
              </div>

              <div>
                <strong>BR30 CRM Support</strong>

                <a
                  href="https://br30crm-com-f.vercel.app/public/forms/6ac4a4ce8ab8658ebe3748f7/br30-crm-resources-support-ticket?utm_source=br30crm-resources-system-status&utm_medium=website&lead_source=br30crm-resources-system-status&form_id=6ac2e97c45d94386aa073fb7&source_id=6ac2ec2045d94386aa073fbc"
                  className="br30-support-ticket-link"
                  rel="noopener noreferrer">
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

                <p>For account-specific or security-sensitive matters, please create a support ticket using the email address associated with your account whenever possible.</p>
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

export default SystemStatus;
