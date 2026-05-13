import { useState } from "react";

interface TagListProps {
  tags: string[];
  initialVisible?: number;
  className?: string;
}

/**
 * Shows a compact wrap of pill-shaped tags. If the list exceeds
 * `initialVisible`, a "+N" pill toggles the rest in/out.
 */
export const TagList = ({ tags, initialVisible = 3, className = "" }: TagListProps) => {
  const [expanded, setExpanded] = useState(false);

  if (!tags || tags.length === 0) return null;

  const hasOverflow = tags.length > initialVisible;
  const visibleTags = expanded || !hasOverflow ? tags : tags.slice(0, initialVisible);
  const hiddenCount = tags.length - initialVisible;

  const pillClass =
    "text-[11px] font-light text-foreground/70 border border-foreground/15 px-2 py-1 rounded-full";

  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {visibleTags.map((tag) => (
        <span key={tag} className={pillClass}>
          {tag}
        </span>
      ))}
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
