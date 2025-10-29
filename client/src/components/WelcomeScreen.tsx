import { useState } from "react";
import { Branding } from "./Branding";

interface WelcomeScreenProps {
  onStart: () => void;
  onRestart?: () => void;
}

type AccentColor = "blue" | "orange" | "green";

const ACCENT_COLORS = {
  blue: "#007AFF",
  orange: "#FF6B00",
  green: "#00C97B",
};

export function WelcomeScreen({ onStart, onRestart }: WelcomeScreenProps) {
  const [accentColor, setAccentColor] = useState<AccentColor>("blue");
  const currentColor = ACCENT_COLORS[accentColor];

  return (
    <div className="min-h-screen bg-black dark:bg-black flex items-center justify-center px-8 sm:px-12 lg:px-16">
      <Branding onRestart={onRestart} accentColor={currentColor} />
      
      {/* Color Switcher - Testing Only */}
      <div className="fixed top-8 right-8 z-50 flex gap-3">
        <button
          onClick={() => setAccentColor("blue")}
          className={`w-12 h-12 rounded-full border-2 transition-all ${
            accentColor === "blue" ? "border-white scale-110" : "border-gray-700"
          }`}
          style={{ backgroundColor: ACCENT_COLORS.blue }}
          title="Blue (#007AFF)"
          data-testid="color-blue"
        />
        <button
          onClick={() => setAccentColor("orange")}
          className={`w-12 h-12 rounded-full border-2 transition-all ${
            accentColor === "orange" ? "border-white scale-110" : "border-gray-700"
          }`}
          style={{ backgroundColor: ACCENT_COLORS.orange }}
          title="Orange (#FF6B00)"
          data-testid="color-orange"
        />
        <button
          onClick={() => setAccentColor("green")}
          className={`w-12 h-12 rounded-full border-2 transition-all ${
            accentColor === "green" ? "border-white scale-110" : "border-gray-700"
          }`}
          style={{ backgroundColor: ACCENT_COLORS.green }}
          title="Green (#00C97B)"
          data-testid="color-green"
        />
      </div>

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
            className="inline-flex items-center justify-center px-16 py-6 font-bold text-white border-2 rounded-xl transition-all duration-300"
            style={{ 
              fontSize: '1.5rem',
              borderColor: currentColor,
              backgroundColor: 'transparent',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = currentColor;
              e.currentTarget.style.color = '#000000';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#FFFFFF';
            }}
            data-testid="button-start"
          >
            Show Me The Number
          </button>
        </div>
      </div>
    </div>
  );
}
