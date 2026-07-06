"use client";

import { useTranslations } from "next-intl";
import { Sprout, Ruler, Mountain, Flower2, ChevronDown, Calculator } from "lucide-react";
import {
  type FarmFormData,
  cropOptions,
  soilOptions,
  stageOptions,
} from "../lib/dummy-data";

interface FormStepProps {
  formData: FarmFormData;
  onChange: (data: FarmFormData) => void;
  onCalculate: () => void;
}

const FormStep = ({ formData, onChange, onCalculate }: FormStepProps) => {
  const t = useTranslations("fertilizer");

  const isFormValid =
    formData.cropType && formData.landSize && formData.soilType && formData.growthStage;

  const selectClass =
    "w-full appearance-none rounded-xl border border-border/60 bg-background/80 px-4 py-3 text-sm text-foreground outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/10";

  return (
    <div className="p-6 sm:p-8 lg:p-10">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Calculator className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground">
            {t("form.title")}
          </h2>
        </div>
        <p className="ml-[52px] text-sm text-muted-foreground">
          {t("form.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Crop Type */}
        <div>
          <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-foreground">
            <Sprout className="h-3.5 w-3.5 text-muted-foreground" />
            {t("form.cropType")}
          </label>
          <div className="relative">
            <select
              value={formData.cropType}
              onChange={(e) =>
                onChange({ ...formData, cropType: e.target.value })
              }
              className={selectClass}
            >
              <option value="">{t("form.cropTypePlaceholder")}</option>
              {cropOptions.map((crop) => (
                <option key={crop.value} value={crop.value}>
                  {t(crop.labelKey)}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        {/* Land Area */}
        <div>
          <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-foreground">
            <Ruler className="h-3.5 w-3.5 text-muted-foreground" />
            {t("form.landSize")}
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={formData.landSize}
              onChange={(e) =>
                onChange({ ...formData, landSize: e.target.value })
              }
              placeholder={t("form.landSizePlaceholder")}
              className="flex-1 rounded-xl border border-border/60 bg-background/80 px-4 py-3 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
            />
            <div className="flex overflow-hidden rounded-xl border border-border/60">
              {(["m²", "Hektar"] as const).map((unit) => (
                <button
                  key={unit}
                  type="button"
                  onClick={() => onChange({ ...formData, unit })}
                  className={`px-3 py-3 text-xs font-medium transition-all ${
                    formData.unit === unit
                      ? "bg-primary text-primary-foreground"
                      : "bg-background/80 text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {unit}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Soil Type */}
        <div>
          <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-foreground">
            <Mountain className="h-3.5 w-3.5 text-muted-foreground" />
            {t("form.soilType")}
          </label>
          <div className="relative">
            <select
              value={formData.soilType}
              onChange={(e) =>
                onChange({ ...formData, soilType: e.target.value })
              }
              className={selectClass}
            >
              <option value="">{t("form.soilTypePlaceholder")}</option>
              {soilOptions.map((soil) => (
                <option key={soil.value} value={soil.value}>
                  {t(soil.labelKey)}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        {/* Growth Stage */}
        <div>
          <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-foreground">
            <Flower2 className="h-3.5 w-3.5 text-muted-foreground" />
            {t("form.growthStage")}
          </label>
          <div className="relative">
            <select
              value={formData.growthStage}
              onChange={(e) =>
                onChange({ ...formData, growthStage: e.target.value })
              }
              className={selectClass}
            >
              <option value="">{t("form.growthStagePlaceholder")}</option>
              {stageOptions.map((stage) => (
                <option key={stage.value} value={stage.value}>
                  {t(stage.labelKey)}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Calculate Button */}
      <button
        onClick={onCalculate}
        disabled={!isFormValid}
        className="mt-8 w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none sm:w-auto sm:px-10"
      >
        {t("form.calculate")}
      </button>
    </div>
  );
};

export default FormStep;
