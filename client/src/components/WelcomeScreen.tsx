interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-black dark:bg-black flex items-center justify-center px-8 sm:px-12 lg:px-16">
      <div className="w-full max-w-5xl mx-auto">
        <div className="flex flex-col items-center space-y-16">
          {/* Headline Section */}
          <div className="w-full text-center space-y-8">
            <h1 
              className="font-thin text-white leading-none"
              style={{ fontSize: 'clamp(3.5rem, 7vw, 6.5rem)', letterSpacing: '0.02em', fontWeight: '200' }}
              data-testid="heading-welcome"
            >
              How much are you losing?
            </h1>
            <p 
              className="font-light text-[#9CA3AF] mx-auto"
              style={{ fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)', letterSpacing: '0.05em' }}
              data-testid="text-subheading"
            >
              It's more than you think.
            </p>
          </div>

          {/* Button Section */}
          <div className="flex justify-center">
            <button
              onClick={onStart}
              className="group relative inline-flex items-center justify-center px-14 py-5 font-semibold text-black bg-white rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-white/20"
              style={{ fontSize: '1rem', letterSpacing: '0.02em' }}
              data-testid="button-start"
            >
              <span className="relative z-10 tracking-wide">Show Me The Number</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
