"use client";

import React, { useState, useEffect, useRef } from "react";
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
import { cn } from "@/lib/utils";

import { useProducts } from "@/features/marketplace/hooks/use-products";

import { useTranslations } from "next-intl";

const getCategorySubtitle = (category?: string, t?: any) => {
  switch (category) {
    case "agricultural-waste":
      return t ? t("subtitles.agriculturalWaste") : "Koleksi Limbah Utama";
    case "processed-product":
      return t ? t("subtitles.processedProduct") : "Formula Pupuk Organik";
    case "secondhand":
      return t ? t("subtitles.secondhand") : "Alat Tani Presisi";
    default:
      return t ? t("subtitles.default") : "Produk Sirkular";
  }
};

const CATEGORY_TABS = [
  { id: "all", label: "Semua Produk" },
  { id: "agricultural-waste", label: "Limbah Pertanian" },
  { id: "processed-product", label: "Hasil Olahan Organik" },
  { id: "secondhand", label: "Alat & Mesin Tani" },
];

const formatProductPrice = (price: number, unit?: string) => {
  const formatted = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
  return unit ? `${formatted} / ${unit}` : formatted;
};

interface LonginesProductCardProps {
  prod: any;
  onScrollLeft: () => void;
  onScrollRight: () => void;
}

const LonginesProductCard: React.FC<LonginesProductCardProps> = ({
  prod,
  onScrollLeft,
  onScrollRight,
}) => {
  const t = useTranslations("sections");
  const isBackendItem = "title" in prod;
  const name = isBackendItem ? prod.title : prod.name;
  const priceStr = isBackendItem
    ? formatProductPrice(prod.price, prod.unit)
    : prod.price;
  const locationStr = isBackendItem
    ? [prod.city, prod.province].filter(Boolean).join(", ") ||
      prod.location ||
      "Indonesia"
    : prod.location;
  const tagStr = isBackendItem
    ? prod.condition === "NEW"
      ? "New"
      : "Verified"
    : prod.tag;
  const subtitleStr = isBackendItem
    ? getCategorySubtitle(prod.category, t)
    : prod.subtitle;

  // Gather list of images (support multiple photos)
  const imageList: string[] = isBackendItem
    ? prod.images?.map((img: any) => img.imageUrl).filter(Boolean).length > 0
      ? prod.images.map((img: any) => img.imageUrl)
      : [prod.thumbnail || "/images/bento-farmer-tech.png"]
    : [
        prod.image,
        "/images/auth-carousel-2.jpg",
        "/images/auth-carousel-3.jpg",
        "/images/auth-carousel-1.jpg",
      ];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const currentImage = imageList[activeImageIndex] || imageList[0];
  const linkHref = isBackendItem ? `/marketplace/${prod.id}` : prod.link;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="w-[200px] sm:w-[230px] lg:w-[240px] shrink-0 snap-start group flex flex-col text-left font-poppins"
    >
      {/* Clean Full-Bleed Product Image Frame */}
      <div className="relative aspect-[4/5] w-full rounded-lg overflow-hidden bg-muted/20 flex items-center justify-center transition-all duration-500">
        <img
          src={currentImage}
          alt={name}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none"
        />

        {/* Top-left clean rectangular badge */}
        <span className="absolute top-3 left-3 bg-background text-foreground font-bold text-[9px] uppercase px-2.5 py-1 rounded-xs tracking-wider shadow-2xs font-poppins">
          {tagStr}
        </span>

        {/* Hover Navigation Arrows */}
        {imageList.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setActiveImageIndex((prev) =>
                  prev === 0 ? imageList.length - 1 : prev - 1
                );
              }}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/90 text-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:scale-110 cursor-pointer"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setActiveImageIndex((prev) =>
                  prev === imageList.length - 1 ? 0 : prev + 1
                );
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/90 text-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:scale-110 cursor-pointer"
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {/* Miniature Photo Variant Row below Image Container (Expands height from 0 on hover, pushing content down) */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-out flex items-center justify-start gap-1.5 font-poppins",
          isHovered && imageList.length > 1
            ? "h-9 pt-2 opacity-100"
            : "h-0 pt-0 opacity-0 pointer-events-none"
        )}
      >
        {imageList.slice(0, 4).map((img, idx) => (
          <button
            key={idx}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setActiveImageIndex(idx);
            }}
            className={cn(
              "h-7 w-7 rounded-xs border p-0.5 overflow-hidden transition-all cursor-pointer bg-background shrink-0",
              activeImageIndex === idx
                ? "border-foreground shadow-xs ring-1 ring-foreground/20"
                : "border-border/60 hover:border-foreground/50 opacity-70 hover:opacity-100"
            )}
          >
            <img
              src={img}
              alt={`Variant ${idx + 1}`}
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Product Meta Below Image & Thumbnails */}
      <div className="space-y-1 text-left pt-1 font-poppins">
        <h3 className="font-poppins text-sm sm:text-base font-bold text-foreground uppercase tracking-wide group-hover:text-primary transition-colors line-clamp-1">
          {name}
        </h3>
        <p className="text-xs text-muted-foreground font-medium line-clamp-1">
          {subtitleStr} • {locationStr}
        </p>
        <p className="text-sm font-bold text-foreground font-poppins pt-0.5">
          {priceStr}
        </p>
        <div className="pt-2">
          <Link
            href={linkHref}
            className="inline-block text-xs font-bold text-foreground underline underline-offset-4 hover:text-primary transition-colors font-poppins"
          >
            Lihat Detail Produk
          </Link>
        </div>
      </div>
    </div>
  );
};

const HomePage = () => {
  const t = useTranslations("sections");
  const [activeTab, setActiveTab] = useState<
    "marketplace" | "ai" | "edukasi" | "lestari"
  >("marketplace");

  const [homeCategoryTab, setHomeCategoryTab] = useState<string>("all");

  const categoryTabs = [
    { id: "all", label: t("tabs.all") },
    { id: "agricultural-waste", label: t("tabs.agriculturalWaste") },
    { id: "processed-product", label: t("tabs.processedProduct") },
    { id: "secondhand", label: t("tabs.secondhand") },
  ];
  const sliderRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleSliderScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      const maxScroll = scrollWidth - clientWidth;
      const progress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0;
      setScrollProgress(progress);
    }
  };

  const scrollSlider = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const scrollAmount = sliderRef.current.clientWidth * 0.75;
      sliderRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Fetch real dynamic products from backend API with category filter
  const { data: productsData, isLoading: isProductsLoading } = useProducts({
    params: {
      limit: 12,
      category: homeCategoryTab === "all" ? undefined : (homeCategoryTab as any),
    },
  });

  const backendProducts = productsData?.data ?? [];

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
      link: "/marketplace/secondhand/tractors",
    },
    {
      id: 5,
      subtitle: "Koleksi Limbah Utama",
      name: "Jerami Padi Potong Segar",
      price: "Rp 900 / kg",
      image: "/images/auth-carousel-2.jpg",
      location: "Ngawi, Jawa Timur",
      tag: "Fresh Harvest",
      link: "/marketplace/agricultural-waste/straw",
    },
    {
      id: 6,
      subtitle: "Formula Pupuk Organik",
      name: "POC Pupuk Organik Cair Super",
      price: "Rp 25.000 / Liter",
      image: "/images/auth-carousel-3.jpg",
      location: "Bantul, DIY",
      tag: "Formula Hayati",
      link: "/marketplace/processed-products/poc",
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
                {t("whyLooptani")}
              </span>
            </div>

            {/* Right Column: Longer Headline */}
            <div className="lg:col-span-8 text-left">
              <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-[1.18]">
                {t("heroHeadline")}
              </h1>
            </div>
          </div>
        </section>

        {/* ── SINGLE ROW VELOCITY SCROLL BANNER ── */}
        <SingleVelocityBanner />

        {/* ── LONGINES 1:1 STYLE MASTER COLLECTIONS ("KOLEKSI UNGGULAN") ── */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24 border-t border-border/50">
          {/* Longines Minimalist Category Tab Bar (Centered) */}
          <div className="flex items-center justify-center border-b border-border/40 pb-0 mb-12 overflow-x-auto scrollbar-none gap-6 sm:gap-12">
            {categoryTabs.map((tab) => {
              const isActive = homeCategoryTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setHomeCategoryTab(tab.id)}
                  className={cn(
                    "relative pb-3 text-xs sm:text-sm font-bold tracking-widest uppercase font-poppins transition-colors duration-300 whitespace-nowrap cursor-pointer",
                    isActive
                      ? "text-foreground font-extrabold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab.label}
                  {isActive && (
                    <motion.div
                      layoutId="longinesActiveTabLine"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground"
                      transition={{ type: "spring", stiffness: 500, damping: 40 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Longines Single Row Scrollable Product Carousel with AnimatePresence */}
          <div className="h-[460px] relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={homeCategoryTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="h-[460px]"
              >
                <div
                  ref={sliderRef}
                  onScroll={handleSliderScroll}
                  className="flex items-start overflow-x-auto scrollbar-none snap-x snap-mandatory gap-6 scroll-smooth pb-2 select-none h-[460px]"
                >
                  {isProductsLoading
                    ? Array.from({ length: 4 }).map((_, i) => (
                        <div
                          key={i}
                          className="w-[200px] sm:w-[230px] lg:w-[240px] shrink-0 snap-start flex flex-col text-left space-y-3 animate-pulse"
                        >
                          <div className="aspect-[4/5] w-full bg-muted/40 rounded-xs" />
                          <div className="h-4 bg-muted rounded w-2/3" />
                          <div className="h-3 bg-muted rounded w-1/2" />
                          <div className="h-4 bg-muted rounded w-1/3" />
                        </div>
                      ))
                    : (backendProducts.length > 0
                        ? backendProducts
                        : luxuryCollections.filter((c) =>
                            homeCategoryTab === "all"
                              ? true
                              : c.link.includes(homeCategoryTab)
                          )
                      ).map((prod: any) => (
                        <LonginesProductCard
                          key={prod.id}
                          prod={prod}
                          onScrollLeft={() => scrollSlider("left")}
                          onScrollRight={() => scrollSlider("right")}
                        />
                      ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Longines Bottom Progress Line & Active Interactive Control Arrows */}
          <div className="flex items-center justify-between pt-12 border-t border-border/40 mt-8">
            <div className="h-0.5 bg-muted w-48 relative overflow-hidden">
              <div
                className="h-full bg-foreground transition-all duration-300"
                style={{
                  width: "35%",
                  transform: `translateX(${scrollProgress * 1.85}%)`,
                }}
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => scrollSlider("left")}
                className="h-10 w-10 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-muted transition-colors cursor-pointer active:scale-95"
                aria-label="Scroll Left"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => scrollSlider("right")}
                className="h-10 w-10 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-muted transition-colors cursor-pointer active:scale-95"
                aria-label="Scroll Right"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
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
