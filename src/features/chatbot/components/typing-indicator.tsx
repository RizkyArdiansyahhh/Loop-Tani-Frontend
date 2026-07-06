const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary">
        <span className="text-xs text-white">🤖</span>
      </div>
      <div className="flex items-center gap-2 rounded-2xl rounded-tl-md bg-secondary/20 px-4 py-3">
        <div className="flex gap-1">
          <span className="h-2 w-2 animate-bounce rounded-full bg-primary/60 [animation-delay:0ms]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-primary/60 [animation-delay:150ms]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-primary/60 [animation-delay:300ms]" />
        </div>
        <span className="text-xs text-muted-foreground">
          Loopi sedang mengetik...
        </span>
      </div>
    </div>
  );
};

export default TypingIndicator;
