import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BriefcaseBusiness, CheckCircle2, ChevronRight, ClipboardCheck, Database, FileText, Mail, MessageSquareText, Settings2, ShieldCheck, Target, Users, Workflow, Zap } from "lucide-react";
import LandingNavbar from "../../components/landing/LandingNavbar";
import LandingFooter from "../../components/landing/LandingFooter";
import { COMPANY_CONSULTANTS_SUPPORT_FORM_URL } from "../../constants/supportForm";

function Consultants() {
  const [activeSection, setActiveSection] = useState("overview");

  const sections = [
    { id: "overview", number: "01", title: "Consulting Overview" },
    { id: "business-analysis", number: "02", title: "Business Analysis" },
    { id: "crm-strategy", number: "03", title: "CRM Strategy" },
    { id: "workflow-design", number: "04", title: "Workflow Design" },
    { id: "implementation", number: "05", title: "Implementation Planning" },
    { id: "data-organization", number: "06", title: "Data Organization" },
    { id: "sales-operations", number: "07", title: "Sales Operations" },
    { id: "team-setup", number: "08", title: "Team & Roles" },
    { id: "process-improvement", number: "09", title: "Process Improvement" },
    { id: "adoption", number: "10", title: "Adoption & Training" },
    { id: "engagement", number: "11", title: "Consulting Engagement" },
    { id: "contact", number: "12", title: "Contact Consultants" },
  ];

  const services = [
    {
      icon: BriefcaseBusiness,
      title: "CRM Implementation Planning",
      text: "Plan how BR30 CRM can be introduced into your existing business processes, teams, customer workflows, and operational structure.",
    },
    {
      icon: Workflow,
      title: "Business Workflow Consultation",
      text: "Map everyday business activities and identify where structured CRM workflows can improve visibility and consistency.",
    },
    {
      icon: Target,
      title: "Customer Management Strategy",
      text: "Create practical approaches for organizing customer records, contacts, follow-ups, activities, and relationship workflows.",
    },
    {
      icon: Zap,
      title: "Sales Process Optimization",
      text: "Structure sales activities around clearer stages, responsibilities, follow-ups, opportunities, and customer interactions.",
    },
    {
      icon: Users,
      title: "Team & Role Configuration",
      text: "Plan suitable roles, responsibilities, access structures, and team workflows based on how your organization operates.",
    },
    {
      icon: Database,
      title: "CRM Data Organization",
      text: "Improve the structure and consistency of business information so teams can work with cleaner and more useful records.",
    },
    {
      icon: Settings2,
      title: "Operational Workflow Improvement",
      text: "Review repetitive operational processes and identify opportunities for clearer ownership, tracking, and execution.",
    },
    {
      icon: ClipboardCheck,
      title: "Business Process Documentation",
      text: "Turn important workflows and operational requirements into clearer documented processes that teams can follow.",
    },
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
      <style>{`.br30-legal-page{min-height:100vh;background:var(--crm-bg);color:var(--crm-text);font-family:var(--crm-font)}.br30-legal-page *,.br30-legal-page *::before,.br30-legal-page *::after{box-sizing:border-box}.br30-legal-hero{padding:142px 24px 58px;border-bottom:1px solid var(--crm-border);background:var(--crm-bg)}.br30-legal-hero-inner{width:100%;max-width:1120px;margin:0 auto}.br30-legal-breadcrumb{display:flex;align-items:center;gap:6px;margin-bottom:24px;color:var(--crm-muted);font-size:13px}.br30-legal-breadcrumb a{color:var(--crm-muted);text-decoration:none}.br30-legal-breadcrumb a:hover{color:var(--crm-primary)}.br30-legal-breadcrumb svg{opacity:.5}.br30-legal-eyebrow{display:inline-flex;align-items:center;gap:7px;color:var(--crm-primary);font-size:13px;font-weight:400;letter-spacing:.08em;text-transform:uppercase}.br30-legal-eyebrow-dot{width:6px;height:6px;border-radius:50%;background:var(--crm-primary)}.br30-legal-hero h1{margin:16px 0 14px;color:var(--crm-text);font-size:clamp(32px,4vw,48px);line-height:1.12;letter-spacing:-.025em;font-weight:400}.br30-legal-hero h1 span{color:var(--crm-primary)}.br30-legal-hero-description{max-width:780px;margin:0;color:var(--crm-muted);font-size:14px;line-height:1.75}.br30-legal-meta{display:flex;flex-wrap:wrap;gap:8px;margin-top:25px}.br30-legal-meta-item{display:flex;align-items:center;gap:7px;min-height:35px;padding:7px 11px;border:1px solid var(--crm-border);border-radius:9px;background:var(--crm-surface);color:var(--crm-muted);font-size:13px}.br30-legal-meta-item svg{color:var(--crm-primary)}.br30-legal-meta-item strong{color:var(--crm-text);font-weight:400}.br30-legal-main{width:100%;max-width:1120px;margin:0 auto;padding:52px 24px 80px;display:grid;grid-template-columns:235px minmax(0,1fr);gap:50px;align-items:start}.br30-legal-sidebar{position:sticky;top:100px;max-height:calc(100vh - 120px);overflow:auto;padding:7px;border:1px solid var(--crm-border);border-radius:13px;background:var(--crm-surface);box-shadow:var(--crm-shadow);scrollbar-width:thin}.br30-legal-sidebar-title{padding:9px 10px 11px;color:var(--crm-text);font-size:13px;font-weight:400;letter-spacing:.06em;text-transform:uppercase}.br30-legal-sidebar-list{display:flex;flex-direction:column;gap:1px}.br30-legal-sidebar button{width:100%;display:flex;align-items:center;gap:8px;padding:8px 9px;border:0;border-radius:8px;background:transparent;color:var(--crm-muted);font:inherit;font-size:13px;line-height:1.35;text-align:left;cursor:pointer}.br30-legal-sidebar button:hover{background:var(--crm-surface-2);color:var(--crm-text)}.br30-legal-sidebar button.active{background:var(--crm-primary-soft);color:var(--crm-primary);font-weight:400}.br30-legal-sidebar-number{width:22px;flex:0 0 22px;font-size:13px;font-weight:400;opacity:.7}.br30-legal-content{min-width:0}.br30-legal-intro-card{margin-bottom:34px;padding:21px;border:1px solid var(--crm-border);border-radius:13px;background:var(--crm-surface);box-shadow:var(--crm-shadow)}.br30-legal-intro-card-top{display:flex;align-items:flex-start;gap:13px}.br30-legal-intro-icon{width:38px;height:38px;flex:0 0 38px;display:grid;place-items:center;border-radius:9px;background:var(--crm-primary-soft);border:1px solid var(--crm-border);color:var(--crm-primary)}.br30-legal-intro-card h2{margin:0 0 5px;color:var(--crm-text);font-size:15px;font-weight:400;line-height:1.4}.br30-legal-intro-card p{margin:0;color:var(--crm-muted);font-size:13px;line-height:1.75}.br30-legal-section{scroll-margin-top:110px;padding:0 0 38px;margin-bottom:38px;border-bottom:1px solid var(--crm-border)}.br30-legal-section:last-child{border-bottom:0;margin-bottom:0}.br30-legal-section-label{display:flex;align-items:center;gap:8px;margin-bottom:10px;color:var(--crm-primary);font-size:13px;font-weight:400;letter-spacing:.08em;text-transform:uppercase}.br30-legal-section-label span{opacity:.65}.br30-legal-section h2{margin:0 0 14px;color:var(--crm-text);font-size:20px;line-height:1.35;font-weight:400;letter-spacing:-.01em}.br30-legal-section h3{margin:22px 0 8px;color:var(--crm-text);font-size:14px;line-height:1.45;font-weight:400}.br30-legal-section p{margin:0 0 13px;color:var(--crm-muted);font-size:13px;line-height:1.85}.br30-legal-section p:last-child{margin-bottom:0}.br30-legal-section ul{margin:10px 0 17px;padding-left:20px}.br30-legal-section li{margin:7px 0;padding-left:2px;color:var(--crm-muted);font-size:13px;line-height:1.75}.br30-legal-section li::marker{color:var(--crm-primary)}.br30-legal-note{margin:18px 0;padding:14px 16px;border-left:3px solid var(--crm-primary);border-radius:0 9px 9px 0;background:var(--crm-surface-2);color:var(--crm-muted);font-size:13px;line-height:1.75}.br30-legal-note strong{color:var(--crm-text)}.br30-legal-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:18px}.br30-legal-service{padding:15px;border:1px solid var(--crm-border);border-radius:11px;background:var(--crm-surface)}.br30-legal-service-icon{width:31px;height:31px;display:grid;place-items:center;margin-bottom:10px;border-radius:8px;background:var(--crm-primary-soft);color:var(--crm-primary)}.br30-legal-service strong{display:block;margin-bottom:5px;color:var(--crm-text);font-size:13px;line-height:1.45}.br30-legal-service span{display:block;color:var(--crm-muted);font-size:13px;line-height:1.65}.br30-legal-contact-card{display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:12px;margin-top:18px;padding:17px;border:1px solid var(--crm-border);border-radius:11px;background:var(--crm-surface)}.br30-legal-contact-icon{width:36px;height:36px;display:grid;place-items:center;border-radius:9px;background:var(--crm-primary-soft);color:var(--crm-primary)}.br30-legal-contact-card strong{display:block;margin-bottom:4px;color:var(--crm-text);font-size:13px}.br30-legal-contact-card a{color:var(--crm-primary);font-size:13px;text-decoration:none}.br30-legal-contact-card a:hover{text-decoration:underline}.br30-legal-contact-card p{margin:0!important}.br30-legal-button{display:inline-flex;align-items:center;justify-content:center;gap:8px;margin-top:15px;min-height:38px;padding:9px 14px;border:1px solid var(--crm-primary);border-radius:9px;background:var(--crm-primary);color:#fff;text-decoration:none;font-size:13px;font-weight:400;transition:.2s}.br30-legal-button:hover{filter:brightness(.95);transform:translateY(-1px)}.br30-legal-top-button{position:fixed;right:20px;bottom:20px;z-index:30;width:38px;height:38px;display:grid;place-items:center;border:1px solid var(--crm-border);border-radius:10px;background:var(--crm-surface);color:var(--crm-text);box-shadow:var(--crm-shadow);cursor:pointer;transition:.2s}.br30-legal-top-button:hover{border-color:var(--crm-primary);color:var(--crm-primary);transform:translateY(-2px)}@media(max-width:900px){.br30-legal-main{grid-template-columns:1fr;gap:25px}.br30-legal-sidebar{position:relative;top:auto;max-height:none}.br30-legal-sidebar-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:600px){.br30-legal-hero{padding:120px 17px 45px}.br30-legal-hero h1{font-size:34px}.br30-legal-hero-description{font-size:13px}.br30-legal-meta{display:grid;grid-template-columns:1fr}.br30-legal-main{padding:35px 17px 60px}.br30-legal-sidebar-list{grid-template-columns:1fr}.br30-legal-intro-card{padding:18px}.br30-legal-section{scroll-margin-top:90px;padding-bottom:32px;margin-bottom:32px}.br30-legal-section h2{font-size:18px}.br30-legal-section p,.br30-legal-section li{font-size:13px}.br30-legal-grid{grid-template-columns:1fr}.br30-legal-contact-card{grid-template-columns:auto minmax(0,1fr);align-items:center}.br30-legal-top-button{right:13px;bottom:13px}}`}</style>
      <LandingNavbar />

      <header className="br30-legal-hero">
        <div className="br30-legal-hero-inner">
          <div className="br30-legal-breadcrumb">
            <Link to="/">Home</Link>
            <ChevronRight size={13} />
            <span>Company</span>
            <ChevronRight size={13} />
            <span>Consultants</span>
          </div>

          <div className="br30-legal-eyebrow">
            <span className="br30-legal-eyebrow-dot" />
            BR30 CRM Consultants
          </div>

          <h1>
            Practical guidance for <span>better business.</span>
          </h1>

          <p className="br30-legal-hero-description">BR30 CRM consulting helps businesses plan customer management, sales workflows, team structures, data organization, and everyday operational processes around a more organized business workspace.</p>

          <div className="br30-legal-meta">
            <div className="br30-legal-meta-item">
              <BriefcaseBusiness size={14} />
              <span>
                Service <strong>Business Consulting</strong>
              </span>
            </div>

            <div className="br30-legal-meta-item">
              <Workflow size={14} />
              <span>
                Focus <strong>Workflow Planning</strong>
              </span>
            </div>

            <div className="br30-legal-meta-item">
              <ShieldCheck size={14} />
              <span>
                Approach <strong>Structured Implementation</strong>
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
                <BriefcaseBusiness size={18} />
              </div>

              <div>
                <h2>Business consulting built around your workflow</h2>

                <p>BR30 CRM consulting is focused on understanding how your business operates and helping you structure CRM workflows, customer information, sales activities, teams, and operational processes in a practical way.</p>
              </div>
            </div>
          </div>

          <section id="overview" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>01</span>
              Consulting Overview
            </div>

            <h2>Practical CRM guidance for growing teams</h2>

            <p>Every business has different customers, sales processes, teams, responsibilities, and operational requirements. A CRM becomes more useful when its structure reflects the way a business actually works.</p>

            <p>BR30 CRM consulting is designed to help businesses understand their current processes, identify areas that require structure, and plan practical workflows around their CRM environment.</p>

            <p>The objective is to create clearer processes, better information visibility, stronger ownership, and a more consistent approach to everyday business operations.</p>

            <div className="br30-legal-note">
              <strong>Our approach:</strong> Understand the business first, structure the workflow second, and then align the CRM around those practical requirements.
            </div>
          </section>

          <section id="business-analysis" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>02</span>
              Business Analysis
            </div>

            <h2>Understand how your business operates</h2>

            <p>Effective CRM planning begins with understanding the existing business process. This may include how customers are acquired, how sales conversations are managed, how teams communicate, and how operational tasks are completed.</p>

            <h3>Areas we can review</h3>

            <ul>
              <li>Current customer and contact management processes.</li>
              <li>Sales stages and opportunity workflows.</li>
              <li>Team responsibilities and internal handoffs.</li>
              <li>Follow-up and task management practices.</li>
              <li>Business information and record organization.</li>
              <li>Operational activities that require better visibility.</li>
            </ul>

            <p>The result of this analysis can be used to identify practical CRM requirements and areas where a more structured workflow may be useful.</p>
          </section>

          <section id="crm-strategy" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>03</span>
              CRM Strategy
            </div>

            <h2>Create a clearer CRM operating structure</h2>

            <p>A CRM strategy defines how customer and business information should move through the organization. It can help teams understand where information belongs, who is responsible for it, and what actions should happen next.</p>

            <h3>Strategy areas</h3>

            <ul>
              <li>Customer and contact management structure.</li>
              <li>Lead and opportunity management.</li>
              <li>Sales pipeline organization.</li>
              <li>Activity and follow-up planning.</li>
              <li>Team responsibilities and ownership.</li>
              <li>Business reporting and information visibility.</li>
            </ul>

            <p>The strategy should remain practical enough for teams to follow consistently instead of creating unnecessary administrative complexity.</p>
          </section>

          <section id="workflow-design" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>04</span>
              Workflow Design
            </div>

            <h2>Turn everyday activities into structured workflows</h2>

            <p>Workflow design focuses on converting repeated business activities into clearer processes with defined steps, responsibilities, and expected outcomes.</p>

            <div className="br30-legal-grid">
              {services.slice(0, 4).map((service) => {
                const Icon = service.icon;

                return (
                  <div className="br30-legal-service" key={service.title}>
                    <div className="br30-legal-service-icon">
                      <Icon size={15} />
                    </div>

                    <strong>{service.title}</strong>
                    <span>{service.text}</span>
                  </div>
                );
              })}
            </div>

            <p style={{ marginTop: "18px" }}>Well-defined workflows can make it easier for teams to understand what needs to happen, when it needs to happen, and who should be responsible.</p>
          </section>

          <section id="implementation" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>05</span>
              Implementation Planning
            </div>

            <h2>Plan the transition into a structured CRM workflow</h2>

            <p>CRM implementation can involve more than simply configuring software. Businesses may need to consider existing processes, data, user roles, workflow requirements, and team adoption.</p>

            <h3>Implementation considerations</h3>

            <ul>
              <li>Existing business process requirements.</li>
              <li>CRM structure and workflow configuration.</li>
              <li>User roles and access requirements.</li>
              <li>Existing business data and migration considerations.</li>
              <li>Testing and workflow validation.</li>
              <li>Team onboarding and adoption planning.</li>
            </ul>

            <div className="br30-legal-note">
              <strong>Planning principle:</strong> Implementation should be organized around real business requirements rather than forcing every business into the same workflow.
            </div>
          </section>

          <section id="data-organization" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>06</span>
              Data Organization
            </div>

            <h2>Make business information easier to manage</h2>

            <p>Customer and business information becomes more useful when records are structured consistently and teams understand how information should be entered, maintained, and accessed.</p>

            <h3>Data organization can include</h3>

            <ul>
              <li>Customer and contact record structure.</li>
              <li>Lead and opportunity information.</li>
              <li>Activity and interaction records.</li>
              <li>Notes and business information.</li>
              <li>Duplicate and inconsistent record identification.</li>
              <li>Information ownership and access planning.</li>
            </ul>

            <p>Businesses should also define appropriate internal practices for protecting sensitive information and limiting access to authorized users.</p>
          </section>

          <section id="sales-operations" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>07</span>
              Sales Operations
            </div>

            <h2>Build a clearer sales management process</h2>

            <p>Sales teams often manage conversations, opportunities, follow-ups, activities, and customer information at the same time. A structured workflow can make these activities easier to track.</p>

            <ul>
              <li>Lead qualification and organization.</li>
              <li>Opportunity and pipeline structure.</li>
              <li>Sales activity tracking.</li>
              <li>Customer follow-up processes.</li>
              <li>Sales ownership and responsibility.</li>
              <li>Business visibility across sales activities.</li>
            </ul>

            <p>The objective is to create a process that supports the sales team's actual working style while providing clearer visibility into important customer activities.</p>
          </section>

          <section id="team-setup" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>08</span>
              Team & Roles
            </div>

            <h2>Structure responsibilities across your team</h2>

            <p>Different users may have different responsibilities within a business. Clear role planning can help teams understand which information and workflows they are responsible for.</p>

            <h3>Team structure considerations</h3>

            <ul>
              <li>User responsibilities and ownership.</li>
              <li>Department or team-based workflows.</li>
              <li>Access and visibility requirements.</li>
              <li>Internal approval processes.</li>
              <li>Customer ownership and handoffs.</li>
              <li>Operational accountability.</li>
            </ul>

            <p>Role configuration should be aligned with the organization's actual structure and should be reviewed as responsibilities change.</p>
          </section>

          <section id="process-improvement" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>09</span>
              Process Improvement
            </div>

            <h2>Identify opportunities to make workflows clearer</h2>

            <p>Business processes can become complicated as teams grow. Consulting can help identify repetitive activities, unclear ownership, unnecessary steps, and information gaps.</p>

            <h3>Improvement areas may include</h3>

            <ul>
              <li>Reducing unnecessary manual tracking.</li>
              <li>Clarifying ownership between team members.</li>
              <li>Improving customer follow-up visibility.</li>
              <li>Creating consistent operational processes.</li>
              <li>Connecting related business activities.</li>
              <li>Improving access to important information.</li>
            </ul>
          </section>

          <section id="adoption" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>10</span>
              Adoption & Training
            </div>

            <h2>Help teams use the CRM consistently</h2>

            <p>A well-designed CRM workflow is most useful when teams understand how and why it should be used. Adoption planning can help businesses establish clearer expectations around CRM usage.</p>

            <ul>
              <li>Introducing teams to relevant CRM workflows.</li>
              <li>Explaining responsibilities and process ownership.</li>
              <li>Creating practical usage guidelines.</li>
              <li>Identifying common workflow questions.</li>
              <li>Reviewing adoption challenges.</li>
              <li>Improving processes based on real team usage.</li>
            </ul>

            <div className="br30-legal-note">
              <strong>Important:</strong> Training and adoption requirements can vary depending on the size, structure, and operational complexity of each organization.
            </div>
          </section>

          <section id="engagement" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>11</span>
              Consulting Engagement
            </div>

            <h2>How a consulting conversation can begin</h2>

            <p>A consulting discussion can begin with an overview of your current business process, the problems you are trying to solve, and the areas where you would like greater structure or visibility.</p>

            <h3>Useful information to share</h3>

            <ul>
              <li>Type and size of your business.</li>
              <li>Current customer management process.</li>
              <li>Sales and operational workflows.</li>
              <li>Number and responsibilities of team members.</li>
              <li>Current CRM or business tools being used.</li>
              <li>Specific workflow or organization challenges.</li>
            </ul>

            <p>This information can help establish a clearer understanding of the business requirements before discussing potential consulting activities.</p>
          </section>

          <section id="contact" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>12</span>
              Contact Consultants
            </div>

            <h2>Let's discuss your business workflow</h2>

            <p>If you need help planning CRM workflows, organizing customer operations, structuring business processes, or understanding how BR30 CRM could fit your organization, you can contact the BR30 CRM team.</p>

            <div className="br30-legal-contact-card">
              <div className="br30-legal-contact-icon">
                <Mail size={16} />
              </div>

              <div>
                <strong>Consulting & Business Support</strong>

                <a href={COMPANY_CONSULTANTS_SUPPORT_FORM_URL} className="br30-support-ticket-link" rel="noopener noreferrer">
                  Create Support Ticket
                </a>
              </div>
            </div>

            <div className="br30-legal-contact-card">
              <div className="br30-legal-contact-icon">
                <MessageSquareText size={16} />
              </div>

              <div>
                <strong>Start with your business challenge</strong>

                <p>Tell us what you are currently managing, where your workflow is difficult, and what you would like to organize. A clear description can help make the initial discussion more useful.</p>
              </div>
            </div>
          </section>
        </article>
      </main>

      <button type="button" className="br30-legal-top-button" onClick={handleBackToTop} aria-label="Back to top" title="Back to top">
        <ArrowRight size={16} style={{ transform: "rotate(-90deg)" }} />
      </button>

      <LandingFooter />
    </div>
  );
}

export default Consultants;
