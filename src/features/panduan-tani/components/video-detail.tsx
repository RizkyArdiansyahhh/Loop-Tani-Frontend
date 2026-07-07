"use client";

import React, { useState } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Sparkles, ArrowLeft, Play, Clock, Award, ShoppingBag, User, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PanduanContent } from "../lib/dummy-data";
import { toast } from "sonner";

interface VideoDetailProps {
  video: PanduanContent;
  onEarnPoints: (points: number) => void;
}

export default function VideoDetail({ video, onEarnPoints }: VideoDetailProps) {
  const t = useTranslations("panduan");
  const router = useRouter();
  const [videoCompleted, setVideoCompleted] = useState(false);

  const handleMarkCompleted = () => {
    if (videoCompleted) return;
    setVideoCompleted(true);
    onEarnPoints(20); // Award points
    toast.success(t("congratsTitle"), {
      description: t("pointsEarnedToast", { points: 20 }),
      icon: <Sparkles className="h-5 w-5 fill-current text-yellow-500" />,
      duration: 4000,
    });
  };

  return (
    <article className="min-h-screen bg-gray-50/50 pb-20 dark:bg-gray-950">
      {/* Back Navigation */}
      <div className="mx-auto max-w-4xl px-4 pt-8">
        <button
          onClick={() => router.back()}
          className="group mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-650 hover:text-primary transition-colors dark:text-gray-400 dark:hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Kembali ke Panduan
        </button>
      </div>

      {/* Main Container */}
      <div className="mx-auto max-w-4xl px-4">
        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xs dark:border-gray-800 dark:bg-gray-900">
          
          {/* Responsive YouTube Player Iframe */}
          <div className="relative aspect-[16/9] w-full bg-black">
            {video.youtubeId ? (
              <iframe
                src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-white">
                <p>Video ID tidak valid atau tidak ditemukan.</p>
              </div>
            )}
          </div>

          {/* Details & Info Section */}
          <div className="p-6 sm:p-10">
            {/* Meta Info */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground border-b border-gray-100 pb-5 dark:border-gray-800">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 font-medium">
                  <Clock className="h-4 w-4 text-primary" />
                  Durasi: {video.duration} menit
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-gray-300" />
                <span className="flex items-center gap-1.5 font-semibold text-amber-600 dark:text-amber-400">
                  <Sparkles className="h-4 w-4 fill-current" />
                  +{video.points} LP Reward
                </span>
              </div>

              {/* Point Status Tracker */}
              {videoCompleted ? (
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-2xs font-bold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Reward LP Berhasil Didapat
                </span>
              ) : (
                <span className="animate-pulse rounded-full bg-amber-50 px-3 py-1 text-2xs font-bold text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
                  ⚠️ Klik tombol "Tandai Selesai Menonton" di bawah untuk klaim reward
                </span>
              )}
            </div>

            {/* Title - Custom FRAUNCES font */}
            <h1 className="font-fraunces text-3xl font-bold leading-tight text-gray-900 dark:text-white mb-6">
              {video.title}
            </h1>

            {/* Author/Uploader Card */}
            <div className="mb-8 flex items-center gap-3 rounded-2xl bg-gray-50 p-4 dark:bg-gray-950/40">
              <img
                src={video.uploader.avatarUrl || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&h=100&q=80"}
                alt={video.uploader.name}
                className="h-11 w-11 rounded-full object-cover ring-2 ring-white dark:ring-gray-800 shadow-sm"
              />
              <div className="flex flex-col">
                <span className="text-2xs text-muted-foreground leading-none mb-1">
                  {t("uploadBy")}
                </span>
                <span className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1">
                  {video.uploader.name}
                  {video.uploader.role === "Petani Ahli" && (
                    <Award className="h-3.5 w-3.5 text-yellow-500 fill-current" />
                  )}
                </span>
                <span className="text-3xs text-muted-foreground leading-none">
                  {video.uploader.role}
                </span>
              </div>
            </div>

            {/* Video Description & Transkrip / Key Points */}
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Deskripsi Praktik
                </h3>
                <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                  {video.content}
                </p>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-5 dark:border-gray-800 dark:bg-gray-950/20">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                  Transkrip & Poin-Poin Penting
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-xs text-gray-600 dark:text-gray-400">
                  <li><strong>0:00 - 1:30</strong> — Pengenalan alat/bahan penunjang yang dibutuhkan di lapangan.</li>
                  <li><strong>1:30 - 3:45</strong> — Tahap dekomposisi / pengarangan dengan pembakaran ramah lingkungan.</li>
                  <li><strong>3:45 - 5:15</strong> — Teknik pencetakan padat dan rasio campuran tapioka perekat.</li>
                  <li><strong>5:15 - selesai</strong> — Penjemuran alami dan panduan pengetesan kualitas daya bakar hasil akhir.</li>
                </ul>
              </div>
            </div>

            {/* CTA Section */}
            <div className="mt-10 rounded-3xl bg-radial from-emerald-50 to-white border border-emerald-100/50 p-6 sm:p-8 text-center dark:from-emerald-950/10 dark:to-gray-900 dark:border-emerald-900/20">
              <h3 className="font-fraunces text-xl font-bold text-gray-900 dark:text-white mb-2">
                Siap mempraktikkan isi video ini?
              </h3>
              <p className="text-xs text-muted-foreground max-w-md mx-auto mb-6">
                Beli perlengkapan pendukung atau cari alat tani bekas / bahan baku organik di marketplace pertanian LoopTani.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  asChild
                  className="w-full sm:w-auto rounded-xl bg-primary text-white font-semibold flex items-center justify-center gap-2 px-6 py-5"
                >
                  <Link href={`/marketplace/produk/${video.relatedListingSlug}`}>
                    <ShoppingBag className="h-5 w-5" />
                    {t("ctaPractice")}
                  </Link>
                </Button>

                {!videoCompleted ? (
                  <Button
                    onClick={handleMarkCompleted}
                    className="w-full sm:w-auto rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold flex items-center justify-center gap-2 px-6 py-5 shadow-sm"
                  >
                    <Sparkles className="h-4 w-4 fill-current text-yellow-200" />
                    {t("markCompleted")}
                  </Button>
                ) : (
                  <Button
                    disabled
                    className="w-full sm:w-auto rounded-xl bg-emerald-50 text-emerald-700 font-semibold border-emerald-150 border flex items-center justify-center gap-2 px-6 py-5 cursor-default opacity-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/40"
                  >
                    ✓ Tonton Selesai
                  </Button>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </article>
  );
}
