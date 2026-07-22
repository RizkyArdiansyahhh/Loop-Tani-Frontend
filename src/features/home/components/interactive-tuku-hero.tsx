"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "motion/react";
import {
  Sparkles,
  MessageSquare,
  ShoppingBag,
  Calculator,
  Truck,
  ArrowRight,
  X,
  CheckCircle2,
  PhoneCall,
  MapPin,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HotspotItem {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  icon: React.ElementType;
  xPct: number; // Horizontal position in %
  yPct: number; // Vertical position in %
  href?: string;
  isSpecialOjolTrigger?: boolean;
}

const HOTSPOTS: HotspotItem[] = [
  {
    id: "ai-loopi",
    title: "AI Loopi Consultant",
    subtitle: "Tanya penyakit tanaman & dosis pupuk instan 24/7",
    badge: "AI Assistant",
    icon: MessageSquare,
    xPct: 18,
    yPct: 28,
    href: "/loopi",
  },
  {
    id: "marketplace",
    title: "Marketplace Sirkular",
    subtitle: "Jual & beli limbah padi, sekam, dan hasil olahan",
    badge: "Jual Beli Tani",
    icon: ShoppingBag,
    xPct: 42,
    yPct: 18,
    href: "/marketplace",
  },
  {
    id: "calculator",
    title: "Kalkulator Dosis Pupuk",
    subtitle: "Hitung rekomendasi pupuk organik presisi lahan",
    badge: "Presisi Tani",
    icon: Calculator,
    xPct: 65,
    yPct: 26,
    href: "/fertilizer-calculator",
  },
  {
    id: "ojol-delivery",
    title: "Penjemputan Limbah Online",
    subtitle: "Pesan Kurir Tani (Ojol) langsung jemput limbah di sawah",
    badge: "Layanan Express",
    icon: Truck,
    xPct: 83,
    yPct: 35,
    isSpecialOjolTrigger: true,
  },
];

export function InteractiveTukuHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [isOjolOpen, setIsOjolOpen] = useState(false);

  // Motion values for smooth mouse tracking
  const rawX = useMotionValue(0);
  const smoothX = useSpring(rawX, { stiffness: 100, damping: 20 });
  const [facingDirection, setFacingDirection] = useState<1 | -1>(1); // 1 = right, -1 = left
  const [isMoving, setIsMoving] = useState(false);

  const lastXRef = useRef(0);
  const stopTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle mouse movement over container
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relativeX = e.clientX - rect.left;
    const containerWidth = rect.width;

    // Convert relative position to offset (-280px to +280px relative to center)
    const maxOffset = Math.min(containerWidth * 0.35, 320);
    const normalized = (relativeX / containerWidth) * 2 - 1; // -1 to 1
    const targetX = normalized * maxOffset;

    // Determine direction
    const delta = targetX - lastXRef.current;
    if (Math.abs(delta) > 0.5) {
      setFacingDirection(delta > 0 ? 1 : -1);
      setIsMoving(true);

      if (stopTimeoutRef.current) clearTimeout(stopTimeoutRef.current);
      stopTimeoutRef.current = setTimeout(() => {
        setIsMoving(false);
      }, 150);
    }

    lastXRef.current = targetX;
    rawX.set(targetX);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full h-[calc(100vh-100px)] min-h-[580px] max-h-[820px] overflow-hidden bg-gradient-to-b from-[#f3f9f2] via-[#e8f4e6] to-[#d4edd0] dark:from-slate-950 dark:via-emerald-950/30 dark:to-slate-950 select-none transition-colors duration-300"
    >
      {/* ── Ambient Background Lighting & Grid ── */}
      <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-emerald-400/20 blur-[120px] rounded-full pointer-events-none" />

      {/* ── Top Hero Heading Title Banner ── */}
      <div className="relative z-10 mx-auto max-w-4xl pt-8 px-4 text-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-white/60 dark:bg-black/40 px-4 py-1.5 backdrop-blur-md shadow-sm mb-4"
        >
          <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400 animate-spin-slow" />
          <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 tracking-wide uppercase">
            Ekosistem Pertanian Sirkular Interaktif
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-fraunces text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight"
        >
          Selamat Datang di <span className="text-emerald-600 dark:text-emerald-400">LoopTani</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium max-w-xl mx-auto leading-relaxed"
        >
          Gerakkan kursor Anda untuk menjelajahi garda terdepan pertanian sirkular. Klik pada titik fitur untuk memulai!
        </motion.p>
      </div>

      {/* ── Interactive Hotspot Headlines / Nodes ── */}
      <div className="absolute inset-0 z-20 pointer-events-auto">
        {HOTSPOTS.map((spot) => {
          const IconComp = spot.icon;
          const isActive = activeHotspot === spot.id;

          return (
            <div
              key={spot.id}
              style={{ left: `${spot.xPct}%`, top: `${spot.yPct}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group"
            >
              {/* Pulsing Target Node */}
              <button
                onClick={() => {
                  if (spot.isSpecialOjolTrigger) {
                    setIsOjolOpen(true);
                  } else {
                    setActiveHotspot(isActive ? null : spot.id);
                  }
                }}
                onMouseEnter={() => setActiveHotspot(spot.id)}
                className="relative flex items-center justify-center h-11 w-11 rounded-full bg-white dark:bg-slate-900 border-2 border-emerald-500 shadow-lg cursor-pointer transition-transform duration-300 hover:scale-110 active:scale-95"
                aria-label={spot.title}
              >
                {/* Aura pulses */}
                <span className="absolute -inset-2 rounded-full border border-emerald-400/60 animate-ping opacity-75" />
                <span className="absolute -inset-1 rounded-full bg-emerald-500/20 animate-pulse" />

                <IconComp className="h-5 w-5 text-emerald-600 dark:text-emerald-400 relative z-10" />
              </button>

              {/* Headline Label Tag */}
              <div className="absolute top-14 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <span className="rounded-full bg-slate-900/90 dark:bg-white/90 px-3 py-1 text-[11px] font-bold text-white dark:text-slate-900 shadow-md backdrop-blur-sm tracking-wide">
                  {spot.title}
                </span>
              </div>

              {/* Floating Info Card Dropdown on Hover/Active */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-22 left-1/2 -translate-x-1/2 w-64 rounded-2xl border border-white/40 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-4 shadow-2xl backdrop-blur-xl z-30 text-left"
                  >
                    <div className="inline-block rounded-md bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 mb-2">
                      {spot.badge}
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                      {spot.title}
                    </h4>

                    <p className="text-xs text-slate-600 dark:text-slate-300 mb-3 leading-snug">
                      {spot.subtitle}
                    </p>

                    {spot.isSpecialOjolTrigger ? (
                      <Button
                        size="sm"
                        onClick={() => setIsOjolOpen(true)}
                        className="w-full h-8 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg cursor-pointer"
                      >
                        Pesan Kurir Tani (Ojol)
                        <ArrowRight className="ml-1 h-3.5 w-3.5" />
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        asChild
                        className="w-full h-8 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg cursor-pointer"
                      >
                        <Link href={spot.href || "#"}>
                          Buka {spot.title}
                          <ArrowRight className="ml-1 h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* ── FRONTLINE MASCOT: Following Mouse Horizontal with Side Walk Animation ── */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
        {/* Soft Shadow below mascot */}
        <motion.div
          style={{ x: smoothX }}
          className="mx-auto h-5 w-40 rounded-full bg-slate-900/20 dark:bg-black/50 blur-md translate-y-36"
        />

        <motion.div
          style={{ x: smoothX }}
          animate={
            isMoving
              ? {
                  y: [0, -8, 0], // Walking bobbing motion
                  rotate: facingDirection === 1 ? [0, 2, -2, 0] : [0, -2, 2, 0],
                }
              : { y: [0, -4, 0] }
          }
          transition={
            isMoving
              ? { repeat: Infinity, duration: 0.35, ease: "easeInOut" }
              : { repeat: Infinity, duration: 2.5, ease: "easeInOut" }
          }
          className="relative h-64 sm:h-80 md:h-96 w-64 sm:w-80 md:w-96"
        >
          {/* Mascot Image with Horizontal Direction Flip */}
          <div
            style={{
              transform: `scaleX(${facingDirection})`,
              transition: "transform 0.25s ease-out",
            }}
            className="w-full h-full relative"
          >
            <Image
              src="/images/mascot-farmer.png"
              alt="LoopTani Farmer Mascot"
              fill
              className="object-contain object-bottom drop-shadow-xl"
              priority
            />
          </div>
        </motion.div>
      </div>

      {/* ── SLIDE-IN OJOL / KURIR TANI CHARACTER & MODAL DRAWER ── */}
      <AnimatePresence>
        {isOjolOpen && (
          <>
            {/* Dark Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOjolOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-100"
            />

            {/* Ojol Motorcycle Driver Character Sliding from Right */}
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
              className="fixed bottom-0 right-0 sm:right-12 md:right-24 z-110 w-72 sm:w-96 h-72 sm:h-96 pointer-events-none"
            >
              <Image
                src="/images/mascot-ojol.png"
                alt="Kurir Tani Ojol Delivery"
                fill
                className="object-contain object-bottom drop-shadow-2xl"
                priority
              />
            </motion.div>

            {/* Ojol Order Modal Card */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 150, damping: 22 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-120 w-[92vw] max-w-md rounded-3xl border border-white/30 bg-white/95 dark:bg-slate-900/95 dark:border-slate-800 p-6 shadow-2xl backdrop-blur-2xl text-left"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-md">
                    <Truck className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Kurir Tani Express (Ojol)
                    </h3>
                    <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      Layanan Penjemputan Limbah Online
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsOjolOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3.5 mb-6">
                <div className="flex items-start gap-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 p-3 border border-emerald-100 dark:border-emerald-900/30">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    Armada mitra Ojol & Truk Tani terdekat akan menjemput limbah sekam, jerami, atau kompos Anda langsung di titik lokasi sawah/gudang.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <Clock className="h-4 w-4 text-emerald-500" />
                    <span>Jemput &lt; 2 Jam</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <MapPin className="h-4 w-4 text-emerald-500" />
                    <span>Se-Nusantara</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                <Button
                  size="lg"
                  asChild
                  className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md cursor-pointer"
                >
                  <Link href="/marketplace" onClick={() => setIsOjolOpen(false)}>
                    <PhoneCall className="mr-2 h-4 w-4" />
                    Pesan Penjemputan Limbah Sekarang
                  </Link>
                </Button>

                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => setIsOjolOpen(false)}
                  className="w-full h-10 text-xs font-bold text-slate-600 dark:text-slate-400 cursor-pointer"
                >
                  Tutup
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
