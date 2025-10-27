import { useEffect, useState } from "react";

// easeOutExpo easing function (fast start, sharp deceleration)
const easeOutExpo = (t: number): number => {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
};

interface UseCounterOptions {
  end: number;
  duration?: number;
  start?: number;
  onComplete?: () => void;
}

export const useCounter = ({ 
  end, 
  duration = 2500, 
  start = 0,
  onComplete 
}: UseCounterOptions) => {
  const [count, setCount] = useState(start);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Apply easeOutExpo easing
      const easedProgress = easeOutExpo(progress);
      const currentCount = Math.floor(start + (end - start) * easedProgress);
      
      setCount(currentCount);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
        onComplete?.();
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration, start, onComplete]);

  return count;
};
