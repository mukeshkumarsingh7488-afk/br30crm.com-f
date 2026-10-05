import { ArrowRight, CheckCircle2 } from "lucide-react";

function FinalCTA() {
  return (
    <>
      <style>{`.lp-cta{padding:35px 24px 100px;background:var(--crm-bg)}.lp-cta-box{position:relative;overflow:hidden;max-width:1100px;margin:auto;padding:70px 30px;text-align:center;border:1px solid var(--crm-border);border-radius:22px;background:var(--crm-surface);color:var(--crm-text);box-shadow:var(--crm-shadow)}.lp-cta-box::before{content:"";position:absolute;width:400px;height:400px;border-radius:50%;background:color-mix(in srgb,var(--crm-primary) 5%,transparent);top:-240px;right:-100px;filter:blur(30px);pointer-events:none}.lp-cta-box>*{position:relative}.lp-cta-box h2{margin:0 auto 14px;max-width:650px;font-size:clamp(30px,4vw,48px);line-height:1.08;letter-spacing:-2px;color:var(--crm-text);font-weight:400}.lp-cta-box p{max-width:560px;margin:0 auto;color:var(--crm-muted);font-size:14px;line-height:1.7;font-weight:400}.lp-cta-btn{display:inline-flex;align-items:center;gap:8px;margin-top:27px;padding:0 20px;height:46px;border-radius:10px;background:var(--crm-primary);border:1px solid var(--crm-primary);color:#fff;text-decoration:none;font-size:13px;font-weight:400;transition:.2s}.lp-cta-btn:hover{background:var(--crm-primary-hover);border-color:var(--crm-primary-hover);transform:translateY(-1px)}.lp-cta-points{display:flex;justify-content:center;flex-wrap:wrap;gap:17px;margin-top:21px}.lp-cta-point{display:flex;align-items:center;gap:5px;color:var(--crm-muted);font-size:13px;font-weight:400}@media(max-width:600px){.lp-cta{padding:25px 18px 70px}.lp-cta-box{padding:50px 22px;border-radius:18px}.lp-cta-box h2{font-size:32px;letter-spacing:-1.5px}.lp-cta-box p{font-size:13px}.lp-cta-points{gap:11px 15px}}`}</style>

      <section className="lp-cta">
        <div className="lp-cta-box">
          <h2>Ready to bring your business into one workspace?</h2>
          <p>Start building a clearer, more connected way to manage your customers, sales and everyday business activity.</p>

          <a href="/login" className="lp-cta-btn">
            Get Started <ArrowRight size={15} />
          </a>

          <div className="lp-cta-points">
            <span className="lp-cta-point">
              <CheckCircle2 size={12} /> Easy to start
            </span>
            <span className="lp-cta-point">
              <CheckCircle2 size={12} /> Built to grow
            </span>
            <span className="lp-cta-point">
              <CheckCircle2 size={12} /> One workspace
            </span>
          </div>
        </div>
      </section>
    </>
  );
}

export default FinalCTA;
