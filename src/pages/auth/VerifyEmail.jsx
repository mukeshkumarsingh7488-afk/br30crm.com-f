import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Mail, RefreshCw, ShieldCheck } from "lucide-react";

import { verifyEmail, resendOtp } from "../../api/auth";
import AuthLayout from "../../components/auth/AuthLayout";
import { showAuthAlert } from "../../components/auth/authAlert";

function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();

  const initialEmail = location.state?.email || "";

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = window.setInterval(() => {
      setCountdown((previous) => {
        if (previous <= 1) {
          window.clearInterval(timer);
          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [countdown]);

  const maskedEmail = useMemo(() => {
    const value = email.trim();

    if (!value || !value.includes("@")) {
      return value;
    }

    const [username, domain] = value.split("@");

    if (username.length <= 2) {
      return `${username[0] || ""}***@${domain}`;
    }

    return `${username.slice(0, 2)}***@${domain}`;
  }, [email]);

  const handleOtpChange = (event) => {
    const value = event.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
  };

  const handleVerify = async (event) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedOtp = otp.trim();

    if (!normalizedEmail) {
      showAuthAlert({
        icon: "warning",
        title: "Email required",
        text: "Please enter your email address.",
      });
      return;
    }

    if (!normalizedOtp) {
      showAuthAlert({
        icon: "warning",
        title: "OTP required",
        text: "Please enter the verification OTP.",
      });
      return;
    }

    if (normalizedOtp.length !== 6) {
      showAuthAlert({
        icon: "warning",
        title: "Invalid OTP",
        text: "Please enter the complete 6-digit OTP.",
      });
      return;
    }

    try {
      setLoading(true);

      await verifyEmail({
        email: normalizedEmail,
        otp: normalizedOtp,
      });

      await showAuthAlert({
        icon: "success",
        title: "Email verified!",
        text: "Your email has been verified successfully. You can now sign in.",
        timer: 1800,
        showConfirmButton: false,
      });

      navigate("/login", { replace: true });
    } catch (error) {
      const status = error?.response?.status;
      const data = error?.response?.data;

      const message = data?.message || data?.error?.message || error?.message || "Unable to verify your email. Please try again.";

      showAuthAlert({
        icon: status === 429 ? "warning" : "error",
        title: status === 429 ? "Too many attempts" : "Verification failed",
        text: message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      showAuthAlert({
        icon: "warning",
        title: "Email required",
        text: "Please enter your email address first.",
      });
      return;
    }

    if (countdown > 0) {
      showAuthAlert({
        icon: "info",
        title: "Please wait",
        text: `You can request another OTP in ${countdown} seconds.`,
        timer: 1700,
        showConfirmButton: false,
      });
      return;
    }

    try {
      setResending(true);

      await resendOtp({
        email: normalizedEmail,
      });

      setOtp("");
      setCountdown(60);

      await showAuthAlert({
        icon: "success",
        title: "OTP sent",
        text: "A new verification OTP has been sent to your email.",
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (error) {
      const status = error?.response?.status;
      const data = error?.response?.data;

      const message = data?.message || data?.error?.message || error?.message || "Unable to send a new OTP.";

      showAuthAlert({
        icon: status === 429 ? "warning" : "error",
        title: status === 429 ? "Please wait" : "Unable to resend OTP",
        text: message,
      });
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthLayout>
      <div className="auth-login-layout">
        {}
        <section className="auth-login-intro">
          <div className="auth-intro-badge">
            <Mail size={15} />
            Email verification
          </div>

          <h1>
            Verify your <span>email.</span>
          </h1>

          <p className="auth-intro-description">One quick step and your BR30 CRM account will be ready. Enter the verification code we sent to your email address.</p>

          <div className="auth-benefits">
            <div className="auth-benefit">
              <span className="auth-benefit-icon">
                <CheckCircle2 size={14} />
              </span>
              Confirm your email address
            </div>

            <div className="auth-benefit">
              <span className="auth-benefit-icon">
                <ShieldCheck size={14} />
              </span>
              Keep your account secure
            </div>

            <div className="auth-benefit">
              <span className="auth-benefit-icon">
                <Mail size={14} />
              </span>
              Receive important account emails
            </div>
          </div>

          <div className="auth-intro-security">
            <ShieldCheck size={14} />
            Your verification code is private and secure.
          </div>
        </section>

        {}
        <section className="auth-card">
          <div className="auth-card-header">
            <div className="auth-icon">
              <Mail size={22} />
            </div>

            <div>
              <h2>Verify your email</h2>
              <p>{maskedEmail ? `Enter the 6-digit code sent to ${maskedEmail}` : "Enter the 6-digit code sent to your email."}</p>
            </div>
          </div>

          <form className="auth-form" onSubmit={handleVerify}>
            <div className="auth-field">
              <label htmlFor="verify-email">Email address</label>

              <div className="auth-input-wrap">
                <Mail size={18} className="auth-input-icon" />

                <input id="verify-email" name="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" disabled={loading || resending} />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="verification-otp">Verification OTP</label>

              <div className="auth-input-wrap">
                <ShieldCheck size={18} className="auth-input-icon" />

                <input
                  id="verification-otp"
                  name="otp"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={otp}
                  onChange={handleOtpChange}
                  placeholder="Enter 6-digit OTP"
                  autoComplete="one-time-code"
                  disabled={loading}
                  style={{
                    letterSpacing: "0.35em",
                    fontWeight: 400,
                  }}
                />
              </div>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading || resending}>
              {loading ? (
                <>
                  <span className="auth-spinner" />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle2 size={17} />
                  Verify email
                </>
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>Didn't receive the OTP?</span>
          </div>

          <button type="button" className="auth-secondary-btn" onClick={handleResend} disabled={loading || resending || countdown > 0}>
            {resending ? (
              <>
                <span className="auth-spinner auth-spinner-dark" />
                Sending OTP...
              </>
            ) : countdown > 0 ? (
              <>
                <RefreshCw size={15} />
                Resend in {countdown}s
              </>
            ) : (
              <>
                <RefreshCw size={15} />
                Resend OTP
              </>
            )}
          </button>

          <div className="auth-back-link-wrap">
            <Link to="/login" className="auth-back-link">
              <ArrowLeft size={14} />
              Back to login
            </Link>
          </div>

          <p className="auth-card-security">
            <ShieldCheck size={14} />
            Never share your verification code with anyone.
          </p>
        </section>
      </div>
    </AuthLayout>
  );
}

export default VerifyEmail;
