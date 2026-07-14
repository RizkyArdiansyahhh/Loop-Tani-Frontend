"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslations } from "next-intl";
import { useRegisterSeller } from "../hooks/use-register-seller";
import { useSellerMe } from "../hooks/use-seller-me";
import { useRouter } from "next/navigation";
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
import { Store, Loader2, Info } from "lucide-react";

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
    .regex(/^(\+62|62|0)[0-9]{7,15}$/, "Format nomor telepon tidak valid"),
  province: z.string().min(3, "Provinsi harus diisi"),
  city: z.string().min(3, "Kota/Kabupaten harus diisi"),
  postalCode: z.string().regex(/^[0-9]{5}$/, "Kode pos harus 5 angka"),
  address: z.string().min(10, "Alamat lengkap minimal 10 karakter"),
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

  // If already registered, redirect
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
    }
  };

  const prevStep = () => {
    setStep((s) => s - 1);
  };

  const onSubmit = (values: z.infer<typeof fullSchema>) => {
    registerSeller.mutate(values);
  };

  // Auto-generate slug from store name if slug is empty
  const handleStoreNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    form.setValue("storeName", value);
    
    if (!form.formState.dirtyFields.storeSlug) {
      const generatedSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .substring(0, 60);
      form.setValue("storeSlug", generatedSlug);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-4">
          <Store className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground mt-2">{t("description")}</p>
      </div>

      <div className="mb-8 flex justify-between relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -z-10 -translate-y-1/2"></div>
        <div 
          className="absolute top-1/2 left-0 h-1 bg-primary -z-10 -translate-y-1/2 transition-all duration-300"
          style={{ width: `${((step - 1) / 2) * 100}%` }}
        ></div>
        {[1, 2, 3].map((i) => (
          <div 
            key={i} 
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 border-background transition-colors ${
              step >= i ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            {i}
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {step === 1 && t("steps.1.title")}
            {step === 2 && t("steps.2.title")}
            {step === 3 && t("steps.3.title")}
          </CardTitle>
          <CardDescription>
            {step === 1 && t("steps.1.description")}
            {step === 2 && t("steps.2.description")}
            {step === 3 && t("steps.3.description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Step 1: Basic Info */}
              <div className={step === 1 ? "space-y-6" : "hidden"}>
                <Field>
                  <FieldLabel htmlFor="storeName">{t("form.storeNameLabel")} *</FieldLabel>
                  <Input id="storeName" placeholder="Toko Tani Berkah" {...form.register("storeName")} onChange={handleStoreNameChange} />
                  <FieldError errors={[form.formState.errors.storeName as any]} />
                </Field>

                <Field>
                  <FieldLabel htmlFor="storeSlug">{t("form.storeSlugLabel")} *</FieldLabel>
                  <Input id="storeSlug" placeholder="toko-tani-berkah" {...form.register("storeSlug")} />
                  <FieldDescription>{t("form.storeSlugDescription")}</FieldDescription>
                  <FieldError errors={[form.formState.errors.storeSlug as any]} />
                </Field>
              </div>

              {/* Step 2: Contact & Address */}
              <div className={step === 2 ? "space-y-6" : "hidden"}>
                <Field>
                  <FieldLabel htmlFor="phone">{t("form.phoneLabel")} *</FieldLabel>
                  <Input id="phone" placeholder="08123456789" {...form.register("phone")} />
                  <FieldError errors={[form.formState.errors.phone as any]} />
                </Field>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field>
                    <FieldLabel htmlFor="province">{t("form.provinceLabel")} *</FieldLabel>
                    <Input id="province" placeholder="Jawa Barat" {...form.register("province")} />
                    <FieldError errors={[form.formState.errors.province as any]} />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="city">{t("form.cityLabel")} *</FieldLabel>
                    <Input id="city" placeholder="Bandung" {...form.register("city")} />
                    <FieldError errors={[form.formState.errors.city as any]} />
                  </Field>
                </div>

                <Field>
                  <FieldLabel htmlFor="postalCode">{t("form.postalCodeLabel")} *</FieldLabel>
                  <Input id="postalCode" placeholder="40123" {...form.register("postalCode")} />
                  <FieldError errors={[form.formState.errors.postalCode as any]} />
                </Field>

                <Field>
                  <FieldLabel htmlFor="address">{t("form.addressLabel")} *</FieldLabel>
                  <Textarea id="address" placeholder="Jl. Merdeka No. 10..." className="resize-none" {...form.register("address")} />
                  <FieldError errors={[form.formState.errors.address as any]} />
                </Field>
              </div>

              {/* Step 3: Description */}
              <div className={step === 3 ? "space-y-6" : "hidden"}>
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>{t("form.almostDone")}</AlertTitle>
                  <AlertDescription>
                    {t("form.almostDoneDescription")}
                  </AlertDescription>
                </Alert>

                <Field>
                  <FieldLabel htmlFor="description">{t("form.descriptionLabel")}</FieldLabel>
                  <Textarea 
                    id="description"
                    placeholder={t("form.descriptionPlaceholder")} 
                    className="min-h-[120px] resize-none" 
                    {...form.register("description")} 
                  />
                  <FieldDescription>{t("form.descriptionHint")}</FieldDescription>
                  <FieldError errors={[form.formState.errors.description as any]} />
                </Field>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t">
                {step > 1 ? (
                  <Button type="button" variant="outline" onClick={prevStep}>
                    {t("buttons.back")}
                  </Button>
                ) : (
                  <div></div> // Spacer
                )}

                {step < 3 ? (
                  <Button type="button" onClick={nextStep}>
                    {t("buttons.next")}
                  </Button>
                ) : (
                  <Button type="submit" disabled={registerSeller.isPending}>
                    {registerSeller.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t("buttons.submit")}
                  </Button>
                )}
              </div>
            </form>
        </CardContent>
      </Card>
    </div>
  );
}
