import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUp, CheckCircle2, ChevronRight, FileCheck2, LockKeyhole, Mail, ShieldCheck, Server, UserCheck } from "lucide-react";
import LandingNavbar from "../../components/landing/LandingNavbar";
import LandingFooter from "../../components/landing/LandingFooter";

function TrustCenter() {
  const [activeSection, setActiveSection] = useState("overview");

  const sections = [
    { id: "overview", number: "01", title: "Trust Center Overview" },
    { id: "security", number: "02", title: "Security" },
    { id: "privacy", number: "03", title: "Privacy" },
    { id: "data-protection", number: "04", title: "Data Protection" },
    { id: "access-control", number: "05", title: "Access Control" },
    { id: "infrastructure", number: "06", title: "Infrastructure" },
    { id: "application-security", number: "07", title: "Application Security" },
    { id: "monitoring", number: "08", title: "Monitoring & Logging" },
    { id: "incident-response", number: "09", title: "Incident Response" },
    { id: "availability", number: "10", title: "Availability & Reliability" },
    { id: "third-party", number: "11", title: "Third-Party Services" },
    { id: "customer-responsibilities", number: "12", title: "Customer Responsibilities" },
    { id: "compliance", number: "13", title: "Compliance" },
    { id: "security-requests", number: "14", title: "Security Requests" },
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
            <span>Resources</span>
            <ChevronRight size={13} />
            <span>Trust Center</span>
          </div>

          <div className="br30-legal-eyebrow">
            <span className="br30-legal-eyebrow-dot" />
            BR30 CRM Trust Center
          </div>

          <h1>
            Trust <span>Center</span>
          </h1>

          <p className="br30-legal-hero-description">The BR30 CRM Trust Center provides an overview of the security, privacy, reliability, data protection, and operational practices that support our platform and the information entrusted to us.</p>

          <div className="br30-legal-meta">
            <div className="br30-legal-meta-item">
              <ShieldCheck size={14} />
              <span>
                Last Updated <strong>September 24, 2026</strong>
              </span>
            </div>

            <div className="br30-legal-meta-item">
              <CheckCircle2 size={14} />
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
                <LockKeyhole size={18} />
              </div>

              <div>
                <h2>Building trust through responsible practices</h2>

                <p>BR30 CRM is designed to help businesses manage customers, sales, teams, workflows, and operational information. The Trust Center summarizes the controls and practices we use to support secure and reliable service delivery.</p>
              </div>
            </div>
          </div>

          <section id="overview" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>01</span>
              Trust Center Overview
            </div>

            <h2>Our approach to trust</h2>

            <p>Trust is an important part of how BR30 CRM operates. We consider security, privacy, availability, and responsible data handling throughout the design and operation of our services.</p>

            <p>This Trust Center provides general information about the safeguards and operational practices associated with BR30 CRM. Specific contractual commitments may vary depending on the services, account, configuration, and agreements applicable to a customer.</p>

            <div className="br30-legal-note">
              <strong>Important:</strong> The information presented here is intended as a general overview and does not replace applicable contracts, policies, security documentation, or service-specific terms.
            </div>
          </section>

          <section id="security" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>02</span>
              Security
            </div>

            <h2>Security-focused service design</h2>

            <p>BR30 CRM uses technical and organizational practices intended to protect customer accounts, business information, and platform infrastructure against unauthorized access and other security risks.</p>

            <ul>
              <li>Authentication and account access controls.</li>
              <li>Protected application and service communication.</li>
              <li>Credential and session management practices.</li>
              <li>Operational monitoring and security logging.</li>
              <li>Controlled access to systems and business information.</li>
            </ul>

            <p>Security practices may evolve as the platform, infrastructure, technology, and applicable requirements change.</p>
          </section>

          <section id="privacy" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>03</span>
              Privacy
            </div>

            <h2>Responsible handling of information</h2>

            <p>BR30 CRM aims to handle personal and business information in a responsible and transparent manner.</p>

            <p>Our Privacy Policy describes the types of information that may be collected, how information may be used, circumstances in which information may be shared, retention practices, and applicable privacy choices.</p>

            <p>Customers using BR30 CRM to process information belonging to other individuals remain responsible for determining appropriate collection, use, and access practices for that information.</p>
          </section>

          <section id="data-protection" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>04</span>
              Data Protection
            </div>

            <h2>Protecting customer and business data</h2>

            <p>BR30 CRM is designed to provide access controls and operational safeguards intended to reduce the risk of unauthorized access, alteration, disclosure, loss, or destruction of information.</p>

            <ul>
              <li>Role-based access considerations.</li>
              <li>Authentication mechanisms.</li>
              <li>Protected storage and communication practices.</li>
              <li>System activity monitoring where appropriate.</li>
              <li>Operational controls around sensitive information.</li>
            </ul>

            <div className="br30-legal-note">
              <strong>Customer responsibility:</strong> Customers should configure appropriate permissions and only provide access to authorized users who require it for legitimate business purposes.
            </div>
          </section>

          <section id="access-control" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>05</span>
              Access Control
            </div>

            <h2>Managing access to accounts and systems</h2>

            <p>Access to BR30 CRM accounts and related functionality may be controlled through authentication, account roles, permissions, and other access-management mechanisms.</p>

            <p>Administrative and operational access should be limited according to business requirements and the responsibilities associated with the relevant user or system.</p>

            <h3>Account protection</h3>

            <p>Users are responsible for protecting their passwords, authentication information, devices, and other credentials used to access BR30 CRM.</p>
          </section>

          <section id="infrastructure" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>06</span>
              Infrastructure
            </div>

            <h2>Infrastructure and hosting</h2>

            <p>BR30 CRM may rely on infrastructure and hosting providers to operate application services, databases, networking, storage, communications, monitoring, and related technical components.</p>

            <p>Infrastructure arrangements may change as the platform evolves. Appropriate operational and technical controls are intended to support service security, availability, and reliability.</p>

            <div className="br30-legal-note">
              <strong>Infrastructure providers:</strong> Third-party infrastructure services may operate components of the BR30 CRM environment under their applicable security and operational practices.
            </div>
          </section>

          <section id="application-security" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>07</span>
              Application Security
            </div>

            <h2>Security within the application</h2>

            <p>Application security is considered across account management, authentication, data access, API interactions, application functionality, and operational workflows.</p>

            <ul>
              <li>Input and request validation where appropriate.</li>
              <li>Authentication and authorization controls.</li>
              <li>Session and credential protection.</li>
              <li>Controlled access to application functionality.</li>
              <li>Monitoring of relevant application activity.</li>
            </ul>

            <p>Application security practices may be updated as new risks, vulnerabilities, technologies, and security requirements are identified.</p>
          </section>

          <section id="monitoring" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>08</span>
              Monitoring & Logging
            </div>

            <h2>Operational visibility</h2>

            <p>BR30 CRM may use logs, monitoring systems, alerts, and related operational tools to understand service health, investigate issues, support reliability, and identify potentially unusual activity.</p>

            <p>Monitoring information may include technical events, authentication activity, application events, service metrics, and other operational information necessary for security and reliability purposes.</p>
          </section>

          <section id="incident-response" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>09</span>
              Incident Response
            </div>

            <h2>Responding to security incidents</h2>

            <p>BR30 CRM maintains operational processes intended to identify, investigate, contain, and respond to security or service incidents.</p>

            <p>Depending on the nature and impact of an incident, response activities may include investigation, containment, remediation, service recovery, internal review, and communication with affected parties where appropriate and legally required.</p>

            <div className="br30-legal-note">
              <strong>Reporting:</strong> If you believe you have identified a security issue involving BR30 CRM, please use the security contact information provided below rather than publicly disclosing sensitive technical details.
            </div>
          </section>

          <section id="availability" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>10</span>
              Availability & Reliability
            </div>

            <h2>Supporting dependable service</h2>

            <p>BR30 CRM is operated with the objective of providing reliable access to its services and supporting business continuity.</p>

            <ul>
              <li>Operational monitoring and service health checks.</li>
              <li>Infrastructure and application maintenance.</li>
              <li>Issue investigation and recovery procedures.</li>
              <li>Performance monitoring where appropriate.</li>
              <li>Planned maintenance and operational improvements.</li>
            </ul>

            <p>Availability may be affected by maintenance, infrastructure events, third-party dependencies, network conditions, or events outside reasonable operational control.</p>
          </section>

          <section id="third-party" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>11</span>
              Third-Party Services
            </div>

            <h2>External providers and integrations</h2>

            <p>BR30 CRM may use third-party services for infrastructure, hosting, authentication, email delivery, analytics, payments, monitoring, security, communications, and other operational functions.</p>

            <p>Third-party providers may process information according to their own agreements, policies, security practices, and applicable requirements.</p>

            <p>Customers should review the applicable documentation of third-party services when their use is relevant to a particular workflow or integration.</p>
          </section>

          <section id="customer-responsibilities" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>12</span>
              Customer Responsibilities
            </div>

            <h2>Security is a shared responsibility</h2>

            <p>Protecting business information involves both the BR30 CRM service and the customers and users who operate it.</p>

            <h3>Customers should</h3>

            <ul>
              <li>Use strong and unique account credentials.</li>
              <li>Limit access to authorized personnel.</li>
              <li>Review user permissions regularly.</li>
              <li>Protect devices used to access the service.</li>
              <li>Avoid sharing passwords or authentication codes.</li>
              <li>Store only information necessary for legitimate purposes.</li>
              <li>Report suspected unauthorized access promptly.</li>
            </ul>

            <div className="br30-legal-note">
              <strong>Shared responsibility:</strong> BR30 CRM provides security-related controls and operational safeguards, while customers remain responsible for how they configure and use the service.
            </div>
          </section>

          <section id="compliance" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>13</span>
              Compliance
            </div>

            <h2>Privacy and regulatory considerations</h2>

            <p>BR30 CRM seeks to operate its services in accordance with applicable legal and regulatory requirements relevant to its operations.</p>

            <p>Depending on the customer's location, business activities, data types, and applicable laws, additional compliance obligations may apply to the customer independently of the BR30 CRM platform.</p>

            <p>For information regarding privacy practices, customers should also review the applicable BR30 CRM Privacy Policy and Data Processing information.</p>
          </section>

          <section id="security-requests" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>14</span>
              Security Requests
            </div>

            <h2>Security information and requests</h2>

            <p>Customers may contact BR30 CRM regarding security-related questions, concerns, requests, or information about the safeguards relevant to their use of the platform.</p>

            <p>Depending on the request, we may need to verify the identity of the requester and the relationship they have with the applicable BR30 CRM account or organization.</p>

            <div className="br30-legal-note">
              <strong>Responsible disclosure:</strong> Please provide sufficient information to help us understand and investigate a suspected security issue while avoiding unnecessary disclosure of sensitive credentials or personal information.
            </div>
          </section>

          <section id="contact" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>15</span>
              Contact Us
            </div>

            <h2>Questions about trust and security?</h2>

            <p>If you have questions about BR30 CRM security, privacy, data protection, infrastructure, or responsible information handling, please contact our support team.</p>

            <div className="br30-legal-contact-card">
              <div className="br30-legal-contact-icon">
                <Mail size={16} />
              </div>

              <div>
                <strong>Security & Trust Support</strong>

                <a
                  href="https://br30crm-com-f.vercel.app/public/forms/6ac4a4ce8ab8658ebe3748f7/br30-crm-resources-support-ticket?utm_source=br30crm-resources-trust-center&utm_medium=website&lead_source=br30crm-resources-trust-center&form_id=6ac2e97c45d94386aa073fb7&source_id=6ac2ec3e45d94386aa073fbe"
                  className="br30-support-ticket-link"
                  rel="noopener noreferrer">
                  Create Support Ticket
                </a>
              </div>
            </div>

            <div className="br30-legal-contact-card">
              <div className="br30-legal-contact-icon">
                <UserCheck size={16} />
              </div>

              <div>
                <strong>BR30 CRM Trust Center</strong>

                <p>For account-specific security or privacy requests, please create a support ticket using the email address associated with your BR30 CRM account whenever possible.</p>
              </div>
            </div>

            <div className="br30-legal-contact-card">
              <div className="br30-legal-contact-icon">
                <Server size={16} />
              </div>

              <div>
                <strong>Service & Infrastructure</strong>

                <p>For service availability, infrastructure, or operational concerns, include relevant account and service details in your request so that our team can review the matter efficiently.</p>
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

export default TrustCenter;
