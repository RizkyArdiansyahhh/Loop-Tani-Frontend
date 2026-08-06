"use client";

import Image from "next/image";
import { ScrollVelocityRow } from "@/components/ui/scroll-based-velocity";

export function SingleVelocityBanner() {
  return (
    <div className="w-full py-6 sm:py-8 bg-primary text-primary-foreground shadow-xs overflow-hidden select-none">
      <ScrollVelocityRow baseVelocity={3}>
        <div className="flex items-center gap-8 px-4 font-extrabold text-base sm:text-xl md:text-2xl lg:text-4xl tracking-wider uppercase font-poppins text-white">
          <span>Ekonomi Hijau Pertanian Indonesia</span>
          <Image
            src="/images/logo2.png"
            alt="LoopTani Logo"
            width={120}
            height={32}
            className="h-7 sm:h-8 w-auto object-contain shrink-0"
          />
          <span>Ekosistem Pertanian Bebas Emisi</span>
          <Image
            src="/images/logo2.png"
            alt="LoopTani Logo"
            width={120}
            height={32}
            className="h-7 sm:h-8 w-auto object-contain shrink-0"
          />
          <span>Reduksi Jejak Karbon Terukur</span>
          <Image
            src="/images/logo2.png"
            alt="LoopTani Logo"
            width={120}
            height={32}
            className="h-7 sm:h-8 w-auto object-contain shrink-0"
          />
          <span>Teknologi Sirkular Terpadu</span>
          <Image
            src="/images/logo2.png"
            alt="LoopTani Logo"
            width={120}
            height={32}
            className="h-7 sm:h-8 w-auto object-contain shrink-0"
          />
        </div>
      </ScrollVelocityRow>
    </div>
  );
}
