"use client";

import Footer from "@/components/shared/footer";
import Navbar from "@/components/shared/navbar";
import { InfoBar } from "@/components/shared/info-bar";
import { usePathname } from "next/navigation";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHome = pathname === "/" || pathname === "/id" || pathname === "/en";
  const excludedRoutes = ["/id/loopi", "/en/loopi", "id/loopi", "en/loopi"];

  return (
    <>
      <header className={isHome ? "absolute top-0 left-0 w-full z-50" : "relative z-50"}>
        <InfoBar />
        <Navbar />
      </header>
      <div>{children}</div>
      {!excludedRoutes.includes(pathname) && <Footer />}
    </>
  );
}
