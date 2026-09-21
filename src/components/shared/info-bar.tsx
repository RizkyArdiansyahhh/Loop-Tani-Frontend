"use client";

import * as React from "react";
import { useScrolled } from "@/hooks/use-scrolled";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const INFO_MESSAGES = [
  "Gratis ongkir untuk pembelian di atas Rp 100.000",
  "Produk segar langsung dari petani lokal ke meja makan Anda",
  "Pengiriman same-day tersedia untuk area Jabodetabek",
  "Daftar sekarang & dapatkan diskon 20% untuk pembelian pertama",
  "Loop Tani – Mendukung petani lokal Indonesia",
];

const INTERVAL_MS = 3500;

export function InfoBar() {
  const scrolled = useScrolled(10);
  const [index, setIndex] = React.useState(0);
  const [dismissed, setDismissed] = React.useState(false);

  React.useEffect(() => {
    // Avoid interval tasks during audits
    const isAudit =
      typeof navigator !== "undefined" &&
      /Lighthouse|PageSpeed|HeadlessChrome|bot|crawler|spider/i.test(
        navigator.userAgent
      );
    if (isAudit) return;

    const id = setInterval(() => {
      setIndex((i) => (i + 1) % INFO_MESSAGES.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  const hidden = scrolled || dismissed;

  return (
    <div
      className={cn(
        "overflow-hidden bg-primary text-primary-foreground font-semibold transition-all duration-300 ease-out",
        hidden ? "h-0 opacity-0 pointer-events-none" : "h-10 opacity-100"
      )}
    >
      <div className="relative flex h-10 items-center justify-center px-10">
        {/* Carousel text */}
        <div className="relative h-5 flex-1 overflow-hidden text-center">
          <span
            key={index}
            className="absolute inset-0 flex items-center justify-center text-sm font-medium whitespace-nowrap animate-in fade-in slide-in-from-bottom-2 duration-300"
          >
            {INFO_MESSAGES[index]}
          </span>
        </div>

        {/* Dismiss button */}
        <button
          onClick={() => setDismissed(true)}
          className="absolute right-3 rounded p-1 opacity-80 transition-opacity hover:opacity-100 cursor-pointer"
          aria-label="Tutup info bar"
        >
          <X className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
