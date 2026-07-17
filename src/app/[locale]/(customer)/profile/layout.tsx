import { ProfileSidebar } from "@/features/profile/components/profile-sidebar";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50/40 dark:bg-gray-950/40 transition-colors duration-300 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <aside className="w-full lg:w-72 shrink-0 lg:sticky lg:top-24">
            <ProfileSidebar />
          </aside>
          <main className="flex-1 min-w-0 w-full">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
