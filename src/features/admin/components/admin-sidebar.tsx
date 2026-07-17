"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  FolderTree,
  BookOpen,
  Gift,
  Coins,
  BellRing,
  Settings,
  ArrowLeft,
} from "lucide-react";

export function AdminSidebar() {
  const t = useTranslations("admin.sidebar");
  const pathname = usePathname();

  // Clean pathname for matching (remove locale)
  const cleanPathname = pathname.replace(/^\/[a-z]{2}/, "");

  const menuItems = [
    {
      title: t("dashboard"),
      href: "/admin",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      title: t("users"),
      href: "/admin/users",
      icon: Users,
    },
    {
      title: t("sellers"),
      href: "/admin/sellers",
      icon: ShieldCheck,
    },
    {
      title: t("categories"),
      href: "/admin/categories",
      icon: FolderTree,
    },
    {
      title: t("knowledge"),
      href: "/admin/knowledge",
      icon: BookOpen,
    },
    {
      title: t("rewards"),
      href: "/admin/rewards",
      icon: Gift,
    },
    {
      title: t("pointTransactions"),
      href: "/admin/point-transactions",
      icon: Coins,
    },
    {
      title: t("notifications"),
      href: "/admin/notifications",
      icon: BellRing,
    },
    {
      title: t("settings"),
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  return (
    <aside className="w-64 shrink-0 border-r bg-card min-h-[calc(100vh-4rem)] flex flex-col shadow-xs">
      <div className="p-4 border-b">
        <Link
          href="/profile"
          className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("backToProfile")}
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = item.exact
            ? cleanPathname === item.href
            : cleanPathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
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
    </aside>
  );
}
