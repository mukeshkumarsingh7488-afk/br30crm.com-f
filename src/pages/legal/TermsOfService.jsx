import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUp, ChevronRight, FileText, Gavel, Mail, ShieldCheck, UserCheck } from "lucide-react";
import LandingNavbar from "../../components/landing/LandingNavbar";
import LandingFooter from "../../components/landing/LandingFooter";

function TermsOfService() {
  const [activeSection, setActiveSection] = useState("agreement");

  const sections = [
    { id: "agreement", number: "01", title: "Agreement to Terms" },
    { id: "eligibility", number: "02", title: "Eligibility & Accounts" },
    { id: "use-of-services", number: "03", title: "Use of Services" },
    { id: "acceptable-use", number: "04", title: "Acceptable Use" },
    { id: "business-data", number: "05", title: "Business Data" },
    { id: "subscriptions", number: "06", title: "Plans & Subscriptions" },
    { id: "payments", number: "07", title: "Payments & Billing" },
    { id: "intellectual-property", number: "08", title: "Intellectual Property" },
    { id: "third-party-services", number: "09", title: "Third-Party Services" },
    { id: "availability", number: "10", title: "Service Availability" },
    { id: "termination", number: "11", title: "Suspension & Termination" },
    { id: "disclaimers", number: "12", title: "Disclaimers" },
    { id: "limitation", number: "13", title: "Limitation of Liability" },
    { id: "indemnification", number: "14", title: "Indemnification" },
    { id: "changes", number: "15", title: "Changes to Terms" },
    { id: "contact", number: "16", title: "Contact Us" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const offset = 150;
      let current = "agreement";

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
            <span>Terms of Service</span>
          </div>

          <div className="br30-legal-eyebrow">
            <span className="br30-legal-eyebrow-dot" />
            BR30 CRM Legal
          </div>

          <h1>
            Terms of <span>Service</span>
          </h1>

          <p className="br30-legal-hero-description">These Terms of Service govern your access to and use of BR30 CRM, including our website, application, software, products, features, and related services.</p>

          <div className="br30-legal-meta">
            <div className="br30-legal-meta-item">
              <FileText size={14} />
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
              <Gavel size={14} />
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
                <ShieldCheck size={18} />
              </div>

              <div>
                <h2>Welcome to BR30 CRM</h2>

                <p>These Terms establish the rules and conditions that apply when you access or use BR30 CRM. Please read them carefully before using our services.</p>
              </div>
            </div>
          </div>

          <section id="agreement" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>01</span>
              Agreement to Terms
            </div>

            <h2>Acceptance of these Terms</h2>

            <p>These Terms of Service constitute an agreement between you and BR30 CRM concerning your access to and use of the BR30 CRM platform, website, software, products, and related services.</p>

            <p>By accessing, registering for, or using BR30 CRM, you acknowledge that you have read, understood, and agreed to be bound by these Terms and any applicable policies referenced within them.</p>

            <div className="br30-legal-note">
              <strong>Important:</strong> If you do not agree with these Terms, you should not access or use the applicable BR30 CRM services.
            </div>
          </section>

          <section id="eligibility" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>02</span>
              Eligibility & Accounts
            </div>

            <h2>Account requirements</h2>

            <p>BR30 CRM is designed primarily for business and professional users. By using the service, you represent that you have the legal capacity and authority necessary to enter into these Terms.</p>

            <h3>Account information</h3>

            <p>You may be required to provide accurate information when creating an account. You are responsible for keeping your account information reasonably current and accurate.</p>

            <h3>Account security</h3>

            <p>You are responsible for protecting your login credentials and for activities performed through your account. If you believe your account has been accessed without authorization, you should contact BR30 CRM promptly.</p>
          </section>

          <section id="use-of-services" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>03</span>
              Use of Services
            </div>

            <h2>Using BR30 CRM</h2>

            <p>Subject to these Terms, BR30 CRM provides you with access to the features and functionality made available through the applicable service.</p>

            <p>You agree to use the service only for lawful business purposes and in accordance with these Terms, applicable policies, and applicable laws and regulations.</p>

            <ul>
              <li>Use the service only for legitimate purposes.</li>
              <li>Provide information that is accurate to the best of your knowledge.</li>
              <li>Maintain appropriate security for your account.</li>
              <li>Respect the rights of other users and third parties.</li>
              <li>Use available features according to their intended purpose.</li>
            </ul>
          </section>

          <section id="acceptable-use" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>04</span>
              Acceptable Use
            </div>

            <h2>Prohibited activities</h2>

            <p>You must not use BR30 CRM in a manner that could damage the service, interfere with other users, compromise security, or violate applicable law.</p>

            <ul>
              <li>Attempting to gain unauthorized access to accounts or systems.</li>
              <li>Introducing malicious code, malware, or harmful content.</li>
              <li>Interfering with the availability or operation of the service.</li>
              <li>Using the service for fraudulent or unlawful activities.</li>
              <li>Attempting to bypass security or access restrictions.</li>
              <li>Copying or exploiting platform functionality without authorization.</li>
              <li>Using automated methods in a way that creates unreasonable system load.</li>
            </ul>

            <p>BR30 CRM may take reasonable measures when it identifies activities that violate these requirements or create security, operational, or legal risks.</p>
          </section>

          <section id="business-data" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>05</span>
              Business Data
            </div>

            <h2>Information stored by customers</h2>

            <p>BR30 CRM may allow you to store customer records, contacts, leads, deals, activities, notes, tasks, and other business information through the platform.</p>

            <p>You remain responsible for the information you or your authorized users enter into BR30 CRM and for ensuring that you have the necessary rights, permissions, and lawful basis to collect and use such information.</p>

            <p>You should avoid storing information that is unnecessary for your legitimate business purposes and should apply appropriate access controls to users who can access business records.</p>

            <div className="br30-legal-note">
              <strong>Customer responsibility:</strong> BR30 CRM provides the platform, but customers remain responsible for their own business data, users, permissions, and lawful use of the service.
            </div>
          </section>

          <section id="subscriptions" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>06</span>
              Plans & Subscriptions
            </div>

            <h2>Service plans</h2>

            <p>BR30 CRM may provide different plans, packages, features, usage limits, or subscription options. The features and limitations of each plan may be described on the applicable pricing or service page.</p>

            <p>Certain features may only be available under specific plans or subscriptions. BR30 CRM may change, introduce, or discontinue plans or features from time to time, subject to applicable contractual or legal requirements.</p>

            <h3>Plan changes</h3>

            <p>If you change your selected plan, access to particular features may change according to the applicable plan terms and billing arrangements.</p>
          </section>

          <section id="payments" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>07</span>
              Payments & Billing
            </div>

            <h2>Charges and payment obligations</h2>

            <p>Where BR30 CRM offers paid services, applicable fees, billing periods, taxes, payment methods, and other payment information will be presented during the relevant purchase or subscription process.</p>

            <p>You are responsible for providing valid payment information and for paying applicable charges associated with your selected services.</p>

            <h3>Payment processing</h3>

            <p>Payments may be processed through third-party payment providers. Those providers may process payment information according to their own terms and privacy practices.</p>

            <h3>Taxes</h3>

            <p>Applicable taxes, duties, or governmental charges may be added to the amounts payable where required by law.</p>
          </section>

          <section id="intellectual-property" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>08</span>
              Intellectual Property
            </div>

            <h2>BR30 CRM technology and content</h2>

            <p>BR30 CRM and its applicable software, interface, design, branding, documentation, features, content, and underlying technology may be protected by intellectual property and other applicable laws.</p>

            <p>Except for rights expressly granted under these Terms, BR30 CRM retains its rights in the platform and related materials.</p>

            <h3>Your business content</h3>

            <p>You retain your rights in business information and content that you lawfully submit to the platform, subject to the rights and permissions necessary for BR30 CRM to provide the services.</p>

            <div className="br30-legal-note">
              <strong>Brand protection:</strong> BR30 CRM names, logos, and branding may not be used in a manner that suggests unauthorized affiliation or endorsement.
            </div>
          </section>

          <section id="third-party-services" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>09</span>
              Third-Party Services
            </div>

            <h2>External services and integrations</h2>

            <p>BR30 CRM may integrate with or rely on third-party services for infrastructure, hosting, authentication, communications, analytics, payments, security, or other functionality.</p>

            <p>Third-party services may operate under their own terms and privacy policies. Your use of those services may therefore be subject to additional terms established by the relevant provider.</p>

            <p>BR30 CRM is not responsible for independent third-party services that are outside our control.</p>
          </section>

          <section id="availability" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>10</span>
              Service Availability
            </div>

            <h2>Availability and service changes</h2>

            <p>BR30 CRM aims to provide a reliable service, but uninterrupted availability cannot be guaranteed at all times.</p>

            <p>Service availability may be affected by maintenance, upgrades, infrastructure issues, security events, third-party services, internet connectivity, or circumstances outside our reasonable control.</p>

            <p>BR30 CRM may modify, improve, suspend, or discontinue particular features where reasonably necessary for operational, technical, security, legal, or business reasons.</p>
          </section>

          <section id="termination" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>11</span>
              Suspension & Termination
            </div>

            <h2>Account suspension and termination</h2>

            <p>You may stop using BR30 CRM at any time, subject to any applicable subscription, payment, or contractual obligations.</p>

            <p>BR30 CRM may suspend or terminate access where reasonably necessary to address violations of these Terms, security risks, unlawful activity, payment issues, abuse, or other circumstances affecting the service or its users.</p>

            <h3>Effect of termination</h3>

            <p>Following termination, access to certain account features or stored information may no longer be available. Applicable retention requirements and legal obligations may continue after an account is closed.</p>
          </section>

          <section id="disclaimers" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>12</span>
              Disclaimers
            </div>

            <h2>Service provided on an available basis</h2>

            <p>To the extent permitted by applicable law, BR30 CRM provides its services on an available basis and does not guarantee that every feature will always be uninterrupted, error-free, or suitable for every particular business requirement.</p>

            <p>Users remain responsible for evaluating whether the service is appropriate for their business needs and for maintaining suitable backups, security practices, and operational controls.</p>

            <div className="br30-legal-note">
              <strong>Important:</strong> Nothing in these Terms is intended to exclude or limit rights or protections that cannot lawfully be excluded or limited under applicable law.
            </div>
          </section>

          <section id="limitation" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>13</span>
              Limitation of Liability
            </div>

            <h2>Limits to liability</h2>

            <p>To the maximum extent permitted by applicable law, BR30 CRM and its applicable personnel, service providers, or affiliates will not be responsible for indirect, incidental, special, consequential, or punitive losses arising from or related to use of the service.</p>

            <p>This may include losses associated with business interruption, loss of profits, loss of opportunities, or loss of data, subject to applicable law and any limitations that cannot legally be excluded.</p>

            <p>Nothing in these Terms limits liability where such limitation is prohibited by applicable law.</p>
          </section>

          <section id="indemnification" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>14</span>
              Indemnification
            </div>

            <h2>Your responsibility for certain claims</h2>

            <p>To the extent permitted by applicable law, you may be responsible for claims, losses, liabilities, damages, and reasonable expenses arising from your unlawful use of the service, violation of these Terms, or infringement of another person's rights.</p>

            <p>This section applies only to the extent such obligations are enforceable under applicable law.</p>
          </section>

          <section id="changes" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>15</span>
              Changes to Terms
            </div>

            <h2>Keeping these Terms current</h2>

            <p>BR30 CRM may update these Terms from time to time to reflect changes in our services, technology, business practices, legal requirements, or other relevant circumstances.</p>

            <p>
              When changes are made, the updated version will be published on the applicable BR30 CRM website or service. The <strong>Last Updated</strong> date at the beginning of these Terms indicates when they were most recently revised.
            </p>

            <p>Your continued use of BR30 CRM after updated Terms become effective may be subject to the revised Terms, to the extent permitted by applicable law.</p>
          </section>

          <section id="contact" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>16</span>
              Contact Us
            </div>

            <h2>Questions about these Terms?</h2>

            <p>If you have questions, concerns, or requests regarding these Terms of Service or your use of BR30 CRM, please contact our support team.</p>

            <div className="br30-legal-contact-card">
              <div className="br30-legal-contact-icon">
                <Mail size={16} />
              </div>

              <div>
                <strong>BR30 CRM Support</strong>

                <a
                  href="https://br30crm-com-f.vercel.app/public/forms/6ac4a4ce8ab8658ebe3748f7/br30-crm-legal-support-ticket?utm_source=br30crm-legal-terms-of-service&utm_medium=website&lead_source=br30crm-legal-terms-of-service&form_id=6ac2de8b45d94386aa073fad&source_id=6ac2e1f745d94386aa073fb4"
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

export default TermsOfService;
