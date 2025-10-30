import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Branding } from "@/components/Branding";
import { CTAButton } from "@/components/CTAButton";

const BOTTLNEKK_GREEN = "#00C97B";

export function LandingPage() {

  return (
    <div className="min-h-screen bg-black text-white">
      <Branding accentColor={BOTTLNEKK_GREEN} />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-5xl w-full text-center space-y-16">
          {/* Main Headline */}
          <h1 
            className="text-6xl sm:text-7xl lg:text-8xl font-thin tracking-tight leading-tight"
            data-testid="text-hero-headline"
          >
            Stop Losing{" "}
            <span style={{ color: BOTTLNEKK_GREEN }} className="font-normal">
              $10,000+
            </span>
            <br />
            Every Month to Missed Calls
          </h1>
          
          {/* Subheadline */}
          <p 
            className="text-xl sm:text-2xl font-light text-white/70 tracking-wide max-w-3xl mx-auto"
            data-testid="text-hero-subhead"
          >
            See exactly how much revenue is leaking through your phone system in 60 seconds
          </p>

          {/* CTA Button */}
          <div className="pt-8">
            <Link href="/diagnostic">
              <CTAButton data-testid="button-hero-cta">
                Show Me My Revenue Leak
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </CTAButton>
            </Link>
          </div>
        </div>
      </section>

      {/* Customer Result - Single Example */}
      <section className="py-20 px-4 border-t border-white/10">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="space-y-2">
            <p className="text-2xl font-light text-white/70">
              ACME Plumbing
            </p>
            <div 
              className="text-5xl sm:text-6xl font-thin"
              style={{ color: BOTTLNEKK_GREEN }}
              data-testid="text-customer-revenue"
            >
              $50K → $65K monthly
            </div>
            <p className="text-lg text-white/50">
              recovered by fixing their phone leak
            </p>
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
