"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslations } from "next-intl";
import { useRegisterSeller } from "../hooks/use-register-seller";
import { useSellerMe } from "../hooks/use-seller-me";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ProvinceSelect } from "@/features/address/components/province-select";
import { RegencySelect } from "@/features/address/components/regency-select";
import { Store, Loader2, Info, ArrowLeft, ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";

const step1Schema = z.object({
  storeName: z.string().min(3, "Nama toko minimal 3 karakter").max(80),
  storeSlug: z
    .string()
    .min(3, "Slug toko minimal 3 karakter")
    .max(60)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Hanya huruf kecil, angka, dan strip (tanpa spasi)"),
});

const step2Schema = z.object({
  phone: z
    .string()
    .min(8, "Nomor telepon minimal 8 karakter")
    .refine(
      (val) => /^(\+62|62|0)[0-9]{7,15}$/.test(val.replace(/[\s-]/g, "")),
      "Format nomor telepon tidak valid",
    ),
  province: z.string().min(1, "Provinsi harus dipilih"),
  city: z.string().min(1, "Kota/Kabupaten harus dipilih"),
  postalCode: z.string().min(5, "Kode pos harus 5 angka").max(5, "Kode pos harus 5 angka"),
  address: z.string().min(5, "Alamat lengkap minimal 5 karakter"),
});

const step3Schema = z.object({
  description: z.string().max(1000).optional(),
});

const fullSchema = step1Schema.merge(step2Schema).merge(step3Schema);

export function SellerRegisterPage() {
  const t = useTranslations("seller.register");
  const registerSeller = useRegisterSeller();
  const { data: sellerMe, isLoading } = useSellerMe();
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const [selectedProvince, setSelectedProvince] = useState<{ id: string; name: string } | null>(null);
  const [selectedRegency, setSelectedRegency] = useState<{ id: string; name: string } | null>(null);

  const form = useForm<z.infer<typeof fullSchema>>({
    resolver: zodResolver(fullSchema),
    defaultValues: {
      storeName: "",
      storeSlug: "",
      phone: "",
      province: "",
      city: "",
      postalCode: "",
      address: "",
      description: "",
    },
    mode: "onChange",
  });

  // If already registered, redirect to seller center
  if (sellerMe && !isLoading) {
    router.replace("/seller");
    return null;
  }

  const nextStep = async () => {
    let isValid = false;
    
    if (step === 1) {
      isValid = await form.trigger(["storeName", "storeSlug"]);
    } else if (step === 2) {
      isValid = await form.trigger(["phone", "province", "city", "postalCode", "address"]);
    }

    if (isValid) {
      setStep((s) => s + 1);
    } else {
      toast.error("Silakan lengkapi semua bidang yang wajib diisi (*)");
    }
  };

  const prevStep = () => {
    setStep((s) => s - 1);
  };

  const onSubmit = (values: z.infer<typeof fullSchema>) => {
    registerSeller.mutate(values);
  };

  // Auto-generate slug from store name if slug hasn't been manually edited
  const handleStoreNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    form.setValue("storeName", value, { shouldValidate: true });
    
    if (!form.formState.dirtyFields.storeSlug) {
      const generatedSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .substring(0, 60);
      form.setValue("storeSlug", generatedSlug, { shouldValidate: true });
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 font-sans space-y-6">
      {/* ─── Tokopedia Seller Hero Banner ─── */}
      <div className="relative overflow-hidden rounded-2xl bg-primary p-6 sm:p-7 text-primary-foreground shadow-md">
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 px-3 py-0.5 text-[10px] font-bold tracking-wide uppercase text-primary-foreground/90">
              <Store className="w-3.5 h-3.5" />
              <span>{t("badge")}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold font-poppins tracking-tight">
              {t("title")}
            </h1>
            <p className="text-xs text-primary-foreground/90 max-w-lg leading-relaxed">
              {t("description")}
            </p>
          </div>

          <div className="hidden sm:flex h-14 w-14 rounded-2xl bg-primary-foreground/10 border border-primary-foreground/20 items-center justify-center text-primary-foreground shrink-0">
            <Store className="w-7 h-7" />
          </div>
        </div>
      </div>

      {/* ─── Tokopedia Style Horizontal Stepper Tabs ─── */}
      <div className="p-1.5 bg-muted/50 rounded-2xl border border-border/50 grid grid-cols-3 gap-2">
        {/* Step 1 Tab */}
        <div
          className={`flex items-center justify-center gap-2 p-2.5 rounded-xl transition-all ${
            step === 1
              ? "bg-card text-foreground font-bold shadow-xs border border-border/60 ring-1 ring-primary/20"
              : step > 1
              ? "bg-primary/10 text-primary font-semibold border border-primary/20"
              : "text-muted-foreground font-medium"
          }`}
        >
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
              step > 1
                ? "bg-primary text-primary-foreground"
                : step === 1
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {step > 1 ? <CheckCircle2 className="w-4 h-4" /> : "1"}
          </div>
          <div className="text-left min-w-0 hidden sm:block">
            <div className="text-xs truncate">{t("steps.1.title")}</div>
          </div>
        </div>

        {/* Step 2 Tab */}
        <div
          className={`flex items-center justify-center gap-2 p-2.5 rounded-xl transition-all ${
            step === 2
              ? "bg-card text-foreground font-bold shadow-xs border border-border/60 ring-1 ring-primary/20"
              : step > 2
              ? "bg-primary/10 text-primary font-semibold border border-primary/20"
              : "text-muted-foreground font-medium"
          }`}
        >
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
              step > 2
                ? "bg-primary text-primary-foreground"
                : step === 2
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {step > 2 ? <CheckCircle2 className="w-4 h-4" /> : "2"}
          </div>
          <div className="text-left min-w-0 hidden sm:block">
            <div className="text-xs truncate">{t("steps.2.title")}</div>
          </div>
        </div>

        {/* Step 3 Tab */}
        <div
          className={`flex items-center justify-center gap-2 p-2.5 rounded-xl transition-all ${
            step === 3
              ? "bg-card text-foreground font-bold shadow-xs border border-border/60 ring-1 ring-primary/20"
              : "text-muted-foreground font-medium"
          }`}
        >
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
              step === 3
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            3
          </div>
          <div className="text-left min-w-0 hidden sm:block">
            <div className="text-xs truncate">{t("steps.3.title")}</div>
          </div>
        </div>
      </div>

      {/* ─── Form Card Container ─── */}
      <Card className="border border-border/70 rounded-2xl bg-card shadow-xs overflow-hidden">
        <CardHeader className="border-b border-border/40 bg-muted/10 p-5">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold font-poppins text-foreground">
                {step === 1 && t("steps.1.title")}
                {step === 2 && t("steps.2.title")}
                {step === 3 && t("steps.3.title")}
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                {step === 1 && t("steps.1.description")}
                {step === 2 && t("steps.2.description")}
                {step === 3 && t("steps.3.description")}
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-[10px] font-mono font-bold uppercase bg-primary/10 text-primary border-primary/30">
              Langkah {step} dari 3
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-5 sm:p-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            
            {/* Step 1: Informasi Toko */}
            {step === 1 && (
              <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <Field>
                  <FieldLabel htmlFor="storeName" className="text-xs font-semibold text-foreground">
                    {t("form.storeNameLabel")} <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    id="storeName"
                    placeholder="Toko Tani Berkah"
                    {...form.register("storeName")}
                    onChange={handleStoreNameChange}
                    className="text-xs h-10 rounded-xl"
                  />
                  <FieldError errors={[form.formState.errors.storeName as any]} />
                </Field>

                <Field>
                  <FieldLabel htmlFor="storeSlug" className="text-xs font-semibold text-foreground">
                    {t("form.storeSlugLabel")} <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    id="storeSlug"
                    placeholder="toko-tani-berkah"
                    {...form.register("storeSlug")}
                    className="text-xs h-10 rounded-xl font-mono"
                  />
                  <FieldDescription className="text-[11px] text-muted-foreground">
                    {t("form.storeSlugDescription")}
                  </FieldDescription>
                  <FieldError errors={[form.formState.errors.storeSlug as any]} />
                </Field>
              </div>
            )}

            {/* Step 2: Kontak & Alamat Pengiriman */}
            {step === 2 && (
              <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <Field>
                  <FieldLabel htmlFor="phone" className="text-xs font-semibold text-foreground">
                    {t("form.phoneLabel")} <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    id="phone"
                    placeholder="08123456789"
                    {...form.register("phone")}
                    className="text-xs h-10 rounded-xl"
                  />
                  <FieldError errors={[form.formState.errors.phone as any]} />
                </Field>

                {/* Dropdown Wilayah / Daerah (ProvinceSelect & RegencySelect) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <ProvinceSelect
                    value={selectedProvince?.id}
                    onSelect={(prov) => {
                      setSelectedProvince(prov);
                      form.setValue("province", prov.name, { shouldValidate: true });
                      setSelectedRegency(null);
                      form.setValue("city", "", { shouldValidate: true });
                    }}
                    error={form.formState.errors.province as any}
                  />

                  <RegencySelect
                    provinceId={selectedProvince?.id}
                    value={selectedRegency?.id}
                    onSelect={(reg) => {
                      setSelectedRegency(reg);
                      form.setValue("city", reg.name, { shouldValidate: true });
                    }}
                    error={form.formState.errors.city as any}
                  />
                </div>

                <Field>
                  <FieldLabel htmlFor="postalCode" className="text-xs font-semibold text-foreground">
                    {t("form.postalCodeLabel")} <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    id="postalCode"
                    placeholder="40123"
                    maxLength={5}
                    {...form.register("postalCode")}
                    className="text-xs h-10 rounded-xl font-mono"
                  />
                  <FieldError errors={[form.formState.errors.postalCode as any]} />
                </Field>

                <Field>
                  <FieldLabel htmlFor="address" className="text-xs font-semibold text-foreground">
                    {t("form.addressLabel")} <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Textarea
                    id="address"
                    placeholder="Jl. Merdeka No. 10, RT 01/RW 02..."
                    className="text-xs rounded-xl resize-none min-h-[90px]"
                    {...form.register("address")}
                  />
                  <FieldError errors={[form.formState.errors.address as any]} />
                </Field>
              </div>
            )}

            {/* Step 3: Deskripsi Toko */}
            {step === 3 && (
              <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <Alert className="bg-primary/10 border-primary/30 text-primary font-medium rounded-xl">
                  <Info className="h-4 w-4 text-primary" />
                  <AlertTitle className="text-xs font-bold font-poppins">{t("form.almostDone")}</AlertTitle>
                  <AlertDescription className="text-[11px] leading-relaxed text-muted-foreground">
                    {t("form.almostDoneDescription")}
                  </AlertDescription>
                </Alert>

                <Field>
                  <FieldLabel htmlFor="description" className="text-xs font-semibold text-foreground">
                    {t("form.descriptionLabel")}
                  </FieldLabel>
                  <Textarea
                    id="description"
                    placeholder={t("form.descriptionPlaceholder")}
                    className="text-xs rounded-xl min-h-[120px] resize-none"
                    {...form.register("description")}
                  />
                  <FieldDescription className="text-[11px] text-muted-foreground">
                    {t("form.descriptionHint")}
                  </FieldDescription>
                  <FieldError errors={[form.formState.errors.description as any]} />
                </Field>
              </div>
            )}

            {/* Navigation & Submit Buttons */}
            <div className="flex items-center justify-between pt-5 border-t border-border/40">
              {step > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={prevStep}
                  className="text-xs font-bold rounded-xl h-9 px-4 gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  {t("buttons.back")}
                </Button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <Button
                  type="button"
                  size="sm"
                  onClick={nextStep}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold rounded-xl h-9 px-5 gap-1.5 cursor-pointer ml-auto shadow-xs"
                >
                  {t("buttons.next")}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  size="sm"
                  disabled={registerSeller.isPending}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold rounded-xl h-9 px-6 gap-2 cursor-pointer ml-auto shadow-xs"
                >
                  {registerSeller.isPending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    t("buttons.submit")
                  )}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
