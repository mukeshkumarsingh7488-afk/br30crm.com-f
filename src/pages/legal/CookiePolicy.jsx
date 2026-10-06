import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUp, ChevronRight, Cookie, FileText, Mail, ShieldCheck, UserCheck } from "lucide-react";
import LandingNavbar from "../../components/landing/LandingNavbar";
import LandingFooter from "../../components/landing/LandingFooter";
import { LEGAL_COOKIE_POLICY_SUPPORT_FORM_URL } from "../../constants/supportForm";

function CookiePolicy() {
  const [activeSection, setActiveSection] = useState("introduction");

  const sections = [
    { id: "introduction", number: "01", title: "Introduction" },
    { id: "what-are-cookies", number: "02", title: "What Are Cookies" },
    { id: "how-we-use", number: "03", title: "How We Use Cookies" },
    { id: "essential-cookies", number: "04", title: "Essential Cookies" },
    { id: "preferences", number: "05", title: "Preference Technologies" },
    { id: "analytics", number: "06", title: "Analytics & Performance" },
    { id: "security", number: "07", title: "Security Technologies" },
    { id: "local-storage", number: "08", title: "Local & Session Storage" },
    { id: "third-party", number: "09", title: "Third-Party Technologies" },
    { id: "browser-controls", number: "10", title: "Browser Controls" },
    { id: "changes", number: "11", title: "Changes to This Policy" },
    { id: "contact", number: "12", title: "Contact Us" },
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
            <span>Cookie Policy</span>
          </div>

          <div className="br30-legal-eyebrow">
            <span className="br30-legal-eyebrow-dot" />
            BR30 CRM Legal
          </div>

          <h1>
            Cookie <span>Policy</span>
          </h1>

          <p className="br30-legal-hero-description">This Cookie Policy explains how BR30 CRM may use cookies, local storage, session storage, analytics technologies, and similar technologies when you access or use our website, application, and related services.</p>

          <div className="br30-legal-meta">
            <div className="br30-legal-meta-item">
              <Cookie size={14} />
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
                <Cookie size={18} />
              </div>

              <div>
                <h2>Understanding how BR30 CRM uses cookies</h2>

                <p>BR30 CRM may use cookies and similar technologies to support essential functionality, maintain secure sessions, remember preferences, understand service performance, and improve the user experience.</p>
              </div>
            </div>
          </div>

          <section id="introduction" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>01</span>
              Introduction
            </div>

            <h2>About this Cookie Policy</h2>

            <p>This Cookie Policy explains how BR30 CRM may use cookies, local storage, session storage, pixels, logs, and other similar technologies when users access or interact with our website, application, software, and related services.</p>

            <p>These technologies may help BR30 CRM provide essential functionality, maintain account sessions, remember settings, understand service usage, improve performance, and support security.</p>

            <div className="br30-legal-note">
              <strong>Important:</strong> The technologies used by BR30 CRM may vary depending on the features, services, browser, device, integrations, and configuration available at a particular time.
            </div>
          </section>

          <section id="what-are-cookies" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>02</span>
              What Are Cookies
            </div>

            <h2>Understanding cookies and similar technologies</h2>

            <p>Cookies are small data files that websites may store on a browser or device. They can allow a website to recognize a browser, maintain a session, remember preferences, or support other functionality.</p>

            <h3>Session cookies</h3>

            <p>Session cookies may remain available only while a browsing session is active and may be removed when the browser session ends.</p>

            <h3>Persistent cookies</h3>

            <p>Persistent cookies may remain on a device for a specified period or until they are deleted through browser controls.</p>

            <h3>Similar technologies</h3>

            <p>Depending on the service, BR30 CRM may also use technologies such as local storage, session storage, pixels, logs, and other mechanisms that perform functions similar to cookies.</p>
          </section>

          <section id="how-we-use" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>03</span>
              How We Use Cookies
            </div>

            <h2>Purposes for using these technologies</h2>

            <p>Cookies and similar technologies may be used for several purposes depending on the context in which they are deployed.</p>

            <ul>
              <li>Maintaining login and authentication sessions.</li>
              <li>Supporting essential website and application functionality.</li>
              <li>Remembering user preferences and selected settings.</li>
              <li>Understanding how features and pages are used.</li>
              <li>Monitoring service performance and reliability.</li>
              <li>Supporting security and fraud prevention.</li>
              <li>Improving website and product experiences.</li>
              <li>Understanding general traffic and engagement patterns.</li>
            </ul>
          </section>

          <section id="essential-cookies" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>04</span>
              Essential Cookies
            </div>

            <h2>Technologies required for core functionality</h2>

            <p>Certain cookies or similar technologies may be necessary for the website or application to operate correctly.</p>

            <ul>
              <li>Authentication and account access.</li>
              <li>Secure session management.</li>
              <li>Security and abuse prevention.</li>
              <li>Remembering essential service settings.</li>
              <li>Supporting navigation and application functionality.</li>
            </ul>

            <p>Disabling essential technologies may cause some features of BR30 CRM to become unavailable or operate differently.</p>

            <div className="br30-legal-note">
              <strong>Essential functionality:</strong> Some technologies may be necessary for the service to recognize your session and provide features you have requested.
            </div>
          </section>

          <section id="preferences" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>05</span>
              Preference Technologies
            </div>

            <h2>Remembering your preferences</h2>

            <p>BR30 CRM may use cookies or local storage to remember certain choices made by users so that those choices can be maintained across pages or sessions where appropriate.</p>

            <h3>Examples of preferences</h3>

            <ul>
              <li>Theme or appearance preferences.</li>
              <li>Interface settings.</li>
              <li>Session-related preferences.</li>
              <li>Previously selected options.</li>
              <li>Other settings required to improve the user experience.</li>
            </ul>

            <p>Preference technologies are intended to make the service more convenient and consistent for users.</p>
          </section>

          <section id="analytics" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>06</span>
              Analytics & Performance
            </div>

            <h2>Understanding service usage</h2>

            <p>Where analytics technologies are enabled, BR30 CRM may use them to understand general patterns in website and service usage.</p>

            <ul>
              <li>Understanding page and feature engagement.</li>
              <li>Measuring general traffic patterns.</li>
              <li>Identifying performance issues.</li>
              <li>Understanding how users navigate the service.</li>
              <li>Improving features and overall user experience.</li>
            </ul>

            <p>Analytics information may be combined with other technical information where appropriate to understand service performance and reliability.</p>
          </section>

          <section id="security" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>07</span>
              Security Technologies
            </div>

            <h2>Supporting platform security</h2>

            <p>Cookies, session information, logs, and similar technologies may be used to support security functions and help identify unusual, unauthorized, abusive, or potentially harmful activity.</p>

            <ul>
              <li>Maintaining secure sessions.</li>
              <li>Supporting authentication controls.</li>
              <li>Detecting suspicious activity.</li>
              <li>Protecting against unauthorized access.</li>
              <li>Investigating security incidents.</li>
            </ul>

            <p>These technologies may operate alongside other technical and organizational security measures used by BR30 CRM.</p>
          </section>

          <section id="local-storage" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>08</span>
              Local & Session Storage
            </div>

            <h2>Browser storage technologies</h2>

            <p>In addition to traditional cookies, BR30 CRM may use browser storage mechanisms such as local storage or session storage for application functionality.</p>

            <p>These mechanisms can allow information to be stored directly in the browser and may be used to maintain temporary application state, remember preferences, or support other functionality.</p>

            <h3>Session storage</h3>

            <p>Session storage is generally associated with an active browser session and may be cleared when that session ends.</p>

            <h3>Local storage</h3>

            <p>Local storage may retain selected information in the browser until it is removed by the application, browser, or user.</p>
          </section>

          <section id="third-party" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>09</span>
              Third-Party Technologies
            </div>

            <h2>External services and integrations</h2>

            <p>BR30 CRM may use third-party services that place or access cookies or similar technologies in connection with analytics, infrastructure, authentication, communications, payments, security, monitoring, or other functionality.</p>

            <p>Third-party providers may process information according to their own privacy policies and terms. Their use of cookies or similar technologies may therefore be governed by policies maintained by those providers.</p>

            <p>BR30 CRM does not control the independent privacy practices of third-party services that operate outside our direct control.</p>

            <div className="br30-legal-note">
              <strong>Third-party notice:</strong> The availability and use of particular third-party technologies may change as BR30 CRM services and integrations evolve.
            </div>
          </section>

          <section id="browser-controls" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>10</span>
              Browser Controls
            </div>

            <h2>Managing cookies through your browser</h2>

            <p>Most modern browsers provide settings that allow users to view, block, delete, or otherwise manage cookies and certain browser storage technologies.</p>

            <p>The available controls vary between browsers and devices. Users can generally find these controls within their browser's privacy, security, or settings menus.</p>

            <h3>Disabling technologies</h3>

            <p>If cookies or similar technologies are disabled, certain BR30 CRM features may not operate as intended, particularly features that depend on authentication, sessions, preferences, or other essential functionality.</p>

            <div className="br30-legal-note">
              <strong>Please note:</strong> Browser controls may not affect every type of technology used by a website or application.
            </div>
          </section>

          <section id="changes" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>11</span>
              Changes to This Policy
            </div>

            <h2>Keeping this Cookie Policy current</h2>

            <p>BR30 CRM may update this Cookie Policy from time to time to reflect changes in technology, services, integrations, operational practices, legal requirements, or other relevant circumstances.</p>

            <p>
              When changes are made, the updated version will be published on the applicable BR30 CRM website or service. The <strong>Last Updated</strong> date at the beginning of this policy indicates when the policy was most recently revised.
            </p>

            <p>Your continued use of BR30 CRM after an updated policy becomes effective may be subject to the revised policy, to the extent permitted by applicable law.</p>
          </section>

          <section id="contact" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>12</span>
              Contact Us
            </div>

            <h2>Questions about cookies?</h2>

            <p>If you have questions, concerns, or requests regarding this Cookie Policy or the technologies used by BR30 CRM, please contact our support team.</p>

            <div className="br30-legal-contact-card">
              <div className="br30-legal-contact-icon">
                <Mail size={16} />
              </div>

              <div>
                <strong>Privacy & Support</strong>

                <a href={LEGAL_COOKIE_POLICY_SUPPORT_FORM_URL} className="br30-support-ticket-link" rel="noopener noreferrer">
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

export default CookiePolicy;
