/** Normalize Sanity path values (string, i18n array, or unknown) to a route string. */
export function coercePath(value: unknown, locale: "no" | "en" = "no"): string {
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
      const raw = (entry as { value?: unknown }).value;
      if (typeof raw === "string") return raw.trim();
    }
    return "";
  }

  if (typeof value === "object") {
    const raw = (value as { value?: unknown }).value;
    if (typeof raw === "string") return raw.trim();
  }

  return "";
}
