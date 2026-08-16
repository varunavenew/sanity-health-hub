import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "@/lib/router";
import { cn } from "@/lib/utils";

type ReadMoreLinkProps = {
  children: ReactNode;
  to?: string;
  tone?: "standalone" | "onImage";
  className?: string;
};

export function ReadMoreLink({
  children,
  to,
  tone = "standalone",
  className,
}: ReadMoreLinkProps) {
  const classes = cn(
    "inline-flex items-center gap-1 text-xs font-medium transition-all group-hover:gap-2",
    tone === "onImage" ? "text-white/90" : "text-brand-dark hover:text-brand-dark/80",
    className,
  );

  const content = (
    <>
      {children}
      <ArrowRight className="w-3.5 h-3.5" />
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes}>
        {content}
      </Link>
    );
  }

  return <span className={classes}>{content}</span>;
}
