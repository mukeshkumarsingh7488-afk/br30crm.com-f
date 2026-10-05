import LandingNavbar from "../../components/landing/LandingNavbar";
import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import DashboardPreview from "./DashboardPreview";
import WorkflowSection from "./WorkflowSection";
import SolutionsSection from "./SolutionsSection";
import WhyWhybr30CRMCRM from "./Whybr30CRM";
import Me from "./Me";
import TestimonialsSection from "./TestimonialsSection";
import PricingSection from "./PricingSection";
import FinalCTA from "./FinalCTA";
import LandingFooter from "../../components/landing/LandingFooter";

function Landing() {
  return (
    <div className="br30-landing">
      <LandingNavbar />

      <main>
        <section id="home">
          <HeroSection />
        </section>

        <section id="features">
          <FeaturesSection />
        </section>

        <section id="dashboard">
          <DashboardPreview />
        </section>

        <section id="workflow">
          <WorkflowSection />
        </section>

        <section id="solutions">
          <SolutionsSection />
        </section>

        <section id="why-br30">
          <WhyWhybr30CRMCRM />
        </section>

        <section id="why-br30">
          <Me />
        </section>

        <section id="testimonials">
          <TestimonialsSection />
        </section>

        <section id="pricing">
          <PricingSection />
        </section>

        <section id="get-started">
          <FinalCTA />
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}

export default Landing;
