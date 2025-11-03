import { Navigation } from "./Navigation";
import { Link } from "wouter";

interface WelcomeScreenProps {
  onStart: () => void;
  onRestart?: () => void;
}

const BOTTLNEKK_GREEN = "#00C97B";

export function WelcomeScreen({ onStart, onRestart }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-black dark:bg-black">
      <Navigation onLogoClick={onRestart} />

      {/* Hero Section */}
      <div className="min-h-screen flex items-center justify-center px-8 sm:px-12 lg:px-16">
        <div className="w-full text-center space-y-12">
          <div className="space-y-6">
            <h1 
              className="font-thin text-white leading-none"
              style={{ fontSize: 'clamp(3.5rem, 7vw, 6.5rem)', letterSpacing: '0.02em', fontWeight: '200' }}
              data-testid="heading-welcome"
            >
              How much are you losing?
            </h1>
            <p 
              className="font-light text-[#9CA3AF]"
              style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)', letterSpacing: '0.05em' }}
              data-testid="text-subheading"
            >
              It's more than you think.
            </p>
          </div>

          <div className="pt-16">
            <button
              onClick={onStart}
              className="inline-flex items-center justify-center px-8 sm:px-12 md:px-16 py-5 sm:py-6 font-bold text-white border-2 rounded-xl transition-all duration-300"
              style={{ 
                fontSize: 'clamp(1.125rem, 3vw, 1.5rem)',
                borderColor: BOTTLNEKK_GREEN,
                backgroundColor: 'transparent',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = BOTTLNEKK_GREEN;
                e.currentTarget.style.color = '#000000';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#FFFFFF';
              }}
              data-testid="button-start"
            >
              Show Me The Number
            </button>
          </div>
        </div>
      </div>

      {/* Trust Block */}
      <div className="px-8 sm:px-12 lg:px-16 pb-16" data-testid="section-trust">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <p 
            className="font-extralight text-[#9CA3AF] leading-relaxed"
            style={{ fontSize: 'clamp(1.125rem, 2.5vw, 1.375rem)', letterSpacing: '0.03em' }}
            data-testid="text-trust-block"
          >
            Built by founders who've lived the pain of revenue leaks firsthand. No boardroom theory—just real solutions from the trenches.
          </p>
          <Link href="/about">
            <button
              className="inline-flex items-center gap-2 font-light text-white transition-all duration-300 hover:gap-3"
              style={{ 
                fontSize: 'clamp(1rem, 2vw, 1.125rem)',
                color: BOTTLNEKK_GREEN,
              }}
              data-testid="link-meet-team"
            >
              Meet the team
              <span className="text-xl">→</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Single Testimonial - Marquee */}
      <div className="px-8 sm:px-12 lg:px-16 pb-16" data-testid="section-testimonial">
        <div className="max-w-3xl mx-auto">
          <div 
            className="p-8 sm:p-12 rounded-2xl border"
            style={{ borderColor: '#1F2937', backgroundColor: '#0A0A0A' }}
            data-testid="testimonial-marquee"
          >
            <p 
              className="font-extralight text-[#D1D5DB] leading-relaxed italic mb-6"
              style={{ fontSize: 'clamp(1.063rem, 2.5vw, 1.25rem)', letterSpacing: '0.01em' }}
            >
              "The automated callback system has been a game-changer for us. Not only have we seen a significant increase in sales, but our customers also appreciate the quick response times. It's like having an extra team member that can handle everything!"
            </p>
            <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: '#1F2937' }}>
              <div>
                <p className="font-light text-white">Tire Boss Team</p>
                <p className="font-extralight text-[#6B7280] text-sm">High-Volume Tire Shop</p>
              </div>
              <div className="text-right">
                <p className="font-light text-sm" style={{ color: BOTTLNEKK_GREEN }}>+30% Sales</p>
                <p className="font-extralight text-[#6B7280] text-xs">97% Faster Response</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Partner Logos */}
      <div className="px-8 sm:px-12 lg:px-16 pb-24" data-testid="section-partners">
        <div className="max-w-5xl mx-auto">
          <p 
            className="text-center font-extralight uppercase tracking-widest text-[#6B7280] mb-12"
            style={{ fontSize: '0.75rem' }}
          >
            Powered By
          </p>
          <div className="flex flex-wrap items-center justify-center gap-12 sm:gap-16 opacity-60">
            <div className="font-light text-white text-2xl tracking-tight">OpenAI</div>
            <div className="font-light text-white text-2xl tracking-tight">Snowflake</div>
            <div className="font-light text-white text-xl tracking-tight">Vapi.ai</div>
          </div>
        </div>
      </div>
    </div>
  );
}
