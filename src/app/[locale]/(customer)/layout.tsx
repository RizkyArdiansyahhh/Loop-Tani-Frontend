"use client";

import Footer from "@/components/shared/footer";
import Navbar from "@/components/shared/navbar";
import { InfoBar } from "@/components/shared/info-bar";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHome = pathname === "/" || pathname === "/id" || pathname === "/en";
  const isChat = Boolean(pathname && (pathname === "/loopi" || pathname.endsWith("/loopi")));
  const isAbout = Boolean(
    pathname &&
      (pathname === "/about" ||
        pathname.endsWith("/about") ||
        pathname.includes("/about"))
  );

  const isFullScreen = isChat || isAbout;

  return (
    <div
      className={cn(
        "min-h-screen bg-background",
        isFullScreen && "h-dvh overflow-hidden flex flex-col"
      )}
    >
      <header
        className={
          isHome
            ? "absolute top-0 left-0 w-full z-50"
            : "relative z-50 shrink-0"
        }
      >
        {!isFullScreen && <InfoBar />}
        <Navbar />
      </header>
      <div
        className={cn(
          isFullScreen ? "flex-1 min-h-0 overflow-hidden flex flex-col" : ""
        )}
      >
        {children}
      </div>
      {!isFullScreen && <Footer />}
    </div>
  );
}
