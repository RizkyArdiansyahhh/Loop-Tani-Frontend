"use client";

import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  ImageIcon,
  Sparkles,
  Leaf,
  Coins,
  Target,
  Lightbulb,
  Gauge,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface UploadStepProps {
  onAnalyze: (file: File) => void;
}

const UploadStep = ({ onAnalyze }: UploadStepProps) => {
  const t = useTranslations("analyzer");
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
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

  return (
    <div className="flex flex-col lg:flex-row">
      {/* LEFT — Upload Area (65%) */}
      <div className="flex flex-1 flex-col border-border/40 p-8 lg:border-r lg:p-10">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-foreground">
            {t("upload.title")}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("upload.description")}
          </p>
        </div>

        {!preview ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex flex-1 cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-12 transition-all duration-300 ${
              isDragOver
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50 hover:bg-muted/30"
            }`}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Upload className="h-7 w-7 text-primary" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">
                {t("upload.dragDrop")}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {t("upload.orClick")}
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-muted/60 px-3 py-1.5 text-[11px] text-muted-foreground">
              <ImageIcon className="h-3 w-3" />
              {t("upload.formats")}
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-1 flex-col"
          >
            <div className="relative flex-1 overflow-hidden rounded-2xl">
              <img
                src={preview}
                alt="Preview"
                className="h-full min-h-[240px] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {selectedFile?.name}
                    </p>
                    <p className="text-xs text-white/70">
                      {selectedFile &&
                        (selectedFile.size / 1024 / 1024).toFixed(2)}{" "}
                      MB
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setPreview(null);
                      setSelectedFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="border-white/30 bg-white/20 text-white backdrop-blur-sm hover:bg-white/30"
                  >
                    {t("upload.change")}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Analyze Button */}
        {preview && (
          <motion.div
            className="mt-6"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Button
              className="h-12 w-full rounded-xl text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
              onClick={() => selectedFile && onAnalyze(selectedFile)}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {t("upload.button")}
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
      </div>

      {/* RIGHT — AI Summary Card (35%) */}
      <div className="flex flex-col bg-muted/20 p-8 lg:w-[35%] lg:p-10">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-foreground">
            {t("summary.title")}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("summary.description")}
          </p>
        </div>

        <div className="flex flex-1 flex-col justify-center gap-5">
          <SummaryRow
            icon={Leaf}
            label={t("summary.wasteType")}
            value={t("summary.placeholder")}
          />
          <SummaryRow
            icon={Target}
            label={t("summary.condition")}
            value={t("summary.placeholder")}
          />
          <SummaryRow
            icon={Coins}
            label={t("summary.estimatedValue")}
            value={t("summary.placeholder")}
          />
          <SummaryRow
            icon={Lightbulb}
            label={t("summary.recommendation")}
            value={t("summary.placeholder")}
          />
          <SummaryRow
            icon={Gauge}
            label={t("summary.confidence")}
            value={t("summary.placeholder")}
          />
        </div>

        <div className="mt-6 rounded-xl bg-primary/5 p-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <p className="text-xs font-semibold text-primary">
              {t("summary.aiTitle")}
            </p>
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
            {t("summary.aiDescription")}
          </p>
        </div>
      </div>
    </div>
  );
};

const SummaryRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Leaf;
  label: string;
  value: string;
}) => (
  <div className="flex items-center gap-3">
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
      <Icon className="h-4 w-4 text-muted-foreground" />
    </div>
    <div className="flex flex-1 items-center justify-between">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <Badge variant="secondary" className="text-[11px]">
        {value}
      </Badge>
    </div>
  </div>
);

export default UploadStep;
