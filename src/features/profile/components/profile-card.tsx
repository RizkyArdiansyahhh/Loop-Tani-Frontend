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
import { Loader2, Store, ArrowRight } from "lucide-react";

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
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Avatar Section */}
          <div className="flex flex-col items-center space-y-4 shrink-0">
            <AvatarUploader 
              currentAvatar={profile.image} 
              name={profile.name} 
            />
            {profile.sellerProfile && (
              <SellerStatusBadge status={profile.sellerProfile.status} />
            )}
          </div>

          {/* Form Section */}
          <div className="flex-1 w-full">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Field>
                <FieldLabel htmlFor="name">{t("nameLabel")}</FieldLabel>
                <Input id="name" placeholder="John Doe" {...form.register("name")} />
                <FieldError errors={[form.formState.errors.name as any]} />
              </Field>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field>
                  <FieldLabel htmlFor="email">{t("emailLabel")}</FieldLabel>
                  <Input id="email" value={profile.email} disabled />
                  <FieldDescription>{t("emailDescription")}</FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor="phone">{t("phoneLabel")}</FieldLabel>
                  <Input id="phone" placeholder="08123456789" {...form.register("phone")} />
                  <FieldError errors={[form.formState.errors.phone as any]} />
                </Field>
              </div>

              <div className="flex justify-end pt-4">
                <UIButton 
                  type="submit" 
                  disabled={updateProfile.isPending || !form.formState.isDirty}
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

        {/* Seller Registration CTA for Buyers */}
        {!profile.sellerProfile && (
          <div className="relative overflow-hidden mt-8 rounded-3xl border border-emerald-100/60 bg-linear-to-r from-emerald-50/50 to-teal-50/30 p-6 shadow-xs dark:border-emerald-950/30 dark:from-emerald-950/10 dark:to-teal-950/5 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            {/* Background glowing blobs */}
            <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-teal-400/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
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
              className="relative z-10 shrink-0 rounded-2xl bg-primary hover:bg-emerald-700 text-white font-bold text-xs px-6 py-5.5 shadow-sm transition-all hover:scale-102 duration-300"
            >
              <Link href="/seller/register" className="flex items-center gap-1.5">
                Daftar Jadi Seller <ArrowRight className="h-4 w-4" />
              </Link>
            </UIButton>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
