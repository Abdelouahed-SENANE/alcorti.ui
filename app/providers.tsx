"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import * as React from "react";

import { Spinner } from "@/components/ui/spinner";
import { ThemeProvider } from "@/components/ui/theme/theme-provider";
import { Toaster } from "@/components/ui/toast/toaster";
import { env } from "@/config/env";
import "@/config/i18n";
import { queryConfig } from "@/config/react-query";
import { useUser } from "@/lib/auth";

const [queryClient] = [new QueryClient({ defaultOptions: queryConfig })];

// Acts as an isomorphic auth interceptor, populating cache universally
function AuthInitializer({ children }: { children: React.ReactNode }) {
  useUser();
  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  const isDev = env.logging.mode === "development";

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="theme">
      <QueryClientProvider client={queryClient}>
        <Toaster />
        {mounted ? (
          <AuthInitializer>{children}</AuthInitializer>
        ) : (
          <div className="h-screen w-screen flex items-center justify-center">
            <Spinner size="sm" />
          </div>
        )}
        {isDev && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </ThemeProvider>
  );
}
