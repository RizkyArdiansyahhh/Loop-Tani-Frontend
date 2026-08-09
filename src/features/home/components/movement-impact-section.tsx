"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

export function MovementImpactSection() {
  const t = useTranslations("movementImpact");

  return (
    <section className="w-full bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 py-16 px-4 sm:px-6 lg:px-12 transition-colors select-none font-poppins">
      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
        {/* ── TOP HEADER AREA ── */}
        <div className="text-center space-y-6 max-w-4xl mx-auto font-poppins">
          {/* Avatar Stack Badge */}
          <div className="inline-flex items-center gap-3 bg-white/90 dark:bg-stone-900/80 px-4 py-1.5 rounded-full shadow-xs text-xs font-semibold text-stone-700 dark:text-stone-300 font-poppins">
            <div className="flex -space-x-2 overflow-hidden">
              <div className="inline-block h-5 w-5 rounded-full ring-2 ring-white dark:ring-stone-900 overflow-hidden relative bg-stone-300">
                <Image
                  src="/images/agronomist-portrait.png"
                  alt="Petani 1"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="inline-block h-5 w-5 rounded-full ring-2 ring-white dark:ring-stone-900 overflow-hidden relative bg-stone-300">
                <Image
                  src="/images/farmer-struggle.png"
                  alt="Petani 2"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="inline-block h-5 w-5 rounded-full ring-2 ring-white dark:ring-stone-900 overflow-hidden relative bg-stone-300">
                <Image
                  src="/images/farm-children.png"
                  alt="Anak Tani"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <span>{t("badge")}</span>
          </div>

          {/* Main Emotional Headline */}
          <div className="space-y-2">
            <span className="block text-xs font-poppins font-bold tracking-widest text-primary dark:text-emerald-400 uppercase">
              {t("eyebrow")}
            </span>
            <h2 className="font-poppins font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight text-stone-950 dark:text-white leading-[1.12]">
              {t("title")}
            </h2>
          </div>

          {/* Subtitle Paragraph */}
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed max-w-2xl mx-auto font-poppins">
            {t("subtitle")}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 font-poppins">
            <Link
              href="/register"
              className="inline-flex items-center justify-center bg-primary text-primary-foreground rounded-full px-7 py-3.5 text-xs sm:text-sm font-poppins font-bold shadow-md cursor-pointer"
            >
              {t("ctaJoin")}
            </Link>
            <Link
              href="/marketplace"
              className="inline-flex items-center justify-center bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 rounded-full px-7 py-3.5 text-xs sm:text-sm font-poppins font-bold shadow-xs cursor-pointer"
            >
              {t("ctaLearn")}
            </Link>
          </div>
        </div>

        {/* ── 5-COLUMN STEPPED HEIGHT GRID ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 items-end">
          {/* COLUMN 1 */}
          <div className="flex flex-col gap-3 h-115 sm:h-125">
            <div className="relative rounded-sm overflow-hidden shadow-md bg-stone-950 flex-1">
              <Image
                src="/images/farmer-struggle.png"
                alt="Persoalan & Perjuangan Petani Indonesia"
                fill
                className="object-cover"
              />
            </div>
            <div className="bg-primary text-primary-foreground p-4.5 space-y-1 shadow-sm shrink-0 rounded-sm font-poppins">
              <span className="text-[10px] font-poppins font-bold uppercase tracking-wider text-emerald-100 block">
                {t("box1Title")}
              </span>
              <p className="text-xs font-poppins font-bold leading-snug">
                {t("box1Desc")}
              </p>
            </div>
          </div>

          {/* COLUMN 2 */}
          <div className="flex flex-col h-95 sm:h-105">
            <div className="relative rounded-sm overflow-hidden shadow-sm bg-stone-950 h-full">
              <Image
                src="/images/bento-farmer-tech.png"
                alt="Petani Menggunakan Teknologi"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* COLUMN 3 */}
          <div className="flex flex-col h-75 sm:h-85">
            <div className="relative rounded-sm overflow-hidden shadow-md bg-stone-950 h-full">
              <Image
                src="/images/farmer-hands-soil.png"
                alt="Simbol Harapan Pertanian Indonesia"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* COLUMN 4 */}
          <div className="flex flex-col h-95 sm:h-105">
            <div className="relative rounded-sm overflow-hidden shadow-sm bg-stone-950 h-full">
              <Image
                src="/images/bento-circular-produce.png"
                alt="Olahan Pertanian Sirkular"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* COLUMN 5 */}
          <div className="flex flex-col gap-3 h-115 sm:h-125">
            <div className="relative rounded-sm overflow-hidden shadow-md bg-stone-950 flex-1">
              <Image
                src="/images/farm-children.png"
                alt="Masa Depan Generasi Tani Indonesia"
                fill
                className="object-cover"
              />
            </div>
            <div className="bg-primary text-primary-foreground p-4.5 space-y-1 shadow-sm shrink-0 rounded-sm font-poppins">
              <span className="text-[10px] font-poppins font-bold uppercase tracking-wider text-emerald-100 block">
                {t("box2Title")}
              </span>
              <p className="text-xs font-poppins font-bold leading-snug">
                {t("box2Desc")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
