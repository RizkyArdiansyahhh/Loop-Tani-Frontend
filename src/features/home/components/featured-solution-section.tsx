"use client";

import Image from "next/image";
import Link from "next/link";

export function FeaturedSolutionSection() {
  return (
    <section className="w-full bg-[#FAF9F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100 py-16 sm:py-24 px-4 sm:px-6 lg:px-12 border-y border-stone-200/80 dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* ── CARD 1: TOP WIDE BENTO CARD (ACCENT YELLOW-GREEN) ── */}
        <div className="bg-[#EFF599] dark:bg-stone-900 text-stone-950 dark:text-stone-100 rounded-[2.25rem] p-8 sm:p-12 border border-stone-300/50 dark:border-stone-800 shadow-xs relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              {/* Top Badge */}
              <div className="inline-flex items-center bg-white/80 dark:bg-stone-800/90 border border-stone-300/60 dark:border-stone-700 text-stone-900 dark:text-stone-200 text-xs font-semibold px-4 py-1.5 rounded-full shadow-xs">
                <span>Ekosistem Sirkular Terpadu</span>
              </div>

              {/* Title */}
              <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-950 dark:text-white leading-[1.15]">
                Solusi Holistik Pertanian: Inovasi AI, Olahan Sirkular, & Komunitas Terhubung.
              </h2>

              {/* Paragraph */}
              <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed max-w-xl font-sans">
                LoopTani menjembatani petani, peternak, dan mitra industri untuk mentransformasi sisa panen organik menjadi pupuk bio-fertilizer dan pakan bernilai ekonomi tinggi secara berkelanjutan.
              </p>

              {/* CTA Button */}
              <div className="pt-2">
                <Link
                  href="/marketplace"
                  className="inline-flex items-center justify-between gap-4 bg-stone-950 hover:bg-stone-900 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white rounded-full px-6 py-3 text-xs sm:text-sm font-semibold shadow-md transition-all group"
                >
                  <span>Jelajahi Ekosistem</span>
                  <span className="text-base group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
            </div>

            {/* Right Content: 2 Side-by-Side Images */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden shadow-md border border-stone-900/10 dark:border-stone-800 group">
                <Image
                  src="/images/bento-farmer-tech.png"
                  alt="Petani Modern LoopTani"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden shadow-md border border-stone-900/10 dark:border-stone-800 group">
                <Image
                  src="/images/bento-circular-produce.png"
                  alt="Hasil Olahan Organik"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>

          </div>
        </div>

        {/* ── BOTTOM ROW: 2 BENTO CARDS ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* CARD 2: BOTTOM-LEFT DARK BENTO CARD (5 cols) */}
          <div className="lg:col-span-5 bg-stone-950 text-white rounded-[2.25rem] p-8 sm:p-10 border border-stone-800 shadow-xl flex flex-col justify-between space-y-6">
            
            <div className="space-y-3">
              <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase font-bold">
                PRESISI TERVERIFIKASI
              </span>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
                Teknologi Presisi Loopi AI dalam Aksi Nyata di Lapangan.
              </h3>
            </div>

            {/* Visual Image Container with Floating Pill Badges */}
            <div className="relative rounded-2xl overflow-hidden aspect-16/10 border border-stone-800 bg-stone-900 group shadow-inner">
              <Image
                src="/images/bento-ai-crops.png"
                alt="Analisis Lapangan AI LoopTani"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
              />

              {/* Floating Pill Tags over image */}
              <div className="absolute inset-0 p-4 flex flex-col justify-between pointer-events-none">
                <div className="flex items-center justify-between">
                  <span className="bg-white/90 dark:bg-stone-950/90 backdrop-blur-md text-stone-900 dark:text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md border border-white/20">
                    Analisis Nutrisi
                  </span>
                  <span className="bg-emerald-950/90 backdrop-blur-md text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-3 py-1 rounded-full shadow-md">
                    Daur Ulang Biomassa
                  </span>
                </div>

                <div className="flex items-center justify-start">
                  <span className="bg-white/90 dark:bg-stone-950/90 backdrop-blur-md text-stone-900 dark:text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md border border-white/20">
                    Reduksi Karbon
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* CARD 3: BOTTOM-RIGHT STATS BENTO CARD (7 cols) */}
          <div className="lg:col-span-7 bg-[#EFF599] dark:bg-stone-900 text-stone-950 dark:text-stone-100 rounded-[2.25rem] p-8 sm:p-10 border border-stone-300/50 dark:border-stone-800 shadow-xs flex flex-col justify-between space-y-8">
            
            <div className="space-y-4">
              <span className="text-[10px] font-mono tracking-widest text-stone-500 dark:text-stone-400 uppercase font-bold">
                // IMPACT HIGHLIGHTS
              </span>
              <h3 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-stone-950 dark:text-white leading-tight">
                Capaian & Dampak Nyata Ekosistem LoopTani.
              </h3>
              <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed max-w-lg">
                Metrik pertumbuhan dan kontribusi transparan dari seluruh jaringan mitra tani, peternak, dan fasilitas sirkular di berbagai daerah di Indonesia.
              </p>
            </div>

            {/* 3 Column Statistics Counters */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-stone-950/15 dark:border-stone-800">
              
              <div className="space-y-1">
                <div className="text-2xl sm:text-4xl font-extrabold text-stone-950 dark:text-white tracking-tight font-sans">
                  150+ <span className="text-xs sm:text-sm font-bold text-stone-600 dark:text-stone-400">Ton</span>
                </div>
                <p className="text-[11px] font-medium text-stone-700 dark:text-stone-400">
                  Limbah Terolah
                </p>
              </div>

              <div className="space-y-1">
                <div className="text-2xl sm:text-4xl font-extrabold text-stone-950 dark:text-white tracking-tight font-sans">
                  4.200+
                </div>
                <p className="text-[11px] font-medium text-stone-700 dark:text-stone-400">
                  Petani Terhubung
                </p>
              </div>

              <div className="space-y-1">
                <div className="text-2xl sm:text-4xl font-extrabold text-stone-950 dark:text-white tracking-tight font-sans">
                  85%
                </div>
                <p className="text-[11px] font-medium text-stone-700 dark:text-stone-400">
                  Reduksi Emisi
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
