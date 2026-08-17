/**
 * Dual-read Booking CTA resolution: prefer CTA Collection body when usable,
 * otherwise fall back to page-section legacy inline fields.
 * Empty result → callers treat the band as empty.
 * Treatment layout may still render a hardcoded BookingCTA when no usable band exists
 * (see docs/BOOKING_CTA_FALLBACK_AUDIT.md).
 */

import type { BookingCtaQuickInfoItem } from "@/lib/sanity/page-sections";

export type ResolvedBookingCtaBody = {
  title?: string;
  subtitle?: string;
  primaryLabel?: string;
  primaryPath?: string;
  bookingCategory?: { categoryId?: string };
  showSecondaryButton?: boolean;
  secondaryLabel?: string;
  secondaryPath?: string;
  quickInfoItems?: BookingCtaQuickInfoItem[];
  backgroundColor?: string;
  textColor?: string;
  /** Lime (default) | white | custom — see primaryButtonColor when custom. */
  primaryButtonStyle?: "accent" | "white" | "custom";
  /** Optional CSS color when primaryButtonStyle is custom. */
  primaryButtonColor?: string;
};

function str(value: unknown): string {
  if (typeof value === "string") return value;
  if (value == null) return "";
  return String(value);
}

function mapQuickInfoItems(value: unknown): BookingCtaQuickInfoItem[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value
    .map((row): BookingCtaQuickInfoItem | null => {
      if (!row || typeof row !== "object") return null;
      const item = row as Record<string, unknown>;
      const icon = item.icon === "shield" ? "shield" : "clock";
      const text = str(item.text);
      if (!text) return null;
      return { icon, text };
    })
    .filter((x): x is BookingCtaQuickInfoItem => x != null);
}

/** Map a GROQ-localized collection or inline section body to Booking CTA fields. */
export function mapBookingCtaBody(source: unknown): ResolvedBookingCtaBody {
  if (!source || typeof source !== "object") return {};
  const row = source as Record<string, unknown>;

  const bookingCategory =
    row.bookingCategory && typeof row.bookingCategory === "object"
      ? (row.bookingCategory as { categoryId?: string })
      : undefined;

  return {
    title: str(row.title) || undefined,
    // Legacy patches used description / primaryCtaLabel — accept both.
    subtitle: str(row.subtitle) || str(row.description) || undefined,
    primaryLabel: str(row.primaryLabel) || str(row.primaryCtaLabel) || undefined,
    primaryPath: str(row.primaryPath) || undefined,
    bookingCategory,
    showSecondaryButton: row.showSecondaryButton !== false,
    secondaryLabel: str(row.secondaryLabel) || undefined,
    secondaryPath: str(row.secondaryPath) || undefined,
    quickInfoItems: mapQuickInfoItems(row.quickInfoItems),
    backgroundColor: str(row.backgroundColor).trim() || undefined,
    textColor: str(row.textColor).trim() || undefined,
    primaryButtonStyle:
      row.primaryButtonStyle === "white" || row.primaryButtonStyle === "custom"
        ? row.primaryButtonStyle
        : row.primaryButtonStyle === "accent"
          ? "accent"
          : undefined,
    primaryButtonColor: str(row.primaryButtonColor).trim() || undefined,
  };
}

/**
 * Collection is usable when it carries any content the Booking CTA can render
 * (beyond an empty shell that would only trigger FE defaults).
 * Empty shells fall through so legacy inline / FE defaults still win.
 */
export function isUsableBookingCtaBody(body: ResolvedBookingCtaBody): boolean {
  return Boolean(
    body.title?.trim() ||
      body.subtitle?.trim() ||
      body.primaryLabel?.trim() ||
      body.primaryPath?.trim() ||
      body.secondaryLabel?.trim() ||
      body.secondaryPath?.trim() ||
      body.bookingCategory?.categoryId ||
      (body.quickInfoItems && body.quickInfoItems.length > 0),
  );
}

/**
 * Prefer CTA Collection when it has usable content; otherwise legacy inline.
 * Callers keep band-only fields (image / variant / _key) from the page section.
 */
export function resolveBookingCtaFromCollection(
  ctaCollection: unknown,
  legacyInline: unknown,
): ResolvedBookingCtaBody {
  const fromCollection = mapBookingCtaBody(ctaCollection)
  const fromInline = mapBookingCtaBody(legacyInline)
  if (isUsableBookingCtaBody(fromCollection)) {
    if (!fromCollection.quickInfoItems?.length && fromInline.quickInfoItems?.length) {
      return { ...fromCollection, quickInfoItems: fromInline.quickInfoItems }
    }
    return fromCollection
  }
  return fromInline
}

/**
 * True when `pageSections` already has a usable Booking CTA band.
 * Used to suppress legacy / hardcoded booking CTAs (no duplicates).
 */
export function pageSectionsHaveUsableBookingCta(sections: unknown): boolean {
  if (!Array.isArray(sections)) return false
  return sections.some((row) => {
    if (!row || typeof row !== "object") return false
    const band = row as {
      _type?: string
      ctaCollection?: {_ref?: string} | ResolvedBookingCtaBody | null
    }
    if (band._type !== "pageSectionBookingCta") return false
    if (isUsableBookingCtaBody(mapBookingCtaBody(band))) return true
    const collection = band.ctaCollection
    if (collection && typeof collection === "object" && "_ref" in collection) {
      return typeof collection._ref === "string" && collection._ref.length > 0
    }
    // Normalized collection body (no _ref) already checked via mapBookingCtaBody(band)
    return isUsableBookingCtaBody(mapBookingCtaBody(collection))
  })
}

