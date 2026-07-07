"use client";

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
} from "lucide-react";
import Navbar from "@/components/shared/navbar";
import { InfoBar } from "@/components/shared/info-bar";
import { CarouselHomePage } from "../components/carousel";
import { Button } from "@/components/ui/button";

const HomePage = () => {
  return (
    <>
      <header>
        <InfoBar />
        <Navbar />
      </header>
      <main className="w-full bg-[#fafbf9] dark:bg-gray-950 text-gray-900 dark:text-gray-100 overflow-hidden relative">
        
        {/* Decorative background gradients for premium mesh feel */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-emerald-500/3 blur-[120px] dark:bg-emerald-500/5" />
          <div className="absolute top-[40%] right-[-10%] h-[600px] w-[600px] rounded-full bg-sky-500/3 blur-[140px] dark:bg-sky-500/5" />
          <div className="absolute bottom-[20%] left-[15%] h-[500px] w-[500px] rounded-full bg-amber-500/3 blur-[120px] dark:bg-amber-500/5" />
        </div>

        {/* Hero Banner Section */}
        <div className="w-full relative z-10" style={{ height: "calc(100vh - 104px)" }}>
          <CarouselHomePage />
        </div>

        {/* ── Section 1: Core Services Grid ── */}
        <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 backdrop-blur-xs">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                LoopTani Ecosystem
              </span>
            </div>
            <h2 className="font-fraunces text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">
              Ekosistem Pertanian Pintar &amp; Sirkular
            </h2>
            <div className="h-1 w-20 bg-primary mx-auto rounded-full my-4" />
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 font-sans leading-relaxed max-w-2xl mx-auto">
              Menghubungkan produsen limbah tani dengan industri olahan menggunakan 
              teknologi AI presisi untuk memaksimalkan potensi ekonomi hijau.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Marketplace */}
            <ServiceCard
              icon={ShoppingBag}
              title="Marketplace Sirkular"
              description="Temukan limbah organik berkualitas tinggi, jual beli sisa panen, atau dapatkan alat tani bekas siap pakai."
              link="/marketplace"
              actionText="Jelajahi Toko"
              accentColor="from-emerald-500 to-teal-500"
              iconBg="bg-emerald-500/10 text-emerald-600"
              topBorder="border-t-2 border-t-emerald-500"
            />
            {/* AI Loopi */}
            <ServiceCard
              icon={MessageSquare}
              title="AI Loopi Consultant"
              description="Asisten cerdas 24/7 untuk menjawab tanya jawab pertanian, dosis pemupukan, hingga analisis penyakit."
              link="/loopi"
              actionText="Mulai Chat"
              accentColor="from-sky-500 to-blue-500"
              iconBg="bg-sky-500/10 text-sky-600"
              topBorder="border-t-2 border-t-sky-500"
            />
            {/* Panduan Tani */}
            <ServiceCard
              icon={BookOpen}
              title="Panduan Tani"
              description="Ratusan modul edukasi sirkular, video praktik terverifikasi, dan raih koin LoopPoints dari kontribusi Anda."
              link="/panduan-tani"
              actionText="Baca Panduan"
              accentColor="from-green-500 to-emerald-600"
              iconBg="bg-green-500/10 text-green-600"
              topBorder="border-t-2 border-t-green-500"
            />
            {/* Jejak Lestari */}
            <ServiceCard
              icon={Leaf}
              title="Jejak Lestari"
              description="Transparan melacak emisi CO₂ yang berhasil dicegah, air tanah terlindungi, dan cetak laporan ESG instan."
              link="/jejak-lestari"
              actionText="Lacak Dampak"
              accentColor="from-amber-500 to-orange-500"
              iconBg="bg-amber-500/10 text-amber-600"
              topBorder="border-t-2 border-t-amber-500"
            />
          </div>
        </section>

        {/* ── Section 2: Circular Process Flow ── */}
        <section className="relative z-10 bg-white border-y border-gray-100 dark:bg-gray-900/60 dark:border-gray-850 py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3.5 py-1.5 rounded-full">
                Circular Roadmap
              </span>
              <h2 className="font-fraunces text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">
                Bagaimana Siklus Sirkular Berputar
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-lg mx-auto">
                Proses terintegrasi dari pengumpulan limbah hingga terhitung menjadi kontribusi dampak lingkungan yang terverifikasi.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-4 relative">
              {/* Desktop connected connector dashed lines */}
              <div className="hidden md:block absolute top-[28%] left-[12%] right-[12%] h-[2px] border-t-2 border-dashed border-gray-200 dark:border-gray-800 z-0" />

              <StepItem
                step="01"
                icon={Recycle}
                title="Koleksi Limbah"
                description="Petani mengumpulkan sisa sekam padi, jerami, atau tongkol jagung sisa panen."
                color="bg-emerald-500"
                glowColor="shadow-emerald-500/20"
              />
              <StepItem
                step="02"
                icon={DollarSign}
                title="Pasarkan Produk"
                description="Limbah dijual langsung ke marketplace LoopTani untuk menambah penghasilan."
                color="bg-sky-500"
                glowColor="shadow-sky-500/20"
              />
              <StepItem
                step="03"
                icon={Cpu}
                title="Proses Olahan"
                description="Mitra industri mendaur ulang limbah menjadi kompos, briket, atau biochar bernilai."
                color="bg-green-600"
                glowColor="shadow-green-500/20"
              />
              <StepItem
                step="04"
                icon={Award}
                title="Perhitungan Dampak"
                description="Setiap transaksi dikonversi menjadi laporan emisi CO₂ dicegah dan air dilindungi."
                color="bg-amber-500"
                glowColor="shadow-amber-500/20"
              />
            </div>
          </div>
        </section>

        {/* ── Section 3: Community Stats ── */}
        <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="grid gap-12 lg:grid-cols-3 items-center">
            
            {/* Left intro details column */}
            <div className="lg:col-span-1 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1.5">
                <TrendingUp className="h-4.5 w-4.5 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-primary">
                  Live Impact Statistics
                </span>
              </div>
              <h3 className="font-fraunces text-4xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">
                Dampak Riil Komunitas Tani
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-sans">
                Setiap hari, ratusan petani dan mitra industri bekerja sama di LoopTani untuk mengurangi beban emisi karbon dan melestarikan air tanah kita.
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Diperbarui otomatis berdasarkan transaksi live</span>
              </div>
            </div>

            {/* Right stats grid column */}
            <div className="lg:col-span-2 grid gap-6 sm:grid-cols-3">
              {/* Stat 1 */}
              <StatCard
                icon={Wind}
                value="15.420"
                unit="kg"
                label="Emisi CO₂ Dicegah"
                subtext="Setara menanam 5.930 pohon"
                accentColor="from-emerald-500 to-teal-500 text-white"
              />
              {/* Stat 2 */}
              <StatCard
                icon={Droplets}
                value="84.200"
                unit="L"
                label="Air Tanah Dilindungi"
                subtext="Mencegah rembesan nitrat kimia"
                accentColor="from-sky-500 to-blue-500 text-white"
              />
              {/* Stat 3 */}
              <StatCard
                icon={Users}
                value="2.400"
                unit="+"
                label="Petani Berdaya"
                subtext="Meningkatkan pendapatan sirkular"
                accentColor="from-amber-400 to-orange-500 text-white"
              />
            </div>

          </div>
        </section>

        {/* ── Section 4: Premium Bottom CTA Card ── */}
        <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-32">
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-gray-900 via-gray-800 to-primary/95 px-6 py-20 text-center shadow-2xl sm:px-12 md:py-24">
            
            {/* Glowing backdrop elements inside CTA */}
            <div className="pointer-events-none absolute -top-12 -right-12 h-56 w-56 rounded-full bg-emerald-400/20 blur-3xl" />
            <div className="pointer-events-none absolute bottom-[-50px] left-20 h-40 w-40 rounded-full bg-sky-400/15 blur-2xl" />

            <div className="relative z-10 max-w-3xl mx-auto space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                Gabung Ekosistem Hijau
              </span>
              <h2 className="font-fraunces text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight">
                Mulai Langkah Hijau Bertani Berkelanjutan
              </h2>
              <p className="font-sans text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Bergabunglah bersama ribuan petani modern dan mitra industri hijau.
                Ubah limbah menjadi nilai guna baru, lindungi air tanah, dan raih pendapatan berkelanjutan sekarang.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
                <Button size="lg" asChild className="rounded-full font-semibold px-8 py-6 bg-primary hover:bg-primary/90 text-white text-sm shadow-lg hover:shadow-xl hover:scale-102 transition-all">
                  <Link href="/auth/register">Daftar Sekarang</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="rounded-full font-semibold bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white px-8 py-6 text-sm">
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

interface ServiceCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  link: string;
  actionText: string;
  accentColor: string;
  iconBg: string;
  topBorder: string;
}

function ServiceCard({
  icon: Icon,
  title,
  description,
  link,
  actionText,
  accentColor,
  iconBg,
  topBorder,
}: ServiceCardProps) {
  return (
    <div className={`group relative flex flex-col justify-between rounded-3xl border border-gray-150 bg-white/80 dark:bg-gray-900/60 dark:border-gray-800/80 p-7 backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${topBorder}`}>
      {/* Decorative gradient corner light */}
      <div className="absolute top-0 right-0 h-16 w-16 bg-gradient-to-br from-transparent to-black/[0.02] dark:to-white/[0.01] rounded-bl-3xl pointer-events-none" />

      <div className="space-y-5">
        {/* Icon container */}
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconBg} shadow-xs`}>
          <Icon className="h-5.5 w-5.5" />
        </div>
        
        {/* Title (Fraunces) */}
        <h3 className="font-fraunces text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
          {title}
        </h3>
        
        {/* Description */}
        <p className="font-sans text-xs text-gray-550 dark:text-gray-450 leading-relaxed">
          {description}
        </p>
      </div>

      <div className="pt-8 flex items-center justify-between">
        <Link
          href={link}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary transition-all group-hover:gap-2.5"
        >
          {actionText}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        <ArrowUpRight className="h-4 w-4 text-gray-300 group-hover:text-primary transition-colors duration-300" />
      </div>
    </div>
  );
}

interface StepItemProps {
  step: string;
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  glowColor: string;
}

function StepItem({ step, icon: Icon, title, description, color, glowColor }: StepItemProps) {
  return (
    <div className="relative flex flex-col items-center text-center space-y-4 z-10 group">
      {/* Outer Circle Container */}
      <div className="relative p-2.5 rounded-full border border-gray-100 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-900/30">
        <div className={`relative flex h-16 w-16 items-center justify-center rounded-full ${color} text-white shadow-md ${glowColor} transition-transform duration-500 group-hover:rotate-12`}>
          <Icon className="h-7 w-7" />
          {/* Badge Step */}
          <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white text-[10px] font-bold text-gray-900 shadow-sm border border-gray-150 dark:bg-gray-800 dark:text-white dark:border-gray-700">
            {step}
          </span>
        </div>
      </div>

      <h4 className="font-fraunces text-base font-bold text-gray-900 dark:text-white">
        {title}
      </h4>
      <p className="font-sans text-xs text-gray-500 dark:text-gray-400 max-w-[200px] leading-relaxed">
        {description}
      </p>
    </div>
  );
}

interface StatCardProps {
  icon: React.ElementType;
  value: string;
  unit: string;
  label: string;
  subtext: string;
  accentColor: string;
}

function StatCard({ icon: Icon, value, unit, label, subtext, accentColor }: StatCardProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-gray-150 bg-white/90 p-7 dark:bg-gray-900/60 dark:border-gray-800/80 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between">
      
      {/* Header and Icon */}
      <div className="mb-6 flex items-start justify-between">
        <div className="text-left">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            {label}
          </p>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${accentColor} shadow-xs`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>

      {/* Numerical values */}
      <div className="text-left mb-4">
        <span className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white font-sans">
          {value}
        </span>
        <span className="ml-1 text-sm font-bold text-gray-400">
          {unit}
        </span>
      </div>

      {/* Footer comparison */}
      <div className="pt-4 border-t border-gray-50 dark:border-gray-800/50">
        <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
          {subtext}
        </p>
      </div>

      {/* Subtle bottom decorative light */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </div>
  );
}

export default HomePage;
