import { ArrowUpRight, Plus, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

function Me() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const getTheme = () => {
      const savedTheme = localStorage.getItem("crm-theme") || "light";

      if (savedTheme === "device" || savedTheme === "system") {
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      }

      return savedTheme === "dark" ? "dark" : "light";
    };

    const updateTheme = () => setTheme(getTheme());

    updateTheme();

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    mediaQuery.addEventListener?.("change", updateTheme);
    window.addEventListener("storage", updateTheme);

    const interval = window.setInterval(updateTheme, 500);

    return () => {
      mediaQuery.removeEventListener?.("change", updateTheme);
      window.removeEventListener("storage", updateTheme);
      window.clearInterval(interval);
    };
  }, []);

  const companies = useMemo(() => ["Google", "Amazon", "Microsoft", "Stripe", "Razorpay", "Shopify", "HubSpot", "Zoho", "Slack", "Notion", "Atlassian", "Salesforce", "Canva", "Freshworks", "Adobe", "Airbnb", "Booking.com", "Dropbox", "Paytm", "Twilio"], []);

  const marqueeCompanies = [...companies, ...companies];

  return (
    <div className={`me-page ${theme === "dark" ? "me-dark" : "me-light"}`}>
      <style>{`
        .me-page{--me-primary:var(--crm-primary,#5046e5);--me-bg:transparent;--me-surface:transparent;--me-surface-2:var(--crm-surface-2,#fff);--me-text:var(--crm-text,#111827);--me-muted:var(--crm-muted,#667085);--me-border:var(--crm-border,rgba(15,23,42,.09));--me-shadow:var(--crm-shadow,0 25px 70px rgba(32,35,75,.11));min-height:100vh;width:100%;overflow:hidden;background:transparent;color:var(--me-text);transition:color .25s ease}
        .me-page.me-dark{--me-bg:transparent;--me-surface:transparent;--me-surface-2:var(--crm-surface-2,#121521);--me-text:var(--crm-text,#f7f8fc);--me-muted:var(--crm-muted,#9aa3b2);--me-border:var(--crm-border,rgba(255,255,255,.09));--me-shadow:var(--crm-shadow,0 25px 70px rgba(0,0,0,.35))}
        .me-hero{position:relative;min-height:720px;padding:75px 24px 70px;overflow:hidden;background:transparent}
        .me-container{position:relative;z-index:2;width:min(1120px,100%);margin:0 auto}
        .me-background-glow{display:none}
        .me-glow-one,.me-glow-two{display:none}
        .me-top-grid{display:grid;grid-template-columns:235px minmax(0,1fr) 235px;align-items:center;gap:26px}
        .me-image-card{position:relative;overflow:hidden;border:1px solid var(--me-border);border-radius:18px;background:var(--me-surface-2);box-shadow:var(--me-shadow)}
        .me-image-card img{display:block;width:100%;height:100%;object-fit:cover}
        .me-image-large{height:350px}
        .me-image-small{height:270px;margin-top:165px}
        .me-image-overlay{position:absolute;inset:0;background:linear-gradient(180deg,transparent 55%,rgba(0,0,0,.14));pointer-events:none}
        .me-main-content{text-align:left;padding:0 2px}
        .me-eyebrow{display:inline-flex;align-items:center;justify-content:center;gap:9px;margin-bottom:18px;padding:7px 12px;border-radius:999px;background:color-mix(in srgb,var(--me-primary) 9%,transparent);color:var(--me-primary);font-size:12px;text-transform:uppercase;letter-spacing:.12em;font-weight:400}
        .me-eyebrow-dot{width:6px;height:6px;border-radius:50%;background:var(--me-primary);box-shadow:0 0 0 5px color-mix(in srgb,var(--me-primary) 9%,transparent)}
        .me-main-content h1{margin:0;max-width:580px;font-size:clamp(46px,5.3vw,72px);line-height:.98;letter-spacing:-3px;color:var(--me-text);font-weight:400}
        .me-main-content h1 span{display:block;color:var(--me-primary)}
        .me-description{max-width:540px;margin:24px 0 0;color:var(--me-muted);font-size:15px;line-height:1.75;font-weight:400}
        .me-actions{display:flex;align-items:center;gap:10px;margin-top:24px}
        .me-primary-btn,.me-secondary-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:45px;padding:0 18px;border-radius:11px;text-decoration:none;font-size:13px;font-weight:400;transition:all .2s ease}
        .me-primary-btn{color:#fff;background:var(--me-primary);box-shadow:0 10px 22px color-mix(in srgb,var(--me-primary) 22%,transparent)}
        .me-primary-btn:hover{filter:brightness(1.06);transform:translateY(-2px)}
        .me-secondary-btn{color:var(--me-text);background:var(--me-surface);border:1px solid var(--me-border)}
        .me-secondary-btn:hover{border-color:color-mix(in srgb,var(--me-primary) 35%,var(--me-border));color:var(--me-primary)}
        .me-trust-row{display:flex;align-items:center;gap:16px;margin-top:30px}
        .me-avatar-stack{display:flex;align-items:center}
        .me-avatar,.me-avatar-plus{width:34px;height:34px;margin-left:-7px;border-radius:50%;border:2px solid transparent;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:500}
        .me-avatar:first-child{margin-left:0}
        .me-avatar-one{background:#e9d5ff;color:#7e22ce}
        .me-avatar-two{background:#bfdbfe;color:#1d4ed8}
        .me-avatar-three{background:#bbf7d0;color:#15803d}
        .me-avatar-four{background:#fed7aa;color:#c2410c}
        .me-avatar-plus{background:var(--me-surface);color:var(--me-text);border-color:var(--me-border)}
        .me-community{display:flex;flex-direction:column;gap:2px}
        .me-community strong{font-size:21px;line-height:1;letter-spacing:-.03em;font-weight:400}
        .me-community span{color:var(--me-muted);font-size:11px}
        .me-review-row{display:flex;align-items:center;justify-content:center;gap:10px;margin-top:65px}
        .me-review-item{display:flex;align-items:center;gap:7px;padding:8px 13px;border:1px solid var(--me-border);border-radius:999px;background:transparent;color:var(--me-muted);font-size:12px;font-weight:400}
        .me-review-item svg{color:var(--me-primary)}
        .me-companies{position:relative;padding:8px 0 48px;background:transparent;border-top:0;border-bottom:0;overflow:hidden}
        .me-companies-heading{margin-bottom:22px;text-align:center;color:var(--me-muted);font-size:13px;font-weight:400}
        .me-marquee-wrapper{position:relative;width:100%;overflow:hidden}
        .me-marquee-wrapper::before,.me-marquee-wrapper::after{content:"";position:absolute;z-index:2;top:0;bottom:0;width:110px;pointer-events:none}
        .me-marquee-wrapper::before{left:0;background:linear-gradient(90deg,var(--crm-bg,transparent),transparent)}
        .me-marquee-wrapper::after{right:0;background:linear-gradient(270deg,var(--crm-bg,transparent),transparent)}
        .me-marquee{display:flex;width:max-content;align-items:center;animation:me-marquee-scroll 48s linear infinite;will-change:transform}
        .me-company{display:flex;align-items:center;gap:10px;margin-right:52px;white-space:nowrap;color:var(--me-text);opacity:.68;font-size:18px;font-weight:400;letter-spacing:-.02em}
        .me-company-dot{width:6px;height:6px;border-radius:50%;background:var(--me-primary);opacity:.75}
        @keyframes me-marquee-scroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @media(max-width:950px){.me-hero{padding:80px 24px 70px}.me-top-grid{grid-template-columns:200px minmax(0,1fr);gap:24px}.me-image-small{display:none}.me-image-large{height:340px}.me-main-content h1{font-size:clamp(44px,7vw,66px)}}
        @media(max-width:650px){.me-hero{min-height:auto;padding:70px 18px 60px}.me-top-grid{display:flex;flex-direction:column;gap:26px;align-items:stretch}.me-main-content{order:1}.me-image-large{order:2;width:100%;height:290px}.me-main-content h1{font-size:clamp(44px,13vw,62px);letter-spacing:-2px}.me-description{font-size:14px;line-height:1.7}.me-actions{flex-wrap:wrap}.me-primary-btn,.me-secondary-btn{flex:1}.me-trust-row{margin-top:28px}.me-review-row{flex-wrap:wrap;margin-top:38px}.me-company{margin-right:38px;font-size:16px}.me-marquee{animation-duration:42s}}
        @media(max-width:420px){.me-hero{padding:60px 16px 50px}.me-main-content h1{font-size:45px}.me-actions{flex-direction:column;align-items:stretch}.me-primary-btn,.me-secondary-btn{width:100%;flex:none}.me-image-large{height:255px;border-radius:16px}.me-review-item{font-size:11px;padding:7px 11px}.me-marquee-wrapper::before,.me-marquee-wrapper::after{width:55px}}
        @media(prefers-reduced-motion:reduce){.me-marquee{animation:none}.me-primary-btn,.me-secondary-btn{transition:none}}
      `}</style>

      <section className="me-hero">
        <div className="me-background-glow me-glow-one" />
        <div className="me-background-glow me-glow-two" />

        <div className="me-container">
          <div className="me-top-grid">
            <div className="me-image-card me-image-large">
              <img src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=85" alt="Business team working together" />
              <div className="me-image-overlay" />
            </div>

            <div className="me-main-content">
              <div className="me-eyebrow">
                <span className="me-eyebrow-dot" />
                Built for modern businesses
              </div>

              <h1>
                Empowering
                <span>modern business</span>
                growth.
              </h1>

              <p className="me-description">BR30 CRM helps growing businesses organize customers, sales, teams, deals and everyday operations in one powerful workspace.</p>

              <div className="me-actions">
                <a href="/register" className="me-primary-btn">
                  Get Started
                  <ArrowUpRight size={17} />
                </a>

                <a href="/login" className="me-secondary-btn">
                  Sign In
                </a>
              </div>

              <div className="me-trust-row">
                <div className="me-avatar-stack">
                  <div className="me-avatar me-avatar-one">A</div>
                  <div className="me-avatar me-avatar-two">R</div>
                  <div className="me-avatar me-avatar-three">M</div>
                  <div className="me-avatar me-avatar-four">S</div>
                  <div className="me-avatar-plus">
                    <Plus size={13} />
                  </div>
                </div>

                <div className="me-community">
                  <strong>10K+</strong>
                  <span>Businesses & teams</span>
                </div>
              </div>
            </div>

            <div className="me-image-card me-image-small">
              <img src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1000&q=85" alt="Business collaboration" />
              <div className="me-image-overlay" />
            </div>
          </div>

          <div className="me-review-row">
            <div className="me-review-item">
              <Sparkles size={16} />
              <span>Simple</span>
            </div>

            <div className="me-review-item">
              <Sparkles size={16} />
              <span>Powerful</span>
            </div>

            <div className="me-review-item">
              <Sparkles size={16} />
              <span>Built to scale</span>
            </div>
          </div>
        </div>
      </section>

      <section className="me-companies">
        <div className="me-companies-heading">Trusted by teams building the future.</div>

        <div className="me-marquee-wrapper">
          <div className="me-marquee">
            {marqueeCompanies.map((company, index) => (
              <div className="me-company" key={`${company}-${index}`}>
                <span className="me-company-dot" />
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Me;
