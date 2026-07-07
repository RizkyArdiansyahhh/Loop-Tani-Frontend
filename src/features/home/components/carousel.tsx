"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const TICK = 50;

interface SlideItem {
  type: "video" | "image";
  src: string;
  duration: number;
  title: string;
  description: string;
  actionLink: string;
  actionText: string;
  secondaryLink?: string;
  secondaryText?: string;
  eyebrow: string;
}

const SLIDES: SlideItem[] = [
  {
    type: "video",
    src: "https://res.cloudinary.com/dy9gtwsh7/video/upload/v1783266018/5104194-uhd_3840_2160_30fps_oa3dpo.mp4",
    duration: 14000,
    eyebrow: "Sirkularitas Ekonomi Pertanian",
    title: "Siklus Lestari Pertanian Indonesia",
    description:
      "LoopTani menghubungkan limbah pertanian berkualitas tinggi dengan industri pengolahan untuk masa depan pangan berkelanjutan.",
    actionLink: "/marketplace",
    actionText: "Mulai Jelajah",
    secondaryLink: "/loopi",
    secondaryText: "Tanya Loopi AI",
  },
  {
    type: "image",
    src: "https://res.cloudinary.com/dy9gtwsh7/image/upload/v1783269526/karsten-bauche-dc3X_g5f28s-unsplash_wjrwjs.jpg",
    duration: 10000,
    eyebrow: "Pemberdayaan Agri-Limbah",
    title: "Ubah Limbah Pertanian Jadi Nilai Baru",
    description:
      "Jual ampas kopi, jerami padi, sekam, atau pupuk organik Anda langsung ke pembeli di marketplace LoopTani.",
    actionLink: "/marketplace",
    actionText: "Buka Marketplace",
  },
  {
    type: "image",
    src: "https://res.cloudinary.com/dy9gtwsh7/image/upload/v1770874698/banner-3_d4y8li.png",
    duration: 10000,
    eyebrow: "Pusat Edukasi Tani",
    title: "Edukasi Tani & Praktik Lapangan",
    description:
      "Ratusan panduan bertani, video demo olahan limbah, dan kumpulkan LoopPoints sebagai bentuk kontributor ilmu.",
    actionLink: "/panduan-tani",
    actionText: "Lihat Panduan",
  },
  {
    type: "image",
    src: "https://res.cloudinary.com/dy9gtwsh7/image/upload/v1770874687/banner-1_t5bjir.jpg",
    duration: 10000,
    eyebrow: "Sustainability Metrics",
    title: "Jejak Hijau Setiap Transaksi",
    description:
      "Transparan melacak emisi CO₂ yang dikurangi, air tanah dilindungi, dan ekspor laporan CSR dengan mudah di LoopTani.",
    actionLink: "/jejak-lestari",
    actionText: "Lihat Dampak Anda",
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
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute inset-0 h-full w-full"
        >
          {/* Main Media (Video or Image) */}
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

          {/* Premium Mesh Gradient Overlay */}
          <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-transparent md:from-black/75 md:via-black/35" />

          {/* Interactive Text Overlay Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="mx-auto max-w-7xl px-6 sm:px-8 w-full">
              <div className="max-w-2xl space-y-4 md:space-y-6">
                
                {/* Eyebrow */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.4 }}
                  className="inline-flex items-center gap-2 rounded-full bg-primary/20 border border-primary/20 px-3.5 py-1.5 backdrop-blur-xs"
                >
                  <span className="text-xs font-bold uppercase tracking-wider text-primary-foreground">
                    {currentSlide.eyebrow}
                  </span>
                </motion.div>

                {/* Animated Heading (Fraunces serif) */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.5 }}
                  className="font-fraunces text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.1]"
                >
                  {currentSlide.title}
                </motion.h2>

                {/* Animated Description (Plus Jakarta Sans) */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.5 }}
                  className="font-sans text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed max-w-xl"
                >
                  {currentSlide.description}
                </motion.p>

                {/* Animated Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45, duration: 0.5 }}
                  className="flex flex-wrap items-center gap-3 pt-2"
                >
                  <Button size="lg" asChild className="rounded-full font-semibold px-8 py-6">
                    <Link href={currentSlide.actionLink}>{currentSlide.actionText}</Link>
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

              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Progress Dots Nav */}
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
