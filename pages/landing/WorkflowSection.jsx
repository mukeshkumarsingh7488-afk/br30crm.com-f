import { ArrowRight, CheckCircle2, ContactRound, Target, Trophy } from "lucide-react";

const steps = [
  { number: "01", icon: Target, title: "Capture leads", text: "Bring new opportunities into one organized pipeline." },
  { number: "02", icon: ContactRound, title: "Build relationships", text: "Keep contacts and company information connected." },
  { number: "03", icon: ArrowRight, title: "Move deals forward", text: "Track every stage and follow-up until the opportunity closes." },
  { number: "04", icon: Trophy, title: "Close & grow", text: "Understand results and use your data to improve the next cycle." },
];

function WorkflowSection() {
  return (
    <>
      <style>{`
        .lp-workflow{position:relative;isolation:isolate;overflow:hidden;padding:105px 24px;background:var(--crm-bg)}
        .lp-workflow::before{content:"";position:absolute;width:620px;height:420px;border-radius:50%;background:transparent;filter:none;top:-220px;left:50%;transform:translateX(-50%);pointer-events:none}
        .lp-workflow-inner{position:relative;max-width:1100px;margin:0 auto}
        .lp-workflow-head{max-width:690px;margin:0 auto 52px;text-align:center}
        .lp-workflow-head h2{margin:12px 0 14px;font-size:clamp(31px,4vw,46px);line-height:1.08;letter-spacing:-2px;color:var(--crm-text);font-weight:400}
        .lp-workflow-head p{max-width:620px;margin:0 auto;color:var(--crm-muted);font-size:15px;line-height:1.75;font-weight:400}
        .lp-workflow-grid{position:relative;display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
        .lp-workflow-grid::before{content:"";position:absolute;left:10%;right:10%;top:45px;height:1px;background:linear-gradient(90deg,transparent,var(--crm-border),var(--crm-primary),var(--crm-border),transparent);z-index:-1}
        .lp-step{position:relative;padding:25px;border:1px solid var(--crm-border);border-radius:16px;background:var(--crm-surface-2);transition:transform .22s ease,border-color .22s ease,box-shadow .22s ease,background .22s ease}
        .lp-step:hover{transform:translateY(-4px);border-color:color-mix(in srgb,var(--crm-primary) 32%,var(--crm-border));background:var(--crm-surface);box-shadow:var(--crm-shadow)}
        .lp-step-number{font-size:13px;font-weight:400;color:var(--crm-primary);letter-spacing:.1em}
        .lp-step-icon{width:42px;height:42px;border-radius:12px;background:var(--crm-primary-soft);color:var(--crm-primary);border:1px solid color-mix(in srgb,var(--crm-primary) 10%,transparent);display:grid;place-items:center;margin:20px 0 18px;transition:transform .22s ease,background .22s ease}
        .lp-step:hover .lp-step-icon{transform:scale(1.06);background:color-mix(in srgb,var(--crm-primary) 14%,var(--crm-primary-soft))}
        .lp-step h3{margin:0 0 8px;font-size:14px;line-height:1.35;color:var(--crm-text);font-weight:400}
        .lp-step p{margin:0;font-size:13px;line-height:1.7;color:var(--crm-muted);font-weight:400}
        .lp-step-check{display:flex;align-items:center;gap:5px;margin-top:18px;font-size:13px;color:var(--crm-success);font-weight:400}
        .lp-step-check svg{flex:none}
        @media(max-width:850px){.lp-workflow{padding:90px 24px}.lp-workflow-grid{grid-template-columns:repeat(2,1fr)}.lp-workflow-grid::before{display:none}}
        @media(max-width:550px){.lp-workflow{padding:75px 18px}.lp-workflow-head{margin-bottom:36px}.lp-workflow-head h2{font-size:32px;letter-spacing:-1.5px}.lp-workflow-head p{font-size:14px}.lp-workflow-grid{grid-template-columns:1fr;gap:12px}.lp-step{padding:22px}.lp-step-icon{margin-top:17px}}
        @media(max-width:420px){.lp-workflow{padding:65px 16px}.lp-workflow-head h2{font-size:29px}.lp-step{padding:20px}}
      `}</style>

      <section className="lp-workflow" id="workflow">
        <div className="lp-workflow-inner">
          <div className="lp-workflow-head">
            <div className="lp-eyebrow">A simple business flow</div>

            <h2>From first lead to closed deal.</h2>

            <p>BR30 CRM keeps every step connected so your team always knows what needs to happen next.</p>
          </div>

          <div className="lp-workflow-grid">
            {steps.map(({ number, icon: Icon, title, text }) => (
              <article className="lp-step" key={number}>
                <div className="lp-step-number">{number}</div>

                <div className="lp-step-icon">
                  <Icon size={19} strokeWidth={1.9} />
                </div>

                <h3>{title}</h3>

                <p>{text}</p>

                <div className="lp-step-check">
                  <CheckCircle2 size={12} />
                  Connected to your CRM
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default WorkflowSection;
