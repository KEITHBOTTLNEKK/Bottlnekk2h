import { useState } from "react";
import { Branding } from "./Branding";

const BOTTLNEKK_GREEN = "#00C97B";

interface ManualInputScreenProps {
  onSubmit: (missedCalls: number, avgDealSize: number) => void;
  onRestart?: () => void;
}

export function ManualInputScreen({ onSubmit, onRestart }: ManualInputScreenProps) {
  const [missedCalls, setMissedCalls] = useState("");
  const [avgDealSize, setAvgDealSize] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const calls = parseInt(missedCalls);
    const dealSize = parseInt(avgDealSize);

    if (isNaN(calls) || calls < 0) {
      setError("Please enter a valid number of missed calls");
      return;
    }

    if (isNaN(dealSize) || dealSize < 0) {
      setError("Please enter a valid average deal size");
      return;
    }

    setError("");
    onSubmit(calls, dealSize);
  };

  return (
    <div className="min-h-screen bg-black dark:bg-black flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <Branding onRestart={onRestart} accentColor={BOTTLNEKK_GREEN} />
      
      <div className="max-w-2xl w-full space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 
            className="font-bold text-white tracking-tight leading-tight"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
            data-testid="heading-manual-input"
          >
            Tell us about your business
          </h1>
          <p 
            className="font-light text-[#9CA3AF] tracking-wide max-w-xl mx-auto"
            style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)' }}
            data-testid="text-manual-subheading"
          >
            We'll calculate an estimate of your revenue leak
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div 
            className="mx-auto max-w-xl px-6 py-4 border border-red-500/30 bg-red-500/10 rounded-lg"
            data-testid="error-message"
          >
            <p className="text-sm font-light text-red-200 tracking-wide text-center">
              {error}
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Missed Calls Input */}
          <div className="space-y-3">
            <label 
              htmlFor="missed-calls" 
              className="block text-white font-light tracking-wide"
              style={{ fontSize: '1.125rem' }}
            >
              How many calls do you miss per month?
            </label>
            <input
              id="missed-calls"
              type="number"
              min="0"
              value={missedCalls}
              onChange={(e) => setMissedCalls(e.target.value)}
              className="w-full px-6 py-4 bg-black border-2 border-white/20 rounded-xl text-white font-light tracking-wide focus:outline-none focus:border-white/40 transition-colors"
              style={{ fontSize: '1.125rem' }}
              placeholder="e.g., 120"
              data-testid="input-missed-calls"
            />
          </div>

          {/* Average Deal Size Input */}
          <div className="space-y-3">
            <label 
              htmlFor="avg-deal-size" 
              className="block text-white font-light tracking-wide"
              style={{ fontSize: '1.125rem' }}
            >
              What's your average job value?
            </label>
            <div className="relative">
              <span 
                className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40 font-light"
                style={{ fontSize: '1.125rem' }}
              >
                $
              </span>
              <input
                id="avg-deal-size"
                type="number"
                min="0"
                value={avgDealSize}
                onChange={(e) => setAvgDealSize(e.target.value)}
                className="w-full pl-10 pr-6 py-4 bg-black border-2 border-white/20 rounded-xl text-white font-light tracking-wide focus:outline-none focus:border-white/40 transition-colors"
                style={{ fontSize: '1.125rem' }}
                placeholder="e.g., 350"
                data-testid="input-avg-deal-size"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-8">
            <button
              type="submit"
              className="w-full px-8 py-5 font-bold text-white border-2 rounded-xl transition-all duration-300"
              style={{ 
                fontSize: '1.25rem',
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
              data-testid="button-submit-manual"
            >
              Calculate My Revenue Leak
            </button>
          </div>
        </form>

        {/* Info Note */}
        <div className="text-center">
          <p className="text-sm font-light text-white/40 tracking-wide">
            This is an estimate based on industry averages
          </p>
        </div>
      </div>
    </div>
  );
}
