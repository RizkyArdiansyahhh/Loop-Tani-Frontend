"use client";

import React, { useState, useRef, useEffect } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { authClient } from "@/lib/auth-client";
import { useSellerMe } from "../hooks/use-seller-me";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Menu,
  ExternalLink,
  Bell,
  User,
  Store,
  LogOut,
  ChevronDown,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SellerHeaderProps {
  onToggleMobileSidebar?: () => void;
}

export function SellerHeader({ onToggleMobileSidebar }: SellerHeaderProps) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const { data: sellerMe } = useSellerMe();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const storeSlug = sellerMe?.storeSlug;
  const storeName = sellerMe?.storeName || session?.user?.name || "Toko Tani";
  const userAvatar = sellerMe?.logoUrl || session?.user?.image || "";

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        },
      },
    });
  };

  return (
    <header className="sticky top-0 z-20 h-16 w-full border-b border-border/50 bg-background/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between transition-colors">
      {/* Left: Mobile trigger & Store Status Badge */}
      <div className="flex items-center gap-3">
        {onToggleMobileSidebar && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleMobileSidebar}
            className="lg:hidden text-muted-foreground hover:text-foreground cursor-pointer"
            aria-label="Toggle Navigation Sidebar"
          >
            <Menu className="w-5 h-5" />
          </Button>
        )}

        <div className="flex items-center gap-2">
          <Badge className="bg-primary/10 text-primary border-primary/20 font-bold text-xs flex items-center gap-1.5 px-3 py-1 rounded-full shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span className="hidden sm:inline">Official Seller Center</span>
          </Badge>

          {storeSlug && (
            <span className="hidden md:inline text-xs font-bold text-muted-foreground/80 border-l border-border pl-3">
              {storeName}
            </span>
          )}
        </div>
      </div>

      {/* Right: Quick Store Preview, Notifications & User Avatar Dropdown */}
      <div className="flex items-center gap-3">
        {/* Quick Link: Public Storefront */}
        {storeSlug && (
          <Button
            asChild
            variant="outline"
            size="sm"
            className="hidden sm:inline-flex rounded-xl text-xs font-bold gap-1.5 border-primary/30 text-primary hover:bg-primary/10 cursor-pointer shadow-2xs"
          >
            <Link href={`/store/${storeSlug}`} target="_blank">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Lihat Toko Publik</span>
            </Link>
          </Button>
        )}

        {/* Quick Notifications Button */}
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-foreground rounded-xl cursor-pointer"
          title="Notifikasi Seller"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary" />
        </Button>

        {/* Profile Avatar Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 p-1.5 rounded-full hover:bg-muted/60 transition-all cursor-pointer border border-transparent hover:border-border"
          >
            <Avatar size="sm" className="border border-primary/30 shadow-2xs">
              <AvatarImage src={userAvatar} alt={storeName} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                {storeName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <ChevronDown className={cn("w-3.5 h-3.5 text-muted-foreground transition-transform duration-200", isDropdownOpen && "rotate-180")} />
          </button>

          {/* Animated Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-border bg-popover text-popover-foreground shadow-xl p-2 space-y-1.5 z-50 animate-in fade-in-80 zoom-in-95">
              {/* Profile info header */}
              <div className="p-3 rounded-xl bg-muted/40 border border-border/40 space-y-1">
                <p className="text-xs font-extrabold text-foreground truncate">{storeName}</p>
                <p className="text-[11px] text-muted-foreground truncate">{session?.user?.email}</p>
                <Badge className="mt-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[9.5px] font-bold">
                  Verified Seller
                </Badge>
              </div>

              <div className="h-px bg-border/50 my-1" />

              {/* Dropdown Options */}
              <Link
                href="/seller/settings"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl text-foreground hover:bg-muted/80 transition-colors"
              >
                <Store className="w-4 h-4 text-primary" />
                <span>Pengaturan Toko</span>
              </Link>

              {storeSlug && (
                <Link
                  href={`/store/${storeSlug}`}
                  target="_blank"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl text-foreground hover:bg-muted/80 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-emerald-600" />
                  <span>Lihat Tampilan Toko</span>
                </Link>
              )}

              <Link
                href="/profile"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl text-foreground hover:bg-muted/80 transition-colors"
              >
                <User className="w-4 h-4 text-muted-foreground" />
                <span>Profil Akun (Buyer Mode)</span>
              </Link>

              <div className="h-px bg-border/50 my-1" />

              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-red-500" />
                <span>Keluar Akun</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
