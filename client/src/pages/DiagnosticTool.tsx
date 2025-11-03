import { useState } from "react";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { ConnectScreen } from "@/components/ConnectScreen";
import { ManualInputScreen } from "@/components/ManualInputScreen";
import { AnalysisScreen } from "@/components/AnalysisScreen";
import { ResultsScreen } from "@/components/ResultsScreen";
import type { PhoneProvider, DiagnosticResult } from "@shared/schema";

type DiagnosticStep = "welcome" | "connect" | "manual-input" | "analysis" | "results";

export default function DiagnosticTool() {
  // Check for OAuth callback on initial load
  const getInitialStep = (): DiagnosticStep => {
    const params = new URLSearchParams(window.location.search);
    const connected = params.get("connected");
    // If OAuth callback detected, go straight to analysis
    return connected ? "analysis" : "welcome";
  };

  const getInitialProvider = (): PhoneProvider | null => {
    const params = new URLSearchParams(window.location.search);
    const connected = params.get("connected");
    // If OAuth callback with provider, set it
    if (connected === "ringcentral") return "RingCentral";
    if (connected === "zoom") return "Zoom Phone";
    return null;
  };

  const [currentStep, setCurrentStep] = useState<DiagnosticStep>(getInitialStep);
  const [selectedProvider, setSelectedProvider] = useState<PhoneProvider | null>(getInitialProvider);
  const [diagnosticResult, setDiagnosticResult] = useState<DiagnosticResult | null>(null);
  const [manualData, setManualData] = useState<{ missedCalls: number; avgDealSize: number } | null>(null);

  const handleStart = () => {
    setCurrentStep("connect");
  };

  const handleProviderSelect = (provider: PhoneProvider) => {
    setSelectedProvider(provider);
    setManualData(null);
    setCurrentStep("analysis");
  };

  const handleManualInput = () => {
    setCurrentStep("manual-input");
  };

  const handleManualSubmit = (missedCalls: number, avgDealSize: number) => {
    setManualData({ missedCalls, avgDealSize });
    setSelectedProvider(null);
    setCurrentStep("analysis");
  };

  const handleAnalysisComplete = (result: DiagnosticResult) => {
    setDiagnosticResult(result);
    setCurrentStep("results");
  };

  const handleRestart = () => {
    setCurrentStep("welcome");
    setSelectedProvider(null);
    setDiagnosticResult(null);
    setManualData(null);
  };

  return (
    <div className="min-h-screen bg-black">
      {currentStep === "welcome" && <WelcomeScreen onStart={handleStart} onRestart={handleRestart} />}
      {currentStep === "connect" && (
        <ConnectScreen 
          onProviderSelect={handleProviderSelect} 
          onManualInput={handleManualInput}
          onRestart={handleRestart} 
        />
      )}
      {currentStep === "manual-input" && (
        <ManualInputScreen
          onSubmit={handleManualSubmit}
          onRestart={handleRestart}
        />
      )}
      {currentStep === "analysis" && (selectedProvider || manualData) && (
        <AnalysisScreen 
          provider={selectedProvider}
          manualData={manualData}
          onAnalysisComplete={handleAnalysisComplete}
          onRestart={handleRestart}
        />
      )}
      {currentStep === "results" && diagnosticResult && (
        <ResultsScreen 
          result={diagnosticResult} 
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}
