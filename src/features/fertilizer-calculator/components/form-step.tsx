"use client";

import { useTranslations } from "next-intl";
import {
  Sprout,
  Ruler,
  Mountain,
  Flower2,
  Calculator,
} from "lucide-react";
import {
  type FarmFormData,
  cropOptions,
  soilOptions,
  stageOptions,
} from "../lib/dummy-data";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";

const formSchema = z.object({
  cropType: z.string().min(1, "Wajib memilih jenis tanaman"),
  landSize: z.string().min(1, "Wajib mengisi luas lahan").regex(/^\d+(\.\d+)?$/, "Format harus berupa angka"),
  unit: z.enum(["m²", "Hektar"]),
  soilType: z.string().min(1, "Wajib memilih jenis tanah"),
  growthStage: z.string().min(1, "Wajib memilih fase pertumbuhan"),
});

interface FormStepProps {
  formData: FarmFormData;
  onChange: (data: FarmFormData) => void;
  onCalculate: (data: FarmFormData) => void;
}

const FormStep = ({ formData, onChange, onCalculate }: FormStepProps) => {
  const t = useTranslations("fertilizer");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: formData,
    mode: "onChange",
  });

  // Sinkronisasi form dengan state global jika diperlukan
  useEffect(() => {
    const subscription = form.watch((value) => {
      onChange(value as FarmFormData);
    });
    return () => subscription.unsubscribe();
  }, [form, onChange]);

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    onCalculate(data as FarmFormData);
  };

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

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Crop Type */}
          <Field>
            <FieldLabel htmlFor="cropType" className="mb-1 flex items-center gap-2">
              <Sprout className="h-3.5 w-3.5 text-muted-foreground" />
              {t("form.cropType")}
            </FieldLabel>
            <Controller
              control={form.control}
              name="cropType"
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="w-full h-12 rounded-xl border-border/60 bg-background/80">
                    <SelectValue placeholder={t("form.cropTypePlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {cropOptions.map((crop) => (
                      <SelectItem key={crop.value} value={crop.value}>
                        {t(crop.labelKey)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError errors={[form.formState.errors.cropType as any]} />
          </Field>

          {/* Land Area */}
          <Field>
            <FieldLabel htmlFor="landSize" className="mb-1 flex items-center gap-2">
              <Ruler className="h-3.5 w-3.5 text-muted-foreground" />
              {t("form.landSize")}
            </FieldLabel>
            <div className="flex gap-2">
              <Input
                id="landSize"
                type="number"
                placeholder={t("form.landSizePlaceholder")}
                {...form.register("landSize")}
                className="h-12 flex-1 rounded-xl border-border/60 bg-background/80"
              />
              <div className="flex overflow-hidden rounded-xl border border-border/60">
                {(["m²", "Hektar"] as const).map((unit) => (
                  <button
                    key={unit}
                    type="button"
                    onClick={() => {
                      form.setValue("unit", unit, { shouldValidate: true, shouldDirty: true });
                    }}
                    className={`px-3 py-3 text-xs font-medium transition-all ${
                      form.watch("unit") === unit
                        ? "bg-primary text-primary-foreground"
                        : "bg-background/80 text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {unit}
                  </button>
                ))}
              </div>
            </div>
            <FieldError errors={[form.formState.errors.landSize as any]} />
          </Field>

          {/* Soil Type */}
          <Field>
            <FieldLabel htmlFor="soilType" className="mb-1 flex items-center gap-2">
              <Mountain className="h-3.5 w-3.5 text-muted-foreground" />
              {t("form.soilType")}
            </FieldLabel>
            <Controller
              control={form.control}
              name="soilType"
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="w-full h-12 rounded-xl border-border/60 bg-background/80">
                    <SelectValue placeholder={t("form.soilTypePlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {soilOptions.map((soil) => (
                      <SelectItem key={soil.value} value={soil.value}>
                        {t(soil.labelKey)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError errors={[form.formState.errors.soilType as any]} />
          </Field>

          {/* Growth Stage */}
          <Field>
            <FieldLabel htmlFor="growthStage" className="mb-1 flex items-center gap-2">
              <Flower2 className="h-3.5 w-3.5 text-muted-foreground" />
              {t("form.growthStage")}
            </FieldLabel>
            <Controller
              control={form.control}
              name="growthStage"
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="w-full h-12 rounded-xl border-border/60 bg-background/80">
                    <SelectValue placeholder={t("form.growthStagePlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {stageOptions.map((stage) => (
                      <SelectItem key={stage.value} value={stage.value}>
                        {t(stage.labelKey)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError errors={[form.formState.errors.growthStage as any]} />
          </Field>
        </div>

        {/* Calculate Button */}
        <button
          type="submit"
          disabled={!form.formState.isValid}
          className="mt-8 w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none sm:w-auto sm:px-10"
        >
          {t("form.calculate")}
        </button>
      </form>
    </div>
  );
};

export default FormStep;
