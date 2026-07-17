"use client";

import { useProfile } from "@/features/profile/hooks/use-profile";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldAlert, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface AdminGateProps {
  children: React.ReactNode;
}

export function AdminGate({ children }: AdminGateProps) {
  const { data: session, isPending: isSessionLoading } = authClient.useSession();
  const { data: profile, isLoading: isProfileLoading } = useProfile();
  const router = useRouter();

  const isLoading = isSessionLoading || (!!session && isProfileLoading);
  const isAdmin = profile?.roles?.includes("ADMIN");

  console.log("AdminGate status:", {
    session,
    isSessionLoading,
    profile,
    isProfileLoading,
    isLoading,
    isAdmin,
  });

  useEffect(() => {
    // If not loading and not authenticated, redirect
    if (!isSessionLoading && !session) {
      console.log("AdminGate: No session found, redirecting to /");
      router.push("/");
    }
  }, [session, isSessionLoading, router]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse text-sm">Verifikasi otorisasi admin...</p>
      </div>
    );
  }

  if (!profile || !isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
        <Alert variant="destructive" className="max-w-md mb-6 border-red-200/50 bg-red-50/50 backdrop-blur-sm shadow-sm rounded-2xl p-6">
          <ShieldAlert className="h-6 w-6 text-red-600 mb-2" />
          <AlertTitle className="text-lg font-bold text-red-800">Akses Ditolak</AlertTitle>
          <AlertDescription className="text-red-700 mt-2">
            Halaman ini hanya dapat diakses oleh Administrator LoopTani.
          </AlertDescription>
        </Alert>
        <Button asChild variant="outline" className="rounded-2xl shadow-xs transition-all hover:scale-102">
          <Link href="/">Kembali ke Beranda</Link>
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}
