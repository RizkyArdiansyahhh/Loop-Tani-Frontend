import type { LucideIcon } from "lucide-react";
import { Trash2 } from "lucide-react";

interface ConversationItemProps {
  icon: LucideIcon;
  title: string;
  time?: string;
  active?: boolean;
  onClick?: () => void;
  onDelete?: () => void;
}

const ConversationItem = ({
  icon: Icon,
  title,
  time,
  active,
  onClick,
  onDelete,
}: ConversationItemProps) => {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick?.();
        }
      }}
      className={`group flex w-full cursor-pointer items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left transition-all duration-200 ${
        active ? "bg-primary/10 text-primary font-medium" : "text-foreground hover:bg-muted"
      }`}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Icon className="h-4 w-4 shrink-0 text-primary/80" />
        <span className="truncate text-sm font-medium">{title}</span>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        {time && (
          <span className="text-[11px] text-muted-foreground group-hover:hidden">{time}</span>
        )}
        {onDelete && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            title="Hapus Percakapan"
            className="hidden p-1 text-muted-foreground hover:text-destructive group-hover:block transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ConversationItem;
