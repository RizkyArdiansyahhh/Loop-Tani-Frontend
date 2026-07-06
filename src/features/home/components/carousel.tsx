"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";

const TICK = 50;

const SLIDES = [
  {
    type: "video",
    src: "https://res.cloudinary.com/dy9gtwsh7/video/upload/v1783266018/5104194-uhd_3840_2160_30fps_oa3dpo.mp4",
    duration: 14000,
  },
  {
    type: "image",
    src: "https://res.cloudinary.com/dy9gtwsh7/image/upload/v1783269526/karsten-bauche-dc3X_g5f28s-unsplash_wjrwjs.jpg",
    duration: 10000,
  },
  {
    type: "image",
    src: "https://res.cloudinary.com/dy9gtwsh7/image/upload/v1770874698/banner-3_d4y8li.png",
    duration: 10000,
  },
  {
    type: "image",
    src: "https://res.cloudinary.com/dy9gtwsh7/image/upload/v1770874687/banner-1_t5bjir.jpg",
    duration: 10000,
  },
];

export const CarouselHomePage = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentSlide = SLIDES[activeIndex];
  const duration = currentSlide.duration;

  useEffect(() => {
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + (TICK / duration) * 100, 100));
    }, TICK);

    timeoutRef.current = setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % SLIDES.length);
    }, duration);

    return () => {
      clearInterval(progressInterval);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [activeIndex, duration]);

  return (
    <section className="relative h-full w-full overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          {currentSlide.type === "image" ? (
            <Image
              src={currentSlide.src}
              alt="hero-banner"
              fill
              className="object-cover"
              priority
            />
          ) : (
            <video
              src={currentSlide.src}
              autoPlay
              muted
              playsInline
              className="h-full w-full object-cover"
              onEnded={() =>
                setActiveIndex((prev) => (prev + 1) % SLIDES.length)
              }
            />
          )}
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 gap-3">
        {SLIDES.map((_, index) => (
          <button key={index} onClick={() => setActiveIndex(index)}>
            <DotProgress
              active={index === activeIndex}
              progress={index === activeIndex ? progress : 0}
            />
          </button>
        ))}
      </div>
    </section>
  );
};

type DotProgressProps = {
  active: boolean;
  progress: number;
};

function DotProgress({ active, progress }: DotProgressProps) {
  const radius = 8;
  const stroke = 2;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <svg
      width={radius * 2}
      height={radius * 2}
      className={clsx(
        "transition-all duration-300",
        active ? "scale-110" : "opacity-80",
      )}
    >
      {!active && (
        <circle fill="white" cx={radius} cy={radius} r={normalizedRadius} />
      )}

      {active && (
        <>
          <circle
            stroke="rgba(255,255,255,.25)"
            fill="transparent"
            strokeWidth={stroke}
            cx={radius}
            cy={radius}
            r={normalizedRadius}
          />

          <circle
            stroke="white"
            fill="transparent"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            cx={radius}
            cy={radius}
            r={normalizedRadius}
            className="transition-[stroke-dashoffset] duration-75 ease-linear"
          />
        </>
      )}
    </svg>
  );
}
