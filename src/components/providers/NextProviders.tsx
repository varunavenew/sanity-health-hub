"use client";

import { useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AccessGate } from "@/components/AccessGate";
import { ScrollToTop } from "@/components/navigation/ScrollToTop";
import { LocaleSync } from "@/components/i18n/LocaleSync";
import "@/i18n/config";

export function NextProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LocaleSync />
        <ScrollToTop />
        <Toaster />
        <Sonner />
        <AccessGate>{children}</AccessGate>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
