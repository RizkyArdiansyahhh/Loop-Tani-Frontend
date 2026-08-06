"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  MessageSquare,
  BookOpen,
  Leaf,
  ArrowRight,
  Recycle,
  DollarSign,
  Cpu,
  Wind,
  Droplets,
  Users,
  TrendingUp,
  Award,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  ChevronLeft,
  Compass,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CarouselHomePage } from "../components/carousel";
import { Button } from "@/components/ui/button";
import { ScrollFeaturesSection } from "../components/scroll-features";
import { FaqSection } from "../components/faq-section";
import { SingleVelocityBanner } from "../components/single-velocity-banner";
import { FullWidthVideoSection } from "../components/fullwidth-video-section";
import { FeaturedSolutionSection } from "../components/featured-solution-section";
import { FamousQuoteSection } from "../components/famous-quote-section";
import { MovementImpactSection } from "../components/movement-impact-section";

const HomePage = () => {
  const [activeTab, setActiveTab] = useState<
    "marketplace" | "ai" | "edukasi" | "lestari"
  >("marketplace");

  // Longines-style Ultra-Smooth Snap Scroll with requestAnimationFrame & easeOutQuart easing
  useEffect(() => {
    let isSnapping = false;
    let lastScrollY = window.scrollY;

    const smoothScrollTo = (targetY: number, duration = 1500) => {
      const startY = window.scrollY;
      const distance = targetY - startY;
      const startTime = performance.now();

      const step = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Gentle easeInOutCubic curve for slow, luxurious Swiss movement
        const ease =
          progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        window.scrollTo(0, startY + distance * ease);

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          setTimeout(() => {
            isSnapping = false;
          }, 300);
        }
      };

      requestAnimationFrame(step);
    };

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight;
      const isScrollingDown = scrollY > lastScrollY;
      lastScrollY = scrollY;

      if (
        !isSnapping &&
        isScrollingDown &&
        scrollY > 15 &&
        scrollY < heroHeight * 0.75
      ) {
        isSnapping = true;
        smoothScrollTo(heroHeight - 20, 950);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const luxuryCollections = [
    {
      id: 1,
      subtitle: "Koleksi Limbah Utama",
      name: "Sekam Padi Kering Murni",
      price: "Rp 1.200 / kg",
      image: "/images/auth-carousel-1.jpg",
      location: "Sragen, Jawa Tengah",
      tag: "Grade A",
      link: "/marketplace/agricultural-waste/rice-husk",
    },
    {
      id: 2,
      subtitle: "Formula Pupuk Organik",
      name: "Pupuk Kompos Granul Terverifikasi",
      price: "Rp 4.500 / kg",
      image: "/images/auth-carousel-2.jpg",
      location: "Sleman, DIY",
      tag: "Organik Sertifikasi",
      link: "/marketplace/processed-products/compost",
    },
    {
      id: 3,
      subtitle: "Inovasi Biochar",
      name: "Biochar Arang Sekam Penjaga Air",
      price: "Rp 6.000 / kg",
      image: "/images/auth-carousel-3.jpg",
      location: "Subang, Jawa Barat",
      tag: "Karbon Netral",
      link: "/marketplace/processed-products/briquettes",
    },
    {
      id: 4,
      subtitle: "Alat Tani Presisi",
      name: "Traktor Tangan Kubota Quick 2021",
      price: "Rp 12.500.000",
      image: "/images/auth-carousel-1.jpg",
      location: "Karawang, Jawa Barat",
      tag: "Terawat Sempurna",
      link: "/marketplace/equipment/tractors",
    },
  ];

  const features = {
    marketplace: {
      title: "Marketplace Sirkular Presisi",
      badge: "Marketplace",
      description:
        "Jelajahi pilihan limbah pertanian pilihan bersertifikasi atau hubungkan sisa panen Anda secara eksklusif ke produsen industri olahan.",
      cta: "Eksplor Katalog",
      link: "/marketplace",
      mockup: (
        <div className="space-y-4 font-sans text-left">
          <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
            <span className="text-xs font-bold text-foreground font-poppins uppercase tracking-wider">
              Katalog Limbah Terpopuler
            </span>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold flex items-center gap-0.5 cursor-pointer hover:underline">
              Lihat Selengkapnya <ChevronRight className="h-3 w-3" />
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                name: "Sekam Padi Kering",
                price: "Rp 1.200 / kg",
                location: "Sragen, Jateng",
                label: "Limbah",
              },
              {
                name: "Pupuk Kompos Organik",
                price: "Rp 4.500 / kg",
                location: "Sleman, DIY",
                label: "Olahan",
              },
            ].map((prod, i) => (
              <div
                key={i}
                className="border border-amber-500/20 rounded-xl p-3 bg-card space-y-2 text-left hover:border-amber-500/40 transition-colors shadow-xs"
              >
                <div className="h-20 bg-muted/40 rounded-lg flex items-center justify-center text-xs font-bold text-muted-foreground font-fraunces">
                  {prod.name}
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                    {prod.label}
                  </span>
                  <h4 className="text-xs font-bold text-foreground truncate pt-1 font-poppins">
                    {prod.name}
                  </h4>
                  <p className="text-[10px] font-black text-amber-700 dark:text-amber-400 font-poppins">
                    {prod.price}
                  </p>
                  <p className="text-[8px] text-muted-foreground">
                    {prod.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    ai: {
      title: "AI Loopi Consultant",
      badge: "Kecerdasan Buatan",
      description:
        "Dapatkan analisis presisi penyakit tanaman, formulasi takaran kompos organik, hingga kalkulasi estimasi nilai ekonomis limbah Anda.",
      cta: "Konsultasi AI Sekarang",
      link: "/loopi",
      mockup: (
        <div className="space-y-3.5 flex flex-col h-full justify-between text-left font-sans">
          <div className="space-y-2.5">
            <div className="flex gap-2.5 items-start">
              <div className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center font-bold text-xs shrink-0 border border-border/50">
                👤
              </div>
              <div className="bg-secondary/40 border border-border/50 rounded-xl rounded-tl-none p-2.5 text-[11px] text-foreground leading-relaxed">
                Bagaimana formula terbaik mengolah jerami padi sisa panen?
              </div>
            </div>
            <div className="flex gap-2.5 items-start">
              <div className="h-7 w-7 rounded-full bg-amber-700 text-white flex items-center justify-center font-bold text-xs shrink-0 select-none shadow-xs">
                🌿
              </div>
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl rounded-tl-none p-3 text-[11px] text-foreground leading-relaxed space-y-1">
                <p className="font-bold text-amber-700 dark:text-amber-400 font-poppins">
                  Rekomendasi Loopi AI:
                </p>
                <p>
                  1. **Kompos Granul**: Fermentasikan dengan starter hayati.
                </p>
                <p>2. **Biomassa**: Potensi pasar Rp 1.500/kg di LoopTani.</p>
              </div>
            </div>
          </div>
          <div className="relative pt-2">
            <div className="h-9 border border-amber-500/20 rounded-xl bg-card flex items-center px-3 text-[10px] text-muted-foreground justify-between shadow-2xs">
              Tanyakan formula kompos sekam...
              <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 cursor-pointer hover:underline">
                Kirim
              </span>
            </div>
          </div>
        </div>
      ),
    },
    edukasi: {
      title: "Modul Edukasi Sirkular",
      badge: "Edukasi Tani",
      description:
        "Pelajari ratusan panduan terverifikasi pakar agrikultur, tonton tutorial pembuatan pupuk organik, dan peroleh reward LoopPoints.",
      cta: "Buka Panduan Tani",
      link: "/panduan-tani",
      mockup: (
        <div className="space-y-4 text-left font-sans">
          <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
            <span className="text-xs font-bold text-foreground font-poppins">
              Modul Edukasi Utama
            </span>
            <span className="text-[9px] font-bold text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              Reward +100 LP
            </span>
          </div>
          <div className="space-y-2.5">
            {[
              {
                title:
                  "Panduan Pembuatan Pupuk Kompos Cair dari Bonggol Pisang",
                readTime: "5 menit",
                points: "+50 LP",
              },
              {
                title:
                  "Pemanfaatan Sekam Padi Menjadi Biochar Penjaga Air Tanah",
                readTime: "8 menit",
                points: "+80 LP",
              },
            ].map((modul, i) => (
              <div
                key={i}
                className="flex items-center justify-between border border-amber-500/20 rounded-xl p-3 bg-card hover:bg-amber-500/5 cursor-pointer transition-colors shadow-xs"
              >
                <div className="flex gap-3 items-center text-left">
                  <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center font-bold text-xs text-amber-700 dark:text-amber-400 shrink-0 select-none">
                    📖
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-foreground truncate max-w-[220px] font-poppins">
                      {modul.title}
                    </h4>
                    <span className="text-[10px] text-muted-foreground">
                      {modul.readTime} membaca
                    </span>
                  </div>
                </div>
                <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-0 font-extrabold text-[10px]">
                  {modul.points}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    lestari: {
      title: "Laporan Dampak Jejak Lestari",
      badge: "Laporan ESG",
      description:
        "Pantau dan laporkan secara transparan reduksi emisi karbon (CO₂) serta jumlah air tanah yang berhasil diselamatkan dari daur ulang limbah.",
      cta: "Lihat Laporan ESG",
      link: "/jejak-lestari",
      mockup: (
        <div className="space-y-4 text-left font-sans">
          <div className="grid grid-cols-2 gap-3">
            <div className="border border-amber-500/20 rounded-xl p-3 bg-card shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground block uppercase font-poppins">
                CO₂ Dicegah
              </span>
              <span className="text-lg font-black text-amber-700 dark:text-amber-400 font-fraunces">
                15.420 Kg
              </span>
              <p className="text-[9px] text-muted-foreground leading-none">
                Setara 5.930 pohon
              </p>
            </div>
            <div className="border border-amber-500/20 rounded-xl p-3 bg-card shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground block uppercase font-poppins">
                Air Dilindungi
              </span>
              <span className="text-lg font-black text-sky-500 font-fraunces">
                84.200 Liter
              </span>
              <p className="text-[9px] text-muted-foreground leading-none">
                Bebas nitrat kimia
              </p>
            </div>
          </div>
          <div className="border border-amber-500/20 bg-amber-500/5 rounded-xl p-3 text-left space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] text-amber-700 dark:text-amber-400 font-bold font-poppins">
              <ShieldCheck className="h-4 w-4" />
              Sertifikat Keberlanjutan Sirkular
            </div>
            <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-amber-600 dark:bg-amber-400 w-[75%] rounded-full" />
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Komunitas Anda telah mencapai 75% target reduksi emisi karbon
              kuartal ini.
            </p>
          </div>
        </div>
      ),
    },
  };

  return (
    <main className="w-full bg-background text-foreground relative transition-colors duration-300 font-sans">
      {/* ── LONGINES STYLE HERO CAROUSEL (STICKY OVERLAP BACKGROUND) ── */}
      <div className="sticky top-0 w-full h-screen z-0">
        <CarouselHomePage />
      </div>

      {/* ── OVERLAPPING CONTENT SHEET (SLIDES OVER CAROUSEL ON SCROLL) ── */}
      <div className="relative z-10 bg-background rounded-none border-t border-amber-500/30 shadow-[0_-20px_50px_rgba(0,0,0,0.2)]">
        {/* ── TOP HERO STATEMENT (SHORT QUESTION BADGE & LONGER HEADLINE) ── */}
        <section className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 py-20 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Short Question Text with Underline */}
            <div className="lg:col-span-4 pt-2 text-left">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider font-poppins text-foreground border-b-2 border-primary pb-1.5 inline-block">
                Mengapa LoopTani?
              </span>
            </div>

            {/* Right Column: Longer Headline */}
            <div className="lg:col-span-8 text-left">
              <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-[1.18]">
                Mendedikasikan presisi & inovasi teknologi AI untuk
                mentransformasi limbah pertanian menjadi nilai sirkular
                berkelanjutan.
              </h1>
            </div>
          </div>
        </section>

        {/* ── SINGLE ROW VELOCITY SCROLL BANNER ── */}
        <SingleVelocityBanner />

        {/* ── LONGINES STYLE MASTER COLLECTIONS ("KOLEKSI UNGGULAN") ── */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24 border-t border-border/50">
          <div className="flex items-end justify-between mb-12">
            <div className="space-y-1 text-left">
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest font-poppins">
                Standard Penjualan Terverifikasi
              </span>
              <h2 className="font-fraunces text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                Koleksi Unggulan LoopTani
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-amber-500/30 h-10 w-10 hover:bg-secondary cursor-pointer"
                aria-label="Previous"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-amber-500/30 h-10 w-10 hover:bg-secondary cursor-pointer"
                aria-label="Next"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Longines Style Luxury Product Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {luxuryCollections.map((prod) => (
              <Link
                key={prod.id}
                href={prod.link}
                className="group flex flex-col justify-between bg-card border border-amber-500/20 rounded-2xl overflow-hidden hover:border-amber-500/60 hover:shadow-2xl transition-all duration-500 text-left"
              >
                <div className="relative h-72 w-full overflow-hidden bg-muted/20">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="h-full w-full object-cover group-hover:scale-108 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  <span className="absolute top-4 left-4 bg-background/90 backdrop-blur-md text-foreground font-bold text-[9px] uppercase px-3 py-1 rounded-full border border-amber-500/30 font-poppins tracking-wider">
                    {prod.tag}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest font-poppins">
                      {prod.subtitle}
                    </p>
                    <h3 className="font-fraunces text-lg font-bold text-foreground group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors line-clamp-1">
                      {prod.name}
                    </h3>
                    <p className="text-[11px] text-muted-foreground">
                      {prod.location}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-amber-500/15">
                    <span className="font-fraunces text-base font-bold text-foreground">
                      {prod.price}
                    </span>
                    <span className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Beli <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── DEDICATED FULL-WIDTH VIDEO BRAND SECTION ── */}
        <FullWidthVideoSection />

        {/* ── FEATURED EDITORIAL SOLUTION SECTION ── */}
        <FeaturedSolutionSection />

        {/* ── FAMOUS HISTORICAL QUOTE SECTION ── */}
        <FamousQuoteSection />

        {/* ── SECTION: Frequently Asked Questions (FAQ) ── */}
        <FaqSection />

        {/* ── SOCIAL MOVEMENT & IMPACT SECTION (UNTUK MEREKA. UNTUK INDONESIA. UNTUK EKONOMI.) ── */}
        <MovementImpactSection />

        {/* ── LONGINES STYLE BOTTOM MEMBERSHIP BANNER ── */}
      </div>
    </main>
  );
};

// ─── Subcomponents ────────────────────────────────────────────────────────────

interface StepItemProps {
  step: string;
  icon: React.ElementType;
  title: string;
  description: string;
}

function StepItem({ step, icon: Icon, title, description }: StepItemProps) {
  return (
    <div className="border border-amber-500/20 bg-card rounded-2xl p-6 text-left space-y-4 shadow-xs relative overflow-hidden group hover:border-amber-500/50 transition-colors">
      <div className="absolute top-3 right-3 text-2xl font-black text-amber-500/20 font-fraunces select-none">
        {step}
      </div>
      <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
        <Icon className="h-5 w-5" />
      </div>
      <div className="space-y-1">
        <h4 className="text-xs font-bold text-foreground font-poppins">
          {title}
        </h4>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ElementType;
  value: string;
  unit: string;
  label: string;
  subtext: string;
}

function StatCard({ icon: Icon, value, unit, label, subtext }: StatCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-card p-5 shadow-xs flex flex-col justify-between min-h-[140px] text-left hover:border-amber-500/50 transition-colors">
      <div className="flex items-start justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground font-poppins">
          {label}
        </span>
        <div className="h-8 w-8 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center">
          <Icon className="h-4.5 w-4.5" />
        </div>
      </div>

      <div className="pt-4">
        <span className="text-3xl font-bold tracking-tight text-foreground font-fraunces">
          {value}
        </span>
        <span className="ml-0.5 text-xs font-bold text-muted-foreground">
          {unit}
        </span>
        <p className="text-[10px] text-muted-foreground leading-none pt-1">
          {subtext}
        </p>
      </div>
    </div>
  );
}

// Inline mini badge
function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ring-gray-500/10 ${className}`}
    >
      {children}
    </span>
  );
}

export default HomePage;
