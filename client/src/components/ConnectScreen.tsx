import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

interface ConnectScreenProps {
  onProviderSelect: (provider: "RingCentral" | "Zoom Phone") => void;
}

interface ConnectionStatus {
  connected: boolean;
  expired?: boolean;
  accountId?: string;
}

export function ConnectScreen({ onProviderSelect }: ConnectScreenProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Check connection status for both providers
  const { data: ringCentralStatus } = useQuery<ConnectionStatus>({
    queryKey: ["/auth/ringcentral/status"],
    refetchInterval: 5000,
  });

  const { data: zoomStatus } = useQuery<ConnectionStatus>({
    queryKey: ["/auth/zoom/status"],
    refetchInterval: 5000,
  });

  // Handle OAuth callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const connected = params.get("connected");
    const error = params.get("error");

    if (connected === "ringcentral") {
      window.history.replaceState({}, "", window.location.pathname);
      setTimeout(() => onProviderSelect("RingCentral"), 1000);
    } else if (connected === "zoom") {
      window.history.replaceState({}, "", window.location.pathname);
      setTimeout(() => onProviderSelect("Zoom Phone"), 1000);
    } else if (error) {
      window.history.replaceState({}, "", window.location.pathname);
      setErrorMessage(decodeURIComponent(error));
      // Auto-dismiss after 8 seconds
      setTimeout(() => setErrorMessage(null), 8000);
    }
  }, [onProviderSelect]);

  const handleConnect = (provider: "RingCentral" | "Zoom Phone") => {
    if (provider === "RingCentral") {
      if (!ringCentralStatus?.connected || ringCentralStatus?.expired) {
        window.location.href = "/auth/ringcentral/login";
      } else {
        onProviderSelect("RingCentral");
      }
    } else {
      if (!zoomStatus?.connected || zoomStatus?.expired) {
        window.location.href = "/auth/zoom/login";
      } else {
        onProviderSelect("Zoom Phone");
      }
    }
  };

  const isRingCentralConnected = ringCentralStatus?.connected && !ringCentralStatus?.expired;
  const isZoomConnected = zoomStatus?.connected && !zoomStatus?.expired;

  return (
    <div className="min-h-screen bg-black dark:bg-black flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full space-y-16">
        {/* Error Banner */}
        {errorMessage && (
          <div 
            className="mx-auto max-w-2xl px-6 py-4 border border-red-500/30 bg-red-500/10 rounded-lg animate-in fade-in slide-in-from-top-4 duration-500"
            data-testid="error-banner"
          >
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <p className="text-sm font-light text-red-200 tracking-wide">
                  {errorMessage}
                </p>
              </div>
              <button
                onClick={() => setErrorMessage(null)}
                className="text-red-400 hover:text-red-300 transition-colors"
                data-testid="button-dismiss-error"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center space-y-6">
          <h1 
            className="font-bold text-white tracking-tight whitespace-nowrap"
            style={{ fontSize: '4.5rem' }}
            data-testid="heading-connect"
          >
            Which phone system do you use?
          </h1>
          <p 
            className="font-light text-[#9CA3AF] tracking-wide max-w-2xl mx-auto"
            style={{ fontSize: '1.25rem' }}
            data-testid="text-connect-subheading"
          >
            Connect securely to analyze your call data
          </p>
        </div>

        {/* Provider Cards - Only the two that work */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* RingCentral */}
          <button
            onClick={() => handleConnect("RingCentral")}
            className="group relative px-10 py-16 border border-white/20 rounded-2xl transition-all duration-500 hover:border-white hover:bg-white/5 hover:scale-105 hover:shadow-2xl hover:shadow-white/10"
            data-testid="button-provider-ringcentral"
          >
            <div className="flex flex-col items-center justify-center space-y-6">
              {/* RingCentral Logo */}
              <div className="w-20 h-20 rounded-full border-2 border-white/30 flex items-center justify-center group-hover:border-white transition-colors duration-300 overflow-hidden">
                <svg viewBox="0 0 100 100" className="w-12 h-12 opacity-85 group-hover:opacity-100 transition-opacity duration-300">
                  <rect x="10" y="10" width="80" height="80" rx="15" fill="none" stroke="white" strokeWidth="4"/>
                  <path d="M30 35 L30 65 M30 35 L45 35 Q50 35 50 40 Q50 45 45 45 L35 45 M45 45 L55 65" 
                    stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
              </div>
              
              {/* Name */}
              <h2 className="font-medium text-white tracking-wide" style={{ fontSize: '1.125rem' }}>
                RingCentral
              </h2>
              
              {/* Status */}
              {isRingCentralConnected ? (
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm font-light text-green-400 tracking-wide">
                    Connected
                  </span>
                </div>
              ) : (
                <span className="text-sm font-extralight text-white/60 tracking-wide">
                  Click to connect
                </span>
              )}
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
          </button>

          {/* Zoom Phone */}
          <button
            onClick={() => handleConnect("Zoom Phone")}
            className="group relative px-10 py-16 border border-white/20 rounded-2xl transition-all duration-500 hover:border-white hover:bg-white/5 hover:scale-105 hover:shadow-2xl hover:shadow-white/10"
            data-testid="button-provider-zoom phone"
          >
            <div className="flex flex-col items-center justify-center space-y-6">
              {/* Zoom Logo */}
              <div className="w-20 h-20 rounded-full border-2 border-white/30 flex items-center justify-center group-hover:border-white transition-colors duration-300 overflow-hidden">
                <svg viewBox="0 0 100 100" className="w-12 h-12 opacity-85 group-hover:opacity-100 transition-opacity duration-300">
                  <rect x="15" y="15" width="70" height="70" rx="12" fill="none" stroke="white" strokeWidth="4"/>
                  <path d="M30 40 L60 40 L30 60 L60 60" 
                    stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
              </div>
              
              {/* Name */}
              <h2 className="font-medium text-white tracking-wide" style={{ fontSize: '1.125rem' }}>
                Zoom Phone
              </h2>
              
              {/* Status */}
              {isZoomConnected ? (
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm font-light text-green-400 tracking-wide">
                    Connected
                  </span>
                </div>
              ) : (
                <span className="text-sm font-extralight text-white/60 tracking-wide">
                  Click to connect
                </span>
              )}
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
          </button>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="font-semibold text-[#6B7280] tracking-wide" style={{ fontSize: '0.875rem' }}>
            Your data is encrypted and secure
          </p>
        </div>
      </div>
    </div>
  );
}
