import { Navigation } from "@/components/Navigation";
import { Link } from "wouter";

const BOTTLNEKK_GREEN = "#00C97B";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black dark:bg-black">
      <Navigation />

      <div className="px-8 sm:px-12 lg:px-16 pt-32 pb-24">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-20">
            <h1 
              className="font-thin text-white mb-6"
              style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', letterSpacing: '0.02em', fontWeight: '200' }}
              data-testid="heading-about-page"
            >
              Built from the Ground Up
            </h1>
            <p 
              className="font-extralight text-[#9CA3AF] max-w-3xl mx-auto"
              style={{ fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)', letterSpacing: '0.03em' }}
              data-testid="text-about-subtitle"
            >
              No boardroom theory. Just real solutions from founders who've lived the pain of revenue leaks firsthand.
            </p>
          </div>

          {/* Team Bios */}
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 mb-20">
            {/* Keith Booker */}
            <div className="space-y-6" data-testid="bio-keith">
              <div className="space-y-2">
                <h2 
                  className="font-light text-white"
                  style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', letterSpacing: '0.02em' }}
                  data-testid="name-keith"
                >
                  Keith Booker
                </h2>
                <p 
                  className="font-extralight uppercase tracking-widest"
                  style={{ color: BOTTLNEKK_GREEN, fontSize: '0.875rem' }}
                  data-testid="title-keith"
                >
                  Founder & CEO
                </p>
              </div>
              <div 
                className="font-extralight text-[#9CA3AF] leading-relaxed space-y-4"
                style={{ fontSize: 'clamp(1rem, 2vw, 1.125rem)', letterSpacing: '0.02em' }}
                data-testid="text-keith-bio"
              >
                <p>I'm Keith Booker, founder of Bottlnekk, a company built from the ground up, not a boardroom.</p>
                <p>Before Bottlnekk, I built multiple businesses from scratch. Some worked. Some didn't. But every failure taught me how companies really break, not from bad ideas but from hidden leaks no one measures.</p>
                <p>That experience shaped everything I do.</p>
                <p>Today, Bottlnekk helps businesses find those leaks, recover lost revenue, and build systems that actually scale.</p>
                <p>I'm not a developer by trade or a tech bro with funding. I'm a builder who learned to turn pain into process.</p>
                <p>And that's exactly what Bottlnekk was born to do — rebuild the way businesses run.</p>
              </div>
            </div>

            {/* Hamza Baig */}
            <div className="space-y-6" data-testid="bio-hamza">
              <div className="space-y-2">
                <h2 
                  className="font-light text-white"
                  style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', letterSpacing: '0.02em' }}
                  data-testid="name-hamza"
                >
                  Hamza Baig
                </h2>
                <p 
                  className="font-extralight uppercase tracking-widest"
                  style={{ color: BOTTLNEKK_GREEN, fontSize: '0.875rem' }}
                  data-testid="title-hamza"
                >
                  Chief Technology Officer
                </p>
              </div>
              <div 
                className="font-extralight text-[#9CA3AF] leading-relaxed space-y-4"
                style={{ fontSize: 'clamp(1rem, 2vw, 1.125rem)', letterSpacing: '0.02em' }}
                data-testid="text-hamza-bio"
              >
                <p>I'm Hamza Baig, and I build systems that don't break.</p>
                <p>I don't write code for the sake of it. I engineer solutions that scale, automate, and eliminate friction so businesses can focus on what actually moves the needle.</p>
                <p>At Bottlnekk, I designed every integration, every API, and every automation with one goal: make recovering lost revenue as simple as clicking a button.</p>
                <p>Before this, I built tools for industries that couldn't afford downtime — finance, healthcare, logistics. Places where one broken pipeline costs millions.</p>
                <p>That mindset is baked into everything we ship. Clean code. Smart architecture. Zero bloat.</p>
                <p>Bottlnekk isn't just software. It's infrastructure for businesses ready to stop bleeding money.</p>
              </div>
            </div>
          </div>

          {/* Client Results Section */}
          <div className="mt-24 pt-16 border-t" style={{ borderColor: '#1F2937' }}>
            <h2 
              className="text-center font-thin text-white mb-16"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', letterSpacing: '0.02em', fontWeight: '200' }}
              data-testid="heading-results"
            >
              Real Results
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Tire Boss Case Study */}
              <div 
                className="p-8 rounded-2xl border space-y-6"
                style={{ borderColor: '#1F2937', backgroundColor: '#0A0A0A' }}
                data-testid="case-study-tire-boss"
              >
                <div>
                  <h3 className="font-light text-white text-xl mb-2">Tire Boss</h3>
                  <p className="font-extralight text-[#6B7280] text-sm">High-Volume Tire Shop</p>
                </div>
                <p 
                  className="font-extralight text-[#D1D5DB] leading-relaxed italic"
                  style={{ fontSize: '1rem' }}
                >
                  "The automated callback system has been a game-changer for us. Not only have we seen a significant increase in sales, but our customers also appreciate the quick response times. It's like having an extra team member that can handle everything!"
                </p>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t" style={{ borderColor: '#1F2937' }}>
                  <div>
                    <p className="font-light text-2xl" style={{ color: BOTTLNEKK_GREEN }}>+30%</p>
                    <p className="font-extralight text-[#6B7280] text-xs">Sales Increase</p>
                  </div>
                  <div>
                    <p className="font-light text-2xl" style={{ color: BOTTLNEKK_GREEN }}>97%</p>
                    <p className="font-extralight text-[#6B7280] text-xs">Faster Response</p>
                  </div>
                </div>
              </div>

              {/* Daycare AI Agent Case Study */}
              <div 
                className="p-8 rounded-2xl border space-y-6"
                style={{ borderColor: '#1F2937', backgroundColor: '#0A0A0A' }}
                data-testid="case-study-daycare"
              >
                <div>
                  <h3 className="font-light text-white text-xl mb-2">Daycare Center</h3>
                  <p className="font-extralight text-[#6B7280] text-sm">Lead Management & Booking Automation</p>
                </div>
                <p 
                  className="font-extralight text-[#D1D5DB] leading-relaxed"
                  style={{ fontSize: '1rem' }}
                >
                  AI appointment agent "Zara" streamlined lead management, securing more bookings with instant engagement and automated scheduling.
                </p>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t" style={{ borderColor: '#1F2937' }}>
                  <div>
                    <p className="font-light text-2xl" style={{ color: BOTTLNEKK_GREEN }}>+25%</p>
                    <p className="font-extralight text-[#6B7280] text-xs">Tour Schedules</p>
                  </div>
                  <div>
                    <p className="font-light text-2xl" style={{ color: BOTTLNEKK_GREEN }}>2X</p>
                    <p className="font-extralight text-[#6B7280] text-xs">ROAS</p>
                  </div>
                  <div>
                    <p className="font-light text-2xl" style={{ color: BOTTLNEKK_GREEN }}>81%</p>
                    <p className="font-extralight text-[#6B7280] text-xs">Faster Contact</p>
                  </div>
                  <div>
                    <p className="font-light text-2xl" style={{ color: BOTTLNEKK_GREEN }}>+15%</p>
                    <p className="font-extralight text-[#6B7280] text-xs">Registrations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Back to Diagnostic */}
          <div className="text-center pt-16">
            <Link href="/">
              <button
                className="inline-flex items-center justify-center px-12 py-5 font-bold text-white border-2 rounded-xl transition-all duration-300"
                style={{ 
                  fontSize: 'clamp(1.125rem, 2.5vw, 1.375rem)',
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
                data-testid="button-back-to-diagnostic"
              >
                Find Your Revenue Leak →
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
