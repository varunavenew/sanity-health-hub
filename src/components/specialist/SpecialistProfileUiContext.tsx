"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useSpecialistsListingPage } from "@/hooks/useSanity";
import {
  type SpecialistProfileUi,
  withProfileUiNames,
} from "@/lib/sanity/specialist-profile-ui";

type ResolvedSpecialistProfileUi = ReturnType<typeof withProfileUiNames>;

const SpecialistProfileUiContext = createContext<ResolvedSpecialistProfileUi | null>(null);

export function SpecialistProfileUiProvider({
  firstName,
  profileUi,
  children,
}: {
  firstName: string;
  profileUi: SpecialistProfileUi;
  children: ReactNode;
}) {
  const value = useMemo(
    () => withProfileUiNames(profileUi, firstName),
    [profileUi, firstName],
  );

  return (
    <SpecialistProfileUiContext.Provider value={value}>
      {children}
    </SpecialistProfileUiContext.Provider>
  );
}

export function useSpecialistProfileUi(): ResolvedSpecialistProfileUi {
  const value = useContext(SpecialistProfileUiContext);
  if (!value) {
    throw new Error("useSpecialistProfileUi must be used within SpecialistProfileUiProvider");
  }
  return value;
}

export function useOptionalSpecialistProfileUi(): SpecialistProfileUi | null {
  const { data: listingPage } = useSpecialistsListingPage();
  return listingPage?.profileUi ?? null;
}
