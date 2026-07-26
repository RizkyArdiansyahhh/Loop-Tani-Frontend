"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useSellerMe } from "../hooks/use-seller-me";
import { useUpdateSellerSettings } from "../hooks/use-update-seller-settings";
import { useProvinces, useRegencies } from "@/features/address/hooks/use-regions";
import { Link } from "@/i18n/navigation";
import {
  Store,
  Upload,
  CheckCircle2,
  ExternalLink,
  Camera,
  BadgeCheck,
  MapPin,
  Phone,
  Building2,
  RefreshCw,
  Info,
  Clock,
  Truck,
  ShieldCheck,
  FileText,
  Share2,
  Globe,
  AtSign,
  Video,
  PlaySquare,
  MessageCircle,
  ImageIcon,
  Sprout,
  Leaf,
  Recycle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Field, FieldLabel, FieldError, FieldDescription } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
import { ProvinceSelect } from "@/features/address/components/province-select";
import { RegencySelect } from "@/features/address/components/regency-select";
import { StoreMediaEditorSheet } from "../components/store-media-editor-sheet";
import { toast } from "sonner";
import { settingsSchema, type SettingsFormValues } from "../types";
import { cn } from "@/lib/utils";

type TabKey = "info" | "location" | "social" | "policy" | "impact";

export function SellerSettingsPage() {
  const t = useTranslations("seller.settings");
  const { data: sellerMe, isLoading } = useSellerMe();
  const updateMutation = useUpdateSellerSettings();

  const { data: provinces = [] } = useProvinces();

  const [activeTab, setActiveTab] = useState<TabKey>("info");
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [bannerUrl, setBannerUrl] = useState<string>("");
  const [selectedProvince, setSelectedProvince] = useState<{ id: string; name: string } | null>(null);
  const [selectedRegency, setSelectedRegency] = useState<{ id: string; name: string } | null>(null);

  // Single clean state for side-panel media editor (logo / banner)
  const [mediaEditor, setMediaEditor] = useState<{ open: boolean; type: "logo" | "banner" }>({
    open: false,
    type: "logo",
  });

  const { data: regencies = [] } = useRegencies(selectedProvince?.id || "");

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      storeName: "",
      storeSlug: "",
      phone: "",
      province: "",
      city: "",
      postalCode: "",
      address: "",
      description: "",
      whatsapp: "",
      instagram: "",
      tiktok: "",
      website: "",
      youtube: "",
    },
  });

  // Pre-fill form values from DB
  useEffect(() => {
    if (sellerMe) {
      const getSocialUrl = (platform: string) => {
        if (Array.isArray(sellerMe.socialMedia)) {
          const item = sellerMe.socialMedia.find((s: any) => s.platform === platform);
          return item?.url || "";
        }
        return "";
      };

      form.reset({
        storeName: sellerMe.storeName || "",
        storeSlug: sellerMe.storeSlug || "",
        phone: sellerMe.phone || "",
        province: sellerMe.province || "",
        city: sellerMe.city || "",
        postalCode: sellerMe.postalCode || "",
        address: sellerMe.address || "",
        description: sellerMe.description || "",
        whatsapp: getSocialUrl("WHATSAPP") || (sellerMe as any).whatsapp || sellerMe.phone || "",
        instagram: getSocialUrl("INSTAGRAM") || (sellerMe as any).instagram || "",
        tiktok: getSocialUrl("TIKTOK") || (sellerMe as any).tiktok || "",
        website: getSocialUrl("WEBSITE") || (sellerMe as any).website || "",
        youtube: getSocialUrl("YOUTUBE") || (sellerMe as any).youtube || "",
      });
      if (sellerMe.logoUrl) setLogoUrl(sellerMe.logoUrl);
      if (sellerMe.bannerUrl) setBannerUrl(sellerMe.bannerUrl);
    }
  }, [sellerMe, form]);

  // Auto-select Province object from DB province string/ID
  useEffect(() => {
    if (sellerMe?.province && provinces.length > 0 && !selectedProvince) {
      const match = provinces.find(
        (p) =>
          p.id === sellerMe.province ||
          p.name.toLowerCase() === sellerMe.province?.toLowerCase()
      );
      if (match) {
        setSelectedProvince(match);
      }
    }
  }, [sellerMe, provinces, selectedProvince]);

  // Auto-select Regency object from DB city string/ID
  useEffect(() => {
    if (sellerMe?.city && regencies.length > 0 && !selectedRegency) {
      const match = regencies.find(
        (r) =>
          r.id === sellerMe.city ||
          r.name.toLowerCase() === sellerMe.city?.toLowerCase()
      );
      if (match) {
        setSelectedRegency(match);
      }
    }
  }, [sellerMe, regencies, selectedRegency]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Format file harus berupa gambar");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        setLogoUrl(base64);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Format file harus berupa gambar");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        setBannerUrl(base64);
      }
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = (values: SettingsFormValues) => {
    const socialMedia = [
      { platform: "WHATSAPP" as const, url: values.whatsapp || "" },
      { platform: "INSTAGRAM" as const, url: values.instagram || "" },
      { platform: "TIKTOK" as const, url: values.tiktok || "" },
      { platform: "WEBSITE" as const, url: values.website || "" },
      { platform: "YOUTUBE" as const, url: values.youtube || "" },
    ].filter((item) => item.url.trim().length > 0);

    updateMutation.mutate(
      {
        storeName: values.storeName,
        storeSlug: values.storeSlug,
        phone: values.phone,
        province: values.province,
        city: values.city,
        postalCode: values.postalCode,
        address: values.address,
        description: values.description,
        logoUrl: logoUrl || undefined,
        bannerUrl: bannerUrl || undefined,
        socialMedia,
      },
      {
        onSuccess: () => {
          toast.success(t("actions.successToast"));
        },
        onError: (err) => {
          toast.error(err.message || "Gagal memperbarui profil toko");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center min-h-[400px]">
        <div className="h-9 w-9 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-xs font-semibold text-muted-foreground">Memuat data profil toko...</p>
      </div>
    );
  }

  const watchedStoreName = form.watch("storeName") || sellerMe?.storeName || "Nama Toko Anda";
  const watchedStoreSlug = form.watch("storeSlug") || sellerMe?.storeSlug || "toko-anda";
  const watchedCity = form.watch("city") || sellerMe?.city;
  const watchedProvince = form.watch("province") || sellerMe?.province;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24 font-sans">
      {/* ── BIG HERO HEADER BANNER WITH CUSTOM COVER IMAGE ── */}
      <div
        className="relative overflow-hidden rounded-3xl bg-primary text-primary-foreground p-8 sm:p-10 shadow-lg border border-primary/20 bg-cover bg-center transition-all group"
        style={{
          backgroundImage: bannerUrl ? `linear-gradient(to right, rgba(0,0,0,0.75), rgba(0,0,0,0.5)), url("${bannerUrl}")` : undefined,
        }}
      >
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 min-w-0">
            {/* Big Logo Avatar */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white/10 backdrop-blur-md border-4 border-white/20 overflow-hidden shrink-0 flex items-center justify-center shadow-lg group">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo Toko" className="w-full h-full object-cover" />
              ) : (
                <Store className="w-12 h-12 text-white/70" />
              )}
              <button
                type="button"
                onClick={() => setMediaEditor({ open: true, type: "logo" })}
                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-xs font-bold cursor-pointer transition-opacity"
              >
                <Camera className="w-5 h-5 mb-1" />
                <span>Ganti Logo</span>
              </button>
            </div>

            {/* Store Meta Infos */}
            <div className="min-w-0 space-y-2">
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold font-poppins text-white truncate tracking-tight">
                  {watchedStoreName}
                </h1>
                <BadgeCheck className="w-6 h-6 text-emerald-300 shrink-0" />
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-white/90">
                <span className="font-mono bg-white/15 px-3 py-1 rounded-lg font-semibold text-white">
                  looptani.id/store/{watchedStoreSlug}
                </span>
                {(watchedCity || watchedProvince) && (
                  <span className="flex items-center gap-1.5 font-medium">
                    <MapPin className="w-4 h-4 text-emerald-300" />
                    <span>
                      {watchedCity && watchedProvince
                        ? `${watchedCity}, ${watchedProvince}`
                        : watchedCity || watchedProvince}
                    </span>
                  </span>
                )}
              </div>

              <div className="pt-1 flex flex-wrap items-center gap-2">
                <Badge className="bg-emerald-400/25 text-emerald-100 border-emerald-300/40 text-xs font-bold px-3 py-1 rounded-full">
                  {t("headerBadge")}
                </Badge>
              </div>
            </div>
          </div>

          {/* Action Button */}
          {watchedStoreSlug && (
            <Button
              asChild
              variant="secondary"
              className="bg-white text-primary hover:bg-white/90 h-11 px-6 rounded-2xl text-xs font-bold gap-2 cursor-pointer shadow-md shrink-0 w-full md:w-auto justify-center"
            >
              <Link href={`/store/${watchedStoreSlug}`} target="_blank">
                <span>{t("previewButton")}</span>
                <ExternalLink className="w-4 h-4" />
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* ── MODERN TAB NAVIGATION (Underline Indicator + Hover Effect) ── */}
      <div className="border-b border-border/60 flex flex-wrap sm:flex-nowrap gap-1 sm:gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("info")}
          className={cn(
            "relative flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold transition-all cursor-pointer rounded-t-xl hover:bg-muted/50",
            activeTab === "info"
              ? "text-primary border-b-2 border-primary bg-primary/5"
              : "text-muted-foreground hover:text-foreground border-b-2 border-transparent"
          )}
        >
          <Info className={cn("w-4 h-4", activeTab === "info" ? "text-primary" : "text-muted-foreground")} />
          <span>{t("tabs.info")}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("location")}
          className={cn(
            "relative flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold transition-all cursor-pointer rounded-t-xl hover:bg-muted/50",
            activeTab === "location"
              ? "text-primary border-b-2 border-primary bg-primary/5"
              : "text-muted-foreground hover:text-foreground border-b-2 border-transparent"
          )}
        >
          <MapPin className={cn("w-4 h-4", activeTab === "location" ? "text-primary" : "text-muted-foreground")} />
          <span>{t("tabs.location")}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("social")}
          className={cn(
            "relative flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold transition-all cursor-pointer rounded-t-xl hover:bg-muted/50",
            activeTab === "social"
              ? "text-primary border-b-2 border-primary bg-primary/5"
              : "text-muted-foreground hover:text-foreground border-b-2 border-transparent"
          )}
        >
          <Share2 className={cn("w-4 h-4", activeTab === "social" ? "text-primary" : "text-muted-foreground")} />
          <span>{t("tabs.social")}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("policy")}
          className={cn(
            "relative flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold transition-all cursor-pointer rounded-t-xl hover:bg-muted/50",
            activeTab === "policy"
              ? "text-primary border-b-2 border-primary bg-primary/5"
              : "text-muted-foreground hover:text-foreground border-b-2 border-transparent"
          )}
        >
          <ShieldCheck className={cn("w-4 h-4", activeTab === "policy" ? "text-primary" : "text-muted-foreground")} />
          <span>{t("tabs.policy")}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("impact")}
          className={cn(
            "relative flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold transition-all cursor-pointer rounded-t-xl hover:bg-muted/50",
            activeTab === "impact"
              ? "text-primary border-b-2 border-primary bg-primary/5"
              : "text-muted-foreground hover:text-foreground border-b-2 border-transparent"
          )}
        >
          <Sprout className={cn("w-4 h-4", activeTab === "impact" ? "text-primary" : "text-muted-foreground")} />
          <span>{t("tabs.impact")}</span>
          <Badge className="bg-primary/10 text-primary border-primary/20 text-[9.5px] font-extrabold px-1.5 py-0.2 rounded-full">
            {t("impactTab.comingSoonBadge")}
          </Badge>
        </button>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* ── TAB 1: INFORMASI DASAR TOKO (Basic Information & Cover Banner) ── */}
        {activeTab === "info" && (
          <Card className="rounded-3xl border border-border/60 shadow-xs overflow-hidden bg-card">
            <CardHeader className="border-b border-border/40 pb-4 bg-muted/20">
              <div className="flex items-center gap-2 text-xs font-bold text-primary">
                <Store className="w-4 h-4" />
                <span>{t("infoTab.badge")}</span>
              </div>
              <CardTitle className="text-base font-bold text-foreground">
                {t("infoTab.title")}
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                {t("infoTab.description")}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 sm:p-8 space-y-6">
              {/* Single Horizontal Row for Banner (80% width) & Logo (20% width) */}
              <div className="flex flex-col sm:flex-row items-stretch gap-6">
                {/* Cover Banner Upload Box (80% Width) */}
                <Field className="w-full sm:w-[78%]">
                  <FieldLabel className="text-xs font-semibold text-foreground">
                    <span>Banner Sampul Toko</span>
                  </FieldLabel>
                  <div className="relative rounded-2xl border border-border/60 overflow-hidden bg-muted/10 p-4 space-y-3 flex flex-col justify-between h-[calc(100%-1.75rem)]">
                    {bannerUrl ? (
                      <div className="relative h-28 w-full rounded-xl overflow-hidden border border-border">
                        <img src={bannerUrl} alt="Banner Sampul" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setBannerUrl("")}
                          className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white text-[10px] font-bold px-2 py-1 rounded-lg transition-colors cursor-pointer"
                        >
                          Hapus Banner
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-border/60 rounded-xl bg-card text-center space-y-1.5 flex-1 min-h-28">
                        <ImageIcon className="w-6 h-6 text-muted-foreground" />
                        <p className="text-xs font-semibold text-foreground">Belum ada banner sampul</p>
                        <p className="text-[10.5px] text-muted-foreground">
                          Rekomendasi 1200 x 400 px
                        </p>
                      </div>
                    )}

                    <div className="pt-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full rounded-xl text-xs font-bold cursor-pointer gap-2 h-9 border-border justify-center"
                        onClick={() => setMediaEditor({ open: true, type: "banner" })}
                      >
                        <Upload className="w-3.5 h-3.5 text-primary" />
                        <span>Edit & Zoom Banner</span>
                      </Button>
                    </div>
                  </div>
                </Field>

                {/* Logo Upload Box (20% Width) */}
                <Field className="w-full sm:w-[22%]">
                  <FieldLabel className="text-xs font-semibold text-foreground">
                    {t("infoTab.logoLabel")}
                  </FieldLabel>
                  <div className="relative rounded-2xl border border-border/60 bg-muted/10 p-3 space-y-3 flex flex-col items-center justify-between text-center h-[calc(100%-1.75rem)]">
                    <div className="flex flex-col items-center gap-2 flex-1 justify-center py-1">
                      <div className="relative w-16 h-16 rounded-2xl border border-border bg-card overflow-hidden shrink-0 flex items-center justify-center shadow-xs">
                        {logoUrl ? (
                          <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                        ) : (
                          <Store className="w-7 h-7 text-muted-foreground" />
                        )}
                      </div>
                      <p className="text-[10.5px] font-bold text-foreground truncate w-full">Logo Toko</p>
                    </div>

                    <div className="w-full space-y-1 pt-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full rounded-xl text-[11px] font-bold cursor-pointer gap-1.5 h-8 border-border justify-center px-2"
                        onClick={() => setMediaEditor({ open: true, type: "logo" })}
                      >
                        <Upload className="w-3 h-3 text-primary" />
                        <span>Edit Logo</span>
                      </Button>
                      {logoUrl && (
                        <button
                          type="button"
                          className="w-full text-[10px] font-bold text-rose-600 hover:underline cursor-pointer py-0.5"
                          onClick={() => setLogoUrl("")}
                        >
                          Hapus Logo
                        </button>
                      )}
                    </div>
                  </div>
                </Field>
              </div>

              {/* Nama & Slug Toko */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Field>
                  <FieldLabel htmlFor="storeName" className="text-xs font-semibold text-foreground">
                    {t("infoTab.storeNameLabel")} <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    id="storeName"
                    placeholder="Contoh: Tani Makmur Organik"
                    {...form.register("storeName")}
                    className="text-xs h-11 rounded-xl border-border/60"
                  />
                  <FieldError errors={[form.formState.errors.storeName as any]} />
                </Field>

                <Field>
                  <FieldLabel htmlFor="storeSlug" className="text-xs font-semibold text-foreground">
                    {t("infoTab.storeSlugLabel")} <span className="text-destructive">*</span>
                  </FieldLabel>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 text-xs font-mono font-medium text-muted-foreground select-none pointer-events-none">
                      looptani.id/store/
                    </div>
                    <Input
                      id="storeSlug"
                      placeholder="tani-makmur"
                      {...form.register("storeSlug")}
                      className="text-xs h-11 rounded-xl border-border/60 font-mono pl-32"
                    />
                  </div>
                  <FieldDescription className="text-[11px]">
                    {t("infoTab.storeSlugHint")}
                  </FieldDescription>
                  <FieldError errors={[form.formState.errors.storeSlug as any]} />
                </Field>
              </div>

              {/* Deskripsi Toko */}
              <Field>
                <FieldLabel htmlFor="description" className="text-xs font-semibold text-foreground">
                  {t("infoTab.descriptionLabel")}
                </FieldLabel>
                <Textarea
                  id="description"
                  placeholder={t("infoTab.descriptionPlaceholder")}
                  {...form.register("description")}
                  className="text-xs rounded-xl min-h-32 border-border/60 leading-relaxed"
                />
                <FieldError errors={[form.formState.errors.description as any]} />
              </Field>
            </CardContent>
          </Card>
        )}

        {/* ── TAB 2: ALAMAT ASAL & EKSPEDISI (Address & Shipping) ── */}
        {activeTab === "location" && (
          <Card className="rounded-3xl border border-border/60 shadow-xs overflow-hidden bg-card">
            <CardHeader className="border-b border-border/40 pb-4 bg-muted/20">
              <div className="flex items-center gap-2 text-xs font-bold text-primary">
                <Building2 className="w-4 h-4" />
                <span>{t("locationTab.badge")}</span>
              </div>
              <CardTitle className="text-base font-bold text-foreground">
                {t("locationTab.title")}
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                {t("locationTab.description")}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 sm:p-8 space-y-6">
              {/* Phone Number */}
              <Field>
                <FieldLabel htmlFor="phone" className="text-xs font-semibold text-foreground">
                  {t("locationTab.phoneLabel")}
                </FieldLabel>
                <div className="relative flex items-center">
                  <Phone className="absolute left-3.5 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="phone"
                    placeholder="081234567890"
                    {...form.register("phone")}
                    className="text-xs h-11 rounded-xl border-border/60 font-mono pl-10"
                  />
                </div>
                <FieldDescription className="text-[11px]">
                  {t("locationTab.phoneHint")}
                </FieldDescription>
                <FieldError errors={[form.formState.errors.phone as any]} />
              </Field>

              {/* Region Location Dropdowns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <ProvinceSelect
                  value={selectedProvince?.id}
                  onSelect={(prov: any) => {
                    setSelectedProvince(prov);
                    form.setValue("province", prov.name);
                    setSelectedRegency(null);
                    form.setValue("city", "");
                  }}
                  error={form.formState.errors.province as any}
                />

                <RegencySelect
                  provinceId={selectedProvince?.id}
                  value={selectedRegency?.id}
                  onSelect={(reg: any) => {
                    setSelectedRegency(reg);
                    form.setValue("city", reg.name);
                  }}
                  error={form.formState.errors.city as any}
                />
              </div>

              {/* Address & Postal Code */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
                <div className="sm:col-span-3">
                  <Field>
                    <FieldLabel htmlFor="address" className="text-xs font-semibold text-foreground">
                      {t("locationTab.addressLabel")}
                    </FieldLabel>
                    <Textarea
                      id="address"
                      placeholder={t("locationTab.addressPlaceholder")}
                      {...form.register("address")}
                      className="text-xs rounded-xl min-h-24 border-border/60 leading-relaxed"
                    />
                    <FieldError errors={[form.formState.errors.address as any]} />
                  </Field>
                </div>

                <div>
                  <Field>
                    <FieldLabel htmlFor="postalCode" className="text-xs font-semibold text-foreground">
                      {t("locationTab.postalCodeLabel")}
                    </FieldLabel>
                    <Input
                      id="postalCode"
                      placeholder="40123"
                      {...form.register("postalCode")}
                      className="text-xs h-11 rounded-xl border-border/60 font-mono"
                    />
                    <FieldError errors={[form.formState.errors.postalCode as any]} />
                  </Field>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── TAB 3: MEDIA SOSIAL & TAUTAN EKSTERNAL (Social & Web) ── */}
        {activeTab === "social" && (
          <Card className="rounded-3xl border border-border/60 shadow-xs overflow-hidden bg-card">
            <CardHeader className="border-b border-border/40 pb-4 bg-muted/20">
              <div className="flex items-center gap-2 text-xs font-bold text-primary">
                <Share2 className="w-4 h-4" />
                <span>{t("socialTab.badge")}</span>
              </div>
              <CardTitle className="text-base font-bold text-foreground">
                {t("socialTab.title")}
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                {t("socialTab.description")}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Direct WhatsApp Business */}
                <Field>
                  <FieldLabel htmlFor="whatsapp" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t("socialTab.whatsappLabel")}</span>
                  </FieldLabel>
                  <div className="relative flex items-center">
                    <Phone className="absolute left-3.5 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="whatsapp"
                      placeholder="081234567890"
                      {...form.register("whatsapp")}
                      className="text-xs h-11 rounded-xl border-border/60 font-mono pl-10"
                    />
                  </div>
                  <FieldDescription className="text-[11px]">
                    {t("socialTab.whatsappHint")}
                  </FieldDescription>
                </Field>

                {/* Instagram */}
                <Field>
                  <FieldLabel htmlFor="instagram" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <AtSign className="w-3.5 h-3.5 text-pink-600" />
                    <span>{t("socialTab.instagramLabel")}</span>
                  </FieldLabel>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 text-xs font-mono font-medium text-muted-foreground select-none">
                      @
                    </div>
                    <Input
                      id="instagram"
                      placeholder="tanimakmur.id"
                      {...form.register("instagram")}
                      className="text-xs h-11 rounded-xl border-border/60 font-mono pl-8"
                    />
                  </div>
                  <FieldDescription className="text-[11px]">
                    {t("socialTab.instagramHint")}
                  </FieldDescription>
                </Field>

                {/* TikTok */}
                <Field>
                  <FieldLabel htmlFor="tiktok" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-slate-800 dark:text-slate-200" />
                    <span>{t("socialTab.tiktokLabel")}</span>
                  </FieldLabel>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 text-xs font-mono font-medium text-muted-foreground select-none">
                      @
                    </div>
                    <Input
                      id="tiktok"
                      placeholder="tanimakmur_official"
                      {...form.register("tiktok")}
                      className="text-xs h-11 rounded-xl border-border/60 font-mono pl-8"
                    />
                  </div>
                  <FieldDescription className="text-[11px]">
                    {t("socialTab.tiktokHint")}
                  </FieldDescription>
                </Field>

                {/* Website */}
                <Field>
                  <FieldLabel htmlFor="website" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-blue-600" />
                    <span>{t("socialTab.websiteLabel")}</span>
                  </FieldLabel>
                  <Input
                    id="website"
                    placeholder="https://tanimakmur.com"
                    {...form.register("website")}
                    className="text-xs h-11 rounded-xl border-border/60 font-mono"
                  />
                  <FieldDescription className="text-[11px]">
                    {t("socialTab.websiteHint")}
                  </FieldDescription>
                </Field>

                {/* YouTube */}
                <Field className="sm:col-span-2">
                  <FieldLabel htmlFor="youtube" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <PlaySquare className="w-3.5 h-3.5 text-red-600" />
                    <span>{t("socialTab.youtubeLabel")}</span>
                  </FieldLabel>
                  <Input
                    id="youtube"
                    placeholder="https://youtube.com/@tanimakmur"
                    {...form.register("youtube")}
                    className="text-xs h-11 rounded-xl border-border/60 font-mono"
                  />
                  <FieldDescription className="text-[11px]">
                    {t("socialTab.youtubeHint")}
                  </FieldDescription>
                </Field>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── TAB 4: LAYANAN & KEBIJAKAN TOKO (Store Policy) ── */}
        {activeTab === "policy" && (
          <Card className="rounded-3xl border border-border/60 shadow-xs overflow-hidden bg-card">
            <CardHeader className="border-b border-border/40 pb-4 bg-muted/20">
              <div className="flex items-center gap-2 text-xs font-bold text-primary">
                <ShieldCheck className="w-4 h-4" />
                <span>{t("policyTab.badge")}</span>
              </div>
              <CardTitle className="text-base font-bold text-foreground">
                {t("policyTab.title")}
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                {t("policyTab.description")}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-5 rounded-2xl border border-border/60 bg-muted/10 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>{t("policyTab.hoursTitle")}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {t("policyTab.hoursDesc")}
                  </p>
                </div>

                <div className="p-5 rounded-2xl border border-border/60 bg-muted/10 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                    <Truck className="w-4 h-4 text-primary" />
                    <span>{t("policyTab.packagingTitle")}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {t("policyTab.packagingDesc")}
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  <FileText className="w-4 h-4" />
                  <span>{t("policyTab.guaranteeTitle")}</span>
                </div>
                <p className="text-xs text-emerald-700/80 dark:text-emerald-400/80 leading-relaxed">
                  {t("policyTab.guaranteeDesc")}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── TAB 5: DAMPAK SIRKULAR PERTANIAN (Circular Agriculture Impact) ── */}
        {activeTab === "impact" && (
          <div className="space-y-6">
            <Card className="rounded-3xl border border-primary/30 shadow-md overflow-hidden bg-card">
              <CardHeader className="border-b border-border/40 pb-4 bg-linear-to-r from-primary/10 via-primary/5 to-transparent p-6 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-primary">
                    <Sprout className="w-4 h-4" />
                    <span>{t("impactTab.badge")}</span>
                  </div>
                  <Badge className="bg-primary text-primary-foreground font-extrabold text-xs px-3 py-1 rounded-full shadow-xs">
                    {t("impactTab.comingSoonBadge")}
                  </Badge>
                </div>

                <CardTitle className="text-xl sm:text-2xl font-extrabold text-foreground pt-2">
                  {t("impactTab.title")}
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
                  {t("impactTab.description")}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6 sm:p-8 space-y-6">
                {/* 3 Metric Highlight Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Card 1: Limbah Diolah */}
                  <div className="relative rounded-2xl border border-primary/20 bg-linear-to-b from-primary/5 to-primary/10 p-6 space-y-3 shadow-xs hover:border-primary/40 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center">
                        <Recycle className="w-6 h-6 text-primary" />
                      </div>
                      <Badge className="bg-primary/20 text-primary dark:text-primary-foreground border-primary/30 text-[10px] font-bold">
                        {t("impactTab.comingSoonBadge")}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight font-poppins">
                        {(sellerMe as any)?.impactStats?.wasteProcessedKg ?? 0} <span className="text-lg font-bold text-muted-foreground">{t("impactTab.unitKg")}</span>
                      </p>
                      <p className="text-xs font-bold text-foreground pt-1">{t("impactTab.recycledWaste")}</p>
                      <p className="text-[11px] text-muted-foreground pt-1 leading-snug">
                        {t("impactTab.recycledWasteDesc")}
                      </p>
                    </div>
                  </div>

                  {/* Card 2: Produk Organik */}
                  <div className="relative rounded-2xl border border-primary/20 bg-linear-to-b from-primary/5 to-primary/10 p-6 space-y-3 shadow-xs hover:border-primary/40 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center">
                        <Leaf className="w-6 h-6 text-primary" />
                      </div>
                      <Badge className="bg-primary/20 text-primary dark:text-primary-foreground border-primary/30 text-[10px] font-bold">
                        {t("impactTab.comingSoonBadge")}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight font-poppins">
                        {(sellerMe as any)?.impactStats?.organicProductsCount ?? 0} <span className="text-lg font-bold text-muted-foreground">{t("impactTab.unitItems")}</span>
                      </p>
                      <p className="text-xs font-bold text-foreground pt-1">{t("impactTab.organicProducts")}</p>
                      <p className="text-[11px] text-muted-foreground pt-1 leading-snug">
                        {t("impactTab.organicProductsDesc")}
                      </p>
                    </div>
                  </div>

                  {/* Card 3: Petani Terbantu */}
                  <div className="relative rounded-2xl border border-primary/20 bg-linear-to-b from-primary/5 to-primary/10 p-6 space-y-3 shadow-xs hover:border-primary/40 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-primary" />
                      </div>
                      <Badge className="bg-primary/20 text-primary dark:text-primary-foreground border-primary/30 text-[10px] font-bold">
                        {t("impactTab.comingSoonBadge")}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight font-poppins">
                        {(sellerMe as any)?.impactStats?.farmersHelpedCount ?? 0} <span className="text-lg font-bold text-muted-foreground">{t("impactTab.unitPartners")}</span>
                      </p>
                      <p className="text-xs font-bold text-foreground pt-1">{t("impactTab.farmersHelped")}</p>
                      <p className="text-[11px] text-muted-foreground pt-1 leading-snug">
                        {t("impactTab.farmersHelpedDesc")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Highlight Mission Banner */}
                <div className="relative rounded-3xl bg-linear-to-r from-emerald-950 via-primary to-emerald-900 text-white p-6 sm:p-8 shadow-lg overflow-hidden border border-primary/30 space-y-3">
                  <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 rounded-full bg-white/5 blur-2xl pointer-events-none" />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
                      <Sprout className="w-5 h-5 text-emerald-200" />
                    </div>
                    <h3 className="text-base sm:text-lg font-extrabold font-poppins text-white">
                      {t("impactTab.highlightBannerTitle")}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-white/85 leading-relaxed max-w-3xl">
                    {t("impactTab.highlightBannerDesc")}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ── STICKY / FLOATING ACTION BAR ── */}
        <div className="sticky bottom-6 z-20 flex items-center justify-between gap-4 p-4 rounded-2xl bg-card/90 backdrop-blur-md border border-border/80 shadow-lg">
          <div className="text-xs text-muted-foreground hidden sm:block">
            {t("actions.hint")}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (sellerMe) {
                  form.reset({
                    storeName: sellerMe.storeName || "",
                    storeSlug: sellerMe.storeSlug || "",
                    phone: sellerMe.phone || "",
                    province: sellerMe.province || "",
                    city: sellerMe.city || "",
                    postalCode: sellerMe.postalCode || "",
                    address: sellerMe.address || "",
                    description: sellerMe.description || "",
                    whatsapp: (sellerMe as any).whatsapp || sellerMe.phone || "",
                    instagram: (sellerMe as any).instagram || "",
                    tiktok: (sellerMe as any).tiktok || "",
                    website: (sellerMe as any).website || "",
                    youtube: (sellerMe as any).youtube || "",
                  });
                  setLogoUrl(sellerMe.logoUrl || "");
                  setBannerUrl((sellerMe as any).bannerUrl || "");
                  toast.info(t("actions.cancelToast"));
                }
              }}
              className="h-11 px-5 rounded-xl text-xs font-bold cursor-pointer"
            >
              {t("actions.reset")}
            </Button>

            <Button
              type="submit"
              disabled={updateMutation.isPending}
              className="bg-primary hover:bg-primary/90 text-primary-foreground h-11 px-8 rounded-xl text-xs font-bold gap-2 cursor-pointer shadow-xs flex-1 sm:flex-none"
            >
              {updateMutation.isPending ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{t("actions.submitting")}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t("actions.submit")}</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </form>

      {/* ── SIDE PANEL MEDIA EDITOR SHEET (Logo / Banner) ── */}
      <StoreMediaEditorSheet
        open={mediaEditor.open}
        onOpenChange={(open) => setMediaEditor((prev) => ({ ...prev, open }))}
        type={mediaEditor.type}
        currentUrl={mediaEditor.type === "logo" ? logoUrl : bannerUrl}
        onApply={(newUrl) => {
          if (mediaEditor.type === "logo") {
            setLogoUrl(newUrl);
          } else {
            setBannerUrl(newUrl);
          }
        }}
      />
    </div>
  );
}
