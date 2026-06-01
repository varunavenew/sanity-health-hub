"use client";

import { HydrationBoundary, type DehydratedState } from "@tanstack/react-query";
import type { ReactNode } from "react";

export function TreatmentHydration({
  state,
  children,
}: {
  state: DehydratedState | null;
  children: ReactNode;
}) {
  if (!state) return <>{children}</>;
  return <HydrationBoundary state={state}>{children}</HydrationBoundary>;
}
