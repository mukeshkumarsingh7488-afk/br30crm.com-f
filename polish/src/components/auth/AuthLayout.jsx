import "../../styles/auth.css";
import LandingNavbar from "../landing/LandingNavbar";
import LandingFooter from "../landing/LandingFooter";

function AuthLayout({ children }) {
  return (
    <div className="auth-page-shell">
      <LandingNavbar />

      <main className="auth-main">
        <div className="auth-container">{children}</div>
      </main>

      <LandingFooter />
    </div>
  );
}

export default AuthLayout;
