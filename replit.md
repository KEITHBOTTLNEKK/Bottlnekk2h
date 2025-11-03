# Revenue Leak Diagnostic Tool

## Overview

A premium, Apple-inspired web application for home service businesses (plumbing, HVAC, electrical) to identify and quantify revenue losses from missed phone calls, after-hours opportunities, and abandoned calls. It features a high-contrast black minimalist design and a multi-step diagnostic flow that analyzes phone system data to deliver impactful financial insights. The diagnostic tool serves as the primary user acquisition vehicle, providing a clear path to understanding and recovering lost revenue.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend

The frontend uses React 18+ with TypeScript, Vite, and Wouter for routing. UI components are built with shadcn/ui (Radix UI) and styled with Tailwind CSS, featuring a pure black background, white text (Inter font), and Bottlnekk green accents. State management leverages TanStack Query for server state and local React state for the multi-step diagnostic wizard. The application is component-based, with distinct screens for Welcome, Connect, Analysis, and Results, incorporating responsive design, smooth animations, and generous whitespace. A custom `useCounter` hook provides dramatic number animations with `easeOutExpo` easing. The diagnostic tool is the main application at the root (`/`). The WelcomeScreen features a conversion-optimized layout: hero CTA ("Show Me The Number"), followed by a condensed trust block with "Meet the team" link to `/about`. A separate `/about` page contains full founder bios for Keith Booker (CEO) and Hamza Baig (CTO) with a CTA back to the diagnostic flow.

### Backend

The backend is an Express.js application built with Node.js and TypeScript (ESM modules). It provides APIs for diagnostic analysis (`POST /api/diagnostic/analyze`), booking submissions (`POST /api/bookings`), and Vapi voice agent bookings (`POST /api/vapi/book-appointment`), using Zod for schema validation. Diagnostic results and Vapi bookings are stored in PostgreSQL. The core analytics logic calculates unique missed calls and after-hours calls within a 30-day window, converting all timestamps to Eastern Time. It includes request logging, CORS support, and comprehensive error handling. An admin dashboard at `/admin/diagnostics` is protected by Replit Auth, utilizing PostgreSQL for session management.

### UI/UX Decisions

The design is a dramatic, high-contrast black minimalist aesthetic inspired by Apple, using ultra-thin Inter typography and Bottlnekk green (#00C97B) as the signature accent. Key elements include large, animated counters, green-accented CTA buttons with hover effects, and a focus on radical simplification, presenting only essential metrics. The user flow is seamless, with a clear success moment after OAuth and an interactive deal size question.

**Navigation:** A minimal fixed navigation bar appears at the top of all pages with a semi-transparent black backdrop blur. Features the Bottlnekk logo (hourglass icon + wordmark) on the left that navigates to the homepage, and an "About" link on the right with green hover effect. The navigation maintains the minimalist aesthetic while providing easy access to key pages.

**Social Proof:** Homepage features a single marquee testimonial from Tire Boss (97% faster response, +30% sales) below the trust block, with full case studies for both Tire Boss and a daycare client displayed on the /about page. Partner logos (OpenAI, Snowflake, Vapi.ai) appear at the bottom of the homepage in a minimal text-only format.

**User Acquisition Strategy:** The diagnostic tool serves as the primary entry point and customer acquisition vehicle. There is no separate marketing landing page - users go directly to the diagnostic flow at `/`. Browser tab displays just "Bottlnekk" with green hourglass favicon.

### Feature Specifications

- **Revenue Leak Diagnostic**: Analyzes phone system data to identify and quantify revenue loss.
- **Caller Deduplication**: Counts unique callers over a 30-day period to prevent inflated loss numbers.
- **Manual Input Fallback**: Users who cannot or prefer not to connect their phone system via OAuth can click "Don't use any of these" on the ConnectScreen to enter estimated data manually (missed calls/month, average deal size). The system generates estimated results using industry benchmarks: 35% after-hours calls, 3x total inbound, 2x accepted calls. Manual diagnostics are saved with provider="Manual" and intentionally skip OAuth metadata queries to prevent cross-tenant data leakage.
- **Sales Intelligence**: Generates internal "Potential Budget" metrics for sales, with formulas protected from external view.
- **Professional Reports**: Generates single-page PDF reports and HTML emails for sales intelligence, with a branded design and key recovery metrics. Sales intelligence emails have tightened spacing for single-screen viewing.
- **Customer Pain Emails**: Sends automated pain-focused emails to customers after booking, emphasizing revenue leaks with dramatic messaging, red-highlighted stats, and urgent tone to drive action. Features black background with Bottlnekk branding.
- **Diagnostic Matching**: Each analysis generates a unique `diagnosticId` for efficient tracking and lookup, passed to voice agent as context.
- **OAuth Integration**: Connects to phone systems (RingCentral, Zoom Phone) via OAuth for data ingestion.
- **Clickable Logo**: Logo in the top-left corner restarts the diagnostic flow.
- **Voice AI Agent**: Integrated Vapi.ai web-based voice assistant that allows users to speak with a specialist directly from the results page. The agent receives diagnostic data (diagnosticId, total loss, missed calls, after-hours calls, average deal size) as context via variable values. When the agent qualifies a lead and collects booking information (name, email, phone, appointment date), it calls the `bookAppointment` custom function which triggers a webhook to `/api/vapi/book-appointment`. The booking is saved to the database and a sales intelligence email is automatically sent to the sales team.

## External Dependencies

-   **Phone System Integrations**: RingCentral OAuth, Zoom Phone OAuth. (Vonage, Nextiva, 8x8 use mock data).
-   **Email Service**: Resend (via Replit connector) for transactional and sales intelligence emails, using `onboarding@resend.dev` as default sender.
-   **CRM/Booking System**: GoHighLevel for booking appointments, integrating via webhook (`POST /api/webhooks/gohighlevel`).
-   **Voice AI**: Vapi.ai (@vapi-ai/web SDK) for web-based voice agent interactions, enabling direct customer conversations from the results page.
-   **Database**: PostgreSQL for diagnostic results, Vapi bookings, admin dashboard user sessions (via Replit Auth).
-   **UI Libraries**: Radix UI, Lucide React, TanStack Query.
-   **Styling**: Tailwind CSS, PostCSS.
-   **Fonts**: Google Fonts CDN (Inter).
-   **Development Tools**: TypeScript, Vite, ESBuild.
-   **PDF Generation**: PDFKit (JavaScript-based).
-   **Environment Variables**: 
    - `SALES_EMAIL`: Sales team email address
    - `GOHIGHLEVEL_WEBHOOK_SECRET`: Webhook verification secret
    - `VITE_VAPI_PUBLIC_KEY`: Vapi.ai public API key (frontend)
    - `VITE_VAPI_ASSISTANT_ID`: Vapi.ai assistant ID for voice agent (frontend)