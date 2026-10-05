import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole, Mail, ShieldCheck, CheckCircle2 } from "lucide-react";

import { login, getCurrentUser } from "../../api/auth";
import AuthLayout from "../../components/auth/AuthLayout";
import { showAuthAlert } from "../../components/auth/authAlert";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const email = form.email.trim().toLowerCase();
    const password = form.password;

    if (!email) {
      showAuthAlert({
        icon: "warning",
        title: "Email required",
        text: "Please enter your email address.",
      });
      return;
    }

    if (!password) {
      showAuthAlert({
        icon: "warning",
        title: "Password required",
        text: "Please enter your password.",
      });
      return;
    }

    try {
      setLoading(true);

      /*
       * ---------------------------------------------------------
       * LOGIN
       * ---------------------------------------------------------
       */

      const response = await login({
        email,
        password,
      });

      const responseData = response?.data || response;

      const accessToken = responseData?.accessToken || response?.accessToken || null;

      let user = responseData?.user || response?.user || null;

      /*
       * ---------------------------------------------------------
       * ACCESS TOKEN CHECK
       * ---------------------------------------------------------
       */

      if (!accessToken) {
        throw new Error("Login successful, but access token was not received.");
      }

      /*
       * ---------------------------------------------------------
       * SAVE TOKEN IMMEDIATELY
       * ---------------------------------------------------------
       */

      localStorage.setItem("token", accessToken);

      /*
       * ---------------------------------------------------------
       * USER DATA
       *
       * Usually login already returns user.
       * If it doesn't, fetch the authenticated user from /auth/me.
       * ---------------------------------------------------------
       */

      if (!user) {
        try {
          const meResponse = await getCurrentUser();

          const meData = meResponse?.data || meResponse;

          user = meData?.user || meResponse?.user || null;
        } catch (meError) {
          console.error("Failed to fetch current user after login:", meError);

          localStorage.removeItem("token");
          localStorage.removeItem("user");

          throw new Error("Login succeeded, but your account information could not be loaded. Please try again.");
        }
      }

      /*
       * ---------------------------------------------------------
       * USER CHECK
       * ---------------------------------------------------------
       */

      if (!user) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        throw new Error("Login succeeded, but user information was not received.");
      }

      /*
       * ---------------------------------------------------------
       * SAVE USER
       * ---------------------------------------------------------
       */

      localStorage.setItem("user", JSON.stringify(user));

      /*
       * ---------------------------------------------------------
       * SUCCESS
       * ---------------------------------------------------------
       */

      const firstName = user?.firstName?.trim() || user?.name?.trim()?.split(" ")[0] || "User";

      await showAuthAlert({
        icon: "success",
        title: `Welcome back, ${firstName}!`,
        text: "You have been signed in successfully.",
        timer: 1400,
        showConfirmButton: false,
      });

      /*
       * ---------------------------------------------------------
       * GO TO DASHBOARD
       * ---------------------------------------------------------
       */

      navigate("/dashboard", {
        replace: true,
      });
    } catch (err) {
      console.error("Login error:", err);

      /*
       * ---------------------------------------------------------
       * NEVER KEEP INVALID LOGIN DATA
       * ---------------------------------------------------------
       */

      const status = err?.response?.status;
      const data = err?.response?.data;

      /*
       * ---------------------------------------------------------
       * BACKEND ERROR MESSAGE
       * ---------------------------------------------------------
       */

      const message = data?.message || data?.error?.message || err?.message || "Unable to sign in. Please check your email and password.";

      /*
       * ---------------------------------------------------------
       * EMAIL VERIFICATION REQUIRED
       * ---------------------------------------------------------
       */

      if (status === 403 && (data?.details?.emailVerificationRequired || data?.data?.emailVerificationRequired || message.toLowerCase().includes("verify your email"))) {
        await showAuthAlert({
          icon: "warning",
          title: "Email verification required",
          text: "Please verify your email before logging in.",
          confirmButtonText: "Verify Email",
        });

        navigate("/verify-email", {
          state: {
            email,
          },
        });

        return;
      }

      /*
       * ---------------------------------------------------------
       * NORMAL LOGIN ERROR
       * ---------------------------------------------------------
       */

      showAuthAlert({
        icon: "error",
        title: "Login failed",
        text: message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <section className="auth-login-layout">
        <div className="auth-login-intro">
          <div className="auth-intro-badge">
            <ShieldCheck size={17} />
            <span>Secure workspace access</span>
          </div>

          <h1>
            Welcome
            <br />
            <span>back.</span>
          </h1>

          <p className="auth-intro-description">Sign in to continue to your BR30 CRM workspace and keep your customers, sales and business operations moving.</p>

          <div className="auth-benefits">
            <div className="auth-benefit">
              <span className="auth-benefit-icon">
                <CheckCircle2 size={15} />
              </span>

              <span>Manage your business from one workspace</span>
            </div>

            <div className="auth-benefit">
              <span className="auth-benefit-icon">
                <CheckCircle2 size={15} />
              </span>

              <span>Keep customer and sales data organized</span>
            </div>

            <div className="auth-benefit">
              <span className="auth-benefit-icon">
                <CheckCircle2 size={15} />
              </span>

              <span>Work securely with your team</span>
            </div>
          </div>

          <div className="auth-intro-security">
            <ShieldCheck size={16} />
            <span>Your account is protected with secure authentication.</span>
          </div>
        </div>

        <div className="auth-card">
          <div className="auth-card-header">
            <div className="auth-icon">
              <ShieldCheck size={22} />
            </div>

            <div>
              <h2>Sign in to your account</h2>
              <p>Enter your details to continue.</p>
            </div>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label htmlFor="email">Email address</label>

              <div className="auth-input-wrap">
                <Mail size={18} className="auth-input-icon" />

                <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" autoComplete="email" disabled={loading} />
              </div>
            </div>

            <div className="auth-field">
              <div className="auth-label-row">
                <label htmlFor="password">Password</label>

                <Link to="/forgot-password" className="auth-small-link">
                  Forgot password?
                </Link>
              </div>

              <div className="auth-input-wrap">
                <LockKeyhole size={18} className="auth-input-icon" />

                <input id="password" name="password" type={showPassword ? "text" : "password"} value={form.password} onChange={handleChange} placeholder="Enter your password" autoComplete="current-password" disabled={loading} />

                <button type="button" className="auth-password-toggle" onClick={() => setShowPassword((prev) => !prev)} aria-label={showPassword ? "Hide password" : "Show password"} disabled={loading}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="auth-spinner" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>New to BR30 CRM?</span>
          </div>

          <Link to="/register" className="auth-secondary-btn">
            Create an account
          </Link>

          <p className="auth-card-security">
            <ShieldCheck size={15} />
            Secure authentication keeps your account protected.
          </p>
        </div>
      </section>
    </AuthLayout>
  );
}

export default Login;
