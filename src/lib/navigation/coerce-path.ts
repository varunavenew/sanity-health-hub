/** Drop legacy `/behandlinger` prefix — public URLs use Sanity slugs only. */
export function stripBehandlingerPrefix(path: string): string {
  const trimmed = path.trim();
  if (!trimmed) return trimmed;
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("mailto:") ||
    trimmed.startsWith("tel:")
  ) {
    return trimmed;
  }

  const hashIdx = trimmed.indexOf("#");
  const hash = hashIdx >= 0 ? trimmed.slice(hashIdx) : "";
  const withoutHash = hashIdx >= 0 ? trimmed.slice(0, hashIdx) : trimmed;
  const qIdx = withoutHash.indexOf("?");
  const query = qIdx >= 0 ? withoutHash.slice(qIdx) : "";
  let base = (qIdx >= 0 ? withoutHash.slice(0, qIdx) : withoutHash).trim();
  if (!base) return `${query}${hash}` || "/";
  if (!base.startsWith("/")) base = `/${base}`;

  if (base === "/behandlinger") base = "/";
  else if (base.startsWith("/behandlinger/")) {
    base = base.slice("/behandlinger".length) || "/";
  }

  return `${base}${query}${hash}`;
}

/** Normalize Sanity path values (string, i18n array, or unknown) to a route string. */
export function coercePath(value: unknown, locale: "no" | "en" = "no"): string {
  const raw = extractPath(value, locale);
  return raw ? stripBehandlingerPrefix(raw) : "";
}

function extractPath(value: unknown, locale: "no" | "en"): string {
  if (typeof value === "string") return value.trim();
  if (!value) return "";

  if (Array.isArray(value)) {
    const entry =
      value.find(
        (row) =>
          row &&
          typeof row === "object" &&
          ((row as { language?: string }).language === locale ||
            (row as { _key?: string })._key === locale),
      ) ??
      value.find(
        (row) =>
          row &&
          typeof row === "object" &&
          ((row as { language?: string }).language === "no" ||
            (row as { _key?: string })._key === "no"),
      ) ??
      value[0];

    if (entry && typeof entry === "object") {
      const inner = (entry as { value?: unknown }).value;
      if (typeof inner === "string") return inner.trim();
    }
    return "";
  }

  if (typeof value === "object") {
    const inner = (value as { value?: unknown }).value;
    if (typeof inner === "string") return inner.trim();
  }

  return "";
}
