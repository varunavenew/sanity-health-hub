"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { scrollToHashId } from "@/lib/navigation/scroll-to-hash";

export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    if (hash) {
      if ("scrollRestoration" in history) {
        history.scrollRestoration = "manual";
      }
      return scrollToHashId(hash);
    }
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  return null;
}
