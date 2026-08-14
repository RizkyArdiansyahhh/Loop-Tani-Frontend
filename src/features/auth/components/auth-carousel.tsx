"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useAnimationControls,
  type Variants,
} from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SlideData {
  id: number;
  image: string;
  title: string;
  description: string;
}

const slides: SlideData[] = [
  {
    id: 1,
    image:
      "https://res.cloudinary.com/aexisrpt/image/upload/v1786718578/pexels-bayusamudro-9487664.jpg",
    title: "Hubungkan Petani & Pembeli Langsung",
    description:
      "Jual beli limbah pertanian, produk olahan organik, dan alat tani secara transparan tanpa perantara.",
  },
  {
    id: 2,
    image:
      "https://res.cloudinary.com/aexisrpt/image/upload/v1786718583/edward-howell-v7G32kVgM84-unsplash.jpg",
    title: "Analisis Nilai Limbah & AI Loopi",
    description:
      "Optimalkan potensi limbah pertanian Anda secara instan menggunakan pemrosesan gambar AI dan asisten pintar Loopi.",
  },
  {
    id: 3,
    image:
      "https://res.cloudinary.com/aexisrpt/image/upload/v1786718597/ivan-bandura-nvuemQpMBes-unsplash.jpg",
    title: "Dukung Pertanian Sirkular Berkelanjutan",
    description:
      "Ubah limbah menjadi nilai ekonomi baru, tingkatkan kesuburan tanah, dan pantau jejak kelestarian lingkungan.",
  },
];

const AUTOPLAY_DURATION_MS = 10000;

// Reusable animation variants
const imageVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.5, ease: "easeInOut" },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.5, ease: "easeInOut" },
  },
};

const textContainerVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.08,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

const titleVariants: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.3,
      ease: "easeIn",
    },
  },
};

const descriptionVariants: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.25,
      ease: "easeIn",
    },
  },
};

interface AuthCarouselProps {
  className?: string;
}

export function AuthCarousel({ className }: AuthCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentSlide = useMemo(() => slides[currentIndex], [currentIndex]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  const handleSelect = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Synchronized Autoplay controls
  const startAutoplay = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      handleNext();
    }, AUTOPLAY_DURATION_MS);
  }, [handleNext]);

  // Pause autoplay on hover
  const pauseAutoplay = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }, []);

  useEffect(() => {
    if (!isHovered) {
      startAutoplay();
    } else {
      pauseAutoplay();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [currentIndex, isHovered, startAutoplay, pauseAutoplay]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative h-full w-full overflow-hidden rounded-3xl bg-slate-950 shadow-xl select-none flex flex-col justify-end p-6 sm:p-8",
        className,
      )}
    >
      {/* Background Image Carousel with Cinematic Crossfade & Subtle Ken Burns Zoom */}
      <AnimatePresence initial={false}>
        <motion.div
          key={currentSlide.id}
          variants={imageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="absolute inset-0 h-full w-full pointer-events-none"
        >
          <Image
            src={currentSlide.image}
            alt={currentSlide.title}
            fill
            className="object-cover object-center"
            priority
            unoptimized
          />
          {/* Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-slate-950/10" />
        </motion.div>
      </AnimatePresence>

      {/* BOTTOM SECTION: Staggered Text & Controls */}
      <div className="relative z-10 w-full space-y-5">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentSlide.id}
            variants={textContainerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-2 max-w-xl"
          >
            {/* Title (y: 16 -> 0) */}
            <motion.h2
              variants={titleVariants}
              className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-snug"
            >
              {currentSlide.title}
            </motion.h2>

            {/* Description (y: 12 -> 0) */}
            <motion.p
              variants={descriptionVariants}
              className="text-sm text-slate-300/90 leading-relaxed font-normal"
            >
              {currentSlide.description}
            </motion.p>
          </motion.div>
        </AnimatePresence>

        {/* Bottom Bar: Progress (Bottom-Left) & Prev/Next (Bottom-Right) */}
        <div className="flex items-center justify-between pt-2 gap-4">
          {/* Bottom Left: Premium Smooth Expanding Progress Indicators */}
          <div className="flex items-center gap-2">
            {slides.map((s, idx) => {
              const isActive = idx === currentIndex;
              const isPast = idx < currentIndex;

              return (
                <motion.button
                  key={s.id}
                  layout
                  onClick={() => handleSelect(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  transition={{
                    layout: {
                      duration: 0.35,
                      ease: [0.22, 1, 0.36, 1],
                    },
                  }}
                  animate={{
                    width: isActive ? 40 : 10,
                  }}
                  className="relative h-2.5 overflow-hidden rounded-full bg-white/20 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                >
                  {isActive ? (
                    <motion.div
                      key={`progress-${currentIndex}`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: isHovered ? undefined : 1 }}
                      transition={{
                        duration: AUTOPLAY_DURATION_MS / 1000,
                        ease: "linear",
                      }}
                      className="h-full w-full origin-left rounded-full bg-white"
                    />
                  ) : (
                    <motion.div
                      initial={false}
                      animate={{
                        opacity: isPast ? 0.8 : 0,
                      }}
                      transition={{ duration: 0.25 }}
                      className="h-full w-full rounded-full bg-white"
                    />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Bottom Right: Prev / Next Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <motion.button
              onClick={handlePrev}
              aria-label="Previous Slide"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.92 }}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-xs transition-colors hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              <ArrowLeft size={16} />
            </motion.button>
            <motion.button
              onClick={handleNext}
              aria-label="Next Slide"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.92 }}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-xs transition-colors hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              <ArrowRight size={16} />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
