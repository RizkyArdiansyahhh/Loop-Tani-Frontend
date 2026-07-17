"use client";

import React, { useState } from "react";
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
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Navbar from "@/components/shared/navbar";
import { InfoBar } from "@/components/shared/info-bar";
import { CarouselHomePage } from "../components/carousel";
import { Button } from "@/components/ui/button";

const HomePage = () => {
  // Tabs state for Notion-style interactive features section
  const [activeTab, setActiveTab] = useState<"marketplace" | "ai" | "edukasi" | "lestari">("marketplace");

  const features = {
    marketplace: {
      title: "Marketplace Sirkular",
      badge: "Marketplace",
      description: "Temukan limbah pertanian berkualitas tinggi atau jual sisa panen Anda secara langsung ke pelaku industri pengolahan organik.",
      cta: "Buka Marketplace",
      link: "/marketplace",
      mockup: (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-150 pb-3 dark:border-gray-800">
            <span className="text-xs font-bold text-gray-900 dark:text-white">Katalog Limbah Populer</span>
            <span className="text-[10px] text-primary font-bold flex items-center gap-0.5 cursor-pointer">Lihat Semua <ChevronRight className="h-3 w-3" /></span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: "Sekam Padi Kering", price: "Rp 1.200 / kg", location: "Sragen, Jateng", label: "Limbah", textGreen: true },
              { name: "Pupuk Kompos Organik", price: "Rp 4.500 / kg", location: "Sleman, DIY", label: "Olahan", textGreen: false },
            ].map((prod, i) => (
              <div key={i} className="border border-gray-150 rounded-xl p-3 bg-white dark:border-gray-800 dark:bg-gray-950 space-y-2 shadow-3xs text-left">
                <div className="h-20 bg-gray-50 dark:bg-gray-900 rounded-lg flex items-center justify-center text-xs font-bold text-gray-400">
                  {prod.name}
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400 px-2 py-0.5 rounded-full">{prod.label}</span>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate pt-1">{prod.name}</h4>
                  <p className="text-[10px] font-extrabold text-gray-950 dark:text-gray-300">{prod.price}</p>
                  <p className="text-[8px] text-muted-foreground">{prod.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    ai: {
      title: "AI Loopi Consultant",
      badge: "AI Assistant",
      description: "Konsultasi penyakit tanaman, rekomendasi pupuk limbah, hingga hitung estimasi nilai jual sisa panen Anda seketika.",
      cta: "Mulai Chat Asisten",
      link: "/loopi",
      mockup: (
        <div className="space-y-3.5 flex flex-col h-full justify-between text-left">
          <div className="space-y-2.5">
            <div className="flex gap-2.5 items-start">
              <div className="h-7 w-7 rounded-full bg-gray-100 flex items-center justify-center font-bold text-xs shrink-0 dark:bg-gray-800">👤</div>
              <div className="bg-gray-50 border border-gray-150 rounded-xl rounded-tl-none p-2.5 text-[11px] text-gray-700 leading-relaxed dark:bg-gray-900 dark:border-gray-800 dark:text-gray-300">
                Bagaimana cara terbaik mengolah jerami padi sisa panen agar bermanfaat kembali?
              </div>
            </div>
            <div className="flex gap-2.5 items-start">
              <div className="h-7 w-7 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shrink-0 select-none">🤖</div>
              <div className="bg-emerald-50/50 border border-emerald-100/60 rounded-xl rounded-tl-none p-3 text-[11px] text-emerald-950 leading-relaxed dark:bg-emerald-950/20 dark:border-emerald-900/30 dark:text-emerald-300 space-y-1">
                <p className="font-bold text-emerald-800 dark:text-emerald-400">Hai! Jerami padi bisa diolah menjadi:</p>
                <p>1. **Kompos**: Campur dengan kotoran ternak & EM4.</p>
                <p>2. **Briket/Bahan Bakar**: Potensi nilai jual Rp 1.500/kg di LoopTani!</p>
              </div>
            </div>
          </div>
          <div className="relative pt-2">
            <div className="h-8 border border-gray-150 rounded-lg bg-white dark:border-gray-800 dark:bg-gray-950 flex items-center px-3 text-[10px] text-muted-foreground justify-between">
              Tanyakan dosis pupuk sekam...
              <span className="text-[10px] font-bold text-primary">Kirim</span>
            </div>
          </div>
        </div>
      ),
    },
    edukasi: {
      title: "Panduan Tani Sirkular",
      badge: "Edukasi Tani",
      description: "Akses ratusan modul edukasi sirkular, video praktik terverifikasi, dan kumpulkan reward LoopPoints menarik dari setiap kontribusi Anda.",
      cta: "Pelajari Panduan",
      link: "/panduan-tani",
      mockup: (
        <div className="space-y-4 text-left">
          <div className="flex items-center justify-between border-b border-gray-150 pb-3 dark:border-gray-800">
            <span className="text-xs font-bold text-gray-900 dark:text-white">Modul Terpopuler Minggu Ini</span>
            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Reward +100 LP</span>
          </div>
          <div className="space-y-2.5">
            {[
              { title: "Panduan Pembuatan Pupuk Kompos Cair dari Bonggol Pisang", readTime: "5 menit", points: "+50 LP" },
              { title: "Pemanfaatan Sekam Padi Menjadi Biochar Penjaga Air Tanah", readTime: "8 menit", points: "+80 LP" },
            ].map((modul, i) => (
              <div key={i} className="flex items-center justify-between border border-gray-100 rounded-xl p-3 bg-white hover:bg-gray-50/50 dark:border-gray-800 dark:bg-gray-950/40 cursor-pointer transition-colors shadow-3xs">
                <div className="flex gap-3 items-center text-left">
                  <div className="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center font-bold text-xs text-primary shrink-0 select-none">📖</div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate max-w-[220px]">{modul.title}</h4>
                    <span className="text-[10px] text-muted-foreground">{modul.readTime} membaca</span>
                  </div>
                </div>
                <Badge className="bg-amber-100 text-amber-800 border-0 font-extrabold text-[10px]">{modul.points}</Badge>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    lestari: {
      title: "Jejak Lestari (ESG)",
      badge: "Laporan Dampak",
      description: "Hitung dan laporkan secara transparan jumlah emisi CO₂ yang berhasil dikurangi serta air tanah terlindungi dari setiap daur ulang limbah.",
      cta: "Lihat Laporan ESG",
      link: "/jejak-lestari",
      mockup: (
        <div className="space-y-4 text-left">
          <div className="grid grid-cols-2 gap-3">
            <div className="border border-gray-150 rounded-xl p-3 bg-white dark:border-gray-800 dark:bg-gray-950 shadow-3xs space-y-1">
              <span className="text-[10px] font-bold text-gray-400 block uppercase">CO₂ Dicegah</span>
              <span className="text-lg font-black text-emerald-600">15.420 Kg</span>
              <p className="text-[9px] text-muted-foreground leading-none">Setara 5.930 pohon</p>
            </div>
            <div className="border border-gray-150 rounded-xl p-3 bg-white dark:border-gray-800 dark:bg-gray-950 shadow-3xs space-y-1">
              <span className="text-[10px] font-bold text-gray-400 block uppercase">Air Dilindungi</span>
              <span className="text-lg font-black text-sky-500">84.200 Liter</span>
              <p className="text-[9px] text-muted-foreground leading-none">Bebas nitrat kimia</p>
            </div>
          </div>
          <div className="border border-emerald-100 bg-emerald-50/10 rounded-xl p-3 dark:border-emerald-950/20 text-left space-y-2">
            <div className="flex items-center gap-1 text-[11px] text-emerald-800 dark:text-emerald-400 font-bold">
              <Sparkles className="h-4 w-4 fill-current text-emerald-600" />
              Sertifikat Keberlanjutan Sirkular
            </div>
            <div className="h-1.5 w-full bg-emerald-100 rounded-full overflow-hidden dark:bg-emerald-950">
              <div className="h-full bg-primary w-[75%] rounded-full" />
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed">Komunitas Anda telah mencapai 75% target reduksi emisi karbon kuartal ini.</p>
          </div>
        </div>
      ),
    },
  };

  return (
    <>
      <header>
        <InfoBar />
        <Navbar />
      </header>
      <main className="w-full bg-[#fcfdfa] dark:bg-gray-950 text-gray-900 dark:text-gray-100 overflow-hidden relative transition-colors duration-300">
        
        {/* ── Visual Banner Slideshow Carousel at the very top ── */}
        <div
          className="w-full relative z-10"
          style={{ height: "calc(100vh - 104px)" }}
        >
          <CarouselHomePage />
        </div>

        {/* Subtle Notion-Style Dot Grid Overlay below Carousel */}
        <div className="absolute inset-0 top-[100vh] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] pointer-events-none z-0" />

        {/* ── HERO SECTION: Notion-style bold & clean description block ── */}
        <section className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-16 text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-emerald-500/5 px-3 py-1 text-primary">
            <Sparkles className="h-3.5 w-3.5 fill-current text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Pertanian Sirkular Berbasis AI
            </span>
          </div>
          
          <h2 className="font-fraunces text-4xl sm:text-5xl font-black tracking-tight text-gray-950 dark:text-white leading-tight max-w-4xl mx-auto">
            Hubungkan Pertanian. Kelola Limbah. Dengan AI.
          </h2>
          
          <p className="font-sans text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            LoopTani menyatukan petani modern, industri kreatif pupuk organik, dan pembeli limbah pertanian secara sirkular menggunakan teknologi kecerdasan buatan terpadu.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              size="sm"
              asChild
              className="rounded-lg font-bold px-5 py-4 bg-primary hover:bg-emerald-700 text-white text-xs shadow-xs transition-all duration-300 cursor-pointer"
            >
              <Link href="/register">Mulai Sekarang</Link>
            </Button>
            <Button
              size="sm"
              variant="outline"
              asChild
              className="rounded-lg font-bold bg-white border-gray-200 text-gray-700 hover:bg-gray-50 px-5 py-4 text-xs shadow-3xs cursor-pointer"
            >
              <Link href="/marketplace">Eksplor Marketplace</Link>
            </Button>
          </div>
        </section>

        {/* ── PARTNERS / SOCIAL PROOF BANNER: Minimalist Monochrome ── */}
        <section className="relative z-10 mx-auto max-w-5xl px-4 text-center border-t border-gray-150 dark:border-gray-850/80 py-8">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">
            Dipercaya Oleh Rantai Pertanian Nasional
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 text-xs sm:text-sm font-fraunces text-gray-400 select-none">
            <span className="hover:text-gray-500 transition-colors">🌾 Kelompok Tani Makmur</span>
            <span className="hover:text-gray-500 transition-colors">♻️ Riau Organic Compost</span>
            <span className="hover:text-gray-500 transition-colors">🌱 Green Agri Lestari</span>
            <span className="hover:text-gray-500 transition-colors">🚜 Mitra Alat Tani</span>
          </div>
        </section>

        {/* ── SECTION: Notion-style Interactive Tabs features description ── */}
        <section className="relative z-10 border-t border-gray-150 bg-white/40 dark:bg-gray-900/20 dark:border-gray-850 py-20 md:py-28">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
                Satu Aplikasi Terpadu
              </span>
              <h2 className="font-fraunces text-3xl sm:text-4xl font-bold tracking-tight text-gray-950 dark:text-white">
                Segala Kebutuhan Tani dalam Genggaman
              </h2>
              <p className="text-xs text-muted-foreground">
                Pilih tab di bawah untuk melihat simulasi antarmuka dan kecanggihan fitur kami.
              </p>
            </div>

            {/* Interactive Tab Selectors */}
            <div className="flex flex-wrap p-1 rounded-xl bg-gray-50 border border-gray-150 dark:bg-gray-900 dark:border-gray-800 w-full shadow-3xs mb-8">
              {[
                { key: "marketplace", label: "Marketplace Sirkular", icon: ShoppingBag },
                { key: "ai", label: "AI Loopi Consultant", icon: MessageSquare },
                { key: "edukasi", label: "Edukasi Tani", icon: BookOpen },
                { key: "lestari", label: "Jejak Lestari (ESG)", icon: Leaf },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold rounded-lg transition-all duration-300 cursor-pointer ${
                    activeTab === tab.key
                      ? "bg-white text-gray-900 shadow-sm dark:bg-gray-850 dark:text-white"
                      : "text-muted-foreground hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span className="hidden md:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Interactive Feature Panel Card */}
            <div className="border border-gray-200 rounded-xl bg-white dark:border-gray-800 dark:bg-gray-900 shadow-lg overflow-hidden min-h-[360px] grid grid-cols-1 lg:grid-cols-12">
              
              {/* Left pane: Description & Details (5 cols) */}
              <div className="lg:col-span-5 p-8 flex flex-col justify-between text-left space-y-6">
                <div className="space-y-4">
                  <Badge className="bg-primary/10 text-primary border-0 font-bold text-[10px] px-2.5 py-0.5 rounded-full select-none">
                    {features[activeTab].badge}
                  </Badge>
                  <h3 className="font-fraunces text-2xl font-bold text-gray-950 dark:text-white leading-tight">
                    {features[activeTab].title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {features[activeTab].description}
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex gap-2 items-center text-xs text-gray-700 dark:text-gray-300 font-semibold">
                    <CheckCircle2 className="h-4.5 w-4.5 text-primary shrink-0" />
                    Terintegrasi LoopPoints reward
                  </div>
                  <div className="flex gap-2 items-center text-xs text-gray-700 dark:text-gray-300 font-semibold">
                    <CheckCircle2 className="h-4.5 w-4.5 text-primary shrink-0" />
                    Keamanan data transaksi terjamin
                  </div>
                  
                  <div className="pt-3">
                    <Button asChild className="rounded-lg bg-primary hover:bg-emerald-700 text-white font-bold text-xs h-9 cursor-pointer">
                      <Link href={features[activeTab].link}>
                        {features[activeTab].cta}
                        <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Right pane: Actual Interactive Mockup Display (7 cols) */}
              <div className="lg:col-span-7 bg-gray-50/50 border-t lg:border-t-0 lg:border-l border-gray-150 dark:bg-gray-950/20 dark:border-gray-800 p-8 flex items-center justify-center">
                <div className="w-full max-w-md">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {features[activeTab].mockup}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ── SECTION: Circular Roadmap process steps ── */}
        <section className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
              Circular Flow
            </span>
            <h2 className="font-fraunces text-3xl font-bold tracking-tight text-gray-950 dark:text-white leading-tight">
              Bagaimana Siklus Sirkular Berputar
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-lg mx-auto">
              Proses terintegrasi dari pengumpulan limbah hingga terhitung menjadi kontribusi dampak lingkungan yang terverifikasi.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-4 relative">
            <StepItem
              step="01"
              icon={Recycle}
              title="Koleksi Limbah"
              description="Petani mengumpulkan sisa sekam padi, jerami, atau kulit jagung pasca panen."
            />
            <StepItem
              step="02"
              icon={DollarSign}
              title="Pasarkan Produk"
              description="Limbah ditawarkan langsung di marketplace untuk menambah pemasukan."
            />
            <StepItem
              step="03"
              icon={Cpu}
              title="Proses Olahan"
              description="Mitra industri mendaur ulang limbah menjadi kompos organik atau biochar."
            />
            <StepItem
              step="04"
              icon={Award}
              title="Perhitungan Dampak"
              description="Transaksi live dikonversi otomatis menjadi hitungan emisi CO₂."
            />
          </div>
        </section>

        {/* ── SECTION: Live Impact Statistics ── */}
        <section className="relative z-10 border-t border-gray-150 bg-white/40 dark:bg-gray-900/20 dark:border-gray-850 py-20 md:py-28">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-3 items-center">
              
              <div className="lg:col-span-1 space-y-4 text-left">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-primary">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    Real-time Impact
                  </span>
                </div>
                <h3 className="font-fraunces text-3xl font-bold tracking-tight text-gray-950 dark:text-white leading-tight">
                  Dampak Riil Komunitas Tani
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Setiap hari, para petani dan pembeli di LoopTani bergotong royong mengurangi beban lingkungan dan menyuburkan ekosistem pertanian kita.
                </p>
                <div className="flex items-center gap-2 text-[10px] text-gray-400">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Diperbarui secara berkala</span>
                </div>
              </div>

              <div className="lg:col-span-2 grid gap-5 sm:grid-cols-3">
                <StatCard
                  icon={Wind}
                  value="15.420"
                  unit="kg"
                  label="Emisi CO₂ Dicegah"
                  subtext="Setara menanam 5.930 pohon baru"
                />
                <StatCard
                  icon={Droplets}
                  value="84.200"
                  unit="L"
                  label="Air Tanah Dilindungi"
                  subtext="Terbebas dari nitrat pupuk kimia"
                />
                <StatCard
                  icon={Users}
                  value="2.400"
                  unit="+"
                  label="Petani Terbantu"
                  subtext="Meningkatkan pendapatan sirkular"
                />
              </div>

            </div>
          </div>
        </section>

        {/* ── SECTION: Premium Clean Bottom CTA Card ── */}
        <section className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="relative border border-emerald-100/50 bg-emerald-50/10 dark:border-emerald-950/20 dark:bg-emerald-950/5 rounded-xl px-6 py-16 text-center overflow-hidden">
            <div className="absolute -top-12 -right-12 h-56 w-56 rounded-full bg-emerald-400/5 blur-3xl pointer-events-none" />
            
            <div className="relative z-10 max-w-2xl mx-auto space-y-5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
                Gabung Ekosistem Hijau
              </span>
              <h2 className="font-fraunces text-3xl font-bold tracking-tight text-gray-950 dark:text-white leading-tight">
                Mulai Langkah Hijau Bertani Berkelanjutan
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-lg mx-auto">
                Daftar sebagai mitra penjual atau pembeli sekarang. Daur ulang limbah organik, lindungi air tanah, dan raih LoopPoints reward menarik.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                <Button
                  size="lg"
                  asChild
                  className="rounded-lg font-bold px-6 py-5 bg-primary hover:bg-emerald-700 text-white text-xs shadow-xs cursor-pointer"
                >
                  <Link href="/register">Daftar Sekarang</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="rounded-lg font-bold bg-white border-gray-200 text-gray-700 hover:bg-gray-50 px-6 py-5 text-xs shadow-3xs cursor-pointer"
                >
                  <Link href="/marketplace">Buka Marketplace</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

      </main>
    </>
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
    <div className="border border-gray-200 bg-white rounded-xl p-6 text-left dark:border-gray-800 dark:bg-gray-900 space-y-4 shadow-3xs relative overflow-hidden group">
      <div className="absolute top-3 right-3 text-2xl font-black text-gray-100 dark:text-gray-800 select-none">
        {step}
      </div>
      <div className="h-10 w-10 rounded-lg bg-emerald-50 text-primary flex items-center justify-center dark:bg-emerald-950/40 shrink-0">
        <Icon className="h-5.5 w-5.5" />
      </div>
      <div className="space-y-1">
        <h4 className="text-xs font-bold text-gray-900 dark:text-white">
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
    <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-5 dark:bg-gray-900 dark:border-gray-800 shadow-3xs flex flex-col justify-between min-h-[140px] text-left">
      <div className="flex items-start justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
          {label}
        </span>
        <div className="h-8 w-8 rounded-lg bg-emerald-50 text-primary flex items-center justify-center dark:bg-emerald-950/30">
          <Icon className="h-4.5 w-4.5" />
        </div>
      </div>

      <div className="pt-4">
        <span className="text-3xl font-extrabold tracking-tight text-gray-950 dark:text-white">
          {value}
        </span>
        <span className="ml-0.5 text-xs font-bold text-gray-400">{unit}</span>
        <p className="text-[10px] text-muted-foreground leading-none pt-1">
          {subtext}
        </p>
      </div>
    </div>
  );
}

// Inline mini badge
function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ring-gray-500/10 ${className}`}>
      {children}
    </span>
  );
}

export default HomePage;
