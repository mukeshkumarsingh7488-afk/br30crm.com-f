import { ArrowRight, Check, Minus } from "lucide-react";

const plans = [
  {
    name: "Starter",
    eyebrow: "For individuals",
    description: "Everything you need to organize customers, manage leads, and run your sales workflow.",
    price: "₹499",
    label: "/user/month",
    cta: "Get Started",
    tone: "free",
    features: [
      "Core CRM workspace",
      "Dashboard overview",
      "Lead management",
      "Contacts management",
      "Companies management",
      "Deals & opportunities",
      "Sales pipelines & stages",
      "Tasks & activities",
      "Meetings & calendar",
      "Tags & custom fields",
      "Basic reports & analytics",
      "Team & member workspace",
      "Notifications",
    ],
  },
  {
    name: "Professional",
    eyebrow: "For growing teams",
    description: "Everything your growing sales team needs to manage work, pipelines and operations.",
    price: "₹999",
    label: "/user/month",
    trial: "14-Day Free Trial",
    cta: "Start Free Trial",
    popular: true,
    tone: "professional",
    features: [
      "Everything in Starter",
      "Advanced leads & lead reports",
      "Advanced contacts & companies",
      "Deal management & deal reports",
      "Multiple sales pipelines",
      "Advanced reports & sales analytics",
      "Meetings & calendar management",
      "Automation & workflow builder",
      "Webhooks",
      "Forms & public links",
      "QR & lead capture tools",
      "Sources & campaigns",
      "Templates",
      "Communication history",
      "Team management & assignments",
      "Roles, permissions & access control",
      "Audit & activity visibility",
      "Integrations",
      "API keys & business settings",
    ],
    excluded: ["Email sending", "SMS sending", "WhatsApp messaging", "Customer call support", "WhatsApp video call support"],
  },
  {
    name: "Business",
    eyebrow: "For established businesses",
    description: "A complete CRM workspace with communication and support capabilities for your business.",
    price: "Custom",
    label: "Let's talk",
    cta: "Contact Sales",
    tone: "business",
    features: ["Everything in Professional", "Email sending", "SMS sending", "WhatsApp messaging", "Customer call support", "WhatsApp video call support", "Business-specific requirements", "Advanced communication workflows", "Priority business support", "Custom integrations & future requirements"],
  },
];

function PricingSection() {
  return (
    <>
      <style>{`html,body,#root{margin:0;min-height:100%;background:var(--crm-bg);color:var(--crm-text)}.lp-pricing{padding:104px 24px 112px;background:var(--crm-bg)}.lp-pricing-inner{max-width:1180px;margin:auto}.lp-pricing-head{text-align:center;max-width:720px;margin:0 auto 52px}.lp-pricing-head h2{margin:12px 0 14px;font-size:clamp(32px,4.5vw,48px);line-height:1.08;letter-spacing:-2.2px;color:var(--crm-text);font-weight:400}.lp-pricing-head p{margin:0;color:var(--crm-muted);font-size:15px;line-height:1.75;font-weight:400}.lp-pricing-note{display:inline-flex;align-items:center;gap:7px;margin-top:16px;padding:7px 11px;border:1px solid var(--crm-border);border-radius:999px;color:var(--crm-muted);font-size:12px;background:var(--crm-surface)}.lp-price-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;align-items:stretch}.lp-price-card{position:relative;display:flex;flex-direction:column;min-width:0;height:100%;box-sizing:border-box;padding:30px;border:1px solid var(--crm-border);border-radius:20px;background:var(--crm-surface-2);transition:transform .22s ease,border-color .22s ease,box-shadow .22s ease,background .22s ease}.lp-price-card:hover{transform:translateY(-5px);border-color:color-mix(in srgb,var(--crm-primary) 45%,var(--crm-border));background:var(--crm-surface);box-shadow:0 16px 38px color-mix(in srgb,var(--crm-primary) 9%,transparent)}.lp-price-card.popular{border-color:var(--crm-primary);box-shadow:0 16px 42px color-mix(in srgb,var(--crm-primary) 12%,transparent)}.lp-price-card.popular:hover{border-color:var(--crm-primary);box-shadow:0 20px 48px color-mix(in srgb,var(--crm-primary) 15%,transparent)}.lp-popular{position:absolute;top:17px;right:17px;padding:6px 9px;border-radius:999px;background:var(--crm-primary);color:#fff;font-size:11px;font-weight:500;text-transform:uppercase;letter-spacing:.08em}.lp-price-top{min-height:132px;padding-right:72px}.lp-price-eyebrow{margin-bottom:9px;color:var(--crm-primary);font-size:11px;font-weight:500;letter-spacing:.08em;text-transform:uppercase}.lp-price-name{font-size:20px;line-height:1.25;font-weight:500;color:var(--crm-text)}.lp-price-description{margin-top:9px;color:var(--crm-muted);font-size:13px;line-height:1.6}.lp-price{display:flex;align-items:baseline;gap:7px;min-height:48px;margin:23px 0 19px;font-size:34px;font-weight:500;letter-spacing:-1.7px;color:var(--crm-text)}.lp-price small{font-size:12px;font-weight:400;color:var(--crm-muted);letter-spacing:0}.lp-price-trial{margin:-8px 0 16px;color:var(--crm-primary);font-size:11px;font-weight:500;line-height:1.4}.lp-price-btn{height:44px;width:100%;box-sizing:border-box;border-radius:11px;text-decoration:none;display:flex;align-items:center;justify-content:center;gap:7px;font-size:13px;font-weight:500;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);transition:background .2s ease,border-color .2s ease,color .2s ease,transform .2s ease}.lp-price-btn:hover{background:var(--crm-primary);border-color:var(--crm-primary);color:#fff;transform:translateY(-1px)}.lp-price-card.popular .lp-price-btn{background:var(--crm-primary);border-color:var(--crm-primary);color:#fff}.lp-price-card.popular .lp-price-btn:hover{background:var(--crm-primary-hover);border-color:var(--crm-primary-hover)}.lp-price-features{flex:1;margin-top:24px;padding-top:22px;border-top:1px solid var(--crm-border);display:flex;flex-direction:column;gap:10px}.lp-feature-heading{margin-bottom:2px;color:var(--crm-text);font-size:12px;font-weight:500}.lp-price-feature{display:flex;align-items:flex-start;gap:9px;color:var(--crm-muted);font-size:12.5px;line-height:1.45}.lp-price-feature svg{color:var(--crm-success);flex:none;margin-top:2px}.lp-price-excluded{margin-top:17px;padding-top:17px;border-top:1px dashed var(--crm-border);display:flex;flex-direction:column;gap:8px}.lp-price-excluded .lp-price-feature{color:color-mix(in srgb,var(--crm-muted) 80%,transparent)}.lp-price-excluded .lp-price-feature svg{color:var(--crm-muted)}.lp-price-footer{display:flex;align-items:center;justify-content:center;gap:5px;margin-top:22px;color:var(--crm-muted);font-size:11px}.lp-price-footer svg{color:var(--crm-primary)}@media(max-width:980px){.lp-price-grid{grid-template-columns:1fr;max-width:560px;margin:auto}.lp-price-card{min-height:0}.lp-price-top{min-height:auto}.lp-price-features{flex:none}}@media(max-width:500px){.lp-pricing{padding:76px 18px 84px}.lp-pricing-head{margin-bottom:38px}.lp-pricing-head h2{font-size:32px;letter-spacing:-1.5px}.lp-pricing-head p{font-size:14px}.lp-price-card{padding:24px;border-radius:17px}.lp-popular{top:14px;right:14px}.lp-price-top{padding-right:58px}.lp-price{margin:19px 0 17px;font-size:31px}}`}</style>

      <section className="lp-pricing" id="pricing">
        <div className="lp-pricing-inner">
          <div className="lp-pricing-head">
            <div className="lp-eyebrow">Simple, transparent pricing</div>

            <h2>Choose the CRM workspace that fits your business.</h2>

            <p>Start with the essentials, unlock advanced CRM operations as your team grows, or talk to us for a complete business communication setup.</p>

            <div className="lp-pricing-note">No complicated setup · Upgrade when you are ready</div>
          </div>

          <div className="lp-price-grid">
            {plans.map((plan) => (
              <article className={`lp-price-card${plan.popular ? " popular" : ""}`} key={plan.name}>
                {plan.popular && <span className="lp-popular">Most popular</span>}

                <div className="lp-price-top">
                  <div className="lp-price-eyebrow">{plan.eyebrow}</div>

                  <div className="lp-price-name">{plan.name}</div>

                  <div className="lp-price-description">{plan.description}</div>
                </div>

                <div className="lp-price">
                  {plan.price}

                  <small>{plan.label}</small>
                </div>

                {plan.trial && <div className="lp-price-trial">{plan.trial}</div>}

                <a
                  href={
                    plan.name === "Business"
                      ? "https://br30crm-com-f.vercel.app/public/forms/6ac4a4ce8ab8658ebe3748f7/br30-crm-custom-plan-request?utm_source=br30-crm-custom-plan&utm_medium=website&lead_source=br30-crm-custom-plan&form_id=6ac3e39fcf2cad28844a5a4d&source_id=6ac3e400cf2cad28844a5a4e"
                      : "/register"
                  }
                  className="lp-price-btn">
                  {plan.cta}
                  <ArrowRight size={14} />
                </a>

                <div className="lp-price-features">
                  <div className="lp-feature-heading">What's included</div>

                  {plan.features.map((feature) => (
                    <div className="lp-price-feature" key={feature}>
                      <Check size={13} />

                      <span>{feature}</span>
                    </div>
                  ))}

                  {plan.excluded?.length > 0 && (
                    <div className="lp-price-excluded">
                      <div className="lp-feature-heading">Not included in Professional</div>

                      {plan.excluded.map((feature) => (
                        <div className="lp-price-feature" key={feature}>
                          <Minus size={13} />

                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="lp-price-footer">
                  <Check size={12} />
                  Flexible workspace for your business
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default PricingSection;
