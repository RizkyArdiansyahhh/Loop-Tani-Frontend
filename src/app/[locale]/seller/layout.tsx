"use client";

import React, { useState } from "react";
import { SellerSidebar } from "@/features/seller/components/seller-sidebar";
import { SellerHeader } from "@/features/seller/components/seller-header";
import { SellerStatusGate } from "@/features/seller/components/seller-status-gate";
import { Sheet, SheetContent, SheetTitle, SheetHeader } from "@/components/ui/sheet";

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-muted/20 font-poppins">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <SellerSidebar />
      </div>

      {/* Mobile Drawer Sidebar */}
      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent side="left" className="p-0 w-68 border-r-0" showCloseButton={false}>
          <SheetHeader className="sr-only">
            <SheetTitle>Seller Menu Navigation</SheetTitle>
          </SheetHeader>
          <SellerSidebar onNavigate={() => setMobileSidebarOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main Content Area with Top Header */}
      <div className="flex-1 flex flex-col min-w-0">
        <SellerHeader onToggleMobileSidebar={() => setMobileSidebarOpen(true)} />
        
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <SellerStatusGate>
            <div className="max-w-7xl mx-auto space-y-6">
              {children}
            </div>
          </SellerStatusGate>
        </main>
      </div>
    </div>
  );
}
