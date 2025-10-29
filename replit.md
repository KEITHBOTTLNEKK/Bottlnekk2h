# Revenue Leak Diagnostic Tool

## Overview

A premium, Apple-inspired web application designed for home service businesses (plumbing, HVAC, electrical) to identify and quantify revenue losses from missed phone calls, after-hours opportunities, and abandoned calls. The tool features a dramatic, high-contrast black minimalist design with a multi-step diagnostic flow that analyzes phone system data and delivers impactful financial insights.

## Recent Changes (October 29, 2025)

### Steve Jobs Minimalist Refinements (October 29, 2025 - Final)
- **Horizontal Tagline**: "Behind Every [icon] Bottlnekk Lives Freedom" displayed inline with constrained width (max-w-3xl)
- **Smaller, Bold Tagline**: Reduced to text-lg/xl (was text-2xl/3xl) while maintaining font-semibold and font-bold for impact
- **Balanced Spacing**: Tagline section uses pb-8 for breathing room between tagline and hero headline
- **Actual Logo Integration**: Uses real hourglass logo asset (same logo from top-left branding)
- **Logo Styling**: White hourglass icon (h-8 to h-9) with green glow effect (#00C97B), integrated inline
- **Hero Decluttered**: Removed three trust badges (Free Analysis, 60 Second Setup, No Credit Card) - hero now shows only headline + CTA
- **Improved Hero Spacing**: Generous space-y-16 between headline and subheadline, with extra pt-8 padding above CTA button for clean vertical rhythm
- **Full-Screen Hero**: Hero section expanded to min-h-screen (was min-h-[70vh]) so "Proven Results" section requires scroll
- **Larger Headline**: Hero headline increased to text-6xl/7xl/8xl (was text-5xl/6xl/7xl) with updated amount to $10,000+ for stronger impact
- **Case Studies Reduced**: Only 2 impactful stories shown (Tire Boss: 97% reduction + 30% sales increase, Call Centre: 81% reduction + 3X efficiency) for focused credibility
- **Revenue Numbers Visible**: Both testimonials show clear revenue growth ($50K→$65K, $120K→$180K monthly) for financial proof
- **Tighter Section Spacing**: Reduced vertical padding on "Proven Results" and "How It Works" sections (py-12 instead of py-20, mb-10 instead of mb-16)
- **Radical Simplification**: Applied Steve Jobs principles - generous whitespace, minimal clutter, maximum impact
- **Page Flow**: Tagline → Hero Problem → Case Study Proof → How It Works → Final CTA

### Marketing Landing Page (October 29, 2025 - Late Evening)
- **Public Landing Page**: New marketing page at `/` for VCs, prospects, and visitors
- **Tagline**: "Behind Every Bottlnekk Lives Freedom" - reframes bottleneck problems as pathway to freedom
- **Hero Section**: Revenue loss headline ("Stop Losing $15,000+ Every Month") with 60-second diagnostic promise and prominent CTA to `/diagnostic`
- **Social Proof**: Featured case studies with metrics from Tire Boss (97% response improvement, 30% sales increase), MedSpa, Real Estate, and Call Centre clients
- **How It Works**: 3-step visualization (Connect → Analyze → Fix) explaining diagnostic flow
- **Footer**: Subtle "Powered by Hexona" credit acknowledging development partner
- **Routing Changes**: Diagnostic tool moved from `/` to `/diagnostic`, landing page now at root
- **Design Consistency**: Same black minimal aesthetic with Bottlnekk green accents throughout
- **SEO Metadata**: Statically rendered meta tags (title, description, OG, Twitter) in `index.html` for crawler compatibility
- **Reusable CTAButton**: Created shared component with pure Tailwind hover states (no imperative DOM mutations)
- **Social Card Image**: Requires 1200x630px image at `public/social-card.png` for rich link previews on Facebook, LinkedIn, Twitter

### Brand Color Finalization (October 29, 2025 - Evening)
- **Bottlnekk Green (#00C97B)**: Finalized signature accent color for brand recall and visual distinction
- **Strategic Choice**: Green = growth/revenue/recovery symbolism without generic finance associations
- **Minimalist Application**: Used sparingly on pure black background for maximum impact (Steve Jobs core aesthetic)
- **Accent Usage**: CTA buttons, hourglass glow, input focus states, hover effects, recovery metrics, and status indicators
- **Cross-Platform Consistency**: Green implemented in frontend (all screens), PDF reports, email templates, and admin dashboard
- **Color Palette**: Primary `#00C97B`, darker shade `#008558`, lighter shade `#00A565`, background tint `#e6f9f2`

### Sales Intelligence Enhancements
- **Potential Budget Metric**: Added internal sales metric (answered calls × deal size × 30%) with prominent "(Internal Use Only - Never Mention to Client)" warning in both PDF and email
- **Formula Protection**: Removed all calculation formulas from sales intelligence reports - competitive moat protected by showing only final numbers and their meaning
- **Clean Presentation**: Sales team receives polished metrics without seeing proprietary conversion rates or calculation methods

### Caller Deduplication (30-Day Window)
- **Unique Caller Tracking**: System now counts unique phone numbers instead of total calls within 30-day analysis period
- **Accurate Metrics**: If same customer calls 5 times, counts as 1 missed opportunity (not 5) - reflects real customer loss, not call volume
- **Smart Sets**: Uses JavaScript Set data structure to track `uniqueMissedCallers` and `uniqueAfterHoursCallers`
- **Both Providers**: Deduplication implemented in both RingCentral and Zoom Phone analytics engines
- **Business Logic**: Prevents inflated loss numbers from repeat callers while maintaining callback time analysis accuracy

### Clickable Logo Restart
- **Logo Functionality**: Clicking Bottlnekk logo (top-left) restarts entire diagnostic flow from welcome screen
- **Standard UX Pattern**: Follows web convention of "click logo = go home"
- **Clean Reset**: Clears all state (provider selection, diagnostic results, current step)
- **Available Everywhere**: Works from all screens (Welcome, Connect, Analysis, Results)

### Replit Auth Integration for Admin Dashboard
- **Protected Admin Route**: `/admin/diagnostics` now requires authentication via Replit Auth
- **Login Options**: Sales team can log in with Google, GitHub, X, Apple, or email/password
- **Session Management**: 7-day sessions stored in PostgreSQL for security and persistence
- **Auth Tables**: Added `users` and `sessions` tables to database schema
- **User Experience**: Public diagnostic tool remains completely open - no login required for customers
- **Security Architecture**: Only admin dashboard protected; OAuth phone integrations and diagnostic flow unchanged
- **Automatic Redirect**: Unauthenticated admin dashboard access redirects to `/api/login`

### Professional PDF Reports & Email System
- **PDF Generation**: Implemented PDFKit-based PDF report generator (pure JavaScript, no browser dependencies)
- **Professional PDF Design**: Single-page report with branded header, lead info grid, hero recovery metric, potential budget (internal use), after-hours insight box, 6-metric analytics dashboard, and professional footer
- **Email Format**: Modern HTML design with contact grid, hero recovery metric, potential budget warning box, and prominent PDF attachment callout
- **Smart Attachments**: PDFs automatically attached to sales intelligence emails with descriptive filenames (Revenue-Recovery-Report-{Name}.pdf)
- **Subject Line**: Recovery opportunity focused ($X,XXX Recovery Opportunity)
- **Ultra-Compact Layout**: All sections compressed to fit on single page while maintaining readability

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

The application boasts a dramatic, high-contrast black minimalist design inspired by Apple. It uses the ultra-thin Inter typography for a premium aesthetic paired with Bottlnekk green (#00C97B) as the signature accent color. Key design elements include large, animated counters for impact, consistent green-accented CTA buttons with hover fill effects, and a focus on radical simplification by presenting only essential metrics (missed calls and after-hours calls). The user flow is designed for seamless transitions, including a clear success moment after OAuth and an interactive deal size question before analysis.

**Bottlnekk Branding**: Logo (hourglass icon + wordmark) appears top-left with subtle green glow effect. Clicking the logo restarts the diagnostic flow. Green accents used strategically for CTAs, recovery metrics, connection status, and focus states throughout the application.

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
- Revenue Recovery Calculation: Clearly displays "missed_calls × avg_revenue_per_call × 60% conversion = recoverable_revenue" in both email and PDF
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