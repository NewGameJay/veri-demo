import { useEffect, useState } from 'react';

interface UseCounterProps {
  end: number;
  start?: number;
  duration?: number;
  onComplete?: () => void;
}

export function useCounter({ end, start = 0, duration = 2000, onComplete }: UseCounterProps) {
  const [count, setCount] = useState(start);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * (end - start) + start));
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(end);
        onComplete?.();
      }
    };
    
    window.requestAnimationFrame(step);
  }, [end, start, duration, onComplete]);

  return count;
}