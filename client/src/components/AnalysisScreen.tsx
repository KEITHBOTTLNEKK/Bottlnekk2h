import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { PhoneProvider, DiagnosticResult, AnalyzeDiagnosticRequest } from "@shared/schema";

interface AnalysisScreenProps {
  provider: PhoneProvider;
  onAnalysisComplete: (result: DiagnosticResult) => void;
}

export function AnalysisScreen({ provider, onAnalysisComplete }: AnalysisScreenProps) {
  const [dots, setDots] = useState("");
  const [dealSize, setDealSize] = useState("350");
  const [showDealSizeQuestion, setShowDealSizeQuestion] = useState(false);

  const analyzeMutation = useMutation({
    mutationFn: async (data: AnalyzeDiagnosticRequest & { avgDealSize?: number }) => {
      const response = await apiRequest("POST", "/api/diagnostic/analyze", data);
      const result = await response.json() as DiagnosticResult;
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

    // After 2 seconds of "analyzing", show the deal size question
    const questionTimer = setTimeout(() => {
      setShowDealSizeQuestion(true);
    }, 2000);

    return () => {
      clearInterval(dotInterval);
      clearTimeout(questionTimer);
    };
  }, []);

  const handleLooksGood = () => {
    const avgDealSize = parseInt(dealSize) || 350;
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
    return params.get("connected") === "ringcentral";
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
      <div className="text-center space-y-8">
        {!showDealSizeQuestion ? (
          // Phase 1: Analyzing (first 2 seconds)
          <>
            <h1 
              className="text-4xl sm:text-5xl lg:text-6xl font-thin text-white tracking-tight"
              data-testid="text-analyzing"
            >
              Analyzing Call Data{dots}
            </h1>
            
            <div className="flex justify-center space-x-2">
              <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
            </div>

            <p className="text-lg font-extralight text-[#6B7280] tracking-wide">
              {getStatusText()}
            </p>
          </>
        ) : !analyzeMutation.isPending ? (
          // Phase 2: Ask the question (after analyzing message fades)
          <div 
            className="animate-in fade-in duration-700 space-y-8"
            data-testid="panel-deal-size"
          >
            <h1 
              className="text-4xl sm:text-5xl lg:text-6xl font-thin text-white tracking-tight"
              data-testid="text-question"
            >
              What's your average sale?
            </h1>

            <div className="flex items-center justify-center space-x-2">
              <span className="text-3xl font-thin text-white/60">$</span>
              <input
                type="text"
                value={dealSize}
                onChange={handleDealSizeChange}
                className="w-32 px-4 py-3 bg-transparent border-b-2 border-white/30 text-3xl font-thin text-white text-center focus:outline-none focus:border-white transition-colors duration-300"
                placeholder="350"
                data-testid="input-deal-size"
                autoFocus
              />
            </div>

            <button
              onClick={handleLooksGood}
              className="group relative inline-flex items-center justify-center px-10 py-4 text-base font-light text-black bg-white rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-white/20"
              data-testid="button-looks-good"
            >
              <span className="relative z-10 tracking-wide">Looks good</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </div>
        ) : (
          // Phase 3: Crunching numbers
          <>
            <h1 
              className="text-4xl sm:text-5xl lg:text-6xl font-thin text-white tracking-tight"
              data-testid="text-analyzing"
            >
              Analyzing{dots}
            </h1>
            
            <div className="flex justify-center space-x-2">
              <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
            </div>

            <p className="text-lg font-extralight text-[#6B7280] tracking-wide">
              Crunching the numbers...
            </p>
          </>
        )}
      </div>
    </div>
  );
}
