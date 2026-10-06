import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight, HelpCircle, Mail, Search, ShieldCheck, ArrowUp } from "lucide-react";
import LandingNavbar from "../../components/landing/LandingNavbar";
import LandingFooter from "../../components/landing/LandingFooter";
import { RESOURCES_FAQ_SUPPORT_FORM_URL } from "../../constants/supportForm";

function FAQ() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [openId, setOpenId] = useState(null);

  const categories = ["All", "Account", "Security", "Platform", "Billing", "Support"];

  const faqs = [
    {
      id: 1,
      category: "Account",
      question: "What is BR30 CRM?",
      answer: "BR30 CRM is a modern business workspace designed to help businesses manage customers, sales activities, teams, business information, and everyday operational workflows from one centralized platform.",
    },
    {
      id: 2,
      category: "Account",
      question: "How do I create a BR30 CRM account?",
      answer: "You can create an account through the BR30 CRM registration page. During registration, you may be asked to provide information such as your name, email address, phone number, and password. Additional verification may be required before your account becomes fully active.",
    },
    {
      id: 3,
      category: "Account",
      question: "Do I need to verify my email address?",
      answer: "Email verification may be required to confirm ownership of your email address and help protect your account. If verification is required, BR30 CRM will provide instructions during the registration or account recovery process.",
    },
    {
      id: 4,
      category: "Account",
      question: "I forgot my password. How can I reset it?",
      answer: "Use the Forgot Password option on the login page. Enter the email address associated with your account and follow the verification instructions. A reset verification code may be sent to your registered email address before you can create a new password.",
    },
    {
      id: 5,
      category: "Platform",
      question: "What can I manage with BR30 CRM?",
      answer: "Depending on your account and enabled features, BR30 CRM can help manage customer records, contacts, leads, sales activities, tasks, notes, teams, business workflows, and related operational information.",
    },
    {
      id: 6,
      category: "Platform",
      question: "Can multiple team members use BR30 CRM?",
      answer: "Yes. BR30 CRM is designed to support business teams. Access and available functionality may depend on the user's assigned role, permissions, account configuration, and features enabled for the organization.",
    },
    {
      id: 7,
      category: "Platform",
      question: "Does BR30 CRM support different user roles?",
      answer: "BR30 CRM can use role-based access controls to help organizations manage what different users can access. Available roles and permissions may vary depending on the account configuration and platform features.",
    },
    {
      id: 8,
      category: "Security",
      question: "How does BR30 CRM protect my account?",
      answer: "BR30 CRM uses account authentication, access controls, session security, protected communication channels where appropriate, and operational security measures designed to reduce unauthorized access and protect account information.",
    },
    {
      id: 9,
      category: "Security",
      question: "Is my business data private?",
      answer: "BR30 CRM is designed to handle business information responsibly. Access to information may depend on account permissions, user roles, platform functionality, operational requirements, third-party service providers, and applicable legal obligations.",
    },
    {
      id: 10,
      category: "Security",
      question: "Does BR30 CRM share my information?",
      answer:
        "Information may be shared with service providers when necessary to operate the platform, provide requested services, maintain infrastructure, process communications or payments, improve security, or comply with applicable legal requirements. Further details are available in the Privacy Policy.",
    },
    {
      id: 11,
      category: "Billing",
      question: "How does billing work?",
      answer: "Billing depends on the plan, services, and commercial arrangement associated with your BR30 CRM account. Applicable pricing, payment terms, renewal conditions, and related information may be presented during purchase or subscription management.",
    },
    {
      id: 12,
      category: "Billing",
      question: "Can I request a refund?",
      answer: "Refund eligibility depends on the applicable purchase, subscription terms, payment status, and Refund Policy. If you have a billing concern, contact BR30 CRM support with the relevant account or transaction information.",
    },
    {
      id: 13,
      category: "Support",
      question: "How can I contact BR30 CRM support?",
      answer: "You can contact BR30 CRM support using the Contact page or the support email associated with the service. When contacting support, providing your registered email address and a clear description of the issue can help us understand your request.",
    },
    {
      id: 14,
      category: "Support",
      question: "How do I report a security concern?",
      answer: "If you believe you have identified a security issue involving BR30 CRM, please contact the appropriate BR30 CRM support or security contact with relevant details. Avoid sharing passwords, authentication codes, or other sensitive credentials.",
    },
    {
      id: 15,
      category: "Security",
      question: "Where can I read about BR30 CRM's privacy practices?",
      answer: "You can review the BR30 CRM Privacy Policy for information about how information may be collected, used, stored, protected, retained, and disclosed. The policy also explains applicable privacy choices and rights.",
    },
    {
      id: 16,
      category: "Support",
      question: "Where can I find additional legal and compliance information?",
      answer: "BR30 CRM provides dedicated pages for Privacy Policy, Terms of Service, Cookie Policy, Refund Policy, Data Processing, GDPR & Compliance, Security, and Trust Center information. These pages provide additional details about the platform and its policies.",
    },
  ];

  const filteredFaqs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return faqs.filter((faq) => {
      const categoryMatch = activeCategory === "All" || faq.category === activeCategory;
      const searchMatch = !query || faq.question.toLowerCase().includes(query) || faq.answer.toLowerCase().includes(query) || faq.category.toLowerCase().includes(query);

      return categoryMatch && searchMatch;
    });
  }, [search, activeCategory]);

  const toggleFaq = (id) => {
    setOpenId((current) => (current === id ? null : id));
  };

  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="br30-faq-page">
      <style>{`.br30-faq-page{min-height:100vh;background:var(--crm-bg);color:var(--crm-text);font-family:var(--crm-font)}.br30-faq-page *,.br30-faq-page *::before,.br30-faq-page *::after{box-sizing:border-box}.br30-faq-hero{padding:142px 24px 58px;border-bottom:1px solid var(--crm-border);background:var(--crm-bg)}.br30-faq-hero-inner{width:100%;max-width:1120px;margin:0 auto}.br30-faq-breadcrumb{display:flex;align-items:center;gap:6px;margin-bottom:24px;color:var(--crm-muted);font-size:13px}.br30-faq-breadcrumb a{color:var(--crm-muted);text-decoration:none}.br30-faq-breadcrumb a:hover{color:var(--crm-primary)}.br30-faq-breadcrumb svg{opacity:.5}.br30-faq-eyebrow{display:inline-flex;align-items:center;gap:7px;color:var(--crm-primary);font-size:13px;font-weight:400;letter-spacing:.08em;text-transform:uppercase}.br30-faq-eyebrow-dot{width:6px;height:6px;border-radius:50%;background:var(--crm-primary)}.br30-faq-hero h1{margin:16px 0 14px;color:var(--crm-text);font-size:clamp(32px,4vw,48px);line-height:1.12;letter-spacing:-.025em;font-weight:400}.br30-faq-hero h1 span{color:var(--crm-primary)}.br30-faq-hero-description{max-width:760px;margin:0;color:var(--crm-muted);font-size:14px;line-height:1.75}.br30-faq-meta{display:flex;flex-wrap:wrap;gap:8px;margin-top:25px}.br30-faq-meta-item{display:flex;align-items:center;gap:7px;min-height:35px;padding:7px 11px;border:1px solid var(--crm-border);border-radius:9px;background:var(--crm-surface);color:var(--crm-muted);font-size:13px}.br30-faq-meta-item svg{color:var(--crm-primary)}.br30-faq-meta-item strong{color:var(--crm-text);font-weight:400}.br30-faq-main{width:100%;max-width:1120px;margin:0 auto;padding:52px 24px 80px;display:grid;grid-template-columns:235px minmax(0,1fr);gap:50px;align-items:start}.br30-faq-sidebar{position:sticky;top:100px;padding:7px;border:1px solid var(--crm-border);border-radius:13px;background:var(--crm-surface);box-shadow:var(--crm-shadow)}.br30-faq-sidebar-title{padding:9px 10px 11px;color:var(--crm-text);font-size:13px;font-weight:400;letter-spacing:.06em;text-transform:uppercase}.br30-faq-category-list{display:flex;flex-direction:column;gap:2px}.br30-faq-category-btn{width:100%;display:flex;align-items:center;justify-content:space-between;padding:9px;border:0;border-radius:8px;background:transparent;color:var(--crm-muted);font:inherit;font-size:13px;text-align:left;cursor:pointer}.br30-faq-category-btn:hover{background:var(--crm-surface-2);color:var(--crm-text)}.br30-faq-category-btn.active{background:var(--crm-primary-soft);color:var(--crm-primary);font-weight:400}.br30-faq-category-count{min-width:20px;padding:2px 5px;border-radius:5px;background:var(--crm-surface-2);font-size:13px;text-align:center}.br30-faq-category-btn.active .br30-faq-category-count{background:var(--crm-surface);color:var(--crm-primary)}.br30-faq-content{min-width:0}.br30-faq-intro-card{margin-bottom:25px;padding:21px;border:1px solid var(--crm-border);border-radius:13px;background:var(--crm-surface);box-shadow:var(--crm-shadow)}.br30-faq-intro-top{display:flex;align-items:flex-start;gap:13px}.br30-faq-intro-icon{width:38px;height:38px;flex:0 0 38px;display:grid;place-items:center;border-radius:9px;background:var(--crm-primary-soft);border:1px solid var(--crm-border);color:var(--crm-primary)}.br30-faq-intro-card h2{margin:0 0 5px;color:var(--crm-text);font-size:15px;font-weight:400;line-height:1.4}.br30-faq-intro-card p{margin:0;color:var(--crm-muted);font-size:13px;line-height:1.75}.br30-faq-search{position:relative;margin-bottom:14px}.br30-faq-search-icon{position:absolute;left:13px;top:50%;transform:translateY(-50%);color:var(--crm-muted);pointer-events:none}.br30-faq-search input{width:100%;height:42px;padding:0 14px 0 38px;border:1px solid var(--crm-border);border-radius:10px;background:var(--crm-surface);color:var(--crm-text);font:inherit;font-size:13px;outline:none;transition:.2s}.br30-faq-search input::placeholder{color:var(--crm-muted)}.br30-faq-search input:focus{border-color:var(--crm-primary);box-shadow:0 0 0 3px var(--crm-primary-soft)}.br30-faq-results{margin:0 0 12px;color:var(--crm-muted);font-size:13px}.br30-faq-list{display:flex;flex-direction:column;gap:9px}.br30-faq-item{border:1px solid var(--crm-border);border-radius:11px;background:var(--crm-surface);overflow:hidden;transition:.2s}.br30-faq-item:hover{border-color:color-mix(in srgb,var(--crm-primary) 25%,var(--crm-border))}.br30-faq-question{width:100%;display:flex;align-items:center;justify-content:space-between;gap:15px;padding:16px 17px;border:0;background:transparent;color:var(--crm-text);font:inherit;font-size:13px;font-weight:400;text-align:left;cursor:pointer}.br30-faq-question-left{display:flex;align-items:flex-start;gap:11px}.br30-faq-number{min-width:25px;color:var(--crm-primary);font-size:13px;font-weight:400;padding-top:2px}.br30-faq-question-icon{width:26px;height:26px;flex:0 0 26px;display:grid;place-items:center;border:1px solid var(--crm-border);border-radius:7px;color:var(--crm-muted);transition:.2s}.br30-faq-item.open .br30-faq-question-icon{background:var(--crm-primary-soft);border-color:var(--crm-border);color:var(--crm-primary);transform:rotate(180deg)}.br30-faq-answer{padding:0 17px 17px 53px;color:var(--crm-muted);font-size:13px;line-height:1.8}.br30-faq-answer p{margin:0}.br30-faq-tag{display:inline-flex;margin-bottom:8px;padding:3px 7px;border-radius:5px;background:var(--crm-primary-soft);color:var(--crm-primary);font-size:13px;font-weight:400;text-transform:uppercase;letter-spacing:.06em}.br30-faq-empty{padding:35px 20px;border:1px solid var(--crm-border);border-radius:11px;background:var(--crm-surface);text-align:center}.br30-faq-empty-icon{width:38px;height:38px;margin:0 auto 10px;display:grid;place-items:center;border-radius:9px;background:var(--crm-primary-soft);color:var(--crm-primary)}.br30-faq-empty h3{margin:0 0 5px;color:var(--crm-text);font-size:13px}.br30-faq-empty p{margin:0;color:var(--crm-muted);font-size:13px}.br30-faq-contact{display:flex;align-items:center;justify-content:space-between;gap:20px;margin-top:28px;padding:19px;border:1px solid var(--crm-border);border-radius:12px;background:var(--crm-surface);box-shadow:var(--crm-shadow)}.br30-faq-contact-info{display:flex;align-items:center;gap:12px}.br30-faq-contact-icon{width:37px;height:37px;display:grid;place-items:center;border-radius:9px;background:var(--crm-primary-soft);color:var(--crm-primary)}.br30-faq-contact strong{display:block;margin-bottom:3px;color:var(--crm-text);font-size:13px}.br30-faq-contact p{margin:0;color:var(--crm-muted);font-size:13px}.br30-faq-contact-link{display:inline-flex;align-items:center;gap:6px;padding:9px 12px;border:1px solid var(--crm-border);border-radius:8px;background:var(--crm-surface-2);color:var(--crm-primary);font-size:13px;font-weight:400;text-decoration:none;white-space:nowrap}.br30-faq-contact-link:hover{border-color:var(--crm-primary)}.br30-faq-top-button{position:fixed;right:20px;bottom:20px;z-index:30;width:38px;height:38px;display:grid;place-items:center;border:1px solid var(--crm-border);border-radius:10px;background:var(--crm-surface);color:var(--crm-text);box-shadow:var(--crm-shadow);cursor:pointer;transition:.2s}.br30-faq-top-button:hover{border-color:var(--crm-primary);color:var(--crm-primary);transform:translateY(-2px)}@media(max-width:900px){.br30-faq-main{grid-template-columns:1fr;gap:25px}.br30-faq-sidebar{position:relative;top:auto}.br30-faq-category-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:600px){.br30-faq-hero{padding:120px 17px 45px}.br30-faq-hero h1{font-size:34px}.br30-faq-hero-description{font-size:13px}.br30-faq-meta{display:grid;grid-template-columns:1fr}.br30-faq-main{padding:35px 17px 60px}.br30-faq-category-list{grid-template-columns:1fr}.br30-faq-intro-card{padding:18px}.br30-faq-question{padding:14px}.br30-faq-answer{padding:0 14px 15px 50px;font-size:13px}.br30-faq-contact{align-items:flex-start;flex-direction:column}.br30-faq-contact-link{width:100%;justify-content:center}.br30-faq-top-button{right:13px;bottom:13px}}`}</style>

      <LandingNavbar />

      <header className="br30-faq-hero">
        <div className="br30-faq-hero-inner">
          <div className="br30-faq-breadcrumb">
            <Link to="/">Home</Link>
            <ChevronRight size={13} />
            <span>Resources</span>
            <ChevronRight size={13} />
            <span>FAQ</span>
          </div>

          <div className="br30-faq-eyebrow">
            <span className="br30-faq-eyebrow-dot" />
            BR30 CRM Resources
          </div>

          <h1>
            Frequently Asked <span>Questions</span>
          </h1>

          <p className="br30-faq-hero-description">Find clear answers about BR30 CRM accounts, platform functionality, security, billing, privacy, and support.</p>

          <div className="br30-faq-meta">
            <div className="br30-faq-meta-item">
              <HelpCircle size={14} />
              <span>
                Questions <strong>16</strong>
              </span>
            </div>

            <div className="br30-faq-meta-item">
              <ShieldCheck size={14} />
              <span>
                Security <strong>Protected</strong>
              </span>
            </div>

            <div className="br30-faq-meta-item">
              <Mail size={14} />
              <span>
                Support <strong>Available</strong>
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="br30-faq-main">
        <aside className="br30-faq-sidebar">
          <div className="br30-faq-sidebar-title">FAQ Categories</div>

          <div className="br30-faq-category-list">
            {categories.map((category) => {
              const count = category === "All" ? faqs.length : faqs.filter((faq) => faq.category === category).length;

              return (
                <button
                  key={category}
                  type="button"
                  className={`br30-faq-category-btn ${activeCategory === category ? "active" : ""}`}
                  onClick={() => {
                    setActiveCategory(category);
                    setOpenId(null);
                  }}>
                  <span>{category}</span>
                  <span className="br30-faq-category-count">{count}</span>
                </button>
              );
            })}
          </div>
        </aside>

        <article className="br30-faq-content">
          <div className="br30-faq-intro-card">
            <div className="br30-faq-intro-top">
              <div className="br30-faq-intro-icon">
                <HelpCircle size={18} />
              </div>

              <div>
                <h2>How can we help?</h2>
                <p>Browse the questions below or search for a specific topic. Answers may vary depending on your account type, enabled features, plan, and applicable service terms.</p>
              </div>
            </div>
          </div>

          <div className="br30-faq-search">
            <Search className="br30-faq-search-icon" size={15} />

            <input
              type="search"
              placeholder="Search questions, security, billing, account..."
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setOpenId(null);
              }}
            />
          </div>

          <div className="br30-faq-results">
            Showing {filteredFaqs.length} of {faqs.length} questions
          </div>

          {filteredFaqs.length > 0 ? (
            <div className="br30-faq-list">
              {filteredFaqs.map((faq) => {
                const isOpen = openId === faq.id;

                return (
                  <div key={faq.id} className={`br30-faq-item ${isOpen ? "open" : ""}`}>
                    <button type="button" className="br30-faq-question" onClick={() => toggleFaq(faq.id)} aria-expanded={isOpen}>
                      <span className="br30-faq-question-left">
                        <span className="br30-faq-number">{String(faq.id).padStart(2, "0")}</span>

                        <span>{faq.question}</span>
                      </span>

                      <span className="br30-faq-question-icon">
                        <ChevronDown size={14} />
                      </span>
                    </button>

                    {isOpen && (
                      <div className="br30-faq-answer">
                        <span className="br30-faq-tag">{faq.category}</span>
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="br30-faq-empty">
              <div className="br30-faq-empty-icon">
                <Search size={17} />
              </div>

              <h3>No matching questions</h3>

              <p>Try a different keyword or select another FAQ category.</p>
            </div>
          )}

          <div className="br30-faq-contact">
            <div className="br30-faq-contact-info">
              <div className="br30-faq-contact-icon">
                <Mail size={16} />
              </div>

              <div>
                <strong>Still need help?</strong>
                <p>Contact BR30 CRM support for account or service-related questions.</p>
              </div>
            </div>

            <a href={RESOURCES_FAQ_SUPPORT_FORM_URL} rel="noopener noreferrer" className="br30-faq-contact-link">
              Create Support Ticket
              <ChevronRight size={13} />
            </a>
          </div>
        </article>
      </main>

      <button type="button" className="br30-faq-top-button" onClick={handleBackToTop} aria-label="Back to top" title="Back to top">
        <ArrowUp size={16} />
      </button>

      <LandingFooter />
    </div>
  );
}

export default FAQ;
