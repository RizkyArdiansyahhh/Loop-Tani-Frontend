"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { queryConfig } from "@/lib/react-query";
import { UnauthorizedModal } from "@/components/shared/unauthorized-modal";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({ defaultOptions: queryConfig }));

  return (
    <QueryClientProvider client={queryClient}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange={false}
      >
        {children}
        <UnauthorizedModal />
      </NextThemesProvider>
    </QueryClientProvider>
  );
}
