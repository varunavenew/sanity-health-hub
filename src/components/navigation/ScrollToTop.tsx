"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

if (typeof window !== "undefined") {
  window.history.scrollRestoration = "manual";
}

function scrollWindowToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
}

export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hash = window.location.hash;
    if (hash) {
      const id = hash.replace(/^#/, "");
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }

    scrollWindowToTop();
    requestAnimationFrame(scrollWindowToTop);
    const immediateTimer = window.setTimeout(scrollWindowToTop, 0);
    const lateTimer = window.setTimeout(scrollWindowToTop, 100);

    const onPageShow = () => {
      if (window.location.hash) return;
      scrollWindowToTop();
    };
    window.addEventListener("pageshow", onPageShow);

    return () => {
      window.clearTimeout(immediateTimer);
      window.clearTimeout(lateTimer);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, [pathname]);

  return null;
}
