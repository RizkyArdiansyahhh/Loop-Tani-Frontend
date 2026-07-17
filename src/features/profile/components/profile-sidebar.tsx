"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { User, MapPin, Package, Heart, Bell, Settings } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function ProfileSidebar() {
  const t = useTranslations("profile.sidebar");
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  
  // Create a clean pathname without locale prefix for matching
  const cleanPathname = pathname.replace(/^\/[a-z]{2}/, "");

  const menuGroups = [
    {
      label: "Biodata Saya",
      items: [
        {
          title: t("account"),
          href: "/profile",
          icon: User,
          exact: true,
        },
        {
          title: t("addresses"),
          href: "/profile/addresses",
          icon: MapPin,
        },
      ],
    },
    {
      label: "Transaksi & Minat",
      items: [
        {
          title: t("orders"),
          href: "/profile/orders",
          icon: Package,
        },
        {
          title: t("favorites"),
          href: "/profile/favorites",
          icon: Heart,
        },
      ],
    },
    {
      label: "Pengaturan Akun",
      items: [
        {
          title: t("notifications"),
          href: "/profile/notifications",
          icon: Bell,
        },
        {
          title: t("settings"),
          href: "/profile/settings",
          icon: Settings,
        },
      ],
    },
  ];

  return (
    <Card className="w-full ring-0 border border-gray-200 rounded-xl dark:border-gray-800 dark:bg-gray-900 shadow-3xs overflow-hidden">
      <CardContent className="p-5 space-y-5">
        
        {/* User Card Info */}
        {session?.user && (
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full overflow-hidden bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center font-bold text-emerald-700 dark:text-emerald-400 shrink-0 border border-gray-100/60 dark:border-gray-800/60">
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  className="h-full w-full object-cover"
                />
              ) : (
                session.user.name?.charAt(0) || "U"
              )}
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-sm font-bold text-gray-900 dark:text-white block truncate leading-snug">
                {session.user.name}
              </span>
              <span className="text-3xs text-muted-foreground block truncate">
                {session.user.email}
              </span>
            </div>
          </div>
        )}

        <Separator className="border-gray-100 dark:border-gray-800/80" />

        {/* Grouped Links */}
        <div className="space-y-4">
          {menuGroups.map((group) => (
            <div key={group.label} className="space-y-1.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block px-3">
                {group.label}
              </span>
              
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = item.exact
                    ? cleanPathname === item.href
                    : cleanPathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "relative flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer",
                        isActive
                          ? "bg-emerald-50/60 text-primary dark:bg-emerald-950/20 dark:text-emerald-400"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-850 dark:hover:text-white"
                      )}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-md" />
                      )}
                      <item.icon className={cn("h-4 w-4 shrink-0", isActive ? "text-primary" : "text-gray-450")} />
                      {item.title}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

      </CardContent>
    </Card>
  );
}
