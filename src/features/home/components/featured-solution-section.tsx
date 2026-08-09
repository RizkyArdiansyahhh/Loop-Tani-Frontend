"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import CountUp from "@/components/CountUp";

export function FeaturedSolutionSection() {
  const t = useTranslations("featuredSolution");

  return (
    <section className="w-full bg-background text-foreground py-16 sm:py-24 px-4 sm:px-6 lg:px-12 border-b border-border transition-colors select-none font-poppins">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* ── CARD 1: TOP WIDE BENTO CARD ── */}
        <div className="bg-secondary/35 dark:bg-card text-card-foreground rounded-lg p-8 sm:p-12 border border-border shadow-xs relative overflow-hidden font-poppins">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5">
              {/* Category Label */}
              <span className="text-xs font-mono font-bold tracking-widest text-primary uppercase block">
                {t("bento1Label")}
              </span>

              {/* Title */}
              <h2 className="font-poppins text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15]">
                {t("bento1Title")}
              </h2>

              {/* Paragraph */}
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xl font-poppins">
                {t("bento1Desc")}
              </p>

              {/* CTA Button */}
              <div className="pt-2 font-poppins">
                <Link
                  href="/marketplace"
                  className="inline-flex items-center justify-between gap-4 bg-primary text-primary-foreground hover:bg-emerald-700 rounded-lg px-6 py-3 text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
                >
                  <span>{t("bento1Cta")}</span>
                  <span className="text-base">&rarr;</span>
                </Link>
              </div>
            </div>

            {/* Right Content: 2 Side-by-Side Images */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="relative h-64 sm:h-80 w-full rounded-lg overflow-hidden shadow-md border border-border group bg-muted">
                <Image
                  src="https://res.cloudinary.com/dy9gtwsh7/image/upload/v1786247535/pexels-ink-spreader-292689809-18436545_vtoymj.jpg"
                  alt="Petani Modern LoopTani"
                  fill
                  className="object-cover "
                />
              </div>
              <div className="relative h-64 sm:h-80 w-full rounded-lg overflow-hidden shadow-md border border-border group bg-muted">
                <Image
                  src="/images/bento-circular-produce.png"
                  alt="Hasil Olahan Organik"
                  fill
                  className="object-cover "
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── BOTTOM ROW: 2 BENTO CARDS ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-poppins">
          {/* CARD 2: BOTTOM-LEFT DARK BENTO CARD */}
          <div className="lg:col-span-5 bg-card text-card-foreground rounded-lg p-8 sm:p-10 border border-border shadow-xl flex flex-col justify-between space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-mono tracking-widest text-primary uppercase font-bold block">
                {t("bento2Label")}
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight leading-snug font-poppins">
                {t("bento2Title")}
              </h3>
            </div>

            {/* Clean Visual Image Container */}
            <div className="relative rounded-lg overflow-hidden aspect-16/10 border border-border bg-muted group shadow-inner">
              <Image
                src="https://res.cloudinary.com/dy9gtwsh7/image/upload/v1786247539/pexels-florence-mathiot-417781-37078680_njyqk9.jpg"
                alt="Analisis Lapangan AI LoopTani"
                fill
                className="object-cover "
              />
            </div>
          </div>

          {/* CARD 3: BOTTOM-RIGHT STATS BENTO CARD */}
          <div className="lg:col-span-7 bg-secondary/35 dark:bg-card text-card-foreground rounded-lg p-8 sm:p-10 border border-border shadow-xs flex flex-col justify-between space-y-8 font-poppins">
            <div className="space-y-3">
              <span className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase font-bold block">
                {t("bento3Label")}
              </span>
              <h3 className="font-poppins text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
                {t("bento3Title")}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-lg font-poppins">
                {t("bento3Desc")}
              </p>
            </div>

            {/* 3 Column Statistics Counters */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-6 border-t border-border font-poppins">
              <div className="space-y-1">
                <div className="text-2xl sm:text-4xl lg:text-6xl font-bold tracking-tight font-poppins text-foreground leading-none whitespace-nowrap">
                  <CountUp from={0} to={150} duration={2.5} />+{" "}
                  <span className="text-xs sm:text-sm font-semibold text-muted-foreground">
                    {t("ton")}
                  </span>
                </div>
                <p className="text-xs font-semibold text-muted-foreground pt-1">
                  {t("stat1")}
                </p>
              </div>

              <div className="space-y-1">
                <div className="text-2xl sm:text-4xl lg:text-6xl font-bold tracking-tight font-poppins text-foreground leading-none whitespace-nowrap">
                  <CountUp from={0} to={4200} separator="." duration={2.5} />+
                </div>
                <p className="text-xs font-semibold text-muted-foreground pt-1">
                  {t("stat2")}
                </p>
              </div>

              <div className="space-y-1">
                <div className="text-2xl sm:text-4xl lg:text-6xl font-bold tracking-tight font-poppins text-foreground leading-none whitespace-nowrap">
                  <CountUp from={0} to={85} duration={2.5} />%
                </div>
                <p className="text-xs font-semibold text-muted-foreground pt-1">
                  {t("stat3")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
