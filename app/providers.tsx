// app/providers.tsx
"use client";
import { Spinner } from "@/components/ui/spinner";
import { ThemeProvider } from "@/components/ui/theme/theme-provider";
import { Toaster } from "@/components/ui/toast/toaster";
import { env } from "@/config/env";
import "@/config/i18n";
import i18n from "@/config/i18n";
import { queryConfig } from "@/config/react-query";
import { useUser } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import * as React from "react";

function PageLoader() {
  return (
    <div
      className={cn(
        "fixed inset-0 flex items-center justify-center bg-background ",
      )}
    >
      <Spinner size="sm" />
    </div>
  );
}

/**
 * Combined gate: waits for i18n + initial user fetch.
 * Lives INSIDE the providers so useUser works.
 */
function AppShell({ children }: { children: React.ReactNode }) {
  const [i18nReady, setI18nReady] = React.useState(i18n.isInitialized);
  const { isFetched, isLoading } = useUser();

  React.useEffect(() => {
    const applyLang = (lng: string) => {
      document.documentElement.lang = lng;
      document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
    };
    const markReady = () => {
      applyLang(i18n.language);
      setI18nReady(true);
    };
    if (i18n.isInitialized) markReady();
    else i18n.on("initialized", markReady);
    i18n.on("languageChanged", applyLang);
    return () => {
      i18n.off("initialized", markReady);
      i18n.off("languageChanged", applyLang);
    };
  }, []);

  const ready = i18nReady && (isFetched || !isLoading);

  if (!ready) return <PageLoader />;
  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(
    () => new QueryClient({ defaultOptions: queryConfig }),
  );
  const isDev = env.logging.mode === "development";

  return (
    <React.Suspense fallback={<PageLoader />}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        storageKey="theme"
        enableSystem
        disableTransitionOnChange
      >
        <QueryClientProvider client={queryClient}>
          <Toaster />
          <AppShell>{children}</AppShell>
          {isDev && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
      </ThemeProvider>
    </React.Suspense>
  );
}
