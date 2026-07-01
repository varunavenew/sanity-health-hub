"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { RefObject } from "react";

type ScrollArrowsProps = {
  scrollRef: RefObject<HTMLDivElement | null>;
  className?: string;
};

export function ScrollArrows({ scrollRef, className = "" }: ScrollArrowsProps) {
  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -280 : 280,
      behavior: "smooth",
    });
  };

  return (
    <div className={`md:hidden flex justify-center gap-3 mt-4 ${className}`}>
      <button
        type="button"
        onClick={() => scroll("left")}
        aria-label="Scroll venstre"
        className="w-10 h-10 rounded-full border border-foreground/20 flex items-center justify-center hover:bg-secondary transition-colors text-foreground"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={() => scroll("right")}
        aria-label="Scroll høyre"
        className="w-10 h-10 rounded-full border border-foreground/20 flex items-center justify-center hover:bg-secondary transition-colors text-foreground"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
