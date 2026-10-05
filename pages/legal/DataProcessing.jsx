import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUp, ChevronRight, Database, FileText, LockKeyhole, Mail, ShieldCheck, UserCheck } from "lucide-react";
import LandingNavbar from "../../components/landing/LandingNavbar";
import LandingFooter from "../../components/landing/LandingFooter";
import { LEGAL_DATA_PROCESSING_SUPPORT_FORM_URL } from "../../constants/supportForm";

function DataProcessing() {
  const [activeSection, setActiveSection] = useState("introduction");

  const sections = [
    { id: "introduction", number: "01", title: "Introduction" },
    { id: "data-controller", number: "02", title: "Data Controller" },
    { id: "data-we-process", number: "03", title: "Data We Process" },
    { id: "processing-purposes", number: "04", title: "Processing Purposes" },
    { id: "business-data", number: "05", title: "Business Data" },
    { id: "processing-basis", number: "06", title: "Processing Basis" },
    { id: "service-providers", number: "07", title: "Service Providers" },
    { id: "security", number: "08", title: "Security Measures" },
    { id: "retention", number: "09", title: "Data Retention" },
    { id: "user-rights", number: "10", title: "Your Rights" },
    { id: "international-data", number: "11", title: "International Data" },
    { id: "customer-responsibilities", number: "12", title: "Customer Responsibilities" },
    { id: "data-incidents", number: "13", title: "Data Incidents" },
    { id: "changes", number: "14", title: "Changes to This Policy" },
    { id: "contact", number: "15", title: "Contact Us" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const offset = 150;
      let current = "introduction";

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
            <span>Data Processing</span>
          </div>

          <div className="br30-legal-eyebrow">
            <span className="br30-legal-eyebrow-dot" />
            BR30 CRM Legal
          </div>

          <h1>
            Data <span>Processing</span>
          </h1>

          <p className="br30-legal-hero-description">This Data Processing Policy explains how BR30 CRM processes, protects, stores, and handles information submitted to or processed through our platform and related services.</p>

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
                <h2>Responsible data processing</h2>
                <p>BR30 CRM is designed to help businesses manage customer relationships, sales activities, teams, and operational workflows. We aim to process information responsibly, securely, and transparently.</p>
              </div>
            </div>
          </div>

          <section id="introduction" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>01</span>
              Introduction
            </div>

            <h2>About this Data Processing Policy</h2>

            <p>This Data Processing Policy describes the general principles and practices followed by BR30 CRM when processing information through our website, application, software, services, communications, and related systems.</p>

            <p>The policy is intended to explain how information may be processed when customers and authorized users access and use BR30 CRM.</p>

            <div className="br30-legal-note">
              <strong>Important:</strong> Specific customers, services, or integrations may be subject to additional contractual terms, privacy notices, or processing requirements.
            </div>
          </section>

          <section id="data-controller" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>02</span>
              Data Controller
            </div>

            <h2>Roles in data processing</h2>

            <p>Depending on the nature of the information and the relationship with BR30 CRM, BR30 CRM may process information as a service provider, processor, or controller for particular purposes.</p>

            <p>When a business customer enters customer, employee, lead, contact, or other business information into BR30 CRM, that customer may determine the purposes and means for which the information is used.</p>

            <p>The applicable role may therefore depend on the type of data, the service being provided, the customer's instructions, and applicable law.</p>
          </section>

          <section id="data-we-process" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>03</span>
              Data We Process
            </div>

            <h2>Categories of information</h2>

            <p>The information processed through BR30 CRM may vary depending on the services used and the information submitted by customers and authorized users.</p>

            <h3>Account information</h3>

            <ul>
              <li>Name and display name.</li>
              <li>Email address.</li>
              <li>Phone number where provided.</li>
              <li>Authentication and account information.</li>
              <li>Role and account-related information.</li>
            </ul>

            <h3>Business information</h3>

            <ul>
              <li>Customer and contact records.</li>
              <li>Lead and sales information.</li>
              <li>Tasks, notes, activities, and operational records.</li>
              <li>Business communications entered into the platform.</li>
              <li>Other information submitted by authorized users.</li>
            </ul>

            <h3>Technical information</h3>

            <p>Technical information may include device information, browser type, operating system, IP address, log information, session details, and other information generated through interaction with the platform.</p>
          </section>

          <section id="processing-purposes" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>04</span>
              Processing Purposes
            </div>

            <h2>Why information is processed</h2>

            <p>Information may be processed where necessary to provide, maintain, secure, improve, and operate BR30 CRM and its related services.</p>

            <ul>
              <li>Creating and maintaining user accounts.</li>
              <li>Authenticating and securing users.</li>
              <li>Providing requested CRM functionality.</li>
              <li>Managing customer and business workflows.</li>
              <li>Providing customer and technical support.</li>
              <li>Communicating important service information.</li>
              <li>Monitoring platform performance and reliability.</li>
              <li>Detecting and preventing security incidents.</li>
              <li>Improving products and service functionality.</li>
              <li>Complying with applicable legal requirements.</li>
            </ul>
          </section>

          <section id="business-data" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>05</span>
              Business Data
            </div>

            <h2>Information stored by customers</h2>

            <p>BR30 CRM may allow customers and authorized users to store information relating to their customers, contacts, leads, employees, business partners, transactions, activities, and operational processes.</p>

            <p>Customers are responsible for determining what information is appropriate to enter into the platform and for ensuring that their collection and use of that information comply with applicable laws and their own privacy obligations.</p>

            <p>Customers should only store information that is reasonably necessary for legitimate business purposes and should configure appropriate access permissions for authorized users.</p>
          </section>

          <section id="processing-basis" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>06</span>
              Processing Basis
            </div>

            <h2>Legal and operational basis</h2>

            <p>Depending on the circumstances and applicable law, information may be processed based on contractual necessity, legitimate business purposes, consent, legal obligations, security requirements, or other lawful grounds.</p>

            <h3>Service delivery</h3>

            <p>Certain information is required to establish accounts, provide requested functionality, authenticate users, and deliver services.</p>

            <h3>Security and compliance</h3>

            <p>Information may also be processed when reasonably necessary to protect accounts, investigate misuse, prevent fraud, maintain platform security, or satisfy legal obligations.</p>
          </section>

          <section id="service-providers" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>07</span>
              Service Providers
            </div>

            <h2>Third-party processing services</h2>

            <p>BR30 CRM may use third-party providers for hosting, infrastructure, authentication, communications, analytics, security, email delivery, monitoring, payments, and other operational functions.</p>

            <p>These providers may process information only as necessary to provide the services for which they have been engaged, subject to their applicable agreements, policies, and legal obligations.</p>

            <p>Where appropriate, BR30 CRM takes reasonable steps to select providers that maintain safeguards appropriate to the nature of the information being processed.</p>
          </section>

          <section id="security" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>08</span>
              Security Measures
            </div>

            <h2>Protecting processed information</h2>

            <p>BR30 CRM uses reasonable technical and organizational measures designed to protect information against unauthorized access, alteration, disclosure, loss, or destruction.</p>

            <ul>
              <li>Authentication and access-control mechanisms.</li>
              <li>Protected communication channels where appropriate.</li>
              <li>Credential and session security controls.</li>
              <li>Monitoring and logging of relevant system activity.</li>
              <li>Operational controls intended to restrict unauthorized access.</li>
            </ul>

            <p>No internet-based system can be guaranteed to be completely secure. Customers and users should also protect their accounts, devices, passwords, authentication information, and access permissions.</p>
          </section>

          <section id="retention" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>09</span>
              Data Retention
            </div>

            <h2>Retention of processed information</h2>

            <p>Information may be retained for as long as reasonably necessary to provide services, maintain business records, support customers, resolve disputes, prevent abuse, enforce agreements, and comply with applicable legal requirements.</p>

            <p>Retention periods may vary depending on the nature of the information, account status, service requirements, customer instructions, operational needs, and applicable law.</p>

            <p>When information is no longer required for legitimate purposes, it may be deleted, anonymized, aggregated, or otherwise handled according to applicable retention practices.</p>
          </section>

          <section id="user-rights" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>10</span>
              Your Rights
            </div>

            <h2>Rights concerning personal information</h2>

            <p>Depending on your location and applicable law, you may have rights concerning personal information processed through BR30 CRM.</p>

            <ul>
              <li>Request access to certain personal information.</li>
              <li>Request correction of inaccurate information.</li>
              <li>Request deletion where legally applicable.</li>
              <li>Object to or restrict certain processing activities.</li>
              <li>Request information about applicable processing activities.</li>
              <li>Withdraw consent where processing is based on consent.</li>
            </ul>

            <p>Some requests may be subject to identity verification, contractual requirements, legal limitations, or other legitimate restrictions.</p>

            <div className="br30-legal-note">
              <strong>Note:</strong> Where BR30 CRM processes business data on behalf of an organization, certain requests may need to be directed to that organization because it may control the underlying information.
            </div>
          </section>

          <section id="international-data" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>11</span>
              International Data
            </div>

            <h2>Processing and storage locations</h2>

            <p>Depending on the infrastructure and service providers used by BR30 CRM, information may be processed or stored in locations different from the country where you or your organization is located.</p>

            <p>Where applicable, reasonable measures may be used to support lawful transfers and processing of information in accordance with applicable legal requirements.</p>
          </section>

          <section id="customer-responsibilities" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>12</span>
              Customer Responsibilities
            </div>

            <h2>Responsibilities of customers and users</h2>

            <p>Customers and authorized users are responsible for using BR30 CRM appropriately and for ensuring that information submitted to the platform may lawfully be collected, stored, and processed.</p>

            <ul>
              <li>Use appropriate access controls.</li>
              <li>Protect account credentials and authentication information.</li>
              <li>Only provide information necessary for legitimate purposes.</li>
              <li>Maintain appropriate notices and permissions where required.</li>
              <li>Remove or update information that is no longer necessary.</li>
            </ul>

            <p>Customers should also ensure that their use of BR30 CRM is consistent with their own contractual, regulatory, and privacy obligations.</p>
          </section>

          <section id="data-incidents" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>13</span>
              Data Incidents
            </div>

            <h2>Security incidents and response</h2>

            <p>BR30 CRM maintains operational processes intended to identify, investigate, and respond to suspected security incidents affecting the platform or information processed through it.</p>

            <p>Where appropriate and legally required, BR30 CRM may take steps to contain an incident, investigate its scope, restore affected services, and provide relevant notifications.</p>

            <div className="br30-legal-note">
              <strong>Security reporting:</strong> If you believe that an account, credential, or BR30 CRM service may have been compromised, contact BR30 CRM support as soon as reasonably possible.
            </div>
          </section>

          <section id="changes" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>14</span>
              Changes to This Policy
            </div>

            <h2>Keeping this policy current</h2>

            <p>We may update this Data Processing Policy from time to time to reflect changes in our services, technology, infrastructure, operational practices, legal requirements, or other relevant circumstances.</p>

            <p>
              When changes are made, the updated version will be published on the applicable BR30 CRM website or service. The <strong>Last Updated</strong> date at the beginning of this policy indicates when the policy was most recently revised.
            </p>

            <p>Continued use of BR30 CRM after an updated policy becomes effective may be subject to the revised policy, to the extent permitted by applicable law.</p>
          </section>

          <section id="contact" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>15</span>
              Contact Us
            </div>

            <h2>Questions about data processing?</h2>

            <p>If you have questions, concerns, or requests regarding this Data Processing Policy or the way BR30 CRM processes information, please contact the BR30 CRM support team.</p>

            <div className="br30-legal-contact-card">
              <div className="br30-legal-contact-icon">
                <Mail size={16} />
              </div>

              <div>
                <strong>Privacy & Support</strong>

                <a href={LEGAL_DATA_PROCESSING_SUPPORT_FORM_URL} className="br30-support-ticket-link" target="_blank" rel="noopener noreferrer">
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

                <p>For account-specific data requests, please create a support ticket using the email address associated with your BR30 CRM account whenever possible.</p>
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

export default DataProcessing;
