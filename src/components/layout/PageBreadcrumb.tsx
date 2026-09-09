import { Link } from "@/lib/router";
import { cn } from "@/lib/utils";

export type PageBreadcrumbItem = {
  name: string;
  /** Omit on the current page so it is not a link. */
  path?: string;
};

type PageBreadcrumbProps = {
  items: PageBreadcrumbItem[];
  /** Photo / dark heroes use onDark. */
  tone?: "onLight" | "onDark";
  className?: string;
};

/**
 * The current page carries the emphasis so the section is readable at a glance;
 * ancestors stay secondary but keep their link affordance.
 */
const TONE = {
  onLight: {
    sep: "text-foreground/35",
    trail: "text-foreground/50 hover:text-foreground",
    current: "text-foreground",
  },
  onDark: {
    sep: "text-white/40",
    trail: "text-white/55 hover:text-white",
    current: "text-white",
  },
} as const;

export function PageBreadcrumb({
  items,
  tone = "onLight",
  className,
}: PageBreadcrumbProps) {
  const crumbs = items.filter((item) => item.name?.trim());
  if (crumbs.length === 0) return null;

  const colors = TONE[tone];

  return (
    <nav aria-label="breadcrumb" className={cn("page-breadcrumb", className)}>
      <ol className="page-breadcrumb__list">
        {crumbs.map((item, index) => {
          const isLast = index === crumbs.length - 1;
          const labelClass = isLast
            ? cn("page-breadcrumb__current", colors.current)
            : cn("page-breadcrumb__trail", colors.trail);

          return (
            <li key={`${item.path ?? ""}-${item.name}-${index}`} className="page-breadcrumb__item">
              {index > 0 ? (
                <span className={cn("page-breadcrumb__sep", colors.sep)} aria-hidden="true">
                  ›
                </span>
              ) : null}
              {isLast || !item.path ? (
                <span className={labelClass} {...(isLast ? { "aria-current": "page" as const } : {})}>
                  {item.name}
                </span>
              ) : (
                <Link to={item.path} className={cn(labelClass, "transition-colors")}>
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
