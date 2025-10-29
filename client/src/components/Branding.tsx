import logoIcon from "@assets/hourglass-cracked_transparent_1761722440145.png";

interface BrandingProps {
  onRestart?: () => void;
}

export function Branding({ onRestart }: BrandingProps) {
  return (
    <button
      onClick={onRestart}
      className="fixed top-8 left-8 z-50 flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity"
      data-testid="branding-logo"
    >
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
    </button>
  );
}
