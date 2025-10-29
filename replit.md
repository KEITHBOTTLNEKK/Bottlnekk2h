# Revenue Leak Diagnostic Tool

## Overview

A premium, Apple-inspired web application designed for home service businesses (plumbing, HVAC, electrical) to identify and quantify revenue losses from missed phone calls, after-hours opportunities, and abandoned calls. The tool features a dramatic, high-contrast black minimalist design with a multi-step diagnostic flow that analyzes phone system data and delivers impactful financial insights.

**Status**: MVP Complete ✅ - Fully functional with mock data generator

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

**October 29, 2025** - Typography & Branding Enhancements
- **Inline Font Sizing**: Switched from Tailwind classes to inline styles for reliable font size control across all screens
- **Dramatic Scaling**: Welcome headline now 96px-160px (responsive), Results number 192px-320px for maximum visual impact
- **Bold Headlines**: Connect screen "Which phone system do you use?" changed to bold font weight for emphasis
- **Company Emblems**: Added minimalist monogram initials ("RC" for RingCentral, "Z" for Zoom) in circular frames
- **Enhanced CTAs**: Larger button and subtext sizes for improved readability and conversion
- **Security Badge**: Bolded "Your data is encrypted and secure" message for trust-building
- **Horizontal Spread**: Welcome screen text now spans full viewport width with refined letter spacing

**October 28, 2025** - Zoom Phone OAuth Integration Complete
- **Full OAuth Implementation**: Added complete Zoom Phone OAuth flow (login, callback, disconnect, status endpoints)
- **API Client**: Implemented fetchZoomPhoneAnalytics() to fetch real Zoom call history and calculate missed/after-hours calls
- **Frontend Integration**: ConnectScreen now detects Zoom connection status and initiates OAuth when needed
- **Seamless Flow**: After Zoom OAuth success, shows checkmark → "One more thing..." → deal size question → analysis
- **Custom Deal Size**: Zoom analytics use user's custom avgDealSize (default $1000) instead of hardcoded value
- **Configuration Required**: Zoom OAuth redirect URI must be registered in Zoom app settings (standard OAuth requirement)
- **Testing**: End-to-end test verified complete flow works with mock data when OAuth not configured
- **Consistency**: Follows identical pattern to RingCentral OAuth implementation for maintainability

**October 27, 2025** - OAuth Flow Perfection & Interactive Deal Size
- **Success Moment**: After OAuth, show checkmark animation with "Connected" message (1.5s)
- **Seamless Transition**: Fade from success moment into deal size question
- **Steve Jobs Verbiage**: "What's a customer worth to you?" - personal, value-focused (not "average sale")
- **Honest Flow**: Ask question first → User enters → THEN actually analyze with their number (no fake delays)
- Custom deal size used in real-time calculation instead of hardcoded $350
- Clean underline input style with "Looks good" button

**October 27, 2025** - Steve Jobs Simplification & Timezone Fix
- **Critical Design Decision**: Removed "abandoned calls" metric entirely following Steve Jobs philosophy of radical simplification
- Business owner insight: A missed opportunity is a missed opportunity - no need for technical categories
- Simplified to two metrics: Missed Calls + After-Hours Calls (subset)
- Fixed timezone conversion bug: All timestamps now converted to Eastern Time before business hours calculation (8am-6pm weekday check)
- Updated analytics logic: Each call counted exactly once (no double-counting), after-hours is a subset of missed calls
- Schema simplified: Removed abandonedCalls field from DiagnosticResult type and database
- ResultsScreen redesigned: Clean 2-column grid showing only what matters

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
- `ConnectScreen`: Grid of phone provider cards (RingCentral, Vonage, Nextiva, 8x8, Zoom Phone) with OAuth connection capability
- `AnalysisScreen`: **Interactive loading screen** - Shows "Connected to [provider]" message + deal size input ("What's your average sale?") while analyzing. User enters custom deal size, clicks "Looks good" to proceed
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
- Mock data generation for realistic phone metrics (missed calls, after-hours calls as subset)
- Simulated API delay (500-1000ms) for realistic user experience
- Timezone-aware: All timestamps converted to Eastern Time for business hours calculation

**Data Layer**
- In-memory storage implementation (MemStorage class) for diagnostic results
- UUID-based record identification
- Schema definitions in shared directory for full-stack type safety

**Analytics Logic (Steve Jobs Simplicity)**
- Missed calls: Any unanswered inbound call (includes Missed, Voicemail, Abandoned statuses)
- After-hours calls: Subset of missed calls that occurred outside business hours (8am-6pm ET, Mon-Fri)
- Each call counted exactly ONCE (no double-counting)
- Average revenue per call: $350 (industry standard for home services)
- Total loss calculated as: missedCalls × avgRevenuePerCall
- Timezone handling: All UTC timestamps converted to Eastern Time before business hours check

**Request/Response Pipeline**
- JSON request body parsing with raw body preservation for webhook support
- Request logging middleware with duration tracking
- CORS-ready with credential support
- Comprehensive error handling with appropriate HTTP status codes

### External Dependencies

**Phone System Integrations**
- Designed to connect with top 5 enterprise VOIP providers: RingCentral, Vonage, Nextiva, 8x8, Zoom Phone
- **RingCentral OAuth**: Fully functional with real call analytics data
- **Zoom Phone OAuth**: Fully implemented (requires redirect URI registration in Zoom app settings)
- **Other Providers**: Vonage, Nextiva, 8x8 currently use mock data (OAuth implementation pending)
- Schema supports provider-specific data structures through type-safe enums
- OAuth redirect URI setup required for production use (must match deployment URL)

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
PhoneProvider: "RingCentral" | "Vonage" | "Nextiva" | "8x8" | "Zoom Phone"

DiagnosticResult: {
  totalLoss: number,
  missedCalls: number,
  afterHoursCalls: number,
  avgRevenuePerCall: number,
  totalMissedOpportunities: number,
  provider: PhoneProvider,
  month: string
}
```

## User Journey

1. **Welcome Screen**: User sees dramatic "How much are you losing?" headline
2. **Provider Selection**: User selects their phone system provider (no login/email required)
3. **OAuth (if RingCentral or Zoom Phone)**: User clicks "Connect [Provider]" → completes OAuth → **straight to Analysis screen**
4. **Success Moment**: Shows checkmark with "Connected" (1.5 seconds)
5. **Deal Size Question**: 
   - Smooth fade to: "What's a customer worth to you?"
   - User edits deal size (default $350) and clicks "Looks good"
   - **Honest approach**: No analysis until they answer
6. **Actual Analysis**: 
   - "Analyzing Call Data..." with dots
   - System actually crunches numbers with their custom deal size
7. **Results**: Large animated counter reveals total monthly losses with breakdown (using their custom deal size)
6. **Booking**: User clicks "Reclaim Your Revenue" to open booking form
7. **Contact Collection**: Form collects name, email, phone, company (optional) to book a call
8. **Confirmation**: Success message displays for 3.5 seconds, then returns to Results screen

## Testing & Quality

- End-to-end test coverage for complete user journey
- Responsive design verified across desktop and mobile viewports
- Error handling tested with retry capability
- Typography hierarchy and contrast verified
- Animations tested (dramatic counter with easeOutExpo easing)

## Future Enhancements (Planned)

- Vonage Business Cloud OAuth integration (pending developer account approval)
- Nextiva, 8x8, and Zoom Phone API connections
- Email delivery system for diagnostic reports to booking leads
- Enhanced analytics dashboard for tracking multiple diagnostics over time
- White-label version for phone system resellers
