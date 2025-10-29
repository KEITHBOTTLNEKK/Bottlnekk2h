import logoIcon from "@assets/hourglass-cracked_1761720845280.png";

export function Branding() {
  return (
    <div className="fixed top-8 left-8 z-50 flex items-center gap-4" data-testid="branding-logo">
      <div 
        className="h-10 w-10 bg-white"
        style={{ 
          maskImage: `url(${logoIcon})`,
          maskSize: 'contain',
          maskRepeat: 'no-repeat',
          maskPosition: 'center',
          WebkitMaskImage: `url(${logoIcon})`,
          WebkitMaskSize: 'contain',
          WebkitMaskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center'
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
