import { SellerSidebar } from "@/features/seller/components/seller-sidebar";
import { SellerStatusGate } from "@/features/seller/components/seller-status-gate";

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-muted/20">
      <SellerSidebar />
      <main className="flex-1 min-w-0 p-8 overflow-y-auto">
        <SellerStatusGate>
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </SellerStatusGate>
      </main>
    </div>
  );
}
