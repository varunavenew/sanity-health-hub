import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type MediaChipProps = {
  children: ReactNode;
  tone?: "default" | "light";
  className?: string;
};

export function MediaChip({ children, tone = "default", className }: MediaChipProps) {
  return (
    <span
      className={cn(
        "inline-block text-xs px-2.5 py-0.5 rounded-full backdrop-blur-sm",
        tone === "light"
          ? "bg-white/15 backdrop-blur-md text-white"
          : "bg-brand-dark/80 text-white",
        className,
      )}
    >
      {children}
    </span>
  );
}
