import { Branding } from "./Branding";

interface WelcomeScreenProps {
  onStart: () => void;
  onRestart?: () => void;
}

export function WelcomeScreen({ onStart, onRestart }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-black dark:bg-black flex items-center justify-center px-8 sm:px-12 lg:px-16">
      <Branding onRestart={onRestart} />
      <div className="w-full text-center space-y-12">
        <div className="space-y-6">
          <h1 
            className="font-thin text-white leading-none"
            style={{ fontSize: 'clamp(3.5rem, 7vw, 6.5rem)', letterSpacing: '0.02em', fontWeight: '200' }}
            data-testid="heading-welcome"
          >
            How much are you losing?
          </h1>
          <p 
            className="font-light text-[#9CA3AF]"
            style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)', letterSpacing: '0.05em' }}
            data-testid="text-subheading"
          >
            It's more than you think.
          </p>
        </div>

        <div className="pt-16">
          <button
            onClick={onStart}
            className="inline-flex items-center justify-center px-16 py-6 font-bold text-white border-2 border-white rounded-xl transition-all duration-300 hover:bg-white hover:text-black"
            style={{ fontSize: '1.5rem' }}
            data-testid="button-start"
          >
            Show Me The Number
          </button>
        </div>
      </div>
    </div>
  );
}
