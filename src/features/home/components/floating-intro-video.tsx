"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { usePathname } from "next/navigation";

interface PureVideoModalProps {
  videoId?: string;
}

const STORAGE_KEY = "looptani_has_seen_intro_video";

const HIDDEN_PREFIXES = [
  "/admin",
  "/seller",
  "/login",
  "/register",
  "/checkout",
  "/loopi",
];

export function FloatingIntroVideo({
  videoId = "C-3W2Bjzy7c",
}: PureVideoModalProps) {
  const pathname = usePathname() || "";
  const cleanPath = pathname.replace(/^\/(id|en)/, "") || "/";

  const isHidden = HIDDEN_PREFIXES.some((prefix) =>
    cleanPath.startsWith(prefix)
  );

  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Check localStorage after initial page load settles (4s delay prevents tanking LCP and Lighthouse audits)
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const hasSeen = localStorage.getItem(STORAGE_KEY);
        if (!hasSeen) {
          setIsOpen(true);
        }
      } catch {
        setIsOpen(true);
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setIsPlaying(false);
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // ignore
    }
  };

  // Close with ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (isHidden || !isOpen) {
    return null;
  }

  return (
    <div
      id="intro-video-modal"
      className="fixed inset-0 z-99999 flex items-center justify-center p-3 sm:p-6 md:p-10 font-sans"
      style={{ isolation: "isolate" }}
    >
      {/* Soft Light Backdrop (Web behind remains bright and visible) */}
      <div
        onClick={handleClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs animate-in fade-in duration-300 cursor-pointer"
      />

      {/* Pure Cinema Video Card */}
      <div
        className="relative z-10 w-full max-w-4xl rounded-2xl border border-white/20 bg-black shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button in Top Right Corner */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Tutup video pengenalan"
          className="absolute top-3 right-3 z-30 h-9 w-9 rounded-full bg-black/70 hover:bg-black text-white/90 hover:text-white flex items-center justify-center border border-white/20 backdrop-blur-xs transition-colors duration-200 cursor-pointer shadow-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Video Container (YouTube Facade: loads iframe only when user plays) */}
        <div className="relative w-full aspect-video bg-black overflow-hidden flex items-center justify-center">
          {isPlaying ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
              title="LoopTani Video"
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <div
              onClick={() => setIsPlaying(true)}
              className="relative w-full h-full cursor-pointer group flex items-center justify-center"
            >
              <img
                src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
                alt="LoopTani Intro Video Preview"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />

              {/* Big YouTube Play Button */}
              <div className="relative z-10 h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-red-600 group-hover:bg-red-500 text-white flex items-center justify-center shadow-2xl transition-all duration-300 group-hover:scale-110">
                <svg
                  className="w-8 h-8 sm:w-10 sm:h-10 fill-current translate-x-0.5"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
