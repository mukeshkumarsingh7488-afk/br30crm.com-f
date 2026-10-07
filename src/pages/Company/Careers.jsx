import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BriefcaseBusiness, CheckCircle2, ChevronRight, Code2, Mail, Rocket, Target, UserCheck, Users, Ticket } from "lucide-react";
import LandingNavbar from "../../components/landing/LandingNavbar";
import LandingFooter from "../../components/landing/LandingFooter";

function Careers() {
  const [activeSection, setActiveSection] = useState("working-at-br30");

  const sections = [
    { id: "working-at-br30", number: "01", title: "Working at BR30 CRM" },
    { id: "what-we-value", number: "02", title: "What We Value" },
    { id: "areas-of-work", number: "03", title: "Areas of Work" },
    { id: "how-we-work", number: "04", title: "How We Work" },
    { id: "opportunities", number: "05", title: "Opportunities" },
    { id: "apply", number: "06", title: "How to Apply" },
    { id: "contact", number: "07", title: "Contact Us" },
  ];

  const areas = [
    {
      icon: Code2,
      title: "Product & Engineering",
      text: "Build reliable, useful and scalable business software.",
    },
    {
      icon: Rocket,
      title: "Product & Growth",
      text: "Help shape product experiences and practical business workflows.",
    },
    {
      icon: Users,
      title: "Customer Experience",
      text: "Help customers understand and get value from the platform.",
    },
    {
      icon: BriefcaseBusiness,
      title: "Business Operations",
      text: "Support the systems and processes behind a growing product.",
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const offset = 150;
      let current = "working-at-br30";

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
    <div className="br30-careers-page">
      <style>{`.br30-careers-page{min-height:100vh;background:var(--crm-bg);color:var(--crm-text);font-family:var(--crm-font)}.br30-careers-page *,.br30-careers-page *::before,.br30-careers-page *::after{box-sizing:border-box}.br30-careers-hero{padding:142px 24px 58px;border-bottom:1px solid var(--crm-border);background:var(--crm-bg)}.br30-careers-hero-inner{width:100%;max-width:1120px;margin:0 auto}.br30-careers-breadcrumb{display:flex;align-items:center;gap:6px;margin-bottom:24px;color:var(--crm-muted);font-size:13px}.br30-careers-breadcrumb a{color:var(--crm-muted);text-decoration:none}.br30-careers-breadcrumb a:hover{color:var(--crm-primary)}.br30-careers-breadcrumb svg{opacity:.5}.br30-careers-eyebrow{display:inline-flex;align-items:center;gap:7px;color:var(--crm-primary);font-size:13px;font-weight:400;letter-spacing:.08em;text-transform:uppercase}.br30-careers-dot{width:6px;height:6px;border-radius:50%;background:var(--crm-primary)}.br30-careers-hero h1{margin:16px 0 14px;color:var(--crm-text);font-size:clamp(32px,4vw,48px);line-height:1.12;letter-spacing:-.025em;font-weight:400}.br30-careers-hero h1 span{color:var(--crm-primary)}.br30-careers-lead{max-width:760px;margin:0;color:var(--crm-muted);font-size:14px;line-height:1.75}.br30-careers-meta{display:flex;flex-wrap:wrap;gap:8px;margin-top:25px}.br30-careers-meta-item{display:flex;align-items:center;gap:7px;min-height:35px;padding:7px 11px;border:1px solid var(--crm-border);border-radius:9px;background:var(--crm-surface);color:var(--crm-muted);font-size:13px}.br30-careers-meta-item svg{color:var(--crm-primary)}.br30-careers-meta-item strong{color:var(--crm-text);font-weight:400}.br30-careers-main{width:100%;max-width:1120px;margin:0 auto;padding:52px 24px 80px;display:grid;grid-template-columns:235px minmax(0,1fr);gap:50px;align-items:start}.br30-careers-sidebar{position:sticky;top:100px;max-height:calc(100vh - 120px);overflow:auto;padding:7px;border:1px solid var(--crm-border);border-radius:13px;background:var(--crm-surface);box-shadow:var(--crm-shadow);scrollbar-width:thin}.br30-careers-sidebar-title{padding:9px 10px 11px;color:var(--crm-text);font-size:13px;font-weight:400;letter-spacing:.06em;text-transform:uppercase}.br30-careers-sidebar-list{display:flex;flex-direction:column;gap:1px}.br30-careers-sidebar button{width:100%;display:flex;align-items:center;gap:8px;padding:8px 9px;border:0;border-radius:8px;background:transparent;color:var(--crm-muted);font:inherit;font-size:13px;line-height:1.35;text-align:left;cursor:pointer}.br30-careers-sidebar button:hover{background:var(--crm-surface-2);color:var(--crm-text)}.br30-careers-sidebar button.active{background:var(--crm-primary-soft);color:var(--crm-primary);font-weight:400}.br30-careers-sidebar-number{width:22px;flex:0 0 22px;font-size:13px;font-weight:400;opacity:.7}.br30-careers-content{min-width:0}.br30-careers-intro-card{margin-bottom:34px;padding:21px;border:1px solid var(--crm-border);border-radius:13px;background:var(--crm-surface);box-shadow:var(--crm-shadow)}.br30-careers-intro-top{display:flex;align-items:flex-start;gap:13px}.br30-careers-intro-icon{width:38px;height:38px;flex:0 0 38px;display:grid;place-items:center;border-radius:9px;background:var(--crm-primary-soft);border:1px solid var(--crm-border);color:var(--crm-primary)}.br30-careers-intro-card h2{margin:0 0 5px;color:var(--crm-text);font-size:15px;font-weight:400;line-height:1.4}.br30-careers-intro-card p{margin:0;color:var(--crm-muted);font-size:13px;line-height:1.75}.br30-careers-section{scroll-margin-top:110px;padding:0 0 38px;margin-bottom:38px;border-bottom:1px solid var(--crm-border)}.br30-careers-section:last-child{border-bottom:0;margin-bottom:0}.br30-careers-section-label{display:flex;align-items:center;gap:8px;margin-bottom:10px;color:var(--crm-primary);font-size:13px;font-weight:400;letter-spacing:.08em;text-transform:uppercase}.br30-careers-section-label span{opacity:.65}.br30-careers-section h2{margin:0 0 14px;color:var(--crm-text);font-size:20px;line-height:1.35;font-weight:400;letter-spacing:-.01em}.br30-careers-section h3{margin:22px 0 8px;color:var(--crm-text);font-size:14px;line-height:1.45;font-weight:400}.br30-careers-section p{margin:0 0 13px;color:var(--crm-muted);font-size:13px;line-height:1.85}.br30-careers-section p:last-child{margin-bottom:0}.br30-careers-section ul{margin:10px 0 17px;padding-left:20px}.br30-careers-section li{margin:7px 0;padding-left:2px;color:var(--crm-muted);font-size:13px;line-height:1.75}.br30-careers-section li::marker{color:var(--crm-primary)}.br30-careers-note{display:flex;align-items:flex-start;gap:10px;margin:18px 0;padding:14px 16px;border-left:3px solid var(--crm-primary);border-radius:0 9px 9px 0;background:var(--crm-surface-2);color:var(--crm-muted);font-size:13px;line-height:1.75}.br30-careers-note svg{flex:0 0 auto;margin-top:2px;color:var(--crm-primary)}.br30-careers-note strong{color:var(--crm-text)}.br30-careers-areas{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:20px}.br30-careers-area{display:flex;flex-direction:column;align-items:flex-start;padding:15px;border:1px solid var(--crm-border);border-radius:11px;background:var(--crm-surface);transition:.2s}.br30-careers-area:hover{border-color:color-mix(in srgb,var(--crm-primary) 30%,var(--crm-border));transform:translateY(-2px)}.br30-careers-area-icon{width:34px;height:34px;display:grid;place-items:center;margin-bottom:11px;border-radius:8px;background:var(--crm-primary-soft);color:var(--crm-primary)}.br30-careers-area strong{margin-bottom:5px;color:var(--crm-text);font-size:13px;font-weight:400}.br30-careers-area span{color:var(--crm-muted);font-size:13px;line-height:1.65}.br30-careers-points{display:flex;flex-direction:column;gap:9px;margin-top:17px}.br30-careers-point{display:flex;align-items:flex-start;gap:8px;color:var(--crm-muted);font-size:13px;line-height:1.6}.br30-careers-point svg{flex:0 0 auto;margin-top:2px;color:var(--crm-primary)}.br30-careers-action-card{display:grid;grid-template-columns:auto 1fr;gap:12px;margin-top:18px;padding:17px;border:1px solid var(--crm-border);border-radius:11px;background:var(--crm-surface)}.br30-careers-action-icon{width:36px;height:36px;display:grid;place-items:center;border-radius:9px;background:var(--crm-primary-soft);color:var(--crm-primary)}.br30-careers-action-card strong{display:block;margin-bottom:4px;color:var(--crm-text);font-size:13px}.br30-careers-action-card p{margin:0!important}.br30-careers-action-card a{display:inline-flex;align-items:center;gap:6px;margin-top:8px;color:var(--crm-primary);font-size:13px;text-decoration:none}.br30-careers-action-card a:hover{text-decoration:underline}.br30-careers-button{display:inline-flex;align-items:center;justify-content:center;gap:8px;width:100%;min-height:40px;padding:0 14px;border:1px solid var(--crm-primary);border-radius:9px;background:var(--crm-primary);color:#fff!important;font-size:13px;font-weight:400;line-height:1;text-decoration:none!important;white-space:nowrap;visibility:visible;opacity:1;overflow:visible;transition:.2s}.br30-careers-button:hover{background:var(--crm-primary);color:#fff!important;transform:translateY(-1px);text-decoration:none!important}.br30-careers-button svg{display:block;flex:0 0 auto;color:currentColor;visibility:visible;opacity:1}.br30-careers-button:hover{opacity:.9;transform:translateY(-1px)}.br30-careers-contact-card{display:grid;grid-template-columns:auto 1fr;gap:12px;margin-top:18px;padding:17px;border:1px solid var(--crm-border);border-radius:11px;background:var(--crm-surface)}.br30-careers-contact-icon{width:36px;height:36px;display:grid;place-items:center;border-radius:9px;background:var(--crm-primary-soft);color:var(--crm-primary)}.br30-careers-contact-card strong{display:block;margin-bottom:4px;color:var(--crm-text);font-size:13px}.br30-careers-contact-card p{margin:0!important}.br30-careers-contact-card a{color:var(--crm-primary);font-size:13px;text-decoration:none}.br30-careers-contact-card a:hover{text-decoration:underline}.br30-careers-top-button{position:fixed;right:20px;bottom:20px;z-index:30;width:38px;height:38px;display:grid;place-items:center;border:1px solid var(--crm-border);border-radius:10px;background:var(--crm-surface);color:var(--crm-text);box-shadow:var(--crm-shadow);cursor:pointer;transition:.2s}.br30-careers-top-button:hover{border-color:var(--crm-primary);color:var(--crm-primary);transform:translateY(-2px)}@media(max-width:900px){.br30-careers-main{grid-template-columns:1fr;gap:25px}.br30-careers-sidebar{position:relative;top:auto;max-height:none}.br30-careers-sidebar-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:600px){.br30-careers-hero{padding:120px 17px 45px}.br30-careers-hero h1{font-size:34px}.br30-careers-lead{font-size:13px}.br30-careers-meta{display:grid;grid-template-columns:1fr}.br30-careers-main{padding:35px 17px 60px}.br30-careers-sidebar-list{grid-template-columns:1fr}.br30-careers-intro-card{padding:18px}.br30-careers-section{scroll-margin-top:90px;padding-bottom:32px;margin-bottom:32px}.br30-careers-section h2{font-size:18px}.br30-careers-section p,.br30-careers-section li{font-size:13px}.br30-careers-areas{grid-template-columns:1fr}.br30-careers-action-card,.br30-careers-contact-card{grid-template-columns:1fr}.br30-careers-top-button{right:13px;bottom:13px}}`}</style>

      <LandingNavbar />

      <header className="br30-careers-hero">
        <div className="br30-careers-hero-inner">
          <div className="br30-careers-breadcrumb">
            <Link to="/">Home</Link>
            <ChevronRight size={13} />
            <span>Company</span>
            <ChevronRight size={13} />
            <span>Careers</span>
          </div>

          <div className="br30-careers-eyebrow">
            <span className="br30-careers-dot" />
            Careers at BR30 CRM
          </div>

          <h1>
            Help build the future of <span>business software.</span>
          </h1>

          <p className="br30-careers-lead">We are interested in people who enjoy solving practical problems, building useful products, and creating better experiences for businesses and their teams.</p>

          <div className="br30-careers-meta">
            <div className="br30-careers-meta-item">
              <BriefcaseBusiness size={14} />
              <span>
                Opportunities <strong>Based on Business Needs</strong>
              </span>
            </div>

            <div className="br30-careers-meta-item">
              <Rocket size={14} />
              <span>
                Focus <strong>Useful Product Work</strong>
              </span>
            </div>

            <div className="br30-careers-meta-item">
              <Target size={14} />
              <span>
                Team <strong>Product & Operations</strong>
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="br30-careers-main">
        <aside className="br30-careers-sidebar">
          <div className="br30-careers-sidebar-title">On this page</div>

          <div className="br30-careers-sidebar-list">
            {sections.map((section) => (
              <button key={section.id} type="button" className={activeSection === section.id ? "active" : ""} onClick={() => scrollToSection(section.id)}>
                <span className="br30-careers-sidebar-number">{section.number}</span>
                <span>{section.title}</span>
              </button>
            ))}
          </div>
        </aside>

        <article className="br30-careers-content">
          <div className="br30-careers-intro-card">
            <div className="br30-careers-intro-top">
              <div className="br30-careers-intro-icon">
                <Rocket size={18} />
              </div>

              <div>
                <h2>Build useful things that businesses depend on</h2>
                <p>BR30 CRM is focused on building practical tools for customer management, sales, teams, workflows, and business operations. We value thoughtful execution, clear communication, continuous learning, and a strong focus on the people who use our products.</p>
              </div>
            </div>
          </div>

          <section id="working-at-br30" className="br30-careers-section">
            <div className="br30-careers-section-label">
              <span>01</span>
              Working at BR30 CRM
            </div>

            <h2>Build useful things that businesses depend on</h2>

            <p>BR30 CRM is focused on building practical tools for customer management, sales, teams, workflows, and business operations.</p>

            <p>We are interested in people who enjoy understanding real business problems and turning those problems into useful, reliable, and understandable product experiences.</p>

            <p>Our work involves product development, technology, customer experience, business operations, and the systems that help a growing software platform operate effectively.</p>

            <div className="br30-careers-points">
              <div className="br30-careers-point">
                <CheckCircle2 size={14} />
                <span>Focus on useful product outcomes.</span>
              </div>

              <div className="br30-careers-point">
                <CheckCircle2 size={14} />
                <span>Keep communication clear and direct.</span>
              </div>

              <div className="br30-careers-point">
                <CheckCircle2 size={14} />
                <span>Learn, improve and iterate continuously.</span>
              </div>

              <div className="br30-careers-point">
                <CheckCircle2 size={14} />
                <span>Treat customers and teammates with respect.</span>
              </div>
            </div>
          </section>

          <section id="what-we-value" className="br30-careers-section">
            <div className="br30-careers-section-label">
              <span>02</span>
              What We Value
            </div>

            <h2>Thoughtful work, clear communication and continuous improvement</h2>

            <p>We value people who take ownership of their work, communicate clearly, and remain willing to learn as products, customers, and business requirements evolve.</p>

            <h3>Practical problem solving</h3>

            <p>Good work starts with understanding the actual problem. We value solutions that are useful, maintainable, and appropriate for the people who will use them.</p>

            <h3>Responsible execution</h3>

            <p>Business software can handle important information and workflows. We therefore value careful implementation, attention to detail, reliability, and responsible handling of customer and business data.</p>

            <h3>Continuous learning</h3>

            <p>Technology and business requirements continue to change. We encourage curiosity, experimentation, feedback, and a willingness to improve existing approaches.</p>
          </section>

          <section id="areas-of-work" className="br30-careers-section">
            <div className="br30-careers-section-label">
              <span>03</span>
              Areas of Work
            </div>

            <h2>Where you could contribute</h2>

            <p>BR30 CRM brings together several areas of work. Opportunities may vary depending on current product priorities, business requirements, and available roles.</p>

            <div className="br30-careers-areas">
              {areas.map(({ icon: Icon, title, text }) => (
                <div className="br30-careers-area" key={title}>
                  <div className="br30-careers-area-icon">
                    <Icon size={15} />
                  </div>

                  <strong>{title}</strong>

                  <span>{text}</span>
                </div>
              ))}
            </div>
          </section>

          <section id="how-we-work" className="br30-careers-section">
            <div className="br30-careers-section-label">
              <span>04</span>
              How We Work
            </div>

            <h2>A practical approach to building and improving products</h2>

            <p>Our work is centered around understanding requirements, building practical solutions, reviewing results, and improving the product over time.</p>

            <h3>Understand the problem</h3>

            <p>We start by understanding what customers, teams, or business operations actually need before deciding how a feature or workflow should work.</p>

            <h3>Build with purpose</h3>

            <p>Product and engineering work should have a clear purpose. We aim to avoid unnecessary complexity and focus on functionality that provides meaningful value.</p>

            <h3>Improve through feedback</h3>

            <p>Feedback helps identify gaps, usability issues, and opportunities for improvement. We treat iteration as an ongoing part of product development.</p>

            <div className="br30-careers-note">
              <CheckCircle2 size={14} />
              <span>
                <strong>Our approach:</strong> Build useful solutions, communicate clearly, learn continuously, and improve based on real requirements and feedback.
              </span>
            </div>
          </section>

          <section id="opportunities" className="br30-careers-section">
            <div className="br30-careers-section-label">
              <span>05</span>
              Opportunities
            </div>

            <h2>Want to work with us?</h2>

            <p>If you are interested in joining BR30 CRM, send us your introduction, relevant experience, and the kind of work you would like to contribute to.</p>

            <p>At the moment, opportunities may be considered based on business requirements and available roles. Sending an introduction does not guarantee that a position is currently available.</p>

            <div className="br30-careers-note">
              <Mail size={14} />
              <span>Please include enough information about your background, experience, relevant skills, and the type of role or work you are interested in.</span>
            </div>
          </section>

          <section id="apply" className="br30-careers-section">
            <div className="br30-careers-section-label">
              <span>06</span>
              How to Apply
            </div>

            <h2>Share your profile with the BR30 CRM team</h2>

            <p>If you would like to be considered for a career opportunity, you can contact our team by email. A clear introduction helps us understand your background and the type of contribution you are looking to make.</p>

            <div className="br30-careers-action-card">
              <div className="br30-careers-action-icon">
                <BriefcaseBusiness size={16} />
              </div>

              <div>
                <strong>Career inquiry</strong>

                <p>Share your name, experience, role of interest, relevant skills, and any additional information that may help us understand your profile.</p>

                <a
                  href="https://br30crm-com-f.vercel.app/public/forms/6ac4a4ce8ab8658ebe3748f7/br30-crm-company-support-ticket?utm_source=br30crm-company-careers&utm_medium=website&lead_source=br30crm-company-careers&form_id=6ac2f5a745d94386aa073fc8&source_id=6ac2f77045d94386aa073fcc"
                  className="br30-support-ticket-link"
                  rel="noopener noreferrer">
                  Create Support Ticket <ArrowRight size={12} />
                </a>

                <br />

                <a
                  href="https://br30crm-com-f.vercel.app/public/forms/6ac4a4ce8ab8658ebe3748f7/br30-crm-company-support-ticket?utm_source=br30crm-company-careers&utm_medium=website&lead_source=br30crm-company-careers&form_id=6ac2f5a745d94386aa073fc8&source_id=6ac2f77045d94386aa073fcc"
                  className="br30-careers-button"
                  rel="noopener noreferrer">
                  <Ticket size={13} />
                  Create Support Ticket
                </a>
              </div>
            </div>
          </section>

          <section id="contact" className="br30-careers-section">
            <div className="br30-careers-section-label">
              <span>07</span>
              Contact Us
            </div>

            <h2>Questions about careers at BR30 CRM?</h2>

            <p>If you have questions about potential opportunities, roles, or working with BR30 CRM, you can contact the team using the email address below.</p>

            <div className="br30-careers-contact-card">
              <div className="br30-careers-contact-icon">
                <Mail size={16} />
              </div>

              <div>
                <strong>Career & Support</strong>

                <a
                  href="https://br30crm-com-f.vercel.app/public/forms/6ac4a4ce8ab8658ebe3748f7/br30-crm-company-support-ticket?utm_source=br30crm-company-careers&utm_medium=website&lead_source=br30crm-company-careers&form_id=6ac2f5a745d94386aa073fc8&source_id=6ac2f77045d94386aa073fcc"
                  className="br30-support-ticket-link"
                  rel="noopener noreferrer">
                  Create Support Ticket
                </a>
              </div>
            </div>

            <div className="br30-careers-contact-card">
              <div className="br30-careers-contact-icon">
                <UserCheck size={16} />
              </div>

              <div>
                <strong>BR30 CRM</strong>

                <p>For career-related inquiries, please provide accurate information about your experience and the type of opportunity you are interested in. Our team can then review the inquiry based on current business requirements.</p>
              </div>
            </div>
          </section>
        </article>
      </main>

      <button type="button" className="br30-careers-top-button" onClick={handleBackToTop} aria-label="Back to top" title="Back to top">
        <ArrowRight size={16} style={{ transform: "rotate(-90deg)" }} />
      </button>

      <LandingFooter />
    </div>
  );
}

export default Careers;
