"use client";

import Image from "next/image";
import Link from "next/link";

export function MovementImpactSection() {
  return (
    <section className="w-full bg-emerald-50/40 dark:bg-emerald-950/20 text-stone-900 dark:text-stone-100 py-12 px-4 sm:px-6 lg:px-12 transition-colors select-none">
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
            <span>Ribuan Petani Terbantu • Gerakan Sirkular Bersama</span>
          </div>

          {/* Main Emotional Headline */}
          <div className="space-y-2">
            <span className="block text-xs font-poppins font-bold tracking-widest text-primary dark:text-emerald-400 uppercase">
              UNTUK MEREKA. UNTUK EKONOMI INDONESIA
            </span>
            <h2 className="font-poppins font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight text-stone-950 dark:text-white leading-[1.12]">
              Satu Inovasi. Satu Harapan. Untuk Pertanian Indonesia yang
              Berdaya.
            </h2>
          </div>

          {/* Subtitle Paragraph */}
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed max-w-2xl mx-auto font-poppins">
            Mentransformasi setiap tantangan &amp; sisa panen menjadi peluang
            ekonomi riil bagi petani lokal. Karena setiap kg limbah yang kita
            kelola adalah satu senyuman baru untuk masa depan tanah air kita.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 font-poppins">
            <Link
              href="/register"
              className="inline-flex items-center justify-center bg-primary text-primary-foreground rounded-full px-7 py-3.5 text-xs sm:text-sm font-poppins font-bold shadow-md cursor-pointer"
            >
              Gabung Gerakan Sekarang
            </Link>
            <Link
              href="/marketplace"
              className="inline-flex items-center justify-center bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 rounded-full px-7 py-3.5 text-xs sm:text-sm font-poppins font-bold shadow-xs cursor-pointer"
            >
              Pelajari Cara Kerja
            </Link>
          </div>
        </div>

        {/* ── 5-COLUMN STEPPED HEIGHT GRID (NO HOVER & PRIMARY GREEN PALETTE) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 items-end">
          {/* COLUMN 1 (FAR LEFT - TALLEST: 500px) */}
          <div className="flex flex-col gap-3 h-115 sm:h-125">
            <div className="relative rounded-sm overflow-hidden shadow-md bg-stone-950 flex-1">
              <Image
                src="/images/farmer-struggle.png"
                alt="Persoalan & Perjuangan Petani Indonesia"
                fill
                className="object-cover"
              />
            </div>

            {/* Bottom Accent Green Box (Hijau Primary) */}
            <div className="bg-primary text-primary-foreground p-4.5 space-y-1 shadow-sm shrink-0 rounded-sm font-poppins">
              <span className="text-[10px] font-poppins font-bold uppercase tracking-wider text-emerald-100 block">
                UNTUK MEREKA
              </span>
              <p className="text-xs font-poppins font-bold leading-snug">
                Membantu 4.200+ Petani Lokal Meraih Kemandirian Pupuk &amp;
                Pakan.
              </p>
            </div>
          </div>

          {/* COLUMN 2 (LEFT MIDDLE - MEDIUM: 420px) */}
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

          {/* COLUMN 3 (CENTER - SHORTEST / V-DIP: 340px) */}
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

          {/* COLUMN 4 (RIGHT MIDDLE - MEDIUM: 420px) */}
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

          {/* COLUMN 5 (FAR RIGHT - TALLEST: 500px) */}
          <div className="flex flex-col gap-3 h-115 sm:h-125">
            <div className="relative rounded-sm overflow-hidden shadow-md bg-stone-950 flex-1">
              <Image
                src="/images/farm-children.png"
                alt="Masa Depan Generasi Tani Indonesia"
                fill
                className="object-cover"
              />
            </div>

            {/* Bottom Accent Green Box (Hijau Primary) */}
            <div className="bg-primary text-primary-foreground p-4.5 space-y-1 shadow-sm shrink-0 rounded-sm font-poppins">
              <span className="text-[10px] font-poppins font-bold uppercase tracking-wider text-emerald-100 block">
                UNTUK INDONESIA &amp; EKONOMI
              </span>
              <p className="text-xs font-poppins font-bold leading-snug">
                Menciptakan Pertumbuhan Sirkular Berkelanjutan di Nusantara.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
