"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus, BookOpen, Video, Search, SlidersHorizontal, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoopPointsWidget } from "./looppoints-widget";
import { ContentCard } from "./content-card";
import { UploadModal } from "./upload-modal";
import Breadcrumbs from "@/components/shared/breadcrumbs";
import { useContents } from "../hooks/use-contents";
import { usePoints } from "../hooks/use-points";
import { authClient } from "@/lib/auth-client";
import { Link } from "@/i18n/navigation";
import { toast } from "sonner";

export default function PanduanTani() {
  const t = useTranslations("panduan");
  const { data: session, isPending: isSessionLoading } = authClient.useSession();

  const userRole = (session?.user as any)?.role;
  const isSellerOrAdmin =
    userRole === "ADMIN" ||
    userRole === "SELLER" ||
    (Array.isArray(userRole) &&
      (userRole.includes("ADMIN") || userRole.includes("SELLER")));

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    "semua" | "limbah" | "olahan" | "alat"
  >("semua");
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    "semua" | "pemula" | "menengah"
  >("semua");
  const [activeTab, setActiveTab] = useState<"artikel" | "video">("artikel");

  // Upload modal state
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Fetch points from backend (enabled only if logged in)
  const { data: pointAccount } = usePoints(!!session);
  const points = pointAccount?.totalPoint ?? 0;

  // Fetch contents from backend API
  const { data: contentResponse, isLoading } = useContents({
    type: activeTab === "artikel" ? "ARTICLE" : "VIDEO",
    category:
      selectedCategory === "semua"
        ? undefined
        : (selectedCategory.toUpperCase() as any),
    difficulty:
      selectedDifficulty === "semua"
        ? undefined
        : (selectedDifficulty.toUpperCase() as any),
    search: searchQuery || undefined,
  });

  const contents = contentResponse?.data || [];

  const handleRedeemPoints = (cost: number, rewardName: string) => {
    // Basic local simulation of voucher point deduction (for demo/points shop interface)
    if (points >= cost) {
      toast.success(t("redeemPoints.redeemSuccess", { reward: rewardName }));
    }
  };

  const handleAddContentSuccess = () => {
    // When a seller or admin uploads successfully, we close modal and notify
    toast.success("Konten Berhasil Diajukan!", {
      description:
        "Konten Anda telah masuk ke sistem dan akan ditinjau oleh Admin.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24 dark:bg-gray-950">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-white border-b border-gray-100 py-12 px-6 dark:bg-gray-900 dark:border-gray-800">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="font-fraunces text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">
                {t("title")}
              </h1>
              <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
                {t("subtitle")}
              </p>
            </div>
            {session && isSellerOrAdmin && (
              <Button
                onClick={() => setIsUploadOpen(true)}
                className="w-full md:w-auto rounded-2xl bg-primary text-white font-semibold flex items-center justify-center gap-2 px-6 py-5 shadow-xs transition-all hover:bg-emerald-700"
              >
                <Plus className="h-5 w-5" />
                {t("uploadModal.title")}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-10 space-y-8">
        <Breadcrumbs items={[{ label: "Panduan Tani" }]} />

        {/* Highlighted LoopPoints Dashboard Widget or Guest CTA Card */}
        <section className="bg-transparent">
          <h2 className="sr-only">LoopPoints Dashboard</h2>
          {isSessionLoading ? (
            <div className="grid gap-6 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-[220px] rounded-3xl bg-white border border-gray-100 dark:border-gray-800 dark:bg-gray-900 animate-pulse" />
              ))}
            </div>
          ) : session ? (
            <LoopPointsWidget points={points} onRedeem={handleRedeemPoints} />
          ) : (
            <div className="rounded-3xl border border-emerald-100 bg-emerald-50/40 p-6 sm:p-10 shadow-xs dark:border-emerald-950/20 dark:bg-emerald-950/10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex flex-col md:flex-row gap-6 items-start text-left">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                  <Sparkles className="h-7 w-7 fill-current animate-pulse" />
                </div>
                <div>
                  <span className="text-3xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest leading-none">
                    Mode Belajar Tamu
                  </span>
                  <h3 className="font-fraunces text-2xl font-bold text-gray-900 dark:text-white mt-1 mb-2">
                    {t("guestCTA.title")}
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
                    {t("guestCTA.description")}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3.5 w-full md:w-auto shrink-0">
                <Link href="/login" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto rounded-2xl bg-primary hover:bg-emerald-700 text-white font-bold px-6 py-5.5 shadow-md flex items-center justify-center gap-2 text-sm">
                    {t("guestCTA.loginButton")}
                  </Button>
                </Link>
                <Link href="/register" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full sm:w-auto rounded-2xl border-gray-250 bg-white text-gray-700 font-bold px-6 py-5.5 hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-750 transition-all text-sm">
                    {t("guestCTA.registerButton")}
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* Content Tabs (Articles vs Videos) */}
        <div className="flex flex-col md:flex-row gap-5 items-stretch md:items-center justify-between border-t border-gray-100 pt-8 dark:border-gray-800">
          {/* Custom Tabs Slider */}
          <div className="flex p-1.5 rounded-2xl bg-white border border-gray-100 dark:bg-gray-900 dark:border-gray-800 w-full md:w-auto">
            <button
              onClick={() => setActiveTab("artikel")}
              className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${
                activeTab === "artikel"
                  ? "bg-primary text-white shadow-xs"
                  : "text-muted-foreground hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <BookOpen className="h-4 w-4" />
              {t("tabArticles")}
            </button>
            <button
              onClick={() => setActiveTab("video")}
              className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${
                activeTab === "video"
                  ? "bg-primary text-white shadow-xs"
                  : "text-muted-foreground hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Video className="h-4 w-4" />
              {t("tabVideos")}
            </button>
          </div>

          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute top-1/2 left-3.5 h-4.5 w-4.5 -translate-y-1/2 text-gray-450 dark:text-gray-550" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari artikel, video, pembuat..."
              className="w-full pl-10 rounded-2xl border-gray-200 bg-white"
            />
          </div>
        </div>

        {/* Filters Section */}
        <div className="flex flex-wrap gap-4 items-center justify-between bg-white border border-gray-100 p-5 rounded-3xl dark:bg-gray-900 dark:border-gray-800">
          {/* Category Badges Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-gray-700 mr-2 dark:text-gray-300 flex items-center gap-1">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              {t("filterCategory")}:
            </span>
            <button
              onClick={() => setSelectedCategory("semua")}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition-all ${
                selectedCategory === "semua"
                  ? "bg-primary/10 border-primary text-primary font-bold"
                  : "border-gray-200 bg-transparent text-gray-750 hover:bg-gray-50 dark:border-gray-750 dark:text-gray-300"
              }`}
            >
              {t("filterAll")}
            </button>
            {(["limbah", "olahan", "alat"] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition-all ${
                  selectedCategory === cat
                    ? "bg-primary/10 border-primary text-primary font-bold"
                    : "border-gray-200 bg-transparent text-gray-750 hover:bg-gray-50 dark:border-gray-750 dark:text-gray-300"
                }`}
              >
                {t(`categoryLabel.${cat}`)}
              </button>
            ))}
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
              {t("filterDifficulty")}:
            </span>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value as any)}
              className="h-9 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold focus-visible:outline-hidden dark:bg-gray-900 dark:border-gray-800"
            >
              <option value="semua">Semua Kesulitan</option>
              <option value="pemula">{t("difficultyLabel.pemula")}</option>
              <option value="menengah">{t("difficultyLabel.menengah")}</option>
            </select>
          </div>
        </div>

        {/* Content Grid */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : contents.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {contents.map((item) => (
              <ContentCard key={item.id} content={item} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-gray-200 py-16 text-center dark:border-gray-800">
            <p className="text-sm text-muted-foreground">
              Tidak ada panduan ditemukan yang cocok dengan kriteria filter
              Anda.
            </p>
          </div>
        )}
      </div>

      {/* Upload Modal component */}
      {session && (
        <UploadModal
          isOpen={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
          onUploadSuccess={handleAddContentSuccess}
        />
      )}
    </div>
  );
}
