"use client";

import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Settings, ShieldAlert, Check } from "lucide-react";

export default function PlatformSettingsPage() {
  const t = useTranslations("admin.settings");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      maintenanceMode: false,
      minWithdrawal: 50000,
      commissionRate: 2.5,
    },
  });

  const maintenanceMode = watch("maintenanceMode");

  const onSubmit = async (data: any) => {
    // Simulate updating settings
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success(t("successMessage"), {
      icon: <Check className="w-4 h-4 text-emerald-600" />,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{t("title")}</h1>
        <p className="text-muted-foreground mt-1">{t("subtitle")}</p>
      </div>

      <div className="bg-card border rounded-2xl shadow-xs overflow-hidden max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6 space-y-6">
            {/* Maintenance Mode */}
            <div className="flex items-start justify-between p-4 bg-muted/20 border rounded-2xl gap-4">
              <div className="space-y-1">
                <span className="font-semibold text-sm text-foreground flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-500" />
                  {t("maintenance")}
                </span>
                <p className="text-xs text-muted-foreground max-w-md">
                  {t("maintenanceDesc")}
                </p>
              </div>
              <Switch
                checked={maintenanceMode}
                onCheckedChange={(checked) => setValue("maintenanceMode", checked)}
              />
            </div>

            {/* Min Withdrawal */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">{t("minWithdrawal")}</label>
              <Input
                type="number"
                {...register("minWithdrawal", { required: true, min: 0 })}
                className="rounded-xl bg-card border"
              />
            </div>

            {/* Commission Rate */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">{t("commissionRate")}</label>
              <Input
                type="number"
                step="0.1"
                {...register("commissionRate", { required: true, min: 0, max: 100 })}
                className="rounded-xl bg-card border"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 p-6 border-t bg-muted/10">
            <Button type="submit" disabled={isSubmitting} className="rounded-xl">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("save")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Simple loader helper if needed (loader wasn't imported in standard next files, let's inject loader2 directly or import it)
import { Loader2 } from "lucide-react";
