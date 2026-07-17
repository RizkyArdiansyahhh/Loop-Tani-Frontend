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
import { Button as UIButton } from "@/components/ui/button";
import { Loader2, Store, ArrowRight, Mail, Phone, User } from "lucide-react";

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
    <div className="space-y-6">
      <Card className="w-full ring-0 border border-gray-200 rounded-xl dark:border-gray-800 dark:bg-gray-900 shadow-3xs overflow-hidden">
        <CardHeader className="bg-gray-50/50 dark:bg-gray-850/40 p-6 border-b border-gray-200 dark:border-gray-800/80">
          <CardTitle className="text-lg font-bold text-gray-900 dark:text-white font-fraunces">
            {t("title")}
          </CardTitle>
          <CardDescription className="text-xs">
            {t("description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row gap-10 items-start">
            
            {/* Left side: Avatar section (inside a clean soft border card) */}
            <div className="w-full lg:w-64 shrink-0 flex flex-col items-center p-5 border border-gray-200 rounded-xl bg-gray-50/20 dark:border-gray-800 dark:bg-gray-900/40 space-y-4">
              <AvatarUploader 
                currentAvatar={profile.image} 
                name={profile.name} 
              />
              
              {profile.sellerProfile ? (
                <div className="w-full pt-2 flex flex-col items-center">
                  <span className="text-4xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Status Mitra</span>
                  <SellerStatusBadge status={profile.sellerProfile.status} />
                </div>
              ) : (
                <Badge className="bg-gray-100 text-gray-600 border-0 font-semibold text-[10px] px-2.5 py-1">
                  Akun Pembeli
                </Badge>
              )}
            </div>

            {/* Right side: Biodata Edit Form */}
            <div className="flex-1 w-full space-y-6">
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                
                {/* Full name input */}
                <Field>
                  <FieldLabel htmlFor="name" className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    {t("nameLabel")}
                  </FieldLabel>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input id="name" placeholder="Nama Lengkap Anda" className="pl-9.5 rounded-lg border-gray-200" {...form.register("name")} />
                  </div>
                  <FieldError errors={[form.formState.errors.name as any]} />
                </Field>

                {/* Email (Disabled) */}
                <Field>
                  <FieldLabel htmlFor="email" className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    {t("emailLabel")}
                  </FieldLabel>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input id="email" value={profile.email} disabled className="pl-9.5 rounded-lg bg-gray-50 border-gray-200 cursor-not-allowed dark:bg-gray-850 dark:border-gray-800" />
                  </div>
                  <FieldDescription className="text-3xs">{t("emailDescription")}</FieldDescription>
                </Field>

                {/* Phone number input */}
                <Field>
                  <FieldLabel htmlFor="phone" className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    {t("phoneLabel")}
                  </FieldLabel>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input id="phone" placeholder="08123456789" className="pl-9.5 rounded-lg border-gray-200" {...form.register("phone")} />
                  </div>
                  <FieldError errors={[form.formState.errors.phone as any]} />
                </Field>

                {/* Save changes button */}
                <div className="flex justify-end pt-4">
                  <UIButton 
                    type="submit" 
                    disabled={updateProfile.isPending || !form.formState.isDirty}
                    className="rounded-lg px-6 bg-primary hover:bg-emerald-700 text-white font-bold text-xs h-10 shadow-xs cursor-pointer"
                  >
                    {updateProfile.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {t("saveButton")}
                  </UIButton>
                </div>
              </form>
            </div>

          </div>
        </CardContent>
      </Card>

      {/* Seller Registration CTA for Buyers */}
      {!profile.sellerProfile && (
        <div className="relative overflow-hidden rounded-xl border border-emerald-100 bg-linear-to-r from-emerald-50/50 to-teal-50/30 p-6 shadow-3xs dark:border-emerald-950/20 dark:from-emerald-950/10 dark:to-teal-950/5 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          {/* Background glowing blobs */}
          <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-teal-400/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
              <Store className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <h4 className="font-fraunces text-base font-bold text-gray-900 dark:text-white leading-tight">
                Mulai Berjualan di LoopTani
              </h4>
              <p className="text-xs text-muted-foreground mt-1.5 max-w-lg leading-relaxed">
                Daftar sebagai mitra penjual untuk membuka akses jual beli hasil pertanian, mengolah limbah organik, dan berkontribusi menulis Panduan Tani demi mengumpulkan reward LoopPoints menarik.
              </p>
            </div>
          </div>

          <UIButton
            asChild
            className="relative z-10 shrink-0 rounded-lg bg-primary hover:bg-emerald-700 text-white font-bold text-xs px-6 py-5.5 shadow-xs transition-all hover:scale-102 duration-300 cursor-pointer"
          >
            <Link href="/seller/register" className="flex items-center gap-1.5">
              Daftar Jadi Seller <ArrowRight className="h-4 w-4" />
            </Link>
          </UIButton>
        </div>
      )}
    </div>
  );
}
