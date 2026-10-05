import { Check, Expand, ShieldCheck, Sparkles, Zap } from "lucide-react";

const points = ["Everything stays connected in one workspace", "Simple interface your team can learn quickly", "Designed to scale with growing businesses", "Clear visibility across sales and customer activity", "Flexible foundation for future integrations"];

function WhyUniversalCRM() {
  return (
    <>
      <style>{`
        .lp-why{position:relative;isolation:isolate;overflow:hidden;padding:100px 24px;background:var(--crm-bg)}
        .lp-why-inner{position:relative;max-width:1080px;margin:auto;display:grid;grid-template-columns:1fr 1fr;gap:70px;align-items:center}
        .lp-why-copy .lp-eyebrow{font-size:13px;text-transform:uppercase;letter-spacing:.14em;color:var(--crm-primary);font-weight:400}
        .lp-why-copy h2{margin:13px 0 15px;font-size:clamp(30px,4vw,45px);line-height:1.08;letter-spacing:-2px;color:var(--crm-text);font-weight:400}
        .lp-why-copy>p{margin:0;color:var(--crm-muted);font-size:15px;line-height:1.7;font-weight:400}
        .lp-why-list{margin-top:25px;display:flex;flex-direction:column;gap:12px}
        .lp-why-item{display:flex;align-items:center;gap:10px;font-size:13px;color:var(--crm-text);font-weight:400}
        .lp-why-check{width:22px;height:22px;border-radius:50%;display:grid;place-items:center;background:var(--crm-primary-soft);color:var(--crm-primary);border:1px solid color-mix(in srgb,var(--crm-primary) 10%,transparent);flex:none}
        .lp-why-visual{display:grid;grid-template-columns:1fr 1fr;gap:12px}
        .lp-why-card{padding:27px;border:1px solid color-mix(in srgb,var(--crm-primary) 30%,var(--crm-border));border-radius:16px;background:var(--crm-surface-2);transition:border-color .22s ease,box-shadow .22s ease,background .22s ease,transform .22s ease}
        .lp-why-card:hover{border-color:var(--crm-border);background:var(--crm-surface);box-shadow:0 8px 24px color-mix(in srgb,var(--crm-primary) 10%,transparent);transform:translateY(-3px)}
        .lp-why-card:nth-child(2){transform:translateY(0)}
        .lp-why-card:nth-child(2):hover{transform:translateY(-3px)}
        .lp-why-card:nth-child(3){transform:translateY(-8px)}
        .lp-why-card:nth-child(3):hover{transform:translateY(-11px)}
        .lp-why-card:nth-child(4){transform:translateY(0)}
        .lp-why-card:nth-child(4):hover{transform:translateY(-3px)}
        .lp-why-icon{width:42px;height:42px;border-radius:11px;background:var(--crm-primary-soft);color:var(--crm-primary);display:grid;place-items:center;margin-bottom:20px;border:1px solid color-mix(in srgb,var(--crm-primary) 10%,transparent)}
        .lp-why-card h3{margin:0 0 7px;color:var(--crm-text);font-size:14px;font-weight:400}
        .lp-why-card p{margin:0;color:var(--crm-muted);font-size:13px;line-height:1.65;font-weight:400}
        @media(max-width:800px){
          .lp-why{padding:85px 24px}
          .lp-why-inner{grid-template-columns:1fr;gap:45px}
          .lp-why-visual{max-width:600px;width:100%;margin:0 auto}
        }
        @media(max-width:500px){
          .lp-why{padding:70px 18px}
          .lp-why-copy h2{font-size:32px;letter-spacing:-1.5px}
          .lp-why-copy>p{font-size:14px}
          .lp-why-item{font-size:13px}
          .lp-why-visual{grid-template-columns:1fr}
          .lp-why-card:nth-child(2),.lp-why-card:nth-child(3),.lp-why-card:nth-child(4){transform:none}
          .lp-why-card:nth-child(2):hover,.lp-why-card:nth-child(3):hover,.lp-why-card:nth-child(4):hover{transform:translateY(-3px)}
        }
      `}</style>

      <section className="lp-why" id="why">
        <div className="lp-why-inner">
          <div className="lp-why-copy">
            <div className="lp-eyebrow">Why BR30 CRM</div>

            <h2>Less complexity. More control.</h2>

            <p>A CRM should help your team work better, not create another complicated system to manage.</p>

            <div className="lp-why-list">
              {points.map((point) => (
                <div className="lp-why-item" key={point}>
                  <span className="lp-why-check">
                    <Check size={13} />
                  </span>
                  {point}
                </div>
              ))}
            </div>
          </div>

          <div className="lp-why-visual">
            <div className="lp-why-card">
              <div className="lp-why-icon">
                <Sparkles size={19} />
              </div>

              <h3>Clean by design</h3>

              <p>Focused screens and clear information hierarchy keep everyday work simple.</p>
            </div>

            <div className="lp-why-card">
              <div className="lp-why-icon">
                <Zap size={19} />
              </div>

              <h3>Built for speed</h3>

              <p>Find the right customer, deal or task without unnecessary steps.</p>
            </div>

            <div className="lp-why-card">
              <div className="lp-why-icon">
                <ShieldCheck size={19} />
              </div>

              <h3>Business focused</h3>

              <p>Organize the workflows that matter most to your team and customers.</p>
            </div>

            <div className="lp-why-card">
              <div className="lp-why-icon">
                <Expand size={19} />
              </div>

              <h3>Ready to grow</h3>

              <p>Flexible workflows and organized tools that can adapt as your business, team and customer operations grow.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default WhyUniversalCRM;
