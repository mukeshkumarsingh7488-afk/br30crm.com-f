# BR30 CRM — Frontend

<p align="center">
  <strong>A Modern Customer Relationship Management Platform</strong>
</p>

<p align="center">
  Manage leads, contacts, companies, deals, teams, communication, automation, and business operations from one centralized workspace.
</p>

<p align="center">
  <a href="https://br30crm.com">Website</a> ·
  <a href="https://br30crm.com/login">Login</a> ·
  <a href="https://br30crm.com/documentation">Documentation</a>
</p>

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Project Architecture](#project-architecture)
- [Complete Folder Structure](#complete-folder-structure)
- [Application Modules](#application-modules)
- [Routing](#routing)
- [Authentication and Authorization](#authentication-and-authorization)
- [API Integration](#api-integration)
- [Public Forms](#public-forms)
- [Environment Configuration](#environment-configuration)
- [Installation](#installation)
- [Development](#development)
- [Production Build](#production-build)
- [Deployment on Vercel](#deployment-on-vercel)
- [UI and Theme Architecture](#ui-and-theme-architecture)
- [Error Handling and Troubleshooting](#error-handling-and-troubleshooting)
- [Security Best Practices](#security-best-practices)
- [Development Guidelines](#development-guidelines)
- [Future Roadmap](#future-roadmap)
- [License](#license)

---

## Overview

**BR30 CRM** is a web-based Customer Relationship Management platform developed under BR30 Group.

The frontend provides a centralized interface for managing customer relationships, sales pipelines, business teams, communication channels, operational workflows, reports, and public lead-generation forms.

The application is built using React and Vite, with React Router handling navigation and Axios managing communication with the backend API.

The frontend communicates with a separate Node.js and Express backend. MongoDB is used by the backend for persistent application data.

### Project Information

| Property             | Details                         |
| -------------------- | ------------------------------- |
| Project              | BR30 CRM                        |
| Application          | Frontend Web Application        |
| Architecture         | React SPA                       |
| Build Tool           | Vite                            |
| Language             | JavaScript and JSX              |
| Routing              | React Router DOM                |
| HTTP Client          | Axios                           |
| Icons                | Lucide React and React Icons    |
| Notifications        | React Hot Toast and SweetAlert2 |
| Backend              | Node.js and Express             |
| Database             | MongoDB                         |
| Frontend Hosting     | Vercel                          |
| Backend Hosting      | Render                          |
| Repository Directory | `BR30Crm-F`                     |

---

## Key Features

### 1. CRM Dashboard

- Centralized CRM workspace.
- Dashboard overview and business metrics.
- Navigation to CRM modules.
- Quick access to important business operations.
- Shared application layout and navigation components.

### 2. Lead Management

- View and manage leads.
- Create and update lead records.
- Assign leads to team members.
- View individual lead details.
- Organize leads through pipelines and sources.
- Access lead reporting tools.

### 3. Contact Management

- Maintain customer contact records.
- View and update contact details.
- Manage contact-related information.
- Access contact detail pages.

### 4. Company Management

- Manage business and company records.
- View company details.
- Organize companies alongside contacts and deals.

### 5. Deal and Pipeline Management

- Manage deals and sales opportunities.
- View individual deal records.
- Work with sales pipelines.
- Access sales and deal reports.

### 6. Tasks, Activities and Notes

- Manage tasks and activities.
- Maintain notes.
- View activity timelines.
- Access files and related CRM records.

### 7. Team and Access Management

- Team management.
- Business member management.
- Role management.
- Permission management.
- Protected application routes.

### 8. Communication

The frontend includes dedicated pages for:

- Email
- WhatsApp
- SMS
- Meetings
- Calendar
- Communication history
- Templates
- Notifications

Actual delivery, synchronization and provider-dependent operations require the corresponding backend integrations and configuration.

### 9. Automation and Workflows

- Automation management.
- Automation builder.
- Workflow management.
- Webhook management.
- Lead source and campaign management.
- CRM tags and organizational tools.

### 10. Forms and Public Links

- CRM form management.
- Public link management.
- Public form access without requiring the visitor to log in.
- Public form submissions through the backend API.
- QR-related functionality.

### 11. Reporting and Analytics

- CRM reports.
- Sales reports.
- Lead reports.
- Deal reports.
- Activity reports.
- Analytics dashboard.

The availability of live metrics depends on the data returned by the backend APIs.

### 12. Settings and Administration

- Profile management.
- Application settings.
- Subscription and billing interface.
- Audit log.
- Notifications.
- Admin dashboard.
- User management.
- Announcements and What's New management.

### 13. Public Website

The frontend also includes public-facing pages for:

- Landing page
- Product information
- Features and solutions
- Pricing
- Company information
- Careers and blog
- Help center
- Documentation
- FAQs
- Security and trust information
- Privacy policy
- Terms of service
- Cookie policy
- Refund policy
- Data processing
- GDPR and compliance

---

## Technology Stack

| Technology       | Purpose                                   |
| ---------------- | ----------------------------------------- |
| React            | Component-based user interface            |
| Vite             | Development server and production bundler |
| JavaScript       | Application logic                         |
| JSX              | React component markup                    |
| React Router DOM | Client-side routing                       |
| Axios            | HTTP requests and API integration         |
| Lucide React     | Interface icons                           |
| React Icons      | Additional icon sets                      |
| React Hot Toast  | Toast notifications                       |
| SweetAlert2      | Dialogs and confirmation alerts           |
| CSS              | Styling, layout and responsive interfaces |
| Node.js          | Frontend development tooling              |
| npm              | Package management                        |

The exact dependency versions are maintained in `package.json` and `package-lock.json`.

---

## Project Architecture

BR30 CRM uses a separated frontend and backend architecture.

```text
                    BR30 CRM
                        |
           +------------+------------+
           |                         |
     Frontend App               Backend API
     React + Vite              Node.js + Express
           |                         |
     React Router             Controllers/Services
           |                         |
      API Clients                 MongoDB
           |
         Axios
           |
      HTTPS Requests
```

### Frontend responsibilities

- Render the user interface.
- Handle client-side navigation.
- Manage form inputs and page state.
- Call backend APIs.
- Display loading states, errors and notifications.
- Apply authentication and route-protection logic.
- Provide public-facing website and form interfaces.

### Backend responsibilities

- Authenticate users.
- Authorize business and resource access.
- Validate and process requests.
- Execute CRM business logic.
- Read and write application data.
- Manage external integrations.
- Return API responses to the frontend.

The frontend must not be treated as the authority for permissions, payment status or tenant-level data access. These controls must be enforced by the backend.

---

## Complete Folder Structure

The following structure represents the supplied frontend source archive and the root files shown in the project screenshot.

```text
BR30Crm-F/
│
├── node_modules/                 # Installed dependencies
├── public/                       # Public static assets
│
├── src/
│   │
│   ├── api/                      # API clients
│   │   ├── activity.api.js
│   │   ├── admin.api.js
│   │   ├── analytics.api.js
│   │   ├── announcement.api.js
│   │   ├── api-key.api.js
│   │   ├── api.js
│   │   ├── auth.js
│   │   ├── automation.api.js
│   │   ├── business-member.api.js
│   │   ├── business.api.js
│   │   ├── calendar.api.js
│   │   ├── communication.api.js
│   │   ├── company.api.js
│   │   ├── contact.api.js
│   │   ├── crm.api.js
│   │   ├── deal.api.js
│   │   ├── duplicate.api.js
│   │   ├── email.api.js
│   │   ├── file.api.js
│   │   ├── import-export.api.js
│   │   ├── integration.api.js
│   │   ├── invitation.api.js
│   │   ├── lead-source.api.js
│   │   ├── lead.api.js
│   │   ├── leadAttribution.api.js
│   │   ├── meeting.api.js
│   │   ├── member.api.js
│   │   ├── note.api.js
│   │   ├── notification.api.js
│   │   ├── operations.api.js
│   │   ├── permission.api.js
│   │   ├── pipeline.api.js
│   │   ├── public-form.api.js
│   │   ├── qr.api.js
│   │   ├── report.api.js
│   │   ├── role.api.js
│   │   ├── search.api.js
│   │   ├── session.api.js
│   │   ├── settings.api.js
│   │   ├── sms.api.js
│   │   ├── social-lead.api.js
│   │   ├── subscription.api.js
│   │   ├── tag.api.js
│   │   ├── task.api.js
│   │   ├── webhook.api.js
│   │   ├── whatsapp.api.js
│   │   ├── whatsNew.api.js
│   │   └── workflow.api.js
│   │
│   ├── app/
│   │   ├── ProtectedRoute.jsx
│   │   └── routes.jsx
│   │
│   ├── components/
│   │   │
│   │   ├── admin/
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── AdminNavbar.jsx
│   │   │   └── AdminSidebar.jsx
│   │   │
│   │   ├── auth/
│   │   │   ├── authAlert.js
│   │   │   └── AuthLayout.jsx
│   │   │
│   │   ├── cookie/
│   │   │   └── CookieConsent.jsx
│   │   │
│   │   ├── crm/
│   │   │   ├── ActivityTimeline.jsx
│   │   │   └── AssigneeDetailsPopup.jsx
│   │   │
│   │   ├── landing/
│   │   │   ├── LandingFooter.jsx
│   │   │   └── LandingNavbar.jsx
│   │   │
│   │   ├── layout/
│   │   │   ├── AppLayout.jsx
│   │   │   ├── Breadcrumbs.jsx
│   │   │   ├── PageHeader.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── Topbar.jsx
│   │   │
│   │   ├── ui/
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Select.jsx
│   │   │   ├── Tabs.jsx
│   │   │   ├── Textarea.jsx
│   │   │   └── Tooltip.jsx
│   │   │
│   │   └── ScrollToTop.jsx
│   │
│   ├── constants/
│   │   └── supportForm.js
│   │
│   ├── features/
│   │   ├── announcements/
│   │   │   ├── AnnouncementCard.jsx
│   │   │   └── AnnouncementModal.jsx
│   │   │
│   │   └── whats-new/
│   │       ├── whatsNew.utils.js
│   │       ├── WhatsNewCard.jsx
│   │       └── WhatsNewModal.jsx
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   └── useBusiness.js
│   │
│   ├── pages/
│   │   │
│   │   ├── admin/
│   │   │   ├── AdminAnnouncement.jsx
│   │   │   ├── AdminOverview.jsx
│   │   │   ├── AdminPanel.jsx
│   │   │   ├── AdminUsers.jsx
│   │   │   └── AdminWhatsNew.jsx
│   │   │
│   │   ├── auth/
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── MyProfile.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ResetPassword.jsx
│   │   │   ├── VerifyEmail.jsx
│   │   │   └── VerifyResetOtp.jsx
│   │   │
│   │   ├── Company/
│   │   │   ├── About.jsx
│   │   │   ├── Blog.jsx
│   │   │   ├── Careers.jsx
│   │   │   ├── Consultants.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Ecosystem.jsx
│   │   │   └── FounderAbout.jsx
│   │   │
│   │   ├── crm/
│   │   │   ├── Activities.jsx
│   │   │   ├── ActivityReport.jsx
│   │   │   ├── Analytics.jsx
│   │   │   ├── AuditLog.jsx
│   │   │   ├── AutomationBuilder.jsx
│   │   │   ├── Automations.jsx
│   │   │   ├── Calendar.jsx
│   │   │   ├── CalendarEventModal.jsx
│   │   │   ├── CommunicationHistory.jsx
│   │   │   ├── Companies.jsx
│   │   │   ├── CompanyDetails.jsx
│   │   │   ├── ContactDetails.jsx
│   │   │   ├── Contacts.jsx
│   │   │   ├── CRMTools.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── DealDetails.jsx
│   │   │   ├── Deals.jsx
│   │   │   ├── DealsReport.jsx
│   │   │   ├── Email.jsx
│   │   │   ├── EntityDetails.jsx
│   │   │   ├── Files.jsx
│   │   │   ├── Forms.jsx
│   │   │   ├── Integrations.jsx
│   │   │   ├── LeadDetails.jsx
│   │   │   ├── Leads.jsx
│   │   │   ├── LeadsReport.jsx
│   │   │   ├── Meetings.jsx
│   │   │   ├── Members.jsx
│   │   │   ├── Notes.jsx
│   │   │   ├── Notifications.jsx
│   │   │   ├── OperationsPage.jsx
│   │   │   ├── Permissions.jsx
│   │   │   ├── Pipelines.jsx
│   │   │   ├── PublicLinks.jsx
│   │   │   ├── QR.jsx
│   │   │   ├── Reports.jsx
│   │   │   ├── ResourcePage.jsx
│   │   │   ├── Roles.jsx
│   │   │   ├── SalesReport.jsx
│   │   │   ├── Settings.jsx
│   │   │   ├── SMS.jsx
│   │   │   ├── SourcesCampaigns.jsx
│   │   │   ├── Subscription.jsx
│   │   │   ├── Tags.jsx
│   │   │   ├── Tasks.jsx
│   │   │   ├── Team.jsx
│   │   │   ├── Templates.jsx
│   │   │   ├── Webhooks.jsx
│   │   │   ├── WhatsApp.jsx
│   │   │   └── Workflows.jsx
│   │   │
│   │   ├── landing/
│   │   │   ├── DashboardPreview.jsx
│   │   │   ├── FeaturesSection.jsx
│   │   │   ├── FinalCTA.jsx
│   │   │   ├── HeroSection.jsx
│   │   │   ├── Landing.jsx
│   │   │   ├── Me.jsx
│   │   │   ├── PricingSection.jsx
│   │   │   ├── SolutionsSection.jsx
│   │   │   ├── test.jsx
│   │   │   ├── TestimonialsSection.jsx
│   │   │   ├── Whybr30CRM.jsx
│   │   │   └── WorkflowSection.jsx
│   │   │
│   │   ├── legal/
│   │   │   ├── CookiePolicy.jsx
│   │   │   ├── DataProcessing.jsx
│   │   │   ├── GDPR&Compliance.jsx
│   │   │   ├── PrivacyPolicy.jsx
│   │   │   ├── RefundPolicy.jsx
│   │   │   └── TermsOfService.jsx
│   │   │
│   │   ├── public/
│   │   │   └── PublicForm.jsx
│   │   │
│   │   ├── Product/
│   │   │   ├── Announcements.jsx
│   │   │   └── WhatsNew.jsx
│   │   │
│   │   ├── Resources/
│   │   │   ├── Documentation.jsx
│   │   │   ├── FAQ.jsx
│   │   │   ├── HelpCenter.jsx
│   │   │   ├── Security.jsx
│   │   │   ├── SystemStatus.jsx
│   │   │   └── TrustCenter.jsx
│   │   │
│   │   └── Solutions/
│   │       ├── BusinessOperations.jsx
│   │       ├── CustomerManagement.jsx
│   │       ├── LeadManagement.jsx
│   │       ├── Reporting&Analytics.jsx
│   │       ├── SalesManagement.jsx
│   │       └── TeamManagement.jsx
│   │
│   ├── styles/
│   │   ├── auth.css
│   │   ├── global.css
│   │   └── variables.css
│   │
│   ├── utils/
│   │   ├── permissions.js
│   │   └── requestPermissions.js
│   │
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── .env                          # Local environment configuration
├── .gitignore
├── .oxlintrc.json
├── index.html
├── package.json
├── package-lock.json
├── vercel.json
└── vite.config.js
```

**Note:** `node_modules/` is generated by npm and should not be committed to Git. The `.env` file is for local configuration and must not contain publicly exposed secrets.

---

## Application Modules

### CRM workspace

The main CRM workspace is organized under `src/pages/crm/`.

| Module          | Main file            |
| --------------- | -------------------- |
| Dashboard       | `Dashboard.jsx`      |
| Leads           | `Leads.jsx`          |
| Lead details    | `LeadDetails.jsx`    |
| Contacts        | `Contacts.jsx`       |
| Contact details | `ContactDetails.jsx` |
| Companies       | `Companies.jsx`      |
| Company details | `CompanyDetails.jsx` |
| Deals           | `Deals.jsx`          |
| Deal details    | `DealDetails.jsx`    |
| Activities      | `Activities.jsx`     |
| Tasks           | `Tasks.jsx`          |
| Notes           | `Notes.jsx`          |
| Files           | `Files.jsx`          |
| Pipelines       | `Pipelines.jsx`      |
| Calendar        | `Calendar.jsx`       |
| Meetings        | `Meetings.jsx`       |
| Team            | `Team.jsx`           |
| Members         | `Members.jsx`        |
| Roles           | `Roles.jsx`          |
| Permissions     | `Permissions.jsx`    |
| Reports         | `Reports.jsx`        |
| Analytics       | `Analytics.jsx`      |
| Automations     | `Automations.jsx`    |
| Workflows       | `Workflows.jsx`      |
| Webhooks        | `Webhooks.jsx`       |
| Forms           | `Forms.jsx`          |
| Public links    | `PublicLinks.jsx`    |
| QR              | `QR.jsx`             |
| Integrations    | `Integrations.jsx`   |
| Settings        | `Settings.jsx`       |
| Subscription    | `Subscription.jsx`   |

### API clients

API clients are organized under `src/api/`.

Examples:

- `api.js` — shared Axios instance and request handling.
- `auth.js` — authentication-related API operations.
- `lead.api.js` — lead operations.
- `contact.api.js` — contact operations.
- `company.api.js` — company operations.
- `deal.api.js` — deal operations.
- `public-form.api.js` — public form API operations.
- `automation.api.js` — automation operations.
- `workflow.api.js` — workflow operations.
- `notification.api.js` — notification operations.
- `subscription.api.js` — subscription operations.

When adding a new module, keep its API calls in the appropriate API client rather than scattering duplicate HTTP request logic across pages.

---

## Routing

Routes are defined in:

`src/app/routes.jsx`

The application uses React Router DOM.

### Public routes

| Path                              | Purpose                    |
| --------------------------------- | -------------------------- |
| `/`                               | Landing page               |
| `/login`                          | Login                      |
| `/register`                       | Registration               |
| `/verify-email`                   | Email verification         |
| `/forgot-password`                | Password recovery          |
| `/verify-reset-otp`               | Password reset OTP         |
| `/reset-password`                 | Reset password             |
| `/public/forms/:businessId/:slug` | Public form                |
| `/whats-new`                      | Product updates            |
| `/announcements`                  | Announcements              |
| `/privacy`                        | Privacy policy             |
| `/terms`                          | Terms of service           |
| `/cookies`                        | Cookie policy              |
| `/refund`                         | Refund policy              |
| `/data-processing`                | Data processing            |
| `/gdpr`                           | GDPR and compliance        |
| `/help`                           | Help center                |
| `/documentation`                  | Documentation              |
| `/faq`                            | Frequently asked questions |
| `/security`                       | Security information       |
| `/system-status`                  | System status              |
| `/trust-center`                   | Trust center               |

### Protected CRM routes

Examples of authenticated routes include:

```text
/dashboard
/leads
/leads/:id
/contacts
/contacts/:id
/companies
/companies/:id
/deals
/deals/:id
/activities
/tasks
/notes
/files
/pipelines
/calendar
/meetings
/team
/team/members
/team/roles
/team/permissions
/reports
/reports/sales
/reports/leads
/reports/deals
/reports/activity
/analytics
/settings
/profile
/notifications
/automations
/workflows
/webhooks
/forms
/public-links
/qr
/integrations
/subscription
```

Additional routes are available in `src/app/routes.jsx`.

### Admin routes

```text
/admin
/admin/whats-new
/admin/announcements
/admin/users
```

Admin access is handled through the protected routing structure and the backend's authorization rules.

---

## Authentication and Authorization

Authentication-related code is organized in:

```text
src/
├── api/
│   └── auth.js
├── app/
│   └── ProtectedRoute.jsx
├── components/
│   └── auth/
├── hooks/
│   └── useAuth.js
└── utils/
    ├── permissions.js
    └── requestPermissions.js
```

The application includes interfaces for registration, login, email verification, password recovery, OTP verification and profile management.

The shared Axios client in `src/api/api.js` configures API requests, attaches the locally stored access token when available and handles access-token refresh attempts after eligible `401` responses.

Important considerations:

- Authentication state must be handled consistently.
- Protected pages should not expose private business information to unauthenticated visitors.
- The backend must verify user identity and permissions on every protected operation.
- Client-side permission checks improve the interface but do not replace server-side authorization.
- Token storage and refresh behavior should be reviewed against the application's security requirements.

---

## API Integration

All API requests use the shared API client:

`src/api/api.js`

### Default API URL

The current frontend configuration uses:

```text
http://localhost:5000/api/v1
```

The default is intended for local development. Set `VITE_API_BASE_URL` to the appropriate backend URL for each environment.

### Example API usage

```javascript
import api from "./api";

const response = await api.get("/leads");

const leads = response.data;
```

Use the existing API client and the relevant module API file when extending functionality.

### Request handling

The shared API client configures:

- API base URL.
- JSON request headers.
- Credential inclusion.
- A 30-second request timeout.
- Authentication token attachment.
- Token refresh handling.
- Error normalization through `apiRequest()`.

The timeout is a maximum request-wait setting, not an intentional delay before a page opens. Slow requests should be investigated through browser Network timings and backend logs.

---

## Public Forms

Public form UI:

`src/pages/public/PublicForm.jsx`

Public form API client:

`src/api/public-form.api.js`

Public form route:

```text
/public/forms/:businessId/:slug
```

Public forms allow visitors to access an eligible form without logging in to the CRM.

### Expected flow

1. A business user creates or configures a form in the CRM.
2. The form is made available through the relevant backend functionality.
3. A visitor opens the public form URL.
4. The frontend retrieves the form configuration from the backend.
5. The visitor fills in the form and submits the data.
6. The backend validates and processes the submission.
7. The frontend displays the appropriate result or error message.

The backend remains responsible for public form availability, validation, abuse protection, tenant isolation and submission processing.

### Performance

Public forms should load quickly and avoid unnecessary blocking requests.

When investigating slow form loading:

1. Open the browser's Developer Tools.
2. Select the Network tab.
3. Reload the public form URL.
4. Find the public form GET request.
5. Inspect request duration, Waiting (TTFB), response size and failed requests.
6. Check backend logs and database query performance if the response is slow.

Do not reduce request timeouts merely to hide slow backend operations.

---

## Environment Configuration

Create a local `.env` file in the frontend project root.

Example:

```dotenv
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

For production, configure the corresponding variable in Vercel:

```dotenv
VITE_API_BASE_URL=https://YOUR-BACKEND-DOMAIN/api/v1
```

Replace the example URL with the actual deployed backend API URL.

### Environment variable rules

- Vite exposes variables prefixed with `VITE_` to browser-side code.
- Never put database passwords, private API keys, signing secrets or payment gateway secrets in frontend environment variables.
- Frontend variables are not a secure storage mechanism.
- After changing `.env`, restart the Vite development server.
- Update the production environment variable and redeploy when necessary.
- Keep `.env` out of Git.

---

## Installation

### Prerequisites

Install the following before starting development:

- Node.js compatible with the project's Vite version.
- npm.
- Git.
- A code editor such as Visual Studio Code.
- Access to the BR30 CRM backend API.

### Step 1: Open the project

```bash
cd BR30Crm-F
```

### Step 2: Install dependencies

```bash
npm install
```

This installs the dependencies defined by `package.json` and `package-lock.json`.

### Step 3: Configure environment variables

Create or update the root `.env` file:

```dotenv
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

Ensure the backend is configured and reachable at the configured URL.

### Step 4: Start the development server

```bash
npm run dev
```

Vite will display the local development URL in the terminal, usually:

```text
http://localhost:5173
```

Open the URL in your browser.

---

## Development

### Available commands

The project uses Vite scripts defined in `package.json`.

```bash
npm run dev
```

Starts the development server.

```bash
npm run build
```

Creates the production build.

```bash
npm run preview
```

Previews the production build locally.

```bash
npm run lint
```

Runs the configured linting checks.

Run `npm run` to see the exact scripts available in the current project.

### Recommended workflow

1. Start the backend.
2. Start the frontend.
3. Sign in with a valid test account.
4. Open the relevant CRM module.
5. Test the complete workflow, including API requests.
6. Inspect browser Console and Network errors.
7. Run the production build before pushing changes.

---

## Production Build

Build the frontend:

```bash
npm run build
```

Vite normally generates production assets in:

```text
dist/
```

Verify the generated output before deployment.

### Build verification checklist

- [ ] Build completes successfully.
- [ ] No unresolved import errors.
- [ ] No JSX syntax errors.
- [ ] Environment variables point to the correct backend.
- [ ] Authentication and protected routes work.
- [ ] Public forms open and submit correctly.
- [ ] CRM modules load their expected data.
- [ ] Browser Console has no unexpected runtime errors.
- [ ] Production routes work after refreshing the browser.

---

## Deployment on Vercel

The frontend is designed to be deployable separately from the backend.

### Deployment steps

1. Push the frontend repository to GitHub.
2. Import the repository into Vercel.
3. Select Vite as the framework if prompted.
4. Set the project root to the frontend root directory.
5. Set the build command to `npm run build`.
6. Set the output directory to `dist`.
7. Add `VITE_API_BASE_URL` under Vercel environment variables.
8. Deploy the application.
9. Verify the live website and API connectivity.

### SPA routing

The root `vercel.json` file is used for Vercel deployment configuration.

Ensure that direct navigation and browser refreshes work for React Router routes, including protected pages and public form URLs.

Use a rewrite to serve `index.html` for frontend routes when required by the deployment setup. API requests must continue to target the backend rather than being rewritten to the frontend.

### CORS configuration

The backend must allow the deployed frontend origin.

For example, the backend may need to allow the actual production frontend domain and any authorized preview or local development origins.

Use explicit trusted origins rather than allowing arbitrary origins for authenticated requests.

---

## UI and Theme Architecture

Shared styles and layout components are organized under:

```text
src/
├── App.css
├── index.css
├── styles/
│   ├── auth.css
│   ├── global.css
│   └── variables.css
└── components/
    ├── admin/
    ├── auth/
    ├── cookie/
    ├── crm/
    ├── landing/
    ├── layout/
    └── ui/
```

### Shared layout components

- `AppLayout.jsx` — shared CRM application layout.
- `Sidebar.jsx` — primary navigation.
- `Topbar.jsx` — top navigation area.
- `PageHeader.jsx` — shared page header.
- `Breadcrumbs.jsx` — breadcrumb navigation.
- `AdminLayout.jsx` — administrative layout.
- `AdminNavbar.jsx` — administrative navigation bar.
- `AdminSidebar.jsx` — administrative sidebar.

### Styling guidelines

- Preserve the existing UI and theme when updating business logic.
- Reuse existing components before introducing duplicates.
- Avoid broad CSS replacements that may affect unrelated pages.
- Test desktop and mobile layouts.
- Maintain consistent spacing, typography, colors and interaction states.
- Keep page-specific styling scoped where practical.
- Verify loading, empty, success and error states.

---

## Error Handling and Troubleshooting

### 1. API request fails

**Possible causes:**

- Backend is unavailable.
- API URL is incorrect.
- CORS configuration is missing.
- Authentication has expired.
- The endpoint or HTTP method is incorrect.

**Recommended checks:**

- Verify `VITE_API_BASE_URL`.
- Check backend health and logs.
- Inspect the Network tab.
- Confirm the endpoint in the corresponding API client.
- Restart Vite after changing environment variables.

### 2. Public form loads slowly

**Recommended checks:**

- Measure the public form GET request in Network.
- Check backend request timing.
- Inspect MongoDB query performance.
- Identify synchronous middleware or unnecessary database operations.
- Check whether external services are blocking the response.
- Confirm that public form loading does not wait for unrelated background work.

### 3. Page fails after refresh

**Possible causes:**

- Missing SPA rewrite configuration.
- Incorrect route definition.
- An unhandled runtime error.

Check `vercel.json`, `src/app/routes.jsx` and the browser Console.

### 4. Login or token refresh fails

Check:

- Backend authentication routes.
- API base URL.
- Token expiration and refresh responses.
- Browser storage.
- Cookie and credential settings.
- CORS configuration.

Do not disable authentication checks to work around login problems.

### 5. Production build fails

Run:

```bash
npm install
npm run lint
npm run build
```

Resolve missing imports, invalid JSX, undefined identifiers and lint errors before deploying.

### 6. UI or CSS breaks

- Inspect the component's existing class names.
- Check shared CSS variables.
- Avoid replacing entire stylesheets unnecessarily.
- Verify the page at different viewport widths.
- Compare affected pages before and after the change.

---

## Security Best Practices

- Never commit `.env` files containing secrets.
- Never expose backend credentials in frontend code.
- Enforce authorization on the backend.
- Validate all user-controlled input on the server.
- Protect business and tenant-specific data.
- Use HTTPS in production.
- Configure trusted CORS origins.
- Avoid exposing sensitive information in error messages.
- Keep dependencies updated.
- Review authentication and token-storage behavior periodically.
- Treat public form endpoints as untrusted input.
- Apply appropriate rate limits and abuse protection on the backend.
- Do not assume a hidden button or protected React route is sufficient authorization.

---

## Development Guidelines

### Adding a new CRM page

1. Create the page under `src/pages/crm/`.
2. Add or reuse an API client under `src/api/`.
3. Register the route in `src/app/routes.jsx`.
4. Apply the existing CRM layout and styling.
5. Implement loading, error and empty states.
6. Verify authentication and permissions.
7. Test the complete feature against the backend.

### Adding a new API operation

1. Identify the correct module API file.
2. Reuse the shared Axios client.
3. Match the backend endpoint and request format.
4. Handle success and failure responses.
5. Avoid duplicating authentication or refresh logic.
6. Test the operation in the browser Network panel.

### Updating existing functionality

- Understand the existing implementation before changing it.
- Make the smallest targeted change possible.
- Avoid unrelated refactoring.
- Preserve working routes and UI.
- Test affected workflows.
- Run the production build before committing.

### Git workflow

```bash
git status
git add .
git commit -m "Describe the frontend change"
git push
```

Review `git status` before committing. Ensure local environment files and other sensitive configuration are not staged.

---

## Future Roadmap

Potential future improvements for BR30 CRM include:

- Further frontend performance optimization.
- Improved loading and skeleton states.
- Enhanced accessibility and keyboard navigation.
- Expanded automated testing.
- More comprehensive error reporting.
- Additional reporting and analytics visualizations.
- Improved mobile CRM workflows.
- Enhanced search and filtering experiences.
- Further automation and workflow builder improvements.
- Better operational monitoring and performance diagnostics.
- Additional integrations and productivity tools.
- Continued UI consistency and design-system improvements.

These items are a roadmap, not a claim that every feature is already implemented.

---

## License

Copyright © BR30 Group.

All rights reserved unless a separate license is provided with the project.

Unauthorized redistribution, commercial reuse or modification may be restricted by the applicable project ownership terms.

---

<p align="center">
  <strong>Built with ❤️ by BR30 Group</strong>
</p>

<p align="center">
  Building practical digital products for modern businesses.
</p>
