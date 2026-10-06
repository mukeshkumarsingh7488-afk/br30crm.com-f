import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, BookOpen, BriefcaseBusiness, CheckCircle2, ChevronRight, Clock3, FileText, Lightbulb, Mail, MessageSquare, Rocket, Search, ShieldCheck, Sparkles, Target, TrendingUp, Users, Workflow, X, Ticket } from "lucide-react";
import LandingNavbar from "../../components/landing/LandingNavbar";
import LandingFooter from "../../components/landing/LandingFooter";
import { COMPANY_BLOG_SUPPORT_FORM_URL } from "../../constants/supportForm";

function Blog() {
  const [activeSection, setActiveSection] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");

  const sections = [
    { id: "overview", number: "01", title: "Overview" },
    { id: "featured", number: "02", title: "Featured Article" },
    { id: "crm", number: "03", title: "CRM & Customers" },
    { id: "sales", number: "04", title: "Sales & Growth" },
    { id: "operations", number: "05", title: "Operations" },
    { id: "teams", number: "06", title: "Teams & Productivity" },
    { id: "technology", number: "07", title: "Technology" },
    { id: "insights", number: "08", title: "Business Insights" },
    { id: "resources", number: "09", title: "Resources" },
    { id: "contact", number: "10", title: "Suggest a Topic" },
  ];

  const posts = [
    {
      category: "CRM",
      icon: Users,
      title: "Why a centralized CRM can simplify everyday business operations",
      text: "Explore how customer records, conversations, activities, follow-ups, and business information can be organized inside one structured workspace.",
      time: "5 min read",
    },
    {
      category: "CRM",
      icon: Users,
      title: "From customer records to better customer relationships",
      text: "Customer management is more than storing contact information. A useful CRM creates a consistent workflow around every customer relationship.",
      time: "6 min read",
    },
    {
      category: "Sales",
      icon: TrendingUp,
      title: "Building a clearer customer follow-up process",
      text: "A structured follow-up process can help teams keep track of conversations, activities, opportunities, tasks, and important customer moments.",
      time: "6 min read",
    },
    {
      category: "Sales",
      icon: BarChart3,
      title: "Turning sales information into useful actions",
      text: "Sales data becomes more useful when teams can connect customer information with activities, responsibilities, opportunities, and next steps.",
      time: "7 min read",
    },
    {
      category: "Operations",
      icon: Workflow,
      title: "Creating organized workflows for growing teams",
      text: "Structured workflows can help growing teams understand responsibilities, reduce operational confusion, and maintain better visibility.",
      time: "7 min read",
    },
    {
      category: "Operations",
      icon: Target,
      title: "Why business processes become easier when they are visible",
      text: "When important processes are clearly organized, teams can understand what needs attention and where work currently stands.",
      time: "5 min read",
    },
    {
      category: "Teams",
      icon: Users,
      title: "Creating better collaboration across business teams",
      text: "Shared information, clear responsibilities, and organized workflows can create a more consistent working environment for teams.",
      time: "6 min read",
    },
    {
      category: "Productivity",
      icon: Rocket,
      title: "Reducing operational complexity without reducing capability",
      text: "Business software should make important work easier to understand instead of creating unnecessary layers of complexity.",
      time: "5 min read",
    },
    {
      category: "Technology",
      icon: ShieldCheck,
      title: "What responsible business software should prioritize",
      text: "Security, access control, reliability, responsible data handling, and clear workflows are important considerations for modern business platforms.",
      time: "8 min read",
    },
    {
      category: "Business",
      icon: Lightbulb,
      title: "Turning business information into useful workflows",
      text: "Information becomes more valuable when teams can connect it to actions, decisions, follow-ups, and measurable business processes.",
      time: "5 min read",
    },
    {
      category: "Product",
      icon: Sparkles,
      title: "What makes business software genuinely useful?",
      text: "Useful business software should solve real problems while remaining clear enough for teams to use consistently every day.",
      time: "4 min read",
    },
    {
      category: "Growth",
      icon: TrendingUp,
      title: "Building systems that can grow with your business",
      text: "As businesses grow, structured customer, sales, team, and operational systems can become increasingly important.",
      time: "7 min read",
    },
  ];

  const filteredPosts = posts.filter((post) => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return true;

    return post.title.toLowerCase().includes(query) || post.text.toLowerCase().includes(query) || post.category.toLowerCase().includes(query);
  });

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
    <div className="br30-blog-page">
      <style>{`.br30-blog-page{min-height:100vh;background:var(--crm-bg);color:var(--crm-text);font-family:var(--crm-font)}.br30-blog-page *,.br30-blog-page *::before,.br30-blog-page *::after{box-sizing:border-box}.br30-blog-hero{padding:142px 24px 58px;border-bottom:1px solid var(--crm-border);background:var(--crm-bg)}.br30-blog-container{width:100%;max-width:1120px;margin:0 auto}.br30-blog-breadcrumb{display:flex;align-items:center;gap:6px;margin-bottom:24px;color:var(--crm-muted);font-size:13px}.br30-blog-breadcrumb a{color:var(--crm-muted);text-decoration:none}.br30-blog-breadcrumb a:hover{color:var(--crm-primary)}.br30-blog-breadcrumb svg{opacity:.5}.br30-blog-eyebrow{display:inline-flex;align-items:center;gap:7px;color:var(--crm-primary);font-size:13px;font-weight:400;letter-spacing:.08em;text-transform:uppercase}.br30-blog-dot{width:6px;height:6px;border-radius:50%;background:var(--crm-primary)}.br30-blog-hero h1{margin:16px 0 14px;color:var(--crm-text);font-size:clamp(32px,4vw,48px);line-height:1.12;letter-spacing:-.025em;font-weight:400}.br30-blog-hero h1 span{color:var(--crm-primary)}.br30-blog-lead{max-width:760px;margin:0;color:var(--crm-muted);font-size:14px;line-height:1.75}.br30-blog-meta{display:flex;flex-wrap:wrap;gap:8px;margin-top:25px}.br30-blog-meta-item{display:flex;align-items:center;gap:7px;min-height:35px;padding:7px 11px;border:1px solid var(--crm-border);border-radius:9px;background:var(--crm-surface);color:var(--crm-muted);font-size:13px}.br30-blog-meta-item svg{color:var(--crm-primary)}.br30-blog-meta-item strong{color:var(--crm-text);font-weight:400}.br30-blog-main{width:100%;max-width:1120px;margin:0 auto;padding:52px 24px 80px;display:grid;grid-template-columns:235px minmax(0,1fr);gap:50px;align-items:start}.br30-blog-sidebar{position:sticky;top:100px;max-height:calc(100vh - 120px);overflow:auto;padding:7px;border:1px solid var(--crm-border);border-radius:13px;background:var(--crm-surface);box-shadow:var(--crm-shadow);scrollbar-width:thin}.br30-blog-sidebar-title{padding:9px 10px 11px;color:var(--crm-text);font-size:13px;font-weight:400;letter-spacing:.06em;text-transform:uppercase}.br30-blog-sidebar-list{display:flex;flex-direction:column;gap:1px}.br30-blog-sidebar button{width:100%;display:flex;align-items:center;gap:8px;padding:8px 9px;border:0;border-radius:8px;background:transparent;color:var(--crm-muted);font:inherit;font-size:13px;line-height:1.35;text-align:left;cursor:pointer}.br30-blog-sidebar button:hover{background:var(--crm-surface-2);color:var(--crm-text)}.br30-blog-sidebar button.active{background:var(--crm-primary-soft);color:var(--crm-primary);font-weight:400}.br30-blog-sidebar-number{width:22px;flex:0 0 22px;font-size:13px;font-weight:400;opacity:.7}.br30-blog-content{min-width:0}.br30-blog-intro-card{margin-bottom:34px;padding:21px;border:1px solid var(--crm-border);border-radius:13px;background:var(--crm-surface);box-shadow:var(--crm-shadow)}.br30-blog-intro-top{display:flex;align-items:flex-start;gap:13px}.br30-blog-intro-icon{width:38px;height:38px;flex:0 0 38px;display:grid;place-items:center;border-radius:9px;background:var(--crm-primary-soft);border:1px solid var(--crm-border);color:var(--crm-primary)}.br30-blog-intro-card h2{margin:0 0 5px;color:var(--crm-text);font-size:15px;font-weight:400;line-height:1.4}.br30-blog-intro-card p{margin:0;color:var(--crm-muted);font-size:13px;line-height:1.75}.br30-blog-section{scroll-margin-top:110px;padding:0 0 38px;margin-bottom:38px;border-bottom:1px solid var(--crm-border)}.br30-blog-section:last-child{border-bottom:0;margin-bottom:0}.br30-blog-section-label{display:flex;align-items:center;gap:8px;margin-bottom:10px;color:var(--crm-primary);font-size:13px;font-weight:400;letter-spacing:.08em;text-transform:uppercase}.br30-blog-section-label span{opacity:.65}.br30-blog-section h2{margin:0 0 14px;color:var(--crm-text);font-size:20px;line-height:1.35;font-weight:400;letter-spacing:-.01em}.br30-blog-section h3{margin:22px 0 8px;color:var(--crm-text);font-size:14px;line-height:1.45;font-weight:400}.br30-blog-section p{margin:0 0 13px;color:var(--crm-muted);font-size:13px;line-height:1.85}.br30-blog-section p:last-child{margin-bottom:0}.br30-blog-section ul{margin:10px 0 17px;padding-left:20px}.br30-blog-section li{margin:7px 0;padding-left:2px;color:var(--crm-muted);font-size:13px;line-height:1.75}.br30-blog-section li::marker{color:var(--crm-primary)}.br30-blog-note{margin:18px 0;padding:14px 16px;border-left:3px solid var(--crm-primary);border-radius:0 9px 9px 0;background:var(--crm-surface-2);color:var(--crm-muted);font-size:13px;line-height:1.75}.br30-blog-note strong{color:var(--crm-text)}.br30-blog-feature-card{padding:24px;border:1px solid var(--crm-border);border-radius:13px;background:var(--crm-surface);box-shadow:var(--crm-shadow)}.br30-blog-feature-label{display:inline-flex;align-items:center;gap:7px;color:var(--crm-primary);font-size:13px;font-weight:400;letter-spacing:.08em;text-transform:uppercase}.br30-blog-feature-card h2{margin:13px 0 10px;color:var(--crm-text);font-size:23px;line-height:1.4;font-weight:400;letter-spacing:-.01em}.br30-blog-feature-card p{margin:0;color:var(--crm-muted);font-size:13px;line-height:1.85}.br30-blog-feature-bottom{display:flex;align-items:center;justify-content:space-between;gap:15px;margin-top:20px;padding-top:16px;border-top:1px solid var(--crm-border)}.br30-blog-time{display:inline-flex;align-items:center;gap:6px;color:var(--crm-muted);font-size:13px}.br30-blog-time svg{color:var(--crm-primary)}.br30-blog-read{display:inline-flex;align-items:center;gap:6px;color:var(--crm-primary);font-size:13px;font-weight:400;text-decoration:none}.br30-blog-read:hover{text-decoration:underline}.br30-blog-search{display:flex;align-items:center;gap:8px;margin:0 0 24px;padding:10px 12px;border:1px solid var(--crm-border);border-radius:10px;background:var(--crm-surface);color:var(--crm-muted)}.br30-blog-search svg{flex:0 0 auto;color:var(--crm-primary)}.br30-blog-search input{width:100%;border:0;outline:0;background:transparent;color:var(--crm-text);font:inherit;font-size:13px}.br30-blog-search input::placeholder{color:var(--crm-muted)}.br30-blog-search button{display:grid;place-items:center;width:23px;height:23px;padding:0;border:0;background:transparent;color:var(--crm-muted);cursor:pointer}.br30-blog-search button:hover{color:var(--crm-primary)}.br30-blog-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.br30-blog-card{display:flex;flex-direction:column;min-height:245px;padding:20px;border:1px solid var(--crm-border);border-radius:12px;background:var(--crm-surface);box-shadow:var(--crm-shadow);transition:.2s}.br30-blog-card:hover{border-color:color-mix(in srgb,var(--crm-primary) 30%,var(--crm-border));transform:translateY(-2px)}.br30-blog-card-label{display:inline-flex;align-items:center;gap:6px;color:var(--crm-primary);font-size:13px;font-weight:400;letter-spacing:.07em;text-transform:uppercase}.br30-blog-card h2{margin:12px 0 9px;color:var(--crm-text);font-size:15px;line-height:1.45;font-weight:400}.br30-blog-card p{margin:0;color:var(--crm-muted);font-size:13px;line-height:1.75}.br30-blog-card-bottom{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:auto;padding-top:17px}.br30-blog-category-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.br30-blog-category-card{padding:18px;border:1px solid var(--crm-border);border-radius:11px;background:var(--crm-surface)}.br30-blog-category-icon{width:34px;height:34px;display:grid;place-items:center;margin-bottom:12px;border-radius:9px;background:var(--crm-primary-soft);border:1px solid var(--crm-border);color:var(--crm-primary)}.br30-blog-category-card h3{margin:0 0 6px;color:var(--crm-text);font-size:13px;font-weight:400}.br30-blog-category-card p{margin:0;color:var(--crm-muted);font-size:13px;line-height:1.7}.br30-blog-resource-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.br30-blog-resource-card{padding:18px;border:1px solid var(--crm-border);border-radius:11px;background:var(--crm-surface)}.br30-blog-resource-card svg{color:var(--crm-primary)}.br30-blog-resource-card h3{margin:10px 0 6px;color:var(--crm-text);font-size:13px;font-weight:400}.br30-blog-resource-card p{margin:0;color:var(--crm-muted);font-size:13px;line-height:1.7}.br30-blog-resource-card a{display:inline-flex;align-items:center;gap:5px;margin-top:12px;color:var(--crm-primary);font-size:13px;font-weight:400;text-decoration:none}.br30-blog-contact-card{display:grid;grid-template-columns:auto 1fr;gap:12px;margin-top:18px;padding:17px;border:1px solid var(--crm-border);border-radius:11px;background:var(--crm-surface)}.br30-blog-contact-icon{width:36px;height:36px;display:grid;place-items:center;border-radius:9px;background:var(--crm-primary-soft);color:var(--crm-primary)}.br30-blog-contact-card strong{display:block;margin-bottom:4px;color:var(--crm-text);font-size:13px}.br30-blog-contact-card a{color:var(--crm-primary);font-size:13px;text-decoration:none}.br30-blog-contact-card a:hover{text-decoration:underline}.br30-blog-contact-card p{margin:0!important}.br30-blog-cta{display:flex;align-items:center;justify-content:space-between;gap:25px;margin-top:8px;padding:22px;border:1px solid var(--crm-border);border-radius:13px;background:var(--crm-surface);box-shadow:var(--crm-shadow)}.br30-blog-cta h2{margin:0 0 6px;color:var(--crm-text);font-size:16px;font-weight:400}.br30-blog-cta p{margin:0;color:var(--crm-muted);font-size:13px;line-height:1.7}.br30-blog-button{display:inline-flex;align-items:center;justify-content:center;gap:7px;min-height:38px;padding:0 14px;border:1px solid var(--crm-primary);border-radius:9px;background:var(--crm-primary);color:#fff!important;font-size:13px;font-weight:400;text-decoration:none;white-space:nowrap}.br30-blog-button:hover{transform:translateY(-1px)}.br30-blog-top-button{position:fixed;right:20px;bottom:20px;z-index:30;width:38px;height:38px;display:grid;place-items:center;border:1px solid var(--crm-border);border-radius:10px;background:var(--crm-surface);color:var(--crm-text);box-shadow:var(--crm-shadow);cursor:pointer;transition:.2s}.br30-blog-top-button:hover{border-color:var(--crm-primary);color:var(--crm-primary);transform:translateY(-2px)}@media(max-width:900px){.br30-blog-main{grid-template-columns:1fr;gap:25px}.br30-blog-sidebar{position:relative;top:auto;max-height:none}.br30-blog-sidebar-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr))}.br30-blog-resource-grid{grid-template-columns:1fr 1fr}}@media(max-width:600px){.br30-blog-hero{padding:120px 17px 45px}.br30-blog-hero h1{font-size:34px}.br30-blog-lead{font-size:13px}.br30-blog-meta{display:grid;grid-template-columns:1fr}.br30-blog-main{padding:35px 17px 60px}.br30-blog-sidebar-list{grid-template-columns:1fr}.br30-blog-grid,.br30-blog-category-grid,.br30-blog-resource-grid{grid-template-columns:1fr}.br30-blog-feature-card{padding:18px}.br30-blog-feature-card h2{font-size:19px}.br30-blog-section{scroll-margin-top:90px;padding-bottom:32px;margin-bottom:32px}.br30-blog-section h2{font-size:18px}.br30-blog-section p,.br30-blog-section li{font-size:13px}.br30-blog-contact-card{grid-template-columns:1fr}.br30-blog-cta{flex-direction:column;align-items:flex-start}.br30-blog-button{width:100%}.br30-blog-top-button{right:13px;bottom:13px}}`}</style>

      <LandingNavbar />

      <header className="br30-blog-hero">
        <div className="br30-blog-container">
          <div className="br30-blog-breadcrumb">
            <Link to="/">Home</Link>
            <ChevronRight size={13} />
            <span>Company</span>
            <ChevronRight size={13} />
            <span>Blog</span>
          </div>

          <div className="br30-blog-eyebrow">
            <span className="br30-blog-dot" />
            BR30 CRM Knowledge Hub
          </div>

          <h1>
            Ideas for <span>better business.</span>
          </h1>

          <p className="br30-blog-lead">Practical insights, product thinking, CRM guidance, sales ideas, operational workflows, team productivity, technology perspectives, and business lessons for modern teams.</p>

          <div className="br30-blog-meta">
            <div className="br30-blog-meta-item">
              <BookOpen size={14} />
              <span>
                Knowledge <strong>Business & CRM</strong>
              </span>
            </div>

            <div className="br30-blog-meta-item">
              <FileText size={14} />
              <span>
                Articles <strong>{posts.length}+</strong>
              </span>
            </div>

            <div className="br30-blog-meta-item">
              <ShieldCheck size={14} />
              <span>
                Focus <strong>Practical Insights</strong>
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="br30-blog-main">
        <aside className="br30-blog-sidebar">
          <div className="br30-blog-sidebar-title">On this page</div>

          <div className="br30-blog-sidebar-list">
            {sections.map((section) => (
              <button key={section.id} type="button" className={activeSection === section.id ? "active" : ""} onClick={() => scrollToSection(section.id)}>
                <span className="br30-blog-sidebar-number">{section.number}</span>
                <span>{section.title}</span>
              </button>
            ))}
          </div>
        </aside>

        <article className="br30-blog-content">
          <div className="br30-blog-intro-card">
            <div className="br30-blog-intro-top">
              <div className="br30-blog-intro-icon">
                <Lightbulb size={18} />
              </div>

              <div>
                <h2>Welcome to the BR30 CRM knowledge hub</h2>

                <p>BR30 CRM is an all-in-one business workspace covering customer relationships, sales, teams, workflows, operations, productivity, and business information. This space is built to share practical ideas that can help businesses understand and improve the way they work.</p>
              </div>
            </div>
          </div>

          <section id="overview" className="br30-blog-section">
            <div className="br30-blog-section-label">
              <span>01</span>
              Overview
            </div>

            <h2>Business knowledge built around real workflows</h2>

            <p>Business software becomes more useful when it reflects the way teams actually work. Customer conversations, sales activities, tasks, follow-ups, internal responsibilities, operational information, and reporting are often connected to one another.</p>

            <p>The BR30 CRM blog explores these connections through practical articles and educational resources designed around modern business operations.</p>

            <div className="br30-blog-note">
              <strong>Our approach:</strong> Keep business technology understandable, practical, organized, and focused on useful outcomes.
            </div>
          </section>

          <section id="featured" className="br30-blog-section">
            <div className="br30-blog-section-label">
              <span>02</span>
              Featured Article
            </div>

            <div className="br30-blog-feature-card">
              <div className="br30-blog-feature-label">
                <Sparkles size={13} />
                Featured article
              </div>

              <h2>Building a business workspace that your entire team can actually use</h2>

              <p>A CRM should not simply become another place where information is stored. It should help teams understand what needs to happen next, who is responsible, which customer relationships need attention, and where important business information belongs.</p>

              <p style={{ marginTop: "13px" }}>A well-organized workspace can connect customer management, sales activity, team responsibilities, tasks, communication, and operational processes into a clearer working environment.</p>

              <div className="br30-blog-feature-bottom">
                <span className="br30-blog-time">
                  <Clock3 size={12} />8 min read
                </span>

                <a
                  href="#crm"
                  className="br30-blog-read"
                  onClick={(event) => {
                    event.preventDefault();
                    scrollToSection("crm");
                  }}>
                  Explore CRM insights <ArrowRight size={13} />
                </a>
              </div>
            </div>
          </section>

          <section id="crm" className="br30-blog-section">
            <div className="br30-blog-section-label">
              <span>03</span>
              CRM & Customers
            </div>

            <h2>Building stronger customer management workflows</h2>

            <p>Customer relationships are at the center of many businesses. Keeping customer information organized can help teams maintain context, understand previous interactions, and manage future activities more consistently.</p>

            <p>Our CRM-focused content explores customer records, contact management, follow-ups, communication, customer visibility, and practical relationship-management processes.</p>

            <div className="br30-blog-category-grid">
              <div className="br30-blog-category-card">
                <div className="br30-blog-category-icon">
                  <Users size={15} />
                </div>

                <h3>Customer Management</h3>

                <p>Organize customer information and create clearer workflows around important relationships.</p>
              </div>

              <div className="br30-blog-category-card">
                <div className="br30-blog-category-icon">
                  <MessageSquare size={15} />
                </div>

                <h3>Customer Communication</h3>

                <p>Create consistent processes for conversations, follow-ups, activities, and customer interactions.</p>
              </div>
            </div>
          </section>

          <section id="sales" className="br30-blog-section">
            <div className="br30-blog-section-label">
              <span>04</span>
              Sales & Growth
            </div>

            <h2>Making sales workflows easier to understand</h2>

            <p>Sales teams often work across leads, opportunities, customer conversations, follow-ups, activities, and targets. A structured process can make these moving parts easier to manage.</p>

            <p>Our sales content focuses on practical workflow design, customer follow-up, opportunity visibility, sales organization, and the relationship between information and action.</p>

            <ul>
              <li>Creating consistent lead and opportunity workflows.</li>
              <li>Organizing follow-ups and sales activities.</li>
              <li>Improving visibility across customer opportunities.</li>
              <li>Connecting customer information with sales actions.</li>
              <li>Building repeatable processes for growing teams.</li>
            </ul>
          </section>

          <section id="operations" className="br30-blog-section">
            <div className="br30-blog-section-label">
              <span>05</span>
              Operations
            </div>

            <h2>Creating more organized business operations</h2>

            <p>Business operations involve many activities that may not fit neatly inside a traditional sales process. Tasks, responsibilities, internal workflows, records, approvals, and operational information all contribute to how a business runs.</p>

            <p>We explore ways businesses can structure everyday processes so that important work remains visible and easier for teams to coordinate.</p>

            <div className="br30-blog-category-grid">
              <div className="br30-blog-category-card">
                <div className="br30-blog-category-icon">
                  <Workflow size={15} />
                </div>

                <h3>Workflow Design</h3>

                <p>Turn repetitive business activities into clearer and more consistent workflows.</p>
              </div>

              <div className="br30-blog-category-card">
                <div className="br30-blog-category-icon">
                  <Target size={15} />
                </div>

                <h3>Operational Visibility</h3>

                <p>Give teams clearer visibility into responsibilities, activities, and business processes.</p>
              </div>
            </div>
          </section>

          <section id="teams" className="br30-blog-section">
            <div className="br30-blog-section-label">
              <span>06</span>
              Teams & Productivity
            </div>

            <h2>Helping teams work with greater clarity</h2>

            <p>Team productivity is not only about doing more work. It is also about understanding responsibilities, reducing unnecessary duplication, and making important information available to the people who need it.</p>

            <p>Our content explores collaboration, role-based workflows, productivity systems, task management, internal visibility, and practical ways teams can create more consistent processes.</p>

            <div className="br30-blog-note">
              <strong>Key idea:</strong> Better visibility can help teams understand what is happening, what needs attention, and who is responsible for the next step.
            </div>
          </section>

          <section id="technology" className="br30-blog-section">
            <div className="br30-blog-section-label">
              <span>07</span>
              Technology
            </div>

            <h2>Technology behind modern business platforms</h2>

            <p>Modern business software depends on more than a good interface. Reliability, security, authentication, access controls, data management, integrations, and system performance all contribute to the overall experience.</p>

            <p>Our technology-focused content looks at these areas from a practical business perspective, helping teams understand why these foundations matter when selecting and using business software.</p>

            <ul>
              <li>Security and responsible access management.</li>
              <li>Reliable business information systems.</li>
              <li>Authentication and account protection.</li>
              <li>Integrations between business tools.</li>
              <li>Technology decisions for growing organizations.</li>
            </ul>
          </section>

          <section id="insights" className="br30-blog-section">
            <div className="br30-blog-section-label">
              <span>08</span>
              Business Insights
            </div>

            <h2>Turning information into better business decisions</h2>

            <p>Business information becomes more valuable when it can support meaningful decisions. Customer activity, sales information, operational records, team activities, and workflow data can help businesses understand what is happening across their operations.</p>

            <p>We share ideas about organizing information, improving visibility, creating useful processes, and using business systems to support better day-to-day decisions.</p>
          </section>

          <section id="resources" className="br30-blog-section">
            <div className="br30-blog-section-label">
              <span>09</span>
              Resources
            </div>

            <h2>Explore the wider BR30 CRM knowledge ecosystem</h2>

            <p>The blog is one part of the BR30 CRM resource ecosystem. Teams can also explore product information, documentation, support resources, security information, and frequently asked questions.</p>

            <div className="br30-blog-resource-grid">
              <div className="br30-blog-resource-card">
                <BookOpen size={17} />

                <h3>Documentation</h3>

                <p>Learn about platform functionality, workflows, and product capabilities.</p>

                <Link to="/documentation">
                  Explore <ArrowRight size={11} />
                </Link>
              </div>

              <div className="br30-blog-resource-card">
                <MessageSquare size={17} />

                <h3>Help Center</h3>

                <p>Find practical information for common questions and product usage.</p>

                <Link to="/help">
                  Visit Help Center <ArrowRight size={11} />
                </Link>
              </div>

              <div className="br30-blog-resource-card">
                <ShieldCheck size={17} />

                <h3>Security</h3>

                <p>Understand the security principles and responsible practices behind the platform.</p>

                <Link to="/security">
                  Learn more <ArrowRight size={11} />
                </Link>
              </div>
            </div>
          </section>

          <section id="contact" className="br30-blog-section">
            <div className="br30-blog-section-label">
              <span>10</span>
              Suggest a Topic
            </div>

            <h2>Have a business topic you'd like us to cover?</h2>

            <p>Tell us what you are working on, what problem you are trying to solve, or what business topic you would like to understand better. Your suggestion can help shape future educational content.</p>

            <div className="br30-blog-contact-card">
              <div className="br30-blog-contact-icon">
                <Mail size={16} />
              </div>

              <div>
                <strong>BR30 CRM Content & Support</strong>

                <a href={COMPANY_BLOG_SUPPORT_FORM_URL} className="br30-support-ticket-link" rel="noopener noreferrer">
                  Create Support Ticket
                </a>
              </div>
            </div>
          </section>

          <div className="br30-blog-search">
            <Search size={15} />

            <input type="text" placeholder="Search articles by topic, category or keyword..." value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} aria-label="Search blog articles" />

            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery("")} aria-label="Clear search" title="Clear search">
                <X size={14} />
              </button>
            )}
          </div>

          <section className="br30-blog-section">
            <div className="br30-blog-section-label">
              <span>11</span>
              Latest Articles
            </div>

            <h2>
              Explore BR30 CRM articles
              {searchQuery ? ` for "${searchQuery}"` : ""}
            </h2>

            <p>Browse practical articles covering CRM, sales, operations, teams, productivity, technology, and business growth.</p>

            {filteredPosts.length > 0 ? (
              <div className="br30-blog-grid">
                {filteredPosts.map((post) => {
                  const Icon = post.icon;

                  return (
                    <article className="br30-blog-card" key={`${post.category}-${post.title}`}>
                      <div className="br30-blog-card-label">
                        <Icon size={12} />
                        {post.category}
                      </div>

                      <h2>{post.title}</h2>

                      <p>{post.text}</p>

                      <div className="br30-blog-card-bottom">
                        <span className="br30-blog-time">
                          <Clock3 size={11} />
                          {post.time}
                        </span>

                        <a
                          href="#featured"
                          className="br30-blog-read"
                          onClick={(event) => {
                            event.preventDefault();
                            scrollToSection("featured");
                          }}>
                          Explore <ArrowRight size={12} />
                        </a>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="br30-blog-intro-card">
                <div className="br30-blog-intro-top">
                  <div className="br30-blog-intro-icon">
                    <Search size={18} />
                  </div>

                  <div>
                    <h2>No articles found</h2>
                    <p>Try another keyword such as CRM, sales, operations, productivity, customers, or technology.</p>
                  </div>
                </div>
              </div>
            )}
          </section>

          <div className="br30-blog-cta">
            <div>
              <h2>Have a topic you'd like us to cover?</h2>

              <p>Send us your question or business challenge and tell us what you'd like to learn more about.</p>
            </div>

            <a href={COMPANY_BLOG_SUPPORT_FORM_URL} className="br30-blog-button" rel="noopener noreferrer">
              <Ticket size={13} />
              Create Support Ticket
            </a>
          </div>
        </article>
      </main>

      <button type="button" className="br30-blog-top-button" onClick={handleBackToTop} aria-label="Back to top" title="Back to top">
        <ArrowRight size={16} style={{ transform: "rotate(-90deg)" }} />
      </button>

      <LandingFooter />
    </div>
  );
}

export default Blog;
