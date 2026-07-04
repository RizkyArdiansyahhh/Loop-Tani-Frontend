"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";

const SLIDES = [
  "https://res.cloudinary.com/dy9gtwsh7/image/upload/v1770874692/banner-2_hzumlx.jpg",
  "https://res.cloudinary.com/dy9gtwsh7/image/upload/v1770874698/banner-3_d4y8li.png",
  "https://res.cloudinary.com/dy9gtwsh7/image/upload/v1770874687/banner-1_t5bjir.jpg",
];

const DURATION = 5000;
const TICK = 50;

export const CarouselHomePage = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  /* PROGRESS */
  useEffect(() => {
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + (TICK / DURATION) * 100, 100));
    }, TICK);

    const slideTimeout = setTimeout(() => {
      setActiveIndex((i) => (i + 1) % SLIDES.length);
    }, DURATION);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(slideTimeout);
    };
  }, [activeIndex]);

  return (
    <section className="relative h-full w-full overflow-hidden bg-foreground">
      <AnimatePresence>
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={SLIDES[activeIndex]}
            fill
            alt="hero-banner"
            className="object-cover"
            priority
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
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

export const DotProgress = ({ active, progress }: DotProgressProps) => {
  const radius = 8;
  const stroke = 2;
  const normalizedRadius = radius - stroke * 0.5;
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
        <circle fill="white" r={normalizedRadius} cx={radius} cy={radius} />
      )}

      {active && (
        <>
          <circle
            stroke="rgba(255,255,255,0.25)"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />

          <circle
            stroke="white"
            fill="transparent"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="transition-[stroke-dashoffset] duration-75 ease-linear"
          />
        </>
      )}
    </svg>
  );
};
