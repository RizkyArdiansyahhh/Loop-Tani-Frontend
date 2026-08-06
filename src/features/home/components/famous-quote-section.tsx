"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export function FamousQuoteSection() {
  return (
    <motion.section
      initial={{ backgroundColor: "#020a05", opacity: 0.9 }}
      whileInView={{ backgroundColor: "#071910", opacity: 1 }}
      viewport={{ once: false, amount: 0.25 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="w-full text-stone-100 py-20 sm:py-28 px-4 sm:px-6 lg:px-12 relative overflow-hidden border-y border-emerald-900/40 select-none"
    >
      {/* Dynamic Background Glow Effect on Viewport Entry */}
      <motion.div
        initial={{ scale: 0.4, opacity: 0 }}
        whileInView={{ scale: 1.3, opacity: 0.25 }}
        viewport={{ once: false, amount: 0.25 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full bg-emerald-500 blur-[130px] pointer-events-none z-0"
      />

      <div className="max-w-6xl mx-auto space-y-12 sm:space-y-16 relative z-10">
        
        {/* ── TOP HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="text-center space-y-3 max-w-2xl mx-auto"
        >
          <h2 className="font-poppins text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Keterkaitan Perdagangan & Pertanian
          </h2>
        </motion.div>

        {/* ── SLANTED BANNER (STATIC TEXT, NO LOOP ANIMATION) ── */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0, rotate: 0 }}
          whileInView={{ scaleX: 1, opacity: 1, rotate: -1 }}
          viewport={{ once: false, amount: 0.1 }}
          transition={{
            duration: 0.85,
            delay: 0.15,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{ originX: 0, transformOrigin: "left center" }}
          className="w-full bg-emerald-400 text-stone-950 font-extrabold uppercase py-3.5 font-poppins text-xs sm:text-sm tracking-wider shadow-2xl overflow-hidden my-6"
        >
          <div className="flex items-center gap-8 whitespace-nowrap overflow-x-hidden justify-center text-center">
            <span>
              PERDAGANGAN • PERTANIAN • KEBERLANJUTAN • BERKEMBANG BERSAMA • EKONOMI SIRKULAR
            </span>
          </div>
        </motion.div>

        {/* ── CENTER HERO QUOTE DISPLAY (NO HOVER SCALE) ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="relative rounded-2xl overflow-hidden min-h-120 sm:min-h-135 border border-emerald-500/30 shadow-2xl flex items-center p-8 sm:p-14 bg-stone-950"
        >
          {/* Full-width Background Image positioned to highlight face on the right (No hover scale) */}
          <Image
            src="/images/bismarck-portrait.png"
            alt="Otto von Bismarck"
            fill
            className="object-cover object-[75%_15%] brightness-105 contrast-105"
          />

          {/* Targeted Dark Gradient Overlay (Only behind text on left) */}
          <div className="absolute inset-y-0 left-0 w-full sm:w-8/12 bg-linear-to-r from-stone-950/95 via-stone-950/85 to-transparent pointer-events-none z-0" />
          <div className="absolute inset-0 bg-linear-to-t from-stone-950/80 via-transparent to-transparent sm:hidden pointer-events-none z-0" />

          {/* Overlaid Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="relative z-10 max-w-xl sm:max-w-2xl space-y-6 text-left"
          >
            <blockquote className="font-poppins text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-snug sm:leading-relaxed tracking-tight">
              &ldquo;Adalah suatu kesalahan untuk memisahkan perdagangan dan bisnis dari pertanian. Kita harus berkembang bersama, atau kita akan mati bersama.&rdquo;
            </blockquote>

            <div className="space-y-1 pt-2">
              <span className="text-sm sm:text-base font-bold text-emerald-400 font-sans uppercase tracking-wider block">
                — Otto von Bismarck
              </span>
              <span className="text-xs text-stone-300 font-sans block">
                Negarawan & Tokoh Sejarah (1815 – 1898)
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* ── BOTTOM OVAL PILL BUTTON (NO HOVER TRANSLATE) ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.65 }}
          className="text-center pt-4"
        >
          <Link
            href="/marketplace"
            className="inline-flex items-center justify-between gap-4 bg-white hover:bg-stone-100 text-stone-950 rounded-full px-8 py-3.5 text-xs sm:text-sm font-poppins font-bold shadow-xl cursor-pointer"
          >
            <span>Jelajahi Ekosistem LoopTani</span>
            <div className="bg-stone-950 p-1.5 rounded-full">
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </div>
          </Link>
        </motion.div>

      </div>
    </motion.section>
  );
}
