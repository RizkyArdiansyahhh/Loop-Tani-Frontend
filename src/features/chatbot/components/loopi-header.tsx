import { Plus } from "lucide-react";
import LoopiAvatar from "./loopi-avatar";
import { Button } from "@/components/ui/button";

interface LoopiHeaderProps {
  onNewChat?: () => void;
  isLoggedIn?: boolean;
}

const LoopiHeader = ({ onNewChat, isLoggedIn }: LoopiHeaderProps) => {
  return (
    <div className="flex items-center justify-between gap-6">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Loopi AI Assistant
          </h1>
          <span className="rounded-full bg-secondary/40 px-3 py-0.5 text-xs font-semibold text-primary">
            Beta
          </span>
        </div>
        <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
          Tanyakan apa saja seputar pertanian, limbah pertanian, marketplace,
          produk, dan ekonomi sirkular.
        </p>
      </div>

      <div className="flex items-center gap-3">
        {isLoggedIn && onNewChat && (
          <Button
            onClick={onNewChat}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 rounded-xl border-primary/20 text-primary hover:bg-primary/10"
          >
            <Plus className="h-4 w-4" />
            <span>Percakapan Baru</span>
          </Button>
        )}
        <div className="hidden sm:block">
          <LoopiAvatar size="lg" />
        </div>
      </div>
    </div>
  );
};

export default LoopiHeader;
