"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { UserProfile } from "@/types/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { AvatarUploader } from "./avatar-uploader";
import { SellerStatusBadge } from "./seller-status-badge";
import { useUpdateProfile } from "../hooks/use-update-profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Store, ArrowRight, Mail, Phone, User, ShieldCheck } from "lucide-react";

interface ProfileCardProps {
  profile: UserProfile;
}

const formSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter").max(100),
  phone: z
    .string()
    .min(8, "Nomor telepon minimal 8 karakter")
    .regex(/^(\+62|62|0)[0-9]{7,15}$/, "Format nomor telepon tidak valid")
    .or(z.literal("")),
});

export function ProfileCard({ profile }: ProfileCardProps) {
  const t = useTranslations("profile.card");
  const updateProfile = useUpdateProfile();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: profile.name || "",
      phone: profile.phone || "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateProfile.mutate({
      name: values.name,
      phone: values.phone || undefined,
    });
  };

  return (
    <div className="space-y-6 font-sans">
      {/* ── Active / Pending Seller Store Card Widget ── */}
      {profile.sellerProfile && (
        <Card className="border border-border/70 bg-card rounded-2xl p-5 shadow-xs overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Store className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-poppins font-bold text-sm text-foreground">
                    {profile.sellerProfile.storeName || "Toko Anda"}
                  </span>
                  <SellerStatusBadge status={profile.sellerProfile.status} />
                </div>
                <p className="text-xs text-muted-foreground">
                  {profile.sellerProfile.status === "ACTIVE"
                    ? "Kelola katalog produk, pesanan pembeli, dan grafik performa toko Anda."
                    : profile.sellerProfile.status === "PENDING"
                    ? "Pendaftaran toko Anda sedang diverifikasi oleh tim admin LoopTani."
                    : "Pendaftaran toko belum disetujui. Silakan periksa kembali profil registrasi Anda."}
                </p>
              </div>
            </div>

            {profile.sellerProfile.status === "ACTIVE" && (
              <Button
                asChild
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs rounded-xl h-9 px-4 shrink-0 shadow-xs cursor-pointer"
              >
                <Link href="/seller" className="flex items-center gap-1.5 font-poppins">
                  Ke Dashboard Toko <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            )}

            {profile.sellerProfile.status === "REJECTED" && (
              <Button
                asChild
                size="sm"
                variant="outline"
                className="rounded-xl h-9 px-4 text-xs font-bold shrink-0 cursor-pointer"
              >
                <Link href="/seller/register">
                  Daftar Ulang
                </Link>
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* ── Main Profile Edit Card ── */}
      <Card className="w-full border border-border/70 rounded-2xl bg-card shadow-xs overflow-hidden">
        <CardHeader className="bg-muted/30 p-5 sm:p-6 border-b border-border/50">
          <CardTitle className="text-base font-bold text-foreground font-poppins">
            {t("title") || "Informasi Profil"}
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            {t("description") || "Kelola informasi biodata akun Anda"}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* Avatar Section */}
            <div className="w-full lg:w-56 shrink-0 flex flex-col items-center p-5 border border-border/60 rounded-2xl bg-muted/20 space-y-3.5">
              <AvatarUploader 
                currentAvatar={profile.image} 
                name={profile.name} 
              />
              
              {profile.sellerProfile ? (
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-bold text-[11px] px-3 py-0.5 rounded-full">
                  Mitra Penjual
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-muted text-muted-foreground border-border/60 font-medium text-[11px] px-3 py-0.5 rounded-full">
                  Akun Pembeli
                </Badge>
              )}
            </div>

            {/* Biodata Form */}
            <div className="flex-1 w-full space-y-5">
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 font-sans">
                
                {/* Full Name */}
                <Field>
                  <FieldLabel htmlFor="name" className="text-xs font-bold text-foreground">
                    {t("nameLabel") || "Nama Lengkap"}
                  </FieldLabel>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="name" placeholder="Nama Lengkap Anda" className="pl-10 rounded-xl text-xs border-border/70" {...form.register("name")} />
                  </div>
                  <FieldError errors={[form.formState.errors.name as any]} />
                </Field>

                {/* Email (Disabled) */}
                <Field>
                  <FieldLabel htmlFor="email" className="text-xs font-bold text-foreground">
                    {t("emailLabel") || "Alamat Email"}
                  </FieldLabel>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="email" value={profile.email} disabled className="pl-10 rounded-xl text-xs bg-muted/50 border-border/70 cursor-not-allowed text-muted-foreground" />
                  </div>
                  <FieldDescription className="text-[11px] text-muted-foreground">{t("emailDescription") || "Email terhubung dengan sistem login akun."}</FieldDescription>
                </Field>

                {/* Phone Number */}
                <Field>
                  <FieldLabel htmlFor="phone" className="text-xs font-bold text-foreground">
                    {t("phoneLabel") || "Nomor Telepon / WA"}
                  </FieldLabel>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="phone" placeholder="08123456789" className="pl-10 rounded-xl text-xs border-border/70" {...form.register("phone")} />
                  </div>
                  <FieldError errors={[form.formState.errors.phone as any]} />
                </Field>

                {/* Submit button */}
                <div className="flex justify-end pt-3">
                  <Button 
                    type="submit" 
                    disabled={updateProfile.isPending || !form.formState.isDirty}
                    className="rounded-xl px-5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs h-9 shadow-xs cursor-pointer"
                  >
                    {updateProfile.isPending && (
                      <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                    )}
                    {t("saveButton") || "Simpan Perubahan"}
                  </Button>
                </div>
              </form>
            </div>

          </div>
        </CardContent>
      </Card>

      {/* Seller Registration Banner CTA for Non-Sellers */}
      {!profile.sellerProfile && (
        <Card className="border border-primary/30 bg-primary/5 p-6 rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Store className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-poppins text-sm font-bold text-foreground">
                Mulai Berjualan di LoopTani
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
                Daftar sebagai mitra penjual untuk mengolah & memasarkan produk pertanian sirkular, pupuk organik, dan alat pertanian.
              </p>
            </div>
          </div>

          <Button
            asChild
            className="shrink-0 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs px-5 h-10 shadow-xs cursor-pointer"
          >
            <Link href="/seller/register" className="flex items-center gap-1.5 font-poppins">
              Daftar Jadi Seller <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </Card>
      )}
    </div>
  );
}
