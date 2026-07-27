"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff, Loader2 } from "lucide-react";

// Password Change Validation Schema
const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Kata sandi saat ini wajib diisi"),
    newPassword: z
      .string()
      .min(8, "Kata sandi baru minimal 8 karakter")
      .regex(/[A-Za-z]/, "Harus mengandung huruf")
      .regex(/[0-9]/, "Harus mengandung angka"),
    confirmPassword: z.string().min(1, "Konfirmasi kata sandi wajib diisi"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Konfirmasi kata sandi tidak cocok",
    path: ["confirmPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

export function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Show/Hide password states
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Notification Preferences State (Persisted in localStorage)
  const [notifyOrderEmail, setNotifyOrderEmail] = useState(true);
  const [notifyOrderWA, setNotifyOrderWA] = useState(true);
  const [notifyPromo, setNotifyPromo] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedOrderEmail = localStorage.getItem("lt_notify_order_email");
    const savedOrderWA = localStorage.getItem("lt_notify_order_wa");
    const savedPromo = localStorage.getItem("lt_notify_promo");

    if (savedOrderEmail !== null) setNotifyOrderEmail(savedOrderEmail === "true");
    if (savedOrderWA !== null) setNotifyOrderWA(savedOrderWA === "true");
    if (savedPromo !== null) setNotifyPromo(savedPromo === "true");
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  const handleChangePassword = async (values: PasswordFormValues) => {
    setIsSubmitting(true);
    try {
      const result = await authClient.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        revokeOtherSessions: true,
      });

      if (result.error) {
        toast.error(result.error.message || "Gagal mengubah kata sandi. Periksa kata sandi lama Anda.");
      } else {
        toast.success("Kata sandi berhasil diperbarui!");
        reset();
      }
    } catch (err: any) {
      toast.error(err?.message || "Terjadi kesalahan saat mengubah kata sandi");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleNotification = (
    key: string,
    value: boolean,
    setter: (val: boolean) => void,
    label: string,
  ) => {
    setter(value);
    localStorage.setItem(key, String(value));
    toast.success(`Preferensi ${label} ${value ? "diaktifkan" : "dinonaktifkan"}`);
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6 font-sans pb-12 max-w-3xl">
      {/* Title Header */}
      <div className="border-b border-border/50 pb-3">
        <h1 className="text-lg font-bold font-poppins text-foreground tracking-tight">
          Pengaturan Akun
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Kelola preferensi tema tampilan, keamanan kata sandi, dan notifikasi.
        </p>
      </div>

      {/* ─── 1. TEMA TAMPILAN (DROPDOWN) ─── */}
      <Card className="border border-border/60 rounded-xl bg-card shadow-3xs overflow-hidden">
        <CardHeader className="p-4 border-b border-border/40 bg-muted/10">
          <CardTitle className="text-xs font-bold text-foreground font-poppins">
            Tema Tampilan
          </CardTitle>
          <CardDescription className="text-[11px] text-muted-foreground">
            Pilih skema warna antarmuka website
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4">
          <div className="max-w-xs">
            <Select value={theme} onValueChange={(val) => setTheme(val)}>
              <SelectTrigger className="w-full h-9 text-xs rounded-lg">
                <SelectValue placeholder="Pilih Tema" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Terang (Light Mode)</SelectItem>
                <SelectItem value="dark">Gelap (Dark Mode)</SelectItem>
                <SelectItem value="system">Otomatis (Ikuti Sistem)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* ─── 2. KEAMANAN & UBAH KATA SANDI ─── */}
      <Card className="border border-border/60 rounded-xl bg-card shadow-3xs overflow-hidden">
        <CardHeader className="p-4 border-b border-border/40 bg-muted/10">
          <CardTitle className="text-xs font-bold text-foreground font-poppins">
            Keamanan & Kata Sandi
          </CardTitle>
          <CardDescription className="text-[11px] text-muted-foreground">
            Perbarui kata sandi akun Anda
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4">
          <form onSubmit={handleSubmit(handleChangePassword)} className="space-y-3.5 max-w-md">
            <div className="space-y-1">
              <Label className="text-xs font-medium text-foreground">
                Kata Sandi Saat Ini
              </Label>
              <div className="relative">
                <Input
                  type={showCurrent ? "text" : "password"}
                  placeholder="Masukkan kata sandi lama"
                  {...register("currentPassword")}
                  className="pr-9 text-xs rounded-lg h-9"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent((prev) => !prev)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showCurrent ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="text-[11px] text-red-500 font-medium">
                  {errors.currentPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-foreground">
                Kata Sandi Baru
              </Label>
              <div className="relative">
                <Input
                  type={showNew ? "text" : "password"}
                  placeholder="Minimal 8 karakter (huruf & angka)"
                  {...register("newPassword")}
                  className="pr-9 text-xs rounded-lg h-9"
                />
                <button
                  type="button"
                  onClick={() => setShowNew((prev) => !prev)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showNew ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-[11px] text-red-500 font-medium">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-foreground">
                Konfirmasi Kata Sandi Baru
              </Label>
              <div className="relative">
                <Input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Ulangi kata sandi baru"
                  {...register("confirmPassword")}
                  className="pr-9 text-xs rounded-lg h-9"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((prev) => !prev)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirm ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-[11px] text-red-500 font-medium">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="pt-1">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold rounded-lg h-9 px-4 cursor-pointer"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Memperbarui...
                  </span>
                ) : (
                  "Simpan Kata Sandi"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* ─── 3. PREFERENSI NOTIFIKASI ─── */}
      <Card className="border border-border/60 rounded-xl bg-card shadow-3xs overflow-hidden">
        <CardHeader className="p-4 border-b border-border/40 bg-muted/10">
          <CardTitle className="text-xs font-bold text-foreground font-poppins">
            Preferensi Notifikasi
          </CardTitle>
          <CardDescription className="text-[11px] text-muted-foreground">
            Kelola notifikasi transaksi dan informasi promo
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4 divide-y divide-border/30">
          <div className="flex items-center justify-between py-2.5 first:pt-0">
            <div>
              <div className="text-xs font-medium text-foreground">
                Email Transaksi & Invoice
              </div>
              <div className="text-[11px] text-muted-foreground">
                Kirim invoice dan status pesanan ke email
              </div>
            </div>
            <Switch
              checked={notifyOrderEmail}
              onCheckedChange={(val) =>
                handleToggleNotification("lt_notify_order_email", val, setNotifyOrderEmail, "Email Transaksi")
              }
            />
          </div>

          <div className="flex items-center justify-between py-2.5">
            <div>
              <div className="text-xs font-medium text-foreground">
                WhatsApp Status Pesanan
              </div>
              <div className="text-[11px] text-muted-foreground">
                Pengingat bayar dan update pengiriman di WhatsApp
              </div>
            </div>
            <Switch
              checked={notifyOrderWA}
              onCheckedChange={(val) =>
                handleToggleNotification("lt_notify_order_wa", val, setNotifyOrderWA, "WhatsApp Pesanan")
              }
            />
          </div>

          <div className="flex items-center justify-between py-2.5 last:pb-0">
            <div>
              <div className="text-xs font-medium text-foreground">
                Promo & Panen Musiman
              </div>
              <div className="text-[11px] text-muted-foreground">
                Info voucer diskon dan penawaran komoditas baru
              </div>
            </div>
            <Switch
              checked={notifyPromo}
              onCheckedChange={(val) =>
                handleToggleNotification("lt_notify_promo", val, setNotifyPromo, "Promo & Panen")
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
