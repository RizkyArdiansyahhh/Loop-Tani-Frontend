"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { User, MapPin, Package, Heart, Bell, Settings } from "lucide-react";

export function ProfileSidebar() {
  const t = useTranslations("profile.sidebar");
  const pathname = usePathname();
  
  // Create a clean pathname without locale prefix for matching
  const cleanPathname = pathname.replace(/^\/[a-z]{2}/, "");

  const menuItems = [
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
  ];

  return (
    <nav className="flex flex-col gap-2 w-full">
      {menuItems.map((item) => {
        const isActive = item.exact
          ? cleanPathname === item.href
          : cleanPathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
              isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
