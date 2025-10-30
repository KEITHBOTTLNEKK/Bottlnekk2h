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
      <section className="pt-32 pb-24 px-4">
        <div className="max-w-5xl mx-auto text-center space-y-12">
          {/* Main Headline */}
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-3">
              <span className="text-5xl sm:text-6xl lg:text-7xl font-thin tracking-tight">
                Behind Every
              </span>
              <div className="relative inline-block">
                <div 
                  className="absolute inset-0 rounded-full blur-xl opacity-30"
                  style={{ backgroundColor: BOTTLNEKK_GREEN }}
                />
                <img 
                  src={logoIcon}
                  alt="Bottlnekk Icon" 
                  className="h-14 w-14 sm:h-16 sm:w-16 lg:h-20 lg:w-20 relative z-10"
                  style={{ filter: 'brightness(0) invert(1)' }}
                  data-testid="hero-logo"
                />
              </div>
              <span 
                className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight"
                style={{ color: BOTTLNEKK_GREEN }}
              >
                Bottlnekk
              </span>
            </div>
            <h1 
              className="text-5xl sm:text-6xl lg:text-7xl font-thin tracking-tight"
              data-testid="text-hero-headline"
            >
              Freedom Lives.
            </h1>
          </div>
          
          {/* Subheadline */}
          <p 
            className="text-xl sm:text-2xl font-light text-white/70 tracking-wide max-w-4xl mx-auto leading-relaxed"
            data-testid="text-hero-subhead"
          >
            Bottlnekk helps small businesses see what's holding them back.
            <br />
            We reveal the leaks that quietly drain time, energy, and revenue.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <CTAButton 
              href="mailto:keith@bottlnekk.com?subject=Early%20Access%20Request"
              data-testid="button-request-access"
            >
              Request Early Access
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </CTAButton>
            <a href="mailto:keith@bottlnekk.com?subject=Partnership%20Inquiry">
              <button 
                className="px-8 py-4 text-lg font-light border-2 rounded-full transition-all hover:bg-white/5"
                style={{ borderColor: BOTTLNEKK_GREEN, color: BOTTLNEKK_GREEN }}
                data-testid="button-partner"
              >
                Partner With Us
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* 1. The Problem */}
      <section className="py-20 px-4 border-t border-white/10">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="sr-only">The Problem</h2>
          <div className="space-y-6 text-lg sm:text-xl font-light text-white/80 leading-relaxed">
            <p className="text-2xl sm:text-3xl font-thin text-white text-center">
              Small businesses don't fail because they can't sell.
              <br />
              <span className="font-normal" style={{ color: BOTTLNEKK_GREEN }}>
                They fail because they can't see.
              </span>
            </p>
            
            <div className="pt-6 space-y-4 text-center">
              <p>
                Every missed call. Every stalled lead. Every untracked voicemail.
                <br />
                <span className="text-white font-normal">That's lost money, lost momentum, lost growth.</span>
              </p>
            </div>
            
            <div className="pt-8 text-center">
              <p className="text-xl">
                Across <span className="font-normal text-white">1.3 million</span> home-service businesses in America,
              </p>
              <p className="text-3xl sm:text-4xl font-thin pt-2">
                over <span className="font-bold text-4xl sm:text-5xl" style={{ color: BOTTLNEKK_GREEN }}>$30 billion</span> disappears every year.
              </p>
              <p className="text-2xl font-normal pt-6 text-white">
                Bottlnekk brings that loss to light before it kills the business.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. The Solution */}
      <section className="py-20 px-4 border-t border-white/10">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="sr-only">The Solution</h2>
          <div className="space-y-6 text-lg sm:text-xl font-light text-white/80 leading-relaxed">
            <p className="text-2xl font-normal text-white">
              Bottlnekk is an AI system that finds and measures where money leaks out of a business.
              <br />
              <span className="font-light">It starts with phone systems like RingCentral and Zoom.</span>
            </p>
            
            <div className="pt-4 space-y-4">
              <p>
                We scan 30 days of call data and show the exact value of missed or delayed calls.
              </p>
              <p>
                Then our partner, <span className="text-white font-normal">Hexona Systems</span>, deploys automation that recovers that revenue.
              </p>
            </div>
            
            <div className="pt-8 text-center space-y-2">
              <p className="text-2xl font-normal text-white">
                See the leak.
              </p>
              <p className="text-2xl font-normal text-white">
                Fix the leak.
              </p>
              <p className="text-2xl font-normal" style={{ color: BOTTLNEKK_GREEN }}>
                Protect the flow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Proof */}
      <section className="py-20 px-4 border-t border-white/10">
        <div className="max-w-4xl mx-auto space-y-10">
          <h2 className="sr-only">Proof</h2>
          <p className="text-2xl sm:text-3xl font-thin text-white text-center">
            The technology behind Bottlnekk has already recovered millions.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 pt-4">
            {/* Tire Boss */}
            <div className="p-8 border border-white/20 rounded-2xl space-y-4">
              <h3 className="text-xl font-normal text-white">Tire Boss</h3>
              <p className="text-white/80 font-light">
                Cut missed calls from <span className="text-white font-normal">35% to 2%</span> and grew sales from <span style={{ color: BOTTLNEKK_GREEN }} className="font-normal">$50K to $65K</span>.
              </p>
            </div>
            
            {/* WealthIO Daycare */}
            <div className="p-8 border border-white/20 rounded-2xl space-y-4">
              <h3 className="text-xl font-normal text-white">WealthIO Daycare</h3>
              <p className="text-white/80 font-light">
                Reduced response time by <span className="text-white font-normal">81%</span> and <span style={{ color: BOTTLNEKK_GREEN }} className="font-normal">doubled ad performance</span>.
              </p>
            </div>
          </div>
          
          <p className="text-xl text-center pt-6 font-light text-white/80">
            What once required full automation teams now happens in minutes through Bottlnekk.
          </p>
        </div>
      </section>

      {/* 4. The Opportunity */}
      <section className="py-20 px-4 border-t border-white/10">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="sr-only">The Opportunity</h2>
          <div className="space-y-6 text-lg sm:text-xl font-light text-white/80 leading-relaxed text-center">
            <p>
              There are <span className="text-white font-normal">1.3 million</span> home-service businesses in the United States.
            </p>
            <p>
              Each loses between <span className="font-normal" style={{ color: BOTTLNEKK_GREEN }}>$25,000 and $100,000</span> every year to inefficiency.
            </p>
            
            <div className="pt-8">
              <p className="text-3xl sm:text-4xl font-thin">
                That's a <span className="font-bold text-4xl sm:text-5xl" style={{ color: BOTTLNEKK_GREEN }}>$30 billion opportunity</span>
              </p>
              <p className="text-2xl font-thin pt-2">waiting to be reclaimed.</p>
            </div>
            
            <p className="text-2xl font-normal text-white pt-8">
              Bottlnekk makes every dollar traceable and every leak visible.
            </p>
          </div>
        </div>
      </section>

      {/* 5. What We're Building */}
      <section className="py-20 px-4 border-t border-white/10">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="sr-only">What We're Building</h2>
          <div className="space-y-6 text-lg sm:text-xl font-light text-white/80 leading-relaxed">
            <p>
              We're partnering with agencies, automation firms, and early adopters to bring this system to every home-service business.
            </p>
            
            <p className="pt-4">
              Next, we're expanding Bottlnekk to analyze <span className="text-white font-normal">CRM and workflow data</span>, giving business owners full visibility across their operations.
            </p>
            
            <div className="pt-8 text-center space-y-4">
              <p className="text-2xl font-normal text-white">
                Bottlnekk is the <span style={{ color: BOTTLNEKK_GREEN }}>diagnostic layer</span> of modern business.
              </p>
              <p className="text-xl">
                It exposes what's hidden, repairs what's broken, and restores what's possible.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. The Vision */}
      <section className="py-20 px-4 border-t border-white/10">
        <div className="max-w-4xl mx-auto space-y-10">
          <h2 className="sr-only">The Vision</h2>
          <div className="space-y-6 text-lg sm:text-xl font-light text-white/80 leading-relaxed text-center">
            <p className="text-2xl font-normal text-white">
              We start with revenue leaks.
            </p>
            <p className="text-2xl font-normal text-white">
              Then we move to workflow leaks.
            </p>
            <p className="text-2xl font-normal text-white">
              Soon, Bottlnekk becomes the operating system for business performance.
            </p>
            
            <div className="pt-8">
              <p className="text-xl">
                A single platform that tracks every call, task, and dollar and helps teams move faster, cleaner, and smarter.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-20 px-4 border-t border-white/10">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-3xl sm:text-4xl font-thin tracking-tight">
            Join us.
          </h2>
          
          <p className="text-xl text-white/70 font-light">
            Help rebuild how small businesses see themselves.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <CTAButton 
              href="mailto:keith@bottlnekk.com?subject=Early%20Access%20Request"
              data-testid="button-footer-request-access"
            >
              Request Access
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </CTAButton>
            <a href="mailto:keith@bottlnekk.com?subject=Partnership%20Inquiry">
              <button 
                className="px-8 py-4 text-lg font-light border-2 rounded-full transition-all hover:bg-white/5"
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
      <footer className="py-8 px-4 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-white/40 font-light">
            © 2025 Bottlnekk. Building the diagnostic layer for modern business.
          </p>
        </div>
      </footer>
    </div>
  );
}
