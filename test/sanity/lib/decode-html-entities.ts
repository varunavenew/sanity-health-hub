/**
 * Decode literal HTML entities stored in Sanity EN strings.
 * Handles &#10; (newline), &#39;, &quot;, &apos;, &hellip;, etc.
 */
const NAMED_ENTITIES: Record<string, string> = {
  quot: '"',
  apos: "'",
  amp: "&",
  lt: "<",
  gt: ">",
  nbsp: " ",
  hellip: "…",
};

const ENTITY_RE =
  /&#(\d+);|&#x([0-9a-f]+);|&([a-z]+);/gi;

export function containsHtmlEntities(text: string): boolean {
  ENTITY_RE.lastIndex = 0;
  return ENTITY_RE.test(text);
}

export function decodeHtmlEntities(input: string): string {
  if (!input || !containsHtmlEntities(input)) return input;

  return input.replace(ENTITY_RE, (match, dec, hex, named) => {
    if (dec != null) {
      const code = Number(dec);
      return Number.isFinite(code) ? String.fromCodePoint(code) : match;
    }
    if (hex != null) {
      const code = parseInt(hex, 16);
      return Number.isFinite(code) ? String.fromCodePoint(code) : match;
    }
    if (named != null) {
      const lower = named.toLowerCase();
      return NAMED_ENTITIES[lower] ?? match;
    }
    return match;
  });
}
