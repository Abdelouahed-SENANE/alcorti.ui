"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import * as React from "react";

import { Spinner } from "@/components/ui/spinner";
import { ThemeProvider } from "@/components/ui/theme/provider";
import { Toaster } from "@/components/ui/toast/toaster";
import { env } from "@/config/env";
import { queryConfig } from "@/config/react-query";
import { AuthLoader } from "@/lib/auth";

type ProvidersProps = {
  children: React.ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: queryConfig,
      }),
  );

  const isDev = env.logging.mode === "development";

  return (
    <ThemeProvider defaultTheme="dark" storageKey="theme">
      <QueryClientProvider client={queryClient}>
        <Toaster />
        <AuthLoader
          renderLoading={() => (
            <div className="flex h-screen w-screen items-center justify-center">
              <Spinner size="base" />
            </div>
          )}
        >
          {children}
        </AuthLoader>
        {isDev ? <ReactQueryDevtools initialIsOpen={false} /> : null}
      </QueryClientProvider>
    </ThemeProvider>
  );
}
