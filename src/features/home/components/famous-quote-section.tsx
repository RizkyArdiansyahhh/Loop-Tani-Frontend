"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";

export function FamousQuoteSection() {
  const t = useTranslations("famousQuote");

  return (
    <section className="w-full bg-background text-primary-foreground py-20 sm:py-28 px-4 sm:px-6 lg:px-12 relative overflow-hidden border-y border-border select-none font-poppins">
      
      {/* ── SOLID GREEN SWEEP FROM LEFT TO RIGHT ── */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-250px 0px" }}
        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        style={{ originX: 0, transformOrigin: "left center" }}
        className="absolute inset-0 bg-primary pointer-events-none z-0"
      />

      <div className="max-w-6xl mx-auto space-y-12 sm:space-y-16 relative z-10 font-poppins">
        {/* ── TOP HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-250px 0px" }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-center space-y-3 max-w-2xl mx-auto"
        >
          <h2 className="font-poppins text-3xl sm:text-5xl font-bold tracking-tight text-primary-foreground leading-tight">
            {t("title")}
          </h2>
        </motion.div>

        {/* ── SLANTED BANNER ── */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1, rotate: -1 }}
          viewport={{ once: true, margin: "-250px 0px" }}
          transition={{
            duration: 0.75,
            delay: 0.3,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{ originX: 0, transformOrigin: "left center" }}
          className="w-full bg-secondary text-secondary-foreground font-extrabold uppercase py-3.5 font-poppins text-xs sm:text-sm tracking-wider shadow-2xl overflow-hidden my-6"
        >
          <div className="flex items-center gap-8 whitespace-nowrap overflow-x-hidden justify-center text-center">
            <span>{t("banner")}</span>
          </div>
        </motion.div>

        {/* ── CENTER HERO QUOTE DISPLAY ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-250px 0px" }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative rounded-2xl overflow-hidden min-h-120 sm:min-h-135 border border-border shadow-2xl flex items-center p-8 sm:p-14 bg-card text-card-foreground"
        >
          {/* Full-width Background Image */}
          <Image
            src="/images/bismarck-portrait.png"
            alt="Otto von Bismarck"
            fill
            className="object-cover object-[75%_15%] brightness-105 contrast-105"
          />

          {/* Targeted Dark Gradient Overlay */}
          <div className="absolute inset-y-0 left-0 w-full sm:w-8/12 bg-linear-to-r from-stone-950/95 via-stone-950/85 to-transparent pointer-events-none z-0" />
          <div className="absolute inset-0 bg-linear-to-t from-stone-950/80 via-transparent to-transparent sm:hidden pointer-events-none z-0" />

          {/* Overlaid Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-250px 0px" }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="relative z-10 max-w-xl sm:max-w-2xl space-y-6 text-left font-poppins"
          >
            <blockquote className="font-poppins text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-snug sm:leading-relaxed tracking-tight">
              &ldquo;{t("quote")}&rdquo;
            </blockquote>

            <div className="space-y-1 pt-2 font-poppins">
              <span className="text-sm sm:text-base font-bold text-secondary font-poppins uppercase tracking-wider block">
                {t("author")}
              </span>
              <span className="text-xs text-stone-300 font-poppins block">
                {t("role")}
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* ── BOTTOM OVAL PILL BUTTON ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-250px 0px" }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center pt-4 font-poppins"
        >
          <Link
            href="/marketplace"
            className="inline-flex items-center justify-between gap-4 bg-primary-foreground hover:bg-stone-100 text-primary rounded-full px-8 py-3.5 text-xs sm:text-sm font-poppins font-bold shadow-xl cursor-pointer"
          >
            <span>{t("cta")}</span>
            <div className="bg-primary p-1.5 rounded-full">
              <ArrowRight className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
