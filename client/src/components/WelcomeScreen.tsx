import { Branding } from "./Branding";
import { Link } from "wouter";

interface WelcomeScreenProps {
  onStart: () => void;
  onRestart?: () => void;
}

const BOTTLNEKK_GREEN = "#00C97B";

export function WelcomeScreen({ onStart, onRestart }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-black dark:bg-black">
      <Branding onRestart={onRestart} accentColor={BOTTLNEKK_GREEN} />

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
      <div className="px-8 sm:px-12 lg:px-16 pb-24" data-testid="section-trust">
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
    </div>
  );
}
