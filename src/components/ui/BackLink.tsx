import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/lib/router";
import { cn } from "@/lib/utils";

type BackLinkProps = {
  to: string;
  children: ReactNode;
  tone?: "default" | "onImage";
  className?: string;
};

export function BackLink({ to, children, tone = "default", className }: BackLinkProps) {
  return (
    <Link
      to={to}
      className={cn(
        "inline-flex items-center gap-1.5 text-xs transition-colors",
        tone === "onImage"
          ? "text-white/85 hover:text-white"
          : "text-muted-foreground hover:text-foreground",
        className,
      )}
    >
      <ArrowLeft className="h-3 w-3" aria-hidden="true" />
      {children}
    </Link>
  );
}
