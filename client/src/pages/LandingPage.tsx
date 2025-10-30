import { ArrowRight, Target, Zap, TrendingUp, Users, Rocket } from "lucide-react";
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
            We're rebuilding how small businesses diagnose and fix revenue leaks — starting with the phone systems that quietly drain billions every year.
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

      {/* The Hook - The Invisible Drain */}
      <section className="py-20 px-4 border-t border-white/10">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="flex items-center gap-4 mb-8">
            <Target className="w-10 h-10" style={{ color: BOTTLNEKK_GREEN }} />
            <h2 className="text-3xl sm:text-4xl font-thin tracking-tight" data-testid="text-hook-heading">
              The Invisible Drain
            </h2>
          </div>
          
          <div className="space-y-6 text-lg sm:text-xl font-light text-white/80 leading-relaxed">
            <p>
              Every home-service business thinks they have a sales problem.
              <br />
              <span className="text-white font-normal">In reality, they have a visibility problem.</span>
            </p>
            
            <p>
              Every missed call. Every stalled lead. Every untracked voicemail.
              <br />
              <span className="text-white font-normal">That's revenue slipping through the cracks — silently, every single day.</span>
            </p>
            
            <div className="pt-6 text-center">
              <div className="inline-block p-8 border-2 rounded-2xl" style={{ borderColor: BOTTLNEKK_GREEN }}>
                <p className="text-2xl sm:text-3xl font-thin mb-2">Across <span style={{ color: BOTTLNEKK_GREEN }} className="font-normal">1.3 million</span> home-service businesses in the U.S.,</p>
                <p className="text-2xl sm:text-3xl font-thin">those cracks add up to over <span style={{ color: BOTTLNEKK_GREEN }} className="font-bold text-4xl sm:text-5xl">$30 billion</span> a year</p>
                <p className="text-lg text-white/60 mt-4">in lost opportunity.</p>
              </div>
            </div>
            
            <p className="text-center text-2xl font-normal" style={{ color: BOTTLNEKK_GREEN }}>
              Bottlnekk was built to expose that — before it kills their growth.
            </p>
          </div>
        </div>
      </section>

      {/* The Solution - The Diagnostic Engine */}
      <section className="py-20 px-4 border-t border-white/10">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="flex items-center gap-4 mb-8">
            <Zap className="w-10 h-10" style={{ color: BOTTLNEKK_GREEN }} />
            <h2 className="text-3xl sm:text-4xl font-thin tracking-tight" data-testid="text-solution-heading">
              The Diagnostic Engine
            </h2>
          </div>
          
          <div className="space-y-6 text-lg sm:text-xl font-light text-white/80 leading-relaxed">
            <p className="text-2xl font-normal text-white">
              Bottlnekk is the first AI-powered diagnostic platform that detects and quantifies where small businesses are losing money — starting with their phones.
            </p>
            
            <p>
              It connects directly to systems like <span className="text-white">RingCentral</span> and <span className="text-white">Zoom Phone</span>, analyzes 30 days of real call data, and instantly shows how much revenue was lost to missed or delayed calls.
            </p>
            
            <p>
              Then — using automation infrastructure built by our fulfillment partner, <span className="text-white font-normal">Hexona Systems</span> — we deploy AI-powered fixes that recover that lost revenue automatically.
            </p>
            
            <div className="pt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="p-6 border border-white/10 rounded-xl">
                <p className="text-2xl font-light mb-2" style={{ color: BOTTLNEKK_GREEN }}>Diagnose the leak.</p>
              </div>
              <div className="p-6 border border-white/10 rounded-xl">
                <p className="text-2xl font-light mb-2" style={{ color: BOTTLNEKK_GREEN }}>Automate the fix.</p>
              </div>
              <div className="p-6 border border-white/10 rounded-xl">
                <p className="text-2xl font-light mb-2" style={{ color: BOTTLNEKK_GREEN }}>Protect the flow.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Traction - Proof That It Works */}
      <section className="py-20 px-4 border-t border-white/10">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="flex items-center gap-4 mb-8">
            <TrendingUp className="w-10 h-10" style={{ color: BOTTLNEKK_GREEN }} />
            <h2 className="text-3xl sm:text-4xl font-thin tracking-tight" data-testid="text-traction-heading">
              Proof That It Works
            </h2>
          </div>
          
          <p className="text-xl font-light text-white/80 mb-12">
            Bottlnekk isn't theory — it's built on a battle-tested backend.
          </p>
          
          <p className="text-lg font-light text-white/70 mb-8">
            Our fulfillment engine, powered by <span className="text-white">Hexona Systems</span>, has already recovered millions in lost revenue for small businesses using the same automation architecture behind Bottlnekk.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Tire Boss Case Study */}
            <div 
              className="border-2 rounded-2xl p-8 space-y-6"
              style={{ borderColor: BOTTLNEKK_GREEN, background: 'linear-gradient(135deg, rgba(0, 201, 123, 0.05) 0%, rgba(0, 0, 0, 0) 100%)' }}
              data-testid="case-study-tire-boss"
            >
              <div>
                <h3 className="text-2xl font-light mb-1">🧰 Tire Boss</h3>
                <p className="text-sm text-white/50">Automotive</p>
              </div>
              
              <div className="space-y-3">
                <p className="text-white/80">
                  Missed calls dropped <span className="text-white font-normal">35% → 2%</span>
                </p>
                <p className="text-white/80">
                  Response time cut from <span className="text-white font-normal">6 hours → 42 seconds</span>
                </p>
                <div className="pt-2">
                  <p className="text-2xl font-light" style={{ color: BOTTLNEKK_GREEN }}>
                    $50K → $65K monthly (+30%)
                  </p>
                </div>
              </div>
            </div>

            {/* WealthIO Case Study */}
            <div 
              className="border-2 rounded-2xl p-8 space-y-6"
              style={{ borderColor: BOTTLNEKK_GREEN, background: 'linear-gradient(135deg, rgba(0, 201, 123, 0.05) 0%, rgba(0, 0, 0, 0) 100%)' }}
              data-testid="case-study-wealthio"
            >
              <div>
                <h3 className="text-2xl font-light mb-1">🎓 WealthIO Daycare</h3>
                <p className="text-sm text-white/50">Education</p>
              </div>
              
              <div className="space-y-3">
                <p className="text-white/80">
                  "Zara," an AI appointment setter, cut time-to-first contact by <span className="text-white font-normal">81%</span>
                </p>
                <p className="text-white/80">
                  Boosted registrations by <span className="text-white font-normal">15%</span>
                </p>
                <div className="pt-2">
                  <p className="text-2xl font-light" style={{ color: BOTTLNEKK_GREEN }}>
                    Doubled return on ad spend
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-xl font-light text-white/90 text-center pt-8">
            Now we're taking that proven fulfillment system — and putting it behind a front-end diagnostic experience that every small business can access in minutes.
          </p>
        </div>
      </section>

      {/* Market Opportunity */}
      <section className="py-20 px-4 border-t border-white/10">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="flex items-center gap-4 mb-8">
            <Users className="w-10 h-10" style={{ color: BOTTLNEKK_GREEN }} />
            <h2 className="text-3xl sm:text-4xl font-thin tracking-tight" data-testid="text-market-heading">
              The Unseen $30 Billion
            </h2>
          </div>
          
          <div className="space-y-6 text-lg sm:text-xl font-light text-white/80 leading-relaxed">
            <p>
              There are over <span className="text-white font-normal">1.3 million home-service businesses</span> in the U.S. alone — plumbers, roofers, HVAC, dental offices, and more.
            </p>
            
            <p>
              Each one loses <span className="font-normal" style={{ color: BOTTLNEKK_GREEN }}>$25K–$100K</span> a year in missed opportunities they can't see.
            </p>
            
            <div className="text-center py-8">
              <p className="text-3xl sm:text-4xl font-thin">
                That's a <span className="font-bold text-5xl sm:text-6xl" style={{ color: BOTTLNEKK_GREEN }}>$30B+</span> leak
              </p>
              <p className="text-2xl font-thin mt-2">hiding in plain sight.</p>
            </div>
            
            <div className="pt-6 space-y-4 text-xl">
              <p className="font-normal text-white">Bottlnekk's mission is simple:</p>
              <ul className="space-y-2 pl-6">
                <li>Make every dollar traceable.</li>
                <li>Make every leak visible.</li>
                <li>And make every small business unbreakable.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* The Ask */}
      <section className="py-20 px-4 border-t border-white/10">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="flex items-center gap-4 mb-8">
            <Rocket className="w-10 h-10" style={{ color: BOTTLNEKK_GREEN }} />
            <h2 className="text-3xl sm:text-4xl font-thin tracking-tight" data-testid="text-ask-heading">
              What We're Building Next
            </h2>
          </div>
          
          <div className="space-y-6 text-lg sm:text-xl font-light text-white/80 leading-relaxed">
            <p>
              Right now, Bottlnekk is partnering with agencies, automation firms, and early adopters to deploy our diagnostic and recovery system across the home-service industry.
            </p>
            
            <div className="p-8 border-2 rounded-2xl space-y-6" style={{ borderColor: BOTTLNEKK_GREEN }}>
              <p className="text-2xl font-normal text-white">
                We're preparing to raise a <span style={{ color: BOTTLNEKK_GREEN }}>$500K pre-seed round</span> to:
              </p>
              
              <ul className="space-y-3 text-lg">
                <li className="flex items-start gap-3">
                  <span style={{ color: BOTTLNEKK_GREEN }}>→</span>
                  <span>Expand our AI diagnostic engine</span>
                </li>
                <li className="flex items-start gap-3">
                  <span style={{ color: BOTTLNEKK_GREEN }}>→</span>
                  <span>Integrate call + CRM analysis layers</span>
                </li>
                <li className="flex items-start gap-3">
                  <span style={{ color: BOTTLNEKK_GREEN }}>→</span>
                  <span>Grow our fulfillment capacity and partner network</span>
                </li>
              </ul>
            </div>
            
            <div className="pt-6 space-y-4 text-xl font-normal text-white text-center">
              <p>We're not another automation company.</p>
              <p className="text-2xl" style={{ color: BOTTLNEKK_GREEN }}>
                We're the diagnostic layer before automation — the system that shows you what's broken, before it costs you your business.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Vision */}
      <section className="py-20 px-4 border-t border-white/10">
        <div className="max-w-4xl mx-auto space-y-10">
          <h2 className="text-3xl sm:text-4xl font-thin tracking-tight text-center" data-testid="text-vision-heading">
            What Comes After
          </h2>
          
          <div className="space-y-6 text-lg sm:text-xl font-light text-white/80 leading-relaxed text-center">
            <p className="text-2xl font-normal text-white">
              First, we diagnose revenue leaks.
            </p>
            <p className="text-2xl font-normal text-white">
              Next, we diagnose workflow leaks.
            </p>
            <p className="text-2xl font-normal text-white">
              Eventually — Bottlnekk becomes the central nervous system for small business optimization.
            </p>
            
            <div className="pt-8 pb-6">
              <p className="text-xl text-white/90">
                A platform where every minute, every call, and every dollar is accounted for — automatically.
              </p>
            </div>
            
            <div className="pt-4 space-y-2">
              <p className="text-2xl font-thin">That's not just automation.</p>
              <p className="text-3xl font-normal" style={{ color: BOTTLNEKK_GREEN }}>
                That's autonomy.
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
            Help us rebuild how small businesses see themselves.
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
        <div className="max-w-7xl mx-auto text-center text-sm text-white/40">
          <p>© 2025 Bottlnekk. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
