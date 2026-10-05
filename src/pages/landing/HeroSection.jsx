import { ArrowRight, CheckCircle2, Play } from "lucide-react";

function HeroSection() {
  return (
    <>
      <style>{`
        .lp-hero{position:relative;isolation:isolate;overflow:hidden;padding:108px 24px 42px;background:var(--crm-bg)}
        .lp-hero::before{content:"";position:absolute;z-index:-2;width:720px;height:720px;border-radius:50%;background:color-mix(in srgb,var(--crm-primary) 9%,transparent);filter:blur(95px);top:-390px;left:50%;transform:translateX(-50%);pointer-events:none}
        .lp-hero::after{content:none}
        .lp-hero-inner{position:relative;width:100%;max-width:1160px;margin:0 auto;text-align:center}
        .lp-badge{display:inline-flex;align-items:center;gap:8px;padding:8px 13px;border:1px solid var(--crm-border);border-radius:999px;background:color-mix(in srgb,var(--crm-surface) 90%,transparent);box-shadow:0 4px 18px rgba(15,23,42,.04);color:var(--crm-muted);font-size:13px;font-weight:400;letter-spacing:.01em}
        .lp-badge-dot{width:7px;height:7px;flex:none;border-radius:50%;background:var(--crm-success);box-shadow:0 0 0 4px color-mix(in srgb,var(--crm-success) 12%,transparent)}
        .lp-hero h1{max-width:900px;margin:25px auto 20px;color:var(--crm-text);font-size:clamp(43px,6vw,72px);line-height:1.04;letter-spacing:-3.4px;font-weight:400}
        .lp-gradient{display:inline;color:var(--crm-primary);background:linear-gradient(90deg,var(--crm-primary),color-mix(in srgb,var(--crm-primary) 72%,#8b5cf6));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
        .lp-hero-desc{max-width:680px;margin:0 auto;color:var(--crm-muted);font-size:16px;line-height:1.75;font-weight:400}
        .lp-hero-actions{display:flex;align-items:center;justify-content:center;gap:11px;margin-top:32px}
        .lp-primary-btn,.lp-secondary-btn{height:48px;padding:0 20px;border-radius:10px;text-decoration:none;font-size:13px;font-weight:400;display:flex;align-items:center;justify-content:center;gap:8px}
        .lp-primary-btn{border:1px solid var(--crm-primary);background:var(--crm-primary);color:#fff;box-shadow:0 9px 25px color-mix(in srgb,var(--crm-primary) 22%,transparent)}
        .lp-primary-btn:hover{background:var(--crm-primary-hover);border-color:var(--crm-primary-hover);transform:translateY(-1px);box-shadow:0 12px 30px color-mix(in srgb,var(--crm-primary) 27%,transparent)}
        .lp-secondary-btn{border:1px solid var(--crm-border);background:var(--crm-surface);color:var(--crm-text);box-shadow:0 5px 18px rgba(15,23,42,.04)}
        .lp-secondary-btn:hover{background:var(--crm-surface-2);border-color:color-mix(in srgb,var(--crm-primary) 28%,var(--crm-border));transform:translateY(-1px)}
        .lp-hero-points{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:18px 24px;margin-top:24px}
        .lp-hero-point{display:flex;align-items:center;gap:6px;color:var(--crm-muted);font-size:13px;font-weight:400}
        .lp-hero-point svg{color:var(--crm-success);flex:none}
        .lp-hero-highlight{position:relative;display:inline-block}
        .lp-hero-highlight::after{content:"";position:absolute;left:3px;right:3px;bottom:-4px;height:5px;border-radius:999px;background:color-mix(in srgb,var(--crm-primary) 18%,transparent);z-index:-1}

        .lp-trust{padding:105px 0 0}
        .lp-trust-inner{max-width:1000px;margin:auto;text-align:center}
        .lp-trust-label{font-size:13px;text-transform:uppercase;letter-spacing:.13em;color:var(--crm-muted);font-weight:400;margin-bottom:18px}
        .lp-trust-items{display:grid;grid-template-columns:repeat(4,1fr);border:1px solid var(--crm-border);border-radius:16px;background:color-mix(in srgb,var(--crm-surface) 96%,transparent);overflow:hidden;box-shadow:0 12px 35px rgba(15,23,42,.05)}
        .lp-trust-item{padding:20px 14px;border-right:1px solid var(--crm-border);transition:background .2s ease}
        .lp-trust-item:hover{background:var(--crm-surface-2)}
        .lp-trust-item:last-child{border-right:0}
        .lp-trust-number{font-size:25px;font-weight:400;letter-spacing:-1px;color:var(--crm-text)}
        .lp-trust-text{margin-top:4px;font-size:13px;color:var(--crm-muted);font-weight:400}

        @media(max-width:700px){
          .lp-hero{padding:88px 18px 30px}
          .lp-hero h1{max-width:620px;margin-top:22px;font-size:clamp(38px,11vw,56px);letter-spacing:-2.4px;line-height:1.06}
          .lp-hero-desc{max-width:560px;font-size:15px;line-height:1.65}
          .lp-hero-actions{margin-top:27px}
          .lp-hero-points{gap:12px 18px;margin-top:20px}
          .lp-trust{padding-top:24px}
          .lp-trust-items{grid-template-columns:repeat(2,1fr)}
          .lp-trust-item:nth-child(2){border-right:0}
          .lp-trust-item:nth-child(-n+2){border-bottom:1px solid var(--crm-border)}
        }

        @media(max-width:520px){
          .lp-hero{padding:74px 16px 24px}
          .lp-badge{font-size:13px;padding:7px 11px}
          .lp-hero h1{font-size:39px;letter-spacing:-2px}
          .lp-hero-desc{font-size:14px}
          .lp-hero-actions{flex-direction:column;width:100%;max-width:330px;margin-left:auto;margin-right:auto}
          .lp-primary-btn,.lp-secondary-btn{width:100%}
          .lp-hero-points{display:grid;grid-template-columns:1fr;gap:10px;justify-items:center}
          .lp-hero-highlight::after{bottom:-3px;height:4px}
          .lp-trust{padding-top:20px}
          .lp-trust-label{font-size:13px;letter-spacing:.11em;margin-bottom:14px}
          .lp-trust-item{padding:17px 10px}
          .lp-trust-number{font-size:22px}
          .lp-trust-text{font-size:13px}
        }
      `}</style>

      <section className="lp-hero" id="hero">
        <div className="lp-hero-inner">
          <div className="lp-badge">
            <span className="lp-badge-dot" />
            The modern workspace for growing businesses
          </div>

          <h1>
            Manage your entire business from <span className="lp-gradient lp-hero-highlight">one powerful CRM.</span>
          </h1>

          <p className="lp-hero-desc">
            Bring leads, contacts, companies, deals, tasks and team activity together in one <strong>simple, organized workspace.</strong>
          </p>

          <div className="lp-hero-actions">
            <a href="/login" className="lp-primary-btn">
              Get Started
              <ArrowRight size={16} />
            </a>

            <a href="#dashboard" className="lp-secondary-btn">
              <Play size={15} />
              Explore CRM
            </a>
          </div>

          <div className="lp-hero-points">
            <span className="lp-hero-point">
              <CheckCircle2 size={14} />
              Simple to use
            </span>

            <span className="lp-hero-point">
              <CheckCircle2 size={14} />
              Built for teams
            </span>

            <span className="lp-hero-point">
              <CheckCircle2 size={14} />
              One unified workspace
            </span>
          </div>

          <section className="lp-trust">
            <div className="lp-trust-inner">
              <div className="lp-trust-label">Everything your team needs in one place</div>

              <div className="lp-trust-items">
                <div className="lp-trust-item">
                  <div className="lp-trust-number">40+</div>
                  <div className="lp-trust-text">Core CRM modules</div>
                </div>

                <div className="lp-trust-item">
                  <div className="lp-trust-number">360°</div>
                  <div className="lp-trust-text">Customer visibility</div>
                </div>

                <div className="lp-trust-item">
                  <div className="lp-trust-number">1</div>
                  <div className="lp-trust-text">Unified workspace</div>
                </div>

                <div className="lp-trust-item">
                  <div className="lp-trust-number">24/7</div>
                  <div className="lp-trust-text">Business access</div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </>
  );
}

export default HeroSection;
