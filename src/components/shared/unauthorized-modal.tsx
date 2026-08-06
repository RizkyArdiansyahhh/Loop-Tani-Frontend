"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Lock, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UNAUTHORIZED_EVENT } from "@/lib/axios";

export function UnauthorizedModal() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleUnauthorized = () => {
      // Don't pop modal if user is already on auth pages
      if (pathname?.includes("/login") || pathname?.includes("/register")) {
        return;
      }
      setOpen(true);
    };

    window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
    return () => {
      window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
    };
  }, [pathname]);

  const handleLoginRedirect = () => {
    setOpen(false);
    const redirectUrl = pathname ? `/login?redirect=${encodeURIComponent(pathname)}` : "/login";
    router.push(redirectUrl);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md rounded-2xl border border-stone-200 dark:border-stone-800 bg-background p-6 shadow-2xl">
        <DialogHeader className="space-y-3 text-center sm:text-left">
          {/* Icon Badge */}
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 flex items-center justify-center border border-amber-500/20 shadow-xs mx-auto sm:mx-0">
            <Lock className="w-5 h-5" />
          </div>

          <DialogTitle className="text-xl font-bold font-sans text-foreground tracking-tight">
            Sesi Berakhir / Login Diperlukan
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Anda perlu masuk ke akun LoopTani terlebih dahulu untuk melanjutkan tindakan ini atau mengakses fitur ini.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="pt-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            className="rounded-full px-5 text-xs font-semibold"
          >
            Nanti Saja
          </Button>
          <Button
            type="button"
            onClick={handleLoginRedirect}
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6 text-xs font-semibold shadow-md flex items-center gap-2"
          >
            <span>Masuk Sekarang</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
