import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUp, ChevronRight, Database, FileText, LockKeyhole, Mail, ShieldCheck, UserCheck } from "lucide-react";
import LandingNavbar from "../../components/landing/LandingNavbar";
import LandingFooter from "../../components/landing/LandingFooter";
import { LEGAL_PRIVACY_POLICY_SUPPORT_FORM_URL } from "../../constants/supportForm";

function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState("introduction");

  const sections = [
    { id: "introduction", number: "01", title: "Introduction" },
    { id: "information-we-collect", number: "02", title: "Information We Collect" },
    { id: "how-we-use-information", number: "03", title: "How We Use Information" },
    { id: "account-information", number: "04", title: "Account Information" },
    { id: "business-data", number: "05", title: "Business Data" },
    { id: "cookies", number: "06", title: "Cookies & Similar Technologies" },
    { id: "data-sharing", number: "07", title: "Data Sharing & Disclosure" },
    { id: "data-security", number: "08", title: "Data Security" },
    { id: "data-retention", number: "09", title: "Data Retention" },
    { id: "your-rights", number: "10", title: "Your Rights & Choices" },
    { id: "third-party-services", number: "11", title: "Third-Party Services" },
    { id: "children-privacy", number: "12", title: "Children's Privacy" },
    { id: "international-data", number: "13", title: "International Data" },
    { id: "policy-changes", number: "14", title: "Changes to This Policy" },
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
            <span>Privacy Policy</span>
          </div>

          <div className="br30-legal-eyebrow">
            <span className="br30-legal-eyebrow-dot" />
            BR30 CRM Legal
          </div>

          <h1>
            Privacy <span>Policy</span>
          </h1>

          <p className="br30-legal-hero-description">This Privacy Policy explains how BR30 CRM collects, uses, protects, stores, and handles information when you access or use our platform, website, products, and related services.</p>

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
                <h2>Your privacy matters to us</h2>
                <p>BR30 CRM is designed to help businesses manage their customer relationships, sales activities, business operations, and related workflows. We aim to handle personal and business information responsibly and transparently.</p>
              </div>
            </div>
          </div>

          <section id="introduction" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>01</span>
              Introduction
            </div>

            <h2>About this Privacy Policy</h2>

            <p>This Privacy Policy describes the general principles and practices followed by BR30 CRM in connection with information collected through our website, application, software, services, communications, and other interactions with our platform.</p>

            <p>By accessing or using BR30 CRM, you acknowledge that you have read and understood this Privacy Policy. If you do not agree with the practices described here, you should discontinue use of the applicable services.</p>

            <div className="br30-legal-note">
              <strong>Important:</strong> This Privacy Policy is intended to provide transparency about our information practices. Specific services may have additional privacy notices or contractual terms that apply to particular customers, accounts, or integrations.
            </div>
          </section>

          <section id="information-we-collect" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>02</span>
              Information We Collect
            </div>

            <h2>Information provided to us</h2>

            <p>Depending on how you interact with BR30 CRM, we may collect information that you voluntarily provide when creating an account, contacting us, using the platform, or requesting support.</p>

            <h3>Account and identity information</h3>

            <ul>
              <li>Name and display name.</li>
              <li>Email address.</li>
              <li>Phone number where provided.</li>
              <li>Login credentials and authentication information.</li>
              <li>Profile information supplied by the account holder.</li>
            </ul>

            <h3>Business information</h3>

            <ul>
              <li>Company or organization information.</li>
              <li>Business contact information.</li>
              <li>Customer, lead, contact, and deal information.</li>
              <li>Tasks, activities, notes, and operational records.</li>
              <li>Other information entered into the CRM by authorized users.</li>
            </ul>

            <h3>Technical information</h3>

            <p>
              We may also receive technical information associated with your use of the platform, such as browser type, device information, operating system, IP address, approximate location derived from technical information, log data, session information, and information about interactions with
              our services.
            </p>
          </section>

          <section id="how-we-use-information" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>03</span>
              How We Use Information
            </div>

            <h2>Purposes for processing information</h2>

            <p>Information may be used to provide, maintain, improve, and secure BR30 CRM and to support the relationship between you and BR30 CRM.</p>

            <ul>
              <li>Creating and maintaining user accounts.</li>
              <li>Authenticating users and protecting accounts.</li>
              <li>Providing CRM functionality and requested services.</li>
              <li>Processing and responding to support requests.</li>
              <li>Communicating important service information.</li>
              <li>Detecting, preventing, and investigating security incidents.</li>
              <li>Monitoring service performance and reliability.</li>
              <li>Improving product functionality and user experience.</li>
              <li>Maintaining records required for legitimate business purposes.</li>
              <li>Complying with applicable legal obligations.</li>
            </ul>
          </section>

          <section id="account-information" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>04</span>
              Account Information
            </div>

            <h2>Managing your BR30 CRM account</h2>

            <p>When you create a BR30 CRM account, certain information is required to establish and operate the account. This may include your name, email address, password credentials, account role, and other information necessary to provide authentication and account management features.</p>

            <p>You are responsible for keeping your login credentials confidential and for notifying BR30 CRM if you believe that your account has been accessed without authorization.</p>

            <div className="br30-legal-note">
              <strong>Account security:</strong> Never share your password or authentication codes with another person. BR30 CRM will not intentionally request your password through an unsolicited communication.
            </div>
          </section>

          <section id="business-data" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>05</span>
              Business Data
            </div>

            <h2>Information you store in the CRM</h2>

            <p>BR30 CRM may allow customers and authorized users to store business information such as customer records, contacts, leads, deals, activities, tasks, notes, and related operational information.</p>

            <p>Where a customer uses BR30 CRM to process information belonging to its customers, employees, business partners, or other individuals, the customer remains responsible for determining what information is entered into the platform and ensuring that its collection and use are lawful.</p>

            <p>Customers should avoid storing information that is not necessary for their legitimate business purposes and should apply appropriate access controls to users who can access business records.</p>
          </section>

          <section id="cookies" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>06</span>
              Cookies & Similar Technologies
            </div>

            <h2>Cookies and local storage</h2>

            <p>BR30 CRM may use cookies, local storage, session storage, pixels, logs, and similar technologies to support essential functionality and understand how users interact with our services.</p>

            <h3>Essential technologies</h3>

            <p>Certain technologies may be required for authentication, security, session management, preferences, and other essential functions.</p>

            <h3>Analytics and performance</h3>

            <p>Where enabled, analytics technologies may help us understand traffic patterns, service performance, feature usage, and general engagement so that we can improve the platform.</p>

            <p>Your browser may provide controls for managing cookies and similar technologies. Disabling certain technologies may affect the availability or functionality of some features.</p>
          </section>

          <section id="data-sharing" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>07</span>
              Data Sharing & Disclosure
            </div>

            <h2>When information may be shared</h2>

            <p>BR30 CRM does not treat customer information as something to be disclosed indiscriminately. Information may be shared when necessary to operate the service, fulfill a request, protect the platform, or comply with legal obligations.</p>

            <h3>Service providers</h3>

            <p>We may use trusted third-party providers for infrastructure, hosting, authentication, communications, analytics, security, payment processing, email delivery, monitoring, and other operational services.</p>

            <h3>Legal requirements</h3>

            <p>Information may be disclosed where reasonably necessary to comply with applicable law, legal process, governmental requests, court orders, or to protect the rights, safety, security, and property of BR30 CRM, our users, or others.</p>

            <h3>Business transactions</h3>

            <p>If BR30 CRM is involved in a merger, acquisition, restructuring, financing, sale of assets, or similar business transaction, information may be transferred as part of that transaction subject to applicable legal requirements.</p>
          </section>

          <section id="data-security" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>08</span>
              Data Security
            </div>

            <h2>Protecting information</h2>

            <p>BR30 CRM uses reasonable technical and organizational measures designed to protect information against unauthorized access, alteration, disclosure, loss, or destruction.</p>

            <ul>
              <li>Authentication and access-control mechanisms.</li>
              <li>Protected communication channels where appropriate.</li>
              <li>Credential and session security measures.</li>
              <li>Monitoring and logging of relevant system activity.</li>
              <li>Operational controls intended to limit unauthorized access.</li>
            </ul>

            <p>No internet-based system can be guaranteed to be completely secure. Users should also take appropriate steps to protect their accounts, devices, credentials, and business data.</p>
          </section>

          <section id="data-retention" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>09</span>
              Data Retention
            </div>

            <h2>How long information may be retained</h2>

            <p>We retain information for as long as reasonably necessary for the purposes described in this Privacy Policy, including providing services, maintaining business records, resolving disputes, enforcing agreements, preventing abuse, and complying with legal obligations.</p>

            <p>Retention periods may vary depending on the type of information, the nature of the relationship with the customer, account status, operational requirements, and applicable legal obligations.</p>

            <p>When information is no longer required for legitimate purposes, it may be deleted, anonymized, aggregated, or otherwise handled in accordance with applicable retention practices.</p>
          </section>

          <section id="your-rights" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>10</span>
              Your Rights & Choices
            </div>

            <h2>Your privacy choices</h2>

            <p>Depending on your location and applicable law, you may have rights concerning personal information associated with your account.</p>

            <ul>
              <li>Request access to certain personal information.</li>
              <li>Request correction of inaccurate information.</li>
              <li>Request deletion where legally applicable.</li>
              <li>Object to or restrict certain processing activities.</li>
              <li>Request information about certain processing activities.</li>
              <li>Withdraw consent where processing is based on consent.</li>
            </ul>

            <p>Some requests may be subject to applicable legal limitations, identity verification, contractual requirements, or other legitimate restrictions.</p>

            <div className="br30-legal-note">
              <strong>Note:</strong> If you use BR30 CRM through an organization, certain requests concerning business data may need to be directed to that organization because it may control the information entered into the CRM.
            </div>
          </section>

          <section id="third-party-services" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>11</span>
              Third-Party Services
            </div>

            <h2>External services and integrations</h2>

            <p>BR30 CRM may integrate with or rely on third-party services to provide infrastructure, communications, analytics, authentication, payments, hosting, security, or other functionality.</p>

            <p>Third-party services may process information according to their own privacy policies and terms. Where appropriate, users should review the privacy information provided by those third parties.</p>

            <p>BR30 CRM is not responsible for the independent privacy practices of third-party websites or services that are outside our control.</p>
          </section>

          <section id="children-privacy" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>12</span>
              Children's Privacy
            </div>

            <h2>Services intended for business users</h2>

            <p>BR30 CRM is designed primarily for business and professional use and is not intended to be directed toward children.</p>

            <p>We do not knowingly seek to collect personal information from children in circumstances where such collection is prohibited by applicable law.</p>

            <p>If you believe that a child has provided personal information to BR30 CRM inappropriately, please contact us so that the matter can be reviewed and appropriate action can be considered.</p>
          </section>

          <section id="international-data" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>13</span>
              International Data
            </div>

            <h2>Data processing and storage locations</h2>

            <p>Depending on the infrastructure and service providers used by BR30 CRM, information may be processed or stored in locations different from the country where you live.</p>

            <p>Where applicable, we take reasonable steps intended to ensure that transfers and processing of personal information are handled in accordance with applicable legal requirements.</p>
          </section>

          <section id="policy-changes" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>14</span>
              Changes to This Policy
            </div>

            <h2>Keeping this Privacy Policy current</h2>

            <p>We may update this Privacy Policy from time to time to reflect changes in our services, technology, operational practices, legal requirements, or other relevant circumstances.</p>

            <p>
              When changes are made, the updated version will be published on the applicable BR30 CRM website or service. The <strong>Last Updated</strong> date at the beginning of this policy indicates when the policy was most recently revised.
            </p>

            <p>Your continued use of BR30 CRM after an updated policy becomes effective may be subject to the revised policy, to the extent permitted by applicable law.</p>
          </section>

          <section id="contact" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>15</span>
              Contact Us
            </div>

            <h2>Questions about privacy?</h2>

            <p>If you have questions, concerns, or requests regarding this Privacy Policy or the way BR30 CRM handles information, please contact the appropriate BR30 CRM support or privacy contact.</p>

            <div className="br30-legal-contact-card">
              <div className="br30-legal-contact-icon">
                <Mail size={16} />
              </div>

              <div>
                <strong>Privacy & Support</strong>

                <a href={LEGAL_PRIVACY_POLICY_SUPPORT_FORM_URL} className="br30-support-ticket-link" target="_blank" rel="noopener noreferrer">
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

                <p>For account-specific requests, please create a support ticket using the email address associated with your BR30 CRM account whenever possible.</p>
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

export default PrivacyPolicy;
