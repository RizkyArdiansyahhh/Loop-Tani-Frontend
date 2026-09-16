"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Upload,
  ImageIcon,
  Leaf,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UploadStepProps {
  onAnalyze: (file: File) => void;
}

interface PresetSample {
  id: string;
  titleKey: string;
  tagKey: string;
  image: string;
  filename: string;
}

const PRESET_SAMPLES: PresetSample[] = [
  {
    id: "rice-husk",
    titleKey: "samples.riceHusk",
    tagKey: "samples.tagBiomass",
    image: "/images/samples/waste/sekam-padi.jpg",
    filename: "sekam-padi-sample.jpg",
  },
  {
    id: "corn-cob",
    titleKey: "samples.cornCob",
    tagKey: "samples.tagFeed",
    image: "/images/samples/waste/tongkol-jagung.jpg",
    filename: "tongkol-jagung-sample.jpg",
  },
  {
    id: "rice-straw",
    titleKey: "samples.riceStraw",
    tagKey: "samples.tagOrganic",
    image: "/images/samples/waste/jerami-padi.jpg",
    filename: "jerami-padi-sample.jpg",
  },
  {
    id: "sugarcane-bagasse",
    titleKey: "samples.sugarcaneBagasse",
    tagKey: "samples.tagFiber",
    image: "/images/samples/waste/ampas-tebu.jpg",
    filename: "ampas-tebu-sample.jpg",
  },
];

const UploadStep = ({ onAnalyze }: UploadStepProps) => {
  const t = useTranslations("analyzer");
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [activeSampleId, setActiveSampleId] = useState<string | null>(null);
  const [isLoadingSample, setIsLoadingSample] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    setActiveSampleId(null);
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleSelectSample = async (sample: PresetSample) => {
    try {
      setIsLoadingSample(true);
      setActiveSampleId(sample.id);
      setPreview(sample.image);

      const res = await fetch(sample.image);
      const blob = await res.blob();
      const file = new File([blob], sample.filename, { type: "image/jpeg" });
      setSelectedFile(file);
    } catch (error) {
      console.error("Failed to load sample image:", error);
    } finally {
      setIsLoadingSample(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-7">
      {/* ── Mascot Welcome Banner ────────────────────────────────── */}
      <div className="mb-6 flex flex-col items-center gap-4 rounded-2xl border border-primary/15 bg-primary/5 p-4 sm:flex-row sm:p-5 dark:border-primary/20 dark:bg-primary/10">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden sm:h-24 sm:w-24">
          <Image
            src="/images/maskot/maskot-limbah.png"
            alt="Maskot Loopi Limbah"
            width={100}
            height={100}
            priority
            className="h-full w-full object-contain drop-shadow-sm"
          />
        </div>
        <div className="text-center sm:text-left flex-1">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
            Halo, saya Loopi Limbah! 👋
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
            Unggah foto limbah pertanian Anda di bawah ini, atau klik salah satu sampel demo siap uji untuk menganalisis estimasi jenis, bobot, dan valuasi ekonominya secara otomatis.
          </p>
        </div>
      </div>

      {/* ── Main Upload / Preview Area ────────────────────────────── */}
      <div className="space-y-5">
        {!preview ? (
          /* Drag & Drop Upload Zone */
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "flex min-h-48 cursor-pointer flex-col items-center justify-center gap-2.5 rounded-2xl border-2 border-dashed p-6 transition-all duration-200",
              isDragOver
                ? "border-primary bg-primary/5 shadow-inner"
                : "border-gray-200 bg-gray-50/50 hover:border-primary/50 hover:bg-primary/5 dark:border-gray-800 dark:bg-gray-900/50"
            )}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-xs">
              <Upload className="h-5 w-5" />
            </div>
            <div className="text-center">
              <p className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                {t("upload.dragDrop")}
              </p>
              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                {t("upload.orClick")}
              </p>
            </div>
            <div className="mt-1 flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] font-medium text-gray-500 shadow-2xs border border-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">
              <ImageIcon className="h-3.5 w-3.5" />
              <span>{t("upload.formats")}</span>
            </div>
          </div>
        ) : (
          /* Active Preview State */
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-4"
          >
            <div className="relative min-h-[280px] max-h-[420px] overflow-hidden rounded-2xl border border-gray-200 bg-gray-900 shadow-inner dark:border-gray-800 flex items-center justify-center">
              <img
                src={preview}
                alt="Preview Limbah"
                className="max-h-[400px] w-full object-contain"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1 text-white">
                  <p className="text-sm sm:text-base font-bold truncate drop-shadow-sm">
                    {selectedFile?.name || "Foto Sampel Limbah"}
                  </p>
                  <p className="text-xs text-white/80 font-medium">
                    {selectedFile && (selectedFile.size / 1024 / 1024).toFixed(2)}{" "}
                    MB {activeSampleId && "· Sampel Siap Uji"}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setPreview(null);
                    setSelectedFile(null);
                    setActiveSampleId(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="border-white/40 bg-white/20 text-white backdrop-blur-sm hover:bg-white/30 cursor-pointer shrink-0 font-medium rounded-xl"
                >
                  <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                  <span>{t("upload.change")}</span>
                </Button>
              </div>
            </div>

            {/* Action Analyze Button */}
            <Button
              className="h-12 w-full rounded-xl text-sm sm:text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20 cursor-pointer transition-all"
              onClick={() => selectedFile && onAnalyze(selectedFile)}
            >
              <Leaf className="mr-2 h-4 w-4" />
              <span>{t("upload.button")}</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        )}

        {/* Hidden Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
        />

        {/* ── Preset Samples Section ──────────────────────────────── */}
        <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                {t("samples.title")}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {t("samples.subtitle")}
              </p>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-[10px] font-bold text-primary uppercase tracking-wider">
              1-Klik Uji
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {PRESET_SAMPLES.map((sample) => {
              const isSelected = activeSampleId === sample.id;
              return (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => handleSelectSample(sample)}
                  disabled={isLoadingSample}
                  className={cn(
                    "group relative flex flex-col rounded-2xl border p-2.5 text-left transition-all duration-200 cursor-pointer bg-white hover:border-primary hover:shadow-sm dark:bg-gray-800/60",
                    isSelected
                      ? "border-primary bg-primary/5 ring-2 ring-primary/30"
                      : "border-gray-200/80 hover:bg-gray-50/50 dark:border-gray-700/80"
                  )}
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                    <img
                      src={sample.image}
                      alt={t(sample.titleKey)}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-1.5 left-1.5 rounded-md bg-black/60 backdrop-blur-xs px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-2xs">
                      {t(sample.tagKey)}
                    </span>
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 rounded-full bg-primary text-primary-foreground p-0.5 shadow-xs">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </div>
                    )}
                  </div>

                  <div className="mt-2 flex flex-1 flex-col justify-between">
                    <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white leading-snug truncate group-hover:text-primary transition-colors">
                      {t(sample.titleKey)}
                    </h4>
                    <div className="mt-2 flex items-center justify-center gap-1 rounded-lg bg-gray-50 py-1.5 px-2 text-[10px] sm:text-[11px] font-semibold text-gray-600 group-hover:bg-primary group-hover:text-primary-foreground transition-all dark:bg-gray-700/50 dark:text-gray-300">
                      <span>{t("samples.clickToTest")}</span>
                      <ArrowRight className="h-3 w-3" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadStep;
