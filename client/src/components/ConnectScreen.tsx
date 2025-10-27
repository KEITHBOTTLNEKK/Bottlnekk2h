import { useState } from "react";
import type { PhoneProvider } from "@shared/schema";
import { phoneProviders } from "@shared/schema";

interface ConnectScreenProps {
  onProviderSelect: (provider: PhoneProvider) => void;
}

export function ConnectScreen({ onProviderSelect }: ConnectScreenProps) {
  const [selectedProvider, setSelectedProvider] = useState<PhoneProvider | null>(null);

  const handleProviderClick = (provider: PhoneProvider) => {
    setSelectedProvider(provider);
  };

  const handleContinue = () => {
    if (selectedProvider) {
      onProviderSelect(selectedProvider);
    }
  };

  return (
    <div className="min-h-screen bg-black dark:bg-black flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-16">
        <div className="text-center space-y-6">
          <h1 
            className="text-5xl sm:text-6xl lg:text-7xl font-thin text-white tracking-tight"
            data-testid="heading-connect"
          >
            Unlock Your Real Number
          </h1>
          <p 
            className="text-lg sm:text-xl font-extralight text-[#9CA3AF] tracking-wide max-w-2xl mx-auto"
            data-testid="text-connect-subheading"
          >
            To calculate your losses, I need access to your phone system.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {phoneProviders.map((provider) => (
            <button
              key={provider}
              onClick={() => handleProviderClick(provider)}
              className={`group relative px-8 py-12 border-2 rounded-lg transition-all duration-300 ${
                selectedProvider === provider
                  ? 'border-white bg-white/10 scale-105'
                  : 'border-white/20 hover:border-white hover:bg-white/5 hover:scale-105'
              }`}
              data-testid={`button-provider-${provider.toLowerCase()}`}
            >
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-colors duration-300 ${
                  selectedProvider === provider
                    ? 'border-white'
                    : 'border-white/30 group-hover:border-white'
                }`}>
                  <div className={`w-8 h-8 rounded-full transition-colors duration-300 ${
                    selectedProvider === provider
                      ? 'bg-white/60'
                      : 'bg-white/20 group-hover:bg-white/40'
                  }`} />
                </div>
                <span className="text-2xl font-light text-white tracking-wide">
                  {provider}
                </span>
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
            </button>
          ))}
        </div>

        {selectedProvider && (
          <div className="max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button
              onClick={handleContinue}
              className="w-full group relative inline-flex items-center justify-center px-10 py-4 text-base font-light text-black bg-white rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-white/20"
              data-testid="button-continue"
            >
              <span className="relative z-10 tracking-wide">Continue Analysis</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </div>
        )}

        <div className="text-center">
          <p className="text-sm font-light text-[#6B7280] tracking-wide">
            {selectedProvider ? 'Click Continue to analyze your data' : 'Select your phone system provider to continue'}
          </p>
        </div>
      </div>
    </div>
  );
}
