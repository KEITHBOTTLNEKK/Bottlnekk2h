interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-black dark:bg-black flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full text-center space-y-12">
        <div className="space-y-6">
          <h1 
            className="text-welcome-sm md:text-welcome-lg font-thin text-white tracking-tight leading-none"
            data-testid="heading-welcome"
          >
            How much are you losing?
          </h1>
          <p 
            className="text-subtext-sm md:text-subtext-lg font-light text-[#9CA3AF] tracking-wide"
            data-testid="text-subheading"
          >
            Every missed call is lost revenue.
          </p>
        </div>

        <div className="pt-8">
          <button
            onClick={onStart}
            className="group relative inline-flex items-center justify-center px-12 py-5 text-button font-semibold text-black bg-white rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-white/20"
            data-testid="button-start"
          >
            <span className="relative z-10 tracking-wide">Show Me The Number</span>
            <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </div>
      </div>
    </div>
  );
}
