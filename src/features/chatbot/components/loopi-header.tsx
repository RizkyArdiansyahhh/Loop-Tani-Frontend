import LoopiAvatar from "./loopi-avatar";

const LoopiHeader = () => {
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

      <div className="hidden sm:block">
        <LoopiAvatar size="lg" />
      </div>
    </div>
  );
};

export default LoopiHeader;
