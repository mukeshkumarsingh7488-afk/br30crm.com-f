import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";

function LandingFooter() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleSectionClick = (sectionId) => {
    if (location.pathname === "/") {
      const element = document.getElementById(sectionId);

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    } else {
      navigate(`/#${sectionId}`);
    }
  };

  const handleHomeClick = (event) => {
    event.preventDefault();

    if (location.pathname === "/") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      navigate("/");
    }
  };

  return (
    <>
      <style>{`.lp-footer-bottom{display:flex;align-items:center;justify-content:space-between;gap:20px;width:100%;}.lp-copyright,.lp-footer-built,.lp-footer-version{flex:1;}.lp-footer-version{text-align:center;font-size:13px;font-weight:400;color:var(--lp-footer-muted,#8b93a7);white-space:nowrap;}.lp-footer-built{text-align:right;}@media(max-width:768px){.lp-footer-bottom{flex-direction:column;justify-content:center;text-align:center;gap:10px;}.lp-copyright,.lp-footer-built,.lp-footer-version{flex:none;width:100%;text-align:center;}}.lp-built-heart{color:var(--crm-primary);font-size:13px;margin:0 2px}.lp-footer{background:var(--crm-surface);border-top:1px solid var(--crm-border);padding:70px 24px 25px}.lp-footer-inner{max-width:1160px;margin:auto}.lp-footer-main{display:grid;grid-template-columns:1.7fr repeat(5,1fr);gap:45px;padding-bottom:55px}.lp-footer-brand{max-width:290px}.lp-footer-logo{display:flex;align-items:center;gap:10px;color:var(--crm-text);text-decoration:none;font-size:15px;font-weight:400}.lp-footer-logo img{width:32px;height:32px;border-radius:8px}.lp-footer-brand p{margin:17px 0 20px;color:var(--crm-muted);font-size:13px;line-height:1.7}.lp-socials{display:flex;gap:7px}.lp-social{width:34px;height:34px;border:1px solid var(--crm-border);border-radius:9px;display:grid;place-items:center;color:var(--crm-muted);background:var(--crm-surface);text-decoration:none;transition:.2s}.lp-social:hover{background:var(--crm-surface-2);border-color:color-mix(in srgb,var(--crm-primary) 25%,var(--crm-border));color:var(--crm-primary);transform:translateY(-2px)}.lp-footer-col h3{margin:0 0 17px;color:var(--crm-text);font-size:13px;text-transform:uppercase;letter-spacing:.08em}.lp-footer-links{display:flex;flex-direction:column;gap:11px}.lp-footer-links a,.lp-footer-links button{color:var(--crm-muted);font-size:13px;text-decoration:none;display:flex;align-items:center;background:none;border:0;padding:0;font-family:inherit;text-align:left;cursor:pointer}.lp-footer-links a:hover,.lp-footer-links button:hover{color:var(--crm-primary)}.lp-footer-bottom{border-top:1px solid var(--crm-border);padding-top:21px;display:flex;align-items:center;justify-content:space-between;gap:15px}.lp-copyright{color:var(--crm-muted);font-size:13px}.lp-footer-built{color:var(--crm-muted);font-size:13px;text-decoration:none}.lp-footer-built strong{color:var(--crm-text);font-weight:400}.lp-footer-built:hover{color:var(--crm-primary)}@media(max-width:900px){.lp-footer-main{grid-template-columns:repeat(3,1fr)}.lp-footer-brand{grid-column:1/-1;max-width:500px}}@media(max-width:600px){.lp-footer{padding:55px 18px 22px}.lp-footer-main{grid-template-columns:repeat(2,1fr);gap:35px 20px}.lp-footer-brand{grid-column:1/-1}.lp-footer-bottom{flex-direction:column;align-items:flex-start;gap:10px}.lp-footer-built{font-size:13px}}`}</style>

      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div className="lp-footer-main">
            <div className="lp-footer-brand">
              <a href="/" className="lp-footer-logo" onClick={handleHomeClick}>
                <img src="/favicon-32x32.png" alt="BR30 CRM" />
                BR30 CRM
              </a>

              <p>A modern business workspace for managing customers, sales, teams and everyday business operations.</p>

              <div className="lp-socials">
                <a href="#" className="lp-social" aria-label="LinkedIn" title="LinkedIn">
                  <FaLinkedinIn size={14} />
                </a>

                <a href="#" className="lp-social" aria-label="Instagram" title="Instagram">
                  <FaInstagram size={15} />
                </a>

                <a href="#" className="lp-social" aria-label="Facebook" title="Facebook">
                  <FaFacebookF size={13} />
                </a>

                <a href="#" className="lp-social" aria-label="YouTube" title="YouTube">
                  <FaYoutube size={16} />
                </a>
              </div>
            </div>

            <div className="lp-footer-col">
              <h3>Product</h3>

              <div className="lp-footer-links">
                <button type="button" onClick={() => handleSectionClick("dashboard")}>
                  Overview
                </button>

                <button type="button" onClick={() => handleSectionClick("features")}>
                  Features
                </button>

                <button type="button" onClick={() => handleSectionClick("OneCRM")}>
                  One CRM
                </button>

                <button type="button" onClick={() => handleSectionClick("pricing")}>
                  Pricing
                </button>

                <button type="button" onClick={() => handleSectionClick("workflow")}>
                  Workflow
                </button>

                <Link to="/whats-new">What's New</Link>
              </div>
            </div>

            <div className="lp-footer-col">
              <h3>Company</h3>

              <div className="lp-footer-links">
                <Link to="/about">About</Link>
                <Link to="/contact">Contact</Link>
                <Link to="/careers">Careers</Link>
                <Link to="/blog">Blog</Link>
                <Link to="/ecosystem">Ecosystem</Link>
                <Link to="/consultants">Consultants</Link>
              </div>
            </div>

            <div className="lp-footer-col">
              <h3>Solutions</h3>

              <div className="lp-footer-links">
                <Link to="/sales-management">Sales Management</Link>
                <Link to="/lead-management">Lead Management</Link>
                <Link to="/customer-management">Customer Management</Link>
                <Link to="/team-management">Team Management</Link>
                <Link to="/business-operations">Business Operations</Link>
                <Link to="/reporting-analytics">Reporting & Analytics</Link>
              </div>
            </div>

            <div className="lp-footer-col">
              <h3>Resources</h3>

              <div className="lp-footer-links">
                <Link to="/help">Help Center</Link>
                <Link to="/documentation">Documentation</Link>
                <Link to="/faq">FAQ</Link>
                <Link to="/security">Security</Link>
                <Link to="/system-status">System Status</Link>
                <Link to="/trust-center">Trust Center</Link>
              </div>
            </div>

            <div className="lp-footer-col">
              <h3>Legal</h3>

              <div className="lp-footer-links">
                <Link to="/privacy">Privacy Policy</Link>
                <Link to="/terms">Terms of Service</Link>
                <Link to="/cookies">Cookie Policy</Link>
                <Link to="/refund">Refund Policy</Link>
                <Link to="/data-processing">Data Processing</Link>
                <Link to="/gdpr">GDPR & Compliance</Link>
              </div>
            </div>
          </div>

          <div className="lp-footer-bottom">
            <div className="lp-copyright">© {new Date().getFullYear()} BR30 CRM. All rights reserved.</div>

            <div className="lp-footer-version">V 1.2.0</div>

            <div className="lp-footer-built">
              Built with <span className="lp-built-heart">❤️</span> by <strong>BR30 Group</strong>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default LandingFooter;
