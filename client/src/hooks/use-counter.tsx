import { useEffect, useState, useRef } from 'react';

interface UseCounterProps {
  end: number;
  start?: number;
  duration?: number;
  onComplete?: () => void;
}

export function useCounter({ end, start = 0, duration = 2000, onComplete }: UseCounterProps) {
  const [count, setCount] = useState(start);
  const animationRef = useRef<number | null>(null);
  const startTimestampRef = useRef<number | null>(null);
  const previousEndRef = useRef(end);

  useEffect(() => {
    // Only animate if the end value has actually changed
    if (end === previousEndRef.current) {
      return;
    }
    
    previousEndRef.current = end;
    
    // Cancel any ongoing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    startTimestampRef.current = null;
    
    const animate = (timestamp: number) => {
      if (!startTimestampRef.current) {
        startTimestampRef.current = timestamp;
      }
      
      const progress = Math.min((timestamp - startTimestampRef.current) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const newCount = Math.floor(easeOutQuart * (end - start) + start);
      
      setCount(newCount);
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setCount(end);
        animationRef.current = null;
        onComplete?.();
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    // Cleanup function
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [end, start, duration, onComplete]);

  return count;
}