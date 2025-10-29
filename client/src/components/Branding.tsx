import logoWordmark from "@assets/bottlnekk-wordmark_1761720842072.png";
import logoIcon from "@assets/hourglass-cracked_1761720845280.png";

export function Branding() {
  return (
    <div className="fixed top-6 left-6 z-50 flex items-center gap-3" data-testid="branding-logo">
      <img 
        src={logoIcon} 
        alt="Bottlnekk" 
        className="h-8 w-8 opacity-90"
        data-testid="logo-icon"
      />
      <img 
        src={logoWordmark} 
        alt="Bottlnekk" 
        className="h-6 opacity-90"
        data-testid="logo-wordmark"
      />
    </div>
  );
}
