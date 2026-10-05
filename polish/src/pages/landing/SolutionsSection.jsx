import { BriefcaseBusiness, Headphones, Rocket, ShoppingBag, Store, UsersRound } from "lucide-react";

const solutions = [
  { icon: BriefcaseBusiness, title: "Sales Teams", text: "Give sales teams a clear view of leads, opportunities and follow-ups." },
  { icon: UsersRound, title: "Growing Businesses", text: "Keep customer information and daily operations organized as your business grows." },
  { icon: Headphones, title: "Customer Teams", text: "Give your team the context they need to build better customer relationships." },
  { icon: Rocket, title: "Startups", text: "Start with a simple workspace and build structured processes from day one." },
  { icon: ShoppingBag, title: "Service Businesses", text: "Track prospects, customers, activities and deals without scattered spreadsheets." },
  { icon: Store, title: "Small & Medium Teams", text: "Bring your whole team into one easy-to-understand business workspace." },
];

function SolutionsSection() {
  return (
    <>
      <style>{`
        .lp-solutions{position:relative;isolation:isolate;overflow:hidden;padding:100px 24px;background:var(--crm-bg)}
        .lp-solutions::before{content:none}
        .lp-solutions::after{content:none}
        .lp-solutions-inner{position:relative;z-index:1;max-width:1160px;margin:auto}
        .lp-solutions-head{max-width:680px;margin:0 auto 50px;text-align:center}
        .lp-solutions-head h2{margin:12px 0 14px;font-size:clamp(31px,4vw,46px);line-height:1.08;letter-spacing:-2px;color:var(--crm-text);font-weight:400}
        .lp-solutions-head p{max-width:620px;margin:0 auto;color:var(--crm-muted);font-size:15px;line-height:1.75;font-weight:400}
        .lp-solution-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
        .lp-solution-card{position:relative;min-height:190px;padding:27px;border:1px solid var(--crm-border);border-radius:16px;background:var(--crm-surface-2);transition:transform .22s ease,border-color .22s ease,box-shadow .22s ease,background .22s ease}
        .lp-solution-card::before{content:none}
        .lp-solution-card:hover{transform:translateY(-4px);border-color:color-mix(in srgb,var(--crm-primary) 30%,var(--crm-border));background:var(--crm-surface);box-shadow:var(--crm-shadow)}
        .lp-solution-icon{width:43px;height:43px;border-radius:12px;background:var(--crm-primary-soft);color:var(--crm-primary);display:grid;place-items:center;margin-bottom:20px;border:1px solid color-mix(in srgb,var(--crm-primary) 10%,transparent);transition:transform .22s ease,background .22s ease}
        .lp-solution-card:hover .lp-solution-icon{transform:scale(1.05);background:color-mix(in srgb,var(--crm-primary) 14%,var(--crm-primary-soft))}
        .lp-solution-card h3{margin:0 0 9px;font-size:14px;line-height:1.35;color:var(--crm-text);font-weight:400}
        .lp-solution-card p{margin:0;color:var(--crm-muted);font-size:13px;line-height:1.7;font-weight:400}
        @media(max-width:850px){.lp-solutions{padding:90px 24px}.lp-solution-grid{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:650px){.lp-solutions{padding:75px 18px}.lp-solutions-head{margin-bottom:36px}.lp-solutions-head h2{font-size:32px;letter-spacing:-1.5px}.lp-solutions-head p{font-size:14px}.lp-solution-grid{grid-template-columns:1fr;gap:12px}.lp-solution-card{min-height:auto;padding:22px}}
        @media(max-width:420px){.lp-solutions{padding:65px 16px}.lp-solutions-head h2{font-size:29px}.lp-solution-card{padding:20px}.lp-solution-icon{width:41px;height:41px;margin-bottom:17px}}
      `}</style>

      <section className="lp-solutions" id="OneCRM">
        <div className="lp-solutions-inner">
          <div className="lp-solutions-head">
            <div className="lp-eyebrow">Built for real teams</div>

            <h2>One CRM. Different ways to work.</h2>

            <p>Whether you are building a sales team or running a growing business, your workspace stays simple and organized.</p>
          </div>

          <div className="lp-solution-grid">
            {solutions.map(({ icon: Icon, title, text }) => (
              <article className="lp-solution-card" key={title}>
                <div className="lp-solution-icon">
                  <Icon size={20} />
                </div>

                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default SolutionsSection;
