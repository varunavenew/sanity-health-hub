"use client";

import { useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AccessGate } from "@/components/AccessGate";
import { ScrollToTop } from "@/components/navigation/ScrollToTop";
import { LocaleSync } from "@/components/i18n/LocaleSync";
import type { AppLocale } from "@/lib/i18n/routing";
import { appLocaleToI18n, syncI18nLanguage } from "@/lib/i18n/sync-language";
import "@/i18n/config";

const accessGateEnabled = process.env.NEXT_PUBLIC_ENABLE_ACCESS_GATE === "true";

export function NextProviders({
  children,
  locale,
}: {
  children: ReactNode;
  locale: AppLocale;
}) {
  syncI18nLanguage(appLocaleToI18n(locale));

  const [queryClient] = useState(() => new QueryClient());

  const content = accessGateEnabled ? (
    <AccessGate>{children}</AccessGate>
  ) : (
    children
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LocaleSync />
        <ScrollToTop />
        <Toaster />
        <Sonner />
        {content}
      </TooltipProvider>
    </QueryClientProvider>
  );
}
