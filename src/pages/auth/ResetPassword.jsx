import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, KeyRound, LockKeyhole, Mail, ShieldCheck } from "lucide-react";

import { resetPassword } from "../../api/auth";
import AuthLayout from "../../components/auth/AuthLayout";
import { showAuthAlert } from "../../components/auth/authAlert";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const stateEmail = location.state?.email || "";
  const stateOtp = location.state?.otp || "";

  const storedEmail = sessionStorage.getItem("resetPasswordEmail") || "";
  const storedOtp = sessionStorage.getItem("resetPasswordOtp") || "";

  const [form, setForm] = useState({
    email: stateEmail || storedEmail,
    otp: stateOtp || storedOtp,
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    let nextValue = value;

    if (name === "otp") {
      nextValue = value.replace(/\D/g, "").slice(0, 6);
    }

    setForm((prev) => ({
      ...prev,
      [name]: nextValue,
    }));
  };

  const validateForm = () => {
    const email = form.email.trim().toLowerCase();
    const otp = form.otp.trim();

    if (!email) {
      return "Please enter your email address.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Please enter a valid email address.";
    }

    if (!otp) {
      return "Please enter your OTP.";
    }

    if (!/^\d{6}$/.test(otp)) {
      return "OTP must be 6 digits.";
    }

    if (!form.newPassword) {
      return "Please create a new password.";
    }

    if (form.newPassword.length < 8) {
      return "Password must be at least 8 characters.";
    }

    if (form.newPassword.length > 128) {
      return "Password cannot exceed 128 characters.";
    }

    if (!form.confirmPassword) {
      return "Please confirm your new password.";
    }

    if (form.newPassword !== form.confirmPassword) {
      return "Passwords do not match.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      await showAuthAlert({
        icon: "warning",
        title: "Check your details",
        text: validationError,
      });
      return;
    }

    try {
      setLoading(true);

      const response = await resetPassword({
        email: form.email.trim().toLowerCase(),
        otp: form.otp.trim(),
        newPassword: form.newPassword,
      });

      const responseData = response?.data || response;

      if (responseData?.passwordReset === false) {
        throw new Error("Unable to reset your password.");
      }

      sessionStorage.removeItem("resetPasswordEmail");
      sessionStorage.removeItem("resetPasswordOtp");

      await showAuthAlert({
        icon: "success",
        title: "Password reset successfully",
        text: "Your password has been updated. You can now sign in with your new password.",
        timer: 1800,
        showConfirmButton: false,
      });

      navigate("/login", {
        replace: true,
        state: {
          message: "Password reset successfully. Please login with your new password.",
        },
      });
    } catch (err) {
      const message = err?.response?.data?.message || err?.response?.data?.error?.message || err?.message || "Unable to reset your password. Please try again.";

      await showAuthAlert({
        icon: "error",
        title: "Password reset failed",
        text: message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="auth-login-layout">
        {}
        <section className="auth-login-intro">
          <div className="auth-intro-badge">
            <ShieldCheck size={14} />
            Secure account recovery
          </div>

          <h1>
            Create a new
            <br />
            <span>secure password.</span>
          </h1>

          <p className="auth-intro-description">Set a new password for your BR30 CRM account and get back to managing your customers, sales, teams and everyday business workflow securely.</p>

          <div className="auth-benefits">
            <div className="auth-benefit">
              <span className="auth-benefit-icon">
                <ShieldCheck size={14} />
              </span>
              Secure password recovery
            </div>

            <div className="auth-benefit">
              <span className="auth-benefit-icon">
                <KeyRound size={14} />
              </span>
              OTP verified account recovery
            </div>

            <div className="auth-benefit">
              <span className="auth-benefit-icon">
                <LockKeyhole size={14} />
              </span>
              Your new password stays protected
            </div>
          </div>

          <div className="auth-intro-security">
            <ShieldCheck size={14} />
            Your account is protected with secure authentication.
          </div>
        </section>

        {}
        <section className="auth-card">
          <div className="auth-card-header">
            <div className="auth-icon">
              <KeyRound size={21} />
            </div>

            <div>
              <h2>Reset your password</h2>
              <p>Enter your verified OTP and create a new password for your BR30 CRM account.</p>
            </div>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {}
            <div className="auth-field">
              <label htmlFor="reset-email">Email address</label>

              <div className="auth-input-wrap">
                <Mail size={18} className="auth-input-icon" />

                <input id="reset-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={handleChange} disabled={loading} />
              </div>
            </div>

            {}
            <div className="auth-field">
              <label htmlFor="reset-otp">Verification OTP</label>

              <div className="auth-input-wrap">
                <KeyRound size={18} className="auth-input-icon" />

                <input id="reset-otp" name="otp" type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="Enter 6-digit OTP" value={form.otp} onChange={handleChange} disabled={loading} />
              </div>

              <small className="auth-field-hint">Enter the OTP sent to your email address.</small>
            </div>

            {}
            <div className="auth-field">
              <label htmlFor="reset-password">New password</label>

              <div className="auth-input-wrap">
                <LockKeyhole size={18} className="auth-input-icon" />

                <input id="reset-password" name="newPassword" type={showPassword ? "text" : "password"} autoComplete="new-password" placeholder="Minimum 8 characters" value={form.newPassword} onChange={handleChange} disabled={loading} />

                <button type="button" className="auth-password-toggle" onClick={() => setShowPassword((prev) => !prev)} aria-label={showPassword ? "Hide password" : "Show password"} disabled={loading}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {}
            <div className="auth-field">
              <label htmlFor="reset-confirm-password">Confirm new password</label>

              <div className="auth-input-wrap">
                <LockKeyhole size={18} className="auth-input-icon" />

                <input id="reset-confirm-password" name="confirmPassword" type={showConfirmPassword ? "text" : "password"} autoComplete="new-password" placeholder="Re-enter your new password" value={form.confirmPassword} onChange={handleChange} disabled={loading} />

                <button type="button" className="auth-password-toggle" onClick={() => setShowConfirmPassword((prev) => !prev)} aria-label={showConfirmPassword ? "Hide password" : "Show password"} disabled={loading}>
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {}
            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="auth-spinner" />
                  Resetting password...
                </>
              ) : (
                <>
                  Reset password
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>BR30 CRM</span>
          </div>

          <p className="auth-card-security">
            <ShieldCheck size={14} />
            Your account is protected with secure authentication.
          </p>

          <Link to="/login" className="auth-secondary-btn">
            Remember your password?&nbsp; Sign in
          </Link>

          <button type="button" className="auth-back-btn" onClick={() => navigate("/verify-reset-otp")} disabled={loading}>
            ← Back to OTP verification
          </button>
        </section>
      </div>
    </AuthLayout>
  );
}

export default ResetPassword;
