import { useState } from "react";
import { Link } from "react-router-dom";

export type TagItem = string | { label: string; href?: string };

interface TagListProps {
  tags: TagItem[];
  initialVisible?: number;
  className?: string;
}

/**
 * Shows a compact wrap of pill-shaped tags. Tags can be plain strings or
 * `{ label, href }` objects — those with an href render as links.
 * If the list exceeds `initialVisible`, a "+N" pill toggles the rest.
 */
export const TagList = ({ tags, initialVisible = 3, className = "" }: TagListProps) => {
  const [expanded, setExpanded] = useState(false);

  if (!tags || tags.length === 0) return null;

  const hasOverflow = tags.length > initialVisible;
  const visibleTags = expanded || !hasOverflow ? tags : tags.slice(0, initialVisible);
  const hiddenCount = tags.length - initialVisible;

  const pillClass =
    "text-xs font-light text-foreground/70 border border-foreground/15 px-2 py-1 rounded-2xl md:rounded-full";
  const linkPillClass =
    "text-xs font-normal text-foreground border border-foreground/30 px-2 py-1 rounded-2xl md:rounded-full bg-foreground/[0.02] hover:bg-foreground hover:text-background hover:border-foreground transition-colors cursor-pointer";

  const normalize = (t: TagItem) =>
    typeof t === "string" ? { label: t, href: undefined as string | undefined } : t;

  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {visibleTags.map((t) => {
        const { label, href } = normalize(t);
        if (href) {
          return (
            <Link
              key={label}
              to={href}
              onClick={(e) => e.stopPropagation()}
              className={linkPillClass}
            >
              {label}
            </Link>
          );
        }
        return (
          <span key={label} className={pillClass}>
            {label}
          </span>
        );
      })}
      {hasOverflow && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setExpanded((v) => !v);
          }}
          className={`${pillClass} hover:bg-foreground/5 hover:border-foreground/30 transition-colors cursor-pointer`}
          aria-label={expanded ? "Vis færre" : `Vis ${hiddenCount} til`}
        >
          {expanded ? "− vis færre" : `+${hiddenCount}`}
        </button>
      )}
    </div>
  );
};
