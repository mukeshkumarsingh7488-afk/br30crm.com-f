import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, Menu, Monitor, Moon, Sun, X } from "lucide-react";

const productItems = [
  { label: "Overview", target: "dashboard" },
  { label: "Features", target: "features" },
  { label: "One CRM", target: "OneCRM" },
  { label: "Pricing", target: "pricing" },
  { label: "Workflow", target: "workflow" },
  { label: "What's New", path: "/whats-new" },
  { label: "Announcements", path: "/announcements" },
];

const companyItems = [
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
  { label: "Careers", path: "/careers" },
  { label: "Blog", path: "/blog" },
  { label: "Ecosystem", path: "/ecosystem" },
  { label: "Consultants", path: "/consultants" },
];

const solutionsItems = [
  { label: "Sales Management", path: "/sales-management" },
  { label: "Lead Management", path: "/lead-management" },
  { label: "Customer Management", path: "/customer-management" },
  { label: "Team Management", path: "/team-management" },
  { label: "Business Operations", path: "/business-operations" },
  { label: "Reporting & Analytics", path: "/reporting-analytics" },
];

const resourceItems = [
  { label: "Help Center", path: "/help" },
  { label: "Documentation", path: "/documentation" },
  { label: "FAQ", path: "/faq" },
  { label: "Security", path: "/security" },
  { label: "System Status", path: "/system-status" },
  { label: "Trust Center", path: "/trust-center" },
];

const legalItems = [
  { label: "Privacy Policy", path: "/privacy" },
  { label: "Terms of Service", path: "/terms" },
  { label: "Cookie Policy", path: "/cookies" },
  { label: "Refund Policy", path: "/refund" },
  { label: "Data Processing", path: "/data-processing" },
  { label: "GDPR & Compliance", path: "/gdpr" },
];

function LandingNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [theme, setTheme] = useState(localStorage.getItem("crm-theme") || "light");

  const [mobileOpen, setMobileOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileDropdown, setMobileDropdown] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  const themeRef = useRef(null);
  const navRef = useRef(null);
  const dropdownCloseTimerRef = useRef(null);

  useEffect(() => {
    const applyTheme = () => {
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

      const activeTheme = theme === "system" ? (systemDark ? "dark" : "light") : theme;

      document.documentElement.setAttribute("data-theme", activeTheme);
      document.documentElement.style.colorScheme = activeTheme;
      localStorage.setItem("crm-theme", theme);
    };

    applyTheme();

    const media = window.matchMedia("(prefers-color-scheme: dark)");

    media.addEventListener?.("change", applyTheme);

    return () => {
      media.removeEventListener?.("change", applyTheme);
    };
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (themeRef.current && !themeRef.current.contains(event.target)) {
        setThemeOpen(false);
      }

      if (navRef.current && !navRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (dropdownCloseTimerRef.current) {
        clearTimeout(dropdownCloseTimerRef.current);
      }
    };
  }, []);

  const cancelDropdownClose = () => {
    if (dropdownCloseTimerRef.current) {
      clearTimeout(dropdownCloseTimerRef.current);
      dropdownCloseTimerRef.current = null;
    }
  };

  const openDesktopDropdown = (name) => {
    cancelDropdownClose();
    setOpenDropdown(name);
  };

  const closeDesktopDropdown = () => {
    cancelDropdownClose();

    dropdownCloseTimerRef.current = setTimeout(() => {
      setOpenDropdown(null);
      dropdownCloseTimerRef.current = null;
    }, 300);
  };

  const closeNavigation = () => {
    cancelDropdownClose();
    setMobileOpen(false);
    setMobileDropdown(null);
    setOpenDropdown(null);
    setThemeOpen(false);
  };

  useEffect(() => {
    if (!mobileOpen) return;

    const handleOutsidePointerDown = (event) => {
      const target = event.target;

      if (target.closest(".br30-mobile-btn") || target.closest(".br30-mobile-panel")) {
        return;
      }

      closeNavigation();
    };

    document.addEventListener("pointerdown", handleOutsidePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handleOutsidePointerDown);
    };
  }, [mobileOpen]);

  const scrollToSection = (target) => {
    closeNavigation();

    if (location.pathname === "/") {
      const element = document.getElementById(target);

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        return;
      }

      if (target === "home") {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });

        return;
      }
    }

    navigate(`/?section=${target}`);
  };

  useEffect(() => {
    if (location.pathname !== "/") {
      return;
    }

    const params = new URLSearchParams(location.search);
    const section = params.get("section");

    if (!section) {
      return;
    }

    const timer = setTimeout(() => {
      const element = document.getElementById(section);

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }

      navigate("/", {
        replace: true,
      });
    }, 120);

    return () => clearTimeout(timer);
  }, [location.pathname, location.search, navigate]);

  const selectTheme = (value) => {
    setTheme(value);
    setThemeOpen(false);
  };

  const handleDropdownNavigate = (item) => {
    if (item.empty) {
      return;
    }

    if (item.target) {
      scrollToSection(item.target);
      return;
    }

    if (item.path) {
      closeNavigation();
      navigate(item.path);
    }
  };

  const handleHomeClick = () => {
    closeNavigation();

    if (location.pathname === "/") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      navigate("/");
    }
  };

  const toggleMobileDropdown = (name) => {
    setMobileDropdown((current) => (current === name ? null : name));
  };

  const ThemeIcon = theme === "light" ? Sun : theme === "dark" ? Moon : Monitor;

  return (
    <>
      <style>{`.br30-navbar{position:fixed;top:0;left:0;right:0;z-index:1000;height:74px;display:flex;align-items:center;padding:0 24px;background:color-mix(in srgb,var(--crm-surface) 88%,transparent);border-bottom:1px solid transparent;backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px)}.br30-navbar.scrolled{background:color-mix(in srgb,var(--crm-surface) 96%,transparent);border-bottom-color:var(--crm-border);box-shadow:0 5px 25px rgba(15,23,42,.05)}.br30-navbar-inner{width:100%;max-width:1240px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:20px}.br30-navbar-brand{display:flex;align-items:center;gap:10px;flex:none;padding:0;border:0;background:transparent;color:var(--crm-text);text-decoration:none;cursor:pointer}.br30-navbar-logo{width:34px;height:34px;object-fit:cover;border-radius:9px;border:1px solid var(--crm-border);background:var(--crm-primary-soft)}.br30-navbar-brand-text{display:flex;flex-direction:column;line-height:1;text-align:left}.br30-navbar-brand-name{color:var(--crm-text);font-size:15px;font-weight:400;letter-spacing:-.3px}.br30-navbar-brand-crm{color:var(--crm-primary)}.br30-navbar-brand-sub{margin-top:4px;color:var(--crm-muted);font-size:13px;font-weight:400;letter-spacing:.02em}.br30-navbar-nav{display:flex;align-items:center;justify-content:center;gap:3px;margin-left:auto;margin-right:auto}.br30-navbar-item{position:relative;height:38px;display:flex;align-items:center}.br30-navbar-link{height:38px;padding:0 13px;border:0;border-radius:9px;background:transparent;color:var(--crm-muted);font-size:13px;font-weight:400;cursor:pointer;transition:.18s ease}.br30-navbar-link:hover,.br30-navbar-item.open>.br30-navbar-link{color:var(--crm-text);background:var(--crm-surface-2)}.br30-navbar-link.dropdown-link{display:flex;align-items:center;gap:5px}.br30-navbar-link.dropdown-link svg{transition:transform .18s ease}.br30-navbar-item.open>.br30-navbar-link svg{transform:rotate(180deg)}.br30-navbar-dropdown{position:absolute;top:38px;left:50%;transform:translateX(-50%) translateY(-4px);min-width:178px;padding:10px 6px 6px;border:1px solid var(--crm-border);border-radius:12px;background:var(--crm-surface);box-shadow:var(--crm-shadow-lg);opacity:0;visibility:hidden;pointer-events:none;transition:opacity .16s ease,transform .16s ease,visibility .16s ease;z-index:1005}.br30-navbar-dropdown::before{content:"";position:absolute;left:-10px;right:-10px;top:-14px;height:16px;pointer-events:auto}.br30-navbar-item.open>.br30-navbar-dropdown{opacity:1;visibility:visible;pointer-events:auto;transform:translateX(-50%) translateY(0)}.br30-navbar-dropdown-item{width:100%;min-height:36px;padding:0 10px;display:flex;align-items:center;border:0;border-radius:8px;background:transparent;color:var(--crm-muted);font-size:13px;font-weight:400;text-align:left;text-decoration:none;cursor:pointer;white-space:nowrap;transition:.16s ease}.br30-navbar-dropdown-item:hover{background:var(--crm-surface-2);color:var(--crm-text)}.br30-navbar-dropdown-item.empty{opacity:.45;cursor:default}.br30-navbar-dropdown-item.empty:hover{background:transparent;color:var(--crm-muted)}.br30-navbar-actions{display:flex;align-items:center;gap:7px;flex:none}.br30-theme-wrap{position:relative}.br30-theme-btn{height:38px;min-width:38px;padding:0 10px;display:flex;align-items:center;justify-content:center;gap:5px;border:1px solid var(--crm-border);border-radius:9px;background:var(--crm-surface);color:var(--crm-text);cursor:pointer}.br30-theme-btn:hover{background:var(--crm-surface-2)}.br30-theme-btn span{font-size:13px;font-weight:400}.br30-theme-menu{position:absolute;top:46px;right:0;width:145px;padding:5px;border:1px solid var(--crm-border);border-radius:12px;background:var(--crm-surface);box-shadow:var(--crm-shadow-lg)}.br30-theme-option{width:100%;height:36px;padding:0 9px;display:flex;align-items:center;gap:9px;border:0;border-radius:8px;background:transparent;color:var(--crm-muted);font-size:13px;font-weight:400;text-align:left;cursor:pointer}.br30-theme-option:hover{background:var(--crm-surface-2);color:var(--crm-text)}.br30-theme-option.active{background:var(--crm-primary-soft);color:var(--crm-primary)}.br30-login-btn{height:38px;padding:0 13px;display:flex;align-items:center;justify-content:center;border:1px solid var(--crm-border);border-radius:9px;background:var(--crm-surface);color:var(--crm-text);text-decoration:none;font-size:13px;font-weight:400}.br30-login-btn:hover{background:var(--crm-surface-2)}.br30-start-btn{height:38px;padding:0 15px;display:flex;align-items:center;justify-content:center;border:1px solid var(--crm-primary);border-radius:9px;background:var(--crm-primary);color:#fff;text-decoration:none;font-size:13px;font-weight:400;box-shadow:0 5px 14px color-mix(in srgb,var(--crm-primary) 20%,transparent)}.br30-start-btn:hover{background:var(--crm-primary-hover);border-color:var(--crm-primary-hover);transform:translateY(-1px)}.br30-mobile-btn{width:38px;height:38px;display:none;place-items:center;border:1px solid var(--crm-border);border-radius:9px;background:var(--crm-surface);color:var(--crm-text);cursor:pointer}.br30-mobile-panel{display:none}@media(max-width:950px){.br30-navbar-nav{display:none}.br30-mobile-btn{display:grid}.br30-navbar-actions{margin-left:auto}.br30-mobile-panel{position:absolute;top:78px;left:16px;right:16px;display:flex;flex-direction:column;padding:8px;border:1px solid var(--crm-border);border-radius:14px;background:var(--crm-surface);box-shadow:var(--crm-shadow-lg);max-height:calc(100vh - 95px);overflow-y:auto}.br30-mobile-link{width:100%;min-height:43px;padding:0 12px;border:0;border-radius:9px;background:transparent;color:var(--crm-muted);text-align:left;font-size:13px;font-weight:400;cursor:pointer}.br30-mobile-link:hover{background:var(--crm-surface-2);color:var(--crm-text)}.br30-mobile-dropdown-wrap{width:100%}.br30-mobile-dropdown-toggle{width:100%;height:43px;padding:0 12px;display:flex;align-items:center;justify-content:space-between;border:0;border-radius:9px;background:transparent;color:var(--crm-muted);font:inherit;font-size:13px;font-weight:400;text-align:left;cursor:pointer}.br30-mobile-dropdown-toggle:hover{background:var(--crm-surface-2);color:var(--crm-text)}.br30-mobile-dropdown-toggle svg{transition:transform .18s ease}.br30-mobile-dropdown-wrap.open>.br30-mobile-dropdown-toggle{background:var(--crm-surface-2);color:var(--crm-text)}.br30-mobile-dropdown-wrap.open>.br30-mobile-dropdown-toggle svg{transform:rotate(180deg)}.br30-mobile-dropdown{display:flex;flex-direction:column;gap:2px;padding:3px 0 5px 10px}.br30-mobile-dropdown-item{width:100%;min-height:39px;padding:0 12px;display:flex;align-items:center;border:0;border-radius:8px;background:transparent;color:var(--crm-muted);font-size:13px;font-weight:400;text-decoration:none;text-align:left;cursor:pointer}.br30-mobile-dropdown-item:hover{background:var(--crm-surface-2);color:var(--crm-text)}.br30-mobile-dropdown-item.empty{opacity:.45;cursor:default}.br30-mobile-dropdown-item.empty:hover{background:transparent;color:var(--crm-muted)}.br30-mobile-divider{height:1px;margin:6px 4px;background:var(--crm-border)}.br30-mobile-cta{width:100%;height:42px;display:flex;align-items:center;justify-content:center;margin-top:4px;border-radius:9px;background:var(--crm-primary);color:#fff;text-decoration:none;font-size:13px;font-weight:400}}@media(max-width:520px){.br30-navbar{height:66px;padding:0 15px}.br30-navbar-brand-sub{display:none}.br30-navbar-logo{width:32px;height:32px}.br30-navbar-brand-name{font-size:14px}.br30-login-btn{display:none}.br30-theme-btn span{display:none}.br30-mobile-panel{top:70px;left:10px;right:10px}}`}</style>

      <header className={`br30-navbar${scrolled ? " scrolled" : ""}`} ref={navRef}>
        <div className="br30-navbar-inner">
          <button className="br30-navbar-brand" onClick={handleHomeClick} type="button">
            <img className="br30-navbar-logo" src="/favicon-32x32.png" alt="BR30 CRM" />

            <span className="br30-navbar-brand-text">
              <span className="br30-navbar-brand-name">
                BR30 <span className="br30-navbar-brand-crm">CRM</span>
              </span>

              <span className="br30-navbar-brand-sub">Business workspace</span>
            </span>
          </button>

          <nav className="br30-navbar-nav">
            <div className="br30-navbar-item">
              <button className="br30-navbar-link" type="button" onClick={handleHomeClick}>
                Home
              </button>
            </div>

            <div className={`br30-navbar-item${openDropdown === "product" ? " open" : ""}`} onMouseEnter={() => openDesktopDropdown("product")} onMouseLeave={closeDesktopDropdown}>
              <button className="br30-navbar-link dropdown-link" type="button">
                Product
                <ChevronDown size={12} />
              </button>

              <div className="br30-navbar-dropdown" onMouseEnter={cancelDropdownClose} onMouseLeave={closeDesktopDropdown}>
                {productItems.map((item) => (
                  <button key={item.label} type="button" className={`br30-navbar-dropdown-item${item.empty ? " empty" : ""}`} onClick={() => handleDropdownNavigate(item)} disabled={item.empty}>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className={`br30-navbar-item${openDropdown === "company" ? " open" : ""}`} onMouseEnter={() => openDesktopDropdown("company")} onMouseLeave={closeDesktopDropdown}>
              <button className="br30-navbar-link dropdown-link" type="button">
                Company
                <ChevronDown size={12} />
              </button>

              <div className="br30-navbar-dropdown" onMouseEnter={cancelDropdownClose} onMouseLeave={closeDesktopDropdown}>
                {companyItems.map((item) => (
                  <button key={item.label} type="button" className="br30-navbar-dropdown-item" onClick={() => handleDropdownNavigate(item)}>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className={`br30-navbar-item${openDropdown === "solutions" ? " open" : ""}`} onMouseEnter={() => openDesktopDropdown("solutions")} onMouseLeave={closeDesktopDropdown}>
              <button className="br30-navbar-link dropdown-link" type="button">
                Solutions
                <ChevronDown size={12} />
              </button>

              <div className="br30-navbar-dropdown" onMouseEnter={cancelDropdownClose} onMouseLeave={closeDesktopDropdown}>
                {solutionsItems.map((item) => (
                  <button key={item.label} type="button" className="br30-navbar-dropdown-item" onClick={() => handleDropdownNavigate(item)}>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className={`br30-navbar-item${openDropdown === "resources" ? " open" : ""}`} onMouseEnter={() => openDesktopDropdown("resources")} onMouseLeave={closeDesktopDropdown}>
              <button className="br30-navbar-link dropdown-link" type="button">
                Resources
                <ChevronDown size={12} />
              </button>

              <div className="br30-navbar-dropdown" onMouseEnter={cancelDropdownClose} onMouseLeave={closeDesktopDropdown}>
                {resourceItems.map((item) => (
                  <button key={item.label} type="button" className="br30-navbar-dropdown-item" onClick={() => handleDropdownNavigate(item)}>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className={`br30-navbar-item${openDropdown === "legal" ? " open" : ""}`} onMouseEnter={() => openDesktopDropdown("legal")} onMouseLeave={closeDesktopDropdown}>
              <button className="br30-navbar-link dropdown-link" type="button">
                Legal
                <ChevronDown size={12} />
              </button>

              <div className="br30-navbar-dropdown" onMouseEnter={cancelDropdownClose} onMouseLeave={closeDesktopDropdown}>
                {legalItems.map((item) => (
                  <button key={item.label} type="button" className="br30-navbar-dropdown-item" onClick={() => handleDropdownNavigate(item)}>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="br30-navbar-item">
              <button
                className="br30-navbar-link"
                type="button"
                onClick={() => {
                  closeNavigation();
                  navigate("/contact");
                }}>
                Contact
              </button>
            </div>
          </nav>

          <div className="br30-navbar-actions">
            <div className="br30-theme-wrap" ref={themeRef}>
              <button className="br30-theme-btn" type="button" onClick={() => setThemeOpen((value) => !value)} aria-label="Change theme">
                <ThemeIcon size={16} />

                <span>{theme === "light" ? "Light" : theme === "dark" ? "Dark" : "Device"}</span>

                <ChevronDown size={12} />
              </button>

              {themeOpen && (
                <div className="br30-theme-menu">
                  <button className={`br30-theme-option${theme === "light" ? " active" : ""}`} type="button" onClick={() => selectTheme("light")}>
                    <Sun size={14} />
                    Light
                  </button>

                  <button className={`br30-theme-option${theme === "dark" ? " active" : ""}`} type="button" onClick={() => selectTheme("dark")}>
                    <Moon size={14} />
                    Dark
                  </button>

                  <button className={`br30-theme-option${theme === "system" ? " active" : ""}`} type="button" onClick={() => selectTheme("system")}>
                    <Monitor size={14} />
                    Device
                  </button>
                </div>
              )}
            </div>

            <a href="/login" className="br30-login-btn">
              Login
            </a>

            <a href="/register" className="br30-start-btn">
              Get Started
            </a>

            <button
              className="br30-mobile-btn"
              type="button"
              onClick={() => {
                setMobileOpen((value) => !value);
                setMobileDropdown(null);
                setThemeOpen(false);
                setOpenDropdown(null);
              }}
              aria-label="Open navigation">
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="br30-mobile-panel">
            <button className="br30-mobile-link" type="button" onClick={handleHomeClick}>
              Home
            </button>

            <div className={`br30-mobile-dropdown-wrap${mobileDropdown === "product" ? " open" : ""}`}>
              <button className="br30-mobile-dropdown-toggle" type="button" onClick={() => toggleMobileDropdown("product")}>
                <span>Product</span>
                <ChevronDown size={14} />
              </button>

              {mobileDropdown === "product" && (
                <div className="br30-mobile-dropdown">
                  {productItems.map((item) => (
                    <button key={item.label} type="button" className={`br30-mobile-dropdown-item${item.empty ? " empty" : ""}`} onClick={() => handleDropdownNavigate(item)} disabled={item.empty}>
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className={`br30-mobile-dropdown-wrap${mobileDropdown === "company" ? " open" : ""}`}>
              <button className="br30-mobile-dropdown-toggle" type="button" onClick={() => toggleMobileDropdown("company")}>
                <span>Company</span>
                <ChevronDown size={14} />
              </button>

              {mobileDropdown === "company" && (
                <div className="br30-mobile-dropdown">
                  {companyItems.map((item) => (
                    <button key={item.label} type="button" className="br30-mobile-dropdown-item" onClick={() => handleDropdownNavigate(item)}>
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className={`br30-mobile-dropdown-wrap${mobileDropdown === "resources" ? " open" : ""}`}>
              <button className="br30-mobile-dropdown-toggle" type="button" onClick={() => toggleMobileDropdown("resources")}>
                <span>Resources</span>
                <ChevronDown size={14} />
              </button>

              {mobileDropdown === "resources" && (
                <div className="br30-mobile-dropdown">
                  {resourceItems.map((item) => (
                    <button key={item.label} type="button" className="br30-mobile-dropdown-item" onClick={() => handleDropdownNavigate(item)}>
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className={`br30-mobile-dropdown-wrap${mobileDropdown === "legal" ? " open" : ""}`}>
              <button className="br30-mobile-dropdown-toggle" type="button" onClick={() => toggleMobileDropdown("legal")}>
                <span>Legal</span>
                <ChevronDown size={14} />
              </button>

              {mobileDropdown === "legal" && (
                <div className="br30-mobile-dropdown">
                  {legalItems.map((item) => (
                    <button key={item.label} type="button" className="br30-mobile-dropdown-item" onClick={() => handleDropdownNavigate(item)}>
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              className="br30-mobile-link"
              type="button"
              onClick={() => {
                closeNavigation();
                navigate("/contact");
              }}>
              Contact
            </button>

            <div className="br30-mobile-divider" />

            <a href="/login" className="br30-mobile-cta" onClick={() => setMobileOpen(false)}>
              Get Started
            </a>
          </div>
        )}
      </header>
    </>
  );
}

export default LandingNavbar;
