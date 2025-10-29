import logoIcon from "@assets/hourglass-cracked_1761720845280.png";

export function Branding() {
  return (
    <div className="fixed top-8 left-8 z-50 flex items-center gap-4" data-testid="branding-logo">
      <img 
        src={logoIcon}
        alt="Bottlnekk Icon" 
        className="h-10 w-10"
        style={{ 
          filter: 'brightness(0) invert(1)',
        }}
        data-testid="logo-icon"
      />
      <div 
        className="text-white text-3xl font-black tracking-tight"
        style={{ fontFamily: 'Inter, sans-serif' }}
        data-testid="logo-wordmark"
      >
        Bottlnekk
      </div>
    </div>
  );
}
