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
  ArrowLeft,
  Store,
  CheckCircle2
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

export function SellerSidebar() {
  const t = useTranslations("seller.sidebar");
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  
  // Clean pathname for matching (remove locale)
  const cleanPathname = pathname.replace(/^\/[a-z]{2}/, "");

  const menuItems = [
    {
      title: t("dashboard") || "Dashboard",
      href: "/seller",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      title: t("products") || "Produk",
      href: "/seller/products",
      icon: Package,
    },
    {
      title: t("orders") || "Pesanan",
      href: "/seller/orders",
      icon: ShoppingCart,
    },
    {
      title: t("revenue") || "Keuangan",
      href: "/seller/revenue",
      icon: DollarSign,
    },
    {
      title: t("analytics") || "Analitik",
      href: "/seller/analytics",
      icon: BarChart3,
    },
    {
      title: t("reviews") || "Ulasan",
      href: "/seller/reviews",
      icon: Star,
    },
    {
      title: t("settings") || "Pengaturan",
      href: "/seller/settings",
      icon: Settings,
    },
  ];

  return (
    <aside className="w-66 flex-shrink-0 border-r border-emerald-100/50 dark:border-slate-800 bg-white dark:bg-slate-950 min-h-[calc(100vh-4rem)] flex flex-col justify-between transition-colors duration-300">
      {/* Top Section */}
      <div className="flex flex-col flex-1">
        {/* Back navigation */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800/60">
          <Link 
            href="/profile" 
            className="flex items-center text-xs font-semibold text-slate-500 hover:text-primary transition-colors group"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-2 transition-transform group-hover:-translate-x-1" />
            {t("backToProfile") || "Kembali ke Profil"}
          </Link>
        </div>

        {/* Store Brand / Identifier */}
        <div className="p-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-primary border border-primary/20 shadow-2xs">
            <Store className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Mitra LoopTani
            </h3>
            <h2 className="text-sm font-black text-slate-800 dark:text-white leading-tight truncate max-w-[150px]">
              {session?.user?.name || "Toko Tani"}
            </h2>
          </div>
        </div>

        {/* Menu Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = item.exact
              ? cleanPathname === item.href
              : cleanPathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all duration-200 group cursor-pointer",
                  isActive
                    ? "bg-primary text-white shadow-md shadow-emerald-500/20"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-900/60 dark:hover:text-white"
                )}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/4 bottom-1/4 w-1 rounded-r-md bg-white" />
                )}
                <item.icon className={cn(
                  "h-4.5 w-4.5 shrink-0 transition-transform group-hover:scale-105",
                  isActive ? "text-white" : "text-slate-400 group-hover:text-primary"
                )} />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile Box */}
      {session?.user && (
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/60 bg-emerald-50/10 dark:bg-slate-900/10">
          <div className="flex items-center gap-3 rounded-xl border border-emerald-100/40 bg-white/60 dark:bg-slate-900/60 dark:border-slate-800 p-2.5 backdrop-blur-xs">
            <img 
              src={session.user.image || "/images/mascot-farmer.png"} 
              alt={session.user.name} 
              className="h-9 w-9 rounded-full object-cover border border-emerald-500/30"
            />
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold text-slate-800 dark:text-white truncate">
                {session.user.name}
              </p>
              <div className="flex items-center gap-1 text-[9px] font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                <CheckCircle2 className="h-3 w-3" />
                <span>Verified Seller</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
