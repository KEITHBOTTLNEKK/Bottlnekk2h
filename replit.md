# Revenue Leak Diagnostic Tool

## Overview

A premium, Apple-inspired web application designed for home service businesses (plumbing, HVAC, electrical) to identify and quantify revenue losses from missed phone calls, after-hours opportunities, and abandoned calls. The tool features a dramatic, high-contrast black minimalist design with a multi-step diagnostic flow that analyzes phone system data and delivers impactful financial insights.

## User Preferences

Preferred communication style: Simple, everyday language.

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

### Backend Architecture

**Server Framework**
- Express.js running on Node.js with TypeScript
- ESM module system for modern JavaScript features
- Custom Vite middleware integration for development HMR

**API Structure**
- RESTful API endpoint: POST /api/diagnostic/analyze
- Zod schema validation for type-safe request/response handling
- Mock data generation for realistic phone metrics (missed calls, after-hours calls, abandoned calls)
- Simulated API delay (500-1000ms) for realistic user experience

**Data Layer**
- In-memory storage implementation (MemStorage class) for diagnostic results
- UUID-based record identification
- Drizzle ORM configured for PostgreSQL (ready for database integration)
- Schema definitions in shared directory for full-stack type safety

**Request/Response Pipeline**
- JSON request body parsing with raw body preservation for webhook support
- Request logging middleware with duration tracking
- CORS-ready with credential support
- Error handling with appropriate HTTP status codes

### External Dependencies

**Phone System Integrations**
- Designed to connect with four major phone providers: CallRail, GoHighLevel, RingCentral, Nextiva
- Currently uses mock data generator (production implementation pending)
- Schema supports provider-specific data structures through type-safe enums

**Database**
- PostgreSQL via Neon serverless driver (@neondatabase/serverless)
- Drizzle ORM for type-safe database queries and migrations
- Database schema managed in shared/schema.ts for client-server synchronization
- Migration support through drizzle-kit

**UI Libraries**
- Radix UI primitives for 20+ accessible component patterns (dialogs, dropdowns, tooltips, etc.)
- Embla Carousel for potential future carousel implementations
- Lucide React for consistent iconography
- React Hook Form with Zod resolvers for potential form validation needs

**Styling & Design**
- Tailwind CSS with PostCSS processing
- Autoprefixer for cross-browser compatibility
- CSS custom properties for theme variables
- Google Fonts CDN for Inter font family

**Development Tools**
- TypeScript for full-stack type safety
- Replit-specific plugins for error overlay, dev banner, and code cartography
- ESBuild for fast server-side bundling in production