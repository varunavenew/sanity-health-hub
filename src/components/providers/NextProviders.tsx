"use client";

import { useEffect, useState, type ReactNode } from "react";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AccessGate } from "@/components/AccessGate";
import { ScrollToTop } from "@/components/navigation/ScrollToTop";
import { LocaleSync } from "@/components/i18n/LocaleSync";
import { CmsRouteIndexProvider } from "@/components/providers/CmsRouteIndexProvider";
import type { AppLocale } from "@/lib/i18n/routing";
import type { CmsRouteIndex } from "@/lib/routing/cms-route-types";
import { appLocaleToI18n, syncI18nLanguage } from "@/lib/i18n/sync-language";
import "@/i18n/config";

const accessGateEnabled = process.env.NEXT_PUBLIC_ENABLE_ACCESS_GATE === "true";

export function NextProviders({
  children,
  locale,
  cmsRouteIndex,
}: {
  children: ReactNode;
  locale: AppLocale;
  cmsRouteIndex?: CmsRouteIndex;
}) {
  const i18nCode = appLocaleToI18n(locale);
  // Sync before first paint so Sanity hooks and UI share the route locale.
  syncI18nLanguage(i18nCode);

  useEffect(() => {
    syncI18nLanguage(i18nCode);
  }, [i18nCode]);

  const [queryClient] = useState(() => new QueryClient());

  const content = accessGateEnabled ? (
    <AccessGate>{children}</AccessGate>
  ) : (
    children
  );

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <CmsRouteIndexProvider initialIndex={cmsRouteIndex}>
          <TooltipProvider>
            <LocaleSync />
            <ScrollToTop />
            <Toaster />
            <Sonner />
            {content}
          </TooltipProvider>
        </CmsRouteIndexProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}
