import { Link } from "wouter";
import { ArrowRight, Phone, TrendingUp, Users, CheckCircle2 } from "lucide-react";
import { Branding } from "@/components/Branding";
import { CTAButton } from "@/components/CTAButton";

const BOTTLNEKK_GREEN = "#00C97B";

export function LandingPage() {
  const caseStudies = [
    {
      company: "Tire Boss",
      industry: "Automotive",
      metric1: "97%",
      metric1Label: "Reduction in Response Time",
      metric2: "30%",
      metric2Label: "Sales Increase",
      revenue: "$50K → $65K monthly",
      quote: "The automated callback system has been a game-changer for us. Not only have we seen a significant increase in sales, but our customers also appreciate the quick response times."
    },
    {
      company: "MedSpa",
      industry: "Healthcare",
      metric1: "15%",
      metric1Label: "Booking Rate Increase",
      metric2: "2X",
      metric2Label: "Return on Ad Spend",
      quote: "Instant engagement with leads transformed our booking rate and customer satisfaction."
    },
    {
      company: "Real Estate Brokerage",
      industry: "Real Estate",
      metric1: "< 2 min",
      metric1Label: "Speed to Lead",
      metric2: "100%",
      metric2Label: "Lead Follow-Up Rate",
      quote: "No more missed opportunities. Every lead gets immediate attention and proper follow-up."
    },
    {
      company: "Call Centre",
      industry: "Customer Service",
      metric1: "81%",
      metric1Label: "Reduction in Response Time",
      metric2: "3X",
      metric2Label: "Team Efficiency Gain",
      quote: "Automated scheduling and follow-up freed up our team to focus on high-value conversations."
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Branding accentColor={BOTTLNEKK_GREEN} />
      
      {/* Tagline Section - Top of page */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div 
            className="text-2xl sm:text-3xl lg:text-4xl font-light tracking-wider inline-flex items-center justify-center gap-3 opacity-90"
            style={{ color: BOTTLNEKK_GREEN }}
            data-testid="text-tagline"
          >
            <span className="text-white/80">Behind Every</span>
            <svg width="32" height="48" viewBox="0 0 140 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block">
              <rect x="5" y="5" width="130" height="12" rx="6" fill="#1a1a1a" stroke="white" strokeWidth="3"/>
              <path d="M 25 25 L 25 70 Q 25 85 40 95 L 65 105 L 75 105 L 100 95 Q 115 85 115 70 L 115 25 Z" fill="none" stroke="white" strokeWidth="4"/>
              <rect x="67" y="105" width="6" height="18" fill={BOTTLNEKK_GREEN}/>
              <path d="M 25 175 L 25 130 Q 25 115 40 105 L 65 95 L 75 95 L 100 105 Q 115 115 115 130 L 115 175 Z" fill="none" stroke="white" strokeWidth="4"/>
              <rect x="5" y="183" width="130" height="12" rx="6" fill="#1a1a1a" stroke="white" strokeWidth="3"/>
            </svg>
            <span className="font-normal">Bottlnekk</span>
            <span className="text-white/80">Lives Freedom</span>
          </div>
        </div>
      </section>
      
      {/* Hero Section */}
      <section className="min-h-[70vh] flex items-center justify-center px-4 pb-20">
        <div className="max-w-5xl w-full text-center space-y-12">
          {/* Main Headline */}
          <div className="space-y-6">
            <h1 
              className="text-5xl sm:text-6xl lg:text-7xl font-thin tracking-tight leading-tight"
              data-testid="text-hero-headline"
            >
              Stop Losing{" "}
              <span style={{ color: BOTTLNEKK_GREEN }} className="font-normal">
                $15,000+
              </span>
              <br />
              Every Month to Missed Calls
            </h1>
            
            <p 
              className="text-xl sm:text-2xl font-light text-white/70 tracking-wide max-w-3xl mx-auto"
              data-testid="text-hero-subhead"
            >
              See exactly how much revenue is leaking through your phone system in 60 seconds
            </p>
          </div>

          {/* CTA Button */}
          <Link href="/diagnostic">
            <CTAButton data-testid="button-hero-cta">
              Show Me My Revenue Leak
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </CTAButton>
          </Link>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <h2 
            className="text-3xl sm:text-4xl font-thin text-center mb-16 tracking-tight"
            data-testid="text-social-proof-heading"
          >
            Proven Results Across Industries
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {caseStudies.map((study, index) => (
              <div
                key={index}
                className="border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-colors"
                style={{
                  background: 'linear-gradient(135deg, rgba(0, 201, 123, 0.05) 0%, rgba(0, 0, 0, 0) 100%)'
                }}
                data-testid={`card-case-study-${index}`}
              >
                <div className="space-y-6">
                  {/* Company Info */}
                  <div>
                    <h3 className="text-2xl font-light mb-1">{study.company}</h3>
                    <p className="text-sm text-white/50">{study.industry}</p>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div 
                        className="text-4xl font-light"
                        style={{ color: BOTTLNEKK_GREEN }}
                      >
                        {study.metric1}
                      </div>
                      <p className="text-sm text-white/60">{study.metric1Label}</p>
                    </div>
                    <div className="space-y-1">
                      <div 
                        className="text-4xl font-light"
                        style={{ color: BOTTLNEKK_GREEN }}
                      >
                        {study.metric2}
                      </div>
                      <p className="text-sm text-white/60">{study.metric2Label}</p>
                    </div>
                  </div>

                  {/* Revenue (if exists) */}
                  {study.revenue && (
                    <div className="pt-2">
                      <p className="text-lg font-light" style={{ color: BOTTLNEKK_GREEN }}>
                        {study.revenue}
                      </p>
                    </div>
                  )}

                  {/* Quote */}
                  <blockquote className="text-sm text-white/70 italic border-l-2 pl-4 leading-relaxed" style={{ borderColor: BOTTLNEKK_GREEN }}>
                    "{study.quote}"
                  </blockquote>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <h2 
            className="text-3xl sm:text-4xl font-thin text-center mb-16 tracking-tight"
            data-testid="text-how-it-works-heading"
          >
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="text-center space-y-4" data-testid="step-connect">
              <div 
                className="w-16 h-16 rounded-full border-2 flex items-center justify-center mx-auto"
                style={{ borderColor: BOTTLNEKK_GREEN }}
              >
                <Phone className="w-8 h-8" style={{ color: BOTTLNEKK_GREEN }} />
              </div>
              <h3 className="text-xl font-light">1. Connect</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Link your phone system (RingCentral, Zoom, or others) in seconds
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center space-y-4" data-testid="step-analyze">
              <div 
                className="w-16 h-16 rounded-full border-2 flex items-center justify-center mx-auto"
                style={{ borderColor: BOTTLNEKK_GREEN }}
              >
                <TrendingUp className="w-8 h-8" style={{ color: BOTTLNEKK_GREEN }} />
              </div>
              <h3 className="text-xl font-light">2. Analyze</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Our AI scans your last 30 days of call data to find revenue leaks
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center space-y-4" data-testid="step-fix">
              <div 
                className="w-16 h-16 rounded-full border-2 flex items-center justify-center mx-auto"
                style={{ borderColor: BOTTLNEKK_GREEN }}
              >
                <Users className="w-8 h-8" style={{ color: BOTTLNEKK_GREEN }} />
              </div>
              <h3 className="text-xl font-light">3. Fix</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Get a custom plan to recover lost revenue and never miss calls again
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 border-t border-white/10">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 
            className="text-3xl sm:text-4xl lg:text-5xl font-thin tracking-tight"
            data-testid="text-final-cta-heading"
          >
            Ready to Stop the Leak?
          </h2>
          
          <p className="text-lg text-white/70 font-light">
            Join hundreds of businesses recovering thousands in lost revenue
          </p>

          <Link href="/diagnostic">
            <CTAButton data-testid="button-final-cta">
              Run Your Free Diagnostic Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </CTAButton>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/40">
          <p>© 2025 Bottlnekk. All rights reserved.</p>
          <p className="font-light">
            Powered by{" "}
            <a 
              href="https://hexona.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-white/60 transition-colors"
              data-testid="link-hexona"
            >
              Hexona
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
