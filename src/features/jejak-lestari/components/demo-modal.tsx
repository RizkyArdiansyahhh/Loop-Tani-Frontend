"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DemoModal({ isOpen, onClose }: DemoModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl rounded-3xl border border-emerald-100/60 bg-white p-6 sm:p-8 shadow-2xl dark:border-emerald-950/40 dark:bg-gray-900 overflow-hidden font-poppins">
        <div className="flex flex-col sm:flex-row items-center sm:items-center gap-6 pt-1">
          {/* Left Column: Mascot SVG */}
          <div className="relative shrink-0 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-emerald-500/10 blur-xl dark:bg-emerald-500/20" />
            <img
              src="/images/maskot.svg"
              alt="Maskot LoopTani"
              className="relative h-36 w-36 sm:h-48 sm:w-48 object-contain drop-shadow-sm"
            />
          </div>

          {/* Right Column: Title & Text Content */}
          <div className="flex-1 space-y-2 text-center sm:text-left pr-4">
            <DialogTitle className="font-fraunces text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-snug">
              Halo! Mohon Maaf...
            </DialogTitle>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-poppins pt-1">
              Halaman ini saat ini menampilkan <strong className="text-gray-800 dark:text-gray-200">simulasi 5 transaksi pesanan eco</strong> khusus untuk kebutuhan penilaian dewan juri, agar seluruh kalkulasi dampak lingkungan dan fitur ekspor laporan dapat diuji secara langsung tanpa perlu melakukan transaksi baru terlebih dahulu.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
