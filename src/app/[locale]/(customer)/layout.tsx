"use client";
import Footer from "@/components/shared/footer";
import Navbar from "@/components/shared/navbar";
import LoopiFloating from "@/features/chatbot/components/loopi-floating";
import AccessibilityWidget from "@/components/shared/accessibility-widget";
import { usePathname } from "next/navigation";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isChatbotPage = pathname === "/id/loopi" || pathname === "/en/loopi";
  const excludedRoutes = ["id/loopi", "en/loopi"];

  return (
    <>
      <header>
        <Navbar></Navbar>
      </header>
      <div>{children}</div>
      {!excludedRoutes.includes(pathname) && <Footer></Footer>}
      {!isChatbotPage && <LoopiFloating />}
      <AccessibilityWidget />
    </>
  );
}
