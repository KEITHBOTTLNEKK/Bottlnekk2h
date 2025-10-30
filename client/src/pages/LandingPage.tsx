import { ArrowRight } from "lucide-react";
import { Branding } from "@/components/Branding";
import { CTAButton } from "@/components/CTAButton";

const BOTTLNEKK_GREEN = "#00C97B";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Branding accentColor={BOTTLNEKK_GREEN} />
      
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          {/* Headline */}
          <h1 
            className="text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight leading-tight"
            data-testid="text-hero-headline"
          >
            Behind Every <span style={{ color: BOTTLNEKK_GREEN }} className="font-semibold">Bottlnekk</span>, Freedom Lives.
          </h1>
          
          {/* Intro Paragraph */}
          <p 
            className="text-xl sm:text-2xl font-light text-white/70 leading-relaxed max-w-3xl mx-auto"
            data-testid="text-intro"
          >
            Bottlnekk helps small businesses see what's holding them back. We reveal the leaks that quietly drain time, energy, and revenue—starting with phone systems that cost businesses billions every year.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
            <CTAButton 
              href="mailto:keith@bottlnekk.com?subject=Early%20Access%20Request"
              data-testid="button-request-access"
            >
              Request Early Access
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </CTAButton>
            <a href="mailto:keith@bottlnekk.com?subject=Partnership%20Inquiry">
              <button 
                className="px-10 py-5 text-lg font-light border-2 rounded-xl transition-all hover:bg-white/5 hover:scale-[1.02]"
                style={{ borderColor: BOTTLNEKK_GREEN, color: BOTTLNEKK_GREEN }}
                data-testid="button-partner"
              >
                Partner With Us
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-white/30 font-light">
            © 2025 Bottlnekk
          </p>
        </div>
      </footer>
    </div>
  );
}
