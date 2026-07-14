"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { X, Sparkles, Plus, Image, Video, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useCreateContent } from "../hooks/use-create-content";
import { authClient } from "@/lib/auth-client";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
}

export function UploadModal({ isOpen, onClose, onUploadSuccess }: UploadModalProps) {
  const t = useTranslations("panduan");
  const createMutation = useCreateContent();
  const { data: session } = authClient.useSession();
  const userRole = (session?.user as any)?.role;
  const isAdmin = userRole === "ADMIN" ||
                  (Array.isArray(userRole) && userRole.includes("ADMIN"));

  // Form states
  const [type, setType] = useState<"artikel" | "video">("artikel");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<"limbah" | "olahan" | "alat">("limbah");
  const [difficulty, setDifficulty] = useState<"pemula" | "menengah">("pemula");
  const [duration, setDuration] = useState("");
  const [youtubeId, setYoutubeId] = useState("");
  const [imageQuery, setImageQuery] = useState("");
  const [content, setContent] = useState("");

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
        description: "URL Video / ID Video wajib diisi jika tipe konten adalah Video.",
      });
      return;
    }

    // Unsplash photo library mapping based on keywords to keep design premium
    const imageKeyword = imageQuery.trim() || "farming";
    let imageUrl = "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&h=400&q=80";
    
    if (imageKeyword.includes("straw") || imageKeyword.includes("padi")) {
      imageUrl = "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&h=400&q=80";
    } else if (imageKeyword.includes("compost") || imageKeyword.includes("kompos") || imageKeyword.includes("pupuk")) {
      imageUrl = "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=600&h=400&q=80";
    }

    const durationNum = parseInt(duration) || 5;

    createMutation.mutate(
      {
        type: type === "artikel" ? "ARTICLE" : "VIDEO",
        title,
        content,
        category,
        difficulty,
        imageUrl: type === "artikel" ? imageUrl : undefined,
        estimatedReadingMinutes: type === "artikel" ? durationNum : undefined,
        videoDuration: type === "video" ? durationNum * 60 : undefined,
        secureUrl: type === "video" ? youtubeId.trim() : undefined,
      },
      {
        onSuccess: () => {
          // Reset Form
          setTitle("");
          setDuration("");
          setYoutubeId("");
          setImageQuery("");
          setContent("");
          onUploadSuccess();
          onClose();
        },
        onError: (err: any) => {
          const msg = err?.response?.data?.message || "Gagal mengirimkan konten.";
          toast.error(msg);
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-300 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-300">
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
          {isAdmin && (
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
          )}

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
