import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import ScrollToTop from "../components/ScrollToTop";
import ProtectedRoute from "./ProtectedRoute";
import CookieConsent from "../components/cookie/CookieConsent";

import Register from "../pages/auth/Register";
import VerifyEmail from "../pages/auth/VerifyEmail";
import Login from "../pages/auth/Login";
import MyProfile from "../pages/auth/MyProfile";
import ForgotPassword from "../pages/auth/ForgotPassword";
import VerifyResetOtp from "../pages/auth/VerifyResetOtp";
import ResetPassword from "../pages/auth/ResetPassword";

import PublicForm from "../pages/public/PublicForm";

import Dashboard from "../pages/crm/Dashboard";
import Leads from "../pages/crm/Leads";
import Contacts from "../pages/crm/Contacts";
import Companies from "../pages/crm/Companies";
import Deals from "../pages/crm/Deals";
import Activities from "../pages/crm/Activities";
import Tasks from "../pages/crm/Tasks";
import Pipelines from "../pages/crm/Pipelines";
import Settings from "../pages/crm/Settings";
import LeadDetails from "../pages/crm/LeadDetails";
import ContactDetails from "../pages/crm/ContactDetails";
import CompanyDetails from "../pages/crm/CompanyDetails";
import DealDetails from "../pages/crm/DealDetails";
import Reports from "../pages/crm/Reports";
import Calendar from "../pages/crm/Calendar";
import Team from "../pages/crm/Team";
import Notifications from "../pages/crm/Notifications";
import Templates from "../pages/crm/Templates";
import AuditLog from "../pages/crm/AuditLog";
import Meetings from "../pages/crm/Meetings";
import Email from "../pages/crm/Email";
import WhatsApp from "../pages/crm/WhatsApp";
import SMS from "../pages/crm/SMS";
import CommunicationHistory from "../pages/crm/CommunicationHistory";
import Forms from "../pages/crm/Forms";
import PublicLinks from "../pages/crm/PublicLinks";
import QR from "../pages/crm/QR";
import SourcesCampaigns from "../pages/crm/SourcesCampaigns";
import Automations from "../pages/crm/Automations";
import Workflows from "../pages/crm/Workflows";
import Webhooks from "../pages/crm/Webhooks";
import SalesReport from "../pages/crm/SalesReport";
import LeadsReport from "../pages/crm/LeadsReport";
import DealsReport from "../pages/crm/DealsReport";
import ActivityReport from "../pages/crm/ActivityReport";
import Members from "../pages/crm/Members";
import Roles from "../pages/crm/Roles";
import Permissions from "../pages/crm/Permissions";
import Integrations from "../pages/crm/Integrations";
import Tags from "../pages/crm/Tags";
import Subscription from "../pages/crm/Subscription";

import Landing from "../pages/landing/Landing";

import PrivacyPolicy from "../pages/legal/PrivacyPolicy";
import TermsOfService from "../pages/legal/TermsOfService";
import CookiePolicy from "../pages/legal/CookiePolicy";
import RefundPolicy from "../pages/legal/RefundPolicy";
import DataProcessing from "../pages/legal/DataProcessing";
import GDPRCompliance from "../pages/legal/GDPR&Compliance";

import SystemStatus from "../pages/Resources/SystemStatus";
import Contact from "../pages/Company/Contact";
import Security from "../pages/Resources/Security";
import TrustCenter from "../pages/Resources/TrustCenter";
import FAQ from "../pages/Resources/FAQ";
import Documentation from "../pages/Resources/Documentation";
import HelpCenter from "../pages/Resources/HelpCenter";

import Cunsultalts from "../pages/Company/Consultants";
import About from "../pages/Company/About";
import Careers from "../pages/Company/Careers";
import Blog from "../pages/Company/Blog";
import Ecosystem from "../pages/Company/Ecosystem";
import FounderAbout from "../pages/Company/FounderAbout";

import BusinessOperations from "../pages/Solutions/BusinessOperations";
import CustomerManagement from "../pages/Solutions/CustomerManagement";
import LeadManagement from "../pages/Solutions/LeadManagement";
import ReportingAnalytics from "../pages/Solutions/Reporting&Analytics";
import SalesManagement from "../pages/Solutions/SalesManagement";
import TeamManagement from "../pages/Solutions/TeamManagement";

import WhatsNew from "../pages/Product/WhatsNew";
import Announcements from "../pages/Product/Announcements";
import AdminPanel from "../pages/admin/AdminPanel";
import AdminWhatsNew from "../pages/admin/AdminWhatsNew";
import AdminOverview from "../pages/admin/AdminOverview";
import AdminAnnouncement from "../pages/admin/AdminAnnouncement";
import AdminUsers from "../pages/admin/AdminUsers";

function AppRoutes() {
  return (
    <>
      <ScrollToTop />

      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        {/* Public Forms */}
        <Route path="/public/forms/:businessId/:slug" element={<PublicForm />} />
        {/* What's New */}
        <Route path="/whats-new" element={<WhatsNew />} />
        {/* Announcements */}
        <Route path="/announcements" element={<Announcements />} />
        {/* Legal */}
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/cookies" element={<CookiePolicy />} />
        <Route path="/refund" element={<RefundPolicy />} />
        <Route path="/data-processing" element={<DataProcessing />} />
        <Route path="/gdpr" element={<GDPRCompliance />} />
        {/* Resources */}
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/documentation" element={<Documentation />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/security" element={<Security />} />
        <Route path="/system-status" element={<SystemStatus />} />
        <Route path="/trust-center" element={<TrustCenter />} />
        {/* Solutions */}
        <Route path="/business-operations" element={<BusinessOperations />} />
        <Route path="/customer-management" element={<CustomerManagement />} />
        <Route path="/lead-management" element={<LeadManagement />} />
        <Route path="/reporting-analytics" element={<ReportingAnalytics />} />
        <Route path="/sales-management" element={<SalesManagement />} />
        <Route path="/team-management" element={<TeamManagement />} />
        {/* Company */}
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/ecosystem" element={<Ecosystem />} />
        <Route path="/consultants" element={<Cunsultalts />} />
        <Route path="/founder-about" element={<FounderAbout />} />
        {/* Authentication */}
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-reset-otp" element={<VerifyResetOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected CRM */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/leads/:id" element={<LeadDetails />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/contacts/:id" element={<ContactDetails />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/companies/:id" element={<CompanyDetails />} />
            <Route path="/deals" element={<Deals />} />
            <Route path="/deals/:id" element={<DealDetails />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/pipelines" element={<Pipelines />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/team" element={<Team />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/audit-log" element={<AuditLog />} />
            <Route path="/profile" element={<MyProfile />} />
            <Route path="/meetings" element={<Meetings />} />

            <Route path="/email" element={<Email />} />
            <Route path="/whatsapp" element={<WhatsApp />} />
            <Route path="/sms" element={<SMS />} />
            <Route path="/communication-history" element={<CommunicationHistory />} />

            <Route path="/forms" element={<Forms />} />
            <Route path="/public-links" element={<PublicLinks />} />
            <Route path="/qr" element={<QR />} />
            <Route path="/sources-campaigns" element={<SourcesCampaigns />} />

            <Route path="/automations" element={<Automations />} />
            <Route path="/workflows" element={<Workflows />} />
            <Route path="/webhooks" element={<Webhooks />} />
            <Route path="/tags" element={<Tags />} />

            <Route path="/reports/sales" element={<SalesReport />} />
            <Route path="/reports/leads" element={<LeadsReport />} />
            <Route path="/reports/deals" element={<DealsReport />} />
            <Route path="/reports/activity" element={<ActivityReport />} />

            <Route path="/team/members" element={<Members />} />
            <Route path="/team/roles" element={<Roles />} />
            <Route path="/team/permissions" element={<Permissions />} />

            <Route path="/integrations" element={<Integrations />} />
            <Route path="/subscription" element={<Subscription />} />
          </Route>

          {/* Admin */}
          <Route path="/admin" element={<AdminPanel />}>
            <Route index element={<AdminOverview />} />
            <Route path="whats-new" element={<AdminWhatsNew />} />
            <Route path="announcements" element={<AdminAnnouncement />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <CookieConsent />
    </>
  );
}

export default AppRoutes;
