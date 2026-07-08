import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useEditable } from "@/lib/editable/EditableContext";
import { cn } from "@/lib/utils";

interface EditableProps {
  /** Unique stable id for this field within its page. e.g. "hero.title" */
  field: string;
  /** Fallback text shown when no override exists. */
  children: string;
  /** DOM element to render as. Defaults to <span>. */
  as?: ElementType;
  /** Optional page path override (defaults to current route). */
  pagePath?: string;
  /** Extra classes forwarded to the rendered element. */
  className?: string;
  /** Multi-line editing (Enter inserts newline instead of saving). */
  multiline?: boolean;
  /** Custom aria-label for screen readers when in edit mode. */
  ariaLabel?: string;
}

/**
 * Editable — inline content-override primitive.
 *
 * Renders `children` (the fallback) or the stored override text.
 * When an editor is logged in and edit mode is ON, the element gets a thin
 * outline; clicking it enables contentEditable. Blur or Enter saves to the
 * `content_overrides` table. Escape cancels. Text-only (no rich formatting)
 * to keep round-tripping predictable.
 */
export const Editable = ({
  field,
  children,
  as: Tag = "span",
  pagePath,
  className,
  multiline = false,
  ariaLabel,
}: EditableProps) => {
  const { editMode, getOverride, saveOverride, resetOverride } = useEditable();
  const location = useLocation();
  const path = pagePath ?? location.pathname;
  const ref = useRef<HTMLElement | null>(null);
  const [saving, setSaving] = useState(false);

  const override = getOverride(path, field);
  const value = override ?? children;

  // Keep DOM in sync with external value (realtime updates from other clients)
  // when we're NOT actively editing.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (document.activeElement === el) return;
    if (el.textContent !== value) {
      el.textContent = value;
    }
  }, [value]);

  const handleBlur = async (e: React.FocusEvent<HTMLElement>) => {
    if (!editMode) return;
    const next = (e.currentTarget.textContent ?? "").replace(/\u00A0/g, " ").trim();
    if (next === (override ?? children)) return;
    try {
      setSaving(true);
      if (next.length === 0) {
        await resetOverride(path, field);
        toast.success("Tilbakestilt til original");
      } else {
        await saveOverride(path, field, next);
        toast.success("Lagret");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Kunne ikke lagre";
      toast.error(message);
      if (ref.current) ref.current.textContent = value;
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (!editMode) return;
    if (e.key === "Enter" && !multiline) {
      e.preventDefault();
      (e.currentTarget as HTMLElement).blur();
    } else if (e.key === "Escape") {
      e.preventDefault();
      if (ref.current) ref.current.textContent = value;
      (e.currentTarget as HTMLElement).blur();
    }
  };

  const Element = Tag as ElementType;

  if (!editMode) {
    return <Element className={className}>{value}</Element>;
  }

  return (
    <Element
      ref={ref as never}
      className={cn(
        "relative outline-none transition-shadow rounded-sm",
        "ring-1 ring-brand-dark/25 hover:ring-brand-dark/60",
        "focus:ring-2 focus:ring-brand-dark focus:bg-brand-light/60",
        "px-1 -mx-1 cursor-text",
        saving && "opacity-70",
        className,
      )}
      contentEditable
      suppressContentEditableWarning
      spellCheck
      role="textbox"
      aria-label={ariaLabel ?? `Rediger tekst: ${field}`}
      data-editable-field={field}
      data-editable-path={path}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    >
      {value}
    </Element>
  );
};
