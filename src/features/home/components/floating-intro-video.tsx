"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { usePathname } from "next/navigation";

interface PureVideoModalProps {
  videoId?: string;
}

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

  const [isOpen, setIsOpen] = useState(true);

  // Close with ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
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
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 md:p-10 font-sans"
      style={{ isolation: "isolate" }}
    >
      {/* Soft Light Backdrop (Web behind remains bright and visible) */}
      <div
        onClick={() => setIsOpen(false)}
        className="absolute inset-0 bg-black/20 backdrop-blur-xs animate-in fade-in duration-300 cursor-pointer"
      />

      {/* Pure Cinema Video Card (No Text, No Rounded Corners, Only Close Button) */}
      <div
        className="relative z-10 w-full max-w-4xl rounded-none border border-white/20 bg-black shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button in Top Right Corner */}
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          aria-label="Tutup"
          className="absolute top-3 right-3 z-30 h-9 w-9 rounded-none bg-black/70 hover:bg-black text-white/90 hover:text-white flex items-center justify-center border border-white/20 backdrop-blur-xs transition-colors duration-200 cursor-pointer shadow-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Direct Native YouTube Embed (Official Thumbnail, No Hover Effects, No Autoplay) */}
        <div className="relative w-full aspect-video bg-black overflow-hidden">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`}
            title="LoopTani Video"
            className="w-full h-full border-0"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
