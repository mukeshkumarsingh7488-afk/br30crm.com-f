import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUp, ChevronRight, FileCheck2, FileText, Globe2, LockKeyhole, Mail, ShieldCheck, UserCheck } from "lucide-react";
import LandingNavbar from "../../components/landing/LandingNavbar";
import LandingFooter from "../../components/landing/LandingFooter";
import { LEGAL_GDPR_COMPLIANCE_SUPPORT_FORM_URL } from "../../constants/supportForm";

function GDPRCompliance() {
  const [activeSection, setActiveSection] = useState("overview");

  const sections = [
    { id: "overview", number: "01", title: "Overview" },
    { id: "scope", number: "02", title: "Scope & Applicability" },
    { id: "data-controller", number: "03", title: "Data Controller" },
    { id: "personal-data", number: "04", title: "Personal Data" },
    { id: "lawful-basis", number: "05", title: "Lawful Basis" },
    { id: "data-use", number: "06", title: "Use of Personal Data" },
    { id: "data-sharing", number: "07", title: "Data Sharing" },
    { id: "international-transfers", number: "08", title: "International Transfers" },
    { id: "data-security", number: "09", title: "Data Security" },
    { id: "data-retention", number: "10", title: "Data Retention" },
    { id: "data-subject-rights", number: "11", title: "Data Subject Rights" },
    { id: "requests", number: "12", title: "Privacy Requests" },
    { id: "processors", number: "13", title: "Service Providers" },
    { id: "compliance-changes", number: "14", title: "Compliance Updates" },
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
            <span>Legal</span>
            <ChevronRight size={13} />
            <span>GDPR & Compliance</span>
          </div>

          <div className="br30-legal-eyebrow">
            <span className="br30-legal-eyebrow-dot" />
            BR30 CRM Legal
          </div>

          <h1>
            GDPR <span>& Compliance</span>
          </h1>

          <p className="br30-legal-hero-description">This GDPR & Compliance notice explains BR30 CRM's general approach to privacy, personal data protection, data subject rights, security, and responsible processing of information in connection with our platform and services.</p>

          <div className="br30-legal-meta">
            <div className="br30-legal-meta-item">
              <FileCheck2 size={14} />
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
                <LockKeyhole size={18} />
              </div>

              <div>
                <h2>Privacy and compliance matter to us</h2>

                <p>BR30 CRM is designed for business and professional use. We aim to maintain responsible practices for handling personal information, protecting business data, supporting privacy rights, and maintaining appropriate security controls.</p>
              </div>
            </div>
          </div>

          <section id="overview" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>01</span>
              Overview
            </div>

            <h2>Our approach to GDPR and privacy</h2>

            <p>
              BR30 CRM recognizes the importance of privacy and responsible processing of personal information. This page describes our general approach to data protection and GDPR-related principles that may apply depending on the services used, the location of the user, and the applicable legal
              framework.
            </p>

            <p>Our Privacy Policy provides additional information about the categories of information we may collect, how information may be used, data sharing, retention, security, and privacy choices.</p>

            <div className="br30-legal-note">
              <strong>Important:</strong> GDPR obligations can depend on the specific role of an organization, the nature of the processing, the location of individuals, and applicable law. This page is intended as general information about BR30 CRM's privacy and compliance approach and is not legal
              advice.
            </div>
          </section>

          <section id="scope" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>02</span>
              Scope & Applicability
            </div>

            <h2>When privacy requirements may apply</h2>

            <p>GDPR and other privacy laws may apply to certain processing activities depending on where individuals are located, where an organization operates, and the nature of the services being provided.</p>

            <p>BR30 CRM is intended to support businesses and professional users. Customers are responsible for understanding the privacy obligations that apply to the information they collect and enter into the platform.</p>

            <ul>
              <li>Personal information relating to customers or contacts.</li>
              <li>Employee and user information.</li>
              <li>Lead and business contact information.</li>
              <li>Account and authentication information.</li>
              <li>Other personal information processed through the CRM.</li>
            </ul>
          </section>

          <section id="data-controller" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>03</span>
              Data Controller
            </div>

            <h2>Roles in personal data processing</h2>

            <p>Depending on the circumstances, BR30 CRM or the customer using the platform may have different responsibilities under applicable privacy laws.</p>

            <p>Where a customer uses BR30 CRM to manage information relating to its own customers, employees, leads, contacts, or other individuals, the customer may determine the purposes and means of processing that information.</p>

            <p>BR30 CRM may process such information to provide the requested platform functionality and related services according to the applicable service relationship.</p>
          </section>

          <section id="personal-data" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>04</span>
              Personal Data
            </div>

            <h2>Types of information that may be processed</h2>

            <p>Personal data may include information that identifies or can reasonably be associated with an individual, depending on the context.</p>

            <h3>Account information</h3>

            <ul>
              <li>Name and display name.</li>
              <li>Email address.</li>
              <li>Phone number where provided.</li>
              <li>Authentication and account information.</li>
              <li>Profile information supplied by users.</li>
            </ul>

            <h3>Business information</h3>

            <ul>
              <li>Customer and contact records.</li>
              <li>Lead and business relationship information.</li>
              <li>Tasks, activities, notes, and operational records.</li>
              <li>Information entered into the CRM by authorized users.</li>
            </ul>

            <h3>Technical information</h3>

            <p>Technical information may include device, browser, operating system, IP address, session information, logs, and other information associated with the operation and security of the platform.</p>
          </section>

          <section id="lawful-basis" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>05</span>
              Lawful Basis
            </div>

            <h2>Legal grounds for processing</h2>

            <p>Where GDPR applies, processing of personal data generally requires an appropriate legal basis under applicable law. The appropriate basis depends on the particular processing activity and circumstances.</p>

            <ul>
              <li>Performance of a contract or steps taken before entering into a contract.</li>
              <li>Compliance with applicable legal obligations.</li>
              <li>Legitimate interests where permitted by law.</li>
              <li>Consent where processing is based on consent.</li>
            </ul>

            <p>The applicable legal basis may differ depending on the specific information, purpose, service, and relationship involved.</p>
          </section>

          <section id="data-use" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>06</span>
              Use of Personal Data
            </div>

            <h2>How information may be used</h2>

            <p>Personal information may be processed when necessary to provide, maintain, secure, improve, and support BR30 CRM and its related services.</p>

            <ul>
              <li>Creating and maintaining accounts.</li>
              <li>Authenticating users and protecting accounts.</li>
              <li>Providing requested CRM functionality.</li>
              <li>Responding to customer support requests.</li>
              <li>Communicating important service information.</li>
              <li>Maintaining security and preventing misuse.</li>
              <li>Monitoring service performance and reliability.</li>
              <li>Improving features and user experience.</li>
              <li>Meeting applicable legal obligations.</li>
            </ul>
          </section>

          <section id="data-sharing" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>07</span>
              Data Sharing
            </div>

            <h2>Disclosure of personal information</h2>

            <p>BR30 CRM may share or provide access to information where reasonably necessary to operate the platform, provide requested services, protect users and systems, or meet applicable legal obligations.</p>

            <h3>Service providers</h3>

            <p>Third-party providers may support hosting, infrastructure, communications, authentication, analytics, security, payment processing, email delivery, monitoring, and other operational functions.</p>

            <h3>Legal requirements</h3>

            <p>Information may be disclosed where reasonably necessary to comply with applicable law, legal process, court orders, governmental requests, or to protect the rights and safety of BR30 CRM, users, or other persons.</p>

            <h3>Business transactions</h3>

            <p>Information may be transferred as part of a merger, acquisition, restructuring, financing, sale of assets, or similar transaction, subject to applicable legal requirements.</p>
          </section>

          <section id="international-transfers" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>08</span>
              International Transfers
            </div>

            <h2>Cross-border processing</h2>

            <p>Depending on the infrastructure and third-party providers used, personal information may be processed or stored in countries other than the country where the individual is located.</p>

            <p>Where applicable, BR30 CRM aims to use appropriate measures for international transfers and processing in accordance with applicable privacy requirements.</p>

            <div className="br30-legal-note">
              <strong>Data location:</strong> The actual location of processing may depend on the infrastructure, service configuration, and third-party providers used for a particular BR30 CRM service.
            </div>
          </section>

          <section id="data-security" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>09</span>
              Data Security
            </div>

            <h2>Protecting personal information</h2>

            <p>BR30 CRM uses reasonable technical and organizational measures designed to protect information against unauthorized access, alteration, disclosure, loss, or destruction.</p>

            <ul>
              <li>Authentication and access-control mechanisms.</li>
              <li>Credential and session security measures.</li>
              <li>Protected communication channels where appropriate.</li>
              <li>Monitoring and logging of relevant system activity.</li>
              <li>Operational controls intended to limit unauthorized access.</li>
            </ul>

            <p>No internet-based system can be guaranteed to be completely secure. Users and customers should also maintain appropriate security controls for their accounts, devices, credentials, and business information.</p>
          </section>

          <section id="data-retention" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>10</span>
              Data Retention
            </div>

            <h2>Retention of personal information</h2>

            <p>Personal information may be retained for as long as reasonably necessary to provide services, maintain business records, resolve disputes, enforce agreements, prevent abuse, and comply with applicable legal requirements.</p>

            <p>Retention periods may vary according to the type of information, account status, service requirements, customer instructions, operational needs, and applicable law.</p>

            <p>When information is no longer required for legitimate purposes, it may be deleted, anonymized, aggregated, or otherwise handled according to applicable retention practices.</p>
          </section>

          <section id="data-subject-rights" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>11</span>
              Data Subject Rights
            </div>

            <h2>Your privacy rights</h2>

            <p>Depending on applicable law and individual circumstances, data subjects may have rights concerning their personal information.</p>

            <ul>
              <li>Right to access personal information.</li>
              <li>Right to request correction of inaccurate information.</li>
              <li>Right to request deletion where legally applicable.</li>
              <li>Right to restrict certain processing activities.</li>
              <li>Right to object to certain processing activities.</li>
              <li>Right to data portability where applicable.</li>
              <li>Right to withdraw consent where applicable.</li>
            </ul>

            <p>These rights may be subject to legal limitations, identity verification requirements, contractual considerations, or other applicable restrictions.</p>

            <div className="br30-legal-note">
              <strong>Important:</strong> Where BR30 CRM processes information on behalf of a customer organization, some privacy requests may need to be directed to that organization.
            </div>
          </section>

          <section id="requests" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>12</span>
              Privacy Requests
            </div>

            <h2>How to submit a privacy request</h2>

            <p>Individuals may contact BR30 CRM regarding privacy questions, requests, or concerns where BR30 CRM is the appropriate party to receive and handle the request.</p>

            <p>To help protect personal information, BR30 CRM may need to verify the identity of the person making a request before taking action.</p>

            <p>Where a request concerns information controlled by a customer organization, BR30 CRM may direct the individual to the applicable organization for assistance.</p>
          </section>

          <section id="processors" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>13</span>
              Service Providers
            </div>

            <h2>Third-party processors and providers</h2>

            <p>BR30 CRM may use third-party service providers to support the delivery, operation, security, and maintenance of its services.</p>

            <p>Depending on the services used, providers may support hosting, infrastructure, authentication, email delivery, analytics, security, monitoring, payments, communications, and other operational functions.</p>

            <p>Where applicable, service providers may process information according to contractual arrangements, their own applicable privacy obligations, and the instructions or requirements relevant to the services they provide.</p>

            <div className="br30-legal-note">
              <strong>Third-party services:</strong> Independent third-party services may have their own privacy policies and terms. Users should review those terms where relevant to their use of an integrated service.
            </div>
          </section>

          <section id="compliance-changes" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>14</span>
              Compliance Updates
            </div>

            <h2>Keeping our compliance information current</h2>

            <p>Privacy and compliance practices may evolve as BR30 CRM services, technology, security controls, operational processes, and applicable legal requirements change.</p>

            <p>
              BR30 CRM may update this page and related privacy documentation when appropriate. The <strong>Last Updated</strong> date shown above indicates when this document was most recently revised.
            </p>

            <p>Customers and users should periodically review applicable privacy documentation to remain informed about relevant changes.</p>
          </section>

          <section id="contact" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>15</span>
              Contact Us
            </div>

            <h2>Questions about GDPR or compliance?</h2>

            <p>If you have questions, concerns, or requests relating to GDPR, privacy, personal data, or BR30 CRM's compliance approach, please contact our support team.</p>

            <div className="br30-legal-contact-card">
              <div className="br30-legal-contact-icon">
                <Mail size={16} />
              </div>

              <div>
                <strong>Privacy & Support</strong>

                <a href={LEGAL_GDPR_COMPLIANCE_SUPPORT_FORM_URL} className="br30-support-ticket-link" target="_blank" rel="noopener noreferrer">
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

                <p>For account-specific privacy requests, please create a support ticket using the email address associated with your BR30 CRM account whenever possible.</p>
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

export default GDPRCompliance;
