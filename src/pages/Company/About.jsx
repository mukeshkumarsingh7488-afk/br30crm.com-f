import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUp, BarChart3, Building2, CheckCircle2, ChevronRight, Database, Eye, FileText, Layers3, Mail, Settings2, ShieldCheck, Target, Users, Workflow, Zap } from "lucide-react";
import LandingNavbar from "../../components/landing/LandingNavbar";
import LandingFooter from "../../components/landing/LandingFooter";

function About() {
  const [activeSection, setActiveSection] = useState("overview");

  const sections = [
    { id: "overview", number: "01", title: "Overview" },
    { id: "our-story", number: "02", title: "Our Story" },
    { id: "what-we-do", number: "03", title: "What We Do" },
    { id: "platform", number: "04", title: "The Platform" },
    { id: "business-operations", number: "05", title: "Business Operations" },
    { id: "customers", number: "06", title: "Customer Management" },
    { id: "sales-workflows", number: "07", title: "Sales & Workflows" },
    { id: "team-collaboration", number: "08", title: "Team Collaboration" },
    { id: "our-principles", number: "09", title: "Our Principles" },
    { id: "security", number: "10", title: "Security & Responsibility" },
    { id: "product-direction", number: "11", title: "Product Direction" },
    { id: "who-we-serve", number: "12", title: "Who We Serve" },
    { id: "our-approach", number: "13", title: "Our Approach" },
    { id: "contact", number: "14", title: "Contact Us" },
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
    <div className="br30-about-page">
      <style>{`.br30-about-page{min-height:100vh;background:var(--crm-bg);color:var(--crm-text);font-family:var(--crm-font)}.br30-about-page *,.br30-about-page *::before,.br30-about-page *::after{box-sizing:border-box}.br30-about-hero{padding:142px 24px 58px;border-bottom:1px solid var(--crm-border);background:var(--crm-bg)}.br30-about-hero-inner{width:100%;max-width:1120px;margin:0 auto}.br30-about-breadcrumb{display:flex;align-items:center;gap:6px;margin-bottom:24px;color:var(--crm-muted);font-size:13px}.br30-about-breadcrumb a{color:var(--crm-muted);text-decoration:none}.br30-about-breadcrumb a:hover{color:var(--crm-primary)}.br30-about-breadcrumb svg{opacity:.5}.br30-about-eyebrow{display:inline-flex;align-items:center;gap:7px;color:var(--crm-primary);font-size:13px;font-weight:400;letter-spacing:.08em;text-transform:uppercase}.br30-about-dot{width:6px;height:6px;border-radius:50%;background:var(--crm-primary)}.br30-about-hero h1{max-width:900px;margin:16px 0 14px;color:var(--crm-text);font-size:clamp(32px,4vw,48px);line-height:1.12;letter-spacing:-.025em;font-weight:400}.br30-about-hero h1 span{color:var(--crm-primary)}.br30-about-lead{max-width:780px;margin:0;color:var(--crm-muted);font-size:14px;line-height:1.8}.br30-about-meta{display:flex;flex-wrap:wrap;gap:8px;margin-top:25px}.br30-about-meta-item{display:flex;align-items:center;gap:7px;min-height:35px;padding:7px 11px;border:1px solid var(--crm-border);border-radius:9px;background:var(--crm-surface);color:var(--crm-muted);font-size:13px}.br30-about-meta-item svg{color:var(--crm-primary)}.br30-about-meta-item strong{color:var(--crm-text);font-weight:400}.br30-about-main{width:100%;max-width:1120px;margin:0 auto;padding:52px 24px 80px;display:grid;grid-template-columns:235px minmax(0,1fr);gap:50px;align-items:start}.br30-about-sidebar{position:sticky;top:100px;max-height:calc(100vh - 120px);overflow:auto;padding:7px;border:1px solid var(--crm-border);border-radius:13px;background:var(--crm-surface);box-shadow:var(--crm-shadow);scrollbar-width:thin}.br30-about-sidebar-title{padding:9px 10px 11px;color:var(--crm-text);font-size:13px;font-weight:400;letter-spacing:.06em;text-transform:uppercase}.br30-about-sidebar-list{display:flex;flex-direction:column;gap:1px}.br30-about-sidebar button{width:100%;display:flex;align-items:center;gap:8px;padding:8px 9px;border:0;border-radius:8px;background:transparent;color:var(--crm-muted);font:inherit;font-size:13px;line-height:1.35;text-align:left;cursor:pointer}.br30-about-sidebar button:hover{background:var(--crm-surface-2);color:var(--crm-text)}.br30-about-sidebar button.active{background:var(--crm-primary-soft);color:var(--crm-primary);font-weight:400}.br30-about-sidebar-number{width:22px;flex:0 0 22px;font-size:13px;font-weight:400;opacity:.7}.br30-about-content{min-width:0}.br30-about-intro-card{margin-bottom:34px;padding:21px;border:1px solid var(--crm-border);border-radius:13px;background:var(--crm-surface);box-shadow:var(--crm-shadow)}.br30-about-intro-top{display:flex;align-items:flex-start;gap:13px}.br30-about-intro-icon{width:38px;height:38px;flex:0 0 38px;display:grid;place-items:center;border-radius:9px;background:var(--crm-primary-soft);border:1px solid var(--crm-border);color:var(--crm-primary)}.br30-about-intro-card h2{margin:0 0 5px;color:var(--crm-text);font-size:15px;font-weight:400;line-height:1.4}.br30-about-intro-card p{margin:0;color:var(--crm-muted);font-size:13px;line-height:1.75}.br30-about-section{scroll-margin-top:110px;padding:0 0 38px;margin-bottom:38px;border-bottom:1px solid var(--crm-border)}.br30-about-section:last-child{border-bottom:0;margin-bottom:0}.br30-about-section-label{display:flex;align-items:center;gap:8px;margin-bottom:10px;color:var(--crm-primary);font-size:13px;font-weight:400;letter-spacing:.08em;text-transform:uppercase}.br30-about-section-label span{opacity:.65}.br30-about-section h2{margin:0 0 14px;color:var(--crm-text);font-size:20px;line-height:1.35;font-weight:400;letter-spacing:-.01em}.br30-about-section h3{margin:22px 0 8px;color:var(--crm-text);font-size:14px;line-height:1.45;font-weight:400}.br30-about-section p{margin:0 0 13px;color:var(--crm-muted);font-size:13px;line-height:1.85}.br30-about-section p:last-child{margin-bottom:0}.br30-about-section ul{margin:10px 0 17px;padding-left:20px}.br30-about-section li{margin:7px 0;padding-left:2px;color:var(--crm-muted);font-size:13px;line-height:1.75}.br30-about-section li::marker{color:var(--crm-primary)}.br30-about-note{margin:18px 0;padding:14px 16px;border-left:3px solid var(--crm-primary);border-radius:0 9px 9px 0;background:var(--crm-surface-2);color:var(--crm-muted);font-size:13px;line-height:1.75}.br30-about-note strong{color:var(--crm-text)}.br30-about-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:18px 0}.br30-about-feature{padding:16px;border:1px solid var(--crm-border);border-radius:11px;background:var(--crm-surface);transition:.2s}.br30-about-feature:hover{border-color:color-mix(in srgb,var(--crm-primary) 30%,var(--crm-border));transform:translateY(-2px)}.br30-about-feature-icon{width:34px;height:34px;display:grid;place-items:center;margin-bottom:11px;border-radius:8px;background:var(--crm-primary-soft);color:var(--crm-primary)}.br30-about-feature strong{display:block;margin-bottom:5px;color:var(--crm-text);font-size:13px;font-weight:400}.br30-about-feature span{display:block;color:var(--crm-muted);font-size:13px;line-height:1.7}.br30-about-points{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;margin-top:17px}.br30-about-point{display:flex;align-items:flex-start;gap:8px;padding:11px;border:1px solid var(--crm-border);border-radius:9px;background:var(--crm-surface);color:var(--crm-muted);font-size:13px;line-height:1.6}.br30-about-point svg{flex:0 0 auto;margin-top:1px;color:var(--crm-primary)}.br30-about-contact-card{display:grid;grid-template-columns:auto 1fr;gap:12px;margin-top:18px;padding:17px;border:1px solid var(--crm-border);border-radius:11px;background:var(--crm-surface)}.br30-about-contact-icon{width:36px;height:36px;display:grid;place-items:center;border-radius:9px;background:var(--crm-primary-soft);color:var(--crm-primary)}.br30-about-contact-card strong{display:block;margin-bottom:4px;color:var(--crm-text);font-size:13px}.br30-about-contact-card p{margin:0!important}.br30-about-contact-card a{color:var(--crm-primary);font-size:13px;text-decoration:none}.br30-about-contact-card a:hover{text-decoration:underline}.br30-about-cta{display:flex;align-items:center;justify-content:space-between;gap:20px;margin-top:18px;padding:19px;border:1px solid var(--crm-border);border-radius:12px;background:var(--crm-surface);box-shadow:var(--crm-shadow)}.br30-about-cta-copy h3{margin:0 0 5px;color:var(--crm-text);font-size:14px;font-weight:400}.br30-about-cta-copy p{margin:0;color:var(--crm-muted);font-size:13px;line-height:1.7}.br30-about-button{display:inline-flex;align-items:center;justify-content:center;gap:7px;flex:0 0 auto;padding:9px 13px;border:1px solid var(--crm-primary);border-radius:8px;background:var(--crm-primary);color:#fff;text-decoration:none;font-size:13px;font-weight:400;transition:.2s}.br30-about-button:hover{opacity:.9;transform:translateY(-1px)}.br30-about-top-button{position:fixed;right:20px;bottom:20px;z-index:30;width:38px;height:38px;display:grid;place-items:center;border:1px solid var(--crm-border);border-radius:10px;background:var(--crm-surface);color:var(--crm-text);box-shadow:var(--crm-shadow);cursor:pointer;transition:.2s}.br30-about-top-button:hover{border-color:var(--crm-primary);color:var(--crm-primary);transform:translateY(-2px)}@media(max-width:900px){.br30-about-main{grid-template-columns:1fr;gap:25px}.br30-about-sidebar{position:relative;top:auto;max-height:none}.br30-about-sidebar-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:700px){.br30-about-grid,.br30-about-points{grid-template-columns:1fr}.br30-about-cta{align-items:flex-start;flex-direction:column}.br30-about-button{width:100%}}@media(max-width:600px){.br30-about-hero{padding:120px 17px 45px}.br30-about-hero h1{font-size:34px}.br30-about-lead{font-size:13px}.br30-about-meta{display:grid;grid-template-columns:1fr}.br30-about-main{padding:35px 17px 60px}.br30-about-sidebar-list{grid-template-columns:1fr}.br30-about-intro-card{padding:18px}.br30-about-section{scroll-margin-top:90px;padding-bottom:32px;margin-bottom:32px}.br30-about-section h2{font-size:18px}.br30-about-section p,.br30-about-section li{font-size:13px}.br30-about-contact-card{grid-template-columns:1fr}.br30-about-top-button{right:13px;bottom:13px}}`}</style>

      <LandingNavbar />

      <header className="br30-about-hero">
        <div className="br30-about-hero-inner">
          <div className="br30-about-breadcrumb">
            <Link to="/">Home</Link>
            <ChevronRight size={13} />
            <span>Company</span>
            <ChevronRight size={13} />
            <span>About</span>
          </div>

          <div className="br30-about-eyebrow">
            <span className="br30-about-dot" />
            About BR30 CRM
          </div>

          <h1>
            A modern workspace for <span>better business operations.</span>
          </h1>

          <p className="br30-about-lead">BR30 CRM is built to bring customers, sales, teams, workflows, business information, and everyday operations into one organized workspace.</p>

          <div className="br30-about-meta">
            <div className="br30-about-meta-item">
              <Building2 size={14} />
              <span>
                Platform <strong>BR30 CRM</strong>
              </span>
            </div>

            <div className="br30-about-meta-item">
              <Layers3 size={14} />
              <span>
                Focus <strong>Business Operations</strong>
              </span>
            </div>

            <div className="br30-about-meta-item">
              <FileText size={14} />
              <span>
                Content <strong>Company Overview</strong>
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="br30-about-main">
        <aside className="br30-about-sidebar">
          <div className="br30-about-sidebar-title">On this page</div>

          <div className="br30-about-sidebar-list">
            {sections.map((section) => (
              <button key={section.id} type="button" className={activeSection === section.id ? "active" : ""} onClick={() => scrollToSection(section.id)}>
                <span className="br30-about-sidebar-number">{section.number}</span>
                <span>{section.title}</span>
              </button>
            ))}
          </div>
        </aside>

        <article className="br30-about-content">
          <div className="br30-about-intro-card">
            <div className="br30-about-intro-top">
              <div className="br30-about-intro-icon">
                <Building2 size={18} />
              </div>

              <div>
                <h2>About BR30 CRM</h2>
                <p>BR30 CRM is a business workspace designed to organize customer relationships, sales activities, team workflows, operational information, and everyday business processes in one connected environment.</p>
              </div>
            </div>
          </div>

          <section id="overview" className="br30-about-section">
            <div className="br30-about-section-label">
              <span>01</span>
              Overview
            </div>

            <h2>One organized environment for modern business</h2>

            <p>Businesses often manage important information across different tools, spreadsheets, conversations, documents, and individual workflows. As operations grow, keeping that information organized and accessible can become increasingly difficult.</p>

            <p>BR30 CRM is designed to provide a central workspace where customer information, business activities, sales processes, team responsibilities, and operational records can be managed in a more structured way.</p>

            <p>The platform focuses on practical business workflows and visibility so that teams can spend less time searching for information and more time working on the activities that matter to their business.</p>

            <div className="br30-about-note">
              <strong>Our focus:</strong> Build useful business software that keeps important information organized, workflows understandable, and everyday operations easier to manage.
            </div>
          </section>

          <section id="our-story" className="br30-about-section">
            <div className="br30-about-section-label">
              <span>02</span>
              Our Story
            </div>

            <h2>Built around the way businesses actually work</h2>

            <p>BR30 CRM is based on a simple idea: business software should support the way teams work instead of making everyday operations unnecessarily complicated.</p>

            <p>Customer records, follow-ups, sales activities, internal responsibilities, notes, tasks, and operational information are connected parts of running a business. A workspace that keeps these activities organized can make daily work easier to understand and coordinate.</p>

            <p>Our product direction therefore centers around creating a structured environment that businesses can use as they build, manage, and improve their day-to-day processes.</p>

            <div className="br30-about-grid">
              <div className="br30-about-feature">
                <div className="br30-about-feature-icon">
                  <Eye size={15} />
                </div>
                <strong>Better visibility</strong>
                <span>Make important customer and operational information easier to find and understand.</span>
              </div>

              <div className="br30-about-feature">
                <div className="br30-about-feature-icon">
                  <Workflow size={15} />
                </div>
                <strong>Structured workflows</strong>
                <span>Turn recurring business activities into clearer and more manageable processes.</span>
              </div>

              <div className="br30-about-feature">
                <div className="br30-about-feature-icon">
                  <Users size={15} />
                </div>
                <strong>Connected teams</strong>
                <span>Give teams a common environment for managing shared business activities.</span>
              </div>

              <div className="br30-about-feature">
                <div className="br30-about-feature-icon">
                  <BarChart3 size={15} />
                </div>
                <strong>Operational insight</strong>
                <span>Organize business information so teams can work with greater clarity.</span>
              </div>
            </div>
          </section>

          <section id="what-we-do" className="br30-about-section">
            <div className="br30-about-section-label">
              <span>03</span>
              What We Do
            </div>

            <h2>Business tools connected through one workspace</h2>

            <p>BR30 CRM brings together different areas of business activity into a unified workspace. The goal is to reduce fragmentation between customer management, sales work, team coordination, and operational activities.</p>

            <h3>Customer relationships</h3>

            <p>Businesses can organize customer and contact information and maintain a clearer view of the relationships they manage.</p>

            <h3>Sales activities</h3>

            <p>Sales-related activities can be structured into workflows that help teams manage opportunities, follow-ups, and ongoing business activity.</p>

            <h3>Team operations</h3>

            <p>Internal responsibilities, activities, and operational information can be organized within the same business environment.</p>

            <h3>Business information</h3>

            <p>Relevant records, notes, activities, and operational information can be maintained in a more centralized structure.</p>
          </section>

          <section id="platform" className="br30-about-section">
            <div className="br30-about-section-label">
              <span>04</span>
              The Platform
            </div>

            <h2>Designed as a connected business workspace</h2>

            <p>BR30 CRM is intended to act as a central layer between the different activities that make up everyday business operations.</p>

            <div className="br30-about-grid">
              <div className="br30-about-feature">
                <div className="br30-about-feature-icon">
                  <Database size={15} />
                </div>
                <strong>Centralized information</strong>
                <span>Keep relevant customer, sales, team, and operational information within an organized workspace.</span>
              </div>

              <div className="br30-about-feature">
                <div className="br30-about-feature-icon">
                  <Settings2 size={15} />
                </div>
                <strong>Configurable workflows</strong>
                <span>Support business processes through structured activities, responsibilities, and operational workflows.</span>
              </div>

              <div className="br30-about-feature">
                <div className="br30-about-feature-icon">
                  <Zap size={15} />
                </div>
                <strong>Everyday productivity</strong>
                <span>Reduce unnecessary switching between disconnected business processes and information sources.</span>
              </div>

              <div className="br30-about-feature">
                <div className="br30-about-feature-icon">
                  <ShieldCheck size={15} />
                </div>
                <strong>Responsible foundation</strong>
                <span>Product design considers account security, access controls, and responsible information handling.</span>
              </div>
            </div>

            <div className="br30-about-note">
              <strong>Designed for practical use:</strong> The platform is intended to support real business workflows without requiring teams to turn every task into a complicated process.
            </div>
          </section>

          <section id="business-operations" className="br30-about-section">
            <div className="br30-about-section-label">
              <span>05</span>
              Business Operations
            </div>

            <h2>Organizing the everyday work behind a business</h2>

            <p>Business operations involve more than customer and sales data. Teams also need to manage responsibilities, activities, follow-ups, internal records, and ongoing operational work.</p>

            <p>BR30 CRM provides a structured environment intended to connect these activities so that businesses can maintain greater visibility over their day-to-day work.</p>

            <ul>
              <li>Organize recurring business activities.</li>
              <li>Maintain operational records and notes.</li>
              <li>Coordinate responsibilities across teams.</li>
              <li>Track relevant customer and business activities.</li>
              <li>Create clearer processes for everyday workflows.</li>
            </ul>
          </section>

          <section id="customers" className="br30-about-section">
            <div className="br30-about-section-label">
              <span>06</span>
              Customer Management
            </div>

            <h2>Keep customer relationships organized</h2>

            <p>Customer information is one of the most important parts of many businesses. When customer records are scattered across multiple systems, teams can lose context and spend unnecessary time locating information.</p>

            <p>BR30 CRM provides a structured environment for managing customer and contact information and connecting that information with relevant business activities.</p>

            <div className="br30-about-points">
              <div className="br30-about-point">
                <CheckCircle2 size={14} />
                Customer and contact records
              </div>

              <div className="br30-about-point">
                <CheckCircle2 size={14} />
                Relationship information
              </div>

              <div className="br30-about-point">
                <CheckCircle2 size={14} />
                Customer activities
              </div>

              <div className="br30-about-point">
                <CheckCircle2 size={14} />
                Follow-up information
              </div>
            </div>
          </section>

          <section id="sales-workflows" className="br30-about-section">
            <div className="br30-about-section-label">
              <span>07</span>
              Sales & Workflows
            </div>

            <h2>Turn sales activities into clearer processes</h2>

            <p>Sales work often includes multiple stages, conversations, follow-ups, opportunities, and decisions. A structured workflow can help teams understand what needs attention and what has already been completed.</p>

            <p>BR30 CRM is designed to support businesses in organizing sales activities within the same environment where customer and operational information is managed.</p>

            <ul>
              <li>Organize sales opportunities and activities.</li>
              <li>Maintain follow-up information.</li>
              <li>Connect sales activities with customer records.</li>
              <li>Provide teams with a clearer workflow structure.</li>
            </ul>
          </section>

          <section id="team-collaboration" className="br30-about-section">
            <div className="br30-about-section-label">
              <span>08</span>
              Team Collaboration
            </div>

            <h2>A shared environment for business teams</h2>

            <p>Teams work better when responsibilities and information are organized clearly. BR30 CRM is designed to provide a common environment where authorized users can work with the information and workflows relevant to their roles.</p>

            <p>Different business responsibilities can be managed through structured access, workflows, activities, and operational information.</p>

            <div className="br30-about-note">
              <strong>Role-based work:</strong> Businesses can structure access and responsibilities according to the needs of their teams and operational environment.
            </div>
          </section>

          <section id="our-principles" className="br30-about-section">
            <div className="br30-about-section-label">
              <span>09</span>
              Our Principles
            </div>

            <h2>What guides the product</h2>

            <p>BR30 CRM's product direction is shaped around several practical principles that influence how business functionality is organized and presented.</p>

            <div className="br30-about-grid">
              <div className="br30-about-feature">
                <div className="br30-about-feature-icon">
                  <Target size={15} />
                </div>
                <strong>Purposeful design</strong>
                <span>Features should support a clear business need and contribute to useful workflows.</span>
              </div>

              <div className="br30-about-feature">
                <div className="br30-about-feature-icon">
                  <Eye size={15} />
                </div>
                <strong>Clarity</strong>
                <span>Information and workflows should be understandable and accessible to authorized users.</span>
              </div>

              <div className="br30-about-feature">
                <div className="br30-about-feature-icon">
                  <Users size={15} />
                </div>
                <strong>People-first workflows</strong>
                <span>Software should support teams and their working processes, not create unnecessary friction.</span>
              </div>

              <div className="br30-about-feature">
                <div className="br30-about-feature-icon">
                  <ShieldCheck size={15} />
                </div>
                <strong>Responsible handling</strong>
                <span>Security, access, privacy, and responsible information handling remain important parts of the platform.</span>
              </div>
            </div>
          </section>

          <section id="security" className="br30-about-section">
            <div className="br30-about-section-label">
              <span>10</span>
              Security & Responsibility
            </div>

            <h2>Building with responsible information handling in mind</h2>

            <p>Business platforms can contain important customer and operational information. BR30 CRM therefore considers account protection, authentication, access controls, and responsible data handling as important parts of the product experience.</p>

            <p>Users and organizations also have an important role in protecting their accounts, credentials, devices, and the information they choose to store within the platform.</p>

            <ul>
              <li>Account authentication and access controls.</li>
              <li>Protected communication mechanisms where appropriate.</li>
              <li>Security-conscious account management.</li>
              <li>Operational controls intended to limit unauthorized access.</li>
              <li>Responsible handling of business information.</li>
            </ul>

            <div className="br30-about-note">
              <strong>Important:</strong> No internet-based service can guarantee absolute security. Businesses should use appropriate internal controls and protect account credentials and access information.
            </div>
          </section>

          <section id="product-direction" className="br30-about-section">
            <div className="br30-about-section-label">
              <span>11</span>
              Product Direction
            </div>

            <h2>Continuously improving the business workspace</h2>

            <p>Business requirements change over time. As organizations grow, their workflows, teams, customer relationships, and operational needs can also evolve.</p>

            <p>BR30 CRM is intended to evolve alongside those needs by improving existing workflows, refining the user experience, and expanding useful business capabilities.</p>

            <p>Our direction remains centered on building practical tools that help businesses organize information and operate their workflows more effectively.</p>
          </section>

          <section id="who-we-serve" className="br30-about-section">
            <div className="br30-about-section-label">
              <span>12</span>
              Who We Serve
            </div>

            <h2>For businesses and professional teams</h2>

            <p>BR30 CRM is designed primarily for businesses, organizations, founders, operators, sales teams, customer-facing teams, and other professional users who need a structured environment for managing business information and workflows.</p>

            <div className="br30-about-points">
              <div className="br30-about-point">
                <CheckCircle2 size={14} />
                Growing businesses
              </div>

              <div className="br30-about-point">
                <CheckCircle2 size={14} />
                Customer-facing teams
              </div>

              <div className="br30-about-point">
                <CheckCircle2 size={14} />
                Sales organizations
              </div>

              <div className="br30-about-point">
                <CheckCircle2 size={14} />
                Operational teams
              </div>

              <div className="br30-about-point">
                <CheckCircle2 size={14} />
                Business owners
              </div>

              <div className="br30-about-point">
                <CheckCircle2 size={14} />
                Professional teams
              </div>
            </div>
          </section>

          <section id="our-approach" className="br30-about-section">
            <div className="br30-about-section-label">
              <span>13</span>
              Our Approach
            </div>

            <h2>Simple where possible, structured where necessary</h2>

            <p>We believe business software should provide enough structure to make work organized without making everyday activities feel unnecessarily complicated.</p>

            <p>That means focusing on useful interfaces, understandable workflows, centralized information, and functionality that supports real operational requirements.</p>

            <p>The objective is not simply to provide more features. It is to create a workspace where the features businesses use can work together in a meaningful way.</p>

            <div className="br30-about-cta">
              <div className="br30-about-cta-copy">
                <h3>Want to learn more about BR30 CRM?</h3>
                <p>Explore the platform or speak with the BR30 CRM team about your business requirements.</p>
              </div>

              <a
                href="https://br30crm-com-f.vercel.app/public/forms/6ac4a4ce8ab8658ebe3748f7/br30-crm-company-support-ticket?utm_source=br30crm-company-abou&utm_medium=website&lead_source=br30crm-company-abou&form_id=6ac2f5a745d94386aa073fc8&source_id=6ac2f73e45d94386aa073fca"
                rel="noopener noreferrer"
                className="br30-about-button">
                Create Support Ticket
                <ArrowRight size={14} />
              </a>
            </div>
          </section>

          <section id="contact" className="br30-about-section">
            <div className="br30-about-section-label">
              <span>14</span>
              Contact Us
            </div>

            <h2>Let's talk about your business</h2>

            <p>If you have questions about BR30 CRM, its capabilities, business workflows, or how the platform may fit your organization, our team can help you get in touch with the appropriate information.</p>

            <div className="br30-about-contact-card">
              <div className="br30-about-contact-icon">
                <Mail size={16} />
              </div>

              <div>
                <strong>BR30 CRM Support & Business Inquiries</strong>

                <a
                  href="https://br30crm-com-f.vercel.app/public/forms/6ac4a4ce8ab8658ebe3748f7/br30-crm-company-support-ticket?utm_source=br30crm-company-abou&utm_medium=website&lead_source=br30crm-company-abou&form_id=6ac2f5a745d94386aa073fc8&source_id=6ac2f73e45d94386aa073fca"
                  className="br30-support-ticket-link"
                  rel="noopener noreferrer">
                  Create Support Ticket
                </a>
              </div>
            </div>

            <div className="br30-about-contact-card">
              <div className="br30-about-contact-icon">
                <ShieldCheck size={16} />
              </div>

              <div>
                <strong>Responsible Business Software</strong>

                <p>BR30 CRM is focused on providing an organized workspace for customer relationships, sales activities, teams, and everyday business operations.</p>
              </div>
            </div>
          </section>
        </article>
      </main>

      <button type="button" className="br30-about-top-button" onClick={handleBackToTop} aria-label="Back to top" title="Back to top">
        <ArrowUp size={16} />
      </button>

      <LandingFooter />
    </div>
  );
}

export default About;
