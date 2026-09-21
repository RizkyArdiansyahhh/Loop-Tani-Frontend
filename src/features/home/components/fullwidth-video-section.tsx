"use client";

import * as React from "react";

interface FullWidthVideoSectionProps {
  text?: string;
}

const OPTIMIZED_VIDEO_SRC =
  "https://res.cloudinary.com/aexisrpt/video/upload/q_auto,f_auto,w_1920,c_limit/v1786439474/13167577_3840_2160_30fps_1.mp4";

export function FullWidthVideoSection({
  text = "LOOP TANI",
}: FullWidthVideoSectionProps) {
  const sectionRef = React.useRef<HTMLElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [isInView, setIsInView] = React.useState(false);

  React.useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsInView(true);
          videoRef.current?.play().catch(() => {});
        } else {
          videoRef.current?.pause();
        }
      },
      { rootMargin: "300px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[55vh] sm:h-[70vh] min-h-96 overflow-hidden bg-slate-950 select-none [content-visibility:auto] [contain-intrinsic-size:1px_500px]"
    >
      {/* Background Video with Lazy Loading & Auto-Pause */}
      {isInView && (
        <video
          ref={videoRef}
          src={OPTIMIZED_VIDEO_SRC}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          className="h-full w-full object-cover pointer-events-none transition-opacity duration-700"
        />
      )}

      {/* Dark Overlay Effect Directly on the Video */}
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-black/10 pointer-events-none" />

      {/* Large Clean Semi-Transparent Text Overlay - Positioned Close to Bottom */}
      <div className="absolute bottom-1 sm:bottom-2 md:bottom-3 left-0 right-0 text-center pointer-events-none z-10 px-4 overflow-hidden">
        <h2 className="font-sans font-black uppercase tracking-tighter text-5xl sm:text-7xl md:text-8xl lg:text-[11.5rem] leading-none text-white/45 sm:text-white/40 select-none">
          {text}
        </h2>
      </div>
    </section>
  );
}
