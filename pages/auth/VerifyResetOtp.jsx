import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, Mail, RefreshCw, ShieldCheck } from "lucide-react";

import { verifyResetOtp, resendResetOtp } from "../../api/auth";
import AuthLayout from "../../components/auth/AuthLayout";
import { showAuthAlert } from "../../components/auth/authAlert";

function VerifyResetOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(location.state?.email || sessionStorage.getItem("br30_reset_email") || "");

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (email) {
      sessionStorage.setItem("br30_reset_email", email.trim().toLowerCase());
    }
  }, [email]);

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = window.setInterval(() => {
      setCooldown((previous) => {
        if (previous <= 1) {
          window.clearInterval(timer);
          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [cooldown]);

  const maskedEmail = useMemo(() => {
    const value = email.trim();

    if (!value || !value.includes("@")) {
      return "";
    }

    const [username, domain] = value.split("@");

    if (username.length <= 2) {
      return `${username[0] || ""}***@${domain}`;
    }

    return `${username.slice(0, 2)}***@${domain}`;
  }, [email]);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleOtpChange = (event) => {
    const value = event.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
  };

  const handleVerify = async (event) => {
    event.preventDefault();

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.trim();

    if (!cleanEmail) {
      showAuthAlert({
        icon: "warning",
        title: "Email required",
        text: "Please enter your email address.",
      });
      return;
    }

    if (cleanOtp.length !== 6) {
      showAuthAlert({
        icon: "warning",
        title: "OTP required",
        text: "Please enter the complete 6-digit verification code.",
      });
      return;
    }

    try {
      setLoading(true);

      const response = await verifyResetOtp({
        email: cleanEmail,
        otp: cleanOtp,
      });

      sessionStorage.setItem("br30_reset_email", cleanEmail);
      sessionStorage.setItem("br30_reset_otp", cleanOtp);

      await showAuthAlert({
        icon: "success",
        title: "OTP verified!",
        text: response?.message || "Your OTP has been verified. You can now create a new password.",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/reset-password", {
        replace: true,
        state: {
          email: cleanEmail,
          otp: cleanOtp,
        },
      });
    } catch (error) {
      console.error("Verify reset OTP error:", error);

      const status = error?.response?.status;
      const data = error?.response?.data;

      const message = data?.message || data?.error?.message || (typeof data?.error === "string" ? data.error : null) || error?.message || "Invalid or expired OTP.";

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
    if (resending || cooldown > 0) {
      return;
    }

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      showAuthAlert({
        icon: "warning",
        title: "Email required",
        text: "Please enter your email address first.",
      });
      return;
    }

    try {
      setResending(true);

      const response = await resendResetOtp({
        email: cleanEmail,
      });

      sessionStorage.setItem("br30_reset_email", cleanEmail);
      sessionStorage.removeItem("br30_reset_otp");

      setOtp("");
      setCooldown(60);

      await showAuthAlert({
        icon: "success",
        title: "New OTP sent",
        text: response?.message || "A new password reset OTP has been sent to your email.",
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Resend reset OTP error:", error);

      const status = error?.response?.status;
      const data = error?.response?.data;

      const message = data?.message || data?.error?.message || (typeof data?.error === "string" ? data.error : null) || error?.message || "Unable to resend the OTP.";

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
        {/* LEFT SIDE */}
        <section className="auth-login-intro">
          <div className="auth-intro-badge">
            <ShieldCheck size={15} />
            Secure account recovery
          </div>

          <h1>
            Verify your
            <br />
            <span>reset code.</span>
          </h1>

          <p className="auth-intro-description">Enter the verification code we sent to your email address and securely continue with your BR30 CRM password reset.</p>

          <div className="auth-benefits">
            <div className="auth-benefit">
              <span className="auth-benefit-icon">
                <ShieldCheck size={14} />
              </span>
              Secure OTP authentication
            </div>

            <div className="auth-benefit">
              <span className="auth-benefit-icon">
                <Mail size={14} />
              </span>
              Verification code sent to your email
            </div>

            <div className="auth-benefit">
              <span className="auth-benefit-icon">
                <CheckCircle2 size={14} />
              </span>
              Continue securely to password reset
            </div>
          </div>

          <div className="auth-intro-security">
            <ShieldCheck size={14} />
            Your verification code is private and secure.
          </div>
        </section>

        {/* RIGHT SIDE */}
        <section className="auth-card">
          <div className="auth-card-header">
            <div className="auth-icon">
              <ShieldCheck size={22} />
            </div>

            <div>
              <h2>Verify reset OTP</h2>

              <p>{maskedEmail ? `Enter the 6-digit code sent to ${maskedEmail}` : "Enter the 6-digit verification code sent to your email."}</p>
            </div>
          </div>

          <form className="auth-form" onSubmit={handleVerify}>
            {/* EMAIL */}
            <div className="auth-field">
              <label htmlFor="reset-otp-email">Email address</label>

              <div className="auth-input-wrap">
                <Mail size={18} className="auth-input-icon" />

                <input id="reset-otp-email" name="email" type="email" value={email} onChange={handleEmailChange} placeholder="you@example.com" autoComplete="email" disabled={loading || resending} />
              </div>
            </div>

            {/* OTP */}
            <div className="auth-field">
              <label htmlFor="reset-otp">Verification code</label>

              <div className="auth-input-wrap">
                <ShieldCheck size={18} className="auth-input-icon" />

                <input
                  id="reset-otp"
                  name="otp"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={otp}
                  onChange={handleOtpChange}
                  placeholder="000000"
                  autoComplete="one-time-code"
                  disabled={loading}
                  style={{
                    letterSpacing: "0.35em",
                    fontWeight: 400,
                  }}
                />
              </div>
            </div>

            {/* VERIFY */}
            <button type="submit" className="auth-submit-btn" disabled={loading || resending}>
              {loading ? (
                <>
                  <span className="auth-spinner" />
                  Verifying OTP...
                </>
              ) : (
                <>
                  Verify OTP
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* RESEND */}
          <div className="auth-divider">
            <span>Didn't receive the code?</span>
          </div>

          <button type="button" className="auth-secondary-btn" onClick={handleResend} disabled={resending || loading || cooldown > 0}>
            {resending ? (
              <>
                <span className="auth-spinner auth-spinner-dark" />
                Sending OTP...
              </>
            ) : cooldown > 0 ? (
              <>
                <RefreshCw size={15} />
                Resend in {cooldown}s
              </>
            ) : (
              <>
                <RefreshCw size={15} />
                Resend OTP
              </>
            )}
          </button>

          {/* BACK */}
          <div className="auth-back-link-wrap">
            <Link to="/forgot-password" className="auth-back-link">
              <ArrowLeft size={14} />
              Back to forgot password
            </Link>
          </div>

          <p className="auth-card-security">
            <ShieldCheck size={14} />
            Your account is protected with secure authentication.
          </p>
        </section>
      </div>
    </AuthLayout>
  );
}

export default VerifyResetOtp;
