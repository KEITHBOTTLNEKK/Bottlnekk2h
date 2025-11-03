import { Link } from "wouter";
import { Hourglass } from "lucide-react";

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
            className="flex items-center gap-3 transition-all duration-300 hover:scale-105"
            data-testid="nav-logo"
          >
            <div 
              className="flex items-center justify-center w-10 h-10 rounded-lg"
              style={{ 
                backgroundColor: 'rgba(0, 201, 123, 0.1)',
                boxShadow: `0 0 20px rgba(0, 201, 123, 0.3)`
              }}
            >
              <Hourglass 
                className="w-6 h-6" 
                style={{ color: BOTTLNEKK_GREEN }}
              />
            </div>
            <span 
              className="font-light text-white tracking-wider"
              style={{ fontSize: '1.25rem' }}
            >
              Bottlnekk
            </span>
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
