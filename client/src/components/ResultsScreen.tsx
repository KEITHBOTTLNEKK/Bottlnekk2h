import { useCounter } from "@/hooks/useCounter";
import type { DiagnosticResult } from "@shared/schema";

interface ResultsScreenProps {
  result: DiagnosticResult;
  onRestart: () => void;
}

export function ResultsScreen({ result, onRestart }: ResultsScreenProps) {
  const animatedTotal = useCounter({ 
    end: result.totalLoss, 
    duration: 2500,
    start: 0
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-5xl w-full space-y-16">
        {/* Main Loss Number */}
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 
              className="text-7xl sm:text-8xl lg:text-9xl font-thin text-white tracking-tighter leading-none"
              data-testid="text-total-loss"
            >
              {formatCurrency(animatedTotal)}
            </h1>
            <p 
              className="text-xl sm:text-2xl font-extralight text-[#9CA3AF] tracking-wide"
              data-testid="text-loss-description"
            >
              lost this month from {formatNumber(result.totalMissedOpportunities)} missed opportunities.
            </p>
          </div>
        </div>

        {/* Breakdown Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="space-y-3" data-testid="metric-missed-calls">
            <div className="text-sm font-light text-[#6B7280] tracking-widest uppercase">
              Missed Calls
            </div>
            <div className="text-5xl font-thin text-white tracking-tight">
              {formatNumber(result.missedCalls)}
            </div>
          </div>

          <div className="space-y-3" data-testid="metric-after-hours">
            <div className="text-sm font-light text-[#6B7280] tracking-widest uppercase">
              After-Hours Calls
            </div>
            <div className="text-5xl font-thin text-white tracking-tight">
              {formatNumber(result.afterHoursCalls)}
            </div>
          </div>

          <div className="space-y-3" data-testid="metric-abandoned">
            <div className="text-sm font-light text-[#6B7280] tracking-widest uppercase">
              Abandoned Calls
            </div>
            <div className="text-5xl font-thin text-white tracking-tight">
              {formatNumber(result.abandonedCalls)}
            </div>
          </div>

          <div className="space-y-3" data-testid="metric-avg-revenue">
            <div className="text-sm font-light text-[#6B7280] tracking-widest uppercase">
              Avg Revenue Per Call
            </div>
            <div className="text-5xl font-thin text-white tracking-tight">
              {formatCurrency(result.avgRevenuePerCall)}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-8">
          <button
            onClick={onRestart}
            className="group relative inline-flex items-center justify-center px-12 py-5 text-lg font-light text-black bg-white rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-white/20"
            data-testid="button-reclaim"
          >
            <span className="relative z-10 tracking-wide">Reclaim Your Revenue</span>
            <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </div>

        {/* Source Attribution */}
        <div className="text-center pt-8">
          <p className="text-xs font-light text-[#6B7280] tracking-wide">
            Data analyzed from {result.provider} • {result.month}
          </p>
        </div>
      </div>
    </div>
  );
}
