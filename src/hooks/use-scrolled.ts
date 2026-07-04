"use client";

import { useState, useEffect } from "react";

/**
 * Custom hook to detect when user scrolls past a threshold
 * @param threshold - Scroll position in pixels (default: 30px)
 * @returns boolean indicating if user has scrolled past threshold
 */
export function useScrolled(threshold = 30): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Handler for scroll events
    const handleScroll = () => {
      setScrolled(window.scrollY > threshold);
    };

    // Check initial scroll position
    handleScroll();

    // Add scroll listener with passive flag for better performance
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Cleanup listener on unmount
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return scrolled;
}
