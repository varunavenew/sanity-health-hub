import { cn } from "@/lib/utils";

type GeoAnswerSnippetProps = {
  text?: string | null;
  className?: string;
};

/** Visible direct-answer block for GEO — sourced from Sanity \`geoSummary\`. */
export function GeoAnswerSnippet({ text, className }: GeoAnswerSnippetProps) {
  const value = typeof text === "string" ? text.trim() : "";
  if (!value) return null;

  return (
    <p
      className={cn(
        "text-base md:text-lg text-foreground/85 leading-relaxed font-light",
        "border-l-2 border-brand-dark/25 pl-4 md:pl-5",
        className,
      )}
    >
      {value}
    </p>
  );
}
