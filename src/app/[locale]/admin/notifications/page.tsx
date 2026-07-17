"use client";

import { useState } from "react";
import { useAdminNotifications, useCreateNotification } from "@/features/admin/hooks/use-admin";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, BellRing } from "lucide-react";
import { toast } from "sonner";

export default function NotificationBroadcastPage() {
  const t = useTranslations("admin.notifications");
  const [modalOpen, setModalOpen] = useState(false);

  const { data: notifications, isLoading } = useAdminNotifications();
  const broadcastMutation = useCreateNotification();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      content: "",
      isGlobal: true,
    },
  });

  const handleOpenCreate = () => {
    reset({
      title: "",
      content: "",
      isGlobal: true,
    });
    setModalOpen(true);
  };

  const onSubmit = (data: any) => {
    broadcastMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Notifikasi berhasil disiarkan ke seluruh platform!");
        setModalOpen(false);
      },
      onError: () => {
        toast.error("Gagal menyiarkan notifikasi");
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{t("title")}</h1>
          <p className="text-muted-foreground mt-1">{t("subtitle")}</p>
        </div>
        <Button onClick={handleOpenCreate} className="rounded-xl inline-flex items-center gap-1.5 self-start md:self-auto">
          <Plus className="w-4 h-4" />
          {t("sendNotification")}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : !notifications || notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-card border rounded-2xl">
          <div className="bg-muted p-4 rounded-full mb-4">
            <BellRing className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-foreground">Belum ada siaran notifikasi platform.</h3>
        </div>
      ) : (
        <div className="bg-card border rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/40 border-b text-muted-foreground text-xs uppercase font-semibold">
                  <th className="p-4">{t("table.title")}</th>
                  <th className="p-4">{t("table.content")}</th>
                  <th className="p-4">{t("table.date")}</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                {notifications.map((notif) => (
                  <tr key={notif.id} className="hover:bg-muted/10 transition-colors">
                    <td className="p-4 font-semibold text-foreground max-w-xs truncate">{notif.title}</td>
                    <td className="p-4 text-muted-foreground text-xs max-w-md truncate">
                      {notif.content}
                    </td>
                    <td className="p-4 text-muted-foreground text-xs font-mono">
                      {new Date(notif.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Broadcast Modal using HTML5 dialog tag */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-card border rounded-2xl w-full max-w-md shadow-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="p-6 border-b">
                <h3 className="text-lg font-bold text-foreground">{t("sendNotification")}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Kirim pesan notifikasi penting ke seluruh pengguna platform LoopTani.
                </p>
              </div>

              <div className="p-6 space-y-4">
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">{t("form.title")}</label>
                  <input
                    type="text"
                    {...register("title", { required: "Judul notifikasi wajib diisi" })}
                    className="w-full rounded-xl border bg-card p-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                    placeholder="Contoh: Pemeliharaan Server LoopTani"
                  />
                  {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
                </div>

                {/* Content */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">{t("form.content")}</label>
                  <textarea
                    rows={5}
                    {...register("content", { required: "Pesan notifikasi wajib diisi" })}
                    className="w-full rounded-xl border bg-card p-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                    placeholder="Tulis pesan siaran lengkap di sini..."
                  />
                  {errors.content && <p className="text-xs text-red-500">{errors.content.message}</p>}
                </div>
              </div>

              <div className="flex justify-end gap-3 p-6 border-t bg-muted/10">
                <Button type="button" variant="outline" onClick={() => setModalOpen(false)} className="rounded-xl">
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={broadcastMutation.isPending}
                  className="rounded-xl bg-primary text-primary-foreground"
                >
                  {broadcastMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t("form.submit")}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
