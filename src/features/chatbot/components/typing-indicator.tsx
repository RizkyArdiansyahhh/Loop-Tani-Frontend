import LoopiAvatar from "./loopi-avatar";

const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-3">
      <LoopiAvatar size="sm" showOnline={false} />
      <div className="flex items-center gap-2 rounded-2xl rounded-tl-md bg-muted/65 border border-border/40 px-4 py-3 shadow-2xs">
        <div className="flex gap-1 items-center">
          <span className="h-2 w-2 animate-bounce rounded-full bg-primary/80 [animation-delay:0ms]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-primary/80 [animation-delay:150ms]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-primary/80 [animation-delay:300ms]" />
        </div>
        <span className="text-xs font-medium text-muted-foreground ml-1">
          Loopi sedang mengetik...
        </span>
      </div>
    </div>
  );
};

export default TypingIndicator;
