# Revenue Leak Diagnostic Tool

## Overview

A premium, Apple-inspired web application for home service businesses (plumbing, HVAC, electrical) to identify and quantify revenue losses from missed phone calls, after-hours opportunities, and abandoned calls. It features a high-contrast black minimalist design and a multi-step diagnostic flow that analyzes phone system data to deliver impactful financial insights. The project aims to provide a diagnostic tool and a marketing landing page to attract and convert prospects, offering a clear path to understanding and recovering lost revenue.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend

The frontend uses React 18+ with TypeScript, Vite, and Wouter for routing. UI components are built with shadcn/ui (Radix UI) and styled with Tailwind CSS, featuring a pure black background, white text (Inter font), and Bottlnekk green accents. State management leverages TanStack Query for server state and local React state for the multi-step diagnostic wizard. The application is component-based, with distinct screens for Welcome, Connect, Analysis, and Results, incorporating responsive design, smooth animations, and generous whitespace. A custom `useCounter` hook provides dramatic number animations with `easeOutExpo` easing. The marketing landing page resides at the root (`/`), with the diagnostic tool at `/diagnostic`.

### Backend

The backend is an Express.js application built with Node.js and TypeScript (ESM modules). It provides APIs for diagnostic analysis (`POST /api/diagnostic/analyze`) and booking submissions (`POST /api/bookings`), using Zod for schema validation. Data is stored in-memory via a `MemStorage` class. The core analytics logic calculates unique missed calls and after-hours calls within a 30-day window, converting all timestamps to Eastern Time. It includes request logging, CORS support, and comprehensive error handling. An admin dashboard at `/admin/diagnostics` is protected by Replit Auth, utilizing PostgreSQL for session management.

### UI/UX Decisions

The design is a dramatic, high-contrast black minimalist aesthetic inspired by Apple, using ultra-thin Inter typography and Bottlnekk green (#00C97B) as the signature accent. Key elements include large, animated counters, green-accented CTA buttons with hover effects, and a focus on radical simplification, presenting only essential metrics. The user flow is seamless, with a clear success moment after OAuth and an interactive deal size question. The Bottlnekk logo (hourglass icon + wordmark) appears top-left with a subtle green glow, and clicking it restarts the diagnostic flow.

**Landing Page Philosophy (VC Pitch Page):** The homepage (`/`) is designed as a comprehensive VC pitch page, not a customer acquisition funnel. It tells the complete Bottlnekk story for investors: Hero ("Behind Every Bottlnekk, Freedom Lives"), The Invisible Drain ($30B market problem), The Diagnostic Engine (AI + Hexona fulfillment), Proof (Tire Boss & WealthIO case studies), Market Opportunity (1.3M businesses), The Build (platform expansion roadmap and self-healing companies vision), and The Vision (revenue leaks → workflow leaks → autonomy). CTAs use mailto links (keith@bottlnekk.com) for "Request Access" and "Partner With Us". The diagnostic tool at `/diagnostic` remains unlisted and internal, accessible only via direct link. Browser tab displays just "Bottlnekk" with green hourglass favicon.

### Feature Specifications

- **Revenue Leak Diagnostic**: Analyzes phone system data to identify and quantify revenue loss.
- **Caller Deduplication**: Counts unique callers over a 30-day period to prevent inflated loss numbers.
- **Sales Intelligence**: Generates internal "Potential Budget" metrics for sales, with formulas protected from external view.
- **Professional Reports**: Generates single-page PDF reports and HTML emails for sales intelligence, with a branded design and key recovery metrics.
- **Diagnostic Matching**: Each analysis generates a unique `diagnosticId` for efficient tracking and lookup, passed via URL parameters to external booking systems.
- **OAuth Integration**: Connects to phone systems (RingCentral, Zoom Phone) via OAuth for data ingestion.
- **Clickable Logo**: Logo in the top-left corner restarts the diagnostic flow.

## External Dependencies

-   **Phone System Integrations**: RingCentral OAuth, Zoom Phone OAuth. (Vonage, Nextiva, 8x8 use mock data).
-   **Email Service**: Resend (via Replit connector) for transactional and sales intelligence emails, using `onboarding@resend.dev` as default sender.
-   **CRM/Booking System**: GoHighLevel for booking appointments, integrating via webhook (`POST /api/webhooks/gohighlevel`) and custom calendar URLs (`fix-your-phone-leak`).
-   **Database**: PostgreSQL for admin dashboard user sessions (via Replit Auth).
-   **UI Libraries**: Radix UI, Lucide React, React Hook Form, TanStack Query.
-   **Styling**: Tailwind CSS, PostCSS.
-   **Fonts**: Google Fonts CDN (Inter).
-   **Development Tools**: TypeScript, Vite, ESBuild.
-   **PDF Generation**: PDFKit (JavaScript-based).
-   **Environment Variables**: `SALES_EMAIL`, `GOHIGHLEVEL_WEBHOOK_SECRET` (managed via Replit Secrets).