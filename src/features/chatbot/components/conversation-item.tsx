import type { LucideIcon } from "lucide-react";

interface ConversationItemProps {
  icon: LucideIcon;
  title: string;
  time?: string;
  active?: boolean;
}

const ConversationItem = ({
  icon: Icon,
  title,
  time,
  active,
}: ConversationItemProps) => {
  return (
    <button
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-200 ${
        active ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
      }`}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="flex-1 truncate text-sm font-medium">{title}</span>
      {time && (
        <span className="text-[11px] text-muted-foreground">{time}</span>
      )}
    </button>
  );
};

export default ConversationItem;
