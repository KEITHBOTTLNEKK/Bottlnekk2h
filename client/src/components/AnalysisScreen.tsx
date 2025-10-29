import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { PhoneProvider, DiagnosticResult, AnalyzeDiagnosticRequest } from "@shared/schema";
import { Branding } from "./Branding";

const BOTTLNEKK_GREEN = "#00C97B";

interface AnalysisScreenProps {
  provider: PhoneProvider;
  onAnalysisComplete: (result: DiagnosticResult) => void;
  onRestart?: () => void;
}

export function AnalysisScreen({ provider, onAnalysisComplete, onRestart }: AnalysisScreenProps) {
  const [dots, setDots] = useState("");
  const [dealSize, setDealSize] = useState("");
  const [showConnected, setShowConnected] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);

  const analyzeMutation = useMutation({
    mutationFn: async (data: AnalyzeDiagnosticRequest & { avgDealSize?: number }) => {
      const startTime = Date.now();
      const response = await apiRequest("POST", "/api/diagnostic/analyze", data);
      const result = await response.json() as DiagnosticResult;
      
      // Ensure minimum 3 seconds of analysis time
      const elapsed = Date.now() - startTime;
      if (elapsed < 3000) {
        await new Promise(resolve => setTimeout(resolve, 3000 - elapsed));
      }
      
      return result;
    },
    onSuccess: (data) => {
      setTimeout(() => {
        onAnalysisComplete(data);
      }, 500);
    },
  });

  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 400);

    // Check if this is an OAuth callback
    const params = new URLSearchParams(window.location.search);
    const isOAuthCallback = params.get("connected") === "ringcentral" || params.get("connected") === "zoom";

    if (isOAuthCallback) {
      // Show "Connected" moment first
      setShowConnected(true);
      
      // After 1.5 seconds, transition to question
      setTimeout(() => {
        setShowConnected(false);
        setShowQuestion(true);
      }, 1500);
    } else {
      // Direct navigation, show question immediately
      setShowQuestion(true);
    }

    return () => clearInterval(dotInterval);
  }, []);

  const handleLooksGood = () => {
    const avgDealSize = parseInt(dealSize) || 1000;
    setShowQuestion(false); // Hide question to prevent flash
    analyzeMutation.mutate({ provider, avgDealSize });
  };

  const handleDealSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setDealSize(value);
  };

  const handleRetry = () => {
    analyzeMutation.reset();
    analyzeMutation.mutate({ provider });
  };

  if (analyzeMutation.isError) {
    return (
      <div className="min-h-screen bg-black dark:bg-black flex items-center justify-center px-4">
        <Branding onRestart={onRestart} accentColor={BOTTLNEKK_GREEN} />
        <div className="text-center space-y-8 max-w-2xl">
          <div className="space-y-4">
            <h1 
              className="text-4xl sm:text-5xl lg:text-6xl font-thin text-white tracking-tight"
              data-testid="text-error-heading"
            >
              Connection Failed
            </h1>
            <p 
              className="text-lg font-extralight text-[#9CA3AF] tracking-wide"
              data-testid="text-error-message"
            >
              We couldn't connect to {provider}. Please try again.
            </p>
          </div>

          <button
            onClick={handleRetry}
            className="group relative inline-flex items-center justify-center px-10 py-4 text-base font-light text-black bg-white rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-white/20"
            data-testid="button-retry"
          >
            <span className="relative z-10 tracking-wide">Try Again</span>
            <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>

          <p className="text-sm font-light text-[#6B7280] tracking-wide pt-4">
            {analyzeMutation.error instanceof Error 
              ? analyzeMutation.error.message 
              : "An unexpected error occurred"}
          </p>
        </div>
      </div>
    );
  }

  const isOAuthCallback = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("connected") === "ringcentral" || params.get("connected") === "zoom";
  };

  const getStatusText = () => {
    if (analyzeMutation.isSuccess) {
      return "Processing complete...";
    }
    if (analyzeMutation.isPending) {
      return "Crunching the numbers...";
    }
    if (isOAuthCallback()) {
      return `Connected to ${provider}. Analyzing your data...`;
    }
    return "Analyzing your data...";
  };

  return (
    <div className="min-h-screen bg-black dark:bg-black flex items-center justify-center px-4">
      <Branding onRestart={onRestart} accentColor={BOTTLNEKK_GREEN} />
      <div className="text-center space-y-8">
        {showConnected ? (
          // Success moment after OAuth
          <div className="animate-in fade-in zoom-in duration-500 space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full border-2 flex items-center justify-center" style={{ borderColor: BOTTLNEKK_GREEN }}>
              <svg className="w-10 h-10 animate-in zoom-in duration-300" style={{ color: BOTTLNEKK_GREEN }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl sm:text-4xl font-thin text-white tracking-tight">
              Connected
            </h1>
          </div>
        ) : showQuestion ? (
          // Phase 1: Ask the question (Steve Jobs verbiage)
          <div className="animate-in fade-in duration-700 space-y-8" data-testid="panel-deal-size">
            <p className="font-bold text-[#9CA3AF] tracking-wide mb-4" style={{ fontSize: '1.75rem' }}>
              One more thing...
            </p>
            <h1 
              className="font-bold text-white tracking-tight"
              style={{ fontSize: '4.5rem' }}
              data-testid="text-question"
            >
              What's a customer worth to you?
            </h1>

            <div className="flex items-center justify-center space-x-2">
              <span className="font-light text-white/60" style={{ fontSize: '3rem' }}>$</span>
              <input
                type="text"
                value={dealSize}
                onChange={handleDealSizeChange}
                className="w-48 px-4 py-3 bg-transparent border-b-2 border-white/30 font-light text-white text-center focus:outline-none transition-colors duration-300 placeholder:font-normal placeholder:text-white/30"
                style={{ fontSize: '3rem' }}
                placeholder="1000"
                data-testid="input-deal-size"
                autoFocus
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = BOTTLNEKK_GREEN;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                }}
              />
            </div>

            <button
              onClick={handleLooksGood}
              disabled={!dealSize}
              className="inline-flex items-center justify-center px-16 py-5 font-bold text-white border-2 rounded-xl transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-white"
              style={{ 
                fontSize: '1.125rem',
                borderColor: BOTTLNEKK_GREEN,
              }}
              onMouseEnter={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.backgroundColor = BOTTLNEKK_GREEN;
                  e.currentTarget.style.color = '#000000';
                }
              }}
              onMouseLeave={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#FFFFFF';
                }
              }}
              data-testid="button-looks-good"
            >
              Show Me How Many I'm Losing
            </button>
          </div>
        ) : analyzeMutation.isPending ? (
          // Phase 2: Actually analyzing with their number
          <>
            <h1 
              className="font-light text-white tracking-tight"
              style={{ fontSize: '1.5rem' }}
              data-testid="text-analyzing"
            >
              Analyzing Call Data{dots}
            </h1>
          </>
        ) : null}
      </div>
    </div>
  );
}
