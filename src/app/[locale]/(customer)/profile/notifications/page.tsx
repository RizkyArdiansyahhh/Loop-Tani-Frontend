"use client";

import { useNotifications } from "@/features/profile/hooks/use-notifications";
import { Loader2, Bell, ShieldAlert } from "lucide-react";
import { useTranslations } from "next-intl";

export default function UserNotificationsPage() {
  const { data: notifications, isLoading, error } = useNotifications();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Notifikasi</h1>
        <p className="text-muted-foreground mt-1">Pemberitahuan terbaru dari platform LoopTani.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="flex items-center gap-2 p-6 bg-red-50 text-red-800 rounded-2xl border border-red-200">
          <ShieldAlert className="w-6 h-6 text-red-600" />
          <span>Gagal memuat pemberitahuan. Silakan coba sesaat lagi.</span>
        </div>
      ) : !notifications || notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-card border border-dashed rounded-2xl">
          <div className="bg-muted p-4 rounded-full mb-4">
            <Bell className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-foreground">Belum ada notifikasi</h3>
          <p className="text-muted-foreground text-sm mt-1">Kami akan memberi tahu Anda jika ada pengumuman baru.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className="bg-card border rounded-2xl p-5 shadow-xs transition-all hover:shadow-md hover:scale-[1.005] duration-200"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-foreground text-base">{notif.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{notif.content}</p>
                </div>
              </div>
              <div className="text-[10px] text-muted-foreground font-mono mt-4 pt-3 border-t">
                {new Date(notif.createdAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
