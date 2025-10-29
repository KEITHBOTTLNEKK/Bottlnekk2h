import { useState, useCallback } from "react";
import { useCounter } from "@/hooks/useCounter";
import type { DiagnosticResult } from "@shared/schema";

interface ResultsScreenProps {
  result: DiagnosticResult;
  onRestart: () => void;
}

export function ResultsScreen({ result, onRestart }: ResultsScreenProps) {
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [countComplete, setCountComplete] = useState(false);

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

  const handleBookCall = () => {
    setShowBookingForm(true);
  };

  if (showBookingForm) {
    return (
      <div className="min-h-screen bg-black dark:bg-black flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl w-full space-y-12">
          <div className="text-center space-y-4">
            <h2 
              className="font-bold text-white tracking-tight"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
              data-testid="heading-book-call"
            >
              Let's fix this
            </h2>
            <p className="font-light text-white/60 tracking-wide" style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)' }}>
              Stop losing {formatCurrency(result.totalLoss)} every month
            </p>
          </div>

          <div className="w-full">
            <iframe 
              src="https://api.leadconnectorhq.com/widget/bookings/fix-your-phone-leak"
              className="w-full border-0"
              style={{ height: '800px', minHeight: '800px' }}
              id="ghl-booking-widget"
              data-testid="booking-calendar"
              title="Schedule Appointment"
            />
          </div>

          <div className="text-center pt-8">
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
      <div className="w-full max-w-6xl space-y-16">

        {/* The Number - MASSIVE and Centered */}
        <div className="text-center space-y-10 px-2">
          <h1 
            className="font-bold text-white tracking-tighter leading-none break-all"
            data-testid="text-total-loss"
            style={{ fontSize: 'clamp(6rem, 15vw, 16rem)', lineHeight: '0.85', wordBreak: 'keep-all' }}
          >
            {formatCurrency(animatedTotal)}
          </h1>
          {countComplete && (
            <p 
              className="font-light text-white/60 tracking-wide animate-in fade-in slide-in-from-bottom-2 duration-700"
              style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)' }}
              data-testid="text-loss-description"
            >
              In unanswered calls
            </p>
          )}
        </div>

        {/* Button fades in AFTER the count */}
        {countComplete && (
          <div className="text-center pt-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <button
              onClick={handleBookCall}
              className="inline-flex items-center justify-center px-16 py-8 font-bold text-white border-2 border-white rounded-xl transition-all duration-300 hover:bg-white hover:text-black"
              style={{ fontSize: '1.75rem' }}
              data-testid="button-reclaim"
            >
              Fix This
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
