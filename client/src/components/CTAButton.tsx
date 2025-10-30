import { ReactNode } from "react";

interface CTAButtonProps {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
  "data-testid"?: string;
}

export function CTAButton({ children, onClick, href, className = "", "data-testid": testId }: CTAButtonProps) {
  const baseStyles = "group inline-flex items-center justify-center gap-3 px-12 py-5 text-lg font-normal text-white border-2 border-[#00C97B] rounded-xl transition-all duration-300 hover:scale-[1.02] hover:bg-[#00C97B] hover:text-black";
  
  if (href) {
    return (
      <a
        href={href}
        className={`${baseStyles} ${className}`}
        data-testid={testId}
      >
        {children}
      </a>
    );
  }
  
  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${className}`}
      data-testid={testId}
    >
      {children}
    </button>
  );
}
