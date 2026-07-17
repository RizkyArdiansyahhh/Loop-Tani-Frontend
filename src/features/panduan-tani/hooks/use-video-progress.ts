import { useEffect, useState, useRef } from "react";

interface UseVideoProgressProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  videoDurationSeconds: number;
  completed: boolean;
  enabled?: boolean;
}

export function useVideoProgress({ videoRef, videoDurationSeconds, completed, enabled = true }: UseVideoProgressProps) {
  const [watchedPercentage, setWatchedPercentage] = useState(0);
  const watchedSecondsSetRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (!enabled) {
      setWatchedPercentage(0);
      return;
    }

    if (completed) {
      setWatchedPercentage(100);
      return;
    }

    setWatchedPercentage(0);
    watchedSecondsSetRef.current = new Set<number>();

    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const currentSecond = Math.floor(video.currentTime);
      const duration = videoDurationSeconds || video.duration || 1;
      
      if (currentSecond >= 0 && currentSecond < duration) {
        watchedSecondsSetRef.current.add(currentSecond);
        
        const uniqueSeconds = watchedSecondsSetRef.current.size;
        const pct = Math.min((uniqueSeconds / duration) * 100, 100);
        setWatchedPercentage(Math.round(pct));
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [videoRef, videoDurationSeconds, completed]);

  const meetsThreshold = watchedPercentage >= 80;

  return {
    watchedPercentage,
    meetsThreshold,
  };
}
