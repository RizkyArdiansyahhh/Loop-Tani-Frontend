"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { X, Sparkles, Plus, Image, Video, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { dummyUploaders, PanduanContent } from "../lib/dummy-data";
import { toast } from "sonner";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (newContent: PanduanContent) => void;
}

export function UploadModal({ isOpen, onClose, onUpload }: UploadModalProps) {
  const t = useTranslations("panduan");

  // Form states
  const [type, setType] = useState<"artikel" | "video">("artikel");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<"limbah" | "olahan" | "alat">("limbah");
  const [difficulty, setDifficulty] = useState<"pemula" | "menengah">("pemula");
  const [duration, setDuration] = useState("");
  const [youtubeId, setYoutubeId] = useState("");
  const [imageQuery, setImageQuery] = useState("");
  const [content, setContent] = useState("");
  const [uploaderKey, setUploaderKey] = useState<"ahmad" | "ebel" | "rizky">("ahmad");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !duration.trim() || !content.trim()) {
      toast.error("Formulir tidak lengkap", {
        description: "Harap isi semua kolom wajib sebelum mengirim.",
      });
      return;
    }

    if (type === "video" && !youtubeId.trim()) {
      toast.error("Formulir tidak lengkap", {
        description: "Video ID YouTube wajib diisi jika tipe konten adalah Video.",
      });
      return;
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    // Unsplash photo library mapping based on keywords to keep design premium
    const imageKeyword = imageQuery.trim() || "farming";
    let imageUrl = "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&h=400&q=80";
    
    if (imageKeyword.includes("straw") || imageKeyword.includes("padi")) {
      imageUrl = "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&h=400&q=80";
    } else if (imageKeyword.includes("compost") || imageKeyword.includes("kompos") || imageKeyword.includes("pupuk")) {
      imageUrl = "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=600&h=400&q=80";
    }

    const pointsToAward = type === "artikel" ? 20 : 30; // standard content points

    const newContent: PanduanContent = {
      id: `custom-${Date.now()}`,
      slug,
      type,
      title,
      category,
      difficulty,
      imageQuery: imageKeyword,
      imageUrl: type === "artikel" ? imageUrl : undefined,
      youtubeId: type === "video" ? youtubeId.trim() : undefined,
      duration: type === "artikel" ? `${duration.trim()} menit baca` : duration.trim(),
      points: pointsToAward,
      relatedListingSlug: "marketplace-produk",
      content,
      uploader: dummyUploaders[uploaderKey],
    };

    onUpload(newContent);
    
    // Reset Form
    setTitle("");
    setDuration("");
    setYoutubeId("");
    setImageQuery("");
    setContent("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-300">
      {/* Modal Box */}
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 dark:bg-gray-900 dark:border dark:border-gray-800">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-fraunces text-lg font-bold text-gray-900 dark:text-gray-100">
                {t("uploadModal.title")}
              </h3>
              <p className="text-xs text-muted-foreground">
                {t("uploadModal.description")}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors dark:hover:bg-gray-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Toggle Type Artikel / Video */}
          <div className="grid grid-cols-2 gap-3 p-1 rounded-2xl bg-gray-50 border border-gray-100 dark:bg-gray-950 dark:border-gray-800">
            <button
              type="button"
              onClick={() => setType("artikel")}
              className={`flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                type === "artikel"
                  ? "bg-white text-gray-900 shadow-sm dark:bg-gray-800 dark:text-white"
                  : "text-muted-foreground hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Image className="h-4 w-4" />
              {t("uploadModal.typeArticle")}
            </button>
            <button
              type="button"
              onClick={() => setType("video")}
              className={`flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                type === "video"
                  ? "bg-white text-gray-900 shadow-sm dark:bg-gray-800 dark:text-white"
                  : "text-muted-foreground hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Video className="h-4 w-4" />
              {t("uploadModal.typeVideo")}
            </button>
          </div>

          {/* Form Fields Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Title */}
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-bold text-gray-700 dark:text-gray-300">
                {t("uploadModal.formTitle")} <span className="text-red-500">*</span>
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Cara Bikin Pupuk Organik Cair"
                className="w-full"
                required
              />
            </div>

            {/* Category selection */}
            <div>
              <label className="mb-1.5 block text-xs font-bold text-gray-700 dark:text-gray-300">
                {t("uploadModal.formCategory")}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="limbah">Limbah</option>
                <option value="olahan">Olahan</option>
                <option value="alat">Alat</option>
              </select>
            </div>

            {/* Difficulty selection */}
            <div>
              <label className="mb-1.5 block text-xs font-bold text-gray-700 dark:text-gray-300">
                {t("uploadModal.formDifficulty")}
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="pemula">Pemula</option>
                <option value="menengah">Menengah</option>
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="mb-1.5 block text-xs font-bold text-gray-700 dark:text-gray-300">
                {t("uploadModal.formDuration")}{" "}
                <span className="text-muted-foreground font-normal">
                  ({type === "artikel" ? "Menit baca" : "Format mm:ss"})
                </span>{" "}
                <span className="text-red-500">*</span>
              </label>
              <Input
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder={type === "artikel" ? "5" : "06:32"}
                required
              />
            </div>

            {/* Youtube ID / Image keyword */}
            <div>
              {type === "video" ? (
                <>
                  <label className="mb-1.5 block text-xs font-bold text-gray-700 dark:text-gray-300">
                    {t("uploadModal.formYoutube")} <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={youtubeId}
                    onChange={(e) => setYoutubeId(e.target.value)}
                    placeholder="9Kk4Ver3nFE"
                    required={type === "video"}
                  />
                </>
              ) : (
                <>
                  <label className="mb-1.5 block text-xs font-bold text-gray-700 dark:text-gray-300">
                    {t("uploadModal.formImage")}
                  </label>
                  <Input
                    value={imageQuery}
                    onChange={(e) => setImageQuery(e.target.value)}
                    placeholder="compost"
                  />
                </>
              )}
            </div>

            {/* Uploader profiles */}
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {t("uploadModal.formUploader")}
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(["ahmad", "ebel", "rizky"] as const).map((key) => {
                  const user = dummyUploaders[key];
                  const isSelected = uploaderKey === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setUploaderKey(key)}
                      className={`flex flex-col items-center p-3 rounded-2xl border text-center transition-all ${
                        isSelected
                          ? "border-primary bg-primary/5 dark:bg-primary/10"
                          : "border-gray-150 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-850"
                      }`}
                    >
                      <img
                        src={user.avatarUrl}
                        alt={user.name}
                        className="h-10 w-10 rounded-full object-cover mb-1.5 ring-2 ring-white shadow-xs"
                      />
                      <span className="text-xs font-semibold text-gray-900 dark:text-white">
                        {user.name}
                      </span>
                      <span className="text-4xs text-muted-foreground leading-none">
                        {user.role}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content text */}
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-bold text-gray-700 dark:text-gray-300">
                {t("uploadModal.formContent")} <span className="text-red-500">*</span>
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                placeholder={
                  type === "artikel"
                    ? "Tulis isi artikel edukasi Anda di sini..."
                    : "Deskripsi singkat mengenai isi video praktik..."
                }
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              />
            </div>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
          <Button variant="outline" type="button" onClick={onClose} className="rounded-xl">
            Batal
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            className="rounded-xl bg-primary text-white font-semibold flex items-center gap-1.5 px-5"
          >
            <Sparkles className="h-4 w-4 fill-current text-yellow-300" />
            {t("uploadModal.submit")}
          </Button>
        </div>

      </div>
    </div>
  );
}
