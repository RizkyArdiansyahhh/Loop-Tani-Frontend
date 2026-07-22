import { MessageCircle, Plus, Lightbulb } from "lucide-react";
import ConversationItem from "./conversation-item";
import SidebarCard from "./sidebar-card";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useConversations } from "../hooks/use-conversations";
import { useDeleteConversation } from "../hooks/use-delete-conversation";

interface LoopiSidebarProps {
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
}

const LoopiSidebar = ({
  activeConversationId,
  onSelectConversation,
  onNewChat,
}: LoopiSidebarProps) => {
  const { data: session } = authClient.useSession();
  const isLoggedIn = !!session;

  const { data: conversations, isLoading } = useConversations();
  const deleteMutation = useDeleteConversation();

  return (
    <aside className="hidden w-72 shrink-0 flex-col gap-4 overflow-y-auto lg:flex">
      {isLoggedIn ? (
        <>
          <Button
            onClick={onNewChat}
            variant="default"
            className="w-full justify-start gap-2 rounded-2xl py-5 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Obrolan Baru</span>
          </Button>

          <SidebarCard title="Riwayat Obrolan">
            {isLoading ? (
              <p className="px-3 py-2 text-xs text-muted-foreground animate-pulse">
                Memuat riwayat...
              </p>
            ) : conversations && conversations.length > 0 ? (
              <div className="space-y-1 max-h-[calc(100vh-22rem)] overflow-y-auto pr-1">
                {conversations.map((c) => {
                  const formattedTime = new Date(c.updatedAt).toLocaleTimeString(
                    [],
                    { hour: "2-digit", minute: "2-digit" }
                  );
                  return (
                    <ConversationItem
                      key={c.id}
                      icon={MessageCircle}
                      title={c.title || "Percakapan Baru"}
                      time={formattedTime}
                      active={activeConversationId === c.id}
                      onClick={() => onSelectConversation(c.id)}
                      onDelete={() => deleteMutation.mutate(c.id)}
                    />
                  );
                })}
              </div>
            ) : (
              <p className="px-3 py-2 text-xs text-muted-foreground">
                Belum ada riwayat percakapan.
              </p>
            )}
          </SidebarCard>
        </>
      ) : (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 space-y-2">
          <p className="text-xs font-semibold text-foreground">
            Simpan Riwayat Chat
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Masuk dengan akun LoopTani untuk menyimpan percakapan dan mengaksesnya kembali kapan saja.
          </p>
        </div>
      )}

      {/* Tips Card */}
      <div className="rounded-2xl border border-accent/30 bg-accent/10 p-4 mt-auto">
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
