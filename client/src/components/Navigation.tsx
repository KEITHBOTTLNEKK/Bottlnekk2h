import { Link } from "wouter";
import logoUrl from "@assets/bottlnekk-wordmark_1761766612312.png";

const BOTTLNEKK_GREEN = "#00C97B";

export function Navigation() {
  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-50 px-8 sm:px-12 lg:px-16 py-6"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(10px)' }}
      data-testid="navigation"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <button
            className="transition-all duration-300 hover:scale-105"
            data-testid="nav-logo"
          >
            <img 
              src={logoUrl} 
              alt="Bottlnekk" 
              className="h-8"
              style={{ filter: 'brightness(1.2)' }}
            />
          </button>
        </Link>

        {/* About Link */}
        <Link href="/about">
          <button
            className="font-light text-white transition-all duration-300"
            style={{ 
              fontSize: '1rem',
              color: '#9CA3AF',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = BOTTLNEKK_GREEN;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#9CA3AF';
            }}
            data-testid="nav-about"
          >
            About
          </button>
        </Link>
      </div>
    </nav>
  );
}
