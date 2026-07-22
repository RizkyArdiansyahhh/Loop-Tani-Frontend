import { AdminSidebar } from "@/features/admin/components/admin-sidebar";
import { AdminGate } from "@/features/admin/components/admin-gate";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-muted/20">
      <AdminSidebar />
      <main className="flex-1 min-w-0 p-8 overflow-y-auto">
        <AdminGate>
          <div className="max-w-6xl mx-auto space-y-6">
            {children}
          </div>
        </AdminGate>
      </main>
    </div>
  );
}
