"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles, Leaf, Recycle, Store } from "lucide-react";
import { CutoutCorner } from "@/components/ui/cutout-card";
import { cn } from "@/lib/utils";

interface SlideData {
  id: number;
  image: string;
  badge: string;
  icon: typeof Leaf;
  title: string;
  description: string;
}

const slides: SlideData[] = [
  {
    id: 1,
    image: "/images/auth-carousel-1.jpg",
    badge: "Ekonomi Sirkular",
    icon: Leaf,
    title: "Ekonomi Sirkular Pertanian Nusantara",
    description:
      "Ubah limbah pertanian menjadi nilai ekonomi baru dan dukung keberlanjutan tanah pertanian Indonesia.",
  },
  {
    id: 2,
    image: "/images/auth-carousel-2.jpg",
    badge: "Daur Ulang Organik",
    icon: Recycle,
    title: "Inovasi Biochar & Kompos Organik",
    description:
      "Tingkatkan kesuburan tanah dengan pengolahan sekam, jerami, dan kotoran ternak menjadi media tanam unggul.",
  },
  {
    id: 3,
    image: "/images/auth-carousel-3.jpg",
    badge: "Marketplace Tani",
    icon: Store,
    title: "Hubungkan Petani & Pembeli Langsung",
    description:
      "Jual dan beli limbah pertanian, produk olahan, dan alat secondhand berkualitas tanpa perantara.",
  },
];

interface AuthCarouselProps {
  className?: string;
}

export function AuthCarousel({ className }: AuthCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  const handleNext = useCallback(() => {
    setDirection("next");
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, []);

  const handlePrev = useCallback(() => {
    setDirection("prev");
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  const currentSlide = slides[currentIndex];
  const IconComponent = currentSlide.icon;

  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden rounded-[28px] bg-slate-950 shadow-2xl select-none",
        className
      )}
    >
      {/* Background Image Carousel with Fade/Scale Transition */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={currentSlide.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 h-full w-full"
        >
          <Image
            src={currentSlide.image}
            alt={currentSlide.title}
            fill
            className="object-cover object-center"
            priority
          />
          {/* Subtle dark ambient gradients for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Top Glassmorphic Badge / Counter */}
      <div className="absolute top-6 left-6 z-20 flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 backdrop-blur-md shadow-lg">
          <Sparkles className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold text-white tracking-wide">
            LoopTani AI & Marketplace
          </span>
        </div>

        <div className="rounded-full border border-white/20 bg-black/30 px-3 py-1 text-xs font-mono font-medium text-white/90 backdrop-blur-md">
          0{currentIndex + 1} / 0{slides.length}
        </div>
      </div>

      {/* iPhone iOS-Style Glassmorphism Card Overlay */}
      <div className="absolute bottom-6 left-6 right-6 z-20">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentSlide.id}
            initial={{
              opacity: 0,
              y: direction === "next" ? 20 : -20,
              scale: 0.98,
            }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{
              opacity: 0,
              y: direction === "next" ? -20 : 20,
              scale: 0.98,
            }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className={cn(
              "relative overflow-hidden rounded-3xl p-5 sm:p-6 shadow-2xl",
              // iPhone Glassmorphism Styling:
              "border border-white/30 bg-white/15 dark:bg-black/30 backdrop-blur-xl",
              "before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-white/30 before:via-white/5 before:to-transparent before:pointer-events-none"
            )}
          >
            {/* Soft inner glow ring */}
            <div className="pointer-events-none absolute -inset-px rounded-3xl border border-white/20 shadow-[inset_0_0_15px_rgba(255,255,255,0.15)]" />

            <div className="relative z-10 space-y-2.5 sm:space-y-3">
              {/* Category Badge */}
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 border border-emerald-400/40 px-3 py-1 text-xs font-semibold text-emerald-300 backdrop-blur-sm">
                <IconComponent className="h-3.5 w-3.5" />
                <span>{currentSlide.badge}</span>
              </div>

              {/* Title */}
              <h2 className="text-lg font-bold tracking-tight text-white sm:text-2xl drop-shadow-sm leading-snug">
                {currentSlide.title}
              </h2>

              {/* Description */}
              <p className="text-xs sm:text-sm text-white/85 leading-relaxed max-w-lg font-normal">
                {currentSlide.description}
              </p>

              {/* Progress Indicator Dots */}
              <div className="pt-2 flex items-center gap-2">
                {slides.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setDirection(idx > currentIndex ? "next" : "prev");
                      setCurrentIndex(idx);
                    }}
                    aria-label={`Slide ${idx + 1}`}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300 cursor-pointer",
                      idx === currentIndex
                        ? "w-8 bg-emerald-400 shadow-md shadow-emerald-400/50"
                        : "w-2 bg-white/30 hover:bg-white/50"
                    )}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Manual Next / Prev Controls Notch */}
      <div className="absolute bottom-0 right-0 z-30 flex items-center gap-2 rounded-tl-[24px] bg-background px-4 py-3 shadow-lg">
        <button
          onClick={handlePrev}
          aria-label="Previous Slide"
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-secondary/80 text-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-200 active:scale-95 shadow-xs"
        >
          <ArrowLeft size={18} />
        </button>

        <button
          onClick={handleNext}
          aria-label="Next Slide"
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-secondary/80 text-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-200 active:scale-95 shadow-xs"
        >
          <ArrowRight size={18} />
        </button>

        {/* Inverted Corner SVG Cuts matching background */}
        <CutoutCorner className="absolute -left-[32px] bottom-[-1px] text-background pointer-events-none" />
        <CutoutCorner className="absolute top-[-32px] -right-[1px] text-background pointer-events-none" />
      </div>
    </div>
  );
}
