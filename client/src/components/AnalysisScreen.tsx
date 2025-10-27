import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { PhoneProvider, DiagnosticResult, AnalyzeDiagnosticRequest } from "@shared/schema";

interface AnalysisScreenProps {
  provider: PhoneProvider;
  businessEmail?: string;
  onAnalysisComplete: (result: DiagnosticResult) => void;
}

export function AnalysisScreen({ provider, businessEmail, onAnalysisComplete }: AnalysisScreenProps) {
  const [dots, setDots] = useState("");

  const analyzeMutation = useMutation({
    mutationFn: async (data: AnalyzeDiagnosticRequest) => {
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

    if (!analyzeMutation.isError && !analyzeMutation.isSuccess && !analyzeMutation.isPending) {
      analyzeMutation.mutate({ provider, businessEmail });
    }

    return () => clearInterval(dotInterval);
  }, [provider]);

  const handleRetry = () => {
    analyzeMutation.reset();
    analyzeMutation.mutate({ provider, businessEmail });
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

  const getStatusText = () => {
    if (analyzeMutation.isSuccess) {
      return "Processing complete...";
    }
    if (analyzeMutation.isPending) {
      return `Connecting to ${provider}`;
    }
    return "Initializing...";
  };

  return (
    <div className="min-h-screen bg-black dark:bg-black flex items-center justify-center px-4">
      <div className="text-center space-y-8">
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
      </div>
    </div>
  );
}
