import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUp, BriefcaseBusiness, ChevronRight, Code2, Compass, Database, FileText, Mail, Rocket, ShieldCheck, Target, User, Users, Ticket } from "lucide-react";
import LandingNavbar from "../../components/landing/LandingNavbar";
import LandingFooter from "../../components/landing/LandingFooter";
import { SUPPORT_FORM_URL } from "../../constants/supportForm";

function FounderAbout() {
  const [activeSection, setActiveSection] = useState("introduction");

  const sections = [
    { id: "introduction", number: "01", title: "Introduction" },
    { id: "about-founder", number: "02", title: "About the Founder" },
    { id: "vision", number: "03", title: "Vision" },
    { id: "mission", number: "04", title: "Mission" },
    { id: "why-br30", number: "05", title: "Why BR30 CRM" },
    { id: "product-philosophy", number: "06", title: "Product Philosophy" },
    { id: "business-focus", number: "07", title: "Business Focus" },
    { id: "technology", number: "08", title: "Technology & Product" },
    { id: "customer-first", number: "09", title: "Customer First" },
    { id: "future", number: "10", title: "Looking Ahead" },
    { id: "contact", number: "11", title: "Contact" },
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

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
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
      <style>{`.br30-legal-page{min-height:100vh;background:var(--crm-bg);color:var(--crm-text);font-family:var(--crm-font)}.br30-legal-page *,.br30-legal-page *::before,.br30-legal-page *::after{box-sizing:border-box}.br30-legal-hero{padding:142px 24px 58px;border-bottom:1px solid var(--crm-border);background:var(--crm-bg)}.br30-legal-hero-inner{width:100%;max-width:1120px;margin:0 auto}.br30-legal-breadcrumb{display:flex;align-items:center;gap:6px;margin-bottom:24px;color:var(--crm-muted);font-size:13px}.br30-legal-breadcrumb a{color:var(--crm-muted);text-decoration:none}.br30-legal-breadcrumb a:hover{color:var(--crm-primary)}.br30-legal-breadcrumb svg{opacity:.5}.br30-legal-eyebrow{display:inline-flex;align-items:center;gap:7px;color:var(--crm-primary);font-size:13px;font-weight:400;letter-spacing:.08em;text-transform:uppercase}.br30-legal-eyebrow-dot{width:6px;height:6px;border-radius:50%;background:var(--crm-primary)}.br30-legal-hero h1{margin:16px 0 14px;color:var(--crm-text);font-size:clamp(32px,4vw,48px);line-height:1.12;letter-spacing:-.025em;font-weight:400}.br30-legal-hero h1 span{color:var(--crm-primary)}.br30-legal-hero-description{max-width:780px;margin:0;color:var(--crm-muted);font-size:14px;line-height:1.75}.br30-legal-meta{display:flex;flex-wrap:wrap;gap:8px;margin-top:25px}.br30-legal-meta-item{display:flex;align-items:center;gap:7px;min-height:35px;padding:7px 11px;border:1px solid var(--crm-border);border-radius:9px;background:var(--crm-surface);color:var(--crm-muted);font-size:13px}.br30-legal-meta-item svg{color:var(--crm-primary)}.br30-legal-meta-item strong{color:var(--crm-text);font-weight:400}.br30-founder-profile{display:grid;grid-template-columns:auto minmax(0,1fr);gap:16px;align-items:center;margin-top:28px;max-width:720px;padding:17px;border:1px solid var(--crm-border);border-radius:13px;background:var(--crm-surface);box-shadow:var(--crm-shadow)}.br30-founder-avatar{width:58px;height:58px;display:grid;place-items:center;border-radius:14px;background:var(--crm-primary-soft);border:1px solid var(--crm-border);color:var(--crm-primary)}.br30-founder-profile strong{display:block;margin-bottom:4px;color:var(--crm-text);font-size:13px;font-weight:400}.br30-founder-profile span{display:block;color:var(--crm-muted);font-size:13px;line-height:1.6}.br30-founder-profile a{display:inline-block;margin-top:5px;color:var(--crm-primary);font-size:13px;text-decoration:none}.br30-founder-profile a:hover{text-decoration:underline}.br30-legal-main{width:100%;max-width:1120px;margin:0 auto;padding:52px 24px 80px;display:grid;grid-template-columns:235px minmax(0,1fr);gap:50px;align-items:start}.br30-legal-sidebar{position:sticky;top:100px;max-height:calc(100vh - 120px);overflow:auto;padding:7px;border:1px solid var(--crm-border);border-radius:13px;background:var(--crm-surface);box-shadow:var(--crm-shadow);scrollbar-width:thin}.br30-legal-sidebar-title{padding:9px 10px 11px;color:var(--crm-text);font-size:13px;font-weight:400;letter-spacing:.06em;text-transform:uppercase}.br30-legal-sidebar-list{display:flex;flex-direction:column;gap:1px}.br30-legal-sidebar button{width:100%;display:flex;align-items:center;gap:8px;padding:8px 9px;border:0;border-radius:8px;background:transparent;color:var(--crm-muted);font:inherit;font-size:13px;line-height:1.35;text-align:left;cursor:pointer}.br30-legal-sidebar button:hover{background:var(--crm-surface-2);color:var(--crm-text)}.br30-legal-sidebar button.active{background:var(--crm-primary-soft);color:var(--crm-primary);font-weight:400}.br30-legal-sidebar-number{width:22px;flex:0 0 22px;font-size:13px;font-weight:400;opacity:.7}.br30-legal-content{min-width:0}.br30-legal-intro-card{margin-bottom:34px;padding:21px;border:1px solid var(--crm-border);border-radius:13px;background:var(--crm-surface);box-shadow:var(--crm-shadow)}.br30-legal-intro-card-top{display:flex;align-items:flex-start;gap:13px}.br30-legal-intro-icon{width:38px;height:38px;flex:0 0 38px;display:grid;place-items:center;border-radius:9px;background:var(--crm-primary-soft);border:1px solid var(--crm-border);color:var(--crm-primary)}.br30-legal-intro-card h2{margin:0 0 5px;color:var(--crm-text);font-size:15px;font-weight:400;line-height:1.4}.br30-legal-intro-card p{margin:0;color:var(--crm-muted);font-size:13px;line-height:1.75}.br30-legal-section{scroll-margin-top:110px;padding:0 0 38px;margin-bottom:38px;border-bottom:1px solid var(--crm-border)}.br30-legal-section:last-child{border-bottom:0;margin-bottom:0}.br30-legal-section-label{display:flex;align-items:center;gap:8px;margin-bottom:10px;color:var(--crm-primary);font-size:13px;font-weight:400;letter-spacing:.08em;text-transform:uppercase}.br30-legal-section-label span{opacity:.65}.br30-legal-section h2{margin:0 0 14px;color:var(--crm-text);font-size:20px;line-height:1.35;font-weight:400;letter-spacing:-.01em}.br30-legal-section h3{margin:22px 0 8px;color:var(--crm-text);font-size:14px;line-height:1.45;font-weight:400}.br30-legal-section p{margin:0 0 13px;color:var(--crm-muted);font-size:13px;line-height:1.85}.br30-legal-section p:last-child{margin-bottom:0}.br30-legal-section ul{margin:10px 0 17px;padding-left:20px}.br30-legal-section li{margin:7px 0;padding-left:2px;color:var(--crm-muted);font-size:13px;line-height:1.75}.br30-legal-section li::marker{color:var(--crm-primary)}.br30-legal-note{margin:18px 0;padding:14px 16px;border-left:3px solid var(--crm-primary);border-radius:0 9px 9px 0;background:var(--crm-surface-2);color:var(--crm-muted);font-size:13px;line-height:1.75}.br30-legal-note strong{color:var(--crm-text)}.br30-founder-values{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:18px 0}.br30-founder-value{padding:14px;border:1px solid var(--crm-border);border-radius:11px;background:var(--crm-surface)}.br30-founder-value-icon{width:32px;height:32px;display:grid;place-items:center;margin-bottom:9px;border-radius:8px;background:var(--crm-primary-soft);color:var(--crm-primary)}.br30-founder-value strong{display:block;margin-bottom:4px;color:var(--crm-text);font-size:13px;font-weight:400}.br30-founder-value p{margin:0!important;font-size:13px!important;line-height:1.65!important}.br30-founder-contact-card{display:grid;grid-template-columns:auto 1fr;gap:12px;margin-top:18px;padding:17px;border:1px solid var(--crm-border);border-radius:11px;background:var(--crm-surface)}.br30-founder-contact-icon{width:36px;height:36px;display:grid;place-items:center;border-radius:9px;background:var(--crm-primary-soft);color:var(--crm-primary)}.br30-founder-contact-card strong{display:block;margin-bottom:4px;color:var(--crm-text);font-size:13px}.br30-founder-contact-card a{color:var(--crm-primary);font-size:13px;text-decoration:none}.br30-founder-contact-card a:hover{text-decoration:underline}.br30-founder-contact-card p{margin:0!important}.br30-legal-top-button{position:fixed;right:20px;bottom:20px;z-index:30;width:38px;height:38px;display:grid;place-items:center;border:1px solid var(--crm-border);border-radius:10px;background:var(--crm-surface);color:var(--crm-text);box-shadow:var(--crm-shadow);cursor:pointer;transition:.2s}.br30-legal-top-button:hover{border-color:var(--crm-primary);color:var(--crm-primary);transform:translateY(-2px)}@media(max-width:900px){.br30-legal-main{grid-template-columns:1fr;gap:25px}.br30-legal-sidebar{position:relative;top:auto;max-height:none}.br30-legal-sidebar-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:600px){.br30-legal-hero{padding:120px 17px 45px}.br30-legal-hero h1{font-size:34px}.br30-legal-hero-description{font-size:13px}.br30-legal-meta{display:grid;grid-template-columns:1fr}.br30-founder-profile{grid-template-columns:1fr;padding:16px}.br30-legal-main{padding:35px 17px 60px}.br30-legal-sidebar-list{grid-template-columns:1fr}.br30-legal-intro-card{padding:18px}.br30-legal-section{scroll-margin-top:90px;padding-bottom:32px;margin-bottom:32px}.br30-legal-section h2{font-size:18px}.br30-legal-section p,.br30-legal-section li{font-size:13px}.br30-founder-values{grid-template-columns:1fr}.br30-founder-contact-card{grid-template-columns:1fr}.br30-legal-top-button{right:13px;bottom:13px}}`}</style>

      <LandingNavbar />

      <header className="br30-legal-hero">
        <div className="br30-legal-hero-inner">
          <div className="br30-legal-breadcrumb">
            <Link to="/">Home</Link>
            <ChevronRight size={13} />
            <span>Company</span>
            <ChevronRight size={13} />
            <span>About the Founder</span>
          </div>

          <div className="br30-legal-eyebrow">
            <span className="br30-legal-eyebrow-dot" />
            BR30 CRM Company
          </div>

          <h1>
            About the <span>Founder</span>
          </h1>

          <p className="br30-legal-hero-description">Learn more about the person behind BR30 CRM, the thinking behind the product, and the principles that shape the direction of the platform.</p>

          <div className="br30-legal-meta">
            <div className="br30-legal-meta-item">
              <User size={14} />
              <span>
                Founder <strong>Mukesh Raj</strong>
              </span>
            </div>

            <div className="br30-legal-meta-item">
              <BriefcaseBusiness size={14} />
              <span>
                Focus <strong>BR30 CRM</strong>
              </span>
            </div>

            <div className="br30-legal-meta-item">
              <FileText size={14} />
              <span>
                Page <strong>Founder Profile</strong>
              </span>
            </div>
          </div>

          <div className="br30-founder-profile">
            <div className="br30-founder-avatar">
              <User size={25} />
            </div>

            <div>
              <strong>Mukesh Raj</strong>
              <span>Founder of BR30 CRM — focused on building a practical, connected workspace for modern business operations.</span>

              <a href={SUPPORT_FORM_URL} className="br30-support-ticket-link" target="_blank" rel="noopener noreferrer"><Ticket size={13} /> Create Support Ticket</a>
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
                <Rocket size={18} />
              </div>

              <div>
                <h2>Building BR30 CRM with purpose</h2>

                <p>BR30 CRM is being developed as an all-in-one business workspace designed to bring important business activities, customer relationships, sales workflows, reporting, and team operations into a more connected environment.</p>
              </div>
            </div>
          </div>

          <section id="introduction" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>01</span>
              Introduction
            </div>

            <h2>A little about the person behind BR30 CRM</h2>

            <p>
              BR30 CRM is founded by <strong>Mukesh Raj</strong>. The platform is being shaped around a straightforward idea: business software should make everyday work clearer, more organized, and easier to manage from one place.
            </p>

            <p>The goal behind BR30 CRM is not simply to create another collection of business tools. The broader objective is to create a connected workspace where customer information, sales activity, business operations, team workflows, and reporting can work together.</p>

            <div className="br30-legal-note">
              <strong>Founder:</strong> Mukesh Raj is the founder associated with BR30 CRM and the product direction described throughout this page.
            </div>
          </section>

          <section id="about-founder" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>02</span>
              About the Founder
            </div>

            <h2>Mukesh Raj</h2>

            <p>Mukesh Raj is the founder of BR30 CRM. His work on the platform centers on creating a unified business system that can bring multiple workflows into a single, structured environment.</p>

            <p>BR30 CRM reflects a product-building approach focused on practical functionality, connected workflows, understandable interfaces, and continuous improvement.</p>

            <p>Rather than treating a CRM as only a place to store contacts, the product direction extends toward a broader business workspace where teams can manage relationships, sales, activities, operations, and information in a connected way.</p>

            <div className="br30-founder-values">
              <div className="br30-founder-value">
                <div className="br30-founder-value-icon">
                  <Compass size={16} />
                </div>

                <strong>Product Direction</strong>

                <p>Building the platform around practical business workflows and connected functionality.</p>
              </div>

              <div className="br30-founder-value">
                <div className="br30-founder-value-icon">
                  <Target size={16} />
                </div>

                <strong>Business Focus</strong>

                <p>Helping businesses organize customer, sales, operational, and team information in one workspace.</p>
              </div>

              <div className="br30-founder-value">
                <div className="br30-founder-value-icon">
                  <Users size={16} />
                </div>

                <strong>User Perspective</strong>

                <p>Keeping everyday usability and clear workflows at the center of product development.</p>
              </div>

              <div className="br30-founder-value">
                <div className="br30-founder-value-icon">
                  <ShieldCheck size={16} />
                </div>

                <strong>Responsible Building</strong>

                <p>Developing the platform with attention to reliability, access, organization, and responsible handling of business information.</p>
              </div>
            </div>
          </section>

          <section id="vision" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>03</span>
              Vision
            </div>

            <h2>A connected workspace for modern businesses</h2>

            <p>The vision behind BR30 CRM is to create a business platform where important workflows can live together instead of being spread across disconnected tools.</p>

            <p>Businesses often work with multiple systems for customer information, leads, sales, tasks, reporting, communication, and internal coordination. BR30 CRM is designed around the idea that these activities can be connected through a common workspace.</p>

            <p>This vision is intended to make business information easier to understand and easier for teams to act upon.</p>
          </section>

          <section id="mission" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>04</span>
              Mission
            </div>

            <h2>Making business management more organized</h2>

            <p>The mission of BR30 CRM is to develop useful business software that helps teams organize their work without unnecessary complexity.</p>

            <p>The platform is being developed around several practical objectives:</p>

            <ul>
              <li>Bring important business workflows into one connected environment.</li>

              <li>Make customer and sales information easier to organize.</li>

              <li>Help teams maintain visibility over their daily activities.</li>

              <li>Provide reporting and business information in an accessible format.</li>

              <li>Create interfaces that remain understandable as business operations grow.</li>

              <li>Continue improving the platform through product development and user needs.</li>
            </ul>
          </section>

          <section id="why-br30" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>05</span>
              Why BR30 CRM
            </div>

            <h2>More than a traditional customer database</h2>

            <p>BR30 CRM is designed with a broader interpretation of CRM software. Customer relationships remain important, but they are part of a larger business workflow.</p>

            <p>Leads can move into opportunities, opportunities can become deals, activities can be connected to customer records, teams can coordinate work, and reporting can provide visibility into business activity.</p>

            <p>The product direction is therefore centered around connected business operations rather than isolated features.</p>

            <div className="br30-legal-note">
              <strong>Core idea:</strong> Business information becomes more useful when the different activities surrounding it can be connected and understood together.
            </div>
          </section>

          <section id="product-philosophy" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>06</span>
              Product Philosophy
            </div>

            <h2>Simple where possible, powerful where necessary</h2>

            <p>The product philosophy behind BR30 CRM focuses on balancing functionality with usability. Business software can become difficult to operate when every feature adds unnecessary complexity.</p>

            <h3>Clarity</h3>

            <p>Information should be structured in a way that allows users to understand what is happening without having to navigate through unnecessary complexity.</p>

            <h3>Connected workflows</h3>

            <p>Features should work together where there is a meaningful relationship between them. Customer records, leads, deals, activities, teams, and reports should contribute to a connected business picture.</p>

            <h3>Continuous improvement</h3>

            <p>BR30 CRM is intended to evolve over time. Product improvements, interface refinements, new functionality, and operational requirements can influence future development.</p>
          </section>

          <section id="business-focus" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>07</span>
              Business Focus
            </div>

            <h2>Designed around real business workflows</h2>

            <p>BR30 CRM focuses on the areas that commonly form the foundation of day-to-day business management.</p>

            <ul>
              <li>Customer and contact management for maintaining organized relationship information.</li>

              <li>Lead management for organizing opportunities from initial interest through the sales process.</li>

              <li>Sales management for tracking deals, activities, and pipeline progress.</li>

              <li>Team management for helping businesses coordinate people and responsibilities.</li>

              <li>Reporting and analytics for turning operational information into useful business visibility.</li>

              <li>Business operations for bringing supporting workflows into the same broader environment.</li>
            </ul>

            <p>These areas are intended to complement each other rather than operate as completely separate systems.</p>
          </section>

          <section id="technology" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>08</span>
              Technology & Product
            </div>

            <h2>Building a modern software platform</h2>

            <p>BR30 CRM is being developed as a modern web-based business platform with an emphasis on responsive interfaces, structured data, scalable functionality, and a consistent user experience.</p>

            <p>Technology is treated as a means to support the product experience rather than an end by itself. The objective is to use technology where it helps make the product more useful, maintainable, reliable, and accessible.</p>

            <div className="br30-founder-values">
              <div className="br30-founder-value">
                <div className="br30-founder-value-icon">
                  <Code2 size={16} />
                </div>

                <strong>Modern Interfaces</strong>

                <p>A responsive interface designed to work across different screen sizes and business environments.</p>
              </div>

              <div className="br30-founder-value">
                <div className="br30-founder-value-icon">
                  <Database size={16} />
                </div>

                <strong>Structured Information</strong>

                <p>Business information is organized around records, relationships, workflows, and operational context.</p>
              </div>
            </div>
          </section>

          <section id="customer-first" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>09</span>
              Customer First
            </div>

            <h2>Building for the people who use the product</h2>

            <p>A business platform is only useful when it helps the people working with it. For that reason, the development direction of BR30 CRM places importance on usability, understandable workflows, and practical business outcomes.</p>

            <p>Customer feedback and real-world business requirements can help identify areas where the platform can be improved. The product is intended to evolve as those requirements become clearer.</p>

            <p>The goal is not simply to add more features, but to build functionality that has a meaningful place within the broader business workflow.</p>
          </section>

          <section id="future" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>10</span>
              Looking Ahead
            </div>

            <h2>Continuing to build and improve BR30 CRM</h2>

            <p>BR30 CRM is intended to grow as a platform. Future development can include improvements to existing workflows, additional business capabilities, better reporting, deeper integrations, interface improvements, and other functionality based on product requirements.</p>

            <p>The long-term direction is centered around creating a dependable business workspace that can support organizations as their processes and operational needs evolve.</p>

            <div className="br30-legal-note">
              <strong>Looking ahead:</strong> The platform will continue to evolve through ongoing product development, refinement, and attention to practical business needs.
            </div>
          </section>

          <section id="contact" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>11</span>
              Contact
            </div>

            <h2>Connect with the founder</h2>

            <p>For founder-related questions, business discussions, product conversations, or other relevant inquiries, you can contact Mukesh Raj using the email address below.</p>

            <div className="br30-founder-contact-card">
              <div className="br30-founder-contact-icon">
                <Mail size={16} />
              </div>

              <div>
                <strong>Mukesh Raj — Founder, BR30 CRM</strong>

                <p>
                  Email: <a href={SUPPORT_FORM_URL} className="br30-support-ticket-link" target="_blank" rel="noopener noreferrer"><Ticket size={13} /> Create Support Ticket</a>
                </p>
              </div>
            </div>

            <div className="br30-founder-contact-card">
              <div className="br30-founder-contact-icon">
                <ShieldCheck size={16} />
              </div>

              <div>
                <strong>BR30 CRM</strong>

                <p>For support, privacy, legal, or account-specific matters, please use the appropriate contact channel provided by BR30 CRM.</p>
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

export default FounderAbout;
