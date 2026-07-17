import { useEffect, useState, useRef } from "react";

interface UseReadingProgressProps {
  estimatedReadingMinutes: number;
  completed: boolean;
  enabled?: boolean;
}

export function useReadingProgress({ estimatedReadingMinutes, completed, enabled = true }: UseReadingProgressProps) {
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [activeReadingSeconds, setActiveReadingSeconds] = useState(0);
  
  const maxScrollRef = useRef(0);
  const activeSecondsRef = useRef(0);
  const isTabVisibleRef = useRef(true);
  const isWindowFocusedRef = useRef(true);

  const targetReadingSeconds = (estimatedReadingMinutes || 5) * 60 * 0.7; // 70% threshold

  useEffect(() => {
    if (!enabled) {
      setScrollPercentage(0);
      setActiveReadingSeconds(0);
      return;
    }

    if (completed) {
      setScrollPercentage(100);
      setActiveReadingSeconds(targetReadingSeconds);
      return;
    }

    // Reset values for new content
    setScrollPercentage(0);
    setActiveReadingSeconds(0);
    maxScrollRef.current = 0;
    activeSecondsRef.current = 0;

    // 1. Scroll tracking using requestAnimationFrame (passive)
    let isTicking = false;
    const handleScroll = () => {
      if (!isTicking) {
        window.requestAnimationFrame(() => {
          const scrollTop = window.scrollY || document.documentElement.scrollTop;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          if (docHeight > 0) {
            const currentPct = Math.min((scrollTop / docHeight) * 100, 100);
            if (currentPct > maxScrollRef.current) {
              maxScrollRef.current = currentPct;
              setScrollPercentage(Math.round(currentPct));
            }
          } else {
            setScrollPercentage(100);
            maxScrollRef.current = 100;
          }
          isTicking = false;
        });
        isTicking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Trigger once on mount
    handleScroll();

    // 2. Active time tracking (Page Visibility & Window Focus)
    const handleVisibilityChange = () => {
      isTabVisibleRef.current = document.visibilityState === "visible";
    };

    const handleFocus = () => {
      isWindowFocusedRef.current = true;
    };

    const handleBlur = () => {
      isWindowFocusedRef.current = false;
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);

    const timer = setInterval(() => {
      if (isTabVisibleRef.current && isWindowFocusedRef.current) {
        activeSecondsRef.current += 1;
        setActiveReadingSeconds(activeSecondsRef.current);
      }
    }, 1000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
      clearInterval(timer);
    };
  }, [estimatedReadingMinutes, completed, targetReadingSeconds]);

  const meetsScroll = scrollPercentage >= 90;
  const meetsTime = activeReadingSeconds >= targetReadingSeconds;

  return {
    scrollPercentage,
    activeReadingSeconds,
    meetsScroll,
    meetsTime,
    meetsThreshold: meetsScroll && meetsTime,
    targetReadingSeconds: Math.round(targetReadingSeconds),
  };
}
