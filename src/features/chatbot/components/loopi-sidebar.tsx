import { Wheat, Tractor, Recycle, BookOpen, Lightbulb } from "lucide-react";
import ConversationItem from "./conversation-item";
import SidebarCard from "./sidebar-card";

const LoopiSidebar = () => {
  return (
    <aside className="hidden w-72 shrink-0 flex-col gap-4 overflow-y-auto lg:flex">
      {/* Today */}
      <SidebarCard title="Hari Ini">
        <div className="space-y-1">
          <ConversationItem
            icon={Wheat}
            title="Harga Jerami"
            time="10:30"
            active
          />
          <ConversationItem icon={Tractor} title="Cari Traktor" time="09:15" />
        </div>
      </SidebarCard>

      {/* Yesterday */}
      <SidebarCard title="Kemarin">
        <div className="space-y-1">
          <ConversationItem icon={Recycle} title="Biochar" time="16:45" />
          <ConversationItem icon={BookOpen} title="Kompos" time="11:20" />
        </div>
      </SidebarCard>

      {/* Last Week */}
      <SidebarCard title="Minggu Lalu">
        <div className="space-y-1">
          <ConversationItem icon={Wheat} title="Harga Sekam Padi" time="Sen" />
          <ConversationItem
            icon={Tractor}
            title="Rekomendasi Cultivator"
            time="Min"
          />
          <ConversationItem icon={Recycle} title="Tips Daur Ulang" time="Sab" />
        </div>
      </SidebarCard>

      {/* Tips */}
      <div className="rounded-2xl border border-accent/30 bg-accent/10 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/20">
            <Lightbulb className="h-4 w-4 text-accent-foreground" />
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground">Tips</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Loopi dapat membantu mencari produk marketplace, membandingkan
              harga, dan memberikan rekomendasi pertanian.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default LoopiSidebar;
