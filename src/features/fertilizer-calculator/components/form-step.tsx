"use client";

import { useEffect, useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  ArrowRight,
  CheckCircle2,
  Leaf,
  ShieldCheck,
  Coins,
  TrendingDown,
  Layers,
} from "lucide-react";
import {
  type FarmFormData,
  cropOptions,
  soilOptions,
  stageOptions,
  PRESET_SCENARIOS,
  soilDetails,
  stageDetails,
  cropNames,
  formatRupiah,
  getSackEstimate,
} from "../lib/dummy-data";
import { recommendFertilizer } from "../lib/engine";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  cropType: z.string().min(1, "Wajib memilih jenis tanaman"),
  landSize: z
    .string()
    .min(1, "Wajib mengisi luas lahan")
    .regex(/^\d+(\.\d+)?$/, "Format harus berupa angka valid"),
  unit: z.enum(["m²", "Hektar"]),
  soilType: z.string().min(1, "Wajib memilih jenis tanah"),
  growthStage: z.string().min(1, "Wajib memilih fase pertumbuhan"),
});

interface FormStepProps {
  formData: FarmFormData;
  onChange: (data: FarmFormData) => void;
  onCalculate: (data: FarmFormData) => void;
}

const QUICK_LAND_PRESETS = [
  { label: "0.5 Ha", size: "0.5", unit: "Hektar" as const },
  { label: "1.0 Ha", size: "1", unit: "Hektar" as const },
  { label: "2.0 Ha", size: "2", unit: "Hektar" as const },
  { label: "2.000 m²", size: "2000", unit: "m²" as const },
  { label: "5.000 m²", size: "5000", unit: "m²" as const },
];

const FormStep = ({ formData, onChange, onCalculate }: FormStepProps) => {
  const t = useTranslations("fertilizer");
  const locale = useLocale();
  const [activePresetId, setActivePresetId] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: formData,
    mode: "onChange",
  });

  const watchedCropType = form.watch("cropType");
  const watchedLandSize = form.watch("landSize");
  const watchedUnit = form.watch("unit");
  const watchedSoilType = form.watch("soilType");
  const watchedGrowthStage = form.watch("growthStage");

  // Sinkronisasi form dengan state luar
  useEffect(() => {
    const subscription = form.watch((value) => {
      onChange(value as FarmFormData);
    });
    return () => subscription.unsubscribe();
  }, [form, onChange]);

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    onCalculate(data as FarmFormData);
  };

  const handleApplyPreset = (preset: (typeof PRESET_SCENARIOS)[0]) => {
    setActivePresetId(preset.id);
    form.reset(
      {
        cropType: preset.cropType,
        landSize: preset.landSize,
        unit: preset.unit,
        soilType: preset.soilType,
        growthStage: preset.growthStage,
      },
      { keepDefaultValues: false }
    );
  };

  const numArea = parseFloat(watchedLandSize) || 0;
  const currentCrop = cropOptions.find((c) => c.value === watchedCropType);
  const currentSoil = soilDetails[watchedSoilType];
  const currentStage = stageDetails[watchedGrowthStage];

  // Dynamic real-time calculation preview
  const livePreview = useMemo(() => {
    if (!watchedCropType || numArea <= 0 || !watchedSoilType || !watchedGrowthStage) {
      // Fallback benchmark preview if not fully filled
      return null;
    }
    try {
      const calc = recommendFertilizer(
        {
          cropType: watchedCropType,
          landSize: watchedLandSize,
          unit: watchedUnit,
          soilType: watchedSoilType,
          growthStage: watchedGrowthStage,
        },
        locale
      );
      return calc;
    } catch {
      return null;
    }
  }, [watchedCropType, watchedLandSize, watchedUnit, watchedSoilType, watchedGrowthStage, numArea, locale]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 font-poppins">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ── LEFT COLUMN: Ramping & Tactile Form (7 Cols) ─────────── */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section Header & Discreet Presets */}
          <div className="space-y-3 pb-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                  Parameter Pemupukan
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Tentukan jenis tanaman, luas lahan, dan karakteristik tanah Anda.
                </p>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-400">
                <ShieldCheck className="h-3 w-3" />
                Standar Kementan RI
              </span>
            </div>

            {/* Discreet Preset Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 mr-1">
                Uji cepat:
              </span>
              {PRESET_SCENARIOS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className={cn(
                    "px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all cursor-pointer",
                    activePresetId === preset.id
                      ? "border-primary bg-primary text-white shadow-2xs"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
                  )}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* 1. Komoditas Tanaman */}
            <div className="space-y-2.5">
              <label className="text-xs sm:text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center justify-between">
                <span>1. Jenis Komoditas Tanaman</span>
                {currentCrop && (
                  <span className="text-xs font-semibold text-primary">
                    {currentCrop.name}
                  </span>
                )}
              </label>

              <Controller
                control={form.control}
                name="cropType"
                render={({ field }) => (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {cropOptions.map((crop) => {
                      const isSelected = field.value === crop.value;
                      return (
                        <button
                          key={crop.value}
                          type="button"
                          onClick={() => {
                            setActivePresetId(null);
                            field.onChange(crop.value);
                          }}
                          className={cn(
                            "flex flex-col items-start p-3 rounded-xl border text-left transition-all cursor-pointer",
                            isSelected
                              ? "border-primary bg-primary/10 ring-2 ring-primary/30 shadow-2xs dark:bg-primary/20"
                              : "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-800 dark:bg-gray-900"
                          )}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="text-[10px] font-semibold text-muted-foreground uppercase">
                              {crop.category}
                            </span>
                            {isSelected && (
                              <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                            )}
                          </div>
                          <span
                            className={cn(
                              "text-xs sm:text-sm font-bold mt-1",
                              isSelected
                                ? "text-primary dark:text-emerald-400"
                                : "text-gray-900 dark:text-white"
                            )}
                          >
                            {crop.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              />
              <FieldError errors={[form.formState.errors.cropType as any]} />
            </div>

            {/* 2. Luas Lahan & Satuan */}
            <div className="space-y-2.5">
              <label className="text-xs sm:text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center justify-between">
                <span>2. Luas Lahan Pertanian</span>
                {numArea > 0 && (
                  <span className="text-xs font-normal text-muted-foreground">
                    {watchedUnit === "m²"
                      ? `~${(numArea / 10000).toFixed(2)} Ha`
                      : `${(numArea * 10000).toLocaleString("id-ID")} m²`}
                  </span>
                )}
              </label>

              <div className="flex gap-2">
                <Input
                  id="landSize"
                  type="number"
                  step="any"
                  placeholder="Masukkan angka luas lahan (contoh: 1)"
                  {...form.register("landSize")}
                  className="h-11 flex-1 rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 text-xs sm:text-sm font-semibold"
                />
                <div className="flex overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-0.5 shrink-0">
                  {(["Hektar", "m²"] as const).map((unit) => (
                    <button
                      key={unit}
                      type="button"
                      onClick={() => {
                        setActivePresetId(null);
                        form.setValue("unit", unit, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                      }}
                      className={cn(
                        "px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer",
                        watchedUnit === unit
                          ? "bg-primary text-white shadow-2xs"
                          : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                      )}
                    >
                      {unit}
                    </button>
                  ))}
                </div>
              </div>
              <FieldError errors={[form.formState.errors.landSize as any]} />

              {/* Quick Chips */}
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {QUICK_LAND_PRESETS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => {
                      setActivePresetId(null);
                      form.setValue("landSize", p.size, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                      form.setValue("unit", p.unit, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    }}
                    className={cn(
                      "rounded-lg px-2.5 py-1 text-[11px] font-semibold border transition-all cursor-pointer",
                      watchedLandSize === p.size && watchedUnit === p.unit
                        ? "border-primary bg-primary text-white"
                        : "border-gray-200 bg-white text-gray-600 hover:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                    )}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Karakteristik Tanah */}
            <div className="space-y-2.5">
              <label className="text-xs sm:text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center justify-between">
                <span>3. Karakteristik Jenis Tanah</span>
                {currentSoil && (
                  <span className="text-xs font-semibold text-primary">
                    {currentSoil.title}
                  </span>
                )}
              </label>

              <Controller
                control={form.control}
                name="soilType"
                render={({ field }) => (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {soilOptions.map((soil) => {
                      const info = soilDetails[soil.value];
                      const isSelected = field.value === soil.value;
                      return (
                        <button
                          key={soil.value}
                          type="button"
                          onClick={() => {
                            setActivePresetId(null);
                            field.onChange(soil.value);
                          }}
                          className={cn(
                            "flex flex-col p-2.5 rounded-xl border text-left transition-all cursor-pointer",
                            isSelected
                              ? "border-primary bg-primary/10 ring-2 ring-primary/30 dark:bg-primary/20"
                              : "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-800 dark:bg-gray-900"
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className={cn(
                                "text-xs font-bold",
                                isSelected
                                  ? "text-primary dark:text-emerald-400"
                                  : "text-gray-900 dark:text-white"
                              )}
                            >
                              {info?.title || soil.value}
                            </span>
                            {isSelected && (
                              <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                            )}
                          </div>
                          <span className="text-[11px] text-muted-foreground mt-0.5 truncate">
                            {info?.shortDesc}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              />
              <FieldError errors={[form.formState.errors.soilType as any]} />
            </div>

            {/* 4. Fase Pertumbuhan */}
            <div className="space-y-2.5">
              <label className="text-xs sm:text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center justify-between">
                <span>4. Fase Pertumbuhan Tanaman</span>
                {currentStage && (
                  <span className="text-xs font-semibold text-primary">
                    {currentStage.title} ({currentStage.timeline})
                  </span>
                )}
              </label>

              <Controller
                control={form.control}
                name="growthStage"
                render={({ field }) => (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {stageOptions.map((stage) => {
                      const info = stageDetails[stage.value];
                      const isSelected = field.value === stage.value;
                      return (
                        <button
                          key={stage.value}
                          type="button"
                          onClick={() => {
                            setActivePresetId(null);
                            field.onChange(stage.value);
                          }}
                          className={cn(
                            "flex flex-col p-2.5 rounded-xl border text-left transition-all cursor-pointer",
                            isSelected
                              ? "border-primary bg-primary/10 ring-2 ring-primary/30 dark:bg-primary/20"
                              : "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-800 dark:bg-gray-900"
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className={cn(
                                "text-xs font-bold",
                                isSelected
                                  ? "text-primary dark:text-emerald-400"
                                  : "text-gray-900 dark:text-white"
                              )}
                            >
                              {info?.title || stage.value}
                            </span>
                            <span className="text-[10px] text-muted-foreground bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                              {info?.timeline}
                            </span>
                          </div>
                          <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium mt-1">
                            {info?.focusNutrientName === "Nitrogen" && "Fokus N (Daun/Batang)"}
                            {info?.focusNutrientName === "Fosfor" && "Fokus P (Akar/Bunga)"}
                            {info?.focusNutrientName === "Kalium" && "Fokus K (Pengisian Buah)"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              />
              <FieldError errors={[form.formState.errors.growthStage as any]} />
            </div>

            {/* Mobile Submit Button */}
            <div className="block lg:hidden pt-2">
              <Button
                type="submit"
                disabled={!form.formState.isValid}
                className="h-12 w-full rounded-xl text-sm font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm cursor-pointer transition-all disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span>Lihat Rekomendasi Lengkap</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>

        {/* ── RIGHT COLUMN: Panel Ringkasan Dinamis Real-Time (5 Cols) ─ */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
          <div className="rounded-3xl border border-primary/20 bg-linear-to-b from-emerald-50/80 via-white to-emerald-50/40 p-6 shadow-xs dark:from-emerald-950/20 dark:via-gray-900 dark:to-emerald-950/10 dark:border-primary/25 space-y-5">
            {/* Header Ringkasan */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-200/70 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-primary text-white shadow-2xs">
                  <Leaf className="h-4 w-4" />
                </span>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                  Taksiran Real-Time
                </h3>
              </div>
              <Badge variant="outline" className="text-[10px] font-bold border-primary/30 text-primary uppercase tracking-wider">
                Live Preview
              </Badge>
            </div>

            {/* Tanaman & Luas Aktif */}
            <div className="bg-white dark:bg-gray-800/80 rounded-2xl p-3.5 border border-gray-150 dark:border-gray-700 flex items-center justify-between text-xs">
              <div className="flex flex-col">
                <span className="text-[10px] font-medium text-muted-foreground uppercase">
                  Objek Budidaya
                </span>
                <span className="text-xs font-bold text-gray-900 dark:text-white mt-0.5">
                  {currentCrop?.name || "Belum dipilih"}
                </span>
              </div>
              <div className="text-right flex flex-col">
                <span className="text-[10px] font-medium text-muted-foreground uppercase">
                  Luas Efektif
                </span>
                <span className="text-xs font-bold text-primary mt-0.5">
                  {watchedLandSize ? `${watchedLandSize} ${watchedUnit}` : "-"}
                </span>
              </div>
            </div>

            {/* Taksiran Dosis Pupuk */}
            <div className="space-y-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                Estimasi Dosis Pupuk Kimia:
              </span>

              {livePreview ? (
                <div className="space-y-2">
                  {livePreview.fertilizers.map((f) => (
                    <div
                      key={f.name}
                      className="flex items-center justify-between bg-white dark:bg-gray-800/70 p-2.5 rounded-xl border border-gray-150 dark:border-gray-700 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-primary" />
                        <span className="font-bold text-gray-900 dark:text-white">
                          {f.name}
                        </span>
                      </div>
                      <div className="text-right font-semibold text-gray-800 dark:text-gray-200">
                        <span>{f.amount} {f.unit}</span>
                        <span className="text-[10px] text-muted-foreground ml-1 font-normal">
                          ({getSackEstimate(f.amount)})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 text-center text-xs text-muted-foreground space-y-1">
                  <p>Lengkapi formulir di samping untuk melihat taksiran dosis instan.</p>
                </div>
              )}
            </div>

            {/* Estimasi Biaya & Potensi Hemat Sirkular */}
            {livePreview && (
              <div className="space-y-2.5 pt-2 border-t border-gray-200/70 dark:border-gray-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Taksiran Total Biaya:</span>
                  <span className="font-bold text-gray-900 dark:text-white text-sm">
                    {formatRupiah(livePreview.estimatedCost)}
                  </span>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs leading-relaxed">
                  <TrendingDown className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600" />
                  <div>
                    <span className="font-bold block">Potensi Hemat ~30%</span>
                    <span className="text-[11px] opacity-90">
                      Gunakan pupuk organik sirkular lokal mitra LoopTani untuk menekan pengeluaran kimiawi.
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Desktop Action Button */}
            <div className="pt-2">
              <Button
                type="button"
                onClick={form.handleSubmit(onSubmit)}
                disabled={!form.formState.isValid}
                className="h-12 w-full rounded-2xl text-xs sm:text-sm font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20 cursor-pointer transition-all disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span>Lihat Jadwal & Rekomendasi Lengkap</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormStep;
