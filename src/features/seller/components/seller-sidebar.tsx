"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  BarChart3, 
  Star, 
  Settings,
  ArrowLeft
} from "lucide-react";

export function SellerSidebar() {
  const t = useTranslations("seller.sidebar");
  const pathname = usePathname();
  
  // Clean pathname for matching (remove locale)
  const cleanPathname = pathname.replace(/^\/[a-z]{2}/, "");

  const menuItems = [
    {
      title: t("dashboard"),
      href: "/seller",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      title: t("products"),
      href: "/seller/products",
      icon: Package,
    },
    {
      title: t("orders"),
      href: "/seller/orders",
      icon: ShoppingCart,
    },
    {
      title: t("revenue"),
      href: "/seller/revenue",
      icon: DollarSign,
    },
    {
      title: t("analytics"),
      href: "/seller/analytics",
      icon: BarChart3,
    },
    {
      title: t("reviews"),
      href: "/seller/reviews",
      icon: Star,
    },
    {
      title: t("settings"),
      href: "/seller/settings",
      icon: Settings,
    },
  ];

  return (
    <aside className="w-64 flex-shrink-0 border-r bg-card min-h-[calc(100vh-4rem)] flex flex-col">
      <div className="p-4 border-b">
        <Link 
          href="/profile" 
          className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
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
    </aside>
  );
}
