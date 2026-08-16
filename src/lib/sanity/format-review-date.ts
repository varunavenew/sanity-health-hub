/**
 * Format Sanity review `date` (ISO `YYYY-MM-DD` or free text) for display.
 * Google-style relative labels: "7 måneder siden" / "7 months ago".
 */
export function formatReviewDateLabel(
  value: unknown,
  lang: "no" | "en" = "no",
): string {
  if (value == null) return "";
  if (typeof value !== "string") {
    if (value instanceof Date && !Number.isNaN(value.getTime())) {
      return relativeFromDate(value, lang);
    }
    return "";
  }

  const trimmed = value.trim();
  if (!trimmed) return "";

  // Already a human label (seed / legacy)
  if (!/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
    return trimmed;
  }

  const parsed = new Date(`${trimmed.slice(0, 10)}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return trimmed;
  return relativeFromDate(parsed, lang);
}

function relativeFromDate(date: Date, lang: "no" | "en"): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  if (!Number.isFinite(diffMs)) return "";

  const diffDays = Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24)));

  if (lang === "en") {
    if (diffDays < 7) {
      if (diffDays <= 1) return "1 day ago";
      return `${diffDays} days ago`;
    }
    const weeks = Math.round(diffDays / 7);
    if (weeks < 4) {
      return weeks <= 1 ? "1 week ago" : `${weeks} weeks ago`;
    }
    const months = Math.max(1, Math.round(diffDays / 30.44));
    if (months < 18) {
      return months <= 1 ? "1 month ago" : `${months} months ago`;
    }
    const years = Math.max(1, Math.round(diffDays / 365.25));
    return years <= 1 ? "1 year ago" : `${years} years ago`;
  }

  if (diffDays < 7) {
    if (diffDays <= 1) return "1 dag siden";
    return `${diffDays} dager siden`;
  }
  const weeks = Math.round(diffDays / 7);
  if (weeks < 4) {
    return weeks <= 1 ? "1 uke siden" : `${weeks} uker siden`;
  }
  const months = Math.max(1, Math.round(diffDays / 30.44));
  if (months < 18) {
    return months <= 1 ? "1 måned siden" : `${months} måneder siden`;
  }
  const years = Math.max(1, Math.round(diffDays / 365.25));
  return years <= 1 ? "1 år siden" : `${years} år siden`;
}
