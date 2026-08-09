"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { 
  LayoutGrid, 
  Package, 
  Receipt, 
  Wallet, 
  TrendingUp, 
  MessageSquare, 
  Settings2,
  ArrowLeft,
  ShieldCheck,
  Leaf
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
          icon: LayoutGrid,
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
          icon: Receipt,
        },
      ],
    },
    {
      group: "PERFORMA",
      items: [
        {
          title: t("revenue") || "Pendapatan & Saldo",
          href: "/seller/revenue",
          icon: Wallet,
        },
        {
          title: t("analytics") || "Analitik Bisnis",
          href: "/seller/analytics",
          icon: TrendingUp,
        },
        {
          title: t("reviews") || "Ulasan Pembeli",
          href: "/seller/reviews",
          icon: MessageSquare,
        },
      ],
    },
    {
      group: "PENGATURAN",
      items: [
        {
          title: t("settings") || "Pengaturan Toko",
          href: "/seller/settings",
          icon: Settings2,
        },
      ],
    },
  ];

  return (
    <aside className={cn(
      "w-60 shrink-0 border-r border-border/60 bg-card h-screen sticky top-0 flex flex-col justify-between transition-all duration-300 z-30 font-sans select-none",
      className
    )}>
      {/* Top Brand & Menu Section */}
      <div className="flex flex-col flex-1 overflow-y-auto scrollbar-none">
        {/* Slim Brand Header */}
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs shrink-0">
              <Leaf className="h-4.5 w-4.5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary font-poppins">
                  LoopTani
                </span>
                <Badge className="bg-primary/10 text-primary border-0 text-[9px] font-bold px-1.5 py-0">
                  Seller
                </Badge>
              </div>
              <h2 className="text-xs font-bold text-foreground truncate font-poppins pt-0.5">
                {storeName}
              </h2>
            </div>
          </div>
        </div>

        {/* Menu Navigation Grouped */}
        <nav className="flex-1 px-3 py-4 space-y-5">
          {menuGroups.map((group) => (
            <div key={group.group} className="space-y-1">
              <p className="px-3 text-[10px] font-bold text-muted-foreground/70 tracking-wider">
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
                      "flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-200 group cursor-pointer",
                      isActive
                        ? "bg-primary text-primary-foreground font-bold shadow-xs"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                    )}
                  >
                    <item.icon className={cn(
                      "h-4 w-4 shrink-0 transition-transform group-hover:scale-105",
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
      <div className="p-3.5 border-t border-border/50 space-y-2.5">
        {session?.user && (
          <div className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-muted/20 p-2.5">
            <Avatar size="sm" className="h-7 w-7 border border-primary/30">
              <AvatarImage src={userAvatar} alt={storeName} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-[10px]">
                {storeName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-foreground truncate">
                {session.user.name}
              </p>
              <div className="flex items-center gap-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="h-3 w-3 shrink-0" />
                <span className="truncate">Mitra Verified</span>
              </div>
            </div>
          </div>
        )}

        <Link 
          href="/profile" 
          onClick={onNavigate}
          className="flex items-center justify-center gap-2 rounded-xl py-1.5 px-3 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors group cursor-pointer border border-border/40 font-poppins"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
          <span>Mode Pembeli</span>
        </Link>
      </div>
    </aside>
  );
}
