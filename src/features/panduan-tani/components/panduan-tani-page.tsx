"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Sparkles, Search, SlidersHorizontal, Plus, BookOpen, Video, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoopPointsWidget } from "./looppoints-widget";
import { ContentCard } from "./content-card";
import { UploadModal } from "./upload-modal";
import { initialPanduanContents, PanduanContent } from "../lib/dummy-data";
import { toast } from "sonner";

export default function PanduanTani() {
  const t = useTranslations("panduan");

  // State loaded from localStorage if client side
  const [points, setPoints] = useState(350);
  const [contents, setContents] = useState<PanduanContent[]>(initialPanduanContents);
  const [isClient, setIsClient] = useState(false);

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"semua" | "limbah" | "olahan" | "alat">("semua");
  const [selectedDifficulty, setSelectedDifficulty] = useState<"semua" | "pemula" | "menengah">("semua");
  const [activeTab, setActiveTab] = useState<"artikel" | "video">("artikel");

  // Upload modal state
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // LocalStorage sync
  useEffect(() => {
    setIsClient(true);
    const storedPoints = localStorage.getItem("looptani_points");
    if (storedPoints !== null) {
      setPoints(Number(storedPoints));
    } else {
      localStorage.setItem("looptani_points", "350");
    }

    const storedContents = localStorage.getItem("looptani_contents");
    if (storedContents !== null) {
      try {
        setContents(JSON.parse(storedContents));
      } catch (e) {
        console.error("Error parsing stored contents", e);
      }
    } else {
      localStorage.setItem("looptani_contents", JSON.stringify(initialPanduanContents));
    }
  }, []);

  const handleEarnPoints = (amount: number) => {
    const nextPoints = points + amount;
    setPoints(nextPoints);
    localStorage.setItem("looptani_points", String(nextPoints));
  };

  const handleRedeemPoints = (cost: number, rewardName: string) => {
    if (points >= cost) {
      const nextPoints = points - cost;
      setPoints(nextPoints);
      localStorage.setItem("looptani_points", String(nextPoints));
      toast.success(t("redeemPoints.redeemSuccess", { reward: rewardName }));
    }
  };

  const handleAddContent = (newContent: PanduanContent) => {
    const updatedContents = [newContent, ...contents];
    setContents(updatedContents);
    localStorage.setItem("looptani_contents", JSON.stringify(updatedContents));
    
    // Reward points for uploading content
    const rewardPoints = 50;
    const nextPoints = points + rewardPoints;
    setPoints(nextPoints);
    localStorage.setItem("looptani_points", String(nextPoints));

    toast.success("Konten Berhasil Diupload!", {
      description: `Selamat! Anda mendapatkan +50 LoopPoints sebagai kontributor ilmu.`,
      icon: <Sparkles className="h-5 w-5 fill-current text-yellow-500" />,
      duration: 5000,
    });
  };

  // Filter Contents
  const filteredContents = contents.filter((item) => {
    const matchesTab = item.type === activeTab;
    const matchesCategory = selectedCategory === "semua" || item.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === "semua" || item.difficulty === selectedDifficulty;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.uploader.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesCategory && matchesDifficulty && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24 dark:bg-gray-950">
      
      {/* Header Banner - Large FRAUNCES font */}
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
            <Button
              onClick={() => setIsUploadOpen(true)}
              className="w-full md:w-auto rounded-2xl bg-primary text-white font-semibold flex items-center justify-center gap-2 px-6 py-5 shadow-xs transition-all hover:bg-emerald-700"
            >
              <Plus className="h-5 w-5" />
              {t("uploadModal.title")}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-10 space-y-8">
        
        {/* Highlighted LoopPoints Dashboard Widget */}
        <section className="bg-transparent">
          <h2 className="sr-only">LoopPoints Dashboard</h2>
          <LoopPointsWidget points={isClient ? points : 350} onRedeem={handleRedeemPoints} />
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
        {filteredContents.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredContents.map((item) => (
              <ContentCard key={item.id} content={item} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-gray-200 py-16 text-center dark:border-gray-800">
            <p className="text-sm text-muted-foreground">
              Tidak ada panduan ditemukan yang cocok dengan kriteria filter Anda.
            </p>
          </div>
        )}

      </div>

      {/* Upload Modal component */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUpload={handleAddContent}
      />

    </div>
  );
}
