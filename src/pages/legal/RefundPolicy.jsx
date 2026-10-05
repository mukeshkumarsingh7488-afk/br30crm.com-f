import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUp, ChevronRight, CreditCard, FileText, Mail, ShieldCheck, ShoppingBag, UserCheck } from "lucide-react";
import LandingNavbar from "../../components/landing/LandingNavbar";
import LandingFooter from "../../components/landing/LandingFooter";
import { LEGAL_REFUND_POLICY_SUPPORT_FORM_URL } from "../../constants/supportForm";

function RefundPolicy() {
  const [activeSection, setActiveSection] = useState("introduction");

  const sections = [
    { id: "introduction", number: "01", title: "Introduction" },
    { id: "eligibility", number: "02", title: "Refund Eligibility" },
    { id: "non-refundable", number: "03", title: "Non-Refundable Purchases" },
    { id: "digital-services", number: "04", title: "Digital Services" },
    { id: "subscription", number: "05", title: "Subscription & Recurring Payments" },
    { id: "duplicate-payment", number: "06", title: "Duplicate Payments" },
    { id: "payment-issues", number: "07", title: "Payment Issues" },
    { id: "refund-process", number: "08", title: "Refund Process" },
    { id: "refund-timeline", number: "09", title: "Refund Timeline" },
    { id: "chargebacks", number: "10", title: "Chargebacks & Disputes" },
    { id: "account-termination", number: "11", title: "Account Termination" },
    { id: "changes", number: "12", title: "Policy Changes" },
    { id: "contact", number: "13", title: "Contact Us" },
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
            <span>Refund Policy</span>
          </div>

          <div className="br30-legal-eyebrow">
            <span className="br30-legal-eyebrow-dot" />
            BR30 CRM Legal
          </div>

          <h1>
            Refund <span>Policy</span>
          </h1>

          <p className="br30-legal-hero-description">This Refund Policy explains the general conditions under which payments made for BR30 CRM products, services, subscriptions, and other paid offerings may be reviewed, refunded, or otherwise handled.</p>

          <div className="br30-legal-meta">
            <div className="br30-legal-meta-item">
              <CreditCard size={14} />
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
                <ShoppingBag size={18} />
              </div>

              <div>
                <h2>We want payment terms to be clear</h2>

                <p>BR30 CRM aims to provide clear information about paid services, purchases, subscriptions, and applicable refund conditions so customers can understand how payment-related requests are handled.</p>
              </div>
            </div>
          </div>

          <section id="introduction" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>01</span>
              Introduction
            </div>

            <h2>About this Refund Policy</h2>

            <p>This Refund Policy describes the general refund and payment practices applicable to purchases made through BR30 CRM.</p>

            <p>By purchasing or subscribing to a paid BR30 CRM service, you acknowledge that you have reviewed the applicable pricing, product information, subscription terms, and refund conditions.</p>

            <div className="br30-legal-note">
              <strong>Important:</strong> Refund eligibility may depend on the specific product or service purchased, the timing of the request, payment status, service usage, and applicable terms.
            </div>
          </section>

          <section id="eligibility" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>02</span>
              Refund Eligibility
            </div>

            <h2>When a refund may be considered</h2>

            <p>Refund requests may be reviewed when circumstances meet the applicable refund conditions for the purchased product or service.</p>

            <h3>General considerations</h3>

            <ul>
              <li>The payment was successfully completed.</li>
              <li>The request is submitted within the applicable period.</li>
              <li>The purchase is eligible under the applicable service terms.</li>
              <li>The request can be reasonably verified against payment records.</li>
              <li>No applicable exclusion prevents the refund.</li>
            </ul>

            <p>Meeting one or more of these conditions does not automatically guarantee a refund. Each request may be reviewed based on the applicable product and circumstances.</p>
          </section>

          <section id="non-refundable" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>03</span>
              Non-Refundable Purchases
            </div>

            <h2>Purchases that may not qualify</h2>

            <p>Certain purchases may be non-refundable where the applicable product terms clearly state that refunds are unavailable or limited.</p>

            <ul>
              <li>Services that have already been fully delivered.</li>
              <li>Products or services specifically marked as non-refundable.</li>
              <li>Purchases where the applicable refund period has expired.</li>
              <li>Amounts already refunded or otherwise resolved.</li>
              <li>Transactions affected by misuse, fraud, or policy violations.</li>
            </ul>

            <div className="br30-legal-note">
              <strong>Note:</strong> Product-specific terms may provide additional conditions that apply to a particular purchase.
            </div>
          </section>

          <section id="digital-services" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>04</span>
              Digital Services
            </div>

            <h2>Digital products and online services</h2>

            <p>BR30 CRM may provide software functionality, digital features, online services, account access, documentation, or other electronically delivered products.</p>

            <p>Because digital services may become available immediately after payment, refund eligibility for such services may depend on the nature of the purchase, whether access has been used, and the applicable product terms.</p>

            <p>Customers should review product information and applicable terms before completing a purchase.</p>
          </section>

          <section id="subscription" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>05</span>
              Subscription & Recurring Payments
            </div>

            <h2>Subscription billing</h2>

            <p>Where BR30 CRM offers subscription-based services, customers may be charged according to the billing cycle and pricing presented at the time of subscription.</p>

            <p>Customers are responsible for reviewing subscription details, renewal terms, billing frequency, and cancellation requirements before subscribing.</p>

            <p>Cancellation of a subscription does not necessarily create an automatic entitlement to a refund for amounts already charged. Any refund request will be handled according to the applicable subscription terms.</p>
          </section>

          <section id="duplicate-payment" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>06</span>
              Duplicate Payments
            </div>

            <h2>Accidental duplicate transactions</h2>

            <p>If you believe that the same purchase was charged more than once, please contact BR30 CRM support with the relevant transaction information.</p>

            <p>After verification, confirmed duplicate charges may be reviewed for appropriate resolution.</p>

            <div className="br30-legal-note">
              <strong>Payment verification:</strong> Please do not share passwords, authentication codes, or complete card details when contacting support.
            </div>
          </section>

          <section id="payment-issues" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>07</span>
              Payment Issues
            </div>

            <h2>Failed or incomplete payments</h2>

            <p>A payment may sometimes appear pending, failed, reversed, or incomplete because of the payment provider, bank, network, or other technical circumstances.</p>

            <p>If access to a paid service has not been activated after a successful payment, customers should contact support and provide the relevant transaction or order reference.</p>

            <p>BR30 CRM may verify the transaction status with the applicable payment processor before taking further action.</p>
          </section>

          <section id="refund-process" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>08</span>
              Refund Process
            </div>

            <h2>How to request a refund</h2>

            <p>Refund requests should be submitted through the available BR30 CRM support channel using the email address associated with the relevant account whenever possible.</p>

            <h3>Information that may be requested</h3>

            <ul>
              <li>Name associated with the account.</li>
              <li>Account email address.</li>
              <li>Order or transaction reference.</li>
              <li>Purchase date and relevant product or service.</li>
              <li>Reason for the refund request.</li>
            </ul>

            <p>Providing accurate information helps us identify the transaction and review the request efficiently.</p>
          </section>

          <section id="refund-timeline" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>09</span>
              Refund Timeline
            </div>

            <h2>Processing and payment-provider timelines</h2>

            <p>Once a refund is approved, the time required for the amount to appear in the original payment method may depend on the payment processor, bank, card network, or other financial institution.</p>

            <p>BR30 CRM may initiate the refund within its operational processing timeframe, but external processing times are outside our direct control.</p>

            <div className="br30-legal-note">
              <strong>Important:</strong> A refund being processed by BR30 CRM and the refund appearing in a customer's bank or payment account may occur at different times.
            </div>
          </section>

          <section id="chargebacks" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>10</span>
              Chargebacks & Disputes
            </div>

            <h2>Payment disputes</h2>

            <p>Customers are encouraged to contact BR30 CRM support before initiating a payment dispute where the issue can reasonably be resolved through our support process.</p>

            <p>If a chargeback or payment dispute is initiated, BR30 CRM may provide relevant transaction, account, and service information to the applicable payment provider or financial institution as permitted by applicable rules.</p>

            <p>Nothing in this section limits any rights that may be available to customers under applicable law.</p>
          </section>

          <section id="account-termination" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>11</span>
              Account Termination
            </div>

            <h2>Account cancellation and refunds</h2>

            <p>Closing, suspending, or terminating a BR30 CRM account does not automatically create a right to a refund for previous payments.</p>

            <p>Any refund associated with account cancellation will be reviewed according to the applicable product, subscription, and refund terms.</p>

            <p>Customers should review applicable cancellation requirements before ending a paid service.</p>
          </section>

          <section id="changes" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>12</span>
              Policy Changes
            </div>

            <h2>Keeping this Refund Policy current</h2>

            <p>BR30 CRM may update this Refund Policy from time to time to reflect changes in our services, payment processes, products, operational practices, or applicable legal requirements.</p>

            <p>When changes are made, the updated version will be published on the applicable BR30 CRM website or service.</p>

            <p>
              The <strong>Last Updated</strong> date displayed at the beginning of this policy indicates when the policy was most recently revised.
            </p>
          </section>

          <section id="contact" className="br30-legal-section">
            <div className="br30-legal-section-label">
              <span>13</span>
              Contact Us
            </div>

            <h2>Questions about refunds?</h2>

            <p>If you have questions about a payment, refund request, duplicate charge, subscription, or another payment-related matter, please contact BR30 CRM support.</p>

            <div className="br30-legal-contact-card">
              <div className="br30-legal-contact-icon">
                <Mail size={16} />
              </div>

              <div>
                <strong>Refund & Support</strong>

                <a href={LEGAL_REFUND_POLICY_SUPPORT_FORM_URL} className="br30-support-ticket-link" target="_blank" rel="noopener noreferrer">
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

                <p>For account-specific payment or refund requests, please create a support ticket using the email address associated with your BR30 CRM account whenever possible.</p>
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

export default RefundPolicy;
