# Revenue Leak Diagnostic Tool

## Overview

A premium, Apple-inspired web application designed for home service businesses (plumbing, HVAC, electrical) to identify and quantify revenue losses from missed phone calls, after-hours opportunities, and abandoned calls. The tool features a dramatic, high-contrast black minimalist design with a multi-step diagnostic flow that analyzes phone system data and delivers impactful financial insights.

**Status**: MVP Complete ✅ - Fully functional with mock data generator

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

**October 27, 2025** - Booking Flow & Email Integration
- Updated user flow: Email/contact collection moved from Connect screen to end-of-flow booking form (activated by "Reclaim Your Revenue" button)
- Implemented booking form with validation (name, email, phone required; company optional)
- Created POST /api/bookings endpoint with Zod schema validation
- Added success confirmation that displays for 3.5 seconds before auto-closing
- Removed email collection from diagnostic analysis phase (no login required for core flow)
- Integrated Resend email service for future booking notifications
- Database schema updated to support booking data persistence
- End-to-end tested complete user journey including booking submission

**October 27, 2025** - Initial MVP Implementation
- Implemented complete 4-screen diagnostic flow (Welcome → Connect → Analysis → Results)
- Created custom useCounter hook with easeOutExpo easing for dramatic number animations
- Built pure black (#000000) design system with ultra-thin Inter typography (weights 100-300)
- Implemented responsive design optimized for desktop and mobile
- Added comprehensive error handling with retry capability in Analysis screen
- Created mock data generator for realistic phone system metrics

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18+ with TypeScript for type-safe component development
- Vite as the build tool and development server, providing fast HMR and optimized production builds
- Wouter for lightweight client-side routing (single route application)

**UI Component System**
- shadcn/ui component library built on Radix UI primitives for accessible, customizable components
- Tailwind CSS for utility-first styling with custom design tokens
- Class Variance Authority (CVA) for component variant management
- Pure black (#000000) background with high-contrast white text throughout
- Inter font family with ultra-thin weights (100-300) for dramatic, premium aesthetic

**State Management**
- TanStack Query (React Query) for server state management, caching, and API interactions
- Local React state for multi-step wizard flow (welcome → connect → analysis → results)
- Custom hooks for reusable logic (counter animations with easeOutExpo easing)

**Design System**
- Component-based architecture with isolated screen components (WelcomeScreen, ConnectScreen, AnalysisScreen, ResultsScreen)
- Responsive design with mobile-first approach using Tailwind breakpoints
- Smooth animations and transitions (500ms max for screen transitions, 2500ms for counter animations)
- Generous whitespace and centered layouts for premium feel
- Comprehensive error states with retry capability

**Key Components**
- `WelcomeScreen`: Dramatic landing with headline and CTA
- `ConnectScreen`: 2x2 grid of phone provider cards (CallRail, GoHighLevel, RingCentral, Nextiva) - provider selection only
- `AnalysisScreen`: Loading state with animated dots and mutation lifecycle management
- `ResultsScreen`: Large animated counter with breakdown metrics + booking form modal with client-side validation
- `useCounter` hook: Custom animation hook implementing easeOutExpo easing

### Backend Architecture

**Server Framework**
- Express.js running on Node.js with TypeScript
- ESM module system for modern JavaScript features
- Custom Vite middleware integration for development HMR

**API Structure**
- POST /api/diagnostic/analyze - Analyzes phone system data (no email required)
- POST /api/bookings - Submits booking requests with contact information
- Zod schema validation for type-safe request/response handling
- Mock data generation for realistic phone metrics (missed calls, after-hours calls, abandoned calls)
- Simulated API delay (500-1000ms) for realistic user experience

**Data Layer**
- In-memory storage implementation (MemStorage class) for diagnostic results
- UUID-based record identification
- Schema definitions in shared directory for full-stack type safety

**Mock Data Generation**
- Missed calls: 30-80 calls per month
- After-hours calls: 20-60 calls per month
- Abandoned calls: 15-50 calls per month
- Average revenue per call: $250-$450 (realistic for home service businesses)
- Total loss calculated as: (missed + after-hours + abandoned) × avg revenue

**Request/Response Pipeline**
- JSON request body parsing with raw body preservation for webhook support
- Request logging middleware with duration tracking
- CORS-ready with credential support
- Comprehensive error handling with appropriate HTTP status codes

### External Dependencies

**Phone System Integrations**
- Designed to connect with four major phone providers: CallRail, GoHighLevel, RingCentral, Nextiva
- Currently uses mock data generator (production implementation pending)
- Schema supports provider-specific data structures through type-safe enums

**Email Service**
- Resend integration configured for transactional emails
- Email templates created (HTML + text versions) for diagnostic reports
- Currently used for booking confirmation notifications (to be implemented)
- Connection ID: connection:conn_resend_01K8HJB21B5J9MDV5MSSX6SK03

**UI Libraries**
- Radix UI primitives for 20+ accessible component patterns
- Lucide React for consistent iconography
- React Hook Form with Zod resolvers for form validation
- TanStack Query for server state management

**Styling & Design**
- Tailwind CSS with PostCSS processing
- Autoprefixer for cross-browser compatibility
- CSS custom properties for theme variables
- Google Fonts CDN for Inter font family

**Development Tools**
- TypeScript for full-stack type safety
- Replit-specific plugins for error overlay, dev banner, and code cartography
- ESBuild for fast server-side bundling in production

## Data Model

### Core Types (shared/schema.ts)

```typescript
PhoneProvider: "CallRail" | "GoHighLevel" | "RingCentral" | "Nextiva"

DiagnosticResult: {
  totalLoss: number,
  missedCalls: number,
  afterHoursCalls: number,
  abandonedCalls: number,
  avgRevenuePerCall: number,
  totalMissedOpportunities: number,
  provider: PhoneProvider,
  month: string
}
```

## User Journey

1. **Welcome Screen**: User sees dramatic "How much are you losing?" headline
2. **Provider Selection**: User selects their phone system provider (no login/email required)
3. **Analysis**: System analyzes call data with loading animation (500-1000ms)
4. **Results**: Large animated counter reveals total monthly losses with breakdown
5. **Booking**: User clicks "Reclaim Your Revenue" to open booking form
6. **Contact Collection**: Form collects name, email, phone, company (optional) to book a call
7. **Confirmation**: Success message displays for 3.5 seconds, then returns to Results screen

## Testing & Quality

- End-to-end test coverage for complete user journey
- Responsive design verified across desktop and mobile viewports
- Error handling tested with retry capability
- Typography hierarchy and contrast verified
- Animations tested (dramatic counter with easeOutExpo easing)

## Future Enhancements (Planned)

- Real CallRail API integration for actual call data
- GoHighLevel API integration for CRM call tracking
- RingCentral and Nextiva API connections
- Persistent user sessions with PostgreSQL database
- Email delivery system for diagnostic reports
