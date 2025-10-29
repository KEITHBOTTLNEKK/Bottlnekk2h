import { ReactNode } from "react";

interface CTAButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  "data-testid"?: string;
}

export function CTAButton({ children, onClick, className = "", "data-testid": testId }: CTAButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`group inline-flex items-center justify-center gap-3 px-12 py-5 text-lg font-normal text-white border-2 border-[#00C97B] rounded-xl transition-all duration-300 hover:scale-[1.02] hover:bg-[#00C97B] hover:text-black ${className}`}
      data-testid={testId}
    >
      {children}
    </button>
  );
}
