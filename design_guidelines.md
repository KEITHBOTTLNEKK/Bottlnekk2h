# Revenue Leak Diagnostic Tool - Design Guidelines

## Design Philosophy
Apple-inspired aesthetic with dramatic, high-contrast minimalism. The tool should feel premium and professional, making home service business owners take their revenue losses seriously through stark visual clarity and powerful number reveals.

## Color System
- **Background**: Pure black (#000000) throughout entire application
- **Primary Text**: White (#FFFFFF)
- **Secondary Text**: #9CA3AF (light gray)
- **Tertiary Text**: #6B7280 (medium gray)
- **Accent**: None - maintain pure contrast

## Typography
- **Font Family**: Inter (via Google Fonts CDN)
- **Font Weights**: Ultra-thin range only (100, 200, 300)
- **Hierarchy**:
  - Headlines: Weight 100, large scale (text-6xl to text-8xl)
  - Subtext: Weight 200-300, medium scale (text-lg to text-xl)
  - Body/CTAs: Weight 300
  - Numbers: Weight 100 for dramatic effect, massive scale

## Layout & Spacing
- **Spacing Units**: Use Tailwind spacing of 4, 8, 12, 16, 24, 32 for consistency
- **Container**: Full viewport width, centered content with max-w-4xl for text elements
- **Vertical Rhythm**: Each screen should be centered vertically and horizontally (min-h-screen with flex centering)
- **Padding**: Generous whitespace - py-16 to py-24 for sections

## Screen-by-Screen Design

### 1. Welcome Screen
- Centered layout, single viewport height
- **Headline**: "How much are you losing?" - Ultra-thin (weight 100), text-6xl or larger
- **Subtext**: "Every missed call is lost revenue." - Weight 200, text-xl, gray (#9CA3AF)
- **CTA Button**: "Show Me The Number" - Solid white background, black text, rounded-lg, px-8 py-4, hover state with slight opacity change

### 2. Connect Screen
- Centered layout
- **Headline**: "Unlock Your Real Number" - Weight 100, text-5xl
- **Subtext**: "To calculate your losses, I need access to your phone system." - Weight 200, text-lg, gray
- **Connection Options**: 4 provider cards arranged in 2x2 grid (responsive to single column on mobile)
  - Each card: White border (border-2), minimal padding, provider name in white text
  - Cards should be clickable with subtle hover states (opacity or border brightness)
  - Providers: CallRail, GoHighLevel, RingCentral, Nextiva

### 3. Analysis Screen
- Ultra-minimal, centered
- **Loading Text**: "Analyzing Call Data..." - Weight 100, text-4xl, white
- **Transition**: Fast (500ms maximum), smooth fade
- Consider subtle loading indicator (thin white line or dots)

### 4. Results Screen
- Centered layout with vertical stacking
- **Main Number**: Massive animated counter - Weight 100, text-8xl or larger, white
  - Format: `$XXX,XXX`
  - Animation: easeOutExpo easing (fast start, sharp deceleration)
  - Should count up dramatically from $0
- **Subtext**: "lost this month from XX missed opportunities." - Weight 200, text-xl, gray, positioned directly below number
- **Breakdown Section**: 
  - Grid layout (2x2 on desktop, single column mobile)
  - Each metric shows: Label (gray, weight 300) + Value (white, weight 100, larger)
  - Metrics: Missed Calls, After-Hours Calls, Abandoned Calls, Avg Revenue Per Call
  - Spacing between items: gap-8 or gap-12
- **Final CTA**: "Reclaim Your Revenue" - Same styling as Welcome CTA, positioned at bottom

## Component Architecture
- **WelcomeScreen**: Full-screen centered layout
- **ConnectScreen**: Header + grid of provider cards
- **AnalysisScreen**: Minimal loading state
- **ResultsScreen**: Large number + breakdown grid + CTA

## Animations
- **Counter Animation**: Custom useCounter hook with exponential easing
  - Duration: 2-3 seconds
  - Easing: easeOutExpo (starts fast, decelerates sharply)
  - Should feel impactful and dramatic
- **Screen Transitions**: Fade in/out, 300-500ms
- **Hover States**: Subtle opacity changes (0.8-0.9) on interactive elements

## Responsive Behavior
- **Desktop**: Full screen-centered layouts, 2x2 grids
- **Mobile**: Single column stacking, maintain dramatic typography scale (reduce to text-4xl/text-5xl for large headlines)
- **Touch Targets**: Minimum 44px height for buttons and cards
- **Breakpoints**: Use md: and lg: for two-tier responsive strategy

## Icons
Use Heroicons (outline style) for any supplementary icons - keep to absolute minimum. The design relies on typography and whitespace, not iconography.

## Images
No images required. This is a pure typography and data-driven experience.

## Accessibility
- High contrast maintained throughout (pure black/white)
- Focus states: Visible white outline on interactive elements
- Ensure counter animation doesn't trigger motion sensitivity (provide reduced-motion alternative)