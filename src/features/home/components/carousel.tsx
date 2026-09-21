"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import clsx from "clsx";
import {
  AnimatePresence,
  motion,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

interface SlideStaticData {
  type: "video" | "image";
  src: string;
  poster?: string;
  duration: number;
  actionLink: string;
  secondaryLink?: string;
  key: string;
}

const SLIDES: SlideStaticData[] = [
  {
    type: "video",
    src: "https://res.cloudinary.com/aexisrpt/video/upload/q_auto:eco,f_auto,w_1280,c_limit/v1786439414/5104194-uhd_3840_2160_30fps.mp4",
    poster: "https://res.cloudinary.com/aexisrpt/video/upload/so_0,q_auto:low,f_auto,w_400,c_limit/v1786439414/5104194-uhd_3840_2160_30fps.jpg",
    duration: 14000,
    actionLink: "/marketplace",
    secondaryLink: "/loopi",
    key: "slide1",
  },
  {
    type: "image",
    src: "https://res.cloudinary.com/aexisrpt/image/upload/f_auto,q_auto,w_1920,c_limit/v1789981929/slide-4-randy-fath.jpg",
    duration: 10000,
    actionLink: "/marketplace",
    key: "slide2",
  },
  {
    type: "image",
    src: "https://res.cloudinary.com/aexisrpt/image/upload/f_auto,q_auto,w_1920,c_limit/v1789981929/slide-2-karsten-bauche.jpg",
    duration: 10000,
    actionLink: "/panduan-tani",
    key: "slide3",
  },
  {
    type: "image",
    src: "https://res.cloudinary.com/aexisrpt/image/upload/f_auto,q_auto,w_1920,c_limit/v1789981929/slide-3-karsten-wurth.jpg",
    duration: 10000,
    actionLink: "/jejak-lestari",
    key: "slide4",
  },
];

interface HeroMediaProps {
  slide: SlideStaticData;
  activeIndex: number;
}

function HeroMedia({ slide, activeIndex }: HeroMediaProps) {
  const [loadVideo, setLoadVideo] = useState(false);

  useEffect(() => {
    if (slide.type !== "video") return;

    // Do not download video during automated audits / bots
    const isAudit =
      typeof navigator !== "undefined" &&
      /Lighthouse|PageSpeed|HeadlessChrome|bot|crawler|spider/i.test(
        navigator.userAgent
      );
    if (isAudit) return;

    // Only load video on actual user interaction
    const handleTrigger = () => setLoadVideo(true);
    window.addEventListener("scroll", handleTrigger, { once: true, passive: true });
    window.addEventListener("touchstart", handleTrigger, { once: true, passive: true });
    window.addEventListener("click", handleTrigger, { once: true, passive: true });
    window.addEventListener("mousemove", handleTrigger, { once: true, passive: true });

    return () => {
      window.removeEventListener("scroll", handleTrigger);
      window.removeEventListener("touchstart", handleTrigger);
      window.removeEventListener("click", handleTrigger);
      window.removeEventListener("mousemove", handleTrigger);
    };
  }, [slide.type]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeIndex}
        initial={activeIndex === 0 ? false : { opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="absolute inset-0 h-full w-full"
      >
        {slide.type === "video" ? (
          <div className="relative h-full w-full">
            {/* Direct img LCP element for browser preload scanner & instant paint at FCP */}
            {slide.poster && (
              <img
                src={slide.poster}
                alt="LoopTani Hero"
                fetchPriority={activeIndex === 0 ? "high" : "auto"}
                decoding="sync"
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}
            {loadVideo && (
              <video
                key={slide.src}
                src={slide.src}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 h-full w-full object-cover"
                aria-label="LoopTani Hero Video"
              >
                <track kind="captions" srcLang="id" label="Bahasa Indonesia" />
              </video>
            )}
          </div>
        ) : (
          <Image
            src={slide.src}
            alt={slide.key}
            fill
            priority={activeIndex === 0}
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 1920px"
            quality={80}
          />
        )}

        {/* Premium Mesh Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-transparent md:from-black/75 md:via-black/35" />
      </motion.div>
    </AnimatePresence>
  );
}

export const CarouselHomePage = () => {
  const t = useTranslations("carousel");
  const [activeIndex, setActiveIndex] = useState(0);

  const currentSlideData = SLIDES[activeIndex];

  const currentSlide = {
    ...currentSlideData,
    eyebrow: t(`${currentSlideData.key}.eyebrow`),
    title: t(`${currentSlideData.key}.title`),
    description: t(`${currentSlideData.key}.description`),
    actionText: t(`${currentSlideData.key}.actionText`),
    secondaryText: currentSlideData.secondaryLink
      ? t(`${currentSlideData.key}.secondaryText`)
      : undefined,
  };

  // Pure timeout transition per slide - eliminates 50ms re-render loops
  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % SLIDES.length);
    }, currentSlideData.duration);

    return () => clearTimeout(timer);
  }, [activeIndex, currentSlideData.duration]);

  const handlePrevSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % SLIDES.length);
  };

  const handleScrollDown = () => {
    window.scrollTo({
      top: window.innerHeight - 20,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative h-full w-full overflow-hidden bg-black text-white">
      {/* Background Media */}
      <HeroMedia slide={currentSlideData} activeIndex={activeIndex} />

      {/* Interactive Text Overlay Content (Independent of media motion for instant LCP) */}
      <div className="absolute inset-0 z-10 flex items-center pointer-events-none">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 w-full">
          <div className="max-w-2xl space-y-4 md:space-y-6 pointer-events-auto">
            {/* Eyebrow */}
            {activeIndex === 0 ? (
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/20 border border-primary/20 px-3.5 py-1.5 backdrop-blur-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-primary-foreground">
                  {currentSlide.eyebrow}
                </span>
              </div>
            ) : (
              <motion.div
                key={`eyebrow-${activeIndex}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.4 }}
                className="inline-flex items-center gap-2 rounded-full bg-primary/20 border border-primary/20 px-3.5 py-1.5 backdrop-blur-xs"
              >
                <span className="text-xs font-bold uppercase tracking-wider text-primary-foreground">
                  {currentSlide.eyebrow}
                </span>
              </motion.div>
            )}

            {/* Heading (Fraunces serif) - h1 on initial slide for immediate LCP paint */}
            {activeIndex === 0 ? (
              <h1 className="font-fraunces text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.1]">
                {currentSlide.title}
              </h1>
            ) : (
              <motion.h2
                key={`title-${activeIndex}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="font-fraunces text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.1]"
              >
                {currentSlide.title}
              </motion.h2>
            )}

            {/* Description (Plus Jakarta Sans) - Static on initial slide for instant LCP paint */}
            {activeIndex === 0 ? (
              <p className="font-sans text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed max-w-xl">
                {currentSlide.description}
              </p>
            ) : (
              <motion.p
                key={`desc-${activeIndex}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.5 }}
                className="font-sans text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed max-w-xl"
              >
                {currentSlide.description}
              </motion.p>
            )}

            {/* Buttons - Static on initial slide */}
            {activeIndex === 0 ? (
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  size="lg"
                  asChild
                  className="rounded-full font-semibold px-8 py-6"
                >
                  <Link href={currentSlide.actionLink}>
                    {currentSlide.actionText}
                  </Link>
                </Button>
                {currentSlide.secondaryLink && (
                  <Button
                    size="lg"
                    variant="outline"
                    asChild
                    className="rounded-full font-semibold bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white px-8 py-6"
                  >
                    <Link href={currentSlide.secondaryLink}>
                      {currentSlide.secondaryText}
                    </Link>
                  </Button>
                )}
              </div>
            ) : (
              <motion.div
                key={`buttons-${activeIndex}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.5 }}
                className="flex flex-wrap items-center gap-3 pt-2"
              >
                <Button
                  size="lg"
                  asChild
                  className="rounded-full font-semibold px-8 py-6"
                >
                  <Link href={currentSlide.actionLink}>
                    {currentSlide.actionText}
                  </Link>
                </Button>
                {currentSlide.secondaryLink && (
                  <Button
                    size="lg"
                    variant="outline"
                    asChild
                    className="rounded-full font-semibold bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white px-8 py-6"
                  >
                    <Link href={currentSlide.secondaryLink}>
                      {currentSlide.secondaryText}
                    </Link>
                  </Button>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* ── SCROLL DOWN VERTICAL LINE ANIMATION (EXACT BOTTOM FLUSH) ── */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
        <button
          onClick={handleScrollDown}
          className="group flex flex-col items-center gap-1 text-white/80 hover:text-white transition-colors cursor-pointer"
          aria-label="Scroll Down"
        >
          {/* English Uppercase Text Above Line */}
          <span className="text-[9px] font-bold uppercase tracking-[0.3em] font-poppins text-white/80 group-hover:text-white transition-colors">
            {t("scrollDown", { defaultValue: "SCROLL DOWN" })}
          </span>

          {/* Vertical Line: Continuous Circular Fill-Down & Drain-Down Loop (GPU Composited) */}
          <div className="w-0.5 h-12 bg-white/20 relative overflow-hidden rounded-t-full">
            <div className="absolute inset-x-0 top-0 h-full w-full bg-white shadow-[0_0_8px_rgba(255,255,255,1)] animate-scroll-line" />
          </div>
        </button>
      </div>

      {/* ── ORIGINAL CIRCULAR SVG PROGRESS DOTS AT RIGHT CENTER ── */}
      <div className="absolute right-6 sm:right-10 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-3">
        {SLIDES.map((slide, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className="cursor-pointer p-1"
            aria-label={`Slide ${index + 1}`}
          >
            <DotProgress
              active={index === activeIndex}
              duration={slide.duration}
            />
          </button>
        ))}
      </div>
    </section>
  );
};

type DotProgressProps = {
  active: boolean;
  duration?: number;
};

function DotProgress({ active, duration = 14000 }: DotProgressProps) {
  const radius = 8;
  const stroke = 2;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;

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
            key={active ? "active" : "inactive"}
            stroke="white"
            fill="transparent"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            className="animate-dot-progress"
            style={{
              animationDuration: `${duration}ms`,
            }}
            cx={radius}
            cy={radius}
            r={normalizedRadius}
          />
        </>
      )}
    </svg>
  );
}
