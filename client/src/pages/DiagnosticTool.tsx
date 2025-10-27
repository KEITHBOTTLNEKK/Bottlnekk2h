import { useState } from "react";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { ConnectScreen } from "@/components/ConnectScreen";
import { AnalysisScreen } from "@/components/AnalysisScreen";
import { ResultsScreen } from "@/components/ResultsScreen";
import type { PhoneProvider, DiagnosticResult } from "@shared/schema";

type DiagnosticStep = "welcome" | "connect" | "analysis" | "results";

export default function DiagnosticTool() {
  const [currentStep, setCurrentStep] = useState<DiagnosticStep>("welcome");
  const [selectedProvider, setSelectedProvider] = useState<PhoneProvider | null>(null);
  const [businessEmail, setBusinessEmail] = useState<string | undefined>(undefined);
  const [diagnosticResult, setDiagnosticResult] = useState<DiagnosticResult | null>(null);

  const handleStart = () => {
    setCurrentStep("connect");
  };

  const handleProviderSelect = (provider: PhoneProvider, email?: string) => {
    setSelectedProvider(provider);
    setBusinessEmail(email);
    setCurrentStep("analysis");
  };

  const handleAnalysisComplete = (result: DiagnosticResult) => {
    setDiagnosticResult(result);
    setCurrentStep("results");
  };

  const handleRestart = () => {
    setCurrentStep("welcome");
    setSelectedProvider(null);
    setBusinessEmail(undefined);
    setDiagnosticResult(null);
  };

  return (
    <div className="min-h-screen bg-black">
      {currentStep === "welcome" && <WelcomeScreen onStart={handleStart} />}
      {currentStep === "connect" && <ConnectScreen onProviderSelect={handleProviderSelect} />}
      {currentStep === "analysis" && selectedProvider && (
        <AnalysisScreen 
          provider={selectedProvider}
          businessEmail={businessEmail}
          onAnalysisComplete={handleAnalysisComplete} 
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
