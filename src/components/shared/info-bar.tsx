"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { useScrolled } from "@/hooks/use-scrolled";
import { X } from "lucide-react";

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
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % INFO_MESSAGES.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  const hidden = scrolled || dismissed;

  return (
    <motion.div
      initial={{ height: 40, opacity: 1 }}
      animate={{
        height: hidden ? 0 : 40,
        opacity: hidden ? 0 : 1,
      }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden bg-secondary text-foreground font-semibold"
    >
      <div className="relative flex h-10 items-center justify-center px-10">
        {/* Carousel text */}
        <div className="relative h-5 flex-1 overflow-hidden text-center">
          <AnimatePresence mode="wait">
            <motion.span
              key={index}
              initial={{ y: 18, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -18, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute inset-0 flex items-center justify-center text-sm font-medium whitespace-nowrap"
            >
              {INFO_MESSAGES[index]}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Dismiss button */}
        <button
          onClick={() => setDismissed(true)}
          className="absolute right-3 rounded p-1 opacity-70 transition-opacity hover:opacity-100 cursor-pointer  "
          aria-label="Tutup info bar"
        >
          <X className="size-3.5" />
        </button>
      </div>
    </motion.div>
  );
}
