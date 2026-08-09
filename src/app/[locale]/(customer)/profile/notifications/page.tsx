"use client";

import { useNotifications } from "@/features/profile/hooks/use-notifications";
import { Loader2, Bell, AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";

export default function UserNotificationsPage() {
  const t = useTranslations("profile.notifications");
  const { data: notifications, isLoading, error } = useNotifications();

  return (
    <div className="space-y-6 font-sans">
      {/* ── HEADER HALAMAN MINIMALIS ── */}
      <div className="border-b border-border/40 pb-4 font-poppins">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          {t("title")}
        </h1>
        <p className="text-xs text-muted-foreground pt-0.5">
          {t("description")}
        </p>
      </div>

      {/* ── CONTENT STATES ── */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="flex items-center gap-2 p-5 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-2xl border border-rose-500/20 text-xs font-poppins font-bold">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{t("error")}</span>
        </div>
      ) : !notifications || notifications.length === 0 ? (
        <div className="bg-card border border-border/60 rounded-2xl p-10 text-center space-y-2 font-poppins">
          <h3 className="text-sm font-bold text-foreground">{t("emptyTitle")}</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            {t("emptyDesc")}
          </p>
        </div>
      ) : (
        <div className="space-y-3 font-poppins">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className="bg-card border border-border/70 rounded-2xl p-4.5 space-y-2 shadow-xs hover:border-primary/40 transition-all"
            >
              <div className="space-y-1">
                <h3 className="font-bold text-foreground text-xs">{notif.title}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">{notif.content}</p>
              </div>
              <div className="text-[10px] text-muted-foreground font-mono pt-2 border-t border-border/40">
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
