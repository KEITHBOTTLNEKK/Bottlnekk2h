import { ArrowRight } from "lucide-react";
import { Branding } from "@/components/Branding";
import { CTAButton } from "@/components/CTAButton";
import logoIcon from "@assets/hourglass-cracked_transparent_1761722440145.png";

const BOTTLNEKK_GREEN = "#00C97B";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Branding accentColor={BOTTLNEKK_GREEN} />
      
      {/* Hero Section */}
      <section className="pt-40 pb-32 px-4">
        <div className="max-w-6xl mx-auto text-center space-y-16">
          {/* Main Headline */}
          <div className="space-y-12">
            <div className="flex items-center justify-center gap-4">
              <span className="text-6xl sm:text-7xl lg:text-8xl font-extralight tracking-tight">
                Behind Every
              </span>
              <div className="relative inline-block">
                <div 
                  className="absolute inset-0 rounded-full blur-2xl opacity-40"
                  style={{ backgroundColor: BOTTLNEKK_GREEN }}
                />
                <img 
                  src={logoIcon}
                  alt="Bottlnekk Icon" 
                  className="h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 relative z-10"
                  style={{ filter: 'brightness(0) invert(1)' }}
                  data-testid="hero-logo"
                />
              </div>
              <span 
                className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight"
                style={{ color: BOTTLNEKK_GREEN }}
              >
                Bottlnekk
              </span>
            </div>
            <h1 
              className="text-6xl sm:text-7xl lg:text-9xl font-extralight tracking-tighter leading-none"
              data-testid="text-hero-headline"
            >
              Freedom Lives.
            </h1>
          </div>
          
          {/* Subheadline */}
          <p 
            className="text-2xl sm:text-3xl font-extralight text-white/60 tracking-wide max-w-3xl mx-auto leading-relaxed"
            data-testid="text-hero-subhead"
          >
            We reveal the leaks that quietly drain revenue.
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

      {/* The Problem */}
      <section className="py-32 px-4 border-t border-white/5">
        <div className="max-w-5xl mx-auto text-center space-y-16">
          <h2 className="sr-only">The Problem</h2>
          
          <p className="text-4xl sm:text-5xl lg:text-6xl font-extralight leading-tight">
            Small businesses don't fail because they can't sell.
          </p>
          
          <p className="text-5xl sm:text-6xl lg:text-7xl font-light leading-tight" style={{ color: BOTTLNEKK_GREEN }}>
            They fail because they can't see.
          </p>
          
          <div className="py-16 space-y-8">
            <p className="text-9xl sm:text-[12rem] font-bold leading-none" style={{ color: BOTTLNEKK_GREEN }}>
              $30B
            </p>
            <p className="text-2xl sm:text-3xl font-extralight text-white/60">
              disappears every year across 1.3M businesses
            </p>
          </div>
        </div>
      </section>

      {/* The Solution */}
      <section className="py-32 px-4 border-t border-white/5">
        <div className="max-w-5xl mx-auto text-center space-y-20">
          <h2 className="sr-only">The Solution</h2>
          
          <p className="text-4xl sm:text-5xl font-light leading-tight">
            AI finds the leaks.
            <br />
            Hexona fixes them.
          </p>
          
          <p className="text-2xl sm:text-3xl font-extralight text-white/60 max-w-3xl mx-auto">
            30 days of call data. Exact dollar value of every missed opportunity.
          </p>
          
          <div className="pt-12">
            <p className="text-5xl sm:text-6xl lg:text-7xl font-light" style={{ color: BOTTLNEKK_GREEN }}>
              Protect the flow.
            </p>
          </div>
        </div>
      </section>

      {/* Proof */}
      <section className="py-32 px-4 border-t border-white/5">
        <div className="max-w-6xl mx-auto space-y-20">
          <h2 className="sr-only">Proof</h2>
          
          <p className="text-3xl sm:text-4xl font-extralight text-center text-white/80">
            Already recovered millions.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Tire Boss */}
            <div className="p-12 border-2 border-white/10 rounded-3xl text-center space-y-6 hover:border-white/20 transition-all">
              <h3 className="text-3xl font-light text-white">Tire Boss</h3>
              <p className="text-5xl font-bold" style={{ color: BOTTLNEKK_GREEN }}>
                $50K → $65K
              </p>
              <p className="text-xl font-extralight text-white/60">
                35% missed calls → 2%
              </p>
            </div>
            
            {/* WealthIO */}
            <div className="p-12 border-2 border-white/10 rounded-3xl text-center space-y-6 hover:border-white/20 transition-all">
              <h3 className="text-3xl font-light text-white">WealthIO</h3>
              <p className="text-5xl font-bold" style={{ color: BOTTLNEKK_GREEN }}>
                2x ROI
              </p>
              <p className="text-xl font-extralight text-white/60">
                81% faster response time
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Opportunity */}
      <section className="py-32 px-4 border-t border-white/5">
        <div className="max-w-5xl mx-auto text-center space-y-16">
          <h2 className="sr-only">The Opportunity</h2>
          
          <div className="space-y-12">
            <p className="text-9xl sm:text-[12rem] font-bold leading-none" style={{ color: BOTTLNEKK_GREEN }}>
              $30B
            </p>
            <p className="text-3xl sm:text-4xl font-light">
              waiting to be reclaimed
            </p>
          </div>
          
          <p className="text-2xl sm:text-3xl font-extralight text-white/60 max-w-3xl mx-auto pt-8">
            1.3 million businesses. $25K–$100K lost per year. Every dollar traceable.
          </p>
        </div>
      </section>

      {/* What We're Building */}
      <section className="py-32 px-4 border-t border-white/5">
        <div className="max-w-5xl mx-auto text-center space-y-16">
          <h2 className="sr-only">What We're Building</h2>
          
          <p className="text-4xl sm:text-5xl font-light leading-tight max-w-4xl mx-auto">
            The <span style={{ color: BOTTLNEKK_GREEN }}>diagnostic layer</span> of modern business.
          </p>
          
          <p className="text-2xl sm:text-3xl font-extralight text-white/60 max-w-3xl mx-auto">
            Expanding beyond phone systems into CRM and workflow analytics.
          </p>
        </div>
      </section>

      {/* The Vision */}
      <section className="py-32 px-4 border-t border-white/5">
        <div className="max-w-5xl mx-auto text-center space-y-12">
          <h2 className="sr-only">The Vision</h2>
          
          <div className="space-y-8">
            <p className="text-4xl sm:text-5xl font-light">
              Revenue leaks.
            </p>
            <p className="text-4xl sm:text-5xl font-light">
              Workflow leaks.
            </p>
            <p className="text-5xl sm:text-6xl font-normal" style={{ color: BOTTLNEKK_GREEN }}>
              Operating system.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-32 px-4 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center space-y-16">
          <h2 className="text-5xl sm:text-6xl font-extralight tracking-tight">
            Join us.
          </h2>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <CTAButton 
              href="mailto:keith@bottlnekk.com?subject=Early%20Access%20Request"
              data-testid="button-footer-request-access"
            >
              Request Access
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </CTAButton>
            <a href="mailto:keith@bottlnekk.com?subject=Partnership%20Inquiry">
              <button 
                className="px-10 py-5 text-lg font-light border-2 rounded-xl transition-all hover:bg-white/5 hover:scale-[1.02]"
                style={{ borderColor: BOTTLNEKK_GREEN, color: BOTTLNEKK_GREEN }}
                data-testid="button-footer-partner"
              >
                Partner With Bottlnekk
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-white/30 font-extralight tracking-wide">
            © 2025 Bottlnekk
          </p>
        </div>
      </footer>
    </div>
  );
}
