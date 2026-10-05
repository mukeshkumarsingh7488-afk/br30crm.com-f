import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole, Mail, Phone, ShieldCheck, UserRound, UserPlus } from "lucide-react";

import { register } from "../../api/auth";
import AuthLayout from "../../components/auth/AuthLayout";
import { showAuthAlert } from "../../components/auth/authAlert";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [legalAccepted, setLegalAccepted] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const phone = form.phone.trim();
    const password = form.password;
    const confirmPassword = form.confirmPassword;

    if (!name) {
      showAuthAlert({
        icon: "warning",
        title: "Name required",
        text: "Please enter your full name.",
      });
      return;
    }

    if (name.length < 2) {
      showAuthAlert({
        icon: "warning",
        title: "Invalid name",
        text: "Please enter a valid name.",
      });
      return;
    }

    if (!email) {
      showAuthAlert({
        icon: "warning",
        title: "Email required",
        text: "Please enter your email address.",
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showAuthAlert({
        icon: "warning",
        title: "Invalid email",
        text: "Please enter a valid email address.",
      });
      return;
    }

    if (!phone) {
      showAuthAlert({
        icon: "warning",
        title: "Phone required",
        text: "Please enter your phone number.",
      });
      return;
    }

    if (!/^[0-9+\-\s()]{7,20}$/.test(phone)) {
      showAuthAlert({
        icon: "warning",
        title: "Invalid phone number",
        text: "Please enter a valid phone number.",
      });
      return;
    }

    if (!password) {
      showAuthAlert({
        icon: "warning",
        title: "Password required",
        text: "Please create a password.",
      });
      return;
    }

    if (password.length < 8) {
      showAuthAlert({
        icon: "warning",
        title: "Password too short",
        text: "Your password must contain at least 8 characters.",
      });
      return;
    }

    if (password !== confirmPassword) {
      showAuthAlert({
        icon: "warning",
        title: "Passwords do not match",
        text: "Please make sure both passwords are the same.",
      });
      return;
    }

    if (!legalAccepted) {
      showAuthAlert({
        icon: "warning",
        title: "Legal agreement required",
        text: "Please accept the legal policies before creating your account.",
      });
      return;
    }

    try {
      setLoading(true);

      const response = await register({
        name,
        email,
        phone,
        password,

        // Legal consent information
        legalConsent: {
          accepted: true,
          acceptedAt: new Date().toISOString(),
          pages: ["/privacy", "/terms", "/cookies"],
        },
      });

      const responseData = response?.data || response;

      await showAuthAlert({
        icon: "success",
        title: "Account created!",
        text: responseData?.message || "Your account has been created. Please verify your email.",
        timer: 1600,
        showConfirmButton: false,
      });

      navigate("/verify-email", {
        state: {
          email,
        },
      });
    } catch (err) {
      console.error("Register error:", err);

      const status = err?.response?.status;
      const data = err?.response?.data;

      const message = data?.message || data?.error?.message || err?.message || "Unable to create your account. Please try again.";

      if (status === 409) {
        showAuthAlert({
          icon: "warning",
          title: "Account already exists",
          text: message,
        });
        return;
      }

      showAuthAlert({
        icon: "error",
        title: "Registration failed",
        text: message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="auth-login-layout auth-register-layout">
        {/* LEFT CONTENT */}
        <div className="auth-login-intro" style={{ transform: "translateY(-1.5in)" }}>
          <div className="auth-intro-badge">
            <UserPlus size={14} />
            Start your workspace
          </div>

          <h1>
            Build your business
            <br />
            with <span>BR30 CRM.</span>
          </h1>

          <p className="auth-intro-description">Create your BR30 CRM account and bring customers, sales, deals, tasks and everyday business operations into one organized workspace.</p>

          <div className="auth-benefits">
            <div className="auth-benefit">
              <span className="auth-benefit-icon">
                <ShieldCheck size={14} />
              </span>
              Secure account authentication
            </div>

            <div className="auth-benefit">
              <span className="auth-benefit-icon">
                <UserRound size={14} />
              </span>
              Manage your business workspace
            </div>

            <div className="auth-benefit">
              <span className="auth-benefit-icon">
                <Mail size={14} />
              </span>
              Email verification for account security
            </div>
          </div>

          <div className="auth-intro-security">
            <ShieldCheck size={14} />
            Your information is protected with secure authentication.
          </div>
        </div>

        {/* REGISTER CARD */}
        <div className="auth-card">
          <div className="auth-card-header">
            <div className="auth-icon">
              <UserPlus size={22} />
            </div>

            <div>
              <h2>Create your account</h2>
              <p>Set up your BR30 CRM workspace.</p>
            </div>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {/* NAME */}
            <div className="auth-field">
              <label htmlFor="name">Full name</label>

              <div className="auth-input-wrap">
                <UserRound size={18} className="auth-input-icon" />

                <input id="name" name="name" type="text" value={form.name} onChange={handleChange} placeholder="Enter your full name" autoComplete="name" disabled={loading} />
              </div>
            </div>

            {/* EMAIL */}
            <div className="auth-field">
              <label htmlFor="email">Email address</label>

              <div className="auth-input-wrap">
                <Mail size={18} className="auth-input-icon" />

                <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" autoComplete="email" disabled={loading} />
              </div>
            </div>

            {/* PHONE */}
            <div className="auth-field">
              <label htmlFor="phone">Phone number</label>

              <div className="auth-input-wrap">
                <Phone size={18} className="auth-input-icon" />

                <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="Enter your phone number" autoComplete="tel" inputMode="tel" disabled={loading} />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="auth-field">
              <label htmlFor="password">Password</label>

              <div className="auth-input-wrap">
                <LockKeyhole size={18} className="auth-input-icon" />

                <input id="password" name="password" type={showPassword ? "text" : "password"} value={form.password} onChange={handleChange} placeholder="Create a password" autoComplete="new-password" disabled={loading} />

                <button type="button" className="auth-password-toggle" onClick={() => setShowPassword((prev) => !prev)} aria-label={showPassword ? "Hide password" : "Show password"} disabled={loading}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="auth-field">
              <label htmlFor="confirmPassword">Confirm password</label>

              <div className="auth-input-wrap">
                <LockKeyhole size={18} className="auth-input-icon" />

                <input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={form.confirmPassword} onChange={handleChange} placeholder="Confirm your password" autoComplete="new-password" disabled={loading} />

                <button type="button" className="auth-password-toggle" onClick={() => setShowConfirmPassword((prev) => !prev)} aria-label={showConfirmPassword ? "Hide password" : "Show password"} disabled={loading}>
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* LEGAL CONSENT */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "9px",
                marginTop: "2px",
                marginBottom: "2px",
                fontSize: "13px",
                lineHeight: "1.55",
              }}>
              <input
                id="legalAccepted"
                type="checkbox"
                checked={legalAccepted}
                onChange={(event) => setLegalAccepted(event.target.checked)}
                disabled={loading}
                style={{
                  marginTop: "3px",
                  flexShrink: 0,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              />

              <label
                htmlFor="legalAccepted"
                style={{
                  cursor: loading ? "not-allowed" : "pointer",
                }}>
                I agree to the{" "}
                <Link
                  to="/privacy"
                  style={{
                    textDecoration: "none",
                  }}
                  onMouseEnter={(event) => {
                    event.currentTarget.style.color = "#4f8cff";
                  }}
                  onMouseLeave={(event) => {
                    event.currentTarget.style.color = "";
                  }}>
                  Privacy Policy
                </Link>
                ,{" "}
                <Link
                  to="/terms"
                  style={{
                    textDecoration: "none",
                  }}
                  onMouseEnter={(event) => {
                    event.currentTarget.style.color = "#4f8cff";
                  }}
                  onMouseLeave={(event) => {
                    event.currentTarget.style.color = "";
                  }}>
                  Terms of Service
                </Link>
                , and{" "}
                <Link
                  to="/cookies"
                  style={{
                    textDecoration: "none",
                  }}
                  onMouseEnter={(event) => {
                    event.currentTarget.style.color = "#4f8cff";
                  }}
                  onMouseLeave={(event) => {
                    event.currentTarget.style.color = "";
                  }}>
                  Cookie Policy
                </Link>
                .
              </label>
            </div>

            {/* SUBMIT */}
            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="auth-spinner" />
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus size={16} />
                  Create account
                </>
              )}
            </button>
          </form>

          {/* LOGIN */}
          <div className="auth-divider">
            <span>Already have an account?</span>
          </div>

          <Link to="/login" className="auth-secondary-btn">
            Sign in to your account
          </Link>

          {/* SECURITY */}
          <p className="auth-card-security">
            <ShieldCheck size={15} />
            You'll need to verify your email before signing in.
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}

export default Register;
