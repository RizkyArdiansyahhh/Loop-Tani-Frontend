"use client";

import Image from "next/image";
import Link from "next/link";
import CountUp from "@/components/CountUp";

export function FeaturedSolutionSection() {
  return (
    <section className="w-full bg-background text-foreground py-16 sm:py-24 px-4 sm:px-6 lg:px-12 border-b border-border transition-colors select-none font-poppins">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* ── CARD 1: TOP WIDE BENTO CARD (THEME SECONDARY / CARD PALETTE - ROUNDED-LG) ── */}
        <div className="bg-secondary/35 dark:bg-card text-card-foreground rounded-lg p-8 sm:p-12 border border-border shadow-xs relative overflow-hidden font-poppins">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5">
              {/* Category Label */}
              <span className="text-xs font-mono font-bold tracking-widest text-primary uppercase block">
                Ekosistem Sirkular Terpadu
              </span>

              {/* Title */}
              <h2 className="font-poppins text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15]">
                Solusi Holistik Pertanian: Inovasi AI, Olahan Sirkular, &amp;
                Komunitas Terhubung.
              </h2>

              {/* Paragraph */}
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xl font-poppins">
                LoopTani menjembatani petani, peternak, dan mitra industri untuk
                mentransformasi sisa panen organik menjadi pupuk bio-fertilizer
                dan pakan bernilai ekonomi tinggi secara berkelanjutan.
              </p>

              {/* CTA Button */}
              <div className="pt-2 font-poppins">
                <Link
                  href="/marketplace"
                  className="inline-flex items-center justify-between gap-4 bg-primary text-primary-foreground hover:bg-emerald-700 rounded-lg px-6 py-3 text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
                >
                  <span>Jelajahi Ekosistem</span>
                  <span className="text-base">&rarr;</span>
                </Link>
              </div>
            </div>

            {/* Right Content: 2 Side-by-Side Images */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="relative h-64 sm:h-80 w-full rounded-lg overflow-hidden shadow-md border border-border group bg-muted">
                <Image
                  src="/images/bento-farmer-tech.png"
                  alt="Petani Modern LoopTani"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="relative h-64 sm:h-80 w-full rounded-lg overflow-hidden shadow-md border border-border group bg-muted">
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-poppins">
          {/* CARD 2: BOTTOM-LEFT DARK BENTO CARD (5 cols - ROUNDED-LG) */}
          <div className="lg:col-span-5 bg-card text-card-foreground rounded-lg p-8 sm:p-10 border border-border shadow-xl flex flex-col justify-between space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-mono tracking-widest text-primary uppercase font-bold block">
                PRESISI TERVERIFIKASI
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight leading-snug font-poppins">
                Teknologi Presisi Loopi AI dalam Aksi Nyata di Lapangan.
              </h3>
            </div>

            {/* Clean Visual Image Container */}
            <div className="relative rounded-lg overflow-hidden aspect-16/10 border border-border bg-muted group shadow-inner">
              <Image
                src="/images/bento-ai-crops.png"
                alt="Analisis Lapangan AI LoopTani"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

          {/* CARD 3: BOTTOM-RIGHT STATS BENTO CARD (7 cols - ROUNDED-LG) */}
          <div className="lg:col-span-7 bg-secondary/35 dark:bg-card text-card-foreground rounded-lg p-8 sm:p-10 border border-border shadow-xs flex flex-col justify-between space-y-8 font-poppins">
            <div className="space-y-3">
              <span className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase font-bold block">
                IMPACT HIGHLIGHTS
              </span>
              <h3 className="font-poppins text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
                Capaian &amp; Dampak Nyata Ekosistem LoopTani.
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-lg font-poppins">
                Metrik pertumbuhan dan kontribusi transparan dari seluruh
                jaringan mitra tani, peternak, dan fasilitas sirkular di
                berbagai daerah di Indonesia.
              </p>
            </div>

            {/* 3 Column Statistics Counters (COMPACT SINGLE-LINE NO-WRAP HIGHLIGHT) */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-6 border-t border-border font-poppins">
              <div className="space-y-1">
                <div className="text-2xl sm:text-4xl lg:text-6xl font-bold tracking-tight font-poppins text-foreground leading-none whitespace-nowrap">
                  <CountUp from={0} to={150} duration={2.5} />+{" "}
                  <span className="text-xs sm:text-sm font-semibold text-muted-foreground">
                    Ton
                  </span>
                </div>
                <p className="text-xs font-semibold text-muted-foreground pt-1">
                  Limbah Terolah
                </p>
              </div>

              <div className="space-y-1">
                <div className="text-2xl sm:text-4xl lg:text-6xl font-bold tracking-tight font-poppins text-foreground leading-none whitespace-nowrap">
                  <CountUp from={0} to={4200} separator="." duration={2.5} />+
                </div>
                <p className="text-xs font-semibold text-muted-foreground pt-1">
                  Petani Terhubung
                </p>
              </div>

              <div className="space-y-1">
                <div className="text-2xl sm:text-4xl lg:text-6xl font-bold tracking-tight font-poppins text-foreground leading-none whitespace-nowrap">
                  <CountUp from={0} to={85} duration={2.5} />%
                </div>
                <p className="text-xs font-semibold text-muted-foreground pt-1">
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
