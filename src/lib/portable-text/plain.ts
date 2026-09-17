import type { PortableTextBlock } from "@portabletext/types";

/** True when GROQ returned Portable Text blocks (not a plain string). */
export function isPortableTextBlocks(value: unknown): value is PortableTextBlock[] {
  if (!Array.isArray(value) || value.length === 0) return false;
  const first = value[0];
  return Boolean(first && typeof first === "object" && "_type" in first);
}

export function portableTextToPlain(value: unknown): string {
  if (typeof value === "string") return value;
  if (!Array.isArray(value)) return "";
  return value
    .map((block) => {
      if (!block || typeof block !== "object") return "";
      const children = (block as { children?: { text?: string }[] }).children;
      if (!Array.isArray(children)) return "";
      return children.map((child) => child.text || "").join("");
    })
    .join("\n")
    .trim();
}
