import logoWordmark from "@assets/bottlnekk-wordmark (1)_1761721339239.png";
import logoIcon from "@assets/hourglass-cracked_1761720845280.png";

export function Branding() {
  return (
    <div className="fixed top-8 left-8 z-50 flex items-center gap-4" data-testid="branding-logo">
      <img 
        src={logoIcon} 
        alt="Bottlnekk" 
        className="h-10 w-10 brightness-0 invert"
        data-testid="logo-icon"
      />
      <img 
        src={logoWordmark} 
        alt="Bottlnekk" 
        className="h-8 brightness-0 invert"
        data-testid="logo-wordmark"
      />
    </div>
  );
}
