import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, KeyRound, Mail, ShieldCheck } from "lucide-react";

import AuthLayout from "../../components/auth/AuthLayout";
import { showAuthAlert } from "../../components/auth/authAlert";
import { forgotPassword } from "../../api/auth";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      showAuthAlert({
        icon: "warning",
        title: "Email required",
        text: "Please enter your registered email address.",
      });
      return;
    }

    try {
      setLoading(true);

      const response = await forgotPassword({
        email: normalizedEmail,
      });

      const responseData = response?.data || response;

      await showAuthAlert({
        icon: "success",
        title: "OTP sent",
        text: responseData?.message || "A password reset OTP has been sent to your email address.",
        timer: 1800,
        showConfirmButton: false,
      });

      navigate("/verify-reset-otp", {
        state: {
          email: normalizedEmail,
        },
      });
    } catch (error) {
      console.error("Forgot password error:", error);

      const status = error?.response?.status;
      const data = error?.response?.data;

      const message = data?.message || data?.error?.message || error?.message || "Unable to send the password reset OTP. Please try again.";

      showAuthAlert({
        icon: status === 429 ? "warning" : "error",
        title: status === 429 ? "Please wait" : "Request failed",
        text: message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="auth-login-layout">
        {/* LEFT SIDE */}
        <div className="auth-login-intro">
          <div className="auth-intro-badge">
            <KeyRound size={15} />
            Account recovery
          </div>

          <h1>
            Reset your <span>password.</span>
          </h1>

          <p className="auth-intro-description">Forgot your BR30 CRM password? Enter your registered email address and we&apos;ll send you a secure OTP to reset it.</p>

          <div className="auth-benefits">
            <div className="auth-benefit">
              <span className="auth-benefit-icon">
                <Mail size={14} />
              </span>
              Reset instructions sent to your email
            </div>

            <div className="auth-benefit">
              <span className="auth-benefit-icon">
                <KeyRound size={14} />
              </span>
              Secure OTP-based verification
            </div>

            <div className="auth-benefit">
              <span className="auth-benefit-icon">
                <ShieldCheck size={14} />
              </span>
              Your account remains protected
            </div>
          </div>

          <div className="auth-intro-security">
            <ShieldCheck size={15} />
            Secure account recovery powered by BR30 CRM.
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="auth-card">
          <div className="auth-card-header">
            <div className="auth-icon">
              <KeyRound size={22} />
            </div>

            <div>
              <h2>Forgot password?</h2>
              <p>We&apos;ll help you get back into your account.</p>
            </div>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label htmlFor="email">Email address</label>

              <div className="auth-input-wrap">
                <Mail size={18} className="auth-input-icon" />

                <input id="email" name="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" disabled={loading} />
              </div>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="auth-spinner" />
                  Sending OTP...
                </>
              ) : (
                <>
                  <KeyRound size={16} />
                  Send reset OTP
                </>
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>Remember your password?</span>
          </div>

          <Link to="/login" className="auth-secondary-btn">
            <ArrowLeft size={15} />
            Back to login
          </Link>

          <p className="auth-card-security">
            <ShieldCheck size={15} />
            Your account information is kept secure.
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}

export default ForgotPassword;
