import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    description: "Essential CRM tools for individuals and small teams.",
    price: "₹0",
    label: "Forever",
    features: ["Core CRM workspace", "Lead management", "Contacts & companies", "Tasks & activities"],
  },
  {
    name: "Professional",
    description: "Advanced tools for growing teams and sales operations.",
    price: "₹999",
    label: "User/month",
    popular: true,
    features: ["Everything in Starter", "Deal management", "Sales pipelines", "Reports & analytics", "Team workspace"],
  },
  {
    name: "Business",
    description: "Flexible CRM solutions for businesses with advanced needs.",
    price: "Custom",
    label: "Let's talk",
    features: ["Everything in Professional", "Advanced workflows", "Custom requirements", "Priority support", "Future integrations"],
  },
];

function PricingSection() {
  return (
    <>
      <style>{`html,body,#root{margin:0;min-height:100%;background:var(--crm-bg);color:var(--crm-text)}.lp-pricing{padding:100px 24px;background:var(--crm-bg)}.lp-pricing-inner{max-width:1100px;margin:auto}.lp-pricing-head{text-align:center;max-width:650px;margin:0 auto 48px}.lp-pricing-head h2{margin:12px 0 14px;font-size:clamp(30px,4vw,45px);line-height:1.08;letter-spacing:-2px;color:var(--crm-text);font-weight:400}.lp-pricing-head p{margin:0;color:var(--crm-muted);font-size:15px;line-height:1.7;font-weight:400}.lp-price-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;align-items:stretch}.lp-price-card{position:relative;padding:29px;border:1px solid color-mix(in srgb,var(--crm-primary) 30%,var(--crm-border));border-radius:17px;background:var(--crm-surface-2);transition:transform .22s ease,border-color .22s ease,box-shadow .22s ease,background .22s ease}.lp-price-card:hover{transform:translateY(-4px);border-color:var(--crm-border);background:var(--crm-surface);box-shadow:0 8px 24px color-mix(in srgb,var(--crm-primary) 10%,transparent)}.lp-price-card.popular{border-color:var(--crm-primary);box-shadow:0 15px 45px color-mix(in srgb,var(--crm-primary) 10%,transparent)}.lp-price-card.popular:hover{border-color:var(--crm-primary);background:var(--crm-surface);box-shadow:0 10px 30px color-mix(in srgb,var(--crm-primary) 10%,transparent)}.lp-popular{position:absolute;top:15px;right:15px;padding:5px 8px;border-radius:999px;background:var(--crm-primary);color:#fff;font-size:13px;font-weight:400;text-transform:uppercase;letter-spacing:.08em}.lp-price-name{font-size:15px;font-weight:400;color:var(--crm-text)}.lp-price-description{min-height:38px;margin-top:8px;color:var(--crm-muted);font-size:13px;line-height:1.55}.lp-price{margin:23px 0;font-size:31px;font-weight:400;letter-spacing:-1.5px;color:var(--crm-text)}.lp-price small{font-size:13px;font-weight:400;color:var(--crm-muted);letter-spacing:0}.lp-price-btn{height:42px;width:100%;border-radius:10px;text-decoration:none;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:400;border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);transition:background .2s ease,border-color .2s ease,color .2s ease,transform .2s ease}.lp-price-btn:hover{background:var(--crm-primary);border-color:var(--crm-primary);color:#fff;transform:translateY(-1px)}.lp-price-card.popular .lp-price-btn{background:var(--crm-primary);border-color:var(--crm-primary);color:#fff}.lp-price-card.popular .lp-price-btn:hover{background:var(--crm-primary-hover);border-color:var(--crm-primary-hover)}.lp-price-features{margin-top:23px;padding-top:21px;border-top:1px solid var(--crm-border);display:flex;flex-direction:column;gap:11px}.lp-price-feature{display:flex;align-items:flex-start;gap:8px;color:var(--crm-muted);font-size:13px;line-height:1.4}.lp-price-feature svg{color:var(--crm-success);flex:none;margin-top:1px}@media(max-width:800px){.lp-price-grid{grid-template-columns:1fr;max-width:480px;margin:auto}}@media(max-width:500px){.lp-pricing{padding:70px 18px}.lp-pricing-head{margin-bottom:36px}.lp-pricing-head h2{font-size:32px;letter-spacing:-1.5px}.lp-pricing-head p{font-size:14px}.lp-price-card{padding:24px}}`}</style>
      <section className="lp-pricing" id="pricing">
        <div className="lp-pricing-inner">
          <div className="lp-pricing-head">
            <div className="lp-eyebrow">Simple pricing</div>

            <h2>Choose a plan that fits your business.</h2>

            <p>Start with the essentials and move to a more powerful CRM workspace as your team and business grow.</p>
          </div>

          <div className="lp-price-grid">
            {plans.map((plan) => (
              <article className={`lp-price-card${plan.popular ? " popular" : ""}`} key={plan.name}>
                {plan.popular && <span className="lp-popular">Popular</span>}

                <div className="lp-price-name">{plan.name}</div>

                <div className="lp-price-description">{plan.description}</div>

                <div className="lp-price">
                  {plan.price} <small>{plan.label}</small>
                </div>

                <a href="/login" className="lp-price-btn">
                  {plan.name === "Business" ? "Contact Sales" : "Get Started"}
                </a>

                <div className="lp-price-features">
                  {plan.features.map((feature) => (
                    <div className="lp-price-feature" key={feature}>
                      <Check size={13} />
                      {feature}
                    </div>
                  ))}
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
