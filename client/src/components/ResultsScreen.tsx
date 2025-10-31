import { useState, useCallback } from "react";
import { useCounter } from "@/hooks/useCounter";
import type { DiagnosticResult } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingSchema, type BookingRequest } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Branding } from "./Branding";

const BOTTLNEKK_GREEN = "#00C97B";

interface ResultsScreenProps {
  result: DiagnosticResult;
  onRestart: () => void;
}

export function ResultsScreen({ result, onRestart }: ResultsScreenProps) {
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showOffer, setShowOffer] = useState(false);
  const [countComplete, setCountComplete] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const { toast } = useToast();

  const handleCountComplete = useCallback(() => {
    setCountComplete(true);
  }, []);

  const animatedTotal = useCounter({ 
    end: result.totalLoss, 
    duration: 3500,
    start: 0,
    onComplete: handleCountComplete
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleShowOffer = () => {
    setShowOffer(true);
    // Smooth scroll to offer section
    setTimeout(() => {
      const offerSection = document.getElementById('offer-section');
      if (offerSection) {
        offerSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleBookCall = () => {
    setShowBookingForm(true);
  };

  const form = useForm<BookingRequest>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      diagnosticData: result,
    },
  });

  const bookingMutation = useMutation({
    mutationFn: async (data: BookingRequest) => {
      return apiRequest("POST", "/api/bookings", data);
    },
    onSuccess: () => {
      setBookingSuccess(true);
      toast({
        title: "Call scheduled!",
        description: "We'll be in touch soon to help you fix this revenue leak.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Something went wrong",
        description: error.message || "Please try again or contact us directly.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BookingRequest) => {
    bookingMutation.mutate(data);
  };

  if (bookingSuccess) {
    return (
      <div className="min-h-screen bg-black dark:bg-black flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl w-full text-center space-y-12 animate-in fade-in duration-1000">
          <div className="space-y-6">
            <div className="text-8xl">✓</div>
            <h2 
              className="font-bold text-white tracking-tight"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
              data-testid="heading-success"
            >
              We'll be in touch
            </h2>
            <p className="font-light text-white/60 tracking-wide" style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)' }}>
              Our team will contact you shortly to help you reclaim {formatCurrency(result.totalLoss)} every month
            </p>
          </div>

          <div className="text-center pt-8">
            <button
              onClick={onRestart}
              className="inline-flex items-center justify-center px-12 py-6 font-bold text-white border-2 rounded-xl transition-all duration-300"
              style={{ 
                fontSize: '1.25rem',
                borderColor: BOTTLNEKK_GREEN,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = BOTTLNEKK_GREEN;
                e.currentTarget.style.color = '#000000';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#FFFFFF';
              }}
              data-testid="button-restart"
            >
              Run Another Analysis
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showBookingForm) {
    return (
      <div className="min-h-screen bg-black dark:bg-black flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-5xl w-full space-y-6">
          <div className="text-center space-y-4">
            <h2 
              className="font-bold text-white tracking-tight"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
              data-testid="heading-book-call"
            >
              Let's fix this
            </h2>
          </div>

          <div className="w-full bg-white rounded-lg overflow-hidden" style={{ height: 'calc(100vh - 200px)', minHeight: '600px' }}>
            <iframe 
              src={`https://api.leadconnectorhq.com/widget/bookings/fix-your-phone-leak${result.diagnosticId ? `?diagnosticId=${result.diagnosticId}` : ''}`}
              className="w-full h-full border-0"
              id="ghl-booking-widget"
              data-testid="booking-calendar"
              title="Schedule Appointment"
            />
          </div>

          <div className="text-center pt-4">
            <button
              onClick={() => setShowBookingForm(false)}
              className="font-light text-white/40 hover:text-white tracking-wide transition-colors duration-300"
              style={{ fontSize: '0.875rem' }}
              data-testid="button-cancel"
            >
              ← Back to results
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black dark:bg-black flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <Branding onRestart={onRestart} accentColor={BOTTLNEKK_GREEN} />
      <div className="w-full max-w-6xl space-y-16">

        {/* The Number - MASSIVE and Centered */}
        <div className="text-center space-y-10 px-2">
          <h1 
            className="font-bold tracking-tighter leading-none break-all"
            data-testid="text-total-loss"
            style={{ 
              fontSize: 'clamp(6rem, 15vw, 16rem)', 
              lineHeight: '0.85', 
              wordBreak: 'keep-all',
              color: BOTTLNEKK_GREEN,
            }}
          >
            {formatCurrency(animatedTotal)}
          </h1>
          {countComplete && (
            <>
              <p 
                className="font-light text-white/60 tracking-wide animate-in fade-in slide-in-from-bottom-2 duration-700"
                style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)' }}
                data-testid="text-loss-description"
              >
                In unanswered calls
              </p>
              
              {/* Call Breakdown - Emotional Impact */}
              <div 
                className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-12 pt-6 animate-in fade-in slide-in-from-bottom-3 duration-1000"
                style={{ animationDelay: '300ms' }}
              >
                <div className="text-center">
                  <p 
                    className="font-bold text-white tracking-tight"
                    style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
                    data-testid="text-missed-calls-count"
                  >
                    {result.missedCalls}
                  </p>
                  <p 
                    className="font-light text-white/40 tracking-wide"
                    style={{ fontSize: 'clamp(0.875rem, 1.5vw, 1.125rem)' }}
                    data-testid="text-missed-calls-label"
                  >
                    missed calls
                  </p>
                </div>
                
                <div className="hidden sm:block text-white/20" style={{ fontSize: '2rem' }}>•</div>
                
                <div className="text-center">
                  <p 
                    className="font-bold text-white tracking-tight"
                    style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
                    data-testid="text-afterhours-calls-count"
                  >
                    {result.afterHoursCalls}
                  </p>
                  <p 
                    className="font-light text-white/40 tracking-wide"
                    style={{ fontSize: 'clamp(0.875rem, 1.5vw, 1.125rem)' }}
                    data-testid="text-afterhours-calls-label"
                  >
                    after-hours calls
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Button fades in AFTER the count */}
        {countComplete && !showOffer && (
          <div className="text-center pt-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <button
              onClick={handleShowOffer}
              className="inline-flex items-center justify-center px-16 py-8 font-bold text-white border-2 rounded-xl transition-all duration-300"
              style={{ 
                fontSize: '1.75rem',
                borderColor: BOTTLNEKK_GREEN,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = BOTTLNEKK_GREEN;
                e.currentTarget.style.color = '#000000';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#FFFFFF';
              }}
              data-testid="button-see-solution"
            >
              See The Solution →
            </button>
          </div>
        )}

        {/* The Offer Section - Scrolls into view */}
        {showOffer && (
          <div 
            id="offer-section"
            className="w-full max-w-4xl mx-auto mt-24 px-4 sm:px-8 animate-in fade-in slide-in-from-bottom-4 duration-1000"
          >
            {/* Header */}
            <div className="text-center space-y-6 mb-16">
              <h2 
                className="font-bold text-white tracking-tight leading-tight"
                style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
                data-testid="heading-offer"
              >
                THE PHONE LEAK ELIMINATION SYSTEM
              </h2>
              <p 
                className="font-light text-white/80 tracking-wide leading-relaxed max-w-3xl mx-auto"
                style={{ fontSize: 'clamp(1.125rem, 2vw, 1.5rem)' }}
                data-testid="text-offer-subtitle"
              >
                In 7 days, we turn your phone system into a 24/7 job-booking machine — 
                one that captures every missed call and turns silence into sales.
              </p>
            </div>

            {/* Your Numbers Section */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 sm:p-12 mb-8">
              <h3 
                className="font-bold tracking-tight mb-6"
                style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: BOTTLNEKK_GREEN }}
                data-testid="heading-your-numbers"
              >
                💰 YOUR NUMBERS
              </h3>
              <div className="space-y-4 text-white/90">
                <p className="font-light leading-relaxed" style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)' }}>
                  You're losing about <span className="font-bold text-white">{formatCurrency(result.totalLoss)}</span> a month — 
                  over <span className="font-bold text-white">${Math.round(result.totalLoss / 30)}</span> a day disappearing 
                  every time the phone rings and no one answers.
                </p>
                <p className="font-light leading-relaxed" style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)' }}>
                  We stop that bleed and turn it into booked jobs on autopilot.
                </p>
                <div className="pt-6 border-t border-white/20 mt-6">
                  <p className="font-bold text-white mb-3" style={{ fontSize: 'clamp(1.125rem, 2vw, 1.375rem)' }}>
                    The Math:
                  </p>
                  <ul className="space-y-2 font-light" style={{ fontSize: 'clamp(1rem, 2vw, 1.125rem)' }}>
                    <li>Your investment: <span className="font-bold text-white">$5,000</span></li>
                    <li>You recover: <span className="font-bold text-white">${formatCurrency(Math.round(result.totalLoss * 12 * 0.40)).replace('$', '')}–${formatCurrency(Math.round(result.totalLoss * 12 * 0.50)).replace('$', '')}+ a year</span></li>
                    <li>ROI: <span className="font-bold" style={{ color: BOTTLNEKK_GREEN }}>{Math.round((result.totalLoss * 12 * 0.40) / 5000)}x return</span> — every single year the system runs</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* What's Included */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 sm:p-12 mb-8">
              <h3 
                className="font-bold tracking-tight mb-6"
                style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: BOTTLNEKK_GREEN }}
                data-testid="heading-whats-included"
              >
                ⚙️ WHAT'S INCLUDED
              </h3>
              <div className="space-y-6 text-white/90 font-light" style={{ fontSize: 'clamp(1rem, 2vw, 1.125rem)' }}>
                <div className="flex gap-4">
                  <span className="text-white flex-shrink-0">✓</span>
                  <div>
                    <span className="font-bold text-white">Leak Scan & Fix System</span> – Find every leak and rebuild your call flows the right way
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="text-white flex-shrink-0">✓</span>
                  <div>
                    <span className="font-bold text-white">AI Receptionist</span> – Answers, books, and confirms jobs 24/7
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="text-white flex-shrink-0">✓</span>
                  <div>
                    <span className="font-bold text-white">Recovery Dashboard</span> – See live revenue you're getting back
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="text-white flex-shrink-0">✓</span>
                  <div>
                    <span className="font-bold text-white">Ongoing Optimization</span> – Continuous tuning so performance never drops
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-white/20">
                <p className="text-white/60 font-light italic" style={{ fontSize: 'clamp(0.875rem, 1.5vw, 1rem)' }}>
                  Investment: $5,000 one-time setup | Monthly maintenance starts after 60 days ($500–$1,500 based on call volume)
                </p>
              </div>
            </div>

            {/* The Guarantee */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 sm:p-12 mb-8">
              <h3 
                className="font-bold tracking-tight mb-6"
                style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: BOTTLNEKK_GREEN }}
                data-testid="heading-guarantee"
              >
                🧠 THE GUARANTEE
              </h3>
              <p className="text-white font-bold leading-relaxed mb-4" style={{ fontSize: 'clamp(1.125rem, 2vw, 1.5rem)' }}>
                "If you don't recover at least $10K in 60 days,
                you don't pay another dime until you do."
              </p>
              <p className="text-white/90 font-light" style={{ fontSize: 'clamp(1rem, 2vw, 1.125rem)' }}>
                No risk. No fluff. Just recovered money.
              </p>
            </div>

            {/* The Outcome */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 sm:p-12 mb-12">
              <h3 
                className="font-bold tracking-tight mb-6"
                style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: BOTTLNEKK_GREEN }}
                data-testid="heading-outcome"
              >
                🚀 THE OUTCOME
              </h3>
              <div className="space-y-4 text-white/90 font-light mb-6" style={{ fontSize: 'clamp(1rem, 2vw, 1.125rem)' }}>
                <div className="flex gap-4">
                  <span className="text-white flex-shrink-0">✅</span>
                  <span>No more missed calls</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-white flex-shrink-0">✅</span>
                  <span>Jobs booked automatically</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-white flex-shrink-0">✅</span>
                  <span>Proof of every dollar recovered</span>
                </div>
              </div>
              <p className="text-white font-light leading-relaxed" style={{ fontSize: 'clamp(1.125rem, 2vw, 1.375rem)' }}>
                Your phone stops being an expense — and becomes your most profitable employee.
              </p>
            </div>

            {/* CTA Button */}
            <div className="text-center pb-16">
              <button
                onClick={handleBookCall}
                className="inline-flex items-center justify-center px-16 py-8 font-bold text-white border-2 rounded-xl transition-all duration-300"
                style={{ 
                  fontSize: '1.75rem',
                  borderColor: BOTTLNEKK_GREEN,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = BOTTLNEKK_GREEN;
                  e.currentTarget.style.color = '#000000';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
                data-testid="button-fix-system"
              >
                Fix My System →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
