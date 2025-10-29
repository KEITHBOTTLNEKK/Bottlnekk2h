# Revenue Leak Diagnostic Tool

## Overview

A premium, Apple-inspired web application designed for home service businesses (plumbing, HVAC, electrical) to identify and quantify revenue losses from missed phone calls, after-hours opportunities, and abandoned calls. The tool features a dramatic, high-contrast black minimalist design with a multi-step diagnostic flow that analyzes phone system data and delivers impactful financial insights.

## Recent Changes (October 29, 2025)

### Professional PDF Reports & Email Redesign
- **PDF Generation**: Implemented PDFKit-based PDF report generator (pure JavaScript, no browser dependencies)
- **Professional PDF Design**: Multi-page report with branded header, lead info grid, hero recovery metric, calculation breakdown, 6-metric analytics dashboard, after-hours insight box, and professional footer
- **Email Format Improvements**: Redesigned HTML email with modern card layout, gradient headers, 3-column stats grid, and prominent PDF attachment callout
- **Revenue Clarity**: Updated calculation display to clearly show "35% conversion rate" formula in both email and PDF
- **Smart Attachments**: PDFs automatically attached to sales intelligence emails with descriptive filenames (Revenue-Recovery-Report-{Name}.pdf)
- **Subject Line**: Changed from total loss to actionable recovery opportunity ($X,XXX Recovery Opportunity)

### Diagnostic Matching System
- **Unique Diagnostic Tracking**: Each analysis returns a unique `diagnosticId` that tracks through the entire booking flow
- **Efficient Lookup**: Webhook uses `storage.getDiagnostic(id)` for O(1) database lookup instead of linear scanning
- **URL Parameter Passing**: Diagnostic ID appended to GHL calendar URL (`?diagnosticId=XYZ`) and captured via webhook
- **Graceful Fallback**: System falls back to most recent diagnostic if ID missing/invalid, with comprehensive logging

### Email & Observability
- **Resend Default Sender**: Uses `onboarding@resend.dev` as fallback when domain not verified
- **Critical Error Logging**: Email failures logged with CRITICAL prefix and full context (diagnosticId, booking data)
- **Webhook Response Fields**: Returns `emailSent` and `emailError` for monitoring and debugging
- **SALES_EMAIL Enforcement**: Missing configuration logged as CRITICAL with clear error messages

### Earlier Updates
- Implemented GoHighLevel webhook integration for automated sales intelligence emails
- Created webhook endpoint at POST /api/webhooks/gohighlevel with secret validation
- Updated GoHighLevel calendar URL to `fix-your-phone-leak`
- Made sales intelligence metrics optional in database to protect user experience from backend failures
- Configured SALES_EMAIL and GOHIGHLEVEL_WEBHOOK_SECRET environment variables

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

The frontend is built with React 18+ and TypeScript, utilizing Vite for fast development and optimized builds. It uses Wouter for routing within a single-page application. The UI is crafted with shadcn/ui (built on Radix UI) and styled using Tailwind CSS, adhering to a pure black (`#000000`) background with high-contrast white text and the Inter font family. State management relies on TanStack Query for server state and local React state for the multi-step diagnostic wizard.

The application features a component-based architecture with distinct screens: WelcomeScreen, ConnectScreen, AnalysisScreen, and ResultsScreen. It employs responsive design, smooth animations, and generous whitespace for a premium user experience. A custom `useCounter` hook implements `easeOutExpo` easing for dramatic number animations.

### Backend Architecture

The backend is an Express.js application built with Node.js and TypeScript, using ESM modules. It provides APIs for diagnostic analysis (`POST /api/diagnostic/analyze`) and booking submissions (`POST /api/bookings`), with Zod for schema validation. Data is stored in-memory using a `MemStorage` class.

The core analytics logic calculates missed calls (unanswered inbound calls) and after-hours calls (a subset of missed calls outside 8 am-6 pm ET, Mon-Fri). Each call is counted once, and all timestamps are converted to Eastern Time for business hours calculations. The system includes request logging, CORS support, and comprehensive error handling.

### UI/UX Decisions

The application boasts a dramatic, high-contrast black minimalist design inspired by Apple. It uses the ultra-thin Inter typography for a premium aesthetic. Key design elements include large, animated counters for impact, consistent Apple-style white outline buttons, and a focus on radical simplification by presenting only essential metrics (missed calls and after-hours calls). The user flow is designed for seamless transitions, including a clear success moment after OAuth and an interactive deal size question before analysis.

## External Dependencies

**Phone System Integrations**
- **RingCentral OAuth**: Fully functional for real call analytics.
- **Zoom Phone OAuth**: Fully implemented (requires redirect URI registration).
- **Other Providers**: Vonage, Nextiva, 8x8 (currently use mock data, OAuth pending).

**Email Service**
- Resend: Configured for transactional emails via Replit connector integration. Uses default sender (`onboarding@resend.dev`) when domain not verified.
- Sales Intelligence Emails: Automatically sent to SALES_EMAIL when users book calls with professional PDF report attached
- Email Format: Modern HTML design with contact grid, hero recovery metric, quick stats overview, and after-hours insights
- PDF Reports: Professional multi-page reports generated with PDFKit including branded header, complete analytics dashboard, calculation breakdowns, and actionable insights
- Revenue Recovery Calculation: Clearly displays "missed_calls × avg_revenue_per_call × 35% conversion = recoverable_revenue" in both email and PDF
- Diagnostic Matching: Each booking matched to exact diagnostic via unique `diagnosticId` passed through GHL calendar URL
- User Experience Protection: All sales fields are optional - backend email failures never break the user diagnostic flow
- Observability: Webhook returns `emailSent` and `emailError` fields; all failures logged as CRITICAL with full context

**UI Libraries**
- Radix UI: Primitives for accessible components.
- Lucide React: Iconography.
- React Hook Form with Zod resolvers: Form validation.
- TanStack Query: Server state management.

**Styling & Design**
- Tailwind CSS: Utility-first styling.
- PostCSS with Autoprefixer.
- Google Fonts CDN: Inter font family.

**Development Tools**
- TypeScript: Full-stack type safety.
- Replit-specific plugins.
- ESBuild: Fast server-side bundling.

**Environment Configuration**
- SALES_EMAIL: Required secret for sales team notification emails (configured via Replit Secrets).
- GOHIGHLEVEL_WEBHOOK_SECRET: Webhook security secret for validating GHL booking notifications.
- GoHighLevel Calendar: Embedded booking widget at `https://api.leadconnectorhq.com/widget/bookings/fix-your-phone-leak`.
  - Diagnostic ID appended as URL parameter: `?diagnosticId=XYZ`
  - GHL custom field setup required to capture diagnosticId and pass back via webhook
- GoHighLevel Webhook: POST /api/webhooks/gohighlevel receives booking notifications, matches exact diagnostic by ID, and triggers sales emails.