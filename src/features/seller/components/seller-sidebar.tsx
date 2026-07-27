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
  CheckCircle2,
  Sprout,
  ShieldCheck
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useSellerMe } from "../hooks/use-seller-me";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface SellerSidebarProps {
  className?: string;
  onNavigate?: () => void;
}

export function SellerSidebar({ className, onNavigate }: SellerSidebarProps) {
  const t = useTranslations("seller.sidebar");
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const { data: sellerMe } = useSellerMe();
  
  // Clean pathname for matching (remove locale prefix)
  const cleanPathname = pathname.replace(/^\/[a-z]{2}/, "");

  const storeName = sellerMe?.storeName || session?.user?.name || "Toko Tani";
  const userAvatar = sellerMe?.logoUrl || session?.user?.image || "";

  const menuGroups = [
    {
      group: "UTAMA",
      items: [
        {
          title: t("dashboard") || "Dashboard",
          href: "/seller",
          icon: LayoutDashboard,
          exact: true,
        },
        {
          title: t("products") || "Katalog Produk",
          href: "/seller/products",
          icon: Package,
        },
        {
          title: t("orders") || "Pesanan Toko",
          href: "/seller/orders",
          icon: ShoppingCart,
        },
      ],
    },
    {
      group: "PERFORMA",
      items: [
        {
          title: t("revenue") || "Pendapatan & Keuangan",
          href: "/seller/revenue",
          icon: DollarSign,
        },
        {
          title: t("analytics") || "Analitik Bisnis",
          href: "/seller/analytics",
          icon: BarChart3,
        },
        {
          title: t("reviews") || "Ulasan Pembeli",
          href: "/seller/reviews",
          icon: Star,
        },
      ],
    },
    {
      group: "PENGATURAN",
      items: [
        {
          title: t("settings") || "Pengaturan Toko",
          href: "/seller/settings",
          icon: Settings,
        },
      ],
    },
  ];

  return (
    <aside className={cn(
      "w-68 shrink-0 border-r border-border/60 bg-card h-screen sticky top-0 flex flex-col justify-between transition-all duration-300 z-30",
      className
    )}>
      {/* Top Brand & Menu Section */}
      <div className="flex flex-col flex-1 overflow-y-auto custom-scrollbar">
        {/* Brand Header */}
        <div className="p-5 border-b border-border/50 bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md shadow-primary/20 shrink-0">
              <Sprout className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-primary">
                  Loop Tani
                </span>
                <Badge className="bg-primary/10 text-primary border-0 text-[9px] font-bold px-1.5 py-0.1">
                  Seller
                </Badge>
              </div>
              <h2 className="text-sm font-extrabold text-foreground truncate font-poppins pt-0.5">
                {storeName}
              </h2>
            </div>
          </div>
        </div>

        {/* Menu Navigation Grouped */}
        <nav className="flex-1 px-3 py-5 space-y-6">
          {menuGroups.map((group) => (
            <div key={group.group} className="space-y-1.5">
              <p className="px-3 text-[10px] font-extrabold text-muted-foreground/70 uppercase tracking-widest">
                {group.group}
              </p>
              {group.items.map((item) => {
                const isActive = item.exact
                  ? cleanPathname === item.href
                  : cleanPathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all duration-200 group cursor-pointer",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                        : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                    )}
                  >
                    <item.icon className={cn(
                      "h-4.5 w-4.5 shrink-0 transition-transform group-hover:scale-110",
                      isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary"
                    )} />
                    <span>{item.title}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Footer Profile Box & Back to Customer Mode */}
      <div className="p-4 border-t border-border/50 bg-muted/20 space-y-3">
        {session?.user && (
          <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-3 shadow-2xs">
            <Avatar size="sm" className="border border-primary/30">
              <AvatarImage src={userAvatar} alt={storeName} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                {storeName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-extrabold text-foreground truncate">
                {session.user.name}
              </p>
              <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-3 w-3 shrink-0" />
                <span className="truncate">Mitra Verified</span>
              </div>
            </div>
          </div>
        )}

        <Link 
          href="/profile" 
          onClick={onNavigate}
          className="flex items-center justify-center gap-2 rounded-xl py-2 px-3 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors group cursor-pointer border border-border/40"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
          <span>Kembali ke Mode Pembeli</span>
        </Link>
      </div>
    </aside>
  );
}
