import { BarChart3, Building2, CheckSquare, CircleDollarSign, ContactRound, GitBranch, Target, UsersRound } from "lucide-react";

const features = [
  { icon: Target, title: "Lead Management", text: "Capture, organize and follow every opportunity from first contact to conversion." },
  { icon: ContactRound, title: "Contacts", text: "Keep customer information organized and accessible across your entire team." },
  { icon: Building2, title: "Companies", text: "Build a complete view of the businesses and organizations you work with." },
  { icon: CircleDollarSign, title: "Deal Management", text: "Track opportunities, deal values and sales progress from one workspace." },
  { icon: CheckSquare, title: "Tasks & Activities", text: "Make sure important calls, meetings and follow-ups never get missed." },
  { icon: GitBranch, title: "Sales Pipelines", text: "Visualize your sales process and understand exactly where every deal stands." },
  { icon: BarChart3, title: "Reports", text: "Turn your CRM activity into clear business insights and useful reports." },
  { icon: UsersRound, title: "Team Workspace", text: "Keep your team aligned around customers, deals and daily priorities." },
];

function FeaturesSection() {
  return (
    <>
      <style>{`
        .lp-features::before{content:none}
        .lp-features::before{content:none}
        .lp-features-inner{position:relative;max-width:1160px;margin:0 auto}
        .lp-section-head{max-width:690px;margin:0 auto 50px;text-align:center}
        .lp-eyebrow{display:inline-flex;align-items:center;justify-content:center;font-size:13px;text-transform:uppercase;letter-spacing:.14em;color:var(--crm-primary);font-weight:400}
        .lp-section-head h2{margin:12px 0 14px;font-size:clamp(31px,4vw,46px);line-height:1.08;letter-spacing:-2px;color:var(--crm-text);font-weight:400}
        .lp-section-head p{max-width:620px;margin:0 auto;color:var(--crm-muted);font-size:15px;line-height:1.75;font-weight:400}
        .lp-feature-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
        .lp-feature-card{position:relative;min-height:190px;padding:25px;border:1px solid var(--crm-border);border-radius:16px;background:var(--crm-surface-2);transition:transform .22s ease,border-color .22s ease,box-shadow .22s ease,background .22s ease}
        .lp-feature-card::before{content:"";position:absolute;left:25px;right:25px;top:0;height:1px;background:linear-gradient(90deg,transparent,var(--crm-primary),transparent);opacity:0;transition:opacity .22s ease}
        .lp-feature-card:hover{transform:translateY(-4px);border-color:color-mix(in srgb,var(--crm-primary) 32%,var(--crm-border));background:var(--crm-surface);box-shadow:var(--crm-shadow)}
        .lp-feature-card:hover::before{opacity:.7}
        .lp-feature-icon{width:43px;height:43px;border-radius:12px;display:grid;place-items:center;background:var(--crm-primary-soft);color:var(--crm-primary);margin-bottom:20px;border:1px solid color-mix(in srgb,var(--crm-primary) 10%,transparent);transition:transform .22s ease,background .22s ease}
        .lp-feature-card:hover .lp-feature-icon{transform:scale(1.05);background:color-mix(in srgb,var(--crm-primary) 14%,var(--crm-primary-soft))}
        .lp-feature-card h3{margin:0 0 9px;font-size:14px;line-height:1.35;color:var(--crm-text);font-weight:400}
        .lp-feature-card p{margin:0;font-size:13px;line-height:1.7;color:var(--crm-muted);font-weight:400}
        @media(max-width:950px){.lp-features{padding:90px 24px}.lp-feature-grid{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:650px){.lp-features{padding:75px 18px}.lp-section-head{margin-bottom:36px}.lp-section-head h2{font-size:32px;letter-spacing:-1.5px}.lp-section-head p{font-size:14px}.lp-feature-grid{grid-template-columns:1fr;gap:12px}.lp-feature-card{min-height:auto;padding:22px}}
        @media(max-width:420px){.lp-features{padding:65px 16px}.lp-section-head h2{font-size:29px}.lp-feature-card{padding:20px}.lp-feature-icon{width:41px;height:41px;margin-bottom:17px}}
      `}</style>

      <section className="lp-features" id="features">
        <div className="lp-features-inner">
          <div className="lp-section-head">
            <div className="lp-eyebrow">Everything connected</div>

            <h2>Everything your business needs to stay organized.</h2>

            <p>Replace scattered tools and disconnected workflows with one clear system built around the way your team actually works.</p>
          </div>

          <div className="lp-feature-grid">
            {features.map(({ icon: Icon, title, text }) => (
              <article className="lp-feature-card" key={title}>
                <div className="lp-feature-icon">
                  <Icon size={20} strokeWidth={1.9} />
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

export default FeaturesSection;
